/**
 * Welcome image video controls.
 * The page remains usable immediately; playback never blocks the content.
 */
(function () {
  "use strict";

  var root = document.getElementById("welcomeFilm");
  var video = document.getElementById("welcomeFilmVideo");
  var sound = document.getElementById("welcomeFilmSound");
  var replay = document.getElementById("welcomeFilmReplay");
  var skip = document.getElementById("welcomeFilmSkip");
  if (!root || !video) return;

  var reduced = false;
  try {
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {}

  function updateSound() {
    if (!sound) return;
    sound.textContent = video.muted ? "Ton einschalten" : "Ton ausschalten";
    sound.setAttribute("aria-pressed", video.muted ? "false" : "true");
    sound.setAttribute(
      "aria-label",
      video.muted ? "Ton des Imagevideos einschalten" : "Ton des Imagevideos ausschalten"
    );
  }

  function stopBackgroundMusic() {
    var backgroundAudio = document.getElementById("welcomeAudio");
    var backgroundButton = document.getElementById("welcomeAudioBtn");
    if (backgroundAudio && !backgroundAudio.paused) {
      try {
        backgroundAudio.pause();
      } catch (e) {}
    }
    if (backgroundButton) {
      backgroundButton.setAttribute("aria-pressed", "false");
      backgroundButton.setAttribute("aria-label", "Hintergrundmusik einschalten");
    }
  }

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

  if (sound) {
    sound.addEventListener("click", function () {
      video.muted = !video.muted;
      if (!video.muted) stopBackgroundMusic();
      updateSound();
      if (video.paused) play();
    });
  }

  if (replay) {
    replay.addEventListener("click", function () {
      try {
        video.currentTime = 0;
      } catch (e) {}
      play();
    });
  }

  if (skip) {
    skip.addEventListener("click", function () {
      var target = document.getElementById("welcomeContent");
      if (!target) return;
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    });
  }

  updateSound();
  if (reduced) {
    root.classList.add("is-paused");
    return;
  }

  /* Muted + playsinline permits autoplay on modern desktop and mobile browsers. */
  video.muted = true;
  video.defaultMuted = true;
  play();
})();
