const btnSubmit = document.getElementById("btnSubmit");
btnSubmit.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = "allQuestionnaire.html";
});

const btnBack = document.getElementById("btnBack");
btnBack.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = "../index.html";
});
