<script setup lang="ts">
/**
 * @file SprintModuleShell.vue
 * @description Universal Page Shell for SPRINT Single UI modules.
 * Features:
 * - Top SPRINT Navbar with embedded pattern & mobile back/info header
 * - Breadcrumbs & NavBack bar for desktop
 * - Full-bleed mobile container with desktop 1152px constraint
 * - Mobile Stepper Banner (#mobile-stepper) & Notice (#notice) slots
 * - Sticky Flexbox Footer conforming to Pegadaian guidelines
 * - Responsive Fixed Action Bar (#actions) with 1 or 2 stacked buttons
 */
import { getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import SprintNavbar from '@/components/shared/admin-layout/SprintNavbar.vue'
import Breadcrumb from '@/components/shared/breadcrumb/Breadcrumb.vue'
import NavBack from '@/components/shared/navBack/navBack.vue'

export type BreadcrumbItem = string | { label: string; to?: string }

const props = withDefaults(
  defineProps<{
    title: string
    breadcrumbs?: BreadcrumbItem[]
    backTo?: string
    profileRole?: string
    showAuthToggle?: boolean
    wide?: boolean
    entryNavbar?: boolean
    searchPlaceholder?: string
  }>(),
  {
    breadcrumbs: () => [],
    backTo: '/beranda',
    profileRole: 'Penaksir',
    showAuthToggle: false,
    wide: false,
    entryNavbar: false,
    searchPlaceholder: 'Cari (contoh: pengajuan kredit)',
  },
)

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'info'): void
}>()

const router = useRouter()
const instance = getCurrentInstance()

const handleBack = () => {
  if (instance?.vnode.props?.onBack) {
    emit('back')
  } else {
    router.push(props.backTo)
  }
}
</script>

<template>
  <div :class="[
    'sprint-module-shell',
    {
      'sprint-module-shell--wide': wide,
      'sprint-module-shell--entry-navbar': entryNavbar,
    },
  ]">
    <SprintNavbar
      embedded
      :entry-layout="entryNavbar"
      :profile-role="profileRole"
      :show-auth-toggle="showAuthToggle"
      :search-placeholder="searchPlaceholder"
      :mobile-title="title"
      :mobile-back-to="backTo"
      @back="handleBack"
      @info="emit('info')"
    />

    <div v-if="breadcrumbs && breadcrumbs.length" class="sprint-module-shell__breadcrumb-band">
      <div class="sprint-module-shell__breadcrumb-inner">
        <Breadcrumb class="sprint-module-shell__breadcrumb" :items="breadcrumbs" />
      </div>
    </div>

    <main class="sprint-module-shell__content" role="main">
      <NavBack :label="title" :action="handleBack" />
      <slot name="mobile-stepper" />
      <slot name="notice" />
      <slot />
    </main>

    <footer class="sprint-module-shell__footer">
      Copyright © 2024 PT. Pegadaian. All Rights Reserved.
    </footer>

    <div v-if="$slots.actions" class="sprint-module-shell__actions">
      <div class="sprint-module-shell__actions-inner">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sprint-module-shell {
  flex: 1 0 auto;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: var(--g-kit-white);
}

.sprint-module-shell__content {
  flex: 1 0 auto;
  width: min(calc(100% - 32px), 1152px);
  margin: 0 auto;
  padding-top: 16px;
  box-sizing: border-box;
}

.sprint-module-shell__content :deep(.section-bg-top) {
  padding: 15px 0;
}

.sprint-module-shell__breadcrumb-band {
  flex-shrink: 0;
  height: 52px;
  background: var(--g-kit-white);
}

.sprint-module-shell__breadcrumb-inner {
  width: min(calc(100% - 32px), 1152px);
  height: 100%;
  margin: 0 auto;
}

.sprint-module-shell__breadcrumb {
  height: 100%;
}

.sprint-module-shell__footer {
  margin-top: auto;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 48px;
  padding: 12px 24px;
  border-top: 1px solid var(--g-kit-black-20);
  color: var(--g-kit-black-60);
  font-size: var(--g-kit-font-size-sigma);
  font-weight: var(--g-kit-font-weight-normal);
  line-height: var(--g-kit-line-height-sigma);
  background: var(--g-kit-white);
}

@media (min-width: 768px) {
  .sprint-module-shell:has(.sprint-module-shell__actions) .sprint-module-shell__footer {
    margin-bottom: 104px;
  }
}

.sprint-module-shell__actions {
  position: fixed;
  z-index: 1000;
  right: 0;
  bottom: 0;
  left: 0;
  border-top: 1px solid var(--g-kit-black-20);
  background: var(--g-kit-white);
}

