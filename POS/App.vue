<script setup lang="ts">
import { RouterView } from 'vue-router'
import TaskSuccessModalHost from '../src/components/shared/modal/TaskSuccessModalHost.vue'
</script>

<template>
  <RouterView />
  <TaskSuccessModalHost />
</template>
