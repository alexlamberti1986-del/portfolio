/**
 * Shell Performance — Idle-Preload lazy Welten, spart Zeit beim ersten Wechsel
 */
(function () {
  "use strict";

  function shouldPrefetch() {
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!conn) return true;
    if (conn.saveData) return false;
    var slow = conn.effectiveType === "slow-2g" || conn.effectiveType === "2g";
    return !slow;
  }

  function idlePreloadLazyWorlds(preloadFrame) {
    if (!shouldPrefetch() || typeof preloadFrame !== "function") return;
    var run = function () {
      preloadFrame(0);
      preloadFrame(2);
    };
    if ("requestIdleCallback" in window) {
      requestIdleCallback(run, { timeout: 3500 });
    } else {
      setTimeout(run, 1800);
    }
  }

  window.WeltenShellPerf = {
    shouldPrefetch: shouldPrefetch,
    idlePreloadLazyWorlds: idlePreloadLazyWorlds,
  };
})();
