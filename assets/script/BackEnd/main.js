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
const folderDataProtocole = path.join(
  app.getPath("documents"),
  "psy/mes-donnees",
);
let folderData = path.join(app.getPath("documents"), "psy/mes-donnees"); // Dossier sécurisé par défaut d'Electron
let renseigntmentsJson = path.join(folderData, "renseignements.json");
let yield2Json = path.join(folderData, "yield2.json");
let yield1Json = path.join(folderData, "yield1.json");

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

function copyMediaFile(originalPath, targetFolder) {
  if (originalPath && fs.existsSync(originalPath)) {
    const fileName = path.basename(originalPath);
    const destinationPath = path.join(targetFolder, fileName);

    if (originalPath !== destinationPath) {
      fs.copyFileSync(originalPath, destinationPath);
    }

    return destinationPath;
  }

  return originalPath || "";
}

ipcMain.on("create-folder", (event, titleJSON) => {
  try {
    const newFolderPath = path.join(
      app.getPath("documents"),
      "psy/mes-donnees/",
      titleJSON,
    );
    folderData = newFolderPath;
    renseigntmentsJson = path.join(folderData, "renseignements.json");
    yield1Json = path.join(folderData, "yield1.json");
    yield2Json = path.join(folderData, "yield2.json");

    if (!fs.existsSync(newFolderPath)) {
      fs.mkdirSync(newFolderPath, { recursive: true });
      console.log("Dossier créé :", newFolderPath);
    }

    if (!fs.existsSync(renseigntmentsJson)) {
      fs.writeFileSync(renseigntmentsJson, JSON.stringify([], null, 2));
    }

    if (!fs.existsSync(yield2Json)) {
      fs.writeFileSync(yield2Json, JSON.stringify([], null, 2));
    }

    if (!fs.existsSync(yield1Json)) {
      fs.writeFileSync(yield1Json, JSON.stringify([], null, 2));
    }
  } catch (err) {
    console.log("Erreur du path : ", err);
  }
});

ipcMain.on("form-test", (event, receivedData) => {
  try {
    receivedData.video = copyMediaFile(receivedData.video, folderData);
    receivedData.audio = copyMediaFile(receivedData.audio, folderData);

    const title = receivedData.title + ".json";
    const pathJson = path.join(folderDataProtocole, title);

    if (!fs.existsSync(pathJson)) {
      fs.writeFileSync(pathJson, JSON.stringify([], null, 2));
    }

    const currentData = JSON.parse(fs.readFileSync(pathJson, "utf-8"));

    currentData.push(receivedData);

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
    const files = await fs.promises.readdir(folderDataProtocole);
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

ipcMain.handle("yield2Questions", async (event, answerVideo, title) => {
  try {
    // A. On lit la liste existante
    const folderDataYield2 = path.join(
      folderDataProtocole,
      title,
      "yield2.json",
    );
    const currentData = JSON.parse(fs.readFileSync(folderDataYield2, "utf-8"));

    // B. On ajoute le nouveau profil à la fin de la liste
    currentData.push(answerVideo);

    // C. On réécrit le fichier sur le disque dur avec la liste à jour
    fs.writeFileSync(folderDataYield2, JSON.stringify(currentData, null, 2));

    console.log(
      "Succès ! Fichier mis à jour pour les renseignements dans :",
      folderDataYield2,
    );
  } catch (erreur) {
    console.error("Aïe, erreur lors de la sauvegarde :", erreur);
  }
});

ipcMain.handle("yield1Questions", async (event, answerVideo, title) => {
  try {
    const folderDataYield1 = path.join(
      folderDataProtocole,
      title,
      "yield1.json",
    );
    const currentData = JSON.parse(fs.readFileSync(folderDataYield1, "utf-8"));

    currentData.push(answerVideo);

    fs.writeFileSync(folderDataYield1, JSON.stringify(currentData, null, 2));

    console.log(
      "Succès ! Fichier mis à jour pour les renseignements dans :",
      folderDataYield1,
    );
  } catch (err) {
    console.error("Erreur lors de la sauvegarde : ", err);
  }
});

// Json en Excel
ipcMain.on("create-excel-file", async (event, titleJson) => {
  const jsonPath = path.join(folderData, titleJson + ".json");
  const jsonPathYield1 = path.join(folderData, "Test2Reponse.json");
  const jsonPathYield2 = path.join(folderData, "Test2Yield2.json");
  try {
    // Lis le fichier
    const jsonRaw = await fs.promises.readFile(jsonPath, "utf-8");
    const jsonRawYield1 = await fs.promises.readFile(jsonPathYield1, "utf-8");
    const jsonRawYield2 = await fs.promises.readFile(jsonPathYield2, "utf-8");

    // Transforme en objet
    const jsonObject = JSON.parse(jsonRaw);
    const jsonObjectYield1 = JSON.parse(jsonRawYield1);
    const jsonObjectYield2 = JSON.parse(jsonRawYield2);

    const flattenedData = [];

    jsonObject.forEach((item, index) => {
      let line = {};
      const audioYield1 = jsonObjectYield1[index].questionsAudio;
      const audioYield2 = jsonObjectYield2[index].questionsAudio;
      const videoYield1 = jsonObjectYield1[index].questionsVideo;
      const videoYield2 = jsonObjectYield2[index].questionsVideo;
      item.questionsAudio.forEach((q, i) => {
        line[`Question audio ${q.id} Yield1`] = q.answer;
        line[`Réponse audio ${q.id} Yield1`] = audioYield1[i].answer;
      });

      item.questionsAudio.forEach((q, i) => {
        line[`Question audio ${q.id} Yield2`] = q.answer;
        line[`Réponse audio ${q.id} Yield2`] = audioYield2[i].answer;
      });

      item.questionsVideo.forEach((q, i) => {
        line[`Question vidéo ${q.id} Yield1`] = q.answer;
        line[`Réponse vidéo ${q.id} Yield1`] = videoYield1[i].answer;
      });

      item.questionsVideo.forEach((q, i) => {
        line[`Question vidéo ${q.id} Yield2`] = q.answer;
        line[`Réponse vidéo ${q.id} Yield2`] = videoYield2[i].answer;
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
