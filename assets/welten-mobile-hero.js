/**
 * Mobile Hero — DOM + Stylesheet (NEXORA · PROFESSIONAL · FREIRAUM)
 */
(function () {
  "use strict";

  var HERO_VER = "20260527a";
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

  /** 3×3 Grid + Kontakt separat (Mobile/Tablet) */
  var HERO_GRID_ORDER = [
    "about",
    "profile",
    "values",
    "strengths",
    "experience",
    "projects",
    "workstyle",
    "why",
    "faq",
  ];

  function isHeroMobile() {
    return mqHero.matches;
  }

  function ensureStylesheetLock() {
    if (!isHeroMobile()) return;
    if (document.getElementById("welten-mobile-hero-stylesheet")) return;
    var id = "welten-mobile-hero-stylesheet-lock";
    if (document.getElementById(id)) return;
    var link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "assets/welten-mobile-hero.css?v=" + HERO_VER;
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

  function getHeroButtonContext() {
    var world = document.body.getAttribute("data-world");
    if (world === "nexora") {
      var shell = document.querySelector("#slide-home .nexora-orbit-buttons");
      return {
        shell: shell,
        ring: shell ? shell.querySelector(".nexora-orbit-ring") : null,
        selector: "#slide-home .nexora-orbit-button",
      };
    }
    var group = document.querySelector("#slide-home .dna-orbit-group");
    return {
      shell: group,
      ring: document.querySelector("#slide-home .dna-ring"),
      selector: "#slide-home .dna-slide",
    };
  }

  function ensureContactRow(shell) {
    if (!shell) return null;
    var row = shell.querySelector(":scope > .hero-contact-button-row");
    if (!row) {
      row = document.createElement("div");
      row.className = "hero-contact-button-row";
      shell.appendChild(row);
    }
    return row;
  }

  function restructureHeroButtons() {
    if (!isHeroMobile()) return;

    var ctx = getHeroButtonContext();
    if (!ctx.shell || !ctx.ring) return;

    ctx.shell.classList.add("hero-buttons-shell");
    ctx.ring.classList.add("hero-buttons-grid", "welten-mobile-hero-grid");

    var buttons = Array.from(document.querySelectorAll(ctx.selector));
    if (!buttons.length) return;

    var byGo = {};
    var contactBtn = null;

    buttons.forEach(function (btn) {
      var go = btn.getAttribute("data-go");
      btn.classList.add("hero-button");
      btn.style.setProperty("position", "relative", "important");
      btn.style.setProperty("transform", "none", "important");
      btn.style.setProperty("opacity", "1", "important");
      btn.style.setProperty("left", "auto", "important");
      btn.style.setProperty("top", "auto", "important");
      btn.style.setProperty("right", "auto", "important");
      btn.style.setProperty("bottom", "auto", "important");
      if (go === "contact") contactBtn = btn;
      else byGo[go] = btn;
    });

    HERO_GRID_ORDER.forEach(function (go) {
      if (byGo[go]) ctx.ring.appendChild(byGo[go]);
    });

    var contactRow = ensureContactRow(ctx.shell);
    if (contactRow && contactBtn) {
      contactRow.appendChild(contactBtn);
    }

    ctx.ring.style.setProperty("display", "grid", "important");
    ctx.ring.style.setProperty("transform", "none", "important");
  }

  function resetHeroButtonDom() {
    document
      .querySelectorAll(
        ".hero-buttons-shell, .hero-buttons-grid, .hero-button, .hero-contact-button-row"
      )
      .forEach(function (el) {
        el.classList.remove(
          "hero-buttons-shell",
          "hero-buttons-grid",
          "hero-button"
        );
      });
    var row = document.querySelector("#slide-home .hero-contact-button-row");
    if (!row) return;
    var contact = row.querySelector("[data-go='contact']");
    var ring =
      document.querySelector("#slide-home .nexora-orbit-ring") ||
      document.querySelector("#slide-home .dna-ring");
    if (contact && ring) ring.appendChild(contact);
    row.remove();
  }

  function disableNexoraOrbitOnMobile() {
    if (!isHeroMobile() || document.body.getAttribute("data-world") !== "nexora") return;
    document.querySelectorAll("#slide-home .nexora-orbit-nav").forEach(function (nav) {
      nav.style.setProperty("display", "none", "important");
      nav.style.setProperty("pointer-events", "none", "important");
    });
    var hero = document.querySelector("#slide-home .home-hero-experience");
    if (hero) {
      hero.classList.remove("is-dragging");
      hero.style.touchAction = "pan-y";
      hero.style.overflow = "visible";
      hero.style.pointerEvents = "";
      hero.style.height = "auto";
      hero.style.minHeight = "auto";
    }
    document.querySelectorAll("#slide-home .neuro-core, #slide-home .nexora-orbit-nav").forEach(function (el) {
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("pointer-events", "none", "important");
    });
  }

  function buildNexoraHero() {
    var stage = document.getElementById("dnaStage");
    if (!stage) return;
    var cfg = WORLDS.nexora;
    ensureTitle(stage, cfg.title);
    ensureMeta(stage, cfg.keywords);
    flattenNexoraButtons();
    restructureHeroButtons();
    disableNexoraOrbitOnMobile();
  }

  function buildFreiraumHero() {
    var scene = document.querySelector("#slide-home .dna-unified-scene");
    if (!scene) return;
    var cfg = WORLDS.freiraum;
    ensureTitle(scene, cfg.title);
    ensureMeta(scene, cfg.keywords);
    flattenFreiraumButtons();
    restructureHeroButtons();
  }

  function buildProfessionalHero() {
    var scene = document.querySelector("#slide-home .dna-unified-scene");
    if (!scene) return;
    var cfg = WORLDS.vertex;
    ensureTitle(scene, cfg.title);
    ensureMeta(scene, cfg.keywords);
    flattenProButtons();
    restructureHeroButtons();
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
      resetHeroButtonDom();
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

  function afterNavigation() {
    disableNexoraOrbitOnMobile();
    if (window.WeltenMobilePerf && typeof window.WeltenMobilePerf.cleanup === "function") {
      window.WeltenMobilePerf.cleanup();
    }
    setTimeout(boot, 40);
  }

  document.addEventListener(
    "click",
    function (e) {
      if (!isHeroMobile()) return;
      if (e.target.closest('[data-go], .nexora-orbit-button, .dna-slide')) {
        afterNavigation();
      }
    },
    true
  );

  window.addEventListener("message", function (e) {
    if (e.data && e.data.type === "portfolio-world-enter") {
      setTimeout(boot, 50);
      afterNavigation();
    }
    if (e.data && e.data.type === "portfolio-cleanup-transition") {
      afterNavigation();
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
