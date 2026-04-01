export function saveInSessionStorage(
  currentYield,
  currentIndex,
  questionType,
  answerText,
) {
  sessionStorage.setItem(
    `${currentYield}-${questionType}${currentIndex + 1}`,
    answerText,
  );
}

export async function clearSessionStorage(answers, questionType) {
  let keysToDelete = [];

  const toutesLesCles = Object.keys(sessionStorage);

  toutesLesCles.forEach((key) => {
    if (key.toLowerCase().startsWith("yield")) {
      answers[questionType][key] = sessionStorage.getItem(key);
      keysToDelete.push(key);
    }
  });

  console.log("Objet final prêt à être envoyé à Electron :", answers);
  await window.electronAPI.saveVideosQuestions(answers);

  keysToDelete.forEach((key) => {
    sessionStorage.removeItem(key);
  });

  console.log("Sauvegarde effectuée et clés de réponses supprimées.");
}
