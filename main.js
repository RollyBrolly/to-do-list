const { app, BrowserWindow } = require('electron');
const path = require("path");

function createWindow(){
    const win = new BrowserWindow({
        width: 600,
        height: 600,
        maximizable: false,
        resizable: false,
        frame: true,
        icon: path.join(__dirname, "pixel-heart-pixelart-png.ico"),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.loadFile("index.html");

    win.setMenuBarVisibility(false);
}

app.whenReady().then    (createWindow);

app.on("window-all-closed", ()=>{
    if(process.platform !== "darwin") app.quit();
});