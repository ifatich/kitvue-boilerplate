<script setup lang="ts">
import Breadcrumb from '@/components/shared/breadcrumb/Breadcrumb.vue'
import NavBack from '@/components/shared/navBack/navBack.vue'

type BreadcrumbItem = string | { label: string; to?: string }

withDefaults(
  defineProps<{
    breadcrumb?: BreadcrumbItem[]
    navBackLabel?: string
    navBackTo?: string
    title?: string
  }>(),
  {
    breadcrumb: undefined,
    navBackLabel: undefined,
    navBackTo: undefined,
    title: undefined,
  },
)
</script>

<template>
  <div class="admin-page-layout">
    <nav v-if="breadcrumb" class="admin-breadcrumb-row" aria-label="Breadcrumb">
      <Breadcrumb class="pt-0" :items="breadcrumb" />
    </nav>

    <section class="admin-page-content" :aria-labelledby="title ? 'admin-page-title' : undefined">
      <div v-if="navBackLabel || $slots.actions" class="admin-page-topbar">
        <NavBack
          v-if="navBackLabel"
          :id="title ? 'admin-page-title' : undefined"
          :label="navBackLabel"
          :to="navBackTo"
        />
        <div v-if="$slots.actions" class="admin-page-actions">
          <slot name="actions" />
        </div>
      </div>

      <slot />
    </section>
  </div>
</template>

<style scoped>
.admin-page-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.admin-breadcrumb-row {
  border-bottom: 1px solid var(--g-kit-black-20);
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.admin-page-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.admin-page-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.admin-page-actions {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 16px;
}

@media (max-width: 760px) {
  .admin-page-topbar {
    align-items: stretch;
    flex-direction: column;
  }

  .admin-page-actions {
    width: 100%;
  }

  .admin-page-actions :deep(.btn) {
    width: 100%;
  }
}
</style>
