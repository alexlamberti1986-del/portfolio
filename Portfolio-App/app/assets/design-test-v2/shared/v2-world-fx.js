/**
 * Shared core for the per-world effect layers (worlds/<world>/<world>-fx.js).
 * Handles gating (reduced motion, effects toggle, hidden world), reveals,
 * text splitting and one shared requestAnimationFrame loop.
 * All effect CSS must be scoped to html.wfx-on so that content stays fully
 * visible whenever effects are off.
 */
(function (root) {
  "use strict";
  if (root.V2WorldFx) return;

  var doc = root.document;
  var html = doc.documentElement;
  var mqReduce = root.matchMedia ? root.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  var finePointer = !!(root.matchMedia && root.matchMedia("(hover: hover) and (pointer: fine)").matches);
  var extraOff = [];
  var toggles = [];
  var loops = [];
  var rafId = 0;
  var on = false;

  var pointer = { x: -9999, y: -9999, inside: false };
  root.addEventListener(
    "pointermove",
    function (e) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.inside = true;
    },
    { passive: true }
  );
  /* relatedTarget is null when the pointer leaves the window or enters an iframe */
  root.addEventListener("mouseout", function (e) {
    if (!e.relatedTarget) pointer.inside = false;
  });

  function computeActive() {
    var b = doc.body;
    if (mqReduce.matches) return false;
    if (html.getAttribute("data-effects") === "off") return false;
    if (html.getAttribute("data-reduced-motion") === "1") return false;
    if (b && (b.classList.contains("mv-effects-off") || b.getAttribute("data-v2-effects") === "off")) return false;
    for (var i = 0; i < extraOff.length; i++) if (extraOff[i]()) return false;
    return true;
  }

  function tick(t) {
    rafId = 0;
    if (!on || doc.hidden) return;
    for (var i = 0; i < loops.length; i++) {
      try {
        loops[i](t);
      } catch (e) {}
    }
    rafId = root.requestAnimationFrame(tick);
  }

  function startLoop() {
    if (!rafId && on && loops.length && !doc.hidden) rafId = root.requestAnimationFrame(tick);
  }

  function sync() {
    var next = computeActive();
    if (next === on) return;
    on = next;
    html.classList.toggle("wfx-on", on);
    toggles.forEach(function (cb) {
      try {
        cb(on);
      } catch (e) {}
    });
    if (on) startLoop();
  }

  function css(id, text) {
    if (doc.getElementById(id)) return;
    var s = doc.createElement("style");
    s.id = id;
    s.textContent = text;
    doc.head.appendChild(s);
  }

  function all(sel, scope) {
    return Array.prototype.slice.call((scope || doc).querySelectorAll(sel));
  }

  var io = null;
  var ioTargets = [];
  function markIn(el) {
    el.classList.add("wfx-in");
    var cb = el.__wfxOnIn;
    if (cb) {
      el.__wfxOnIn = null;
      try {
        cb(el);
      } catch (e) {}
    }
  }
  function ensureIo() {
    if (io || !("IntersectionObserver" in root)) return;
    io = new root.IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          (e.target.__wfxWatchers || []).forEach(markIn);
          e.target.__wfxWatchers = null;
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );
  }

  /**
   * Mark element for reveal; adds .wfx-in when it enters the viewport.
   * Pass `watch` for elements that start fully clipped (clip-path): the
   * observer reports a clipped-away target as never intersecting.
   */
  function reveal(el, onIn, watch) {
    if (!el || el.__wfxReveal) return;
    el.__wfxReveal = true;
    el.classList.add("wfx-r");
    if (onIn) el.__wfxOnIn = onIn;
    ensureIo();
    if (!io) {
      markIn(el);
      return;
    }
    var w = watch || el;
    el.__wfxWatch = w;
    ioTargets.push(el);
    if (!w.__wfxWatchers) {
      w.__wfxWatchers = [];
      io.observe(w);
    }
    w.__wfxWatchers.push(el);
  }

  function refreshInViewport() {
    var vh = root.innerHeight || html.clientHeight || 0;
    ioTargets.forEach(function (el) {
      if (el.classList.contains("wfx-in")) return;
      var r = (el.__wfxWatch || el).getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) markIn(el);
    });
  }

  /** Wrap words in spans: .wfx-w > .wfx-wi (index in --i). */
  function splitWords(el) {
    if (!el || el.__wfxSplit) return [];
    el.__wfxSplit = true;
    var out = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = doc.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(doc.createTextNode(part));
              return;
            }
            var w = doc.createElement("span");
            w.className = "wfx-w";
            var inner = doc.createElement("span");
            inner.className = "wfx-wi";
            inner.textContent = part;
            inner.style.setProperty("--i", out.length);
            w.appendChild(inner);
            frag.appendChild(w);
            out.push(inner);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== "BR") {
          walk(n);
        }
      });
    })(el);
    el.classList.add("wfx-split");
    return out;
  }

  /** Wrap characters (grouped per word so words never break apart). */
  function splitChars(el) {
    if (!el || el.__wfxSplit) return [];
    el.__wfxSplit = true;
    /* A fixed aria-label would keep German text after a language switch */
    var translated = el.hasAttribute("data-i18n-v2") || el.hasAttribute("data-i18n-v2-html");
    var label = (el.textContent || "").replace(/\s+/g, " ").trim();
    if (!translated && label && !el.hasAttribute("aria-label")) el.setAttribute("aria-label", label);
    var out = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = doc.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(doc.createTextNode(part));
              return;
            }
            var w = doc.createElement("span");
            w.className = "wfx-cw";
            if (!translated) w.setAttribute("aria-hidden", "true");
            Array.prototype.forEach.call(part, function (ch) {
              var c = doc.createElement("span");
              c.className = "wfx-c";
              c.textContent = ch;
              c.style.setProperty("--i", out.length);
              w.appendChild(c);
              out.push(c);
            });
            frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== "BR") {
          walk(n);
        }
      });
    })(el);
    el.classList.add("wfx-split");
    return out;
  }

  function observeGates() {
    if (!root.MutationObserver) return;
    var mo = new root.MutationObserver(sync);
    mo.observe(html, { attributes: true, attributeFilter: ["data-effects", "data-reduced-motion"] });
    if (doc.body) mo.observe(doc.body, { attributes: true, attributeFilter: ["class", "data-v2-effects"] });
  }

  function boot() {
    css(
      "wfx-core",
      [
        ".wfx-w{display:inline-block;overflow:hidden;vertical-align:top;padding:0 .02em .12em;margin:0 -.02em -.12em}",
        ".wfx-wi,.wfx-c{display:inline-block}",
        ".wfx-cw{display:inline-block;white-space:nowrap}",
        ".wfx-deco{pointer-events:none}",
        "html:not(.wfx-on) .wfx-deco{display:none!important}",
      ].join("\n")
    );
    observeGates();
    if (mqReduce.addEventListener) mqReduce.addEventListener("change", sync);
    doc.addEventListener("visibilitychange", startLoop);
    root.addEventListener("v2-world-visible", function () {
      refreshInViewport();
      startLoop();
    });
    sync();
  }

  root.V2WorldFx = {
    finePointer: finePointer,
    pointer: pointer,
    isOn: function () {
      return on;
    },
    addOffCondition: function (fn) {
      extraOff.push(fn);
      sync();
    },
    onToggle: function (cb) {
      toggles.push(cb);
      cb(on);
    },
    loop: function (fn) {
      loops.push(fn);
      startLoop();
    },
    css: css,
    all: all,
    reveal: reveal,
    refresh: refreshInViewport,
    splitWords: splitWords,
    splitChars: splitChars,
    clamp: function (v, a, b) {
      return Math.min(b, Math.max(a, v));
    },
  };

  if (doc.body) boot();
  else doc.addEventListener("DOMContentLoaded", boot, { once: true });
})(window);
