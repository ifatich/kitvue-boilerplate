<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { GAlert, GButton, GDropdown, GInputNominalStart, GInputText, GModal, GRadio, GTooltip } from '@/components'
import submissionCloseIcon from 'kitvue-public/src/assets/icon/icon-system/icon-cross-fill.svg'
import RahnApplicationDropdowns from '@/components/modules/rahn/RahnApplicationDropdowns.vue'
import {
  nasabahTypeOptions,
  ownerOptions,
  productiveTransactionOptions,
  consumptiveTransactionOptions,
  tariffChangeOptions,
  RahnCollateralTable,
  RahnAutoValueField,
  RahnReadonlyInfoGrid,
  type ReadonlyInfoItem,
} from '@/components/modules/rahn'
import RahnCollateralFormModal from '@/components/modules/rahn/RahnCollateralFormModal.vue'
import SubmissionSuccessIllustration from '@/components/shared/illustration/SubmissionSuccessIllustration.vue'
import ModuleSectionCard from '@/components/shared/card/ModuleSectionCard.vue'
import SprintModuleShell from '@/components/shared/admin-layout/SprintModuleShell.vue'
import {
  calculateRahnLoan,
  getMaximumRahnLoan,
  getRemainingRahnLoanLimit,
  getRahnLoanTier,
} from '@/utils/rahnLoanCalculation'
import type { RahnCollateral } from '@/views/rahn/rahnFlow'
import { useAppAlert } from '@/hooks/useAppAlert'

interface Collateral extends RahnCollateral {
  id: number
}

const router = useRouter()
const { showAlert } = useAppAlert()
const isMobile = useMediaQuery('(max-width: 767px)')
const customerType = ref('Perorangan')
const nik = ref('')
const hasSearchedCustomer = ref(false)
const customerDetailsExpanded = ref(false)
const customerSearchError = ref('')
const isSubmitted = ref(false)
const fields = ref({
  purpose: '',
  transactionPurpose: '',
  employment: '',
  rubric: '',
  product: '',
  tariff: '',
  duration: '',
  beneficialOwner: '',
})
const isCustomerOpen = ref(true)
const isApplicationOpen = ref(false)
const isBeneficialOwnerOpen = ref(false)
const isCollateralOpen = ref(false)
const isCreditOpen = ref(false)
const collaterals = ref<Collateral[]>([])
const nextCollateralId = ref(1)
const showCollateralModal = ref(false)
const editingCollateral = ref<Collateral | null>(null)
const loanAmount = ref('')
const tariffChange = ref('Tidak')
const specialTariffRate = ref('')
const calculationError = ref('')
const isCalculated = ref(false)
const showSubmissionModal = ref(false)
const submissionModalStep = ref<'confirmation' | 'success'>('confirmation')
const submissionError = ref('')
const submissionCloseIconUrl = submissionCloseIcon as unknown as string
const submissionNumber = '1234 5678 9012 3456'
const submissionCopied = ref(false)
const submissionCopyError = ref('')

const cleanNik = computed(() => nik.value.replace(/\D/g, '').slice(0, 16))
const formattedNik = computed(() => cleanNik.value.replace(/(\d{4})(?=\d)/g, '$1 '))
const customerIdentityItems = computed<ReadonlyInfoItem[]>(() => [
  { label: 'Nomor Induk Kependudukan (NIK)', value: formattedNik.value },
  { label: 'Nama Nasabah', value: 'Anastasya Delistya' },
  { label: 'Tipe Nasabah', value: customerType.value },
  { label: 'CIF', value: '1234 1234 07' },
  { label: 'Pekerjaan', value: 'Karyawan Swasta' },
  { label: 'Nomor Handphone', value: '0812 3456 7890' },
])
const customerIdentityAddressItems: ReadonlyInfoItem[] = [
  { label: 'Kode Pos', value: '12345' },
  { label: 'Provinsi', value: 'DKI Jakarta' },
  { label: 'Kota / Kabupaten', value: 'Jakarta Pusat' },
  { label: 'Kecamatan', value: 'Menteng' },
  { label: 'Kelurahan', value: 'Gondangdia' },
  { label: 'RT', value: '001' },
  { label: 'RW', value: '001' },
  { label: 'Alamat', value: 'Jl. Taman Mini Indah No.01' },
]
const customerCurrentAddressItems: ReadonlyInfoItem[] = [
  { label: 'Kode Pos', value: '12345' },
  { label: 'Provinsi', value: 'DKI Jakarta' },
  { label: 'Kota / Kabupaten', value: 'Jakarta Pusat' },
  { label: 'Kecamatan', value: 'Menteng' },
  { label: 'Kelurahan', value: 'Gondangdia' },
  { label: 'RT', value: '001' },
  { label: 'RW', value: '001' },
  { label: 'Alamat', value: 'Jl. Taman Mini Indah No.01' },
]
const customerEmergencyContactItems: ReadonlyInfoItem[] = [
  { label: 'Nama Koresponden', value: 'Selena Alina' },
  { label: 'Hubungan', value: 'Ibu Kandung' },
  { label: 'Nomor Handphone', value: '0812 3456 7890' },
  { label: 'Pekerjaan', value: 'Karyawan Swasta' },
]
const transactionOptions = computed(() => fields.value.purpose === 'Produktif'
  ? productiveTransactionOptions
  : consumptiveTransactionOptions)
