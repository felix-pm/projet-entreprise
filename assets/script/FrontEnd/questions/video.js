const baliseVideo = document.getElementById("baliseVideo");
baliseVideo.addEventListener("click", (event) => {});

const title = sessionStorage.getItem("titreQuestionnaireActuel");

async function displayQuestionnaires() {
  try {
    const lienVideo = await window.electronAPI.getElement(title, "video");
    baliseVideo.src = lienVideo;
    baliseVideo.load();
  } catch (error) {
    console.error("Impossible de charger les questionnaires :", error);
  }
}

displayQuestionnaires();
