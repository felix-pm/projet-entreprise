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
<<<<<<< HEAD
    container.innerHTML = "<p>Toute les questions on été faites</p>";
    return;
=======
    container.innerHTML = "<p>Vous avez terminé les questions vidéo !</p>";
    const recordquestions = document.createElement("a");
    recordquestions.textContent = "Enregistrer les données";
    recordquestions.className = "recordvideoanswers";
    recordquestions.href = "allQuestionnaire.html";
    container.append(recordquestions);

    const recordvideoanswers = document.querySelector(".recordvideoanswers");

    recordvideoanswers.addEventListener("click", async (event) => {
      event.preventDefault();
      await clearSessionStorage();
      window.location.href = recordquestions.href;
    });

    // Optionnel : Tu pourrais le rediriger automatiquement avec window.location.href
    return; // On arrête la fonction ici
>>>>>>> addcontentvideosyield2
  }

  container.innerHTML = "";

  // ** Réaffichage de la modal à chaque tour
  modal.classList.remove("hidden");

  const currentQuestion = questions[index];

  modalTitle.textContent = `Question ${index + 1} : ${currentQuestion["question"]}`;

  const text = document.createElement("p");
<<<<<<< HEAD
  text.textContent = `Question n°${currentQuestion["id"]}: ${currentQuestion["question"]}`;

  const btnVrai = document.createElement("button");
=======
  text.classList.add("text");
  text.textContent = `${currentQuestion["question"]}?`;

  const btnVrai = document.createElement("button");
  btnVrai.classList.add("btnVrai");
>>>>>>> addcontentvideosyield2
  btnVrai.classList.add("button");
  btnVrai.textContent = "Vrai";

  const btnFaux = document.createElement("button");
<<<<<<< HEAD
=======
  btnFaux.classList.add("btnFaux");
>>>>>>> addcontentvideosyield2
  btnVrai.classList.add("button");
  btnFaux.textContent = "Faux";

  btnVrai.addEventListener("click", () => {
<<<<<<< HEAD
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
=======
    sessionStorage.setItem(`yield2-Question ${index + 1}`, btnVrai.textContent);

    // Plus tard, tu pourras enregistrer la réponse ici

    currentIndex++; // On passe à la suivante
    showQuestion(currentIndex); // On met à jour l'écran
  });

  btnFaux.addEventListener("click", () => {
    sessionStorage.setItem(`yield2-Question ${index + 1}`, btnFaux.textContent);
    // Plus tard, tu pourras enregistrer la réponse ici

    currentIndex++; // On passe à la suivante
    showQuestion(currentIndex); // On met à jour l'écran
>>>>>>> addcontentvideosyield2
  });

  container.append(text, btnVrai, btnFaux);
}

<<<<<<< HEAD
loadQuestion();
=======
// 4. On lance le processus au chargement de la page
loadQuestions();

async function clearSessionStorage() {
  const answers = {};
  let sessionStorageClear = [];

  for (let i = 0; i < sessionStorage.length; i++) {
    if (sessionStorage.key(i).startsWith("yield2")) {
      answers[sessionStorage.key(i)] = sessionStorage.getItem(
        sessionStorage.key(i),
      );
      console.log(answers);
      sessionStorageClear.push(sessionStorage.key(i));
    }
  }

  await window.electronAPI.saveVideosQuestions(answers);

  sessionStorageClear.forEach((key) => {
    sessionStorage.removeItem(key);
  });
}
>>>>>>> addcontentvideosyield2
