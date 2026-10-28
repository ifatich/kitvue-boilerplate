<script setup lang="ts">
/**
 * @file HomeView.vue
 * @description Official Entry Point template from Figma Singe UI Terra Fase 2 Sprint (Node 232:83245).
 * Features SPRINT header, interactive metrics carousel (EGC/OGC, OSL, NPL, Omset, Harga Emas),
 * TJSL quick action icons, Tugasku task card with navigation, Menu Favorit, and Monitoring widgets.
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SprintNavbar from '@/components/shared/admin-layout/SprintNavbar.vue'
import { GModal, GButton, GBadge } from '@/components'

const router = useRouter()

// Carousel Slide State
const carouselOffset = ref(0)
const maxSlide = 3 // Jumlah offset maksimal

const nextSlide = () => {
  if (carouselOffset.value < maxSlide) {
    carouselOffset.value++
  } else {
    carouselOffset.value = 0
  }
}

const prevSlide = () => {
  if (carouselOffset.value > 0) {
    carouselOffset.value--
  } else {
    carouselOffset.value = maxSlide
  }
}

// Modal State
const isFavoriteModalOpen = ref(false)

const handleTaskClick = () => {
  // Arahkan langsung ke Base Container / Admin Dashboard
  router.push('/admin')
}
</script>

<template>
  <div class="sprint-entry-page">
    <!-- SPRINT Header -->
    <SprintNavbar />

    <main class="entry-main-container" role="main">
      <!-- 2-Column Responsive Grid -->
      <div class="entry-layout-grid">
        <!-- ================= LEFT COLUMN ================= -->
        <div class="left-content-column">
          <!-- SECTION 1: DASHBOARD METRICS CAROUSEL -->
          <section class="dashboard-metrics-section" aria-labelledby="heading-dashboard">
            <h2 id="heading-dashboard" class="section-heading">Dashboard</h2>

            <div class="carousel-container-outer">
              <!-- Chevron Prev -->
              <button
                type="button"
                class="carousel-nav-btn prev-btn"
                aria-label="Metrik Sebelumnya"
                @click="prevSlide"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>

              <!-- Carousel Track -->
              <div class="carousel-track-wrapper">
                <div
                  class="carousel-track"
                  :style="{ transform: `translateX(-${carouselOffset * 252}px)` }"
                >
                  <!-- Card 1: EGC / OGC -->
                  <article class="metric-card">
                    <header class="metric-card-header">
                      <div class="title-info-row">
                        <span class="metric-title">EGC / OGC</span>
                        <svg class="info-icon" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <span class="metric-subtitle">Pencapaian per Pegawai</span>
                    </header>

                    <div class="stats-three-cols">
                      <div class="stat-col">
                        <span class="col-label">Referral</span>
                        <strong class="col-value">2</strong>
                      </div>
                      <div class="stat-col">
                        <span class="col-label">Closing</span>
                        <strong class="col-value">0</strong>
                      </div>
                      <div class="stat-col">
                        <span class="col-label">Total XP</span>
                        <strong class="col-value">0</strong>
                      </div>
                    </div>
                  </article>

                  <!-- Card 2: OSL Gross -->
                  <article class="metric-card">
                    <header class="metric-card-header">
                      <div class="title-info-row">
                        <span class="metric-title">OSL</span>
                        <svg class="info-icon" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="sub-with-badge">
                        <span class="metric-subtitle">OSL Gross</span>
                        <GBadge type="primary" label="99%" />
                      </div>
                    </header>

                    <div class="progress-container">
                      <div class="progress-bar-bg">
                        <div class="progress-bar-fill green-fill" style="width: 99%"></div>
                      </div>
                    </div>

                    <div class="metric-pencapaian-row">
                      <span class="col-label">Pencapaian</span>
                      <strong class="col-value-bold">Rp 100,5 M / 105,6 M</strong>
                    </div>
                  </article>

                  <!-- Card 3: NPL -->
                  <article class="metric-card">
                    <header class="metric-card-header">
                      <div class="title-info-row">
                        <span class="metric-title">NPL</span>
                        <svg class="info-icon" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <span class="metric-subtitle">Kualitas Kredit</span>
                    </header>

                    <div class="stats-two-cols">
                      <div class="stat-col">
                        <span class="col-label">Skor Gadai</span>
                        <div class="val-badge-inline">
                          <strong class="col-value">0,29</strong>
                          <GBadge type="primary" label="99%" />
                        </div>
                      </div>
                      <div class="stat-col">
                        <span class="col-label">Skor Non Gadai</span>
                        <div class="val-badge-inline">
                          <strong class="col-value">0,05</strong>
                          <GBadge type="secondary" label="50%" />
                        </div>
                      </div>
                    </div>
                  </article>

                  <!-- Card 4: Omset -->
                  <article class="metric-card">
                    <header class="metric-card-header">
                      <div class="title-info-row">
                        <span class="metric-title">Omset</span>
                        <svg class="info-icon" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <span class="metric-subtitle">Per Posisi</span>
                    </header>
                    <div class="metric-pencapaian-row mt-3">
                      <span class="col-label">Tercapai</span>
                      <strong class="col-value-bold text-success">Rp 2,57 M</strong>
                    </div>
                  </article>

                  <!-- Card 5: Profitabilitas -->
                  <article class="metric-card">
                    <header class="metric-card-header">
                      <div class="title-info-row">
                        <span class="metric-title">Profitabilitas</span>
                        <svg class="info-icon" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <span class="metric-subtitle">Total</span>
                    </header>
                    <div class="metric-pencapaian-row mt-3">
                      <span class="col-label">Rasio Profit</span>
                      <strong class="col-value-bold">61,5%</strong>
                    </div>
                  </article>
                </div>
              </div>

              <!-- Chevron Next -->
              <button
                type="button"
                class="carousel-nav-btn next-btn"
                aria-label="Metrik Berikutnya"
                @click="nextSlide"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          </section>

          <!-- SECTION 2: TJSL -->
          <section class="entry-widget-card tjsl-card" aria-labelledby="heading-tjsl">
            <h3 id="heading-tjsl" class="widget-card-title">TJSL</h3>

            <div class="action-icons-row">
              <!-- Action 1: Pengajuan Proposal -->
              <button
                type="button"
                class="app-icon-action-btn"
                @click="router.push('/admin')"
              >
                <div class="icon-circle-bg icon-folder">
                  <!-- Folder Document SVG -->
                  <svg viewBox="0 0 36 36" fill="none" class="feature-svg">
                    <rect x="4" y="6" width="28" height="24" rx="4" fill="#E6F4F1" stroke="#00A651" stroke-width="2" />
                    <path d="M4 14H32" stroke="#00A651" stroke-width="2" />
                    <circle cx="26" cy="10" r="3" fill="#00A651" />
                    <path d="M26 8.5V11.5M24.5 10H27.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
                  </svg>
                </div>
                <span class="action-label">Pengajuan Proposal</span>
              </button>

              <!-- Action 2: Survey Proposal -->
              <button
                type="button"
                class="app-icon-action-btn"
                @click="router.push('/admin')"
              >
                <div class="icon-circle-bg icon-clipboard">
                  <!-- Clipboard SVG -->
                  <svg viewBox="0 0 36 36" fill="none" class="feature-svg">
                    <rect x="6" y="8" width="24" height="24" rx="4" fill="#E6F4F1" stroke="#00A651" stroke-width="2" />
                    <rect x="12" y="4" width="12" height="6" rx="2" fill="#00A651" />
                    <path d="M12 16H24M12 21H20" stroke="#00A651" stroke-width="2" stroke-linecap="round" />
                  </svg>
                </div>
                <span class="action-label">Survey Proposal</span>
              </button>
            </div>
          </section>
        </div>

        <!-- ================= RIGHT COLUMN ================= -->
        <div class="right-content-column">
          <!-- WIDGET 1: TUGASKU -->
          <article class="entry-widget-card" aria-labelledby="heading-tugasku">
            <header class="widget-header-row">
              <div class="widget-title-badge-group">
                <h3 id="heading-tugasku" class="widget-card-title">Tugasku</h3>
                <span class="badge-notif-red">2</span>
              </div>
              <button
                type="button"
                class="btn-widget-action"
                @click="router.push('/admin')"
              >
                Lihat Semua
              </button>
            </header>

            <div class="task-list-body">
              <button
                type="button"
                class="task-list-item-btn"
                @click="handleTaskClick"
              >
                <span class="task-item-name">TJSL</span>
                <span class="task-item-count">2</span>
              </button>
            </div>
          </article>

          <!-- WIDGET 2: MENU FAVORIT -->
          <article class="entry-widget-card" aria-labelledby="heading-favorit">
            <header class="widget-header-row">
              <h3 id="heading-favorit" class="widget-card-title">Menu Favorit</h3>
              <button
                type="button"
                class="btn-widget-action"
                @click="isFavoriteModalOpen = true"
              >
                Atur
              </button>
            </header>

            <div class="favorite-menu-body">
              <button
                type="button"
                class="add-favorite-btn"
                @click="isFavoriteModalOpen = true"
              >
                <div class="add-circle-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#00A651" stroke-width="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" stroke-linecap="round" />
                    <line x1="5" y1="12" x2="19" y2="12" stroke-linecap="round" />
                  </svg>
                </div>
                <span class="add-menu-label">Tambah Menu</span>
              </button>
            </div>
          </article>

          <!-- WIDGET 3: MONITORING -->
          <article class="entry-widget-card" aria-labelledby="heading-monitoring">
            <header class="widget-header-row">
              <h3 id="heading-monitoring" class="widget-card-title">Monitoring</h3>
            </header>

            <div class="action-icons-row mt-2">
              <button
                type="button"
                class="app-icon-action-btn"
                @click="router.push('/admin')"
              >
                <div class="icon-circle-bg icon-laptop">
                  <svg viewBox="0 0 36 36" fill="none" class="feature-svg">
                    <rect x="6" y="8" width="24" height="16" rx="2" fill="#E6F4F1" stroke="#00A651" stroke-width="2" />
                    <path d="M3 26H33" stroke="#00A651" stroke-width="2" stroke-linecap="round" />
                    <rect x="10" y="14" width="3" height="6" fill="#00A651" />
                    <rect x="16" y="11" width="3" height="9" fill="#00A651" />
                    <rect x="22" y="16" width="3" height="4" fill="#00A651" />
                  </svg>
                </div>
                <span class="action-label">Dashboard Kinerja</span>
              </button>

              <button
                type="button"
                class="app-icon-action-btn"
                @click="router.push('/admin')"
              >
                <div class="icon-circle-bg icon-laptop">
                  <svg viewBox="0 0 36 36" fill="none" class="feature-svg">
                    <rect x="6" y="8" width="24" height="16" rx="2" fill="#E6F4F1" stroke="#00A651" stroke-width="2" />
                    <path d="M3 26H33" stroke="#00A651" stroke-width="2" stroke-linecap="round" />
                    <circle cx="18" cy="14" r="3" fill="#00A651" />
                    <path d="M13 22C13 19.5 15.2 18 18 18C20.8 18 23 19.5 23 22" fill="#00A651" />
                  </svg>
                </div>
                <span class="action-label">Dashboard Prospek</span>
              </button>
            </div>
          </article>
        </div>
      </div>

      <!-- Global Footer -->
      <footer class="sprint-entry-footer">
        <p>Copyright © 2024 PT. Pegadaian (Persero). All Rights Reserved.</p>
      </footer>
    </main>

    <!-- Modal Atur Menu Favorit (Kitvue GModal) -->
    <GModal
      v-model="isFavoriteModalOpen"
      title="Atur Menu Favorit"
      size="md"
    >
      <div class="favorite-modal-content">
        <p class="modal-desc">Pilih menu cepat yang ingin Anda tampilkan pada halaman utama:</p>
        <div class="menu-choice-list">
          <label class="menu-choice-item">
            <input type="checkbox" checked />
            <span>Pengajuan E-Form / E-FDN</span>
          </label>
          <label class="menu-choice-item">
            <input type="checkbox" checked />
            <span>TJSL - Survey Proposal</span>
          </label>
          <label class="menu-choice-item">
            <input type="checkbox" />
            <span>Simulasi Pembiayaan Emas</span>
          </label>
          <label class="menu-choice-item">
            <input type="checkbox" />
            <span>Monitoring Portofolio Gadai</span>
          </label>
        </div>
      </div>
      <template #footer>
        <div class="d-flex justify-content-end gap-2">
          <GButton
            label="Batal"
            type="secondary"
            size="md"
            @click="isFavoriteModalOpen = false"
          />
          <GButton
            label="Simpan Perubahan"
            type="primary"
            size="md"
            @click="isFavoriteModalOpen = false"
          />
        </div>
      </template>
    </GModal>
  </div>
</template>

<style scoped>
.sprint-entry-page {
  min-height: 100vh;
  background-color: #f8fafc;
  background-image: radial-gradient(#e2e8f0 0.8px, transparent 0.8px);
  background-size: 24px 24px;
  display: flex;
  flex-direction: column;
}

.entry-main-container {
  flex: 1;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 24px 48px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Grid Layout */
