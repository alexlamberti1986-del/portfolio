/**
 * Splash-Boot — Startbild + Ladebalken, Parallax erst wenn bereit
 */
(function () {
  "use strict";

  var SPLASH = "assets/images/splash/multiversum-boot-splash.png?v=20260705live";
  var FALLBACK = "assets/multiversum-v4/backgrounds/webp/background_multiverse_three_worlds.webp?v=20260629mv-v4live";
  var V = "20260629mv-v4live";
  var MIN_MS = 1400;
  var MAX_MS = 22000;
  var FAILSAFE_MS = 26000;
  var POLL_MS = 120;

  var PREVIEW = "assets/images/4welten-preview/general/";
  var PRELOAD_IMAGES = [
    SPLASH,
    FALLBACK,
    "assets/multiversum-v4/backgrounds/webp/background_deep_space_neutral.webp?v=" + V,
    "assets/multiversum-parallax-v4/orbs/Multiversum.png?v=20260629mv-prof-portrait",
    "assets/multiversum-parallax-v4/orbs/Nexora.png?v=20260629mv-prof-portrait",
    "assets/multiversum-parallax-v4/orbs/Professional_new_new.png?v=20260629mv-prof-portrait",
    "assets/multiversum-parallax-v4/orbs/Freiraum.png?v=20260629mv-prof-portrait",
    PREVIEW + "05_MULTIVERSUM_05_Projekte.webp",
    PREVIEW + "03_MULTIVERSUM_03_Leistungen.webp",
    PREVIEW + "01_MULTIVERSUM_01_UeberMich.webp",
    PREVIEW + "07_MULTIVERSUM_07_Kontakt.webp",
  ];

  var failsafeTimer = 0;
  var released = false;

  function splashEnabled() {
    return !!(document.body && document.body.getAttribute("data-splash-boot") === "1");
  }

  function preloadImage(url) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = img.onerror = function () {
        resolve();
      };
      img.src = url;
    });
  }

  function setProgress(bar, label, pctEl, pct, text) {
    if (bar) bar.style.width = Math.min(100, Math.max(0, pct)) + "%";
    if (label && text) label.textContent = text;
    if (pctEl) pctEl.textContent = Math.round(Math.min(100, Math.max(0, pct))) + "%";
  }

  function wait(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function frameReady(frame) {
    try {
      var win = frame.contentWindow;
      var doc = frame.contentDocument;
      if (!win || !doc || doc.readyState !== "complete") return false;

      var desktop = window.matchMedia("(min-width: 1920px)").matches;
      if (!desktop) {
        return !!(doc.getElementById("mvStaticHero") || doc.getElementById("mvParallaxHero") || doc.querySelector("#slide-home"));
      }

      var hero = doc.getElementById("mvParallaxHero");
      if (hero && (hero.classList.contains("is-js-ready") || win.__mvParallaxHeroReady)) return true;
      if (doc.getElementById("mvStaticHero")) return true;
      return false;
    } catch (e) {
      return false;
    }
  }

  function waitForParallax(frame, bump) {
    return new Promise(function (resolve) {
      var start = Date.now();
      var tick = 72;

      function poll() {
        if (frameReady(frame)) {
          resolve();
          return;
        }
        if (Date.now() - start > MAX_MS) {
          resolve();
          return;
        }
        tick = Math.min(94, tick + 0.35);
        if (bump) bump(tick, "Parallax wird initialisiert…");
        setTimeout(poll, POLL_MS);
      }

      poll();
    });
  }

  function waitForFrameLoad(frame) {
    return new Promise(function (resolve) {
      try {
        if (frame.contentDocument && frame.contentDocument.readyState === "complete") {
          resolve();
          return;
        }
      } catch (e) {}
      frame.addEventListener("load", resolve, { once: true });
      setTimeout(resolve, MAX_MS);
    });
  }

  function release() {
    if (released) return;
    released = true;
    if (failsafeTimer) window.clearTimeout(failsafeTimer);

    document.documentElement.classList.add("mv-splash-done");
    window.setTimeout(function () {
      document.documentElement.classList.remove("mv-splash-active", "mv-splash-done");
      var splash = document.getElementById("mvSplashBoot");
      if (splash) splash.remove();
    }, 700);
  }

  async function boot() {
    if (!splashEnabled()) return;

    failsafeTimer = window.setTimeout(release, FAILSAFE_MS);
    document.documentElement.classList.add("mv-splash-active");

    var bar = document.getElementById("mvSplashBar");
    var label = document.getElementById("mvSplashLabel");
    var pctEl = document.getElementById("mvSplashPct");
    var started = Date.now();
    var progress = 0;

    function bump(target, text) {
      progress = Math.max(progress, target);
      setProgress(bar, label, pctEl, progress, text);
    }

    try {
      bump(4, "Multiversum wird vorbereitet…");

      await preloadImage(SPLASH);
      bump(10, "Startbild geladen");

      var done = 0;
      await Promise.all(
        PRELOAD_IMAGES.map(function (url) {
          return preloadImage(url).then(function () {
            done += 1;
            bump(10 + (done / PRELOAD_IMAGES.length) * 42, "Assets werden geladen…");
          });
        })
      );

      bump(54, "Welt wird aufgebaut…");

      var frame = document.querySelector(".mv4-frame.is-active");
      if (!frame) {
        bump(100, "Willkommen im Multiversum");
        await wait(320);
        release();
        return;
      }

      await waitForFrameLoad(frame);
      bump(72, "Parallax wird initialisiert…");

      await waitForParallax(frame, bump);
      bump(96, "Fast fertig…");

      var elapsed = Date.now() - started;
      if (elapsed < MIN_MS) await wait(MIN_MS - elapsed);

      bump(100, "Willkommen im Multiversum");
      await wait(320);
    } catch (e) {
      bump(100, "Willkommen im Multiversum");
      await wait(320);
    }

    release();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
