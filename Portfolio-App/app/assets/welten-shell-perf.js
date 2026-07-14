/**
 * Shell Performance — kein Idle-Prefetch anderer Welten beim Start.
 * Prefetch nur gezielt beim Tippen/Fokus auf einen Welt-Button (Master).
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
    /* Idle-Prefetch aus: verhindert Zwischenladen / Konkurrenz mit aktiver Welt */
    return false;
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

  function scheduleLazyWorldPreload() {
    /* Absichtlich no-op — Welten laden erst beim Tap/Focus */
    return;
  }

  function injectDocumentPrefetch() {
    /* Kein NEXORA-Document-Prefetch beim Start */
    return;
  }

  window.WeltenShellPerf = {
    shouldPrefetch: shouldPrefetch,
    isMobileShell: isMobileShell,
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
