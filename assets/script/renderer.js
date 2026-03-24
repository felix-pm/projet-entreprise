function saveQuestion(saveQuestionName, inputName, dataQuestionPush) {
  saveQuestionName.forEach((input) => {
    if (input.value.trim() !== "") {
      const id = input.dataset.id;
      const saveAnswer = document.querySelector(
        `input[name="${inputName}${id}"]:checked`,
      );

      dataQuestionPush.push({
        id: input.dataset.id,
        question: input.value,
        answer: saveAnswer ? saveAnswer.value : null,
      });
    }
  });
}

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

    saveQuestion(saveQuestionAudio, "answer-audio", data.questionsAudio);
    saveQuestion(saveQuestionVideo, "answer-video", data.questionsVideo);
    saveQuestion(saveQuestionMdls, "answer-mdls", data.questionsMdls);

    downloadJson(data);

    window.location.href = "allQuestionnaire.html";
  });
}

function downloadJson(data) {
  window.electronAPI.sendData(data);
  alert("Le questionnaire a été enregistré dans tes Documents !");
}

saveJson();
