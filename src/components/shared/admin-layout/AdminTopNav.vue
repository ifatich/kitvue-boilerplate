<script setup lang="ts">
/**
 * @file AdminTopNav.vue
 * @description Topbar navigasi CMS Admin dengan hamburger menu trigger 80x72px,
 * logo Arrum Zada, indikator status sistem & DB, dan dropdown profil admin.
 * Mengikuti pola arsitektur bullion-bank-cms.
 */
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { StarterLogo } from '@/components/shared/logo'

withDefaults(
  defineProps<{
    navigationExpanded: boolean
    brandAlt?: string
    userName?: string
    userRole?: string
    serverStatus?: 'healthy' | 'degraded' | 'offline'
    isDbConnected?: boolean
  }>(),
  {
    brandAlt: 'Kitvue Starter Admin CMS',
    userName: 'Admin Pegadaian',
    userRole: 'Super Administrator',
    serverStatus: 'healthy',
    isDbConnected: true,
  },
)

const emit = defineEmits<{
  toggleNavigation: []
  refresh: []
  logout: []
}>()

const router = useRouter()
const isProfileSheetOpen = ref(false)

const handleDocumentClick = (e: MouseEvent): void => {
  const target = e.target as HTMLElement | null
  if (!target) return
  if (
    !target.closest('.profile-wrapper') &&
    !target.closest('.profile-bottomsheet-content')
  ) {
    isProfileSheetOpen.value = false
  }
}

const handleKeydown = (e: KeyboardEvent): void => {
  if (e.key === 'Escape' && isProfileSheetOpen.value) {
    isProfileSheetOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleKeydown)
})

const toggleProfileMenu = (): void => {
  isProfileSheetOpen.value = !isProfileSheetOpen.value
}

const handleGoToHome = (): void => {
  isProfileSheetOpen.value = false
  router.push('/')
}

const handleLogoutAction = (): void => {
  isProfileSheetOpen.value = false
  emit('logout')
}
</script>

