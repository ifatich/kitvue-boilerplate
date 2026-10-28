<script setup lang="ts">
import { GInputText } from '@/components'

withDefaults(
  defineProps<{
    rowLimit?: number
    searchQuery?: string
    searchPlaceholder?: string
    searchLabel?: string
  }>(),
  {
    rowLimit: 10,
    searchQuery: '',
    searchPlaceholder: 'Cari data',
    searchLabel: undefined,
  },
)

const emit = defineEmits<{
  'update:rowLimit': [value: number]
  'update:searchQuery': [value: string]
}>()

function onRowLimitChange(event: Event) {
  emit('update:rowLimit', Number((event.target as HTMLSelectElement).value))
}

function onSearchUpdate(val: string | number) {
  emit('update:searchQuery', String(val ?? ''))
}
</script>

<template>
  <div class="admin-row-control">
    <label class="admin-row-control__limit">
      <span>Lihat</span>
      <select
        :value="rowLimit"
        aria-label="Jumlah baris"
        @change="onRowLimitChange"
      >
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="25">25</option>
        <option :value="50">50</option>
      </select>
      <span>baris</span>
    </label>

    <div class="admin-row-control__actions">
      <div class="admin-row-control__search">
        <GInputText
          :model-value="searchQuery"
          type="search"
          :placeholder="searchPlaceholder"
          :aria-label="searchLabel || searchPlaceholder"
          class="table-search-field"
          @update:model-value="onSearchUpdate"
        />
      </div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.admin-row-control {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.admin-row-control__actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.admin-row-control__limit {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--g-kit-black-80);
  font-size: var(--g-kit-font-size-sigma);
  font-weight: var(--g-kit-font-weight-normal);
  line-height: var(--g-kit-line-height-sigma);
  white-space: nowrap;
}

.admin-row-control__limit select {
  height: 24px;
  padding: 0 24px 0 8px;
  border: 1px solid var(--g-kit-black-20);
  border-radius: 4px;
  background: var(--g-kit-white);
  color: var(--g-kit-black-80);
  font: inherit;
  cursor: pointer;
}

.admin-row-control__search {
  width: 260px;
}

.table-search-field,
.table-search-field :deep(.group-input) {
  margin-bottom: 0 !important;
  width: 100%;
}

:deep(.table-search-field .custom-input-group-icon) {
  height: 48px !important;
  background-color: var(--g-kit-white, #ffffff) !important;
  border: 1px solid var(--g-kit-black-20, #e2e4e7) !important;
  border-radius: 8px !important;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  overflow: hidden;
  display: flex;
  align-items: center;
}

:deep(.table-search-field .custom-input-group-icon:hover) {
  border-color: var(--g-kit-lime-50, #00a651) !important;
}

:deep(.table-search-field .custom-input-group-icon:focus-within),
:deep(.table-search-field.search-active .custom-input-group-icon) {
  border-color: var(--g-kit-lime-50, #00a651) !important;
  box-shadow: none !important;
  outline: none !important;
}

:deep(.table-search-field .form-control) {
  height: 46px !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
  font-size: var(--g-kit-font-size-omicron, 14px);
  line-height: var(--g-kit-line-height-omicron, 20px);
  color: var(--g-kit-black-80, #252528);
  padding-left: 8px;
}

:deep(.table-search-field .form-control::placeholder) {
  color: #939597;
  font-size: var(--g-kit-font-size-omicron, 14px);
}

:deep(.table-search-field .form-control:focus) {
  outline: none !important;
  box-shadow: none !important;
}

.admin-search-input {
  height: 48px;
  width: 100%;
  padding: 0 16px 0 38px;
  border: 1px solid var(--g-kit-black-20, #e2e4e7);
  border-radius: 8px;
  background: var(--g-kit-white, #ffffff);
  color: var(--g-kit-black-80, #252528);
  font-size: var(--g-kit-font-size-omicron, 14px);
  font-weight: var(--g-kit-font-weight-normal, 400);
  line-height: var(--g-kit-line-height-omicron, 20px);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  box-sizing: border-box;
}

.admin-search-input::placeholder {
  color: #939597;
}

.admin-search-input:hover {
  border-color: var(--g-kit-lime-50, #00a651);
}

.admin-search-input:focus {
  border-color: var(--g-kit-lime-50, #00a651);
  box-shadow: none !important;
  outline: none !important;
}

@media (max-width: 760px) {
  .admin-row-control {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .admin-row-control__actions {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    gap: 12px;
  }

  .admin-row-control__search {
    width: 100%;
  }
}
</style>
