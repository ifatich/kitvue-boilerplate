<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: number
  maximum: number
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const formattedValue = computed({
  get: () => {
    if (!props.modelValue) return ''
    return new Intl.NumberFormat('id-ID').format(props.modelValue)
  },
  set: (val: string) => {
    const parsed = Number(val.replace(/\D/g, ''))
    emit('update:modelValue', Math.min(parsed, props.maximum))
  },
})

const maximumLabel = computed(() => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
}).format(props.maximum).replace(/\u00a0/g, ''))

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  const parsed = Number(target.value.replace(/\D/g, ''))
  emit('update:modelValue', Math.min(parsed, props.maximum))
  target.value = parsed ? new Intl.NumberFormat('id-ID').format(parsed) : ''
}
</script>

<template>
  <div class="pgd-installment-field" :class="{ 'pgd-installment-field--error': !!props.error }">
    <div class="pgd-credit-box">
      <div class="pgd-credit-box__content">
        <label for="pgd-installment-input" class="pgd-credit-box__label">Jumlah Cicilan</label>
        <div class="pgd-currency-input">
          <span class="pgd-currency-input__prefix">Rp</span>
          <input
            id="pgd-installment-input"
            class="pgd-credit-box__input pgd-currency-input__field"
            type="text"
            inputmode="numeric"
            placeholder="0"
            :value="formattedValue"
            autocomplete="off"
            @input="handleInput"
          />
        </div>
      </div>
    </div>
    <p class="pgd-installment-field__helper">Maksimal cicilan {{ maximumLabel }}</p>
    <span v-if="props.error" class="pgd-field-error" role="alert">{{ props.error }}</span>
  </div>
</template>
