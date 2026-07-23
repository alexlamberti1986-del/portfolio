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

  function bindControls() {
    var langBtn = document.querySelector("[data-v2-lang]");
    var musicBtn = document.querySelector("[data-v2-music]");
    var effectsBtn = document.querySelector("[data-v2-effects]");

    if (langBtn) {
      langBtn.addEventListener("click", function () {
        var next = (langBtn.textContent || "DE").trim().toUpperCase() === "DE" ? "EN" : "DE";
        langBtn.textContent = next;
        postToParent("lang", { lang: next.toLowerCase() });
      });
    }

    if (musicBtn) {
      musicBtn.addEventListener("click", function () {
        var on = musicBtn.getAttribute("aria-pressed") !== "true";
        musicBtn.setAttribute("aria-pressed", on ? "true" : "false");
        postToParent("music", { enabled: on });
      });
    }

    if (effectsBtn) {
      effectsBtn.addEventListener("click", function () {
        var on = effectsBtn.getAttribute("aria-pressed") !== "true";
        effectsBtn.setAttribute("aria-pressed", on ? "true" : "false");
        document.body.classList.toggle("mv-effects-off", !on);
        postToParent("effects", { enabled: on });
      });
    }
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
      if (document.body.classList.contains("mv-effects-off")) {
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
      ".mv-section__head, .mv-world-card, .mv-galaxy__copy, .mv-galaxy__frame, .mv-alex__portrait, .mv-alex__copy, .mv-work, .mv-nexus__orbit, .mv-nexus__list, .mv-contact__copy, .mv-contact__visual, .mv-closing__inner"
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

  function boot() {
    setYear();
    bindControls();
    bindHeader();
    bindParallax();
    bindReveal();
    bindWorldCards();
    postToParent("ready", { path: location.pathname });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
