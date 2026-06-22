/**
 * Kontakt — Kontaktdaten + Portrait oben, Leadformular darunter (alle Welten)
 */
(function () {
  "use strict";

  var VERSION = "5";
  var FORM_SRC = "assets/preview/alx-leadform-demo.html";
  var TEL = "+41796678211";
  var TEL_DISP = "079 667 82 11";
  var MAIL = "alex.lamberti@hotmail.ch";
  var MAP =
    "https://www.google.com/maps/search/?api=1&query=Schulweg%20603%2C%205324%20Full-Reuenthal%2C%20Schweiz";
  var PLACEHOLDER =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

  function currentLang() {
    try {
      return (
        localStorage.getItem("mv-preview-lang") ||
        sessionStorage.getItem("mv-preview-lang") ||
        document.documentElement.lang ||
        "de"
      );
    } catch (e) {
      return "de";
    }
  }

  function formWorldKey() {
    var w = document.body.getAttribute("data-world") || "nexora";
    if (w === "general") return "general";
    if (w === "vertex") return "professional";
    if (w === "freiraum") return "freiraum";
    return "nexora";
  }

  function formFrameSrc() {
    return (
      FORM_SRC +
      "?embed=1&world=" +
      encodeURIComponent(formWorldKey()) +
      "&lang=" +
      encodeURIComponent(currentLang()) +
      "&v=20260623form6"
    );
  }

  function contactMarkup() {
    return (
      '<div class="contact-copy glass-card">' +
      '<p class="chapter-label">Kontakt</p>' +
      '<h2 class="section-title">Bereit für den nächsten Schritt.</h2>' +
      '<p class="prose">Ich freue mich auf Möglichkeiten, bei denen ich meine Erfahrung in Markeninszenierung, Kundenkommunikation und digitalem Marketing gezielt einbringen kann.</p>' +
      '<p class="prose contact-lead-emphasis">Lassen Sie uns ins Gespräch kommen.</p>' +
      '<p class="prose">Ob Website, Markenauftritt, digitale Sichtbarkeit oder ein konkretes Kundenprojekt: Ich freue mich über den Austausch und reagiere schnell, verbindlich und unkompliziert.</p>' +
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
      "</figure>" +
      '<div class="welten-leadform-wrap">' +
      '<iframe class="welten-leadform-frame" id="weltenLeadForm" title="Leadformular" scrolling="no" src="' +
      formFrameSrc() +
      '" loading="lazy"></iframe>' +
      "</div>"
    );
  }

  function syncContactPortraitFromHome() {
    var hero = document.getElementById("heroPhoto");
    var contact = document.getElementById("contactPhoto");
    var homeCard = document.querySelector("#slide-home .home-portrait-card");
    var contactVisual = document.querySelector("#slide-contact .contact-visual");
    if (!contact) return;

    if (hero && hero.src && hero.src.indexOf("data:image/gif") === -1) {
      contact.removeAttribute("srcset");
      contact.src = hero.src;
      contact.alt = hero.alt || contact.alt || "Alex Lamberti";

      var imgStyle = window.getComputedStyle(hero);
      contact.style.objectFit = imgStyle.objectFit;
      contact.style.objectPosition = imgStyle.objectPosition;
      contact.style.filter = imgStyle.filter;
      contact.style.mixBlendMode = imgStyle.mixBlendMode;
      contact.style.opacity = imgStyle.opacity;
      contact.style.transform = imgStyle.transform;
    }

    contact.style.display = "block";
    contact.style.visibility = "visible";
    contact.style.width = "100%";
    contact.style.height = "100%";

    if (homeCard && contactVisual) {
      var cardStyle = window.getComputedStyle(homeCard);
      contactVisual.style.maxWidth = cardStyle.maxWidth;
      contactVisual.style.width = cardStyle.width;
      contactVisual.style.maxHeight = cardStyle.maxHeight;
      contactVisual.style.aspectRatio = cardStyle.aspectRatio;
    }
  }

  function applyContactPortrait() {
    var IMG = window.PORTFOLIO_INLINE_IMAGES || {};
    var w = document.body.getAttribute("data-world") || "nexora";
    var src = IMG[w] || IMG.general || IMG.nexora || IMG.vertex;
    if (src) {
      document.querySelectorAll("#contactPhoto, #slide-contact .contact-photo").forEach(function (img) {
        img.removeAttribute("srcset");
        img.src = src;
        img.style.display = "block";
        img.style.opacity = "1";
        img.style.mixBlendMode = "normal";
        img.style.filter = "none";
      });
    }
    var hero = document.getElementById("heroPhoto");
    var contact = document.getElementById("contactPhoto");
    if (hero && contact && hero.src && hero.src.indexOf("data:image/gif") === -1) {
      contact.src = hero.src;
      contact.alt = hero.alt || contact.alt;
    }
  }

  function resizeLeadFormFrame(height) {
    var frame = document.getElementById("weltenLeadForm");
    if (!frame) return;
    var h = parseInt(height, 10);
    if (h > 400) {
      h += 24;
      frame.style.height = h + "px";
      frame.style.minHeight = h + "px";
      frame.style.maxHeight = h + "px";
      frame.setAttribute("scrolling", "no");
    }
  }

  function syncLeadFormFrame() {
    var frame = document.getElementById("weltenLeadForm");
    if (!frame) return;

    var nextSrc = formFrameSrc();
    var current = frame.getAttribute("src") || "";
    if (current.split("#")[0] !== nextSrc.split("#")[0]) {
      frame.src = nextSrc;
      return;
    }

    if (frame.contentWindow) {
      try {
        frame.contentWindow.postMessage(
          {
            type: "alx-preview-sync",
            world: formWorldKey(),
            lang: currentLang(),
          },
          "*"
        );
      } catch (e) {}
    }
  }

  function needsContactRebuild(slide) {
    if (!slide) return false;
    if (slide.dataset.weltenContactFinal !== VERSION) return true;
    if (slide.querySelector(".welten-contact-page")) return true;
    if (!slide.querySelector(".contact-copy") || !slide.querySelector(".contact-visual")) return true;
    if (!slide.querySelector(".welten-leadform-wrap")) return true;
    if (!slide.querySelector('.contact-actions a[href^="mailto:"]')) return true;
    return false;
  }

  function applyContactFinal() {
    var slide = document.querySelector("#slide-contact .slide-inner");
    if (!slide) return;

    if (!needsContactRebuild(slide)) {
      slide.className = "slide-inner contact-layout contact-layout--form";
      slide.classList.remove("contact-layout--minimal");
      applyContactPortrait();
      syncLeadFormFrame();
      return;
    }

    slide.className = "slide-inner contact-layout contact-layout--form";
    slide.dataset.weltenContactFinal = VERSION;
    slide.innerHTML = contactMarkup();
    applyContactPortrait();
    syncLeadFormFrame();
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

  window.addEventListener("message", function (e) {
    if (!e.data) return;
    if (e.data.type === "alx-form-height" && e.data.height) {
      resizeLeadFormFrame(e.data.height);
    }
    if (e.data.type === "portfolio-preview-lang" || e.data.type === "alx-preview-sync") {
      syncLeadFormFrame();
    }
  });

  try {
    new MutationObserver(function () {
      if (document.body.getAttribute("data-current-slide") === "contact") {
        applyContactPortrait();
        syncLeadFormFrame();
      }
      syncContactPortraitFromHome();
    }).observe(document.body, {
      attributes: true,
      attributeFilter: ["data-world", "data-current-slide"],
    });
  } catch (e) {}

  window.addEventListener("load", function () {
    setTimeout(function () {
      syncContactPortraitFromHome();
      syncLeadFormFrame();
    }, 80);
  });

  window.addEventListener("resize", function () {
    if (document.body.getAttribute("data-current-slide") === "contact") {
      syncContactPortraitFromHome();
    }
  });

  window.WeltenContactLeadform = {
    syncLeadFormFrame: syncLeadFormFrame,
    formWorldKey: formWorldKey,
  };
})();
