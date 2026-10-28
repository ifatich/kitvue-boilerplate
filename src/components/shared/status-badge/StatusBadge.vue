<script setup lang="ts">
/**
 * @file StatusBadge.vue
 * @description Komponen badge status & hak akses CMS Arrum Zada.
 * Menggunakan token warna resmi Pegadaian (--g-kit-*).
 */
withDefaults(
  defineProps<{
    variant?:
      | 'success'
      | 'pending'
      | 'failed'
      | 'active'
      | 'inactive'
      | 'neutral'
      | 'info'
      | 'superadmin'
      | 'admin'
    label: string
  }>(),
  { variant: 'active' },
)
</script>

<template>
  <span class="status-badge" :class="`status-badge--${variant}`">
    {{ label }}
  </span>
</template>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: var(--g-kit-font-size-omega, 12px);
  font-weight: var(--g-kit-font-weight-bold, 700);
  line-height: var(--g-kit-line-height-omega, 16px);
  white-space: nowrap;
  min-width: fit-content;
}

/* Active / Success */
.status-badge--active,
.status-badge--success {
  background: var(--g-kit-lime-10, #ecfdf5);
  color: var(--g-kit-lime-50, #059669);
}

/* Pending */
.status-badge--pending {
  background: var(--g-kit-orange-10, #fffbeb);
  color: var(--g-kit-orange-50, #d97706);
}

/* Failed / Inactive */
.status-badge--failed,
.status-badge--inactive {
  background: var(--g-kit-red-10, #fef2f2);
  color: var(--g-kit-red-50, #dc2626);
}

/* Neutral */
.status-badge--neutral {
  background: var(--g-kit-blue-10, #e0f2fe);
  color: var(--g-kit-blue-50, #0284c7);
}

/* Info */
.status-badge--info {
  background: var(--g-kit-blue-10, #e0f2fe);
  color: var(--g-kit-blue-50, #0284c7);
}

/* Super Admin Badge (Dignified Blue) */
.status-badge--superadmin {
  background: var(--g-kit-blue-10, #e0f2fe);
  color: var(--g-kit-blue-50, #0284c7);
}

/* Administrator Badge (Clean Cool Slate) */
.status-badge--admin {
  background: var(--g-kit-black-10, #f1f5f9);
  color: var(--g-kit-black-80, #334155);
}
</style>
