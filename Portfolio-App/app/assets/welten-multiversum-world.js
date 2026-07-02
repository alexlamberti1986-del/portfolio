/**
 * MULTIVERSUM-Welt: eigenständig, ohne NEXORA (Preview).
 */
(function () {
  "use strict";

  var NAV = [
    { id: "home", label: "Home" },
    { id: "projects", label: "Projekte" },
    { id: "leistungen", label: "Leistungen" },
    { id: "about", label: "Über mich" },
    { id: "contact", label: "Kontakt" },
  ];

  function applyTheme() {
    document.body.setAttribute("data-world", "general");
    document.documentElement.classList.add("mv-world-general");
    document.body.classList.remove("welten-personality--nexora", "welten-personality--vertex", "welten-personality--freiraum");
    document.body.classList.add("welten-personality--general");
    document.querySelectorAll(".world-switch").forEach(function (el) {
      el.style.display = "none";
    });
    ["#particle-canvas", "#dnaPremiumCanvas", "#dnaParticlesCanvas", "#weltenMousePaintCanvas"].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) el.remove();
    });
    document.querySelectorAll(".bg-grid, .light-beams").forEach(function (el) {
      el.remove();
    });
  }

  function applyProfiles() {
    if (window.WeltenPreviewImages) {
      window.WeltenPreviewImages.applyPortraits();
      return;
    }
    var src =
      "assets/images/4welten-preview/general/" +
      encodeURIComponent("MULTIVERSUM PROFILBILD für HOME und Kontakt.png") +
      "?v=20260626-prof-neu";
    document.querySelectorAll(".home-portrait-card img, #contactPhoto, .contact-photo, #heroPhoto").forEach(function (img) {
      img.src = src;
      img.removeAttribute("srcset");
    });
  }

  function goChapter(id) {
    var step = document.querySelector('.experience-step[data-go="' + id + '"]');
    if (step) {
      step.click();
      return;
    }
    if (window.WeltenSiteIA && typeof window.WeltenSiteIA.navigateToChapter === "function") {
      window.WeltenSiteIA.navigateToChapter(id);
      return;
    }
    var link = document.querySelector('.menu-links a[data-go="' + id + '"]');
    if (link) link.click();
  }

  function isDesktopParallaxHero() {
    try {
      return window.matchMedia("(min-width: 1024px)").matches;
    } catch (e) {
      return window.innerWidth >= 1024;
    }
  }

  var PARALLAX_PRELOAD = [
    "assets/multiversum-v4/backgrounds/webp/background_deep_space_neutral.webp?v=20260629mv-v4live",
    "assets/multiversum-v4/backgrounds/webp/background_multiverse_three_worlds.webp?v=20260629mv-v4live",
    "assets/multiversum-parallax-v4/orbs/Multiversum.png?v=20260629mv-prof-portrait",
  ];

  function notifyHeroReady() {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: "mv-hero-ready" }, "*");
      }
    } catch (e) {}
  }

  function preloadUrls(urls) {
    urls.forEach(function (url) {
      var img = new Image();
      img.decoding = "async";
      img.src = url;
    });
  }

  if (document.body && document.body.getAttribute("data-world") === "general") {
    preloadUrls(PARALLAX_PRELOAD);
  }

  function buildStaticHero() {
    if (document.getElementById("mvStaticHero")) return;
    var stage = document.getElementById("dnaStage");
    if (!stage) return;

    var hero = document.createElement("div");
    hero.id = "mvStaticHero";
    hero.className = "mv-static-hero";
    hero.setAttribute("aria-label", "MULTIVERSUM");

    var navHtml = NAV.map(function (item) {
      return '<button type="button" class="mv-static-hero__nav-btn mv-form-btn" data-go="' + item.id + '">' + item.label + "</button>";
    }).join("");

    hero.innerHTML =
      '<div class="mv-static-hero__inner">' +
      '<p class="mv-static-hero__eyebrow">Alex Lamberti · Portfolio</p>' +
      '<h1 class="mv-static-hero__title">MULTIVERSUM</h1>' +
      '<p class="mv-static-hero__tag" data-i18n="home.tag">' +
      '<span class="mv-tag-blue">Vier Welten.</span> <span class="mv-tag-white">Ein Ziel.</span> <span class="mv-tag-warm">Deine Vision.</span></p>' +
      '<nav class="mv-static-hero__nav" aria-label="Kapitel">' +
      navHtml +
      "</nav></div>";

    stage.parentNode.insertBefore(hero, stage);
    stage.classList.add("mv-dna-hidden");
    stage.remove();

    hero.querySelectorAll("[data-go]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        goChapter(btn.getAttribute("data-go"));
      });
    });
    window.__mvParallaxHeroReady = true;
    notifyHeroReady();
  }

  function parallaxDepsReady() {
    return !!(window.MVWorldCollage && window.MVSceneConfig && window.MVParallaxHero);
  }

  function buildHero() {
    if (window.__mvHeroBootLock) return;
    if (document.getElementById("mvParallaxHero") || document.getElementById("mvStaticHero")) return;
    if (isDesktopParallaxHero() && !parallaxDepsReady()) return;

    window.__mvHeroBootLock = true;
    try {
      if (isDesktopParallaxHero() && typeof window.MVParallaxHero.build === "function" && window.MVParallaxHero.build(goChapter)) return;
      buildStaticHero();
    } finally {
      window.__mvHeroBootLock = false;
    }
  }

  function ensureParallaxHero() {
    buildHero();
    if (!isDesktopParallaxHero() || document.getElementById("mvParallaxHero")) return;
    if (!parallaxDepsReady()) return;
    var hero = document.getElementById("mvParallaxHero");
    if (!hero) return;
    var hasCards = hero.querySelector(".world-card__image img[src]");
    if (hasCards) return;
    hero.remove();
    window.__mvParallaxHeroReady = false;
    window.__mvHeroBootLock = false;
    buildHero();
  }

  document.addEventListener("mv-restore-hero", function () {
    buildHero();
  });

  function syncActiveNav() {
    var slide = document.body.getAttribute("data-current-slide") || "home";
    document.querySelectorAll(".mv-static-hero__nav-btn, .experience-step[data-go]").forEach(function (btn) {
      var go = btn.getAttribute("data-go");
      if (!go) return;
      btn.classList.toggle("is-active", go === slide);
    });
  }

  function injectContactForm() {
    if (window.WeltenContactLeadform && window.WeltenContactLeadform.syncLeadFormFrame) {
      window.WeltenContactLeadform.syncLeadFormFrame();
    }
  }

  function syncFromParent(data) {
    if (!data) return;
    var frame = document.getElementById("mvLeadForm");
    if (frame && frame.contentWindow) {
      try {
        frame.contentWindow.postMessage(
          { type: "alx-preview-sync", world: data.world || "general", lang: data.lang || "de" },
          "*"
        );
      } catch (e) {}
    }
    if (data.lang && window.WeltenPreviewI18nBridge) {
      window.WeltenPreviewI18nBridge.apply(data.lang);
    }
  }

  window.addEventListener("message", function (e) {
    if (!e.data) return;
    if (e.data.type === "alx-preview-sync") syncFromParent(e.data);
    if (e.data.type === "portfolio-preview-lang") syncFromParent({ lang: e.data.lang, world: "general" });
  });

  function styleMvButtons() {
    document.querySelectorAll(
      ".btn-menu, .btn-primary, .cta-btn, .btn-open, a.btn-open, .projects-accordion__trigger, .persona-tabs button"
    ).forEach(function (el) {
      el.classList.add("mv-form-btn");
      el.classList.remove("welten-textlink");
    });
  }

  function finishBoot() {
    buildHero();
    ensureParallaxHero();
    applyProfiles();
    injectContactForm();
    syncActiveNav();
    styleMvButtons();
    if (window.WeltenPreviewImages) {
      window.WeltenPreviewImages.patchChapterBoxes();
    }
  }

  function boot() {
    applyTheme();
    if (!isDesktopParallaxHero()) buildStaticHero();
    stripDecor();
    var bgRoot = document.querySelector(".bg-root");
    if (bgRoot && isDesktopParallaxHero()) bgRoot.remove();
    finishBoot();
    if (isDesktopParallaxHero()) preloadUrls(PARALLAX_PRELOAD);
  }

  function stripDecor() {
    ["#particle-canvas", "#dnaPremiumCanvas", "#dnaParticlesCanvas", "#weltenMousePaintCanvas"].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) el.remove();
    });
    document.querySelectorAll(".bg-grid, .light-beams").forEach(function (el) {
      el.remove();
    });
  }

  document.addEventListener("welten-chapter-change", function () {
    stripDecor();
    syncActiveNav();
    styleMvButtons();
    if (window.WeltenPreviewImages) window.WeltenPreviewImages.patchChapterBoxes();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  if (!isDesktopParallaxHero() && document.getElementById("dnaStage")) {
    try {
      applyTheme();
      buildStaticHero();
      stripDecor();
    } catch (e) {}
  }

  try {
    new MutationObserver(syncActiveNav).observe(document.body, {
      attributes: true,
      attributeFilter: ["data-current-slide"],
    });
  } catch (e) {}
})();
