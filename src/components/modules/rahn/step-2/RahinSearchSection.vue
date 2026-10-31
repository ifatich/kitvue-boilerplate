<script setup lang="ts">
/**
 * @file RahinSearchSection.vue
 * @description SPRINT Single UI Search Card for "Informasi Rahin" matching Figma Node 11347:160520 & 11347:160573.
 * Supports Tipe Rahin dropdown, Jenis Identitas (KTP / Paspor) dropdown,
 * dynamic NIK/Paspor input, full empty-search validation, and quick test presets.
 */
import { computed } from 'vue'
import {
  GButton,
  GDropdown,
  GInputNIK,
  GInputText,
} from '@/components'
import ModuleSectionCard from '@/components/shared/card/ModuleSectionCard.vue'
import {
  type IdentityType,
  type RahinType,
  type Step2State,
} from '../mockRahinData'

const props = withDefaults(
  defineProps<{
    searchState: Step2State['search']
    isMobile?: boolean
    isOpen?: boolean
  }>(),
  {
    isMobile: false,
    isOpen: true,
  },
)

const emit = defineEmits<{
  (e: 'update:searchState', val: Step2State['search']): void
  (e: 'search'): void
  (e: 'reset'): void
}>()

const localSearch = computed({
  get: () => props.searchState,
  set: (val: Step2State['search']) => emit('update:searchState', val),
})

const tipeRahinOptions = [
  { value: 'perorangan', label: 'Perorangan' },
  { value: 'badan_usaha', label: 'Badan Usaha' },
]

const jenisIdentitasOptions = [
  { value: 'ktp', label: 'KTP' },
  { value: 'paspor', label: 'Paspor' },
]

const handleFieldUpdate = (
  field: 'tipeRahin' | 'jenisIdentitas' | 'nomorIdentitas',
  val: any,
) => {
  const updated = {
    ...props.searchState,
    validationErrors: { ...props.searchState.validationErrors },
  }

  if (field === 'tipeRahin') {
    updated.tipeRahin = (val || '') as RahinType
    if (updated.validationErrors.tipeRahin) {
      delete updated.validationErrors.tipeRahin
    }
  } else if (field === 'jenisIdentitas') {
    const newJenis = (val || '') as IdentityType
    if (newJenis !== updated.jenisIdentitas) {
      updated.nomorIdentitas = '' // Reset input on identity type change
    }
    updated.jenisIdentitas = newJenis
    if (updated.validationErrors.jenisIdentitas) {
      delete updated.validationErrors.jenisIdentitas
    }
    if (updated.validationErrors.nomorIdentitas) {
      delete updated.validationErrors.nomorIdentitas
    }
  } else if (field === 'nomorIdentitas') {
    updated.nomorIdentitas = val || ''
    if (updated.validationErrors.nomorIdentitas) {
      delete updated.validationErrors.nomorIdentitas
    }
  }

  emit('update:searchState', updated)
}

const handleSearchClick = () => {
  const errors: {
    tipeRahin?: string
    jenisIdentitas?: string
    nomorIdentitas?: string
  } = {}

  if (!props.searchState.tipeRahin) {
    errors.tipeRahin = 'Kolom ini wajib diisi.'
  }
  if (!props.searchState.jenisIdentitas) {
    errors.jenisIdentitas = 'Kolom ini wajib diisi.'
  } else {
    // Progressive disclosure: only validate nomorIdentitas if jenisIdentitas is selected!
    const cleanNumber = (props.searchState.nomorIdentitas || '').replace(/\s+/g, '')
    if (!cleanNumber) {
      errors.nomorIdentitas = 'Kolom ini wajib diisi.'
    } else if (props.searchState.jenisIdentitas === 'ktp' && cleanNumber.length < 16) {
      errors.nomorIdentitas = 'NIK harus terdiri dari 16 digit angka.'
    }
  }

  if (Object.keys(errors).length > 0) {
    emit('update:searchState', {
      ...props.searchState,
      isSubmitted: true,
      validationErrors: errors,
    })
    return
  }

  emit('update:searchState', {
    ...props.searchState,
    isSubmitted: true,
    validationErrors: {},
  })
  emit('search')
}
</script>

