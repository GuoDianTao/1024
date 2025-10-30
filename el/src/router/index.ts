import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Splash',
    component: () => import('../views/Splash/index.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home/index.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
