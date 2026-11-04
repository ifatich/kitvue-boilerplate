<script setup lang="ts">
import { GButton } from '@/components'
import SubmissionSuccessIllustration from '@/components/shared/illustration/SubmissionSuccessIllustration.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
    message?: string
    confirmLabel?: string
    secondaryLabel?: string
    taskName?: string
  }>(),
  {
    modelValue: true,
    title: 'Task Selesai',
    message: 'Selamat Anda sudah menyelesaikan task!',
    confirmLabel: 'Kembali ke Halaman Awal',
    secondaryLabel: '',
    taskName: '',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'secondary'): void
  (e: 'dismiss'): void
}>()

const handleConfirm = () => {
  emit('confirm')
}

const handleSecondary = () => {
  emit('secondary')
}

const handleDismiss = () => {
  emit('dismiss')
}

const handleBackdrop = () => {
  // Modal is persistent against accidental backdrop click, use the explicit (X) button to explore
}
</script>

<template>
  <Teleport to="body">
    <Transition name="task-success-fade">
      <div
        v-if="props.modelValue"
        class="task-success-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-success-modal-title"
      >
        <div class="task-success-backdrop" @click="handleBackdrop" />
        <div class="task-success-dialog">
          <div class="task-success-card">
            <!-- Close Button (X) to dismiss for exploration -->
            <button
              class="task-success-close-btn"
              type="button"
              aria-label="Tutup modal untuk eksplorasi halaman"
              title="Tutup untuk eksplorasi"
              @click="handleDismiss"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <SubmissionSuccessIllustration class="task-success-illustration" />
            <div class="task-success-copy">
              <h2 id="task-success-modal-title" class="task-success-title">{{ props.title }}</h2>
              <span v-if="props.taskName" class="task-success-badge">
                {{ props.taskName }}
              </span>
              <p class="task-success-message">{{ props.message }}</p>
            </div>

            <div class="task-success-actions">
              <GButton
                v-if="props.secondaryLabel"
                :label="props.secondaryLabel"
                type="neutral"
                size="md"
                @click="handleSecondary"
              />
              <GButton
                :label="props.confirmLabel"
                type="primary"
                size="md"
                @click="handleConfirm"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.task-success-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  overflow: auto;
}

.task-success-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.task-success-dialog {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 460px;
  margin: auto;
}

.task-success-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px 24px;
  background: var(--g-kit-white, #ffffff);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  gap: 20px;
}

.task-success-close-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
    color: #111827;
    border-color: #d1d5db;
    transform: scale(1.05);
  }

  &:focus-visible {
    outline: 2px solid #006838;
    outline-offset: 2px;
  }
}

.task-success-illustration {
  margin: 0 auto;
}

.task-success-copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.task-success-title {
  margin: 0;
  color: var(--g-kit-black-90, #1f2328);
  font-size: 24px;
  font-weight: var(--g-kit-font-weight-bold, 700);
  line-height: 32px;
}

.task-success-badge {
  display: inline-block;
  padding: 4px 14px;
  margin: 0;
  border-radius: 9999px;
  background-color: var(--g-kit-lime-10, #e6f6ec);
  color: var(--g-kit-lime-50, #00ab4e);
  font-size: 13px;
  font-weight: var(--g-kit-font-weight-bold, 700);
}

.task-success-message {
  margin: 0;
  color: var(--g-kit-black-70, #58585b);
  font-size: 15px;
  line-height: 22px;
}

.task-success-actions {
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 12px;
  margin-top: 8px;

  :deep(button) {
    min-width: 160px;
  }
}

/* Animations */
.task-success-fade-enter-active,
.task-success-fade-leave-active {
  transition: opacity 0.25s ease;

  .task-success-dialog {
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
  }
}

.task-success-fade-enter-from,
.task-success-fade-leave-to {
  opacity: 0;

  .task-success-dialog {
    transform: scale(0.92);
    opacity: 0;
  }
}
</style>
