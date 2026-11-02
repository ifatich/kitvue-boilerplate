<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import announcementIcon from '../assets/dashboard/announcement.svg'
import infoIcon from '../assets/dashboard/info.svg'
import chartGrid from '../assets/dashboard/chart-grid.svg'
import chartLine from '../assets/dashboard/chart-line.svg'
import favoriteAddIcon from '../assets/dashboard/add-favorite.svg'
import taskDivider from '../assets/dashboard/divider.svg'

type SidebarRoleId = 'kasir' | 'pinca' | 'penaksir'

interface SidebarMenuGroup {
  label: string
  items: string[]
}

const isMobileOpen = ref(false)
const activeTab = ref<'1 Minggu' | '1 Bulan' | '6 Bulan' | '1 Tahun'>('1 Minggu')
const activeNav = ref('beranda')
const searchMenu = ref('')
const activeRole = ref<SidebarRoleId>('kasir')
const expandedMenuGroups = ref<string[]>([])
const isRoleMenuOpen = ref(false)
const router = useRouter()
const route = useRoute()
const isPengajuanGadaiRoute = computed(() => (
  route.name === 'proto-existing-pengajuan-gadai' || route.name === 'sprint-proto-1-pengajuan-gadai'
))
watch(() => route.name, (name) => {
  if (name === 'proto-existing-pengajuan-gadai' || name === 'sprint-proto-1-pengajuan-gadai') {
    activeNav.value = normalizeMenuSearch('Pengajuan Gadai')
    expandedMenuGroups.value = ['Pinjaman Gadai']
  } else if (name === 'dashboard-kasir') {
    activeNav.value = 'beranda'
  }
}, { immediate: true })
const announcementIndex = ref(0)
const announcementSlides = [
  'SPRINT akan menjalani pemeliharaan pada hari Sabtu 5 Maret 2024 pukul 23.00 WIB sampai dengan Minggu 6 Maret 2024 pukul 04:59 WIB.',
  'Pastikan seluruh transaksi dan pekerjaan tersimpan sebelum jadwal pemeliharaan sistem dimulai.',
  'Gunakan kanal resmi Pegadaian untuk memperoleh informasi terbaru mengenai layanan SPRINT.',
  'Jaga kerahasiaan akun Anda dan jangan membagikan kata sandi kepada siapa pun.',
  'Terima kasih telah menggunakan SPRINT untuk mendukung aktivitas layanan harian Anda.',
]
let announcementTimer: ReturnType<typeof setInterval> | undefined
let announcementSwipeStartX: number | null = null

