<script setup lang="ts">
import type { PaymentSummary } from '../payment-types'
import { paymentAsset } from '../asset-url'
import PaymentButton from './PaymentButton.vue'

const props = withDefaults(defineProps<{
  summary: PaymentSummary
  hasCredit: boolean
  mode?: 'form' | 'instructions' | 'success' | 'failed'
  refreshLabel?: string
  refreshDisabled?: boolean
  allowUnvalidatedSubmit?: boolean
  transactionId?: string
}>(), {
  mode: 'form',
  refreshLabel: 'Perbarui Halaman',
  refreshDisabled: false,
  allowUnvalidatedSubmit: false,
  transactionId: 'TRX-20241101-99812',
})

const emit = defineEmits<{
  copy: [value: string]
  continue: []
  refresh: []
  home: []
  print: []
}>()

const creditInfoIcon = paymentAsset('credit-info.svg')
const paymentCopyIcon = paymentAsset('payment-copy.svg')
const secureTransactionIcon = paymentAsset('secure-transaction.svg')

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value).replace(/\u00a0/g, '')
}

function formatCreditNumber(value: string) {
  return value.replace(/(\d{4})(?=\d)/g, '$1 ')
}

const transactionLabel = () =>
  props.mode === 'success' || props.mode === 'failed'
    ? props.summary.transactionType || '-'
    : props.summary.transactionType === 'Pelunasan'
      ? 'Pelunasan Gadai'
      : props.summary.transactionType || '-'
</script>

