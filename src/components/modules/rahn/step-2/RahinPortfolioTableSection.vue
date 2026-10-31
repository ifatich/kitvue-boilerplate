<script setup lang="ts">
/**
 * @file RahinPortfolioTableSection.vue
 * @description SPRINT Single UI Portfolio History Table matching Figma Node 11790:130756 & 11347:160879.
 * Uses exact table styles and classes from Step 1 BeneficialOwnerTableSection.
 * Displays 5-year historical credit contracts with Kolektabilitas sorting (Kol1-Kol5),
 * status credit ordering (Aktif-Lunas), sensitive contract/UP masking, and table pagination.
 */
import { computed, ref } from 'vue'
import { GAlert, GTablePagination } from '@/components'
import ModuleSectionCard from '@/components/shared/card/ModuleSectionCard.vue'
import iconRefreshAsset from 'kitvue-public/src/assets/icon/icon-system/icon-refresh.svg'
import {
  type LoanPortfolioItem,
  sortLoanPortfolio,
} from '../mockRahinData'

const iconRefresh = iconRefreshAsset as unknown as string

const props = withDefaults(
  defineProps<{
    items: LoanPortfolioItem[]
    isOpen?: boolean
  }>(),
  {
    isOpen: true,
  },
)

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const isRefreshing = ref(false)
const lastUpdated = ref('10/01/2024, 10.00 AM')
const perPage = ref('10')
const currentPage = ref(1)

const sortedItems = computed(() => {
  return sortLoanPortfolio(props.items)
})

