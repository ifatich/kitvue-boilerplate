<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SprintNavbar from '@/components/shared/admin-layout/SprintNavbar.vue'
import { getPrototypeRoleFromSession } from '@/services/authService'
import { useTaskSuccessModal } from '@/composables/useTaskSuccessModal'
import pengajuanGadaiIconAsset from './assets/pengajuan-gadai.svg'
import PengajuanGadaiDummyView from './PengajuanGadaiDummyView.vue'

const router = useRouter()
const route = useRoute()
const { showTaskSuccessModal } = useTaskSuccessModal()

let timer: ReturnType<typeof setTimeout> | null = null

const profileRole = computed(() => {
  const role = getPrototypeRoleFromSession()
  return role === 'Pinca' ? 'Pimpinan Cabang / Pinca' : role ?? 'Penaksir'
})

const getEffectiveNextView = () => {
  const queryVal = route.query.nextView as string | undefined
  if (queryVal) return queryVal
  if (typeof window !== 'undefined' && window.sessionStorage) {
    return window.sessionStorage.getItem('sprint_research_next_view') ?? undefined
  }
  return undefined
}

const returnToTaskMenu = () => {
  const team = (route.query.team as string | undefined) || (typeof window !== 'undefined' ? window.sessionStorage?.getItem('sprint_research_team') : null) || 'team-1'
  const cp = (route.query.cp as string | undefined) || (typeof window !== 'undefined' ? window.sessionStorage?.getItem('sprint_research_cp') : null) || 'mks-cbg-talasalapang'
  const role = (route.query.role as string | undefined) || (typeof window !== 'undefined' ? window.sessionStorage?.getItem('sprint_research_role') : null) || 'Pinca'

  void router.push({
    name: 'entry-point-tasks',
    query: { team, cp, role },
  })
}

const handleExistingSearchSuccess = () => {
  const nextView = getEffectiveNextView()
  const team = (route.query.team as string | undefined) || (typeof window !== 'undefined' ? window.sessionStorage?.getItem('sprint_research_team') : null) || 'team-1'
  const cp = (route.query.cp as string | undefined) || (typeof window !== 'undefined' ? window.sessionStorage?.getItem('sprint_research_cp') : null) || 'mks-cbg-talasalapang'
  const role = (route.query.role as string | undefined) || (typeof window !== 'undefined' ? window.sessionStorage?.getItem('sprint_research_role') : null) || 'Pinca'

  if (nextView === 'proto-1') {
    showTaskSuccessModal({
      title: 'Task Selesai',
      taskName: 'Beranda Eksisting (Pengajuan Gadai)',
      message: 'Selamat, Anda berhasil menemukan menu Pengajuan Gadai! Lanjut ke Beranda Opsi 1 untuk membandingkan tampilan.',
      confirmLabel: 'Lanjut ke Beranda Opsi 1',
      onConfirm: () => {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.setItem('sprint_research_next_view', 'proto-2')
          window.sessionStorage.setItem('sprint_research_from_compare', 'proto-existing')
        }
        void router.push({
          path: '/sprint-proto-1',
          query: {
            team,
            cp,
            role,
            nextView: 'proto-2',
            fromCompare: 'proto-existing',
          },
        })
      },
    })
  } else if (nextView === 'proto-2') {
    showTaskSuccessModal({
      title: 'Task Selesai',
      taskName: 'Beranda Eksisting (Pengajuan Gadai)',
      message: 'Selamat, Anda berhasil menemukan menu Pengajuan Gadai! Lanjut ke Beranda Opsi 2 untuk membandingkan tampilan.',
      confirmLabel: 'Lanjut ke Beranda Opsi 2',
      onConfirm: () => {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.setItem('sprint_research_next_view', 'proto-1')
          window.sessionStorage.setItem('sprint_research_from_compare', 'proto-existing')
        }
        void router.push({
          path: '/sprint-proto-2',
          query: {
            team,
            cp,
            role,
            nextView: 'proto-1',
            fromCompare: 'proto-existing',
          },
        })
      },
    })
  } else {
    showTaskSuccessModal({
      title: 'Task Selesai',
      taskName: 'Beranda Eksisting (Pengajuan Gadai)',
      message: 'Selamat, Anda berhasil menemukan menu Pengajuan Gadai!',
      confirmLabel: 'Kembali ke Menu Task',
      onConfirm: returnToTaskMenu,
    })
  }
}

onMounted(() => {
  timer = setTimeout(() => {
    handleExistingSearchSuccess()
  }, 5000)
})

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
})

const homeToUrl = computed(() => {
  const query = new URLSearchParams()
  Object.entries(route.query).forEach(([k, v]) => {
    if (typeof v === 'string') query.set(k, v)
    else if (Array.isArray(v)) v.forEach((sub) => sub && query.append(k, sub))
  })
  const qs = query.toString()
  return qs ? `/proto-existing?${qs}` : '/proto-existing'
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
      fixed
      :profile-role="profileRole"
      :show-auth-toggle="false"
      :show-mobile-bottom-nav="true"
      :home-to="homeToUrl"
      search-placeholder="Cari (contoh: Pengajuan Gadai/Rahn)"
      :search-items="searchItems"
    />
    <PengajuanGadaiDummyView variant="existing" />
  </div>
</template>

<style scoped>
.pengajuan-gadai-entry {
  --sprint-navbar-mask-bg: var(--g-kit-white);
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}
</style>