<template>
  <section class="pgd-summary-card" :class="`pgd-summary-card--${props.mode}`" aria-label="Detail pembayaran">
    <h2 class="pgd-summary-card__title">Detail Kredit</h2>

    <!-- Info banner in form stage -->
    <div v-if="props.mode === 'form'" class="pgd-summary-card__notice">
      <div class="pgd-summary-card__notice-icon">
        <img :src="creditInfoIcon" alt="" />
      </div>
      <p>Periksa rincian transaksimu sebelum melanjutkan</p>
    </div>

    <!-- Loan details breakdown -->
    <dl class="pgd-credit-details">
      <template v-if="props.mode === 'success' || props.mode === 'failed'">
        <div class="pgd-detail-row">
          <dt>ID Transaksi</dt>
          <dd class="pgd-detail-row__copyable">
            <span>{{ props.transactionId || formatCreditNumber(summary.number) }}</span>
            <button
              class="pgd-copy-button"
              type="button"
              aria-label="Salin ID transaksi"
              @click="emit('copy', props.transactionId || summary.number)"
            >
              <img :src="paymentCopyIcon" alt="" />
            </button>
          </dd>
        </div>
        <div class="pgd-detail-row">
          <dt>Jenis Transaksi</dt>
          <dd>{{ transactionLabel() }}</dd>
        </div>
        <div class="pgd-detail-row">
          <dt>Nomor Kredit</dt>
          <dd>{{ formatCreditNumber(summary.number) }}</dd>
        </div>
        <div class="pgd-detail-row">
          <dt>Metode Pembayaran</dt>
          <dd>{{ summary.paymentMethod?.label || '-' }}</dd>
        </div>
      </template>
      <template v-else>
        <div class="pgd-detail-row">
          <dt>Nomor Kredit</dt>
          <dd class="pgd-detail-row__copyable">
            <span>{{ props.hasCredit ? formatCreditNumber(summary.number) : '-' }}</span>
            <button
              v-if="props.hasCredit"
              class="pgd-copy-button"
              type="button"
              aria-label="Salin nomor kredit"
              @click="emit('copy', summary.number)"
            >
              <img :src="paymentCopyIcon" alt="" />
            </button>
          </dd>
        </div>
        <div class="pgd-detail-row">
          <dt>Jenis Transaksi</dt>
          <dd>{{ props.hasCredit ? transactionLabel() : '-' }}</dd>
        </div>
        <div class="pgd-detail-row">
          <dt>Nama Nasabah</dt>
          <dd>{{ props.hasCredit ? summary.customer : '-' }}</dd>
        </div>
        <div class="pgd-detail-row">
          <dt>Uang Pinjaman</dt>
          <dd>{{ props.hasCredit ? formatCurrency(summary.loanAmount) : '-' }}</dd>
        </div>
        <div class="pgd-detail-row">
          <dt>
            <span>Sewa Modal</span>
            <span class="pgd-info-icon" title="Sewa modal per hari" aria-label="Sewa modal per hari">
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5" />
                <path d="M8 5v.5M8 7.5v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </span>
          </dt>
          <dd>{{ props.hasCredit ? `${formatCurrency(summary.dailyRent)} / Hari` : '-' }}</dd>
        </div>
        <div class="pgd-detail-row">
          <dt>Total Hari Sewa Modal</dt>
          <dd>{{ props.hasCredit ? `${summary.rentDays} Hari` : '-' }}</dd>
        </div>
        <div class="pgd-detail-row">
          <dt>Metode Pembayaran</dt>
          <dd>{{ props.hasCredit ? summary.paymentMethod?.label || '-' : '-' }}</dd>
        </div>
      </template>
    </dl>

    <!-- 4px Section Divider -->
    <div class="pgd-section-divider" aria-hidden="true"></div>

    <!-- Payment Breakdown -->
    <div class="pgd-summary-card__payment">
      <h3 class="pgd-summary-card__subtitle">Detail Pembayaran</h3>
      <dl class="pgd-breakdown">
        <div v-if="summary.transactionType === 'Cicil'" class="pgd-detail-row">
          <dt>Jumlah Cicilan</dt>
          <dd>{{ formatCurrency(summary.installmentAmount) }}</dd>
        </div>
        <div v-else class="pgd-detail-row">
          <dt>Sisa Uang Pinjaman</dt>
          <dd>{{ props.hasCredit && summary.transactionType !== 'Sewa Modal' ? formatCurrency(summary.loanAmount) : '-' }}</dd>
        </div>
        <div class="pgd-detail-row">
          <dt>Sewa Modal</dt>
          <dd>{{ props.hasCredit && summary.transactionType !== 'Cicil' ? formatCurrency(summary.rentAmount) : '-' }}</dd>
        </div>
        <div class="pgd-detail-row">
          <dt>Biaya Layanan</dt>
          <dd>{{ props.hasCredit && summary.transactionType ? formatCurrency(summary.serviceFee) : '-' }}</dd>
        </div>
        <!-- 1px Item Divider before Total -->
        <div class="pgd-item-divider" aria-hidden="true"></div>
        <div class="pgd-detail-row pgd-breakdown__total">
          <dt>Total</dt>
          <dd>{{ props.hasCredit && summary.transactionType ? formatCurrency(summary.total) : '-' }}</dd>
        </div>
      </dl>
    </div>

    <!-- Legal disclaimer -->
    <div v-if="props.mode === 'form'" class="pgd-terms">
      <img class="pgd-terms__icon" :src="secureTransactionIcon" alt="" />
      <span>
        Dengan melanjutkan proses ini, kamu menyetujui
        <a href="#syarat-ketentuan" class="pgd-terms__link" @click.prevent> Syarat &amp; Ketentuan</a>
        yang berlaku.
      </span>
    </div>

    <!-- Dynamic Actions -->
    <div v-if="props.mode === 'form'" class="pgd-summary-card__actions">
      <button
        class="pgd-submit-button"
        type="button"
        :disabled="props.allowUnvalidatedSubmit ? false : (!props.hasCredit || !summary.transactionType || !summary.paymentMethod)"
        @click="emit('continue')"
      >
        Lanjutkan
      </button>
    </div>
    <div v-else-if="props.mode === 'success'" class="pgd-summary-card__actions pgd-summary-card__actions--result">
      <PaymentButton label="Kembali ke Beranda" variant="secondary" @click="emit('home')" />
      <PaymentButton label="Cetak Bukti Pembayaran" variant="primary" @click="emit('print')" />
    </div>
    <div v-else-if="props.mode === 'failed'" class="pgd-summary-card__actions pgd-summary-card__actions--result">
      <PaymentButton label="Kembali ke Beranda" variant="primary" @click="emit('home')" />
    </div>
    <div v-else-if="props.mode === 'instructions'" class="pgd-summary-card__actions pgd-summary-card__actions--instructions">
      <PaymentButton :label="props.refreshLabel" variant="secondary" :disabled="props.refreshDisabled" @click="emit('refresh')" />
      <PaymentButton label="Kembali ke Beranda" @click="emit('home')" />
    </div>
  </section>
</template>
