/**
 * Welcome image video — muted autoplay loop, non-blocking.
 */
(function () {
  "use strict";

  var root = document.getElementById("welcomeFilm");
  var video = document.getElementById("welcomeFilmVideo");
  if (!root || !video) return;

  var reduced = false;
  try {
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {}

  function play() {
    root.classList.remove("is-ended", "is-paused");
    var promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {
        root.classList.add("is-paused");
      });
    }
  }

  function reveal() {
    root.classList.add("is-ready");
  }

  video.addEventListener("loadeddata", reveal, { once: true });
  video.addEventListener("canplay", reveal, { once: true });
  video.addEventListener("playing", function () {
    root.classList.remove("is-paused", "is-ended");
    reveal();
  });
  video.addEventListener("pause", function () {
    if (!video.ended) root.classList.add("is-paused");
  });
  video.addEventListener("timeupdate", function () {
    if (!video.duration || !isFinite(video.duration)) return;
    root.style.setProperty("--film-progress", String(video.currentTime / video.duration));
    /* Soft loop restart — vermeidet kurzen Ruckler am Clip-Ende */
    try {
      if (video.duration - video.currentTime < 0.08) {
        video.currentTime = 0.001;
        play();
      }
    } catch (e1) {}
  });

  if (reduced) {
    root.classList.add("is-paused");
    return;
  }

  /* Muted + playsinline + loop: continuous autoplay on desktop/mobile */
  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  play();
})();
