const btnBack = document.getElementById("btnBack");

btnBack.addEventListener("click", (event) => {
  window.location.href = "questionnaire.html";
});

const yield2 = {};

const buttonRecordScore = document.getElementById("recordScore");

buttonRecordScore.addEventListener("click", (event) => {
  pushscore();
});

function pushscore() {
  const titleScore = document.getElementById("titleScore");
  const scoreValue = document.getElementById("scoreValue");

  yield2[titleScore.value] = scoreValue.valueAsNumber;

  console.log(yield2);

  titleScore.value = "";
  scoreValue.value = "";
}