<template>
  <ModuleSectionCard title="Informasi Rahin" :default-open="isOpen">
    <div class="rahin-search-section">
      <!-- 2-Column Search Grid per Figma Node 11347:160520 & 11347:160573 -->
      <div class="row g-3 mb-4">
        <!-- Row 1: Tipe Rahin Dropdown (kiri) & Jenis Identitas Dropdown (kanan) -->
        <div class="col-12 col-md-6">
          <div class="search-field" :class="{ 'has-error': !!localSearch.validationErrors.tipeRahin }">
            <GDropdown
              :model-value="localSearch.tipeRahin"
              label="Tipe Rahin"
              placeholder="Pilih tipe Rahin"
              :items="tipeRahinOptions"
              item-value="value"
              item-text="label"
              :use-bottom-sheet="isMobile"
              :required="true"
              :is-checked="!!localSearch.validationErrors.tipeRahin"
              :error="localSearch.validationErrors.tipeRahin"
              @update:model-value="(val: any) => handleFieldUpdate('tipeRahin', val)"
            />
            <div
              v-if="localSearch.validationErrors.tipeRahin"
              class="custom-error-text"
            >
              {{ localSearch.validationErrors.tipeRahin }}
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="search-field" :class="{ 'has-error': !!localSearch.validationErrors.jenisIdentitas }">
            <GDropdown
              :model-value="localSearch.jenisIdentitas"
              label="Jenis Identitas"
              placeholder="Pilih jenis identitas"
              :items="jenisIdentitasOptions"
              item-value="value"
              item-text="label"
              :use-bottom-sheet="isMobile"
              :required="true"
              :is-checked="!!localSearch.validationErrors.jenisIdentitas"
              :error="localSearch.validationErrors.jenisIdentitas"
              @update:model-value="(val: any) => handleFieldUpdate('jenisIdentitas', val)"
            />
            <div
              v-if="localSearch.validationErrors.jenisIdentitas"
              class="custom-error-text"
            >
              {{ localSearch.validationErrors.jenisIdentitas }}
            </div>
          </div>
        </div>

        <!-- Row 2: Nomor Identitas (Muncul jika Jenis Identitas telah dipilih) -->
        <template v-if="localSearch.jenisIdentitas">
          <div class="col-12 col-md-6">
            <div class="search-field" :class="{ 'has-error': !!localSearch.validationErrors.nomorIdentitas }">
              <GInputNIK
                v-if="localSearch.jenisIdentitas === 'ktp'"
                :model-value="localSearch.nomorIdentitas"
                label="Nomor Induk Kependudukan (NIK)"
                placeholder="Masukkan 16 digit NIK"
                :error="localSearch.validationErrors.nomorIdentitas"
                @update:model-value="(val: string) => handleFieldUpdate('nomorIdentitas', val)"
              />
              <GInputText
                v-else
                :model-value="localSearch.nomorIdentitas"
                label="Nomor Paspor"
                placeholder="Masukkan nomor paspor"
                :error="localSearch.validationErrors.nomorIdentitas"
                @update:model-value="(val: string) => handleFieldUpdate('nomorIdentitas', val)"
              />
            </div>
          </div>
          <div class="col-12 col-md-6 d-none d-md-block" aria-hidden="true" />
        </template>
      </div>

      <!-- Action Footer: "Cari" button aligned to right (Figma Node 11766:130148 - w: 185px, h: 40px) -->
      <div class="search-actions">
        <GButton
          label="Cari"
          type="outline"
          size="md"
          class="btn-cari"
          @click="handleSearchClick"
        />
      </div>
    </div>
  </ModuleSectionCard>
</template>

<style lang="scss" scoped>
.rahin-search-section {
  display: flex;
  flex-direction: column;
}

.search-field {
  display: flex;
  flex-direction: column;

  &.has-error {
    :deep(.btn.gkit-dd),
    :deep(input.form-control) {
      border-color: var(--g-kit-red-50, #ae1e22) !important;
    }
  }
}

.custom-error-text {
  margin-top: 4px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: var(--g-kit-font-size-omega, 12px);
  font-weight: var(--g-kit-font-weight-normal, 600);
  color: var(--g-kit-red-50, #ae1e22);
}

.search-actions {
  display: flex;
  justify-content: flex-end;

  .btn-cari {
    width: 185px;
    height: 40px;
    font-size: var(--g-kit-font-size-omicron, 16px);
    font-weight: var(--g-kit-font-weight-bold, 800);
    border-radius: 6px;
  }
}
</style>
