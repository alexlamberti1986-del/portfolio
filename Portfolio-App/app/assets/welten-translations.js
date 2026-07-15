/**
 * Zentrale Übersetzungen DE / EN / FR / IT
 * Markennamen, Personennamen, E-Mails und Telefonnummern bleiben unverändert.
 */
(function (root) {
  "use strict";

  var LANGS = ["de", "en", "fr", "it"];

  var HTML_LANG = {
    de: "de-CH",
    en: "en",
    fr: "fr",
    it: "it",
  };

  var OG_LOCALE = {
    de: "de_CH",
    en: "en_GB",
    fr: "fr_CH",
    it: "it_CH",
  };

  var translations = {
    de: {
      nav: {
        home: "Home",
        projects: "Projekte",
        leistungen: "Leistungen",
        about: "Über mich",
        contact: "Kontakt",
        offerte: "Offerte",
        menu: "Menü",
        menuClose: "Schliessen",
      },
      shell: {
        bar: "Welten & Steuerung",
        worlds: "Welten wechseln",
        language: "Sprache",
        skipLink: "Zum Hauptinhalt springen",
        loadingAria: "Ladevorgang",
        splashBrand: "Alex Lamberti · Multiversum",
        fxOn: "Effekte: Ein",
        fxOff: "Effekte: Aus",
        fxAriaOn: "Visuelle Effekte deaktivieren",
        fxAriaOff: "Visuelle Effekte aktivieren",
        fxTitle: "Visuelle Effekte und Sound beim Weltenwechsel",
      },
      splash: {
        preparing: "Multiversum wird vorbereitet…",
        loadingAssets: "Assets werden geladen…",
        buildingWorld: "Welt wird aufgebaut…",
        initParallax: "Parallax wird initialisiert…",
        almostDone: "Fast fertig…",
        ready: "Bereit",
        welcome: "Willkommen im Multiversum",
      },
      shellMain: {
        h1: "Alex Lamberti · Multiversum für digitale Welten",
        intro:
          "Digital Marketing, Webdesign und Strategie. Vier Welten. Eine kreative Identität: NEXORA für digitale Zukunft, PROFESSIONAL für Projekte und Zusammenarbeit, FREIRAUM für kreative Ideen und Experimente.",
        navAria: "Welten und Kapitel",
        navMultiversum: "MULTIVERSUM — Start",
        navProjects: "Projekte",
        navServices: "Leistungen",
        navAbout: "Über Alex Lamberti",
        navContact: "Kontakt aufnehmen",
        nexoraDesc: "Die Zukunftswelt für digitale Ideen, Systeme, Visionen und neue Konzepte.",
        professionalDesc: "Projekte, Referenzen, Leistungen und professionelle Zusammenarbeit mit Alex Lamberti.",
        freiraumDesc: "Persönliche Ideen, kreative Experimente und freie Projekte.",
        emailLabel: "E-Mail:",
        phoneLabel: "Tel:",
      },
      seo: {
        home: {
          title: "Alex Lamberti Multiversum für digitale Welten",
          description:
            "Entdecke das Multiversum von Alex Lamberti mit NEXORA, PROFESSIONAL und FREIRAUM. Digital Marketing, Webdesign und Strategie in vier digitalen Welten.",
        },
        projects: {
          title: "Projekte | Alex Lamberti · Websites, Leadformulare & Visitenkarten",
          description:
            "Ausgewählte Projekte von Alex Lamberti: Websites, Leadformulare und digitale Visitenkarten mit klarer Handschrift.",
        },
        leistungen: {
          title: "Leistungen | Alex Lamberti · Branding, Webdesign & Marketing",
          description:
            "Leistungen von Alex Lamberti: Branding, Webdesign, Marketing, Strategie, Content und Website-Optimierung.",
        },
        about: {
          title: "Über mich | Alex Lamberti · Digital Marketing Spezialist",
          description:
            "Wer ist Alex Lamberti? Werdegang, Arbeitsweise, Werte und Kompetenzen im Digital Marketing.",
        },
        contact: {
          title: "Kontakt | Alex Lamberti · Telefon, E-Mail & Standort",
          description:
            "Kontakt zu Alex Lamberti: Telefon 079 667 82 11, E-Mail alex.lamberti@hotmail.ch, Standort Full-Reuenthal.",
        },
        offerte: {
          title: "Offerte | Alex Lamberti · Leistungen & Preisanfrage",
          description:
            "Offerte anfragen: Leistungen wählen und eine klare Einschätzung zu Aufwand und Preis von Alex Lamberti erhalten.",
        },
      },
    },
    en: {
      nav: {
        home: "Home",
        projects: "Projects",
        leistungen: "Services",
        about: "About",
        contact: "Contact",
        offerte: "Offer",
        menu: "Menu",
        menuClose: "Close",
      },
      shell: {
        bar: "Worlds & controls",
        worlds: "Switch worlds",
        language: "Language",
        skipLink: "Skip to main content",
        loadingAria: "Loading",
        splashBrand: "Alex Lamberti · Multiverse",
        fxOn: "Effects: On",
        fxOff: "Effects: Off",
        fxAriaOn: "Disable visual effects",
        fxAriaOff: "Enable visual effects",
        fxTitle: "Visual effects and sound during world transitions",
      },
      splash: {
        preparing: "Preparing the Multiverse…",
        loadingAssets: "Loading assets…",
        buildingWorld: "Building world…",
        initParallax: "Initialising parallax…",
        almostDone: "Almost ready…",
        ready: "Ready",
        welcome: "Welcome to the Multiverse",
      },
      shellMain: {
        h1: "Alex Lamberti · Multiverse for digital worlds",
        intro:
          "Digital marketing, web design and strategy. Four worlds. One creative identity: NEXORA for digital future, PROFESSIONAL for projects and collaboration, FREIRAUM for creative ideas and experiments.",
        navAria: "Worlds and chapters",
        navMultiversum: "MULTIVERSUM — Home",
        navProjects: "Projects",
        navServices: "Services",
        navAbout: "About Alex Lamberti",
        navContact: "Get in touch",
        nexoraDesc: "The future world for digital ideas, systems, visions and new concepts.",
        professionalDesc: "Projects, references, services and professional collaboration with Alex Lamberti.",
        freiraumDesc: "Personal ideas, creative experiments and free projects.",
        emailLabel: "Email:",
        phoneLabel: "Phone:",
      },
      seo: {
        home: {
          title: "Alex Lamberti Multiverse for digital worlds",
          description:
            "Discover the Multiverse by Alex Lamberti with NEXORA, PROFESSIONAL and FREIRAUM. Digital marketing, web design and strategy in four digital worlds.",
        },
        projects: {
          title: "Projects | Alex Lamberti · Websites, lead forms & business cards",
          description:
            "Selected projects by Alex Lamberti: websites, lead forms and digital business cards with a clear signature.",
        },
        leistungen: {
          title: "Services | Alex Lamberti · Branding, web design & marketing",
          description:
            "Services by Alex Lamberti: branding, web design, marketing, strategy, content and website optimisation.",
        },
        about: {
          title: "About me | Alex Lamberti · Digital marketing specialist",
          description:
            "Who is Alex Lamberti? Career path, approach, values and skills in digital marketing.",
        },
        contact: {
          title: "Contact | Alex Lamberti · Phone, email & location",
          description:
            "Contact Alex Lamberti: phone 079 667 82 11, email alex.lamberti@hotmail.ch, location Full-Reuenthal.",
        },
        offerte: {
          title: "Offer | Alex Lamberti · Services & pricing request",
          description:
            "Request an offer: choose services and get a clear estimate of effort and pricing from Alex Lamberti.",
        },
      },
    },
    fr: {
      nav: {
        home: "Accueil",
        projects: "Projets",
        leistungen: "Services",
        about: "À propos",
        contact: "Contact",
        offerte: "Offre",
        menu: "Menu",
        menuClose: "Fermer",
      },
      shell: {
        bar: "Mondes et contrôles",
        worlds: "Changer de monde",
        language: "Langue",
        skipLink: "Aller au contenu principal",
        loadingAria: "Chargement",
        splashBrand: "Alex Lamberti · Multivers",
        fxOn: "Effets : Activés",
        fxOff: "Effets : Désactivés",
        fxAriaOn: "Désactiver les effets visuels",
        fxAriaOff: "Activer les effets visuels",
        fxTitle: "Effets visuels et son lors du changement de monde",
      },
      splash: {
        preparing: "Préparation du Multivers…",
        loadingAssets: "Chargement des ressources…",
        buildingWorld: "Construction du monde…",
        initParallax: "Initialisation du parallax…",
        almostDone: "Presque prêt…",
        ready: "Prêt",
        welcome: "Bienvenue dans le Multivers",
      },
      shellMain: {
        h1: "Alex Lamberti · Multivers pour mondes digitaux",
        intro:
          "Marketing digital, web design et stratégie. Quatre mondes. Une identité créative : NEXORA pour le futur digital, PROFESSIONAL pour les projets et la collaboration, FREIRAUM pour les idées créatives et les expériences.",
        navAria: "Mondes et chapitres",
        navMultiversum: "MULTIVERSUM — Accueil",
        navProjects: "Projets",
        navServices: "Services",
        navAbout: "À propos d'Alex Lamberti",
        navContact: "Prendre contact",
        nexoraDesc: "Le monde du futur pour idées digitales, systèmes, visions et nouveaux concepts.",
        professionalDesc: "Projets, références, services et collaboration professionnelle avec Alex Lamberti.",
        freiraumDesc: "Idées personnelles, expériences créatives et projets libres.",
        emailLabel: "E-mail :",
        phoneLabel: "Tél. :",
      },
      seo: {
        home: {
          title: "Alex Lamberti Multivers pour mondes digitaux",
          description:
            "Découvrez le Multivers d'Alex Lamberti avec NEXORA, PROFESSIONAL et FREIRAUM. Marketing digital, web design et stratégie en quatre mondes digitaux.",
        },
        projects: {
          title: "Projets | Alex Lamberti · Sites web, formulaires lead et cartes de visite",
          description:
            "Projets sélectionnés d'Alex Lamberti : sites web, formulaires lead et cartes de visite digitales avec une identité claire.",
        },
        leistungen: {
          title: "Services | Alex Lamberti · Branding, web design et marketing",
          description:
            "Services d'Alex Lamberti : branding, web design, marketing, stratégie, contenu et optimisation de sites web.",
        },
        about: {
          title: "À propos | Alex Lamberti · Spécialiste marketing digital",
          description:
            "Qui est Alex Lamberti ? Parcours, méthode de travail, valeurs et compétences en marketing digital.",
        },
        contact: {
          title: "Contact | Alex Lamberti · Téléphone, e-mail et adresse",
          description:
            "Contact Alex Lamberti : téléphone 079 667 82 11, e-mail alex.lamberti@hotmail.ch, Full-Reuenthal.",
        },
        offerte: {
          title: "Offre | Alex Lamberti · Prestations et devis",
          description:
            "Demander une offre : choisissez vos prestations et obtenez une estimation claire du travail et du prix.",
        },
      },
    },
    it: {
      nav: {
        home: "Home",
        projects: "Progetti",
        leistungen: "Servizi",
        about: "Chi sono",
        contact: "Contatto",
        offerte: "Offerta",
        menu: "Menu",
        menuClose: "Chiudi",
      },
      shell: {
        bar: "Mondi e controlli",
        worlds: "Cambia mondo",
        language: "Lingua",
        skipLink: "Vai al contenuto principale",
        loadingAria: "Caricamento",
        splashBrand: "Alex Lamberti · Multiverso",
        fxOn: "Effetti: On",
        fxOff: "Effetti: Off",
        fxAriaOn: "Disattiva effetti visivi",
        fxAriaOff: "Attiva effetti visivi",
        fxTitle: "Effetti visivi e audio durante il cambio mondo",
      },
      splash: {
        preparing: "Preparazione del Multiverso…",
        loadingAssets: "Caricamento risorse…",
        buildingWorld: "Costruzione del mondo…",
        initParallax: "Inizializzazione parallax…",
        almostDone: "Quasi pronto…",
        ready: "Pronto",
        welcome: "Benvenuto nel Multiverso",
      },
      shellMain: {
        h1: "Alex Lamberti · Multiverso per mondi digitali",
        intro:
          "Marketing digitale, web design e strategia. Quattro mondi. Un'identità creativa: NEXORA per il futuro digitale, PROFESSIONAL per progetti e collaborazione, FREIRAUM per idee creative e sperimentazioni.",
        navAria: "Mondi e capitoli",
        navMultiversum: "MULTIVERSUM — Home",
        navProjects: "Progetti",
        navServices: "Servizi",
        navAbout: "Chi è Alex Lamberti",
        navContact: "Contattami",
        nexoraDesc: "Il mondo del futuro per idee digitali, sistemi, visioni e nuovi concetti.",
        professionalDesc: "Progetti, referenze, servizi e collaborazione professionale con Alex Lamberti.",
        freiraumDesc: "Idee personali, esperimenti creativi e progetti liberi.",
        emailLabel: "E-mail:",
        phoneLabel: "Tel.:",
      },
      seo: {
        home: {
          title: "Alex Lamberti Multiverso per mondi digitali",
          description:
            "Scopri il Multiverso di Alex Lamberti con NEXORA, PROFESSIONAL e FREIRAUM. Marketing digitale, web design e strategia in quattro mondi digitali.",
        },
        projects: {
          title: "Progetti | Alex Lamberti · Siti web, moduli lead e biglietti da visita",
          description:
            "Progetti selezionati di Alex Lamberti: siti web, moduli lead e biglietti da visita digitali con identità chiara.",
        },
        leistungen: {
          title: "Servizi | Alex Lamberti · Branding, web design e marketing",
          description:
            "Servizi di Alex Lamberti: branding, web design, marketing, strategia, contenuti e ottimizzazione siti web.",
        },
        about: {
          title: "Chi sono | Alex Lamberti · Specialista marketing digitale",
          description:
            "Chi è Alex Lamberti? Percorso, metodo di lavoro, valori e competenze nel marketing digitale.",
        },
        contact: {
          title: "Contatto | Alex Lamberti · Telefono, e-mail e indirizzo",
          description:
            "Contatto Alex Lamberti: telefono 079 667 82 11, e-mail alex.lamberti@hotmail.ch, Full-Reuenthal.",
        },
        offerte: {
          title: "Offerta | Alex Lamberti · Servizi e preventivo",
          description:
            "Richiedi un'offerta: scegli i servizi e ottieni una stima chiara di impegno e prezzo da Alex Lamberti.",
        },
      },
    },
  };

  function getLang() {
    try {
      return localStorage.getItem("mv-preview-lang") || sessionStorage.getItem("mv-preview-lang") || "de";
    } catch (e) {
      return "de";
    }
  }

  function normalizeLang(lang) {
    if (!lang) return "de";
    lang = String(lang).toLowerCase();
    if (LANGS.indexOf(lang) >= 0) return lang;
    if (lang.indexOf("de") === 0) return "de";
    if (lang.indexOf("en") === 0) return "en";
    if (lang.indexOf("fr") === 0) return "fr";
    if (lang.indexOf("it") === 0) return "it";
    return "de";
  }

  function t(key, lang) {
    lang = normalizeLang(lang || getLang());
    var parts = String(key).split(".");
    var node = translations[lang] || translations.de;
    for (var i = 0; i < parts.length; i++) {
      if (!node || typeof node !== "object") return "";
      node = node[parts[i]];
    }
    if (node == null || node === "") {
      node = translations.de;
      for (var j = 0; j < parts.length; j++) {
        if (!node || typeof node !== "object") return "";
        node = node[parts[j]];
      }
    }
    return typeof node === "string" ? node : "";
  }

  function pack(section, lang) {
    lang = normalizeLang(lang || getLang());
    var parts = String(section).split(".");
    var node = translations[lang] || translations.de;
    for (var i = 0; i < parts.length; i++) {
      if (!node) break;
      node = node[parts[i]];
    }
    if (!node) {
      node = translations.de;
      for (var j = 0; j < parts.length; j++) {
        if (!node) break;
        node = node[parts[j]];
      }
    }
    return node;
  }

  function langPack(map, lang) {
    if (!map) return null;
    lang = normalizeLang(lang);
    return map[lang] || map.en || map.de;
  }

  function applyHtmlLang(doc, lang) {
    doc = doc || document;
    lang = normalizeLang(lang);
    doc.documentElement.lang = HTML_LANG[lang] || HTML_LANG.de;
    var main = doc.getElementById("mv-shell-main");
    if (main) main.setAttribute("lang", HTML_LANG[lang] || HTML_LANG.de);
  }

  root.WeltenTranslations = {
    LANGS: LANGS,
    HTML_LANG: HTML_LANG,
    OG_LOCALE: OG_LOCALE,
    translations: translations,
    t: t,
    pack: pack,
    langPack: langPack,
    getLang: getLang,
    normalizeLang: normalizeLang,
    applyHtmlLang: applyHtmlLang,
  };
})(typeof window !== "undefined" ? window : this);
