(function () {
  "use strict";

  var SKILLS_VERSION = "18";

  function getLang() {
    try {
      return localStorage.getItem("mv-preview-lang") || sessionStorage.getItem("mv-preview-lang") || "de";
    } catch (e) {
      return "de";
    }
  }

  var OVERVIEW_UI = {
    de: {
      aria: "Kompetenzen und Expertise",
      title: "Kompetenzen & Expertise",
      subtitle: "Ein visueller Überblick über meine wichtigsten Fähigkeiten, digitalen Kompetenzen und strategischen Schwerpunkte.",
    },
    en: {
      aria: "Skills and expertise",
      title: "Skills & expertise",
      subtitle: "A visual overview of my key skills, digital competencies and strategic focus areas.",
    },
    fr: {
      aria: "Compétences et expertise",
      title: "Compétences et expertise",
      subtitle: "Un aperçu visuel de mes principales compétences, expertises digitales et domaines stratégiques.",
    },
    it: {
      aria: "Competenze ed expertise",
      title: "Competenze ed expertise",
      subtitle: "Una panoramica visiva delle mie competenze chiave, digitali e degli ambiti strategici.",
    },
  };

  var CHARTS_DE = [
    {
      id: "marketing",
      title: "Digital Marketing & Strategie",
      type: "hbar",
      items: [
        { label: "Digitales Marketing", value: 95 },
        { label: "Corporate Identity", value: 92 },
        { label: "Branding", value: 88 },
        { label: "SEO", value: 86 },
        { label: "Web-Content-Management", value: 90 },
      ],
    },
    {
      id: "creative",
      title: "Kreative Tools",
      type: "donut",
      items: [
        { label: "Creative Cloud", value: 35, color: "var(--sk-accent)" },
        { label: "Canva", value: 20, color: "var(--sk-accent-2)" },
        { label: "Video", value: 20, color: "var(--sk-accent-3)" },
        { label: "Imaging", value: 25, color: "var(--sk-accent-4)" },
      ],
    },
    {
      id: "strategy",
      title: "Strategische Kompetenzen",
      type: "radar",
      items: [
        { label: "Projektkoordination", lines: ["Projekt-", "koordination"], value: 92 },
        { label: "IT-Strategie", value: 88 },
        { label: "Softwarelösungen", lines: ["Software-", "lösungen"], value: 85 },
        { label: "Key Accounts", value: 94 },
        { label: "Grosskunden", value: 90 },
        { label: "Kundenbindung", lines: ["Kunden-", "bindung"], value: 91 },
      ],
    },
    {
      id: "web",
      title: "Web & Digital",
      type: "vbar",
      items: [
        { label: "CMS", value: 95 },
        { label: "Webdesign", value: 90 },
        { label: "Images", value: 92 },
        { label: "SEO", value: 86 },
        { label: "KI-Tools", value: 94 },
      ],
    },
    {
      id: "business",
      title: "Business & Kommunikation",
      type: "rings",
      items: [
        { label: "Kommunikation", value: 96 },
        { label: "Beratung", value: 93 },
        { label: "Präsentation", value: 91 },
        { label: "Verhandlung", value: 94 },
      ],
    },
    {
      id: "matrix",
      title: "Kompetenz-Matrix",
      type: "heatmap",
      levels: ["Stark", "Sehr stark", "Experte"],
      categories: ["Marketing", "Design", "Strategie", "Web", "KI", "Kommunikation"],
      matrix: [3, 2, 3, 3, 2, 3],
    },
  ];

  var CHARTS_EN = [
    {
      id: "marketing",
      title: "Digital marketing & strategy",
      type: "hbar",
      items: [
        { label: "Digital marketing", value: 95 },
        { label: "Corporate identity", value: 92 },
        { label: "Branding", value: 88 },
        { label: "SEO", value: 86 },
        { label: "Web content management", value: 90 },
      ],
    },
    {
      id: "creative",
      title: "Creative tools",
      type: "donut",
      items: [
        { label: "Creative Cloud", value: 35, color: "var(--sk-accent)" },
        { label: "Canva", value: 20, color: "var(--sk-accent-2)" },
        { label: "Video", value: 20, color: "var(--sk-accent-3)" },
        { label: "Imaging", value: 25, color: "var(--sk-accent-4)" },
      ],
    },
    {
      id: "strategy",
      title: "Strategic skills",
      type: "radar",
      items: [
        { label: "Project coordination", lines: ["Project", "coordination"], value: 92 },
        { label: "IT strategy", value: 88 },
        { label: "Software solutions", lines: ["Software", "solutions"], value: 85 },
        { label: "Key accounts", value: 94 },
        { label: "Enterprise clients", value: 90 },
        { label: "Customer retention", lines: ["Customer", "retention"], value: 91 },
      ],
    },
    {
      id: "web",
      title: "Web & digital",
      type: "vbar",
      items: [
        { label: "CMS", value: 95 },
        { label: "Web design", value: 90 },
        { label: "Images", value: 92 },
        { label: "SEO", value: 86 },
        { label: "AI tools", value: 94 },
      ],
    },
    {
      id: "business",
      title: "Business & communication",
      type: "rings",
      items: [
        { label: "Communication", value: 96 },
        { label: "Consulting", value: 93 },
        { label: "Presentation", value: 91 },
        { label: "Negotiation", value: 94 },
      ],
    },
    {
      id: "matrix",
      title: "Skills matrix",
      type: "heatmap",
      levels: ["Strong", "Very strong", "Expert"],
      categories: ["Marketing", "Design", "Strategy", "Web", "AI", "Communication"],
      matrix: [3, 2, 3, 3, 2, 3],
    },
  ];

  var CHARTS_FR = [
    {
      id: "marketing",
      title: "Marketing digital et stratégie",
      type: "hbar",
      items: [
        { label: "Marketing digital", value: 95 },
        { label: "Corporate identity", value: 92 },
        { label: "Branding", value: 88 },
        { label: "SEO", value: 86 },
        { label: "Gestion de contenu web", value: 90 },
      ],
    },
    {
      id: "creative",
      title: "Outils créatifs",
      type: "donut",
      items: [
        { label: "Creative Cloud", value: 35, color: "var(--sk-accent)" },
        { label: "Canva", value: 20, color: "var(--sk-accent-2)" },
        { label: "Vidéo", value: 20, color: "var(--sk-accent-3)" },
        { label: "Imaging", value: 25, color: "var(--sk-accent-4)" },
      ],
    },
    {
      id: "strategy",
      title: "Compétences stratégiques",
      type: "radar",
      items: [
        { label: "Coordination de projets", lines: ["Coordination", "de projets"], value: 92 },
        { label: "Stratégie IT", value: 88 },
        { label: "Solutions logicielles", lines: ["Solutions", "logicielles"], value: 85 },
        { label: "Grands comptes", value: 94 },
        { label: "Clients entreprise", value: 90 },
        { label: "Fidélisation client", lines: ["Fidélisation", "client"], value: 91 },
      ],
    },
    {
      id: "web",
      title: "Web et digital",
      type: "vbar",
      items: [
        { label: "CMS", value: 95 },
        { label: "Web design", value: 90 },
        { label: "Images", value: 92 },
        { label: "SEO", value: 86 },
        { label: "Outils IA", value: 94 },
      ],
    },
    {
      id: "business",
      title: "Business et communication",
      type: "rings",
      items: [
        { label: "Communication", value: 96 },
        { label: "Conseil", value: 93 },
        { label: "Présentation", value: 91 },
        { label: "Négociation", value: 94 },
      ],
    },
    {
      id: "matrix",
      title: "Matrice de compétences",
      type: "heatmap",
      levels: ["Fort", "Très fort", "Expert"],
      categories: ["Marketing", "Design", "Stratégie", "Web", "IA", "Communication"],
      matrix: [3, 2, 3, 3, 2, 3],
    },
  ];

  var CHARTS_IT = [
    {
      id: "marketing",
      title: "Digital marketing e strategia",
      type: "hbar",
      items: [
        { label: "Marketing digitale", value: 95 },
        { label: "Corporate identity", value: 92 },
        { label: "Branding", value: 88 },
        { label: "SEO", value: 86 },
        { label: "Web content management", value: 90 },
      ],
    },
    {
      id: "creative",
      title: "Strumenti creativi",
      type: "donut",
      items: [
        { label: "Creative Cloud", value: 35, color: "var(--sk-accent)" },
        { label: "Canva", value: 20, color: "var(--sk-accent-2)" },
        { label: "Video", value: 20, color: "var(--sk-accent-3)" },
        { label: "Imaging", value: 25, color: "var(--sk-accent-4)" },
      ],
    },
    {
      id: "strategy",
      title: "Competenze strategiche",
      type: "radar",
      items: [
        { label: "Coordinamento progetti", lines: ["Coordinamento", "progetti"], value: 92 },
        { label: "Strategia IT", value: 88 },
        { label: "Soluzioni software", lines: ["Soluzioni", "software"], value: 85 },
        { label: "Key account", value: 94 },
        { label: "Grandi clienti", value: 90 },
        { label: "Fidelizzazione", lines: ["Fidelizza-", "zione"], value: 91 },
      ],
    },
    {
      id: "web",
      title: "Web e digitale",
      type: "vbar",
      items: [
        { label: "CMS", value: 95 },
        { label: "Web design", value: 90 },
        { label: "Immagini", value: 92 },
        { label: "SEO", value: 86 },
        { label: "Strumenti IA", value: 94 },
      ],
    },
    {
      id: "business",
      title: "Business e comunicazione",
      type: "rings",
      items: [
        { label: "Comunicazione", value: 96 },
        { label: "Consulenza", value: 93 },
        { label: "Presentazione", value: 91 },
        { label: "Negoziazione", value: 94 },
      ],
    },
    {
      id: "matrix",
      title: "Matrice competenze",
      type: "heatmap",
      levels: ["Forte", "Molto forte", "Esperto"],
      categories: ["Marketing", "Design", "Strategia", "Web", "IA", "Comunicazione"],
      matrix: [3, 2, 3, 3, 2, 3],
    },
  ];

  function chartsForLang(lang) {
    if (lang === "en") return CHARTS_EN;
    if (lang === "fr") return CHARTS_FR;
    if (lang === "it") return CHARTS_IT;
    return CHARTS_DE;
  }

  function overviewHtml(lang) {
    var ui =
      (window.WeltenTranslations && window.WeltenTranslations.langPack(OVERVIEW_UI, lang)) ||
      OVERVIEW_UI[lang] ||
      OVERVIEW_UI.de;
    return (
      '<div class="welten-skills-overview" data-welten-skills-overview aria-label="' +
      ui.aria +
      '">' +
      '<h3 class="welten-skills-overview__title">' +
      ui.title +
      "</h3>" +
      '<p class="welten-skills-overview__subtitle">' +
      ui.subtitle +
      "</p>" +
      '<div class="welten-skills-charts-grid" role="list"></div>' +
      "</div>"
    );
  }

  function el(tag, cls, html) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function renderHBar(body, items) {
    var wrap = el("div", "welten-skills-hbars");
    items.forEach(function (item) {
      var row = el("div", "welten-skills-hbar-row");
      row.appendChild(el("span", "welten-skills-hbar-label", item.label));
      row.appendChild(el("span", "welten-skills-hbar-val", item.value + "%"));
      var track = el("div", "welten-skills-hbar-track");
      var fill = el("span", "welten-skills-hbar-fill");
      fill.style.setProperty("--sk-pct", item.value + "%");
      track.appendChild(fill);
      row.appendChild(track);
      wrap.appendChild(row);
    });
    body.appendChild(wrap);
  }

  function renderDonut(body, items) {
    var wrap = el("div", "welten-skills-donut-wrap");
    var donut = el("div", "welten-skills-donut");
    donut.style.setProperty("--sk-s0", String(items[0] ? items[0].value : 0));
    donut.style.setProperty("--sk-s1", String(items[1] ? items[1].value : 0));
    donut.style.setProperty("--sk-s2", String(items[2] ? items[2].value : 0));
    donut.setAttribute("role", "img");
    donut.setAttribute(
      "aria-label",
      items.map(function (i) { return i.label + " " + i.value + "%"; }).join(", ")
    );
    wrap.appendChild(donut);
    var legend = el("ul", "welten-skills-donut-legend");
    items.forEach(function (item, idx) {
      var li = document.createElement("li");
      var sw = el("span", "welten-skills-donut-swatch");
      var colors = ["var(--sk-accent)", "var(--sk-accent-2)", "var(--sk-accent-3)", "var(--sk-accent-4)"];
      sw.style.background = item.color || colors[idx % 4];
      li.appendChild(sw);
      li.appendChild(document.createTextNode(item.label + " · " + item.value + "%"));
      legend.appendChild(li);
    });
    wrap.appendChild(legend);
    body.appendChild(wrap);
  }

  function radarPoint(cx, cy, r, angleDeg, pct) {
    var rad = ((angleDeg - 90) * Math.PI) / 180;
    var d = (pct / 100) * r;
    return [cx + Math.cos(rad) * d, cy + Math.sin(rad) * d];
  }

  function radarLabelAnchor(angleDeg) {
    var a = ((angleDeg % 360) + 360) % 360;
    if (a < 28 || a > 332) return "middle";
    if (a > 32 && a < 148) return "start";
    if (a > 152 && a < 208) return "middle";
    if (a > 212 && a < 328) return "end";
    return "middle";
  }

  function appendRadarLabel(svg, item, cx, cy, maxR, labelGap, angleDeg) {
    var pos = radarPoint(cx, cy, maxR + labelGap, angleDeg, 100);
    var anchor = radarLabelAnchor(angleDeg);
    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("class", "welten-skills-radar-label");
    text.setAttribute("x", pos[0].toFixed(2));
    text.setAttribute("y", pos[1].toFixed(2));
    text.setAttribute("text-anchor", anchor);
    text.setAttribute("dominant-baseline", "middle");

    if (item.lines && item.lines.length > 1) {
      var t1 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      t1.setAttribute("x", pos[0].toFixed(2));
      t1.setAttribute("dy", "-0.55em");
      t1.textContent = item.lines[0];
      var t2 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      t2.setAttribute("x", pos[0].toFixed(2));
      t2.setAttribute("dy", "1.1em");
      t2.textContent = item.lines[1];
      text.appendChild(t1);
      text.appendChild(t2);
    } else {
      text.textContent = item.label;
    }
    svg.appendChild(text);
  }

  function renderRadar(body, chart) {
    var items = chart.items;
    var isStrategy = chart.id === "strategy";
    var cx = isStrategy ? 80 : 70;
    var cy = isStrategy ? 80 : 70;
    var maxR = isStrategy ? 44 : 28;
    var labelGap = isStrategy ? 12 : 0;
    var n = items.length;
    var wrap = el("div", "welten-skills-radar-wrap");
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "welten-skills-radar-svg");
    svg.setAttribute("viewBox", isStrategy ? "0 0 160 160" : "0 0 140 140");
    svg.setAttribute("role", "img");
    svg.setAttribute(
      "aria-label",
      items.map(function (i) { return i.label + " " + i.value + "%"; }).join(", ")
    );

    [0.25, 0.5, 0.75, 1].forEach(function (scale) {
      var pts = [];
      for (var g = 0; g < n; g++) {
        var p = radarPoint(cx, cy, maxR * scale, (360 / n) * g, 100);
        pts.push(p[0].toFixed(2) + "," + p[1].toFixed(2));
      }
      var poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      poly.setAttribute("class", "welten-skills-radar-grid");
      poly.setAttribute("points", pts.join(" "));
      svg.appendChild(poly);
    });

    for (var a = 0; a < n; a++) {
      var angle = (360 / n) * a;
      var end = radarPoint(cx, cy, maxR, angle, 100);
      var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("class", "welten-skills-radar-axis");
      line.setAttribute("x1", String(cx));
      line.setAttribute("y1", String(cy));
      line.setAttribute("x2", end[0].toFixed(2));
      line.setAttribute("y2", end[1].toFixed(2));
      svg.appendChild(line);
    }

    var dataPts = [];
    var vertices = [];
    for (var i = 0; i < n; i++) {
      var angI = (360 / n) * i;
      var pt = radarPoint(cx, cy, maxR, angI, items[i].value);
      dataPts.push(pt[0].toFixed(2) + "," + pt[1].toFixed(2));
      vertices.push({ pt: pt, ang: angI, item: items[i] });
    }

    var area = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    area.setAttribute("class", "welten-skills-radar-area");
    area.setAttribute("points", dataPts.join(" "));
    svg.appendChild(area);

    var edge = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    edge.setAttribute("class", "welten-skills-radar-edge");
    edge.setAttribute("points", dataPts.join(" "));
    svg.appendChild(edge);

    vertices.forEach(function (v) {
      var dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("class", "welten-skills-radar-point");
      dot.setAttribute("cx", v.pt[0].toFixed(2));
      dot.setAttribute("cy", v.pt[1].toFixed(2));
      if (!isStrategy) dot.setAttribute("r", "4");
      svg.appendChild(dot);

      var inner = radarPoint(cx, cy, maxR * (v.item.value / 100) * 0.42, v.ang, 100);
      var valText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      valText.setAttribute("class", "welten-skills-radar-value");
      valText.setAttribute("x", inner[0].toFixed(2));
      valText.setAttribute("y", inner[1].toFixed(2));
      valText.setAttribute("text-anchor", "middle");
      valText.setAttribute("dominant-baseline", "middle");
      valText.textContent = v.item.value + "%";
      svg.appendChild(valText);
    });

    items.forEach(function (item, idx) {
      if (isStrategy) appendRadarLabel(svg, item, cx, cy, maxR, labelGap, (360 / n) * idx);
    });

    wrap.appendChild(svg);
    body.appendChild(wrap);
  }

  function renderVBar(body, items) {
    var wrap = el("div", "welten-skills-vbars");
    items.forEach(function (item) {
      var col = el("div", "welten-skills-vbar-col");
      col.appendChild(el("span", "welten-skills-vbar-pct", item.value + "%"));

      var stack = el("div", "welten-skills-vbar-stack");
      var fill = el("div", "welten-skills-vbar-fill");
      fill.style.setProperty("--sk-vh", item.value + "%");
      stack.appendChild(fill);
      col.appendChild(stack);

      var labelWrap = el("div", "welten-skills-vbar-label-wrap");
      var label = el("span", "welten-skills-vbar-label", item.label);
      label.setAttribute("title", item.label);
      labelWrap.appendChild(label);
      col.appendChild(labelWrap);

      wrap.appendChild(col);
    });
    body.appendChild(wrap);
  }

  function renderRings(body, items) {
    var wrap = el("div", "welten-skills-rings");
    var circumference = 2 * Math.PI * 18;
    items.forEach(function (item) {
      var itemEl = el("div", "welten-skills-ring-item");

      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "welten-skills-ring-svg");
      svg.setAttribute("viewBox", "0 0 44 44");
      var bg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      bg.setAttribute("class", "welten-skills-ring-bg");
      bg.setAttribute("cx", "22");
      bg.setAttribute("cy", "22");
      bg.setAttribute("r", "18");
      var fg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      fg.setAttribute("class", "welten-skills-ring-fg");
      fg.setAttribute("cx", "22");
      fg.setAttribute("cy", "22");
      fg.setAttribute("r", "18");
      var dash = (item.value / 100) * circumference;
      var dashStr = dash.toFixed(2) + " " + circumference.toFixed(2);
      fg.style.setProperty("--sk-ring-dash", dashStr);
      fg.setAttribute("stroke-dasharray", dashStr);

      var pct = document.createElementNS("http://www.w3.org/2000/svg", "text");
      pct.setAttribute("class", "welten-skills-ring-pct");
      pct.setAttribute("x", "22");
      pct.setAttribute("y", "23");
      pct.setAttribute("text-anchor", "middle");
      pct.textContent = item.value + "%";

      svg.appendChild(bg);
      svg.appendChild(fg);
      svg.appendChild(pct);
      itemEl.appendChild(svg);

      var ringLabel = el("span", "welten-skills-ring-label", item.label);
      ringLabel.setAttribute("title", item.label);
      itemEl.appendChild(ringLabel);
      wrap.appendChild(itemEl);
    });
    body.appendChild(wrap);
  }

  function renderHeatmap(body, chart) {
    var wrap = el("div", "welten-skills-heatmap");
    var head = el("div", "welten-skills-heatmap-head");
    head.appendChild(el("span", "welten-skills-heatmap-cat", ""));
    chart.levels.forEach(function (lvl) {
      head.appendChild(el("span", "welten-skills-heatmap-level", lvl));
    });
    wrap.appendChild(head);

    chart.categories.forEach(function (cat, rowIdx) {
      var row = el("div", "welten-skills-heatmap-row");
      row.appendChild(el("span", "welten-skills-heatmap-cat", cat));
      var level = chart.matrix[rowIdx] || 1;
      for (var c = 1; c <= chart.levels.length; c++) {
        var cell = el("div", "welten-skills-heatmap-cell");
        if (c === level) cell.classList.add("is-l" + level);
        cell.setAttribute("aria-hidden", "true");
        row.appendChild(cell);
      }
      wrap.appendChild(row);
    });
    body.appendChild(wrap);
  }

  function renderChart(card, chart) {
    card.appendChild(el("h4", "welten-skills-chart-title", chart.title));
    var body = el("div", "welten-skills-chart-body");
    card.appendChild(body);
    if (chart.type === "hbar") renderHBar(body, chart.items);
    else if (chart.type === "donut") renderDonut(body, chart.items);
    else if (chart.type === "radar") renderRadar(body, chart);
    else if (chart.type === "vbar") renderVBar(body, chart.items);
    else if (chart.type === "rings") renderRings(body, chart.items);
    else if (chart.type === "heatmap") renderHeatmap(body, chart);
  }

  function activateCharts(overview) {
    overview.querySelectorAll(".welten-skills-vbar-fill").forEach(function (fill) {
      fill.classList.add("sk-bar-ready");
    });
    overview.querySelectorAll(".welten-skills-ring-fg").forEach(function (ring) {
      ring.classList.add("sk-ring-ready");
    });
  }

  function buildOverview(container, lang) {
    lang = lang || getLang();
    var existing = container.querySelector("[data-welten-skills-overview]");
    if (existing) {
      if (existing.getAttribute("data-skills-version") === SKILLS_VERSION && existing.getAttribute("data-skills-lang") === lang) return;
      existing.remove();
    }

    container.insertAdjacentHTML("beforeend", overviewHtml(lang));

    var overview = container.querySelector("[data-welten-skills-overview]");
    overview.setAttribute("data-skills-version", SKILLS_VERSION);
    overview.setAttribute("data-skills-lang", lang);
    var grid = overview.querySelector(".welten-skills-charts-grid");

    chartsForLang(lang).forEach(function (chart) {
      var card = el("article", "welten-skills-chart-card glass-card");
      card.setAttribute("role", "listitem");
      card.setAttribute("data-skills-chart", chart.id);
      renderChart(card, chart);
      grid.appendChild(card);
    });

    observeOverview(overview);
  }

  function observeOverview(overview) {
    function onVisible() {
      overview.classList.add("is-inview");
      activateCharts(overview);
    }
    var rect = overview.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      requestAnimationFrame(onVisible);
    }
    if (!("IntersectionObserver" in window)) {
      onVisible();
      return;
    }
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            onVisible();
            obs.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
    );
    obs.observe(overview);
  }

  function init(lang) {
    document.querySelectorAll("[data-welten-leistungen-v1] .slide-inner, [data-welten-strengths-v1] .slide-inner").forEach(function (c) {
      buildOverview(c, lang);
    });
  }

  function boot() {
    var onLeistungen =
      document.body.getAttribute("data-current-slide") === "leistungen" ||
      !!document.querySelector("#slide-leistungen.active");
    if (onLeistungen) {
      init(getLang());
      return;
    }
    document.addEventListener(
      "welten-init-skills-charts",
      function () {
        init(getLang());
      },
      { once: true }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  document.addEventListener("welten-lang-change", function (e) {
    var lang = (e && e.detail && e.detail.lang) || getLang();
    init(lang);
  });

  window.WeltenSkillsCharts = { init: init, getLang: getLang };
})();
