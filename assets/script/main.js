const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  // Création de la fenêtre du navigateur.
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true, // Permet d'utiliser Node.js dans le HTML si besoin
    },
  });
  // Charge le fichier index.html situé à la racine du projet.
  // Comme ce script est dans assets/script/, on remonte de deux dossiers avec '../../'
  win.loadFile(path.join(__dirname, "../../index.html"));
}

// Cette méthode sera appelée quand Electron aura fini de s'initialiser.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // Sur macOS, il est commun de recréer une fenêtre si l'icône du dock est cliquée.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quitter quand toutes les fenêtres sont fermées, sauf sur macOS.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
