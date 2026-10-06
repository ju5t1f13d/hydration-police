const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;
let reminderWindow;
let reminderTimer = null;
let remindersEnabled = true;
const REMINDER_INTERVAL = 60 * 60 * 1000;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 450,
        resizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        }
    });

    mainWindow.loadFile("index.html");
}

function showReminder() {
    if (reminderWindow && !reminderWindow.isDestroyed()) {
        reminderWindow.focus();
        return;
    }

reminderWindow = new BrowserWindow({
    width: 430,
    height: 300,
    resizable: false,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    webPreferences: {
        preload: path.join(__dirname, "preload.js"),
    }
});

reminderWindow.loadFile("reminder.html");

reminderWindow.on("closed", () => {
    reminderWindow = null;
    startReminderTimer();
});
}

function startReminderTimer() {
    clearTimeout(reminderTimer);

    reminderTimer = setTimeout(() => {
        showReminder();
    }, REMINDER_INTERVAL);
}

ipcMain.on("test-reminder", () => {
    showReminder();
});

ipcMain.on("close-reminder", () => {
    if (reminderWindow && !reminderWindow.isDestroyed()) {
        reminderWindow.close();
    }
});

ipcMain.on("set-reminders", (event, enabled) => {
    remindersEnabled = enabled;

    if (enabled) {
        startReminderTimer();
    } else {
        clearTimeout(reminderTimer);
        reminderTimer = null;

        if (reminderWindow && !reminderWindow.isDestroyed()) {
            reminderWindow.close();
        }
    }
});

app.whenReady().then(() => {
    createWindow();
    startReminderTimer();
});