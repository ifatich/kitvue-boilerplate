<script setup lang="ts">
/**
 * @file PengajuanRahnView.vue
 * @description SPRINT Module View for Pengajuan Pinjaman Rahn.
 * Responsible strictly for business logic, form state, and step data.
 * Page layout and generic interactive containers are delegated to reusable components:
 * - SprintModuleShell: universal navbar, breadcrumb, sticky footer, sticky bottom action sheet
 * - MobileStepperBanner: mobile step progression indicator
 * - ModuleSectionCard: collapsible, accessible card container with zero-flicker CSS grid animation
 * - RahnReadonlyInfoGrid: domain module component for displaying readonly akad/verification data
 */
import { computed, nextTick, provide, ref, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { GAlert, GButton, GLoading, GModal, GStepper } from '@/components'
import submissionCloseIcon from 'kitvue-public/src/assets/icon/icon-system/icon-cross-fill.svg'
import {
  cityOptions,
  districtOptions,
  durationOptions as rahnDurationOptions,
  educationOptions,
  employmentOptions,
  fundOptions,
  genderOptions,
  identityOptions,
  incomeOptions,
  maritalOptions,
  nationalityOptions,
  nasabahTypeOptions,
  ownerOptions,
  populationOptions,
  productOptions,
  provinceOptions,
  purposeOptions,
  purposeTransactionOptions as allPurposeTransactionOptions,
  rahinTypeOptions,
  relationshipOptions,
  rubricOptions,
  subdistrictOptions,
  tariffOptions,
  validityOptions,
} from '@/components/modules/rahn/rahnOptions'
import SprintModuleShell from '@/components/shared/admin-layout/SprintModuleShell.vue'
import SubmissionSuccessIllustration from '@/components/shared/illustration/SubmissionSuccessIllustration.vue'
import MobileStepperBanner from '@/components/shared/stepper/MobileStepperBanner.vue'
import { type ReadonlyInfoItem } from '@/components/modules/rahn'
import BeneficialOwnerDetailView from './step-1/BeneficialOwnerDetailView.vue'
import RahnStep1PengajuanView from './step-1/Step1PengajuanView.vue'
import RahnStep2DataNasabahView from './step-2/Step2DataNasabahView.vue'
import RahnStep3DataJaminanView from './step-3/Step3DataJaminanView.vue'
import RahnStep4FasilitasPinjamanView from './step-4/Step4FasilitasPinjamanView.vue'
import RahnStep5DataReviewView from './step-5/Step5DataReviewView.vue'
import { type NasabahFields, type RahnApplicationFields, type RahnCollateral, type RahnCustomerSummary, rahnFlowKey } from './rahnFlow'
import './rahn-form.scss'

const router = useRouter()
const route = useRoute()
const isMobile = useMediaQuery('(max-width: 767px)')
const activeStep = ref(1)
const isBeneficialOwnerDetail = computed(() => route.params.view === 'beneficial-owner')

// Step 1 collapsible sections
const isInformasiRahnOpen = ref(true)
const isBeneficialOwnerOpen = ref(true)

// Step 2 state
const isInformasiNasabahOpen = ref(true)
const isNasabahInquired = ref(false)
const isNasabahSearchSubmitted = ref(false)
const isNasabahSelected = ref(false)
const customerSearchResults = ref<RahnCustomerSummary[]>([])
const selectedCustomer = ref<RahnCustomerSummary | null>(null)
const collaterals = ref<RahnCollateral[]>([])

const fields = ref<RahnApplicationFields>({
  tujuanPengajuan: '',
  tujuanTransaksi: '',
  pekerjaanTerkini: '',
  rubrikMarhun: '',
  skemaTarif: '',
  produk: '',
  jangkaWaktu: '',
  beneficialOwner: '',
  tipeRahin: '',
  tipeIdentitas: '',
  nikBeneficialOwner: '',
  hubunganBeneficialOwner: '',
  jenisKelamin: '',
  pendidikan: '',
  statusPerkawinan: '',
  namaPasangan: '',
  tanggalLahirPasangan: '',
  tanggungan: '',
  handphone: '',
  telepon: '',
  email: '',
  npwp: '',
  tipeKependudukan: '',
  kewarganegaraan: '',
  sumberDana: '',
  agama: '',
  penghasilan: '',
  pekerjaanBeneficialOwner: '',
  kodePos: '',
  provinsi: '',
  kota: '',
  kecamatan: '',
  kelurahan: '',
  rt: '',
  rw: '',
  alamat: '',
  alamatSaatIni: '',
  kodePosSaatIni: '',
  provinsiSaatIni: '',
  kotaSaatIni: '',
  kecamatanSaatIni: '',
  kelurahanSaatIni: '',
  rtSaatIni: '',
  rwSaatIni: '',
  namaBeneficialOwner: '',
  namaIbu: '',
  tempatLahir: '',
  tanggalLahir: '',
  masaBerlaku: '',
  masaBerlakuDate: '',
})

const fieldsNasabah = ref<NasabahFields>({
  tipeNasabah: 'Perorangan',
  nik: '',
})

const customerDirectory: RahnCustomerSummary[] = [{
  status: 'Konven',
  cif: '1234 1234 07',
  name: 'Anastasya Delistya',
  rating: 'Platinum',
  nik: '3204 1111 1298 0003',
  birthDate: '1 Januari 1990',
  dukcapil: 'Valid',
  motherName: 'Putri',
  gender: 'Perempuan',
  address: 'Jl. Salemba Raya No.10 9',
  phone: '0812 3456 7890',
  branch: 'Jakarta Pusat',
  postalCode: '12345',
  kelurahan: 'Gondangdia',
  kecamatan: 'Menteng',
  province: 'DKI Jakarta',
  city: 'Jakarta Pusat',
  rt: '001',
  rw: '002',
}]

const loanAmount = ref('')
const tariffChange = ref('Tidak')
const tariffRate = ref('')
const showSubmissionConfirmation = ref(false)
const submissionModalStep = ref<'confirmation' | 'success'>('confirmation')
const submissionNumber = '1234 5678 9012 3456'
const submissionCopied = ref(false)
const submissionCopyError = ref('')
const submissionCloseIconUrl = submissionCloseIcon as unknown as string

const durationOptions = computed(() => rahnDurationOptions)
const purposeTransactionOptions = computed(() => allPurposeTransactionOptions)
const isOwnerResultsVisible = ref(false)
const ownerMatchFound = ref(false)
const isOwnerDetailsVisible = ref(false)
const isExistingBeneficialOwnerSelected = ref(false)
const isOwnerDataConfirmed = ref(false)
const isOwnerAddressSame = ref(false)
const showOwnerNotFoundModal = ref(false)
const isSubmitted = ref(false)
const isStepTransitionLoading = ref(false)
const dukcapilStatus = ref<'idle' | 'success' | 'failed'>('idle')
const ownerAge = computed(() => {
  if (!fields.value.tanggalLahir) return null
  const birthDate = new Date(`${fields.value.tanggalLahir}T00:00:00`)
  if (Number.isNaN(birthDate.getTime())) return null
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--
  return age
})
const isRtValid = computed(() => /^\d{3}$/.test(fields.value.rt))
const isRwValid = computed(() => /^\d{3}$/.test(fields.value.rw))

watch(() => fields.value.tujuanPengajuan, () => {
  fields.value.tujuanTransaksi = ''
  fields.value.pekerjaanTerkini = ''
  fields.value.rubrikMarhun = ''
  fields.value.skemaTarif = ''
  fields.value.produk = ''
  fields.value.jangkaWaktu = ''
})
watch(() => fields.value.rubrikMarhun, () => {
  fields.value.skemaTarif = ''
  fields.value.produk = ''
  fields.value.jangkaWaktu = ''
})
watch(() => fields.value.skemaTarif, () => {
  fields.value.produk = ''
  fields.value.jangkaWaktu = ''
})
watch(() => fields.value.produk, () => {
  fields.value.jangkaWaktu = ''
})
watch(() => fields.value.provinsi, () => {
  fields.value.kota = ''
  fields.value.kecamatan = ''
  fields.value.kelurahan = ''
})
watch(() => fields.value.tipeIdentitas, (value) => {
  if (value === 'KTP') fields.value.kewarganegaraan = 'WNI'
  else fields.value.kewarganegaraan = ''
  fields.value.nikBeneficialOwner = ''
  fields.value.hubunganBeneficialOwner = ''
  isOwnerDataConfirmed.value = false
  isOwnerAddressSame.value = false
  isOwnerResultsVisible.value = false
  ownerMatchFound.value = false
  isExistingBeneficialOwnerSelected.value = false
  dukcapilStatus.value = 'idle'
})
watch(() => fields.value.kota, () => {
  fields.value.kecamatan = ''
  fields.value.kelurahan = ''
})
watch(() => fields.value.kecamatan, () => {
  fields.value.kelurahan = ''
})
watch(() => fields.value.kelurahan, (value) => {
  if (value === 'Pegangsaan') fields.value.kodePos = '10320'
})

const steps = [
  'Data Pengajuan',
  'Data Nasabah',
  'Data Jaminan',
  'Fasilitas Pinjaman',
  'Data Review',
]

const transitionToStep = async (targetStep: number) => {
  if (isStepTransitionLoading.value || targetStep === activeStep.value) return

  isStepTransitionLoading.value = true
  try {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 1600))
    activeStep.value = targetStep
    await nextTick()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    isStepTransitionLoading.value = false
  }
}

