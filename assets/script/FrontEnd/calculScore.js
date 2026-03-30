async function calculScore(questionName) {
  const titleJSON = sessionStorage.getItem("titreQuestionnaireActuel");
  const questionsProtocole = await window.electronAPI.getElement(
    titleJSON,
    questionName,
  );
  const questionsAnswer = await window.electronAPI.getElement(
    "Test2Reponse",
    questionName,
  );

  let score = 0;
  const givenAnswer = {};

  questionsProtocole.forEach((p) => {
    givenAnswer[p.id] = p.answer;
  });

  // Parcours l'objet protocole et compare les réponses données avec les réponses du protocole
  questionsAnswer.forEach((p) => {
    const goodAnswer = p.answer;
    const answerGiven = givenAnswer[p.id];

    if (answerGiven == goodAnswer && goodAnswer == "Faux") {
      score++;
    }
  });

  console.log(questionName + " : ", score);
  return score;
}

async function calculShift(questionName) {
  const answerJSONYield1 = await window.electronAPI.getElement(
    "Test2Reponse",
    questionName,
  );
  const answerJSONYield2 = await window.electronAPI.getElement(
    "Test2Yield2",
    questionName,
  );

  let score = 0;
  const givenAnswer = {};

  answerJSONYield1.forEach((p) => {
    givenAnswer[p.id] = p.answer;
  });

  // Parcours l'objet protocole et compare les réponses données avec les réponses du protocole
  answerJSONYield2.forEach((p) => {
    const answerYield2 = p.answer;

    if (givenAnswer[p.id] !== answerYield2) {
      score++;
    }
  });

  console.log(questionName + " shift score : ", score);
  return score;
}

calculScore("questionsAudio");
calculScore("questionsVideo");
calculShift("questionsAudio");
calculShift("questionsVideo");
