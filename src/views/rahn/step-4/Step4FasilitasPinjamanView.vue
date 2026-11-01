<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import {
  GAlert,
  GButton,
  GInputText,
  GInputNominalStart,
  GLoading,
  GRadio,
} from '@/components'
import ModuleSectionCard from '@/components/shared/card/ModuleSectionCard.vue'
import {
  calculateRahnLoan,
  getMaximumRahnLoan,
  getRahnLoanTier,
} from '@/utils/rahnLoanCalculation'
import { rahnFlowKey } from '../rahnFlow'

const infoIcon = new URL('../../../../node_modules/kitvue-public/src/assets/images/icon-info.svg', import.meta.url).href

const flow = inject(rahnFlowKey)
if (!flow) throw new Error('Rahn flow context is unavailable')

const dataLoanOpen = ref(true)
const facilityOpen = ref(true)
const loanAmountError = ref('')
const isCalculating = ref(false)
const isCalculated = ref(false)
const { loanAmount, tariffChange, tariffRate } = flow

const totalEstimatedValue = computed(() => flow.collaterals.value.reduce(
  (total, collateral) => total + collateral.estimatedValue,
  0,
))
const maximumNormalLoan = computed(() => Math.floor(totalEstimatedValue.value * 0.8))
const maximumRatingLoan = computed(() => getMaximumRahnLoan(totalEstimatedValue.value))
const loanAmountValue = computed(() => Number(loanAmount.value.replace(/\D/g, '')) || 0)
const selectedTier = computed(() => getRahnLoanTier(loanAmountValue.value))
const numericTariffRate = computed(() => tariffRate.value
  ? Number(tariffRate.value.replace(',', '.'))
  : Number.NaN)
const appliedTariffRate = computed(() => tariffChange.value === 'Iya'
  ? numericTariffRate.value
  : selectedTier.value?.tariffRate ?? Number.NaN)
const fixedTariffRate = computed(() => selectedTier.value?.tariffRate)
const displayedTariffRate = computed(() => tariffChange.value === 'Iya'
  ? tariffRate.value
  : String(selectedTier.value?.tariffRate ?? '').replace('.', ','))
const selectedTierLabel = computed(() => selectedTier.value
  ? `${selectedTier.value.group} (${selectedTier.value.code})`
  : 'Terisi otomatis')
const loanDurationDays = computed(() => Number.parseInt(flow.fields.value.jangkaWaktu, 10))
const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID').format(value)
const formatTariffRate = (value: number | undefined) => (
  value === undefined || !Number.isFinite(value)
    ? 'Terisi otomatis'
    : `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(value)}%`
)
const specialTariffLabel = computed(() => tariffChange.value === 'Iya'
  ? `${formatTariffRate(appliedTariffRate.value)} Per 15 Hari`
  : '-')
const autoValue = (value: number | undefined) => (
  value === undefined ? 'Terisi otomatis' : `Rp${formatCurrency(value)}`
)

const calculation = computed(() => {
  if (!isCalculated.value) return null

  return calculateRahnLoan(
    loanAmountValue.value,
    totalEstimatedValue.value,
    appliedTariffRate.value,
    loanDurationDays.value,
  ) ?? null
})

const updateTariffRate = (value: string) => {
  tariffRate.value = value.replace(/[^\d,]/g, '').replace(/(,.*),/g, '$1')
}

watch([tariffChange, selectedTier], ([value, tier]) => {
  if (value === 'Iya' && !tariffRate.value && tier) {
    tariffRate.value = String(tier.tariffRate)
      .replace('.', ',')
  }
  if (value === 'Tidak') tariffRate.value = ''
})

watch([loanAmount, tariffRate, tariffChange], () => {
  isCalculated.value = false
  loanAmountError.value = ''
})

