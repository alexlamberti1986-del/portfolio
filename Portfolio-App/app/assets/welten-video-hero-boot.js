/**
 * Video-Hero Trial — ersetzt den Home-Hero auf allen vier Welten.
 * Zum Entfernen: CSS/JS-Einbindung in den vier HTML-Dateien löschen.
 */
(function () {
  "use strict";

  var VER = "20260707video-hero-trial";
  var ENABLED = true;

  var WORLD_MAP = {
    general: "multiversum",
    nexora: "nexora",
    vertex: "professional",
    freiraum: "freiraum",
  };

  var WORLDS = {
    multiversum: {
      label: "Multiversum",
      eyebrow: "Alex Lamberti Multiversum",
      title: "Vier Welten. Eine Reise.",
      text: "Betritt das Multiversum und wähle die Welt, die zu deinem nächsten Schritt passt.",
      primaryLabel: "Welten entdecken",
      secondaryLabel: "Mehr erfahren",
      poster: "assets/videos/multiversum-poster.jpg",
      mobile: "assets/videos/multiversum-hero-720.mp4",
      desktop: "assets/videos/multiversum-hero-1080.mp4",
    },
    nexora: {
      label: "Nexora",
      eyebrow: "Nexora",
      title: "Die Welt für digitale Visionen.",
      text: "Ein Einstieg, der direkt Atmosphäre schafft und Besucher in die Nexora Welt zieht.",
      primaryLabel: "Nexora entdecken",
      secondaryLabel: "Kontakt aufnehmen",
      poster: "assets/videos/nexora-poster.jpg",
      mobile: "assets/videos/nexora-hero-720.mp4",
      desktop: "assets/videos/nexora-hero-1080.mp4",
    },
    professional: {
      label: "Professional",
      eyebrow: "Professional",
      title: "Klarheit, Wirkung und Präsenz.",
      text: "Der erste Eindruck wirkt hochwertig, ruhig und stark auf grossen wie kleinen Displays.",
      primaryLabel: "Professional ansehen",
      secondaryLabel: "Projekt starten",
      poster: "assets/videos/professional-poster.jpg",
      mobile: "assets/videos/professional-hero-720.mp4",
      desktop: "assets/videos/professional-hero-1080.mp4",
    },
    freiraum: {
      label: "Freiraum",
      eyebrow: "Freiraum",
      title: "Raum für Ideen, Tiefe und Bewegung.",
      text: "Der Hero öffnet die Freiraum Welt mit einem immersiven Video direkt am Seitenanfang.",
      primaryLabel: "Freiraum erleben",
      secondaryLabel: "Mehr erfahren",
      poster: "assets/videos/freiraum-poster.jpg",
      mobile: "assets/videos/freiraum-hero-720.mp4",
      desktop: "assets/videos/freiraum-hero-1080.mp4",
    },
  };

  function navTo(go) {
    var btn = document.querySelector('[data-go="' + go + '"]');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  }

  function scrollToHomeContent() {
    var block = document.querySelector("#slide-home .home-main-block");
    if (block) {
      block.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    }
    return false;
  }

  function setHeaderOffset() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    document.documentElement.style.setProperty(
      "--al-hero-header-offset",
      Math.ceil(header.getBoundingClientRect().height) + "px"
    );
  }

  function hideLegacyHomeHero() {
    var slideHome = document.getElementById("slide-home");
    if (!slideHome) return;
    slideHome
      .querySelectorAll(
        ".home-hero-experience, #dnaStage, #mvParallaxHero, #mvStaticHero, .mv-parallax-hero"
      )
      .forEach(function (el) {
        el.style.setProperty("display", "none", "important");
        el.style.setProperty("visibility", "hidden", "important");
        el.setAttribute("aria-hidden", "true");
      });
  }

  function buildHero(worldKey) {
    var w = WORLDS[worldKey];
    var section = document.createElement("section");
    section.id = "alWorldVideoHero";
    section.className = "al-world-video-hero al-world-video-hero--" + worldKey;
    section.setAttribute("aria-label", w.label + " Startbereich");
    section.innerHTML =
      '<div class="al-world-video-hero__media" aria-hidden="true">' +
      '<video class="al-world-video-hero__video" autoplay muted loop playsinline preload="metadata" poster="' +
      w.poster +
      '">' +
      '<source src="' +
      w.mobile +
      '" media="(max-width: 900px)" type="video/mp4">' +
      '<source src="' +
      w.desktop +
      '" type="video/mp4">' +
      "</video></div>" +
      '<div class="al-world-video-hero__shade" aria-hidden="true"></div>' +
      '<div class="al-world-video-hero__glow" aria-hidden="true"></div>' +
      '<div class="al-world-video-hero__content">' +
      '<p class="al-world-video-hero__eyebrow">' +
      w.eyebrow +
      "</p>" +
      '<h1 class="al-world-video-hero__title">' +
      w.title +
      "</h1>" +
      '<p class="al-world-video-hero__text">' +
      w.text +
      "</p>" +
      '<div class="al-world-video-hero__actions" aria-label="Start Aktionen">' +
      '<button type="button" class="al-world-video-hero__button al-world-video-hero__button--primary" data-al-primary>' +
      w.primaryLabel +
      "</button>" +
      '<button type="button" class="al-world-video-hero__button al-world-video-hero__button--ghost" data-al-secondary>' +
      w.secondaryLabel +
      "</button>" +
      "</div></div>" +
      '<div class="al-world-video-hero__scroll" aria-hidden="true"><span></span></div>';

    section.querySelector("[data-al-primary]").addEventListener("click", function () {
      if (!scrollToHomeContent()) navTo("projects");
    });

    section.querySelector("[data-al-secondary]").addEventListener("click", function () {
      if (!navTo("contact")) scrollToHomeContent();
    });

    var video = section.querySelector("video");
    if (video) video.play().catch(function () {});

    return section;
  }

  function mountVideoHero() {
    if (!ENABLED) return;

    var worldKey = WORLD_MAP[document.body.getAttribute("data-world") || ""];
    if (!worldKey) return;

    var slideHome = document.getElementById("slide-home");
    var homeInner = slideHome && slideHome.querySelector(".slide-inner");
    if (!homeInner || document.getElementById("alWorldVideoHero")) return;

    document.body.setAttribute("data-welten-video-hero", "1");
    document.body.classList.add("mv-home-ready");

    setHeaderOffset();
    hideLegacyHomeHero();

    homeInner.insertBefore(buildHero(worldKey), homeInner.firstChild);

    try {
      new MutationObserver(hideLegacyHomeHero).observe(slideHome, {
        childList: true,
        subtree: true,
      });
    } catch (e) {}

    window.addEventListener("resize", setHeaderOffset);
    window.addEventListener("orientationchange", function () {
      setTimeout(setHeaderOffset, 120);
    });
  }

  function boot() {
    mountVideoHero();
    setTimeout(mountVideoHero, 120);
    setTimeout(mountVideoHero, 600);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.addEventListener("load", boot);
  window.WeltenVideoHero = { version: VER, remount: boot };
})();
