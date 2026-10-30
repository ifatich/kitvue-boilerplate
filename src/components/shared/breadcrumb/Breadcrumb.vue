<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { GBreadcrumb } from '@/components'

type BreadcrumbItem =
  | string
  | {
      label: string
      to?: string
    }

const props = withDefaults(
  defineProps<{
    items: BreadcrumbItem[]
  }>(),
  {
    items: () => [],
  },
)

const router = useRouter()

const labels = computed(() =>
  props.items.map((item) => (typeof item === 'string' ? item : item.label)),
)

const handleClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement | null
  const anchor = target?.closest('a')

  if (!anchor) return

  const anchors = Array.from(anchor.closest('ol')?.querySelectorAll('a') ?? [])
  const index = anchors.indexOf(anchor)
  const item = props.items[index]
  const to = typeof item === 'string' ? undefined : item?.to

  event.preventDefault()

  if (to) {
    router.push(to)
  }
}
</script>

<template>
  <!-- Delegation wrapper only: the real controls are the links GBreadcrumb
       renders, which are natively focusable and keyboard-operable. -->
  <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
  <div class="app-breadcrumb" @click.capture="handleClick">
    <GBreadcrumb :items="labels" />
  </div>
</template>

<style scoped>
.app-breadcrumb {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  min-width: 0;
  box-sizing: border-box;
  border-bottom: 1px solid var(--g-kit-black-20);
}

.app-breadcrumb :deep(.breadcrumb) {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
}

.app-breadcrumb :deep(.breadcrumb-item) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--g-kit-black-80);
  font-size: var(--g-kit-font-size-sigma);
  font-weight: var(--g-kit-font-weight-normal);
  line-height: var(--g-kit-line-height-sigma);
}

.app-breadcrumb :deep(.breadcrumb-item a) {
  color: var(--g-kit-lime-50);
  text-decoration: none;
}

.app-breadcrumb :deep(.breadcrumb-item a:hover) {
  text-decoration: underline;
}

.app-breadcrumb :deep(.breadcrumb-item.active) {
  color: var(--g-kit-black-80);
}

.app-breadcrumb :deep(.breadcrumb-item + .breadcrumb-item::before) {
  color: var(--g-kit-black-40);
  font-size: var(--g-kit-font-size-kappa);
  line-height: var(--g-kit-line-height-kappa);
}
</style>
