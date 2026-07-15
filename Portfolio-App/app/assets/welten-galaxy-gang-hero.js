/**
 * Multiversum Home — Galaxy Walk als Hero + Kapitel-Nav + sichtbarer Home-Inhalt.
 * Schwerer Iframe-Download erst nach idle; Overlay kurz; kein Tab-Blocker.
 */
(function () {
  "use strict";

  window.__mvUseGalaxyHome = true;

  var VER = "20260715galaxy11";
  var SRC =
    "/assets/galaxy-gang/alexlamberti-galaxy-gang-v37-responsive-optimized-self-contained.html?v=" + VER;
  var ENABLED = true;
  var iframeSrcStarted = false;
  var markedReady = false;
  var CHAPTERS = [
    { id: "home", label: "Home" },
    { id: "projects", label: "Projekte" },
    { id: "leistungen", label: "Leistungen" },
    { id: "about", label: "Über mich" },
    { id: "contact", label: "Kontakt" },
    { id: "offerte", label: "Offerte" },
  ];

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
      document.body.classList.add("is-below-parallax");
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

  function syncChapterNav() {
    var nav = document.getElementById("alGalaxyChapterNav");
    if (!nav) return;
    var current = document.body.getAttribute("data-current-slide") || "home";
    nav.querySelectorAll("[data-go]").forEach(function (btn) {
      var on = btn.getAttribute("data-go") === current;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-current", on ? "page" : "false");
    });
  }

  function ensureChapterNav() {
    var nav = document.getElementById("alGalaxyChapterNav");
    var wrap = document.getElementById("alGalaxyHomeChrome");
    var section = document.getElementById("alGalaxyGangHero");

    if (!nav && section && section.parentNode) {
      wrap = document.createElement("div");
      wrap.id = "alGalaxyHomeChrome";
      wrap.className = "mv-static-hero welten-desktop-subpage-mv-hero al-galaxy-home-chrome";
      wrap.setAttribute("aria-label", "MULTIVERSUM");
      wrap.innerHTML =
        '<div class="mv-static-hero__inner">' +
        '<p class="mv-static-hero__tag" data-i18n="home.tag">' +
        '<span class="mv-tag-blue">Vier Welten.</span> <span class="mv-tag-white">Ein Ziel.</span> <span class="mv-tag-warm">Deine Vision.</span></p>' +
        '<nav id="alGalaxyChapterNav" class="mv-static-hero__nav" aria-label="Kapitel">' +
        CHAPTERS.map(function (item) {
          return (
            '<button type="button" class="mv-static-hero__nav-btn mv-form-btn" data-go="' +
            item.id +
            '">' +
            item.label +
            "</button>"
          );
        }).join("") +
        "</nav></div>";
      /* Chrome OBERHALB des Galaxy Walks */
      section.parentNode.insertBefore(wrap, section);
      nav = wrap.querySelector("#alGalaxyChapterNav");
    } else if (wrap) {
      /* Bestehendes Markup an Unterseiten-Struktur angleichen */
      wrap.classList.add("mv-static-hero", "welten-desktop-subpage-mv-hero", "al-galaxy-home-chrome");
      if (!wrap.querySelector(".mv-static-hero__inner")) {
        var inner = document.createElement("div");
        inner.className = "mv-static-hero__inner";
        while (wrap.firstChild) inner.appendChild(wrap.firstChild);
        wrap.appendChild(inner);
      }
      var tag = wrap.querySelector(".al-galaxy-home-chrome__tag");
      if (tag) {
        tag.className = "mv-static-hero__tag";
        tag.setAttribute("data-i18n", "home.tag");
      }
      if (nav) nav.classList.remove("al-galaxy-chapter-nav");
    }

    /* Chrome immer direkt vor dem Galaxy-Hero halten */
    if (wrap && section && wrap.parentNode === section.parentNode && wrap.nextElementSibling !== section) {
      section.parentNode.insertBefore(wrap, section);
    }

    if (nav && nav.getAttribute("data-galaxy-nav-bound") !== "1") {
      nav.setAttribute("data-galaxy-nav-bound", "1");
      nav.querySelectorAll("[data-go]").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          navigateLocalChapter(btn.getAttribute("data-go"));
          syncChapterNav();
        });
      });
    }
    syncChapterNav();
  }

  function revealHomeContent() {
    var block = document.querySelector("#slide-home .home-main-block");
    if (!block) return;
    block.removeAttribute("hidden");
    block.style.visibility = "visible";
    block.style.opacity = "1";
    block.style.pointerEvents = "auto";
    block.style.display = "";
  }

  function forwardToShell(payload) {
    var world = String(payload.world || "nexora").toLowerCase();
    var go = payload.go || "home";
    var CHAPTER_PATH = {
      home: "",
      projects: "/projekte",
      leistungen: "/leistungen",
      about: "/ueber-mich",
      contact: "/kontakt",
      offerte: "/offerte",
    };
    var href = payload.href || "";
    if (!href) {
      var base = world === "multiversum" || world === "general" ? "" : "/" + world;
      href = (base + (CHAPTER_PATH[go] || "")) || "/";
    }
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          {
            type: "alex:switch-world",
            world: world,
            go: go,
            href: href,
            targetHash: payload.targetHash || "",
          },
          "*"
        );
        return true;
      }
    } catch (e) {}
    try {
      window.location.assign(href);
      return true;
    } catch (e2) {}
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
    if (!isHomeActive()) return;
    var wanted = frame.getAttribute("data-src") || SRC;
    var current = frame.getAttribute("src") || "";
    if (current.indexOf("galaxy-gang/") !== -1) {
      iframeSrcStarted = true;
      return;
    }
    iframeSrcStarted = true;
    frame.setAttribute("src", wanted);
  }

  function setGalaxyIframePaused(paused) {
    var section = document.getElementById("alGalaxyGangHero");
    var frame = document.getElementById("alGalaxyGangFrame");
    if (section) {
      section.classList.toggle("is-world-paused", !!paused);
      if (paused) {
        section.style.visibility = "hidden";
        section.style.pointerEvents = "none";
      } else if (isMultiversum() && isHomeActive()) {
        section.style.visibility = "";
        section.style.pointerEvents = "";
      }
    }
    if (!frame) return;
    try {
      if (paused) {
        frame.style.visibility = "hidden";
        frame.style.pointerEvents = "none";
        if (frame.contentWindow) {
          frame.contentWindow.postMessage({ type: "portfolio-world-pause", paused: true }, "*");
        }
      } else {
        frame.style.visibility = "";
        frame.style.pointerEvents = "";
      }
    } catch (ePause) {}
  }

  function onShellWorldMessage(e) {
    if (!e || !e.data || !e.data.type) return;
    var t = e.data.type;
    if (t === "portfolio-world-pause" || t === "mv-stop-iframe-bgm" || t === "portfolio-cleanup-transition") {
      setGalaxyIframePaused(true);
      return;
    }
    if (t === "portfolio-world-enter" || t === "portfolio-world-reveal") {
      if (isMultiversum() && isHomeActive()) setGalaxyIframePaused(false);
    }
  }

  function scheduleHeavyGalaxyLoad(frame, section) {
    if (!frame) return;

    function kick() {
      startIframeSrc(frame);
    }

    function afterDocReady(cb) {
      if (document.readyState === "complete") cb();
      else window.addEventListener("load", cb, { once: true });
    }

    afterDocReady(function () {
      /* Idle = flüssiger First Paint; Fallback nach 400ms */
      if (window.requestIdleCallback) {
        window.requestIdleCallback(kick, { timeout: 900 });
      } else {
        window.setTimeout(kick, 400);
      }
    });

    frame.addEventListener(
      "load",
      function () {
        markUiReady(section);
      },
      { once: true }
    );
    /* Overlay schnell weg — Seite ist schon nutzbar */
    window.setTimeout(function () {
      markUiReady(section);
    }, 1800);
  }

  function ensureHero() {
    if (!ENABLED || !isMultiversum()) return;

    var section = document.getElementById("alGalaxyGangHero");
    var frame = document.getElementById("alGalaxyGangFrame");
    if (!section || !frame) return;

    purgeLegacyHeroes();
    document.body.setAttribute("data-welten-galaxy-hero", "1");
    ensureChapterNav();
    revealHomeContent();
    signalReady();

    if (!isHomeActive()) return;

    if (!frame.getAttribute("data-src")) {
      frame.setAttribute("data-src", SRC);
    }

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
    syncChapterNav();
    revealHomeContent();
  }

  function boot() {
    window.__mvUseGalaxyHome = true;
    if (!isMultiversum()) return;
    window.addEventListener("message", onGalaxyNavigate);
    window.addEventListener("message", onShellWorldMessage);
    ensureHero();

    window.addEventListener("portfolio-world-reveal", sync);
    window.addEventListener("portfolio-world-enter", sync);

    try {
      new MutationObserver(function () {
        syncChapterNav();
        if (isHomeActive()) revealHomeContent();
      }).observe(document.body, {
        attributes: true,
        attributeFilter: ["data-current-slide", "class"],
      });
    } catch (eObs) {}
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
