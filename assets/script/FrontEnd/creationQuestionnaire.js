function survey(
  containerQuestion,
  className,
  checkboxName,
  choice1Text,
  choice2Text,
) {
  const containerQuestions = document.querySelector(containerQuestion);
  const nameButton = document.createElement("button");
  nameButton.textContent = "Ajouter une question";
  nameButton.type = "button";
  nameButton.classList.add("btn-add-question");
  containerQuestions.append(nameButton);
  let i = 1;
  nameButton.addEventListener("click", () => {
    const divInput = document.createElement("div");
    const divQuestion = document.createElement("div");
    const labelQuestion = document.createElement("label");
    const inputQuestion = document.createElement("input");
    const checkbox1 = document.createElement("input");
    const checkbox2 = document.createElement("input");
    const choice1 = document.createElement("span");
    const choice2 = document.createElement("span");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Supprimer la question";
    deleteButton.type = "button";
    deleteButton.classList.add("btn-delete-question");

    labelQuestion.textContent = "Question " + i + " : ";
    inputQuestion.className = className;
    inputQuestion.dataset.id = i;
    inputQuestion.classList.add("inputQuestion");
    inputQuestion.required = true;

    checkbox1.type = "radio";
    checkbox1.name = checkboxName + i;
    checkbox1.className = "checkboxSurvey";
    choice1.textContent = choice1Text;
    checkbox1.value = choice1Text;
    checkbox1.required = true;

    checkbox2.type = "radio";
    checkbox2.name = checkboxName + i;
    checkbox2.className = "checkboxSurvey";
    choice2.textContent = choice2Text;
    checkbox2.value = choice2Text;
    checkbox2.required = true;

    divQuestion.classList.add("divQuestion");
    divInput.classList.add("divInput");

    divInput.append(
      inputQuestion,
      checkbox1,
      choice1,
      checkbox2,
      choice2,
      deleteButton,
    );

    divQuestion.append(labelQuestion, divInput);
    containerQuestions.appendChild(divQuestion);

    i++;

    deleteButton.addEventListener("click", () => {
      divQuestion.remove();
      reorderGeneral(containerQuestions, "Question ", checkboxName);
      i = containerQuestions.querySelectorAll(".divQuestion").length + 1;
    });
  });
}

function surveyExternalQuestion(containerQuestion, className) {
  const containerQuestions = document.querySelector(containerQuestion);
  const nameButton = document.createElement("button");
  nameButton.textContent = "Ajouter une question";
  nameButton.type = "button";
  nameButton.classList.add("btn-add-question");
  containerQuestions.append(nameButton);
  let i = 1;
  nameButton.addEventListener("click", () => {
    const divInput = document.createElement("div");
    const divQuestion = document.createElement("div");
    const labelQuestion = document.createElement("label");
    const inputQuestion = document.createElement("input");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Supprimer la question";
    deleteButton.type = "button";
    deleteButton.classList.add("btn-delete-question");

    labelQuestion.textContent = "Score Extérieur " + i + " : ";
    inputQuestion.className = className;
    inputQuestion.dataset.id = i;
    inputQuestion.name = `score-ext-${i}`;
    inputQuestion.type = "text";
    inputQuestion.classList.add("inputQuestion");

    divQuestion.classList.add("divQuestion");

    divQuestion.append(labelQuestion, divInput);
    divInput.append(inputQuestion, deleteButton);
    containerQuestions.appendChild(divQuestion);

    i++;

    deleteButton.addEventListener("click", () => {
      divQuestion.remove();
      // On réindexe et on met à jour i
      reorderGeneral(containerQuestions, "Score Extérieur ", "score-ext-");
      i = containerQuestions.querySelectorAll(".divQuestion").length + 1;
    });
  });
}

// Fonction qui remet le bon index dans le JSON si une question est supprimée
function reorderGeneral(container, labelText, namePrefix) {
  const groups = container.querySelectorAll(".divQuestion");
  groups.forEach((group, index) => {
    const newIndex = index + 1;
    const label = group.querySelector("label");
    const inputs = group.querySelectorAll("input");

    // Mise à jour du texte (on change le premier noeud texte pour ne pas supprimer l'input si il est dedans)
    label.childNodes[0].textContent = labelText + newIndex + " : ";

    inputs.forEach((input) => {
      input.dataset.id = newIndex;
      if (input.type === "radio") {
        input.name = namePrefix + newIndex;
      } else if (input.name.startsWith("score-ext-")) {
        input.name = "score-ext-" + newIndex;
      }
    });
  });
}

survey(
  "#container-questions-video",
  "questions-video",
  "answer-video",
  "Vrai",
  "Faux",
);

survey(
  "#container-questions-audio",
  "questions-audio",
  "answer-audio",
  "Vrai",
  "Faux",
);

survey(
  "#container-questions-mdls",
  "questions-mdls",
  "answer-mdls",
  "Vu",
  "Entendu",
);

surveyExternalQuestion("#container-score-exterieur", "input-scores-externes");

function setupFileInputFeedback(inputId) {
  const input = document.getElementById(inputId);
  const label = document.querySelector(`label[for="${inputId}"]`);

  if (!input || !label) {
    console.error(
      `⚠️ Impossible de trouver l'input ou le label pour : ${inputId}`,
    );
    return;
  }

  input.addEventListener("change", function (event) {
    const file = event.target.files[0];

    console.log(
      `Fichier sélectionné pour ${inputId} :`,
      file ? file.name : "Aucun",
    );

    if (file) {
      label.textContent = "✓";
      label.classList.add("file-loaded");

      let fileNameDisplay =
        input.parentElement.querySelector(".file-name-display");
      if (!fileNameDisplay) {
        fileNameDisplay = document.createElement("span");
        fileNameDisplay.className = "file-name-display";
        input.parentElement.appendChild(fileNameDisplay);
      }

      fileNameDisplay.textContent = file.name;
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  setupFileInputFeedback("video-url");
  setupFileInputFeedback("audio-url");
  console.log("✅ Détecteurs de fichiers activés !");
});