const sidebarRoles: Record<SidebarRoleId, { label: string; groups: SidebarMenuGroup[] }> = {
  kasir: {
    label: 'Kasir',
    groups: [
      { label: 'Deposito Emas', items: ['Cetak Dokumen Deposito Emas', 'Konfirmasi Pembatalan/Perpanjangan Otomatis', 'Konfirmasi Pembukaan Deposito Emas', 'Konfirmasi Penarikan Deposito Emas', 'Pengajuan Pembatalan/Perpanjangan Otomatis', 'Pengajuan Pembukaan Deposito Emas', 'Pengajuan Penarikan Deposito Emas'] },
      { label: 'E-Form', items: ['Manajemen Transaksi', 'Proses Transaksi'] },
      { label: 'EGC / OGC', items: ['Daftar Leads EGC - CRM', 'EGC Reaktivasi', 'Follow Up EGC - CRM', 'Input Data EGC / OGC'] },
      { label: 'Laporan', items: ['Daftar Pinjaman', 'Dashboard Kinerja Non Gadai', 'Dashboard Program UMK', 'Dashboard Prospek Non Gadai', 'Data Mitra Program UMK', 'Laporan Rekening Deposito Emas', 'OSL Rata Harian', 'Portofolio Kredit', 'Realisasi KPI', 'Riwayat EGC (CRM)', 'Riwayat EGC (Reaktivasi)', 'Saldo List Gadai / Rahn', 'Saldo List Mikro'] },
      { label: 'Manajemen Surat Bukti Gadai / Rahn', items: ['Pembaruan Nomor Seri SBG / SBR', 'Pengajuan Cetak Ulang SBG / SBR'] },
      { label: 'Monitoring', items: ['Laporan Aktivitas Gadai Dari Rumah', 'Laporan Penyelesaian Pinjaman Bermasalah', 'Laporan Restrukturisasi', 'Monitoring Aktivitas Deposito Emas', 'Monitoring Arrum Multiguna Internal', 'Monitoring Program UMK', 'Monitoring Titipan Emas Syariah'] },
      { label: 'Pasca Kredit PUMK', items: ['Realisasi Reklasifikasi PUMK', 'Realisasi Restrukturisasi PUMK'] },
      { label: 'Pembinaan Kredit', items: ['Aktivitas Pembinaan', 'Daftar Pembinaan', 'Riwayat Pembinaan'] },
      { label: 'Penanganan Pinjaman Bermasalah', items: ['Pelunasan Pinjaman Bermasalah', 'Pengajuan Penjualan Lelang Pinjaman Bermasalah', 'Penjualan Lelang Pinjaman Bermasalah'] },
      { label: 'Pinjaman Gadai', items: ['Pencairan Gadai', 'Pengajuan Gadai', 'Pengajuan Gadai dari Rumah'] },
      { label: 'Pinjaman Karyawan', items: ['Pengajuan dan Konfirmasi Pinjaman Karyawan'] },
      { label: 'Pinjaman Non Gadai', items: ['Daftar Pencairan', 'Pencairan Non Gadai'] },
      { label: 'Pinjaman Rahn', items: ['Pencairan Rahn', 'Pengajuan Rahn'] },
      { label: 'Program UMK (PUMK)', items: ['Inquiry Jurnal Transaksi', 'Pelaporan Harian Kas dan Bank PUMK', 'Pembayaran Angsuran dan Pelunasan PUMK', 'Pembayaran PUMK Belum Teridentifikasi', 'Pengembalian Kelebihan Bayar PUMK', 'Permohonan Dana Program UMK', 'Transaksi Kas', 'Transfer Modal Kerja (RAK)'] },
      { label: 'Prospek', items: ['Daftar Prospek', 'Prospek Baru'] },
      { label: 'Restrukturisasi Pinjaman', items: ['Pencairan Restrukturisasi'] },
      { label: 'Titipan Emas Syariah', items: ['Cetak Dokumen Titipan Emas Syariah', 'Pembayaran dan Penebusan Titipan Emas Syariah', 'Pengajuan Titipan Emas Syariah'] },
      { label: 'Utilitas', items: [] },
    ],
  },
  pinca: {
    label: 'Pimpinan Cabang / Pinca',
    groups: [
      { label: 'Canvassing', items: ['Persetujuan Canvassing', 'Persetujuan KCA Take Over'] },
      { label: 'Deposito Emas', items: ['Persetujuan Pembatalan/Perpanjangan Otomatis', 'Persetujuan Pembukaan Deposito Emas', 'Persetujuan Penarikan Deposito Emas'] },
      { label: 'E-Form', items: ['Manajemen Data Nasabah', 'Manajemen Transaksi', 'Proses Data Nasabah', 'Reset Password Tablet E-Form'] },
      { label: 'EGC / OGC', items: ['Daftar Leads EGC - CRM', 'EGC Leads Reaktivasi', 'Follow Up EGC - CRM', 'Input Data EGC/OGC'] },
      { label: 'Laporan', items: ['Closing Aktifitas', 'Closing Tim Sales', 'Closing Unit Kerja', 'Daftar Pinjaman', 'Dashboard Customer Experience', 'Dashboard Kinerja Non Gadai', 'Dashboard Program UMK', 'Dashboard Prospek Non Gadai', 'Dashboard Waskat', 'Data Mitra Program UMK', 'Laporan Penandaan Pinjaman Bermasalah', 'Laporan Rekening Deposito Emas', 'OSL Rata Harian', 'Portofolio Kredit', 'Realisasi KPI', 'Riwayat EGC (Reaktivasi)', 'Riwayat RGC (CRM)', 'Saldo List Gadai/Rahn', 'Saldo List Mikro', 'Status Prospek'] },
      { label: 'Manajemen Surat Bukti Gadai/Rahn', items: ['Cetak Ulang SBG/SBR', 'Persetujuan Cetak Ulang SBG/SBR', 'Persetujuan Pembaruan Nomor Seri SBG/SBR'] },
      { label: 'Monitoring', items: ['Laporan Aktivitas Gadai Dari Rumah', 'Laporan Penyelesaian Pinjaman Bermasalah', 'Laporan Restrukturisasi', 'Monitoring Aktivitas Deposito Emas', 'Monitoring Arrum Multiguna Internal', 'Monitoring Pinjaman Kresna', 'Monitoring Program UMK', 'Monitoring Titipan Emas Syariah', 'Monitoring Waskat'] },
      { label: 'Pasca Kredit PUMK', items: ['Buat Rencana Aktivitas Program UMK', 'Persetujuan Hapus Buku PUMK', 'Persetujuan Reklasifikasi PUMK', 'Persetujuan Restrukturisasi PUMK'] },
      { label: 'Pembinaan Gadai', items: ['Daftar Pembinaan Gadai', 'Delegasi Pembinaan Gadai', 'Persetujuan Pembinaan Gadai', 'Riwayat Pembinaan Gadai'] },
      { label: 'Pembinaan Kredit', items: ['Aktivitas Pembinaan', 'Daftar Pembinaan', 'Riwayat Pembinaan'] },
      { label: 'Penanganan Pinjaman Bermasalah', items: ['Buka Penandaan Pinjaman Bermasalah', 'Penandaan Pinjaman Bermasalah', 'Pengajuan Reklas Pinjaman Bermasalah', 'Persetujuan Lelang Pinjaman Bermasalah'] },
      { label: 'Pengawasan Melekat (Waskat)', items: ['Pelaksanaan Waskat', 'Rencana Waskat', 'Supervisi Waskat'] },
      { label: 'Pinjaman Gadai', items: ['Pengajuan Gadai', 'Pengajuan Gadai Dari Rumah', 'Persetujuan Gadai'] },
      { label: 'Pinjaman Karyawan', items: ['Otorisasi Pencairan Pinjaman Karyawan', 'Pengajuan dan Konfirmasi Pinjaman Karyawan', 'Persetujuan Pinjaman Karyawan', 'Rekomendasi Pinjaman Karyawan'] },
      { label: 'Pinjaman Non Gadai', items: ['Otorisasi Pencairan Non Gadai', 'Persetujuan Non Gadai'] },
      { label: 'Pinjaman Rahn', items: ['Pengajuan Rahn', 'Persetujuan Rahn'] },
      { label: 'Program UMK (PUMK)', items: ['Persetujuan Laporan Harian Kas dan Bank PUMK', 'Persetujuan Program UMK'] },
      { label: 'Restrukturisasi Pinjaman', items: ['Konfirmasi Restrukturisasi', 'Pengajuan Restrukturisasi', 'Persetujuan Buka Blokir', 'Persetujuan Restrukturisasi', 'Survey Restrukturisasi'] },
      { label: 'Titipan Emas Syariah', items: ['Cetak Dokumen Titipan Emas Syariah', 'Pengajuan Titipan Emas Syariah', 'Persetujuan Titipan Emas Syariah'] },
      { label: 'Utilitas', items: ['Tes Print'] },
    ],
  },
  penaksir: {
    label: 'Penaksir',
    groups: [
      { label: 'E-Form', items: ['Manajemen Transaksi', 'Proses Data Nasabah', 'Proses Transaksi'] },
      { label: 'EGC / OGC', items: ['Daftar Leads EGC - CRM', 'EGC Leads Reaktivasi', 'Follow Up EGC - CRM', 'Input Data EGC/OGC'] },
      { label: 'Laporan', items: ['Daftar Pinjaman', 'Dashboard Kinerja Non Gadai', 'OSL Rata Harian', 'Portofolio Kredit', 'Realisasi KPI', 'Riwayat EGC (CRM)', 'Riwayat EGC (Reaktivasi)', 'Saldo List Gadai/Rahn', 'Saldo List Mikro'] },
      { label: 'Manajemen Surat Bukti Gadai/Rahn', items: ['Cetak Ulang SBG/SBR', 'Pembaruan Nomor Seri SBG/SBR', 'Pengajuan Cetak Ulang SBG/SBR'] },
      { label: 'Monitoring', items: ['Monitoring Arrum Multiguna Internal', 'Monitoring Titipan Emas Syariah'] },
      { label: 'Pembinaan Gadai', items: ['Daftar Pembinaan Gadai', 'Delegasi Pembinaan Gadai', 'Riwayat Pembinaan Gadai'] },
      { label: 'Pembinaan Kredit', items: ['Aktivasi Pembinaan', 'Daftar Pembinaan', 'Riwayat Pembinaan'] },
      { label: 'Pengawasan Melekat (Waskat)', items: ['Pelaksanaan Waskat'] },
      { label: 'Pinjaman Gadai', items: ['Pengajuan Gadai Dari Rumah', 'Pengajuan Gadai', 'Verifikasi Gadai', 'Konfirmasi Gadai', 'Persetujuan Gadai', 'Pencairan Gadai', 'Daftar Dokumen'] },
      { label: 'Pinjaman Karyawan', items: ['Pengajuan dan Konfirmasi Pinjaman Karyawan'] },
      { label: 'Pinjaman Non Gadai', items: ['Konfirmasi Non Gadai', 'Pengajuan Non Gadai', 'Proses Survey Non Gadai'] },
      { label: 'Pinjaman Rahn', items: ['Konfirmasi Rahn', 'Pengajuan Rahn', 'Verifikasi Rahn'] },
      { label: 'Prospek', items: ['Daftar Prospek', 'Prospek Baru'] },
      { label: 'Titipan Emas Syariah', items: ['Cetak Dokumen Titipan Emas Syariah', 'Konfirmasi Titipan Emas Syariah', 'Pengajuan Titipan Emas Syariah', 'Persetujuan Titipan Emas Syariah', 'Verifikasi Titipan Emas Syariah'] },
      { label: 'Utilitas', items: ['Tes Print'] },
    ],
  },
}

