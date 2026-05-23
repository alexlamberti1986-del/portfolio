/**
 * Premium world transitions — NEXORA · PROFESSIONAL · FREIRAUM
 * Canvas tunnel, prefers-reduced-motion fade, max 2.4s
 */
(function (global) {
  "use strict";

  var MIN_MS = 1800;
  var MAX_MS = 2400;
  var DEFAULT_MS = 1500;
  var FADE_MS = 380;

  var mqReduce = global.matchMedia("(prefers-reduced-motion: reduce)");
  var mqMobile = global.matchMedia("(max-width: 768px), (hover: none) and (pointer: coarse)");

  var overlay = null;
  var canvas = null;
  var ctx = null;
  var rafId = 0;
  var running = false;
  var particles = [];
  var lines = [];
  var blobs = [];

  function normalizeWorld(world) {
    var w = (world || "").toLowerCase();
    if (w === "vertex" || w === "business") return "professional";
    return w;
  }

  function isMobile() {
    return mqMobile.matches;
  }

  function particleCount(world) {
    if (isMobile()) {
      return world === "professional" ? 18 : world === "freiraum" ? 28 : 36;
    }
    return world === "professional" ? 32 : world === "freiraum" ? 48 : 64;
  }

  function lineCount(world) {
    if (isMobile()) {
      return world === "professional" ? 24 : world === "nexora" ? 40 : 0;
    }
    return world === "professional" ? 48 : world === "nexora" ? 72 : 0;
  }

  function ensureDom() {
    overlay = document.getElementById("world-transition-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "world-transition-overlay";
      overlay.setAttribute("aria-hidden", "true");
      document.body.appendChild(overlay);
    }
    canvas = overlay.querySelector(".world-transition-canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.className = "world-transition-canvas";
      canvas.setAttribute("aria-hidden", "true");
      overlay.appendChild(canvas);
    }
    ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
  }

  function resizeCanvas() {
    var dpr = Math.min(2, global.devicePixelRatio || 1);
    var w = global.innerWidth;
    var h = global.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w: w, h: h, dpr: dpr };
  }

  function stopLoop() {
    if (rafId) {
      global.cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  function hideOverlay() {
    stopLoop();
    if (!overlay) return;
    overlay.classList.remove("is-active");
    overlay.classList.remove(
      "world-transition--nexora",
      "world-transition--professional",
      "world-transition--freiraum"
    );
    overlay.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("world-transition-lock");
    running = false;
    particles = [];
    lines = [];
    blobs = [];
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function initNexora(size) {
    var n = particleCount("nexora");
    particles = [];
    for (var i = 0; i < n; i++) {
      var angle = Math.random() * Math.PI * 2;
      var dist = 0.35 + Math.random() * 1.1;
      particles.push({
        angle: angle,
        dist: dist,
        speed: 0.55 + Math.random() * 0.9,
        len: 8 + Math.random() * 22,
        hue: Math.random() > 0.45 ? 0 : 1,
        wobble: Math.random() * Math.PI * 2,
      });
    }
    lines = [];
    var lc = lineCount("nexora");
    for (var j = 0; j < lc; j++) {
      lines.push({
        angle: (j / lc) * Math.PI * 2 + Math.random() * 0.08,
        offset: Math.random(),
      });
    }
  }

  function initProfessional(size) {
    lines = [];
    var lc = lineCount("professional");
    var cols = Math.ceil(Math.sqrt(lc * (size.w / size.h)));
    var rows = Math.ceil(lc / cols);
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        if (lines.length >= lc) break;
        lines.push({
          gx: (c + 0.5) / cols,
          gy: (r + 0.5) / rows,
          phase: Math.random(),
        });
      }
    }
    particles = [];
    var n = particleCount("professional");
    for (var i = 0; i < n; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.002,
        vy: 0.003 + Math.random() * 0.004,
      });
    }
  }

  function initFreiraum(size) {
    blobs = [];
    var n = particleCount("freiraum");
    var colors = ["#ff7a59", "#ffd166", "#7bdff2", "#cdb4db"];
    for (var i = 0; i < n; i++) {
      blobs.push({
        x: Math.random(),
        y: Math.random(),
        r: 0.04 + Math.random() * 0.12,
        color: colors[i % colors.length],
        phase: Math.random() * Math.PI * 2,
        drift: 0.3 + Math.random() * 0.7,
        spin: (Math.random() - 0.5) * 0.8,
      });
    }
  }

  function drawNexora(w, h, progress, t) {
    var bg = "#050807";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    var cx = w * 0.5;
    var cy = h * 0.5;
    var warp = easeOutQuart(progress);
    var maxR = Math.hypot(w, h) * 0.72;
    ctx.save();

    lines.forEach(function (ln) {
      var a = ln.angle + progress * 0.12;
      var inner = maxR * (0.02 + warp * 0.08);
      var outer = maxR * (0.25 + (1 - warp) * 0.75);
      ctx.strokeStyle = "rgba(0, 212, 255, " + (0.06 + (1 - progress) * 0.14) + ")";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
      ctx.lineTo(cx + Math.cos(a) * outer, cy + Math.sin(a) * outer);
      ctx.stroke();
    });

    particles.forEach(function (p) {
      var d = p.dist * (1 - warp * 0.92);
      var radius = d * maxR * 0.5;
      var a = p.angle + Math.sin(t * 0.002 + p.wobble) * 0.02;
      var x = cx + Math.cos(a) * radius;
      var y = cy + Math.sin(a) * radius;
      var col = p.hue ? "#00ff9c" : "#00d4ff";
      ctx.strokeStyle = col;
      ctx.globalAlpha = 0.25 + (1 - d) * 0.55;
      ctx.lineWidth = 1.2;
      var tail = p.len * (0.4 + warp);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(
        x - Math.cos(a) * tail,
        y - Math.sin(a) * tail
      );
      ctx.stroke();
    });

    ctx.globalAlpha = 1;
    ctx.restore();

    var vig = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
    vig.addColorStop(0, "rgba(0, 255, 156, 0.04)");
    vig.addColorStop(0.35, "transparent");
    vig.addColorStop(1, "rgba(5, 8, 7, 0.65)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);
  }

  function drawProfessional(w, h, progress, t) {
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, w, h);

    var cx = w * 0.5;
    var cy = h * 0.5;
    var depth = easeInOutCubic(progress);
    var horizon = 0.38 + depth * 0.22;

    lines.forEach(function (ln, idx) {
      var px = (ln.gx - 0.5) * 1.6;
      var pz = 0.15 + ((ln.phase + progress * 1.2) % 1) * 0.85;
      var scale = 1 / pz;
      var x = cx + px * w * 0.42 * scale;
      var y = cy + (horizon - 0.5) * h * scale * 0.55;
      var alpha = Math.min(0.35, 0.08 + (1 - pz) * 0.35);
      ctx.strokeStyle = idx % 3 === 0 ? "rgba(255,255,255," + alpha + ")" : "rgba(119,119,119," + alpha * 0.9 + ")";
      ctx.lineWidth = 1;
      var len = 12 * scale;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + len);
      ctx.stroke();
    });

    particles.forEach(function (p) {
      p.y += p.vy * (1 + depth * 2);
      p.x += p.vx;
      if (p.y > 1.1) {
        p.y = -0.05;
        p.x = Math.random();
      }
      var py = cy + (p.y - horizon) * h * 0.9;
      ctx.fillStyle = "rgba(255,255,255," + (0.04 + (1 - depth) * 0.12) + ")";
      ctx.fillRect(p.x * w, py, 1.5, 8 + depth * 6);
    });

    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    for (var i = -4; i <= 4; i++) {
      var yy = cy + i * 28 * (1 + depth);
      ctx.beginPath();
      ctx.moveTo(0, yy);
      ctx.lineTo(w, yy);
      ctx.stroke();
    }
  }

  function drawFreiraum(w, h, progress, t) {
    var g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#1a1028");
    g.addColorStop(1, "#241832");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    var cx = w * 0.5;
    var cy = h * 0.5;
    var flow = easeInOutCubic(progress);
    var maxR = Math.min(w, h) * 0.55;

    blobs.forEach(function (b) {
      var angle = b.phase + t * 0.0012 * b.drift;
      var dist = (0.2 + (1 - flow) * 0.65 + Math.sin(angle * 2) * 0.08) * maxR;
      var x = cx + Math.cos(angle) * dist;
      var y = cy + Math.sin(angle * 1.1) * dist * 0.85;
      var r = b.r * maxR * (0.65 + flow * 0.35);

      var grd = ctx.createRadialGradient(x, y, 0, x, y, r);
      grd.addColorStop(0, b.color + "aa");
      grd.addColorStop(0.5, b.color + "44");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = b.color + "55";
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.arc(x, y, r * 0.72, t * 0.001 * b.spin, t * 0.001 * b.spin + Math.PI * 0.7);
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    for (var i = 0; i < 6; i++) {
      var fx = cx + Math.sin(t * 0.0008 + i) * w * 0.3 * (1 - flow);
      var fy = cy + Math.cos(t * 0.0007 + i * 1.3) * h * 0.25;
      ctx.beginPath();
      ctx.arc(fx, fy, 40 + i * 12, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function playFade(world, resolve) {
    ensureDom();
    var duration = FADE_MS;
    overlay.className = "world-transition--" + world;
    overlay.classList.add("is-active");
    overlay.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("world-transition-lock");

    var start = performance.now();
    function tick(now) {
      var elapsed = now - start;
      if (elapsed >= duration) {
        hideOverlay();
        resolve();
        return;
      }
      rafId = global.requestAnimationFrame(tick);
    }
    rafId = global.requestAnimationFrame(tick);
  }

  function playTunnel(world, resolve) {
    ensureDom();
    running = true;
    var size = resizeCanvas();
    var w = size.w;
    var h = size.h;

    if (world === "nexora") initNexora(size);
    else if (world === "professional") initProfessional(size);
    else initFreiraum(size);

    overlay.className = "world-transition--" + world;
    overlay.classList.add("is-active");
    overlay.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("world-transition-lock");

    var duration = isMobile() ? 1100 : DEFAULT_MS;
    var start = performance.now();
    var onResize = function () {
      size = resizeCanvas();
      w = size.w;
      h = size.h;
    };
    global.addEventListener("resize", onResize, { passive: true });

    function frame(now) {
      if (!running) {
        global.removeEventListener("resize", onResize);
        return;
      }
      var elapsed = now - start;
      var progress = Math.min(1, elapsed / duration);
      var t = now;

      if (world === "nexora") drawNexora(w, h, progress, t);
      else if (world === "professional") drawProfessional(w, h, progress, t);
      else drawFreiraum(w, h, progress, t);

      if (elapsed >= duration) {
        global.removeEventListener("resize", onResize);
        hideOverlay();
        resolve();
        return;
      }
      rafId = global.requestAnimationFrame(frame);
    }

    rafId = global.requestAnimationFrame(frame);
  }

  function playWorldTransition(world) {
    world = normalizeWorld(world);
    if (world !== "nexora" && world !== "professional" && world !== "freiraum") {
      return Promise.resolve();
    }
    if (running) return Promise.resolve();
    running = true;

    return new Promise(function (resolve) {
      function finish() {
        running = false;
        resolve();
      }
      if (mqReduce.matches) {
        playFade(world, finish);
        return;
      }
      playTunnel(world, finish);
    });
  }

  global.playWorldTransition = playWorldTransition;
})(window);
