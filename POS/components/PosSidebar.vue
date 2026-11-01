<script setup lang="ts">
import dashboardIcon from '../assets/figma/sidebar-dashboard.svg'
import dashboardInactiveIcon from '../assets/figma/sidebar-dashboard-inactive.svg'
import paymentIcon from '../assets/figma/sidebar-payment.svg'
import goldIcon from '../assets/figma/sidebar-gold.svg'
import pawnIcon from '../assets/figma/sidebar-pawn.svg'
import financeIcon from '../assets/figma/sidebar-finance.svg'
import customersIcon from '../assets/figma/sidebar-customers.svg'

export type PosNavLabel = 'Dashboard' | 'Pembayaran' | 'Emas' | 'Gadai' | 'Pembiayaan' | 'Data Nasabah'

const props = defineProps<{
  activeItem: PosNavLabel
  collapsed: boolean
  open: boolean
  isMobile: boolean
}>()

const emit = defineEmits<{
  select: [item: PosNavLabel]
  close: []
}>()

const items: Array<{
  label: PosNavLabel
  icon: string
  activeIcon?: string
  width: number
  height: number
}> = [
  {
    label: 'Dashboard',
    icon: dashboardInactiveIcon,
    activeIcon: dashboardIcon,
    width: 19,
    height: 20,
  },
  { label: 'Pembayaran', icon: paymentIcon, width: 18.2499, height: 15.6 },
  { label: 'Emas', icon: goldIcon, width: 18, height: 13.7561 },
  { label: 'Gadai', icon: pawnIcon, width: 19.3404, height: 14.6602 },
  { label: 'Pembiayaan', icon: financeIcon, width: 19.2343, height: 13.2 },
  { label: 'Data Nasabah', icon: customersIcon, width: 24, height: 24 },
]
</script>

<template>
  <button
    v-if="props.isMobile && props.open"
    class="pos-sidebar-backdrop"
    type="button"
    aria-label="Tutup navigasi"
    @click="emit('close')"
  />
  <aside
    id="pos-sidebar"
    class="pos-sidebar"
    :class="{ 'pos-sidebar--collapsed': props.collapsed }"
    aria-label="Navigasi POS"
    :aria-hidden="props.isMobile && !props.open"
    :inert="props.isMobile && !props.open"
  >
    <nav class="pos-sidebar__nav">
      <button
        v-for="item in items"
        :key="item.label"
        class="pos-sidebar__item"
        :class="{ 'pos-sidebar__item--active': props.activeItem === item.label }"
        type="button"
        :title="props.collapsed ? item.label : undefined"
        :aria-current="props.activeItem === item.label ? 'page' : undefined"
        @click="emit('select', item.label)"
      >
        <span class="pos-sidebar__icon">
          <img
            :src="props.activeItem === item.label && item.activeIcon ? item.activeIcon : item.icon"
            alt=""
            :width="item.width"
            :height="item.height"
          />
        </span>
        <span class="pos-sidebar__label">{{ item.label }}</span>
      </button>
    </nav>
  </aside>
</template>
