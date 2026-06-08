/**
 * Welten Runtime Performance — Animation-Governor + Throttle
 * Pausiert Canvas/RAF in versteckten/inaktiven Welten, spart CPU/GPU auf Mobile.
 */
(function (global) {
  "use strict";

  var origRaf = global.requestAnimationFrame;
  var origCaf = global.cancelAnimationFrame;
  var pausedCallbacks = new Set();
  var patched = false;
  var fakeRafId = 1;

  function shouldPauseAnimations() {
    var body = document.body;
    return (
      !!global.__portfolioWorldPaused ||
      !!global.__weltenAnimPaused ||
      document.hidden ||
      document.documentElement.classList.contains("welten-page-hidden") ||
      (body && body.classList.contains("is-subpage"))
    );
  }

  function patchAnimationFrame() {
    if (patched || !origRaf) return;
    patched = true;

    global.requestAnimationFrame = function (cb) {
      if (typeof cb !== "function") return 0;
      if (shouldPauseAnimations()) {
        pausedCallbacks.add(cb);
        return fakeRafId++;
      }
      return origRaf.call(global, function (ts) {
        if (shouldPauseAnimations()) {
          pausedCallbacks.add(cb);
          return;
        }
        pausedCallbacks.delete(cb);
        cb(ts);
      });
    };

    if (origCaf) {
      global.cancelAnimationFrame = function (id) {
        return origCaf.call(global, id);
      };
    }
  }

  function resumeAnimations() {
    global.__portfolioWorldPaused = false;
    global.__weltenAnimPaused = false;
    document.documentElement.classList.remove("welten-world-paused");
    var pending = Array.from(pausedCallbacks);
    pausedCallbacks.clear();
    pending.forEach(function (cb) {
      origRaf.call(global, cb);
    });
    document.querySelectorAll("canvas").forEach(function (c) {
      c.style.visibility = "";
      c.style.pointerEvents = "";
    });
    global.dispatchEvent(new Event("resize"));
  }

  function pauseAnimations() {
    global.__weltenAnimPaused = true;
    document.documentElement.classList.add("welten-world-paused");
    document.querySelectorAll("canvas").forEach(function (c) {
      c.style.visibility = "hidden";
      c.style.pointerEvents = "none";
    });
  }

  /** Throttle — max 1× pro Frame */
  function rafThrottle(fn) {
    var scheduled = false;
    var lastArgs;
    return function () {
      lastArgs = arguments;
      if (scheduled) return;
      scheduled = true;
      origRaf.call(global, function () {
        scheduled = false;
        fn.apply(null, lastArgs);
      });
    };
  }

  function debounce(fn, ms) {
    var t;
    return function () {
      var args = arguments;
      var self = this;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(self, args);
      }, ms);
    };
  }

  function onVisibilityChange() {
    var hidden = document.hidden;
    document.documentElement.classList.toggle("welten-page-hidden", hidden);
    if (hidden) {
      pauseAnimations();
    } else {
      resumeAnimations();
    }
  }

  patchAnimationFrame();
  document.addEventListener("visibilitychange", onVisibilityChange);
  onVisibilityChange();

  global.addEventListener("message", function (e) {
    if (!e.data) return;
    if (e.data.type === "portfolio-world-pause") {
      global.__portfolioWorldPaused = !!e.data.paused;
      document.documentElement.classList.toggle("welten-world-paused", global.__portfolioWorldPaused);
      if (global.__portfolioWorldPaused) pauseAnimations();
      else resumeAnimations();
    }
    if (e.data.type === "portfolio-world-enter" || e.data.type === "portfolio-cleanup-transition") {
      resumeAnimations();
    }
  });

  global.WeltenRuntimePerf = {
    shouldPauseAnimations: shouldPauseAnimations,
    resumeAnimations: resumeAnimations,
    pauseAnimations: pauseAnimations,
    rafThrottle: rafThrottle,
    debounce: debounce,
  };
})(window);
