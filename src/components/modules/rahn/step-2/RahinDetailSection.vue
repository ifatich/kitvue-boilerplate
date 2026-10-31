<script setup lang="ts">
/**
 * @file RahinDetailSection.vue
 * @description SPRINT Single UI Detail Data Rahin View (Figma Node 11347:163531 & 11347:165167).
 * Implements 5 structured ModuleSectionCard sections conforming 1:1 with BeneficialOwnerDetailSections:
 * 1. Data Rahin (Figma Node 11347:163570)
 * 2. Informasi Data Rahin sesuai Kartu Identitas (Figma Node 11347:163577 / 11347:163580)
 * 3. Alamat Sesuai Kartu Identitas (Figma Node 11347:163601 / 11347:163603)
 * 4. Alamat Tinggal Saat Ini (Figma Node 11347:163620 / 11347:163624)
 * 5. Detail Data Rahin Terkini (Figma Node 11347:163641 / 11347:163644)
 * Strictly adheres to Pegadaian --g-kit-* design tokens and kitvue-plugin rules.
 */
import { computed, ref, watch } from 'vue'
import {
  GBadge,
  GButton,
  GCheckbox,
  GDropdown,
  GInputNIK,
  GInputNominalStart,
  GInputSmallDate,
  GInputText,
  GTextArea,
} from '@/components'
import ModuleSectionCard from '@/components/shared/card/ModuleSectionCard.vue'
import ValidasiDukcapilModal, {
  type DukcapilInputFields,
} from './modals/ValidasiDukcapilModal.vue'
import {
  type DukcapilStatus,
  calculateAge,
  checkDukcapilGaps,
  lookupPostalCode,
  normalizeDateToIso,
  verifyDukcapil,
} from '../mockRahinData'
import type { RahinFields } from './Step2RahinContent.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: RahinFields
    fields?: RahinFields
    isMobile?: boolean
    isReadOnly?: boolean
    selectionMode?: 'terpilih' | 'pilih' | 'tambah'
  }>(),
  {
    isMobile: false,
    isReadOnly: false,
    selectionMode: 'terpilih',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: RahinFields): void
  (e: 'update:fields', val: RahinFields): void
  (e: 'dukcapil-verified', status: DukcapilStatus): void
}>()

// Collapsible states for each of the 5 sections
const isSeksi1Open = ref(true)
const isSeksi2Open = ref(true)
const isSeksi3Open = ref(true)
const isSeksi4Open = ref(true)
const isSeksi5Open = ref(true)

// Computed full disable state (Full disable when selectionMode === 'terpilih' or isReadOnly === true)
const isFullDisabled = computed(() => {
  return props.isReadOnly || props.selectionMode === 'terpilih'
})

const isTambahMode = computed(() => props.selectionMode === 'tambah')
const isPilihMode = computed(() => props.selectionMode === 'pilih')

// Identity fields (Seksi 2 & Seksi 3) are disabled EXCEPT in 'tambah' mode:
const isIdentityFieldsDisabled = computed(() => {
  return isFullDisabled.value || !isTambahMode.value
})

const isDukcapilModalOpen = ref(false)

