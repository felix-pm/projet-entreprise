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
  btnSubmit.addEventListener("click", (event) => {
    const numberPassation = document
      .querySelector("#number-passation")
      .value.trim();
    sessionStorage.setItem("numberPassation", numberPassation);

    const age = document.querySelector("#age").value.trim();
    const sexe = document.querySelector("#sexe-select").value.trim();

    const ageDate = new Date(age);

    const ageMonth = convertToMonth(ageDate);

    event.preventDefault();
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
