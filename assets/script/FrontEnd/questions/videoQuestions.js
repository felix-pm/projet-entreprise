import { initModal, handleAnswer } from "../modalChrono.js";

const btn = document.getElementById("btnBack");

btnBack.addEventListener("click", (event) => {
  window.location.href = "questionnaire.html";
});

const container = document.getElementById("videoQuestion");
// ** Récupération de la modal
const modal = document.querySelector("#modalStart");
const modalTitle = document.querySelector("#questionModal");
const title = sessionStorage.getItem("titreQuestionnaireActuel");

let questions = [];
let currentIndex = 0;

document.addEventListener("keydown", (event) => {
  // On vérifie qu'on appuie sur Espace ET que la modale n'est pas déjà cachée
  if (event.code === "Space" && !modal.classList.contains("hidden")) {
    initModal(); // On lance le chrono et on cache la modale
  }
});

async function loadQuestion() {
  try {
    questions = await window.electronAPI.getElement(title, "questionsVideo");

    if (questions && questions.length > 0) {
      showQuestion(currentIndex); // On affiche la première question
    } else {
      container.innerHTML = "<p>Aucune question trouvée.</p>";
    }
  } catch (err) {
    console.error("Impossible de charger les questions :", err);
  }
}

function showQuestion(index) {
  if (index >= questions.length) {
    container.innerHTML = "<p>Toute les questions on été faites</p>";
    return;
  }

  container.innerHTML = "";

  // ** Réaffichage de la modal à chaque tour
  modal.classList.remove("hidden");

  const currentQuestion = questions[index];

  modalTitle.textContent = `Question ${index + 1} : ${currentQuestion["question"]}`;

  const text = document.createElement("p");
  text.textContent = `Question n°${currentQuestion["id"]}: ${currentQuestion["question"]}`;

  const btnVrai = document.createElement("button");
  btnVrai.classList.add("button");
  btnVrai.textContent = "Vrai";

  const btnFaux = document.createElement("button");
  btnVrai.classList.add("button");
  btnFaux.textContent = "Faux";

  btnVrai.addEventListener("click", () => {
    console.log("L'utilisateur à répondu vrai");
    currentIndex++;
    showQuestion(currentIndex);
    handleAnswer();
  });

  btnFaux.addEventListener("click", () => {
    console.log("L'utilisateur à répondu faux");
    currentIndex++;
    showQuestion(currentIndex);
    handleAnswer();
  });

  container.append(text, btnVrai, btnFaux);
}

loadQuestion();
