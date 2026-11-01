<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import PosHeader from '../components/PosHeader.vue'
import PosSidebar, { type PosNavLabel } from '../components/PosSidebar.vue'
import { usePosSidebar } from '../composables/usePosSidebar'
import CreditDetailsCard from './components/CreditDetailsCard.vue'
import CreditNumberField from './components/CreditNumberField.vue'
import InstallmentAmountField from './components/InstallmentAmountField.vue'
import PaymentInstructionCard from './components/PaymentInstructionCard.vue'
import PaymentMethodPicker from './components/PaymentMethodPicker.vue'
import PaymentResultView from './components/PaymentResultView.vue'
import PaymentReviewDialog from './components/PaymentReviewDialog.vue'
import TransactionTypePicker from './components/TransactionTypePicker.vue'
import { getPaymentTotal, mockCreditRecord } from './data'
import type {
  CreditRecord,
  FlowStage,
  PaymentCheckState,
  PaymentMethod,
  PaymentSummary,
  ResultStatus,
  TransactionType,
} from './payment-types'
import { printReceiptInNewTab } from './receipt-utils'
import './style.css'

const router = useRouter()
const { isCollapsed, isMobile, isOpen, menuExpanded, toggle, close } = usePosSidebar()

// Transaction & Form State
const creditNumber = ref('')
const creditError = ref('')
const hasCredit = ref(false)
const transactionType = ref<TransactionType | null>(null)
const transactionTypeError = ref('')
const paymentMethod = ref<PaymentMethod | null>(null)
const paymentMethodError = ref('')
const installmentAmount = ref(500_000)
const installmentAmountError = ref('')
const reviewOpen = ref(false)

// Lifecycle Stages: 'form' | 'instructions' | 'result'
const stage = ref<FlowStage>('form')
const resultStatus = ref<ResultStatus>('success')
const transactionId = ref('TRX-20241101-99812')
const expiredAt = ref<number | undefined>(undefined)

// Status Polling Simulation State
const paymentCheckState = ref<PaymentCheckState>('idle')
const pollCount = ref(0)
const SETTLEMENT_CLICK_THRESHOLD = 2
let pollTimeout: ReturnType<typeof setTimeout> | undefined

// Live Accessibility Announcements
const announcement = ref('')
let announcementTimeout: ReturnType<typeof setTimeout> | undefined

function announce(message: string) {
  announcement.value = message
  if (announcementTimeout) clearTimeout(announcementTimeout)
  announcementTimeout = setTimeout(() => {
    announcement.value = ''
  }, 2800)
}

const summary = computed<PaymentSummary>(() => {
  const digits = creditNumber.value.replace(/\D/g, '')
  const credit: CreditRecord = {
    ...mockCreditRecord,
    number: digits || mockCreditRecord.number,
  }
  return {
    ...credit,
    installmentAmount: installmentAmount.value,
    transactionType: transactionType.value,
    paymentMethod: paymentMethod.value,
    total: getPaymentTotal(transactionType.value, credit, installmentAmount.value),
  }
})

const canContinue = computed(() =>
  hasCredit.value
  && transactionType.value !== null
  && paymentMethod.value !== null
  && (transactionType.value !== 'Cicil' || installmentAmount.value > 0),
)

// Reset state when modifying credit number
watch(creditNumber, () => {
  creditError.value = ''
  if (hasCredit.value) {
    hasCredit.value = false
    transactionType.value = null
    paymentMethod.value = null
    transactionTypeError.value = ''
    paymentMethodError.value = ''
    installmentAmountError.value = ''
  }
})

// Progressive error clearance
watch(transactionType, (val) => {
  if (val) transactionTypeError.value = ''
})

watch(paymentMethod, (val) => {
  if (val) paymentMethodError.value = ''
})

watch(installmentAmount, (val) => {
  if (val > 0) installmentAmountError.value = ''
})

function selectNavigation(item: PosNavLabel) {
  close()
  if (item === 'Dashboard') {
    void router?.push('/')
    return
  }
  if (item === 'Pembayaran') {
    void router?.push('/pembayaran')
    return
  }
  announce(`${item} belum tersedia pada pratinjau POS ini.`)
}

function resetFlowToHome() {
  void router?.push('/pembayaran')
}

// 16-Digit Credit Contract Search
function searchCredit() {
  const digits = creditNumber.value.replace(/\D/g, '')
  if (digits.length !== 16) {
    creditError.value = 'Nomor kredit harus terdiri dari 16 digit.'
    return
  }

  creditNumber.value = digits
  hasCredit.value = true
  creditError.value = ''
  transactionType.value = null
  paymentMethod.value = null
  transactionTypeError.value = ''
  paymentMethodError.value = ''
  installmentAmountError.value = ''
}