const totalAppraisal = computed(() => collaterals.value.reduce((sum, item) => sum + item.estimatedValue, 0))
const loanAmountValue = computed(() => Number(loanAmount.value.replace(/\D/g, '')) || 0)
const loanTier = computed(() => getRahnLoanTier(loanAmountValue.value))
const remainingLoanLimit = computed(() => getRemainingRahnLoanLimit(
  maximumRatedLoan.value,
  loanAmountValue.value,
))
const loanTierLabel = computed(() => loanTier.value
  ? `${loanTier.value.group} (${loanTier.value.code})`
  : 'Terisi otomatis')
const maximumNormalLoan = computed(() => Math.floor(totalAppraisal.value * 0.8))
const maximumRatedLoan = computed(() => getMaximumRahnLoan(totalAppraisal.value))
const tariffTier = computed(() => getRahnLoanTier(loanAmountValue.value || maximumRatedLoan.value))
const appliedTariffRate = computed(() => {
  if (tariffChange.value === 'Iya') return Number(specialTariffRate.value.replace(',', '.'))
  return loanTier.value?.tariffRate ?? Number.NaN
})
const calculation = computed(() => {
  if (!isCalculated.value) return undefined
  return calculateRahnLoan(
    loanAmountValue.value,
    totalAppraisal.value,
    appliedTariffRate.value,
    Number.parseInt(fields.value.duration, 10),
  )
})
const tariffSummaryItems = computed<ReadonlyInfoItem[]>(() => [
  { label: 'Skema Tarif', value: fields.value.tariff || '-' },
  { label: 'Jangka Waktu', value: fields.value.duration || '-' },
])
const loanSummaryItems = computed<ReadonlyInfoItem[]>(() => [
  { label: 'Total Taksiran Jaminan', value: displayAmount(totalAppraisal.value) },
  { label: 'Maksimal Pinjaman Customer Rating', value: displayAmount(maximumRatedLoan.value) },
  { label: 'Maksimal Pinjaman Normal', value: displayAmount(maximumNormalLoan.value) },
])
const loanSimulationFields = computed(() => [
  {
    label: 'Nominal Biaya Administrasi',
    value: calculation.value?.administrationFee,
    tooltip: 'Biaya yang dikenakan kepada nasabah atas proses pengajuan dan pencairan pinjaman.',
  },
  {
    label: 'Nominal Biaya Asuransi',
    value: calculation.value?.premiumFee,
    tooltip: 'Biaya perlindungan asuransi yang dikenakan sesuai ketentuan produk pinjaman.',
  },
  {
    label: 'Sewa Modal Maksimum',
    value: calculation.value?.totalRental,
    tooltip: 'Uang Pinjaman Diajukan * Sewa Modal per Hari * Jangka Waktu',
  },
  {
    label: 'Nominal Sewa Modal Per Hari',
    value: calculation.value?.periodicRental,
    tooltip: 'Uang Pinjaman Diajukan * Sewa Modal per Hari',
  },
  {
    label: 'Sisa Limit Pinjaman',
    value: calculation.value ? remainingLoanLimit.value : undefined,
    tooltip: 'Maksimal Pinjaman - Uang Pinjaman Diajukan',
  },
])
const loanSettlementFields = computed(() => [
  {
    label: 'Estimasi Uang Pinjaman Diterima',
    value: calculation.value?.receivedAmount,
    tooltip: 'Uang Pinjaman Diajukan - Nominal Biaya Administrasi',
  },
  {
    label: 'Estimasi Total Pelunasan',
    value: calculation.value ? calculation.value.totalRental + loanAmountValue.value : undefined,
    tooltip: 'Uang Pinjaman Diajukan + Sewa Modal Maksimum',
  },
])
const todayLabel = computed(() => fields.value.purpose
  ? new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date())
  : 'Terisi otomatis')
const maturityDateValue = computed(() => {
  const duration = Number.parseInt(fields.value.duration, 10)
  if (!Number.isFinite(duration)) return null
  const date = new Date()
  date.setDate(date.getDate() + duration)
  return date
})
const formatDate = (date: Date) => new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
}).format(date)
const maturityDate = computed(() => maturityDateValue.value
  ? formatDate(maturityDateValue.value)
  : 'Terisi otomatis')
const auctionDate = computed(() => {
  if (!maturityDateValue.value) return 'Terisi otomatis'
  const date = new Date(maturityDateValue.value)
  date.setDate(date.getDate() + 30)
  return formatDate(date)
})

const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID').format(value)
const displayAmount = (value: number) => value > 0 ? `Rp${formatCurrency(value)}` : '-'
const fieldError = (value: string, label: string) => isSubmitted.value && !value
  ? `Pilih ${label.toLowerCase()}`
  : ''
const hasValidNik = computed(() => /^\d{16}$/.test(cleanNik.value))

const searchCustomer = () => {
  hasSearchedCustomer.value = false
  customerDetailsExpanded.value = false
  if (!hasValidNik.value) {
    customerSearchError.value = 'Nomor induk kependudukan harus 16 digit.'
    return
  }
  customerSearchError.value = ''
  hasSearchedCustomer.value = true
}

const searchAnotherCustomer = () => {
  hasSearchedCustomer.value = false
  customerDetailsExpanded.value = false
  nik.value = ''
  customerSearchError.value = ''
  isCustomerOpen.value = true
}

const toggleCustomerDetails = () => {
  customerDetailsExpanded.value = !customerDetailsExpanded.value
}

