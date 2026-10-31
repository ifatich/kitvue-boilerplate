<script setup lang="ts">
/**
 * @file Step1PengajuanContent.vue
 * @description SPRINT Module Section for Step 1: Data Pengajuan.
 * Coordinates Informasi Rahn, Beneficial Owner search/table, Detail view,
 * Tambah view, and all related modals.
 * Strictly adheres to Pegadaian --g-kit-* design tokens and kitvue-plugin rules.
 */
import { computed, ref, watch } from 'vue'
import ModuleSectionCard from '@/components/shared/card/ModuleSectionCard.vue'
import InformasiRahnSection, { type RahnFields } from './InformasiRahnSection.vue'
import BeneficialOwnerSection, { type BeneficialOwnerState } from './BeneficialOwnerSection.vue'
import BeneficialOwnerTableSection from './BeneficialOwnerTableSection.vue'
import BeneficialOwnerDetailSections from './BeneficialOwnerDetailSections.vue'
import BeneficialOwnerNotFoundModal from './modals/BeneficialOwnerNotFoundModal.vue'
import BeneficialOwnerConfirmResetModal from './modals/BeneficialOwnerConfirmResetModal.vue'
import BeneficialOwnerWarningModal from './modals/BeneficialOwnerWarningModal.vue'
import BeneficialOwnerSaveConfirmModal from './modals/BeneficialOwnerSaveConfirmModal.vue'
import BeneficialOwnerSaveSuccessModal from './modals/BeneficialOwnerSaveSuccessModal.vue'
import {
  MOCK_BENEFICIAL_OWNERS,
  type BeneficialOwnerItem,
  findBeneficialOwnerById,
  searchBeneficialOwnerList,
} from '../mockBeneficialOwnerData'
import type { UsecaseAction } from '@/router/rahnRouting'

const props = withDefaults(
  defineProps<{
    isMobile?: boolean
    action?: UsecaseAction
    recordId?: string
  }>(),
  {
    isMobile: false,
    action: undefined,
    recordId: undefined,
  },
)

const fields = defineModel<RahnFields>('fields', { required: true })
const boState = defineModel<BeneficialOwnerState>('boState', { required: true })
const subView = defineModel<'search' | 'detail' | 'tambah'>('subView', {
  default: 'search',
})
const validationAlert = defineModel<string | null>('validationAlert', {
  default: null,
})

const emit = defineEmits<{
  (e: 'advance'): void
  (e: 'back-to-root'): void
  (e: 'update:action', action: UsecaseAction, recordId?: string): void
}>()

// Step 1 collapsible sections
const isInformasiRahnOpen = ref(true)
const isBeneficialOwnerOpen = ref(true)
const isDataBOOpen = ref(true)

// Internal flow state
const isAlamatSesuaiKtp = ref(false)
const isBONotFound = ref(false)
const showNotFoundModal = ref(false)
const boDetailRef = ref<InstanceType<typeof BeneficialOwnerDetailSections> | null>(null)

// Step 1 Modals
const showConfirmResetModal = ref(false)
const showWarningModal = ref(false)
const warningModalTitle = ref('')
const warningModalDesc = ref('')
const showConfirmSaveModal = ref(false)
const showSaveSuccessModal = ref(false)
const pendingNewBO = ref<BeneficialOwnerItem | null>(null)
const pendingRelationship = ref<string>('')

// Table and Search state
const isBOSearched = ref(false)
const relationshipError = ref('')
const isBOConfirmed = ref(false)
const boSearchResults = ref<BeneficialOwnerItem[]>([])

const draftNewBO = computed<BeneficialOwnerItem>(() => ({
  id: '',
  registrationNumber: '',
  name: '',
  nik:
    boState.value.identityType === 'ktp'
      ? boState.value.identityNumber || '3204 2849 1298 0003'
      : '',
  pasporNumber:
    boState.value.identityType === 'paspor'
      ? boState.value.identityNumber || '0033 9714 84'
      : undefined,
  birthDate: '',
  motherName: '',
  birthPlace: '',
  gender: '',
  job: '',
  address: '',
  phone: '',
  branch: '',
  isDukcapilVerified: false,
}))

