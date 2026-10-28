<script setup lang="ts">
/**
 * @file AppNavbar.vue
 * @description Standard corporate navbar for Kitvue Starter projects.
 * Features StarterLogo, navigation links, and an interactive Dummy Toggle Auth switch
 * for instantly simulating authenticated vs guest states in the pure frontend layer.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { StarterLogo } from '@/components/shared/logo'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const isScrolled = ref<boolean>(false)

const handleScroll = (): void => {
  const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
  isScrolled.value = scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleBrandClick = (): void => {
  router.push('/')
}

const handleToggleAuth = (): void => {
  authStore.toggleAuth()
}

const handleCtaClick = (): void => {
  if (authStore.isAuthenticated) {
    router.push('/admin')
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <header
    class="app-navbar"
    :class="{ 'is-scrolled': isScrolled }"
    role="banner"
  >
    <div class="navbar-container">
      <!-- Brand Logo -->
      <button
        type="button"
        class="navbar-brand-btn"
        title="Kembali ke Beranda"
        aria-label="Kitvue Starter Beranda"
        @click="handleBrandClick"
      >
        <StarterLogo variant="landscape" :height="38" title="Kitvue" subtitle="Starter Template" />
      </button>

      <!-- Nav Links -->
      <nav class="navbar-nav" aria-label="Navigasi Utama">
        <ul class="nav-links-list" role="menubar">
          <li role="none">
            <router-link
              to="/"
              class="nav-link-btn"
              active-class="is-active"
              role="menuitem"
            >
              Beranda
            </router-link>
          </li>
          <li role="none">
            <router-link
              to="/admin"
              class="nav-link-btn"
              active-class="is-active"
              role="menuitem"
            >
              Admin Dashboard
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Actions Area: Dummy Toggle Auth + CTA -->
      <div class="navbar-actions">
        <!-- Dummy Auth Toggle Switch -->
        <button
          type="button"
          class="auth-toggle-pill"
          :class="{ 'is-auth': authStore.isAuthenticated, 'is-guest': !authStore.isAuthenticated }"
          :title="`Mode Auth: ${authStore.isAuthenticated ? 'Logged In (Admin)' : 'Guest (Public)'}. Klik untuk toggle.`"
          aria-label="Toggle status autentikasi frontend"
          @click="handleToggleAuth"
        >
          <span class="auth-dot" aria-hidden="true" />
          <span class="auth-label">
            {{ authStore.isAuthenticated ? 'Logged In (Admin)' : 'Guest (Public)' }}
          </span>
          <span class="auth-badge-icon">
            <svg v-if="authStore.isAuthenticated" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 11V7a5 5 0 0 1 9.9-1" />
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            </svg>
          </span>
        </button>

        <!-- Primary CTA -->
        <button
          type="button"
          class="nav-cta-btn"
          :title="authStore.isAuthenticated ? 'Buka Admin Portal' : 'Login ke Dashboard'"
          @click="handleCtaClick"
        >
          <span>{{ authStore.isAuthenticated ? 'Buka Portal Admin' : 'Masuk / Login' }}</span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--g-kit-black-20, #e2e8f0);
  transition: all 0.25s ease;
}

.app-navbar.is-scrolled {
  background: rgba(255, 255, 255, 0.98);
  border-bottom-color: #cbd5e1;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.navbar-container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
  height: 68px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

/* Brand Button */
.navbar-brand-btn {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: opacity 0.2s ease;
}

.navbar-brand-btn:hover {
  opacity: 0.9;
}

.navbar-brand-btn:focus-visible {
  outline: 2px solid var(--g-kit-broccoli-50, #004d43);
  outline-offset: 4px;
  border-radius: 6px;
}

/* Nav Menu */
.navbar-nav {
  display: flex;
  align-items: center;
}

.nav-links-list {
  display: flex;
  align-items: center;
  gap: 6px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link-btn {
  position: relative;
  background: transparent;
  border: none;
  font-size: var(--g-kit-font-size-sigma, 14px);
  line-height: 20px;
  font-weight: 600;
  color: var(--g-kit-black-70, #475569);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.18s ease, background-color 0.18s ease;
}

.nav-link-btn:hover {
  color: var(--g-kit-broccoli-50, #004d43);
  background: rgba(0, 77, 67, 0.05);
}

.nav-link-btn.is-active {
  color: var(--g-kit-broccoli-50, #004d43);
  background: rgba(0, 77, 67, 0.08);
  font-weight: 700;
}

/* Actions */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Dummy Auth Toggle Pill */
.auth-toggle-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  user-select: none;
}

.auth-toggle-pill.is-auth {
  background: #ecfdf5;
  color: #065f46;
  border-color: #a7f3d0;
}

.auth-toggle-pill.is-auth:hover {
  background: #d1fae5;
  border-color: #6ee7b7;
}

.auth-toggle-pill.is-guest {
  background: #f1f5f9;
  color: #475569;
  border-color: #cbd5e1;
}

.auth-toggle-pill.is-guest:hover {
  background: #e2e8f0;
  border-color: #94a3b8;
}

.auth-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.auth-toggle-pill.is-auth .auth-dot {
  background: #10b981;
  box-shadow: 0 0 6px #10b981;
}

.auth-toggle-pill.is-guest .auth-dot {
  background: #94a3b8;
}

.auth-badge-icon {
  display: inline-flex;
  width: 14px;
  height: 14px;
}

.auth-badge-icon svg {
  width: 100%;
  height: 100%;
}

/* CTA */
.nav-cta-btn {
  display: inline-flex;
  align-items: center;
  background: var(--g-kit-broccoli-50, #004d43);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: var(--g-kit-font-size-sigma, 14px);
  line-height: 20px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 2px 8px rgba(0, 77, 67, 0.2);
}

.nav-cta-btn:hover {
  background: var(--g-kit-broccoli-70, #07281c);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(0, 77, 67, 0.28);
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0 16px;
    height: 60px;
  }

  .navbar-nav {
    display: none;
  }

  .auth-label {
    display: none;
  }

  .nav-cta-btn {
    padding: 7px 12px;
    font-size: 12px;
  }
}
</style>
