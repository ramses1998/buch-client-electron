const { app, BrowserWindow } = require("electron");
const serve = require("electron-serve");
const path = require("path");

/**
 * Breite des Fensters beim Starten der Electron-Anwendung
 * @type {number}
 */
const INITIAL_WINDOW_WIDTH = 1200;

/**
 * Höhe des Fensters beim Starten der Electron-Anwendung
 * @type {number}
 */
const INITIAL_WINDOW_HEIGHT = 675;


const URL_WEBAPP = "https://localhost:3001";

/**
 * Bereitstellung eines Verzeichnisses, das in Electron geöffnet wird.
 * Sollte die Anwendung nicht gebaut sein, werden keine Verzeichnisse bereitgestellt.
 *
 * @type {electronServe.loadURL|null}
 */
const appServe = app.isPackaged ? serve({
        directory: path.join(__dirname, "../out"),
    })
    : null;

/**
 * Ein Electron-Fenster wird erstellt.
 * @returns {Promise<void>}
 */
const createWindow = async () => {
    const win = new BrowserWindow({
        width: INITIAL_WINDOW_WIDTH,
        height: INITIAL_WINDOW_HEIGHT,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    // https://localhost:3001 wird in Electron geöffnet,
    // wenn die Electron Anwendung noch nicht gebaut ist. (für die Entwicklung).
    //
    // Wichtig!!!:-
    // Das Verzeichnis ../out muss während der Entwickelung gelöscht werden sonst wird beim Ausführen
    // des Kommandos "npm run electron:dev" immer das Produktion-Build(aus ../out) ausgeführt.
    if (!app.isPackaged) {

        await win.loadURL(URL_WEBAPP);
        win.webContents.openDevTools();

        // Electron wird neu geladen ohne Cache bis die Webanwendung gestartet ist und bereit ist Anfragen anzunehmen.
        win.webContents.on("did-fail-load", (e, code, desc) => {
            win.webContents.reloadIgnoringCache();
        });
        return;
    }

    // Um CORS-Fehler in Electron zu vermeiden.
    win.webContents.session.webRequest.onBeforeSendHeaders(
        (details, callback) => {
            callback({ requestHeaders: { ...details.requestHeaders, Origin: "*" } });
        },
    );

    // Um CORS-Fehler in Electron zu vermeiden.
    win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                "Access-Control-Allow-Origin": "*",
            },
        });
    });

    // Statische Datein von Next.js aus dem Verzeichnis ../out werden bereitgestellt und in Electron geöffnet.
    await appServe(win);
    await win.loadURL("app://-");

};

// Ein Fenster wird erstellt und geöffnet, sobald Electrons Initiaisierung fertig ist.
app.on("ready", async () => {
    await createWindow();
});

// Damit werden alle Intanzen der Anwendung geschlossen, wenn man eine Instanz schließt (gilt nicht für darwin bzw. mac OS).
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// Zertifikat-Fehler ausschalten falls http verwendet wird.
// Siehe: https://www.electronjs.org/docs/latest/api/app#event-certificate-error
app.on(
    "certificate-error",
    (event, webContents, url, error, certificate, callback) => {
        event.preventDefault();
        callback(true);
    },
);
