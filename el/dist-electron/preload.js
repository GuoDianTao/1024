// Generated runtime preload for Electron
// This mirrors electron/preload.ts to ensure availability in dist-electron
const { contextBridge } = require('electron')

// Expose minimal, safe API to renderer
contextBridge.exposeInMainWorld('api', {
  version: '1.0.0'
})
