/**
 * Multiversum Home — Galaxy-Gang als sichtbarer Haupt-Hero (ersetzt Video/Parallax).
 * Navigations-Bridge: galaxy-navigate → Shell (alex:switch-world) / Kapitel.
 */
(function () {
  "use strict";

  var VER = "20260715galaxy2";
  var SRC =
    "/assets/galaxy-gang/alexlamberti-galaxy-gang-v36-final-self-contained.html?v=" + VER;
  var ENABLED = true;
  var retryTimer = 0;

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

  function getHomeInner() {
    var slideHome = document.getElementById("slide-home");
    if (!slideHome) return null;
    return (
      slideHome.querySelector(".slide-inner--home") ||
      slideHome.querySelector(".slide-inner") ||
      slideHome
    );
  }

  function signalReady() {
    try {
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

  function removeHero() {
    var el = document.getElementById("alGalaxyGangHero");
    if (el) el.remove();
    document.body.removeAttribute("data-welten-galaxy-hero");
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

  function placeHero(section, inner) {
    /* Immer ganz oben auf Home — sichtbar statt unter Parallax */
    if (inner.firstChild !== section) {
      inner.insertBefore(section, inner.firstChild);
    }
  }

  function markReady(section) {
    if (!section) return;
    section.classList.add("is-ready");
    signalReady();
  }

  function mountHero() {
    if (!ENABLED || !isMultiversum() || !isHomeActive()) {
      removeHero();
      return;
    }

    var inner = getHomeInner();
    if (!inner) {
      if (retryTimer) window.clearTimeout(retryTimer);
      retryTimer = window.setTimeout(mountHero, 120);
      return;
    }

    var existing = document.getElementById("alGalaxyGangHero");
    if (existing) {
      placeHero(existing, inner);
      document.body.setAttribute("data-welten-galaxy-hero", "1");
      signalReady();
      return;
    }

    var section = document.createElement("section");
    section.id = "alGalaxyGangHero";
    section.className = "al-galaxy-gang-hero";
    section.setAttribute("aria-label", "Alex Lamberti Galaxy Gang");

    var loading = document.createElement("div");
    loading.className = "al-galaxy-gang-hero__loading";
    loading.textContent = "Galaxy Walk wird geladen …";
    section.appendChild(loading);

    var iframe = document.createElement("iframe");
    iframe.id = "alGalaxyGangFrame";
    iframe.className = "al-galaxy-gang-hero__frame";
    iframe.title = "Alex Lamberti Galaxy Gang";
    iframe.loading = "eager";
    iframe.setAttribute("allow", "fullscreen");
    iframe.src = SRC;
    section.appendChild(iframe);

    placeHero(section, inner);
    document.body.setAttribute("data-welten-galaxy-hero", "1");

    var videoHero = document.getElementById("alWorldVideoHero");
    if (videoHero && videoHero.classList.contains("al-world-video-hero--multiversum")) {
      videoHero.remove();
      document.body.removeAttribute("data-welten-video-hero");
    }

    iframe.addEventListener("load", function () {
      markReady(section);
    });
    /* 67MB: dennoch Shell-Ready früh setzen, Loading-Overlay bleibt bis load */
    window.setTimeout(signalReady, 400);
    window.setTimeout(function () {
      markReady(section);
    }, 12000);
  }

  function sync() {
    if (!isMultiversum()) {
      removeHero();
      return;
    }
    if (isHomeActive()) mountHero();
    else removeHero();
  }

  function boot() {
    if (!isMultiversum()) return;
    window.addEventListener("message", onGalaxyNavigate);
    sync();

    var obs = new MutationObserver(function () {
      sync();
    });
    try {
      obs.observe(document.body, {
        attributes: true,
        attributeFilter: ["data-current-slide", "class"],
      });
    } catch (e) {}

    var home = document.getElementById("slide-home");
    if (home) {
      try {
        obs.observe(home, { attributes: true, attributeFilter: ["class"] });
      } catch (e2) {}
      try {
        obs.observe(home, { childList: true, subtree: true });
      } catch (e3) {}
    }

    window.addEventListener("portfolio-world-reveal", sync);
    window.addEventListener("portfolio-world-enter", sync);
    window.addEventListener("portfolio-world-pause", function () {
      /* keep DOM; iframe pauses via browser while hidden */
    });
    document.addEventListener("mv-hero-ready", function () {
      if (isHomeActive()) mountHero();
    });

    /* Parallax baut Home asynchron — mehrmals nachziehen */
    [200, 600, 1200, 2500, 5000].forEach(function (ms) {
      window.setTimeout(sync, ms);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.WeltenGalaxyGangHero = { remount: mountHero, sync: sync, version: VER };
})();
