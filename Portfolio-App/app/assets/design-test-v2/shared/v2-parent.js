/**
 * Parent-side listener for design-test-v2 iframe postMessages.
 * Forwards lang / music / effects to existing shell controls — no second audio.
 * Also plays the world intro animation + world music when arriving from the welcome page.
 */
(function (root) {
  "use strict";

  var WORLD_KEYS = ["general", "nexora", "vertex", "freiraum"];

  function isV2() {
    try {
      return (
        root.document.documentElement.getAttribute("data-design-test-v2") === "1" ||
        root.document.documentElement.getAttribute("data-world-default-v2") === "1"
      );
    } catch (e) {
      return false;
    }
  }

  function publicPrefix() {
    try {
      if (
        root.WeltenDesignTestV2Path &&
        typeof root.WeltenDesignTestV2Path.publicPrefix === "function"
      ) {
        return root.WeltenDesignTestV2Path.publicPrefix() || "";
      }
    } catch (e) {}
    return "";
  }

  function worldBases() {
    var p = publicPrefix();
    return [
      (p || "") + "/multiversum",
      (p || "") + "/nexora",
      (p || "") + "/professional",
      (p || "") + "/freiraum",
    ];
  }

  function hubHref() {
    try {
      if (root.WeltenDesignTestV2Path && typeof root.WeltenDesignTestV2Path.hubHref === "function") {
        return root.WeltenDesignTestV2Path.hubHref();
      }
    } catch (e) {}
    return "/";
  }

  function clickShell(sel) {
    var el = root.document.querySelector(sel);
    if (el) {
      el.click();
      return true;
    }
    return false;
  }

  function onMessage(ev) {
    if (!isV2()) return;
    var data = ev && ev.data;
    if (!data || data.source !== "design-test-v2") return;
    var type = data.type;
    var detail = data.detail || {};
    try {
      if (type === "lang") {
        var lang = String(detail.lang || "de").toLowerCase();
        if (["de", "en", "fr", "it"].indexOf(lang) < 0) lang = "de";
        var flag = root.document.querySelector('.mv4-flag[data-lang="' + lang + '"]');
        if (flag) flag.click();
      } else if (type === "music" || type === "effects") {
        clickShell("#mv4-fx");
      }
    } catch (e) {}
  }

  function patchWorldHrefs() {
    if (!isV2()) return;
    var bases = worldBases();
    root.document.querySelectorAll(".mv4-worlds [data-iframe]").forEach(function (a) {
      var i = parseInt(a.getAttribute("data-iframe"), 10);
      if (!isNaN(i) && bases[i]) a.setAttribute("href", bases[i]);
    });
    var brand = root.document.getElementById("mv4GlobalBrand");
    if (brand) {
      brand.setAttribute("href", hubHref());
      brand.removeAttribute("data-go-multiversum");
    }
    var welcome = root.document.querySelector("#designTestV2Banner a");
    if (welcome) {
      welcome.setAttribute("href", hubHref());
      welcome.textContent = "← Zurück zur Willkommensseite";
    }
  }

  /* ---------------------------------------------------------------------
     Entry from welcome page: intro animation + world background music
     --------------------------------------------------------------------- */

  function activeWorldKey() {
    try {
      return root.document.body.getAttribute("data-master-world") || "general";
    } catch (e) {
      return "general";
    }
  }

  function activeWorldIdx() {
    var i = WORLD_KEYS.indexOf(activeWorldKey());
    return i < 0 ? 0 : i;
  }

  function activeFrame() {
    var frames = root.document.querySelectorAll(".mv4-frame");
    var i;
    for (i = 0; i < frames.length; i++) {
      if (frames[i].classList.contains("is-active")) return frames[i];
    }
    return frames[activeWorldIdx()] || frames[0] || null;
  }

  function readEntryIntent() {
    var out = { enter: false, hash: "" };
    try {
      if (sessionStorage.getItem("v2-world-enter") === "1") {
        out.enter = true;
        out.hash = sessionStorage.getItem("v2-world-hash") || "";
      }
      sessionStorage.removeItem("v2-world-enter");
      sessionStorage.removeItem("v2-world-hash");
    } catch (e) {}
    if (!out.hash) {
      try {
        out.hash = root.location.hash || "";
      } catch (e2) {}
    }
    return out;
  }

  function bgmElement() {
    return root.document.getElementById("mvWorldBgm") || root.__mvWorldAudioEarly || null;
  }

  function bgmAudible() {
    var el = bgmElement();
    if (!el) return false;
    return !el.paused && !el.muted && el.volume > 0.05;
  }

  function requestWorldAudio(worldKey) {
    try {
      if (root.WeltenWorldAudioTest && typeof root.WeltenWorldAudioTest.play === "function") {
        root.WeltenWorldAudioTest.play(worldKey);
      }
    } catch (e) {}
  }

  /* Browsers block autoplay without a gesture in the new document — retry on the
     first interaction (also inside the same-origin world iframe). */
  function hookAudioGestureFallback(worldKey) {
    var settled = false;
    var listeners = [];
    var hookedWindows = [];

    function unhook() {
      listeners.forEach(function (item) {
        try {
          item.target.removeEventListener(item.type, item.fn, item.opts);
        } catch (e) {}
      });
      listeners = [];
    }

    function add(target, type, fn, opts) {
      try {
        target.addEventListener(type, fn, opts);
        listeners.push({ target: target, type: type, fn: fn, opts: opts });
      } catch (e) {}
    }

    function onGesture() {
      if (settled) return;
      if (bgmAudible()) {
        settled = true;
        unhook();
        return;
      }
      requestWorldAudio(worldKey);
      root.setTimeout(function () {
        if (bgmAudible()) {
          settled = true;
          unhook();
        }
      }, 500);
    }

    var opts = { capture: true, passive: true };
    ["pointerdown", "touchstart", "keydown", "wheel"].forEach(function (type) {
      add(root.document, type, onGesture, opts);
    });
    add(root, "scroll", onGesture, { passive: true });

    function hookFrame(frame) {
      if (!frame) return;
      var win;
      try {
        win = frame.contentWindow;
      } catch (e) {
        return;
      }
      if (!win || hookedWindows.indexOf(win) >= 0) return;
      hookedWindows.push(win);
      ["pointerdown", "touchstart", "keydown", "wheel", "scroll"].forEach(function (type) {
        add(win, type, onGesture, opts);
      });
      try {
        if (frame.contentDocument) {
          ["pointerdown", "touchstart", "keydown", "wheel"].forEach(function (type) {
            add(frame.contentDocument, type, onGesture, opts);
          });
        }
      } catch (e2) {}
    }

    var frame = activeFrame();
    hookFrame(frame);
    if (frame) frame.addEventListener("load", function () { hookFrame(frame); });

    var tries = 0;
    var poll = root.setInterval(function () {
      tries += 1;
      if (settled || tries > 40) {
        root.clearInterval(poll);
        if (settled) unhook();
        return;
      }
      hookFrame(activeFrame());
    }, 250);
  }

  function playEntryAnimation(worldKey, idx, onDone) {
    var finished = false;
    var attempts = 0;

    function finish() {
      if (finished) return;
      finished = true;
      try {
        root.__v2WelcomeEntryActive = false;
      } catch (eFlag) {}
      try {
        root.document.documentElement.classList.remove("welten-world-switch-lock");
      } catch (e) {}
      if (onDone) onDone();
    }

    function tryPlay() {
      attempts += 1;
      var preview = root.WeltenWorldSwitchPreview;
      if (!preview || typeof preview.playSwitch !== "function") {
        if (attempts < 60) {
          root.setTimeout(tryPlay, 50);
          return;
        }
        finish();
        return;
      }

      /* Cover immediately so the destination world never flashes under the intro. */
      try {
        root.__v2WelcomeEntryActive = true;
        root.document.documentElement.classList.add("welten-world-switch-lock");
      } catch (eLock) {}

      root.__wwsOnTransitionEnd = function () {
        root.__wwsOnTransitionEnd = null;
        finish();
      };

      /* Zielwelt vorwärmen, dann volle Switch-Animation wie zwischen Welten */
      var warm =
        typeof root.preloadWorldIndex === "function"
          ? root.preloadWorldIndex(idx)
          : Promise.resolve();
      Promise.resolve(warm)
        .catch(function () {})
        .then(function () {
          try {
            preview.playSwitch(worldKey, idx);
          } catch (e) {
            finish();
          }
        });

      root.setTimeout(finish, 10000);
    }

    tryPlay();
  }

  /* The shell applies its own "home" chapter shortly after boot and scrolls the
     world back to the top — so the target has to be re-applied for a moment. */
  function scrollFrameToHash(hash) {
    if (!hash || hash.length < 2) return;
    var id = hash.charAt(0) === "#" ? hash.slice(1) : hash;
    var tries = 0;
    var hits = 0;

    function attempt() {
      tries += 1;
      try {
        var frame = activeFrame();
        var doc = frame && frame.contentDocument;
        var el = doc && doc.getElementById(id);
        if (el) {
          var win = doc.defaultView;
          var y = (win && win.scrollY) || doc.documentElement.scrollTop || 0;
          if (!hits || y < 40) {
            hits += 1;
            el.scrollIntoView({ behavior: hits > 1 ? "smooth" : "auto", block: "start" });
          }
        }
      } catch (e) {}
      if (tries < 14) root.setTimeout(attempt, 350);
    }

    attempt();
  }

  function runEntry() {
    if (!isV2()) return;
    var intent = readEntryIntent();
    if (!intent.enter && !intent.hash) return;

    var worldKey = activeWorldKey();
    var idx = activeWorldIdx();

    function afterAnimation() {
      try {
        root.__v2WelcomeEntryActive = false;
      } catch (eClear) {}
      requestWorldAudio(worldKey);
      hookAudioGestureFallback(worldKey);
      if (intent.hash) root.setTimeout(function () { scrollFrameToHash(intent.hash); }, 250);
    }

    if (intent.enter) {
      try {
        root.__v2WelcomeEntryActive = true;
        root.document.documentElement.classList.add("welten-world-switch-lock");
      } catch (eEarly) {}
      /* Kurz warten bis Master + Preview-Modul stehen, dann volle Animation */
      root.setTimeout(function () {
        playEntryAnimation(worldKey, idx, afterAnimation);
      }, 180);
    } else {
      afterAnimation();
    }
  }

  function bind() {
    root.addEventListener("message", onMessage);
    patchWorldHrefs();
    root.addEventListener("popstate", patchWorldHrefs);
    root.setTimeout(patchWorldHrefs, 200);
    root.setTimeout(patchWorldHrefs, 800);
    root.setTimeout(runEntry, 80);
  }

  root.WeltenDesignTestV2Parent = { patchWorldHrefs: patchWorldHrefs };

  if (root.document.readyState === "loading") {
    root.document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})(typeof window !== "undefined" ? window : this);
