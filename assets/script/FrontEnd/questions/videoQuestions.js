import { initModal, handleAnswer } from "../modalChrono.js";
import { saveRespons, saveInSessionStorage } from "../saveRespons.js";

const btnBack = document.getElementById("btnBack");

btnBack.addEventListener("click", (event) => {
  window.location.href = "questionnaire.html";
});

const container = document.getElementById("videoQuestion"); //! unique à vidéo
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
    questions = await window.electronAPI.getElement(title, "questionsVideo"); //! unique à vidéo

    if (questions && questions.length > 0) {
      showQuestion(currentIndex); // On affiche la première question
    } else {
      container.innerHTML = "<p>Aucune question trouvée.</p>";
    }
  } catch (err) {
    console.error("Impossible de charger les questions :", err);
  }
}

const currentYield = sessionStorage.getItem("currentYield"); //!

function showQuestion(index) {
  if (index >= questions.length) {
    container.innerHTML = "<p>Vous avez terminé les questions vidéo !</p>"; //! unique à vidéo
    const recordquestions = document.createElement("a");
    recordquestions.textContent = "Enregistrer les données";
    recordquestions.className = "recordvideoanswers";
    recordquestions.href = "allQuestionnaire.html";
    container.append(recordquestions);

    const recordvideoanswers = document.querySelector(".recordvideoanswers");

    recordvideoanswers.addEventListener("click", async (event) => {
      event.preventDefault();
      await saveRespons();
      window.location.href = recordquestions.href;
    });

    return;
  }

  container.innerHTML = "";

  // ** Réaffichage de la modal à chaque tour
  modal.classList.remove("hidden");

  const currentQuestion = questions[index];

  modalTitle.textContent = `Question ${index + 1} : ${currentQuestion["question"]}`;

  const text = document.createElement("p");
  text.classList.add("text");
  text.textContent = `${currentQuestion["question"]}?`;

  const btnVrai = document.createElement("button");
  btnVrai.classList.add("btnVrai");
  btnVrai.classList.add("button");
  btnVrai.textContent = "Vrai";

  const btnFaux = document.createElement("button");
  btnFaux.classList.add("btnFaux");
  btnVrai.classList.add("button");
  btnFaux.textContent = "Faux";

  btnVrai.addEventListener("click", () => {
    sessionStorage.setItem(
      `${currentYield}-QuestionVideo${index + 1}`, //!
      btnVrai.textContent,
    );

    currentIndex++; // On passe à la suivante
    showQuestion(currentIndex); // On met à jour l'écran
  });

  btnFaux.addEventListener("click", () => {
    sessionStorage.setItem(
      `${currentYield}-QuestionVideo${index + 1}`, //!
      btnFaux.textContent,
    );

    currentIndex++; // On passe à la suivante
    showQuestion(currentIndex); // On met à jour l'écran
  });

  container.append(text, btnVrai, btnFaux);
}

// 4. On lance le processus au chargement de la page
loadQuestion();

async function clesrSessionStorage() {
  const numberPassation = sessionStorage.getItem("numberPassation");
  const sexe = sessionStorage.getItem("sexe");
  const age = sessionStorage.getItem("age");
  const currentYield = sessionStorage.getItem("currentYield"); // "Yield1" ou "Yield2"

  const answers = {
    [numberPassation]: { sexe: [sexe] },
    age: [age],
    questionsVideo: {},
    questionsAudio: {},
  };
}

async function clearSessionStorage() {
  let keysToDelete = []; //!

  // 2. On parcourt le sessionStorage pour collecter les données
  // On utilise Object.keys pour éviter les problèmes d'index si le storage change
  const toutesLesCles = Object.keys(sessionStorage);
  const title = sessionStorage.getItem("titreQuestionnaireActuel");

  toutesLesCles.forEach((key) => {
    if (key.startsWith(`${currentYield}-QuestionVideo`)) {
      answers.questionsVideo[key] = sessionStorage.getItem(key);
      keysToDelete.push(key);
    } else if (key.startsWith(`${currentYield}-QuestionAudio`)) {
      answers.questionsAudio[key] = sessionStorage.getItem(key);
      keysToDelete.push(key);
    }
  });

  if (currentYield === "Yield1") {
    await window.electronAPI.saveYield1Questions(answers, title);
  } else {
    await window.electronAPI.saveYield2Questions(answers, title);
  }

  keysToDelete.forEach((key) => sessionStorage.removeItem(key));
}

clesrSessionStorage();