// Usecase action computed state & synchronization
const isDetailReadOnly = computed(() => {
  if (props.action === 'update') return false
  return true
})

const applyAction = (action?: UsecaseAction, recordId?: string) => {
  if (!action) return
  if (action === 'entry') {
    subView.value = 'search'
  } else if (action === 'create') {
    isAlamatSesuaiKtp.value = false
    subView.value = 'tambah'
  } else if (action === 'preview' || action === 'update') {
    subView.value = 'detail'
    const targetId = recordId || props.recordId || boState.value.selectedBO?.id
    if (targetId) {
      const found = findBeneficialOwnerById(targetId)
      if (found) {
        boState.value.selectedBO = found
        boState.value.type = 'orang_lain'
        boState.value.identityType = found.pasporNumber ? 'paspor' : 'ktp'
        boState.value.identityNumber = found.pasporNumber || found.nik
      }
    } else if (!boState.value.selectedBO && MOCK_BENEFICIAL_OWNERS.length > 0) {
      boState.value.selectedBO = MOCK_BENEFICIAL_OWNERS[0]
      boState.value.type = 'orang_lain'
      boState.value.identityType = 'ktp'
      boState.value.identityNumber = MOCK_BENEFICIAL_OWNERS[0].nik
    }
  }
}

watch(
  () => [props.action, props.recordId] as const,
  ([newAction, newId]) => {
    if (newAction) {
      applyAction(newAction, newId)
    }
  },
  { immediate: true },
)

watch(subView, (newView) => {
  if (newView === 'search' && props.action && props.action !== 'entry') {
    emit('update:action', 'entry')
  } else if (newView === 'tambah' && props.action && props.action !== 'create') {
    emit('update:action', 'create')
  } else if (newView === 'detail' && props.action && props.action !== 'preview' && props.action !== 'update') {
    emit('update:action', 'preview', boState.value.selectedBO?.id)
  }
})

