<script setup lang="ts">
/**
 * @file App.vue
 * @description Root application component with view outlet and global alert host.
 */
import { RouterView } from 'vue-router'
import AppAlertHost from '@/components/shared/alert/AppAlertHost.vue'
</script>

<template>
  <div class="app-root">
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
  min-height: 100vh;
  min-height: 100dvh;
}

#app,
.app-root {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  min-height: 100vh;
  min-height: 100dvh;
}
</style>
