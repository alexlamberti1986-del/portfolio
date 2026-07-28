/**
 * MULTIVERSUM — Design Test V2
 * Cosmic page behavior: year, controls → parent, parallax, reveal, reduced motion.
 */
(function () {
  "use strict";

  var reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function postToParent(type, detail) {
    var payload = Object.assign({ source: "design-test-v2", world: "multiversum", type: type }, detail || {});
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(payload, "*");
      }
    } catch (err) {
      /* ignore cross-origin */
    }
    try {
      window.dispatchEvent(new CustomEvent("v2-control", { detail: payload }));
    } catch (err2) {
      /* ignore */
    }
  }

  function setYear() {
    var nodes = document.querySelectorAll("[data-v2-year], [data-year]");
    var y = String(new Date().getFullYear());
    nodes.forEach(function (el) {
      el.textContent = y;
    });
  }

  function bindHeader() {
    var header = document.querySelector("[data-mv-header]");
    if (!header) return;

    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function bindParallax() {
    if (reduced) return;
    var layers = document.querySelectorAll("[data-parallax-layer]");
    if (!layers.length) return;

    var ticking = false;
    var apply = function () {
      ticking = false;
      if (
        document.body.classList.contains("mv-effects-off") ||
        document.body.classList.contains("mv-galaxy-open")
      ) {
        layers.forEach(function (el) {
          el.style.transform = "";
        });
        return;
      }
      var y = window.scrollY || 0;
      layers.forEach(function (el) {
        var speed = parseFloat(el.getAttribute("data-parallax-layer") || "0.1") || 0.1;
        el.style.transform = "translate3d(0," + (y * speed).toFixed(2) + "px,0)";
      });
    };

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(apply);
        }
      },
      { passive: true }
    );
    apply();
  }

  function bindReveal() {
    var targets = document.querySelectorAll(
      ".mv-section__head, .mv-world-card, .mv-galaxy__copy, .mv-galaxy__frame, .mv-alex__portrait, .mv-alex__copy, .mv-work, .mv-dim, .mv-dimensions__lanes, .mv-contact__copy, .mv-contact__visual, .mv-closing__inner"
    );

    targets.forEach(function (el) {
      el.classList.add("mv-reveal");
    });

    if (reduced || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    targets.forEach(function (el) {
      io.observe(el);
    });
  }

  function bindWorldCards() {
    var cards = document.querySelectorAll("[data-world-card]");
    cards.forEach(function (card) {
      card.addEventListener("pointerenter", function () {
        cards.forEach(function (c) {
          c.classList.toggle("is-hot", c === card);
        });
      });
      card.addEventListener("pointerleave", function () {
        card.classList.remove("is-hot");
      });
    });
  }

  function bindGalaxyWalk() {
    var starters = document.querySelectorAll("[data-mv-galaxy-start]");
    var overlay = document.querySelector("[data-mv-galaxy-overlay]");
    var iframe = document.querySelector("[data-mv-galaxy-iframe]");
    var closeBtn = document.querySelector("[data-mv-galaxy-close]");
    if (!starters.length || !overlay || !iframe) return;

    var SRC =
      "/assets/galaxy-gang/alexlamberti-galaxy-gang-v37-responsive-optimized-self-contained.html?v2=1&v=20260728galaxyTextbox2";
    var mq =
      window.matchMedia &&
      window.matchMedia("(min-width: 1025px) and (min-height: 640px)");
    var lastFocus = null;
    var bootedVisible = false;
    var MV_HASH = {
      about: "alex",
      projects: "werke",
      leistungen: "leistungen",
      contact: "kontakt",
      home: "",
    };

    function currentLang() {
      try {
        return (
          localStorage.getItem("mv-preview-lang") ||
          localStorage.getItem("mv-lang") ||
          "de"
        );
      } catch (e) {
        return "de";
      }
    }

    function postLangToGalaxy() {
      try {
        var win = iframe.contentWindow;
        if (!win) return;
        win.postMessage({ type: "portfolio-preview-lang", lang: currentLang() }, "*");
      } catch (e) {}
    }

    function canStart() {
      try {
        return mq ? !!mq.matches : window.innerWidth >= 1025 && window.innerHeight >= 640;
      } catch (e) {
        return false;
      }
    }

    function galaxyNeedsReload() {
      try {
        var doc = iframe.contentDocument;
        var win = iframe.contentWindow;
        if (!doc || !win) return true;
        if (typeof win.ALEX_GALAXY_ASSETS === "undefined") return true;
        var canvas = doc.getElementById("galaxyCanvas");
        if (!canvas) return true;
        return canvas.width <= 300 || canvas.height <= 150;
      } catch (e) {
        return true;
      }
    }

    function nudgeResize() {
      try {
        var win = iframe.contentWindow;
        if (!win) return;
        /* Avoid spam-resize on large TVs (causes canvas rebuild / flicker) */
        if (nudgeResize._busy) return;
        nudgeResize._busy = true;
        win.dispatchEvent(new Event("resize"));
        window.setTimeout(function () {
          nudgeResize._busy = false;
        }, 400);
      } catch (e) {}
    }

    /** Load only while overlay is visible — hidden iframes boot at 0×0 and stay blank. */
    function loadGalaxy(force) {
      var current = iframe.getAttribute("src") || "";
      if (force || !current || current === "about:blank" || galaxyNeedsReload()) {
        iframe.src = SRC;
        bootedVisible = true;
      } else {
        nudgeResize();
      }
    }

    function open() {
      if (!canStart()) return;
      lastFocus = document.activeElement;
      overlay.hidden = false;
      void overlay.offsetHeight;
      loadGalaxy(!bootedVisible);
      overlay.classList.add("is-open");
      document.documentElement.classList.add("mv-galaxy-open");
      document.body.classList.add("mv-galaxy-open");
      window.setTimeout(nudgeResize, 160);
      window.setTimeout(postLangToGalaxy, 120);
      window.setTimeout(postLangToGalaxy, 500);
      window.setTimeout(function () {
        /* Only hard-reload if canvas never sized — avoid double-load flicker on TV */
        if (galaxyNeedsReload()) loadGalaxy(true);
      }, 1200);
      if (closeBtn) {
        try {
          closeBtn.focus();
        } catch (eFocus) {}
      }
    }

    function close() {
      overlay.classList.remove("is-open");
      document.documentElement.classList.remove("mv-galaxy-open");
      document.body.classList.remove("mv-galaxy-open");
      var done = function () {
        overlay.hidden = true;
        overlay.removeEventListener("transitionend", done);
        /* Schweres Galaxy-Iframe entladen — speichert RAM/CPU auf Desktop */
        try {
          iframe.removeAttribute("src");
          iframe.src = "about:blank";
          bootedVisible = false;
        } catch (eUnload) {}
      };
      if (reduced) {
        done();
      } else {
        overlay.addEventListener("transitionend", done);
        window.setTimeout(function () {
          if (!overlay.hidden && !overlay.classList.contains("is-open")) done();
        }, 320);
      }
      if (lastFocus && typeof lastFocus.focus === "function") {
        try {
          lastFocus.focus();
        } catch (eBack) {}
      }
    }

    function scrollToLocalHash(hash) {
      var id = String(hash || "").replace(/^#/, "");
      if (!id) return;
      var el = document.getElementById(id);
      if (!el) return;
      try {
        el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      } catch (eScroll) {
        try {
          el.scrollIntoView(true);
        } catch (e2) {}
      }
      try {
        if (history && history.replaceState) {
          history.replaceState(null, "", "#" + id);
        } else {
          location.hash = id;
        }
      } catch (eHash) {}
    }

    function onGalaxyNavigate(ev) {
      var data = ev && ev.data;
      if (!data || data.type !== "galaxy-navigate") return;
      try {
        if (ev.source && iframe.contentWindow && ev.source !== iframe.contentWindow) return;
      } catch (eSrc) {
        return;
      }
      if (!overlay.classList.contains("is-open") && overlay.hidden) return;

      var world = String(data.world || "multiversum").toLowerCase();
      var go = String(data.go || "home").toLowerCase();
      var hash = String(data.targetHash || "").replace(/^#/, "");
      var href = String(data.href || "");

      close();

      if (world === "multiversum" || world === "general") {
        if (!hash && go && go !== "home") hash = MV_HASH[go] || "";
        if (hash) {
          window.setTimeout(function () {
            scrollToLocalHash(hash);
          }, reduced ? 40 : 280);
        }
        return;
      }

      var targetHash = hash ? "#" + hash : "";
      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage(
            {
              type: "alex:switch-world",
              source: "design-test-v2",
              world: world,
              go: go,
              href: href,
              targetHash: targetHash,
            },
            "*"
          );
          return;
        }
      } catch (ePost) {}
      if (href) {
        try {
          window.location.assign(href);
        } catch (eGo) {}
      }
    }

    window.addEventListener("message", onGalaxyNavigate);
    window.addEventListener("message", function (ev) {
      var data = ev && ev.data;
      if (!data) return;
      /* Shell: Weltwechsel → Galaxy sofort entladen (GPU/CPU frei) */
      if (data.type === "mv-galaxy-hard-hide") {
        if (overlay.classList.contains("is-open") || !overlay.hidden) close();
        else {
          try {
            iframe.removeAttribute("src");
            iframe.src = "about:blank";
            bootedVisible = false;
          } catch (eHard) {}
        }
        return;
      }
      if (data.type === "galaxy-ready" && data.source === "design-test-v2") {
        postLangToGalaxy();
        return;
      }
      if (data.type === "portfolio-preview-lang" && data.lang) {
        if (overlay.classList.contains("is-open")) postLangToGalaxy();
      }
    });
    /* When shell lang changes while galaxy is open */
    window.addEventListener("storage", function (ev) {
      if (!ev) return;
      if ((ev.key === "mv-preview-lang" || ev.key === "mv-lang") && overlay.classList.contains("is-open")) {
        postLangToGalaxy();
      }
    });
    document.addEventListener("v2-lang-change", function () {
      if (overlay.classList.contains("is-open")) postLangToGalaxy();
    });

    starters.forEach(function (btn) {
      btn.addEventListener("click", open);
    });
    if (closeBtn) closeBtn.addEventListener("click", close);

    overlay.addEventListener("click", function (ev) {
      if (ev.target === overlay) close();
    });

    document.addEventListener("keydown", function (ev) {
      if ((ev.key === "Escape" || ev.key === "Esc") && overlay.classList.contains("is-open")) {
        close();
      }
    });

    if (/galaxy-start/i.test(location.hash || "") || /[?&]galaxyStart=1/i.test(location.search || "")) {
      if (canStart()) open();
    }
  }

  function boot() {
    setYear();
    bindHeader();
    bindParallax();
    bindReveal();
    bindWorldCards();
    bindGalaxyWalk();
    postToParent("ready", { path: location.pathname });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
