<script setup lang="ts">
/**
 * @file BeneficialOwnerSaveConfirmModal.vue
 * @description SPRINT Single UI Modal: "Konfirmasi Simpan Data Beneficial Owner".
 * Conforms 1:1 with Figma Node 11752:119511 (views/bottom-sheet/info).
 * Adheres strictly to Pegadaian --g-kit-* design tokens and kitvue-plugin rules.
 */
import { GButton } from '@/components'

withDefaults(
  defineProps<{
    modelValue?: boolean
    isMobile?: boolean
  }>(),
  {
    modelValue: true,
    isMobile: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const closeModal = () => {
  emit('update:modelValue', false)
  emit('cancel')
}

const handleConfirm = () => {
  emit('update:modelValue', false)
  emit('confirm')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="bo-modal-fade">
      <div
        v-if="modelValue"
        class="bo-save-confirm-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-save-title"
        @click.self="closeModal"
      >
        <div
          class="bo-save-confirm-modal"
          :class="{ 'bo-save-confirm-modal--mobile': isMobile }"
          data-node-id="11752:119511"
        >
          <!-- Header: Title & Close Cross -->
          <div class="bo-save-confirm-modal__header">
            <h3 id="modal-save-title" class="bo-save-confirm-modal__title">
              Konfirmasi
            </h3>
            <button
              type="button"
              class="bo-save-confirm-modal__close"
              aria-label="Tutup dialog"
              @click="closeModal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6L18 18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          <!-- Divider -->
          <div class="bo-save-confirm-modal__divider"></div>

          <!-- Content Description -->
          <div class="bo-save-confirm-modal__content">
            <p class="bo-save-confirm-modal__desc">
              Data akan tersimpan, pastikan sudah benar dan sesuai.
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="bo-save-confirm-modal__actions">
            <GButton
              label="Kembali"
              type="outline"
              size="md"
              class="w-100"
              @click="closeModal"
            />
            <GButton
              label="Lanjutkan"
              type="primary"
              size="md"
              class="w-100"
              @click="handleConfirm"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.bo-save-confirm-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(37, 37, 40, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 16px;
}

.bo-save-confirm-modal {
  background: var(--g-kit-white, #ffffff);
  border-radius: 12px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.14), 0px 0px 2px rgba(0, 0, 0, 0.08);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &--mobile {
    max-width: 100%;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  &__title {
    font-family: 'Nunito Sans', sans-serif;
    font-weight: var(--g-kit-font-weight-extrabold, 800);
    font-size: 18px;
    line-height: 26px;
    color: var(--g-kit-black-80, #252528);
    margin: 0;
  }

  &__close {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: var(--g-kit-black-60, #58585b);
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: var(--g-kit-black-80, #252528);
    }
  }

  &__divider {
    width: 100%;
    height: 1px;
    background-color: var(--g-kit-black-20, #eeeeef);
  }

  &__content {
    width: 100%;
  }

  &__desc {
    font-family: 'Nunito Sans', sans-serif;
    font-weight: var(--g-kit-font-weight-semibold, 600);
    font-size: 14px;
    line-height: 20px;
    color: var(--g-kit-black-60, #58585b);
    margin: 0;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }
}

.bo-modal-fade-enter-active,
.bo-modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.bo-modal-fade-enter-from,
.bo-modal-fade-leave-to {
  opacity: 0;
}
</style>
