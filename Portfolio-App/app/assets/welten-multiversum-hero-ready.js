/**
 * MULTIVERSUM — Boot-Veil bis Parallax-Start wirklich gerendert ist
 */
(function () {
  "use strict";

  var loaderTimer = 0;
  var fallbackTimer = 0;
  var progress = 0;
  var progressTimer = 0;
  var released = false;

  function veil() {
    return document.getElementById("mvBootVeil");
  }

  function setProgress(p) {
    progress = Math.max(progress, Math.min(100, p));
    var bar = document.querySelector(".mv-boot-veil__bar");
    if (bar) bar.style.width = progress + "%";
  }

  function startLoader() {
    var v = veil();
    if (!v || released || v.classList.contains("is-loading")) return;
    v.classList.add("is-loading");
    if (progressTimer) return;
    progressTimer = window.setInterval(function () {
      if (released) return;
      if (progress < 88) setProgress(progress + 1.8 + Math.random() * 2.2);
    }, 140);
  }

  function release() {
    if (released) return;
    released = true;
    if (loaderTimer) clearTimeout(loaderTimer);
    if (fallbackTimer) clearTimeout(fallbackTimer);
    if (progressTimer) clearInterval(progressTimer);

    setProgress(100);
    var v = veil();
    if (v) v.classList.add("is-released");

    document.documentElement.classList.remove("mv-hero-boot-pending");
    document.documentElement.classList.add("mv-hero-ready");
    document.body.classList.add("mv-hero-ready");

    window.setTimeout(function () {
      if (v && v.parentNode) v.parentNode.removeChild(v);
    }, 80);
  }

  function scheduleLoader() {
    loaderTimer = window.setTimeout(startLoader, 750);
  }

  function scheduleFallback() {
    fallbackTimer = window.setTimeout(release, 12000);
  }

  window.MVHeroReady = {
    mark: release,
    setProgress: setProgress,
    scheduleLoader: scheduleLoader,
    scheduleFallback: scheduleFallback,
  };

  scheduleLoader();
  scheduleFallback();
})();
