const container = document.querySelector(".allQuestionnaire");

const fs = require("node:fs/promises");
const path = require("node:path");
const { app } = require("electron");

const dataFolder = path.join(
  app.getPath("documents"),
  "PsychoSoftware",
  "donnees",
);

// ? fetch depuis un JSON contenant un questionnaire

// ** Fonction permettant de récupérer sous forme de tableau js les données d'un fichier JSON
async function getQuestionnaire(pathData, title) {
  try {
    const rawData = await fs.readFile(path.join(pathData, `${title}.json`));
    const data = JSON.parse(rawData);
    return data;
  } catch (err) {
    console.error(err);
  }
}

// ** Fonction permettant de chercher dans un fichier une données précise selon sa typologie
// ** (par exemple un titre qui se nomme "questionnaire 1")

function getElement(json, title, key) {
  const tabJson = getQuestionnaire(json, title);
  return tabJson[key];
}

// ? fetch depuis un JSON contenant tout les questionnaire

// ** Fonction permettant de récupérer sous forme de tableau js les données d'un fichier JSON
async function getQuestionnaires(pathData) {
  try {
    const rawData = await fs.readFile(path.join(pathData));
    const data = JSON.parse(rawData);
    return data;
  } catch (err) {
    console.error(err);
  }
}

// ** Fonction permettant de chercher dans un fichier une données précise selon sa typologie
// ** (par exemple un titre qui se nomme "questionnaire 1")

function getElementFromJson(json, key, value) {
  const tabJson = getQuestionnaires(json);
  const elt = tabJson.find((element) => element[key] == value);
  return elt;
}

// ? modification du DOM

// ** Fonction qui instancie la liste des différents questionnaire dans l'HTML
function createLinkQuestionnaire(container, listQuestionnaire) {
  listQuestionnaire.forEach((questionnaire) => {
    const link = document.createElement("a");
    link.textContent = questionnaire["Title"];
    link.href = "questionnaire.html";
    container.appendChild(link);
  });
}
