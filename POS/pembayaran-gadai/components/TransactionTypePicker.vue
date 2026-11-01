<script setup lang="ts">
import { ref } from 'vue'
import { transactionTypes } from '../data'
import type { TransactionType } from '../payment-types'
import PaymentDialog from './PaymentDialog.vue'

const transactionLabels: Record<TransactionType, string> = {
  'Sewa Modal': 'Bayar Sewa Modal',
  Cicil: 'Cicil',
  Pelunasan: 'Pelunasan',
}

const props = defineProps<{
  modelValue: TransactionType | null
  error?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: TransactionType]
}>()

const open = ref(false)

function select(value: TransactionType) {
  emit('update:modelValue', value)
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
      class="pgd-picker__trigger pgd-picker__trigger--transaction"
      type="button"
      :disabled="props.disabled"
      :aria-expanded="open"
      @click="!props.disabled && (open = true)"
    >
      <span class="pgd-picker__label">Jenis Transaksi</span>
      <span class="pgd-picker__value" :class="{ 'pgd-picker__placeholder': !props.modelValue }">
        {{ props.modelValue ? transactionLabels[props.modelValue] : 'Pilih jenis transaksi' }}
      </span>
      <span class="pgd-chevron pgd-chevron--green" aria-hidden="true"></span>
    </button>
    <span v-if="props.error" class="pgd-field-error" role="alert">{{ props.error }}</span>

    <PaymentDialog
      :open="open"
      title="Jenis Transaksi"
      variant="transaction"
      @close="open = false"
    >
      <div class="pgd-transaction-options">
        <template v-for="(item, idx) in transactionTypes" :key="item.value">
          <div v-if="idx > 0" class="pgd-item-divider" aria-hidden="true"></div>
          <button
            class="pgd-transaction-option"
            type="button"
            :aria-pressed="props.modelValue === item.value"
            @click="select(item.value)"
          >
            <span class="pgd-transaction-option__label">{{ transactionLabels[item.value] }}</span>
            <span class="pgd-radio" :class="{ 'pgd-radio--selected': props.modelValue === item.value }" aria-hidden="true">
              <span class="pgd-radio__dot"></span>
            </span>
          </button>
        </template>
      </div>
    </PaymentDialog>
  </div>
</template>
