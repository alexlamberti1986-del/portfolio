"use strict";

const path = require("path");
const { app, BrowserWindow, Menu, shell } = require("electron");

const isDev = !app.isPackaged;
const APP_ROOT = __dirname;
const INDEX_HTML = path.join(APP_ROOT, "app", "index.html");

app.commandLine.appendSwitch("enable-gpu-rasterization");
app.commandLine.appendSwitch("enable-zero-copy");
app.commandLine.appendSwitch("disable-renderer-backgrounding");

if (!isDev) {
  app.commandLine.appendSwitch("log-level", "3");
}

let mainWindow = null;

function blockDevShortcuts(win) {
  win.webContents.on("before-input-event", (event, input) => {
    if (isDev) return;

    const key = (input.key || "").toLowerCase();
    const blocked =
      key === "f12" ||
      (input.control && input.shift && key === "i") ||
      (input.control && input.shift && key === "j") ||
      (input.control && input.shift && key === "c") ||
      ((input.control || input.meta) && key === "r") ||
      ((input.control || input.meta) && key === "u");

    if (blocked) event.preventDefault();
  });

  win.webContents.on("context-menu", (event) => {
    if (!isDev) event.preventDefault();
  });

  win.webContents.on("devtools-opened", () => {
    if (!isDev) win.webContents.closeDevTools();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 640,
    backgroundColor: "#0a0a0c",
    show: false,
    autoHideMenuBar: true,
    title: "Alex Lamberti Portfolio",
    webPreferences: {
      preload: path.join(APP_ROOT, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: isDev,
      webviewTag: false,
      backgroundThrottling: false,
    },
  });

  blockDevShortcuts(mainWindow);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });

  mainWindow.loadFile(INDEX_HTML);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

if (!isDev) {
  Menu.setApplicationMenu(null);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("web-contents-created", (_event, contents) => {
  contents.on("will-attach-webview", (event) => event.preventDefault());
});
