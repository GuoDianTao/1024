import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// eh@ SCSS
import './styles/_variables.scss';

const app = createApp(App);
app.use(router);
app.mount('#app');