function survey(
  containerQuestion,
  className,
  checkboxName,
  numberQuestions,
  choice1Text,
  choice2Text,
) {
  const containerQuestions = document.querySelector(containerQuestion);

  for (let i = 1; i <= numberQuestions; i++) {
    const divInput = document.createElement("div");
    const divQuestion = document.createElement("div");
    const labelQuestion = document.createElement("label");
    const inputQuestion = document.createElement("input");
    const checkbox1 = document.createElement("input");
    const checkbox2 = document.createElement("input");
    const choice1 = document.createElement("span");
    const choice2 = document.createElement("span");

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

    divInput.append(inputQuestion, checkbox1, choice1, checkbox2, choice2);

    divQuestion.append(labelQuestion, divInput);

    containerQuestions.appendChild(divQuestion);
  }
}

survey(
  "#container-questions-video",
  "questions-video",
  "answer-video",
  15,
  "Vrai",
  "Faux",
);

survey(
  "#container-questions-audio",
  "questions-audio",
  "answer-audio",
  15,
  "Vrai",
  "Faux",
);

survey(
  "#container-questions-mdls",
  "questions-mdls",
  "answer-mdls",
  10,
  "Vu",
  "Entendu",
);

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
