<script setup lang="ts">
/**
 * @file ModuleSectionCard.vue
 * @description Reusable collapsible section card for SPRINT Single UI modules.
 *
 * Characteristics:
 * - Desktop: Contained card with 1px border, 8px border-radius, and 24px padding.
 * - Mobile: Edge-to-edge white card (no border/radius), 16px padding, separated by 8px margin/gap.
 * - Animation: 60fps flicker-free CSS Grid accordion (grid-template-rows: 0fr <-> 1fr).
 * - A11y: WAI-ARIA compliant accordion button (aria-expanded, aria-controls).
 */
import { computed, ref } from 'vue'
import chevronUpAsset from 'kitvue-public/src/assets/icon/icon-system/icon-chevron-up.svg'

const props = withDefaults(
  defineProps<{
    title: string
    modelValue?: boolean
    defaultOpen?: boolean
    collapsible?: boolean
    id?: string
  }>(),
  {
    modelValue: undefined,
    defaultOpen: true,
    collapsible: true,
    id: undefined,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'toggle', value: boolean): void
}>()

const chevronIcon = chevronUpAsset as unknown as string

// Generate a deterministic or prop-based unique ID for ARIA
const cardId = props.id || `section-${props.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
const contentId = `${cardId}-content`

// Internal state used when modelValue is uncontrolled
const internalOpen = ref(props.defaultOpen)

const isOpen = computed(() => {
  return props.modelValue !== undefined ? props.modelValue : internalOpen.value
})

const toggle = () => {
  if (!props.collapsible) return
  const next = !isOpen.value
  if (props.modelValue === undefined) {
    internalOpen.value = next
  }
  emit('update:modelValue', next)
  emit('toggle', next)
}
</script>

<template>
  <section :id="cardId" class="module-section-card">
    <button
      v-if="collapsible"
      type="button"
      class="module-section-card__heading"
      :aria-expanded="isOpen"
      :aria-controls="contentId"
      @click="toggle"
    >
      <h2 class="module-section-card__title">{{ title }}</h2>
      <div class="module-section-card__header-actions">
        <slot name="header-extra" />
        <img
          :class="['module-section-card__chevron', { 'is-collapsed': !isOpen }]"
          :src="chevronIcon"
          alt=""
          aria-hidden="true"
        />
      </div>
    </button>
    <div v-else class="module-section-card__heading module-section-card__heading--static">
      <h2 class="module-section-card__title">{{ title }}</h2>
      <slot name="header-extra" />
    </div>

    <div
      :id="contentId"
      :class="['section-collapse', { 'is-expanded': isOpen }]"
      :aria-hidden="collapsible && !isOpen"
    >
      <div class="section-collapse__inner">
        <div class="section-collapse__content">
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.module-section-card {
  box-sizing: border-box;
  min-width: 0;
  background: var(--g-kit-white, #ffffff);
  border: 1px solid var(--g-kit-black-20, #eeeeef);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;

  @media (max-width: 767px) {
    width: 100%;
    border: none;
    border-radius: 0;
    padding: 16px;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0;
    margin: 0;
    border: 0;
    color: var(--g-kit-black-80, #252528);
    background: transparent;
    cursor: pointer;
    text-align: left;

    &:focus-visible {
      outline: 2px solid var(--g-kit-lime-50, #00ab4e);
      outline-offset: 4px;
      border-radius: 4px;
    }

    &--static {
      cursor: default;
    }
  }

  &__title {
    margin: 0;
    font-family: 'Nunito Sans', sans-serif;
    font-size: var(--g-kit-font-size-kappa, 18px);
    font-weight: var(--g-kit-font-weight-bold, 700);
    line-height: var(--g-kit-line-height-kappa, 24px);
    color: var(--g-kit-black-80, #252528);
  }

  &__header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__chevron {
    flex: 0 0 24px;
    width: 24px;
    height: 24px;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &.is-collapsed {
      transform: rotate(180deg);
    }
  }
}

.section-collapse {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.is-expanded {
    grid-template-rows: 1fr;
  }

  &__inner {
    overflow: hidden;
    min-height: 0;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease, visibility 0.25s step-end;
  }

  &.is-expanded &__inner {
    opacity: 1;
    visibility: visible;
    transition: opacity 0.25s ease 0.05s, visibility 0s;
  }

  &__content {
    padding-top: 16px;
  }
}
</style>

