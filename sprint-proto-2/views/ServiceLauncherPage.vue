<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch, type CSSProperties } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import chevronRightIcon from 'kitvue-public/src/assets/icon/icon-system/icon-chevron-right.svg'
import infoIcon from 'kitvue-public/src/assets/icon/icon-system/icon-info.svg'
import searchIcon from 'kitvue-public/src/assets/icon/icon-system/icon-search-v2.svg'
import bannerThoriq from '../assets/welcome-banner/thoriq.svg'
import bannerSparkles from '../assets/welcome-banner/sparkles.svg'
import bannerHairBack from '../assets/welcome-banner/hair-back.svg'
import bannerLeftUpperArm from '../assets/welcome-banner/left-upper-arm.svg'
import bannerHandDetail from '../assets/welcome-banner/hand-detail.svg'
import bannerDaster from '../assets/welcome-banner/daster.svg'
import bannerNeck from '../assets/welcome-banner/neck.svg'
import bannerRightJacket from '../assets/welcome-banner/right-jacket.svg'
import bannerUnion from '../assets/welcome-banner/union.svg'
import bannerNotebook from '../assets/welcome-banner/notebook.svg'
import bannerNotebookDetail from '../assets/welcome-banner/notebook-detail.svg'
import bannerHighlight from '../assets/welcome-banner/highlight.svg'
import bannerHead from '../assets/welcome-banner/head.svg'
import bannerLeftJacket from '../assets/welcome-banner/left-jacket.svg'
import bannerRightUpperArm from '../assets/welcome-banner/right-upper-arm.svg'
import bannerRightLowerArm from '../assets/welcome-banner/right-lower-arm.svg'
import bannerLeftThumb from '../assets/welcome-banner/left-thumb.svg'
import bannerLeftHand from '../assets/welcome-banner/left-hand.svg'
import bannerHandSparkle from '../assets/welcome-banner/hand-sparkle.svg'
import bannerNotification from '../assets/welcome-banner/notification.svg'
import favoriteAddIcon from '../assets/favorites/add-menu.svg'
import slipGajiIcon from '../assets/notifications/slip-gaji.png'
import claimManagementIcon from '../assets/notifications/claim-management.png'
import recommendationIconBase from '../assets/notifications/recommendation-base.svg'
import recommendationIconOverlay from '../assets/notifications/recommendation-overlay.svg'
import verificationIconBase from '../assets/notifications/verification-base.svg'
import verificationIconDocument from '../assets/notifications/verification-document.svg'
import verificationIconDetail from '../assets/notifications/verification-detail.svg'
import verificationIconHand from '../assets/notifications/verification-hand.svg'
import verificationIconBadge from '../assets/notifications/verification-badge.svg'
import infoCreditDueIcon from '../assets/notifications/info-credit-due.png'
import infoCashReportIcon from '../assets/notifications/info-cash-report.png'

type SidebarRoleId = 'kasir' | 'pinca' | 'penaksir'
const chevronRightIconUrl = chevronRightIcon as unknown as string
const infoIconUrl = infoIcon as unknown as string
const searchIconUrl = searchIcon as unknown as string

const props = withDefaults(defineProps<{ initialRole?: SidebarRoleId }>(), {
  initialRole: 'kasir',
})

const router = useRouter()
const route = useRoute()

// Drawer open/collapsed state (Figma 525:348350 Group 626388 toggle)
const isDrawerOpen = ref(false)
const isMobileNavOpen = ref(false)
const isTablet = ref(false)
const activeRailItem = ref('fitur')
const activeRole = ref<SidebarRoleId>(props.initialRole)
const isRoleMenuOpen = ref(false)
const activeNotifTab = ref<'tugasku' | 'informasi'>('tugasku')
const activeChartFilter = ref<'1 Minggu' | '1 Bulan' | '6 Bulan' | '1 Tahun'>('1 Minggu')
const searchDrawer = ref('')
const expandedMenuGroups = ref(new Set<string>())
const activeMenuItem = ref('')
watch(() => route.name, (name) => {
  if (name === 'proto-existing-pengajuan-gadai' || name === 'sprint-proto-2-pengajuan-gadai') {
    activeRailItem.value = 'beranda'
    isDrawerOpen.value = false
  }
}, { immediate: true })
const isPengajuanGadaiRoute = computed(() => (
  route.name === 'proto-existing-pengajuan-gadai' || route.name === 'sprint-proto-2-pengajuan-gadai'
))
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

function updateViewportState() {
  if (typeof window !== 'undefined') {
    isTablet.value = window.innerWidth >= 768 && window.innerWidth < 1200
  }
}

onMounted(() => {
  updateViewportState()
  window.addEventListener('resize', updateViewportState)
  startAnnouncementAutoplay()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateViewportState)
  pauseAnnouncementAutoplay()
})

function closeBackdrop() {
  isMobileNavOpen.value = false
  if (isTablet.value) {
    isDrawerOpen.value = false
  }
}

interface WelcomeBannerLayer {
  source: string
  box: CSSProperties
  image: CSSProperties
}

