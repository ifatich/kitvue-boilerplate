<script setup lang="ts">
/**
 * @file ArrumZadaMark.vue
 * @description Icon Mark vektor murni resmi Arrum Zada.
 * Menggabungkan siluet harmonis Bulan Sabit Syariah (Hilal), Batangan Emas Murni 24K (Minted Bullion),
 * dan Bintang Kejora 8 Sudut (Rub el Hizb / Hajj Star of Guidance).
 *
 * Seluruh koordinat poligon dihitung dengan presisi matematis:
 * - Tidak ada overlap atau patahan pada bevel emas
 * - Tidak ada tabrakan antara bintang dan sudut batangan emas
 * - Lengkung hilal membungkus secara aerodinamis dan bersih
 */
export interface ArrumZadaMarkProps {
  /** Ukuran lebar dan tinggi dalam pixel */
  size?: number | string
}

withDefaults(defineProps<ArrumZadaMarkProps>(), {
  size: 40,
})
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    fill="none"
    :width="size"
    :height="size"
    class="arrum-zada-mark"
    role="img"
    aria-label="Lambang Resmi Arrum Zada"
  >
    <defs>
      <!-- Gradient 1: Bulan Sabit Emerald Syariah (Hilal) -->
      <linearGradient id="az-crescent-lux" x1="6" y1="8" x2="44" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#34D399" />
        <stop offset="25%" stop-color="#10B981" />
        <stop offset="65%" stop-color="#047857" />
        <stop offset="100%" stop-color="#064E3B" />
      </linearGradient>

      <!-- Gradient 2: Permukaan Muka Emas Batangan 24K (Front Face) -->
      <linearGradient id="az-ingot-face" x1="32" y1="20" x2="46" y2="45" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#FEF08A" />
        <stop offset="20%" stop-color="#FDE047" />
        <stop offset="55%" stop-color="#F59E0B" />
        <stop offset="85%" stop-color="#D97706" />
        <stop offset="100%" stop-color="#B45309" />
      </linearGradient>

      <!-- Gradient 3: Bevel Atas Kilau Cermin Emas (Mirror Gold Top Chamfer) -->
      <linearGradient id="az-ingot-top" x1="28" y1="13" x2="46" y2="20" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="35%" stop-color="#FEF9C3" />
        <stop offset="70%" stop-color="#FDE047" />
        <stop offset="100%" stop-color="#F59E0B" />
      </linearGradient>

      <!-- Gradient 4: Bevel Samping Bayangan Emas Tua (Burnished Left Edge) -->
      <linearGradient id="az-ingot-side" x1="28" y1="16" x2="32" y2="45" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#D97706" />
        <stop offset="50%" stop-color="#B45309" />
        <stop offset="100%" stop-color="#78350F" />
      </linearGradient>

      <!-- Gradient 5: Bintang Kejora 8 Sudut (Rub el Hizb) -->
      <linearGradient id="az-star-lux" x1="45" y1="4" x2="57" y2="16" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="30%" stop-color="#FEF08A" />
        <stop offset="75%" stop-color="#F59E0B" />
        <stop offset="100%" stop-color="#D97706" />
      </linearGradient>

      <!-- Filter Drop Shadow Halus -->
      <filter id="az-mark-soft-shadow" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#064E3B" flood-opacity="0.22" />
      </filter>
    </defs>

    <!-- 1. BULAN SABIT EMERALD (HILAL SYARIAH) -->
    <!-- Melengkung halus merangkul batangan emas dari bawah dan kiri -->
    <path
      d="M 42 54 C 28 58 12 52 6 38 C 0 24 6 12 18 6 C 22 4 25 4 26 5 C 23 8 18 15 17 23 C 15 34 20 44 28 48 C 33 50 38 52 42 54 Z"
      fill="url(#az-crescent-lux)"
      filter="url(#az-mark-soft-shadow)"
    />

    <!-- Aksen Garis Alur Cahaya Halus -->
    <path
      d="M 23 8 C 16 16 16 28 20 38 C 24 44 31 48 38 51"
      stroke="#6EE7B7"
      stroke-width="1.1"
      stroke-linecap="round"
      opacity="0.45"
    />

    <!-- 2. BATANGAN EMAS MURNI 24K (MINTED 24K GOLD BULLION) -->
    <!-- Dihitung dengan proyeksi 3D presisi: 3 facet sejajar sempurna -->
    <g>
      <!-- Bevel Samping Kiri (Ketebalan Batangan Emas) -->
      <polygon
        points="28,16 32,20 32,45 28,41"
        fill="url(#az-ingot-side)"
      />

      <!-- Bevel Atas (Kilau Cermin Emas) -->
      <polygon
        points="28,16 42,13 46,17 32,20"
        fill="url(#az-ingot-top)"
      />

      <!-- Permukaan Muka Emas (Front Ingot Face) -->
      <polygon
        points="32,20 46,17 46,42 32,45"
        fill="url(#az-ingot-face)"
      />

      <!-- Garis Tepi Dalam Stempel Emas (Minted Ingot Inner Frame) -->
      <polygon
        points="33.8,22 44.5,19.7 44.5,39.5 33.8,42.5"
        stroke="rgba(255, 255, 255, 0.45)"
        stroke-width="0.75"
        fill="none"
      />

      <!-- Garis Halus Ukiran Kemurnian Logam (Minted Security Grooves) -->
      <line x1="35" y1="28" x2="43" y2="26.3" stroke="#FFFFFF" stroke-width="0.8" opacity="0.85" />
      <line x1="35" y1="33" x2="43" y2="31.3" stroke="#D97706" stroke-width="0.8" opacity="0.7" />
      <line x1="35" y1="38" x2="43" y2="36.3" stroke="#78350F" stroke-width="0.8" opacity="0.6" />

      <!-- Stempel Inti Berlian Kemurnian Emas (Center Hallmark Diamond) -->
      <polygon
        points="39,23.5 40.2,24.7 39,25.9 37.8,24.7"
        fill="#FFFFFF"
        opacity="0.95"
      />

      <!-- Titik Pantulan Kilau Spekuler Sudut Depan -->
      <circle cx="32" cy="20" r="1.1" fill="#FFFFFF" opacity="0.9" />
    </g>

    <!-- 3. BINTANG KEJORA 8 SUDUT (RUB EL HIZB / STAR OF GUIDANCE) -->
    <!-- Melayang bebas di ufuk kanan atas tanpa menyentuh batangan emas -->
    <g transform="translate(51, 10)">
      <!-- 4 Sudut Utama (Vertikal & Horizontal) -->
      <path
        d="M 0 -7.2 Q 1 -1 7.2 0 Q 1 1 0 7.2 Q -1 1 -7.2 0 Q -1 -1 0 -7.2 Z"
        fill="url(#az-star-lux)"
      />
      <!-- 4 Sudut Sekunder (Diagonal 45 Derajat) -->
      <path
        d="M 0 -5 Q 0.7 -0.7 5 0 Q 0.7 0.7 0 5 Q -0.7 0.7 -5 0 Q -0.7 -0.7 0 -5 Z"
        fill="#FEF08A"
        transform="rotate(45)"
        opacity="0.9"
      />
      <!-- Titik Pusat Cahaya Putih Cemerlang -->
      <circle cx="0" cy="0" r="1.4" fill="#FFFFFF" />
    </g>
  </svg>
</template>

<style scoped>
.arrum-zada-mark {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.arrum-zada-mark:hover {
  transform: scale(1.06);
}
</style>
