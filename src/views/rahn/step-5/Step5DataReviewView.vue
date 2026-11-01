<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { GImageView, GTable } from '@/components'
import ModuleSectionCard from '@/components/shared/card/ModuleSectionCard.vue'
import { RahnReadonlyInfoGrid, type ReadonlyInfoItem } from '@/components/modules/rahn'
import {
  calculateRahnLoan,
  getRahnLoanTier,
} from '@/utils/rahnLoanCalculation'
import { rahnFlowKey } from '../rahnFlow'

const flow = inject(rahnFlowKey)
if (!flow) throw new Error('Rahn flow context is unavailable')

const applicationOpen = ref(true)
const customerOpen = ref(true)
const collateralOpen = ref(true)
const facilityOpen = ref(true)

const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID').format(value)
const displayValue = (value: string | undefined) => value?.trim() || '-'
const loanAmountValue = computed(() => Number(flow.loanAmount.value.replace(/\D/g, '')) || 0)
const totalEstimatedValue = computed(() => flow.collaterals.value.reduce(
  (total, collateral) => total + collateral.estimatedValue,
  0,
))
const selectedTier = computed(() => getRahnLoanTier(loanAmountValue.value))
const tariffRate = computed(() => flow.tariffChange.value === 'Iya'
  ? Number(flow.tariffRate.value.replace(',', '.'))
  : selectedTier.value?.tariffRate ?? Number.NaN)
const loanDurationDays = computed(() => Number.parseInt(flow.fields.value.jangkaWaktu, 10))
const loanCalculation = computed(() => {
  const result = calculateRahnLoan(
    loanAmountValue.value,
    totalEstimatedValue.value,
    tariffRate.value,
    loanDurationDays.value,
  )

  return result && loanAmountValue.value <= result.loanLimit ? result : undefined
})
const formatAmount = (value: number) => `Rp${formatCurrency(value)}`
const amountOrAutomatic = (value: number | undefined) => (
  value === undefined ? 'Terisi otomatis' : formatAmount(value)
)
const fixedTariff = computed(() => selectedTier.value
  ? `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(selectedTier.value.tariffRate)}% Per 15 Hari`
  : 'Terisi otomatis')
const specialTariff = computed(() => flow.tariffChange.value === 'Iya'
  ? `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(tariffRate.value)}% Per 15 Hari`
  : '-')
const creditDate = computed(() => flow.akadItems.value.find((item) => item.label === 'Tanggal Kredit')?.value)
const dueDate = computed(() => flow.akadItems.value.find((item) => item.label === 'Tanggal Jatuh Tempo')?.value)
const auctionDate = computed(() => flow.akadItems.value.find((item) => item.label === 'Tanggal Lelang')?.value)

const applicationItems = computed<ReadonlyInfoItem[]>(() => [
  { label: 'Uang Pinjaman', value: loanAmountValue.value ? formatAmount(loanAmountValue.value) : 'Terisi otomatis' },
  { label: 'Produk', value: displayValue(flow.fields.value.produk) },
  { label: 'Jangka Waktu', value: displayValue(flow.fields.value.jangkaWaktu) },
  { label: 'Tanggal Kredit', value: displayValue(creditDate.value) },
  { label: 'Tanggal Jatuh Tempo', value: displayValue(dueDate.value) },
  { label: 'Tanggal Lelang', value: displayValue(auctionDate.value) },
])

const customerItems = computed<ReadonlyInfoItem[]>(() => [
  { label: 'CIF', value: displayValue(flow.selectedCustomer.value?.cif) },
  { label: 'Nomor Identitas', value: displayValue(flow.selectedCustomer.value?.nik) },
  { label: 'Nama Lengkap', value: displayValue(flow.selectedCustomer.value?.name) },
  { label: 'Nomor Handphone', value: displayValue(flow.selectedCustomer.value?.phone) },
])

