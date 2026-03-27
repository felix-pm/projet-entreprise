const btnBack = document.getElementById("btnBack");

btnBack.addEventListener("click", (event) => {
  window.location.href = "questionnaire.html";
});

const container = document.getElementById("questionAudio");

const title = sessionStorage.getItem("titreQuestionnaireActuel");

async function displayQuestionnaires() {
  try {
    const lienQuestionVideo = await window.electronAPI.getElement(
      title,
      "questionsAudio",
    );

    container.innerHTML = "";
    let count = 1;

    lienQuestionVideo.forEach((lien) => {
      const link = document.createElement("p");
      console.log("prout");
      link.textContent = `question ${count} : ${lien["question"]}`;
      count++;
      link.classList.add("link");
      container.append(link);
    });
  } catch (error) {
    console.error("Impossible de charger les questions :", error);
  }
}

displayQuestionnaires();
