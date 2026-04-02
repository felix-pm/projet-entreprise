// FrontEnd/questions/defaultQuestion.js
import { hiddenModalChrono, handleAnswer } from "../modal.js";
import { clearSessionStorage, saveInSessionStorage } from "../saveRespons.js";
import { loadQuestion } from "../loadQuestion.js";

const btnBack = document.getElementById("btnBack");
btnBack.addEventListener("click", (event) => {
  window.location.href = "questionnaire.html";
});

const container = document.getElementById("sectionQuestion");
const modalStart = document.querySelector("#modalStart");
const modalTitle = document.querySelector("#questionModal");
const modalIndex = document.getElementById("modalIndexStart");

const title = sessionStorage.getItem("titreQuestionnaireActuel");

const currentYield = sessionStorage.getItem("currentYield");

// 1. ASTUCE : On récupère le type de question depuis l'URL (?type=...)
const urlParams = new URLSearchParams(window.location.search);
const questionType = urlParams.get("type"); // Vaudra "questionsVideo" ou "questionsAudio"

let questions = [];
let currentIndex = 0;
let allTimer = 0;

document.addEventListener("keydown", (event) => {
  if (event.code === "Space" && !modalStart.classList.contains("hidden")) {
    event.preventDefault(); // Empêche la page de descendre
    modalStart.classList.add("hidden");
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
    allQuestions.href = "questionnaire.html";
    container.append(allQuestions);

    const allQuestionsAnswer = document.querySelector(".recordvideoanswers");

    // Événement au clic sur "Enregistrer les données"
    allQuestionsAnswer.addEventListener("click", async (event) => {
      event.preventDefault();

      // --- 1. RÉCUPÉRATION DES RENSEIGNEMENTS ---
      const numberPassation = sessionStorage.getItem("numberPassation");
      const sexe = sessionStorage.getItem("sexe");
      const age = sessionStorage.getItem("age");

      // --- 2. CRÉATION DE L'OBJET GLOBAL ---
      const answers = {
        [numberPassation]: { sexe: [sexe] },
        age: [age],
      };

      // On crée dynamiquement la clé "questionsVideo" ou "questionsAudio" selon l'URL
      answers[questionType] = {};

      // --- 3. ENVOI À LA FONCTION DE SAUVEGARDE ---
      // On passe "answers" ET "questionType" à clearSessionStorage
      await clearSessionStorage(answers, questionType);

      window.location.href = allQuestions.href;
    });
    return;
  }

  container.innerHTML = "";
  modalStart.classList.remove("hidden");

  const currentQuestion = questions[index];
  modalTitle.textContent = `${currentQuestion["question"]}?`;

  const text = document.createElement("p");
  text.classList.add("text");
  text.textContent = `${currentQuestion["question"]}?`;

  const btnVrai = document.createElement("button");
  btnVrai.classList.add("btnVrai", "button");
  btnVrai.textContent = "Vrai";

  const btnFaux = document.createElement("button");
  btnFaux.classList.add("btnFaux", "button");
  btnFaux.textContent = "Faux";

  // NOUVEAU : On gère le clic ici pour garder le bon scope !
  const handleButtonClick = (btnText) => {
    // 1. Appel du fichier externe pour sauvegarder
    saveInSessionStorage(currentYield, currentIndex, questionType, btnText);

    // 2. Mise à jour de tes variables locales
    allTimer += handleAnswer();
    currentIndex++; // Ici ça marchera !

    // 3. Affichage de la suite
    showQuestion(currentIndex);
  };

  btnVrai.addEventListener("click", () =>
    handleButtonClick(btnVrai.textContent),
  );
  btnFaux.addEventListener("click", () =>
    handleButtonClick(btnFaux.textContent),
  );

  // Gestion du clic pour passer à la question suivante
  showTrustIndex(btnVrai, index);
  showTrustIndex(btnFaux, index);
  container.append(text, btnVrai, btnFaux);
}

function showTrustIndex(button, index) {
  modalIndex.innerHTML = "<h2>A quel point tu es confiant sur ta réponse?</h2>";
  button.addEventListener("click", () => {
    modalIndex.classList.remove("hidden");
    const trustIndexLow = document.createElement("button");
    trustIndexLow.textContent = "Low";
    trustIndexLow.classList.add("Low");
    const trustIndexMiddle = document.createElement("button");
    trustIndexMiddle.textContent = "Middle";
    trustIndexMiddle.classList.add("Middle");
    const trustIndexHigh = document.createElement("button");
    trustIndexHigh.textContent = "High";
    trustIndexHigh.classList.add("High");
    modalIndex.append(trustIndexLow, trustIndexMiddle, trustIndexHigh);

    const buttonTrustIndexLow = document.querySelector(".Low");
    const buttonTrustIndexMiddle = document.querySelector(".Middle");
    const buttonTrustIndexHigh = document.querySelector(".High");

    hiddenTrustModal(buttonTrustIndexLow, index);
    hiddenTrustModal(buttonTrustIndexMiddle, index);
    hiddenTrustModal(buttonTrustIndexHigh, index);
  });
}

function hiddenTrustModal(button, index) {
  button.addEventListener("click", () => {
    if (button.textContent == "Low") {
      sessionStorage.setItem(
        `trustIndex-
        ${currentYield}-${questionType}${index + 1}`,
        1,
      );
    } else if (button.textContent == "Middle") {
      sessionStorage.setItem(`${currentYield}-${questionType}${index + 1}`, 2);
    } else if (button.textContent == "High") {
      sessionStorage.setItem(`${currentYield}-${questionType}${index + 1}`, 3);
    }
    modalIndex.classList.add("hidden");
  });
}

// Présent dans videoQuestions.js, mais MANQUANT dans defaultQuestion.js
const numberPassation = sessionStorage.getItem("numberPassation");
const sexe = sessionStorage.getItem("sexe");
const age = sessionStorage.getItem("age");

const answers = {
  [numberPassation]: { sexe: [sexe] },
  age: [age],
  questionsVideo: {},
  // (Note: d'ailleurs, pour que ce soit générique, il faudrait adapter "questionsVideo" selon le test)
};

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
}

// On démarre le script !
init();
