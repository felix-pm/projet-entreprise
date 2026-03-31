export function createFileSurvey() {
  const titleInput = document.querySelector("#title-test");
  if (titleInput) {
    const titleValue = titleInput.value.trim();
    if (titleValue !== "") {
      window.electronAPI.createFolder(titleValue);
      return true;
    }
  }
  console.log("Veuillez entrer un nom de fichier");
  return false;
}
