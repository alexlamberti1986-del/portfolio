/**
 * Sprint 4 — Canvas/RAF-Governor, Deferred Init, Mobile Paint
 */
(function () {
  "use strict";

  var mqMobile = window.matchMedia("(max-width: 1024px)");
  var mqCoarse = window.matchMedia("(hover: none) and (pointer: coarse)");

  function isMobilePerf() {
    return mqMobile.matches || mqCoarse.matches;
  }

  function syncPerfMode() {
    var mobile = isMobilePerf();
    document.documentElement.classList.toggle("welten-perf-mobile", mobile);
    if (mobile) {
      document.documentElement.classList.add("welten-reduce-effects");
    }
  }

  function onChapterChange() {
    syncPerfMode();
    var sub = document.body.classList.contains("is-subpage");
    document.documentElement.classList.toggle("welten-subpage-perf", sub);
  }

  function deferUntilChapter(chapter, fn) {
    if (typeof fn !== "function") return;
    var ran = false;
    function run() {
      if (ran) return;
      ran = true;
      fn();
    }
    function check() {
      var cur =
        document.body.getAttribute("data-current-slide") ||
        (document.querySelector(".slide.active") &&
          document.querySelector(".slide.active").getAttribute("data-slide"));
      if (cur === chapter) run();
    }
    check();
    if (ran) return;
    var obs = new MutationObserver(check);
    obs.observe(document.body, { attributes: true, attributeFilter: ["data-current-slide", "class"] });
    document.addEventListener("welten-chapter-change", check);
    document.addEventListener("click", function () {
      setTimeout(check, 60);
    });
  }

  function patchDeferredModules() {
    deferUntilChapter("leistungen", function () {
      document.dispatchEvent(new CustomEvent("welten-init-skills-charts"));
    });
    deferUntilChapter("projects", function () {
      document.dispatchEvent(new CustomEvent("welten-init-projects-accordion"));
    });
  }

  function apply() {
    syncPerfMode();
    onChapterChange();
    patchDeferredModules();
    mqMobile.addEventListener("change", syncPerfMode);
    mqCoarse.addEventListener("change", syncPerfMode);
    var obs = new MutationObserver(onChapterChange);
    obs.observe(document.body, { attributes: true, attributeFilter: ["class", "data-current-slide"] });
    document.addEventListener("welten-chapter-change", onChapterChange);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
})();
