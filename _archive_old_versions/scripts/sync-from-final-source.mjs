/**
 * Synchronisiert Projekt aus Alex_Lamberti_3_Welten_FINAL_DIRECT_FIXED_PRO_START_NO_NEXORA_ARROWS.html
 * node scripts/sync-from-final-source.mjs
 */
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SOURCE = path.join(
  "c:",
  "Users",
  "alexl",
  "Desktop",
  "Alex_Lamberti_3_Welten_FINAL_DIRECT_FIXED_PRO_START_NO_NEXORA_ARROWS.html"
);
const ARCHIVE = path.join(ROOT, "_archive_old_versions");

const NEXORA_ARROW_CSS = `
<style id="nexora-remove-arrow-controls">
body[data-world="nexora"] .dna-arrow,
body[data-world="nexora"] .dna-nav-arrow,
body[data-world="nexora"] .dna-control,
body[data-world="nexora"] .dna-controls,
body[data-world="nexora"] .orbit-arrow,
body[data-world="nexora"] .orbit-control,
body[data-world="nexora"] .orbit-controls,
body[data-world="nexora"] .hero-arrow,
body[data-world="nexora"] .hero-arrows,
body[data-world="nexora"] .carousel-arrow,
body[data-world="nexora"] .carousel-controls,
body[data-world="nexora"] .spiral-arrow,
body[data-world="nexora"] .spiral-controls,
body[data-world="nexora"] button[aria-label*="Weiter"],
body[data-world="nexora"] button[aria-label*="Zurück"],
body[data-world="nexora"] button[aria-label*="Next"],
body[data-world="nexora"] button[aria-label*="Previous"] {
  display: none !important;
  visibility: hidden !important;
  pointer-events: none !important;
}
</style>`;

const FORBIDDEN = [
  "nexoraHoloCanvas",
  "freiraumPaintCanvas",
  "nexoraPaintCanvas",
  "nexora-webgl-dna",
  "drawHolo",
  "BUSINESS_SHADER",
  "Lade Portfolio",
];

async function readLineN(filePath, targetLine) {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath, { encoding: "utf8" });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
    let n = 0;
    let found = null;
    rl.on("line", (line) => {
      n++;
      if (n === targetLine) {
        found = line;
        rl.close();
        stream.destroy();
      }
    });
    rl.on("close", () => resolve(found));
    rl.on("error", reject);
    stream.on("error", reject);
  });
}

async function readHeadTail(filePath) {
  const head = [];
  let tail = "";
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath, { encoding: "utf8" });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
    let n = 0;
    const tailLines = [];
    rl.on("line", (line) => {
      n++;
      if (n < 38) head.push(line);
      else if (n > 38) tailLines.push(line);
    });
    rl.on("close", () => {
      tail = tailLines.join("\n");
      resolve({ head, tail });
    });
    rl.on("error", reject);
  });
}

function ensureNexoraNoArrows(html) {
  if (html.includes("nexora-remove-arrow-controls")) return html;
  return html.replace("</head>", NEXORA_ARROW_CSS + "\n</head>");
}

function normalizeProfessionalWorld(html) {
  /* Quelle: professional — Projekt-Kompatibilität: vertex als Alias */
  let out = html;
  if (!out.includes('data-world="professional"') && !out.includes("data-world='professional'")) {
    return out;
  }
  out = out.replace(/\bdata-world="professional"/g, 'data-world="vertex"');
  out = out.replace(/\bdata-world='professional'/g, "data-world='vertex'");
  out = out.replace(/data-world-set="professional"/g, 'data-world-set="vertex"');
  out = out.replace(/\[data-world="professional"\]/g, '[data-world="vertex"]');
  out = out.replace(/\[data-world='professional'\]/g, "[data-world='vertex']");
  out = out.replace(/body\[data-world="professional"\]/g, 'body[data-world="vertex"]');
  return out;
}

function checkForbidden(label, text) {
  for (const term of FORBIDDEN) {
    if (text.includes(term)) {
      console.warn("WARN", label, "contains forbidden:", term);
    }
  }
}

