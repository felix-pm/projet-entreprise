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

  toutesLesCles.forEach((key) => {
    if (key.startsWith(`${currentYield}-QuestionVideo`)) {
      answers.questionsVideo[key] = sessionStorage.getItem(key);
      keysToDelete.push(key);
    } else if (key.startsWith(`${currentYield}-QuestionAudio`)) {
      answers.questionsAudio[key] = sessionStorage.getItem(key);
      keysToDelete.push(key);
    }
  });

  if (currentYield === "Yield1") {
    await window.electronAPI.saveYield1Questions(answers);
  } else {
    await window.electronAPI.saveYield2Questions(answers);
  }

  keysToDelete.forEach((key) => {
    sessionStorage.removeItem(key);
  });

  console.log("Sauvegarde effectuée et clés de réponses supprimées.");
}
