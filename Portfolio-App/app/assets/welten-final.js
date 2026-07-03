/**
 * Welten Final · Home-Kurzvorstellung, Kontakt minimal, Buttons, Welten-Persönlichkeit
 */
(function () {
  "use strict";

  var TEL = "+41796678211";
  var TEL_DISP = "079 667 82 11";
  var MAIL = "alex.lamberti@hotmail.ch";

  var HOME_INTRO = {
    nexora:
      "Ich gestalte digitale Markenwelten, in denen Strategie sichtbar wird und Technologie menschlich wirkt. " +
      "Mein Schwerpunkt liegt auf Branding, Websites, digitalen Erlebnissen und klarer Strategie · von der ersten Idee bis zur Umsetzung, die Vertrauen schafft und Orientierung gibt. " +
      "Gute Kommunikation braucht heute mehr als schöne Gestaltung: Sie braucht Struktur, Relevanz und ein Verständnis dafür, wie Menschen online suchen, vergleichen und Entscheidungen treffen. " +
      "Genau hier setze ich an. Ich verbinde kreatives Denken mit digitalem Systemverständnis und entwickle Auftritte, die professionell wirken, schnell laden und präzise führen. " +
      "Ob Markenauftritt, Website, Content-Struktur oder digitale Kampagne · ich denke Projekte ganzheitlich: Positionierung, Nutzerführung, SEO, Conversion und technische Umsetzung greifen ineinander. " +
      "Besonders spannend finde ich Lösungen, die Prozesse vereinfachen, Marken sichtbarer machen und neue Technologien sinnvoll einbinden. " +
      "Mein Ziel ist ein digitales Erlebnis, das hochwertig, klar und zukunftsfähig ist · nicht wie eine Standard-Agenturseite, sondern wie eine bewusst gestaltete Markenwelt.",
    vertex:
      "Ich entwickle digitale Markenauftritte mit Fokus auf Vertrauen, Klarheit und messbare Wirkung. " +
      "Branding, Websites, digitale Erlebnisse und Strategie gehören für mich zusammen · weil starke Kommunikation nur dann überzeugt, wenn Inhalt, Struktur und Gestaltung aufeinander abgestimmt sind. " +
      "Unternehmen brauchen heute mehr als eine schöne Website. Sie brauchen einen Auftritt, der Kompetenz zeigt, Entscheidungen erleichtert und langfristig funktioniert. " +
      "Genau dafür stehe ich: Ich übersetze Ziele in klare digitale Konzepte · von der Positionierung über die Nutzerführung bis zur technischen Umsetzung. " +
      "Meine Arbeit verbindet Marketingverständnis, Designpräzision und Umsetzungsstärke. Ob Website, Content, Leadformular oder Markenauftritt · ich denke in Prozessen, Nutzerwegen und konkreten Ergebnissen. " +
      "Ich lege Wert auf saubere Strukturen, verständliche Botschaften und einen professionellen Gesamteindruck, der Vertrauen schafft. " +
      "Die Website soll sich nicht wie ein generisches Portfolio anfühlen, sondern wie eine hochwertige digitale Visitenkarte mit Substanz · klar, ruhig, kompetent und auf den Punkt.",
    freiraum:
      "Ich gestalte digitale Welten mit Gefühl, Haltung und einer klaren visuellen Sprache. " +
      "Branding, Websites, digitale Erlebnisse und Strategie sind für mich kein Nebeneinander, sondern ein Zusammenspiel aus Emotion, Storytelling und durchdachter Umsetzung. " +
      "Gute Markenkommunikation entsteht, wenn Menschen etwas fühlen · und gleichzeitig verstehen, worum es geht. Genau diese Balance suche ich in jedem Projekt. " +
      "Ich entwickle Auftritte, die nicht austauschbar wirken: mit Charakter, mit Rhythmus, mit Bildern und Worten, die eine Geschichte erzählen. " +
      "Ob Website, Content, Kampagne oder Markeninszenierung · ich denke kreativ, aber immer mit Blick auf Wirkung, Nutzerführung und digitale Sichtbarkeit. " +
      "Mir ist wichtig, dass Design nicht nur schön ist, sondern Bedeutung transportiert und Marken erlebbar macht. " +
      "Diese Website ist bewusst als digitales Erlebnis gedacht: weniger Standardlayout, mehr Atmosphäre, mehr Persönlichkeit · und trotzdem klar, professionell und zielgerichtet.",
  };

  function worldKey() {
    var w = (document.body && document.body.getAttribute("data-world")) || "nexora";
    if (w === "general") return "general";
    if (w === "vertex") return "vertex";
    if (w === "freiraum") return "freiraum";
    return "nexora";
  }

  function injectHomeIntro() {
    /* Home-Inhalt aus FINAL HTML · kein zusätzlicher Intro-Block */
  }

  function fixHomeButtons() {
    var lang = "de";
    try {
      lang = localStorage.getItem("mv-preview-lang") || sessionStorage.getItem("mv-preview-lang") || "de";
    } catch (e) {}
    if (lang !== "de") return;
    document.querySelectorAll('#slide-home .cta-row button[data-go="about"]').forEach(function (btn) {
      if (btn.textContent.indexOf("Mehr") >= 0) btn.textContent = "Über mich";
    });
  }

  function rebuildContactMinimal() {
    /* FINAL contact-layout · siehe welten-final-restore.js */
  }

  function unifyTextLinks() {
    if (document.body.getAttribute("data-world") === "general") return;
    document.querySelectorAll(".btn-open, a.btn-open").forEach(function (a) {
      a.classList.add("welten-textlink");
      a.classList.remove("btn");
    });
    document.querySelectorAll(".btn:not(.btn-primary):not(.btn-menu):not(.btn-close)").forEach(function (btn) {
      if (btn.closest(".cta-row") || btn.closest(".welten-cta-band")) return;
      if (btn.classList.contains("projects-accordion__trigger")) return;
      if (btn.classList.contains("experience-step")) return;
      if (btn.classList.contains("dna-slide")) return;
    });
  }

  function applyWorldPersonality() {
    ["nexora", "vertex", "freiraum", "general"].forEach(function (k) {
      document.body.classList.remove("welten-personality--" + k);
    });
    var key = worldKey();
    if (key) document.body.classList.add("welten-personality--" + key);
  }

  function apply() {
    injectHomeIntro();
    fixHomeButtons();
    rebuildContactMinimal();
    unifyTextLinks();
    applyWorldPersonality();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }

  document.addEventListener("welten-chapter-change", function (e) {
    if (e.detail && e.detail.chapter === "contact") rebuildContactMinimal();
  });
})();