const welcomeBannerLayers: WelcomeBannerLayer[] = [
  {
    source: bannerThoriq,
    box: { left: '80.19px', top: '14.74px', width: '155.885px', height: '175.128px' },
    image: { width: '143.394px', height: '164.351px', transform: 'rotate(-4.51deg)' },
  },
  {
    source: bannerSparkles,
    box: { left: '84.91px', top: 0, width: '129.243px', height: '67.061px' },
    image: { width: '100%', height: '100%' },
  },
  {
    source: bannerHairBack,
    box: { left: '29.11px', top: '29.2px', width: '76.21px', height: '113.904px' },
    image: { width: '56.494px', height: '104.758px', transform: 'scaleY(-1) rotate(-168.52deg)' },
  },
  {
    source: bannerLeftUpperArm,
    box: { left: '57.15px', top: '95.04px', width: '60.914px', height: '53.312px' },
    image: { width: '39.196px', height: '51.179px', transform: 'scaleY(-1) rotate(108.35deg)' },
  },
  {
    source: bannerHandDetail,
    box: { left: '52.74px', top: '85.36px', width: '19.727px', height: '14.692px' },
    image: { width: '19.727px', height: '14.692px', transform: 'scaleY(-1) rotate(180deg)' },
  },
  {
    source: bannerDaster,
    box: { left: '30.56px', top: '91.37px', width: '59.699px', height: '98.176px' },
    image: { width: '59.699px', height: '98.176px', transform: 'scaleY(-1) rotate(180deg)' },
  },
  {
    source: bannerNeck,
    box: { left: '46.44px', top: '73.38px', width: '28.037px', height: '28.588px' },
    image: { width: '20.847px', height: '21.951px', transform: 'rotate(-24.32deg)' },
  },
  {
    source: bannerRightJacket,
    box: { left: '66.78px', top: '89.85px', width: '32.804px', height: '83.133px' },
    image: { width: '22.496px', height: '80.898px', transform: 'rotate(-7.46deg)' },
  },
  {
    source: bannerUnion,
    box: { left: '77.38px', top: '119.77px', width: '47.703px', height: '30.771px' },
    image: { width: '100%', height: '100%', transform: 'scaleY(-1) rotate(180deg)' },
  },
  {
    source: bannerNotebook,
    box: { left: '77.49px', top: '120.95px', width: '48.187px', height: '30.786px' },
    image: { width: '96.7%', height: '100%', transform: 'scaleY(-1) rotate(180deg)' },
  },
  {
    source: bannerNotebookDetail,
    box: { left: '91.63px', top: '130.08px', width: '22.285px', height: '22.226px' },
    image: { width: '17.613px', height: '17.518px', transform: 'rotate(18.62deg)' },
  },
  {
    source: bannerHighlight,
    box: { left: '98.9px', top: '124.09px', width: '2.888px', height: '2.38px' },
    image: { width: '2.483px', height: '1.664px', transform: 'scaleY(-1) rotate(-18.94deg)' },
  },
  {
    source: bannerHead,
    box: { left: '-0.03px', top: '23.11px', width: '108.866px', height: '118.392px' },
    image: { width: '87.614px', height: '100.559px', transform: 'scaleY(-1) rotate(166.35deg)' },
  },
  {
    source: bannerLeftJacket,
    box: { left: '9.7px', top: '92.55px', width: '55.068px', height: '81.123px' },
    image: { width: '100%', height: '100%' },
  },
  {
    source: bannerRightUpperArm,
    box: { left: '1.04px', top: '92.42px', width: '63.999px', height: '57.062px' },
    image: { width: '37.49px', height: '52.846px', transform: 'rotate(63.63deg)' },
  },
  {
    source: bannerRightLowerArm,
    box: { left: '12.65px', top: '121.12px', width: '47.278px', height: '34.386px' },
    image: { width: '42.505px', height: '24.638px', transform: 'scaleY(-1) rotate(165.68deg)' },
  },
  {
    source: bannerLeftThumb,
    box: { left: '66.9px', top: '117.74px', width: '10.179px', height: '9.719px' },
    image: { width: '8.195px', height: '7.452px', transform: 'rotate(19.06deg)' },
  },
  {
    source: bannerLeftHand,
    box: { left: '50.79px', top: '110.45px', width: '25.3px', height: '30.331px' },
    image: { width: '17.807px', height: '25.939px', transform: 'rotate(19.06deg)' },
  },
  {
    source: bannerHandSparkle,
    box: { left: '102.76px', top: '134.08px', width: '16.757px', height: '15.012px' },
    image: { width: '100%', height: '100%' },
  },
]

// Tier 1 Rail Navigation Items matching Figma Kasir 12
const railTopItems = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'fitur', label: 'Fitur' },
  { id: 'notifikasi', label: 'Notifikasi', badge: true },
  { id: 'riwayat', label: 'Riwayat' },
]

const railBottomItems = [
  { id: 'faq', label: 'FAQ' },
  { id: 'profil', label: 'Profil' },
  { id: 'keluar', label: 'Keluar' },
]

interface SidebarMenuGroup {
  label: string
  items: string[]
}

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
      { label: 'Penanganan Pinjaman Bermasalah', items: ['Pelunasan PInjaman Bermasalah', 'Pengajuan Penjualan Lelang Pinjaman Bermasalah', 'Penjualan Lelang Pinjaman Bermasalah'] },
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

const activeRoleLabel = computed(() => sidebarRoles[activeRole.value].label)
const drawerGroups = computed(() => sidebarRoles[activeRole.value].groups)
const filteredDrawerGroups = computed(() => {
  const query = normalizeMenuSearch(searchDrawer.value)
  if (!query) return drawerGroups.value

  return drawerGroups.value.flatMap((group) => {
    const matchingItems = group.items.filter((item) => normalizeMenuSearch(item).includes(query))
    if (normalizeMenuSearch(group.label).includes(query)) return [group]
    return matchingItems.length ? [{ ...group, items: matchingItems }] : []
  })
})

