// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const os = require('os');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);


let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('index.html');
};

app.whenReady().then(() => {
  createWindow();
});

ipcMain.handle('execute-shutdown', async (event, timeInMinutes) => {
  const platform = os.platform();
  let command;

  if (platform === 'win32') {
    // Windows
    command = `shutdown /s /t ${timeInMinutes * 60}`;
  } else if (platform === 'darwin') {
    // macOS
    command = `sudo shutdown -h +${timeInMinutes}`;
  } else if (platform === 'linux') {
    // Linux
    command = `sudo shutdown -h +${timeInMinutes}`;
  } else {
    console.log('Unsupported operating system.');
    return 'Unsupported operating system.';
  }

  try {
    const stdout = await execPromise(command);
    console.log(`stdout: ${stdout}`);
    return 'Shutdown command has been executed successfully.';
  } catch (error) {
    console.error(`exec error: ${error}`);
    return `Error: ${error.message}`;
  }
});

ipcMain.handle('cancel-shutdown', async () => {
  const platform = os.platform();
  let command;

  if (platform === 'win32') {
    // Windows
    command = 'shutdown /a';
  } else if (platform === 'darwin' || platform === 'linux') {
    // macOS and Linux
    command = 'sudo shutdown -c';
  } else {
    console.log('Unsupported operating system.');
    return 'Unsupported operating system.';
  }

  try {
    const stdout = await execPromise(command);
    console.log(`stdout: ${stdout}`);
    return 'Shutdown cancel command has been executed successfully.';
  } catch (error) {
    console.error(`exec error: ${error}`);
    return `Error: ${error.message}`;
  }
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
