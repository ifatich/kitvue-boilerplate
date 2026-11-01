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
