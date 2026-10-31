/**
 * Impressum & Datenschutz — world switcher, back link, active TOC.
 * The initial data-welt is set by the inline snippet in <head> (no flash).
 */
(function () {
  "use strict";
  var WORLDS = {
    multiversum: { name: "MULTIVERSUM", href: "/multiversum" },
    nexora: { name: "NEXORA", href: "/nexora" },
    professional: { name: "PROFESSIONAL", href: "/professional" },
    freiraum: { name: "FREIRAUM", href: "/freiraum" },
  };
  var html = document.documentElement;

  function current() {
    var w = html.getAttribute("data-welt");
    return WORLDS[w] ? w : "welcome";
  }

  function withWelt(href, w) {
    var base = href.split("?")[0].split("#")[0];
    var hash = href.indexOf("#") >= 0 ? href.slice(href.indexOf("#")) : "";
    return w === "welcome" ? base + hash : base + "?welt=" + w + hash;
  }

  function apply(w) {
    html.setAttribute("data-welt", w);
    try {
      sessionStorage.setItem("lg-welt", w);
    } catch (e) {}
    var info = WORLDS[w];
    document.querySelectorAll("[data-lg-back]").forEach(function (a) {
      a.setAttribute("href", info ? info.href : "/");
      var label = a.querySelector("[data-lg-back-label]");
      if (label) label.textContent = info ? "Zurück zu " + info.name : "Zur Willkommensseite";
    });
    document.querySelectorAll("[data-lg-world-name]").forEach(function (el) {
      el.textContent = info ? info.name : "Alex Lamberti";
    });
    document.querySelectorAll("a[data-lg-legal]").forEach(function (a) {
      a.setAttribute("href", withWelt(a.getAttribute("href"), w));
    });
    document.querySelectorAll("[data-set-welt]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-set-welt") === w ? "true" : "false");
    });
    try {
      history.replaceState(null, "", withWelt(location.pathname + location.hash, w));
    } catch (e2) {}
  }

  document.querySelectorAll("[data-set-welt]").forEach(function (b) {
    b.addEventListener("click", function () {
      var w = b.getAttribute("data-set-welt");
      apply(current() === w ? "welcome" : w);
    });
  });

  /* Announce world entry so the shell plays the intro + world music */
  document.addEventListener(
    "click",
    function (ev) {
      var a = ev.target && ev.target.closest ? ev.target.closest("a[href]") : null;
      if (!a || !/^\/(multiversum|nexora|professional|freiraum)(?:[\/#?]|$)/.test(a.getAttribute("href") || "")) return;
      try {
        sessionStorage.setItem("v2-world-enter", "1");
        sessionStorage.setItem("v2-world-hash", a.hash || "");
      } catch (e) {}
    },
    true
  );

  /* Highlight the section currently being read */
  var links = Array.prototype.slice.call(document.querySelectorAll(".lg-toc a[href^='#']"));
  if (links.length && "IntersectionObserver" in window) {
    var byId = {};
    links.forEach(function (a) {
      byId[a.getAttribute("href").slice(1)] = a;
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (a) {
            a.classList.toggle("is-active", a === byId[e.target.id]);
          });
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    Object.keys(byId).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) io.observe(sec);
    });
  }

  document.querySelectorAll("[data-lg-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  apply(current());
})();
