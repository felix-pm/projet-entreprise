// Add to json
function jsonToExcel() {
  const titleJSON = sessionStorage.getItem("titreQuestionnaireActuel");
  const buttonToExcel = document.querySelector("#jsonToExcel");
  buttonToExcel.textContent = "Enregistrer en excel 📊";
  buttonToExcel.addEventListener("click", () => {
    window.electronAPI.generateExcel(titleJSON);
  });
}

jsonToExcel();
