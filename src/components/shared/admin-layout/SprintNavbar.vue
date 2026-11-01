<script setup lang="ts">
/**
 * @file SprintNavbar.vue
 * @description Official Pegadaian SPRINT Top Navigation Bar based on Figma Guideline Single UI (Node 1773:39151).
 * Features SPRINT branding, global search bar, history/notifications with badge, profile dropdown,
 * and integrated Dummy Auth toggle for convenient prototyping.
 */
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue'
import headerPatternAsset from '@/assets/images/sprint/header-pattern.svg'
import sprintMarkAsset from '@/assets/images/sprint/sprint-mark.svg'
import sprintWordmarkAsset from '@/assets/images/sprint/sprint-wordmark.svg'
import searchIconAsset from '@/assets/images/sprint/search.svg'
import historyIconAsset from '@/assets/images/sprint/history.svg'
import notificationIconAsset from '@/assets/images/sprint/notification.svg'
import chevronIconAsset from '@/assets/images/sprint/chevron.svg'
import arrowLeftAsset from '@/assets/images/sprint/arrow-left.svg'
import mobileHistoryIdleAsset from 'kitvue-public/src/assets/icon/icon-system/icon-history-idle.svg'
import mobileNotificationIdleAsset from 'kitvue-public/src/assets/icon/icon-system/icon-notif-idle.svg'
import mobileProfileIdleAsset from 'kitvue-public/src/assets/icon/icon-system/icon-profile-idle.svg'
import mobileInfoAsset from 'kitvue-public/src/assets/icon/icon-system/icon-info.svg'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const props = withDefaults(defineProps<{
  embedded?: boolean
  entryLayout?: boolean
  profileRole?: string
  showAuthToggle?: boolean
  searchPlaceholder?: string
  mobileTitle?: string
  mobileBackTo?: string
  showMobileBottomNav?: boolean
}>(), {
  embedded: false,
  entryLayout: false,
  profileRole: 'Pimpinan Cabang',
  showAuthToggle: true,
  searchPlaceholder: 'Cari (contoh: pengajuan kredit)',
  mobileTitle: '',
  mobileBackTo: '/',
  showMobileBottomNav: false,
})

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'info'): void
}>()

const instance = getCurrentInstance()
const headerPattern = headerPatternAsset as unknown as string
const sprintMark = sprintMarkAsset as unknown as string
const sprintWordmark = sprintWordmarkAsset as unknown as string
const searchIcon = searchIconAsset as unknown as string
const historyIcon = historyIconAsset as unknown as string
const notificationIcon = notificationIconAsset as unknown as string
const chevronIcon = chevronIconAsset as unknown as string
const arrowLeft = arrowLeftAsset as unknown as string
const mobileHistoryIdle = mobileHistoryIdleAsset as unknown as string
const mobileNotificationIdle = mobileNotificationIdleAsset as unknown as string
const mobileProfileIdle = mobileProfileIdleAsset as unknown as string
const mobileInfo = mobileInfoAsset as unknown as string
const router = useRouter()
const authStore = useAuthStore()

const handleBack = () => {
  if (instance?.vnode.props?.onBack) {
    emit('back')
  } else {
    router.push(props.mobileBackTo)
  }
}

const searchQuery = ref('')
const navbarElement = ref<HTMLElement | null>(null)
const activePopover = ref<'history' | 'notifications' | 'profile' | null>(null)
const isProfileOpen = computed(() => activePopover.value === 'profile')

const handleBrandClick = () => {
  router.push('/')
}

const togglePopover = (popover: 'history' | 'notifications' | 'profile') => {
  activePopover.value = activePopover.value === popover ? null : popover
}

const closePopover = () => {
  activePopover.value = null
}

const goToPengajuan = () => {
  closePopover()
  router.push('/pengajuan-gadai')
}

const submitSearch = () => {
  if (!searchQuery.value.trim()) return
  goToPengajuan()
}

const handleDocumentClick = (event: MouseEvent) => {
  if (!navbarElement.value?.contains(event.target as Node)) closePopover()
}

const handleDocumentKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closePopover()
}

const handleLogout = () => {
  closePopover()
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleDocumentKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleDocumentKeydown)
})
</script>

<template>
  <header
    ref="navbarElement"
    :class="[
      'sprint-navbar',
      {
        'sprint-navbar--floating': props.embedded,
        'sprint-navbar--entry-layout': props.entryLayout,
        'sprint-navbar--mobile-module': props.mobileTitle,
      },
    ]"
    role="banner"
  >
    <div v-if="props.embedded" class="sprint-navbar-pattern" :style="{ backgroundImage: `url(${headerPattern})` }" aria-hidden="true" />
    <div v-if="props.mobileTitle" class="sprint-mobile-module-bar">
      <div class="sprint-mobile-module-bar__left">
        <button
          type="button"
          class="sprint-mobile-back"
          :aria-label="`Kembali dari ${props.mobileTitle}`"
          @click="handleBack"
        >
          <img :src="arrowLeft" alt="" aria-hidden="true" />
        </button>
        <span class="sprint-mobile-module-bar__title">{{ props.mobileTitle }}</span>
      </div>
      <button
        type="button"
        class="sprint-mobile-info"
        aria-label="Informasi Pengajuan"
        @click="emit('info')"
      >
        <img :src="mobileInfo" alt="" aria-hidden="true" />
      </button>
    </div>
    <form v-else class="sprint-mobile-entry-search" role="search" @submit.prevent="submitSearch">
      <img :src="searchIcon" alt="" aria-hidden="true" />
      <input v-model="searchQuery" type="search" :placeholder="props.searchPlaceholder" aria-label="Cari pengajuan kredit atau dokumen" />
    </form>
    <div class="sprint-navbar__container">
      <!-- Left: SPRINT Brand Logo -->
      <button
        type="button"
        class="sprint-brand"
        title="Beranda SPRINT"
        aria-label="SPRINT Single UI"
        @click="handleBrandClick"
      >
        <img :src="sprintMark" class="sprint-logo-mark" alt="" aria-hidden="true" />
        <img :src="sprintWordmark" class="sprint-brand-wordmark" alt="SPRINT" />
      </button>

      <!-- Center: Global Search Input -->
      <div class="sprint-search-wrapper" role="search">
        <div class="sprint-search-input-group">
          <img :src="searchIcon" class="sprint-search-icon" alt="" aria-hidden="true" />
          <input
            v-model="searchQuery"
            type="text"
            class="sprint-search-input"
            :placeholder="props.searchPlaceholder"
            aria-label="Cari pengajuan kredit atau dokumen"
            @keydown.enter.prevent="submitSearch"
          />
        </div>
      </div>

      <!-- Right: Action Icons & User Profile -->
      <div class="sprint-nav-actions">
        <!-- History Action -->
        <div class="sprint-action-wrapper">
          <button
            type="button"
            class="sprint-action-btn"
            title="Riwayat Transaksi"
            aria-label="Lihat riwayat"
            :aria-expanded="activePopover === 'history'"
            @click="togglePopover('history')"
          >
            <img :src="historyIcon" class="sprint-action-icon" alt="" aria-hidden="true" />
            <span class="sprint-action-label">Riwayat</span>
          </button>
          <div v-if="activePopover === 'history'" class="sprint-dropdown-menu sprint-dropdown-menu--action" role="menu">
            <strong class="sprint-dropdown-title">Riwayat</strong>
            <button type="button" class="sprint-menu-item" role="menuitem" @click="goToPengajuan">Pengajuan Rahn terakhir</button>
          </div>
        </div>

        <!-- Notification Action with Badge -->
        <div class="sprint-action-wrapper">
          <button
            type="button"
            class="sprint-action-btn"
            title="Notifikasi Masuk (48 Baru)"
            aria-label="48 notifikasi belum dibaca"
            :aria-expanded="activePopover === 'notifications'"
            @click="togglePopover('notifications')"
          >
            <div class="notif-icon-box">
              <img :src="notificationIcon" class="sprint-action-icon" alt="" aria-hidden="true" />
              <span class="sprint-notif-badge">48</span>
            </div>
            <span class="sprint-action-label">Notifikasi</span>
          </button>
          <div v-if="activePopover === 'notifications'" class="sprint-dropdown-menu sprint-dropdown-menu--action" role="menu">
            <strong class="sprint-dropdown-title">Notifikasi</strong>
            <button type="button" class="sprint-menu-item" role="menuitem" @click="goToPengajuan">4 pengajuan Rahn menunggu diproses</button>
          </div>
        </div>

        <span class="sprint-divider" aria-hidden="true" />

        <!-- Dummy Toggle Auth Quick Switch -->
        <button
          v-if="props.showAuthToggle"
          type="button"
          class="sprint-auth-pill"
          :class="{ 'is-auth': authStore.isAuthenticated, 'is-guest': !authStore.isAuthenticated }"
          title="Toggle mode autentikasi frontend"
          @click="authStore.toggleAuth"
        >
          <span class="auth-dot" />
          <span>{{ authStore.isAuthenticated ? 'Auth 🔒' : 'Guest 🔓' }}</span>
        </button>

        <!-- User Profile Dropdown -->
        <div class="sprint-profile-wrapper">
          <button
            type="button"
            class="sprint-profile-trigger"
            :aria-expanded="isProfileOpen"
            aria-label="Menu profil pengguna"
            @click="togglePopover('profile')"
          >
            <div class="sprint-profile-text">
              <span class="sprint-user-name">THORIQ SADAD</span>
              <span class="sprint-user-role">{{ props.profileRole }}</span>
            </div>
            <img :src="chevronIcon" class="sprint-chevron" :class="{ 'is-open': isProfileOpen }" alt="" aria-hidden="true" />
          </button>

          <!-- Dropdown Card -->
          <div v-if="isProfileOpen" class="sprint-dropdown-menu" role="menu">
            <div class="sprint-dropdown-header">
              <strong class="text-dark">THORIQ SADAD</strong>
              <small class="text-muted">thoriq.sadad@pegadaian.co.id</small>
            </div>
            <hr class="sprint-menu-hr" />
            <button
              type="button"
              class="sprint-menu-item text-danger"
              role="menuitem"
              @click="handleLogout"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Keluar / Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <nav v-if="props.showMobileBottomNav" class="sprint-mobile-bottom-nav" aria-label="Navigasi utama">
      <button type="button" class="is-active" aria-current="page" @click="handleBrandClick">
        <img :src="sprintMark" class="sprint-bottom-nav-mark" alt="" aria-hidden="true" />
        <span>Beranda</span>
      </button>
      <button type="button" @click="togglePopover('history')">
        <img :src="mobileHistoryIdle" alt="" aria-hidden="true" />
        <span>Riwayat</span>
      </button>
      <button type="button" class="sprint-mobile-notification" @click="togglePopover('notifications')">
        <img :src="mobileNotificationIdle" alt="" aria-hidden="true" />
        <span class="sprint-notif-dot" />
        <span>Notifikasi</span>
      </button>
      <button type="button" @click="togglePopover('profile')">
        <img :src="mobileProfileIdle" alt="" aria-hidden="true" />
        <span>Profil</span>
      </button>
    </nav>
    <div v-if="props.showMobileBottomNav && activePopover" class="sprint-mobile-popover" role="dialog" aria-modal="false">
      <template v-if="activePopover === 'history'">
        <strong>Riwayat</strong>
        <button type="button" @click="goToPengajuan">Pengajuan Rahn terakhir</button>
      </template>
      <template v-else-if="activePopover === 'notifications'">
        <strong>Notifikasi</strong>
        <button type="button" @click="goToPengajuan">4 pengajuan Rahn menunggu diproses</button>
      </template>
      <template v-else>
        <strong>THORIQ SADAD</strong>
        <button type="button" @click="handleLogout">Keluar / Logout</button>
      </template>
    </div>
  </header>
