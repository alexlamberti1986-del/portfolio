/**
 * FREIRAUM Weltwechsel — Pinsel v3
 * Breite Hand-Wischstriche, ein Verlauf nach dem anderen (Leinwand wisch).
 */
(function () {
  "use strict";

  var PALETTE = [
    [188, 77, 255],
    [255, 196, 106],
    [255, 87, 190],
    [255, 155, 55],
    [155, 107, 255],
    [255, 47, 146],
  ];

  var STROKE_IMG = null;
  var STROKE_SOFT = null;

  function rgba(rgb, a) {
    return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + a + ")";
  }

  function pickColor(i) {
    return PALETTE[i % PALETTE.length];
  }

  function seededRand(seed) {
    var x = Math.sin(seed * 127.1 + seed * seed * 0.017) * 43758.5453;
    return x - Math.floor(x);
  }

  function easeInOutSine(t) {
    return 0.5 - Math.cos(Math.PI * t) / 2;
  }

  function quadPoint(x1, y1, qx, qy, x2, y2, t) {
    var u = 1 - t;
    return {
      x: u * u * x1 + 2 * u * t * qx + t * t * x2,
      y: u * u * y1 + 2 * u * t * qy + t * t * y2,
    };
  }

  function quadTangent(x1, y1, qx, qy, x2, y2, t) {
    var u = 1 - t;
    return {
      x: 2 * u * (qx - x1) + 2 * t * (x2 - qx),
      y: 2 * u * (qy - y1) + 2 * t * (y2 - qy),
    };
  }

  function makeStrokeRibbon(w, h, seed, rough) {
    var c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    var g = c.getContext("2d");
    var i;
    g.clearRect(0, 0, w, h);

    g.save();
    g.filter = "blur(" + (rough ? 10 : 14) + "px)";
    g.fillStyle = "rgba(255,255,255,0.95)";
    g.beginPath();
    g.moveTo(0, h * 0.5);
    g.bezierCurveTo(w * 0.12, h * 0.28, w * 0.25, h * 0.72, w * 0.4, h * 0.48);
    g.bezierCurveTo(w * 0.55, h * 0.26, w * 0.7, h * 0.7, w * 0.85, h * 0.46);
    g.lineTo(w, h * 0.54);
    g.lineTo(w, h * 0.62);
    g.bezierCurveTo(w * 0.72, h * 0.78, w * 0.5, h * 0.3, w * 0.32, h * 0.6);
    g.bezierCurveTo(w * 0.16, h * 0.8, w * 0.06, h * 0.38, 0, h * 0.56);
    g.closePath();
    g.fill();
    g.restore();

    for (i = 0; i < (rough ? 70 : 50); i++) {
      var t = i / 70;
      var x = t * w + (seededRand(seed + i) - 0.5) * w * 0.06;
      var y = h * 0.5 + (seededRand(seed + i * 2) - 0.5) * h * 0.62;
      var rx = 3 + seededRand(seed + i * 3) * (rough ? 18 : 12);
      var ry = 2 + seededRand(seed + i * 4) * (rough ? 10 : 7);
      g.fillStyle = "rgba(255,255,255," + (0.1 + seededRand(seed + i * 5) * 0.4) + ")";
      g.beginPath();
      g.ellipse(x, y, rx, ry, (seededRand(seed + i * 6) - 0.5) * 0.5, 0, Math.PI * 2);
      g.fill();
    }
    return c;
  }

  function tintImage(img, color) {
    var c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    var g = c.getContext("2d");
    g.drawImage(img, 0, 0);
    g.globalCompositeOperation = "source-in";
    g.fillStyle = rgba(color, 1);
    g.fillRect(0, 0, c.width, c.height);
    return c;
  }

  function loadStrokeAssets(cb) {
    if (STROKE_IMG && STROKE_SOFT) {
      cb();
      return;
    }
    STROKE_IMG = makeStrokeRibbon(960, 220, 17, false);
    STROKE_SOFT = makeStrokeRibbon(960, 220, 41, true);
    cb();
  }

  window.__wwsFreiraumBrushV3 = function startFreiraumBrushV3(overlay) {
    var canvas = overlay.querySelector(".welten-world-switch__canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    loadStrokeAssets(function () {
      runBrush(overlay, canvas, ctx);
    });
  };

  function runBrush(overlay, canvas, ctx) {
    var paintCanvas = document.createElement("canvas");
    var paintCtx = paintCanvas.getContext("2d");

    var w = 0;
    var h = 0;
    var cx = 0;
    var cy = 0;
    var mobile = false;
    var running = true;
    var startTime = performance.now();
    var lastFrame = startTime;
    var titleRevealed = false;
    var strokeU = [];
    var brushes = [];
    var tip = null;
    var tintCache = { hard: {}, soft: {} };
    var paintEndMs = 0;
    var titleAtMs = 0;
    var finalFillDone = false;

    var FT =
      window.WeltenWorldSwitchPreview && window.WeltenWorldSwitchPreview.getTimingForWorld
        ? window.WeltenWorldSwitchPreview.getTimingForWorld("freiraum")
        : { EFFECT_MS: 3600, TITLE_REVEAL_AT: 2600 };
    var totalMs = FT.EFFECT_MS || 3600;
    var revealMs = FT.TITLE_REVEAL_AT || 2600;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      paintCanvas.width = w;
      paintCanvas.height = h;
      cx = w * 0.5;
      cy = h * 0.46;
      mobile = w < 768;
      initBrushes();
      strokeU = [];
      finalFillDone = false;
      seedVeil();
    }

    function seedVeil() {
      var g = paintCtx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "rgba(12, 6, 18, 0.62)");
      g.addColorStop(0.5, "rgba(18, 8, 26, 0.55)");
      g.addColorStop(1, "rgba(10, 5, 16, 0.65)");
      paintCtx.fillStyle = g;
      paintCtx.fillRect(0, 0, w, h);
    }

    /* Drei breite Wischbahnen — decken den ganzen Screen ab */
    function initBrushes() {
      var passMs = mobile ? 780 : 920;
      var gapMs = 40;
      var brushW = Math.max(mobile ? w * 0.58 : w * 0.62, h * 0.46);
      var yBands = [0.17, 0.5, 0.83];
      var list = [];
      var r;

      for (r = 0; r < 3; r++) {
        var ltr = r % 2 === 0;
        var y = yBands[r];
        var wobble = (seededRand(r * 13.7) - 0.5) * 0.012;
        list.push({
          x1: ltr ? -0.22 : 1.22,
          y1: y + wobble,
          cx: 0.5,
          cy: y + wobble + (ltr ? -0.02 : 0.02),
          x2: ltr ? 1.22 : -0.22,
          y2: y + wobble * 0.5,
          color: r % PALETTE.length,
          width: brushW,
          delay: r * (passMs + gapMs),
          dur: passMs,
          pressure: 0.96 - r * 0.03,
          tilt: (seededRand(r * 5.3) - 0.5) * 0.05,
          index: r,
        });
      }

      brushes = list;
      paintEndMs = 2 * (passMs + gapMs) + passMs;
      titleAtMs = paintEndMs + 200;
    }

    function applyFinalFill() {
      if (finalFillDone) return;
      finalFillDone = true;
      paintCtx.save();
      paintCtx.globalCompositeOperation = "lighter";
      var g = paintCtx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, rgba(pickColor(0), 0.14));
      g.addColorStop(0.45, rgba(pickColor(2), 0.12));
      g.addColorStop(0.72, rgba(pickColor(4), 0.11));
      g.addColorStop(1, rgba(pickColor(1), 0.16));
      paintCtx.fillStyle = g;
      paintCtx.fillRect(0, 0, w, h);
      paintCtx.restore();
    }

    function pathPoint(b, u) {
      var p = quadPoint(b.x1 * w, b.y1 * h, b.cx * w, b.cy * h, b.x2 * w, b.y2 * h, u);
      var wob = Math.sin(u * Math.PI * 4.2 + b.index) * h * 0.006;
      return { x: p.x, y: p.y + wob };
    }

    function pathAngle(b, u) {
      var tan = quadTangent(b.x1 * w, b.y1 * h, b.cx * w, b.cy * h, b.x2 * w, b.y2 * h, Math.min(0.998, u));
      return Math.atan2(tan.y, tan.x) + b.tilt;
    }

    function drawBrushBand(b, uFrom, uTo, dissolve) {
      if (uTo <= uFrom + 0.0002) return null;

      var steps = Math.max(2, Math.ceil((uTo - uFrom) * (mobile ? 55 : 75)));
      var si;
      var lastPt = null;
      var color = pickColor(b.color);
      var baseW = b.width * b.pressure;

      if (!tintCache.hard[b.color]) tintCache.hard[b.color] = tintImage(STROKE_IMG, color);
      if (!tintCache.soft[b.color]) tintCache.soft[b.color] = tintImage(STROKE_SOFT, pickColor(b.color + 1));
      var tinted = tintCache.hard[b.color];
      var tintedSoft = tintCache.soft[b.color];

      var prev = pathPoint(b, uFrom);

      for (si = 1; si <= steps; si++) {
        var u = uFrom + ((uTo - uFrom) * si) / steps;
        var pt = pathPoint(b, u);
        var ang = pathAngle(b, u);
        var edge = 0.5 + 0.5 * Math.sin(u * Math.PI);
        var alpha = (0.5 + edge * 0.42) * dissolve * b.pressure;
        var stampW = baseW * (2.6 + edge * 0.55);
        var stampH = stampW * 0.24;

        paintCtx.save();
        paintCtx.globalCompositeOperation = "source-over";
        paintCtx.globalAlpha = alpha * 0.35;
        paintCtx.lineCap = "round";
        paintCtx.lineJoin = "round";
        paintCtx.strokeStyle = rgba(color, alpha * 0.55);
        paintCtx.lineWidth = baseW * 1.55;
        paintCtx.beginPath();
        paintCtx.moveTo(prev.x, prev.y);
        paintCtx.lineTo(pt.x, pt.y);
        paintCtx.stroke();
        paintCtx.strokeStyle = rgba(color, alpha * 0.75);
        paintCtx.lineWidth = baseW * 0.78;
        paintCtx.stroke();
        paintCtx.strokeStyle = rgba(color, alpha);
        paintCtx.lineWidth = baseW * 0.42;
        paintCtx.stroke();
        paintCtx.restore();

        paintCtx.save();
        paintCtx.globalCompositeOperation = "lighter";
        paintCtx.globalAlpha = alpha * 0.5;
        paintCtx.translate(pt.x, pt.y);
        paintCtx.rotate(ang);
        paintCtx.drawImage(tintedSoft, -stampW * 0.5, -stampH * 0.55, stampW, stampH);
        paintCtx.globalAlpha = alpha * 0.85;
        paintCtx.drawImage(tinted, -stampW * 0.48, -stampH * 0.5, stampW * 0.96, stampH);
        paintCtx.restore();

        prev = pt;
        lastPt = { x: pt.x, y: pt.y, ang: ang, color: b.color, pr: edge * b.pressure };
      }

      return lastPt;
    }

    function activeBrushIndex(elapsed) {
      var i;
      for (i = brushes.length - 1; i >= 0; i--) {
        var b = brushes[i];
        if (elapsed >= b.delay && elapsed <= b.delay + b.dur + 40) return i;
      }
      return -1;
    }

    function advanceBrush(idx, elapsed, dissolve) {
      var b = brushes[idx];
      if (elapsed < b.delay) return null;

      var t = Math.min(1, (elapsed - b.delay) / b.dur);
      var u = t;
      var lastU = strokeU[idx] || 0;

      if (u <= lastU + 0.0001) {
        var hold = pathPoint(b, u);
        return {
          x: hold.x,
          y: hold.y,
          ang: pathAngle(b, u),
          color: b.color,
          pr: b.pressure,
        };
      }

      var pt = drawBrushBand(b, lastU, u, dissolve);
      strokeU[idx] = u;
      return pt;
    }

    function drawBrushTip(pt) {
      if (!pt) return;
      var color = pickColor(pt.color);
      var sw = (mobile ? w * 0.38 : w * 0.44) * pt.pr;
      var sh = sw * 0.2;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      if (STROKE_IMG && tintCache.hard[pt.color]) {
        ctx.globalAlpha = 0.9 * pt.pr;
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.ang);
        ctx.drawImage(tintCache.hard[pt.color], -sw * 0.5, -sh * 0.5, sw, sh);
      }
      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      var g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, sh * 0.8);
      g.addColorStop(0, "rgba(255,255,255," + (0.3 * pt.pr) + ")");
      g.addColorStop(0.5, rgba(color, 0.2 * pt.pr));
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, sh * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawBloom(elapsed, dissolve) {
      if (elapsed < titleAtMs) return;
      var p = easeInOutSine(Math.min(1, (elapsed - titleAtMs) / 420));
      if (p <= 0.01) return;

      var r = Math.min(w, h) * (0.1 + p * 0.38);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      var grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grd.addColorStop(0, "rgba(255,255,255," + (0.28 * p * dissolve) + ")");
      grd.addColorStop(0.22, "rgba(255,196,106," + (0.24 * p * dissolve) + ")");
      grd.addColorStop(0.48, "rgba(188,77,255," + (0.2 * p * dissolve) + ")");
      grd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    overlay._wwsTitleReveal = function () {
      if (titleRevealed) return;
      titleRevealed = true;
      overlay.classList.add("wws--title-reveal");
      if (typeof overlay._wwsRevealTitleFn === "function") overlay._wwsRevealTitleFn();
    };

    resize();

    function draw(now) {
      if (!running) return;
      var elapsed = now - startTime;
      lastFrame = now;
      var dissolve = elapsed < revealMs + 340 ? 1 : Math.max(0, 1 - (elapsed - revealMs - 340) / 440);

      tip = null;
      var active = activeBrushIndex(elapsed);
      var i;

      for (i = 0; i < brushes.length; i++) {
        if (elapsed >= brushes[i].delay) advanceBrush(i, elapsed, dissolve);
      }

      if (active >= 0) {
        var b = brushes[active];
        var u = Math.min(1, (elapsed - b.delay) / b.dur);
        var p = pathPoint(b, u);
        tip = {
          x: p.x,
          y: p.y,
          ang: pathAngle(b, u),
          color: b.color,
          pr: b.pressure * (0.5 + 0.5 * Math.sin(u * Math.PI)),
        };
      }

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.globalAlpha = dissolve;
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(paintCanvas, 0, 0);
      ctx.restore();

      if (tip) drawBrushTip(tip);
      drawBloom(elapsed, dissolve);

      if (elapsed >= paintEndMs) applyFinalFill();

      if (elapsed >= titleAtMs) overlay._wwsTitleReveal();

      if (elapsed > totalMs + 120) {
        running = false;
        overlay._wwsTitleReveal();
      } else {
        overlay._wwsRaf = requestAnimationFrame(draw);
      }
    }

    overlay._wwsRaf = requestAnimationFrame(draw);
    overlay._wwsStopCanvas = function () {
      running = false;
      if (overlay._wwsRaf) cancelAnimationFrame(overlay._wwsRaf);
    };
  }
})();
