const btnBack = document.getElementById("btnBack");

btnBack.addEventListener("click", (event) => {
  window.location.href = "questionnaire.html";
});

const baliseVideo = document.getElementById("baliseVideo");

const title = sessionStorage.getItem("titreQuestionnaireActuel");

async function displayQuestionnaires() {
  try {
    const lienVideo = await window.electronAPI.getElement(title, "video");
    baliseVideo.src = lienVideo;
    baliseVideo.load();
  } catch (error) {
    console.error("Impossible de charger la vidéo :", error);
  }
}

displayQuestionnaires();
