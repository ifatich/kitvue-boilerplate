<script setup lang="ts">
/**
 * @file ArrumZadaLogoSquare.vue
 * @description Komponen logo square / app icon resmi Arrum Zada.
 * Menampilkan lambang resmi (Hilal, Batangan Emas 24K, dan Bintang Kejora)
 * di atas canvas squircle deep emerald dengan rim emas halus.
 * Ideal untuk favicon, app icon, avatar, dan badge.
 */
import ArrumZadaMark from './ArrumZadaMark.vue'

export interface ArrumZadaLogoSquareProps {
  /** Ukuran lebar dan tinggi dalam pixel */
  size?: number | string
}

withDefaults(defineProps<ArrumZadaLogoSquareProps>(), {
  size: 40,
})
</script>

<template>
  <div
    class="arrum-zada-logo-square-badge"
    :style="{ width: `${size}px`, height: `${size}px` }"
    role="img"
    aria-label="Logo Persegi Arrum Zada"
  >
    <!-- Background Squircle Gelap Bernuansa Emerald & Emas -->
    <div class="badge-background">
      <ArrumZadaMark :size="'72%'" class="badge-mark" />
    </div>
  </div>
</template>

<style scoped>
.arrum-zada-logo-square-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  user-select: none;
}

.badge-background {
  width: 100%;
  height: 100%;
  border-radius: 26%;
  background: radial-gradient(circle at 30% 25%, #065f46 0%, #064e3b 50%, #022c22 100%);
  border: 1px solid rgba(245, 158, 11, 0.35);
  box-shadow:
    0 2px 8px rgba(6, 78, 59, 0.25),
    inset 0 1px 1px rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.arrum-zada-logo-square-badge:hover .badge-background {
  transform: translateY(-1px);
  box-shadow:
    0 4px 14px rgba(6, 78, 59, 0.35),
    0 0 0 1px rgba(245, 158, 11, 0.5),
    inset 0 1px 1px rgba(255, 255, 255, 0.25);
}

.badge-mark {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}
</style>
