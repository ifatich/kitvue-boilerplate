<script setup lang="ts">
/**
 * PembayaranMenuPage.vue
 *
 * SPRINT POS - Menu Entry Point "Bayar & Beli"
 * Conforms to Figma Node 484-13592 (Homescreen 3).
 *
 * Provides service categorization:
 * 1. Layanan Pegadaian (Kirim Uang, Bayar Gadai, Bayar Tagihan)
 * 2. Top Up (Pulsa, e-Wallet)
 * 3. Layanan Publik (Listrik PLN, PDAM, BPJS Kesehatan)
 *
 * Clicking "Bayar Gadai" navigates to "/pembayaran-gadai".
 */
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PosHeader from '../components/PosHeader.vue'
import PosSidebar, { type PosNavLabel } from '../components/PosSidebar.vue'
import { usePosSidebar } from '../composables/usePosSidebar'

const router = useRouter()
const route = useRoute()
const routePrefix = route.path.startsWith('/pos') ? '/pos' : ''
const activeItem = ref<PosNavLabel>('Pembayaran')
const { isCollapsed, isMobile, isOpen, menuExpanded, toggle, close } = usePosSidebar()
const announcement = ref('')
let announcementTimeout: ReturnType<typeof setTimeout> | undefined

function announce(message: string) {
  announcement.value = message
  if (announcementTimeout) clearTimeout(announcementTimeout)
  announcementTimeout = setTimeout(() => {
    announcement.value = ''
  }, 2800)
}

function selectNavigation(item: PosNavLabel) {
  close()
  if (item === 'Dashboard') {
    void router.push(routePrefix || '/')
    return
  }
  if (item === 'Pembayaran') {
    return
  }
  announce(`${item} belum tersedia pada pratinjau POS ini.`)
}

function handleServiceClick(serviceName: string) {
  if (serviceName === 'Bayar Gadai') {
    void router.push(`${routePrefix}/pembayaran-gadai`)
    return
  }
  announce(`Layanan ${serviceName} belum tersedia pada pratinjau POS ini.`)
}

interface ServiceItem {
  id: string
  labelLine1: string
  labelLine2?: string
  fullLabel: string
  route?: string
  testId?: string
}

interface ServiceSection {
  title: string
  items: ServiceItem[]
}

