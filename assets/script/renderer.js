function saveJson() {
  const buttonSaveJson = document.querySelector("#saveJson");

  buttonSaveJson.addEventListener("click", (event) => {
    event.preventDefault();

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
    };

    saveQuestionVideo.forEach((input) => {
      if (input.value.trim() !== "") {
        const id = input.dataset.id;
        const saveAnswer = document.querySelector(
          `input[name="answer-video${id}"]:checked`,
        );

        data.questionsVideo.push({
          id: input.dataset.id,
          question: input.value,
          answer: saveAnswer ? saveAnswer.value : null,
        });
      }
    });

    saveQuestionAudio.forEach((input) => {
      if (input.value.trim() !== "") {
        const id = input.dataset.id;
        const saveAnswer = document.querySelector(
          `input[name="answer-audio${id}"]:checked`,
        );

        data.questionsAudio.push({
          id: input.dataset.id,
          question: input.value,
          answer: saveAnswer ? saveAnswer.value : null,
        });
      }
    });

    saveQuestionMdls.forEach((input) => {
      if (input.value.trim() !== "") {
        const id = input.dataset.id;
        const saveAnswer = document.querySelector(
          `input[name="answer-mdls${id}"]:checked`,
        );

        data.questionsMdls.push({
          id: input.dataset.id,
          question: input.value,
          answer: saveAnswer ? saveAnswer.value : null,
        });
      }
    });

    downloadJson(data);

    window.location.href = "allQuestionnaire.html";
  });
}

function downloadJson(data) {
  window.electronAPI.sendData(data);
  alert("Le questionnaire a été enregistré dans tes Documents !");
}

saveJson();
