/**
 * Video-Hero Trial — Video vor dem Home-Hero, Hero direkt darunter.
 * Handy: kein Video. Tablet/Desktop/Laptop: adaptives Video.
 */
(function () {
  "use strict";

  var VER = "20260707video-hero-v2";
  var ENABLED = true;
  var mqPhone = window.matchMedia("(max-width: 767px)");

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
    },
    nexora: {
      label: "Nexora",
      poster: "assets/videos/nexora-poster.jpg",
      desktop: "assets/videos/nexora-hero-1080.mp4",
    },
    professional: {
      label: "Professional",
      poster: "assets/videos/professional-poster.jpg",
      desktop: "assets/videos/professional-hero-1080.mp4",
    },
    freiraum: {
      label: "Freiraum",
      poster: "assets/videos/freiraum-poster.jpg",
      desktop: "assets/videos/freiraum-hero-1080.mp4",
    },
  };

  function isPhone() {
    return mqPhone.matches;
  }

  function removeVideoHero() {
    var hero = document.getElementById("alWorldVideoHero");
    if (hero) hero.remove();
    document.body.removeAttribute("data-welten-video-hero");
  }

  function pauseVideoHero() {
    var video = document.querySelector("#alWorldVideoHero video");
    if (video) {
      video.pause();
      video.removeAttribute("src");
      while (video.firstChild) video.removeChild(video.firstChild);
    }
  }

  function buildHero(worldKey) {
    var w = WORLDS[worldKey];
    var section = document.createElement("section");
    section.id = "alWorldVideoHero";
    section.className =
      "al-world-video-hero al-world-video-hero--" + worldKey + " al-world-video-hero--video-only";
    section.setAttribute("aria-label", w.label + " Video");
    section.innerHTML =
      '<div class="al-world-video-hero__media">' +
      '<video class="al-world-video-hero__video" autoplay muted loop playsinline preload="metadata" poster="' +
      w.poster +
      '">' +
      '<source src="' +
      w.desktop +
      '" type="video/mp4">' +
      "</video></div>";

    var video = section.querySelector("video");
    if (video) video.play().catch(function () {});

    return section;
  }

  function mountVideoHero() {
    if (!ENABLED) return;

    if (isPhone()) {
      pauseVideoHero();
      removeVideoHero();
      return;
    }

    var worldKey = WORLD_MAP[document.body.getAttribute("data-world") || ""];
    if (!worldKey) return;

    var slidesRoot = document.getElementById("slidesRoot");
    if (!slidesRoot || !slidesRoot.parentNode) return;

    var videoHero = document.getElementById("alWorldVideoHero");

    document.body.setAttribute("data-welten-video-hero", "1");
    if (document.body.getAttribute("data-world") === "general") {
      document.body.classList.add("mv-home-ready");
    }

    if (!videoHero) {
      videoHero = buildHero(worldKey);
    }

    slidesRoot.parentNode.insertBefore(videoHero, slidesRoot);
  }

  function onViewportChange() {
    if (isPhone()) {
      pauseVideoHero();
      removeVideoHero();
      return;
    }
    mountVideoHero();
  }

  function boot() {
    onViewportChange();
    setTimeout(onViewportChange, 120);
    setTimeout(onViewportChange, 600);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.addEventListener("load", boot);

  if (mqPhone.addEventListener) {
    mqPhone.addEventListener("change", onViewportChange);
  } else if (mqPhone.addListener) {
    mqPhone.addListener(onViewportChange);
  }

  window.addEventListener("orientationchange", function () {
    setTimeout(onViewportChange, 120);
  });

  window.WeltenVideoHero = { version: VER, remount: boot };
})();
