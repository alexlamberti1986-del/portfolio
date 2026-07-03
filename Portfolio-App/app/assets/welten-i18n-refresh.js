/**
 * I18n Refresh — stellt sicher, dass Übersetzungen nach Inline-Skripten und UI-Aktionen greifen.
 */
(function () {
  "use strict";

  var busy = false;

  function currentLang() {
    try {
      return localStorage.getItem("mv-preview-lang") || sessionStorage.getItem("mv-preview-lang") || "de";
    } catch (e) {
      return "de";
    }
  }

  function refresh(lang) {
    if (busy) return;
    busy = true;
    var code = lang || currentLang();
    try {
      if (window.WeltenPreviewI18n) {
        window.WeltenPreviewI18n.apply(document, code);
      }
      if (window.WeltenContentI18n && typeof window.WeltenContentI18n.apply === "function") {
        window.WeltenContentI18n.apply(document, code);
      }
      if (window.WeltenProjectsI18n && typeof window.WeltenProjectsI18n.apply === "function") {
        window.WeltenProjectsI18n.apply(document, code);
      }
      if (window.WeltenCleanup && typeof window.WeltenCleanup.injectLeistungenRich === "function") {
        window.WeltenCleanup.injectLeistungenRich(code);
      }
      if (window.WeltenSkillsCharts && typeof window.WeltenSkillsCharts.init === "function") {
        window.WeltenSkillsCharts.init(code);
      }
    } finally {
      busy = false;
    }
  }

  function scheduleRefresh(lang) {
    var code = lang || currentLang();
    refresh(code);
    requestAnimationFrame(function () {
      refresh(code);
    });
    setTimeout(function () {
      refresh(code);
    }, 120);
  }

  window.addEventListener("load", function () {
    scheduleRefresh();
  });

  document.addEventListener("welten-chapter-change", function (e) {
    var ch = e && e.detail && e.detail.chapter;
    if (ch === "home" || ch === "projects" || ch === "leistungen" || ch === "about") {
      scheduleRefresh();
    }
  });

  document.addEventListener("welten-projects-panel-open", function () {
    scheduleRefresh();
  });

  window.addEventListener("message", function (e) {
    if (!e.data) return;
    if (e.data.type === "portfolio-preview-lang" && e.data.lang) {
      scheduleRefresh(e.data.lang);
    }
  });

  try {
    new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].attributeName === "data-world") {
          scheduleRefresh();
          break;
        }
      }
    }).observe(document.body, { attributes: true, attributeFilter: ["data-world"] });
  } catch (e) {}

  window.WeltenI18nRefresh = { refresh: refresh, scheduleRefresh: scheduleRefresh };
})();
