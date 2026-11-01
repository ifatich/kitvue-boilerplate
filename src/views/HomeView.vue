<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SprintNavbar from '@/components/shared/admin-layout/SprintNavbar.vue'
import rahnIcon from 'kitvue-public/src/assets/icon/Pengajuan-Rahn.svg'
import confirmationIcon from 'kitvue-public/src/assets/icon/gadai2.svg'
import verificationIcon from 'kitvue-public/src/assets/icon/gadai.svg'
import reportIcon from 'kitvue-public/src/assets/icon/icon-product/icon-submenu-pinjaman.svg'
import chevronDownAsset from 'kitvue-public/src/assets/icon/icon-system/icon-chevron-down.svg'
import infoIconAsset from 'kitvue-public/src/assets/icon/icon-system/icon-info.svg'
import loanApplyIcon from '@/assets/figma/entry/loan-apply.svg'
import loanVerifyIcon from '@/assets/figma/entry/loan-verify.svg'
import loanConfirmIcon from '@/assets/figma/entry/loan-confirm.svg'
import eformPrintIcon from '@/assets/figma/entry/eform-print.svg'
import eformManageIcon from '@/assets/figma/entry/eform-manage.svg'
import egcInputIcon from '@/assets/figma/entry/egc-input.svg'
import egcReactivateIcon from '@/assets/figma/entry/egc-reactivation.svg'
import egcCrmIcon from '@/assets/figma/entry/egc-crm.svg'
import egcFollowUpIcon from '@/assets/figma/entry/egc-follow-up.svg'
import monitorLoanIcon from '@/assets/figma/entry/monitor-loan-list.svg'
import monitorHomeReportIcon from '@/assets/figma/entry/monitor-home-report.svg'
import monitorReferralIcon from '@/assets/figma/entry/monitor-referral.svg'
import monitorEgcHistoryIcon from '@/assets/figma/entry/monitor-egc-history.svg'
import monitorRestructureIcon from '@/assets/figma/entry/monitor-restructure.svg'
import monitorProblemLoanIcon from '@/assets/figma/entry/monitor-problem-loan.svg'
import reportOslIcon from '@/assets/figma/entry/report-osl.svg'
import reportKpiIcon from '@/assets/figma/entry/report-kpi.svg'
import reportBalanceIcon from '@/assets/figma/entry/report-balance.svg'

const router = useRouter()
const openPengajuan = () => router.push('/pengajuan-gadai')
const openModule = ref<string | null>('Pengajuan')
const chevronDown = chevronDownAsset as unknown as string
const infoIcon = infoIconAsset as unknown as string
const dashboardPage = ref(0)
const dashboardSlides = [
  ['egc', 'osl', 'npl'],
  ['omset', 'profitability', 'gold'],
] as const

const tasks = [
  { label: 'Pengajuan', value: '2' },
  { label: 'Konfirmasi', value: '99+' },
  { label: 'Verifikasi', value: '99+' },
]

const modules = [
  { title: 'Pengajuan', label: 'Pengajuan Gadai/Rahn', icon: rahnIcon as unknown as string, to: '/pengajuan-gadai', slot: 'submission' },
  { title: 'Konfirmasi', label: 'Konfirmasi Gadai/Rahn', icon: confirmationIcon as unknown as string, to: '/pengajuan-gadai', slot: 'confirmation' },
  { title: 'Verifikasi', label: 'Verifikasi Gadai/Rahn', icon: verificationIcon as unknown as string, to: '/pengajuan-gadai', slot: 'verification' },
  { title: 'Laporan', label: 'Daftar Pinjaman', icon: reportIcon as unknown as string, to: '/pengajuan-gadai', slot: 'report' },
]

const entryGroups = [
  {
    items: [
      { label: 'Pengajuan Gadai', icon: loanApplyIcon },
      { label: 'Verifikasi Gadai', icon: loanVerifyIcon },
      { label: 'Konfirmasi Gadai', icon: loanConfirmIcon },
    ],
  },
  {
    items: [
      { label: 'Cetak E-FPK', icon: eformPrintIcon },
      { label: 'Manajemen E-FPK', icon: eformManageIcon },
    ],
  },
  {
    items: [
      { label: 'Input Data EGC/OGC', icon: egcInputIcon },
      { label: 'EGC Leads Reaktivasi', icon: egcReactivateIcon },
      { label: 'Daftar Leads EGC - CRM', icon: egcCrmIcon },
      { label: 'Follow Up EGC - CRM', icon: egcFollowUpIcon },
    ],
  },
  {
    items: [
      { label: 'Daftar Pinjaman', icon: monitorLoanIcon },
      { label: 'Laporan Aktivitas Gadai Dari Rumah', icon: monitorHomeReportIcon },
      { label: 'Riwayat EGC (Reaktivasi)', icon: monitorReferralIcon },
      { label: 'Riwayat EGC (CRM)', icon: monitorEgcHistoryIcon },
      { label: 'Laporan Restrukturisasi', icon: monitorRestructureIcon },
      { label: 'Laporan Penyelesaian Pinjaman Bermasalah', icon: monitorProblemLoanIcon },
    ],
  },
  {
    items: [
      { label: 'OSL Data Harian', icon: reportOslIcon },
      { label: 'Realisasi KPI', icon: reportKpiIcon },
      { label: 'Saldo List Gadai/Rahn', icon: reportBalanceIcon },
    ],
  },
]

const changeDashboardPage = (direction: number) => {
  dashboardPage.value = direction > 0 ? 1 : 0
}

// Mobile Carousel Swipeable State & Logic
const carouselRef = ref<HTMLElement | null>(null)
const activeSlide = ref(0)
const isPointerDown = ref(false)
const startX = ref(0)
const scrollStartLeft = ref(0)
const hasMoved = ref(false)

