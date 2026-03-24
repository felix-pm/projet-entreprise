// preload.js
const { contextBridge, ipcRenderer } = require("electron");

// On crée notre fameux canal sécurisé "electronAPI"
contextBridge.exposeInMainWorld("electronAPI", {
  // On crée une fonction qui envoie les données au cerveau (Node.js)
  // On étiquette ce message "nouveau-formulaire"
  sendData: (data) => ipcRenderer.send("form-test", data),
});
