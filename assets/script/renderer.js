function saveJson() {
  const buttonSaveJson = document.querySelector("#saveJson");
  buttonSaveJson.addEventListener("click", () => {
    const saveQuestionVideo = document.querySelectorAll(".questions-video");
    const saveQuestionAudio = document.querySelectorAll(".questions-audio");
    const saveQuestionMdls = document.querySelectorAll(".questions-mdls");

    const data = {
      title: document.querySelector("#title-test").value,
      video: document.querySelector("#video-url").value,
      audio: document.querySelector("#audio-url").value,
      questionsVideo: [],
      questionsAudio: [],
      questionsMdls: [],
      answer: [],
    };

    saveQuestionVideo.forEach((input) => {
      if (input.value.trim() !== "") {
        const id = input.dataset.id;
        const saveAnswer = document.querySelectorAll(`
          input[(name = "answer-video${id}")]:checked`);
        data.questionsVideo.push({
          id: input.dataset.id,
          question: input.value,
          answer: saveAnswer.value,
        });
      }
    });

    saveQuestionAudio.forEach((input) => {
      if (input.value.trim() !== "") {
        const id = input.dataset.id;
        const saveAnswer = document.querySelectorAll(`
          input[(name = "answer-audio${id}")]:checked`);
        data.questionsAudio.push({
          id: input.dataset.id,
          question: input.value,
          answer: saveAnswer.value,
        });
      }
    });

    saveQuestionMdls.forEach((input) => {
      if (input.value.trim() !== "") {
        const id = input.dataset.id;
        const saveAnswer = document.querySelectorAll(`
          input[(name = "answer-mdls${id}")]:checked`);
        data.questionsMdls.push({
          id: input.dataset.id,
          question: input.value,
          answer: saveAnswer.value,
        });
      }
    });
    downloadJson(data);
  });
}

function downloadJson(data) {
  // On utilise le talkie-walkie pour envoyer les données au cerveau (main.js)
  window.electronAPI.sendData(data);

  alert("Le questionnaire a été enregistré dans tes Documents !");
}

saveJson();
