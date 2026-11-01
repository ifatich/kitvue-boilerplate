<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { GAlert, GButton, GImageView, GTablePagination } from '@/components'
import ModuleSectionCard from '@/components/shared/card/ModuleSectionCard.vue'
import RahnCollateralFormModal from '@/components/modules/rahn/RahnCollateralFormModal.vue'
import { rahnFlowKey, type RahnCollateral } from '../rahnFlow'

const flow = inject(rahnFlowKey)
if (!flow) throw new Error('Rahn flow context is unavailable')

const showModal = ref(false)
const editingIndex = ref<number | null>(null)
const editingCollateral = ref<RahnCollateral | null>(null)
const pageSize = ref(10)
const currentPage = ref(1)
const pageCount = computed(() => Math.max(1, Math.ceil(flow.collaterals.value.length / pageSize.value)))
const visibleCollaterals = computed(() => flow.collaterals.value.slice(
  (currentPage.value - 1) * pageSize.value,
  currentPage.value * pageSize.value,
))
const firstVisibleRow = computed(() => flow.collaterals.value.length ? (currentPage.value - 1) * pageSize.value + 1 : 0)
const lastVisibleRow = computed(() => Math.min(currentPage.value * pageSize.value, flow.collaterals.value.length))
const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID').format(value)
const photosStartingAt = (photos: string[], startIndex: number) => [
  ...photos.slice(startIndex),
  ...photos.slice(0, startIndex),
]
const totalEstimatedValue = computed(() => flow.collaterals.value.reduce(
  (total, collateral) => total + collateral.estimatedValue,
  0,
))

watch(pageSize, () => {
  currentPage.value = 1
})

const openAddModal = () => {
  editingIndex.value = null
  editingCollateral.value = null
  showModal.value = true
}

const openEditModal = (item: RahnCollateral, index: number) => {
  editingIndex.value = index
  editingCollateral.value = item
  showModal.value = true
}

const saveCollateral = (collateral: RahnCollateral) => {
  if (editingIndex.value === null) flow.collaterals.value.push(collateral)
  else flow.collaterals.value.splice(editingIndex.value, 1, collateral)
  currentPage.value = pageCount.value
}

const removeCollateral = (index: number) => {
  flow.collaterals.value.splice(index, 1)
  currentPage.value = Math.min(currentPage.value, pageCount.value)
}

</script>

