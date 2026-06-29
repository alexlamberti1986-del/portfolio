/**
 * MULTIVERSUM V4 — vier Welten mit Parallax-Kartenbildern (lokaler Test)
 */
(function () {
  "use strict";

  var CARD_BASE = "assets/multiversum-parallax-v4/cards/";
  var ORB_BASE = "assets/multiversum-parallax-v4/orbs/";
  var PREVIEW = "assets/images/4welten-preview/";
  var V = "?v=20260629mv-v4live";

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

  function cardPath(world, file) {
    return CARD_BASE + world + "/" + file + V;
  }

  function previewPath(world, file) {
    return PREVIEW + world + "/" + encodeURIComponent(file) + V;
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
      card("multiversum", "Home", ORB_BASE + "Multiversum.png" + V, "home", ""),
      card("multiversum", "Projekte", cardPath("multiversum", "MULTIVERSUM_Projekte.webp"), "projects", "#projekte"),
      card("multiversum", "Leistungen", cardPath("multiversum", "MULTIVERSUM_Leistungen.webp"), "leistungen", "#leistungen"),
      card("multiversum", "Über mich", cardPath("multiversum", "MULTIVERSUM_Ueber_mich.png"), "about", "#ueber-mich"),
      card("multiversum", "Kontakt", cardPath("multiversum", "MULTIVERSUM_Kontakt.webp"), "contact", "#kontakt"),
    ]),
    nexora: dedupeCards([
      card("nexora", "Home", ORB_BASE + "Nexora.png" + V, "home", ""),
      card("nexora", "Projekte", cardPath("nexora", "NEXORA_Projekte.webp"), "projects", "#projekte"),
      card("nexora", "Leistungen", cardPath("nexora", "NEXORA_Leistungen.webp"), "leistungen", "#leistungen"),
      card("nexora", "Über mich", cardPath("nexora", "NEXORA_Ueber_mich.png"), "about", "#ueber-mich"),
      card("nexora", "Kontakt", cardPath("nexora", "NEXORA_Kontakt.webp"), "contact", "#kontakt"),
    ]),
    professional: dedupeCards([
      card("professional", "Home", ORB_BASE + "Professional_new_new.png" + V, "home", ""),
      card("professional", "Projekte", cardPath("professional", "PROFESSIONAL_Projekte.webp"), "projects", "#projekte"),
      card("professional", "Leistungen", cardPath("professional", "PROFESSIONAL_Leistungen.webp"), "leistungen", "#leistungen"),
      card("professional", "Über mich", cardPath("professional", "PROFESSIONAL_Ueber_mich.png"), "about", "#ueber-mich"),
      card("professional", "Kontakt", cardPath("professional", "PROFESSIONAL_Kontakt.webp"), "contact", "#kontakt"),
    ]),
    freiraum: dedupeCards([
      card("freiraum", "Home", ORB_BASE + "Freiraum.png" + V, "home", ""),
      card("freiraum", "Projekte", cardPath("freiraum", "FREIRAUM_Projekte.webp"), "projects", "#projekte"),
      card("freiraum", "Leistungen", cardPath("freiraum", "FREIRAUM_Leistungen.webp"), "leistungen", "#leistungen"),
      card("freiraum", "Über mich", cardPath("freiraum", "FREIRAUM_Ueber_mich.png"), "about", "#ueber-mich"),
      card("freiraum", "Kontakt", cardPath("freiraum", "FREIRAUM_Kontakt.webp"), "contact", "#kontakt"),
    ]),
  };

  window.MVWorldCollage = {
    version: 4,
    layout: "mindmap-petal",
    assetBase: CARD_BASE,
    orbs: ORB_BASE,
    pages: PAGES,
    worldCards: worldCards,
    cards: worldCards,
    dedupeCards: dedupeCards,
    getCardLimit: getCardLimit,
  };
})();
