const title = sessionStorage.getItem("titreQuestionnaireActuel");
const div = document.getElementById("externalScore");

async function createAffichageScoreExterieur() {
  const externalScoreTitles = await window.electronAPI.getElement(
    title,
    "externalScoreTitle",
  );

  externalScoreTitles.forEach((item) => {
    const divInterieur = document.createElement("div");

    const textQuestion = document.createElement("label");
    textQuestion.textContent = item.scoreTitle;

    const input = document.createElement("input");
    input.type = "text";
    input.dataset.scoreName = item.scoreTitle;
    input.className = "input-score-exterieur";

    divInterieur.append(textQuestion, input);
    div.append(divInterieur);
  });
}

// const buttonRecordScore = document.getElementById("recordScore");

// buttonRecordScore.addEventListener("click", () => {
//   window.electronAPI.savescoreJson(scoreExterieur);
// });

createAffichageScoreExterieur();
