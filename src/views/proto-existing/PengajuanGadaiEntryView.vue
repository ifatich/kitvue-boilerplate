<script setup lang="ts">
import { computed } from 'vue'
import SprintNavbar from '@/components/shared/admin-layout/SprintNavbar.vue'
import { getPrototypeRoleFromSession } from '@/services/authService'
import pengajuanGadaiIconAsset from './assets/pengajuan-gadai.svg'
import PengajuanGadaiDummyView from './PengajuanGadaiDummyView.vue'

const profileRole = computed(() => {
  const role = getPrototypeRoleFromSession()
  return role === 'Pinca' ? 'Pimpinan Cabang / Pinca' : role ?? 'Penaksir'
})

const searchItems = [
  {
    group: 'Pinjaman Gadai',
    label: 'Pengajuan Gadai',
    icon: pengajuanGadaiIconAsset as unknown as string,
    to: '/proto-existing/pengajuan-gadai',
  },
]
</script>

<template>
  <div class="pengajuan-gadai-entry">
    <SprintNavbar
      embedded
      entry-layout
      :profile-role="profileRole"
      :show-auth-toggle="false"
      :show-mobile-bottom-nav="true"
      home-to="/proto-existing"
      search-placeholder="Cari (contoh: Pengajuan Gadai/Rahn)"
      :search-items="searchItems"
    />
    <PengajuanGadaiDummyView variant="existing" />
  </div>
</template>

<style scoped>
.pengajuan-gadai-entry {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}
</style>
