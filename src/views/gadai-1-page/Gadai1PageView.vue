<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { GAlert, GButton, GDropdown, GImageView, GInputNominalStart, GInputText, GModal, GRadio, GTable, GTablePagination, GTooltip } from '@/components'
import { RahnReadonlyInfoGrid, type ReadonlyInfoItem } from '@/components/modules/rahn'
import RahnCollateralFormModal from '@/components/modules/rahn/RahnCollateralFormModal.vue'
import ModuleSectionCard from '@/components/shared/card/ModuleSectionCard.vue'
import SprintModuleShell from '@/components/shared/admin-layout/SprintModuleShell.vue'
import { calculateRahnLoan, getMaximumRahnLoan, getRahnLoanTier } from '@/utils/rahnLoanCalculation'
import type { RahnCollateral } from '@/views/rahn/rahnFlow'

interface Option {
  value: string
  label: string
}

interface Collateral extends RahnCollateral {
  id: number
}

const router = useRouter()
const makeOptions = (labels: string[]): Option[] => labels.map((label) => ({ value: label, label }))
const nasabahOptions = makeOptions(['Perorangan', 'Badan Usaha'])
const purposeOptions = makeOptions(['Produktif', 'Konsumtif'])
const productiveTransactionOptions = makeOptions(['Usaha / Modal Kerja', 'Investasi'])
const consumptiveTransactionOptions = makeOptions([
  'Pembelian Kendaraan',
  'Ibadah Haji',
  'Pembelian Barang / Jasa',
  'Wisata Rohani',
  'Hajatan / Upacara',
  'Biaya Pendidikan',
  'Lain-Lain',
])
const employmentOptions = makeOptions(['Karyawan Swasta', 'Wiraswasta', 'Karyawan BUMN', 'Pensiunan'])
const rubricOptions = makeOptions(['Barang Kantong', 'Barang Gudang', 'Kendaraan', 'Elektronik'])
const productOptions = makeOptions(['Gadai KCA'])
const tariffOptions = makeOptions(['Sewa Modal Harian', 'Sewa Modal Harian Per 10 Hari', 'Sewa Modal Harian Per 15 Hari'])
const durationOptions = makeOptions(['120 Hari'])
const beneficialOwnerOptions = makeOptions(['Diri sendiri', 'Beneficial Owner'])
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
const currentPage = ref(1)
const pageSize = ref(10)
const showCollateralModal = ref(false)
const loanAmount = ref('')
const tariffChange = ref('Tidak')
const specialTariffRate = ref('')
const calculationError = ref('')
const isCalculated = ref(false)
const showSubmissionModal = ref(false)
const submissionModalStep = ref<'confirmation' | 'success'>('confirmation')
const submissionError = ref('')

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
const maximumNormalLoan = computed(() => Math.floor(totalAppraisal.value * 0.8))
const maximumRatedLoan = computed(() => getMaximumRahnLoan(totalAppraisal.value))
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
const visibleCollaterals = computed(() => collaterals.value.slice(
  (currentPage.value - 1) * pageSize.value,
  currentPage.value * pageSize.value,
))
const collateralColumns = [
  { key: 'rubric', label: 'Rubrik' },
  { key: 'type', label: 'Tipe Jaminan' },
  { key: 'details', label: 'Detail Jaminan' },
  { key: 'photo', label: 'Foto Jaminan' },
  { key: 'estimatedValue', label: 'Taksiran' },
  { key: 'actions', label: 'Aksi' },
]
const collateralRows = computed(() => visibleCollaterals.value.map((item) => ({
  ...item,
  type: item.collateralType,
  actions: item.id,
})))
const paginationTotalRows = computed(() => Math.max(collaterals.value.length, 1))
const collateralPaginationLabel = computed(() => {
  const first = collaterals.value.length ? (currentPage.value - 1) * pageSize.value + 1 : 0
  const last = Math.min(currentPage.value * pageSize.value, collaterals.value.length)
  return `Menampilkan ${first} sampai ${last} dari ${collaterals.value.length} baris`
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
    value: calculation.value ? calculation.value.loanLimit - loanAmountValue.value : undefined,
    tooltip: 'Maksimal Pinjaman - Uang Pinjaman Diajukan',
  },
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
const maturityDate = computed(() => {
  const duration = Number.parseInt(fields.value.duration, 10)
  if (!Number.isFinite(duration)) return 'Terisi otomatis'
  const date = new Date()
  date.setDate(date.getDate() + duration)
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).format(date)
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

const openCollateralModal = () => {
  showCollateralModal.value = true
}

const saveCollateral = (collateral: RahnCollateral) => {
  collaterals.value.push({
    id: nextCollateralId.value++,
    ...collateral,
  })
  currentPage.value = Math.ceil(collaterals.value.length / pageSize.value)
}

const removeCollateral = (item: Collateral) => {
  collaterals.value = collaterals.value.filter((collateral) => collateral.id !== item.id)
  currentPage.value = Math.max(1, Math.min(currentPage.value, Math.ceil(collaterals.value.length / pageSize.value)))
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
}

const returnToEntryPage = () => {
  showSubmissionModal.value = false
  void router.push('/')
}

watch([loanAmount, tariffChange, specialTariffRate, totalAppraisal], () => {
  isCalculated.value = false
  calculationError.value = ''
})
watch(() => fields.value.purpose, () => {
  fields.value.transactionPurpose = ''
})
watch(pageSize, () => {
  currentPage.value = 1
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
    :breadcrumbs="[{ label: 'Beranda', to: '/' }, { label: 'Pinjaman Gadai' }, 'Pengajuan Gadai']"
    back-to="/"
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
                :items="nasabahOptions"
                item-value="value"
                item-text="label"
                disabled
              />
              <GInputText
                v-model="nik"
                label="Nomor Induk Kependudukan (NIK)"
                placeholder="Masukkan nomor induk kependudukan"
                type="text"
                :maxlength="16"
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
            <template v-if="customerDetailsExpanded">
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
            </template>
            <div class="gadai-one-page__customer-result-actions">
              <button
                type="button"
                class="gadai-one-page__customer-details-toggle"
                :aria-expanded="customerDetailsExpanded"
                @click="customerDetailsExpanded = !customerDetailsExpanded"
              >
                {{ customerDetailsExpanded ? 'Lihat Lebih Sedikit' : 'Lihat Selengkapnya' }}
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
          <div class="gadai-one-page__grid">
            <GDropdown
              v-model="fields.purpose"
              label="Tujuan Pengajuan"
              placeholder="Pilih tujuan pengajuan"
              :items="purposeOptions"
              item-value="value"
              item-text="label"
              :error="fieldError(fields.purpose, 'Tujuan Pengajuan')"
              :required="isSubmitted"
              :is-checked="isSubmitted"
              :use-bottom-sheet="isMobile"
            />
            <GDropdown
              v-model="fields.transactionPurpose"
              label="Tujuan Transaksi"
              placeholder="Pilih tujuan transaksi"
              :items="transactionOptions"
              item-value="value"
              item-text="label"
              :error="fieldError(fields.transactionPurpose, 'Tujuan Transaksi')"
              :required="isSubmitted"
              :is-checked="isSubmitted"
              :use-bottom-sheet="isMobile"
            />
            <GDropdown
              v-model="fields.employment"
              label="Pekerjaan Terkini"
              placeholder="Pilih pekerjaan terkini"
              :items="employmentOptions"
              item-value="value"
              item-text="label"
              :error="fieldError(fields.employment, 'Pekerjaan Terkini')"
              :required="isSubmitted"
              :is-checked="isSubmitted"
              :use-bottom-sheet="isMobile"
            />
            <GDropdown
              v-model="fields.rubric"
              label="Rubrik"
              placeholder="Pilih rubrik"
              :items="rubricOptions"
              item-value="value"
              item-text="label"
              :error="fieldError(fields.rubric, 'Rubrik')"
              :required="isSubmitted"
              :is-checked="isSubmitted"
              :use-bottom-sheet="isMobile"
            />
            <GDropdown
              v-model="fields.product"
              label="Produk"
              placeholder="Pilih produk"
              :items="productOptions"
              item-value="value"
              item-text="label"
              :error="fieldError(fields.product, 'Produk')"
              :required="isSubmitted"
              :is-checked="isSubmitted"
              :use-bottom-sheet="isMobile"
            />
            <GDropdown
              v-model="fields.tariff"
              label="Skema Tarif"
              placeholder="Pilih skema tarif"
              :items="tariffOptions"
              item-value="value"
              item-text="label"
              :error="fieldError(fields.tariff, 'Skema Tarif')"
              :required="isSubmitted"
              :is-checked="isSubmitted"
              :use-bottom-sheet="isMobile"
            />
            <GDropdown
              v-model="fields.duration"
              label="Jangka Waktu"
              placeholder="Pilih jangka waktu"
              :items="durationOptions"
              item-value="value"
              item-text="label"
              :error="fieldError(fields.duration, 'Jangka Waktu')"
              :required="isSubmitted"
              :is-checked="isSubmitted"
              :use-bottom-sheet="isMobile"
            />
          </div>
          <hr class="gadai-one-page__divider">
          <h3 class="gadai-one-page__subheading">Informasi Kredit</h3>
          <div class="gadai-one-page__grid">
            <GInputText label="Tanggal Kredit" :model-value="todayLabel" disabled />
            <GInputText label="Tanggal Jatuh Tempo" :model-value="maturityDate" disabled />
            <GInputText label="Tanggal Lelang" model-value="Terisi otomatis" disabled />
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
              :items="beneficialOwnerOptions"
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
          <div class="gadai-one-page__table-toolbar">
            <label class="gadai-one-page__page-size">
              Lihat
              <select v-model.number="pageSize" aria-label="Jumlah baris data jaminan">
                <option :value="10">10</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
              </select>
              baris
            </label>
          </div>
          <div class="gadai-one-page__table-wrap">
            <GTable
              class="gadai-one-page__table"
              :data="collateralRows"
              :columns="collateralColumns"
              nodata-message="Tambahkan jaminan terlebih dahulu"
            >
              <template #details="{ item }">
                <span>
                  Mitra : {{ item.partner }}<br>
                  Merek Emas : {{ item.brand }}<br>
                  Denominasi : {{ item.denomination }} gram<br>
                  Jumlah Keping : {{ item.pieces }} Pcs<br>
                  Karat : {{ item.karat }}<br>
                  Keterangan : {{ item.description }}
                </span>
              </template>
              <template #photo="{ item }">
                <div v-if="item.photos.length" class="gadai-one-page__photo-list">
                  <div
                    v-for="(photo, index) in item.photos.slice(0, 2)"
                    :key="`${item.id}-${index}`"
                    class="gadai-one-page__photo"
                  >
                    <GImageView
                      :img-src="photo"
                      :images="[...item.photos.slice(index), ...item.photos.slice(0, index)]"
                      img-alt="Foto barang jaminan"
                      aspect-ratio="1:1"
                      :width="64"
                      :height="64"
                      fit="cover"
                      previewable
                    />
                    <span v-if="index === 1 && item.photos.length > 2" class="gadai-one-page__photo-count">
                      +{{ item.photos.length - 2 }}
                    </span>
                  </div>
                </div>
                <span v-else>-</span>
              </template>
              <template #estimatedValue="{ value }">
                Rp{{ formatCurrency(value) }}
              </template>
              <template #actions="{ item }">
                <GButton label="Hapus" type="outline" size="sm" @click="removeCollateral(item)" />
              </template>
            </GTable>
          </div>
          <div class="gadai-one-page__pagination">
            <span>{{ collateralPaginationLabel }}</span>
            <GTablePagination
              v-model="currentPage"
              :total-rows="paginationTotalRows"
              :per-page="pageSize"
            />
          </div>
          <p v-if="isSubmitted && !collaterals.length" class="gadai-one-page__error" role="alert">
            Data jaminan wajib diisi.
          </p>
          <div class="gadai-one-page__add-action">
            <GButton label="Tambah Jaminan" type="secondary" size="md" @click="openCollateralModal" />
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
                :items="[
                  { text: 'Iya', value: 'Iya' },
                  { text: 'Tidak', value: 'Tidak' },
                ]"
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
                :model-value="String(loanTier?.tariffRate ?? '').replace('.', ',')"
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
            <h3 class="gadai-one-page__subheading">Data Pinjaman</h3>
            <GAlert
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
          <div class="gadai-one-page__grid">
            <div class="gadai-one-page__field">
              <label>Uang Pinjaman Diajukan</label>
              <GInputNominalStart v-model="loanAmount" unit="Rupiah" placeholder="Masukkan nominal" />
              <span class="gadai-one-page__caption">Nominal diajukan tidak boleh melebihi maksimal pinjaman customer rating / normal.</span>
            </div>
            <div class="gadai-one-page__field">
              <label>Golongan Uang Pinjaman</label>
              <GInputNominalStart :model-value="loanTier?.code || ''" unit="Rupiah" placeholder="Terisi otomatis" disabled />
            </div>
          </div>
          <p v-if="calculationError" class="gadai-one-page__error" role="alert">{{ calculationError }}</p>
          <div class="gadai-one-page__calculate-action">
            <GButton label="Hitung" type="outline" size="md" @click="calculateLoan" />
          </div>
          <hr class="gadai-one-page__divider">
          <h3 class="gadai-one-page__subheading">Simulasi Pinjaman</h3>
          <div class="gadai-one-page__grid">
            <div v-for="field in loanSimulationFields" :key="field.label" class="gadai-one-page__field">
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
    @save="saveCollateral"
  />

  <GModal
    v-model="showSubmissionModal"
    class="gadai-one-page__modal"
    centered
    :title="submissionModalStep === 'confirmation' ? 'Perhatian' : 'Data Berhasil Disimpan.'"
    :show-close-button="false"
  >
    <template #body>
      <div class="gadai-one-page__submission-modal-copy">
        <h2>{{ submissionModalStep === 'confirmation' ? 'Perhatian' : 'Data Berhasil Disimpan.' }}</h2>
        <p v-if="submissionModalStep === 'confirmation'">Apakah anda yakin untuk melakukan pengajuan?</p>
        <p v-else>Data pengajuan berhasil disimpan, silakan kembali ke beranda.</p>
      </div>
    </template>
    <template #footer>
      <div class="gadai-one-page__modal-actions">
        <template v-if="submissionModalStep === 'confirmation'">
          <GButton label="Batal" type="neutral" size="md" @click="showSubmissionModal = false" />
          <GButton label="Proses Pengajuan" type="primary" size="md" @click="confirmSubmission" />
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

  .group-input {
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
    gap: 8px 24px;
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
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  margin-top: 16px;

  :deep(.btn) {
    position: absolute;
    right: 0;
    min-width: 200px;
    border-color: var(--g-kit-black-40, #bbbdc0);
    color: var(--g-kit-black-60, #58585b);
    background: var(--g-kit-white, #ffffff);
  }
}

.gadai-one-page__customer-details-toggle {
  display: inline-flex;
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

.gadai-one-page__table-toolbar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 16px;
}

.gadai-one-page__page-size {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--g-kit-black-80, #252528);
  font-size: 14px;
  font-weight: var(--g-kit-font-weight-normal, 600);

  select {
    min-width: 52px;
    height: 28px;
    padding: 2px 8px;
    border: 1px solid var(--g-kit-black-40, #bbbdc0);
    border-radius: 4px;
    color: inherit;
    background: var(--g-kit-white, #ffffff);
  }
}

.gadai-one-page__table-wrap {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--g-kit-black-20, #eeeeef);
  border-radius: 6px;
}

.gadai-one-page__table-wrap :deep(.gadai-one-page__table) {
  width: 100%;
  min-width: 760px;
  margin: 0;
  table-layout: fixed;
  border: 0;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 0;
  color: var(--g-kit-black-80, #252528);
  font-size: 14px;

  th,
  td {
    padding: 12px 16px;
    border: 0;
    border-right: 1px solid var(--g-kit-black-20, #eeeeef);
    text-align: left;
    vertical-align: middle;
  }

  th {
    height: 40px;
    padding-top: 10px;
    padding-bottom: 10px;
    background: var(--g-kit-lime-50, #00ab4e);
    color: var(--g-kit-white, #ffffff);
    font-weight: var(--g-kit-font-weight-bold, 800);
    line-height: 20px;
    white-space: nowrap;
  }

  th:last-child,
  td:last-child {
    border-right: 0;
  }

  td {
    border-top: 1px solid var(--g-kit-black-20, #eeeeef);
    line-height: 20px;
  }

  th:nth-child(1),
  td:nth-child(1) { width: 19%; }
  th:nth-child(2),
  td:nth-child(2) { width: 19%; }
  th:nth-child(3),
  td:nth-child(3) { width: 21.5%; }
  th:nth-child(4),
  td:nth-child(4) { width: 16%; }
  th:nth-child(5),
  td:nth-child(5) { width: 12.5%; }
  th:nth-child(6),
  td:nth-child(6) { width: 12%; }

  tbody tr:last-child td {
    height: 40px !important;
    color: var(--g-kit-black-80, #252528);
    text-align: center;
  }
}

.gadai-one-page__pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;
  color: var(--g-kit-black-60, #58585b);
  font-size: 14px;
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

.gadai-one-page__tariff-input {
  :deep(.input-group) {
    height: 48px;
    overflow: hidden;
    border: 1px solid var(--g-kit-black-40, #bbbdc0);
    border-radius: 6px;
    background: var(--g-kit-black-20, #eeeeef);
  }

  :deep(.form-control) {
    height: 46px;
    border: 0;
    border-radius: 6px 0 0 6px;
    background: var(--g-kit-black-20, #eeeeef);
    color: var(--g-kit-black-60, #58585b);
    box-shadow: none;
  }

  :deep(.input-group:has(input:not(:disabled))) {
    border-color: var(--g-kit-black-20, #eeeeef);
    background: var(--g-kit-white, #ffffff);

    .form-control {
      background: var(--g-kit-white, #ffffff);
      color: var(--g-kit-black-80, #252528);
    }

    .gadai-one-page__tariff-suffix {
      background: var(--g-kit-white, #ffffff);
      color: var(--g-kit-black-80, #252528);
    }
  }
}

.gadai-one-page__tariff-suffix {
  display: flex;
  flex: 0 0 98px;
  align-items: center;
  justify-content: center;
  height: 46px;
  border-left: 1px solid var(--g-kit-black-40, #bbbdc0);
  background: var(--g-kit-black-20, #eeeeef);
  color: var(--g-kit-black-60, #58585b);
  font-size: 16px;
  line-height: 24px;
}

.gadai-one-page__radio-field {
  width: min(100%, 393px);
  margin: 0;
  padding: 0;
  border: 0;

  legend {
    float: none;
    width: auto;
    margin: 0 0 8px;
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

.gadai-one-page__photo-list {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.gadai-one-page__photo {
  position: relative;
}

.gadai-one-page__photo-count {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  border-radius: 6px;
  color: var(--g-kit-white, #ffffff);
  background: rgba(37, 37, 40, 0.6);
  font-size: 14px;
  font-weight: var(--g-kit-font-weight-bold, 800);
}

.gadai-one-page__modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
}

.gadai-one-page__submission-modal-copy {
  h2 {
    margin: 0 0 8px;
    color: var(--g-kit-black-80, #252528);
    font-size: 20px;
    font-weight: var(--g-kit-font-weight-bold, 800);
  }

  p {
    margin: 0;
    color: var(--g-kit-black-60, #58585b);
  }
}

:global(.gadai-one-page__modal.show) {
  display: block !important;
}

:global(.gadai-one-page__modal .modal-dialog) {
  position: relative;
  z-index: 1051;
  width: calc(100% - 32px);
  max-width: 520px;
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

  .gadai-one-page__pagination {
    align-items: flex-start;
    flex-direction: column;
  }

  .gadai-one-page__modal-actions {
    flex-direction: column-reverse;

    :deep(.btn) {
      width: 100%;
    }
  }

}
</style>