const openCollateralModal = (collateral: Collateral | null = null) => {
  editingCollateral.value = collateral
  showCollateralModal.value = true
}

const saveCollateral = (collateral: RahnCollateral) => {
  if (editingCollateral.value) {
    const index = collaterals.value.findIndex((item) => item.id === editingCollateral.value?.id)
    if (index >= 0) {
      collaterals.value.splice(index, 1, {
        id: editingCollateral.value.id,
        ...collateral,
      })
    }
  } else {
    collaterals.value.push({
      id: nextCollateralId.value++,
      ...collateral,
    })
    showAlert({
      label: 'Barang jaminan berhasil ditambahkan.',
      variant: 'success',
      position: 'top-center',
    })
  }
  editingCollateral.value = null
}

const editCollateral = (index: number) => {
  const collateral = collaterals.value[index]
  if (!collateral) return
  openCollateralModal(collateral)
}

const removeCollateral = (index: number) => {
  collaterals.value.splice(index, 1)
}

const calculateLoan = () => {
  isCalculated.value = false
  if (!collaterals.value.length) {
    calculationError.value = 'Tambahkan minimal satu jaminan sebelum menghitung pinjaman.'
    return
  }
  if (loanAmountValue.value < 50_000 || !loanTier.value) {
    calculationError.value = 'Nominal uang pinjaman minimal Rp50.000.'
    return
  }
  if (!fields.value.duration) {
    calculationError.value = 'Pilih jangka waktu pinjaman.'
    return
  }
  if (!Number.isFinite(appliedTariffRate.value) || appliedTariffRate.value <= 0) {
    calculationError.value = 'Masukkan tarif khusus lebih dari 0.'
    return
  }
  const result = calculateRahnLoan(
    loanAmountValue.value,
    totalAppraisal.value,
    appliedTariffRate.value,
    Number.parseInt(fields.value.duration, 10),
  )
  if (!result || loanAmountValue.value > result.loanLimit) {
    calculationError.value = 'Nominal pinjaman melebihi batas maksimal berdasarkan nilai taksiran.'
    return
  }
  calculationError.value = ''
  isCalculated.value = true
}

const processApplication = () => {
  isSubmitted.value = true
  submissionError.value = ''

  if (!hasValidNik.value) {
    isCustomerOpen.value = true
    customerSearchError.value = 'Nomor induk kependudukan harus 16 digit.'
    submissionError.value = 'Lengkapi data nasabah sebelum memproses pengajuan.'
    return
  }
  if (!hasSearchedCustomer.value) {
    isCustomerOpen.value = true
    submissionError.value = 'Cari data nasabah terlebih dahulu.'
    return
  }
  if (Object.values(fields.value).some((value) => !value)) {
    isApplicationOpen.value = true
    isBeneficialOwnerOpen.value = !fields.value.beneficialOwner
    submissionError.value = 'Lengkapi data pengajuan dan beneficial owner.'
    return
  }
  if (!collaterals.value.length) {
    isCollateralOpen.value = true
    submissionError.value = 'Data jaminan wajib diisi.'
    return
  }
  if (!isCalculated.value) {
    isCreditOpen.value = true
    submissionError.value = 'Hitung fasilitas pinjaman sebelum memproses pengajuan.'
    return
  }
  showSubmissionModal.value = true
  submissionModalStep.value = 'confirmation'
}

