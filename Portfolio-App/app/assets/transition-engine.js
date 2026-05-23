/**
 * Premium world transitions — NEXORA · PROFESSIONAL · FREIRAUM
 * Canvas tunnel, prefers-reduced-motion fade, max 2.4s
 */
(function (global) {
  "use strict";

  var MIN_MS = 1800;
  var MAX_MS = 2400;
  var DEFAULT_MS = 1500;
  var FADE_MS = 520;
  var PRO_MS = 680;

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
    particles = [];
    var n = isMobile() ? 14 : 22;
    for (var i = 0; i < n; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        r: 0.6 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
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
    ctx.fillStyle = "#030810";
    ctx.fillRect(0, 0, w, h);

    var cx = w * 0.5;
    var cy = h * 0.48;
    var reveal = easeOutQuart(progress);
    var maxR = Math.min(w, h) * (0.22 + reveal * 0.55);

    var bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
    bloom.addColorStop(0, "rgba(90, 220, 255, " + (0.28 * (1 - progress * 0.35)) + ")");
    bloom.addColorStop(0.42, "rgba(0, 150, 255, " + (0.1 * (1 - progress * 0.5)) + ")");
    bloom.addColorStop(1, "transparent");
    ctx.fillStyle = bloom;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalAlpha = 0.035 * (1 - progress);
    ctx.fillStyle = "#00d4ff";
    for (var sy = 0; sy < h; sy += 5) {
      ctx.fillRect(0, (sy + (t * 0.04) % 5) | 0, w, 1);
    }
    ctx.restore();

    var ringR = maxR * (0.35 + (1 - reveal) * 0.45);
    ctx.strokeStyle = "rgba(0, 212, 255, " + (0.08 + (1 - progress) * 0.14) + ")";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
    ctx.stroke();

    lines.forEach(function (ln) {
      var a = ln.angle + progress * 0.06;
      var inner = ringR * 0.15;
      var outer = ringR * (0.55 + (1 - reveal) * 0.85);
      ctx.strokeStyle = "rgba(0, 212, 255, " + (0.04 + (1 - progress) * 0.09) + ")";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
      ctx.lineTo(cx + Math.cos(a) * outer, cy + Math.sin(a) * outer);
      ctx.stroke();
    });

    particles.forEach(function (p) {
      var d = p.dist * (1 - reveal * 0.88);
      var radius = d * maxR * 0.85;
      var a = p.angle + Math.sin(t * 0.0015 + p.wobble) * 0.015;
      var x = cx + Math.cos(a) * radius;
      var y = cy + Math.sin(a) * radius;
      ctx.fillStyle = p.hue ? "rgba(0, 255, 180, 0.55)" : "rgba(0, 212, 255, 0.65)";
      ctx.globalAlpha = 0.15 + (1 - d) * 0.45;
      ctx.beginPath();
      ctx.arc(x, y, 1.2 + (1 - d) * 1.8, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    var vig = ctx.createRadialGradient(cx, cy, maxR * 0.2, cx, cy, Math.hypot(w, h) * 0.72);
    vig.addColorStop(0, "transparent");
    vig.addColorStop(1, "rgba(3, 8, 16, " + (0.35 + progress * 0.35) + ")");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);
  }

  function drawProfessional(w, h, progress, t) {
    ctx.fillStyle = "#0c0c0c";
    ctx.fillRect(0, 0, w, h);

    var wash = 1 - easeInOutCubic(progress);
    ctx.fillStyle = "rgba(248, 246, 242, " + (wash * 0.16) + ")";
    ctx.fillRect(0, 0, w, h);

    particles.forEach(function (p) {
      var dx = p.x * w + Math.sin(t * 0.00035 + p.phase) * 10;
      var dy = p.y * h + Math.cos(t * 0.00028 + p.phase) * 6 + progress * 12;
      ctx.fillStyle = "rgba(255,255,255," + (0.03 + wash * 0.07) + ")";
      ctx.beginPath();
      ctx.arc(dx, dy, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.strokeStyle = "rgba(255,255,255," + (wash * 0.05) + ")";
    ctx.lineWidth = 1;
    for (var i = 0; i < 4; i++) {
      var yy = h * (0.38 + i * 0.1) + Math.sin(t * 0.00025 + i * 1.7) * 5;
      ctx.beginPath();
      ctx.moveTo(-10, yy);
      ctx.lineTo(w + 10, yy);
      ctx.stroke();
    }
  }

  function drawFreiraum(w, h, progress, t) {
    var g = ctx.createLinearGradient(0, 0, w * 0.7, h);
    g.addColorStop(0, "#2a1420");
    g.addColorStop(0.45, "#3a1c28");
    g.addColorStop(1, "#1a1024");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    var cx = w * 0.5;
    var cy = h * 0.46;
    var flow = easeInOutCubic(progress);
    var maxR = Math.min(w, h) * 0.52;

    blobs.forEach(function (b) {
      var angle = b.phase + t * 0.0009 * b.drift;
      var dist = (0.12 + (1 - flow) * 0.55 + Math.sin(angle * 1.6) * 0.06) * maxR;
      var x = cx + Math.cos(angle) * dist;
      var y = cy + Math.sin(angle * 1.08) * dist * 0.82;
      var r = b.r * maxR * (0.55 + flow * 0.45);

      var grd = ctx.createRadialGradient(x, y, 0, x, y, r);
      grd.addColorStop(0, b.color + "99");
      grd.addColorStop(0.55, b.color + "33");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = "rgba(255, 230, 200, 0.04)";
    for (var i = 0; i < 10; i++) {
      var fx = cx + Math.sin(t * 0.0006 + i * 1.4) * w * 0.28 * (0.4 + flow);
      var fy = cy + Math.cos(t * 0.00055 + i * 1.1) * h * 0.22 * (0.4 + flow);
      var fr = 2 + (i % 3);
      ctx.globalAlpha = 0.25 + (1 - flow) * 0.35;
      ctx.beginPath();
      ctx.arc(fx, fy, fr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    var warm = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 1.1);
    warm.addColorStop(0, "rgba(255, 180, 120, " + (0.06 * (1 - flow)) + ")");
    warm.addColorStop(1, "transparent");
    ctx.fillStyle = warm;
    ctx.fillRect(0, 0, w, h);
  }

  function playSoftProfessional(resolve) {
    ensureDom();
    running = true;
    var size = resizeCanvas();
    initProfessional(size);
    overlay.className = "world-transition--professional";
    overlay.classList.add("is-active");
    overlay.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("world-transition-lock");

    var duration = PRO_MS;
    var start = performance.now();
    function frame(now) {
      var elapsed = now - start;
      var progress = Math.min(1, elapsed / duration);
      drawProfessional(size.w, size.h, progress, now);
      if (elapsed >= duration) {
        hideOverlay();
        resolve();
        return;
      }
      rafId = global.requestAnimationFrame(frame);
    }
    rafId = global.requestAnimationFrame(frame);
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
      if (world === "professional") {
        playSoftProfessional(finish);
        return;
      }
      playTunnel(world, finish);
    });
  }

  global.playWorldTransition = playWorldTransition;
})(window);
