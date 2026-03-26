// preload.js
import { contextBridge, ipcRenderer } from "electron";

// On crée notre fameux canal sécurisé "electronAPI"
contextBridge.exposeInMainWorld("electronAPI", {
  // On crée une fonction qui envoie les données au cerveau (Node.js)
  // On étiquette ce message "nouveau-formulaire"
  sendData: (data) => ipcRenderer.send("form-test", data),
  sendData2: (childrenDatas) =>
    ipcRenderer.send("form-renseignements", childrenDatas),
  getAllTitles: () => ipcRenderer.send("get-all-titles"),
  getQuestionnaire: (title) => ipcRenderer.send("get-questionnaire"),
});
