<script setup lang="ts">
import { ref } from 'vue'
import activityIcon from '../assets/figma/activity.svg'
import chevronDownIcon from '../assets/figma/chevron-down.svg'
import menuIcon from '../assets/figma/menu.svg'
import sprintMark from '../assets/figma/sprint-mark.svg'
import sprintWordmark from '../assets/figma/sprint-wordmark.svg'

withDefaults(defineProps<{
  menuExpanded?: boolean
}>(), {
  menuExpanded: true,
})

const emit = defineEmits<{
  activity: []
  menu: []
}>()

const profileOpen = ref(false)
</script>

<template>
  <header class="pos-header">
    <div class="pos-header__brand">
      <button
        class="pos-icon-button pos-header__menu"
        type="button"
        :aria-label="menuExpanded ? 'Ciutkan navigasi' : 'Buka navigasi'"
        aria-controls="pos-sidebar"
        :aria-expanded="menuExpanded"
        @click="emit('menu')"
      >
        <img :src="menuIcon" alt="" width="24" height="24" />
      </button>
      <a class="pos-brand" href="#" aria-label="SPRINT">
        <img :src="sprintMark" alt="" width="24.3573" height="33.9288" />
        <img :src="sprintWordmark" alt="SPRINT" width="77.0539" height="15.1056" />
      </a>
    </div>

    <div class="pos-header__account">
      <button
        class="pos-header__activity"
        type="button"
        aria-label="Lihat aktivitas"
        @click="emit('activity')"
      >
        <img :src="activityIcon" alt="" width="18.0003" height="16.5315" />
      </button>
      <div class="pos-header__divider" aria-hidden="true" />
      <div class="pos-profile">
        <button
          class="pos-profile__trigger"
          type="button"
          :aria-expanded="profileOpen"
          aria-haspopup="true"
          @click="profileOpen = !profileOpen"
        >
          <span class="pos-profile__copy">
            <span class="pos-profile__name">Thoriq Shadad</span>
            <span class="pos-profile__branch">P91234 - CP Salemba</span>
          </span>
          <img :src="chevronDownIcon" alt="" width="11.3333" height="6.5286" />
        </button>
        <div v-if="profileOpen" class="pos-profile__menu" role="menu">
          <span class="pos-profile__menu-name">Thoriq Shadad</span>
          <span class="pos-profile__menu-branch">P91234 - CP Salemba</span>
          <button type="button" role="menuitem" @click="profileOpen = false">Tutup</button>
        </div>
      </div>
    </div>
  </header>
</template>