async function extractWorlds() {
  if (!fs.existsSync(SOURCE)) {
    throw new Error("Quelldatei nicht gefunden: " + SOURCE);
  }
  console.log("Lese WORLDS (Zeile 38) …");
  const line38 = await readLineN(SOURCE, 38);
  if (!line38 || !line38.includes("const WORLDS")) {
    throw new Error("Zeile 38 mit const WORLDS nicht gefunden");
  }
  console.log("Parse WORLDS …", Math.round(line38.length / 1024 / 1024), "MB");
  const worlds = new Function(line38.trim() + "\n;return WORLDS;")();
  const keys = Object.keys(worlds);
  console.log("Welten:", keys.join(", "));
  if (!worlds.nexora || !worlds.professional || !worlds.freiraum) {
    throw new Error("Erwartet: nexora, professional, freiraum — gefunden: " + keys.join(", "));
  }
  return worlds;
}

const SKILLS_HEAD = `<link rel="stylesheet" href="assets/welten-skills-charts.css" />
<script src="assets/welten-skills-charts.js" defer></script>
`;

function injectSkillsCharts(html) {
  if (html.includes("welten-skills-charts.css")) return html;
  return html.replace("</head>", SKILLS_HEAD + "</head>");
}

function writeWorldFiles(worlds) {
  const nex = injectSkillsCharts(ensureNexoraNoArrows(worlds.nexora));
  const pro = injectSkillsCharts(normalizeProfessionalWorld(worlds.professional));
  const fri = injectSkillsCharts(worlds.freiraum);

  const paths = {
    nexora: path.join(ROOT, "NEXORA.html"),
    professional: path.join(ROOT, "PROFESSIONAL.html"),
    freiraum: path.join(ROOT, "FREIRAUM.html"),
  };

  fs.writeFileSync(paths.nexora, nex, "utf8");
  fs.writeFileSync(paths.professional, pro, "utf8");
  fs.writeFileSync(paths.freiraum, fri, "utf8");

  for (const [k, p] of Object.entries(paths)) {
    const mb = (fs.statSync(p).size / 1024 / 1024).toFixed(1);
    console.log("geschrieben:", path.basename(p), mb, "MB");
    checkForbidden(path.basename(p), fs.readFileSync(p, "utf8"));
  }
}

