<script setup lang="ts">
import '../../../sprint-proto-2/style.css'
import ServiceLauncherPage from '../../../sprint-proto-2/views/ServiceLauncherPage.vue'
import { getPrototypeRoleFromSession } from '@/services/authService'

const roleIdByName = {
  Kasir: 'kasir',
  Pinca: 'pinca',
  Penaksir: 'penaksir',
} as const

const initialRole = roleIdByName[getPrototypeRoleFromSession() ?? 'Kasir']
</script>

<template>
  <ServiceLauncherPage :initial-role="initialRole" />
</template>
