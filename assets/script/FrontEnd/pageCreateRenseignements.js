const btnSubmit = document.getElementById("btnSubmit");

const btnBack = document.getElementById("btnBack");
btnBack.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = "../index.html";
});

function convertToMonth(date) {
  const date1 = new Date();
  const year = date.getFullYear();
  const year1 = date1.getFullYear();
  const month = date.getMonth();
  const month1 = date1.getMonth();
  const day = date.getDate();
  const day1 = date1.getDate();

  const yearFinal = year1 - year;
  const monthFinal = month1 - month;

  let ageMonth = yearFinal * 12 + monthFinal;
  if (day > day1) {
    ageMonth -= 1;
  }

  return ageMonth;
}

function saveJsonChildren() {
  // On récupère le formulaire au lieu du bouton
  const formRenseignements = document.getElementById("form-renseignements");

  // On écoute l'événement 'submit' sur le formulaire
  formRenseignements.addEventListener("submit", (event) => {
    // On empêche le rechargement de la page
    event.preventDefault();

    const numberPassation = document
      .querySelector("#number-passation")
      .value.trim();
    sessionStorage.setItem("numberPassation", numberPassation);
    sessionStorage.setItem("sexe", sexe);
    sessionStorage.setItem("age", age);

    const ageDate = new Date(age);
    const ageMonth = convertToMonth(ageDate);

    const childrenDatas = {
      numberPassation: numberPassation,
      age: ageMonth,
      sexe: sexe,
    };

    downloadJson(childrenDatas);
    window.location.href = "allQuestionnaire.html";
  });
}

function downloadJson(childrenDatas) {
  window.electronAPI.sendData2(childrenDatas);
  alert("Le questionnaire a été enregistré dans tes Documents !");
}

saveJsonChildren();
