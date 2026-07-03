/**
 * Projekt-Karten Übersetzungen DE / EN / IT
 */
(function () {
  "use strict";

  var UI = {
    de: { highlight: "Besonders", skill: "Kompetenz", open: "Projekt öffnen", demo: "Demo ansehen", preview: "Vorschau" },
    en: { highlight: "Highlight", skill: "Skill", open: "Open project", demo: "View demo", preview: "Preview" },
    fr: { highlight: "En vedette", skill: "Compétence", open: "Ouvrir le projet", demo: "Voir la démo", preview: "Aperçu" },
    it: { highlight: "In evidenza", skill: "Competenza", open: "Apri progetto", demo: "Vedi demo", preview: "Anteprima" },
  };

  function projectLang(pack, lang) {
    if (window.WeltenTranslations) {
      return window.WeltenTranslations.langPack(pack, lang);
    }
    return pack[lang] || pack.en || pack.de;
  }

  var PROJECTS = {
    "genialbau.ch": {
      de: {
        desc: "Hochwertiger Webauftritt mit Fokus auf Vertrauen, starke Bild- und Videowelt sowie klare Leistungsdarstellung.",
        highlight: "Professionelle Kommunikation, starke Bildwelt und klare Nutzerführung.",
        skill: "Markenwirkung, Inhaltsstruktur, Web-Konzeption.",
      },
      en: {
        desc: "High-quality web presence focused on trust, strong imagery and video, and clear service presentation.",
        highlight: "Professional communication, strong visuals and clear user guidance.",
        skill: "Brand impact, content structure, web conception.",
      },
      it: {
        desc: "Presenza web di alta qualità con focus su fiducia, immagini e video forti e presentazione chiara dei servizi.",
        highlight: "Comunicazione professionale, immagini forti e guida utente chiara.",
        skill: "Impatto del brand, struttura dei contenuti, concezione web.",
      },
    },
    "gallace-all-in-maler.ch": {
      de: {
        desc: "Klar strukturierter Auftritt für ein lokales KMU mit Fokus auf Dienstleistungen, Vertrauen und einfache Kontaktaufnahme.",
        highlight: "Direkter Weg vom Interesse zur Anfrage.",
        skill: "KMU-Webdesign, Angebotsstruktur, Anfrageführung.",
      },
      en: {
        desc: "Clearly structured presence for a local SME focused on services, trust and easy contact.",
        highlight: "Direct path from interest to enquiry.",
        skill: "SME web design, offer structure, enquiry flow.",
      },
      it: {
        desc: "Presenza strutturata per una PMI locale con focus su servizi, fiducia e contatto semplice.",
        highlight: "Percorso diretto dall'interesse alla richiesta.",
        skill: "Web design PMI, struttura offerte, gestione richieste.",
      },
    },
    "360clean.ch / Offertenformular": {
      de: {
        desc: "Mehrstufiges Offertenformular mit geführtem Anfrageprozess und klarer Nutzerführung.",
        highlight: "Schritt-für-Schritt-Erlebnis, bessere Orientierung und eine niedrigere Hürde für Anfragen.",
        skill: "Anfrageprozess, Nutzerführung, Optimierung der Anfragequote.",
      },
      en: {
        desc: "Multi-step quote form with guided enquiry process and clear user flow.",
        highlight: "Step-by-step experience, better orientation and lower barrier to enquiry.",
        skill: "Enquiry process, user guidance, enquiry rate optimisation.",
      },
      it: {
        desc: "Modulo preventivo multi-step con processo guidato e chiara guida utente.",
        highlight: "Esperienza passo dopo passo, migliore orientamento e barriera più bassa.",
        skill: "Processo richieste, guida utente, ottimizzazione conversione.",
      },
    },
    "awarillo.ch": {
      de: {
        desc: "Digitaler Markenauftritt mit reduzierter visueller Linie und klarer Wiedererkennung.",
        highlight: "Konsistenter Look, moderne Präsentation und klare Positionierung.",
        skill: "Markenführung, digitale Markenkommunikation, einheitliche Gestaltung.",
      },
      en: {
        desc: "Digital brand presence with a reduced visual line and clear recognition.",
        highlight: "Consistent look, modern presentation and clear positioning.",
        skill: "Brand leadership, digital brand communication, unified design.",
      },
      it: {
        desc: "Presenza di marca digitale con linea visiva ridotta e chiaro riconoscimento.",
        highlight: "Look coerente, presentazione moderna e posizionamento chiaro.",
        skill: "Gestione brand, comunicazione digitale, design uniforme.",
      },
    },
    "chesa-cherma.ch": {
      de: {
        desc: "Atmosphärischer Auftritt mit starker Bildsprache und klarer Story rund um Erlebnis und Aufenthalt.",
        highlight: "Atmosphäre und Premium-Eindruck in Bild und Story, ergänzt durch eine direkte Terminbuchung über den Kalendereintrag.",
        skill: "Experience-Design, Bildführung, Premium-Wahrnehmung und klare Buchungslogik.",
      },
      en: {
        desc: "Atmospheric presence with strong imagery and a clear story around experience and stay.",
        highlight: "Atmosphere and premium feel in image and story, plus direct booking via calendar.",
        skill: "Experience design, visual guidance, premium perception and clear booking logic.",
      },
      it: {
        desc: "Presenza atmosferica con forte immaginario e storia chiara su esperienza e soggiorno.",
        highlight: "Atmosfera e impressione premium in immagini e storia, con prenotazione diretta.",
        skill: "Experience design, guida visiva, percezione premium e logica di prenotazione.",
      },
    },
    "lbmm.ch": {
      de: {
        desc: "Diese Website überzeugt durch klare Struktur, modernes Design und eine hochwertige Gesamtwirkung.",
        highlight: "Übersichtliche Darstellung der Dienstleistungen und ein ruhiger, professioneller Aufbau.",
        skill: "Strukturierte Angebotspräsentation, modernes Webdesign, klare Informationsführung.",
      },
      en: {
        desc: "This website convinces with clear structure, modern design and a high-quality overall impression.",
        highlight: "Clear presentation of services and a calm, professional layout.",
        skill: "Structured offer presentation, modern web design, clear information flow.",
      },
      it: {
        desc: "Questo sito convince con struttura chiara, design moderno e impressione complessiva di alta qualità.",
        highlight: "Presentazione chiara dei servizi e impostazione calma e professionale.",
        skill: "Presentazione offerte strutturata, web design moderno, flusso informativo chiaro.",
      },
    },
    Sanitrend: {
      de: { desc: "Mehrstufiges Leadformular für Sanitär, Badumbau und Sanierung · klar geführt und conversion-orientiert." },
      en: { desc: "Multi-step lead form for plumbing, bathroom renovation and refurbishment · clearly guided and conversion-oriented." },
      it: { desc: "Modulo lead multi-step per idraulica, ristrutturazione bagno e sanitaria · guidato e orientato alla conversione." },
    },
    "Dein Umzug Deal": {
      de: { desc: "Geführtes Umzugsformular mit klarer Schrittfolge, Vertrauenselementen und strukturierter Offertenanfrage." },
      en: { desc: "Guided moving form with clear steps, trust elements and structured quote request." },
      it: { desc: "Modulo trasloco guidato con passi chiari, elementi di fiducia e richiesta preventivo strutturata." },
    },
    "ART Reinigungen & Hauswartungen": {
      de: { desc: "Anfrageformular für Reinigung und Hauswartung · professionell, übersichtlich und vertrauenswürdig aufgebaut." },
      en: { desc: "Enquiry form for cleaning and property care · professional, clear and trustworthy." },
      it: { desc: "Modulo richiesta per pulizie e manutenzione · professionale, chiaro e affidabile." },
    },
    "iDEAL Umzüge": {
      de: { desc: "Umzugs-Leadformular mit moderner UI, klarer Nutzerführung und fokussierter Offertenanfrage." },
      en: { desc: "Moving lead form with modern UI, clear user guidance and focused quote request." },
      it: { desc: "Modulo lead trasloco con UI moderna, guida utente chiara e richiesta preventivo mirata." },
    },
    "DT-Cleaning": {
      de: { desc: "Leadformular für Autopflege und Fahrzeugreinigung · strukturiert, mobil optimiert und conversion-stark." },
      en: { desc: "Lead form for car care and vehicle cleaning · structured, mobile-optimised and conversion-strong." },
      it: { desc: "Modulo lead per cura auto e pulizia veicoli · strutturato, mobile e orientato alla conversione." },
    },
    "Spitex Xundheit Plus": {
      de: { desc: "Pflege- und Spitex-Anfrageformular mit empathischer Führung, klarer Struktur und Vertrauensaufbau." },
      en: { desc: "Care and home nursing enquiry form with empathetic guidance, clear structure and trust building." },
      it: { desc: "Modulo richiesta assistenza domiciliare con guida empatica, struttura chiara e costruzione fiducia." },
    },
    "ad-res": {
      de: { desc: "Digitale Visitenkarte mit klarem Markenauftritt und schnellem Kontaktzugang." },
      en: { desc: "Digital business card with clear brand presence and fast contact access." },
      it: { desc: "Biglietto da visita digitale con presenza di marca chiara e accesso rapido al contatto." },
    },
    "bodenbelaege-hajdari": {
      de: { desc: "Kompakter Auftritt für Bodenbeläge mit Leistungsfokus und direkter Erreichbarkeit." },
      en: { desc: "Compact presence for flooring with service focus and direct reachability." },
      it: { desc: "Presenza compatta per pavimenti con focus sui servizi e raggiungibilità diretta." },
    },
    "burgunder-handwerk": {
      de: { desc: "Handwerklich geprägte digitale Karte mit Vertrauen und klarer Kontaktlogik." },
      en: { desc: "Craftsman-style digital card with trust and clear contact logic." },
      it: { desc: "Scheda digitale artigianale con fiducia e logica di contatto chiara." },
    },
    "chesa-cherma": {
      de: { desc: "Atmosphärische Visitenkarte mit Premium-Charakter und Buchungsbezug." },
      en: { desc: "Atmospheric business card with premium character and booking link." },
      it: { desc: "Biglietto da visita atmosferico con carattere premium e collegamento prenotazione." },
    },
    "haller-design": {
      de: { desc: "Design-orientierte digitale Karte mit klarer visueller Linie." },
      en: { desc: "Design-oriented digital card with a clear visual line." },
      it: { desc: "Scheda digitale orientata al design con linea visiva chiara." },
    },
    "kita-wundersterne": {
      de: { desc: "Warme, vertrauensvolle Visitenkarte für eine Kita mit klaren Infos für Eltern." },
      en: { desc: "Warm, trustworthy business card for a daycare with clear info for parents." },
      it: { desc: "Biglietto da visita caldo e affidabile per un asilo con info chiare per i genitori." },
    },
  };

  function cardKey(card) {
    var h3 = card.querySelector("h3");
    return h3 ? h3.textContent.trim() : "";
  }

  function findProjectPack(key) {
    if (PROJECTS[key]) return PROJECTS[key];
    var norm = key.toLowerCase().replace(/\s+/g, " ").trim();
    var k;
    for (k in PROJECTS) {
      if (k.toLowerCase() === norm) return PROJECTS[k];
    }
    return null;
  }

  function setBlockWithLabel(p, label, text) {
    if (!p || !text) return;
    var strong = p.querySelector("strong");
    if (strong) {
      strong.textContent = label;
      var next = strong.nextSibling;
      while (next) {
        var rm = next;
        next = next.nextSibling;
        p.removeChild(rm);
      }
      p.appendChild(document.createTextNode(text));
    } else {
      p.textContent = text;
    }
  }

  function applyProjectCards(doc, lang) {
    var ui =
      (window.WeltenTranslations && window.WeltenTranslations.langPack(UI, lang)) || UI[lang] || UI.de;
    doc.querySelectorAll("#slide-projects .project-card:not(.project-card--service)").forEach(function (card) {
      var key = cardKey(card);
      var pack = findProjectPack(key);
      if (!pack) return;
      var copy = projectLang(pack, lang);
      var blocks = card.querySelectorAll("p.block");
      if (blocks[0] && copy.desc) blocks[0].textContent = copy.desc;
      if (blocks[1] && copy.highlight) setBlockWithLabel(blocks[1], ui.highlight, copy.highlight);
      if (blocks[2] && copy.skill) setBlockWithLabel(blocks[2], ui.skill, copy.skill);
      var btn = card.querySelector(".btn-open");
      if (btn) {
        var isDemo = (btn.getAttribute("href") || "").indexOf("leadformulare") >= 0;
        btn.textContent = isDemo ? ui.demo : ui.open;
      }
      card.querySelectorAll("iframe[title]").forEach(function (iframe) {
        var t = iframe.getAttribute("title") || "";
        if (t.indexOf("Vorschau") === 0 || t.indexOf("Preview") === 0 || t.indexOf("Anteprima") === 0 || t.indexOf("Aperçu") === 0) {
          var name = t.replace(/^(Vorschau|Preview|Anteprima|Aperçu)\s*/i, "").trim() || key;
          iframe.setAttribute("title", ui.preview + " " + name);
        }
      });
    });
  }

  function extendI18n() {
    if (!window.WeltenPreviewI18n || window.WeltenPreviewI18n.__projectsExtended) return;
    var orig = window.WeltenPreviewI18n.apply;
    window.WeltenPreviewI18n.apply = function (doc, lang) {
      orig(doc, lang);
      applyProjectCards(doc, lang);
    };
    window.WeltenPreviewI18n.__projectsExtended = true;
  }

  function boot() {
    extendI18n();
    document.addEventListener("welten-lang-change", function (e) {
      var lang = (e && e.detail && e.detail.lang) || "de";
      applyProjectCards(document, lang);
    });
  }

  if (window.WeltenPreviewI18n) boot();
  else if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  window.WeltenProjectsI18n = { apply: applyProjectCards, UI: UI, PROJECTS: PROJECTS };
})();
