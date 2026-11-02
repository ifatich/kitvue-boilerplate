<script setup lang="ts">
import { computed, ref } from 'vue'
import ButtonComponent from 'kitvue-public/src/components/Button/Button.vue'
import SprintNavbar from '@/components/shared/admin-layout/SprintNavbar.vue'
import { getPrototypeRoleFromSession } from '@/services/authService'
import type { PrototypeRole } from '@/types/admin'
import DashboardMetrics from './components/DashboardMetrics.vue'
import FeatureGroupCard from './components/FeatureGroupCard.vue'
import TaskListCard from './components/TaskListCard.vue'
import { featureColumnsByRole } from './feature-data'

const featureGrid = ref<HTMLElement | null>(null)
const activeRole = computed<PrototypeRole>(() => getPrototypeRoleFromSession() ?? 'Penaksir')
const featureColumns = computed(() => featureColumnsByRole[activeRole.value])
const searchItems = computed(() => featureColumns.value.flatMap((column) => column.flatMap((group) => (
  group.items.map((item) => ({
    group: group.title,
    label: item.label,
    icon: item.icon,
    to: item.label === 'Pengajuan Gadai' ? '/proto-existing/pengajuan-gadai' : undefined,
  }))
))))

const profileRole = computed(() => {
  if (activeRole.value === 'Pinca') return 'Pimpinan Cabang / Pinca'
  return activeRole.value
})

const focusSearchResult = (item: { group: string; label: string }) => {
  const result = Array.from(
    featureGrid.value?.querySelectorAll<HTMLButtonElement>('[data-feature-label]') ?? [],
  ).find((button) => button.dataset.featureLabel === item.label)

  if (result) {
    result.focus({ preventScroll: true })
    result.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }

  const group = Array.from(
    featureGrid.value?.querySelectorAll<HTMLElement>('[data-feature-group]') ?? [],
  ).find((section) => section.dataset.featureGroup === item.group)
  const heading = group?.querySelector<HTMLHeadingElement>('h2')
  heading?.focus({ preventScroll: true })
  heading?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<template>
  <div class="proto-existing-page">
    <SprintNavbar
      embedded
      entry-layout
      :profile-role="profileRole"
      home-to="/sprint-existing"
      :show-auth-toggle="false"
      :show-mobile-bottom-nav="true"
      search-placeholder="Cari (contoh: Pengajuan Gadai/Rahn)"
      :search-items="searchItems"
      @search-select="focusSearchResult"
    />

    <main class="proto-existing-content">
      <div class="proto-existing-top-grid">
        <DashboardMetrics />
        <TaskListCard />
      </div>

      <div ref="featureGrid" class="proto-existing-feature-grid">
        <div
          v-for="(column, columnIndex) in featureColumns"
          :key="columnIndex"
          class="proto-existing-feature-column"
        >
          <template v-if="columnIndex === 2">
            <section class="panel favorite-panel" aria-labelledby="favorite-title">
              <div class="favorite-panel__heading">
                <h2 id="favorite-title">Menu Favorit</h2>
                <ButtonComponent label="Atur" type="outline" size="sm" />
              </div>
              <button type="button" class="favorite-menu-item">
                <span class="favorite-menu-item__icon" aria-hidden="true" />
                <span>Tambah<br />Menu</span>
              </button>
            </section>
          </template>

          <FeatureGroupCard
            v-for="group in column"
            :key="group.title"
            :group="group"
          />
        </div>
      </div>
    </main>

    <footer class="proto-existing-footer">
      Copyright © 2024 PT. Pegadaian. All Rights Reserved.
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.proto-existing-page {
  display: flex;
  flex-direction: column;
  background: var(--g-kit-black-10);
}

.proto-existing-content {
  width: min(calc(100% - 32px), 1312px);
  margin: 24px auto 32px;
}

.panel {
  padding: 12px 16px 24px;
  border-radius: 12px;
  background: var(--g-kit-white);
  box-shadow: var(--bb-elevation-1);
}

.proto-existing-top-grid {
  display: grid;
  grid-template-columns: minmax(0, 760fr) minmax(0, 368fr);
  gap: 24px;
}

.proto-existing-feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: start;
  gap: 24px;
  margin-top: 24px;
}

.proto-existing-feature-column {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 24px;
}

.favorite-panel {
  min-height: 130px;
}

.favorite-panel__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
    color: var(--g-kit-black-80);
    font-size: 20px;
    font-weight: var(--g-kit-font-weight-bold);
    line-height: 30px;
  }
}

.favorite-menu-item {
  display: flex;
  width: 72px;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 16px 0 0 16px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--g-kit-lime-50);
  cursor: pointer;
  font-size: 14px;
  font-weight: var(--g-kit-font-weight-bold);
  line-height: 20px;
  text-align: center;
}

.favorite-menu-item__icon {
  display: grid;
  width: 56px;
  height: 59px;
  place-items: center;
  position: relative;

  &::before {
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    display: grid;
    width: 20px;
    height: 20px;
    place-items: center;
    border-radius: 50%;
    background: var(--g-kit-lime-50);
    color: var(--g-kit-white);
    content: '+';
    font-size: 14px;
    font-weight: var(--g-kit-font-weight-bold);
    line-height: 20px;
  }

  &::after {
    position: absolute;
    inset: 3px 0 0;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--g-kit-black-10);
    content: '';
  }
}

.proto-existing-footer {
  display: flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  border-top: 1px solid var(--g-kit-black-20);
  background: var(--g-kit-white);
  color: var(--g-kit-black-60);
  font-size: 14px;
  line-height: 20px;
  text-align: center;
}

@media (max-width: 1023.98px) {
  .proto-existing-top-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .proto-existing-feature-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 575.98px) {
  .proto-existing-content {
    width: 100%;
    margin-top: 16px;
    margin-bottom: 32px;
  }

  .proto-existing-top-grid,
  .proto-existing-feature-grid {
    gap: 8px;
  }

  .proto-existing-feature-grid {
    grid-template-columns: minmax(0, 1fr);
    margin-top: 8px;
  }

  .proto-existing-feature-column {
    gap: 8px;
  }

  .panel {
    border-radius: 0;
  }

  .favorite-panel {
    min-height: 130px;
  }

  .proto-existing-footer {
    padding: 0 16px;
    font-size: 12px;
  }
}
</style>
