/**
 * Welten — Mobile / Tablet / Performance
 */
(function () {
  "use strict";

  var mqTablet = window.matchMedia("(max-width: 1024px)");
  var mqCoarse = window.matchMedia("(hover: none) and (pointer: coarse)");
  var mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function isMobileContext() {
    if (mqReduce.matches) return true;
    return mqTablet.matches || mqCoarse.matches;
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
    if (document.body && document.body.getAttribute("data-world") === "general") {
      var rm = document.getElementById("particle-canvas");
      if (rm) rm.remove();
      return;
    }
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
    window.__portfolioWorldPaused = false;

    function setPaused(next) {
      window.__portfolioWorldPaused = !!next;
      document.documentElement.classList.toggle("welten-world-paused", window.__portfolioWorldPaused);
      if (window.WeltenRuntimePerf) {
        if (window.__portfolioWorldPaused) window.WeltenRuntimePerf.pauseAnimations();
        else window.WeltenRuntimePerf.resumeAnimations();
      }
    }

    window.addEventListener("message", function (e) {
      if (!e.data) return;
      if (e.data.type === "portfolio-cleanup-transition") {
        cleanupIframeTransition();
        return;
      }
      if (e.data.type === "portfolio-world-pause") {
        setPaused(!!e.data.paused);
        cleanupIframeTransition();
        return;
      }
      if (e.data.type === "portfolio-world-enter") {
        setPaused(false);
        cleanupIframeTransition();
        disableMousePaint();
        tuneParticleCanvas();
        ensureWorldUnpaused();
        requestAnimationFrame(function () {
          apply();
        });
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

  function removeMobileBottomChrome() {
    if (!isMobileContext()) return;
    document.documentElement.style.setProperty("--dock-h", "0px");
    document.querySelectorAll(
      ".chapter-dock, #dockScene, #progressRail, .progress-rail, .welten-site-footer"
    ).forEach(function (el) {
      el.remove();
    });
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
    var slidesRoot = document.querySelector("main.slides-root, #slidesRoot");
    if (slidesRoot) {
      slidesRoot.style.paddingTop = "0";
      slidesRoot.style.paddingBottom = "0";
      slidesRoot.style.marginTop = headerH + "px";
    }
    document.querySelectorAll(".slide.active").forEach(function (slide) {
      slide.style.top = "0";
      slide.style.bottom = "0";
      slide.style.maxHeight = "100%";
    });
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

  function isInIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  function openMailTelLink(href) {
    if (!href) return;

    if (isInIframe()) {
      try {
        window.parent.postMessage({ type: "portfolio-open-external", href: href }, "*");
      } catch (e) {}
      try {
        window.top.location.href = href;
        return;
      } catch (e2) {}
    }

    try {
      window.location.href = href;
    } catch (e3) {
      window.open(href, "_blank", "noopener,noreferrer");
    }
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
        openMailTelLink(href);
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

  function pauseOffscreenMedia() {
    var videos = document.querySelectorAll("video");
    if (!videos.length) return;
    if (typeof IntersectionObserver === "undefined") {
      videos.forEach(function (v) {
        try {
          if (document.hidden) v.pause();
        } catch (e) {}
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var v = entry.target;
          try {
            if (entry.isIntersecting && !document.hidden) {
              if (v.dataset.weltenAutoplay === "1" && v.paused) {
                var p = v.play();
                if (p && p.catch) p.catch(function () {});
              }
            } else if (!v.paused) {
              v.pause();
            }
          } catch (err) {}
        });
      },
      { root: null, threshold: 0.12 }
    );
    videos.forEach(function (v) {
      if (v.hasAttribute("autoplay") || v.dataset.autoplay === "1") {
        v.dataset.weltenAutoplay = "1";
      }
      io.observe(v);
    });
  }

  function apply() {
    setMobileClasses();
    disableMousePaint();
    tuneParticleCanvas();
    allowHeroPanY();
    patchDnaDragOffOnTouch();
    flattenNexoraOrbitOnMobile();
    removeMobileBottomChrome();
    fixSlidesLayout();
    wireMobileHeroNav();
    ensureWorldUnpaused();
    pauseOffscreenMedia();
  }

  apply();
  var throttledViewport = window.WeltenRuntimePerf
    ? window.WeltenRuntimePerf.rafThrottle(applyViewportUnits)
    : applyViewportUnits;
  window.addEventListener("resize", throttledViewport, { passive: true });
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

  var throttledLayout = window.WeltenRuntimePerf
    ? window.WeltenRuntimePerf.rafThrottle(function () {
        applyViewportUnits();
        fixSlidesLayout();
      })
    : function () {
        applyViewportUnits();
        fixSlidesLayout();
      };
  window.addEventListener("resize", throttledLayout, { passive: true });

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
