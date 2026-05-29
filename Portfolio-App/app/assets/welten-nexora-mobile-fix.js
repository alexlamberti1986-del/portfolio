/**
 * NEXORA — Touch/Tablet: Orbit/3D aus, Scroll + Navigation stabil
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
    document.documentElement.classList.add("welten-nexora-list");
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
    slideHome.style.setProperty("position", "absolute", "important");
    slideHome.style.setProperty("top", "var(--header-h, 56px)", "important");
    slideHome.style.setProperty("bottom", "var(--dock-h, 0px)", "important");
    slideHome.style.setProperty("left", "0", "important");
    slideHome.style.setProperty("right", "0", "important");
    slideHome.style.setProperty("width", "100%", "important");
    slideHome.style.setProperty("height", "100%", "important");
    slideHome.style.setProperty("min-height", "0", "important");
    slideHome.style.setProperty("max-height", "none", "important");
    slideHome.style.setProperty("overflow-y", "auto", "important");
    slideHome.style.setProperty("overflow-x", "hidden", "important");
    slideHome.style.setProperty("-webkit-overflow-scrolling", "touch", "important");
    slideHome.style.setProperty("touch-action", "pan-y", "important");

    document
      .querySelectorAll(
        "#dnaStage, .home-hero-experience, #slide-home .slide-inner--home, " +
          "#slide-home .home-main-block, #slide-home .welten-mobile-hero-title, " +
          "#slide-home .welten-mobile-hero-meta, #slide-home .nexora-orbit-buttons, " +
          "#slide-home .nexora-orbit-ring"
      )
      .forEach(function (el) {
        el.classList.remove("is-dragging");
        el.style.setProperty("touch-action", "pan-y", "important");
        el.style.setProperty("overflow", "visible", "important");
        el.style.setProperty("height", "auto", "important");
        el.style.setProperty("min-height", "0", "important");
        el.style.setProperty("max-height", "none", "important");
        el.style.removeProperty("max-height");
      });

    document.querySelectorAll("#slide-home .nexora-orbit-buttons").forEach(function (shell) {
      shell.style.setProperty("position", "relative", "important");
      shell.style.setProperty("top", "auto", "important");
      shell.style.setProperty("bottom", "auto", "important");
      shell.style.setProperty("left", "auto", "important");
      shell.style.setProperty("transform", "none", "important");
    });

    document.querySelectorAll("#slide-home .nexora-orbit-button").forEach(function (btn) {
      btn.style.setProperty("position", "relative", "important");
      btn.style.setProperty("transform", "none", "important");
      btn.style.setProperty("touch-action", "manipulation", "important");
    });

    document.documentElement.style.pointerEvents = "";
    document.body.style.pointerEvents = "";
    document.documentElement.style.touchAction = "";
    document.body.style.touchAction = "";
  }

  function blockDesktopOrbitScript() {
    document.querySelectorAll("#slide-home .home-hero-experience").forEach(function (hero) {
      hero.dataset.nexoraOrbitCore = "1";
    });
  }

  function bindHeroScrollFallback() {
    var slideHome = document.getElementById("slide-home");
    if (!slideHome || slideHome.dataset.nexoraHeroScrollBound === "1") return;
    slideHome.dataset.nexoraHeroScrollBound = "1";

    var lastY = 0;

    slideHome.addEventListener(
      "touchstart",
      function (e) {
        if (!e.touches || !e.touches.length) return;
        lastY = e.touches[0].clientY;
      },
      { passive: true }
    );

    slideHome.addEventListener(
      "touchmove",
      function (e) {
        if (!e.touches || !e.touches.length) return;
        var y = e.touches[0].clientY;
        var dy = lastY - y;
        if (!dy) return;

        if (slideHome.scrollHeight > slideHome.clientHeight + 2) {
          var maxScroll = slideHome.scrollHeight - slideHome.clientHeight;
          var next = Math.max(0, Math.min(maxScroll, slideHome.scrollTop + dy));
          if (next !== slideHome.scrollTop) {
            slideHome.scrollTop = next;
            e.preventDefault();
          }
        }
        lastY = y;
      },
      { passive: false }
    );
  }

  function stabilize() {
    if (typeof window.stopWorldTransitionRaf === "function") {
      window.stopWorldTransitionRaf();
    }
    blockDesktopOrbitScript();
    hideDesktopOrbitLayers();
    unlockHeroScroll();
    bindHeroScrollFallback();
    releaseAllCapture();

    window.__portfolioWorldPaused = false;
    document.documentElement.classList.remove("welten-world-paused");

    if (window.WeltenMobilePerf && typeof window.WeltenMobilePerf.cleanup === "function") {
      window.WeltenMobilePerf.cleanup();
    }
    if (window.WeltenMobileHero && typeof window.WeltenMobileHero.refresh === "function") {
      window.WeltenMobileHero.refresh();
    }

    setTimeout(unlockHeroScroll, 0);
    setTimeout(unlockHeroScroll, 120);
    setTimeout(unlockHeroScroll, 400);
  }

  ["touchstart", "pointerdown", "pointercancel", "pointerup", "touchend"].forEach(function (ev) {
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
  window.addEventListener("load", stabilize);
  window.addEventListener("pageshow", stabilize);

  window.addEventListener("message", function (e) {
    if (
      e.data &&
      (e.data.type === "portfolio-world-enter" ||
        e.data.type === "portfolio-cleanup-transition" ||
        e.data.type === "portfolio-go-chapter")
    ) {
      setTimeout(stabilize, 0);
      setTimeout(stabilize, 150);
      setTimeout(stabilize, 400);
    }
  });

  window.WeltenNexoraMobileFix = { stabilize: stabilize, unlockHeroScroll: unlockHeroScroll, version: "20260529a" };
})();
