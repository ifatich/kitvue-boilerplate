<script setup lang="ts">
/**
 * @file InformasiRahnSection.vue
 * @description Card 1 Section of Step 1: Informasi Rahn (Transaksi dan Produk & Informasi Akad).
 * Conforms strictly to Pegadaian --g-kit-* design tokens and kitvue-plugin rules.
 */
import { computed } from 'vue'
import { GDropdown } from '@/components'
import ModuleSectionCard from '@/components/shared/card/ModuleSectionCard.vue'
import RahnReadonlyInfoGrid from '../shared/RahnReadonlyInfoGrid.vue'
import type { ReadonlyInfoItem } from '../shared/RahnReadonlyInfoGrid.vue'

export interface RahnFields {
  tujuanPengajuan: string
  tujuanTransaksi: string
  pekerjaanTerkini: string
  rubrikMarhun: string
  skemaTarif: string
  produk: string
  jangkaWaktu: string
}

type Option = { value: string; label: string }

const props = withDefaults(
  defineProps<{
    modelValue: RahnFields
    isMobile?: boolean
    isOpen?: boolean
  }>(),
  {
    isMobile: false,
    isOpen: true,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: RahnFields): void
  (e: 'update:isOpen', value: boolean): void
}>()

const localFields = computed({
  get: () => props.modelValue,
  set: (val: RahnFields) => emit('update:modelValue', val),
})

const localOpen = computed({
  get: () => props.isOpen,
  set: (val: boolean) => emit('update:isOpen', val),
})

const updateField = <K extends keyof RahnFields>(key: K, val: RahnFields[K]) => {
  const updated = { ...props.modelValue, [key]: val }
  if (key === 'tujuanPengajuan') {
    updated.tujuanTransaksi = ''
  }
  emit('update:modelValue', updated)
}

// Dropdown Options
const tujuanPengajuanOptions: Option[] = [
  { value: 'produktif', label: 'Produktif' },
  { value: 'konsumtif', label: 'Konsumtif' },
]

const tujuanTransaksiProduktif: Option[] = [
  { value: 'modal-kerja', label: 'Modal Kerja Usaha' },
  { value: 'investasi-usaha', label: 'Investasi Usaha' },
  { value: 'pengembangan-toko', label: 'Pengembangan Usaha Toko/Grosir' },
  { value: 'pengadaan-barang', label: 'Pengadaan Barang & Inventaris' },
]

const tujuanTransaksiKonsumtif: Option[] = [
  { value: 'kebutuhan-sehari-hari', label: 'Kebutuhan Sehari-hari' },
  { value: 'biaya-pendidikan', label: 'Biaya Pendidikan' },
  { value: 'renovasi-rumah', label: 'Renovasi Rumah' },
  { value: 'biaya-kesehatan', label: 'Biaya Kesehatan / Pengobatan' },
]

const allTujuanTransaksiOptions: Option[] = [
  ...tujuanTransaksiProduktif,
  ...tujuanTransaksiKonsumtif,
]

const currentTujuanTransaksiOptions = computed<Option[]>(() => {
  if (localFields.value.tujuanPengajuan === 'produktif') {
    return tujuanTransaksiProduktif
  }
  if (localFields.value.tujuanPengajuan === 'konsumtif') {
    return tujuanTransaksiKonsumtif
  }
  return allTujuanTransaksiOptions
})

const pekerjaanOptions: Option[] = [
  { value: 'pns', label: 'Pegawai Negeri Sipil (PNS)' },
  { value: 'tni-polri', label: 'TNI / POLRI' },
  { value: 'bumn', label: 'Pegawai BUMN / BUMD' },
  { value: 'swasta', label: 'Karyawan Swasta' },
  { value: 'wiraswasta', label: 'Wiraswasta / Pengusaha' },
  { value: 'profesional', label: 'Profesional (Dokter/Pengacara/Notaris)' },
  { value: 'petani-nelayan', label: 'Petani / Peternak / Nelayan' },
  { value: 'buruh', label: 'Buruh Harian Lepas' },
  { value: 'ibu-rumah-tangga', label: 'Ibu Rumah Tangga' },
  { value: 'mahasiswa', label: 'Pelajar / Mahasiswa' },
  { value: 'pensiunan', label: 'Pensiunan' },
  { value: 'lainnya', label: 'Lain-lain / Pekerjaan Lainnya' },
]

const rubrikMarhunOptions: Option[] = [
  { value: 'emas-perhiasan', label: 'Emas Perhiasan' },
  { value: 'emas-batangan', label: 'Emas Batangan / Logam Mulia' },
  { value: 'berlian', label: 'Berlian & Batu Mulia' },
  { value: 'elektronik', label: 'Elektronik & Gadget' },
  { value: 'kendaraan', label: 'Kendaraan Bermotor' },
]

const skemaTarifOptions: Option[] = [
  { value: 'reguler-standard', label: 'Reguler Standar' },
  { value: 'tarif-khusus', label: 'Tarif Khusus Promo' },
  { value: 'mitra-kerjasama', label: 'Mitra Kerjasama Strategis' },
]

