<script setup lang="ts">
import { inject, ref } from 'vue'
import { GAlert, GButton } from '@/components'
import ModuleSectionCard from '@/components/shared/card/ModuleSectionCard.vue'
import RahnCollateralFormModal from '@/components/modules/rahn/RahnCollateralFormModal.vue'
import { RahnCollateralTable } from '@/components/modules/rahn'
import { rahnFlowKey, type RahnCollateral } from '../rahnFlow'

const flow = inject(rahnFlowKey)
if (!flow) throw new Error('Rahn flow context is unavailable')

const showModal = ref(false)
const editingIndex = ref<number | null>(null)
const editingCollateral = ref<RahnCollateral | null>(null)

const openAddModal = () => {
  editingIndex.value = null
  editingCollateral.value = null
  showModal.value = true
}

const openEditModal = (index: number) => {
  editingIndex.value = index
  editingCollateral.value = flow.collaterals.value[index] ?? null
  showModal.value = true
}

const saveCollateral = (collateral: RahnCollateral) => {
  if (editingIndex.value === null) flow.collaterals.value.push(collateral)
  else flow.collaterals.value.splice(editingIndex.value, 1, collateral)
}

const removeCollateral = (index: number) => {
  flow.collaterals.value.splice(index, 1)
}

</script>

<template>
  <div class="form-content rahn-collateral-content">
    <ModuleSectionCard title="Data Jaminan" class="rahn-collateral-card">
      <GAlert
        v-if="!flow.collaterals.value.length"
        class="rahn-collateral-required variant"
        label="Tambahkan minimal satu data jaminan untuk melanjutkan."
        color="light-blue"
        variant="info"
      />

      <RahnCollateralTable
        :items="flow.collaterals.value"
        @edit="openEditModal"
        @remove="removeCollateral"
      />

      <div class="rahn-collateral-add">
        <GButton label="Tambah Jaminan" type="outline" size="md" @click="openAddModal" />
      </div>
    </ModuleSectionCard>

    <RahnCollateralFormModal
      v-model="showModal"
      :rubric="flow.fields.value.rubrikMarhun"
      :is-mobile="flow.isMobile.value"
      :initial-collateral="editingCollateral"
      @save="saveCollateral"
    />
  </div>
</template>

<style scoped lang="scss">
.rahn-collateral-card {
  min-height: 640px;
  margin-bottom: 0;
  padding: 24px;

  :deep(.section-collapse__content) {
    padding-top: 16px;
  }

  @media (max-width: 767px) {
    min-height: 0;
    padding: 16px;
  }
}

.rahn-collateral-add {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;

  :deep(.btn-outline) {
    min-width: 200px;
    height: 40px;
    border-color: var(--g-kit-lime-50, #00ab4e);
    color: var(--g-kit-lime-50, #00ab4e);
  }
}

@media (max-width: 767px) {
  .rahn-collateral-card {
    border-radius: 0;
  }

  .rahn-collateral-add :deep(.btn-outline) {
    width: 100%;
  }
}
</style>
