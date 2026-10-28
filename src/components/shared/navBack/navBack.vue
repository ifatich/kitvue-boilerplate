<script setup lang="ts">
import { useRouter } from 'vue-router'

import arrowLeftGreen from 'kitvue/src/assets/images/arrow-left-green.svg'

defineOptions({
  name: 'NavBackNavigator',
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    label?: string
    to?: string
    action?: () => void
  }>(),
  {
    label: 'Beli Tabungan Emas',
    to: undefined,
    action: undefined,
  },
)

const router = useRouter()

const handleBack = () => {
  if (props.action) {
    props.action()
    return
  }

  if (props.to) {
    router.push(props.to)
    return
  }

  window.history.go(-1)
}
</script>

<template>
  <section class="section-bg-top">
    <div class="section-bg-top__back">
      <button class="back-button" type="button" aria-label="Back" @click="handleBack">
        <img width="24" height="24" :src="arrowLeftGreen as unknown as string" alt="" aria-hidden="true" />
      </button>
      <h4 v-bind="$attrs" class="text-black-80">{{ label }}</h4>
    </div>
  </section>
</template>

<style scoped>
.section-bg-top {
  width: 100%;
  min-width: 0;
  background: transparent;
  padding: 16px 0;
  box-sizing: border-box;
}

.section-bg-top__back {
  min-height: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  min-width: 0;
}

.back-button {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

h4 {
  margin: 0;
  font-size: var(--g-kit-font-size-kappa);
  font-weight: var(--g-kit-font-weight-bold);
  line-height: var(--g-kit-line-height-kappa);
  word-break: break-word;
}

@media (max-width: 760px) {
  .section-bg-top {
    padding: 8px 0;
  }
}
</style>
