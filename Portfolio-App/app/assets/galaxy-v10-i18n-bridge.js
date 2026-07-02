/**
 * Galaxy V10 Embed — Sprachwechsel (Shell / MULTIVERSUM Parent)
 */
(function () {
  "use strict";

  var LANG_KEY = "mv-preview-lang";

  function currentLang() {
    try {
      return localStorage.getItem(LANG_KEY) || sessionStorage.getItem(LANG_KEY) || "de";
    } catch (e) {
      return "de";
    }
  }

  function apply(lang) {
    if (!window.WeltenPreviewI18n || typeof window.WeltenPreviewI18n.applyGalaxy !== "function") return;
    window.WeltenPreviewI18n.applyGalaxy(document, lang || currentLang());
  }

  function boot() {
    apply(currentLang());
    window.addEventListener("message", function (e) {
      if (!e.data) return;
      if (e.data.type === "portfolio-preview-lang" && e.data.lang) apply(e.data.lang);
      if (e.data.type === "alx-preview-sync" && e.data.lang) apply(e.data.lang);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
