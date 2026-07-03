/**
 * Splash-Boot — Startbild + Ladebalken nur bei Desktop-Parallax (≥1024px)
 */
(function () {
  "use strict";

  var V = "20260629mv-v4live";
  var MIN_MS = 320;
  var FRAME_MS = 4500;
  var BOOT_MS = 7000;
  var FAILSAFE_MS = 8000;
  var POLL_MS = 48;

  var CRITICAL_PRELOAD = [
    "assets/multiversum-v4/backgrounds/webp/background_deep_space_neutral.webp?v=" + V,
    "assets/multiversum-v4/backgrounds/webp/background_multiverse_three_worlds.webp?v=" + V,
    "assets/multiversum-parallax-v4/orbs/Multiversum.png?v=20260629mv-prof-portrait",
  ];

  var failsafeTimer = 0;
  var shellFailsafeTimer = 0;
  var released = false;
  var heroReadySignal = false;

  function isParallaxViewport() {
    try {
      return window.matchMedia("(min-width: 1024px)").matches;
    } catch (e) {
      return window.innerWidth >= 1024;
    }
  }

  function splashEnabled() {
    return !!(document.body && document.body.getAttribute("data-splash-boot") === "1");
  }

  function releaseShellBootGate() {
    document.documentElement.classList.remove("mv-shell-booting");
  }

  function startShellBootGate() {
    document.documentElement.classList.add("mv-shell-booting");
    if (shellFailsafeTimer) window.clearTimeout(shellFailsafeTimer);
    shellFailsafeTimer = window.setTimeout(releaseShellBootGate, FAILSAFE_MS);
  }

  function onHeroReadyMessage() {
    heroReadySignal = true;
    if (!released) release();
  }

  function skipSplashImmediate() {
    document.documentElement.classList.remove("mv-splash-active", "mv-splash-done");
    var splash = document.getElementById("mvSplashBoot");
    if (splash) splash.remove();
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

  function splashText(key, fallback) {
    if (window.WeltenTranslations) {
      var lg = window.WeltenTranslations.getLang();
      var v = window.WeltenTranslations.t("splash." + key, lg);
      if (v) return v;
    }
    return fallback;
  }

  function docUsable(doc) {
    if (!doc) return false;
    return doc.readyState === "interactive" || doc.readyState === "complete";
  }

  function frameReady(frame) {
    if (heroReadySignal) return true;
    if (!frame) return true;
    try {
      var doc = frame.contentDocument;
      if (!doc || !docUsable(doc)) return false;
      if (doc.body && doc.body.classList.contains("mv-home-ready")) return true;
      if (doc.defaultView && doc.defaultView.__mvParallaxHeroReady) return true;
      if (doc.getElementById("mvParallaxHero")) return true;
      if (doc.getElementById("mvStaticHero")) return true;
      if (doc.getElementById("dnaStage")) return true;
      return false;
    } catch (e) {
      return false;
    }
  }

  function waitForParallax(frame, bump, maxMs) {
    maxMs = maxMs || FRAME_MS;
    return new Promise(function (resolve) {
      var start = Date.now();

      function poll() {
        if (frameReady(frame)) {
          resolve();
          return;
        }
        if (Date.now() - start > maxMs) {
          resolve();
          return;
        }
        if (bump) {
          try {
            var tick = Math.min(94, 72 + (Date.now() - start) / 180);
            bump(tick, splashText("initParallax", "Parallax wird initialisiert…"));
          } catch (err) {}
        }
        setTimeout(poll, POLL_MS);
      }

      poll();
    });
  }

  function waitForFrameUsable(frame, maxMs) {
    maxMs = maxMs || FRAME_MS;
    return new Promise(function (resolve) {
      if (!frame) {
        resolve();
        return;
      }
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
      frame.addEventListener(
        "load",
        function () {
          if (check()) return;
          setTimeout(resolve, 0);
        },
        { once: true }
      );
      setTimeout(resolve, maxMs);
    });
  }

  function release() {
    if (released) return;
    released = true;
    if (failsafeTimer) window.clearTimeout(failsafeTimer);
    if (shellFailsafeTimer) window.clearTimeout(shellFailsafeTimer);

    var splash = document.getElementById("mvSplashBoot");
    var hasSplash = !!(splash && isParallaxViewport());

    if (hasSplash) {
      document.documentElement.classList.add("mv-splash-done");
      window.setTimeout(function () {
        releaseShellBootGate();
        document.documentElement.classList.remove("mv-splash-active", "mv-splash-done");
        if (splash) splash.remove();
      }, 220);
      return;
    }

    releaseShellBootGate();
    skipSplashImmediate();
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

  async function runDesktopBoot(bump) {
    bump(8, splashText("preparing", "Multiversum wird vorbereitet…"));

    var frame = document.querySelector(".mv4-frame.is-active");

    var preloadPromise = Promise.all(
      CRITICAL_PRELOAD.map(function (url, i) {
        return preloadImage(url).then(function () {
          bump(12 + ((i + 1) / CRITICAL_PRELOAD.length) * 28, splashText("loadingAssets", "Assets werden geladen…"));
        });
      })
    );

    await Promise.race([
      Promise.all([
        frame ? waitForFrameUsable(frame, FRAME_MS) : Promise.resolve(),
        preloadPromise,
      ]),
      wait(FRAME_MS),
    ]);

    bump(58, splashText("buildingWorld", "Welt wird aufgebaut…"));

    await Promise.race([
      frame ? waitForParallax(frame, bump, FRAME_MS) : Promise.resolve(),
      wait(2200),
    ]);

    bump(92, splashText("almostDone", "Fast fertig…"));
    await wait(MIN_MS);
    bump(100, splashText("welcome", "Willkommen im Multiversum"));
    await wait(40);
  }

  async function boot() {
    if (!splashEnabled()) return;

    window.addEventListener("message", function (e) {
      if (e.data && e.data.type === "mv-hero-ready") onHeroReadyMessage();
    });

    startShellBootGate();
    failsafeTimer = window.setTimeout(release, FAILSAFE_MS);

    if (!isParallaxViewport()) {
      skipSplashImmediate();
      try {
        var mobileFrame = document.querySelector(".mv4-frame.is-active");
        await Promise.race([waitForFrameUsable(mobileFrame, 3000), wait(3000)]);
      } catch (e) {}
      release();
      return;
    }

    document.documentElement.classList.add("mv-splash-active");

    var bar = document.getElementById("mvSplashBar");
    var label = document.getElementById("mvSplashLabel");
    var pctEl = document.getElementById("mvSplashPct");
    var progress = 0;

    function bump(target, text) {
      progress = Math.max(progress, target);
      setProgress(bar, label, pctEl, progress, text);
    }

    try {
      await Promise.race([runDesktopBoot(bump), wait(BOOT_MS)]);
      if (progress < 100) {
        bump(100, splashText("welcome", "Willkommen im Multiversum"));
      }
    } catch (e) {
      bump(100, splashText("welcome", "Willkommen im Multiversum"));
    }

    idlePreload([
      "assets/multiversum-parallax-v4/orbs/Nexora.png?v=20260629mv-prof-portrait",
      "assets/multiversum-parallax-v4/orbs/Professional_new_new.png?v=20260629mv-prof-portrait",
      "assets/multiversum-parallax-v4/orbs/Freiraum.png?v=20260629mv-prof-portrait",
    ]);

    release();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
