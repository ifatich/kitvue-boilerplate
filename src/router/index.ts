/**
 * @file index.ts
 * @description Standardized Vue Router configuration for kitvue-starter-template.
 * Includes frontend navigation guard protecting admin routes based on auth state.
 */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { isAdminAuthenticated } from '@/services/authService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      alias: ['/entry', '/homescreen'],
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'admin-login',
      component: () => import('../views/AdminLoginView.vue'),
      alias: ['/dashboard/login'],
    },
    {
      path: '/pengajuan-rahn/:view?',
      name: 'pengajuan-rahn',
      component: () => import('../views/rahn/PengajuanRahnView.vue'),
      alias: ['/pengajuan/rahn/:view?', '/rahn/:view?'],
      meta: { requiresAuth: true },
    },
    {
      path: '/gadai-1-page',
      name: 'gadai-1-page',
      component: () => import('../views/gadai-1-page/Gadai1PageView.vue'),
      meta: { requiresAuth: true },
    },
    // Fallback redirect ke Home
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

// Navigation Guard: Proteksi akses rute admin
router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth && !isAdminAuthenticated()) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }
  next()
})

export default router
