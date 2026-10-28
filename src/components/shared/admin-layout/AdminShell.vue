<script setup lang="ts">
/**
 * @file AdminShell.vue
 * @description Shell layout utama CMS Administrator Arrum Zada.
 * Mengimplementasikan CSS Grid dengan lebar rail 80px (expandable 334px),
 * responsive mobile drawer, dan integrasi TopNav, SideNav, serta Footer.
 * Struktur 100% konsisten dengan bullion-bank-cms.
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminFooter from './AdminFooter.vue'
import AdminSideNav from './AdminSideNav.vue'
import AdminTopNav from './AdminTopNav.vue'
import type { AdminNavItem } from './types'

const router = useRouter()

const props = withDefaults(
  defineProps<{
    navItems: AdminNavItem[]
    sidebarExpanded?: boolean
    userName?: string
    userRole?: string
    serverStatus?: 'healthy' | 'degraded' | 'offline'
    isDbConnected?: boolean
    footerText?: string
  }>(),
  {
    sidebarExpanded: false,
    userName: 'Admin Pegadaian',
    userRole: 'Super Administrator',
    serverStatus: 'healthy',
    isDbConnected: true,
    footerText: 'Copyright © 2026 PT. Pegadaian. All Rights Reserved.',
  },
)

const emit = defineEmits<{
  navigate: [item: AdminNavItem]
  refresh: []
  logout: []
}>()

const isSidebarExpanded = ref(props.sidebarExpanded)
const isMobileMenuOpen = ref(false)

const activeNavItem = computed(() => props.navItems.find((item) => item.active))

const isMobileViewport = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches

const toggleNavigation = (): void => {
  if (isMobileViewport()) {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
    return
  }

  isSidebarExpanded.value = !isSidebarExpanded.value
}

const closeMobileMenu = (): void => {
  isMobileMenuOpen.value = false
}

const handleNavigate = (item: AdminNavItem): void => {
  closeMobileMenu()
  emit('navigate', item)
  if (item.route) {
    router.push(item.route)
  }
}

const handleRefresh = (): void => {
  emit('refresh')
}

const handleLogout = (): void => {
  emit('logout')
}
</script>

<template>
  <div class="admin-shell" :class="{ 'is-sidebar-expanded': isSidebarExpanded }">
    <AdminTopNav
      :navigation-expanded="isMobileMenuOpen || isSidebarExpanded"
      :user-name="userName"
      :user-role="userRole"
      :server-status="serverStatus"
      :is-db-connected="isDbConnected"
      @toggle-navigation="toggleNavigation"
      @refresh="handleRefresh"
      @logout="handleLogout"
    >
      <template v-if="$slots.brand" #brand>
        <slot name="brand" />
      </template>
      <template v-if="$slots['top-actions']" #actions>
        <slot name="top-actions" />
      </template>
    </AdminTopNav>

    <div class="admin-shell-body">
      <button
        v-if="isMobileMenuOpen"
        type="button"
        class="mobile-overlay"
        aria-label="Tutup menu navigasi"
        @click="closeMobileMenu"
      />

      <AdminSideNav
        :items="navItems"
        :expanded="isSidebarExpanded"
        :mobile-open="isMobileMenuOpen"
        @navigate="handleNavigate"
      >
        <template #panel>
          <slot name="side-panel" :active-item="activeNavItem">
            <span>{{ activeNavItem?.label }}</span>
          </slot>
        </template>
      </AdminSideNav>

      <div class="admin-shell-content">
        <main class="admin-main">
          <slot />
        </main>

        <AdminFooter v-if="$slots.footer" :text="footerText">
          <slot name="footer" />
        </AdminFooter>
        <AdminFooter v-else :text="footerText" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-shell {
  --admin-sidebar-current-width: 80px;
  min-height: 100svh;
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: var(--g-kit-black-10, #f8fafc);
  color: var(--g-kit-black-80, #1e293b);
  font-family:
    'Nunito Sans',
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

.admin-shell.is-sidebar-expanded {
  --admin-sidebar-current-width: 334px;
}

.admin-shell-body {
  display: flex;
  flex: 1 1 auto;
  width: 100%;
  min-height: calc(100svh - 72px);
  position: relative;
}

.admin-shell-content {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-width: 0;
  min-height: 100%;
}

.admin-main {
  flex: 1 0 auto;
  min-width: 0;
  max-width: 100%;
  padding: 24px;
  box-sizing: border-box;
}

.mobile-overlay {
  display: none;
}

@media (max-width: 900px) {
  .admin-shell-body {
    min-height: calc(100svh - 64px);
  }

  .mobile-overlay {
    display: block;
    position: fixed;
    inset: 64px 0 0;
    z-index: 90;
    background: rgba(0, 0, 0, 0.4);
    border: 0;
    padding: 0;
    margin: 0;
    cursor: pointer;
  }

  .admin-main {
    padding: 16px;
    min-width: 0;
    max-width: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
  }
}
</style>
