<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { GAlert, GButton, GDropdown, GInputText, GTablePagination } from '@/components'
import ModuleSectionCard from '@/components/shared/card/ModuleSectionCard.vue'
import { rahnFlowKey } from '../rahnFlow'

const refreshIcon = new URL('../../../../node_modules/kitvue-public/src/assets/icon/icon-system/icon-refresh.svg', import.meta.url).href

const flow = inject(rahnFlowKey)
if (!flow) throw new Error('Rahn flow context is unavailable')

const {
  fieldsNasabah,
  customerSearchResults,
  selectedCustomer,
  nasabahTypeOptions,
  isMobile,
  isInformasiNasabahOpen,
  isNasabahInquired,
  isNasabahSearchSubmitted,
  isNasabahSelected,
  searchNasabah,
} = flow

const activeLoansOpen = ref(true)
const auctionCollateralOpen = ref(true)
const customerDataOpen = ref(true)
const pageSize = ref(10)
const activeLoansPage = ref(1)
const auctionCollateralPage = ref(1)
const customerPage = ref(1)

const toggleNasabahSelection = (customer: (typeof customerSearchResults.value)[number]) => {
  const isSelected = isNasabahSelected.value && selectedCustomer.value?.cif === customer.cif
  isNasabahSelected.value = !isSelected
  selectedCustomer.value = isSelected ? null : customer
}

const identityError = computed(() => {
  if (!isNasabahSearchSubmitted.value) return ''

  const nik = fieldsNasabah.value.nik.trim().replace(/\s/g, '')
  if (!nik) return 'Masukkan nomor induk kependudukan'
  if (!/^\d{16}$/.test(nik)) return 'Nomor induk kependudukan harus 16 digit.'
  if (!isNasabahInquired.value) return 'Data nasabah tidak ditemukan.'
  return ''
})

const customerNotice = computed(() => isNasabahSelected.value
  ? 'Anda sudah memilih salah satu Data Nasabah, silakan klik lanjut untuk melihat detail Data Nasabah.'
  : 'Pilih salah satu Data Nasabah untuk melanjutkan.')

const activeLoans = [
  { contract: '6078 **** **** ****', product: 'GADAI KCA', amount: 'Rp ***.300.000,00', collectability: '1- Lancar', status: 'Lunas' },
  { contract: '6078 **** **** ****', product: 'GADAI KCA', amount: 'Rp ***.300.000,00', collectability: '1- Lancar', status: 'Aktif' },
  { contract: '6078 **** **** ****', product: 'GADAI KCA', amount: 'Rp ***.300.000,00', collectability: '1- Lancar', status: 'Lunas' },
]

const auctionCollaterals = [
  { contract: '6078 **** **** ****', product: 'GADAI KCA', amount: 'Rp ***.300.000,00', collectability: '3- KL', note: 'BJDPL' },
  { contract: '6078 **** **** ****', product: 'GADAI KCA', amount: 'Rp ***.300.000,00', collectability: '3- KL', note: 'Suspect / Penandaan Bermasalah' },
  { contract: '6078 **** **** ****', product: 'GADAI KCA', amount: 'Rp ***.300.000,00', collectability: '3- KL', note: 'Barang Jaminan Taksiran Tinggi' },
]

const customerRows = customerSearchResults
const getVisibleRows = <T,>(rows: T[], page: number) => rows.slice(
  (page - 1) * pageSize.value,
  page * pageSize.value,
)
const visibleActiveLoans = computed(() => getVisibleRows(activeLoans, activeLoansPage.value))
const visibleAuctionCollaterals = computed(() => getVisibleRows(auctionCollaterals, auctionCollateralPage.value))
const visibleCustomers = computed(() => getVisibleRows(customerRows.value, customerPage.value))
const paginationLabel = (total: number, page: number) => {
  const first = total ? (page - 1) * pageSize.value + 1 : 0
  const last = Math.min(page * pageSize.value, total)
  return `Menampilkan ${first} sampai ${last} dari ${total} baris`
}

watch(pageSize, () => {
  activeLoansPage.value = 1
  auctionCollateralPage.value = 1
  customerPage.value = 1
})
</script>

