/**
 * Touch/Tablet-Erkennung — einheitlich für alle Welten-Skripte
 * (Handy, Tablet, große Touch-Laptops; nicht nur max-width: 1024px)
 */
(function (global) {
  "use strict";

  function isTouchUI() {
    return !!(
      global.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      global.matchMedia("(pointer: coarse)").matches ||
      global.matchMedia("(max-width: 1280px)").matches
    );
  }

  function applyTouchClass() {
    var on = isTouchUI();
    global.document.documentElement.classList.toggle("welten-touch-env", on);
    return on;
  }

  applyTouchClass();
  global.addEventListener("resize", applyTouchClass, { passive: true });
  global.addEventListener("orientationchange", function () {
    setTimeout(applyTouchClass, 100);
  });

  global.WeltenTouchEnv = {
    isTouch: isTouchUI,
    refresh: applyTouchClass,
    version: "20260528a",
  };
})(window);
