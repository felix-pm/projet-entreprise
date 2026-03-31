function jsonToExcel() {
  const titleJSON = sessionStorage.getItem("titreQuestionnaireActuel");
  const buttonToExcel = document.querySelector("#jsonToExcel");
  buttonToExcel.textContent = "Deviens un excel stp";
  buttonToExcel.addEventListener("click", () => {
    window.electronAPI.generateExcel(titleJSON);
  });
}

jsonToExcel();
