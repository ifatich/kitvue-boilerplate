<script setup lang="ts">
/**
 * @file MobileStepperBanner.vue
 * @description Reusable mobile stepper indicator banner for SPRINT multi-step modules.
 * Renders an edge-to-edge header indicating current step count and current stage title.
 */
withDefaults(
  defineProps<{
    activeStep: number
    steps: string[]
    stepPrefix?: string
    stagePrefix?: string
  }>(),
  {
    stepPrefix: 'Langkah',
    stagePrefix: 'Tahap',
  },
)
</script>

<template>
  <div class="mobile-stepper-banner" role="region" aria-label="Indikator langkah">
    <span class="mobile-stepper-banner__label">
      {{ stepPrefix }} {{ activeStep }} dari {{ steps.length }}
    </span>
    <h2 class="mobile-stepper-banner__title">
      {{ stagePrefix }} {{ activeStep }} - {{ steps[activeStep - 1] }}
    </h2>
  </div>
</template>

<style scoped lang="scss">
.mobile-stepper-banner {
  display: none;
  background: var(--g-kit-black-10, #f8f8f8);
  padding: 8px 16px;
  margin: 0;
  width: 100%;
  border-bottom: 1px solid var(--g-kit-black-20, #eeeeef);

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__label {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
    color: var(--g-kit-black-60, #58585b);
  }

  &__title {
    margin: 0;
    font-family: 'Nunito Sans', sans-serif;
    font-size: 16px;
    font-weight: 800;
    line-height: 24px;
    color: var(--g-kit-black-80, #252528);
  }
}
</style>

