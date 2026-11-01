<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PosGoldCard from './components/PosGoldCard.vue'
import PosHeader from './components/PosHeader.vue'
import PosMetricCard from './components/PosMetricCard.vue'
import PosSidebar, { type PosNavLabel } from './components/PosSidebar.vue'
import PosWeeklyChart from './components/PosWeeklyChart.vue'
import { usePosSidebar } from './composables/usePosSidebar'

const activeItem = ref<PosNavLabel>('Dashboard')
const router = useRouter()
const { isCollapsed, isMobile, isOpen, menuExpanded, toggle, close } = usePosSidebar()
const announcement = ref('')
let announcementTimeout: ReturnType<typeof setTimeout> | undefined

const metrics = [
  { label: 'Pendapatan', value: '5.000.000', detail: ['Dari', '24 transaksi'], currency: true },
  { label: 'Transaksi selesai', value: '24', detail: ['18 pembayaran', '6 pelunasan'] },
  { label: 'Saldo Kas', value: '8.750.000', detail: ['Modal awal', 'Rp20.000.000'], currency: true },
]

function announce(message: string) {
  announcement.value = message
  if (announcementTimeout) clearTimeout(announcementTimeout)
  announcementTimeout = setTimeout(() => {
    announcement.value = ''
  }, 2800)
}

function selectNavigation(item: PosNavLabel) {
  close()
  activeItem.value = 'Dashboard'
  if (item === 'Pembayaran') {
    void router.push('/pembayaran')
    return
  }
  if (item !== 'Dashboard') announce(`${item} belum tersedia pada pratinjau POS ini.`)
}

function handleGoldAction(action: 'Beli' | 'Jual') {
  announce(`Simulasi ${action.toLowerCase()} emas dipilih. Layanan POS belum terhubung.`)
}
</script>

<template>
  <main
    id="pos-root"
    class="pos-canvas"
    :class="{
      'pos-canvas--sidebar-collapsed': isCollapsed,
      'pos-canvas--sidebar-open': isOpen,
    }"
  >
    <PosHeader
      :menu-expanded="menuExpanded"
      @menu="toggle"
      @activity="announce('Aktivitas belum tersedia pada pratinjau POS ini.')"
    />
    <PosSidebar
      :active-item="activeItem"
      :collapsed="isCollapsed"
      :open="isOpen"
      :is-mobile="isMobile"
      @select="selectNavigation"
      @close="close"
    />

    <section class="pos-main-panel" aria-label="Dashboard POS">
      <div class="pos-dashboard">
        <div class="pos-dashboard__summary">
          <div class="pos-dashboard__heading">
            <h1>Pencapaian Hari Ini</h1>
            <button
              class="pos-refresh"
              type="button"
              aria-label="Perbarui ringkasan"
              @click="announce('Ringkasan contoh diperbarui.')"
            >
              <span>Last updated on 26/10/2026, 09.00 AM</span>
              <img src="./assets/figma/refresh.svg" alt="" width="16" height="16" />
            </button>
          </div>
          <div class="pos-dashboard__metrics">
            <PosMetricCard
              v-for="metric in metrics"
              :key="metric.label"
              v-bind="metric"
            />
          </div>
        </div>

        <div class="pos-dashboard__cards">
          <PosGoldCard @action="handleGoldAction" />
          <PosWeeklyChart />
        </div>
      </div>
    </section>

    <div v-if="announcement" class="pos-announcement" role="status" aria-live="polite">
      {{ announcement }}
    </div>
  </main>
</template>
