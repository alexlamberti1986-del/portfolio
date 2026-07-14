/**
 * NEXORA – slow-rotating CSS 3D brain behind the orbit menu.
 * Builds a layered ".nexora-brain3d" element inside ".neuro-core" and drives its
 * rotation via rAF: a slow ambient spin, partially synced to the orbit ring's
 * "--nexora-orbit-rot" custom property (at a much slower factor than the buttons).
 */
(function () {
  "use strict";

  var CORE_SELECTORS = [
    ".home-hero-experience .neuro-core",
    ".welten-desktop-relocated-hero .neuro-core",
    ".welten-mobile-relocated-hero .neuro-core",
  ];
  var ORBIT_RING_SELECTORS = [
    ".home-hero-experience .nexora-orbit-ring",
    ".welten-desktop-relocated-hero .nexora-orbit-ring",
    ".welten-mobile-relocated-hero .nexora-orbit-ring",
  ];
  var ORBIT_SYNC_FACTOR = 0.22;

  function isTouchUI() {
    if (window.WeltenTouchEnv && typeof window.WeltenTouchEnv.isMobileLayout === "function") {
      return window.WeltenTouchEnv.isMobileLayout();
    }
    return window.matchMedia && window.matchMedia("(max-width: 1024px)").matches;
  }

  function isReducedMotion() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function findCores() {
    var out = [];
    CORE_SELECTORS.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (out.indexOf(el) === -1) out.push(el);
      });
    });
    return out;
  }

  function findOrbitRing() {
    for (var i = 0; i < ORBIT_RING_SELECTORS.length; i++) {
      var el = document.querySelector(ORBIT_RING_SELECTORS[i]);
      if (el) return el;
    }
    return null;
  }

  function buildBrainMarkup() {
    var wrap = document.createElement("div");
    wrap.className = "nexora-brain3d";
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML =
      '<div class="nexora-brain3d__rotor">' +
      '<span class="nexora-brain3d__glow"></span>' +
      '<span class="nexora-brain3d__hemi nexora-brain3d__hemi--left"></span>' +
      '<span class="nexora-brain3d__hemi nexora-brain3d__hemi--right"></span>' +
      '<span class="nexora-brain3d__lobe nexora-brain3d__lobe--frontal"></span>' +
      '<span class="nexora-brain3d__lobe nexora-brain3d__lobe--parietal"></span>' +
      '<span class="nexora-brain3d__lobe nexora-brain3d__lobe--temporal-l"></span>' +
      '<span class="nexora-brain3d__lobe nexora-brain3d__lobe--temporal-r"></span>' +
      '<span class="nexora-brain3d__sulci"></span>' +
      '<span class="nexora-brain3d__stem"></span>' +
      "</div>";
    return wrap;
  }

  function ensureBrain(core) {
    if (!core) return null;
    var existing = core.querySelector(".nexora-brain3d");
    if (existing) return existing;
    var el = buildBrainMarkup();
    core.appendChild(el);
    return el;
  }

  var rotors = [];
  var baseAngle = 0;
  var lastT = null;
  var rafId = null;

  function speedForCurrentEnv() {
    if (isReducedMotion()) return 0;
    return isTouchUI() ? 0.0015 : 0.003; // deg/ms → ~240s (mobile) / ~120s (desktop) per lap
  }

  function readOrbitAngle() {
    var ring = findOrbitRing();
    if (!ring) return 0;
    var v = window.getComputedStyle(ring).getPropertyValue("--nexora-orbit-rot");
    var n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  }

  function tick(t) {
    if (lastT === null) lastT = t;
    var dt = t - lastT;
    lastT = t;
    if (dt > 0 && dt < 250) {
      baseAngle = (baseAngle + dt * speedForCurrentEnv()) % 360;
    }
    var orbitAngle = readOrbitAngle();
    var total = baseAngle + orbitAngle * ORBIT_SYNC_FACTOR;
    for (var i = 0; i < rotors.length; i++) {
      rotors[i].style.transform = "rotateY(" + total.toFixed(2) + "deg)";
    }
    rafId = requestAnimationFrame(tick);
  }

  function activate() {
    document.body.classList.add("nexora-brain-3d-on");
    var cores = findCores();
    if (!cores.length) return false;
    var nextRotors = [];
    cores.forEach(function (core) {
      var brain = ensureBrain(core);
      var rotor = brain && brain.querySelector(".nexora-brain3d__rotor");
      if (rotor) nextRotors.push(rotor);
    });
    rotors = nextRotors;
    if (rotors.length && rafId === null) {
      lastT = null;
      rafId = requestAnimationFrame(tick);
    }
    return rotors.length > 0;
  }

  var pendingRetry = null;
  function init() {
    if (!activate()) {
      if (pendingRetry) clearTimeout(pendingRetry);
      pendingRetry = setTimeout(init, 300);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(init, 30);
    });
  } else {
    setTimeout(init, 30);
  }
  window.addEventListener("load", function () {
    setTimeout(activate, 200);
  });
  document.addEventListener("welten-video-hero-mounted", function () {
    setTimeout(activate, 50);
  });
  document.addEventListener("welten-chapter-change", function () {
    setTimeout(activate, 80);
  });
  document.addEventListener("welten-nexora-orbit-init", function () {
    setTimeout(activate, 80);
  });
  window.addEventListener("resize", function () {
    setTimeout(activate, 150);
  });

  try {
    new MutationObserver(function () {
      setTimeout(activate, 60);
    }).observe(document.body, { attributes: true, attributeFilter: ["data-world", "data-current-slide"] });
  } catch (e) {}

  window.NexoraBrain3D = {
    activate: activate,
  };
})();