function normalizeMenuSearch(value: string) {
  return value.trim().toLocaleLowerCase('id-ID').replace(/\s+/g, ' ')
}

function focusNotificationTab(tab: 'tugasku' | 'informasi') {
  activeNotifTab.value = tab
  document.getElementById(`proto2-notif-tab-${tab}`)?.focus()
}

// Tasks matching the Figma dashboard list
const taskItems = [
  { title: 'Pinjaman Rahn', count: 1 },
  { title: 'Pinjaman Non Gadai', count: 1 },
  { title: 'Pinjaman Gadai', count: 1 },
  { title: 'Restrukturisasi Pinjaman', count: 1 },
  { title: 'Pinjaman Karyawan', count: 1 },
  { title: 'Penanganan Pinjaman Bermasalah', count: 0 },
  { title: 'Titipan Emas Syariah', count: 0 },
]

type NotificationItem = {
  id: string
  parts: { text: string; strong?: boolean }[]
  time: string
  isUnread: boolean
  icon: 'slip-gaji' | 'claim-management' | 'recommendation' | 'verification' | 'activity' | 'info-credit-due' | 'info-cash-report'
}

const notificationFeed: NotificationItem[] = [
  {
    id: 'initial-payment',
    parts: [
      { text: 'Segera lakukan ' },
      { text: 'Pembayaran Titipan Emas', strong: true },
      { text: ' atas nama ' },
      { text: 'Udin Nganga', strong: true },
      { text: ' dengan jenis transaksi ' },
      { text: 'Pembayaran Awal', strong: true },
      { text: '.' },
    ],
    time: '5 Oktober 2020 | 10:00 WIB',
    isUnread: true,
    icon: 'slip-gaji',
  },
  {
    id: 'item-handover',
    parts: [
      { text: 'Segera ' },
      { text: 'Serah Terima Barang Titipan Emas', strong: true },
      { text: ' atas nama ' },
      { text: 'Annisya Dhelistya', strong: true },
      { text: ' karena ' },
      { text: 'Perlu Taksir Ulang', strong: true },
      { text: '.' },
    ],
    time: '5 Oktober 2020 | 10:00 WIB',
    isUnread: false,
    icon: 'claim-management',
  },
  {
    id: 'employee-loan-recommendation',
    parts: [
      { text: 'Segera tindak lanjuti ' },
      { text: 'Rekomendasi Pinjaman Karyawan', strong: true },
      { text: ' dengan produk ' },
      { text: 'Arrum Multiguna Internal', strong: true },
      { text: ' atas nama nasabah ' },
      { text: 'Annisya Dhelistya', strong: true },
      { text: '.' },
    ],
    time: '27 Jan 2026 | 10:00 WIB',
    isUnread: false,
    icon: 'recommendation',
  },
  {
    id: 'umk-verification',
    parts: [
      { text: 'Segera lakukan ' },
      { text: 'Verifikasi Program UMK', strong: true },
      { text: ' untuk mitra ' },
      { text: 'Thoriq Sadad', strong: true },
      { text: ' dengan nomor pengajuan ' },
      { text: 'PJ-250515-000123', strong: true },
      { text: '.' },
    ],
    time: '27 Jan 2026 | 10:00 WIB',
    isUnread: false,
    icon: 'verification',
  },
  {
    id: 'umk-post-credit-activity',
    parts: [
      { text: 'Segera lakukan ' },
      { text: 'Aktivitas Pasca Kredit Program UMK', strong: true },
      { text: ' untuk mitra ' },
      { text: 'Thoriq Sadad', strong: true },
      { text: ' dengan jenis aktivitas ' },
      { text: 'Pembinaan Kredit', strong: true },
      { text: '.' },
    ],
    time: '27 Jan 2026 | 10:00 WIB',
    isUnread: false,
    icon: 'activity',
  },
]

const informationFeed: NotificationItem[] = [
  {
    id: 'credit-due-tomorrow',
    parts: [
      { text: 'Nasabah dengan nomor kredit ' },
      { text: '1234 5678 9012 3456 7890', strong: true },
      { text: ' sudah memasuki tanggal jatuh tempo 1 hari lagi.' },
    ],
    time: '4 Maret 2024 | 10:00 WIB',
    isUnread: true,
    icon: 'info-credit-due',
  },
  {
    id: 'cash-balance-report',
    parts: [
      { text: 'Laporkan saldo kas dan bank harian setelah jam tutup operasional.' },
    ],
    time: '4 Maret 2024 | 15:00 WIB',
    isUnread: true,
    icon: 'info-cash-report',
  },
  {
    id: 'credit-due-tomorrow-second',
    parts: [
      { text: 'Nasabah dengan nomor kredit ' },
      { text: '1234 5678 9012 3456 7890', strong: true },
      { text: ' sudah memasuki tanggal jatuh tempo 1 hari lagi.' },
    ],
    time: '4 Maret 2024 | 10:00 WIB',
    isUnread: false,
    icon: 'info-credit-due',
  },
  {
    id: 'credit-due-tomorrow-third',
    parts: [
      { text: 'Nasabah dengan nomor kredit ' },
      { text: '1234 5678 9012 3456 7890', strong: true },
      { text: ' sudah memasuki tanggal jatuh tempo 1 hari lagi.' },
    ],
    time: '4 Maret 2024 | 10:00 WIB',
    isUnread: false,
    icon: 'info-credit-due',
  },
]

