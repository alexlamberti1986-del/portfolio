/**
 * MULTIVERSUM Home — Galaxy V10 Embed (grosser Desktop / 27"+ ab 1920px)
 */
(function () {
  "use strict";

  var GALAXY_MIN_WIDTH = 1920;
  var CACHE = "20260704i18n";

  function isLargeDesktop() {
    try {
      return window.matchMedia("(min-width: " + GALAXY_MIN_WIDTH + "px)").matches;
    } catch (e) {
      return window.innerWidth >= GALAXY_MIN_WIDTH;
    }
  }

  function shouldUseGalaxy() {
    if (window.__mvFlightTest || /\bmv-flight-test=1\b/.test(location.search)) return false;
    return document.body.getAttribute("data-world") === "general" && isLargeDesktop();
  }

  function restoreStage() {
    var stage = document.getElementById("dnaStage");
    if (!stage) return;
    stage.classList.remove("mv-dna-hidden");
    stage.removeAttribute("hidden");
  }

  function teardownGalaxy() {
    var host = document.getElementById("galaxyV10HomeHost");
    if (host) host.remove();
    window.__galaxyV10HomeActive = false;
    restoreStage();
    if (window.MVParallaxHero && typeof window.MVParallaxHero.build === "function") {
      try {
        window.MVParallaxHero.build();
      } catch (e) {}
    } else if (!document.getElementById("mvParallaxHero") && !document.getElementById("mvStaticHero")) {
      var evt = new CustomEvent("mv-restore-hero");
      document.dispatchEvent(evt);
    }
  }

  function mountGalaxy() {
    if (!shouldUseGalaxy()) {
      teardownGalaxy();
      return false;
    }
    if (document.getElementById("galaxyV10HomeHost")) {
      window.__galaxyV10HomeActive = true;
      return true;
    }

    var stage = document.getElementById("dnaStage");
    if (!stage) return false;

    var host = document.createElement("div");
    host.className = "galaxy-v10-home-host";
    host.id = "galaxyV10HomeHost";

    var frame = document.createElement("iframe");
    frame.className = "galaxy-v10-home-frame";
    frame.title = "Reise durch das Multiversum";
    frame.src = "galaxy-v10/embed.html?v=" + CACHE;
    frame.loading = "eager";
    frame.addEventListener("load", function () {
      var lang = "de";
      try {
        lang = localStorage.getItem("mv-preview-lang") || "de";
      } catch (e) {}
      if (frame.contentWindow) {
        try {
          frame.contentWindow.postMessage({ type: "portfolio-preview-lang", lang: lang }, "*");
        } catch (err) {}
      }
    });

    host.appendChild(frame);
    stage.parentNode.insertBefore(host, stage);
    stage.classList.add("mv-dna-hidden");
    stage.setAttribute("hidden", "hidden");
    window.__galaxyV10HomeActive = true;
    return true;
  }

  function remountGalaxyIfNeeded() {
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

  window.addEventListener("message", function (e) {
    if (!e.data || e.data.type !== "galaxy-v10:release-scroll") return;
    onReleaseScroll();
  });

  var resizeTimer = 0;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(remountGalaxyIfNeeded, 180);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", remountGalaxyIfNeeded);
  } else {
    remountGalaxyIfNeeded();
  }
  window.addEventListener("pageshow", remountGalaxyIfNeeded);
  window.addEventListener("resize", onResize, { passive: true });
  try {
    window.matchMedia("(min-width: " + GALAXY_MIN_WIDTH + "px)").addEventListener("change", remountGalaxyIfNeeded);
  } catch (e) {}
})();
