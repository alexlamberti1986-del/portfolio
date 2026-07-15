/**
 * Offerte — Lead-/Offertenformular als eigenes Kapitel (alle Welten)
 */
(function () {
  "use strict";

  var VERSION = "3";
  var FORM_SRC = "assets/preview/alx-offerte-form-v5.html";
  var FORM_CACHE = "20260715typeFix1";
  var FORM_TYPO_STYLE_ID = "welten-offerte-typo-fix";

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
      "&v=" +
      FORM_CACHE
    );
  }

  function injectFormTypography(frame) {
    var doc;
    try {
      doc = frame && frame.contentDocument;
    } catch (e) {
      return;
    }
    if (!doc || !doc.head) return;

    if (!doc.getElementById(FORM_TYPO_STYLE_ID)) {
      var style = doc.createElement("style");
      style.id = FORM_TYPO_STYLE_ID;
      style.textContent =
        ".sum-item,.hero-point,.select-card,.card-body,.step-tab,.pill,.mini{min-width:0;max-width:100%;box-sizing:border-box}" +
        ".sum-item span{display:inline-block!important;max-width:100%;box-sizing:border-box;padding:5px 9px;border-radius:999px;letter-spacing:.06em!important;overflow-wrap:anywhere;word-break:break-word;white-space:normal!important;line-height:1.25}" +
        ".hero-point span{display:block;max-width:100%;overflow-wrap:anywhere;word-break:break-word;hyphens:auto;line-height:1.25}" +
        ".select-card h3,.step-tab b,.pill{overflow-wrap:anywhere;word-break:break-word;hyphens:auto}" +
        "@media (max-width:767px){" +
        ".sum-item span{font-size:10px!important;letter-spacing:.03em!important;padding:4px 8px;text-transform:none!important}" +
        ".hero-point{min-width:0;overflow:hidden}" +
        ".hero-point span{font-size:10px;line-height:1.2}" +
        ".hero-point strong{font-size:clamp(16px,5.5vw,20px)}" +
        ".step-tab{min-width:0;flex:0 0 auto;max-width:78vw}" +
        ".step-tab b{white-space:normal!important;overflow:visible!important;text-overflow:unset!important;font-size:12px;line-height:1.2}" +
        ".panel h2{overflow-wrap:anywhere;hyphens:auto}" +
        ".select-card h3{font-size:clamp(16px,4.8vw,20px);letter-spacing:-.02em}" +
        ".pill{padding:10px 12px;font-size:13px;line-height:1.2}" +
        ".mini{font-size:10px;letter-spacing:.05em;white-space:normal;max-width:100%}" +
        "}" +
        "@media (max-width:420px){" +
        ".sum-item span{font-size:9.5px!important;letter-spacing:.02em!important}" +
        ".hero-points{gap:7px}" +
        ".step-tab{padding:8px 9px}" +
        ".step-tab b{font-size:11px}" +
        "}";
      doc.head.appendChild(style);
    }

    /* Lange DE-Labels kürzen, damit sie in Mobile-Chips passen */
    doc.querySelectorAll(".sum-item span").forEach(function (el) {
      if (/^Dienstleistungen$/i.test((el.textContent || "").trim())) {
        el.textContent = "Leistungen";
      }
    });
    doc.querySelectorAll(".hero-point span").forEach(function (el) {
      if (/Dienstleistungsbereiche/i.test(el.textContent || "")) {
        el.textContent = "Leistungsbereiche";
      }
    });
  }

  function bindFormTypography(frame) {
    if (!frame || frame.getAttribute("data-typo-bound") === "1") return;
    frame.setAttribute("data-typo-bound", "1");
    frame.addEventListener("load", function () {
      injectFormTypography(frame);
      try {
        var doc = frame.contentDocument;
        if (!doc || !doc.body || frame._typoObserver) return;
        frame._typoObserver = new MutationObserver(function () {
          injectFormTypography(frame);
        });
        frame._typoObserver.observe(doc.body, { childList: true, subtree: true, characterData: true });
      } catch (e) {}
    });
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

    bindFormTypography(frame);

    var nextSrc = formFrameSrc();
    var current = frame.getAttribute("src") || "";
    if (current === "about:blank" || current.split("#")[0] !== nextSrc.split("#")[0]) {
      try {
        localStorage.setItem("alex-lamberti-world", formWorldKey());
      } catch (e) {}
      frame.src = nextSrc;
      return;
    }

    injectFormTypography(frame);

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