const customerAddressItems = computed<ReadonlyInfoItem[]>(() => [
  { label: 'Kode Pos', value: displayValue(flow.selectedCustomer.value?.postalCode) },
  { label: 'Kelurahan', value: displayValue(flow.selectedCustomer.value?.kelurahan) },
  { label: 'Kecamatan', value: displayValue(flow.selectedCustomer.value?.kecamatan) },
  { label: 'Kota / Kabupaten', value: displayValue(flow.selectedCustomer.value?.city) },
  { label: 'Provinsi', value: displayValue(flow.selectedCustomer.value?.province) },
  { label: 'RT', value: displayValue(flow.selectedCustomer.value?.rt) },
  { label: 'RW', value: displayValue(flow.selectedCustomer.value?.rw) },
  { label: 'Alamat', value: displayValue(flow.selectedCustomer.value?.address) },
])

const facilityItems = computed<ReadonlyInfoItem[]>(() => [
  { label: 'Total Taksiran', value: formatAmount(totalEstimatedValue.value) },
  { label: 'Uang Pinjaman', value: loanAmountValue.value ? formatAmount(loanAmountValue.value) : 'Terisi otomatis' },
  { label: 'Tarif Fixed', value: fixedTariff.value },
  { label: 'Tarif Khusus', value: specialTariff.value },
  { label: 'Total Sewa Modal', value: amountOrAutomatic(loanCalculation.value?.totalRental) },
  { label: 'Biaya Administrasi', value: amountOrAutomatic(loanCalculation.value?.administrationFee) },
  { label: 'Biaya Asuransi', value: amountOrAutomatic(loanCalculation.value?.premiumFee) },
  { label: 'Diterima Nasabah', value: amountOrAutomatic(loanCalculation.value?.receivedAmount) },
])

const collateralColumns = [
  { key: 'rubric', label: 'Rubrik' },
  { key: 'collateralType', label: 'Tipe Jaminan' },
  { key: 'detail', label: 'Detail Jaminan' },
  { key: 'photos', label: 'Foto Jaminan' },
  { key: 'estimatedValue', label: 'Taksiran' },
]

const collateralRows = computed(() => flow.collaterals.value.map((collateral, index) => ({
  id: `${index}-${collateral.brand}`,
  rubric: collateral.rubric,
  collateralType: collateral.collateralType,
  detail: '',
  photos: collateral.photos,
  estimatedValue: collateral.estimatedValue,
  collateral,
})))

const photosStartingAt = (photos: string[], startIndex: number) => [
  ...photos.slice(startIndex),
  ...photos.slice(0, startIndex),
]
</script>

<template>
  <div class="form-content rahn-review-content">
    <div class="form-card rahn-review-card">
      <ModuleSectionCard title="Data Pengajuan" v-model="applicationOpen">
        <RahnReadonlyInfoGrid
          variant="review"
          :items="applicationItems"
        />
      </ModuleSectionCard>

      <ModuleSectionCard title="Data Nasabah" v-model="customerOpen">
        <div class="rahn-review-group">
          <RahnReadonlyInfoGrid
            title="Informasi Nasabah"
            variant="review"
            :items="customerItems"
          />
          <hr class="rahn-review-divider">
          <RahnReadonlyInfoGrid
            title="Alamat KTP"
            variant="review"
            :items="customerAddressItems"
          />
        </div>
      </ModuleSectionCard>

      <ModuleSectionCard title="Data Jaminan" v-model="collateralOpen">
        <div class="rahn-review-table-scroll">
          <GTable
            class="rahn-review-table"
            :data="collateralRows"
            :columns="collateralColumns"
            nodata-message="Tidak ada data yang ditampilkan."
          >
            <template #detail="{ item }">
              <span class="rahn-review-collateral-details">
                Mitra : {{ item.collateral.partner }}<br>
                Merek Emas : {{ item.collateral.brand }}<br>
                Denominasi : {{ item.collateral.denomination }} gram<br>
                Jumlah Keping : {{ item.collateral.pieces }} Pcs<br>
                Karat : {{ item.collateral.karat }}<br>
                Keterangan : {{ item.collateral.description }}
              </span>
            </template>
            <template #photos="{ item }">
              <div class="rahn-review-photos">
                <div
                  v-for="(photo, index) in item.photos.slice(0, 2)"
                  :key="`${item.id}-${index}`"
                  class="rahn-review-photo"
                >
                  <GImageView
                    :img-src="photo"
                    :images="photosStartingAt(item.photos, index)"
                    img-alt="Foto barang jaminan"
                    aspect-ratio="1:1"
                    :width="81"
                    :height="81"
                    fit="cover"
                    previewable
                  />
                  <span
                    v-if="index === 1 && item.photos.length > 2"
                    class="rahn-review-photo-count"
                  >
                    +{{ item.photos.length - 2 }}
                  </span>
                </div>
              </div>
            </template>
            <template #estimatedValue="{ value }">
              {{ formatAmount(value) }}
            </template>
          </GTable>
        </div>
      </ModuleSectionCard>

      <ModuleSectionCard title="Fasilitas Pinjaman" v-model="facilityOpen">
        <RahnReadonlyInfoGrid
          variant="review"
          :items="facilityItems"
        />
      </ModuleSectionCard>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rahn-review-card {
  margin-bottom: 0;
}

