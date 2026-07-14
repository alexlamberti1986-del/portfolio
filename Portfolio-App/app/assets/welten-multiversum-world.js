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
    { id: "offerte", label: "Offerte" },
  ];

  function applyTheme() {
    document.body.setAttribute("data-world", "general");
    document.documentElement.classList.add("mv-world-general");
    document.body.classList.remove("welten-personality--nexora", "welten-personality--vertex", "welten-personality--freiraum");
    document.body.classList.add("welten-personality--general");
    document.querySelectorAll(".world-switch").forEach(function (el) {
      el.style.display = "none";
    });
    document.querySelectorAll(".bg-root, .bg-grid, .light-beams").forEach(function (el) {
      el.remove();
    });
    ["#particle-canvas", "#dnaPremiumCanvas", "#dnaParticlesCanvas"].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) el.remove();
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
  var BOOT_STARTED_AT = Date.now();
  var HERO_BOOT_GRACE_MS = 2800;

  function parallaxDepsReady() {
    return !!(window.MVSceneConfig && window.MVParallaxHero);
  }

  function deferIdle(fn, timeout) {
    timeout = timeout || 1800;
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(fn, { timeout: timeout });
    } else {
      setTimeout(fn, 120);
    }
  }

  function notifyHeroReady() {
    if (window.__mvHeroReadySent) return;
    window.__mvHeroReadySent = true;
    function finish() {
      try {
        if (document.body) document.body.classList.add("mv-home-ready");
      } catch (e) {}
      try {
        document.dispatchEvent(new CustomEvent("mv-hero-ready"));
      } catch (eEv) {}
      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: "mv-hero-ready" }, "*");
        }
      } catch (e2) {}
    }
    finish();
  }

  function preloadUrls(urls) {
    urls.forEach(function (url) {
      var img = new Image();
      img.decoding = "async";
      img.src = url;
    });
  }

  if (document.body && document.body.getAttribute("data-world") === "general" && isDesktopParallaxHero()) {
    deferIdle(function () {
      preloadUrls(PARALLAX_PRELOAD);
    }, 2400);
  }

  function navLabels(lang) {
    lang = lang || "de";
    if (window.WeltenPreviewI18n && window.WeltenPreviewI18n.NAV) {
      var pack =
        (window.WeltenTranslations && window.WeltenTranslations.langPack(window.WeltenPreviewI18n.NAV, lang)) ||
        window.WeltenPreviewI18n.NAV[lang] ||
        window.WeltenPreviewI18n.NAV.de;
      return NAV.map(function (item) {
        return { id: item.id, label: pack[item.id] || item.label };
      });
    }
    return NAV;
  }

  function applyStaticHeroLang(lang) {
    var hero = document.getElementById("mvStaticHero");
    if (!hero) return;
    lang = lang || "de";
    navLabels(lang).forEach(function (item) {
      var btn = hero.querySelector('[data-go="' + item.id + '"]');
      if (btn) btn.textContent = item.label;
    });
    if (window.WeltenPreviewI18n && typeof window.WeltenPreviewI18n.applyHome === "function") {
      window.WeltenPreviewI18n.applyHome(document, "general", lang);
    }
    if (window.WeltenPreviewI18n && typeof window.WeltenPreviewI18n.applyAria === "function") {
      var a =
        (window.WeltenTranslations && window.WeltenTranslations.langPack(window.WeltenPreviewI18n.ARIA, lang)) ||
        (window.WeltenPreviewI18n.ARIA[lang] || window.WeltenPreviewI18n.ARIA.de);
      var navEl = hero.querySelector(".mv-static-hero__nav");
      if (navEl && a.mainNav) navEl.setAttribute("aria-label", a.mainNav);
    }
  }

  function buildStaticHero() {
    if (document.getElementById("mvStaticHero")) return;

    var stage = document.getElementById("dnaStage");
    var mount =
      stage ||
      document.querySelector("#slide-home .slide-inner--home") ||
      document.getElementById("slide-home") ||
      document.getElementById("slidesRoot") ||
      document.body;
    if (!mount) return;

    var hero = document.createElement("div");
    hero.id = "mvStaticHero";
    hero.className = "mv-static-hero";
    hero.setAttribute("aria-label", "MULTIVERSUM");

    var navHtml = navLabels().map(function (item) {
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

    if (stage && stage.parentNode) {
      stage.parentNode.insertBefore(hero, stage);
      stage.classList.add("mv-dna-hidden");
      stage.remove();
    } else if (mount.firstChild) {
      mount.insertBefore(hero, mount.firstChild);
    } else {
      mount.appendChild(hero);
    }

    hero.querySelectorAll("[data-go]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        goChapter(btn.getAttribute("data-go"));
      });
    });
    window.__mvParallaxHeroReady = true;
  }

  function waitForParallaxAndBuild(attempt) {
    attempt = attempt || 0;
    if (!isDesktopParallaxHero()) return;
    if (document.getElementById("mvParallaxHero")) return;
    if (parallaxDepsReady()) {
      buildHero();
      return;
    }
    if (attempt < 250) {
      window.setTimeout(function () {
        waitForParallaxAndBuild(attempt + 1);
      }, 40);
    } else if (!document.body.classList.contains("mv-home-ready")) {
      notifyHeroReady();
    }
  }

  function removeStaleDesktopHeroes() {
    if (!isDesktopParallaxHero()) return;
    var stale = document.getElementById("mvStaticHero");
    if (stale) stale.remove();
  }

  function buildHero() {
    if (window.__mvHeroBootLock) return;
    if (document.getElementById("mvParallaxHero")) return;
    if (isDesktopParallaxHero()) {
      removeStaleDesktopHeroes();
      if (!parallaxDepsReady()) return;
    } else if (document.getElementById("mvStaticHero")) {
      return;
    }

    window.__mvHeroBootLock = true;
    try {
      if (isDesktopParallaxHero() && typeof window.MVParallaxHero.build === "function") {
        if (window.MVParallaxHero.build(goChapter)) return;
        return;
      }
      buildStaticHero();
      notifyHeroReady();
    } finally {
      window.__mvHeroBootLock = false;
    }
  }

  function isBootGrace() {
    return Date.now() - BOOT_STARTED_AT < HERO_BOOT_GRACE_MS;
  }

  function ensureParallaxHero() {
    buildHero();
    if (!isDesktopParallaxHero()) return;
    if (document.getElementById("mvParallaxHero")) return;
    if (!parallaxDepsReady()) {
      if (isBootGrace()) window.setTimeout(ensureParallaxHero, 350);
      return;
    }
    if (isBootGrace()) window.setTimeout(ensureParallaxHero, 350);
  }

  document.addEventListener("mv-restore-hero", function () {
    if (isBootGrace()) return;
    buildHero();
  });

  function syncActiveNav() {
    var slide = document.body.getAttribute("data-current-slide") || "home";
    document.querySelectorAll(".mv-static-hero__nav-btn, .experience-step[data-go]").forEach(function (btn) {
      var go = btn.getAttribute("data-go");
      if (!go) return;
      btn.classList.toggle("is-active", go === slide);
    });
    if (window.WeltenDesktopChapterHero && typeof window.WeltenDesktopChapterHero.refresh === "function") {
      window.WeltenDesktopChapterHero.refresh();
    }
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
    if (!isDesktopParallaxHero()) {
      buildStaticHero();
      stripDecor();
      finishBoot();
      if (!document.body.classList.contains("mv-home-ready")) {
        notifyHeroReady();
      }
      return;
    }
    stripDecor();
    removeStaleDesktopHeroes();
    waitForParallaxAndBuild(0);
    finishBoot();
    window.setTimeout(function () {
      if (!document.getElementById("mvParallaxHero") && isDesktopParallaxHero()) {
        buildHero();
      }
      if (!document.body.classList.contains("mv-home-ready")) {
        notifyHeroReady();
      }
    }, 3000);
  }

  function stripDecor() {
    ["#particle-canvas", "#dnaPremiumCanvas", "#dnaParticlesCanvas"].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) el.remove();
    });
    document.querySelectorAll(".bg-grid, .light-beams").forEach(function (el) {
      el.remove();
    });
    if (!isDesktopParallaxHero()) {
      document
        .querySelectorAll(
          "#dnaStage, .home-hero-experience, .neuro-core, .dna-unified-scene, .dna-orbit-group, .dna-ring-scene"
        )
        .forEach(function (el) {
          if (el && el.id !== "mvStaticHero") el.remove();
        });
    }
  }

  document.addEventListener("welten-chapter-change", function () {
    stripDecor();
    syncActiveNav();
    styleMvButtons();
    if (window.WeltenPreviewImages) window.WeltenPreviewImages.patchChapterBoxes();
  });

  document.addEventListener("welten-lang-change", function (e) {
    var lang = (e && e.detail && e.detail.lang) || "de";
    applyStaticHeroLang(lang);
    syncActiveNav();
  });

  window.addEventListener("message", function (e) {
    if (!e.data) return;
    if (e.data.type === "portfolio-preview-lang" && e.data.lang) {
      applyStaticHeroLang(e.data.lang);
      syncActiveNav();
    }
  });

  function startBoot() {
    try {
      boot();
    } catch (e) {}
    /* Mobile/Tablet: falls Hero noch fehlt, erneut versuchen */
    if (!isDesktopParallaxHero() && !document.getElementById("mvStaticHero")) {
      setTimeout(function () {
        try {
          buildStaticHero();
          stripDecor();
          notifyHeroReady();
        } catch (err) {}
      }, 0);
      setTimeout(function () {
        if (!document.getElementById("mvStaticHero")) {
          try {
            buildStaticHero();
            notifyHeroReady();
          } catch (err2) {}
        }
      }, 200);
    }
  }

  if (document.body && (document.getElementById("dnaStage") || document.getElementById("slide-home"))) {
    startBoot();
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startBoot);
  } else {
    startBoot();
  }

  try {
    new MutationObserver(syncActiveNav).observe(document.body, {
      attributes: true,
      attributeFilter: ["data-current-slide"],
    });
  } catch (e) {}
})();
