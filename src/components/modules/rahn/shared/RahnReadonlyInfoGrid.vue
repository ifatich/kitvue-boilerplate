<script setup lang="ts">
/**
 * @file RahnReadonlyInfoGrid.vue
 * @description Domain module component for displaying read-only summary/akad fields
 * in SPRINT Pinjaman Rahn modules. Follows official Pegadaian G-Kit design tokens.
 * Matches 1:1 with Figma frame 11347:148655.
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
    <h4 v-if="title" class="rahn-readonly-group__title">
      {{ title }}
    </h4>
    <div class="rahn-readonly-grid" role="list">
      <div
        v-for="item in items"
        :key="item.label"
        class="readonly-field"
        role="listitem"
      >
        <span class="readonly-field__label">{{ item.label }}</span>
        <div class="readonly-field__box">
          <span class="readonly-field__value">{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rahn-readonly-group {
  width: 100%;

  &__title {
    margin: 0 0 16px;
    color: var(--g-kit-black-80, #252528);
    font-family: 'Nunito Sans', sans-serif;
    font-size: var(--g-kit-font-size-omicron, 16px);
    font-weight: var(--g-kit-font-weight-bold, 800);
    line-height: var(--g-kit-line-height-omicron, 24px);
  }
}

.rahn-readonly-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 24px;
  row-gap: 16px;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.readonly-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;

  &__label {
    color: var(--g-kit-black-80, #252528);
    font-family: 'Nunito Sans', sans-serif;
    font-size: var(--g-kit-font-size-sigma, 14px);
    font-weight: var(--g-kit-font-weight-bold, 800);
    line-height: var(--g-kit-line-height-sigma, 20px);
  }

  &__box {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 12px;
    border-radius: 6px;
    background-color: var(--g-kit-black-20, #eeeeef);
    border: 1px solid var(--g-kit-black-20, #eeeeef);
    box-sizing: border-box;
  }

  &__value {
    color: var(--g-kit-black-60, #58585b);
    font-family: 'Nunito Sans', sans-serif;
    font-size: var(--g-kit-font-size-omicron, 16px);
    font-weight: var(--g-kit-font-weight-normal, 600);
    line-height: var(--g-kit-line-height-omicron, 24px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
