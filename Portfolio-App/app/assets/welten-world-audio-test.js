/**
 * Hintergrundmusik pro Welt (Loop), gekoppelt an Effekte Ein/Aus.
 * MULTIVERSUM startet beim Seitenaufruf; bei Weltenwechsel sofort stoppen,
 * danach Track der neuen Welt nach der Transition.
 */
(function () {
  "use strict";

  if (!document.body || document.body.getAttribute("data-world-audio-test") !== "1") return;

  var VERSION = "20260706audio-live";
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
        audio.style.display = "none";
        document.body.appendChild(audio);
      }
      audio.loop = true;
      audio.playsInline = true;
      audio.setAttribute("playsinline", "");
      audio.preload = "auto";
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

  function playElement(el, token) {
    if (token !== playToken || !effectsEnabled() || switching) return;
    el.muted = false;
    var promise = el.play();
    if (promise && typeof promise.then === "function") {
      promise
        .then(function () {
          if (token !== playToken || switching) return;
          fadeVolume(TARGET_VOLUME);
        })
        .catch(function () {
          if (token !== playToken || switching) return;
          /* Autoplay-Policy: stumm starten, dann laut schalten */
          el.muted = true;
          el.play()
            .then(function () {
              if (token !== playToken || switching) return;
              el.muted = false;
              fadeVolume(TARGET_VOLUME);
            })
            .catch(function () {
              scheduleRetry(token);
            });
        });
    } else {
      fadeVolume(TARGET_VOLUME);
    }
  }

  function scheduleRetry(token) {
    if (retryTimer) window.clearTimeout(retryTimer);
    retryTimer = window.setTimeout(function () {
      if (token !== playToken || switching || !effectsEnabled()) return;
      var el = ensureAudio();
      if (!el.paused && currentWorld) {
        fadeVolume(TARGET_VOLUME);
        return;
      }
      playElement(el, token);
    }, 400);
  }

  function startPlayback(world, token) {
    var src = TRACKS[world];
    if (!src || token !== playToken || !effectsEnabled() || switching) return;

    var el = ensureAudio();
    if (currentSrc === src && currentWorld === world && !el.paused) {
      el.muted = false;
      fadeVolume(TARGET_VOLUME);
      return;
    }

    currentSrc = src;
    currentWorld = world;
    var pathOnly = src.split("?")[0];
    if (!el.src || el.src.indexOf(pathOnly) < 0) {
      el.pause();
      el.volume = 0;
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
        if (token === playToken && el.paused && !switching) playElement(el, token);
      }, 350);
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
    cancelPending();
    var token = playToken;
    waitForSwitchDone(function () {
      if (token !== playToken || !effectsEnabled()) return;
      switching = false;
      startPlayback(world, token);
    });
  }

  function bootMultiversum() {
    if (activeWorld() !== "general" || !effectsEnabled()) return;
    switching = false;
    cancelPending();
    startPlayback("general", playToken);
  }

  function resumeCurrent() {
    if (!effectsEnabled()) return;
    if (document.documentElement.classList.contains("welten-world-switch-lock")) return;
    switching = false;
    var world = activeWorld();
    if (world === "general") bootMultiversum();
    else playAfterSwitch(world);
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

  function onWorldAttributeChange() {
    playAfterSwitch(activeWorld());
  }

  document.addEventListener("mv-effects-change", function (e) {
    var on = !!(e.detail && e.detail.on);
    if (!on) {
      stopAll();
      return;
    }
    resumeCurrent();
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

  /* Sofort versuchen — nicht erst bei Sprachklick */
  bootMultiversum();
  window.addEventListener("load", bootMultiversum);
  window.addEventListener("pageshow", bootMultiversum);

  window.addEventListener("message", function (e) {
    if (e.data && e.data.type === "mv-hero-ready") {
      setTimeout(bootMultiversum, 60);
    }
  });

  /* Falls Autoplay blockiert: erster Klick/Touch startet sofort */
  ["pointerdown", "touchstart", "keydown", "click"].forEach(function (ev) {
    document.addEventListener(
      ev,
      function () {
        if (!effectsEnabled()) return;
        if (audio && !audio.paused && currentWorld) {
          audio.muted = false;
          fadeVolume(TARGET_VOLUME);
          return;
        }
        resumeCurrent();
      },
      { capture: true }
    );
  });

  window.WeltenWorldAudioTest = {
    play: playAfterSwitch,
    stop: stopAll,
    bootMultiversum: bootMultiversum,
    activeWorld: activeWorld,
  };
})();
