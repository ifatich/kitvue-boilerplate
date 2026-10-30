<script setup lang="ts">
/**
 * @file PengajuanRahnView.vue
 * @description SPRINT Module View for Pengajuan Pinjaman Rahn.
 * Responsible strictly for business logic, form state, and step data.
 * Page layout and generic interactive containers are delegated to reusable components:
 * - SprintModuleShell: universal navbar, breadcrumb, sticky footer, sticky bottom action sheet
 * - MobileStepperBanner: mobile step progression indicator
 * - ModuleSectionCard: collapsible, accessible card container with zero-flicker CSS grid animation
 * - RahnReadonlyInfoGrid: domain module component for displaying readonly akad/verification data
 */
import { computed, ref } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { GAlert, GButton, GDropdown, GInputNominalStart, GInputText, GStepper } from '@/components'
import SprintModuleShell from '@/components/shared/admin-layout/SprintModuleShell.vue'
import MobileStepperBanner from '@/components/shared/stepper/MobileStepperBanner.vue'
import ModuleSectionCard from '@/components/shared/card/ModuleSectionCard.vue'
import { RahnReadonlyInfoGrid, type ReadonlyInfoItem } from '@/components/modules/rahn'

type Option = { value: string; label: string }

const router = useRouter()
const isMobile = useMediaQuery('(max-width: 767px)')
const activeStep = ref(1)

// Step 1 collapsible sections
const isInformasiRahnOpen = ref(true)
const isBeneficialOwnerOpen = ref(true)

// Step 2 collapsible sections
const isInformasiRahinOpen = ref(true)
const isHubunganOpen = ref(true)

const fields = ref({
  tujuanPengajuan: 'pilihan-1',
  tujuanTransaksi: 'pilihan-1',
  pekerjaanTerkini: 'pilihan-1',
  rubrikMarhun: 'pilihan-1',
  skemaTarif: 'pilihan-1',
  produk: 'pilihan-1',
  jangkaWaktu: 'pilihan-1',
  beneficialOwner: 'pilihan-1',
})

const fieldsRahin = ref({
  nik: '3171012345670001',
  nama: 'Budi Santoso',
  noHp: '081298765432',
  pekerjaan: 'pilihan-1',
  nominal: '15000000',
  alamat: 'Jl. Kramat Raya No. 162, Senen, Jakarta Pusat',
  hubungan: 'pilihan-1',
})

const options: Option[] = [
  { value: 'pilihan-1', label: 'Pilihan 1' },
  { value: 'pilihan-2', label: 'Pilihan 2' },
  { value: 'pilihan-3', label: 'Pilihan 3' },
]

const steps = [
  'Data Pengajuan',
  'Data Rahin',
  'Data Jaminan',
  'Fasilitas Pinjaman',
  'Data Review',
]

// Step 1 Readonly Data: Informasi Akad
const akadItems: ReadonlyInfoItem[] = [
  { label: 'Tanggal Akad', value: 'Terisi otomatis' },
  { label: 'Tanggal Jatuh Tempo', value: 'Terisi otomatis' },
  { label: 'Tanggal Lelang', value: 'Terisi otomatis' },
]

// Step 2 Readonly Data: Verifikasi & Data Dukung
const verifikasiItems: ReadonlyInfoItem[] = [
  { label: 'Nomor CIF', value: 'CIF-990214' },
  { label: 'Status Dukcapil', value: 'Terverifikasi (KTP Aktif)' },
  { label: 'Kolektibilitas SLIK', value: 'Lancar (Kolektibilitas 1)' },
]

const canContinue = computed(() => {
  if (activeStep.value === 1) {
    return Boolean(fields.value.tujuanPengajuan && fields.value.tujuanTransaksi)
  }
  if (activeStep.value === 2) {
    return Boolean(fieldsRahin.value.nik && fieldsRahin.value.nama)
  }
  return true
})

