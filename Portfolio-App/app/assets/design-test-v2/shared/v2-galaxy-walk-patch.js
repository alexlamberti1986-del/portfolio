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
    style.textContent = [
      "/* Design-Test V2: spacing, no textbox/card overlap, Profil crop */",
      "html body .live-textbox,",
      "html body .final-textbox {",
      "  z-index: 3 !important;",
      "  max-width: min(26vw, 320px) !important;",
      "  padding: 12px 14px !important;",
      "  pointer-events: auto !important;",
      "}",
      "/* Keep textbox clear of right-side Nexus card */",
      "html body .world-panel .live-textbox {",
      "  left: calc(var(--world-x) + clamp(280px, 34vw, 920px)) !important;",
      "  top: calc(var(--world-y) - clamp(40px, 8vh, 120px)) !important;",
      "}",
      "html body .live-textbox p {",
      "  display: -webkit-box !important;",
      "  -webkit-line-clamp: 4 !important;",
      "  -webkit-box-orient: vertical !important;",
      "  overflow: hidden !important;",
      "}",
      "html body .world-subpages,",
      "html body .subpage-card { z-index: 6 !important; }",
      "html body .world-main-visual { z-index: 5 !important; }",
      "",
      "/* Cards inward enough to clear textbox, still off the globe */",
      "html body .subpage-1 {",
      "  left: calc(var(--world-x) - clamp(200px, 22vw, 760px)) !important;",
      "  top: calc(var(--world-y) - clamp(120px, 18vh, 400px)) !important;",
      "}",
      "html body .subpage-2 {",
      "  left: calc(var(--world-x) + clamp(170px, 18vw, 640px)) !important;",
      "  top: calc(var(--world-y) - clamp(120px, 18vh, 400px)) !important;",
      "}",
      "html body .subpage-3 {",
      "  left: calc(var(--world-x) - clamp(200px, 22vw, 760px)) !important;",
      "  top: calc(var(--world-y) + clamp(120px, 18vh, 420px)) !important;",
      "}",
      "html body .subpage-4 {",
      "  left: calc(var(--world-x) + clamp(170px, 18vw, 640px)) !important;",
      "  top: calc(var(--world-y) + clamp(116px, 17.5vh, 410px)) !important;",
      "}",
      "",
      "/* Profil: beat V35 :link/:visited; shift portrait down so face fills card */",
      "html body .world-panel a.subpage-card.subpage-1,",
      "html body .next-final-buttons a[data-alex-route='multiversum.ueber-mich'],",
      "html body .next-final-buttons a[data-v2-page='ueber-mich'] {",
      "  overflow: hidden !important;",
      "}",
      "html body .world-panel a.subpage-card.subpage-1 img,",
      "html body .world-panel a.subpage-card.subpage-1:link img,",
      "html body .world-panel a.subpage-card.subpage-1:visited img,",
      "html body .world-panel a.subpage-card.subpage-1:hover img,",
      "html body .world-panel a.subpage-card.subpage-1:focus img,",
      "html body .world-panel a.subpage-card.subpage-1:active img,",
      "html body .next-final-buttons a[data-alex-route='multiversum.ueber-mich'] img,",
      "html body .next-final-buttons a[data-alex-route='multiversum.ueber-mich']:link img,",
      "html body .next-final-buttons a[data-alex-route='multiversum.ueber-mich']:visited img,",
      "html body .next-final-buttons a[data-alex-route='multiversum.ueber-mich']:hover img,",
      "html body .next-final-buttons a[data-alex-route='multiversum.ueber-mich']:focus img,",
      "html body .next-final-buttons a[data-v2-page='ueber-mich'] img {",
      "  object-fit: cover !important;",
      "  object-position: center 22% !important;",
      "  transform: scale(1.2) translateY(20%) !important;",
      "  transform-origin: center top !important;",
      "}",
      "@media (hover: hover) and (pointer: fine) {",
      "  html body .world-panel a.subpage-card.subpage-1:hover img,",
      "  html body .next-final-buttons a[data-alex-route='multiversum.ueber-mich']:hover img {",
      "    transform: scale(1.2) translateY(20%) !important;",
      "    filter: saturate(1.08) brightness(1.04) !important;",
      "    opacity: 1 !important;",
      "  }",
      "  html body .next-final-buttons a:hover img,",
      "  html body .next-final-buttons a:focus img {",
      "    transform: none !important;",
      "    object-fit: cover !important;",
      "  }",
      "  html body .next-final-buttons a[data-v2-page='ueber-mich']:hover img,",
      "  html body .next-final-buttons a[data-alex-route='multiversum.ueber-mich']:hover img {",
      "    transform: scale(1.2) translateY(20%) !important;",
      "  }",
      "}",
      "html body .subpage-card img,",
      "html body .next-final-buttons a img {",
      "  max-width: none !important;",
      "}",
      "html body .subpage-card,",
      "html body .next-final-buttons a {",
      "  overflow: hidden !important;",
      "}",
      "",
      "@media (max-width: 1200px) and (min-width: 861px) {",
      "  html body .live-textbox {",
      "    max-width: min(24vw, 280px) !important;",
      "    padding: 10px 12px !important;",
      "  }",
      "  html body .world-panel .live-textbox {",
      "    left: calc(var(--world-x) + 36vw) !important;",
      "  }",
      "  html body .live-textbox p { -webkit-line-clamp: 3 !important; }",
      "  html body .subpage-card {",
      "    width: clamp(96px, 11vw, 180px) !important;",
      "  }",
      "  html body .subpage-1 { left: calc(var(--world-x) - 24vw) !important; top: calc(var(--world-y) - 19vh) !important; }",
      "  html body .subpage-2 { left: calc(var(--world-x) + 17vw) !important; top: calc(var(--world-y) - 19vh) !important; }",
      "  html body .subpage-3 { left: calc(var(--world-x) - 24vw) !important; top: calc(var(--world-y) + 20vh) !important; }",
      "  html body .subpage-4 { left: calc(var(--world-x) + 17vw) !important; top: calc(var(--world-y) + 19vh) !important; }",
      "}",
      "",
      "@media (max-width: 860px) {",
      "  html body .live-textbox,",
      "  html body .world-panel .live-textbox {",
      "    left: 50% !important;",
      "    top: 82% !important;",
      "    max-width: min(88vw, 400px) !important;",
      "    width: min(88vw, 400px) !important;",
      "    padding: 12px 14px !important;",
      "  }",
      "  html body .live-textbox p { -webkit-line-clamp: 3 !important; }",
      "  html body .subpage-1 { left: 20% !important; top: 24% !important; }",
      "  html body .subpage-2 { left: 80% !important; top: 24% !important; }",
      "  html body .subpage-3 { left: 20% !important; top: 54% !important; }",
      "  html body .subpage-4 { left: 80% !important; top: 54% !important; }",
      "  html body .world-panel a.subpage-card.subpage-1 img,",
      "  html body .world-panel a.subpage-card.subpage-1:link img,",
      "  html body .world-panel a.subpage-card.subpage-1:visited img,",
      "  html body .next-final-buttons a[data-alex-route='multiversum.ueber-mich'] img {",
      "    object-position: center 22% !important;",
      "    transform: scale(1.18) translateY(18%) !important;",
      "  }",
      "}",
      "",
      "@media (max-height: 720px) and (min-width: 861px) {",
      "  html body .live-textbox {",
      "    max-width: min(22vw, 260px) !important;",
      "    padding: 10px 12px !important;",
      "  }",
      "  html body .live-textbox h2 { font-size: clamp(15px, 2vh, 26px) !important; }",
      "  html body .live-textbox p {",
      "    font-size: clamp(11px, 1.5vh, 14px) !important;",
      "    -webkit-line-clamp: 3 !important;",
      "  }",
      "  html body .subpage-1 { top: calc(var(--world-y) - 20vh) !important; }",
      "  html body .subpage-2 { top: calc(var(--world-y) - 20vh) !important; }",
      "  html body .subpage-3 { top: calc(var(--world-y) + 21vh) !important; }",
      "  html body .subpage-4 { top: calc(var(--world-y) + 20vh) !important; }",
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