const onCarouselScroll = () => {
  if (!carouselRef.value) return
  const { scrollLeft, clientWidth } = carouselRef.value
  if (clientWidth > 0) {
    activeSlide.value = Math.min(Math.max(Math.round(scrollLeft / clientWidth), 0), 4)
  }
}

const goToSlide = (index: number) => {
  if (!carouselRef.value) return
  activeSlide.value = index
  carouselRef.value.scrollTo({
    left: index * carouselRef.value.clientWidth,
    behavior: 'smooth',
  })
}

const onPointerDown = (e: PointerEvent) => {
  if (!carouselRef.value) return
  isPointerDown.value = true
  hasMoved.value = false
  startX.value = e.pageX - carouselRef.value.offsetLeft
  scrollStartLeft.value = carouselRef.value.scrollLeft
}

const onPointerMove = (e: PointerEvent) => {
  if (!isPointerDown.value || !carouselRef.value) return
  const x = e.pageX - carouselRef.value.offsetLeft
  const walk = x - startX.value
  if (Math.abs(walk) > 4) {
    hasMoved.value = true
  }
  carouselRef.value.scrollLeft = scrollStartLeft.value - walk
}

const onPointerUp = () => {
  isPointerDown.value = false
}

const handleSlideClick = () => {
  if (hasMoved.value) return
  openPengajuan()
}
</script>

