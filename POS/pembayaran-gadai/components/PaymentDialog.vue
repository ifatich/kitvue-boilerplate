<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'

const props = withDefaults(defineProps<{
  open: boolean
  title: string
  description?: string
  variant?: 'transaction' | 'payment' | 'confirmation'
  closeLabel?: string
}>(), {
  description: '',
  variant: 'transaction',
  closeLabel: 'Tutup',
})

const emit = defineEmits<{
  close: []
}>()

let previousOverflow = ''

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) emit('close')
}

watch(
  () => props.open,
  (open) => {
    if (typeof document === 'undefined') return

    if (open) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeydown)
    } else {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeydown)
    }
  },
)

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = previousOverflow
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="props.open"
      class="pgd-dialog-backdrop"
      :class="`pgd-dialog-backdrop--${props.variant}`"
      @click.self="emit('close')"
    >
      <section
        class="pgd-dialog"
        :class="`pgd-dialog--${props.variant}`"
        role="dialog"
        aria-modal="true"
        :aria-label="props.title"
      >
        <header class="pgd-dialog__header">
          <div class="pgd-dialog__heading">
            <h2 class="pgd-dialog__title">{{ props.title }}</h2>
            <p v-if="props.description" class="pgd-dialog__description">{{ props.description }}</p>
          </div>
          <button
            class="pgd-dialog__close"
            type="button"
            :aria-label="props.closeLabel"
            @click="emit('close')"
          >
            <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 5l10 10M15 5L5 15" stroke-linecap="round" />
            </svg>
          </button>
        </header>
        <div v-if="props.variant !== 'confirmation'" class="pgd-item-divider" aria-hidden="true"></div>
        <div class="pgd-dialog__body">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="pgd-dialog__footer">
          <slot name="footer" />
        </footer>
      </section>
    </div>
  </Teleport>
</template>
