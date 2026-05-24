/**
 * Extract PORTFOLIO_INLINE_IMAGES base64 blobs → assets/images/
 * Patch world HTML files to use assets/portfolio-images.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const outDir = path.join(root, "assets", "images");
const appAssets = path.join(root, "Portfolio-App", "app", "assets", "images");

for (const dir of [outDir, appAssets]) {
  fs.mkdirSync(dir, { recursive: true });
}

const srcFile = path.join(root, "PROFESSIONAL.html");
const html = fs.readFileSync(srcFile, "utf8");

const keys = ["nexora", "vertex", "freiraum"];
const extracted = {};

for (const key of keys) {
  const re = new RegExp(`"${key}"\\s*:\\s*"(data:image/([^;]+);base64,([^"]+))"`);
  const m = html.match(re);
  if (!m) {
    console.error("Missing image key:", key);
    process.exit(1);
  }
  const mime = m[2];
  const buf = Buffer.from(m[3], "base64");
  let ext = mime === "webp" ? "webp" : mime === "png" ? "png" : "jpg";
  const filename = `world-${key}.${ext}`;
  for (const dir of [outDir, appAssets]) {
    fs.writeFileSync(path.join(dir, filename), buf);
  }
  extracted[key] = filename;
  console.log("Extracted", key, (buf.length / 1024 / 1024).toFixed(2), "MB →", filename);
}

let sharpOk = false;
try {
  const sharp = (await import("sharp")).default;
  for (const key of ["nexora", "freiraum"]) {
    const pngName = `world-${key}.png`;
    if (extracted[key] !== pngName) continue;
    for (const dir of [outDir, appAssets]) {
      const pngPath = path.join(dir, pngName);
      const webpPath = path.join(dir, `world-${key}.webp`);
      await sharp(pngPath).webp({ quality: 82, effort: 4 }).toFile(webpPath);
      fs.unlinkSync(pngPath);
    }
    extracted[key] = `world-${key}.webp`;
    console.log("Converted", key, "→ webp");
  }
  sharpOk = true;
} catch (e) {
  console.warn("WebP conversion skipped (install sharp for smaller files):", e.message);
}

const paths = {
  nexora: `assets/images/${extracted.nexora}`,
  vertex: `assets/images/${extracted.vertex}`,
  freiraum: `assets/images/${extracted.freiraum}`,
};

const portfolioJs =
  "window.PORTFOLIO_INLINE_IMAGES = " +
  JSON.stringify(paths, null, 2) +
  ";\n" +
  "(function () {\n" +
  "  var r = document.documentElement;\n" +
  "  var m = window.PORTFOLIO_INLINE_IMAGES;\n" +
  '  r.style.setProperty("--portfolio-img-nexora", \'url("\' + m.nexora + \'")\');\n' +
  '  r.style.setProperty("--portfolio-img-vertex", \'url("\' + m.vertex + \'")\');\n' +
  '  r.style.setProperty("--portfolio-img-freiraum", \'url("\' + m.freiraum + \'")\');\n' +
  "})();\n";

for (const base of [path.join(root, "assets"), path.join(root, "Portfolio-App", "app", "assets")]) {
  fs.writeFileSync(path.join(base, "portfolio-images.js"), portfolioJs);
}

const inlineAssignRe =
  /window\.PORTFOLIO_INLINE_IMAGES\s*=\s*\{[\s\S]*?\};\r?\n?\(function\(\)\{var r=document\.documentElement,m=window\.PORTFOLIO_INLINE_IMAGES;r\.style\.setProperty\("--portfolio-img-nexora", "url\(\\""\+m\.nexora\+"\\"\)"\);r\.style\.setProperty\("--portfolio-img-vertex", "url\(\\""\+m\.vertex\+"\\"\)"\);r\.style\.setProperty\("--portfolio-img-freiraum", "url\(\\""\+m\.freiraum\+"\\"\)"\);\}\)\(\);\r?\n?/g;

const imagesBlockRe =
  /var IMAGES = \{[\s\S]*?\};\r?\n\s*window\.PORTFOLIO_INLINE_IMAGES = IMAGES;\r?\n[\s\S]*?setProperty\("--portfolio-img-freiraum", "url\('" \+ IMAGES\.freiraum \+ "'\)"\);\r?\n?/g;

const replaceTag = '<script src="assets/portfolio-images.js"></script>\n';

function patchHtml(filePath) {
  let c = fs.readFileSync(filePath, "utf8");
  const before = c.length;
  c = c.replace(inlineAssignRe, replaceTag);
  c = c.replace(imagesBlockRe, "");
  if (!c.includes("portfolio-images.js") && before === c.length) {
    console.warn("No inline block replaced in", filePath);
  }
  fs.writeFileSync(filePath, c);
  const after = c.length;
  console.log(
    path.basename(filePath),
    ":",
    (before / 1024 / 1024).toFixed(2),
    "MB →",
    (after / 1024 / 1024).toFixed(2),
    "MB"
  );
}

const htmlFiles = [
  path.join(root, "NEXORA.html"),
  path.join(root, "PROFESSIONAL.html"),
  path.join(root, "FREIRAUM.html"),
  path.join(root, "Portfolio-App", "app", "NEXORA.html"),
  path.join(root, "Portfolio-App", "app", "PROFESSIONAL.html"),
  path.join(root, "Portfolio-App", "app", "FREIRAUM.html"),
];

for (const f of htmlFiles) {
  patchHtml(f);
}

console.log("Done. sharp:", sharpOk, "images:", paths);
