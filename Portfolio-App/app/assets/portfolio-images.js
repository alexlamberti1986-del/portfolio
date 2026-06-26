/**
 * Profilbilder HOME + Kontakt — weltspezifische PROFILBILD-Dateien
 */
(function () {
  "use strict";

  var PORTRAIT_V = "20260626-prof-neu";
  var BASE = "assets/images/4welten-preview/";

  var PORTRAIT_FILES = {
    general: "MULTIVERSUM PROFILBILD für HOME und Kontakt.png",
    nexora: "NEXORA PROFILBILD für HOME und Kontakt.png",
    vertex: "PROFESSIONAL PROFILBILD für HOME und Kontakt.png",
    freiraum: "FREIRAUM PROFILBILD für HOME und Kontakt(1).png",
  };

  var FOLDERS = {
    general: BASE + "general/",
    nexora: BASE + "nexora/",
    vertex: BASE + "professional/",
    freiraum: BASE + "freiraum/",
  };

  function portraitUrl(worldKey) {
    var folder = FOLDERS[worldKey] || FOLDERS.nexora;
    var file = PORTRAIT_FILES[worldKey] || PORTRAIT_FILES.nexora;
    return folder + encodeURIComponent(file) + "?v=" + PORTRAIT_V;
  }

  window.PORTFOLIO_INLINE_IMAGES = {
    general: portraitUrl("general"),
    nexora: portraitUrl("nexora"),
    vertex: portraitUrl("vertex"),
    freiraum: portraitUrl("freiraum"),
  };

  window.PORTFOLIO_IMAGE_SRCSET = {};
  window.PORTFOLIO_IMAGE_SIZES = "(max-width: 768px) 88vw, (max-width: 1200px) 42vw, 400px";

  function cssUrl(src) {
    return 'url("' + src + '")';
  }

  var r = document.documentElement;
  var m = window.PORTFOLIO_INLINE_IMAGES;
  r.style.setProperty("--portfolio-img-general", cssUrl(m.general));
  r.style.setProperty("--portfolio-img-nexora", cssUrl(m.nexora));
  r.style.setProperty("--portfolio-img-vertex", cssUrl(m.vertex));
  r.style.setProperty("--portfolio-img-freiraum", cssUrl(m.freiraum));
})();
