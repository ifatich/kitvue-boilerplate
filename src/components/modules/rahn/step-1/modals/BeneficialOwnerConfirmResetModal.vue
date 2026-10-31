<script setup lang="ts">
/**
 * @file BeneficialOwnerConfirmResetModal.vue
 * @description SPRINT Single UI Modal: "Konfirmasi Pencarian Ulang / Kembali ke Screen Sebelumnya".
 * Conforms 1:1 with Figma Node 11752:120334 (views/bottom-sheet/info).
 * Adheres strictly to Pegadaian --g-kit-* design tokens and kitvue-plugin rules.
 */
import { GButton } from '@/components'

withDefaults(
  defineProps<{
    modelValue?: boolean
    isMobile?: boolean
    asPage?: boolean
  }>(),
  {
    modelValue: true,
    isMobile: false,
    asPage: false,
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
  <!-- 1. Page Mode (No Teleport, No Backdrop - Direct Page View) -->
  <div
    v-if="asPage"
    class="bo-page"
    :class="{ 'bo-page--mobile': isMobile }"
    data-node-id="11752:120334"
  >
    <div class="bo-page__header">
      <h3 id="page-reset-title" class="bo-page__title">
        Konfirmasi Batal
      </h3>
    </div>

    <div class="bo-page__divider"></div>

    <div class="bo-page__body py-5 text-center">
      <p class="bo-confirm-modal__desc m-0 fs-5">
        Perubahan yang Anda lakukan belum disimpan. Apakah Anda yakin ingin membatalkan?
      </p>
    </div>

    <div class="bo-page__divider"></div>

    <div class="bo-page__actions">
      <GButton
        label="Tidak, Tetap di Sini"
        type="outline"
        size="md"
        class="btn-action"
        @click="closeModal"
      />
      <GButton
        label="Ya, Batalkan"
        type="primary"
        size="md"
        class="btn-action"
        @click="handleConfirm"
      />
    </div>
  </div>

  <!-- 2. Modal Mode (Fallback with Teleport & Backdrop) -->
  <Teleport v-else to="body">
    <Transition name="bo-modal-fade">
      <div
        v-if="modelValue"
        class="bo-confirm-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-reset-title"
        @click.self="closeModal"
      >
        <div
          class="bo-confirm-modal"
          :class="{ 'bo-confirm-modal--mobile': isMobile }"
          data-node-id="11752:120334"
        >
          <!-- Header: Title and Close Button -->
          <div class="bo-confirm-modal__header">
            <h3 id="modal-reset-title" class="bo-confirm-modal__title">
              Konfirmasi
            </h3>
            <button
              type="button"
              class="bo-confirm-modal__close"
              aria-label="Tutup dialog"
              @click="closeModal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6L18 18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          <!-- Divider -->
          <div class="bo-confirm-modal__divider"></div>

          <!-- Content Description -->
          <div class="bo-confirm-modal__content">
            <p class="bo-confirm-modal__desc">
              Data Beneficial Owner yang sudah ditambahkan sebelumnya akan hilang jika Anda melakukan pencarian baru. Anda yakin lakukan pencarian ulang?
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="bo-confirm-modal__actions">
            <GButton
              label="Ya, Lanjut Cari"
              type="outline"
              size="md"
              class="w-100"
              @click="handleConfirm"
            />
            <GButton
              label="Kembali"
              type="primary"
              size="md"
              class="w-100"
              @click="closeModal"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.bo-page {
  position: relative;
  width: 100%;
  background-color: var(--g-kit-white, #ffffff);
  border-radius: 8px;
  display: flex;
  flex-direction: column;

  &__header {
    padding: 16px 20px;
    display: flex;
    align-items: center;
  }

  &__title {
    margin: 0;
    font-family: 'Nunito Sans', sans-serif;
    font-size: var(--g-kit-font-size-kappa, 18px);
    font-weight: var(--g-kit-font-weight-bold, 800);
    color: var(--g-kit-black-80, #252528);
  }

  &__divider {
    height: 1px;
    background-color: var(--g-kit-black-20, #eeeeef);
    width: 100%;
  }

  &__actions {
    padding: 16px 20px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    background-color: var(--g-kit-black-10, #f8f8f8);

    .btn-action {
      min-width: 140px;
      height: 40px;
      font-weight: var(--g-kit-font-weight-bold, 800);
      border-radius: 6px;
    }
  }
}

.bo-confirm-backdrop {
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

.bo-confirm-modal {
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
