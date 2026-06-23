/**
 * MULTIVERSUM Test-Vorschau — nur lokal via chapter-visuals-preview.
 */
(function () {
  "use strict";

  var FX_KEY = "mv-preview-effects";
  var GLOBAL_LOGO = "assets/images/4welten-preview/shared/global-logo.png";

  var CHAPTER_KEYS = [
    "about",
    "kompetenzen",
    "leistungen",
    "projects",
    "contact",
    "erfahrung",
    "werte",
    "faq",
    "cta",
  ];

  var LEISTUNG_KEYS = [
    "strategie",
    "technologie",
    "design",
    "identitaet",
    "ideen",
    "begeisterung",
    "umsetzung",
  ];

  var LEISTUNG_IMG = {
    strategie: "seo",
    technologie: "web",
    design: "layout3d",
    identitaet: "logo",
    ideen: "present",
    begeisterung: "print",
    umsetzung: "form",
  };

  var PROJEKT_KEYS = ["web", "form", "seo", "logo"];

  var FILES = {
    general: {
      profile: "profile.png",
      about: "chapters/01_Ueber_mich_MULTIVERSUM.jpg",
      kompetenzen: "chapters/02_Kompetenzen_Expertise_MULTIVERSUM.jpg",
      leistungen: "chapters/03_Leistungen_MULTIVERSUM.jpg",
      projects: "chapters/04_Projekte_MULTIVERSUM.jpg",
      contact: "chapters/05_Kontakt_MULTIVERSUM.jpg",
      erfahrung: "chapters/06_Erfahrung_Bildung_MULTIVERSUM.jpg",
      werte: "chapters/07_Werte_Arbeitsweise_MULTIVERSUM.jpg",
      faq: "chapters/08_Haeufige_Fragen_MULTIVERSUM.jpg",
      cta: "chapters/09_Bereit_fuer_den_naechsten_Schritt_MULTIVERSUM.jpg",
      hero: "chapters/01_Ueber_mich_MULTIVERSUM.jpg",
      visual: "chapters/03_Leistungen_MULTIVERSUM.jpg",
      logo: "03_html_05_general_logo.webp",
      qr: "04_html_06_general_qr.webp",
      form: "05_html_07_general_form.webp",
      web: "06_html_08_general_web.webp",
      seo: "07_html_09_general_seo.webp",
      print: "08_html_10_general_print.webp",
      layout3d: "09_html_11_general_layout3d.webp",
      present: "10_html_12_general_present.webp",
    },
    nexora: {
      profile: "profile.png",
      about: "01_NEXORA_01_UeberMich.webp",
      kompetenzen: "06_NEXORA_06_KompetenzenExpertise.webp",
      leistungen: "02_NEXORA_02_Leistungen.webp",
      projects: "03_NEXORA_03_Projekte.webp",
      contact: "04_NEXORA_04_Kontakt.webp",
      erfahrung: "07_NEXORA_07_ErfahrungBildung.webp",
      werte: "08_NEXORA_08_WerteArbeitsweise.webp",
      faq: "05_NEXORA_05_HaeufigeFragen.webp",
      cta: "09_NEXORA_09_BereitFuerDenNaechstenSchritt.webp",
      hero: "01_NEXORA_01_UeberMich.webp",
      visual: "03_NEXORA_03_Projekte.webp",
      logo: "11_html_13_nexora_logo.webp",
      qr: "12_html_14_nexora_qr.webp",
      form: "13_html_15_nexora_form.webp",
      web: "14_html_16_nexora_web.webp",
      seo: "15_html_17_nexora_seo.webp",
      print: "16_html_18_nexora_print.webp",
      layout3d: "17_html_19_nexora_layout3d.webp",
      present: "18_html_20_nexora_present.webp",
    },
    professional: {
      profile: "profile.png",
      about: "01_PROFESSIONAL_01_UeberMich.webp",
      kompetenzen: "06_PROFESSIONAL_06_KompetenzenExpertise.webp",
      leistungen: "02_PROFESSIONAL_02_Leistungen.webp",
      projects: "03_PROFESSIONAL_03_Projekte.webp",
      contact: "04_PROFESSIONAL_04_Kontakt.webp",
      erfahrung: "07_PROFESSIONAL_07_ErfahrungBildung.webp",
      werte: "08_PROFESSIONAL_08_WerteArbeitsweise.webp",
      faq: "05_PROFESSIONAL_05_HaeufigeFragen.webp",
      cta: "09_PROFESSIONAL_09_BereitFuerDenNaechstenSchritt.webp",
      hero: "01_PROFESSIONAL_01_UeberMich.webp",
      visual: "03_PROFESSIONAL_03_Projekte.webp",
      logo: "21_html_21_professional_logo.webp",
      qr: "22_html_22_professional_qr.webp",
      form: "23_html_23_professional_form.webp",
      web: "24_html_24_professional_web.webp",
      seo: "25_html_25_professional_seo.webp",
      print: "26_html_26_professional_print.webp",
      layout3d: "27_html_27_professional_layout3d.webp",
      present: "28_html_28_professional_present.webp",
    },
    freiraum: {
      profile: "profile.png",
      about: "01_FREIRAUM_01_UeberMich.webp",
      kompetenzen: "06_FREIRAUM_06_KompetenzenExpertise.webp",
      leistungen: "02_FREIRAUM_02_Leistungen.webp",
      projects: "03_FREIRAUM_03_Projekte.webp",
      contact: "04_FREIRAUM_04_Kontakt.webp",
      erfahrung: "07_FREIRAUM_07_ErfahrungBildung.webp",
      werte: "08_FREIRAUM_08_WerteArbeitsweise.webp",
      faq: "05_FREIRAUM_05_HaeufigeFragen.webp",
      cta: "09_FREIRAUM_09_BereitFuerDenNaechstenSchritt.webp",
      hero: "01_FREIRAUM_01_UeberMich.webp",
      visual: "03_FREIRAUM_03_Projekte.webp",
      logo: "21_html_29_freiraum_logo.webp",
      qr: "22_html_30_freiraum_qr.webp",
      form: "23_html_31_freiraum_form.webp",
      web: "24_html_32_freiraum_web.webp",
      seo: "25_html_33_freiraum_seo.webp",
      print: "26_html_34_freiraum_print.webp",
      layout3d: "27_html_35_freiraum_layout3d.webp",
      present: "28_html_36_freiraum_present.webp",
    },
  };

  var T = {
    de: {
      testNote: "Lokaler MULTIVERSUM-Test — nicht live",
      fx_on: "Effekt ON",
      fx_off: "Effekt OFF",
      nav_home: "Start",
      nav_kapitel: "Kapitel",
      nav_projekte: "Projekte",
      nav_leistungen: "Leistungen",
      nav_kontakt: "Kontakt",
      world_general: "MULTIVERSUM",
      world_nexora: "NEXORA",
      world_professional: "PROFESSIONAL",
      world_freiraum: "FREIRAUM",
      hero_eyebrow: "Portfolio-Test",
      hero_title: "Digitale Welten erleben",
      hero_text:
        "MULTIVERSUM ist der Mix aus NEXORA, PROFESSIONAL und FREIRAUM. Logo-Klick führt immer zurück hierher.",
      kapitel_title: "Unterseiten-Bilder",
      kapitel_text: "9 Einzelbilder für MULTIVERSUM — je Welt passende Kapitel-Grafiken.",
      projekte_title: "Projekte & Referenzen",
      projekte_text: "Ausgewählte Bereiche mit Bildern je Welt.",
      leistungen_title: "Leistungen",
      leistungen_text: "Strategie bis Umsetzung — weltabhängige Optik und Texte.",
      kontakt_title: "Kontakt & Anfrage",
      kontakt_text: "Leadformular reagiert live auf Welt und Sprache.",
      chapter: {
        about: "Über mich",
        kompetenzen: "Kompetenzen / Expertise",
        leistungen: "Leistungen",
        projects: "Projekte",
        contact: "Kontakt",
        erfahrung: "Erfahrung / Bildung",
        werte: "Werte / Arbeitsweise",
        faq: "Häufige Fragen",
        cta: "Bereit für den nächsten Schritt",
      },
      leistung: {
        strategie: "Strategie",
        technologie: "Technologie",
        design: "Design",
        identitaet: "Identität",
        ideen: "Ideen",
        begeisterung: "Begeisterung",
        umsetzung: "Umsetzung",
      },
      leistungDesc: {
        strategie: "Klare Ausrichtung, Ziele und digitale Roadmap.",
        technologie: "Moderne Web-Technologien und skalierbare Lösungen.",
        design: "Visuelles Design mit Wiedererkennungswert.",
        identitaet: "Markenauftritt, Logo und Corporate Design.",
        ideen: "Kreative Konzepte und neue Perspektiven.",
        begeisterung: "Emotionale Markenerlebnisse, die hängen bleiben.",
        umsetzung: "Von der Idee bis zum live gesetzten Ergebnis.",
      },
      projekt: {
        web: "Websites",
        form: "Formulare",
        seo: "SEO",
        logo: "Branding",
      },
      projektDesc: {
        web: "Websites und Landingpages mit klarer Struktur.",
        form: "Lead- und Kontaktformulare mit Logik.",
        seo: "Sichtbarkeit und technische Optimierung.",
        logo: "Logo, CI und visuelle Identität.",
      },
    },
    en: {
      testNote: "Local MULTIVERSE test — not live",
      fx_on: "Effects ON",
      fx_off: "Effects OFF",
      nav_home: "Home",
      nav_kapitel: "Chapters",
      nav_projekte: "Projects",
      nav_leistungen: "Services",
      nav_kontakt: "Contact",
      world_general: "MULTIVERSE",
      world_nexora: "NEXORA",
      world_professional: "PROFESSIONAL",
      world_freiraum: "FREIRAUM",
      hero_eyebrow: "Portfolio test",
      hero_title: "Experience digital worlds",
      hero_text: "The MULTIVERSE blends NEXORA, PROFESSIONAL and FREIRAUM. Logo always returns here.",
      kapitel_title: "Section visuals",
      kapitel_text: "9 images for MULTIVERSE — matching chapter graphics per world.",
      projekte_title: "Projects & references",
      projekte_text: "Selected areas with images per world.",
      leistungen_title: "Services",
      leistungen_text: "Strategy to delivery — world-specific look and copy.",
      kontakt_title: "Contact & inquiry",
      kontakt_text: "Lead form reacts live to world and language.",
      chapter: {
        about: "About me",
        kompetenzen: "Skills / expertise",
        leistungen: "Services",
        projects: "Projects",
        contact: "Contact",
        erfahrung: "Experience / education",
        werte: "Values / approach",
        faq: "FAQ",
        cta: "Ready for the next step",
      },
      leistung: {
        strategie: "Strategy",
        technologie: "Technology",
        design: "Design",
        identitaet: "Identity",
        ideen: "Ideas",
        begeisterung: "Excitement",
        umsetzung: "Delivery",
      },
      leistungDesc: {
        strategie: "Clear direction, goals and digital roadmap.",
        technologie: "Modern web tech and scalable solutions.",
        design: "Visual design with strong recognition.",
        identitaet: "Brand presence, logo and corporate design.",
        ideen: "Creative concepts and fresh perspectives.",
        begeisterung: "Emotional brand experiences that stick.",
        umsetzung: "From idea to live result.",
      },
      projekt: {
        web: "Websites",
        form: "Forms",
        seo: "SEO",
        logo: "Branding",
      },
      projektDesc: {
        web: "Websites and landing pages with clear structure.",
        form: "Lead and contact forms with logic.",
        seo: "Visibility and technical optimisation.",
        logo: "Logo, CI and visual identity.",
      },
    },
    it: {
      testNote: "Test locale MULTIVERSO — non live",
      fx_on: "Effetto ON",
      fx_off: "Effetto OFF",
      nav_home: "Home",
      nav_kapitel: "Capitoli",
      nav_projekte: "Progetti",
      nav_leistungen: "Servizi",
      nav_kontakt: "Contatto",
      world_general: "MULTIVERSO",
      world_nexora: "NEXORA",
      world_professional: "PROFESSIONAL",
      world_freiraum: "FREIRAUM",
      hero_eyebrow: "Test portfolio",
      hero_title: "Esplora mondi digitali",
      hero_text: "Il MULTIVERSO unisce NEXORA, PROFESSIONAL e FREIRAUM. Il logo riporta sempre qui.",
      kapitel_title: "Immagini sezioni",
      kapitel_text: "9 immagini per MULTIVERSO — grafiche capitolo per mondo.",
      projekte_title: "Progetti & referenze",
      projekte_text: "Aree selezionate con immagini per mondo.",
      leistungen_title: "Servizi",
      leistungen_text: "Dalla strategia all'implementazione — look e testi per mondo.",
      kontakt_title: "Contatto & richiesta",
      kontakt_text: "Il modulo reagisce live a mondo e lingua.",
      chapter: {
        about: "Chi sono",
        kompetenzen: "Competenze / expertise",
        leistungen: "Servizi",
        projects: "Progetti",
        contact: "Contatto",
        erfahrung: "Esperienza / formazione",
        werte: "Valori / metodo",
        faq: "Domande frequenti",
        cta: "Pronti per il prossimo passo",
      },
      leistung: {
        strategie: "Strategia",
        technologie: "Tecnologia",
        design: "Design",
        identitaet: "Identità",
        ideen: "Idee",
        begeisterung: "Entusiasmo",
        umsetzung: "Implementazione",
      },
      leistungDesc: {
        strategie: "Direzione chiara, obiettivi e roadmap digitale.",
        technologie: "Tecnologie web moderne e soluzioni scalabili.",
        design: "Design visivo con riconoscibilità.",
        identitaet: "Presenza brand, logo e corporate design.",
        ideen: "Concept creativi e nuove prospettive.",
        begeisterung: "Esperienze di marca emozionali.",
        umsetzung: "Dall'idea al risultato live.",
      },
      projekt: {
        web: "Siti web",
        form: "Moduli",
        seo: "SEO",
        logo: "Branding",
      },
      projektDesc: {
        web: "Siti e landing page con struttura chiara.",
        form: "Moduli lead e contatto con logica.",
        seo: "Visibilità e ottimizzazione tecnica.",
        logo: "Logo, CI e identità visiva.",
      },
    },
  };

  var state = { world: "general", lang: "de", effects: true };
  var switching = false;
  var audioCtx = null;

  function img(world, key) {
    var f = FILES[world] && FILES[world][key];
    if (!f) return "";
    return "assets/images/4welten-preview/" + world + "/" + f;
  }

  function t(key) {
    var pack = T[state.lang] || T.de;
    return pack[key] != null ? pack[key] : T.de[key];
  }

  function tc(key) {
    var pack = T[state.lang] || T.de;
    return (pack.chapter && pack.chapter[key]) || T.de.chapter[key];
  }

  function tl(key) {
    var pack = T[state.lang] || T.de;
    return (pack.leistung && pack.leistung[key]) || T.de.leistung[key];
  }

  function tld(key) {
    var pack = T[state.lang] || T.de;
    return (pack.leistungDesc && pack.leistungDesc[key]) || T.de.leistungDesc[key];
  }

  function tp(key) {
    var pack = T[state.lang] || T.de;
    return (pack.projekt && pack.projekt[key]) || T.de.projekt[key];
  }

  function tpd(key) {
    var pack = T[state.lang] || T.de;
    return (pack.projektDesc && pack.projektDesc[key]) || T.de.projektDesc[key];
  }

  function effectsOn() {
    return state.effects;
  }

  function loadEffectsPref() {
    try {
      var v = localStorage.getItem(FX_KEY);
      state.effects = v !== "0";
    } catch (e) {
      state.effects = true;
    }
  }

  function saveEffectsPref() {
    try {
      localStorage.setItem(FX_KEY, state.effects ? "1" : "0");
    } catch (e) {}
  }

  function ensureAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function resumeAudio() {
    try {
      var ctx = ensureAudio();
      if (ctx.state === "suspended") ctx.resume();
    } catch (e) {}
  }

  function playTone(ctx, t0, opts) {
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    var dur = opts.dur || 0.25;
    o.type = opts.type || "sine";
    o.frequency.setValueAtTime(opts.freq || 440, t0);
    if (opts.freqEnd) o.frequency.exponentialRampToValueAtTime(Math.max(20, opts.freqEnd), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(opts.vol || 0.07, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  }

  function playMultiverseSound() {
    resumeAudio();
    var ctx = ensureAudio();
    var t0 = ctx.currentTime;
    playTone(ctx, t0, { type: "sine", freq: 180, freqEnd: 880, dur: 0.55, vol: 0.09 });
    playTone(ctx, t0 + 0.08, { type: "triangle", freq: 520, freqEnd: 1200, dur: 0.45, vol: 0.06 });
    playTone(ctx, t0 + 0.2, { type: "sine", freq: 960, freqEnd: 240, dur: 0.7, vol: 0.05 });
  }

  function playWorldSound(world) {
    resumeAudio();
    var ctx = ensureAudio();
    var t0 = ctx.currentTime;
    var freqs = { nexora: [440, 660], professional: [220, 330], freiraum: [523, 784], general: [300, 600] };
    var f = freqs[world] || freqs.general;
    playTone(ctx, t0, { type: "sine", freq: f[0], freqEnd: f[1], dur: 0.35, vol: 0.07 });
  }

  function showTransition(nextWorld, fromWorld, done) {
    if (!effectsOn()) {
      done();
      return;
    }
    var overlay = document.getElementById("mv-transition");
    var title = document.getElementById("mv-transition-title");
    if (!overlay) {
      done();
      return;
    }
    var isMv = nextWorld === "general" || fromWorld === "general";
    overlay.classList.toggle("is-multiverse", isMv);
    title.textContent = t("world_" + nextWorld);
    overlay.classList.add("is-active");
    if (isMv) playMultiverseSound();
    else playWorldSound(nextWorld);
    setTimeout(function () {
      overlay.classList.remove("is-active");
      done();
    }, isMv ? 1800 : 1200);
  }

  function syncFormIframe() {
    var frame = document.getElementById("mv-form-frame");
    if (!frame || !frame.contentWindow) return;
    try {
      frame.contentWindow.postMessage(
        { type: "alx-preview-sync", world: state.world, lang: state.lang },
        "*"
      );
    } catch (e) {}
  }

  function applyI18n() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = t(key);
      if (typeof val === "string") el.textContent = val;
    });
    document.documentElement.lang = state.lang;
    var fxBtn = document.getElementById("mv-fx-toggle");
    if (fxBtn) {
      fxBtn.textContent = effectsOn() ? t("fx_on") : t("fx_off");
      fxBtn.setAttribute("aria-pressed", effectsOn() ? "true" : "false");
    }
  }

  function buildCardGrid(gridId, keys, titleFn, descFn, imgKeyFn) {
    var grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = "";
    keys.forEach(function (key) {
      var imgKey = imgKeyFn ? imgKeyFn(key) : key;
      var card = document.createElement("article");
      card.className = "mv-card";
      card.innerHTML =
        '<div class="mv-card-banner" style="background-image:url(\'' +
        img(state.world, imgKey) +
        '\')"></div><div class="mv-card-body"><h3>' +
        titleFn(key) +
        "</h3><p>" +
        descFn(key) +
        "</p></div>";
      grid.appendChild(card);
    });
  }

  function applyWorldVisuals() {
    document.body.dataset.world = state.world;

    var logo = document.getElementById("mv-logo-img");
    if (logo) logo.src = GLOBAL_LOGO;

    document.querySelectorAll(".mv-world-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.world === state.world);
    });

    var profileHome = document.getElementById("mv-profile-home");
    var profileContact = document.getElementById("mv-profile-contact");
    var profileSrc = img(state.world, "profile");
    if (profileHome) profileHome.src = profileSrc;
    if (profileContact) profileContact.src = profileSrc;

    var heroVisual = document.getElementById("mv-hero-visual");
    if (heroVisual) heroVisual.style.backgroundImage = "url('" + img(state.world, "hero") + "')";

    ["mv-projekte-banner", "mv-leistungen-banner", "mv-kontakt-banner"].forEach(function (id, i) {
      var el = document.getElementById(id);
      var keys = ["projects", "leistungen", "contact"];
      if (el) el.style.backgroundImage = "url('" + img(state.world, keys[i]) + "')";
    });

    var worldLabel = document.getElementById("mv-world-label");
    if (worldLabel) worldLabel.textContent = t("world_" + state.world);

    buildCardGrid("mv-kapitel-grid", CHAPTER_KEYS, tc, function () { return t("world_" + state.world); });
    buildCardGrid("mv-projekte-grid", PROJEKT_KEYS, tp, tpd);
    buildCardGrid("mv-leistungen-grid", LEISTUNG_KEYS, tl, tld, function (k) {
      return LEISTUNG_IMG[k] || k;
    });

    applyI18n();
  }

  function setLang(lang) {
    if (!T[lang]) return;
    state.lang = lang;
    document.querySelectorAll(".mv-flag").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
    applyWorldVisuals();
    syncFormIframe();
  }

  function changeWorld(nextWorld, scrollHome) {
    if (switching || nextWorld === state.world) {
      if (scrollHome && nextWorld === state.world && nextWorld === "general") {
        document.getElementById("sec-home").scrollIntoView({ behavior: "smooth" });
      }
      return;
    }
    var from = state.world;
    switching = true;
    resumeAudio();
    showTransition(nextWorld, from, function () {
      state.world = nextWorld;
      applyWorldVisuals();
      syncFormIframe();
      switching = false;
      if (scrollHome) {
        document.getElementById("sec-home").scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  function goToMultiversum() {
    changeWorld("general", true);
  }

  function initNav() {
    var links = document.querySelectorAll(".mv-subnav a");
    links.forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var el = document.getElementById(a.getAttribute("href").slice(1));
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    if ("IntersectionObserver" in window) {
      var ids = ["sec-home", "sec-kapitel", "sec-projekte", "sec-leistungen", "sec-kontakt"];
      var obs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              links.forEach(function (a) {
                a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
              });
            }
          });
        },
        { rootMargin: "-28% 0px -55% 0px", threshold: 0 }
      );
      ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) obs.observe(el);
      });
    }
  }

  function init() {
    loadEffectsPref();

    document.getElementById("mv-logo").addEventListener("click", goToMultiversum);

    document.querySelectorAll(".mv-world-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        changeWorld(btn.dataset.world, false);
      });
    });

    document.getElementById("mv-fx-toggle").addEventListener("click", function () {
      state.effects = !state.effects;
      saveEffectsPref();
      applyI18n();
    });

    document.querySelectorAll(".mv-flag").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLang(btn.dataset.lang);
      });
    });

    initNav();
    applyWorldVisuals();

    window.addEventListener("message", function (e) {
      if (e.data && e.data.type === "alx-form-ready") syncFormIframe();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
