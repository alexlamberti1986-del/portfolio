/**
 * MULTIVERSUM — Welt-Collage v17 (Preview-Bilder ohne eingebettete Labels)
 */
(function () {
  "use strict";

  var PREVIEW = "assets/images/4welten-preview/";
  var ORBS = "assets/multiversum-v16/orbs/";
  var PAGES = {
    nexora: "NEXORA.html",
    professional: "PROFESSIONAL.html",
    freiraum: "FREIRAUM.html",
  };

  var CARD_SLUG = {
    home: "home",
    projects: "projekte",
    leistungen: "leistungen",
    about: "ueber-mich",
    contact: "kontakt",
  };

  var PREVIEW_FILES = {
    nexora: {
      home: "11_html_13_nexora_logo.webp",
      projects: "03_NEXORA_03_Projekte.webp",
      leistungen: "02_NEXORA_02_Leistungen.webp",
      about: "NEXORA PROFILBILD für HOME und Kontakt.png",
      contact: "04_NEXORA_04_Kontakt.webp",
    },
    professional: {
      home: "21_html_21_professional_logo.webp",
      projects: "03_PROFESSIONAL_03_Projekte.webp",
      leistungen: "02_PROFESSIONAL_02_Leistungen.webp",
      about: "PROFESSIONAL PROFILBILD für HOME und Kontakt.png",
      contact: "04_PROFESSIONAL_04_Kontakt.webp",
    },
    freiraum: {
      home: "21_html_29_freiraum_logo.webp",
      projects: "03_FREIRAUM_03_Projekte.webp",
      leistungen: "02_FREIRAUM_02_Leistungen.webp",
      about: "FREIRAUM PROFILBILD für HOME und Kontakt(1).png",
      contact: "04_FREIRAUM_04_Kontakt.webp",
    },
  };

  function previewPath(world, file) {
    return PREVIEW + world + "/" + encodeURIComponent(file);
  }

  function card(world, label, imagePath, go, target) {
    return {
      label: label,
      image: imagePath,
      world: world,
      go: go,
      target: target,
      href: PAGES[world] + (target || ""),
      cardSlug: CARD_SLUG[go] || go || "home",
    };
  }

  function worldCard(world, key, label, go, target) {
    var files = PREVIEW_FILES[world] || PREVIEW_FILES.nexora;
    return card(world, label, previewPath(world, files[key] || files.home), go, target);
  }

  function dedupeCards(cards) {
    var seen = new Set();
    return (cards || []).filter(function (c) {
      var key = [c.world || "", c.target || "", c.label || "", c.image || ""].join("|").toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function getCardLimit() {
    return 5;
  }

  var worldCards = {
    nexora: dedupeCards([
      worldCard("nexora", "home", "Home", "home", ""),
      worldCard("nexora", "projects", "Projekte", "projects", "#projekte"),
      worldCard("nexora", "leistungen", "Leistungen", "leistungen", "#leistungen"),
      worldCard("nexora", "about", "Über mich", "about", "#expertise"),
      worldCard("nexora", "contact", "Kontakt", "contact", "#kontakt"),
    ]),
    professional: dedupeCards([
      worldCard("professional", "home", "Home", "home", ""),
      worldCard("professional", "projects", "Projekte", "projects", "#projekte"),
      worldCard("professional", "leistungen", "Leistungen", "leistungen", "#leistungen"),
      worldCard("professional", "about", "Über mich", "about", "#expertise"),
      worldCard("professional", "contact", "Kontakt", "contact", "#kontakt"),
    ]),
    freiraum: dedupeCards([
      worldCard("freiraum", "home", "Home", "home", ""),
      worldCard("freiraum", "projects", "Projekte", "projects", "#projekte"),
      worldCard("freiraum", "leistungen", "Leistungen", "leistungen", "#leistungen"),
      worldCard("freiraum", "about", "Über mich", "about", "#expertise"),
      worldCard("freiraum", "contact", "Kontakt", "contact", "#kontakt"),
    ]),
  };

  window.MVWorldCollage = {
    version: 17,
    layout: "mindmap-petal",
    assetBase: PREVIEW,
    orbs: ORBS,
    pages: PAGES,
    worldCards: worldCards,
    cards: worldCards,
    dedupeCards: dedupeCards,
    getCardLimit: getCardLimit,
  };
})();
