import { createRouter, createWebHistory } from 'vue-router'
import DashboardKasirPage from './views/DashboardKasirPage.vue'
import PengajuanGadaiDummyView from '../src/views/proto-existing/PengajuanGadaiDummyView.vue'
import TaskCompleteDummyView from '../src/views/proto-existing/TaskCompleteDummyView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard-kasir',
      component: DashboardKasirPage,
      alias: '/proto-existing',
      children: [
        {
          path: 'pengajuan-gadai',
          name: 'proto-existing-pengajuan-gadai',
          component: PengajuanGadaiDummyView,
        },
      ],
    },
    {
      path: '/proto-existing/task-complete',
      name: 'proto-existing-task-complete',
      component: TaskCompleteDummyView,
    },
  ],
})

export default router
