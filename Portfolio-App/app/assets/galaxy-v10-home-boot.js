/**
 * MULTIVERSUM Home — Galaxy V10 Embed (grosser Desktop / 27"+ ab 1920px)
 */
(function () {
  "use strict";

  var GALAXY_MIN_WIDTH = 1920;
  var CACHE = "20260704poster";
  var bootedAt = Date.now();
  var resizeTimer = 0;

  function markReady() {
    if (window.MVHeroReady && typeof window.MVHeroReady.mark === "function") {
      window.MVHeroReady.mark();
    }
  }

  function isLargeDesktop() {
    try {
      return window.matchMedia("(min-width: " + GALAXY_MIN_WIDTH + "px)").matches;
    } catch (e) {
      return window.innerWidth >= GALAXY_MIN_WIDTH;
    }
  }

  function shouldUseGalaxy() {
    if (!/\bgalaxy=1\b/.test(location.search)) return false;
    if (window.__mvFlightTest || /\bmv-flight-test=1\b/.test(location.search)) return false;
    return document.body.getAttribute("data-world") === "general" && isLargeDesktop();
  }

  function ensureDnaStage() {
    if (document.getElementById("dnaStage")) return document.getElementById("dnaStage");
    var slideHome = document.getElementById("slide-home");
    if (!slideHome) return null;
    var inner = slideHome.querySelector(".slide-inner--home") || slideHome;
    var stage = document.createElement("div");
    stage.className = "home-hero-experience mv-dna-hidden";
    stage.id = "dnaStage";
    stage.setAttribute("aria-hidden", "true");
    stage.setAttribute("hidden", "hidden");
    inner.insertBefore(stage, inner.firstChild);
    return stage;
  }

  function restoreStage() {
    var stage = document.getElementById("dnaStage");
    if (!stage) stage = ensureDnaStage();
    if (!stage) return;
    stage.classList.remove("mv-dna-hidden");
    stage.removeAttribute("hidden");
  }

  function removeParallaxHero() {
    var hero = document.getElementById("mvParallaxHero");
    if (!hero) return;
    if (window.MVParallaxHero && typeof window.MVParallaxHero.destroy === "function") {
      try {
        window.MVParallaxHero.destroy();
      } catch (e) {}
    }
    hero.remove();
    ensureDnaStage();
  }

  function teardownGalaxy() {
    var host = document.getElementById("galaxyV10HomeHost");
    if (!host) {
      window.__galaxyV10HomeActive = false;
      return;
    }
    host.remove();
    window.__galaxyV10HomeActive = false;
    restoreStage();
    document.dispatchEvent(new CustomEvent("mv-restore-hero"));
  }

  function wireGalaxyFrame(frame) {
    frame.addEventListener(
      "load",
      function () {
        var lang = "de";
        try {
          lang = localStorage.getItem("mv-preview-lang") || "de";
        } catch (e) {}
        if (frame.contentWindow) {
          try {
            frame.contentWindow.postMessage({ type: "portfolio-preview-lang", lang: lang }, "*");
          } catch (err) {}
        }
      },
      { once: true }
    );
  }

  function mountGalaxy() {
    if (!shouldUseGalaxy()) {
      teardownGalaxy();
      return false;
    }

    var host = document.getElementById("galaxyV10HomeHost");
    if (host) {
      window.__galaxyV10HomeActive = true;
      return true;
    }

    removeParallaxHero();

    var stage = document.getElementById("dnaStage") || ensureDnaStage();
    if (!stage || !stage.parentNode) return false;

    host = document.createElement("div");
    host.className = "galaxy-v10-home-host";
    host.id = "galaxyV10HomeHost";

    var frame = document.createElement("iframe");
    frame.className = "galaxy-v10-home-frame";
    frame.title = "Reise durch das Multiversum";
    frame.loading = "eager";
    wireGalaxyFrame(frame);
    host.appendChild(frame);

    stage.parentNode.insertBefore(host, stage);
    stage.classList.add("mv-dna-hidden");
    stage.setAttribute("hidden", "hidden");
    window.__galaxyV10HomeActive = true;

    requestAnimationFrame(function () {
      frame.src = "galaxy-v10/embed.html?v=" + CACHE;
    });
    return true;
  }

  function remountGalaxyIfNeeded() {
    if (window.__mvHeroBootLock) return;
    if (shouldUseGalaxy()) mountGalaxy();
    else teardownGalaxy();
  }

  function onReleaseScroll() {
    var slideHome = document.getElementById("slide-home");
    if (!slideHome) return;
    var target = slideHome.querySelector(".home-main-block");
    if (target && target.scrollIntoView) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    slideHome.scrollTo({ top: slideHome.scrollHeight, behavior: "smooth" });
  }

  window.MVGalaxyV10Home = {
    shouldUse: shouldUseGalaxy,
    mount: mountGalaxy,
    teardown: teardownGalaxy,
    remountIfNeeded: remountGalaxyIfNeeded,
  };

  window.addEventListener("message", function (e) {
    if (!e.data) return;
    if (e.data.type === "galaxy-v10:release-scroll") {
      onReleaseScroll();
      return;
    }
    if (e.data.type === "galaxy-v10:painted") {
      markReady();
    }
  });

  function onResize() {
    if (Date.now() - bootedAt < 900) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(remountGalaxyIfNeeded, 320);
  }

  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) remountGalaxyIfNeeded();
  });
  try {
    window.matchMedia("(min-width: " + GALAXY_MIN_WIDTH + "px)").addEventListener("change", function () {
      if (Date.now() - bootedAt < 900) return;
      remountGalaxyIfNeeded();
    });
  } catch (e) {}
})();
