<script setup lang="ts">
/**
 * @file BeneficialOwnerSection.vue
 * @description SPRINT Single UI Beneficial Owner Search Card matching Figma Node 12920:311792.
 * Uses <NewInputCamera /> for Surat Kuasa file upload, 2-column field grid, and 'Cari' action.
 * Conforms strictly to Pegadaian --g-kit-* design tokens and kitvue-plugin rules.
 */
import { computed } from 'vue'
import { GButton, GDropdown, GInputNIK, GInputText, NewInputCamera } from '@/components'
import {
  BENEFICIAL_OWNER_PRESETS,
  type BeneficialOwnerItem,
  type BeneficialOwnerPreset,
  normalizeIdentityNumber,
} from '../mockBeneficialOwnerData'

export type { BeneficialOwnerItem }

export interface BeneficialOwnerState {
  type: 'diri_sendiri' | 'orang_lain' | ''
  tipeRahin?: 'Perorangan' | 'Badan Usaha' | ''
  identityType: 'ktp' | 'paspor' | ''
  identityNumber: string
  relationship: string
  selectedBO: BeneficialOwnerItem | null
  document: any
  isAlamatSesuaiKtp?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue: BeneficialOwnerState
    showTambah?: boolean
    isMobile?: boolean
    isSearched?: boolean
    relationshipError?: string
  }>(),
  {
    showTambah: false,
    isMobile: false,
    isSearched: false,
    relationshipError: '',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: BeneficialOwnerState): void
  (e: 'search'): void
  (e: 'create-manual'): void
  (e: 'clear-relationship-error'): void
}>()

// Presets for dynamic KTP & Paspor testing
const ktpPresets = computed(() =>
  BENEFICIAL_OWNER_PRESETS.filter((p) => p.identityType === 'ktp'),
)

const pasporPresets = computed(() =>
  BENEFICIAL_OWNER_PRESETS.filter((p) => p.identityType === 'paspor'),
)

const applyPreset = (preset: BeneficialOwnerPreset) => {
  emit('update:modelValue', {
    ...props.modelValue,
    identityNumber: preset.value,
  })
}

// Dropdown options
const ownerTypeOptions = [
  { value: 'diri_sendiri', label: 'Diri Sendiri' },
  { value: 'orang_lain', label: 'Beneficial Owner' },
]

const tipeRahinOptions = [
  { value: 'Perorangan', label: 'Perorangan' },
  { value: 'Badan Usaha', label: 'Badan Usaha' },
]

const identityTypeOptions = [
  { value: 'ktp', label: 'KTP' },
  { value: 'paspor', label: 'Paspor' },
]

// Hubungan options for Paspor Flow (Figma Node 11347:158046)
const hubunganOptions = [
  { value: 'suami-istri', label: 'Suami / Istri' },
  { value: 'orang-tua-anak', label: 'Orang Tua/Anak' },
  { value: 'kerabat-lainnya', label: 'Kerabat / Lainnya' },
]


const localState = computed({
  get: () => props.modelValue,
  set: (val: BeneficialOwnerState) => emit('update:modelValue', val),
})

const updateField = <K extends keyof BeneficialOwnerState>(
  key: K,
  val: BeneficialOwnerState[K],
) => {
  if (key === 'relationship' && val) {
    emit('clear-relationship-error')
  }
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: val,
  })
}

const handleIdentityTypeChange = (val: any) => {
  const newType = (val || '') as 'ktp' | 'paspor' | ''
  emit('update:modelValue', {
    ...props.modelValue,
    identityType: newType,
    identityNumber: '', // Default empty with placeholder
    tipeRahin: props.modelValue.tipeRahin || '',
    relationship: '',   // Empty so user must choose
    document: null,
    selectedBO: null,
  })
  emit('clear-relationship-error')
}

// Search button gating: enabled ONLY when mandatory fields are filled
const isSearchReady = computed(() => {
  if (localState.value.type !== 'orang_lain') return false
  if (!localState.value.tipeRahin || !localState.value.tipeRahin.trim()) return false
  if (!localState.value.identityType) return false
  const cleanId = (localState.value.identityNumber || '').replace(/\s+/g, '')
  if (!cleanId) return false
  return true
})

const handleSearch = () => {
  if (!isSearchReady.value) return
  emit('search')
}
</script>

