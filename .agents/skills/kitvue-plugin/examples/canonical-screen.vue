<!--
  Canonical Example Screen Component
  @description Template referensi implementasi layar Vue 3 dari Figma MCP yang sepenuhnya selaras
               dengan pustaka komponen `@pegadaian/kitvue` / `kitvue-public`, design token `--g-kit-*`,
               dan utility layout Bootstrap 5.3.2.
  @responsibility Menampilkan data transaksi/entitas dengan toolbar, aksi modal/bottomsheet, dan tabel/card adaptif.
-->
<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  GButton,
  GInputText,
  GDropdown,
  GBadge,
  GModal,
  GTablePagination
} from '@/components';

// ==========================================
// 1. Interfaces & Types
// ==========================================
export interface EntityItem {
  id: string;
  referenceNo: string;
  title: string;
  category: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  amount: number;
  formattedDate: string;
}

export interface ScreenProps {
  initialSearch?: string;
}

// ==========================================
// 2. Props & Emits
// ==========================================
const props = withDefaults(defineProps<ScreenProps>(), {
  initialSearch: '',
});

const emit = defineEmits<{
  (e: 'export-data'): void;
  (e: 'view-detail', item: EntityItem): void;
}>();

// ==========================================
// 3. Reactive State
// ==========================================
const searchQuery = ref<string>(props.initialSearch);
const selectedCategory = ref<string>('all');
const isModalOpen = ref<boolean>(false);
const activeItem = ref<EntityItem | null>(null);

// Mock Dataset
const items = ref<EntityItem[]>([
  {
    id: 'TX-001',
    referenceNo: 'REF-2026-001',
    title: 'Pembelian Aset Emas',
    category: 'Buy',
    status: 'SUCCESS',
    amount: 15000000,
    formattedDate: '27 Okt 2026, 14:30 WIB'
  },
  {
    id: 'TX-002',
    referenceNo: 'REF-2026-002',
    title: 'Penarikan Fisik Kustodi',
    category: 'Withdrawal',
    status: 'PENDING',
    amount: 5000000,
    formattedDate: '27 Okt 2026, 11:15 WIB'
  }
]);

// ==========================================
// 4. Computed Properties
// ==========================================
const filteredItems = computed<EntityItem[]>(() => {
  const query = searchQuery.value.trim().toLowerCase();
  return items.value.filter((item) => {
    const matchesSearch = item.referenceNo.toLowerCase().includes(query) ||
                          item.title.toLowerCase().includes(query);
    const matchesCategory = selectedCategory.value === 'all' || item.category === selectedCategory.value;
    return matchesSearch && matchesCategory;
  });
});

// ==========================================
// 5. Methods & Handlers
// ==========================================
const openDetail = (item: EntityItem): void => {
  activeItem.value = item;
  isModalOpen.value = true;
  emit('view-detail', item);
};

const closeModal = (): void => {
  isModalOpen.value = false;
  activeItem.value = null;
};

const formatRupiah = (val: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(val);
};

const getBadgeVariant = (status: EntityItem['status']): string => {
  switch (status) {
    case 'SUCCESS':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'FAILED':
      return 'danger';
    default:
      return 'neutral';
  }
};
</script>

