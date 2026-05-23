/**
 * Mobile Hero — DOM-Aufbau + Intro-Animation (NEXORA · FREIRAUM)
 */
(function () {
  "use strict";

  var mqHero = window.matchMedia("(max-width: 1024px)");
  var enterTimer = 0;

  function isHeroMobile() {
    return mqHero.matches;
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

  function watchNexoraStage() {
    var stage = document.getElementById("dnaStage");
    if (!stage || stage.__weltenHeroObs) return;
    stage.__weltenHeroObs = true;
    var obs = new MutationObserver(function () {
      if (isHeroMobile() && document.body.getAttribute("data-world") === "nexora") {
        ensureNexoraClaim(stage);
      }
    });
    obs.observe(stage, { childList: true, subtree: true });
  }

  function buildMobileHeroDom() {
    if (!isHeroMobile()) return;
    document.documentElement.classList.add("welten-mobile-hero");
    var world = document.body.getAttribute("data-world");
    if (world === "nexora") {
      ensureNexoraClaim(document.getElementById("dnaStage"));
      watchNexoraStage();
    }
    if (world === "freiraum") {
      ensureFreiraumClaim(document.querySelector("#slide-home .dna-unified-scene"));
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
    if (!isHeroMobile()) {
      document.documentElement.classList.remove("welten-mobile-hero");
      return;
    }
    buildMobileHeroDom();
    if (document.body.getAttribute("data-current-slide") === "home") {
      playHeroEnter();
    }
  }

  window.addEventListener("message", function (e) {
    if (!e.data) return;
    if (e.data.type === "portfolio-world-enter") {
      onWorldEnter();
    }
  });

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
  };
})();
