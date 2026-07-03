/**
 * FREIRAUM Weltwechsel — breite Pinsel-Maske (Broad Brush Reveal)
 * 8 kubische Striche enthüllen das FREIRAUM-Gemälde durch eine Mask-Canvas.
 */
(function () {
  "use strict";

  var REVEAL_IMG_SRC = "assets/images/world-switch/freiraum-broad-brush-reveal.png";
  var REVEAL_IMG = null;
  var REVEAL_IMG_READY = false;
  var REVEAL_IMG_FAILED = false;

  function mulberry32(seed) {
    return function () {
      var t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function coverImageRect(image, cw, ch) {
    var iw = image.naturalWidth || image.width;
    var ih = image.naturalHeight || image.height;
    var scale = Math.max(cw / iw, ch / ih);
    var nw = iw * scale;
    var nh = ih * scale;
    return { x: (cw - nw) / 2, y: (ch - nh) / 2, w: nw, h: nh };
  }

  function drawProceduralReveal(ctx, w, h) {
    var g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#6e279c");
    g.addColorStop(0.22, "#ea1689");
    g.addColorStop(0.42, "#f7b617");
    g.addColorStop(0.58, "#f06e00");
    g.addColorStop(0.72, "#009fb1");
    g.addColorStop(0.88, "#005197");
    g.addColorStop(1, "#061833");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.35;
    var blobs = [
      [0.18, 0.28, 0.34, "#ff2ba6"],
      [0.72, 0.22, 0.28, "#f7b617"],
      [0.48, 0.62, 0.38, "#009fb1"],
      [0.82, 0.68, 0.24, "#ea1689"],
    ];
    var i;
    for (i = 0; i < blobs.length; i++) {
      var b = blobs[i];
      var rg = ctx.createRadialGradient(b[0] * w, b[1] * h, 0, b[0] * w, b[1] * h, b[2] * Math.min(w, h));
      rg.addColorStop(0, b[3]);
      rg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(b[0] * w, b[1] * h, b[2] * Math.min(w, h), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function ensureRevealImage(cb) {
    if (REVEAL_IMG_READY || REVEAL_IMG_FAILED) {
      cb();
      return;
    }
    if (REVEAL_IMG) {
      if (REVEAL_IMG.complete) {
        REVEAL_IMG_READY = true;
        cb();
        return;
      }
      REVEAL_IMG.onload = function () {
        REVEAL_IMG_READY = true;
        cb();
      };
      REVEAL_IMG.onerror = function () {
        REVEAL_IMG_FAILED = true;
        cb();
      };
      return;
    }
    REVEAL_IMG = new Image();
    REVEAL_IMG.decoding = "async";
    REVEAL_IMG.onload = function () {
      REVEAL_IMG_READY = true;
      cb();
    };
    REVEAL_IMG.onerror = function () {
      REVEAL_IMG_FAILED = true;
      cb();
    };
    REVEAL_IMG.src = REVEAL_IMG_SRC;
  }

  window.__wwsFreiraumBrushV3 = function startFreiraumBrushV3(overlay) {
    var canvas = overlay.querySelector(".welten-world-switch__canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    ensureRevealImage(function () {
      runBroadBrush(overlay, canvas, ctx);
    });
  };

  function runBroadBrush(overlay, canvas, ctx) {
    var reduceMotion = false;
    try {
      reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {}

    var FT =
      window.WeltenWorldSwitchPreview && window.WeltenWorldSwitchPreview.getTimingForWorld
        ? window.WeltenWorldSwitchPreview.getTimingForWorld("freiraum")
        : { EFFECT_MS: 3400, TITLE_REVEAL_AT: 760 };

    var totalMs = FT.EFFECT_MS || 3400;
    var titleAtMs = FT.TITLE_REVEAL_AT || Math.round(totalMs * 0.5);
    var dissolveStartMs = Math.round(totalMs * 0.85);
    var strokeTotalMs = totalMs * (2500 / 2950);

    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var w = 0;
    var h = 0;
    var mask = null;
    var maskCtx = null;
    var procCanvas = null;
    var procCtx = null;
    var strokes = [];
    var rand = mulberry32(124928);
    var running = true;
    var startTime = performance.now();
    var titleRevealed = false;

    overlay._wwsTitleReveal = function () {
      if (titleRevealed) return;
      titleRevealed = true;
      overlay.classList.add("wws--title-reveal");
      if (typeof overlay._wwsRevealTitleFn === "function") overlay._wwsRevealTitleFn();
    };

    function pointOnCubic(s, t) {
      var mt = 1 - t;
      return {
        x: mt * mt * mt * s.x0 + 3 * mt * mt * t * s.cx1 + 3 * mt * t * t * s.cx2 + t * t * t * s.x1,
        y: mt * mt * mt * s.y0 + 3 * mt * mt * t * s.cy1 + 3 * mt * t * t * s.cy2 + t * t * t * s.y1,
      };
    }

    function tangentOnCubic(s, t) {
      var mt = 1 - t;
      var x = 3 * mt * mt * (s.cx1 - s.x0) + 6 * mt * t * (s.cx2 - s.cx1) + 3 * t * t * (s.x1 - s.cx2);
      var y = 3 * mt * mt * (s.cy1 - s.y0) + 6 * mt * t * (s.cy2 - s.cy1) + 3 * t * t * (s.y1 - s.cy2);
      var len = Math.hypot(x, y) || 1;
      return { x: x / len, y: y / len };
    }

    function buildStrokes() {
      var base = Math.max(180, Math.min(w, h) * 0.22);
      var wide = Math.max(230, Math.min(w, h) * 0.34);
      var mobile = w < 768;
      var scale = mobile ? 0.82 : 1;
      var defs = [
        { delay: 0, dur: 1050, width: wide * 1.05, x0: -w * 0.18, y0: h * 0.31, cx1: w * 0.18, cy1: -h * 0.1, cx2: w * 0.72, cy2: h * 0.18, x1: w * 1.2, y1: h * 0.03 },
        { delay: 180, dur: 1100, width: wide * 0.88, x0: -w * 0.15, y0: h * 0.61, cx1: w * 0.2, cy1: h * 0.18, cx2: w * 0.68, cy2: h * 0.69, x1: w * 1.14, y1: h * 0.37 },
        { delay: 360, dur: 1200, width: base * 1.05, x0: w * 0.04, y0: h * 1.1, cx1: w * 0.12, cy1: h * 0.62, cx2: w * 0.52, cy2: h * 0.5, x1: w * 1.08, y1: h * 0.75 },
        { delay: 540, dur: 1000, width: wide * 0.72, x0: w * 0.34, y0: -h * 0.12, cx1: w * 0.45, cy1: h * 0.2, cx2: w * 0.78, cy2: h * 0.38, x1: w * 1.16, y1: h * 0.28 },
        { delay: 760, dur: 1050, width: base * 0.86, x0: -w * 0.2, y0: h * 0.86, cx1: w * 0.24, cy1: h * 0.8, cx2: w * 0.38, cy2: h * 0.98, x1: w * 1.22, y1: h * 0.94 },
        { delay: 930, dur: 880, width: base * 0.72, x0: -w * 0.08, y0: h * 0.12, cx1: w * 0.22, cy1: h * 0.38, cx2: w * 0.34, cy2: h * 0.56, x1: w * 0.78, y1: h * 1.12 },
        { delay: 1120, dur: 980, width: wide * 0.7, x0: w * 0.88, y0: -h * 0.1, cx1: w * 0.72, cy1: h * 0.22, cx2: w * 0.42, cy2: h * 0.65, x1: -w * 0.2, y1: h * 0.72 },
        { delay: 1320, dur: 820, width: base * 0.74, x0: w * 0.2, y0: -h * 0.12, cx1: w * 0.12, cy1: h * 0.26, cx2: w * 0.34, cy2: h * 0.46, x1: w * 0.56, y1: h * 1.1 },
      ];

      strokes = defs.map(function (s, index) {
        var bristles = [];
        var bristleCount = Math.round(32 + (s.width * scale) / 7);
        var i;
        for (i = 0; i < bristleCount; i++) {
          bristles.push({
            offset: (rand() - 0.5) * s.width * scale * 1.06,
            width: lerp(1.4, 9.5, rand()),
            alpha: lerp(0.2, 0.82, rand()),
            start: rand() * 0.09,
            end: 0.84 + rand() * 0.16,
            phase: rand() * Math.PI * 2,
          });
        }

        var holes = [];
        for (i = 0; i < 36; i++) {
          holes.push({
            t: rand(),
            offset: (rand() - 0.5) * s.width * scale * 0.86,
            len: lerp(0.035, 0.12, rand()),
            width: lerp(3, 18, rand()),
            alpha: lerp(0.09, 0.28, rand()),
          });
        }

        var splats = [];
        for (i = 0; i < 58; i++) {
          splats.push({
            t: rand(),
            offset: (rand() - 0.5) * s.width * scale * 1.55,
            drift: (rand() - 0.5) * 80,
            r: lerp(1.2, 13, Math.pow(rand(), 1.7)),
            alpha: lerp(0.36, 0.92, rand()),
          });
        }

        return {
          delay: s.delay,
          dur: s.dur,
          width: s.width * scale,
          x0: s.x0,
          y0: s.y0,
          cx1: s.cx1,
          cy1: s.cy1,
          cx2: s.cx2,
          cy2: s.cy2,
          x1: s.x1,
          y1: s.y1,
          index: index,
          bristles: bristles,
          holes: holes,
          splats: splats,
        };
      });
    }

    function drawPath(context, s, progress, offset, width, alpha, jitter, steps) {
      var end = clamp(progress, 0, 1);
      if (end <= 0) return;
      offset = offset || 0;
      width = width == null ? s.width : width;
      alpha = alpha == null ? 1 : alpha;
      jitter = jitter || 0;
      steps = steps || 46;

      context.beginPath();
      var i;
      for (i = 0; i <= steps; i++) {
        var t = (i / steps) * end;
        var p = pointOnCubic(s, t);
        var tan = tangentOnCubic(s, t);
        var nx = -tan.y;
        var ny = tan.x;
        var wiggle = Math.sin(t * Math.PI * 10 + jitter) * 8 + Math.sin(t * Math.PI * 21 + jitter) * 3;
        var x = p.x + nx * (offset + wiggle);
        var y = p.y + ny * (offset + wiggle);
        if (i === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = width;
      context.globalAlpha = alpha;
      context.strokeStyle = "#fff";
      context.stroke();
      context.globalAlpha = 1;
    }

    function drawBrushOnMask(s, local) {
      var p = easeOutCubic(clamp(local, 0, 1));
      if (p <= 0) return;

      drawPath(maskCtx, s, p, 0, s.width, 0.92, s.index * 1.7, 68);
      drawPath(maskCtx, s, p, -s.width * 0.29, s.width * 0.18, 0.55, s.index + 4.2, 58);
      drawPath(maskCtx, s, p, s.width * 0.31, s.width * 0.14, 0.45, s.index + 7.1, 58);

      var bi;
      for (bi = 0; bi < s.bristles.length; bi++) {
        var b = s.bristles[bi];
        var bristleProgress = clamp((p - b.start) / Math.max(0.04, b.end - b.start), 0, 1);
        if (bristleProgress <= 0) continue;
        drawPath(maskCtx, s, bristleProgress, b.offset, b.width, b.alpha, b.phase, 54);
      }

      maskCtx.save();
      maskCtx.globalCompositeOperation = "destination-out";
      var hi;
      for (hi = 0; hi < s.holes.length; hi++) {
        var hole = s.holes[hi];
        if (hole.t > p) continue;
        var t1 = clamp(hole.t - hole.len * 0.5, 0, 1);
        var t2 = clamp(hole.t + hole.len * 0.5, 0, p);
        var steps = 10;
        maskCtx.beginPath();
        var si;
        for (si = 0; si <= steps; si++) {
          var tt = lerp(t1, t2, si / steps);
          var pt = pointOnCubic(s, tt);
          var tan = tangentOnCubic(s, tt);
          var nx = -tan.y;
          var ny = tan.x;
          var hx = pt.x + nx * hole.offset + Math.sin(tt * 38) * 7;
          var hy = pt.y + ny * hole.offset + Math.cos(tt * 28) * 5;
          if (si === 0) maskCtx.moveTo(hx, hy);
          else maskCtx.lineTo(hx, hy);
        }
        maskCtx.lineCap = "round";
        maskCtx.lineJoin = "round";
        maskCtx.lineWidth = hole.width;
        maskCtx.globalAlpha = hole.alpha;
        maskCtx.strokeStyle = "#000";
        maskCtx.stroke();
      }
      maskCtx.restore();

      maskCtx.save();
      maskCtx.fillStyle = "#fff";
      var spi;
      for (spi = 0; spi < s.splats.length; spi++) {
        var sp = s.splats[spi];
        if (sp.t > p) continue;
        var spt = pointOnCubic(s, sp.t);
        var stan = tangentOnCubic(s, sp.t);
        var snx = -stan.y;
        var sny = stan.x;
        var sx = spt.x + snx * sp.offset + stan.x * sp.drift;
        var sy = spt.y + sny * sp.offset + stan.y * sp.drift;
        maskCtx.globalAlpha = sp.alpha;
        maskCtx.beginPath();
        maskCtx.arc(sx, sy, sp.r, 0, Math.PI * 2);
        maskCtx.fill();
        if (sp.r > 7) {
          maskCtx.globalAlpha = sp.alpha * 0.35;
          maskCtx.beginPath();
          maskCtx.ellipse(sx + sp.r * 0.9, sy - sp.r * 0.35, sp.r * 1.6, sp.r * 0.38, Math.atan2(stan.y, stan.x), 0, Math.PI * 2);
          maskCtx.fill();
        }
      }
      maskCtx.restore();
    }

    function addWetHighlights(progress) {
      ctx.save();
      ctx.globalCompositeOperation = "source-atop";
      ctx.globalAlpha = 0.16 * (1 - Math.abs(progress - 0.54));
      ctx.strokeStyle = "rgba(255,255,255,.7)";
      ctx.lineCap = "round";
      var i;
      for (i = 0; i < strokes.length; i++) {
        var s = strokes[i];
        var local = clamp((progress * strokeTotalMs - s.delay) / s.dur, 0, 1);
        if (local <= 0) continue;
        var j;
        for (j = 0; j < 6; j++) {
          drawPath(ctx, s, local, (j - 3) * s.width * 0.07, 1.1 + j * 0.22, 0.28, j + s.index, 42);
        }
      }
      ctx.restore();
    }

    function render(progress, dissolve) {
      maskCtx.clearRect(0, 0, w, h);
      var si;
      for (si = 0; si < strokes.length; si++) {
        var local = (progress * strokeTotalMs - strokes[si].delay) / strokes[si].dur;
        drawBrushOnMask(strokes[si], local);
      }

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.globalAlpha = dissolve;
      ctx.fillStyle = "rgba(255,247,234,.42)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(mask, 0, 0, w, h);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = dissolve;
      if (REVEAL_IMG_READY && REVEAL_IMG) {
        var r = coverImageRect(REVEAL_IMG, w, h);
        ctx.drawImage(REVEAL_IMG, r.x, r.y, r.w, r.h);
      } else {
        if (!procCanvas) {
          procCanvas = document.createElement("canvas");
          procCtx = procCanvas.getContext("2d");
        }
        if (procCanvas.width !== w || procCanvas.height !== h) {
          procCanvas.width = w;
          procCanvas.height = h;
          drawProceduralReveal(procCtx, w, h);
        }
        ctx.drawImage(procCanvas, 0, 0);
      }
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(mask, 0, 0, w, h);
      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = "source-atop";
      ctx.globalAlpha = 0.17 * dissolve;
      ctx.fillStyle = "#fff7e7";
      var y;
      for (y = 0; y < h; y += 6) {
        ctx.fillRect(0, y + ((y * 17) % 4), w, 0.45);
      }
      ctx.globalAlpha = 0.09 * dissolve;
      ctx.fillStyle = "#061833";
      var x;
      for (x = 0; x < w; x += 7) {
        ctx.fillRect(x + ((x * 13) % 5), 0, 0.42, h);
      }
      ctx.restore();

      addWetHighlights(progress);
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.floor(window.innerWidth);
      h = Math.floor(window.innerHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      mask = document.createElement("canvas");
      mask.width = Math.floor(w * dpr);
      mask.height = Math.floor(h * dpr);
      maskCtx = mask.getContext("2d", { alpha: true });
      maskCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      procCanvas = null;
      buildStrokes();
    }

    function quickReveal() {
      resize();
      render(1, 1);
      overlay._wwsTitleReveal();
    }

    if (reduceMotion) {
      quickReveal();
      overlay._wwsStopCanvas = function () {};
      return;
    }

    resize();

    function draw(now) {
      if (!running) return;
      var elapsed = now - startTime;
      var raw = clamp(elapsed / totalMs, 0, 1);
      var p = easeInOut(raw);
      var dissolve =
        elapsed < dissolveStartMs
          ? 1
          : Math.max(0, 1 - easeOutCubic(clamp((elapsed - dissolveStartMs) / 440, 0, 1)));

      render(p, dissolve);

      if (elapsed >= titleAtMs) overlay._wwsTitleReveal();

      if (elapsed > totalMs + 120) {
        running = false;
        render(1, dissolve);
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
