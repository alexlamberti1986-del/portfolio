/**
 * Shell Performance — Aggressives Preload + schneller Weltwechsel
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

  function preloadLazyWorlds(preloadFrame) {
    if (!shouldPrefetch() || typeof preloadFrame !== "function") return;
    [0, 1, 2, 3].forEach(function (i) {
      preloadFrame(i);
    });
  }

  /** Sofort nach kurzer Verzögerung + Idle-Fallback */
  function scheduleLazyWorldPreload(preloadFrame) {
    if (!shouldPrefetch() || typeof preloadFrame !== "function") return;
    setTimeout(function () {
      [0, 1, 2, 3].forEach(function (i) {
        preloadFrame(i);
      });
    }, 350);
    if ("requestIdleCallback" in window) {
      requestIdleCallback(
        function () {
          preloadLazyWorlds(preloadFrame);
        },
        { timeout: 900 }
      );
    }
  }

  function injectDocumentPrefetch() {
    if (!shouldPrefetch()) return;
    ["MULTIVERSUM.html", "NEXORA.html", "FREIRAUM.html"].forEach(function (href) {
      if (document.querySelector('link[rel="prefetch"][href="' + href + '"]')) return;
      var link = document.createElement("link");
      link.rel = "prefetch";
      link.href = href;
      link.as = "document";
      document.head.appendChild(link);
    });
  }

  window.WeltenShellPerf = {
    shouldPrefetch: shouldPrefetch,
    preloadLazyWorlds: preloadLazyWorlds,
    scheduleLazyWorldPreload: scheduleLazyWorldPreload,
    injectDocumentPrefetch: injectDocumentPrefetch,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectDocumentPrefetch);
  } else {
    injectDocumentPrefetch();
  }
})();
