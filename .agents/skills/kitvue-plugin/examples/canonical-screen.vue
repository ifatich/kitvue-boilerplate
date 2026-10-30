<!--
  Canonical Example Screen Component (SPRINT Single UI Standard)
  @description Template referensi implementasi modul Vue 3 dari Figma MCP yang sepenuhnya selaras
               dengan arsitektur SPRINT Single UI:
               - SprintModuleShell: Layout page, breadcrumb, navbar, sticky footer, sticky action sheet
               - MobileStepperBanner: Indikator langkah mobile
               - ModuleSectionCard: Card collabsible dengan animasi CSS grid bebas flicker
               - Kitvue form inputs: GDropdown, GInputText, GInputNominalStart, GAlert, GButton, GStepper
  @responsibility Mengelola state form bisnis, alur langkah (stepper), validasi, dan penyajian data input.
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { GAlert, GButton, GDropdown, GInputNominalStart, GInputText, GStepper } from '@/components'
import SprintModuleShell from '@/components/shared/admin-layout/SprintModuleShell.vue'
import MobileStepperBanner from '@/components/shared/stepper/MobileStepperBanner.vue'
import ModuleSectionCard from '@/components/shared/card/ModuleSectionCard.vue'

// ==========================================
// 1. Interfaces & Types
// ==========================================
export type DropdownOption = { value: string; label: string }

export interface FormSubmissionData {
  tujuanPengajuan: string
  tujuanTransaksi: string
  pekerjaanTerkini: string
  rubrikMarhun: string
  skemaTarif: string
  produk: string
  jangkaWaktu: string
  beneficialOwner: string
}

export interface FormCustomerData {
  nik: string
  nama: string
  noHp: string
  pekerjaan: string
  nominal: string
  alamat: string
  hubungan: string
}

// ==========================================
// 2. Navigation & Responsive Setup
// ==========================================
const router = useRouter()
const isMobile = useMediaQuery('(max-width: 767px)')
const activeStep = ref(1)

// Collapsible section open/close state
const isSection1Open = ref(true)
const isSection2Open = ref(true)

// ==========================================
// 3. Reactive State
// ==========================================
const fields = ref<FormSubmissionData>({
  tujuanPengajuan: 'pilihan-1',
  tujuanTransaksi: 'pilihan-1',
  pekerjaanTerkini: 'pilihan-1',
  rubrikMarhun: 'pilihan-1',
  skemaTarif: 'pilihan-1',
  produk: 'pilihan-1',
  jangkaWaktu: 'pilihan-1',
  beneficialOwner: 'pilihan-1',
})

const fieldsCustomer = ref<FormCustomerData>({
  nik: '3171012345670001',
  nama: 'Budi Santoso',
  noHp: '081298765432',
  pekerjaan: 'pilihan-1',
  nominal: '15000000',
  alamat: 'Jl. Kramat Raya No. 162, Senen, Jakarta Pusat',
  hubungan: 'pilihan-1',
})

const options: DropdownOption[] = [
  { value: 'pilihan-1', label: 'Pilihan 1' },
  { value: 'pilihan-2', label: 'Pilihan 2' },
  { value: 'pilihan-3', label: 'Pilihan 3' },
]

const steps = [
  'Data Pengajuan',
  'Data Nasabah',
  'Data Jaminan',
  'Fasilitas Pinjaman',
  'Data Review',
]

// ==========================================
// 4. Computed & Step Logic
// ==========================================
const canContinue = computed<boolean>(() => {
  if (activeStep.value === 1) {
    return Boolean(fields.value.tujuanPengajuan && fields.value.tujuanTransaksi)
  }
  if (activeStep.value === 2) {
    return Boolean(fieldsCustomer.value.nik && fieldsCustomer.value.nama)
  }
  return true
})

