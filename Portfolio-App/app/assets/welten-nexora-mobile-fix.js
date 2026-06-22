/**
 * NEXORA — Touch/Tablet ≤1024px: Orbit/3D aus, natives Scrollen
 */
(function () {
  "use strict";

  var mqMobile = window.matchMedia("(max-width: 1024px)");

  function isMobileLayout() {
    if (window.WeltenTouchEnv && typeof window.WeltenTouchEnv.isMobileLayout === "function") {
      return window.WeltenTouchEnv.isMobileLayout();
    }
    return mqMobile.matches;
  }

  var hideSel =
    "#dnaOrbitGroup, .dna-orbit-group, .dna-unified-scene, .neuro-core, " +
    ".nexora-orbit-nav, .dna-premium-canvas, .dna-particles-canvas, " +
    "#dnaPremiumCanvas, #dnaParticlesCanvas, .dna-ring, .dna-slide";

  function releaseCapture(el) {
    if (!el || typeof el.releasePointerCapture !== "function") return;
    try {
      if (typeof el.hasPointerCapture === "function") {
        for (var i = 0; i < 20; i++) {
          if (el.hasPointerCapture(i)) el.releasePointerCapture(i);
        }
      }
    } catch (e) {}
  }

  function releaseAllCapture() {
    document
      .querySelectorAll("#dnaStage, .home-hero-experience, #dockScene, body")
      .forEach(releaseCapture);
  }

  function restoreDesktopHero() {
    document.documentElement.classList.remove("welten-nexora-list", "welten-nexora-scroll-ready");
    document.querySelectorAll(hideSel).forEach(function (el) {
      el.style.removeProperty("display");
      el.style.removeProperty("visibility");
      el.style.removeProperty("pointer-events");
    });
    document.querySelectorAll("#slide-home .home-hero-experience").forEach(function (hero) {
      delete hero.dataset.nexoraOrbitCore;
    });
  }

  function hideDesktopOrbitLayers() {
    document.documentElement.classList.add("welten-nexora-list", "welten-nexora-scroll-ready");
    document.querySelectorAll(hideSel).forEach(function (el) {
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("visibility", "hidden", "important");
      el.style.setProperty("pointer-events", "none", "important");
    });
  }

  function isHomeChapter() {
    var ch = document.body.getAttribute("data-current-slide");
    if (ch) return ch === "home";
    var active = document.querySelector(".slide.active[data-slide]");
    return !active || active.getAttribute("data-slide") === "home";
  }

  function unlockHeroScroll() {
    var slideHome = document.getElementById("slide-home");
    if (!slideHome) return;

    if (isHomeChapter()) {
      slideHome.classList.add("active");
    } else {
      slideHome.classList.remove("active");
    }

    document
      .querySelectorAll(
        "#dnaStage, .home-hero-experience, #slide-home .slide-inner--home, " +
          "#slide-home .home-main-block, #slide-home .welten-mobile-hero-title, " +
          "#slide-home .welten-mobile-hero-meta, #slide-home .nexora-orbit-buttons, " +
          "#slide-home .nexora-orbit-ring"
      )
      .forEach(function (el) {
        el.classList.remove("is-dragging");
      });

    document.querySelectorAll("#slide-home .home-hero-experience").forEach(function (hero) {
      hero.dataset.nexoraOrbitCore = "1";
    });

    document.documentElement.style.pointerEvents = "";
    document.body.style.pointerEvents = "";
    document.documentElement.style.touchAction = "";
    document.body.style.touchAction = "";
  }

  var stabilizeQueued = false;

  function stabilize() {
    if (!isMobileLayout()) {
      restoreDesktopHero();
      return;
    }

    if (typeof window.stopWorldTransitionRaf === "function") {
      window.stopWorldTransitionRaf();
    }
    hideDesktopOrbitLayers();
    unlockHeroScroll();
    releaseAllCapture();

    window.__portfolioWorldPaused = false;
    document.documentElement.classList.remove("welten-world-paused");

    if (window.WeltenMobilePerf && typeof window.WeltenMobilePerf.cleanup === "function") {
      window.WeltenMobilePerf.cleanup();
    }
    if (window.WeltenMobileHero && typeof window.WeltenMobileHero.refresh === "function") {
      window.WeltenMobileHero.refresh();
    }
  }

  function scheduleStabilize() {
    if (stabilizeQueued) return;
    stabilizeQueued = true;
    requestAnimationFrame(function () {
      stabilizeQueued = false;
      stabilize();
    });
  }

  if (!isMobileLayout()) {
    restoreDesktopHero();
    if (mqMobile.addEventListener) {
      mqMobile.addEventListener("change", stabilize);
    } else {
      mqMobile.addListener(stabilize);
    }
    window.WeltenNexoraMobileFix = {
      stabilize: stabilize,
      unlockHeroScroll: unlockHeroScroll,
      restoreDesktopHero: restoreDesktopHero,
      version: "20260622a",
    };
    return;
  }

  ["touchstart", "pointerup", "touchend", "pointercancel"].forEach(function (ev) {
    document.addEventListener(
      ev,
      function () {
        releaseAllCapture();
        document
          .querySelectorAll(".home-hero-experience.is-dragging, #dnaStage.is-dragging")
          .forEach(function (h) {
            h.classList.remove("is-dragging");
          });
      },
      { capture: true, passive: true }
    );
  });

  stabilize();
  window.addEventListener("load", stabilize, { once: true });
  window.addEventListener("pageshow", stabilize);

  if (mqMobile.addEventListener) {
    mqMobile.addEventListener("change", stabilize);
  } else {
    mqMobile.addListener(stabilize);
  }

  window.addEventListener("message", function (e) {
    if (
      e.data &&
      (e.data.type === "portfolio-world-enter" ||
        e.data.type === "portfolio-cleanup-transition" ||
        e.data.type === "portfolio-go-chapter")
    ) {
      scheduleStabilize();
    }
  });

  window.WeltenNexoraMobileFix = {
    stabilize: stabilize,
    unlockHeroScroll: unlockHeroScroll,
    restoreDesktopHero: restoreDesktopHero,
    version: "20260622a",
  };
})();
