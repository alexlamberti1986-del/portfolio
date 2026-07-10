/**
 * Video-Hero Trial — nur auf Home: Header → Hero → Video → Inhalt.
 * Handy + Tablet: kein Video. Nur Desktop/Laptop. Unterseiten: kein Video.
 */
(function () {
  "use strict";

  var VER = "20260710video-fast";
  var ENABLED = true;
  var mqNoVideo = window.matchMedia("(max-width: 1024px)");
  var prefetched = {};
  var homeObserver = null;
  var lastSlide = "";
  var restartTimer = 0;
  var restartPending = false;
  var initialRevealDone = false;
  var heroReadyForVideo = false;
  var enterAt = 0;

  var WORLD_MAP = {
    general: "multiversum",
    nexora: "nexora",
    vertex: "professional",
    freiraum: "freiraum",
  };

  var WORLDS = {
    multiversum: {
      label: "Multiversum",
      poster: "assets/videos/multiversum-poster.jpg",
      src: "assets/videos/multiversum-hero.mp4",
    },
    nexora: {
      label: "Nexora",
      poster: "assets/videos/nexora-poster.jpg",
      src: "assets/videos/nexora-hero.mp4",
    },
    professional: {
      label: "Professional",
      poster: "assets/videos/professional-poster.jpg",
      src: "assets/videos/professional-hero.mp4",
    },
    freiraum: {
      label: "Freiraum",
      poster: "assets/videos/freiraum-poster.jpg",
      src: "assets/videos/freiraum-hero.mp4",
    },
  };

  function isEmbedded() {
    try {
      return window.parent !== window;
    } catch (e) {
      return true;
    }
  }

  var frameLive = !isEmbedded();
  var frameVisible = !isEmbedded();
  var gotWorldSignal = false;

  function isParentActiveFrame() {
    if (!isEmbedded()) return true;
    try {
      var parentFrames = window.parent.document.querySelectorAll(".mv4-frame");
      for (var i = 0; i < parentFrames.length; i++) {
        if (parentFrames[i].contentWindow === window && parentFrames[i].classList.contains("is-active")) {
          return true;
        }
      }
    } catch (e) {}
    return false;
  }

  function tryEmbeddedInitialReveal() {
    if (!isEmbedded() || gotWorldSignal || isVideoHidden()) return;
    if (!isParentActiveFrame()) return;
    frameLive = true;
    frameVisible = true;
    mountVideoHero();
  }

  function isVideoHidden() {
    return mqNoVideo.matches;
  }

  function pickVideoSrc(worldKey) {
    var w = WORLDS[worldKey];
    return w ? w.src : "";
  }

  function isHomeActive() {
    var slideHome = document.getElementById("slide-home");
    if (!slideHome) return false;
    if (slideHome.classList.contains("active")) return true;
    var current = document.body.getAttribute("data-current-slide");
    return !current || current === "home";
  }

  function canPlayVideo() {
    return frameLive && frameVisible && isHomeActive() && !isVideoHidden();
  }

  function getHomeInner() {
    var slideHome = document.getElementById("slide-home");
    return slideHome && slideHome.querySelector(".slide-inner");
  }

  function prefetchVideo(worldKey) {
    if (!frameLive || !heroReadyForVideo) return;
    var src = pickVideoSrc(worldKey);
    if (!src || prefetched[src]) return;
    prefetched[src] = true;
    var link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = src;
    link.type = "video/mp4";
    document.head.appendChild(link);
  }

  function removeVideoHero() {
    var hero = document.getElementById("alWorldVideoHero");
    if (hero) hero.remove();
    document.body.removeAttribute("data-welten-video-hero");
  }

  function getVideoEl() {
    var section = document.getElementById("alWorldVideoHero");
    return section && section.querySelector("video");
  }

  function resetVideoEl(video) {
    if (!video) return;
    try {
      video.pause();
      video.currentTime = 0;
    } catch (e) {}
  }

  function pauseVideoHero() {
    resetVideoEl(getVideoEl());
  }

  function markVideoReady(section, video) {
    if (!section || !video) return;
    section.classList.add("is-video-ready");
    video.style.opacity = "1";
  }

  function isVideoPlaying(video) {
    if (!video) return false;
    return !video.paused && !video.ended && video.readyState > 2 && video.currentTime > 0.12;
  }

  function restartAndPlay(force) {
    if (!canPlayVideo()) {
      pauseVideoHero();
      return;
    }

    var section = document.getElementById("alWorldVideoHero");
    var video = section && section.querySelector("video");
    if (!video) return;

    if (!force && isVideoPlaying(video) && section.classList.contains("is-video-ready")) {
      return;
    }

    if (!force && restartPending) return;
    restartPending = true;
    if (restartTimer) window.clearTimeout(restartTimer);
    restartTimer = window.setTimeout(function () {
      restartPending = false;
      restartTimer = 0;
      restartAndPlayNow();
    }, force ? 0 : 120);
  }

  function restartAndPlayNow() {
    if (!canPlayVideo()) {
      pauseVideoHero();
      return;
    }

    var section = document.getElementById("alWorldVideoHero");
    var video = section && section.querySelector("video");
    if (!video) return;

    if (isVideoPlaying(video) && section.classList.contains("is-video-ready")) {
      return;
    }

    var needsHardReset = !video.getAttribute("src") || video.error;
    if (!video.getAttribute("src")) {
      var worldKey = WORLD_MAP[document.body.getAttribute("data-world") || ""];
      var src = pickVideoSrc(worldKey);
      if (src) video.setAttribute("src", src);
    }
    if (needsHardReset) {
      section.classList.remove("is-video-ready");
      video.style.opacity = "0";
      resetVideoEl(video);
    }

    video.preload = "auto";
    video.muted = true;
    video.volume = 0;

    var started = false;
    function tryPlay() {
      if (started || !canPlayVideo()) return;
      started = true;
      if (needsHardReset) resetVideoEl(video);
      video.muted = true;
      video.volume = 0;
      var promise = video.play();
      if (promise && typeof promise.then === "function") {
        promise
          .then(function () {
            markVideoReady(section, video);
          })
          .catch(function () {
            started = false;
          });
      } else {
        markVideoReady(section, video);
      }
    }

    if (video.readyState >= 2) {
      tryPlay();
      return;
    }

    video.addEventListener("canplay", tryPlay, { once: true });
    if (needsHardReset) {
      try {
        video.load();
      } catch (eLoad) {}
    }
    window.setTimeout(function () {
      if (!started && video.readyState >= 2) tryPlay();
    }, 400);
  }

  function buildHero(worldKey) {
    var w = WORLDS[worldKey];
    var src = pickVideoSrc(worldKey);
    var deferSrc = !heroReadyForVideo;
    var section = document.createElement("section");
    section.id = "alWorldVideoHero";
    section.className =
      "al-world-video-hero al-world-video-hero--" + worldKey + " al-world-video-hero--video-only";
    section.setAttribute("aria-label", w.label + " Video");
    section.innerHTML =
      '<div class="al-world-video-hero__media">' +
      '<video class="al-world-video-hero__video" muted loop playsinline preload="none"' +
      ' poster="' +
      w.poster +
      '"' +
      (deferSrc ? "" : ' src="' + src + '"') +
      "></video></div>";

    var video = section.querySelector("video");
    if (video) {
      video.style.opacity = "0";
      video.muted = true;
      video.defaultMuted = true;
      video.volume = 0;
      video.setAttribute("muted", "");
      video.setAttribute("webkit-playsinline", "");
      video.playsInline = true;
      video.addEventListener(
        "playing",
        function () {
          markVideoReady(section, video);
        },
        false
      );
    }

    return section;
  }

  function getHeroAnchor() {
    var homeInner = getHomeInner();
    if (!homeInner) return null;
    return (
      homeInner.querySelector("#mvParallaxHero") ||
      homeInner.querySelector("#mvStaticHero") ||
      homeInner.querySelector("#dnaStage") ||
      homeInner.querySelector(".home-hero-experience")
    );
  }

  function ensureVideoAfterHero() {
    var videoHero = document.getElementById("alWorldVideoHero");
    var homeInner = getHomeInner();
    var anchor = getHeroAnchor();
    if (!videoHero || !homeInner) return;

    if (anchor) {
      if (anchor.nextElementSibling !== videoHero) {
        if (anchor.nextSibling) {
          homeInner.insertBefore(videoHero, anchor.nextSibling);
        } else {
          homeInner.appendChild(videoHero);
        }
      }
      return;
    }

    if (homeInner.firstElementChild !== videoHero) {
      homeInner.insertBefore(videoHero, homeInner.firstChild);
    }
  }

  function resetHomeScroll() {
    var slideHome = document.getElementById("slide-home");
    if (!slideHome || !isHomeActive()) return;
    if (slideHome.scrollTop > 4) slideHome.scrollTop = 0;
  }

  function watchHomeInner() {
    var homeInner = getHomeInner();
    if (!homeInner || homeObserver) return;
    try {
      homeObserver = new MutationObserver(function () {
        if (!document.getElementById("alWorldVideoHero")) {
          mountVideoHero();
          return;
        }
        ensureVideoAfterHero();
      });
      homeObserver.observe(homeInner, { childList: true });
    } catch (e) {}
  }

  function mountVideoHero() {
    if (!ENABLED) return;

    if (isVideoHidden()) {
      pauseVideoHero();
      removeVideoHero();
      return;
    }

    if (!frameLive) {
      pauseVideoHero();
      return;
    }

    var worldKey = WORLD_MAP[document.body.getAttribute("data-world") || ""];
    if (!worldKey) return;

    prefetchVideo(worldKey);

    var homeInner = getHomeInner();
    if (!homeInner) return;

    var videoHero = document.getElementById("alWorldVideoHero");

    document.body.setAttribute("data-welten-video-hero", "1");

    if (!videoHero) {
      videoHero = buildHero(worldKey);
      var anchor = getHeroAnchor();
      if (anchor && anchor.parentNode === homeInner) {
        if (anchor.nextSibling) {
          homeInner.insertBefore(videoHero, anchor.nextSibling);
        } else {
          homeInner.appendChild(videoHero);
        }
      } else {
        homeInner.appendChild(videoHero);
      }
    } else {
      ensureVideoAfterHero();
      videoHero.className =
        "al-world-video-hero al-world-video-hero--" + worldKey + " al-world-video-hero--video-only";
      var video = videoHero.querySelector("video");
      var nextSrc = pickVideoSrc(worldKey);
      if (video && nextSrc && video.getAttribute("src") !== nextSrc) {
        resetVideoEl(video);
        video.setAttribute("src", nextSrc);
        video.setAttribute("poster", WORLDS[worldKey].poster);
        try {
          video.load();
        } catch (eLoad) {}
      }
    }

    watchHomeInner();
    resetHomeScroll();

    if (canPlayVideo() && !isVideoPlaying(videoHero && videoHero.querySelector("video"))) {
      restartAndPlay();
    } else if (!canPlayVideo()) {
      pauseVideoHero();
    }
  }

  function onViewportChange() {
    if (isVideoHidden()) {
      pauseVideoHero();
      removeVideoHero();
      return;
    }
    mountVideoHero();
  }

  function onSlideChange() {
    var slide = document.body.getAttribute("data-current-slide") || "home";
    if (slide === lastSlide) return;
    lastSlide = slide;
    if (!document.getElementById("alWorldVideoHero")) return;
    ensureVideoAfterHero();
    if (canPlayVideo()) {
      resetHomeScroll();
      restartAndPlay(slide === "home");
    } else {
      pauseVideoHero();
    }
  }

  function onWorldEnter() {
    gotWorldSignal = true;
    frameLive = true;
    frameVisible = false;
    enterAt = Date.now();
    mountVideoHero();
  }

  function onWorldReveal() {
    gotWorldSignal = true;
    frameLive = true;
    frameVisible = true;
    heroReadyForVideo = true;
    mountVideoHero();
    if (!isVideoPlaying(getVideoEl())) {
      restartAndPlay(true);
    }
  }

  function onWorldPause() {
    gotWorldSignal = true;
    frameLive = false;
    frameVisible = false;
    pauseVideoHero();
  }

  function boot() {
    lastSlide = document.body.getAttribute("data-current-slide") || "home";
    if (frameLive) {
      var worldKey = WORLD_MAP[document.body.getAttribute("data-world") || ""];
      if (worldKey) prefetchVideo(worldKey);
    }
    onViewportChange();
  }

  function bootOnce() {
    if (initialRevealDone) return;
    initialRevealDone = true;
    heroReadyForVideo = !isEmbedded();
    boot();
    setTimeout(tryEmbeddedInitialReveal, 200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootOnce);
  } else {
    bootOnce();
  }

  window.addEventListener("load", function () {
    if (!initialRevealDone) bootOnce();
  });

  if (mqNoVideo.addEventListener) {
    mqNoVideo.addEventListener("change", onViewportChange);
  } else if (mqNoVideo.addListener) {
    mqNoVideo.addListener(onViewportChange);
  }

  window.addEventListener("orientationchange", function () {
    setTimeout(onViewportChange, 120);
  });

  document.addEventListener("welten-chapter-change", function () {
    setTimeout(onSlideChange, 30);
  });

  window.addEventListener("message", function (e) {
    if (!e.data) return;
    if (e.data.type === "portfolio-world-enter") {
      onWorldEnter();
      return;
    }
    if (e.data.type === "portfolio-world-reveal") {
      onWorldReveal();
      return;
    }
    if (e.data.type === "mv-hero-ready") {
      heroReadyForVideo = true;
      return;
    }
    if (e.data.type === "portfolio-effects") {
      setTimeout(tryEmbeddedInitialReveal, 40);
      return;
    }
    if (e.data.type === "portfolio-world-pause" || e.data.type === "portfolio-cleanup-transition") {
      onWorldPause();
    }
  });

  try {
    lastSlide = document.body.getAttribute("data-current-slide") || "home";
    new MutationObserver(function () {
      onSlideChange();
    }).observe(document.body, {
      attributes: true,
      attributeFilter: ["data-current-slide"],
    });
  } catch (e) {}

  window.WeltenVideoHero = {
    version: VER,
    remount: boot,
    prefetch: prefetchVideo,
    ensureOnTop: ensureVideoAfterHero,
    restart: restartAndPlay,
    getOffset: function () {
      return 0;
    },
  };
})();