const activeNotifications = computed(() => (
  activeNotifTab.value === 'tugasku' ? notificationFeed : informationFeed
))

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

function scrollTrack(direction: 'left' | 'right') {
  if (!trackRef.value) return
  const offset = direction === 'left' ? -260 : 260
  trackRef.value.scrollBy({ left: offset, behavior: 'smooth' })
}

function handleRailSelect(id: string) {
  activeRailItem.value = id
  if (id === 'fitur') {
    isDrawerOpen.value = true
    isRoleMenuOpen.value = false
    return
  }

  if (id === 'profil') {
    isRoleMenuOpen.value = !isRoleMenuOpen.value
    return
  }

  isRoleMenuOpen.value = false
  if (id === 'beranda') {
    isDrawerOpen.value = false
    isMobileNavOpen.value = false
    void router.push({ name: 'service-launcher' })
  }
}

function selectRole(role: SidebarRoleId) {
  activeRole.value = role
  activeRailItem.value = 'fitur'
  isDrawerOpen.value = true
  isMobileNavOpen.value = false
  isRoleMenuOpen.value = false
  searchDrawer.value = ''
  activeMenuItem.value = ''
  expandedMenuGroups.value.clear()
}

function isMenuGroupExpanded(groupLabel: string) {
  return Boolean(searchDrawer.value.trim()) || expandedMenuGroups.value.has(groupLabel)
}

function toggleMenuGroup(groupLabel: string) {
  if (expandedMenuGroups.value.has(groupLabel)) {
    expandedMenuGroups.value.delete(groupLabel)
  } else {
    expandedMenuGroups.value.add(groupLabel)
  }
}

function handleDrawerItemClick(groupLabel: string, item: string) {
  activeMenuItem.value = `${groupLabel}:${item}`
  isMobileNavOpen.value = false
  if (isTablet.value) {
    isDrawerOpen.value = false
  }
  if (normalizeMenuSearch(item) === 'pengajuan gadai') {
    activeRailItem.value = 'beranda'
    isDrawerOpen.value = false
    const formPath = route.path.startsWith('/sprint-proto-2')
      ? '/sprint-proto-2/pengajuan-gadai'
      : '/proto-existing/pengajuan-gadai'
    void router.push(formPath)
  }
}
</script>