.sprint-module-shell__actions-inner {
  display: flex;
  justify-content: flex-end;
  gap: 24px;
  width: min(calc(100% - 32px), 1152px);
  margin: 0 auto;
  padding: 31px 0 32px;

  :deep(.btn) {
    min-width: 200px;
    height: 40px;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 800;
    line-height: 24px;
    transition: all 0.2s ease;
  }

  :deep(.btn-outline) {
    background-color: var(--g-kit-white, #ffffff);
    border: 1px solid var(--g-kit-black-40, #bbbdc0);
    color: var(--g-kit-black-60, #58585b);

    &:hover {
      background-color: var(--g-kit-black-10, #f8f8f8);
      border-color: var(--g-kit-black-60, #58585b);
      color: var(--g-kit-black-80, #252528);
    }
  }

  :deep(.btn-primary) {
    background-color: var(--g-kit-lime-50, #00ab4e);
    border-color: var(--g-kit-lime-50, #00ab4e);
    color: var(--g-kit-white, #ffffff);

    &:hover {
      background-color: #009644;
      border-color: #009644;
    }
  }
}

@media (min-width: 768px) {
  .sprint-module-shell--wide .sprint-module-shell__content,
  .sprint-module-shell--wide .sprint-module-shell__breadcrumb-inner,
  .sprint-module-shell--wide .sprint-module-shell__actions-inner {
    width: min(calc(100% - 32px), 1312px);
  }

  .sprint-module-shell--wide :deep(.sprint-navbar--floating) {
    width: min(calc(100% - 32px), 1312px);
    border-radius: 12px;
  }

  .sprint-module-shell--wide:not(.sprint-module-shell--entry-navbar) :deep(.sprint-navbar--floating .sprint-search-wrapper) {
    flex-basis: 547px;
    max-width: 547px;
  }
}

@media (min-width: 1200px) {
  .sprint-module-shell:not(.sprint-module-shell--entry-navbar) :deep(.sprint-navbar--floating .sprint-search-wrapper) {
    position: absolute;
    top: 16px;
    left: 225px;
    width: 360px;
    max-width: 360px;
  }

  .sprint-module-shell--wide:not(.sprint-module-shell--entry-navbar) :deep(.sprint-navbar--floating .sprint-search-wrapper) {
    width: 547px;
    max-width: 547px;
  }

  .sprint-module-shell:not(.sprint-module-shell--entry-navbar) :deep(.sprint-navbar--floating .sprint-search-icon) {
    left: 12px;
    width: 24px;
    height: 24px;
  }

  .sprint-module-shell:not(.sprint-module-shell--entry-navbar) :deep(.sprint-navbar--floating .sprint-search-input) {
    padding-left: 40px;
    border-radius: 6px;
    background: var(--g-kit-black-10, #f8f8f8);
    font-size: var(--g-kit-font-size-sigma, 14px);
  }

  .sprint-module-shell:not(.sprint-module-shell--entry-navbar) :deep(.sprint-profile-trigger) {
    width: 220px;
    gap: 8px;
    padding: 4px 0 4px 18px;
  }

  .sprint-module-shell:not(.sprint-module-shell--entry-navbar) :deep(.sprint-profile-text) {
    flex: 0 0 170px;
    width: 170px;
  }

  .sprint-module-shell:not(.sprint-module-shell--entry-navbar) :deep(.sprint-user-name) {
    font-size: var(--g-kit-font-size-sigma, 14px);
    font-weight: var(--g-kit-font-weight-bold, 800);
    line-height: var(--g-kit-line-height-sigma, 20px);
    letter-spacing: 0;
  }

  .sprint-module-shell:not(.sprint-module-shell--entry-navbar) :deep(.sprint-user-role) {
    font-size: var(--g-kit-font-size-omega, 12px);
    line-height: var(--g-kit-line-height-omega, 18px);
  }

  .sprint-module-shell:not(.sprint-module-shell--entry-navbar) :deep(.sprint-chevron) {
    width: 24px;
    height: 24px;
  }

  .sprint-module-shell:not(.sprint-module-shell--entry-navbar) :deep(.sprint-notif-badge) {
    font-size: 8px;
    line-height: 10px;
    padding: 0 2px;
    border-radius: 3px;
  }
}

@media (max-width: 767px) {
  .sprint-module-shell {
    flex: 1 0 auto;
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    padding-bottom: 0;
    background: var(--g-kit-black-10, #f8f8f8);
  }

  .sprint-module-shell__content {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0;
  }

  .sprint-module-shell__breadcrumb-inner {
    width: 100%;
    padding: 0;
  }

  .sprint-module-shell__breadcrumb-band {
    display: none;
  }

  .sprint-module-shell__content :deep(.section-bg-top) {
    display: none;
  }

  .sprint-module-shell__footer {
    margin-top: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: auto;
    padding: 16px 16px calc(88px + env(safe-area-inset-bottom, 0px));
    border-top: 1px solid var(--g-kit-black-20);
    background: var(--g-kit-white);
    color: var(--g-kit-black-60);
    font-size: var(--g-kit-font-size-sigma);
  }

  .sprint-module-shell:has(.sprint-module-shell__actions-inner > :nth-child(2)) .sprint-module-shell__footer {
    padding-bottom: calc(136px + env(safe-area-inset-bottom, 0px));
  }

  .sprint-module-shell__actions {
    border-top: none;
    border-radius: 12px 12px 0 0;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.14), 0px 0px 2px rgba(0, 0, 0, 0.08);
  }

  .sprint-module-shell__actions-inner {
    flex-direction: column;
    gap: 8px;
    width: 100%;
    padding: 16px 16px calc(16px + env(safe-area-inset-bottom, 0px));
    margin: 0;

    :deep(.btn) {
      width: 100%;
      height: 40px;
      margin: 0;
    }
  }
}
</style>
