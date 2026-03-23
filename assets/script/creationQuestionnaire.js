function questionVideo() {
  const containerQuestionVideo = document.querySelector(
    "#container-questions-video",
  );

  for (let i = 1; i <= 15; i++) {
    const divQuestionVideo = document.createElement("div");
    const labelQuestionVideo = document.createElement("label");
    const inputQuestionVideo = document.createElement("input");

    labelQuestionVideo.textContent = "Question " + i;
    inputQuestionVideo.className = "questions-video";
    inputQuestionVideo.dataset.id = i;

    divQuestionVideo.append(labelQuestionVideo, inputQuestionVideo);
    containerQuestionVideo.appendChild(divQuestionVideo);
  }
}

function questionAudio() {
  const containerQuestionAudio = document.querySelector(
    "#container-questions-audio",
  );

  for (let i = 1; i <= 15; i++) {
    const divQuestionAudio = document.createElement("div");
    const labelQuestionAudio = document.createElement("label");
    const inputQuestionAudio = document.createElement("input");

    labelQuestionAudio.textContent = "Question " + i;
    inputQuestionAudio.className = "questions-audio";
    inputQuestionAudio.dataset.id = i;

    divQuestionAudio.append(labelQuestionAudio, inputQuestionAudio);
    containerQuestionAudio.appendChild(divQuestionAudio);
  }
}

function questionMdls() {
  const containerQuestionMdls = document.querySelector(
    "#container-questions-mdls",
  );

  for (let i = 1; i <= 10; i++) {
    const divQuestionMdls = document.createElement("div");
    const labelQuestionMdls = document.createElement("label");
    const inputQuestionMdls = document.createElement("input");

    labelQuestionMdls.textContent = "Question " + i;
    inputQuestionMdls.className = "questions-mdls";
    inputQuestionMdls.dataset.id = i;

    divQuestionMdls.append(labelQuestionMdls, inputQuestionMdls);
    containerQuestionMdls.appendChild(divQuestionMdls);
  }
}

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
    };

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
    downloadJson(data);
  });
}

function downloadJson(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = data.title + "json";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  console.log("Fichier JSON généré !", data);
}

questionAudio();
questionVideo();
questionMdls();
saveJson();
