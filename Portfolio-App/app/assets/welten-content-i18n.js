/**
 * Erweiterte Inhalts-Übersetzungen DE / EN / FR / IT — Persona, About, Projekte, Kontakt, Leistungen
 */
(function () {
  "use strict";

  function lp(map, lang) {
    if (window.WeltenTranslations) {
      return window.WeltenTranslations.langPack(map, lang) || map.de;
    }
    return map[lang] || map.en || map.de;
  }

  var CTA = {
    de: { cta1: "Projekte ansehen", cta2: "Über mich" },
    en: { cta1: "View projects", cta2: "About me" },
    fr: { cta1: "Voir les projets", cta2: "À propos" },
    it: { cta1: "Vedi progetti", cta2: "Chi sono" },
  };

  var ACCORDION = {
    de: {
      websites: { label: "Websites", meta: "Live-Auftritte & Web-Konzepte" },
      leadformulare: { label: "Leadformulare", meta: "Geführte Anfragen & Conversion" },
      visitenkarten: { label: "Visitenkarten", meta: "Digitale Mini-Auftritte" },
    },
    en: {
      websites: { label: "Websites", meta: "Live presences & web concepts" },
      leadformulare: { label: "Lead forms", meta: "Guided enquiries & conversion" },
      visitenkarten: { label: "Business cards", meta: "Digital mini presences" },
    },
    fr: {
      websites: { label: "Websites", meta: "Présences en ligne et concepts web" },
      leadformulare: { label: "Formulaires lead", meta: "Demandes guidées et conversion" },
      visitenkarten: { label: "Cartes de visite", meta: "Mini-présences digitales" },
    },
    it: {
      websites: { label: "Siti web", meta: "Presenze live e concept web" },
      leadformulare: { label: "Moduli lead", meta: "Richieste guidate e conversione" },
      visitenkarten: { label: "Biglietti da visita", meta: "Mini presenze digitali" },
    },
  };

  var SERVICES_GRID = {
    de: [
      { title: "Branding", desc: "Markenauftritte mit klarer Positionierung und Wiedererkennung." },
      { title: "Webdesign", desc: "Websites mit Nutzerführung, Struktur und Conversion-Fokus." },
      { title: "Marketing", desc: "Digitale Kampagnen, Content und Sichtbarkeit." },
      { title: "Strategie", desc: "Vom Ziel zur Umsetzung · durchdacht und messbar." },
      { title: "Content", desc: "SEO-orientierte Inhalte, die gefunden und verstanden werden." },
      { title: "Optimierung", desc: "Performance, SEO und Conversion kontinuierlich verbessern." },
    ],
    en: [
      { title: "Branding", desc: "Brand presences with clear positioning and recognition." },
      { title: "Web design", desc: "Websites with user guidance, structure and conversion focus." },
      { title: "Marketing", desc: "Digital campaigns, content and visibility." },
      { title: "Strategy", desc: "From goal to delivery · thoughtful and measurable." },
      { title: "Content", desc: "SEO-oriented content that is found and understood." },
      { title: "Optimisation", desc: "Continuously improving performance, SEO and conversion." },
    ],
    fr: [
      { title: "Branding", desc: "Présences de marque avec positionnement clair et reconnaissance." },
      { title: "Web design", desc: "Sites web avec guidage utilisateur, structure et focus conversion." },
      { title: "Marketing", desc: "Campagnes digitales, contenu et visibilité." },
      { title: "Stratégie", desc: "De l'objectif à la mise en œuvre · réfléchi et mesurable." },
      { title: "Content", desc: "Contenus orientés SEO, trouvés et compris." },
      { title: "Optimisation", desc: "Amélioration continue des performances, SEO et conversion." },
    ],
    it: [
      { title: "Branding", desc: "Presenze di marca con posizionamento chiaro e riconoscibilità." },
      { title: "Web design", desc: "Siti web con guida utente, struttura e focus sulla conversione." },
      { title: "Marketing", desc: "Campagne digitali, contenuti e visibilità." },
      { title: "Strategia", desc: "Dall'obiettivo all'implementazione · ponderato e misurabile." },
      { title: "Content", desc: "Contenuti orientati alla SEO, trovati e compresi." },
      { title: "Ottimizzazione", desc: "Miglioramento continuo di performance, SEO e conversione." },
    ],
  };

  var LEISTUNGEN_LANES = {
    de: {
      col1: { title: "Fokus", items: ["Machermentalität & Zielklarheit", "Digitales Systemdenken", "Conversion-Orientierung"] },
      col2: { title: "Ausdruck", items: ["Content & Sprache", "Kreativität mit Marke im Blick", "Kommunikation im Team"] },
    },
    en: {
      col1: { title: "Focus", items: ["Maker mindset & goal clarity", "Digital systems thinking", "Conversion orientation"] },
      col2: { title: "Expression", items: ["Content & language", "Creativity with brand in mind", "Team communication"] },
    },
    fr: {
      col1: { title: "Focus", items: ["Mentalité d'action et clarté des objectifs", "Pensée systémique digitale", "Orientation conversion"] },
      col2: { title: "Expression", items: ["Contenu et langage", "Créativité au service de la marque", "Communication d'équipe"] },
    },
    it: {
      col1: { title: "Focus", items: ["Mentalità operativa e chiarezza degli obiettivi", "Pensiero sistemico digitale", "Orientamento alla conversione"] },
      col2: { title: "Espressione", items: ["Contenuti e linguaggio", "Creatività con il brand in mente", "Comunicazione nel team"] },
    },
  };

  var ABOUT_MAIN = {
    de: [
      "Seit 2024 arbeite ich als Key-Account- und Marketing-Spezialist und begleite Kundenprojekte ganzheitlich – von der ersten Analyse über die strategische Ausrichtung bis zur operativen Umsetzung. Ich denke Projekte konsequent aus Sicht von Marke, Zielgruppe und messbarer Wirkung.",
      "Mein Hintergrund im Visual Merchandising hat mein Gespür für Inszenierung, visuelle Klarheit, Raumwirkung und Nutzerführung stark geprägt. Heute verbinde ich diese Erfahrung mit digitalem Marketing, Website-Konzeption, Suchmaschinenoptimierung, Content-Struktur und beratender Projektführung.",
      "Was mich auszeichnet, ist die Kombination aus positiver Energie, Verbindlichkeit und Struktur. Ich kann komplexe Themen verständlich machen, Menschen abholen, Ideen in klare nächste Schritte übersetzen und Ergebnisse liefern, auf die sich Teams, Kundinnen und Kunden verlassen können.",
    ],
    en: [
      "Since 2024 I have worked as a key account and marketing specialist, supporting client projects end to end – from initial analysis and strategic direction through to hands-on delivery. I consistently think in terms of brand, audience and measurable impact.",
      "My background in visual merchandising has strongly shaped my sense of staging, visual clarity, spatial impact and user guidance. Today I combine that experience with digital marketing, website conception, SEO, content structure and consultative project leadership.",
      "What sets me apart is the combination of positive energy, reliability and structure. I make complex topics understandable, bring people on board, translate ideas into clear next steps and deliver results teams and clients can depend on.",
    ],
    it: [
      "Dal 2024 lavoro come specialista key account e marketing e accompagno progetti in modo olistico – dall'analisi iniziale alla direzione strategica fino all'implementazione operativa. Penso ai progetti in termini di marca, pubblico e impatto misurabile.",
      "Il mio background nel visual merchandising ha formato il mio senso di allestimento, chiarezza visiva, impatto spaziale e guida utente. Oggi unisco questa esperienza a marketing digitale, concezione siti web, SEO, struttura dei contenuti e gestione consulenziale dei progetti.",
      "Ciò che mi distingue è la combinazione di energia positiva, affidabilità e struttura. Rendo comprensibili temi complessi, coinvolgo le persone, traduco le idee in passi chiari e consegno risultati su cui team e clienti possono contare.",
    ],
  };

  var PERSONA = {
    de: {
      tabs: { p: "Persönlichkeit", w: "Werte", k: "Kompetenzen & Arbeitsweise" },
      blocks: {
        p: {
          title: "Persönlichkeit",
          html:
            "<ul><li>Positive, offene und motivierende Art mit echtem Interesse am Menschen hinter jedem Projekt.</li>" +
            "<li>Starke soziale Kompetenz: Ich höre zu, verbinde Perspektiven und schaffe Vertrauen.</li>" +
            "<li>Natürliche Präsenz kombiniert mit Nahbarkeit, Humor und professioneller Klarheit.</li>" +
            "<li>Ich bringe Energie in Teams, ohne den Fokus zu verlieren – konstruktiv und lösungsorientiert.</li>" +
            "<li>Komplexe Situationen erfasse ich schnell und übersetze sie in klare nächste Schritte.</li>" +
            "<li>Meine Stärke liegt darin, Menschen zu motivieren und gemeinsam Momentum aufzubauen.</li></ul>",
        },
        w: {
          title: "Werte",
          html:
            "<ul><li>Verlässlichkeit: Was ich zusage, nehme ich ernst – in Kommunikation, Timing und Qualität.</li>" +
            "<li>Loyalität: Ich identifiziere mich mit gemeinsamen Zielen und vertrete Marken mit Überzeugung.</li>" +
            "<li>Qualitätsbewusstsein: Für mich zählt nicht nur, dass etwas fertig wird, sondern wie professionell es wirkt.</li>" +
            "<li>Respekt und Klarheit: Gute Zusammenarbeit braucht ehrliche Kommunikation und gegenseitiges Vertrauen.</li>" +
            "<li>Weiterentwicklung: Ich suche Herausforderungen, lerne schnell und nutze Feedback.</li>" +
            "<li>Herzblut: Ich möchte Arbeit leisten, die sichtbar ist, Sinn macht und Menschen überzeugt.</li></ul>",
        },
        k: {
          title: "Kompetenzen & Arbeitsweise",
          html:
            "<ul><li>Ganzheitliche Projektführung von der Analyse über Strategie bis zur Umsetzung.</li>" +
            "<li>Website-Konzeption mit Fokus auf Nutzerführung, Content-Logik und Conversion.</li>" +
            "<li>SEO und digitale Sichtbarkeit mit Blick auf Struktur, Inhalte und Zielgruppenrelevanz.</li>" +
            "<li>Marken- und Designverständnis aus über 15 Jahren Erfahrung in visueller Inszenierung.</li>" +
            "<li>Key-Account-Perspektive: Beziehungen pflegen, Anforderungen verstehen, Ergebnisse sichern.</li>" +
            "<li>Strukturierte Arbeitsweise mit klaren Prozessen und hoher Umsetzungsdisziplin.</li>" +
            "<li>Schnelle Auffassungsgabe und der Anspruch, Ideen professionell zu Ende zu bringen.</li></ul>",
        },
      },
    },
    en: {
      tabs: { p: "Personality", w: "Values", k: "Skills & approach" },
      blocks: {
        p: {
          title: "Personality",
          html:
            "<ul><li>Positive, open and motivating style with genuine interest in the people behind each project.</li>" +
            "<li>Strong social skills: I listen, connect perspectives and build trust in collaboration.</li>" +
            "<li>Natural presence combined with approachability, humour and professional clarity.</li>" +
            "<li>I bring energy to teams without losing focus – constructive and solution-oriented.</li>" +
            "<li>I grasp complex situations quickly and translate them into clear next steps.</li>" +
            "<li>My strength is motivating people and building momentum together.</li></ul>",
        },
        w: {
          title: "Values",
          html:
            "<ul><li>Reliability: I take commitments seriously – in communication, timing and quality.</li>" +
            "<li>Loyalty: I identify with shared goals and represent brands with conviction.</li>" +
            "<li>Quality awareness: What matters is not only completion but how professional the result looks.</li>" +
            "<li>Respect and clarity: Good collaboration needs honest communication and mutual trust.</li>" +
            "<li>Growth: I seek challenges, learn quickly and use feedback to improve.</li>" +
            "<li>Passion: I want work that is visible, meaningful and convincing.</li></ul>",
        },
        k: {
          title: "Skills & approach",
          html:
            "<ul><li>End-to-end project leadership from analysis and strategy through to delivery.</li>" +
            "<li>Website conception focused on user guidance, content logic and conversion.</li>" +
            "<li>SEO and digital visibility with attention to structure, content and audience relevance.</li>" +
            "<li>Brand and design understanding from 15+ years in visual staging.</li>" +
            "<li>Key account perspective: nurture relationships, understand requirements, secure results.</li>" +
            "<li>Structured way of working with clear processes and strong delivery discipline.</li>" +
            "<li>Quick comprehension and the drive to finish ideas professionally.</li></ul>",
        },
      },
    },
    it: {
      tabs: { p: "Personalità", w: "Valori", k: "Competenze e metodo" },
      blocks: {
        p: {
          title: "Personalità",
          html:
            "<ul><li>Stile positivo, aperto e motivante con genuino interesse per le persone dietro ogni progetto.</li>" +
            "<li>Forte competenza sociale: ascolto, collego prospettive e creo fiducia.</li>" +
            "<li>Presenza naturale con vicinanza, umorismo e chiarezza professionale.</li>" +
            "<li>Porto energia nei team senza perdere il focus – costruttivo e orientato alle soluzioni.</li>" +
            "<li>Colgo rapidamente situazioni complesse e le traduco in passi chiari.</li>" +
            "<li>La mia forza è motivare le persone e costruire slancio insieme.</li></ul>",
        },
        w: {
          title: "Valori",
          html:
            "<ul><li>Affidabilità: prendo sul serio ciò che prometto – comunicazione, tempi e qualità.</li>" +
            "<li>Lealtà: mi identifico con obiettivi comuni e rappresento i brand con convinzione.</li>" +
            "<li>Qualità: conta non solo finire, ma quanto professionale appare il risultato.</li>" +
            "<li>Rispetto e chiarezza: la collaborazione richiede comunicazione onesta e fiducia.</li>" +
            "<li>Crescita: cerco sfide, imparo velocemente e uso il feedback.</li>" +
            "<li>Passione: voglio lavoro visibile, significativo e convincente.</li></ul>",
        },
        k: {
          title: "Competenze e metodo",
          html:
            "<ul><li>Gestione progetti end-to-end dall'analisi alla strategia fino all'implementazione.</li>" +
            "<li>Concezione siti web con focus su guida utente, logica dei contenuti e conversione.</li>" +
            "<li>SEO e visibilità digitale con attenzione a struttura, contenuti e pubblico.</li>" +
            "<li>Comprensione di marca e design da oltre 15 anni di allestimento visivo.</li>" +
            "<li>Prospettiva key account: relazioni, requisiti, risultati.</li>" +
            "<li>Metodo strutturato con processi chiari e disciplina di consegna.</li>" +
            "<li>Capacità di apprendimento rapido e volontà di portare le idee a termine.</li></ul>",
        },
      },
    },
  };

  var CONTACT_UI = {
    de: {
      prose1: "Ich freue mich auf Möglichkeiten, bei denen ich meine Erfahrung in Markeninszenierung, Kundenkommunikation und digitalem Marketing gezielt einbringen kann.",
      prose2: "Lassen Sie uns ins Gespräch kommen.",
      prose3: "Ob Website, Markenauftritt, digitale Sichtbarkeit oder ein konkretes Kundenprojekt: Ich freue mich über den Austausch und reagiere schnell, verbindlich und unkompliziert.",
      email: "E-Mail",
      phone: "Telefon",
      address: "Adresse",
      formTitle: "Leadformular",
    },
    en: {
      prose1: "I welcome opportunities where I can apply my experience in brand staging, client communication and digital marketing.",
      prose2: "Let's talk.",
      prose3: "Whether website, brand presence, digital visibility or a specific client project: I appreciate the exchange and respond quickly, reliably and without fuss.",
      email: "Email",
      phone: "Phone",
      address: "Address",
      formTitle: "Lead form",
    },
    fr: {
      prose1: "J'accueille les opportunités où je peux mettre à profit mon expérience en mise en scène de marque, communication client et marketing digital.",
      prose2: "Prenons contact.",
      prose3: "Site web, présence de marque, visibilité digitale ou projet client concret : j'apprécie l'échange et je réponds rapidement, de manière fiable et simple.",
      email: "E-mail",
      phone: "Téléphone",
      address: "Adresse",
      formTitle: "Formulaire lead",
    },
    it: {
      prose1: "Accolgo opportunità in cui posso applicare la mia esperienza in brand staging, comunicazione con i clienti e marketing digitale.",
      prose2: "Parliamone.",
      prose3: "Sito web, presenza di marca, visibilità digitale o progetto specifico: apprezzo lo scambio e rispondo rapidamente, in modo affidabile e semplice.",
      email: "E-mail",
      phone: "Telefono",
      address: "Indirizzo",
      formTitle: "Modulo lead",
    },
  };

  var ABOUT_EXTRA = {
    nexora: {
      de: { label: "NEXORA", title: "Digitales Denken als Stärke", prose: ["Für mich ist eine Website mehr als eine digitale Visitenkarte. Sie ist ein System aus Inhalt, Struktur, Gestaltung, Technik und Nutzererlebnis.", "Ich interessiere mich besonders dafür, wie digitale Touchpoints aufgebaut sein müssen, damit sie verständlich, überzeugend und wirkungsvoll sind."], cards: [{ t: "Strategie & Struktur", p: "Ich denke digitale Projekte vom Ziel her." }, { t: "Technologie & Tools", p: "Ich bin offen für moderne Tools, KI und Automatisierung." }, { t: "Sichtbarkeit & Wirkung", p: "Gutes Digital Marketing soll gefunden werden und Vertrauen aufbauen." }] },
      en: { label: "NEXORA", title: "Digital thinking as a strength", prose: ["For me a website is more than a digital business card. It is a system of content, structure, design, technology and user experience.", "I am especially interested in how digital touchpoints must be built to be clear, convincing and effective."], cards: [{ t: "Strategy & structure", p: "I think digital projects from the goal outward." }, { t: "Technology & tools", p: "I am open to modern tools, AI and automation." }, { t: "Visibility & impact", p: "Good digital marketing should be found and build trust." }] },
      it: { label: "NEXORA", title: "Il pensiero digitale come forza", prose: ["Per me un sito web è più di un biglietto da visita digitale. È un sistema di contenuti, struttura, design, tecnologia ed esperienza utente.", "Mi interessa soprattutto come devono essere costruiti i touchpoint digitali per essere chiari, convincenti ed efficaci."], cards: [{ t: "Strategia e struttura", p: "Penso ai progetti digitali partendo dall'obiettivo." }, { t: "Tecnologia e strumenti", p: "Sono aperto a strumenti moderni, IA e automazione." }, { t: "Visibilità e impatto", p: "Il buon marketing digitale deve farsi trovare e creare fiducia." }] },
    },
    professional: {
      de: { label: "PROFESSIONAL", title: "Professionelles Arbeiten mit klarem Anspruch", prose: ["Professionelles Arbeiten bedeutet für mich, Verantwortung zu übernehmen, sauber zu kommunizieren und Aufgaben mit hohem Qualitätsanspruch umzusetzen.", "Besonders wichtig ist mir, dass Projekte strukturiert geführt werden – mit Prioritäten, Timing und klarem Ziel."], cards: [{ t: "Verantwortung", p: "Ich stehe hinter meinen Aufgaben und übernehme Verantwortung für Qualität und Ergebnis." }, { t: "Kommunikation", p: "Offene und klare Kommunikation schafft Vertrauen und effiziente Zusammenarbeit." }, { t: "Qualität", p: "Qualität bedeutet, dass ein Ergebnis nicht nur fertig ist, sondern überzeugt." }] },
      en: { label: "PROFESSIONAL", title: "Professional work with clear standards", prose: ["Professional work means taking responsibility, communicating clearly and delivering with high quality standards.", "It matters to me that projects are led in a structured way – with priorities, timing and a clear goal."], cards: [{ t: "Responsibility", p: "I stand behind my tasks and take responsibility for quality and outcomes." }, { t: "Communication", p: "Open, clear communication builds trust and efficient collaboration." }, { t: "Quality", p: "Quality means a result is not only finished but truly convincing." }] },
      it: { label: "PROFESSIONAL", title: "Lavoro professionale con standard chiari", prose: ["Lavorare in modo professionale significa assumersi responsabilità, comunicare chiaramente e consegnare con alto standard qualitativo.", "Per me è importante che i progetti siano guidati in modo strutturato – con priorità, tempi e obiettivo chiaro."], cards: [{ t: "Responsabilità", p: "Mi assumo la responsabilità di qualità e risultati." }, { t: "Comunicazione", p: "Comunicazione aperta e chiara crea fiducia ed efficienza." }, { t: "Qualità", p: "Qualità significa un risultato non solo finito ma convincente." }] },
    },
    freiraum: {
      de: { label: "FREIRAUM", title: "Kreativität mit Richtung", prose: ["Kreativität bedeutet für mich, eine Idee so zu formen, dass sie verstanden wird, berührt und zur Marke passt.", "Marken wirken stark, wenn sie authentisch sind – wenn Sprache, Design und Erlebnis zusammenpassen."], cards: [{ t: "Ideen & Perspektiven", p: "Ich denke neu und suche Lösungen mit mehr Ausdruck und Eigenständigkeit." }, { t: "Storytelling", p: "Gute Inhalte erzählen eine Geschichte und schaffen Nähe zur Marke." }, { t: "Gestaltung & Atmosphäre", p: "Starkes Gespür dafür, wie Gestaltung wirkt und Identität sichtbar macht." }] },
      en: { label: "FREIRAUM", title: "Creativity with direction", prose: ["Creativity means shaping an idea so it is understood, felt and fits the brand.", "Brands are strong when they are authentic – when language, design and experience align."], cards: [{ t: "Ideas & perspectives", p: "I think anew and seek solutions with more expression and individuality." }, { t: "Storytelling", p: "Good content tells a story and creates closeness to the brand." }, { t: "Design & atmosphere", p: "A strong sense of how design works and makes identity visible." }] },
      it: { label: "FREIRAUM", title: "Creatività con direzione", prose: ["Creatività significa modellare un'idea affinché sia compresa, sentita e coerente con il brand.", "I brand sono forti quando sono autentici – quando linguaggio, design ed esperienza coincidono."], cards: [{ t: "Idee e prospettive", p: "Penso in modo nuovo e cerco soluzioni con più espressione." }, { t: "Storytelling", p: "I buoni contenuti raccontano una storia e avvicinano al brand." }, { t: "Design e atmosfera", p: "Fort senso di come il design funziona e rende visibile l'identità." }] },
    },
    general: {
      de: { label: "MULTIVERSUM", title: "Alle Welten · ein Ziel", prose: ["MULTIVERSUM vereint die Stärken aller Welten: NEXORA, PROFESSIONAL und FREIRAUM – abgestimmt auf Ihr Projekt.", "So entsteht ein Auftritt, der strategisch fundiert, menschlich verständlich und mit echter Umsetzungskraft überzeugt."], cards: [{ t: "Strategie & Struktur", p: "Digitale Projekte vom Ziel her denken." }, { t: "Technologie & Tools", p: "Offen für moderne Tools, KI und Automatisierung." }, { t: "Sichtbarkeit & Wirkung", p: "SEO, Content und Conversion immer mitdenken." }] },
      en: { label: "MULTIVERSE", title: "All worlds · one goal", prose: ["The MULTIVERSE unites the strengths of all worlds: NEXORA, PROFESSIONAL and FREIRAUM – tailored to your project.", "The result is a presence that is strategically sound, humanly clear and backed by real delivery strength."], cards: [{ t: "Strategy & structure", p: "Thinking digital projects from the goal outward." }, { t: "Technology & tools", p: "Open to modern tools, AI and automation." }, { t: "Visibility & impact", p: "Always considering SEO, content and conversion." }] },
      it: { label: "MULTIVERSO", title: "Tutti i mondi · un obiettivo", prose: ["Il MULTIVERSO unisce i punti di forza di tutti i mondi: NEXORA, PROFESSIONAL e FREIRAUM – su misura per il progetto.", "Nasce una presenza strategicamente solida, umana e con vera capacità di implementazione."], cards: [{ t: "Strategia e struttura", p: "Progetti digitali partendo dall'obiettivo." }, { t: "Tecnologia e strumenti", p: "Aperti a strumenti moderni, IA e automazione." }, { t: "Visibilità e impatto", p: "SEO, contenuti e conversione sempre considerati." }] },
    },
  };

  function worldExtraKey(doc) {
    var w = (doc.body && doc.body.getAttribute("data-world")) || "nexora";
    if (w === "vertex") return "professional";
    if (w === "general") return "general";
    return w;
  }

  function setText(el, text) {
    if (el && text != null) el.textContent = text;
  }

  function applyHomeCtas(doc, lang) {
    var pack = lp(CTA, lang);
    doc.querySelectorAll("#slide-home .cta-row .btn").forEach(function (btn, i) {
      if (i === 0 && pack.cta1) btn.textContent = pack.cta1;
      if (i === 1 && pack.cta2) btn.textContent = pack.cta2;
    });
  }

  function applyProjectsAccordion(doc, lang) {
    var pack = lp(ACCORDION, lang);
    Object.keys(pack).forEach(function (cat) {
      var item = doc.querySelector('.projects-accordion__item[data-category="' + cat + '"]');
      if (!item) return;
      var c = pack[cat];
      setText(item.querySelector(".projects-accordion__label"), c.label);
      setText(item.querySelector(".projects-accordion__meta"), c.meta);
    });
  }

  function applyServicesGrid(doc, lang) {
    var items = lp(SERVICES_GRID, lang);
    doc.querySelectorAll(".welten-leistungen-grid .welten-leistung-card").forEach(function (card, i) {
      if (!items[i]) return;
      setText(card.querySelector("h3"), items[i].title);
      setText(card.querySelector("p"), items[i].desc);
    });
  }

  function applyLeistungenLanes(doc, lang) {
    var pack = lp(LEISTUNGEN_LANES, lang);
    var cols = doc.querySelectorAll("#slide-leistungen .welten-strengths-lanes .sl-col");
    if (cols[0]) {
      setText(cols[0].querySelector("h3"), pack.col1.title);
      cols[0].querySelectorAll(".sl-list li").forEach(function (li, i) {
        if (pack.col1.items[i]) li.textContent = pack.col1.items[i];
      });
    }
    if (cols[1]) {
      setText(cols[1].querySelector("h3"), pack.col2.title);
      cols[1].querySelectorAll(".sl-list li").forEach(function (li, i) {
        if (pack.col2.items[i]) li.textContent = pack.col2.items[i];
      });
    }
  }

  function applyAboutMain(doc, lang) {
    var paras = lp(ABOUT_MAIN, lang);
    var aboutInner = doc.querySelector("#slide-about .slide-inner > div");
    if (!aboutInner) return;
    aboutInner.querySelectorAll(":scope > p.prose").forEach(function (p, i) {
      if (paras[i]) p.textContent = paras[i];
    });
  }

  function applyAboutExtra(doc, lang) {
    var key = worldExtraKey(doc);
    var pack = ABOUT_EXTRA[key] ? lp(ABOUT_EXTRA[key], lang) : null;
    if (!pack) return;
    var extra = doc.querySelector("[data-welten-about-extra]");
    if (!extra) return;
    setText(extra.querySelector(".chapter-label"), pack.label);
    var h3 = extra.querySelector("h3.section-title");
    if (h3) setText(h3, pack.title);
    extra.querySelectorAll("p.prose").forEach(function (p, i) {
      if (pack.prose[i]) p.textContent = pack.prose[i];
    });
    extra.querySelectorAll(".value-card").forEach(function (card, i) {
      if (!pack.cards[i]) return;
      setText(card.querySelector("h3"), pack.cards[i].t);
      setText(card.querySelector("p"), pack.cards[i].p);
    });
  }

  function getActivePersonaKey(doc) {
    var on = doc.querySelector(".persona-tabs button.on[data-persona], .persona-tabs button[aria-selected='true'][data-persona]");
    return (on && on.getAttribute("data-persona")) || doc.__weltenPersonaActive || "p";
  }

  function applyPersona(doc, lang) {
    var pack = lp(PERSONA, lang);
    doc.querySelectorAll(".persona-tabs button[data-persona]").forEach(function (btn) {
      var k = btn.getAttribute("data-persona");
      if (pack.tabs[k]) btn.textContent = pack.tabs[k];
    });
    var key = getActivePersonaKey(doc);
    doc.__weltenPersonaActive = key;
    var block = pack.blocks[key];
    var personaTitle = doc.getElementById("personaTitle");
    var personaBody = doc.getElementById("personaBody");
    if (block && personaTitle) personaTitle.textContent = block.title;
    if (block && personaBody) personaBody.innerHTML = block.html;

    if (!doc.__weltenPersonaCapture) {
      doc.__weltenPersonaCapture = true;
      doc.addEventListener(
        "click",
        function (e) {
          var btn = e.target.closest(".persona-tabs button[data-persona]");
          if (!btn) return;
          e.stopImmediatePropagation();
          doc.__weltenPersonaActive = btn.getAttribute("data-persona");
          doc.querySelectorAll(".persona-tabs button").forEach(function (b) {
            b.classList.toggle("on", b === btn);
            b.setAttribute("aria-selected", b === btn ? "true" : "false");
          });
          try {
            var lg =
              localStorage.getItem("mv-preview-lang") ||
              sessionStorage.getItem("mv-preview-lang") ||
              "de";
            applyPersona(doc, lg);
          } catch (err) {
            applyPersona(doc, "de");
          }
        },
        true
      );
    }
  }

  function applyContactCopy(doc, lang) {
    var slides = window.WeltenPreviewI18n && window.WeltenPreviewI18n.SLIDES;
    var world = window.WeltenPreviewI18n ? window.WeltenPreviewI18n.getWorld(doc) : "nexora";
    var worldSlides = slides && slides[world];
    var worldPack = worldSlides
      ? window.WeltenTranslations
        ? window.WeltenTranslations.langPack(worldSlides, lang)
        : worldSlides[lang] || worldSlides.en || worldSlides.de
      : null;
    var slidePack = worldPack && worldPack.contact;
    var ui = lp(CONTACT_UI, lang);
    var copy = doc.querySelector("#slide-contact .contact-copy");
    if (!copy) return;
    if (slidePack) {
      setText(copy.querySelector(".chapter-label"), slidePack.label);
      setText(copy.querySelector(".section-title"), slidePack.title);
    }
    var prose = copy.querySelectorAll("p.prose");
    if (prose[0]) prose[0].textContent = ui.prose1;
    if (prose[1]) prose[1].textContent = ui.prose2;
    if (prose[2]) prose[2].textContent = ui.prose3;
    copy.querySelectorAll(".contact-actions a").forEach(function (a) {
      var span = a.querySelector("span");
      if (!span) return;
      var t = span.textContent || "";
      if (t.indexOf("@") >= 0) span.textContent = ui.email + ": alex.lamberti@hotmail.ch";
      else if (
        t.indexOf("079") >= 0 ||
        t.toLowerCase().indexOf("telefon") >= 0 ||
        t.toLowerCase().indexOf("phone") >= 0 ||
        t.toLowerCase().indexOf("téléphone") >= 0 ||
        t.toLowerCase().indexOf("telefono") >= 0
      )
        span.textContent = ui.phone + ": 079 667 82 11";
      else if (
        t.indexOf("Schulweg") >= 0 ||
        t.toLowerCase().indexOf("address") >= 0 ||
        t.toLowerCase().indexOf("indirizzo") >= 0 ||
        t.toLowerCase().indexOf("adresse") >= 0
      )
        span.textContent = ui.address + ": Schulweg 603, 5324 Full-Reuenthal, Schweiz";
    });
    var form = doc.getElementById("weltenLeadForm");
    if (form && ui.formTitle) form.setAttribute("title", ui.formTitle);
  }

  var ABOUT_SOURCES = {
    de: {
      experience: {
        label: "Erfahrung",
        title: "Vom Markenraum zur digitalen Strategie.",
        intro: "Ein Werdegang aus Handel, Inszenierung und digitaler Umsetzung – geprägt von fundierter Ausbildung, praktischer Erfahrung und gezielter Weiterentwicklung.",
        workTitle: "Berufserfahrung",
        eduTitle: "Bildungsweg",
        schoolTitle: "Schulbildung",
        focus: "Schwerpunkte:",
        jobs: [
          { role: "Key-Account- und Marketing-Spezialist.", focus: "Kundenprojekte, Websites, Suchmaschinenoptimierung,\nMarkenarbeit, Inhalte, Kommunikation,\nBeratung und Projektsteuerung." },
          { role: "Polydesigner 3D / Koordination Warenpräsentation." },
          { role: "Koordination Warenpräsentation im Einzelhandel." },
          { role: "Polydesigner 3D / Koordination Warenpräsentation." },
          { role: "Mitarbeiter Detailhandel." },
        ],
        edu: [
          { role: "MBSZ Zürich." },
          { role: "HSO Zürich." },
          { role: "EBZ." },
          { role: "Interne Ausbildung H&M, Luzern." },
          { role: "Kaufmännisches Bildungszentrum Zug." },
        ],
        school: [{ role: "Oberstufenzeit in Oberarth." }, { role: "Primarschule in Goldau." }],
      },
      workstyle: {
        label: "Arbeitsweise",
        title: "So arbeite ich",
        intro: "Ich arbeite gerne strukturiert, aber nicht starr. Für mich beginnt jedes gute Projekt mit Verständnis: Was ist das Ziel? Wer soll erreicht werden? Welche Botschaft soll ankommen? Erst wenn diese Grundlage klar ist, entstehen Ideen, die wirklich passen.",
        steps: [
          { t: "Verstehen", p: "Ziele, Zielgruppe, Marke und Ausgangslage sauber erfassen." },
          { t: "Strukturieren", p: "Informationen ordnen, damit Inhalte überzeugend wirken." },
          { t: "Gestalten", p: "Design, Tonality und UX zur Marke passend verbinden." },
          { t: "Optimieren", p: "Feedback und Messung in Verbesserungen übersetzen." },
        ],
      },
      values: {
        label: "Werte",
        title: "Persönliche Werte",
        intro: "Meine Werte prägen, wie ich arbeite, kommuniziere und Verantwortung übernehme. Sie sind für mich nicht nur schöne Begriffe, sondern konkrete Orientierung im Alltag. Besonders im Digital Marketing ist es wichtig, klar, glaubwürdig und bewusst zu handeln.",
        rows: [
          { t: "Verlässlichkeit", p: "Zusagen einhalten, Verantwortung übernehmen, Aufgaben zu Ende bringen." },
          { t: "Qualitätsanspruch", p: "Durchdachte, saubere und langfristig tragfähige Ergebnisse." },
          { t: "Eigeninitiative", p: "Aktiv mitdenken, Lösungen einbringen, Verantwortung packen." },
          { t: "Lernbereitschaft", p: "Offen für neue Tools, Methoden und Technologien." },
          { t: "Teamgeist", p: "Vertrauen, Offenheit und gegenseitige Unterstützung." },
          { t: "Wirkung", p: "Marketing soll Orientierung geben und zum Handeln führen." },
        ],
      },
    },
    en: {
      experience: {
        label: "Experience",
        title: "From brand space to digital strategy.",
        intro: "A career path spanning retail, staging and digital delivery – shaped by solid training, hands-on experience and focused development.",
        workTitle: "Work experience",
        eduTitle: "Education",
        schoolTitle: "School",
        focus: "Focus areas:",
        jobs: [
          { role: "Key account and marketing specialist.", focus: "Client projects, websites, SEO,\nbrand work, content, communication,\nconsulting and project management." },
          { role: "3D polydesigner / visual merchandising coordination." },
          { role: "Visual merchandising coordination in retail." },
          { role: "3D polydesigner / visual merchandising coordination." },
          { role: "Retail employee." },
        ],
        edu: [
          { role: "MBSZ Zurich." },
          { role: "HSO Zurich." },
          { role: "EBZ." },
          { role: "In-house training H&M, Lucerne." },
          { role: "Commercial training centre Zug." },
        ],
        school: [{ role: "Upper school years in Oberarth." }, { role: "Primary school in Goldau." }],
      },
      workstyle: {
        label: "Approach",
        title: "How I work",
        intro: "I like to work in a structured but flexible way. Every good project starts with understanding: What is the goal? Who should we reach? What message should land? Only then do ideas emerge that truly fit.",
        steps: [
          { t: "Understand", p: "Capture goals, audience, brand and starting point clearly." },
          { t: "Structure", p: "Organise information so content works convincingly." },
          { t: "Design", p: "Connect design, tone and UX to match the brand." },
          { t: "Optimise", p: "Turn feedback and measurement into improvements." },
        ],
      },
      values: {
        label: "Values",
        title: "Personal values",
        intro: "My values shape how I work, communicate and take responsibility. They are practical guidance in everyday work – especially in digital marketing, where clarity, credibility and conscious action matter.",
        rows: [
          { t: "Reliability", p: "Keep commitments, take responsibility, finish tasks." },
          { t: "Quality standards", p: "Thoughtful, clean and sustainable results." },
          { t: "Initiative", p: "Think ahead, contribute solutions, take ownership." },
          { t: "Willingness to learn", p: "Open to new tools, methods and technologies." },
          { t: "Team spirit", p: "Trust, openness and mutual support." },
          { t: "Impact", p: "Marketing should guide and lead to action." },
        ],
      },
    },
    it: {
      experience: {
        label: "Esperienza",
        title: "Dallo spazio brand alla strategia digitale.",
        intro: "Un percorso tra commercio, allestimento e implementazione digitale – formato da solida formazione, esperienza pratica e sviluppo mirato.",
        workTitle: "Esperienza professionale",
        eduTitle: "Formazione",
        schoolTitle: "Scuola",
        focus: "Aree di focus:",
        jobs: [
          { role: "Specialista key account e marketing.", focus: "Progetti clienti, siti web, SEO,\nlavoro sul brand, contenuti, comunicazione,\nconsulenza e gestione progetti." },
          { role: "Polydesigner 3D / coordinamento visual merchandising." },
          { role: "Coordinamento visual merchandising nel retail." },
          { role: "Polydesigner 3D / coordinamento visual merchandising." },
          { role: "Dipendente commercio al dettaglio." },
        ],
        edu: [
          { role: "MBSZ Zurigo." },
          { role: "HSO Zurigo." },
          { role: "EBZ." },
          { role: "Formazione interna H&M, Lucerna." },
          { role: "Centro formazione commerciale Zugo." },
        ],
        school: [{ role: "Scuola superiore a Oberarth." }, { role: "Scuola primaria a Goldau." }],
      },
      workstyle: {
        label: "Metodo",
        title: "Come lavoro",
        intro: "Lavoro in modo strutturato ma non rigido. Ogni buon progetto inizia con la comprensione: qual è l'obiettivo? Chi dobbiamo raggiungere? Quale messaggio deve arrivare? Solo allora nascono idee che funzionano davvero.",
        steps: [
          { t: "Comprendere", p: "Catturare obiettivi, pubblico, brand e punto di partenza." },
          { t: "Strutturare", p: "Organizzare le informazioni per contenuti convincenti." },
          { t: "Progettare", p: "Collegare design, tono e UX al brand." },
          { t: "Ottimizzare", p: "Trasformare feedback e misurazioni in miglioramenti." },
        ],
      },
      values: {
        label: "Valori",
        title: "Valori personali",
        intro: "I miei valori guidano come lavoro, comunico e mi assumo responsabilità. Sono orientamento concreto – soprattutto nel marketing digitale, dove contano chiarezza, credibilità e azione consapevole.",
        rows: [
          { t: "Affidabilità", p: "Mantenere le promesse, assumersi responsabilità, portare a termine." },
          { t: "Qualità", p: "Risultati ponderati, puliti e sostenibili." },
          { t: "Iniziativa", p: "Pensare in anticipo, proporre soluzioni, prendersi carico." },
          { t: "Apprendimento", p: "Aperti a nuovi strumenti, metodi e tecnologie." },
          { t: "Spirito di squadra", p: "Fiducia, apertura e supporto reciproco." },
          { t: "Impatto", p: "Il marketing deve orientare e portare all'azione." },
        ],
      },
    },
  };

  function applyTimelineRoles(timeline, items, focusLabel) {
    if (!timeline) return;
    timeline.querySelectorAll(".tl-item").forEach(function (item, i) {
      var data = items[i];
      if (!data) return;
      var paras = item.querySelectorAll("p");
      if (paras[0] && data.role) paras[0].textContent = data.role;
      if (data.focus && paras[1]) {
        var strong = paras[1].querySelector("strong");
        if (strong) strong.textContent = focusLabel;
        if (paras[2]) paras[2].innerHTML = data.focus.replace(/\n/g, "<br />");
      }
    });
  }

  function applyMergedAboutSources(doc, lang) {
    var pack = lp(ABOUT_SOURCES, lang);
    var exp = doc.querySelector("#slide-experience .slide-inner");
    if (exp && pack.experience) {
      var e = pack.experience;
      setText(exp.querySelector(".chapter-label"), e.label);
      setText(exp.querySelector(".section-title"), e.title);
      var intro = exp.querySelector(".prose");
      if (intro) intro.textContent = e.intro;
      var titles = exp.querySelectorAll(".exp-block-title");
      if (titles[0]) titles[0].textContent = e.workTitle;
      if (titles[1]) titles[1].textContent = e.eduTitle;
      if (titles[2]) titles[2].textContent = e.schoolTitle;
      var timelines = exp.querySelectorAll(".timeline");
      applyTimelineRoles(timelines[0], e.jobs, e.focus);
      applyTimelineRoles(timelines[1], e.edu, e.focus);
      applyTimelineRoles(timelines[2], e.school, e.focus);
      exp.setAttribute("aria-label", e.label);
    }
    var ws = doc.querySelector("#slide-workstyle .slide-inner");
    if (ws && pack.workstyle) {
      var w = pack.workstyle;
      setText(ws.querySelector(".chapter-label"), w.label);
      setText(ws.querySelector(".section-title"), w.title);
      var wIntro = ws.querySelector(".prose");
      if (wIntro) wIntro.textContent = w.intro;
      ws.querySelectorAll(".wp-step").forEach(function (step, i) {
        if (!w.steps[i]) return;
        setText(step.querySelector("h3"), w.steps[i].t);
        setText(step.querySelector("p"), w.steps[i].p);
      });
      ws.closest("section").setAttribute("aria-label", w.label);
    }
    var val = doc.querySelector("#slide-values .slide-inner");
    if (val && pack.values) {
      var v = pack.values;
      setText(val.querySelector(".chapter-label"), v.label);
      setText(val.querySelector(".section-title"), v.title);
      var vIntro = val.querySelector(".prose");
      if (vIntro) vIntro.textContent = v.intro;
      val.querySelectorAll(".vz-row").forEach(function (row, i) {
        if (!v.rows[i]) return;
        setText(row.querySelector("h3"), v.rows[i].t);
        setText(row.querySelector("p"), v.rows[i].p);
      });
      val.closest("section").setAttribute("aria-label", v.label);
    }
  }

  function refreshMergedAbout(doc) {
    if (!window.WeltenSiteIA || typeof window.WeltenSiteIA.refreshMergedAbout !== "function") return;
    window.WeltenSiteIA.refreshMergedAbout();
  }

  function applyContent(doc, lang) {
    if (!doc || !lang) return;
    if (window.WeltenPreviewI18n) {
      var world = window.WeltenPreviewI18n.getWorld(doc);
      window.WeltenPreviewI18n.applyHome(doc, world, lang);
    }
    applyHomeCtas(doc, lang);
    applyProjectsAccordion(doc, lang);
    applyLeistungenLanes(doc, lang);
    applyServicesGrid(doc, lang);
    applyAboutExtra(doc, lang);
    applyAboutMain(doc, lang);
    applyPersona(doc, lang);
    applyContactCopy(doc, lang);
    applyMergedAboutSources(doc, lang);
    refreshMergedAbout(doc);
    if (window.WeltenProjectsI18n && typeof window.WeltenProjectsI18n.apply === "function") {
      window.WeltenProjectsI18n.apply(doc, lang);
    }
    if (window.WeltenCleanup && typeof window.WeltenCleanup.injectLeistungenRich === "function") {
      window.WeltenCleanup.injectLeistungenRich(lang);
    }
    if (window.WeltenSkillsCharts && typeof window.WeltenSkillsCharts.init === "function") {
      window.WeltenSkillsCharts.init(lang);
    }
    if (window.WeltenProjectsServices && typeof window.WeltenProjectsServices.render === "function") {
      window.WeltenProjectsServices.render();
    }
    if (window.WeltenContactLeadform && typeof window.WeltenContactLeadform.syncLeadFormFrame === "function") {
      window.WeltenContactLeadform.syncLeadFormFrame();
    }
  }

  function extendI18n() {
    if (!window.WeltenPreviewI18n || window.WeltenPreviewI18n.__contentExtended) return;
    var orig = window.WeltenPreviewI18n.apply;
    window.WeltenPreviewI18n.apply = function (doc, lang) {
      orig(doc, lang);
      applyContent(doc, lang);
    };
    window.WeltenPreviewI18n.__contentExtended = true;
  }

  function boot() {
    extendI18n();
    document.addEventListener("welten-lang-change", function (e) {
      var lang = (e && e.detail && e.detail.lang) || "de";
      applyContent(document, lang);
    });
  }

  if (window.WeltenPreviewI18n) {
    boot();
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.WeltenContentI18n = {
    apply: applyContent,
    applyContactCopy: applyContactCopy,
    CONTACT_UI: CONTACT_UI,
    CTA: CTA,
  };
})();