const nextStep = () => {
  if (!canContinue.value) return
  if (activeStep.value < steps.length) {
    activeStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const prevStep = () => {
  if (activeStep.value > 1) {
    activeStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    router.push('/')
  }
}

const handleModuleBack = () => {
  prevStep()
}
</script>

<template>
  <SprintModuleShell
    title="Pengajuan Rahn"
    :breadcrumbs="[{ label: 'Beranda', to: '/' }, { label: 'Pengajuan' }, 'Pengajuan Rahn']"
    back-to="/"
    profile-role="Penaksir"
    :show-auth-toggle="false"
    @back="handleModuleBack"
  >
    <template #mobile-stepper>
      <MobileStepperBanner
        :active-step="activeStep"
        :steps="steps"
      />
    </template>

    <template #notice>
      <GAlert
        v-if="activeStep === 1"
        class="rahn-notice variant"
        label="Pastikan data yang diisi telah sesuai dengan data Rahin."
        color="light-blue"
        variant="info"
      />
      <GAlert
        v-else-if="activeStep === 2"
        class="rahn-notice variant"
        label="Pastikan data identitas dan kontak Rahin sesuai dengan KTP."
        color="light-blue"
        variant="info"
      />
    </template>

    <div class="application-layout">
      <GStepper
        v-if="!isMobile"
        v-model:active-step="activeStep"
        class="rahn-stepper"
        label="Langkah"
        :items="steps"
        :enable-step-untill="activeStep"
      />

      <!-- STEP 1: DATA PENGAJUAN -->
      <div v-if="activeStep === 1" class="form-content">
        <div class="form-card">
          <ModuleSectionCard title="Informasi Rahn" v-model="isInformasiRahnOpen">
            <h3>Transaksi dan Produk</h3>
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

            <RahnReadonlyInfoGrid
              title="Informasi Akad"
              :items="akadItems"
            />
          </ModuleSectionCard>

          <ModuleSectionCard title="Beneficial Owner" v-model="isBeneficialOwnerOpen">
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

      <!-- STEP 2: DATA RAHIN -->
      <div v-else-if="activeStep === 2" class="form-content">
        <div class="form-card">
          <ModuleSectionCard title="Data Rahin" v-model="isInformasiRahinOpen">
            <h3>Identitas & Kontak</h3>
            <div class="form-grid">
              <GInputText
                v-model="fieldsRahin.nik"
                label="NIK Rahin"
                placeholder="Masukkan 16 digit NIK"
              />
              <GInputText
                v-model="fieldsRahin.nama"
                label="Nama Lengkap Rahin"
                placeholder="Masukkan nama sesuai KTP"
              />
              <GInputText
                v-model="fieldsRahin.noHp"
                label="Nomor Handphone"
                placeholder="Contoh: 081234567890"
              />
              <GDropdown
                v-model="fieldsRahin.pekerjaan"
                label="Pekerjaan Rahin"
                placeholder="Pilih pekerjaan"
                :items="options"
                item-value="value"
                item-text="label"
                :use-bottom-sheet="isMobile"
              />
              <GInputNominalStart
                v-model="fieldsRahin.nominal"
                label="Nilai Pinjaman (UP)"
                placeholder="Masukkan nominal"
                unit="Rp"
              />
              <GInputText
                v-model="fieldsRahin.alamat"
                label="Alamat Domisili"
                placeholder="Masukkan alamat domisili"
              />
            </div>

            <div class="section-divider" />

            <RahnReadonlyInfoGrid
              title="Verifikasi & Data Dukung"
              :items="verifikasiItems"
            />
          </ModuleSectionCard>

          <ModuleSectionCard title="Kepemilikan Jaminan" v-model="isHubunganOpen">
            <div class="owner-field">
              <GDropdown
                v-model="fieldsRahin.hubungan"
                label="Status Kepemilikan"
                placeholder="Pilih status kepemilikan"
                :items="options"
                item-value="value"
                item-text="label"
                :use-bottom-sheet="isMobile"
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
.rahn-notice {
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

.rahn-stepper {
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

.owner-field {
  width: min(100%, 393px);

  @media (max-width: 767px) {
    width: auto;
  }
}

// Component overrides
:deep(.group-input) {
  margin-bottom: 0px;
}
</style>