// Internal reactive fields state
const isPilih = props.selectionMode === 'pilih'
const isTambah = props.selectionMode === 'tambah'
const localFields = ref<RahinFields>({
  tipeRahin: props.fields?.tipeRahin || props.modelValue?.tipeRahin || 'Perorangan',
  nik: props.fields?.nik || props.modelValue?.nik || (isTambah ? '' : '3204 2849 1298 0003'),
  nama: props.fields?.nama || props.modelValue?.nama || (isTambah ? '' : 'Anastasya Delistya'),
  noHp: props.fields?.noHp ?? props.modelValue?.noHp ?? (isPilih || isTambah ? '' : '0812 2345 3456'),
  pekerjaan: props.fields?.pekerjaan ?? props.modelValue?.pekerjaan ?? (isPilih || isTambah ? '' : 'Pegawai Swasta'),
  nominal: props.fields?.nominal || props.modelValue?.nominal || (isTambah ? '' : '15000000'),
  alamat: props.fields?.alamat || props.modelValue?.alamat || (isTambah ? '' : 'Pertokoan Kenari Baru, Senen'),
  hubungan: props.fields?.hubungan || props.modelValue?.hubungan || 'diri-sendiri',
  cif: props.fields?.cif || props.modelValue?.cif || (isTambah ? '' : '1234 1234 01'),
  statusRahin: props.fields?.statusRahin || props.modelValue?.statusRahin || 'syariah',
  ratingRahin: props.fields?.ratingRahin || props.modelValue?.ratingRahin || (isTambah ? '' : 'Platinum Plus'),
  dukcapilStatus: props.fields?.dukcapilStatus || props.modelValue?.dukcapilStatus || (isTambah ? 'belum_cek' : 'valid'),
  jenisIdentitas: props.fields?.jenisIdentitas || props.modelValue?.jenisIdentitas || 'ktp',
  masaBerlaku: props.fields?.masaBerlaku || props.modelValue?.masaBerlaku || 'seumur_hidup',
  tempatLahir: props.fields?.tempatLahir || props.modelValue?.tempatLahir || (isTambah ? '' : 'Jakarta'),
  tanggalLahir: normalizeDateToIso(props.fields?.tanggalLahir || props.modelValue?.tanggalLahir || (isTambah ? '' : '1990-01-01')),
  namaIbuKandung: props.fields?.namaIbuKandung || props.modelValue?.namaIbuKandung || (isTambah ? '' : 'Putri'),
  jenisKelamin: props.fields?.jenisKelamin ?? props.modelValue?.jenisKelamin ?? (isPilih || isTambah ? '' : 'Perempuan'),
  agama: props.fields?.agama ?? props.modelValue?.agama ?? (isPilih || isTambah ? '' : 'Islam'),
  statusPerkawinan: props.fields?.statusPerkawinan ?? props.modelValue?.statusPerkawinan ?? (isPilih || isTambah ? '' : 'Menikah'),
  cabangPembuka: props.fields?.cabangPembuka || props.modelValue?.cabangPembuka || (isTambah ? '' : 'Cabang Boulevard'),

  // Alamat Identitas
  rt: props.fields?.rt || props.modelValue?.rt || (isTambah ? '' : '001'),
  rw: props.fields?.rw || props.modelValue?.rw || (isTambah ? '' : '002'),
  kodePos: props.fields?.kodePos || props.modelValue?.kodePos || (isTambah ? '' : '10430'),
  provinsi: props.fields?.provinsi || props.modelValue?.provinsi || (isTambah ? '' : 'DKI Jakarta'),
  kotaKab: props.fields?.kotaKab || props.modelValue?.kotaKab || (isTambah ? '' : 'Kota Jakarta Pusat'),
  kecamatan: props.fields?.kecamatan || props.modelValue?.kecamatan || (isTambah ? '' : 'Senen'),
  kelurahan: props.fields?.kelurahan || props.modelValue?.kelurahan || (isTambah ? '' : 'Kenari'),
  isDataSesuaiIdentitas: props.fields?.isDataSesuaiIdentitas ?? props.modelValue?.isDataSesuaiIdentitas ?? (!isTambah),

  // Alamat Domisili
  isAlamatDomisiliSama: props.fields?.isAlamatDomisiliSama ?? props.modelValue?.isAlamatDomisiliSama ?? (!isPilih && !isTambah),
  domAlamat: props.fields?.domAlamat ?? props.modelValue?.domAlamat ?? (isPilih || isTambah ? '' : 'Pertokoan Kenari Baru, Senen'),
  domRt: props.fields?.domRt ?? props.modelValue?.domRt ?? (isPilih || isTambah ? '' : '001'),
  domRw: props.fields?.domRw ?? props.modelValue?.domRw ?? (isPilih || isTambah ? '' : '002'),
  domKodePos: props.fields?.domKodePos ?? props.modelValue?.domKodePos ?? (isPilih || isTambah ? '' : '10430'),
  domProvinsi: props.fields?.domProvinsi ?? props.modelValue?.domProvinsi ?? (isPilih || isTambah ? '' : 'DKI Jakarta'),
  domKotaKab: props.fields?.domKotaKab ?? props.modelValue?.domKotaKab ?? (isPilih || isTambah ? '' : 'Kota Jakarta Pusat'),
  domKecamatan: props.fields?.domKecamatan ?? props.modelValue?.domKecamatan ?? (isPilih || isTambah ? '' : 'Senen'),
  domKelurahan: props.fields?.domKelurahan ?? props.modelValue?.domKelurahan ?? (isPilih || isTambah ? '' : 'Kenari'),

  // Finansial
  namaInstansi: props.fields?.namaInstansi ?? props.modelValue?.namaInstansi ?? (isPilih || isTambah ? '' : 'PT Megah Mandiri'),
  rataPenghasilan: props.fields?.rataPenghasilan ?? props.modelValue?.rataPenghasilan ?? (isPilih || isTambah ? '' : '15000000'),
  npwp: props.fields?.npwp ?? props.modelValue?.npwp ?? (isPilih || isTambah ? '' : '09.254.341.2-015.000'),
  email: props.fields?.email ?? props.modelValue?.email ?? (isPilih || isTambah ? '' : 'anastasya.delistya@email.com'),
  pendidikan: props.fields?.pendidikan ?? props.modelValue?.pendidikan ?? (isPilih || isTambah ? '' : 'S1'),
  namaPasangan: props.fields?.namaPasangan ?? props.modelValue?.namaPasangan ?? (isPilih || isTambah ? '' : 'Putra'),
  tanggalLahirPasangan: props.fields?.tanggalLahirPasangan ?? props.modelValue?.tanggalLahirPasangan ?? (isPilih || isTambah ? '' : '1992-05-15'),
  jumlahTanggungan: props.fields?.jumlahTanggungan ?? props.modelValue?.jumlahTanggungan ?? (isPilih || isTambah ? '' : '0'),
  nomorTelepon: props.fields?.nomorTelepon ?? props.modelValue?.nomorTelepon ?? '',
  kewarganegaraan: props.fields?.kewarganegaraan ?? props.modelValue?.kewarganegaraan ?? 'WNI',
  tipeKependudukan: props.fields?.tipeKependudukan ?? props.modelValue?.tipeKependudukan ?? 'Penduduk',
  sumberDana: props.fields?.sumberDana ?? props.modelValue?.sumberDana ?? (isPilih || isTambah ? '' : 'Gaji'),
})

// Sync when external props update
watch(
  () => [props.fields, props.modelValue, props.selectionMode],
  () => {
    const src = props.fields || props.modelValue
    if (src) {
      localFields.value = {
        ...localFields.value,
        ...src,
        tanggalLahir: normalizeDateToIso(src.tanggalLahir || localFields.value.tanggalLahir),
      }
    }
  },
  { deep: true },
)

const syncUpstream = () => {
  emit('update:modelValue', { ...localFields.value })
  emit('update:fields', { ...localFields.value })
}

// Age calculation
const customerAge = computed(() => {
  return calculateAge(localFields.value.tanggalLahir)
})

// Dukcapil verification logic (Figma Node 11347:166766 & User Screenshot 2)
const isCheckingDukcapil = ref(false)

