<script setup lang="ts">
/**
 * @file BeneficialOwnerWarningModal.vue
 * @description SPRINT Single UI Modal for validation warnings:
 * 1. "User belum klik Cek Dukcapil" (Figma Node 11347:154072)
 * 2. "Belum klik check box Alamat Sesuai Kartu Identitas" (Figma Node 11944:118940)
 * Adheres strictly to Pegadaian --g-kit-* design tokens and kitvue-plugin rules.
 */
import { GButton } from '@/components'

withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    desc: string
    buttonText?: string
    isMobile?: boolean
  }>(),
  {
    buttonText: 'Mengerti',
    isMobile: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()

const closeModal = () => {
  emit('update:modelValue', false)
  emit('confirm')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="bo-modal-fade">
      <div
        v-if="modelValue"
        class="bo-warning-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-warning-title"
        @click.self="closeModal"
      >
        <div
          class="bo-warning-modal"
          :class="{ 'bo-warning-modal--mobile': isMobile }"
        >
          <!-- Top Row: Close Button (X) -->
          <div class="bo-warning-modal__header">
            <button
              type="button"
              class="bo-warning-modal__close"
              aria-label="Tutup dialog"
              @click="closeModal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6L18 18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          <!-- Illustration: Warning 156px matching Figma 11347:154076 & 11944:118944 -->
          <div class="bo-warning-modal__illustration">
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
          <div class="bo-warning-modal__content">
            <h3 id="modal-warning-title" class="bo-warning-modal__title">
              {{ title }}
            </h3>
            <p class="bo-warning-modal__desc">
              {{ desc }}
            </p>
          </div>

          <!-- CTA Button -->
          <div class="bo-warning-modal__action">
            <GButton
              :label="buttonText"
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
.bo-warning-backdrop {
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

.bo-warning-modal {
  background: var(--g-kit-white, #ffffff);
  border-radius: 12px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.14), 0px 0px 2px rgba(0, 0, 0, 0.08);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &--mobile {
    max-width: 100%;
  }

  &__header {
    display: flex;
    justify-content: flex-end;
    width: 100%;
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

  &__illustration {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: left;
  }

  &__title {
    font-family: 'Nunito Sans', sans-serif;
    font-weight: var(--g-kit-font-weight-extrabold, 800);
    font-size: 20px;
    line-height: 30px;
    color: var(--g-kit-black-80, #252528);
    margin: 0;
  }

  &__desc {
    font-family: 'Nunito Sans', sans-serif;
    font-weight: var(--g-kit-font-weight-semibold, 600);
    font-size: 16px;
    line-height: 24px;
    color: var(--g-kit-black-60, #58585b);
    margin: 0;
  }

  &__action {
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
