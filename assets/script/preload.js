const { contextBridge, ipcRenderer, webUtils } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendData: (data) => ipcRenderer.send("form-test", data),
  sendData2: (childrenDatas) =>
    ipcRenderer.send("form-renseignements", childrenDatas),

  getQuestionnaires: () => ipcRenderer.invoke("get-questionnaires"),
  getElement: (title, key) => ipcRenderer.invoke("get-element", title, key),

  // fonction sécurisée pour extraire le chemin absolu du fichier
  getFilePath: (file) => {
    if (webUtils && webUtils.getPathForFile) {
      return webUtils.getPathForFile(file);
    }
    return file.path;
  },
  createFolder: (titleJson) => ipcRenderer.send("create-folder", titleJson),
  generateExcel: (titleJson) =>
    ipcRenderer.send("create-excel-file", titleJson),
  savescoreJson: () => ipcRenderer.send("scoreExterieur"),
  saveYield1Questions: (answers) =>
    ipcRenderer.invoke("yield2Questions", answers),
  saveYield2Questions: (answers) =>
    ipcRenderer.invoke("yield1Questions", answers),
});
