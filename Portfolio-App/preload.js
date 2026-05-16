"use strict";

const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("portfolioDesktop", {
  isElectron: true,
  platform: process.platform,
  version: "1.0.0",
});
