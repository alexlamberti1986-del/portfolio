/**
 * Bildpfade der Kontaktformular-Leistungen (4welten-preview) — eine Quelle für Projekte.
 */
(function () {
  "use strict";

  var BASE = "assets/images/4welten-preview/";

  var FILES = {
    general: {
      logo: "03_html_05_general_logo.webp",
      qr: "04_html_06_general_qr.webp",
      visitenkarten: "04_html_06_general_visitenkarten.png",
      form: "05_html_07_general_form.webp",
      web: "06_html_08_general_web.webp",
      seo: "07_html_09_general_seo.webp",
      print: "08_html_10_general_print.webp",
      layout3d: "09_html_11_general_layout3d.webp",
      present: "10_html_12_general_present.webp",
    },
    nexora: {
      logo: "11_html_13_nexora_logo.webp",
      qr: "12_html_14_nexora_qr.webp",
      visitenkarten: "12_html_14_nexora_visitenkarten.png",
      form: "13_html_15_nexora_form.webp",
      web: "14_html_16_nexora_web.webp",
      seo: "15_html_17_nexora_seo.webp",
      print: "16_html_18_nexora_print.webp",
      layout3d: "17_html_19_nexora_layout3d.webp",
      present: "18_html_20_nexora_present.webp",
    },
    professional: {
      logo: "21_html_21_professional_logo.webp",
      qr: "22_html_22_professional_qr.webp",
      visitenkarten: "22_html_22_professional_visitenkarten.png",
      form: "23_html_23_professional_form.webp",
      web: "24_html_24_professional_web.webp",
      seo: "25_html_25_professional_seo.webp",
      print: "26_html_26_professional_print.webp",
      layout3d: "27_html_27_professional_layout3d.webp",
      present: "28_html_28_professional_present.webp",
    },
    freiraum: {
      logo: "21_html_29_freiraum_logo.webp",
      qr: "22_html_30_freiraum_qr.webp",
      visitenkarten: "22_html_30_freiraum_visitenkarten.png",
      form: "23_html_31_freiraum_form.webp",
      web: "24_html_32_freiraum_web.webp",
      seo: "25_html_33_freiraum_seo.webp",
      print: "26_html_34_freiraum_print.webp",
      layout3d: "27_html_35_freiraum_layout3d.webp",
      present: "28_html_36_freiraum_present.webp",
    },
  };

  window.WELTEN_FORM_SERVICE_FILES = FILES;

  window.WeltenFormServiceImage = function (worldKey, serviceKey) {
    var folder = worldKey || "nexora";
    if (folder === "vertex") folder = "professional";
    if (!FILES[folder]) folder = "nexora";
    var file = FILES[folder] && FILES[folder][serviceKey];
    if (!file) return "";
    return BASE + folder + "/" + file;
  };
})();
