/**
 * Multiversum Home — Galaxy Walk als Hero.
 * Wichtig: Iframe-Src erst NACH dem Document-Load setzen, sonst bleibt
 * der Browser-Tab ewig am Laden (64 MB Child-Frame blockiert parent load).
 */
(function () {
  "use strict";

  window.__mvUseGalaxyHome = true;

  var VER = "20260715galaxy5";
  var SRC =
    "/assets/galaxy-gang/alexlamberti-galaxy-gang-v36-final-self-contained.html?v=" + VER;
  var ENABLED = true;
  var iframeSrcStarted = false;
  var markedReady = false;

  function worldKey() {
    return document.body.getAttribute("data-world") || "";
  }

  function isMultiversum() {
    var w = worldKey();
    return w === "general" || w === "multiversum";
  }

  function isHomeActive() {
    var slideHome = document.getElementById("slide-home");
    if (!slideHome) return false;
    if (slideHome.classList.contains("active")) return true;
    var current = document.body.getAttribute("data-current-slide");
    return !current || current === "home";
  }

  function signalReady() {
    try {
      document.body.classList.add("mv-home-ready");
      document.body.setAttribute("data-welten-galaxy-hero", "1");
      document.dispatchEvent(new CustomEvent("mv-hero-ready"));
      document.dispatchEvent(new CustomEvent("welten-galaxy-hero-mounted"));
    } catch (e) {}
    try {
      if (window.parent && window.parent !== window && !window.__mvHeroReadySent) {
        window.__mvHeroReadySent = true;
        window.parent.postMessage({ type: "mv-hero-ready" }, "*");
      }
    } catch (e2) {}
  }

  function markUiReady(section) {
    if (!section) section = document.getElementById("alGalaxyGangHero");
    if (section) section.classList.add("is-ready");
    if (!markedReady) {
      markedReady = true;
      signalReady();
    }
  }

  function purgeLegacyHeroes() {
    ["mvParallaxHero", "mvStaticHero", "alWorldVideoHero"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.remove();
    });
    document.querySelectorAll(".experience-rail").forEach(function (rail) {
      rail.style.setProperty("display", "none", "important");
      rail.setAttribute("hidden", "");
    });
    document.body.removeAttribute("data-welten-video-hero");
  }

  function navigateLocalChapter(go) {
    go = go || "home";
    if (window.WeltenSiteIA && typeof window.WeltenSiteIA.navigateToChapter === "function") {
      window.WeltenSiteIA.navigateToChapter(go);
      return true;
    }
    var step = document.querySelector('.experience-step[data-go="' + go + '"]');
    if (step) {
      step.click();
      return true;
    }
    var link = document.querySelector('.menu-links a[data-go="' + go + '"]');
    if (link) {
      link.click();
      return true;
    }
    return false;
  }

  function forwardToShell(payload) {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          {
            type: "alex:switch-world",
            world: payload.world,
            go: payload.go || "home",
            href: payload.href || "",
            targetHash: payload.targetHash || "",
          },
          "*"
        );
        return true;
      }
    } catch (e) {}
    if (payload.href) {
      try {
        window.location.assign(payload.href);
        return true;
      } catch (e2) {}
    }
    return false;
  }

  function onGalaxyNavigate(e) {
    if (!e || !e.data || e.data.type !== "galaxy-navigate") return;
    var frame = document.getElementById("alGalaxyGangFrame");
    if (frame && e.source && frame.contentWindow && e.source !== frame.contentWindow) return;

    var world = String(e.data.world || "multiversum").toLowerCase();
    var go = e.data.go || "home";
    var href = e.data.href || "";

    if (world === "multiversum" || world === "general") {
      navigateLocalChapter(go);
      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage(
            { type: "portfolio-chapter", chapter: go, world: "general" },
            "*"
          );
        }
      } catch (err) {}
      return;
    }

    forwardToShell({ world: world, go: go, href: href });
  }

  function startIframeSrc(frame) {
    if (!frame || iframeSrcStarted) return;
    var wanted = frame.getAttribute("data-src") || SRC;
    var current = frame.getAttribute("src") || "";
    /* Bereits korrekte Src (statisches HTML) — nicht neu setzen */
    if (current.indexOf("galaxy-gang/") !== -1) {
      iframeSrcStarted = true;
      return;
    }
    iframeSrcStarted = true;
    frame.setAttribute("src", wanted);
  }

  /**
   * Startet den schweren Galaxy-Download erst nachdem das Multiversum-Dokument
   * selbst fertig ist — sonst hängt der Tab-Spinner an child frame load.
   */
  function scheduleHeavyGalaxyLoad(frame, section) {
    if (!frame) return;

    function kick() {
      startIframeSrc(frame);
    }

    if (document.readyState === "complete") {
      window.setTimeout(kick, 50);
    } else {
      window.addEventListener(
        "load",
        function () {
          window.setTimeout(kick, 50);
        },
        { once: true }
      );
      /* Fallback falls load durch andere Langläufer verzögert wird */
      window.setTimeout(kick, 1200);
    }

    frame.addEventListener(
      "load",
      function () {
        markUiReady(section);
      },
      { once: true }
    );
    /* Overlay spätestens nach 20s aus — Download kann länger brauchen */
    window.setTimeout(function () {
      markUiReady(section);
    }, 20000);
  }

  function ensureHero() {
    if (!ENABLED || !isMultiversum()) return;

    var section = document.getElementById("alGalaxyGangHero");
    var frame = document.getElementById("alGalaxyGangFrame");
    if (!section || !frame) return;

    purgeLegacyHeroes();
    document.body.setAttribute("data-welten-galaxy-hero", "1");

    /* Sofort Shell freigeben — unabhängig vom 64MB-Download */
    signalReady();

    if (!isHomeActive()) {
      /* Auf Unterseiten Src nicht starten (spart Bandbreite) */
      return;
    }

    if (!frame.getAttribute("data-src")) {
      frame.setAttribute("data-src", SRC);
    }

    /* Eager-Src aus dem HTML entfernen → Document kann complete werden */
    var srcNow = frame.getAttribute("src") || "";
    if (srcNow.indexOf("galaxy-gang/") !== -1 && document.readyState !== "complete") {
      frame.setAttribute("data-src", srcNow);
      try {
        frame.removeAttribute("src");
        frame.src = "about:blank";
      } catch (eBlank) {}
      iframeSrcStarted = false;
    }

    scheduleHeavyGalaxyLoad(frame, section);
  }

  function sync() {
    if (!isMultiversum()) return;
    ensureHero();
  }

  function boot() {
    window.__mvUseGalaxyHome = true;
    if (!isMultiversum()) return;
    window.addEventListener("message", onGalaxyNavigate);
    ensureHero();

    window.addEventListener("portfolio-world-reveal", sync);
    window.addEventListener("portfolio-world-enter", sync);

    var home = document.getElementById("slide-home");
    if (home) {
      try {
        new MutationObserver(function () {
          if (isHomeActive()) ensureHero();
        }).observe(home, { attributes: true, attributeFilter: ["class"] });
      } catch (eObs) {}
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.WeltenGalaxyGangHero = {
    remount: ensureHero,
    sync: sync,
    version: VER,
  };
})();