</template>

<style scoped>
.sprint-navbar {
  width: 100%;
  height: 64px;
  background-color: var(--g-kit-broccoli-50);
  color: var(--g-kit-white);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 40, 32, 0.15);
}

.sprint-navbar--floating {
  width: min(calc(100% - 32px), 1152px);
  height: 76px;
  margin: 16px auto 0;
  border-radius: 16px;
  position: relative;
  top: auto;
  background-color: var(--g-kit-broccoli-50);
  background-size: cover;
  background-position: center;
  box-shadow: var(--bb-elevation-1);
  overflow: visible;
}

.sprint-navbar-pattern {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-size: cover;
  background-position: center;
  opacity: 0.2;
  pointer-events: none;
}

.sprint-navbar--floating .sprint-navbar__container {
  max-width: none;
  padding: 0 32px;
  gap: 24px;
  position: relative;
  z-index: 1;
}

.sprint-navbar--floating .sprint-brand { gap: 8px; }
.sprint-navbar--floating .sprint-logo-mark { width: 31px; height: 43px; }
.sprint-navbar--floating .sprint-brand-wordmark { width: 98px; height: 20px; object-fit: contain; }
.sprint-navbar--floating .sprint-search-wrapper { flex: 0 1 360px; max-width: 360px; }
.sprint-navbar--floating .sprint-search-input { height: 44px; border-radius: 6px; }
.sprint-navbar--floating .sprint-nav-actions { gap: 24px; }
.sprint-navbar--floating .sprint-action-btn { padding: 0; font-size: 16px; }
.sprint-navbar--floating .sprint-action-icon { width: 24px; height: 24px; }

