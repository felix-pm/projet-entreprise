// 1. Tes imports d'Electron (avec ipcMain !)
import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import fs from "node:fs";
import xlsx from "xlsx";
import { sortJSON } from "../FrontEnd/sortJSON.js";

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
    width: 1920,
    height: 1080,
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
    const filePath = path.join(folderDataProtocole, `${title}.json`);
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
    const folderDataYield1 = path.join(
      folderDataProtocole,
      title,
      "yield1.json",
    );
    const currentData = JSON.parse(fs.readFileSync(folderDataYield1, "utf-8"));

    // Compare la clé avec les valeurs données pour trouver le numéro de passation
    const passationId = answerVideo.numberPassation[0];

    // Cherche dans le tableau l'objet le bon numéro de passation, si il n'existe pas il push les données qu'il a déjà récupéré
    const index = currentData.findIndex(
      (item) => item.numberPassation && item.numberPassation[0] === passationId,
    );

    if (index >= 0) {
      // Récupération des anciennes données
      const oldData = currentData[index];

      // Ajout des anciennes données puis des nouvelles ou alors les laisse vide si le questionnaire correspondant n'a pas été remplie
      currentData[index] = {
        ...oldData,
        ...answerVideo,
        questionsVideo: {
          ...(oldData.questionsVideo || {}),
          ...(answerVideo.questionsVideo || {}),
        },
        questionsAudio: {
          ...(oldData.questionsAudio || {}),
          ...(answerVideo.questionsAudio || {}),
        },
        questionsMdls: {
          ...(oldData.questionsMdls || {}),
          ...(answerVideo.questionsMdls || {}),
        },
        trustIndex: {
          ...(oldData.trustIndex || {}),
          ...(answerVideo.trustIndex || {}),
        },
        chrono: {
          ...(oldData.chrono || {}),
          ...(answerVideo.chrono || {}),
        },
      };
    } else {
      currentData.push(answerVideo);
    }

    // C. On réécrit le fichier sur le disque dur avec la liste à jour
    fs.writeFileSync(folderDataYield1, JSON.stringify(currentData, null, 2));

    console.log(
      "Succès ! Fichier mis à jour pour les renseignements dans :",
      folderDataYield1,
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

    // Compare la clé avec les valeurs données pour trouver le numéro de passation
    const passationId = answerVideo.numberPassation[0];

    // Cherche dans le tableau l'objet le bon numéro de passation, si il n'existe pas il push les données qu'il a déjà récupéré
    const index = currentData.findIndex(
      (item) => item.numberPassation && item.numberPassation[0] === passationId,
    );

    if (index >= 0) {
      // Récupération des anciennes données
      const oldData = currentData[index];

      // Ajout des anciennes données puis des nouvelles ou alors les laisse vide si le questionnaire correspondant n'a pas été remplie
      currentData[index] = {
        ...oldData,
        ...answerVideo,
        questionsVideo: {
          ...(oldData.questionsVideo || {}),
          ...(answerVideo.questionsVideo || {}),
        },
        questionsAudio: {
          ...(oldData.questionsAudio || {}),
          ...(answerVideo.questionsAudio || {}),
        },
        questionsMdls: {
          ...(oldData.questionsMdls || {}),
          ...(answerVideo.questionsMdls || {}),
        },
        trustIndex: {
          ...(oldData.trustIndex || {}),
          ...(answerVideo.trustIndex || {}),
        },
        chrono: {
          ...(oldData.chrono || {}),
          ...(answerVideo.chrono || {}),
        },
      };
    } else {
      currentData.push(answerVideo);
    }

    fs.writeFileSync(folderDataYield1, JSON.stringify(currentData, null, 2));

    console.log(
      "Succès ! Fichier mis à jour pour les renseignements dans :",
      folderDataYield1,
    );
  } catch (err) {
    console.error("Erreur lors de la sauvegarde : ", err);
  }
});

ipcMain.handle("QuestionSource", async (event, answerVideo, title) => {
  try {
    const folderDataYield1 = path.join(
      folderDataProtocole,
      title,
      "yield1.json",
    );
    const currentData = JSON.parse(fs.readFileSync(folderDataYield1, "utf-8"));

    // Compare la clé avec les valeurs données pour trouver le numéro de passation
    const passationId = answerVideo.numberPassation[0];

    // Cherche dans le tableau l'objet le bon numéro de passation, si il n'existe pas il push les données qu'il a déjà récupéré
    const index = currentData.findIndex(
      (item) => item.numberPassation && item.numberPassation[0] === passationId,
    );

    if (index >= 0) {
      // Récupération des anciennes données
      const oldData = currentData[index];

      // Ajout des anciennes données puis des nouvelles ou alors les laisse vide si le questionnaire correspondant n'a pas été remplie
      currentData[index] = {
        ...oldData,
        ...answerVideo,
        questionsVideo: {
          ...(oldData.questionsVideo || {}),
          ...(answerVideo.questionsVideo || {}),
        },
        questionsAudio: {
          ...(oldData.questionsAudio || {}),
          ...(answerVideo.questionsAudio || {}),
        },
        questionsMdls: {
          ...(oldData.questionsMdls || {}),
          ...(answerVideo.questionsMdls || {}),
        },
        trustIndex: {
          ...(oldData.trustIndex || {}),
          ...(answerVideo.trustIndex || {}),
        },
        chrono: {
          ...(oldData.chrono || {}),
          ...(answerVideo.chrono || {}),
        },
      };
    } else {
      currentData.push(answerVideo);
    }

    fs.writeFileSync(folderDataYield1, JSON.stringify(currentData, null, 2));

    console.log(
      "Succès ! Fichier mis à jour pour les renseignements dans :",
      folderDataYield1,
    );
  } catch (err) {
    console.error("Erreur lors de la sauvegarde : ", err);
  }
});

