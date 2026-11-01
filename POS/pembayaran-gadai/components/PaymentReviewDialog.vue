<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import type { PaymentSummary } from '../payment-types'

const props = defineProps<{
  open: boolean
  summary: PaymentSummary
}>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value).replace(/\u00a0/g, '')
}

const decorationSvg = "data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgd2lkdGg9IjE3MS42MzUiIGhlaWdodD0iMTY5LjU1NiIgdmlld0JveD0iMCAwIDE3MS42MzUgMTY5LjU1NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgaWQ9Ikdyb3VwIDYyNjU5NyI+CjxwYXRoIGlkPSJWZWN0b3IiIGQ9Ik05Ny40MzYyIDg4LjQ1NzZDMTA1Ljc3MSA1MS44MTMyIDk0LjA5NTYgMTcuOTE3MyA3MS4zNTY5IDEyLjc0ODlDNDguNjE4MyA3LjU4MDYgMjMuNDI3NiAzMy4wOTcxIDE1LjA5MjMgNjkuNzQxNEM2Ljc1NzEgMTA2LjM4NiAxOC40MzM2IDE0MC4yODIgNDEuMTcyMiAxNDUuNDVDNjMuOTEwOSAxNTAuNjE4IDg5LjEwMSAxMjUuMTAyIDk3LjQzNjIgODguNDU3NloiIGZpbGw9IiNDNkU1QjQiIGZpbGwtb3BhY2l0eT0iMC4xNSIvPgo8Zm9yZWlnbk9iamVjdCB4PSItNTEuNzQ2OCIgeT0iLTYyLjI3MzQiIHdpZHRoPSIyNjMuOTk2IiBoZWlnaHQ9IjI5MC44NTMiPjxkaXYgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwiIHN0eWxlPSJiYWNrZHJvcC1maWx0ZXI6Ymx1cig0MHB4KTtjbGlwLXBhdGg6dXJsKCNiZ2JsdXJfMF8wXzEyMjY5X2NsaXBfcGF0aCk7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJSI+PC9kaXY+PC9mb3JlaWduT2JqZWN0PjxwYXRoIGlkPSJWZWN0b3JfMiIgZGF0YS1maWdtYS1iZy1ibHVyLXJhZGl1cz0iODAiIGQ9Ik0xMTIuNzQ5IDEwNC40NjhDMTM1LjE2NiA3MC4zMTU1IDEzOC43ODggMzMuMDg2NiAxMjAuODQgMjEuMzE0OEMxMDIuODkyIDkuNTQyOTYgNzAuMTcgMjcuNjg1OSA0Ny43NTMyIDYxLjgzODJDMjUuMzM2NSA5NS45OTA2IDIxLjcxNCAxMzMuMjE5IDM5LjY2MjEgMTQ0Ljk5MUM1Ny42MTAyIDE1Ni43NjMgOTAuMzMyNCAxMzguNjIgMTEyLjc0OSAxMDQuNDY4WiIgZmlsbD0iI0M2RTVCNCIgZmlsbC1vcGFjaXR5PSIwLjIiLz4KPGZvcmVpZ25PYmplY3QgeD0iLTQ0LjU4ODkiIHk9Ii0zMy4zNzQ4IiB3aWR0aD0iMjc4LjkwNyIgaGVpZ2h0PSIyNjMuNzQ3Ij48ZGl2IHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sIiBzdHlsZT0iYmFja2Ryb3AtZmlsdGVyOmJsdXIoNDBweCk7Y2xpcC1wYXRoOnVybCgjYmdibHVyXzFfMF8xMjI2OV9jbGlwX3BhdGgpO2hlaWdodDoxMDAlO3dpZHRoOjEwMCUiPjwvZGl2PjwvZm9yZWlnbk9iamVjdD48cGF0aCBpZD0iVmVjdG9yXzMiIGRhdGEtZmlnbWEtYmctYmx1ci1yYWRpdXM9IjgwIiBkPSJNMTE2LjEzNCAxMjQuOTMzQzE0Ni43ODYgMTAwLjI4OCAxNjIuMTEyIDY4LjQ3NDMgMTUwLjM2NiA1My44NzUyQzEzOC42MTkgMzkuMjc2MSAxMDQuMjQ4IDQ3LjQxOTYgNzMuNTk1MyA3Mi4wNjQ2QzQyLjk0MjYgOTYuNzA5NSAyNy42MTY0IDEyOC41MjMgMzkuMzYzIDE0My4xMjJDNTEuMTA5NiAxNTcuNzIxIDg1LjQ4MDggMTQ5LjU3OCAxMTYuMTM0IDEyNC45MzNaIiBmaWxsPSIjQzZFNUI0IiBmaWxsLW9wYWNpdHk9IjAuMjUiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJiZ2JsdXJfMF8wXzEyMjY5X2NsaXBfcGF0aCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTEuNzQ2OCA2Mi4yNzM0KSI+PHBhdGggZD0iTTExMi43NDkgMTA0LjQ2OEMxMzUuMTY2IDcwLjMxNTUgMTM4Ljc4OCAzMy4wODY2IDEyMC44NCAyMS4zMTQ4QzEwMi44OTIgOS41NDI5NiA3MC4xNyAyNy42ODU5IDQ3Ljc1MzIgNjEuODM4MkMyNS4zMzY1IDk1Ljk5MDYgMjEuNzE0IDEzMy4yMTkgMzkuNjYyMSAxNDQuOTkxQzU3LjYxMDIgMTU2Ljc2MyA5MC4zMzI0IDEzOC42MiAxMTIuNzQ5IDEwNC40NjhaIi8+CjwvY2xpcFBhdGg+PGNsaXBQYXRoIGlkPSJiZ2JsdXJfMV8wXzEyMjY5X2NsaXBfcGF0aCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDQuNTg4OSAzMy4zNzQ4KSI+PHBhdGggZD0iTTExNi4xMzQgMTI0LjkzM0MxNDYuNzg2IDEwMC4yODggMTYyLjExMiA2OC40NzQzIDE1MC4zNjYgNTMuODc1MkMxMzguNjE5IDM5LjI3NjEgMTA0LjI0OCA0Ny40MTk2IDczLjU5NTMgNzIuMDY0NkM0Mi45NDI2IDk2LjcwOTUgMjcuNjE2NCAxMjguNTIzIDM5LjM2MyAxNDMuMTIyQzUxLjEwOTYgMTU3LjcyMSA4NS40ODA4IDE0OS41NzggMTE2LjEzNCAxMjQuOTMzWiIvPgo8L2NsaXBQYXRoPjwvZGVmcz4KPC9zdmc+Cg=="

