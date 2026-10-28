<template>
  <div class="base-card">
    <slot />
  </div>
</template>

<style scoped>
.base-card {
  background: var(--g-kit-white);
  border-radius: 12px;
  padding: 48px;
  box-shadow: var(--bb-elevation-card);
}
</style>
