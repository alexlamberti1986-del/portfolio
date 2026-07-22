/**
 * Injects per-world design-test styles into world iframes (preview/local only).
 * Keeps LIVE world HTML content; only skins visuals + kit hero posters.
 */
(function (root) {
  "use strict";

  var VER = "20260722kit2";
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
      if (!doc.getElementById(sharedId)) {
        var shared = doc.createElement("link");
        shared.id = sharedId;
        shared.rel = "stylesheet";
        shared.href = "/assets/design-test/design-test-shared.css?v=" + VER;
        (doc.head || doc.documentElement).appendChild(shared);
      }

      ensureKitHero(doc);
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
})(typeof window !== "undefined" ? window : this);