<template>
  <div class="entry-page">
    <SprintNavbar
      embedded
      entry-layout
      profile-role="Penaksir"
      :show-auth-toggle="false"
      :show-mobile-bottom-nav="true"
      search-placeholder="Cari (contoh: Pengajuan Gadai/Rahn)"
    />

    <main class="entry-content">
      <div class="entry-grid">
        <div class="entry-top-grid">
          <section class="panel dashboard-panel">
            <h1>Dashboard</h1>
            <div class="dashboard-carousel">
              <button
                type="button"
                class="dashboard-arrow dashboard-arrow--previous"
                aria-label="Dashboard sebelumnya"
                @click="changeDashboardPage(-1)"
              >
                <img :src="chevronDown" alt="" aria-hidden="true" />
              </button>

              <div class="dashboard-metrics">
                <article
                  v-for="metric in dashboardSlides[dashboardPage]"
                  :key="metric"
                  :class="['dashboard-metric', `dashboard-metric--${metric}`]"
                >
                  <template v-if="metric === 'egc'">
                    <div class="dashboard-metric__heading">
                      <strong>EGC / OGC</strong>
                      <img :src="infoIcon" alt="" aria-hidden="true" />
                    </div>
                    <span class="dashboard-metric__subtitle">Pencapaian per Pegawai</span>
                    <div class="dashboard-metric__stats">
                      <div><small>Referral</small><b>2</b></div>
                      <div><small>Closing</small><b>0</b></div>
                      <div><small>Total XP</small><b>0</b></div>
                    </div>
                  </template>

                  <template v-else-if="metric === 'osl'">
                    <div class="dashboard-metric__heading">
                      <strong>OSL</strong>
                      <img :src="infoIcon" alt="" aria-hidden="true" />
                    </div>
                    <div class="dashboard-metric__osl">
                      <div class="dashboard-metric__subheading">
                        <span>OSL Gross</span>
                        <b class="dashboard-badge">99%</b>
                      </div>
                      <div class="dashboard-progress"><span /></div>
                      <div class="dashboard-metric__footer">
                        <small>Pencapaian</small>
                        <b>Rp 100,5 M / 105,6 M</b>
                      </div>
                    </div>
                  </template>

                  <template v-else-if="metric === 'npl'">
                    <div class="dashboard-metric__heading">
                      <strong>NPL</strong>
                      <img :src="infoIcon" alt="" aria-hidden="true" />
                    </div>
                    <span class="dashboard-metric__subtitle">Kualitas Kredit</span>
                    <div class="dashboard-metric__stats dashboard-metric__stats--npl">
                      <div>
                        <small>Skor Gadai</small>
                        <span><b>0,29</b><em class="dashboard-badge">99%</em></span>
                      </div>
                      <div>
                        <small>Skor Non Gadai</small>
                        <span><b>0,05</b><em class="dashboard-badge dashboard-badge--red">50%</em></span>
                      </div>
                    </div>
                  </template>

                  <template v-else-if="metric === 'omset'">
                    <div class="dashboard-metric__heading">
                      <strong>Omset</strong>
                      <img :src="infoIcon" alt="" aria-hidden="true" />
                    </div>
                    <span class="dashboard-metric__subtitle">Per Posisi</span>
                    <div class="dashboard-metric__footer dashboard-metric__footer--large">
                      <small>Tercapai</small>
                      <b>Rp 2,57 M</b>
                    </div>
                  </template>

                  <template v-else-if="metric === 'profitability'">
                    <div class="dashboard-metric__heading">
                      <strong>Profitabilitas</strong>
                      <img :src="infoIcon" alt="" aria-hidden="true" />
                    </div>
                    <div class="dashboard-metric__footer dashboard-metric__footer--large">
                      <small>Total</small>
                      <b>61,5%</b>
                    </div>
                  </template>

                  <template v-else>
                    <div class="dashboard-metric__heading dashboard-metric__heading--stacked">
                      <strong>Harga Tabungan Emas</strong>
                      <small>10 Januari 2024</small>
                    </div>
                    <div class="dashboard-gold-prices">
                      <div>
                        <span>Beli Emas <img :src="chevronDown" alt="" aria-hidden="true" /></span>
                        <b>Rp 5.000 <small>/ 0,01 gr</small></b>
                      </div>
                      <div>
                        <span>Beli Emas <img :src="chevronDown" alt="" aria-hidden="true" /></span>
                        <b>Rp 5.000 <small>/ 0,01 gr</small></b>
                      </div>
                    </div>
                  </template>
                </article>
              </div>

              <button
                type="button"
                class="dashboard-arrow dashboard-arrow--next"
                aria-label="Dashboard berikutnya"
                @click="changeDashboardPage(1)"
              >
                <img :src="chevronDown" alt="" aria-hidden="true" />
              </button>
            </div>
          </section>

          <section class="panel task-panel">
            <div class="panel-heading">
              <h2>Tugasku <span>99+</span></h2>
              <button type="button" @click="openPengajuan">Lihat Semua</button>
            </div>
            <button
              v-for="task in tasks"
              :key="task.label"
              type="button"
              class="task-row"
              @click="openPengajuan"
            >
              <span>{{ task.label }}</span>
              <b>{{ task.value }}</b>
            </button>
          </section>
        </div>

        <div class="entry-feature-grid">
          <div class="entry-feature-column">
            <section class="panel feature-panel feature-panel--loan">
              <h2>Pinjaman Gadai</h2>
              <div class="feature-menu">
                <button
                  v-for="item in entryGroups[0].items"
                  :key="item.label"
                  type="button"
                  class="feature-menu__item"
                  @click="openPengajuan"
                >
                  <img :src="item.icon" alt="" aria-hidden="true" />
                  <span>{{ item.label }}</span>
                </button>
              </div>
            </section>

            <section class="panel feature-panel feature-panel--egc">
              <h2>EGC / OGC</h2>
              <div class="feature-menu">
                <button
                  v-for="item in entryGroups[2].items"
                  :key="item.label"
                  type="button"
                  class="feature-menu__item"
                  @click="openPengajuan"
                >
                  <img :src="item.icon" alt="" aria-hidden="true" />
                  <span>{{ item.label }}</span>
                </button>
              </div>
            </section>
          </div>

          <div class="entry-feature-column">
            <section class="panel feature-panel feature-panel--eform">
              <h2>E-Form</h2>
              <div class="feature-menu">
                <button
                  v-for="item in entryGroups[1].items"
                  :key="item.label"
                  type="button"
                  class="feature-menu__item"
                  @click="openPengajuan"
                >
                  <img :src="item.icon" alt="" aria-hidden="true" />
                  <span>{{ item.label }}</span>
                </button>
              </div>
            </section>

            <section class="panel feature-panel feature-panel--monitoring">
              <h2>Monitoring</h2>
              <div class="feature-menu">
                <button
                  v-for="item in entryGroups[3].items"
                  :key="item.label"
                  type="button"
                  class="feature-menu__item"
                  @click="openPengajuan"
                >
                  <img :src="item.icon" alt="" aria-hidden="true" />
                  <span>{{ item.label }}</span>
                </button>
              </div>
            </section>
          </div>

          <div class="entry-feature-column">
            <section class="panel feature-panel feature-panel--favorite">
              <div class="panel-heading">
                <h2>Menu Favorit</h2>
                <button type="button" @click="openPengajuan">Atur</button>
              </div>
              <div class="favorite-menu">
                <button type="button" class="favorite-menu__add" @click="openPengajuan">
                  <span class="favorite-menu__icon">
                    <span aria-hidden="true">+</span>
                  </span>
                  <span>Tambah<br />Menu</span>
                </button>
              </div>
            </section>

            <section class="panel feature-panel feature-panel--reports">
              <h2>Laporan</h2>
              <div class="feature-menu">
                <button
                  v-for="item in entryGroups[4].items"
                  :key="item.label"
                  type="button"
                  class="feature-menu__item"
                  @click="openPengajuan"
                >
                  <img :src="item.icon" alt="" aria-hidden="true" />
                  <span>{{ item.label }}</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      <!-- Mobile Responsive Entry Layout (Figma Node 19034:162370 & 19034:160866) -->
      <div class="mobile-entry-view">
        <!-- Dashboard Section: Swipeable Carousel -->
        <section class="mobile-dashboard">
          <h1>Dashboard</h1>

          <!-- Carousel Track: Swipeable / Scrollable horizontally -->
          <div
            ref="carouselRef"
            class="mobile-carousel-track"
            @scroll="onCarouselScroll"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
          >
            <!-- Slide 0: EGC / OGC (Figma 19034:160867) -->
            <article class="mobile-dashboard-card mobile-dashboard-card--egc" @click="handleSlideClick">
              <div class="mobile-dashboard-card__header">
                <div class="mobile-dashboard-card__title">
                  <strong>EGC / OGC</strong>
                  <img :src="infoIcon" class="info-icon" alt="" aria-hidden="true" />
                </div>
              </div>
              <small class="mobile-dashboard-card__subtitle">Pencapaian per Pegawai</small>
              <div class="mobile-dashboard-card__stats">
                <div class="stat-col">
                  <span class="stat-col__label">Referral</span>
                  <span class="stat-col__val">2</span>
                </div>
                <div class="stat-col">
                  <span class="stat-col__label">Closing</span>
                  <span class="stat-col__val">0</span>
                </div>
                <div class="stat-col">
                  <span class="stat-col__label">Total XP</span>
                  <span class="stat-col__val">0</span>
                </div>
              </div>
            </article>

            <!-- Slide 1: OSL (Figma 19034:160897) -->
            <article class="mobile-dashboard-card mobile-dashboard-card--osl" @click="handleSlideClick">
              <div class="mobile-dashboard-card__header">
                <div class="mobile-dashboard-card__title">
                  <strong>OSL</strong>
                  <img :src="infoIcon" class="info-icon" alt="" aria-hidden="true" />
                </div>
              </div>
              <div class="mobile-dashboard-card__sub-row">
                <small class="mobile-dashboard-card__subtitle">OSL Gross</small>
                <span class="mobile-badge mobile-badge--lime">99%</span>
              </div>
              <div class="mobile-progress-bar">
                <div class="mobile-progress-bar__fill" style="width: 99%" />
              </div>
              <div class="mobile-dashboard-card__footer-stat">
                <span class="stat-label">Pencapaian</span>
                <span class="stat-value">Rp 100,5 M / 105,6 M</span>
              </div>
            </article>

            <!-- Slide 2: NPL (Figma 19034:160925) -->
            <article class="mobile-dashboard-card mobile-dashboard-card--npl" @click="handleSlideClick">
              <div class="mobile-dashboard-card__header">
                <div class="mobile-dashboard-card__title">
                  <strong>NPL</strong>
                  <img :src="infoIcon" class="info-icon" alt="" aria-hidden="true" />
                </div>
              </div>
              <small class="mobile-dashboard-card__subtitle">Kualitas Kredit</small>
              <div class="mobile-dashboard-card__stats-split">
                <div class="stat-split-col">
                  <span class="stat-col__label">Skor Gadai</span>
                  <div class="stat-with-badge">
                    <span class="stat-col__val">0,29</span>
                    <span class="mobile-badge mobile-badge--lime">99%</span>
                  </div>
                </div>
                <div class="stat-split-col">
                  <span class="stat-col__label">Skor Non Gadai</span>
                  <div class="stat-with-badge">
                    <span class="stat-col__val">0,05</span>
                    <span class="mobile-badge mobile-badge--lime">99%</span>
                  </div>
                </div>
              </div>
            </article>

            <!-- Slide 3: Omset (Figma 19034:160957) -->
            <article class="mobile-dashboard-card mobile-dashboard-card--omset" @click="handleSlideClick">
              <div class="mobile-dashboard-card__header">
                <div class="mobile-dashboard-card__title">
                  <strong>Omset</strong>
                  <img :src="infoIcon" class="info-icon" alt="" aria-hidden="true" />
                </div>
              </div>
              <small class="mobile-dashboard-card__subtitle">Per Posisi</small>
              <div class="mobile-dashboard-card__footer-stat mobile-dashboard-card__footer-stat--large">
                <span class="stat-label">Tercapai</span>
                <span class="stat-value stat-value--huge">Rp 2,57 M</span>
              </div>
            </article>

            <!-- Slide 4: Harga Tabungan Emas (Figma 19034:160978) -->
            <article class="mobile-dashboard-card mobile-dashboard-card--gold" @click="handleSlideClick">
              <div class="mobile-dashboard-card__header">
                <div class="mobile-dashboard-card__title">
                  <strong>Harga Tabungan Emas</strong>
                </div>
              </div>
              <small class="mobile-dashboard-card__subtitle">17 Juni 2025</small>
              <div class="mobile-dashboard-card__gold-row">
                <div class="gold-col">
                  <div class="gold-col__header">
                    <span>Harga Beli</span>
                    <img :src="chevronDown" class="gold-chevron" alt="" aria-hidden="true" />
                  </div>
                  <div class="gold-col__value">
                    <span class="gold-price">Rp18.520</span>
                    <span class="gold-unit">/ 0,01 gr</span>
                  </div>
                </div>
                <div class="gold-col">
                  <div class="gold-col__header">
                    <span>Harga Jual</span>
                    <img :src="chevronDown" class="gold-chevron" alt="" aria-hidden="true" />
                  </div>
                  <div class="gold-col__value">
                    <span class="gold-price">Rp18.150</span>
                    <span class="gold-unit">/ 0,01 gr</span>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <!-- Indicator Slider: 5 Pills matching Figma -->
          <div class="mobile-carousel-indicator" role="tablist" aria-label="Dashboard Slides">
            <button
              v-for="(_, idx) in 5"
              :key="`indicator-${idx}`"
              type="button"
              :class="['mobile-indicator-dot', { 'is-active': activeSlide === idx }]"
              :aria-label="`Slide ${idx + 1}`"
              :aria-selected="activeSlide === idx"
              @click="goToSlide(idx)"
            />
          </div>
        </section>

        <!-- Tugasku Card (Figma 19034:162427) -->
        <section class="mobile-card mobile-task-card">
          <header>
            <h2>
              Tugasku
              <b>99+</b>
            </h2>
            <button type="button" @click="openPengajuan">Lihat Semua</button>
          </header>
          <div class="mobile-task-list">
            <button
              v-for="task in tasks"
              :key="`mobile-${task.label}`"
              type="button"
              class="mobile-task-row"
              @click="openPengajuan"
            >
              <span>{{ task.label }}</span>
              <b>{{ task.value }}</b>
            </button>
          </div>
        </section>

        <!-- Menu Favorit Card (Figma 19034:162449) -->
        <section class="mobile-card mobile-favorite-card">
          <header>
            <h2>Menu Favorit</h2>
            <button type="button" @click="openPengajuan">Atur</button>
          </header>
          <div class="mobile-favorite-body">
            <button type="button" class="mobile-add-menu" @click="openPengajuan">
              <span class="mobile-add-menu__circle">
                <span class="mobile-add-menu__badge">+</span>
              </span>
              <span>Tambah<br />Menu</span>
            </button>
          </div>
        </section>

        <!-- Feature Accordions (Figma 19034:162461 - 19034:162468) -->
        <section
          v-for="module in modules"
          :key="`mobile-category-${module.title}`"
          class="mobile-feature-card"
        >
          <button
            type="button"
            class="mobile-feature-heading"
            :aria-expanded="openModule === module.title"
            @click="openModule = openModule === module.title ? null : module.title"
          >
            <strong>{{ module.title }}</strong>
            <img :class="{ 'is-open': openModule === module.title }" :src="chevronDown" alt="" aria-hidden="true" />
          </button>
          <div v-show="openModule === module.title" class="mobile-feature-menu">
            <button type="button" @click="router.push(module.to)">
              <span class="mobile-feature-icon-wrapper">
                <img :src="module.icon" alt="" aria-hidden="true" />
              </span>
              <span>{{ module.label }}</span>
            </button>
          </div>
        </section>
      </div>
    </main>

    <footer>Copyright © 2024 PT. Pegadaian. All Rights Reserved.</footer>
  </div>
