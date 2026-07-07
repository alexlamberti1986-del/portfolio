/**
 * Welten-Hintergrundmusik dauerhaft aus — stoppt alle bekannten Audio-Quellen.
 */
(function () {
  "use strict";

  function stopElement(el) {
    if (!el) return;
    try {
      el.pause();
      el.currentTime = 0;
      el.muted = true;
      el.volume = 0;
      el.loop = false;
      el.removeAttribute("src");
      el.load();
    } catch (e) {}
  }

  function stopAllWorldAudio() {
    stopElement(document.getElementById("mvWorldBgm"));
    stopElement(window.__mvWorldAudioEarly);
    window.__mvWorldAudioPlaying = false;
    window.__mvWorldAudioBoot = function () {
      return Promise.resolve();
    };

    try {
      document.querySelectorAll("audio").forEach(stopElement);
    } catch (e2) {}

    try {
      if (window.wwsSwitchMp3Cache) {
        Object.keys(window.wwsSwitchMp3Cache).forEach(function (key) {
          stopElement(window.wwsSwitchMp3Cache[key]);
        });
      }
    } catch (e3) {}
  }

  stopAllWorldAudio();
  document.addEventListener("DOMContentLoaded", stopAllWorldAudio);
  window.addEventListener("pageshow", stopAllWorldAudio);
  window.addEventListener("focus", stopAllWorldAudio);

  document.addEventListener("welten-audio-switch-start", stopAllWorldAudio);
  document.addEventListener("welten-audio-switch-end", stopAllWorldAudio);

  window.addEventListener("message", function (e) {
    if (!e.data) return;
    if (
      e.data.type === "mv-hero-ready" ||
      e.data.type === "portfolio-world-enter" ||
      e.data.type === "portfolio-world-reveal"
    ) {
      stopAllWorldAudio();
    }
  });

  window.WeltenWorldAudioTest = {
    play: function () {},
    stop: stopAllWorldAudio,
    bootMultiversum: function () {},
    activeWorld: function () {
      return document.body.getAttribute("data-master-world") || "general";
    },
    version: "20260707audio-off",
  };
})();
