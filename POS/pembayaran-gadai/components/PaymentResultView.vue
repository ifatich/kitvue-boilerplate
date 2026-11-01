<script setup lang="ts">
/**
 * PaymentResultView.vue
 *
 * Semantic Vue 3 implementation replacing static raster PNG placeholders (result-success.png / result-failure.png)
 * with 100% vector SVG illustrations, accessible typography, copyable transaction ID, and action handlers.
 *
 * Conforms to:
 * - Figma Node 336:54858 (EndState success)
 * - Figma Node 336:55187 (EndState failed)
 * - Figma Node 336:45782 & 336:55337 (Detail Pembayaran receipt summaries)
 * - Kitvue tokens (--g-kit-*) and Bootstrap 5 utilities.
 */
import { computed, ref } from 'vue'
import type { PaymentSummary } from '../payment-types'
import IllustrationFlowSuccess from './illustrations/IllustrationFlowSuccess.vue'
import IllustrationFlowFailed from './illustrations/IllustrationFlowFailed.vue'
import PaymentButton from './PaymentButton.vue'

interface Props {
  /** Outcome status of transaction */
  status: 'success' | 'failed'
  /** Optional transaction summary dataset */
  summary?: PaymentSummary | null
  /** Optional custom title override */
  title?: string
  /** Optional custom description override */
  description?: string
  /** Optional error message override */
  errorMessage?: string
  /** Optional transaction ID override */
  transactionId?: string
  /**
   * When true, renders an all-in-one composite view (illustration card + receipt details + actions).
   * When false (default), renders the dedicated 569px EndState Card intended to pair with CreditDetailsCard.
   */
  embeddedSummary?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  summary: null,
  title: '',
  description: '',
  errorMessage: '',
  transactionId: '',
  embeddedSummary: false,
})

const emit = defineEmits<{
  (e: 'home'): void
  (e: 'print'): void
  (e: 'copy', trxId: string): void
}>()

const isSuccess = computed(() => props.status === 'success')

const defaultTitle = computed(() =>
  isSuccess.value
    ? 'Pelunasan Gadai Berhasil Diproses'
    : 'Pelunasan Gadai Perhiasan Gagal',
)

const displayTitle = computed(() => props.title || defaultTitle.value)

const defaultDescription = computed(() => {
  if (isSuccess.value) {
    return 'Transaksi telah tercatat di sistem. Simpan nomor pelunasan untuk kebutuhan pencairan.'
  }
  return props.errorMessage || 'Pelunasan gadai perhiasan belum berhasil diproses. Silakan coba kembali beberapa saat lagi.'
})

const displayDescription = computed(() => props.description || defaultDescription.value)

// Copy TRX ID Feedback State
const copiedTrx = ref(false)
let copyTimeout: ReturnType<typeof setTimeout> | undefined

function formatCreditNumber(value: string | undefined): string {
  if (!value) return '-'
  return value.replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatTransactionId(value: string | undefined): string {
  if (!value) return '-'
  if (value.startsWith('TRX') || value.includes('-')) return value
  return formatCreditNumber(value)
}

function formatCurrency(value: number | undefined): string {
  if (value === undefined || value === null) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value).replace(/\u00a0/g, ' ')
}

async function handleCopyTrxId() {
  const trxId = props.transactionId || props.summary?.number || ''
  if (!trxId) return
  try {
    await navigator.clipboard.writeText(trxId)
    copiedTrx.value = true
    emit('copy', trxId)
    if (copyTimeout) clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => {
      copiedTrx.value = false
    }, 2000)
  } catch (err) {
    console.error('Clipboard copy failed:', err)
  }
}

/**
 * Open printable receipt in dedicated popup window and trigger print dialog.
 * Satisfies Figma designer specification "akan open new tab print".
 */
