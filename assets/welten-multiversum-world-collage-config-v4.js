/**
 * MULTIVERSUM V4 — vier Welten mit Parallax-Kartenbildern (Preview-Pfade, live-verifiziert)
 */
(function () {
  "use strict";

  var PREVIEW = "assets/images/4welten-preview/";
  var ORB_BASE = "assets/multiversum-parallax-v4/orbs/";
  var PAGES = {
    multiversum: "MULTIVERSUM.html",
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

  /* Preview-Ordner & Dateien — dieselben Pfade wie auf alexlamberti.ch erreichbar */
  var PREVIEW_FILES = {
    multiversum: {
      folder: "general",
      home: "03_html_05_general_logo.webp",
      projects: "05_MULTIVERSUM_05_Projekte.webp",
      leistungen: "03_MULTIVERSUM_03_Leistungen.webp",
      about: "01_MULTIVERSUM_01_UeberMich.webp",
      contact: "07_MULTIVERSUM_07_Kontakt.webp",
    },
    nexora: {
      folder: "nexora",
      home: "11_html_13_nexora_logo.webp",
      projects: "03_NEXORA_03_Projekte.webp",
      leistungen: "02_NEXORA_02_Leistungen.webp",
      about: "NEXORA PROFILBILD für HOME und Kontakt.png",
      contact: "04_NEXORA_04_Kontakt.webp",
    },
    professional: {
      folder: "professional",
      home: "21_html_21_professional_logo.webp",
      projects: "03_PROFESSIONAL_03_Projekte.webp",
      leistungen: "02_PROFESSIONAL_02_Leistungen.webp",
      about: "PROFESSIONAL PROFILBILD für HOME und Kontakt.png",
      contact: "04_PROFESSIONAL_04_Kontakt.webp",
    },
    freiraum: {
      folder: "freiraum",
      home: "21_html_29_freiraum_logo.webp",
      projects: "03_FREIRAUM_03_Projekte.webp",
      leistungen: "02_FREIRAUM_02_Leistungen.webp",
      about: "FREIRAUM PROFILBILD für HOME und Kontakt(1).png",
      contact: "04_FREIRAUM_04_Kontakt.webp",
    },
  };

  function previewPath(world, file) {
    var meta = PREVIEW_FILES[world] || PREVIEW_FILES.nexora;
    var folder = meta.folder || world;
    return PREVIEW + folder + "/" + encodeURIComponent(file);
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
    var meta = PREVIEW_FILES[world] || PREVIEW_FILES.nexora;
    return card(world, label, previewPath(world, meta[key] || meta.home), go, target);
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
    multiversum: dedupeCards([
      card("multiversum", "Home", ORB_BASE + "Multiversum.png", "home", ""),
      worldCard("multiversum", "projects", "Projekte", "projects", "#projekte"),
      worldCard("multiversum", "leistungen", "Leistungen", "leistungen", "#leistungen"),
      worldCard("multiversum", "about", "Über mich", "about", "#ueber-mich"),
      worldCard("multiversum", "contact", "Kontakt", "contact", "#kontakt"),
    ]),
    nexora: dedupeCards([
      card("nexora", "Home", ORB_BASE + "Nexora.png", "home", ""),
      worldCard("nexora", "projects", "Projekte", "projects", "#projekte"),
      worldCard("nexora", "leistungen", "Leistungen", "leistungen", "#leistungen"),
      worldCard("nexora", "about", "Über mich", "about", "#ueber-mich"),
      worldCard("nexora", "contact", "Kontakt", "contact", "#kontakt"),
    ]),
    professional: dedupeCards([
      card("professional", "Home", ORB_BASE + "Professional_new_new.png", "home", ""),
      worldCard("professional", "projects", "Projekte", "projects", "#projekte"),
      worldCard("professional", "leistungen", "Leistungen", "leistungen", "#leistungen"),
      worldCard("professional", "about", "Über mich", "about", "#ueber-mich"),
      worldCard("professional", "contact", "Kontakt", "contact", "#kontakt"),
    ]),
    freiraum: dedupeCards([
      card("freiraum", "Home", ORB_BASE + "Freiraum.png", "home", ""),
      worldCard("freiraum", "projects", "Projekte", "projects", "#projekte"),
      worldCard("freiraum", "leistungen", "Leistungen", "leistungen", "#leistungen"),
      worldCard("freiraum", "about", "Über mich", "about", "#ueber-mich"),
      worldCard("freiraum", "contact", "Kontakt", "contact", "#kontakt"),
    ]),
  };

  window.MVWorldCollage = {
    version: 4,
    layout: "mindmap-petal",
    assetBase: PREVIEW,
    orbs: ORB_BASE,
    pages: PAGES,
    worldCards: worldCards,
    cards: worldCards,
    dedupeCards: dedupeCards,
    getCardLimit: getCardLimit,
  };
})();
