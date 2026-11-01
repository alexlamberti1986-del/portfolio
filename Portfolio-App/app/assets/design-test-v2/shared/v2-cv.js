/**
 * Werdegang (CV) — single source of truth for all four worlds.
 * Renders into <div data-v2-cv data-world="…">. Must load before the
 * world script so its reveal binders and the -fx layers pick up the markup.
 */
(function (root) {
  "use strict";

  var CV = {
    work: [
      { when: "07/2024 – Heute", org: "DIGITAL PLUS GmbH, Dietikon", role: "Marketing & Key Account Mitarbeiter (80 %)", current: true },
      { when: "09/2011 – 12/2023", org: "Ledergerber Mode, Baden & Zürich", role: "Polydesigner 3D / Visual Merchandising Coordinator" },
      { when: "11/2010 – 08/2011", org: "Tommy Hilfiger, Schweiz & Österreich", role: "Visual Merchandising Coordinator Retail" },
      { when: "08/2007 – 11/2010", org: "Hennes & Mauritz", role: "Polydesigner 3D / Visual Merchandising Coordinator" },
      { when: "08/2002 – 08/2004", org: "Boutique Clochard, Zug", role: "Mitarbeiter Detailhandel" },
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
      '<div class="nx-exp-block" data-reveal><header><span class="nx-mono">LOG.A</span><h3>Berufserfahrung</h3></header>' +
      '<ol class="nx-timeline">' +
      list(CV.work, function (w) {
        return (
          "<li" + (w.current ? ' class="nx-tl--live"' : "") + "><time>" + esc(w.when) +
          (w.current ? ' <span class="nx-badge nx-badge--live">AKTIV</span>' : "") +
          "</time><strong>" + esc(w.org) + "</strong><p>" + esc(w.role) + "</p></li>"
        );
      }) +
      "</ol></div>" +
      '<div class="nx-exp-block" data-reveal><header><span class="nx-mono">LOG.B</span><h3>Bildungsweg &amp; Weiterbildungen</h3></header>' +
      '<ol class="nx-timeline">' +
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
    function item(cls, when, head, sub, note, points, badge, i) {
      return (
        '<li class="cv-item' + cls + rvCls + '"' + rvAttr + ' style="--i:' + i + '">' +
        '<p class="cv-when">' + esc(when) + (badge ? ' <span class="cv-badge">' + esc(badge) + "</span>" : "") + "</p>" +
        '<div class="cv-body"><h4>' + esc(head) + "</h4>" +
        (sub ? '<p class="cv-sub">' + esc(sub) + "</p>" : "") +
        (note ? '<p class="cv-note">' + esc(note) + "</p>" : "") +
        (points ? '<ul class="cv-points">' + list(points, function (p) { return "<li>" + esc(p) + "</li>"; }) + "</ul>" : "") +
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
        return item(w.current ? " is-current" : "", w.when, w.org, w.role, "", null, w.current ? "Aktuell" : "", i);
      }) +
      "</ol></section>" +
      '<section class="cv-block cv-block--edu" aria-label="Bildungsweg und Weiterbildungen">' +
      '<h3 class="cv-title"><span class="cv-title__n">02</span>Bildungsweg &amp; Weiterbildungen</h3>' +
      '<ol class="cv-list">' +
      list(CV.education, function (e, i) {
        return item(e.live ? " is-current" : "", e.when, e.title, e.org, e.note || "", e.points || null, e.live ? "Laufend" : "", i);
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
