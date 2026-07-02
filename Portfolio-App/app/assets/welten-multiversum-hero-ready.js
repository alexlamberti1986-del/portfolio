/**
 * MULTIVERSUM — Hero als „bereit“ markieren (Poster ausblenden)
 */
(function () {
  "use strict";

  function markHeroReady() {
    if (window.__mvHeroReadyMarked) return;
    window.__mvHeroReadyMarked = true;
    document.documentElement.classList.remove("mv-hero-boot-pending");
    document.documentElement.classList.add("mv-hero-ready");
    document.body.classList.add("mv-hero-ready");
    window.setTimeout(function () {
      var poster = document.getElementById("mvHeroInstantPoster");
      if (poster) poster.remove();
    }, 600);
  }

  window.MVHeroReady = { mark: markHeroReady };
})();