const produkOptions: Option[] = [
  { value: 'rahn-reguler', label: 'Rahn Reguler' },
  { value: 'rahn-bisnis', label: 'Rahn Bisnis' },
  { value: 'rahn-fleksi', label: 'Rahn Fleksi' },
  { value: 'rahn-hasan', label: 'Rahn Hasan' },
  { value: 'rahn-umi', label: 'Rahn UMI' },
]

const jangkaWaktuOptions: Option[] = [
  { value: '120', label: '120 Hari (Standar Rahn Reguler)' },
  { value: '30', label: '30 Hari' },
  { value: '60', label: '60 Hari' },
  { value: '90', label: '90 Hari' },
]

function formatIndonesianDate(d: Date): string {
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ]
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

const akadItems = computed<ReadonlyInfoItem[]>(() => {
  if (!localFields.value.jangkaWaktu) {
    return [
      { label: 'Tanggal Akad', value: 'Terisi otomatis' },
      { label: 'Tanggal Jatuh Tempo', value: 'Terisi otomatis' },
      { label: 'Tanggal Lelang', value: 'Terisi otomatis' },
    ]
  }

  const days = parseInt(localFields.value.jangkaWaktu, 10) || 120
  const now = new Date()

  const jatuhTempo = new Date(now)
  jatuhTempo.setDate(jatuhTempo.getDate() + days)

  const lelang = new Date(now)
  lelang.setDate(lelang.getDate() + days + 20)

  return [
    { label: 'Tanggal Akad', value: formatIndonesianDate(now) },
    { label: 'Tanggal Jatuh Tempo', value: formatIndonesianDate(jatuhTempo) },
    { label: 'Tanggal Lelang', value: formatIndonesianDate(lelang) },
  ]
})
</script>

<template>
  <ModuleSectionCard title="Informasi Rahn" v-model="localOpen">
    <h3 class="informasi-rahn__subtitle">Transaksi dan Produk</h3>
    <div class="form-grid">
      <GDropdown
        :model-value="localFields.tujuanPengajuan"
        label="Tujuan Pengajuan"
        placeholder="Pilih tujuan pengajuan"
        :items="tujuanPengajuanOptions"
        item-value="value"
        item-text="label"
        :use-bottom-sheet="isMobile"
        @update:model-value="(val: any) => updateField('tujuanPengajuan', val)"
      />
      <GDropdown
        :model-value="localFields.tujuanTransaksi"
        label="Tujuan Transaksi"
        placeholder="Pilih tujuan transaksi"
        :items="currentTujuanTransaksiOptions"
        item-value="value"
        item-text="label"
        :use-bottom-sheet="isMobile"
        @update:model-value="(val: any) => updateField('tujuanTransaksi', val)"
      />
      <GDropdown
        :model-value="localFields.pekerjaanTerkini"
        label="Pekerjaan Terkini"
        placeholder="Pilih pekerjaan terkini"
        :items="pekerjaanOptions"
        item-value="value"
        item-text="label"
        :use-bottom-sheet="isMobile"
        @update:model-value="(val: any) => updateField('pekerjaanTerkini', val)"
      />
      <GDropdown
        :model-value="localFields.rubrikMarhun"
        label="Rubrik Marhun"
        placeholder="Pilih rubrik marhun"
        :items="rubrikMarhunOptions"
        item-value="value"
        item-text="label"
        :use-bottom-sheet="isMobile"
        @update:model-value="(val: any) => updateField('rubrikMarhun', val)"
      />
      <GDropdown
        :model-value="localFields.skemaTarif"
        label="Skema Tarif"
        placeholder="Pilih skema tarif"
        :items="skemaTarifOptions"
        item-value="value"
        item-text="label"
        :use-bottom-sheet="isMobile"
        @update:model-value="(val: any) => updateField('skemaTarif', val)"
      />
      <GDropdown
        :model-value="localFields.produk"
        label="Produk"
        placeholder="Pilih produk"
        :items="produkOptions"
        item-value="value"
        item-text="label"
        :use-bottom-sheet="isMobile"
        @update:model-value="(val: any) => updateField('produk', val)"
      />
      <GDropdown
        :model-value="localFields.jangkaWaktu"
        label="Jangka Waktu"
        placeholder="Pilih jangka waktu"
        :items="jangkaWaktuOptions"
        item-value="value"
        item-text="label"
        :use-bottom-sheet="isMobile"
        @update:model-value="(val: any) => updateField('jangkaWaktu', val)"
      />
    </div>

    <div class="section-divider" />

    <!-- Informasi Akad (Readonly Dynamic Grid - 1:1 with Figma) -->
    <RahnReadonlyInfoGrid
      title="Informasi Akad"
      :items="akadItems"
    />
  </ModuleSectionCard>
</template>

<style scoped lang="scss">
.informasi-rahn__subtitle {
  margin: 0 0 16px;
  color: var(--g-kit-black-80, #252528);
  font-family: 'Nunito Sans', sans-serif;
  font-size: var(--g-kit-font-size-omicron, 16px);
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: var(--g-kit-line-height-omicron, 24px);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 24px;
  row-gap: 16px;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
}

.section-divider {
  height: 1px;
  margin: 24px 0;
  background: var(--g-kit-black-20, #eeeeef);
}
</style>

