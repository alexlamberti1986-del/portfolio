/**
 * Ersetzt 3-Welten-Standalone.html durch Shell+Script aus der Quell-HTML,
 * lädt aber NEXORA.html / PROFESSIONAL.html / FREIRAUM.html per src (kein 120MB-Embed).
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
const OUT = path.join(ROOT, "3-Welten-Standalone.html");

async function readLines(filePath, from, to) {
  const lines = [];
  let n = 0;
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath, { encoding: "utf8" }),
      crlfDelay: Infinity,
    });
    rl.on("line", (line) => {
      n++;
      if (n >= from && n <= to) lines.push(line);
      if (n > to) rl.close();
    });
    rl.on("close", () => resolve(lines));
    rl.on("error", reject);
  });
}

async function readTailFrom(filePath, startLine) {
  const lines = [];
  let n = 0;
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath, { encoding: "utf8" }),
      crlfDelay: Infinity,
    });
    rl.on("line", (line) => {
      n++;
      if (n >= startLine) lines.push(line);
    });
    rl.on("close", () => resolve(lines));
    rl.on("error", reject);
  });
}

const NEXORA_ARROW_CSS = `body[data-world="nexora"] .dna-arrow,
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
}`;

/* Shell aus Quelle (Zeilen 1–35), PRO start, externe iframe-src */
const SHELL = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<title>Alex Lamberti | 3 Welten (Standalone)</title>
<style>
  html, body { margin:0; height:100%; overflow:hidden; font-family:system-ui,-apple-system,sans-serif; }
  :root { --bar-h: 56px; }
  .world-bar { position:fixed; top:0; left:0; right:0; z-index:2147483647; display:flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:8px; padding:10px 12px; padding-top:calc(10px + env(safe-area-inset-top,0px)); transition:background .35s ease,border-color .35s ease; }
  .world-bar button { font:inherit; cursor:pointer; padding:10px 22px; border-radius:999px; border:1px solid transparent; transition:border-color .25s ease,background .25s ease,color .25s ease,box-shadow .25s ease; }
  .world-bar button:hover { color:#fff; transform:translateY(-1px); }
  body[data-master-world="nexora"] { background:#050810; }
  body[data-master-world="nexora"] .world-bar { background:rgba(5,8,16,.92); border-bottom:1px solid rgba(142,197,255,.15); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); }
  body[data-master-world="nexora"] .world-bar button { color:rgba(232,238,248,.78); border-color:rgba(142,197,255,.22); background:rgba(18,32,56,.55); }
  body[data-master-world="nexora"] .world-bar button.is-active { color:#fff; border-color:#65d9ff; background:rgba(0,140,255,.22); box-shadow:0 0 28px rgba(0,194,255,.22); }
  body[data-master-world="professional"],
  body[data-master-world="vertex"] { background:#f4f2ee; }
  body[data-master-world="professional"] .world-bar,
  body[data-master-world="vertex"] .world-bar { background:rgba(255,255,255,.94); border-bottom:1px solid rgba(0,0,0,.1); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); }
  body[data-master-world="professional"] .world-bar button,
  body[data-master-world="vertex"] .world-bar button { color:rgba(17,17,17,.55); border-radius:0; border-color:rgba(0,0,0,.14); background:rgba(255,255,255,.65); }
  body[data-master-world="professional"] .world-bar button.is-active,
  body[data-master-world="vertex"] .world-bar button.is-active { color:#fff; background:#111; border-color:#111; box-shadow:0 10px 26px rgba(0,0,0,.12); }
  body[data-master-world="freiraum"] { background:#1c1026; }
  body[data-master-world="freiraum"] .world-bar { background:rgba(28,16,38,.94); border-bottom:1px solid rgba(255,209,102,.22); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); }
  body[data-master-world="freiraum"] .world-bar button { color:rgba(255,248,239,.75); border-color:rgba(255,209,102,.28); background:rgba(55,24,62,.45); }
  body[data-master-world="freiraum"] .world-bar button.is-active { color:#24142f; border-color:rgba(255,209,102,.65); background:linear-gradient(135deg,#ffd166,#ff8bbd); box-shadow:0 10px 32px rgba(255,111,174,.22); }
  .world-frame { position:fixed; left:0; right:0; bottom:0; top:var(--bar-h,56px); width:100%; height:calc(100% - var(--bar-h,56px)); border:0; display:none; }
  .world-frame.is-active { display:block; }
  @media (max-width:720px) { .world-bar button { padding:8px 12px; font-size:.86rem; } }
</style>
</head>
<body data-master-world="professional">
<div class="world-bar" role="group" aria-label="Designwelt wählen">
  <button type="button" data-world="nexora">NEXORA</button>
  <button type="button" class="is-active" data-world="professional">PROFESSIONAL</button>
  <button type="button" data-world="freiraum">FREIRAUM</button>
</motion>
<iframe class="world-frame" title="NEXORA" data-world="nexora" data-src="NEXORA.html"></iframe>
<iframe class="world-frame is-active" title="PROFESSIONAL" data-world="professional" data-src="PROFESSIONAL.html"></iframe>
<iframe class="world-frame" title="FREIRAUM" data-world="freiraum" data-src="FREIRAUM.html"></iframe>
`.replace("</motion>", "</div>");

const SCRIPT = `
<script>
(function () {
  var CHAPTERS = ["home","about","profile","values","strengths","projects","experience","workstyle","why","faq","contact"];
  var sharedChapter = "home";
  var bar = document.querySelector(".world-bar");
  var frames = Array.from(document.querySelectorAll(".world-frame"));
  var buttons = Array.from(document.querySelectorAll(".world-bar button"));
  var loaded = {};

  var NEXORA_ARROW_CSS = ${JSON.stringify(NEXORA_ARROW_CSS)};

  function setBarHeight() {
    var h = bar ? bar.offsetHeight : 56;
    document.documentElement.style.setProperty("--bar-h", h + "px");
  }
  window.addEventListener("resize", setBarHeight, { passive: true });
  setBarHeight();

  function masterKey(world) {
    return world === "professional" ? "vertex" : world;
  }

  function setMasterWorld(world) {
    document.body.setAttribute("data-master-world", world === "professional" ? "professional" : world);
  }

  function readChapter(frame) {
    try {
      var d = frame.contentDocument;
      if (!d || !d.body) return null;
      var b = d.body.getAttribute("data-current-slide");
      if (b && CHAPTERS.indexOf(b) >= 0) return b;
      var a = d.querySelector(".slide.active[data-slide]");
      if (a) {
        var id = a.getAttribute("data-slide");
        if (id && CHAPTERS.indexOf(id) >= 0) return id;
      }
    } catch (e) {}
    return null;
  }

  function applyChapter(frame, chapterId) {
    var id = CHAPTERS.indexOf(chapterId) >= 0 ? chapterId : "home";
    try {
      var d = frame.contentDocument;
      if (d) {
        var link = d.querySelector('.menu-links a[data-go="' + id + '"]');
        if (link) { link.click(); return; }
      }
    } catch (e1) {}
    if (frame.contentWindow) {
      [0, 60, 150, 320, 700].forEach(function (ms) {
        setTimeout(function () {
          try {
            frame.contentWindow.postMessage({ type: "portfolio-go-chapter", chapter: id }, "*");
          } catch (e2) {}
        }, ms);
      });
    }
  }

  function injectNexoraNoArrows(frame) {
    try {
      var d = frame.contentDocument;
      if (!d || d.getElementById("nexora-remove-arrow-controls")) return;
      var st = d.createElement("style");
      st.id = "nexora-remove-arrow-controls";
      st.textContent = NEXORA_ARROW_CSS;
      (d.head || d.documentElement).appendChild(st);
    } catch (e) {}
  }

  function loadFrame(frame, world, cb) {
    var src = frame.getAttribute("data-src");
    if (!src) { if (cb) cb(); return; }
    if (loaded[world] && frame.src && frame.src.indexOf("about:blank") === -1) {
      if (cb) cb();
      return;
    }
    function onLoad() {
      frame.removeEventListener("load", onLoad);
      loaded[world] = true;
      if (world === "nexora") injectNexoraNoArrows(frame);
      if (cb) cb();
    }
    frame.addEventListener("load", onLoad);
    frame.src = src;
  }

  function activeWorld() {
    var f = frames.find(function (x) { return x.classList.contains("is-active"); });
    return f ? f.getAttribute("data-world") : "professional";
  }

  function showWorld(world) {
    var prev = frames.find(function (f) { return f.classList.contains("is-active"); });
    if (prev) {
      var ch = readChapter(prev);
      if (ch) sharedChapter = ch;
    }
    frames.forEach(function (f) {
      f.classList.toggle("is-active", f.getAttribute("data-world") === world);
    });
    buttons.forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-world") === world);
    });
    setMasterWorld(world);
    var target = frames.find(function (f) { return f.getAttribute("data-world") === world; });
    if (!target) return;
    loadFrame(target, world, function () {
      applyChapter(target, sharedChapter);
    });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      showWorld(btn.getAttribute("data-world"));
    });
  });

  window.addEventListener("message", function (e) {
    if (!e.data || e.data.type !== "portfolio-chapter") return;
    if (typeof e.data.chapter === "string" && CHAPTERS.indexOf(e.data.chapter) >= 0) {
      sharedChapter = e.data.chapter;
    }
  });

  showWorld("professional");
})();
</script>
</body>
</html>
`;

async function main() {
  if (!fs.existsSync(SOURCE)) {
    console.warn("Quelle nicht gefunden, nutze eingebaute Shell");
  }
  const out = SHELL + SCRIPT;
  fs.writeFileSync(OUT, out, "utf8");
  console.log("OK:", OUT, (fs.statSync(OUT).size / 1024).toFixed(1), "KB");
}

main();
