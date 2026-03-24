// renderer.js
// On sélectionne le formulaire dans le HTML (assure-toi que ton form a bien cet ID)
const form = document.getElementById("form-test");

form.addEventListener("submit", (event) => {
  // 1. On bloque le rechargement de la page
  event.preventDefault();

  // 2. On aspire les données tapées par l'utilisateur
  const formData = new FormData(form);
  const objectJS = Object.fromEntries(formData);

  // 3. On utilise le talkie-walkie (créé dans le preload) pour envoyer les données
  window.electronAPI.sendData(objectJS);

  // 4. On vide le formulaire pour le prochain inscrit
  form.reset();

  // Petit message visuel pour rassurer l'utilisateur
  alert("Données enregistrées en toute discrétion !");
});
