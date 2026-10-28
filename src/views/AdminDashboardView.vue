<script setup lang="ts">
/**
 * @file AdminDashboardView.vue
 * @description Official Base Container template from Figma Single UI Guideline (Node 1773:39151).
 * Strictly built using official reusable @pegadaian/kitvue components:
 * 1. Modal: ModalBottomSheet (Hybrid responsive Modal on desktop, Bottomsheet on mobile)
 * 2. Button: <Button /> component from kitvue-public
 * 3. Filter: <FilterCMS /> with official fields (DateRangePickerOption, Dropdown, InputText, InputDatePicker)
 * 4. Design tokens: Defined --g-kit-* design tokens from kitvue-public library
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import SprintNavbar from '@/components/shared/admin-layout/SprintNavbar.vue'
import {
  Button,
  ModalBottomSheet,
  FilterCMS,
  Dropdown,
  InputText,
  InputNIK,
  InputSmallDate,
  DateRangePickerOption,
  Table,
  TablePagination,
  Breadcrumb,
  Badge,
} from '@/components'

const router = useRouter()

// Breadcrumbs
const breadcrumbItems = ['Beranda', 'E-Form', 'Cetak E-FDN']

// Filter Form State
const lastUpdated = ref('10/01/2024, 10.00 AM')

const filterForm = ref({
  startDate: '2023-06-03',
  endDate: '2023-06-09',
  outlet: 'CP Salemba',
  statusPengajuan: 'Disetujui',
  jenisPengajuan: 'Semua',
  namaNasabah: '',
  nik: '',
  nomorEfdn: '',
  tanggalLahir: '',
})

// Options for Kitvue Dropdown
const outletOptions = [
  { value: 'CP Salemba', text: 'CP Salemba' },
  { value: 'CP Kramat', text: 'CP Kramat' },
  { value: 'CP Pasar Baru', text: 'CP Pasar Baru' },
  { value: 'Semua Outlet', text: 'Semua Outlet' },
]

const statusOptions = [
  { value: 'Disetujui', text: 'Disetujui' },
  { value: 'Menunggu Persetujuan', text: 'Menunggu Persetujuan' },
  { value: 'Ditolak', text: 'Ditolak' },
  { value: 'Semua Status', text: 'Semua Status' },
]

const jenisOptions = [
  { value: 'Semua', text: 'Semua' },
  { value: 'Gadai Emas', text: 'Gadai Emas' },
  { value: 'Kredit Usaha', text: 'Kredit Usaha' },
  { value: 'Tabungan Emas', text: 'Tabungan Emas' },
]

// Table Structure & Records
export interface EfdnRecord {
  id: number
  no: number
  nomorEfdn: string
  tanggalPengajuan: string
  nik: string
  namaNasabah: string
  tanggalLahir: string
  outlet: string
  status: string
}

const tableColumns = [
  { key: 'no', label: 'No' },
  { key: 'nomorEfdn', label: 'Nomor E-FDN' },
  { key: 'tanggalPengajuan', label: 'Tanggal Pengajuan' },
  { key: 'nik', label: 'NIK' },
  { key: 'namaNasabah', label: 'Nama Nasabah' },
  { key: 'tanggalLahir', label: 'Tanggal Lahir' },
  { key: 'aksi', label: 'Aksi' },
]

const mockRecords: EfdnRecord[] = [
  {
    id: 1,
    no: 1,
    nomorEfdn: 'FDN1 2300 0406 2300 5',
    tanggalPengajuan: '4 Jun 2023',
    nik: '1111 1111 1111 1111',
    namaNasabah: 'Aisyah Dhelistya',
    tanggalLahir: '4 Jul 1990',
    outlet: 'CP Salemba',
    status: 'Disetujui',
  },
  {
    id: 2,
    no: 2,
    nomorEfdn: 'FDN1 2300 0406 2300 4',
    tanggalPengajuan: '4 Jun 2023',
    nik: '1111 1111 1111 1111',
    namaNasabah: 'Olivia Catherine Maharani',
    tanggalLahir: '3 Agu 1992',
    outlet: 'CP Salemba',
    status: 'Disetujui',
  },
  {
    id: 3,
    no: 3,
    nomorEfdn: 'FDN1 2300 0406 2300 3',
    tanggalPengajuan: '4 Jun 2023',
    nik: '1111 1111 1111 1111',
    namaNasabah: 'Andoni Pranata',
    tanggalLahir: '2 Jan 1988',
    outlet: 'CP Kramat',
    status: 'Disetujui',
  },
  {
    id: 4,
    no: 4,
    nomorEfdn: 'FDN1 2300 0406 2300 2',
    tanggalPengajuan: '4 Jun 2023',
    nik: '1111 1111 1111 1111',
    namaNasabah: 'Antonius Zendy Hutagalung',
    tanggalLahir: '1 Des 1995',
    outlet: 'CP Salemba',
    status: 'Disetujui',
  },
  {
    id: 5,
    no: 5,
    nomorEfdn: 'FDN1 2300 0406 2300 1',
    tanggalPengajuan: '4 Jun 2023',
    nik: '1111 1111 1111 1111',
    namaNasabah: 'Amelia Tri Handayani',
    tanggalLahir: '25 Okt 1993',
    outlet: 'CP Pasar Baru',
    status: 'Disetujui',
  },
  {
    id: 6,
    no: 6,
    nomorEfdn: 'FDN1 2300 0306 2300 5',
    tanggalPengajuan: '3 Jun 2023',
    nik: '1111 1111 1111 1111',
    namaNasabah: 'Dedi Warman',
    tanggalLahir: '19 Sep 1985',
    outlet: 'CP Salemba',
    status: 'Disetujui',
  },
  {
    id: 7,
    no: 7,
    nomorEfdn: 'FDN1 2300 0306 2300 4',
    tanggalPengajuan: '3 Jun 2023',
    nik: '1111 1111 1111 1111',
    namaNasabah: 'Rahmawati',
    tanggalLahir: '1 Mei 1991',
    outlet: 'CP Kramat',
    status: 'Disetujui',
  },
  {
    id: 8,
    no: 8,
    nomorEfdn: 'FDN1 2300 0306 2300 3',
    tanggalPengajuan: '3 Jun 2023',
    nik: '1111 1111 1111 1111',
    namaNasabah: 'Cindya Arumsari',
    tanggalLahir: '27 Nov 1994',
    outlet: 'CP Salemba',
    status: 'Disetujui',
  },
  {
    id: 9,
    no: 9,
    nomorEfdn: 'FDN1 2300 0306 2300 2',
    tanggalPengajuan: '3 Jun 2023',
    nik: '1111 1111 1111 1111',
    namaNasabah: 'I Wayan Suparta Yadnya',
    tanggalLahir: '26 Mar 1987',
    outlet: 'CP Pasar Baru',
    status: 'Disetujui',
  },
  {
    id: 10,
    no: 10,
    nomorEfdn: 'FDN1 2300 0306 2300 1',
    tanggalPengajuan: '3 Jun 2023',
    nik: '1111 1111 1111 1111',
    namaNasabah: 'Harri William Calvin Pandie',
    tanggalLahir: '25 Feb 1989',
    outlet: 'CP Salemba',
    status: 'Disetujui',
  },
]

const records = ref<EfdnRecord[]>([...mockRecords])
const rowsPerPage = ref<number>(10)
const currentPage = ref<number>(1)

// Modal Detail State (Managed via ModalBottomSheet)
const isModalOpen = ref(false)
const selectedRecord = ref<EfdnRecord | null>(null)

// Search filter query state
const searchQuery = ref({
  namaNasabah: '',
  nik: '',
  nomorEfdn: '',
})

// Filtering logic
const filteredRecords = computed(() => {
  return records.value.filter((r) => {
    if (searchQuery.value.namaNasabah && !r.namaNasabah.toLowerCase().includes(searchQuery.value.namaNasabah.toLowerCase())) {
      return false
    }
    if (searchQuery.value.nik && !r.nik.replace(/\s+/g, '').includes(searchQuery.value.nik.replace(/\s+/g, ''))) {
      return false
    }
    if (searchQuery.value.nomorEfdn && !r.nomorEfdn.toLowerCase().includes(searchQuery.value.nomorEfdn.toLowerCase())) {
      return false
    }
    return true
  })
})

const totalRows = computed(() => {
  return searchQuery.value.namaNasabah || searchQuery.value.nik || searchQuery.value.nomorEfdn
    ? filteredRecords.value.length
    : 200
})

const startIndex = computed(() => {
  if (totalRows.value === 0) return 0
  return (currentPage.value - 1) * rowsPerPage.value + 1
})

const endIndex = computed(() => {
  return Math.min(currentPage.value * rowsPerPage.value, totalRows.value)
})

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  return filteredRecords.value.slice(start, start + rowsPerPage.value)
})

const handleRefresh = () => {
  const now = new Date()
  lastUpdated.value = `${now.toLocaleDateString('id-ID')}, ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
}

const handleResetFilter = () => {
  filterForm.value = {
    startDate: '',
    endDate: '',
    outlet: 'CP Salemba',
    statusPengajuan: 'Disetujui',
    jenisPengajuan: 'Semua',
    namaNasabah: '',
    nik: '',
    nomorEfdn: '',
    tanggalLahir: '',
  }
  searchQuery.value = {
    namaNasabah: '',
    nik: '',
    nomorEfdn: '',
  }
}

const handleSearch = () => {
  searchQuery.value = {
    namaNasabah: filterForm.value.namaNasabah,
    nik: filterForm.value.nik,
    nomorEfdn: filterForm.value.nomorEfdn,
  }
  currentPage.value = 1
}

const handleOpenDetail = (record: EfdnRecord) => {
  selectedRecord.value = record
  isModalOpen.value = true
}

const handleNavBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="sprint-page-layout">
    <!-- Top Navbar SPRINT -->
    <SprintNavbar />

    <main class="sprint-main-content" role="main">
      <!-- Breadcrumbs Bar (Kitvue Breadcrumb) -->
      <section class="sprint-breadcrumb-row" aria-label="Jalur Navigasi">
        <Breadcrumb :items="breadcrumbItems" />
      </section>

      <!-- Page Title & Nav Back Header -->
      <section class="sprint-page-header">
        <button
          type="button"
          class="sprint-back-btn"
          aria-label="Kembali ke halaman sebelumnya"
          @click="handleNavBack"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="back-icon" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <h1 class="sprint-title">Cetak E-FDN</h1>
      </section>

      <!-- Base Container Card using Reusable FilterCMS -->
      <section class="base-container-card" aria-label="Kontainer Data Cetak E-FDN">
        <div class="filter-cms-wrapper">
          <FilterCMS :filter="true">
            <!-- Slot Update Text (Left header) -->
            <template #update-text>
              <div class="d-flex align-items-center gap-2">
                <span class="update-label">Last updated on {{ lastUpdated }}</span>
                <button
                  type="button"
                  class="refresh-icon-btn"
                  title="Perbarui Waktu"
                  aria-label="Refresh data"
                  @click="handleRefresh"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="refresh-svg" aria-hidden="true">
                    <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
            </template>

            <!-- Slot Filters: Direct children rendered into FilterCMS 3-column grid -->
            <template #filters>
              <!-- Field 1: Tanggal Pengajuan (DateRangePickerOption) -->
              <DateRangePickerOption
                id="filter-tanggal-pengajuan"
                title="Tanggal Pengajuan"
                v-model:start-date="filterForm.startDate"
                v-model:end-date="filterForm.endDate"
                placeholder="03/06/2023 - 09/06/2023"
              />

              <!-- Field 2: Outlet (Dropdown) -->
              <Dropdown
                id="filter-outlet"
                label="Outlet"
                :items="outletOptions"
                itemValue="value"
                itemText="text"
                v-model="filterForm.outlet"
                placeholder="CP Salemba"
              />

              <!-- Field 3: Status Pengajuan (Dropdown) -->
              <Dropdown
                id="filter-status"
                label="Status Pengajuan"
                :items="statusOptions"
                itemValue="value"
                itemText="text"
                v-model="filterForm.statusPengajuan"
                placeholder="Disetujui"
              />

              <!-- Field 4: Jenis Pengajuan (Dropdown) -->
              <Dropdown
                id="filter-jenis"
                label="Jenis Pengajuan"
                :items="jenisOptions"
                itemValue="value"
                itemText="text"
                v-model="filterForm.jenisPengajuan"
                placeholder="Semua"
              />

              <!-- Field 5: Nama Nasabah (Opsional) (InputText) -->
              <InputText
                id="filter-nama"
                label="Nama Nasabah (Opsional)"
                v-model="filterForm.namaNasabah"
                placeholder="Cari nama nasabah"
              />

              <!-- Field 6: NIK (Opsional) (InputNIK) -->
              <InputNIK
                id="filter-nik"
                label="NIK (Opsional)"
                v-model="filterForm.nik"
                placeholder="Cari NIK"
              />

              <!-- Field 7: Nomor E-FDN (Opsional) (InputText) -->
              <InputText
                id="filter-nomor-efdn"
                label="Nomor E-FDN (Opsional)"
                v-model="filterForm.nomorEfdn"
                placeholder="Cari nomor e-fdn"
              />

              <!-- Field 8: Tanggal Lahir (Opsional) (InputSmallDate) -->
              <InputSmallDate
                id="filter-tanggal-lahir"
                title="Tanggal Lahir (Opsional)"
                placeholder="Pilih tanggal"
                v-model="filterForm.tanggalLahir"
              />
            </template>
          </FilterCMS>
        </div>

        <!-- Filter Action Buttons using Kitvue <Button /> -->
        <div class="d-flex justify-content-end gap-3 mt-3 pt-2">
          <Button
            label="Reset Filter"
            type="outline-primary"
            size="md"
            @click="handleResetFilter"
          />
          <Button
            label="Cari"
            type="primary"
            size="md"
            @click="handleSearch"
          />
        </div>

        <!-- Table Row Limit Control -->
        <div class="d-flex align-items-center gap-2 mt-4 mb-3">
          <span class="text-caption">Lihat Detail</span>
          <select
            v-model="rowsPerPage"
            class="form-select form-select-sm row-limit-select"
            aria-label="Jumlah baris per halaman"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
          <span class="text-caption">baris</span>
        </div>

        <!-- Table Component from kitvue-public (TableData.vue) -->
        <div class="table-responsive-wrapper">
          <Table
            :columns="tableColumns"
            :data="paginatedRecords"
            nodataMessage="Tidak ada data yang sesuai dengan kriteria pencarian filter."
            class="table rounded-corners table-hover sprint-kitvue-table"
          >
            <!-- Custom slot for Nomor E-FDN -->
            <template #nomorEfdn="{ value }">
              <span class="fw-bold text-dark">{{ value }}</span>
            </template>

            <!-- Custom slot for NIK -->
            <template #nik="{ value }">
              <span class="font-mono text-dark">{{ value }}</span>
            </template>

            <!-- Custom slot for Nama Nasabah -->
            <template #namaNasabah="{ value }">
              <span class="fw-bold text-dark">{{ value }}</span>
            </template>

            <!-- Custom slot for Action Button using <Button /> -->
            <template #aksi="{ item }">
              <Button
                label="Lihat Detail"
                size="sm"
                type="outline-primary"
                @click="handleOpenDetail(item)"
              />
            </template>
          </Table>
        </div>

        <!-- Table Pagination Controls (TablePagination.vue) -->
        <footer class="sprint-table-footer">
          <span class="showing-text">
            Menampilkan {{ startIndex }} sampai {{ endIndex }} dari {{ totalRows }} baris
          </span>

          <TablePagination
            v-model="currentPage"
            :totalRows="totalRows"
            :perPage="rowsPerPage"
          />
        </footer>
      </section>

      <!-- Global Footer -->
      <footer class="sprint-global-footer">
        <p>Copyright © 2024 PT. Pegadaian. All Rights Reserved.</p>
      </footer>
    </main>

    <!-- Modal Detail E-FDN using ModalBottomSheet (Hybrid responsive Modal on desktop, Bottomsheet on mobile) -->
    <ModalBottomSheet
      v-model="isModalOpen"
      title="Detail Dokumen E-FDN"
      size="lg"
    >
      <template #body>
        <div v-if="selectedRecord" class="detail-modal-body">
          <div class="detail-badge-row d-flex align-items-center gap-2 mb-3">
            <Badge type="primary" :label="selectedRecord.status" />
            <span class="outlet-text fw-bold">{{ selectedRecord.outlet }}</span>
          </div>

          <div class="detail-grid">
            <div class="detail-item">
              <span class="item-label">Nomor E-FDN</span>
              <strong class="item-val">{{ selectedRecord.nomorEfdn }}</strong>
            </div>
            <div class="detail-item">
              <span class="item-label">Tanggal Pengajuan</span>
              <span class="item-val">{{ selectedRecord.tanggalPengajuan }}</span>
            </div>
            <div class="detail-item">
              <span class="item-label">Nama Nasabah</span>
              <span class="item-val">{{ selectedRecord.namaNasabah }}</span>
            </div>
            <div class="detail-item">
              <span class="item-label">Nomor Induk Kependudukan (NIK)</span>
              <span class="item-val font-mono">{{ selectedRecord.nik }}</span>
            </div>
            <div class="detail-item">
              <span class="item-label">Tanggal Lahir</span>
              <span class="item-val">{{ selectedRecord.tanggalLahir }}</span>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="d-flex justify-content-end gap-2">
          <Button
            label="Tutup"
            type="secondary"
            size="md"
            @click="isModalOpen = false"
          />
          <Button
            label="Cetak Dokumen"
            type="primary"
            size="md"
            @click="isModalOpen = false"
          />
        </div>
      </template>
    </ModalBottomSheet>
  </div>
</template>

<style scoped>
.sprint-page-layout {
  min-height: 100vh;
  background-color: var(--g-kit-black-10, #f8fafc);
  display: flex;
  flex-direction: column;
}

.sprint-main-content {
  flex: 1;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 20px 24px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Breadcrumbs */