<template>
  <div class="form-content rahn-customer-content">
    <div class="form-card rahn-customer-card">
      <ModuleSectionCard title="Informasi Nasabah" v-model="isInformasiNasabahOpen">
        <div class="form-grid rahn-customer-form">
          <GDropdown
            v-model="fieldsNasabah.tipeNasabah"
            class="rahn-customer-type"
            label="Tipe Nasabah"
            placeholder="Pilih tipe nasabah"
            :items="nasabahTypeOptions"
            item-value="value"
            item-text="label"
            error="Pilih tipe nasabah"
            required
            :is-checked="isNasabahSearchSubmitted"
            :use-bottom-sheet="isMobile"
          />
          <div class="customer-identity-field">
            <GInputText
              v-model="fieldsNasabah.nik"
              label="Nomor Induk Kependudukan (NIK)"
              placeholder="Masukkan nomor induk kependudukan"
              type="number"
              :maxlength="19"
              :error="identityError"
              helper-text="Nomor induk kependudukan harus 16 karakter."
            />
          </div>
        </div>
        <div class="rahn-customer-search">
          <GButton label="Cari" type="outline" size="md" @click="searchNasabah" />
        </div>
      </ModuleSectionCard>

      <template v-if="isNasabahInquired">
        <ModuleSectionCard title="Data Portofolio Pinjaman Aktif" v-model="activeLoansOpen">
          <GAlert
            class="rahn-table-alert variant"
            label="Data portofolio berikut adalah data dalam waktu 5 tahun terakhir berdasarkan tanggal pengajuan kredit."
            color="light-blue"
            variant="info"
          />
          <div class="rahn-table-toolbar">
            <span class="rahn-table-updated">
              Last updated on 10/01/2025, 10.00 AM
              <img :src="refreshIcon" alt="" aria-hidden="true" />
            </span>
            <label class="rahn-page-size">
              <span>Lihat</span>
              <select v-model.number="pageSize" aria-label="Jumlah baris data pinjaman aktif">
                <option :value="10">10</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
              </select>
              <span>baris</span>
            </label>
          </div>
          <div class="rahn-table-scroll">
            <table class="rahn-data-table rahn-data-table--active">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nomor Kontrak</th>
                  <th>Nama Produk</th>
                  <th>Nominal</th>
                  <th>Kolektibilitas <span class="rahn-sort" aria-hidden="true">↕</span></th>
                  <th>Status Kredit <span class="rahn-sort" aria-hidden="true">↕</span></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(loan, index) in visibleActiveLoans" :key="`${loan.contract}-${index}`">
                  <td>{{ (activeLoansPage - 1) * pageSize + index + 1 }}</td>
                  <td>{{ loan.contract }}</td>
                  <td>{{ loan.product }}</td>
                  <td>{{ loan.amount }}</td>
                  <td>{{ loan.collectability }}</td>
                  <td>{{ loan.status }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="rahn-table-pagination">
            <span>{{ paginationLabel(activeLoans.length, activeLoansPage) }}</span>
            <GTablePagination
              v-model="activeLoansPage"
              :total-rows="activeLoans.length"
              :per-page="pageSize"
            />
          </div>
        </ModuleSectionCard>

        <ModuleSectionCard title="Data Portofolio Barang Jaminan Dalam Proses Lelang (BJDPL)" v-model="auctionCollateralOpen">
          <div class="rahn-table-toolbar">
            <span class="rahn-table-updated">
              Last updated on 10/01/2025, 10.00 AM
              <img :src="refreshIcon" alt="" aria-hidden="true" />
            </span>
            <label class="rahn-page-size">
              <span>Lihat</span>
              <select v-model.number="pageSize" aria-label="Jumlah baris data barang jaminan">
                <option :value="10">10</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
              </select>
              <span>baris</span>
            </label>
          </div>
          <div class="rahn-table-scroll">
            <table class="rahn-data-table rahn-data-table--auction">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nomor Kontrak</th>
                  <th>Nama Produk</th>
                  <th>Nominal</th>
                  <th>Kolektabilitas <span class="rahn-sort" aria-hidden="true">↕</span></th>
                  <th>Keterangan <span class="rahn-sort" aria-hidden="true">↕</span></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(collateral, index) in visibleAuctionCollaterals" :key="`${collateral.contract}-${index}`">
                  <td>{{ (auctionCollateralPage - 1) * pageSize + index + 1 }}</td>
                  <td>{{ collateral.contract }}</td>
                  <td>{{ collateral.product }}</td>
                  <td>{{ collateral.amount }}</td>
                  <td>{{ collateral.collectability }}</td>
                  <td>{{ collateral.note }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="rahn-table-pagination">
            <span>{{ paginationLabel(auctionCollaterals.length, auctionCollateralPage) }}</span>
            <GTablePagination
              v-model="auctionCollateralPage"
              :total-rows="auctionCollaterals.length"
              :per-page="pageSize"
            />
          </div>
        </ModuleSectionCard>

        <ModuleSectionCard title="Data Nasabah" v-model="customerDataOpen">
          <GAlert
            class="rahn-table-alert variant"
            :label="customerNotice"
            color="light-blue"
            variant="info"
          />
          <div class="rahn-table-toolbar">
            <span class="rahn-table-updated">
              Last updated on 10/01/2025, 10.00 AM
              <img :src="refreshIcon" alt="" aria-hidden="true" />
            </span>
            <label class="rahn-page-size">
              <span>Lihat</span>
              <select v-model.number="pageSize" aria-label="Jumlah baris data nasabah">
                <option :value="10">10</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
              </select>
              <span>baris</span>
            </label>
          </div>
          <div class="rahn-table-scroll">
            <table
              class="rahn-data-table rahn-data-table--customer"
              :class="{ 'has-selected-customer': isNasabahSelected }"
            >
              <thead>
                <tr>
                  <th>No</th>
                  <th>Status Nasabah</th>
                  <th>Nomor CIF</th>
                  <th>Nama Nasabah <span class="rahn-sort" aria-hidden="true">↕</span></th>
                  <th>Rating Nasabah Gadai <span class="rahn-sort" aria-hidden="true">↕</span></th>
                  <th>NIK</th>
                  <th>Tanggal Lahir</th>
                  <th>Verifikasi Dukcapil</th>
                  <th>Nama Ibu Kandung <span class="rahn-sort" aria-hidden="true">↕</span></th>
                  <th>Jenis Kelamin <span class="rahn-sort" aria-hidden="true">↕</span></th>
                  <th>Alamat Rumah</th>
                  <th>Nomor Handphone <span class="rahn-sort" aria-hidden="true">↕</span></th>
                  <th>Cabang Pembuka <span class="rahn-sort" aria-hidden="true">↕</span></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, index) in visibleCustomers"
                  :key="row.cif"
                  :class="{ 'is-selected': isNasabahSelected }"
                  :aria-selected="isNasabahSelected"
                  tabindex="0"
                  @click="toggleNasabahSelection(row)"
                  @keydown.enter.space.prevent="toggleNasabahSelection(row)"
                >
                  <td>{{ (customerPage - 1) * pageSize + index + 1 }}</td>
                  <td>{{ row.status }}</td>
                  <td>{{ row.cif }}</td>
                  <td>{{ row.name }}</td>
                  <td>{{ row.rating }}</td>
                  <td>{{ row.nik }}</td>
                  <td>{{ row.birthDate }}</td>
                  <td>{{ row.dukcapil }}</td>
                  <td>{{ row.motherName }}</td>
                  <td>{{ row.gender }}</td>
                  <td>{{ row.address }}</td>
                  <td>{{ row.phone }}</td>
                  <td>{{ row.branch }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="rahn-table-pagination">
            <span>{{ paginationLabel(customerRows.length, customerPage) }}</span>
            <GTablePagination
              v-model="customerPage"
              :total-rows="customerRows.length"
              :per-page="pageSize"
            />
          </div>
          <p v-if="isNasabahSearchSubmitted && !isNasabahSelected" class="rahn-selection-error">
            Pilih salah satu Data Nasabah untuk melanjutkan.
          </p>
        </ModuleSectionCard>
      </template>
    </div>
  </div>
</template>
