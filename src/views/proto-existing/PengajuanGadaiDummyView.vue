<script setup lang="ts">
import { computed, reactive } from 'vue'
import DropdownComponent from 'kitvue-public/src/components/Dropdown/InputDropdown.vue'
import InputTextComponent from 'kitvue-public/src/components/Input/InputText.vue'
import StepperComponent from 'kitvue-public/src/components/Stepper/Stepper.vue'
import Breadcrumb from '../../components/shared/breadcrumb/Breadcrumb.vue'
import ModuleSectionCard from '../../components/shared/card/ModuleSectionCard.vue'
import arrowLeftGreen from 'kitvue-public/src/assets/images/arrow-left-green.svg'

const props = withDefaults(defineProps<{
  variant?: 'kasir' | 'launcher' | 'existing'
}>(), {
  variant: 'kasir',
})
const homePath = computed(() => {
  if (props.variant === 'launcher') return '/sprint-proto-2'
  if (props.variant === 'existing') return '/sprint-existing'
  return '/sprint-proto-1'
})

interface DropdownOption {
  label: string
  value: string
}

const makeOptions = (labels: string[]): DropdownOption[] => (
  labels.map((label) => ({ label, value: label }))
)

const purposeOptions = makeOptions(['Produktif', 'Konsumtif'])
const transactionOptions = makeOptions([
  'Usaha / Modal Kerja',
  'Investasi',
  'Pembelian Kendaraan',
  'Biaya Pendidikan',
])
const employmentOptions = makeOptions(['Wirausaha/Pedagang', 'Karyawan Swasta', 'Pensiunan'])
const rubricOptions = makeOptions(['Kendaraan', 'Barang Elektronik', 'Barang Kantong'])
const tariffOptions = makeOptions(['Sewa Modal Harian', 'Sewa Modal Harian Per 10 Hari'])
const productOptions = makeOptions(['Gadai KCA'])
const durationOptions = makeOptions(['120 Hari'])
const ownerOptions = makeOptions(['Diri sendiri', 'Beneficial Owner'])
const steps = ['Data Pengajuan', 'Data Nasabah', 'Data Jaminan', 'Fasilitas Pinjaman', 'Data Review']

const fields = reactive({
  purpose: '',
  transaction: '',
  employment: '',
  rubric: '',
  tariff: '',
  product: '',
  duration: '',
  beneficialOwner: 'Diri sendiri',
})
</script>