.sprint-breadcrumb-row {
  margin-bottom: -4px;
}

/* Page Header & Back Button */
.sprint-page-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.sprint-back-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--g-kit-lime-50, #00A651);
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.15s ease;
}

.sprint-back-btn:hover {
  background-color: var(--g-kit-lime-10, #e6f4f1);
}

.back-icon {
  width: 22px;
  height: 22px;
}

.sprint-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--g-kit-black-80, #1e293b);
  margin: 0;
  letter-spacing: -0.01em;
}

/* Base Container Card */
.base-container-card {
  background: var(--g-kit-white, #ffffff);
  border: 1px solid var(--g-kit-black-20, #e2e8f0);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Kitvue FilterCMS wrapper alignment */
/* .filter-cms-wrapper :deep(.flex.align-items-center:first-child) {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  width: 100% !important;
}

.filter-cms-wrapper :deep(.update) {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  font-size: var(--g-kit-font-size-sigma, 13px) !important;
  color: var(--g-kit-black-60, #64748b) !important;
}

.filter-cms-wrapper :deep(.btn) {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  color: var(--g-kit-broccoli-50, #004D43) !important;
  border: 1px solid var(--g-kit-broccoli-50, #004D43) !important;
  border-radius: 6px !important;
  font-weight: 700 !important;
  font-size: 13px !important;
  padding: 8px 16px !important;
  background-color: #ffffff !important;
  transition: all 0.15s ease !important;
}

.filter-cms-wrapper :deep(.btn.clicked),
.filter-cms-wrapper :deep(.btn:hover) {
  background-color: var(--g-kit-lime-10, #f0fdf4) !important;
  color: var(--g-kit-broccoli-50, #004D43) !important;
  border-color: var(--g-kit-broccoli-50, #004D43) !important;
}

/* Align calendar icon on date-picker-option to match InputSmallDate and Figma */
.filter-cms-wrapper :deep(.date-picker-option .icon-dropdown) {
  background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M12 4.09392C13.3582 4.09392 14.7163 4.15052 16.0745 4.26372C16.2042 4.15763 16.3701 4.09392 16.55 4.09392C16.7804 4.09392 16.9878 4.19843 17.1257 4.36264C17.4579 4.39748 17.7901 4.43569 18.1223 4.47729L18.9969 4.59465C20.2752 4.77763 21.2774 5.66974 21.4825 6.8073C21.8275 8.72052 22 10.6337 22 12.547C22 14.221 21.8679 15.8951 21.6038 17.5692L21.4826 18.2866C21.2774 19.4242 20.2753 20.3163 18.9969 20.4993C16.6646 20.8331 14.3323 21 12 21C9.95924 21 7.91849 20.8722 5.87773 20.6166L5.00312 20.4993C3.72475 20.3163 2.72256 19.4242 2.51745 18.2866C2.17248 16.3734 2 14.4602 2 12.547C2 10.8729 2.13206 9.19882 2.39617 7.52476L2.51745 6.8073C2.72256 5.66974 3.72475 4.77763 5.00312 4.59465C5.73679 4.48964 6.47045 4.40115 7.20412 4.32917C7.34125 4.18436 7.53562 4.09392 7.75 4.09392C7.91718 4.09392 8.07219 4.14892 8.19738 4.24182C9.46492 4.14322 10.7325 4.09392 12 4.09392ZM12 5.48618C13.2665 5.48618 14.5332 5.53732 15.8 5.63962V7.32596C15.8 7.73789 16.1381 8.07182 16.55 8.07182C16.9619 8.07182 17.3 7.73789 17.3 7.32596V5.78465C17.4507 5.80162 17.6013 5.81931 17.752 5.83773L18.5855 5.94692L18.7294 5.9726C19.3905 6.11677 19.9039 6.59631 20.0148 7.19677C20.1239 7.78688 20.2145 8.37689 20.2868 8.96685H3.71322C3.75868 8.59577 3.81141 8.22466 3.87141 7.85353L3.98691 7.18703L4.01643 7.06211C4.18219 6.48793 4.73425 6.04198 5.42573 5.9454C5.95054 5.8721 6.47529 5.80757 7 5.75182V7.32596C7 7.73789 7.33808 8.07182 7.75 8.07182C8.16192 8.07182 8.5 7.73789 8.5 7.32596V5.61635C9.66681 5.52957 10.8334 5.48618 12 5.48618ZM3.56963 10.4586C3.52321 11.1216 3.5 11.7846 3.5 12.4475C3.5 14.1973 3.66168 15.9474 3.98517 17.6982C4.09612 18.2987 4.60947 18.7782 5.27064 18.9224L5.41449 18.9481L6.24799 19.0573C8.16579 19.2917 10.083 19.4088 12 19.4088C14.1909 19.4088 16.3822 19.2558 18.5743 18.9496C19.2658 18.853 19.8178 18.4071 19.9836 17.8329L20.0131 17.708L20.1286 17.0415C20.3762 15.5098 20.5 13.9785 20.5 12.4475C20.5 11.7846 20.4768 11.1216 20.4304 10.4586H3.56963Z' fill='%2358585B'/%3E%3C/svg%3E") !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  background-size: 20px 20px !important;
}

.filter-cms-wrapper :deep(.date-picker-option .icon-dropdown path) {
  display: none !important;
}

.sprint-kitvue-table :deep(thead th:nth-child(3)::after) {
  content: ' ⇅';
  font-size: 13px;
  margin-left: 6px;
  opacity: 0.9;
}

.update-label {
  font-size: 12px;
  color: var(--g-kit-black-60, #64748b);
}

.refresh-icon-btn {
  background: transparent;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  color: var(--g-kit-black-60, #64748b);
  cursor: pointer;
  transition: color 0.15s ease, transform 0.2s ease;
}

.refresh-icon-btn:hover {
  color: var(--g-kit-broccoli-50, #004D43);
  transform: rotate(45deg);
}

.refresh-svg {
  width: 16px;
  height: 16px;
}

.row-limit-select {
  border-radius: 6px;
  border: 1px solid var(--g-kit-black-20, #cbd5e1);
  padding: 4px 28px 4px 10px;
  font-size: 13px;
  display: inline-block;
  width: auto !important;
}

/* Pegadaian Green Table Styling with Kitvue Table */
.sprint-kitvue-table :deep(thead th) {
  background-color: var(--g-kit-lime-50, #00A651) !important;
  color: #ffffff !important;
  font-weight: var(--g-kit-font-weight-bold, 700) !important;
  font-size: 13px !important;
  padding: 12px 16px !important;
  border: none !important;
  white-space: nowrap !important;
}

.sprint-kitvue-table :deep(tbody td) {
  padding: 14px 16px !important;
  font-size: 13px !important;
  color: var(--g-kit-black-80, #1e293b) !important;
  border-bottom: 1px solid var(--g-kit-black-20, #eeeeef) !important;
  vertical-align: middle !important;
}

.sprint-kitvue-table :deep(tbody tr:hover) {
  background-color: var(--g-kit-black-10, #f8fafc) !important;
}

/* Footer Pagination Row */
.sprint-table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--g-kit-black-20, #f1f5f9);
  flex-wrap: wrap;
  gap: 16px;
}

.showing-text {
  font-size: 13px;
  color: var(--g-kit-black-60, #64748b);
}

/* Global Footer */
.sprint-global-footer {
  padding-top: 16px;
  border-top: 1px solid var(--g-kit-black-20, #e2e8f0);
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
}

/* Detail Modal Body */
.detail-modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.outlet-text {
  font-size: 13px;
  color: var(--g-kit-black-60, #64748b);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  background-color: var(--g-kit-black-10, #f8fafc);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--g-kit-black-20, #e2e8f0);
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-label {
  font-size: 12px;
  color: var(--g-kit-black-60, #64748b);
}

.item-val {
  font-size: 14px;
  color: var(--g-kit-black-80, #1e293b);
}

/* Responsive adjustment */
@media (max-width: 992px) {
  .filter-cms-wrapper :deep(.filters) {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 600px) {
  .filter-cms-wrapper :deep(.filters) {
    grid-template-columns: 1fr !important;
  }
  .detail-grid {
    grid-template-columns: 1fr;
  }
  .sprint-table-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
