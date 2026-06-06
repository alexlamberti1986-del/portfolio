/**
 * Welten Cleanup — Kontakt premium, Leistungen, FAQ, NEXORA Orbit, Home Story
 */
(function () {
  "use strict";

  var TEL = "+41796678211";
  var TEL_DISP = "079 667 82 11";
  var MAIL = "alex.lamberti@hotmail.ch";

  var CHAPTERS = ["home", "projects", "leistungen", "about", "contact"];
  var ALIASES = {
    profile: "leistungen",
    values: "about",
    strengths: "leistungen",
    experience: "about",
    workstyle: "about",
    why: "about",
    faq: "about",
  };

  var ORBIT_ITEMS = [
    ["home", "Home"],
    ["projects", "Projekte"],
    ["leistungen", "Leistungen"],
    ["about", "Über mich"],
    ["contact", "Kontakt"],
  ];

  var LEISTUNGEN = [
    {
      title: "Branding",
      desc: "Ich entwickle visuelle Markenauftritte, die klar positionieren und professionell wirken.",
      benefit: "Nutzen: Eine starke Marke schafft Vertrauen und Wiedererkennung vom ersten Kontakt an.",
      bullets: [
        "Logo und visuelle Identität",
        "Farbwelt und Typografie",
        "Markenwirkung und Wiedererkennung",
        "Designsystem für digitale Kanäle",
        "einheitlicher Auftritt über Website, Social Media und Print",
      ],
      result: "Ergebnis: Ein konsistenter Markenauftritt, der hochwertig und einprägsam wirkt.",
    },
    {
      title: "Webdesign",
      desc: "Ich gestalte Websites mit klarer Struktur, starker Typografie und durchdachter Nutzerführung.",
      benefit: "Nutzen: Besucher verstehen schnell, worum es geht — und finden den Weg zur Anfrage.",
      bullets: [
        "UX-orientierte Seitenstruktur",
        "responsive Layouts für alle Geräte",
        "hochwertige Typografie und Abstände",
        "klare Call-to-Actions",
        "digitales Erlebnis statt Standard-Template",
      ],
      result: "Ergebnis: Eine Website, die professionell wirkt und gezielt führt.",
    },
    {
      title: "Webseiten-Optimierung",
      desc: "Ich verbessere bestehende Websites in Performance, Struktur, SEO und Conversion.",
      benefit: "Nutzen: Mehr Sichtbarkeit, schnellere Ladezeiten und bessere Nutzererfahrung.",
      bullets: [
        "Ladezeit- und Performance-Optimierung",
        "SEO-Struktur und Meta-Daten",
        "Mobile- und Tablet-Optimierung",
        "Conversion- und Formular-Optimierung",
        "technische und inhaltliche Feinschliffe",
      ],
      result: "Ergebnis: Eine Website, die schneller lädt und besser performt.",
    },
    {
      title: "Marketing",
      desc: "Ich entwickle digitale Marketing-Konzepte, die Sichtbarkeit und Vertrauen aufbauen.",
      benefit: "Nutzen: Ihre Marke wird gesehen, verstanden und ernst genommen.",
      bullets: [
        "digitale Kampagnen und Content",
        "Social-Media-Inszenierung",
        "Leadformulare und Anfrageprozesse",
        "Markenkommunikation mit Klarheit",
        "messbare Ziele und Umsetzung",
      ],
      result: "Ergebnis: Marketing, das nicht nur schön aussieht, sondern Wirkung erzeugt.",
    },
    {
      title: "Strategie",
      desc: "Ich denke Projekte vom Ziel her — mit klarer Struktur, Prioritäten und Umsetzungsplan.",
      benefit: "Nutzen: Weniger Unsicherheit, mehr Klarheit und ein roter Faden vom Konzept bis live.",
      bullets: [
        "Zieldefinition und Positionierung",
        "Content- und Seitenstruktur",
        "Customer Journey und Nutzerführung",
        "Priorisierung und Projektplanung",
        "Verbindung von Design, Technik und Marketing",
      ],
      result: "Ergebnis: Ein durchdachtes digitales Konzept mit klarer Richtung.",
    },
    {
      title: "Content",
      desc: "Ich erstelle Inhalte, die gefunden werden, verstanden werden und Vertrauen aufbauen.",
      benefit: "Nutzen: Ihre Website spricht die richtige Sprache — für Menschen und für Google.",
      bullets: [
        "SEO-orientierte Texte",
        "klare Botschaften und Tonalität",
        "Struktur für Suchmaschinen",
        "Content für Leistungs- und Projektseiten",
        "verständliche Formulierungen ohne Fülltext",
      ],
      result: "Ergebnis: Inhalte, die Sichtbarkeit und Glaubwürdigkeit stärken.",
    },
  ];

  var FAQ = [
    {
      q: "Wie läuft ein Projekt ab?",
      a: "Zuerst klären wir Ziel, Umfang und Erwartungen. Danach folgen Struktur, Design und Umsetzung — transparent, schrittweise und mit klaren Feedback-Schleifen.",
    },
    {
      q: "Für wen sind die Leistungen geeignet?",
      a: "Für Unternehmen, Selbstständige und Marken, die einen professionellen digitalen Auftritt wollen — von Website und Branding bis Marketing und Optimierung.",
    },
    {
      q: "Wie lange dauert eine Website-Umsetzung?",
      a: "Das hängt vom Umfang ab. Einfache Projekte können in wenigen Wochen live gehen, komplexere Konzepte brauchen mehr Planung und Abstimmung.",
    },
    {
      q: "Kann eine bestehende Website optimiert werden?",
      a: "Ja. Performance, SEO, Struktur, Mobile-Darstellung und Conversion können auch bei bestehenden Websites deutlich verbessert werden.",
    },
    {
      q: "Wird die Website für Mobile und Tablet optimiert?",
      a: "Ja. Responsive Darstellung, Touch-Flächen und Lesbarkeit auf allen Geräten gehören zur Standard-Umsetzung.",
    },
    {
      q: "Wird SEO direkt mit umgesetzt?",
      a: "Ja. Meta-Daten, saubere Struktur, indexierbare Seiten und SEO-freundliche Inhalte werden von Anfang an mitgedacht.",
    },
    {
      q: "Wie kann ich Kontakt aufnehmen?",
      a: "Per Telefon unter 079 667 82 11 oder per E-Mail an alex.lamberti@hotmail.ch. Ich antworte schnell und unkompliziert.",
    },
  ];

  function resolveChapter(id) {
    return ALIASES[id] || id;
  }

  function removeFooter() {
    document.querySelectorAll(".welten-site-footer").forEach(function (el) {
      el.remove();
    });
  }

  var PORTRAIT_PLACEHOLDER =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

  function applyAllPortraits() {
    var IMG = window.PORTFOLIO_INLINE_IMAGES || {};
    var w = document.body.getAttribute("data-world") || "nexora";
    var src = IMG[w] || IMG.nexora || IMG.vertex;
    if (!src) return;
    var alt =
      w === "vertex"
        ? "Alex Lamberti"
        : w === "freiraum"
          ? "Alex Lamberti — Freiraum"
          : "Alex Lamberti — Nexora";
    document
      .querySelectorAll(".welten-portrait-img, #heroPhoto, #contactPhoto, #contactPhotoHero, #contactPhotoOutro, #homeClosingPhoto")
      .forEach(function (img) {
        img.removeAttribute("srcset");
        img.src = src;
        img.alt = alt;
        img.style.display = "block";
        img.style.opacity = "1";
      });
  }

  function rebuildContactPremium() {
    /* FINAL contact-layout — siehe welten-final-restore.js */
  }

  function injectHomeClosing() {
    var block = document.querySelector("#slide-home .home-main-block");
    if (!block || block.querySelector(".welten-home-closing")) return;

    var closing = document.createElement("section");
    closing.className = "welten-home-closing";
    closing.setAttribute("aria-label", "Persönlicher Abschluss");
    closing.innerHTML =
      '<figure class="welten-home-closing__portrait">' +
      '<img class="portrait-photo welten-portrait-img" id="homeClosingPhoto" src="' + PORTRAIT_PLACEHOLDER + '" alt="Alex Lamberti" width="480" height="600" decoding="async" loading="lazy" />' +
      "</figure>" +
      '<p class="welten-home-closing__text">Alex Lamberti verbindet Branding, Webdesign und digitale Strategie — persönlich, präzise und mit Blick auf echte Wirkung.</p>' +
      '<div class="welten-home-closing__cta">' +
      '<button type="button" class="btn" data-go="about">Mehr über mich</button>' +
      "</div>";

    block.appendChild(closing);
    applyAllPortraits();
    wireHomeClosingAboutBtn(closing.querySelector('[data-go="about"]'));
  }

  function wireHomeClosingAboutBtn(btn) {
    if (!btn || btn.dataset.weltenAboutWired === "1") return;
    btn.dataset.weltenAboutWired = "1";
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (window.WeltenSiteIA && typeof window.WeltenSiteIA.navigateToChapter === "function") {
        window.WeltenSiteIA.navigateToChapter("about");
        return;
      }
      var nav =
        document.querySelector('.experience-step[data-go="about"]') ||
        document.querySelector('.menu-links a[data-go="about"]');
      if (nav) nav.click();
    });
  }

  function enhanceHomeStory() {
    var intro = document.querySelector(".welten-home-intro");
    if (!intro || intro.querySelector(".welten-home-story__title")) return;
    var h2 = document.createElement("h2");
    h2.className = "welten-home-story__title";
    h2.textContent = "Digitale Marken, Webseiten und Erlebnisse mit Charakter";
    intro.insertBefore(h2, intro.firstChild);
  }

  function injectLeistungenRich() {
    var slide = document.querySelector("#slide-leistungen .slide-inner");
    if (!slide || slide.querySelector(".welten-leistungen-rich")) return;

    var label = slide.querySelector(".chapter-label");
    if (label) label.textContent = "Leistungen";
    var title = slide.querySelector(".section-title");
    if (title) title.textContent = "Leistungen mit klarer Wirkung.";
    var intro = slide.querySelector(".prose");
    if (intro) {
      intro.textContent =
        "Branding, Webdesign, Optimierung, Marketing, Strategie und Content — professionell ausgearbeitet und auf messbare Ergebnisse ausgerichtet.";
    }

    var lanes = slide.querySelector("[data-welten-leistungen-lanes]");
    if (lanes) lanes.style.display = "none";

    var oldGrid = slide.querySelector(".welten-leistungen-grid");
    if (oldGrid) oldGrid.remove();

    var wrap = document.createElement("div");
    wrap.className = "welten-leistungen-rich";

    LEISTUNGEN.forEach(function (item) {
      var card = document.createElement("article");
      card.className = "welten-leistung-rich glass-card";
      var bullets = item.bullets.map(function (b) {
        return "<li>" + b + "</li>";
      }).join("");
      card.innerHTML =
        "<h3>" + item.title + "</h3>" +
        '<p class="welten-leistung-rich__desc">' + item.desc + "</p>" +
        '<p class="welten-leistung-rich__benefit">' + item.benefit + "</p>" +
        "<ul>" + bullets + "</ul>" +
        '<p class="welten-leistung-rich__result">' + item.result + "</p>";
      wrap.appendChild(card);
    });

    slide.appendChild(wrap);
    injectFAQ(slide);
  }

  function injectFAQ(parent) {
    if (!parent || parent.querySelector(".welten-faq")) return;
    var faq = document.createElement("section");
    faq.className = "welten-faq";
    faq.setAttribute("aria-label", "Häufige Fragen");
    faq.innerHTML = "<h3>Häufige Fragen</h3>";

    FAQ.forEach(function (item, i) {
      var el = document.createElement("div");
      el.className = "welten-faq__item";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "welten-faq__trigger";
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-controls", "welten-faq-panel-" + i);
      btn.id = "welten-faq-trigger-" + i;
      btn.textContent = item.q;
      var panel = document.createElement("div");
      panel.className = "welten-faq__panel";
      panel.id = "welten-faq-panel-" + i;
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-labelledby", "welten-faq-trigger-" + i);
      panel.hidden = true;
      panel.textContent = item.a;
      btn.addEventListener("click", function () {
        var open = el.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        panel.hidden = !open;
      });
      el.appendChild(btn);
      el.appendChild(panel);
      faq.appendChild(el);
    });

    parent.appendChild(faq);
    injectFaqSchema();
  }

  function injectFaqSchema() {
    if (document.getElementById("welten-faq-schema")) return;
    var data = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map(function (item) {
        return {
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        };
      }),
    };
    var script = document.createElement("script");
    script.id = "welten-faq-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  function fixNexoraOrbit() {
    if (document.body.getAttribute("data-world") !== "nexora") return;
    var hero = document.querySelector("#slide-home .home-hero-experience");
    if (!hero) return;

    var ring = hero.querySelector(".nexora-orbit-ring");
    if (ring) {
      var seen = {};
      ring.querySelectorAll(".nexora-orbit-button").forEach(function (btn) {
        var go = btn.getAttribute("data-go");
        if (!go || seen[go]) {
          btn.remove();
          return;
        }
        seen[go] = true;
      });
      if (ring.querySelectorAll(".nexora-orbit-button").length !== ORBIT_ITEMS.length) {
        ring.querySelectorAll(".nexora-orbit-button").forEach(function (b) {
          b.remove();
        });
        ORBIT_ITEMS.forEach(function (item, index) {
          var el = document.createElement("button");
          el.type = "button";
          el.className = "nexora-orbit-button";
          el.setAttribute("data-go", item[0]);
          el.style.setProperty("--i", index);
          el.textContent = item[1];
          ring.appendChild(el);
        });
      }
      ring.style.setProperty("--nexora-orbit-step", 360 / ORBIT_ITEMS.length + "deg");
    }

    hero.querySelectorAll(".dna-slide").forEach(function (btn) {
      btn.remove();
    });
  }

  function ensureProjectsAccordion() {
    document.dispatchEvent(new CustomEvent("welten-init-projects-accordion"));
    setTimeout(function () {
      var root = document.querySelector("[data-projects-accordion]");
      if (!root) return;
      if (root.querySelector(".projects-accordion__item.is-open")) return;
      var first = root.querySelector(
        '.projects-accordion__item[data-category="websites"] .projects-accordion__trigger'
      );
      if (first) first.click();
    }, 160);
  }

  function onChapterChange(e) {
    var ch = (e && e.detail && e.detail.chapter) || document.body.getAttribute("data-current-slide");
    if (ch === "leistungen") injectLeistungenRich();
    if (ch === "contact") rebuildContactPremium();
    if (ch === "projects") ensureProjectsAccordion();
    if (ch === "home") injectHomeClosing();
  }

  function apply() {
    removeFooter();
    rebuildContactPremium();
    enhanceHomeStory();
    injectHomeClosing();
    injectLeistungenRich();
    fixNexoraOrbit();
    applyAllPortraits();
    if (document.body.getAttribute("data-current-slide") === "projects") {
      ensureProjectsAccordion();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }

  document.addEventListener("welten-chapter-change", onChapterChange);
  document.addEventListener(
    "click",
    function (e) {
      if (e.target.closest("[data-world-set]") || e.target.closest("[data-go]")) {
        setTimeout(applyAllPortraits, 90);
      }
    },
    true
  );
  try {
    new MutationObserver(applyAllPortraits).observe(document.body, {
      attributes: true,
      attributeFilter: ["data-world"],
    });
  } catch (e) {}
  window.addEventListener("resize", function () {
    setTimeout(fixNexoraOrbit, 120);
  });
})();