const handleCekDukcapil = () => {
  isCheckingDukcapil.value = true
  setTimeout(() => {
    isCheckingDukcapil.value = false
    if (isTambahMode.value) {
      const result = checkDukcapilGaps({
        nik: localFields.value.nik,
        nama: localFields.value.nama,
        tempatLahir: localFields.value.tempatLahir,
        tanggalLahir: localFields.value.tanggalLahir,
        jenisKelamin: localFields.value.jenisKelamin,
        namaIbuKandung: localFields.value.namaIbuKandung,
        agama: localFields.value.agama,
        pekerjaan: localFields.value.pekerjaan,
        alamat: localFields.value.alamat,
        rt: localFields.value.rt,
        rw: localFields.value.rw,
        provinsi: localFields.value.provinsi,
        kotaKab: localFields.value.kotaKab,
        kecamatan: localFields.value.kecamatan,
        kelurahan: localFields.value.kelurahan,
      })

      if (result.isValid) {
        localFields.value.dukcapilStatus = 'valid'
        emit('dukcapil-verified', 'valid')
        syncUpstream()
      } else {
        localFields.value.dukcapilStatus = 'tidak_sesuai'
        emit('dukcapil-verified', 'tidak_sesuai')
        isDukcapilModalOpen.value = true
        syncUpstream()
      }
    } else {
      const status = verifyDukcapil(localFields.value.nik)
      localFields.value.dukcapilStatus = status
      emit('dukcapil-verified', status)
      syncUpstream()
    }
  }, 300)
}

const handleConfirmDukcapilSync = (updatedData: DukcapilInputFields) => {
  if (updatedData.nama) localFields.value.nama = updatedData.nama
  if (updatedData.tempatLahir) localFields.value.tempatLahir = updatedData.tempatLahir
  if (updatedData.tanggalLahir) localFields.value.tanggalLahir = normalizeDateToIso(updatedData.tanggalLahir)
  if (updatedData.jenisKelamin) localFields.value.jenisKelamin = updatedData.jenisKelamin
  if (updatedData.namaIbuKandung) localFields.value.namaIbuKandung = updatedData.namaIbuKandung
  if (updatedData.agama) localFields.value.agama = updatedData.agama
  if (updatedData.pekerjaan) localFields.value.pekerjaan = updatedData.pekerjaan
  if (updatedData.alamat) localFields.value.alamat = updatedData.alamat
  if (updatedData.rt) localFields.value.rt = updatedData.rt
  if (updatedData.rw) localFields.value.rw = updatedData.rw
  if (updatedData.provinsi) localFields.value.provinsi = updatedData.provinsi
  if (updatedData.kotaKab) localFields.value.kotaKab = updatedData.kotaKab
  if (updatedData.kecamatan) localFields.value.kecamatan = updatedData.kecamatan
  if (updatedData.kelurahan) localFields.value.kelurahan = updatedData.kelurahan
  localFields.value.dukcapilStatus = 'valid'
  emit('dukcapil-verified', 'valid')
  syncUpstream()
}

const toggleDukcapilStatus = (status: DukcapilStatus) => {
  localFields.value.dukcapilStatus = status
  emit('dukcapil-verified', status)
  syncUpstream()
}

// Postal Code Auto-Fill: Identity Address
const handleKtpPostalCodeChange = (code: string) => {
  localFields.value.kodePos = code
  if (code.length === 5) {
    const loc = lookupPostalCode(code)
    if (loc) {
      localFields.value.provinsi = loc.provinsi
      localFields.value.kotaKab = loc.kotaKab
      localFields.value.kecamatan = loc.kecamatan
      localFields.value.kelurahan = loc.kelurahan
    }
  }
  if (localFields.value.isAlamatDomisiliSama) {
    syncDomisiliFromIdentity()
  }
  syncUpstream()
}

// Postal Code Auto-Fill: Domicile Address
const handleDomPostalCodeChange = (code: string) => {
  localFields.value.domKodePos = code
  if (code.length === 5) {
    const loc = lookupPostalCode(code)
    if (loc) {
      localFields.value.domProvinsi = loc.provinsi
      localFields.value.domKotaKab = loc.kotaKab
      localFields.value.domKecamatan = loc.kecamatan
      localFields.value.domKelurahan = loc.kelurahan
    }
  }
  syncUpstream()
}

const syncDomisiliFromIdentity = () => {
  localFields.value.domAlamat = localFields.value.alamat
  localFields.value.domRt = localFields.value.rt
  localFields.value.domRw = localFields.value.rw
  localFields.value.domKodePos = localFields.value.kodePos
  localFields.value.domProvinsi = localFields.value.provinsi
  localFields.value.domKotaKab = localFields.value.kotaKab
  localFields.value.domKecamatan = localFields.value.kecamatan
  localFields.value.domKelurahan = localFields.value.kelurahan
}

const handleDomisiliSyncChange = (checked: boolean) => {
  localFields.value.isAlamatDomisiliSama = checked
  if (checked) {
    syncDomisiliFromIdentity()
  }
  syncUpstream()
}

// Dropdown Options matching BeneficialOwnerDetailSections
const tipeRahinOptions = [
  { value: 'Perorangan', label: 'Perorangan' },
  { value: 'perorangan', label: 'Perorangan' },
  { value: 'Badan Usaha', label: 'Badan Usaha' },
]

const jenisIdentitasOptions = [
  { value: 'ktp', label: 'KTP' },
  { value: 'KTP', label: 'KTP' },
  { value: 'paspor', label: 'Paspor' },
  { value: 'Paspor', label: 'Paspor' },
]

const masaBerlakuOptions = [
  { value: 'seumur_hidup', label: 'Seumur Hidup' },
  { value: 'sampai_dengan', label: 'Sampai Dengan' },
]

