<script setup lang="ts">
/**
 * @file App.vue
 * @description Root application component with global minimalist navbar and view outlet.
 */
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppNavbar from '@/components/shared/AppNavbar.vue'
import AppAlertHost from '@/components/shared/alert/AppAlertHost.vue'

const route = useRoute()
// Halaman SPRINT (Home Entry Point, Admin Base Container, Login) memiliki navbar sendiri
const isPublicPage = computed(() => {
  const p = route.path || (typeof window !== 'undefined' ? window.location.pathname : '')
  return p !== '/' && p !== '/entry' && !p.startsWith('/admin') && !p.startsWith('/dashboard') && !p.startsWith('/login')
})
</script>

<template>
  <div class="app-root">
    <AppNavbar v-if="isPublicPage" />
    <RouterView />
    <AppAlertHost />
  </div>
</template>

<style>
html,
body {
  font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f8faf9;
  color: #1a1a1a;
  margin: 0;
  padding: 0;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
}

#app,
.app-root {
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  min-height: 100vh;
}
</style>
