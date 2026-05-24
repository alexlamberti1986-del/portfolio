/**
 * World transitions — cleanup-first, no blocking overlays
 */
(function (global) {
  "use strict";

  var rafIds = [];
  var origRaf = global.requestAnimationFrame;
  var origCaf = global.cancelAnimationFrame;

  function stopAllTransitionRaf() {
    if (!origCaf) return;
    rafIds.forEach(function (id) {
      try {
        origCaf.call(global, id);
      } catch (e) {}
    });
    rafIds.length = 0;
  }

  function cleanupWorldTransition(root) {
    var doc = root && root.querySelector ? root : global.document;
    if (!doc) return;

    doc
      .querySelectorAll(
        ".world-transition-overlay, .world-transition-canvas, #world-transition-overlay, .transition-overlay, .loading-overlay"
      )
      .forEach(function (el) {
        try {
          el.remove();
        } catch (e) {
          el.style.display = "none";
          el.style.visibility = "hidden";
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
        }
      });

    var html = doc.documentElement;
    var body = doc.body;
    if (!html || !body) return;

    [
      "transition-active",
      "is-transitioning",
      "world-switching",
      "world-transition-lock",
      "locked",
      "shell-switching",
      "shell-loading",
    ].forEach(function (cls) {
      html.classList.remove(cls);
      body.classList.remove(cls);
    });

    html.style.overflow = "";
    html.style.pointerEvents = "";
    body.style.overflow = "";
    body.style.pointerEvents = "";
    body.style.touchAction = "";

    doc.querySelectorAll(".home-hero-experience.is-dragging, #dnaStage.is-dragging").forEach(function (hero) {
      hero.classList.remove("is-dragging");
      hero.style.touchAction = "pan-y";
    });

    doc.querySelectorAll("#dnaStage, .home-hero-experience").forEach(function (hero) {
      if (hero.releasePointerCapture) {
        try {
          if (typeof hero.hasPointerCapture === "function") {
            for (var i = 0; i < 20; i++) {
              if (!hero.hasPointerCapture(i)) continue;
              hero.releasePointerCapture(i);
            }
          }
        } catch (e) {}
      }
    });
  }

  function playWorldTransition() {
    cleanupWorldTransition(global.document);
    stopAllTransitionRaf();
    return Promise.resolve();
  }

  global.cleanupWorldTransition = cleanupWorldTransition;
  global.stopWorldTransitionRaf = stopAllTransitionRaf;
  global.playWorldTransition = playWorldTransition;
})(typeof window !== "undefined" ? window : global);