const confirmSubmission = () => {
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

const returnToEntryPage = () => {
  showSubmissionModal.value = false
  void router.push('/beranda')
}

watch([loanAmount, tariffChange, specialTariffRate, totalAppraisal], () => {
  isCalculated.value = false
  calculationError.value = ''
})
watch([tariffChange, tariffTier], ([value, tier]) => {
  if (value === 'Iya' && !specialTariffRate.value && tier) {
    specialTariffRate.value = String(tier.tariffRate).replace('.', ',')
  }
  if (value === 'Tidak') specialTariffRate.value = ''
})
watch(() => fields.value.purpose, () => {
  fields.value.transactionPurpose = ''
})
watch(nik, (value) => {
  const sanitized = value.replace(/\D/g, '').slice(0, 16)
  if (sanitized !== value) nik.value = sanitized
  hasSearchedCustomer.value = false
  customerDetailsExpanded.value = false
  customerSearchError.value = ''
})
</script>

<template>
  <SprintModuleShell
    title="Pengajuan Gadai"
    :breadcrumbs="[{ label: 'Beranda', to: '/beranda' }, { label: 'Pinjaman Gadai' }, 'Pengajuan Gadai']"
    back-to="/beranda"
    :wide="true"
    entry-navbar
    search-placeholder="Cari (contoh: Pengajuan Gadai/Rahn)"
  >
    <div class="gadai-one-page">
      <div class="gadai-one-page__sections">
        <ModuleSectionCard
          id="gadai-page-customer"
          title="Data Nasabah"
          v-model="isCustomerOpen"
        >
          <template v-if="!hasSearchedCustomer">
            <div class="gadai-one-page__grid">
              <GDropdown
                v-model="customerType"
                label="Tipe Nasabah"
                placeholder="Pilih tipe nasabah"
                :items="nasabahTypeOptions"
                item-value="value"
                item-text="label"
                disabled
              />
              <GInputText
                v-model="nik"
                label="Nomor Induk Kependudukan (NIK)"
                placeholder="Masukkan nomor induk kependudukan"
                type="number"
                :maxlength="19"
                :error="customerSearchError"
                helper-text="Nomor induk kependudukan harus 16 karakter."
              />
            </div>
            <div class="gadai-one-page__search-actions">
              <GButton label="Cari" type="outline" size="md" @click="searchCustomer" />
            </div>
          </template>
          <div v-else class="gadai-one-page__customer-result">
            <RahnReadonlyInfoGrid
              class="gadai-one-page__customer-info-grid"
              title="Informasi Nasabah"
              variant="review"
              :items="customerIdentityItems"
            />
            <div v-show="customerDetailsExpanded" id="gadai-page-customer-details">
              <hr class="gadai-one-page__customer-divider">
              <RahnReadonlyInfoGrid
                class="gadai-one-page__customer-info-grid"
                title="Alamat Nasabah Sesuai KTP"
                variant="review"
                :items="customerIdentityAddressItems"
              />
              <p class="gadai-one-page__dukcapil-status" role="status">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="8" fill="currentColor" />
                  <path d="m4.2 8.1 2.4 2.3 5.2-5.1" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" />
                </svg>
                Terverifikasi Dukcapil.
              </p>
              <hr class="gadai-one-page__customer-divider">
              <RahnReadonlyInfoGrid
                class="gadai-one-page__customer-info-grid"
                title="Alamat Tinggal Saat Ini"
                variant="review"
                :items="customerCurrentAddressItems"
              />
              <hr class="gadai-one-page__customer-divider">
              <RahnReadonlyInfoGrid
                class="gadai-one-page__customer-info-grid"
                title="Data Koresponden / Kontak Darurat"
                variant="review"
                :items="customerEmergencyContactItems"
              />
            </div>
            <div class="gadai-one-page__customer-result-actions">
              <button
                type="button"
                class="gadai-one-page__customer-details-toggle"
                :aria-expanded="customerDetailsExpanded"
                aria-controls="gadai-page-customer-details"
                @click.stop="toggleCustomerDetails"
              >
                {{ customerDetailsExpanded ? 'Sembunyikan' : 'Lihat Selengkapnya' }}
                <svg
                  :class="{ 'is-expanded': customerDetailsExpanded }"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
                </svg>
              </button>
              <GButton label="Cari NIK Lain" type="outline" size="md" @click="searchAnotherCustomer" />
            </div>
          </div>
        </ModuleSectionCard>

        <ModuleSectionCard
          id="gadai-page-application"
          title="Data Pengajuan"
          v-model="isApplicationOpen"
        >
          <RahnApplicationDropdowns
            class="gadai-one-page__grid"
            :purpose="fields.purpose"
            :transaction-purpose="fields.transactionPurpose"
            :employment="fields.employment"
            :rubric="fields.rubric"
            :tariff="fields.tariff"
            :product="fields.product"
            :duration="fields.duration"
            :transaction-options="transactionOptions"
            :is-mobile="isMobile"
            :is-submitted="isSubmitted"
            @update:purpose="fields.purpose = $event"
            @update:transaction-purpose="fields.transactionPurpose = $event"
            @update:employment="fields.employment = $event"
            @update:rubric="fields.rubric = $event"
            @update:tariff="fields.tariff = $event"
            @update:product="fields.product = $event"
            @update:duration="fields.duration = $event"
          />
          <hr class="gadai-one-page__divider">
          <h3 class="gadai-one-page__subheading">Informasi Kredit</h3>
          <div class="gadai-one-page__grid">
            <GInputText label="Tanggal Kredit" :model-value="todayLabel" disabled />
            <GInputText label="Tanggal Jatuh Tempo" :model-value="maturityDate" disabled />
            <GInputText label="Tanggal Lelang" :model-value="auctionDate" disabled />
          </div>
        </ModuleSectionCard>

        <ModuleSectionCard
          id="gadai-page-beneficial-owner"
          title="Data Beneficial Owner"
          v-model="isBeneficialOwnerOpen"
        >
          <div class="gadai-one-page__owner-field">
            <GDropdown
              v-model="fields.beneficialOwner"
              label="Tipe Beneficial Owner"
              placeholder="Pilih tipe beneficial owner"
              :items="ownerOptions"
              item-value="value"
              item-text="label"
              :error="fieldError(fields.beneficialOwner, 'Tipe Beneficial Owner')"
              :required="isSubmitted"
              :is-checked="isSubmitted"
              :use-bottom-sheet="isMobile"
            />
          </div>
        </ModuleSectionCard>

        <ModuleSectionCard
          id="gadai-page-collateral"
          title="Data Jaminan"
          v-model="isCollateralOpen"
        >
          <RahnCollateralTable
            :items="collaterals"
            @edit="editCollateral"
            @remove="removeCollateral"
          />
          <p v-if="isSubmitted && !collaterals.length" class="gadai-one-page__error" role="alert">
            Data jaminan wajib diisi.
          </p>
          <div class="gadai-one-page__add-action">
            <GButton label="Tambah Jaminan" type="secondary" size="md" @click="openCollateralModal()" />
          </div>
        </ModuleSectionCard>

        <ModuleSectionCard
          id="gadai-page-credit"
          title="Fasilitas Kredit"
          v-model="isCreditOpen"
        >
          <h3 class="gadai-one-page__subheading">Parameter Fasilitas Kredit</h3>
          <RahnReadonlyInfoGrid
            class="gadai-one-page__readonly-grid"
            variant="review"
            :items="tariffSummaryItems"
          />
          <div class="gadai-one-page__grid gadai-one-page__credit-grid">
            <fieldset class="gadai-one-page__radio-field">
              <legend>Perubahan Tarif</legend>
              <GRadio
                v-model="tariffChange"
                :items="tariffChangeOptions"
              />
            </fieldset>
            <div class="gadai-one-page__field">
              <label for="gadai-tariff-rate" class="gadai-one-page__tooltip-label">
                Tarif Fixed
                <GTooltip
                  color="black"
                  variant="light"
                  placement="top"
                  custom-class="gadai-credit-tooltip gadai-credit-tooltip--wide"
                  tooltip-text="Persentase tarif sewa modal yang dikenakan kepada nasabah berdasarkan skema tarif dipilih."
                />
              </label>
              <GInputText
                id="gadai-tariff-rate"
                class="gadai-one-page__tariff-input"
                :model-value="String(tariffTier?.tariffRate ?? '').replace('.', ',')"
                disabled
                placeholder="Terisi otomatis"
              >
                <template #suffix><span class="gadai-one-page__tariff-suffix">%</span></template>
              </GInputText>
            </div>
            <div class="gadai-one-page__field">
              <label for="gadai-special-tariff" class="gadai-one-page__tooltip-label">
                Tarif Khusus
                <GTooltip
                  color="black"
                  variant="light"
                  placement="top"
                  custom-class="gadai-credit-tooltip gadai-credit-tooltip--wide"
                  tooltip-text="Persentase tarif sewa modal yang dikenakan kepada nasabah berdasarkan ketentuan tertentu jika terdapat perubahan tarif."
                />
              </label>
              <GInputText
                id="gadai-special-tariff"
                class="gadai-one-page__tariff-input"
                v-model="specialTariffRate"
                :disabled="tariffChange !== 'Iya'"
                placeholder="Terisi otomatis"
              >
                <template #suffix><span class="gadai-one-page__tariff-suffix">%</span></template>
              </GInputText>
            </div>
          </div>
          <hr class="gadai-one-page__divider">
          <div class="gadai-one-page__loan-data">
            <h3 class="gadai-one-page__subheading mb-0">Data Pinjaman</h3>
            <GAlert
              v-if="hasSearchedCustomer"
              class="gadai-one-page__rating-alert"
              label="Nasabah mendapatkan rating Platinum Plus Holding."
              color="light-blue"
              variant="info"
            />
          </div>
          <RahnReadonlyInfoGrid
            class="gadai-one-page__readonly-grid gadai-one-page__loan-summary"
            variant="review"
            :items="loanSummaryItems"
          />
          <div class="gadai-one-page__grid mt-4">
            <div class="gadai-one-page__field">
              <label>Uang Pinjaman Diajukan</label>
              <GInputNominalStart v-model="loanAmount" unit="Rupiah" placeholder="Masukkan nominal" />
              <span class="gadai-one-page__caption">Nominal diajukan tidak boleh melebihi maksimal pinjaman customer rating / normal.</span>
            </div>
            <div class="gadai-one-page__field">
              <RahnAutoValueField
                label="Golongan Uang Pinjaman"
                :value="loanTierLabel"
              />
            </div>
          </div>
          <p v-if="calculationError" class="gadai-one-page__error" role="alert">{{ calculationError }}</p>
          <div class="gadai-one-page__calculate-action">
            <GButton label="Hitung" type="secondary" size="md" @click="calculateLoan" />
          </div>
          <hr class="gadai-one-page__divider">
          <h3 class="gadai-one-page__subheading">Simulasi Pinjaman</h3>
          <div class="gadai-one-page__grid gadai-one-page__simulation-grid">
            <div
              v-for="field in loanSimulationFields"
              :key="field.label"
              class="gadai-one-page__field gadai-one-page__simulation-field"
            >
              <label class="gadai-one-page__tooltip-label">
                {{ field.label }}
                <GTooltip
                  color="black"
                  variant="light"
                  placement="top"
                  custom-class="gadai-credit-tooltip"
                  :tooltip-text="field.tooltip"
                />
              </label>
              <GInputNominalStart
                :model-value="field.value !== undefined ? String(field.value) : ''"
                unit="Rupiah"
                placeholder="Terisi otomatis"
                disabled
              />
            </div>
          </div>
          <hr class="gadai-one-page__simulation-divider">
          <div class="gadai-one-page__grid gadai-one-page__simulation-grid gadai-one-page__settlement-grid">
            <div
              v-for="field in loanSettlementFields"
              :key="field.label"
              class="gadai-one-page__field gadai-one-page__simulation-field"
            >
              <label class="gadai-one-page__tooltip-label">
                {{ field.label }}
                <GTooltip
                  color="black"
                  variant="light"
                  placement="top"
                  custom-class="gadai-credit-tooltip"
                  :tooltip-text="field.tooltip"
                />
              </label>
              <GInputNominalStart
                :model-value="field.value ? String(field.value) : ''"
                unit="Rupiah"
                placeholder="Terisi otomatis"
                disabled
              />
            </div>
          </div>
        </ModuleSectionCard>
      </div>
      <p v-if="submissionError" class="gadai-one-page__error gadai-one-page__submission-error" role="alert">
        {{ submissionError }}
      </p>
    </div>

    <template #actions>
      <GButton label="Proses Pengajuan" type="primary" size="md" @click="processApplication" />
    </template>
  </SprintModuleShell>

  <RahnCollateralFormModal
    v-model="showCollateralModal"
    :rubric="fields.rubric"
    :is-mobile="isMobile"
    :initial-collateral="editingCollateral"
    @save="saveCollateral"
  />

  <GModal
    v-model="showSubmissionModal"
    :class="[
      'gadai-one-page__modal',
      `gadai-one-page__modal--${submissionModalStep}`,
    ]"
    centered
    :title="submissionModalStep === 'confirmation' ? 'Konfirmasi' : ''"
    :show-close-button="false"
  >
    <template #header>
      <div v-if="submissionModalStep === 'confirmation'" class="gadai-one-page__modal-header">
        <h2>Konfirmasi</h2>
        <button
          type="button"
          class="gadai-one-page__modal-close"
          aria-label="Tutup"
          @click="showSubmissionModal = false"
        >
          <img :src="submissionCloseIconUrl" alt="">
        </button>
      </div>
    </template>
    <template #body>
      <p v-if="submissionModalStep === 'confirmation'" class="gadai-one-page__confirmation-copy">
        Apakah Anda yakin untuk memproses pengajuan ini?
      </p>
      <div v-else class="gadai-one-page__success-content">
        <SubmissionSuccessIllustration />
        <div class="gadai-one-page__success-copy">
          <h2>Pengajuan Berhasil</h2>
          <p>Pengajuan Gadai berhasil Anda ajukan.</p>
          <div class="gadai-one-page__submission-number">
            <span class="gadai-one-page__submission-number-label">Nomor Pengajuan</span>
            <div class="gadai-one-page__submission-number-field">
              <span>{{ submissionNumber }}</span>
              <button type="button" @click="copySubmissionNumber">
                {{ submissionCopied ? 'Tersalin' : 'Salin' }}
              </button>
            </div>
            <p v-if="submissionCopyError" class="gadai-one-page__copy-error" role="alert">
              {{ submissionCopyError }}
            </p>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="gadai-one-page__modal-actions">
        <template v-if="submissionModalStep === 'confirmation'">
          <GButton label="Batal" type="neutral" size="md" @click="showSubmissionModal = false" />
          <GButton label="Ya, Proses Pengajuan" type="primary" size="md" @click="confirmSubmission" />
        </template>
        <GButton v-else label="Mengerti" type="primary" size="md" @click="returnToEntryPage" />
      </div>
    </template>
  </GModal>
