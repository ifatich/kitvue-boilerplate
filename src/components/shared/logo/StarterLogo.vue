<script setup lang="ts">
/**
 * @file StarterLogo.vue
 * @description Universal branded logo for Kitvue Starter projects.
 * Rendered with scalable inline vector SVG and customizable title/subtitle.
 */
interface Props {
  variant?: 'landscape' | 'mark-only' | 'compact'
  width?: number | string
  height?: number | string
  title?: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'landscape',
  width: 'auto',
  height: 36,
  title: 'Kitvue',
  subtitle: 'Starter Template',
})
</script>

<template>
  <div class="starter-logo" :class="[`variant-${variant}`]" :style="{ height: typeof height === 'number' ? `${height}px` : height }">
    <!-- SVG Vector Emblem -->
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="logo-icon"
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="10" fill="url(#brandGrad)" />
      <!-- Stylized geometric hexagon / token mark -->
      <path
        d="M20 9L29.5 14.5V25.5L20 31L10.5 25.5V14.5L20 9Z"
        stroke="#E2B93B"
        stroke-width="2"
        stroke-linejoin="round"
      />
      <path
        d="M20 15L25 18V24L20 27L15 24V18L20 15Z"
        fill="#E2B93B"
        fill-opacity="0.85"
      />
      <circle cx="20" cy="20" r="2.5" fill="#003429" />
      <defs>
        <linearGradient id="brandGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stop-color="#003429" />
          <stop offset="1" stop-color="#006852" />
        </linearGradient>
      </defs>
    </svg>

    <!-- Typography -->
    <div v-if="variant !== 'mark-only'" class="logo-text">
      <div class="logo-title">
        <span>{{ title }}</span>
        <span class="badge-tag">UI</span>
      </div>
      <div v-if="variant === 'landscape'" class="logo-subtitle">{{ subtitle }}</div>
    </div>
  </div>
</template>

<style scoped>
.starter-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  user-select: none;
  text-decoration: none;
}

.logo-icon {
  height: 100%;
  width: auto;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 52, 41, 0.15);
  flex-shrink: 0;
}

.logo-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.1;
}

.logo-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1.125rem;
  font-weight: 800;
  color: #003429;
  letter-spacing: -0.02em;
}

.badge-tag {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 4px;
  background-color: #e2b93b;
  color: #003429;
  letter-spacing: 0.04em;
}

.logo-subtitle {
  font-size: 0.72rem;
  font-weight: 600;
  color: #64748b;
  letter-spacing: 0.02em;
}
</style>
