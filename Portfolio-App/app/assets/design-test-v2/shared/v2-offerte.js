/**
 * In-page Offerte form embed for design-test-v2 worlds.
 * Loads the live form iframe lazily — on mobile only after tap (heavy ~13MB form).
 */
(function (root) {
  "use strict";

  /* Form expects these exact keys (not shell aliases general/vertex) */
  var FORM_WORLDS = ["multiversum", "nexora", "professional", "freiraum"];
  var FORM_VER = "20260726offerteFast1";

  function detectWorld(host) {
    var candidates = [
      host && host.getAttribute("data-world"),
      root.document.documentElement.getAttribute("data-world"),
      root.document.body && root.document.body.getAttribute("data-world"),
    ];
    var p = (root.location.pathname || "").toLowerCase();
    for (var i = 0; i < FORM_WORLDS.length; i++) {
      if (p.indexOf("/" + FORM_WORLDS[i]) !== -1) candidates.push(FORM_WORLDS[i]);
    }
    for (var c = 0; c < candidates.length; c++) {
      var w = String(candidates[c] || "").toLowerCase();
      if (FORM_WORLDS.indexOf(w) >= 0) return w;
    }
    return "multiversum";
  }

  function lang() {
    try {
      return (
        root.localStorage.getItem("mv-preview-lang") ||
        root.localStorage.getItem("mv-lang") ||
        "de"
      );
    } catch (e) {
      return "de";
    }
  }

  function isNarrow() {
    try {
      return !!(root.matchMedia && root.matchMedia("(max-width: 900px)").matches);
    } catch (e) {
      return false;
    }
  }

  function ensureMarkup(host) {
    if (host.querySelector(".v2-offerte__shell")) return;
    host.classList.add("v2-offerte");
    host.innerHTML =
      '<div class="v2-offerte__inner">' +
      '<div class="v2-offerte__head">' +
      '<p class="v2-offerte__kicker" data-i18n-v2="offerte.kicker">Offerte</p>' +
      '<h2 data-i18n-v2="offerte.title">Kostenlose Projektanfrage</h2>' +
      '<p class="v2-offerte__lead" data-i18n-v2="offerte.lead">Marketing, Website und Wachstum sauber planen — klare Offerte in wenigen Schritten.</p>' +
      "</div>" +
      '<div class="v2-offerte__gate" data-v2-offerte-gate>' +
      '<button type="button" class="v2-offerte__load-btn" data-v2-offerte-load>' +
      "Formular laden" +
      "</button>" +
      '<p class="v2-offerte__gate-note">Lädt nur bei Bedarf — schneller auf Handy &amp; Tablet.</p>' +
      "</div>" +
      '<div class="v2-offerte__shell is-loading" data-v2-offerte-shell hidden>' +
      '<iframe id="offerteFrame" class="v2-offerte__frame" title="Offerte" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="about:blank"></iframe>' +
      "</div>" +
      '<p class="v2-offerte__hint"><a href="#kontakt" data-i18n-v2="offerte.contact">Lieber zuerst Kontakt?</a></p>' +
      "</div>";
  }

  function loadFrame(host) {
    var frame = host.querySelector("#offerteFrame");
    var shell = host.querySelector("[data-v2-offerte-shell]");
    var gate = host.querySelector("[data-v2-offerte-gate]");
    if (!frame || frame.dataset.v2OfferteSrc) return;
    if (shell) {
      shell.hidden = false;
      shell.classList.add("is-loading");
    }
    if (gate) gate.hidden = true;
    var world = detectWorld(host);
    try {
      /* Prefer current world over a previously saved form world */
      root.localStorage.setItem("alex-lamberti-world", world);
    } catch (eStore) {}
    var src =
      "/assets/preview/alx-offerte-form-v5.html?embed=1&world=" +
      encodeURIComponent(world) +
      "&lang=" +
      encodeURIComponent(lang()) +
      "&v=" +
      FORM_VER;
    frame.dataset.v2OfferteSrc = src;
    frame.dataset.v2OfferteWorld = world;
    frame.addEventListener(
      "load",
      function () {
        if (shell) shell.classList.remove("is-loading");
        try {
          var btn =
            frame.contentDocument &&
            frame.contentDocument.querySelector('.lang-btn[data-lang="' + lang() + '"]');
          if (btn && !btn.classList.contains("active")) btn.click();
        } catch (err) {}
        /* Force the form theme to match the current world */
        try {
          frame.contentWindow.postMessage({ type: "alx-preview-sync", world: world, lang: lang() }, "*");
        } catch (eMsg) {}
      },
      { once: true }
    );
    frame.src = src;
  }

  function applyEmbedHeight(frame, height) {
    if (!frame || !(height > 200)) return;
    var h = Math.min(Math.max(Math.ceil(height) + 4, 360), 12000);
    frame.style.height = h + "px";
    frame.style.minHeight = h + "px";
    var shell = frame.closest("[data-v2-offerte-shell]") || frame.parentElement;
    if (shell) {
      shell.style.minHeight = h + "px";
      shell.style.height = "auto";
    }
  }

  function bindEmbedResize() {
    if (root.__v2OfferteEmbedBound) return;
    root.__v2OfferteEmbedBound = true;
    root.addEventListener("message", function (ev) {
      var data = ev && ev.data;
      if (!data || data.type !== "alx-offerte-embed-height") return;
      var frame = root.document.getElementById("offerteFrame");
      if (!frame) return;
      try {
        if (ev.source && frame.contentWindow && ev.source !== frame.contentWindow) return;
      } catch (eSrc) {}
      applyEmbedHeight(frame, Number(data.height) || 0);
    });
  }

  function syncLang(doc, nextLang) {
    var frame = (doc || root.document).getElementById("offerteFrame");
    if (!frame) return;
    try {
      var fd = frame.contentDocument;
      if (!fd) return;
      var btn = fd.querySelector('.lang-btn[data-lang="' + nextLang + '"]');
      if (btn && !btn.classList.contains("active")) btn.click();
    } catch (e) {}
  }

  function mount(doc) {
    doc = doc || root.document;
    var host = doc.querySelector("[data-v2-offerte]");
    if (!host) return;
    if (!host.id) host.id = "offerte";
    host.setAttribute("data-v2-section", "offerte");
    ensureMarkup(host);
    bindEmbedResize();

    function kick() {
      loadFrame(host);
    }

    var loadBtn = host.querySelector("[data-v2-offerte-load]");
    if (loadBtn) {
      loadBtn.addEventListener("click", function () {
        kick();
      });
    }

    var forceRoute =
      (root.location.hash || "").replace(/^#/, "") === "offerte" ||
      /\/offerte\/?$/i.test(root.location.pathname || "");

    /* Desktop: Gate ausblenden, Shell bereit — Laden erst bei Sichtbarkeit.
       Mobile/tablet: Gate sichtbar bis Tap (oder Deep-Link /offerte). */
    if (!isNarrow()) {
      var gateEl = host.querySelector("[data-v2-offerte-gate]");
      var shellEl = host.querySelector("[data-v2-offerte-shell]");
      if (gateEl) gateEl.hidden = true;
      if (shellEl) shellEl.hidden = false;
    }

    if (forceRoute) {
      kick();
    } else if (isNarrow()) {
      /* keep gate visible — user taps to load */
    } else if ("IntersectionObserver" in root) {
      var io = new root.IntersectionObserver(
        function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              kick();
              io.disconnect();
            }
          });
        },
        { rootMargin: "0px 0px" }
      );
      io.observe(host);
    } else {
      kick();
    }

    root.addEventListener("v2-lang-change", function (ev) {
      var l = ev && ev.detail && ev.detail.lang;
      if (l) syncLang(doc, l);
    });

    root.addEventListener("hashchange", function () {
      if ((root.location.hash || "").replace(/^#/, "") === "offerte") kick();
    });

    root.WeltenV2Offerte = {
      load: kick,
      syncLang: syncLang,
      scrollTo: function () {
        kick();
        var reduce = false;
        try {
          reduce = !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);
        } catch (eMq) {}
        try {
          host.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        } catch (e) {
          try {
            host.scrollIntoView(true);
          } catch (e2) {}
        }
        /* Ensure landing even if smooth scroll is interrupted by shell transitions */
        root.setTimeout(function () {
          try {
            host.scrollIntoView({ behavior: "auto", block: "start" });
          } catch (e3) {}
        }, 700);
      },
    };
  }

  if (root.document.readyState === "loading") {
    root.document.addEventListener("DOMContentLoaded", function () {
      mount(root.document);
    });
  } else {
    mount(root.document);
  }
})(typeof window !== "undefined" ? window : this);