const sections: ServiceSection[] = [
  {
    title: 'Layanan Pegadaian',
    items: [
      {
        id: 'kirim-uang',
        labelLine1: 'Kirim Uang',
        labelLine2: 'Western Union',
        fullLabel: 'Kirim Uang Western Union',
        testId: 'service-kirim-uang',
      },
      {
        id: 'bayar-gadai',
        labelLine1: 'Bayar',
        labelLine2: 'Gadai',
        fullLabel: 'Bayar Gadai',
        route: '/pembayaran-gadai',
        testId: 'service-bayar-gadai',
      },
      {
        id: 'bayar-tagihan',
        labelLine1: 'Bayar',
        labelLine2: 'Tagihan',
        fullLabel: 'Bayar Tagihan',
        testId: 'service-bayar-tagihan',
      },
    ],
  },
  {
    title: 'Top Up',
    items: [
      {
        id: 'pulsa',
        labelLine1: 'Pulsa',
        fullLabel: 'Pulsa',
        testId: 'service-pulsa',
      },
      {
        id: 'ewallet',
        labelLine1: 'e-Wallet',
        fullLabel: 'e-Wallet',
        testId: 'service-ewallet',
      },
    ],
  },
  {
    title: 'Layanan Publik',
    items: [
      {
        id: 'listrik',
        labelLine1: 'Listrik',
        labelLine2: 'PLN',
        fullLabel: 'Listrik PLN',
        testId: 'service-listrik',
      },
      {
        id: 'pdam',
        labelLine1: 'PDAM',
        fullLabel: 'PDAM',
        testId: 'service-pdam',
      },
      {
        id: 'bpjs',
        labelLine1: 'BPJS',
        labelLine2: 'Kesehatan',
        fullLabel: 'BPJS Kesehatan',
        testId: 'service-bpjs',
      },
    ],
  },
]
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

    <section class="pos-main-panel pos-menu-panel" aria-label="Menu Pembayaran dan Pembelian">
      <div class="pos-menu-view">
        <header class="pos-menu-view__header">
          <h1 class="pos-menu-view__title">Bayar &amp; Beli</h1>
        </header>

        <div class="pos-menu-wrapper">
          <div
            v-for="(section, idx) in sections"
            :key="section.title"
            class="pos-menu-section"
          >
            <!-- Section Divider between items -->
            <hr v-if="idx > 0" class="pos-menu-divider" aria-hidden="true" />

            <div class="pos-menu-section__header">
              <h2 class="pos-menu-section__title">{{ section.title }}</h2>
            </div>

            <div class="pos-menu-grid">
              <button
                v-for="item in section.items"
                :key="item.id"
                type="button"
                class="pos-menu-item"
                :class="{ 'pos-menu-item--highlight': item.route }"
                :data-test="item.testId"
                :aria-label="item.fullLabel"
                @click="handleServiceClick(item.fullLabel)"
              >
                <div class="pos-menu-item__icon-wrapper" aria-hidden="true">
                  <!-- Kirim Uang Western Union -->
                  <svg
                    v-if="item.id === 'kirim-uang'"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    class="pos-menu-item__svg"
                  >
                    <rect x="2" y="5" width="20" height="14" rx="3" fill="var(--g-kit-lime-50)" />
                    <path d="M2 9h20" stroke="var(--g-kit-white)" stroke-width="1.5" />
                    <circle cx="16" cy="14" r="2.5" fill="var(--g-kit-gold-hazel)" />
                    <path d="M6 14h4" stroke="var(--g-kit-white)" stroke-width="1.5" stroke-linecap="round" />
                  </svg>

                  <!-- Bayar Gadai -->
                  <svg
                    v-else-if="item.id === 'bayar-gadai'"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    class="pos-menu-item__svg"
                  >
                    <path d="M2 13.5h7l3-3h6a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-4l-3 3H2v-5Z" fill="var(--g-kit-lime-50)" fill-opacity="0.18" />
                    <path d="M1 14h6.5l3.5-3.5h7a2 2 0 0 1 2 2v.5a2 2 0 0 1-2 2h-4.5l-3 3H1v-4Z" stroke="var(--g-kit-lime-50)" stroke-width="1.6" stroke-linejoin="round" />
                    <rect x="13" y="4" width="9" height="6" rx="1.5" fill="var(--g-kit-lime-50)" />
                    <circle cx="16" cy="7" r="1" fill="var(--g-kit-white)" />
                  </svg>

                  <!-- Bayar Tagihan -->
                  <svg
                    v-else-if="item.id === 'bayar-tagihan'"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    class="pos-menu-item__svg"
                  >
                    <rect x="5" y="2" width="14" height="20" rx="2" fill="var(--g-kit-lime-50)" fill-opacity="0.15" />
                    <rect x="5" y="2" width="14" height="20" rx="2" stroke="var(--g-kit-lime-50)" stroke-width="1.6" />
                    <path d="M8 7h8M8 11h8M8 15h5" stroke="var(--g-kit-lime-50)" stroke-width="1.6" stroke-linecap="round" />
                    <circle cx="15.5" cy="15.5" r="2" fill="var(--g-kit-lime-50)" />
                    <path d="M14.5 15.5l.7.7 1.5-1.5" stroke="var(--g-kit-white)" stroke-width="1.2" stroke-linecap="round" />
                  </svg>

                  <!-- Pulsa -->
                  <svg
                    v-else-if="item.id === 'pulsa'"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    class="pos-menu-item__svg"
                  >
                    <rect x="6" y="2" width="12" height="20" rx="2.5" stroke="var(--g-kit-lime-50)" stroke-width="1.6" fill="var(--g-kit-lime-50)" fill-opacity="0.12" />
                    <circle cx="12" cy="18" r="1" fill="var(--g-kit-lime-50)" />
                    <circle cx="16" cy="14" r="4.5" fill="var(--g-kit-gold-hazel)" stroke="var(--g-kit-white)" stroke-width="1" />
                    <text x="16" y="16.5" font-size="5" font-weight="800" text-anchor="middle" fill="var(--g-kit-black-80)" font-family="Nunito Sans, sans-serif">Rp</text>
                  </svg>

                  <!-- e-Wallet -->
                  <svg
                    v-else-if="item.id === 'ewallet'"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    class="pos-menu-item__svg"
                  >
                    <rect x="2" y="6" width="20" height="14" rx="2.5" fill="var(--g-kit-lime-50)" />
                    <path d="M17 12a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" fill="var(--g-kit-white)" />
                    <path d="M15 3.5a5 5 0 0 1 5 5M17.5 5.5a2.5 2.5 0 0 1 2.5 2.5" stroke="var(--g-kit-lime-50)" stroke-width="1.5" stroke-linecap="round" />
                  </svg>

                  <!-- Listrik PLN -->
                  <svg
                    v-else-if="item.id === 'listrik'"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    class="pos-menu-item__svg"
                  >
                    <rect x="5" y="3" width="14" height="18" rx="3" fill="var(--g-kit-lime-50)" />
                    <path d="M12.5 6L8.5 13h4.5l-1.5 5 5-7h-4.5l1.5-5Z" fill="var(--g-kit-yellow-50)" stroke="var(--g-kit-white)" stroke-width="0.8" stroke-linejoin="round" />
                  </svg>

                  <!-- PDAM -->
                  <svg
                    v-else-if="item.id === 'pdam'"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    class="pos-menu-item__svg"
                  >
                    <path d="M12 2.5C12 2.5 6 9.5 6 13.5a6 6 0 0 0 12 0c0-4-6-11-6-11Z" fill="var(--g-kit-lime-50)" />
                    <path d="M5 19c1.2-1 2.8-1 4 0s2.8 1 4 0 2.8-1 4 0 2.8 1 4 0" stroke="var(--g-kit-gold-hazel)" stroke-width="1.8" stroke-linecap="round" fill="none" />
                    <path d="M5 21.5c1.2-1 2.8-1 4 0s2.8 1 4 0 2.8-1 4 0 2.8 1 4 0" stroke="var(--g-kit-gold-hazel)" stroke-width="1.8" stroke-linecap="round" fill="none" />
                  </svg>

                  <!-- BPJS Kesehatan -->
                  <svg
                    v-else-if="item.id === 'bpjs'"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    class="pos-menu-item__svg"
                  >
                    <path d="M12 2L4 5.5v6.2c0 5.2 3.4 10 8 11.3 4.6-1.3 8-6.1 8-11.3V5.5L12 2Z" fill="var(--g-kit-lime-50)" />
                    <path d="M12 7.5v7M8.5 11h7" stroke="var(--g-kit-white)" stroke-width="2.2" stroke-linecap="round" />
                  </svg>
                </div>

                <div class="pos-menu-item__label">
                  <span>{{ item.labelLine1 }}</span>
                  <span v-if="item.labelLine2">{{ item.labelLine2 }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Accessibility Announcement Toast -->
    <div v-if="announcement" class="pos-announcement" role="status" aria-live="polite">
      {{ announcement }}
    </div>
  </main>
</template>

<style scoped>
.pos-menu-panel {
  background: var(--g-kit-white);
  border-radius: 24px;
  padding: 24px;
}

.pos-menu-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.pos-menu-view__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.pos-menu-view__title {
  margin: 0;
  font-family: var(--g-kit-font-family);
  font-size: 18px;
  font-weight: 700;
  line-height: 26px;
  color: var(--g-kit-black-80);
}

.pos-menu-wrapper {
  display: flex;
  flex-direction: column;
  background: var(--g-kit-black-10);
  border-radius: 24px;
  padding: 24px 16px;
  width: 100%;
}

.pos-menu-divider {
  width: 100%;
  height: 1px;
  margin: 24px 0;
  border: 0;
  background-color: var(--g-kit-black-20);
}

.pos-menu-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.pos-menu-section__header {
  padding: 0 16px;
}

.pos-menu-section__title {
  margin: 0;
  font-family: var(--g-kit-font-family);
  font-size: 16px;
  font-weight: var(--g-kit-font-weight-normal);
  line-height: 24px;
  color: var(--g-kit-black-80);
}

.pos-menu-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
}

.pos-menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 200px;
  min-width: 140px;
  padding: 8px;
  border: 0;
  background: transparent;
  cursor: pointer;
  border-radius: 16px;
  transition: transform 0.18s ease, background-color 0.18s ease;
}

.pos-menu-item:hover {
  transform: translateY(-2px);
  background-color: rgba(0, 0, 0, 0.02);
}

.pos-menu-item:focus-visible {
  outline: 2px solid var(--g-kit-emerald-50);
  outline-offset: 2px;
}

.pos-menu-item__icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background: var(--g-kit-white);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.18s ease;
}

.pos-menu-item:hover .pos-menu-item__icon-wrapper {
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.pos-menu-item__svg {
  display: block;
}

.pos-menu-item__label {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-family: var(--g-kit-font-family);
  font-size: 12px;
  font-weight: var(--g-kit-font-weight-normal);
  line-height: 18px;
  color: var(--g-kit-black-80);
}

@media (max-width: 1199px) {
  .pos-menu-item {
    width: calc(33.333% - 11px);
    min-width: 100px;
  }
}

@media (max-width: 640px) {
  .pos-menu-item {
    width: calc(50% - 8px);
  }
}
</style>
