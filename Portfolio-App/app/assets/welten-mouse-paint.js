/**
 * Welten-Mauseffekt — gleicher Pinsel-Partikel-Stil, Farbe je Welt (Desktop)
 */
(function () {
  "use strict";

  var ACTIVE_WORLDS = { general: 1, freiraum: 1, nexora: 1, vertex: 1 };

  var BASE = {
    opacity: 0.58,
    blend: "screen",
    count: 3,
    spread: 18,
    speed: 1.35,
    rMin: 5,
    rMax: 12,
    alpha: 0.5,
    fade: 0.9,
    max: 64,
  };

  var MODE = {
    general: {
      colors: [[255, 209, 102], [255, 48, 126], [0, 220, 210], [122, 92, 255], [255, 255, 255]],
    },
    freiraum: {
      colors: [[255, 214, 102], [255, 193, 7], [255, 235, 130], [255, 209, 102], [255, 248, 220]],
    },
    nexora: {
      colors: [[101, 217, 255], [0, 185, 255], [142, 197, 255], [65, 170, 255], [215, 250, 255]],
    },
    vertex: {
      colors: [[18, 20, 26], [35, 38, 46], [55, 58, 68], [75, 78, 90], [12, 12, 16]],
      blend: "multiply",
      opacity: 0.42,
      alpha: 0.55,
    },
  };

  var canvas;
  var ctx;
  var w = 0;
  var h = 0;
  var dpr = 1;
  var particles = [];
  var lastMove = 0;
  var running = false;
  var rafId = 0;

  function world() {
    return document.body ? document.body.getAttribute("data-world") || "" : "";
  }

  function paintMode() {
    var wld = world();
    var palette = MODE[wld];
    if (!palette) return null;
    var cfg = {};
    var key;
    for (key in BASE) {
      if (Object.prototype.hasOwnProperty.call(BASE, key)) cfg[key] = BASE[key];
    }
    for (key in palette) {
      if (Object.prototype.hasOwnProperty.call(palette, key)) cfg[key] = palette[key];
    }
    return cfg;
  }

  function desktopPointer() {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
      if (window.matchMedia("(max-width: 1024px)").matches) return false;
      if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return false;
    } catch (e) {
      if (window.innerWidth <= 1024) return false;
    }
    return true;
  }

  function effectsAllowed() {
    if (!desktopPointer()) return false;
    if (window.__mvEffectsOn === false) return false;
    var root = document.documentElement;
    if (root && (root.classList.contains("welten-reduce-effects") || root.classList.contains("mv-effects-off"))) {
      return false;
    }
    if (document.body && document.body.classList.contains("mv-effects-off")) return false;
    return true;
  }

  function canPaint() {
    if (window.__worldTransitionRunning) return false;
    var wld = world();
    return effectsAllowed() && !!ACTIVE_WORLDS[wld] && !!paintMode();
  }

  function syncRootClass() {
    var root = document.documentElement;
    if (!root) return;
    root.classList.toggle("welten-mouse-fx", canPaint());
  }

  function ensureCanvas() {
    if (!canvas) {
      canvas = document.getElementById("weltenMousePaintCanvas");
      if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "weltenMousePaintCanvas";
        canvas.setAttribute("aria-hidden", "true");
        document.body.insertBefore(canvas, document.body.firstChild);
      }
      canvas.style.cssText =
        "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:2147483005;opacity:0;mix-blend-mode:screen;transition:opacity .25s ease";
      ctx = canvas.getContext("2d", { alpha: true });
    }
    return !!ctx;
  }

  function resize() {
    if (!canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = canvas.width = Math.floor(window.innerWidth * dpr);
    h = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
  }

  function clear() {
    particles.length = 0;
    if (ctx && w && h) ctx.clearRect(0, 0, w, h);
    if (canvas) canvas.style.opacity = "0";
  }

  function add(x, y, cfg) {
    var i;
    var c;
    var spread = cfg.spread * dpr;
    var speed = cfg.speed * dpr;
    for (i = 0; i < cfg.count; i++) {
      c = cfg.colors[(Math.random() * cfg.colors.length) | 0];
      particles.push({
        x: x * dpr + (Math.random() - 0.5) * spread,
        y: y * dpr + (Math.random() - 0.5) * spread,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        r: (cfg.rMin + Math.random() * (cfg.rMax - cfg.rMin)) * dpr,
        a: cfg.alpha,
        fade: cfg.fade,
        c: c,
      });
    }
    if (particles.length > cfg.max) particles.splice(0, particles.length - cfg.max);
  }

  function draw() {
    rafId = 0;
    if (!ensureCanvas()) return;
    var cfg = paintMode();
    if (!canPaint() || !cfg) {
      clear();
      syncRootClass();
      if (running) rafId = requestAnimationFrame(draw);
      return;
    }

    canvas.style.mixBlendMode = cfg.blend;
    canvas.style.opacity = String(cfg.opacity);
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = cfg.blend === "multiply" ? "source-over" : "lighter";

    var i;
    var p;
    var g;
    for (i = 0; i < particles.length; i++) {
      p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.a *= p.fade;
      p.r *= 0.982;
      g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      g.addColorStop(0, "rgba(" + p.c[0] + "," + p.c[1] + "," + p.c[2] + "," + p.a.toFixed(3) + ")");
      g.addColorStop(0.48, "rgba(" + p.c[0] + "," + p.c[1] + "," + p.c[2] + "," + (p.a * 0.28).toFixed(3) + ")");
      g.addColorStop(1, "rgba(" + p.c[0] + "," + p.c[1] + "," + p.c[2] + ",0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    particles = particles.filter(function (pt) {
      return pt.a > 0.025 && pt.r > 0.7;
    });

    if (performance.now() - lastMove > 650 && particles.length < 4) clear();

    ctx.globalCompositeOperation = "source-over";
    syncRootClass();
    if (running) rafId = requestAnimationFrame(draw);
  }

  function scheduleDraw() {
    if (!running) return;
    if (!rafId) rafId = requestAnimationFrame(draw);
  }

  function onPointerMove(e) {
    if (!canPaint()) return;
    var cfg = paintMode();
    if (!cfg || !ensureCanvas()) return;
    lastMove = performance.now();
    add(e.clientX, e.clientY, cfg);
    scheduleDraw();
  }

  function onWorldChange() {
    clear();
    syncRootClass();
    scheduleDraw();
  }

  function start() {
    if (running) return;
    if (!document.body) return;
    running = true;
    ensureCanvas();
    resize();
    syncRootClass();
    scheduleDraw();
  }

  function stop() {
    running = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    clear();
    syncRootClass();
  }

  function init() {
    if (!document.body) return;
    start();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else start();
    });
    window.addEventListener("message", function (e) {
      if (e.data && e.data.type === "portfolio-effects") onWorldChange();
    });
    document.addEventListener("mv-effects-change", onWorldChange);
    try {
      new MutationObserver(onWorldChange).observe(document.body, {
        attributes: true,
        attributeFilter: ["data-world", "class", "data-current-slide"],
      });
    } catch (e) {}
    try {
      new MutationObserver(onWorldChange).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    } catch (e2) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
