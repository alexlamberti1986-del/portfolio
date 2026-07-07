/**
 * Video-Hero Trial — nur auf Home: Header → Video → Hero → Inhalt.
 * Handy + Tablet: kein Video. Nur Desktop/Laptop. Unterseiten: kein Video.
 */
(function () {
  "use strict";

  var VER = "20260707video-hero-v8";
  var ENABLED = true;
  var mqNoVideo = window.matchMedia("(max-width: 1024px)");
  var mqLargeDesktop = window.matchMedia("(min-width: 1601px)");
  var prefetched = {};
  var homeObserver = null;

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
      desktop: "assets/videos/multiversum-hero-1080.mp4",
      mobile: "assets/videos/multiversum-hero-720.mp4",
    },
    nexora: {
      label: "Nexora",
      poster: "assets/videos/nexora-poster.jpg",
      desktop: "assets/videos/nexora-hero-1080.mp4",
      mobile: "assets/videos/nexora-hero-720.mp4",
    },
    professional: {
      label: "Professional",
      poster: "assets/videos/professional-poster.jpg",
      desktop: "assets/videos/professional-hero-1080.mp4",
      mobile: "assets/videos/professional-hero-720.mp4",
    },
    freiraum: {
      label: "Freiraum",
      poster: "assets/videos/freiraum-poster.jpg",
      desktop: "assets/videos/freiraum-hero-1080.mp4",
      mobile: "assets/videos/freiraum-hero-720.mp4",
    },
  };

  function isVideoHidden() {
    return mqNoVideo.matches;
  }

  function pickVideoSrc(worldKey) {
    var w = WORLDS[worldKey];
    if (!w) return "";
    if (worldKey === "multiversum") return w.mobile;
    return mqLargeDesktop.matches ? w.desktop : w.mobile;
  }

  function isHomeActive() {
    var slideHome = document.getElementById("slide-home");
    if (!slideHome) return false;
    if (slideHome.classList.contains("active")) return true;
    var current = document.body.getAttribute("data-current-slide");
    return !current || current === "home";
  }

  function getHomeInner() {
    var slideHome = document.getElementById("slide-home");
    return slideHome && slideHome.querySelector(".slide-inner");
  }

  function prefetchVideo(worldKey) {
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

  function pauseVideoHero() {
    var video = document.querySelector("#alWorldVideoHero video");
    if (!video) return;
    video.pause();
  }

  function markVideoReady(section, video) {
    if (!section || !video) return;
    section.classList.add("is-video-ready");
    video.style.opacity = "1";
  }

  function playWhenReady(section, video) {
    if (!video) return;
    var started = false;

    function tryPlay() {
      if (started) return;
      started = true;
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

    if (video.readyState >= 4) {
      tryPlay();
      return;
    }

    video.addEventListener(
      "canplaythrough",
      function () {
        tryPlay();
      },
      { once: true }
    );

    video.addEventListener(
      "loadeddata",
      function () {
        if (video.readyState >= 3) {
          window.setTimeout(tryPlay, 120);
        }
      },
      { once: true }
    );

    window.setTimeout(function () {
      if (!started && video.readyState >= 2) tryPlay();
    }, 1800);
  }

  function playVideoHero() {
    var section = document.getElementById("alWorldVideoHero");
    var video = section && section.querySelector("video");
    if (!video) return;
    playWhenReady(section, video);
  }

  function buildHero(worldKey) {
    var w = WORLDS[worldKey];
    var src = pickVideoSrc(worldKey);
    var section = document.createElement("section");
    section.id = "alWorldVideoHero";
    section.className =
      "al-world-video-hero al-world-video-hero--" + worldKey + " al-world-video-hero--video-only";
    section.setAttribute("aria-label", w.label + " Video");
    section.innerHTML =
      '<div class="al-world-video-hero__media">' +
      '<video class="al-world-video-hero__video" autoplay muted loop playsinline preload="auto" poster="' +
      w.poster +
      '" src="' +
      src +
      '"></video></div>';

    var video = section.querySelector("video");
    if (video) {
      video.style.opacity = "0";
      video.setAttribute("webkit-playsinline", "");
      video.playsInline = true;
      video.addEventListener(
        "waiting",
        function () {
          section.classList.remove("is-video-ready");
        },
        false
      );
      video.addEventListener(
        "playing",
        function () {
          markVideoReady(section, video);
        },
        false
      );
      try {
        video.load();
      } catch (e) {}
      playWhenReady(section, video);
    }

    return section;
  }

  function ensureVideoOnTop() {
    var videoHero = document.getElementById("alWorldVideoHero");
    var homeInner = getHomeInner();
    if (!videoHero || !homeInner) return;
    if (homeInner.firstElementChild !== videoHero) {
      homeInner.insertBefore(videoHero, homeInner.firstElementChild);
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
        ensureVideoOnTop();
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

    var worldKey = WORLD_MAP[document.body.getAttribute("data-world") || ""];
    if (!worldKey) return;

    prefetchVideo(worldKey);

    var homeInner = getHomeInner();
    if (!homeInner) return;

    var videoHero = document.getElementById("alWorldVideoHero");

    document.body.setAttribute("data-welten-video-hero", "1");
    if (document.body.getAttribute("data-world") === "general") {
      document.body.classList.add("mv-home-ready");
    }

    if (!videoHero) {
      videoHero = buildHero(worldKey);
      homeInner.insertBefore(videoHero, homeInner.firstChild);
    } else {
      ensureVideoOnTop();
      var video = videoHero.querySelector("video");
      var nextSrc = pickVideoSrc(worldKey);
      if (video && nextSrc && video.getAttribute("src") !== nextSrc) {
        video.setAttribute("src", nextSrc);
        try {
          video.load();
        } catch (eLoad) {}
      }
    }

    watchHomeInner();
    resetHomeScroll();

    if (isHomeActive()) {
      playVideoHero();
    } else {
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
    if (!document.getElementById("alWorldVideoHero")) return;
    ensureVideoOnTop();
    if (isHomeActive() && !isVideoHidden()) {
      resetHomeScroll();
      playVideoHero();
    } else {
      pauseVideoHero();
    }
  }

  function boot() {
    var worldKey = WORLD_MAP[document.body.getAttribute("data-world") || ""];
    if (worldKey) prefetchVideo(worldKey);
    onViewportChange();
    onSlideChange();
    setTimeout(onViewportChange, 120);
    setTimeout(ensureVideoOnTop, 400);
    setTimeout(onViewportChange, 900);
    setTimeout(ensureVideoOnTop, 1400);
    setTimeout(onSlideChange, 900);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.addEventListener("load", boot);

  if (mqNoVideo.addEventListener) {
    mqNoVideo.addEventListener("change", onViewportChange);
  } else if (mqNoVideo.addListener) {
    mqNoVideo.addListener(onViewportChange);
  }

  if (mqLargeDesktop.addEventListener) {
    mqLargeDesktop.addEventListener("change", onViewportChange);
  } else if (mqLargeDesktop.addListener) {
    mqLargeDesktop.addListener(onViewportChange);
  }

  window.addEventListener("orientationchange", function () {
    setTimeout(onViewportChange, 120);
  });

  document.addEventListener("welten-chapter-change", function () {
    setTimeout(onSlideChange, 30);
  });

  window.addEventListener("message", function (e) {
    if (!e.data || e.data.type !== "portfolio-world-enter") return;
    setTimeout(boot, 40);
  });

  try {
    new MutationObserver(function () {
      onSlideChange();
    }).observe(document.body, {
      attributes: true,
      attributeFilter: ["data-current-slide", "class"],
    });
  } catch (e) {}

  window.WeltenVideoHero = {
    version: VER,
    remount: boot,
    prefetch: prefetchVideo,
    ensureOnTop: ensureVideoOnTop,
    getOffset: function () {
      var video = document.getElementById("alWorldVideoHero");
      if (!video || !isHomeActive() || isVideoHidden()) return 0;
      return video.offsetHeight || 0;
    },
  };
})();
