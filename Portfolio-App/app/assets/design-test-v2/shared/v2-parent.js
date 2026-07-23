/**
 * Parent-side listener for design-test-v2 iframe postMessages.
 * Forwards lang / music / effects to existing shell controls — no second audio.
 */
(function (root) {
  "use strict";

  function isV2() {
    try {
      return root.document.documentElement.getAttribute("data-design-test-v2") === "1";
    } catch (e) {
      return false;
    }
  }

  function clickShell(sel) {
    var el = root.document.querySelector(sel);
    if (el) el.click();
  }

  function onMessage(ev) {
    if (!isV2()) return;
    var data = ev && ev.data;
    if (!data || data.source !== "design-test-v2") return;
    var type = data.type;
    var detail = data.detail || {};
    try {
      if (type === "lang") {
        var lang = detail.lang === "en" ? "en" : "de";
        var flag = root.document.querySelector('.mv4-flag[data-lang="' + lang + '"]');
        if (flag) flag.click();
      } else if (type === "music") {
        clickShell("[data-audio-toggle], .mv4-audio-toggle, #mvAudioToggle, button[aria-controls='mvWorldBgm']");
        var audioBtn = root.document.querySelector(".mv4-sound, [data-sound-toggle], .mv4-bar [data-audio]");
        if (audioBtn) audioBtn.click();
      } else if (type === "effects") {
        clickShell("[data-effects-toggle], .mv4-fx-toggle, #mvFxToggle");
      }
    } catch (e) {}
  }

  function patchWorldHrefs() {
    if (!isV2()) return;
    var bases = [
      "/design-test-v2/multiversum",
      "/design-test-v2/nexora",
      "/design-test-v2/professional",
      "/design-test-v2/freiraum",
    ];
    root.document.querySelectorAll(".mv4-worlds [data-iframe]").forEach(function (a) {
      var i = parseInt(a.getAttribute("data-iframe"), 10);
      if (!isNaN(i) && bases[i]) a.setAttribute("href", bases[i]);
    });
  }

  function bind() {
    root.addEventListener("message", onMessage);
    patchWorldHrefs();
    root.addEventListener("popstate", patchWorldHrefs);
  }

  root.WeltenDesignTestV2Parent = { patchWorldHrefs: patchWorldHrefs };

  if (root.document.readyState === "loading") {
    root.document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})(typeof window !== "undefined" ? window : this);
