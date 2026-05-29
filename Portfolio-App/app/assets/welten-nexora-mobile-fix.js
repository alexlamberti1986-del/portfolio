/**
 * NEXORA — Touch/Tablet: Orbit/3D aus, natives Scrollen (kein Inline-Style-Hammer)
 */
(function () {
  "use strict";

  function isTouchUI() {
    if (window.WeltenTouchEnv && typeof window.WeltenTouchEnv.isTouch === "function") {
      return window.WeltenTouchEnv.isTouch();
    }
    return !!(
      window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 1280px)").matches
    );
  }

  if (!isTouchUI()) return;

  var stabilizeQueued = false;

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

  function hideDesktopOrbitLayers() {
    document.documentElement.classList.add("welten-nexora-list", "welten-nexora-scroll-ready");
    var hideSel =
      "#dnaOrbitGroup, .dna-orbit-group, .dna-unified-scene, .neuro-core, " +
      ".nexora-orbit-nav, .dna-premium-canvas, .dna-particles-canvas, " +
      "#dnaPremiumCanvas, #dnaParticlesCanvas, .dna-ring, .dna-slide";
    document.querySelectorAll(hideSel).forEach(function (el) {
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("visibility", "hidden", "important");
      el.style.setProperty("pointer-events", "none", "important");
    });
  }

  function unlockHeroScroll() {
    var slideHome = document.getElementById("slide-home");
    if (!slideHome) return;

    slideHome.classList.add("active");

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

  function stabilize() {
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

  window.WeltenNexoraMobileFix = { stabilize: stabilize, unlockHeroScroll: unlockHeroScroll, version: "20260530a" };
})();