// Synchronous Form Validation Engine
function validateForm(): boolean {
  let isValid = true
  const digits = creditNumber.value.replace(/\D/g, '')

  if (!digits || digits.length !== 16 || !hasCredit.value) {
    creditError.value = 'Nomor kredit harus diisi'
    isValid = false
  } else {
    creditError.value = ''
  }

  if (!transactionType.value) {
    transactionTypeError.value = 'Jenis transaksi harus diisi'
    isValid = false
  } else {
    transactionTypeError.value = ''
  }

  if (!paymentMethod.value) {
    paymentMethodError.value = 'Metode pembayaran harus diisi'
    isValid = false
  } else {
    paymentMethodError.value = ''
  }

  if (transactionType.value === 'Cicil' && installmentAmount.value <= 0) {
    installmentAmountError.value = 'Nominal cicilan harus lebih dari 0'
    isValid = false
  } else {
    installmentAmountError.value = ''
  }

  return isValid
}

// Submit action from CreditDetailsCard
function continueToReview() {
  const isValid = validateForm()
  if (!isValid || !canContinue.value) {
    announce('Lengkapi nomor kredit, jenis transaksi, dan metode pembayaran terlebih dahulu.')
    return
  }
  reviewOpen.value = true
}

// Confirm in review dialog -> transition to instructions stage
function continueToPayment() {
  reviewOpen.value = false
  // 1 hour, 25 minutes, 32 seconds from now = 5132s
  expiredAt.value = Date.now() + (1 * 3600 + 25 * 60 + 32) * 1000
  pollCount.value = 0
  paymentCheckState.value = 'idle'
  stage.value = 'instructions'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Polling and Refresh Status in Instructions Stage
function refreshPaymentStatus() {
  paymentCheckState.value = 'checking'
  const requestedResult = new URLSearchParams(window.location.search).get('paymentResult')

  if (pollTimeout) clearTimeout(pollTimeout)
  pollTimeout = setTimeout(() => {
    // 1. Query parameter override (for automated tests and manual QA)
    if (requestedResult === 'success' || requestedResult === 'failed') {
      finishPayment(requestedResult)
      return
    }

    // 2. Click count threshold simulation (cashier clicks twice to settle)
    pollCount.value++
    if (pollCount.value >= SETTLEMENT_CLICK_THRESHOLD) {
      finishPayment('success')
      announce('Pembayaran berhasil dikonfirmasi oleh sistem.')
      return
    }

    // 3. Intermediate pending state
    paymentCheckState.value = 'pending'
    announce('Pembayaran masih menunggu konfirmasi. Periksa kembali beberapa saat lagi.')
  }, 450)
}

function finishPayment(status: ResultStatus) {
  resultStatus.value = status
  paymentCheckState.value = 'idle'
  stage.value = 'result'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handlePrintReceipt() {
  printReceiptInNewTab({
    transactionId: transactionId.value,
    summary: summary.value,
  })
}

async function copyCreditNumber(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    announce('Nomor kredit berhasil disalin.')
  } catch (error) {
    console.error('Gagal menyalin nomor kredit.', error)
    announce('Nomor kredit tidak dapat disalin dari browser ini.')
  }
}

async function copyTransactionId(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    announce('ID Transaksi berhasil disalin.')
  } catch (error) {
    console.error('Gagal menyalin ID transaksi.', error)
    announce('ID Transaksi tidak dapat disalin dari browser ini.')
  }
}

onBeforeUnmount(() => {
  if (pollTimeout) clearTimeout(pollTimeout)
  if (announcementTimeout) clearTimeout(announcementTimeout)
})
</script>

