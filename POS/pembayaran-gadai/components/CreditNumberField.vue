<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  error?: string
  loading?: boolean
  disabled?: boolean
}>(), {
  modelValue: '',
  error: '',
  loading: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [val: string]
  search: []
}>()

const formattedValue = computed({
  get: () => {
    const raw = (props.modelValue || '').replace(/\D/g, '').slice(0, 16)
    return raw.replace(/(\d{4})(?=\d)/g, '$1 ')
  },
  set: (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16)
    emit('update:modelValue', digits)
  },
})

const canSearch = computed(() => {
  const digits = (props.modelValue || '').replace(/\D/g, '')
  return digits.length === 16 && !props.loading && !props.disabled
})

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const rawDigits = target.value.replace(/\D/g, '').slice(0, 16)
  emit('update:modelValue', rawDigits)
  target.value = rawDigits.replace(/(\d{4})(?=\d)/g, '$1 ')
}
</script>

<template>
  <div class="pgd-credit-number" :class="{ 'pgd-credit-number--error': !!props.error }">
    <div class="pgd-credit-box" :class="{ 'pgd-credit-box--disabled': props.disabled }">
      <div class="pgd-credit-box__content">
        <label for="pgd-credit-input" class="pgd-credit-box__label">Nomor Kredit</label>
        <input
          id="pgd-credit-input"
          class="pgd-credit-box__input"
          type="text"
          inputmode="numeric"
          placeholder="Masukkan nomor kredit"
          :value="formattedValue"
          :disabled="props.disabled"
          autocomplete="off"
          @input="handleInput"
          @keyup.enter="canSearch && emit('search')"
        />
      </div>
      <button
        class="pgd-credit-number__search"
        type="button"
        :disabled="!canSearch"
        @click="canSearch && emit('search')"
      >
        {{ props.loading ? 'Mencari...' : 'Cari' }}
      </button>
    </div>
    <span v-if="props.error" class="pgd-field-error" role="alert">
      {{ props.error }}
    </span>
  </div>
</template>
