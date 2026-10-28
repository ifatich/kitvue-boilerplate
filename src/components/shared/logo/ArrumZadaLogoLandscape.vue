<script setup lang="ts">
/**
 * @file ArrumZadaLogoLandscape.vue
 * @description Komponen logo landscape resmi Arrum Zada.
 * Menggabungkan icon mark vektor murni (Hilal, Emas Batangan 24K, Bintang Kejora)
 * dengan tipografi modern berpresisi tinggi.
 *
 * Mendukung varian 'dark' (default untuk latar terang seperti navbar) dan 'light' (untuk latar gelap).
 */
import ArrumZadaMark from './ArrumZadaMark.vue'

export interface ArrumZadaLogoLandscapeProps {
  /** Ukuran symbol mark dalam pixel */
  markSize?: number | string
  /** Varian warna tipografi: 'dark' (latar terang) atau 'light' (latar gelap) */
  variant?: 'dark' | 'light'
  /** Tampilkan sub-teks 'RENCANA EMAS HAJI' */
  showTagline?: boolean
}

withDefaults(defineProps<ArrumZadaLogoLandscapeProps>(), {
  markSize: 38,
  variant: 'dark',
  showTagline: true,
})
</script>

<template>
  <div class="arrum-zada-landscape-brand" :class="`variant-${variant}`">
    <!-- Icon Mark Presisi Vektor Transparan -->
    <ArrumZadaMark :size="markSize" class="brand-symbol" />

    <!-- Wordmark Tipografi Korporat Modern -->
    <div class="brand-wordmark">
      <div class="brand-title">
        <span class="word-arrum">ARRUM</span>
        <span class="word-zada">ZADA</span>
      </div>
      <span v-if="showTagline" class="brand-sub">RENCANA EMAS HAJI</span>
    </div>
  </div>
</template>

<style scoped>
.arrum-zada-landscape-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  user-select: none;
  line-height: 1;
}

.brand-symbol {
  flex-shrink: 0;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.arrum-zada-landscape-brand:hover .brand-symbol {
  transform: scale(1.06);
}

.brand-wordmark {
  display: flex;
  flex-direction: column;
  gap: 3px;
  justify-content: center;
}

.brand-title {
  display: flex;
  align-items: baseline;
  gap: 5px;
  font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: var(--g-kit-font-size-kappa);
  line-height: var(--g-kit-line-height-kappa);
  font-weight: var(--g-kit-font-weight-bold);
  letter-spacing: -0.025em;
}

.word-arrum {
  transition: color 0.2s ease;
}

.word-zada {
  transition: color 0.2s ease;
}

.brand-sub {
  font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: var(--g-kit-font-weight-bold);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

/* Varian Dark (Untuk Latar Belakang Terang / Navbar Putih) */
.variant-dark .word-arrum {
  color: #064e3b; /* Deep Executive Emerald */
}

.variant-dark .word-zada {
  color: #d97706; /* Rich 24K Gold Accent */
}

.variant-dark .brand-sub {
  color: #64748b;
}

/* Varian Light (Untuk Latar Belakang Gelap / Hero Green Banner) */
.variant-light .word-arrum {
  color: #ffffff;
}

.variant-light .word-zada {
  color: #fde047;
}

.variant-light .brand-sub {
  color: #cbd5e1;
  opacity: 0.9;
}

@media (max-width: 640px) {
  .arrum-zada-landscape-brand {
    gap: 8px;
  }

  .brand-title {
    font-size: var(--g-kit-font-size-omicron);
    line-height: var(--g-kit-line-height-omicron);
  }

  .brand-sub {
    display: none;
  }
}
</style>
