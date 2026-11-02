<script setup lang="ts">
import type { FeatureGroup } from '../feature-data'

const compactRowGroups = new Set(['Deposito Emas', 'Program UMK (PUMK)'])

defineProps<{
  group: FeatureGroup
}>()
</script>

<template>
  <section
    class="panel feature-panel"
    :class="{ 'feature-panel--compact-rows': compactRowGroups.has(group.title) }"
    :data-feature-group="group.title"
    :aria-label="group.title"
  >
    <h2
      tabindex="-1"
      :class="{ 'feature-panel__title--compact': group.title === 'Manajemen Surat Bukti Gadai/Rahn' }"
    >
      {{ group.title }}
    </h2>
    <div class="feature-menu">
      <button
        v-for="item in group.items"
        :key="item.label"
        type="button"
        class="feature-menu__item"
        :data-feature-label="item.label"
      >
        <span class="feature-menu__icon">
          <img :src="item.icon" alt="" aria-hidden="true" />
        </span>
        <span class="feature-menu__label">{{ item.label }}</span>
      </button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.feature-panel {
  min-width: 0;
  padding-bottom: 24px;

  h2 {
    margin: 0;
    color: var(--g-kit-black-80);
    font-size: 20px;
    font-weight: var(--g-kit-font-weight-bold);
    line-height: 30px;
    white-space: nowrap;
  }

  .feature-panel__title--compact {
    font-size: 18px;
  }
}

.feature-menu {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px 12px;
  margin-top: 16px;
}

.feature-panel--compact-rows .feature-menu {
  row-gap: 12px;
  grid-template-rows: 144px 124px 104px;
}

.feature-menu__item {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--g-kit-black-80);
  cursor: pointer;
  font: inherit;
  text-align: center;
}

.feature-menu__icon {
  display: grid;
  width: 56px;
  height: 56px;
  flex: 0 0 56px;
  place-items: center;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}

.feature-menu__label {
  max-width: 100%;
  font-size: 14px;
  font-weight: var(--g-kit-font-weight-normal);
  line-height: 20px;
  overflow-wrap: anywhere;
}
</style>
