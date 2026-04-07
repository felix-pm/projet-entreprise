async function showAllNumberPassation() {
  const container = document.querySelector(".allNumberPassation");
  const title = sessionStorage.getItem("titreQuestionnaireActuel");

  console.log(title);

  const allNumberPassation = await window.electronAPI.getAllElementsFolder(
    title,
    "numberPassation",
  );
  const datePassation = await window.electronAPI.getAllElementsFolder(
    title,
    "date",
  );

  allNumberPassation.forEach((number, i) => {
    const numberPassationButton = document.createElement("button");
    numberPassationButton.textContent = `Numéro Passation : ${number} / Date : ${datePassation[i]}`;
    container.appendChild(numberPassationButton);

    numberPassationButton.addEventListener("click", () => {
      const numberPassationPatient = sessionStorage.setItem(
        number,
        "numeroPassationPatient",
      );
      window.location.href = "questionnaire.html";
    });
  });
}

showAllNumberPassation();
