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
    void router.push({
      path: routePrefix || '/',
      query: route.query,
    })
    return
  }
  if (item === 'Pembayaran') {
    return
  }
  announce(`${item} belum tersedia pada pratinjau POS ini.`)
}

function handleServiceClick(serviceName: string) {
  if (serviceName === 'Bayar Gadai') {
    void router.push({
      path: `${routePrefix}/pembayaran-gadai`,
      query: route.query,
    })
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
                    <g transform="translate(1.9517, 6.7708) scale(0.59865)">
                      <path d="M32.09 3.08C31.94 1.48 30.68 0.32 29.11 0.23C27.1 0.12 23.86 0 19.21 0C14.56 0 11.33 0.12 9.31002 0.23C7.75002 0.32 6.49002 1.47 6.33002 3.08C6.31002 3.31 6.29002 3.57 6.27002 3.83H10.24C11.34 3.83 12.24 4.73 12.24 5.83C12.24 6.68 11.71 7.4 10.97 7.69C11.71 7.98 12.24 8.7 12.24 9.55C12.24 10.5 11.57 11.3 10.68 11.5C11.57 11.7 12.24 12.5 12.24 13.45C12.24 14.55 11.34 15.45 10.24 15.45H6.43002C6.78002 16.78 7.92002 17.7 9.31002 17.78C11.32 17.89 14.56 18.01 19.21 18.01C23.86 18.01 27.09 17.89 29.11 17.78C30.67 17.69 31.93 16.54 32.09 14.93C32.22 13.55 32.34 11.6 32.34 9.01C32.34 6.42 32.22 4.47 32.09 3.09V3.08Z" fill="#00AB4E"/>
                      <path d="M25.97 8.99996C25.97 8.28996 26.55 7.70996 27.26 7.70996H27.9C28.61 7.70996 29.19 8.28996 29.19 8.99996C29.19 9.70996 28.61 10.29 27.9 10.29H27.26C26.55 10.29 25.97 9.70996 25.97 8.99996Z" fill-rule="evenodd" clip-rule="evenodd" fill="white"/>
                      <path d="M19.2201 12.86C21.3519 12.86 23.0801 11.1318 23.0801 9.00002C23.0801 6.8682 21.3519 5.14001 19.2201 5.14001C17.0883 5.14001 15.3601 6.8682 15.3601 9.00002C15.3601 11.1318 17.0883 12.86 19.2201 12.86Z" fill="white"/>
                      <path d="M10.25 6.82996H1C0.45 6.82996 0 6.37996 0 5.82996C0 5.27996 0.45 4.82996 1 4.82996H10.25C10.8 4.82996 11.25 5.27996 11.25 5.82996C11.25 6.37996 10.8 6.82996 10.25 6.82996Z" fill="#D9C36E"/>
                      <path d="M10.25 10.5499H2.51001C1.96001 10.5499 1.51001 10.0999 1.51001 9.54993C1.51001 8.99993 1.96001 8.54993 2.51001 8.54993H10.25C10.8 8.54993 11.25 8.99993 11.25 9.54993C11.25 10.0999 10.8 10.5499 10.25 10.5499Z" fill="#D9C36E"/>
                      <path d="M10.2501 14.45H4.08008C3.53008 14.45 3.08008 14 3.08008 13.45C3.08008 12.9 3.53008 12.45 4.08008 12.45H10.2501C10.8001 12.45 11.2501 12.9 11.2501 13.45C11.2501 14 10.8001 14.45 10.2501 14.45Z" fill="#D9C36E"/>
                    </g>
                  </svg>

                  <!-- Bayar Gadai & Bayar Tagihan -->
                  <svg
                    v-else-if="item.id === 'bayar-gadai' || item.id === 'bayar-tagihan'"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    class="pos-menu-item__svg"
                  >
                    <g transform="translate(1.962, 5.1118)">
                      <path d="M17.208 1.99805C17.136 2.25005 16.872 2.50205 16.002 2.27405C14.706 1.94405 14.25 1.74005 14.148 1.68605C14.13 1.67405 14.112 1.67405 14.088 1.67405L11.754 1.73405C11.754 1.73405 11.712 1.73405 11.694 1.75205L9.9 2.71805C9.756 2.79605 9.798 3.06005 9.954 3.07205L13.26 3.21005C13.26 3.21005 13.854 3.27605 13.896 3.99005C13.932 4.59005 13.602 4.86005 13.092 4.98005C12.606 5.09405 10.314 5.47805 10.08 5.51405C10.068 5.51405 10.056 5.52005 10.038 5.52605L7.938 6.69005C7.488 6.94205 6.99 7.04405 6.492 6.99005L3.27 6.62405C3.27 6.62405 3.252 6.62405 3.246 6.62405L2.016 6.60605C0.9 6.60605 0 5.70605 0 4.59005C0 3.47405 0.9 2.57405 2.016 2.57405L3.456 2.59805L9.174 0.0780489C9.288 0.0300489 9.408 4.88758e-05 9.528 4.88758e-05H14.112C14.226 4.88758e-05 14.34 0.0300492 14.442 0.0900492L17.016 1.51805C17.166 1.60205 17.256 1.80605 17.202 1.99805H17.208Z" fill="#F2CBA8"/>
                      <path d="M2.09401 1.20605H0.684006C0.309557 1.20605 0.00600588 1.50961 0.00600588 1.88405V7.24205C0.00600588 7.6165 0.309557 7.92005 0.684006 7.92005H2.09401C2.46846 7.92005 2.77201 7.6165 2.77201 7.24205V1.88405C2.77201 1.50961 2.46846 1.20605 2.09401 1.20605Z" fill="#00AB4E"/>
                      <path d="M9.37799 13.1397C9.43199 13.7037 9.86999 14.1057 10.422 14.1357C11.124 14.1777 12.258 14.2197 13.884 14.2197C15.51 14.2197 16.644 14.1777 17.346 14.1357C17.892 14.1057 18.336 13.7037 18.39 13.1397C18.438 12.6537 18.48 11.9757 18.48 11.0637C18.48 10.1517 18.438 9.47372 18.39 8.98772C18.336 8.42372 17.898 8.02172 17.346 7.99172C16.644 7.94972 15.51 7.90771 13.884 7.90771C12.258 7.90771 11.124 7.94972 10.422 7.99172C9.87599 8.02172 9.43199 8.42372 9.37799 8.98772C9.32999 9.47372 9.28799 10.1517 9.28799 11.0637C9.28799 11.9757 9.32999 12.6537 9.37799 13.1397Z" fill="#00AB4E"/>
                      <path d="M16.2419 11.0694C16.2419 10.8234 16.4459 10.6194 16.6919 10.6194H16.9199C17.1659 10.6194 17.3699 10.8234 17.3699 11.0694C17.3699 11.3154 17.1659 11.5194 16.9199 11.5194H16.6919C16.4459 11.5194 16.2419 11.3154 16.2419 11.0694Z" fill-rule="evenodd" clip-rule="evenodd" fill="white"/>
                      <path d="M10.3919 11.0694C10.3919 10.8234 10.5959 10.6194 10.8419 10.6194H11.0699C11.3159 10.6194 11.5199 10.8234 11.5199 11.0694C11.5199 11.3154 11.3159 11.5194 11.0699 11.5194H10.8419C10.5959 11.5194 10.3919 11.3154 10.3919 11.0694Z" fill-rule="evenodd" clip-rule="evenodd" fill="white"/>
                      <path d="M13.8779 12.4194C14.6235 12.4194 15.2279 11.815 15.2279 11.0694C15.2279 10.3238 14.6235 9.71943 13.8779 9.71943C13.1323 9.71943 12.5279 10.3238 12.5279 11.0694C12.5279 11.815 13.1323 12.4194 13.8779 12.4194Z" fill="white"/>
                    </g>
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
                    <g transform="scale(0.59865)">
                      <path d="M11.05 23.2C11.05 21.1 11.9 19.04 13.39 17.55C14.9 16.04 16.91 15.21 19.04 15.21C20.23 15.21 21.38 15.48 22.42 15.97C22.42 15.34 22.42 14.69 22.42 14.01C22.42 9.1 22.27 5.67 22.13 3.51C22.02 1.81 20.98 0.5 19.61 0.36C17.89 0.19 15.14 0 11.21 0C7.28 0 4.54 0.18 2.81 0.36C1.45 0.5 0.4 1.8 0.29 3.51C0.15 5.66 0 9.1 0 14.01C0 18.92 0.15 22.35 0.29 24.51C0.4 26.21 1.44 27.52 2.81 27.66C4.53 27.83 7.28 28.02 11.21 28.02C11.71 28.02 12.18 28.02 12.64 28.02C11.61 26.64 11.03 24.95 11.03 23.22L11.05 23.2Z" transform="translate(8.511, 6.098)" fill="#00AB4E"/>
                      <path d="M8.17 18.68C8.5 17.22 9.24 15.85 10.31 14.78C11.82 13.27 13.83 12.44 15.96 12.44C16.06 12.44 16.16 12.45 16.26 12.45C16.28 11.53 16.3 10.5 16.3 9.34C16.3 6.07 16.19 3.78 16.09 2.34C16.01 1.2 15.25 0.340001 14.26 0.240001C13.01 0.120001 11.01 0 8.15 0C5.29 0 3.3 0.120001 2.04 0.240001C1.05 0.330001 0.29 1.2 0.21 2.34C0.11 3.77 0 6.06 0 9.34C0 12.62 0.11 14.9 0.21 16.34C0.29 17.48 1.05 18.34 2.04 18.44C3.29 18.56 5.29 18.68 8.15 18.68C8.15 18.68 8.16 18.68 8.17 18.68Z" transform="translate(11.598, 8.86)" fill="#D6C47A"/>
                      <path d="M0 5.99C0 7.58 0.63 9.1 1.75 10.23C2.87 11.35 4.4 11.98 5.99 11.98C7.58 11.98 9.1 11.35 10.23 10.23C11.35 9.11 11.98 7.58 11.98 5.99C11.98 4.4 11.35 2.88 10.23 1.75C9.11 0.63 7.58 0 5.99 0C4.4 0 2.88 0.63 1.75 1.75C0.63 2.87 0 4.4 0 5.99Z" transform="translate(21.56, 23.30)" fill="#D6C47A"/>
                      <g transform="translate(23.974, 26.66)">
                        <path d="M4.52317 5.3252C4.37623 5.3252 4.26305 5.28548 4.18362 5.20605C4.10816 5.1306 4.07043 5.01742 4.07043 4.8665V1.67949C4.07043 1.53255 4.10816 1.42135 4.18362 1.3459C4.26305 1.26647 4.37226 1.22676 4.51126 1.22676C4.6582 1.22676 4.76939 1.26647 4.84485 1.3459C4.9203 1.42135 4.95803 1.53255 4.95803 1.67949V2.08457L4.89251 1.85225C4.95208 1.66162 5.07122 1.50872 5.24993 1.39355C5.43261 1.27441 5.64111 1.21484 5.87542 1.21484C6.12958 1.21484 6.35198 1.2764 6.5426 1.39951C6.7372 1.52262 6.88811 1.69736 6.99534 1.92373C7.10256 2.1501 7.15618 2.42015 7.15618 2.73389C7.15618 3.04762 7.10256 3.31966 6.99534 3.55C6.88811 3.78034 6.73919 3.95706 6.54856 4.08018C6.35794 4.20329 6.13355 4.26484 5.87542 4.26484C5.64508 4.26484 5.44055 4.20924 5.26184 4.09805C5.08313 3.98288 4.962 3.83395 4.89846 3.65127H4.96995V4.8665C4.96995 5.01742 4.93023 5.1306 4.85081 5.20605C4.77535 5.28548 4.66614 5.3252 4.52317 5.3252ZM5.60735 3.5917C5.73443 3.5917 5.84563 3.55993 5.94094 3.49639C6.04023 3.43285 6.11568 3.33952 6.16731 3.21641C6.22291 3.08932 6.25071 2.92848 6.25071 2.73389C6.25071 2.44398 6.19114 2.23151 6.072 2.09648C5.95286 1.95749 5.79797 1.88799 5.60735 1.88799C5.48027 1.88799 5.36708 1.91777 5.2678 1.97734C5.17249 2.03691 5.09703 2.13024 5.04143 2.25732C4.98583 2.38044 4.95803 2.53929 4.95803 2.73389C4.95803 3.0238 5.0176 3.24023 5.13674 3.3832C5.25588 3.5222 5.41275 3.5917 5.60735 3.5917Z" fill="#004D43"/>
                        <path d="M0.464648 4.25332C0.313737 4.25332 0.198568 4.21162 0.119141 4.12822C0.0397136 4.04482 0 3.92767 0 3.77676V0.470605C0 0.315723 0.0397136 0.198568 0.119141 0.119141C0.202539 0.0397135 0.319694 0 0.470606 0H1.91816C2.38678 0 2.74818 0.113184 3.00234 0.339551C3.25651 0.565918 3.38359 0.881641 3.38359 1.28672C3.38359 1.54883 3.32601 1.7752 3.21084 1.96582C3.09567 2.15645 2.92887 2.30339 2.71045 2.40664C2.496 2.5099 2.2319 2.56152 1.91816 2.56152L1.96582 2.46025H2.21006C2.37686 2.46025 2.52181 2.50195 2.64492 2.58535C2.77201 2.66478 2.88122 2.78789 2.97256 2.95469L3.34189 3.63975C3.39749 3.73903 3.42331 3.83633 3.41934 3.93164C3.41536 4.02695 3.37962 4.10439 3.31211 4.16397C3.2446 4.22354 3.14531 4.25332 3.01426 4.25332C2.8832 4.25332 2.77598 4.22552 2.69258 4.16992C2.61315 4.11432 2.54167 4.02894 2.47813 3.91377L1.90625 2.85938C1.84668 2.74818 1.77321 2.67272 1.68584 2.63301C1.60244 2.59329 1.49919 2.57344 1.37607 2.57344H0.92334V3.77676C0.92334 3.92767 0.883626 4.04482 0.804199 4.12822C0.728744 4.21162 0.61556 4.25332 0.464648 4.25332ZM0.92334 1.90625H1.75137C1.99759 1.90625 2.18226 1.85661 2.30537 1.75732C2.43245 1.65804 2.496 1.50911 2.496 1.31055C2.496 1.11595 2.43245 0.96901 2.30537 0.869727C2.18226 0.770443 1.99759 0.720801 1.75137 0.720801H0.92334V1.90625Z" fill="#004D43"/>
                      </g>
                      <path d="M2.87 0H1.53C0.689999 0 0 0.67 0 1.5C0 2.33 0.679999 3 1.53 3H3.48C3.09 2.05 2.88 1.03 2.88 0H2.87Z" transform="translate(16.69, 29.32)" fill-rule="evenodd" clip-rule="evenodd" fill="#004D43"/>
                    </g>
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
                    <g transform="translate(2.9819, 3.918) scale(0.6)">
                      <path d="M21.3 14.1792C21.3 14.1792 21.28 14.2192 21.26 14.2192H16.79C14.69 14.2192 12.99 15.8192 12.98 17.7892C12.98 19.7692 14.68 21.3692 16.79 21.3692H20.98C21.16 21.3692 21.31 21.5092 21.31 21.6792C21.31 25.1292 19.14 27.1692 15.47 27.1692H5.84C2.17 27.1692 0 25.1292 0 21.6792V14.1692C0 10.7192 2.17 8.68921 5.84 8.68921H15.46C19.13 8.68921 21.3 10.7192 21.3 14.1692V14.1792ZM5.04 14.2092H11.06C11.51 14.2092 11.87 13.8592 11.87 13.4392C11.87 13.0192 11.5 12.6792 11.05 12.6792H5.04C4.59 12.6792 4.23 13.0192 4.23 13.4392C4.23 13.8592 4.59 14.2092 5.04 14.2092Z" fill-rule="evenodd" clip-rule="evenodd" fill="#00AB4E"/>
                      <path d="M14.89 18.2684C15.13 19.3384 16.06 20.0883 17.13 20.0683H20.79C21.24 20.0683 21.6 19.6983 21.6 19.2383V16.3883C21.6 15.9283 21.24 15.5583 20.79 15.5583H17.05C15.83 15.5583 14.85 16.5783 14.85 17.8183C14.85 17.9683 14.86 18.1084 14.89 18.2484" fill="#D6C47A"/>
                      <path d="M28.67 11.73C28.54 11.6 28.47 11.43 28.47 11.24C28.47 5.81 24.05 1.38 18.61 1.38C18.23 1.38 17.92 1.07 17.92 0.69C17.92 0.31 18.23 0 18.61 0C24.81 0 29.85 5.04 29.85 11.24C29.85 11.62 29.54 11.93 29.16 11.93C28.97 11.93 28.8 11.85 28.67 11.73Z" fill="#004D43"/>
                      <path d="M25.42 11.73C25.29 11.6 25.22 11.43 25.22 11.24C25.22 7.6 22.25 4.63 18.61 4.63C18.23 4.63 17.92 4.32 17.92 3.94C17.92 3.56 18.23 3.25 18.61 3.25C23.02 3.25 26.6 6.84 26.6 11.24C26.6 11.62 26.29 11.93 25.91 11.93C25.72 11.93 25.55 11.85 25.42 11.73Z" fill="#004D43"/>
                      <path d="M22.1801 11.73C22.0501 11.6 21.9801 11.43 21.9801 11.24C21.9801 9.38 20.4701 7.88 18.6201 7.88C18.2401 7.88 17.9301 7.57 17.9301 7.19C17.9301 6.81 18.2401 6.5 18.6201 6.5C21.2401 6.5 23.3701 8.63 23.3701 11.25C23.3701 11.63 23.0601 11.94 22.6801 11.94C22.4901 11.94 22.3201 11.86 22.1901 11.74L22.1801 11.73Z" fill="#004D43"/>
                    </g>
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
                    <g transform="translate(4.5, 3.5254) scale(0.6)">
                      <path d="M12.1328 0C16.3875 0 19.3644 0.162535 21.2295 0.316406C22.7055 0.438743 23.8349 1.58749 23.9551 3.08789C24.0977 4.87463 24.2459 7.66436 24.2627 11.5996H24.2666V24.8906C24.2681 25.7818 23.6593 26.5945 22.7021 26.9785C21.7803 27.3709 20.6708 27.2787 19.8574 26.7422L16.9326 24.8516L14.0723 27.3066C13.5651 27.7497 12.8652 28 12.1338 28C11.4024 28 10.7015 27.7497 10.1943 27.3066L7.33301 24.8516L4.40918 26.7422C3.5973 27.2787 2.48629 27.3709 1.56445 26.9785C0.607274 26.5945 -0.00146397 25.7818 0 24.8906V11.5996H0.00292969C0.0197579 7.66435 0.168868 4.87463 0.311523 3.08789C0.431694 1.58743 1.56101 0.438661 3.03711 0.316406C4.9021 0.16254 7.87831 1.00349e-05 12.1328 0Z" fill="#00AB4E"/>
                      <path d="M8.01804 15.4184C7.47811 15.4184 6.98086 15.1373 6.71925 14.6838C6.45764 14.2309 6.4731 13.6764 6.75883 13.2367L10.8247 6.98028C11.0585 6.62071 11.5125 6.45313 11.9367 6.5702C12.361 6.68669 12.6536 7.05993 12.6536 7.48426V10.6716H16.2487C16.7862 10.6716 17.2816 10.9509 17.5438 11.4008C17.8067 11.8513 17.7949 12.4034 17.5148 12.8432L13.4935 19.146C13.2616 19.5091 12.807 19.6797 12.3803 19.5638C11.9541 19.4479 11.6597 19.0735 11.6604 18.648L11.6634 15.419L8.01804 15.4184Z" fill-rule="evenodd" clip-rule="evenodd" fill="white"/>
                    </g>
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
                    <g transform="translate(3.9, 3.525) scale(0.6)">
                      <path d="M13.4875 19.3399C12.5137 18.4228 10.9991 18.4513 10.0595 19.4043L9.06126 20.4167C7.2374 22.2666 4.305 22.3448 2.3878 20.5947L0.393788 18.7746C-0.0945277 18.3288 -0.134114 17.566 0.305371 17.0707C0.744855 16.5754 1.49699 16.5353 1.9853 16.981L3.97932 18.8012C4.95601 19.6927 6.44987 19.6529 7.379 18.7105L8.37721 17.6981C10.2217 15.8273 13.1949 15.7715 15.1064 17.5717L16.2449 18.644C17.2447 19.5856 18.8079 19.5269 19.7364 18.5128L19.879 18.357C22.0765 15.9567 25.9298 16.3646 27.5913 19.1733L27.8303 19.5772C28.1683 20.1486 27.9856 20.8897 27.4223 21.2325C26.859 21.5753 26.1283 21.39 25.7903 20.8187L25.5513 20.4147C24.7049 18.9839 22.7419 18.7761 21.6224 19.9989L21.4797 20.1547C19.6572 22.1454 16.5887 22.2606 14.626 20.4122L13.4875 19.3399Z" fill-rule="evenodd" clip-rule="evenodd" fill="#D6C47A"/>
                      <path d="M13.4875 24.9399C12.5137 24.0227 10.9991 24.0512 10.0595 25.0042L9.06126 26.0167C7.2374 27.8665 4.305 27.9447 2.3878 26.1946L0.393788 24.3745C-0.0945277 23.9287 -0.134114 23.1659 0.305371 22.6706C0.744855 22.1753 1.49699 22.1352 1.9853 22.5809L3.97932 24.4011C4.95601 25.2926 6.44987 25.2528 7.379 24.3104L8.37721 23.298C10.2217 21.4272 13.1949 21.3714 15.1064 23.1716L16.2449 24.2439C17.2447 25.1855 18.8079 25.1268 19.7364 24.1127L19.879 23.9569C22.0765 21.5566 25.9298 21.9645 27.5913 24.7732L27.8303 25.1771C28.1683 25.7485 27.9856 26.4896 27.4223 26.8324C26.859 27.1752 26.1283 26.9899 25.7903 26.4186L25.5513 26.0146C24.7049 24.5838 22.7419 24.376 21.6224 25.5988L21.4797 25.7546C19.6572 27.7453 16.5887 27.8605 14.626 26.0121L13.4875 24.9399Z" fill-rule="evenodd" clip-rule="evenodd" fill="#D6C47A"/>
                      <path d="M10.2933 4.68271L13.9144 0.485475C14.4836 -0.174172 15.5105 -0.159386 16.0604 0.516371L19.5781 4.8394C21.7151 7.46555 21.0509 11.3727 18.1662 13.1452L17.379 13.6289C15.9172 14.5271 14.0804 14.5508 12.5959 13.6905L11.7254 13.1859C8.68921 11.4263 8.00095 7.33975 10.2933 4.68271Z" fill="#00AB4E"/>
                    </g>
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
                    <g transform="translate(4.8, 3.6) scale(0.6)">
                      <path d="M0 11.7838C0 7.3066 4.05643e-08 5.068 0.5145 4.3148C1.02764 3.563 3.07339 2.842 7.16625 1.4014L7.94617 1.127C10.079 0.3752 11.1448 0 12.25 0C13.3552 0 14.421 0.3752 16.5538 1.127L17.3337 1.4014C21.4266 2.842 23.4724 3.563 23.9855 4.3148C24.5 5.068 24.5 7.308 24.5 11.7838V13.9874C24.5 21.8806 18.7303 25.7124 15.1097 27.3378C14.1283 27.7788 13.6383 28 12.25 28C10.8617 28 10.3717 27.7788 9.39031 27.3378C5.76975 25.711 0 21.882 0 13.9874V11.7838Z" fill="#00AB4E"/>
                      <path d="M12.2501 7.875L12.2343 7.875L12.1421 7.88052L12.1272 7.88228C11.8717 7.91237 11.6362 8.03516 11.4654 8.22734C11.2945 8.41953 11.2 8.66782 11.2 8.925V12.075H8.03431L7.94215 12.0805L7.92715 12.0823C7.67174 12.1124 7.43625 12.2352 7.26535 12.4273C7.09446 12.6195 7.00004 12.8678 7 13.1249L7 13.1407L7.00552 13.2329L7.00728 13.2478C7.03737 13.5033 7.16016 13.7388 7.35234 13.9096C7.54453 14.0805 7.79282 14.175 8.05 14.175H11.2V17.3407L11.2055 17.4329L11.2073 17.4478C11.2374 17.7033 11.3602 17.9387 11.5523 18.1096C11.7445 18.2805 11.9927 18.375 12.2499 18.375L12.2657 18.375L12.3579 18.3695L12.3728 18.3677C12.6283 18.3376 12.8638 18.2148 13.0346 18.0227C13.2055 17.8305 13.3 17.5822 13.3 17.325V14.175H16.4657L16.5579 14.1695L16.5728 14.1677C16.8283 14.1376 17.0637 14.0148 17.2346 13.8227C17.4055 13.6305 17.5 13.3823 17.5 13.1251L17.5 13.1093L17.4945 13.0171L17.4927 13.0022C17.4626 12.7467 17.3398 12.5112 17.1477 12.3404C16.9555 12.1695 16.7072 12.075 16.45 12.075H13.3V8.90931L13.2945 8.81715L13.2927 8.80215C13.2626 8.54674 13.1398 8.31125 12.9477 8.14035C12.7555 7.96946 12.5072 7.87504 12.2501 7.875Z" fill="white"/>
                    </g>
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
