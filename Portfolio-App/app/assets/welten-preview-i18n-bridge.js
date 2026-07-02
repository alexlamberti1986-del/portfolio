/**
 * Preview-I18n Bridge — reagiert auf Sprachwechsel im Master-Frame.
 */
(function () {
  "use strict";

  var LANG_KEY = "mv-preview-lang";
  var active = false;

  function isPreviewContext() {
    if (window.parent === window) return false;
    try {
      var parentPath = window.parent.location.pathname || "";
      if (/multiversum-preview\.html/i.test(parentPath)) return true;
      var parentBody = window.parent.document && window.parent.document.body;
      return !!(parentBody && parentBody.getAttribute("data-live-shell") === "1");
    } catch (e) {
      return true;
    }
  }

  function currentLang() {
    try {
      return localStorage.getItem(LANG_KEY) || sessionStorage.getItem(LANG_KEY) || "de";
    } catch (e) {
      return "de";
    }
  }

  function storeLang(lang) {
    try {
      sessionStorage.setItem(LANG_KEY, lang);
    } catch (e) {}
  }

  function formWorldKey() {
    if (window.WeltenContactLeadform && window.WeltenContactLeadform.formWorldKey) {
      return window.WeltenContactLeadform.formWorldKey();
    }
    var w = document.body.getAttribute("data-world") || "general";
    if (w === "vertex") return "professional";
    if (w === "general" || w === "nexora" || w === "freiraum") return w === "general" ? "general" : w;
    return "nexora";
  }

  function syncLeadForm(lang) {
    var frame = document.getElementById("weltenLeadForm") || document.getElementById("mvLeadForm");
    if (!frame || !frame.contentWindow) return;
    try {
      frame.contentWindow.postMessage(
        {
          type: "alx-preview-sync",
          lang: lang || currentLang(),
          world: formWorldKey(),
        },
        "*"
      );
    } catch (e) {}
  }

  function apply(lang) {
    if (!window.WeltenPreviewI18n) return;
    var code = lang || currentLang();
    storeLang(code);
    window.WeltenPreviewI18n.apply(document, code);
    syncLeadForm(code);
    if (window.WeltenContactLeadform && window.WeltenContactLeadform.syncLeadFormFrame) {
      window.WeltenContactLeadform.syncLeadFormFrame();
    }
  }

  function boot() {
    var inShell = false;
    try {
      inShell =
        window.parent !== window &&
        window.parent.document &&
        window.parent.document.body &&
        window.parent.document.body.getAttribute("data-live-shell") === "1";
    } catch (e) {
      inShell = window.parent !== window;
    }

    if (!isPreviewContext() && !inShell && window.parent === window) {
      apply(currentLang());
      window.addEventListener("message", function (e) {
        if (!e.data) return;
        if (e.data.type === "portfolio-preview-lang" && e.data.lang) apply(e.data.lang);
        if (e.data.type === "alx-preview-sync" && e.data.lang) apply(e.data.lang);
      });
      window.WeltenPreviewI18nBridge = { apply: apply, isActive: function () { return true; } };
      return;
    }

    if (!isPreviewContext() && !inShell) return;
    active = true;
    apply(currentLang());

    window.addEventListener("message", function (e) {
      if (!e.data) return;
      if (e.data.type === "portfolio-preview-lang" && e.data.lang) {
        apply(e.data.lang);
      }
      if (e.data.type === "alx-preview-sync" && e.data.lang) {
        apply(e.data.lang);
      }
    });

    document.addEventListener("click", function () {
      setTimeout(function () {
        apply(currentLang());
      }, 120);
    });

    var obs = typeof MutationObserver !== "undefined"
      ? new MutationObserver(function () {
          apply(currentLang());
        })
      : null;
    if (obs) {
      obs.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["class"] });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.WeltenPreviewI18nBridge = { apply: apply, isActive: function () { return active; } };
})();
