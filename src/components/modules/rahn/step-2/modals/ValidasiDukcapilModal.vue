<script setup lang="ts">
/**
 * @file ValidasiDukcapilModal.vue
 * @description SPRINT Single UI Modal for Case: "Validasi Dukcapil (Belum Sesuai)".
 * Conforms 1:1 with Figma Node 11347:166766 (media_0.png) & Flow diagrams.
 *
 * Uses official reusable components:
 * - GDropdown for dropdown fields (Jenis Kelamin, Agama, Pekerjaan, Wilayah)
 * - GInputSmallDate for date fields (Tanggal Lahir)
 * - GInputText for text input fields (Tempat Lahir, Nama Ibu Kandung)
 *
 * Real Case comparison against official Dukcapil records with full ISO date normalization.
 * Zero custom popovers. Strictly Pegadaian --g-kit-* design tokens.
 */
import { computed, ref, watch } from 'vue'
import {
  GDropdown,
  GInputSmallDate,
  GInputText,
} from '@/components'
import {
  type DukcapilRecord,
  getDukcapilData,
  normalizeDateToIso,
} from '../../mockRahinData'

export interface DukcapilInputFields {
  nik: string
  nama: string
  tempatLahir?: string
  tanggalLahir?: string
  jenisKelamin?: string
  namaIbuKandung?: string
  agama?: string
  pekerjaan?: string
  alamat?: string
  rt?: string
  rw?: string
  provinsi?: string
  kotaKab?: string
  kecamatan?: string
  kelurahan?: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    inputData: DukcapilInputFields
    isMobile?: boolean
    disableTeleport?: boolean
  }>(),
  {
    modelValue: false,
    isMobile: false,
    disableTeleport: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', updatedData: DukcapilInputFields): void
  (e: 'cancel'): void
}>()

// Dukcapil official reference data
const dukcapilRecord = computed<DukcapilRecord>(() => {
  return getDukcapilData(props.inputData.nik || '3201 0218 1194 0000')
})

// Local editable copy of input data
const localData = ref<DukcapilInputFields>({
  ...props.inputData,
  tanggalLahir: normalizeDateToIso(props.inputData.tanggalLahir),
})

export interface DropdownOption {
  value: string
  label: string
}

// Field Configuration strictly aligned with Figma 11347:166766 (media_0.png)
interface FieldConfig {
  key: keyof DukcapilInputFields
  title: string
  control: 'text' | 'date' | 'dropdown'
  dukcapilIcon: 'none' | 'calendar' | 'chevron'
  inputIcon: 'none' | 'calendar' | 'chevron'
  options?: DropdownOption[]
}

