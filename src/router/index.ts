/**
 * @file index.ts
 * @description Standardized Vue Router configuration for kitvue-starter-template.
 * Includes frontend navigation guard protecting admin routes based on auth state.
 */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { getPrototypeRoleFromSession, isAdminAuthenticated } from '@/services/authService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'entry-point' },
    },
    {
      path: '/beranda',
      name: 'home',
      component: HomeView,
      alias: ['/entry', '/homescreen'],
    },
    {
      path: '/entry-point',
      name: 'entry-point',
      component: () => import('../views/EntryPointView.vue'),
    },
    {
      path: '/login',
      name: 'admin-login',
      component: () => import('../views/AdminLoginView.vue'),
      alias: ['/dashboard/login'],
    },
    {
      path: '/pengajuan-gadai/:view?',
      name: 'pengajuan-gadai',
      component: () => import('../views/rahn/PengajuanRahnView.vue'),
      alias: ['/pengajuan-rahn/:view?', '/pengajuan/rahn/:view?', '/rahn/:view?'],
      meta: { requiresAuth: true },
    },
    {
      path: '/gadai-1-page',
      name: 'gadai-1-page',
      component: () => import('../views/gadai-1-page/Gadai1PageView.vue'),
    },
    {
      path: '/pos',
      component: () => import('../views/pos/PosRoutesView.vue'),
      children: [
        {
          path: '',
          name: 'pos-dashboard',
          component: () => import('../../POS/DashboardPage.vue'),
        },
        {
          path: 'pembayaran',
          name: 'pos-pembayaran',
          component: () => import('../../POS/pembayaran/PembayaranMenuPage.vue'),
        },
        {
          path: 'pembayaran-gadai',
          name: 'pos-pembayaran-gadai',
          component: () => import('../../POS/pembayaran-gadai/PembayaranGadaiPage.vue'),
        },
      ],
    },
    {
      path: '/sprint-proto-1',
      name: 'dashboard-kasir',
      component: () => import('../views/sprint-proto-1/SprintProto1EntryView.vue'),
      meta: { requiresAuth: true, requiresPrototypeRole: true },
      children: [
        {
          path: 'pengajuan-gadai',
          name: 'sprint-proto-1-pengajuan-gadai',
          component: () => import('../views/proto-existing/PengajuanGadaiDummyView.vue'),
        },
        {
          path: 'task-complete',
          name: 'sprint-proto-1-task-complete',
          component: () => import('../views/proto-existing/TaskCompleteDummyView.vue'),
        },
      ],
    },
    {
      path: '/sprint-proto-2',
      name: 'service-launcher',
      component: () => import('../views/sprint-proto-2/SprintProto2EntryView.vue'),
      meta: { requiresAuth: true, requiresPrototypeRole: true },
      children: [
        {
          path: 'pengajuan-gadai',
          name: 'sprint-proto-2-pengajuan-gadai',
          component: () => import('../views/proto-existing/PengajuanGadaiDummyView.vue'),
          props: { variant: 'launcher' },
        },
        {
          path: 'task-complete',
          name: 'sprint-proto-2-task-complete',
          component: () => import('../views/proto-existing/TaskCompleteDummyView.vue'),
        },
      ],
    },
    {
      path: '/sprint-existing',
      name: 'proto-existing',
      alias: ['/proto-existing'],
      component: () => import('../views/proto-existing/ProtoExistingView.vue'),
      meta: { requiresAuth: true, requiresPrototypeRole: true },
    },
    {
      path: '/proto-existing/pengajuan-gadai',
      name: 'proto-existing-pengajuan-gadai',
      alias: ['/sprint-existing/pengajuan-gadai'],
      component: () => import('../views/proto-existing/PengajuanGadaiEntryView.vue'),
      meta: { requiresAuth: true, requiresPrototypeRole: true },
    },
    {
      path: '/proto-existing/task-complete',
      name: 'proto-existing-task-complete',
      alias: ['/sprint-existing/task-complete'],
      component: () => import('../views/proto-existing/TaskCompleteDummyView.vue'),
      meta: { requiresAuth: true, requiresPrototypeRole: true },
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
  const isAuthenticated = isAdminAuthenticated()
  const hasSelectedRole = getPrototypeRoleFromSession() !== null

  if ((to.meta.requiresAuth && !isAuthenticated) || (to.meta.requiresPrototypeRole && !hasSelectedRole)) {
    next({
      path: '/login',
      query: {
        redirect: to.fullPath,
        ...(to.meta.requiresPrototypeRole ? { roleSelection: 'true' } : {}),
      },
    })
    return
  }
  next()
})

export default router
