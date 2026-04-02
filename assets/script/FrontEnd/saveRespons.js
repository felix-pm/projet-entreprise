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

const currentYield = sessionStorage.getItem("currentYield");

export async function clearSessionStorage(answers, questionType) {
  let keysToDelete = [];

  const toutesLesCles = Object.keys(sessionStorage);
  const title = sessionStorage.getItem("titreQuestionnaireActuel");

  toutesLesCles.forEach((key) => {
    if (key.startsWith(`${currentYield}-questionsVideo`)) {
      answers.questionsVideo[key] = sessionStorage.getItem(key);
      keysToDelete.push(key);
    } else if (key.startsWith(`${currentYield}-questionsAudio`)) {
      answers.questionsAudio[key] = sessionStorage.getItem(key);
      keysToDelete.push(key);
    }
  });

  if (currentYield === "Yield1") {
    await window.electronAPI.saveYield1Questions(answers, title);
  } else {
    await window.electronAPI.saveYield2Questions(answers, title);
  }

  keysToDelete.forEach((key) => {
    sessionStorage.removeItem(key);
  });

  console.log("Sauvegarde effectuée et clés de réponses supprimées.");
}
