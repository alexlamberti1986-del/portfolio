/**
 * MULTIVERSUM V4  · Scene-Config Patch (vier Welten, lokaler Test)
 */
(function () {
  "use strict";

  var base = window.MVSceneConfig;
  if (!base) return;

  base.version = 4;
  base.skipPortfolioFrame = true;
  base.scrollHeightVh = 720;
  base.scrollHeightVhTablet = 640;
  base.segmentHold = 0.66;
  base.timing = {
    enter: 0.2,
    exit: 0.1,
    fade: 0.1,
  };
  base.smoothLerp = 0.065;
  base.bounds = [0, 0.12, 0.18, 0.28, 0.34, 0.48, 0.54, 0.68, 0.74, 0.84, 0.9, 0.94, 1];

  base.chapters = {
    intro: [0.0, 0.12],
    introToMultiversum: [0.12, 0.18],
    multiversumFocus: [0.18, 0.28],
    multiversumToNexora: [0.28, 0.34],
    nexoraFocus: [0.34, 0.48],
    nexoraToProfessional: [0.48, 0.54],
    professionalFocus: [0.54, 0.68],
    professionalToFreiraum: [0.68, 0.74],
    freiraumFocus: [0.74, 0.84],
    finaleCopyOnly: [0.84, 0.9],
    portfolioFrame: [0.9, 0.94],
    portfolioButtons: [0.94, 0.97],
    releaseToNormalContent: [0.97, 1.0],
  };

  base.slides = [
    {
      id: "intro-all-worlds",
      title: "Vier Welten. Ein Portfolio.",
      body: "MULTIVERSUM, Technologie, Struktur und kreative Freiheit · verbunden in einem digitalen Universum.",
      copyPos: "copy--center-top",
      sceneKind: "intro",
    },
    {
      id: "multiversum-focus",
      lead: "Die Übersichtswelt · alles verbunden.",
      body: "MULTIVERSUM ist der kosmische Startpunkt: vier Perspektiven, ein roter Faden. Hier beginnt die Reise durch Technologie, Business und Kreativität.",
      copyPos: "copy--left-mid",
      worldType: "multiversum",
      worldSide: "right",
      sceneKind: "world",
    },
    {
      id: "nexora-focus",
      lead: "Technologie, Systeme und digitale Energie.",
      body: "NEXORA ist der technische Kern für smarte Web-Erlebnisse. Hier verbinden sich Webdesign, Performance, Automatisierung und digitale Struktur zu skalierbaren Lösungen mit Wirkung.",
      copyPos: "copy--left-mid",
      worldType: "nexora",
      worldSide: "right",
      sceneKind: "world",
    },
    {
      id: "professional-focus",
      lead: "Klarheit, Vertrauen und hochwertige Markenwirkung.",
      body: "PROFESSIONAL steht für Business-Auftritte mit Struktur, Präzision und Überzeugungskraft. Präsentationen, Kommunikation und professionelle Markenführung werden hier klar inszeniert.",
      copyPos: "copy--right-mid",
      worldType: "professional",
      worldSide: "left",
      sceneKind: "world",
    },
    {
      id: "freiraum-focus",
      lead: "Kreativität, Emotion und visuelle Freiheit.",
      body: "FREIRAUM ist die Welt für Ideen mit Charakter. Hier entstehen Design, Kampagnen, visuelle Konzepte und Inhalte, die Wiedererkennung schaffen und emotional wirken.",
      copyPos: "copy--left-mid",
      worldType: "freiraum",
      worldSide: "right",
      sceneKind: "world",
    },
    {
      id: "merge",
      title: "Vier Welten. Ein System.",
      body: "Übersicht, Technologie, Struktur und Kreativität verbinden sich zu einem Portfolio, das zeigt, was möglich ist.",
      copyPos: "copy--center-bottom",
      sceneKind: "merge",
      visibility: [0, 0],
    },
    {
      id: "portfolio-contact",
      title: "Bereit für den nächsten Schritt?",
      body: "Entdecke Projekte aus allen Welten oder starte direkt mit einer neuen Idee.",
      copyPos: "copy--center-bottom",
      sceneKind: "finale",
    },
  ];

  function orb4(intro) {
    if (intro) {
      return {
        multiversum: { x: -34, y: 16, scale: 0.5, opacity: 0.98, blur: 0, z: 26 },
        nexora: { x: -12, y: 18, scale: 0.48, opacity: 0.96, blur: 0, z: 23 },
        professional: { x: 12, y: 18, scale: 0.48, opacity: 0.96, blur: 0, z: 22 },
        freiraum: { x: 34, y: 16, scale: 0.5, opacity: 0.98, blur: 0, z: 23 },
      };
    }
    return {
      multiversum: { x: -28, y: 0, scale: 0.16, opacity: 0.1, blur: 3, z: 6 },
      nexora: { x: 28, y: 18, scale: 0.16, opacity: 0.1, blur: 3, z: 6 },
      professional: { x: -24, y: 14, scale: 0.16, opacity: 0.1, blur: 3, z: 8 },
      freiraum: { x: 30, y: 18, scale: 0.15, opacity: 0.08, blur: 3, z: 6 },
    };
  }

  base.keyframes = [
    {
      activeWorld: "multiversum",
      backgrounds: { multiverse: 0.78, nexora: 0.12, professional: 0.1, freiraum: 0.12 },
      stars: 0.22,
      particles: 0.2,
      vignette: 0.38,
      orbs: orb4(true),
      decor: { orbit: { opacity: 0.22, scale: 1.08, rotate: 2 }, orbit2: { opacity: 0.12, scale: 1.02, rotate: 0 }, particles: { opacity: 0.18 }, light: { opacity: 0.14 }, line: { opacity: 0.1 } },
      transitionTrail: 0,
      portfolio: { opacity: 0, y: 10 },
    },
    {
      activeWorld: "multiversum",
      backgrounds: { multiverse: 0.74, nexora: 0.14, professional: 0.1, freiraum: 0.12 },
      stars: 0.2,
      particles: 0.2,
      vignette: 0.34,
      orbs: {
        multiversum: { x: -24, y: 0, scale: 0.64, opacity: 0.98, blur: 0, z: 28 },
        nexora: { x: -8, y: 3, scale: 0.5, opacity: 0.82, blur: 0.5, z: 18 },
        professional: { x: 8, y: 3, scale: 0.48, opacity: 0.8, blur: 0.5, z: 17 },
        freiraum: { x: 24, y: 0, scale: 0.5, opacity: 0.82, blur: 0.5, z: 18 },
      },
      decor: { orbit: { opacity: 0.24, scale: 1.1, rotate: 3 }, orbit2: { opacity: 0.14, scale: 1.02, rotate: 0 }, particles: { opacity: 0.2 }, light: { opacity: 0.16 }, line: { opacity: 0.12 } },
      transitionTrail: 0.1,
      portfolio: { opacity: 0, y: 10 },
    },
    {
      activeWorld: "multiversum",
      backgrounds: { multiverse: 0.7, nexora: 0.1, professional: 0.08, freiraum: 0.1 },
      stars: 0.14,
      particles: 0.2,
      vignette: 0.24,
      orbs: {
        multiversum: { x: 6, y: 0, scale: 1.06, opacity: 0.98, blur: 0, z: 52 },
        nexora: { x: 28, y: 18, scale: 0.18, opacity: 0.12, blur: 2, z: 8 },
        professional: { x: -26, y: 20, scale: 0.16, opacity: 0.1, blur: 2.5, z: 6 },
        freiraum: { x: 30, y: 22, scale: 0.16, opacity: 0.1, blur: 2.5, z: 6 },
      },
      decor: { orbit: { opacity: 0.28, scale: 1.14, rotate: 5 }, orbit2: { opacity: 0.16, scale: 1.04, rotate: 0 }, particles: { opacity: 0.28 }, light: { opacity: 0.24 }, line: { opacity: 0.18 } },
      transitionTrail: 0.22,
      portfolio: { opacity: 0, y: 10 },
    },
    {
      activeWorld: "nexora",
      backgrounds: { multiverse: 0.1, nexora: 0.82, professional: 0.04, freiraum: 0.04 },
      stars: 0.12,
      particles: 0.22,
      vignette: 0.22,
      orbs: {
        multiversum: { x: -30, y: 20, scale: 0.14, opacity: 0.08, blur: 3, z: 6 },
        nexora: { x: 8, y: 0, scale: 1.02, opacity: 0.96, blur: 0, z: 48 },
        professional: { x: 28, y: 20, scale: 0.2, opacity: 0.12, blur: 2, z: 8 },
        freiraum: { x: -26, y: 22, scale: 0.18, opacity: 0.1, blur: 2.5, z: 6 },
      },
      decor: { orbit: { opacity: 0.3, scale: 1.16, rotate: 5 }, orbit2: { opacity: 0.18, scale: 1.06, rotate: 0 }, particles: { opacity: 0.32 }, light: { opacity: 0.28 }, line: { opacity: 0.22 } },
      transitionTrail: 0.28,
      portfolio: { opacity: 0, y: 10 },
    },
    {
      activeWorld: "nexora",
      backgrounds: { multiverse: 0.06, nexora: 0.94, professional: 0, freiraum: 0 },
      stars: 0.1,
      particles: 0.18,
      vignette: 0.18,
      orbs: {
        multiversum: { x: -32, y: 22, scale: 0.12, opacity: 0.06, blur: 3, z: 6 },
        nexora: { x: 8, y: 0, scale: 1.12, opacity: 1, blur: 0, z: 56 },
        professional: { x: 32, y: 22, scale: 0.16, opacity: 0.1, blur: 3, z: 6 },
        freiraum: { x: -30, y: 24, scale: 0.14, opacity: 0.08, blur: 3, z: 6 },
      },
      decor: { orbit: { opacity: 0.34, scale: 1.22, rotate: 6 }, orbit2: { opacity: 0.2, scale: 1.1, rotate: 0 }, particles: { opacity: 0.38 }, light: { opacity: 0.3 }, line: { opacity: 0.26 } },
      transitionTrail: 0,
      portfolio: { opacity: 0, y: 10 },
    },
    {
      activeWorld: "professional",
      backgrounds: { multiverse: 0.08, nexora: 0.04, professional: 0.82, freiraum: 0.04 },
      stars: 0.1,
      particles: 0.16,
      vignette: 0.18,
      orbs: {
        multiversum: { x: 26, y: 18, scale: 0.14, opacity: 0.08, blur: 3, z: 6 },
        nexora: { x: 26, y: 18, scale: 0.16, opacity: 0.1, blur: 3, z: 6 },
        professional: { x: -8, y: 0, scale: 1.04, opacity: 0.96, blur: 0, z: 52 },
        freiraum: { x: 28, y: 16, scale: 0.16, opacity: 0.1, blur: 3, z: 8 },
      },
      decor: { orbit: { opacity: 0.26, scale: 1.04, rotate: 3 }, orbit2: { opacity: 0.16, scale: 1, rotate: 0 }, particles: { opacity: 0.2 }, light: { opacity: 0.24 }, line: { opacity: 0.2 } },
      transitionTrail: 0.2,
      portfolio: { opacity: 0, y: 10 },
    },
    {
      activeWorld: "professional",
      backgrounds: { multiverse: 0.05, nexora: 0, professional: 0.95, freiraum: 0 },
      stars: 0.08,
      particles: 0.14,
      vignette: 0.16,
      orbs: {
        multiversum: { x: 30, y: 20, scale: 0.12, opacity: 0.06, blur: 3, z: 6 },
        nexora: { x: 30, y: 20, scale: 0.16, opacity: 0.1, blur: 3, z: 6 },
        professional: { x: -8, y: 0, scale: 1.12, opacity: 1, blur: 0, z: 58 },
        freiraum: { x: 30, y: 18, scale: 0.17, opacity: 0.12, blur: 3, z: 8 },
      },
      decor: { orbit: { opacity: 0.28, scale: 1.06, rotate: 4 }, orbit2: { opacity: 0.18, scale: 1.02, rotate: 0 }, particles: { opacity: 0.22 }, light: { opacity: 0.26 }, line: { opacity: 0.22 } },
      transitionTrail: 0,
      portfolio: { opacity: 0, y: 10 },
    },
    {
      activeWorld: "freiraum",
      backgrounds: { multiverse: 0.06, nexora: 0, professional: 0.04, freiraum: 0.84 },
      stars: 0.1,
      particles: 0.18,
      vignette: 0.16,
      orbs: {
        multiversum: { x: -26, y: 16, scale: 0.14, opacity: 0.08, blur: 3, z: 6 },
        nexora: { x: -26, y: 16, scale: 0.15, opacity: 0.08, blur: 3, z: 6 },
        professional: { x: -24, y: 14, scale: 0.16, opacity: 0.1, blur: 3, z: 8 },
        freiraum: { x: 8, y: -1, scale: 1.04, opacity: 0.96, blur: 0, z: 54 },
      },
      decor: { orbit: { opacity: 0.28, scale: 1.12, rotate: 8 }, orbit2: { opacity: 0.18, scale: 1.04, rotate: 0 }, particles: { opacity: 0.3 }, light: { opacity: 0.3 }, line: { opacity: 0.22 } },
      transitionTrail: 0.18,
      portfolio: { opacity: 0, y: 10 },
    },
    {
      activeWorld: "freiraum",
      backgrounds: { multiverse: 0.04, nexora: 0, professional: 0, freiraum: 0.96 },
      stars: 0.1,
      particles: 0.2,
      vignette: 0.16,
      orbs: {
        multiversum: { x: -28, y: 18, scale: 0.12, opacity: 0.06, blur: 3, z: 6 },
        nexora: { x: -28, y: 18, scale: 0.15, opacity: 0.08, blur: 3, z: 6 },
        professional: { x: -26, y: 16, scale: 0.16, opacity: 0.1, blur: 3, z: 8 },
        freiraum: { x: 8, y: -1, scale: 1.14, opacity: 1, blur: 0, z: 60 },
      },
      decor: { orbit: { opacity: 0.32, scale: 1.18, rotate: 10 }, orbit2: { opacity: 0.22, scale: 1.08, rotate: 0 }, particles: { opacity: 0.36 }, light: { opacity: 0.34 }, line: { opacity: 0.24 } },
      transitionTrail: 0,
      portfolio: { opacity: 0, y: 10 },
    },
    {
      activeWorld: "multiversum",
      backgrounds: { multiverse: 0.62, nexora: 0.04, professional: 0.04, freiraum: 0.04 },
      stars: 0.12,
      particles: 0.14,
      vignette: 0.36,
      orbs: {
        multiversum: { x: 0, y: 0, scale: 0.22, opacity: 0, blur: 2, z: 8 },
        nexora: { x: -12, y: -2, scale: 0.2, opacity: 0, blur: 2, z: 8 },
        professional: { x: 0, y: -2, scale: 0.18, opacity: 0, blur: 2, z: 8 },
        freiraum: { x: 12, y: 0, scale: 0.2, opacity: 0, blur: 2, z: 8 },
      },
      decor: { orbit: { opacity: 0.1, scale: 1, rotate: 4 }, orbit2: { opacity: 0.06, scale: 1, rotate: 0 }, particles: { opacity: 0.08 }, light: { opacity: 0.08 }, line: { opacity: 0.06 } },
      transitionTrail: 0,
      portfolio: { opacity: 0, y: 10 },
    },
    {
      activeWorld: "multiversum",
      backgrounds: { multiverse: 0.55, nexora: 0.02, professional: 0.02, freiraum: 0.02 },
      stars: 0.1,
      particles: 0.1,
      vignette: 0.42,
      orbs: orb4(false),
      decor: { orbit: { opacity: 0.08, scale: 1, rotate: 2 }, orbit2: { opacity: 0.05, scale: 1, rotate: 0 }, particles: { opacity: 0.06 }, light: { opacity: 0.06 }, line: { opacity: 0.04 } },
      transitionTrail: 0,
      portfolio: { opacity: 0.85, y: 0 },
    },
    {
      activeWorld: "multiversum",
      backgrounds: { multiverse: 0.52, nexora: 0, professional: 0, freiraum: 0 },
      stars: 0.08,
      particles: 0.08,
      vignette: 0.44,
      orbs: orb4(false),
      decor: { orbit: { opacity: 0.06, scale: 1, rotate: 0 }, orbit2: { opacity: 0.04, scale: 1, rotate: 0 }, particles: { opacity: 0.04 }, light: { opacity: 0.04 }, line: { opacity: 0.03 } },
      transitionTrail: 0,
      portfolio: { opacity: 1, y: 0 },
    },
  ];
})();
