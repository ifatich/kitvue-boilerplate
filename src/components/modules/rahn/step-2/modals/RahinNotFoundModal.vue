<script setup lang="ts">
/**
 * @file RahinNotFoundModal.vue
 * @description SPRINT Single UI Modal for Case 3: "Data Rahin Tidak Ditemukan".
 * Conforms 1:1 with Figma Node 11347:162934, 11347:163372, and 11347:165167.
 * Notifies operator when NIK/Paspor is not found and offers CTA to register as new Rahin.
 * Adheres strictly to Pegadaian --g-kit-* design tokens and kitvue-plugin rules.
 */
import { computed } from 'vue'
import { GButton } from '@/components'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    queryIdentity?: string
    identityType?: string
    isMobile?: boolean
  }>(),
  {
    modelValue: true,
    queryIdentity: '',
    identityType: 'ktp',
    isMobile: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'tambah-baru'): void
  (e: 'cancel'): void
}>()

const identityLabel = computed(() => {
  return props.identityType === 'paspor' ? 'Nomor Paspor' : 'Nomor Induk Kependudukan (NIK)'
})

const closeModal = () => {
  emit('update:modelValue', false)
  emit('cancel')
}

const handleTambahBaru = () => {
  emit('update:modelValue', false)
  emit('tambah-baru')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="not-found-modal-fade">
      <div
        v-if="modelValue"
        class="not-found-modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-not-found-title"
        @click.self="closeModal"
      >
        <div
          class="not-found-modal"
          :class="{ 'not-found-modal--mobile': isMobile }"
          data-node-id="11347:173573"
        >
          <!-- Top Row: Close Button (X) -->
          <div class="not-found-modal__header">
            <button
              type="button"
              class="not-found-modal__close"
              aria-label="Tutup dialog"
              @click="closeModal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6L18 18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          <!-- Illustration: Warning Triangle (Figma Node 11347:173573 / Image 3) -->
          <div class="not-found-modal__illustration">
            <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="48" cy="48" r="44" fill="#FEF9F0" />
              <path d="M48 18L82 74H14L48 18Z" fill="#FFAA00" stroke="#FF9900" stroke-width="2" stroke-linejoin="round"/>
              <path d="M48 36V54" stroke="white" stroke-width="4.5" stroke-linecap="round"/>
              <circle cx="48" cy="63" r="3" fill="white"/>
            </svg>
          </div>

          <!-- Content -->
          <div class="not-found-modal__content">
            <h3 id="modal-not-found-title" class="not-found-modal__title">
              Data Rahin Tidak Ditemukan
            </h3>
            <p class="not-found-modal__desc">
              {{ identityLabel }} tidak ditemukan pada data Rahin, silakan buat CIF untuk Rahin baru.
            </p>
          </div>

          <!-- Actions: Primary CTA matching Image 3 -->
          <div class="not-found-modal__actions">
            <GButton
              label="Lanjutkan ke Tambah Rahin"
              type="primary"
              size="md"
              class="w-100 btn-tambah-rahin"
              @click="handleTambahBaru"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.not-found-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1060;
  background-color: rgba(37, 37, 40, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.not-found-modal {
  position: relative;
  width: 100%;
  max-width: 420px;
  background-color: var(--g-kit-white, #ffffff);
  border-radius: 12px;
  padding: 16px 24px 24px;
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
    margin-bottom: 4px;
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
    margin-bottom: 20px;
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
    line-height: 28px;
    color: var(--g-kit-black-80, #252528);
  }

  &__desc {
    margin: 0;
    font-family: 'Nunito Sans', sans-serif;
    font-size: 15px;
    line-height: 22px;
    color: var(--g-kit-black-80, #252528);
  }

  &__subdesc {
    margin: 0;
    font-family: 'Nunito Sans', sans-serif;
    font-size: 13px;
    line-height: 20px;
  }

  &__actions {
    width: 100%;
    display: flex;
    gap: 12px;

    :deep(.btn) {
      height: 40px;
      font-size: 14px;
      font-weight: var(--g-kit-font-weight-bold, 800);
      border-radius: 6px;
    }

    @media (max-width: 480px) {
      flex-direction: column;
    }
  }
}

// Fade transition
.not-found-modal-fade-enter-active,
.not-found-modal-fade-leave-active {
  transition: opacity 0.2s ease;

  .not-found-modal {
    transition: transform 0.2s ease;
  }
}

.not-found-modal-fade-enter-from,
.not-found-modal-fade-leave-to {
  opacity: 0;

  .not-found-modal {
    transform: scale(0.95);
  }
}
</style>
