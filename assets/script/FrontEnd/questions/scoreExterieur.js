const btnBack = document.getElementById("btnBack");

btnBack.addEventListener("click", (event) => {
  window.location.href = "questionnaire.html";
});

const yield2 = {};

const buttonRecordScore = document.getElementById("recordScore");

const titleScore = document.getElementById("titleScore");
const scoreValue = document.getElementById("scoreValue");

buttonRecordScore.addEventListener("click", () => {
  window.electronAPI.savescoreJson(scoreValue);
  scoreValue.value = "";
  titleScore.value = "";
});
