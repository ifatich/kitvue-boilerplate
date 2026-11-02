<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const returnToHome = () => {
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
    <p class="task-complete-message">
      Selamat Anda sudah menyelesaikan task!
    </p>
    <button class="task-complete-action" type="button" @click="returnToHome">
      Kembali ke Halaman Awal
    </button>
  </main>
</template>

<style lang="scss" scoped>
.task-complete-page {
  position: fixed;
  inset: 0;
  z-index: 2000;
  overflow: auto;
  background: #3b3b3b;
}

.task-complete-message {
  position: absolute;
  top: calc(50% - 44px);
  left: 50%;
  width: min(282px, calc(100% - 32px));
  margin: 0;
  transform: translate(-50%, -50%);
  color: var(--g-kit-white);
  font-size: 24px;
  font-weight: var(--g-kit-font-weight-normal);
  line-height: 44px;
  text-align: center;
}

.task-complete-action {
  position: absolute;
  top: calc(50% + 88px);
  left: 50%;
  min-height: 44px;
  padding: 8px 16px;
  transform: translate(-50%, -50%);
  border: 1px solid var(--g-kit-lime-50);
  border-radius: 6px;
  background: var(--g-kit-white);
  color: var(--g-kit-lime-50);
  cursor: pointer;
  font: inherit;
  font-size: 16px;
  font-weight: var(--g-kit-font-weight-bold);
  line-height: 24px;
  white-space: nowrap;
}

.task-complete-action:focus-visible {
  outline: 2px solid var(--g-kit-white);
  outline-offset: 3px;
}
</style>
