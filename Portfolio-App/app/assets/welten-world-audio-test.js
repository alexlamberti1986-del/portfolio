/**
 * Hintergrundmusik pro Welt (Loop), gekoppelt an Effekte Ein/Aus.
 * Aktiv nur mit data-world-audio-test="1" auf der Shell-Seite.
 */
(function () {
  "use strict";

  if (!document.body || document.body.getAttribute("data-world-audio-test") !== "1") return;

  var VERSION = "20260706audio3";
  var TRACKS = {
    general: "assets/audio/worlds/MULTIVERSUM.mp3?v=" + VERSION,
    nexora: "assets/audio/worlds/NEXORA.mp3?v=" + VERSION,
    vertex: "assets/audio/worlds/PROFESSIONAL.mp3?v=" + VERSION,
    freiraum: "assets/audio/worlds/FREIRAUM.mp3?v=" + VERSION,
  };

  var TARGET_VOLUME = 0.4;
  var FADE_MS = 450;
  var audio = null;
  var currentWorld = "";
  var currentSrc = "";
  var playToken = 0;
  var bootRetries = 0;
  var bootTimer = 0;

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
      if (window.__mvWorldAudioEarly) {
        audio = window.__mvWorldAudioEarly;
        delete window.__mvWorldAudioEarly;
        audio.loop = true;
      } else {
        audio = new Audio();
        audio.loop = true;
        audio.preload = "auto";
      }
      if (!audio.volume) audio.volume = 0;
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
      if (p < 1) {
        requestAnimationFrame(step);
        return;
      }
      el.volume = target;
      if (done) done();
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
    bootRetries = 0;
    if (!audio) return;
    audio.pause();
    audio.volume = 0;
    currentWorld = "";
    currentSrc = "";
  }

  function stopAll() {
    stopForSwitch();
  }

  function startPlayback(world, token) {
    var src = TRACKS[world];
    if (!src || token !== playToken || !effectsEnabled()) return;

    var el = ensureAudio();
    var playTrack = function () {
      if (token !== playToken || !effectsEnabled()) return;
      var promise = el.play();
      if (promise && typeof promise.then === "function") {
        promise
          .then(function () {
            fadeVolume(TARGET_VOLUME);
          })
          .catch(function () {});
      } else {
        fadeVolume(TARGET_VOLUME);
      }
    };

    if (currentSrc === src && currentWorld === world && !el.paused) {
      fadeVolume(TARGET_VOLUME);
      return;
    }

    currentSrc = src;
    currentWorld = world;
    el.pause();
    el.volume = 0;
    el.src = src;
    el.load();
    el.addEventListener("canplay", playTrack, { once: true });
    el.addEventListener(
      "canplaythrough",
      function onReady() {
        el.removeEventListener("canplaythrough", onReady);
        if (token !== playToken) return;
        playTrack();
      },
      { once: true }
    );
    setTimeout(function () {
      if (token !== playToken || !el.paused) return;
      playTrack();
    }, 600);
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
    if (!el.paused && currentWorld === "general") {
      fadeVolume(TARGET_VOLUME);
      return;
    }

    cancelPending();
    var token = playToken;

    if (!currentSrc || currentWorld !== "general") {
      currentSrc = TRACKS.general;
      currentWorld = "general";
      if (!el.src || el.src.indexOf("MULTIVERSUM") < 0) {
        el.src = TRACKS.general;
        el.load();
      }
    }

    function attempt() {
      if (token !== playToken || activeWorld() !== "general" || !effectsEnabled()) return;
      if (!el.paused) {
        fadeVolume(TARGET_VOLUME);
        bootRetries = 0;
        return;
      }
      var promise = el.play();
      if (promise && typeof promise.then === "function") {
        promise
          .then(function () {
            fadeVolume(TARGET_VOLUME);
            bootRetries = 0;
          })
          .catch(function () {
            bootRetries += 1;
            if (bootRetries < 16) {
              bootTimer = window.setTimeout(attempt, Math.min(120 * bootRetries, 900));
            }
          });
      } else {
        fadeVolume(TARGET_VOLUME);
      }
    }

    if (el.readyState >= 2) {
      attempt();
    } else {
      el.addEventListener("canplay", attempt, { once: true });
      el.addEventListener("loadeddata", attempt, { once: true });
      attempt();
    }
  }

  function onWorldAttributeChange() {
    playAfterSwitch(activeWorld());
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
        stopForSwitch();
      },
      true
    );
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

  document.addEventListener(
    "pointerdown",
    function () {
      if (activeWorld() === "general" && effectsEnabled()) bootMultiversum();
    },
    { capture: true }
  );

  window.WeltenWorldAudioTest = {
    play: playAfterSwitch,
    stop: stopAll,
    bootMultiversum: bootMultiversum,
    activeWorld: activeWorld,
  };
})();
