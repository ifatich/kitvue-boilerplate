<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
  }>(),
  {
    title: 'Tokenized Gold Receipt',
    subtitle: 'Back Office - Bullion Wallet',
  },
)
</script>

<template>
  <div class="header">
    <div class="icon-wrapper">
      <img src="@/assets/images/bullion-bank-logo.svg" alt="Bullion Bank" />
    </div>

    <h3>{{ title }}</h3>

    <span>{{ subtitle }}</span>
  </div>
</template>

<style scoped>
.header {
  text-align: center;
  margin-bottom: 40px;
}

.icon-wrapper {
  width: 80px;
  height: 80px;
  margin: auto;
  margin-bottom: 16px;
  overflow: hidden;
  border-radius: 50%;
}

.icon-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

h3 {
  margin: 0 0 4px;
  color: var(--g-kit-black-80);
  font-size: var(--g-kit-font-size-lambda);
  line-height: var(--g-kit-line-height-lambda);
  font-weight: var(--g-kit-font-weight-bold);
}

span {
  color: rgba(48, 48, 48, 0.6);
  font-size: var(--g-kit-font-size-omicron);
  line-height: var(--g-kit-line-height-omicron);
  font-weight: var(--g-kit-font-weight-normal);
}
</style>
