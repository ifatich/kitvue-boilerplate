<script setup lang="ts">
/**
 * @file SprintNavbar.vue
 * @description Official Pegadaian SPRINT Top Navigation Bar based on Figma Guideline Single UI (Node 1773:39151).
 * Features SPRINT branding, global search bar, history/notifications with badge, profile dropdown,
 * and integrated Dummy Auth toggle for convenient prototyping.
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const searchQuery = ref('')
const isProfileOpen = ref(false)

const handleBrandClick = () => {
  router.push('/')
}

const toggleProfile = () => {
  isProfileOpen.value = !isProfileOpen.value
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="sprint-navbar" role="banner">
    <div class="sprint-navbar__container">
      <!-- Left: SPRINT Brand Logo -->
      <button
        type="button"
        class="sprint-brand"
        title="Beranda SPRINT"
        aria-label="SPRINT Single UI"
        @click="handleBrandClick"
      >
        <svg class="sprint-logo-mark" viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <!-- SPRINT Geometric Emblem -->
          <rect width="36" height="36" rx="8" fill="#003429" />
          <path
            d="M8 24L18 8L28 24H20L18 19L16 24H8Z"
            fill="#E2B93B"
          />
          <path
            d="M13 24L18 14L23 24H19.5L18 20.5L16.5 24H13Z"
            fill="#00A651"
          />
        </svg>
        <span class="sprint-brand-text">SPRINT</span>
      </button>

      <!-- Center: Global Search Input -->
      <div class="sprint-search-wrapper" role="search">
        <div class="sprint-search-input-group">
          <svg class="sprint-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            class="sprint-search-input"
            placeholder="Cari (contoh: pengajuan kredit)"
            aria-label="Cari pengajuan kredit atau dokumen"
          />
        </div>
      </div>

      <!-- Right: Action Icons & User Profile -->
      <div class="sprint-nav-actions">
        <!-- History Action -->
        <button
          type="button"
          class="sprint-action-btn"
          title="Riwayat Transaksi"
          aria-label="Lihat riwayat"
        >
          <svg class="sprint-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
          </svg>
          <span class="sprint-action-label">Riwayat</span>
        </button>

        <!-- Notification Action with Badge -->
        <button
          type="button"
          class="sprint-action-btn"
          title="Notifikasi Masuk (48 Baru)"
          aria-label="48 notifikasi belum dibaca"
        >
          <div class="notif-icon-box">
            <svg class="sprint-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span class="sprint-notif-badge">48</span>
          </div>
          <span class="sprint-action-label">Notifikasi</span>
        </button>

        <span class="sprint-divider" aria-hidden="true" />

        <!-- Dummy Toggle Auth Quick Switch -->
        <button
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
            @click="toggleProfile"
          >
            <div class="sprint-profile-text">
              <span class="sprint-user-name">THORIQ SADAD</span>
              <span class="sprint-user-role">Pimpinan Cabang</span>
            </div>
            <svg class="sprint-chevron" :class="{ 'is-open': isProfileOpen }" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
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
  </header>
</template>

<style scoped>
.sprint-navbar {
  width: 100%;
  height: 64px;
  background-color: #004D43;
  color: #ffffff;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 40, 32, 0.15);
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
  color: #ffffff;
  user-select: none;
}

.sprint-logo-mark {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
}

.sprint-brand-text {
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #ffffff;
}

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
  color: #64748b;
  pointer-events: none;
}

.sprint-search-input {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: #ffffff;
  color: #1e293b;
  padding: 0 16px 0 42px;
  font-size: 13px;
  outline: none;
  transition: all 0.2s ease;
}

.sprint-search-input:focus {
  border-color: #00A651;
  box-shadow: 0 0 0 3px rgba(0, 166, 81, 0.25);
}

.sprint-search-input::placeholder {
  color: #94a3b8;
}

/* Nav Actions */
.sprint-nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sprint-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: #ffffff;
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
  background-color: #ef4444;
  color: #ffffff;
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
  background: #10b981;
  color: #ffffff;
}

.sprint-auth-pill.is-guest {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
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
  color: #ffffff;
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
  width: 18px;
  height: 18px;
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
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  padding: 8px;
  z-index: 1010;
}

.sprint-dropdown-header {
  padding: 8px;
  display: flex;
  flex-direction: column;
}

.text-dark {
  color: #0f172a;
  font-size: 13px;
}

.text-muted {
  color: #64748b;
  font-size: 11px;
}

.sprint-menu-hr {
  margin: 6px 0;
  border: 0;
  border-top: 1px solid #e2e8f0;
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
  background-color: #f1f5f9;
}

.text-danger {
  color: #ef4444;
}

@media (max-width: 900px) {
  .sprint-search-wrapper,
  .sprint-action-label,
  .sprint-user-role {
    display: none;
  }
}
</style>
