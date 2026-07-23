/**
 * Shared bridge for design-test-v2 world frames → parent shell.
 * Handles lang / music / effects postMessage and footer year.
 * Does not own audio — parent shell remains single audio instance.
 */
(function (root) {
  "use strict";

  function post(type, detail) {
    try {
      var payload = { source: "design-test-v2", type: type, detail: detail || {} };
      if (root.parent && root.parent !== root) {
        root.parent.postMessage(payload, "*");
      }
      root.dispatchEvent(new CustomEvent("v2-bridge", { detail: payload }));
    } catch (e) {}
  }

  function bindControls(doc) {
    doc = doc || root.document;
    doc.querySelectorAll("[data-v2-lang]").forEach(function (el) {
      if (el.__v2Bound) return;
      el.__v2Bound = true;
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var lang = el.getAttribute("data-v2-lang") || "de";
        post("lang", { lang: lang });
        try {
          root.localStorage.setItem("mv-lang", lang);
        } catch (err) {}
        doc.documentElement.setAttribute("lang", lang === "en" ? "en" : "de-CH");
        doc.documentElement.setAttribute("data-lang", lang);
      });
    });

    doc.querySelectorAll("[data-v2-music]").forEach(function (el) {
      if (el.__v2Bound) return;
      el.__v2Bound = true;
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var action = el.getAttribute("data-v2-music") || "toggle";
        post("music", { action: action });
      });
    });

    doc.querySelectorAll("[data-v2-effects]").forEach(function (el) {
      if (el.__v2Bound) return;
      el.__v2Bound = true;
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var action = el.getAttribute("data-v2-effects") || "toggle";
        post("effects", { action: action });
        var on = doc.documentElement.getAttribute("data-effects") !== "off";
        if (action === "toggle") on = !on;
        else if (action === "off") on = false;
        else on = true;
        doc.documentElement.setAttribute("data-effects", on ? "on" : "off");
        try {
          root.localStorage.setItem("mv-effects", on ? "on" : "off");
        } catch (err) {}
      });
    });
  }

  function fillYears(doc) {
    doc = doc || root.document;
    var y = String(new Date().getFullYear());
    doc.querySelectorAll("[data-v2-year], [data-year]").forEach(function (el) {
      el.textContent = y;
    });
  }

  function applyReducedMotion(doc) {
    doc = doc || root.document;
    try {
      var mq = root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq && mq.matches) {
        doc.documentElement.setAttribute("data-reduced-motion", "1");
      }
    } catch (e) {}
  }

  function syncFromStorage(doc) {
    doc = doc || root.document;
    try {
      var lang = root.localStorage.getItem("mv-lang") || "de";
      doc.documentElement.setAttribute("data-lang", lang);
      var fx = root.localStorage.getItem("mv-effects") || "on";
      doc.documentElement.setAttribute("data-effects", fx);
    } catch (e) {}
  }

  function init() {
    var doc = root.document;
    syncFromStorage(doc);
    applyReducedMotion(doc);
    fillYears(doc);
    bindControls(doc);
  }

  root.WeltenDesignTestV2Bridge = {
    post: post,
    init: init,
    fillYears: fillYears,
  };

  if (root.document.readyState === "loading") {
    root.document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(typeof window !== "undefined" ? window : this);