<template>
  <div class="form-content rahn-collateral-content">
    <ModuleSectionCard title="Data Jaminan" class="rahn-collateral-card">
      <GAlert
        v-if="!flow.collaterals.value.length"
        class="rahn-collateral-required variant"
        label="Tambahkan minimal satu data jaminan untuk melanjutkan."
        color="light-blue"
        variant="info"
      />

      <div v-if="flow.collaterals.value.length" class="rahn-collateral-toolbar">
        <label class="rahn-collateral-page-size">
          Lihat
          <select v-model.number="pageSize" aria-label="Jumlah baris">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
          baris
        </label>
      </div>

      <div class="rahn-collateral-table-wrap">
        <table class="rahn-collateral-table">
          <colgroup v-if="flow.collaterals.value.length">
            <col class="rahn-collateral-col-rubric" />
            <col class="rahn-collateral-col-type" />
            <col class="rahn-collateral-col-details" />
            <col class="rahn-collateral-col-photos" />
            <col class="rahn-collateral-col-estimate" />
            <col class="rahn-collateral-col-actions" />
          </colgroup>
          <colgroup v-else>
            <col class="rahn-collateral-col-empty-rubric" />
            <col class="rahn-collateral-col-empty-type" />
            <col class="rahn-collateral-col-empty-details" />
            <col class="rahn-collateral-col-photos" />
            <col class="rahn-collateral-col-empty-actions" />
          </colgroup>
          <thead>
            <tr>
              <th>Rubrik</th>
              <th>Tipe Jaminan</th>
              <th>Detail Jaminan</th>
              <th>Foto Jaminan</th>
              <th v-if="flow.collaterals.value.length">Taksiran</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody v-if="visibleCollaterals.length">
            <tr v-for="(item, index) in visibleCollaterals" :key="`${item.rubric}-${index}`">
              <td>{{ item.rubric }}</td>
              <td>{{ item.collateralType }}</td>
              <td class="rahn-collateral-details">
                Mitra : {{ item.partner }}<br />
                Merek Emas : {{ item.brand }}<br />
                Denominasi : {{ item.denomination }} gram<br />
                Jumlah Keping : {{ item.pieces }} Pcs<br />
                Karat : {{ item.karat }}<br />
                Keterangan : {{ item.description }}
              </td>
              <td>
                <div class="rahn-collateral-thumbnails">
                  <div
                    v-for="(photo, photoIndex) in item.photos.slice(0, 2)"
                    :key="photoIndex"
                    class="rahn-collateral-thumbnail"
                  >
                    <GImageView
                      :img-src="photo"
                      :images="photosStartingAt(item.photos, photoIndex)"
                      img-alt="Foto barang jaminan"
                      aspect-ratio="1:1"
                      :width="81"
                      :height="81"
                      fit="cover"
                      previewable
                    />
                    <span
                      v-if="photoIndex === 1 && item.photos.length > 2"
                      class="rahn-collateral-thumbnail-count"
                    >
                      +{{ item.photos.length - 2 }}
                    </span>
                  </div>
                </div>
              </td>
              <td>Rp{{ formatCurrency(item.estimatedValue) }}</td>
              <td>
                <div class="rahn-collateral-actions">
                  <GButton
                    label="Hapus"
                    type="outline"
                    size="sm"
                    class="rahn-collateral-delete"
                    @click="removeCollateral((currentPage - 1) * pageSize + index)"
                  />
                  <GButton
                    label="Ubah"
                    type="outline"
                    size="sm"
                    class="rahn-collateral-edit"
                    @click="openEditModal(item, (currentPage - 1) * pageSize + index)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td :colspan="flow.collaterals.value.length ? 6 : 5" class="rahn-collateral-empty">
                Tidak ada data yang ditampilkan.
              </td>
            </tr>
          </tbody>
          <tfoot v-if="flow.collaterals.value.length">
            <tr>
              <th colspan="5">
                <div class="rahn-collateral-total-row">
                  <span>Total Taksiran</span>
                  <span>Rp{{ formatCurrency(totalEstimatedValue) }}</span>
                </div>
              </th>
              <th />
            </tr>
          </tfoot>
        </table>
      </div>

      <div v-if="flow.collaterals.value.length" class="rahn-collateral-pagination">
        <span>Menampilkan {{ firstVisibleRow }} sampai {{ lastVisibleRow }} dari {{ flow.collaterals.value.length }} baris</span>
        <GTablePagination
          v-model="currentPage"
          :total-rows="flow.collaterals.value.length"
          :per-page="pageSize"
        />
      </div>

      <div class="rahn-collateral-add">
        <GButton label="Tambah Jaminan" type="outline" size="md" @click="openAddModal" />
      </div>
    </ModuleSectionCard>

    <RahnCollateralFormModal
      v-model="showModal"
      :rubric="flow.fields.value.rubrikMarhun"
      :is-mobile="flow.isMobile.value"
      :initial-collateral="editingCollateral"
      @save="saveCollateral"
    />
  </div>
</template>

<style scoped lang="scss">
.rahn-collateral-card {
  min-height: 640px;
  margin-bottom: 0;
  padding: 24px;

  :deep(.section-collapse__content) {
    padding-top: 16px;
  }

  @media (max-width: 767px) {
    min-height: 0;
    padding: 16px;
  }
}

.rahn-collateral-toolbar {
  margin: 0 0 16px;
}

