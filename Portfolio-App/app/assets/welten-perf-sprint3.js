/**
 * Sprint 3 — Bildoptimierung, LCP, Lazy-Load, Preconnect
 */
(function () {
  "use strict";

  var PRECONNECT = [
    "https://www.google.com",
    "https://maps.google.com",
    "https://genialbau.ch",
    "https://gallace-all-in-maler.ch",
  ];

  function addPreconnect() {
    PRECONNECT.forEach(function (origin) {
      if (document.querySelector('link[rel="preconnect"][href="' + origin + '"]')) return;
      var link = document.createElement("link");
      link.rel = "preconnect";
      link.href = origin;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    });
  }

  function currentWorldKey() {
    var w = document.body.getAttribute("data-world") || "vertex";
    if (w === "vertex") return "vertex";
    if (w === "freiraum") return "freiraum";
    return "nexora";
  }

  function applyPortraitSrcset(img, isHero) {
    if (!img || img.dataset.perfSrcset === "1") return;
    var key = currentWorldKey();
    var srcset = window.PORTFOLIO_IMAGE_SRCSET && window.PORTFOLIO_IMAGE_SRCSET[key];
    var fallback = window.PORTFOLIO_INLINE_IMAGES && window.PORTFOLIO_INLINE_IMAGES[key];
    if (!fallback) return;

    img.dataset.perfSrcset = "1";
    img.decoding = "async";
    img.setAttribute("loading", isHero ? "eager" : "lazy");
    if (isHero && "fetchPriority" in img) {
      img.fetchPriority = "high";
    }

    if (srcset) {
      img.srcset = srcset;
      img.sizes = window.PORTFOLIO_IMAGE_SIZES || "(max-width: 768px) 88vw, 400px";
    }
    if (!img.getAttribute("src") || img.src.indexOf("data:image/gif") === 0) {
      img.src = fallback;
    }
  }

  function enhancePortraits() {
    applyPortraitSrcset(document.getElementById("heroPhoto"), true);
    applyPortraitSrcset(document.getElementById("contactPhoto"), false);
  }

  function lazyBackgrounds() {
    document.querySelectorAll("[style*='nexora-virtual'], .nexora-virtual-bg").forEach(function () {});
    var brain = document.querySelector(".neuro-core, .home-hero-experience");
    if (brain) brain.style.contentVisibility = "auto";
  }

  function deferOffscreenIframes() {
    document.querySelectorAll("iframe[data-lazy-src]:not([src])").forEach(function (frame) {
      frame.setAttribute("loading", "lazy");
    });
  }

  function optimizeImages() {
    document.querySelectorAll("img:not([loading])").forEach(function (img) {
      if (img.id === "heroPhoto") return;
      if (img.closest("#slide-home") && img.classList.contains("portrait-photo")) return;
      img.loading = "lazy";
      img.decoding = "async";
    });
  }

  function injectLcpPreload() {
    var key = currentWorldKey();
    var href =
      window.PORTFOLIO_INLINE_IMAGES && window.PORTFOLIO_INLINE_IMAGES[key];
    if (!href || document.querySelector('link[data-welten-lcp="1"]')) return;
    var link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = href;
    link.type = href.indexOf(".png") !== -1 ? "image/png" : "image/webp";
    link.setAttribute("data-welten-lcp", "1");
    link.setAttribute("fetchpriority", "high");
    document.head.appendChild(link);
  }

  function apply() {
    addPreconnect();
    injectLcpPreload();
    enhancePortraits();
    lazyBackgrounds();
    deferOffscreenIframes();
    optimizeImages();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }

  document.addEventListener("welten-chapter-change", function () {
    enhancePortraits();
  });

  window.WeltenPerfSprint3 = { apply: apply, enhancePortraits: enhancePortraits };
})();
