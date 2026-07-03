/**
 * Welten Cleanup · Kontakt premium, Leistungen, FAQ, NEXORA Orbit, Home Story
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

  var ORBIT_NAV = {
    de: { home: "Home", projects: "Projekte", leistungen: "Leistungen", about: "Über mich", contact: "Kontakt" },
    en: { home: "Home", projects: "Projects", leistungen: "Services", about: "About", contact: "Contact" },
    fr: { home: "Accueil", projects: "Projets", leistungen: "Services", about: "À propos", contact: "Contact" },
    it: { home: "Home", projects: "Progetti", leistungen: "Servizi", about: "Chi sono", contact: "Contatto" },
  };

  var PACKS = {
    de: {
      homeStoryTitle: "Digitale Marken, Websites und Erlebnisse mit Charakter",
      leistungen: {
        label: "Leistungen",
        title: "Leistungen mit klarer Wirkung.",
        intro: "Branding, Webdesign, Optimierung, Marketing, Strategie und Content · professionell ausgearbeitet und auf messbare Ergebnisse ausgerichtet.",
        benefitPrefix: "Nutzen:",
        resultPrefix: "Ergebnis:",
      },
      faqTitle: "Häufige Fragen",
      faqAria: "Häufige Fragen",
      items: [
        {
          title: "Branding",
          desc: "Ich entwickle visuelle Markenauftritte, die klar positionieren und professionell wirken.",
          benefit: "Eine starke Marke schafft Vertrauen und Wiedererkennung vom ersten Kontakt an.",
          bullets: ["Logo und visuelle Identität", "Farbwelt und Typografie", "Markenwirkung und Wiedererkennung", "Designsystem für digitale Kanäle", "einheitlicher Auftritt über Website, Social Media und Print"],
          result: "Ein konsistenter Markenauftritt, der hochwertig und einprägsam wirkt.",
        },
        {
          title: "Webdesign",
          desc: "Ich gestalte Websites mit klarer Struktur, starker Typografie und durchdachter Nutzerführung.",
          benefit: "Besucher verstehen schnell, worum es geht · und finden den Weg zur Anfrage.",
          bullets: ["UX-orientierte Seitenstruktur", "responsive Layouts für alle Geräte", "hochwertige Typografie und Abstände", "klare Call-to-Actions", "digitales Erlebnis statt Standard-Template"],
          result: "Eine Website, die professionell wirkt und gezielt führt.",
        },
        {
          title: "Website-Optimierung",
          desc: "Ich verbessere bestehende Websites in Performance, Struktur, SEO und Conversion.",
          benefit: "Mehr Sichtbarkeit, schnellere Ladezeiten und bessere Nutzererfahrung.",
          bullets: ["Ladezeit- und Performance-Optimierung", "SEO-Struktur und Meta-Daten", "Mobile- und Tablet-Optimierung", "Conversion- und Formular-Optimierung", "technische und inhaltliche Feinschliffe"],
          result: "Eine Website, die schneller lädt und besser performt.",
        },
        {
          title: "Marketing",
          desc: "Ich entwickle digitale Marketing-Konzepte, die Sichtbarkeit und Vertrauen aufbauen.",
          benefit: "Ihre Marke wird gesehen, verstanden und ernst genommen.",
          bullets: ["digitale Kampagnen und Content", "Social-Media-Inszenierung", "Leadformulare und Anfrageprozesse", "Markenkommunikation mit Klarheit", "messbare Ziele und Umsetzung"],
          result: "Marketing, das nicht nur schön aussieht, sondern Wirkung erzeugt.",
        },
        {
          title: "Strategie",
          desc: "Ich denke Projekte vom Ziel her · mit klarer Struktur, Prioritäten und Umsetzungsplan.",
          benefit: "Weniger Unsicherheit, mehr Klarheit und ein roter Faden vom Konzept bis live.",
          bullets: ["Zieldefinition und Positionierung", "Content- und Seitenstruktur", "Customer Journey und Nutzerführung", "Priorisierung und Projektplanung", "Verbindung von Design, Technik und Marketing"],
          result: "Ein durchdachtes digitales Konzept mit klarer Richtung.",
        },
        {
          title: "Content",
          desc: "Ich erstelle Inhalte, die gefunden werden, verstanden werden und Vertrauen aufbauen.",
          benefit: "Ihre Website spricht die richtige Sprache · für Menschen und für Google.",
          bullets: ["SEO-orientierte Texte", "klare Botschaften und Tonalität", "Struktur für Suchmaschinen", "Content für Leistungs- und Projektseiten", "verständliche Formulierungen ohne Fülltext"],
          result: "Inhalte, die Sichtbarkeit und Glaubwürdigkeit stärken.",
        },
      ],
      faq: [
        { q: "Wie läuft ein Projekt ab?", a: "Zuerst klären wir Ziel, Umfang und Erwartungen. Danach folgen Struktur, Design und Umsetzung · transparent, schrittweise und mit klaren Feedback-Schleifen." },
        { q: "Für wen sind die Leistungen geeignet?", a: "Für Unternehmen, Selbstständige und Marken, die einen professionellen digitalen Auftritt wollen · von Website und Branding bis Marketing und Optimierung." },
        { q: "Wie lange dauert eine Website-Umsetzung?", a: "Das hängt vom Umfang ab. Einfache Projekte können in wenigen Wochen live gehen, komplexere Konzepte brauchen mehr Planung und Abstimmung." },
        { q: "Kann eine bestehende Website optimiert werden?", a: "Ja. Performance, SEO, Struktur, Mobile-Darstellung und Conversion können auch bei bestehenden Websites deutlich verbessert werden." },
        { q: "Wird die Website für Mobile und Tablet optimiert?", a: "Ja. Responsive Darstellung, Touch-Flächen und Lesbarkeit auf allen Geräten gehören zur Standard-Umsetzung." },
        { q: "Wird SEO direkt mit umgesetzt?", a: "Ja. Meta-Daten, saubere Struktur, indexierbare Seiten und SEO-freundliche Inhalte werden von Anfang an mitgedacht." },
        { q: "Wie kann ich Kontakt aufnehmen?", a: "Per Telefon unter 079 667 82 11 oder per E-Mail an alex.lamberti@hotmail.ch. Ich antworte schnell und unkompliziert." },
      ],
    },
    en: {
      homeStoryTitle: "Digital brands, websites and experiences with character",
      leistungen: {
        label: "Services",
        title: "Services with clear impact.",
        intro: "Branding, web design, optimisation, marketing, strategy and content · professionally crafted and aimed at measurable results.",
        benefitPrefix: "Benefit:",
        resultPrefix: "Result:",
      },
      faqTitle: "Frequently asked questions",
      faqAria: "Frequently asked questions",
      items: [
        {
          title: "Branding",
          desc: "I develop visual brand presences that position clearly and look professional.",
          benefit: "A strong brand builds trust and recognition from the first contact.",
          bullets: ["Logo and visual identity", "Colour palette and typography", "Brand impact and recognition", "Design system for digital channels", "consistent presence across website, social media and print"],
          result: "A consistent brand presence that feels high-quality and memorable.",
        },
        {
          title: "Web design",
          desc: "I design websites with clear structure, strong typography and thoughtful user guidance.",
          benefit: "Visitors quickly understand what it's about · and find the path to enquiry.",
          bullets: ["UX-oriented page structure", "responsive layouts for all devices", "high-quality typography and spacing", "clear calls to action", "digital experience instead of standard template"],
          result: "A website that looks professional and guides effectively.",
        },
        {
          title: "Website optimisation",
          desc: "I improve existing websites in performance, structure, SEO and conversion.",
          benefit: "More visibility, faster load times and a better user experience.",
          bullets: ["load time and performance optimisation", "SEO structure and meta data", "mobile and tablet optimisation", "conversion and form optimisation", "technical and content refinements"],
          result: "A website that loads faster and performs better.",
        },
        {
          title: "Marketing",
          desc: "I develop digital marketing concepts that build visibility and trust.",
          benefit: "Your brand is seen, understood and taken seriously.",
          bullets: ["digital campaigns and content", "social media staging", "lead forms and enquiry processes", "brand communication with clarity", "measurable goals and delivery"],
          result: "Marketing that doesn't just look good but creates impact.",
        },
        {
          title: "Strategy",
          desc: "I think projects from the goal outward · with clear structure, priorities and implementation plan.",
          benefit: "Less uncertainty, more clarity and a red thread from concept to live.",
          bullets: ["goal definition and positioning", "content and page structure", "customer journey and user guidance", "prioritisation and project planning", "connecting design, technology and marketing"],
          result: "A thoughtful digital concept with clear direction.",
        },
        {
          title: "Content",
          desc: "I create content that is found, understood and builds trust.",
          benefit: "Your website speaks the right language · for people and for Google.",
          bullets: ["SEO-oriented copy", "clear messages and tone", "structure for search engines", "content for service and project pages", "understandable wording without filler"],
          result: "Content that strengthens visibility and credibility.",
        },
      ],
      faq: [
        { q: "How does a project work?", a: "First we clarify goal, scope and expectations. Then structure, design and delivery follow · transparent, step by step with clear feedback loops." },
        { q: "Who are the services for?", a: "For businesses, freelancers and brands that want a professional digital presence · from website and branding to marketing and optimisation." },
        { q: "How long does a website take?", a: "It depends on scope. Simple projects can go live in a few weeks; more complex concepts need more planning and alignment." },
        { q: "Can an existing website be optimised?", a: "Yes. Performance, SEO, structure, mobile display and conversion can be significantly improved on existing sites." },
        { q: "Is the website optimised for mobile and tablet?", a: "Yes. Responsive display, touch targets and readability on all devices are standard." },
        { q: "Is SEO included from the start?", a: "Yes. Meta data, clean structure, indexable pages and SEO-friendly content are considered from day one." },
        { q: "How can I get in touch?", a: "By phone on 079 667 82 11 or email at alex.lamberti@hotmail.ch. I respond quickly and without fuss." },
      ],
    },
    it: {
      homeStoryTitle: "Brand digitali, siti web ed esperienze con carattere",
      leistungen: {
        label: "Servizi",
        title: "Servizi con impatto chiaro.",
        intro: "Branding, web design, ottimizzazione, marketing, strategia e contenuti · sviluppati professionalmente e orientati a risultati misurabili.",
        benefitPrefix: "Vantaggio:",
        resultPrefix: "Risultato:",
      },
      faqTitle: "Domande frequenti",
      faqAria: "Domande frequenti",
      items: [
        {
          title: "Branding",
          desc: "Sviluppo presenze di marca visive che posizionano chiaramente e appaiono professionali.",
          benefit: "Un brand forte crea fiducia e riconoscibilità dal primo contatto.",
          bullets: ["Logo e identità visiva", "palette colori e tipografia", "impatto e riconoscibilità del brand", "design system per canali digitali", "presenza uniforme su sito, social e print"],
          result: "Una presenza di marca coerente, di alta qualità e memorabile.",
        },
        {
          title: "Web design",
          desc: "Progetto siti web con struttura chiara, tipografia forte e guida utente ponderata.",
          benefit: "I visitatori capiscono rapidamente di cosa si tratta · e trovano il percorso verso la richiesta.",
          bullets: ["struttura pagine orientata alla UX", "layout responsive per tutti i dispositivi", "tipografia e spaziatura di qualità", "call to action chiare", "esperienza digitale invece del template standard"],
          result: "Un sito che appare professionale e guida in modo efficace.",
        },
        {
          title: "Ottimizzazione sito",
          desc: "Miglioro siti esistenti in performance, struttura, SEO e conversione.",
          benefit: "Più visibilità, tempi di caricamento più rapidi e migliore esperienza utente.",
          bullets: ["ottimizzazione tempi e performance", "struttura SEO e meta dati", "ottimizzazione mobile e tablet", "ottimizzazione conversione e moduli", "rifiniture tecniche e di contenuto"],
          result: "Un sito che carica più velocemente e performa meglio.",
        },
        {
          title: "Marketing",
          desc: "Sviluppo concept di marketing digitale che costruiscono visibilità e fiducia.",
          benefit: "Il tuo brand viene visto, compreso e preso sul serio.",
          bullets: ["campagne digitali e contenuti", "allestimento social media", "moduli lead e processi richiesta", "comunicazione di marca chiara", "obiettivi misurabili e implementazione"],
          result: "Marketing che non è solo bello ma crea impatto.",
        },
        {
          title: "Strategia",
          desc: "Penso ai progetti partendo dall'obiettivo · con struttura chiara, priorità e piano di implementazione.",
          benefit: "Meno incertezza, più chiarezza e un filo rosso dal concept al live.",
          bullets: ["definizione obiettivi e posizionamento", "struttura contenuti e pagine", "customer journey e guida utente", "prioritizzazione e pianificazione", "connessione design, tecnologia e marketing"],
          result: "Un concept digitale ponderato con direzione chiara.",
        },
        {
          title: "Content",
          desc: "Creo contenuti che vengono trovati, compresi e costruiscono fiducia.",
          benefit: "Il tuo sito parla la lingua giusta · per le persone e per Google.",
          bullets: ["testi orientati alla SEO", "messaggi chiari e tonalità", "struttura per i motori di ricerca", "contenuti per pagine servizi e progetti", "formulazioni comprensibili senza riempitivi"],
          result: "Contenuti che rafforzano visibilità e credibilità.",
        },
      ],
      faq: [
        { q: "Come funziona un progetto?", a: "Prima chiarifichiamo obiettivo, ambito e aspettative. Poi struttura, design e implementazione · trasparente, passo dopo passo con feedback chiari." },
        { q: "Per chi sono i servizi?", a: "Per aziende, liberi professionisti e brand che vogliono una presenza digitale professionale · dal sito web al branding fino a marketing e ottimizzazione." },
        { q: "Quanto tempo serve per un sito web?", a: "Dipende dall'ambito. Progetti semplici possono andare live in poche settimane; concept più complessi richiedono più pianificazione." },
        { q: "Si può ottimizzare un sito esistente?", a: "Sì. Performance, SEO, struttura, visualizzazione mobile e conversione possono essere migliorati significativamente." },
        { q: "Il sito è ottimizzato per mobile e tablet?", a: "Sì. Visualizzazione responsive, aree touch e leggibilità su tutti i dispositivi sono standard." },
        { q: "La SEO è inclusa fin dall'inizio?", a: "Sì. Meta dati, struttura pulita, pagine indicizzabili e contenuti SEO-friendly sono considerati dal primo giorno." },
        { q: "Come posso contattarti?", a: "Per telefono al 079 667 82 11 o via e-mail a alex.lamberti@hotmail.ch. Rispondo rapidamente e senza complicazioni." },
      ],
    },
  };

  function getLang() {
    try {
      return localStorage.getItem("mv-preview-lang") || sessionStorage.getItem("mv-preview-lang") || "de";
    } catch (e) {
      return "de";
    }
  }

  function getPack(lang) {
    if (window.WeltenTranslations) {
      return window.WeltenTranslations.langPack(PACKS, lang) || PACKS.de;
    }
    return PACKS[lang] || PACKS.de;
  }

  function resolveChapter(id) {
    return ALIASES[id] || id;
  }

  function removeFooter() {
    document.querySelectorAll(".welten-site-footer").forEach(function (el) {
      el.remove();
    });
  }

  function applyAllPortraits() {
    var IMG = window.PORTFOLIO_INLINE_IMAGES || {};
    var w = document.body.getAttribute("data-world") || "nexora";
    var src = IMG[w] || IMG.nexora || IMG.vertex;
    if (!src) return;
    var alt =
      w === "vertex"
        ? "Alex Lamberti"
        : w === "freiraum"
          ? "Alex Lamberti · Freiraum"
          : "Alex Lamberti · Nexora";
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

  function rebuildContactPremium() {}

  function removeHomeClosing() {
    document.querySelectorAll(".welten-home-closing").forEach(function (el) {
      el.remove();
    });
  }

  function enhanceHomeStory(lang) {
    var intro = document.querySelector(".welten-home-intro");
    if (!intro) return;
    var pack = getPack(lang);
    var h2 = intro.querySelector(".welten-home-story__title");
    if (!h2) {
      h2 = document.createElement("h2");
      h2.className = "welten-home-story__title";
      intro.insertBefore(h2, intro.firstChild);
    }
    h2.textContent = pack.homeStoryTitle;
  }

  function renderLeistungenRich(wrap, lang) {
    var pack = getPack(lang);
    wrap.innerHTML = "";
    pack.items.forEach(function (item) {
      var card = document.createElement("article");
      card.className = "welten-leistung-rich glass-card";
      var bullets = item.bullets
        .map(function (b) {
          return "<li>" + b + "</li>";
        })
        .join("");
      card.innerHTML =
        "<h3>" +
        item.title +
        "</h3>" +
        '<p class="welten-leistung-rich__desc">' +
        item.desc +
        "</p>" +
        '<p class="welten-leistung-rich__benefit">' +
        pack.leistungen.benefitPrefix +
        " " +
        item.benefit +
        "</p>" +
        "<ul>" +
        bullets +
        "</ul>" +
        '<p class="welten-leistung-rich__result">' +
        pack.leistungen.resultPrefix +
        " " +
        item.result +
        "</p>";
      wrap.appendChild(card);
    });
  }

  function renderFaqSection(faq, lang) {
    var pack = getPack(lang);
    faq.setAttribute("aria-label", pack.faqAria);
    faq.innerHTML = "<h3>" + pack.faqTitle + "</h3>";
    pack.faq.forEach(function (item, i) {
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
  }

  function updateLeistungenHeader(slide, lang) {
    var pack = getPack(lang);
    var label = slide.querySelector(".chapter-label");
    if (label) label.textContent = pack.leistungen.label;
    var title = slide.querySelector(".section-title");
    if (title) title.textContent = pack.leistungen.title;
    var intro = slide.querySelector(".prose");
    if (intro && !intro.classList.contains("projects-intro")) intro.textContent = pack.leistungen.intro;
  }

  function injectFaqSchema(lang) {
    var pack = getPack(lang);
    var existing = document.getElementById("welten-faq-schema");
    if (existing) existing.remove();
    var data = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: pack.faq.map(function (item) {
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

  function injectLeistungenRich(lang) {
    lang = lang || getLang();
    var slide = document.querySelector("#slide-leistungen .slide-inner");
    if (!slide) return;

    updateLeistungenHeader(slide, lang);

    var lanes = slide.querySelector("[data-welten-leistungen-lanes]");
    if (lanes) lanes.style.display = "none";

    var oldGrid = slide.querySelector(".welten-leistungen-grid");
    if (oldGrid) oldGrid.remove();

    var wrap = slide.querySelector(".welten-leistungen-rich");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "welten-leistungen-rich";
      slide.appendChild(wrap);
    }
    renderLeistungenRich(wrap, lang);

    var faq = slide.querySelector(".welten-faq");
    if (!faq) {
      faq = document.createElement("section");
      faq.className = "welten-faq";
      slide.appendChild(faq);
    }
    renderFaqSection(faq, lang);
    injectFaqSchema(lang);
  }

  function fixNexoraOrbit(lang) {
    if (document.body.getAttribute("data-world") !== "nexora") return;
    var hero = document.querySelector("#slide-home .home-hero-experience");
    if (!hero) return;

    var nav =
      (window.WeltenTranslations && window.WeltenTranslations.langPack(ORBIT_NAV, lang)) ||
      ORBIT_NAV[lang] ||
      ORBIT_NAV.de;
    var orbitItems = [
      ["home", nav.home],
      ["projects", nav.projects],
      ["leistungen", nav.leistungen],
      ["about", nav.about],
      ["contact", nav.contact],
    ];

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
        var match = orbitItems.find(function (item) {
          return item[0] === go;
        });
        if (match) btn.textContent = match[1];
      });
      if (ring.querySelectorAll(".nexora-orbit-button").length !== orbitItems.length) {
        ring.querySelectorAll(".nexora-orbit-button").forEach(function (b) {
          b.remove();
        });
        orbitItems.forEach(function (item, index) {
          var el = document.createElement("button");
          el.type = "button";
          el.className = "nexora-orbit-button";
          el.setAttribute("data-go", item[0]);
          el.style.setProperty("--i", index);
          el.textContent = item[1];
          ring.appendChild(el);
        });
      }
      ring.style.setProperty("--nexora-orbit-step", 360 / orbitItems.length + "deg");
    }

    hero.querySelectorAll(".dna-slide").forEach(function (btn) {
      btn.remove();
    });
  }

  function ensureProjectsAccordion() {
    document.dispatchEvent(new CustomEvent("welten-init-projects-accordion"));
  }

  function onChapterChange(e) {
    var ch = (e && e.detail && e.detail.chapter) || document.body.getAttribute("data-current-slide");
    if (ch === "leistungen") injectLeistungenRich(getLang());
    if (ch === "contact") rebuildContactPremium();
    if (ch === "projects") ensureProjectsAccordion();
    if (ch === "home") removeHomeClosing();
  }

  function apply(lang) {
    lang = lang || getLang();
    removeFooter();
    rebuildContactPremium();
    enhanceHomeStory(lang);
    removeHomeClosing();
    injectLeistungenRich(lang);
    fixNexoraOrbit(lang);
    applyAllPortraits();
    if (document.body.getAttribute("data-current-slide") === "projects") {
      ensureProjectsAccordion();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      apply(getLang());
    });
  } else {
    apply(getLang());
  }

  document.addEventListener("welten-chapter-change", onChapterChange);
  document.addEventListener("welten-lang-change", function (e) {
    var lang = (e && e.detail && e.detail.lang) || getLang();
    enhanceHomeStory(lang);
    injectLeistungenRich(lang);
    fixNexoraOrbit(lang);
  });
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
    setTimeout(function () {
      fixNexoraOrbit(getLang());
    }, 120);
  });

  window.WeltenCleanup = { apply: apply, injectLeistungenRich: injectLeistungenRich, getLang: getLang };
})();