<template>
  <header class="admin-top-nav">
    <button
      class="menu-trigger"
      type="button"
      aria-label="Toggle menu navigasi"
      :aria-expanded="navigationExpanded"
      @click="emit('toggleNavigation')"
    >
      <span />
      <span />
      <span />
    </button>

    <div class="brand-mark" :aria-label="brandAlt">
      <slot name="brand">
        <div class="brand-logo-container">
          <StarterLogo variant="compact" :height="34" />
        </div>
      </slot>

      <div class="header-actions">
        <slot name="actions">
          <!-- Server & Database Status Pill -->
          <div
            class="status-pill"
            :class="{
              'is-healthy': serverStatus === 'healthy' && isDbConnected,
              'is-degraded': serverStatus === 'degraded' || !isDbConnected,
              'is-offline': serverStatus === 'offline',
            }"
            :title="`Status Server: ${serverStatus.toUpperCase()} | Database: ${isDbConnected ? 'Connected' : 'Disconnected'}`"
          >
            <span class="status-dot" aria-hidden="true" />
            <span class="status-text">
              Server: {{ serverStatus === 'healthy' ? 'UP' : serverStatus.toUpperCase() }}
              <span class="status-sep">|</span>
              DB: {{ isDbConnected ? 'Connected' : 'Error' }}
            </span>
          </div>

          <!-- Quick Refresh Button -->
          <button
            class="action-btn-refresh"
            type="button"
            title="Muat Ulang Data Terbaru"
            @click="emit('refresh')"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
              />
              <path
                d="M3 3v5h5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
              />
              <path
                d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
              />
              <path
                d="M16 16h5v5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
              />
            </svg>
            <span class="refresh-label">Refresh</span>
          </button>

          <span class="header-divider" />

          <!-- Profile Trigger & Sheet -->
          <div class="profile-wrapper">
            <button
              class="profile-trigger"
              type="button"
              aria-label="Menu profil administrator"
              :aria-expanded="isProfileSheetOpen"
              @click.stop="toggleProfileMenu"
            >
              <div class="profile-avatar" aria-hidden="true">
                {{ userName.charAt(0).toUpperCase() }}
              </div>
              <span class="profile-info">
                <strong>{{ userName }}</strong>
                <small>{{ userRole }}</small>
              </span>
              <svg viewBox="0 0 24 24" aria-hidden="true" class="chevron-icon">
                <path
                  d="m7 9 5 5 5-5"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  fill="none"
                />
              </svg>
            </button>

            <!-- Dropdown Menu (Desktop) -->
            <div
              v-if="isProfileSheetOpen"
              class="profile-menu-card desktop-only"
              role="menu"
              aria-label="Profile options"
            >
              <div class="profile-menu-header">
                <div class="pm-avatar" aria-hidden="true">
                  {{ userName.charAt(0).toUpperCase() }}
                </div>
                <div class="pm-user-meta">
                  <span class="pm-name">{{ userName }}</span>
                  <span class="pm-role-badge">{{ userRole }}</span>
                </div>
              </div>

              <div class="profile-menu-divider" />

              <button
                class="profile-menu-item"
                type="button"
                role="menuitem"
                @click="handleGoToHome"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                <span>Halaman Beranda Publik</span>
              </button>

              <button
                class="profile-menu-item is-danger"
                type="button"
                role="menuitem"
                @click="handleLogoutAction"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Keluar / Logout</span>
              </button>
            </div>

            <!-- Mobile Bottom Sheet (Teleported to body) -->
            <Teleport to="body">
              <Transition name="profile-sheet-transition">
                <div
                  v-if="isProfileSheetOpen"
                  class="profile-bottomsheet-overlay mobile-only"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Menu profil administrator"
                  @click.self="isProfileSheetOpen = false"
                >
                  <div class="profile-bottomsheet-content" @click.stop>
                    <div class="bottomsheet-handle" aria-hidden="true" />

                    <div class="bottomsheet-user-card">
                      <div class="bottomsheet-avatar" aria-hidden="true">
                        {{ userName.charAt(0).toUpperCase() }}
                      </div>
                      <div class="bottomsheet-user-meta">
                        <span class="bottomsheet-user-name">{{ userName }}</span>
                        <span class="bottomsheet-role-badge">{{ userRole }}</span>
                      </div>
                      <button
                        type="button"
                        class="bottomsheet-close-btn"
                        aria-label="Tutup menu profil"
                        @click="isProfileSheetOpen = false"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>

                    <div class="bottomsheet-divider" />

                    <div class="bottomsheet-menu-list">
                      <button
                        type="button"
                        class="bottomsheet-menu-item"
                        @click="handleGoToHome"
                      >
                        <span class="bs-item-icon">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </span>
                        <span class="bs-item-text">Halaman Beranda Publik</span>
                        <span class="bs-item-chevron" aria-hidden="true">
                          <svg viewBox="0 0 24 24">
                            <path d="m9 18 6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                          </svg>
                        </span>
                      </button>

                      <button
                        type="button"
                        class="bottomsheet-menu-item is-danger"
                        @click="handleLogoutAction"
                      >
                        <span class="bs-item-icon">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                          </svg>
                        </span>
                        <span class="bs-item-text">Keluar / Logout</span>
                        <span class="bs-item-chevron" aria-hidden="true">
                          <svg viewBox="0 0 24 24">
                            <path d="m9 18 6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                          </svg>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </Transition>
            </Teleport>
          </div>
        </slot>
      </div>
    </div>
  </header>
</template>

<style scoped>
.admin-top-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 72px;
  display: grid;
  grid-template-columns: var(--admin-sidebar-current-width, 80px) minmax(0, 1fr);
  align-items: center;
  background: var(--g-kit-white, #ffffff);
  box-shadow: var(--bb-elevation-1, 0 2px 6px rgba(0, 0, 0, 0.1));
  transition: grid-template-columns 0.2s ease;
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
}

.menu-trigger {
  width: 80px;
  height: 72px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: 0;
  background: var(--g-kit-broccoli-50, #004d43);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.menu-trigger:hover {
  background: #003e36;
}

.menu-trigger span {
  width: 18px;
  height: 2px;
  border-radius: 8px;
  background: var(--g-kit-white, #ffffff);
}

.brand-mark {
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  justify-self: start;
  padding-left: 24px;
  box-sizing: border-box;
}

.brand-logo-container {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-right: 24px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: var(--g-kit-font-size-omega, 0.75rem);
  font-weight: 600;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #334155;
  white-space: nowrap;
}

.status-pill.is-healthy {
  background: #ecfdf5;
  border-color: #a7f3d0;
  color: #065f46;
}

.status-pill.is-degraded {
  background: #fffbeb;
  border-color: #fde68a;
  color: #92400e;
}

.status-pill.is-offline {
  background: #fef2f2;
  border-color: #fecaca;
  color: #991b1b;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
  animation: pulse-dot 2s infinite;
}

.status-pill.is-degraded .status-dot {
  background: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.25);
}

.status-pill.is-offline .status-dot {
  background: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.25);
}

