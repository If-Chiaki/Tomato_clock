const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

// 处理 Windows 安装时的创建/删除快捷方式
// if (require('electron-squirrel-startup')) {
//   app.quit();
// }

let mainWindow;

const createWindow = () => {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false, // 无边框窗口，更美观
    transparent: true, // 透明背景，允许圆角
    resizable: true,
    hasShadow: false, // 禁用系统自带阴影，使用 CSS 阴影
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, '../public/icon.ico') // 假设有图标，暂时先留着
  });

  // 开发环境加载 Vite 服务，生产环境加载构建文件
  const isDev = process.env.NODE_ENV !== 'production' && !app.isPackaged;
  
  if (isDev) {
    // 等待 Vite 启动
    setTimeout(() => {
        mainWindow.loadURL('http://localhost:5173');
        // mainWindow.webContents.openDevTools({ mode: 'detach' });
    }, 1000);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // 窗口控制事件
  ipcMain.on('window-minimize', () => {
    mainWindow.minimize();
  });

  ipcMain.on('window-close', () => {
    mainWindow.close();
  });
  
  ipcMain.on('window-top', (event, isTop) => {
      mainWindow.setAlwaysOnTop(isTop);
  });

  ipcMain.on('window-resize', (event, width, height) => {
    mainWindow.setSize(width, height);
  });

  ipcMain.on('window-center', () => {
    mainWindow.center();
  });
};

app.on('ready', createWindow);

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
