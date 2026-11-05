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

const paymentCopyIcon = paymentAsset('payment-copy.svg')

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

const transactionLabel = () => {
  if (!props.summary.transactionType) return '-'
  if (props.summary.transactionType === 'Pelunasan') return 'Pelunasan Gadai'
  if (props.summary.transactionType === 'Sewa Modal') return 'Perpanjang'
  return props.summary.transactionType
}
</script>

<template>
  <section class="pgd-summary-card" :class="`pgd-summary-card--${props.mode}`" aria-label="Detail pembayaran">
    <h2 class="pgd-summary-card__title">Detail Kredit</h2>

    <!-- Info banner in form stage -->
    <div v-if="props.mode === 'form'" class="pgd-summary-card__notice">
      <div class="pgd-summary-card__notice-icon" aria-hidden="true">
        <svg viewBox="0 0 20 20" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="10" fill="#00AB4E" />
          <path d="M10 6a1 1 0 100-2 1 1 0 000 2zm-1 3v6h2V9H9z" fill="#ffffff" />
        </svg>
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
          <dd>
            <span>{{ props.hasCredit ? formatCreditNumber(summary.number) : '-' }}</span>
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
          <dt>
            <span>Hari Gadai</span>
            <span class="pgd-info-icon" title="Hari Gadai" aria-label="Hari Gadai">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="8" cy="8" r="7" stroke="#00AB4E" stroke-width="1.25" />
                <circle cx="8" cy="5" r="0.75" fill="#00AB4E" />
                <path d="M8 7v4" stroke="#00AB4E" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </span>
          </dt>
          <dd>{{ props.hasCredit ? `${summary.rentDays || 60} Hari` : '-' }}</dd>
        </div>
        <div class="pgd-detail-row">
          <dt>
            <span>Tarif Sewa Modal</span>
            <span class="pgd-info-icon" title="Tarif Sewa Modal" aria-label="Tarif Sewa Modal">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="8" cy="8" r="7" stroke="#00AB4E" stroke-width="1.25" />
                <circle cx="8" cy="5" r="0.75" fill="#00AB4E" />
                <path d="M8 7v4" stroke="#00AB4E" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </span>
          </dt>
          <dd>{{ props.hasCredit ? (summary.rentRateLabel || 'Rp37.500 / 15 hari') : '-' }}</dd>
        </div>
        <div class="pgd-detail-row">
          <dt>Metode Pembayaran</dt>
          <dd>{{ props.hasCredit ? summary.paymentMethod?.label || '-' : '-' }}</dd>
        </div>
      </template>
    </dl>

    <!-- Section Divider -->
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
          <dt>Uang Pinjaman</dt>
          <dd>{{ props.hasCredit && summary.transactionType !== 'Sewa Modal' ? formatCurrency(summary.loanAmount) : '-' }}</dd>
        </div>
        <div class="pgd-detail-row">
          <dt>Sewa Modal</dt>
          <dd>{{ props.hasCredit && summary.transactionType !== 'Cicil' ? formatCurrency(summary.rentAmount) : '-' }}</dd>
        </div>
        <div v-if="props.hasCredit && summary.transactionType" class="pgd-detail-row">
          <dt>Biaya Admin</dt>
          <dd>{{ summary.adminFee !== undefined ? formatCurrency(summary.adminFee) : 'Rp1.000' }}</dd>
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
      <div class="pgd-terms__check" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M6 14.1271C6 10.5453 6 8.75441 6.4116 8.15185C6.82211 7.55041 8.45871 6.97361 11.733 5.82113L12.3569 5.60161C14.0632 5.00017 14.9158 4.70001 15.8 4.70001C16.6842 4.70001 17.5368 5.00017 19.2431 5.60161L19.867 5.82113C23.1413 6.97361 24.7779 7.55041 25.1884 8.15185C25.6 8.75441 25.6 10.5464 25.6 14.1271V15.8899C25.6 22.2045 20.9842 25.2699 18.0878 26.5703C17.3027 26.9231 16.9107 27.1 15.8 27.1C14.6893 27.1 14.2973 26.9231 13.5122 26.5703C10.6158 25.2688 6 22.2056 6 15.8899V14.1271Z" fill="#00AB4E"/>
          <path d="M20.5189 12.0999C20.9346 12.481 20.9627 13.1269 20.5817 13.5426L14.9658 19.6689C14.7588 19.8948 14.4613 20.0157 14.1554 19.9984C13.8495 19.9811 13.5676 19.8273 13.3874 19.5795L11.3453 16.7716C11.0136 16.3156 11.1144 15.677 11.5705 15.3453C12.0265 15.0136 12.6651 15.1144 12.9968 15.5705L14.3044 17.3684L19.0763 12.1627C19.4574 11.747 20.1032 11.7189 20.5189 12.0999Z" fill-rule="evenodd" clip-rule="evenodd" fill="white"/>
        </svg>
      </div>
      <span>
        Dengan melanjutkan proses ini, kamu menyetujui
        <a href="#syarat-ketentuan" class="pgd-terms__link" @click.prevent>Syarat &amp; Ketentuan</a>
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
