<script setup lang="ts">
/**
 * @file RahnReadonlyInfoGrid.vue
 * @description Domain module component for displaying read-only summary/akad fields
 * in SPRINT Pinjaman Rahn modules. Follows official Pegadaian G-Kit design tokens.
 */
export interface ReadonlyInfoItem {
  label: string
  value: string
}

withDefaults(
  defineProps<{
    title?: string
    items: ReadonlyInfoItem[]
  }>(),
  {
    title: undefined,
  },
)
</script>

<template>
  <div class="rahn-readonly-group">
    <h3 v-if="title" class="rahn-readonly-group__title">
      {{ title }}
    </h3>
    <div class="rahn-readonly-grid" role="list">
      <div
        v-for="item in items"
        :key="item.label"
        class="readonly-field"
        role="listitem"
      >
        <span class="readonly-field__label">{{ item.label }}</span>
        <b class="readonly-field__value">{{ item.value }}</b>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rahn-readonly-group {
  width: 100%;

  &__title {
    margin: 0 0 12px;
    color: var(--g-kit-black-80, #252528);
    font-family: 'Nunito Sans', sans-serif;
    font-size: var(--g-kit-font-size-omicron, 14px);
    font-weight: var(--g-kit-font-weight-bold, 700);
    line-height: var(--g-kit-line-height-omicron, 20px);
  }
}

.rahn-readonly-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 24px;
  margin-top: 12px;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.readonly-field {
  display: grid;
  gap: 6px;
  font-size: var(--g-kit-font-size-sigma, 12px);

  &__label {
    color: var(--g-kit-black-80, #252528);
    font-weight: var(--g-kit-font-weight-bold, 700);
  }

  &__value {
    display: block;
    padding: 10px;
    border-radius: 6px;
    color: var(--g-kit-black-60, #58585b);
    background: var(--g-kit-black-20, #eeeeef);
    font-size: var(--g-kit-font-size-omicron, 14px);
    font-weight: var(--g-kit-font-weight-normal, 400);
    line-height: 1.4;
  }
}
</style>

