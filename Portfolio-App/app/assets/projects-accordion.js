/**
 * Projekte-Accordion — eine Kategorie offen, Lazy-Load für Vorschau-Iframes
 */
(function () {
  "use strict";

  function loadPanelPreviews(panel) {
    if (!panel || panel.dataset.previewsLoaded === "1") return;
    panel.dataset.previewsLoaded = "1";
    panel.querySelectorAll("iframe[data-lazy-src]").forEach(function (frame) {
      var src = frame.getAttribute("data-lazy-src");
      if (!src || frame.getAttribute("src")) return;
      frame.setAttribute("src", src);
      frame.removeAttribute("data-lazy-src");
    });
  }

  function initAccordion(root) {
    var items = Array.from(root.querySelectorAll(".projects-accordion__item"));
    if (!items.length) return;

    items.forEach(function (item) {
      var trigger = item.querySelector(".projects-accordion__trigger");
      var panel = item.querySelector(".projects-accordion__panel");
      if (!trigger || !panel) return;

      trigger.addEventListener("click", function () {
        var wasOpen = item.classList.contains("is-open");
        items.forEach(function (other) {
          other.classList.remove("is-open");
          var t = other.querySelector(".projects-accordion__trigger");
          var p = other.querySelector(".projects-accordion__panel");
          if (t) t.setAttribute("aria-expanded", "false");
          if (p) p.setAttribute("hidden", "");
        });
        if (!wasOpen) {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
          panel.removeAttribute("hidden");
          loadPanelPreviews(panel);
        }
      });
    });

    var open = items.find(function (i) {
      return i.classList.contains("is-open");
    });
    if (open) {
      var openPanel = open.querySelector(".projects-accordion__panel");
      if (openPanel) openPanel.removeAttribute("hidden");
      loadPanelPreviews(openPanel);
    }
  }

  function boot() {
    document.querySelectorAll("[data-projects-accordion]").forEach(initAccordion);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