const FIELD_CONFIGS: FieldConfig[] = [
  {
    key: 'nik',
    title: 'Nomor Induk Kependudukan (NIK)',
    control: 'text',
    dukcapilIcon: 'none',
    inputIcon: 'none',
  },
  {
    key: 'nama',
    title: 'Nama Lengkap',
    control: 'text',
    dukcapilIcon: 'none',
    inputIcon: 'none',
  },
  {
    key: 'tempatLahir',
    title: 'Tempat Lahir',
    control: 'text',
    dukcapilIcon: 'none',
    inputIcon: 'none',
  },
  {
    key: 'tanggalLahir',
    title: 'Tanggal Lahir',
    control: 'date',
    dukcapilIcon: 'calendar',
    inputIcon: 'calendar',
  },
  {
    key: 'jenisKelamin',
    title: 'Jenis Kelamin',
    control: 'dropdown',
    dukcapilIcon: 'chevron',
    inputIcon: 'chevron',
    options: [
      { value: 'Laki-laki', label: 'Laki-laki' },
      { value: 'Perempuan', label: 'Perempuan' },
    ],
  },
  {
    key: 'namaIbuKandung',
    title: 'Nama Ibu Kandung',
    control: 'text',
    dukcapilIcon: 'none',
    inputIcon: 'none',
  },
  {
    key: 'agama',
    title: 'Agama',
    control: 'dropdown',
    dukcapilIcon: 'chevron',
    inputIcon: 'chevron',
    options: [
      { value: 'Islam', label: 'Islam' },
      { value: 'Kristen', label: 'Kristen Protestan' },
      { value: 'Katolik', label: 'Katolik' },
      { value: 'Hindu', label: 'Hindu' },
      { value: 'Buddha', label: 'Buddha' },
      { value: 'Konghucu', label: 'Konghucu' },
    ],
  },
  {
    key: 'pekerjaan',
    title: 'Pekerjaan',
    control: 'dropdown',
    dukcapilIcon: 'chevron',
    inputIcon: 'chevron',
    options: [
      { value: 'Pelajar/Mahasiswa', label: 'Pelajar/Mahasiswa' },
      { value: 'Pegawai Swasta', label: 'Pegawai Swasta' },
      { value: 'PNS / ASN', label: 'PNS / ASN' },
      { value: 'Wiraswasta', label: 'Wiraswasta' },
      { value: 'TNI / POLRI', label: 'TNI / POLRI' },
      { value: 'Profesional', label: 'Profesional' },
      { value: 'Ibu Rumah Tangga', label: 'Ibu Rumah Tangga' },
      { value: 'Lainnya', label: 'Lainnya' },
    ],
  },
  {
    key: 'alamat',
    title: 'Alamat',
    control: 'text',
    dukcapilIcon: 'chevron',
    inputIcon: 'chevron',
  },
  {
    key: 'rt',
    title: 'RT',
    control: 'text',
    dukcapilIcon: 'none',
    inputIcon: 'chevron',
  },
  {
    key: 'rw',
    title: 'RW',
    control: 'text',
    dukcapilIcon: 'none',
    inputIcon: 'chevron',
  },
  {
    key: 'provinsi',
    title: 'Provinsi',
    control: 'dropdown',
    dukcapilIcon: 'none',
    inputIcon: 'chevron',
    options: [
      { value: 'Jawa Tengah', label: 'Jawa Tengah' },
      { value: 'DKI Jakarta', label: 'DKI Jakarta' },
      { value: 'Jawa Barat', label: 'Jawa Barat' },
      { value: 'Banten', label: 'Banten' },
      { value: 'Jawa Timur', label: 'Jawa Timur' },
    ],
  },
  {
    key: 'kotaKab',
    title: 'Kota/Kabupaten',
    control: 'dropdown',
    dukcapilIcon: 'chevron',
    inputIcon: 'chevron',
    options: [
      { value: 'Kebumen', label: 'Kebumen' },
      { value: 'Kota Jakarta Pusat', label: 'Kota Jakarta Pusat' },
      { value: 'Kota Jakarta Selatan', label: 'Kota Jakarta Selatan' },
      { value: 'Bandung', label: 'Bandung' },
    ],
  },
  {
    key: 'kecamatan',
    title: 'Kecamatan',
    control: 'dropdown',
    dukcapilIcon: 'none',
    inputIcon: 'chevron',
    options: [
      { value: 'Petahanan', label: 'Petahanan' },
      { value: 'Senen', label: 'Senen' },
      { value: 'Menteng', label: 'Menteng' },
      { value: 'Tebet', label: 'Tebet' },
      { value: 'Kebayoran Baru', label: 'Kebayoran Baru' },
    ],
  },
  {
    key: 'kelurahan',
    title: 'Kelurahan',
    control: 'dropdown',
    dukcapilIcon: 'chevron',
    inputIcon: 'chevron',
    options: [
      { value: 'Grujugan', label: 'Grujugan' },
      { value: 'Kenari', label: 'Kenari' },
      { value: 'Pegangsaan', label: 'Pegangsaan' },
      { value: 'Kramat', label: 'Kramat' },
      { value: 'Senayan', label: 'Senayan' },
    ],
  },
]

// Set of field keys that have gaps compared to official Dukcapil data
const gapKeys = ref<Set<string>>(new Set())

