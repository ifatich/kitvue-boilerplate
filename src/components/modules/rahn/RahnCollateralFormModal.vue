<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import {
  GButton,
  GDropdown,
  GFilePickerSM,
  GInputText,
  GModalBottomSheet,
  GTextArea,
  InputNominalEnd,
  InputNominalStart,
} from '@/components'
import type { RahnCollateral } from '@/views/rahn/rahnFlow'

type PhotoValue = string | File | null

const props = withDefaults(defineProps<{
  rubric: string
  isMobile: boolean
  initialCollateral?: RahnCollateral | null
}>(), {
  initialCollateral: null,
})

const emit = defineEmits<{
  save: [collateral: RahnCollateral]
}>()

const model = defineModel<boolean>({ default: false })
const detailStage = ref(false)
const hasTriedContinue = ref(false)
const photoReadError = ref('')
const draft = reactive({
  rubric: '',
  partner: '',
  collateralType: '',
  brand: '',
  denomination: '',
  pieces: '',
  description: '',
  photos: [] as PhotoValue[],
})

const partnerOptions = [
  { value: 'Galeri 24', label: 'Galeri 24' },
  { value: 'Non Galeri 24', label: 'Non Galeri 24' },
]
const collateralTypeOptions = [{ value: 'Emas Batangan', label: 'Emas Batangan' }]
const brandOptions = [
  { value: 'Galeri24', label: 'Galeri24' },
  { value: 'Antam', label: 'Antam' },
  { value: 'UBS', label: 'UBS' },
]
const availableBrandOptions = computed(() => draft.partner === 'Non Galeri 24'
  ? brandOptions.filter((option) => option.value !== 'Galeri24')
  : brandOptions)
const denominationOptions = [
  { value: '0,500', label: '0,500 gram' },
  { value: '1,000', label: '1,000 gram' },
  { value: '2,000', label: '2,000 gram' },
  { value: '5,000', label: '5,000 gram' },
  { value: '10,000', label: '10,000 gram' },
  { value: '25,000', label: '25,000 gram' },
  { value: '50,000', label: '50,000 gram' },
  { value: '100,000', label: '100,000 gram' },
]

const availablePhotos = computed(() => draft.photos.filter((photo): photo is string | File => photo !== null))
const photoPickerIndexes = computed(() => {
  const lastFilledIndex = draft.photos.reduce((lastIndex, photo, index) => (
    photo !== null ? index : lastIndex
  ), -1)
  const slotCount = Math.min(lastFilledIndex + 2, 3)
  return Array.from({ length: Math.max(slotCount, 1) }, (_, index) => index)
})
const estimatedValue = computed(() => {
  const denomination = Number(draft.denomination.replace(',', '.'))
  const pieces = Number(draft.pieces)
  if (!Number.isFinite(denomination) || !Number.isFinite(pieces) || pieces <= 0) return 0
  return denomination * pieces * 2_400_000
})

watch(() => draft.partner, () => {
  if (draft.brand && !availableBrandOptions.value.some((option) => option.value === draft.brand)) {
    draft.brand = ''
    draft.denomination = ''
  }
})

watch(model, (isOpen) => {
  if (!isOpen) return
  const initial = props.initialCollateral
  Object.assign(draft, initial
    ? {
        rubric: initial.rubric,
        partner: initial.partner,
        collateralType: initial.collateralType,
        brand: initial.brand,
        denomination: initial.denomination,
        pieces: String(initial.pieces),
        description: initial.description,
        photos: [...initial.photos, null],
      }
    : {
        rubric: props.rubric || 'Barang Kantong',
        partner: '',
        collateralType: '',
        brand: '',
        denomination: '',
        pieces: '',
        description: '',
        photos: [null],
      })
  detailStage.value = Boolean(initial)
  hasTriedContinue.value = false
  photoReadError.value = ''
})

const continueToDetails = () => {
  hasTriedContinue.value = true
  if (!draft.partner || !draft.collateralType) return
  hasTriedContinue.value = false
  detailStage.value = true
}

const handlePhotoInput = (file: File | null, index: number) => {
  draft.photos[index] = file
  photoReadError.value = ''
  while (draft.photos.length > 1 && draft.photos[draft.photos.length - 1] === null) draft.photos.pop()
  if (file && index === draft.photos.length - 1 && draft.photos.length < 3) draft.photos.push(null)
}

const photoAsDataUrl = async (photo: string | File): Promise<string> => {
  if (typeof photo === 'string') return photo
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('File foto tidak dapat dibaca.'))
    }
    reader.onerror = () => reject(new Error('File foto tidak dapat dibaca.'))
    reader.readAsDataURL(photo)
  })
}

