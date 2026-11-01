import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('./DashboardPage.vue'),
    },
    {
      path: '/pembayaran',
      component: () => import('./pembayaran/PembayaranMenuPage.vue'),
    },
    {
      path: '/pembayaran-gadai',
      component: () => import('./pembayaran-gadai/PembayaranGadaiPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
