/**
 * Effekte-Governor — reduziert Animationen/RAF wenn Effekte aus oder Tab hidden
 */
(function () {
  "use strict";

  var FX_KEY = "mv-effects-on";

  function prefersReduced() {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
      return false;
    }
  }

  function readStoredEffects() {
    try {
      var v = localStorage.getItem(FX_KEY);
      if (v === "0") return false;
      if (v === "1") return true;
    } catch (e) {}
    return !prefersReduced();
  }

  function setEffects(on) {
    window.__mvEffectsOn = !!on;
    var off = !on;
    var reduce = off || prefersReduced();
    var root = document.documentElement;
    if (root) {
      root.classList.toggle("mv-effects-off", off);
      root.classList.toggle("welten-reduce-effects", reduce);
    }
    if (document.body) {
      document.body.classList.toggle("mv-effects-off", off);
      document.body.classList.toggle("welten-reduce-effects", reduce);
    }
  }

  function pauseHeavyLoops() {
    if (window.__mvEffectsOn !== false) return;
    try {
      if (window.MVParallaxHero && typeof window.MVParallaxHero.destroy === "function") {
        /* parallax bleibt — nur Klassen steuern CSS/JS */
      }
    } catch (e) {}
  }

  window.addEventListener("message", function (e) {
    if (!e.data || e.data.type !== "portfolio-effects") return;
    setEffects(!!e.data.on);
    pauseHeavyLoops();
  });

  document.addEventListener("mv-effects-change", function (e) {
    if (e.detail) setEffects(!!e.detail.on);
    pauseHeavyLoops();
  });

  if (window.parent === window) {
    setEffects(readStoredEffects());
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      document.documentElement.classList.add("welten-tab-hidden");
      document.querySelectorAll("video").forEach(function (v) {
        try {
          if (!v.paused) v.pause();
        } catch (e) {}
      });
    } else {
      document.documentElement.classList.remove("welten-tab-hidden");
    }
  });
})();
