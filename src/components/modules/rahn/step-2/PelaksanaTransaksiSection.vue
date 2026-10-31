<script setup lang="ts">
/**
 * @file PelaksanaTransaksiSection.vue
 * @description Single unified component for "Data Pelaksana Transaksi" (Figma Node 11347:172884 in 11347:172827).
 * Conforms 1:1 with Figma specifications:
 * - 2-Column layout with 7 rows (14 fields total)
 * - Row 1: Jenis Identitas | Nomor Identitas
 * - Row 2: Nama Pelaksana | Nama Ibu Kandung
 * - Row 3: Tempat Lahir | Tanggal Lahir + Usia
 * - Row 4: Jenis Kelamin | Agama
 * - Row 5: Pekerjaan | Masa Berlaku Identitas
 * - Row 6: Tanggal Berlaku Sampai | Kewarganegaraan
 * - Row 7: Jabatan | Nomor Handphone
 * Strictly adheres to Pegadaian --g-kit-* design tokens and kitvue-plugin rules (Zero Tailwind CSS).
 */
import { computed, ref, watch } from 'vue'
import {
  GDropdown,
  GInputNIK,
  GInputSmallDate,
  GInputText,
} from '@/components'
import ModuleSectionCard from '@/components/shared/card/ModuleSectionCard.vue'
import {
  type MasaBerlakuType,
  type PelaksanaIdentityType,
  type PelaksanaTransaksiState,
  PELAKSANA_KTP_PRESET,
  PELAKSANA_PASPOR_PRESET,
  calculateAge,
  createDefaultPelaksanaState,
} from '../mockRahinData'

const props = withDefaults(
  defineProps<{
    modelValue?: PelaksanaTransaksiState
    isMobile?: boolean
    isOpen?: boolean
    collapsible?: boolean
    isReadOnly?: boolean
  }>(),
  {
    modelValue: () => createDefaultPelaksanaState(),
    isMobile: false,
    isOpen: true,
    collapsible: true,
    isReadOnly: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: PelaksanaTransaksiState): void
}>()

// Internal reactive state cloned from modelValue
const state = ref<PelaksanaTransaksiState>({
  ...createDefaultPelaksanaState(),
  ...props.modelValue,
})

// Active Figma Node ID tracking
const activeFigmaNodeId = computed(() => {
  return state.value.identityType === 'ktp' ? '11347:172827' : '11347:170073'
})

// Sync internal figmaNodeId
watch(
  activeFigmaNodeId,
  (nodeId) => {
    state.value.figmaNodeId = nodeId
  },
  { immediate: true },
)

// Synchronize external modelValue changes
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      state.value = {
        ...state.value,
        ...newVal,
      }
    }
  },
  { deep: true },
)

// Emit updates upstream
const syncUpstream = () => {
  emit('update:modelValue', {
    ...state.value,
    figmaNodeId: activeFigmaNodeId.value,
  })
}

// Handle Identity Type Switch (KTP vs Paspor)
const handleIdentityTypeChange = (newType: string) => {
  const type = newType as PelaksanaIdentityType
  state.value.identityType = type

  // If KTP, lock kewarganegaraan to WNI. If Paspor, default WNI/WNA
  if (type === 'ktp') {
    state.value.kewarganegaraan = 'WNI'
    state.value.figmaNodeId = '11347:172827'
  } else {
    state.value.figmaNodeId = '11347:170073'
    if (!state.value.kewarganegaraan) {
      state.value.kewarganegaraan = 'WNI'
    }
  }

  syncUpstream()
}

// Handle Masa Berlaku Type Switch (Seumur Hidup vs Sampai Dengan)
const handleMasaBerlakuTypeChange = (val: string) => {
  state.value.masaBerlakuType = val as MasaBerlakuType
  if (val === 'seumur_hidup') {
    state.value.tanggalBerlakuSampai = ''
  }
  syncUpstream()
}

// Quick Preset Loading for tests and parent orchestration
const applyKtpPreset = () => {
  state.value = {
    ...PELAKSANA_KTP_PRESET,
    isActive: true,
  }
  syncUpstream()
}

const applyPasporPreset = () => {
  state.value = {
    ...PELAKSANA_PASPOR_PRESET,
    isActive: true,
  }
  syncUpstream()
}

// Dynamic age display computed from Tanggal Lahir
const dynamicAge = computed(() => {
  return calculateAge(state.value.tanggalLahir)
})