const roleOptions: { id: SidebarRoleId; label: string }[] = [
  { id: 'kasir', label: sidebarRoles.kasir.label },
  { id: 'pinca', label: sidebarRoles.pinca.label },
  { id: 'penaksir', label: sidebarRoles.penaksir.label },
]

const normalizedSearchMenu = computed(() => normalizeMenuSearch(searchMenu.value))
const filteredMenuGroups = computed(() => {
  const query = normalizedSearchMenu.value
  const groups = sidebarRoles[activeRole.value].groups
  if (!query) return groups

  return groups.flatMap((group) => {
    const matchingItems = group.items.filter((item) => normalizeMenuSearch(item).includes(query))
    if (normalizeMenuSearch(group.label).includes(query)) return [group]
    return matchingItems.length ? [{ ...group, items: matchingItems }] : []
  })
})

const activeRoleLabel = computed(() => sidebarRoles[activeRole.value].label)

// 5 Tugasku matching Figma
const taskItems = [
  { title: 'Pinjaman Rahn', count: 1 },
  { title: 'Pinjaman Non Gadai', count: 1 },
  { title: 'Restrukturisasi Pinjaman', count: 1 },
  { title: 'Pinjaman Karyawan', count: 1 },
  { title: 'Pinjaman Gadai', count: 1 },
]

const trackRef = ref<HTMLElement | null>(null)

function showAnnouncement(index: number) {
  announcementIndex.value = (index + announcementSlides.length) % announcementSlides.length
}

function moveAnnouncement(direction: -1 | 1) {
  showAnnouncement(announcementIndex.value + direction)
}

function startAnnouncementAutoplay() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (announcementTimer) clearInterval(announcementTimer)
  announcementTimer = setInterval(() => moveAnnouncement(1), 5000)
}

function pauseAnnouncementAutoplay() {
  if (!announcementTimer) return
  clearInterval(announcementTimer)
  announcementTimer = undefined
}

function handleAnnouncementPointerDown(event: PointerEvent) {
  if (event.button !== 0 || (event.target instanceof Element && event.target.closest('button'))) return
  announcementSwipeStartX = event.clientX
  if (event.currentTarget instanceof HTMLElement) {
    event.currentTarget.setPointerCapture(event.pointerId)
  }
}

function handleAnnouncementPointerUp(event: PointerEvent) {
  if (announcementSwipeStartX === null) return
  const swipeDistance = event.clientX - announcementSwipeStartX
  announcementSwipeStartX = null
  if (Math.abs(swipeDistance) >= 40) moveAnnouncement(swipeDistance < 0 ? 1 : -1)
}

function resetAnnouncementPointer() {
  announcementSwipeStartX = null
}