const calculateLoan = async () => {
  if (loanAmountValue.value < 50_000) {
    loanAmountError.value = 'Nominal uang pinjaman minimal Rp50.000.'
    return
  }
  if (!selectedTier.value) {
    loanAmountError.value = 'Golongan uang pinjaman tidak ditemukan.'
    return
  }
  if (!Number.isFinite(appliedTariffRate.value) || appliedTariffRate.value <= 0) {
    loanAmountError.value = 'Masukkan tarif lebih dari 0.'
    return
  }
  if (!Number.isFinite(loanDurationDays.value) || loanDurationDays.value <= 0) {
    loanAmountError.value = 'Jangka waktu pinjaman tidak valid.'
    return
  }

  const result = calculateRahnLoan(
    loanAmountValue.value,
    totalEstimatedValue.value,
    appliedTariffRate.value,
    loanDurationDays.value,
  )
  if (!result) {
    loanAmountError.value = 'Data pinjaman tidak dapat dihitung.'
    return
  }
  if (loanAmountValue.value > result.loanLimit) {
    loanAmountError.value = `Nominal uang pinjaman maksimal Rp${formatCurrency(result.loanLimit)} untuk golongan ${result.tier.code}.`
    return
  }

  loanAmountError.value = ''
  isCalculating.value = true
  try {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 1200))
    isCalculated.value = true
  } finally {
    isCalculating.value = false
  }
}
</script>

<template>
  <div class="form-content rahn-facility-content">
    <div class="form-card rahn-facility-card">
      <ModuleSectionCard title="Data Uang Pinjaman" v-model="dataLoanOpen">
        <div class="rahn-facility-section">
          <section class="rahn-facility-block" aria-labelledby="rahn-pawn-info">
            <h3 id="rahn-pawn-info">Informasi Gadai</h3>
            <div class="rahn-loan-summary">
              <div class="rahn-info-item">
                <strong>Total Taksiran</strong>
                <span>: Rp{{ formatCurrency(totalEstimatedValue) }}</span>
              </div>
              <div class="rahn-info-item">
                <strong>Maksimal Pinjaman Normal</strong>
                <span>: Rp{{ formatCurrency(maximumNormalLoan) }}</span>
              </div>
              <div class="rahn-info-item">
                <strong>Maksimal Pinjaman Customer Rating</strong>
                <span>: Rp{{ formatCurrency(maximumRatingLoan) }}</span>
              </div>
            </div>
          </section>

          <div class="rahn-rating-alert">
            <GAlert
              label="Nasabah mendapatkan rating Platinum Plus Holding."
              color="light-blue"
              variant="info"
            />
          </div>

          <div class="rahn-loan-input-grid">
            <div class="rahn-loan-field">
              <label for="rahn-loan-amount">Uang Pinjaman</label>
              <div class="rahn-loan-input-row">
                <GInputNominalStart
                  id="rahn-loan-amount"
                  v-model="loanAmount"
                  class="rahn-loan-input"
                  unit="Rupiah"
                  placeholder="Masukkan nominal"
                  :disabled="isCalculating"
                />
                <GButton
                  label="Hitung"
                  type="secondary"
                  size="lg"
                  :disabled="isCalculating"
                  @click="calculateLoan"
                />
              </div>
              <p v-if="loanAmountError" class="rahn-facility-error" role="alert">
                {{ loanAmountError }}
              </p>
            </div>

            <div class="rahn-loan-field">
              <label>Golongan Uang Pinjaman</label>
              <div class="rahn-auto-field" aria-live="polite">
                {{ selectedTierLabel }}
              </div>
            </div>
          </div>
        </div>
      </ModuleSectionCard>

      <ModuleSectionCard title="Fasilitas Pinjaman" v-model="facilityOpen">
        <div class="rahn-facility-section">
          <section class="rahn-facility-block" aria-labelledby="rahn-facility-details">
            <h3 id="rahn-facility-details">Detail Fasilitas Pinjaman</h3>
            <div class="rahn-detail-grid">
              <div class="rahn-info-item">
                <strong>Tarif Fixed</strong>
                <span>: {{ formatTariffRate(fixedTariffRate) }} Per 15 Hari</span>
              </div>
              <div class="rahn-info-item">
                <strong class="rahn-special-rate-label">
                  Tarif Khusus
                  <img :src="infoIcon" alt="" aria-hidden="true" />
                </strong>
                <span>: {{ specialTariffLabel }}</span>
              </div>
              <div class="rahn-info-item">
                <strong>Sewa Modal</strong>
                <span>: {{ autoValue(calculation?.periodicRental) }}</span>
              </div>
              <div class="rahn-info-item">
                <strong>Total Sewa Modal</strong>
                <span>: {{ autoValue(calculation?.totalRental) }}</span>
              </div>
            </div>
          </section>

          <fieldset class="rahn-tariff-options">
            <legend>Perubahan Tarif</legend>
            <GRadio
              v-model="tariffChange"
              :items="[
                { text: 'Iya', value: 'Iya' },
                { text: 'Tidak', value: 'Tidak' },
              ]"
            />
          </fieldset>

          <div class="rahn-rate-row">
            <GInputText
              id="rahn-tariff-rate"
              class="rahn-rate-input"
              :model-value="displayedTariffRate"
              type="text"
              :disabled="tariffChange !== 'Iya' || isCalculating"
              aria-label="Tarif perubahan"
              @update:model-value="updateTariffRate"
            >
              <template #suffix>
                <span class="rahn-rate-suffix">%</span>
              </template>
            </GInputText>
            <span class="rahn-rate-period">Per 15 Hari</span>
          </div>

          <hr class="rahn-facility-divider">

          <section class="rahn-facility-block" aria-labelledby="rahn-customer-receipt">
            <h3 id="rahn-customer-receipt">Informasi Diterima Nasabah</h3>
            <div class="rahn-detail-grid">
              <div class="rahn-info-item">
                <strong>Biaya Administrasi</strong>
                <span>: {{ autoValue(calculation?.administrationFee) }}</span>
              </div>
              <div class="rahn-info-item">
                <strong>Biaya Premi</strong>
                <span>: {{ autoValue(calculation?.premiumFee) }}</span>
              </div>
              <div class="rahn-info-item">
                <strong>Diterima Nasabah</strong>
                <span>: {{ autoValue(calculation?.receivedAmount) }}</span>
              </div>
            </div>
          </section>
        </div>
      </ModuleSectionCard>
    </div>
  </div>

  <GLoading
    v-model="isCalculating"
    class="rahn-loading"
    :count="0"
    title="Memproses Data"
    persistent
  />