<template>
  <main
    class="pos-canvas pgd-canvas"
    :class="{
      'pos-canvas--sidebar-collapsed': isCollapsed,
      'pos-canvas--sidebar-open': isOpen,
    }"
  >
    <PosHeader
      :menu-expanded="menuExpanded"
      @menu="toggle"
      @activity="announce('Aktivitas belum tersedia pada pratinjau POS ini.')"
    />
    <PosSidebar
      active-item="Pembayaran"
      :collapsed="isCollapsed"
      :open="isOpen"
      :is-mobile="isMobile"
      @select="selectNavigation"
      @close="close"
    />

    <section class="pos-main-panel pgd-main-panel pembayaran-gadai" aria-label="Pembayaran gadai">
      <div class="pgd-page">
        <nav class="pgd-breadcrumb" aria-label="Breadcrumb">
          <button type="button" @click="resetFlowToHome">Pembayaran</button>
          <svg class="pgd-breadcrumb__chevron" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M6 12l4-4-4-4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="pgd-breadcrumb__current">Bayar Gadai</span>
        </nav>
        <div class="pgd-breadcrumb__divider" aria-hidden="true"></div>
        <header class="pgd-page__heading">
          <button class="pgd-page__back" type="button" aria-label="Kembali ke beranda" @click="resetFlowToHome">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M19 12H5m0 0l6-6m-6 6l6 6" />
            </svg>
          </button>
          <h1>Bayar Gadai</h1>
        </header>

        <!-- Form and Instruction Stages (Pre-terminal) -->
        <div v-if="stage !== 'result'" class="pgd-flow-grid">
          <!-- Left Column: Form Stage -->
          <section v-if="stage === 'form'" class="pgd-card pgd-form-card">
            <header class="pgd-card__header">
              <h2>Kredit Gadai</h2>
            </header>

            <CreditNumberField
              v-model="creditNumber"
              :error="creditError"
              :disabled="hasCredit"
              @search="searchCredit"
            />
            <div class="pgd-form-card__fields">
              <TransactionTypePicker
                v-model="transactionType"
                :error="transactionTypeError"
                :disabled="!hasCredit"
              />
              <InstallmentAmountField
                v-if="transactionType === 'Cicil'"
                v-model="installmentAmount"
                :maximum="mockCreditRecord.loanAmount"
                :error="installmentAmountError"
              />
            </div>

            <div class="pgd-form-card__divider"></div>
            <section class="pgd-form-card__payment">
              <h3>Pembayaran</h3>
              <PaymentMethodPicker
                v-model="paymentMethod"
                :error="paymentMethodError"
                :disabled="!hasCredit || !transactionType"
                @connect="announce('BRI Direct Debit perlu dihubungkan melalui layanan perbankan sebelum dapat digunakan.')"
              />
            </section>
          </section>

          <!-- Left Column: Instructions Stage -->
          <PaymentInstructionCard
            v-else
            :summary="summary"
            :expired-at="expiredAt"
            @copy="announce('Nomor VA berhasil disalin.')"
            @copy-error="announce('Nomor pembayaran tidak dapat disalin dari browser ini.')"
            @expired="finishPayment('failed')"
          />

          <!-- Right Column: Detail Pembayaran Card -->
          <CreditDetailsCard
            :summary="summary"
            :has-credit="hasCredit"
            :mode="stage === 'form' ? 'form' : 'instructions'"
            :allow-unvalidated-submit="true"
            :refresh-label="paymentCheckState === 'checking' ? 'Memeriksa...' : paymentCheckState === 'pending' ? 'Periksa Lagi' : 'Perbarui Halaman'"
            :refresh-disabled="paymentCheckState === 'checking'"
            @copy="copyCreditNumber"
            @continue="continueToReview"
            @refresh="refreshPaymentStatus"
            @home="resetFlowToHome"
          />
        </div>

        <!-- Terminal Stage (Result: Success / Failed) -->
        <div v-else class="pgd-flow-grid pgd-result-grid" data-test="terminal-grid">
          <PaymentResultView
            :status="resultStatus"
            :summary="summary"
            :transaction-id="transactionId"
            :error-message="resultStatus === 'failed' ? 'Waktu pembayaran telah kedaluwarsa atau terjadi kendala pada bank terkait. Silakan coba kembali beberapa saat lagi.' : ''"
            @home="resetFlowToHome"
            @print="handlePrintReceipt"
            @copy="copyTransactionId"
          />
          <CreditDetailsCard
            :summary="summary"
            :has-credit="hasCredit"
            :mode="resultStatus"
            :transaction-id="transactionId"
            @home="resetFlowToHome"
            @print="handlePrintReceipt"
            @copy="copyTransactionId"
          />
        </div>
      </div>
    </section>

    <!-- Confirmation Modal / Drawer -->
    <PaymentReviewDialog
      :open="reviewOpen"
      :summary="summary"
      @close="reviewOpen = false"
      @confirm="continueToPayment"
    />

    <!-- Accessibility Announcement Toast -->
    <div v-if="announcement" class="pos-announcement" role="status" aria-live="polite">
      {{ announcement }}
    </div>
  </main>
</template>

<style scoped lang="scss">
.pembayaran-gadai {
  background: unset;
}
</style>