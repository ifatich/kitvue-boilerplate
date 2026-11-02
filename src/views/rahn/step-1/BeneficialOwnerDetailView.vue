<script setup lang="ts">
import { computed } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { GAlert, GButton, GDropdown, GInputSmallDate, GInputText, GStepper } from '@/components'
import SprintModuleShell from '@/components/shared/admin-layout/SprintModuleShell.vue'
import MobileStepperBanner from '@/components/shared/stepper/MobileStepperBanner.vue'
import ModuleSectionCard from '@/components/shared/card/ModuleSectionCard.vue'

const props = defineProps<{
  activeStep: number
  relationship: string
  isSubmitted: boolean
  identityType: 'KTP' | 'Paspor'
}>()
const isMobile = useMediaQuery('(max-width: 767px)')
const isPassport = computed(() => props.identityType === 'Paspor')

const emit = defineEmits<{
  (event: 'back'): void
  (event: 'next'): void
  (event: 'update:activeStep', value: number): void
  (event: 'update:relationship', value: string): void
}>()

const steps = [
  'Data Pengajuan',
  'Data Rahin',
  'Data Jaminan',
  'Fasilitas Pinjaman',
  'Data Review',
]

const stepModel = computed({
  get: () => props.activeStep,
  set: (value: number) => emit('update:activeStep', value),
})

const relationshipModel = computed({
  get: () => props.relationship,
  set: (value: string) => emit('update:relationship', value),
})

const identityTypeOptions = computed(() => [{ value: props.identityType, label: props.identityType }])
const rahinTypeOptions = [{ value: 'Perorangan', label: 'Perorangan' }]
const relationships = [
  { value: 'Suami / Istri', label: 'Suami / Istri' },
  { value: 'Orang Tua/Anak', label: 'Orang Tua/Anak' },
  { value: 'Kakak/Adik', label: 'Kakak/Adik' },
  { value: 'Majikan/Karyawan', label: 'Majikan/Karyawan' },
  { value: 'Lainnya', label: 'Lainnya' },
]
const validityOptions = [{ value: 'Seumur Hidup', label: 'Seumur Hidup' }]
const genderOptions = [{ value: 'Perempuan', label: 'Perempuan' }]
const educationOptions = [{ value: 'S1', label: 'S1' }]
const maritalOptions = [{ value: 'Menikah', label: 'Menikah' }]
const nationalityOptions = [{ value: 'WNI', label: 'WNI' }]
const populationOptions = [{ value: 'Penduduk', label: 'Penduduk' }]
const fundOptions = [{ value: 'Gaji', label: 'Gaji' }]
const employmentOptions = [{ value: 'Karyawan Swasta', label: 'Karyawan Swasta' }]
const incomeOptions = [{ value: '5 - 10 Juta', label: '5 - 10 Juta' }]
</script>

