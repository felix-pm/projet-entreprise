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
