<script setup lang="ts">
defineProps<{
  title: string
  lastUpdated: string
}>()

defineEmits<{
  refresh: []
}>()
</script>

<template>
  <header class="admin-table-header">
    <div class="admin-table-header__info">
      <h2>{{ title }}</h2>
      <p>
        <span>{{ lastUpdated }}</span>
        <button
          type="button"
          class="admin-table-header__refresh"
          aria-label="Refresh data"
          @click="$emit('refresh')"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M20 11a8 8 0 0 0-14.6-4.5M4 4v5h5M4 13a8 8 0 0 0 14.6 4.5M20 20v-5h-5"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </p>
    </div>
    <div v-if="$slots.actions" class="admin-table-header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.admin-table-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.admin-table-header__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1 1 auto;
}

.admin-table-header__info h2 {
  margin: 0;
  color: var(--g-kit-black-80);
  font-size: var(--g-kit-font-size-kappa);
  font-weight: var(--g-kit-font-weight-bold);
  line-height: var(--g-kit-line-height-kappa);
  word-break: break-word;
}

.admin-table-header__info p {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin: 0;
  color: var(--g-kit-black-50);
  font-size: var(--g-kit-font-size-sigma);
  font-weight: var(--g-kit-font-weight-normal);
  line-height: var(--g-kit-line-height-sigma);
  word-break: break-word;
}

.admin-table-header__refresh {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--g-kit-black-50);
  cursor: pointer;
  transition: color 0.15s ease;
}

.admin-table-header__refresh:hover {
  color: var(--g-kit-black-80);
}

.admin-table-header__actions {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 760px) {
  .admin-table-header {
    flex-direction: column;
    gap: 12px;
  }

  .admin-table-header__actions {
    width: 100%;
  }

  .admin-table-header__actions :deep(.btn),
  .admin-table-header__actions :deep(button) {
    width: 100% !important;
  }
}
</style>
