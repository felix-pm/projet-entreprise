const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendData: (data) => ipcRenderer.send("form-test", data),
  sendData2: (childrenDatas) =>
    ipcRenderer.send("form-renseignements", childrenDatas),

  getQuestionnaires: () => ipcRenderer.invoke("get-questionnaires"),
  getElement: (title, key) => ipcRenderer.invoke("get-element", title, key),
  generateExcel: () => ipcRenderer.send("create-excel-file"),
  calculScore: () => ipcRenderer.send("calcul-score"),
  calculShift: () => ipcRenderer.send("calcul-shift"),
});
