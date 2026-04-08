const btnSubmit = document.getElementById("btnSubmit");

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

    const age = document.querySelector("#age").value.trim();
    const sexe = document.querySelector("#sexe-select").value.trim();
    const numberPassation = document
      .querySelector("#number-passation")
      .value.trim();
    const todayDate = document.querySelector("#todayDate").value.trim();

    const ageDate = new Date(age);
    const ageMonth = convertToMonth(ageDate);

    sessionStorage.setItem("numberPassation", numberPassation);
    sessionStorage.setItem("sexe", sexe);
    sessionStorage.setItem("age", ageMonth);
    sessionStorage.setItem("date", todayDate);

    event.preventDefault();
    const childrenDatas = {
      numberPassation: numberPassation,
      age: ageMonth,
      sexe: sexe,
      date: todayDate,
    };
    downloadJson(childrenDatas);
    window.location.href = "allQuestionnaire.html?type=question";
  });
}

function downloadJson(childrenDatas) {
  window.electronAPI.sendData2(childrenDatas);
}

saveJsonChildren();
