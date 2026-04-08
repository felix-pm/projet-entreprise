async function checkAndDisableLink() {
  const title = sessionStorage.getItem("titreQuestionnaireActuel");
  const allLink = document.querySelectorAll(".linkQuestion");
  const currentNumber = sessionStorage.getItem("numberPassation");
  const titleQuestionnaire = document.getElementById("titleQuestionnaire");

  try {
    const titleQ = await window.electronAPI.getElement(title, "title");
    titleQuestionnaire.textContent = titleQ;

    // Récupération des données patients
    const allPatients = await window.electronAPI.getAllPatients(title);
    const currentPatient = allPatients.find(
      (p) => String(p.numberPassation) === String(currentNumber),
    );

    allLink.forEach((link, index) => {
      const type = link.getAttribute("data-type");
      let alreadyDone = false;

      // Vérifie le Json
      if (currentPatient) {
        if (
          (type === "video" &&
            currentPatient.questionsVideo &&
            Object.keys(currentPatient.questionsVideo).length > 0) ||
          (type === "audio" &&
            currentPatient.questionsAudio &&
            Object.keys(currentPatient.questionsAudio).length > 0) ||
          (type === "mdls" &&
            currentPatient.questionsMdls &&
            Object.keys(currentPatient.questionsMdls).length > 0)
        ) {
          alreadyDone = true;
        }
      }

      // Vérifie le sessionStorage
      if (sessionStorage.getItem(`lien-${index}`) === "true") {
        alreadyDone = true;
      }

      // Affiche en gris si les question ont été effectuées
      if (alreadyDone) {
        disableLink(link);
      } else {
        link.addEventListener("click", () => {
          sessionStorage.setItem(`lien-${index}`, "true");
        });
      }
    });
  } catch (err) {
    console.error("Erreur : ", err);
  }
}

function disableLink(link) {
  link.removeAttribute("href");
  link.style.color = "gray";
  link.style.cursor = "default";
  link.style.pointerEvents = "none";
}

const textNumeroPassation = document.getElementById("numeroPassation");
const numeroPassation = sessionStorage.getItem("numberPassation");
textNumeroPassation.textContent = `Numéro de passation : ${numeroPassation}`;

checkAndDisableLink();
