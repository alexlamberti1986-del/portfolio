import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const outDir = path.join(root, "assets", "images");
const appOut = path.join(root, "Portfolio-App", "app", "assets", "images");

const nexoraVars = [
  { cssVar: "--virtual-data-bg", file: "nexora-virtual-data-bg" },
  { cssVar: "--virtual-brain-img", file: "nexora-virtual-brain" },
  { cssVar: "--home-brain-real", file: "nexora-home-brain" },
];

function extractDataUrl(html, cssVar) {
  const re = new RegExp(
    cssVar.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
      '\\s*:\\s*url\\("(data:image/([^;]+);base64,([^"]+))"\\)'
  );
  const m = html.match(re);
  if (!m) return null;
  return { full: m[1], mime: m[2], b64: m[3] };
}

function saveImage(name, mime, b64) {
  const ext = mime === "webp" ? "webp" : mime === "png" ? "png" : "jpg";
  const filename = `${name}.${ext}`;
  const buf = Buffer.from(b64, "base64");
  for (const dir of [outDir, appOut]) {
    fs.writeFileSync(path.join(dir, filename), buf);
  }
  console.log("Saved", filename, (buf.length / 1024 / 1024).toFixed(2), "MB");
  return `assets/images/${filename}`;
}

for (const file of [
  path.join(root, "NEXORA.html"),
  path.join(root, "Portfolio-App", "app", "NEXORA.html"),
]) {
  let html = fs.readFileSync(file, "utf8");
  let changed = false;
  for (const item of nexoraVars) {
    const hit = extractDataUrl(html, item.cssVar);
    if (!hit) continue;
    const urlPath = saveImage(item.file, hit.mime, hit.b64);
    const re = new RegExp(
      "(" +
        item.cssVar.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
        '\\s*:\\s*)url\\("data:image/[^"]+"\\)',
      "g"
    );
    html = html.replace(re, `$1url("${urlPath}")`);
    changed = true;
  }
  // Duplicate brain background in style block
  const brainRe =
    /background:\s*url\("(data:image\/webp;base64,[^"]+)"\)/g;
  let count = 0;
  html = html.replace(brainRe, (match, dataUrl) => {
    if (count++ > 0) return match;
    const m = dataUrl.match(/^data:image\/([^;]+);base64,(.+)$/);
    if (!m) return match;
    const urlPath = saveImage("nexora-brain-bg", m[1], m[2]);
    return `background: url("${urlPath}")`;
  });
  if (changed) {
    fs.writeFileSync(file, html);
    console.log("Patched", path.basename(file), (html.length / 1024 / 1024).toFixed(2), "MB");
  }
}