function handleAnnouncementFocusOut(event: FocusEvent) {
  if (event.currentTarget instanceof HTMLElement && event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return
  startAnnouncementAutoplay()
}

onMounted(startAnnouncementAutoplay)
onUnmounted(pauseAnnouncementAutoplay)

function normalizeMenuSearch(value: string) {
  return value.trim().toLocaleLowerCase('id-ID').replace(/\s+/g, ' ')
}

function isMenuGroupExpanded(label: string) {
  if (expandedMenuGroups.value.includes(label)) return true

  return normalizedSearchMenu.value !== '' && filteredMenuGroups.value.some(
    (group) => group.label === label && group.items.length > 0,
  )
}

function menuGroupPanelId(label: string) {
  const normalizedLabel = label.toLocaleLowerCase('id-ID').replace(/[^a-z0-9]+/g, '-')
  return `cms-nav-group-${activeRole.value}-${normalizedLabel}`
}

function toggleMenuGroup(label: string) {
  if (!sidebarRoles[activeRole.value].groups.find((group) => group.label === label)?.items.length) return

  expandedMenuGroups.value = expandedMenuGroups.value.includes(label)
    ? expandedMenuGroups.value.filter((group) => group !== label)
    : [...expandedMenuGroups.value, label]
}

function selectMenuItem(label: string) {
  activeNav.value = normalizeMenuSearch(label)
  isMobileOpen.value = false

  if (normalizeMenuSearch(label) === 'pengajuan gadai') {
    const formPath = route.path.startsWith('/sprint-proto-1')
      ? '/sprint-proto-1/pengajuan-gadai'
      : '/proto-existing/pengajuan-gadai'
    void router.push(formPath)
  }
}

function selectRole(roleId: SidebarRoleId) {
  activeRole.value = roleId
  searchMenu.value = ''
  expandedMenuGroups.value = []
  isRoleMenuOpen.value = false
  activeNav.value = 'beranda'
}

function scrollTrack(direction: 'left' | 'right') {
  if (!trackRef.value) return
  const offset = direction === 'left' ? -280 : 280
  trackRef.value.scrollBy({ left: offset, behavior: 'smooth' })
}

function selectNav(id: string) {
  activeNav.value = id
  isMobileOpen.value = false
  if (id === 'beranda') {
    void router.push({ name: 'dashboard-kasir' })
  }
}
</script>

<template>
  <div class="cms-layout" :class="{ 'cms-layout--form': isPengajuanGadaiRoute }">
    <!-- Backdrop for Mobile Drawer -->
    <div
      v-if="isMobileOpen"
      class="cms-backdrop"
      aria-hidden="true"
      @click="isMobileOpen = false"
    />

    <!-- Side Nav (Figma: width 240px, Logo 70px, Search 48px, Feature Mapping) -->
    <aside
      class="cms-sidebar"
      :class="{ 'cms-sidebar--mobile-open': isMobileOpen }"
      aria-label="Navigasi Kasir"
    >
      <!-- Logo Block (Height: 70px) -->
      <div class="cms-sidebar__brand">
        <div style="display: flex; align-items: center; gap: 8px;">
          <!-- Official SPRINT SVG Logo -->
          <svg viewBox="0 0 31.1 43.3" width="22" height="30" fill="none" style="flex-shrink: 0;">
            <path d="M2.47 43.31L27.63 30.82L23.43 23.76L6.29 32.57C3.96 33.6 1.89 35.93 2.15 38.78L2.47 43.31Z" fill="#BFD72F" />
            <path d="M0.01 20.72L25.17 32.05L29.09 30.17C32.09 28.88 31.57 25.51 28.53 24.34L6.42 13.73L0.01 20.72Z" fill="#00AB4F" />
            <path d="M0.01 14.37L0 20.7L19.97 10.58L21.74 13.99L28.99 1.36L14.44 0L16.05 3.43L3.05 10.04C1.18 10.94 0.01 12.24 0.01 14.37Z" fill="#004D43" />
          </svg>
          <span style="font-size: 18px; font-weight: 800; color: #004d43; letter-spacing: -0.3px;">
            SPRINT
          </span>
        </div>

        <!-- Mobile Close Button inside sidebar -->
        <button
          class="cms-sidebar__close-btn"
          type="button"
          aria-label="Tutup Menu"
          @click="isMobileOpen = false"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <!-- Search Bar Block -->
      <div class="cms-sidebar__search">
        <div class="cms-sidebar-search-box">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#939597" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            v-model="searchMenu"
            type="text"
            placeholder="Cari Menu"
            aria-label="Cari menu navigasi"
          />
        </div>
      </div>
      <!-- Role-based Navigation List -->
      <nav class="cms-sidebar__nav" aria-label="Menu fitur">
        <button
          class="cms-nav-item"
          :class="{ 'cms-nav-item--active': activeNav === 'beranda' }"
          type="button"
          title="Beranda"
          :aria-current="activeNav === 'beranda' ? 'page' : undefined"
          @click="selectNav('beranda')"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="cms-nav-item__label">Beranda</span>
          <svg class="cms-nav-item__chevron" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <div
          v-for="group in filteredMenuGroups"
          :key="group.label"
          class="cms-nav-group"
        >
          <button
            class="cms-nav-item cms-nav-item--group"
            :class="{ 'cms-nav-item--active': activeNav === `group:${group.label}` }"
            type="button"
            :title="group.label"
            :aria-expanded="group.items.length ? isMenuGroupExpanded(group.label) : undefined"
            :aria-controls="group.items.length ? menuGroupPanelId(group.label) : undefined"
            @click="toggleMenuGroup(group.label)"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
              <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span class="cms-nav-item__label">{{ group.label }}</span>
            <svg
              v-if="group.items.length"
              class="cms-nav-item__chevron"
              :class="{ 'cms-nav-item__chevron--expanded': isMenuGroupExpanded(group.label) }"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <div
            v-if="group.items.length && isMenuGroupExpanded(group.label)"
            :id="menuGroupPanelId(group.label)"
            class="cms-nav-group__items"
          >
            <button
              v-for="item in group.items"
              :key="`${group.label}-${item}`"
              class="cms-nav-item cms-nav-item--child"
              :class="{ 'cms-nav-item--active': activeNav === normalizeMenuSearch(item) }"
              type="button"
              :title="item"
              :aria-current="activeNav === normalizeMenuSearch(item) ? 'page' : undefined"
              @click="selectMenuItem(item)"
            >
              <span class="cms-nav-item__label">{{ item }}</span>
            </button>
          </div>
        </div>

        <p v-if="normalizedSearchMenu && filteredMenuGroups.length === 0" class="cms-sidebar__empty">
          Menu tidak ditemukan
        </p>
      </nav>

    </aside>

    <!-- Main Container -->
    <main class="cms-main">
      <!-- Top Header (Figma: Height 70px, Riwayat, Notifikasi, Divider, User) -->
      <header class="cms-header">
        <div class="cms-header__left">
          <!-- Mobile Hamburger Toggle Button -->
          <button
            class="cms-mobile-menu-btn"
            type="button"
            aria-label="Toggle Menu Mobile"
            @click="isMobileOpen = !isMobileOpen"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>


        <div class="cms-header__right">
          <!-- Riwayat -->
          <button class="cms-header-link" type="button" aria-label="Riwayat Transaksi">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#004d43" stroke-width="2" stroke-linecap="round">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span>Riwayat</span>
          </button>

          <!-- Notifikasi -->
          <button class="cms-header-link" type="button" aria-label="Notifikasi">
            <div style="position: relative; display: inline-flex;">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#004d43" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <!-- Red Badge Indicator (10px) -->
              <span style="position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; border-radius: 50%; background: #ae1e22;" />
            </div>
            <span>Notifikasi</span>
          </button>

          <!-- Line Divider (44px) -->
          <div class="cms-header-divider" />

          <!-- User Profile -->
          <div class="cms-header-role-picker" @keydown.esc="isRoleMenuOpen = false">
            <button
              class="cms-header-user"
              type="button"
              aria-haspopup="menu"
              :aria-expanded="isRoleMenuOpen"
              @click="isRoleMenuOpen = !isRoleMenuOpen"
            >
            <div style="display: flex; flex-direction: column; text-align: left;">
              <span style="font-size: 14px; font-weight: 800; color: #004d43; line-height: 20px;">THORIQ SADAD</span>
              <span style="font-size: 12px; font-weight: 600; color: #004d43; line-height: 18px;">{{ activeRoleLabel }}</span>
            </div>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#004d43" stroke-width="2" stroke-linecap="round">
              <path d="M19 9l-7 7-7-7" />
            </svg>
            </button>
            <div v-if="isRoleMenuOpen" class="cms-role-menu" role="menu" aria-label="Pilih role">
              <button
                v-for="role in roleOptions"
                :key="role.id"
                class="cms-role-menu__item"
                :class="{ 'cms-role-menu__item--active': activeRole === role.id }"
                type="button"
                role="menuitem"
                @click="selectRole(role.id)"
              >
                {{ role.label }}
              </button>
            </div>
          </div>
        </div>
      </header>

      <RouterView v-if="isPengajuanGadaiRoute" />

      <!-- Area Konten (Figma: Breadcrumbs, Title, Welcome Banner, Dashboard, 3-Columns) -->
      <div v-else class="cms-content">
        <!-- Breadcrumbs (Height: 52px) -->
        <nav class="cms-breadcrumbs" aria-label="Breadcrumb">
          <span style="font-size: 14px; font-weight: 600; color: #58585b;">Beranda</span>
        </nav>

        <div class="under-breadcrumbs">
          <!-- Page Title -->
          <h1 class="cms-page-title">Beranda</h1>

          <!-- Welcome Banner (Figma: #f8fbea top + #004d43 announcement bottom) -->
          <section class="cms-welcome-banner">
            <div class="cms-welcome-banner__top">
              <h2 class="cms-welcome-banner__greeting">Halo, Bianca!</h2>
              <p class="cms-welcome-banner__desc">
                Berikut ringkasan hasil pencapaian <strong>CP Salemba</strong>. Pantau selalu Tugasku yang Anda miliki dan selesaikan agar kinerja Anda terjaga.
              </p>
            </div>
            <div
              class="cms-welcome-banner__announcement"
              role="region"
              aria-roledescription="carousel"
              aria-label="Pengumuman"
              @pointerdown="handleAnnouncementPointerDown"
              @pointerup="handleAnnouncementPointerUp"
              @pointercancel="resetAnnouncementPointer"
              @mouseenter="pauseAnnouncementAutoplay"
              @mouseleave="startAnnouncementAutoplay"
              @focusin="pauseAnnouncementAutoplay"
              @focusout="handleAnnouncementFocusOut"
            >
              <div class="cms-announcement-content">
                <div class="cms-announcement-heading">
                  <img :src="announcementIcon" alt="" aria-hidden="true">
                  <span>Pengumuman</span>
                </div>
                <p :key="announcementIndex" class="cms-announcement-text">
                  {{ announcementSlides[announcementIndex] }}
                </p>
                <div class="cms-announcement-dots" aria-label="Pilih pengumuman">
                  <button
                    v-for="(_, index) in announcementSlides"
                    :key="index"
                    class="cms-dot"
                    :class="index === announcementIndex ? 'cms-dot--active' : 'cms-dot--idle'"
                    type="button"
                    :aria-label="`Pengumuman ${index + 1}`"
                    :aria-current="index === announcementIndex ? 'true' : undefined"
                    @click="showAnnouncement(index)"
                  />
                </div>
              </div>
              <button class="cms-btn-announcement" type="button">Lihat Semua</button>
            </div>
          </section>

          <!-- Dashboard Metrics Carousel Section -->
          <section class="cms-dashboard-container">
            <h2 class="cms-dashboard-header">Dashboard</h2>
            <div class="cms-dashboard-track-wrap">
              <!-- Left Circular Arrow Button -->
              <button
                class="cms-carousel-btn cms-carousel-btn--prev"
                type="button"
                aria-label="Previous Metric"
                @click="scrollTrack('left')"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <!-- Metrics Scrollable Track -->
              <div ref="trackRef" class="cms-dashboard-track">
                <!-- Metric 1: EGC / OGC -->
                <div class="cms-metric-card cms-metric-card--gold">
                  <div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                      <span style="font-size: 16px; font-weight: 800; color: #252528;">EGC / OGC</span>
                      <img :src="infoIcon" alt="" aria-hidden="true">
                    </div>
                    <div style="font-size: 13px; font-weight: 600; color: #58585b; margin-top: 2px;">Pencapaian per Pegawai</div>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                    <div>
                      <div style="font-size: 11px; font-weight: 600; color: #939597;">Referral</div>
                      <div style="font-size: 20px; font-weight: 800; color: #252528;">2</div>
                    </div>
                    <div>
                      <div style="font-size: 11px; font-weight: 600; color: #939597;">Closing</div>
                      <div style="font-size: 20px; font-weight: 800; color: #252528;">0</div>
                    </div>
                    <div>
                      <div style="font-size: 11px; font-weight: 600; color: #939597;">Total XP</div>
                      <div style="font-size: 20px; font-weight: 800; color: #252528;">0</div>
                    </div>
                  </div>
                </div>

                <!-- Metric 2: OSL -->
                <div class="cms-metric-card cms-metric-card--green">
                  <div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                      <span style="font-size: 16px; font-weight: 800; color: #252528;">OSL</span>
                      <img :src="infoIcon" alt="" aria-hidden="true">
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 2px;">
                      <span style="font-size: 13px; font-weight: 600; color: #58585b;">OSL Gross</span>
                      <span style="background: #e6f6ea; color: #40bd63; font-size: 11px; font-weight: 800; padding: 1px 6px; border-radius: 4px;">99%</span>
                    </div>
                    <!-- Progress Bar -->
                    <div style="width: 100%; height: 8px; background: #e0e0e1; border-radius: 4px; overflow: hidden; margin-top: 6px;">
                      <div style="width: 99%; height: 100%; background: #00ab4e; border-radius: 4px;" />
                    </div>
                  </div>
                  <div>
                    <div style="font-size: 11px; font-weight: 600; color: #939597;">Pencapaian</div>
                    <div style="font-size: 20px; font-weight: 800; color: #252528; white-space: nowrap;">Rp 100,5 M / 105,6 M</div>
                  </div>
                </div>

                <!-- Metric 3: NPL -->
                <div class="cms-metric-card cms-metric-card--kiwi">
                  <div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                      <span style="font-size: 16px; font-weight: 800; color: #252528;">NPL</span>
                      <img :src="infoIcon" alt="" aria-hidden="true">
                    </div>
                    <div style="font-size: 13px; font-weight: 600; color: #58585b; margin-top: 2px;">Kualitas Kredit</div>
                  </div>
                  <div style="display: flex; gap: 12px;">
                    <div>
                      <div style="font-size: 11px; font-weight: 600; color: #939597;">Skor Gadai</div>
                      <div style="display: flex; align-items: center; gap: 4px;">
                        <span style="font-size: 18px; font-weight: 800; color: #252528;">0,29</span>
                        <span style="background: #e6f6ea; color: #40bd63; font-size: 10px; font-weight: 800; padding: 1px 4px; border-radius: 4px;">99%</span>
                      </div>
                    </div>
                    <div>
                      <div style="font-size: 11px; font-weight: 600; color: #939597;">Skor Non Gadai</div>
                      <div style="display: flex; align-items: center; gap: 4px;">
                        <span style="font-size: 18px; font-weight: 800; color: #252528;">0,05</span>
                        <span style="background: #f9e7e8; color: #ae1e22; font-size: 10px; font-weight: 800; padding: 1px 4px; border-radius: 4px;">50%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Metric 4: Omset -->
                <div class="cms-metric-card cms-metric-card--blue">
                  <div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                      <span style="font-size: 16px; font-weight: 800; color: #252528;">Omset</span>
                      <img :src="infoIcon" alt="" aria-hidden="true">
                    </div>
                    <div style="font-size: 13px; font-weight: 600; color: #58585b; margin-top: 2px;">Per Posisi</div>
                  </div>
                  <div>
                    <div style="font-size: 11px; font-weight: 600; color: #939597;">Tercapai</div>
                    <div style="font-size: 30px; line-height: 44px; font-weight: 800; color: #252528;">Rp 2,57 M</div>
                  </div>
                </div>

                <!-- Metric 5: Profitabilitas -->
                <div class="cms-metric-card cms-metric-card--turquoise">
                  <div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                      <span style="font-size: 16px; font-weight: 800; color: #252528;">Profitabilitas</span>
                      <img :src="infoIcon" alt="" aria-hidden="true">
                    </div>
                    <div style="font-size: 13px; font-weight: 600; color: #58585b; margin-top: 2px;">Total</div>
                  </div>
                  <div>
                    <div style="font-size: 30px; line-height: 44px; font-weight: 800; color: #252528;">61,5%</div>
                  </div>
                </div>

                <!-- Metric 6: Harga Tabungan Emas -->
                <div class="cms-metric-card cms-metric-card--white cms-metric-card--gold-price">
                  <div>
                    <span style="font-size: 15px; font-weight: 800; color: #252528;">Harga Tabungan Emas</span>
                    <div style="font-size: 12px; font-weight: 600; color: #939597; margin-top: 2px;">10 Januari 2024</div>
                  </div>
                  <div style="display: flex; justify-content: space-between; gap: 8px;">
                    <div style="flex: 1 1 auto; background: #f8f8f8; padding: 6px 10px; border-radius: 6px;">
                      <div style="font-size: 11px; font-weight: 600; color: #58585b;">Beli Emas</div>
                      <div style="font-size: 14px; font-weight: 800; color: #252528;">Rp 5.000 <span style="font-size: 10px; font-weight: 400; color: #939597;">/ 0,01 gr</span></div>
                    </div>
                    <div style="flex: 1 1 auto; background: #f8f8f8; padding: 6px 10px; border-radius: 6px;">
                      <div style="font-size: 11px; font-weight: 600; color: #58585b;">Jual Emas</div>
                      <div style="font-size: 14px; font-weight: 800; color: #252528;">Rp 5.000 <span style="font-size: 10px; font-weight: 400; color: #939597;">/ 0,01 gr</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Circular Arrow Button -->
              <button
                class="cms-carousel-btn cms-carousel-btn--next"
                type="button"
                aria-label="Next Metric"
                @click="scrollTrack('right')"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </section>

          <!-- 3-Column Split Content (Figma: Performa Cabang + Tugasku + Menu Favorit) -->
          <section class="cms-split-grid">
            <!-- Col 1: Performa Cabang -->
            <article class="cms-panel-card">
              <header class="cms-panel-card__header">
                <h2 class="cms-panel-title">Performa Cabang</h2>
                <button class="cms-chart-select" type="button" aria-label="Pilih indikator performa">
                  OSL
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </header>

              <div class="cms-chart-tabs" role="group" aria-label="Periode performa cabang">
                  <button
                    v-for="t in (['1 Minggu', '1 Bulan', '6 Bulan', '1 Tahun'] as const)"
                    :key="t"
                    :class="{ 'cms-chart-tab--active': activeTab === t }"
                    type="button"
                    :aria-pressed="activeTab === t"
                    @click="activeTab = t"
                  >
                    {{ t }}
                  </button>
              </div>

              <div class="cms-chart">
                <div class="cms-chart__y-axis" aria-hidden="true">
                  <span v-for="value in ['125 M', '100 M', '75 M', '50 M', '25 M', '0']" :key="value">{{ value }}</span>
                </div>
                <div class="cms-chart__plot">
                  <div class="cms-chart__grid" aria-hidden="true">
                    <img v-for="line in 6" :key="line" :src="chartGrid" alt="">
                  </div>
                  <img class="cms-chart__line" :src="chartLine" alt="Grafik performa cabang" />
                  <div class="cms-chart-tooltip">
                    <span>07 Okt 2026</span>
                    <strong>Rp 75 M</strong>
                  </div>
                  <span class="cms-chart__point" aria-hidden="true" />
                </div>
              </div>
              <div class="cms-chart__x-axis" aria-hidden="true">
                <span v-for="date in ['01/10', '02/10', '03/10', '04/10', '05/10', '06/10', '07/10']" :key="date">
                  {{ date }}
                </span>
              </div>
            </article>

            <!-- Col 2: Tugasku (5 Items) -->
            <article class="cms-panel-card">
              <header class="cms-panel-card__header">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <h2 class="cms-panel-title">Tugasku</h2>
                  <span class="cms-task-count">
                    5
                  </span>
                </div>
                <button class="cms-panel-action" type="button">
                  Lihat Semua
                </button>
              </header>

              <div class="cms-task-list">
                <div
                  v-for="(t, idx) in taskItems"
                  :key="`${t.title}-${idx}`"
                  class="cms-task-row"
                >
                  <span style="font-size: 14px; font-weight: 600; color: #252528;">{{ t.title }}</span>
                  <span class="cms-task-row__count">{{ t.count }}</span>
                  <img v-if="idx < taskItems.length - 1" class="cms-task-divider" :src="taskDivider" alt="" aria-hidden="true">
                </div>
              </div>
            </article>

            <!-- Col 3: Menu Favorit -->
            <article class="cms-panel-card">
              <header class="cms-panel-card__header">
                <h2 class="cms-panel-title">Menu Favorit</h2>
                <button class="cms-panel-action" type="button">
                  Atur
                </button>
              </header>

              <div class="cms-favorite-content">
                <button class="cms-favorite-add" type="button" aria-label="Tambah menu favorit">
                  <img :src="favoriteAddIcon" alt="" aria-hidden="true">
                  <span>Tambah<br>Menu</span>
                </button>
              </div>
            </article>
          </section>
        </div>
      </div>

      <!-- Footer (Height: 48px, Figma: Versi dev 0.0.20) -->
      <footer class="cms-footer" :class="{ 'cms-footer--form': isPengajuanGadaiRoute }">
        <template v-if="isPengajuanGadaiRoute">
          <span>Copyright © 2024 PT. Pegadaian (Persero), All Rights Reserved.</span>
          <span>Version 0.0.29</span>
        </template>
        <template v-else>
          Copyright © 2024 PT. Pegadaian (Persero), All Rights Reserved. Versi dev 0.0.20
        </template>
      </footer>
    </main>
  </div>
</template>

<style lang="css" scoped>
  .cms-layout--form :deep(.pengajuan-gadai-content) {
    width: unset;
    margin: unset;
    padding: 16px 24px 24px;
  }

  .cms-layout--form :deep(.pengajuan-gadai-breadcrumb) {
    margin-bottom: 16px;
    padding-bottom: 16px;
    margin-top: 16px;
  }

  .cms-content {
    align-self: center;
    width: 100%;
    padding: 0 0 24px;
    gap: 24px;
  }

  .cms-breadcrumbs {
    height: auto;
    padding: 16px 24px 15px;
    gap: 6px;
    line-height: 20px;
  }

  .under-breadcrumbs {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 24px;
    padding: 0 24px;
  }

  .cms-welcome-banner__top {
    background: #f8fbea;
    padding: 24px;
  }

  .cms-dashboard-container {
    width: 100%;
    padding: 12px 16px 24px;
  }

  .cms-dashboard-header {
    margin: 0 0 16px;
    padding: 0;
  }

  .cms-dashboard-track {
    padding: 0;
  }

  .cms-metric-card {
    height: 144px;
    padding: 10px 12px 12px;
  }

  .cms-metric-card img {
    width: 20px;
    height: 20px;
  }

  .cms-metric-card--kiwi {
    border: 1px solid #f8f7d3;
    background: rgba(248, 251, 234, 0.5);
  }

  .cms-metric-card--blue {
    border: 1px solid rgba(232, 244, 251, 0.5);
    background: rgba(232, 241, 249, 0.5);
  }

  .cms-metric-card--turquoise {
    border: 1px solid rgba(230, 246, 243, 0.5);
    background: rgba(230, 246, 243, 0.5);
  }

  .cms-metric-card--gold-price {
    width: 290px;
  }

  .cms-metric-value--osl {
    font-size: 20px !important;
    line-height: 30px;
  }

  .cms-metric-value--large {
    font-size: 30px !important;
    line-height: 44px;
  }

  .cms-split-grid {
    width: 100%;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: start;
    gap: 24px;
  }

  .cms-panel-card {
    min-width: 0;
    padding: 12px 16px 24px;
  }

  .cms-panel-card:first-child,
  .cms-panel-card:nth-child(2) {
    height: 342px;
  }

  .cms-panel-card:nth-child(3) {
    height: 189px;
  }

  .cms-panel-card__header {
    flex: 0 0 auto;
    margin-bottom: 16px;
  }

  .cms-panel-title {
    font-size: 20px;
    line-height: 30px;
  }

  .cms-chart-select,
  .cms-panel-action {
    display: inline-flex;
    min-height: 24px;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 3px 10px;
    border: 1px solid var(--g-kit-lime-50);
    border-radius: 4px;
    background: var(--g-kit-white);
    color: var(--g-kit-lime-50);
    cursor: pointer;
    font-size: 12px;
    font-weight: var(--g-kit-font-weight-bold);
    line-height: 18px;
    white-space: nowrap;
  }

  .cms-chart-tabs {
    display: flex;
    flex: 0 0 auto;
    gap: 4px;
    margin-bottom: 12px;
  }

  .cms-chart-tabs button {
    min-height: 32px;
    padding: 5px 10px;
    border: 1px solid var(--g-kit-black-40);
    border-radius: 6px;
    background: var(--g-kit-white);
    color: var(--g-kit-black-60);
    cursor: pointer;
    font-size: 14px;
    font-weight: var(--g-kit-font-weight-normal);
    line-height: 20px;
    white-space: nowrap;
  }

  .cms-chart-tabs .cms-chart-tab--active {
    border-color: var(--g-kit-lime-50);
    color: var(--g-kit-lime-50);
  }

  .cms-chart {
    display: flex;
    flex: 1 1 auto;
    min-height: 0;
    width: 100%;
    gap: 8px;
  }

  .cms-chart__y-axis {
    display: flex;
    flex: 0 0 34px;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 4px;
    color: var(--g-kit-black-60);
    font-size: 10px;
    font-weight: var(--g-kit-font-weight-normal);
    line-height: 14px;
  }

  .cms-chart__plot {
    position: relative;
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
  }

  .cms-chart__grid {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .cms-chart__grid img {
    display: block;
    width: 100%;
    height: 14px;
  }

  .cms-chart__line {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: fill;
  }

  .cms-chart-tooltip {
    position: absolute;
    top: 42%;
    right: 12%;
    z-index: 1;
    display: flex;
    flex-direction: column;
    padding: 4px 8px;
    border-radius: 4px;
    background: var(--g-kit-white);
    box-shadow: var(--g-kit-shadow-card);
    color: var(--g-kit-black-80);
    font-size: 10px;
    line-height: 14px;
    white-space: nowrap;
  }

  .cms-chart-tooltip strong {
    font-size: 14px;
    line-height: 20px;
  }

  .cms-chart__point {
    position: absolute;
    top: 30%;
    right: 4%;
    width: 12px;
    height: 12px;
    border: 2px solid rgba(0, 171, 78, 0.4);
    border-radius: 50%;
    background: var(--g-kit-lime-50);
    box-shadow: inset 0 0 0 2px var(--g-kit-white);
  }

  .cms-chart__x-axis {
    display: flex;
    flex: 0 0 auto;
    justify-content: space-between;
    margin: 4px 0 0 42px;
    color: var(--g-kit-black-60);
    font-size: 10px;
    font-weight: var(--g-kit-font-weight-normal);
    line-height: 14px;
  }

  .cms-task-count {
    display: inline-flex;
    min-width: 18px;
    height: 20px;
    align-items: center;
    justify-content: center;
    padding: 1px 5px;
    border-radius: 10px;
    background: var(--g-kit-red-50);
    color: var(--g-kit-white);
    font-size: 12px;
    font-weight: var(--g-kit-font-weight-bold);
    line-height: 18px;
  }

  .cms-task-list {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    width: 100%;
  }

  .cms-task-row {
    position: relative;
    display: flex;
    min-height: 45px;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
  }

  .cms-task-row__count {
    color: var(--g-kit-lime-50);
    font-size: 14px;
    font-weight: var(--g-kit-font-weight-bold);
  }

  .cms-task-divider {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 1px;
  }

  .cms-favorite-content {
    display: flex;
    flex: 1 1 auto;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
  }

  .cms-favorite-add {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    border: 0;
    background: transparent;
    color: var(--g-kit-lime-50);
    cursor: pointer;
    font-size: 14px;
    font-weight: var(--g-kit-font-weight-bold);
    line-height: 20px;
    text-align: center;
  }

  .cms-favorite-add img {
    display: block;
    width: 56px;
    height: 59px;
  }

  @media (max-width: 1199px) {
    .cms-content {
      padding: 0 0 24px;
    }

    .cms-split-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .cms-panel-card:first-child {
      grid-column: span 2;
    }

    .cms-panel-card:nth-child(3) {
      height: 189px;
    }
  }

  @media (max-width: 767px) {
    .cms-content {
      padding: 0 0 24px;
      gap: 16px;
    }

    .cms-breadcrumbs {
      padding: 12px 16px;
    }

    .under-breadcrumbs {
      gap: 16px;
      padding: 0 16px;
    }

    .cms-split-grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 16px;
    }

    .cms-panel-card:first-child {
      grid-column: auto;
    }

    .cms-panel-card:first-child,
    .cms-panel-card:nth-child(2) {
      height: auto;
      min-height: 342px;
    }

    .cms-panel-card:nth-child(3) {
      height: 189px;
    }

    .cms-chart-tabs {
      gap: 4px;
      overflow-x: auto;
    }

    .cms-chart-tabs button {
      padding-right: 8px;
      padding-left: 8px;
      font-size: 12px;
    }

    .cms-metric-card--gold-price {
      width: 290px;
    }
  }
</style>
