const {
  app,
  BrowserWindow,
  BrowserView,
  ipcMain,
  globalShortcut,
} = require("electron");
const path = require("path");
const fs = require("fs");

let mainWin;
let views = [];
let siteUrls = [];
let viewsHidden = false;

const CONFIG_PATH = path.join(__dirname, "sites.json");
const INPUT_BOX_HEIGHT = 60;

function loadSiteUrls() {
  try {
    const data = fs.readFileSync(CONFIG_PATH, "utf-8");
    const json = JSON.parse(data);
    if (
      Array.isArray(json.sites) &&
      json.sites.length >= 1 &&
      json.sites.length <= 3
    ) {
      siteUrls = json.sites;
      return;
    }
  } catch (e) {}
  // fallback to defaults
  siteUrls = [
    "https://chatgpt.com/",
    "https://gemini.google.com/",
    "https://claude.ai/",
  ];
  saveSiteUrls();
}

function saveSiteUrls() {
  fs.writeFileSync(
    CONFIG_PATH,
    JSON.stringify({ sites: siteUrls }, null, 2),
    "utf-8"
  );
}

function layoutViews() {
  if (!mainWin || views.length === 0) return;
  const [winWidth, winHeight] = mainWin.getContentSize();
  const n = views.length;
  const viewWidth = Math.floor(winWidth / n);
  const viewHeight = winHeight - INPUT_BOX_HEIGHT;
  for (let i = 0; i < n; i++) {
    views[i].setBounds({
      x: i * viewWidth,
      y: 0,
      width: i === n - 1 ? winWidth - viewWidth * (n - 1) : viewWidth, // last view takes remaining px
      height: viewHeight,
    });
  }
}

function createOrReloadViews() {
  // Remove old views
  if (mainWin && views.length) {
    for (const v of views) mainWin.removeBrowserView(v);
  }
  views = [];
  // Create BrowserViews for each configured site
  for (let i = 0; i < siteUrls.length; i++) {
    const view = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });
    view.webContents.loadURL(siteUrls[i]);
    mainWin.addBrowserView(view);
    views.push(view);
    // Automatically open DevTools for the first view after creation
    if (i === 0) {
      setTimeout(() => {
        if (
          view &&
          typeof view.isDestroyed === "function" &&
          !view.isDestroyed() &&
          view.webContents &&
          typeof view.webContents.isDestroyed === "function" &&
          !view.webContents.isDestroyed()
        ) {
          console.log("Auto-opening DevTools for first BrowserView");
          view.webContents.openDevTools({ mode: "detach" });
        } else {
          console.log(
            "Could not auto-open DevTools: view missing or destroyed"
          );
        }
      }, 2000);
    }
  }
  setTimeout(layoutViews, 500);
}

function createMainControlWindow() {
  mainWin = new BrowserWindow({
    width: 1280,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  mainWin.loadFile("index.html");
  createOrReloadViews();
  mainWin.on("resize", layoutViews);
  mainWin.on("ready-to-show", layoutViews);
  mainWin.on("show", layoutViews);
}

// Listen for resize events from renderer
ipcMain.on("resize-view", (event, { index, width, height }) => {
  if (views[index]) {
    const bounds = views[index].getBounds();
    views[index].setBounds({ ...bounds, width, height });
  }
});

// IPC: Send message to all sites
ipcMain.on("send-message-to-all", (event, message) => {
  const safeMessage = typeof message === "string" ? message : String(message);

  for (let i = 0; i < views.length; i++) {
    views[i].webContents.executeJavaScript(safeMessage);
  }
});

// IPC: Get and set site URLs
ipcMain.handle("get-site-urls", () => siteUrls);
ipcMain.handle("set-site-urls", (event, newUrls) => {
  if (Array.isArray(newUrls) && newUrls.length >= 1 && newUrls.length <= 3) {
    siteUrls = newUrls;
    saveSiteUrls();
    createOrReloadViews();
    layoutViews();
    return true;
  }
  return false;
});

// Hide/show BrowserViews for config modal
ipcMain.on("hide-browserviews", () => {
  if (mainWin && !viewsHidden) {
    for (const v of views) mainWin.removeBrowserView(v);
    viewsHidden = true;
  }
});
ipcMain.on("show-browserviews", () => {
  if (mainWin && viewsHidden) {
    for (const v of views) mainWin.addBrowserView(v);
    layoutViews();
    viewsHidden = false;
  }
});

app.whenReady().then(() => {
  loadSiteUrls();
  createMainControlWindow();

  // Register shortcuts for each BrowserView
  globalShortcut.register("CommandOrControl+Option+1", () => {
    console.log("Shortcut fired for DevTools 1");
    if (
      views[0] &&
      typeof views[0].isDestroyed === "function" &&
      !views[0].isDestroyed() &&
      views[0].webContents &&
      typeof views[0].webContents.isDestroyed === "function" &&
      !views[0].webContents.isDestroyed() &&
      !viewsHidden
    ) {
      console.log("Opening DevTools for view 1");
      views[0].webContents.openDevTools({ mode: "detach" });
    } else {
      console.log("DevTools not opened: view is missing, destroyed, or hidden");
    }
  });
  globalShortcut.register("CommandOrControl+Option+2", () => {
    console.log("Shortcut fired for DevTools 2");
    if (
      views[1] &&
      typeof views[1].isDestroyed === "function" &&
      !views[1].isDestroyed() &&
      views[1].webContents &&
      typeof views[1].webContents.isDestroyed === "function" &&
      !views[1].webContents.isDestroyed() &&
      !viewsHidden
    ) {
      console.log("Opening DevTools for view 2");
      views[1].webContents.openDevTools({ mode: "detach" });
    } else {
      console.log("DevTools not opened: view is missing, destroyed, or hidden");
    }
  });
  globalShortcut.register("CommandOrControl+Option+3", () => {
    console.log("Shortcut fired for DevTools 3");
    if (
      views[2] &&
      typeof views[2].isDestroyed === "function" &&
      !views[2].isDestroyed() &&
      views[2].webContents &&
      typeof views[2].webContents.isDestroyed === "function" &&
      !views[2].webContents.isDestroyed() &&
      !viewsHidden
    ) {
      console.log("Opening DevTools for view 3");
      views[2].webContents.openDevTools({ mode: "detach" });
    } else {
      console.log("DevTools not opened: view is missing, destroyed, or hidden");
    }
  });
  // Register shortcut to open site config modal
  globalShortcut.register("CommandOrControl+Option+S", () => {
    if (
      mainWin &&
      !mainWin.isDestroyed() &&
      mainWin.webContents &&
      !mainWin.webContents.isDestroyed()
    ) {
      mainWin.webContents.send("open-site-config");
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainControlWindow();
  }
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
