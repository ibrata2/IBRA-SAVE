const { contextBridge, ipcRenderer, webUtils } = require('electron');

const on = (ch) => (cb) => {
  const h = (_e, d) => cb(d);
  ipcRenderer.on(ch, h);
  return () => ipcRenderer.removeListener(ch, h);
};

contextBridge.exposeInMainWorld('ibra', {
  getSettings: () => ipcRenderer.invoke('settings:get'),
  setSettings: (p) => ipcRenderer.invoke('settings:set', p),
  ensureEngine: () => ipcRenderer.invoke('engine:ensure'),
  updateEngine: () => ipcRenderer.invoke('engine:update'),
  engineVersion: () => ipcRenderer.invoke('engine:version'),
  info: (url) => ipcRenderer.invoke('info', url),
  download: (url, overrides) => ipcRenderer.invoke('download', { url, overrides }),
  cancel: (id) => ipcRenderer.invoke('cancel', id),
  history: () => ipcRenderer.invoke('history:get'),
  clearHistory: () => ipcRenderer.invoke('history:clear'),
  pickFolder: () => ipcRenderer.invoke('pick:folder'),
  pickFile: () => ipcRenderer.invoke('pick:file'),
  openFile: (p) => ipcRenderer.invoke('open:file', p),
  openFolder: (p) => ipcRenderer.invoke('open:folder', p),
  openUrl: (u) => ipcRenderer.invoke('open:url', u),
  readClipboard: () => ipcRenderer.invoke('clipboard:read'),
  remux: (file, container) => ipcRenderer.invoke('remux', { file, container }),
  filePath: (f) => { try { return webUtils.getPathForFile(f); } catch { return f.path || null; } },
  appVersion: () => ipcRenderer.invoke('app:version'),
  installUpdate: () => ipcRenderer.invoke('update:install'),
  onJob: on('job'),
  onEngine: on('engine'),
  onRemux: on('remux'),
  onUpdate: on('update')
});
