/**
 * Splash-Boot — Startbild + Ladebalken, Parallax sofort wenn Hero bereit
 */
(function () {
  "use strict";

  var SPLASH = "assets/images/splash/multiversum-boot-splash.png?v=20260705live";
  var V = "20260629mv-v4live";
  var MIN_MS = 420;
  var MAX_MS = 18000;
  var FAILSAFE_MS = 22000;
  var POLL_MS = 48;

  var CRITICAL_PRELOAD = [
    "assets/multiversum-v4/backgrounds/webp/background_deep_space_neutral.webp?v=" + V,
    "assets/multiversum-v4/backgrounds/webp/background_multiverse_three_worlds.webp?v=" + V,
    "assets/multiversum-parallax-v4/orbs/Multiversum.png?v=20260629mv-prof-portrait",
    "assets/multiversum-parallax-v4/orbs/Nexora.png?v=20260629mv-prof-portrait",
    "assets/multiversum-parallax-v4/orbs/Professional_new_new.png?v=20260629mv-prof-portrait",
    "assets/multiversum-parallax-v4/orbs/Freiraum.png?v=20260629mv-prof-portrait",
  ];

  var failsafeTimer = 0;
  var released = false;
  var heroReadySignal = false;

  function splashEnabled() {
    return !!(document.body && document.body.getAttribute("data-splash-boot") === "1");
  }

  function preloadImage(url) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.decoding = "async";
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

  function docUsable(doc) {
    if (!doc) return false;
    return doc.readyState === "interactive" || doc.readyState === "complete";
  }

  function frameReady(frame) {
    if (heroReadySignal) return true;
    try {
      var doc = frame.contentDocument;
      if (!doc || !docUsable(doc)) return false;

      var desktop = window.matchMedia("(min-width: 1024px)").matches;
      if (!desktop) {
        return !!(doc.getElementById("mvStaticHero") || doc.getElementById("mvParallaxHero") || doc.querySelector("#slide-home"));
      }

      if (doc.defaultView && doc.defaultView.__mvParallaxHeroReady) return true;
      var hero = doc.getElementById("mvParallaxHero");
      if (hero && hero.classList.contains("is-boot-painted")) return true;
      if (doc.getElementById("mvStaticHero")) return true;
      return false;
    } catch (e) {
      return false;
    }
  }

  function waitForParallax(frame, bump) {
    return new Promise(function (resolve) {
      var start = Date.now();

      function poll() {
        if (frameReady(frame)) {
          resolve();
          return;
        }
        if (Date.now() - start > MAX_MS) {
          resolve();
          return;
        }
        if (bump) {
          var tick = Math.min(94, 72 + (Date.now() - start) / 220);
          bump(tick, "Parallax wird initialisiert…");
        }
        setTimeout(poll, POLL_MS);
      }

      poll();
    });
  }

  function waitForFrameUsable(frame) {
    return new Promise(function (resolve) {
      function check() {
        try {
          if (frame.contentDocument && docUsable(frame.contentDocument)) {
            resolve();
            return true;
          }
        } catch (e) {}
        return false;
      }
      if (check()) return;
      frame.addEventListener("load", function () {
        if (check()) return;
        setTimeout(resolve, 0);
      }, { once: true });
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
    }, 380);
  }

  function idlePreload(urls) {
    var run = function () {
      urls.forEach(function (url) {
        preloadImage(url);
      });
    };
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(run, { timeout: 4000 });
    } else {
      setTimeout(run, 1200);
    }
  }

  async function boot() {
    if (!splashEnabled()) return;

    window.addEventListener("message", function (e) {
      if (e.data && e.data.type === "mv-hero-ready") heroReadySignal = true;
    });

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
      bump(8, "Multiversum wird vorbereitet…");

      var frame = document.querySelector(".mv4-frame.is-active");

      var preloadPromise = Promise.all(
        CRITICAL_PRELOAD.map(function (url, i) {
          return preloadImage(url).then(function () {
            bump(12 + ((i + 1) / CRITICAL_PRELOAD.length) * 38, "Assets werden geladen…");
          });
        })
      );

      var framePromise = frame ? waitForFrameUsable(frame) : Promise.resolve();

      await Promise.all([preloadPromise, framePromise]);
      bump(58, "Welt wird aufgebaut…");

      if (!frame) {
        bump(100, "Willkommen im Multiversum");
        await wait(60);
        release();
        return;
      }

      bump(68, "Parallax wird initialisiert…");
      await waitForParallax(frame, bump);
      bump(96, "Fast fertig…");

      var elapsed = Date.now() - started;
      if (elapsed < MIN_MS) await wait(MIN_MS - elapsed);

      bump(100, "Willkommen im Multiversum");
      await wait(60);
    } catch (e) {
      bump(100, "Willkommen im Multiversum");
      await wait(60);
    }

    idlePreload([
      "assets/images/4welten-preview/general/05_MULTIVERSUM_05_Projekte.webp",
      "assets/images/4welten-preview/general/03_MULTIVERSUM_03_Leistungen.webp",
      "assets/images/4welten-preview/general/01_MULTIVERSUM_01_UeberMich.webp",
      "assets/images/4welten-preview/general/07_MULTIVERSUM_07_Kontakt.webp",
    ]);

    release();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
