<script setup lang="ts">
/**
 * @file ArrumZadaLogoPortrait.vue
 * @description Komponen logo portrait / stacked resmi Arrum Zada.
 * Menampilkan symbol mark vektor murni berukuran besar di atas,
 * diikuti tipografi utama 'ARRUM ZADA' dan kapsul badge 'RENCANA EMAS HAJI'.
 */
import ArrumZadaMark from './ArrumZadaMark.vue'

export interface ArrumZadaLogoPortraitProps {
  /** Ukuran symbol mark dalam pixel */
  markSize?: number | string
  /** Varian warna: 'dark' untuk latar terang, 'light' untuk latar gelap */
  variant?: 'dark' | 'light'
}

withDefaults(defineProps<ArrumZadaLogoPortraitProps>(), {
  markSize: 64,
  variant: 'dark',
})
</script>

<template>
  <div class="arrum-zada-portrait-brand" :class="`variant-${variant}`">
    <!-- Icon Mark Presisi Vektor Transparan -->
    <ArrumZadaMark :size="markSize" class="brand-symbol" />

    <!-- Wordmark Centered -->
    <div class="brand-title">
      <span class="word-arrum">ARRUM</span>
      <span class="word-zada">ZADA</span>
    </div>

    <!-- Capsule Tagline -->
    <div class="brand-capsule">
      <span class="capsule-text">RENCANA EMAS HAJI</span>
    </div>
  </div>
</template>

<style scoped>
.arrum-zada-portrait-brand {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  user-select: none;
  text-align: center;
}

.brand-symbol {
  margin-bottom: 2px;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.arrum-zada-portrait-brand:hover .brand-symbol {
  transform: scale(1.08);
}

.brand-title {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: var(--g-kit-font-size-zeta);
  line-height: var(--g-kit-line-height-zeta);
  font-weight: var(--g-kit-font-weight-bold);
  letter-spacing: -0.025em;
}

.brand-capsule {
  padding: 5px 14px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.capsule-text {
  font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: var(--g-kit-font-weight-bold);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

/* Varian Dark */
.variant-dark .word-arrum {
  color: #064e3b;
}

.variant-dark .word-zada {
  color: #d97706;
}

.variant-dark .brand-capsule {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.variant-dark .capsule-text {
  color: #064e3b;
}

/* Varian Light */
.variant-light .word-arrum {
  color: #ffffff;
}

.variant-light .word-zada {
  color: #fde047;
}

.variant-light .brand-capsule {
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.variant-light .capsule-text {
  color: #e2e8f0;
}
</style>
