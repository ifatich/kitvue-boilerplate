<script setup lang="ts">
defineProps<{
  displayStart: number
  displayEnd: number
  totalRows: number
}>()
</script>

<template>
  <div class="admin-table-footer">
    <p>
      Menampilkan {{ displayStart }} sampai {{ displayEnd }} dari {{ totalRows }} baris
    </p>
    <div v-if="$slots.default" class="admin-table-footer__pagination">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.admin-table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.admin-table-footer p {
  margin: 0;
  color: var(--g-kit-black-80);
  font-size: var(--g-kit-font-size-sigma);
  font-weight: var(--g-kit-font-weight-normal);
  line-height: var(--g-kit-line-height-sigma);
}

.admin-table-footer__pagination {
  flex: 0 0 auto;
}

@media (max-width: 760px) {
  .admin-table-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .admin-table-footer__pagination {
    display: flex;
    justify-content: center;
    width: 100%;
    overflow-x: auto;
  }
}
</style>
