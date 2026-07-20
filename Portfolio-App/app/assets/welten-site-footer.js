/**
 * In-flow site footer — appears only after scrolling to the end of the active slide
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

  var FOOTER_CHAPTERS = {
    home: 1,
    projects: 1,
    leistungen: 1,
    about: 1,
    contact: 1,
    offerte: 1,
    values: 1,
    experience: 1,
    profile: 1,
    workstyle: 1,
    why: 1,
    faq: 1,
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
    return String(
      (document.body && document.body.getAttribute("data-current-slide")) ||
        (document.body && document.body.getAttribute("data-chapter")) ||
        ""
    ).toLowerCase();
  }

  function normalizeChapter(chapter) {
    if (!chapter || chapter === "home") return "home";
    if (chapter === "projects") return "projects";
    if (chapter === "projekte") return "projects";
    if (chapter === "services") return "leistungen";
    if (chapter === "ueber-mich") return "about";
    if (chapter === "kontakt") return "contact";
    if (chapter === "offer") return "offerte";
    return chapter;
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
      " Alex Lamberti</span>" +
      "</div>" +
      "</div>"
    );
  }

  function createFooter() {
    var footer = document.createElement("footer");
    footer.className = "welten-site-footer";
    footer.setAttribute("role", "contentinfo");
    footer.innerHTML = buildMarkup();
    return footer;
  }

  function getActiveSlide() {
    return (
      document.querySelector(".slide.active") ||
      document.querySelector("main.slides-root .slide.is-active") ||
      document.querySelector("#slidesRoot .slide.active")
    );
  }

  function clearHosts() {
    document.querySelectorAll(".slide.is-footer-host").forEach(function (slide) {
      slide.classList.remove("is-footer-host", "is-footer-natural");
    });
    document.querySelectorAll(".slide-inner.is-footer-fill").forEach(function (inner) {
      inner.classList.remove("is-footer-fill");
      inner.style.minHeight = "";
    });
    document.querySelectorAll(".welten-site-footer-end").forEach(function (el) {
      el.remove();
    });
  }

  function ensureEndSpacer(footer) {
    if (!footer || !footer.parentNode) return;
    var next = footer.nextElementSibling;
    if (next && next.classList.contains("welten-site-footer-end")) return next;
    var spacer = document.createElement("div");
    spacer.className = "welten-site-footer-end";
    spacer.setAttribute("aria-hidden", "true");
    footer.parentNode.insertBefore(spacer, footer.nextSibling);
    return spacer;
  }

  function syncFillHeight(slide, inner) {
    if (!slide || !inner) return;
    var h = Math.round(slide.clientHeight || slide.offsetHeight || 0);
    if (h > 0) {
      /* ~62% of viewport: footer below fold, less empty void under short pages */
      inner.style.minHeight = Math.round(h * 0.62) + "px";
    }
  }

  function mountFooter(footer, chapter) {
    clearHosts();
    var norm = normalizeChapter(chapter);
    var allow = !!FOOTER_CHAPTERS[norm];

    /* Fallback: any active slide may host the footer */
    if (!allow && getActiveSlide()) allow = true;

    if (!allow) {
      footer.hidden = true;
      footer.setAttribute("aria-hidden", "true");
      if (footer.parentNode) footer.parentNode.removeChild(footer);
      document.body.classList.remove("has-welten-footer", "has-welten-footer-expanded");
      return;
    }

    var slide = getActiveSlide();
    if (!slide) {
      document.body.appendChild(footer);
      footer.hidden = true;
      return;
    }

    slide.classList.add("is-footer-host");
    var inner =
      slide.querySelector(":scope > .slide-inner") ||
      slide.querySelector(".slide-inner");

    /* Offerte already has a tall form — don't force viewport min-height (creates empty gap) */
    var skipFill =
      norm === "offerte" ||
      (slide.id && String(slide.id).indexOf("offerte") !== -1) ||
      (inner && inner.classList.contains("offerte-layout"));

    if (inner && !skipFill) {
      inner.classList.add("is-footer-fill");
      syncFillHeight(slide, inner);
    } else if (inner) {
      inner.classList.remove("is-footer-fill");
      inner.style.minHeight = "";
      slide.classList.add("is-footer-natural");
    }

    if (footer.parentNode !== slide) {
      slide.appendChild(footer);
    } else if (inner && footer.previousElementSibling !== inner) {
      slide.appendChild(footer);
    }

    footer.hidden = false;
    footer.removeAttribute("aria-hidden");
    footer.classList.toggle("is-home-footer", norm === "home");
    footer.classList.toggle("is-offerte-footer", norm === "offerte");
    ensureEndSpacer(footer);
    document.body.classList.add("has-welten-footer", "has-welten-footer-expanded");

    if (!skipFill) {
      requestAnimationFrame(function () {
        syncFillHeight(slide, inner);
      });
    }
  }

  function updateLabels(footer) {
    var worldKey = getWorldKey();
    var world = WORLD[worldKey];
    var labels = t();
    var chapter = normalizeChapter(getChapter());

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
      a.setAttribute("aria-current", key === worldKey ? "true" : "false");
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
      var activePath =
        chapter === "home"
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
      a.classList.toggle(
        "is-active",
        (meta.path === "home" && activePath === "home") || meta.path === activePath
      );
    });

    footer.querySelectorAll("[data-footer-impressum]").forEach(function (el) {
      el.textContent = labels.impressum;
    });
    footer.querySelectorAll("[data-footer-privacy]").forEach(function (el) {
      el.textContent = labels.privacy;
    });
    footer.querySelectorAll("[data-footer-agb]").forEach(function (el) {
      el.textContent = labels.agb;
    });

    footer.setAttribute("data-footer-world", worldKey);
  }

  function refresh() {
    var footer = document.querySelector(".welten-site-footer") || createFooter();
    var chapter = normalizeChapter(getChapter());
    updateLabels(footer);
    mountFooter(footer, chapter);
  }

  var scheduled = false;
  function scheduleRefresh() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      refresh();
    });
  }

  function apply() {
    refresh();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }

  document.addEventListener("welten-chapter-change", scheduleRefresh);
  document.addEventListener("welten-lang-change", scheduleRefresh);
  document.addEventListener("welten-world-change", scheduleRefresh);
  window.addEventListener("resize", scheduleRefresh);
  window.addEventListener("orientationchange", scheduleRefresh);

  if (document.body) {
    var obs = new MutationObserver(scheduleRefresh);
    obs.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-world", "data-lang", "data-current-slide", "data-chapter"],
    });
  }
})();
