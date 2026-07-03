/**
 * Hintergrundmusik pro Welt (Loop), gekoppelt an Effekte Ein/Aus.
 * Aktiv nur mit data-world-audio-test="1" auf der Shell-Seite.
 */
(function () {
  "use strict";

  if (!document.body || document.body.getAttribute("data-world-audio-test") !== "1") return;

  var VERSION = "20260706audio4";
  var TARGET_VOLUME = 0.4;
  var FADE_MS = 350;
  var TRACKS = {
    general: "assets/audio/worlds/MULTIVERSUM.mp3?v=" + VERSION,
    nexora: "assets/audio/worlds/NEXORA.mp3?v=" + VERSION,
    vertex: "assets/audio/worlds/PROFESSIONAL.mp3?v=" + VERSION,
    freiraum: "assets/audio/worlds/FREIRAUM.mp3?v=" + VERSION,
  };

  var audio = null;
  var currentWorld = "";
  var currentSrc = "";
  var playToken = 0;
  var bootTimer = 0;
  var preloaded = {};

  function effectsEnabled() {
    if (document.documentElement.classList.contains("mv-effects-off")) return false;
    var fx = document.getElementById("mv4-fx");
    if (fx) return fx.getAttribute("aria-pressed") === "true";
    return true;
  }

  function activeWorld() {
    return document.body.getAttribute("data-master-world") || "general";
  }

  function ensureAudio() {
    if (!audio) {
      audio = document.getElementById("mvWorldBgm");
      if (!audio) {
        audio = new Audio();
        audio.loop = true;
        audio.preload = "metadata";
      }
      audio.loop = true;
    }
    return audio;
  }

  function fadeVolume(target, done) {
    var el = ensureAudio();
    var start = el.volume;
    var delta = target - start;
    if (Math.abs(delta) < 0.01) {
      el.volume = target;
      if (done) done();
      return;
    }
    var t0 = performance.now();
    function step(now) {
      var p = Math.min(1, (now - t0) / FADE_MS);
      el.volume = start + delta * p;
      if (p < 1) requestAnimationFrame(step);
      else {
        el.volume = target;
        if (done) done();
      }
    }
    requestAnimationFrame(step);
  }

  function cancelPending() {
    playToken += 1;
    if (bootTimer) {
      window.clearTimeout(bootTimer);
      bootTimer = 0;
    }
  }

  function stopForSwitch() {
    cancelPending();
    if (!audio) return;
    audio.pause();
    audio.volume = 0;
    currentWorld = "";
    currentSrc = "";
  }

  function stopAll() {
    stopForSwitch();
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

  function playElement(el, token, after) {
    if (token !== playToken || !effectsEnabled()) return;
    el.muted = false;
    var promise = el.play();
    if (promise && typeof promise.then === "function") {
      promise
        .then(function () {
          if (token !== playToken) return;
          fadeVolume(TARGET_VOLUME, after);
        })
        .catch(function () {
          if (token !== playToken) return;
          el.muted = true;
          var mutedTry = el.play();
          if (mutedTry && mutedTry.catch) mutedTry.catch(function () {});
        });
    } else if (after) {
      after();
    }
  }

  function startPlayback(world, token) {
    var src = TRACKS[world];
    if (!src || token !== playToken || !effectsEnabled()) return;

    var el = ensureAudio();
    if (currentSrc === src && currentWorld === world && !el.paused) {
      fadeVolume(TARGET_VOLUME);
      return;
    }

    currentSrc = src;
    currentWorld = world;
    if (!el.src || el.src.indexOf(src.split("?")[0]) < 0) {
      el.pause();
      el.volume = 0;
      el.src = src;
      el.load();
      el.addEventListener("canplay", function () {
        playElement(el, token);
      }, { once: true });
      bootTimer = window.setTimeout(function () {
        if (token === playToken && el.paused) playElement(el, token);
      }, 500);
      return;
    }

    playElement(el, token);
  }

  function waitForSwitchDone(cb) {
    var tries = 0;
    function tick() {
      tries += 1;
      if (!document.documentElement.classList.contains("welten-world-switch-lock")) {
        cb();
        return;
      }
      if (tries > 160) {
        cb();
        return;
      }
      setTimeout(tick, 80);
    }
    tick();
  }

  function playAfterSwitch(world) {
    if (!world || !TRACKS[world] || !effectsEnabled()) return;
    preloadTrack(world);
    cancelPending();
    var token = playToken;
    waitForSwitchDone(function () {
      if (token !== playToken || !effectsEnabled()) return;
      startPlayback(world, token);
    });
  }

  function bootMultiversum() {
    if (activeWorld() !== "general" || !effectsEnabled()) return;

    var el = ensureAudio();
    currentWorld = "general";
    currentSrc = TRACKS.general;

    if (!el.paused && el.src && el.src.indexOf("MULTIVERSUM") >= 0) {
      el.muted = false;
      fadeVolume(TARGET_VOLUME);
      return;
    }

    if (window.__mvWorldBgmBoot) {
      window.__mvWorldBgmBoot();
      return;
    }

    cancelPending();
    var token = playToken;
    if (!el.src || el.src.indexOf("MULTIVERSUM") < 0) {
      el.src = TRACKS.general;
      el.load();
    }
    playElement(el, token);
  }

  function hookWorldButtons() {
    var nav = document.querySelector(".mv4-worlds");
    if (!nav || nav.dataset.worldAudioHooked === "1") return;
    nav.dataset.worldAudioHooked = "1";
    nav.addEventListener(
      "click",
      function (e) {
        var btn = e.target.closest("button[data-iframe]");
        if (!btn || btn.classList.contains("is-active")) return;
        var keys = ["general", "nexora", "vertex", "freiraum"];
        var idx = parseInt(btn.getAttribute("data-iframe"), 10);
        if (keys[idx]) preloadTrack(keys[idx]);
        stopForSwitch();
      },
      true
    );
    nav.querySelectorAll("button[data-iframe]").forEach(function (btn) {
      var idx = parseInt(btn.getAttribute("data-iframe"), 10);
      var keys = ["general", "nexora", "vertex", "freiraum"];
      var world = keys[idx];
      if (!world || world === "general") return;
      btn.addEventListener("mouseenter", function () {
        preloadTrack(world);
      }, { passive: true });
      btn.addEventListener("focus", function () {
        preloadTrack(world);
      });
    });
  }

  function onWorldAttributeChange() {
    playAfterSwitch(activeWorld());
  }

  document.addEventListener("mv-effects-change", function (e) {
    var on = !!(e.detail && e.detail.on);
    if (!on) {
      stopAll();
      return;
    }
    if (document.documentElement.classList.contains("welten-world-switch-lock")) return;
    bootMultiversum();
    if (activeWorld() !== "general") playAfterSwitch(activeWorld());
  });

  try {
    new MutationObserver(onWorldAttributeChange).observe(document.body, {
      attributes: true,
      attributeFilter: ["data-master-world"],
    });
  } catch (e) {}

  try {
    new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (
          mutations[i].attributeName === "class" &&
          document.documentElement.classList.contains("welten-world-switch-lock")
        ) {
          stopForSwitch();
          break;
        }
      }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  } catch (e2) {}

  function init() {
    ensureAudio();
    hookWorldButtons();
    bootMultiversum();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addEventListener("load", bootMultiversum);
  window.addEventListener("pageshow", bootMultiversum);

  window.WeltenWorldAudioTest = {
    play: playAfterSwitch,
    stop: stopAll,
    bootMultiversum: bootMultiversum,
    activeWorld: activeWorld,
  };
})();
