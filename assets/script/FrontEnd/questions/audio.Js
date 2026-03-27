const btnBack = document.getElementById("btnBack");

btnBack.addEventListener("click", (event) => {
  window.location.href = "questionnaire.html";
});

const baliseAudio = document.getElementById("audio");

const title = sessionStorage.getItem("titreQuestionnaireActuel");

async function displayQuestionnaires() {
  try {
    const lienAudio = await window.electronAPI.getElement(title, "audio");
    baliseAudio.src = lienAudio;
    console.log(lienAudio);
    baliseAudio.load();
  } catch (error) {
    console.error("Impossible de charger l'audio :", error);
  }
}

displayQuestionnaires();
