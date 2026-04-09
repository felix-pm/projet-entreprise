// Add to json
function jsonToExcel() {
  const titleJSON = sessionStorage.getItem("titreQuestionnaireActuel");
  const buttonToExcel = document.querySelector("#jsonToExcel");
  buttonToExcel.textContent = "Enregistrer en excel 📊";
  buttonToExcel.addEventListener("click", () => {
    // 1. Appel au Back-End
    window.electronAPI.generateExcel(titleJSON);

    // 2. Création de la notification principale
    const notification = document.createElement("div");
    notification.classList.add("download-notification");

    // 3. Ajout du contenu (Icône SVG + Titre + Texte)
    notification.innerHTML = `
    <div class="icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
    </div>
    <div class="content">
      <p class="title">Succès</p>
      <p class="text">Document excel enregistré dans Téléchargements</p>
    </div>
  `;

    // 4. On l'ajoute au body
    // Remplace `document.body.appendChild(notification);` par :

    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      document.body.appendChild(container);
    }

    // Ajoute la modale en haut du conteneur
    container.prepend(notification);

    // 5. Petite astuce JS : on attend la prochaine frame pour que le CSS enregistre l'état initial,
    // puis on ajoute la classe "show" pour déclencher l'animation de descente.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        notification.classList.add("show");
      });
    });

    // 6. Retirer la notification après 3,5 secondes
    setTimeout(() => {
      // On enlève "show" et on ajoute "hide" pour l'animation de sortie (glisse à droite)
      notification.classList.remove("show");
      notification.classList.add("hide");

      // 7. On supprime VRAIMENT l'élément du HTML après la fin de l'animation (500ms)
      // pour ne pas polluer le code source avec des div invisibles
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 3000);
  });
}

jsonToExcel();
