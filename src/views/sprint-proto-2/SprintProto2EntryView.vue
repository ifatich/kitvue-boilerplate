<script setup lang="ts">
import '../../../sprint-proto-2/style.css'
import ServiceLauncherPage from '../../../sprint-proto-2/views/ServiceLauncherPage.vue'
import { getPrototypeRoleFromSession } from '@/services/authService'
import type { PrototypeRole } from '@/types/admin'

const roleIdByName: Record<PrototypeRole, 'kasir' | 'pinca' | 'penaksir'> = {
  Kasir: 'kasir',
  Pinca: 'pinca',
  Penaksir: 'penaksir',
  CRO: 'pinca',
}

const initialRole = roleIdByName[getPrototypeRoleFromSession() ?? 'Kasir']
</script>

<template>
  <ServiceLauncherPage :initial-role="initialRole" />
</template>
