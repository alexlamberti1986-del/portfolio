/**
 * Capture mobile/tablet hero screenshots via headless Chrome.
 * Usage: node Portfolio-App/scripts/capture-mobile-hero-screenshots.mjs
 */
import { spawn } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";
import { createReadStream, statSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const outDir = path.join(root, "screenshots-mobile-hero");

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  process.env.LOCALAPPDATA + "\\Google\\Chrome\\Application\\chrome.exe",
].filter(Boolean);

const VIEWS = [
  { name: "nexora-mobile-390x844", file: "NEXORA.html", w: 390, h: 844 },
  { name: "professional-mobile-390x844", file: "PROFESSIONAL.html", w: 390, h: 844 },
  { name: "freiraum-mobile-390x844", file: "FREIRAUM.html", w: 390, h: 844 },
  { name: "nexora-tablet-768x1024", file: "NEXORA.html", w: 768, h: 1024 },
  { name: "professional-tablet-768x1024", file: "PROFESSIONAL.html", w: 768, h: 1024 },
  { name: "freiraum-tablet-768x1024", file: "FREIRAUM.html", w: 768, h: 1024 },
];

function findChrome() {
  for (const p of CHROME_CANDIDATES) {
    try {
      statSync(p);
      return p;
    } catch {
      /* next */
    }
  }
  return null;
}

function contentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (filePath.endsWith(".webp")) return "image/webp";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
  if (filePath.endsWith(".ico")) return "image/x-icon";
  if (filePath.endsWith(".woff2")) return "font/woff2";
  return "application/octet-stream";
}

function startServer(port) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      const safe = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
      let filePath = path.join(root, safe === path.sep ? "index.html" : safe.replace(/^\//, ""));
      try {
        if (!statSync(filePath).isFile()) {
          res.writeHead(404);
          res.end("Not found");
          return;
        }
      } catch {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      res.writeHead(200, { "Content-Type": contentType(filePath) });
      createReadStream(filePath).pipe(res);
    });
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

function runChrome(chrome, url, outFile, w, h) {
  return new Promise((resolve, reject) => {
    const args = [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      `--window-size=${w},${h}`,
      `--screenshot=${outFile}`,
      url,
    ];
    const proc = spawn(chrome, args, { stdio: "inherit" });
    proc.on("error", reject);
    proc.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Chrome exit ${code}`));
    });
  });
}

async function main() {
  const chrome = findChrome();
  if (!chrome) {
    console.error("Chrome not found. Set CHROME_PATH or install Google Chrome.");
    process.exit(1);
  }

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const server = await startServer(8765);
  const base = "http://127.0.0.1:8765";

  for (const view of VIEWS) {
    const url = `${base}/${view.file}`;
    const outFile = path.join(outDir, `${view.name}.png`);
    console.log(`Capturing ${view.name} ...`);
    await runChrome(chrome, url, outFile, view.w, view.h);
  }

  server.close();
  console.log(`Done. Screenshots in ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
