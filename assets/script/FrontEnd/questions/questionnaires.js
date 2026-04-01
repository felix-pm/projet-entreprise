const titleQuestionnaire = document.getElementById("titleQuestionnaire");

const title = sessionStorage.getItem("titreQuestionnaireActuel");

async function displayQuestionnaires() {
  try {
    const titleQ = await window.electronAPI.getElement(title, "title");
    titleQuestionnaire.textContent = `Questionnaire : ${titleQ}`;
  } catch (error) {
    console.error("Impossible de charger le titre du questionnaire :", error);
  }
}

displayQuestionnaires();
