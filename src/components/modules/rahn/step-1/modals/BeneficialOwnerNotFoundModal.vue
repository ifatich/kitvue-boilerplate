<script setup lang="ts">
/**
 * @file BeneficialOwnerNotFoundModal.vue
 * @description SPRINT Single UI Modal for Negative Flow: "Data Beneficial Owner Tidak Ditemukan".
 * Conforms 1:1 with Figma Node 11347:151890 (component/bottom sheet/1 CTA/image).
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
  (e: 'create-manual'): void
  (e: 'cancel'): void
}>()

const closeModal = () => {
  emit('update:modelValue', false)
  emit('cancel')
}

const handleContinue = () => {
  emit('update:modelValue', false)
  emit('create-manual')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="bo-modal-fade">
      <div
        v-if="modelValue"
        class="bo-not-found-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-not-found-title"
        @click.self="closeModal"
      >
        <div
          class="bo-not-found-modal"
          :class="{ 'bo-not-found-modal--mobile': isMobile }"
          data-node-id="11347:151890"
        >
          <!-- Top Row: Close Button (X) -->
          <div class="bo-not-found-modal__header">
            <button
              type="button"
              class="bo-not-found-modal__close"
              aria-label="Tutup dialog"
              @click="closeModal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6L18 18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          <!-- Illustration: Warning 156px matching Figma 11347:151894 -->
          <div class="bo-not-found-modal__illustration">
            <svg width="156" height="156" viewBox="0 0 156 156" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="78" cy="78" r="68" fill="#FBF3E6" />
              <circle cx="78" cy="78" r="54" fill="#FEF9F0" />
              <!-- Hazard striped accents -->
              <rect x="52" y="36" width="52" height="10" rx="5" fill="#EEEEEF" transform="rotate(-15 52 36)" />
              <rect x="42" y="112" width="60" height="10" rx="5" fill="#EEEEEF" transform="rotate(-15 42 112)" />
              <!-- Yellow-Orange Warning Circle -->
              <circle cx="78" cy="78" r="38" fill="#FFC54F" />
              <circle cx="78" cy="78" r="32" fill="#FFAA00" />
              <!-- Exclamation Mark -->
              <path d="M78 60V82" stroke="white" stroke-width="4.5" stroke-linecap="round" />
              <circle cx="78" cy="94" r="3" fill="white" />
              <!-- Decorative Dots -->
              <circle cx="34" cy="48" r="4" fill="#F2CBA8" />
              <circle cx="124" cy="108" r="5" fill="#F2CBA8" />
              <path d="M116 42L124 46" stroke="#FFAA00" stroke-width="2" stroke-linecap="round" />
              <path d="M38 108L44 116" stroke="#FFAA00" stroke-width="2" stroke-linecap="round" />
            </svg>
          </div>

          <!-- Text Content -->
          <div class="bo-not-found-modal__content">
            <h3 id="modal-not-found-title" class="bo-not-found-modal__title">
              Data Beneficial Owner Tidak Ditemukan
            </h3>
            <p class="bo-not-found-modal__desc">
              NIK tidak ditemukan, silakan tambah data beneficial owner baru.
            </p>
          </div>

          <!-- CTA Button -->
          <div class="bo-not-found-modal__action">
            <GButton
              label="Lanjutkan ke Tambah Beneficial Owner"
              type="primary"
              size="md"
              class="w-100"
              @click="handleContinue"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.bo-not-found-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1060;
  background-color: rgba(37, 37, 40, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.bo-not-found-modal {
  position: relative;
  width: 100%;
  max-width: 360px;
  background-color: var(--g-kit-white, #ffffff);
  border-radius: 12px;
  padding: 16px 20px 24px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &--mobile {
    width: 100%;
    max-width: 100%;
    margin-top: auto;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    padding-bottom: 32px;
  }

  &__header {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 8px;
  }

  &__close {
    background: transparent;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: var(--g-kit-black-60, #58585b);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: color 0.15s ease;

    &:hover {
      color: var(--g-kit-black-80, #252528);
    }
  }

  &__illustration {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 24px;
  }

  &__title {
    margin: 0;
    font-family: 'Nunito Sans', sans-serif;
    font-size: 20px;
    font-weight: var(--g-kit-font-weight-bold, 800);
    line-height: 30px;
    color: var(--g-kit-black-80, #252528);
  }

  &__desc {
    margin: 0;
    font-family: 'Nunito Sans', sans-serif;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    color: var(--g-kit-black-60, #58585b);
  }

  &__action {
    width: 100%;

    :deep(.btn) {
      height: 40px;
      font-size: 16px;
      font-weight: var(--g-kit-font-weight-bold, 800);
      border-radius: 6px;
    }
  }
}

// Fade transition
.bo-modal-fade-enter-active,
.bo-modal-fade-leave-active {
  transition: opacity 0.2s ease;

  .bo-not-found-modal {
    transition: transform 0.2s ease;
  }
}

.bo-modal-fade-enter-from,
.bo-modal-fade-leave-to {
  opacity: 0;

  .bo-not-found-modal {
    transform: scale(0.95);
  }
}
</style>

