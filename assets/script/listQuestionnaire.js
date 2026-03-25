const container = document.querySelector(".allQuestionnaire");

const fs = require("node:fs/promises");
const path = require("node:path");
const { app } = require("electron");

const dataFolder = path.join(
  app.getPath("documents"),
  "PsychoSoftware",
  "data.json",
);

// ** Fonction permettant de récupérer sous forme de tableau js les données d'un fichier JSON
async function getQuestionnaire(pathData) {
  try {
    const rawData = await fs.readFile(pathData);
    const data = JSON.parse(rawData);
    return data;
  } catch (err) {
    console.error(err);
  }
}

// ** Fonction permettant de chercher dans un fichier une données précise selon sa typologie
// ** ( par exemple un titre qui se nomme "questionnaire 1")
function getElementJSON(json, key, value) {
  const tabJson = getQuestionnaire(json);
  const elt = tabJson.find((element) => element[key] == value);
  return elt;
}

// function getQuestion(json, title, typeQuestion, list) {
//   const tabJson = getQuestionnaire(json);
//   const question = tabJson.find((element) => element["title"] == title);
//   list[typeQuestion] = question[typeQuestion];
//   return list;
// }

function getQuestion(json, key) {
  const tabJson = getQuestionnaire(json);
  return tabJson[key];
}

function createLinkQuestionnaire(container, listQuestionnaire) {
  listQuestionnaire.forEach((questionnaire) => {
    const link = document.createElement("a");
    link.textContent = questionnaire["Title"];
    link.href = "questionnaire.html";
    container.appendChild(link);
  });
}

const list = getQuestionnaire();
createLinkQuestionnaire(container, list);
