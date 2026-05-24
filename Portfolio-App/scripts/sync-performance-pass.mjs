import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const broken = `  <script>
<script src="assets/portfolio-images.js"></script>
</script>`;
const fixed = `<script src="assets/portfolio-images.js"></script>`;

const htmlFiles = [
  "NEXORA.html",
  "PROFESSIONAL.html",
  "FREIRAUM.html",
].flatMap((f) => [
  path.join(root, f),
  path.join(root, "Portfolio-App", "app", f),
]);

for (const file of htmlFiles) {
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, "utf8");
  if (html.includes(broken)) {
    html = html.replace(broken, fixed);
    fs.writeFileSync(file, html);
    console.log("Fixed script tag:", path.basename(file));
  }
}

const copyPairs = [
  ["Portfolio-App/app/assets/transition-engine.js", "assets/transition-engine.js"],
  ["Portfolio-App/app/assets/world-transition.css", "assets/world-transition.css"],
  ["Portfolio-App/app/assets/shell-performance.css", "assets/shell-performance.css"],
  ["Portfolio-App/app/assets/welten-mobile-performance.js", "assets/welten-mobile-performance.js"],
  ["Portfolio-App/app/assets/portfolio-images.js", "assets/portfolio-images.js"],
  ["Portfolio-App/app/shell.js", "shell.js"],
];

for (const [fromRel, toRel] of copyPairs) {
  const from = path.join(root, fromRel);
  const to = path.join(root, toRel);
  if (!fs.existsSync(from)) continue;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  console.log("Synced", toRel);
}

const imgFrom = path.join(root, "Portfolio-App/app/assets/images");
const imgTo = path.join(root, "assets/images");
if (fs.existsSync(imgFrom)) {
  fs.mkdirSync(imgTo, { recursive: true });
  for (const name of fs.readdirSync(imgFrom)) {
    fs.copyFileSync(path.join(imgFrom, name), path.join(imgTo, name));
  }
  console.log("Synced images", fs.readdirSync(imgFrom).length);
}
