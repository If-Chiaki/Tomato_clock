const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  close: () => ipcRenderer.send('window-close'),
  setAlwaysOnTop: (isTop) => ipcRenderer.send('window-top', isTop),
  setSize: (width, height) => ipcRenderer.send('window-resize', width, height)
})
