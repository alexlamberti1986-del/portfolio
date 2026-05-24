/**
 * Lightweight world transitions — NEXORA · PROFESSIONAL · FREIRAUM
 * CSS-only effects, ~420ms, no canvas
 */
(function (global) {
  "use strict";

  var DURATION_MS = 420;
  var REDUCED_MS = 280;

  var mqReduce = global.matchMedia("(prefers-reduced-motion: reduce)");
  var mqMobile = global.matchMedia("(max-width: 768px), (hover: none) and (pointer: coarse)");

  var overlay = null;
  var running = false;
  var hideTimer = 0;

  function normalizeWorld(world) {
    var w = (world || "").toLowerCase();
    if (w === "vertex" || w === "business") return "professional";
    return w;
  }

  function ensureDom() {
    overlay = document.getElementById("world-transition-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "world-transition-overlay";
      overlay.setAttribute("aria-hidden", "true");
      document.body.appendChild(overlay);
    }
    var canvas = overlay.querySelector(".world-transition-canvas");
    if (canvas) canvas.remove();
  }

  function hideOverlay() {
    if (hideTimer) {
      global.clearTimeout(hideTimer);
      hideTimer = 0;
    }
    if (!overlay) return;
    overlay.classList.remove("is-active", "is-exiting");
    overlay.classList.remove(
      "world-transition--nexora",
      "world-transition--professional",
      "world-transition--freiraum"
    );
    overlay.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("world-transition-lock");
    running = false;
  }

  function playWorldTransition(world) {
    world = normalizeWorld(world);
    if (world !== "nexora" && world !== "professional" && world !== "freiraum") {
      return Promise.resolve();
    }
    if (running) return Promise.resolve();
    running = true;

    return new Promise(function (resolve) {
      ensureDom();
      hideOverlay();
      running = true;

      var duration = mqReduce.matches ? REDUCED_MS : DURATION_MS;
      if (mqMobile.matches && world !== "professional") {
        duration = Math.min(duration, 380);
      }

      overlay.className = "world-transition--" + world;
      overlay.classList.add("is-active");
      overlay.setAttribute("aria-hidden", "false");
      document.documentElement.classList.add("world-transition-lock");

      hideTimer = global.setTimeout(function () {
        overlay.classList.add("is-exiting");
        global.setTimeout(function () {
          hideOverlay();
          resolve();
        }, 80);
      }, duration);
    });
  }

  global.playWorldTransition = playWorldTransition;
})(window);
