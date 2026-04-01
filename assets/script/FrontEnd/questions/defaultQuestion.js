// FrontEnd/questions/defaultQuestion.js
import { hiddenModalChrono, handleAnswer } from "../modal.js";
import { saveRespons, saveInSessionStorage } from "../saveRespons.js";
import { loadQuestion } from "../loadQuestion.js";

const btnBack = document.getElementById("btnBack");
btnBack.addEventListener("click", (event) => {
  window.location.href = "questionnaire.html";
});

const container = document.getElementById("sectionQuestion");
const modal = document.querySelector("#modalStart");
const modalTitle = document.querySelector("#questionModal");

const title = sessionStorage.getItem("titreQuestionnaireActuel");

// 1. ASTUCE : On récupère le type de question depuis l'URL (?type=...)
const urlParams = new URLSearchParams(window.location.search);
const questionType = urlParams.get("type"); // Vaudra "questionsVideo" ou "questionsAudio"

let questions = [];
let currentIndex = 0;
let allTimer = 0;

document.addEventListener("keydown", (event) => {
  if (event.code === "Space" && !modal.classList.contains("hidden")) {
    hiddenModalChrono();
  }
});

function calculMoy(addition) {
  const moyenTemp = addition / 15;
  return moyenTemp.toFixed(3);
}

function showQuestion(index) {
  if (index >= questions.length) {
    container.innerHTML = "<p>Vous avez terminé les questions !</p>";
    const moyenFinal = calculMoy(allTimer);
    console.log("Moyenne temps:", moyenFinal);

    const allQuestions = document.createElement("a");
    allQuestions.textContent = "Enregistrer les données";
    allQuestions.className = "recordvideoanswers";
    allQuestions.href = "allQuestionnaire.html";
    container.append(allQuestions);

    const allQuestionsAnswer = document.querySelector(".recordvideoanswers");
    allQuestionsAnswer.addEventListener("click", async (event) => {
      event.preventDefault();
      await saveRespons();
      window.location.href = allQuestions.href;
    });
    return;
  }

  container.innerHTML = "";
  modal.classList.remove("hidden");

  const currentQuestion = questions[index];
  modalTitle.textContent = `${currentQuestion["question"]}?`;

  const text = document.createElement("p");
  text.classList.add("text");
  text.textContent = `${currentQuestion["question"]}?`;

  const btnVrai = document.createElement("button");
  btnVrai.classList.add("btnVrai", "button");
  btnVrai.textContent = "Vrai";

  const btnFaux = document.createElement("button");
  // Correction ici : dans ton ancien code tu ajoutais 'button' à btnVrai au lieu de btnFaux
  btnFaux.classList.add("btnFaux", "button");
  btnFaux.textContent = "Faux";

  // Gestion du clic pour passer à la question suivante
  saveInSessionStorage(btnVrai);
  saveInSessionStorage(btnFaux);
  showTrustIndex(btnVrai);
  showTrustIndex(btnFaux);
  container.append(text, btnVrai, btnFaux);
  const buttonTrustIndexLow = document.querySelector("Low");
  const buttonTrustIndexMiddle = document.querySelector("Middle");
  const buttonTrustIndexHigh = document.querySelector("High");
  hiddenTrustModal(buttonTrustIndexLow);
  hiddenTrustModal(buttonTrustIndexMiddle);
  hiddenTrustModal(buttonTrustIndexHigh);
}

function showTrustIndex(button) {
  button.addEventListener("click", () => {
    const modal = document.getElementById("modalIndexStart");
    modal.remove("hidden");
    const trustIndexLow = document.createElement("button");
    trustIndexLow.textContent = "Low";
    trustIndexLow.classList.add = "Low";
    const trustIndexMiddle = document.createElement("button");
    trustIndexMiddle.textContent = "Middle";
    trustIndexMiddle.classList.add = "Middle";
    const trustIndexHigh = document.createElement("button");
    trustIndexHigh.textContent = "High";
    trustIndexHigh.classList.add = "High";
    modal.append(trustIndexLow, trustIndexMiddle, trustIndexHigh);
  });
}

async function hiddenTrustModal(button) {
  await button.addEventListener("click", () => {
    if (button.textContent == "Low") {
      sessionStorage.setItem(trustIndex, 1);
    } else if (button.textContent == "Middle") {
      sessionStorage.setItem(trustIndex, 2);
    } else if (button.textContent == "High") {
      sessionStorage.setItem(trustIndex, 3);
    }
    modal.add("hidden");
  });
}

// 2. Initialisation : On lance le chargement en fonction de l'URL
async function init() {
  if (!questionType) {
    container.innerHTML =
      "<p>Erreur : Type de question introuvable dans l'URL.</p>";
    return;
  }

  // Optionnel : On change dynamiquement le grand titre H1 de la page
  document.querySelector("h1").textContent =
    questionType === "questionsVideo" ? "Questions Vidéo" : "Questions Audio";

  // On appelle notre fonction loadQuestion qui a été simplifiée
  questions = await loadQuestion(title, questionType);

  if (questions && questions.length > 0) {
    showQuestion(currentIndex);
  } else {
    container.innerHTML = "<p>Aucune question trouvée.</p>";
  }

  const buttons = document.quer;
}

// On démarre le script !
init();
