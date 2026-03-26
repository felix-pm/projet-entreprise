// 1. Tes imports d'Electron (avec ipcMain !)
import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import fs from "node:fs";
import { getQuestionnaires } from "./listQuestionnaire";

// 2. Ajoute ces imports natifs de Node.js
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs"; // <-- IMPORT DE FS AJOUTÉ ICI

// 3. Recrée __filename et __dirname pour l'ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 4. Définition de tes chemins de sauvegarde (À adapter selon tes besoins)
const folderData = path.join(app.getPath("documents"), "psy/mes-donnees"); // Dossier sécurisé par défaut d'Electron
const renseigntmentsJson = path.join(folderData, "renseignements.json");

// 5. Ensuite, ton code normal commence ici...
const createWindow = () => {
  // ... la suite de ton code
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Et __dirname marchera aussi ici pour charger ton HTML !
  mainWindow.loadFile(path.join(__dirname, "../../index.html"));
};

// ... la suite de ton code (app.whenReady, etc.)

// Cette méthode sera appelée quand Electron aura fini de s'initialiser.
app.whenReady().then(() => {
  if (!fs.existsSync(folderData)) {
    fs.mkdirSync(folderData, { recursive: true });
  }

  if (!fs.existsSync(renseigntmentsJson)) {
    fs.writeFileSync(renseigntmentsJson, JSON.stringify([], null, 2));
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
// Pour les questionnaires
ipcMain.on("form-test", (event, receivedData) => {
  try {
    // A. On lit la liste existante
    const title = receivedData.title + ".json";
    const pathJson = path.join(folderData, title);

    // On vérifie si le fichier JSON existe, sinon on le crée avec une liste vide []
    if (!fs.existsSync(pathJson)) {
      fs.writeFileSync(pathJson, JSON.stringify([], null, 2));
    }

    const currentData = JSON.parse(fs.readFileSync(pathJson, "utf-8"));

    // B. On ajoute le nouveau profil à la fin de la liste
    currentData.push(receivedData);

    // C. On réécrit le fichier sur le disque dur avec la liste à jour
    fs.writeFileSync(pathJson, JSON.stringify(currentData, null, 2));

    console.log(
      "Succès ! Fichier mis à jour pour le questionnaire dans :",
      pathJson,
    );
  } catch (erreur) {
    console.error("Aïe, erreur lors de la sauvegarde :", erreur);
  }
});

ipcMain.handle("get-questionnaires", async () => {
  try {
    const files = await fs.promises.readdir(folderData);
    const questionnaires = [];

    for (const file of files) {
      // On garde uniquement les fichiers .json (et on ignore les renseignements)
      if (file.endsWith(".json") && file !== "renseignements.json") {
        // On enlève le ".json" pour avoir juste le titre
        const title = file.replace(".json", "");
        questionnaires.push({ title: title, fileName: file });
      }
    }

    return questionnaires;
  } catch (erreur) {
    console.error("Erreur lors de la lecture des dossiers :", erreur);
    return [];
  }
});
