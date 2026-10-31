<script setup lang="ts">
/**
 * @file PengajuanRahnView.vue
 * @description SPRINT Module View for Pengajuan Pinjaman Rahn.
 * Responsible strictly for root stepper orchestration, route navigation,
 * and high-level notifications.
 *
 * Conforms 1:1 with Figma frames:
 * - Step 1: Data Pengajuan (Node 12920:311792, 12920:307127, 12920:314583, 11347:151906)
 * - Step 2: Data Rahin (Node 11347:148654)
 * - Step 3+: Data Jaminan, Fasilitas Pinjaman, Data Review
 */
import { onUnmounted, ref, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import {
  GAlert,
  GButton,
  GStepper,
} from '@/components'
import SprintModuleShell from '@/components/shared/admin-layout/SprintModuleShell.vue'
import MobileStepperBanner from '@/components/shared/stepper/MobileStepperBanner.vue'
import ModuleSectionCard from '@/components/shared/card/ModuleSectionCard.vue'
import {
  type BeneficialOwnerState,
  type RahnFields,
  type RahinFields,
  Step1PengajuanContent,
  Step2RahinContent,
} from '@/components/modules/rahn'
import {
  type UsecaseAction,
  buildRahnPath,
  parseRahnRouteParams,
} from '@/router/rahnRouting'
import {
  MOCK_BENEFICIAL_OWNERS,
  findBeneficialOwnerById,
} from '@/components/modules/rahn/mockBeneficialOwnerData'
import {
  MOCK_RAHIN_CIF_DATABASE,
  findRahinCifById,
} from '@/components/modules/rahn/mockRahinData'

const router = useRouter()
const route = useRoute()
const isMobile = useMediaQuery('(max-width: 767px)')

// Initialize state from current route
const initialRouteState = parseRahnRouteParams(route?.params)
const activeStep = ref(initialRouteState.stepNumber)
const activeAction = ref<UsecaseAction>(initialRouteState.action)
const activeRecordId = ref<string | undefined>(initialRouteState.id)

// Step 1 sub-view state ('search' | 'detail' | 'tambah')
const step1SubView = ref<'search' | 'detail' | 'tambah'>('search')
// Step 2 sub-view state ('search' | 'detail')
const step2SubView = ref<'search' | 'detail'>('search')
const step1Ref = ref<InstanceType<typeof Step1PengajuanContent> | null>(null)
const step2Ref = ref<InstanceType<typeof Step2RahinContent> | null>(null)

// Root validation alert state
const validationAlert = ref<string | null>(null)

// Step 1 Form Fields: Informasi Rahn (All empty by default matching Figma)
const fields = ref<RahnFields>({
  tujuanPengajuan: '',
  tujuanTransaksi: '',
  pekerjaanTerkini: '',
  rubrikMarhun: '',
  skemaTarif: '',
  produk: '',
  jangkaWaktu: '',
})

// Step 1 Form Fields: Beneficial Owner (All empty by default matching Figma)
const boState = ref<BeneficialOwnerState>({
  type: '',
  tipeRahin: '',
  identityType: '',
  identityNumber: '',
  relationship: '',
  selectedBO: null,
  document: null,
  isAlamatSesuaiKtp: false,
})

// Step 2 Form Fields: Data Rahin (Empty by default)
const fieldsRahin = ref<RahinFields>({
  nik: '',
  nama: '',
  noHp: '',
  pekerjaan: '',
  nominal: '',
  alamat: '',
  hubungan: '',
})

// Step definitions (1:1 with Figma Stepper)
const steps = [
  'Data Pengajuan',
  'Data Rahin',
  'Data Jaminan',
  'Fasilitas Pinjaman',
  'Data Review',
]

// Bidirectional Synchronization & Infinite Loop Guard (Requirement R2)
let isSyncingFromRoute = false

const syncStateFromRoute = (params?: any) => {
  const parsed = parseRahnRouteParams(params || route?.params)
  isSyncingFromRoute = true
  activeStep.value = parsed.stepNumber
  activeAction.value = parsed.action
  activeRecordId.value = parsed.id

  if (parsed.stepNumber === 1) {
    if (parsed.id) {
      const foundBO = findBeneficialOwnerById(parsed.id)
      if (foundBO) {
        boState.value.selectedBO = foundBO
        boState.value.type = 'orang_lain'
        boState.value.identityType = foundBO.pasporNumber ? 'paspor' : 'ktp'
        boState.value.identityNumber = foundBO.pasporNumber || foundBO.nik
      }
    } else if ((parsed.action === 'preview' || parsed.action === 'update') && !boState.value.selectedBO) {
      if (MOCK_BENEFICIAL_OWNERS.length > 0) {
        boState.value.selectedBO = MOCK_BENEFICIAL_OWNERS[0]
        boState.value.type = 'orang_lain'
        boState.value.identityType = 'ktp'
        boState.value.identityNumber = MOCK_BENEFICIAL_OWNERS[0].nik
      }
    }
    // Map action to step1SubView
    if (parsed.action === 'create') {
      step1SubView.value = 'tambah'
    } else if (parsed.action === 'preview' || parsed.action === 'update') {
      step1SubView.value = 'detail'
    } else {
      step1SubView.value = 'search'
    }
  } else if (parsed.stepNumber === 2) {
    const targetId = parsed.id || ((parsed.action === 'preview' || parsed.action === 'update') ? (step2Ref.value?.step2State?.selectedCifId || MOCK_RAHIN_CIF_DATABASE[0].id) : undefined)
    if (targetId) {
      const foundCif = findRahinCifById(targetId)
      if (foundCif) {
        fieldsRahin.value.cif = foundCif.nomorCif
        fieldsRahin.value.nik = foundCif.rawIdentitas
        fieldsRahin.value.nama = foundCif.namaRahin
        fieldsRahin.value.jenisIdentitas = foundCif.jenisIdentitas
        fieldsRahin.value.statusRahin = foundCif.statusRahin
        fieldsRahin.value.ratingRahin = foundCif.ratingRahin
        fieldsRahin.value.alamat = foundCif.alamatRumah
        fieldsRahin.value.noHp = foundCif.noHp
        fieldsRahin.value.cabangPembuka = foundCif.cabangPembuka
      }
    }
    // Map action to step2SubView
    if (parsed.action === 'entry') {
      step2SubView.value = 'search'
    } else {
      step2SubView.value = 'detail'
    }
  }

  isSyncingFromRoute = false
}

// Initial sync on mount
syncStateFromRoute()

// Watch route params for back/forward or external navigation
if (route) {
  watch(
    () => route.params,
    () => {
      syncStateFromRoute()
    },
    { deep: true, flush: 'sync' },
  )
}

if (router && typeof router.afterEach === 'function') {
  const unhook = router.afterEach((to) => {
    syncStateFromRoute(to.params)
  })
  onUnmounted(() => {
    if (typeof unhook === 'function') unhook()
  })
}

const navigateToRoute = (
  step: number,
  action: UsecaseAction = 'entry',
  id?: string,
  replace = false,
) => {
  if (isSyncingFromRoute) return Promise.resolve()
  if (!router) return Promise.resolve()
  const targetPath = buildRahnPath(step, action, id)
  const currentPath = route?.path || ''
  if (currentPath !== targetPath) {
    if (replace) {
      return router.replace(targetPath)
    } else {
      return router.push(targetPath)
    }
  }
  return Promise.resolve()
}

// Watch activeStep changes (e.g. from GStepper click)
watch(
  activeStep,
  (newStep, oldStep) => {
    if (isSyncingFromRoute) return
    if (newStep !== oldStep) {
      activeAction.value = 'entry'
      activeRecordId.value = undefined
      navigateToRoute(newStep, 'entry')
    }
  },
  { flush: 'sync' },
)

const nextStep = () => {
  if (activeStep.value === 1) {
    const canAdvance = step1Ref.value?.handleNext ? step1Ref.value.handleNext() : true
    if (canAdvance) {
      validationAlert.value = null
      activeStep.value = 2
      activeAction.value = 'entry'
      activeRecordId.value = undefined
      const p = navigateToRoute(2, 'entry')
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return p
    }
    return Promise.resolve()
  }

  if (activeStep.value === 2) {
    const result = step2Ref.value?.handleNext ? step2Ref.value.handleNext() : { valid: true }
    if (result && !result.valid) {
      validationAlert.value = result.message || 'Mohon lengkapi data identitas Rahin.'
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return Promise.resolve()
    }
    if (result && result.handled) {
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return Promise.resolve()
    }
    validationAlert.value = null
    activeStep.value = 3
    activeAction.value = 'entry'
    activeRecordId.value = undefined
    const p = navigateToRoute(3, 'entry')
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    return p
  }

  if (activeStep.value < steps.length) {
    activeStep.value++
    activeAction.value = 'entry'
    activeRecordId.value = undefined
    const p = navigateToRoute(activeStep.value, 'entry')
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    return p
  }
  return Promise.resolve()
}

const prevStep = () => {
  validationAlert.value = null
  if (activeStep.value === 1) {
    const canExit = step1Ref.value?.handlePrev ? step1Ref.value.handlePrev() : true
    if (canExit) {
      if (router) return router.push('/')
    }
    return Promise.resolve()
  }

  if (activeStep.value === 2) {
    const canExit = step2Ref.value?.handlePrev ? step2Ref.value.handlePrev() : true
    if (canExit) {
      activeStep.value = 1
      step1SubView.value = 'search'
      activeAction.value = 'entry'
      activeRecordId.value = undefined
      const p = navigateToRoute(1, 'entry')
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return p
    }
    return Promise.resolve()
  }

  if (activeStep.value > 2) {
    activeStep.value--
    activeAction.value = 'entry'
    activeRecordId.value = undefined
    const p = navigateToRoute(activeStep.value, 'entry')
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    return p
  }
  return Promise.resolve()
}

const handleStep1Advance = () => {
  activeStep.value = 2
  activeAction.value = 'entry'
  activeRecordId.value = undefined
  navigateToRoute(2, 'entry')
}

const handleStep1ActionChange = (action: UsecaseAction, recordId?: string) => {
  if (isSyncingFromRoute) return
  activeAction.value = action
  activeRecordId.value = recordId || (action === 'entry' || action === 'create' ? undefined : activeRecordId.value)
  navigateToRoute(1, action, activeRecordId.value)
}

const handleStep2Advance = () => {
  activeStep.value = 3
  activeAction.value = 'entry'
  activeRecordId.value = undefined
  navigateToRoute(3, 'entry')
}

const handleStep2Back = () => {
  activeStep.value = 1
  activeAction.value = 'entry'
  activeRecordId.value = undefined
  navigateToRoute(1, 'entry')
}

const handleStep2ActionChange = (action: UsecaseAction, recordId?: string) => {
  if (isSyncingFromRoute) return
  activeAction.value = action
  activeRecordId.value = recordId || (action === 'entry' || action === 'create' ? undefined : activeRecordId.value)
  navigateToRoute(2, action, activeRecordId.value)
}

const handleModuleBack = () => {
  prevStep()
}

defineExpose({
  activeStep,
  activeAction,
  activeRecordId,
  step1SubView,
  step2SubView,
  fields,
  boState,
  fieldsRahin,
  syncStateFromRoute,
  navigateToRoute,
  nextStep,
  prevStep,
})
</script>

<template>
  <SprintModuleShell
    title="Pengajuan Rahn"
    :breadcrumbs="[{ label: 'Beranda', to: '/' }, { label: 'Pengajuan' }, 'Pengajuan Rahn']"
    back-to="/"
    profile-role="Penaksir"
    :show-auth-toggle="false"
    @back="handleModuleBack"
  >
    <template #mobile-stepper>
      <MobileStepperBanner
        :active-step="activeStep"
        :steps="steps"
      />
    </template>

    <template #notice>
      <!-- Validation Error / Warning Alert -->
      <GAlert
        v-if="validationAlert"
        class="rahn-notice rahn-notice-top variant"
        :label="validationAlert"
        :color="validationAlert.includes('Pilih salah satu data CIF syariah') ? 'yellow' : 'red'"
        :variant="validationAlert.includes('Pilih salah satu data CIF syariah') ? 'warning' : 'danger'"
      />

      <!-- Default SPRINT Step Guidelines -->
      <GAlert
        v-else-if="activeStep === 1"
        class="rahn-notice rahn-notice-top variant"
        label="Pastikan data yang diisi telah sesuai dengan data Rahin."
        color="light-blue"
        variant="info"
      />
      <GAlert
        v-else-if="activeStep === 2"
        class="rahn-notice rahn-notice-top variant"
        label="Pastikan data yang diisi telah sesuai dengan data Rahin."
        color="light-blue"
        variant="info"
      />
    </template>

    <div class="application-layout">
      <!-- Desktop Sidebar Stepper (1:1 with Figma) -->
      <GStepper
        v-if="!isMobile"
        v-model:active-step="activeStep"
        class="rahn-stepper"
        label="Langkah"
        :items="steps"
        :enable-step-untill="activeStep"
      />

      <!-- STEP 1: DATA PENGAJUAN -->
      <Step1PengajuanContent
        v-if="activeStep === 1"
        ref="step1Ref"
        v-model:fields="fields"
        v-model:bo-state="boState"
        v-model:sub-view="step1SubView"
        v-model:validation-alert="validationAlert"
        :action="activeAction"
        :record-id="activeRecordId"
        :is-mobile="isMobile"
        @advance="handleStep1Advance"
        @back-to-root="router ? router.push('/') : undefined"
        @update:action="handleStep1ActionChange"
      />

      <!-- STEP 2: DATA RAHIN -->
      <Step2RahinContent
        v-else-if="activeStep === 2"
        ref="step2Ref"
        v-model:fields="fieldsRahin"
        v-model:bo-state="boState"
        v-model:sub-view="step2SubView"
        :action="activeAction"
        :record-id="activeRecordId"
        :is-mobile="isMobile"
        @advance="handleStep2Advance"
        @back="handleStep2Back"
        @clear-validation="validationAlert = null"
        @update:action="handleStep2ActionChange"
      />

      <!-- FALLBACK STEP -->
      <div v-else class="form-content">
        <div class="form-card">
          <ModuleSectionCard :title="steps[activeStep - 1]" :collapsible="false">
            <p class="mt-2 text-muted">Tahapan sedang dalam pengembangan.</p>
          </ModuleSectionCard>
        </div>
      </div>
    </div>

    <!-- Sticky Bottom Action Sheet -->
    <template #actions>
      <!-- Tombol Sebelumnya: tampil jika berada di step > 1 ATAU di subview selain search di step 1 -->
      <GButton
        v-if="activeStep > 1 || (activeStep === 1 && step1SubView !== 'search')"
        label="Sebelumnya"
        type="outline"
        size="md"
        style="width: 200px;"
        @click="prevStep"
      />
      <!-- Tombol Selanjutnya: selalu 200px di desktop -->
      <GButton
        label="Selanjutnya"
        type="primary"
        size="md"
        style="width: 200px;"
        @click="nextStep"
      />
    </template>
  </SprintModuleShell>
</template>

<style lang="scss" scoped>
.rahn-notice-top {
  margin: 16px 0 12px;

  @media (max-width: 767px) {
    margin: 12px 16px;
  }
}

.application-layout {
  flex: 1 1 auto;
  display: grid;
  grid-template-columns: 270px minmax(0, 1fr);
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 767px) {
    display: block;
    width: 100%;
    margin-bottom: 0;
  }
}

.rahn-stepper {
  width: 270px;
  height: fit-content;
  border-radius: 8px;
  background-color: var(--g-kit-black-10, #f8f8f8);

  :deep(.label-stepper) {
    font-size: 20px !important;
    font-weight: 800 !important;
    line-height: 30px !important;
    color: var(--g-kit-black-80, #252528) !important;
    margin-bottom: 32px !important;
  }

  :deep(ol.stepper-list li) {
    margin-bottom: 32px !important;

    &:last-child {
      margin-bottom: 0 !important;
    }

    a.active {
      color: var(--g-kit-black-80, #252528) !important;
      font-size: 16px !important;
      font-weight: 800 !important;
      line-height: 24px !important;
    }

    span {
      font-size: 16px !important;
      font-weight: 800 !important;
      line-height: 24px !important;
      color: var(--g-kit-black-50, #939597) !important;
    }
  }

  @media (max-width: 767px) {
    display: none;
  }
}

.form-content {
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