</template>

<style lang="scss" scoped>
.entry-page {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: var(--g-kit-black-10);
}

.entry-content {
  flex: 1;
  width: min(calc(100% - 32px), 1312px);
  margin: 24px auto 0;
}

.entry-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.panel {
  padding: 12px 16px 24px;
  border-radius: 12px;
  background: var(--g-kit-white);
  box-shadow: var(--bb-elevation-1);
}

.mobile-entry-view {
  display: none;
}

.entry-top-grid {
  display: grid;
  grid-template-columns: minmax(0, 867fr) minmax(0, 421fr);
  gap: 24px;
}

.dashboard-panel {
  min-width: 0;
  height: 226px;
  overflow: visible;

  h1 {
    font-size: 20px;
    line-height: 30px;
  }
}

.task-panel {
  height: 226px;
  padding-bottom: 12px;

  .panel-heading {
    margin-bottom: 16px;
  }
}

h1,
h2 {
  margin: 0;
  color: var(--g-kit-black-80);
  font-size: 20px;
  font-weight: var(--g-kit-font-weight-bold);
  line-height: 30px;
}

.dashboard-carousel {
  position: relative;
  margin-top: 16px;
  margin-right: -16px;
  margin-left: -16px;
}

.dashboard-metrics {
  display: grid;
  grid-template-columns: repeat(3, 267px);
  gap: 16px;
  margin: 0 16px;
}