<template>
  <SprintModuleShell
    title="Pengajuan Rahn"
    :breadcrumbs="[
      { label: 'Beranda', to: '/beranda' },
      { label: 'Pengajuan Rahn', to: '/pengajuan-gadai' },
      'Detail Data Beneficial Owner',
    ]"
    back-to="/pengajuan-gadai"
    profile-role="Penaksir"
    :show-auth-toggle="false"
    @back="emit('back')"
  >
    <template #mobile-stepper>
      <MobileStepperBanner :active-step="activeStep" :steps="steps" />
    </template>

    <template #notice>
      <GAlert
        class="rahn-notice"
        label="Pastikan data yang diisi telah sesuai dengan data Rahin."
        color="light-blue"
        variant="info"
      />
    </template>

    <div class="application-layout">
      <GStepper
        v-if="!isMobile"
        v-model:active-step="stepModel"
        class="rahn-stepper"
        label="Langkah"
        :items="steps"
        :enable-step-untill="activeStep"
      />

      <div class="detail-form-card">
        <ModuleSectionCard title="Data Beneficial Owner">
          <div class="detail-form-grid detail-form-grid--compact">
            <GDropdown
              model-value="Perorangan"
              label="Tipe Rahin"
              :items="rahinTypeOptions"
              item-value="value"
              item-text="label"
              disabled
            />
            <GDropdown
              :model-value="props.identityType"
              label="Jenis Identitas"
              :items="identityTypeOptions"
              item-value="value"
              item-text="label"
              disabled
            />
            <GInputText model-value="1234 1234" label="Nomor Registrasi" disabled />
            <GDropdown
              v-model="relationshipModel"
              label="Hubungan"
              placeholder="Pilih hubungan"
              :items="relationships"
              item-value="value"
              item-text="label"
              :required="isSubmitted"
              :is-checked="isSubmitted"
            />
          </div>
        </ModuleSectionCard>

        <ModuleSectionCard :title="isPassport ? 'Informasi Beneficial Owner sesuai Paspor' : 'Informasi Beneficial Owner sesuai Kartu Identitas'">
          <div class="detail-form-grid">
            <GInputText
              :model-value="isPassport ? '0033 9714 84' : '3204 2888 1222 0003'"
              :label="isPassport ? 'Nomor Paspor' : 'Nomor Induk Kependudukan (NIK)'"
              disabled
            />
            <GInputText model-value="Anastasya Delistya" label="Nama Beneficial Owner" disabled />
            <GInputText model-value="Putri" label="Nama Ibu Kandung" disabled />
            <GInputText model-value="Jakarta" label="Tempat Lahir" disabled />
            <div class="detail-form-grid detail-form-grid--split">
              <GInputSmallDate
                model-value="1999-01-12"
                title="Tanggal Lahir"
                format-type="short"
                disabled
              />
              <GInputText model-value="25" label="Usia" disabled />
            </div>
            <GDropdown
              model-value="Seumur Hidup"
              label="Masa Berlaku"
              :items="validityOptions"
              item-value="value"
              item-text="label"
              disabled
            />
          </div>
        </ModuleSectionCard>

        <ModuleSectionCard title="Alamat Sesuai Kartu Identitas">
          <div class="detail-form-grid">
            <GInputText model-value="10320" label="Kode Pos" disabled />
            <GDropdown
              model-value="DKI Jakarta"
              label="Provinsi"
              :items="[{ value: 'DKI Jakarta', label: 'DKI Jakarta' }]"
              item-value="value"
              item-text="label"
              disabled
            />
            <GDropdown
              model-value="Jakarta Pusat"
              label="Kota / Kabupaten"
              :items="[{ value: 'Jakarta Pusat', label: 'Jakarta Pusat' }]"
              item-value="value"
              item-text="label"
              disabled
            />
            <GDropdown
              model-value="Menteng"
              label="Kecamatan"
              :items="[{ value: 'Menteng', label: 'Menteng' }]"
              item-value="value"
              item-text="label"
              disabled
            />
            <GDropdown
              model-value="Pegangsaan"
              label="Kelurahan"
              :items="[{ value: 'Pegangsaan', label: 'Pegangsaan' }]"
              item-value="value"
              item-text="label"
              disabled
            />
            <div class="detail-form-grid detail-form-grid--split">
              <GInputText model-value="01" label="RT" disabled />
              <GInputText model-value="02" label="RW" disabled />
            </div>
            <GInputText
              class="address-long-field"
              model-value="Jl. Borobudur No.10 9"
              label="Alamat Rumah"
              disabled
            />
          </div>
        </ModuleSectionCard>

        <ModuleSectionCard title="Alamat Tinggal Saat Ini">
          <label class="same-address">
            <input type="checkbox" checked disabled />
            <span>Alamat tinggal saat ini sesuai dengan kartu identitas.</span>
          </label>
        </ModuleSectionCard>

        <ModuleSectionCard title="Detail Data Beneficial Owner">
          <div class="detail-form-grid">
            <GDropdown
              model-value="Perempuan"
              label="Jenis Kelamin"
              :items="genderOptions"
              item-value="value"
              item-text="label"
              disabled
            />
            <GDropdown
              model-value="S1"
              label="Pendidikan"
              :items="educationOptions"
              item-value="value"
              item-text="label"
              disabled
            />
            <GDropdown
              model-value="Menikah"
              label="Status Perkawinan"
              :items="maritalOptions"
              item-value="value"
              item-text="label"
              disabled
            />
            <GInputText model-value="Annisya Syaban" label="Nama Pasangan (Opsional)" disabled />
            <GInputSmallDate
              model-value="1993-01-12"
              title="Tanggal Lahir Pasangan (Opsional)"
              format-type="short"
              disabled
            />
            <GInputText model-value="4" label="Jumlah Tanggungan (Opsional)" disabled />
            <GInputText model-value="0214 2345 5" label="Nomor Telepon (Opsional)" disabled />
            <GInputText model-value="0812 2345 5678" label="Nomor Handphone" disabled />
            <GInputText model-value="thoriqsadad@gmail.com" label="Email (Opsional)" disabled />
            <GInputText model-value="99.999.999.9-999.000" label="Nomor NPWP (Opsional)" disabled />
            <GDropdown
              model-value="WNI"
              label="Kewarganegaraan"
              :items="nationalityOptions"
              item-value="value"
              item-text="label"
              disabled
            />
            <GDropdown
              model-value="Penduduk"
              label="Tipe Kependudukan"
              :items="populationOptions"
              item-value="value"
              item-text="label"
              disabled
            />
            <GDropdown
              model-value="Gaji"
              label="Sumber Dana"
              :items="fundOptions"
              item-value="value"
              item-text="label"
              disabled
            />
            <GDropdown
              model-value="Karyawan Swasta"
              label="Pekerjaan Terkini"
              :items="employmentOptions"
              item-value="value"
              item-text="label"
              disabled
            />
            <GDropdown
              model-value="Islam"
              label="Agama"
              :items="[{ value: 'Islam', label: 'Islam' }]"
              item-value="value"
              item-text="label"
              disabled
            />
            <GDropdown
              model-value="5 - 10 Juta"
              label="Rata - Rata Penghasilan"
              :items="incomeOptions"
              item-value="value"
              item-text="label"
              disabled
            />
          </div>
        </ModuleSectionCard>
      </div>
    </div>

    <template #actions>
      <GButton
        v-if="!isMobile || activeStep > 1"
        label="Sebelumnya"
        type="outline"
        size="md"
        @click="emit('back')"
      />
      <GButton label="Selanjutnya" type="primary" size="md" @click="emit('next')" />
    </template>
  </SprintModuleShell>
