/**
 * Erzwingt weltspezifische Profilbilder auf Home + Kontakt (läuft zuletzt).
 */
(function () {
  "use strict";

  var V = "20260629-prof-portrait";

  function worldKey() {
    return document.body.getAttribute("data-world") || "nexora";
  }

  function portraitSrc() {
    var IMG = window.PORTFOLIO_INLINE_IMAGES || {};
    var w = worldKey();
    return IMG[w] || IMG.nexora || IMG.vertex || IMG.general || "";
  }

  function portraitAlt() {
    var w = worldKey();
    if (w === "general") return "Alex Lamberti Multiversum Portrait";
    if (w === "vertex") return "Alex Lamberti Professional Portrait";
    if (w === "freiraum") return "FREIRAUM Kunst-Portrait";
    return "NEXORA KI-Portrait";
  }

  function apply() {
    var src = portraitSrc();
    if (!src) return;
    if (src.indexOf("?v=") === -1) src += "?v=" + V;

    document
      .querySelectorAll("#heroPhoto, #contactPhoto, .home-portrait-card img.portrait-photo, .contact-visual img.portrait-photo")
      .forEach(function (img) {
        img.removeAttribute("srcset");
        img.src = src;
        img.alt = portraitAlt();
        img.style.display = "block";
        img.style.visibility = "visible";
        img.style.opacity = "1";
        img.style.mixBlendMode = "normal";
      });
  }

  function boot() {
    apply();
    setTimeout(apply, 120);
    setTimeout(apply, 600);
    setTimeout(apply, 1800);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.addEventListener("load", apply);
  document.addEventListener("welten-chapter-change", function () {
    setTimeout(apply, 80);
  });

  window.addEventListener("message", function (e) {
    if (e.data && e.data.type === "portfolio-apply-portraits") apply();
  });

  try {
    new MutationObserver(apply).observe(document.body, {
      attributes: true,
      attributeFilter: ["data-world", "data-current-slide"],
    });
  } catch (e) {}

  window.WeltenPortraitsApply = { apply: apply };
})();
