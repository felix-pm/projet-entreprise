const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendData: (data) => ipcRenderer.send("form-test", data),
  sendData2: (childrenDatas) =>
    ipcRenderer.send("form-renseignements", childrenDatas),

  getQuestionnaires: () => ipcRenderer.invoke("get-questionnaires"),
  getElement: (title, key) => ipcRenderer.invoke("get-element", title, key),
  generateExcel: (titleJson) =>
    ipcRenderer.send("create-excel-file", titleJson),
});
