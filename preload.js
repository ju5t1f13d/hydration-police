const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    testReminder: () => ipcRenderer.send("test-reminder"),
    closeReminder: () => ipcRenderer.send("close-reminder"),
    setReminders: (enabled) => ipcRenderer.send("set-reminders", enabled)
});