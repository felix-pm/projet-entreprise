// 1. Tes imports d'Electron (avec ipcMain !)
import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import fs from "node:fs";
import xlsx from "xlsx";

// 2. Ajoute ces imports natifs de Node.js
import { fileURLToPath } from "url";

// 3. Recrée __filename et __dirname pour l'ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 4. Définition de tes chemins de sauvegarde (À adapter selon tes besoins)
const folderData = path.join(app.getPath("documents"), "psy/mes-donnees"); // Dossier sécurisé par défaut d'Electron
const renseigntmentsJson = path.join(folderData, "renseignements.json");
const yield2Json = path.join(folderData, "yield2.json");

// 5. Ensuite, ton code normal commence ici...
const createWindow = () => {
  // ... la suite de ton code
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "..", "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Et __dirname marchera aussi ici pour charger ton HTML !
  mainWindow.loadFile(path.join(__dirname, "../../../index.html"));
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

  if (!fs.existsSync(yield2Json)) {
    fs.writeFileSync(yield2Json, JSON.stringify([], null, 2));
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

//récupération du nom du fichier
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

//récupération du contenu du fichier
ipcMain.handle("get-element", async (event, title, key) => {
  try {
    const filePath = path.join(folderData, `${title}.json`);
    const rawData = await fs.promises.readFile(filePath, "utf-8");
    const data = JSON.parse(rawData);

    // On récupère le premier élément du tableau (index 0)
    const questionnaire = data[0];

    // Et on renvoie la bonne clé (video, audio, etc.)
    return questionnaire[key];
  } catch (error) {
    console.error("Erreur lors de la lecture de l'élément :", error);
    return null;
  }
});

// Pour les renseignements
ipcMain.on("form-renseignements", (event, receivedDataRenseignements) => {
  try {
    // A. On lit la liste existante
    const currentData = JSON.parse(
      fs.readFileSync(renseigntmentsJson, "utf-8"),
    );

    // B. On ajoute le nouveau profil à la fin de la liste
    currentData.push(receivedDataRenseignements);

    // C. On réécrit le fichier sur le disque dur avec la liste à jour
    fs.writeFileSync(renseigntmentsJson, JSON.stringify(currentData, null, 2));

    console.log(
      "Succès ! Fichier mis à jour pour les renseignements dans :",
      renseigntmentsJson,
    );
  } catch (erreur) {
    console.error("Aïe, erreur lors de la sauvegarde :", erreur);
  }
});

ipcMain.handle("yield2-videosQuestions", async (event, answerVideo) => {
  try {
    // A. On lit la liste existante
    const currentData = JSON.parse(fs.readFileSync(yield2Json, "utf-8"));

    // B. On ajoute le nouveau profil à la fin de la liste
    currentData.push(answerVideo);

    // C. On réécrit le fichier sur le disque dur avec la liste à jour
    fs.writeFileSync(yield2Json, JSON.stringify(currentData, null, 2));

    console.log(
      "Succès ! Fichier mis à jour pour les renseignements dans :",
      yield2Json,
    );
  } catch (erreur) {
    console.error("Aïe, erreur lors de la sauvegarde :", erreur);
  }
});

// Json en Excel
ipcMain.on("create-excel-file", async (event) => {
  const jsonPath = path.join(folderData, "Test2.json");
  try {
    // Lis le fichier
    const jsonRaw = await fs.promises.readFile(jsonPath, "utf-8");

    // Transforme en objet
    const jsonObject = JSON.parse(jsonRaw);

    const flattenedData = [];

    jsonObject.forEach((item) => {
      let line = {
        titre: item.title,
        video: item.video,
        audio: item.audio,
      };

      item.questionsAudio.forEach((q) => {
        line[`Question audio ${q.id}`] = q.answer;
      });

      item.questionsVideo.forEach((q) => {
        line[`Question video ${q.id}`] = q.answer;
      });

      flattenedData.push(line);
    });

    // Crée un classeur excel vide
    const workbook = xlsx.utils.book_new();
    // Ajoute l'objet sur une feuille excel
    const workSheet = xlsx.utils.json_to_sheet(flattenedData);

    // Ajoute la feuille au classeur excel
    xlsx.utils.book_append_sheet(workbook, workSheet);
    const outputPath = path.join(folderData, "convertedToExcel.xlsx");
    // Ajoute le classeur au chemin
    xlsx.writeFile(workbook, outputPath);

    console.log("Succès");
  } catch (err) {
    console.error("Erreur de la génération : ", err);
  }
});
