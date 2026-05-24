/**
 * Mobile Hero — DOM + Stylesheet-Lock (NEXORA · FREIRAUM)
 */
(function () {
  "use strict";

  var HERO_VER = "20260526";
  var mqHero = window.matchMedia("(max-width: 1024px)");
  var enterTimer = 0;

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
      '<span class="nexora-mobile-hero-kicker">NEXORA</span>' +
      "<p>Strategie · Technologie · Zukunft</p>";
    var buttons = stage.querySelector(".nexora-orbit-buttons");
    if (buttons) {
      stage.insertBefore(claim, buttons);
    } else {
      var brain = stage.querySelector(".neuro-core");
      if (brain && brain.nextSibling) {
        stage.insertBefore(claim, brain.nextSibling);
      } else {
        stage.appendChild(claim);
      }
    }
  }

  function ensureFreiraumClaim(scene) {
    if (!scene || scene.querySelector(".freiraum-mobile-hero-claim")) return;
    var claim = document.createElement("div");
    claim.className = "freiraum-mobile-hero-claim";
    claim.innerHTML =
      '<span class="freiraum-mobile-hero-kicker">FREIRAUM</span>' +
      "<p>Kreativ · Emotional · Nahbar</p>";
    var orbit = scene.querySelector(".dna-orbit-group");
    if (orbit) {
      scene.insertBefore(claim, orbit);
    } else {
      scene.prepend(claim);
    }
  }

  function resetNexoraOrbitMobile() {
    if (!isHeroMobile() || document.body.getAttribute("data-world") !== "nexora") return;
    var shell = document.querySelector("#slide-home .nexora-orbit-buttons");
    if (shell) {
      shell.classList.add("welten-nexora-list-mode");
      shell.style.setProperty("position", "relative", "important");
      shell.style.setProperty("top", "auto", "important");
      shell.style.setProperty("bottom", "auto", "important");
      shell.style.setProperty("left", "auto", "important");
      shell.style.setProperty("transform", "none", "important");
      shell.style.setProperty("width", "100%", "important");
      shell.style.setProperty("max-width", "min(92vw, 340px)", "important");
      shell.style.setProperty("opacity", "1", "important");
      shell.style.setProperty("visibility", "visible", "important");
    }
    var ring = document.querySelector("#slide-home .nexora-orbit-ring");
    if (ring) {
      ring.style.setProperty("position", "relative", "important");
      ring.style.setProperty("display", "flex", "important");
      ring.style.setProperty("flex-wrap", "wrap", "important");
      ring.style.setProperty("justify-content", "center", "important");
      ring.style.setProperty("transform", "none", "important");
      ring.style.setProperty("width", "100%", "important");
      ring.style.setProperty("height", "auto", "important");
    }
    document.querySelectorAll("#slide-home .nexora-orbit-button").forEach(function (btn) {
      btn.style.setProperty("position", "relative", "important");
      btn.style.setProperty("left", "auto", "important");
      btn.style.setProperty("top", "auto", "important");
      btn.style.setProperty("transform", "none", "important");
      btn.style.setProperty("opacity", "1", "important");
      btn.style.setProperty("filter", "none", "important");
      btn.style.setProperty("width", "auto", "important");
      btn.style.setProperty("flex", "0 1 auto", "important");
      btn.style.setProperty("min-height", "44px", "important");
      btn.style.setProperty("height", "auto", "important");
    });
    document.querySelectorAll("#slide-home .nexora-orbit-nav").forEach(function (nav) {
      nav.style.setProperty("display", "none", "important");
    });
    var brain = document.querySelector("#slide-home .neuro-core");
    if (brain) {
      brain.style.setProperty("position", "relative", "important");
      brain.style.setProperty("top", "auto", "important");
      brain.style.setProperty("width", "min(48vw, 188px)", "important");
      brain.style.setProperty("height", "min(48vw, 188px)", "important");
      brain.style.setProperty("opacity", "1", "important");
      brain.style.setProperty("transform", "none", "important");
    }
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
      slide.style.setProperty("right", "auto", "important");
      slide.style.setProperty("bottom", "auto", "important");
      slide.style.setProperty("transform", "none", "important");
      slide.style.setProperty("width", "auto", "important");
      slide.style.setProperty("flex", "0 1 auto", "important");
      slide.style.setProperty("min-height", "44px", "important");
      slide.style.setProperty("opacity", "1", "important");
      slide.style.setProperty("display", "inline-flex", "important");
    });
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
      window.setTimeout(resetNexoraOrbitMobile, 480);
    }
    if (world === "freiraum") {
      ensureFreiraumClaim(document.querySelector("#slide-home .dna-unified-scene"));
      resetFreiraumMobile();
      window.setTimeout(resetFreiraumMobile, 120);
      window.setTimeout(resetFreiraumMobile, 480);
    }
  }

  function playHeroEnter() {
    if (!isHeroMobile()) return;
    var root = document.documentElement;
    root.classList.remove("welten-hero-enter");
    void root.offsetWidth;
    root.classList.add("welten-hero-enter");
    if (enterTimer) window.clearTimeout(enterTimer);
    enterTimer = window.setTimeout(function () {
      root.classList.remove("welten-hero-enter");
    }, 1400);
  }

  function onWorldEnter() {
    buildMobileHeroDom();
    if (document.body.getAttribute("data-current-slide") === "home") {
      playHeroEnter();
    }
  }

  function boot() {
    buildMobileHeroDom();
    if (isHeroMobile() && document.body.getAttribute("data-current-slide") === "home") {
      playHeroEnter();
    }
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
    enter: playHeroEnter,
    version: HERO_VER,
  };
})();
