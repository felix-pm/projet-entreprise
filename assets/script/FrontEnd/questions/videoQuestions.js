const btn = document.getElementById("btnBack");

btnBack.addEventListener("click", (event) => {
  window.location.href = "questionnaire.html";
});

const container = document.getElementById("videoQuestion");
const title = sessionStorage.getItem("titreQuestionnaireActuel");

let questions = [];
let currentIndex = 0;

async function loadQuestion() {
  try {
    question = await window.electronAPI.getElement(title, "questionsVideo");

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

  const currentQuestion = questions[index];

  const text = document.createElement("p");
  text.textContent = `Question n°${currentQuestion["id"]}: ${currentQuestion["question"]}`;

  const btnVrai = document.createElement("button");
  btnVrai.classList.add("button");
  btnVrai.classList.add(`btn ${index}`);
  btnVrai.textContent = "Vrai";

  const btnFaux = document.createElement("button");
  btnVrai.classList.add("button");
  btnVrai.classList.add(`btn ${index}`);
  btnFaux.textContent = "Faux";

  btnVrai.addEventListener("click", () => {
    console.log("L'utilisateur à répondu vrai");
    currentIndex++;
    showQuestion(currentIndex);
  });

  btnFaux.addEventListener("click", () => {
    console.log("L'utilisateur à répondu faux");
    currentIndex++;
    showQuestion(currentIndex);
  });

  container.append(text, btnVrai, btnFaux);
}

loadQuestion();