// Credit dates stay automatic until the selected loan duration is available.
const akadItems = computed<ReadonlyInfoItem[]>(() => {
  const durationDays = Number(fields.value.jangkaWaktu.match(/^(\d+)/)?.[1])
  if (!Number.isFinite(durationDays) || durationDays <= 0) {
    return [
      { label: 'Tanggal Kredit', value: 'Terisi otomatis' },
      { label: 'Tanggal Jatuh Tempo', value: 'Terisi otomatis' },
      { label: 'Tanggal Lelang', value: 'Terisi otomatis' },
    ]
  }

  const creditDate = new Date()
  creditDate.setHours(0, 0, 0, 0)
  const dueDate = new Date(creditDate)
  dueDate.setDate(dueDate.getDate() + durationDays)
  const auctionDate = new Date(dueDate)
  auctionDate.setDate(auctionDate.getDate() + 1)
  const formatDate = (date: Date) => new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)

  return [
    { label: 'Tanggal Kredit', value: formatDate(creditDate) },
    { label: 'Tanggal Jatuh Tempo', value: formatDate(dueDate) },
    { label: 'Tanggal Lelang', value: formatDate(auctionDate) },
  ]
})

const searchNasabah = () => {
  isNasabahSearchSubmitted.value = true
  const nik = fieldsNasabah.value.nik.trim().replace(/\s/g, '')
  customerSearchResults.value = /^\d{16}$/.test(nik)
    ? [{
        ...customerDirectory[0],
        nik: nik.replace(/(\d{4})(?=\d)/g, '$1 '),
      }]
    : []
  isNasabahInquired.value = customerSearchResults.value.length > 0
  const [onlyCustomer] = customerSearchResults.value
  isNasabahSelected.value = customerSearchResults.value.length === 1
  selectedCustomer.value = isNasabahSelected.value ? onlyCustomer ?? null : null
}

