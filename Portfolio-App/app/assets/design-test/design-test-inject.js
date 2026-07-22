/**
 * Injects per-world design-test styles + template structure hints into world iframes.
 * LIVE colors/content/images; Envato structure (preview only).
 */
(function (root) {
  "use strict";

  var VER = "20260722struct1";
  var FONT_HREF =
    "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Marcellus&display=swap";
  var WORLD_CSS = {
    general: "/assets/design-test/world-multiversum.css?v=" + VER,
    nexora: "/assets/design-test/world-nexora.css?v=" + VER,
    vertex: "/assets/design-test/world-professional.css?v=" + VER,
    freiraum: "/assets/design-test/world-freiraum.css?v=" + VER,
  };

  function isDesignTest() {
    try {
      return root.document.documentElement.getAttribute("data-design-test") === "1";
    } catch (e) {
      return false;
    }
  }

  function worldCssForFrame(frame) {
    var key = frame && frame.getAttribute("data-world");
    return WORLD_CSS[key] || WORLD_CSS.general;
  }

  function ensureKitHero(doc) {
    try {
      var home = doc.getElementById("slide-home");
      if (!home) return;
      home.classList.add("dt-kit-hero");
    } catch (e) {}
  }

  function ensureFonts(doc) {
    try {
      var id = "welten-design-test-fonts";
      if (doc.getElementById(id)) return;
      var link = doc.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = FONT_HREF;
      (doc.head || doc.documentElement).appendChild(link);
    } catch (e) {}
  }

  function structureBody(doc) {
    try {
      var body = doc.body;
      if (!body) return;
      body.classList.add("dt-template-body");
      ["slide-home", "slide-leistungen", "slide-projects", "slide-about", "slide-contact", "slide-offerte"].forEach(function (id) {
        var el = doc.getElementById(id);
        if (el) el.classList.add("dt-template-section");
      });
      var grids = doc.querySelectorAll(
        "#slide-leistungen .card-grid, #slide-projects .card-grid, #slide-leistungen .skills-grid, #slide-projects .projects-grid"
      );
      grids.forEach(function (g) {
        g.classList.add("dt-template-grid");
      });
      var footer = doc.querySelector(".welten-site-footer");
      if (footer) footer.classList.add("dt-template-footer");
    } catch (e) {}
  }

  function injectIntoFrame(frame) {
    if (!isDesignTest() || !frame) return;
    try {
      var doc = frame.contentDocument;
      if (!doc || !doc.documentElement) return;
      doc.documentElement.setAttribute("data-design-test", "1");
      doc.documentElement.setAttribute(
        "data-design-test-world",
        frame.getAttribute("data-world") || "general"
      );
      ensureFonts(doc);
      var href = worldCssForFrame(frame);
      var id = "welten-design-test-world-css";
      var link = doc.getElementById(id);
      if (!link) {
        link = doc.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        (doc.head || doc.documentElement).appendChild(link);
      }
      if (link.getAttribute("href") !== href) link.setAttribute("href", href);

      var sharedId = "welten-design-test-shared-css";
      var sharedHref = "/assets/design-test/design-test-shared.css?v=" + VER;
      var shared = doc.getElementById(sharedId);
      if (!shared) {
        shared = doc.createElement("link");
        shared.id = sharedId;
        shared.rel = "stylesheet";
        (doc.head || doc.documentElement).appendChild(shared);
      }
      if (shared.getAttribute("href") !== sharedHref) shared.setAttribute("href", sharedHref);

      ensureKitHero(doc);
      structureBody(doc);
    } catch (e) {}
  }

  function bindShell() {
    if (!isDesignTest()) return;
    root.document.querySelectorAll(".mv4-frame").forEach(function (frame) {
      injectIntoFrame(frame);
      if (!frame.__dtInjectBound) {
        frame.__dtInjectBound = true;
        frame.addEventListener("load", function () {
          injectIntoFrame(frame);
        });
      }
    });
  }

  root.WeltenDesignTestInject = {
    injectIntoFrame: injectIntoFrame,
    bindShell: bindShell,
    isDesignTest: isDesignTest,
  };

  if (root.document.readyState === "loading") {
    root.document.addEventListener("DOMContentLoaded", bindShell);
  } else {
    bindShell();
  }
  root.setInterval(bindShell, 2000);
})(typeof window !== "undefined" ? window : this);
