/**
 * Design-Test V2 — Galaxy Walk labels, routes, layout & portrait crop.
 * Loaded only when galaxy iframe has ?v2=1 (see multiversum.js SRC).
 */
(function () {
  "use strict";

  if (!/\bv2=1\b/.test(String(location.search || ""))) return;

  var LABELS_I18N = {
    de: {
      multiversum: { "ueber-mich": "Profil", leistungen: "Nexus", projekte: "Werke", kontakt: "Signal" },
      nexora: { "ueber-mich": "Core", leistungen: "Module", projekte: "Cases", kontakt: "Uplink" },
      professional: { "ueber-mich": "Haltung", leistungen: "Mandate", projekte: "Referenzen", kontakt: "Gespräch" },
      freiraum: { "ueber-mich": "Portrait", leistungen: "Disziplinen", projekte: "Collage", kontakt: "Impuls" },
    },
    en: {
      multiversum: { "ueber-mich": "Profile", leistungen: "Nexus", projekte: "Works", kontakt: "Signal" },
      nexora: { "ueber-mich": "Core", leistungen: "Modules", projekte: "Cases", kontakt: "Uplink" },
      professional: { "ueber-mich": "Stance", leistungen: "Mandates", projekte: "References", kontakt: "Talk" },
      freiraum: { "ueber-mich": "Portrait", leistungen: "Disciplines", projekte: "Collage", kontakt: "Impulse" },
    },
    fr: {
      multiversum: { "ueber-mich": "Profil", leistungen: "Nexus", projekte: "Œuvres", kontakt: "Signal" },
      nexora: { "ueber-mich": "Core", leistungen: "Modules", projekte: "Cases", kontakt: "Uplink" },
      professional: { "ueber-mich": "Posture", leistungen: "Mandats", projekte: "Références", kontakt: "Échange" },
      freiraum: { "ueber-mich": "Portrait", leistungen: "Disciplines", projekte: "Collage", kontakt: "Impulsion" },
    },
    it: {
      multiversum: { "ueber-mich": "Profilo", leistungen: "Nexus", projekte: "Opere", kontakt: "Segnale" },
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
    var hash = (V2_HASH[world] && V2_HASH[world][page]) || "";
    return hash ? base + "#" + hash : base;
  }

  /* Canonical route map used by digitalplus-v35-canonical-links if it re-runs */
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

  function setText(el, text) {
    if (!el || !text) return;
    el.textContent = text;
  }

  function applyLabelsAndLinks() {
    LABELS = labelsFor(currentLang());
    WORLDS.forEach(function (world) {
      var labels = LABELS[world];
      PAGES.forEach(function (page) {
        var cls = PAGE_CLASS[page];
        var href = v2Href(world, page);
        var label = labels[page];
        document
          .querySelectorAll('.world-panel[data-world="' + world + '"] a.' + cls)
          .forEach(function (a) {
            a.setAttribute("href", href);
            a.setAttribute("data-alex-route", world + "." + page);
            a.setAttribute("data-v2-page", page);
            a.setAttribute("aria-label", world.toUpperCase() + " – " + label);
            var span = a.querySelector("span");
            setText(span, label);
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
          a.setAttribute("data-alex-route", world + ".home");
        });
    });

    /* Final world pills */
    document.querySelectorAll(".final-buttons a").forEach(function (a, index) {
      var world = WORLDS[index];
      if (!world) return;
      a.setAttribute("href", v2Href(world, "home"));
      a.setAttribute("data-alex-route", world + ".home");
    });

    /* Last four Multiversum chapter buttons */
    var finalPages = ["projekte", "leistungen", "ueber-mich", "kontakt"];
    document.querySelectorAll(".next-final-buttons a").forEach(function (a, index) {
      var page = finalPages[index];
      if (!page) return;
      var label = LABELS.multiversum[page];
      a.setAttribute("href", v2Href("multiversum", page));
      a.setAttribute("data-alex-route", "multiversum." + page);
      a.setAttribute("data-v2-page", page);
      a.setAttribute("aria-label", "MULTIVERSUM – " + label);
      var strong = a.querySelector("strong");
      setText(strong, label);
      var img = a.querySelector("img");
      if (img) img.setAttribute("alt", "Multiversum " + label);
    });
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
      "    width: min(340px, 28vw) !important;",
      "    max-width: min(340px, 28vw) !important;",
      "    padding: 14px 16px !important;",
      "    z-index: 2 !important;",
      "    left: 50% !important;",
      "    top: 50% !important;",
      "    transform: translate(-50%, -50%) !important;",
      "  }",
      "  html body .overview-intro-box h2 {",
      "    font-size: clamp(22px, 2.2vw, 32px) !important;",
      "    margin-bottom: 8px !important;",
      "  }",
      "  html body .overview-intro-box p,",
      "  html body .overview-intro-box small {",
      "    font-size: clamp(12px, 1.05vw, 15px) !important;",
      "    line-height: 1.4 !important;",
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
      "    width: min(22vw, 280px) !important;",
      "    max-width: min(22vw, 280px) !important;",
      "    padding: 12px 14px !important;",
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
      "    font-size: clamp(16px, 1.7vw, 24px) !important;",
      "    overflow-wrap: anywhere !important;",
      "    word-break: break-word !important;",
      "  }",
      "  html body .live-textbox p {",
      "    display: -webkit-box !important;",
      "    -webkit-line-clamp: 4 !important;",
      "    -webkit-box-orient: vertical !important;",
      "    overflow: hidden !important;",
      "    font-size: clamp(12px, 1.15vw, 14px) !important;",
      "  }",
      "  html body .live-textbox .world-cta,",
      "  html body .live-textbox a.world-cta {",
      "    white-space: nowrap !important;",
      "    max-width: 100% !important;",
      "    overflow: hidden !important;",
      "    text-overflow: ellipsis !important;",
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
      "  /* Pro/FR: Textbox links → linke Karten etwas näher am Globus */",
      "  html body .world-panel[data-world='professional'] .subpage-1,",
      "  html body .world-panel[data-world='freiraum'] .subpage-1,",
      "  html body .world-panel[data-world='professional'] .subpage-3,",
      "  html body .world-panel[data-world='freiraum'] .subpage-3 {",
      "    left: calc(var(--world-x) - clamp(140px, 14vw, 420px)) !important;",
      "  }",
      "  /* MV/NX: Textbox rechts → rechte Karten etwas näher am Globus */",
      "  html body .world-panel[data-world='multiversum'] .subpage-2,",
      "  html body .world-panel[data-world='nexora'] .subpage-2,",
      "  html body .world-panel[data-world='multiversum'] .subpage-4,",
      "  html body .world-panel[data-world='nexora'] .subpage-4 {",
      "    left: calc(var(--world-x) + clamp(130px, 13vw, 400px)) !important;",
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
      "    width: min(300px, 26vw) !important;",
      "    max-width: min(300px, 26vw) !important;",
      "    padding: 12px 14px !important;",
      "  }",
      "  html body .live-textbox,",
      "  html body .final-textbox {",
      "    width: min(20vw, 240px) !important;",
      "    max-width: min(20vw, 240px) !important;",
      "    padding: 10px 12px !important;",
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
      "    width: min(280px, 24vw) !important;",
      "    padding: 10px 12px !important;",
      "  }",
      "  html body .live-textbox {",
      "    width: min(20vw, 230px) !important;",
      "    max-width: min(20vw, 230px) !important;",
      "  }",
      "  html body .live-textbox h2 { font-size: clamp(14px, 1.8vh, 20px) !important; }",
      "  html body .live-textbox p {",
      "    font-size: clamp(11px, 1.4vh, 13px) !important;",
      "    -webkit-line-clamp: 3 !important;",
      "  }",
      "  html body .subpage-1,",
      "  html body .subpage-2 { top: calc(var(--world-y) - 18vh) !important; }",
      "  html body .subpage-3,",
      "  html body .subpage-4 { top: calc(var(--world-y) + 18vh) !important; }",
      "}",
    ].join("\n");
    document.head.appendChild(style);
  }

  /**
   * V2 click bridge: post galaxy-navigate with design-test hashes,
   * or top-navigate when opened standalone.
   */
  function bindV2Clicks() {
    document.addEventListener(
      "click",
      function (e) {
        var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
        if (!a) return;
        var href = a.getAttribute("href") || "";
        var m = href.match(
          /^\/(?:design-test-v2\/)?(multiversum|nexora|professional|freiraum)(?:#(.*))?$/i
        );
        if (!m) return;
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();

        var world = m[1].toLowerCase();
        var hash = m[2] || "";
        var goMap = {
          alex: "about",
          experience: "about",
          values: "about",
          about: "about",
          leistungen: "leistungen",
          services: "leistungen",
          skills: "leistungen",
          werke: "projects",
          projects: "projects",
          collage: "projects",
          kontakt: "contact",
        };
        var go = hash ? goMap[hash] || "home" : "home";
        var payload = {
          type: "galaxy-navigate",
          source: "design-test-v2",
          world: world,
          go: go,
          href: href,
          targetHash: hash,
        };
        try {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage(payload, "*");
            return;
          }
        } catch (err2) {}
        try {
          window.location.assign(href);
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
    injectLayoutCss();
    applyLabelsAndLinks();
    bindV2Clicks();
    bindLangSync();
    /* Re-apply after canonical-links script (runs on DOMContentLoaded too) */
    window.setTimeout(applyLabelsAndLinks, 0);
    window.setTimeout(applyLabelsAndLinks, 120);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();
