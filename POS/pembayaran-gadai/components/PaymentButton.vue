<script setup lang="ts">
import ButtonComponent from 'kitvue-public/src/components/Button/Button.vue'

withDefaults(defineProps<{
  label: string
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  loading?: boolean
  size?: 'md' | 'lg'
}>(), {
  variant: 'primary',
  disabled: false,
  loading: false,
  size: 'lg',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <ButtonComponent
    :label="label"
    :type="variant === 'primary' ? 'primary' : 'outline-primary'"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    class="pgd-button"
    :class="`pgd-button--${variant}`"
    @click="emit('click', $event)"
  />
</template>

<style scoped lang="scss">
:deep(.btn) {
  &.pgd-button--secondary {
    background-color: #ffffff !important;
    background: #ffffff !important;
    border: 1.5px solid var(--g-kit-emerald-50, #004d43) !important;
    color: var(--g-kit-emerald-50, #004d43) !important;
    transition: all 0.2s ease;

    span {
      color: var(--g-kit-emerald-50, #004d43) !important;
      transition: color 0.2s ease;
    }

    &:hover,
    &:focus,
    &:active {
      background-color: #ffffff !important;
      background: #ffffff !important;
      border-color: var(--g-kit-emerald-80, #001e1a) !important;
      color: var(--g-kit-emerald-80, #001e1a) !important;
      box-shadow: 0 2px 6px rgba(0, 30, 26, 0.12);

      span {
        color: var(--g-kit-emerald-80, #001e1a) !important;
      }
    }
  }

  &.pgd-button--primary {
    transition: all 0.2s ease;

    &:hover,
    &:focus,
    &:active {
      background-color: var(--g-kit-emerald-80, #001e1a) !important;
      background: var(--g-kit-emerald-80, #001e1a) !important;
      color: #ffffff !important;
    }
  }
}
</style>