function handlePrint() {
  emit('print')
  if (!props.summary) {
    window.print()
    return
  }

  const printWindow = window.open('', '_blank', 'width=780,height=900,menubar=no,toolbar=no,location=no,status=no')
  if (!printWindow || !printWindow.document) {
    // Popup blocker fallback
    window.print()
    return
  }

  const summary = props.summary
  const trxId = formatTransactionId(props.transactionId || summary.number)
  const trxDate = new Date().toLocaleString('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short',
  })

  const receiptHtml = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Bukti Pembayaran - ${trxId}</title>
      <style>
        body { font-family: 'Nunito Sans', Nunito, sans-serif; color: #252528; padding: 40px; margin: 0 auto; max-width: 680px; }
        .header { text-align: center; border-bottom: 2px solid #004d43; padding-bottom: 16px; margin-bottom: 24px; }
        .logo { font-size: 24px; font-weight: 800; color: #004d43; }
        .sublogo { font-size: 13px; color: #58585b; margin-top: 4px; }
        .title { font-size: 18px; font-weight: 800; text-align: center; margin: 24px 0 16px; text-transform: uppercase; color: #004d43; }
        .section-title { font-size: 14px; font-weight: 800; margin: 16px 0 8px; border-bottom: 1px solid #eeeeef; padding-bottom: 4px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        .table td { padding: 6px 0; font-size: 13px; }
        .table td.label { color: #58585b; width: 45%; }
        .table td.val { text-align: right; font-weight: 600; color: #252528; }
        .divider { border-top: 1px dashed #bbbdc0; margin: 16px 0; }
        .total-row td { font-size: 15px; font-weight: 800; color: #004d43; padding-top: 8px; }
        .footer { margin-top: 40px; font-size: 11px; text-align: center; color: #939597; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">PT PEGADAIAN</div>
        <div class="sublogo">SPRINT POS - CP Salemba | Operator: Thoriq Shadad (P91234)</div>
      </div>
      <div class="title">Struk Bukti Pelunasan Gadai</div>

      <div class="section-title">Informasi Transaksi</div>
      <table class="table">
        <tr><td class="label">ID Transaksi</td><td class="val">${trxId}</td></tr>
        <tr><td class="label">Waktu Transaksi</td><td class="val">${trxDate}</td></tr>
        <tr><td class="label">Nomor Kredit</td><td class="val">${formatCreditNumber(summary.number)}</td></tr>
        <tr><td class="label">Nama Nasabah</td><td class="val">${summary.customer || 'Bianca Putri'}</td></tr>
        <tr><td class="label">Jenis Transaksi</td><td class="val">${summary.transactionType || 'Pelunasan'}</td></tr>
        <tr><td class="label">Metode Pembayaran</td><td class="val">${summary.paymentMethod?.label || 'BCA Virtual Account'}</td></tr>
      </table>

      <div class="section-title">Rincian Pembayaran</div>
      <table class="table">
        <tr><td class="label">Sisa Uang Pinjaman</td><td class="val">${formatCurrency(summary.loanAmount)}</td></tr>
        <tr><td class="label">Sewa Modal (${summary.rentDays} Hari)</td><td class="val">${formatCurrency(summary.rentAmount)}</td></tr>
        <tr><td class="label">Biaya Layanan</td><td class="val">${formatCurrency(summary.serviceFee)}</td></tr>
        <tr class="total-row"><td class="label">Total Pembayaran</td><td class="val">${formatCurrency(summary.total)}</td></tr>
      </table>

      <div class="divider"></div>
      <div class="footer">
        Bukti ini merupakan dokumen sah pencatatan pelunasan gadai di PT Pegadaian.<br>
        Simpan struk ini untuk keperluan pengambilan barang jaminan.
      </div>
      <script>
        window.onload = function() {
          window.print();
        };
      <\/script>
    </body>
    </html>
  `
  printWindow.document.open()
  printWindow.document.write(receiptHtml)
  printWindow.document.close()
  printWindow.focus()
}

defineExpose({
  handlePrint,
})
</script>

<template>
  <div
    class="pgd-result-view"
    :class="[
      `pgd-result-view--${status}`,
      { 'pgd-result-view--composite': embeddedSummary }
    ]"
    data-test="payment-result-view"
  >
    <!-- Card 1: EndState Status Card (569px width matching Figma 336:54858 / 336:55187) -->
    <section class="pgd-result-card" aria-labelledby="pgd-result-title">
      <!-- KV Vector Illustration Area (204px x 204px) -->
      <div class="pgd-result-card__kv">
        <IllustrationFlowSuccess
          v-if="isSuccess"
          :size="204"
        />
        <IllustrationFlowFailed
          v-else
          :size="204"
        />
      </div>

      <!-- Title & Description Block -->
      <div class="pgd-result-card__content">
        <h2
          id="pgd-result-title"
          class="pgd-result-card__title"
          data-test="result-title"
        >
          {{ displayTitle }}
        </h2>
        <p
          class="pgd-result-card__description"
          data-test="result-description"
        >
          {{ displayDescription }}
        </p>
      </div>

      <!-- Optional Embedded Action Sheet for Standalone or Mobile Viewports -->
      <div v-if="embeddedSummary" class="pgd-result-card__embedded-actions">
        <div class="pgd-result-card__btn-group">
          <PaymentButton
            label="Kembali ke Beranda"
            :variant="isSuccess ? 'secondary' : 'primary'"
            data-test="btn-home"
            @click="emit('home')"
          />
          <PaymentButton
            v-if="isSuccess"
            label="Cetak Bukti Pembayaran"
            variant="primary"
            data-test="btn-print"
            @click="handlePrint"
          />
        </div>
      </div>
    </section>

    <!-- Card 2: Optional Embedded Summary (rendered when embeddedSummary=true or on mobile) -->
    <section
      v-if="embeddedSummary && summary"
      class="pgd-summary-card pgd-result-summary"
      aria-label="Detail pembayaran"
      data-test="result-summary-card"
    >
      <header class="pgd-summary-card__header">
        <h2>Detail Kredit</h2>
      </header>

      <!-- Transaction Identity & Method Breakdown -->
      <dl class="pgd-credit-details">
        <div class="pgd-detail-row">
          <dt>ID Transaksi</dt>
          <dd class="d-flex align-items-center justify-content-end gap-2">
            <span data-test="trx-id-value">{{ formatTransactionId(transactionId || summary?.number) }}</span>
            <button
              type="button"
              class="pgd-copy-icon-btn"
              :aria-label="copiedTrx ? 'ID Transaksi tersalin' : 'Salin ID Transaksi'"
              data-test="copy-trx-id-btn"
              @click="handleCopyTrxId"
            >
              <svg
                v-if="!copiedTrx"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M13 5.5H6.5C5.67157 5.5 5 6.17157 5 7V13.5C5 14.3284 5.67157 15 6.5 15H13C13.8284 15 14.5 14.3284 14.5 13.5V7C14.5 6.17157 13.8284 5.5 13 5.5Z"
                  stroke="currentColor"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3.5 10.5H2.5C1.94772 10.5 1.5 10.0523 1.5 9.5V2.5C1.5 1.94772 1.94772 1.5 2.5 1.5H9.5C10.0523 1.5 10.5 1.94772 10.5 2.5V3.5"
                  stroke="currentColor"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <svg
                v-else
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                class="text-success"
              >
                <path
                  d="M3 8.5L6.5 12L13 4"
                  stroke="var(--g-kit-lime-50, #00ab4e)"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <span v-if="copiedTrx" class="pgd-copied-toast" role="status">Tersalin!</span>
          </dd>
        </div>
        <div class="pgd-detail-row">
          <dt>Jenis Transaksi</dt>
          <dd>{{ summary.transactionType || 'Pelunasan' }}</dd>
        </div>
        <div class="pgd-detail-row">
          <dt>Nomor Kredit</dt>
          <dd>{{ formatCreditNumber(summary.number) }}</dd>
        </div>
        <div class="pgd-detail-row">
          <dt>Metode Pembayaran</dt>
          <dd>{{ summary.paymentMethod?.label || '-' }}</dd>
        </div>
      </dl>

      <!-- 4px Primary Section Divider -->
      <div class="pgd-divider pgd-divider--section" role="separator"></div>

      <!-- Detail Pembayaran Financial Breakdown -->
      <div class="pgd-payment-breakdown">
        <h3>Detail Pembayaran</h3>
        <dl class="pgd-breakdown">
          <div class="pgd-breakdown-row">
            <dt>Sisa Uang Pinjaman</dt>
            <dd>{{ formatCurrency(summary.loanAmount) }}</dd>
          </div>
          <div class="pgd-breakdown-row">
            <dt>Sewa Modal</dt>
            <dd>{{ formatCurrency(summary.rentAmount) }}</dd>
          </div>
          <div class="pgd-breakdown-row">
            <dt>Biaya Layanan</dt>
            <dd>{{ formatCurrency(summary.serviceFee) }}</dd>
          </div>
          <!-- 1px Item Divider -->
          <div class="pgd-divider pgd-divider--item" role="separator"></div>
          <div class="pgd-breakdown-row pgd-breakdown-row--total">
            <dt>Total</dt>
            <dd class="pgd-total-amount">{{ formatCurrency(summary.total) }}</dd>
          </div>
        </dl>
      </div>

      <!-- Action Button Group -->
      <div class="pgd-summary-card__actions pgd-summary-card__actions--result">
        <PaymentButton
          label="Kembali ke Beranda"
          :variant="isSuccess ? 'secondary' : 'primary'"
          data-test="summary-btn-home"
          @click="emit('home')"
        />
        <PaymentButton
          v-if="isSuccess"
          label="Cetak Bukti Pembayaran"
          variant="primary"
          data-test="summary-btn-print"
          @click="handlePrint"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.pgd-result-view {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.pgd-result-view--composite {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 400px);
  gap: 16px;
  align-items: start;
}

/* Card 1: EndState Status Card (matching Figma node 336:54858 / 336:55187) */
.pgd-result-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 322px;
  padding: 24px 16px;
  border: 1px solid var(--g-kit-black-20);
  border-radius: 24px;
  background-color: var(--g-kit-white);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.pgd-result-card__kv {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.pgd-result-card__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  max-width: 537px;
  padding: 0 16px;
  text-align: center;
}

.pgd-result-card__title {
  margin: 0;
  font-family: var(--g-kit-font-family);
  font-size: 18px;
  font-weight: var(--g-kit-font-weight-title-bold);
  line-height: 26px;
  color: var(--g-kit-black-80);
}

.pgd-result-card__description {
  margin: 0;
  font-family: var(--g-kit-font-family);
  font-size: 14px;
  font-weight: var(--g-kit-font-weight-normal);
  line-height: 20px;
  color: var(--g-kit-black-60);
}

.pgd-result-card__embedded-actions {
  width: 100%;
  max-width: 400px;
  margin-top: 24px;
}

.pgd-result-card__btn-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Card 2: Summary Card Styles */
.pgd-result-summary {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 16px;
  border: 1px solid var(--g-kit-black-20, #eeeeef);
  border-radius: 24px;
  background-color: var(--g-kit-white, #ffffff);
}

.pgd-summary-card__header h2,
.pgd-payment-breakdown h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: var(--g-kit-black-80, #252528);
}

.pgd-credit-details,
.pgd-breakdown {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
}

.pgd-detail-row,
.pgd-breakdown-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  line-height: 20px;
}

.pgd-detail-row dt,
.pgd-breakdown-row dt {
  color: var(--g-kit-black-60, #58585b);
  font-weight: var(--g-kit-font-weight-normal, 600);
  margin: 0;
}

.pgd-detail-row dd,
.pgd-breakdown-row dd {
  color: var(--g-kit-black-80, #252528);
  font-weight: var(--g-kit-font-weight-normal, 600);
  margin: 0;
  text-align: right;
}

.pgd-breakdown-row--total dt,
.pgd-breakdown-row--total dd {
  font-size: 14px;
  font-weight: 700;
  color: var(--g-kit-black-80, #252528);
}

/* Copy Icon Button */
.pgd-copy-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--g-kit-emerald-50, #004d43);
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.15s ease;
}

.pgd-copy-icon-btn:hover {
  background-color: var(--g-kit-black-10, #f8f8f8);
}

.pgd-copied-toast {
  font-size: 11px;
  font-weight: 700;
  color: var(--g-kit-lime-50, #00ab4e);
}

/* Dividers */
.pgd-divider--section {
  width: 100%;
  height: 4px;
  background-color: var(--g-kit-black-20, #eeeeef);
  border: none;
  margin: 4px 0;
}

.pgd-divider--item {
  width: 100%;
  height: 1px;
  background-color: var(--g-kit-black-30, #e0e0e1);
  border: none;
  margin: 4px 0;
}

.pgd-summary-card__actions--result {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

@media (max-width: 1199px) {
  .pgd-result-view--composite {
    grid-template-columns: 1fr;
  }
}
</style>