const provinsiOptions = [
  { value: 'DKI Jakarta', label: 'DKI Jakarta' },
  { value: 'Jawa Barat', label: 'Jawa Barat' },
  { value: 'Banten', label: 'Banten' },
]

const kotaKabOptions = [
  { value: 'Kota Jakarta Pusat', label: 'Kota Jakarta Pusat' },
  { value: 'Jakarta Pusat', label: 'Jakarta Pusat' },
  { value: 'Kota Jakarta Selatan', label: 'Kota Jakarta Selatan' },
  { value: 'Jakarta Selatan', label: 'Jakarta Selatan' },
  { value: 'Bandung', label: 'Bandung' },
]

const kecamatanOptions = [
  { value: 'Menteng', label: 'Menteng' },
  { value: 'Senen', label: 'Senen' },
  { value: 'Tebet', label: 'Tebet' },
  { value: 'Kebayoran Baru', label: 'Kebayoran Baru' },
]

const kelurahanOptions = [
  { value: 'Pegangsaan', label: 'Pegangsaan' },
  { value: 'Kenari', label: 'Kenari' },
  { value: 'Kramat', label: 'Kramat' },
  { value: 'Senayan', label: 'Senayan' },
]

const jenisKelaminOptions = [
  { value: 'Laki-laki', label: 'Laki-laki' },
  { value: 'Perempuan', label: 'Perempuan' },
]

const agamaOptions = [
  { value: 'Islam', label: 'Islam' },
  { value: 'Kristen', label: 'Kristen Protestan' },
  { value: 'Katolik', label: 'Katolik' },
  { value: 'Hindu', label: 'Hindu' },
  { value: 'Buddha', label: 'Buddha' },
  { value: 'Konghucu', label: 'Konghucu' },
]

const statusPerkawinanOptions = [
  { value: 'Belum Menikah', label: 'Belum Menikah' },
  { value: 'Menikah', label: 'Menikah' },
  { value: 'Cerai Hidup', label: 'Cerai Hidup' },
  { value: 'Cerai Mati', label: 'Cerai Mati' },
]

const pendidikanOptions = [
  { value: 'SD', label: 'SD' },
  { value: 'SMP', label: 'SMP' },
  { value: 'SMA', label: 'SMA' },
  { value: 'SMA / SMK', label: 'SMA / SMK' },
  { value: 'D3', label: 'D3' },
  { value: 'S1', label: 'S1' },
  { value: 'S2', label: 'S2' },
  { value: 'S3', label: 'S3' },
]

const pekerjaanOptions = [
  { value: 'Pegawai Swasta', label: 'Pegawai Swasta' },
  { value: 'Karyawan Swasta', label: 'Karyawan Swasta' },
  { value: 'PNS / ASN', label: 'PNS / ASN' },
  { value: 'Wiraswasta', label: 'Wiraswasta / Pengusaha' },
  { value: 'TNI / POLRI', label: 'TNI / POLRI' },
  { value: 'Profesional', label: 'Profesional' },
  { value: 'Ibu Rumah Tangga', label: 'Ibu Rumah Tangga' },
  { value: 'Lainnya', label: 'Lainnya' },
]

const kewarganegaraanOptions = [
  { value: 'WNI', label: 'WNI' },
  { value: 'WNA', label: 'WNA' },
]

const tipeKependudukanOptions = [
  { value: 'Penduduk', label: 'Penduduk' },
  { value: 'Bukan Penduduk', label: 'Bukan Penduduk' },
]

const sumberDanaOptions = [
  { value: 'Gaji', label: 'Gaji / Upah' },
  { value: 'Hasil Usaha', label: 'Hasil Usaha' },
  { value: 'Tabungan', label: 'Tabungan Pribadi' },
  { value: 'Warisan', label: 'Warisan' },
]

defineExpose({
  localFields,
  handleCekDukcapil,
  handleConfirmDukcapilSync,
  toggleDukcapilStatus,
  handleKtpPostalCodeChange,
  handleDomPostalCodeChange,
  handleDomisiliSyncChange,
  syncDomisiliFromIdentity,
  isDukcapilModalOpen,
  isTambahMode,
  isPilihMode,
  isIdentityFieldsDisabled,
})
</script>

