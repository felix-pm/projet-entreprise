import { initModal, handleAnswer } from "../modalChrono.js";

const btnBack = document.getElementById("btnBack");

btnBack.addEventListener("click", (event) => {
  window.location.href = "questionnaire.html";
});

const container = document.getElementById("sourceQuestion");
// ** Récupération de la modal
const modal = document.querySelector("#modalStart");
const modalTitle = document.querySelector("#questionModal");
const title = sessionStorage.getItem("titreQuestionnaireActuel");

// 1. On crée des variables globales pour stocker les données et notre position
let questions = [];
let currentIndex = 0; // En informatique, le premier élément d'un tableau est à l'index 0

document.addEventListener("keydown", (event) => {
  // On vérifie qu'on appuie sur Espace ET que la modale n'est pas déjà cachée
  if (event.code === "Space" && !modal.classList.contains("hidden")) {
    initModal(); // On lance le chrono et on cache la modale
  }
});

// 2. On charge les données DEPUIS ELECTRON UNE SEULE FOIS
async function loadQuestions() {
  try {
    questions = await window.electronAPI.getElement(title, "questionsMdls");

    if (questions && questions.length > 0) {
      showQuestion(currentIndex); // On affiche la première question
    } else {
      container.innerHTML = "<p>Aucune question trouvée.</p>";
    }
  } catch (error) {
    console.error("Impossible de charger les questions :", error);
  }
}

// 3. Fonction qui gère l'affichage d'UNE question
function showQuestion(index) {
  // A. Vérifier si on a fini toutes les questions
  if (index >= questions.length) {
    container.innerHTML = "<p>Vous avez terminé les questions vidéo !</p>";
    // Optionnel : Tu pourrais le rediriger automatiquement avec window.location.href
    return; // On arrête la fonction ici
  }

  // B. On vide le conteneur pour effacer l'ancienne question
  container.innerHTML = "";

  // ** Réaffichage de la modal à chaque tour
  modal.classList.remove("hidden");

  // C. On récupère la question actuelle dans notre tableau
  const currentQuestion = questions[index];

  modalTitle.textContent = `Question ${index + 1} : ${currentQuestion["question"]}`;

  // D. Création des éléments HTML
  const text = document.createElement("p");
  text.classList.add("text");
  text.textContent = `Question ${index + 1} : ${currentQuestion["question"]}`;

  const btnVu = document.createElement("button");
  btnVu.classList.add("btnVrai");
  btnVu.textContent = "vu";

  const btnEntendu = document.createElement("button");
  btnEntendu.classList.add("btnFaux");
  btnEntendu.textContent = "entendu";

  // E. On ajoute les événements DIRECTEMENT sur les boutons qu'on vient de créer
  btnVu.addEventListener("click", () => {
    console.log(
      "L'utilisateur a répondu Vu à la question :",
      currentQuestion.id,
    );
    // Plus tard, tu pourras enregistrer la réponse ici

    handleAnswer();

    currentIndex++; // On passe à la suivante
    showQuestion(currentIndex); // On met à jour l'écran
  });

  btnEntendu.addEventListener("click", () => {
    console.log(
      "L'utilisateur a répondu Entendu à la question :",
      currentQuestion.id,
    );
    // Plus tard, tu pourras enregistrer la réponse ici

    handleAnswer();

    currentIndex++; // On passe à la suivante
    showQuestion(currentIndex); // On met à jour l'écran
  });

  // F. On injecte tout dans le HTML
  container.append(text, btnVu, btnEntendu);
}

// 4. On lance le processus au chargement de la page
loadQuestions();
