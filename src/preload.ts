const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  notificationApi: {
    sendNotification(message: any) {
      ipcRenderer.send("notify", message);
    },
  },
});
