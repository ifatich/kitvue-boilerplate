<script setup lang="ts">
/**
 * @file RahinCifTableSection.vue
 * @description SPRINT Single UI 14-column CIF table matching Figma Node 11347:160879, 11790:130756, 11347:161756.
 * Uses exact table styles and classes from Step 1 BeneficialOwnerTableSection.
 * Features info tip alert, 14-column responsive grid, status badges, Dukcapil validity, rating tiers,
 * single-row selection with lime highlight (#eaf7ee), sticky right action column, and table pagination.
 */
import { ref } from 'vue'
import { GAlert, GButton, GTablePagination } from '@/components'
import ModuleSectionCard from '@/components/shared/card/ModuleSectionCard.vue'
import iconRefreshAsset from 'kitvue-public/src/assets/icon/icon-system/icon-refresh.svg'
import type { RahinCifItem } from '../mockRahinData'

const iconRefresh = iconRefreshAsset as unknown as string

withDefaults(
  defineProps<{
    items: RahinCifItem[]
    selectedCifId: string | null
    isOpen?: boolean
  }>(),
  {
    isOpen: true,
  },
)

const emit = defineEmits<{
  (e: 'select', item: RahinCifItem, mode: 'terpilih' | 'pilih'): void
  (e: 'refresh'): void
}>()

const isRefreshing = ref(false)
const lastUpdated = ref('10/01/2024, 10.00 AM')
const perPage = ref('10')
const currentPage = ref(1)

const handleSelect = (item: RahinCifItem, mode: 'terpilih' | 'pilih') => {
  emit('select', item, mode)
}

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

const getRatingClass = (rating: string): string => {
  const lower = rating.toLowerCase()
  if (lower.includes('platinum')) return 'rating--platinum'
  if (lower.includes('gold')) return 'rating--gold'
  if (lower.includes('silver')) return 'rating--silver'
  if (lower.includes('bronze')) return 'rating--bronze'
  if (lower.includes('diamond')) return 'rating--diamond'
  return 'rating--classic'
}
</script>

