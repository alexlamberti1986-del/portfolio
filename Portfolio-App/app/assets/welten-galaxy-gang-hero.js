/**
 * Multiversum Home — Galaxy Walk als Hero + Kapitel-Nav + sichtbarer Home-Inhalt.
 * Galaxy ab ~13″ Laptop: (min-width: 1025px) and (min-height: 640px).
 * Phone/Tablet (≤1024px Breite) bleiben ohne Galaxy. Schwerer Iframe erst nach idle.
 */
(function () {
  "use strict";

  var VER = "20260716galaxy22";
  var SRC =
    "/assets/galaxy-gang/alexlamberti-galaxy-gang-v37-responsive-optimized-self-contained.html?v=" + VER;
  /* ~13″ Laptop+; Phone/Tablet ≤1024px Breite bleiben aus (auch Landscape). */
  var GALAXY_MQ = "(min-width: 1025px) and (min-height: 640px)";
  var mqGalaxy = window.matchMedia ? window.matchMedia(GALAXY_MQ) : null;
  var iframeSrcStarted = false;
  var markedReady = false;
  var galaxyLive = false;
  var heavyLoadBound = false;
  var syncRunning = false;
  var slideObsTimer = 0;
  var CHAPTERS = [
    { id: "home", label: "Home" },
    { id: "projects", label: "Projekte" },
    { id: "leistungen", label: "Leistungen" },
    { id: "about", label: "Über mich" },
    { id: "contact", label: "Kontakt" },
    { id: "offerte", label: "Offerte" },
  ];

  function isGalaxyViewport() {
    try {
      /* Im Live-Shell ist das Iframe bereits um den Header gekürzt —
         Parent-Viewport entscheiden, sonst scheitert min-height:640 oft. */
      if (window.parent && window.parent !== window) {
        var pw = window.parent.innerWidth || 0;
        var ph = window.parent.innerHeight || 0;
        if (pw >= 1025 && ph >= 640) return true;
        if (pw > 0 && ph > 0) return false;
      }
      if (mqGalaxy) return !!mqGalaxy.matches;
      return window.innerWidth >= 1025 && window.innerHeight >= 640;
    } catch (e) {
      try {
        return window.innerWidth >= 1025 && window.innerHeight >= 640;
      } catch (e2) {
        return false;
      }
    }
  }

  /* Shell-Parent: Galaxy nur ausblenden, wenn eine ANDERE Welt aktiv ist.
     Boot-Lock / Switch-Lock dürfen Galaxy-Start nicht permanent blockieren. */
  function parentShellAllowsMvLive() {
    try {
      var p = window.parent;
      if (!p || p === window) return true;
      if (p.document && p.document.body) {
        var mw = p.document.body.getAttribute("data-master-world");
        if (mw && mw !== "general") return false;
      }
      if (typeof p.mv4MasterFrameIndex === "function" && p.mv4MasterFrameIndex() !== 0) {
        return false;
      }
      return true;
    } catch (eAllow) {
      return true;
    }
  }

  function setUseGalaxyFlag(on) {
    window.__mvUseGalaxyHome = !!on;
  }

  /* Default off until viewport gate passes — no phone/tablet iframe load. */
  setUseGalaxyFlag(isGalaxyViewport());

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
      if (galaxyLive) document.body.setAttribute("data-welten-galaxy-hero", "1");
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
    /* Prefer real site menu — never fall through to Galaxy chrome [data-go] */
    if (window.WeltenSiteIA && typeof window.WeltenSiteIA.navigateToChapter === "function") {
      window.WeltenSiteIA.navigateToChapter(go);
      return true;
    }
    var link = document.querySelector('.menu-links a[data-go="' + go + '"]');
    if (link) {
      link.click();
      return true;
    }
    var step = document.querySelector('.experience-step[data-go="' + go + '"]');
    if (step) {
      step.click();
      return true;
    }
    return false;
  }

  function clearOutboundInlineStyles() {
    var chrome = document.getElementById("alGalaxyHomeChrome");
    if (chrome) {
      chrome.style.removeProperty("visibility");
      chrome.style.removeProperty("opacity");
      chrome.style.removeProperty("pointer-events");
      chrome.style.removeProperty("display");
    }
    var section = document.getElementById("alGalaxyGangHero");
    if (section) {
      section.style.removeProperty("visibility");
      section.style.removeProperty("opacity");
      section.style.removeProperty("pointer-events");
      section.style.removeProperty("display");
      section.style.removeProperty("height");
      section.style.removeProperty("min-height");
      section.style.removeProperty("max-height");
      section.style.removeProperty("overflow");
    }
  }

  function beginOutboundLeave() {
    try {
      document.documentElement.classList.add("mv-galaxy-outbound");
      document.body.classList.add("mv-galaxy-outbound");
    } catch (eOut) {}
    setGalaxyIframePaused(true);
    var chrome = document.getElementById("alGalaxyHomeChrome");
    if (chrome) {
      chrome.style.visibility = "hidden";
      chrome.style.opacity = "0";
      chrome.style.pointerEvents = "none";
    }
    var section = document.getElementById("alGalaxyGangHero");
    if (section) {
      section.style.visibility = "hidden";
      section.style.opacity = "0";
      section.style.pointerEvents = "none";
    }
    try {
      if (typeof window.__mvStopIframeWorldBgm === "function") {
        window.__mvStopIframeWorldBgm();
      }
    } catch (eBgm) {}
  }

  function endOutboundLeave() {
    if (!galaxyLive || !isGalaxyViewport()) return;
    /* Nie Galaxy/Chrome zurückholen, wenn Shell schon eine andere Welt zeigt */
    if (!parentShellAllowsMvLive()) return;
    try {
      document.documentElement.classList.remove("mv-galaxy-outbound");
      document.body.classList.remove("mv-galaxy-outbound");
    } catch (eEnd) {}
    clearOutboundInlineStyles();
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

  function insertAfter(ref, node) {
    if (!ref || !node || !ref.parentNode) return;
    if (ref.nextSibling) ref.parentNode.insertBefore(node, ref.nextSibling);
    else ref.parentNode.appendChild(node);
  }

  function ensureChapterNav() {
    if (!isGalaxyViewport()) return;
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
      /* Chrome UNTERHALB des Galaxy Walks */
      insertAfter(section, wrap);
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

    /* Chrome immer direkt NACH dem Galaxy-Hero halten */
    if (wrap && section && wrap.parentNode === section.parentNode && section.nextElementSibling !== wrap) {
      insertAfter(section, wrap);
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
    /* Immediately hide Multiversum chrome/Galaxy before shell cover — no MV bleed */
    beginOutboundLeave();
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
    if (!galaxyLive) return;
    var frame = document.getElementById("alGalaxyGangFrame");
    if (frame && e.source && frame.contentWindow && e.source !== frame.contentWindow) return;

    var world = String(e.data.world || "multiversum").toLowerCase();
    var go = e.data.go || "home";
    var href = e.data.href || "";

    if (world === "multiversum" || world === "general") {
      /* Subpage inside Multiversum: hide Galaxy Walk first, then jump to chapter */
      if (go && go !== "home") {
        setGalaxyIframePaused(true);
        var homeChrome = document.getElementById("alGalaxyHomeChrome");
        if (homeChrome) {
          homeChrome.style.visibility = "hidden";
          homeChrome.style.opacity = "0";
          homeChrome.style.pointerEvents = "none";
        }
      } else {
        endOutboundLeave();
        setGalaxyIframePaused(false);
      }
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

  var LABEL_FIT_STYLE_ID = "welten-galaxy-label-fit";

  function injectGalaxyLabelFit(frame) {
    var doc;
    try {
      doc = frame && frame.contentDocument;
    } catch (e) {
      return;
    }
    if (!doc || !doc.head) return;
    if (doc.getElementById(LABEL_FIT_STYLE_ID)) return;
    var style = doc.createElement("style");
    style.id = LABEL_FIT_STYLE_ID;
    style.textContent =
      "html body .world-panel .subpage-card span," +
      "html body .world-panel .subpage-card:hover span," +
      "html body .world-panel .subpage-card:focus span," +
      "html body .world-panel .subpage-card:active span{" +
      "white-space:nowrap!important;word-break:normal!important;overflow-wrap:normal!important;" +
      "overflow:hidden!important;text-overflow:ellipsis!important;max-width:100%!important;" +
      "font-size:clamp(8.5px,min(.78vw,1.35vh),17px)!important;" +
      "letter-spacing:clamp(.03em,.06em,.08em)!important;line-height:1.25!important;" +
      "padding:clamp(8px,.7vw,16px) clamp(6px,.65vw,14px) clamp(11px,.8vw,18px)!important;box-sizing:border-box!important}" +
      "html body .world-panel[data-world='freiraum'] .subpage-card span," +
      "html body .world-panel[data-world='freiraum'] .subpage-card:hover span," +
      "html body .world-panel[data-world='freiraum'] .subpage-card:focus span," +
      "html body .world-panel[data-world='freiraum'] .subpage-card:active span{" +
      "font-size:clamp(9px,.72vw,11px)!important;letter-spacing:.04em!important;" +
      "line-height:1.25!important;padding-bottom:clamp(11px,.8vw,18px)!important;" +
      "white-space:nowrap!important;word-break:normal!important;overflow-wrap:normal!important}" +
      "html body .world-panel[data-world='freiraum'] .world-detail-label," +
      "html body .overview-card[data-world='freiraum'] .overview-label strong{" +
      "letter-spacing:clamp(.06em,.10em,.14em)!important;" +
      "font-size:clamp(11px,min(1.1vw,1.9vh),28px)!important;" +
      "line-height:1.25!important;padding-bottom:.12em!important;" +
      "white-space:nowrap!important;max-width:100%!important;" +
      "overflow:hidden!important;text-overflow:ellipsis!important}";
    doc.head.appendChild(style);
  }

  function bindGalaxyLabelFit(frame) {
    if (!frame || frame.getAttribute("data-label-fit-bound") === "1") return;
    frame.setAttribute("data-label-fit-bound", "1");
    frame.addEventListener("load", function () {
      injectGalaxyLabelFit(frame);
    });
    try {
      if (frame.contentDocument && frame.contentDocument.readyState === "complete") {
        injectGalaxyLabelFit(frame);
      }
    } catch (e) {}
  }

  function startIframeSrc(frame) {
    if (!frame || iframeSrcStarted) return;
    if (!isGalaxyViewport() || !galaxyLive) return;
    if (!isHomeActive()) return;
    bindGalaxyLabelFit(frame);
    var wanted = frame.getAttribute("data-src") || SRC;
    var current = frame.getAttribute("src") || "";
    if (current.indexOf("galaxy-gang/") !== -1) {
      iframeSrcStarted = true;
      injectGalaxyLabelFit(frame);
      return;
    }
    iframeSrcStarted = true;
    frame.setAttribute("src", wanted);
  }

  function blankGalaxyIframe(frame) {
    if (!frame) return;
    try {
      frame.removeAttribute("src");
      frame.src = "about:blank";
    } catch (eBlank) {}
    iframeSrcStarted = false;
    heavyLoadBound = false;
  }

  function setGalaxyIframePaused(paused) {
    var section = document.getElementById("alGalaxyGangHero");
    var frame = document.getElementById("alGalaxyGangFrame");
    if (section) {
      section.classList.toggle("is-world-paused", !!paused);
      if (paused) {
        section.style.visibility = "hidden";
        section.style.opacity = "0";
        section.style.pointerEvents = "none";
      } else if (galaxyLive && isMultiversum() && isHomeActive()) {
        section.style.removeProperty("visibility");
        section.style.removeProperty("opacity");
        section.style.removeProperty("pointer-events");
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
      } else if (galaxyLive) {
        frame.style.visibility = "";
        frame.style.pointerEvents = "";
      }
    } catch (ePause) {}
  }

  function hideGalaxyDom() {
    var section = document.getElementById("alGalaxyGangHero");
    var chrome = document.getElementById("alGalaxyHomeChrome");
    var frame = document.getElementById("alGalaxyGangFrame");
    if (section) {
      section.classList.remove("is-galaxy-live", "is-ready");
      section.setAttribute("hidden", "");
      section.setAttribute("aria-hidden", "true");
      section.style.display = "none";
      section.style.visibility = "hidden";
      section.style.opacity = "0";
      section.style.pointerEvents = "none";
      section.style.height = "0";
      section.style.minHeight = "0";
      section.style.maxHeight = "0";
      section.style.overflow = "hidden";
    }
    if (chrome) {
      chrome.setAttribute("hidden", "");
      chrome.setAttribute("aria-hidden", "true");
      chrome.style.display = "none";
      chrome.style.visibility = "hidden";
      chrome.style.opacity = "0";
      chrome.style.pointerEvents = "none";
    }
    if (frame) {
      try {
        if (frame.contentWindow) {
          frame.contentWindow.postMessage({ type: "portfolio-world-pause", paused: true }, "*");
        }
      } catch (eP) {}
      blankGalaxyIframe(frame);
    }
  }

  function showGalaxyDom() {
    var section = document.getElementById("alGalaxyGangHero");
    var chrome = document.getElementById("alGalaxyHomeChrome");
    if (section) {
      section.removeAttribute("hidden");
      section.removeAttribute("aria-hidden");
      section.classList.add("is-galaxy-live");
      section.style.removeProperty("display");
      section.style.removeProperty("visibility");
      section.style.removeProperty("opacity");
      section.style.removeProperty("pointer-events");
      section.style.removeProperty("height");
      section.style.removeProperty("min-height");
      section.style.removeProperty("max-height");
      section.style.removeProperty("overflow");
    }
    if (chrome) {
      chrome.removeAttribute("hidden");
      chrome.removeAttribute("aria-hidden");
      chrome.style.removeProperty("display");
      chrome.style.removeProperty("visibility");
      chrome.style.removeProperty("opacity");
      chrome.style.removeProperty("pointer-events");
    }
  }

  function restoreFallbackHero() {
    try {
      document.dispatchEvent(new CustomEvent("mv-restore-hero"));
    } catch (eRest) {}
  }

  function teardownGalaxy(opts) {
    opts = opts || {};
    var wasLive = galaxyLive;
    galaxyLive = false;
    setUseGalaxyFlag(false);
    markedReady = false;
    try {
      document.body.removeAttribute("data-welten-galaxy-hero");
    } catch (eAttr) {}
    try {
      document.documentElement.classList.remove("mv-galaxy-outbound");
      document.body.classList.remove("mv-galaxy-outbound");
    } catch (eOut) {}
    hideGalaxyDom();
    if (wasLive || opts.forceRestore) restoreFallbackHero();
  }

  function onShellWorldMessage(e) {
    if (!e || !e.data || !e.data.type) return;
    var t = e.data.type;
    if (t === "mv-galaxy-hard-hide") {
      if (parentShellAllowsMvLive() && isMultiversum() && isHomeActive()) {
        setGalaxyIframePaused(true);
        return;
      }
      beginOutboundLeave();
      return;
    }
    if (
      t === "portfolio-world-pause" ||
      t === "mv-stop-iframe-bgm" ||
      t === "portfolio-cleanup-transition"
    ) {
      if (parentShellAllowsMvLive() && isMultiversum() && isHomeActive()) {
        return;
      }
      beginOutboundLeave();
      return;
    }
    if (t === "portfolio-world-enter" || t === "portfolio-world-reveal") {
      if (!isGalaxyViewport()) return;
      if (!parentShellAllowsMvLive()) {
        beginOutboundLeave();
        return;
      }
      sync();
      endOutboundLeave();
      if (isMultiversum() && isHomeActive()) {
        ensureHero();
        setGalaxyIframePaused(false);
      }
    }
  }

  function scheduleHeavyGalaxyLoad(frame, section) {
    if (!frame || !isGalaxyViewport() || !galaxyLive) return;

    function kick() {
      if (!galaxyLive || !isGalaxyViewport()) return;
      startIframeSrc(frame);
    }

    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(kick);
    } else {
      kick();
    }

    if (heavyLoadBound) return;
    heavyLoadBound = true;
    frame.addEventListener(
      "load",
      function () {
        if (!galaxyLive) return;
        markUiReady(section);
      },
      { once: true }
    );
    window.setTimeout(function () {
      if (!galaxyLive) return;
      markUiReady(section);
    }, 1200);
  }

  function ensureHero() {
    if (!isMultiversum()) return;
    if (!isGalaxyViewport()) {
      teardownGalaxy({ forceRestore: true });
      return;
    }
    if (!parentShellAllowsMvLive()) {
      /* Boot-Rennen: nicht verstecken, kurz später erneut versuchen */
      window.setTimeout(function () {
        if (isMultiversum() && isHomeActive() && parentShellAllowsMvLive()) {
          ensureHero();
        }
      }, 250);
      return;
    }

    var section = document.getElementById("alGalaxyGangHero");
    var frame = document.getElementById("alGalaxyGangFrame");
    if (!section || !frame) return;

    setUseGalaxyFlag(true);
    galaxyLive = true;
    showGalaxyDom();
    purgeLegacyHeroes();
    document.body.setAttribute("data-welten-galaxy-hero", "1");
    ensureChapterNav();
    revealHomeContent();
    endOutboundLeave();
    signalReady();

    if (!isHomeActive()) {
      setGalaxyIframePaused(true);
      return;
    }

    if (!frame.getAttribute("data-src")) {
      frame.setAttribute("data-src", SRC);
    }

    /* Nie blanken wenn schon galaxy-gang geladen — verhindert «wird geladen»-Hänger */
    scheduleHeavyGalaxyLoad(frame, section);
    startIframeSrc(frame);
    markUiReady(section);
  }

  function sync() {
    if (syncRunning) return;
    syncRunning = true;
    try {
      if (!isMultiversum()) return;
      if (!isGalaxyViewport()) {
        teardownGalaxy({ forceRestore: true });
        revealHomeContent();
        return;
      }
      if (!parentShellAllowsMvLive()) {
        beginOutboundLeave();
        return;
      }
      ensureHero();
      syncChapterNav();
      revealHomeContent();
    } finally {
      syncRunning = false;
    }
  }

  function onViewportChange() {
    sync();
  }

  function boot() {
    if (!isMultiversum()) {
      setUseGalaxyFlag(false);
      hideGalaxyDom();
      return;
    }

    if (!isGalaxyViewport()) {
      teardownGalaxy({ forceRestore: false });
      /* Fallback hero via world.js path when __mvUseGalaxyHome is false */
      setUseGalaxyFlag(false);
      hideGalaxyDom();
      revealHomeContent();
      try {
        document.body.classList.add("mv-home-ready", "is-below-parallax");
      } catch (eReady) {}
    } else {
      setUseGalaxyFlag(true);
      ensureHero();
    }

    window.addEventListener("message", onGalaxyNavigate);
    window.addEventListener("message", onShellWorldMessage);
    if (mqGalaxy) {
      if (typeof mqGalaxy.addEventListener === "function") {
        mqGalaxy.addEventListener("change", onViewportChange);
      } else if (typeof mqGalaxy.addListener === "function") {
        mqGalaxy.addListener(onViewportChange);
      }
    }

    /* Nur Kapitelwechsel beobachten — body class-Mutationen lösten Endlos-Sync aus */
    try {
      new MutationObserver(function () {
        if (slideObsTimer) return;
        slideObsTimer = window.setTimeout(function () {
          slideObsTimer = 0;
          if (!isGalaxyViewport()) return;
          if (!parentShellAllowsMvLive()) return;
          if (
            document.documentElement.classList.contains("mv-galaxy-outbound") ||
            document.body.classList.contains("mv-galaxy-outbound")
          ) {
            return;
          }
          syncChapterNav();
          if (!isHomeActive()) {
            setGalaxyIframePaused(true);
            return;
          }
          endOutboundLeave();
          ensureHero();
          revealHomeContent();
        }, 50);
      }).observe(document.body, {
        attributes: true,
        attributeFilter: ["data-current-slide"],
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
    teardown: teardownGalaxy,
    isEnabled: isGalaxyViewport,
    version: VER,
    mq: GALAXY_MQ,
  };
})();