ipcMain.handle("trustIndex", async (event, answerVideo, title) => {
  try {
    const folderDataYield1 = path.join(
      folderDataProtocole,
      title,
      "yield1.json",
    );
    const currentData = JSON.parse(fs.readFileSync(folderDataYield1, "utf-8"));

    // Compare la clé avec les valeurs données pour trouver le numéro de passation
    const passationId = answerVideo.numberPassation[0];

    // Cherche dans le tableau l'objet le bon numéro de passation, si il n'existe pas il push les données qu'il a déjà récupéré
    const index = currentData.findIndex(
      (item) => item.numberPassation && item.numberPassation[0] === passationId,
    );

    if (index >= 0) {
      // Récupération des anciennes données
      const oldData = currentData[index];

      // Ajout des anciennes données puis des nouvelles ou alors les laisse vide si le questionnaire correspondant n'a pas été remplie
      currentData[index] = {
        ...oldData,
        ...answerVideo,
        questionsVideo: {
          ...(oldData.questionsVideo || {}),
          ...(answerVideo.questionsVideo || {}),
        },
        questionsAudio: {
          ...(oldData.questionsAudio || {}),
          ...(answerVideo.questionsAudio || {}),
        },
        questionsMdls: {
          ...(oldData.questionsMdls || {}),
          ...(answerVideo.questionsMdls || {}),
        },
        trustIndex: {
          ...(oldData.trustIndex || {}),
          ...(answerVideo.trustIndex || {}),
        },
        chrono: {
          ...(oldData.chrono || {}),
          ...(answerVideo.chrono || {}),
        },
      };
    } else {
      currentData.push(answerVideo);
    }

    fs.writeFileSync(folderDataYield1, JSON.stringify(currentData, null, 2));

    console.log(
      "Succès ! Fichier mis à jour pour les renseignements dans :",
      folderDataYield1,
    );
  } catch (err) {
    console.error("Erreur lors de la sauvegarde : ", err);
  }
});

