import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILES = ["NEXORA.html", "PROFESSIONAL.html", "FREIRAUM.html"];

const HEAD_SNIPPET = `<link rel="stylesheet" href="assets/welten-skills-charts.css" />
<script src="assets/welten-skills-charts.js" defer></script>
`;

for (const name of FILES) {
  const p = path.join(ROOT, name);
  let html = fs.readFileSync(p, "utf8");

  if (html.includes("welten-skills-charts.css")) {
    console.log(name + ": already linked");
    continue;
  }

  if (!html.includes("</head>")) {
    console.warn(name + ": no </head> found");
    continue;
  }

  html = html.replace("</head>", HEAD_SNIPPET + "</head>");
  fs.writeFileSync(p, html, "utf8");
  console.log(name + ": linked assets/welten-skills-charts.*");
}

console.log("Charts mount via JS on [data-welten-strengths-v1]. Standalone/master use iframes.");