const saveCollateral = async () => {
  hasTriedContinue.value = true
  const pieces = Number(draft.pieces)
  if (!draft.brand || !draft.denomination || !Number.isInteger(pieces) || pieces <= 0 || !draft.description.trim() || draft.description.trim().length < 10 || availablePhotos.value.length === 0) return

  let photos: string[]
  try {
    photos = await Promise.all(availablePhotos.value.map(photoAsDataUrl))
  } catch (error) {
    console.error('Gagal membaca foto jaminan.', error)
    photoReadError.value = error instanceof Error ? error.message : 'Foto jaminan tidak dapat dibaca.'
    return
  }

  emit('save', {
    rubric: draft.rubric,
    collateralType: draft.collateralType,
    partner: draft.partner,
    brand: draft.brand,
    denomination: draft.denomination,
    pieces,
    karat: '24',
    estimatedValue: estimatedValue.value,
    description: draft.description.trim(),
    photos,
  })
  model.value = false
}
</script>

<template>
  <GModalBottomSheet
    v-model="model"
    :class="['rahn-collateral-modal', { 'rahn-collateral-modal--detail': detailStage }]"
    centered
    title="Tambah Jaminan"
    size="md"
    :show-close-button="true"
    :use-bottom-sheet="isMobile"
  >
    <template #body>
      <div class="rahn-collateral-form">
        <GInputText v-model="draft.rubric" label="Rubrik" disabled />
        <GDropdown
          v-model="draft.partner"
          class="rahn-collateral-partner-dropdown"
          label="Mitra"
          placeholder="Pilih mitra"
          :items="partnerOptions"
          item-value="value"
          item-text="label"
          error="Pilih mitra"
          :required="hasTriedContinue"
          :is-checked="hasTriedContinue"
          :use-bottom-sheet="isMobile"
        />
        <GDropdown
          v-model="draft.collateralType"
          label="Tipe Barang Jaminan"
          placeholder="Pilih tipe barang jaminan"
          :items="collateralTypeOptions"
          item-value="value"
          item-text="label"
          error="Pilih tipe barang jaminan"
          :required="hasTriedContinue"
          :is-checked="hasTriedContinue"
          :use-bottom-sheet="isMobile"
        />

        <template v-if="detailStage">
          <GDropdown
            v-model="draft.brand"
            label="Merek Emas"
            placeholder="Pilih merek emas"
            :items="availableBrandOptions"
            item-value="value"
            item-text="label"
            :error="hasTriedContinue && !draft.brand ? 'Pilih merek emas' : ''"
            :required="hasTriedContinue"
            :is-checked="hasTriedContinue"
            :use-bottom-sheet="isMobile"
          />
          <GDropdown
            v-model="draft.denomination"
            label="Denominasi"
            placeholder="Pilih denominasi"
            :items="denominationOptions"
            item-value="value"
            item-text="label"
            :error="hasTriedContinue && !draft.denomination ? 'Pilih denominasi' : ''"
            :required="hasTriedContinue"
            :is-checked="hasTriedContinue"
            :use-bottom-sheet="isMobile"
          />

          <div class="rahn-collateral-nominal-field">
            <InputNominalEnd
              v-model="draft.pieces"
              title="Jumlah Keping"
              placeholder="Masukkan nominal"
              unit="Pcs"
              delimeter="none"
            />
            <span v-if="hasTriedContinue && !draft.pieces" class="rahn-collateral-validation">
              Masukkan jumlah keping
            </span>
          </div>
          <div class="rahn-collateral-nominal-field">
            <InputNominalEnd
              :model-value="estimatedValue ? '24' : ''"
              title="Karat"
              placeholder="Terisi otomatis"
              unit="Karat"
              disabled
            />
          </div>
          <div class="rahn-collateral-nominal-field">
            <InputNominalStart
              :model-value="estimatedValue ? String(estimatedValue) : ''"
              label="Total Taksiran"
              placeholder="Terisi otomatis"
              unit="Rupiah"
              disabled
            />
          </div>

          <div class="rahn-collateral-description">
            <GTextArea
              v-model="draft.description"
              label="Keterangan"
              variant="count"
              :max-length="200"
              placeholder="Masukkan keterangan"
              :error="hasTriedContinue && draft.description.trim().length < 10 ? 'Minimal 10 karakter.' : ''"
            />
            <span class="rahn-collateral-description-hint">Minimal 10 karakter.</span>
          </div>

          <div class="rahn-collateral-photo-field">
            <span class="rahn-collateral-photo-label">Foto Barang Jaminan</span>
            <div class="rahn-collateral-photo-list">
              <GFilePickerSM
                v-for="index in photoPickerIndexes"
                :key="`photo-${index}`"
                :file="draft.photos[index] ?? null"
                :image-only="true"
                :unique-key="`photo-${index}`"
                @input="(file) => handlePhotoInput(file, index)"
              />
            </div>
            <span v-if="hasTriedContinue && !availablePhotos.length" class="rahn-collateral-validation">
              Kolom ini wajib diisi.
            </span>
            <span v-else-if="photoReadError" class="rahn-collateral-validation">{{ photoReadError }}</span>
            <span v-else class="rahn-collateral-photo-hint">Maksimal 3 foto.</span>
          </div>
        </template>
      </div>
    </template>
    <template #footer>
      <GButton
        :label="detailStage ? 'Simpan' : 'Selanjutnya'"
        type="primary"
        size="md"
        @click="detailStage ? saveCollateral() : continueToDetails()"
      />
    </template>
  </GModalBottomSheet>
