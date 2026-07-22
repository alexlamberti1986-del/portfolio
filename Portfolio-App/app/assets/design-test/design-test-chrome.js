/**
 * Design-test chrome — template Header/Nav/CTA on the shell (preview only).
 * Live brand colors + live routing; Envato-like structure.
 */
(function (root) {
  "use strict";

  var CHAPTERS = [
    { key: "home", de: "Home", en: "Home" },
    { key: "leistungen", de: "Leistungen", en: "Services" },
    { key: "projects", de: "Projekte", en: "Portfolio" },
    { key: "about", de: "Über mich", en: "About" },
    { key: "contact", de: "Kontakt", en: "Contact" },
  ];

  function isDesignTest() {
    try {
      return root.document.documentElement.getAttribute("data-design-test") === "1";
    } catch (e) {
      return false;
    }
  }

  function worldIdx() {
    var active = root.document.querySelector(".mv4-frame.is-active");
    if (!active) return 0;
    var key = active.getAttribute("data-world") || "general";
    return { general: 0, nexora: 1, vertex: 2, freiraum: 3 }[key] || 0;
  }

  function buildPath(chapter) {
    try {
      if (root.WeltenShellRouter && root.WeltenShellRouter.buildPath) {
        return root.WeltenShellRouter.buildPath(worldIdx(), chapter, { designTest: true });
      }
    } catch (e) {}
    var bases = ["/design-test/multiversum", "/design-test/nexora", "/design-test/professional", "/design-test/freiraum"];
    var base = bases[worldIdx()] || bases[0];
    if (!chapter || chapter === "home") return base;
    var map = { projects: "projekte", leistungen: "leistungen", about: "ueber-mich", contact: "kontakt", offerte: "offerte" };
    return base + "/" + (map[chapter] || chapter);
  }

  function lang() {
    var a = root.document.querySelector(".mv4-flag.is-active");
    return (a && a.getAttribute("data-lang")) || "de";
  }

  function ensureChrome() {
    if (!isDesignTest()) return;
    root.document.documentElement.classList.add("dt-template-chrome");
    var inner = root.document.querySelector(".mv4-global-header__inner");
    if (!inner) return;

    if (!inner.querySelector(".dt-template-nav")) {
      var nav = root.document.createElement("nav");
      nav.className = "dt-template-nav";
      nav.setAttribute("aria-label", "Kapitel");
      CHAPTERS.forEach(function (c) {
        var a = root.document.createElement("a");
        a.className = "dt-template-nav__link";
        a.setAttribute("data-dt-chapter", c.key);
        a.href = buildPath(c.key);
        a.textContent = lang() === "en" ? c.en : c.de;
        nav.appendChild(a);
      });
      inner.appendChild(nav);
    }

    if (!inner.querySelector(".dt-template-cta")) {
      var cta = root.document.createElement("a");
      cta.className = "dt-template-cta";
      cta.setAttribute("data-dt-chapter", "offerte");
      cta.href = buildPath("offerte");
      cta.textContent = lang() === "en" ? "Get Started" : "Offerte";
      inner.appendChild(cta);
    }

    syncChrome();
  }

  function syncChrome() {
    if (!isDesignTest()) return;
    var path = (root.location.pathname || "").toLowerCase();
    var chapter = "home";
    if (/\/leistungen/.test(path)) chapter = "leistungen";
    else if (/\/projekte|\/projects/.test(path)) chapter = "projects";
    else if (/\/ueber-mich|\/about/.test(path)) chapter = "about";
    else if (/\/kontakt|\/contact/.test(path)) chapter = "contact";
    else if (/\/offerte|\/offer/.test(path)) chapter = "offerte";

    root.document.querySelectorAll(".dt-template-nav__link, .dt-template-cta").forEach(function (a) {
      var key = a.getAttribute("data-dt-chapter");
      a.classList.toggle("is-active", key === chapter);
      a.setAttribute("href", buildPath(key));
      if (a.classList.contains("dt-template-nav__link")) {
        var meta = CHAPTERS.find(function (c) { return c.key === key; });
        if (meta) a.textContent = lang() === "en" ? meta.en : meta.de;
      } else {
        a.textContent = lang() === "en" ? "Get Started" : "Offerte";
      }
    });

    var master =
      (root.document.body && root.document.body.getAttribute("data-master-world")) ||
      "general";
    root.document.documentElement.setAttribute("data-master-world", master);
  }

  function bind() {
    if (!isDesignTest()) return;
    ensureChrome();
    root.addEventListener("popstate", syncChrome);
    root.document.addEventListener("click", function (e) {
      var t = e.target && e.target.closest && e.target.closest("[data-dt-chapter]");
      if (!t) return;
      /* let shell router handle same-origin navigation if present */
      syncChrome();
    });
    var obs = new MutationObserver(function () {
      syncChrome();
    });
    try {
      obs.observe(root.document.body, { attributes: true, attributeFilter: ["data-master-world"] });
    } catch (e) {}
    root.setInterval(syncChrome, 1200);
  }

  root.WeltenDesignTestChrome = { ensureChrome: ensureChrome, syncChrome: syncChrome };

  if (root.document.readyState === "loading") {
    root.document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})(typeof window !== "undefined" ? window : this);