watch(() => fieldsNasabah.value.nik, () => {
  isNasabahInquired.value = false
  isNasabahSelected.value = false
  customerSearchResults.value = []
  selectedCustomer.value = null
})
watch(() => fieldsNasabah.value.tipeNasabah, () => {
  fieldsNasabah.value.nik = ''
  isNasabahInquired.value = false
  isNasabahSelected.value = false
  customerSearchResults.value = []
  selectedCustomer.value = null
})

const canContinue = computed(() => {
  if (activeStep.value === 1) {
    const applicationDataComplete = Boolean(
      fields.value.tujuanPengajuan && fields.value.tujuanTransaksi && fields.value.pekerjaanTerkini &&
      fields.value.rubrikMarhun && fields.value.skemaTarif && fields.value.produk && fields.value.jangkaWaktu &&
      fields.value.beneficialOwner,
    )
    return applicationDataComplete
  }
  if (activeStep.value === 2) {
    return isNasabahInquired.value && isNasabahSelected.value
  }
  if (activeStep.value === 3) {
    return collaterals.value.length > 0
  }
  return true
})

const nextStep = async () => {
  if (activeStep.value === steps.length) {
    submissionModalStep.value = 'confirmation'
    showSubmissionConfirmation.value = true
    return
  }

  if (isStepTransitionLoading.value) return

  if (activeStep.value === 2) isNasabahSearchSubmitted.value = true
  isSubmitted.value = true
  if (!canContinue.value) return
  if (activeStep.value < steps.length) {
    await transitionToStep(activeStep.value + 1)
  }
}

