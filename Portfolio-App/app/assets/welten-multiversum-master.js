/**
 * 4-Welten Master — Preview + Live (alexlamberti.ch)
 */
(function () {
  "use strict";

  var LANG_KEY = "mv-preview-lang";
  var FX_KEY = "mv-effects-on";
  var CHAPTERS = ["home", "projects", "leistungen", "about", "contact"];
  var WORLD_KEYS = ["general", "nexora", "vertex", "freiraum"];
  var FRAME_PAGES = ["MULTIVERSUM.html", "NEXORA.html", "PROFESSIONAL.html", "FREIRAUM.html"];
  var SHELL_PAGES = ["3-Welten-Master-iframe.html", "index.html", ""];
  var ROUTE_CHAPTER = {
    "/": "home",
    "/projekte": "projects",
    "/leistungen": "leistungen",
    "/ueber-mich": "about",
    "/kontakt": "contact",
  };
  var PROFILE_V = "20260706prof-portrait-tablet";
  var PROFILE_BASE = "assets/images/4welten-preview/";
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
  var effectsOn = true;
  var currentLang = "de";
  var PREVIEW_MOBILE_CSS = "assets/welten-multiversum-preview-mobile.css?v=20260623mv2";
  var FONT_SYSTEM_CSS = "assets/welten-font-system.css?v=20260629fonts3";
  var TITLE_COLORS_CSS = "assets/welten-world-title-colors.css?v=20260705bootfix";
  var isLiveShell = document.body && document.body.getAttribute("data-live-shell") === "1";
  var defaultWorld = 0;
  if (document.body && document.body.getAttribute("data-live-default")) {
    defaultWorld = parseInt(document.body.getAttribute("data-live-default"), 10);
    if (!isFinite(defaultWorld) || defaultWorld < 0 || defaultWorld > 3) defaultWorld = 0;
  }
  var loaded = {};
  var resetAttempts = {};
  loaded[defaultWorld] = true;
  var SHELL_CHROME_CSS =
    "html.welten-live-shell .mv4-bar{display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;overflow:hidden!important;opacity:0!important;pointer-events:none!important}";

  function injectPreviewShellCss(f) {
    try {
      var d = f.contentDocument;
      if (!d || !d.documentElement) return;
      d.documentElement.classList.add("mv4-preview-shell");
      if (isLiveShell) d.documentElement.classList.add("welten-live-shell");
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

  function setBarHeight() {
    var shellBar = getBar();
    if (!shellBar) return;
    var h = Math.ceil(shellBar.getBoundingClientRect().height);
    if (h < 48) h = 56;
    try {
      if (window.matchMedia("(max-width: 1024px)").matches && h < 72) h = 72;
    } catch (e) {}
    document.documentElement.style.setProperty("--bar-h", h + "px");
  }

  function activeIdx() {
    var idx = -1;
    frames.forEach(function (f, j) {
      if (f.classList.contains("is-active")) idx = j;
    });
    return idx;
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
    var bars = document.querySelectorAll(".mv4-bar");
    for (var i = 1; i < bars.length; i++) {
      bars[i].remove();
    }
  }

  function getBar() {
    if (!bar || !document.body.contains(bar)) {
      bar = document.querySelector(".mv4-bar");
    }
    return bar;
  }

  function purgeSwitchOverlays() {
    document.querySelectorAll(".welten-world-switch").forEach(function (el) {
      try {
        el.remove();
      } catch (e) {}
    });
    document.documentElement.classList.remove("welten-world-switch-lock");
  }

  function clearSwitchLock() {
    purgeSwitchOverlays();
    switchLockSince = 0;
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
      purgeSwitchOverlays();
    }
    if (switching && !locked) {
      unlockShell();
      return;
    }
    if (switching && locked && switchLockSince && Date.now() - switchLockSince > 9000) {
      clearSwitchLock();
      return;
    }
    if (locked && !switching && switchLockSince && Date.now() - switchLockSince > 9000) {
      clearSwitchLock();
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
  }

  function chapterFromShellPath() {
    var p = (location.pathname || "/").replace(/\/$/, "") || "/";
    return ROUTE_CHAPTER[p] || "home";
  }

  function applyShellRoute() {
    if (!isLiveShell) return;
    var ch = chapterFromShellPath();
    sharedChapter = ch;
    if (window.WeltenShellSEO && typeof window.WeltenShellSEO.apply === "function") {
      window.WeltenShellSEO.apply(ch);
    }
    var idx = activeIdx();
    if (idx < 0) idx = defaultWorld;
    var f = frames[idx];
    if (!f) return;
    function send() {
      postFrame(f, { type: "portfolio-go-chapter", chapter: ch });
      applyChapter(f, ch);
    }
    if (frameIsReady(f)) send();
    else f.addEventListener("load", send, { once: true });
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
    window.__worldTransitionRunning = true;
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
    switchLockSince = 0;
    var shellBar = getBar();
    if (shellBar) {
      shellBar.removeAttribute("aria-busy");
      shellBar.style.pointerEvents = "";
      shellBar.querySelectorAll("button[data-iframe]").forEach(function (b) {
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
    shellBar.querySelectorAll("button[data-iframe]").forEach(function (b) {
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
    purgeSwitchOverlays();
    forceEnableWorldButtons();
    var idx = parseInt(btn.getAttribute("data-iframe"), 10);
    if (!isFinite(idx)) return;
    switchTo(idx);
  }

  function setMaster(i) {
    document.body.setAttribute("data-master-world", masterKey(i));
    var shellBar = getBar();
    if (!shellBar) return;
    shellBar.querySelectorAll("button[data-iframe]").forEach(function (b) {
      b.classList.toggle("is-active", parseInt(b.getAttribute("data-iframe"), 10) === i);
    });
    updateFlags();
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

  function applyChapter(f, id) {
    var ch = CHAPTERS.indexOf(id) >= 0 ? id : "home";
    postFrame(f, { type: "portfolio-go-chapter", chapter: ch });
    try {
      var d = f.contentDocument;
      if (d) {
        var link = d.querySelector('.menu-links a[data-go="' + ch + '"]');
        if (link) link.click();
      }
    } catch (e1) {}
  }

  function revealActiveFrame(i) {
    var f = frames[i];
    if (!f) return;
    postFrame(f, { type: "portfolio-world-reveal", world: soundKey(i) });
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
    ensureSingleBar();
    injectProfiles(f, j);
    broadcastLang();
    postFrame(f, { type: "portfolio-effects", on: effectsOn });
    if (j === activeIdx()) {
      postFrame(f, { type: "portfolio-world-enter", world: soundKey(j) });
      postFrame(f, { type: "portfolio-world-reveal", world: soundKey(j) });
    } else {
      postFrame(f, { type: "portfolio-world-pause", paused: true });
      postFrame(f, { type: "portfolio-cleanup-transition" });
    }
  }

  function primeActiveFrame() {
    var i = activeIdx();
    if (i < 0) i = defaultWorld;
    var f = frames[i];
    if (!f || !frameHasSrc(f) || !frameIsReady(f)) return;
    injectAudioGestureBridge(f, i);
    injectProfiles(f, i);
    postFrame(f, { type: "portfolio-world-enter", world: soundKey(i) });
    postFrame(f, { type: "portfolio-world-reveal", world: soundKey(i) });
  }

  function applyActive(i) {
    frames.forEach(function (f, j) {
      var on = j === i;
      f.classList.toggle("is-active", on);
      f.style.pointerEvents = on ? "auto" : "none";
      if (on) {
        postFrame(f, { type: "portfolio-world-enter", world: soundKey(j) });
        applyChapter(f, sharedChapter);
        if (frameIsReady(f)) injectProfiles(f, j);
        else f.addEventListener("load", function () { injectProfiles(f, j); }, { once: true });
      } else {
        postFrame(f, { type: "portfolio-world-pause", paused: true });
        postFrame(f, { type: "portfolio-cleanup-transition" });
      }
    });
    setMaster(i);
    broadcastLang();
    if (!switching) {
      unlockShell();
      forceEnableWorldButtons();
    }
    setTimeout(function () {
      var f = frames[i];
      if (f) injectProfiles(f, i);
    }, 400);
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

  function switchToWorldIndex(i) {
    return loadFrame(i).then(function () {
      applyActive(i);
    });
  }

  window.switchToWorldIndex = switchToWorldIndex;
  window.preloadWorldIndex = loadFrame;
  window.mv4ActiveFrameIndex = activeIdx;

  function switchTo(i) {
    if (i < 0 || i > 3) return;
    forceEnableWorldButtons();
    recoverStuckSwitch();
    if (switching) {
      if (document.documentElement.classList.contains("welten-world-switch-lock")) {
        if (window.WeltenWorldSwitchPreview && typeof window.WeltenWorldSwitchPreview.abort === "function") {
          window.WeltenWorldSwitchPreview.abort(true);
        }
        purgeSwitchOverlays();
      } else {
        unlockShell();
      }
    }
    ensureSingleBar();
    if (frameNeedsReset(frames[i], i)) {
      resetFrame(i);
    }
    var prev = activeIdx();
    if (prev === i) {
      unlockShell();
      applyChapter(frames[i], sharedChapter);
      return;
    }

    resumeAudio();
    lockShell(masterKey(i));
    var c = readChapter(frames[prev]);
    if (c) sharedChapter = c;

    var wKey = worldSwitchKey(i);
    var transitionDone = false;

    function finishTransition() {
      if (transitionDone) return;
      transitionDone = true;
      window.__wwsOnTransitionEnd = null;
      unlockShell();
      forceEnableWorldButtons();
      purgeSwitchOverlays();
      document.documentElement.classList.remove("welten-world-switch-lock");
      switchLockSince = 0;
      try {
        document.dispatchEvent(
          new CustomEvent("welten-audio-switch-end", { detail: { world: masterKey(i) } })
        );
      } catch (eAudioEnd) {}
      revealActiveFrame(i);
      requestAnimationFrame(setBarHeight);
    }

    if (!effectsOn) {
      purgeSwitchOverlays();
      if (window.WeltenWorldSwitchPreview && typeof window.WeltenWorldSwitchPreview.abort === "function") {
        window.WeltenWorldSwitchPreview.abort(true);
      }
      switchToWorldIndex(i).then(finishTransition);
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
          if (switching) finishTransition();
        }, safetyMs);
        return;
      }
    } catch (errPlay) {
      finishTransition();
    }

    switchToWorldIndex(i).then(finishTransition);
    return;
  }

  loadPrefs();
  updateFxBtn();
  applyEffectsState();
  updateFlags();
  setBarHeight();
  window.addEventListener("resize", setBarHeight, { passive: true });
  if (getBar() && typeof ResizeObserver !== "undefined") {
    new ResizeObserver(setBarHeight).observe(getBar());
  }

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
        var btn = e.target.closest("button[data-iframe]");
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
      var btn = e.target.closest("button[data-iframe]");
      if (!btn || !worlds.contains(btn)) return;
      activateWorldButton(btn, e);
    });
    worlds.querySelectorAll("button[data-iframe]").forEach(function (btn) {
      var idx = parseInt(btn.getAttribute("data-iframe"), 10);
      btn.addEventListener("pointerdown", function () {
        preloadFrame(idx);
      }, { passive: true });
      btn.addEventListener("mouseenter", function () {
        preloadFrame(idx);
      });
      btn.addEventListener("touchstart", function () {
        preloadFrame(idx);
      }, { passive: true });
      btn.addEventListener("focus", function () {
        preloadFrame(idx);
      });
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

  function postScrollToActiveFrame(targetHash, goChapter) {
    if (!targetHash && !goChapter) return;
    setTimeout(function () {
      var activeFrame = document.querySelector(".mv4-frame.is-active");
      if (!activeFrame || !activeFrame.contentWindow) return;
      activeFrame.contentWindow.postMessage(
        {
          type: "alex:scroll-to-section",
          targetHash: targetHash || "",
          go: goChapter || "",
        },
        "*"
      );
    }, 620);
  }

  window.addEventListener("message", function (e) {
    if (!e.data) return;
    if (e.data.type === "alex:switch-world") {
      if (!isTrustedMessageSource(e.source)) return;
      var idx = worldIndexFromKey(e.data.world);
      if (idx !== undefined) {
        if (frameNeedsReset(frames[idx], idx)) resetFrame(idx);
        switchTo(idx);
        postScrollToActiveFrame(e.data.targetHash, e.data.go);
        return;
      }
      if (e.data.href && typeof e.data.href === "string") {
        window.location.assign(e.data.href);
      }
      return;
    }
    if (e.data.type === "portfolio-chapter" && typeof e.data.chapter === "string") {
      if (!isOurFrame(e.source)) return;
      if (CHAPTERS.indexOf(e.data.chapter) >= 0) {
        sharedChapter = e.data.chapter;
        if (window.WeltenShellSEO && typeof window.WeltenShellSEO.apply === "function") {
          window.WeltenShellSEO.apply(e.data.chapter);
        }
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
      injectAudioGestureBridge(f, j);
      signalFrameReady(f, j);
    });
    if (frameHasSrc(f) && frameIsReady(f)) {
      injectAudioGestureBridge(f, j);
      signalFrameReady(f, j);
    }
  });

  ensureSingleBar();
  clearSwitchLock();
  recoverStuckSwitch();
  forceEnableWorldButtons();

  window.addEventListener("pageshow", recoverStuckSwitch);
  window.addEventListener("focus", recoverStuckSwitch);
  setInterval(recoverStuckSwitch, 2000);

  setMaster(defaultWorld);
  broadcastLang();
  applyShellRoute();
  primeActiveFrame();
  setTimeout(primeActiveFrame, 120);
  setTimeout(primeActiveFrame, 700);
  setTimeout(primeActiveFrame, 1800);
  if (window.WeltenShellPerf && typeof window.WeltenShellPerf.scheduleLazyWorldPreload === "function") {
    window.WeltenShellPerf.scheduleLazyWorldPreload(preloadFrame, activeIdx());
  }
  requestAnimationFrame(function () {
    forceEnableWorldButtons();
  });
  if (isCoarseMobileShell()) {
    setTimeout(function () {
      preloadFrame(1);
    }, 900);
    setTimeout(function () {
      preloadFrame(2);
    }, 1800);
    setTimeout(function () {
      preloadFrame(3);
    }, 2600);
  }
  window.mv4SwitchWorld = switchTo;
})();
