/**
 * Leadformular Bilder v37 — pro Welt (WebP-Dateien)
 */
(function () {
  "use strict";

  var BASE = "leadform-images-v37/";
  var WORLD_FOLDER = {
    general: "Multiversum_General",
    nexora: "Nexora",
    professional: "Professional",
    freiraum: "Freiraum",
  };

  var SERVICE_KEYS = ["logo", "qr", "form", "web", "seo", "print", "layout3d", "present"];

  var STEP2_KEYS = [
    "logo_opt_refresh", "logo_opt_new", "logo_opt_template", "logo_opt_none",
    "qr_opt_web", "qr_opt_pdf", "qr_opt_contact", "qr_opt_other",
    "form_opt_lead", "form_opt_quote", "form_opt_contact", "form_opt_other",
    "web_opt_one", "web_opt_multi5", "web_opt_multiMore",
    "seo_opt_on", "seo_opt_off", "seo_opt_both", "seo_opt_sea",
    "print_opt_flyer", "print_opt_cards", "print_opt_poster", "print_opt_brochure",
    "print_opt_rollup", "print_opt_sticker",
    "layout_opt_concept", "layout_opt_visual",
    "present_opt_company", "present_opt_sales", "present_opt_pitch", "present_opt_other",
  ];

  function imgPath(world, stepFolder, key) {
    return BASE + WORLD_FOLDER[world] + "/" + stepFolder + "/" + key + ".webp";
  }

  function buildServiceImages(world) {
    var out = {};
    SERVICE_KEYS.forEach(function (key) {
      out[key] = imgPath(world, "Schritt_1", key);
    });
    return out;
  }

  function buildStep2Images(world) {
    var out = {};
    STEP2_KEYS.forEach(function (key) {
      out[key] = imgPath(world, "Schritt_2_erste_Frage", key);
    });
    return out;
  }

  window.ALX_LEADFORM_IMAGES_V37 = {
    SERVICE_IMAGES: {
      general: buildServiceImages("general"),
      nexora: buildServiceImages("nexora"),
      professional: buildServiceImages("professional"),
      freiraum: buildServiceImages("freiraum"),
    },
    FIRST_DETAIL_CARD_IMAGES_BY_WORLD: {
      general: buildStep2Images("general"),
      nexora: buildStep2Images("nexora"),
      professional: buildStep2Images("professional"),
      freiraum: buildStep2Images("freiraum"),
    },
  };
})();
