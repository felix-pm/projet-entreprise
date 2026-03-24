function questionVideo() {
  const containerQuestionVideo = document.querySelector(
    "#container-questions-video",
  );

  for (let i = 1; i <= 15; i++) {
    const divQuestionVideo = document.createElement("div");
    const labelQuestionVideo = document.createElement("label");
    const inputQuestionVideo = document.createElement("input");
    const checkboxVideo1 = document.createElement("input");
    const checkboxVideo2 = document.createElement("input");
    const pTrue = document.createElement("span");
    const pFalse = document.createElement("span");

    labelQuestionVideo.textContent = "Question " + i + " : ";
    inputQuestionVideo.className = "questions-video";
    inputQuestionVideo.dataset.id = i;

    checkboxVideo1.type = "radio";
    checkboxVideo1.name = "answer-video" + i;
    pTrue.textContent = "Vrai";
    checkboxVideo1.value = "Vrai";

    checkboxVideo2.type = "radio";
    checkboxVideo2.name = "answer-video" + i;
    pFalse.textContent = "Faux";
    checkboxVideo2.value = "Faux";

    divQuestionVideo.append(
      labelQuestionVideo,
      inputQuestionVideo,
      checkboxVideo1,
      pTrue,
      checkboxVideo2,
      pFalse,
    );
    containerQuestionVideo.append(divQuestionVideo);
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
    const checkboxAudio1 = document.createElement("input");
    const checkboxAudio2 = document.createElement("input");
    const pTrue = document.createElement("span");
    const pFalse = document.createElement("span");

    labelQuestionAudio.textContent = "Question " + i + " : ";
    inputQuestionAudio.className = "questions-audio";
    inputQuestionAudio.dataset.id = i;

    checkboxAudio1.type = "radio";
    checkboxAudio1.name = "answer-audio" + i;
    pTrue.textContent = "Vrai";
    checkboxAudio1.value = "Vrai";

    checkboxAudio2.type = "radio";
    checkboxAudio2.name = "answer-audio" + i;
    pFalse.textContent = "Faux";
    checkboxAudio2.value = "Faux";

    divQuestionAudio.append(
      labelQuestionAudio,
      inputQuestionAudio,
      checkboxAudio1,
      pTrue,
      checkboxAudio2,
      pFalse,
    );
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
    const checkboxMdls1 = document.createElement("input");
    const checkboxMdls2 = document.createElement("input");
    const pSeen = document.createElement("span");
    const pHeard = document.createElement("span");

    labelQuestionMdls.textContent = "Question " + i + " : ";
    inputQuestionMdls.className = "questions-mdls";
    inputQuestionMdls.dataset.id = i;

    checkboxMdls1.type = "radio";
    checkboxMdls1.name = "answer-mdls" + i;
    pSeen.textContent = "Vu";
    checkboxMdls1.value = "Vu";

    checkboxMdls2.type = "radio";
    checkboxMdls2.name = "answer-mdls" + i;
    pHeard.textContent = "Entendu";
    checkboxMdls2.value = "Entendu";

    divQuestionMdls.append(
      labelQuestionMdls,
      inputQuestionMdls,
      checkboxMdls1,
      pHeard,
      checkboxMdls2,
      pSeen,
    );
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
