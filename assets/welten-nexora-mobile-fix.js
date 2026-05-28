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
    if (slideHome) {
      slideHome.classList.add("active");
      slideHome.style.setProperty("overflow-y", "auto", "important");
      slideHome.style.setProperty("-webkit-overflow-scrolling", "touch", "important");
      slideHome.style.setProperty("touch-action", "pan-y", "important");
    }
    document
      .querySelectorAll(
        "#dnaStage, .home-hero-experience, #slide-home, #slide-home .slide-inner--home, " +
          "#slide-home .home-main-block, #slide-home .welten-mobile-hero-title, " +
          "#slide-home .welten-mobile-hero-meta, #slide-home .nexora-orbit-buttons, " +
          "#slide-home .nexora-orbit-ring, #slide-home .nexora-orbit-button"
      )
      .forEach(function (el) {
        el.classList.remove("is-dragging");
        el.style.setProperty("touch-action", "pan-y", "important");
        el.style.setProperty("overflow", "visible", "important");
        el.style.setProperty("height", "auto", "important");
        el.style.setProperty("min-height", "0", "important");
        el.style.setProperty("max-height", "none", "important");
      });
    document.querySelectorAll("#slide-home .nexora-orbit-buttons").forEach(function (shell) {
      shell.style.setProperty("position", "relative", "important");
      shell.style.setProperty("top", "auto", "important");
      shell.style.setProperty("bottom", "auto", "important");
      shell.style.setProperty("left", "auto", "important");
      shell.style.setProperty("transform", "none", "important");
      shell.style.setProperty("pointer-events", "auto", "important");
    });
    document.querySelectorAll("#slide-home .nexora-orbit-button").forEach(function (btn) {
      btn.style.setProperty("position", "relative", "important");
      btn.style.setProperty("transform", "none", "important");
      btn.style.setProperty("touch-action", "pan-y", "important");
    });
    document.documentElement.style.pointerEvents = "";
    document.body.style.pointerEvents = "";
    document.documentElement.style.touchAction = "pan-y";
    document.body.style.touchAction = "pan-y";
  }

  function blockDesktopOrbitScript() {
    document.querySelectorAll("#slide-home .home-hero-experience").forEach(function (hero) {
      hero.dataset.nexoraOrbitCore = "1";
    });
  }

  function bindHeroScrollFallback() {
    if (document.documentElement.dataset.nexoraHeroScrollBound === "1") return;
    document.documentElement.dataset.nexoraHeroScrollBound = "1";
    var startY = 0;
    var startX = 0;
    var lastY = 0;
    var dragging = false;

    function activeHome() {
      if (!document.body || document.body.getAttribute("data-world") !== "nexora") return false;
      var current = document.body.getAttribute("data-current-slide");
      if (current === "home" || !current) return true;
      var slideHome = document.getElementById("slide-home");
      return !!(slideHome && slideHome.classList.contains("active"));
    }

    document.addEventListener(
      "touchstart",
      function (e) {
        if (!activeHome()) return;
        if (!e.touches || !e.touches[0]) return;
        var t = e.touches[0];
        startY = t.clientY;
        startX = t.clientX;
        lastY = t.clientY;
        dragging = false;
      },
      { passive: true, capture: true }
    );

    document.addEventListener(
      "touchmove",
      function (e) {
        if (!activeHome()) return;
        if (!e.touches || !e.touches[0]) return;
        var t = e.touches[0];
        var dy = t.clientY - startY;
        var dx = t.clientX - startX;
        if (!dragging && Math.abs(dy) > Math.abs(dx) + 6) dragging = true;
        if (!dragging) return;

        var slideHome = document.getElementById("slide-home");
        if (!slideHome) return;
        slideHome.scrollTop += lastY - t.clientY;
        lastY = t.clientY;
      },
      { passive: true, capture: true }
    );
  }

  function stabilize() {
    if (typeof window.stopWorldTransitionRaf === "function") {
      window.stopWorldTransitionRaf();
    }
    blockDesktopOrbitScript();
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
    bindHeroScrollFallback();
    setTimeout(unlockHeroScroll, 0);
    setTimeout(unlockHeroScroll, 120);
    setTimeout(unlockHeroScroll, 350);
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

  window.WeltenNexoraMobileFix = { stabilize: stabilize, unlockHeroScroll: unlockHeroScroll, version: "20260528e" };
})();
