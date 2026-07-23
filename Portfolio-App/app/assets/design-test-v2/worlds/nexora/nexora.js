/**
 * NEXORA world — Design Test V2
 * Mobile drawer, case filters, reveal-on-scroll, HUD scroll state.
 * Respects prefers-reduced-motion + html[data-effects=off].
 * Year: [data-nx-year] locally; [data-v2-year] also via v2-bridge.
 */
(function () {
  "use strict";

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function reduced() {
    return (
      document.documentElement.getAttribute("data-reduced-motion") === "1" ||
      document.documentElement.getAttribute("data-effects") === "off" ||
      (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    );
  }

  function initYear() {
    var y = String(new Date().getFullYear());
    qsa("[data-nx-year]").forEach(function (el) {
      el.textContent = y;
    });
  }

  function initDrawer() {
    var btn = qs("[data-nx-menu]");
    var drawer = qs("#nx-drawer");
    if (!btn || !drawer) return;

    function setOpen(open) {
      if (open) {
        drawer.hidden = false;
        drawer.classList.add("is-open");
      } else {
        drawer.classList.remove("is-open");
        drawer.hidden = true;
      }
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Menü schliessen" : "Menü öffnen");
      document.body.classList.toggle("nx-drawer-open", open);
    }

    btn.addEventListener("click", function () {
      setOpen(drawer.hidden || !drawer.classList.contains("is-open"));
    });

    qsa("a", drawer).forEach(function (a) {
      a.addEventListener("click", function () {
        setOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  function initFilters() {
    var root = qs("[data-nx-filters]");
    var cases = qs("[data-nx-cases]");
    if (!root || !cases) return;

    var tabs = qsa("[data-filter]", root);
    var items = qsa(".nx-case", cases);

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var filter = tab.getAttribute("data-filter") || "all";
        tabs.forEach(function (t) {
          t.setAttribute("aria-selected", t === tab ? "true" : "false");
        });
        items.forEach(function (item) {
          var cat = item.getAttribute("data-cat") || "";
          var show = filter === "all" || cat === filter;
          item.hidden = !show;
          item.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  function revealAll() {
    qsa("[data-reveal]").forEach(function (n) {
      n.classList.add("is-in");
    });
  }

  function initReveal() {
    var nodes = qsa("[data-reveal]");
    if (!nodes.length) return;

    if (reduced()) {
      revealAll();
      return;
    }

    if (!("IntersectionObserver" in window)) {
      revealAll();
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );

    nodes.forEach(function (n) {
      io.observe(n);
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
        target.scrollIntoView({
          behavior: reduced() ? "auto" : "smooth",
          block: "start",
        });
      });
    });
  }

  function watchEffects() {
    if (!window.MutationObserver) return;
    var obs = new MutationObserver(function () {
      if (reduced()) revealAll();
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-effects", "data-reduced-motion"],
    });
  }

  function initHudScroll() {
    var hud = qs(".nx-hud");
    if (!hud) return;
    var onScroll = function () {
      hud.classList.toggle("is-scrolled", window.scrollY > 16);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function init() {
    initYear();
    initDrawer();
    initFilters();
    initReveal();
    initSmoothAnchors();
    watchEffects();
    initHudScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
