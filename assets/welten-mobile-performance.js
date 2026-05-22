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
    var ring = document.querySelector(".nexora-orbit-buttons, .nexora-orbit-ring");
    if (ring) {
      ring.style.touchAction = "pan-x";
      ring.style.pointerEvents = "auto";
    }
  }

  /** Touch: vertikal = Seite scrollen, horizontal = Orbit (NEXORA) / keine Pointer-Capture */
  function patchHeroTouchAxis() {
    if (!isMobileContext()) return;
    var hero =
      document.getElementById("dnaStage") ||
      document.querySelector("#slide-home .home-hero-experience");
    if (!hero || hero.dataset.weltenTouchAxis === "1") return;
    hero.dataset.weltenTouchAxis = "1";

    var touch = null;

    hero.addEventListener(
      "pointerdown",
      function (e) {
        if (e.pointerType === "mouse") return;
        if (
          e.target.closest(
            ".dna-slide, .nexora-orbit-button, .nexora-orbit-buttons, .nexora-orbit-ring, .nexora-orbit-nav__btn, button, a, .btn"
          )
        ) {
          return;
        }
        touch = {
          id: e.pointerId,
          x: e.clientX,
          y: e.clientY,
          mode: null,
        };
        e.stopImmediatePropagation();
      },
      true
    );

    hero.addEventListener(
      "pointermove",
      function (e) {
        if (!touch || e.pointerId !== touch.id) return;
        var dx = e.clientX - touch.x;
        var dy = e.clientY - touch.y;
        if (touch.mode === "scroll") return;
        if (!touch.mode) {
          if (Math.abs(dy) > Math.abs(dx) + 10) {
            touch.mode = "scroll";
            return;
          }
          if (Math.abs(dx) > 14 && Math.abs(dx) > Math.abs(dy) * 1.15) {
            touch.mode = "orbit";
          }
        }
      },
      true
    );

    function endTouch(e) {
      if (touch && e.pointerId === touch.id) touch = null;
    }
    hero.addEventListener("pointerup", endTouch, true);
    hero.addEventListener("pointercancel", endTouch, true);
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
    patchHeroTouchAxis();
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