@keyframes pulse-dot {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

.status-sep {
  opacity: 0.5;
  margin: 0 2px;
}

.action-btn-refresh {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--g-kit-black-20, #e2e8f0);
  border-radius: 6px;
  background: var(--g-kit-white, #ffffff);
  color: var(--g-kit-black-80, #1e293b);
  font-size: var(--g-kit-font-size-omicron, 0.75rem);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-btn-refresh:hover {
  background: var(--g-kit-black-10, #f8fafc);
  border-color: var(--g-kit-broccoli-50, #004d43);
  color: var(--g-kit-broccoli-50, #004d43);
}

.action-btn-refresh svg {
  width: 14px;
  height: 14px;
}

.header-divider {
  width: 1px;
  height: 36px;
  background: var(--g-kit-black-20, #e2e8f0);
}

.profile-wrapper {
  position: relative;
}

.profile-trigger {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  border: 0;
  background: transparent;
  color: var(--g-kit-black-80, #1e293b);
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  transition: background-color 0.15s ease;
}

.profile-trigger:hover {
  background: var(--g-kit-black-10, #f8fafc);
}

.profile-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--g-kit-broccoli-50, #004d43);
  color: var(--g-kit-white, #ffffff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.profile-info strong {
  font-size: var(--g-kit-font-size-sigma, 0.8125rem);
  font-weight: 700;
  color: var(--g-kit-black-90, #0f172a);
}

.profile-info small {
  font-size: var(--g-kit-font-size-omega, 0.6875rem);
  color: var(--g-kit-black-60, #64748b);
}

.chevron-icon {
  width: 18px;
  height: 18px;
  color: var(--g-kit-black-60, #64748b);
}

.profile-menu-card {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 270px;
  padding: 8px;
  border: 1px solid var(--g-kit-black-20, #eeeeef);
  border-radius: 12px;
  background: var(--g-kit-white, #ffffff);
  box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.06);
  z-index: 1000;
  animation: slide-down 0.15s ease-out;
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-menu-header {
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.pm-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--g-kit-broccoli-50, #004d43);
  color: var(--g-kit-white, #ffffff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--g-kit-font-weight-bold, 800);
  font-size: var(--g-kit-font-size-omicron, 16px);
  flex-shrink: 0;
}

.pm-user-meta {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.pm-name {
  font-family: var(--g-kit-font-family-base, 'Nunito Sans', sans-serif);
  font-size: var(--g-kit-font-size-sigma, 14px);
  line-height: var(--g-kit-line-height-sigma, 20px);
  font-weight: var(--g-kit-font-weight-bold, 800);
  color: var(--g-kit-black-80, #252528);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.pm-role-badge,
.bottomsheet-role-badge {
  display: inline-flex;
  align-items: center;
  background-color: var(--g-kit-lime-10, #e6f6ea);
  color: var(--g-kit-lime-90, #00441f);
  font-size: var(--g-kit-font-size-atom, 11px);
  line-height: 14px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  padding: 2px 8px;
  border-radius: 9999px;
  border: 1px solid var(--g-kit-lime-20, #99dcab);
  width: fit-content;
}

.profile-menu-divider {
  height: 1px;
  background: var(--g-kit-black-20, #eeeeef);
  margin: 6px 0;
}

.profile-menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--g-kit-black-80, #252528);
  font-family: var(--g-kit-font-family-base, 'Nunito Sans', sans-serif);
  font-size: var(--g-kit-font-size-sigma, 14px);
  line-height: var(--g-kit-line-height-sigma, 20px);
  font-weight: var(--g-kit-font-weight-normal, 600);
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.profile-menu-item svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.profile-menu-item:hover {
  background: var(--g-kit-black-10, #f5f7f9);
  color: var(--g-kit-broccoli-50, #004d43);
}

.profile-menu-item:focus-visible {
  outline: 2px solid var(--g-kit-broccoli-50, #004d43) !important;
  outline-offset: -1px !important;
}

.profile-menu-item.is-danger {
  color: var(--g-kit-red-50, #ae1e22);
}

.profile-menu-item.is-danger:hover {
  background: var(--g-kit-red-10, #f9e7e8);
  color: var(--g-kit-red-80, #681214);
}

.mobile-only {
  display: none !important;
}

@media (max-width: 900px) {
  .desktop-only {
    display: none !important;
  }

  .mobile-only {
    display: flex !important;
  }

  .admin-top-nav {
    height: 64px;
    grid-template-columns: 64px minmax(0, 1fr);
    position: sticky;
    top: 0;
    z-index: 100;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  .menu-trigger {
    width: 64px;
    height: 64px;
    background: var(--g-kit-white, #ffffff);
  }

  .menu-trigger span {
    background: var(--g-kit-broccoli-50, #004d43);
  }

  .brand-mark {
    padding-left: 12px;
    padding-right: 12px;
    min-width: 0;
    box-sizing: border-box;
  }

  .brand-logo-container {
    content-visibility: visible;
    visibility: visible;
    display: flex;
    align-items: center;
  }

  .header-actions {
    gap: 10px;
    margin-right: 0;
    min-width: 0;
  }

  .status-pill,
  .action-btn-refresh,
  .header-divider,
  .profile-info {
    display: none;
  }

  /* Profile Bottom Sheet (Mobile) */
  .profile-bottomsheet-overlay {
    position: fixed;
    inset: 0;
    z-index: 1100;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    padding: 0;
  }

  .profile-bottomsheet-content {
    position: relative;
    width: 100%;
    max-width: 100vw;
    background: var(--g-kit-white, #ffffff);
    border-radius: 16px 16px 0 0;
    box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.2);
    padding: 12px 20px calc(24px + env(safe-area-inset-bottom, 12px));
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .bottomsheet-handle {
    width: 40px;
    height: 4px;
    border-radius: 9999px;
    background: var(--g-kit-black-30, #cbd5e1);
    margin: 4px auto 12px;
    flex-shrink: 0;
  }

  .bottomsheet-user-card {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .bottomsheet-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--g-kit-broccoli-50, #004d43);
    color: var(--g-kit-white, #ffffff);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.125rem;
    flex-shrink: 0;
  }

  .bottomsheet-user-meta {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .bottomsheet-user-name {
    font-family: var(--g-kit-font-family-base, 'Nunito Sans', sans-serif);
    font-size: var(--g-kit-font-size-kappa, 1rem);
    font-weight: var(--g-kit-font-weight-bold, 800);
    color: var(--g-kit-black-80, #252528);
    line-height: var(--g-kit-line-height-kappa, 1.25rem);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .bottomsheet-close-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 0;
    background: var(--g-kit-black-10, #f5f7f9);
    color: var(--g-kit-black-60, #58585b);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s ease;
  }

  .bottomsheet-close-btn:hover {
    background: var(--g-kit-black-20, #eeeeef);
    color: var(--g-kit-black-80, #252528);
  }

  .bottomsheet-divider {
    height: 1px;
    background: var(--g-kit-black-20, #eeeeef);
    margin: 8px 0;
  }

  .bottomsheet-menu-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .bottomsheet-menu-item {
    width: 100%;
    min-height: 48px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border: 0;
    border-radius: 8px;
    background: var(--g-kit-black-10, #f5f7f9);
    color: var(--g-kit-black-80, #252528);
    font-family: var(--g-kit-font-family-base, 'Nunito Sans', sans-serif);
    font-size: var(--g-kit-font-size-sigma, 14px);
    font-weight: var(--g-kit-font-weight-normal, 600);
    text-align: left;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
    box-sizing: border-box;
  }

  .bottomsheet-menu-item:hover,
  .bottomsheet-menu-item:active {
    background: var(--g-kit-black-20, #eeeeef);
    color: var(--g-kit-broccoli-50, #004d43);
  }

  .bottomsheet-menu-item.is-danger {
    color: var(--g-kit-red-50, #ae1e22);
    background: var(--g-kit-red-10, #f9e7e8);
  }

  .bottomsheet-menu-item.is-danger:hover,
  .bottomsheet-menu-item.is-danger:active {
    background: #fecaca;
    color: var(--g-kit-red-80, #681214);
  }

  .bottomsheet-menu-item.is-danger:hover,
  .bottomsheet-menu-item.is-danger:active {
    background: #fee2e2;
    color: #b91c1c;
  }

  .bs-item-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .bs-item-icon svg {
    width: 18px;
    height: 18px;
  }

  .bs-item-text {
    flex: 1 1 auto;
  }

  .bs-item-chevron {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--g-kit-black-40, #94a3b8);
  }

  .bs-item-chevron svg {
    width: 16px;
    height: 16px;
  }

  /* Transition slide-up */
  .profile-sheet-transition-enter-active,
  .profile-sheet-transition-leave-active {
    transition: opacity 0.25s ease;
  }

  .profile-sheet-transition-enter-active .profile-bottomsheet-content,
  .profile-sheet-transition-leave-active .profile-bottomsheet-content {
    transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);
  }

  .profile-sheet-transition-enter-from,
  .profile-sheet-transition-leave-to {
    opacity: 0;
  }

  .profile-sheet-transition-enter-from .profile-bottomsheet-content {
    transform: translateY(100%);
  }

  .profile-sheet-transition-leave-to .profile-bottomsheet-content {
    transform: translateY(100%);
  }
}
</style>