const confirmSubmission = () => {
  isSubmitted.value = true
  submissionModalStep.value = 'success'
  submissionCopied.value = false
  submissionCopyError.value = ''
}

const copySubmissionNumber = async () => {
  submissionCopyError.value = ''
  try {
    await navigator.clipboard.writeText(submissionNumber)
    submissionCopied.value = true
  } catch (error) {
    console.error('Unable to copy the submission number.', error)
    submissionCopyError.value = 'Nomor pengajuan tidak dapat disalin. Silakan salin secara manual.'
  }
}

const returnToEntryPage = async () => {
  showSubmissionConfirmation.value = false
  await router.push({ name: 'home' })
}

const searchBeneficialOwner = () => {
  isOwnerResultsVisible.value = true
  isExistingBeneficialOwnerSelected.value = false
  const identityNumber = fields.value.nikBeneficialOwner.replace(/\D/g, '')
  ownerMatchFound.value = fields.value.tipeIdentitas === 'KTP'
    ? identityNumber === '3204284912980003'
    : identityNumber === '0033971484'
  showOwnerNotFoundModal.value = !ownerMatchFound.value
}

const continueToAddBeneficialOwner = () => {
  showOwnerNotFoundModal.value = false
  isOwnerDetailsVisible.value = true
}

const openBeneficialOwnerDetail = async () => {
  const identityType = fields.value.tipeIdentitas
  const identityNumber = identityType === 'Paspor' ? '0033 9714 84' : '3204 2888 1222 0003'
  Object.assign(fields.value, {
    tipeRahin: 'Perorangan',
    tipeIdentitas: identityType,
    nikBeneficialOwner: identityNumber,
    namaBeneficialOwner: 'Anastasya Delistya',
    namaIbu: 'Putri',
    tempatLahir: 'Jakarta',
    tanggalLahir: '1999-01-12',
    masaBerlaku: 'Seumur Hidup',
    kodePos: '10320',
    provinsi: 'DKI Jakarta',
    kota: 'Jakarta Pusat',
    kecamatan: 'Menteng',
    kelurahan: 'Pegangsaan',
    rt: '001',
    rw: '002',
    alamat: 'Jl. Borobudur No.10 9',
    jenisKelamin: 'Perempuan',
    pendidikan: 'S1',
    statusPerkawinan: 'Menikah',
    namaPasangan: 'Annisya Syaban',
    tanggalLahirPasangan: '1993-01-12',
    tanggungan: '4',
    telepon: '0214 2345 5',
    handphone: '0812 2345 5678',
    email: 'thoriqsadad@gmail.com',
    npwp: '99.999.999.9-999.000',
    tipeKependudukan: 'Penduduk',
    sumberDana: 'Gaji',
    agama: 'Islam',
    pekerjaanBeneficialOwner: 'Karyawan Swasta',
    penghasilan: '5 - 10 Juta',
  })
  await nextTick()
  fields.value.provinsi = 'DKI Jakarta'
  await nextTick()
  fields.value.kota = 'Jakarta Pusat'
  await nextTick()
  fields.value.kecamatan = 'Menteng'
  await nextTick()
  fields.value.kelurahan = 'Pegangsaan'
  await nextTick()
  isExistingBeneficialOwnerSelected.value = true
  dukcapilStatus.value = identityType === 'KTP' ? 'success' : 'idle'
  await router.push({ name: 'pengajuan-gadai', params: { view: 'beneficial-owner' } })
}

