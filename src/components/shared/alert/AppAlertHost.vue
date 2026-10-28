<script setup lang="ts">
import { GAlert } from '@/components'
import { useAppAlert } from '@/hooks/useAppAlert'

const { appAlert, hideAlert } = useAppAlert()
</script>

<template>
  <Teleport to="body">
    <Transition name="app-alert">
      <output
        v-if="appAlert.visible"
        class="app-alert-host"
        aria-live="polite"
        aria-label="Notifikasi"
      >
        <GAlert
          :label="appAlert.label"
          :color="appAlert.color"
          :variant="appAlert.variant"
          :hide-action="false"
        >
          <template #action>
            <button class="alert-close" type="button" aria-label="Close alert" @click="hideAlert">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </template>
        </GAlert>
      </output>
    </Transition>
  </Teleport>
</template>

<style scoped>
.app-alert-host {
  /* <output> is inline by default; it carries the implicit status role. */
  display: block;

  position: fixed;
  top: 24px;
  left: 50%;
  z-index: 2000;
  width: min(420px, calc(100vw - 32px));
  transform: translateX(-50%);
}

.app-alert-host :deep(.alert) {
  overflow-wrap: anywhere;
}

.alert-close {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: currentColor;
  cursor: pointer;
}

.alert-close svg {
  width: 18px;
  height: 18px;
}

.app-alert-enter-active,
.app-alert-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.app-alert-enter-from,
.app-alert-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px);
}

@media (max-width: 560px) {
  .app-alert-host {
    top: 16px;
    width: calc(100vw - 32px);
  }
}
</style>
