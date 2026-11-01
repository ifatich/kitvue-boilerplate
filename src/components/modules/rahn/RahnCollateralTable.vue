<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { GButton, GImageView, GTablePagination } from '@/components'
import type { RahnCollateral } from '@/views/rahn/rahnFlow'

const props = defineProps<{
  items: readonly RahnCollateral[]
}>()

const emit = defineEmits<{
  edit: [index: number]
  remove: [index: number]
}>()

const pageSize = ref(10)
const currentPage = ref(1)
const pageCount = computed(() => Math.max(1, Math.ceil(props.items.length / pageSize.value)))
const visibleItems = computed(() => props.items.slice(
  (currentPage.value - 1) * pageSize.value,
  currentPage.value * pageSize.value,
))
const firstVisibleRow = computed(() => props.items.length ? (currentPage.value - 1) * pageSize.value + 1 : 0)
const lastVisibleRow = computed(() => Math.min(currentPage.value * pageSize.value, props.items.length))
const totalEstimatedValue = computed(() => props.items.reduce(
  (total, collateral) => total + collateral.estimatedValue,
  0,
))

const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID').format(value)
const photosStartingAt = (photos: string[], startIndex: number) => [
  ...photos.slice(startIndex),
  ...photos.slice(0, startIndex),
]

watch(pageSize, () => {
  currentPage.value = 1
})

watch(() => props.items.length, (nextLength, previousLength) => {
  if (nextLength > previousLength) currentPage.value = pageCount.value
  else currentPage.value = Math.min(currentPage.value, pageCount.value)
})
</script>

<template>
  <div class="rahn-collateral-table-component">
    <div v-if="items.length" class="rahn-collateral-table-component__toolbar">
      <label class="rahn-collateral-table-component__page-size">
        Lihat
        <select v-model.number="pageSize" aria-label="Jumlah baris data jaminan">
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
        baris
      </label>
    </div>

    <div class="rahn-collateral-table-component__wrap">
      <table class="rahn-collateral-table-component__table">
        <colgroup>
          <col class="rahn-collateral-table-component__col-rubric">
          <col class="rahn-collateral-table-component__col-type">
          <col class="rahn-collateral-table-component__col-details">
          <col class="rahn-collateral-table-component__col-photos">
          <col class="rahn-collateral-table-component__col-estimate">
          <col class="rahn-collateral-table-component__col-actions">
        </colgroup>
        <thead>
          <tr>
            <th>Rubrik</th>
            <th>Tipe Jaminan</th>
            <th>Detail Jaminan</th>
            <th>Foto Jaminan</th>
            <th>Taksiran</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody v-if="visibleItems.length">
          <tr v-for="(item, visibleIndex) in visibleItems" :key="`${item.rubric}-${(currentPage - 1) * pageSize + visibleIndex}`">
            <td>{{ item.rubric }}</td>
            <td>{{ item.collateralType }}</td>
            <td class="rahn-collateral-table-component__details">
              Mitra : {{ item.partner }}<br>
              Merek Emas : {{ item.brand }}<br>
              Denominasi : {{ item.denomination }} gram<br>
              Jumlah Keping : {{ item.pieces }} Pcs<br>
              Karat : {{ item.karat }}<br>
              Keterangan : {{ item.description }}
            </td>
            <td>
              <div class="rahn-collateral-table-component__thumbnails">
                <div
                  v-for="(photo, photoIndex) in item.photos.slice(0, 2)"
                  :key="photoIndex"
                  class="rahn-collateral-table-component__thumbnail"
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
                    class="rahn-collateral-table-component__thumbnail-count"
                  >
                    +{{ item.photos.length - 2 }}
                  </span>
                </div>
              </div>
            </td>
            <td>Rp{{ formatCurrency(item.estimatedValue) }}</td>
            <td>
              <div class="rahn-collateral-table-component__actions">
                <GButton
                  label="Hapus"
                  type="outline"
                  size="sm"
                  class="rahn-collateral-table-component__delete"
                  @click="emit('remove', (currentPage - 1) * pageSize + visibleIndex)"
                />
                <GButton
                  label="Ubah"
                  type="outline"
                  size="sm"
                  class="rahn-collateral-table-component__edit"
                  @click="emit('edit', (currentPage - 1) * pageSize + visibleIndex)"
                />
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="6" class="rahn-collateral-table-component__empty">
              Tidak ada data yang ditampilkan.
            </td>
          </tr>
        </tbody>
        <tfoot v-if="items.length">
          <tr>
            <th colspan="5">
              <div class="rahn-collateral-table-component__total">
                <span>Total Taksiran</span>
                <span>Rp{{ formatCurrency(totalEstimatedValue) }}</span>
              </div>
            </th>
            <th />
          </tr>
        </tfoot>
      </table>
    </div>

    <div v-if="items.length" class="rahn-collateral-table-component__pagination">
      <span>Menampilkan {{ firstVisibleRow }} sampai {{ lastVisibleRow }} dari {{ items.length }} baris</span>
      <GTablePagination
        v-model="currentPage"
        :total-rows="items.length"
        :per-page="pageSize"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.rahn-collateral-table-component__toolbar {
  margin: 0 0 16px;
}

.rahn-collateral-table-component__page-size {
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

.rahn-collateral-table-component__wrap {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--g-kit-black-20, #eeeeef);
  border-radius: 6px;
}

.rahn-collateral-table-component__table {
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

  @media (max-width: 767px) {
    min-width: 930px;
  }
}

.rahn-collateral-table-component__details {
  white-space: normal;
  overflow-wrap: break-word;
}

.rahn-collateral-table-component__col-rubric {
  width: 200px;
}

.rahn-collateral-table-component__col-type,
.rahn-collateral-table-component__col-details {
  width: 110px;
}

.rahn-collateral-table-component__col-photos {
  width: 202px;
}

.rahn-collateral-table-component__col-estimate {
  width: 160px;
}

.rahn-collateral-table-component__col-actions {
  width: 148px;
}

.rahn-collateral-table-component__empty {
  height: 116px;
  text-align: center;
  vertical-align: middle !important;
}

.rahn-collateral-table-component__total {
  display: flex;
  justify-content: space-between;
  font-weight: var(--g-kit-font-weight-bold, 800);
}

.rahn-collateral-table-component__thumbnails {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.rahn-collateral-table-component__thumbnail {
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

.rahn-collateral-table-component__thumbnail-count {
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

.rahn-collateral-table-component__actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.rahn-collateral-table-component__actions :deep(.rahn-collateral-table-component__delete),
.rahn-collateral-table-component__actions :deep(.rahn-collateral-table-component__edit) {
  min-width: 52px;
  padding: 0 8px;
  border: 1px solid var(--g-kit-black-40, #bbbdc0);
  border-radius: 4px;
  background: var(--g-kit-white, #ffffff);
  color: var(--g-kit-black-60, #58585b);
  font-size: 12px;
  line-height: 18px;
}

.rahn-collateral-table-component__actions :deep(.rahn-collateral-table-component__edit) {
  border-color: var(--g-kit-lime-50, #00ab4e);
  color: var(--g-kit-lime-50, #00ab4e);
}

.rahn-collateral-table-component__pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;
  color: var(--g-kit-black-80, #252528);
  font-size: 12px;
  line-height: 18px;

  :deep(.custom-pagination) {
    margin-bottom: 0;
  }
}
</style>
