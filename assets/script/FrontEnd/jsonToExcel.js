// Add to json
function jsonToExcel() {
  const titleJSON = sessionStorage.getItem("titreQuestionnaireActuel");
  const buttonToExcel = document.querySelector("#jsonToExcel");
  buttonToExcel.textContent = "Enregistrer en excel 📊";
  buttonToExcel.addEventListener("click", () => {
    window.electronAPI.generateExcel(titleJSON);
    const newdiv = document.createElement("div");
    const newp = document.createElement("p");
    const body = document.querySelector("body");
    body.append(newdiv);
    newdiv.append(newp);
    newp.textContent = "Document excel enregistré dans Téléchargements";
    newdiv.classList.add("download");

    setTimeout(() => {
      newdiv.style.display = "none";
    }, 3000);
  });
}

jsonToExcel();
