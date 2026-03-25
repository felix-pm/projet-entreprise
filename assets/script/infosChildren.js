const btnSubmit = document.getElementById("btnSubmit");

function saveJsonChildren() {
  btnSubmit.addEventListener("click", (event) => {
    const numberPassation = document
      .querySelector("#numberPassation")
      .value.trim();
    const age = document.querySelector("#age").value.trim();
    const sexe = document.querySelector("#sexe-select").value.trim();
    event.preventDefault();
    const childrenDatas = {
      numberPassation: numberPassation,
      age: age,
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
