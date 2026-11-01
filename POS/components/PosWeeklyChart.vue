<script setup lang="ts">
import gridAsset from '../assets/figma/chart-grid.svg'

const bars = [
  { label: '19 Okt', height: 71 },
  { label: '20 Okt', height: 75 },
  { label: '21 Okt', height: 88 },
  { label: '22 Okt', height: 108 },
  { label: '23 Okt', height: 75 },
  { label: '24 Okt', height: 75 },
  { label: '25 Okt', height: 75 },
]
</script>

<template>
  <section class="pos-weekly-card" aria-labelledby="pos-weekly-title">
    <h2 id="pos-weekly-title">Pendapatan 1 Minggu Terakhir</h2>
    <div class="pos-weekly-card__highlight">
      <span>Sen, 19 Okt 2026</span>
      <strong>Rp25.000.000</strong>
    </div>
    <div class="pos-weekly-card__chart" role="img" aria-label="Grafik pendapatan tujuh hari terakhir">
      <div class="pos-weekly-card__plot">
        <img class="pos-weekly-card__grid" :src="gridAsset" alt="" width="424" height="127" />
        <div class="pos-weekly-card__bars">
          <div
            v-for="(bar, index) in bars"
            :key="bar.label"
            class="pos-weekly-card__bar-slot"
            :aria-label="`${bar.label}: ${bar.height}`"
          >
            <span
              class="pos-weekly-card__bar"
              :class="{ 'pos-weekly-card__bar--first': index === 0 }"
              :style="{ height: `${bar.height}px` }"
            />
          </div>
        </div>
      </div>
      <div class="pos-weekly-card__labels">
        <span v-for="bar in bars" :key="bar.label">{{ bar.label }}</span>
      </div>
    </div>
  </section>
</template>
