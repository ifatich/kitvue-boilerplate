<script setup lang="ts">
import ModuleSectionCard from '@/components/shared/card/ModuleSectionCard.vue'

defineProps<{
  title: string
}>()
</script>

<template>
  <div class="form-content">
    <div class="form-card">
      <ModuleSectionCard :title="title" :collapsible="false">
        <p class="mt-2 text-muted">Tahapan sedang dalam pengembangan.</p>
      </ModuleSectionCard>
    </div>
  </div>
</template>
