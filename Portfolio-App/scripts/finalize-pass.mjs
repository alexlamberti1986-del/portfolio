/**
 * Finalize pass — accordion closed, favicon head snippet
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const FAVICON_HEAD = `<link rel="icon" href="assets/favicon/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="assets/favicon/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="assets/favicon/favicon-16x16.png" />
<link rel="apple-touch-icon" href="assets/favicon/apple-touch-icon.png" />
`;

const htmlFiles = [
  "NEXORA.html",
  "PROFESSIONAL.html",
  "FREIRAUM.html",
  "Portfolio-App/app/index.html",
  "3-Welten-Master-iframe.html",
].map((f) => path.join(root, f));

const partials = [
  path.join(root, "assets/_partials/projects-section-inner.html"),
  path.join(root, "Portfolio-App/app/assets/_partials/projects-section-inner.html"),
];

function patchAccordion(html) {
  html = html.replace(/class="projects-accordion__item is-open"/g, 'class="projects-accordion__item"');
  html = html.replace(
    /class="projects-accordion__trigger" aria-expanded="true"/g,
    'class="projects-accordion__trigger" aria-expanded="false"'
  );
  html = html.replace(
    /(<div class="projects-accordion__panel" id="projects-panel-websites" role="region" aria-labelledby="projects-trigger-websites")(>)/,
    "$1 hidden$2"
  );
  return html;
}

function injectFavicon(html) {
  if (html.includes("assets/favicon/favicon.ico")) return html;
  return html.replace(/<head([^>]*)>/i, `<head$1>\n${FAVICON_HEAD}`);
}

for (const file of [...htmlFiles, ...partials]) {
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, "utf8");
  const before = html;
  html = patchAccordion(html);
  html = injectFavicon(html);
  if (html !== before) {
    fs.writeFileSync(file, html);
    console.log("Patched", path.relative(root, file));
  }
}

for (const name of ["NEXORA.html", "PROFESSIONAL.html", "FREIRAUM.html"]) {
  const from = path.join(root, name);
  const to = path.join(root, "Portfolio-App/app", name);
  if (fs.existsSync(from)) fs.copyFileSync(from, to);
}

console.log("Done");