@media (min-width: 901px) {
  .sprint-navbar--entry-layout {
    width: min(calc(100% - 32px), 1312px);
    border-radius: 12px;
  }

  .sprint-navbar--entry-layout .sprint-navbar__container {
    position: relative;
    display: block;
    padding: 0;
  }

  .sprint-navbar--entry-layout .sprint-brand {
    position: absolute;
    top: 8px;
    left: 32px;
    gap: 7.5px;
    padding: 8px;
  }

  .sprint-navbar--entry-layout .sprint-search-wrapper {
    position: absolute;
    top: 16px;
    left: 225px;
    width: min(547px, calc(100% - 700px));
    max-width: none;
    flex: none;
  }

  .sprint-navbar--entry-layout .sprint-search-icon {
    left: 12px;
    width: 24px;
    height: 24px;
  }

  .sprint-navbar--entry-layout .sprint-search-input {
    height: 44px;
    padding-left: 44px;
    border: 0;
    border-radius: 6px;
    background: var(--g-kit-black-10);
    font-size: 14px;
  }

  .sprint-navbar--entry-layout .sprint-nav-actions {
    position: absolute;
    top: 10px;
    left: min(812px, calc(100% - 466px));
    right: auto;
    width: max-content;
    height: 56px;
    gap: 24px;
  }

  .sprint-navbar--entry-layout .sprint-action-btn {
    font-size: 16px;
    line-height: 24px;
  }

  .sprint-navbar--entry-layout .sprint-profile-trigger {
    gap: 8px;
    padding: 0;
  }

  .sprint-navbar--entry-layout .sprint-profile-text {
    width: 170px;
    text-align: left;
  }

  .sprint-navbar--entry-layout .sprint-user-name {
    font-size: 14px;
    font-weight: var(--g-kit-font-weight-bold);
    letter-spacing: 0;
    line-height: 20px;
  }

  .sprint-navbar--entry-layout .sprint-user-role {
    color: var(--g-kit-white);
    font-size: 12px;
    line-height: 18px;
  }

  .sprint-navbar--entry-layout .sprint-notif-badge {
    top: 0;
    right: 0;
    width: 12px;
    height: 12px;
    padding: 0;
    border-radius: 50%;
    font-size: 0;
    line-height: 12px;
  }

  .sprint-navbar--entry-layout .sprint-divider {
    height: 44px;
  }

  .sprint-navbar--entry-layout .sprint-chevron {
    width: 24px;
    height: 24px;
  }
}

