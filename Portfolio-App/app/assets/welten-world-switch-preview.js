/**
 * Weltwechsel-Animation — Produktion (alexlamberti.ch).
 */
(function () {
  "use strict";

  /* ── Einheitliche Timing-Konstanten (alle 4 Welten gleich lang) ── */
  var WWS_TIMING = {
    WORLD_TRANSITION_DURATION: 3000,
    EFFECT_MS: 1200,
    TITLE_REVEAL_AT: 1000,
    TITLE_FADE_IN: 400,
    TITLE_HOLD: 1200,
    TITLE_FADE_OUT: 400,
    EXIT_MS: 400,
    COVER_MS: 1200,
    SOUND_DURATION_MS: 3000,
  };

  function getTimingForWorld(worldKey) {
    var mobile = false;
    try {
      mobile = window.matchMedia("(max-width: 768px)").matches;
    } catch (e) {}
    if (mobile) {
      return Object.assign({}, WWS_TIMING, {
        WORLD_TRANSITION_DURATION: 1400,
        EFFECT_MS: 700,
        TITLE_REVEAL_AT: 520,
        TITLE_FADE_IN: 280,
        TITLE_HOLD: 500,
        COVER_MS: 420,
        EXIT_MS: 280,
      });
    }
    if (worldKey === "general") {
      return Object.assign({}, WWS_TIMING, {
        WORLD_TRANSITION_DURATION: 3800,
        EFFECT_MS: 2000,
        TITLE_REVEAL_AT: 1720,
        TITLE_FADE_IN: 520,
        TITLE_HOLD: 1400,
        COVER_MS: 1300,
      });
    }
    if (worldKey === "nexora") {
      return Object.assign({}, WWS_TIMING, {
        TITLE_HOLD: 1000,
      });
    }
    if (worldKey === "freiraum") {
      return Object.assign({}, WWS_TIMING, {
        WORLD_TRANSITION_DURATION: 4200,
        EFFECT_MS: 3400,
        TITLE_REVEAL_AT: 1700,
        TITLE_FADE_IN: 560,
        TITLE_HOLD: 1300,
        COVER_MS: 1250,
      });
    }
    return WWS_TIMING;
  }

  function getOrbPhaseMs(worldKey, effectMs) {
    if (worldKey === "general") {
      return {
        wander: Math.round(effectMs * 0.22),
        converge: Math.round(effectMs * 0.58),
        merge: Math.round(effectMs * 0.2),
      };
    }
    return {
      wander: Math.round(effectMs * 0.35),
      converge: Math.round(effectMs * 0.425),
      merge: Math.round(effectMs * 0.225),
    };
  }

  function isCanvasDrivenWorld(worldKey) {
    return worldKey === "nexora" || worldKey === "general" || worldKey === "freiraum";
  }

  var WWS_SEQUENCE_MS = WWS_TIMING.WORLD_TRANSITION_DURATION;

  function wwsScale(ms) {
    return Math.round(ms * (WWS_TIMING.WORLD_TRANSITION_DURATION / 2000));
  }

  function wwsSoundAt(gen, ms, fn) {
    wwsAt(gen, wwsScale(ms), fn);
  }

  function applyTimingCssVars(worldKey) {
    var timing = getTimingForWorld(worldKey || "");
    var r = document.documentElement;
    r.style.setProperty("--wws-transition-duration", timing.WORLD_TRANSITION_DURATION + "ms");
    r.style.setProperty("--wws-title-fade-in", timing.TITLE_FADE_IN + "ms");
    r.style.setProperty("--wws-title-hold", timing.TITLE_HOLD + "ms");
    r.style.setProperty("--wws-title-fade-out", timing.TITLE_FADE_OUT + "ms");
    r.style.setProperty("--wws-exit-duration", timing.EXIT_MS + "ms");
    r.style.setProperty("--wws-effect-duration", timing.EFFECT_MS + "ms");
    r.style.setProperty("--wws-pro-wipe-duration", Math.round(timing.EFFECT_MS * 0.39) + "ms");
    r.style.setProperty("--wws-pro-wipe-delay", Math.round(timing.EFFECT_MS * 0.37) + "ms");
  }

  var running = false;
  var activeOverlay = null;
  var activeTimers = [];
  var activeRaf = 0;

  function wwsClearTimers() {
    activeTimers.forEach(function (id) {
      clearTimeout(id);
    });
    activeTimers = [];
    if (activeRaf) {
      cancelAnimationFrame(activeRaf);
      activeRaf = 0;
    }
  }

  function wwsLater(fn, ms) {
    var id = setTimeout(fn, ms);
    activeTimers.push(id);
    return id;
  }

  function wwsAbortTransition() {
    wwsSoundGen += 1;
    wwsClearTimers();
    if (activeOverlay) {
      stopCanvas(activeOverlay);
      activeOverlay.remove();
      activeOverlay = null;
    }
    document.documentElement.classList.remove("welten-world-switch-lock");
    running = false;
    window.__wwsPreviewOwnsSound = false;
  }

  var WORLD_ORB_THEMES = {
    general: {
      bgTrail: "rgba(6, 4, 16, 0.38)",
      orbCount: 40,
      palette: [
        ["255, 210, 255", "255, 89, 178", "200, 40, 140"],
        ["200, 235, 255", "94, 196, 255", "30, 120, 220"],
        ["255, 230, 180", "255, 155, 55", "220, 100, 0"],
        ["230, 210, 255", "155, 107, 255", "80, 30, 200"],
        ["255, 245, 200", "255, 216, 106", "200, 150, 0"],
      ],
      flash: { core: "255, 255, 255", mid: "255, 89, 178", outer: "94, 196, 255" },
      highlight: "255, 255, 255",
      glowMul: 2.7,
    },
    freiraum: {
      bgTrail: "rgba(28, 16, 38, 0.42)",
      orbCount: 18,
      palette: [
        ["255, 220, 180", "255, 122, 0", "255, 90, 0"],
        ["255, 180, 220", "255, 47, 146", "220, 20, 120"],
        ["255, 240, 160", "255, 196, 0", "230, 160, 0"],
        ["180, 230, 255", "29, 183, 255", "0, 140, 220"],
        ["210, 190, 255", "123, 77, 255", "90, 40, 200"],
      ],
      flash: { core: "255, 255, 255", mid: "255, 196, 0", outer: "255, 47, 146" },
      highlight: "255, 255, 255",
      glowMul: 2.55,
    },
  };

  var WORLD_META = {
    general: { title: "MULTIVERSUM" },
    nexora: { title: "NEXORA" },
    vertex: { title: "PROFESSIONAL" },
    freiraum: { title: "FREIRAUM" },
  };

  function activeFrameIndex() {
    if (typeof window.mv4ActiveFrameIndex === "function") {
      return window.mv4ActiveFrameIndex();
    }
    var idx = -1;
    var sel = document.querySelector(".mv4-frame") ? ".mv4-frame" : ".world-frame";
    document.querySelectorAll(sel).forEach(function (f, j) {
      if (f.classList.contains("is-active")) idx = j;
    });
    return idx;
  }

  function nexoraFxHtml() {
    return (
      '<div class="wws-nexora-core" aria-hidden="true">' +
      '<span class="wws-nexora-ring wws-nexora-ring--1"></span>' +
      '<span class="wws-nexora-ring wws-nexora-ring--2"></span>' +
      '<span class="wws-nexora-ring wws-nexora-ring--3"></span>' +
      "</div>" +
      '<span class="wws-data-beam wws-data-beam--1"></span>' +
      '<span class="wws-data-beam wws-data-beam--2"></span>' +
      '<span class="wws-data-beam wws-data-beam--3"></span>' +
      '<span class="wws-data-beam wws-data-beam--4"></span>' +
      '<div class="wws-scanlines" aria-hidden="true"></div>'
    );
  }

  function freiraumFxHtml() {
    return (
      '<span class="wws-splash wws-splash--1"></span>' +
      '<span class="wws-splash wws-splash--2"></span>' +
      '<span class="wws-splash wws-splash--3"></span>' +
      '<span class="wws-splash wws-splash--4"></span>' +
      '<span class="wws-orb wws-orb--1"></span>' +
      '<span class="wws-orb wws-orb--2"></span>' +
      '<span class="wws-orb wws-orb--3"></span>' +
      '<span class="wws-orb wws-orb--4"></span>' +
      '<span class="wws-orb wws-orb--5"></span>' +
      '<span class="wws-orb wws-orb--6"></span>'
    );
  }

  function buildOverlay(worldKey) {
    var meta = WORLD_META[worldKey] || WORLD_META.nexora;
    var el = document.createElement("div");
    el.className = "welten-world-switch";
    el.setAttribute("data-world", worldKey);
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.setAttribute("aria-label", meta.title);

    var fxExtra = "";
    var canvasHtml =
      worldKey === "vertex"
        ? ""
        : '<canvas class="welten-world-switch__canvas" aria-hidden="true"></canvas>';
    el.classList.add("wws-staged");

    var wipeHtml =
      worldKey === "vertex"
        ? '<div class="welten-world-switch__wipe wws-pro-wipe wws-pro-wipe--white" aria-hidden="true"></div>' +
          '<div class="welten-world-switch__wipe wws-pro-wipe wws-pro-wipe--black" aria-hidden="true"></div>'
        : '<div class="welten-world-switch__wipe" aria-hidden="true"></div>';

    el.innerHTML =
      '<div class="welten-world-switch__bg" aria-hidden="true"></div>' +
      wipeHtml +
      canvasHtml +
      '<div class="welten-world-switch__fx" aria-hidden="true">' +
      fxExtra +
      "</div>" +
      '<div class="welten-world-switch__content">' +
      '<h2 class="welten-world-switch__title" data-text="' +
      meta.title +
      '">' +
      meta.title +
      "</h2>" +
      "</div>";

    return el;
  }

  function markCanvasSequenceDone(overlay) {
    if (!overlay || overlay._wwsTitleShown) return;
    overlay._wwsTitleShown = true;
    overlay._wwsTitleShownAt = Date.now();
  }

  function revealStagedTitle(overlay) {
    if (!overlay || overlay._wwsTitleShown) return;
    markCanvasSequenceDone(overlay);
    overlay.classList.add("wws--title-reveal");
    if (overlay.getAttribute("data-world") === "vertex" && wwsSoundEnabled()) {
      wwsResumeAudio();
      try {
        wwsProTitleBing(wwsEnsureAudio(), wwsEnsureAudio().currentTime);
      } catch (e) {}
    }
  }

  var wwsAudioCtx = null;
  var wwsSoundGen = 0;
  var wwsActiveWorldGain = 1;

  function wwsEnsureAudio() {
    if (!wwsAudioCtx) {
      wwsAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return wwsAudioCtx;
  }

  function wwsResumeAudio() {
    try {
      var ctx = wwsEnsureAudio();
      if (ctx.state === "suspended") ctx.resume();
    } catch (e) {}
  }

  function wwsEffectsEnabled() {
    var fx = document.getElementById("mv4-fx");
    if (fx) return fx.getAttribute("aria-pressed") === "true";
    var legacy = document.getElementById("sound-toggle");
    if (legacy) return legacy.getAttribute("aria-pressed") === "true";
    return true;
  }

  function wwsSoundEnabled() {
    return wwsEffectsEnabled();
  }

  function wwsSoundAlive(gen) {
    return gen === wwsSoundGen && wwsSoundEnabled();
  }

  function wwsAt(gen, delayMs, fn) {
    setTimeout(function () {
      if (!wwsSoundAlive(gen)) return;
      try {
        fn(wwsEnsureAudio(), wwsEnsureAudio().currentTime);
      } catch (e) {}
    }, delayMs);
  }

  function wwsTone(ctx, t, opts) {
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    var dur = opts.dur || 0.2;
    var vol = (opts.vol || 0.08) * wwsActiveWorldGain;
    o.type = opts.type || "sine";
    o.frequency.setValueAtTime(opts.freq || 440, t);
    if (opts.freqEnd) {
      o.frequency.exponentialRampToValueAtTime(Math.max(20, opts.freqEnd), t + dur);
    }
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + (opts.attack || 0.018));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.08);
  }

  function wwsNoise(ctx, t, opts) {
    var dur = opts.dur || 0.12;
    var vol = (opts.vol || 0.06) * wwsActiveWorldGain;
    var bufferSize = Math.max(1, Math.floor(ctx.sampleRate * dur));
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    var i;
    for (i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    var src = ctx.createBufferSource();
    src.buffer = buffer;
    var filt = ctx.createBiquadFilter();
    filt.type = opts.filterType || "bandpass";
    filt.frequency.setValueAtTime(opts.freq || 1200, t);
    if (opts.freqEnd) {
      filt.frequency.exponentialRampToValueAtTime(Math.max(40, opts.freqEnd), t + dur);
    }
    filt.Q.value = opts.q || 1.1;
    var g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filt);
    filt.connect(g);
    g.connect(ctx.destination);
    src.start(t);
    src.stop(t + dur + 0.08);
  }

  function wwsGainEnv(g, t, dur, vol, attack, hold, release) {
    var a = attack || 0.02;
    var h = hold != null ? hold : dur * 0.55;
    var r = release || Math.max(0.04, dur - a - h);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + a);
    g.gain.setValueAtTime(vol, t + a + h);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + h + r);
  }

  function wwsSliderWipe(ctx, t, opts) {
    var dur = opts.dur || 0.42;
    var vol = (opts.vol || 0.085) * wwsActiveWorldGain;
    var bufferSize = Math.max(1, Math.floor(ctx.sampleRate * dur));
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    var i;
    for (i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    var src = ctx.createBufferSource();
    src.buffer = buffer;
    var hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.setValueAtTime(opts.highpass || 180, t);
    var bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = opts.q || 2.8;
    bp.frequency.setValueAtTime(opts.freqStart || 320, t);
    bp.frequency.exponentialRampToValueAtTime(Math.max(120, opts.freqEnd || 5200), t + dur * 0.92);
    var g = ctx.createGain();
    wwsGainEnv(g, t, dur, vol, dur * 0.14, dur * 0.68, dur * 0.16);
    src.connect(hp);
    hp.connect(bp);
    bp.connect(g);
    g.connect(ctx.destination);
    src.start(t);
    src.stop(t + dur + 0.06);
    if (opts.airFreq) {
      wwsTone(ctx, t + dur * 0.05, {
        type: "sine",
        freq: opts.airFreq,
        freqEnd: opts.airFreq * 0.55,
        dur: dur * 0.75,
        vol: vol * 0.12,
        attack: 0.04,
      });
    }
  }

  function wwsRobotUtterance(ctx, t, opts) {
    var dur = opts.dur || 0.14;
    var vol = (opts.vol || 0.075) * wwsActiveWorldGain;
    var pitch = opts.pitch || 140;
    var pitchEnd = opts.pitchEnd != null ? opts.pitchEnd : pitch * 0.9;
    var carrier = ctx.createOscillator();
    var ring = ctx.createOscillator();
    var ringGain = ctx.createGain();
    var bp1 = ctx.createBiquadFilter();
    var bp2 = ctx.createBiquadFilter();
    var g = ctx.createGain();
    carrier.type = "sawtooth";
    ring.type = "sine";
    carrier.frequency.setValueAtTime(pitch, t);
    if (opts.trill) {
      var step;
      var steps = 5;
      for (step = 1; step <= steps; step++) {
        carrier.frequency.linearRampToValueAtTime(
          pitch * (step % 2 === 0 ? 1.07 : 0.96),
          t + (dur / steps) * step
        );
      }
    } else {
      carrier.frequency.exponentialRampToValueAtTime(Math.max(55, pitchEnd), t + dur);
    }
    ring.frequency.setValueAtTime(opts.ring || 32, t);
    ringGain.gain.setValueAtTime(opts.clear ? 6 : 14 + (opts.alien ? 10 : 0), t);
    ring.connect(ringGain);
    ringGain.connect(carrier.frequency);
    bp1.type = "bandpass";
    bp1.frequency.value = opts.f1 || 480;
    bp1.Q.value = opts.q || 2.4;
    bp2.type = "bandpass";
    bp2.frequency.value = opts.f2 || 1350;
    bp2.Q.value = opts.q2 || 3.2;
    wwsGainEnv(g, t, dur, vol, 0.01, dur * 0.58, dur * 0.3);
    carrier.connect(bp1);
    bp1.connect(bp2);
    bp2.connect(g);
    if (wwsActiveWorldGain > 1) {
      var dry = ctx.createGain();
      var dryHp = ctx.createBiquadFilter();
      dryHp.type = "highpass";
      dryHp.frequency.value = 140;
      dry.gain.value = vol * 0.58;
      carrier.connect(dryHp);
      dryHp.connect(dry);
      dry.connect(g);
    }
    g.connect(ctx.destination);
    carrier.start(t);
    carrier.stop(t + dur + 0.06);
    ring.start(t);
    ring.stop(t + dur + 0.06);
    if (opts.hiss) {
      wwsNoise(ctx, t, { dur: dur * 0.65, vol: vol * 0.62, freq: 3200, freqEnd: 5200, q: 3.8 });
    }
  }

  function wwsScheduleRobotCodeReading(gen, sequenceMs) {
    var totalMs = sequenceMs || WWS_SEQUENCE_MS;
    var ms = 70;
    while (ms < totalMs - 160) {
      (function (at) {
        wwsAt(gen, at, function (ctx, t) {
          wwsRobotUtterance(ctx, t, {
            dur: 0.08 + Math.random() * 0.14,
            vol: 0.1 + Math.random() * 0.055,
            pitch: 105 + Math.random() * 130,
            pitchEnd: 85 + Math.random() * 95,
            f1: 320 + Math.random() * 480,
            f2: 850 + Math.random() * 1300,
            ring: 22 + Math.random() * 38,
            alien: true,
            hiss: Math.random() < 0.38,
          });
        });
      })(ms);
      ms += 62 + Math.floor(Math.random() * 105);
    }

    ms = 180;
    while (ms < totalMs - 220) {
      if (Math.random() < 0.42) {
        (function (at) {
          wwsAt(gen, at, function (ctx, t) {
            var count = 3 + Math.floor(Math.random() * 5);
            var si;
            for (si = 0; si < count; si++) {
              wwsRobotUtterance(ctx, t + si * 0.085, {
                dur: 0.07 + Math.random() * 0.07,
                vol: 0.115,
                pitch: 120 + si * 18 + Math.random() * 30,
                pitchEnd: 100 + si * 12,
                f1: 380 + si * 70,
                f2: 1000 + si * 180,
                ring: 28 + si * 4,
                alien: true,
                hiss: si === 0,
              });
            }
          });
        })(ms);
      }
      ms += 260 + Math.floor(Math.random() * 340);
    }
  }

  function wwsRobotSayNexora(ctx, t) {
    var phonemes = [
      { pitch: 156, pitchEnd: 138, f1: 310, f2: 860, dur: 0.13, hiss: true },
      { pitch: 208, pitchEnd: 232, f1: 440, f2: 2180, dur: 0.15 },
      { pitch: 252, pitchEnd: 185, f1: 560, f2: 2550, dur: 0.11, hiss: true },
      { pitch: 146, pitchEnd: 132, f1: 350, f2: 700, dur: 0.17 },
      { pitch: 136, pitchEnd: 122, f1: 410, f2: 1120, dur: 0.14, trill: true },
      { pitch: 192, pitchEnd: 215, f1: 660, f2: 1160, dur: 0.22 },
    ];
    var offset = 0;
    var i;
    for (i = 0; i < phonemes.length; i++) {
      (function (p, start) {
        wwsRobotUtterance(ctx, t + start, {
          dur: p.dur,
          vol: 0.18,
          pitch: p.pitch,
          pitchEnd: p.pitchEnd,
          f1: p.f1,
          f2: p.f2,
          ring: 20,
          alien: true,
          clear: true,
          hiss: p.hiss,
          trill: p.trill,
        });
      })(phonemes[i], offset);
      offset += phonemes[i].dur * 0.72 + 0.09;
    }
  }

  function playNexoraSwitchSound(gen) {
    var NT = getTimingForWorld("nexora");
    wwsScheduleRobotCodeReading(gen, NT.WORLD_TRANSITION_DURATION);
    wwsSoundAt(gen, NT.TITLE_REVEAL_AT - 10, function (ctx, t) {
      wwsRobotSayNexora(ctx, t);
    });
  }

  function wwsBrushSwish(ctx, t, opts) {
    var dur = opts.dur || 0.36;
    var vol = (opts.vol || 0.052) * wwsActiveWorldGain;
    var bufferSize = Math.max(1, Math.floor(ctx.sampleRate * dur));
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    var i;
    for (i = 0; i < bufferSize; i++) {
      var env = Math.sin((i / bufferSize) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env * (0.85 + Math.random() * 0.15);
    }
    var src = ctx.createBufferSource();
    src.buffer = buffer;
    var bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = opts.q || 0.72;
    bp.frequency.setValueAtTime(opts.freqStart || 260, t);
    bp.frequency.exponentialRampToValueAtTime(Math.max(80, opts.freqEnd || 1650), t + dur * 0.88);
    var lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(3400, t);
    lp.frequency.exponentialRampToValueAtTime(900, t + dur);
    var g = ctx.createGain();
    wwsGainEnv(g, t, dur, vol, dur * 0.06, dur * 0.52, dur * 0.38);
    src.connect(bp);
    bp.connect(lp);
    lp.connect(g);
    g.connect(ctx.destination);
    src.start(t);
    src.stop(t + dur + 0.06);
    wwsNoise(ctx, t + dur * 0.04, {
      dur: dur * 0.42,
      vol: vol * 0.28,
      freq: 380,
      freqEnd: 1100,
      q: 0.48,
      filterType: "bandpass",
    });
  }

  function wwsFreiraumTada(ctx, t) {
    wwsTone(ctx, t, { type: "sine", freq: 494, dur: 0.09, vol: 0.072, attack: 0.008 });
    wwsTone(ctx, t + 0.1, { type: "sine", freq: 523, dur: 0.38, vol: 0.105, attack: 0.012 });
    wwsTone(ctx, t + 0.1, { type: "sine", freq: 659, dur: 0.42, vol: 0.098, attack: 0.012 });
    wwsTone(ctx, t + 0.1, { type: "sine", freq: 784, dur: 0.45, vol: 0.09, attack: 0.012 });
    wwsTone(ctx, t + 0.12, { type: "sine", freq: 988, dur: 0.32, vol: 0.068, attack: 0.014 });
    wwsNoise(ctx, t + 0.1, { dur: 0.22, vol: 0.032, freq: 600, freqEnd: 1400, q: 0.6, filterType: "lowpass" });
  }

  function wwsBuildSwelling(ctx, t, freq, dur, vol) {
    wwsTone(ctx, t, { type: "sine", freq: freq, freqEnd: freq * 1.12, dur: dur, vol: vol, attack: dur * 0.35 });
    wwsTone(ctx, t + dur * 0.15, { type: "sine", freq: freq * 1.5, dur: dur * 0.75, vol: vol * 0.35, attack: dur * 0.25 });
  }

  function wwsProTitleBing(ctx, t) {
    wwsTone(ctx, t, { type: "sine", freq: 784, freqEnd: 988, dur: 0.42, vol: 0.07, attack: 0.006 });
    wwsTone(ctx, t + 0.012, { type: "sine", freq: 1174, dur: 0.32, vol: 0.048, attack: 0.008 });
    wwsTone(ctx, t + 0.025, { type: "sine", freq: 1567, dur: 0.22, vol: 0.028, attack: 0.01 });
    wwsNoise(ctx, t, { dur: 0.04, vol: 0.012, freq: 4200, q: 5 });
  }

  function playProfessionalSwitchSound(gen) {
    var PT = getTimingForWorld("vertex");
    var wipeDur = PT.EFFECT_MS * 0.39 / 1000;
    wwsSoundAt(gen, 20, function (ctx, t) {
      wwsSliderWipe(ctx, t, {
        dur: wipeDur,
        vol: 0.085,
        freqStart: 380,
        freqEnd: 5600,
        highpass: 200,
        q: 2.6,
        airFreq: 840,
      });
    });

    wwsSoundAt(gen, PT.COVER_MS, function (ctx, t) {
      wwsSliderWipe(ctx, t, {
        dur: wipeDur,
        vol: 0.088,
        freqStart: 2200,
        freqEnd: 240,
        highpass: 100,
        q: 2.1,
        airFreq: 160,
      });
    });
  }

  function playFreiraumSwitchSound(gen) {
    var FT = getTimingForWorld("freiraum");
    wwsSoundAt(gen, 0, function (ctx, t) {
      wwsNoise(ctx, t, {
        dur: 0.22,
        vol: 0.014,
        freq: 160,
        freqEnd: 380,
        q: 0.35,
        filterType: "lowpass",
      });
    });

    [40, 155, 270, 385, 500, 615, 730, 845, 960, 1080, 1200, 1320, 1440, 1560, 1680, 1800].forEach(function (ms, i) {
      if (ms > FT.EFFECT_MS + 120) return;
      wwsSoundAt(gen, ms, function (ctx, t) {
        wwsBrushSwish(ctx, t, {
          dur: 0.28 + (i % 3) * 0.06,
          vol: 0.044 + (i % 2) * 0.012,
          freqStart: 190 + i * 28,
          freqEnd: 1180 + i * 88,
          q: 0.58 + (i % 2) * 0.16,
        });
      });
    });

    wwsSoundAt(gen, FT.TITLE_REVEAL_AT, function (ctx, t) {
      wwsFreiraumTada(ctx, t);
    });
  }

  function playMultiversumSwitchSound(gen) {
    var MT = getTimingForWorld("general");
    wwsSoundAt(gen, 0, function (ctx, t) {
      wwsBuildSwelling(ctx, t, 98, 0.62, 0.055);
      wwsTone(ctx, t, { type: "sine", freq: 196, freqEnd: 392, dur: 0.75, vol: 0.06, attack: 0.12 });
    });
    wwsSoundAt(gen, MT.EFFECT_MS * 0.35, function (ctx, t) {
      wwsBuildSwelling(ctx, t, 262, 0.5, 0.058);
      wwsTone(ctx, t + 0.05, { type: "triangle", freq: 330, freqEnd: 660, dur: 0.55, vol: 0.052, attack: 0.1 });
    });
    wwsSoundAt(gen, MT.EFFECT_MS * 0.65, function (ctx, t) {
      wwsBuildSwelling(ctx, t, 392, 0.48, 0.062);
      wwsNoise(ctx, t, { dur: 0.55, vol: 0.038, freq: 500, freqEnd: 2400, q: 0.7, filterType: "bandpass" });
    });
    wwsSoundAt(gen, MT.TITLE_REVEAL_AT, function (ctx, t) {
      wwsTone(ctx, t, { type: "sine", freq: 523, freqEnd: 1046, dur: 0.7, vol: 0.07, attack: 0.08 });
      wwsTone(ctx, t + 0.08, { type: "sine", freq: 659, dur: 0.55, vol: 0.058, attack: 0.06 });
      wwsTone(ctx, t + 0.12, { type: "sine", freq: 784, dur: 0.5, vol: 0.05, attack: 0.05 });
      wwsTone(ctx, t + 0.04, { type: "sine", freq: 880, freqEnd: 1320, dur: 0.42, vol: 0.072, attack: 0.01 });
      wwsTone(ctx, t + 0.08, { type: "sine", freq: 1108, dur: 0.38, vol: 0.06, attack: 0.01 });
      wwsNoise(ctx, t, { dur: 0.28, vol: 0.03, freq: 800, freqEnd: 3200, q: 0.55, filterType: "lowpass" });
    });
  }

  function playTransitionSound(worldKey) {
    if (!wwsEffectsEnabled()) return;
    wwsSoundGen += 1;
    var gen = wwsSoundGen;
    wwsResumeAudio();
    if (worldKey === "general") {
      wwsActiveWorldGain = 3.8;
      playMultiversumSwitchSound(gen);
    } else if (worldKey === "nexora") {
      wwsActiveWorldGain = 8;
      playNexoraSwitchSound(gen);
    } else if (worldKey === "vertex") {
      wwsActiveWorldGain = 1;
      playProfessionalSwitchSound(gen);
    } else {
      wwsActiveWorldGain = 4.2;
      playFreiraumSwitchSound(gen);
    }
    wwsActiveWorldGain = 1;
  }

  function hookSoundToggle() {
    var btn = document.getElementById("mv4-fx") || document.getElementById("sound-toggle");
    if (!btn || btn.dataset.wwsSoundHooked === "1") return;
    btn.dataset.wwsSoundHooked = "1";
    btn.addEventListener("click", function () {
      if (btn.getAttribute("aria-pressed") === "true") wwsResumeAudio();
    });
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeOutBack(t) {
    var c1 = 1.6;
    var c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  function drawGlowSphere(ctx, x, y, r, pulse, coreRgb, glowRgb, fadeRgb, glowMul) {
    var fade = fadeRgb || glowRgb;
    var mul = glowMul || 2.6;
    var glowR = r * (mul + Math.sin(pulse) * 0.35);
    var grd = ctx.createRadialGradient(x, y, 0, x, y, glowR);
    grd.addColorStop(0, "rgba(" + coreRgb + ", " + (0.95 + Math.sin(pulse) * 0.05) + ")");
    grd.addColorStop(0.22, "rgba(" + glowRgb + ", 0.72)");
    grd.addColorStop(0.5, "rgba(" + glowRgb + ", 0.28)");
    grd.addColorStop(0.78, "rgba(" + fade + ", 0.08)");
    grd.addColorStop(1, "rgba(" + fade + ", 0)");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y, glowR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(" + coreRgb + ", " + (0.55 + Math.sin(pulse * 1.4) * 0.2) + ")";
    ctx.beginPath();
    ctx.arc(x - r * 0.22, y - r * 0.22, r * 0.28, 0, Math.PI * 2);
    ctx.fill();
  }

  function randomMatrixChar() {
    var chars = "アイウエオカキクケコサシスセソ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return chars.charAt(Math.floor(Math.random() * chars.length));
  }

  function startNexoraMatrixCanvas(overlay) {
    var canvas = overlay.querySelector(".welten-world-switch__canvas");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var WORD = "NEXORA";
    var LETTER_ORDER = [3, 0, 5, 1, 4, 2];
    var NT = getTimingForWorld("nexora");
    var FIRST_LETTER_MS = Math.round(NT.EFFECT_MS * 0.6);
    var LETTER_STAGGER_MS = Math.round(NT.EFFECT_MS * 0.24);
    var LETTER_FLIGHT_MS = Math.round(NT.EFFECT_MS * 0.48);
    var HOLD_AFTER_MS = Math.max(600, Math.round(NT.EFFECT_MS * 0.5));
    var w = 0;
    var h = 0;
    var cx = 0;
    var cy = 0;
    var runningAnim = true;
    var startTime = performance.now();
    var columns = [];
    var letters = [];
    var fontSize = 16;
    var colStep = 20;
    var titleRevealed = false;

    function initColumns() {
      columns = [];
      var density = w < 640 ? 0.62 : w < 1024 ? 0.82 : 1;
      var count = Math.ceil((w / colStep) * density) + 1;
      var i;
      for (i = 0; i < count; i++) {
        columns.push({
          x: i * colStep,
          y: Math.random() * h,
          speed: 5 + Math.random() * 10,
          trail: 10 + Math.floor(Math.random() * 18),
        });
      }
    }

    function initLetters() {
      var spacing = fontSize * 2.05;
      var totalW = spacing * (WORD.length - 1);
      var startX = cx - totalW * 0.5;
      letters = [];
      var i;
      var j;
      for (i = 0; i < WORD.length; i++) {
        var activateAt = FIRST_LETTER_MS;
        for (j = 0; j < LETTER_ORDER.length; j++) {
          if (LETTER_ORDER[j] === i) {
            activateAt = FIRST_LETTER_MS + j * LETTER_STAGGER_MS;
            break;
          }
        }
        letters.push({
          char: WORD.charAt(i),
          tx: startX + i * spacing,
          ty: cy,
          x: Math.random() * w,
          y: -fontSize * 2 - Math.random() * h * 0.4,
          size: fontSize * 3.2,
          activateAt: activateAt,
          arrived: false,
        });
      }
    }

    function allLettersArrived(elapsed) {
      var i;
      for (i = 0; i < letters.length; i++) {
        if (!letters[i].arrived) return false;
      }
      return elapsed >= FIRST_LETTER_MS + (WORD.length - 1) * LETTER_STAGGER_MS + LETTER_FLIGHT_MS;
    }

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      cx = w * 0.5;
      cy = h * 0.5;
      fontSize = Math.max(14, Math.min(18, Math.round(w / 72)));
      colStep = Math.max(16, Math.round(fontSize * 1.15));
      initColumns();
      initLetters();
    }

    function drawRain(intensity) {
      var i;
      var j;
      ctx.font = fontSize + "px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      for (i = 0; i < columns.length; i++) {
        var col = columns[i];
        for (j = 0; j < col.trail; j++) {
          var py = col.y - j * fontSize;
          if (py < -fontSize || py > h + fontSize) continue;
          var alpha = ((col.trail - j) / col.trail) * intensity;
          if (j === 0) {
            ctx.fillStyle = "rgba(210, 248, 255, " + (alpha * 0.95) + ")";
            ctx.shadowColor = "#65d9ff";
            ctx.shadowBlur = 8;
          } else {
            ctx.fillStyle = "rgba(0, 180, 255, " + (alpha * 0.72) + ")";
            ctx.shadowBlur = 0;
          }
          ctx.fillText(randomMatrixChar(), col.x, py);
        }
        ctx.shadowBlur = 0;
        col.y += col.speed;
        if (col.y - col.trail * fontSize > h) {
          col.y = -Math.random() * h * 0.3;
          col.speed = 5 + Math.random() * 10;
          col.trail = 10 + Math.floor(Math.random() * 18);
        }
      }
    }

    function drawLetters(elapsed) {
      var i;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (i = 0; i < letters.length; i++) {
        var L = letters[i];
        if (elapsed < L.activateAt) continue;
        var t = Math.min(1, (elapsed - L.activateAt) / LETTER_FLIGHT_MS);
        var eased = easeOutCubic(t);
        if (t >= 1) {
          L.arrived = true;
          L.x = L.tx;
          L.y = L.ty;
        } else {
          L.x += (L.tx - L.x) * (0.1 + eased * 0.18);
          L.y += (L.ty - L.y) * (0.1 + eased * 0.18);
        }
        var glow = L.arrived ? 1 : 0.5 + eased * 0.5;
        ctx.font =
          "800 " +
          L.size +
          "px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
        ctx.shadowColor = "#65d9ff";
        ctx.shadowBlur = 10 + eased * 22;
        ctx.fillStyle = "rgba(200, 245, 255, " + glow + ")";
        ctx.fillText(L.char, L.x, L.y);
        ctx.shadowBlur = 0;
      }
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    }

    resize();

    function draw(now) {
      if (!runningAnim) return;
      var elapsed = now - startTime;

      ctx.fillStyle = "rgba(2, 6, 15, 0.16)";
      ctx.fillRect(0, 0, w, h);

      var rainIntensity = titleRevealed ? 0.35 : allLettersArrived(elapsed) ? 0.55 : 1;
      drawRain(rainIntensity);
      drawLetters(elapsed);

      if (!titleRevealed && allLettersArrived(elapsed)) {
        if (elapsed >= FIRST_LETTER_MS + (WORD.length - 1) * LETTER_STAGGER_MS + LETTER_FLIGHT_MS + HOLD_AFTER_MS) {
          titleRevealed = true;
          revealStagedTitle(overlay);
        }
      }

      overlay._wwsRaf = requestAnimationFrame(draw);
    }

    overlay._wwsStopCanvas = function () {
      runningAnim = false;
      if (overlay._wwsRaf) cancelAnimationFrame(overlay._wwsRaf);
    };

    overlay._wwsRaf = requestAnimationFrame(draw);
  }

  function startOrbCanvas(overlay, worldKey) {
    var canvas = overlay.querySelector(".welten-world-switch__canvas");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var theme = WORLD_ORB_THEMES[worldKey] || WORLD_ORB_THEMES.freiraum;
    var orbs = [];
    var w = 0;
    var h = 0;
    var cx = 0;
    var cy = 0;
    var runningAnim = true;
    var startTime = performance.now();
    var mergeFlash = 0;
    var OT = getTimingForWorld(worldKey);

    var phases = getOrbPhaseMs(worldKey, OT.EFFECT_MS);
    var WANDER_MS = phases.wander;
    var CONVERGE_MS = phases.converge;
    var MERGE_MS = phases.merge;
    var isGeneral = worldKey === "general";

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      cx = w * 0.5;
      cy = h * 0.42;
    }

    function initOrbs() {
      orbs = [];
      var count = theme.orbCount;
      if (w < 640) count = Math.max(14, Math.floor(count * 0.62));
      else if (w < 1024) count = Math.max(18, Math.floor(count * 0.8));
      var i;
      for (i = 0; i < count; i++) {
        var pal = theme.palette[i % theme.palette.length];
        var spawnX = Math.random() * w;
        var spawnY = Math.random() * h;
        if (isGeneral) {
          var ring = i / count;
          var angle = ring * Math.PI * 2 + Math.random() * 0.6;
          var dist = 0.28 + Math.random() * 0.38;
          spawnX = cx + Math.cos(angle) * w * dist;
          spawnY = cy + Math.sin(angle) * h * dist;
        }
        orbs.push({
          x: spawnX,
          y: spawnY,
          vx: (Math.random() - 0.5) * (isGeneral ? 2.6 : 3.2),
          vy: (Math.random() - 0.5) * (isGeneral ? 2.6 : 3.2),
          r: (isGeneral ? 12 : 16) + Math.random() * (isGeneral ? 26 : 32),
          baseR: (isGeneral ? 12 : 16) + Math.random() * (isGeneral ? 26 : 32),
          pulse: Math.random() * Math.PI * 2,
          alpha: 1,
          coreRgb: pal[0],
          glowRgb: pal[1],
          fadeRgb: pal[2] || pal[1],
        });
      }
    }

    function drawOrb(orb) {
      drawGlowSphere(
        ctx,
        orb.x,
        orb.y,
        orb.r,
        orb.pulse,
        orb.coreRgb,
        orb.glowRgb,
        orb.fadeRgb,
        theme.glowMul
      );
    }

    resize();
    initOrbs();

    function getPhase(elapsed) {
      if (elapsed < WANDER_MS) return "wander";
      if (elapsed < WANDER_MS + CONVERGE_MS) return "converge";
      if (elapsed < WANDER_MS + CONVERGE_MS + MERGE_MS) return "merge";
      return "done";
    }

    function draw(now) {
      if (!runningAnim) return;
      var elapsed = now - startTime;
      var phase = getPhase(elapsed);

      ctx.fillStyle = theme.bgTrail;
      ctx.fillRect(0, 0, w, h);

      if (phase === "wander") {
        for (var i = 0; i < orbs.length; i++) {
          var o = orbs[i];
          o.pulse += 0.05;
          o.vx += (Math.random() - 0.5) * 0.15;
          o.vy += (Math.random() - 0.5) * 0.15;
          var spd = Math.sqrt(o.vx * o.vx + o.vy * o.vy) || 1;
          if (spd > 4) {
            o.vx = (o.vx / spd) * 4;
            o.vy = (o.vy / spd) * 4;
          }
          o.x += o.vx;
          o.y += o.vy;
          if (o.x < 0 || o.x > w) o.vx *= -1;
          if (o.y < 0 || o.y > h) o.vy *= -1;
          drawOrb(o);
        }
      } else if (phase === "converge") {
        var t = (elapsed - WANDER_MS) / CONVERGE_MS;
        var pull = isGeneral
          ? 0.04 + easeOutCubic(t) * 0.34
          : 0.06 + easeOutCubic(t) * 0.22;
        var maxSp = isGeneral ? 10 : 8;
        for (var c = 0; c < orbs.length; c++) {
          var orb = orbs[c];
          orb.pulse += isGeneral ? 0.07 : 0.06;
          var dx = cx - orb.x;
          var dy = cy - orb.y;
          var dist = Math.sqrt(dx * dx + dy * dy) || 1;
          orb.vx += (dx / dist) * pull;
          orb.vy += (dy / dist) * pull;
          if (isGeneral && dist < Math.min(w, h) * 0.18) {
            orb.vx *= 0.92;
            orb.vy *= 0.92;
          }
          var sp = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy) || 1;
          if (sp > maxSp) {
            orb.vx = (orb.vx / sp) * maxSp;
            orb.vy = (orb.vy / sp) * maxSp;
          }
          orb.x += orb.vx;
          orb.y += orb.vy;
          if (isGeneral) {
            orb.r = orb.baseR * (1 + (1 - t) * 0.12);
          }
          drawOrb(orb);
        }
      } else if (phase === "merge") {
        var mt = (elapsed - WANDER_MS - CONVERGE_MS) / MERGE_MS;
        mergeFlash = isGeneral ? Math.min(1, easeOutCubic(mt) * 1.12) : Math.min(1, mt * 1.4);
        var snap = isGeneral ? 0.18 : 0.14;
        for (var m = 0; m < orbs.length; m++) {
          var ob = orbs[m];
          ob.x += (cx - ob.x) * snap;
          ob.y += (cy - ob.y) * snap;
          ob.r = ob.baseR * (1 - easeOutCubic(mt));
          ob.alpha = 1 - mt;
          if (ob.r > 1 && ob.alpha > 0.05) {
            drawOrb(ob);
          }
        }
        var flash = theme.flash;
        var flashR = (isGeneral ? 48 : 40) + mergeFlash * Math.min(w, h) * (isGeneral ? 0.42 : 0.35);
        var grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, flashR);
        grd.addColorStop(0, "rgba(" + flash.core + ", " + (mergeFlash * (isGeneral ? 0.92 : 0.85)) + ")");
        grd.addColorStop(0.35, "rgba(" + flash.mid + ", " + (mergeFlash * (isGeneral ? 0.62 : 0.55)) + ")");
        grd.addColorStop(0.7, "rgba(" + flash.outer + ", " + (mergeFlash * (isGeneral ? 0.26 : 0.2)) + ")");
        grd.addColorStop(1, "rgba(" + flash.outer + ", 0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(cx, cy, flashR, 0, Math.PI * 2);
        ctx.fill();
        if (isGeneral) {
          if (mt > 0.42) revealStagedTitle(overlay);
        } else if (mt > 0.96) {
          revealStagedTitle(overlay);
        }
      } else {
        revealStagedTitle(overlay);
      }

      overlay._wwsRaf = requestAnimationFrame(draw);
    }

    overlay._wwsStopCanvas = function () {
      runningAnim = false;
      if (overlay._wwsRaf) cancelAnimationFrame(overlay._wwsRaf);
    };

    overlay._wwsRaf = requestAnimationFrame(draw);
  }

  function startFreiraumPaintCanvas(overlay) {
    var canvas = overlay.querySelector(".welten-world-switch__canvas");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var PALETTE = [
      [255, 47, 146],
      [255, 111, 174],
      [255, 155, 55],
      [255, 216, 106],
      [0, 217, 196],
      [94, 196, 255],
      [155, 107, 255],
      [255, 180, 120],
    ];

    var w = 0;
    var h = 0;
    var cx = 0;
    var cy = 0;
    var runningAnim = true;
    var startTime = performance.now();
    var FT = getTimingForWorld("freiraum");
    var totalMs = FT.EFFECT_MS;
    var revealMs = FT.TITLE_REVEAL_AT;
    var brushes = [];
    var splatters = [];
    var paperDots = [];
    var titleRevealed = false;

    function pickColor(i) {
      return PALETTE[i % PALETTE.length];
    }

    function rgba(rgb, a) {
      return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + a + ")";
    }

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function easeInOutSine(t) {
      return 0.5 - Math.cos(Math.PI * t) / 2;
    }

    function easeOutExpo(t) {
      return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      cx = w * 0.5;
      cy = h * 0.46;
    }

    function quadPoint(x1, y1, qx, qy, x2, y2, t) {
      var u = 1 - t;
      return {
        x: u * u * x1 + 2 * u * t * qx + t * t * x2,
        y: u * u * y1 + 2 * u * t * qy + t * t * y2,
      };
    }

    function quadTangent(x1, y1, qx, qy, x2, y2, t) {
      var u = 1 - t;
      return {
        x: 2 * u * (qx - x1) + 2 * t * (x2 - qx),
        y: 2 * u * (qy - y1) + 2 * t * (y2 - qy),
      };
    }

    function spawnSplatter(x, y, color, strength) {
      var count = 2 + Math.floor(Math.random() * 4);
      var i;
      for (i = 0; i < count; i++) {
        splatters.push({
          x: x + (Math.random() - 0.5) * 28 * strength,
          y: y + (Math.random() - 0.5) * 22 * strength,
          rx: 4 + Math.random() * 16 * strength,
          ry: 3 + Math.random() * 10 * strength,
          rot: Math.random() * Math.PI,
          color: color,
          life: 1,
          born: performance.now() - startTime,
        });
      }
    }

    function initScene() {
      brushes = [];
      splatters = [];
      paperDots = [];

      var brushCount = w < 640 ? 7 : 11;
      var presets = [
        [-0.18, 0.12, 1.12, 0.88],
        [1.18, 0.08, -0.1, 0.92],
        [0.52, -0.22, 0.48, 1.14],
        [0.12, 1.16, 0.88, -0.08],
        [-0.08, 0.52, 1.08, 0.48],
        [1.06, 0.42, -0.12, 0.58],
        [0.22, -0.14, 0.78, 1.1],
        [-0.14, 0.82, 1.1, 0.18],
        [0.92, 1.08, 0.08, 0.22],
        [0.08, 0.28, 0.92, 0.72],
        [0.72, 0.92, 0.28, 0.08],
      ];

      var i;
      for (i = 0; i < brushCount; i++) {
        var p = presets[i % presets.length];
        var x1 = p[0] * w;
        var y1 = p[1] * h;
        var x2 = p[2] * w;
        var y2 = p[3] * h;
        brushes.push({
          x1: x1,
          y1: y1,
          cx: (x1 + x2) * 0.5 + (Math.random() - 0.5) * w * 0.18,
          cy: (y1 + y2) * 0.5 + (Math.random() - 0.5) * h * 0.16,
          x2: x2,
          y2: y2,
          color: pickColor(i),
          width: (w < 640 ? 118 : 168) + Math.random() * (w < 640 ? 88 : 148),
          delay: 40 + i * 145,
          dur: 680 + Math.random() * 360,
          pressure: 0.78 + Math.random() * 0.22,
          tilt: (Math.random() - 0.5) * 0.35,
          bristles: 4 + (i % 3),
        });
      }

      var dotCount = w < 640 ? 110 : 170;
      for (i = 0; i < dotCount; i++) {
        paperDots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.2 + Math.random() * 0.65,
          a: 0.018 + Math.random() * 0.04,
        });
      }
    }

    function drawPaperBase(dissolve, elapsed) {
      var warm = Math.min(0.14, elapsed / totalMs * 0.14);
      var grd = ctx.createLinearGradient(0, 0, w, h);
      grd.addColorStop(0, "rgba(14, 8, 22, " + (0.94 * dissolve) + ")");
      grd.addColorStop(0.45, "rgba(20, 10, 30, " + (0.92 * dissolve) + ")");
      grd.addColorStop(1, "rgba(10, 6, 18, " + (0.96 * dissolve) + ")");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      if (warm > 0.01) {
        var wash = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.55);
        wash.addColorStop(0, "rgba(255,155,55," + warm * dissolve + ")");
        wash.addColorStop(0.45, "rgba(255,47,146," + (warm * 0.55 * dissolve) + ")");
        wash.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = wash;
        ctx.fillRect(0, 0, w, h);
      }

      var i;
      for (i = 0; i < paperDots.length; i++) {
        var d = paperDots[i];
        ctx.fillStyle = "rgba(255,248,239," + d.a * dissolve + ")";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawSplatterField(dissolve, elapsed) {
      var i;
      for (i = splatters.length - 1; i >= 0; i--) {
        var s = splatters[i];
        var age = (elapsed - s.born) / 900;
        if (age > 1.2) {
          splatters.splice(i, 1);
          continue;
        }
        var alpha = (1 - age * 0.75) * 0.55 * dissolve;
        if (alpha <= 0.01) continue;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = rgba(s.color, alpha);
        ctx.beginPath();
        ctx.ellipse(0, 0, s.rx, s.ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    function drawBrushBand(b, elapsed, dissolve) {
      if (elapsed < b.delay) return;
      var t = Math.min(1, (elapsed - b.delay) / b.dur);
      var progress = easeOutExpo(t);
      if (progress <= 0.008) return;

      var stepCount = 88;
      var maxStep = Math.max(2, Math.floor(stepCount * progress));
      var pts = [];
      var s;
      for (s = 0; s <= maxStep; s++) {
        var u = (s / stepCount) * progress;
        pts.push(quadPoint(b.x1, b.y1, b.cx, b.cy, b.x2, b.y2, u));
      }
      if (pts.length < 2) return;

      var baseW = b.width * b.pressure;
      var tip = pts[pts.length - 1];

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.strokeStyle = rgba(b.color, 0.14 * dissolve);
      ctx.lineWidth = baseW * 1.85;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (s = 1; s < pts.length; s++) ctx.lineTo(pts[s].x, pts[s].y);
      ctx.stroke();

      ctx.strokeStyle = rgba(b.color, 0.32 * dissolve * b.pressure);
      ctx.lineWidth = baseW * 1.22;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (s = 1; s < pts.length; s++) ctx.lineTo(pts[s].x, pts[s].y);
      ctx.stroke();

      ctx.strokeStyle = rgba(b.color, 0.58 * dissolve * b.pressure);
      ctx.lineWidth = baseW * 0.72;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (s = 1; s < pts.length; s++) ctx.lineTo(pts[s].x, pts[s].y);
      ctx.stroke();
      ctx.restore();

      for (s = 0; s < pts.length; s++) {
        var u = (s / stepCount) * progress;
        var pt = pts[s];
        var tan = quadTangent(b.x1, b.y1, b.cx, b.cy, b.x2, b.y2, Math.min(0.999, u));
        var ang = Math.atan2(tan.y, tan.x) + b.tilt;
        var edgeFade = 0.55 + 0.45 * Math.sin(u * Math.PI);
        var alpha = 0.48 * dissolve * b.pressure * edgeFade;
        var brushW = baseW * (0.88 + 0.12 * edgeFade);
        var bristleN = b.bristles;
        var bi;

        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.translate(pt.x, pt.y);
        ctx.rotate(ang);
        for (bi = 0; bi < bristleN; bi++) {
          var off = (bi - (bristleN - 1) / 2) * brushW * 0.11;
          var grd = ctx.createRadialGradient(off, 0, 0, off, 0, brushW * 0.42);
          grd.addColorStop(0, rgba(b.color, alpha));
          grd.addColorStop(0.55, rgba(b.color, alpha * 0.72));
          grd.addColorStop(1, rgba(b.color, 0));
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.ellipse(off, 0, brushW * 0.38, brushW * 0.12, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        if (s % 4 === 0 && u > 0.04 && Math.random() > 0.55) {
          spawnSplatter(pt.x, pt.y, b.color, 0.7 + u * 0.5);
        }
      }

      if (progress > 0.08 && Math.random() > 0.72) {
        spawnSplatter(tip.x, tip.y, b.color, 1.1);
      }
    }

    function drawCenterBloom(elapsed, dissolve) {
      var start = totalMs * 0.62;
      if (elapsed < start) return;
      var t = Math.min(1, (elapsed - start) / (totalMs * 0.28));
      var p = easeInOutSine(t);
      if (p <= 0.01) return;

      var r = Math.min(w, h) * (0.08 + p * 0.38);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      var grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grd.addColorStop(0, "rgba(255,255,255," + (0.42 * p * dissolve) + ")");
      grd.addColorStop(0.18, "rgba(255,216,106," + (0.34 * p * dissolve) + ")");
      grd.addColorStop(0.42, "rgba(255,47,146," + (0.28 * p * dissolve) + ")");
      grd.addColorStop(0.68, "rgba(0,217,196," + (0.18 * p * dissolve) + ")");
      grd.addColorStop(1, "rgba(94,196,255,0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (p > 0.52 && !titleRevealed) {
        titleRevealed = true;
        revealStagedTitle(overlay);
      }
    }

    function drawColorWash(elapsed, dissolve) {
      var peak = Math.min(1, Math.max(0, (elapsed - 280) / 620));
      var fade = peak * (elapsed < revealMs + 200 ? 1 : Math.max(0, 1 - (elapsed - revealMs - 200) / 360));
      if (fade <= 0.01) return;
      ctx.globalCompositeOperation = "lighter";
      var grd = ctx.createLinearGradient(0, 0, w, h);
      grd.addColorStop(0, "rgba(255,47,146," + (0.1 * fade * dissolve) + ")");
      grd.addColorStop(0.28, "rgba(155,107,255," + (0.08 * fade * dissolve) + ")");
      grd.addColorStop(0.52, "rgba(0,217,196," + (0.07 * fade * dissolve) + ")");
      grd.addColorStop(0.76, "rgba(255,155,55," + (0.09 * fade * dissolve) + ")");
      grd.addColorStop(1, "rgba(94,196,255," + (0.06 * fade * dissolve) + ")");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
    }

    resize();
    initScene();

    function draw(now) {
      if (!runningAnim) return;
      var elapsed = now - startTime;
      var dissolve = elapsed < revealMs + 280 ? 1 : Math.max(0, 1 - (elapsed - revealMs - 280) / 380);

      drawPaperBase(dissolve, elapsed);

      var i;
      for (i = 0; i < brushes.length; i++) drawBrushBand(brushes[i], elapsed, dissolve);

      drawSplatterField(dissolve, elapsed);
      drawColorWash(elapsed, dissolve);
      drawCenterBloom(elapsed, dissolve);

      if (elapsed > totalMs + 80) {
        runningAnim = false;
        if (!titleRevealed) revealStagedTitle(overlay);
      } else {
        overlay._wwsRaf = requestAnimationFrame(draw);
      }
    }

    overlay._wwsStopCanvas = function () {
      runningAnim = false;
      if (overlay._wwsRaf) cancelAnimationFrame(overlay._wwsRaf);
    };

    overlay._wwsRaf = requestAnimationFrame(draw);
  }

  function startFreiraumBrushCanvas(overlay) {
    if (
      typeof window.__wwsFreiraumSprayPngStart === "function" &&
      document.body.getAttribute("data-freiraum-spray-test")
    ) {
      window.__wwsFreiraumSprayPngStart(overlay);
      return;
    }
    overlay._wwsRevealTitleFn = function () {
      revealStagedTitle(overlay);
    };
    if (typeof window.__wwsFreiraumBrushV3 === "function") {
      window.__wwsFreiraumBrushV3(overlay);
      return;
    }
    if (typeof window.__wwsFreiraumPaintV2 === "function") {
      window.__wwsFreiraumPaintV2(overlay);
      return;
    }
    startFreiraumPaintCanvas(overlay);
  }

  function startCanvas(overlay, worldKey) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (worldKey === "nexora") startNexoraMatrixCanvas(overlay);
    else if (worldKey === "general") startOrbCanvas(overlay, worldKey);
    else if (worldKey === "freiraum") startFreiraumBrushCanvas(overlay);
  }

  function stopCanvas(overlay) {
    if (overlay && typeof overlay._wwsStopCanvas === "function") {
      overlay._wwsStopCanvas();
    }
  }

  function getTransitionFailsafeMs(timing) {
    return (
      timing.COVER_MS +
      timing.EFFECT_MS +
      timing.TITLE_FADE_IN +
      timing.TITLE_HOLD +
      timing.TITLE_HOLD +
      timing.EXIT_MS +
      700
    );
  }

  function playSwitch(worldKey, targetIdx) {
    if (running) wwsAbortTransition();

    if (!wwsEffectsEnabled()) {
      var instant = window.switchToWorldIndex;
      if (typeof instant === "function") Promise.resolve(instant(targetIdx));
      return;
    }

    running = true;
    wwsClearTimers();

    var timing = getTimingForWorld(worldKey);
    applyTimingCssVars(worldKey);

    window.__wwsPreviewOwnsSound = true;
    playTransitionSound(worldKey);

    var overlay = buildOverlay(worldKey);
    activeOverlay = overlay;
    document.body.appendChild(overlay);
    document.documentElement.classList.add("welten-world-switch-lock");

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var coverMs = reduced ? 80 : timing.COVER_MS;
    var minShowMs = reduced
      ? 180
      : timing.EFFECT_MS + timing.TITLE_FADE_IN + timing.TITLE_HOLD;
    var postTitleHoldMs = reduced ? 0 : timing.TITLE_HOLD;
    var exitMs = reduced ? 60 : timing.EXIT_MS;
    var start = Date.now();

    activeRaf = requestAnimationFrame(function () {
      overlay.classList.add("is-entering");
      startCanvas(overlay, worldKey);
      if (reduced) {
        wwsLater(function () {
          revealStagedTitle(overlay);
        }, 200);
      } else if (!isCanvasDrivenWorld(worldKey)) {
        wwsLater(function () {
          revealStagedTitle(overlay);
        }, timing.TITLE_REVEAL_AT);
      } else if (worldKey === "nexora" || worldKey === "general" || worldKey === "freiraum") {
        /* Canvas-gesteuerte Titel-Enthüllung (NEXORA / MULTIVERSUM / FREIRAUM) */
      } else {
        wwsLater(function () {
          revealStagedTitle(overlay);
        }, timing.TITLE_REVEAL_AT + 180);
      }
      if (worldKey === "vertex" && !reduced) {
        wwsLater(function () {
          overlay.classList.add("wws--pro-white-bg");
        }, Math.round(timing.EFFECT_MS * 0.37));
        wwsLater(function () {
          overlay.classList.remove("wws--pro-white-bg");
          overlay.classList.add("wws--pro-black-bg", "wws--dark-text");
        }, Math.round(timing.EFFECT_MS * 0.76));
      }
    });

    function finishExit() {
      if (!activeOverlay || activeOverlay._wwsFinishing) return;
      activeOverlay._wwsFinishing = true;
      stopCanvas(activeOverlay);
      activeOverlay.classList.remove("is-entering");
      activeOverlay.classList.add("is-exiting");
      wwsLater(function () {
        if (activeOverlay) {
          activeOverlay.remove();
          activeOverlay = null;
        }
        document.documentElement.classList.remove("welten-world-switch-lock");
        running = false;
        window.__wwsPreviewOwnsSound = false;
        wwsClearTimers();
        if (typeof window.__wwsOnTransitionEnd === "function") {
          try {
            window.__wwsOnTransitionEnd();
          } catch (eEnd) {}
        }
      }, exitMs);
    }

    wwsLater(function () {
      var switchFn = window.switchToWorldIndex;
      var p =
        typeof switchFn === "function"
          ? Promise.resolve(switchFn(targetIdx))
          : Promise.resolve();

      p.then(function () {
        var wait = Math.max(0, minShowMs - (Date.now() - start));
        if (postTitleHoldMs > 0) {
          function scheduleExit() {
            var elapsed = Date.now() - start;
            var maxHold = getTransitionFailsafeMs(timing);
            if (!overlay._wwsTitleShownAt) {
              if (elapsed < maxHold) {
                wwsLater(scheduleExit, 50);
                return;
              }
              revealStagedTitle(overlay);
            }
            var sinceTitle = overlay._wwsTitleShownAt
              ? Date.now() - overlay._wwsTitleShownAt
              : 0;
            var extra = Math.max(0, postTitleHoldMs - sinceTitle);
            wwsLater(finishExit, Math.max(wait, extra));
          }
          scheduleExit();
        } else {
          wwsLater(finishExit, wait);
        }
      }).catch(function () {
        finishExit();
      });
    }, coverMs);

    wwsLater(function () {
      if (running && activeOverlay) finishExit();
    }, getTransitionFailsafeMs(timing));
  }

  function hookWorldBar() {
    var bar = document.querySelector(".world-bar");
    if (!bar || bar.dataset.wwsPreviewHooked === "1") return;
    bar.dataset.wwsPreviewHooked = "1";

    bar.addEventListener(
      "click",
      function (e) {
        if (e.target.closest("#sound-toggle") || e.target.closest("#mv4-fx")) return;
        var btn = e.target.closest("button[data-iframe]");
        if (!btn) return;

        var idx = parseInt(btn.getAttribute("data-iframe"), 10);
        if (!isFinite(idx) || idx === activeFrameIndex()) return;

        e.preventDefault();
        e.stopImmediatePropagation();

        var worldKey = btn.getAttribute("data-world-key");
        if (!worldKey) {
          worldKey = idx === 0 ? "nexora" : idx === 1 ? "vertex" : "freiraum";
        }

        playSwitch(worldKey, idx);
      },
      true
    );
  }

  function init() {
    applyTimingCssVars();
    hookSoundToggle();
    hookWorldBar();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.WeltenWorldSwitchPreview = {
    playTransitionSound: playTransitionSound,
    playSwitch: playSwitch,
    isSoundEnabled: wwsEffectsEnabled,
    isEffectsEnabled: wwsEffectsEnabled,
    timing: WWS_TIMING,
    getTimingForWorld: getTimingForWorld,
    abort: wwsAbortTransition,
  };
})();