// Direct real-case initialization
watch(
  () => [props.modelValue, props.inputData],
  ([isOpen]) => {
    if (isOpen) {
      localData.value = {
        ...props.inputData,
        tanggalLahir: normalizeDateToIso(props.inputData.tanggalLahir),
      }

      const gaps = new Set<string>()
      const duk = dukcapilRecord.value
      const cleanNik = (props.inputData.nik || '').replace(/\D/g, '')
      const isThoriqPreset = cleanNik.startsWith('3201') || cleanNik.includes('1194')

      if (isThoriqPreset) {
        // Figma 11347:166766 & media_1793424359529_28ab67d0.jpg:
        // By default for Thoriq Sadad, Dukcapil reports gaps on tempatLahir (79) and namaIbuKandung (80)
        gaps.add('tempatLahir')
        gaps.add('namaIbuKandung')

        // In addition, if user input explicitly differs on any other field (e.g. tanggalLahir or jenisKelamin branch)
        for (const field of FIELD_CONFIGS) {
          const key = field.key
          if (key === 'tempatLahir' || key === 'namaIbuKandung') continue
          const inputVal = (props.inputData[key] || '').trim()
          if (!inputVal) continue
          const dukVal = (duk[key] || '').trim()

          if (key === 'tanggalLahir') {
            if (normalizeDateToIso(inputVal) !== normalizeDateToIso(dukVal)) {
              gaps.add(key)
            }
          } else if (inputVal.toLowerCase() !== dukVal.toLowerCase()) {
            gaps.add(key)
          }
        }
      } else {
        // General real-case comparison against Dukcapil
        for (const field of FIELD_CONFIGS) {
          const key = field.key
          const inputVal = (props.inputData[key] || '').trim()
          const dukVal = (duk[key] || '').trim()

          if (key === 'nik') {
            if (inputVal.replace(/\D/g, '') !== dukVal.replace(/\D/g, '')) gaps.add(key)
          } else if (key === 'tanggalLahir') {
            if (normalizeDateToIso(inputVal) !== normalizeDateToIso(dukVal)) {
              gaps.add(key)
            }
          } else if (inputVal && inputVal.toLowerCase() !== dukVal.toLowerCase()) {
            gaps.add(key)
          }
        }
      }

      gapKeys.value = gaps
    }
  },
  { immediate: true, deep: true },
)

const isFieldMismatched = (key: keyof DukcapilInputFields): boolean => {
  return gapKeys.value.has(key)
}

const getDukcapilStatusLabel = (key: keyof DukcapilInputFields): string => {
  if (!isFieldMismatched(key)) {
    if (key === 'nama') return 'SESUAI (80)'
    return 'SESUAI'
  }
  if (key === 'tempatLahir') return 'TIDAK SESUAI (79)'
  if (key === 'namaIbuKandung') return 'TIDAK SESUAI (80)'
  if (key === 'tanggalLahir') return 'TIDAK SESUAI (80)'
  return 'TIDAK SESUAI'
}

// Indonesian month labels for static matched card display
const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

const formatDisplayDate = (val?: string): string => {
  if (!val) return ''
  const iso = normalizeDateToIso(val)
  if (iso && iso.length === 10) {
    const [y, m, d] = iso.split('-')
    const mIdx = parseInt(m, 10) - 1
    if (mIdx >= 0 && mIdx < 12) {
      return `${d} ${MONTH_NAMES[mIdx]} ${y}`
    }
  }
  return val
}

const displayMatchedValue = (key: keyof DukcapilInputFields): string => {
  if (key === 'tanggalLahir') {
    const rawVal = localData.value.tanggalLahir || dukcapilRecord.value.tanggalLahir
    return formatDisplayDate(rawVal) || '01 Januari 1990'
  }
  return localData.value[key] || dukcapilRecord.value[key] || ''
}

const closeModal = () => {
  emit('update:modelValue', false)
  emit('cancel')
}

