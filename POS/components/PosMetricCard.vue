<script setup lang="ts">
defineProps<{
  label: string
  value: string
  detail: string[]
  currency?: boolean
}>()
</script>

<template>
  <article class="pos-metric-card">
    <h2 class="pos-metric-card__label">{{ label }}</h2>
    <p class="pos-metric-card__value">
      <span v-if="currency">Rp</span>
      <span>{{ value }}</span>
    </p>
    <div class="pos-metric-card__detail">
      <span v-for="part in detail" :key="part">{{ part }}</span>
    </div>
  </article>
</template>
