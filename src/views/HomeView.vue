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

const router = useRouter()
const openPengajuan = () => router.push('/pengajuan-rahn')
const openModule = ref<string | null>('Pengajuan')
const chevronDown = chevronDownAsset as unknown as string
const infoIcon = infoIconAsset as unknown as string

const tasks = [
  { label: 'Pengajuan', value: '2' },
  { label: 'Konfirmasi', value: '99+' },
  { label: 'Verifikasi', value: '99+' },
]

const modules = [
  { title: 'Pengajuan', label: 'Pengajuan Gadai/Rahn', icon: rahnIcon as unknown as string, to: '/pengajuan-rahn', slot: 'submission' },
  { title: 'Konfirmasi', label: 'Konfirmasi Gadai/Rahn', icon: confirmationIcon as unknown as string, to: '/pengajuan-rahn', slot: 'confirmation' },
  { title: 'Verifikasi', label: 'Verifikasi Gadai/Rahn', icon: verificationIcon as unknown as string, to: '/pengajuan-rahn', slot: 'verification' },
  { title: 'Laporan', label: 'Daftar Pinjaman', icon: reportIcon as unknown as string, to: '/pengajuan-rahn', slot: 'report' },
]

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
      <!-- Desktop Grid Layout -->
      <div class="entry-grid">
        <section class="panel dashboard-panel">
          <h1>Dashboard</h1>
          <div class="metric-row">
            <article class="metric-card metric-card--lime">
              <strong>OSL</strong>
              <span>OSL Gross</span>
              <div class="progress"><span /></div>
              <small>Pencapaian</small>
              <b>Rp 100,5 M / 105,6 M</b>
            </article>
            <article class="metric-card metric-card--yellow">
              <strong>NPL</strong>
              <span>Kualitas Kredit</span>
              <div class="metric-pair">
                <div><small>Skor Gadai</small><b>0,29</b></div>
                <div><small>Skor Non Gadai</small><b>0,05</b></div>
              </div>
            </article>
            <article class="metric-card metric-card--blue">
              <strong>Omset</strong>
              <span>Per Posisi</span>
              <small>Tercapai</small>
              <b class="metric-value">Rp 2,57 M</b>
            </article>
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

        <section
          v-for="module in modules"
          :key="module.title"
          :class="['panel', 'module-panel', `module-panel--${module.slot}`]"
        >
          <h2>{{ module.title }}</h2>
          <button type="button" class="module-link" @click="router.push(module.to)">
            <span class="module-icon"><img :src="module.icon" alt="" /></span>
            <span>{{ module.label }}</span>
          </button>
        </section>

        <section class="panel favorite-panel">
          <div class="panel-heading">
            <h2>Menu Favorit</h2>
            <button type="button" @click="openPengajuan">Atur</button>
          </div>
          <button type="button" class="add-menu" @click="openPengajuan">
            <span>+</span>
            Tambah<br />Menu
          </button>
        </section>
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
  width: min(calc(100% - 32px), 1152px);
  margin: 24px auto 18px;
}

.entry-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px 24px;
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

.dashboard-panel {
  grid-column: 1 / span 2;
  min-height: 226px;
}

.task-panel {
  grid-column: 3;
  grid-row: 1;
  min-height: 226px;
}

h1,
h2 {
  margin: 0;
  color: var(--g-kit-black-80);
  font-size: var(--g-kit-font-size-kappa);
  font-weight: var(--g-kit-font-weight-bold);
  line-height: var(--g-kit-line-height-kappa);
}

.metric-row {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  overflow: hidden;
}

.metric-card {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  min-height: 120px;
  padding: 12px;
  border: 1px solid var(--g-kit-black-20);
  border-radius: 8px;

  &--lime {
    background: var(--g-kit-lime-10);
  }

  &--yellow {
    background: var(--g-kit-yellow-10);
  }

  &--blue {
    background: var(--g-kit-blue-10);
  }

  strong {
    color: var(--g-kit-black-80);
    font-size: var(--g-kit-font-size-omicron);
    font-weight: var(--g-kit-font-weight-bold);
  }

  span {
    margin-top: 4px;
    color: var(--g-kit-black-60);
    font-size: var(--g-kit-font-size-sigma);
  }

  small {
    margin-top: auto;
    color: var(--g-kit-black-50);
    font-size: var(--g-kit-font-size-omega);
  }

  b {
    color: var(--g-kit-black-80);
    font-size: var(--g-kit-font-size-kappa);
    font-weight: var(--g-kit-font-weight-bold);
  }
}

