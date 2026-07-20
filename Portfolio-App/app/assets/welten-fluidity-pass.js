/**
 * Fluidity Pass — maximale Laufglätte ohne Layout-Umbau.
 * - Pausiert Videos/Canvas bei Tab-Hide / Welt-Pause
 * - Spielt Hero-Video nur wenn sichtbar
 * - Senkt Last adaptiv bei schwachem Frame-Timing
 * - GPU-Hints für Galaxy-Iframe + Video
 */
(function (global) {
  "use strict";

  var VER = "20260720fluid1";
  var mqDesktop = null;
  var videoIo = null;
  var adaptiveTimer = 0;
  var lowFpsStreak = 0;

  function isDesktop() {
    try {
      if (!mqDesktop) mqDesktop = window.matchMedia("(min-width: 1025px)");
      return !!mqDesktop.matches;
    } catch (e) {
      return (window.innerWidth || 0) >= 1025;
    }
  }

  function pauseAllVideos() {
    document.querySelectorAll("video").forEach(function (v) {
      try {
        if (!v.paused) v.pause();
      } catch (e) {}
    });
  }

  function pauseGalaxyFrame() {
    var frame = document.getElementById("alGalaxyGangFrame");
    if (!frame) return;
    try {
      if (frame.contentWindow) {
        frame.contentWindow.postMessage({ type: "portfolio-world-pause", paused: true }, "*");
      }
    } catch (e) {}
  }

  function resumeGalaxyFrame() {
    var frame = document.getElementById("alGalaxyGangFrame");
    if (!frame) return;
    try {
      if (frame.contentWindow) {
        frame.contentWindow.postMessage({ type: "portfolio-world-pause", paused: false }, "*");
      }
    } catch (e) {}
  }

  function syncDocumentState() {
    var root = document.documentElement;
    var hidden = !!document.hidden;
    root.classList.toggle("welten-tab-hidden", hidden);
    if (hidden) {
      pauseAllVideos();
      pauseGalaxyFrame();
      if (global.WeltenRuntimePerf && typeof global.WeltenRuntimePerf.pauseAnimations === "function") {
        global.WeltenRuntimePerf.pauseAnimations();
      }
    } else {
      resumeGalaxyFrame();
      if (global.WeltenRuntimePerf && typeof global.WeltenRuntimePerf.resumeAnimations === "function") {
        global.WeltenRuntimePerf.resumeAnimations();
      }
      kickVisibleVideo();
    }
  }

  function canPlayHeroVideo() {
    if (document.hidden) return false;
    if (rootHas("welten-world-paused") || rootHas("welten-page-hidden")) return false;
    if (rootHas("mv-effects-off") || rootHas("welten-reduce-effects")) {
      /* Video-Hero darf auch bei Effekte-Aus laufen — nur Partikel stoppen */
    }
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    } catch (e) {}
    return true;
  }

  function rootHas(cls) {
    return document.documentElement.classList.contains(cls) ||
      (document.body && document.body.classList.contains(cls));
  }

  function kickVisibleVideo() {
    if (!canPlayHeroVideo()) {
      pauseAllVideos();
      return;
    }
    var section = document.getElementById("alWorldVideoHero");
    var video = section && section.querySelector("video");
    if (!video || !section) return;
    var rect = section.getBoundingClientRect();
    var vh = window.innerHeight || 1;
    var visible = rect.bottom > 40 && rect.top < vh - 40 && rect.height > 20;
    if (!visible) {
      try {
        video.pause();
      } catch (e) {}
      return;
    }
    try {
      video.muted = true;
      var p = video.play();
      if (p && typeof p.catch === "function") p.catch(function () {});
    } catch (e2) {}
  }

  function bindVideoObserver() {
    if (videoIo || typeof IntersectionObserver === "undefined") return;
    videoIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var video = entry.target.querySelector
            ? entry.target.querySelector("video")
            : entry.target.tagName === "VIDEO"
              ? entry.target
              : null;
          if (!video) {
            if (entry.target.tagName === "VIDEO") video = entry.target;
            else return;
          }
          if (entry.isIntersecting && entry.intersectionRatio >= 0.18 && canPlayHeroVideo()) {
            try {
              video.muted = true;
              var p = video.play();
              if (p && typeof p.catch === "function") p.catch(function () {});
            } catch (e) {}
          } else {
            try {
              video.pause();
            } catch (e2) {}
          }
        });
      },
      { root: null, threshold: [0, 0.18, 0.35, 0.6], rootMargin: "48px 0px" }
    );

    function observe() {
      var hero = document.getElementById("alWorldVideoHero");
      if (hero && videoIo) videoIo.observe(hero);
      document.querySelectorAll("#alWorldVideoHero video, .al-world-video-hero video").forEach(function (v) {
        try {
          videoIo.observe(v.parentElement || v);
        } catch (e) {}
      });
    }
    observe();
    var mo = new MutationObserver(observe);
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  function promoteGpuLayers() {
    var frame = document.getElementById("alGalaxyGangFrame");
    if (frame) {
      frame.style.transform = "translateZ(0)";
      frame.style.backfaceVisibility = "hidden";
    }
    var galaxy = document.getElementById("alGalaxyGangHero");
    if (galaxy) {
      galaxy.style.transform = "translateZ(0)";
      galaxy.style.contain = "layout paint";
    }
  }

  function adaptiveLoad() {
    if (!isDesktop() || document.hidden) return;
    if (!global.performance || typeof performance.now !== "function") return;
    var samples = [];
    var last = performance.now();
    var frames = 0;
    function tick(now) {
      frames += 1;
      var dt = now - last;
      last = now;
      if (dt > 0 && dt < 120) samples.push(dt);
      if (frames < 45) {
        requestAnimationFrame(tick);
        return;
      }
      if (!samples.length) return;
      var sum = 0;
      for (var i = 0; i < samples.length; i++) sum += samples[i];
      var avg = sum / samples.length;
      /* > ~22 fps Mittel → Last drosseln */
      if (avg > 45) {
        lowFpsStreak += 1;
      } else {
        lowFpsStreak = Math.max(0, lowFpsStreak - 1);
      }
      if (lowFpsStreak >= 2) {
        document.documentElement.classList.add("welten-fluidity-soft");
      } else if (lowFpsStreak === 0) {
        document.documentElement.classList.remove("welten-fluidity-soft");
      }
    }
    requestAnimationFrame(tick);
  }

  function scheduleAdaptive() {
    if (adaptiveTimer) clearTimeout(adaptiveTimer);
    adaptiveTimer = setTimeout(adaptiveLoad, 900);
  }

  function onMessage(e) {
    if (!e || !e.data || !e.data.type) return;
    var t = e.data.type;
    if (t === "portfolio-world-pause" && e.data.paused) {
      pauseAllVideos();
    }
    if (t === "portfolio-world-enter" || t === "portfolio-world-reveal") {
      setTimeout(kickVisibleVideo, 80);
      scheduleAdaptive();
    }
  }

  function boot() {
    document.documentElement.setAttribute("data-welten-fluidity", VER);
    syncDocumentState();
    bindVideoObserver();
    promoteGpuLayers();
    scheduleAdaptive();
    document.addEventListener("visibilitychange", syncDocumentState);
    window.addEventListener("message", onMessage);
    window.addEventListener("pageshow", function () {
      syncDocumentState();
      kickVisibleVideo();
    });
    window.addEventListener(
      "scroll",
      function () {
        /* Nur sichtbares Video halten — throttled via IO; hier no-op soft */
      },
      { passive: true }
    );
    document.addEventListener("mv-effects-change", function () {
      setTimeout(kickVisibleVideo, 40);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  global.WeltenFluidity = {
    version: VER,
    kickVisibleVideo: kickVisibleVideo,
    pauseAllVideos: pauseAllVideos,
  };
})(window);
