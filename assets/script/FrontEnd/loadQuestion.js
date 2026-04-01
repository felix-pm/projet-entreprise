// FrontEnd/loadQuestion.js

// Cette fonction devient une simple "boîte à outils" qui renvoie les données
export async function loadQuestion(title, type) {
  try {
    const questions = await window.electronAPI.getElement(title, type);
    return questions; // On retourne simplement le tableau de questions
  } catch (err) {
    console.error(`Impossible de charger les ${type} :`, err);
    return null; // En cas d'erreur
  }
}
