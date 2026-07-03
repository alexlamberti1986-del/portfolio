/**
 * Shell-I18n — index.html / Master-iframe sichtbare und SEO-Texte
 */
(function () {
  "use strict";

  if (!document.body || document.body.getAttribute("data-live-shell") !== "1") return;

  function lang() {
    return window.WeltenTranslations ? window.WeltenTranslations.getLang() : "de";
  }

  function t(key) {
    return window.WeltenTranslations ? window.WeltenTranslations.t(key, lang()) : "";
  }

  function applyShell(langCode) {
    if (!window.WeltenTranslations) return;
    var l = window.WeltenTranslations.normalizeLang(langCode || lang());
    window.WeltenTranslations.applyHtmlLang(document, l);

    var skip = document.querySelector(".welten-skip-link");
    if (skip) skip.textContent = window.WeltenTranslations.t("shell.skipLink", l);

    var splash = document.getElementById("mvSplashBoot");
    if (splash) splash.setAttribute("aria-label", window.WeltenTranslations.t("shell.loadingAria", l));

    var splashBrand = document.querySelector(".mv-splash-boot__brand");
    if (splashBrand) splashBrand.textContent = window.WeltenTranslations.t("shell.splashBrand", l);

    var main = document.getElementById("mv-shell-main");
    if (main) {
      var sm = window.WeltenTranslations.pack("shellMain", l);
      if (sm) {
        var h1 = main.querySelector("h1");
        if (h1 && sm.h1) h1.textContent = sm.h1;
        var intro = main.querySelector("p");
        if (intro && sm.intro) intro.textContent = sm.intro;
        var nav = main.querySelector("nav[aria-label]");
        if (nav && sm.navAria) nav.setAttribute("aria-label", sm.navAria);
        var links = main.querySelectorAll("nav ul li a");
        if (links[0] && sm.navMultiversum) links[0].textContent = sm.navMultiversum;
        if (links[1] && sm.navProjects) links[1].textContent = sm.navProjects;
        if (links[2] && sm.navServices) links[2].textContent = sm.navServices;
        if (links[3] && sm.navAbout) links[3].textContent = sm.navAbout;
        if (links[4] && sm.navContact) links[4].textContent = sm.navContact;
        var nexoraP = document.querySelector("#nexora p");
        if (nexoraP && sm.nexoraDesc) nexoraP.textContent = sm.nexoraDesc;
        var proP = document.querySelector("#professional p");
        if (proP && sm.professionalDesc) proP.textContent = sm.professionalDesc;
        var frP = document.querySelector("#freiraum p");
        if (frP && sm.freiraumDesc) frP.textContent = sm.freiraumDesc;
        var contactP = main.querySelector("p:last-of-type");
        if (contactP && sm.emailLabel) {
          var mail = contactP.querySelector('a[href^="mailto:"]');
          var tel = contactP.querySelector('a[href^="tel:"]');
          if (mail) mail.textContent = sm.emailLabel + " alex.lamberti@hotmail.ch";
          if (tel) tel.textContent = sm.phoneLabel + " 079 667 82 11";
        }
      }
    }

    if (window.WeltenShellSEO && typeof window.WeltenShellSEO.apply === "function") {
      var ch = window.WeltenShellSEO.chapterFromPath
        ? window.WeltenShellSEO.chapterFromPath()
        : "home";
      window.WeltenShellSEO.apply(ch, l);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      applyShell();
    });
  } else {
    applyShell();
  }

  window.addEventListener("message", function (e) {
    if (!e.data) return;
    if (e.data.type === "portfolio-preview-lang" && e.data.lang) {
      applyShell(e.data.lang);
    }
  });

  window.WeltenShellI18n = { apply: applyShell };
})();
