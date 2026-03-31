const btnBack = document.getElementById("btnBack");

btnBack.addEventListener("click", (event) => {
  window.location.href = "questionnaire.html";
});

const titleScore = document.getElementById("titleScore");
const scoreValue = document.getElementById("scoreValue");

const numberPassation = sessionStorage.getItem("numberPassation");

const scoreExterieur = { [numberPassation]: {} };

const buttonRecordScore = document.getElementById("recordScore");

buttonRecordScore.addEventListener("click", () => {
  window.electronAPI.savescoreJson(scoreExterieur);
  scoreExterieur[`${numberPassation}`][`${titleScore.value}`] =
    scoreValue.value;
  // scoreExterieur[numberPassation].push(titleScore.value, scoreValue.value);
  console.log(scoreExterieur);
  scoreValue.value = "";
  titleScore.value = "";
});