.metric-value {
  margin-top: 6px;
  font-size: var(--g-kit-font-size-epsilon) !important;
}

.progress {
  height: 10px;
  margin: 8px 0;
  overflow: hidden;
  border: 1px solid var(--g-kit-black-40);
  border-radius: 8px;
  background: var(--g-kit-white);

  span {
    display: block;
    width: 99%;
    height: 100%;
    margin: 0;
    background: var(--g-kit-lime-40);
  }
}

.metric-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: auto;

  small {
    display: block;
    margin: 0;
  }

  b {
    display: block;
    margin-top: 3px;
  }
}

.panel-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 span {
    padding: 2px 5px;
    border-radius: 10px;
    color: var(--g-kit-white);
    background: var(--g-kit-lime-50);
    font-size: var(--g-kit-font-size-omega);
  }

  button {
    padding: 3px 10px;
    border: 1px solid var(--g-kit-lime-50);
    border-radius: 4px;
    color: var(--g-kit-lime-50);
    background: var(--g-kit-white);
    font: inherit;
    font-size: var(--g-kit-font-size-omega);
    font-weight: var(--g-kit-font-weight-bold);
    cursor: pointer;
  }
}

.task-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 16px 0;
  border: 0;
  border-bottom: 1px solid var(--g-kit-black-20);
  color: var(--g-kit-black-80);
  background: transparent;
  font: inherit;
  font-size: var(--g-kit-font-size-sigma);
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

.module-panel {
  min-height: 186px;

  &--submission {
    grid-column: 1;
    grid-row: 2;
  }

  &--confirmation {
    grid-column: 2;
    grid-row: 2;
  }

  &--verification {
    grid-column: 1;
    grid-row: 3;
  }

  &--report {
    grid-column: 3;
    grid-row: 3;
  }
}

.favorite-panel {
  grid-column: 3;
  grid-row: 2;
}

.module-link {
  display: grid;
  justify-items: center;
  gap: 8px;
  width: 104px;
  margin-top: 16px;
  border: 0;
  color: var(--g-kit-black-80);
  background: transparent;
  font: inherit;
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  text-align: center;
  cursor: pointer;
}

.module-icon {
  display: grid;
  width: 56px;
  height: 56px;
  place-items: center;

  img {
    width: 56px;
    height: 56px;
    object-fit: contain;
  }
}

.add-menu {
  display: grid;
  justify-items: center;
  gap: 8px;
  width: 104px;
  margin-top: 16px;
  border: 0;
  color: var(--g-kit-lime-50);
  background: transparent;
  font: inherit;
  font-size: var(--g-kit-font-size-sigma);
  font-weight: var(--g-kit-font-weight-bold);
  line-height: var(--g-kit-line-height-sigma);
  cursor: pointer;

  span {
    display: grid;
    width: 20px;
    height: 20px;
    place-items: center;
    border-radius: 50%;
    color: var(--g-kit-white);
    background: var(--g-kit-lime-50);
    font-size: 20px;
    line-height: 20px;
  }
}

footer {
  margin-top: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid var(--g-kit-black-20);
  color: var(--g-kit-black-60);
  background: var(--g-kit-white);
  font-size: var(--g-kit-font-size-omicron);
  font-weight: var(--g-kit-font-weight-normal);
}

@media (max-width: 900px) {
  .entry-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard-panel {
    grid-column: span 2;
  }

  .task-panel,
  .module-panel--submission,
  .module-panel--confirmation,
  .module-panel--verification,
  .module-panel--report,
  .favorite-panel {
    grid-column: auto;
    grid-row: auto;
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
