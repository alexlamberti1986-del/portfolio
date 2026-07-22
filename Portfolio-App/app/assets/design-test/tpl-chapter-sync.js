/**
 * Chapter sync — one panel at a time (live-site behavior).
 * Home → only #home; Projekte → only #projekte; Offerte → form; etc.
 */
(function () {
  "use strict";

  var MAP = {
    home: "home",
    leistungen: "leistungen",
    services: "leistungen",
    projects: "projekte",
    projekte: "projekte",
    about: "about",
    "ueber-mich": "about",
    contact: "kontakt",
    kontakt: "kontakt",
    offerte: "offerte",
    offer: "offerte",
  };

  var TITLES = {
    home: "Home",
    leistungen: "Leistungen",
    projekte: "Projekte",
    about: "Über mich",
    kontakt: "Kontakt",
    offerte: "Offerte",
  };

  var last = "";

  function chapterFromParent() {
    try {
      var p = String(parent.location.pathname || "").toLowerCase();
      var parts = p.split("/").filter(Boolean);
      var lastPart = parts[parts.length - 1] || "home";
      if (
        lastPart === "multiversum" ||
        lastPart === "nexora" ||
        lastPart === "professional" ||
        lastPart === "freiraum" ||
        lastPart === "design-test"
      ) {
        return "home";
      }
      return MAP[lastPart] || "home";
    } catch (e) {
      return "home";
    }
  }

  function panels() {
    return document.querySelectorAll("main > #home, main > .section[id]");
  }

  function apply() {
    var chapter = chapterFromParent();
    if (chapter === last && document.body.getAttribute("data-chapter") === chapter) {
      return;
    }
    last = chapter;
    document.body.setAttribute("data-chapter", chapter);
    document.documentElement.setAttribute("data-chapter", chapter);

    panels().forEach(function (sec) {
      var on = sec.id === chapter;
      sec.classList.toggle("is-chapter-active", on);
      sec.hidden = !on;
      sec.setAttribute("aria-hidden", on ? "false" : "true");
    });

    var title = document.querySelector("[data-page-title]");
    if (title) title.textContent = TITLES[chapter] || chapter;

    document.querySelectorAll(".tpl-nav a[data-chapter], .tpl-btn[data-chapter], a.tpl-btn[data-chapter]").forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("data-chapter") === chapter);
    });

    try {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch (e2) {}
  }

  function bindNav() {
    document.querySelectorAll("a[data-chapter]").forEach(function (a) {
      if (a.__dtBound) return;
      a.__dtBound = true;
      a.addEventListener("click", function () {
        setTimeout(apply, 40);
      });
    });
  }

  function boot() {
    bindNav();
    apply();
    /* ensure home visible on first paint before parent path resolves */
    if (!document.body.getAttribute("data-chapter")) {
      document.body.setAttribute("data-chapter", "home");
      var home = document.getElementById("home");
      if (home) {
        home.classList.add("is-chapter-active");
        home.hidden = false;
      }
    }
    apply();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  window.addEventListener("hashchange", apply);
  try {
    parent.addEventListener("popstate", apply);
  } catch (e3) {}
  setInterval(apply, 500);
})();
