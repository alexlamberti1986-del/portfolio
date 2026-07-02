/**
 * Portfolio Preview · globale Übersetzungen DE / EN / IT
 */
(function (root) {
  "use strict";

  var NAV = {
    de: { home: "Home", projects: "Projekte", leistungen: "Leistungen", about: "Über mich", contact: "Kontakt", menu: "Menü", menuClose: "Schliessen" },
    en: { home: "Home", projects: "Projects", leistungen: "Services", about: "About", contact: "Contact", menu: "Menu", menuClose: "Close" },
    it: { home: "Home", projects: "Progetti", leistungen: "Servizi", about: "Chi sono", contact: "Contatto", menu: "Menu", menuClose: "Chiudi" },
  };

  var SLIDES = {
    general: {
      de: {
        home: {
          intro: "MULTIVERSUM · Mix · Strategie · Begeisterung",
          h1: "Digitale Welten. Ein Portfolio. Unendliche Möglichkeiten.",
          lead: "NEXORA, PROFESSIONAL und FREIRAUM vereint · ein Auftritt für jede Situation.",
          more: [
            "MULTIVERSUM ist mein übergeordnetes Portfolio: analytisch wie NEXORA, klar wie PROFESSIONAL, emotional wie FREIRAUM · je nach Projekt die passende Wirkung.",
            "Ich verbinde Strategie, Technologie, Design und Umsetzung in einem System, das Marken sichtbar macht und Menschen zur richtigen Entscheidung führt.",
            "Ob Website, Leadformular, SEO, Branding oder Präsentation · ich denke ganzheitlich und liefere Ergebnisse, die professionell wirken und praktisch funktionieren.",
          ],
          cta1: "Projekte ansehen",
          cta2: "Über mich",
          tag: "Vier Welten. Ein Ziel. Deine Vision.",
        },
        about: { label: "Über mich", title: "Ich vereine Strategie, Technologie und Gestaltung in einem klaren digitalen Auftritt.", extraLabel: "MULTIVERSUM", extraTitle: "Alle Welten · ein Ziel" },
        leistungen: { label: "Leistungen", title: "Leistungen & Kompetenzen", intro: "Von Strategie bis Umsetzung · angepasst an Zielgruppe, Marke und Wirkung." },
        projects: { label: "Projekte", title: "Projekte mit klarer Handschrift.", intro: "Websites, Leadformulare und digitale Auftritte · strukturiert nach Kategorie." },
        contact: { label: "Kontakt", title: "Bereit für den nächsten Schritt.", intro: "Schreiben Sie mir · ich melde mich schnell, verbindlich und unkompliziert." },
      },
      en: {
        home: {
          intro: "MULTIVERSE · Mix · Strategy · Excitement",
          h1: "Digital worlds. One portfolio. Endless possibilities.",
          lead: "NEXORA, PROFESSIONAL and FREIRAUM united · the right presence for every situation.",
          more: [
            "The MULTIVERSE is my overarching portfolio: analytical like NEXORA, clear like PROFESSIONAL, emotional like FREIRAUM · the right impact for each project.",
            "I connect strategy, technology, design and delivery in one system that makes brands visible and guides people to the right decision.",
            "Whether website, lead form, SEO, branding or presentation · I think holistically and deliver results that look professional and work in practice.",
          ],
          cta1: "View projects",
          cta2: "About me",
          tag: "Three worlds. One goal. Your vision.",
        },
        about: { label: "About me", title: "I unite strategy, technology and design in one clear digital presence.", extraLabel: "MULTIVERSE", extraTitle: "All worlds · one goal" },
        leistungen: { label: "Services", title: "Services & skills", intro: "From strategy to delivery · tailored to audience, brand and impact." },
        projects: { label: "Projects", title: "Projects with a clear signature.", intro: "Websites, lead forms and digital presence · organised by category." },
        contact: { label: "Contact", title: "Ready for the next step.", intro: "Get in touch · I respond quickly, reliably and without fuss." },
      },
      it: {
        home: {
          intro: "MULTIVERSO · Mix · Strategia · Entusiasmo",
          h1: "Mondi digitali. Un portfolio. Possibilità infinite.",
          lead: "NEXORA, PROFESSIONAL e FREIRAUM uniti · la presenza giusta per ogni situazione.",
          more: [
            "Il MULTIVERSO è il mio portfolio complessivo: analitico come NEXORA, chiaro come PROFESSIONAL, emotivo come FREIRAUM · l'impatto giusto per ogni progetto.",
            "Unisco strategia, tecnologia, design e implementazione in un sistema che rende visibili i brand e guida le persone verso la decisione giusta.",
            "Sito web, modulo lead, SEO, branding o presentazione · penso in modo olistico e consegno risultati professionali e funzionali.",
          ],
          cta1: "Vedi progetti",
          cta2: "Chi sono",
          tag: "Tre mondi. Un obiettivo. La tua visione.",
        },
        about: { label: "Chi sono", title: "Unisco strategia, tecnologia e design in una presenza digitale chiara.", extraLabel: "MULTIVERSO", extraTitle: "Tutti i mondi · un obiettivo" },
        leistungen: { label: "Servizi", title: "Servizi & competenze", intro: "Dalla strategia all'implementazione · adattato a pubblico, brand e impatto." },
        projects: { label: "Progetti", title: "Progetti con identità chiara.", intro: "Siti web, moduli lead e presenza digitale · per categoria." },
        contact: { label: "Contatto", title: "Pronti per il prossimo passo.", intro: "Scrivimi · rispondo rapidamente, in modo affidabile e semplice." },
      },
    },
    nexora: {
      de: {
        home: { intro: "NEXORA · Virtuell · AI · Zukunft", h1: "Digital Marketing zwischen Strategie, Technologie und Zukunft.", lead: "Strategie wird sichtbar. Technologie wird menschlich. Marketing wird wirksam." },
        about: { label: "Über mich", title: "Ich verbinde Markenverständnis, digitale Präzision und echte Umsetzungskraft." },
        leistungen: { label: "Stärken", title: "Leistungen & Kompetenzen", intro: "Diese Stärken nutze ich in digitalen Projekten – von der Konzeption bis zur Umsetzung." },
        projects: { label: "Projekte", title: "Projekte mit klarer Handschrift.", intro: "Drei Projektarten · Websites, Leadformulare und digitale Visitenkarten." },
        contact: { label: "Kontakt", title: "Bereit für den nächsten Schritt.", intro: "Lassen Sie uns ins Gespräch kommen." },
      },
      en: {
        home: { intro: "NEXORA · Virtual · AI · Future", h1: "Digital marketing between strategy, technology and the future.", lead: "Strategy becomes visible. Technology becomes human. Marketing becomes effective." },
        about: { label: "About me", title: "I combine brand understanding, digital precision and real delivery strength." },
        leistungen: { label: "Strengths", title: "Services & skills", intro: "These strengths I use in digital projects · from concept to delivery." },
        projects: { label: "Projects", title: "Projects with a clear signature.", intro: "Three project types · websites, lead forms and digital business cards." },
        contact: { label: "Contact", title: "Ready for the next step.", intro: "Let's talk." },
      },
      it: {
        home: { intro: "NEXORA · Virtuale · AI · Futuro", h1: "Digital marketing tra strategia, tecnologia e futuro.", lead: "La strategia diventa visibile. La tecnologia diventa umana. Il marketing diventa efficace." },
        about: { label: "Chi sono", title: "Unisco comprensione del brand, precisione digitale e capacità di implementazione." },
        leistungen: { label: "Punti di forza", title: "Servizi & competenze", intro: "Questi punti di forza li uso nei progetti digitali · dal concept all'implementazione." },
        projects: { label: "Progetti", title: "Progetti con identità chiara.", intro: "Tre tipi di progetto · siti web, moduli lead e biglietti digitali." },
        contact: { label: "Contatto", title: "Pronti per il prossimo passo.", intro: "Parliamone." },
      },
    },
    vertex: {
      de: {
        home: { intro: "PROFESSIONAL · Klar · Strategisch · Wirkungsvoll", h1: "Marketing mit Klarheit, Struktur und messbarer Wirkung.", lead: "Professionell. Präzise. Verlässlich." },
        about: { label: "Über mich", title: "Klarheit, Verantwortung und Ergebnisorientierung prägen meine Arbeit." },
        leistungen: { label: "Stärken", title: "Leistungen & Kompetenzen", intro: "Strukturierte Umsetzung für Unternehmen, die Klarheit und Qualität erwarten." },
        projects: { label: "Projekte", title: "Projekte mit klarer Handschrift.", intro: "Ausgewählte Referenzen und umgesetzte Auftritte." },
        contact: { label: "Kontakt", title: "Bereit für den nächsten Schritt.", intro: "Ich freue mich auf Ihre Nachricht." },
      },
      en: {
        home: { intro: "PROFESSIONAL · Clear · Strategic · Impactful", h1: "Marketing with clarity, structure and measurable impact.", lead: "Professional. Precise. Reliable." },
        about: { label: "About me", title: "Clarity, responsibility and results orientation shape my work." },
        leistungen: { label: "Strengths", title: "Services & skills", intro: "Structured delivery for businesses that expect clarity and quality." },
        projects: { label: "Projects", title: "Projects with a clear signature.", intro: "Selected references and delivered presences." },
        contact: { label: "Contact", title: "Ready for the next step.", intro: "I look forward to your message." },
      },
      it: {
        home: { intro: "PROFESSIONAL · Chiaro · Strategico · Efficace", h1: "Marketing con chiarezza, struttura e impatto misurabile.", lead: "Professionale. Preciso. Affidabile." },
        about: { label: "Chi sono", title: "Chiarezza, responsabilità e orientamento ai risultati guidano il mio lavoro." },
        leistungen: { label: "Punti di forza", title: "Servizi & competenze", intro: "Implementazione strutturata per aziende che richiedono chiarezza e qualità." },
        projects: { label: "Progetti", title: "Progetti con identità chiara.", intro: "Referenze selezionate e presenze realizzate." },
        contact: { label: "Contatto", title: "Pronti per il prossimo passo.", intro: "Attendo il tuo messaggio." },
      },
    },
    freiraum: {
      de: {
        home: { intro: "FREIRAUM · Kreativ · Emotional · Nahbar", h1: "Marketing mit Herz, Ideen und echter Begeisterung.", lead: "Kreativität trifft Strategie. Emotion trifft Wirkung." },
        about: { label: "Über mich", title: "Ich gestalte Markenerlebnisse, die Menschen berühren und im Gedächtnis bleiben." },
        leistungen: { label: "Stärken", title: "Leistungen & Kompetenzen", intro: "Kreative Konzepte mit emotionaler Tiefe und klarer Umsetzung." },
        projects: { label: "Projekte", title: "Projekte mit klarer Handschrift.", intro: "Ideen, die auffallen · und Wirkung zeigen." },
        contact: { label: "Kontakt", title: "Bereit für den nächsten Schritt.", intro: "Lass uns deine Idee besprechen." },
      },
      en: {
        home: { intro: "FREIRAUM · Creative · Emotional · Approachable", h1: "Marketing with heart, ideas and genuine excitement.", lead: "Creativity meets strategy. Emotion meets impact." },
        about: { label: "About me", title: "I create brand experiences that touch people and stay memorable." },
        leistungen: { label: "Strengths", title: "Services & skills", intro: "Creative concepts with emotional depth and clear delivery." },
        projects: { label: "Projects", title: "Projects with a clear signature.", intro: "Ideas that stand out · and show impact." },
        contact: { label: "Contact", title: "Ready for the next step.", intro: "Let's discuss your idea." },
      },
      it: {
        home: { intro: "FREIRAUM · Creativo · Emotivo · Vicino", h1: "Marketing con cuore, idee e vero entusiasmo.", lead: "La creatività incontra la strategia. L'emozione incontra l'impatto." },
        about: { label: "Chi sono", title: "Creo esperienze di marca che toccano le persone e restano nella memoria." },
        leistungen: { label: "Punti di forza", title: "Servizi & competenze", intro: "Concept creativi con profondità emotiva e implementazione chiara." },
        projects: { label: "Progetti", title: "Progetti con identità chiara.", intro: "Idee che si distinguono · e mostrano impatto." },
        contact: { label: "Contatto", title: "Pronti per il prossimo passo.", intro: "Parliamo della tua idea." },
      },
    },
  };

  var PARALLAX_UI = {
    de: {
      enterWorld: "Welt öffnen",
      viewAllAreas: "Alle Bereiche ansehen",
      scrollCue: "Scrollen",
      portfolio: [
        { label: "Projekte", sub: "Arbeit aus allen Welten" },
        { label: "Leistungen", sub: "Was ich anbiete" },
        { label: "Über mich", sub: "Persönlichkeit & Kompetenz" },
        { label: "Kontakt", sub: "Nächster Schritt" },
      ],
    },
    en: {
      enterWorld: "Open world",
      viewAllAreas: "View all areas",
      scrollCue: "Scroll",
      portfolio: [
        { label: "Projects", sub: "Work from all worlds" },
        { label: "Services", sub: "What I offer" },
        { label: "About me", sub: "Personality & skills" },
        { label: "Contact", sub: "Next step" },
      ],
    },
    it: {
      enterWorld: "Apri mondo",
      viewAllAreas: "Vedi tutte le aree",
      scrollCue: "Scorri",
      portfolio: [
        { label: "Progetti", sub: "Lavori da tutti i mondi" },
        { label: "Servizi", sub: "Cosa offro" },
        { label: "Chi sono", sub: "Personalità e competenze" },
        { label: "Contatto", sub: "Prossimo passo" },
      ],
    },
  };

  var PARALLAX_SLIDES = {
    de: {
      "intro-all-worlds": {
        title: "Reise durch das Multiversum",
        body: "Scrollen startet den Flug durch ein digitales Universum. Unterwegs taucht jede Welt einzeln auf — mit Erklärung, Rolle und Unterschied zu den anderen Welten.",
      },
      "multiversum-focus": {
        label: "MULTIVERSUM",
        lead: "Was ist MULTIVERSUM?",
        body: "Die Übersichtswelt und das verbindende Portfolio-Universum. Hier sehen Sie das Gesamtbild, bevor die Reise in die einzelnen Spezialwelten geht.",
        purpose: "Als Meta-Ebene: Strategie, Persönlichkeit und die passende Wirkung je nach Projekt — analytisch, klar oder emotional.",
        difference: "Nicht eine Spezialwelt wie NEXORA, PROFESSIONAL oder FREIRAUM, sondern das übergeordnete System, das alle drei vereint.",
      },
      "nexora-focus": {
        label: "NEXORA",
        lead: "Was ist NEXORA?",
        body: "Die Technologie-Welt für Systeme, Performance und smarte digitale Lösungen — Web, Automatisierung und technische Klarheit.",
        purpose: "Wenn Projekte technisch anspruchsvoll sind: skalierbare Strukturen, präzise Umsetzung und messbare digitale Wirkung.",
        difference: "Im Gegensatz zu PROFESSIONAL (Business-Klarheit) und FREIRAUM (Kreativität) fokussiert NEXORA auf Technologie, Logik und Systemdenken.",
      },
      "professional-focus": {
        label: "PROFESSIONAL",
        lead: "Was ist PROFESSIONAL?",
        body: "Die Business-Welt für Auftritt, Vertrauen und professionelle Markenführung — strukturiert, seriös und überzeugend.",
        purpose: "Für Unternehmen und Persönlichkeiten, die Klarheit, Glaubwürdigkeit und einen hochwertigen professionellen Eindruck brauchen.",
        difference: "Weniger technisch als NEXORA, weniger expressiv als FREIRAUM — hier steht Präzision, Ordnung und Business-Wirkung im Vordergrund.",
      },
      "freiraum-focus": {
        label: "FREIRAUM",
        lead: "Was ist FREIRAUM?",
        body: "Die Kreativ-Welt für Identität, Emotion und visuelle Freiheit — Design, Kampagnen und Inhalte mit Charakter.",
        purpose: "Wenn Marken und Projekte Persönlichkeit, Tiefe und ein unverwechselbares Gefühl brauchen — mutig, expressiv, menschlich.",
        difference: "Im Unterschied zu NEXORA (Technik) und PROFESSIONAL (Struktur) lebt FREIRAUM von Kreativität, Farbe und emotionaler Erzählung.",
      },
      merge: {
        title: "Vier Welten. Ein System.",
        body: "Übersicht, Technologie, Struktur und Kreativität verbinden sich zu einem Portfolio, das zeigt, was möglich ist.",
      },
      "portfolio-contact": {
        title: "Bereit für den nächsten Schritt?",
        body: "Entdecke Projekte aus allen Welten oder starte direkt mit einer neuen Idee.",
      },
    },
    en: {
      "intro-all-worlds": {
        title: "Journey through the multiverse",
        body: "Scrolling starts a flight through a digital universe. Along the way, each world appears individually — with explanation, role and difference to the other worlds.",
      },
      "multiversum-focus": {
        label: "MULTIVERSE",
        lead: "What is the MULTIVERSE?",
        body: "The overview world and connecting portfolio universe. Here you see the big picture before the journey into the individual specialist worlds.",
        purpose: "As a meta level: strategy, personality and the right impact per project — analytical, clear or emotional.",
        difference: "Not a specialist world like NEXORA, PROFESSIONAL or FREIRAUM, but the overarching system that unites all three.",
      },
      "nexora-focus": {
        label: "NEXORA",
        lead: "What is NEXORA?",
        body: "The technology world for systems, performance and smart digital solutions — web, automation and technical clarity.",
        purpose: "When projects are technically demanding: scalable structures, precise delivery and measurable digital impact.",
        difference: "Unlike PROFESSIONAL (business clarity) and FREIRAUM (creativity), NEXORA focuses on technology, logic and systems thinking.",
      },
      "professional-focus": {
        label: "PROFESSIONAL",
        lead: "What is PROFESSIONAL?",
        body: "The business world for presence, trust and professional brand leadership — structured, serious and convincing.",
        purpose: "For companies and individuals who need clarity, credibility and a high-quality professional impression.",
        difference: "Less technical than NEXORA, less expressive than FREIRAUM — precision, order and business impact come first.",
      },
      "freiraum-focus": {
        label: "FREIRAUM",
        lead: "What is FREIRAUM?",
        body: "The creative world for identity, emotion and visual freedom — design, campaigns and content with character.",
        purpose: "When brands and projects need personality, depth and a distinctive feel — bold, expressive, human.",
        difference: "Unlike NEXORA (tech) and PROFESSIONAL (structure), FREIRAUM lives on creativity, colour and emotional storytelling.",
      },
      merge: {
        title: "Four worlds. One system.",
        body: "Overview, technology, structure and creativity combine into a portfolio that shows what is possible.",
      },
      "portfolio-contact": {
        title: "Ready for the next step?",
        body: "Explore projects from all worlds or start directly with a new idea.",
      },
    },
    it: {
      "intro-all-worlds": {
        title: "Viaggio attraverso il multiverso",
        body: "Lo scroll avvia il volo attraverso un universo digitale. Lungo il percorso, ogni mondo appare singolarmente — con spiegazione, ruolo e differenza rispetto agli altri.",
      },
      "multiversum-focus": {
        label: "MULTIVERSO",
        lead: "Cos'è il MULTIVERSO?",
        body: "Il mondo panoramico e portfolio connettente. Qui si vede il quadro generale prima del viaggio nei mondi specializzati.",
        purpose: "Come meta-livello: strategia, personalità e impatto giusto per progetto — analitico, chiaro o emotivo.",
        difference: "Non un mondo specializzato come NEXORA, PROFESSIONAL o FREIRAUM, ma il sistema sovraordinato che unisce tutti e tre.",
      },
      "nexora-focus": {
        label: "NEXORA",
        lead: "Cos'è NEXORA?",
        body: "Il mondo tecnologico per sistemi, performance e soluzioni digitali intelligenti — web, automazione e chiarezza tecnica.",
        purpose: "Quando i progetti sono tecnicamente esigenti: strutture scalabili, implementazione precisa e impatto digitale misurabile.",
        difference: "A differenza di PROFESSIONAL (chiarezza business) e FREIRAUM (creatività), NEXORA si concentra su tecnologia, logica e pensiero sistemico.",
      },
      "professional-focus": {
        label: "PROFESSIONAL",
        lead: "Cos'è PROFESSIONAL?",
        body: "Il mondo business per presenza, fiducia e leadership di marca professionale — strutturato, serio e convincente.",
        purpose: "Per aziende e persone che necessitano chiarezza, credibilità e un'impressione professionale di alto livello.",
        difference: "Meno tecnico di NEXORA, meno espressivo di FREIRAUM — qui contano precisione, ordine e impatto business.",
      },
      "freiraum-focus": {
        label: "FREIRAUM",
        lead: "Cos'è FREIRAUM?",
        body: "Il mondo creativo per identità, emozione e libertà visiva — design, campagne e contenuti con carattere.",
        purpose: "Quando brand e progetti necessitano personalità, profondità e una sensazione distintiva — audace, espressivo, umano.",
        difference: "A differenza di NEXORA (tech) e PROFESSIONAL (struttura), FREIRAUM vive di creatività, colore e narrazione emotiva.",
      },
      merge: {
        title: "Quattro mondi. Un sistema.",
        body: "Panoramica, tecnologia, struttura e creatività si uniscono in un portfolio che mostra cosa è possibile.",
      },
      "portfolio-contact": {
        title: "Pronti per il prossimo passo?",
        body: "Scopri progetti da tutti i mondi o inizia direttamente con una nuova idea.",
      },
    },
  };

  function getWorld(doc) {
    var w = (doc.body && doc.body.getAttribute("data-world")) || "nexora";
    if (w === "professional") w = "vertex";
    return w;
  }

  function setText(el, text) {
    if (el && text != null) el.textContent = text;
  }

  function applyNav(doc, lang) {
    var nav = NAV[lang] || NAV.de;
    doc.querySelectorAll(".experience-step[data-go], .dna-slide[data-go], .menu-links a[data-go]").forEach(function (el) {
      var key = el.getAttribute("data-go");
      if (nav[key]) el.textContent = nav[key];
    });
    doc.querySelectorAll(".experience-step[data-label]").forEach(function (el) {
      var key = el.getAttribute("data-go");
      if (nav[key]) el.setAttribute("data-label", nav[key]);
    });
    var menuBtn = doc.getElementById("openMenu");
    if (menuBtn) {
      var span = menuBtn.querySelector("span");
      if (span) span.textContent = nav.menu;
    }
    var menuTitle = doc.querySelector(".menu-title");
    if (menuTitle) setText(menuTitle, nav.menu);
    var closeBtn = doc.getElementById("closeMenu");
    if (closeBtn) setText(closeBtn, nav.menuClose);
  }

  function applySlide(doc, slideId, data) {
    if (!data) return;
    var slide = doc.getElementById(slideId);
    if (!slide) return;
    setText(slide.querySelector(".chapter-label"), data.label);
    setText(slide.querySelector(".section-title"), data.title);
    var intro = slide.querySelector(".prose.projects-intro") || slide.querySelector(".slide-inner > .prose") || slide.querySelector(".contact-layout .prose");
    if (data.intro && intro) intro.textContent = data.intro;
  }

  function applyHome(doc, world, lang) {
    var pack = SLIDES[world] && SLIDES[world][lang];
    if (!pack || !pack.home) return;
    var h = pack.home;
    setText(doc.getElementById("worldIntro"), h.intro);
    var copy = doc.querySelector("#slide-home .home-copy");
    if (!copy) return;
    setText(copy.querySelector("h1"), h.h1);
    setText(copy.querySelector(".lead"), h.lead);
    if (world === "general" && h.more) {
      copy.querySelectorAll(".more").forEach(function (p, i) {
        if (h.more[i]) p.textContent = h.more[i];
      });
    }
    var cta = copy.querySelectorAll(".cta-row .btn");
    if (cta[0] && h.cta1) cta[0].textContent = h.cta1;
    if (cta[1] && h.cta2) cta[1].textContent = h.cta2;
    var tag = doc.querySelector(".mv-world-hero__tag");
    if (tag && h.tag) tag.textContent = h.tag;
  }

  function applyAboutExtra(doc, world, lang) {
    if (world !== "general") return;
    var pack = SLIDES.general[lang] && SLIDES.general[lang].about;
    if (!pack) return;
    var extra = doc.querySelector('[data-welten-about-extra="general"], [data-welten-about-extra="nexora"]');
    if (!extra) return;
    extra.setAttribute("data-welten-about-extra", "general");
    setText(extra.querySelector(".chapter-label"), pack.extraLabel);
    setText(extra.querySelector("h3.section-title"), pack.extraTitle);
  }

  function applyParallax(doc, lang) {
    var hero = doc.getElementById("mvParallaxHero");
    if (!hero) return;
    var slidesPack = PARALLAX_SLIDES[lang] || PARALLAX_SLIDES.de;
    var uiPack = PARALLAX_UI[lang] || PARALLAX_UI.de;
    var cfg = window.MVSceneConfig;
    if (cfg && cfg.slides) {
      cfg.slides.forEach(function (slideCfg, i) {
        var slideEl = hero.querySelector('.mv-scroll-slide[data-slide="' + i + '"]');
        var t = slidesPack[slideCfg.id];
        if (!slideEl || !t) return;

        setText(slideEl.querySelector(".mv-scroll-slide__eyebrow"), t.label);
        var leadEl = slideEl.querySelector(".mv-scroll-slide__lead");
        if (leadEl) {
          var strong = leadEl.querySelector("strong");
          if (strong) setText(strong, t.lead);
          else setText(leadEl, t.lead);
        }
        setText(slideEl.querySelector(".mv-scroll-slide__what"), t.body);
        setText(slideEl.querySelector(".mv-scroll-slide__purpose"), t.purpose);
        setText(slideEl.querySelector(".mv-scroll-slide__diff"), t.difference);
        setText(slideEl.querySelector("h2"), t.title);
        setText(slideEl.querySelector(".mv-scroll-slide__body"), t.body);
      });
    }

    hero.querySelectorAll(".mv-scroll-slide__enter[data-world-enter]").forEach(function (btn) {
      setText(btn, uiPack.enterWorld);
    });
    hero.querySelectorAll("[data-world-more]").forEach(function (btn) {
      setText(btn, uiPack.viewAllAreas);
    });
    if (uiPack.portfolio) {
      var openSuffix = lang === "en" ? " open" : lang === "it" ? " apri" : " öffnen";
      var portfolioByGo = {
        projects: uiPack.portfolio[0],
        leistungen: uiPack.portfolio[1],
        about: uiPack.portfolio[2],
        contact: uiPack.portfolio[3],
      };
      hero.querySelectorAll(".mv-scroll-card[data-go]").forEach(function (card) {
        var c = portfolioByGo[card.getAttribute("data-go")];
        if (!c) return;
        setText(card.querySelector(".mv-scroll-card__label"), c.label);
        setText(card.querySelector(".mv-scroll-card__sub"), c.sub);
        if (c.label) card.setAttribute("aria-label", c.label + openSuffix);
      });
    }

    var nav = NAV[lang] || NAV.de;
    var cardOpenSuffix = lang === "en" ? " open" : lang === "it" ? " apri" : " öffnen";
    var homeOpenSuffix = lang === "en" ? " open home" : lang === "it" ? " apri home" : " Home öffnen";
    hero.querySelectorAll(".world-card[data-go]").forEach(function (card) {
      var go = card.getAttribute("data-go");
      if (!go || !nav[go]) return;
      var label = nav[go];
      setText(card.querySelector(".world-card__label"), label);
      var img = card.querySelector("img");
      if (img) img.setAttribute("alt", label);
      var zone = card.closest("[data-world-zone]") || card.closest("[data-world]");
      var worldKey = zone ? zone.getAttribute("data-world-zone") || zone.getAttribute("data-world") || "" : "";
      if (worldKey) {
        card.setAttribute("aria-label", worldKey.toUpperCase() + " " + label + cardOpenSuffix);
      }
    });
    hero.querySelectorAll(".world-core[data-go='home']").forEach(function (core) {
      var zone = core.closest("[data-world-zone]") || core.closest("[data-world]");
      var worldKey = zone ? zone.getAttribute("data-world-zone") || zone.getAttribute("data-world") || "" : "";
      if (worldKey) {
        core.setAttribute("aria-label", worldKey.toUpperCase() + homeOpenSuffix);
        core.setAttribute("title", worldKey.toUpperCase() + homeOpenSuffix);
      }
    });

    var cue = hero.querySelector(".mv-scroll-cue span");
    setText(cue, uiPack.scrollCue);
  }

  function apply(doc, lang) {
    if (!doc || !lang) return;
    var world = getWorld(doc);
    var slides = SLIDES[world] && SLIDES[world][lang];
    doc.documentElement.lang = lang === "en" ? "en" : lang === "it" ? "it" : "de-CH";
    applyNav(doc, lang);
    applyHome(doc, world, lang);
    if (slides) {
      applySlide(doc, "slide-about", slides.about);
      applySlide(doc, "slide-leistungen", slides.leistungen);
      applySlide(doc, "slide-projects", slides.projects);
      applySlide(doc, "slide-contact", slides.contact);
    }
    applyAboutExtra(doc, world, lang);
    applyParallax(doc, lang);
    doc.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var parts = key.split(".");
      var val = SLIDES[world] && SLIDES[world][lang];
      for (var i = 0; i < parts.length && val; i++) val = val[parts[i]];
      if (typeof val === "string") el.textContent = val;
    });
  }

  root.WeltenPreviewI18n = {
    apply: apply,
    applyParallax: applyParallax,
    NAV: NAV,
    SLIDES: SLIDES,
    PARALLAX_SLIDES: PARALLAX_SLIDES,
    PARALLAX_UI: PARALLAX_UI,
    getWorld: getWorld,
  };
})(typeof window !== "undefined" ? window : this);
