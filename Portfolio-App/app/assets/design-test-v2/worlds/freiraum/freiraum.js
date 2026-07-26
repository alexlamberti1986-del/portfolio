/**
 * FREIRAUM Design Test V2 — world interactions
 * Mobile menu, reveal-on-scroll, reduced-motion + data-effects=off,
 * sticky header, soft blob parallax.
 * Lang / music / effects / year: owned by v2-bridge (do not re-bind).
 */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var body = doc.body;

  function qs(sel, el) {
    return (el || doc).querySelector(sel);
  }
  function qsa(sel, el) {
    return Array.prototype.slice.call((el || doc).querySelectorAll(sel));
  }

  function reduced() {
    return (
      root.getAttribute("data-reduced-motion") === "1" ||
      root.getAttribute("data-effects") === "off" ||
      body.getAttribute("data-v2-effects") === "off" ||
      (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    );
  }

  function syncEffectsUi() {
    var on = root.getAttribute("data-effects") !== "off";
    body.setAttribute("data-v2-effects", on ? "on" : "off");
    var btn = qs('[data-v2-effects="toggle"]');
    if (btn) btn.setAttribute("aria-pressed", on ? "true" : "false");
    if (!on) revealAll();
  }

  /* —— Mobile menu —— */
  function bindMenu() {
    var btn = qs('[data-v2-menu="toggle"]');
    var panel = qs("[data-v2-mobile]");
    if (!btn || !panel) return;

    function close() {
      btn.setAttribute("aria-expanded", "false");
      panel.hidden = true;
      body.classList.remove("fr-menu-open");
    }
    function open() {
      btn.setAttribute("aria-expanded", "true");
      panel.hidden = false;
      body.classList.add("fr-menu-open");
    }

    btn.addEventListener("click", function () {
      if (panel.hidden) open();
      else close();
    });

    qsa("a", panel).forEach(function (a) {
      a.addEventListener("click", close);
    });

    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* —— Smooth anchor + active nav —— */
  function bindAnchors() {
    qsa("[data-v2-anchor]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("data-v2-anchor") || (a.getAttribute("href") || "").replace("#", "");
        var target = id && doc.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
        try {
          history.replaceState(null, "", "#" + id);
        } catch (err) {}
      });
    });

    var sections = qsa("[data-v2-section]");
    var navLinks = qsa(".fr-nav [data-v2-anchor]");
    if (!sections.length || !("IntersectionObserver" in window)) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.getAttribute("data-v2-section");
          navLinks.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("data-v2-anchor") === id);
          });
        });
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: 0.01 }
    );
    sections.forEach(function (s) {
      io.observe(s);
    });
  }

  /* —— Scroll reveals —— */
  function revealAll() {
    qsa("[data-v2-reveal]").forEach(function (n) {
      n.classList.add("is-in");
    });
  }

  function bindReveals() {
    var nodes = qsa("[data-v2-reveal]");
    if (!nodes.length) return;
    if (reduced() || !("IntersectionObserver" in window)) {
      revealAll();
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  function watchEffects() {
    syncEffectsUi();
    if (!window.MutationObserver) return;
    var obs = new MutationObserver(function () {
      syncEffectsUi();
      if (reduced()) revealAll();
    });
    obs.observe(root, {
      attributes: true,
      attributeFilter: ["data-effects", "data-reduced-motion"],
    });
  }

  /* —— Header shrink on scroll —— */
  function bindHeaderScroll() {
    var header = qs("[data-v2-header]");
    if (!header) return;
    var ticking = false;
    function update() {
      ticking = false;
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    }
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );
    update();
  }

  /* —— Soft parallax on hero blobs (effects on only) —— */
  function bindParallax() {
    var blobs = qsa(".fr-hero__blob");
    if (!blobs.length) return;
    window.addEventListener(
      "pointermove",
      function (e) {
        if (reduced()) return;
        var x = (e.clientX / window.innerWidth - 0.5) * 16;
        var y = (e.clientY / window.innerHeight - 0.5) * 12;
        blobs.forEach(function (b, i) {
          var f = i === 0 ? 1 : -0.7;
          b.style.transform = "translate(" + x * f + "px," + y * f + "px)";
        });
      },
      { passive: true }
    );
  }

  function boot() {
    bindMenu();
    bindAnchors();
    bindReveals();
    bindHeaderScroll();
    bindParallax();
    watchEffects();
    body.setAttribute("data-v2-ready", "1");
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
