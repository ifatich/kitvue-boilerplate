<script setup lang="ts">
/**
 * BaseModal.vue
 *
 * Komponen modal dialog standar Bullion Bank CMS & Pegadaian.
 * Menggunakan native <dialog> dengan Teleport ke body, backdrop click-to-dismiss,
 * penanganan tombol keyboard Escape, dan transisi responsif (modal desktop & bottom-sheet mobile).
 */
import { computed, onBeforeUnmount, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    width?: string
    transitionName?: string
    titleId?: string
  }>(),
  {
    width: '560px',
    transitionName: 'base-modal',
    titleId: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

function close() {
  isOpen.value = false
}

/**
 * Escape closes the modal.
 */
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

watch(
  isOpen,
  (open) => {
    if (open) document.addEventListener('keydown', onKeydown)
    else document.removeEventListener('keydown', onKeydown)
  },
  { immediate: true },
)

onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))

defineExpose({ close })
</script>

<template>
  <Teleport to="body">
    <Transition :name="transitionName">
      <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
      <div v-if="isOpen" class="base-modal-overlay" @click.self="close">
        <dialog
          open
          class="base-modal-container"
          :style="{ maxWidth: width }"
          :aria-labelledby="titleId"
          aria-modal="true"
        >
          <div v-if="$slots.header" class="base-modal-header">
            <slot name="header" />
          </div>

          <div v-if="$slots.header" class="base-modal-divider" />

          <div class="base-modal-body">
            <slot />
          </div>

          <div v-if="$slots.footer" class="base-modal-divider" />

          <div v-if="$slots.footer" class="base-modal-footer">
            <slot name="footer" />
          </div>
        </dialog>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.base-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 11000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.5);
}

.base-modal-container {
  position: static;
  margin: 0;
  border: none;
  padding: 0;
  color: inherit;

  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background: var(--g-kit-white, #ffffff);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);
}

.base-modal-header {
  position: sticky;
  top: 0;
  z-index: 1;
  flex: 0 0 auto;
  background: var(--g-kit-white, #ffffff);
  border-radius: 8px 8px 0 0;
  padding: 16px 16px 0;
}

.base-modal-body {
  flex: 1 1 auto;
  overflow-y: auto;
}

.base-modal-footer {
  position: sticky;
  bottom: 0;
  z-index: 1;
  flex: 0 0 auto;
  background: var(--g-kit-white, #ffffff);
  border-radius: 0 0 8px 8px;
  padding: 16px;
}

.base-modal-divider {
  width: 100%;
  height: 1px;
  flex: 0 0 auto;
  background: var(--g-kit-black-20, #e2e8f0);
}

/* Desktop transition: fade + scale */
.base-modal-enter-active,
.base-modal-leave-active {
  transition: opacity 0.2s ease;
}

.base-modal-enter-active .base-modal-container,
.base-modal-leave-active .base-modal-container {
  transition: transform 0.2s ease;
}

.base-modal-enter-from,
.base-modal-leave-to {
  opacity: 0;
}

.base-modal-enter-from .base-modal-container {
  transform: scale(0.95);
}

.base-modal-leave-to .base-modal-container {
  transform: scale(0.95);
}

/* Mobile: bottom sheet with slide-up animation */
@media (max-width: 760px) {
  .base-modal-overlay {
    align-items: flex-end;
    justify-content: stretch;
    padding: 0;
  }

  .base-modal-container {
    max-width: 100% !important;
    max-height: calc(100svh - 48px);
    border-radius: 16px 16px 0 0;
  }

  .base-modal-header {
    border-radius: 16px 16px 0 0;
  }

  .base-modal-enter-active,
  .base-modal-leave-active {
    transition: opacity 0.25s ease;
  }

  .base-modal-enter-active .base-modal-container,
  .base-modal-leave-active .base-modal-container {
    transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  }

  .base-modal-enter-from,
  .base-modal-leave-to {
    opacity: 0;
  }

  .base-modal-enter-from .base-modal-container {
    transform: translateY(100%);
  }

  .base-modal-leave-to .base-modal-container {
    transform: translateY(100%);
  }
}
</style>
