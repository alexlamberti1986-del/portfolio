/**
 * UX Refine — Home minimal, keine Kontaktboxen, Footer + Menü-Kontakt
 */
(function () {
  "use strict";

  var TEL = "+41796678211";
  var TEL_DISP = "079 667 82 11";
  var MAIL = "alex.lamberti@hotmail.ch";

  function removeInjectedBlocks() {
    document
      .querySelectorAll(
        ".welten-home-extras, .welten-cta-band, .welten-contact-cards, .welten-contact-actions-row"
      )
      .forEach(function (el) {
        el.remove();
      });
  }

  function injectMenuContact() {
    var panel = document.querySelector(".menu-panel");
    if (!panel || panel.querySelector(".menu-contact-meta")) return;
    var meta = document.createElement("div");
    meta.className = "menu-contact-meta";
    meta.innerHTML =
      '<a href="tel:' + TEL + '">' + TEL_DISP + "</a>" +
      '<a href="mailto:' + MAIL + '">' + MAIL + "</a>";
    panel.appendChild(meta);
  }

  function ensureContactMapOnly() {
    /* Maps entfernt — persönliche Kontaktseite ohne Kartenansicht */
  }

  function apply() {
    removeInjectedBlocks();
    injectMenuContact();
    ensureContactMapOnly();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }

  document.addEventListener("welten-chapter-change", removeInjectedBlocks);
})();
