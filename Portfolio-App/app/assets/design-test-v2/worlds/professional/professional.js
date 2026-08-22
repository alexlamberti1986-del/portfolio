/**
 * PROFESSIONAL world — Design Test V2
 * Quiet editorial interactions; respects reduced-motion + effects off.
 */
(function () {
  "use strict";

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function initMobileNav() {
    var btn = qs("[data-pro-menu]");
    var panel = qs("[data-pro-mobile-nav]");
    if (!btn || !panel) return;
    btn.addEventListener("click", function () {
      var open = panel.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    qsa("a", panel).forEach(function (a) {
      a.addEventListener("click", function () {
        panel.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initSmoothAnchors() {
    qsa('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (!id || id === "#") return;
        var target = qs(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: document.documentElement.getAttribute("data-reduced-motion") === "1" ? "auto" : "smooth", block: "start" });
      });
    });
  }

  function initReveal() {
    var nodes = qsa(".pro-reveal");
    if (!nodes.length) return;
    if (document.documentElement.getAttribute("data-reduced-motion") === "1" || document.documentElement.getAttribute("data-effects") === "off") {
      nodes.forEach(function (n) {
        n.classList.add("is-in");
      });
      return;
    }
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (n) {
        n.classList.add("is-in");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  function syncActiveNav() {
    var sections = qsa("main section[id]");
    var links = qsa('.pro-nav a[href^="#"]');
    if (!sections.length || !links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (l) {
      map[l.getAttribute("href")] = l;
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = "#" + entry.target.id;
          links.forEach(function (l) {
            l.removeAttribute("aria-current");
          });
          if (map[id]) map[id].setAttribute("aria-current", "page");
        });
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      io.observe(s);
    });
  }

  function watchEffectsToggle() {
    var obs = new MutationObserver(function () {
      if (document.documentElement.getAttribute("data-effects") === "off") {
        qsa(".pro-reveal").forEach(function (n) {
          n.classList.add("is-in");
        });
      }
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-effects"] });
  }

  function refreshRevealInViewport() {
    var vh = window.innerHeight || document.documentElement.clientHeight || 0;
    qsa(".pro-reveal:not(.is-in)").forEach(function (n) {
      var r = n.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) n.classList.add("is-in");
    });
  }

  window.addEventListener("v2-world-visible", refreshRevealInViewport);

  function init() {
    initMobileNav();
    initSmoothAnchors();
    initReveal();
    syncActiveNav();
    watchEffectsToggle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
