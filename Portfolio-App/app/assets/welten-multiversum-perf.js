/**
 * MULTIVERSUM — stoppt alle NEXORA-Canvas/Partikel sofort.
 */
(function () {
  "use strict";

  window.__MV_DISABLE_FX = true;
  document.documentElement.classList.add("mv-preview-lite", "mv-world-general");

  function stripDecor() {
    ["#particle-canvas", "#dnaPremiumCanvas", "#dnaParticlesCanvas"].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) el.remove();
    });
    document.querySelectorAll(".bg-grid, .light-beams").forEach(function (el) {
      el.remove();
    });
  }

  stripDecor();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", stripDecor, { once: true });
  }
  window.addEventListener("load", stripDecor, { once: true });
})();
