const btnSubmit = document.getElementById("btnSubmit");

function saveJsonChildren() {
  const numberPassation = document
    .querySelector("#numberPassation")
    .value.trim();
  const age = document.querySelector("#age").value.trim();
  const sexe = document.querySelector("#sexe-select").value.trim();

  btnSubmit.addEventListener("click", (event) => {
    event.preventDefault();
    const childrenDatas = {
      numberPassation: numberPassation,
      age: age,
      sexe: sexe,
    };
    window.location.href = "allQuestionnaire.html";
  });
}

saveJsonChildren();
