/**
 * Hintergrundmusik pro Welt (Loop), ein Player, ein Start nach Weltenwechsel-Animation.
 */
(function () {
  "use strict";

  var VERSION = "20260708audio-fix11";
  var TARGET_VOLUME = 0.4;
  var FADE_MS = 220;
  var SWITCH_END_FADE_MS = 80;
  var TRACKS = {
    general: "assets/audio/worlds/MULTIVERSUM.mp3?v=" + VERSION,
    nexora: "assets/audio/worlds/NEXORA.mp3?v=" + VERSION,
    vertex: "assets/audio/worlds/PROFESSIONAL.mp3?v=" + VERSION,
    freiraum: "assets/audio/worlds/FREIRAUM.mp3?v=" + VERSION,
  };

  var bgmEl = null;
  var playToken = 0;
  var bootTimer = 0;
  var retryTimer = 0;
  var preloaded = {};
  var pendingWorld = "";
  var switchGeneration = 0;
  var initialBootDone = false;
  var fadeGeneration = 0;
  var bootGestureHooked = false;
  var bootGesturePending = false;
  var bootGestureListeners = [];

  function setSwitchFlag(on) {
    window.__mvInWorldSwitch = !!on;
  }

  function effectsEnabled() {
    if (window.__mvEffectsOn === false) return false;
    try {
      var stored = localStorage.getItem("mv-effects-on");
      if (stored === "0") return false;
      if (stored === "1") return true;
    } catch (e) {}
    if (document.documentElement.classList.contains("mv-effects-off")) return false;
    if (document.body && document.body.classList.contains("mv-effects-off")) return false;
    var fx = document.getElementById("mv4-fx");
    if (fx) return fx.getAttribute("aria-pressed") === "true";
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    } catch (e2) {}
    return true;
  }

  function isVisualAnimationLocked() {
    if (window.__worldTransitionRunning) return true;
    if (document.documentElement.classList.contains("welten-world-switch-lock")) return true;
    try {
      if (document.querySelector(".welten-world-switch")) return true;
    } catch (e) {}
    return false;
  }

  function isEarlyBootBlocked() {
    return !!window.__mvInWorldSwitch || isVisualAnimationLocked();
  }

  function activeWorld() {
    return document.body.getAttribute("data-master-world") || "general";
  }

  function collectBgmElements() {
    var seen = [];
    var list = [];
    function add(el) {
      if (!el || seen.indexOf(el) >= 0) return;
      seen.push(el);
      list.push(el);
    }
    add(bgmEl);
    add(window.__mvWorldAudioEarly);
    add(document.getElementById("mvWorldBgm"));
    try {
      document.querySelectorAll("audio#mvWorldBgm").forEach(add);
    } catch (e) {}
    return list;
  }

  function stopSwitchClips() {
    var cache = window.wwsSwitchMp3Cache;
    if (!cache) return;
    Object.keys(cache).forEach(function (key) {
      var clip = cache[key];
      if (!clip) return;
      try {
        clip.pause();
        clip.currentTime = 0;
        clip.volume = 0;
      } catch (e) {}
    });
    if (typeof window.wwsStopSwitchMp3 === "function") {
      try {
        window.wwsStopSwitchMp3();
      } catch (e2) {}
    }
  }

  function stopAllWorldTrackElements() {
    var worldTrack = /\/worlds\/|Multiversum sound\.mp3/i;
    try {
      document.querySelectorAll("audio").forEach(function (el) {
        var src = el.currentSrc || el.src || "";
        if (!worldTrack.test(src)) return;
        try {
          el.pause();
          el.currentTime = 0;
        } catch (e) {}
        el.volume = 0;
        el.muted = true;
      });
    } catch (e2) {}
  }

  function hardStopBgm() {
    playToken += 1;
    fadeGeneration += 1;
    if (bootTimer) {
      clearTimeout(bootTimer);
      bootTimer = 0;
    }
    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = 0;
    }
    window.__mvWorldAudioPlaying = false;
    collectBgmElements().forEach(function (el) {
      try {
        el.pause();
        el.currentTime = 0;
      } catch (e) {}
      el.volume = 0;
      el.muted = true;
    });
    stopSwitchClips();
    stopAllWorldTrackElements();
    stopIframeWorldBgm();
  }

  function stopIframeWorldBgm() {
    document.querySelectorAll(".mv4-frame").forEach(function (frame) {
      try {
        var win = frame.contentWindow;
        if (!win) return;
        if (typeof win.__mvStopIframeWorldBgm === "function") {
          win.__mvStopIframeWorldBgm();
        }
        win.postMessage({ type: "mv-stop-iframe-bgm" }, "*");
        win.postMessage({ type: "portfolio-world-pause", paused: true }, "*");
      } catch (e) {}
    });
  }

  function ensureBgm() {
    if (bgmEl && document.body && document.body.contains(bgmEl)) return bgmEl;
    var early = window.__mvWorldAudioEarly;
    var dom = document.getElementById("mvWorldBgm");
    bgmEl = early || dom;
    if (!bgmEl) {
      bgmEl = new Audio();
      bgmEl.style.display = "none";
      if (document.body) document.body.insertBefore(bgmEl, document.body.firstChild);
    }
    if (dom && early && dom !== early && dom.parentNode) {
      try {
        dom.parentNode.removeChild(dom);
      } catch (eRm) {}
    }
    bgmEl.id = "mvWorldBgm";
    bgmEl.loop = true;
    bgmEl.playsInline = true;
    bgmEl.setAttribute("playsinline", "");
    bgmEl.preload = "auto";
    bgmEl.style.display = "none";
    if (!bgmEl.parentNode && document.body) {
      document.body.insertBefore(bgmEl, document.body.firstChild);
    }
    window.__mvWorldAudioEarly = bgmEl;
    return bgmEl;
  }

  function fadeVolume(el, target, done, duration) {
    var start = el.volume;
    var delta = target - start;
    var ms = duration || FADE_MS;
    var gen = fadeGeneration;
    if (Math.abs(delta) < 0.01) {
      el.volume = target;
      if (done) done();
      return;
    }
    var t0 = performance.now();
    function step(now) {
      if (gen !== fadeGeneration) return;
      var p = Math.min(1, (now - t0) / ms);
      el.volume = Math.max(0, Math.min(1, start + delta * p));
      if (p < 1) requestAnimationFrame(step);
      else {
        el.volume = target;
        if (done) done();
      }
    }
    requestAnimationFrame(step);
  }

  function preloadTrack(world) {
    if (!TRACKS[world] || preloaded[world]) return;
    preloaded[world] = true;
    var link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "audio";
    link.href = TRACKS[world];
    document.head.appendChild(link);
  }

  function canPlayNow(token, world, switchGen) {
    if (token !== playToken) return false;
    if (!effectsEnabled()) return false;
    if (switchGen === 0) {
      return activeWorld() === world;
    }
    if (isVisualAnimationLocked()) return false;
    if (activeWorld() !== world) return false;
    if (switchGen !== switchGeneration) return false;
    return true;
  }

  function playBgm(world, token, fadeMs, switchGen) {
    if (!canPlayNow(token, world, switchGen)) {
      if (switchGen === 0) bootGesturePending = false;
      return;
    }
    var src = TRACKS[world];
    if (!src) return;

    var el = ensureBgm();
    el.pause();
    el.volume = 0;
    el.muted = true;
    try {
      el.currentTime = 0;
    } catch (e0) {}

    var pathOnly = src.split("?")[0];
    if (!el.src || el.src.indexOf(pathOnly) < 0) {
      el.src = src;
      try {
        el.load();
      } catch (eLoad) {}
    }

    var started = false;

    function begin() {
      if (started) return;
      if (!canPlayNow(token, world, switchGen)) {
        if (switchGen === 0) bootGesturePending = false;
        return;
      }
      started = true;
      if (bootTimer) {
        clearTimeout(bootTimer);
        bootTimer = 0;
      }
      try {
        el.currentTime = 0;
      } catch (e1) {}
      el.muted = false;
      if (el.volume < 0.05) el.volume = 0;
      var p = el.play();
      function onPlaying() {
        if (!canPlayNow(token, world, switchGen)) {
          try {
            el.pause();
            el.volume = 0;
          } catch (e2) {}
          if (switchGen === 0) bootGesturePending = false;
          return;
        }
        setSwitchFlag(false);
        window.__mvWorldAudioPlaying = true;
        pendingWorld = "";
        if (world === "general") {
          initialBootDone = true;
          bootGesturePending = false;
          unhookBootGesture();
        }
        fadeVolume(el, TARGET_VOLUME, null, fadeMs || SWITCH_END_FADE_MS);
      }
      if (p && typeof p.then === "function") {
        p.then(onPlaying).catch(function () {
          if (!canPlayNow(token, world, switchGen)) {
            if (switchGen === 0) bootGesturePending = false;
            return;
          }
          el.muted = true;
          el.volume = TARGET_VOLUME;
          var p2 = el.play();
          if (p2 && typeof p2.then === "function") {
            p2.then(onPlaying).catch(function () {
              if (switchGen === 0) bootGesturePending = false;
            });
          } else if (switchGen === 0) {
            bootGesturePending = false;
          }
        });
      } else {
        onPlaying();
      }
    }

    if (el.readyState >= 3) {
      begin();
      return;
    }
    el.addEventListener("canplay", begin, { once: true });
    bootTimer = setTimeout(function () {
      if (canPlayNow(token, world, switchGen) && el.paused) begin();
    }, 40);
  }

  function waitForAnimationEnd(cb) {
    var tries = 0;
    function tick() {
      tries += 1;
      if (!isVisualAnimationLocked()) {
        cb();
        return;
      }
      if (tries > 120) {
        cb();
        return;
      }
      setTimeout(tick, 25);
    }
    tick();
  }

  function onSwitchStart(targetWorld) {
    if (targetWorld) pendingWorld = targetWorld;
    switchGeneration += 1;
    setSwitchFlag(true);
    hardStopBgm();
    initialBootDone = false;
    if (pendingWorld) preloadTrack(pendingWorld);
  }

  function onSwitchEnd(world) {
    if (!effectsEnabled()) {
      setSwitchFlag(false);
      hardStopBgm();
      return;
    }
    world = world || pendingWorld || activeWorld();
    if (!TRACKS[world]) {
      setSwitchFlag(false);
      return;
    }
    var expectedSwitch = switchGeneration;
    var token = playToken;

    function start() {
      if (expectedSwitch !== switchGeneration) return;
      if (isVisualAnimationLocked()) {
        waitForAnimationEnd(start);
        return;
      }
      playBgm(world, token, SWITCH_END_FADE_MS, expectedSwitch);
    }

    waitForAnimationEnd(start);
  }

  function resumeAudioCtx() {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!window.__mv4AudioCtx) window.__mv4AudioCtx = new Ctx();
      if (window.__mv4AudioCtx.state === "suspended") window.__mv4AudioCtx.resume();
    } catch (e) {}
  }

  function needsStartGesture() {
    return (
      effectsEnabled() &&
      activeWorld() === "general" &&
      !initialBootDone &&
      !window.__mvWorldAudioPlaying
    );
  }

  function isWorldSwitchTarget(target) {
    if (!target || !target.closest) return false;
    return !!target.closest(".mv4-worlds button[data-iframe], .world-bar button[data-iframe]");
  }

  function isExcludedBootTarget(target) {
    if (!target || !target.closest) return false;
    if (isWorldSwitchTarget(target)) return true;
    return !!target.closest('a[href^="tel:"], a[href^="mailto:"], a[href^="sms:"]');
  }

  function unhookBootGesture() {
    bootGestureListeners.forEach(function (item) {
      item.target.removeEventListener(item.type, item.fn, item.opts);
    });
    bootGestureListeners = [];
    bootGestureHooked = false;
    bootGesturePending = false;
  }

  function addBootListener(target, type, fn, opts) {
    target.addEventListener(type, fn, opts);
    bootGestureListeners.push({ target: target, type: type, fn: fn, opts: opts });
  }

  function preloadGeneralTrack() {
    preloadTrack("general");
    var el = ensureBgm();
    var src = TRACKS.general;
    var pathOnly = src.split("?")[0];
    if (!el.src || el.src.indexOf(pathOnly) < 0) {
      el.src = src;
      try {
        el.load();
      } catch (eLoad) {}
    }
  }

  function playGeneralBgmNow() {
    if (!needsStartGesture()) {
      bootGesturePending = false;
      return false;
    }
    var token = playToken;
    var el = ensureBgm();
    var src = TRACKS.general;
    var pathOnly = src.split("?")[0];
    if (!el.src || el.src.indexOf(pathOnly) < 0) {
      el.src = src;
    }
    el.loop = true;
    el.playsInline = true;
    el.setAttribute("playsinline", "");
    try {
      el.currentTime = 0;
    } catch (e0) {}

    function markPlaying() {
      if (token !== playToken) return;
      if (!effectsEnabled() || activeWorld() !== "general") {
        try {
          el.pause();
          el.volume = 0;
        } catch (eStop) {}
        bootGesturePending = false;
        return;
      }
      setSwitchFlag(false);
      window.__mvWorldAudioPlaying = true;
      initialBootDone = true;
      bootGesturePending = false;
      unhookBootGesture();
      fadeVolume(el, TARGET_VOLUME, null, FADE_MS);
    }

    function tryPlay(mutedFirst) {
      el.muted = !!mutedFirst;
      el.volume = mutedFirst ? TARGET_VOLUME : 0;
      var p;
      try {
        p = el.play();
      } catch (ePlay) {
        bootGesturePending = false;
        return false;
      }
      if (p && typeof p.then === "function") {
        p.then(function () {
          if (mutedFirst) {
            el.muted = false;
            el.volume = 0;
          }
          markPlaying();
        }).catch(function () {
          if (mutedFirst) {
            bootGesturePending = false;
            return;
          }
          tryPlay(true);
        });
      } else {
        if (mutedFirst) el.muted = false;
        markPlaying();
      }
      return true;
    }

    setTimeout(function () {
      if (bootGesturePending && !window.__mvWorldAudioPlaying) bootGesturePending = false;
    }, 900);

    return tryPlay(false);
  }

  function bootFromUserGesture(e) {
    if (initialBootDone || window.__mvWorldAudioPlaying) {
      unhookBootGesture();
      return;
    }
    if (activeWorld() !== "general") return;
    if (e && isExcludedBootTarget(e.target)) return;
    if (!effectsEnabled()) return;
    if (bootGesturePending) return;
    bootGesturePending = true;
    resumeAudioCtx();
    playGeneralBgmNow();
  }

  function tryBootFromGesture(e) {
    if (e && e.target && e.target.closest && e.target.closest("#mv4-fx")) return;
    bootFromUserGesture(e);
  }

  function getMultiversumFrame() {
    var frames = document.querySelectorAll(".mv4-frame");
    var i;
    for (i = 0; i < frames.length; i++) {
      var src = frames[i].getAttribute("src") || frames[i].getAttribute("data-lazy-src") || "";
      if (src.indexOf("MULTIVERSUM") >= 0) return frames[i];
    }
    return frames[0] || null;
  }

  function attachFrameGestures(frame) {
    if (!frame) return false;
    try {
      var win = frame.contentWindow;
      var doc = frame.contentDocument;
      if (!win) return false;
      if (win.__mvShellAudioRelayBound) return true;
      win.__mvShellAudioRelayBound = true;
      function relay(ev) {
        if (ev && isExcludedBootTarget(ev.target)) return;
        bootFromUserGesture(null);
      }
      var opts = { capture: true, passive: true };
      addBootListener(win, "pointerdown", relay, opts);
      addBootListener(win, "click", relay, opts);
      addBootListener(win, "touchstart", relay, opts);
      addBootListener(win, "wheel", relay, opts);
      addBootListener(win, "scroll", function () {
        relay(null);
      }, { capture: true, passive: true });
      if (doc) {
        addBootListener(doc, "pointerdown", relay, opts);
        addBootListener(doc, "click", relay, opts);
        addBootListener(doc, "touchstart", relay, opts);
        addBootListener(doc, "wheel", relay, opts);
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  function hookIframeGestures() {
    var frame = getMultiversumFrame();
    if (!frame) return;
    function tryAttach() {
      if (initialBootDone || window.__mvWorldAudioPlaying) return;
      try {
        if (frame.contentWindow) frame.contentWindow.__mvShellAudioRelayBound = false;
      } catch (eReset) {}
      attachFrameGestures(frame);
    }
    if (!frame.dataset.mvAudioGestureLoadHooked) {
      frame.dataset.mvAudioGestureLoadHooked = "1";
      frame.addEventListener("load", tryAttach);
    }
    tryAttach();
  }

  function hookFxButtonForAudio() {
    var fx = document.getElementById("mv4-fx");
    if (!fx || fx.dataset.mvAudioBootHooked === "1") return;
    fx.dataset.mvAudioBootHooked = "1";
    fx.addEventListener(
      "pointerdown",
      function (e) {
        if (initialBootDone || window.__mvWorldAudioPlaying) return;
        if (activeWorld() !== "general") return;
        var currentlyOn = effectsEnabled();
        if (!currentlyOn) {
          /* Effekte werden gerade eingeschaltet → danach Musik starten */
          document.addEventListener(
            "mv-effects-change",
            function onFxOn(ev) {
              document.removeEventListener("mv-effects-change", onFxOn);
              if (!ev.detail || !ev.detail.on) return;
              bootGesturePending = false;
              bootFromUserGesture(null);
            },
            { once: true }
          );
          return;
        }
        /* Effekte sind an und werden gleich ausgeschaltet → kein Boot */
        if (fx.getAttribute("aria-pressed") === "true") return;
        bootFromUserGesture(null);
      },
      { capture: true, passive: true }
    );
  }

  function hookBootGesture() {
    if (bootGestureHooked) return;
    if (initialBootDone || activeWorld() !== "general") return;
    bootGestureHooked = true;

    hookFxButtonForAudio();
    var opts = { capture: true, passive: true };
    addBootListener(document, "pointerdown", tryBootFromGesture, opts);
    addBootListener(document, "click", tryBootFromGesture, opts);
    addBootListener(document, "touchstart", tryBootFromGesture, opts);
    addBootListener(document, "wheel", tryBootFromGesture, opts);
    addBootListener(window, "scroll", function () {
      tryBootFromGesture(null);
    }, { passive: true });
    hookIframeGestures();

    var tries = 0;
    var retryId = setInterval(function () {
      tries += 1;
      if (initialBootDone || window.__mvWorldAudioPlaying || tries > 60) {
        clearInterval(retryId);
        return;
      }
      hookIframeGestures();
    }, 250);
  }

  function hookWorldButtons() {
    var nav = document.querySelector(".mv4-worlds");
    if (!nav || nav.dataset.worldAudioHooked === "1") return;
    nav.dataset.worldAudioHooked = "1";
    var keys = ["general", "nexora", "vertex", "freiraum"];
    nav.querySelectorAll("button[data-iframe]").forEach(function (btn) {
      var idx = parseInt(btn.getAttribute("data-iframe"), 10);
      function onIntent() {
        var world = keys[idx];
        if (!world) return;
        pendingWorld = world;
        preloadTrack(world);
      }
      btn.addEventListener("pointerdown", onIntent, { capture: true });
      btn.addEventListener("click", onIntent, { capture: true });
      btn.addEventListener(
        "click",
        function () {
          if (keys[idx]) preloadTrack(keys[idx]);
        },
        { passive: true }
      );
      if (keys[idx] && keys[idx] !== "general") {
        btn.addEventListener(
          "pointerenter",
          function () {
            preloadTrack(keys[idx]);
          },
          { passive: true }
        );
      }
    });
  }

  function init() {
    ensureBgm();
    hookWorldButtons();
    hookFxButtonForAudio();
    if (typeof window.__mvWorldAudioBoot === "function") {
      window.__mvWorldAudioBoot = function () {
        return Promise.resolve();
      };
    }
    preloadTrack("nexora");
    preloadTrack("vertex");
    preloadTrack("freiraum");
    preloadGeneralTrack();
    if (!effectsEnabled()) {
      hardStopBgm();
      setSwitchFlag(false);
    }
    if (!initialBootDone && activeWorld() === "general") {
      hookBootGesture();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!initialBootDone && activeWorld() === "general") hookBootGesture();
  });

  document.addEventListener("welten-audio-switch-start", function (e) {
    var world = (e.detail && e.detail.world) || pendingWorld || "";
    onSwitchStart(world);
  });

  document.addEventListener("welten-audio-switch-end", function (e) {
    var world = (e.detail && e.detail.world) || pendingWorld || activeWorld();
    onSwitchEnd(world);
  });

  document.addEventListener("mv-effects-change", function (e) {
    var on = !!(e.detail && e.detail.on);
    if (!on) {
      hardStopBgm();
      setSwitchFlag(false);
      initialBootDone = false;
      unhookBootGesture();
      return;
    }
    if (activeWorld() === "general" && !initialBootDone) hookBootGesture();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addEventListener("pageshow", function () {
    if (isEarlyBootBlocked()) return;
    if (!initialBootDone && activeWorld() === "general") {
      preloadGeneralTrack();
      hookBootGesture();
    }
  });

  window.addEventListener("message", function (e) {
    if (!e.data) return;
    if (e.data.type === "mv-hero-ready") {
      if (initialBootDone || activeWorld() !== "general") return;
      hookIframeGestures();
      return;
    }
    if (e.data.type === "mv-iframe-bgm-playing") {
      if (activeWorld() !== "general") return;
      window.__mvWorldAudioPlaying = true;
      initialBootDone = true;
      bootGesturePending = false;
      unhookBootGesture();
      /* Shell-Player stumm halten, damit kein Doppelklang entsteht */
      collectBgmElements().forEach(function (el) {
        try {
          el.pause();
        } catch (err) {}
        el.volume = 0;
        el.muted = true;
      });
    }
  });

  window.WeltenWorldAudioTest = {
    play: onSwitchEnd,
    stop: function () {
      hardStopBgm();
      setSwitchFlag(false);
    },
    bootFromUserGesture: bootFromUserGesture,
    bootMultiversum: bootFromUserGesture,
    activeWorld: activeWorld,
    version: VERSION,
  };
})();
