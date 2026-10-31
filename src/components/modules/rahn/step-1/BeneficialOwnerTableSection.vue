<script setup lang="ts">
/**
 * @file BeneficialOwnerTableSection.vue
 * @description SPRINT Single UI Data Beneficial Owner Table Card matching Figma Node 12920:311792.
 * Displays search results table with green header, 'Terpilih' / 'Pilih' state, and pagination.
 * Conforms strictly to Pegadaian --g-kit-* design tokens and kitvue-plugin rules.
 */
import { computed, ref } from 'vue'
import { GAlert, GButton, GTablePagination } from '@/components'
import iconRefreshAsset from 'kitvue-public/src/assets/icon/icon-system/icon-refresh.svg'
import {
  type BeneficialOwnerItem,
  MOCK_BENEFICIAL_OWNERS,
} from '../mockBeneficialOwnerData'

const iconRefresh = iconRefreshAsset as unknown as string

const props = withDefaults(
  defineProps<{
    items?: BeneficialOwnerItem[]
    selectedBo?: BeneficialOwnerItem | null
    identityType?: 'ktp' | 'paspor' | ''
    isNotFound?: boolean
    isMobile?: boolean
  }>(),
  {
    items: undefined,
    selectedBo: null,
    identityType: 'ktp',
    isNotFound: false,
    isMobile: false,
  },
)

const emit = defineEmits<{
  (e: 'select', item: BeneficialOwnerItem, isSesuai: boolean): void
}>()

const displayedBoList = computed(() => {
  if (props.isNotFound) {
    return []
  }
  if (props.items !== undefined) {
    return props.items
  }
  if (props.identityType === 'paspor') {
    return [MOCK_BENEFICIAL_OWNERS[0]]
  }
  return MOCK_BENEFICIAL_OWNERS.slice(0, 2)
})

const perPage = ref('10')
const currentPage = ref(1)

const isSelected = (item: BeneficialOwnerItem): boolean => {
  if (props.selectedBo) {
    return props.selectedBo.registrationNumber === item.registrationNumber
  }
  return false
}

const handleSelect = (item: BeneficialOwnerItem) => {
  // Row 1 (1234 1234) corresponds to Branch 1 (Alamat TIDAK Sesuai KTP -> isSesuai = false)
  // Row 2 (1234 2222) corresponds to Branch 2 (Alamat SESUAI KTP -> isSesuai = true)
  const isSesuai = item.registrationNumber === '1234 2222'
  emit('select', item, isSesuai)
}
</script>

<template>
  <div class="bo-table-card-content" data-node-id="12920:311890">
    <!-- Infotip Alert matching Figma Node 11347:158046 (Paspor) & Image 2 (KTP) -->
    <GAlert
      v-if="!isNotFound"
      class="rahn-notice mb-3 variant"
      :label="
        identityType === 'paspor'
          ? 'Pilih salah satu data untuk dilanjutkan ke detail data beneficial owner'
          : 'Berikut adalah data Beneficial Owner yang terdaftar sesuai dengan NIK yang dicari.'
      "
      color="light-blue"
      variant="info"
    />

    <!-- Table Toolbar -->
    <div class="bo-table-toolbar">
      <div class="d-flex align-items-center gap-2">
        <span class="text-muted-custom">Last updated on 10/01/2024, 10.00 AM</span>
        <button type="button" class="btn-refresh" title="Muat ulang data" aria-label="Muat ulang data">
          <img :src="iconRefresh" alt="Refresh" width="16" height="16" />
        </button>
      </div>
      <div class="d-flex align-items-center gap-2">
        <span class="text-muted-custom">{{ identityType === 'paspor' ? 'Lihat Detail' : 'Lihat' }}</span>
        <select v-model="perPage" class="form-select-sm form-select-custom">
          <option value="10">10</option>
          <option value="2">2</option>
          <option value="25">25</option>
        </select>
        <span class="text-muted-custom">baris</span>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bo-table-container">
      <table class="bo-table">
        <thead>
          <tr>
            <th class="col-no">No</th>
            <th class="col-reg">Nomor Registrasi</th>
            <th class="col-name">Nama Beneficial Owner</th>
            <th class="col-nik">{{ identityType === 'paspor' ? 'Nomor Paspor' : 'NIK' }}</th>
            <th class="col-birth">Tanggal Lahir</th>
            <th class="col-mother">Nama Ibu Kandung</th>
            <th class="col-gender">Jenis Kelamin</th>
            <th class="col-job">Pekerjaan Terkini</th>
            <th class="col-address">Alamat Rumah</th>
            <th class="col-phone">Nomor Handphone</th>
            <th class="col-branch">Cabang Pembuka</th>
            <th class="col-aksi text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isNotFound || displayedBoList.length === 0" class="empty-row">
            <td colspan="12" class="text-center py-5 text-muted-custom">
              Tidak ada data yang ditampilkan.
            </td>
          </tr>
          <tr
            v-else
            v-for="item in displayedBoList"
            :key="item.id"
            :class="{ 'selected-row': isSelected(item) }"
          >
            <td class="col-no">{{ item.no }}</td>
            <td class="col-reg">{{ item.registrationNumber }}</td>
            <td class="col-name font-bold">{{ item.name }}</td>
            <td class="col-nik">{{ identityType === 'paspor' ? (item.pasporNumber || '0033 9714 84') : item.nik }}</td>
            <td class="col-birth">{{ item.birthDate }}</td>
            <td class="col-mother">{{ item.motherName }}</td>
            <td class="col-gender">{{ item.gender }}</td>
            <td class="col-job">{{ item.job }}</td>
            <td class="col-address">{{ item.address }}</td>
            <td class="col-phone">{{ item.phone }}</td>
            <td class="col-branch">{{ item.branch }}</td>
            <td class="col-aksi text-center">
              <GButton
                v-if="isSelected(item)"
                label="Terpilih"
                type="primary"
                size="sm"
                class="btn-terpilih"
                @click="handleSelect(item)"
              />
              <GButton
                v-else
                label="Pilih"
                type="outline"
                size="sm"
                class="btn-pilih"
                @click="handleSelect(item)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Table Footer with Pagination matching Figma Node 11347:158046 (Paspor) & Image 2 (KTP) -->
    <div class="bo-table-footer">
      <span class="text-muted-custom">
        {{
          isNotFound || displayedBoList.length === 0
            ? 'Menampilkan 0 sampai 0 dari 0 data'
            : (identityType === 'paspor'
                ? `Menampilkan 1 sampai ${displayedBoList.length} dari ${displayedBoList.length} baris`
                : `Menampilkan 1 sampai ${displayedBoList.length} dari ${displayedBoList.length} data`)
        }}
      </span>
      <GTablePagination
        :total-rows="isNotFound ? 0 : displayedBoList.length"
        :per-page="10"
        v-model="currentPage"
        :disabled="isNotFound || displayedBoList.length === 0"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.bo-table-card-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  min-width: 0;
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

.col-reg {
  min-width: 160px;
}

.col-name {
  min-width: 200px;
}

.col-nik {
  min-width: 200px;
}

.col-birth {
  min-width: 160px;
}

.col-mother {
  min-width: 160px;
}

.col-gender {
  min-width: 140px;
}

.col-job {
  min-width: 160px;
}

.col-address {
  min-width: 260px;
}

.col-phone {
  min-width: 160px;
}

.col-branch {
  min-width: 160px;
}

/* Sticky Action Column (Figma Node 12920:312021 & User Image 5) */
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

.bo-table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 0 4px;
}
</style>
