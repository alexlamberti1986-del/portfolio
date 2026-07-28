/**
 * Design-Test V2 — Galaxy Walk labels, routes, layout & portrait crop.
 * Loaded only when galaxy iframe has ?v2=1 (see multiversum.js SRC).
 */
(function () {
  "use strict";

  if (!/\bv2=1\b/.test(String(location.search || ""))) return;

  /* Seed themed routes early so canonical-links picks them up */
  window.ALEX_GALAXY_ROUTE_OVERRIDE = {
    multiversum: {
      home: "/multiversum",
      "ueber-mich": "/multiversum/profil",
      leistungen: "/multiversum/dimensionen",
      projekte: "/multiversum/werke",
      kontakt: "/multiversum/signal",
    },
    nexora: {
      home: "/nexora",
      "ueber-mich": "/nexora/core",
      leistungen: "/nexora/module",
      projekte: "/nexora/cases",
      kontakt: "/nexora/uplink",
    },
    professional: {
      home: "/professional",
      "ueber-mich": "/professional/haltung",
      leistungen: "/professional/mandate",
      projekte: "/professional/referenzen",
      kontakt: "/professional/gespraech",
    },
    freiraum: {
      home: "/freiraum",
      "ueber-mich": "/freiraum/portrait",
      leistungen: "/freiraum/disziplinen",
      projekte: "/freiraum/collage",
      kontakt: "/freiraum/impuls",
    },
  };

  var LABELS_I18N = {
    de: {
      multiversum: { "ueber-mich": "Profil", leistungen: "Dimensionen", projekte: "Werke", kontakt: "Signal" },
      nexora: { "ueber-mich": "Core", leistungen: "Module", projekte: "Cases", kontakt: "Uplink" },
      professional: { "ueber-mich": "Haltung", leistungen: "Mandate", projekte: "Referenzen", kontakt: "Gespräch" },
      freiraum: { "ueber-mich": "Portrait", leistungen: "Disziplinen", projekte: "Collage", kontakt: "Impuls" },
    },
    en: {
      multiversum: { "ueber-mich": "Profile", leistungen: "Dimensions", projekte: "Works", kontakt: "Signal" },
      nexora: { "ueber-mich": "Core", leistungen: "Modules", projekte: "Cases", kontakt: "Uplink" },
      professional: { "ueber-mich": "Stance", leistungen: "Mandates", projekte: "References", kontakt: "Talk" },
      freiraum: { "ueber-mich": "Portrait", leistungen: "Disciplines", projekte: "Collage", kontakt: "Impulse" },
    },
    fr: {
      multiversum: { "ueber-mich": "Profil", leistungen: "Dimensions", projekte: "Œuvres", kontakt: "Signal" },
      nexora: { "ueber-mich": "Core", leistungen: "Modules", projekte: "Cases", kontakt: "Uplink" },
      professional: { "ueber-mich": "Posture", leistungen: "Mandats", projekte: "Références", kontakt: "Échange" },
      freiraum: { "ueber-mich": "Portrait", leistungen: "Disciplines", projekte: "Collage", kontakt: "Impulsion" },
    },
    it: {
      multiversum: { "ueber-mich": "Profilo", leistungen: "Dimensioni", projekte: "Opere", kontakt: "Segnale" },
      nexora: { "ueber-mich": "Core", leistungen: "Moduli", projekte: "Cases", kontakt: "Uplink" },
      professional: { "ueber-mich": "Atteggiamento", leistungen: "Mandati", projekte: "Referenze", kontakt: "Colloquio" },
      freiraum: { "ueber-mich": "Ritratto", leistungen: "Discipline", projekte: "Collage", kontakt: "Impulso" },
    },
  };

  function currentLang() {
    try {
      var lang =
        localStorage.getItem("mv-preview-lang") ||
        localStorage.getItem("mv-lang") ||
        "de";
      return LABELS_I18N[lang] ? lang : "de";
    } catch (e) {
      return "de";
    }
  }

  function labelsFor(lang) {
    return LABELS_I18N[lang] || LABELS_I18N.de;
  }

  var LABELS = labelsFor(currentLang());

  var PAGE_CLASS = {
    "ueber-mich": "subpage-1",
    leistungen: "subpage-2",
    projekte: "subpage-3",
    kontakt: "subpage-4",
  };

  /** V2 in-page hashes per world (matches design-test-v2 world HTML). */
  var V2_HASH = {
    multiversum: {
      home: "",
      "ueber-mich": "alex",
      leistungen: "leistungen",
      projekte: "werke",
      kontakt: "kontakt",
    },
    nexora: {
      home: "",
      "ueber-mich": "experience",
      leistungen: "services",
      projekte: "projects",
      kontakt: "kontakt",
    },
    professional: {
      home: "",
      "ueber-mich": "values",
      leistungen: "services",
      projekte: "projects",
      kontakt: "kontakt",
    },
    freiraum: {
      home: "",
      "ueber-mich": "about",
      leistungen: "skills",
      projekte: "collage",
      kontakt: "kontakt",
    },
  };

  /** Themed chapter path slugs (matches shell router / live menus). */
  var V2_CHAPTER = {
    multiversum: {
      home: "",
      "ueber-mich": "/profil",
      leistungen: "/dimensionen",
      projekte: "/werke",
      kontakt: "/signal",
    },
    nexora: {
      home: "",
      "ueber-mich": "/core",
      leistungen: "/module",
      projekte: "/cases",
      kontakt: "/uplink",
    },
    professional: {
      home: "",
      "ueber-mich": "/haltung",
      leistungen: "/mandate",
      projekte: "/referenzen",
      kontakt: "/gespraech",
    },
    freiraum: {
      home: "",
      "ueber-mich": "/portrait",
      leistungen: "/disziplinen",
      projekte: "/collage",
      kontakt: "/impuls",
    },
  };

  var PAGE_GO = {
    home: "home",
    "ueber-mich": "about",
    leistungen: "leistungen",
    projekte: "projects",
    kontakt: "contact",
  };

  var CHAPTER_SLUG_PAGE = {
    profil: "ueber-mich",
    core: "ueber-mich",
    haltung: "ueber-mich",
    portrait: "ueber-mich",
    "ueber-mich": "ueber-mich",
    dimensionen: "leistungen",
    module: "leistungen",
    mandate: "leistungen",
    disziplinen: "leistungen",
    leistungen: "leistungen",
    nexus: "leistungen",
    werke: "projekte",
    cases: "projekte",
    referenzen: "projekte",
    collage: "projekte",
    projekte: "projekte",
    signal: "kontakt",
    uplink: "kontakt",
    gespraech: "kontakt",
    impuls: "kontakt",
    kontakt: "kontakt",
  };

  var SMALL_I18N = {
    de: {
      multiversum: {
        "ueber-mich": "Persönlichkeit und Hintergrund",
        leistungen: "Digitale Dimensionen",
        projekte: "Werke und Referenzen",
        kontakt: "Direkter Einstieg",
      },
      nexora: {
        "ueber-mich": "Systemkern und Haltung",
        leistungen: "Vernetzte Module",
        projekte: "Cases und Wirkung",
        kontakt: "Uplink starten",
      },
      professional: {
        "ueber-mich": "Haltung und Anspruch",
        leistungen: "Digitale Mandate",
        projekte: "Referenzen und Cases",
        kontakt: "Gespräch anfragen",
      },
      freiraum: {
        "ueber-mich": "Portrait und Nähe",
        leistungen: "Kreative Disziplinen",
        projekte: "Collage und Arbeiten",
        kontakt: "Impuls senden",
      },
    },
  };

  var WORLDS = ["multiversum", "nexora", "professional", "freiraum"];
  var PAGES = ["ueber-mich", "leistungen", "projekte", "kontakt"];

  function publicPrefix() {
    try {
      if (window.parent && window.parent !== window && window.parent.WeltenDesignTestV2Path) {
        return window.parent.WeltenDesignTestV2Path.publicPrefix() || "";
      }
    } catch (e) {}
    try {
      if (window.WeltenDesignTestV2Path && window.WeltenDesignTestV2Path.publicPrefix) {
        return window.WeltenDesignTestV2Path.publicPrefix() || "";
      }
    } catch (e2) {}
    return "";
  }

  function v2Href(world, page) {
    page = page || "home";
    var slug = world === "multiversum" ? "multiversum" : world;
    var base = (publicPrefix() || "") + "/" + slug;
    var chapter = (V2_CHAPTER[world] && V2_CHAPTER[world][page]) || "";
    return chapter ? base + chapter : base;
  }

  function setText(el, text) {
    if (!el || !text) return;
    el.textContent = text;
  }

  function applyLabelsAndLinks() {
    LABELS = labelsFor(currentLang());
    var smalls = SMALL_I18N.de;
    WORLDS.forEach(function (world) {
      var labels = LABELS[world];
      var worldSmall = (smalls && smalls[world]) || {};
      PAGES.forEach(function (page) {
        var cls = PAGE_CLASS[page];
        var href = v2Href(world, page);
        var label = labels[page];
        document
          .querySelectorAll('.world-panel[data-world="' + world + '"] a.' + cls)
          .forEach(function (a) {
            a.setAttribute("href", href);
            a.setAttribute("target", "_top");
            a.setAttribute("rel", "noopener noreferrer");
            a.setAttribute("data-alex-route", world + "." + page);
            a.setAttribute("data-v2-page", page);
            a.setAttribute("data-v2-world", world);
            a.setAttribute("aria-label", world.toUpperCase() + " – " + label);
            var span = a.querySelector("span");
            setText(span, label);
            var small = a.querySelector("small");
            if (small && worldSmall[page]) setText(small, worldSmall[page]);
            var img = a.querySelector("img");
            if (img) img.setAttribute("alt", world.toUpperCase() + " " + label);
          });
      });

      document
        .querySelectorAll(
          '.world-panel[data-world="' +
            world +
            '"] a.world-main-visual, .world-panel[data-world="' +
            world +
            '"] a.world-cta, a.overview-card[data-world="' +
            world +
            '"]'
        )
        .forEach(function (a) {
          a.setAttribute("href", v2Href(world, "home"));
          a.setAttribute("target", "_top");
          a.setAttribute("rel", "noopener noreferrer");
          a.setAttribute("data-alex-route", world + ".home");
          a.setAttribute("data-v2-world", world);
          a.setAttribute("data-v2-page", "home");
        });
    });

    /* Final world pills */
    document.querySelectorAll(".final-buttons a").forEach(function (a, index) {
      var world = WORLDS[index];
      if (!world) return;
      a.setAttribute("href", v2Href(world, "home"));
      a.setAttribute("target", "_top");
      a.setAttribute("rel", "noopener noreferrer");
      a.setAttribute("data-alex-route", world + ".home");
      a.setAttribute("data-v2-world", world);
      a.setAttribute("data-v2-page", "home");
    });

    /* Last four Multiversum chapter buttons */
    var finalPages = ["projekte", "leistungen", "ueber-mich", "kontakt"];
    document.querySelectorAll(".next-final-buttons a").forEach(function (a, index) {
      var page = finalPages[index];
      if (!page) return;
      var label = LABELS.multiversum[page];
      a.setAttribute("href", v2Href("multiversum", page));
      a.setAttribute("target", "_top");
      a.setAttribute("rel", "noopener noreferrer");
      a.setAttribute("data-alex-route", "multiversum." + page);
      a.setAttribute("data-v2-page", page);
      a.setAttribute("data-v2-world", "multiversum");
      a.setAttribute("aria-label", "MULTIVERSUM – " + label);
      var strong = a.querySelector("strong");
      setText(strong, label);
      var img = a.querySelector("img");
      if (img) img.setAttribute("alt", "Multiversum " + label);
    });

    /* Keep override map in sync for canonical-links re-runs */
    window.ALEX_GALAXY_ROUTE_OVERRIDE = {
      multiversum: {
        home: v2Href("multiversum", "home"),
        "ueber-mich": v2Href("multiversum", "ueber-mich"),
        leistungen: v2Href("multiversum", "leistungen"),
        projekte: v2Href("multiversum", "projekte"),
        kontakt: v2Href("multiversum", "kontakt"),
      },
      nexora: {
        home: v2Href("nexora", "home"),
        "ueber-mich": v2Href("nexora", "ueber-mich"),
        leistungen: v2Href("nexora", "leistungen"),
        projekte: v2Href("nexora", "projekte"),
        kontakt: v2Href("nexora", "kontakt"),
      },
      professional: {
        home: v2Href("professional", "home"),
        "ueber-mich": v2Href("professional", "ueber-mich"),
        leistungen: v2Href("professional", "leistungen"),
        projekte: v2Href("professional", "projekte"),
        kontakt: v2Href("professional", "kontakt"),
      },
      freiraum: {
        home: v2Href("freiraum", "home"),
        "ueber-mich": v2Href("freiraum", "ueber-mich"),
        leistungen: v2Href("freiraum", "leistungen"),
        projekte: v2Href("freiraum", "projekte"),
        kontakt: v2Href("freiraum", "kontakt"),
      },
    };
  }

  function injectLayoutCss() {
    if (document.getElementById("v2-galaxy-walk-layout")) return;
    var style = document.createElement("style");
    style.id = "v2-galaxy-walk-layout";
    /* Desktop only — Galaxy Walk is disabled ≤1024px / short viewports in Multiversum */
    style.textContent = [
      "@media (min-width: 1025px) and (min-height: 640px) {",
      "  /* —— Overview (4 Welten): Intro-Box schmaler, Orbs frei —— */",
      "  html body .overview-intro-box {",
      "    width: min(300px, 24vw) !important;",
      "    max-width: min(300px, 24vw) !important;",
      "    padding: 12px 13px !important;",
      "    z-index: 2 !important;",
      "    left: 50% !important;",
      "    top: 50% !important;",
      "    transform: translate(-50%, -50%) !important;",
      "    box-sizing: border-box !important;",
      "  }",
      "  html body .overview-intro-box h2 {",
      "    font-size: clamp(20px, 2vw, 28px) !important;",
      "    margin-bottom: 6px !important;",
      "  }",
      "  html body .overview-intro-box p,",
      "  html body .overview-intro-box small {",
      "    font-size: clamp(11px, 0.95vw, 14px) !important;",
      "    line-height: 1.35 !important;",
      "  }",
      "  html body .overview-card {",
      "    z-index: 5 !important;",
      "    pointer-events: auto !important;",
      "  }",
      "  html body .overview-card[data-world='nexora'] { left: 20% !important; top: 22% !important; }",
      "  html body .overview-card[data-world='professional'] { left: 80% !important; top: 22% !important; }",
      "  html body .overview-card[data-world='multiversum'] { left: 20% !important; top: 78% !important; }",
      "  html body .overview-card[data-world='freiraum'] { left: 80% !important; top: 78% !important; }",
      "",
      "  /* —— World textboxes: native side (Pro/FR left, MV/NX right) —— */",
      "  html body .world-panel[data-world='multiversum'] {",
      "    --world-x: 32% !important;",
      "    --world-y: 58% !important;",
      "    --box-x: 78% !important;",
      "    --box-y: 36% !important;",
      "  }",
      "  html body .world-panel[data-world='nexora'] {",
      "    --world-x: 32% !important;",
      "    --world-y: 42% !important;",
      "    --box-x: 78% !important;",
      "    --box-y: 62% !important;",
      "  }",
      "  html body .world-panel[data-world='professional'] {",
      "    --world-x: 68% !important;",
      "    --world-y: 42% !important;",
      "    --box-x: 20% !important;",
      "    --box-y: 58% !important;",
      "  }",
      "  html body .world-panel[data-world='freiraum'] {",
      "    --world-x: 68% !important;",
      "    --world-y: 58% !important;",
      "    --box-x: 20% !important;",
      "    --box-y: 38% !important;",
      "  }",
      "  html body .live-textbox,",
      "  html body .final-textbox {",
      "    z-index: 4 !important;",
      "    min-width: 0 !important;",
      "    width: min(14.5vw, 196px) !important;",
      "    max-width: min(14.5vw, 196px) !important;",
      "    padding: 8px 9px !important;",
      "    box-sizing: border-box !important;",
      "  }",
      "  html body .world-panel .live-textbox {",
      "    left: var(--box-x) !important;",
      "    top: var(--box-y) !important;",
      "    transform: translate(-50%, -50%) !important;",
      "  }",
      "  html body .world-panel.is-active .live-textbox,",
      "  html body .world-panel.is-active .live-textbox a.world-cta {",
      "    pointer-events: auto !important;",
      "  }",
      "  html body .live-textbox h2 {",
      "    font-size: clamp(15px, 1.55vw, 22px) !important;",
      "    overflow-wrap: anywhere !important;",
      "    word-break: break-word !important;",
      "    line-height: 1.15 !important;",
      "  }",
      "  html body .live-textbox p {",
      "    display: -webkit-box !important;",
      "    -webkit-line-clamp: 3 !important;",
      "    -webkit-box-orient: vertical !important;",
      "    overflow: hidden !important;",
      "    font-size: clamp(11px, 1.05vw, 13px) !important;",
      "    line-height: 1.35 !important;",
      "  }",
      "  html body .live-textbox .world-cta,",
      "  html body .live-textbox a.world-cta {",
      "    white-space: nowrap !important;",
      "    max-width: 100% !important;",
      "    overflow: hidden !important;",
      "    text-overflow: ellipsis !important;",
      "    font-size: clamp(11px, 1vw, 13px) !important;",
      "    padding-inline: 0.65rem !important;",
      "  }",
      "",
      "  /* Menü-Karten um Globus — Abstand zur Textbox */",
      "  html body .world-subpages,",
      "  html body .subpage-card { z-index: 6 !important; pointer-events: auto !important; }",
      "  html body .world-main-visual { z-index: 5 !important; }",
      "  html body .subpage-card {",
      "    width: clamp(110px, 12vw, 190px) !important;",
      "    overflow: hidden !important;",
      "  }",
      "  html body .subpage-1 {",
      "    left: calc(var(--world-x) - clamp(170px, 18vw, 560px)) !important;",
      "    top: calc(var(--world-y) - clamp(110px, 16vh, 360px)) !important;",
      "  }",
      "  html body .subpage-2 {",
      "    left: calc(var(--world-x) + clamp(150px, 16vw, 500px)) !important;",
      "    top: calc(var(--world-y) - clamp(110px, 16vh, 360px)) !important;",
      "  }",
      "  html body .subpage-3 {",
      "    left: calc(var(--world-x) - clamp(170px, 18vw, 560px)) !important;",
      "    top: calc(var(--world-y) + clamp(110px, 16vh, 380px)) !important;",
      "  }",
      "  html body .subpage-4 {",
      "    left: calc(var(--world-x) + clamp(150px, 16vw, 500px)) !important;",
      "    top: calc(var(--world-y) + clamp(106px, 15.5vh, 370px)) !important;",
      "  }",
      "  /* Pro/FR: Haltung/Portrait + Referenzen/Collage leicht nach links */
      "  html body .world-panel[data-world='professional'] .subpage-1,",
      "  html body .world-panel[data-world='freiraum'] .subpage-1,",
      "  html body .world-panel[data-world='professional'] .subpage-3,",
      "  html body .world-panel[data-world='freiraum'] .subpage-3 {",
      "    left: calc(var(--world-x) - clamp(210px, 22vw, 660px)) !important;",
      "  }",
      "  /* MV/NX: Dimensionen/Module + Signal/Uplink leicht nach rechts */",
      "  html body .world-panel[data-world='multiversum'] .subpage-2,",
      "  html body .world-panel[data-world='nexora'] .subpage-2,",
      "  html body .world-panel[data-world='multiversum'] .subpage-4,",
      "  html body .world-panel[data-world='nexora'] .subpage-4 {",
      "    left: calc(var(--world-x) + clamp(200px, 21vw, 640px)) !important;",
      "  }",
      "",
      "  /* Bild-Crop: zentriert, Portraits etwas nach oben */",
      "  html body .subpage-card img,",
      "  html body .next-final-buttons a img {",
      "    width: 100% !important;",
      "    height: 100% !important;",
      "    max-width: none !important;",
      "    object-fit: cover !important;",
      "    object-position: center center !important;",
      "    transform: none !important;",
      "    transform-origin: center center !important;",
      "  }",
      "  html body .world-panel a.subpage-card.subpage-1 img,",
      "  html body .world-panel a.subpage-card.subpage-1:link img,",
      "  html body .world-panel a.subpage-card.subpage-1:visited img,",
      "  html body .next-final-buttons a[data-alex-route$='.ueber-mich'] img,",
      "  html body .next-final-buttons a[data-v2-page='ueber-mich'] img {",
      "    object-position: center 20% !important;",
      "  }",
      "  html body .world-panel[data-world='freiraum'] a.subpage-card.subpage-1 img {",
      "    object-position: center 18% !important;",
      "  }",
      "  html body .world-panel[data-world='professional'] a.subpage-card.subpage-1 img {",
      "    object-position: center 42% !important;",
      "  }",
      "  html body .next-final-buttons a { overflow: hidden !important; }",
      "",
      "  /* Hover: Karten + Overview Orbs (aktive Welt) */",
      "  @media (hover: hover) and (pointer: fine) {",
      "    html body .world-panel.is-active a.subpage-card:hover {",
      "      transform: translate(-50%, -50%) translateY(-8px) scale(1.045) !important;",
      "      filter: brightness(1.06) saturate(1.05) !important;",
      "    }",
      "    html body .world-panel.is-active a.subpage-card:hover img {",
      "      transform: scale(1.06) !important;",
      "      object-fit: cover !important;",
      "      filter: saturate(1.1) brightness(1.04) !important;",
      "      opacity: 1 !important;",
      "    }",
      "    html body .world-panel.is-active a.subpage-card.subpage-1:hover img {",
      "      object-position: center 20% !important;",
      "      transform: scale(1.06) !important;",
      "    }",
      "    html body .overview-card:hover {",
      "      transform: translate(-50%, -50%) scale(1.04) !important;",
      "      filter: brightness(1.05) !important;",
      "    }",
      "    html body .next-final-buttons a:hover img {",
      "      transform: scale(1.05) !important;",
      "      object-fit: cover !important;",
      "    }",
      "  }",
      "}",
      "",
      "/* Mittlere Desktop-Breiten (Laptop) */",
      "@media (min-width: 1025px) and (max-width: 1360px) and (min-height: 640px) {",
      "  html body .overview-intro-box {",
      "    width: min(270px, 22vw) !important;",
      "    max-width: min(270px, 22vw) !important;",
      "    padding: 10px 11px !important;",
      "  }",
      "  html body .live-textbox,",
      "  html body .final-textbox {",
      "    width: min(13.5vw, 176px) !important;",
      "    max-width: min(13.5vw, 176px) !important;",
      "    padding: 7px 8px !important;",
      "  }",
      "  html body .live-textbox p { -webkit-line-clamp: 3 !important; }",
      "  html body .subpage-card { width: clamp(96px, 11vw, 160px) !important; }",
      "  html body .world-panel[data-world='professional'] { --box-x: 18% !important; }",
      "  html body .world-panel[data-world='freiraum'] { --box-x: 18% !important; }",
      "  html body .world-panel[data-world='multiversum'] { --box-x: 82% !important; }",
      "  html body .world-panel[data-world='nexora'] { --box-x: 82% !important; }",
      "}",
      "",
      "/* Flache Desktop-Fenster */",
      "@media (min-width: 1025px) and (max-height: 760px) {",
      "  html body .overview-intro-box {",
      "    width: min(250px, 22vw) !important;",
      "    max-width: min(250px, 22vw) !important;",
      "    padding: 9px 10px !important;",
      "  }",
      "  html body .live-textbox {",
      "    width: min(12.5vw, 166px) !important;",
      "    max-width: min(12.5vw, 166px) !important;",
      "  }",
      "  html body .live-textbox h2 { font-size: clamp(13px, 1.6vh, 18px) !important; }",
      "  html body .live-textbox p {",
      "    font-size: clamp(10px, 1.3vh, 12px) !important;",
      "    -webkit-line-clamp: 3 !important;",
      "  }",
      "  html body .subpage-1,",
      "  html body .subpage-2 { top: calc(var(--world-y) - 18vh) !important; }",
      "  html body .subpage-3,",
      "  html body .subpage-4 { top: calc(var(--world-y) + 18vh) !important; }",
      "}",
      "",
      "/* TV / Ultrawide: Layout zentrierter, weniger Flackern */",
      "@media (min-width: 1600px), (min-aspect-ratio: 21/9) and (min-width: 1400px) {",
      "  html body .overview-card[data-world='nexora'] { left: 26% !important; top: 24% !important; }",
      "  html body .overview-card[data-world='professional'] { left: 74% !important; top: 24% !important; }",
      "  html body .overview-card[data-world='multiversum'] { left: 26% !important; top: 76% !important; }",
      "  html body .overview-card[data-world='freiraum'] { left: 74% !important; top: 76% !important; }",
      "  html body .world-panel[data-world='multiversum'],",
      "  html body .world-panel[data-world='nexora'] {",
      "    --world-x: 34% !important;",
      "    --box-x: 72% !important;",
      "  }",
      "  html body .world-panel[data-world='professional'],",
      "  html body .world-panel[data-world='freiraum'] {",
      "    --world-x: 66% !important;",
      "    --box-x: 26% !important;",
      "  }",
      "  html body .overview-intro-box {",
      "    width: min(320px, 19vw) !important;",
      "    max-width: min(320px, 19vw) !important;",
      "  }",
      "  html body .live-textbox,",
      "  html body .final-textbox {",
      "    width: min(12vw, 200px) !important;",
      "    max-width: min(12vw, 200px) !important;",
      "  }",
      "  /* Wash nicht mehr jeden Frame drehen → weniger TV-Flackern */",
      "  html body .galaxy-wash {",
      "    transform: none !important;",
      "    filter: blur(16px) !important;",
      "    opacity: 0.48 !important;",
      "    animation: none !important;",
      "    will-change: auto !important;",
      "  }",
      "  html body .galaxy-vignette {",
      "    background:",
      "      radial-gradient(circle at 50% 50%, transparent 0 42%, rgba(0,0,0,.18) 70%, rgba(0,0,0,.78) 100%),",
      "      linear-gradient(90deg, rgba(0,0,0,.45), transparent 10% 90%, rgba(0,0,0,.45)) !important;",
      "  }",
      "  html body .overview-layer,",
      "  html body .world-panel,",
      "  html body .final-layer {",
      "    transition: none !important;",
      "  }",
      "  html body #galaxyCanvas {",
      "    image-rendering: auto !important;",
      "    transform: translateZ(0);",
      "    backface-visibility: hidden;",
      "  }",
      "}",
    ].join("\n");
    document.head.appendChild(style);
  }

  /** TV/Desktop: Background-RAF/Style dämpfen */
  function stabilizeLargeScreens() {
    try {
      var wide =
        window.matchMedia("(min-width: 1600px)").matches ||
        window.matchMedia("(min-aspect-ratio: 21/9) and (min-width: 1400px)").matches;
      if (!wide) return;
    } catch (eMq) {
      return;
    }

    document.addEventListener("visibilitychange", function () {
      try {
        if (document.hidden) {
          document.documentElement.style.setProperty("--progress", "0");
        }
      } catch (eVis) {}
    });
  }

  /**
   * V2 click bridge: post galaxy-navigate with themed chapter paths,
   * or top-navigate when opened standalone.
   */
  function bindV2Clicks() {
    document.addEventListener(
      "click",
      function (e) {
        var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
        if (!a) return;
        var href = a.getAttribute("href") || "";
        var world =
          a.getAttribute("data-v2-world") ||
          (a.closest && a.closest("[data-world]")
            ? a.closest("[data-world]").getAttribute("data-world")
            : "") ||
          "";
        var page = a.getAttribute("data-v2-page") || "";
        var m = href.match(
          /^\/(?:design-test-v2\/)?(multiversum|nexora|professional|freiraum)(?:\/([^/?#]+))?(?:#(.*))?$/i
        );
        if (!m && !world) return;
        if (m) {
          world = String(m[1] || world).toLowerCase();
          if (!page && m[2]) page = CHAPTER_SLUG_PAGE[String(m[2]).toLowerCase()] || "";
          if (!page && m[3]) {
            var hashPage = CHAPTER_SLUG_PAGE[String(m[3]).toLowerCase()];
            if (hashPage) page = hashPage;
            else if (V2_HASH[world]) {
              Object.keys(V2_HASH[world]).some(function (key) {
                if (V2_HASH[world][key] === String(m[3]).toLowerCase()) {
                  page = key;
                  return true;
                }
                return false;
              });
            }
          }
        }
        if (!world || WORLDS.indexOf(world) < 0) return;
        if (!page) page = "home";

        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();

        var go = PAGE_GO[page] || "home";
        var hash = (V2_HASH[world] && V2_HASH[world][page]) || "";
        var finalHref = href || v2Href(world, page);
        var payload = {
          type: "galaxy-navigate",
          source: "design-test-v2",
          world: world,
          go: go,
          href: finalHref,
          targetHash: hash,
        };
        try {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage(payload, "*");
            return;
          }
        } catch (err2) {}
        try {
          window.location.assign(finalHref);
        } catch (err3) {}
      },
      true
    );
  }

  function bindLangSync() {
    function onLang(lang) {
      if (!lang) return;
      try {
        localStorage.setItem("mv-preview-lang", lang);
        localStorage.setItem("mv-lang", lang);
      } catch (e) {}
      applyLabelsAndLinks();
    }
    window.addEventListener("message", function (ev) {
      var data = ev && ev.data;
      if (!data) return;
      if (data.type === "portfolio-preview-lang" && data.lang) onLang(String(data.lang).toLowerCase());
      if (data.source === "design-test-v2" && data.type === "lang" && data.detail && data.detail.lang) {
        onLang(String(data.detail.lang).toLowerCase());
      }
    });
    window.addEventListener("storage", function (ev) {
      if (!ev) return;
      if (ev.key === "mv-preview-lang" || ev.key === "mv-lang") applyLabelsAndLinks();
    });
    /* Parent Multiversum may forward lang into galaxy iframe */
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: "galaxy-ready", source: "design-test-v2" }, "*");
      }
    } catch (e2) {}
  }

  function run() {
    /* Seed override before canonical-links can re-apply legacy paths */
    applyLabelsAndLinks();
    injectLayoutCss();
    stabilizeLargeScreens();
    bindV2Clicks();
    bindLangSync();
    /* Re-apply after canonical-links script (runs on DOMContentLoaded too) */
    window.setTimeout(applyLabelsAndLinks, 0);
    window.setTimeout(applyLabelsAndLinks, 120);
    window.setTimeout(applyLabelsAndLinks, 400);
    window.setTimeout(applyLabelsAndLinks, 900);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();