</template>

<style lang="scss" scoped>
.rahn-notice {
  margin: 16px 0;

  :deep(.alert) {
    margin-bottom: 0;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 42px;
    min-height: 42px;
    padding: 10px 12px;
    border: 0;
    border-radius: 8px;
    background-color: var(--g-kit-blue-10, #e8f1f9);
    background-image: url('kitvue-public/src/assets/images/alerts/aksen-blue.svg');
    background-repeat: no-repeat;
    background-position: right center;
    background-size: contain;
    color: var(--g-kit-black-80, #252528);
    font-family: 'Nunito Sans', sans-serif;
    font-size: var(--g-kit-font-size-sigma, 14px);
    font-weight: var(--g-kit-font-weight-normal, 600);
    line-height: var(--g-kit-line-height-sigma, 20px);
  }

  @media (max-width: 767px) {
    margin: 12px 16px;
  }
}

.application-layout {
  display: grid;
  grid-template-columns: 270px minmax(0, 858px);
  gap: 24px;
  align-items: start;
  margin-bottom: 32px;
}

.detail-form-card {
  min-width: 0;
  border: 0;
  border-radius: 8px;
  background: var(--g-kit-white, #ffffff);
  box-shadow:
    inset 0 0 0 1px var(--g-kit-black-20, #eeeeef),
    0 2px 3px rgba(0, 0, 0, 0.14),
    0 0 1px rgba(0, 0, 0, 0.08);
  overflow: hidden;

  :deep(.module-section-card) {
    border: 0;
    border-radius: 0;
    margin-bottom: 0;
    padding: 0 24px;

    + .module-section-card {
      margin-top: 16px;
      border-top: 8px solid var(--g-kit-black-10, #f8f8f8);
      padding-top: 16px;
    }
  }

  :deep(.module-section-card:first-child) {
    padding-top: 24px;
  }

  :deep(.module-section-card:last-child) {
    padding-bottom: 24px;
  }
}

.detail-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 24px;
  row-gap: 24px;

  :deep(.group-input) {
    margin-top: -3px;
    margin-bottom: 0;
  }

  :deep(.address-long-field .form-control) {
    height: 72px;
  }

  &--compact {
    row-gap: 16px;
  }

  &--split {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 16px;
  }
}

.same-address {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 24px;
  color: var(--g-kit-black-80, #252528);
  font-size: var(--g-kit-font-size-omega, 12px);
  line-height: var(--g-kit-line-height-omega, 18px);

  input {
    width: 16px;
    height: 16px;
    margin: 0;
    accent-color: var(--g-kit-lime-50, #00ab4e);
  }
}

@media (max-width: 767px) {
  .application-layout {
    display: block;
    margin-bottom: 0;
  }

  .rahn-stepper {
    display: none;
  }

  .detail-form-card {
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    gap: 8px;

    :deep(.module-section-card) {
      width: 100%;
      border: 0;
      border-radius: 0;
      padding: 16px;
      background: var(--g-kit-white, #ffffff);

      + .module-section-card {
        margin-top: 0;
        border-top: 0;
        padding-top: 16px;
      }
    }

    :deep(.module-section-card:first-child) {
      padding-top: 16px;
    }

    :deep(.module-section-card:last-child) {
      padding-bottom: 16px;
    }
  }

  .detail-form-grid {
    grid-template-columns: 1fr;
    row-gap: 16px;
  }

  .detail-form-grid--split {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
