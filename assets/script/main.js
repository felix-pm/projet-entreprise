// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

// --- 1. PRÉPARATION DES DOSSIERS ---
// On cible : Mes Documents / MonLogicielData / donnees.json
const folderData = path.join(app.getPath("documents"), "PsychoSoftware");
const pathJson = path.join(folderData, "data.json");

// --- 2. CRÉATION DE LA FENÊTRE ---
function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      // On accroche notre talkie-walkie à la fenêtre
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // On dit à la fenêtre d'afficher ton formulaire HTML
  win.loadFile("../../templates/creationQuestionnaire.html");
}

// --- 3. ALLUMAGE DU LOGICIEL ---
app.whenReady().then(() => {
  // On vérifie si le dossier de sauvegarde existe, sinon on le crée
  if (!fs.existsSync(folderData)) {
    fs.mkdirSync(folderData, { recursive: true });
  }

  // On vérifie si le fichier JSON existe, sinon on le crée avec une liste vide []
  if (!fs.existsSync(pathJson)) {
    fs.writeFileSync(pathJson, JSON.stringify([], null, 2));
  }

  // On affiche enfin la fenêtre à l'écran
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Pour quitter le logiciel proprement quand on clique sur la croix rouge
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
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