const handleRefresh = () => {
  isRefreshing.value = true
  setTimeout(() => {
    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, '0')
    const dateStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`
    const hours = now.getHours()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = hours % 12 || 12
    const timeStr = `${pad(formattedHours)}.${pad(now.getMinutes())} ${ampm}`
    lastUpdated.value = `${dateStr}, ${timeStr}`
    isRefreshing.value = false
    emit('refresh')
  }, 400)
}
</script>

<template>
  <ModuleSectionCard title="Data Portofolio Pinjaman Aktif" :default-open="isOpen">
    <div class="bo-table-card-content">
      <!-- 5-Year Context Notice Alert -->
      <GAlert
        class="rahn-notice mb-3 variant"
        label="Data portofolio berikut adalah data dalam waktu 5 tahun terakhir berdasarkan tanggal pengajuan kredit."
        color="light-blue"
        variant="info"
      />

      <!-- Table Toolbar matching Step 1 -->
      <div class="bo-table-toolbar">
        <div class="d-flex align-items-center gap-2">
          <span class="text-muted-custom">Last updated on {{ lastUpdated }}</span>
          <button
            type="button"
            class="btn-refresh"
            :class="{ 'btn-refresh--spinning': isRefreshing }"
            title="Muat ulang data portofolio"
            aria-label="Muat ulang data portofolio"
            @click="handleRefresh"
          >
            <img :src="iconRefresh" alt="Refresh" width="16" height="16" />
          </button>
        </div>
        <div class="d-flex align-items-center gap-2">
          <span class="text-muted-custom">Lihat Detail</span>
          <select v-model="perPage" class="form-select-sm form-select-custom">
            <option value="10">10</option>
            <option value="5">5</option>
            <option value="25">25</option>
          </select>
          <span class="text-muted-custom">baris</span>
        </div>
      </div>

      <!-- Responsive Table Container matching Step 1 -->
      <div class="bo-table-container">
        <table class="bo-table">
          <thead>
            <tr>
              <th scope="col" class="col-no">No</th>
              <th scope="col" class="col-kontrak">Nomor Kontrak</th>
              <th scope="col" class="col-produk">Nama Produk</th>
              <th scope="col" class="col-nominal">Nominal</th>
              <th scope="col" class="col-kolektabilitas">
                <div class="d-flex align-items-center gap-1">
                  <span>Kolektabilitas</span>
                  <span class="sort-icon-inline" aria-hidden="true">&#x21C5;</span>
                </div>
              </th>
              <th scope="col" class="col-status text-center">Status Pinjaman</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="sortedItems.length === 0" class="empty-row">
              <td colspan="6" class="text-center py-5 text-muted-custom">
                Tidak ada data portofolio pinjaman aktif dalam 5 tahun terakhir.
              </td>
            </tr>
            <tr v-for="(item, index) in sortedItems" :key="item.nomorKontrakMasked">
              <td class="col-no">{{ index + 1 }}</td>
              <td class="col-kontrak" :class="{ 'contract-highlight': index === 0 }">
                {{ item.nomorKontrakMasked }}
              </td>
              <td class="col-produk font-bold">{{ item.namaProduk }}</td>
              <td class="col-nominal">{{ item.nominalMasked }}</td>
              <td class="col-kolektabilitas">
                <span
                  class="badge-kolektabilitas"
                  :class="`kol-${item.kolektabilitasScore}`"
                >
                  {{ item.kolektabilitas }}
                </span>
              </td>
              <td class="col-status text-center">
                <span
                  class="badge-status-kredit"
                  :class="item.statusKredit === 'Aktif' ? 'status--aktif' : 'status--lunas'"
                >
                  {{ item.statusKredit }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer with Pagination matching Step 1 -->
      <div class="bo-table-footer">
        <span class="text-muted-custom">
          Menampilkan 1 sampai {{ sortedItems.length }} dari {{ sortedItems.length }} baris
        </span>
        <GTablePagination
          :total-rows="sortedItems.length"
          :per-page="10"
          v-model="currentPage"
        />
      </div>
    </div>
  </ModuleSectionCard>
</template>

<style lang="scss" scoped>
.bo-table-card-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.bo-table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.text-muted-custom {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  color: var(--g-kit-black-60, #58585b);
  line-height: 20px;
}

.btn-refresh {
  background: none;
  border: none;
  padding: 2px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  border-radius: 4px;
  transition: transform 0.2s ease, background-color 0.2s ease;

  &:hover {
    background-color: var(--g-kit-black-20, #eeeeef);
  }

  &--spinning img {
    animation: spin 0.8s linear infinite;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.form-select-custom {
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--g-kit-black-20, #eeeeef);
  padding: 0 8px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  background-color: var(--g-kit-white, #ffffff);
  color: var(--g-kit-black-80, #252528);
  outline: none;
}

.bo-table-container {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto !important;
  overflow-y: visible !important;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 16px;
  position: relative;
  border-radius: 6px;
  border: 1px solid var(--g-kit-black-20, #eeeeef);

  scrollbar-width: thin;
  scrollbar-color: var(--g-kit-black-40, #bbbdc0) #f1f1f1;

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--g-kit-black-40, #bbbdc0);
    border-radius: 4px;

    &:hover {
      background: var(--g-kit-black-50, #939597);
    }
  }
}

.bo-table {
  width: 100%;
  min-width: 760px;
  margin-bottom: 0;
  border-collapse: separate !important;
  border-spacing: 0 !important;
  border: none !important;
  background-color: var(--g-kit-white, #ffffff);

  thead th {
    background-color: var(--g-kit-lime-50, #00ab4e);
    color: var(--g-kit-white, #ffffff);
    font-family: 'Nunito Sans', sans-serif;
    font-size: 14px;
    font-weight: 800;
    line-height: 20px;
    padding: 14px 16px;
    border: none;
    border-right: 1px solid rgba(255, 255, 255, 0.25);
    white-space: nowrap;

    &:last-child {
      border-right: none;
    }
  }

  tbody tr {
    transition: background-color 0.2s ease;
    background-color: var(--g-kit-white, #ffffff);

    &:hover {
      background-color: #fafafa;
    }

    td {
      padding: 14px 16px;
      font-family: 'Nunito Sans', sans-serif;
      font-size: 14px;
      line-height: 20px;
      color: var(--g-kit-black-80, #252528);
      border-top: 1px solid var(--g-kit-black-20, #eeeeef);
      border-right: 1px solid var(--g-kit-black-20, #eeeeef);
      vertical-align: middle;
      white-space: nowrap;
      background-color: var(--g-kit-white, #ffffff);

      &:last-child {
        border-right: none;
      }
    }
  }
}

.font-bold {
  font-weight: 800;
}

.col-no {
  width: 60px;
  text-align: center;
}

.col-kontrak {
  min-width: 200px;
}

.col-produk {
  min-width: 160px;
}

.col-nominal {
  min-width: 180px;
}

.col-kolektabilitas {
  min-width: 150px;
}

.col-status {
  min-width: 130px;
}

.sort-icon-inline {
  font-size: 14px;
  opacity: 0.8;
  cursor: pointer;
}

.contract-highlight {
  background: repeating-linear-gradient(
    -45deg,
    #e8f4fd,
    #e8f4fd 6px,
    #d4ebfc 6px,
    #d4ebfc 12px
  ) !important;
  border: 1px dashed #1868ab !important;
  color: #004071 !important;
  font-weight: 700;
}

.badge-kolektabilitas {
  display: inline-block;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--g-kit-black-80, #252528);
}

.badge-status-kredit {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;

  &.status--aktif {
    background-color: var(--g-kit-lime-10, #e6f6ea);
    border: 1px solid var(--g-kit-lime-50, #00ab4e);
    color: var(--g-kit-lime-60, #00883e);
  }

  &.status--lunas {
    background-color: var(--g-kit-black-10, #f8f8f8);
    border: 1px solid var(--g-kit-black-40, #bbbdc0);
    color: var(--g-kit-black-60, #58585b);
  }
}

.bo-table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 0 4px;
}
</style>
