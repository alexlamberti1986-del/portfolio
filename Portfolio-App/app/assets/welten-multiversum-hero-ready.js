/**
 * MULTIVERSUM — sanfter Übergang vom Startposter zum Parallax-Hero
 */
(function () {
  "use strict";

  var fallbackTimer = 0;
  var released = false;

  function veil() {
    return document.getElementById("mvBootVeil");
  }

  function release() {
    if (released) return;
    released = true;
    if (fallbackTimer) clearTimeout(fallbackTimer);

    var v = veil();
    if (v) v.classList.add("is-releasing");

    document.documentElement.classList.remove("mv-hero-boot-pending");
    document.documentElement.classList.add("mv-hero-ready");
    document.body.classList.add("mv-hero-ready");

    window.setTimeout(function () {
      if (v && v.parentNode) v.parentNode.removeChild(v);
    }, 420);
  }

  function scheduleFallback() {
    fallbackTimer = window.setTimeout(release, 4500);
  }

  window.MVHeroReady = {
    mark: release,
    setProgress: function () {},
    scheduleLoader: function () {},
    scheduleFallback: scheduleFallback,
  };

  scheduleFallback();
})();
