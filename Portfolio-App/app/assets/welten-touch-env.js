/**
 * Touch-Erkennung — nur echte Touch-Geräte (kein Desktop-Fenster <1280px)
 */
(function (global) {
  "use strict";

  function isTouchUI() {
    return !!(
      global.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      global.matchMedia("(pointer: coarse)").matches
    );
  }

  function isMobileLayout() {
    return global.matchMedia("(max-width: 1024px)").matches;
  }

  function applyTouchClass() {
    var touch = isTouchUI();
    var mobile = isMobileLayout();
    global.document.documentElement.classList.toggle("welten-touch-env", touch);
    global.document.documentElement.classList.toggle("welten-mobile-layout", mobile);
    return touch;
  }

  applyTouchClass();
  global.addEventListener("resize", applyTouchClass, { passive: true });
  global.addEventListener("orientationchange", function () {
    setTimeout(applyTouchClass, 100);
  });

  global.WeltenTouchEnv = {
    isTouch: isTouchUI,
    isMobileLayout: isMobileLayout,
    refresh: applyTouchClass,
    version: "20260530b",
  };
})(window);
