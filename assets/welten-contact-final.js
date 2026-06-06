/**
 * Kontakt — FINAL Layout (alle Welten), nur #slide-contact
 */
(function () {
  "use strict";

  var VERSION = "2";
  var TEL = "+41796678211";
  var TEL_DISP = "079 667 82 11";
  var MAIL = "alex.lamberti@hotmail.ch";
  var MAP =
    "https://www.google.com/maps/search/?api=1&query=Schulweg%20603%2C%205324%20Full-Reuenthal%2C%20Schweiz";
  var PLACEHOLDER =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

  function contactMarkup() {
    return (
      '<div class="contact-copy glass-card">' +
      '<p class="chapter-label">Kontakt</p>' +
      '<h2 class="section-title">Bereit für den nächsten Schritt.</h2>' +
      '<p class="prose">Ich freue mich auf Möglichkeiten, bei denen ich meine Erfahrung in Markeninszenierung, Kundenkommunikation und digitalem Marketing gezielt einbringen kann. Besonders spannend sind für mich Unternehmen, die Wert auf Qualität, klare Kommunikation, kreative Ideen und eine starke digitale Präsenz legen.</p>' +
      '<p class="prose">Ob Website, Content, Kampagne, Projektkoordination oder Markenauftritt – ich möchte meine Fähigkeiten dort einsetzen, wo sie Wirkung erzeugen und weiter wachsen können.</p>' +
      '<p class="prose contact-lead-emphasis">Lassen Sie uns ins Gespräch kommen.</p>' +
      '<p class="prose">Ob Website, Markenauftritt, digitale Sichtbarkeit oder ein konkretes Kundenprojekt: Ich freue mich über den Austausch und reagiere schnell, verbindlich und unkompliziert.</p>' +
      '<p class="prose">Für mich beginnt gute Zusammenarbeit mit Zuhören, Verstehen und einer klaren Einordnung der nächsten Schritte. Deshalb ist der erste Kontakt bewusst einfach gehalten: kurz schreiben, anrufen oder direkt die Adresse öffnen.</p>' +
      '<div class="contact-actions">' +
      '<a href="mailto:' + MAIL + '"><span>E-Mail: ' + MAIL + '</span><span aria-hidden="true">→</span></a>' +
      '<a href="tel:' + TEL + '"><span>Telefon: ' + TEL_DISP + '</span><span aria-hidden="true">→</span></a>' +
      '<a href="' +
      MAP +
      '" target="_blank" rel="noopener noreferrer"><span>Adresse: Schulweg 603, 5324 Full-Reuenthal, Schweiz</span><span aria-hidden="true">→</span></a>' +
      "</div></div>" +
      '<figure class="contact-visual glass-card" aria-label="Alex Lamberti Kontakt">' +
      '<img class="contact-photo portrait-photo" id="contactPhoto" src="' +
      PLACEHOLDER +
      '" alt="Alex Lamberti" width="600" height="720" decoding="async" loading="lazy" />' +
      "</figure>"
    );
  }

  function syncNexoraContactFromHome() {
    if (document.body.getAttribute("data-world") !== "nexora") return;
    var hero = document.getElementById("heroPhoto");
    var contact = document.getElementById("contactPhoto");
    if (!contact) return;

    if (hero && hero.src && hero.src.indexOf("data:image/gif") === -1) {
      contact.removeAttribute("srcset");
      contact.src = hero.src;
      contact.alt = hero.alt || "Alex Lamberti — Nexora";
    }

    contact.style.display = "block";
    contact.style.visibility = "visible";
    contact.style.opacity = "1";
    contact.style.mixBlendMode = "normal";
    contact.style.objectPosition = "58% center";
    contact.style.filter =
      "brightness(1.05) contrast(1.12) saturate(1.2) drop-shadow(0 0 35px rgba(0,170,255,.5))";
  }

  function applyContactPortrait() {
    var IMG = window.PORTFOLIO_INLINE_IMAGES || {};
    var w = document.body.getAttribute("data-world") || "nexora";
    var src = IMG[w] || IMG.nexora || IMG.vertex;
    if (src) {
      document.querySelectorAll("#contactPhoto, #slide-contact .contact-photo").forEach(function (img) {
        img.removeAttribute("srcset");
        img.src = src;
        img.style.display = "block";
        img.style.opacity = "1";
      });
    }
    syncNexoraContactFromHome();
  }

  function needsContactRebuild(slide) {
    if (!slide) return false;
    if (slide.dataset.weltenContactFinal !== VERSION) return true;
    if (slide.querySelector(".welten-contact-page")) return true;
    if (!slide.querySelector(".contact-copy") || !slide.querySelector(".contact-visual")) return true;
    if (!slide.querySelector('.contact-actions a[href^="mailto:"]')) return true;
    return false;
  }

  function applyContactFinal() {
    var slide = document.querySelector("#slide-contact .slide-inner");
    if (!slide) return;

    if (!needsContactRebuild(slide)) {
      slide.className = "slide-inner contact-layout";
      slide.classList.remove("contact-layout--minimal");
      applyContactPortrait();
      return;
    }

    slide.className = "slide-inner contact-layout";
    slide.dataset.weltenContactFinal = VERSION;
    slide.innerHTML = contactMarkup();
    applyContactPortrait();
  }

  function apply() {
    applyContactFinal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }

  document.addEventListener("welten-chapter-change", function (e) {
    if (e && e.detail && e.detail.chapter === "contact") applyContactFinal();
  });

  try {
    new MutationObserver(function () {
      if (document.body.getAttribute("data-current-slide") === "contact") {
        applyContactPortrait();
      }
      if (document.body.getAttribute("data-world") === "nexora") {
        syncNexoraContactFromHome();
      }
    }).observe(document.body, {
      attributes: true,
      attributeFilter: ["data-world", "data-current-slide"],
    });
  } catch (e) {}

  window.addEventListener("load", function () {
    setTimeout(syncNexoraContactFromHome, 80);
  });
})();