let previousOverflow = ''
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) emit('close')
}

watch(
  () => props.open,
  (open) => {
    if (typeof document === 'undefined') return
    if (open) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeydown)
    } else {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeydown)
    }
  },
)

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = previousOverflow
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="props.open"
      class="pgd-dialog-backdrop pgd-dialog-backdrop--confirmation"
      @click.self="emit('close')"
    >
      <section
        class="pgd-dialog pgd-dialog--confirmation"
        role="dialog"
        aria-modal="true"
        aria-label="Pastikan Data Sudah Sesuai"
      >
        <header class="pgd-dialog__header">
          <button
            class="pgd-dialog__close"
            type="button"
            aria-label="Tutup"
            @click="emit('close')"
          >
            <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 5l10 10M15 5L5 15" stroke-linecap="round"></path>
            </svg>
          </button>
          <div class="pgd-dialog__heading">
            <h2 class="pgd-dialog__title" style="font-weight: var(--g-kit-font-weight-title-bold);">Pastikan Data Sudah Sesuai</h2>
            <p class="pgd-dialog__description">Periksa kembali detail kredit dan total pembayaran sebelum melanjutkan proses pelunasan gadai.</p>
          </div>
          <div class="pgd-dialog__body">
            <div class="pgd-review">
              <section class="pgd-emas-card">
                <div class="pgd-emas-card__decoration" aria-hidden="true">
                  <img :src="decorationSvg" alt="">
                </div>
                <div class="pgd-emas-card__top">
                  <span class="pgd-emas-card__label">
                    Total {{ summary.transactionType === 'Pelunasan' ? 'Pelunasan' : summary.transactionType || 'Pembayaran' }}
                  </span>
                  <strong class="pgd-emas-card__total">{{ formatCurrency(summary.total) }}</strong>
                </div>
                <div class="pgd-item-divider" aria-hidden="true"></div>
                <dl class="pgd-emas-card__details">
                  <div class="pgd-detail-row">
                    <dt>Nomor Kredit</dt>
                    <dd>{{ summary.number ? summary.number.replace(/(\d{4})(?=\d)/g, '$1 ') : '-' }}</dd>
                  </div>
                  <div class="pgd-detail-row">
                    <dt>Nama Nasabah</dt>
                    <dd>{{ summary.customer || '-' }}</dd>
                  </div>
                  <div class="pgd-detail-row">
                    <dt>Metode Pembayaran</dt>
                    <dd>{{ summary.paymentMethod?.label || '-' }}</dd>
                  </div>
                </dl>
              </section>
            </div>
          </div>
        </header>
        <footer class="pgd-dialog__footer">
          <div class="pgd-review__actions">
            <button class="pgd-button pgd-button--secondary" type="button" @click="emit('close')">
              Periksa Lagi
            </button>
            <button class="pgd-button pgd-button--primary" type="button" @click="emit('confirm')">
              Lanjutkan
            </button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>
