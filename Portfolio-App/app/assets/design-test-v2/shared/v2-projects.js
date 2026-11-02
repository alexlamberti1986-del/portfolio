/**
 * Shared project accordion for design-test-v2 — mirrors live categories
 * (Websites · Leadformulare · Visitenkarten) with previews.
 */
(function (root) {
  "use strict";

  var P = "/assets/projects/";
  var T = P + "thumbs/";

  var WEBSITES = [
    { title: "Undina Sanitär", href: P + "websites/undina-sanitaer.html", thumb: T + "web-undina-sanitaer.webp", blurb: "Scroll-Website für einen Sanitärbetrieb. Wasser-Look, Videos und ein Badumbau im Vorher-Nachher-Vergleich." },
    { title: "ARDEN Architekten", href: P + "websites/arden-architekten.html", thumb: T + "web-arden-architekten.webp", blurb: "Beim Scrollen betritt man das Haus und sieht, wie es vom Plan bis zum Dach entsteht." },
    { title: "AURON 01", href: P + "websites/auron-01.html", thumb: T + "web-auron-01.webp", blurb: "Produktfilm zum Scrollen: vom Orbit über Zürich in den Showroom und bis ins Cockpit." },
    { title: "Villa Lucea", href: P + "websites/villa-lucea.html", thumb: T + "web-villa-lucea.webp", blurb: "Immobilien-Auftritt für eine Villa am See mit Filmsequenzen, Grundriss und Galerie." },
    { title: "Kinetic Labs", href: P + "websites/kinetic-labs.html", thumb: T + "web-kinetic-labs.webp", blurb: "Agentur-Website mit 3D-Szene. Die Kamera fliegt beim Scrollen von Modul zu Modul." },
    { title: "Dielenhaus", href: P + "websites/dielenhaus.html", thumb: T + "web-dielenhaus.webp", blurb: "Bodenleger-Seite mit 3D-Bodenplatte, die sich beim Scrollen in ihre Schichten zerlegt." },
    { title: "Maison Elva", href: P + "websites/maison-elva.html", thumb: T + "web-maison-elva.webp", blurb: "Coiffeur- und Colour-Studio mit ruhiger Bildsprache und Online-Termin." },
    { title: "Krafthalle", href: P + "websites/krafthalle.html", thumb: T + "web-krafthalle.webp", blurb: "Fitness-Konzept mit Imagefilm, der Bild für Bild mit dem Scrollen läuft." },
    { title: "Studio Olmo", href: P + "websites/studio-olmo.html", thumb: T + "web-studio-olmo.webp", blurb: "Innenarchitektur als Scrollfilm. Ein leerer Raum richtet sich Wisch für Wisch selbst ein." },
    { title: "Soda Zero", href: P + "websites/soda-zero.html", thumb: T + "web-soda-zero.webp", blurb: "Produkt- und Shop-Seite mit schwebender 3D-Dose, die je nach Sorte die Farbe wechselt." },
  ];

  var LEADS = [
    { title: "Undina Sanitär", href: P + "leadformulare/undina-sanitaer.html", thumb: T + "lead-undina-sanitaer.webp", blurb: "Mehrstufiges Anfrageformular für Badumbau, Sanitär und Service." },
    { title: "Movelia Umzüge", href: P + "leadformulare/movelia-umzuege.html", thumb: T + "lead-movelia-umzuege.webp", blurb: "Umzugsformular mit Maskottchen, Live-Richtpreis und Auftragsübersicht." },
    { title: "Klarwerk Reinigungen", href: P + "leadformulare/klarwerk-reinigungen.html", thumb: T + "lead-klarwerk-reinigungen.webp", blurb: "Anfrageformular für Reinigung und Hauswartung, Schritt für Schritt geführt." },
    { title: "NOVA Umzüge", href: P + "leadformulare/nova-umzuege.html", thumb: T + "lead-nova-umzuege.webp", blurb: "Kurzes Offertenformular in drei Schritten, ohne doppelte Angaben." },
    { title: "Glanzwerk Autopflege", href: P + "leadformulare/glanzwerk-autopflege.html", thumb: T + "lead-glanzwerk-autopflege.webp", blurb: "Autopflege-Anfrage mit Paketen, Standortwahl und Richtpreis." },
    { title: "Sauberhof Reinigungen", href: P + "leadformulare/sauberhof-reinigungen.html", thumb: T + "lead-sauberhof-reinigungen.webp", blurb: "Formular für Reinigung, Wäsche und Alltagshilfe mit Terminwunsch." },
  ];

  var CARDS = [
    { title: "ARDEN Architekten", href: P + "visitenkarten/arden-architekten.html", thumb: T + "card-arden-architekten.webp", blurb: "Hochformat mit Blueprint-Linien, ruhig und präzise." },
    { title: "Studio Olmo", href: P + "visitenkarten/studio-olmo.html", thumb: T + "card-studio-olmo.webp", blurb: "Dunkel und warm, mit Bronze und einer Ringleuchte als Motiv." },
    { title: "Kita Sonnenfalter", href: P + "visitenkarten/kita-sonnenfalter.html", thumb: T + "card-kita-sonnenfalter.webp", blurb: "Fröhlich und klar, mit Sonne, Falter und bunten Punkten." },
    { title: "Dielenhaus", href: P + "visitenkarten/dielenhaus.html", thumb: T + "card-dielenhaus.webp", blurb: "Querformat in Eichen-Optik, auf der Rückseite liegen Dielen." },
    { title: "Maison Elva", href: P + "visitenkarten/maison-elva.html", thumb: T + "card-maison-elva.webp", blurb: "Elegant mit Roségold und einem Bogen als Rahmen." },
    { title: "Villa Lucea", href: P + "visitenkarten/villa-lucea.html", thumb: T + "card-villa-lucea.webp", blurb: "Kraftpapier-Look mit einer Linienzeichnung vom Haus am See." },
  ];

  var LABELS = {
    de: { websites: "Websites", leads: "Leadformulare", cards: "Digitale Visitenkarten", open: "Öffnen", preview: "Vorschau", note: "Alle Projekte sind fiktive Demo-Varianten. Namen, Logos und Kontaktdaten sind frei erfunden." },
    en: { websites: "Websites", leads: "Lead forms", cards: "Digital business cards", open: "Open", preview: "Preview", note: "All projects are fictional demos. Names, logos and contact details are made up." },
    fr: { websites: "Sites web", leads: "Formulaires lead", cards: "Cartes de visite numériques", open: "Ouvrir", preview: "Aperçu", note: "Tous les projets sont des démos fictives. Noms, logos et coordonnées sont inventés." },
    it: { websites: "Siti web", leads: "Moduli lead", cards: "Biglietti da visita digitali", open: "Apri", preview: "Anteprima", note: "Tutti i progetti sono demo fittizie. Nomi, loghi e contatti sono inventati." },
  };

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

  function labels() {
    return LABELS[lang()] || LABELS.de;
  }

  function cardHtml(item, external) {
    var src = item.href;
    var name = item.title.replace(/"/g, "");
    var preview = item.thumb
      ? '<a class="v2-project-card__thumb" href="' + src + '" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true">' +
        '<img src="' + item.thumb + '" alt="' + labels().preview + ": " + name + '" width="960" height="600" loading="lazy" decoding="async"></a>'
      : '<iframe title="' + name + '" loading="lazy" data-v2-lazy-src="' + src + '" src="about:blank"></iframe>';
    return (
      '<article class="v2-project-card">' +
      '<div class="v2-project-card__preview">' +
      preview +
      "</div>" +
      "<h3>" +
      item.title +
      "</h3>" +
      "<p>" +
      item.blurb +
      "</p>" +
      '<a class="v2-project-card__open" href="' +
      src +
      '" target="_blank" rel="noopener noreferrer">' +
      labels().open +
      " →</a>" +
      "</article>"
    );
  }

  function categoryHtml(key, title, items) {
    return (
      '<div class="v2-projects-acc__item" data-category="' +
      key +
      '">' +
      '<button type="button" class="v2-projects-acc__trigger" aria-expanded="false">' +
      "<span>" +
      title +
      "</span><span aria-hidden=\"true\">+</span>" +
      "</button>" +
      '<div class="v2-projects-acc__panel" hidden>' +
      '<div class="v2-projects-acc__grid">' +
      items.map(cardHtml).join("") +
      "</div></div></div>"
    );
  }

  function ensureStyles() {
    if (root.document.getElementById("v2-projects-css")) return;
    var link = root.document.createElement("link");
    link.id = "v2-projects-css";
    link.rel = "stylesheet";
    link.href = "/assets/design-test-v2/shared/v2-projects.css?v=20261102demo1";
    root.document.head.appendChild(link);
  }

  function activateIframes(panel) {
    panel.querySelectorAll("iframe[data-v2-lazy-src]").forEach(function (f) {
      if (f.getAttribute("src") === "about:blank" || !f.getAttribute("src")) {
        f.src = f.getAttribute("data-v2-lazy-src");
      }
    });
  }

  function bindAccordion(rootEl) {
    rootEl.querySelectorAll(".v2-projects-acc__trigger").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.closest(".v2-projects-acc__item");
        var panel = item.querySelector(".v2-projects-acc__panel");
        var open = btn.getAttribute("aria-expanded") === "true";
        rootEl.querySelectorAll(".v2-projects-acc__item").forEach(function (other) {
          var b = other.querySelector(".v2-projects-acc__trigger");
          var p = other.querySelector(".v2-projects-acc__panel");
          if (b) b.setAttribute("aria-expanded", "false");
          if (p) p.hidden = true;
          other.classList.remove("is-open");
        });
        if (!open) {
          btn.setAttribute("aria-expanded", "true");
          panel.hidden = false;
          item.classList.add("is-open");
          activateIframes(panel);
        }
      });
    });
  }

  function mount(el) {
    if (!el || el.__v2ProjectsMounted) return;
    el.__v2ProjectsMounted = true;
    ensureStyles();
    var L = labels();
    el.innerHTML =
      '<div class="v2-projects-acc" data-v2-projects-acc>' +
      '<p class="v2-projects-acc__note">' + L.note + "</p>" +
      categoryHtml("websites", L.websites, WEBSITES) +
      categoryHtml("leads", L.leads, LEADS) +
      categoryHtml("cards", L.cards, CARDS) +
      "</div>";
    bindAccordion(el);
    /* All categories closed until the visitor opens one */
  }

  function mountAll() {
    root.document.querySelectorAll("[data-v2-projects]").forEach(mount);
  }

  function remountOnLang() {
    root.document.querySelectorAll("[data-v2-projects]").forEach(function (el) {
      el.__v2ProjectsMounted = false;
      mount(el);
    });
  }

  root.WeltenDesignTestV2Projects = { mountAll: mountAll, remountOnLang: remountOnLang };

  if (root.document.readyState === "loading") {
    root.document.addEventListener("DOMContentLoaded", mountAll);
  } else {
    mountAll();
  }

  root.addEventListener("v2-lang-change", remountOnLang);
})(typeof window !== "undefined" ? window : this);
