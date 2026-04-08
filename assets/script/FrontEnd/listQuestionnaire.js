const container = document.querySelector(".allQuestionnaire");
const newUrlParam = new URLSearchParams(window.location.search);
const scoreExt = newUrlParam.get("type");

async function displayQuestionnaires(title) {
  try {
    const listQuestionnaire = await window.electronAPI.getQuestionnaires();

    container.innerHTML = "";
    listQuestionnaire.forEach((questionnaire) => {
      const link = document.createElement("a");
      link.textContent = questionnaire.title;
      if (scoreExt == "question") {
        link.href = "questionnaire.html";
      } else {
        link.href = "scoresExterieures.html";
      }

      link.classList.add("link");

      link.addEventListener("click", () => {
        sessionStorage.setItem("titreQuestionnaireActuel", questionnaire.title);
        const titreQuestion = sessionStorage.getItem(
          "titreQuestionnaireActuel",
        );
        const urlParams = new URLSearchParams(window.location.search);
        const source = urlParams.get("source");

        if (source === "btnReturnTest") {
          window.location.href = "allNumberPassation.html";
        } else {
          window.location.href = "questionnaire.html";
        }
        console.log(titreQuestion);
      });

      container.appendChild(link);
    });
  } catch (error) {
    console.error("Impossible de charger les questionnaires :", error);
  }
}

displayQuestionnaires();
