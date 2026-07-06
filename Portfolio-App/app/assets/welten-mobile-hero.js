/**
 * Handy + Tablet (≤1024px): Herobereiche deaktivieren — DOM aufräumen, nichts rendern.
 * Desktop / Laptop (≥1025px): keine Änderung.
 */
(function () {
  "use strict";

  var HERO_VER = "20260706hero-off";
  var bootTimer = null;
  var mqHero = window.matchMedia("(max-width: 1024px)");

  function isHeroMobile() {
    return mqHero.matches;
  }

  function restoreMobileHeroToHome() {
    var hero = document.querySelector(".welten-mobile-relocated-hero");
    var homeInner = document.querySelector("#slide-home .slide-inner");
    if (!hero || !homeInner) return;

    hero.classList.remove("welten-mobile-relocated-hero");
    [
      "display",
      "visibility",
      "pointer-events",
      "height",
      "overflow",
      "width",
      "max-width",
      "min-height",
      "max-height",
      "position",
      "transform",
      "opacity",
    ].forEach(function (prop) {
      hero.style.removeProperty(prop);
    });

    var ph = document.getElementById("welten-mobile-hero-home-slot");
    if (ph && ph.parentNode) {
      ph.parentNode.insertBefore(hero, ph);
      ph.remove();
    } else if (hero.parentNode !== homeInner) {
      homeInner.insertBefore(hero, homeInner.firstChild);
    }
  }

  function removeMobileHeroArtifacts() {
    document.querySelectorAll("[data-mobile-chapter-hero]").forEach(function (el) {
      el.remove();
    });

    document.querySelectorAll(".mobile-hero-nav, .welten-mobile-hero-nav").forEach(function (el) {
      el.remove();
    });

    document.querySelectorAll(".welten-mobile-hero-host").forEach(function (host) {
      host.remove();
    });

    document.querySelectorAll(".welten-phone-nav-source").forEach(function (ring) {
      ring.classList.remove("welten-phone-nav-source", "hero-buttons-grid", "welten-mobile-hero-grid");
      ring.style.removeProperty("display");
      ring.removeAttribute("aria-hidden");
    });

    document
      .querySelectorAll(
        ".welten-mobile-hero-title, .welten-mobile-hero-meta, #welten-mobile-hero-home-slot"
      )
      .forEach(function (el) {
        el.remove();
      });

    document.body.classList.remove(
      "welten-mobile-subpage-hero--on",
      "welten-mobile-hero-active"
    );
    document.documentElement.classList.remove("welten-mobile-hero", "welten-nexora-list");
  }

  function clearMobileHeroInlineStyles() {
    var scope = document.querySelector("#slide-home") || document;
    scope
      .querySelectorAll(
        ".home-hero-experience, #dnaStage, #mvStaticHero, #mvParallaxHero, " +
          ".nexora-orbit-buttons, .dna-orbit-group, .mv-static-hero__inner, .dna-ring, .nexora-orbit-ring"
      )
      .forEach(function (el) {
        [
          "display",
          "visibility",
          "height",
          "min-height",
          "max-height",
          "overflow",
          "position",
          "transform",
          "opacity",
          "grid-template-columns",
          "gap",
        ].forEach(function (prop) {
          el.style.removeProperty(prop);
        });
        el.classList.remove(
          "hero-buttons-shell",
          "hero-buttons-grid",
          "welten-mobile-hero-grid",
          "hero-button"
        );
      });
  }

  function applyMobileHeroOff() {
    if (!isHeroMobile()) {
      document.documentElement.classList.remove("welten-mobile-hero-off");
      return;
    }

    restoreMobileHeroToHome();
    removeMobileHeroArtifacts();
    clearMobileHeroInlineStyles();
    document.documentElement.classList.add("welten-mobile-hero-off");
    document.documentElement.classList.remove("welten-mobile-hero");
  }

  function boot() {
    clearTimeout(bootTimer);
    bootTimer = setTimeout(applyMobileHeroOff, 32);
  }

  function onViewportChange() {
    boot();
  }

  window.addEventListener("load", boot);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  if (mqHero.addEventListener) {
    mqHero.addEventListener("change", onViewportChange);
  } else if (mqHero.addListener) {
    mqHero.addListener(onViewportChange);
  }

  window.addEventListener("orientationchange", function () {
    setTimeout(boot, 120);
  });

  document.addEventListener("welten-chapter-change", function () {
    setTimeout(boot, 30);
  });

  document.addEventListener("mv-restore-hero", function () {
    setTimeout(boot, 60);
  });

  window.addEventListener("message", function (e) {
    if (
      e.data &&
      (e.data.type === "portfolio-world-enter" || e.data.type === "portfolio-cleanup-transition")
    ) {
      setTimeout(boot, 40);
    }
  });

  try {
    new MutationObserver(function () {
      if (!isHeroMobile()) return;
      setTimeout(boot, 30);
    }).observe(document.body, {
      attributes: true,
      attributeFilter: ["data-current-slide", "data-world", "class"],
    });
  } catch (e) {}

  window.WeltenMobileHero = { refresh: boot, version: HERO_VER };
  window.WeltenCompactHero = { rebuild: boot, version: HERO_VER };
})();
