/**
 * Shared project accordion for design-test-v2 — mirrors live categories
 * (Websites · Leadformulare · Visitenkarten) with previews.
 */
(function (root) {
  "use strict";

  var WEBSITES = [
    { title: "genialbau.ch", href: "https://genialbau.ch/", blurb: "Hochwertiger Webauftritt mit Fokus auf Vertrauen, starke Bild- und Videowelt sowie klare Leistungsdarstellung." },
    { title: "gallace-all-in-maler.ch", href: "https://gallace-all-in-maler.ch/", blurb: "Klar strukturierter Auftritt für ein lokales KMU mit Fokus auf Dienstleistungen und Kontaktaufnahme." },
    { title: "awarillo.ch", href: "https://awarillo.ch/", blurb: "Digitaler Markenauftritt mit reduzierter visueller Linie und klarer Wiedererkennung." },
    { title: "chesa-cherma.ch", href: "https://chesa-cherma.ch/", blurb: "Atmosphärischer Auftritt mit starker Bildsprache rund um Erlebnis und Aufenthalt." },
    { title: "lbmm.ch", href: "https://lbmm.ch/", blurb: "Klare Struktur, modernes Design und hochwertige Gesamtwirkung." },
    { title: "360clean.ch / Offertenformular", href: "https://360clean.ch/offertenformular/", blurb: "Mehrstufiges Offertenformular mit geführtem Anfrageprozess." },
  ];

  var LEADS = [
    { title: "Sanitrend", href: "/assets/projects/leadformulare/sanitrend.html", blurb: "Mehrstufiges Leadformular für Sanitär und Sanierung — conversion-orientiert." },
    { title: "Dein Umzug Deal", href: "/assets/projects/leadformulare/dein-umzug-deal.html", blurb: "Geführtes Umzugsformular mit klarer Schrittfolge und Vertrauenselementen." },
    { title: "ART Reinigungen", href: "/assets/projects/leadformulare/art-reinigungen.html", blurb: "Anfrageformular für Reinigung und Hauswartung — übersichtlich und vertrauenswürdig." },
    { title: "iDEAL Umzüge", href: "/assets/projects/leadformulare/ideal-umzuege.html", blurb: "Leadformular für Umzugsanfragen." },
    { title: "DT-Cleaning", href: "/assets/projects/leadformulare/dt-cleaning.html", blurb: "Anfrageprozess für Reinigungsleistungen." },
    { title: "Spitex Xundheit Plus", href: "/assets/projects/leadformulare/spitex-xundheit-plus.html", blurb: "Leadformular mit klarer Nutzerführung." },
  ];

  var CARDS = [
    { title: "ad-res", href: "/assets/projects/visitenkarten/ad-res.html", blurb: "Digitale Visitenkarte mit klarem Markenauftritt und schnellem Kontaktzugang." },
    { title: "haller-design", href: "/assets/projects/visitenkarten/haller-design.html", blurb: "Design-orientierte digitale Karte mit klarer visueller Linie." },
    { title: "kita-wundersterne", href: "/assets/projects/visitenkarten/kita-wundersterne.html", blurb: "Warme, vertrauensvolle Visitenkarte mit klaren Infos für Eltern." },
    { title: "bodenbelaege-hajdari", href: "/assets/projects/visitenkarten/bodenbelaege-hajdari.html", blurb: "Digitale Visitenkarte für Bodenbeläge." },
    { title: "burgunder-handwerk", href: "/assets/projects/visitenkarten/burgunder-handwerk.html", blurb: "Digitale Visitenkarte mit handwerklichem Auftritt." },
    { title: "chesa-cherma", href: "/assets/projects/visitenkarten/chesa-cherma.html", blurb: "Digitale Visitenkarte zur Marke Chesa Cherma." },
  ];

  var LABELS = {
    de: { websites: "Websites", leads: "Leadformulare", cards: "Digitale Visitenkarten", open: "Öffnen", preview: "Vorschau" },
    en: { websites: "Websites", leads: "Lead forms", cards: "Digital business cards", open: "Open", preview: "Preview" },
    fr: { websites: "Sites web", leads: "Formulaires lead", cards: "Cartes de visite numériques", open: "Ouvrir", preview: "Aperçu" },
    it: { websites: "Siti web", leads: "Moduli lead", cards: "Biglietti da visita digitali", open: "Apri", preview: "Anteprima" },
  };

  function lang() {
    try {
      return (
        root.localStorage.getItem("mv-preview-lang") ||
        root.localStorage.getItem("mv-lang") ||
        "de"
      );
    } catch (e) {
      return "de";
    }
  }

  function labels() {
    return LABELS[lang()] || LABELS.de;
  }

  function cardHtml(item, external) {
    var src = item.href;
    var isExt = /^https?:/i.test(src);
    return (
      '<article class="v2-project-card">' +
      '<div class="v2-project-card__preview">' +
      '<iframe title="' +
      item.title.replace(/"/g, "") +
      '" loading="lazy" data-v2-lazy-src="' +
      src +
      '" src="about:blank"></iframe>' +
      "</div>" +
      "<h3>" +
      item.title +
      "</h3>" +
      "<p>" +
      item.blurb +
      "</p>" +
      '<a class="v2-project-card__open" href="' +
      src +
      '" target="_blank" rel="noopener noreferrer">' +
      labels().open +
      " →</a>" +
      "</article>"
    );
  }

  function categoryHtml(key, title, items) {
    return (
      '<div class="v2-projects-acc__item" data-category="' +
      key +
      '">' +
      '<button type="button" class="v2-projects-acc__trigger" aria-expanded="false">' +
      "<span>" +
      title +
      "</span><span aria-hidden=\"true\">+</span>" +
      "</button>" +
      '<div class="v2-projects-acc__panel" hidden>' +
      '<div class="v2-projects-acc__grid">' +
      items.map(cardHtml).join("") +
      "</div></div></div>"
    );
  }

  function ensureStyles() {
    if (root.document.getElementById("v2-projects-css")) return;
    var link = root.document.createElement("link");
    link.id = "v2-projects-css";
    link.rel = "stylesheet";
    link.href = "/assets/design-test-v2/shared/v2-projects.css?v=20260724v2h";
    root.document.head.appendChild(link);
  }

  function activateIframes(panel) {
    panel.querySelectorAll("iframe[data-v2-lazy-src]").forEach(function (f) {
      if (f.getAttribute("src") === "about:blank" || !f.getAttribute("src")) {
        f.src = f.getAttribute("data-v2-lazy-src");
      }
    });
  }

  function bindAccordion(rootEl) {
    rootEl.querySelectorAll(".v2-projects-acc__trigger").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.closest(".v2-projects-acc__item");
        var panel = item.querySelector(".v2-projects-acc__panel");
        var open = btn.getAttribute("aria-expanded") === "true";
        rootEl.querySelectorAll(".v2-projects-acc__item").forEach(function (other) {
          var b = other.querySelector(".v2-projects-acc__trigger");
          var p = other.querySelector(".v2-projects-acc__panel");
          if (b) b.setAttribute("aria-expanded", "false");
          if (p) p.hidden = true;
          other.classList.remove("is-open");
        });
        if (!open) {
          btn.setAttribute("aria-expanded", "true");
          panel.hidden = false;
          item.classList.add("is-open");
          activateIframes(panel);
        }
      });
    });
  }

  function mount(el) {
    if (!el || el.__v2ProjectsMounted) return;
    el.__v2ProjectsMounted = true;
    ensureStyles();
    var L = labels();
    el.innerHTML =
      '<div class="v2-projects-acc" data-v2-projects-acc>' +
      categoryHtml("websites", L.websites, WEBSITES) +
      categoryHtml("leads", L.leads, LEADS) +
      categoryHtml("cards", L.cards, CARDS) +
      "</div>";
    bindAccordion(el);
    /* All categories closed until the visitor opens one */
  }

  function mountAll() {
    root.document.querySelectorAll("[data-v2-projects]").forEach(mount);
  }

  function remountOnLang() {
    root.document.querySelectorAll("[data-v2-projects]").forEach(function (el) {
      el.__v2ProjectsMounted = false;
      mount(el);
    });
  }

  root.WeltenDesignTestV2Projects = { mountAll: mountAll, remountOnLang: remountOnLang };

  if (root.document.readyState === "loading") {
    root.document.addEventListener("DOMContentLoaded", mountAll);
  } else {
    mountAll();
  }

  root.addEventListener("v2-lang-change", remountOnLang);
})(typeof window !== "undefined" ? window : this);
