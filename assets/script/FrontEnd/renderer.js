import { createFileSurvey } from "./createFileSurvey.js";

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
  // On ajoute "index" pour générer un ID (1, 2, 3...) car tes inputs n'ont pas de dataset.id
  getExternalTitleScore.forEach((input, index) => {
    if (input.value.trim() !== "") {
      scoreTitleTable.push({
        id: index + 1,
        scoreTitle: input.value,
      });
    }
  });
}

function saveJson() {
  // On cible le FORMULAIRE au lieu du bouton
  const formTest = document.querySelector("#form-test");

  // On écoute le 'submit' sur le formulaire
  formTest.addEventListener("submit", (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    const saveQuestionVideo = document.querySelectorAll(".questions-video");
    const saveQuestionAudio = document.querySelectorAll(".questions-audio");
    const saveQuestionMdls = document.querySelectorAll(".questions-mdls");

    // CORRECTION ICI : On cible les inputs texte à l'intérieur de tes labels class="input-scores-externes"
    // Remplace ton ancien sélecteur par celui-ci :
    const getExternalTitleScore = document.querySelectorAll(
      ".input-scores-externes",
    );

    const title = document.querySelector("#title-test").value.trim();
    const videoInput = document.querySelector("#video-url");
    const audioInput = document.querySelector("#audio-url");

    // --- 1. VÉRIFICATION MANUELLE DES FICHIERS ---

    // On vérifie s'il y a au moins un fichier sélectionné pour la vidéo
    if (!videoInput.files || videoInput.files.length === 0) {
      alert("⚠️ Veuillez importer un fichier vidéo.");
      return; // Le "return" arrête immédiatement l'exécution de la fonction ici
    }

    // On vérifie s'il y a au moins un fichier sélectionné pour l'audio
    if (!audioInput.files || audioInput.files.length === 0) {
      alert("⚠️ Veuillez importer un fichier audio.");
      return; // Le "return" arrête l'exécution ici
    }

    // --- 2. SUITE DU CODE (s'exécute uniquement si les fichiers sont présents) ---

    createFileSurvey();

    // L'appel à Electron est maintenant 100% sûr car on est certain qu'il y a des fichiers
    let videoValidator =
      window.electronAPI.getFilePath(videoInput.files[0]) || "";
    let audioValidator =
      window.electronAPI.getFilePath(audioInput.files[0]) || "";

    const data = {
      title: title,
      video: videoValidator,
      audio: audioValidator,
      questionsVideo: [],
      questionsAudio: [],
      questionsMdls: [],
      externalScoreTitle: [], // Tes titres vont bien s'enregistrer ici !
    };

    saveQuestion(saveQuestionAudio, "answer-audio", data.questionsAudio);
    saveQuestion(saveQuestionVideo, "answer-video", data.questionsVideo);
    saveQuestion(saveQuestionMdls, "answer-mdls", data.questionsMdls);

    // Appel de la fonction pour remplir "externalScoreTitle"
    getScoreTitle(getExternalTitleScore, data.externalScoreTitle);

    window.electronAPI.sendData(data);

    window.location.href = "../index.html";

    const firstEmpty = document.querySelector("#title-test");
    if (firstEmpty) firstEmpty.focus();
    if (
      isAudioAnswerOk &&
      isVideoAnswerOk &&
      isMdlsAnswerOk &&
      isTitleOk &&
      isVideoLinkOk &&
      isAudioLinkOk
    ) {
      downloadJson(data); // Utilise bien ta fonction preload existante
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 500);
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

saveJson();
