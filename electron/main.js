const { app, BrowserWindow } = require('electron');

const LIVE_URL = 'https://go-revenue-pos.vercel.app';

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.setMenu(null);
  win.loadURL(LIVE_URL);
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());