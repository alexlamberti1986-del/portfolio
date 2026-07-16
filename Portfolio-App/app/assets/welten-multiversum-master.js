/**
 * 4-Welten Master — Preview + Live (alexlamberti.ch)
 */
(function () {
  "use strict";

  var LANG_KEY = "mv-preview-lang";
  var FX_KEY = "mv-effects-on";
  var CHAPTERS = ["home", "projects", "leistungen", "about", "contact", "offerte"];
  var WORLD_KEYS = ["general", "nexora", "vertex", "freiraum"];
  var FRAME_PAGES = ["/MULTIVERSUM.html", "/NEXORA.html", "/PROFESSIONAL.html", "/FREIRAUM.html"];
  var SHELL_PAGES = ["3-Welten-Master-iframe.html", "index.html", ""];
  var Router = window.WeltenShellRouter;
  var ROUTE_CHAPTER = {
    "/": "home",
    "/projekte": "projects",
    "/leistungen": "leistungen",
    "/ueber-mich": "about",
    "/kontakt": "contact",
    "/offerte": "offerte",
  };
  var WORLD_BTN_SEL = "[data-iframe]";
  var suppressingHistory = false;
  var PROFILE_V = "20260706prof-portrait-tablet";
  var PROFILE_BASE = "/assets/images/4welten-preview/";
  var PROFILE_FILES = {
    general: "MULTIVERSUM PROFILBILD für HOME und Kontakt.png",
    nexora: "NEXORA PROFILBILD für HOME und Kontakt.png",
    professional: "PROFESSIONAL PROFILBILD für HOME und Kontakt.png",
    freiraum: "FREIRAUM PROFILBILD für HOME und Kontakt(1).png",
  };
  var PROFILE_FOLDERS = {
    general: PROFILE_BASE + "general/",
    nexora: PROFILE_BASE + "nexora/",
    professional: PROFILE_BASE + "professional/",
    freiraum: PROFILE_BASE + "freiraum/",
  };
  function profileUrl(key) {
    var folder = PROFILE_FOLDERS[key] || PROFILE_FOLDERS.general;
    var file = PROFILE_FILES[key] || PROFILE_FILES.general;
    return folder + encodeURIComponent(file) + "?v=" + PROFILE_V;
  }
  var PROFILE = {
    general: profileUrl("general"),
    nexora: profileUrl("nexora"),
    professional: profileUrl("professional"),
    freiraum: profileUrl("freiraum"),
  };

  var bar = document.querySelector(".mv4-bar");
  var switchLockSince = 0;
  var lastWorldBtnAt = 0;
  var frames = document.querySelectorAll(".mv4-frame");
  var fxBtn = document.getElementById("mv4-fx");
  var sharedChapter = "home";
  var switching = false;
  var pendingSwitchTarget = -1;
  var switchGeneration = 0;
  var effectsOn = true;
  var currentLang = "de";
  var routeBootUntil = 0;
  var PREVIEW_MOBILE_CSS = "/assets/welten-multiversum-preview-mobile.css?v=20260623mv2";
  var FONT_SYSTEM_CSS = "/assets/welten-font-system.css?v=20260629fonts3";
  var TITLE_COLORS_CSS = "/assets/welten-world-title-colors.css?v=20260705bootfix";
  var isLiveShell = document.body && document.body.getAttribute("data-live-shell") === "1";
  var defaultWorld = 0;
  if (document.body && document.body.getAttribute("data-live-default")) {
    defaultWorld = parseInt(document.body.getAttribute("data-live-default"), 10);
    if (!isFinite(defaultWorld) || defaultWorld < 0 || defaultWorld > 3) defaultWorld = 0;
  }
  var loaded = {};
  var resetAttempts = {};
  loaded[defaultWorld] = false;
  var SHELL_CHROME_CSS =
    "html.welten-live-shell .mv4-bar{display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;overflow:hidden!important;opacity:0!important;pointer-events:none!important}" +
    "html.welten-live-shell .site-header{display:none!important;visibility:hidden!important;opacity:0!important;height:0!important;min-height:0!important;overflow:hidden!important;pointer-events:none!important;margin:0!important;padding:0!important}" +
    "html.welten-live-shell .welten-skip-link{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}" +
    "html.mv-in-shell .al-world-video-hero--with-chrome .mv-static-hero__eyebrow,html.mv-in-shell .al-world-video-hero--with-chrome .al-world-video-hero__eyebrow,html.mv-in-shell .al-world-video-hero--with-chrome .mv-static-hero__title,html.mv-in-shell .al-world-video-hero--with-chrome .al-world-video-hero__title{display:none!important;visibility:hidden!important;opacity:0!important;height:0!important;margin:0!important;pointer-events:none!important}";
  var MENU_BRIDGE_SRC = "/assets/welten-shell-menu-bridge.js?v=20260715globalHeader1";

  function injectPreviewShellCss(f) {
    try {
      var d = f.contentDocument;
      if (!d || !d.documentElement) return;
      d.documentElement.classList.add("mv4-preview-shell");
      if (isLiveShell) d.documentElement.classList.add("welten-live-shell", "mv-in-shell");
      if (!d.getElementById("mv4-preview-mobile-css")) {
        var link = d.createElement("link");
        link.id = "mv4-preview-mobile-css";
        link.rel = "stylesheet";
        link.href = PREVIEW_MOBILE_CSS;
        (d.head || d.documentElement).appendChild(link);
      }
      if (!d.getElementById("mv4-font-system-css") && !d.querySelector('link[href*="welten-font-system.css"]')) {
        var fontLink = d.createElement("link");
        fontLink.id = "mv4-font-system-css";
        fontLink.rel = "stylesheet";
        fontLink.href = FONT_SYSTEM_CSS;
        (d.head || d.documentElement).appendChild(fontLink);
      }
      if (!d.getElementById("mv4-title-colors-css") && !d.querySelector('link[href*="welten-world-title-colors.css"]')) {
        var titleLink = d.createElement("link");
        titleLink.id = "mv4-title-colors-css";
        titleLink.rel = "stylesheet";
        titleLink.href = TITLE_COLORS_CSS;
        (d.head || d.documentElement).appendChild(titleLink);
      }
      if (isLiveShell) {
        var chrome = d.getElementById("mv4-shell-chrome-css-v2") || d.getElementById("mv4-shell-chrome-css");
        if (!chrome) {
          chrome = d.createElement("style");
          chrome.id = "mv4-shell-chrome-css-v2";
          (d.head || d.documentElement).appendChild(chrome);
        } else {
          chrome.id = "mv4-shell-chrome-css-v2";
        }
        chrome.textContent = SHELL_CHROME_CSS;
      }
    } catch (e) {}
  }

  var lastChromeH = 0;
  var chromeMeasureLock = false;

  function setBarHeight() {
    if (chromeMeasureLock) return;
    var stack = document.querySelector(".mv4-shell-chrome");
    var globalHeader = document.querySelector(".mv4-global-header");
    var shellBar = getBar();
    var root = document.documentElement;
    var globalH = 64;
    var worldNavH = 56;
    var total = 120;

    /* Prefer measuring the fixed chrome stack as one unit — height does NOT
       depend on --total-header-h, so ResizeObserver cannot drift downward. */
    if (stack) {
      total = Math.ceil(stack.getBoundingClientRect().height);
    } else {
      if (globalHeader) globalH = Math.ceil(globalHeader.getBoundingClientRect().height);
      if (shellBar) worldNavH = Math.ceil(shellBar.getBoundingClientRect().height);
      if (globalH < 48) globalH = 64;
      if (worldNavH < 48) worldNavH = 56;
      total = globalH + worldNavH;
    }

    /* Hard caps: prevent iframe from collapsing if measurement ever spikes */
    try {
      var maxChrome = Math.floor(window.innerHeight * 0.42);
      if (maxChrome < 120) maxChrome = 120;
      if (total > maxChrome) total = maxChrome;
    } catch (eCap) {
      if (total > 220) total = 220;
    }
    if (total < 96) total = 120;

    if (Math.abs(total - lastChromeH) < 1) return;
    lastChromeH = total;

    chromeMeasureLock = true;
    root.style.setProperty("--total-header-h", total + "px");
    root.style.setProperty("--bar-h", total + "px");
    /* Keep split vars for positioning bar under brand only if stack absent */
    if (!stack) {
      root.style.setProperty("--global-header-h", globalH + "px");
      root.style.setProperty("--world-nav-h", worldNavH + "px");
    }
    chromeMeasureLock = false;
  }

  function getActiveFrame() {
    var i = activeIdx();
    if (i < 0) i = defaultWorld;
    return frames[i] || null;
  }

  function postToActiveFrame(data) {
    var f = getActiveFrame();
    if (!f) return;
    postFrame(f, data);
  }

  function setGlobalMenuExpanded(open) {
    var btn = document.getElementById("mv4GlobalMenu");
    if (!btn) return;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Menü schliessen" : "Menü öffnen");
  }

  function injectMenuBridge(f) {
    if (!isLiveShell) return;
    try {
      var d = f.contentDocument;
      if (!d || !d.documentElement) return;
      if (d.getElementById("mv4-shell-menu-bridge")) return;
      var s = d.createElement("script");
      s.id = "mv4-shell-menu-bridge";
      s.src = MENU_BRIDGE_SRC;
      s.defer = true;
      (d.head || d.documentElement).appendChild(s);
    } catch (e) {}
  }

  function goMultiversumHome(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    sharedChapter = "home";
    setGlobalMenuExpanded(false);
    switchTo(0);
    syncShellUrl(0, "home", "push");
  }

  function activeIdxFromClass() {
    var idx = -1;
    frames.forEach(function (f, j) {
      if (f && f.classList.contains("is-active")) idx = j;
    });
    return idx;
  }

  /* data-master-world ist die einzige Wahrheit — nicht stale is-active auf Frame 0. */
  function masterIdx() {
    var mw = document.body.getAttribute("data-master-world") || "";
    var mi = WORLD_KEYS.indexOf(mw);
    if (mi >= 0) return mi;
    if (switching && pendingSwitchTarget >= 0) return pendingSwitchTarget;
    return activeIdxFromClass();
  }

  function activeIdx() {
    return masterIdx();
  }

  function canApplyWorld(i, opts) {
    opts = opts || {};
    if (i === 0 && frames[0] && frames[0].getAttribute("data-mv-quarantined") === "1" && !opts.routeIntent && !opts.commitIntent) {
      return false;
    }
    if (opts.routeIntent && opts.force) return true;
    if (opts.commitIntent) return pendingSwitchTarget < 0 || i === pendingSwitchTarget;
    if (switching || pendingSwitchTarget >= 0) {
      return pendingSwitchTarget < 0 || i === pendingSwitchTarget;
    }
    var mw = document.body.getAttribute("data-master-world") || "";
    var mi = WORLD_KEYS.indexOf(mw);
    if (mi >= 0 && mi !== i) return false;
    return true;
  }

  function enforceFrameExclusivity() {
    if (switching && pendingSwitchTarget >= 0) {
      frames.forEach(function (f, j) {
        if (!f || j === pendingSwitchTarget) return;
        hardHideFrame(f);
        if (j === 0) {
          postFrame(f, { type: "mv-galaxy-hard-hide" });
          postFrame(f, { type: "mv-stop-iframe-bgm" });
        }
      });
      return;
    }
    if (document.documentElement.classList.contains("welten-world-switch-lock")) return;
    var mi = masterIdx();
    if (mi < 0) return;
    frames.forEach(function (f, j) {
      if (!f) return;
      if (j === mi) {
        hardShowFrame(f);
      } else {
        hardHideFrame(f);
        if (j === 0) quarantineMultiversum();
      }
    });
  }

  function soundKey(i) {
    return i === 0 ? "general" : i === 1 ? "nexora" : i === 2 ? "professional" : "freiraum";
  }

  function masterKey(i) {
    return WORLD_KEYS[i] || "general";
  }

  function worldSwitchKey(i) {
    return i === 0 ? "general" : i === 1 ? "nexora" : i === 2 ? "vertex" : "freiraum";
  }

  function profileForIndex(i) {
    return PROFILE[soundKey(i)] || PROFILE.general;
  }

  function isOurFrame(win) {
    return isTrustedMessageSource(win);
  }

  function isTrustedMessageSource(win) {
    if (!win) return false;
    for (var i = 0; i < frames.length; i++) {
      try {
        var outer = frames[i].contentWindow;
        if (!outer) continue;
        if (outer === win) return true;
      } catch (e) {}
    }
    return false;
  }

  function worldIndexFromKey(worldKey) {
    var map = {
      general: 0,
      multiversum: 0,
      nexora: 1,
      professional: 2,
      vertex: 2,
      freiraum: 3,
    };
    return map[worldKey];
  }

  function framePageName(path) {
    var parts = (path || "").split("/");
    return parts[parts.length - 1] || "";
  }

  function frameNeedsReset(f, i) {
    if (!f || i < 0 || i > 3) return false;
    var expected = FRAME_PAGES[i];
    try {
      var file = framePageName(f.contentWindow.location.pathname);
      if (!file || SHELL_PAGES.indexOf(file) >= 0) return true;
      if (file !== expected && file.toLowerCase() !== expected.toLowerCase()) return true;
      return false;
    } catch (e) {
      return !frameHasSrc(f) || f.src.indexOf(expected) < 0;
    }
  }

  function resetFrame(i) {
    var f = frames[i];
    if (!f) return;
    resetAttempts[i] = (resetAttempts[i] || 0) + 1;
    if (resetAttempts[i] > 2) return;
    f.src = FRAME_PAGES[i];
    loaded[i] = false;
  }

  function ensureSingleBar() {
    var preferred = document.querySelector(".mv4-shell-chrome > .mv4-bar");
    var bars = document.querySelectorAll("body > .mv4-bar, body .mv4-bar");
    var kept = preferred || null;
    for (var i = 0; i < bars.length; i++) {
      var el = bars[i];
      if (el.closest && el.closest(".mv4-frame")) continue;
      if (kept) {
        if (el === kept) continue;
        try {
          el.remove();
        } catch (eRem) {}
        continue;
      }
      kept = el;
    }
    if (kept) bar = kept;
    else bar = document.querySelector(".mv4-bar");
  }

  function ensureSingleChrome() {
    ensureSingleBar();
    var keptStack =
      document.getElementById("mv4ShellChrome") || document.querySelector(".mv4-shell-chrome");
    document.querySelectorAll(".mv4-shell-chrome, #mv4ShellChrome").forEach(function (stack) {
      if (!stack || stack === keptStack) return;
      if (stack.closest && stack.closest(".mv4-frame")) return;
      try {
        stack.remove();
      } catch (eStack) {}
    });
    document.querySelectorAll("body > .mv4-global-header").forEach(function (hdr) {
      if (hdr.closest && hdr.closest(".mv4-shell-chrome")) return;
      try {
        hdr.remove();
      } catch (eHdr) {}
    });
    document.querySelectorAll("body > .mv4-bar").forEach(function (b) {
      if (b.closest && b.closest(".mv4-shell-chrome")) return;
      try {
        b.remove();
      } catch (eBar) {}
    });
  }

  function getBar() {
    if (!bar || !document.body.contains(bar)) {
      bar = document.querySelector(".mv4-bar");
    }
    return bar;
  }

  function purgeSwitchOverlays(keepLock) {
    document.querySelectorAll(".welten-world-switch").forEach(function (el) {
      try {
        el.remove();
      } catch (e) {}
    });
    if (!keepLock) {
      document.documentElement.classList.remove("welten-world-switch-lock");
    }
  }

  function clearInlineFrameHide(f) {
    if (!f || !f.style) return;
    try {
      f.style.removeProperty("opacity");
      f.style.removeProperty("visibility");
      f.style.removeProperty("pointer-events");
      f.style.removeProperty("clip-path");
      f.style.removeProperty("z-index");
      f.style.removeProperty("transform");
      f.style.removeProperty("content-visibility");
    } catch (eClear) {}
  }

  function releaseMultiversumQuarantine() {
    var f = frames[0];
    if (!f) return;
    f.removeAttribute("data-mv-quarantined");
  }

  function quarantineMultiversum() {
    var f = frames[0];
    if (!f) return;
    f.setAttribute("data-mv-quarantined", "1");
    hardHideFrame(f);
    postFrame(f, { type: "portfolio-world-pause", paused: true });
    postFrame(f, { type: "portfolio-cleanup-transition" });
    postFrame(f, { type: "mv-stop-iframe-bgm" });
    postFrame(f, { type: "mv-galaxy-hard-hide" });
    try {
      var w = f.contentWindow;
      if (w && typeof w.__mvStopIframeWorldBgm === "function") w.__mvStopIframeWorldBgm();
    } catch (eQ) {}
  }

  /* Inline hard-hide: warm Multiversum iframe can still composite under contested CSS lock. */
  function hardHideFrame(f) {
    if (!f) return;
    f.classList.remove("is-active");
    f.classList.add("is-leaving", "is-paused");
    f.style.pointerEvents = "none";
    f.setAttribute("aria-hidden", "true");
    try {
      f.style.setProperty("opacity", "0", "important");
      f.style.setProperty("visibility", "hidden", "important");
      f.style.setProperty("pointer-events", "none", "important");
      f.style.setProperty("clip-path", "inset(100%)", "important");
      f.style.setProperty("z-index", "0", "important");
      /* Extra compositor kill without blanking src (Galaxy Walk stays warm) */
      f.style.setProperty("transform", "translate3d(-200%, 0, 0)", "important");
      f.style.setProperty("content-visibility", "hidden", "important");
    } catch (eHide) {}
  }

  function hardShowFrame(f) {
    if (!f) return;
    f.classList.add("is-active");
    f.classList.remove("is-leaving", "is-paused");
    f.style.pointerEvents = "auto";
    f.removeAttribute("aria-hidden");
    clearInlineFrameHide(f);
    try {
      f.style.removeProperty("content-visibility");
    } catch (eShow) {}
  }

  function forceRevealActiveFrame() {
    document.documentElement.classList.remove("mv-shell-booting", "welten-world-switch-lock");
    window.__worldTransitionRunning = false;
    window.__mvInWorldSwitch = false;
    switching = false;
    pendingSwitchTarget = -1;
    switchLockSince = 0;
    purgeSwitchOverlays(false);
    var i = masterIdx();
    if (i < 0) i = defaultWorld;
    frames.forEach(function (f, j) {
      if (!f) return;
      if (j === i) {
        f.removeAttribute("data-mv-quarantined");
        hardShowFrame(f);
      } else {
        hardHideFrame(f);
      }
    });
    forceEnableWorldButtons();
  }

  function clearSwitchLock() {
    purgeSwitchOverlays(false);
    switchLockSince = 0;
    pendingSwitchTarget = -1;
    if (window.WeltenWorldSwitchPreview && typeof window.WeltenWorldSwitchPreview.abort === "function") {
      window.WeltenWorldSwitchPreview.abort(true);
    }
    unlockShell();
  }

  function recoverStuckSwitch() {
    var shellBar = getBar();
    var locked = document.documentElement.classList.contains("welten-world-switch-lock");
    var staleOverlay = document.querySelector(".welten-world-switch.is-entering, .welten-world-switch.is-exiting");
    if (staleOverlay && !locked && !switching) {
      purgeSwitchOverlays(false);
    }
    /* Preview/abort may drop lock while switch still runs — re-lock, never bare unlock
       (that left Multiversum able to paint with no cover). */
    if (switching && !locked) {
      document.documentElement.classList.add("welten-world-switch-lock");
      switchLockSince = switchLockSince || Date.now();
      return;
    }
    if (switching && locked && switchLockSince && Date.now() - switchLockSince > 1800) {
      pendingSwitchTarget = -1;
      enforceFrameExclusivity();
      purgeSwitchOverlays(false);
      unlockShell();
      forceRevealActiveFrame();
      return;
    }
    if (locked && !switching && switchLockSince && Date.now() - switchLockSince > 1200) {
      pendingSwitchTarget = -1;
      enforceFrameExclusivity();
      purgeSwitchOverlays(false);
      unlockShell();
      forceRevealActiveFrame();
      return;
    }
    if (locked && !switching && !switchLockSince) {
      purgeSwitchOverlays(false);
      unlockShell();
      forceRevealActiveFrame();
      return;
    }
    if (shellBar) {
      forceEnableWorldButtons();
      shellBar.style.pointerEvents = "auto";
      if (!switching && !locked) {
        shellBar.style.pointerEvents = "";
      }
      requestAnimationFrame(setBarHeight);
    }
    if (!switching && !locked) {
      enforceFrameExclusivity();
    }
  }

  function parseShellRoute() {
    if (Router && typeof Router.parsePath === "function") {
      return Router.parsePath(location.pathname || "/");
    }
    var p = (location.pathname || "/").replace(/\/$/, "") || "/";
    return {
      worldIdx: defaultWorld,
      worldKey: WORLD_KEYS[defaultWorld] || "general",
      chapter: ROUTE_CHAPTER[p] || "home",
      known: true,
    };
  }

  function buildShellPath(worldIdx, chapter) {
    if (Router && typeof Router.buildPath === "function") {
      return Router.buildPath(worldIdx, chapter);
    }
    var chapterPaths = {
      home: "/",
      projects: "/projekte",
      leistungen: "/leistungen",
      about: "/ueber-mich",
      contact: "/kontakt",
      offerte: "/offerte",
    };
    return chapterPaths[chapter] || "/";
  }

  function syncShellUrl(worldIdx, chapter, mode) {
    if (!isLiveShell) return;
    worldIdx = typeof worldIdx === "number" ? worldIdx : activeIdx();
    if (worldIdx < 0) worldIdx = defaultWorld;
    chapter = CHAPTERS.indexOf(chapter) >= 0 ? chapter : sharedChapter || "home";
    var path = buildShellPath(worldIdx, chapter);
    var current = (location.pathname || "/").replace(/\/$/, "") || "/";
    var next = path.replace(/\/$/, "") || "/";
    if (current === next) {
      if (window.WeltenShellSEO && typeof window.WeltenShellSEO.apply === "function") {
        window.WeltenShellSEO.apply(chapter, currentLang, worldIdx);
      }
      updateWorldLinkState(worldIdx);
      return;
    }
    suppressingHistory = true;
    try {
      var state = { worldIdx: worldIdx, chapter: chapter };
      if (mode === "push") history.pushState(state, "", path);
      else history.replaceState(state, "", path);
    } catch (eHist) {}
    suppressingHistory = false;
    if (window.WeltenShellSEO && typeof window.WeltenShellSEO.apply === "function") {
      window.WeltenShellSEO.apply(chapter, currentLang, worldIdx);
    }
    updateWorldLinkState(worldIdx);
  }

  function updateWorldLinkState(worldIdx) {
    var shellBar = getBar();
    if (!shellBar) return;
    shellBar.querySelectorAll(WORLD_BTN_SEL).forEach(function (el) {
      var idx = parseInt(el.getAttribute("data-iframe"), 10);
      var on = idx === worldIdx;
      el.classList.toggle("is-active", on);
      if (el.tagName === "A") {
        try {
          el.setAttribute("href", buildShellPath(idx, sharedChapter || "home"));
        } catch (eHref) {}
        if (on) el.setAttribute("aria-current", "page");
        else el.removeAttribute("aria-current");
      }
    });
  }

  function chapterFromShellPath() {
    return parseShellRoute().chapter || "home";
  }

  function applyShellRoute(opts) {
    if (!isLiveShell) return;
    opts = opts || {};
    var route = parseShellRoute();
    var ch = opts.forceHome ? "home" : route.chapter || "home";
    var worldIdx = typeof route.worldIdx === "number" ? route.worldIdx : defaultWorld;
    sharedChapter = ch;
    if (window.WeltenShellSEO && typeof window.WeltenShellSEO.apply === "function") {
      window.WeltenShellSEO.apply(ch, currentLang, worldIdx);
    }
    updateWorldLinkState(worldIdx);
    syncShellUrl(worldIdx, ch, "replace");

    function sendChapter(f) {
      if (!f) return;
      function send() {
        applyChapter(f, ch);
      }
      if (frameIsReady(f)) send();
      else f.addEventListener("load", send, { once: true });
    }

    var current = activeIdx();
    if (current < 0) current = defaultWorld;

    /* Initial / Popstate: ohne FX-Switch, sonst doppelte Bars / Multiversum-Glitch */
    if (worldIdx !== current || opts.forceWorld) {
      if (frameNeedsReset(frames[worldIdx], worldIdx)) resetFrame(worldIdx);
      /* force: intentional route change may differ from current master-world */
      switchToWorldIndex(worldIdx, { force: true, routeIntent: true }).then(function () {
        sendChapter(frames[worldIdx]);
        setTimeout(function () {
          sendChapter(frames[worldIdx]);
          ensureSingleChrome();
        }, 180);
        if (!switching && pendingSwitchTarget < 0) unlockShell();
      });
      return;
    }
    sendChapter(frames[worldIdx] || frames[current]);
    setTimeout(function () {
      sendChapter(frames[worldIdx] || frames[current]);
      ensureSingleChrome();
    }, 180);
  }

  function postFrame(f, data) {
    if (!f || !f.contentWindow) return;
    try {
      f.contentWindow.postMessage(data, "*");
    } catch (e) {}
  }

  function resumeAudio() {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!window.__mv4AudioCtx) window.__mv4AudioCtx = new Ctx();
      if (window.__mv4AudioCtx.state === "suspended") window.__mv4AudioCtx.resume();
    } catch (e) {}
  }

  function prefersReducedMotion() {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
      return false;
    }
  }

  function normalizeLang(lang) {
    if (window.WeltenTranslations) return window.WeltenTranslations.normalizeLang(lang);
    lang = String(lang || "de").toLowerCase();
    if (lang === "en" || lang === "it" || lang === "fr") return lang;
    return "de";
  }

  function loadPrefs() {
    try {
      currentLang = normalizeLang(localStorage.getItem(LANG_KEY) || "de");
    } catch (e) {}
    try {
      var storedFx = localStorage.getItem(FX_KEY);
      if (storedFx === "0") effectsOn = false;
      else if (storedFx === "1") effectsOn = true;
      else effectsOn = !prefersReducedMotion();
    } catch (e2) {
      effectsOn = !prefersReducedMotion();
    }
  }

  function saveLang() {
    try {
      localStorage.setItem(LANG_KEY, currentLang);
    } catch (e) {}
  }

  function saveEffects() {
    try {
      localStorage.setItem(FX_KEY, effectsOn ? "1" : "0");
    } catch (e) {}
  }

  function applyEffectsState() {
    var off = !effectsOn;
    window.__mvEffectsOn = effectsOn;
    document.documentElement.classList.toggle("mv-effects-off", off);
    document.body.classList.toggle("mv-effects-off", off);
    var reduce = off || prefersReducedMotion();
    document.documentElement.classList.toggle("welten-reduce-effects", reduce);
    document.body.classList.toggle("welten-reduce-effects", reduce);
    frames.forEach(function (f) {
      postFrame(f, { type: "portfolio-effects", on: effectsOn });
      if (off) {
        try {
          var win = f.contentWindow;
          if (win && typeof win.__mvStopIframeWorldBgm === "function") {
            win.__mvStopIframeWorldBgm();
          }
          postFrame(f, { type: "mv-stop-iframe-bgm" });
        } catch (eStopFx) {}
      }
    });
    document.dispatchEvent(new CustomEvent("mv-effects-change", { detail: { on: effectsOn } }));
  }

  function updateFxBtn() {
    if (!fxBtn) return;
    var T = window.WeltenTranslations;
    var l = currentLang;
    var fxOn = T ? T.t("shell.fxOn", l) : "Effekte: Ein";
    var fxOff = T ? T.t("shell.fxOff", l) : "Effekte: Aus";
    var ariaOn = T ? T.t("shell.fxAriaOn", l) : "Visuelle Effekte deaktivieren";
    var ariaOff = T ? T.t("shell.fxAriaOff", l) : "Visuelle Effekte aktivieren";
    var fxTitle = T ? T.t("shell.fxTitle", l) : "Visuelle Effekte und Sound beim Weltenwechsel";
    fxBtn.textContent = effectsOn ? fxOn : fxOff;
    fxBtn.classList.toggle("is-on", effectsOn);
    fxBtn.setAttribute("aria-pressed", effectsOn ? "true" : "false");
    fxBtn.setAttribute("aria-label", effectsOn ? ariaOn : ariaOff);
    fxBtn.setAttribute("title", fxTitle);
    updateShellChrome();
  }

  function updateShellChrome() {
    var T = window.WeltenTranslations;
    var l = currentLang;
    var bar = T ? T.t("shell.bar", l) : "Welten & Steuerung";
    var worlds = T ? T.t("shell.worlds", l) : "Welten wechseln";
    var language = T ? T.t("shell.language", l) : "Sprache";
    var barEl = document.querySelector(".mv4-bar");
    if (barEl) barEl.setAttribute("aria-label", bar);
    var worldsNav = document.querySelector(".mv4-worlds");
    if (worldsNav) worldsNav.setAttribute("aria-label", worlds);
    var flags = document.querySelector(".mv4-flags");
    if (flags) flags.setAttribute("aria-label", language);
    if (T) T.applyHtmlLang(document, l);
    if (window.WeltenShellI18n && typeof window.WeltenShellI18n.apply === "function") {
      window.WeltenShellI18n.apply(l);
    }
  }

  function updateFlags() {
    document.querySelectorAll(".mv4-flag").forEach(function (btn) {
      var active = btn.dataset.lang === currentLang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  var broadcastTimer = 0;

  function broadcastLangNow() {
    try {
      localStorage.setItem(LANG_KEY, currentLang);
    } catch (e) {}
    if (window.WeltenTranslations) {
      window.WeltenTranslations.applyHtmlLang(document, currentLang);
    }
    if (window.WeltenShellI18n && typeof window.WeltenShellI18n.apply === "function") {
      window.WeltenShellI18n.apply(currentLang);
    }
    frames.forEach(function (f) {
      if (!frameHasSrc(f)) return;
      postFrame(f, { type: "portfolio-preview-lang", lang: currentLang });
      postFrame(f, { type: "alx-preview-sync", lang: currentLang, world: mapWorldForForm(activeIdx()) });
    });
  }

  function broadcastLang() {
    if (broadcastTimer) window.clearTimeout(broadcastTimer);
    broadcastTimer = window.setTimeout(function () {
      broadcastTimer = 0;
      broadcastLangNow();
    }, 32);
  }

  function mapWorldForForm(i) {
    var k = soundKey(i);
    return k === "professional" ? "professional" : k;
  }

  function injectAudioGestureBridge(f, i) {
    if (i !== 0) return;
    try {
      var win = f.contentWindow;
      var doc = f.contentDocument;
      if (!win) return;
      if (win.__mvMasterAudioRelayBound) return;
      win.__mvMasterAudioRelayBound = true;
      function isExcluded(target) {
        if (!target || !target.closest) return false;
        return !!target.closest('a[href^="tel:"], a[href^="mailto:"], a[href^="sms:"]');
      }
      function relay(ev) {
        if (ev && isExcluded(ev.target)) return;
        try {
          if (window.__mvInWorldSwitch || window.__worldTransitionRunning) return;
          if (document.documentElement.classList.contains("welten-world-switch-lock")) return;
          if (
            win.parent &&
            win.parent.WeltenWorldAudioTest &&
            typeof win.parent.WeltenWorldAudioTest.bootFromUserGesture === "function"
          ) {
            win.parent.WeltenWorldAudioTest.bootFromUserGesture(null);
          }
        } catch (eRelay) {}
      }
      win.addEventListener("pointerdown", relay, true);
      win.addEventListener("click", relay, true);
      win.addEventListener("touchstart", relay, true);
      win.addEventListener("wheel", relay, true);
      win.addEventListener(
        "scroll",
        function () {
          relay(null);
        },
        true
      );
      if (doc) {
        doc.addEventListener("pointerdown", relay, true);
        doc.addEventListener("click", relay, true);
        doc.addEventListener("touchstart", relay, true);
        doc.addEventListener("wheel", relay, true);
      }
    } catch (eBridge) {}
  }

  function injectProfiles(f, i) {
    injectAudioGestureBridge(f, i);
    injectPreviewShellCss(f);
    injectMenuBridge(f);
    try {
      var d = f.contentDocument;
      if (!d) return;
      var src = profileForIndex(i);
      d.querySelectorAll(".home-portrait-card img, #contactPhoto, .contact-photo, #heroPhoto").forEach(function (img) {
        img.removeAttribute("srcset");
        img.src = src;
        img.style.filter = "none";
        img.style.transform = "none";
        img.style.objectFit = "cover";
        img.style.objectPosition = "center top";
        img.style.opacity = "1";
        img.style.display = "";
      });
      postFrame(f, { type: "portfolio-apply-portraits", src: src });
    } catch (e) {}
  }

  function frameIsReady(f) {
    try {
      var d = f.contentDocument;
      return !!(d && (d.readyState === "interactive" || d.readyState === "complete"));
    } catch (err) {
      return false;
    }
  }

  function frameHasSrc(f) {
    return !!(f && f.src && f.src.indexOf("about:blank") === -1);
  }

  function lockShell(targetWorld) {
    switching = true;
    document.documentElement.classList.add("welten-world-switch-lock");
    window.__worldTransitionRunning = true;
    window.__mvInWorldSwitch = true;
    switchLockSince = Date.now();
    try {
      document.dispatchEvent(
        new CustomEvent("welten-audio-switch-start", { detail: { world: targetWorld || "" } })
      );
    } catch (eAudioStart) {}
    var shellBar = getBar();
    if (shellBar) {
      shellBar.setAttribute("aria-busy", "true");
      shellBar.style.pointerEvents = "";
    }
  }

  function unlockShell() {
    switching = false;
    window.__worldTransitionRunning = false;
    window.__mvInWorldSwitch = false;
    if (pendingSwitchTarget < 0) {
      document.documentElement.classList.remove("welten-world-switch-lock");
      switchLockSince = 0;
    }
    var shellBar = getBar();
    if (shellBar) {
      shellBar.removeAttribute("aria-busy");
      shellBar.style.pointerEvents = "";
      shellBar.querySelectorAll(WORLD_BTN_SEL).forEach(function (b) {
        b.disabled = false;
        b.removeAttribute("aria-disabled");
      });
    }
    setBarHeight();
  }

  function forceEnableWorldButtons() {
    var shellBar = getBar();
    if (!shellBar) return;
    shellBar.style.pointerEvents = "auto";
    shellBar.removeAttribute("aria-busy");
    shellBar.querySelectorAll(WORLD_BTN_SEL).forEach(function (b) {
      b.disabled = false;
      b.removeAttribute("aria-disabled");
      b.style.pointerEvents = "auto";
    });
  }

  function isCoarseMobileShell() {
    try {
      return window.matchMedia("(max-width: 1024px)").matches;
    } catch (e) {
      return window.innerWidth <= 1024;
    }
  }

  function activateWorldButton(btn, e) {
    if (!btn) return;
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    var now = Date.now();
    if (now - lastWorldBtnAt < 80) return;
    lastWorldBtnAt = now;
    recoverStuckSwitch();
    /* Overlay NICHT hier purgen — sonst entsteht eine kurze ungecoverte Lücke,
       bevor der neue Wechsel/Cover startet. purgeSwitchOverlays() nur noch
       innerhalb von switchTo()/recoverStuckSwitch(), nachdem der Lock/Cover
       für den neuen Wechsel bereits läuft. */
    forceEnableWorldButtons();
    var idx = parseInt(btn.getAttribute("data-iframe"), 10);
    if (!isFinite(idx)) return;
    switchTo(idx);
  }

  function setMaster(i) {
    if (switching && pendingSwitchTarget >= 0 && i !== pendingSwitchTarget) return false;
    var mw = document.body.getAttribute("data-master-world") || "";
    var curIdx = WORLD_KEYS.indexOf(mw);
    if (!switching && pendingSwitchTarget < 0 && i === 0 && curIdx > 0) return false;
    document.body.setAttribute("data-master-world", masterKey(i));
    updateWorldLinkState(i);
    updateFlags();
    if (!switching && !document.documentElement.classList.contains("welten-world-switch-lock")) {
      enforceFrameExclusivity();
    }
    return true;
  }

  function readChapter(f) {
    try {
      var d = f.contentDocument;
      if (!d || !d.body) return null;
      var b = d.body.getAttribute("data-current-slide");
      if (b && CHAPTERS.indexOf(b) >= 0) return b;
    } catch (err) {}
    return null;
  }

  function lockRouteFromUrl(ms) {
    routeBootUntil = Date.now() + (ms || 2800);
  }

  function routeBootActive() {
    return Date.now() < routeBootUntil;
  }

  function applyChapter(f, id) {
    var ch = CHAPTERS.indexOf(id) >= 0 ? id : "home";
    if (!f) return;
    postFrame(f, { type: "portfolio-go-chapter", chapter: ch });
    var tries = 0;
    function tryApply() {
      try {
        var d = f.contentDocument;
        if (!d) throw new Error("no doc");
        if (d.body && d.body.getAttribute("data-current-slide") === ch) return;
        var link = d.querySelector('.menu-links a[data-go="' + ch + '"]');
        if (link) {
          link.click();
          return;
        }
        var btn =
          d.querySelector('.experience-step[data-go="' + ch + '"]') ||
          d.querySelector('[data-go="' + ch + '"]');
        if (btn) {
          btn.click();
          return;
        }
      } catch (e1) {}
      if (++tries < 14) setTimeout(tryApply, 40);
    }
    tryApply();
  }

  function revealActiveFrame(i) {
    var f = frames[i];
    if (!f) return;
    postFrame(f, { type: "portfolio-world-reveal", world: soundKey(i) });
    try {
      /* Iframe-Viewport nach Wake invalidate — sonst bleibt DNA-Hero-svh falsch */
      var prev = f.style.height;
      var box = f.getBoundingClientRect();
      if (box.height > 0) {
        f.style.height = Math.round(box.height + 1) + "px";
        void f.offsetHeight;
        f.style.height = prev || "";
      }
      if (f.contentWindow) {
        f.contentWindow.dispatchEvent(new Event("resize"));
      }
    } catch (eNudge) {}
  }

  function sendWorldLiveSignals(f, j) {
    if (!f || j !== masterIdx()) return;
    if (switching || pendingSwitchTarget >= 0) return;
    if (document.documentElement.classList.contains("welten-world-switch-lock")) return;
    var masterLive = document.body.getAttribute("data-master-world") || "";
    if (masterLive && masterLive !== masterKey(j)) return;
    var token = String(j) + "-" + (f.src || f.getAttribute("data-lazy-src") || "");
    if (f.dataset.mvWorldLive === token) return;
    f.dataset.mvWorldLive = token;
    injectAudioGestureBridge(f, j);
    injectProfiles(f, j);
    postFrame(f, { type: "portfolio-world-enter", world: soundKey(j) });
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(function () {
        postFrame(f, { type: "portfolio-world-reveal", world: soundKey(j) });
      });
    } else {
      postFrame(f, { type: "portfolio-world-reveal", world: soundKey(j) });
    }
  }

  function signalFrameReady(f, j) {
    if (!f) return;
    try {
      var file = framePageName(f.contentWindow.location.pathname);
      if (SHELL_PAGES.indexOf(file) >= 0) {
        resetFrame(j);
        return;
      }
      resetAttempts[j] = 0;
    } catch (e) {}
    ensureSingleChrome();
    broadcastLang();
    postFrame(f, { type: "portfolio-effects", on: effectsOn });
    var mi = masterIdx();
    var isLiveTarget =
      j === mi &&
      !switching &&
      pendingSwitchTarget < 0 &&
      !document.documentElement.classList.contains("welten-world-switch-lock");
    if (isLiveTarget) {
      sendWorldLiveSignals(f, j);
      applyChapter(f, sharedChapter || parseShellRoute().chapter || "home");
    } else {
      if (j === 0 && f.getAttribute("data-mv-quarantined") === "1") {
        quarantineMultiversum();
        return;
      }
      /* Live-Multiversum nie pausieren/hard-hide — verhindert Galaxy-Deadlock beim Boot */
      if (j === 0 && mi === 0 && f.classList.contains("is-active") && f.getAttribute("data-mv-quarantined") !== "1") {
        sendWorldLiveSignals(f, 0);
        return;
      }
      postFrame(f, { type: "portfolio-world-pause", paused: true });
      postFrame(f, { type: "portfolio-cleanup-transition" });
      postFrame(f, { type: "mv-stop-iframe-bgm" });
      if (j === 0) postFrame(f, { type: "mv-galaxy-hard-hide" });
    }
  }

  function primeActiveFrame() {
    var i = masterIdx();
    if (i < 0) return;
    var f = frames[i];
    if (!f || !frameHasSrc(f) || !frameIsReady(f)) return;
    sendWorldLiveSignals(f, i);
  }

  function applyActive(i, opts) {
    opts = opts || {};
    if (!canApplyWorld(i, opts)) return false;
    frames.forEach(function (f, j) {
      var on = j === i;
      if (on) {
        if (switching) {
          /* Under cover: mark target ready but keep hard-hidden until finishTransition
             removes the lock — no Multiversum peek, no mid-cover enter. */
          f.classList.add("is-active");
          f.classList.remove("is-leaving");
          f.classList.add("is-paused");
          f.style.pointerEvents = "none";
          f.setAttribute("aria-hidden", "true");
          try {
            f.style.setProperty("opacity", "0", "important");
            f.style.setProperty("visibility", "hidden", "important");
            f.style.setProperty("clip-path", "inset(100%)", "important");
            f.style.setProperty("transform", "translate3d(-200%, 0, 0)", "important");
          } catch (eKeepCover) {}
        } else {
          hardShowFrame(f);
          f.removeAttribute("data-mv-world-live");
          postFrame(f, { type: "portfolio-world-enter", world: soundKey(j) });
          applyChapter(f, sharedChapter);
          if (frameIsReady(f)) injectProfiles(f, j);
          else f.addEventListener("load", function () { injectProfiles(f, j); }, { once: true });
        }
      } else {
        hardHideFrame(f);
        postFrame(f, { type: "portfolio-world-pause", paused: true });
        postFrame(f, { type: "portfolio-cleanup-transition" });
        postFrame(f, { type: "mv-stop-iframe-bgm" });
        if (j === 0) postFrame(f, { type: "mv-galaxy-hard-hide" });
      }
    });
    setMaster(i);
    broadcastLang();
    if (isLiveShell) {
      syncShellUrl(i, sharedChapter, "replace");
    }
    if (!switching) {
      unlockShell();
      forceEnableWorldButtons();
      setTimeout(function () {
        var f = frames[i];
        if (f) injectProfiles(f, i);
      }, 0);
    }
    return true;
  }

  function loadFrame(i) {
    return new Promise(function (resolve) {
      var f = frames[i];
      if (!f) return resolve();
      if (loaded[i] && frameHasSrc(f)) return resolve();
      var lazy = f.getAttribute("data-lazy-src");
      if (!lazy) {
        loaded[i] = true;
        return resolve();
      }
      if (frameHasSrc(f)) {
        loaded[i] = true;
        return resolve();
      }
      function finish() {
        loaded[i] = true;
        try {
          postFrame(f, { type: "portfolio-preview-lang", lang: currentLang });
          postFrame(f, { type: "alx-preview-sync", lang: currentLang, world: mapWorldForForm(i) });
        } catch (eLoad) {}
        resolve();
      }
      f.addEventListener("load", finish, { once: true });
      f.src = lazy;
      setTimeout(finish, 8000);
    });
  }

  function preloadFrame(i) {
    if (i === defaultWorld || loaded[i]) return;
    var f = frames[i];
    if (!f) return;
    var lazy = f.getAttribute("data-lazy-src");
    if (!lazy || frameHasSrc(f)) {
      if (frameHasSrc(f)) loaded[i] = true;
      return;
    }
    f.addEventListener(
      "load",
      function () {
        loaded[i] = true;
      },
      { once: true }
    );
    f.src = lazy;
  }

  function switchToWorldIndex(i, opts) {
    opts = opts || {};
    var genAtCall = typeof opts.gen === "number" ? opts.gen : switchGeneration;
    return loadFrame(i).then(function () {
      if (opts.requireGen && genAtCall !== switchGeneration) return false;
      if (
        !opts.force &&
        pendingSwitchTarget >= 0 &&
        i !== pendingSwitchTarget
      ) {
        return false;
      }
      return applyActive(i, opts);
    });
  }

  window.switchToWorldIndex = switchToWorldIndex;
  window.preloadWorldIndex = loadFrame;
  window.mv4ActiveFrameIndex = activeIdx;

  function switchTo(i, opts) {
    opts = opts || {};
    if (i < 0 || i > 3) return;
    forceEnableWorldButtons();
    recoverStuckSwitch();
    if (switching) {
      if (document.documentElement.classList.contains("welten-world-switch-lock")) {
        if (window.WeltenWorldSwitchPreview && typeof window.WeltenWorldSwitchPreview.abort === "function") {
          window.WeltenWorldSwitchPreview.abort(true);
        }
        /* Keep CSS lock while aborting — avoid Multiversum peek between abort and new cover */
        purgeSwitchOverlays(true);
        document.documentElement.classList.add("welten-world-switch-lock");
      } else {
        unlockShell();
      }
    }
    ensureSingleChrome();
    if (frameNeedsReset(frames[i], i)) {
      resetFrame(i);
    }
    var prev = activeIdx();
    if (prev === i) {
      unlockShell();
      applyChapter(frames[i], sharedChapter);
      if (isLiveShell) syncShellUrl(i, sharedChapter, "push");
      return;
    }

    switchGeneration += 1;
    var myGen = switchGeneration;
    pendingSwitchTarget = i;

    /* AudioContext nur unlocken — keine Welt-BGM hier (sonst Multiversum-Bleed). */
    resumeAudio();
    lockShell(masterKey(i));
    /* Sofort Shell-Theme wechseln — nicht erst in applyActive nach Load/Cover.
       Verhindert Multiversum-Bar/Theme-Bleed während der Transition. */
    setMaster(i);
    setGlobalMenuExpanded(false);
    if (i === 0) releaseMultiversumQuarantine();
    else quarantineMultiversum();
    /* Sofort ALLE Nicht-Ziel-Frames hart ausblenden/pausieren — kein Multiversum-Flash,
       kein BGM-Bleed. Multiversum (0) NICHT blanken (Galaxy Walk sonst ~20s neu). */
    frames.forEach(function (f, j) {
      if (!f || j === i) return;
      hardHideFrame(f);
      postFrame(f, { type: "portfolio-world-pause", paused: true });
      postFrame(f, { type: "portfolio-cleanup-transition" });
      postFrame(f, { type: "mv-stop-iframe-bgm" });
      if (j === 0) postFrame(f, { type: "mv-galaxy-hard-hide" });
      try {
        var win = f.contentWindow;
        if (win && typeof win.__mvStopIframeWorldBgm === "function") {
          win.__mvStopIframeWorldBgm();
        }
      } catch (eStopAll) {}
    });
    /* Extra hard-stop Multiversum-Audio (Frame 0) */
    if (i !== 0 && frames[0]) {
      hardHideFrame(frames[0]);
      postFrame(frames[0], { type: "mv-galaxy-hard-hide" });
      try {
        var mvWin = frames[0].contentWindow;
        if (mvWin && typeof mvWin.__mvStopIframeWorldBgm === "function") {
          mvWin.__mvStopIframeWorldBgm();
        }
      } catch (eStop) {}
      postFrame(frames[0], { type: "mv-stop-iframe-bgm" });
    }
    /* Galaxy/Deep-Link: Kapitel nicht mit vorheriger Welt überschreiben */
    if (!opts.preserveChapter) {
      var c = readChapter(frames[prev]);
      if (c) sharedChapter = c;
    }

    var wKey = worldSwitchKey(i);
    var transitionDone = false;
    var frameReady = loadFrame(i);

    function finishRevealSignals() {
      if (myGen !== switchGeneration) return;
      frames.forEach(function (f, j) {
        if (!f || j === i) return;
        hardHideFrame(f);
        if (j === 0) quarantineMultiversum();
      });
      setMaster(i);
      try {
        document.dispatchEvent(
          new CustomEvent("welten-audio-switch-end", { detail: { world: masterKey(i) } })
        );
      } catch (eAudioEnd) {}
      var fActive = frames[i];
      if (fActive) {
        fActive.removeAttribute("data-mv-world-live");
        postFrame(fActive, { type: "portfolio-world-enter", world: soundKey(i) });
        applyChapter(fActive, sharedChapter);
        if (frameIsReady(fActive)) injectProfiles(fActive, i);
        else
          fActive.addEventListener(
            "load",
            function () {
              injectProfiles(fActive, i);
            },
            { once: true }
          );
      }
      revealActiveFrame(i);
      try {
        var fReveal = frames[i];
        if (fReveal) {
          setTimeout(function () {
            if (myGen !== switchGeneration) return;
            if (masterIdx() !== i) return;
            postFrame(fReveal, { type: "portfolio-world-reveal", world: soundKey(i) });
          }, 80);
        }
      } catch (eReveal) {}
      requestAnimationFrame(setBarHeight);
      enforceFrameExclusivity();
      if (opts.afterReveal && typeof opts.afterReveal === "function") {
        try {
          opts.afterReveal();
        } catch (eAfter) {}
      }
    }

    function commitWorldSwitch() {
      if (myGen !== switchGeneration) return;
      if (i !== 0) quarantineMultiversum();
      else releaseMultiversumQuarantine();
      frames.forEach(function (f, j) {
        if (!f) return;
        if (j === i) hardShowFrame(f);
        else hardHideFrame(f);
      });
      setMaster(i);
      pendingSwitchTarget = -1;
      purgeSwitchOverlays(true);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          if (myGen !== switchGeneration) return;
          enforceFrameExclusivity();
          document.documentElement.classList.remove("welten-world-switch-lock");
          switchLockSince = 0;
          unlockShell();
          purgeSwitchOverlays(false);
          finishRevealSignals();
        });
      });
    }

    function finishTransition() {
      if (transitionDone) return;
      if (myGen !== switchGeneration) return;
      transitionDone = true;
      window.__wwsOnTransitionEnd = null;
      Promise.resolve(frameReady).then(function () {
        if (myGen !== switchGeneration) return;
        commitWorldSwitch();
      });
    }

    if (!effectsOn) {
      purgeSwitchOverlays(true);
      document.documentElement.classList.add("welten-world-switch-lock");
      if (window.WeltenWorldSwitchPreview && typeof window.WeltenWorldSwitchPreview.abort === "function") {
        window.WeltenWorldSwitchPreview.abort(true);
      }
      finishTransition();
      return;
    }

    window.__wwsOnTransitionEnd = finishTransition;

    try {
      if (window.WeltenWorldSwitchPreview && typeof window.WeltenWorldSwitchPreview.playSwitch === "function") {
        window.WeltenWorldSwitchPreview.playSwitch(wKey, i);
        var timing =
          (window.WeltenWorldSwitchPreview.getTimingForWorld &&
            window.WeltenWorldSwitchPreview.getTimingForWorld(wKey)) ||
          window.WeltenWorldSwitchPreview.timing ||
          { WORLD_TRANSITION_DURATION: 3000, COVER_MS: 1200, TITLE_HOLD: 1200, EXIT_MS: 400 };
        var safetyMs =
          (window.WeltenWorldSwitchPreview.getTransitionFailsafeMs &&
            window.WeltenWorldSwitchPreview.getTransitionFailsafeMs(timing)) ||
          timing.COVER_MS +
            timing.EFFECT_MS +
            timing.TITLE_FADE_IN +
            timing.TITLE_HOLD +
            timing.EXIT_MS +
            900;
        setTimeout(function () {
          if (myGen !== switchGeneration) return;
          if (switching) finishTransition();
        }, safetyMs);
        return;
      }
    } catch (errPlay) {
      finishTransition();
    }

    finishTransition();
    return;
  }

  loadPrefs();
  updateFxBtn();
  applyEffectsState();
  updateFlags();
  setBarHeight();
  window.addEventListener("resize", setBarHeight, { passive: true });
  if (typeof ResizeObserver !== "undefined") {
    var chromeStack = document.querySelector(".mv4-shell-chrome");
    if (chromeStack) {
      new ResizeObserver(function () {
        if (chromeMeasureLock) return;
        setBarHeight();
      }).observe(chromeStack);
    }
  }

  (function bindGlobalHeader() {
    var menuBtn = document.getElementById("mv4GlobalMenu");
    if (menuBtn && !menuBtn.dataset.mv4MenuBound) {
      menuBtn.dataset.mv4MenuBound = "1";
      menuBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        setGlobalMenuExpanded(true);
        postToActiveFrame({ type: "portfolio-open-menu" });
      });
    }
    document.querySelectorAll("[data-go-multiversum]").forEach(function (el) {
      if (el.dataset.mv4BrandBound === "1") return;
      el.dataset.mv4BrandBound = "1";
      el.addEventListener("click", goMultiversumHome);
    });
    window.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" && e.keyCode !== 27) return;
      setGlobalMenuExpanded(false);
      postToActiveFrame({ type: "portfolio-close-menu" });
    });
  })();

  var suppressWorldClickUntil = 0;

  function bindWorldButtons() {
    var shellBar = getBar();
    if (!shellBar || shellBar.dataset.mv4WorldBtnsBound === "1") return;
    var worlds = shellBar.querySelector(".mv4-worlds");
    if (!worlds) return;
    shellBar.dataset.mv4WorldBtnsBound = "1";
    worlds.addEventListener(
      "touchend",
      function (e) {
        if (e.target.closest("#mv4-fx") || e.target.closest(".mv4-flag")) return;
        var btn = e.target.closest(WORLD_BTN_SEL);
        if (!btn || !worlds.contains(btn)) return;
        e.preventDefault();
        activateWorldButton(btn, e);
        suppressWorldClickUntil = Date.now() + 500;
      },
      { passive: false }
    );
    worlds.addEventListener("click", function (e) {
      if (Date.now() < suppressWorldClickUntil) {
        e.preventDefault();
        return;
      }
      if (e.target.closest("#mv4-fx") || e.target.closest(".mv4-flag")) return;
      var btn = e.target.closest(WORLD_BTN_SEL);
      if (!btn || !worlds.contains(btn)) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
      activateWorldButton(btn, e);
    });
    worlds.querySelectorAll(WORLD_BTN_SEL).forEach(function (btn) {
      var idx = parseInt(btn.getAttribute("data-iframe"), 10);
      /* Prefetch nur den Button der Absicht (data-iframe) — nie Frame 0
         indirekt über andere Welten. Multiversum-Default überspringt preloadFrame. */
      function intentPreload() {
        if (!Number.isFinite(idx)) return;
        preloadFrame(idx);
      }
      btn.addEventListener("pointerdown", intentPreload, { passive: true });
      btn.addEventListener("touchstart", intentPreload, { passive: true });
      btn.addEventListener("focus", intentPreload);
    });
  }

  bindWorldButtons();
  document.addEventListener("DOMContentLoaded", function () {
    bindWorldButtons();
    forceEnableWorldButtons();
  });

  if (fxBtn) {
    fxBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      effectsOn = !effectsOn;
      saveEffects();
      updateFxBtn();
      applyEffectsState();
      resumeAudio();
    });
  }

  document.querySelectorAll(".mv4-flag").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      currentLang = normalizeLang(btn.dataset.lang || "de");
      saveLang();
      updateFlags();
      updateFxBtn();
      broadcastLang();
    });
  });

  var WORLD_SHELL_KEY_MAP = { nexora: "nexora", professional: "vertex", freiraum: "freiraum" };

  function clickWorldShellButton(worldKey) {
    var shellKey = WORLD_SHELL_KEY_MAP[worldKey];
    if (!shellKey) return false;
    var btn = document.querySelector('.mv4-worlds [data-world-key="' + shellKey + '"]');
    if (!btn) return false;
    btn.click();
    return true;
  }

  function postScrollToActiveFrame(targetHash, goChapter, targetIdx) {
    if (!targetHash && !goChapter) return;
    var tries = 0;
    function send() {
      tries += 1;
      if (switching || document.documentElement.classList.contains("welten-world-switch-lock")) {
        if (tries < 40) setTimeout(send, 120);
        return;
      }
      var activeFrame =
        typeof targetIdx === "number" && frames[targetIdx]
          ? frames[targetIdx]
          : document.querySelector(".mv4-frame.is-active");
      if (!activeFrame || !activeFrame.classList.contains("is-active") || !activeFrame.contentWindow) {
        if (tries < 24) setTimeout(send, 120);
        return;
      }
      if (typeof targetIdx === "number" && activeIdx() !== targetIdx) {
        if (tries < 24) setTimeout(send, 120);
        return;
      }
      if (goChapter && CHAPTERS.indexOf(goChapter) >= 0) {
        applyChapter(activeFrame, goChapter);
      }
      activeFrame.contentWindow.postMessage(
        {
          type: "alex:scroll-to-section",
          targetHash: targetHash || "",
          go: goChapter || "",
        },
        "*"
      );
      if (tries < 4) setTimeout(send, 280 * tries);
    }
    setTimeout(send, 160);
  }

  window.addEventListener("message", function (e) {
    if (!e.data) return;
    if (e.data.type === "portfolio-menu-state") {
      if (!isTrustedMessageSource(e.source)) return;
      setGlobalMenuExpanded(!!e.data.open);
      return;
    }
    if (e.data.type === "alex:switch-world") {
      if (!isTrustedMessageSource(e.source)) return;
      var idx = worldIndexFromKey(e.data.world);
      if (idx !== undefined) {
        var goChapter =
          typeof e.data.go === "string" && CHAPTERS.indexOf(e.data.go) >= 0 ? e.data.go : "home";
        sharedChapter = goChapter;
        if (frameNeedsReset(frames[idx], idx)) resetFrame(idx);
        var targetHash = e.data.targetHash || "";
        /* Kapitel bewusst behalten — sonst überschreibt switchTo mit Home der Quellwelt.
           Scroll/Kapitel erst nach Reveal (kein Multiversum mid-switch applyChapter). */
        switchTo(idx, {
          preserveChapter: true,
          afterReveal: function () {
            postScrollToActiveFrame(targetHash, goChapter, idx);
          },
        });
        if (isLiveShell) syncShellUrl(idx, sharedChapter, "push");
        return;
      }
      if (e.data.href && typeof e.data.href === "string") {
        window.location.assign(e.data.href);
      }
      return;
    }
    if (e.data.type === "portfolio-chapter" && typeof e.data.chapter === "string") {
      if (!isOurFrame(e.source)) return;
      /* Während Weltwechsel keine Chapter-URL auf Multiversum (Default 0) mappen */
      if (
        switching ||
        document.documentElement.classList.contains("welten-world-switch-lock") ||
        pendingSwitchTarget >= 0
      ) {
        return;
      }
      /* Multiversum-iframe chapter events ignorieren, solange eine andere Welt master ist */
      var masterCh = document.body.getAttribute("data-master-world") || "";
      if (masterCh && masterCh !== "general" && frames[0] && e.source) {
        try {
          if (e.source === frames[0].contentWindow) return;
        } catch (eMvCh) {}
      }
      if (CHAPTERS.indexOf(e.data.chapter) >= 0) {
        /* Während Early-Boot keine URL von iframe-home überschreiben lassen */
        if (routeBootActive()) {
          sharedChapter = sharedChapter || "home";
          return;
        }
        sharedChapter = e.data.chapter;
        var worldIdx = activeIdx();
        if (worldIdx < 0) {
          worldIdx = defaultWorld;
        }
        if (typeof e.data.world === "string" && Router) {
          var mapped = Router.worldIdxFromKey(e.data.world);
          if (typeof mapped === "number" && mapped >= 0) worldIdx = mapped;
        }
        /* Nur aktive Welt akzeptieren — kein Cross-World chapter bleed */
        if (worldIdx !== activeIdx() && activeIdx() >= 0) {
          worldIdx = activeIdx();
        }
        /* Master-world hat Vorrang vor stale iframe world hints */
        var masterIdxCh = WORLD_KEYS.indexOf(masterCh);
        if (masterIdxCh >= 0) worldIdx = masterIdxCh;
        syncShellUrl(worldIdx, e.data.chapter, "push");
      }
      return;
    }
    if (e.data.type === "portfolio-open-external") {
      if (!isOurFrame(e.source)) return;
      var href = e.data.href;
      if (typeof href === "string" && /^(mailto:|tel:)/i.test(href)) {
        window.location.href = href;
      }
    }
  });

  frames.forEach(function (f, j) {
    f.addEventListener("load", function () {
      injectPreviewShellCss(f);
      injectAudioGestureBridge(f, j);
      injectMenuBridge(f);
      signalFrameReady(f, j);
    });
    if (frameHasSrc(f) && frameIsReady(f)) {
      injectPreviewShellCss(f);
      injectAudioGestureBridge(f, j);
      injectMenuBridge(f);
      signalFrameReady(f, j);
    }
  });

  ensureSingleChrome();
  clearSwitchLock();
  forceRevealActiveFrame();
  recoverStuckSwitch();
  forceEnableWorldButtons();

  window.addEventListener("pageshow", recoverStuckSwitch);
  window.addEventListener("focus", recoverStuckSwitch);
  setInterval(recoverStuckSwitch, 2000);

  if (isLiveShell) {
    var bootRoute = parseShellRoute();
    if (typeof bootRoute.worldIdx === "number") defaultWorld = bootRoute.worldIdx;
    /* Unterseiten-Refresh → saubere Welt-Home (kein Kapitel-Restore-Glitch / doppelte Bars) */
    sharedChapter = "home";
    lockRouteFromUrl(1800);
    if (bootRoute.chapter && bootRoute.chapter !== "home") {
      syncShellUrl(defaultWorld, "home", "replace");
    }
  }

  setMaster(defaultWorld);
  broadcastLang();
  ensureSingleChrome();

  if (isLiveShell) {
    if (!frameHasSrc(frames[defaultWorld])) {
      loaded[defaultWorld] = false;
    } else if (frameHasSrc(frames[defaultWorld])) {
      loaded[defaultWorld] = true;
    }
    if (defaultWorld !== 0) {
      loaded[0] = false;
      quarantineMultiversum();
    }
    var bootGen = switchGeneration;
    switchToWorldIndex(defaultWorld, { gen: bootGen, requireGen: true, routeIntent: true }).then(function () {
      /* User may already be mid-switch to another world — never unlock/prime Multiversum */
      if (bootGen !== switchGeneration) return;
      if (switching || pendingSwitchTarget >= 0) return;
      var masterBoot = document.body.getAttribute("data-master-world") || "";
      if (masterBoot && masterBoot !== masterKey(defaultWorld)) return;
      clearSwitchLock();
      applyShellRoute({ forceHome: true, forceWorld: false });
      forceRevealActiveFrame();
      primeActiveFrame();
      ensureSingleChrome();
      unlockShell();
      setTimeout(ensureSingleChrome, 300);
      setTimeout(function () {
        if (bootGen !== switchGeneration) return;
        if (switching || pendingSwitchTarget >= 0) return;
        var mwLater = document.body.getAttribute("data-master-world") || "";
        if (mwLater && mwLater !== masterKey(defaultWorld)) return;
        forceRevealActiveFrame();
      }, 600);
    });
    window.addEventListener("popstate", function () {
      if (suppressingHistory) return;
      applyShellRoute({ fromPopstate: true, forceWorld: true });
    });
  } else {
    applyShellRoute();
    primeActiveFrame();
  }

  /* Kein Idle-Prefetch anderer Welten — nur Tap/Focus in bindWorldButtons */
  requestAnimationFrame(function () {
    forceEnableWorldButtons();
  });
  window.mv4SwitchWorld = switchTo;
  window.mv4SyncShellUrl = syncShellUrl;
  window.mv4MasterFrameIndex = masterIdx;
})();
