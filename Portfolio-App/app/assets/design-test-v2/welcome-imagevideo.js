/**
 * Welcome image video controls.
 * The page remains usable immediately; playback never blocks the content.
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
  video.addEventListener("ended", function () {
    root.classList.add("is-ended");
    root.style.setProperty("--film-progress", "1");
  });
  video.addEventListener("timeupdate", function () {
    if (!video.duration || !isFinite(video.duration)) return;
    root.style.setProperty("--film-progress", String(video.currentTime / video.duration));
  });

  if (reduced) {
    root.classList.add("is-paused");
    return;
  }

  /* Muted + playsinline permits autoplay on modern desktop and mobile browsers. */
  video.muted = true;
  video.defaultMuted = true;
  play();
})();