.sprint-navbar__container {
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

/* Brand */
.sprint-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  color: var(--g-kit-white);
  user-select: none;
}

.sprint-logo-mark {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
}

.sprint-brand-wordmark { width: 98px; height: 20px; object-fit: contain; }

/* Search */
.sprint-search-wrapper {
  flex: 1 1 auto;
  max-width: 480px;
}

.sprint-search-input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.sprint-search-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: var(--g-kit-black-60);
  pointer-events: none;
}

.sprint-search-input {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: var(--g-kit-white);
  color: var(--g-kit-black-80);
  padding: 0 16px 0 42px;
  font-size: 13px;
  outline: none;
  transition: all 0.2s ease;
}

.sprint-search-input:focus {
  border-color: var(--g-kit-lime-50);
  box-shadow: 0 0 0 3px rgba(0, 166, 81, 0.25);
}

.sprint-search-input::placeholder {
  color: var(--g-kit-black-50);
}

.sprint-mobile-entry-search,
.sprint-mobile-module-bar,
.sprint-mobile-bottom-nav,
.sprint-mobile-popover {
  display: none;
}

/* Nav Actions */
.sprint-nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sprint-action-wrapper {
  position: relative;
}

.sprint-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: var(--g-kit-white);
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.18s ease;
}

.sprint-action-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sprint-action-icon {
  width: 18px;
  height: 18px;
}

.notif-icon-box {
  position: relative;
  display: flex;
  align-items: center;
}

.sprint-notif-badge {
  position: absolute;
  top: -8px;
  right: -10px;
  background-color: var(--g-kit-red-50);
  color: var(--g-kit-white);
  font-size: 10px;
  font-weight: 800;
  padding: 1px 5px;
  border-radius: 9999px;
  line-height: 1.2;
}

.sprint-divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.25);
}

/* Dummy Auth Switch */
.sprint-auth-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sprint-auth-pill.is-auth {
  background: var(--g-kit-lime-50);
  color: var(--g-kit-white);
}

.sprint-auth-pill.is-guest {
  background: rgba(255, 255, 255, 0.2);
  color: var(--g-kit-white);
}

.auth-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* Profile */
.sprint-profile-wrapper {
  position: relative;
}

.sprint-profile-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: var(--g-kit-white);
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  text-align: right;
  transition: background-color 0.18s ease;
}

.sprint-profile-trigger:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sprint-profile-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.sprint-user-name {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.sprint-user-role {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.75);
}

.sprint-chevron {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.sprint-chevron.is-open {
  transform: rotate(180deg);
}

/* Dropdown */
.sprint-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 220px;
  background: var(--g-kit-white);
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--g-kit-black-20);
  padding: 8px;
  z-index: 1200;
}

.sprint-dropdown-menu--action {
  width: 264px;
}

.sprint-dropdown-title {
  display: block;
  padding: 8px;
  color: var(--g-kit-black-80);
  font-size: var(--g-kit-font-size-sigma);
  font-weight: var(--g-kit-font-weight-bold);
}

.sprint-dropdown-header {
  padding: 8px;
  display: flex;
  flex-direction: column;
}

.text-dark {
  color: var(--g-kit-black-80);
  font-size: 13px;
}

.text-muted {
  color: var(--g-kit-black-60);
  font-size: 11px;
}

.sprint-menu-hr {
  margin: 6px 0;
  border: 0;
  border-top: 1px solid var(--g-kit-black-20);
}

.sprint-menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease;
}

.sprint-menu-item:hover {
  background-color: var(--g-kit-black-10);
}

.text-danger {
  color: var(--g-kit-red-50);
}

@media (max-width: 900px) {
  .sprint-navbar--floating { width: calc(100% - 24px); height: 64px; margin-top: 12px; border-radius: 12px; }
  .sprint-navbar--floating .sprint-navbar__container { padding: 0 16px; gap: 14px; }
  .sprint-navbar--floating .sprint-nav-actions { gap: 14px; }
  .sprint-search-wrapper,
  .sprint-action-label,
  .sprint-user-role {
    display: none;
  }
}

