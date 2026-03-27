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
      const text = document.createElement("p");
      text.textContent = `question ${count} : ${lien["question"]}`;
      count++;
      text.classList.add("text");
      const vrai = document.createElement("button");
      vrai.classList.add("btnVrai");
      vrai.textContent = "Vrai";
      const faux = document.createElement("button");
      faux.classList.add("btnFaux");
      faux.textContent = "Faux";
      container.append(text, vrai, faux);
    });
  } catch (error) {
    console.error("Impossible de charger les questions :", error);
  }
}

displayQuestionnaires();