<template>
  <div class="pengajuan-gadai-page" :class="{ 'pengajuan-gadai-page--launcher': variant === 'launcher' }">
    <main class="pengajuan-gadai-content">
      <Breadcrumb
        class="pengajuan-gadai-breadcrumb"
        :items="[{ label: 'Beranda', to: homePath }, 'Pengajuan Gadai']"
      />

      <section class="section-bg-top">
        <div class="section-bg-top__back">
          <button class="back-button" type="button" aria-label="Back" @click="$router.back()">
            <img width="24" height="24" :src="arrowLeftGreen as unknown as string" alt="" aria-hidden="true" />
          </button>
          <h4 v-bind="$attrs" class="text-black-80">Pengajuan Gadai</h4>
        </div>
      </section>
      <p class="pengajuan-gadai-mobile-step">Langkah 1 dari 5 · Data Pengajuan</p>

      <div class="pengajuan-gadai-layout">
        <StepperComponent
          class="pengajuan-gadai-stepper"
          label="Langkah"
          :items="steps"
          :active-step="1"
          :enable-step-untill="1"
        />

        <div class="pengajuan-gadai-form-card">
          <ModuleSectionCard title="Informasi Gadai" default-open>
            <div class="pengajuan-gadai-form-content">
              <div class="pengajuan-gadai-transaction">
                <h3 class="pengajuan-gadai-subtitle">Transaksi dan Produk</h3>
                <div class="pengajuan-gadai-fields">
                  <DropdownComponent
                    v-model="fields.purpose"
                    label="Tujuan Pengajuan"
                    placeholder="Pilih tujuan pengajuan"
                    :items="purposeOptions"
                    item-value="value"
                    item-text="label"
                    class="pengajuan-gadai-field"
                  />
                  <DropdownComponent
                    v-model="fields.transaction"
                    label="Tujuan Transaksi"
                    placeholder="Pilih tujuan transaksi"
                    :items="transactionOptions"
                    item-value="value"
                    item-text="label"
                    class="pengajuan-gadai-field"
                  />
                  <DropdownComponent
                    v-model="fields.employment"
                    label="Pekerjaan Terkini"
                    placeholder="Pilih pekerjaan terkini"
                    :items="employmentOptions"
                    item-value="value"
                    item-text="label"
                    class="pengajuan-gadai-field"
                  />
                  <DropdownComponent
                    v-model="fields.rubric"
                    label="Rubrik"
                    placeholder="Pilih rubrik"
                    :items="rubricOptions"
                    item-value="value"
                    item-text="label"
                    class="pengajuan-gadai-field"
                  />
                  <DropdownComponent
                    v-model="fields.tariff"
                    label="Skema Tarif"
                    placeholder="Pilih skema tarif"
                    :items="tariffOptions"
                    item-value="value"
                    item-text="label"
                    class="pengajuan-gadai-field"
                  />
                  <DropdownComponent
                    v-model="fields.product"
                    label="Produk"
                    placeholder="Pilih produk"
                    :items="productOptions"
                    item-value="value"
                    item-text="label"
                    class="pengajuan-gadai-field"
                  />
                  <DropdownComponent
                    v-model="fields.duration"
                    label="Jangka Waktu"
                    placeholder="Pilih jangka waktu"
                    :items="durationOptions"
                    item-value="value"
                    item-text="label"
                    class="pengajuan-gadai-field"
                  />
                </div>
              </div>

              <div class="pengajuan-gadai-credit">
                <h3 class="pengajuan-gadai-subtitle">Informasi Kredit</h3>
                <div class="pengajuan-gadai-fields">
                  <InputTextComponent
                    model-value="Terisi otomatis"
                    label="Tanggal Kredit"
                    disabled
                    class="pengajuan-gadai-field pengajuan-gadai-field--disabled"
                  />
                  <InputTextComponent
                    model-value="Terisi otomatis"
                    label="Tanggal Jatuh Tempo"
                    disabled
                    class="pengajuan-gadai-field pengajuan-gadai-field--disabled"
                  />
                  <InputTextComponent
                    model-value="Terisi otomatis"
                    label="Tanggal Lelang"
                    disabled
                    class="pengajuan-gadai-field pengajuan-gadai-field--disabled"
                  />
                </div>
              </div>
            </div>
          </ModuleSectionCard>

          <ModuleSectionCard title="Beneficial Owner" default-open>
            <div class="pengajuan-gadai-owner-field">
              <DropdownComponent
                v-model="fields.beneficialOwner"
                label="Tipe Beneficial Owner"
                :items="ownerOptions"
                item-value="value"
                item-text="label"
                class="pengajuan-gadai-field"
              />
            </div>
          </ModuleSectionCard>
        </div>
      </div>
    </main>

  </div>
</template>

<style lang="scss" scoped>
.section-bg-top {
  width: 100%;
  min-width: 0;
  background: transparent;
  padding: 16px 0;
  box-sizing: border-box;
}

.section-bg-top__back {
  min-height: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  min-width: 0;

  h4 {
    font-size: var(--g-kit-font-size-kappa);
    font-weight: var(--g-kit-font-weight-bold);
    line-height: var(--g-kit-line-height-kappa);
  }
}

.back-button {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}


.pengajuan-gadai-page {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
  background: white;
  color: var(--g-kit-black-80, #252528);
  font-family: var(--g-kit-font-family, 'Nunito Sans', sans-serif);
}

.pengajuan-gadai-content {
  box-sizing: border-box;
  width: min(100%, 1312px);
  flex: 1 0 auto;
  margin: 0 auto;
  // padding: 16px 24px 24px;
}

.pengajuan-gadai-page--launcher .pengajuan-gadai-content {
  padding-top: 32px;
}

.pengajuan-gadai-breadcrumb {
  height: auto;
  margin-bottom: 16px;
  padding-bottom: 16px;
  margin-top: 16px;
  border-bottom: 1px solid var(--g-kit-black-20, #eeeeef);
}

.pengajuan-gadai-page .pengajuan-gadai-breadcrumb :deep(.breadcrumb) {
  gap: 8px;
  font-size: var(--g-kit-font-size-omega, 12px);
  line-height: var(--g-kit-line-height-omega, 16px);
}

.pengajuan-gadai-page .pengajuan-gadai-breadcrumb :deep(.breadcrumb-item) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--g-kit-black-80);
  font-size: var(--g-kit-font-size-sigma);
  font-weight: var(--g-kit-font-weight-normal);
  line-height: var(--g-kit-line-height-sigma);
}