<template>
  <main class="page-container" aria-label="Layar Riwayat Transaksi">
    <!-- Header Section (Bootstrap 5 flex & spacing utilities) -->
    <header class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
      <div>
        <h1 class="page-title m-0">Riwayat Transaksi</h1>
        <p class="page-subtitle mt-1 mb-0">Kelola dan pantau seluruh transaksi operasional dengan mudah.</p>
      </div>

      <div class="d-flex align-items-center gap-2">
        <!-- Clean Inline SVG Icon dengan styling currentColor -->
        <GButton variant="outline" @click="emit('export-data')">
          <svg class="action-icon me-2" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M14.166 12.5V15.8333H5.83268V12.5H4.16602V15.8333C4.16602 16.75 4.91602 17.5 5.83268 17.5H14.166C15.0827 17.5 15.8327 16.75 15.8327 15.8333V12.5H14.166ZM9.99935 3.33333L6.08268 7.25L7.25768 8.425L9.16602 6.525V13.3333H10.8327V6.525L12.741 8.425L13.916 7.25L9.99935 3.33333Z" fill="currentColor"/>
          </svg>
          <span>Ekspor Data</span>
        </GButton>
      </div>
    </header>

    <!-- Toolbar Section (Bootstrap 5 flex & gap) -->
    <section class="d-flex flex-wrap gap-3 mb-4" aria-label="Toolbar Pencarian dan Filter">
      <div class="flex-grow-1" style="min-width: 260px;">
        <GInputText
          v-model="searchQuery"
          placeholder="Cari berdasarkan nomor referensi..."
          aria-label="Pencarian transaksi"
        />
      </div>
      <div style="width: 220px;">
        <GDropdown
          v-model="selectedCategory"
          :options="[
            { label: 'Semua Kategori', value: 'all' },
            { label: 'Beli Emas', value: 'Buy' },
            { label: 'Tarik Kustodi', value: 'Withdrawal' }
          ]"
          aria-label="Filter kategori"
        />
      </div>
    </section>

    <!-- Desktop Table View (Bootstrap 5 table container + scoped token styling) -->
    <section class="desktop-view" aria-label="Tabel Riwayat Transaksi">
      <div class="table-container">
        <table class="custom-table w-100">
          <thead>
            <tr>
              <th scope="col">No. Referensi</th>
              <th scope="col">Judul Transaksi</th>
              <th scope="col">Tanggal</th>
              <th scope="col">Status</th>
              <th scope="col" class="text-end">Nominal</th>
              <th scope="col" class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredItems" :key="item.id">
              <td class="font-bold">{{ item.referenceNo }}</td>
              <td>{{ item.title }}</td>
              <td class="text-secondary">{{ item.formattedDate }}</td>
              <td>
                <GBadge :variant="getBadgeVariant(item.status)">
                  {{ item.status }}
                </GBadge>
              </td>
              <td class="text-end font-bold">{{ formatRupiah(item.amount) }}</td>
              <td class="text-center">
                <GButton size="small" variant="ghost" @click="openDetail(item)">
                  Detail
                </GButton>
              </td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td colspan="6" class="empty-state">Data tidak ditemukan.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="d-flex justify-content-end mt-3">
        <GTablePagination :total-items="filteredItems.length" :items-per-page="10" />
      </div>
    </section>

    <!-- Mobile Card List View (Visible only on mobile) -->
    <section class="mobile-view" aria-label="Daftar Kartu Transaksi Mobile">
      <div v-for="item in filteredItems" :key="item.id" class="mobile-card" @click="openDetail(item)">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="card-ref">{{ item.referenceNo }}</span>
          <GBadge :variant="getBadgeVariant(item.status)">
            {{ item.status }}
          </GBadge>
        </div>
        <div>
          <h2 class="card-title m-0">{{ item.title }}</h2>
          <p class="card-date mt-1 mb-0">{{ item.formattedDate }}</p>
        </div>
        <div class="d-flex justify-content-between align-items-center mt-3 pt-2 card-footer-border">
          <span class="card-label">Total:</span>
          <span class="card-amount">{{ formatRupiah(item.amount) }}</span>
        </div>
      </div>
    </section>

    <!-- Detail Dialog / Modal (Responsive: Modal on desktop, Sheet on mobile) -->
    <GModal
      v-if="isModalOpen"
      :is-open="isModalOpen"
      title="Rincian Transaksi"
      @close="closeModal"
    >
      <div v-if="activeItem" class="d-flex flex-column gap-3">
        <div class="d-flex justify-content-between align-items-center">
          <span class="detail-label">No. Referensi:</span>
          <span class="detail-value font-bold">{{ activeItem.referenceNo }}</span>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <span class="detail-label">Status:</span>
          <GBadge :variant="getBadgeVariant(activeItem.status)">
            {{ activeItem.status }}
          </GBadge>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <span class="detail-label">Nominal:</span>
          <span class="detail-value font-bold text-success">{{ formatRupiah(activeItem.amount) }}</span>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <span class="detail-label">Waktu:</span>
          <span class="detail-value">{{ activeItem.formattedDate }}</span>
        </div>
      </div>
      <template #footer>
        <GButton variant="secondary" @click="closeModal">Tutup</GButton>
      </template>
    </GModal>
  </main>