<template>
  <div class="bo-section-container">
    <!-- MODE 0: DEFAULT / UNSELECTED (Figma Node 11347:148654) -->
    <div v-if="!localState.type" class="bo-unselected-view">
      <div class="bo-grid-item bo-single-col">
        <GDropdown
          :model-value="localState.type"
          label="Tipe Beneficial Owner"
          placeholder="Pilih tipe beneficial owner"
          :items="ownerTypeOptions"
          item-value="value"
          item-text="label"
          :use-bottom-sheet="isMobile"
          @update:model-value="(val: any) => updateField('type', val)"
        />
      </div>
    </div>

    <!-- MODE 1: DIRI SENDIRI -->
    <div
      v-else-if="localState.type === 'diri_sendiri'"
      class="bo-self-view"
    >
      <div class="bo-grid-item bo-single-col mb-3">
        <GDropdown
          :model-value="localState.type"
          label="Tipe Beneficial Owner"
          placeholder="Pilih tipe beneficial owner"
          :items="ownerTypeOptions"
          item-value="value"
          item-text="label"
          :use-bottom-sheet="isMobile"
          @update:model-value="(val: any) => updateField('type', val)"
        />
      </div>
      <div class="bo-self-card">
        <div class="bo-self-card__icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div class="bo-self-card__text">
          <h4 class="bo-self-card__title">Rahin Bertindak Sebagai Beneficial Owner</h4>
          <p class="bo-self-card__desc">
            Nasabah (Rahin) mengajukan pinjaman untuk kepentingan diri sendiri. Tidak diperlukan pengisian data pihak ketiga maupun unggah surat kuasa.
          </p>
        </div>
      </div>
    </div>

    <!-- MODE 2: BENEFICIAL OWNER (ORANG LAIN) - 1:1 matching Figma Node 12920:311792 (KTP) & Node 11347:158046 (Paspor) -->
    <div v-else-if="localState.type === 'orang_lain'" class="bo-info-section">
      <!-- 1. INFORMASI BENEFICIAL OWNER SECTION -->
      <h3 class="bo-section-subtitle">Informasi Beneficial Owner</h3>

      <div class="row g-3">
        <!-- Row 1: Tipe Beneficial Owner (kiri) & Tipe Rahin (kanan) -->
        <div class="col-12 col-md-6">
          <GDropdown
            :model-value="localState.type"
            label="Tipe Beneficial Owner"
            placeholder="Pilih tipe beneficial owner"
            :items="ownerTypeOptions"
            item-value="value"
            item-text="label"
            :use-bottom-sheet="isMobile"
            @update:model-value="(val: any) => updateField('type', val)"
          />
        </div>
        <div class="col-12 col-md-6">
          <GDropdown
            :model-value="localState.tipeRahin || ''"
            label="Tipe Rahin"
            placeholder="Pilih tipe rahin"
            :items="tipeRahinOptions"
            item-value="value"
            item-text="label"
            :use-bottom-sheet="isMobile"
            @update:model-value="(val: any) => updateField('tipeRahin', val)"
          />
        </div>

        <!-- Row 2: Tipe Identitas (kiri) -->
        <div class="col-12 col-md-6">
          <GDropdown
            :model-value="localState.identityType || ''"
            label="Tipe Identitas"
            placeholder="Pilih tipe identitas"
            :items="identityTypeOptions"
            item-value="value"
            item-text="label"
            :use-bottom-sheet="isMobile"
            @update:model-value="handleIdentityTypeChange"
          />
        </div>

        <!-- Row 2 (kanan): Muncul HANYA setelah Tipe Identitas dipilih -->
        <!-- Jika KTP: Nomor Induk Kependudukan (NIK) -->
        <div v-if="localState.identityType === 'ktp'" class="col-12 col-md-6">
          <GInputNIK
            :model-value="localState.identityNumber || ''"
            label="Nomor Induk Kependudukan (NIK)"
            placeholder="3204 1111 1298 0003"
            @update:model-value="(val: any) => updateField('identityNumber', val)"
          />
          <!-- Quick Preset Chips: Memiliki Value vs Tidak -->
          <div class="bo-preset-bar mt-2">
            <span class="bo-preset-label">Contoh:</span>
            <div class="bo-preset-chips">
              <button
                v-for="preset in ktpPresets"
                :key="preset.id"
                type="button"
                class="bo-preset-chip"
                :class="{ 'bo-preset-chip--active': normalizeIdentityNumber(localState.identityNumber) === normalizeIdentityNumber(preset.value) }"
                @click="applyPreset(preset)"
              >
                <span
                  class="bo-preset-dot"
                  :class="preset.hasValue ? 'bo-preset-dot--found' : 'bo-preset-dot--empty'"
                />
                {{ preset.label }}
              </button>
            </div>
          </div>
        </div>
        <!-- Jika Paspor: Nomor Paspor (1:1 matching Figma Node 11347:158046) -->
        <div v-else-if="localState.identityType === 'paspor'" class="col-12 col-md-6">
          <GInputText
            :model-value="localState.identityNumber || ''"
            label="Nomor Paspor"
            placeholder="0033 9714 84"
            @update:model-value="(val: any) => updateField('identityNumber', val)"
          />
          <!-- Quick Preset Chips: Memiliki Value vs Tidak -->
          <div class="bo-preset-bar mt-2">
            <span class="bo-preset-label">Contoh:</span>
            <div class="bo-preset-chips">
              <button
                v-for="preset in pasporPresets"
                :key="preset.id"
                type="button"
                class="bo-preset-chip"
                :class="{ 'bo-preset-chip--active': normalizeIdentityNumber(localState.identityNumber) === normalizeIdentityNumber(preset.value) }"
                @click="applyPreset(preset)"
              >
                <span
                  class="bo-preset-dot"
                  :class="preset.hasValue ? 'bo-preset-dot--found' : 'bo-preset-dot--empty'"
                />
                {{ preset.label }}
              </button>
            </div>
          </div>
        </div>
        <div v-else class="col-12 col-md-6 d-none d-md-block" aria-hidden="true" />

        <!-- KHUSUS KTP: Row 3 Upload Surat Kuasa (Opsional) (kiri) & Kolom kosong (kanan) -->
        <template v-if="localState.identityType === 'ktp'">
          <div class="col-12 col-md-6">
            <label class="form-label-custom">Upload Surat Kuasa (Opsional)</label>
            <div class="new-camera-wrapper">
              <NewInputCamera
                :model-value="localState.document"
                title="Upload Surat Kuasa"
                user-name="Penaksir"
                image-placeholder="image"
                note-text="Foto tampak depan. Maksimal ukuran file 1 MB."
                :use-bottom-sheet="isMobile"
                file-type="image/*"
                @update:model-value="(val: any) => updateField('document', val)"
              />
            </div>
          </div>
          <div class="col-12 col-md-6 d-none d-md-block" aria-hidden="true" />
        </template>
      </div>

      <!-- Action Cari / Tambah Row (right aligned) - Muncul HANYA setelah Tipe Identitas dipilih -->
      <div v-if="localState.identityType" class="bo-action-cari-row">
        <template v-if="showTambah">
          <GButton
            label="Cari"
            type="primary"
            size="md"
            style="width: 185px;"
            :disabled="!isSearchReady"
            @click="handleSearch"
          />
          <GButton
            label="Tambah"
            type="outline"
            size="md"
            style="width: 185px;"
            @click="emit('create-manual')"
          />
        </template>
        <template v-else>
          <GButton
            label="Cari"
            type="outline"
            size="md"
            style="width: 185px;"
            :disabled="!isSearchReady"
            @click="handleSearch"
          />
        </template>
      </div>

      <!-- KHUSUS PASPOR: Data Pendukung Beneficial Owner (Figma Node 11347:158046) -->
      <template v-if="localState.identityType === 'paspor'">
        <div class="section-divider" />

        <h3 class="bo-section-subtitle">Data Pendukung Beneficial Owner</h3>

        <div class="row g-3">
          <!-- Hubungan Dropdown (kiri) - Wajib dipilih saat lanjut ke detail -->
          <div class="col-12 col-md-6">
            <div class="bo-field-with-error">
              <GDropdown
                :model-value="localState.relationship || ''"
                label="Hubungan"
                placeholder="Pilih hubungan"
                :items="hubunganOptions"
                item-value="value"
                item-text="label"
                :use-bottom-sheet="isMobile"
                @update:model-value="(val: any) => updateField('relationship', val)"
              />
              <div v-if="relationshipError" class="field-error-text">
                {{ relationshipError }}
              </div>
            </div>
          </div>

          <!-- Upload Surat Kuasa (Opsional) (kanan) -->
          <div class="col-12 col-md-6">
            <label class="form-label-custom">Upload Surat Kuasa (Opsional)</label>
            <div class="new-camera-wrapper">
              <NewInputCamera
                :model-value="localState.document"
                title="Upload Surat Kuasa"
                user-name="Penaksir"
                image-placeholder="image"
                note-text="Foto tampak depan. Maksimal ukuran file 1 MB."
                :use-bottom-sheet="isMobile"
                file-type="image/*"
                @update:model-value="(val: any) => updateField('document', val)"
              />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bo-section-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.bo-unselected-view {
  min-height: 180px;
  padding-bottom: 24px;
}