</template>

<style scoped lang="scss">
.rahn-facility-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.rahn-facility-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;

  h3 {
    margin: 0;
    color: var(--g-kit-black-80, #252528);
    font-size: var(--g-kit-font-size-omicron, 16px);
    font-weight: var(--g-kit-font-weight-bold, 800);
    line-height: var(--g-kit-line-height-omicron, 24px);
  }
}

.rahn-loan-summary,
.rahn-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 24px;
  row-gap: 12px;
}

.rahn-info-item {
  display: grid;
  grid-template-columns: 165px minmax(0, 1fr);
  align-items: start;
  gap: 12px;
  min-width: 0;
  color: var(--g-kit-black-80, #252528);
  font-size: var(--g-kit-font-size-omicron, 16px);
  line-height: var(--g-kit-line-height-omicron, 24px);

  strong {
    font-weight: var(--g-kit-font-weight-bold, 800);
  }

  > span {
    font-weight: var(--g-kit-font-weight-normal, 600);
  }
}

.rahn-rating-alert {
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
    font-size: var(--g-kit-font-size-omicron, 16px);
    line-height: var(--g-kit-line-height-omicron, 24px);
  }
}

.rahn-loan-input-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.rahn-loan-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;

  > label {
    color: var(--g-kit-black-80, #252528);
    font-size: var(--g-kit-font-size-omicron, 16px);
    font-weight: var(--g-kit-font-weight-bold, 800);
    line-height: var(--g-kit-line-height-omicron, 24px);
  }
}

.rahn-loan-input-row {
  display: grid;
  grid-template-columns: minmax(0, 2.65fr) minmax(88px, 1fr);
  align-items: stretch;
  gap: 24px;
}

.rahn-loan-input {
  min-width: 0;
  margin-top: 0px !important;
}

