// FrontEnd/questions/defaultQuestion.js
import { hiddenModalChrono, handleAnswer } from "../modal.js";
import { clearSessionStorage, saveInSessionStorage } from "../saveRespons.js";
import { loadQuestion } from "../loadQuestion.js";

const container = document.getElementById("sectionQuestion");
const modalStart = document.querySelector("#modalStart");
const modalTitle = document.querySelector("#questionModal");
const modalButton = document.getElementById("startQuestion");
const modalIndex = document.getElementById("modalIndexStart");

const title = sessionStorage.getItem("titreQuestionnaireActuel");

const currentYield = sessionStorage.getItem("currentYield");

// 1. ASTUCE : On récupère le type de question depuis l'URL (?type=...)
const urlParams = new URLSearchParams(window.location.search);
const questionType = urlParams.get("type"); // Vaudra "questionsVideo" ou "questionsAudio"

let questions = [];
let currentIndex = 0;
let allTimer = 0;

modalButton.addEventListener("click", (event) => {
  if (!modalStart.classList.contains("hidden")) {
    event.preventDefault(); // Empêche la page de descendre
    modalStart.classList.add("hidden");
    hiddenModalChrono();
  }
});

function calculMoy(addition, type) {
  let moyenTemp = 0;
  if (type != "questionsMdls") {
    moyenTemp = addition / 15;
  } else {
    moyenTemp = addition / 10;
  }
  return moyenTemp.toFixed(3);
}

function showQuestion(index) {
  container.innerHTML = "";
  if (index >= questions.length) {
    const moyenFinal = calculMoy(allTimer, questionType);
    saveInSessionStorage(
      currentYield,
      currentIndex,
      questionType,
      moyenFinal,
      "chronoMoy",
    );
    console.log("Moyenne temps:", moyenFinal, questionType);

    const allQuestions = document.createElement("a");
    allQuestions.className = "recordvideoanswers";

    if (currentYield == "Yield1") {
      allQuestions.textContent = "Recommencer les questions";
      allQuestions.href = `defaultQuestion.html?type=${questionType}`;
      // Événement au clic sur "Enregistrer les données"
      allQuestions.addEventListener("click", async (event) => {
        event.preventDefault();

        if (currentYield == "Yield1") {
          sessionStorage.setItem("currentYield", "Yield2");
        }

        window.location.href = allQuestions.href;
      });
    } else {
      allQuestions.textContent = "Terminer le questionnaire";
      allQuestions.href = `questionnaire.html`;
      // Événement au clic sur "Enregistrer les données"
      allQuestions.addEventListener("click", async (event) => {
        event.preventDefault();

        // --- 1. RÉCUPÉRATION DES RENSEIGNEMENTS ---
        const numberPassation = sessionStorage.getItem("numberPassation");
        const sexe = sessionStorage.getItem("sexe");
        const age = sessionStorage.getItem("age");
        const date = sessionStorage.getItem("date");

        // --- 2. CRÉATION DE L'OBJET GLOBAL ---
        const answers = {
          numberPassation: [numberPassation],
          sexe: [sexe],
          age: [age],
          date: [date],
          trustIndex: {},
        };

        // On crée dynamiquement la clé "questionsVideo" ou "questionsAudio" selon l'URL
        answers[questionType] = {};

        // --- 3. ENVOI À LA FONCTION DE SAUVEGARDE ---
        // On passe "answers" ET "questionType" à clearSessionStorage
        await clearSessionStorage(answers, questionType);
      });
    }

    container.append(allQuestions);

    const allQuestionsAnswer = document.querySelector(".recordvideoanswers");

    // Événement au clic sur "Enregistrer les données"
    allQuestionsAnswer.addEventListener("click", async (event) => {
      event.preventDefault();

      // --- 1. RÉCUPÉRATION DES RENSEIGNEMENTS ---
      const numberPassation = sessionStorage.getItem("numberPassation");
      const sexe = sessionStorage.getItem("sexe");
      const age = sessionStorage.getItem("age");
      const date = sessionStorage.getItem("date");

      // --- 2. CRÉATION DE L'OBJET GLOBAL ---
      const answers = {
        [numberPassation]: { sexe: [sexe] },
        age: [age],
        date: [date],
        trustIndex: {},
        chrono: {},
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

  modalStart.classList.remove("hidden");

  const currentQuestion = questions[index];
  modalTitle.textContent = `Question ${index + 1}:${currentQuestion["question"]}?`;

  const text = document.createElement("p");
  text.classList.add("text");
  text.textContent = `${currentQuestion["question"]}?`;

  const btnVrai = document.createElement("button");
  btnVrai.classList.add("btnVrai", "button");
  btnVrai.textContent = questionType === "questionsMdls" ? "Vu" : "Vrai";

  const btnFaux = document.createElement("button");
  btnFaux.classList.add("btnFaux", "button");
  btnFaux.textContent = questionType === "questionsMdls" ? "Entendu" : "Faux";

  // NOUVEAU : On gère le clic ici pour garder le bon scope !
  const handleButtonClick = (btnText) => {
    // 1. Appel du fichier externe pour sauvegarder
    saveInSessionStorage(currentYield, currentIndex, questionType, btnText);
    let time = handleAnswer();
    saveInSessionStorage(
      currentYield,
      currentIndex,
      questionType,
      time,
      "chrono",
    );
    // 2. Mise à jour de tes variables locales
    allTimer += time;
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
  if (questionType != "questionsMdls") {
    showTrustIndex(btnVrai, index);
    showTrustIndex(btnFaux, index);
  }
  container.append(text, btnVrai, btnFaux);
}

function showTrustIndex(button, index) {
  button.addEventListener("click", () => {
    modalIndex.classList.remove("hidden");

    const buttonTrustIndexLow = document.querySelector(".Low");
    const buttonTrustIndexMiddle = document.querySelector(".Middle");
    const buttonTrustIndexHigh = document.querySelector(".High");

    hiddenTrustModal(buttonTrustIndexLow, index);
    hiddenTrustModal(buttonTrustIndexMiddle, index);
    hiddenTrustModal(buttonTrustIndexHigh, index);
  });
}

function hiddenTrustModal(button, index) {
  button.onclick = () => {
    if (button.textContent == "Low") {
      sessionStorage.setItem(
        `trustIndex-${currentYield}-${questionType}${index + 1}`,
        1,
      );
    } else if (button.textContent == "Middle") {
      sessionStorage.setItem(
        `trustIndex-${currentYield}-${questionType}${index + 1}`,
        2,
      );
    } else if (button.textContent == "High") {
      sessionStorage.setItem(
        `trustIndex-${currentYield}-${questionType}${index + 1}`,
        3,
      );
    }
    modalIndex.classList.add("hidden");
  };
}

// 2. Initialisation : On lance le chargement en fonction de l'URL
async function init() {
  if (!questionType) {
    container.innerHTML =
      "<p>Erreur : Type de question introuvable dans l'URL.</p>";
    return;
  }

  let titreH1 = "Questions";
  if (questionType === "questionsVideo") titreH1 = "Questions Vidéo";
  else if (questionType === "questionsAudio") titreH1 = "Questions Audio";
  else if (questionType === "questionsMdls") titreH1 = "Questions Source";

  document.querySelector("h1").textContent = titreH1;

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
