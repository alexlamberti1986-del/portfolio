/**
 * Offerte — Lead-/Offertenformular als eigenes Kapitel (alle Welten)
 */
(function () {
  "use strict";

  var VERSION = "1";
  var FORM_SRC = "assets/preview/alx-offerte-form-v4.html";

  function currentLang() {
    try {
      return (
        localStorage.getItem("mv-preview-lang") ||
        sessionStorage.getItem("mv-preview-lang") ||
        document.documentElement.lang ||
        "de"
      );
    } catch (e) {
      return "de";
    }
  }

  function formWorldKey() {
    var w = document.body.getAttribute("data-world") || "nexora";
    if (w === "general" || w === "multiversum") return "multiversum";
    if (w === "vertex" || w === "professional") return "professional";
    if (w === "freiraum") return "freiraum";
    return "nexora";
  }

  function formFrameSrc() {
    return (
      FORM_SRC +
      "?embed=1&world=" +
      encodeURIComponent(formWorldKey()) +
      "&lang=" +
      encodeURIComponent(currentLang()) +
      "&v=20260714offerte-v4"
    );
  }

  function offerteMarkup() {
    return (
      '<div class="offerte-copy glass-card">' +
      '<p class="chapter-label">Offerte</p>' +
      '<h2 class="section-title">Offerte anfragen</h2>' +
      '<p class="prose">Wählen Sie Ihre Leistungen und erhalten Sie eine klare Einschätzung zu Aufwand und Preis.</p>' +
      "</div>" +
      '<div class="welten-leadform-wrap welten-offerte-form-wrap">' +
      '<iframe class="welten-leadform-frame" id="weltenOfferteForm" title="Offertenformular" scrolling="no" src="' +
      formFrameSrc() +
      '" loading="lazy"></iframe>' +
      "</div>"
    );
  }

  function resizeOfferteFrame(height) {
    var frame = document.getElementById("weltenOfferteForm");
    var wrap = frame && frame.closest(".welten-leadform-wrap");
    if (!frame) return;
    var h = parseInt(height, 10);
    if (h > 200) {
      frame.style.height = h + "px";
      frame.style.minHeight = "0";
      frame.style.maxHeight = h + "px";
      frame.setAttribute("scrolling", "no");
      if (wrap) {
        wrap.style.height = h + "px";
        wrap.style.minHeight = "0";
        wrap.style.maxHeight = h + "px";
      }
    }
  }

  function syncOfferteFrame() {
    var frame = document.getElementById("weltenOfferteForm");
    if (!frame) return;

    var nextSrc = formFrameSrc();
    var current = frame.getAttribute("src") || "";
    if (current === "about:blank" || current.split("#")[0] !== nextSrc.split("#")[0]) {
      try {
        localStorage.setItem("alex-lamberti-world", formWorldKey());
      } catch (e) {}
      frame.src = nextSrc;
      return;
    }

    if (frame.contentWindow) {
      try {
        frame.contentWindow.postMessage(
          {
            type: "alx-preview-sync",
            world: formWorldKey(),
            lang: currentLang(),
          },
          "*"
        );
      } catch (e) {}
    }
  }

  function needsOfferteRebuild(slide) {
    if (!slide) return false;
    if (slide.dataset.weltenOfferte !== VERSION) return true;
    if (!slide.querySelector(".offerte-copy")) return true;
    if (!slide.querySelector(".welten-offerte-form-wrap")) return true;
    if (!slide.querySelector("#weltenOfferteForm")) return true;
    return false;
  }

  function applyOfferte() {
    var slide = document.querySelector("#slide-offerte .slide-inner");
    if (!slide) return;

    if (!needsOfferteRebuild(slide)) {
      slide.className = "slide-inner offerte-layout";
      syncOfferteFrame();
      return;
    }

    slide.className = "slide-inner offerte-layout";
    slide.dataset.weltenOfferte = VERSION;
    slide.innerHTML = offerteMarkup();
    syncOfferteFrame();
  }

  function apply() {
    applyOfferte();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }

  document.addEventListener("welten-lang-change", function () {
    syncOfferteFrame();
  });

  document.addEventListener("welten-chapter-change", function (e) {
    if (e && e.detail && e.detail.chapter === "offerte") applyOfferte();
  });

  window.addEventListener("message", function (e) {
    if (!e.data) return;
    if (e.data.type === "alx-form-height" && e.data.height) {
      if (document.body.getAttribute("data-current-slide") === "offerte") {
        resizeOfferteFrame(e.data.height);
      }
    }
    if (e.data.type === "portfolio-preview-lang" || e.data.type === "alx-preview-sync") {
      syncOfferteFrame();
    }
  });

  try {
    new MutationObserver(function () {
      if (document.body.getAttribute("data-current-slide") === "offerte") {
        syncOfferteFrame();
      }
    }).observe(document.body, {
      attributes: true,
      attributeFilter: ["data-world", "data-current-slide"],
    });
  } catch (e) {}

  window.addEventListener("load", function () {
    setTimeout(syncOfferteFrame, 80);
  });

  window.WeltenOfferteForm = {
    syncOfferteFrame: syncOfferteFrame,
    formWorldKey: formWorldKey,
  };
})();
