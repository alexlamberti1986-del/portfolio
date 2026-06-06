/**
 * Alex Lamberti — Portal-/Wurmloch-Übergänge (Canvas)
 * API: AlexWorldTransition.launch({ world, target, originElement, onComplete })
 */
(function (global) {
  "use strict";

  var DURATION_MS = 4200;
  var REDUCED_MS = 700;

  var WORLDS = {
    nexora: {
      bg: [2, 6, 16],
      tunnel: [0, 40, 90],
      primary: [0, 212, 255],
      secondary: [0, 120, 255],
      accent: [180, 240, 255],
      particleCount: 140,
      ringCount: 28,
      style: "digital",
    },
    professional: {
      bg: [8, 8, 10],
      tunnel: [20, 20, 24],
      primary: [255, 255, 255],
      secondary: [160, 160, 168],
      accent: [240, 240, 242],
      particleCount: 90,
      ringCount: 22,
      style: "checker",
    },
    freiraum: {
      bg: [20, 10, 32],
      tunnel: [60, 20, 70],
      primary: [255, 111, 174],
      secondary: [255, 209, 102],
      accent: [104, 216, 214],
      particleCount: 160,
      ringCount: 24,
      style: "aurora",
    },
  };

  var running = false;
  var overlay = null;
  var canvas = null;
  var ctx = null;
  var rafId = null;
  var particles = [];
  var rings = [];

  function prefersReducedMotion() {
    return global.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function easeInCubic(t) {
    return t * t * t;
  }

  function easeOutExpo(t) {
    return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function phaseProgress(t) {
    if (t < 0.14) return { phase: 1, local: t / 0.14 };
    if (t < 0.32) return { phase: 2, local: (t - 0.14) / 0.18 };
    if (t < 0.88) return { phase: 3, local: (t - 0.32) / 0.56 };
    return { phase: 4, local: (t - 0.88) / 0.12 };
  }

  function ensureOverlay() {
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.className = "world-transition-overlay";
    overlay.setAttribute("role", "presentation");
    overlay.setAttribute("aria-hidden", "true");
    canvas = document.createElement("canvas");
    overlay.appendChild(canvas);
    document.body.appendChild(overlay);
    ctx = canvas.getContext("2d", { alpha: false });
    global.addEventListener("resize", resizeCanvas);
  }

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var w = global.innerWidth;
    var h = global.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initParticles(cfg, w, h) {
    particles = [];
    var n = cfg.particleCount;
    for (var i = 0; i < n; i++) {
      var angle = Math.random() * Math.PI * 2;
      var dist = Math.random();
      particles.push({
        angle: angle,
        dist: dist,
        speed: 0.4 + Math.random() * 1.2,
        size: 0.5 + Math.random() * 2.5,
        hueOff: Math.random(),
        spin: (Math.random() - 0.5) * 0.02,
      });
    }
    rings = [];
    for (var r = 0; r < cfg.ringCount; r++) {
      rings.push({ z: r / cfg.ringCount, twist: Math.random() * Math.PI * 2 });
    }
  }

  function drawReduced(cfg, t, ox, oy) {
    var w = global.innerWidth;
    var h = global.innerHeight;
    var bg = cfg.bg;
    ctx.fillStyle = "rgb(" + bg.join(",") + ")";
    ctx.fillRect(0, 0, w, h);
    var alpha = t < 0.5 ? easeInOutQuad(t * 2) : 1 - easeInOutQuad((t - 0.5) * 2);
    var pr = cfg.primary;
    var grd = ctx.createRadialGradient(ox, oy, 0, ox, oy, Math.max(w, h) * 0.5);
    grd.addColorStop(0, "rgba(" + pr.join(",") + "," + alpha + ")");
    grd.addColorStop(1, "rgba(" + bg.join(",") + ",0)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);
  }

  function drawDigitalTunnel(cx, cy, depth, cfg, w, h) {
    var pr = cfg.primary;
    var sc = cfg.secondary;
    var lines = 48;
    for (var i = 0; i < lines; i++) {
      var a = (i / lines) * Math.PI * 2 + depth * 0.8;
      var x1 = cx + Math.cos(a) * w * 0.55;
      var y1 = cy + Math.sin(a) * h * 0.55;
      var pull = 0.12 + depth * 0.88;
      var x2 = lerp(x1, cx, pull);
      var y2 = lerp(y1, cy, pull);
      ctx.strokeStyle =
        "rgba(" +
        pr[0] +
        "," +
        pr[1] +
        "," +
        pr[2] +
        "," +
        (0.08 + depth * 0.35) +
        ")";
      ctx.lineWidth = 1 + depth * 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    for (var g = 0; g < 6; g++) {
      var gy = ((g / 6 + depth * 0.5) % 1) * h;
      ctx.strokeStyle = "rgba(" + sc.join(",") + "," + (0.06 + depth * 0.12) + ")";
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(w, gy);
      ctx.stroke();
    }
  }

  function drawCheckerTunnel(cx, cy, depth, cfg, w, h) {
    var tiles = 10;
    var size = lerp(Math.max(w, h) * 0.08, Math.max(w, h) * 0.45, 1 - depth);
    var rot = depth * 0.4;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    for (var row = -tiles; row <= tiles; row++) {
      for (var col = -tiles; col <= tiles; col++) {
        var dist = Math.sqrt(row * row + col * col) / tiles;
        if (dist > 1.2) continue;
        var fade = clamp(1 - dist * 0.7 + depth * 0.3, 0, 1);
        var even = (row + col) % 2 === 0;
        ctx.fillStyle = even
          ? "rgba(255,255,255," + (fade * (0.15 + depth * 0.5)) + ")"
          : "rgba(0,0,0," + (fade * (0.2 + depth * 0.4)) + ")";
        ctx.fillRect(col * size - size / 2, row * size - size / 2, size - 2, size - 2);
      }
    }
    ctx.restore();
  }

  function drawAuroraTunnel(cx, cy, depth, t, cfg, w, h) {
    var bands = 5;
    for (var b = 0; b < bands; b++) {
      var phase = t * 4 + b * 1.2;
      var y = cy + Math.sin(phase) * h * 0.25 * (1 - depth);
      var grd = ctx.createLinearGradient(0, y - 80, w, y + 80);
      var c1 = b % 3 === 0 ? cfg.primary : b % 3 === 1 ? cfg.secondary : cfg.accent;
      grd.addColorStop(0, "rgba(" + c1.join(",") + ",0)");
      grd.addColorStop(0.5, "rgba(" + c1.join(",") + "," + (0.12 + depth * 0.25) + ")");
      grd.addColorStop(1, "rgba(" + c1.join(",") + ",0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
    }
  }

  function drawParticles(cx, cy, depth, t, cfg, w, h) {
    var pr = cfg.primary;
    var ac = cfg.accent;
    particles.forEach(function (p) {
      p.dist -= p.speed * 0.008 * (1 + depth * 2);
      if (p.dist < 0.02) {
        p.dist = 1;
        p.angle = Math.random() * Math.PI * 2;
      }
      p.angle += p.spin;
      var r = p.dist * Math.max(w, h) * 0.65;
      var x = cx + Math.cos(p.angle) * r;
      var y = cy + Math.sin(p.angle) * r;
      var col = p.hueOff > 0.5 ? ac : pr;
      var a = clamp((1 - p.dist) * (0.3 + depth * 0.7), 0, 1);
      ctx.fillStyle = "rgba(" + col.join(",") + "," + a + ")";
      ctx.beginPath();
      ctx.arc(x, y, p.size * (1 + depth), 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawRings(cx, cy, portalR, depth, cfg) {
    var pr = cfg.primary;
    rings.forEach(function (ring, i) {
      var z = (ring.z + depth * 0.5) % 1;
      var r = portalR * (0.3 + z * 2.2);
      var a = clamp(1 - z, 0, 1) * 0.5;
      ctx.strokeStyle = "rgba(" + pr.join(",") + "," + a + ")";
      ctx.lineWidth = 1 + (1 - z) * 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });
  }

  function drawFrame(cfg, t, ox, oy) {
    var w = global.innerWidth;
    var h = global.innerHeight;
    var cx = w / 2;
    var cy = h / 2;
    var ph = phaseProgress(t);
    var bg = cfg.bg;

    ctx.fillStyle = "rgb(" + bg.join(",") + ")";
    ctx.fillRect(0, 0, w, h);

    var pullX = lerp(ox, cx, easeInCubic(Math.min(1, t * 1.2)));
    var pullY = lerp(oy, cy, easeInCubic(Math.min(1, t * 1.2)));
    var depth = easeOutExpo(clamp((t - 0.1) / 0.85, 0, 1));

    if (cfg.style === "digital") drawDigitalTunnel(pullX, pullY, depth, cfg, w, h);
    if (cfg.style === "checker") drawCheckerTunnel(pullX, pullY, depth, cfg, w, h);
    if (cfg.style === "aurora") drawAuroraTunnel(pullX, pullY, depth, t, cfg, w, h);

    drawParticles(pullX, pullY, depth, t, cfg, w, h);

    var portalOpen = ph.phase === 1 ? easeOutExpo(ph.local) : 1;
    var portalR =
      ph.phase === 1
        ? lerp(8, Math.max(w, h) * 0.12, portalOpen)
        : lerp(Math.max(w, h) * 0.12, Math.max(w, h) * 0.85, easeInCubic(ph.phase >= 2 ? clamp((t - 0.14) / 0.5, 0, 1) : 0));

    if (ph.phase >= 2) {
      portalR = Math.max(w, h) * (0.15 + depth * 1.1);
    }

    var pr = cfg.primary;
    var ringGrad = ctx.createRadialGradient(pullX, pullY, portalR * 0.1, pullX, pullY, portalR);
    ringGrad.addColorStop(0, "rgba(0,0,0,0.95)");
    ringGrad.addColorStop(0.55, "rgba(" + pr.join(",") + ",0.35)");
    ringGrad.addColorStop(0.85, "rgba(" + pr.join(",") + ",0.08)");
    ringGrad.addColorStop(1, "rgba(" + bg.join(",") + ",0)");
    ctx.fillStyle = ringGrad;
    ctx.beginPath();
    ctx.arc(pullX, pullY, portalR, 0, Math.PI * 2);
    ctx.fill();

    drawRings(pullX, pullY, portalR * 0.4, depth, cfg);

    if (ph.phase === 4) {
      var flash = easeOutExpo(ph.local);
      ctx.fillStyle = "rgba(" + cfg.accent.join(",") + "," + flash * 0.85 + ")";
      ctx.fillRect(0, 0, w, h);
    }

    var vignette = ctx.createRadialGradient(cx, cy, Math.min(w, h) * 0.2, cx, cy, Math.max(w, h) * 0.75);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0," + (0.35 + depth * 0.45) + ")");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);
  }

  function lockPage(lock) {
    document.documentElement.classList.toggle("world-transition-lock", lock);
    document.body.classList.toggle("world-transition-lock", lock);
  }

  function finish(onComplete, target) {
    running = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    overlay.classList.remove("is-active");
    lockPage(false);
    if (typeof onComplete === "function") onComplete();
    else if (target && target !== "#" && target !== "") {
      global.location.href = target;
    }
  }

  function launch(options) {
    if (running) return Promise.resolve();
    options = options || {};
    var worldKey = (options.world || "nexora").toLowerCase();
    if (worldKey === "vertex") worldKey = "professional";
    var cfg = WORLDS[worldKey] || WORLDS.nexora;
    var target = options.target || "#";
    var el = options.originElement;
    var onComplete = options.onComplete;
    var duration = options.durationMs || (prefersReducedMotion() ? REDUCED_MS : DURATION_MS);

    var rect = el && el.getBoundingClientRect ? el.getBoundingClientRect() : null;
    var ox = rect ? rect.left + rect.width / 2 : global.innerWidth / 2;
    var oy = rect ? rect.top + rect.height / 2 : global.innerHeight / 2;

    ensureOverlay();
    resizeCanvas();
    initParticles(cfg, global.innerWidth, global.innerHeight);
    running = true;
    lockPage(true);
    overlay.classList.add("is-active");

    var start = performance.now();

    return new Promise(function (resolve) {
      function frame(now) {
        var elapsed = now - start;
        var t = clamp(elapsed / duration, 0, 1);
        if (prefersReducedMotion()) drawReduced(cfg, t, ox, oy);
        else drawFrame(cfg, t, ox, oy);
        if (t < 1) {
          rafId = requestAnimationFrame(frame);
        } else {
          finish(function () {
            if (onComplete) onComplete();
            resolve();
          }, target);
        }
      }
      rafId = requestAnimationFrame(frame);
    });
  }

  function bindDataAttributes(root) {
    var scope = root || document;
    scope.querySelectorAll("[data-world-transition]").forEach(function (node) {
      if (node.__worldTransitionBound) return;
      node.__worldTransitionBound = true;
      node.addEventListener("click", function (e) {
        var world = node.getAttribute("data-world-transition");
        var target = node.getAttribute("data-target") || node.getAttribute("href") || "#";
        if (node.tagName === "A") e.preventDefault();
        launch({
          world: world,
          target: target,
          originElement: node,
        });
      });
    });
  }

  global.AlexWorldTransition = {
    launch: launch,
    bind: bindDataAttributes,
    worlds: Object.keys(WORLDS),
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      bindDataAttributes(document);
    });
  } else {
    bindDataAttributes(document);
  }
})(window);