const nextStep = (): void => {
  if (!canContinue.value) return
  if (activeStep.value < steps.length) {
    activeStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const prevStep = (): void => {
  if (activeStep.value > 1) {
    activeStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    router.push('/')
  }
}

const handleBack = (): void => {
  prevStep()
}
</script>

<template>
  <SprintModuleShell
    title="Pengajuan Pinjaman"
    :breadcrumbs="[{ label: 'Beranda', to: '/' }, { label: 'Pengajuan' }, 'Pengajuan Pinjaman']"
    back-to="/"
    @back="handleBack"
  >
    <!-- Slot 1: Mobile Stepper Banner (Hanya Tampil di Mobile) -->
    <template #mobile-stepper>
      <MobileStepperBanner
        v-if="isMobile"
        :active-step="activeStep"
        :steps="steps"
      />
    </template>

    <!-- Slot 2: Contextual Notice / Alert -->
    <template #notice>
      <GAlert
        v-if="activeStep === 1"
        class="module-notice variant"
        label="Pastikan data yang diisi telah sesuai dengan data nasabah pemohon."
        color="light-blue"
        variant="info"
      />
      <GAlert
        v-else-if="activeStep === 2"
        class="module-notice variant"
        label="Pastikan identitas dan nomor kontak nasabah sesuai dengan dokumen KTP asli."
        color="light-blue"
        variant="info"
      />
    </template>

    <!-- Slot 3: Default Content Area -->
    <div class="application-layout">
      <!-- Desktop Stepper Navigation Sidebar -->
      <GStepper
        v-if="!isMobile"
        v-model:active-step="activeStep"
        class="module-stepper"
        label="Langkah"
        :items="steps"
        :enable-step-untill="activeStep"
      />

      <!-- STEP 1: DATA PENGAJUAN -->
      <div v-if="activeStep === 1" class="form-content">
        <div class="form-card">
          <ModuleSectionCard title="Informasi Transaksi" v-model="isSection1Open">
          <h3>Detail Produk & Pengajuan</h3>
          <div class="form-grid">
            <GDropdown
              v-model="fields.tujuanPengajuan"
              label="Tujuan Pengajuan"
              placeholder="Pilih tujuan pengajuan"
              :items="options"
              item-value="value"
              item-text="label"
              :use-bottom-sheet="isMobile"
            />
            <GDropdown
              v-model="fields.tujuanTransaksi"
              label="Tujuan Transaksi"
              placeholder="Pilih tujuan transaksi"
              :items="options"
              item-value="value"
              item-text="label"
              :use-bottom-sheet="isMobile"
            />
            <GDropdown
              v-model="fields.pekerjaanTerkini"
              label="Pekerjaan Terkini"
              placeholder="Pilih pekerjaan terkini"
              :items="options"
              item-value="value"
              item-text="label"
              :use-bottom-sheet="isMobile"
            />
            <GDropdown
              v-model="fields.rubrikMarhun"
              label="Rubrik Marhun"
              placeholder="Pilih rubrik marhun"
              :items="options"
              item-value="value"
              item-text="label"
              :use-bottom-sheet="isMobile"
            />
            <GDropdown
              v-model="fields.skemaTarif"
              label="Skema Tarif"
              placeholder="Pilih skema tarif"
              :items="options"
              item-value="value"
              item-text="label"
              :use-bottom-sheet="isMobile"
            />
            <GDropdown
              v-model="fields.produk"
              label="Produk"
              placeholder="Pilih produk"
              :items="options"
              item-value="value"
              item-text="label"
              :use-bottom-sheet="isMobile"
            />
            <GDropdown
              v-model="fields.jangkaWaktu"
              label="Jangka Waktu"
              placeholder="Pilih jangka waktu"
              :items="options"
              item-value="value"
              item-text="label"
              :use-bottom-sheet="isMobile"
            />
          </div>

          <div class="section-divider" />

          <h3>Informasi Akad Otomatis</h3>
          <div class="form-grid form-grid--akad">
            <div class="readonly-field">
              <span>Tanggal Akad</span>
              <b>Terisi otomatis</b>
            </div>
            <div class="readonly-field">
              <span>Tanggal Jatuh Tempo</span>
              <b>Terisi otomatis</b>
            </div>
            <div class="readonly-field">
              <span>Tanggal Lelang</span>
              <b>Terisi otomatis</b>
            </div>
          </div>
        </ModuleSectionCard>

          <ModuleSectionCard title="Beneficial Owner" v-model="isSection2Open">
            <div class="owner-field">
              <GDropdown
                v-model="fields.beneficialOwner"
                label="Tipe Beneficial Owner"
                placeholder="Pilih tipe beneficial owner"
                :items="options"
                item-value="value"
                item-text="label"
                :use-bottom-sheet="isMobile"
              />
            </div>
          </ModuleSectionCard>
        </div>
      </div>

      <!-- STEP 2: DATA NASABAH -->
      <div v-else-if="activeStep === 2" class="form-content">
        <div class="form-card">
          <ModuleSectionCard title="Data Nasabah" v-model="isSection1Open">
            <h3>Identitas & Kontak</h3>
            <div class="form-grid">
              <GInputText
                v-model="fieldsCustomer.nik"
                label="NIK Nasabah"
                placeholder="Masukkan 16 digit NIK"
              />
              <GInputText
                v-model="fieldsCustomer.nama"
                label="Nama Lengkap"
                placeholder="Masukkan nama sesuai KTP"
              />
              <GInputText
                v-model="fieldsCustomer.noHp"
                label="Nomor Handphone"
                placeholder="Contoh: 081234567890"
              />
              <GDropdown
                v-model="fieldsCustomer.pekerjaan"
                label="Pekerjaan"
                placeholder="Pilih pekerjaan"
                :items="options"
                item-value="value"
                item-text="label"
                :use-bottom-sheet="isMobile"
              />
              <GInputNominalStart
                v-model="fieldsCustomer.nominal"
                label="Nilai Pengajuan (UP)"
                placeholder="Masukkan nominal"
                unit="Rp"
              />
              <GInputText
                v-model="fieldsCustomer.alamat"
                label="Alamat Domisili"
                placeholder="Masukkan alamat domisili"
              />
            </div>
          </ModuleSectionCard>
        </div>
      </div>

      <!-- FALLBACK STEP -->
      <div v-else class="form-content">
        <div class="form-card">
          <ModuleSectionCard :title="steps[activeStep - 1]" :collapsible="false">
            <p class="mt-2 text-muted">Tahapan sedang dalam pengembangan.</p>
          </ModuleSectionCard>
        </div>
      </div>
    </div>

    <!-- Slot 4: Bottom Action Bar Buttons -->
    <template #actions>
      <GButton
        v-if="!isMobile || activeStep > 1"
        label="Sebelumnya"
        type="outline"
        size="md"
        @click="prevStep"
      />
      <GButton
        label="Selanjutnya"
        type="primary"
        size="md"
        :disabled="!canContinue"
        @click="nextStep"
      />
    </template>
  </SprintModuleShell>
</template>

<style lang="scss" scoped>
.module-notice {
  margin: 16px 0 12px;

  :deep(.alert) {
    margin-bottom: 0;
    border: none;
    border-radius: 8px;
    background-color: var(--g-kit-blue-10, #e8f4fd);
    color: var(--g-kit-black-80, #252528);
    background-image: url('kitvue-public/src/assets/images/alerts/aksen-blue.svg');
    background-repeat: no-repeat;
    background-position: right center;
    background-size: contain;
    font-family: 'Nunito Sans', sans-serif;
    font-size: var(--g-kit-font-size-omicron, 14px);
    line-height: var(--g-kit-line-height-omicron, 20px);
  }

  @media (max-width: 767px) {
    margin: 12px 16px;

    :deep(.alert) {
      font-size: var(--g-kit-font-size-omega, 12px);
      line-height: var(--g-kit-line-height-omega, 18px);
    }
  }
}

.application-layout {
  display: grid;
  grid-template-columns: 270px minmax(0, 1fr);
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 767px) {
    display: block;
    width: 100%;
    margin-bottom: 0;
  }
}

.module-stepper {
  height: max-content;

  @media (max-width: 767px) {
    display: none;
  }
}

.form-content {
  min-width: 0;
  display: flex;
  flex-direction: column;

  @media (max-width: 767px) {
    width: 100%;
  }
}

.form-card {
  min-width: 0;
  border: 1px solid var(--g-kit-black-20, #eeeeef);
  border-radius: 8px;
  background: var(--g-kit-white, #ffffff);
  overflow: hidden;

  :deep(.module-section-card) {
    border: none;
    border-radius: 0;
    margin-bottom: 0;

    + .module-section-card {
      border-top: 8px solid var(--g-kit-black-10, #f8f8f8);
    }
  }

  @media (max-width: 767px) {
    border: none;
    border-radius: 0;
    background: transparent;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;

    :deep(.module-section-card) {
      background: var(--g-kit-white, #ffffff);
      border: none;
      border-radius: 0;
      padding: 16px;
      margin-bottom: 0;

      + .module-section-card {
        border-top: none;
      }
    }
  }
}

h3 {
  margin: 0 0 12px;
  color: var(--g-kit-black-80, #252528);
  font-family: 'Nunito Sans', sans-serif;
  font-size: var(--g-kit-font-size-omicron, 14px);
  font-weight: var(--g-kit-font-weight-bold, 700);
  line-height: var(--g-kit-line-height-omicron, 20px);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 24px;
  margin-top: 12px;

  &--akad {
    row-gap: 16px;
  }

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.section-divider {
  height: 1px;
  margin: 16px 0;
  background: var(--g-kit-black-20, #eeeeef);
}

.readonly-field {
  display: grid;
  gap: 6px;
  font-size: var(--g-kit-font-size-sigma, 12px);

  span {
    color: var(--g-kit-black-80, #252528);
    font-weight: var(--g-kit-font-weight-bold, 700);
  }

  b {
    display: block;
    padding: 10px;
    border-radius: 6px;
    color: var(--g-kit-black-60, #58585b);
    background: var(--g-kit-black-20, #eeeeef);
    font-size: var(--g-kit-font-size-omicron, 14px);
    font-weight: var(--g-kit-font-weight-normal, 400);
  }
}

.owner-field {
  width: min(100%, 393px);

  @media (max-width: 767px) {
    width: auto;
  }
}

// Reset Kitvue input bottom margins inside custom grid
:deep(.group-input) {
  margin-bottom: 0px;
}
</style>
