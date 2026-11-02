<script setup lang="ts">
import { useTaskSuccessModal } from '@/composables/useTaskSuccessModal'
import TaskSuccessModal from './TaskSuccessModal.vue'

const {
  isTaskModalOpen,
  modalTitle,
  modalMessage,
  modalTaskName,
  modalConfirmLabel,
  modalSecondaryLabel,
  handleConfirm,
  handleSecondary,
} = useTaskSuccessModal()
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
  />
</template>