</template>

<style scoped>
/* ==========================================================================
   Design Tokens Integration (--g-kit-*)
   ========================================================================== */
.page-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
}

.page-title {
  color: var(--g-kit-black-80);
  font-size: var(--g-kit-font-size-zeta);
  line-height: var(--g-kit-line-height-zeta);
  font-weight: var(--g-kit-font-weight-bold);
}

.page-subtitle {
  color: var(--g-kit-black-60);
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  font-weight: var(--g-kit-font-weight-normal);
}

.action-icon {
  width: 18px;
  height: 18px;
}

/* Desktop Table View */
.desktop-view {
  display: block;
}

.table-container {
  border: 1px solid var(--g-kit-black-20);
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--g-kit-white);
}

.custom-table {
  border-collapse: collapse;
  text-align: left;
}

.custom-table th {
  background-color: var(--g-kit-black-10);
  color: var(--g-kit-black-80);
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  font-weight: var(--g-kit-font-weight-bold);
  padding: 12px 16px;
  border-bottom: 1px solid var(--g-kit-black-20);
}

.custom-table td {
  padding: 14px 16px;
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  color: var(--g-kit-black-80);
  border-bottom: 1px solid var(--g-kit-black-20);
}

.custom-table tbody tr:hover {
  background-color: var(--g-kit-black-10);
}

.empty-state {
  text-align: center;
  color: var(--g-kit-black-50);
  padding: 32px;
}

/* Typography Utilities */
.font-bold {
  font-weight: var(--g-kit-font-weight-bold);
}

.text-secondary {
  color: var(--g-kit-black-60);
}

.text-success {
  color: var(--g-kit-lime-50);
}

/* Detail Modal */
.detail-label {
  color: var(--g-kit-black-60);
  font-size: var(--g-kit-font-size-omicron);
}

.detail-value {
  color: var(--g-kit-black-80);
  font-size: var(--g-kit-font-size-omicron);
}

/* Mobile Card View */
.mobile-view {
  display: none;
}

/* Responsive Media Queries */
@media (max-width: 768px) {
  .page-container {
    padding: 16px;
    padding-bottom: 96px; /* Mencegah konten tertutup sticky bar */
  }

  .desktop-view {
    display: none;
  }

  .mobile-view {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .mobile-card {
    background-color: var(--g-kit-white);
    border: 1px solid var(--g-kit-black-20);
    border-radius: 8px;
    padding: 16px;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .card-ref {
    font-size: var(--g-kit-font-size-omega);
    font-weight: var(--g-kit-font-weight-bold);
    color: var(--g-kit-black-60);
  }

  .card-title {
    font-size: var(--g-kit-font-size-omicron);
    font-weight: var(--g-kit-font-weight-bold);
    color: var(--g-kit-black-80);
  }

  .card-date {
    font-size: var(--g-kit-font-size-omega);
    color: var(--g-kit-black-50);
  }

  .card-footer-border {
    border-top: 1px solid var(--g-kit-black-20);
  }

  .card-amount {
    font-size: var(--g-kit-font-size-omicron);
    font-weight: var(--g-kit-font-weight-bold);
    color: var(--g-kit-lime-50);
  }
}
</style>
