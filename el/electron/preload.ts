import { contextBridge } from 'electron';

// 仅暴露受控 API，避免直接暴露 Node 能力
contextBridge.exposeInMainWorld('api', {
  version: '1.0.0'
});