.entry-layout-grid {
  display: grid;
  grid-template-columns: minmax(0, 760px) minmax(0, 368px);
  gap: 24px;
  justify-content: center;
}

.left-content-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}

.right-content-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

/* Section Headings */
.section-heading {
  font-size: 1.25rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 16px;
  letter-spacing: -0.01em;
}

/* Carousel */
.carousel-container-outer {
  position: relative;
  display: flex;
  align-items: center;
}

.carousel-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #334155;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
}

.carousel-nav-btn:hover {
  background: #00A651;
  color: #ffffff;
  border-color: #00A651;
}

.carousel-nav-btn svg {
  width: 18px;
  height: 18px;
}

.prev-btn {
  left: -18px;
}

.next-btn {
  right: -18px;
}

.carousel-track-wrapper {
  overflow: hidden;
  width: 100%;
  padding: 4px 0;
}

.carousel-track {
  display: flex;
  gap: 16px;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Metric Cards */
.metric-card {
  flex: 0 0 236px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 144px;
}

.metric-card-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title-info-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.metric-title {
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
}

.info-icon {
  width: 16px;
  height: 16px;
  color: #94a3b8;
}

.metric-subtitle {
  font-size: 11px;
  color: #64748b;
}

.sub-with-badge {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.badge-percent-green {
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  background-color: #ecfdf5;
  color: #00A651;
  border-radius: 4px;
}

.badge-percent-red {
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  background-color: #fef2f2;
  color: #ef4444;
  border-radius: 4px;
}

.stats-three-cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding-top: 12px;
}

.stats-two-cols {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding-top: 10px;
}

.stat-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.col-label {
  font-size: 11px;
  color: #64748b;
}

.col-value {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0f172a;
}

.col-value-bold {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0f172a;
}

.val-badge-inline {
  display: flex;
  align-items: center;
  gap: 6px;
}

.progress-container {
  margin: 6px 0;
}

.progress-bar-bg {
  width: 100%;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar-fill.green-fill {
  height: 100%;
  background-color: #00A651;
  border-radius: 9999px;
}

.metric-pencapaian-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* Entry Widget Cards */
.entry-widget-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.widget-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.widget-title-badge-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.widget-card-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.badge-notif-red {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #dc2626;
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
}

.btn-widget-action {
  padding: 4px 12px;
  border: 1px solid #00A651;
  background: #ffffff;
  color: #00A651;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-widget-action:hover {
  background-color: #f0fdf4;
}

/* TJSL & Monitoring Actions */
.action-icons-row {
  display: flex;
  gap: 24px;
}

.app-icon-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: transform 0.15s ease;
}

.app-icon-action-btn:hover {
  transform: translateY(-2px);
}

.icon-circle-bg {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background-color: #e6f4f1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-svg {
  width: 28px;
  height: 28px;
}

.action-label {
  font-size: 12px;
  font-weight: 600;
  color: #334155;
  text-align: center;
}

/* Task List */
.task-list-body {
  border-top: 1px solid #f1f5f9;
  padding-top: 12px;
}

.task-list-item-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  background: transparent;
  border: none;
  cursor: pointer;
  border-bottom: 1px solid #f8fafc;
  transition: background-color 0.15s ease;
}

