/* Vue 应用挂载脚本 */
(function () {
  'use strict';
  if (!window.Vue) {
    console.error('Vue is not loaded. Ensure Vue CDN script is included before src/app.js');
    return;
  }
  var app = window.Vue.createApp({});
  // 注册组件
  if (window.GameContainer) {
    app.component('game-container', window.GameContainer);
  }
  // 挂载到 #app
  app.mount('#app');
})();
