/**
 * Mobile/Tablet: NEXORA Hero-Buttons → Hauptnavigation (nicht Orbit-v6-Patch)
 */
(function () {
  "use strict";

  function isMobile() {
    return window.matchMedia("(max-width: 1024px)").matches;
  }

  function goChapter(id) {
    if (!id) return;
    var link = document.querySelector('.menu-links a[data-go="' + id + '"]');
    if (link) {
      link.click();
      return;
    }
    var step = document.querySelector('.experience-step[data-go="' + id + '"]');
    if (step) step.click();
  }

  function wireButtons() {
    if (!isMobile()) return;
    document
      .querySelectorAll(
        "#slide-home .nexora-orbit-button[data-go], #slide-home .dna-slide[data-go]"
      )
      .forEach(function (btn) {
        if (btn.dataset.weltenMobileNav === "1") return;
        btn.dataset.weltenMobileNav = "1";
        btn.addEventListener(
          "click",
          function (e) {
            if (!isMobile()) return;
            var id = btn.getAttribute("data-go");
            if (!id) return;
            e.preventDefault();
            e.stopPropagation();
            goChapter(id);
            if (window.WeltenMobilePerf && window.WeltenMobilePerf.cleanup) {
              window.WeltenMobilePerf.cleanup();
            }
          },
          false
        );
      });
  }

  function boot() {
    wireButtons();
  }

  boot();
  window.addEventListener("load", boot);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  }
  window.addEventListener("resize", boot, { passive: true });

  window.addEventListener("message", function (e) {
    if (e.data && (e.data.type === "portfolio-world-enter" || e.data.type === "portfolio-cleanup-transition")) {
      setTimeout(boot, 80);
    }
  });

  window.WeltenMobileNexoraNav = { refresh: boot };
})();
