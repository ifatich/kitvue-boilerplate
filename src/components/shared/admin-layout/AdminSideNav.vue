<script setup lang="ts">
/**
 * @file AdminSideNav.vue
 * @description Sidenav rail navigasi CMS Admin dengan dukungan mobile drawer
 * dan indikator visual aktif berstandar Pegadaian Green Design System.
 */
import type { AdminNavItem } from './types'

withDefaults(
  defineProps<{
    items: AdminNavItem[]
    expanded?: boolean
    mobileOpen?: boolean
    ariaLabel?: string
  }>(),
  {
    expanded: false,
    mobileOpen: false,
    ariaLabel: 'Admin navigation',
  },
)

const emit = defineEmits<{
  navigate: [item: AdminNavItem]
}>()
</script>

<template>
  <aside
    class="admin-side-nav"
    :class="{ 'is-expanded': expanded, 'is-open': mobileOpen }"
    :aria-label="ariaLabel"
  >
    <nav class="side-nav-rail" :aria-label="ariaLabel">
      <button
        v-for="item in items"
        :key="item.label"
        class="side-nav-item"
        :class="{ 'is-active': item.active }"
        type="button"
        :title="item.label"
        @click="emit('navigate', item)"
      >
        <span class="nav-icon" :class="`is-${item.icon}`" aria-hidden="true">
          <!-- Home -->
          <svg v-if="item.icon === 'home'" viewBox="0 0 24 24">
            <path d="M3 10.8 12 3.5l9 7.3" />
            <path d="M5 10v9.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V10" />
            <path d="M9 21v-6h6v6" />
          </svg>

          <!-- Document / Feedback -->
          <svg v-else-if="item.icon === 'document'" viewBox="0 0 24 24">
            <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
            <path d="M14 3v5h4" />
            <path d="M9 12h6M9 16h6" />
          </svg>

          <!-- Approval / Questions -->
          <svg v-else-if="item.icon === 'approval'" viewBox="0 0 24 24">
            <path d="M7 20h9.5a2 2 0 0 0 2-2v-4" />
            <path
              d="M5.5 17.5 4 20l2.5-.8L17.7 8a1.8 1.8 0 0 0 0-2.6 1.8 1.8 0 0 0-2.6 0L5.5 17.5Z"
            />
            <path d="m14.2 6.3 2.5 2.5" />
            <path d="M7 4.5h5" />
            <path d="M7 8.5h4" />
          </svg>

          <!-- Admin / System -->
          <svg v-else-if="item.icon === 'admin'" viewBox="0 0 24 24">
            <path d="M9.5 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
            <path d="M3.5 20a6 6 0 0 1 10.2-4.3" />
            <path d="M18 14v6M15 17h6" />
          </svg>

          <!-- User -->
          <svg v-else-if="item.icon === 'user'" viewBox="0 0 24 24">
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
            <path d="M5 21a7 7 0 0 1 14 0" />
          </svg>

          <!-- Profile -->
          <svg v-else-if="item.icon === 'profile'" viewBox="0 0 24 24">
            <path d="M4 8h12" />
            <path d="m13 5 3 3-3 3" />
            <path d="M20 16H8" />
            <path d="m11 13-3 3 3 3" />
          </svg>

          <!-- Gold -->
          <svg v-else-if="item.icon === 'gold'" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" />
            <path d="M12 8v8M8 12h8" />
          </svg>
        </span>

        <span class="nav-label">{{ item.label }}</span>
      </button>
    </nav>

    <section class="side-nav-panel" aria-live="polite">
      <slot name="panel" :active-item="items.find((item) => item.active)">
        <span>{{ items.find((item) => item.active)?.label }}</span>
      </slot>
    </section>
  </aside>
</template>

<style scoped>
.admin-side-nav {
  position: sticky;
  top: 72px;
  height: calc(100vh - 72px);
  display: grid;
  grid-template-columns: 80px minmax(0, 1fr);
  width: var(--admin-sidebar-current-width, 80px);
  flex-shrink: 0;
  overflow: hidden;
  background: var(--g-kit-black-10, #f8fafc);
  z-index: 15;
  transition: width 0.2s ease;
}

.side-nav-rail {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 8px;
  background: var(--g-kit-broccoli-50, #004d43);
}

.side-nav-panel {
  min-width: 254px;
  padding: 31px 24px;
  color: var(--g-kit-lime-50, #95c11f);
  font-size: var(--g-kit-font-size-omicron, 0.75rem);
  font-weight: var(--g-kit-font-weight-normal, 400);
  line-height: var(--g-kit-line-height-omicron, 1rem);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.12s ease;
}

.admin-side-nav.is-expanded .side-nav-panel {
  opacity: 1;
  pointer-events: auto;
}

.side-nav-item {
  position: relative;
  min-height: 64px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 12px 4px;
  border: 0;
  background: transparent;
  color: var(--g-kit-white, #ffffff);
  font: inherit;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.side-nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.side-nav-item.is-active {
  width: calc(100% - 4px);
  margin-left: 4px;
  border-radius: 8px 0 0 8px;
  background: var(--g-kit-black-10, #f8fafc);
  color: var(--g-kit-broccoli-50, #004d43);
}

.side-nav-item.is-active:hover {
  background: var(--g-kit-black-10, #f8fafc);
}

.nav-icon,
.nav-icon svg {
  width: 24px;
  height: 24px;
}

.nav-icon svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.nav-label {
  max-width: 72px;
  color: currentColor;
  font-size: var(--g-kit-font-size-omega, 0.6875rem);
  font-weight: var(--g-kit-font-weight-normal, 400);
  line-height: var(--g-kit-line-height-omega, 0.875rem);
  word-break: normal;
}

@media (max-width: 900px) {
  .admin-side-nav {
    width: 240px;
    position: fixed;
    inset: 64px auto 0 0;
    grid-template-columns: 1fr;
    background: var(--g-kit-broccoli-50, #004d43);
    transform: translateX(-100%);
    transition: transform 0.2s ease;
    z-index: 95;
    box-shadow: 4px 0 16px rgba(0, 0, 0, 0.2);
  }

  .admin-side-nav.is-open {
    transform: translateX(0);
  }

  .side-nav-rail {
    gap: 0;
    padding-top: 8px;
  }

  .side-nav-panel {
    display: none;
  }

  .side-nav-item {
    min-height: 56px;
    flex-direction: row;
    justify-content: flex-start;
    gap: 12px;
    padding: 12px 20px;
    text-align: left;
  }

  .side-nav-item.is-active {
    width: auto;
    margin: 8px;
    border-radius: 8px;
  }

  .nav-label {
    max-width: none;
    font-size: var(--g-kit-font-size-sigma, 0.75rem);
    line-height: var(--g-kit-line-height-sigma, 1rem);
  }
}
</style>
