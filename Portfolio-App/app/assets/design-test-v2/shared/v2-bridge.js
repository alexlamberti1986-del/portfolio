/**
 * Shared bridge for design-test-v2 world frames → parent shell.
 * Language: shell flags only (mv-preview-lang). No duplicate lang/music/FX in iframes.
 */
(function (root) {
  "use strict";

  var LANG_KEY = "mv-preview-lang";
  var LANG_KEY_ALT = "mv-lang";

  /* Shared UI strings + per-world hero overlays applied in applyI18n */
  var I18N = {
    de: {
      "nav.home": "Home",
      "nav.projects": "Projekte",
      "nav.services": "Leistungen",
      "nav.about": "Über mich",
      "nav.contact": "Kontakt",
      "nav.offer": "Offerte",
      "cta.projects": "Projekte ansehen",
      "cta.contact": "Kontakt aufnehmen",
      "cta.talk": "Lass uns sprechen",
      "cta.offer": "Zur Offerte",
      "cta.email": "E-Mail schreiben",
      "cta.worlds": "Welten entdecken",
      "offerte.kicker": "Offerte",
      "offerte.title": "Kostenlose Projektanfrage",
      "offerte.lead": "Marketing, Website und Wachstum sauber planen — klare Offerte in wenigen Schritten.",
      "offerte.contact": "Lieber zuerst Kontakt?",
      "contact.title": "Bereit für den nächsten Schritt.",
      "contact.lead": "Ich freue mich auf den Austausch zu Website, Markenauftritt oder Sichtbarkeit — schnell, verbindlich und unkompliziert.",
    },
    en: {
      "nav.home": "Home",
      "nav.projects": "Projects",
      "nav.services": "Services",
      "nav.about": "About",
      "nav.contact": "Contact",
      "nav.offer": "Offer",
      "cta.projects": "View projects",
      "cta.contact": "Get in touch",
      "cta.talk": "Let's talk",
      "cta.offer": "Request an offer",
      "cta.email": "Send email",
      "cta.worlds": "Explore worlds",
      "offerte.kicker": "Offer",
      "offerte.title": "Free project enquiry",
      "offerte.lead": "Plan marketing, website and growth clearly — a clear offer in a few steps.",
      "offerte.contact": "Prefer contact first?",
      "contact.title": "Ready for the next step.",
      "contact.lead": "I look forward to talking about website, brand presence or visibility — quickly, reliably and simply.",
    },
    fr: {
      "nav.home": "Accueil",
      "nav.projects": "Projets",
      "nav.services": "Services",
      "nav.about": "À propos",
      "nav.contact": "Contact",
      "nav.offer": "Offre",
      "cta.projects": "Voir les projets",
      "cta.contact": "Me contacter",
      "cta.talk": "Échangeons",
      "cta.offer": "Demander une offre",
      "cta.email": "Écrire un e-mail",
      "cta.worlds": "Découvrir les mondes",
      "offerte.kicker": "Offre",
      "offerte.title": "Demande de projet gratuite",
      "offerte.lead": "Planifier marketing, site et croissance — une offre claire en quelques étapes.",
      "offerte.contact": "Préférer d'abord le contact ?",
      "contact.title": "Prêt pour la prochaine étape.",
      "contact.lead": "Je me réjouis d'échanger sur site web, marque ou visibilité — rapidement et simplement.",
    },
    it: {
      "nav.home": "Home",
      "nav.projects": "Progetti",
      "nav.services": "Servizi",
      "nav.about": "Su di me",
      "nav.contact": "Contatto",
      "nav.offer": "Offerta",
      "cta.projects": "Vedi progetti",
      "cta.contact": "Contattami",
      "cta.talk": "Parliamone",
      "cta.offer": "Richiedi offerta",
      "cta.email": "Scrivi e-mail",
      "cta.worlds": "Scopri i mondi",
      "offerte.kicker": "Offerta",
      "offerte.title": "Richiesta progetto gratuita",
      "offerte.lead": "Pianifica marketing, sito e crescita — un'offerta chiara in pochi passi.",
      "offerte.contact": "Preferisci prima il contatto?",
      "contact.title": "Pronto per il prossimo passo.",
      "contact.lead": "Sono lieto di parlare di sito, brand o visibilità — in modo rapido e semplice.",
    },
  };

  var HERO = {
    multiversum: {
      de: {
        "hero.intro": "MULTIVERSUM · Mix · Strategie · Begeisterung",
        "hero.title": "Digitale Welten. Ein Portfolio.<br /><em>Unendliche</em> Möglichkeiten.",
        "hero.lead": "Vier Welten. Ein Auftritt. Die passende Wirkung für jedes Vorhaben.",
        "menu.home": "Universum",
        "menu.services": "Nexus",
        "menu.projects": "Werke",
        "menu.about": "Profil",
        "menu.contact": "Signal",
        "menu.offer": "Offerte",
        "menu.galaxy": "Galaxy Walk",
        "cta.projects": "Werke ansehen",
        "cta.contact": "Signal senden",
        "offerte.contact": "Lieber zuerst Signal?",
      },
      en: {
        "hero.intro": "MULTIVERSE · Mix · Strategy · Excitement",
        "hero.title": "Digital worlds. One portfolio.<br /><em>Endless</em> possibilities.",
        "hero.lead": "Four worlds. One presence. The right impact for every project.",
        "menu.home": "Universe",
        "menu.services": "Nexus",
        "menu.projects": "Works",
        "menu.about": "Profile",
        "menu.contact": "Signal",
        "menu.offer": "Offer",
        "menu.galaxy": "Galaxy Walk",
        "cta.projects": "View works",
        "cta.contact": "Send signal",
        "offerte.contact": "Prefer Signal first?",
      },
      fr: {
        "hero.intro": "MULTIVERS · Mix · Stratégie · Enthousiasme",
        "hero.title": "Mondes numériques. Un portfolio.<br /><em>Des possibilités</em> infinies.",
        "hero.lead": "Quatre mondes. Une présence. L'effet juste pour chaque projet.",
        "menu.home": "Univers",
        "menu.services": "Nexus",
        "menu.projects": "Œuvres",
        "menu.about": "Profil",
        "menu.contact": "Signal",
        "menu.offer": "Offre",
        "menu.galaxy": "Galaxy Walk",
        "cta.projects": "Voir les œuvres",
        "cta.contact": "Envoyer un signal",
        "offerte.contact": "Préférer d'abord Signal ?",
      },
      it: {
        "hero.intro": "MULTIVERSO · Mix · Strategia · Entusiasmo",
        "hero.title": "Mondi digitali. Un portfolio.<br /><em>Infinite</em> possibilità.",
        "hero.lead": "Quattro mondi. Una presenza. L'impatto giusto per ogni progetto.",
        "menu.home": "Universo",
        "menu.services": "Nexus",
        "menu.projects": "Opere",
        "menu.about": "Profilo",
        "menu.contact": "Segnale",
        "menu.offer": "Offerta",
        "menu.galaxy": "Galaxy Walk",
        "cta.projects": "Vedi opere",
        "cta.contact": "Invia segnale",
        "offerte.contact": "Preferisci prima Segnale?",
      },
    },
    nexora: {
      de: {
        "hero.intro": "NEXORA · Virtuell · AI · Zukunft",
        "hero.title": "Digital Marketing zwischen Strategie, Technologie und Zukunft.",
        "hero.lead": "Strategie wird sichtbar. Technologie wird menschlich. Marketing wird wirksam.",
        "menu.home": "System",
        "menu.services": "Module",
        "menu.projects": "Cases",
        "menu.about": "Core",
        "menu.contact": "Uplink",
        "menu.offer": "Offerte",
        "cta.projects": "Cases ansehen",
        "cta.contact": "Uplink öffnen",
        "offerte.contact": "Lieber zuerst Uplink?",
      },
      en: {
        "hero.intro": "NEXORA · Virtual · AI · Future",
        "hero.title": "Digital marketing between strategy, technology and the future.",
        "hero.lead": "Strategy becomes visible. Technology becomes human. Marketing becomes effective.",
        "menu.home": "System",
        "menu.services": "Modules",
        "menu.projects": "Cases",
        "menu.about": "Core",
        "menu.contact": "Uplink",
        "menu.offer": "Offer",
        "cta.projects": "View cases",
        "cta.contact": "Open uplink",
        "offerte.contact": "Prefer Uplink first?",
      },
      fr: {
        "hero.intro": "NEXORA · Virtuel · AI · Futur",
        "hero.title": "Marketing digital entre stratégie, technologie et avenir.",
        "hero.lead": "La stratégie devient visible. La technologie devient humaine. Le marketing devient efficace.",
        "menu.home": "Système",
        "menu.services": "Modules",
        "menu.projects": "Cases",
        "menu.about": "Core",
        "menu.contact": "Uplink",
        "menu.offer": "Offre",
        "cta.projects": "Voir les cases",
        "cta.contact": "Ouvrir l'uplink",
        "offerte.contact": "Préférer d'abord Uplink ?",
      },
      it: {
        "hero.intro": "NEXORA · Virtuale · AI · Futuro",
        "hero.title": "Digital marketing tra strategia, tecnologia e futuro.",
        "hero.lead": "La strategia diventa visibile. La tecnologia diventa umana. Il marketing diventa efficace.",
        "menu.home": "Sistema",
        "menu.services": "Moduli",
        "menu.projects": "Cases",
        "menu.about": "Core",
        "menu.contact": "Uplink",
        "menu.offer": "Offerta",
        "cta.projects": "Vedi cases",
        "cta.contact": "Apri uplink",
        "offerte.contact": "Preferisci prima Uplink?",
      },
    },
    professional: {
      de: {
        "hero.intro": "PROFESSIONAL · Klar · Professionell · Vertrauensvoll",
        "hero.title": "Digital Marketing mit Klarheit, Verantwortung und Wirkung.",
        "hero.lead": "Klar denken. Verlässlich handeln. Professionell Wirkung schaffen.",
        "menu.home": "Studio",
        "menu.services": "Mandate",
        "menu.projects": "Referenzen",
        "menu.about": "Haltung",
        "menu.contact": "Gespräch",
        "menu.offer": "Offerte",
        "cta.projects": "Referenzen ansehen",
        "cta.contact": "Gespräch starten",
        "offerte.contact": "Lieber zuerst Gespräch?",
      },
      en: {
        "hero.intro": "PROFESSIONAL · Clear · Professional · Trustworthy",
        "hero.title": "Digital marketing with clarity, responsibility and impact.",
        "hero.lead": "Think clearly. Act reliably. Create professional impact.",
        "menu.home": "Studio",
        "menu.services": "Mandates",
        "menu.projects": "References",
        "menu.about": "Stance",
        "menu.contact": "Talk",
        "menu.offer": "Offer",
        "cta.projects": "View references",
        "cta.contact": "Start a talk",
        "offerte.contact": "Prefer Talk first?",
      },
      fr: {
        "hero.intro": "PROFESSIONAL · Clair · Professionnel · Fiable",
        "hero.title": "Marketing digital avec clarté, responsabilité et impact.",
        "hero.lead": "Penser clairement. Agir de façon fiable. Créer un impact professionnel.",
        "menu.home": "Studio",
        "menu.services": "Mandats",
        "menu.projects": "Références",
        "menu.about": "Posture",
        "menu.contact": "Échange",
        "menu.offer": "Offre",
        "cta.projects": "Voir les références",
        "cta.contact": "Démarrer l'échange",
        "offerte.contact": "Préférer d'abord l'échange ?",
      },
      it: {
        "hero.intro": "PROFESSIONAL · Chiaro · Professionale · Affidabile",
        "hero.title": "Digital marketing con chiarezza, responsabilità e impatto.",
        "hero.lead": "Pensare con chiarezza. Agire in modo affidabile. Creare impatto professionale.",
        "menu.home": "Studio",
        "menu.services": "Mandati",
        "menu.projects": "Referenze",
        "menu.about": "Atteggiamento",
        "menu.contact": "Colloquio",
        "menu.offer": "Offerta",
        "cta.projects": "Vedi referenze",
        "cta.contact": "Avvia colloquio",
        "offerte.contact": "Preferisci prima il colloquio?",
      },
    },
    freiraum: {
      de: {
        "hero.intro": "FREIRAUM · Kreativität · Identität · Storytelling",
        "hero.title": "Digital Marketing mit Kreativität, Persönlichkeit und Gefühl für Marken.",
        "hero.lead": "Ideen brauchen Raum. Marken brauchen Charakter. Marketing braucht Gefühl.",
        "menu.home": "Atelier",
        "menu.services": "Disziplinen",
        "menu.projects": "Collage",
        "menu.about": "Portrait",
        "menu.contact": "Impuls",
        "menu.offer": "Offerte",
        "cta.projects": "Collage ansehen",
        "cta.contact": "Impuls senden",
        "cta.talk": "Impuls senden",
        "offerte.contact": "Lieber zuerst Impuls?",
      },
      en: {
        "hero.intro": "FREIRAUM · Creativity · Identity · Storytelling",
        "hero.title": "Digital marketing with creativity, personality and a feel for brands.",
        "hero.lead": "Ideas need space. Brands need character. Marketing needs feeling.",
        "menu.home": "Atelier",
        "menu.services": "Disciplines",
        "menu.projects": "Collage",
        "menu.about": "Portrait",
        "menu.contact": "Impulse",
        "menu.offer": "Offer",
        "cta.projects": "View collage",
        "cta.contact": "Send impulse",
        "cta.talk": "Send impulse",
        "offerte.contact": "Prefer Impulse first?",
      },
      fr: {
        "hero.intro": "FREIRAUM · Créativité · Identité · Storytelling",
        "hero.title": "Marketing digital avec créativité, personnalité et sens des marques.",
        "hero.lead": "Les idées ont besoin d'espace. Les marques ont besoin de caractère. Le marketing a besoin de sentiment.",
        "menu.home": "Atelier",
        "menu.services": "Disciplines",
        "menu.projects": "Collage",
        "menu.about": "Portrait",
        "menu.contact": "Impulsion",
        "menu.offer": "Offre",
        "cta.projects": "Voir la collage",
        "cta.contact": "Envoyer une impulsion",
        "cta.talk": "Envoyer une impulsion",
        "offerte.contact": "Préférer d'abord l'impulsion ?",
      },
      it: {
        "hero.intro": "FREIRAUM · Creatività · Identità · Storytelling",
        "hero.title": "Digital marketing con creatività, personalità e sensibilità per i brand.",
        "hero.lead": "Le idee hanno bisogno di spazio. I brand hanno bisogno di carattere. Il marketing ha bisogno di sentimento.",
        "menu.home": "Atelier",
        "menu.services": "Discipline",
        "menu.projects": "Collage",
        "menu.about": "Ritratto",
        "menu.contact": "Impulso",
        "menu.offer": "Offerta",
        "cta.projects": "Vedi collage",
        "cta.contact": "Invia impulso",
        "cta.talk": "Invia impulso",
        "offerte.contact": "Preferisci prima Impulso?",
      },
    },
  };

  function getLang() {
    try {
      return root.localStorage.getItem(LANG_KEY) || root.localStorage.getItem(LANG_KEY_ALT) || "de";
    } catch (e) {
      return "de";
    }
  }

  function setLang(lang) {
    lang = ["de", "en", "fr", "it"].indexOf(lang) >= 0 ? lang : "de";
    try {
      root.localStorage.setItem(LANG_KEY, lang);
      root.localStorage.setItem(LANG_KEY_ALT, lang);
    } catch (e) {}
    return lang;
  }

  function worldKey(doc) {
    doc = doc || root.document;
    var w = (doc.documentElement.getAttribute("data-world") || "").toLowerCase();
    if (w === "vertex") return "professional";
    if (HERO[w]) return w;
    return "multiversum";
  }

  function packFor(lang, doc) {
    var base = Object.assign({}, I18N[lang] || I18N.de);
    var hero = (HERO[worldKey(doc)] || {})[lang] || (HERO[worldKey(doc)] || {}).de || {};
    return Object.assign(base, hero);
  }

  function post(type, detail) {
    try {
      var payload = { source: "design-test-v2", type: type, detail: detail || {} };
      if (root.parent && root.parent !== root) {
        root.parent.postMessage(payload, "*");
      }
      root.dispatchEvent(new CustomEvent("v2-bridge", { detail: payload }));
    } catch (e) {}
  }

  function applyI18n(doc, lang) {
    doc = doc || root.document;
    lang = lang || getLang();
    var pack = packFor(lang, doc);
    doc.documentElement.setAttribute("data-lang", lang);
    doc.documentElement.setAttribute("lang", lang === "de" ? "de-CH" : lang);
    doc.querySelectorAll("[data-i18n-v2]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-v2");
      if (pack[key]) el.textContent = pack[key];
    });
    doc.querySelectorAll("[data-i18n-v2-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-v2-html");
      if (pack[key]) el.innerHTML = pack[key];
    });
    doc.querySelectorAll("[data-v2-lang-pill]").forEach(function (el) {
      el.textContent = "CH-" + String(lang).toUpperCase();
    });
    try {
      root.dispatchEvent(new CustomEvent("v2-lang-change", { detail: { lang: lang } }));
    } catch (e) {}
    syncOfferteLang(doc, lang);
  }

  /** Never reload the heavy offer form — only click its internal lang button. */
  function syncOfferteLang(doc, lang) {
    var frame = doc.getElementById("offerteFrame");
    if (!frame) return;
    try {
      var fd = frame.contentDocument;
      if (!fd) return;
      var btn = fd.querySelector('.lang-btn[data-lang="' + lang + '"]');
      if (btn && !btn.classList.contains("active")) btn.click();
    } catch (e) {}
  }

  function worldBase() {
    var worlds = ["multiversum", "nexora", "professional", "freiraum"];
    var prefix = "";
    try {
      if (
        root.parent &&
        root.parent.WeltenDesignTestV2Path &&
        typeof root.parent.WeltenDesignTestV2Path.publicPrefix === "function"
      ) {
        prefix = root.parent.WeltenDesignTestV2Path.publicPrefix() || "";
      } else if (
        root.WeltenDesignTestV2Path &&
        typeof root.WeltenDesignTestV2Path.publicPrefix === "function"
      ) {
        prefix = root.WeltenDesignTestV2Path.publicPrefix() || "";
      }
    } catch (e) {}
    try {
      var p = "";
      if (root.parent && root.parent !== root) {
        p = String(root.parent.location.pathname || "").toLowerCase();
      } else {
        p = String(root.location.pathname || "").toLowerCase();
      }
      for (var i = 0; i < worlds.length; i++) {
        if (
          p.indexOf("/design-test-v2/" + worlds[i]) === 0 ||
          p.indexOf("/" + worlds[i]) === 0
        ) {
          return (prefix || "") + "/" + worlds[i];
        }
      }
    } catch (e2) {}
    return (prefix || "") + "/multiversum";
  }

  function fixLinks(doc) {
    doc = doc || root.document;
    var base = worldBase();
    /* Offerte = in-page section */
    doc.querySelectorAll('a[href*="offerte"]').forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (href.indexOf("alx-offerte") !== -1) return;
      if (href.charAt(0) === "#") return;
      if (/^https?:/i.test(href)) return;
      a.setAttribute("href", "#offerte");
      a.removeAttribute("target");
    });
    /* Explizite Shell-Kontakt-CTAs (nicht In-Page-Anker) */
    doc.querySelectorAll('[data-v2-goto="contact"], [data-v2-contact]').forEach(function (a) {
      a.setAttribute("href", base + "/kontakt#kontakt");
      a.setAttribute("target", "_top");
    });
    var contact =
      doc.getElementById("kontakt") ||
      doc.getElementById("contact") ||
      doc.querySelector("[data-v2-section=contact], .nx-contact, .fr-contact");
    if (contact && contact.id !== "kontakt") contact.id = "kontakt";
  }

  function parentPathChapter() {
    try {
      if (!root.parent || root.parent === root) return "";
      var p = String(root.parent.location.pathname || "").toLowerCase();
      if (/\/offerte\/?$/.test(p)) return "offerte";
      if (/\/(kontakt|contact|signal|uplink|gespraech|gespräch|impuls)\/?$/.test(p)) return "contact";
      if (/\/(projekte|projects|werke|cases|referenzen|collage)\/?$/.test(p)) return "projects";
      if (/\/(leistungen|nexus|module|mandate|disziplinen)\/?$/.test(p)) return "leistungen";
      if (/\/(ueber-mich|about|profil|core|haltung|portrait)\/?$/.test(p)) return "about";
    } catch (e) {}
    return "";
  }

  function scrollToHash() {
    var hash = (root.location.hash || "").replace(/^#/, "");
    if (!hash) {
      var path = (root.location.pathname || "").toLowerCase();
      if (/\/offerte\/?$/.test(path)) hash = "offerte";
      if (/\/kontakt\/?$/.test(path) || /\/contact\/?$/.test(path)) hash = "kontakt";
      if (/\/projekte\/?$/.test(path) || /\/projects\/?$/.test(path)) {
        hash = docHas(root.document, "werke")
          ? "werke"
          : docHas(root.document, "projects")
            ? "projects"
            : docHas(root.document, "collage")
              ? "collage"
              : "projekte";
      }
      if (/\/leistungen\/?$/.test(path)) {
        hash = docHas(root.document, "services")
          ? "services"
          : docHas(root.document, "skills")
            ? "skills"
            : "leistungen";
      }
      if (/\/ueber-mich\/?$/.test(path) || /\/about\/?$/.test(path)) {
        hash = docHas(root.document, "alex")
          ? "alex"
          : docHas(root.document, "about")
            ? "about"
            : docHas(root.document, "experience")
              ? "experience"
              : docHas(root.document, "values")
                ? "values"
                : "ueber-mich";
      }
    }
    if (!hash) {
      var fromParent = parentPathChapter();
      if (fromParent === "offerte") hash = "offerte";
      else if (fromParent) {
        goChapter(fromParent);
        return;
      }
    }
    if (!hash) return;
    if (hash === "offerte") {
      goChapter("offerte");
      return;
    }
    var el =
      root.document.getElementById(hash) ||
      root.document.getElementById(hash === "kontakt" ? "contact" : hash) ||
      root.document.querySelector('[data-v2-section="' + hash + '"]');
    if (el && el.scrollIntoView) {
      try {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (e) {
        el.scrollIntoView(true);
      }
    }
  }

  function docHas(doc, id) {
    return !!(doc && doc.getElementById(id));
  }

  function sectionForChapter(chapter) {
    var doc = root.document;
    if (chapter === "offerte") return "offerte";
    if (chapter === "projects" || chapter === "projekte") {
      if (doc.getElementById("werke")) return "werke";
      if (doc.getElementById("projects")) return "projects";
      if (doc.getElementById("collage")) return "collage";
      return "projects";
    }
    if (chapter === "contact" || chapter === "kontakt") {
      return doc.getElementById("kontakt") ? "kontakt" : "contact";
    }
    if (chapter === "about" || chapter === "ueber-mich") {
      if (doc.getElementById("alex")) return "alex";
      if (doc.getElementById("about")) return "about";
      if (doc.getElementById("experience")) return "experience";
      if (doc.getElementById("values")) return "values";
      return "about";
    }
    if (chapter === "leistungen") {
      if (doc.getElementById("services")) return "services";
      if (doc.getElementById("skills")) return "skills";
      return "leistungen";
    }
    if (chapter === "home") return "main";
    return chapter;
  }

  function goChapter(chapter) {
    if (!chapter || chapter === "home") {
      try {
        root.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e) {
        root.scrollTo(0, 0);
      }
      return;
    }
    if (chapter === "offerte") {
      if (root.WeltenV2Offerte && typeof root.WeltenV2Offerte.scrollTo === "function") {
        root.WeltenV2Offerte.scrollTo();
        return;
      }
      var offer = root.document.getElementById("offerte");
      if (offer && offer.scrollIntoView) {
        try {
          offer.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (eOff) {
          offer.scrollIntoView(true);
        }
      }
      return;
    }
    var id = sectionForChapter(chapter);
    var el = id && (root.document.getElementById(id) || root.document.querySelector('[data-v2-section="' + id + '"]'));
    if (el && el.scrollIntoView) {
      try {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (e2) {
        el.scrollIntoView(true);
      }
    }
  }

  function chapterFromHashOrId(id) {
    id = String(id || "").replace(/^#/, "").toLowerCase();
    if (!id || id === "hero" || id === "main") return "home";
    if (id === "offerte") return "offerte";
    if (id === "werke" || id === "projects" || id === "collage" || id === "projekte") return "projects";
    if (id === "leistungen" || id === "services" || id === "skills" || id === "nexus") return "leistungen";
    if (id === "alex" || id === "about" || id === "experience" || id === "values" || id === "ueber-mich") return "about";
    if (id === "kontakt" || id === "contact") return "contact";
    return "";
  }

  function notifyParentChapter(chapter) {
    if (!chapter) return;
    try {
      if (root.parent && root.parent !== root) {
        root.parent.postMessage(
          {
            type: "portfolio-chapter",
            chapter: chapter,
            world: worldKey(root.document),
            source: "design-test-v2",
          },
          "*"
        );
      }
    } catch (e) {}
  }

  function bindChapterUrlSync(doc) {
    doc = doc || root.document;
    if (doc.documentElement.getAttribute("data-v2-chapter-sync") === "1") return;
    doc.documentElement.setAttribute("data-v2-chapter-sync", "1");
    var last = "";
    var sections = [];
    [
      "hero",
      "main",
      "leistungen",
      "services",
      "skills",
      "werke",
      "projects",
      "collage",
      "alex",
      "about",
      "experience",
      "values",
      "kontakt",
      "contact",
      "offerte",
    ].forEach(function (id) {
      var el = doc.getElementById(id);
      if (el) sections.push(el);
    });
    if (!sections.length || typeof IntersectionObserver !== "function") return;
    var io = new IntersectionObserver(
      function (entries) {
        var best = null;
        var bestRatio = 0;
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          if (entry.intersectionRatio >= bestRatio) {
            bestRatio = entry.intersectionRatio;
            best = entry.target;
          }
        });
        if (!best) return;
        var ch = chapterFromHashOrId(best.id);
        if (!ch || ch === last) return;
        last = ch;
        try {
          if (history && history.replaceState && ch !== "home") {
            history.replaceState(null, "", "#" + best.id);
          } else if (history && history.replaceState && ch === "home") {
            history.replaceState(null, "", location.pathname + location.search);
          }
        } catch (eHash) {}
        notifyParentChapter(ch);
      },
      { root: null, rootMargin: "-28% 0px -48% 0px", threshold: [0.12, 0.25, 0.4] }
    );
    sections.forEach(function (el) {
      io.observe(el);
    });
  }

  function fillYears(doc) {
    doc = doc || root.document;
    var y = String(new Date().getFullYear());
    doc.querySelectorAll("[data-v2-year], [data-year], [data-nx-year]").forEach(function (el) {
      el.textContent = y;
    });
  }

  function applyReducedMotion(doc) {
    doc = doc || root.document;
    try {
      var mq = root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq && mq.matches) doc.documentElement.setAttribute("data-reduced-motion", "1");
    } catch (e) {}
  }

  function onMessage(ev) {
    var data = ev && ev.data;
    if (!data) return;
    if (data.type === "portfolio-preview-lang" && data.lang) {
      applyI18n(root.document, setLang(data.lang));
    }
    if (data.source === "design-test-v2" && data.type === "lang" && data.detail && data.detail.lang) {
      applyI18n(root.document, setLang(data.detail.lang));
    }
    if (data.type === "portfolio-go-chapter" && data.chapter) {
      goChapter(data.chapter);
    }
    if (data.type === "alex:scroll-to-section") {
      if (data.go) goChapter(data.go);
      else if (data.targetHash) {
        var el =
          root.document.getElementById(String(data.targetHash).replace(/^#/, "")) ||
          root.document.querySelector('[data-v2-section="' + String(data.targetHash).replace(/^#/, "") + '"]');
        if (el && el.scrollIntoView) {
          try {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          } catch (e3) {
            el.scrollIntoView(true);
          }
        }
      }
    }
    if (data.type === "portfolio-effects") {
      var on = data.on !== false;
      root.document.documentElement.setAttribute("data-effects", on ? "on" : "off");
      root.document.documentElement.classList.toggle("mv-effects-off", !on);
      root.document.body.classList.toggle("mv-effects-off", !on);
      try {
        root.document.body.setAttribute("data-v2-effects", on ? "on" : "off");
      } catch (e4) {}
    }
  }

  function init() {
    var doc = root.document;
    applyReducedMotion(doc);
    fillYears(doc);
    fixLinks(doc);
    applyI18n(doc, getLang());
    bindChapterUrlSync(doc);
    root.setTimeout(scrollToHash, 80);
    root.setTimeout(scrollToHash, 400);
    root.setTimeout(scrollToHash, 900);
  }

  root.WeltenDesignTestV2Bridge = {
    post: post,
    init: init,
    fillYears: fillYears,
    applyI18n: applyI18n,
    fixLinks: fixLinks,
    getLang: getLang,
    goChapter: goChapter,
  };

  root.addEventListener("message", onMessage);
  if (root.document.readyState === "loading") {
    root.document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(typeof window !== "undefined" ? window : this);
