/**
 * Classic multi-column site footer — worlds, pages, legal (AGB)
 */
(function () {
  "use strict";

  var YEAR = new Date().getFullYear();

  var WORLD = {
    general: {
      name: "MULTIVERSUM",
      base: "",
      tag: {
        de: "Vier Welten. Eine klare digitale Sprache.",
        en: "Four worlds. One clear digital language.",
        fr: "Quatre mondes. Un langage digital clair.",
        it: "Quattro mondi. Un linguaggio digitale chiaro.",
      },
    },
    nexora: {
      name: "NEXORA",
      base: "/nexora",
      tag: {
        de: "Zukunftsraum für Systeme, Visionen und neue Konzepte.",
        en: "A future space for systems, visions and new concepts.",
        fr: "Espace futur pour systèmes, visions et nouveaux concepts.",
        it: "Spazio futuro per sistemi, visioni e nuovi concetti.",
      },
    },
    vertex: {
      name: "PROFESSIONAL",
      base: "/professional",
      tag: {
        de: "Leistungen, Projekte und strukturierte Zusammenarbeit.",
        en: "Services, projects and structured collaboration.",
        fr: "Prestations, projets et collaboration structurée.",
        it: "Servizi, progetti e collaborazione strutturata.",
      },
    },
    freiraum: {
      name: "FREIRAUM",
      base: "/freiraum",
      tag: {
        de: "Kreative Versuche, visuelle Studien und freie Ideen.",
        en: "Creative experiments, visual studies and free ideas.",
        fr: "Expériences créatives, études visuelles et idées libres.",
        it: "Esperimenti creativi, studi visuali e idee libere.",
      },
    },
  };

  var I18N = {
    de: {
      worlds: "Welten",
      pages: "Seiten",
      legal: "Rechtliches",
      home: "Home",
      projects: "Projekte",
      services: "Leistungen",
      about: "Über mich",
      contact: "Kontakt",
      offer: "Offerte",
      impressum: "Impressum",
      privacy: "Datenschutz",
      agb: "AGB",
      brand: "Alex Lamberti",
    },
    en: {
      worlds: "Worlds",
      pages: "Pages",
      legal: "Legal",
      home: "Home",
      projects: "Projects",
      services: "Services",
      about: "About",
      contact: "Contact",
      offer: "Offer",
      impressum: "Legal notice",
      privacy: "Privacy",
      agb: "Terms",
      brand: "Alex Lamberti",
    },
    fr: {
      worlds: "Mondes",
      pages: "Pages",
      legal: "Mentions",
      home: "Accueil",
      projects: "Projets",
      services: "Services",
      about: "À propos",
      contact: "Contact",
      offer: "Offre",
      impressum: "Mentions légales",
      privacy: "Confidentialité",
      agb: "CGV",
      brand: "Alex Lamberti",
    },
    it: {
      worlds: "Mondi",
      pages: "Pagine",
      legal: "Legale",
      home: "Home",
      projects: "Progetti",
      services: "Servizi",
      about: "Chi sono",
      contact: "Contatto",
      offer: "Offerta",
      impressum: "Note legali",
      privacy: "Privacy",
      agb: "Termini",
      brand: "Alex Lamberti",
    },
  };

  function getLang() {
    var htmlLang = (document.documentElement.getAttribute("lang") || "de").toLowerCase();
    var bodyLang = (document.body && document.body.getAttribute("data-lang")) || "";
    var raw = (bodyLang || htmlLang || "de").slice(0, 2);
    return I18N[raw] ? raw : "de";
  }

  function getWorldKey() {
    var w =
      (document.body && document.body.getAttribute("data-world")) ||
      (document.body && document.body.getAttribute("data-master-world")) ||
      "general";
    if (w === "professional") w = "vertex";
    if (w === "multiversum") w = "general";
    return WORLD[w] ? w : "general";
  }

  function getChapter() {
    return (
      (document.body && document.body.getAttribute("data-current-slide")) ||
      (document.body && document.body.getAttribute("data-chapter")) ||
      ""
    );
  }

  function t() {
    return I18N[getLang()] || I18N.de;
  }

  function pageHref(worldKey, chapter) {
    var base = WORLD[worldKey].base;
    if (!chapter || chapter === "home") return base || "/";
    return (base || "") + "/" + chapter;
  }

  function buildMarkup() {
    return (
      '<div class="welten-site-footer__shell">' +
      '<div class="welten-site-footer__grid">' +
      '<div class="welten-site-footer__brand">' +
      '<p class="welten-site-footer__brand-name" data-footer-brand>Alex Lamberti</p>' +
      '<p class="welten-site-footer__world" data-footer-world></p>' +
      '<p class="welten-site-footer__tag" data-footer-tag></p>' +
      "</div>" +
      '<nav class="welten-site-footer__col" aria-labelledby="footer-worlds-label">' +
      '<p class="welten-site-footer__heading" id="footer-worlds-label" data-footer-worlds-label>Welten</p>' +
      '<ul class="welten-site-footer__list">' +
      '<li><a href="/" target="_top" rel="noopener" data-footer-world-link="general">MULTIVERSUM</a></li>' +
      '<li><a href="/nexora" target="_top" rel="noopener" data-footer-world-link="nexora">NEXORA</a></li>' +
      '<li><a href="/professional" target="_top" rel="noopener" data-footer-world-link="vertex">PROFESSIONAL</a></li>' +
      '<li><a href="/freiraum" target="_top" rel="noopener" data-footer-world-link="freiraum">FREIRAUM</a></li>' +
      "</ul>" +
      "</nav>" +
      '<nav class="welten-site-footer__col" aria-labelledby="footer-pages-label">' +
      '<p class="welten-site-footer__heading" id="footer-pages-label" data-footer-pages-label>Seiten</p>' +
      '<ul class="welten-site-footer__list">' +
      '<li><a href="/" target="_top" rel="noopener" data-footer-page="home">Home</a></li>' +
      '<li><a href="/projekte" target="_top" rel="noopener" data-footer-page="projects">Projekte</a></li>' +
      '<li><a href="/leistungen" target="_top" rel="noopener" data-footer-page="services">Leistungen</a></li>' +
      '<li><a href="/ueber-mich" target="_top" rel="noopener" data-footer-page="about">Über mich</a></li>' +
      '<li><a href="/kontakt" target="_top" rel="noopener" data-footer-page="contact">Kontakt</a></li>' +
      '<li><a href="/offerte" target="_top" rel="noopener" data-footer-page="offer">Offerte</a></li>' +
      "</ul>" +
      "</nav>" +
      '<nav class="welten-site-footer__col" aria-labelledby="footer-legal-label">' +
      '<p class="welten-site-footer__heading" id="footer-legal-label" data-footer-legal-label>Rechtliches</p>' +
      '<ul class="welten-site-footer__list">' +
      '<li><a href="/impressum" target="_top" rel="noopener" data-footer-impressum>Impressum</a></li>' +
      '<li><a href="/datenschutz" target="_top" rel="noopener" data-footer-privacy>Datenschutz</a></li>' +
      '<li><a href="/agb" target="_top" rel="noopener" data-footer-agb>AGB</a></li>' +
      "</ul>" +
      "</nav>" +
      "</div>" +
      '<div class="welten-site-footer__bar">' +
      '<span class="welten-site-footer__copy">© ' +
      YEAR +
      ' Alex Lamberti</span>' +
      '<span class="welten-site-footer__bar-links">' +
      '<a href="/impressum" target="_top" rel="noopener" data-footer-impressum-mini>Impressum</a>' +
      '<span aria-hidden="true">·</span>' +
      '<a href="/datenschutz" target="_top" rel="noopener" data-footer-privacy-mini>Datenschutz</a>' +
      '<span aria-hidden="true">·</span>' +
      '<a href="/agb" target="_top" rel="noopener" data-footer-agb-mini>AGB</a>' +
      "</span>" +
      "</div>" +
      "</div>"
    );
  }

  function ensureFooter() {
    var existing = document.querySelector(".welten-site-footer");
    if (existing) return existing;

    var footer = document.createElement("footer");
    footer.className = "welten-site-footer";
    footer.setAttribute("role", "contentinfo");
    footer.innerHTML = buildMarkup();
    document.body.appendChild(footer);
    document.body.classList.add("has-welten-footer");
    return footer;
  }

  function refresh() {
    var footer = ensureFooter();
    var worldKey = getWorldKey();
    var world = WORLD[worldKey];
    var labels = t();
    var chapter = String(getChapter() || "").toLowerCase();

    var brand = footer.querySelector("[data-footer-brand]");
    var worldEl = footer.querySelector("[data-footer-world]");
    var tagEl = footer.querySelector("[data-footer-tag]");
    if (brand) brand.textContent = labels.brand;
    if (worldEl) worldEl.textContent = world.name;
    if (tagEl) tagEl.textContent = world.tag[getLang()] || world.tag.de;

    var worldsLabel = footer.querySelector("[data-footer-worlds-label]");
    var pagesLabel = footer.querySelector("[data-footer-pages-label]");
    var legalLabel = footer.querySelector("[data-footer-legal-label]");
    if (worldsLabel) worldsLabel.textContent = labels.worlds;
    if (pagesLabel) pagesLabel.textContent = labels.pages;
    if (legalLabel) legalLabel.textContent = labels.legal;

    footer.querySelectorAll("[data-footer-world-link]").forEach(function (a) {
      var key = a.getAttribute("data-footer-world-link");
      a.classList.toggle("is-active", key === worldKey);
      a.setAttribute("aria-current", key === worldKey ? "page" : "false");
    });

    var pageMap = {
      home: { label: labels.home, path: "home" },
      projects: { label: labels.projects, path: "projekte" },
      services: { label: labels.services, path: "leistungen" },
      about: { label: labels.about, path: "ueber-mich" },
      contact: { label: labels.contact, path: "kontakt" },
      offer: { label: labels.offer, path: "offerte" },
    };

    Object.keys(pageMap).forEach(function (key) {
      var a = footer.querySelector('[data-footer-page="' + key + '"]');
      if (!a) return;
      var meta = pageMap[key];
      a.textContent = meta.label;
      a.href = pageHref(worldKey, meta.path === "home" ? "home" : meta.path);
      var activeChapter =
        chapter === "home" || chapter === ""
          ? "home"
          : chapter === "projects"
            ? "projekte"
            : chapter === "about"
              ? "ueber-mich"
              : chapter === "contact"
                ? "kontakt"
                : chapter === "offerte"
                  ? "offerte"
                  : chapter === "leistungen"
                    ? "leistungen"
                    : chapter;
      var isActive =
        (meta.path === "home" && (activeChapter === "home" || !chapter)) ||
        meta.path === activeChapter;
      a.classList.toggle("is-active", isActive);
    });

    footer.querySelectorAll("[data-footer-impressum], [data-footer-impressum-mini]").forEach(function (el) {
      el.textContent = labels.impressum;
    });
    footer.querySelectorAll("[data-footer-privacy], [data-footer-privacy-mini]").forEach(function (el) {
      el.textContent = labels.privacy;
    });
    footer.querySelectorAll("[data-footer-agb], [data-footer-agb-mini]").forEach(function (el) {
      el.textContent = labels.agb;
    });

    footer.setAttribute("data-footer-world", worldKey);

    var isHome = chapter === "home" || chapter === "";
    var isEnd = chapter === "contact" || chapter === "offerte";
    footer.classList.toggle("is-home-soft", isHome);
    footer.classList.toggle("is-expanded", isEnd || !isHome);
    document.body.classList.toggle("has-welten-footer-expanded", footer.classList.contains("is-expanded"));
  }

  function apply() {
    refresh();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }

  document.addEventListener("welten-chapter-change", refresh);
  document.addEventListener("welten-lang-change", refresh);
  document.addEventListener("welten-world-change", refresh);

  if (document.body) {
    var obs = new MutationObserver(function () {
      refresh();
    });
    obs.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-world", "data-lang", "data-current-slide", "data-chapter"],
    });
  }
})();