.bo-self-view {
  min-height: 180px;
  padding-bottom: 16px;
}

.bo-self-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 20px;
  background-color: var(--g-kit-blue-10, #e8f1f9);
  border: 1px solid var(--g-kit-blue-20, #c8dfef);
  border-radius: 8px;
  color: var(--g-kit-black-80, #252528);

  &__icon {
    flex-shrink: 0;
    color: var(--g-kit-blue-50, #007bff);
    margin-top: 2px;
  }

  &__title {
    margin: 0 0 6px;
    font-family: 'Nunito Sans', sans-serif;
    font-size: var(--g-kit-font-size-omicron, 16px);
    font-weight: var(--g-kit-font-weight-bold, 800);
    color: var(--g-kit-black-80, #252528);
  }

  &__desc {
    margin: 0;
    font-family: 'Nunito Sans', sans-serif;
    font-size: var(--g-kit-font-size-omega, 14px);
    line-height: var(--g-kit-line-height-omega, 20px);
    color: var(--g-kit-black-60, #58585b);
  }
}

.bo-info-section {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 240px;
  padding-bottom: 16px;
}

.bo-section-subtitle {
  margin: 0 0 16px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: var(--g-kit-font-size-omicron, 16px);
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: var(--g-kit-line-height-omicron, 24px);
  color: var(--g-kit-black-80, #252528);
}

.bo-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 24px;
  row-gap: 16px;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.bo-grid-item {
  display: flex;
  flex-direction: column;
}

.bo-single-col {
  width: 100%;
  max-width: 393px;
}

.bo-upload-col {
  max-width: 393px;
}

.form-label-custom {
  display: block;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 20px;
  color: var(--g-kit-black-80, #252528);
  margin-bottom: 4px;
}

.section-divider {
  width: 100%;
  height: 1px;
  background-color: var(--g-kit-black-20, #eeeeef);
  margin: 24px 0;
}

.new-camera-wrapper {
  width: 100%;
  max-width: 100%;

  :deep(.custom-file-upload) {
    width: 100%;
    max-width: 100%;
    height: 160px;
    border: 1px dashed var(--g-kit-black-40, #bbbdc0);
    border-radius: 8px;
    background-color: var(--g-kit-white, #ffffff);
    margin-top: 0;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--g-kit-lime-50, #00ab4e);
    }
  }

  :deep(.note-text) {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 12px;
    color: var(--g-kit-black-50, #939597);
    line-height: 16px;
    margin-top: 6px;
  }
}

.bo-action-cari-row {
  display: flex;
  justify-content: flex-end;
  gap: 24px;
  margin-top: 24px;

  :deep(.btn:disabled),
  :deep(.btn[disabled]) {
    opacity: 0.5 !important;
    cursor: not-allowed !important;
    pointer-events: none !important;
  }

  @media (max-width: 767px) {
    justify-content: stretch;
    flex-direction: column;
    gap: 12px;

    :deep(.btn) {
      width: 100% !important;
    }
  }
}

.bo-preset-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.bo-preset-label {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: var(--g-kit-black-50, #939597);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.bo-preset-chips {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.bo-preset-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  border-radius: 12px;
  border: 1px solid var(--g-kit-black-30, #dedfe0);
  background: var(--g-kit-white, #ffffff);
  font-family: 'Nunito Sans', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: var(--g-kit-black-70, #3e3f42);
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  &:hover {
    background: var(--g-kit-black-10, #f8f8f8);
    border-color: var(--g-kit-black-40, #bbbdc0);
  }

  &--active {
    background: #e8f8ee;
    border-color: var(--g-kit-lime-50, #00ab4e);
    color: var(--g-kit-lime-60, #00883e);
  }
}

.bo-preset-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;

  &--found {
    background-color: var(--g-kit-lime-50, #00ab4e);
  }

  &--empty {
    background-color: var(--g-kit-black-40, #bbbdc0);
  }
}

.bo-field-with-error {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.field-error-text {
  color: var(--g-kit-red-50, #ae1e22);
  font-family: 'Nunito Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  margin-top: 6px;
}
</style>
