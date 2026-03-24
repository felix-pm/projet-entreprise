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

    checkbox1.type = "radio";
    checkbox1.name = checkboxName + i;
    checkbox1.className = "checkboxSurvey";
    choice1.textContent = choice1Text;
    checkbox1.value = choice1Text;

    checkbox2.type = "radio";
    checkbox2.name = checkboxName + i;
    checkbox2.className = "checkboxSurvey";
    choice2.textContent = choice2Text;
    checkbox2.value = choice2Text;

    divQuestion.append(
      labelQuestion,
      inputQuestion,
      checkbox1,
      choice1,
      checkbox2,
      choice2,
    );
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
