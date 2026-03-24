const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const folderData = path.join(app.getPath("documents"), "PsychoSoftware");
const pathJson = path.join(folderData, "data.json");

function createWindow() {
  // Création de la fenêtre du navigateur.
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      // On accroche notre talkie-walkie à la fenêtre
      preload: path.join(__dirname, "preload.js"),
    },
  });
  // Charge le fichier index.html situé à la racine du projet.
  // Comme ce script est dans assets/script/, on remonte de deux dossiers avec '../../'

  win.loadFile(path.join(__dirname, "../../index.html"));
}

// Cette méthode sera appelée quand Electron aura fini de s'initialiser.
app.whenReady().then(() => {
  if (!fs.existsSync(folderData)) {
    fs.mkdirSync(folderData, { recursive: true });
  }

  // On vérifie si le fichier JSON existe, sinon on le crée avec une liste vide []
  if (!fs.existsSync(pathJson)) {
    fs.writeFileSync(pathJson, JSON.stringify([], null, 2));
  }

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

// --- 4. LA SAUVEGARDE (ÉCOUTE DU TALKIE-WALKIE) ---
ipcMain.on("form-test", (event, receivedData) => {
  try {
    // A. On lit la liste existante
    const currentData = JSON.parse(fs.readFileSync(pathJson, "utf-8"));

    // B. On ajoute le nouveau profil à la fin de la liste
    currentData.push(receivedData);

    // C. On réécrit le fichier sur le disque dur avec la liste à jour
    fs.writeFileSync(pathJson, JSON.stringify(currentData, null, 2));

    console.log("Succès ! Fichier mis à jour dans :", pathJson);
  } catch (erreur) {
    console.error("Aïe, erreur lors de la sauvegarde :", erreur);
  }
});
