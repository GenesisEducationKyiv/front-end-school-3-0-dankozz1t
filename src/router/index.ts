import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const DefaultLayout = () => import('@/layouts/DefaultLayout.vue');

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/pages/Tracks.vue'),
      },
    ],
  },
  {
    path: '/tracks',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Tracks',
        component: () => import('@/pages/Tracks.vue'),
      },
    ],
  },
  {
    path: '/tracks-graphql',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'TracksGraphQL',
        component: () => import('@/pages/TracksGraphQl.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
