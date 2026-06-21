/**
 * MULTIVERSUM-Weltwechsel — eigene Animation & Sound (Preview).
 */
(function () {
  "use strict";

  var running = false;
  var audioCtx = null;

  function ensureAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function resumeAudio() {
    try {
      var ctx = ensureAudio();
      if (ctx.state === "suspended") ctx.resume();
    } catch (e) {}
  }

  function isSoundEnabled() {
    if (
      window.WeltenWorldSwitchPreview &&
      typeof window.WeltenWorldSwitchPreview.isEffectsEnabled === "function"
    ) {
      return window.WeltenWorldSwitchPreview.isEffectsEnabled();
    }
    var fx = document.getElementById("mv4-fx");
    if (fx) return fx.getAttribute("aria-pressed") === "true";
    var btn = document.getElementById("sound-toggle");
    return !!(btn && btn.getAttribute("aria-pressed") === "true");
  }

  function playMultiverseSound() {
    if (!isSoundEnabled()) return;
    resumeAudio();
    var ctx = ensureAudio();
    var t0 = ctx.currentTime;

    function tone(freq, freqEnd, dur, vol, type, delay) {
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      var start = t0 + (delay || 0);
      o.type = type || "sine";
      o.frequency.setValueAtTime(freq, start);
      if (freqEnd) o.frequency.exponentialRampToValueAtTime(Math.max(24, freqEnd), start + dur);
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(vol, start + 0.025);
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(start);
      o.stop(start + dur + 0.06);
    }

    tone(110, 440, 0.7, 0.1, "sine", 0);
    tone(330, 880, 0.55, 0.07, "triangle", 0.06);
    tone(520, 1320, 0.45, 0.06, "sine", 0.14);
    tone(880, 220, 0.85, 0.05, "sine", 0.28);

    var bufferSize = Math.floor(ctx.sampleRate * 0.35);
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    var i;
    for (i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.35;
    }
    var noise = ctx.createBufferSource();
    noise.buffer = buffer;
    var filt = ctx.createBiquadFilter();
    filt.type = "bandpass";
    filt.frequency.setValueAtTime(900, t0);
    filt.frequency.exponentialRampToValueAtTime(2800, t0 + 0.35);
    filt.Q.value = 0.8;
    var ng = ctx.createGain();
    ng.gain.setValueAtTime(0.04, t0);
    ng.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.38);
    noise.connect(filt);
    filt.connect(ng);
    ng.connect(ctx.destination);
    noise.start(t0);
    noise.stop(t0 + 0.4);
  }

  function buildOverlay(mode) {
    var el = document.getElementById("mv-transition");
    if (!el) return null;
    var title = document.getElementById("mv-transition-title");
    if (title) title.textContent = "MULTIVERSUM";
    el.classList.add("is-multiverse", "is-mv-fx");
    el.setAttribute("data-mv-mode", mode || "enter");
    return el;
  }

  function run(mode, done) {
    if (running) return;
    running = true;
    playMultiverseSound();
    var overlay = buildOverlay(mode);
    if (!overlay) {
      running = false;
      if (done) done();
      return;
    }
    overlay.classList.add("is-active");
    setTimeout(function () {
      overlay.classList.remove("is-active", "is-mv-fx");
      running = false;
      if (done) done();
    }, 1100);
  }

  window.WeltenMultiversumTransition = { run: run, playSound: playMultiverseSound };
})();
