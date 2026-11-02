<script setup lang="ts">
import { GButton, GModal } from '@/components'
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
}>()

const handleConfirm = () => {
  emit('confirm')
}

const handleSecondary = () => {
  emit('secondary')
}
</script>

<template>
  <GModal
    :model-value="props.modelValue"
    class="task-success-modal"
    centered
    title=""
    :show-close-button="false"
    :persistent="true"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #body>
      <div class="task-success-modal__content">
        <SubmissionSuccessIllustration class="task-success-modal__illustration" />
        <div class="task-success-modal__copy">
          <h2 class="task-success-modal__title">{{ props.title }}</h2>
          <p v-if="props.taskName" class="task-success-modal__task-badge">
            {{ props.taskName }}
          </p>
          <p class="task-success-modal__message">{{ props.message }}</p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="task-success-modal__actions">
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
    </template>
  </GModal>
</template>

<style scoped lang="scss">
.task-success-modal {
  :deep(.modal-content) {
    border: none;
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
  }

  :deep(.modal-body) {
    padding: 24px 16px 12px;
  }

  :deep(.modal-footer) {
    border-top: none;
    padding: 12px 16px 20px;
    justify-content: center;
  }
}

.task-success-modal__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
}

.task-success-modal__illustration {
  margin: 0 auto;
}

.task-success-modal__copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.task-success-modal__title {
  margin: 0;
  color: var(--g-kit-black-90, #1f2328);
  font-size: 24px;
  font-weight: var(--g-kit-font-weight-bold, 700);
  line-height: 32px;
}

.task-success-modal__task-badge {
  display: inline-block;
  padding: 4px 12px;
  margin: 0;
  border-radius: 9999px;
  background-color: var(--g-kit-lime-10, #e6f6ec);
  color: var(--g-kit-lime-50, #00ab4e);
  font-size: 13px;
  font-weight: var(--g-kit-font-weight-bold, 700);
}

.task-success-modal__message {
  margin: 0;
  color: var(--g-kit-black-70, #58585b);
  font-size: 15px;
  line-height: 22px;
}

.task-success-modal__actions {
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 12px;

  :deep(button) {
    min-width: 140px;
  }
}
</style>