.rahn-review-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rahn-review-divider {
  width: 100%;
  margin: 0;
  border: 0;
  border-top: 1px solid var(--g-kit-black-20, #eeeeef);
  opacity: 1;
}

.rahn-review-table-scroll {
  overflow-x: auto;
  width: 100%;
}

.rahn-review-table-scroll :deep(.rahn-review-table) {
  width: 100%;
  min-width: 810px;
  margin: 0;
  border-color: var(--g-kit-black-20, #eeeeef);
  color: var(--g-kit-black-80, #252528);
  font-size: var(--g-kit-font-size-sigma, 14px);
  vertical-align: top;
}

.rahn-review-table-scroll :deep(.rahn-review-table thead th) {
  padding: 12px;
  border-color: var(--g-kit-white, #ffffff);
  background-color: var(--g-kit-lime-50, #00ab4e);
  color: var(--g-kit-white, #ffffff);
  font-size: var(--g-kit-font-size-sigma, 14px);
  font-weight: var(--g-kit-font-weight-bold, 800);
  white-space: nowrap;
}

.rahn-review-table-scroll :deep(.rahn-review-table tbody td) {
  min-height: 120px;
  padding: 12px;
  border-color: var(--g-kit-black-20, #eeeeef);
  line-height: var(--g-kit-line-height-sigma, 20px);
}

.rahn-review-table-scroll :deep(.rahn-review-table th:nth-child(1)) {
  min-width: 120px;
}

.rahn-review-table-scroll :deep(.rahn-review-table th:nth-child(2)) {
  min-width: 110px;
}

.rahn-review-table-scroll :deep(.rahn-review-table th:nth-child(3)) {
  min-width: 180px;
}

.rahn-review-table-scroll :deep(.rahn-review-table th:nth-child(4)) {
  min-width: 140px;
}

.rahn-review-table-scroll :deep(.rahn-review-table th:nth-child(5)) {
  min-width: 110px;
  text-align: right;
}

.rahn-review-collateral-details {
  white-space: normal;
}

.rahn-review-photos {
  display: flex;
  gap: 8px;
}

.rahn-review-photo {
  position: relative;
  flex: 0 0 81px;
  width: 81px;
  height: 81px;
  overflow: hidden;
  border-radius: 8px;

  :deep(img) {
    border-radius: 8px;
  }
}

.rahn-review-photo-count {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background-color: rgb(0 0 0 / 50%);
  color: var(--g-kit-white, #ffffff);
  font-weight: var(--g-kit-font-weight-bold, 800);
}

@media (max-width: 767px) {
  .rahn-review-group {
    gap: 12px;
  }
}
</style>
