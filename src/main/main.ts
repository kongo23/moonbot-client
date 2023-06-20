/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

const startExpress = () => {
  const expressApp = express();
  const port = 8080;
  let logs = [''];
  let simulationInterval: ReturnType<typeof setTimeout> | undefined;

  expressApp.use(cors());

  const getDefaultLog = (counter: number) => {
    if (counter % 3 === 0) {
      return 'Checking for liquidity...';
    }
    if (counter % 3 === 1) {
      return 'Checking for liquidity..';
    }
    return 'Checking for liquidity.';
  };

  const generateGUID = () => {
    return uuidv4();
  };

  const simulateWork = () => {
    simulationInterval = setTimeout(() => {
      const id = generateGUID();
      console.log(id);
      simulateWork();
    }, 1000);
  };

  const stopSimulation = () => {
    if (simulationInterval) {
      clearTimeout(simulationInterval);
    }
  };

  expressApp.get('/logs', (req, res) => {
    const { counter } = req.query;
    const defaultLog = getDefaultLog(parseInt(counter as string, 10));
    logs = [defaultLog];
    res.json(logs);
  });

  expressApp.get('/startBot', (req, res) => {
    simulateWork();
    res.send('Started!');
  });

  expressApp.get('/stopBot', (req, res) => {
    stopSimulation();
    res.send('Stopped!');
  });

  expressApp
    .listen(port, () => {
      console.log(`Express.js server is running on port ${port}`);
    })
    .on('error', () => {
      const fallbackPort = port + 1;
      console.log(
        `Port ${port} is already in use. Trying fallback port ${fallbackPort}...`
      );
      expressApp.listen(fallbackPort, () => {
        console.log(
          `Express.js server is running on fallback port ${fallbackPort}`
        );
      });
    });
};

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    // Start the Express.js serverrqct component
    startExpress();

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
