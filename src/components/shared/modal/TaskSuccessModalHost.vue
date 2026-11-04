<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useTaskSuccessModal } from '@/composables/useTaskSuccessModal'
import TaskSuccessModal from './TaskSuccessModal.vue'

const {
  isTaskModalOpen,
  isDismissedForExploration,
  modalTitle,
  modalMessage,
  modalTaskName,
  modalConfirmLabel,
  modalSecondaryLabel,
  dismissToExplore,
  reopenSuccessModal,
  handleConfirm,
  handleSecondary,
} = useTaskSuccessModal()

function handleGlobalFooterClick(event: MouseEvent) {
  if (!isDismissedForExploration.value) return
  const target = event.target as HTMLElement | null
  if (!target) return

  // Check if click was inside a footer or footer-like element
  const footerEl = target.closest('footer, .cms-footer, .proto2-footer, .pos-footer')
  if (footerEl) {
    reopenSuccessModal()
  }
}

onMounted(() => {
  window.addEventListener('click', handleGlobalFooterClick, true)
})

onUnmounted(() => {
  window.removeEventListener('click', handleGlobalFooterClick, true)
})
</script>

<template>
  <TaskSuccessModal
    v-model="isTaskModalOpen"
    :title="modalTitle"
    :message="modalMessage"
    :task-name="modalTaskName"
    :confirm-label="modalConfirmLabel"
    :secondary-label="modalSecondaryLabel"
    @confirm="handleConfirm"
    @secondary="handleSecondary"
    @dismiss="dismissToExplore"
  />

  <!-- Floating Badge at Bottom-Right for Re-triggering Modal after Exploration -->
  <Teleport to="body">
    <Transition name="task-badge-fade">
      <button
        v-if="isDismissedForExploration"
        class="task-success-floating-badge"
        type="button"
        aria-label="Buka kembali modal Task Selesai"
        title="Klik untuk membuka kembali modal Task Selesai"
        @click="reopenSuccessModal"
      >
        <span class="task-success-badge-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <span class="task-success-badge-text">Task Selesai</span>
        <span class="task-success-badge-action">Lanjut &rarr;</span>
      </button>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.task-success-floating-badge {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 99998;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  background: linear-gradient(135deg, #006838 0%, #008744 100%);
  color: #ffffff;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  border-radius: 9999px;
  box-shadow: 0 10px 25px -3px rgba(0, 104, 56, 0.4), 0 4px 10px -2px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  font-family: inherit;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: -0.01em;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 14px 28px -2px rgba(0, 104, 56, 0.5), 0 6px 14px -2px rgba(0, 0, 0, 0.25);
    background: linear-gradient(135deg, #005a30 0%, #007a3d 100%);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid #00ab4e;
    outline-offset: 3px;
  }
}

.task-success-badge-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ffffff;
  color: #006838;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.task-success-badge-text {
  font-weight: 700;
  color: #ffffff;
}

.task-success-badge-action {
  font-size: 13px;
  font-weight: 600;
  color: #d1fae5;
  padding-left: 2px;
}

/* Badge transition */
.task-badge-fade-enter-active,
.task-badge-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.task-badge-fade-enter-from,
.task-badge-fade-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.9);
}
</style>

