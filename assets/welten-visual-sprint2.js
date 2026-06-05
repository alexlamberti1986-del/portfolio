/**
 * Sprint 2 — Scroll-Reveal, Page Heroes, visuelle Enhancements
 */
(function () {
  "use strict";

  var PROCESS = [
    { title: "Verstehen", desc: "Ziele, Zielgruppe und Kontext klar einordnen." },
    { title: "Konzipieren", desc: "Struktur, Botschaft und Nutzerweg entwickeln." },
    { title: "Gestalten", desc: "Visuell überzeugend und markenkonform umsetzen." },
    { title: "Umsetzen", desc: "Technisch sauber, responsive und launch-ready." },
    { title: "Optimieren", desc: "Performance, SEO und Conversion verbessern." },
  ];

  var SERVICE_ICONS = ["◆", "◇", "▣", "◎", "↗", "✦"];

  var PAGE_HEROES = {
    projects: {
      kicker: "Portfolio",
      title: "Projekte",
      lead: "Webseiten, Leadformulare und digitale Visitenkarten — visuell kuratiert und klar strukturiert.",
    },
    leistungen: {
      kicker: "Leistungen",
      title: "Was ich anbiete",
      lead: "Branding, Webdesign, Marketing, Strategie, Content und Optimierung — aus einer Hand.",
    },
    about: {
      kicker: "Über mich",
      title: "Alex Lamberti",
      lead: "Digital Marketing mit Markenverständnis, Umsetzungskraft und kreativem Anspruch.",
    },
    contact: {
      kicker: "Kontakt",
      title: "Lassen Sie uns sprechen",
      lead: "Telefon, E-Mail oder Standort — direkt, unkompliziert und ohne Formular.",
    },
  };

  var revealObserver = null;

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function markReveal(el, variant, delay) {
    if (!el || el.classList.contains("welten-reveal")) return;
    el.classList.add("welten-reveal");
    if (variant) el.classList.add("welten-reveal--" + variant);
    if (delay) el.classList.add("welten-reveal--delay-" + delay);
    if (revealObserver) revealObserver.observe(el);
    else if (prefersReducedMotion()) el.classList.add("is-visible");
  }

  function initRevealObserver() {
    if (prefersReducedMotion()) {
      document.querySelectorAll(".welten-reveal").forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );
    document.querySelectorAll(".welten-reveal:not(.is-visible)").forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  function injectPageHero(slideId, key) {
    var slide = document.getElementById(slideId);
    if (!slide) return;
    var inner = slide.querySelector(".slide-inner");
    if (!inner || inner.querySelector(".welten-page-hero")) return;
    var data = PAGE_HEROES[key];
    if (!data) return;

    var hero = document.createElement("header");
    hero.className = "welten-page-hero welten-reveal";
    hero.innerHTML =
      '<span class="welten-page-hero__kicker">' + data.kicker + "</span>" +
      '<h1 class="welten-page-hero__title">' + data.title + "</h1>" +
      '<p class="welten-page-hero__lead">' + data.lead + "</p>";

    var label = inner.querySelector(".chapter-label");
    var title = inner.querySelector(".section-title");
    if (label) label.style.display = "none";
    if (title) title.style.display = "none";
    var intro = inner.querySelector(".projects-intro, .prose");
    if (intro && key === "projects") intro.classList.add("welten-reveal", "welten-reveal--delay-1");

    inner.insertBefore(hero, inner.firstChild);
  }

  function enhanceHomeExtras() {
    var extras = document.querySelector(".welten-home-extras");
    if (!extras || extras.dataset.sprint2 === "1") return;
    extras.dataset.sprint2 = "1";

    extras.querySelectorAll("section").forEach(function (sec, i) {
      var h2 = sec.querySelector("h2");
      if (!h2 || sec.querySelector(".welten-section-head")) return;
      var head = document.createElement("div");
      head.className = "welten-section-head welten-reveal";
      var sub = document.createElement("p");
      sub.textContent =
        i === 0
          ? "Ausgewählte Referenzen — von Webauftritten bis digitalen Visitenkarten."
          : "Kernkompetenzen auf einen Blick — klicken für Details.";
      head.appendChild(h2.cloneNode(true));
      head.appendChild(sub);
      h2.replaceWith(head);
    });

    var hl = extras.querySelector(".welten-highlights");
    if (hl) {
      hl.classList.add("welten-highlights--bento");
      hl.querySelectorAll(".welten-highlight-card").forEach(function (card, idx) {
        var num = document.createElement("span");
        num.className = "wh-num";
        num.textContent = String(idx + 1).padStart(2, "0");
        card.appendChild(num);
        markReveal(card, null, Math.min(idx + 1, 4));
      });
    }

    var pills = extras.querySelector(".welten-services-teaser");
    if (pills) {
      pills.classList.add("welten-services-teaser--chips");
      pills.querySelectorAll(".welten-service-pill").forEach(function (p, i) {
        markReveal(p, null, Math.min(i + 1, 4));
      });
    }

    var homeBlock = document.querySelector("#slide-home .home-main-block");
    if (homeBlock && !homeBlock.querySelector(".welten-cta-band")) {
      var band = document.createElement("section");
      band.className = "welten-cta-band glass-card welten-reveal";
      band.setAttribute("aria-label", "Kontaktaufnahme");
      band.innerHTML =
        "<div>" +
        "<h2>Bereit für Ihr nächstes Projekt?</h2>" +
        "<p>Ob Website, Branding oder digitale Strategie — ich freue mich auf den Austausch.</p>" +
        "</div>" +
        '<div class="welten-cta-band__actions">' +
        '<button type="button" class="btn btn-primary" data-go="contact">Kontakt aufnehmen</button>' +
        '<button type="button" class="btn" data-go="projects">Projekte ansehen</button>' +
        "</div>";
      homeBlock.appendChild(band);
    }

    markReveal(extras.querySelector(".welten-home-highlights"), "left");
    markReveal(extras.querySelector(".welten-home-services"), "right", 2);
  }

  function enhanceLeistungen() {
    var grid = document.querySelector(".welten-leistungen-grid");
    if (!grid || grid.dataset.sprint2 === "1") return;
    grid.dataset.sprint2 = "1";
    grid.classList.add("welten-leistungen-grid--bento");
    grid.querySelectorAll(".welten-leistung-card").forEach(function (card, i) {
      var h3 = card.querySelector("h3");
      if (h3 && !card.querySelector(".lc-icon")) {
        var icon = document.createElement("div");
        icon.className = "lc-icon";
        icon.textContent = SERVICE_ICONS[i] || "◆";
        card.insertBefore(icon, h3);
      }
      markReveal(card, i % 2 === 0 ? "left" : "right", Math.min(i + 1, 4));
    });
  }

  function injectProcessTimeline() {
    var about = document.querySelector("#slide-about .slide-inner");
    if (!about || about.querySelector(".welten-process")) return;

    var wrap = document.createElement("section");
    wrap.className = "welten-process welten-reveal";
    wrap.innerHTML = "<h3>Arbeitsweise — in fünf Schritten</h3>";
    var steps = document.createElement("div");
    steps.className = "welten-process-steps";

    PROCESS.forEach(function (step, i) {
      var el = document.createElement("article");
      el.className = "welten-process-step glass-card welten-reveal";
      el.innerHTML = "<strong>" + step.title + "</strong><span>" + step.desc + "</span>";
      markReveal(el, null, Math.min(i + 1, 4));
      steps.appendChild(el);
    });

    wrap.appendChild(steps);
    var merged = about.querySelector(".welten-about-merged");
    if (merged) about.insertBefore(wrap, merged);
    else about.appendChild(wrap);
  }

  function enhanceAbout() {
    document.querySelectorAll(".welten-about-merged .welten-merge-block").forEach(function (block, i) {
      markReveal(block, i % 2 === 0 ? "left" : "right", Math.min(i + 1, 3));
    });
    injectProcessTimeline();
  }

  function enhanceContact() {
    document.querySelectorAll(".welten-contact-card").forEach(function (card, i) {
      markReveal(card, null, Math.min(i + 1, 3));
    });
    var map = document.querySelector(".contact-map-embed");
    if (map) markReveal(map, null, 2);
  }

  function enhanceProjects() {
    document.querySelectorAll("#slide-projects .project-card").forEach(function (card, i) {
      if (i < 12) markReveal(card, null, (i % 4) + 1);
    });
    document.querySelectorAll("#slide-projects .projects-accordion__item").forEach(function (item, i) {
      markReveal(item, null, Math.min(i + 1, 3));
    });
  }

  function enhanceHomeIntro() {
    var copy = document.querySelector("#slide-home .home-copy");
    var portrait = document.querySelector("#slide-home .home-portrait-card");
    if (copy) markReveal(copy, "left");
    if (portrait) markReveal(portrait, "right", 2);

    var cta = document.querySelector("#slide-home .cta-row");
    if (cta) {
      var btns = cta.querySelectorAll(".btn");
      btns.forEach(function (btn) {
        if (btn.textContent.indexOf("über") >= 0 || btn.textContent.indexOf("Über") >= 0) {
          btn.setAttribute("data-go", "contact");
          btn.textContent = "Kontakt aufnehmen";
        }
      });
    }
  }

  function enhanceAll() {
    document.body.classList.add("welten-sprint2");
    injectPageHero("slide-projects", "projects");
    injectPageHero("slide-leistungen", "leistungen");
    injectPageHero("slide-about", "about");
    injectPageHero("slide-contact", "contact");
    enhanceHomeIntro();
    enhanceHomeExtras();
    enhanceLeistungen();
    enhanceAbout();
    enhanceContact();
    enhanceProjects();
    initRevealObserver();
  }

  function onChapterChange() {
    requestAnimationFrame(function () {
      var active = document.querySelector(".slide.active");
      if (!active) return;
      active.querySelectorAll(".welten-reveal:not(.is-visible)").forEach(function (el) {
        if (revealObserver) revealObserver.observe(el);
      });
    });
  }

  function apply() {
    enhanceAll();
    var obs = new MutationObserver(onChapterChange);
    obs.observe(document.body, { attributes: true, attributeFilter: ["data-current-slide"] });
    document.addEventListener("welten-chapter-change", onChapterChange);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }

  window.WeltenVisualSprint2 = { refresh: enhanceAll };
})();
