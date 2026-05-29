/**
 * Welten — Mobile / Tablet / Performance
 */
(function () {
  "use strict";

  var mqTablet = window.matchMedia("(max-width: 1024px)");
  var mqCoarse = window.matchMedia("(hover: none) and (pointer: coarse)");
  var mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function isMobileContext() {
    if (window.WeltenTouchEnv && typeof window.WeltenTouchEnv.isTouch === "function") {
      return window.WeltenTouchEnv.isTouch() || mqReduce.matches;
    }
    return (
      mqTablet.matches ||
      mqCoarse.matches ||
      mqReduce.matches ||
      window.matchMedia("(max-width: 1280px)").matches
    );
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
      "welten-world-paused",
      "no-scroll",
      "scroll-locked",
      "menu-open"
    );
    document.body.classList.remove(
      "transition-active",
      "is-transitioning",
      "world-switching",
      "locked",
      "no-scroll",
      "scroll-locked",
      "menu-open",
      "is-dragging"
    );
    document.documentElement.style.overflow = "";
    document.documentElement.style.pointerEvents = "";
    document.documentElement.style.touchAction = "";
    document.body.style.overflow = "";
    document.body.style.pointerEvents = "";
    document.body.style.touchAction = "";
    document.body.style.position = "";
    document.body.style.height = "";

    document.querySelectorAll(".home-hero-experience, #dnaStage").forEach(function (hero) {
      hero.classList.remove("is-dragging");
      hero.style.touchAction = "pan-y";
      hero.style.pointerEvents = "";
      hero.style.overflow = "visible";
      if (isMobileContext()) {
        hero.style.height = "auto";
        hero.style.minHeight = "auto";
        hero.style.maxHeight = "none";
      }
      if (typeof hero.releasePointerCapture === "function") {
        try {
          if (hero.hasPointerCapture && hero.hasPointerCapture()) {
            hero.releasePointerCapture(hero.pointerId || 0);
          }
        } catch (err2) {}
      }
    });

    document.querySelectorAll("#weltenMousePaintCanvas, #particle-canvas").forEach(function (c) {
      c.style.pointerEvents = "none";
      if (isMobileContext()) {
        c.style.display = "none";
        c.style.opacity = "0";
      }
    });

    if (window.WeltenMobileHero && typeof window.WeltenMobileHero.refresh === "function") {
      window.WeltenMobileHero.refresh();
    }
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
        var shouldPause = !!e.data.paused;
        if (isMobileContext()) {
          shouldPause = false;
        }
        setPaused(shouldPause);
        cleanupIframeTransition();
        return;
      }
      if (e.data.type === "portfolio-world-enter") {
        setPaused(false);
        cleanupIframeTransition();
        apply();
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
        setTimeout(function () {
          cleanupIframeTransition();
          apply();
        }, 120);
        setTimeout(function () {
          cleanupIframeTransition();
        }, 400);
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

  function ensureWorldUnpaused() {
    window.__portfolioWorldPaused = false;
    document.documentElement.classList.remove("welten-world-paused");
  }

  function fixSlidesLayout() {
    if (!isMobileContext()) {
      document.documentElement.style.removeProperty("--header-h");
      document.documentElement.style.removeProperty("--dock-h");
      return;
    }
    var header = document.querySelector(".site-header");
    var headerH = header ? Math.ceil(header.getBoundingClientRect().height) : 56;
    if (headerH < 40) headerH = 56;
    var dockH = 0;
    document.documentElement.style.setProperty("--header-h", headerH + "px");
    document.documentElement.style.setProperty("--dock-h", dockH + "px");
  }

  function wireMobileHeroNav() {
    if (!isMobileContext()) return;
    document
      .querySelectorAll(
        "#slide-home .nexora-orbit-button[data-go], #slide-home .dna-slide[data-go], #slide-home .hero-button[data-go]"
      )
      .forEach(function (btn) {
        if (btn.dataset.weltenMobileNav === "1") return;
        btn.dataset.weltenMobileNav = "1";
        btn.addEventListener(
          "click",
          function (e) {
            if (!isMobileContext()) return;
            var id = btn.getAttribute("data-go");
            if (!id) return;
            e.preventDefault();
            e.stopPropagation();
            var link = document.querySelector('.menu-links a[data-go="' + id + '"]');
            if (link) link.click();
            else {
              var step = document.querySelector('.experience-step[data-go="' + id + '"]');
              if (step) step.click();
            }
            queueCleanup();
          },
          false
        );
      });
  }

  function bindMailTelLinks() {
    document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"]').forEach(function (a) {
      a.classList.add("welten-mailtel-link");
    });

    document.addEventListener(
      "click",
      function (e) {
        var a = e.target.closest && e.target.closest('a[href^="mailto:"], a[href^="tel:"]');
        if (!a) return;
        var href = a.getAttribute("href");
        if (!href) return;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        window.location.assign(href);
      },
      true
    );
  }

  function queueCleanup() {
    ensureWorldUnpaused();
    cleanupIframeTransition();
    requestAnimationFrame(function () {
      cleanupIframeTransition();
      fixSlidesLayout();
    });
    setTimeout(function () {
      cleanupIframeTransition();
      fixSlidesLayout();
    }, 80);
    setTimeout(cleanupIframeTransition, 250);
  }

  function bindNavigationCleanup() {
    document.addEventListener(
      "click",
      function (e) {
        if (!isMobileContext()) return;
        if (e.target.closest('a[href^="mailto:"], a[href^="tel:"]')) return;
        var nav = e.target.closest(
          "[data-go], .nexora-orbit-button, .dna-slide, .btn-menu, .menu-links a, .dock-card, .experience-step"
        );
        if (nav) queueCleanup();
      },
      true
    );
  }

  function apply() {
    setMobileClasses();
    disableMousePaint();
    tuneParticleCanvas();
    allowHeroPanY();
    patchDnaDragOffOnTouch();
    flattenNexoraOrbitOnMobile();
    fixSlidesLayout();
    wireMobileHeroNav();
    ensureWorldUnpaused();
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
  bindMailTelLinks();
  bindNavigationCleanup();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observeActiveSlide);
  } else {
    observeActiveSlide();
  }

  window.addEventListener("resize", function () {
    applyViewportUnits();
    fixSlidesLayout();
  }, { passive: true });

  window.addEventListener("load", wireMobileHeroNav);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireMobileHeroNav);
  }

  window.WeltenMobilePerf = {
    isMobile: isMobileContext,
    refresh: apply,
    cleanup: queueCleanup,
    wireNav: wireMobileHeroNav,
  };
})();
