/**
 * Brief content pass — unique chapter copy + primary CTA "Projekt besprechen".
 * No invented facts/stats/testimonials. World tone only where Multiversum concept applies.
 */
(function () {
  "use strict";

  var world = (document.body && document.body.getAttribute("data-world")) || "general";

  var COPY = {
    homeCtaPrimary: "Projekt besprechen",
    homeCtaSecondary: "Projekte ansehen",
    leistungen: {
      label: "Digitale Leistungen",
      title: "Digitale Leistungen mit einer klaren Richtung.",
      intro:
        "Ein guter digitaler Auftritt entsteht nicht durch einzelne Massnahmen, die unabhängig voneinander umgesetzt werden. Gestaltung, Botschaft, Nutzerführung und Technik müssen gemeinsam auf dasselbe Ziel einzahlen. Je nach Ausgangslage begleite ich einzelne Aufgaben oder entwickle eine zusammenhängende Lösung von der ersten Struktur bis zur fertigen Umsetzung.",
    },
    projects: {
      label: "Ausgewählte Projekte",
      title: "Aus Ideen werden konkrete digitale Lösungen.",
      intro:
        "Jedes Projekt besitzt andere Anforderungen. Manchmal steht eine klare Nutzerführung im Vordergrund, manchmal eine neue visuelle Identität oder die Frage, wie ein komplexes Angebot digital verständlich präsentiert werden kann. Die ausgewählten Arbeiten zeigen, wie Strategie, Gestaltung und Umsetzung zusammengeführt wurden.",
    },
    about: {
      label: "Über Alex",
      title: "Kreativität mit Struktur und Verantwortung.",
      intro:
        "Digitale Lösungen interessieren mich dann besonders, wenn Gestaltung, Technologie und eine klare Idee zusammenkommen. Eine Website soll nicht nur visuell auffallen — sie soll verständlich sein, Orientierung schaffen und eine Aufgabe zuverlässig erfüllen.",
      more:
        "Bei meiner Arbeit verbinde ich kreative Offenheit mit einer strukturierten Vorgehensweise. Zuerst geht es darum, die Ausgangslage und das eigentliche Ziel zu verstehen. Erst danach werden Gestaltung, Inhalte und technische Möglichkeiten sinnvoll eingeordnet.",
      multiversum:
        "Das Multiversum auf dieser Website steht für unterschiedliche Perspektiven meiner Arbeit: professionelle Projekte, neue digitale Ideen und freie kreative Experimente. Trotz ihrer Unterschiede folgen alle Bereiche demselben Anspruch — eigenständig denken, bewusst gestalten und sauber umsetzen.",
    },
    contact: {
      label: "Kontakt",
      title: "Lass uns über dein digitales Vorhaben sprechen.",
      intro:
        "Ob bereits eine konkrete Idee besteht oder zunächst Klarheit über die nächsten Schritte benötigt wird: Beschreibe kurz die Ausgangslage und das gewünschte Ziel. Ich melde mich anschliessend mit einer ersten Einschätzung.",
      cta: "Für mich beginnt gute Zusammenarbeit mit Zuhören und einer klaren Einordnung der nächsten Schritte.",
    },
    worldNote: {
      general:
        "MULTIVERSUM zeigt NEXORA, PROFESSIONAL und FREIRAUM als drei Perspektiven mit einer gemeinsamen Handschrift.",
      nexora:
        "In NEXORA steht der Blick auf Systeme, Zukunftsideen und neue digitale Konzepte im Vordergrund — immer mit klarer Struktur.",
      vertex:
        "In PROFESSIONAL stehen konkrete Leistungen, Projekte und ein strukturierter Weg von der Idee bis zur Umsetzung im Fokus.",
      freiraum:
        "In FREIRAUM geht es um kreative Versuche und freie Projekte, bei denen Neugier wichtiger sein darf als ein festgelegtes Ergebnis.",
    },
  };

  function text(el, value) {
    if (el && value) el.textContent = value;
  }

  function firstProse(root) {
    return root ? root.querySelector(".prose") : null;
  }

  function patchChapter(slideId, pack) {
    var slide = document.getElementById(slideId);
    if (!slide) return;
    var inner = slide.querySelector(".slide-inner") || slide;
    var label = inner.querySelector(".chapter-label");
    var title = inner.querySelector("h2.section-title, .section-title");
    text(label, pack.label);
    text(title, pack.title);
    var prose = firstProse(inner);
    if (prose) text(prose, pack.intro);
  }

  function patchAbout() {
    var slide = document.getElementById("slide-about");
    if (!slide) return;
    var inner = slide.querySelector(".slide-inner") || slide;
    var label = inner.querySelector(":scope > .chapter-label, .chapter-label");
    var title = inner.querySelector("h2.section-title");
    text(label, COPY.about.label);
    text(title, COPY.about.title);

    var bodyProse = [];
    inner.querySelectorAll(".prose").forEach(function (p) {
      if (p.closest("[data-welten-about-extra]")) return;
      if (p.closest(".persona-panel, .value-card, .welten-merge-block, .welten-about-merged")) return;
      bodyProse.push(p);
    });
    if (bodyProse[0]) text(bodyProse[0], COPY.about.intro);
    if (bodyProse[1]) text(bodyProse[1], COPY.about.more);
    if (bodyProse[2]) text(bodyProse[2], COPY.about.multiversum);

    var note = COPY.worldNote[world] || COPY.worldNote.general;
    var extraRoot = inner.querySelector("[data-welten-about-extra]");
    if (extraRoot) {
      var extraProse = extraRoot.querySelector(".prose");
      if (extraProse) text(extraProse, note);
      var extraTitle = extraRoot.querySelector("h3.section-title, h3");
      if (extraTitle) {
        if (world === "nexora") text(extraTitle, "NEXORA — Ideen mit System");
        else if (world === "vertex") text(extraTitle, "PROFESSIONAL — Klarheit in der Umsetzung");
        else if (world === "freiraum") text(extraTitle, "FREIRAUM — Raum für Experimente");
        else text(extraTitle, "Drei Perspektiven. Eine gemeinsame Handschrift.");
      }
    }
  }

  function patchContact() {
    var slide = document.getElementById("slide-contact");
    if (!slide) return;
    var inner = slide.querySelector(".slide-inner") || slide;
    if (inner.dataset.weltenBriefContact === "1") return;
    inner.dataset.weltenBriefContact = "1";

    var label = inner.querySelector(".chapter-label");
    var title = inner.querySelector("h2.section-title, .section-title");
    text(label, COPY.contact.label);
    text(title, COPY.contact.title);

    var proses = inner.querySelectorAll(".prose");
    if (proses[0]) text(proses[0], COPY.contact.intro);
    if (proses[1]) text(proses[1], COPY.contact.cta);
    /* Drop redundant long bio paragraphs without inventing replacements */
    for (var i = 2; i < proses.length; i++) {
      if (proses[i].closest(".contact-actions")) continue;
      proses[i].style.display = "none";
    }

    var actions = inner.querySelector(".contact-actions");
    if (actions && !actions.querySelector("[data-brief-cta]")) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-primary";
      btn.setAttribute("data-go", "offerte");
      btn.setAttribute("data-brief-cta", "1");
      btn.textContent = COPY.homeCtaPrimary;
      actions.appendChild(btn);
    }
  }

  function patchHomeCtas() {
    document.querySelectorAll("#slide-home .cta-row").forEach(function (row) {
      var buttons = row.querySelectorAll("button.btn, a.btn");
      if (buttons.length < 1) return;
      var primary = buttons[0];
      var secondary = buttons[1];
      primary.classList.add("btn-primary");
      primary.setAttribute("data-go", "contact");
      primary.textContent = COPY.homeCtaPrimary;
      if (secondary) {
        secondary.classList.remove("btn-primary");
        secondary.setAttribute("data-go", "projects");
        secondary.textContent = COPY.homeCtaSecondary;
      }
    });
  }

  function patchOfferteTitle() {
    var slide = document.getElementById("slide-offerte");
    if (!slide) return;
    var title = slide.querySelector("h2.section-title, .section-title");
    if (title && /Offerte anfragen/i.test(title.textContent || "")) {
      title.textContent = "Projekt besprechen";
    }
  }

  function apply() {
    patchHomeCtas();
    patchChapter("slide-leistungen", COPY.leistungen);
    patchChapter("slide-projects", COPY.projects);
    patchAbout();
    patchContact();
    patchOfferteTitle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(apply, 80);
    });
  } else {
    setTimeout(apply, 80);
  }

  /* Contact may be rebuilt by final-restore after us */
  document.addEventListener("welten-chapter-change", function (e) {
    if (e.detail && e.detail.chapter === "contact") {
      setTimeout(patchContact, 120);
    }
  });

  window.WeltenBriefContent = { apply: apply };
})();
