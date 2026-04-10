// FrontEnd/questions/defaultQuestion.js
import { hiddenModalChrono, handleAnswer } from "../modal.js";
import { clearSessionStorage, saveInSessionStorage } from "../saveRespons.js";
import { loadQuestion } from "../loadQuestion.js";
import { calculShift, calculScore } from "../calculScore.js";

const container = document.getElementById("sectionQuestion");
const modalStart = document.querySelector("#modalStart");
const modalTitle = document.querySelector("#questionModal");
const modalButton = document.getElementById("startQuestion");
const modalIndex = document.getElementById("modalIndexStart");

const title = sessionStorage.getItem("titreQuestionnaireActuel");

const currentYield = sessionStorage.getItem("currentYield");

const urlParams = new URLSearchParams(window.location.search);
const questionType = urlParams.get("type");

let questions = [];
let currentIndex = 0;
let allTimer = 0;

modalButton.addEventListener("click", (event) => {
  if (!modalStart.classList.contains("hidden")) {
    event.preventDefault();
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
    }

    container.append(allQuestions);

    const allQuestionsAnswer = document.querySelector(".recordvideoanswers");

    // Événement au clic sur "Enregistrer les données",
    if (currentYield !== "Yield1") {
      allQuestionsAnswer.addEventListener("click", async (event) => {
        event.preventDefault();

        // --- 1. RÉCUPÉRATION DES RENSEIGNEMENTS ---
        const numberPassation = sessionStorage.getItem("numberPassation");
        const sexe = sessionStorage.getItem("sexe");
        const age = sessionStorage.getItem("age");
        const date = sessionStorage.getItem("date");

        // --- 2. CRÉATION DE L'OBJET GLOBAL ---
        const answers = {
          numberPassation: [numberPassation],
          trustIndex: {},
          chrono: {},
        };

        if (sexe) answers.sexe = [sexe];
        if (age) answers.age = [age];
        if (date) answers.date = [date];

        // On crée dynamiquement la clé "questionsVideo" ou "questionsAudio" selon l'URL
        answers[questionType] = {};

        if (questionType === "questionsAudio") {
          const sAudio1Y1 = await calculScore(
            "questionsAudio",
            "Yield1-questionsAudio",
          );
          const sAudio2Y2 = await calculScore(
            "questionsAudio",
            "Yield2-questionsAudio",
          );
          const sShiftAudio = await calculShift("questionsAudio");
          const totalSAudio = sAudio1Y1 + sShiftAudio;
          answers.scoreAudioY1 = sAudio1Y1;
          answers.scoreAudioY2 = sAudio2Y2;
          answers.scoreShiftAudio = sShiftAudio;
          answers.totalScoreAudio = totalSAudio;
        }

        if (questionType === "questionsVideo") {
          const sVideo1Y1 = await calculScore(
            "questionsVideo",
            "Yield1-questionsVideo",
          );
          const sVideo2Y2 = await calculScore(
            "questionsVideo",
            "Yield2-questionsVideo",
          );
          const sShiftVideo = await calculShift("questionsVideo");
          const totalSVideo = sVideo1Y1 + sShiftVideo;
          answers.scoreVideoY1 = sVideo1Y1;
          answers.scoreVideoY2 = sVideo2Y2;
          answers.scoreShiftVideo = sShiftVideo;
          answers.totalScoreVideo = totalSVideo;
        }

        // --- 3. ENVOI À LA FONCTION DE SAUVEGARDE ---
        // On passe "answers" ET "questionType" à clearSessionStorage
        await clearSessionStorage(answers, questionType);

        window.location.href = allQuestions.href;
      });
    }
    return;
  }

  modalStart.classList.remove("hidden");

  const currentQuestion = questions[index];
  modalTitle.textContent = `Question ${index + 1}`;

  const text = document.createElement("p");
  text.classList.add("text");
  text.textContent = `${currentQuestion["question"]}`;

  const divBtn = document.createElement("div");
  divBtn.classList.add("flex-btn");

  const btnVrai = document.createElement("button");
  btnVrai.classList.add("btnVrai", "button");
  btnVrai.textContent = questionType === "questionsMdls" ? "Vu" : "Vrai";

  const btnFaux = document.createElement("button");
  btnFaux.classList.add("btnFaux", "button");
  btnFaux.textContent = questionType === "questionsMdls" ? "Entendu" : "Faux";

  const handleButtonClick = (btnText) => {
    saveInSessionStorage(currentYield, currentIndex, questionType, btnText);
    let time = handleAnswer();
    saveInSessionStorage(
      currentYield,
      currentIndex,
      questionType,
      time,
      "chrono",
    );
    allTimer += time;

    // Ne pas incrémenter ni appeler showQuestion ici si on attend le trustIndex
    if (questionType != "questionsMdls") {
      showTrustIndex(currentIndex); // on passe l'index courant
    } else {
      currentIndex++;
      showQuestion(currentIndex);
    }
  };

  btnVrai.addEventListener("click", () =>
    handleButtonClick(btnVrai.textContent),
  );
  btnFaux.addEventListener("click", () =>
    handleButtonClick(btnFaux.textContent),
  );

  divBtn.append(btnVrai, btnFaux);
  container.append(text, divBtn);
}

function showTrustIndex(index) {
  modalIndex.classList.remove("hidden");

  const buttonTrustIndexLow = document.querySelector(".Low");
  const buttonTrustIndexMiddle = document.querySelector(".Middle");
  const buttonTrustIndexHigh = document.querySelector(".High");

  [buttonTrustIndexLow, buttonTrustIndexMiddle, buttonTrustIndexHigh].forEach(
    (button) => {
      button.onclick = () => {
        if (button.classList.contains("Low")) {
          sessionStorage.setItem(
            `trustIndex-${currentYield}-${questionType}${index + 1}`,
            1,
          );
        } else if (button.classList.contains("Middle")) {
          sessionStorage.setItem(
            `trustIndex-${currentYield}-${questionType}${index + 1}`,
            2,
          );
        } else if (button.classList.contains("High")) {
          sessionStorage.setItem(
            `trustIndex-${currentYield}-${questionType}${index + 1}`,
            3,
          );
        }
        modalIndex.classList.add("hidden");
        currentIndex++; // On incrémente seulement après le choix
        showQuestion(currentIndex); // On passe à la question suivante après le choix
      };
    },
  );
}

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

  questions = await loadQuestion(title, questionType);

  if (questions && questions.length > 0) {
    showQuestion(currentIndex);
  } else {
    container.innerHTML = "<p>Aucune question trouvée.</p>";
  }
}

init();
