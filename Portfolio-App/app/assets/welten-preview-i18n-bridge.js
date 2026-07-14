/**
 * Preview-I18n Bridge — reagiert auf Sprachwechsel im Master-Frame.
 */
(function () {
  "use strict";

  var LANG_KEY = "mv-preview-lang";
  var active = false;
  var lastAppliedLang = "";
  var applyTimer = 0;

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
      localStorage.setItem(LANG_KEY, lang);
      sessionStorage.setItem(LANG_KEY, lang);
    } catch (e) {}
  }

  function formWorldKey() {
    if (window.WeltenOfferteForm && window.WeltenOfferteForm.formWorldKey) {
      return window.WeltenOfferteForm.formWorldKey();
    }
    if (window.WeltenContactLeadform && window.WeltenContactLeadform.formWorldKey) {
      return window.WeltenContactLeadform.formWorldKey();
    }
    var w = document.body.getAttribute("data-world") || "general";
    if (w === "vertex") return "professional";
    if (w === "general") return "multiversum";
    if (w === "nexora" || w === "freiraum") return w;
    return "nexora";
  }

  function syncLeadForm(lang) {
    var frame =
      document.getElementById("weltenOfferteForm") ||
      document.getElementById("weltenLeadForm") ||
      document.getElementById("mvLeadForm");
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

  function applyNow(lang) {
    if (!window.WeltenPreviewI18n) return;
    var code = lang || currentLang();
    if (code === lastAppliedLang) return;
    lastAppliedLang = code;
    storeLang(code);
    window.WeltenPreviewI18n.apply(document, code);
    if (window.MVParallaxHero && typeof window.MVParallaxHero.applyLang === "function") {
      window.MVParallaxHero.applyLang(code);
    }
    syncLeadForm(code);
    if (window.WeltenContactLeadform && window.WeltenContactLeadform.syncLeadFormFrame) {
      window.WeltenContactLeadform.syncLeadFormFrame();
    }
    if (window.WeltenOfferteForm && window.WeltenOfferteForm.syncOfferteFrame) {
      window.WeltenOfferteForm.syncOfferteFrame();
    }
    document.dispatchEvent(new CustomEvent("welten-lang-change", { detail: { lang: code } }));
  }

  function apply(lang) {
    var code = lang || currentLang();
    if (applyTimer) window.clearTimeout(applyTimer);
    applyTimer = window.setTimeout(function () {
      applyTimer = 0;
      applyNow(code);
    }, 48);
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
    var bootLang = currentLang();
    var runBoot = function () {
      applyNow(bootLang);
    };
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(runBoot, { timeout: 1200 });
    } else {
      setTimeout(runBoot, 0);
    }

    window.addEventListener("message", function (e) {
      if (!e.data) return;
      if (e.data.type === "portfolio-preview-lang" && e.data.lang) {
        apply(e.data.lang);
      }
      if (e.data.type === "alx-preview-sync") {
        if (e.data.lang) syncLeadForm(e.data.lang);
        if (window.WeltenContactLeadform && window.WeltenContactLeadform.syncLeadFormFrame) {
          window.WeltenContactLeadform.syncLeadFormFrame();
        }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.WeltenPreviewI18nBridge = { apply: apply, isActive: function () { return active; } };
})();