.dashboard-arrow {
  position: absolute;
  z-index: 1;
  top: 53px;
  display: grid;
  width: 40px;
  height: 40px;
  padding: 8px;
  place-items: center;
  border: 1px solid var(--g-kit-black-20);
  border-radius: 50%;
  background: var(--g-kit-white);
  box-shadow: var(--bb-elevation-1);
  cursor: pointer;

  img {
    width: 22px;
    height: 22px;
    transform: rotate(90deg);
  }

  &--previous {
    left: -20px;

    img {
      transform: rotate(90deg);
    }
  }

  &--next {
    right: -20px;

    img {
      transform: rotate(-90deg);
    }
  }
}

.dashboard-metric {
  display: flex;
  min-width: 0;
  height: 144px;
  flex-direction: column;
  padding: 11px 15px;
  border-radius: 8px;
  border: 1px solid var(--g-kit-black-20);
  box-sizing: border-box;

  &--egc {
    border-color: rgba(255, 243, 165, 0.5);
    background: rgba(255, 249, 237, 0.5);
  }

  &--osl {
    border-color: #e9f5e2;
    background: rgba(230, 246, 234, 0.5);
  }

  &--npl {
    border-color: #f8f7d3;
    background: rgba(248, 251, 234, 0.5);
  }

  &--omset {
    border-color: rgba(232, 244, 251, 0.5);
    background: rgba(232, 241, 249, 0.5);
  }

  &--profitability {
    border-color: #e6f6f3;
    background: rgba(230, 246, 243, 0.5);
  }

  &--gold {
    border-color: #fbf2e9;
    background: rgba(251, 242, 233, 0.5);
  }

  &__heading {
    display: flex;
    min-height: 24px;
    align-items: center;
    gap: 4px;

    strong {
      overflow: hidden;
      color: var(--g-kit-black-80);
      font-size: 16px;
      font-weight: var(--g-kit-font-weight-bold);
      line-height: 24px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    img {
      width: 20px;
      height: 20px;
      flex: 0 0 20px;
    }

    &--stacked {
      align-items: flex-start;
      flex-direction: column;
      gap: 2px;

      strong {
        max-width: 100%;
      }

      small {
        color: var(--g-kit-black-60);
        font-size: 12px;
        line-height: 18px;
      }
    }
  }

  &__subtitle {
    margin-top: 4px;
    color: var(--g-kit-black-60);
    font-size: 14px;
    font-weight: var(--g-kit-font-weight-normal);
    line-height: 20px;
  }

  &__stats {
    display: flex;
    width: 200px;
    max-width: 100%;
    justify-content: space-between;
    margin-top: auto;

    > div {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    small {
      color: var(--g-kit-black-50);
      font-size: 12px;
      line-height: 18px;
    }

    b {
      color: var(--g-kit-black-80);
      font-size: 20px;
      font-weight: var(--g-kit-font-weight-bold);
      line-height: 30px;
    }

    &--npl {
      margin-top: auto;

      > div > span {
        display: flex;
        align-items: center;
        gap: 6px;
      }
    }
  }

  &__osl {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 200px;
    margin-top: 4px;
  }

  &__subheading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--g-kit-black-60);
    font-size: 14px;
    line-height: 22px;
  }

  &__footer {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: auto;

    small {
      color: var(--g-kit-black-50);
      font-size: 12px;
      line-height: 18px;
    }

    b {
      color: var(--g-kit-black-80);
      font-size: 20px;
      font-weight: var(--g-kit-font-weight-bold);
      line-height: 30px;
      white-space: nowrap;
    }

    &--large {
      margin-top: auto;

      b {
        font-size: 30px;
        line-height: 44px;
      }

      &--omset &__footer {
        width: 144px;
      }

      &--profitability &__footer {
        width: 91px;
      }
    }
  }
}

.dashboard-badge {
  display: inline-flex;
  min-width: 38px;
  height: 22px;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  border-radius: 4px;
  color: var(--g-kit-lime-50);
  background: var(--g-kit-lime-10);
  font-size: 12px;
  font-style: normal;
  font-weight: var(--g-kit-font-weight-bold);
  line-height: 18px;
}

.dashboard-badge--red {
  color: var(--g-kit-red-50);
  background: var(--g-kit-red-10);
}

.dashboard-progress {
  width: 100%;
  height: 10px;
  margin-top: 6px;
  overflow: hidden;
  border: 1px solid var(--g-kit-black-40);
  border-radius: 8px;
  background: var(--g-kit-white);

  span {
    display: block;
    width: 99%;
    height: 100%;
    background: var(--g-kit-lime-40);
  }
}

