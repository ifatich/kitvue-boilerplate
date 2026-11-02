<script setup lang="ts">
import ButtonComponent from 'kitvue-public/src/components/Button/Button.vue'

const tasks = [
  { label: 'Pinjaman Rahn', value: '2' },
  { label: 'Pinjaman Non Gadai', value: '99+' },
  { label: 'Restrukturisasi Pinjaman', value: '99+' },
]
</script>

<template>
  <section class="panel task-panel" aria-labelledby="task-title">
    <div class="task-panel__heading">
      <h2 id="task-title">Tugasku <span>99+</span></h2>
      <ButtonComponent label="Lihat Semua" type="outline" size="sm" />
    </div>
    <button
      v-for="task in tasks"
      :key="task.label"
      type="button"
      class="task-row"
    >
      <span>{{ task.label }}</span>
      <b>{{ task.value }}</b>
    </button>
  </section>
</template>

<style lang="scss" scoped>
.task-panel {
  height: 226px;
  padding-bottom: 12px;
}

.task-panel__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  h2 {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0;
    color: var(--g-kit-black-80);
    font-size: 20px;
    font-weight: var(--g-kit-font-weight-bold);
    line-height: 30px;
  }

  h2 span {
    display: inline-flex;
    min-width: 24px;
    height: 18px;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    border-radius: 9px;
    color: var(--g-kit-white);
    background: var(--g-kit-red-50);
    font-size: 12px;
    line-height: 18px;
  }
}

.task-row {
  display: flex;
  width: 100%;
  height: 52px;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  border: 0;
  border-top: 1px solid var(--g-kit-black-10);
  background: transparent;
  color: var(--g-kit-black-80);
  cursor: pointer;
  font: inherit;
  text-align: left;

  span {
    font-size: 14px;
    line-height: 20px;
  }

  b {
    color: var(--g-kit-lime-50);
    font-size: 14px;
    font-weight: var(--g-kit-font-weight-bold);
    line-height: 20px;
  }
}

@media (max-width: 767.98px) {
  .task-panel {
    height: auto;
    min-height: 226px;
  }
}
</style>
