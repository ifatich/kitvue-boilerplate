import { createRouter, createWebHistory } from 'vue-router'
import ServiceLauncherPage from './views/ServiceLauncherPage.vue'
import PengajuanGadaiDummyView from '../src/views/proto-existing/PengajuanGadaiDummyView.vue'
import TaskCompleteDummyView from '../src/views/proto-existing/TaskCompleteDummyView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'service-launcher',
      component: ServiceLauncherPage,
      alias: '/proto-existing',
      children: [
        {
          path: 'pengajuan-gadai',
          name: 'proto-existing-pengajuan-gadai',
          component: PengajuanGadaiDummyView,
          props: { variant: 'launcher' },
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
