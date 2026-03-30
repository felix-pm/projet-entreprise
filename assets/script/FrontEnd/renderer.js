function saveQuestion(saveQuestionName, inputName, dataQuestionPush) {
  saveQuestionName.forEach((input) => {
    if (input.value.trim() !== "") {
      const id = input.dataset.id;
      const saveAnswer = document.querySelector(
        `input[name="${inputName}${id}"]:checked`,
      );

      dataQuestionPush.push({
        id: id,
        question: input.value,
        answer: saveAnswer ? saveAnswer.value : null,
      });
    }
  });
}

function getScoreTitle(getExternalTitleScore, scoreTitleTable) {
  getExternalTitleScore.forEach((input) => {
    if (input.value.trim() !== "") {
      const id = input.dataset.id;

      scoreTitleTable.push({
        id: id,
        scoreTitle: input.value,
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
    const getExternalTitleScore = document.querySelectorAll(
      ".input-scores-externes",
    );

    const titleValidator = document.querySelector("#title-test").value.trim();
    const videoInput = document.querySelector("#video-url");
    const audioInput = document.querySelector("#audio-url");

    // Utilisation de la nouvelle fonction sécurisée d'Electron via le preload
    let videoValidator = "";
    if (videoInput.files.length > 0) {
      videoValidator =
        window.electronAPI.getFilePath(videoInput.files[0]) || "";
    }

    let audioValidator = "";
    if (audioInput && audioInput.files.length > 0) {
      audioValidator =
        window.electronAPI.getFilePath(audioInput.files[0]) || "";
    }

    const data = {
      title: titleValidator,
      video: videoValidator,
      audio: audioValidator,
      questionsVideo: [],
      questionsAudio: [],
      questionsMdls: [],
      externalScoreTitle: [],
    };

    saveQuestion(saveQuestionAudio, "answer-audio", data.questionsAudio);
    saveQuestion(saveQuestionVideo, "answer-video", data.questionsVideo);
    saveQuestion(saveQuestionMdls, "answer-mdls", data.questionsMdls);
    getScoreTitle(getExternalTitleScore, data.externalScoreTitle);

    const isTitleOk = titleValidator !== "";
    const isVideoLinkOk = videoValidator !== "";
    const isAudioLinkOk = audioValidator !== "";

    const isAudioAnswerOk = isValid(data.questionsAudio, 15);
    const isVideoAnswerOk = isValid(data.questionsVideo, 15);
    const isMdlsAnswerOk = isValid(data.questionsMdls, 10);

    if (
      isAudioAnswerOk &&
      isVideoAnswerOk &&
      isMdlsAnswerOk &&
      isTitleOk &&
      isVideoLinkOk &&
      isAudioLinkOk
    ) {
      downloadJson(data);
      window.location.href = "../index.html";
    } else {
      let errorMessage = "Erreur de validation :\n";
      if (!isTitleOk) {
        errorMessage += "Veuillez rentrer un titre\n";
      }
      if (!isVideoLinkOk) {
        errorMessage += "Veuillez rentrer un lien vidéo\n";
      }
      if (!isAudioLinkOk) {
        errorMessage += "Veuillez rentrer un lien audio\n";
      }
      if (!isAudioAnswerOk) {
        errorMessage +=
          "Veuillez compléter tous les champs dans la section audio\n";
      }
      if (!isVideoAnswerOk) {
        errorMessage +=
          "Veuillez compléter tous les champs dans la section vidéo\n";
      }
      if (!isMdlsAnswerOk) {
        errorMessage +=
          "Veuillez compléter tous les champs dans la section mémoire de la source\n";
      }
      const alertBox = document.querySelector("#custom-alert");
      const alertText = document.querySelector("#alert-text");

      alertText.textContent = errorMessage;
      alertBox.style.display = "block";

      const firstEmpty = document.querySelector("#title-test");
      if (firstEmpty) firstEmpty.focus();
    }
  });
}

function getTitle(data) {
  return data.title;
}

function isValid(array, expectedCount) {
  const rightCount = array.length === expectedCount;
  let allAnswered = true;

  for (let i = 0; i < array.length; i++) {
    if (array[i].answer === null) {
      allAnswered = false;
      break;
    }
  }
  if (rightCount && allAnswered) {
    return true;
  } else return false;
}

function downloadJson(data) {
  window.electronAPI.sendData(data);
  alert("Le questionnaire a été enregistré dans tes Documents !");
}

saveJson();