<template>
  <ModuleSectionCard title="Data Rahin" :default-open="isOpen">
    <div class="bo-table-card-content">
      <!-- Blue Notice Alert matching Screenshot 1:1 -->
      <GAlert
        class="rahn-notice mb-3 variant"
        label="Pilih salah satu data CIF syariah untuk dilanjutkan ke detail data Rahin"
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
            title="Muat ulang data CIF"
            aria-label="Muat ulang data CIF"
            @click="handleRefresh"
          >
            <img :src="iconRefresh" alt="Refresh" width="16" height="16" />
          </button>
        </div>
        <div class="d-flex align-items-center gap-2">
          <span class="text-muted-custom">Lihat Detail</span>
          <select v-model="perPage" class="form-select-sm form-select-custom">
            <option value="10">10</option>
            <option value="6">6</option>
            <option value="25">25</option>
          </select>
          <span class="text-muted-custom">baris</span>
        </div>
      </div>

      <!-- 14-Column Responsive Table Container matching Step 1 -->
      <div class="bo-table-container">
        <table class="bo-table">
          <thead>
            <tr>
              <th scope="col" class="col-no">No</th>
              <th scope="col" class="col-status text-center">Status Rahin</th>
              <th scope="col" class="col-cif">Nomor CIF</th>
              <th scope="col" class="col-name">Nama Rahin</th>
              <th scope="col" class="col-rating text-center">Rating Rahin</th>
              <th scope="col" class="col-nik">NIK / No. Paspor</th>
              <th scope="col" class="col-birth">Tanggal Lahir</th>
              <th scope="col" class="col-dukcapil text-center">Verifikasi Dukcapil</th>
              <th scope="col" class="col-mother">Nama Ibu Kandung</th>
              <th scope="col" class="col-gender text-center">Jenis Kelamin</th>
              <th scope="col" class="col-address">Alamat Rumah</th>
              <th scope="col" class="col-phone">Nomor Handphone</th>
              <th scope="col" class="col-branch">Cabang Pembuka</th>
              <th scope="col" class="col-aksi text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="items.length === 0" class="empty-row">
              <td colspan="14" class="text-center py-5 text-muted-custom">
                Data CIF Rahin tidak ditemukan.
              </td>
            </tr>
            <tr
              v-for="(item, index) in items"
              :key="item.id"
              :class="{ 'selected-row': selectedCifId === item.id }"
            >
              <!-- 1. No -->
              <td class="col-no">{{ index + 1 }}</td>

              <!-- 2. Status Rahin -->
              <td class="col-status text-center">
                <span
                  class="badge-status-rahin"
                  :class="item.statusRahin === 'syariah' ? 'status--syariah' : 'status--konven'"
                >
                  {{ item.statusRahin === 'syariah' ? 'Syariah' : 'Konvensional' }}
                </span>
              </td>

              <!-- 3. Nomor CIF -->
              <td class="col-cif font-bold">{{ item.nomorCif }}</td>

              <!-- 4. Nama Rahin -->
              <td class="col-name font-bold">{{ item.namaRahin }}</td>

              <!-- 5. Rating Rahin Badge -->
              <td class="col-rating text-center">
                <span class="badge-rating" :class="getRatingClass(item.ratingRahin)">
                  {{ item.ratingRahin }}
                </span>
              </td>

              <!-- 6. NIK / No. Paspor -->
              <td class="col-nik">{{ item.nomorIdentitasMasked }}</td>

              <!-- 7. Tanggal Lahir -->
              <td class="col-birth">{{ item.tanggalLahir }}</td>

              <!-- 8. Verifikasi Dukcapil -->
              <td class="col-dukcapil text-center">
                <span
                  v-if="item.verifikasiDukcapil === 'valid'"
                  class="badge-dukcapil dukcapil--valid"
                >
                  Valid
                </span>
                <span
                  v-else-if="item.verifikasiDukcapil === 'tidak_sesuai'"
                  class="badge-dukcapil dukcapil--tidak-sesuai"
                >
                  Tidak Sesuai
                </span>
                <span v-else class="badge-dukcapil dukcapil--belum">
                  Belum Cek
                </span>
              </td>

              <!-- 9. Nama Ibu Kandung -->
              <td class="col-mother">{{ item.namaIbuKandung }}</td>

              <!-- 10. Jenis Kelamin -->
              <td class="col-gender text-center">{{ item.jenisKelamin }}</td>

              <!-- 11. Alamat Rumah -->
              <td class="col-address" :title="item.alamatRumah">
                <div class="text-truncate-2">{{ item.alamatRumah }}</div>
              </td>

              <!-- 12. Nomor Handphone -->
              <td class="col-phone">{{ item.noHp }}</td>

              <!-- 13. Cabang Pembuka -->
              <td class="col-branch">{{ item.cabangPembuka }}</td>

              <!-- 14. Aksi Button (Sticky Right) -->
              <td class="col-aksi text-center">
                <GButton
                  v-if="selectedCifId === item.id"
                  label="Terpilih"
                  type="primary"
                  size="sm"
                  class="btn-terpilih"
                  @click="handleSelect(item, 'terpilih')"
                />
                <GButton
                  v-else
                  label="Pilih"
                  type="outline"
                  size="sm"
                  class="btn-pilih"
                  @click="handleSelect(item, 'pilih')"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer with Pagination matching Step 1 -->
      <div class="bo-table-footer">
        <span class="text-muted-custom">
          Menampilkan 1 sampai {{ items.length }} dari {{ items.length }} baris
        </span>
        <GTablePagination
          :total-rows="items.length"
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
  min-width: 1800px;
  margin-bottom: 0;
  border-collapse: separate !important;
  border-spacing: 0 !important;
  border: none !important;
  background-color: var(--g-kit-white, #ffffff);
  overflow: visible !important;

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

    &.selected-row {
      background-color: #eaf7ee !important;

      td {
        background-color: #eaf7ee !important;
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

.col-status {
  width: 130px;
}

.col-cif {
  min-width: 140px;
}

.col-name {
  min-width: 200px;
}

.col-rating {
  width: 130px;
}

.col-nik {
  min-width: 180px;
}

.col-birth {
  min-width: 140px;
}

.col-dukcapil {
  width: 160px;
}

.col-mother {
  min-width: 160px;
}

.col-gender {
  width: 130px;
}

.col-address {
  min-width: 240px;
  max-width: 320px;
}

.col-phone {
  min-width: 150px;
}

.col-branch {
  min-width: 160px;
}

/* Sticky Action Column (Exact match to Step 1) */
.col-aksi {
  width: 110px !important;
  min-width: 110px !important;
  max-width: 110px !important;
  position: -webkit-sticky !important;
  position: sticky !important;
  right: 0 !important;
  border-left: 1px solid var(--g-kit-black-20, #eeeeef) !important;
  box-shadow: -4px 0 8px rgba(0, 0, 0, 0.08) !important;
}

thead th.col-aksi {
  background-color: var(--g-kit-lime-50, #00ab4e) !important;
  color: var(--g-kit-white, #ffffff) !important;
  position: -webkit-sticky !important;
  position: sticky !important;
  right: 0 !important;
  z-index: 10 !important;
}

tbody td.col-aksi {
  background-color: var(--g-kit-white, #ffffff) !important;
  position: -webkit-sticky !important;
  position: sticky !important;
  right: 0 !important;
  z-index: 5 !important;
}

tbody tr.selected-row td.col-aksi {
  background-color: #eaf7ee !important;
  position: -webkit-sticky !important;
  position: sticky !important;
  right: 0 !important;
  z-index: 5 !important;
}

:deep(.btn-terpilih) {
  background-color: var(--g-kit-lime-50, #00ab4e) !important;
  border-color: var(--g-kit-lime-50, #00ab4e) !important;
  color: #ffffff !important;
  font-family: 'Nunito Sans', sans-serif !important;
  font-weight: 800 !important;
  font-size: 14px !important;
  height: 28px !important;
  padding: 0 16px !important;
  border-radius: 6px !important;
  line-height: 20px !important;
}

:deep(.btn-pilih) {
  background-color: transparent !important;
  border-color: var(--g-kit-lime-50, #00ab4e) !important;
  color: var(--g-kit-lime-50, #00ab4e) !important;
  font-family: 'Nunito Sans', sans-serif !important;
  font-weight: 800 !important;
  font-size: 14px !important;
  height: 28px !important;
  padding: 0 16px !important;
  border-radius: 6px !important;
  line-height: 20px !important;

  &:hover {
    background-color: var(--g-kit-lime-10, #e8f8ef) !important;
  }
}

.badge-status-rahin {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;

  &.status--syariah {
    background-color: var(--g-kit-lime-10, #e6f6ea);
    border: 1px solid var(--g-kit-lime-50, #00ab4e);
    color: var(--g-kit-lime-60, #00883e);
  }

  &.status--konven {
    background-color: var(--g-kit-black-10, #f8f8f8);
    border: 1px solid var(--g-kit-black-40, #bbbdc0);
    color: var(--g-kit-black-60, #58585b);
  }
}

.badge-rating {
  display: inline-block;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--g-kit-black-80, #252528);
}

.badge-dukcapil {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;

  &.dukcapil--valid {
    background-color: var(--g-kit-lime-10, #e6f6ea);
    color: var(--g-kit-lime-60, #00883e);
  }

  &.dukcapil--tidak-sesuai {
    background-color: var(--g-kit-red-10, #fee4e2);
    color: var(--g-kit-red-60, #b42318);
  }

  &.dukcapil--belum {
    background-color: var(--g-kit-black-10, #f8f8f8);
    color: var(--g-kit-black-60, #58585b);
  }
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
  line-height: 20px;
}

.bo-table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 0 4px;
}
</style>