// Dropdown Items matching Figma
const identityTypeOptions = [
  { value: 'ktp', label: 'KTP' },
  { value: 'paspor', label: 'Paspor' },
]

const kewarganegaraanOptions = [
  { value: 'WNI', label: 'WNI' },
  { value: 'WNA', label: 'WNA' },
]

const jenisKelaminOptions = [
  { value: 'Laki-laki', label: 'Laki-laki' },
  { value: 'Perempuan', label: 'Perempuan' },
]

const agamaOptions = [
  { value: 'Islam', label: 'Islam' },
  { value: 'Kristen', label: 'Kristen' },
  { value: 'Katolik', label: 'Katolik' },
  { value: 'Hindu', label: 'Hindu' },
  { value: 'Buddha', label: 'Buddha' },
  { value: 'Konghucu', label: 'Konghucu' },
]

const pekerjaanOptions = [
  { value: 'Karyawan Swasta', label: 'Karyawan Swasta' },
  { value: 'PNS / ASN', label: 'PNS / ASN' },
  { value: 'Wiraswasta', label: 'Wiraswasta' },
  { value: 'Tenaga Ahli', label: 'Tenaga Ahli' },
  { value: 'Profesional', label: 'Profesional' },
  { value: 'Lainnya', label: 'Lainnya' },
]

const masaBerlakuOptions = [
  { value: 'seumur_hidup', label: 'Seumur Hidup' },
  { value: 'sampai_dengan', label: 'Sampai Dengan' },
]

// Expose state and functions for test assertions and parent orchestration
defineExpose({
  state,
  activeFigmaNodeId,
  applyKtpPreset,
  applyPasporPreset,
  handleIdentityTypeChange,
  handleMasaBerlakuTypeChange,
})
</script>

