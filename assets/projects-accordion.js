/**
 * Projekte-Accordion — eine Kategorie offen, Lazy-Load für Vorschau-Iframes
 */
(function () {
  "use strict";

  function screenshotUrl(pageUrl) {
    return (
      "https://s0.wp.com/mshots/v1/" +
      encodeURIComponent(pageUrl) +
      "?w=900"
    );
  }

  function ensureLivePreviewFallback(wrap) {
    if (!wrap || wrap.dataset.fallbackReady === "1") return;
    wrap.dataset.fallbackReady = "1";
    var url = wrap.getAttribute("data-preview-url");
    if (!url) return;
    var img = wrap.querySelector(".project-card__preview-shot");
    if (!img) {
      img = document.createElement("img");
      img.className = "project-card__preview-shot";
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      wrap.appendChild(img);
    }
    img.setAttribute("data-lazy-src", screenshotUrl(url));

    var frame = wrap.querySelector("iframe");
    if (!frame) {
      activateFallback(wrap, img);
      return;
    }

    var timer = window.setTimeout(function () {
      activateFallback(wrap, img);
    }, 2800);

    frame.addEventListener("load", function () {
      window.clearTimeout(timer);
    });

    frame.addEventListener("error", function () {
      window.clearTimeout(timer);
      activateFallback(wrap, img);
    });
  }

  function activateFallback(wrap, img) {
    wrap.classList.add("is-fallback");
    var src = img.getAttribute("data-lazy-src");
    if (src && !img.getAttribute("src")) {
      img.setAttribute("src", src);
      img.removeAttribute("data-lazy-src");
    }
  }

  function loadPanelPreviews(panel) {
    if (!panel || panel.dataset.previewsLoaded === "1") return;
    panel.dataset.previewsLoaded = "1";
    panel.querySelectorAll("iframe[data-lazy-src]").forEach(function (frame) {
      var src = frame.getAttribute("data-lazy-src");
      if (!src || frame.getAttribute("src")) return;
      frame.setAttribute("src", src);
      frame.removeAttribute("data-lazy-src");
    });
    panel.querySelectorAll(".project-card__preview--live").forEach(ensureLivePreviewFallback);
    panel.querySelectorAll("img.project-card__preview-shot[data-lazy-src]").forEach(function (img) {
      var src = img.getAttribute("data-lazy-src");
      if (!src || img.getAttribute("src")) return;
      img.setAttribute("src", src);
      img.removeAttribute("data-lazy-src");
    });
  }

  function initAccordion(root) {
    var items = Array.from(root.querySelectorAll(".projects-accordion__item"));
    if (!items.length) return;

    items.forEach(function (item) {
      var trigger = item.querySelector(".projects-accordion__trigger");
      var panel = item.querySelector(".projects-accordion__panel");
      if (!trigger || !panel || trigger.dataset.projectsAccordionWired === "1") return;

      trigger.dataset.projectsAccordionWired = "1";
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
          revealProjectCards(panel);
        }
      });
    });
  }

  function revealProjectCards(scope) {
    var root = scope || document.querySelector("#slide-projects");
    if (!root) return;
    root.querySelectorAll(".welten-reveal:not(.is-visible)").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  function openDefaultCategory(root) {
    if (!root || root.querySelector(".projects-accordion__item.is-open")) return;
    var first = root.querySelector(
      '.projects-accordion__item[data-category="websites"] .projects-accordion__trigger'
    );
    if (first) first.click();
  }

  function boot() {
    document.querySelectorAll("[data-projects-accordion]").forEach(initAccordion);
    revealProjectCards();
  }

  function onProjectsChapter() {
    boot();
    window.setTimeout(function () {
      openDefaultCategory(document.querySelector("[data-projects-accordion]"));
      revealProjectCards();
    }, 120);
  }

  function bootDeferred() {
    var onProjects =
      document.body.getAttribute("data-current-slide") === "projects" ||
      !!document.querySelector("#slide-projects.active");

    boot();
    if (onProjects) onProjectsChapter();

    document.addEventListener("welten-init-projects-accordion", onProjectsChapter);
    document.addEventListener("welten-chapter-change", function (e) {
      var ch = e && e.detail && e.detail.chapter;
      if (ch === "projects") onProjectsChapter();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootDeferred);
  } else {
    bootDeferred();
  }
})();
