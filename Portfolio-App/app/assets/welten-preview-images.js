/**
 * Preview-only: Profil- & Kapitelbilder aus assets/images/4welten-preview/
 */
(function () {
  "use strict";

  var BASE = "assets/images/4welten-preview/";
  var WORLDS = {
    general: BASE + "general/",
    nexora: BASE + "nexora/",
    vertex: BASE + "professional/",
    freiraum: BASE + "freiraum/",
  };

  var CHAPTERS = {
    general: {
      about: "01_MULTIVERSUM_01_UeberMich.webp",
      skills: "02_MULTIVERSUM_02_KompetenzenExpertise.webp",
      leistungen: "03_MULTIVERSUM_03_Leistungen.webp",
      projects: "05_MULTIVERSUM_05_Projekte.webp",
      contact: "07_MULTIVERSUM_07_Kontakt.webp",
      faq: "04_MULTIVERSUM_04_HaeufigeFragen.webp",
      experience: "06_MULTIVERSUM_06_ErfahrungBildung.webp",
      values: "08_MULTIVERSUM_08_WerteArbeitsweise.webp",
      cta: "09_MULTIVERSUM_09_BereitFuerDenNaechstenSchritt.webp",
    },
    nexora: {
      about: "01_NEXORA_01_UeberMich.webp",
      skills: "06_NEXORA_06_KompetenzenExpertise.webp",
      leistungen: "02_NEXORA_02_Leistungen.webp",
      projects: "03_NEXORA_03_Projekte.webp",
      contact: "04_NEXORA_04_Kontakt.webp",
      faq: "05_NEXORA_05_HaeufigeFragen.webp",
      experience: "07_NEXORA_07_ErfahrungBildung.webp",
      values: "08_NEXORA_08_WerteArbeitsweise.webp",
      cta: "09_NEXORA_09_BereitFuerDenNaechstenSchritt.webp",
    },
    vertex: {
      about: "01_PROFESSIONAL_01_UeberMich.webp",
      skills: "06_PROFESSIONAL_06_KompetenzenExpertise.webp",
      leistungen: "02_PROFESSIONAL_02_Leistungen.webp",
      projects: "03_PROFESSIONAL_03_Projekte.webp",
      contact: "04_PROFESSIONAL_04_Kontakt.webp",
      faq: "05_PROFESSIONAL_05_HaeufigeFragen.webp",
      experience: "07_PROFESSIONAL_07_ErfahrungBildung.webp",
      values: "08_PROFESSIONAL_08_WerteArbeitsweise.webp",
      cta: "09_PROFESSIONAL_09_BereitFuerDenNaechstenSchritt.webp",
    },
    freiraum: {
      about: "01_FREIRAUM_01_UeberMich.webp",
      skills: "06_FREIRAUM_06_KompetenzenExpertise.webp",
      leistungen: "02_FREIRAUM_02_Leistungen.webp",
      projects: "03_FREIRAUM_03_Projekte.webp",
      contact: "04_FREIRAUM_04_Kontakt.webp",
      faq: "05_FREIRAUM_05_HaeufigeFragen.webp",
      experience: "07_FREIRAUM_07_ErfahrungBildung.webp",
      values: "08_FREIRAUM_08_WerteArbeitsweise.webp",
      cta: "09_FREIRAUM_09_BereitFuerDenNaechstenSchritt.webp",
    },
  };

  var PORTRAIT_V = "20260626-prof-neu";

  var PORTRAIT_FILES = {
    general: "MULTIVERSUM PROFILBILD für HOME und Kontakt.png",
    nexora: "NEXORA PROFILBILD für HOME und Kontakt.png",
    vertex: "PROFESSIONAL PROFILBILD für HOME und Kontakt.png",
    freiraum: "FREIRAUM PROFILBILD für HOME und Kontakt(1).png",
  };

  function portraitUrl(worldKey) {
    var folder = WORLDS[worldKey] || WORLDS.nexora;
    var file = PORTRAIT_FILES[worldKey] || PORTRAIT_FILES.nexora;
    return folder + encodeURIComponent(file) + "?v=" + PORTRAIT_V;
  }

  function syncPortfolioCssVars() {
    var m = window.PORTFOLIO_INLINE_IMAGES || {};
    var r = document.documentElement;
    if (m.general) r.style.setProperty("--portfolio-img-general", 'url("' + m.general + '")');
    if (m.nexora) r.style.setProperty("--portfolio-img-nexora", 'url("' + m.nexora + '")');
    if (m.vertex) r.style.setProperty("--portfolio-img-vertex", 'url("' + m.vertex + '")');
    if (m.freiraum) r.style.setProperty("--portfolio-img-freiraum", 'url("' + m.freiraum + '")');
  }

  window.PORTFOLIO_INLINE_IMAGES = {
    general: portraitUrl("general"),
    nexora: portraitUrl("nexora"),
    vertex: portraitUrl("vertex"),
    freiraum: portraitUrl("freiraum"),
  };

  syncPortfolioCssVars();

  window.PORTFOLIO_IMAGE_SRCSET = {};
  window.WELTEN_PREVIEW_CHAPTER_BASE = WORLDS;

  function chapterUrl(world, key) {
    var folder = WORLDS[world] || WORLDS.nexora;
    var file = (CHAPTERS[world] && CHAPTERS[world][key]) || (CHAPTERS.nexora && CHAPTERS.nexora[key]) || CHAPTERS.nexora.about;
    return folder + file;
  }

  function applyPortraits() {
    var w = document.body.getAttribute("data-world") || "nexora";
    if (w === "general") w = "general";
    var src = window.PORTFOLIO_INLINE_IMAGES[w] || window.PORTFOLIO_INLINE_IMAGES.nexora;
    document.querySelectorAll("#heroPhoto, .home-portrait-card img, #contactPhoto, .contact-photo").forEach(function (img) {
      img.removeAttribute("srcset");
      img.src = src;
      img.style.opacity = "1";
      img.style.display = "block";
    });
  }

  function patchChapterBoxes() {
    var w = document.body.getAttribute("data-world") || "nexora";
    if (w !== "general" && w !== "nexora" && w !== "vertex" && w !== "freiraum") w = "nexora";

    document.querySelectorAll("[data-chapter-visual], [data-chapter-hero]").forEach(function (box) {
      var key = box.getAttribute("data-chapter-visual") || box.getAttribute("data-chapter-hero");
      if (!key) return;
      var bg = box.querySelector(".welten-chapter-box__bg");
      if (bg) bg.style.backgroundImage = 'url("' + chapterUrl(w, key) + '")';
      box.dataset.chapterVisualApplied = key + "-preview";
    });
  }

  function boot() {
    applyPortraits();
    patchChapterBoxes();
    setTimeout(patchChapterBoxes, 800);
    setTimeout(patchChapterBoxes, 2200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  document.addEventListener("welten-chapter-change", function () {
    setTimeout(function () {
      applyPortraits();
      patchChapterBoxes();
    }, 120);
  });

  try {
    new MutationObserver(function () {
      applyPortraits();
    }).observe(document.body, { attributes: true, attributeFilter: ["data-world", "data-current-slide"] });
  } catch (e) {}

  window.WeltenPreviewImages = { applyPortraits: applyPortraits, patchChapterBoxes: patchChapterBoxes, chapterUrl: chapterUrl };

  window.addEventListener("message", function (e) {
    if (!e.data) return;
    if (e.data.type === "portfolio-apply-portraits" && e.data.src) {
      document.querySelectorAll("#heroPhoto, .home-portrait-card img, #contactPhoto, .contact-photo").forEach(function (img) {
        img.removeAttribute("srcset");
        img.src = e.data.src;
        img.style.opacity = "1";
        img.style.display = "";
      });
    }
  });
})();
