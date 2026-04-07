export async function calculScore(questionName, yieldName) {
  const titleJSON = sessionStorage.getItem("titreQuestionnaireActuel");
  const questionsProtocole = await window.electronAPI.getElement(
    titleJSON,
    questionName,
  );

  let score = 0;

  // Parcours l'objet protocole et compare les réponses données avec les réponses du protocole,
  questionsProtocole.forEach((p, i) => {
    const key = `${yieldName}${i + 1}`;
    const answerGiven = sessionStorage.getItem(key);
    if (answerGiven !== p.answer && p.answer == "Faux") {
      score++;
    }
  });
  console.log(questionName + " : ", score);
  return score;
}

export async function calculShift(questionName) {
  let score = 0;

  for (let i = 1; i <= 15; i++) {
    const keyY1 = `Yield1-${questionName}${i}`;
    const keyY2 = `Yield2-${questionName}${i}`;

    const valY1 = sessionStorage.getItem(keyY1);
    const valY2 = sessionStorage.getItem(keyY2);

    if (valY1 !== valY2) {
      score++;
    }
  }

  console.log(questionName + " shift score : ", score);
  return score;
}
