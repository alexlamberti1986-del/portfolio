/**
 * MULTIVERSUM V4 — lokaler Test-Boot
 */
(function () {
  "use strict";

  var V = "?v=20260629mv-prof-portrait";
  var BOOT_AT = Date.now();
  var BOOT_GRACE_MS = 2800;
  var ORBS = {
    multiversum: "assets/multiversum-parallax-v4/orbs/Multiversum.png" + V,
    nexora: "assets/multiversum-parallax-v4/orbs/Nexora.png" + V,
    professional: "assets/multiversum-parallax-v4/orbs/Professional_new_new.png" + V,
    freiraum: "assets/multiversum-parallax-v4/orbs/Freiraum.png" + V,
  };

  var TEXT_REPLACEMENTS = [
    [/Drei Welten/gi, "Vier Welten"],
    [/drei Welten/gi, "vier Welten"],
    [/3 Welten/gi, "4 Welten"],
  ];

  function patchOrbImages() {
    Object.keys(ORBS).forEach(function (key) {
      document.querySelectorAll('[data-orb="' + key + '"] .mv-orb-bubble__standalone, [data-world-zone="' + key + '"] .mv-orb-bubble__standalone').forEach(function (img) {
        if (img.getAttribute("src") !== ORBS[key]) {
          img.src = ORBS[key];
          img.removeAttribute("srcset");
        }
      });
    });
  }

  function patchCopy() {
    TEXT_REPLACEMENTS.forEach(function (pair) {
      document.querySelectorAll(".mv-scroll-slide h2, .mv-static-hero__tag, .mv-scroll-slide__body, .mv-scroll-slide__lead, .mv-static-hero__tag .mv-tag-blue").forEach(function (el) {
        if (el.innerHTML) el.innerHTML = el.innerHTML.replace(pair[0], pair[1]);
        else if (el.textContent) el.textContent = el.textContent.replace(pair[0], pair[1]);
      });
    });
    var tag = document.querySelector(".mv-static-hero__tag .mv-tag-blue");
    if (tag && /Drei|drei|3/.test(tag.textContent)) tag.textContent = "Vier Welten.";
  }

  var PROFESSIONAL_PORTRAIT =
    "assets/images/4welten-preview/professional/" +
    encodeURIComponent("PROFESSIONAL PROFILBILD für HOME und Kontakt.png") +
    V;

  function patchProfessionalPortraits() {
    document
      .querySelectorAll(
        '.home-portrait-card img, #contactPhoto, .contact-photo, #heroPhoto, img[src*="PROFESSIONAL PROFILBILD"], img[src*="Professional_new"], img[src*="multiversum-parallax-v4/orbs/Professional"]'
      )
      .forEach(function (img) {
        if (document.body.getAttribute("data-world") !== "vertex") return;
        img.src = PROFESSIONAL_PORTRAIT;
        img.removeAttribute("srcset");
        img.alt = "Alex Lamberti Professional Portrait";
      });
  }

  function patchSideNav() {
    var rail = document.querySelector(".experience-rail");
    if (!rail || !document.getElementById("mvParallaxHero")) return;

    if (window.matchMedia("(max-width: 1919px)").matches) {
      rail.style.setProperty("display", "none", "important");
      rail.style.setProperty("opacity", "0", "important");
      rail.style.setProperty("visibility", "hidden", "important");
      rail.style.setProperty("pointer-events", "none", "important");
      return;
    }

    rail.style.removeProperty("display");
    rail.style.removeProperty("opacity");
    rail.style.removeProperty("visibility");
    rail.style.removeProperty("pointer-events");
    document.body.setAttribute("data-current-slide", document.body.getAttribute("data-current-slide") || "home");
    document.querySelectorAll(".experience-step[data-go]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-go") === "home");
    });
  }

  function patchCardImages() {
    if (!window.MVWorldCollage) return;
    document.querySelectorAll(".world-zone[data-world-zone]").forEach(function (zone) {
      var world = zone.getAttribute("data-world-zone");
      var cards = (window.MVWorldCollage.worldCards && window.MVWorldCollage.worldCards[world]) || [];
      zone.querySelectorAll(".world-card").forEach(function (cardEl, i) {
        var c = cards[i];
        if (!c || !c.image) return;
        var img = cardEl.querySelector(".world-card__image img");
        if (!img) return;
        if (!img.getAttribute("src") || img.getAttribute("src") === window.location.href) {
          img.src = c.image;
        }
      });
    });
  }

  function ensureParallaxCards() {
    var hero = document.getElementById("mvParallaxHero");
    if (!hero || !window.MVWorldCollage) return;
    if (Date.now() - BOOT_AT < BOOT_GRACE_MS) {
      window.setTimeout(ensureParallaxCards, 400);
      return;
    }
    var hasImages = hero.querySelector(".world-card__image img[src*='4welten-preview'], .world-card__image img[src*='multiversum-parallax-v4']");
    if (hasImages) return;
    if (!hero.querySelector(".world-card")) {
      if (Date.now() - BOOT_AT >= BOOT_GRACE_MS) {
        document.dispatchEvent(new CustomEvent("mv-restore-hero"));
      }
      return;
    }
    patchCardImages();
  }

  function patchAll() {
    patchOrbImages();
    patchCopy();
    patchProfessionalPortraits();
    patchSideNav();
    patchCardImages();
    ensureParallaxCards();
  }

  function boot() {
    document.body.setAttribute("data-mv-v4-test", "1");
    patchAll();
    window.setTimeout(patchAll, 600);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.MVV4Test = { patchOrbImages: patchOrbImages, patchAll: patchAll };
})();
