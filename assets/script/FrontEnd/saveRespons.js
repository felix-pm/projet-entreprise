export function saveInSessionStorage(
  currentYield,
  currentIndex,
  questionType,
  answerText,
  precision = null,
) {
  if (questionType === "questionsMdls") {
    if (precision === null) {
      sessionStorage.setItem(`${questionType}${currentIndex + 1}`, answerText);
    } else {
      sessionStorage.setItem(
        `${questionType}${precision}${currentIndex + 1}`,
        answerText,
      );
    }
  } else {
    if (precision === null) {
      sessionStorage.setItem(
        `${currentYield}${questionType}${currentIndex + 1}`,
        answerText,
      );
    } else {
      sessionStorage.setItem(
        `${currentYield}${questionType}${precision}${currentIndex + 1}`,
        answerText,
      );
    }
  }
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
    } else if (key.startsWith("questionsMdls")) {
      answers.questionsMdls[key] = sessionStorage.getItem(key);
      keysToDelete.push(key);
    } else if (key.startsWith("trustIndex")) {
      answers.trustIndex[key] = sessionStorage.getItem(key);
      keysToDelete.push(key);
    }
  });

  if (currentYield === "Yield1") {
    await window.electronAPI.saveYield1Questions(answers, title);
  } else if (currentYield == "Yield2") {
    await window.electronAPI.saveYield2Questions(answers, title);
  } else if (questionType === "trustIndex") {
    await window.electronAPI.saveIndiceConfiance(answers, title);
  } else {
    await window.electronAPI.saveQuestionsSource(answers, title);
  }

  keysToDelete.forEach((key) => {
    sessionStorage.removeItem(key);
  });

  console.log("Sauvegarde effectuée et clés de réponses supprimées.");
}
