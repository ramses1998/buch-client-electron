const { app, BrowserWindow } = require("electron");
const serve = require("electron-serve");
const path = require("path");
const os = require('os');


const appServe = serve({
      directory: path.join(__dirname, "../out"),
    });

// const appServe = app.isPackaged
//   ? serve({
//       directory: path.join(__dirname, "../out"),
//     })
//   : null;

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 675,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // win.webContents.session.webRequest.onBeforeSendHeaders(
  //     (details, callback) => {
  //       callback({ requestHeaders: { Origin: '*', ...details.requestHeaders } });
  //     },
  // );
  //
  // win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
  //   callback({
  //     responseHeaders: {
  //       'Access-Control-Allow-Origin': ['*'],
  //       ...details.responseHeaders,
  //     },
  //   });
  // });

    //
    // await appServe(win);
    // await win.loadURL("app://-");

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