<template>
  <ModuleSectionCard
    title="Data Pelaksana Transaksi"
    :default-open="isOpen"
    :collapsible="collapsible"
    class="pelaksana-transaksi-section"
    data-node-id="11347:172884"
  >
    <div class="row g-3">
      <!-- ROW 1: Jenis Identitas & Nomor Identitas -->
      <div class="col-12 col-md-6">
        <GDropdown
          :model-value="state.identityType"
          label="Jenis Identitas"
          placeholder="Pilih jenis identitas"
          :items="identityTypeOptions"
          item-value="value"
          item-text="label"
          :disabled="isReadOnly"
          :use-bottom-sheet="isMobile"
          required
          @update:model-value="handleIdentityTypeChange"
        />
      </div>

      <div class="col-12 col-md-6">
        <GInputNIK
          v-if="state.identityType === 'ktp'"
          :model-value="state.nik"
          label="Nomor Identitas"
          placeholder="Masukan nomor identitas"
          :disabled="isReadOnly"
          required
          @update:model-value="(val: string) => { state.nik = val; syncUpstream(); }"
        />
        <GInputText
          v-else
          :model-value="state.nomorPaspor"
          label="Nomor Identitas"
          placeholder="Masukan nomor identitas"
          :use-auto-caps="true"
          :disabled="isReadOnly"
          required
          @update:model-value="(val: string) => { state.nomorPaspor = val; syncUpstream(); }"
        />
      </div>

      <!-- ROW 2: Nama Pelaksana & Nama Ibu Kandung -->
      <div class="col-12 col-md-6">
        <GInputText
          :model-value="state.namaLengkap"
          label="Nama Pelaksana"
          placeholder="Masukkan nama pelaksana"
          :disabled="isReadOnly"
          required
          @update:model-value="(val: string) => { state.namaLengkap = val; syncUpstream(); }"
        />
      </div>

      <div class="col-12 col-md-6">
        <GInputText
          :model-value="state.namaIbuKandung"
          label="Nama Ibu Kandung"
          placeholder="Masukkan nama ibu kandung"
          :disabled="isReadOnly"
          required
          @update:model-value="(val: string) => { state.namaIbuKandung = val; syncUpstream(); }"
        />
      </div>

      <!-- ROW 3: Tempat Lahir & Tanggal Lahir (+ Usia) -->
      <div class="col-12 col-md-6">
        <GInputText
          :model-value="state.tempatLahir"
          label="Tempat Lahir"
          placeholder="Masukkan tempat lahir"
          :disabled="isReadOnly"
          required
          @update:model-value="(val: string) => { state.tempatLahir = val; syncUpstream(); }"
        />
      </div>

      <div class="col-12 col-md-6">
        <div class="d-flex gap-3 align-items-start w-100">
          <div class="flex-grow-1">
            <GInputSmallDate
              :model-value="state.tanggalLahir"
              title="Tanggal Lahir"
              placeholder="Pilih tanggal"
              :disabled="isReadOnly"
              required
              @update:model-value="(val: string) => { state.tanggalLahir = val; syncUpstream(); }"
            />
          </div>
          <div style="width: 112px;">
            <GInputText
              label="Usia"
              :model-value="dynamicAge ? `${dynamicAge} Tahun` : 'Tahun'"
              placeholder="Tahun"
              disabled
            />
          </div>
        </div>
      </div>

      <!-- ROW 4: Jenis Kelamin & Agama -->
      <div class="col-12 col-md-6">
        <GDropdown
          :model-value="state.jenisKelamin"
          label="Jenis Kelamin"
          placeholder="Pilih jenis kelamin"
          :items="jenisKelaminOptions"
          item-value="value"
          item-text="label"
          :disabled="isReadOnly"
          :use-bottom-sheet="isMobile"
          required
          @update:model-value="(val: any) => { state.jenisKelamin = val; syncUpstream(); }"
        />
      </div>

      <div class="col-12 col-md-6">
        <GDropdown
          :model-value="state.agama"
          label="Agama"
          placeholder="Pilih agama"
          :items="agamaOptions"
          item-value="value"
          item-text="label"
          :disabled="isReadOnly"
          :use-bottom-sheet="isMobile"
          required
          @update:model-value="(val: any) => { state.agama = val; syncUpstream(); }"
        />
      </div>

      <!-- ROW 5: Pekerjaan & Masa Berlaku Identitas -->
      <div class="col-12 col-md-6">
        <GDropdown
          :model-value="state.pekerjaan"
          label="Pekerjaan"
          placeholder="Pilih pekerjaan"
          :items="pekerjaanOptions"
          item-value="value"
          item-text="label"
          :disabled="isReadOnly"
          :use-bottom-sheet="isMobile"
          @update:model-value="(val: any) => { state.pekerjaan = val; syncUpstream(); }"
        />
      </div>

      <div class="col-12 col-md-6">
        <GDropdown
          :model-value="state.masaBerlakuType"
          label="Masa Berlaku Identitas"
          placeholder="Pilih masa berlaku identitas"
          :items="masaBerlakuOptions"
          item-value="value"
          item-text="label"
          :disabled="isReadOnly"
          :use-bottom-sheet="isMobile"
          required
          @update:model-value="(val: any) => { handleMasaBerlakuTypeChange(val); }"
        />
      </div>

      <!-- ROW 6: Tanggal Berlaku Sampai & Kewarganegaraan -->
      <div class="col-12 col-md-6">
        <GInputSmallDate
          :model-value="state.tanggalBerlakuSampai"
          title="Tanggal Berlaku Sampai"
          placeholder="Pilih tanggal"
          :disabled="isReadOnly || state.masaBerlakuType === 'seumur_hidup'"
          @update:model-value="(val: string) => { state.tanggalBerlakuSampai = val; syncUpstream(); }"
        />
      </div>

      <div class="col-12 col-md-6">
        <GDropdown
          :model-value="state.kewarganegaraan"
          label="Kewarganegaraan"
          placeholder="Pilih kewarganegaraan"
          :items="kewarganegaraanOptions"
          item-value="value"
          item-text="label"
          :disabled="isReadOnly || state.identityType === 'ktp'"
          :use-bottom-sheet="isMobile"
          required
          @update:model-value="(val: any) => { state.kewarganegaraan = val; syncUpstream(); }"
        />
      </div>

      <!-- ROW 7: Jabatan & Nomor Handphone -->
      <div class="col-12 col-md-6">
        <GInputText
          :model-value="state.jabatan"
          label="Jabatan"
          placeholder="Pilih jabatan"
          :disabled="isReadOnly"
          @update:model-value="(val: string) => { state.jabatan = val; syncUpstream(); }"
        />
      </div>

      <div class="col-12 col-md-6">
        <GInputText
          :model-value="state.nomorHandphone"
          label="Nomor Handphone"
          placeholder="Masukkan handphone"
          :disabled="isReadOnly"
          required
          @update:model-value="(val: string) => { state.nomorHandphone = val; syncUpstream(); }"
        />
      </div>
    </div>
  </ModuleSectionCard>
</template>

<style scoped>
.pelaksana-transaksi-section {
  margin-top: 16px;
}
</style>