</template>

<style scoped lang="scss">
:global(.rahn-collateral-modal.show) {
  display: block !important;
}

:global(.rahn-collateral-modal .modal-dialog) {
  position: relative;
  z-index: 1051;
  max-width: 564px;
}

:global(.rahn-collateral-modal .modal-content) {
  overflow: hidden;
  border: 0;
  border-radius: 12px !important;
}

:global(.rahn-collateral-modal .custom-modal-header) {
  height: 59px;
  padding: 16px;
}

:global(.rahn-collateral-modal .custom-modal-header h5) {
  color: var(--g-kit-black-80, #252528);
  font-size: 18px;
  font-weight: 800 !important;
  line-height: 26px;
}

:global(.rahn-collateral-modal .custom-modal-header .btn-close) {
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  padding: 0;
  opacity: 1;
  background: url('../../../../node_modules/kitvue-public/src/assets/icon/close.svg') center / 24px 24px no-repeat !important;
}

:global(.rahn-collateral-modal .modal-body) {
  padding: 0;
}

:global(.rahn-collateral-modal .custom-modal-body) {
  max-height: 560px;
  overflow: auto;
  padding: 16px;
}

:global(.rahn-collateral-modal .custom-modal-footer) {
  display: block;
  box-sizing: border-box;
  height: 72px;
  min-height: 72px;
  padding: 16px;
  border-top: 0 !important;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.14), 0 0 1px rgba(0, 0, 0, 0.08);
}

:global(.rahn-collateral-modal .custom-modal-footer > .btn) {
  display: block;
  width: 100%;
  height: 40px;
}

:global(.rahn-collateral-modal .rahn-collateral-partner-dropdown .dropdown-menu.show) {
  z-index: 5;
  transform: translateY(-100%) !important;
}

.rahn-collateral-form {
  display: grid;
  gap: 24px;

  :deep(.group-input) {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 0;
  }

  :deep(.group-input .form-label) {
    display: block;
    margin-bottom: 0;
    color: var(--g-kit-black-80, #252528);
    font-size: 14px;
    font-weight: var(--g-kit-font-weight-bold, 800);
    line-height: 20px;
  }

  :deep(.gkit-dd) {
    height: 48px;
    min-height: 48px;
    border-color: var(--g-kit-black-20, #eeeeef);
  }

  :deep(.form-control) {
    height: 46px;
    min-height: 46px;
  }

  :deep(.input-group.custom-input-group-icon) {
    height: 48px;
  }
}

.rahn-collateral-nominal-field {
  :deep(.group-input) {
    margin: 0;
  }

  :deep(.form-label img) {
    display: none;
  }
}

.rahn-collateral-description {
  display: grid;
  gap: 4px;

  :deep(.form-label) {
    color: var(--g-kit-black-80, #252528);
    font-size: 14px;
    line-height: 20px;
    font-weight: var(--g-kit-font-weight-bold, 800);
  }

  .rahn-collateral-description-hint {
    color: var(--g-kit-black-60, #58585b);
    font-size: 12px;
    line-height: 18px;
  }
}

.rahn-collateral-photo-field {
  display: grid;
  gap: 4px;
}

.rahn-collateral-photo-label {
  color: var(--g-kit-black-80, #252528);
  font-size: 14px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 20px;
}

.rahn-collateral-photo-list {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 8px;
}

.rahn-collateral-photo-hint {
  color: var(--g-kit-black-60, #58585b);
  font-size: 12px;
  line-height: 18px;
}

.rahn-collateral-validation {
  color: var(--g-kit-red-50, #ae1e22);
  font-size: 10px;
  line-height: 14px;
}
</style>