.dashboard-gold-prices {
  display: flex;
  gap: 8px;
  margin-top: 12px;

  > div {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    gap: 2px;
  }

  span {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--g-kit-black-60);
    font-size: 14px;
    line-height: 20px;
  }

  img {
    width: 14px;
    height: 14px;
  }

  b {
    display: flex;
    flex-direction: column;
    color: var(--g-kit-black-80);
    font-size: 18px;
    font-weight: var(--g-kit-font-weight-bold);
    line-height: 26px;
    white-space: normal;
  }

  span {
    small {
      color: var(--g-kit-black-60);
      font-size: 12px;
      font-weight: var(--g-kit-font-weight-normal);
      line-height: 16px;
    }
  }
}

.panel-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  h2 span {
    display: inline-flex;
    min-width: 24px;
    height: 18px;
    align-items: center;
    justify-content: center;
    padding: 0 3px;
    border-radius: 9px;
    color: var(--g-kit-white);
    background: var(--g-kit-lime-50);
    font-size: 10px;
    line-height: 14px;
  }

  button {
    height: 24px;
    padding: 3px 10px;
    border: 1px solid var(--g-kit-lime-50);
    border-radius: 4px;
    color: var(--g-kit-lime-50);
    background: var(--g-kit-white);
    font: inherit;
    font-size: 12px;
    font-weight: var(--g-kit-font-weight-bold);
    line-height: 18px;
    cursor: pointer;
  }
}

.task-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 52px;
  padding: 0;
  border: 0;
  border-bottom: 1px solid var(--g-kit-black-20);
  color: var(--g-kit-black-80);
  background: transparent;
  font: inherit;
  font-size: 14px;
  text-align: left;
  cursor: pointer;

  &:last-child {
    border-bottom: 0;
  }

  b {
    color: var(--g-kit-lime-50);
    font-weight: var(--g-kit-font-weight-bold);
  }
}

.entry-feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: start;
  gap: 24px;
}

.entry-feature-column {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 24px;
}

.feature-panel {
  min-width: 0;

  h2 {
    font-size: 20px;
    line-height: 30px;
  }

  &--loan {
    height: 166px;
  }

  &--egc {
    min-height: 306px;
  }

  &--eform,
  &--favorite,
  &--reports {
    min-height: 186px;
  }

  &--monitoring {
    min-height: 366px;
  }
}

.feature-menu {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: start;
  gap: 16px 24px;
  margin-top: 16px;
}

.feature-menu__item {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: 0;
  color: var(--g-kit-black-80);
  background: transparent;
  font: inherit;
  font-size: 14px;
  font-weight: var(--g-kit-font-weight-normal);
  line-height: 20px;
  text-align: center;
  cursor: pointer;

  img {
    width: 56px;
    height: 56px;
    flex: 0 0 56px;
  }

  span {
    width: min(100%, 114px);
  }
}

.feature-panel--eform .feature-menu {
  grid-template-columns: repeat(3, 114px);
}

.feature-panel--favorite {
  padding-bottom: 21px;
}

.favorite-menu {
  margin-top: 16px;
}

.favorite-menu__add {
  display: flex;
  width: 104px;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: 0;
  color: var(--g-kit-lime-50);
  background: transparent;
  font: inherit;
  font-size: 14px;
  font-weight: var(--g-kit-font-weight-bold);
  line-height: 20px;
  text-align: center;
  cursor: pointer;
}

.favorite-menu__icon {
  position: relative;
  display: block;
  width: 56px;
  height: 59px;
  margin: 0 auto;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 56px;
    height: 56px;
    border: 1px solid var(--g-kit-black-20);
    border-radius: 50%;
    background: var(--g-kit-black-10);
    content: '';
    box-sizing: border-box;
  }

  span {
    position: absolute;
    top: 0;
    left: 56px;
    display: grid;
    width: 24px;
    height: 24px;
    place-items: center;
    border-radius: 50%;
    color: var(--g-kit-white);
    background: var(--g-kit-lime-50);
    font-size: 20px;
    font-weight: var(--g-kit-font-weight-normal);
    line-height: 24px;
  }
}

footer {
  margin-top: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  flex: 0 0 48px;
  padding: 12px 24px;
  border-top: 1px solid var(--g-kit-black-20);
  color: var(--g-kit-black-60);
  background: var(--g-kit-white);
  font-size: 16px;
  font-weight: var(--g-kit-font-weight-normal);
  line-height: 24px;
  box-sizing: border-box;
}

