/**
 * Werdegang (CV) — single source of truth for all four worlds.
 * Renders into <div data-v2-cv data-world="…">. Must load before the
 * world script so its reveal binders and the -fx layers pick up the markup.
 */
(function (root) {
  "use strict";

  var CV = {
    work: [
      {
        when: "07/2024 – Heute",
        org: "DIGITAL PLUS GmbH, Dietikon",
        role: "Marketing & Key Account Mitarbeiter (80 %)",
        current: true,
        desc: "Schnittstelle von Kundenmanagement, Marketing und Kommunikation. Selbstständige Betreuung der Key Accounts und Begleitung von Kundenprojekten von der Analyse über das Konzept bis zur Umsetzung.",
        points: [
          "Strategische Beratung von Bestandskunden, Neukundenakquise und Upselling",
          "Konzeption, Design und Umsetzung von Websites (Struktur, Funktionen, Content)",
          "Branding & Rebranding sowie digitale und klassische Marketingmaterialien",
          "Suchmaschinenoptimierung (SEO) und Optimierung der Online-Präsenz",
          "Netzwerk- und Kundenevents, Mailings und Kundenkommunikation",
          "Mitarbeit an internen Leitfäden, Projektstrukturen sowie Onboarding- und Kundenprozessen",
        ],
        proof: "Zwischenzeugnis 03/2026: «stets sehr zufrieden»",
      },
      {
        when: "09/2011 – 12/2023",
        org: "Ledergerber Mode, Baden & Zürich",
        role: "Polydesigner 3D / Visual Merchandising Coordinator",
        desc: "Verantwortung für das Visual Merchandising aller Geschäfte. Zuerst im Zweierteam, ab 2017 allein verantwortlich und immer abgestimmt mit Einkauf und Werbeplanung.",
        points: [
          "Planung und Umsetzung der VM-Konzepte in allen Filialen, innen und in den Schaufenstern",
          "Themenorientierte Inszenierung der Kollektionen am POS, Aktionsflächen anhand von Abverkaufsanalysen",
          "Umstellplanung mit den Verkaufsteams, Lagerverkäufe sowie Schliessungen und Wiedereröffnungen von Filialen",
          "Kostenoptimierte Materialbeschaffung, VM-Lager und Kontaktpflege zu Lieferanten und Labels",
          "Plotten von Preisen, Labels und Sujets; Gestaltung mit Photoshop, InDesign und Office",
          "Mitbetreuung der Polydesign-3D-Lernenden",
        ],
        proof: "Zeugnis: verantwortungsbewusst, lösungsorientiert, flexibel",
      },
      {
        when: "11/2010 – 08/2011",
        org: "Tommy Hilfiger, Schweiz & Österreich",
        role: "Visual Merchandising Coordinator Retail",
        desc: "Verantwortung für die Umsetzung der Corporate Identity und der Visual-Merchandising-Standards in den Stores in der Schweiz und Österreich.",
        points: [
          "Umsetzung von Visual-Merchandising-Updates und der gesamten Warenpräsentation",
          "Einhaltung der VM-Guidelines in allen Stores",
          "Mithilfe bei Organisation und Durchführung von Store Openings und Refits",
          "Training der Mitarbeitenden für eine eigenständige Umsetzung der Guidelines",
          "Materialbestellung",
        ],
        proof: "Zeugnis: «stets zu unserer vollen Zufriedenheit»",
      },
      {
        when: "08/2007 – 11/2010",
        org: "Hennes & Mauritz",
        role: "Polydesigner 3D / Visual Merchandising Coordinator",
        desc: "Visual Merchandiser in den Stores Luzern, Emmen und Zug. Zuvor seit 2004 als Sales Advisor und ab 2005 als Department Manager bei H&M tätig.",
        points: [
          "Warenpräsentation und -promotion auf der Verkaufsfläche und in den Schaufenstern",
          "Koordination zwischen Visual Team und Verkaufsabteilungen",
          "Innendekoration mit Preisbeschriftungen, Büsten und Postern",
          "Ausbildung der Sales Advisors in der Warenpräsentation",
          "Als Department Manager: Preisreduktionen, Lager- und Sortimentskontrolle, Meetings und Kassenrapport",
        ],
        proof: "Zeugnis: «zu unserer vollen Zufriedenheit»",
      },
      {
        when: "08/2002 – 08/2004",
        org: "Boutique Clochard, Zug",
        role: "Mitarbeiter Detailhandel",
        desc: "Zweijährige Lehre als Mode-Verkäufer in der Boutique Clochard (Putt AG). Hier hat alles angefangen: Kundenkontakt, Stilgefühl und Sortimentskenntnis.",
        points: [
          "Beratung und Verkauf im geprüften Bereich Damenoberbekleidung",
          "Fundierte Kenntnisse im Herren-Sportswear-Bereich",
          "Überblick über das gesamte Sortiment einer grossen Boutique",
          "Zuverlässige, selbstständige Mitarbeit im Team und im Kundenkontakt",
        ],
        proof: "Lehrabschluss mit Note 5.0",
      },
    ],
    education: [
      {
        when: "10/2026 – 05/2027",
        title: "Lehrgang Online Marketing Manager",
        org: "Zentrum Bildung, Baden",
        note: "Berufsbegleitende Weiterbildung, laufend",
        live: true,
      },
      {
        when: "2024 – Heute",
        title: "Digitale Technologien, Webdesign & Online Marketing",
        org: "Digital Plus GmbH / Selbststudium und interne Weiterbildung",
        points: [
          "WordPress und weitere Content Management Systeme (CMS)",
          "Websitegestaltung, Contentpflege und digitale Kundenlösungen",
          "Suchmaschinenoptimierung (SEO) und Online Marketing",
          "KI-Anwendungen, Prompt Engineering und digitale Automatisierung",
          "Microsoft Office mit Excel, Word und PowerPoint",
          "Canva und digitale Designvorlagen",
        ],
      },
      {
        when: "10/2024 – 03/2026",
        title: "Ausbildung Assistent Marketing & Marketingfachmann",
        org: "WSF Wirtschaftsschule Five, Sursee",
      },
      {
        when: "2018 – 2023",
        title: "Digital Design, Grafiksoftware & visuelle Kommunikation",
        org: "Praxisorientierte Weiterbildung im Berufsalltag / Selbststudium",
        points: [
          "Adobe Photoshop und InDesign",
          "Gestaltung von Werbemitteln, Präsentationen und Marketingmaterialien",
          "Bildbearbeitung, Layoutgestaltung und Druckdatenaufbereitung",
        ],
      },
      {
        when: "2013 – 2018",
        title: "Werbetechnik, Plottertechnik & kreative Produktion",
        org: "Ledergerber Mode, Baden & Zürich",
        points: [
          "Plottertechnik und Verarbeitung von Schneidefolien",
          "Gestaltung, Herstellung und Zuschnitt individueller Sticker und Beschriftungen",
          "Entwicklung von Werbegrafiken und visuellen Gestaltungskonzepten",
          "Praxiswissen in Druckvorbereitung und Materialverarbeitung",
        ],
      },
      { when: "2012", title: "Weiterbildung zum Lehrmeister", org: "EBZ" },
      { when: "2007 – 2008", title: "Ausbildung als Dekorationsgestalter & Visual Merchandiser", org: "Interne Ausbildung H&M, Luzern" },
      { when: "2002 – 2004", title: "Ausbildung Detailhandel (EFZ)", org: "Kaufmännisches Bildungszentrum, Zug" },
    ],
    skills: [
      { label: "Digital Marketing & Web", items: ["WordPress", "CMS", "SEO", "Online Marketing", "Websitepflege", "Digitale Kundenkommunikation"] },
      { label: "Grafik & Gestaltung", items: ["Adobe Photoshop", "InDesign", "Canva", "Layoutgestaltung", "Branding", "Werbemittelproduktion"] },
      { label: "Technologie & KI", items: ["Generative KI", "Prompt Engineering", "KI-gestützte Content-Erstellung", "Digitale Arbeitstools"] },
      { label: "Office & Organisation", items: ["Microsoft Excel", "Word", "PowerPoint", "Präsentationserstellung", "Datenorganisation"] },
      {
        label: "Produktion & Visual Merchandising",
        items: ["Plottertechnik", "Folienbeschriftung", "Druckvorbereitung", "Schaufenstergestaltung", "Visuelle Warenpräsentation"],
      },
    ],
  };

  var STATS = [
    { label: "Im Beruf seit", value: "2002" },
    { label: "Berufliche Stationen", value: String(CV.work.length) },
    { label: "Aus- & Weiterbildungen", value: String(CV.education.length) },
    { label: "Kompetenzfelder", value: String(CV.skills.length) },
  ];

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function list(arr, fn) {
    return arr.map(fn).join("");
  }
  function pad(i) {
    return ("0" + (i + 1)).slice(-2);
  }

  /* —— NEXORA: system log (reuses nexora.css .nx-exp-* + nexora-fx hooks) —— */
  function nexora() {
    return (
      '<dl class="nx-exp-stats" data-reveal>' +
      list(STATS, function (s) {
        return "<div><dt>" + esc(s.label) + "</dt><dd>" + esc(s.value) + "</dd></div>";
      }) +
      "</dl>" +
      '<div class="nx-exp-grid">' +
      '<div class="nx-exp-block nx-exp-block--wide" data-reveal><header><span class="nx-mono">LOG.A</span><h3>Berufserfahrung</h3></header>' +
      (function () {
        /* Two independent columns (left: 1st, 2nd, 4th · right: 3rd, 5th) so the right
           column starts level with the current job; --o restores chronology on mobile */
        function entry(w, i) {
          return (
            "<li" + (w.current ? ' class="nx-tl--live"' : "") + ' style="--o:' + i + '"><time>' + esc(w.when) +
            (w.current ? ' <span class="nx-badge nx-badge--live">AKTIV</span>' : "") +
            "</time><strong>" + esc(w.org) + '</strong><p class="nxcv-role">' + esc(w.role) + "</p>" +
            (w.desc ? "<p>" + esc(w.desc) + "</p>" : "") +
            (w.points ? '<ul class="nxcv-points">' + list(w.points, function (p) { return "<li>" + esc(p) + "</li>"; }) + "</ul>" : "") +
            (w.proof ? '<p class="nxcv-proof">' + esc(w.proof) + "</p>" : "") +
            "</li>"
          );
        }
        var left = [];
        var right = [];
        CV.work.forEach(function (w, i) {
          (i === 2 || i === 4 ? right : left).push(entry(w, i));
        });
        return '<div class="nxcv-twocol"><ol class="nx-timeline">' + left.join("") + '</ol><ol class="nx-timeline">' + right.join("") + "</ol></div>";
      })() +
      "</div>" +
      '<div class="nx-exp-block nx-exp-block--wide" data-reveal><header><span class="nx-mono">LOG.B</span><h3>Bildungsweg &amp; Weiterbildungen</h3></header>' +
      '<ol class="nx-timeline nxcv-grid">' +
      list(CV.education, function (e) {
        return (
          "<li" + (e.live ? ' class="nx-tl--live"' : "") + "><time>" + esc(e.when) +
          (e.live ? ' <span class="nx-badge nx-badge--live">LÄUFT</span>' : "") +
          "</time><strong>" + esc(e.title) + "</strong><p>" + esc(e.org) +
          (e.note ? " · " + esc(e.note) : "") + "</p>" +
          (e.points ? '<ul class="nxcv-points">' + list(e.points, function (p) { return "<li>" + esc(p) + "</li>"; }) + "</ul>" : "") +
          "</li>"
        );
      }) +
      "</ol></div>" +
      '<div class="nx-exp-block nx-exp-block--wide" data-reveal><header><span class="nx-mono">LOG.C</span><h3>Zusätzliche Fachkompetenzen</h3></header>' +
      '<div class="nxcv-skills">' +
      list(CV.skills, function (s, i) {
        return (
          '<div><span class="nx-mono">SKL.' + pad(i) + " · " + esc(s.label) + "</span>" +
          '<ul class="nx-chips">' + list(s.items, function (it) { return "<li>" + esc(it) + "</li>"; }) + "</ul></div>"
        );
      }) +
      "</div></div>" +
      "</div>"
    );
  }

  /* —— MULTIVERSUM / PROFESSIONAL / FREIRAUM: shared structure, own skins (v2-cv.css) —— */
  function generic(world) {
    var rv = world === "professional" ? ' class="pro-reveal"' : world === "freiraum" ? " data-v2-reveal" : "";
    var rvCls = world === "professional" ? " pro-reveal" : "";
    var rvAttr = world === "freiraum" ? " data-v2-reveal" : "";
    function item(o, i) {
      return (
        '<li class="cv-item' + (o.current ? " is-current" : "") + rvCls + '"' + rvAttr + ' style="--i:' + i + '">' +
        '<p class="cv-when">' + esc(o.when) + (o.badge ? ' <span class="cv-badge">' + esc(o.badge) + "</span>" : "") + "</p>" +
        '<div class="cv-body"><h4>' + esc(o.head) + "</h4>" +
        (o.sub ? '<p class="cv-sub">' + esc(o.sub) + "</p>" : "") +
        (o.desc ? '<p class="cv-desc">' + esc(o.desc) + "</p>" : "") +
        (o.note ? '<p class="cv-note">' + esc(o.note) + "</p>" : "") +
        (o.points ? '<ul class="cv-points">' + list(o.points, function (p) { return "<li>" + esc(p) + "</li>"; }) + "</ul>" : "") +
        (o.proof ? '<p class="cv-proof">' + esc(o.proof) + "</p>" : "") +
        "</div></li>"
      );
    }
    return (
      '<div class="cv cv--' + world + '">' +
      '<dl class="cv-stats"' + rv + ">" +
      list(STATS, function (s) {
        return "<div><dd>" + esc(s.value) + "</dd><dt>" + esc(s.label) + "</dt></div>";
      }) +
      "</dl>" +
      '<section class="cv-block cv-block--work" aria-label="Berufserfahrung">' +
      '<h3 class="cv-title"><span class="cv-title__n">01</span>Berufserfahrung</h3>' +
      '<ol class="cv-list">' +
      list(CV.work, function (w, i) {
        return item(
          { current: w.current, when: w.when, head: w.org, sub: w.role, desc: w.desc, points: w.points, proof: w.proof, badge: w.current ? "Aktuell" : "" },
          i
        );
      }) +
      "</ol></section>" +
      '<section class="cv-block cv-block--edu" aria-label="Bildungsweg und Weiterbildungen">' +
      '<h3 class="cv-title"><span class="cv-title__n">02</span>Bildungsweg &amp; Weiterbildungen</h3>' +
      '<ol class="cv-list">' +
      list(CV.education, function (e, i) {
        return item({ current: e.live, when: e.when, head: e.title, sub: e.org, note: e.note, points: e.points, badge: e.live ? "Laufend" : "" }, i);
      }) +
      "</ol></section>" +
      '<section class="cv-block cv-block--skills" aria-label="Zusätzliche Fachkompetenzen">' +
      '<h3 class="cv-title"><span class="cv-title__n">03</span>Zusätzliche Fachkompetenzen</h3>' +
      '<div class="cv-skills">' +
      list(CV.skills, function (s, i) {
        return (
          '<article class="cv-skill' + rvCls + '"' + rvAttr + ' style="--i:' + i + '"><h4>' + esc(s.label) + "</h4>" +
          '<ul class="cv-chips">' + list(s.items, function (it) { return "<li>" + esc(it) + "</li>"; }) + "</ul></article>"
        );
      }) +
      "</div></section>" +
      "</div>"
    );
  }

  function mount() {
    root.document.querySelectorAll("[data-v2-cv]").forEach(function (host) {
      if (host.__v2Cv) return;
      host.__v2Cv = true;
      var world = host.getAttribute("data-world") || "multiversum";
      host.innerHTML = world === "nexora" ? nexora() : generic(world);
    });
  }

  root.WeltenV2Cv = { data: CV, mount: mount };
  if (root.document.readyState === "loading") root.document.addEventListener("DOMContentLoaded", mount);
  else mount();
})(window);
