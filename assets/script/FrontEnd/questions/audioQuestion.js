const btnBack = document.getElementById("btnBack");

btnBack.addEventListener("click", (event) => {
  window.location.href = "questionnaire.html";
});

const container = document.getElementById("questionAudio");
const title = sessionStorage.getItem("titreQuestionnaireActuel");

// 1. On crée des variables globales pour stocker les données et notre position
let questions = [];
let currentIndex = 0; // En informatique, le premier élément d'un tableau est à l'index 0

// 2. On charge les données DEPUIS ELECTRON UNE SEULE FOIS
async function loadQuestions() {
  try {
    questions = await window.electronAPI.getElement(title, "questionsAudio");

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

  // C. On récupère la question actuelle dans notre tableau
  const currentQuestion = questions[index];

  // D. Création des éléments HTML
  const text = document.createElement("p");
  text.classList.add("text");
  text.textContent = `Question ${index + 1} : ${currentQuestion["question"]}`;

  const btnVrai = document.createElement("button");
  btnVrai.classList.add("btnVrai");
  btnVrai.textContent = "Vrai";

  const btnFaux = document.createElement("button");
  btnFaux.classList.add("btnFaux");
  btnFaux.textContent = "Faux";

  // E. On ajoute les événements DIRECTEMENT sur les boutons qu'on vient de créer
  btnVrai.addEventListener("click", () => {
    console.log(
      "L'utilisateur a répondu Vrai à la question :",
      currentQuestion.id,
    );
    // Plus tard, tu pourras enregistrer la réponse ici

    currentIndex++; // On passe à la suivante
    showQuestion(currentIndex); // On met à jour l'écran
  });

  btnFaux.addEventListener("click", () => {
    console.log(
      "L'utilisateur a répondu Faux à la question :",
      currentQuestion.id,
    );
    // Plus tard, tu pourras enregistrer la réponse ici

    currentIndex++; // On passe à la suivante
    showQuestion(currentIndex); // On met à jour l'écran
  });

  // F. On injecte tout dans le HTML
  container.append(text, btnVrai, btnFaux);
}

// 4. On lance le processus au chargement de la page
loadQuestions();
