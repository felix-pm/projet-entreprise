const buttonRecordScore = document.getElementById("recordScore");

const titleScore = document.getElementById("titleScore");
const scoreValue = document.getElementById("scoreValue");

buttonRecordScore.addEventListener("click", () => {
  window.electronAPI.savescoreJson(scoreValue);
  scoreValue.value = "";
  titleScore.value = "";
});
