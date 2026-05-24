/**
 * Mobile Hero — DOM + Stylesheet (NEXORA · PROFESSIONAL · FREIRAUM)
 */
(function () {
  "use strict";

  var HERO_VER = "20260524a";
  var mqHero = window.matchMedia("(max-width: 1024px)");

  var WORLDS = {
    nexora: {
      title: "NEXORA",
      keywords: "STRATEGIE · TECHNOLOGIE · ZUKUNFT",
    },
    freiraum: {
      title: "FREIRAUM",
      keywords: "KREATIVITÄT · IDEEN · BEGEISTERUNG",
    },
    vertex: {
      title: "PROFESSIONAL",
      keywords: "STRATEGIE · STRUKTUR · WIRKUNG",
    },
  };

  function isHeroMobile() {
    return mqHero.matches;
  }

  function ensureStylesheetLock() {
    if (!isHeroMobile()) return;
    var id = "welten-mobile-hero-stylesheet-lock";
    var href = "assets/welten-mobile-hero.css?v=" + HERO_VER;
    var existing = document.getElementById(id);
    if (existing) {
      if (existing.getAttribute("href") !== href) existing.setAttribute("href", href);
      return;
    }
    var link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    document.body.appendChild(link);
  }

  function metaHtml(keywords) {
    return (
      '<div class="welten-mobile-hero-line" aria-hidden="true">' +
      "<span></span><span></span><span></span></div>" +
      '<p class="welten-mobile-hero-keywords">' +
      keywords +
      "</p>"
    );
  }

  function ensureTitle(container, title) {
    if (!container) return null;
    var el = container.querySelector(":scope > .welten-mobile-hero-title");
    if (!el) {
      el = document.createElement("div");
      el.className = "welten-mobile-hero-title";
      el.textContent = title;
      container.insertBefore(el, container.firstChild);
    } else {
      el.textContent = title;
    }
    return el;
  }

  function ensureMeta(container, keywords) {
    if (!container) return null;
    var meta = container.querySelector(":scope > .welten-mobile-hero-meta");
    if (!meta) {
      meta = document.createElement("div");
      meta.className = "welten-mobile-hero-meta";
      meta.innerHTML = metaHtml(keywords);
      var buttons =
        container.querySelector(".nexora-orbit-buttons") ||
        container.querySelector(".dna-orbit-group");
      if (buttons) {
        container.insertBefore(meta, buttons);
      } else {
        container.appendChild(meta);
      }
    } else {
      var kw = meta.querySelector(".welten-mobile-hero-keywords");
      if (kw) kw.textContent = keywords;
    }
    return meta;
  }

  function buildNexoraHero() {
    var stage = document.getElementById("dnaStage");
    if (!stage) return;
    var cfg = WORLDS.nexora;
    ensureTitle(stage, cfg.title);
    ensureMeta(stage, cfg.keywords);
    flattenNexoraButtons();
  }

  function buildFreiraumHero() {
    var scene = document.querySelector("#slide-home .dna-unified-scene");
    if (!scene) return;
    var cfg = WORLDS.freiraum;
    ensureTitle(scene, cfg.title);
    ensureMeta(scene, cfg.keywords);
    flattenFreiraumButtons();
  }

  function buildProfessionalHero() {
    var scene = document.querySelector("#slide-home .dna-unified-scene");
    if (!scene) return;
    var cfg = WORLDS.vertex;
    ensureTitle(scene, cfg.title);
    ensureMeta(scene, cfg.keywords);
    flattenProButtons();
  }

  function markHeroGrid(ring) {
    if (ring) ring.classList.add("welten-mobile-hero-grid");
  }

  function flattenNexoraButtons() {
    var ring = document.querySelector("#slide-home .nexora-orbit-ring");
    markHeroGrid(ring);
    if (ring) {
      ring.style.setProperty("display", "grid", "important");
      ring.style.setProperty("transform", "none", "important");
    }
    document.querySelectorAll("#slide-home .nexora-orbit-button").forEach(function (btn) {
      btn.style.setProperty("position", "relative", "important");
      btn.style.setProperty("transform", "none", "important");
      btn.style.setProperty("opacity", "1", "important");
    });
    document.querySelectorAll("#slide-home .neuro-core, #slide-home .nexora-orbit-nav").forEach(function (el) {
      el.style.setProperty("display", "none", "important");
    });
  }

  function flattenFreiraumButtons() {
    var ring = document.querySelector("#slide-home .dna-ring");
    markHeroGrid(ring);
    if (ring) {
      ring.style.setProperty("display", "grid", "important");
      ring.style.setProperty("transform", "none", "important");
    }
    document.querySelectorAll("#slide-home .dna-slide").forEach(function (btn) {
      btn.style.setProperty("position", "relative", "important");
      btn.style.setProperty("left", "auto", "important");
      btn.style.setProperty("top", "auto", "important");
      btn.style.setProperty("transform", "none", "important");
      btn.style.setProperty("opacity", "1", "important");
    });
  }

  function flattenProButtons() {
    var ring = document.querySelector("#slide-home .dna-ring");
    markHeroGrid(ring);
    if (ring) {
      ring.style.setProperty("display", "grid", "important");
      ring.style.setProperty("transform", "none", "important");
    }
    document.querySelectorAll("#slide-home .dna-slide").forEach(function (btn) {
      btn.style.setProperty("position", "relative", "important");
      btn.style.setProperty("transform", "none", "important");
    });
  }

  function buildMobileHeroDom() {
    if (!isHeroMobile()) {
      document.body.classList.remove("welten-mobile-hero-active");
      document.documentElement.classList.remove("welten-mobile-hero");
      return;
    }
    document.body.classList.add("welten-mobile-hero-active");
    document.documentElement.classList.add("welten-mobile-hero");
    ensureStylesheetLock();

    var world = document.body.getAttribute("data-world");
    if (world === "nexora") buildNexoraHero();
    if (world === "freiraum") buildFreiraumHero();
    if (world === "vertex") buildProfessionalHero();
  }

  function watchNexoraStage() {
    var stage = document.getElementById("dnaStage");
    if (!stage || stage.__weltenHeroObs) return;
    stage.__weltenHeroObs = true;
    var obs = new MutationObserver(function () {
      if (isHeroMobile() && document.body.getAttribute("data-world") === "nexora") {
        buildNexoraHero();
      }
    });
    obs.observe(stage, { childList: true, subtree: true });
  }

  function boot() {
    buildMobileHeroDom();
    if (isHeroMobile() && document.body.getAttribute("data-world") === "nexora") {
      watchNexoraStage();
    }
  }

  window.addEventListener("message", function (e) {
    if (e.data && e.data.type === "portfolio-world-enter") {
      buildMobileHeroDom();
    }
  });

  window.addEventListener("load", boot);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  if (mqHero.addEventListener) {
    mqHero.addEventListener("change", boot);
  } else {
    mqHero.addListener(boot);
  }

  window.WeltenMobileHero = { refresh: boot, version: HERO_VER };
})();