const closeBeneficialOwnerDetail = () => {
  router.push({ name: 'pengajuan-gadai', params: { view: undefined } })
}

const continueFromBeneficialOwnerDetail = async () => {
  await nextStep()
  if (activeStep.value > 1) closeBeneficialOwnerDetail()
}

const checkDukcapil = () => {
  dukcapilStatus.value = fields.value.nikBeneficialOwner.replace(/\D/g, '').length === 16 ? 'success' : 'failed'
}

const prevStep = async () => {
  if (activeStep.value > 1) {
    await transitionToStep(activeStep.value - 1)
  } else {
    router.push('/beranda')
  }
}

const handleModuleBack = () => {
  return prevStep()
}

const handleStepperChange = (step: number) => {
  if (step < activeStep.value) return transitionToStep(step)
}

provide(rahnFlowKey, {
  steps,
  fields,
  fieldsNasabah,
  customerSearchResults,
  selectedCustomer,
  collaterals,
  loanAmount,
  tariffChange,
  tariffRate,
  isMobile,
  isSubmitted,
  isInformasiRahnOpen,
  isBeneficialOwnerOpen,
  isInformasiNasabahOpen,
  isNasabahInquired,
  isNasabahSearchSubmitted,
  isNasabahSelected,
  purposeOptions,
  purposeTransactionOptions,
  employmentOptions,
  rubricOptions,
  tariffOptions,
  productOptions,
  durationOptions,
  ownerOptions,
  rahinTypeOptions,
  identityOptions,
  relationshipOptions,
  genderOptions,
  educationOptions,
  maritalOptions,
  populationOptions,
  fundOptions,
  incomeOptions,
  validityOptions,
  nationalityOptions,
  provinceOptions,
  cityOptions,
  districtOptions,
  subdistrictOptions,
  nasabahTypeOptions,
  isOwnerResultsVisible,
  ownerMatchFound,
  isOwnerDetailsVisible,
  isExistingBeneficialOwnerSelected,
  isOwnerDataConfirmed,
  isOwnerAddressSame,
  showOwnerNotFoundModal,
  dukcapilStatus,
  ownerAge,
  isRtValid,
  isRwValid,
  akadItems,
  searchNasabah,
  searchBeneficialOwner,
  continueToAddBeneficialOwner,
  openBeneficialOwnerDetail,
  checkDukcapil,
})
</script>

