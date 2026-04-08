const title = sessionStorage.getItem("titreQuestionnaireActuel");
const div = document.getElementById("externalScore");

// Gestion du bouton retour
const btnBack = document.getElementById("btnBack");
if (btnBack) {
  btnBack.addEventListener("click", () => {
    // Tu peux changer le lien selon l'endroit où tu veux retourner
    window.location.href = "index.html?type=exterieur";
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

const buttonRecordScore = document.getElementById("recordScore");

buttonRecordScore.addEventListener("click", async () => {
  // 1. NOUVEAUTÉ : On récupère la valeur directement depuis l'input HTML !
  const numberPassationInput = document.getElementById("inputNumberPassation");
  const numberPassationValue = numberPassationInput.value.trim();

  // On vérifie que tu as bien tapé un numéro
  if (!numberPassationValue) {
    alert("Erreur : Veuillez renseigner le numéro de passation du patient.");
    return;
  }

  // 2. On prépare l'objet avec le numéro tapé à la main
  const scoreData = {
    numberPassation: [numberPassationValue],
    externalScores: {},
  };

  const allInputs = document.querySelectorAll(".input-score-exterieur");

  // 3. On récupère les scores tapés
  allInputs.forEach((input) => {
    const idDuScore = input.dataset.scoreId;
    const cleScore = `scoreExterieur-${idDuScore}`; // Donne "scoreExterieur-1"
    const valeurTapee = input.value.trim();

    if (valeurTapee !== "") {
      scoreData.externalScores[cleScore] = valeurTapee;
    }
  });

  // 4. On envoie au Back-End
  try {
    // Le Back-End va chercher le patient qui a ce numéro et lui ajouter les externalScores
    await window.electronAPI.saveYield1Questions(scoreData, title);

    alert(
      `Scores extérieurs enregistrés avec succès pour le patient N°${numberPassationValue} !`,
    );

    // (Optionnel) On vide les champs pour pouvoir enchaîner avec un autre patient
    numberPassationInput.value = "";
    allInputs.forEach((input) => (input.value = ""));
  } catch (err) {
    console.error("Erreur lors de la sauvegarde :", err);
    alert("Une erreur est survenue lors de l'enregistrement.");
  }
});

// On lance l'affichage au chargement de la page
createAffichageScoreExterieur();