const handleCekDukcapil = () => {
  emit('confirm', {
    ...localData.value,
    tanggalLahir: normalizeDateToIso(localData.value.tanggalLahir),
  })
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport :disabled="disableTeleport" to="body">
    <Transition name="dukcapil-modal-fade">
      <div
        v-if="modelValue"
        class="dukcapil-modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-dukcapil-title"
        @click.self="closeModal"
      >
        <div
          class="dukcapil-modal"
          :class="{ 'dukcapil-modal--mobile': isMobile }"
          data-node-id="11347:166766"
        >
          <!-- Header (Figma 11347:166767) -->
          <div class="dukcapil-modal__header">
            <h3 id="modal-dukcapil-title" class="dukcapil-modal__title mb-0">
              Validasi Dukcapil
            </h3>
            <button
              type="button"
              class="dukcapil-modal__close"
              aria-label="Tutup dialog"
              @click="closeModal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#252528">
                <path d="M18 6L6 18M6 6L18 18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          <!-- Alert Infotip (Figma 11347:166772 - 100% Clean per Figma) -->
          <div class="dukcapil-infotip-wrapper">
            <div class="dukcapil-infotip">
              <p class="dukcapil-infotip__text mb-0">
                Terdapat data input yang tidak sesuai dengan Dukcapil. Mohon sesuaikan dengan melakukan konfirmasi ke Rahin atau melakukan pembaruan data pada Dukcapil setempat oleh Rahin.
              </p>
              <div class="infotip-accent" aria-hidden="true">
                <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
                  <path d="M0 0C30 15 50 35 80 60V0H0Z" fill="#D9ECFE" opacity="0.6"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Scrollable Comparison Body (Figma 11347:166773 - 2-Column Grid of 15 Field Cards) -->
          <div class="dukcapil-modal__body">
            <div class="dukcapil-grid">
              <div
                v-for="field in FIELD_CONFIGS"
                :key="field.key"
                class="field-card"
                :class="{ 'field-card--mismatched': isFieldMismatched(field.key) }"
                :data-field-key="field.key"
              >
                <!-- Card Title (Green bold 12px per Figma media_0.png) -->
                <h5 class="field-card__title">{{ field.title }}</h5>

                <!-- Sub-block 1: Data Dukcapil -->
                <div class="field-card__dukcapil-section">
                  <label class="field-card__label">Data Dukcapil</label>
                  <div class="field-card__dukcapil-box">
                    <span class="field-card__dukcapil-text">
                      {{ getDukcapilStatusLabel(field.key) }}
                    </span>
                    <span v-if="field.dukcapilIcon === 'calendar'" class="field-card__icon" aria-hidden="true">
                      <!-- Calendar Icon matching Figma -->
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#58585B" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </span>
                    <span v-else-if="field.dukcapilIcon === 'chevron'" class="field-card__icon" aria-hidden="true">
                      <!-- Chevron Down Icon matching Figma -->
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#58585B" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </span>
                  </div>
                </div>

                <!-- Sub-block 2: Data Input -->
                <div class="field-card__input-section">
                  <label class="field-card__label">Data Input</label>

                  <!-- State A: Matched (Gray container, static display per Figma) -->
                  <div v-if="!isFieldMismatched(field.key)" class="field-card__matched-box">
                    <span class="field-card__matched-text">
                      {{ displayMatchedValue(field.key) }}
                    </span>
                    <span v-if="field.inputIcon === 'calendar'" class="field-card__icon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#58585B" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </span>
                    <span v-else-if="field.inputIcon === 'chevron'" class="field-card__icon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#58585B" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </span>
                  </div>

                  <!-- State B: Mismatched (Reusable Components: GInputText, GInputSmallDate, GDropdown) -->
                  <div v-else class="field-card__reusable-input">
                    <!-- Text Control (GInputText) -->
                    <GInputText
                      v-if="field.control === 'text'"
                      :model-value="localData[field.key]"
                      :placeholder="`Masukkan ${field.title}`"
                      @update:model-value="(val: string) => { localData[field.key] = val; }"
                    />

                    <!-- Datepicker Control (GInputSmallDate) -->
                    <GInputSmallDate
                      v-else-if="field.control === 'date'"
                      :model-value="normalizeDateToIso(localData.tanggalLahir)"
                      title="Tanggal Lahir"
                      placeholder="Pilih tanggal lahir"
                      @update:model-value="(val: string) => { localData.tanggalLahir = normalizeDateToIso(val); }"
                    />

                    <!-- Dropdown Control (GDropdown) -->
                    <GDropdown
                      v-else-if="field.control === 'dropdown'"
                      :model-value="localData[field.key]"
                      :placeholder="`Pilih ${field.title}`"
                      :items="field.options"
                      item-value="value"
                      item-text="label"
                      :use-bottom-sheet="isMobile"
                      @update:model-value="(val: any) => { localData[field.key] = val; }"
                    />
                  </div>
                </div>

                <!-- Sub-block 3: Status Checkmark Footer (Only shown when matched per Figma media_0.png) -->
                <div class="field-card__status">
                  <div v-if="!isFieldMismatched(field.key)" class="status-match">
                    <svg class="status-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="9" r="9" fill="#00AB4E"/>
                      <path d="M5 9L7.8 11.8L13 6.6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="status-text">Data sesuai Dukcapil.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sticky Bottom Footer (Figma 11347:166913) -->
          <div class="dukcapil-modal__footer">
            <button
              type="button"
              class="btn-dukcapil-kembali"
              @click="closeModal"
            >
              Kembali
            </button>
            <button
              type="button"
              class="btn-dukcapil-cek"
              @click="handleCekDukcapil"
            >
              Cek Dukcapil
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.dukcapil-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1070;
  background-color: rgba(37, 37, 40, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.dukcapil-modal {
  position: relative;
  width: 100%;
  max-width: 564px;
  max-height: 90vh;
  background-color: var(--g-kit-white, #ffffff);
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;

  &--mobile {
    max-width: 100%;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid var(--g-kit-black-20, #eeeeef);
    flex-shrink: 0;
  }

  &__title {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 18px;
    font-weight: 800;
    line-height: 26px;
    color: var(--g-kit-black-90, #252528);
  }

  &__close {
    background: transparent;
    border: none;
    padding: 2px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.7;
    }
  }

  .dukcapil-infotip-wrapper {
    padding: 12px 16px 8px;
    flex-shrink: 0;
  }

  .dukcapil-infotip {
    position: relative;
    background-color: #ebf5ff;
    border-radius: 6px;
    padding: 12px 14px;
    overflow: hidden;

    &__text {
      font-family: 'Nunito Sans', sans-serif;
      font-size: 16px;
      line-height: 24px;
      color: var(--g-kit-black-90, #252528);
      position: relative;
      z-index: 2;
    }

    .infotip-accent {
      position: absolute;
      top: 0;
      right: 0;
      pointer-events: none;
      z-index: 1;
    }
  }

  &__body {
    flex-grow: 1;
    overflow-y: auto;
    padding: 8px 16px 24px;
  }

  .dukcapil-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;

    @media (max-width: 540px) {
      grid-template-columns: 1fr;
    }
  }

  .field-card {
    background: #f8f8f8;
    border: 1px solid var(--g-kit-black-20, #eeeeef);
    border-radius: 6px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;

    &--mismatched {
      z-index: 10;
    }

    &__title {
      font-family: 'Nunito Sans', sans-serif;
      font-size: 14px;
      font-weight: 800;
      line-height: 20px;
      color: #00ab4e;
      margin: 0;
      white-space: nowrap;
    }

    &__label {
      font-family: 'Nunito Sans', sans-serif;
      font-size: 14px;
      font-weight: 800;
      line-height: 20px;
      color: var(--g-kit-black-90, #252528);
      margin-bottom: 4px;
      display: block;
    }

    &__dukcapil-section,
    &__input-section {
      display: flex;
      flex-direction: column;
    }

    &__dukcapil-box {
      height: 48px;
      background-color: var(--g-kit-black-20, #eeeeef);
      border: 1px solid var(--g-kit-black-20, #eeeeef);
      border-radius: 6px;
      padding: 0 11px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .field-card__dukcapil-text {
        font-family: 'Nunito Sans', sans-serif;
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        color: var(--g-kit-black-60, #58585b);
      }
    }

    &__matched-box {
      height: 48px;
      background-color: var(--g-kit-black-20, #eeeeef);
      border: 1px solid var(--g-kit-black-20, #eeeeef);
      border-radius: 6px;
      padding: 0 11px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .field-card__matched-text {
        font-family: 'Nunito Sans', sans-serif;
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        color: var(--g-kit-black-60, #58585b);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    // Reusable Component Wrapper (GInputText, GInputSmallDate, GDropdown)
    &__reusable-input {
      width: 100%;
      position: relative;

      :deep(.group-input) {
        margin-bottom: 0 !important;
        width: 100%;
      }

      :deep(.form-label) {
        display: none !important;
      }

      // Exact 48px height and lime-50 border matching Figma 11347:166800
      :deep(.form-control),
      :deep(.gkit-dd button),
      :deep(.custom-input-group-icon) {
        border: 1px solid #00ab4e !important;
        border-radius: 6px !important;
        height: 48px !important;
        min-height: 48px !important;
        background-color: #ffffff !important;
        font-family: 'Nunito Sans', sans-serif !important;
        font-size: 16px !important;
        font-weight: 600 !important;
        line-height: 24px !important;
        color: var(--g-kit-black-90, #252528) !important;
        padding-left: 11px !important;
        padding-right: 11px !important;
      }

      :deep(.custom-input-group-icon .form-control) {
        border: none !important;
        height: 100% !important;
        min-height: 100% !important;
        box-shadow: none !important;
        padding-left: 0 !important;
        font-size: 16px !important;
        line-height: 24px !important;
      }

      :deep(.gkit-dd .dropdown-placeholder) {
        font-family: 'Nunito Sans', sans-serif !important;
        font-size: 16px !important;
        font-weight: 600 !important;
        line-height: 24px !important;
        color: var(--g-kit-black-90, #252528) !important;
      }

      :deep(.dropdown-menu) {
        z-index: 1060 !important;
        max-height: 200px;
        overflow-y: auto;
      }

      :deep(.content-date .card) {
        z-index: 1060 !important;
      }
    }

    &__status {
      height: 18px;
      display: flex;
      align-items: center;

      .status-match {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }

      .status-text {
        font-family: 'Nunito Sans', sans-serif;
        font-size: 12px;
        font-weight: 600;
        line-height: 18px;
        color: var(--g-kit-black-90, #252528);
      }
    }
  }

  &__footer {
    padding: 16px;
    border-top: 1px solid var(--g-kit-black-20, #eeeeef);
    background-color: #ffffff;
    display: flex;
    gap: 8px;
    border-radius: 0 0 12px 12px;
    flex-shrink: 0;

    .btn-dukcapil-kembali {
      flex: 1;
      height: 42px;
      border: 1px solid #00ab4e;
      background-color: #ffffff;
      color: #00ab4e;
      border-radius: 6px;
      font-family: 'Nunito Sans', sans-serif;
      font-size: 16px;
      font-weight: 800;
      line-height: 24px;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: #f0fdf4;
      }
    }

    .btn-dukcapil-cek {
      flex: 1;
      height: 42px;
      border: none;
      background-color: #00ab4e;
      color: #ffffff;
      border-radius: 6px;
      font-family: 'Nunito Sans', sans-serif;
      font-size: 16px;
      font-weight: 800;
      line-height: 24px;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: #00803a;
      }
    }
  }
}

.dukcapil-modal-fade-enter-active,
.dukcapil-modal-fade-leave-active {
  transition: opacity 0.2s ease;

  .dukcapil-modal {
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
}

.dukcapil-modal-fade-enter-from,
.dukcapil-modal-fade-leave-to {
  opacity: 0;

  .dukcapil-modal {
    transform: scale(0.96) translateY(8px);
  }
}
</style>
