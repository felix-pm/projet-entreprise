const container = document.querySelector(".allQuestionnaire");

async function displayQuestionnaires(title) {
  try {
    const listQuestionnaire = await window.electronAPI.getQuestionnaires();

    container.innerHTML = "";
    listQuestionnaire.forEach((questionnaire) => {
      const link = document.createElement("a");
      link.textContent = questionnaire.title;
      link.href = "questionnaire.html";
      link.classList.add("link");

      container.appendChild(link);
    });
  } catch (error) {
    console.error("Impossible de charger les questionnaires :", error);
  }
}

displayQuestionnaires();