.rahn-calculate-button {
  width: 100%;
  // height: 72px;
  padding: 0 16px;
  border: 1px solid var(--g-kit-lime-50, #00ab4e);
  border-radius: 8px;
  background-color: var(--g-kit-white, #ffffff);
  color: var(--g-kit-lime-50, #00ab4e);
  font-size: 24px;
  font-weight: var(--g-kit-font-weight-bold, 800);
}

// ::deep(.form-card .group-input) {
//   margin-top: 0;
// }

// :deep(.rahn-loan-input .custom-input-group-icon) {
//   height: 72px;
//   overflow: hidden;
//   border-radius: 8px;
// }

// :deep(.rahn-loan-input .input-group-text) {
//   min-width: 134px;
//   height: 70px;
//   justify-content: center;
//   font-size: 24px;
// }

// :deep(.rahn-loan-input .form-control) {
//   height: 70px;
//   font-size: 24px;
// }

.rahn-auto-field {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  min-height: 48px;
  padding: 11px;
  border: 1px solid var(--g-kit-black-20, #eeeeef);
  border-radius: 6px;
  background-color: var(--g-kit-black-20, #eeeeef);
  color: var(--g-kit-black-60, #58585b);
  font-size: var(--g-kit-font-size-omicron, 16px);
  line-height: var(--g-kit-line-height-omicron, 24px);
}

.rahn-facility-error {
  margin: 4px 0 0;
  color: var(--g-kit-red-50, #ae1e22);
  font-size: var(--g-kit-font-size-omega, 12px);
  line-height: var(--g-kit-line-height-omega, 18px);
}

.rahn-special-rate-label {
  display: flex;
  align-items: center;
  gap: 4px;

  img {
    width: 18px;
    height: 18px;
  }
}

.rahn-tariff-options {
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

.rahn-rate-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.rahn-rate-input {
  width: 270px;
  max-width: 100%;

  :deep(.input-group) {
    height: 48px;
    border: 1px solid var(--g-kit-black-40, #bbbdc0);
    border-radius: 6px;
    background-color: var(--g-kit-black-20, #eeeeef);
  }

  :deep(.form-control) {
    min-width: 0;
    height: 46px;
    border: 0;
    border-radius: 6px 0 0 6px;
    background-color: var(--g-kit-black-20, #eeeeef);
    color: var(--g-kit-black-60, #58585b);
    font-size: var(--g-kit-font-size-omicron, 16px);
    line-height: var(--g-kit-line-height-omicron, 24px);
    box-shadow: none;
  }

  :deep(.input-group:has(input:not(:disabled))) {
    border-color: var(--g-kit-black-20, #eeeeef);
    background-color: var(--g-kit-white, #ffffff);

    .form-control {
      background-color: var(--g-kit-white, #ffffff);
      color: var(--g-kit-black-80, #252528);
    }
  }
}

.rahn-rate-suffix {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 46px;
  border-left: 1px solid var(--g-kit-black-40, #bbbdc0);
  color: var(--g-kit-black-60, #58585b);
  font-size: var(--g-kit-font-size-omicron, 16px);
  line-height: var(--g-kit-line-height-omicron, 24px);
}

.rahn-rate-period {
  color: var(--g-kit-black-80, #252528);
  font-size: var(--g-kit-font-size-omicron, 16px);
  font-weight: var(--g-kit-font-weight-normal, 600);
  line-height: var(--g-kit-line-height-omicron, 24px);
  white-space: nowrap;
}

.rahn-facility-divider {
  width: 100%;
  margin: 0;
  border: 0;
  border-top: 1px solid var(--g-kit-black-20, #eeeeef);
  opacity: 1;
}

@media (max-width: 767px) {
  .rahn-facility-section {
    gap: 20px;
  }

  .rahn-loan-summary,
  .rahn-detail-grid,
  .rahn-loan-input-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .rahn-info-item {
    grid-template-columns: minmax(0, 1fr);
    gap: 2px;
    font-size: var(--g-kit-font-size-sigma, 14px);
    line-height: var(--g-kit-line-height-sigma, 20px);
  }

  .rahn-loan-input-row {
    gap: 16px;
  }

  :deep(.rahn-loan-input .input-group-text) {
    min-width: 92px;
    font-size: 16px;
  }

  :deep(.rahn-loan-input .form-control) {
    font-size: 16px;
  }

  .rahn-rate-row {
    flex-wrap: wrap;
    gap: 12px;
  }

  .rahn-rate-input {
    width: min(270px, 100%);
  }
}

@media (max-width: 575px) {
  .rahn-loan-field > label {
    font-size: var(--g-kit-font-size-omega, 12px);
    line-height: var(--g-kit-line-height-omega, 18px);
  }

  .rahn-loan-input-row {
    grid-template-columns: minmax(0, 2.65fr) minmax(0, 1fr);
  }

  .rahn-calculate-button {
    height: 48px;
    border-radius: 6px;
    font-size: var(--g-kit-font-size-omicron, 16px);
  }

  :deep(.rahn-loan-input .custom-input-group-icon) {
    height: 48px;
    border-radius: 6px;
  }

  :deep(.rahn-loan-input .input-group-text) {
    height: 46px;
    font-size: var(--g-kit-font-size-omicron, 16px);
  }

  :deep(.rahn-loan-input .form-control) {
    height: 46px;
    font-size: var(--g-kit-font-size-omega, 12px);
  }
}
</style>