.rahn-collateral-page-size {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--g-kit-black-80, #252528);
  font-size: 12px;
  line-height: 18px;

  select {
    width: 52px;
    height: 24px;
    padding: 2px 6px;
    border: 1px solid var(--g-kit-black-20, #eeeeef);
    border-radius: 4px;
    background: var(--g-kit-white, #ffffff);
    color: inherit;
    font: inherit;
  }
}

.rahn-collateral-table-wrap {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--g-kit-black-20, #eeeeef);
  border-radius: 6px;
}

.rahn-collateral-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  color: var(--g-kit-black-80, #252528);
  font-size: 14px;
  line-height: 20px;
  text-align: left;

  th,
  td {
    padding: 16px;
    border-right: 1px solid var(--g-kit-black-20, #eeeeef);
    border-bottom: 1px solid var(--g-kit-black-20, #eeeeef);
    vertical-align: top;
  }

  th {
    height: 52px;
    border-right-color: rgba(255, 255, 255, 0.4);
    border-bottom: 0;
    background: var(--g-kit-lime-50, #00ab4e);
    color: var(--g-kit-white, #ffffff);
    font-size: 14px;
    font-weight: var(--g-kit-font-weight-bold, 800);
    white-space: nowrap;
  }

  th:last-child,
  td:last-child {
    border-right: 0;
  }

  tbody td {
    height: auto;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }

  tbody td:nth-child(5) {
    text-align: right;
  }

  tfoot th {
    height: 52px;
    border: 0;
    background: var(--g-kit-black-10, #f8f8f8);
    color: var(--g-kit-black-80, #252528);
    text-align: left;
  }

  tfoot th:nth-child(2) {
    text-align: right;
  }

  @media (max-width: 767px) {
    min-width: 930px;
  }
}

.rahn-collateral-empty {
  height: 116px;
  text-align: center;
  vertical-align: middle !important;
}

.rahn-collateral-col-rubric {
  width: 200px;
}

.rahn-collateral-col-type,
.rahn-collateral-col-details {
  width: 110px;
}

.rahn-collateral-col-photos {
  width: 202px;
}

.rahn-collateral-col-estimate {
  width: 160px;
}

.rahn-collateral-col-actions {
  width: 148px;
}

.rahn-collateral-col-empty-rubric {
  width: 240px;
}

.rahn-collateral-col-empty-type,
.rahn-collateral-col-empty-details {
  width: 170px;
}

.rahn-collateral-col-empty-actions {
  width: 148px;
}

.rahn-collateral-total-row {
  display: flex;
  justify-content: space-between;
  font-weight: var(--g-kit-font-weight-bold, 800);
}

.rahn-collateral-details {
  white-space: normal;
  overflow-wrap: break-word;
}

.rahn-collateral-thumbnails {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.rahn-collateral-thumbnail {
  position: relative;
  flex: 0 0 81px;
  width: 81px;
  height: 81px;
  overflow: hidden;
  border-radius: 8px;

  :deep(.image-view-title) {
    display: none;
  }

  :deep(.image-view) {
    display: block;
    width: 100%;
    height: 100%;
  }

  :deep(.image-container) {
    width: 100%;
    height: 100%;
    border-color: var(--g-kit-black-40, #bbbdc0);
    border-radius: 8px;
  }
}

.rahn-collateral-thumbnail-count {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.5);
  color: var(--g-kit-white, #ffffff);
  font-size: 14px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  pointer-events: none;
}

.rahn-collateral-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.rahn-collateral-actions :deep(.rahn-collateral-delete),
.rahn-collateral-actions :deep(.rahn-collateral-edit) {
  min-width: 52px;
  padding: 0 8px;
  border: 1px solid var(--g-kit-black-40, #bbbdc0);
  border-radius: 4px;
  background: var(--g-kit-white, #ffffff);
  color: var(--g-kit-black-60, #58585b);
  font-size: 12px;
  line-height: 18px;
}

.rahn-collateral-actions :deep(.rahn-collateral-edit) {
  border-color: var(--g-kit-lime-50, #00ab4e);
  color: var(--g-kit-lime-50, #00ab4e);
}

.rahn-collateral-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;
  color: var(--g-kit-black-80, #252528);
  font-size: 12px;
  line-height: 18px;
}

.rahn-collateral-pagination :deep(.custom-pagination) {
  margin-bottom: 0;
}

.rahn-collateral-add {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;

  :deep(.btn-outline) {
    min-width: 200px;
    height: 40px;
    border-color: var(--g-kit-lime-50, #00ab4e);
    color: var(--g-kit-lime-50, #00ab4e);
  }
}

@media (max-width: 767px) {
  .rahn-collateral-card {
    border-radius: 0;
  }

  .rahn-collateral-add :deep(.btn-outline) {
    width: 100%;
  }
}
</style>
