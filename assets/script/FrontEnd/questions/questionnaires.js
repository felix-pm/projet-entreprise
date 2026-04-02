const titleQuestionnaire = document.getElementById("titleQuestionnaire");

const title = sessionStorage.getItem("titreQuestionnaireActuel");

const allLink = document.querySelectorAll(".linkQuestion");

allLink.forEach((link, index) => {
  if (sessionStorage.getItem(`lien-${index}`) === "true") {
    link.removeAttribute("href");
    link.style.color = "gray";
    link.style.cursor = "default";
    link.style.pointerEvents = "none";
  }

  link.addEventListener("click", (event) => {
    sessionStorage.setItem(`lien-${index}`, "true");
  });
});

async function displayQuestionnaires() {
  try {
    const titleQ = await window.electronAPI.getElement(title, "title");
    titleQuestionnaire.textContent = `Questionnaire : ${titleQ}`;
    titleQuestionnaire.load();
  } catch (error) {
    console.error("Impossible de charger le titre du questionnaire :", error);
  }
}

displayQuestionnaires();
