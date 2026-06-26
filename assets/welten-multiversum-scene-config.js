/**

 * MULTIVERSUM Scroll Story V15 — Intro → Reveal → Focus

 */

(function () {

  "use strict";



  window.MVSceneConfig = {

    version: 15,

    sceneCount: 9,

    scrollHeightVh: 2700,

    scrollHeightVhTablet: 1480,

    fade: 0.08,

    smoothLerp: 0.05,

    segmentHold: 0.84,

    timing: {

      enter: 0.12,

      exit: 0.1,

      fade: 0.08,

    },

    bounds: [0, 0.06, 0.12, 0.18, 0.24, 0.38, 0.52, 0.66, 0.80, 1],



    chapters: {

      introAllWorlds: [0.0, 0.06],

      revealNexora: [0.06, 0.12],

      revealProfessional: [0.12, 0.18],

      revealFreiraum: [0.18, 0.24],

      nexoraFocus: [0.24, 0.38],

      professionalFocus: [0.38, 0.52],

      freiraumFocus: [0.52, 0.66],

      merge: [0.66, 0.80],
      finalCTA: [0.80, 1.0],

    },



    parallax: {

      layer1_bg: 0.12,

      layer2_nebula: 0.18,

      layer3_particles: 0.22,

      layer4_objects: 0.34,

      layer5_cards: 0.4,

      layer6_copy: 0.48,

      layer7_ui: 0.62,

    },



    slides: [

      {

        id: "intro-all-worlds",

        title: "Drei Welten. Ein Portfolio.",

        body: "Technologie, Struktur und kreative Freiheit – verbunden in einem digitalen Multiversum.",

        copyPos: "copy--center-top",

        sceneKind: "intro",

      },

      {

        id: "reveal-nexora",

        sceneKind: "reveal",

        revealedWorlds: ["nexora"],

        highlightWorld: "nexora",

      },

      {

        id: "reveal-professional",

        sceneKind: "reveal",

        revealedWorlds: ["nexora", "professional"],

        highlightWorld: "professional",

      },

      {

        id: "reveal-freiraum",

        sceneKind: "reveal",

        revealedWorlds: ["nexora", "professional", "freiraum"],

        highlightWorld: "freiraum",

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

        title: "Drei Welten. Ein System.",

        body: "Technologie, Struktur und Kreativität verbinden sich zu einem Portfolio, das zeigt, was möglich ist.",

        copyPos: "copy--center-bottom",

        sceneKind: "merge",

      },

      {

        id: "portfolio-contact",

        title: "Bereit für den nächsten Schritt?",

        body: "Entdecke Projekte aus allen Welten oder starte direkt mit einer neuen Idee.",

        copyPos: "copy--center-bottom",

        sceneKind: "finale",

      },

    ],



    keyframes: [

      {

        activeWorld: "multiversum",

        backgrounds: { multiverse: 0.78, nexora: 0.14, professional: 0.12, freiraum: 0.14 },

        stars: 0.22,

        particles: 0.2,

        vignette: 0.38,

        orbs: {

          nexora: { x: -24, y: 4, scale: 0.62, opacity: 0.96, blur: 0, z: 22 },

          professional: { x: 0, y: 10, scale: 0.58, opacity: 0.94, blur: 0, z: 24 },

          freiraum: { x: 24, y: 4, scale: 0.62, opacity: 0.96, blur: 0, z: 23 },

        },

        decor: {

          orbit: { opacity: 0.22, scale: 1.08, rotate: 2 },

          orbit2: { opacity: 0.12, scale: 1.02, rotate: 0 },

          particles: { opacity: 0.18 },

          light: { opacity: 0.14 },

          line: { opacity: 0.1 },

        },

        transitionTrail: 0,

        portfolio: { opacity: 0, y: 10 },

      },

      {

        activeWorld: "multiversum",

        backgrounds: { multiverse: 0.76, nexora: 0.16, professional: 0.12, freiraum: 0.14 },

        stars: 0.22,

        particles: 0.2,

        vignette: 0.36,

        orbs: {

          nexora: { x: -24, y: 4, scale: 0.64, opacity: 0.98, blur: 0, z: 26 },

          professional: { x: 0, y: 10, scale: 0.58, opacity: 0.9, blur: 0, z: 22 },

          freiraum: { x: 24, y: 4, scale: 0.58, opacity: 0.9, blur: 0, z: 22 },

        },

        decor: {

          orbit: { opacity: 0.22, scale: 1.08, rotate: 2 },

          orbit2: { opacity: 0.12, scale: 1.02, rotate: 0 },

          particles: { opacity: 0.18 },

          light: { opacity: 0.14 },

          line: { opacity: 0.1 },

        },

        transitionTrail: 0,

        portfolio: { opacity: 0, y: 10 },

      },

      {

        activeWorld: "multiversum",

        backgrounds: { multiverse: 0.74, nexora: 0.15, professional: 0.14, freiraum: 0.13 },

        stars: 0.2,

        particles: 0.2,

        vignette: 0.34,

        orbs: {

          nexora: { x: -24, y: 4, scale: 0.62, opacity: 0.94, blur: 0, z: 24 },

          professional: { x: 0, y: 10, scale: 0.62, opacity: 0.98, blur: 0, z: 26 },

          freiraum: { x: 24, y: 4, scale: 0.58, opacity: 0.9, blur: 0, z: 22 },

        },

        decor: {

          orbit: { opacity: 0.22, scale: 1.08, rotate: 2 },

          orbit2: { opacity: 0.12, scale: 1.02, rotate: 0 },

          particles: { opacity: 0.18 },

          light: { opacity: 0.14 },

          line: { opacity: 0.1 },

        },

        transitionTrail: 0,

        portfolio: { opacity: 0, y: 10 },

      },

      {

        activeWorld: "multiversum",

        backgrounds: { multiverse: 0.72, nexora: 0.15, professional: 0.14, freiraum: 0.15 },

        stars: 0.2,

        particles: 0.22,

        vignette: 0.32,

        orbs: {

          nexora: { x: -24, y: 4, scale: 0.62, opacity: 0.94, blur: 0, z: 24 },

          professional: { x: 0, y: 10, scale: 0.6, opacity: 0.94, blur: 0, z: 24 },

          freiraum: { x: 24, y: 4, scale: 0.64, opacity: 0.98, blur: 0, z: 26 },

        },

        decor: {

          orbit: { opacity: 0.24, scale: 1.1, rotate: 3 },

          orbit2: { opacity: 0.14, scale: 1.02, rotate: 0 },

          particles: { opacity: 0.2 },

          light: { opacity: 0.16 },

          line: { opacity: 0.12 },

        },

        transitionTrail: 0,

        portfolio: { opacity: 0, y: 10 },

      },

      {

        activeWorld: "nexora",

        backgrounds: { multiverse: 0.06, nexora: 0.94, professional: 0, freiraum: 0 },

        stars: 0.1,

        particles: 0.18,

        vignette: 0.18,

        orbs: {

          nexora: { x: 10, y: 0, scale: 1.14, opacity: 1, blur: 0, z: 56 },

          professional: { x: 32, y: 22, scale: 0.18, opacity: 0.14, blur: 2.5, z: 8 },

          freiraum: { x: -30, y: 24, scale: 0.16, opacity: 0.1, blur: 3, z: 6 },

        },

        decor: {

          orbit: { opacity: 0.34, scale: 1.22, rotate: 6 },

          orbit2: { opacity: 0.2, scale: 1.1, rotate: 0 },

          particles: { opacity: 0.38 },

          light: { opacity: 0.3 },

          line: { opacity: 0.26 },

        },

        transitionTrail: 0,

        portfolio: { opacity: 0, y: 10 },

      },

      {

        activeWorld: "professional",

        backgrounds: { multiverse: 0.05, nexora: 0, professional: 0.95, freiraum: 0 },

        stars: 0.08,

        particles: 0.14,

        vignette: 0.16,

        orbs: {

          nexora: { x: 30, y: 20, scale: 0.16, opacity: 0.1, blur: 3, z: 6 },

          professional: { x: -10, y: 0, scale: 1.12, opacity: 1, blur: 0, z: 58 },

          freiraum: { x: 30, y: 18, scale: 0.17, opacity: 0.12, blur: 3, z: 8 },

        },

        decor: {

          orbit: { opacity: 0.28, scale: 1.06, rotate: 4 },

          orbit2: { opacity: 0.18, scale: 1.02, rotate: 0 },

          particles: { opacity: 0.22 },

          light: { opacity: 0.26 },

          line: { opacity: 0.22 },

        },

        transitionTrail: 0,

        portfolio: { opacity: 0, y: 10 },

      },

      {

        activeWorld: "freiraum",

        backgrounds: { multiverse: 0.04, nexora: 0, professional: 0, freiraum: 0.96 },

        stars: 0.1,

        particles: 0.2,

        vignette: 0.16,

        orbs: {

          nexora: { x: -28, y: 18, scale: 0.15, opacity: 0.08, blur: 3, z: 6 },

          professional: { x: -26, y: 16, scale: 0.16, opacity: 0.1, blur: 3, z: 8 },

          freiraum: { x: 10, y: -1, scale: 1.14, opacity: 1, blur: 0, z: 60 },

        },

        decor: {

          orbit: { opacity: 0.32, scale: 1.18, rotate: 10 },

          orbit2: { opacity: 0.22, scale: 1.08, rotate: 0 },

          particles: { opacity: 0.36 },

          light: { opacity: 0.34 },

          line: { opacity: 0.24 },

        },

        transitionTrail: 0,

        portfolio: { opacity: 0, y: 10 },

      },

      {

        activeWorld: "merge",

        backgrounds: { multiverse: 0.58, nexora: 0.2, professional: 0.18, freiraum: 0.22 },

        stars: 0.16,

        particles: 0.28,

        vignette: 0.32,

        orbs: {

          nexora: { x: -14, y: -2, scale: 0.48, opacity: 0.9, blur: 0, z: 32 },

          professional: { x: 0, y: -2, scale: 0.46, opacity: 0.88, blur: 0, z: 31 },

          freiraum: { x: 14, y: 0, scale: 0.48, opacity: 0.9, blur: 0, z: 32 },

        },

        decor: {

          orbit: { opacity: 0.38, scale: 1.24, rotate: 14 },

          orbit2: { opacity: 0.24, scale: 1.12, rotate: 0 },

          particles: { opacity: 0.28 },

          light: { opacity: 0.26 },

          line: { opacity: 0.36 },

        },

        transitionTrail: 0,

        portfolio: { opacity: 0, y: 6 },

      },

      {

        activeWorld: "multiversum",

        backgrounds: { multiverse: 0.58, nexora: 0.1, professional: 0.08, freiraum: 0.1 },

        stars: 0.12,

        particles: 0.16,

        vignette: 0.4,

        orbs: {

          nexora: { x: -12, y: -2, scale: 0.26, opacity: 0.46, blur: 1, z: 14 },

          professional: { x: 0, y: -4, scale: 0.24, opacity: 0.44, blur: 1, z: 13 },

          freiraum: { x: 12, y: -2, scale: 0.26, opacity: 0.46, blur: 1, z: 14 },

        },

        decor: {

          orbit: { opacity: 0.14, scale: 1.02, rotate: 8 },

          orbit2: { opacity: 0.08, scale: 1, rotate: 0 },

          particles: { opacity: 0.12 },

          light: { opacity: 0.1 },

          line: { opacity: 0.08 },

        },

        transitionTrail: 0,

        portfolio: { opacity: 1, y: 0 },

      },

    ],

  };

})();


