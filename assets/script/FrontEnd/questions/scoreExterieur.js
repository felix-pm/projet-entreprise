const title = sessionStorage.getItem("titreQuestionnaireActuel");
const div = document.getElementById("externalScore");

// Gestion du bouton retour
const btnBack = document.getElementById("btnBack");
if (btnBack) {
  btnBack.addEventListener("click", () => {
    // Tu peux changer le lien selon l'endroit où tu veux retourner
    window.location.href = "../index.html";
  });
}

async function createAffichageScoreExterieur() {
  const externalScoreTitles = await window.electronAPI.getElement(
    title,
    "externalScoreTitle",
  );

  if (!externalScoreTitles || externalScoreTitles.length === 0) {
    div.innerHTML =
      "<p>Aucun score extérieur n'a été défini pour ce protocole.</p>";
    return;
  }

  externalScoreTitles.forEach((item) => {
    const divInterieur = document.createElement("div");
    divInterieur.style.marginBottom = "10px";

    const textQuestion = document.createElement("label");
    textQuestion.textContent = item.scoreTitle + " : ";

    const input = document.createElement("input");
    input.type = "text";
    input.dataset.scoreId = item.id; // On stocke l'ID (1, 2, 3...)
    input.className = "input-score-exterieur";

    divInterieur.append(textQuestion, input);
    div.append(divInterieur);
  });
}

function showToast(titre, texte) {
  // 1. Cherche ou crée le conteneur global
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  // 2. Crée la notification
  const notification = document.createElement("div");
  notification.classList.add("download-notification");
  notification.innerHTML = `
    <div class="icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
    </div>
    <div class="content">
      <p class="title">${titre}</p>
      <p class="text">${texte}</p>
    </div>
  `;

  // 3. PREPEND : Ajoute au-dessus des autres (pousse les anciennes vers le bas)
  container.prepend(notification);

  // 4. Animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => notification.classList.add("show"));
  });

  // 5. Suppression
  setTimeout(() => {
    notification.classList.remove("show");
    notification.classList.add("hide");
    setTimeout(() => notification.remove(), 400); // 400ms = durée de la transition CSS
  }, 3500);
}

const formElement = document.querySelector("#allScoresExterieurs form");
formElement.addEventListener("submit", async (event) => {
  event.preventDefault();
  const numberPassationInput = document.getElementById("inputNumberPassation");
  const numberPassationValue = numberPassationInput.value.trim();

  const scoreData = {
    numberPassation: [numberPassationValue],
    externalScores: {},
  };

  const allInputs = document.querySelectorAll(".input-score-exterieur");
  const externalScoreTitles = await window.electronAPI.getElement(
    title,
    "externalScoreTitle",
  );
  let externalTable = [];

  externalScoreTitles.forEach((index) => {
    externalTable.push(index);
  });

  externalTable.forEach((value, index) => {
    let cleScore = `SE-${value.scoreTitle}`;

    // 3. On récupère les scores tapés
    const currentInput = allInputs[index];
    if (currentInput) {
      const valeurTapee = currentInput.value.trim();
      if (valeurTapee !== "") {
        scoreData.externalScores[cleScore] = valeurTapee;
      }

      console.log(cleScore);
    }
  });

  try {
    await window.electronAPI.saveYield1Questions(scoreData, title);

    // L'APPEL DE LA NOTIFICATION AVEC LE NUMÉRO DE PASSATION !
    showToast(
      "Sauvegarde réussie",
      `Les scores du patient N°${numberPassationValue} sont enregistrés.`,
    );

    // On vide les champs
    numberPassationInput.value = "";
    allInputs.forEach((input) => (input.value = ""));
  } catch (err) {
    console.error("Erreur lors de la sauvegarde :", err);
    showToast("Erreur", "Une erreur est survenue lors de la sauvegarde !");
  }
});

// On lance l'affichage au chargement de la page
createAffichageScoreExterieur();
