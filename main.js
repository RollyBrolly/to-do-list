const { app, BrowserWindow } = require('electron');
const path = require("path");

// Ensure a proper App User Model ID for Windows (used for taskbar grouping and notifications)
app.setAppUserModelId('com.todolist.app');

function createWindow(){
    const iconPath = process.platform === 'win32'
        ? path.join(__dirname, "pixel-heart-pixelart-png256.ico")
        : path.join(__dirname, "pixel-heart-pixelart-png.png");

    const win = new BrowserWindow({
        width: 600,
        height: 600,
        maximizable: false,
        resizable: false,
        frame: true,
        icon: iconPath,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.loadFile("index.html");

    win.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", ()=>{
    if(process.platform !== "darwin") app.quit();
});