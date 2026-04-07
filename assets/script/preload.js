const { contextBridge, ipcRenderer, webUtils } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendData: (data) => ipcRenderer.send("form-test", data),
  sendData2: (childrenDatas) =>
    ipcRenderer.send("form-renseignements", childrenDatas),

  getQuestionnaires: () => ipcRenderer.invoke("get-questionnaires"),
  getElement: (title, key) => ipcRenderer.invoke("get-element", title, key),
  getAllElementsFolder: (title, key) =>
    ipcRenderer.invoke("get-allElements-folder", title, key),

  // fonction sécurisée pour extraire le chemin absolu du fichier
  getFilePath: (file) => {
    if (webUtils && webUtils.getPathForFile) {
      return webUtils.getPathForFile(file);
    }
    return file.path;
  },
  getAllPatients: (title) => ipcRenderer.invoke("get-all-patients", title),
  createFolder: (titleJson) => ipcRenderer.send("create-folder", titleJson),
  generateExcel: (titleJson) =>
    ipcRenderer.send("create-excel-file", titleJson),
  savescoreJson: () => ipcRenderer.send("scoreExterieur"),
  saveYield1Questions: (answers, title) =>
    ipcRenderer.invoke("yield1Questions", answers, title),
  saveYield2Questions: (answers, title) =>
    ipcRenderer.invoke("yield2Questions", answers, title),
  saveQuestionsSource: (answers, title) =>
    ipcRenderer.invoke("QuestionSource", answers, title),
  saveIndiceConfiance: (answers, title) =>
    ipcRenderer.invoke("trustIndex", answers, title),
  saveChrono: (answers, title) => ipcRenderer.invoke("chrono", answers, title),
});
