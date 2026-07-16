/**
 * Portfolio Preview · globale Übersetzungen DE / EN / FR / IT
 */
(function (root) {
  "use strict";

  function normalizeLang(lang) {
    if (root.WeltenTranslations) return root.WeltenTranslations.normalizeLang(lang);
    lang = String(lang || "de").toLowerCase();
    if (lang === "en" || lang === "it" || lang === "fr") return lang;
    return "de";
  }

  function pick(map, lang) {
    if (!map) return null;
    lang = normalizeLang(lang);
    if (root.WeltenTranslations) {
      return root.WeltenTranslations.langPack(map, lang);
    }
    return map[lang] || map.en || map.de;
  }

  function slidesFor(world, lang) {
    var w = SLIDES[world];
    if (!w) return null;
    return pick(w, lang);
  }

  var NAV = {
    de: { home: "Home", projects: "Projekte", leistungen: "Leistungen", about: "Über mich", contact: "Kontakt", offerte: "Offerte", menu: "Menü", menuClose: "Schliessen" },
    en: { home: "Home", projects: "Projects", leistungen: "Services", about: "About", contact: "Contact", offerte: "Offer", menu: "Menu", menuClose: "Close" },
    fr: { home: "Accueil", projects: "Projets", leistungen: "Services", about: "À propos", contact: "Contact", offerte: "Offre", menu: "Menu", menuClose: "Fermer" },
    it: { home: "Home", projects: "Progetti", leistungen: "Servizi", about: "Chi sono", contact: "Contatto", offerte: "Offerta", menu: "Menu", menuClose: "Chiudi" },
  };

  var ARIA = {
    de: {
      brandHome: "Zur Startseite",
      mainNav: "Hauptnavigation",
      mainMenu: "Hauptmenü",
      dnaStage: "Kapitel wählen: ziehen zum Drehen, vordere Karte antippen",
      slideHome: "Startseite",
      slideLeistungen: "Leistungen",
      slideProjects: "Projekte",
      slideAbout: "Über mich",
      slideContact: "Kontakt",
      slideValues: "Werte",
      slideExperience: "Erfahrung",
      slideWorkstyle: "Arbeitsweise",
      portrait: "Alex Lamberti",
      focusAreas: "Persönliche Schwerpunkte",
    },
    en: {
      brandHome: "Go to homepage",
      mainNav: "Main navigation",
      mainMenu: "Main menu",
      dnaStage: "Choose chapter: drag to rotate, tap front card",
      slideHome: "Home",
      slideLeistungen: "Services",
      slideProjects: "Projects",
      slideAbout: "About me",
      slideContact: "Contact",
      slideValues: "Values",
      slideExperience: "Experience",
      slideWorkstyle: "Approach",
      portrait: "Alex Lamberti",
      focusAreas: "Personal focus areas",
    },
    fr: {
      brandHome: "Aller à l'accueil",
      mainNav: "Navigation principale",
      mainMenu: "Menu principal",
      dnaStage: "Choisir un chapitre : glisser pour tourner, toucher la carte avant",
      slideHome: "Accueil",
      slideLeistungen: "Services",
      slideProjects: "Projets",
      slideAbout: "À propos",
      slideContact: "Contact",
      slideValues: "Valeurs",
      slideExperience: "Expérience",
      slideWorkstyle: "Méthode",
      portrait: "Alex Lamberti",
      focusAreas: "Domaines de focus personnels",
    },
    it: {
      brandHome: "Vai alla home",
      mainNav: "Navigazione principale",
      mainMenu: "Menu principale",
      dnaStage: "Scegli capitolo: trascina per ruotare, tocca la carta frontale",
      slideHome: "Home",
      slideLeistungen: "Servizi",
      slideProjects: "Progetti",
      slideAbout: "Chi sono",
      slideContact: "Contatto",
      slideValues: "Valori",
      slideExperience: "Esperienza",
      slideWorkstyle: "Metodo",
      portrait: "Alex Lamberti",
      focusAreas: "Aree di focus personali",
    },
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
          bullets: [
            "Digitale Markenauftritte mit klarer Positionierung",
            "Websites mit Fokus auf Nutzerführung, Struktur und Conversion",
            "SEO-orientierte Inhalte, die gefunden und verstanden werden",
            "Kampagnen, die Strategie, Design und Umsetzung verbinden",
            "Offenheit für KI, Automatisierung und moderne Marketingprozesse",
            "Verständnis für digitale Customer Journeys und Nutzerverhalten",
            "Kombination aus Kreativität, Technologie und analytischem Denken",
          ],
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
          tag: "Four worlds. One goal. Your vision.",
          bullets: [
            "Digital brand presences with clear positioning",
            "Websites focused on user guidance, structure and conversion",
            "SEO-oriented content that is found and understood",
            "Campaigns connecting strategy, design and delivery",
            "Openness to AI, automation and modern marketing processes",
            "Understanding of digital customer journeys and user behaviour",
            "Combination of creativity, technology and analytical thinking",
          ],
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
          tag: "Quattro mondi. Un obiettivo. La tua visione.",
          bullets: [
            "Presenze di marca digitali con posizionamento chiaro",
            "Siti web con focus su guida utente, struttura e conversione",
            "Contenuti orientati alla SEO, trovati e compresi",
            "Campagne che uniscono strategia, design e implementazione",
            "Apertura a IA, automazione e processi marketing moderni",
            "Comprensione dei customer journey digitali e del comportamento utente",
            "Combinazione di creatività, tecnologia e pensiero analitico",
          ],
        },
        about: { label: "Chi sono", title: "Unisco strategia, tecnologia e design in una presenza digitale chiara.", extraLabel: "MULTIVERSO", extraTitle: "Tutti i mondi · un obiettivo" },
        leistungen: { label: "Servizi", title: "Servizi & competenze", intro: "Dalla strategia all'implementazione · adattato a pubblico, brand e impatto." },
        projects: { label: "Progetti", title: "Progetti con identità chiara.", intro: "Siti web, moduli lead e presenza digitale · per categoria." },
        contact: { label: "Contatto", title: "Pronti per il prossimo passo.", intro: "Scrivimi · rispondo rapidamente, in modo affidabile e semplice." },
      },
    },
    nexora: {
      de: {
        home: {
          intro: "NEXORA · Virtuell · AI · Zukunft",
          h1: "Digital Marketing zwischen Strategie, Technologie und Zukunft.",
          lead: "Strategie wird sichtbar. Technologie wird menschlich. Marketing wird wirksam.",
          more: [
            "Ich verbinde kreatives Marketing mit digitalem Systemdenken. Mein Fokus liegt auf Markenauftritten, Websites, Content-Strukturen und digitalen Kampagnen, die nicht nur gut aussehen, sondern Orientierung, Vertrauen und messbare Wirkung schaffen.",
            "NEXORA steht für meine zukunftsorientierte Seite: analytisch, digital, neugierig und offen für neue Technologien. Ich denke Marketing nicht isoliert, sondern als intelligentes Zusammenspiel aus Strategie, Design, Daten, Nutzerführung, Automatisierung und klarer Kommunikation.",
            "In einer digitalen Welt, in der Aufmerksamkeit immer wertvoller wird, braucht gutes Marketing mehr als schöne Gestaltung. Es braucht Relevanz, Struktur, starke Botschaften und ein Verständnis dafür, wie Menschen online suchen, vergleichen und Vertrauen aufbauen. Genau hier sehe ich meine Stärke: Ich übersetze kreative Ideen in digitale Konzepte, die professionell wirken und praktisch funktionieren.",
            "Besonders spannend finde ich digitale Lösungen, die Prozesse vereinfachen, Marken sichtbarer machen und Nutzer schneller zur richtigen Entscheidung führen. Ob Website-Struktur, Content, SEO, Kampagnenlogik oder moderne Tools – ich möchte Marketing so gestalten, dass es klar, effizient und zukunftsfähig ist.",
          ],
          bullets: [
            "Digitale Markenauftritte mit klarer Positionierung",
            "Websites mit Fokus auf Nutzerführung, Struktur und Conversion",
            "SEO-orientierte Inhalte, die gefunden und verstanden werden",
            "Kampagnen, die Strategie, Design und Umsetzung verbinden",
            "Offenheit für KI, Automatisierung und moderne Marketingprozesse",
            "Verständnis für digitale Customer Journeys und Nutzerverhalten",
            "Kombination aus Kreativität, Technologie und analytischem Denken",
          ],
          cta1: "Projekte ansehen",
          cta2: "Über mich",
        },
        about: { label: "Über mich", title: "Ich verbinde Markenverständnis, digitale Präzision und echte Umsetzungskraft." },
        leistungen: { label: "Stärken", title: "Leistungen & Kompetenzen", intro: "Diese Stärken nutze ich in digitalen Projekten – von der Konzeption bis zur Umsetzung." },
        projects: { label: "Projekte", title: "Projekte mit klarer Handschrift.", intro: "Drei Projektarten · Websites, Leadformulare und digitale Visitenkarten." },
        contact: { label: "Kontakt", title: "Bereit für den nächsten Schritt.", intro: "Lassen Sie uns ins Gespräch kommen." },
      },
      en: {
        home: {
          intro: "NEXORA · Virtual · AI · Future",
          h1: "Digital marketing between strategy, technology and the future.",
          lead: "Strategy becomes visible. Technology becomes human. Marketing becomes effective.",
          more: [
            "I combine creative marketing with digital systems thinking. My focus is brand presences, websites, content structures and digital campaigns that not only look good but create orientation, trust and measurable impact.",
            "NEXORA represents my future-oriented side: analytical, digital, curious and open to new technologies. I don't think marketing in isolation but as an intelligent interplay of strategy, design, data, user guidance, automation and clear communication.",
            "In a digital world where attention is ever more valuable, good marketing needs more than beautiful design. It needs relevance, structure, strong messages and an understanding of how people search, compare and build trust online. That is where I excel: translating creative ideas into digital concepts that look professional and work in practice.",
            "I am especially drawn to digital solutions that simplify processes, make brands more visible and guide users faster to the right decision. Whether site structure, content, SEO, campaign logic or modern tools – I want marketing that is clear, efficient and future-ready.",
          ],
          bullets: [
            "Digital brand presences with clear positioning",
            "Websites focused on user guidance, structure and conversion",
            "SEO-oriented content that is found and understood",
            "Campaigns connecting strategy, design and delivery",
            "Openness to AI, automation and modern marketing processes",
            "Understanding of digital customer journeys and user behaviour",
            "Combination of creativity, technology and analytical thinking",
          ],
          cta1: "View projects",
          cta2: "About me",
        },
        about: { label: "About me", title: "I combine brand understanding, digital precision and real delivery strength." },
        leistungen: { label: "Strengths", title: "Services & skills", intro: "These strengths I use in digital projects · from concept to delivery." },
        projects: { label: "Projects", title: "Projects with a clear signature.", intro: "Three project types · websites, lead forms and digital business cards." },
        contact: { label: "Contact", title: "Ready for the next step.", intro: "Let's talk." },
      },
      it: {
        home: {
          intro: "NEXORA · Virtuale · AI · Futuro",
          h1: "Digital marketing tra strategia, tecnologia e futuro.",
          lead: "La strategia diventa visibile. La tecnologia diventa umana. Il marketing diventa efficace.",
          more: [
            "Unisco marketing creativo e pensiero sistemico digitale. Il mio focus sono presenze di marca, siti web, strutture di contenuto e campagne digitali che non solo appaiono bene ma creano orientamento, fiducia e impatto misurabile.",
            "NEXORA rappresenta il mio lato orientato al futuro: analitico, digitale, curioso e aperto alle nuove tecnologie. Non penso al marketing in isolamento ma come intreccio intelligente di strategia, design, dati, guida utente, automazione e comunicazione chiara.",
            "In un mondo digitale dove l'attenzione è sempre più preziosa, il buon marketing richiede più del bel design. Servono rilevanza, struttura, messaggi forti e comprensione di come le persone cercano, confrontano e costruiscono fiducia online. Qui è la mia forza: tradurre idee creative in concept digitali professionali e funzionali.",
            "Mi attraggono soprattutto soluzioni digitali che semplificano i processi, rendono i brand più visibili e guidano gli utenti più rapidamente alla decisione giusta. Struttura sito, contenuti, SEO, logica campagne o strumenti moderni – voglio marketing chiaro, efficiente e pronto per il futuro.",
          ],
          bullets: [
            "Presenze di marca digitali con posizionamento chiaro",
            "Siti web con focus su guida utente, struttura e conversione",
            "Contenuti orientati alla SEO, trovati e compresi",
            "Campagne che uniscono strategia, design e implementazione",
            "Apertura a IA, automazione e processi marketing moderni",
            "Comprensione dei customer journey digitali e del comportamento utente",
            "Combinazione di creatività, tecnologia e pensiero analitico",
          ],
          cta1: "Vedi progetti",
          cta2: "Chi sono",
        },
        about: { label: "Chi sono", title: "Unisco comprensione del brand, precisione digitale e capacità di implementazione." },
        leistungen: { label: "Punti di forza", title: "Servizi & competenze", intro: "Questi punti di forza li uso nei progetti digitali · dal concept all'implementazione." },
        projects: { label: "Progetti", title: "Progetti con identità chiara.", intro: "Tre tipi di progetto · siti web, moduli lead e biglietti digitali." },
        contact: { label: "Contatto", title: "Pronti per il prossimo passo.", intro: "Parliamone." },
      },
    },
    vertex: {
      de: {
        home: {
          intro: "PROFESSIONAL · Klar · Strategisch · Wirkungsvoll",
          h1: "Marketing mit Klarheit, Struktur und messbarer Wirkung.",
          lead: "Professionell. Präzise. Verlässlich.",
          more: [
            "Ich entwickle Marketing- und Webprojekte mit einem hohen Anspruch an Qualität, Struktur und Verlässlichkeit. Dabei verbinde ich strategisches Denken, saubere Umsetzung und ein starkes Verständnis für Kunden, Marken und Zielgruppen.",
            "PROFESSIONAL steht für meine strukturierte und verantwortungsbewusste Arbeitsweise. Ich sehe Digital Marketing nicht als reine Gestaltung, sondern als Zusammenspiel aus Analyse, Kommunikation, Vertrauen und konsequenter Umsetzung.",
            "Jede Website, jede Kampagne und jeder Markenauftritt sollte ein klares Ziel verfolgen: Menschen erreichen, Orientierung schaffen und Unternehmen glaubwürdig positionieren. Mir ist wichtig, dass digitale Projekte nicht nur ästhetisch überzeugen, sondern auch verständlich, effizient und nachhaltig aufgebaut sind.",
            "Ich arbeite gerne an der Schnittstelle zwischen Kundenbedürfnissen, Unternehmenszielen und kreativer Umsetzung. Verlässlichkeit, transparente Kommunikation und ein sauberer Projektablauf sind für mich zentrale Grundlagen erfolgreicher Zusammenarbeit. Ich bringe Projekte mit Fokus, Verantwortung und Qualitätsbewusstsein voran.",
          ],
          bullets: [
            "Strukturierte Projektführung von der Idee bis zur Umsetzung",
            "Klare Kommunikation mit Kunden, Teams und Partnern",
            "Qualitätsbewusstsein in Design, Inhalt und Nutzerführung",
            "Digital Marketing mit Fokus auf Vertrauen und Resultate",
            "Verantwortungsvolle Arbeitsweise mit Blick fürs Detail",
            "Verständnis für Markenwirkung, Zielgruppen und Kundenbedürfnisse",
            "Verlässliche Umsetzung auch bei komplexeren Aufgaben",
          ],
          cta1: "Projekte ansehen",
          cta2: "Über mich",
        },
        about: { label: "Über mich", title: "Klarheit, Verantwortung und Ergebnisorientierung prägen meine Arbeit." },
        leistungen: { label: "Stärken", title: "Leistungen & Kompetenzen", intro: "Strukturierte Umsetzung für Unternehmen, die Klarheit und Qualität erwarten." },
        projects: { label: "Projekte", title: "Projekte mit klarer Handschrift.", intro: "Ausgewählte Referenzen und umgesetzte Auftritte." },
        contact: { label: "Kontakt", title: "Bereit für den nächsten Schritt.", intro: "Ich freue mich auf Ihre Nachricht." },
      },
      en: {
        home: {
          intro: "PROFESSIONAL · Clear · Strategic · Impactful",
          h1: "Marketing with clarity, structure and measurable impact.",
          lead: "Professional. Precise. Reliable.",
          more: [
            "I develop marketing and web projects with high standards for quality, structure and reliability. I combine strategic thinking, clean delivery and a strong understanding of clients, brands and audiences.",
            "PROFESSIONAL stands for my structured and responsible way of working. I see digital marketing not as pure design but as an interplay of analysis, communication, trust and consistent delivery.",
            "Every website, campaign and brand presence should pursue a clear goal: reach people, create orientation and position businesses credibly. Digital projects must not only look good but be understandable, efficient and sustainably built.",
            "I enjoy working at the intersection of client needs, business goals and creative delivery. Reliability, transparent communication and a clean project flow are foundations of successful collaboration. I move projects forward with focus, responsibility and quality awareness.",
          ],
          bullets: [
            "Structured project leadership from idea to delivery",
            "Clear communication with clients, teams and partners",
            "Quality awareness in design, content and user guidance",
            "Digital marketing focused on trust and results",
            "Responsible working style with attention to detail",
            "Understanding of brand impact, audiences and client needs",
            "Reliable delivery even on complex tasks",
          ],
          cta1: "View projects",
          cta2: "About me",
        },
        about: { label: "About me", title: "Clarity, responsibility and results orientation shape my work." },
        leistungen: { label: "Strengths", title: "Services & skills", intro: "Structured delivery for businesses that expect clarity and quality." },
        projects: { label: "Projects", title: "Projects with a clear signature.", intro: "Selected references and delivered presences." },
        contact: { label: "Contact", title: "Ready for the next step.", intro: "I look forward to your message." },
      },
      it: {
        home: {
          intro: "PROFESSIONAL · Chiaro · Strategico · Efficace",
          h1: "Marketing con chiarezza, struttura e impatto misurabile.",
          lead: "Professionale. Preciso. Affidabile.",
          more: [
            "Sviluppo progetti marketing e web con alto standard di qualità, struttura e affidabilità. Unisco pensiero strategico, implementazione pulita e forte comprensione di clienti, brand e pubblico.",
            "PROFESSIONAL rappresenta il mio modo di lavorare strutturato e responsabile. Vedo il marketing digitale non come puro design ma come intreccio di analisi, comunicazione, fiducia e implementazione coerente.",
            "Ogni sito, campagna e presenza di marca deve perseguire un obiettivo chiaro: raggiungere le persone, creare orientamento e posizionare le aziende in modo credibile. I progetti digitali devono convincere non solo esteticamente ma essere comprensibili, efficienti e sostenibili.",
            "Lavoro volentieri all'intersezione tra esigenze dei clienti, obiettivi aziendali e implementazione creativa. Affidabilità, comunicazione trasparente e flusso di progetto pulito sono basi di collaborazione riuscita. Porto avanti i progetti con focus, responsabilità e attenzione alla qualità.",
          ],
          bullets: [
            "Gestione progetti strutturata dall'idea all'implementazione",
            "Comunicazione chiara con clienti, team e partner",
            "Attenzione alla qualità in design, contenuti e guida utente",
            "Marketing digitale con focus su fiducia e risultati",
            "Metodo responsabile con attenzione ai dettagli",
            "Comprensione dell'impatto del brand, del pubblico e dei clienti",
            "Implementazione affidabile anche su compiti complessi",
          ],
          cta1: "Vedi progetti",
          cta2: "Chi sono",
        },
        about: { label: "Chi sono", title: "Chiarezza, responsabilità e orientamento ai risultati guidano il mio lavoro." },
        leistungen: { label: "Punti di forza", title: "Servizi & competenze", intro: "Implementazione strutturata per aziende che richiedono chiarezza e qualità." },
        projects: { label: "Progetti", title: "Progetti con identità chiara.", intro: "Referenze selezionate e presenze realizzate." },
        contact: { label: "Contatto", title: "Pronti per il prossimo passo.", intro: "Attendo il tuo messaggio." },
      },
    },
    freiraum: {
      de: {
        home: {
          intro: "FREIRAUM · Kreativ · Emotional · Nahbar",
          h1: "Marketing mit Herz, Ideen und echter Begeisterung.",
          lead: "Kreativität trifft Strategie. Emotion trifft Wirkung.",
          more: [
            "Ich entwickle digitale Auftritte, die nicht nur informieren, sondern Atmosphäre schaffen. Mein Fokus liegt auf Ideen, Identität, Storytelling und Gestaltung, die Menschen emotional erreichen und Marken unverwechselbar machen.",
            "FREIRAUM steht für meine kreative und persönliche Seite. Hier geht es um Ideen, Perspektivenwechsel, Gestaltung und den Mut, Marken nicht nur funktional, sondern spürbar zu machen.",
            "Für mich beginnt gutes Marketing dort, wo Strategie und Emotion zusammenkommen: wenn eine Botschaft klar ist, ein Design Charakter hat und ein digitaler Auftritt Menschen wirklich anspricht. Ich möchte Inhalte schaffen, die nicht beliebig wirken, sondern Persönlichkeit zeigen und im Kopf bleiben.",
            "Durch meinen Hintergrund im Visual Merchandising habe ich gelernt, Wirkung bewusst zu gestalten. Räume, Farben, Bilder, Texte und Strukturen erzählen immer eine Geschichte. Dieses Verständnis übertrage ich heute in digitale Projekte. Ich möchte Websites, Inhalte und Markenauftritte schaffen, die authentisch wirken, Wiedererkennung erzeugen und gleichzeitig professionell aufgebaut sind.",
          ],
          bullets: [
            "Kreative Konzepte mit klarer Markenidentität",
            "Storytelling, das Menschen emotional erreicht",
            "Gestaltung mit Atmosphäre, Struktur und Wiedererkennung",
            "Content, der Persönlichkeit sichtbar macht",
            "Ideenentwicklung mit strategischem Fundament",
            "Gespür für Bildsprache, Farben, Räume und Markenwirkung",
            "Verbindung von Kreativität, Klarheit und digitaler Umsetzung",
          ],
          cta1: "Projekte ansehen",
          cta2: "Über mich",
        },
        about: { label: "Über mich", title: "Ich gestalte Markenerlebnisse, die Menschen berühren und im Gedächtnis bleiben." },
        leistungen: { label: "Stärken", title: "Leistungen & Kompetenzen", intro: "Kreative Konzepte mit emotionaler Tiefe und klarer Umsetzung." },
        projects: { label: "Projekte", title: "Projekte mit klarer Handschrift.", intro: "Ideen, die auffallen · und Wirkung zeigen." },
        contact: { label: "Kontakt", title: "Bereit für den nächsten Schritt.", intro: "Lass uns deine Idee besprechen." },
      },
      en: {
        home: {
          intro: "FREIRAUM · Creative · Emotional · Approachable",
          h1: "Marketing with heart, ideas and genuine excitement.",
          lead: "Creativity meets strategy. Emotion meets impact.",
          more: [
            "I create digital presences that don't just inform but create atmosphere. My focus is ideas, identity, storytelling and design that reach people emotionally and make brands unmistakable.",
            "FREIRAUM stands for my creative and personal side. It is about ideas, shifts in perspective, design and the courage to make brands not only functional but tangible.",
            "Good marketing starts where strategy and emotion meet: when a message is clear, design has character and a digital presence truly speaks to people. I want content that shows personality and stays memorable.",
            "Through my background in visual merchandising I learned to shape impact consciously. Spaces, colours, images, text and structure always tell a story. I bring that understanding to digital projects – websites, content and brand presences that feel authentic, build recognition and remain professionally structured.",
          ],
          bullets: [
            "Creative concepts with clear brand identity",
            "Storytelling that reaches people emotionally",
            "Design with atmosphere, structure and recognition",
            "Content that makes personality visible",
            "Idea development with strategic foundation",
            "Sense for imagery, colour, space and brand impact",
            "Connection of creativity, clarity and digital delivery",
          ],
          cta1: "View projects",
          cta2: "About me",
        },
        about: { label: "About me", title: "I create brand experiences that touch people and stay memorable." },
        leistungen: { label: "Strengths", title: "Services & skills", intro: "Creative concepts with emotional depth and clear delivery." },
        projects: { label: "Projects", title: "Projects with a clear signature.", intro: "Ideas that stand out · and show impact." },
        contact: { label: "Contact", title: "Ready for the next step.", intro: "Let's discuss your idea." },
      },
      it: {
        home: {
          intro: "FREIRAUM · Creativo · Emotivo · Vicino",
          h1: "Marketing con cuore, idee e vero entusiasmo.",
          lead: "La creatività incontra la strategia. L'emozione incontra l'impatto.",
          more: [
            "Creo presenze digitali che non solo informano ma creano atmosfera. Il mio focus sono idee, identità, storytelling e design che raggiungono le persone emotivamente e rendono i brand inconfondibili.",
            "FREIRAUM rappresenta il mio lato creativo e personale. Si tratta di idee, cambi di prospettiva, design e il coraggio di rendere i brand non solo funzionali ma percepibili.",
            "Il buon marketing inizia dove strategia ed emozione si incontrano: quando un messaggio è chiaro, il design ha carattere e una presenza digitale parla davvero alle persone. Voglio contenuti che mostrano personalità e restano nella memoria.",
            "Grazie al background nel visual merchandising ho imparato a modellare l'impatto in modo consapevole. Spazi, colori, immagini, testi e strutture raccontano sempre una storia. Porto questa comprensione nei progetti digitali – siti, contenuti e presenze di marca autentiche, riconoscibili e professionalmente strutturate.",
          ],
          bullets: [
            "Concept creativi con identità di marca chiara",
            "Storytelling che raggiunge emotivamente",
            "Design con atmosfera, struttura e riconoscibilità",
            "Contenuti che rendono visibile la personalità",
            "Sviluppo idee con fondamento strategico",
            "Senso per immagini, colori, spazi e impatto del brand",
            "Connessione tra creatività, chiarezza e implementazione digitale",
          ],
          cta1: "Vedi progetti",
          cta2: "Chi sono",
        },
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
    var nav = pick(NAV, lang) || NAV.de;
    doc.querySelectorAll(
      ".experience-step[data-go], .dna-slide[data-go], .nexora-orbit-button[data-go], .mv-static-hero__nav-btn[data-go], .menu-links a[data-go]"
    ).forEach(function (el) {
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

  function applyAria(doc, lang) {
    var a = pick(ARIA, lang) || ARIA.de;
    var brand = doc.querySelector(".brand-mark[data-go='home']");
    if (brand) brand.setAttribute("aria-label", a.brandHome);
    var rail = doc.querySelector(".experience-rail");
    if (rail) rail.setAttribute("aria-label", a.mainNav);
    var menu = doc.getElementById("mainMenu");
    if (menu) menu.setAttribute("aria-label", a.mainMenu);
    var menuLinks = doc.querySelector(".menu-links");
    if (menuLinks) menuLinks.setAttribute("aria-label", a.mainNav);
    var dna = doc.getElementById("dnaStage");
    if (dna) dna.setAttribute("aria-label", a.dnaStage);
    var slideMap = {
      "slide-home": a.slideHome,
      "slide-leistungen": a.slideLeistungen,
      "slide-projects": a.slideProjects,
      "slide-about": a.slideAbout,
      "slide-contact": a.slideContact,
      "slide-values": a.slideValues,
      "slide-experience": a.slideExperience,
      "slide-workstyle": a.slideWorkstyle,
    };
    Object.keys(slideMap).forEach(function (id) {
      var el = doc.getElementById(id);
      if (el && slideMap[id]) el.setAttribute("aria-label", slideMap[id]);
    });
    doc.querySelectorAll(".home-portrait-card").forEach(function (fig) {
      fig.setAttribute("aria-label", a.portrait);
    });
    var persona = doc.querySelector(".persona-tabs");
    if (persona) persona.setAttribute("aria-label", a.focusAreas);
  }

  function applyHome(doc, world, lang) {
    var pack = slidesFor(world, lang);
    if (!pack || !pack.home) return;
    var h = pack.home;
    setText(doc.getElementById("worldIntro"), h.intro);
    var copy = doc.querySelector("#slide-home .home-copy");
    if (!copy) return;
    setText(copy.querySelector("h1"), h.h1);
    setText(copy.querySelector(".lead"), h.lead);
    if (h.more) {
      copy.querySelectorAll("p.more").forEach(function (p, i) {
        if (h.more[i]) p.textContent = h.more[i];
      });
    }
    if (h.bullets) {
      copy.querySelectorAll("ul.prose li").forEach(function (li, i) {
        if (h.bullets[i]) li.textContent = h.bullets[i];
      });
    }
    var cta = copy.querySelectorAll(".cta-row .btn");
    if (cta[0] && h.cta1) cta[0].textContent = h.cta1;
    if (cta[1] && h.cta2) {
      cta[1].textContent = h.cta2;
      cta[1].setAttribute("data-go", "about");
    }
    var tag = doc.querySelector(".mv-world-hero__tag");
    if (tag && h.tag) tag.textContent = h.tag;
    var staticTags = doc.querySelectorAll(".mv-static-hero__tag");
    staticTags.forEach(function (staticTag) {
      if (!staticTag || !h.tag) return;
      var spans = staticTag.querySelectorAll("span");
      var parts = String(h.tag)
        .split(/\.\s*/)
        .map(function (p) {
          return p.trim();
        })
        .filter(Boolean);
      if (spans.length < 3 && parts.length >= 3) {
        staticTag.innerHTML =
          '<span class="mv-tag-blue"></span> <span class="mv-tag-white"></span> <span class="mv-tag-warm"></span>';
        spans = staticTag.querySelectorAll("span");
      }
      if (spans.length >= 3 && parts.length >= 3) {
        spans[0].textContent = parts[0] + ".";
        spans[1].textContent = parts[1] + ".";
        spans[2].textContent = parts[2] + (/\.$/.test(h.tag) || parts[2].indexOf("!") < 0 ? "." : "");
        spans[0].className = "mv-tag-blue";
        spans[1].className = "mv-tag-white";
        spans[2].className = "mv-tag-warm";
      } else if (spans.length >= 3) {
        /* Spans behalten (Gradient), Text nicht plattwerfen */
        return;
      } else {
        staticTag.innerHTML =
          '<span class="mv-tag-blue">' +
          String(h.tag).replace(/</g, "&lt;") +
          "</span>";
      }
    });
    var eyebrow = doc.querySelector(".mv-static-hero__eyebrow");
    if (eyebrow) {
      var eyebrowPack = {
        de: "Alex Lamberti · Portfolio",
        en: "Alex Lamberti · Portfolio",
        fr: "Alex Lamberti · Portfolio",
        it: "Alex Lamberti · Portfolio",
      };
      eyebrow.textContent = eyebrowPack[lang] || eyebrowPack.de;
    }
  }

  function applyAboutExtra(doc, world, lang) {
    if (world !== "general") return;
    var generalPack = slidesFor("general", lang);
    var pack = generalPack && generalPack.about;
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
    lang = normalizeLang(lang);
    var slidesPack = pick(PARALLAX_SLIDES, lang) || PARALLAX_SLIDES.de;
    var uiPack = pick(PARALLAX_UI, lang) || PARALLAX_UI.de;
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
      var openSuffix =
        lang === "en" ? " open" : lang === "it" ? " apri" : lang === "fr" ? " ouvrir" : " öffnen";
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

    var nav = pick(NAV, lang) || NAV.de;
    var cardOpenSuffix =
      lang === "en" ? " open" : lang === "it" ? " apri" : lang === "fr" ? " ouvrir" : " öffnen";
    var homeOpenSuffix =
      lang === "en"
        ? " open home"
        : lang === "it"
          ? " apri home"
          : lang === "fr"
            ? " ouvrir accueil"
            : " Home öffnen";
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
    lang = normalizeLang(lang);
    var world = getWorld(doc);
    var slides = slidesFor(world, lang);
    if (root.WeltenTranslations) {
      root.WeltenTranslations.applyHtmlLang(doc, lang);
    } else {
      doc.documentElement.lang =
        lang === "en" ? "en" : lang === "it" ? "it" : lang === "fr" ? "fr" : "de-CH";
    }
    applyNav(doc, lang);
    applyAria(doc, lang);
    if (slides) {
      applySlide(doc, "slide-about", slides.about);
      applySlide(doc, "slide-leistungen", slides.leistungen);
      applySlide(doc, "slide-projects", slides.projects);
      applySlide(doc, "slide-contact", slides.contact);
    }
    applyAboutExtra(doc, world, lang);
    applyParallax(doc, lang);
    doc.querySelectorAll("[data-i18n]").forEach(function (el) {
      /* Gradient-Tagline: Spans behalten — applyHome setzt den Text danach */
      if (el.classList && el.classList.contains("mv-static-hero__tag")) return;
      if (el.querySelector && el.querySelector(".mv-tag-blue, .mv-tag-white, .mv-tag-warm")) return;
      var key = el.getAttribute("data-i18n");
      var parts = key.split(".");
      var val = SLIDES[world] && SLIDES[world][lang];
      for (var i = 0; i < parts.length && val; i++) val = val[parts[i]];
      if (typeof val === "string") el.textContent = val;
    });
    /* Nach data-i18n: Tagline-Spans mit Verlauf setzen (nicht plattwerfen) */
    applyHome(doc, world, lang);
  }

  root.WeltenPreviewI18n = {
    apply: apply,
    applyHome: applyHome,
    applyAria: applyAria,
    applyParallax: applyParallax,
    NAV: NAV,
    ARIA: ARIA,
    SLIDES: SLIDES,
    PARALLAX_SLIDES: PARALLAX_SLIDES,
    PARALLAX_UI: PARALLAX_UI,
    getWorld: getWorld,
  };
})(typeof window !== "undefined" ? window : this);
