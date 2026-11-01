<script setup lang="ts">
import { GDropdown } from '@/components'
import {
  durationOptions,
  employmentOptions,
  productOptions,
  purposeOptions,
  rubricOptions,
  tariffOptions,
} from './rahnOptions'
import type { RahnOption } from '@/views/rahn/rahnFlow'

const props = defineProps<{
  purpose: string
  transactionPurpose: string
  employment: string
  rubric: string
  tariff: string
  product: string
  duration: string
  transactionOptions: RahnOption[]
  isMobile: boolean
  isSubmitted: boolean
}>()

const emit = defineEmits<{
  'update:purpose': [value: string]
  'update:transaction-purpose': [value: string]
  'update:employment': [value: string]
  'update:rubric': [value: string]
  'update:tariff': [value: string]
  'update:product': [value: string]
  'update:duration': [value: string]
}>()

const dropdownError = (label: string) => props.isSubmitted
  ? `Pilih ${label.toLowerCase()}`
  : ''
</script>

<template>
  <div class="rahn-application-dropdowns">
    <GDropdown
      :model-value="purpose"
      label="Tujuan Pengajuan"
      placeholder="Pilih tujuan pengajuan"
      :items="purposeOptions"
      item-value="value"
      item-text="label"
      :error="dropdownError('Tujuan Pengajuan')"
      :required="isSubmitted"
      :is-checked="isSubmitted"
      :use-bottom-sheet="isMobile"
      @update:model-value="emit('update:purpose', $event)"
    />
    <GDropdown
      :model-value="transactionPurpose"
      label="Tujuan Transaksi"
      placeholder="Pilih tujuan transaksi"
      :items="transactionOptions"
      item-value="value"
      item-text="label"
      :error="dropdownError('Tujuan Transaksi')"
      :required="isSubmitted"
      :is-checked="isSubmitted"
      :use-bottom-sheet="isMobile"
      @update:model-value="emit('update:transaction-purpose', $event)"
    />
    <GDropdown
      :model-value="employment"
      label="Pekerjaan Terkini"
      placeholder="Pilih pekerjaan terkini"
      :items="employmentOptions"
      item-value="value"
      item-text="label"
      :error="dropdownError('Pekerjaan Terkini')"
      :required="isSubmitted"
      :is-checked="isSubmitted"
      :use-bottom-sheet="isMobile"
      @update:model-value="emit('update:employment', $event)"
    />
    <GDropdown
      :model-value="rubric"
      label="Rubrik"
      placeholder="Pilih rubrik"
      :items="rubricOptions"
      item-value="value"
      item-text="label"
      :error="dropdownError('Rubrik')"
      :required="isSubmitted"
      :is-checked="isSubmitted"
      :use-bottom-sheet="isMobile"
      @update:model-value="emit('update:rubric', $event)"
    />
    <GDropdown
      :model-value="tariff"
      label="Skema Tarif"
      placeholder="Pilih skema tarif"
      :items="tariffOptions"
      item-value="value"
      item-text="label"
      :error="dropdownError('Skema Tarif')"
      :required="isSubmitted"
      :is-checked="isSubmitted"
      :use-bottom-sheet="isMobile"
      @update:model-value="emit('update:tariff', $event)"
    />
    <GDropdown
      :model-value="product"
      label="Produk"
      placeholder="Pilih produk"
      :items="productOptions"
      item-value="value"
      item-text="label"
      :error="dropdownError('Produk')"
      :required="isSubmitted"
      :is-checked="isSubmitted"
      :use-bottom-sheet="isMobile"
      @update:model-value="emit('update:product', $event)"
    />
    <GDropdown
      :model-value="duration"
      label="Jangka Waktu"
      placeholder="Pilih jangka waktu"
      :items="durationOptions"
      item-value="value"
      item-text="label"
      :error="dropdownError('Jangka Waktu')"
      :required="isSubmitted"
      :is-checked="isSubmitted"
      :use-bottom-sheet="isMobile"
      @update:model-value="emit('update:duration', $event)"
    />
  </div>
</template>

<style scoped lang="scss">
.rahn-application-dropdowns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 767px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }
}
</style>