.task-list-item-btn:hover {
  background-color: #f8fafc;
}

.task-item-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.task-item-count {
  font-size: 14px;
  font-weight: 700;
  color: #00A651;
}

/* Favorite Menu */
.favorite-menu-body {
  display: flex;
  align-items: center;
  padding-top: 8px;
}

.add-favorite-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
}

.add-circle-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 2px dashed #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.add-favorite-btn:hover .add-circle-icon {
  border-color: #00A651;
  background-color: #f0fdf4;
}

.add-circle-icon svg {
  width: 20px;
  height: 20px;
}

.add-menu-label {
  font-size: 12px;
  font-weight: 700;
  color: #00A651;
}

/* Footer */
.sprint-entry-footer {
  text-align: center;
  padding: 24px 0 0;
  color: #64748b;
  font-size: 13px;
}

/* Modal Styling */
.favorite-modal-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.menu-choice-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 8px 0;
}

.menu-choice-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #1e293b;
  cursor: pointer;
}

.modal-footer-btns {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
}

.btn-modal-cancel {
  padding: 8px 18px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
}

.btn-modal-save {
  padding: 8px 20px;
  background: #00A651;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
}

/* Responsive */
@media (max-width: 1080px) {
  .entry-layout-grid {
    grid-template-columns: 1fr;
  }
}
</style>
