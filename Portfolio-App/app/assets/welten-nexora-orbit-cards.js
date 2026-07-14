/**
 * NEXORA Orbit — Unterseiten als Folien (Bild oben, Titel darunter)
 */
(function () {
  "use strict";

  var CARD_VER = "20260714orbitCards1";
  var CARD_BASE = "assets/images/nexora-chapter-cards/";

  var CHAPTER_IMAGES = {
    home: CARD_BASE + "home.png",
    projects: CARD_BASE + "projects.png",
    leistungen: CARD_BASE + "leistungen.png",
    about: CARD_BASE + "about.png",
    contact: CARD_BASE + "contact.png",
    offerte: CARD_BASE + "offerte.png",
  };

  function cardSrc(id) {
    return (CHAPTER_IMAGES[id] || CHAPTER_IMAGES.home) + "?v=" + CARD_VER;
  }

  function fillOrbitButton(btn, id, label) {
    if (!btn) return;
    btn.classList.add("nexora-orbit-card");
    btn.setAttribute("data-go", id);
    btn.innerHTML =
      '<span class="nexora-orbit-card__media" aria-hidden="true">' +
      '<img class="nexora-orbit-card__img" src="' +
      cardSrc(id) +
      '" alt="" loading="lazy" decoding="async" />' +
      "</span>" +
      '<span class="nexora-orbit-card__label">' +
      label +
      "</span>";
  }

  function syncOrbitButtonLabel(btn, label) {
    if (!btn) return;
    var el = btn.querySelector(".nexora-orbit-card__label");
    if (el) {
      el.textContent = label;
      return;
    }
    var id = btn.getAttribute("data-go") || "home";
    fillOrbitButton(btn, id, label);
  }

  window.WeltenNexoraOrbitCards = {
    CARD_VER: CARD_VER,
    cardSrc: cardSrc,
    fillOrbitButton: fillOrbitButton,
    syncOrbitButtonLabel: syncOrbitButtonLabel,
    CHAPTER_IMAGES: CHAPTER_IMAGES,
  };
})();