</template>

<style scoped lang="scss">
.gadai-one-page {
  margin-top: 16px;
  margin-bottom: 40px;

  :deep(.group-input) {
    margin-bottom: 0px !important;
  }
}

.gadai-one-page__sections {
  min-height: 640px;
  overflow: hidden;
  padding: 24px 0 16px;
  border: 1px solid var(--g-kit-black-20, #eeeeef);
  border-radius: 8px;
  background: var(--g-kit-white, #ffffff);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.14), 0 0 1px rgba(0, 0, 0, 0.08);

  :deep(.module-section-card) {
    padding: 0 24px 16px;
    margin: 0;
    border: 0;
    border-radius: 0;
    background: var(--g-kit-white, #ffffff);
  }

  :deep(.module-section-card + .module-section-card) {
    border-top: 8px solid var(--g-kit-black-10, #f8f8f8);
    padding-top: 16px;
  }

  :deep(.module-section-card__title) {
    font-size: 20px;
    line-height: 30px;
  }

  :deep(button[disabled]) {
    color: var(--g-kit-black-50, #939597);
  }

  &:has(.dropdown-menu.show) {
    position: relative;
    z-index: 2;
    overflow: visible;

    :deep(.module-section-card:has(.dropdown-menu.show)) {
      position: relative;
      z-index: 1;
    }

    :deep(.section-collapse__inner:has(.dropdown-menu.show)) {
      overflow: visible;
    }
  }

  :deep(.section-collapse__content) {
    padding-top: 16px;
  }

  @media (max-width: 767px) {
    min-height: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    background: transparent;

    :deep(.module-section-card) {
      padding: 16px;
    }

    :deep(.module-section-card + .module-section-card) {
      margin-top: 8px;
      border-top: 0;
    }
  }
}

.gadai-one-page__grid,
.gadai-one-page__summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.gadai-one-page__owner-field {
  width: min(100%, calc(50% - 12px));
}

.gadai-one-page__search-actions,
.gadai-one-page__add-action,
.gadai-one-page__calculate-action {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  margin-top: 16px;

  :deep(.btn) {
    min-width: 200px;
  }
}

.gadai-one-page__search-actions {
  :deep(.btn-outline) {
    border-color: var(--g-kit-lime-50, #00ab4e);
    color: var(--g-kit-lime-50, #00ab4e);
    background: var(--g-kit-white, #ffffff);
  }
}

.gadai-one-page__customer-result {
  width: 100%;
}

.gadai-one-page__customer-info-grid {
  :deep(.rahn-readonly-group__title) {
    margin-bottom: 12px;
    font-size: 14px;
    line-height: 20px;
  }

  :deep(.rahn-readonly-grid) {
    gap: 12px 24px;
  }

  :deep(.readonly-field--review) {
    grid-template-columns: minmax(100px, 1fr) minmax(0, 2fr);
    gap: 8px;
    font-size: 14px;
    line-height: 20px;
  }
}

.gadai-one-page__customer-divider {
  margin: 16px 0;
  border: 0;
  border-top: 1px solid var(--g-kit-black-20, #eeeeef);
  opacity: 1;
}

.gadai-one-page__dukcapil-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0 0;
  color: var(--g-kit-black-80, #252528);
  font-size: 12px;
  line-height: 18px;

  svg {
    flex: 0 0 16px;
    width: 16px;
    height: 16px;
    color: var(--g-kit-lime-50, #00ab4e);
  }
}

.gadai-one-page__customer-result-actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  margin-top: 16px;

  :deep(.btn) {
    align-self: flex-end;
    min-width: 200px;
    border-color: var(--g-kit-black-40, #bbbdc0);
    color: var(--g-kit-black-60, #58585b);
    background: var(--g-kit-white, #ffffff);
  }
}

.gadai-one-page__customer-details-toggle {
  display: inline-flex;
  align-self: center;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 0;
  color: var(--g-kit-lime-50, #00ab4e);
  background: transparent;
  font-size: 14px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 20px;

  svg {
    width: 16px;
    height: 16px;
    transition: transform 160ms ease;

    &.is-expanded {
      transform: rotate(180deg);
    }
  }
}

.gadai-one-page__subheading {
  margin: 0 0 16px;
  color: var(--g-kit-black-80, #252528);
  font-size: 16px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 24px;
}

.gadai-one-page__divider {
  margin: 24px 0 16px;
  border: 0;
  border-top: 1px solid var(--g-kit-black-20, #eeeeef);
  opacity: 1;
}

.gadai-one-page__summary-grid {
  row-gap: 12px;
  margin-bottom: 16px;
}

.gadai-one-page__summary-grid--loan {
  margin-bottom: 24px;
}

.gadai-one-page__summary-item {
  display: grid;
  grid-template-columns: minmax(165px, 1fr) minmax(0, 2fr);
  gap: 8px;
  color: var(--g-kit-black-80, #252528);
  font-size: 16px;
  line-height: 24px;

  strong {
    font-weight: var(--g-kit-font-weight-bold, 800);
  }
}

.gadai-one-page__readonly-grid {
  :deep(.rahn-readonly-grid) {
    margin-top: 0;
    gap: 12px 24px;
  }
}

.gadai-one-page__subheading + .gadai-one-page__readonly-grid {
  margin-top: 12px;
}

.gadai-one-page__credit-grid {
  margin-top: 24px;
}

.gadai-one-page__loan-data {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.gadai-one-page__simulation-grid {
  row-gap: 20px;
}

.gadai-one-page__simulation-field > label {
  font-size: 12px;
  line-height: 18px;
}

.gadai-one-page__simulation-divider {
  margin: 24px 0 16px;
  border: 0;
  border-top: 1px solid var(--g-kit-black-20, #eeeeef);
  opacity: 1;
}

.gadai-one-page__loan-summary {
  margin-top: 24px;
}

.gadai-one-page__rating-alert {
  :deep(.alert) {
    margin: 0;
    padding: 12px;
    border: 0;
    border-radius: 6px;
    background-color: var(--g-kit-blue-10, #e8f1f9);
    background-image: url('kitvue-public/src/assets/images/alerts/aksen-blue.svg');
    background-repeat: no-repeat;
    background-position: right center;
    background-size: contain;
    color: var(--g-kit-black-80, #252528);
    font-size: 16px;
    line-height: 24px;
  }
}

.gadai-one-page__tooltip-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;

  :deep(.tooltip-icon-wrapper img) {
    width: 18px;
    height: 18px;
  }
}

:global(.gadai-one-page__tariff-input .input-group) {
  box-sizing: border-box;
  height: 48px;
  overflow: hidden;
  border: 1px solid var(--g-kit-black-40, #bbbdc0);
  border-radius: 6px;
  background: var(--g-kit-black-20, #eeeeef);
}

:global(.gadai-one-page__tariff-input .form-control) {
  height: 46px;
  border: 0;
  border-radius: 5px 0 0 5px;
  background: var(--g-kit-black-20, #eeeeef);
  color: var(--g-kit-black-60, #58585b);
  box-shadow: none;
}

:global(.gadai-one-page__tariff-input .input-group:has(input:not(:disabled))) {
  background: var(--g-kit-white, #ffffff);
}

:global(.gadai-one-page__tariff-input .input-group:has(input:not(:disabled)) .form-control) {
  background: var(--g-kit-white, #ffffff);
  color: var(--g-kit-black-80, #252528);
}

.gadai-one-page__tariff-suffix {
  position: relative;
  display: flex;
  flex: 0 0 101px;
  align-items: center;
  justify-content: center;
  height: 46px;
  background: var(--g-kit-black-20, #eeeeef);
  color: var(--g-kit-black-60, #58585b);
  font-size: 16px;
  line-height: 24px;
}

.gadai-one-page__tariff-suffix::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 1px;
  background: var(--g-kit-black-40, #bbbdc0);
  content: '';
}

:global(.gadai-one-page__tariff-input .input-group:has(input:not(:disabled)) .gadai-one-page__tariff-suffix) {
  background: var(--g-kit-white, #ffffff);
  color: var(--g-kit-black-80, #252528);
}

.gadai-one-page__radio-field {
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;

  legend {
    float: none;
    width: auto;
    margin: 0px;
    color: var(--g-kit-black-80, #252528);
    font-size: var(--g-kit-font-size-omicron, 16px);
    font-weight: var(--g-kit-font-weight-bold, 800);
    line-height: var(--g-kit-line-height-omicron, 24px);
  }

  :deep(.radio-container) {
    gap: 8px;
  }

  :deep(.radio-column) {
    margin: 0;
  }

  :deep(.radio-content) {
    min-height: 48px;
    padding: 11px;
    color: var(--g-kit-black-60, #58585b);
    font-size: var(--g-kit-font-size-omicron, 16px);
    line-height: var(--g-kit-line-height-omicron, 24px);

    &:has(input:checked) {
      color: var(--g-kit-black-80, #252528);
    }
  }
}

.gadai-one-page__field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;

  > label {
    color: var(--g-kit-black-80, #252528);
    font-size: 14px;
    font-weight: var(--g-kit-font-weight-bold, 800);
    line-height: 20px;
  }
}

:global(.gadai-credit-tooltip) {
  max-width: 288px;
}

:global(.gadai-credit-tooltip--wide) {
  max-width: 360px;
}

:global(.gadai-credit-tooltip .tooltip-inner) {
  box-sizing: border-box;
  width: 288px;
  max-width: 288px;
  padding: 16px;
  border-radius: 12px;
  color: var(--g-kit-black-60, #58585b);
  font-size: 14px;
  font-weight: var(--g-kit-font-weight-normal, 600);
  line-height: 20px;
  text-align: left;
}

:global(.gadai-credit-tooltip--wide .tooltip-inner) {
  width: 360px;
  max-width: 360px;
}

.gadai-one-page__caption {
  color: var(--g-kit-black-60, #58585b);
  font-size: 12px;
  line-height: 18px;
}

.gadai-one-page__error {
  margin: 8px 0 0;
  color: var(--g-kit-red-50, #ae1e22);
  font-size: 12px;
  line-height: 18px;
}

.gadai-one-page__success {
  color: var(--g-kit-lime-50, #00ab4e);
  font-size: 14px;
}

.gadai-one-page__submission-error {
  margin: 12px 0 0;
  text-align: right;
}

:global(.gadai-one-page__modal.show) {
  display: block !important;
}

:global(.gadai-one-page__modal .modal-dialog) {
  position: relative;
  z-index: 1051;
  width: calc(100% - 32px);
  max-width: 360px;
}

:global(.gadai-one-page__modal .modal-content) {
  overflow: hidden;
  border: 0;
  border-radius: 12px;
}

:global(.gadai-one-page__modal--confirmation .modal-header) {
  padding: 16px 16px 15px;
}

:global(.gadai-one-page__modal--confirmation.modal-general.border-bottom .modal-header) {
  border-bottom: 1px solid var(--g-kit-black-20, #eeeeef);
}

.gadai-one-page__modal-header {
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

.gadai-one-page__modal-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

:global(.gadai-one-page__modal--confirmation .modal-body) {
  padding: 16px 16px 0;
}

.gadai-one-page__confirmation-copy {
  margin: 0;
  color: var(--g-kit-black-60, #58585b);
  font-size: 14px;
  font-weight: var(--g-kit-font-weight-normal, 600);
  line-height: 20px;
}

:global(.gadai-one-page__modal--confirmation .modal-footer) {
  padding: 16px;
  border: 0;
}

.gadai-one-page__modal-actions {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
  gap: 8px;

  :deep(.btn) {
    width: 100%;
    height: 40px;
    border-radius: 6px;
    font-size: 16px;
    font-weight: var(--g-kit-font-weight-bold, 800);
    line-height: 24px;
  }
}

:global(.gadai-one-page__modal--success .modal-header) {
  display: none;
}

:global(.gadai-one-page__modal--success .modal-body) {
  padding: 50px 16px 0;
}

.gadai-one-page__success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 24px;
}

.gadai-one-page__success-copy {
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

.gadai-one-page__submission-number {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;
}

.gadai-one-page__submission-number-label {
  color: var(--g-kit-black-60, #58585b);
  font-size: 14px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 20px;
}

.gadai-one-page__submission-number-field {
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

.gadai-one-page__copy-error {
  margin: 0;
  color: var(--g-kit-red-50, #ae1e22);
  font-size: 12px;
  line-height: 16px;
}

:global(.gadai-one-page__modal--success .modal-footer) {
  padding: 24px 16px 16px;
  border: 0;
}

@media (max-width: 767px) {
  .gadai-one-page {
    margin-top: 0;
    margin-bottom: 0;
  }

  .gadai-one-page__grid,
  .gadai-one-page__summary-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }

  .gadai-one-page__search-actions {
    align-items: stretch;
    flex-direction: column;

    :deep(.btn) {
      width: 100%;
    }
  }

  .gadai-one-page__customer-info-grid {
    :deep(.readonly-field--review) {
      grid-template-columns: minmax(0, 120px) minmax(0, 1fr);
    }
  }

  .gadai-one-page__customer-result-actions {
    align-items: stretch;
    flex-direction: column;
    gap: 8px;

    :deep(.btn) {
      position: static;
      width: 100%;
    }
  }

  .gadai-one-page__add-action,
  .gadai-one-page__calculate-action {
    :deep(.btn) {
      width: 100%;
    }
  }

  .gadai-one-page__summary-item {
    grid-template-columns: minmax(130px, 1fr) minmax(0, 1fr);
    font-size: 14px;
  }

}
</style>
