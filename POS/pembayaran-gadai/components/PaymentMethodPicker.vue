<script setup lang="ts">
import { ref } from 'vue'
import { paymentMethods } from '../data'
import { paymentAsset } from '../asset-url'
import type { PaymentMethod } from '../payment-types'
import PaymentDialog from './PaymentDialog.vue'

const props = defineProps<{
  modelValue: PaymentMethod | null
  error?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: PaymentMethod]
  connect: [method: PaymentMethod]
}>()

const open = ref(false)
const recommendedExpanded = ref(true)
const instantExpanded = ref(false)
const virtualAccountsExpanded = ref(true)
const directDebitExpanded = ref(true)
const otherMethodsExpanded = ref(true)
const paymentMethodIcon = paymentAsset('payment-method.svg')

const recommendedMethods = paymentMethods.filter((m) => m.category === 'Direct Debit')
const virtualAccountMethods = paymentMethods.filter((m) => m.category === 'Virtual Account')
const directDebitMethods = paymentMethods.filter((m) => m.category === 'Direct Debit')
const otherMethods = paymentMethods.filter((m) => m.category === 'Metode Pembayaran Lain')

function select(method: PaymentMethod) {
  emit('update:modelValue', method)
  open.value = false
}
</script>

<template>
  <div
    class="pgd-picker"
    :class="{
      'pgd-picker--disabled': props.disabled,
      'pgd-picker--error': !!props.error,
    }"
  >
    <button
      class="pgd-picker__trigger pgd-picker__trigger--payment"
      type="button"
      :disabled="props.disabled"
      :aria-expanded="open"
      @click="!props.disabled && (open = true)"
    >
      <span v-if="props.modelValue" class="pgd-picker__selected">
        <span class="pgd-picker__logo-circle">
          <img :src="props.modelValue.logo" :alt="props.modelValue.label" />
        </span>
        <span class="pgd-picker__selected-text">{{ props.modelValue.label }}</span>
      </span>
      <span v-else class="pgd-picker__selected">
        <img class="pgd-payment-icon" :src="paymentMethodIcon" alt="" />
        <span class="pgd-picker__placeholder">Pilih metode pembayaran</span>
      </span>
      <span class="pgd-chevron-right pgd-chevron-right--green" aria-hidden="true"></span>
    </button>
    <span v-if="props.error" class="pgd-field-error" role="alert">{{ props.error }}</span>

    <PaymentDialog
      :open="open"
      title="Pembayaran"
      variant="payment"
      @close="open = false"
    >
      <div class="pgd-method-dialog">
        <div class="pgd-method-panel">
          <h3 class="pgd-method-panel__title">Metode Pembayaran</h3>

          <!-- Rekomendasi -->
          <section class="pgd-method-group">
            <button
              class="pgd-method-group__heading"
              type="button"
              :aria-expanded="recommendedExpanded"
              @click="recommendedExpanded = !recommendedExpanded"
            >
              <span>Rekomendasi Pembayaran</span>
              <span class="pgd-accordion-chevron" :class="{ 'pgd-accordion-chevron--expanded': recommendedExpanded }" aria-hidden="true"></span>
            </button>
            <div v-show="recommendedExpanded" class="pgd-method-group__items">
              <div
                v-for="method in recommendedMethods"
                :key="`rec-${method.id}`"
                class="pgd-method-option pgd-method-option--connect"
              >
                <span
                  class="pgd-method-option__logo-circle"
                  :class="{ 'pgd-method-option__logo-circle--blue': method.id === 'bri-debit' }"
                >
                  <img :src="method.logo" alt="" />
                </span>
                <span class="pgd-method-option__copy">
                  <span class="pgd-method-option__label">{{ method.label }}</span>
                  <small v-if="method.description">{{ method.description }}</small>
                </span>
                <button class="pgd-method-option__connect" type="button" @click="emit('connect', method)">
                  Hubungkan
                </button>
              </div>
            </div>
          </section>

          <div class="pgd-item-divider" aria-hidden="true"></div>

          <!-- Pembayaran Instan -->
          <section class="pgd-method-group">
            <button
              class="pgd-method-group__heading"
              type="button"
              :aria-expanded="instantExpanded"
              @click="instantExpanded = !instantExpanded"
            >
              <span>Pembayaran Instan</span>
              <span class="pgd-accordion-chevron" :class="{ 'pgd-accordion-chevron--expanded': instantExpanded }" aria-hidden="true"></span>
            </button>
            <p v-show="instantExpanded" class="pgd-method-group__empty">
              Belum ada metode pembayaran instan yang tersedia.
            </p>
          </section>

          <div class="pgd-item-divider" aria-hidden="true"></div>

          <!-- Virtual Account -->
          <section class="pgd-method-group">
            <button
              class="pgd-method-group__heading"
              type="button"
              :aria-expanded="virtualAccountsExpanded"
              @click="virtualAccountsExpanded = !virtualAccountsExpanded"
            >
              <span>Virtual Account</span>
              <span class="pgd-accordion-chevron" :class="{ 'pgd-accordion-chevron--expanded': virtualAccountsExpanded }" aria-hidden="true"></span>
            </button>
            <div v-show="virtualAccountsExpanded" class="pgd-method-group__items">
              <button
                v-for="method in virtualAccountMethods"
                :key="method.id"
                class="pgd-method-option"
                :class="{ 'pgd-method-option--selected': props.modelValue?.id === method.id }"
                type="button"
                @click="select(method)"
              >
                <span
                  class="pgd-method-option__logo-circle"
                  :class="{ 'pgd-method-option__logo-circle--blue': method.id === 'bca-va' }"
                >
                  <img :src="method.productIcon || method.logo" alt="" />
                </span>
                <span class="pgd-method-option__copy">
                  <span class="pgd-method-option__label">{{ method.label }}</span>
                  <small>Transaksi minimal Rp10.000</small>
                </span>
                <span class="pgd-radio" :class="{ 'pgd-radio--selected': props.modelValue?.id === method.id }" aria-hidden="true">
                  <span class="pgd-radio__dot"></span>
                </span>
              </button>
            </div>
          </section>

          <div class="pgd-item-divider" aria-hidden="true"></div>

          <!-- Direct Debit -->
          <section class="pgd-method-group">
            <button
              class="pgd-method-group__heading"
              type="button"
              :aria-expanded="directDebitExpanded"
              @click="directDebitExpanded = !directDebitExpanded"
            >
              <span>Direct Debit</span>
              <span class="pgd-accordion-chevron" :class="{ 'pgd-accordion-chevron--expanded': directDebitExpanded }" aria-hidden="true"></span>
            </button>
            <div v-show="directDebitExpanded" class="pgd-method-group__items">
              <div
                v-for="method in directDebitMethods"
                :key="`direct-${method.id}`"
                class="pgd-method-option pgd-method-option--connect"
              >
                <span class="pgd-method-option__logo-circle">
                  <img :src="method.productIcon || method.logo" alt="" />
                </span>
                <span class="pgd-method-option__copy">
                  <span class="pgd-method-option__label">Direct Debit</span>
                  <small v-if="method.description">{{ method.description }}</small>
                </span>
                <button class="pgd-method-option__connect" type="button" @click="emit('connect', method)">
                  Hubungkan
                </button>
              </div>
            </div>
          </section>

          <div class="pgd-item-divider" aria-hidden="true"></div>

          <!-- Metode Lain -->
          <section class="pgd-method-group">
            <button
              class="pgd-method-group__heading"
              type="button"
              :aria-expanded="otherMethodsExpanded"
              @click="otherMethodsExpanded = !otherMethodsExpanded"
            >
              <span>Metode Pembayaran Lain</span>
              <span class="pgd-accordion-chevron" :class="{ 'pgd-accordion-chevron--expanded': otherMethodsExpanded }" aria-hidden="true"></span>
            </button>
            <div v-show="otherMethodsExpanded" class="pgd-method-group__items">
              <button
                v-for="method in otherMethods"
                :key="method.id"
                class="pgd-method-option"
                :class="{ 'pgd-method-option--selected': props.modelValue?.id === method.id }"
                type="button"
                @click="select(method)"
              >
                <span class="pgd-method-option__logo-circle">
                  <img :src="method.logo" alt="" />
                </span>
                <span class="pgd-method-option__copy">
                  <span class="pgd-method-option__label">{{ method.label }}</span>
                  <small>Bayar di Indomaret, Alfamart, dan Kantor pos.</small>
                </span>
                <span class="pgd-radio" :class="{ 'pgd-radio--selected': props.modelValue?.id === method.id }" aria-hidden="true">
                  <span class="pgd-radio__dot"></span>
                </span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </PaymentDialog>
  </div>
</template>
