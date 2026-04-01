export async function saveRespons() {
  const answers = {};
  let sessionStorageClear = [];

  for (let i = 0; i < sessionStorage.length; i++) {
    if (sessionStorage.key(i).startsWith("yield2")) {
      answers[sessionStorage.key(i)] = sessionStorage.getItem(
        sessionStorage.key(i),
      );
      console.log(answers);
      sessionStorageClear.push(sessionStorage.key(i));
    }
  }

  await window.electronAPI.saveVideosQuestions(answers);

  sessionStorageClear.forEach((key) => {
    sessionStorage.removeItem(key);
  });
}

export function saveInSessionStorage(btn) {
  btn.addEventListener("click", () => {
    sessionStorage.setItem(`yield2-Question ${index + 1}`, btnVrai.textContent);

    // Plus tard, tu pourras enregistrer la réponse ici
    allTimer += handleAnswer();
    currentIndex++; // On passe à la suivante
    showQuestion(currentIndex); // On met à jour l'écran
  });
}
