/**
 * Welten — Mobile / Tablet / Performance
 */
(function () {
  "use strict";

  var mqTablet = window.matchMedia("(max-width: 1024px)");
  var mqCoarse = window.matchMedia("(hover: none) and (pointer: coarse)");
  var mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function isMobileContext() {
    return mqTablet.matches || mqCoarse.matches || mqReduce.matches;
  }

  function setMobileClasses() {
    var mobile = isMobileContext();
    var root = document.documentElement;
    root.classList.toggle("welten-mobile", mobile);
    root.classList.toggle("welten-desktop", !mobile);
    root.classList.toggle("welten-reduce-effects", mobile || mqReduce.matches);
    document.body.classList.toggle("welten-reduce-effects", mobile || mqReduce.matches);
  }

  function disableMousePaint() {
    var canvas = document.getElementById("weltenMousePaintCanvas");
    if (!canvas) return;
    if (isMobileContext()) {
      canvas.style.display = "none";
      canvas.style.opacity = "0";
      canvas.style.pointerEvents = "none";
    } else {
      canvas.style.display = "";
    }
  }

  function tuneParticleCanvas() {
    var pc = document.getElementById("particle-canvas");
    if (pc && isMobileContext()) {
      pc.style.opacity = "0";
      pc.style.pointerEvents = "none";
    }
  }

  function applyViewportUnits() {
    var root = document.documentElement;
    root.style.setProperty("--vvh", window.innerHeight + "px");
    root.style.setProperty("--vvw", window.innerWidth + "px");
    root.style.setProperty(
      "--vvh-inner",
      Math.max(320, window.innerHeight - 120) + "px"
    );
  }

  function allowHeroPanY() {
    applyViewportUnits();
    var hero = document.querySelector(".home-hero-experience");
    if (hero) {
      hero.style.touchAction = "pan-y";
      hero.style.overflow = "visible";
      hero.style.webkitOverflowScrolling = "touch";
    }
    var slideHome = document.getElementById("slide-home");
    if (slideHome) {
      slideHome.style.overflowY = "auto";
      slideHome.style.webkitOverflowScrolling = "touch";
      slideHome.style.overscrollBehaviorY = "contain";
    }
    if (!isMobileContext()) {
      var ring = document.querySelector(".nexora-orbit-buttons, .nexora-orbit-ring");
      if (ring) {
        ring.style.touchAction = "pan-x";
        ring.style.pointerEvents = "auto";
      }
    }
  }

  /** NEXORA: auf Handy keine Orbit-Transforms (nur Button-Liste) */
  function flattenNexoraOrbitOnMobile() {
    if (!isMobileContext()) return;
    document.documentElement.classList.add("welten-nexora-list");
    var shell = document.querySelector("#slide-home .nexora-orbit-buttons");
    if (!shell) return;
    shell.classList.add("welten-nexora-list-mode");
    shell.querySelectorAll(".nexora-orbit-button").forEach(function (btn) {
      btn.style.setProperty("transform", "none", "important");
      btn.style.setProperty("opacity", "1", "important");
      btn.style.setProperty("filter", "none", "important");
    });
  }

  /** Touch: DNA-Drag auf Handy aus – Scroll + NEXORA-Orbit-Skript übernehmen */
  function patchDnaDragOffOnTouch() {
    if (!isMobileContext()) return;
    document.querySelectorAll("#dnaStage, .home-hero-experience").forEach(function (hero) {
      if (hero.dataset.weltenNoDnaDrag === "1") return;
      hero.dataset.weltenNoDnaDrag = "1";
      hero.style.touchAction = "pan-y";
    });
  }

  function cleanupIframeTransition() {
    if (typeof window.cleanupWorldTransition === "function") {
      window.cleanupWorldTransition(document);
      return;
    }
    document
      .querySelectorAll(
        ".world-transition-overlay, .world-transition-canvas, #world-transition-overlay, .transition-overlay, .loading-overlay"
      )
      .forEach(function (el) {
        el.remove();
      });
    document.documentElement.classList.remove(
      "transition-active",
      "is-transitioning",
      "world-switching",
      "world-transition-lock",
      "locked",
      "welten-world-paused"
    );
    document.body.classList.remove(
      "transition-active",
      "is-transitioning",
      "world-switching",
      "locked"
    );
    document.documentElement.style.overflow = "";
    document.documentElement.style.pointerEvents = "";
    document.body.style.overflow = "";
    document.body.style.pointerEvents = "";
    document.body.style.touchAction = "";

    document.querySelectorAll(".home-hero-experience, #dnaStage").forEach(function (hero) {
      hero.classList.remove("is-dragging");
      hero.style.touchAction = "pan-y";
      hero.style.pointerEvents = "";
    });

    document.querySelectorAll("#weltenMousePaintCanvas, #particle-canvas").forEach(function (c) {
      c.style.pointerEvents = "none";
      if (window.matchMedia && window.matchMedia("(max-width: 1024px)").matches) {
        c.style.display = "none";
        c.style.opacity = "0";
      }
    });
  }

  function bindWorldPauseMessage() {
    var paused = false;
    var origRaf = window.requestAnimationFrame;
    var origCaf = window.cancelAnimationFrame;
    var blockedIds = new Map();
    var nextId = 1;

    window.__portfolioWorldPaused = false;

    function patchRaf() {
      if (window.__portfolioRafPatched) return;
      window.__portfolioRafPatched = true;
      window.requestAnimationFrame = function (cb) {
        if (window.__portfolioWorldPaused) return 0;
        var id = origRaf.call(window, cb);
        blockedIds.set(id, cb);
        return id;
      };
      window.cancelAnimationFrame = function (id) {
        blockedIds.delete(id);
        return origCaf.call(window, id);
      };
    }

    function setPaused(next) {
      paused = !!next;
      window.__portfolioWorldPaused = paused;
      document.documentElement.classList.toggle("welten-world-paused", paused);
      if (paused) {
        blockedIds.forEach(function (_cb, id) {
          origCaf.call(window, id);
        });
        blockedIds.clear();
      }
    }

    patchRaf();

    window.addEventListener("message", function (e) {
      if (!e.data) return;
      if (e.data.type === "portfolio-cleanup-transition") {
        cleanupIframeTransition();
        setPaused(false);
        return;
      }
      if (e.data.type === "portfolio-world-pause") {
        setPaused(!!e.data.paused);
        if (e.data.paused) cleanupIframeTransition();
        return;
      }
      if (e.data.type === "portfolio-world-enter") {
        setPaused(false);
        cleanupIframeTransition();
        document.querySelectorAll("#particle-canvas, #weltenMousePaintCanvas").forEach(function (c) {
          if (isMobileContext()) {
            c.style.display = "none";
            c.style.opacity = "0";
          } else {
            c.style.display = "";
          }
          c.style.pointerEvents = "none";
        });
        window.dispatchEvent(new Event("resize"));
      }
    });
  }

  function bindVisibilityPause() {
    function onVis() {
      document.documentElement.classList.toggle("welten-page-hidden", document.hidden);
    };
    document.addEventListener("visibilitychange", onVis);
    onVis();
  }

  function observeActiveSlide() {
    var slides = document.querySelectorAll(".slide");
    if (!slides.length || typeof IntersectionObserver === "undefined") return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          entry.target.classList.toggle("welten-slide-inview", entry.isIntersecting);
        });
      },
      { root: null, threshold: 0.08 }
    );
    slides.forEach(function (s) {
      io.observe(s);
    });
  }

  function apply() {
    setMobileClasses();
    disableMousePaint();
    tuneParticleCanvas();
    allowHeroPanY();
    patchDnaDragOffOnTouch();
    flattenNexoraOrbitOnMobile();
  }

  apply();
  window.addEventListener("resize", applyViewportUnits, { passive: true });
  window.addEventListener("orientationchange", function () {
    setTimeout(apply, 150);
  });
  if (mqTablet.addEventListener) {
    mqTablet.addEventListener("change", apply);
    mqCoarse.addEventListener("change", apply);
    mqReduce.addEventListener("change", apply);
  } else {
    mqTablet.addListener(apply);
    mqCoarse.addListener(apply);
    mqReduce.addListener(apply);
  }

  bindWorldPauseMessage();
  bindVisibilityPause();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observeActiveSlide);
  } else {
    observeActiveSlide();
  }

  window.WeltenMobilePerf = {
    isMobile: isMobileContext,
    refresh: apply,
  };
})();
