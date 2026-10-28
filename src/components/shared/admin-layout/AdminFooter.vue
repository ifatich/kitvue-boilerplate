<script setup lang="ts">
/**
 * @file AdminFooter.vue
 * @description Komponen footer standar dashboard CMS Admin Arrum Zada.
 * Mengikuti spesifikasi desain bullion-bank-cms.
 */

withDefaults(
  defineProps<{
    text?: string
  }>(),
  {
    text: 'Copyright © 2026 PT. Pegadaian. All Rights Reserved.',
  },
)
</script>

<template>
  <footer class="admin-footer" role="contentinfo">
    <slot>{{ text }}</slot>
  </footer>
</template>

<style scoped>
.admin-footer {
  flex-shrink: 0;
  min-height: 48px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid var(--g-kit-black-20, #e2e8f0);
  background: var(--g-kit-white, #ffffff);
  color: var(--g-kit-black-60, #64748b);
  font-size: var(--g-kit-font-size-omicron, 0.75rem);
  font-weight: var(--g-kit-font-weight-normal, 400);
  line-height: var(--g-kit-line-height-omicron, 1rem);
  text-align: center;
  word-break: break-word;
}

@media (max-width: 900px) {
  .admin-footer {
    padding: 12px 16px;
    font-size: var(--g-kit-font-size-sigma, 0.75rem);
    line-height: var(--g-kit-line-height-sigma, 1rem);
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
}
</style>
