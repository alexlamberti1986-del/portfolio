/**
 * World-aware site footer — Impressum / Datenschutz / © + world tagline
 */
(function () {
  "use strict";

  var YEAR = new Date().getFullYear();

  var WORLD = {
    general: {
      name: "MULTIVERSUM",
      tag: {
        de: "Vier Welten. Eine klare digitale Sprache.",
        en: "Four worlds. One clear digital language.",
        fr: "Quatre mondes. Un langage digital clair.",
        it: "Quattro mondi. Un linguaggio digitale chiaro.",
      },
    },
    nexora: {
      name: "NEXORA",
      tag: {
        de: "Zukunftsraum für Systeme, Visionen und neue Konzepte.",
        en: "A future space for systems, visions and new concepts.",
        fr: "Espace futur pour systèmes, visions et nouveaux concepts.",
        it: "Spazio futuro per sistemi, visioni e nuovi concetti.",
      },
    },
    vertex: {
      name: "PROFESSIONAL",
      tag: {
        de: "Leistungen, Projekte und strukturierte Zusammenarbeit.",
        en: "Services, projects and structured collaboration.",
        fr: "Prestations, projets et collaboration structurée.",
        it: "Servizi, progetti e collaborazione strutturata.",
      },
    },
    freiraum: {
      name: "FREIRAUM",
      tag: {
        de: "Kreative Versuche, visuelle Studien und freie Ideen.",
        en: "Creative experiments, visual studies and free ideas.",
        fr: "Expériences créatives, études visuelles et idées libres.",
        it: "Esperimenti creativi, studi visuali e idee libere.",
      },
    },
  };

  var LEGAL = {
    de: { impressum: "Impressum", privacy: "Datenschutz", contact: "Kontakt" },
    en: { impressum: "Legal notice", privacy: "Privacy", contact: "Contact" },
    fr: { impressum: "Mentions légales", privacy: "Confidentialité", contact: "Contact" },
    it: { impressum: "Note legali", privacy: "Privacy", contact: "Contatto" },
  };

  function getLang() {
    var htmlLang = (document.documentElement.getAttribute("lang") || "de").toLowerCase();
    var bodyLang = (document.body && document.body.getAttribute("data-lang")) || "";
    var raw = (bodyLang || htmlLang || "de").slice(0, 2);
    return LEGAL[raw] ? raw : "de";
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

  function t(map) {
    var lang = getLang();
    return map[lang] || map.de;
  }

  function ensureFooter() {
    var existing = document.querySelector(".welten-site-footer");
    if (existing) return existing;

    var footer = document.createElement("footer");
    footer.className = "welten-site-footer";
    footer.setAttribute("role", "contentinfo");
    footer.innerHTML =
      '<div class="welten-site-footer__inner">' +
      '<div class="welten-site-footer__brand">' +
      '<span class="welten-site-footer__world" data-footer-world></span>' +
      '<span class="welten-site-footer__tag" data-footer-tag></span>' +
      "</div>" +
      '<nav class="welten-site-footer__nav" aria-label="Legal">' +
      '<a data-footer-impressum href="/impressum" target="_top" rel="noopener">Impressum</a>' +
      '<span class="welten-site-footer__sep" aria-hidden="true">·</span>' +
      '<a data-footer-privacy href="/datenschutz" target="_top" rel="noopener">Datenschutz</a>' +
      '<span class="welten-site-footer__sep" aria-hidden="true">·</span>' +
      '<a data-footer-contact href="/kontakt" target="_top" rel="noopener">Kontakt</a>' +
      '<span class="welten-site-footer__sep" aria-hidden="true">·</span>' +
      '<span class="welten-site-footer__copy">© ' +
      YEAR +
      " Alex Lamberti</span>" +
      "</nav>" +
      "</div>";

    document.body.appendChild(footer);
    document.body.classList.add("has-welten-footer");
    return footer;
  }

  function refresh() {
    var footer = ensureFooter();
    var worldKey = getWorldKey();
    var world = WORLD[worldKey];
    var legal = t(LEGAL);
    var chapter = String(getChapter() || "").toLowerCase();

    var worldEl = footer.querySelector("[data-footer-world]");
    var tagEl = footer.querySelector("[data-footer-tag]");
    var impressum = footer.querySelector("[data-footer-impressum]");
    var privacy = footer.querySelector("[data-footer-privacy]");
    var contact = footer.querySelector("[data-footer-contact]");

    if (worldEl) worldEl.textContent = world.name;
    if (tagEl) tagEl.textContent = t(world.tag);
    if (impressum) impressum.textContent = legal.impressum;
    if (privacy) privacy.textContent = legal.privacy;
    if (contact) contact.textContent = legal.contact;

    footer.setAttribute("data-footer-world", worldKey);
    footer.classList.toggle("is-home-soft", chapter === "home" || chapter === "");
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

  var obs = new MutationObserver(function () {
    refresh();
  });
  if (document.body) {
    obs.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-world", "data-lang", "data-current-slide", "data-chapter"],
    });
  }
})();
