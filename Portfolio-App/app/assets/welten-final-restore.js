/**
 * FINAL Restore — Kontakt, Home unter Hero, freistehender Erfahrung-Zeitstrahl
 */
(function () {
  "use strict";

  var TEL = "+41796678211";
  var TEL_DISP = "079 667 82 11";
  var MAIL = "alex.lamberti@hotmail.ch";
  var MAP =
    "https://www.google.com/maps/search/?api=1&query=Schulweg%20603%2C%205324%20Full-Reuenthal%2C%20Schweiz";
  var PLACEHOLDER =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

  var WORLD_INTRO = {
    nexora: "NEXORA · Virtuell · AI · Zukunft",
    vertex: "BUSINESS · Klar · Professionell · Vertrauensvoll",
    freiraum: "FREIRAUM · Kreativ · Emotional · Nahbar",
  };

  function navigateChapter(id) {
    if (window.WeltenSiteIA && typeof window.WeltenSiteIA.navigateToChapter === "function") {
      if (window.WeltenSiteIA.navigateToChapter(id)) return true;
    }
    var el =
      document.querySelector('.experience-step[data-go="' + id + '"]') ||
      document.querySelector('.menu-links a[data-go="' + id + '"]');
    if (el) {
      el.click();
      return true;
    }
    return false;
  }

  function applyPortraits() {
    var IMG = window.PORTFOLIO_INLINE_IMAGES || {};
    var w = document.body.getAttribute("data-world") || "nexora";
    var src = IMG[w] || IMG.general || IMG.nexora || IMG.vertex;
    if (!src) return;
    document
      .querySelectorAll(
        "#heroPhoto, #contactPhoto, .contact-photo, .home-portrait-card .portrait-photo, .welten-portrait-img"
      )
      .forEach(function (img) {
        img.removeAttribute("srcset");
        img.src = src;
        img.style.display = "block";
        img.style.opacity = "1";
      });
  }

  function contactNeedsRebuild(slide) {
    if (!slide) return false;
    if (slide.querySelector(".welten-contact-page")) return true;
    if (!slide.querySelector(".contact-actions") || !slide.querySelector(".contact-visual")) return true;
    if (!slide.querySelector('.contact-actions a[href^="mailto:"]')) return true;
    if (!slide.querySelector('.contact-actions a[href^="tel:"]')) return true;
    if (!slide.querySelector(".contact-actions a[href*='google.com/maps']")) return true;
    return false;
  }

  function restoreContactFinal() {
    var slide = document.querySelector("#slide-contact .slide-inner");
    if (!slide) return;

    if (!contactNeedsRebuild(slide)) {
      slide.className = "slide-inner contact-layout";
      slide.classList.remove("contact-layout--minimal");
      applyPortraits();
      return;
    }

    slide.className = "slide-inner contact-layout";
    slide.dataset.weltenContactV = "final";
    slide.innerHTML =
      '<div class="glass-card" style="padding: clamp(24px, 4vw, 40px);">' +
      '<p class="chapter-label">Kontakt</p>' +
      '<h2 class="section-title">Bereit für den nächsten Schritt.</h2>' +
      '<p class="prose">Ich freue mich auf Möglichkeiten, bei denen ich meine Erfahrung in Markeninszenierung, Kundenkommunikation und digitalem Marketing gezielt einbringen kann. Besonders spannend sind für mich Unternehmen, die Wert auf Qualität, klare Kommunikation, kreative Ideen und eine starke digitale Präsenz legen.</p>' +
      '<p class="prose">Ob Website, Content, Kampagne, Projektkoordination oder Markenauftritt – ich möchte meine Fähigkeiten dort einsetzen, wo sie Wirkung erzeugen und weiter wachsen können.</p>' +
      '<p class="prose" style="font-weight:600;margin-top:0.75rem;">Lassen Sie uns ins Gespräch kommen.</p>' +
      '<p class="prose">Ob Website, Markenauftritt, digitale Sichtbarkeit oder ein konkretes Kundenprojekt: Ich freue mich über den Austausch und reagiere schnell, verbindlich und unkompliziert.</p>' +
      '<p class="prose">Für mich beginnt gute Zusammenarbeit mit Zuhören, Verstehen und einer klaren Einordnung der nächsten Schritte. Deshalb ist der erste Kontakt bewusst einfach gehalten: kurz schreiben, anrufen oder direkt die Adresse öffnen.</p>' +
      '<div class="contact-actions">' +
      '<a href="mailto:' + MAIL + '"><span>E-Mail: ' + MAIL + '</span><span>→</span></a>' +
      '<a href="tel:' + TEL + '"><span>Telefon: ' + TEL_DISP + '</span><span>→</span></a>' +
      '<a href="' +
      MAP +
      '" target="_blank" rel="noopener noreferrer"><span>Adresse: Schulweg 603, 5324 Full-Reuenthal, Schweiz</span><span>→</span></a>' +
      "</div></div>" +
      '<figure class="contact-visual glass-card" aria-label="Kontakt">' +
      '<img class="contact-photo portrait-photo" id="contactPhoto" src="' +
      PLACEHOLDER +
      '" alt="Alex Lamberti" width="600" height="720" decoding="async" loading="lazy" />' +
      "</figure>";

    applyPortraits();
  }

  function injectExperienceTimeline() {
    var about = document.querySelector("#slide-about .slide-inner");
    var exp = document.querySelector("#slide-experience .slide-inner");
    if (!about || !exp) return;

    about.querySelectorAll(".welten-experience-timeline, .experience-section").forEach(function (el) {
      el.remove();
    });

    if (about.querySelector("#experience")) return;

    var wrap = document.createElement("section");
    wrap.className = "experience-section";
    wrap.id = "experience";
    wrap.setAttribute("aria-label", "Erfahrung");

    var heading = document.createElement("div");
    heading.className = "section-heading";
    heading.innerHTML =
      '<p class="chapter-label eyebrow">Erfahrung</p>' +
      '<h2 class="section-title">Stationen, Bildung und Entwicklung</h2>';
    wrap.appendChild(heading);

    var intro = exp.querySelector(".prose");
    if (intro) {
      var introClone = intro.cloneNode(true);
      introClone.classList.add("experience-section__intro");
      wrap.appendChild(introClone);
    }

    exp.querySelectorAll(".exp-block-title, .timeline").forEach(function (el) {
      var clone = el.cloneNode(true);
      if (clone.classList.contains("timeline")) {
        clone.classList.add("timeline--standalone");
      }
      wrap.appendChild(clone);
    });

    about.appendChild(wrap);
  }

  function syncWorldIntro() {
    var w = document.body.getAttribute("data-world") || "nexora";
    var label = document.getElementById("worldIntro");
    if (label && WORLD_INTRO[w]) label.textContent = WORLD_INTRO[w];
  }

  function apply() {
    injectExperienceTimeline();
    syncWorldIntro();
    applyPortraits();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }

  document.addEventListener("welten-chapter-change", function (e) {
    var ch = e && e.detail && e.detail.chapter;
    if (ch === "about") injectExperienceTimeline();
    if (ch === "home") applyPortraits();
  });

  try {
    new MutationObserver(function () {
      syncWorldIntro();
    }).observe(document.body, { attributes: true, attributeFilter: ["data-world"] });
  } catch (e) {}
})();
