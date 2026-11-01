<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { paymentAsset } from '../asset-url'
import type { PaymentSummary } from '../payment-types'

const props = defineProps<{
  summary: PaymentSummary
  expiredAt?: number
}>()

const emit = defineEmits<{
  (e: 'copy', code: string): void
  (e: 'copy-error'): void
  (e: 'expired'): void
}>()

const expandedItem = ref<string>('transfer-internet-banking')
const copied = ref(false)
const remainingSeconds = ref(1 * 3600 + 25 * 60 + 32)
let countdownInterval: number | undefined

watch(
  () => props.expiredAt,
  (newVal) => {
    if (newVal) {
      remainingSeconds.value = Math.max(0, Math.floor((newVal - Date.now()) / 1000))
    }
  },
)

const countdownLabel = computed(() => {
  const hours = Math.floor(remainingSeconds.value / 3600)
  const minutes = Math.floor((remainingSeconds.value % 3600) / 60)
  const seconds = remainingSeconds.value % 60
  return [hours, minutes, seconds].map((p) => String(p).padStart(2, '0')).join(':')
})

const bankName = computed(() => props.summary.paymentMethod?.bank || 'Bank')
const paymentCopyIcon = paymentAsset('payment-copy.svg')
const paymentCode = computed(() => {
  switch (props.summary.paymentMethod?.id) {
    case 'bca-va':
      return '0130 8361 8000 6879'
    case 'mandiri-va':
      return '70012 0000 1234 3939'
    case 'merchant':
      return '1234 3939 4848 6060'
    default:
      return '0130 8361 8000 6879'
  }
})
const isDirectDebit = computed(() => props.summary.paymentMethod?.id === 'bri-debit')
const bankLogo = computed(() =>
  props.summary.paymentMethod?.id === 'bca-va'
    ? paymentAsset('bca-logo.png')
    : props.summary.paymentMethod?.logo || '',
)

const instructions = [
  {
    id: 'transfer-atm',
    title: 'Transfer via ATM',
    steps: [
      'Masukkan kartu ATM dan PIN Anda.',
      'Pilih menu transfer, lalu pilih Virtual Account.',
      'Masukkan nomor virtual account dan konfirmasi pembayaran.',
    ],
  },
  {
    id: 'transfer-internet-banking',
    title: 'Transfer via Internet Banking',
    steps: [
      'Masuk ke menu transfer BCA Virtual Account.',
      'Masukkan nomor virtual account di atas.',
      'Periksa nominal, lalu konfirmasi pembayaran.',
    ],
  },
  {
    id: 'transfer-mobile-banking',
    title: 'Transfer via Mobile Banking',
    steps: [
      'Masuk ke menu transfer BCA Virtual Account.',
      'Masukkan nomor virtual account di atas.',
      'Periksa nominal, lalu konfirmasi pembayaran.',
    ],
  },
]

function toggleAccordion(id: string) {
  expandedItem.value = expandedItem.value === id ? '' : id
}

onMounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
  countdownInterval = window.setInterval(() => {
    if (props.expiredAt) {
      remainingSeconds.value = Math.max(0, Math.floor((props.expiredAt - Date.now()) / 1000))
    } else {
      remainingSeconds.value = Math.max(remainingSeconds.value - 1, 0)
    }

    if (remainingSeconds.value === 0) {
      if (countdownInterval) clearInterval(countdownInterval)
      emit('expired')
    }
  }, 1000)
})

onBeforeUnmount(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})

async function copyAccountNumber() {
  try {
    await navigator.clipboard.writeText(paymentCode.value)
    copied.value = true
    emit('copy', paymentCode.value)
    window.setTimeout(() => {
      copied.value = false
    }, 1800)
  } catch (error) {
    console.error('Gagal menyalin nomor virtual account.', error)
    emit('copy-error')
  }
}
</script>

<template>
  <section class="pgd-instruction-card" aria-label="Instruksi pembayaran">
    <div class="pgd-instruction-card__main">
      <h2 class="pgd-instruction-card__title">Pembayaran</h2>

      <!-- Crimson Countdown Banner -->
      <div class="pgd-payment-countdown">
        <span class="pgd-payment-countdown__text">Selesaikan pembayaran dalam</span>
        <div class="pgd-payment-countdown__timer">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="currentColor">
            <path d="M8 3.5a4.5 4.5 0 1 0 4.5 4.5A4.5 4.5 0 0 0 8 3.5ZM8 2a6 6 0 1 1-6 6 6 6 0 0 1 6-6ZM5 0h6v1.5H5V0Zm2.25 4.5h1.5v3.25l2.25 1.5-.75 1.25-3-2V4.5Z" />
          </svg>
          <strong>{{ countdownLabel }}</strong>
        </div>
      </div>

      <!-- Generated VA Code Box -->
      <div class="pgd-generated-code">
        <div class="pgd-generated-code__bank">
          <span class="pgd-generated-code__logo">
            <img :src="bankLogo" alt="" />
          </span>
          <strong class="pgd-generated-code__bank-title">{{ isDirectDebit ? summary.paymentMethod?.label : `${bankName} Virtual Account` }}</strong>
        </div>

        <p v-if="isDirectDebit" class="pgd-generated-code__direct-debit">
          Selesaikan otorisasi pembayaran melalui rekening BRI yang terhubung.
        </p>
        <div v-else class="pgd-generated-code__number-box">
          <strong class="pgd-generated-code__number">{{ paymentCode }}</strong>
          <button
            type="button"
            class="pgd-copy-button"
            :class="{ 'pgd-copy-button--copied': copied }"
            :aria-label="copied ? 'Nomor pembayaran tersalin' : 'Salin nomor pembayaran'"
            @click="copyAccountNumber"
          >
            <svg v-if="copied" viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" class="pgd-copy-button__check">
              <path d="M4 10l4 4 8-8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <img v-else :src="paymentCopyIcon" alt="" />
          </button>
        </div>
      </div>
    </div>

    <!-- 4px Section Divider -->
    <div class="pgd-section-divider" aria-hidden="true"></div>

    <!-- Tutorial Pembayaran -->
    <section class="pgd-instruction-card__tutorial">
      <h2 class="pgd-instruction-card__title">Tutorial Pembayaran</h2>
      <div class="pgd-instructions">
        <h3 class="pgd-instructions__title">Petunjuk Pembayaran</h3>
        <div class="pgd-instructions__accordion">
          <template v-for="(instruction, idx) in instructions" :key="instruction.id">
            <div v-if="idx > 0" class="pgd-item-divider" aria-hidden="true"></div>
            <div class="pgd-accordion-item" :class="{ 'pgd-accordion-item--expanded': expandedItem === instruction.id }">
              <button
                class="pgd-accordion-item__header"
                type="button"
                :aria-expanded="expandedItem === instruction.id"
                @click="toggleAccordion(instruction.id)"
              >
                <span>{{ instruction.title }}</span>
                <span class="pgd-accordion-chevron" :class="{ 'pgd-accordion-chevron--expanded': expandedItem === instruction.id }" aria-hidden="true"></span>
              </button>
              <div v-show="expandedItem === instruction.id" class="pgd-accordion-item__body">
                <ul class="pgd-accordion-item__list">
                  <li v-for="step in instruction.steps" :key="step">
                    {{ step.replace(/BCA/g, bankName) }}
                  </li>
                </ul>
              </div>
            </div>
          </template>
        </div>
      </div>
    </section>

    <span class="pgd-sr-only" role="status" aria-live="polite">
      {{ copied ? 'Nomor pembayaran berhasil disalin.' : '' }}
    </span>
  </section>
</template>
