<script setup lang="ts">
/**
 * @file RahinCreateCifModal.vue
 * @description SPRINT Single UI Modal: "Buat CIF Syariah dari CIF Konvensional" (Case 1).
 * Conforms 1:1 with Figma Catatan 11347:163680 and Screen 11347:175541.
 * Allows operator to convert/create a new Syariah CIF from an existing Konvensional CIF record.
 * Adheres strictly to Pegadaian --g-kit-* design tokens and kitvue-plugin rules.
 */
import { computed } from 'vue'
import { GAlert, GButton } from '@/components'
import {
  type RahinCifItem,
  convertKonvenToSyariahCif,
} from '../../mockRahinData'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    konvenCif: RahinCifItem | null
    isMobile?: boolean
  }>(),
  {
    modelValue: true,
    isMobile: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', createdCif: RahinCifItem): void
  (e: 'cancel'): void
}>()

const previewSyariah = computed<RahinCifItem | null>(() => {
  if (!props.konvenCif) return null
  return convertKonvenToSyariahCif(props.konvenCif)
})

const closeModal = () => {
  emit('update:modelValue', false)
  emit('cancel')
}

const handleConfirm = () => {
  if (!props.konvenCif || !previewSyariah.value) return
  emit('confirm', previewSyariah.value)
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="cif-modal-fade">
      <div
        v-if="modelValue && konvenCif"
        class="cif-modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-cif-title"
        @click.self="closeModal"
      >
        <div
          class="cif-modal"
          :class="{ 'cif-modal--mobile': isMobile }"
          data-node-id="11347:175541"
        >
          <!-- Top Row: Title & Close Button (X) -->
          <div class="cif-modal__header">
            <h3 id="modal-cif-title" class="cif-modal__title">
              Buat CIF Syariah dari Data Konvensional
            </h3>
            <button
              type="button"
              class="cif-modal__close"
              aria-label="Tutup dialog"
              @click="closeModal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6L18 18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          <div class="cif-modal__divider"></div>

          <!-- Body Content -->
          <div class="cif-modal__body">
            <!-- Notice Infotip -->
            <GAlert
              class="cif-modal__notice mb-3"
              label="Nasabah terdaftar pada sistem Konvensional. Untuk memproses pengajuan Rahn (Syariah), sistem akan menerbitkan CIF Syariah baru dengan menyalin data identitas yang sudah terverifikasi."
              color="light-blue"
              variant="info"
            />

            <!-- Current Konvensional CIF Details Card -->
            <div class="cif-card mb-3">
              <div class="cif-card__heading d-flex align-items-center justify-content-between mb-2">
                <span class="cif-card__title">Data CIF Konvensional Asal</span>
                <span class="badge-status status--konven">Konvensional</span>
              </div>
              <div class="cif-card__grid">
                <div class="cif-info-row">
                  <span class="info-label">Nomor CIF:</span>
                  <span class="info-value font-monospace fw-bold">{{ konvenCif.nomorCif }}</span>
                </div>
                <div class="cif-info-row">
                  <span class="info-label">Nama Rahin:</span>
                  <span class="info-value fw-bold">{{ konvenCif.namaRahin }}</span>
                </div>
                <div class="cif-info-row">
                  <span class="info-label">NIK / No. Paspor:</span>
                  <span class="info-value font-monospace">{{ konvenCif.nomorIdentitasMasked }}</span>
                </div>
                <div class="cif-info-row">
                  <span class="info-label">Tanggal Lahir:</span>
                  <span class="info-value">{{ konvenCif.tanggalLahir }}</span>
                </div>
                <div class="cif-info-row">
                  <span class="info-label">Nama Ibu Kandung:</span>
                  <span class="info-value">{{ konvenCif.namaIbuKandung }}</span>
                </div>
                <div class="cif-info-row">
                  <span class="info-label">Cabang Pembuka:</span>
                  <span class="info-value">{{ konvenCif.cabangPembuka }}</span>
                </div>
                <div class="cif-info-row cif-info-row--full">
                  <span class="info-label">Alamat Rumah:</span>
                  <span class="info-value">{{ konvenCif.alamatRumah }}</span>
                </div>
              </div>
            </div>

            <!-- New Syariah CIF Preview Box -->
            <div v-if="previewSyariah" class="cif-preview-box p-3 mb-3">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <span class="preview-title">Pratinjau CIF Syariah yang Akan Dibuat:</span>
                <span class="badge-status status--syariah">Syariah</span>
              </div>
              <div class="row g-2">
                <div class="col-sm-6">
                  <div class="preview-item">
                    <span class="preview-label">Nomor CIF Baru:</span>
                    <span class="preview-val font-monospace text-success fw-bold">{{ previewSyariah.nomorCif }}</span>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="preview-item">
                    <span class="preview-label">Cabang Pembuka Syariah:</span>
                    <span class="preview-val fw-bold">{{ previewSyariah.cabangPembuka }}</span>
                  </div>
                </div>
              </div>
            </div>

            <p class="cif-modal__confirmation-text text-muted small mb-0">
              Dengan mengklik tombol di bawah, CIF Syariah baru akan otomatis dibuat dan dipilih untuk pengajuan Rahn nasabah ini.
            </p>
          </div>

          <div class="cif-modal__divider"></div>

          <!-- Actions Footer -->
          <div class="cif-modal__actions">
            <GButton
              label="Batal"
              type="outline"
              size="md"
              class="btn-cancel"
              @click="closeModal"
            />
            <GButton
              label="Buat CIF Syariah"
              type="primary"
              size="md"
              class="btn-confirm"
              @click="handleConfirm"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.cif-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1060;
  background-color: rgba(37, 37, 40, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.cif-modal {
  position: relative;
  width: 100%;
  max-width: 580px;
  background-color: var(--g-kit-white, #ffffff);
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &--mobile {
    width: 100%;
    max-width: 100%;
    margin-top: auto;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  &__header {
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    margin: 0;
    font-family: 'Nunito Sans', sans-serif;
    font-size: var(--g-kit-font-size-kappa, 18px);
    font-weight: var(--g-kit-font-weight-bold, 800);
    color: var(--g-kit-black-80, #252528);
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

  &__divider {
    height: 1px;
    background-color: var(--g-kit-black-20, #eeeeef);
    width: 100%;
  }

  &__body {
    padding: 20px;
    max-height: 70vh;
    overflow-y: auto;
  }

  &__actions {
    padding: 16px 20px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    background-color: var(--g-kit-black-10, #f8f8f8);

    .btn-cancel,
    .btn-confirm {
      min-width: 140px;
      height: 40px;
      font-weight: var(--g-kit-font-weight-bold, 800);
      border-radius: 6px;
    }
  }
}

.cif-card {
  border: 1px solid var(--g-kit-black-20, #eeeeef);
  border-radius: 8px;
  padding: 14px 16px;
  background-color: var(--g-kit-white, #ffffff);

  &__title {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 14px;
    font-weight: var(--g-kit-font-weight-bold, 800);
    color: var(--g-kit-black-80, #252528);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px 16px;

    @media (max-width: 575px) {
      grid-template-columns: 1fr;
    }
  }
}

.cif-info-row {
  display: flex;
  flex-direction: column;
  gap: 2px;

  &--full {
    grid-column: 1 / -1;
  }

  .info-label {
    font-size: 12px;
    color: var(--g-kit-black-60, #58585b);
  }

  .info-value {
    font-size: 14px;
    color: var(--g-kit-black-80, #252528);
  }
}

.cif-preview-box {
  background-color: #e6f6ea; // var(--g-kit-lime-10)
  border: 1px solid #c2ebcb;
  border-radius: 8px;

  .preview-title {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 13px;
    font-weight: var(--g-kit-font-weight-bold, 800);
    color: #00662e;
  }

  .preview-item {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .preview-label {
      font-size: 12px;
      color: #004d43;
    }

    .preview-val {
      font-size: 14px;
    }
  }
}

.badge-status {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;

  &.status--syariah {
    background-color: #e6f6ea;
    color: #00883e;
    border: 1px solid #00ab4e;
  }

  &.status--konven {
    background-color: var(--g-kit-black-20, #eeeeef);
    color: var(--g-kit-black-60, #58585b);
    border: 1px solid var(--g-kit-black-40, #bbbdc0);
  }
}

// Fade transition
.cif-modal-fade-enter-active,
.cif-modal-fade-leave-active {
  transition: opacity 0.2s ease;

  .cif-modal {
    transition: transform 0.2s ease;
  }
}

.cif-modal-fade-enter-from,
.cif-modal-fade-leave-to {
  opacity: 0;

  .cif-modal {
    transform: scale(0.95);
  }
}
</style>
