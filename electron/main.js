const { app, BrowserWindow } = require("electron");
const serve = require("electron-serve");
const path = require("path");

const appServe = app.isPackaged
  ? serve({
      directory: path.join(__dirname, "../out"),
    })
  : null;

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (app.isPackaged) {
    await appServe(win);
    await win.loadURL("app://-");
  } else {
    await win.loadURL("http://localhost:3001");
    win.webContents.openDevTools();
    win.webContents.on("did-fail-load", (e, code, desc) => {
      win.webContents.reloadIgnoringCache();
    });
  }
};

app.on("ready", () => {
  createWindow();
});

// Damit werden alle Intanzen der Anwendung geschlossen, wenn man eine Instanz schließt.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Zertifikat-Fehler ausschalten. Siehe: https://www.electronjs.org/docs/latest/api/app#event-certificate-error
app.on(
  "certificate-error",
  (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
  },
);