<template>
  <BeneficialOwnerDetailView
    v-if="isBeneficialOwnerDetail"
    v-model:active-step="activeStep"
    v-model:relationship="fields.hubunganBeneficialOwner"
    :is-submitted="isSubmitted"
    :identity-type="fields.tipeIdentitas === 'Paspor' ? 'Paspor' : 'KTP'"
    @back="closeBeneficialOwnerDetail"
    @next="continueFromBeneficialOwnerDetail"
  />

  <SprintModuleShell
    v-else
    title="Pengajuan Gadai"
    :breadcrumbs="[{ label: 'Beranda', to: '/beranda' }, { label: 'Pinjaman Gadai' }, 'Pengajuan Gadai']"
    back-to="/beranda"
    profile-role="Penaksir"
    :show-auth-toggle="false"
    entry-navbar
    :wide="activeStep <= 5"
    search-placeholder="Cari (contoh: Pengajuan Gadai/Rahn)"
    @back="handleModuleBack"
  >
    <template #mobile-stepper>
      <MobileStepperBanner
        :active-step="activeStep"
        :steps="steps"
      />
    </template>

    <template #notice>
      <GAlert
        v-if="activeStep === 1"
        class="rahn-notice variant"
        label="Pastikan data yang diisi telah sesuai dengan data Nasabah."
        color="light-blue"
        variant="info"
      />
      <GAlert
        v-else-if="activeStep >= 2"
        class="rahn-notice variant"
        label="Pastikan data yang diisi telah sesuai dengan data Nasabah."
        color="light-blue"
        variant="info"
      />
    </template>

    <div class="application-layout">
      <GStepper
        v-if="!isMobile"
        :active-step="activeStep"
        class="rahn-stepper"
        label="Langkah"
        :items="steps"
        :enable-step-untill="activeStep"
        @update:active-step="handleStepperChange"
      />

      <RahnStep1PengajuanView v-if="activeStep === 1" />
      <RahnStep2DataNasabahView v-else-if="activeStep === 2" />
      <RahnStep3DataJaminanView v-else-if="activeStep === 3" />
      <RahnStep4FasilitasPinjamanView v-else-if="activeStep === 4" />
      <RahnStep5DataReviewView v-else />
    </div>

    <template #actions>
      <GButton
        v-if="activeStep > 1"
        label="Sebelumnya"
        type="outline"
        size="md"
        @click="prevStep"
      />
      <GButton
        :label="activeStep === steps.length ? 'Proses Pengajuan' : 'Selanjutnya'"
        type="primary"
        size="md"
        :disabled="activeStep > 2 && !canContinue"
        @click="nextStep"
      />
    </template>
  </SprintModuleShell>

  <GModal
    v-model="showSubmissionConfirmation"
    :class="[
      'rahn-submission-modal',
      `rahn-submission-modal--${submissionModalStep}`,
    ]"
    centered
    :title="submissionModalStep === 'confirmation' ? 'Konfirmasi' : ''"
    :show-close-button="false"
  >
    <template #header>
      <div v-if="submissionModalStep === 'confirmation'" class="rahn-submission-modal__header">
        <h2>Konfirmasi</h2>
        <button
          type="button"
          class="rahn-submission-modal__close"
          aria-label="Tutup"
          @click="showSubmissionConfirmation = false"
        >
          <img :src="submissionCloseIconUrl" alt="">
        </button>
      </div>
    </template>
    <template #body>
      <p v-if="submissionModalStep === 'confirmation'" class="rahn-submission-modal__confirmation-copy">
        Apakah Anda yakin untuk memproses pengajuan ini?
      </p>
      <div v-else class="rahn-submission-modal__success-content">
        <SubmissionSuccessIllustration />
        <div class="rahn-submission-modal__success-copy">
          <h2>Pengajuan Berhasil</h2>
          <p>Pengajuan Rahn berhasil Anda ajukan.</p>
          <div class="rahn-submission-modal__submission-number">
            <span class="rahn-submission-modal__submission-number-label">Nomor Pengajuan</span>
            <div class="rahn-submission-modal__submission-number-field">
              <span>{{ submissionNumber }}</span>
              <button type="button" @click="copySubmissionNumber">
                {{ submissionCopied ? 'Tersalin' : 'Salin' }}
              </button>
            </div>
            <p v-if="submissionCopyError" class="rahn-submission-modal__copy-error" role="alert">
              {{ submissionCopyError }}
            </p>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="rahn-submission-modal__actions">
        <template v-if="submissionModalStep === 'confirmation'">
          <GButton
            label="Batal"
            type="neutral"
            size="md"
            @click="showSubmissionConfirmation = false"
          />
          <GButton
            label="Ya, Proses Pengajuan"
            type="primary"
            size="md"
            @click="confirmSubmission"
          />
        </template>
        <GButton
          v-else
          label="Mengerti"
          type="primary"
          size="md"
          @click="returnToEntryPage"
        />
      </div>
    </template>
  </GModal>

  <GLoading
    v-model="isStepTransitionLoading"
    class="kitvue-loading rahn-loading"
    :count="0"
    title="Memproses Data"
    persistent
  />
