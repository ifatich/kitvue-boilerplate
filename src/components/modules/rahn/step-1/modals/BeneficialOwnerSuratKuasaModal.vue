<script setup lang="ts">
/**
 * @file BeneficialOwnerSuratKuasaModal.vue
 * @description SPRINT Single UI Modal for capturing and uploading Power of Attorney (Surat Kuasa).
 * Conforms 1:1 with Figma frame 11347:158933.
 * Styled with --g-kit-* design tokens and clean inline SVGs.
 */
import { ref } from 'vue'
import { GButton } from '@/components'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'upload', doc: { name: string; size: string }): void
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const previewImage = ref<string | null>(null)
const isCapturing = ref(false)

const closeModal = () => {
  emit('update:modelValue', false)
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1)

    // Create local preview URL
    previewImage.value = URL.createObjectURL(file)

    emit('upload', {
      name: file.name,
      size: `${sizeInMB} MB`,
    })
    closeModal()
  }
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

// Simulation of "Ambil Foto" camera action
const captureSimulatedPhoto = () => {
  isCapturing.value = true
  setTimeout(() => {
    isCapturing.value = false
    emit('upload', {
      name: 'Surat_Kuasa_BO_Dokumen.pdf',
      size: '2.4 MB',
    })
    closeModal()
  }, 500)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="bo-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-surat-kuasa-title"
      @click.self="closeModal"
    >
      <div class="bo-modal-container" data-node-id="11347:158933">
        <!-- Hidden file input for native upload -->
        <input
          ref="fileInputRef"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          class="d-none"
          @change="handleFileSelect"
        />

        <!-- Modal Header -->
        <div class="bo-modal-header" data-node-id="11347:158934">
          <h3 id="modal-surat-kuasa-title" class="bo-modal-title" data-node-id="11347:158935">
            Upload Surat Kuasa
          </h3>
          <button
            type="button"
            class="bo-modal-close-btn"
            aria-label="Tutup modal"
            @click="closeModal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                fill="var(--g-kit-black-80, #252528)"
              />
            </svg>
          </button>
        </div>

        <div class="bo-modal-divider" />

        <!-- Modal Body / Content -->
        <div class="bo-modal-body" data-node-id="11347:158938">
          <div class="bo-camera-viewport" data-node-id="11347:158940">
            <!-- Overlay and frame guide -->
            <div class="bo-camera-overlay">
              <div class="bo-camera-frame" data-node-id="11347:158943">
                <div class="bo-camera-frame__placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
                      fill="var(--g-kit-lime-50, #00ab4e)"
                    />
                  </svg>
                  <span class="bo-camera-frame__text">Posisikan Dokumen Surat Kuasa di Dalam Bingkai</span>
                  <span class="bo-camera-frame__subtext">Pastikan teks terbaca jelas dan tidak buram</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sticky Bottom Action Footer matching Figma 11347:158945 -->
        <div class="bo-modal-footer" data-node-id="11347:158945">
          <GButton
            label="Ambil Ulang Foto"
            type="outline"
            size="md"
            class="flex-fill"
            @click="triggerFileInput"
          />
          <GButton
            label="Ambil Foto"
            type="primary"
            size="md"
            class="flex-fill"
            :disabled="isCapturing"
            @click="captureSimulatedPhoto"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.bo-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1050;
  background-color: rgba(37, 37, 40, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.bo-modal-container {
  width: 100%;
  max-width: 564px;
  background-color: var(--g-kit-white, #ffffff);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 90vh;
}

.bo-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
}

.bo-modal-title {
  margin: 0;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 18px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 26px;
  color: var(--g-kit-black-80, #252528);
}

.bo-modal-close-btn {
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.15s ease;
}

.bo-modal-close-btn:hover {
  background-color: var(--g-kit-black-10, #f8f8f8);
}

.bo-modal-divider {
  width: 100%;
  height: 1px;
  background-color: var(--g-kit-black-20, #eeeeef);
}

.bo-modal-body {
  padding: 16px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  justify-content: center;
}

.bo-camera-viewport {
  width: 100%;
  height: 420px;
  background-color: #1a1a1c;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bo-camera-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.bo-camera-frame {
  width: 100%;
  max-width: 310px;
  height: 380px;
  background-color: #ffffff;
  border-radius: 12px;
  border: 2px dashed var(--g-kit-lime-50, #00ab4e);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.bo-camera-frame__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}

.bo-camera-frame__text {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  color: var(--g-kit-black-80, #252528);
  line-height: 20px;
}

.bo-camera-frame__subtext {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 12px;
  font-weight: var(--g-kit-font-weight-normal, 600);
  color: var(--g-kit-black-60, #58585b);
  line-height: 16px;
}

.bo-modal-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background-color: var(--g-kit-white, #ffffff);
  border-top: 1px solid var(--g-kit-black-20, #eeeeef);
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.04);
}
</style>
