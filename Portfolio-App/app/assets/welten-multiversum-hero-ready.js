/**
 * MULTIVERSUM — Start-Poster erst weg, wenn Hero wirklich gerendert ist
 */
(function () {
  "use strict";

  var fallbackTimer = 0;

  function releasePoster() {
    if (window.__mvPosterReleased) return;
    window.__mvPosterReleased = true;
    if (fallbackTimer) {
      clearTimeout(fallbackTimer);
      fallbackTimer = 0;
    }

    var frame = document.querySelector(".galaxy-v10-home-frame");
    if (frame) frame.classList.add("is-visible");

    var poster = document.getElementById("mvHeroInstantPoster");
    if (poster) poster.style.display = "none";

    document.documentElement.classList.remove("mv-hero-boot-pending");
    document.documentElement.classList.add("mv-hero-ready");
    document.body.classList.add("mv-hero-ready");
  }

  function scheduleFallback() {
    if (fallbackTimer) return;
    fallbackTimer = window.setTimeout(releasePoster, 5000);
  }

  window.MVHeroReady = { mark: releasePoster, scheduleFallback: scheduleFallback };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleFallback);
  } else {
    scheduleFallback();
  }
})();
