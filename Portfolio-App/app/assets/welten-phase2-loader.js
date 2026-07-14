/**
 * Phase-2 Skripte erst nach Hero-Ready / Idle — schnellerer First Paint.
 */
(function () {
  "use strict";

  var VER = "20260710phase2";
  var loaded = false;

  var SCRIPTS = [
    "assets/welten-touch-env.js",
    "assets/welten-runtime-perf.js?v=20260608d",
    "assets/projects-accordion.js?v=20260613a",
    "assets/welten-form-service-images.js?v=20260629vk2",
    "assets/welten-projects-services.js?v=20260629vk2",
    "assets/welten-mobile-performance.js?v=20260608d",
    "assets/welten-skills-charts.js?v=20260706matrix5",
    "assets/portfolio-images.js?v=20260629-prof-portrait",
    "assets/welten-preview-images.js?v=20260629-prof-portrait",
    "assets/welten-mouse-paint.js?v=20260703wws-smooth",
    "assets/welten-mobile-hero.js?v=20260706hero-off",
    "assets/welten-seo.js?v=20260706perf-fix",
    "assets/welten-site-ia.js?v=20260706perf-fix",
    "assets/welten-visual-sprint2.js?v=20260714ctaAbout1",
    "assets/welten-perf-sprint3.js?v=20260602b",
    "assets/welten-perf-sprint4.js?v=20260608d",
    "assets/welten-ux-refine.js?v=20260530a",
    "assets/welten-final.js?v=20260706perf-fix",
    "assets/welten-cleanup.js?v=20260714orbitRevert1",
    "assets/welten-premium-review.js?v=20260531c",
    "assets/welten-final-restore.js?v=20260606c",
    "assets/welten-contact-final.js?v=20260714offerte1",
    "assets/welten-offerte.js?v=20260714offerte1",
    "assets/welten-chapter-visuals.js?v=20260706mobile-pass3",
    "assets/welten-slides-fr.js?v=20260706perf-fix",
    "assets/welten-content-i18n.js?v=20260714ctaAbout1",
    "assets/welten-projects-i18n.js?v=20260706nexora-nav-lang",
    "assets/welten-preview-i18n-bridge.js?v=20260706perf-fix",
    "assets/welten-i18n-refresh.js?v=20260706perf-fix",
    "assets/welten-portraits-apply.js?v=20260629-prof-portrait",
    "assets/welten-effects-governor.js?v=20260704opt",
  ];

  function injectScripts() {
    if (loaded) return;
    loaded = true;
    SCRIPTS.forEach(function (src) {
      if (document.querySelector('script[data-phase2-src="' + src + '"]')) return;
      var s = document.createElement("script");
      s.src = src.indexOf("?") >= 0 ? src : src + "?v=" + VER;
      s.defer = true;
      s.setAttribute("data-phase2-src", src);
      if (/\/welten-visual-sprint2\.js/.test(src)) {
        s.setAttribute("data-mv-skip", "1");
      }
      document.head.appendChild(s);
    });
  }

  function schedule() {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(injectScripts, { timeout: 2500 });
    } else {
      setTimeout(injectScripts, 900);
    }
  }

  function boot() {
    if (document.body && document.body.classList.contains("mv-home-ready")) {
      schedule();
      return;
    }
    window.addEventListener("message", function onHero(e) {
      if (!e.data || e.data.type !== "mv-hero-ready") return;
      window.removeEventListener("message", onHero);
      schedule();
    });
    setTimeout(schedule, 3500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