</template>

<style lang="scss">
.rahn-submission-modal.show {
  display: block !important;
}

.rahn-submission-modal {
  .modal-dialog {
    position: relative;
    z-index: 1051;
    width: calc(100% - 32px);
    max-width: 360px;
  }

  .modal-content {
    overflow: hidden;
    border: 0;
    border-radius: 12px;
  }

}

.rahn-submission-modal--confirmation .modal-header {
  padding: 16px 16px 15px;
}

.rahn-submission-modal--confirmation.modal-general.border-bottom .modal-header {
  border-bottom: 1px solid var(--g-kit-black-20, #eeeeef);
}

.rahn-submission-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 26px;

  h2 {
    margin: 0;
    color: var(--g-kit-black-80, #252528);
    font-size: 18px;
    font-weight: var(--g-kit-font-weight-bold, 800);
    line-height: 26px;
  }
}

.rahn-submission-modal__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.rahn-submission-modal--confirmation .modal-body {
  padding: 16px 16px 0;
}

.rahn-submission-modal__confirmation-copy {
  margin: 0;
  color: var(--g-kit-black-60, #58585b);
  font-size: 14px;
  font-weight: var(--g-kit-font-weight-normal, 600);
  line-height: 20px;
}

.rahn-submission-modal--confirmation .modal-footer {
  padding: 16px;
  border: 0;
}

.rahn-submission-modal__actions {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
  gap: 8px;

  .btn {
    width: 100%;
    height: 40px;
    border-radius: 6px;
    font-size: 16px;
    font-weight: var(--g-kit-font-weight-bold, 800);
    line-height: 24px;
  }
}

.rahn-submission-modal--success .modal-header {
  display: none;
}

.rahn-submission-modal--success .modal-body {
  padding: 50px 16px 0;
}

.rahn-submission-modal__success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 24px;
}

.rahn-submission-modal__success-copy {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;

  h2 {
    margin: 0;
    color: var(--g-kit-black-80, #252528);
    font-size: 20px;
    font-weight: var(--g-kit-font-weight-bold, 800);
    line-height: 30px;
  }

  > p {
    margin: 0;
    color: var(--g-kit-black-60, #58585b);
    font-size: 16px;
    font-weight: var(--g-kit-font-weight-normal, 600);
    line-height: 24px;
  }
}

.rahn-submission-modal__submission-number {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;
}

.rahn-submission-modal__submission-number-label {
  color: var(--g-kit-black-60, #58585b);
  font-size: 14px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 20px;
}

.rahn-submission-modal__submission-number-field {
  display: flex;
  min-height: 48px;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid var(--g-kit-lime-10, #e6f6ea);
  border-radius: 6px;
  background: var(--g-kit-lime-10, #e6f6ea);
  gap: 8px;

  span {
    min-width: 0;
    color: var(--g-kit-black-60, #58585b);
    font-size: 16px;
    font-weight: var(--g-kit-font-weight-normal, 600);
    line-height: 24px;
  }

  button {
    flex: 0 0 80px;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--g-kit-lime-50, #00ab4e);
    font-size: 16px;
    font-weight: var(--g-kit-font-weight-bold, 800);
    line-height: 24px;
    text-align: right;
    cursor: pointer;
  }
}

.rahn-submission-modal__copy-error {
  margin: 0;
  color: var(--g-kit-red-50, #ae1e22);
  font-size: 12px;
  line-height: 16px;
}

.rahn-submission-modal--success .modal-footer {
  padding: 24px 16px 16px;
  border: 0;
}
</style>
