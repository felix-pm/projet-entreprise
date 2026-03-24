function saveJson() {
  const buttonSaveJson = document.querySelector("#saveJson"); // Assure-toi que ton bouton HTML a bien cet id="saveJson"

  // On passe "event" ici pour pouvoir bloquer le rechargement
  buttonSaveJson.addEventListener("submit", (event) => {
    // 1. TRÈS IMPORTANT : On bloque le rechargement de la page si ton bouton est dans un <form>
    event.preventDefault();

    const saveQuestionVideo = document.querySelectorAll(".questions-video");
    const saveQuestionAudio = document.querySelectorAll(".questions-audio");
    const saveQuestionMdls = document.querySelectorAll(".questions-mdls");

    // 2. On construit ton bel objet structuré
    const data = {
      title: document.querySelector("#title-test").value,
      video: document.querySelector("#video-url")
        ? document.querySelector("#video-url").value
        : "",
      audio: document.querySelector("#audio-url")
        ? document.querySelector("#audio-url").value
        : "",
      questionsVideo: [],
      questionsAudio: [],
      questionsMdls: [],
    };

    // 3. On remplit les tableaux
    saveQuestionVideo.forEach((input) => {
      if (input.value.trim() !== "") {
        data.questionsVideo.push({
          id: input.dataset.id,
          question: input.value,
        });
      }
    });

    saveQuestionAudio.forEach((input) => {
      if (input.value.trim() !== "") {
        data.questionsAudio.push({
          id: input.dataset.id,
          question: input.value,
        });
      }
    });

    saveQuestionMdls.forEach((input) => {
      if (input.value.trim() !== "") {
        data.questionsMdls.push({
          id: input.dataset.id,
          question: input.value,
        });
      }
    });

    // 4. On envoie tout ça au talkie-walkie
    downloadJson(data);
  });
}

function downloadJson(data) {
  // On utilise le talkie-walkie pour envoyer les données au cerveau (main.js)
  window.electronAPI.sendData(data);

  alert("Le questionnaire a été enregistré dans tes Documents !");
}

questionAudio();
questionVideo();
questionMdls();
saveJson();