<template>
  <div class="rahin-detail-sections-container">
    <!-- SEKSI 1: Data Rahin (Figma Node 11347:163568 / 11347:163570) -->
    <ModuleSectionCard
      title="Data Rahin"
      v-model="isSeksi1Open"
      data-node-id="11347:163570"
    >
      <div class="row g-3">
        <div class="col-12 col-md-6">
          <GDropdown
            :model-value="localFields.tipeRahin || 'Perorangan'"
            label="Tipe Rahin"
            placeholder="Pilih tipe rahin"
            :items="tipeRahinOptions"
            item-value="value"
            item-text="label"
            disabled
            :use-bottom-sheet="isMobile"
          />
        </div>
        <div class="col-12 col-md-6">
          <GDropdown
            :model-value="localFields.jenisIdentitas || 'ktp'"
            label="Jenis Identitas"
            placeholder="Pilih jenis identitas"
            :items="jenisIdentitasOptions"
            item-value="value"
            item-text="label"
            disabled
            :use-bottom-sheet="isMobile"
          />
        </div>
        <div v-if="!isTambahMode" class="col-12 col-md-6">
          <GInputText
            :model-value="localFields.cif || '1234 1234 01'"
            label="Nomor CIF"
            placeholder="1234 1234 01"
            disabled
          />
        </div>
      </div>
    </ModuleSectionCard>

    <!-- SEKSI 2: Informasi Data Rahin Sesuai Kartu Identitas (Figma Node 11347:163580 / 11347:163577) -->
    <ModuleSectionCard
      title="Informasi Data Rahin Sesuai Kartu Identitas"
      v-model="isSeksi2Open"
      data-node-id="11347:163577"
    >
      <div class="row g-3">
        <div class="col-12 col-md-6">
          <GInputText
            v-if="localFields.jenisIdentitas === 'paspor'"
            :model-value="localFields.nik"
            label="Nomor Paspor"
            placeholder="0033 9714 84"
            :disabled="isFullDisabled"
            @update:model-value="(val: string) => { localFields.nik = val; syncUpstream(); }"
          />
          <GInputNIK
            v-else
            :model-value="localFields.nik"
            label="Nomor Induk Kependudukan (NIK)"
            placeholder="3204 2849 1298 0003"
            :disabled="isFullDisabled"
            @update:model-value="(val: string) => { localFields.nik = val; syncUpstream(); }"
          />
        </div>
        <div class="col-12 col-md-6">
          <GInputText
            :model-value="localFields.nama"
            label="Nama Rahin Sesuai Identitas"
            placeholder="Masukkan nama lengkap sesuai identitas"
            :disabled="isIdentityFieldsDisabled"
            required
            @update:model-value="(val: string) => { localFields.nama = val; syncUpstream(); }"
          />
        </div>

        <div class="col-12 col-md-6">
          <GInputText
            :model-value="localFields.namaIbuKandung"
            label="Nama Ibu Kandung"
            placeholder="Masukkan nama ibu kandung"
            :disabled="isIdentityFieldsDisabled"
            required
            @update:model-value="(val: string) => { localFields.namaIbuKandung = val; syncUpstream(); }"
          />
        </div>
        <div class="col-12 col-md-6">
          <GInputText
            :model-value="localFields.tempatLahir"
            label="Tempat Lahir"
            placeholder="Contoh: Jakarta"
            :disabled="isIdentityFieldsDisabled"
            required
            @update:model-value="(val: string) => { localFields.tempatLahir = val; syncUpstream(); }"
          />
        </div>

        <!-- Tanggal Lahir (GInputSmallDate) & Usia (disabled auto-calc) -->
        <div class="col-12 col-md-6">
          <div class="d-flex gap-3 align-items-start w-100">
            <div class="flex-grow-1">
              <GInputSmallDate
                :model-value="normalizeDateToIso(localFields.tanggalLahir)"
                title="Tanggal Lahir"
                placeholder="Pilih tanggal lahir"
                :disabled="isIdentityFieldsDisabled"
                required
                @update:model-value="(val: string) => { localFields.tanggalLahir = normalizeDateToIso(val); syncUpstream(); }"
              />
            </div>
            <div style="width: 112px; flex-shrink: 0;">
              <GInputText
                :model-value="customerAge"
                label="Usia"
                placeholder="0"
                type="number"
                disabled
              />
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <GDropdown
            :model-value="localFields.masaBerlaku || 'seumur_hidup'"
            label="Masa Berlaku"
            placeholder="Pilih masa berlaku"
            :items="masaBerlakuOptions"
            item-value="value"
            item-text="label"
            :disabled="isIdentityFieldsDisabled"
            :use-bottom-sheet="isMobile"
            @update:model-value="(val: any) => { localFields.masaBerlaku = val; syncUpstream(); }"
          />
        </div>

        <!-- Dukcapil Feedback & Verification Action Row -->
        <div
          v-if="localFields.jenisIdentitas !== 'paspor'"
          class="col-12 d-flex align-items-center justify-content-between flex-wrap gap-2 pt-2"
        >
          <div>
            <GBadge
              v-if="localFields.dukcapilStatus === 'valid'"
              type="primary"
              label="Terverifikasi Dukcapil"
            />
            <GBadge
              v-else-if="localFields.dukcapilStatus === 'tidak_sesuai'"
              type="secondary"
              label="Data Tidak Sesuai Dukcapil"
            />
            <span v-else class="text-muted small">
              Data belum diverifikasi dengan Dukcapil.
            </span>
          </div>
          <GButton
            :label="localFields.dukcapilStatus === 'valid' ? 'Cek Ulang Dukcapil' : 'Cek Dukcapil'"
            type="outline"
            size="md"
            style="width: 185px;"
            :disabled="isFullDisabled"
            :loading="isCheckingDukcapil"
            @click="handleCekDukcapil"
          />
        </div>
      </div>
    </ModuleSectionCard>

    <!-- SEKSI 3: Alamat Sesuai Kartu Identitas (Figma Node 11347:163603 / 11347:163601) -->
    <ModuleSectionCard
      title="Alamat Sesuai Kartu Identitas"
      v-model="isSeksi3Open"
      data-node-id="11347:163601"
    >
      <div class="row g-3">
        <div class="col-12 col-md-6">
          <GInputText
            :model-value="localFields.kodePos"
            label="Kode Pos"
            placeholder="Contoh: 10430"
            type="number"
            :disabled="isIdentityFieldsDisabled"
            required
            @update:model-value="handleKtpPostalCodeChange"
          />
        </div>
        <div class="col-12 col-md-6">
          <GDropdown
            :model-value="localFields.provinsi || 'DKI Jakarta'"
            label="Provinsi"
            placeholder="Pilih provinsi"
            :items="provinsiOptions"
            item-value="value"
            item-text="label"
            :disabled="isIdentityFieldsDisabled"
            :use-bottom-sheet="isMobile"
            @update:model-value="(val: any) => { localFields.provinsi = val; syncUpstream(); }"
          />
        </div>

        <div class="col-12 col-md-6">
          <GDropdown
            :model-value="localFields.kotaKab || 'Kota Jakarta Pusat'"
            label="Kota / Kabupaten"
            placeholder="Pilih kota / kabupaten"
            :items="kotaKabOptions"
            item-value="value"
            item-text="label"
            :disabled="isIdentityFieldsDisabled"
            :use-bottom-sheet="isMobile"
            @update:model-value="(val: any) => { localFields.kotaKab = val; syncUpstream(); }"
          />
        </div>
        <div class="col-12 col-md-6">
          <GDropdown
            :model-value="localFields.kecamatan || 'Senen'"
            label="Kecamatan"
            placeholder="Pilih kecamatan"
            :items="kecamatanOptions"
            item-value="value"
            item-text="label"
            :disabled="isIdentityFieldsDisabled"
            :use-bottom-sheet="isMobile"
            @update:model-value="(val: any) => { localFields.kecamatan = val; syncUpstream(); }"
          />
        </div>

        <div class="col-12 col-md-6">
          <GDropdown
            :model-value="localFields.kelurahan || 'Kenari'"
            label="Kelurahan"
            placeholder="Pilih kelurahan"
            :items="kelurahanOptions"
            item-value="value"
            item-text="label"
            :disabled="isIdentityFieldsDisabled"
            :use-bottom-sheet="isMobile"
            @update:model-value="(val: any) => { localFields.kelurahan = val; syncUpstream(); }"
          />
        </div>
        <div class="col-12 col-md-6">
          <div class="row g-3">
            <div class="col-6">
              <GInputText
                :model-value="localFields.rt"
                label="RT"
                placeholder="001"
                type="number"
                maxlength="3"
                :disabled="isIdentityFieldsDisabled"
                @update:model-value="(val: string) => { localFields.rt = val; syncUpstream(); }"
              />
            </div>
            <div class="col-6">
              <GInputText
                :model-value="localFields.rw"
                label="RW"
                placeholder="002"
                type="number"
                maxlength="3"
                :disabled="isIdentityFieldsDisabled"
                @update:model-value="(val: string) => { localFields.rw = val; syncUpstream(); }"
              />
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <GTextArea
            :model-value="localFields.alamat"
            label="Alamat Rumah"
            placeholder="Masukkan alamat rumah sesuai kartu identitas"
            :disabled="isIdentityFieldsDisabled"
            required
            @update:model-value="(val: string) => { localFields.alamat = val; syncUpstream(); }"
          />
        </div>

        <!-- Document Confirmation Checkbox -->
        <div class="col-12">
          <div class="identity-confirm-box p-3 rounded mt-2">
            <GCheckbox
              :model-value="localFields.isDataSesuaiIdentitas"
              label="Data telah sesuai dengan kartu identitas"
              :disabled="isFullDisabled"
              @update:model-value="(val: boolean) => { localFields.isDataSesuaiIdentitas = val; syncUpstream(); }"
            />
          </div>
        </div>
      </div>
    </ModuleSectionCard>

    <!-- SEKSI 4: Alamat Tinggal Saat Ini (Figma Node 11347:163624 / 11347:163620) -->
    <ModuleSectionCard
      title="Alamat Tinggal Saat Ini"
      v-model="isSeksi4Open"
      data-node-id="11347:163620"
    >
      <div class="mb-3">
        <GCheckbox
          :model-value="localFields.isAlamatDomisiliSama"
          label="Alamat tinggal saat ini sama dengan kartu identitas"
          :disabled="isFullDisabled"
          @update:model-value="handleDomisiliSyncChange"
        />
      </div>

      <!-- Rendered domisili form: active only if checkbox unchecked -->
      <div v-if="!localFields.isAlamatDomisiliSama" class="row g-3">
        <div class="col-12 col-md-6">
          <GInputText
            :model-value="localFields.domKodePos"
            label="Kode Pos"
            placeholder="Masukkan kode pos"
            type="number"
            :disabled="isFullDisabled"
            required
            @update:model-value="handleDomPostalCodeChange"
          />
        </div>
        <div class="col-12 col-md-6">
          <GDropdown
            :model-value="localFields.domProvinsi"
            label="Provinsi"
            placeholder="Pilih provinsi"
            :items="provinsiOptions"
            item-value="value"
            item-text="label"
            :disabled="isFullDisabled"
            :use-bottom-sheet="isMobile"
            @update:model-value="(val: any) => { localFields.domProvinsi = val; syncUpstream(); }"
          />
        </div>

        <div class="col-12 col-md-6">
          <GDropdown
            :model-value="localFields.domKotaKab"
            label="Kota / Kabupaten"
            placeholder="Pilih kota / kabupaten"
            :items="kotaKabOptions"
            item-value="value"
            item-text="label"
            :disabled="isFullDisabled"
            :use-bottom-sheet="isMobile"
            @update:model-value="(val: any) => { localFields.domKotaKab = val; syncUpstream(); }"
          />
        </div>
        <div class="col-12 col-md-6">
          <GDropdown
            :model-value="localFields.domKecamatan"
            label="Kecamatan"
            placeholder="Pilih kecamatan"
            :items="kecamatanOptions"
            item-value="value"
            item-text="label"
            :disabled="isFullDisabled"
            :use-bottom-sheet="isMobile"
            @update:model-value="(val: any) => { localFields.domKecamatan = val; syncUpstream(); }"
          />
        </div>

        <div class="col-12 col-md-6">
          <GDropdown
            :model-value="localFields.domKelurahan"
            label="Kelurahan"
            placeholder="Pilih kelurahan"
            :items="kelurahanOptions"
            item-value="value"
            item-text="label"
            :disabled="isFullDisabled"
            :use-bottom-sheet="isMobile"
            @update:model-value="(val: any) => { localFields.domKelurahan = val; syncUpstream(); }"
          />
        </div>
        <div class="col-12 col-md-6">
          <div class="row g-3">
            <div class="col-6">
              <GInputText
                :model-value="localFields.domRt"
                label="RT"
                placeholder="001"
                type="number"
                maxlength="3"
                :disabled="isFullDisabled"
                @update:model-value="(val: string) => { localFields.domRt = val; syncUpstream(); }"
              />
            </div>
            <div class="col-6">
              <GInputText
                :model-value="localFields.domRw"
                label="RW"
                placeholder="002"
                type="number"
                maxlength="3"
                :disabled="isFullDisabled"
                @update:model-value="(val: string) => { localFields.domRw = val; syncUpstream(); }"
              />
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <GTextArea
            :model-value="localFields.domAlamat"
            label="Alamat Rumah"
            placeholder="Masukkan alamat tinggal saat ini"
            :disabled="isFullDisabled"
            required
            @update:model-value="(val: string) => { localFields.domAlamat = val; syncUpstream(); }"
          />
        </div>
      </div>
    </ModuleSectionCard>

    <!-- SEKSI 5: Detail Data Rahin Terkini (Figma Node 11347:163644 / 11347:163641) -->
    <ModuleSectionCard
      title="Detail Data Rahin Terkini"
      v-model="isSeksi5Open"
      data-node-id="11347:163641"
    >
      <div class="row g-3">
        <!-- Row 1: Jenis Kelamin & Pendidikan -->
        <div class="col-12 col-md-6">
          <GDropdown
            :model-value="localFields.jenisKelamin"
            label="Jenis Kelamin"
            placeholder="Pilih jenis kelamin"
            :items="jenisKelaminOptions"
            item-value="value"
            item-text="label"
            :disabled="isFullDisabled"
            :use-bottom-sheet="isMobile"
            @update:model-value="(val: any) => { localFields.jenisKelamin = val; syncUpstream(); }"
          />
        </div>
        <div class="col-12 col-md-6">
          <GDropdown
            :model-value="localFields.pendidikan"
            label="Pendidikan"
            placeholder="Pilih pendidikan"
            :items="pendidikanOptions"
            item-value="value"
            item-text="label"
            :disabled="isFullDisabled"
            :use-bottom-sheet="isMobile"
            @update:model-value="(val: any) => { localFields.pendidikan = val; syncUpstream(); }"
          />
        </div>

        <!-- Row 2: Status Perkawinan & Nama Pasangan (Opsional) -->
        <div class="col-12 col-md-6">
          <GDropdown
            :model-value="localFields.statusPerkawinan"
            label="Status Perkawinan"
            placeholder="Pilih status perkawinan"
            :items="statusPerkawinanOptions"
            item-value="value"
            item-text="label"
            :disabled="isFullDisabled"
            :use-bottom-sheet="isMobile"
            @update:model-value="(val: any) => { localFields.statusPerkawinan = val; syncUpstream(); }"
          />
        </div>
        <div class="col-12 col-md-6">
          <GInputText
            :model-value="localFields.namaPasangan"
            label="Nama Pasangan (Opsional)"
            placeholder="Masukkan nama pasangan"
            :disabled="isFullDisabled"
            @update:model-value="(val: string) => { localFields.namaPasangan = val; syncUpstream(); }"
          />
        </div>

        <!-- Row 3: Tanggal Lahir Pasangan (Opsional) & Jumlah Tanggungan (Opsional) -->
        <div class="col-12 col-md-6">
          <GInputSmallDate
            :model-value="localFields.tanggalLahirPasangan"
            title="Tanggal Lahir Pasangan (Opsional)"
            placeholder="Pilih tanggal lahir pasangan"
            :disabled="isFullDisabled"
            @update:model-value="(val: string) => { localFields.tanggalLahirPasangan = val; syncUpstream(); }"
          />
        </div>
        <div class="col-12 col-md-6">
          <GInputText
            :model-value="localFields.jumlahTanggungan"
            label="Jumlah Tanggungan (Opsional)"
            placeholder="Masukkan jumlah tanggungan"
            type="number"
            :disabled="isFullDisabled"
            @update:model-value="(val: string) => { localFields.jumlahTanggungan = val; syncUpstream(); }"
          />
        </div>

        <!-- Row 4: Nomor Telepon (Opsional) & Nomor Handphone -->
        <div class="col-12 col-md-6">
          <GInputText
            :model-value="localFields.nomorTelepon"
            label="Nomor Telepon (Opsional)"
            placeholder="Masukkan nomor telepon"
            type="number"
            :disabled="isFullDisabled"
            @update:model-value="(val: string) => { localFields.nomorTelepon = val; syncUpstream(); }"
          />
        </div>
        <div class="col-12 col-md-6">
          <GInputText
            :model-value="localFields.noHp"
            label="Nomor Handphone"
            placeholder="Masukkan nomor handphone"
            type="number"
            :disabled="isFullDisabled"
            required
            @update:model-value="(val: string) => { localFields.noHp = val; syncUpstream(); }"
          />
        </div>

        <!-- Row 5: Email (Opsional) & Nomor NPWP (Opsional) -->
        <div class="col-12 col-md-6">
          <GInputText
            :model-value="localFields.email"
            label="Email (Opsional)"
            placeholder="Masukkan email"
            type="email"
            :disabled="isFullDisabled"
            @update:model-value="(val: string) => { localFields.email = val; syncUpstream(); }"
          />
        </div>
        <div class="col-12 col-md-6">
          <GInputText
            :model-value="localFields.npwp"
            label="Nomor NPWP (Opsional)"
            placeholder="Masukkan nomor npwp"
            :disabled="isFullDisabled"
            @update:model-value="(val: string) => { localFields.npwp = val; syncUpstream(); }"
          />
        </div>

        <!-- Row 6: Kewarganegaraan & Tipe Kependudukan -->
        <div class="col-12 col-md-6">
          <GDropdown
            :model-value="localFields.kewarganegaraan"
            label="Kewarganegaraan"
            placeholder="Pilih kewarganegaraan"
            :items="kewarganegaraanOptions"
            item-value="value"
            item-text="label"
            :disabled="isFullDisabled || localFields.jenisIdentitas === 'ktp'"
            :use-bottom-sheet="isMobile"
            @update:model-value="(val: any) => { localFields.kewarganegaraan = val; syncUpstream(); }"
          />
        </div>
        <div class="col-12 col-md-6">
          <GDropdown
            :model-value="localFields.tipeKependudukan"
            label="Tipe Kependudukan"
            placeholder="Pilih tipe kependudukan"
            :items="tipeKependudukanOptions"
            item-value="value"
            item-text="label"
            :disabled="isFullDisabled"
            :use-bottom-sheet="isMobile"
            @update:model-value="(val: any) => { localFields.tipeKependudukan = val; syncUpstream(); }"
          />
        </div>

        <!-- Row 7: Sumber Dana & Pekerjaan Terkini -->
        <div class="col-12 col-md-6">
          <GDropdown
            :model-value="localFields.sumberDana"
            label="Sumber Dana"
            placeholder="Pilih sumber dana"
            :items="sumberDanaOptions"
            item-value="value"
            item-text="label"
            :disabled="isFullDisabled"
            :use-bottom-sheet="isMobile"
            @update:model-value="(val: any) => { localFields.sumberDana = val; syncUpstream(); }"
          />
        </div>
        <div class="col-12 col-md-6">
          <GDropdown
            :model-value="localFields.pekerjaan"
            label="Pekerjaan Terkini"
            placeholder="Pilih pekerjaan"
            :items="pekerjaanOptions"
            item-value="value"
            item-text="label"
            :disabled="isFullDisabled"
            :use-bottom-sheet="isMobile"
            @update:model-value="(val: any) => { localFields.pekerjaan = val; syncUpstream(); }"
          />
        </div>

        <!-- Row 8: Agama & Rata - Rata Penghasilan -->
        <div class="col-12 col-md-6">
          <GDropdown
            :model-value="localFields.agama"
            label="Agama"
            placeholder="Pilih agama"
            :items="agamaOptions"
            item-value="value"
            item-text="label"
            :disabled="isFullDisabled"
            :use-bottom-sheet="isMobile"
            @update:model-value="(val: any) => { localFields.agama = val; syncUpstream(); }"
          />
        </div>
        <div class="col-12 col-md-6">
          <GInputNominalStart
            :model-value="localFields.rataPenghasilan"
            label="Rata - Rata Penghasilan"
            unit="Rp"
            :disabled="isFullDisabled"
            @update:model-value="(val: string) => { localFields.rataPenghasilan = val; syncUpstream(); }"
          />
        </div>

        <!-- Row 9: Nama Instansi / Perusahaan (Opsional) -->
        <div class="col-12 col-md-6">
          <GInputText
            :model-value="localFields.namaInstansi"
            label="Nama Instansi / Perusahaan (Opsional)"
            placeholder="Contoh: PT Megah Mandiri"
            :disabled="isFullDisabled"
            @update:model-value="(val: string) => { localFields.namaInstansi = val; syncUpstream(); }"
          />
        </div>
      </div>
    </ModuleSectionCard>

    <!-- Modal Validasi Dukcapil (Figma Node 11347:166766 & User Screenshot 2) -->
    <ValidasiDukcapilModal
      v-model="isDukcapilModalOpen"
      :input-data="{
        nik: localFields.nik || '',
        nama: localFields.nama || '',
        tempatLahir: localFields.tempatLahir || '',
        tanggalLahir: normalizeDateToIso(localFields.tanggalLahir) || '',
        jenisKelamin: localFields.jenisKelamin || 'Perempuan',
        namaIbuKandung: localFields.namaIbuKandung || '',
        agama: localFields.agama || '',
        pekerjaan: localFields.pekerjaan || '',
        alamat: localFields.alamat || '',
        rt: localFields.rt || '',
        rw: localFields.rw || '',
        provinsi: localFields.provinsi || '',
        kotaKab: localFields.kotaKab || '',
        kecamatan: localFields.kecamatan || '',
        kelurahan: localFields.kelurahan || '',
      }"
      :is-mobile="isMobile"
      @confirm="handleConfirmDukcapilSync"
    />
  </div>