.pengajuan-gadai-page .pengajuan-gadai-breadcrumb :deep(.breadcrumb-item a) {
  color: var(--g-kit-lime-50);
  font-size: var(--g-kit-font-size-sigma);
  font-weight: var(--g-kit-font-weight-normal);
  line-height: var(--g-kit-line-height-sigma);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.pengajuan-gadai-page .pengajuan-gadai-breadcrumb :deep(.breadcrumb-item a:hover) {
  color: var(--g-kit-lime-50, #00ab4e);
  text-decoration: underline;
}

.pengajuan-gadai-title {
  margin: 0 0 24px;
  font-size: 20px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 30px;
}

.pengajuan-gadai-mobile-step {
  display: none;
}

.pengajuan-gadai-layout {
  display: grid;
  grid-template-columns: 259px minmax(0, 1fr);
  align-items: start;
  gap: 16px;
}

.pengajuan-gadai-stepper {
  width: 259px;
  max-width: 259px;
  height: max-content;
}

:deep(.card.stepper.pengajuan-gadai-stepper) {
  background: var(--g-kit-black-10, #f8f8f8);
}

.pengajuan-gadai-page--launcher :deep(.card.stepper.pengajuan-gadai-stepper) {
  border: 1px solid var(--g-kit-black-20, #eeeeef);
  border-radius: 8px;
  background: var(--g-kit-white, #ffffff);
  box-shadow: var(--g-kit-shadow-card, 0 2px 3px rgba(0, 0, 0, 0.14), 0 0 1px rgba(0, 0, 0, 0.08));
}

:deep(.card.stepper.pengajuan-gadai-stepper .card-body) {
  padding: 24px;
}

:deep(.card.stepper.pengajuan-gadai-stepper .label-stepper) {
  display: block;
  margin-bottom: 32px;
  color: var(--g-kit-black-80, #252528);
  font-size: 20px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 30px;
}

:deep(.card.stepper.pengajuan-gadai-stepper .card-body ol.stepper-list) {
  margin-bottom: 0;
  padding-left: 34px;
}

:deep(.card.stepper.pengajuan-gadai-stepper .card-body ol.stepper-list li) {
  margin-bottom: 24px;
  color: var(--g-kit-black-80, #252528);
  font-size: 16px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 24px;
}

:deep(.card.stepper.pengajuan-gadai-stepper .card-body ol.stepper-list li:last-child) {
  margin-bottom: 0;
}

:deep(.card.stepper.pengajuan-gadai-stepper .card-body ol.stepper-list li::before) {
  left: -34px;
  background: var(--g-kit-black-20, #eeeeef);
  color: var(--g-kit-black-40, #bbbdc0);
}

:deep(.card.stepper.pengajuan-gadai-stepper .card-body ol.stepper-list li:has(a.active)::before) {
  background: var(--g-kit-lime-50, #00ab4e);
  color: var(--g-kit-white, #ffffff);
}

:deep(.card.stepper.pengajuan-gadai-stepper .card-body ol.stepper-list a.active.recent) {
  color: var(--g-kit-black-80, #252528);
}

:deep(.card.stepper.pengajuan-gadai-stepper .card-body ol.stepper-list li span) {
  color: var(--g-kit-black-50, #939597);
}

.pengajuan-gadai-form-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--g-kit-black-20, #eeeeef);
  border-radius: 8px;
  background: var(--g-kit-white, #ffffff);
  box-shadow: var(--g-kit-shadow-card, 0 2px 3px rgba(0, 0, 0, 0.14), 0 0 1px rgba(0, 0, 0, 0.08));
}

.pengajuan-gadai-form-card :deep(.module-section-card) {
  margin: 0;
  border: 0;
  border-radius: 0;
  padding: 24px;
}

.pengajuan-gadai-form-card :deep(.module-section-card + .module-section-card) {
  border-top: 8px solid var(--g-kit-black-10, #f8f8f8);
  padding-top: 16px;
}

.pengajuan-gadai-form-card :deep(.module-section-card__title) {
  font-size: 20px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 30px;
}

.pengajuan-gadai-form-card :deep(.section-collapse__content) {
  padding-top: 16px;
}

.pengajuan-gadai-form-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.pengajuan-gadai-transaction,
.pengajuan-gadai-credit {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pengajuan-gadai-subtitle {
  margin: 0;
  color: var(--g-kit-black-80, #252528);
  font-size: 16px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 24px;
}

.pengajuan-gadai-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 24px;
  row-gap: 24px;
}

.pengajuan-gadai-field {
  min-width: 0;
  width: 100%;
  margin-bottom: 0;
}

.pengajuan-gadai-field :deep(.form-label) {
  display: block;
  margin: 0 0 4px;
  color: var(--g-kit-black-80, #252528);
  font-size: 14px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 20px;
}

.pengajuan-gadai-field :deep(.btn-group),
.pengajuan-gadai-field :deep(.input-group) {
  display: flex;
  width: 100%;
  min-width: 0;
}

.pengajuan-gadai-field :deep(.gkit-dd) {
  display: flex !important;
  width: 100%;
  min-width: 0;
  height: 48px;
  min-height: 48px;
  align-items: center;
  justify-content: space-between;
  text-align: left;
}

.pengajuan-gadai-field :deep(button.gkit-dd) {
  box-sizing: border-box;
  border: 1px solid var(--g-kit-black-20, #eeeeef);
  border-radius: 6px;
  background-color: var(--g-kit-white, #ffffff);
  color: var(--g-kit-black-80, #252528);
  font-family: inherit;
}

.pengajuan-gadai-field :deep(.dropdown-placeholder) {
  min-width: 0;
  margin: 0;
  font-size: 16px;
  font-weight: var(--g-kit-font-weight-normal, 600);
  line-height: 24px;
  text-align: left;
}

.pengajuan-gadai-field :deep(.form-control) {
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 46px;
  padding: 11px 12px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  font-size: 16px;
  font-weight: var(--g-kit-font-weight-normal, 600);
  line-height: 24px;
  box-shadow: none;
}

.pengajuan-gadai-credit {
  padding-top: 24px;
  border-top: 1px solid var(--g-kit-black-20, #eeeeef);
}

.pengajuan-gadai-field--disabled :deep(.input-group) {
  border: 1px solid var(--g-kit-black-20, #eeeeef);
  border-radius: 6px;
  background: var(--g-kit-black-20, #eeeeef);
}

.pengajuan-gadai-credit :deep(.form-control:disabled) {
  background: var(--g-kit-black-20, #eeeeef);
  color: var(--g-kit-black-60, #58585b);
  opacity: 1;
}

.pengajuan-gadai-owner-field {
  max-width: 50%;
}

@media (max-width: 900px) {
  .pengajuan-gadai-layout {
    grid-template-columns: 220px minmax(0, 1fr);
    gap: 16px;
  }

  .pengajuan-gadai-stepper {
    width: 220px;
    max-width: 220px;
  }

}

@media (max-width: 767px) {
  .pengajuan-gadai-content {
    padding: 12px 0 24px;
  }

  .pengajuan-gadai-title {
    margin-right: 16px;
    margin-left: 16px;
  }

  .pengajuan-gadai-breadcrumb {
    margin-right: 16px;
    margin-left: 16px;
  }

  .pengajuan-gadai-title {
    margin-bottom: 8px;
  }

  .pengajuan-gadai-mobile-step {
    display: block;
    margin: 0 0 12px;
    padding: 8px 16px;
    background: var(--g-kit-black-10, #f8f8f8);
    color: var(--g-kit-black-60, #58585b);
    font-size: 14px;
    font-weight: var(--g-kit-font-weight-normal, 600);
    line-height: 20px;
  }

  .pengajuan-gadai-stepper {
    display: none;
  }

  .pengajuan-gadai-layout {
    display: block;
  }

  .pengajuan-gadai-form-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: visible;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }

  .pengajuan-gadai-form-card :deep(.module-section-card),
  .pengajuan-gadai-form-card :deep(.module-section-card + .module-section-card) {
    width: 100%;
    border: 0;
    border-radius: 0;
    padding: 16px;
    background: var(--g-kit-white, #ffffff);
  }

  .pengajuan-gadai-form-card :deep(.module-section-card + .module-section-card) {
    padding-top: 16px;
  }

  .pengajuan-gadai-fields {
    grid-template-columns: minmax(0, 1fr);
  }

  .pengajuan-gadai-owner-field {
    max-width: none;
  }

}
</style>