// Handle click "Pilih" in table
const handleSelectBO = (item: BeneficialOwnerItem, isSesuai: boolean) => {
  boState.value.selectedBO = item
  isAlamatSesuaiKtp.value = isSesuai
  boState.value.isAlamatSesuaiKtp = isSesuai
  validationAlert.value = null

  // For Paspor: Hubungan is on search card, validate if user clicks Pilih without Hubungan
  if (
    boState.value.identityType === 'paspor' &&
    (!boState.value.relationship || !boState.value.relationship.trim())
  ) {
    relationshipError.value = 'Kolom ini wajib diisi.'
    const el =
      document.querySelector('.bo-field-with-error') ||
      document.querySelector('.bo-section-container')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }

  // Navigate directly to preview page "Data Beneficial Owner"
  relationshipError.value = ''
  subView.value = 'detail'
  if (props.action !== 'preview' || props.recordId !== item.id) {
    emit('update:action', 'preview', item.id)
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSearchBO = () => {
  if (subView.value === 'tambah') {
    showConfirmResetModal.value = true
    return
  }
  validationAlert.value = null
  relationshipError.value = ''
  isBOConfirmed.value = false
  boState.value.selectedBO = null
  isBOSearched.value = true

  // Perform dynamic search matching normalized NIK or Paspor number
  const results = searchBeneficialOwnerList(
    boState.value.identityType,
    boState.value.identityNumber,
  )
  boSearchResults.value = results

  if (results.length === 0) {
    isBONotFound.value = true
    showNotFoundModal.value = true
  } else {
    isBONotFound.value = false
    showNotFoundModal.value = false
  }
}

const handleCancelNotFound = () => {
  showNotFoundModal.value = false
}

const handleCancelConfirm = () => {
  showConfirmSaveModal.value = false
}

const handleOpenTambahBO = () => {
  showNotFoundModal.value = false
  isAlamatSesuaiKtp.value = false
  subView.value = 'tambah'
  if (props.action !== 'create') {
    emit('update:action', 'create')
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSaveNewBO = (newBo: BeneficialOwnerItem, relationship: string) => {
  boState.value.selectedBO = newBo
  boState.value.relationship = relationship
  isAlamatSesuaiKtp.value = false
  boState.value.isAlamatSesuaiKtp = false
  isBONotFound.value = false
  subView.value = 'detail'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleConfirmResetTambah = () => {
  showConfirmResetModal.value = false
  subView.value = 'search'
  isBONotFound.value = false
  showNotFoundModal.value = false
  if (props.action !== 'entry') {
    emit('update:action', 'entry')
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleConfirmSaveNewBO = () => {
  showConfirmSaveModal.value = false
  showSaveSuccessModal.value = true
}

const handleContinueToDataRahin = () => {
  showSaveSuccessModal.value = false
  if (pendingNewBO.value) {
    boState.value.selectedBO = pendingNewBO.value
    boState.value.relationship = pendingRelationship.value
    boState.value.isAlamatSesuaiKtp = isAlamatSesuaiKtp.value

    const existingIndex = boSearchResults.value.findIndex(
      (b) => b.registrationNumber === pendingNewBO.value?.registrationNumber,
    )
    if (existingIndex >= 0) {
      boSearchResults.value[existingIndex] = {
        ...boSearchResults.value[existingIndex],
        ...pendingNewBO.value,
      }
    } else {
      boSearchResults.value.unshift(pendingNewBO.value)
    }
  }
  isBOConfirmed.value = true
  validationAlert.value = null
  relationshipError.value = ''
  subView.value = 'search'
  emit('advance')
}

// Watchers for resetting search state on input change
watch(
  () => boState.value.type,
  (newType) => {
    if (newType !== 'orang_lain') {
      isBOSearched.value = false
      isBONotFound.value = false
      showNotFoundModal.value = false
      boState.value.selectedBO = null
      boSearchResults.value = []
      isBOConfirmed.value = false
      relationshipError.value = ''
    }
  },
)

watch(
  () => boState.value.identityType,
  () => {
    isBOSearched.value = false
    isBONotFound.value = false
    showNotFoundModal.value = false
    boState.value.selectedBO = null
    boSearchResults.value = []
    isBOConfirmed.value = false
    relationshipError.value = ''
  },
)

watch(
  () => boState.value.identityNumber,
  () => {
    isBOSearched.value = false
    isBONotFound.value = false
    showNotFoundModal.value = false
    boSearchResults.value = []
    isBOConfirmed.value = false
    relationshipError.value = ''
  },
)

/**
 * Validates step 1 and manages transitions.
 * Returns true if ready to advance to Step 2, false otherwise.
 */
const handleNext = (): boolean => {
  validationAlert.value = null

  // Check Informasi Rahn fields
  if (
    !fields.value.tujuanPengajuan ||
    !fields.value.tujuanTransaksi ||
    !fields.value.pekerjaanTerkini ||
    !fields.value.rubrikMarhun ||
    !fields.value.skemaTarif ||
    !fields.value.produk ||
    !fields.value.jangkaWaktu
  ) {
    validationAlert.value =
      'Mohon lengkapi seluruh field pada seksi Informasi Rahn.'
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return false
  }

  // Check Beneficial Owner selection
  if (!boState.value.type) {
    validationAlert.value =
      'Silakan tentukan Tipe Beneficial Owner terlebih dahulu.'
    window.scrollTo({ top: 350, behavior: 'smooth' })
    return false
  }

  // Check Beneficial Owner fields if Orang Lain
  if (boState.value.type === 'orang_lain') {
    if (subView.value === 'tambah') {
      if (
        boState.value.identityType === 'ktp' &&
        !boDetailRef.value?.isDukcapilVerified
      ) {
        warningModalTitle.value = 'Perhatian'
        warningModalDesc.value =
          'Anda harus melakukan cek dukcapil terlebih dahulu.'
        showWarningModal.value = true
        return false
      }

      if (!isAlamatSesuaiKtp.value && !boDetailRef.value?.hasDomisiliAddress()) {
        warningModalTitle.value = 'Tidak Dapat Melanjutkan'
        warningModalDesc.value =
          'Pastikan Anda sudah centang kolom data nasabah sudah sesuai dengan kartu identitas atau mengisi alamat tinggal saat ini.'
        showWarningModal.value = true
        return false
      }

      const res = boDetailRef.value?.submit()
      if (!res) {
        validationAlert.value =
          'Mohon lengkapi seluruh field yang wajib diisi dan pastikan RT/RW 3 digit.'
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return false
      }

      pendingNewBO.value = res.bo
      pendingRelationship.value = res.relationship
      showConfirmSaveModal.value = true
      return false
    }

    if (subView.value === 'search') {
      if (isBOConfirmed.value && boState.value.selectedBO) {
        return true
      }

      if (
        !boState.value.selectedBO &&
        boSearchResults.value.length > 0 &&
        !isBONotFound.value
      ) {
        const defaultBO = boSearchResults.value[0]
        boState.value.selectedBO = defaultBO
        isAlamatSesuaiKtp.value = defaultBO.registrationNumber === '1234 2222'
      }

      if (!boState.value.selectedBO) {
        if (isBONotFound.value) {
          validationAlert.value =
            'Data Beneficial Owner tidak ditemukan. Silakan klik Tambah untuk mendaftarkan data baru.'
        } else {
          validationAlert.value =
            'Silakan cari dan klik Pilih pada salah satu data Beneficial Owner di tabel.'
        }
        window.scrollTo({ top: 400, behavior: 'smooth' })
        return false
      }

      if (boState.value.identityType === 'paspor') {
        if (!boState.value.relationship || !boState.value.relationship.trim()) {
          relationshipError.value = 'Kolom ini wajib diisi.'
          validationAlert.value = null
          const el =
            document.querySelector('.bo-field-with-error') ||
            document.querySelector('.bo-section-container')
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          return false
        }
      }

      relationshipError.value = ''
      subView.value = 'detail'
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return false
    }

    if (subView.value === 'detail') {
      if (!boState.value.relationship || !boState.value.relationship.trim()) {
        relationshipError.value = 'Kolom ini wajib diisi.'
        validationAlert.value = null
        const el =
          document.querySelector('.bo-field-with-error') ||
          document.querySelector('.bo-detail-card')
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return false
      }
      relationshipError.value = ''

      pendingNewBO.value = boState.value.selectedBO
      pendingRelationship.value = boState.value.relationship
      showConfirmSaveModal.value = true
      return false
    }
  }

  return true
}

/**
 * Handles back navigation within Step 1.
 * Returns true if parent should handle routing back, false if handled internally.
 */
const handlePrev = (): boolean => {
  validationAlert.value = null
  if (subView.value === 'tambah') {
    showConfirmResetModal.value = true
    return false
  }
  if (subView.value === 'detail') {
    subView.value = 'search'
    if (props.action !== 'entry') {
      emit('update:action', 'entry')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return false
  }
  return true
}

defineExpose({
  handleNext,
  handlePrev,
  isBOConfirmed,
  isBOSearched,
  isBONotFound,
  subView,
  isDetailReadOnly,
})
</script>

<template>
  <div class="step1-pengajuan-content">
    <!-- SUB-VIEW A: PENCARIAN & TABEL BO -->
    <div v-if="subView === 'search'" class="form-card" data-node-id="12920:311792">
      <!-- CARD 1: INFORMASI RAHN -->
      <InformasiRahnSection
        v-model="fields"
        v-model:is-open="isInformasiRahnOpen"
        :is-mobile="props.isMobile"
      />

      <!-- CARD 2: BENEFICIAL OWNER -->
      <ModuleSectionCard title="Beneficial Owner" v-model="isBeneficialOwnerOpen">
        <BeneficialOwnerSection
          v-model="boState"
          :is-mobile="props.isMobile"
          :show-tambah="isBONotFound"
          :is-searched="isBOSearched"
          :relationship-error="relationshipError"
          @search="handleSearchBO"
          @create-manual="handleOpenTambahBO"
          @clear-relationship-error="relationshipError = ''"
        />
      </ModuleSectionCard>

      <!-- CARD 3: DATA BENEFICIAL OWNER -->
      <ModuleSectionCard
        v-if="boState.type === 'orang_lain' && boState.identityType && isBOSearched"
        title="Data Beneficial Owner"
        v-model="isDataBOOpen"
      >
        <BeneficialOwnerTableSection
          :items="boSearchResults"
          :selected-bo="isBOConfirmed ? boState.selectedBO : null"
          :identity-type="boState.identityType"
          :is-not-found="isBONotFound"
          :is-mobile="props.isMobile"
          @select="handleSelectBO"
        />
      </ModuleSectionCard>
    </div>

    <!-- SUB-VIEW B: DETAIL BENEFICIAL OWNER (Readonly or Editable per UsecaseAction) -->
    <div
      v-else-if="subView === 'detail' && boState.selectedBO"
      class="form-card"
      data-node-id="12920:307127"
    >
      <BeneficialOwnerDetailSections
        :bo-data="boState.selectedBO"
        :identity-type="boState.identityType"
        v-model:relationship="boState.relationship"
        v-model:is-alamat-sesuai="isAlamatSesuaiKtp"
        :relationship-error="relationshipError"
        :is-read-only="isDetailReadOnly"
        :is-mobile="props.isMobile"
      />
    </div>

    <!-- SUB-VIEW C: TAMBAH BENEFICIAL OWNER -->
    <div
      v-else-if="subView === 'tambah'"
      class="form-card"
      data-node-id="11347:151906"
    >
      <BeneficialOwnerDetailSections
        ref="boDetailRef"
        :bo-data="draftNewBO"
        :identity-type="boState.identityType"
        v-model:relationship="boState.relationship"
        v-model:is-alamat-sesuai="isAlamatSesuaiKtp"
        :is-read-only="false"
        :is-mobile="props.isMobile"
        @save="handleSaveNewBO"
      />
    </div>

    <!-- Step 1 Dialog Modals -->
    <BeneficialOwnerNotFoundModal
      v-model="showNotFoundModal"
      :is-mobile="props.isMobile"
      @create-manual="handleOpenTambahBO"
      @cancel="handleCancelNotFound"
    />

    <BeneficialOwnerSaveConfirmModal
      v-model="showConfirmSaveModal"
      :is-mobile="props.isMobile"
      @confirm="handleConfirmSaveNewBO"
      @cancel="handleCancelConfirm"
    />

    <BeneficialOwnerSaveSuccessModal
      v-model="showSaveSuccessModal"
      :is-mobile="props.isMobile"
      @continue="handleContinueToDataRahin"
    />

    <BeneficialOwnerConfirmResetModal
      v-model="showConfirmResetModal"
      :is-mobile="props.isMobile"
      @confirm="handleConfirmResetTambah"
    />

    <BeneficialOwnerWarningModal
      v-model="showWarningModal"
      :title="warningModalTitle"
      :desc="warningModalDesc"
      :is-mobile="props.isMobile"
    />
  </div>
</template>

<style lang="scss" scoped>
.step1-pengajuan-content {
  min-width: 0;
  display: flex;
  flex-direction: column;

  @media (max-width: 767px) {
    width: 100%;
  }
}

.form-card {
  min-width: 0;
  border: 1px solid var(--g-kit-black-20, #eeeeef);
  border-radius: 8px;
  background: var(--g-kit-white, #ffffff);
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.14), 0px 0px 1px rgba(0, 0, 0, 0.08);
  overflow: visible;

  :deep(.module-section-card) {
    border: none;
    border-radius: 0;
    margin-bottom: 0;

    + .module-section-card {
      border-top: 8px solid var(--g-kit-black-20, #eeeeef);
    }
  }

  @media (max-width: 767px) {
    border: none;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;

    :deep(.module-section-card) {
      background: var(--g-kit-white, #ffffff);
      border: none;
      border-radius: 0;
      padding: 16px;
      margin-bottom: 0;

      + .module-section-card {
        border-top: none;
      }
    }
  }
}
</style>
