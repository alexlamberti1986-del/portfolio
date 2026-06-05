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

  function injectFooter() {
    /* Footer entfernt — Kontakt nur in Navigation und Kontaktseite */
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
    var slide = document.querySelector("#slide-contact .glass-card");
    if (!slide) return;
    if (!slide.querySelector(".contact-map-embed")) {
      var map = document.createElement("div");
      map.className = "contact-map-embed";
      map.innerHTML =
        '<iframe title="Standort Alex Lamberti" loading="lazy" referrerpolicy="no-referrer-when-downgrade" ' +
        'src="https://maps.google.com/maps?q=Schulweg+603,+5324+Full-Reuenthal,+Schweiz&output=embed"></iframe>';
      slide.appendChild(map);
    }
  }

  function apply() {
    removeInjectedBlocks();
    injectFooter();
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
