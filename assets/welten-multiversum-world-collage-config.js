/**
 * MULTIVERSUM — Welt-Collage v14 Final (transparente Paket-Assets)
 */
(function () {
  "use strict";

  var CARDS = "assets/multiversum-v14/cards/";
  var ORBS = "assets/multiversum-v14/orbs/";
  var PAGES = {
    nexora: "NEXORA.html",
    professional: "PROFESSIONAL.html",
    freiraum: "FREIRAUM.html",
  };

  function card(world, label, imagePath, go, target) {
    return {
      label: label,
      image: imagePath,
      world: world,
      go: go,
      target: target,
      href: PAGES[world] + (target || ""),
    };
  }

  function worldCard(world, file, label, go, target) {
    return card(world, label, CARDS + world + "/" + file, go, target);
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
      worldCard("nexora", "home_card.png", "Home", "home", ""),
      worldCard("nexora", "projekte_card.png", "Projekte", "projects", "#projekte"),
      worldCard("nexora", "leistungen_card.png", "Leistungen", "leistungen", "#leistungen"),
      worldCard("nexora", "ueber_mich_card.png", "Über mich", "about", "#expertise"),
      worldCard("nexora", "kontakt_card.png", "Kontakt", "contact", "#kontakt"),
    ]),
    professional: dedupeCards([
      worldCard("professional", "home_card.png", "Home", "home", ""),
      worldCard("professional", "projekte_card.png", "Projekte", "projects", "#projekte"),
      worldCard("professional", "leistungen_card.png", "Leistungen", "leistungen", "#leistungen"),
      worldCard("professional", "ueber_mich_card.png", "Über mich", "about", "#expertise"),
      worldCard("professional", "kontakt_card.png", "Kontakt", "contact", "#kontakt"),
    ]),
    freiraum: dedupeCards([
      worldCard("freiraum", "home_card.png", "Home", "home", ""),
      worldCard("freiraum", "projekte_card.png", "Projekte", "projects", "#projekte"),
      worldCard("freiraum", "leistungen_card.png", "Leistungen", "leistungen", "#leistungen"),
      worldCard("freiraum", "ueber_mich_card.png", "Über mich", "about", "#expertise"),
      worldCard("freiraum", "kontakt_card.png", "Kontakt", "contact", "#kontakt"),
    ]),
  };

  window.MVWorldCollage = {
    version: 14,
    layout: "mindmap-petal",
    assetBase: "assets/multiversum-v14/",
    orbs: ORBS,
    pages: PAGES,
    worldCards: worldCards,
    cards: worldCards,
    dedupeCards: dedupeCards,
    getCardLimit: getCardLimit,
  };
})();
