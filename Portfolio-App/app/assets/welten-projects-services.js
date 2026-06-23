/**
 * Projekte — zusätzliche Leistungskarten (Logo, QR, SEO, 3D, Präsentationen)
 */
(function () {
  "use strict";

  var V = "20260623svc1";

  var ACCORDION_SERVICES = {
    websites: "web",
    leadformulare: "form",
    visitenkarten: "qr",
  };

  var SERVICES = [
    { key: "logo", titleKey: "logo" },
    { key: "qr", titleKey: "qr" },
    { key: "seo", titleKey: "seo" },
    { key: "print", titleKey: "print" },
    { key: "layout3d", titleKey: "layout3d" },
    { key: "present", titleKey: "present" },
  ];

  var COPY = {
    de: {
      sectionTitle: "Weitere Leistungen",
      sectionIntro:
        "Diese Bereiche ergänzen die Projektbeispiele oben — mit Bildern und Kurzbeschreibungen passend zur jeweiligen Welt.",
      logo: {
        title: "Logo Design",
        desc: "Entwicklung neuer Logos, Markenauftritte und visuelle Identitäten für Unternehmen und Projekte.",
      },
      qr: {
        title: "QR-Code",
        desc: "Individuell gestaltete QR-Codes für Printprodukte, Websites, Kampagnen und digitale Anwendungen.",
      },
      seo: {
        title: "SEO & SEA",
        desc: "Optimierung der Sichtbarkeit durch Suchmaschinenoptimierung (SEO) und Suchmaschinenwerbung (SEA).",
      },
      print: {
        title: "Printmedien",
        desc: "Flyer, Visitenkarten, Poster, Broschüren oder Roll-ups — gestaltet und druckfertig aufbereitet.",
      },
      layout3d: {
        title: "3D Layouts",
        desc: "Visualisierung von Flächen, Konzepten, Innenräumen und Projektideen in 3D.",
      },
      present: {
        title: "Präsentationen",
        desc: "Pitch Decks, Unternehmenspräsentationen und Verkaufsunterlagen für Kunden, Investoren und Partner.",
      },
    },
    en: {
      sectionTitle: "More services",
      sectionIntro:
        "These areas complement the project examples above — with images and short descriptions matching each world.",
      logo: {
        title: "Logo design",
        desc: "Development of new logos, brand presences and visual identities for companies and projects.",
      },
      qr: {
        title: "QR code",
        desc: "Custom-designed QR codes for print products, websites, campaigns and digital applications.",
      },
      seo: {
        title: "SEO & SEA",
        desc: "Improving visibility through search engine optimisation (SEO) and search engine advertising (SEA).",
      },
      print: {
        title: "Print media",
        desc: "Flyers, business cards, posters, brochures or roll-ups — designed and prepared for print.",
      },
      layout3d: {
        title: "3D layouts",
        desc: "Visualisation of spaces, concepts, interiors and project ideas in 3D.",
      },
      present: {
        title: "Presentations",
        desc: "Pitch decks, company presentations and sales materials for clients, investors and partners.",
      },
    },
    it: {
      sectionTitle: "Altri servizi",
      sectionIntro:
        "Queste aree completano gli esempi di progetto sopra — con immagini e brevi descrizioni per ogni mondo.",
      logo: {
        title: "Logo design",
        desc: "Sviluppo di nuovi loghi, presenze di marca e identità visive per aziende e progetti.",
      },
      qr: {
        title: "QR code",
        desc: "QR code personalizzati per prodotti stampati, siti web, campagne e applicazioni digitali.",
      },
      seo: {
        title: "SEO & SEA",
        desc: "Ottimizzazione della visibilità tramite SEO e pubblicità sui motori di ricerca (SEA).",
      },
      print: {
        title: "Materiale stampato",
        desc: "Flyer, biglietti da visita, poster, brochure o roll-up — progettati e pronti per la stampa.",
      },
      layout3d: {
        title: "Layout 3D",
        desc: "Visualizzazione di spazi, concetti, interni e idee di progetto in 3D.",
      },
      present: {
        title: "Presentazioni",
        desc: "Pitch deck, presentazioni aziendali e materiali di vendita per clienti, investitori e partner.",
      },
    },
  };

  function currentLang() {
    try {
      return (
        localStorage.getItem("mv-preview-lang") ||
        sessionStorage.getItem("mv-preview-lang") ||
        document.documentElement.lang ||
        "de"
      );
    } catch (e) {
      return "de";
    }
  }

  function t(key) {
    var lang = currentLang();
    var pack = COPY[lang] || COPY.de;
    return pack[key] != null ? pack[key] : COPY.de[key];
  }

  function worldKey() {
    var w = document.body.getAttribute("data-world") || "nexora";
    if (w === "vertex") return "professional";
    if (w === "general" || w === "nexora" || w === "freiraum" || w === "professional") return w;
    return "nexora";
  }

  function imageUrl(serviceKey) {
    if (window.WeltenFormServiceImage) {
      return window.WeltenFormServiceImage(worldKey(), serviceKey) + "?v=" + V;
    }
    return "";
  }

  function applyAccordionBackgrounds() {
    var accordion = document.querySelector("#slide-projects [data-projects-accordion]");
    if (!accordion) return false;
    if (!window.WeltenFormServiceImage) return false;

    Object.keys(ACCORDION_SERVICES).forEach(function (cat) {
      var item = accordion.querySelector('.projects-accordion__item[data-category="' + cat + '"]');
      if (!item) return;
      var trigger = item.querySelector(".projects-accordion__trigger");
      if (!trigger) return;
      var serviceKey = ACCORDION_SERVICES[cat];
      var url = imageUrl(serviceKey);
      if (!url) return;
      item.setAttribute("data-service-key", serviceKey);
      trigger.style.setProperty("--accordion-service-bg", 'url("' + url + '")');
      trigger.classList.add("has-service-bg");

      var thumb = trigger.querySelector(".projects-accordion__thumb");
      if (!thumb) {
        thumb = document.createElement("img");
        thumb.className = "projects-accordion__thumb";
        thumb.alt = "";
        thumb.loading = "lazy";
        thumb.decoding = "async";
        trigger.insertBefore(thumb, trigger.firstChild);
      }
      if (thumb.getAttribute("src") !== url) {
        thumb.setAttribute("src", url);
      }
    });
    return true;
  }

  function ensureAccordionBackgrounds(attempt) {
    if (applyAccordionBackgrounds()) return;
    if ((attempt || 0) >= 12) return;
    setTimeout(function () {
      ensureAccordionBackgrounds((attempt || 0) + 1);
    }, 120);
  }

  function revealCards(root) {
    if (!root) return;
    var visible =
      document.body.getAttribute("data-current-slide") === "projects" ||
      !!document.querySelector("#slide-projects.active");
    root.querySelectorAll(".project-card--service").forEach(function (card, i) {
      card.classList.add("welten-reveal");
      if (visible) card.classList.add("is-visible");
      card.style.setProperty("--reveal-delay", String((i % 4) + 1));
    });
  }

  function buildCard(service) {
    var copy = t(service.titleKey);
    var title = copy && copy.title ? copy.title : service.key;
    var desc = copy && copy.desc ? copy.desc : "";
    var src = imageUrl(service.key);

    var article = document.createElement("article");
    article.className = "project-card glass-card project-card--preview project-card--service";
    article.setAttribute("data-service", service.key);

    var preview = document.createElement("div");
    preview.className = "project-card__preview project-card__preview--image";

    var img = document.createElement("img");
    img.src = src;
    img.alt = title;
    img.loading = "lazy";
    img.decoding = "async";
    preview.appendChild(img);

    var h3 = document.createElement("h3");
    h3.textContent = title;

    var p = document.createElement("p");
    p.className = "block";
    p.textContent = desc;

    article.appendChild(preview);
    article.appendChild(h3);
    article.appendChild(p);

    return article;
  }

  function render() {
    var slide = document.getElementById("slide-projects");
    if (!slide) return;

    var accordion = slide.querySelector("[data-projects-accordion]");
    if (!accordion) return;

    var wrap = slide.querySelector("[data-projects-services]");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "projects-services";
      wrap.setAttribute("data-projects-services", "");
      wrap.innerHTML =
        '<h3 class="projects-services__title"></h3>' +
        '<p class="projects-services__intro prose"></p>' +
        '<div class="card-grid card-grid--three projects-services__grid"></div>';
      accordion.insertAdjacentElement("afterend", wrap);
    }

    var titleEl = wrap.querySelector(".projects-services__title");
    var introEl = wrap.querySelector(".projects-services__intro");
    if (titleEl) titleEl.textContent = t("sectionTitle");
    if (introEl) introEl.textContent = t("sectionIntro");

    var grid = wrap.querySelector(".projects-services__grid");
    if (!grid) return;
    grid.innerHTML = "";

    SERVICES.forEach(function (service) {
      grid.appendChild(buildCard(service));
    });

    revealCards(wrap);
    applyAccordionBackgrounds();
  }

  function boot() {
    render();
    ensureAccordionBackgrounds(0);
  }

  function onProjectsChapter() {
    render();
    ensureAccordionBackgrounds(0);
    var wrap = document.querySelector("[data-projects-services]");
    if (wrap) revealCards(wrap);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.addEventListener("load", function () {
    ensureAccordionBackgrounds(0);
  });

  try {
    new MutationObserver(function () {
      ensureAccordionBackgrounds(0);
    }).observe(document.body, { attributes: true, attributeFilter: ["data-world", "data-current-slide"] });
  } catch (e) {}

  var projectsSlide = document.getElementById("slide-projects");
  if (projectsSlide) {
    try {
      new MutationObserver(function () {
        if (projectsSlide.classList.contains("active")) ensureAccordionBackgrounds(0);
      }).observe(projectsSlide, { attributes: true, attributeFilter: ["class"] });
    } catch (e2) {}
  }

  document.addEventListener("welten-chapter-change", function (e) {
    if (e && e.detail && e.detail.chapter === "projects") onProjectsChapter();
  });
  document.addEventListener("welten-init-projects-accordion", onProjectsChapter);

  window.addEventListener("message", function (e) {
    if (!e.data) return;
    if (e.data.type === "portfolio-preview-lang" || e.data.type === "alx-preview-sync") {
      render();
      return;
    }
    if (
      e.data.type === "portfolio-world-enter" ||
      e.data.type === "portfolio-cleanup-transition" ||
      e.data.type === "portfolio-go-chapter"
    ) {
      ensureAccordionBackgrounds(0);
      if (e.data.type === "portfolio-go-chapter" || document.body.getAttribute("data-current-slide") === "projects") {
        onProjectsChapter();
      }
    }
  });

  window.WeltenProjectsServices = {
    render: render,
    applyAccordionBackgrounds: applyAccordionBackgrounds,
    ensureAccordionBackgrounds: ensureAccordionBackgrounds,
  };
})();
