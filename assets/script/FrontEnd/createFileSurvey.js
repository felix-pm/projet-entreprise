export function createFileSurvey() {
  const titleInput = document.querySelector("#title-test");
  if (titleInput) {
    const titleValue = titleInput.value.trim();
    window.electronAPI.createFolder(titleValue);
  }
}