<template>
  <div class="proto2-layout" :class="{ 'proto2-layout--form': isPengajuanGadaiRoute }">
    <!-- Backdrop for Mobile Drawer & Tablet Overlay Drawer -->
    <div
      v-if="isMobileNavOpen || (isDrawerOpen && isTablet)"
      class="proto2-backdrop"
      aria-hidden="true"
      @click="closeBackdrop"
    />

    <!-- Two-Tier Navigation Shell (Figma Frame 1000001916) -->
    <aside class="proto2-nav-shell" :class="{ 'proto2-nav-shell--mobile-open': isMobileNavOpen }"
      :aria-label="`Navigasi ${activeRoleLabel}`">
      <!-- Tier 1: Dark Green Primary Slim Rail (width: 81px) -->
      <nav class="proto2-rail" aria-label="Menu Utama">
        <div class="proto2-rail__top">
          <!-- SPRINT Square Logo Launcher Button (60x60) -->
          <button class="proto2-rail__logo-btn" type="button" aria-label="SPRINT Home">
            <svg viewBox="0 0 31.1 43.3" width="24" height="33" fill="none">
              <path d="M2.47 43.31L27.63 30.82L23.43 23.76L6.29 32.57C3.96 33.6 1.89 35.93 2.15 38.78L2.47 43.31Z"
                fill="#BFD72F" />
              <path d="M0.01 20.72L25.17 32.05L29.09 30.17C32.09 28.88 31.57 25.51 28.53 24.34L6.42 13.73L0.01 20.72Z"
                fill="#00AB4F" />
              <path
                d="M0.01 14.37L0 20.7L19.97 10.58L21.74 13.99L28.99 1.36L14.44 0L16.05 3.43L3.05 10.04C1.18 10.94 0.01 12.24 0.01 14.37Z"
                fill="#FFFFFF" />
            </svg>
          </button>

          <!-- Top Items: Beranda, Fitur (Active), Notifikasi, Riwayat -->
          <button v-for="item in railTopItems" :key="item.id" class="proto2-rail__item" type="button"
            :aria-label="item.label" @click="handleRailSelect(item.id)">
            <div class="proto2-rail__item-box" :class="{ 'proto2-rail__item-box--active': activeRailItem === item.id }">
              <!-- Icon -->
              <div style="position: relative; display: flex; align-items: center; justify-content: center;">
                <svg v-if="item.id === 'beranda'" viewBox="0 0 24 24" width="22" height="22" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
                </svg>
                <svg v-else-if="item.id === 'fitur'" viewBox="0 0 24 24" width="22" height="22" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                </svg>
                <svg v-else-if="item.id === 'notifikasi'" viewBox="0 0 24 24" width="22" height="22" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <svg v-else viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <!-- Red badge if notifikasi -->
                <span v-if="item.badge"
                  style="position: absolute; top: -1px; right: -2px; width: 8px; height: 8px; border-radius: 50%; background: #ae1e22;" />
              </div>
              <span class="proto2-rail__label">{{ item.label }}</span>
            </div>
          </button>
        </div>

        <!-- Bottom Items: FAQ, Profil, Keluar -->
        <div class="proto2-rail__bottom">
          <button v-for="item in railBottomItems" :key="item.id" class="proto2-rail__item" type="button"
            :aria-label="item.id === 'profil' ? `${item.label}, ganti peran` : item.label"
            :aria-expanded="item.id === 'profil' ? isRoleMenuOpen : undefined"
            @click="handleRailSelect(item.id)">
            <div class="proto2-rail__item-box"
              :class="{ 'proto2-rail__item-box--active': item.id === 'profil' && isRoleMenuOpen }">
              <svg v-if="item.id === 'faq'" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m0 3.5h.01" />
              </svg>
              <svg v-else-if="item.id === 'profil'" viewBox="0 0 24 24" width="20" height="20" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m8-10a4 4 0 110-8 4 4 0 010 8z" />
              </svg>
              <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span class="proto2-rail__label">{{ item.label }}</span>
            </div>
          </button>
        </div>
      </nav>

      <div v-if="isRoleMenuOpen" class="proto2-role-menu" role="menu" aria-label="Pilih peran">
        <p class="proto2-role-menu__title">Pilih peran</p>
        <button v-for="role in (['kasir', 'pinca', 'penaksir'] as const)" :key="role"
          class="proto2-role-menu__item" :class="{ 'proto2-role-menu__item--active': activeRole === role }"
          type="button" role="menuitemradio" :aria-checked="activeRole === role"
          @click="selectRole(role)">
          <span>{{ sidebarRoles[role].label }}</span>
          <span v-if="activeRole === role" aria-hidden="true">✓</span>
        </button>
      </div>

      <!-- Tier 2: Sub-Sidebar Feature Mapping Drawer (width: 244px) -->
      <div class="proto2-drawer" :class="isDrawerOpen ? 'proto2-drawer--open' : 'proto2-drawer--collapsed'">
        <div class="proto2-drawer__content" :aria-hidden="!isDrawerOpen" :inert="!isDrawerOpen">
          <!-- Search bar inside drawer -->
          <div class="proto2-drawer__search">
            <div class="proto2-drawer-search-box">
              <img :src="searchIconUrl" alt="" aria-hidden="true" />
              <input v-model="searchDrawer" type="search" aria-label="Cari menu"
                placeholder="Ketik untuk cari menu" />
            </div>
          </div>

          <!-- Role-specific feature groups -->
          <div class="proto2-drawer__menu">
            <p v-if="searchDrawer.trim() && filteredDrawerGroups.length === 0" class="proto2-drawer-empty">
              Menu tidak ditemukan
            </p>
            <section v-for="group in filteredDrawerGroups" :key="group.label" class="proto2-drawer-group">
              <button type="button" class="proto2-drawer-group__header"
                :aria-expanded="isMenuGroupExpanded(group.label)"
                @click="toggleMenuGroup(group.label)">
                <span>{{ group.label }}</span>
                <img :src="chevronRightIconUrl" alt="" aria-hidden="true"
                  :class="{ 'proto2-drawer-group__chevron--expanded': isMenuGroupExpanded(group.label) }" />
              </button>
              <div v-if="isMenuGroupExpanded(group.label)" class="proto2-drawer-group__items">
                <button v-for="item in group.items" :key="item" type="button"
                  class="proto2-drawer-item"
                  :class="{ 'proto2-drawer-item--active': activeMenuItem === `${group.label}:${item}` }"
                  @click="handleDrawerItemClick(group.label, item)">
                  {{ item }}
                </button>
              </div>
            </section>
          </div>
        </div>

        <!-- Floating Circular Collapse Toggle (Figma Group 626388: 32x32) -->
        <button class="proto2-drawer-toggle" type="button"
          :title="isDrawerOpen ? 'Ciutkan Panel Menu' : 'Buka Panel Menu'" @click="isDrawerOpen = !isDrawerOpen">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round">
            <path v-if="isDrawerOpen" d="M15 19l-7-7 7-7" />
            <path v-else d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </aside>

    <!-- Main Container -->
    <main class="proto2-main" :class="isDrawerOpen ? 'proto2-main--expanded' : 'proto2-main--collapsed'">
      <!-- Mobile App Header Bar -->
      <header class="proto2-mobile-bar">
        <button class="proto2-mobile-toggle-btn" type="button" aria-label="Buka Menu"
          @click="isMobileNavOpen = !isMobileNavOpen">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span style="font-size: 16px; font-weight: 800; color: #004d43;">SPRINT</span>
        <div style="width: 40px;" />
      </header>

      <RouterView v-if="isPengajuanGadaiRoute" />

      <!-- Area Konten (Figma: Area Konten ~1058px) -->
      <div v-else class="proto2-content">
        <h1 class="proto2-page-title">Beranda</h1>
        <div class="proto2-content__under-breadcrumbs">
          <!-- Welcome Banner (with Pegadaian character illustration on the right) -->
          <section class="proto2-welcome-banner">
            <div class="proto2-welcome-banner__top">
              <div class="proto2-welcome-banner__left">
                <h2 class="proto2-welcome-banner__greeting">Halo, Bianca!</h2>
                <p class="proto2-welcome-banner__desc">
                  Berikut ringkasan hasil pencapaian <strong>CP Salemba</strong>. Pantau selalu Tugasku yang Anda miliki
                  dan selesaikan agar kinerja Anda terjaga.
                </p>
              </div>
              <!-- Character Illustration Graphic (SVG vector art) -->
              <div class="proto2-welcome-banner__chars">
                <div class="proto2-banner-art" aria-hidden="true">
                  <span
                    v-for="(layer, index) in welcomeBannerLayers"
                    :key="index"
                    class="proto2-banner-art__layer"
                    :style="layer.box"
                  >
                    <img :src="layer.source" :style="layer.image" alt="" />
                  </span>
                </div>
              </div>
            </div>

            <!-- Bottom Announcement Section -->
            <div
              class="proto2-welcome-banner__announcement"
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
              <div class="proto2-announcement-copy">
                <div class="proto2-announcement-title">
                  <img :src="bannerNotification" alt="" aria-hidden="true" />
                  <span>Pengumuman</span>
                </div>
                <p :key="announcementIndex" class="proto2-announcement-description">
                  {{ announcementSlides[announcementIndex] }}
                </p>
                <div class="proto2-announcement-pagination" aria-label="Pilih pengumuman">
                  <button
                    v-for="(_, index) in announcementSlides"
                    :key="index"
                    type="button"
                    :class="{ 'proto2-announcement-pagination__active': index === announcementIndex }"
                    :aria-label="`Pengumuman ${index + 1}`"
                    :aria-current="index === announcementIndex ? 'true' : undefined"
                    @click="showAnnouncement(index)"
                  />
                </div>
              </div>
              <button type="button" class="proto2-announcement-action">
                Lihat Semua
              </button>
            </div>
          </section>

          <!-- 2-Column Layout (Figma Kasir 12: Left Column 603px + Right Column 383px) -->
          <section class="proto2-two-col">
            <!-- LEFT COLUMN (603px): Dashboard + Notifikasi + Performa Cabang -->
            <div class="proto2-col-left">
              <!-- 1. Dashboard Metrics Carousel -->
              <article class="proto2-card proto2-dashboard-card">
                <h2 class="proto2-card-title proto2-dashboard-title">Dashboard</h2>
                <div class="proto2-dashboard-carousel">
                  <!-- Left Carousel Button -->
                  <button type="button" class="proto2-carousel-btn proto2-carousel-btn--prev" aria-label="Previous"
                    @click="scrollTrack('left')">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"
                      stroke-linecap="round" stroke-linejoin="round">
                      <path d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <!-- Scrollable Track -->
                  <div ref="trackRef" class="proto2-dashboard-track">
                    <!-- EGC / OGC -->
                    <div class="proto2-metric-card proto2-metric-card--egc">
                      <div>
                        <div class="proto2-metric-title-row">
                          <div class="proto2-metric-title">EGC / OGC</div>
                          <img :src="infoIconUrl" alt="" aria-hidden="true" />
                        </div>
                        <div class="proto2-metric-subtitle">Pencapaian per Pegawai</div>
                      </div>
                      <div class="proto2-metric-stats">
                        <div>
                          <div class="proto2-metric-label">Referral</div>
                          <div class="proto2-metric-value">2</div>
                        </div>
                        <div>
                          <div class="proto2-metric-label">Closing</div>
                          <div class="proto2-metric-value">0</div>
                        </div>
                        <div>
                          <div class="proto2-metric-label">Total XP</div>
                          <div class="proto2-metric-value">0</div>
                        </div>
                      </div>
                    </div>

                    <!-- OSL -->
                    <div class="proto2-metric-card proto2-metric-card--osl">
                      <div>
                        <div class="proto2-metric-title-row">
                          <div class="proto2-metric-title">OSL</div>
                          <img :src="infoIconUrl" alt="" aria-hidden="true" />
                        </div>
                        <div class="proto2-metric-progress-label">
                          <span>OSL Gross</span>
                          <span>99%</span>
                        </div>
                        <div class="proto2-metric-progress">
                          <span />
                        </div>
                      </div>
                      <div>
                        <div class="proto2-metric-label">Pencapaian</div>
                        <div class="proto2-metric-value proto2-metric-value--compact">Rp 100,5 M / 105,6 M</div>
                      </div>
                    </div>

                    <!-- NPL -->
                    <div class="proto2-metric-card proto2-metric-card--npl">
                      <div>
                        <div class="proto2-metric-title-row">
                          <div class="proto2-metric-title">NPL</div>
                          <img :src="infoIconUrl" alt="" aria-hidden="true" />
                        </div>
                        <div class="proto2-metric-subtitle">Kualitas Kredit</div>
                      </div>
                      <div class="proto2-metric-stats proto2-metric-stats--npl">
                        <div>
                          <div class="proto2-metric-label">Skor Gadai</div>
                          <div class="proto2-metric-value">0,29 <span>99%</span></div>
                        </div>
                        <div>
                          <div class="proto2-metric-label">Skor Non Gadai</div>
                          <div class="proto2-metric-value">0,05 <span>50%</span></div>
                        </div>
                      </div>
                    </div>

                    <!-- Omset -->
                    <div class="proto2-metric-card proto2-metric-card--omset">
                      <div>
                        <div class="proto2-metric-title-row">
                          <div class="proto2-metric-title">Omset</div>
                          <img :src="infoIconUrl" alt="" aria-hidden="true" />
                        </div>
                        <div class="proto2-metric-subtitle">Per Posisi</div>
                      </div>
                      <div>
                        <div class="proto2-metric-label">Tercapai</div>
                        <div class="proto2-metric-value">Rp 2,57 M</div>
                      </div>
                    </div>
                  </div>

                  <!-- Right Carousel Button -->
                  <button type="button" class="proto2-carousel-btn proto2-carousel-btn--next" aria-label="Next"
                    @click="scrollTrack('right')">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"
                      stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </article>

              <!-- 2. Notifikasi Card (Height ~458px in Figma) -->
              <article class="proto2-notif-card">
                <div class="proto2-notif-header">
                  <h2>Notifikasi</h2>
                </div>

                <!-- Tabs: Tugasku (1) vs Informasi -->
                <div class="proto2-notif-tabs" role="tablist" aria-label="Jenis notifikasi">
                  <button id="proto2-notif-tab-tugasku" class="proto2-notif-tab"
                    :class="{ 'proto2-notif-tab--active': activeNotifTab === 'tugasku' }"
                    type="button" role="tab" aria-controls="proto2-notif-panel"
                    :aria-selected="activeNotifTab === 'tugasku'"
                    :tabindex="activeNotifTab === 'tugasku' ? 0 : -1"
                    @click="activeNotifTab = 'tugasku'" @keydown.right.prevent="focusNotificationTab('informasi')"
                    @keydown.left.prevent="focusNotificationTab('informasi')">
                    <span>Tugasku</span>
                    <span class="proto2-notif-badge"
                      :class="{ 'proto2-notif-badge--active': activeNotifTab === 'tugasku' }">{{ notificationFeed.length }}</span>
                  </button>
                  <button id="proto2-notif-tab-informasi" class="proto2-notif-tab"
                    :class="{ 'proto2-notif-tab--active': activeNotifTab === 'informasi' }" type="button"
                    role="tab" aria-controls="proto2-notif-panel"
                    :aria-selected="activeNotifTab === 'informasi'"
                    :tabindex="activeNotifTab === 'informasi' ? 0 : -1"
                    @click="activeNotifTab = 'informasi'" @keydown.right.prevent="focusNotificationTab('tugasku')"
                    @keydown.left.prevent="focusNotificationTab('tugasku')">
                    <span>Informasi</span>
                    <span class="proto2-notif-badge"
                      :class="{ 'proto2-notif-badge--active': activeNotifTab === 'informasi' }">{{ informationFeed.length }}</span>
                  </button>
                </div>

                <div class="proto2-notif-sort">
                  <span>Urutkan</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M8 5v14m0 0-3-3m3 3 3-3M16 19V5m0 0-3 3m3-3 3 3" />
                  </svg>
                </div>

                <!-- Notification Item Feed -->
                <div id="proto2-notif-panel" class="proto2-notif-list"
                  :class="{ 'proto2-notif-list--information': activeNotifTab === 'informasi' }" role="tabpanel"
                  :aria-labelledby="`proto2-notif-tab-${activeNotifTab}`">
                  <div v-for="item in activeNotifications" :key="item.id" class="proto2-notif-item"
                    :class="{
                      'proto2-notif-item--highlight': item.isUnread,
                      'proto2-notif-item--information': activeNotifTab === 'informasi',
                    }">
                    <!-- Icon Box (40x40) -->
                    <div class="proto2-notif-icon" aria-hidden="true">
                      <img v-if="item.icon === 'slip-gaji'" :src="slipGajiIcon" alt=""
                        class="proto2-notif-icon__full" />
                      <img v-else-if="item.icon === 'claim-management'" :src="claimManagementIcon" alt=""
                        class="proto2-notif-icon__full" />
                      <template v-else-if="item.icon === 'recommendation'">
                        <img :src="recommendationIconBase" alt="" class="proto2-notif-icon__full" />
                        <img :src="recommendationIconOverlay" alt="" class="proto2-notif-icon__recommendation" />
                      </template>
                      <template v-else-if="item.icon === 'verification' || item.icon === 'activity'">
                        <img :src="verificationIconBase" alt="" class="proto2-notif-icon__full" />
                        <img :src="verificationIconDocument" alt="" class="proto2-notif-icon__full" />
                        <img :src="verificationIconDetail" alt="" class="proto2-notif-icon__verification-detail" />
                        <img :src="verificationIconHand" alt="" class="proto2-notif-icon__verification-hand" />
                        <img v-if="item.icon === 'verification'" :src="verificationIconBadge" alt=""
                          class="proto2-notif-icon__verification-badge" />
                      </template>
                      <template v-else>
                        <img :src="item.icon === 'info-credit-due' ? infoCreditDueIcon : infoCashReportIcon" alt=""
                          class="proto2-notif-icon__full" />
                      </template>
                    </div>
                    <!-- Content Body -->
                    <div class="proto2-notif-copy">
                      <p>
                        <template v-for="(part, index) in item.parts" :key="`${item.id}-${index}`">
                          <strong v-if="part.strong">{{ part.text }}</strong>
                          <span v-else>{{ part.text }}</span>
                        </template>
                      </p>
                      <span>{{ item.time }}</span>
                    </div>
                  </div>
                </div>
              </article>

              <!-- 3. Performa Cabang Chart -->
              <article class="proto2-card proto2-performance-card">
                <header class="proto2-performance-header">
                  <h2 class="proto2-card-title">Performa Cabang</h2>
                  <button type="button" class="proto2-performance-select">
                    OSL
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
                      stroke-width="2" aria-hidden="true">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </header>

                <div class="proto2-chart-filters">
                  <button v-for="t in (['1 Minggu', '1 Bulan', '6 Bulan', '1 Tahun'] as const)" :key="t" type="button"
                    :class="{ 'proto2-chart-filter--active': activeChartFilter === t }"
                    @click="activeChartFilter = t">
                    {{ t }}
                  </button>
                </div>

                <div class="proto2-chart">
                  <div class="proto2-chart-axis" aria-hidden="true">
                    <span>125 M</span>
                    <span>100 M</span>
                    <span>75 M</span>
                    <span>50 M</span>
                    <span>25 M</span>
                    <span>0</span>
                  </div>
                  <div class="proto2-chart-plot">
                    <svg viewBox="0 0 500 180" width="100%" height="100%" preserveAspectRatio="none"
                      aria-label="Grafik performa cabang">
                      <line x1="0" y1="8" x2="500" y2="8" stroke="#eeeeef" />
                      <line x1="0" y1="40" x2="500" y2="40" stroke="#eeeeef" />
                      <line x1="0" y1="72" x2="500" y2="72" stroke="#eeeeef" />
                      <line x1="0" y1="104" x2="500" y2="104" stroke="#eeeeef" />
                      <line x1="0" y1="136" x2="500" y2="136" stroke="#eeeeef" />
                      <line x1="0" y1="168" x2="500" y2="168" stroke="#eeeeef" />
                      <path d="M0 50 L82 77 L164 159 L246 112 L328 112 L410 77 L500 50 L500 168 L0 168 Z"
                        fill="#e6f6ea" fill-opacity=".5" />
                      <path d="M0 50 L82 77 L164 159 L246 112 L328 112 L410 77 L500 50" fill="none"
                        stroke="#00ab4e" stroke-width="2" />
                    </svg>
                    <span class="proto2-chart-marker" aria-hidden="true" />
                    <div class="proto2-chart-tooltip">
                      <span>07 Okt 2026</span>
                      <strong>Rp 75 M</strong>
                    </div>
                    <div class="proto2-chart-dates">
                      <span>01/10</span>
                      <span>02/10</span>
                      <span>03/10</span>
                      <span>04/10</span>
                      <span>05/10</span>
                      <span>06/10</span>
                      <span>07/10</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <!-- RIGHT COLUMN (383px): Harga Tabungan Emas + Tugasku + Menu Favorit -->
            <div class="proto2-col-right">
              <!-- 1. Harga Tabungan Emas Card -->
              <article class="proto2-card proto2-price-card">
                <header class="proto2-price-header">
                  <h2 class="proto2-card-title">Harga Tabungan Emas</h2>
                  <button type="button" class="proto2-price-update">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
                      stroke-width="1.8" aria-hidden="true">
                      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12a2 2 0 0 0 4 0M12 2V1" />
                    </svg>
                    Update
                  </button>
                </header>
                <div class="proto2-price-details">
                  <div class="proto2-price-details__heading">
                    <strong>Harga Tabungan Emas</strong>
                    <span>10 Januari 2024</span>
                  </div>
                  <div class="proto2-price-values">
                    <div>
                      <span class="proto2-price-label">Harga Beli <i class="proto2-price-direction proto2-price-direction--up">↑</i></span>
                      <strong>Rp 9.150 <small>/ 0,01 gr</small></strong>
                    </div>
                    <div>
                      <span class="proto2-price-label">Harga Jual <i class="proto2-price-direction proto2-price-direction--down">↓</i></span>
                      <strong>Rp 8.648 <small>/ 0,01 gr</small></strong>
                    </div>
                  </div>
                </div>
              </article>

              <!-- 2. Tugasku Card (Height ~458px in Figma) -->
              <article class="proto2-card proto2-task-card">
                <header class="proto2-task-header">
                  <div class="proto2-task-title-wrap">
                    <h2 class="proto2-card-title">Tugasku</h2>
                    <span class="proto2-task-count">5</span>
                  </div>
                  <button type="button" class="proto2-text-button">
                    Lihat Semua
                  </button>
                </header>

                <div class="proto2-task-list">
                  <div v-for="(t, idx) in taskItems" :key="`${t.title}-${idx}`"
                    class="proto2-task-row">
                    <span>{{ t.title }}</span>
                    <strong :class="{ 'proto2-task-count--zero': t.count === 0 }">{{ t.count }}</strong>
                  </div>
                </div>
              </article>

              <!-- 3. Menu Favorit Card -->
              <article class="proto2-card proto2-favorite-card">
                <header class="proto2-favorite-header">
                  <h2 class="proto2-card-title">Menu Favorit</h2>
                  <button type="button" class="proto2-text-button">
                    Atur
                  </button>
                </header>

                <div class="proto2-favorite-content">
                  <button type="button" class="proto2-favorite-add">
                    <img :src="favoriteAddIcon" alt="" class="proto2-favorite-add__icon" />
                    <span>Tambah<br />Menu</span>
                  </button>
                </div>
              </article>
            </div>
          </section>
        </div>
      </div>

      <!-- Sticky / Bottom Footer (Height: 48px) -->
      <footer class="proto2-footer" :class="{ 'proto2-footer--form': isPengajuanGadaiRoute }">
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

<style lang="scss" scoped>
  .proto2-content__under-breadcrumbs {
    width: 100%;
    padding: 0 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  @media (max-width: 767px) {
    .proto2-content__under-breadcrumbs {
      padding: 0;
    }
  }

  .proto2-layout--form :deep(.pengajuan-gadai-page) {
    background: var(--g-kit-black-10, #f8f8f8);
  }

  .proto2-layout--form :deep(.pengajuan-gadai-page--launcher .pengajuan-gadai-content) {
    width: unset;
    margin: unset;
    padding: 16px 24px 24px;
  }

  .proto2-layout--form :deep(.pengajuan-gadai-page--launcher .pengajuan-gadai-breadcrumb) {
    margin-bottom: 16px;
    padding-bottom: 16px;
    margin-top: 16px;
  }


</style>
