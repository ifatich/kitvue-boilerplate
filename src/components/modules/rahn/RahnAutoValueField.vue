<script setup lang="ts">
defineProps<{
  label: string
  value: string
}>()
</script>

<template>
  <div class="rahn-auto-value-field">
    <label>{{ label }}</label>
    <div class="rahn-auto-value-field__value" aria-live="polite">
      {{ value }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.rahn-auto-value-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;

  > label {
    color: var(--g-kit-black-80, #252528);
    font-size: var(--g-kit-font-size-omicron, 16px);
    font-weight: var(--g-kit-font-weight-bold, 800);
    line-height: var(--g-kit-line-height-omicron, 24px);
  }

  &__value {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    min-height: 48px;
    padding: 11px;
    border: 1px solid var(--g-kit-black-20, #eeeeef);
    border-radius: 6px;
    background-color: var(--g-kit-black-20, #eeeeef);
    color: var(--g-kit-black-60, #58585b);
    font-size: var(--g-kit-font-size-omicron, 16px);
    line-height: var(--g-kit-line-height-omicron, 24px);
  }
}
</style>