ipcMain.handle("chrono", async (event, answerVideo, title) => {
  try {
    const folderDataYield1 = path.join(
      folderDataProtocole,
      title,
      "yield1.json",
    );
    const currentData = JSON.parse(fs.readFileSync(folderDataYield1, "utf-8"));

    // Compare la clé avec les valeurs données pour trouver le numéro de passation
    const passationId = answerVideo.numberPassation[0];

    // Cherche dans le tableau l'objet le bon numéro de passation, si il n'existe pas il push les données qu'il a déjà récupéré
    const index = currentData.findIndex(
      (item) => item.numberPassation && item.numberPassation[0] === passationId,
    );

    if (index >= 0) {
      // Récupération des anciennes données
      const oldData = currentData[index];

      // Ajout des anciennes données puis des nouvelles ou alors les laisse vide si le questionnaire correspondant n'a pas été remplie
      currentData[index] = {
        ...oldData,
        ...answerVideo,
        questionsVideo: {
          ...(oldData.questionsVideo || {}),
          ...(answerVideo.questionsVideo || {}),
        },
        questionsAudio: {
          ...(oldData.questionsAudio || {}),
          ...(answerVideo.questionsAudio || {}),
        },
        questionsMdls: {
          ...(oldData.questionsMdls || {}),
          ...(answerVideo.questionsMdls || {}),
        },
        trustIndex: {
          ...(oldData.trustIndex || {}),
          ...(answerVideo.trustIndex || {}),
        },
        chrono: {
          ...(oldData.chrono || {}),
          ...(answerVideo.chrono || {}),
        },
      };
    } else {
      currentData.push(answerVideo);
    }

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
  const jsonPathYield1 = path.join(
    folderDataProtocole,
    titleJson,
    "yield1.json",
  );
  try {
    // Lis le fichier
    const jsonRawYield1 = await fs.promises.readFile(jsonPathYield1, "utf-8");

    // Transforme en objet
    const jsonObjectYield1 = JSON.parse(jsonRawYield1);

    const flattenedData = [];

    jsonObjectYield1.forEach((item) => {
      let line = {
        "Numéro de Passation": item.numberPassation[0],
        Age: item.age[0],
        Sexe: item.sexe[0],
        "Date Passation": item.date[0],
        "AVANT FEEDBACK NEGATIF VIDEO": "",
      };

      const keyVideoY1 = sortJSON(item.questionsVideo, "Yield1");
      const trustIndexVideoY1 = sortJSON(
        item.trustIndex,
        "trustIndex-Yield1-questionsVideo",
      );
      const TrVideoY1 = sortJSON(item.chrono, "chrono-Yield1-questionsVideo");

      keyVideoY1.forEach((key, i) => {
        const TrKeyVideoY1 = TrVideoY1[i];
        line[`TR Question ${i + 1} Video Y1`] = item.chrono[TrKeyVideoY1];
        line[`Réponse Question ${i + 1} Video Y1`] = item.questionsVideo[key];
        const trustKeyVideoY1 = trustIndexVideoY1[i];
        line[`Indice de confiance Q${i + 1} Video Y1`] =
          item.trustIndex[trustKeyVideoY1];
      });

      line[`Yield 1 Vidéo`] = item.scoreVideoY1 + "/10";
      line["APRES FEEDBACK NEGATIF VIDEO"] = "";

      const TrVideoY2 = sortJSON(item.chrono, "chrono-Yield2-questionsVideo");
      const keyVideoY2 = sortJSON(item.questionsVideo, "Yield2");
      const trustIndexVideoY2 = sortJSON(
        item.trustIndex,
        "trustIndex-Yield2-questionsVideo",
      );

      keyVideoY2.forEach((key, i) => {
        const TrKeyVideoY2 = TrVideoY2[i];
        line[`TR Question ${i + 1} Video Y2`] = item.chrono[TrKeyVideoY2];
        line[`Réponse Question ${i + 1} Video Y2`] = item.questionsVideo[key];
        const trustVideoKeyY2 = trustIndexVideoY2[i];
        line[`Indice de confiance Q${i + 1} Video Y2`] =
          item.trustIndex[trustVideoKeyY2];
      });
      line[`Yield 2 Vidéo`] = item.scoreVideoY2 + "/10";
      line[`Shift Video`] = item.scoreShiftVideo + "/15";
      line[`Total Suggestibilité Video`] = item.totalScoreVideo + "/25";
      line["AVANT FEEDBACK NEGATIF AUDIO"] = "";

      const TrAudioY1 = sortJSON(item.chrono, "chrono-Yield1-questionsAudio");
      const keyAudioY1 = sortJSON(item.questionsAudio, "Yield1");
      const trustIndexAudioY1 = sortJSON(
        item.trustIndex,
        "trustIndex-Yield1-questionsAudio",
      );

      keyAudioY1.forEach((key, i) => {
        const TrKeyAudioY1 = TrAudioY1[i];
        line[`TR Question ${i + 1} Audio Y1`] = item.chrono[TrKeyAudioY1];
        line[`Réponse Question ${i + 1} Audio Y1`] = item.questionsAudio[key];
        const trustAudioKeyY1 = trustIndexAudioY1[i];
        line[`Indice de confiance Q${i + 1} Audio Y1`] =
          item.trustIndex[trustAudioKeyY1];
      });
      line[`Yield 1 Audio`] = item.scoreAudioY1 + "/10";
      line["APRES FEEDBACK NEGATIF AUDIO"] = "";

      const TrAudioY2 = sortJSON(item.chrono, "chrono-Yield2-questionsAudio");
      const keyAudioY2 = sortJSON(item.questionsAudio, "Yield2");
      const trustIndexAudioY2 = sortJSON(
        item.trustIndex,
        "trustIndex-Yield2-questionsAudio",
      );
      keyAudioY2.forEach((key, i) => {
        const trKeyAudioY2 = TrAudioY2[i];
        line[`TR Question ${i + 1} Audio Y2`] = item.chrono[trKeyAudioY2];
        line[`Réponse Question ${i + 1} Audio Y2`] = item.questionsAudio[key];
        const trustAudioKeyY2 = trustIndexAudioY2[i];
        line[`Indice de confiance Q${i + 1} Audio Y2`] =
          item.trustIndex[trustAudioKeyY2];
      });

      line[`Yield 2 Audio`] = item.scoreAudioY2 + "/10";
      line[`Shift Audio`] = item.scoreShiftAudio + "/15";
      line[`Total Suggestibilité Audio`] = item.totalScoreAudio + "/25";

      const questionMdls = sortJSON(item.questionsMdls, "questionsMdls");
      questionMdls.forEach((key, i) => {
        line[`Réponse ${i + 1} Source`] = item.questionsMdls[key];
      });

      flattenedData.push(line);
    });

    // Crée un classeur excel vide
    const workbook = xlsx.utils.book_new();
    // Ajoute l'objet sur une feuille excel
    const workSheet = xlsx.utils.json_to_sheet(flattenedData);

    // Ajoute la feuille au classeur excel
    xlsx.utils.book_append_sheet(workbook, workSheet);
    const outputPath = path.join(folderDataProtocole, "convertedToExcel.xlsx");
    // Ajoute le classeur au chemin
    xlsx.writeFile(workbook, outputPath);

    console.log("Succès");
  } catch (err) {
    console.error("Erreur de la génération : ", err, folderDataProtocole);
  }
});
