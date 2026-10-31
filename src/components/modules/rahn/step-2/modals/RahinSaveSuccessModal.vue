<script setup lang="ts">
/**
 * @file RahinSaveSuccessModal.vue
 * @description SPRINT Single UI Modal: "Data Rahin Berhasil Disimpan".
 * Conforms 1:1 with Figma Node 11752:118844 / Step 2 Success Dialog.
 * Adheres strictly to Pegadaian --g-kit-* design tokens and kitvue-plugin rules.
 */
import { GButton } from '@/components'

withDefaults(
  defineProps<{
    modelValue?: boolean
    isMobile?: boolean
    buttonLabel?: string
    title?: string
    desc?: string
  }>(),
  {
    modelValue: true,
    isMobile: false,
    buttonLabel: 'Lanjutkan ke Data Jaminan',
    title: 'Data Rahin Berhasil Disimpan',
    desc: 'Data Rahin Berhasil Disimpan. Silakan lanjutkan ke data jaminan.',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'continue'): void
}>()

const closeModal = () => {
  emit('update:modelValue', false)
  emit('continue')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="rahin-modal-fade">
      <div
        v-if="modelValue"
        class="rahin-success-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-success-title"
        @click.self="closeModal"
      >
        <div
          class="rahin-success-modal"
          :class="{ 'rahin-success-modal--mobile': isMobile }"
          data-node-id="rahin-save-success-modal"
        >
          <!-- Top Row: Close Button (X) -->
          <div class="rahin-success-modal__header">
            <button
              type="button"
              class="rahin-success-modal__close"
              aria-label="Tutup dialog"
              @click="closeModal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6L18 18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          <!-- Illustration: Green Check 156px celebration matching Figma 11752:118848 -->
          <div class="rahin-success-modal__illustration">
            <svg width="156" height="156" viewBox="0 0 156 156" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="78" cy="78" r="68" fill="#E8F8EE" />
              <circle cx="78" cy="78" r="54" fill="#F4FCF7" />
              <!-- Green Check Circle Badge -->
              <circle cx="78" cy="78" r="38" fill="#00AB4E" />
              <!-- White Check Mark -->
              <path
                d="M66 78.5L74.5 87L90 69"
                stroke="white"
                stroke-width="5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <!-- Decorative Sparkles -->
              <path d="M40 50L44 42L48 50L56 54L48 58L44 66L40 58L32 54L40 50Z" fill="#75D37F" />
              <path d="M116 102L119 96L122 102L128 105L122 108L119 114L116 108L110 105L116 102Z" fill="#75D37F" />
              <circle cx="120" cy="46" r="4" fill="#00883E" />
              <circle cx="36" cy="110" r="4" fill="#00883E" />
            </svg>
          </div>

          <!-- Text Content -->
          <div class="rahin-success-modal__content">
            <h3 id="modal-success-title" class="rahin-success-modal__title">
              {{ title }}
            </h3>
            <p class="rahin-success-modal__desc">
              {{ desc }}
            </p>
          </div>

          <!-- CTA Button -->
          <div class="rahin-success-modal__action">
            <GButton
              :label="buttonLabel"
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
.rahin-success-backdrop {
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

.rahin-success-modal {
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
    font-weight: var(--g-kit-font-weight-bold, 800);
    font-size: 20px;
    line-height: 30px;
    color: var(--g-kit-black-80, #252528);
    margin: 0;
  }

  &__desc {
    font-family: 'Nunito Sans', sans-serif;
    font-weight: var(--g-kit-font-weight-normal, 600);
    font-size: 16px;
    line-height: 24px;
    color: var(--g-kit-black-60, #58585b);
    margin: 0;
  }

  &__action {
    width: 100%;
  }
}

.rahin-modal-fade-enter-active,
.rahin-modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.rahin-modal-fade-enter-from,
.rahin-modal-fade-leave-to {
  opacity: 0;
}
</style>
