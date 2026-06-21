/**
 * Kapitel-Bilder in Boxen — Produktion (alexlamberti.ch).
 */
(function () {
  "use strict";

  var IMAGES = {
    about: "01-about.webp",
    leistungen: "02-leistungen.webp",
    projects: "03-projects.webp",
    contact: "04-contact.webp",
    faq: "05-faq.webp",
    skills: "06-skills.webp",
    experience: "07-experience.webp",
    values: "08-values.webp",
    cta: "09-cta.webp",
  };

  function currentWorld() {
    var w = document.body.getAttribute("data-world") || "nexora";
    if (w === "general") return "general";
    return w === "vertex" || w === "freiraum" || w === "nexora" ? w : "nexora";
  }

  function imageUrl(key) {
    if (window.WeltenPreviewImages && typeof window.WeltenPreviewImages.chapterUrl === "function") {
      return window.WeltenPreviewImages.chapterUrl(currentWorld(), key);
    }
    return "assets/images/chapters/" + currentWorld() + "/" + (IMAGES[key] || IMAGES.about);
  }

  function unwrapLegacyBands() {
    document.querySelectorAll(".welten-chapter-band").forEach(function (band) {
      var content = band.querySelector(".welten-chapter-band__content");
      if (content) {
        while (content.firstChild) {
          band.parentNode.insertBefore(content.firstChild, band);
        }
      }
      band.remove();
    });
    document.querySelectorAll(".welten-chapter-cta-band").forEach(function (el) {
      el.remove();
    });
  }

  function ensureBoxLayers(box, imageKey) {
    if (!box) return;
    box.classList.add("welten-chapter-box", "welten-reveal");
    box.setAttribute("data-chapter-visual", imageKey);

    if (!box.querySelector(".welten-chapter-box__bg")) {
      var bg = document.createElement("div");
      bg.className = "welten-chapter-box__bg";
      bg.setAttribute("aria-hidden", "true");
      var scrim = document.createElement("div");
      scrim.className = "welten-chapter-box__scrim";
      scrim.setAttribute("aria-hidden", "true");
      box.insertBefore(scrim, box.firstChild);
      box.insertBefore(bg, box.firstChild);
    }

    var bgEl = box.querySelector(".welten-chapter-box__bg");
    if (bgEl) {
      bgEl.style.backgroundImage = 'url("' + imageUrl(imageKey) + '")';
    }
  }

  function applyChapterBox(el, imageKey) {
    if (!el || el.dataset.chapterVisualApplied === imageKey) return;
    if (!el.classList.contains("glass-card") && el.classList.contains("welten-faq")) {
      el.classList.add("glass-card");
    }
    ensureBoxLayers(el, imageKey);
    el.dataset.chapterVisualApplied = imageKey;
  }

  function getContentRoot(slideInner) {
    return slideInner.querySelector(".about-grid > div") || slideInner;
  }

  function wrapHeroBox(slideId, imageKey, heroKey) {
    var slideInner = document.querySelector("#" + slideId + " .slide-inner");
    if (!slideInner) return;

    var root = getContentRoot(slideInner);
    if (root.querySelector('[data-chapter-hero="' + heroKey + '"]')) return;

    var label = root.querySelector(":scope > .chapter-label");
    var title = root.querySelector(":scope > .section-title");
    if (!label || !title) return;

    var intro = root.querySelector(":scope > .prose:not(.projects-accordion .prose)");
    var box = document.createElement("div");
    box.className = "glass-card welten-chapter-box welten-reveal";
    box.setAttribute("data-chapter-hero", heroKey);

    root.insertBefore(box, label);
    box.appendChild(label);
    box.appendChild(title);
    if (intro && intro.parentNode === root) {
      box.appendChild(intro);
    }

    ensureBoxLayers(box, imageKey);
    box.dataset.chapterVisualApplied = imageKey;
  }

  function applyAbout() {
    wrapHeroBox("slide-about", "about", "about");

    var merged = document.querySelector("#slide-about .welten-about-merged");
    if (!merged) return;
    var blocks = merged.querySelectorAll(".welten-merge-block");
    var keys = ["experience", "values", "values"]; /* Erfahrung / Arbeitsweise / Werte */
    blocks.forEach(function (block, i) {
      applyChapterBox(block, keys[i] || "values");
    });
  }

  function applyLeistungen() {
    wrapHeroBox("slide-leistungen", "leistungen", "leistungen");

    var skills = document.querySelector("#slide-leistungen .welten-leistungen-rich");
    if (skills) applyChapterBox(skills, "skills");

    var faq = document.querySelector("#slide-leistungen .welten-faq");
    if (faq) applyChapterBox(faq, "faq");
  }

  function applyProjects() {
    wrapHeroBox("slide-projects", "projects", "projects");
  }

  function injectContactStrip(contactCopy) {
    if (!contactCopy || contactCopy.querySelector(".welten-chapter-box__strip")) return;

    var actions = contactCopy.querySelector(".contact-actions");
    if (!actions) return;

    var strip = document.createElement("div");
    strip.className = "welten-chapter-box__strip";
    strip.innerHTML =
      '<div class="welten-chapter-box__strip-bg" aria-hidden="true"></div>' +
      '<div class="welten-chapter-box__strip-scrim" aria-hidden="true"></div>' +
      '<p class="welten-chapter-box__strip-text">Bereit für den nächsten Schritt?</p>';

    strip.querySelector(".welten-chapter-box__strip-bg").style.backgroundImage =
      'url("' + imageUrl("cta") + '")';

    contactCopy.insertBefore(strip, actions);
  }

  function applyContact() {
    var contactCopy = document.querySelector("#slide-contact .contact-copy");
    if (contactCopy) {
      applyChapterBox(contactCopy, "contact");
      injectContactStrip(contactCopy);
    }

  }

  function revealBoxes() {
    if (!window.IntersectionObserver) {
      document.querySelectorAll(".welten-chapter-box.welten-reveal").forEach(function (el) {
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
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll(".welten-chapter-box.welten-reveal:not(.is-visible)").forEach(function (el) {
      io.observe(el);
    });
  }

  function preloadImages() {
    var world = currentWorld();
    Object.keys(IMAGES).forEach(function (key) {
      var img = new Image();
      img.decoding = "async";
      img.src = "assets/images/chapters/" + world + "/" + IMAGES[key];
    });
  }

  function init() {
    document.body.classList.add("welten-chapter-visuals--on");
    preloadImages();
    watchDynamicContent();

    apply();
    [300, 700, 1400, 2500].forEach(function (ms) {
      setTimeout(apply, ms);
    });

    document.addEventListener("welten-chapter-change", function () {
      setTimeout(apply, 120);
    });
  }

  function apply() {
    unwrapLegacyBands();
    applyAbout();
    applyLeistungen();
    applyProjects();
    applyContact();
    revealBoxes();
  }

  function watchDynamicContent() {
    var contact = document.querySelector("#slide-contact");
    if (contact) {
      new MutationObserver(function () {
        setTimeout(applyContact, 60);
      }).observe(contact, { childList: true, subtree: true });
    }

    var leistungen = document.querySelector("#slide-leistungen");
    if (leistungen) {
      new MutationObserver(function () {
        setTimeout(function () {
          applyLeistungen();
          revealBoxes();
        }, 60);
      }).observe(leistungen, { childList: true, subtree: true });
    }

    var about = document.querySelector("#slide-about");
    if (about) {
      new MutationObserver(function () {
        setTimeout(function () {
          applyAbout();
          revealBoxes();
        }, 60);
      }).observe(about, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.WeltenChapterVisuals = {
    apply: apply,
  };
})();