@media (max-width: 767px) {
  .sprint-navbar--floating {
    width: 100%;
    height: 120px;
    margin: 0;
    border-radius: 0;
    box-shadow: none;
  }

  .sprint-navbar--floating .sprint-navbar__container {
    display: none;
  }

  .sprint-navbar-pattern {
    border-radius: 0;
    opacity: 0.2;
  }

  .sprint-mobile-entry-search {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    width: calc(100% - 32px);
    height: 48px;
    margin: 36px auto 0;
  }

  .sprint-mobile-entry-search img {
    position: absolute;
    left: 12px;
    width: 24px;
    height: 24px;
    pointer-events: none;
  }

  .sprint-mobile-entry-search input {
    width: 100%;
    height: 100%;
    padding: 0 16px 0 44px;
    border: 0;
    border-radius: 6px;
    color: var(--g-kit-black-80);
    background: var(--g-kit-black-10);
    font: inherit;
    font-size: var(--g-kit-font-size-sigma);
    outline: none;
  }

  .sprint-navbar--mobile-module {
    height: 58px;
    border-bottom: 1px solid #eeeeef;
  }

  .sprint-navbar--mobile-module .sprint-mobile-entry-search {
    display: none;
  }

  .sprint-mobile-module-bar {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 16px;
    color: var(--g-kit-white);
  }

  .sprint-mobile-module-bar__left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sprint-mobile-module-bar__title {
    color: var(--g-kit-white);
    font-size: 18px;
    font-weight: 800;
    line-height: 26px;
  }

  .sprint-mobile-back,
  .sprint-mobile-info {
    display: grid;
    width: 24px;
    height: 24px;
    padding: 0;
    border: 0;
    place-items: center;
    background: transparent;
    cursor: pointer;
  }

  .sprint-mobile-back img,
  .sprint-mobile-info img {
    width: 24px;
    height: 24px;
    filter: brightness(0) invert(1);
  }

  .sprint-mobile-bottom-nav {
    position: fixed;
    z-index: 1100;
    right: 8px;
    bottom: 8px;
    left: 8px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    height: 56px;
    border-radius: 8px;
    background: var(--g-kit-broccoli-50);
    box-shadow: var(--bb-elevation-1);
  }

  .sprint-mobile-bottom-nav button {
    position: relative;
    display: grid;
    justify-items: center;
    align-content: center;
    gap: 3px;
    padding: 6px 0 5px;
    border: 0;
    color: var(--g-kit-white);
    background: transparent;
    font: inherit;
    font-size: 12px;
    font-weight: var(--g-kit-font-weight-normal);
  }

  .sprint-mobile-bottom-nav button.is-active {
    color: #bfd730;
    font-weight: var(--g-kit-font-weight-bold);
  }

  .sprint-bottom-nav-mark {
    width: 17px;
    height: 24px;
    object-fit: contain;
  }

  .sprint-mobile-bottom-nav img {
    width: 24px;
    height: 24px;
  }

  .sprint-notif-dot {
    position: absolute;
    top: 6px;
    right: calc(50% - 15px);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--g-kit-red-50);
  }

  .sprint-mobile-popover {
    position: fixed;
    z-index: 1201;
    right: 12px;
    bottom: 72px;
    left: 12px;
    display: grid;
    gap: 8px;
    padding: 12px;
    border: 1px solid var(--g-kit-black-20);
    border-radius: 8px;
    color: var(--g-kit-black-80);
    background: var(--g-kit-white);
    box-shadow: var(--bb-elevation-1);
    font-size: var(--g-kit-font-size-sigma);
  }

  .sprint-mobile-popover strong {
    font-weight: var(--g-kit-font-weight-bold);
  }

  .sprint-mobile-popover button {
    min-height: 36px;
    padding: 8px;
    border: 0;
    border-radius: 4px;
    color: var(--g-kit-broccoli-50);
    background: var(--g-kit-black-10);
    font: inherit;
    font-weight: var(--g-kit-font-weight-bold);
    text-align: left;
  }
}
</style>