</template>

<style lang="scss" scoped>
.rahin-detail-sections-container {
  display: flex;
  flex-direction: column;
  width: 100%;

  :deep(.module-section-card) {
    border: none;
    border-radius: 0;
    margin-bottom: 0;

    + .module-section-card {
      border-top: 8px solid var(--g-kit-black-20, #eeeeef);
    }
  }

  .identity-confirm-box {
    background-color: var(--g-kit-blue-10, #e8f4fd);
    border: 1px solid var(--g-kit-blue-20, #bfe1f8);
  }

  :deep(.btn.gkit-dd:disabled),
  :deep(.btn.gkit-dd.disabled),
  :deep(button.gkit-dd:disabled),
  :deep(.gkit-dd button:disabled),
  :deep(.group-input:has(button:disabled) .btn.gkit-dd) {
    background-color: var(--g-kit-black-20, #eeeeef) !important;
    border-color: var(--g-kit-black-20, #eeeeef) !important;
    color: var(--g-kit-black-60, #58585b) !important;
    cursor: not-allowed !important;
    pointer-events: none !important;

    .dropdown-placeholder {
      color: var(--g-kit-black-60, #58585b) !important;
    }

    svg {
      color: var(--g-kit-black-40, #bbbdc0) !important;
    }
  }
}
</style>
