/**
 * Shell Performance — Preload nur wenn sinnvoll, nie im kritischen Startpfad
 */
(function () {
  "use strict";

  function isMobileShell() {
    try {
      return window.matchMedia("(max-width: 1024px)").matches;
    } catch (e) {
      return window.innerWidth <= 1024;
    }
  }

  function shouldPrefetch() {
    if (isMobileShell()) return false;
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!conn) return true;
    if (conn.saveData) return false;
    var slow = conn.effectiveType === "slow-2g" || conn.effectiveType === "2g" || conn.effectiveType === "3g";
    return !slow;
  }

  function adjacentWorlds(activeIdx) {
    var idx = typeof activeIdx === "number" ? activeIdx : 0;
    var list = [];
    if (idx > 0) list.push(idx - 1);
    if (idx < 3) list.push(idx + 1);
    return list;
  }

  function preloadLazyWorlds(preloadFrame, activeIdx) {
    if (!shouldPrefetch() || typeof preloadFrame !== "function") return;
    adjacentWorlds(activeIdx).forEach(function (i) {
      preloadFrame(i);
    });
  }

  function scheduleLazyWorldPreload(preloadFrame, activeIdx) {
    if (!shouldPrefetch() || typeof preloadFrame !== "function") return;
    var run = function () {
      preloadLazyWorlds(preloadFrame, activeIdx);
    };
    if ("requestIdleCallback" in window) {
      requestIdleCallback(run, { timeout: 5000 });
    } else {
      setTimeout(run, 3500);
    }
  }

  function injectDocumentPrefetch() {
    if (!shouldPrefetch()) return;
    var run = function () {
      if (document.querySelector('link[rel="prefetch"][href="NEXORA.html"]')) return;
      var link = document.createElement("link");
      link.rel = "prefetch";
      link.href = "NEXORA.html";
      link.as = "document";
      document.head.appendChild(link);
    };
    if ("requestIdleCallback" in window) {
      requestIdleCallback(run, { timeout: 6000 });
    } else {
      setTimeout(run, 4000);
    }
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
