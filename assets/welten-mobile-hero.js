/**
 * Mobile Hero — DOM + Stylesheet-Lock (NEXORA · FREIRAUM)
 */
(function () {
  "use strict";

  var HERO_VER = "20260522f";
  var mqHero = window.matchMedia("(max-width: 1024px)");

  function isHeroMobile() {
    return mqHero.matches;
  }

  function ensureStylesheetLock() {
    if (!isHeroMobile()) return;
    var id = "welten-mobile-hero-stylesheet-lock";
    var href = "assets/welten-mobile-hero.css?v=" + HERO_VER;
    var existing = document.getElementById(id);
    if (existing) {
      if (existing.getAttribute("href") !== href) existing.setAttribute("href", href);
      return;
    }
    var link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    document.body.appendChild(link);
  }

  function ensureNexoraClaim(stage) {
    if (!stage || stage.querySelector(".nexora-mobile-hero-claim")) return;
    var claim = document.createElement("div");
    claim.className = "nexora-mobile-hero-claim";
    claim.innerHTML =
      '<span class="nexora-mobile-hero-keywords">STRATEGIE · TECHNOLOGIE · ZUKUNFT</span>';
    var buttons = stage.querySelector(".nexora-orbit-buttons");
    if (buttons) {
      stage.insertBefore(claim, buttons);
    } else {
      stage.appendChild(claim);
    }
  }

  function resetNexoraOrbitMobile() {
    if (!isHeroMobile() || document.body.getAttribute("data-world") !== "nexora") return;
    var shell = document.querySelector("#slide-home .nexora-orbit-buttons");
    if (shell) {
      shell.classList.add("welten-nexora-list-mode");
      shell.style.setProperty("position", "relative", "important");
      shell.style.setProperty("transform", "none", "important");
      shell.style.setProperty("width", "100%", "important");
      shell.style.setProperty("max-width", "min(92vw, 340px)", "important");
      shell.style.setProperty("opacity", "1", "important");
      shell.style.setProperty("visibility", "visible", "important");
    }
    var ring = document.querySelector("#slide-home .nexora-orbit-ring");
    if (ring) {
      ring.style.setProperty("display", "flex", "important");
      ring.style.setProperty("flex-wrap", "wrap", "important");
      ring.style.setProperty("justify-content", "center", "important");
      ring.style.setProperty("transform", "none", "important");
    }
    document.querySelectorAll("#slide-home .nexora-orbit-button").forEach(function (btn) {
      btn.style.setProperty("position", "relative", "important");
      btn.style.setProperty("transform", "none", "important");
      btn.style.setProperty("opacity", "1", "important");
      btn.style.setProperty("flex", "0 1 auto", "important");
      btn.style.setProperty("min-height", "46px", "important");
    });
    document.querySelectorAll("#slide-home .neuro-core, #slide-home .nexora-orbit-nav").forEach(function (el) {
      el.style.setProperty("display", "none", "important");
    });
  }

  function resetFreiraumMobile() {
    if (!isHeroMobile() || document.body.getAttribute("data-world") !== "freiraum") return;
    var ring = document.querySelector("#slide-home .dna-ring");
    if (ring) {
      ring.style.setProperty("display", "flex", "important");
      ring.style.setProperty("flex-wrap", "wrap", "important");
      ring.style.setProperty("justify-content", "center", "important");
      ring.style.setProperty("position", "relative", "important");
      ring.style.setProperty("transform", "none", "important");
      ring.style.setProperty("width", "100%", "important");
      ring.style.setProperty("height", "auto", "important");
    }
    document.querySelectorAll("#slide-home .dna-slide").forEach(function (slide) {
      slide.style.setProperty("position", "relative", "important");
      slide.style.setProperty("left", "auto", "important");
      slide.style.setProperty("top", "auto", "important");
      slide.style.setProperty("transform", "none", "important");
      slide.style.setProperty("display", "inline-flex", "important");
      slide.style.setProperty("opacity", "1", "important");
    });
    var claim = document.querySelector(".freiraum-mobile-hero-claim");
    if (claim) claim.style.setProperty("display", "none", "important");
  }

  function watchNexoraStage() {
    var stage = document.getElementById("dnaStage");
    if (!stage || stage.__weltenHeroObs) return;
    stage.__weltenHeroObs = true;
    var obs = new MutationObserver(function () {
      if (isHeroMobile() && document.body.getAttribute("data-world") === "nexora") {
        ensureNexoraClaim(stage);
        resetNexoraOrbitMobile();
      }
    });
    obs.observe(stage, { childList: true, subtree: true });
  }

  function buildMobileHeroDom() {
    if (!isHeroMobile()) {
      document.body.classList.remove("welten-mobile-hero-active");
      document.documentElement.classList.remove("welten-mobile-hero");
      return;
    }
    document.body.classList.add("welten-mobile-hero-active");
    document.documentElement.classList.add("welten-mobile-hero");
    ensureStylesheetLock();
    var world = document.body.getAttribute("data-world");
    if (world === "nexora") {
      ensureNexoraClaim(document.getElementById("dnaStage"));
      watchNexoraStage();
      resetNexoraOrbitMobile();
      window.setTimeout(resetNexoraOrbitMobile, 120);
    }
    if (world === "freiraum") {
      resetFreiraumMobile();
      window.setTimeout(resetFreiraumMobile, 120);
    }
  }

  function onWorldEnter() {
    buildMobileHeroDom();
  }

  function boot() {
    buildMobileHeroDom();
  }

  window.addEventListener("message", function (e) {
    if (!e.data) return;
    if (e.data.type === "portfolio-world-enter") {
      onWorldEnter();
    }
  });

  window.addEventListener("load", boot);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  if (mqHero.addEventListener) {
    mqHero.addEventListener("change", boot);
  } else {
    mqHero.addListener(boot);
  }

  window.WeltenMobileHero = {
    refresh: boot,
    version: HERO_VER,
  };
})();
