const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  resizeView: (index, width, height) =>
    ipcRenderer.send("resize-view", { index, width, height }),
  sendMessageToAll: (message) =>
    ipcRenderer.send("send-message-to-all", message),
  getSiteUrls: () => ipcRenderer.invoke("get-site-urls"),
  setSiteUrls: (urls) => ipcRenderer.invoke("set-site-urls", urls),
  onOpenSiteConfig: (callback) => ipcRenderer.on("open-site-config", callback),
  hideBrowserViews: () => ipcRenderer.send("hide-browserviews"),
  showBrowserViews: () => ipcRenderer.send("show-browserviews"),
});
