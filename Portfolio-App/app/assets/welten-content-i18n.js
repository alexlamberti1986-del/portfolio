/**
 * Erweiterte Inhalts-Übersetzungen DE / EN / IT — Persona, About, Projekte, Kontakt, Leistungen
 */
(function () {
  "use strict";

  var CTA = {
    de: { cta1: "Projekte ansehen", cta2: "Über mich" },
    en: { cta1: "View projects", cta2: "About me" },
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
    },
    en: {
      prose1: "I welcome opportunities where I can apply my experience in brand staging, client communication and digital marketing.",
      prose2: "Let's talk.",
      prose3: "Whether website, brand presence, digital visibility or a specific client project: I appreciate the exchange and respond quickly, reliably and without fuss.",
      email: "Email",
      phone: "Phone",
      address: "Address",
    },
    it: {
      prose1: "Accolgo opportunità in cui posso applicare la mia esperienza in brand staging, comunicazione con i clienti e marketing digitale.",
      prose2: "Parliamone.",
      prose3: "Sito web, presenza di marca, visibilità digitale o progetto specifico: apprezzo lo scambio e rispondo rapidamente, in modo affidabile e semplice.",
      email: "E-mail",
      phone: "Telefono",
      address: "Indirizzo",
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
    var pack = CTA[lang] || CTA.de;
    doc.querySelectorAll("#slide-home .cta-row .btn").forEach(function (btn, i) {
      if (i === 0 && pack.cta1) btn.textContent = pack.cta1;
      if (i === 1 && pack.cta2) btn.textContent = pack.cta2;
    });
  }

  function applyProjectsAccordion(doc, lang) {
    var pack = ACCORDION[lang] || ACCORDION.de;
    Object.keys(pack).forEach(function (cat) {
      var item = doc.querySelector('.projects-accordion__item[data-category="' + cat + '"]');
      if (!item) return;
      var c = pack[cat];
      setText(item.querySelector(".projects-accordion__label"), c.label);
      setText(item.querySelector(".projects-accordion__meta"), c.meta);
    });
  }

  function applyServicesGrid(doc, lang) {
    var items = SERVICES_GRID[lang] || SERVICES_GRID.de;
    doc.querySelectorAll(".welten-leistungen-grid .welten-leistung-card").forEach(function (card, i) {
      if (!items[i]) return;
      setText(card.querySelector("h3"), items[i].title);
      setText(card.querySelector("p"), items[i].desc);
    });
  }

  function applyLeistungenLanes(doc, lang) {
    var pack = LEISTUNGEN_LANES[lang] || LEISTUNGEN_LANES.de;
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
    var paras = ABOUT_MAIN[lang] || ABOUT_MAIN.de;
    var aboutInner = doc.querySelector("#slide-about .slide-inner > div");
    if (!aboutInner) return;
    aboutInner.querySelectorAll(":scope > p.prose").forEach(function (p, i) {
      if (paras[i]) p.textContent = paras[i];
    });
  }

  function applyAboutExtra(doc, lang) {
    var key = worldExtraKey(doc);
    var pack = (ABOUT_EXTRA[key] && ABOUT_EXTRA[key][lang]) || (ABOUT_EXTRA[key] && ABOUT_EXTRA[key].de);
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
    var pack = PERSONA[lang] || PERSONA.de;
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
    var slidePack = slides && slides[world] && slides[world][lang] && slides[world][lang].contact;
    var ui = CONTACT_UI[lang] || CONTACT_UI.de;
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
      else if (t.indexOf("079") >= 0 || t.toLowerCase().indexOf("telefon") >= 0 || t.toLowerCase().indexOf("phone") >= 0)
        span.textContent = ui.phone + ": 079 667 82 11";
      else if (t.indexOf("Schulweg") >= 0 || t.toLowerCase().indexOf("address") >= 0 || t.toLowerCase().indexOf("indirizzo") >= 0)
        span.textContent = ui.address + ": Schulweg 603, 5324 Full-Reuenthal, Schweiz";
    });
  }

  function refreshMergedAbout(doc) {
    if (!window.WeltenSiteIA || typeof window.WeltenSiteIA.refreshMergedAbout !== "function") return;
    window.WeltenSiteIA.refreshMergedAbout();
  }

  function applyContent(doc, lang) {
    if (!doc || !lang) return;
    applyHomeCtas(doc, lang);
    applyProjectsAccordion(doc, lang);
    applyLeistungenLanes(doc, lang);
    applyServicesGrid(doc, lang);
    applyAboutExtra(doc, lang);
    applyAboutMain(doc, lang);
    applyPersona(doc, lang);
    applyContactCopy(doc, lang);
    refreshMergedAbout(doc);
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
