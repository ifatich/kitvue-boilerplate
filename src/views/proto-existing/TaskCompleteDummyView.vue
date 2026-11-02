<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TaskSuccessModal from '@/components/shared/modal/TaskSuccessModal.vue'

const router = useRouter()
const route = useRoute()
const isModalOpen = ref(true)

const returnToHome = () => {
  const team = route.query.team as string | undefined
  const cp = route.query.cp as string | undefined
  const redirect = route.query.redirect as string | undefined

  if (redirect) {
    void router.push(redirect)
    return
  }

  if (team && cp) {
    void router.push({
      name: 'entry-point-tasks',
      query: { team, cp },
    })
    return
  }

  const homePath = route.path.startsWith('/sprint-proto-1')
    ? '/sprint-proto-1'
    : route.path.startsWith('/sprint-proto-2')
      ? '/sprint-proto-2'
      : '/sprint-existing'
  void router.push(homePath)
}
</script>

<template>
  <main class="task-complete-page">
    <TaskSuccessModal
      v-model="isModalOpen"
      title="Task Selesai"
      message="Selamat Anda sudah menyelesaikan task!"
      confirm-label="Kembali ke Halaman Awal"
      @confirm="returnToHome"
      @update:model-value="returnToHome"
    />
  </main>
</template>

<style lang="scss" scoped>
.task-complete-page {
  position: fixed;
  inset: 0;
  z-index: 2000;
  overflow: auto;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
