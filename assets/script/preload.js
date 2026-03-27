const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendData: (data) => ipcRenderer.send("form-test", data),
  sendData2: (childrenDatas) =>
    ipcRenderer.send("form-renseignements", childrenDatas),

  getQuestionnaires: () => ipcRenderer.invoke("get-questionnaires"),
  generateExcel: () => ipcRenderer.send("create-excel-file"),
});
