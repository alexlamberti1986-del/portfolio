/**
 * Hintergrundmusik pro Welt (Loop), gekoppelt an Effekte Ein/Aus.
 * MULTIVERSUM startet beim Seitenaufruf ohne Klick (soweit der Browser es erlaubt).
 */
(function () {
  "use strict";

  if (!document.body || document.body.getAttribute("data-world-audio-test") !== "1") return;

  var VERSION = "20260706audio-live2";
  var TARGET_VOLUME = 0.4;
  var FADE_MS = 280;
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
  var retryTimer = 0;
  var preloaded = {};
  var switching = false;
  var lastObservedWorld = "";
  var lockWasOn = false;
  var worldObserverReady = false;

  function effectsEnabled() {
    try {
      var stored = localStorage.getItem("mv-effects-on");
      if (stored === "0") return false;
      if (stored === "1") return true;
    } catch (e) {}
    if (document.documentElement.classList.contains("mv-effects-off")) return false;
    var fx = document.getElementById("mv4-fx");
    if (fx) return fx.getAttribute("aria-pressed") === "true";
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    } catch (e2) {}
    return true;
  }

  function activeWorld() {
    return document.body.getAttribute("data-master-world") || "general";
  }

  function ensureAudio() {
    if (audio) return audio;
    if (window.__mvWorldAudioEarly) {
      audio = window.__mvWorldAudioEarly;
    } else {
      audio = document.getElementById("mvWorldBgm");
    }
    if (!audio) {
      audio = new Audio();
      audio.style.display = "none";
      document.body.appendChild(audio);
    }
    audio.id = "mvWorldBgm";
    audio.loop = true;
    audio.playsInline = true;
    audio.setAttribute("playsinline", "");
    audio.preload = "auto";
    if (!audio.parentNode && document.body) {
      audio.style.display = "none";
      document.body.insertBefore(audio, document.body.firstChild);
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
      el.volume = Math.max(0, Math.min(1, start + delta * p));
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
    if (retryTimer) {
      window.clearTimeout(retryTimer);
      retryTimer = 0;
    }
  }

  function stopForSwitch() {
    cancelPending();
    switching = true;
    window.__mvWorldAudioPlaying = false;
    if (!audio) return;
    try {
      audio.pause();
    } catch (e) {}
    audio.volume = 0;
    currentWorld = "";
    currentSrc = "";
  }

  function stopAll() {
    stopForSwitch();
    switching = false;
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

  function isPlayingWorld(world) {
    var el = ensureAudio();
    var src = TRACKS[world];
    if (!src || !el || el.paused) return false;
    return el.src.indexOf(src.split("?")[0]) >= 0 && !el.muted && el.volume > 0.05;
  }

  function playElement(el, token) {
    if (token !== playToken || !effectsEnabled()) return;

    function afterPlay() {
      if (token !== playToken) return;
      switching = false;
      window.__mvWorldAudioPlaying = true;
      el.muted = false;
      fadeVolume(TARGET_VOLUME);
    }

    el.muted = false;
    if (el.volume < 0.05) el.volume = TARGET_VOLUME;
    var promise = el.play();
    if (promise && typeof promise.then === "function") {
      promise
        .then(afterPlay)
        .catch(function () {
          if (token !== playToken) return;
          el.muted = true;
          el.volume = TARGET_VOLUME;
          var mutedTry = el.play();
          if (mutedTry && typeof mutedTry.then === "function") {
            mutedTry
              .then(afterPlay)
              .catch(function () {
                if (token !== playToken) return;
                scheduleRetry(token);
              });
            return;
          }
          scheduleRetry(token);
        });
    } else {
      afterPlay();
    }
  }

  function scheduleRetry(token) {
    if (retryTimer) window.clearTimeout(retryTimer);
    retryTimer = window.setTimeout(function () {
      if (token !== playToken || !effectsEnabled()) return;
      var el = ensureAudio();
      if (!el.paused && currentWorld && !el.muted) {
        switching = false;
        window.__mvWorldAudioPlaying = true;
        fadeVolume(TARGET_VOLUME);
        return;
      }
      playElement(el, token);
    }, 250);
  }

  function startPlayback(world, token) {
    var src = TRACKS[world];
    if (!src || token !== playToken || !effectsEnabled()) return;

    var el = ensureAudio();
    if (isPlayingWorld(world)) {
      currentSrc = src;
      currentWorld = world;
      switching = false;
      window.__mvWorldAudioPlaying = true;
      el.muted = false;
      fadeVolume(TARGET_VOLUME);
      return;
    }

    currentSrc = src;
    currentWorld = world;
    var pathOnly = src.split("?")[0];
    if (!el.src || el.src.indexOf(pathOnly) < 0) {
      el.pause();
      el.volume = TARGET_VOLUME;
      el.src = src;
      el.load();
      el.addEventListener(
        "canplay",
        function () {
          playElement(el, token);
        },
        { once: true }
      );
      bootTimer = window.setTimeout(function () {
        if (token === playToken && el.paused) playElement(el, token);
      }, 200);
      return;
    }

    playElement(el, token);
  }

  function waitForSwitchDone(cb) {
    var tries = 0;
    function tick() {
      tries += 1;
      var locked = document.documentElement.classList.contains("welten-world-switch-lock");
      if (!locked) {
        switching = false;
        cb();
        return;
      }
      if (tries > 160) {
        switching = false;
        cb();
        return;
      }
      setTimeout(tick, 80);
    }
    tick();
  }

  function playAfterSwitch(world) {
    if (!world || !TRACKS[world] || !effectsEnabled()) return;
    if (world === currentWorld && isPlayingWorld(world)) return;
    cancelPending();
    var token = playToken;
    waitForSwitchDone(function () {
      if (token !== playToken || !effectsEnabled()) return;
      switching = false;
      startPlayback(world, token);
    });
  }

  function bootMultiversum(force) {
    if (activeWorld() !== "general" || !effectsEnabled()) return;
    if (!force && switching) return;
    switching = false;
    if (isPlayingWorld("general")) {
      currentWorld = "general";
      currentSrc = TRACKS.general;
      window.__mvWorldAudioPlaying = true;
      return;
    }
    var token = playToken;
    if (typeof window.__mvWorldAudioBoot === "function") {
      window.__mvWorldAudioBoot()
        .then(function () {
          if (token !== playToken) return;
          currentWorld = "general";
          currentSrc = TRACKS.general;
          switching = false;
          window.__mvWorldAudioPlaying = true;
          var el = ensureAudio();
          el.muted = false;
          fadeVolume(TARGET_VOLUME);
        })
        .catch(function () {
          startPlayback("general", token);
        });
      return;
    }
    startPlayback("general", token);
  }

  function resumeCurrent() {
    if (!effectsEnabled()) return;
    if (document.documentElement.classList.contains("welten-world-switch-lock")) return;
    switching = false;
    var world = activeWorld();
    if (world === "general") bootMultiversum(true);
    else playAfterSwitch(world);
  }

  function onWorldAttributeChange() {
    if (!worldObserverReady) return;
    var world = activeWorld();
    if (!world || !TRACKS[world] || !effectsEnabled()) return;
    if (world === lastObservedWorld && isPlayingWorld(world)) return;
    if (world === lastObservedWorld) return;

    var prev = lastObservedWorld;
    lastObservedWorld = world;

    if (!prev) {
      if (world === "general") bootMultiversum(true);
      else playAfterSwitch(world);
      return;
    }

    playAfterSwitch(world);
  }

  function hookWorldButtons() {
    var nav = document.querySelector(".mv4-worlds");
    if (!nav || nav.dataset.worldAudioHooked === "1") return;
    nav.dataset.worldAudioHooked = "1";
    nav.querySelectorAll("button[data-iframe]").forEach(function (btn) {
      var idx = parseInt(btn.getAttribute("data-iframe"), 10);
      var keys = ["general", "nexora", "vertex", "freiraum"];
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

  function watchSwitchLock() {
    try {
      new MutationObserver(function () {
        var locked = document.documentElement.classList.contains("welten-world-switch-lock");
        if (locked && !lockWasOn) {
          lockWasOn = true;
          if (window.__worldTransitionRunning) stopForSwitch();
          return;
        }
        if (!locked && lockWasOn) {
          lockWasOn = false;
          switching = false;
          if (!effectsEnabled()) return;
          var world = activeWorld();
          if (world === "general") bootMultiversum(true);
          else playAfterSwitch(world);
          return;
        }
        if (!locked) lockWasOn = false;
      }).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    } catch (e2) {}
  }

  function watchWorldAttribute() {
    try {
      new MutationObserver(onWorldAttributeChange).observe(document.body, {
        attributes: true,
        attributeFilter: ["data-master-world"],
      });
    } catch (e) {}
    worldObserverReady = true;
    lastObservedWorld = activeWorld();
  }

  function attachEarlyAudio() {
    var el = window.__mvWorldAudioEarly || document.getElementById("mvWorldBgm");
    if (!el || !document.body) return null;
    el.id = "mvWorldBgm";
    el.loop = true;
    el.playsInline = true;
    el.setAttribute("playsinline", "");
    el.preload = "auto";
    el.style.display = "none";
    if (!el.parentNode) {
      document.body.insertBefore(el, document.body.firstChild);
    }
    audio = el;
    return el;
  }

  function tryImmediateBoot() {
    if (!effectsEnabled()) return;
    switching = false;
    attachEarlyAudio();
    bootMultiversum(true);
  }

  function init() {
    attachEarlyAudio();
    ensureAudio();
    hookWorldButtons();
    watchSwitchLock();
    tryImmediateBoot();
    setTimeout(watchWorldAttribute, 800);
  }

  document.addEventListener("mv-effects-change", function (e) {
    var on = !!(e.detail && e.detail.on);
    if (!on) {
      stopAll();
      return;
    }
    resumeCurrent();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addEventListener("load", tryImmediateBoot);
  window.addEventListener("pageshow", function () {
    switching = false;
    lockWasOn = false;
    tryImmediateBoot();
  });
  window.addEventListener("focus", tryImmediateBoot);

  window.addEventListener("message", function (e) {
    if (e.data && e.data.type === "mv-hero-ready") {
      switching = false;
      setTimeout(function () {
        bootMultiversum(true);
      }, 40);
    }
  });

  ["pointerdown", "touchstart", "keydown"].forEach(function (ev) {
    document.addEventListener(
      ev,
      function () {
        if (!effectsEnabled()) return;
        var el = ensureAudio();
        if (el && !el.paused && activeWorld() === currentWorld) {
          el.muted = false;
          fadeVolume(TARGET_VOLUME);
          window.__mvWorldAudioPlaying = true;
          return;
        }
        resumeCurrent();
      },
      { capture: true, once: false }
    );
  });

  var autoTries = 0;
  var autoTimer = setInterval(function () {
    autoTries += 1;
    if (autoTries > 30) {
      clearInterval(autoTimer);
      return;
    }
    if (!effectsEnabled()) return;
    if (activeWorld() === "general" && !isPlayingWorld("general")) bootMultiversum(true);
  }, 350);

  window.WeltenWorldAudioTest = {
    play: playAfterSwitch,
    stop: stopAll,
    bootMultiversum: bootMultiversum,
    activeWorld: activeWorld,
  };
})();