/* —— Standalone (PRO start, alle Welten in einer Datei) —— */
const SLIDE_HOME_RE =
  /<section\b[^>]*\bid\s*=\s*["']slide-home["'][^>]*>[\s\S]*?<\/section>/i;
const STYLE_WITH_ID_RE =
  /<style\b[^>]*\bid\s*=\s*["']([^"']+)["'][^>]*>[\s\S]*?<\/style>/gi;

function extractStyleMap(html) {
  const map = new Map();
  let m;
  const re = new RegExp(STYLE_WITH_ID_RE.source, "gi");
  while ((m = re.exec(html)) !== null) map.set(m[1], m[0]);
  return map;
}

function removeAllStylesWithId(html) {
  return html.replace(STYLE_WITH_ID_RE, "");
}

function extractSlideHome(html) {
  const m = html.match(SLIDE_HOME_RE);
  return m ? m[0] : null;
}

function stripMasterBridge(html) {
  return html.replace(
    /<script\b[^>]*id\s*=\s*["']portfolio-master-bridge["'][^>]*>[\s\S]*?<\/script>/gi,
    ""
  );
}

function mergeStyleMaps(...maps) {
  const out = new Map();
  for (const m of maps) for (const [k, v] of m) out.set(k, v);
  return out;
}

const MASTER_BAR_CSS = `
<style id="welten-standalone-master-bar">
html { --bar-h: 56px; }
html, body { overflow-x: hidden; }
body { margin: 0; min-height: 100%; }
main.slides-root, .slides-root {
  padding-top: calc(var(--header-h, 72px) + var(--bar-h, 56px)) !important;
}
.world-bar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 2147483647;
  display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 8px;
  padding: 10px 12px;
  padding-top: calc(10px + env(safe-area-inset-top, 0px));
  transition: background 0.35s ease, border-color 0.35s ease;
}
.world-bar button {
  font: inherit; cursor: pointer;
  padding: 10px 16px; border-radius: 999px;
  border: 1px solid transparent;
}
body[data-master-world="nexora"] .world-bar {
  background: rgba(5, 8, 16, 0.92);
  border-bottom: 1px solid rgba(142, 197, 255, 0.15);
  backdrop-filter: blur(12px);
}
body[data-master-world="nexora"] .world-bar button {
  color: rgba(232, 238, 248, 0.78);
  border-color: rgba(142, 197, 255, 0.22);
  background: rgba(18, 32, 56, 0.55);
}
body[data-master-world="nexora"] .world-bar button.is-active {
  color: #fff; border-color: #65d9ff;
  background: rgba(0, 140, 255, 0.22);
  box-shadow: 0 0 28px rgba(0, 194, 255, 0.22);
}
body[data-master-world="vertex"] .world-bar,
body[data-master-world="professional"] .world-bar {
  background: rgba(255, 255, 255, 0.94);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
body[data-master-world="vertex"] .world-bar button,
body[data-master-world="professional"] .world-bar button {
  color: rgba(17, 17, 17, 0.55);
  border-radius: 0;
  border-color: rgba(0, 0, 0, 0.14);
  background: rgba(255, 255, 255, 0.65);
}
body[data-master-world="vertex"] .world-bar button.is-active,
body[data-master-world="professional"] .world-bar button.is-active {
  color: #fff; background: #111; border-color: #111;
}
body[data-master-world="freiraum"] .world-bar {
  background: rgba(28, 16, 38, 0.94);
  border-bottom: 1px solid rgba(255, 209, 102, 0.22);
}
body[data-master-world="freiraum"] .world-bar button {
  color: rgba(255, 248, 239, 0.75);
  border-color: rgba(255, 209, 102, 0.28);
  background: rgba(55, 24, 62, 0.45);
}
body[data-master-world="freiraum"] .world-bar button.is-active {
  color: #24142f;
  background: linear-gradient(135deg, #ffd166, #ff8bbd);
}
html[data-standalone-master="1"] .world-switch {
  display: none !important;
  pointer-events: none !important;
  position: absolute !important;
  left: -9999px !important;
}
</style>`;

const MASTER_BAR = `
<div class="world-bar" role="group" aria-label="Designwelt wählen">
  <button type="button" data-iframe="0" data-world-key="nexora">NEXORA</button>
  <button type="button" class="is-active" data-iframe="1" data-world-key="vertex">PROFESSIONAL</button>
  <button type="button" data-iframe="2" data-world-key="freiraum">FREIRAUM</button>
</div>`;

const MASTER_BAR_SCRIPT = `
<script id="welten-standalone-master-script">
(function () {
  document.documentElement.setAttribute("data-standalone-master", "1");
  var CHAPTERS = ["home","about","profile","values","strengths","projects","experience","workstyle","why","faq","contact"];
  var sharedChapter = "home";
  var bar = document.querySelector(".world-bar");
  if (!bar) return;
  function readChapter() {
    var b = document.body.getAttribute("data-current-slide");
    if (b && CHAPTERS.indexOf(b) >= 0) return b;
    var a = document.querySelector(".slide.active[data-slide]");
    return a ? a.getAttribute("data-slide") : null;
  }
  function applyChapter(id) {
    var ch = CHAPTERS.indexOf(id) >= 0 ? id : "home";
    var link = document.querySelector('.menu-links a[data-go="' + ch + '"]');
    if (link) link.click();
  }
  function setMaster(key) {
    document.body.setAttribute("data-master-world", key);
  }
  function setActive(i) {
    var ch = readChapter();
    if (ch) sharedChapter = ch;
    var keys = ["nexora", "vertex", "freiraum"];
    var key = keys[i];
    var wbtn = document.querySelector('.world-btn[data-world-set="' + key + '"]');
    if (wbtn) wbtn.click();
    bar.querySelectorAll("button").forEach(function (b, j) {
      b.classList.toggle("is-active", j === i);
    });
    setMaster(key);
    setTimeout(function () { applyChapter(sharedChapter); }, 120);
  }
  bar.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-iframe]");
    if (!btn) return;
    setActive(parseInt(btn.getAttribute("data-iframe"), 10));
  });
  document.body.setAttribute("data-world", "vertex");
  document.body.setAttribute("data-master-world", "vertex");
  setTimeout(function () {
    var pro = document.querySelector('.world-btn[data-world-set="vertex"]');
    if (pro) pro.click();
    setActive(1);
  }, 0);
})();
</script>`;

function buildStandalone() {
  const nex = fs.readFileSync(path.join(ROOT, "NEXORA.html"), "utf8");
  const pro = fs.readFileSync(path.join(ROOT, "PROFESSIONAL.html"), "utf8");
  const fri = fs.readFileSync(path.join(ROOT, "FREIRAUM.html"), "utf8");

  const homeFri = extractSlideHome(fri);
  const homeNex = extractSlideHome(nex);
  if (!homeFri || !homeNex) throw new Error("slide-home fehlt");

  let out = nex.replace(homeNex, homeFri);
  const maps = mergeStyleMaps(extractStyleMap(nex), extractStyleMap(pro), extractStyleMap(fri));
  out = removeAllStylesWithId(out);
  const mergedStyles =
    "\n" +
    [...maps.keys()]
      .sort()
      .map((id) => maps.get(id))
      .join("\n");
  out = out.replace("</head>", mergedStyles + "\n</head>");
  out = stripMasterBridge(out);
  out = out.replace(/<title>[^<]*<\/title>/i, "<title>Alex Lamberti | 3 Welten (Standalone)</title>");
  out = out.replace("</head>", MASTER_BAR_CSS.trim() + "\n</head>");
  out = out.replace(/<body([^>]*)>/i, (m, attrs) => {
    const clean = attrs.replace(/\s*data-world="[^"]*"/, "").replace(/\s*data-master-world="[^"]*"/, "");
    return '<body data-world="vertex" data-master-world="vertex"' + clean + ">\n" + MASTER_BAR + "\n" + MASTER_BAR_SCRIPT;
  });
  const outPath = path.join(ROOT, "3-Welten-Standalone.html");
  fs.writeFileSync(outPath, out, "utf8");
  console.log("Standalone:", outPath, (fs.statSync(outPath).size / 1024 / 1024).toFixed(1), "MB");
}

function buildIframeMaster() {
  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<title>Alex Lamberti | Welten (NEXORA · PROFESSIONAL · FREIRAUM)</title>
<style>
* { cursor: default; }
button, a, [role="button"] { cursor: pointer; }
html, body { margin: 0; height: 100%; overflow: hidden; font-family: system-ui, sans-serif; }
:root { --bar-h: 56px; }
.world-bar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 2147483647;
  display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 8px;
  padding: 10px 12px;
  padding-top: calc(10px + env(safe-area-inset-top, 0px));
  transition: background 0.35s ease, border-color 0.35s ease;
}
.world-bar button {
  font: inherit; cursor: pointer;
  padding: 10px 16px; border-radius: 999px;
  border: 1px solid transparent;
  transition: border-color 0.25s ease, background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
}
.world-frame {
  position: fixed; left: 0; right: 0; bottom: 0; top: var(--bar-h, 56px);
  width: 100%; height: calc(100% - var(--bar-h, 56px));
  border: 0; display: none;
}
.world-frame.is-active { display: block; }
body[data-master-world="nexora"] { background: #050810; }
body[data-master-world="nexora"] .world-bar {
  background: rgba(5, 8, 16, 0.92);
  border-bottom: 1px solid rgba(142, 197, 255, 0.15);
  backdrop-filter: blur(12px);
}
body[data-master-world="nexora"] .world-bar button {
  color: rgba(232, 238, 248, 0.78);
  border-color: rgba(142, 197, 255, 0.22);
  background: rgba(18, 32, 56, 0.55);
}
body[data-master-world="nexora"] .world-bar button.is-active {
  color: #fff; border-color: #65d9ff;
  background: rgba(0, 140, 255, 0.22);
  box-shadow: 0 0 28px rgba(0, 194, 255, 0.22);
}
body[data-master-world="vertex"] { background: #f4f2ee; }
body[data-master-world="vertex"] .world-bar {
  background: rgba(255, 255, 255, 0.94);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}
body[data-master-world="vertex"] .world-bar button {
  color: rgba(17, 17, 17, 0.55);
  border-radius: 0;
  border-color: rgba(0, 0, 0, 0.14);
  background: rgba(255, 255, 255, 0.65);
}
body[data-master-world="vertex"] .world-bar button.is-active {
  color: #fff; background: #111; border-color: #111;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.12);
}
body[data-master-world="freiraum"] { background: #1c1026; }
body[data-master-world="freiraum"] .world-bar {
  background: rgba(28, 16, 38, 0.94);
  border-bottom: 1px solid rgba(255, 209, 102, 0.22);
  backdrop-filter: blur(12px);
}
body[data-master-world="freiraum"] .world-bar button {
  color: rgba(255, 248, 239, 0.75);
  border-color: rgba(255, 209, 102, 0.28);
  background: rgba(55, 24, 62, 0.45);
}
body[data-master-world="freiraum"] .world-bar button.is-active {
  color: #24142f;
  background: linear-gradient(135deg, #ffd166, #ff8bbd);
  box-shadow: 0 10px 32px rgba(255, 111, 174, 0.22);
}
</style>
</head>
<body data-master-world="vertex">
<div class="world-bar" role="group" aria-label="Designwelt wählen">
  <button type="button" data-iframe="0" data-world-key="nexora">NEXORA</button>
  <button type="button" class="is-active" data-iframe="1" data-world-key="vertex">PROFESSIONAL</button>
  <button type="button" data-iframe="2" data-world-key="freiraum">FREIRAUM</button>
</div>
<iframe class="world-frame" title="NEXORA" data-lazy-src="NEXORA.html" src="about:blank"></iframe>
<iframe class="world-frame is-active" title="PROFESSIONAL" src="PROFESSIONAL.html"></iframe>
<iframe class="world-frame" title="FREIRAUM" data-lazy-src="FREIRAUM.html" src="about:blank"></iframe>
<script>
(function () {
  var CHAPTERS = ["home","about","profile","values","strengths","projects","experience","workstyle","why","faq","contact"];
  var sharedChapter = "home";
  var bar = document.querySelector(".world-bar");
  var frames = document.querySelectorAll(".world-frame");
  function isOur(win) {
    if (!win) return false;
    for (var i = 0; i < frames.length; i++) {
      try { if (frames[i].contentWindow === win) return true; } catch (e) {}
    }
    return false;
  }
  window.addEventListener("message", function (e) {
    if (!e.data || e.data.type !== "portfolio-chapter") return;
    if (!isOur(e.source)) return;
    if (typeof e.data.chapter === "string" && CHAPTERS.indexOf(e.data.chapter) >= 0) sharedChapter = e.data.chapter;
  });
  function readChapter(f) {
    try {
      var d = f.contentDocument;
      if (!d || !d.body) return null;
      var b = d.body.getAttribute("data-current-slide");
      if (b && CHAPTERS.indexOf(b) >= 0) return b;
      var a = d.querySelector(".slide.active[data-slide]");
      if (a) { var id = a.getAttribute("data-slide"); if (id && CHAPTERS.indexOf(id) >= 0) return id; }
    } catch (err) {}
    return null;
  }
  function applyChapter(f, id) {
    var ch = CHAPTERS.indexOf(id) >= 0 ? id : "home";
    try {
      var d = f.contentDocument;
      if (d) {
        var link = d.querySelector('.menu-links a[data-go="' + ch + '"]');
        if (link) { link.click(); return; }
      }
    } catch (e1) {}
    if (f.contentWindow) {
      [0, 60, 150, 320, 700].forEach(function (ms) {
        setTimeout(function () {
          try { f.contentWindow.postMessage({ type: "portfolio-go-chapter", chapter: ch }, "*"); } catch (e2) {}
        }, ms);
      });
    }
  }
  function activeIdx() {
    var idx = -1;
    frames.forEach(function (f, j) { if (f.classList.contains("is-active")) idx = j; });
    return idx;
  }
  function setMaster(i) {
    var btn = bar.querySelector('button[data-iframe="' + i + '"]');
    var key = btn && btn.getAttribute("data-world-key");
    if (!key) key = i === 0 ? "nexora" : i === 1 ? "vertex" : "freiraum";
    document.body.setAttribute("data-master-world", key);
  }
  function setActive(i) {
    var prev = activeIdx();
    if (prev >= 0) { var c = readChapter(frames[prev]); if (c) sharedChapter = c; }
    frames.forEach(function (f, j) {
      var show = j === i;
      f.classList.toggle("is-active", show);
      if (!show) return;
      var lazy = f.getAttribute("data-lazy-src");
      var blank = !f.src || f.src.indexOf("about:blank") !== -1;
      if (lazy && blank) {
        function onLoad() {
          f.removeEventListener("load", onLoad);
          applyChapter(f, sharedChapter);
        }
        f.addEventListener("load", onLoad);
        f.src = lazy;
      } else {
        setTimeout(function () { applyChapter(f, sharedChapter); }, 80);
      }
    });
    bar.querySelectorAll("button").forEach(function (b, j) { b.classList.toggle("is-active", j === i); });
    setMaster(i);
  }
  bar.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-iframe]");
    if (!btn) return;
    setActive(parseInt(btn.getAttribute("data-iframe"), 10));
  });
})();
</script>
</body>
</html>`;

  fs.writeFileSync(path.join(ROOT, "3-Welten-Master-iframe.html"), html, "utf8");
  console.log("Iframe-Master aktualisiert (Start: PROFESSIONAL)");
}

function archiveOldFiles() {
  fs.mkdirSync(ARCHIVE, { recursive: true });
  const keep = new Set([
    "NEXORA.html",
    "PROFESSIONAL.html",
    "FREIRAUM.html",
    "3-Welten-Standalone.html",
    "3-Welten-Master-iframe.html",
    "README.txt",
    "assets",
    "scripts",
    "_archive_old_versions",
  ]);

  const movePatterns = [
    /\.mjs$/,
    /patch-|apply-welten|welten-|fix-frei|snip-frei/i,
  ];

  for (const name of fs.readdirSync(ROOT)) {
    if (keep.has(name)) continue;
    const full = path.join(ROOT, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (name.startsWith("Alex-") || name === "portfolio-app" || name === "Alex_Lamberti") {
        const dest = path.join(ARCHIVE, name);
        if (!fs.existsSync(dest)) {
          fs.renameSync(full, dest);
          console.log("archiviert Ordner:", name);
        }
      }
      continue;
    }
    if (!name.endsWith(".html") && !movePatterns.some((re) => re.test(name))) continue;
    const dest = path.join(ARCHIVE, name);
    if (!fs.existsSync(dest)) {
      fs.renameSync(full, dest);
      console.log("archiviert:", name);
    }
  }

  const readme = path.join(ROOT, "README.txt");
  if (!fs.existsSync(readme)) {
    fs.writeFileSync(
      readme,
      `Alex Lamberti – 3 Welten Portfolio (Final)

Öffnen:
- 3-Welten-Master-iframe.html  → Welten per iframe (Start: PROFESSIONAL)
- 3-Welten-Standalone.html      → alle Welten in einer Datei (Start: PROFESSIONAL)
- NEXORA.html / PROFESSIONAL.html / FREIRAUM.html → einzelne Welten

Alle Dateien im gleichen Ordner wie assets/ ablegen. Doppelklick in Chrome/Edge.
Quelle: Alex_Lamberti_3_Welten_FINAL_DIRECT_FIXED_PRO_START_NO_NEXORA_ARROWS.html
`,
      "utf8"
    );
  }
}

function scanActiveForbidden() {
  let bad = false;
  function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      if (name === "_archive_old_versions" || name === "node_modules") continue;
      const st = fs.statSync(full);
      if (st.isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(html|js|mjs)$/i.test(name)) continue;
      const text = fs.readFileSync(full, "utf8");
      for (const term of FORBIDDEN) {
        if (text.includes(term)) {
          console.error("FORBIDDEN in", full, ":", term);
          bad = true;
        }
      }
    }
  }
  walk(ROOT);
  const must = ["weltenMousePaintCanvas"];
  for (const f of ["NEXORA.html", "FREIRAUM.html"]) {
    const t = fs.readFileSync(path.join(ROOT, f), "utf8");
    if (!t.includes("weltenMousePaintCanvas")) console.warn("fehlt weltenMousePaintCanvas in", f);
  }
  return !bad;
}

async function main() {
  console.log("=== Sync aus Quell-HTML ===\n");
  const worlds = await extractWorlds();
  writeWorldFiles(worlds);
  buildStandalone();
  buildIframeMaster();
  archiveOldFiles();
  const ok = scanActiveForbidden();
  console.log(ok ? "\n=== Fertig (Suchcheck OK) ===" : "\n=== Fertig (Suchcheck: Warnungen) ===");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
