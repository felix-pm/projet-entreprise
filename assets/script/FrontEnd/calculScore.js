export async function calculScore(questionName, yieldName) {
  const titleJSON = sessionStorage.getItem("titreQuestionnaireActuel");
  const questionsProtocole = await window.electronAPI.getElement(
    titleJSON,
    questionName,
  );
  const questionsAnswer = await window.electronAPI.getElement(
    titleJSON + "/yield1",
    questionName,
  );

  let score = 0;

  // Parcours l'objet protocole et compare les réponses données avec les réponses du protocole
  questionsProtocole.forEach((p, i) => {
    const key = `${yieldName + i + 1}`;
    const answerGiven = questionsAnswer[key];
    if (answerGiven == p.answer && p.answer == "Faux") {
      score++;
    }
  });
  console.log(questionName + " : ", score);
  return score;
}

export async function calculShift(questionName) {
  const titleJSON = sessionStorage.getItem("titreQuestionnaireActuel");
  const answerJSON = await window.electronAPI.getElement(
    titleJSON + "/yield1",
    questionName,
  );

  let score = 0;

  for (let i = 1; i <= 15; i++) {
    const keyY1 = `Yield1-${questionName}${i}`;
    const keyY2 = `Yield2-${questionName}${i}`;

    if (answerJSON[keyY1] == answerJSON[keyY2]) {
      score++;
    }
  }

  console.log(questionName + " shift score : ", score);
  return score;
}