@media (max-width: 1100px) {
  .entry-top-grid {
    grid-template-columns: 1fr;
  }

  .entry-feature-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard-metrics {
    margin: 0 16px;
  }

  .task-panel {
    width: 100%;
  }

  .feature-panel--eform .feature-menu {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .dashboard-metrics {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .entry-content {
    width: 100%;
    margin: -12px 0 0;
    padding-bottom: 0;
  }

  .entry-grid {
    display: none;
  }

  .mobile-entry-view {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding-bottom: 24px;
  }

  /* 1. Dashboard Section (Figma Node 19034:162422) */
  .mobile-dashboard {
    height: 238px;
    padding: 16px 16px 16px 16px;
    border-radius: 12px 12px 0 0;
    background: var(--g-kit-white);
    box-sizing: border-box;

    h1 {
      margin: 0 0 16px 0;
      color: var(--g-kit-black-80);
      font-size: var(--g-kit-font-size-omicron);
      font-weight: var(--g-kit-font-weight-bold);
      line-height: var(--g-kit-line-height-omicron);
    }
  }

  /* Swipeable Carousel Track */
  .mobile-carousel-track {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    touch-action: pan-y;
    cursor: grab;
    user-select: none;

    &::-webkit-scrollbar {
      display: none;
    }

    &:active {
      cursor: grabbing;
    }
  }

  /* Shared Card Base (Figma 328px x 144px, rounded 8px) */
  .mobile-dashboard-card {
    flex: 0 0 100%;
    min-width: 100%;
    height: 144px;
    padding: 11px 15px 12px;
    border-radius: 8px;
    box-sizing: border-box;
    scroll-snap-align: center;
    scroll-snap-stop: always;
    position: relative;
    cursor: pointer;

    &--egc {
      background: rgba(255, 249, 237, 0.5);
      border: 1px solid rgba(255, 243, 165, 0.5);
    }

    &--osl {
      background: rgba(230, 246, 234, 0.5);
      border: 1px solid #e9f5e2;
    }

    &--npl {
      background: rgba(248, 251, 234, 0.5);
      border: 1px solid #f8f7d3;
    }

    &--omset {
      background: rgba(232, 241, 249, 0.5);
      border: 1px solid rgba(232, 244, 251, 0.5);
    }

    &--gold {
      background: rgba(251, 242, 233, 0.5);
      border: 1px solid #fbf2e9;
      padding: 12px 16px;
    }

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__title {
      display: flex;
      align-items: center;
      gap: 4px;

      strong {
        color: var(--g-kit-black-80);
        font-size: var(--g-kit-font-size-omicron);
        font-weight: var(--g-kit-font-weight-bold);
        line-height: var(--g-kit-line-height-omicron);
      }

      .info-icon {
        width: 20px;
        height: 20px;
      }
    }

    &__subtitle {
      display: block;
      margin-top: 4px;
      color: var(--g-kit-black-60);
      font-size: var(--g-kit-font-size-sigma);
      font-weight: var(--g-kit-font-weight-normal);
      line-height: var(--g-kit-line-height-sigma);
    }

    &__sub-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 4px;

      .mobile-dashboard-card__subtitle {
        margin-top: 0;
      }
    }

    /* Stats for EGC / OGC */
    &__stats {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;

      .stat-col {
        display: flex;
        flex-direction: column;
        width: 60px;

        &__label {
          color: var(--g-kit-black-50);
          font-size: var(--g-kit-font-size-omega);
          font-weight: var(--g-kit-font-weight-normal);
          line-height: var(--g-kit-line-height-omega);
        }

        &__val {
          color: var(--g-kit-black-80);
          font-size: var(--g-kit-font-size-kappa);
          font-weight: var(--g-kit-font-weight-bold);
          line-height: 30px;
        }
      }
    }

    /* Stats for NPL */
    &__stats-split {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;

      .stat-split-col {
        display: flex;
        flex-direction: column;
        width: 110px;

        .stat-col__label {
          color: var(--g-kit-black-50);
          font-size: var(--g-kit-font-size-omega);
          font-weight: var(--g-kit-font-weight-normal);
          line-height: var(--g-kit-line-height-omega);
        }

        .stat-with-badge {
          display: flex;
          align-items: center;
          gap: 6px;

          .stat-col__val {
            color: var(--g-kit-black-80);
            font-size: var(--g-kit-font-size-kappa);
            font-weight: var(--g-kit-font-weight-bold);
            line-height: 30px;
          }
        }
      }
    }

    /* Footer stat for OSL & Omset */
    &__footer-stat {
      display: flex;
      flex-direction: column;
      margin-top: 8px;

      .stat-label {
        color: var(--g-kit-black-50);
        font-size: var(--g-kit-font-size-omega);
        font-weight: var(--g-kit-font-weight-normal);
        line-height: var(--g-kit-line-height-omega);
      }

      .stat-value {
        color: var(--g-kit-black-80);
        font-size: var(--g-kit-font-size-kappa);
        font-weight: var(--g-kit-font-weight-bold);
        line-height: 30px;

        &--huge {
          font-size: 30px;
          line-height: 44px;
        }
      }

      &--large {
        margin-top: 6px;
      }
    }

    /* Gold Card specific */
    &__gold-row {
      display: flex;
      gap: 16px;
      margin-top: 18px;

      .gold-col {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex: 1;

        &__header {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--g-kit-black-60);
          font-size: var(--g-kit-font-size-sigma);
          font-weight: var(--g-kit-font-weight-normal);
          line-height: var(--g-kit-line-height-sigma);

          .gold-chevron {
            width: 14px;
            height: 14px;
          }
        }

        &__value {
          display: flex;
          align-items: baseline;
          gap: 2px;

          .gold-price {
            color: var(--g-kit-black-80);
            font-size: var(--g-kit-font-size-lambda);
            font-weight: var(--g-kit-font-weight-bold);
            line-height: var(--g-kit-line-height-lambda);
          }

          .gold-unit {
            color: var(--g-kit-black-60);
            font-size: var(--g-kit-font-size-sigma);
            font-weight: var(--g-kit-font-weight-normal);
            line-height: var(--g-kit-line-height-sigma);
          }
        }
      }
    }
  }

  /* Badge Green 99% */
  .mobile-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: var(--g-kit-font-size-omega);
    font-weight: var(--g-kit-font-weight-bold);
    line-height: var(--g-kit-line-height-omega);

    &--lime {
      background: #e6f6ea;
      color: #00ab4e;
    }
  }

  /* Progress Bar */
  .mobile-progress-bar {
    width: 100%;
    height: 10px;
    margin-top: 6px;
    border: 1px solid rgba(187, 189, 192, 0.7);
    border-radius: 8px;
    background: var(--g-kit-white);
    overflow: hidden;

    &__fill {
      height: 100%;
      border-radius: 8px;
      background: #40bd63;
    }
  }

  /* 5 Indicator Slider Pills (Figma 136px width, 6px height) */
  .mobile-carousel-indicator {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    margin-top: 16px;

    .mobile-indicator-dot {
      width: 20px;
      height: 6px;
      border: 0;
      padding: 0;
      border-radius: 12px;
      background: var(--g-kit-black-50);
      opacity: 0.2;
      cursor: pointer;
      transition: all 0.25s ease;

      &.is-active {
        width: 40px;
        background: #00ab4e;
        opacity: 1;
      }
    }
  }

  /* 2. Tugasku Card (Figma Node 19034:162427, 328px x 194px, margin-top: 12px) */
  .mobile-task-card {
    margin: 12px 16px 0;
    min-height: 194px;
    padding: 12px 12px 16px;
    border: 1px solid var(--g-kit-black-20);
    border-radius: 12px;
    background: var(--g-kit-white);
    box-shadow: var(--bb-elevation-1);
    box-sizing: border-box;

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 24px;

      h2 {
        display: flex;
        align-items: center;
        gap: 4px;
        margin: 0;
        font-size: var(--g-kit-font-size-omicron);
        font-weight: var(--g-kit-font-weight-bold);
        color: var(--g-kit-black-80);

        b {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 2px 4px;
          border-radius: 10px;
          color: var(--g-kit-white);
          background: #ae1e22;
          font-size: var(--g-kit-font-size-omega);
          font-weight: var(--g-kit-font-weight-bold);
          line-height: 18px;
        }
      }

      button {
        min-height: 24px;
        padding: 3px 10px;
        border: 1px solid #00ab4e;
        border-radius: 4px;
        color: #00ab4e;
        background: var(--g-kit-white);
        font: inherit;
        font-size: var(--g-kit-font-size-omega);
        font-weight: var(--g-kit-font-weight-bold);
        line-height: 18px;
        cursor: pointer;
      }
    }
  }

  .mobile-task-list {
    display: flex;
    flex-direction: column;
    margin-top: 16px;
  }

  .mobile-task-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    min-height: 38px;
    padding: 0;
    border: 0;
    border-bottom: 1px solid var(--g-kit-black-20);
    color: var(--g-kit-black-80);
    background: transparent;
    font: inherit;
    font-size: var(--g-kit-font-size-sigma);
    line-height: 20px;
    text-align: left;
    cursor: pointer;

    &:last-child {
      min-height: 26px;
      border-bottom: 0;
    }

    b {
      color: #00ab4e;
      font-size: var(--g-kit-font-size-lambda);
      font-weight: var(--g-kit-font-weight-bold);
      line-height: 26px;
    }
  }

  /* 3. Menu Favorit Card (Figma Node 19034:162449, 328px x 179px, margin-top: 16px) */
  .mobile-favorite-card {
    margin: 16px 16px 0;
    min-height: 179px;
    padding: 16px 12px;
    border: 1px solid var(--g-kit-black-20);
    border-radius: 12px;
    background: var(--g-kit-white);
    box-shadow: var(--bb-elevation-1);
    box-sizing: border-box;

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 24px;

      h2 {
        margin: 0;
        font-size: var(--g-kit-font-size-omicron);
        font-weight: var(--g-kit-font-weight-bold);
        color: var(--g-kit-black-80);
      }

      button {
        min-height: 24px;
        padding: 3px 10px;
        border: 1px solid #00ab4e;
        border-radius: 4px;
        color: #00ab4e;
        background: var(--g-kit-white);
        font: inherit;
        font-size: var(--g-kit-font-size-omega);
        font-weight: var(--g-kit-font-weight-bold);
        line-height: 18px;
        cursor: pointer;
      }
    }
  }

  .mobile-favorite-body {
    display: flex;
    align-items: flex-start;
    margin-top: 16px;
  }

  .mobile-add-menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 93.33px;
    padding: 0;
    border: 0;
    color: #00ab4e;
    background: transparent;
    font: inherit;
    font-size: var(--g-kit-font-size-sigma);
    font-weight: var(--g-kit-font-weight-bold);
    line-height: 20px;
    text-align: center;
    cursor: pointer;

    &__circle {
      position: relative;
      display: block;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #f8f8f8;
      border: 1px solid #eeeeef;
    }

    &__badge {
      position: absolute;
      top: -2px;
      right: -2px;
      display: grid;
      place-items: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      color: var(--g-kit-white);
      background: #00ab4e;
      font-size: 18px;
      line-height: 1;
      font-weight: var(--g-kit-font-weight-bold);
    }
  }

  /* 4. Accordion Modul Feature Cards (Figma 19034:162461 - 19034:162468, margin-top: 16px) */
  .mobile-feature-card {
    margin: 16px 16px 0;
    border: 1px solid var(--g-kit-black-20);
    border-radius: 12px;
    background: var(--g-kit-white);
    box-shadow: var(--bb-elevation-1);
    box-sizing: border-box;
    overflow: hidden;
  }

  .mobile-feature-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: 56px;
    padding: 16px 12px;
    border: 0;
    color: var(--g-kit-black-80);
    background: var(--g-kit-white);
    font: inherit;
    font-size: var(--g-kit-font-size-omicron);
    text-align: left;
    cursor: pointer;

    strong {
      font-weight: var(--g-kit-font-weight-bold);
      font-size: 16px;
      line-height: 24px;
    }

    img {
      width: 24px;
      height: 24px;
      transition: transform 0.2s ease;

      &.is-open {
        transform: rotate(180deg);
      }
    }
  }

  .mobile-feature-menu {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px 8px;
    padding: 8px 12px 16px;

    button {
      display: grid;
      justify-items: center;
      gap: 8px;
      min-width: 0;
      padding: 0;
      border: 0;
      color: var(--g-kit-black-80);
      background: transparent;
      font: inherit;
      font-size: var(--g-kit-font-size-sigma);
      line-height: 20px;
      text-align: center;
      cursor: pointer;
    }

    .mobile-feature-icon-wrapper {
      display: grid;
      width: 56px;
      height: 56px;
      place-items: center;
      border-radius: 50%;
      background: var(--g-kit-pear-10, #f1f8ec);

      img {
        width: 44px;
        height: 44px;
        object-fit: contain;
      }
    }
  }

  footer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 16px 16px calc(76px + env(safe-area-inset-bottom, 0px));
    font-size: var(--g-kit-font-size-sigma);
  }
}
</style>
