/**
 * I18n Refresh — stellt sicher, dass Übersetzungen nach Inline-Skripten und UI-Aktionen greifen.
 */
(function () {
  "use strict";

  var busy = false;
  var refreshTimer = 0;
  var lastLang = "";

  function currentLang() {
    try {
      return localStorage.getItem("mv-preview-lang") || sessionStorage.getItem("mv-preview-lang") || "de";
    } catch (e) {
      return "de";
    }
  }

  function refresh(lang) {
    var code = lang || currentLang();
    if (busy || code === lastLang) return;
    busy = true;
    lastLang = code;
    try {
      if (window.WeltenPreviewI18n) {
        window.WeltenPreviewI18n.apply(document, code);
      }
    } catch (e1) {}
    try {
      if (window.WeltenContentI18n && typeof window.WeltenContentI18n.apply === "function") {
        window.WeltenContentI18n.apply(document, code);
      }
    } catch (e2) {}
    try {
      if (window.WeltenProjectsI18n && typeof window.WeltenProjectsI18n.apply === "function") {
        window.WeltenProjectsI18n.apply(document, code);
      }
    } catch (e3) {}
    try {
      if (window.WeltenCleanup && typeof window.WeltenCleanup.injectLeistungenRich === "function") {
        window.WeltenCleanup.injectLeistungenRich(code);
      }
    } catch (e4) {}
    try {
      if (window.WeltenSkillsCharts && typeof window.WeltenSkillsCharts.init === "function") {
        window.WeltenSkillsCharts.init(code);
      }
    } catch (e5) {}
    busy = false;
  }

  function scheduleRefresh(lang, force) {
    if (force) lastLang = "";
    if (refreshTimer) window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(function () {
      refreshTimer = 0;
      refresh(lang);
    }, 120);
  }

  document.addEventListener("welten-chapter-change", function (e) {
    var ch = e && e.detail && e.detail.chapter;
    if (ch === "home" || ch === "projects" || ch === "leistungen" || ch === "about") {
      scheduleRefresh(null, true);
    }
  });

  document.addEventListener("welten-projects-panel-open", function () {
    scheduleRefresh(null, true);
  });

  window.WeltenI18nRefresh = { refresh: refresh, scheduleRefresh: scheduleRefresh };
})();
