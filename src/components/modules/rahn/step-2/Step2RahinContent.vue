<script setup lang="ts">
/**
 * @file Step2RahinContent.vue
 * @description SPRINT Module Section Orchestrator for Step 2: Data Rahin.
 * Coordinates:
 * 1. Initial Search View (subView === 'search'):
 *    - Informasi Rahin search (Figma Node 11347:160520)
 *    - 5-year Portfolio table (Figma Node 11790:130756)
 *    - 14-column CIF selection table (Figma Node 11347:160879)
 * 2. Detail Data Rahin View (subView === 'detail'):
 *    - 5 ModuleSectionCards mirroring Beneficial Owner (Figma Node 11347:165167)
 *    - Data Pelaksana Transaksi (Figma Node 11347:172827 KTP & 11347:170073 Paspor)
 * Strictly adheres to Pegadaian --g-kit-* design tokens and kitvue-plugin rules (Zero Tailwind CSS).
 */
import { ref, watch } from 'vue'
import {
  GAlert,
} from '@/components'
import type { BeneficialOwnerState } from '../step-1/BeneficialOwnerSection.vue'
import {
  type DukcapilStatus,
  type RahinCifItem,
  type Step2State,
  MOCK_RAHIN_CIF_DATABASE,
  convertKonvenToSyariahCif,
  createInitialStep2State,
  findRahinCifById,
  normalizeDateToIso,
  searchRahinCif,
} from '../mockRahinData'
import type { UsecaseAction } from '@/router/rahnRouting'
import RahinSearchSection from './RahinSearchSection.vue'
import RahinPortfolioTableSection from './RahinPortfolioTableSection.vue'
import RahinCifTableSection from './RahinCifTableSection.vue'
import PelaksanaTransaksiSection from './PelaksanaTransaksiSection.vue'
import RahinDetailSection from './RahinDetailSection.vue'
import RahinSaveSuccessModal from './modals/RahinSaveSuccessModal.vue'
import RahinNotFoundModal from './modals/RahinNotFoundModal.vue'

export interface RahinFields {
  tipeRahin?: string
  nik: string
  nama: string
  noHp: string
  pekerjaan: string
  nominal: string
  alamat: string
  hubungan: string
  cif?: string
  statusRahin?: 'syariah' | 'konvensional'
  ratingRahin?: string
  dukcapilStatus?: DukcapilStatus | string
  jenisIdentitas?: string
  masaBerlaku?: string
  tempatLahir?: string
  tanggalLahir?: string
  namaIbuKandung?: string
  jenisKelamin?: string
  agama?: string
  statusPerkawinan?: string
  cabangPembuka?: string

  // Alamat Identitas
  rt?: string
  rw?: string
  kodePos?: string
  provinsi?: string
  kotaKab?: string
  kecamatan?: string
  kelurahan?: string
  isDataSesuaiIdentitas?: boolean

  // Alamat Domisili
  isAlamatDomisiliSama?: boolean
  domAlamat?: string
  domRt?: string
  domRw?: string
  domKodePos?: string
  domProvinsi?: string
  domKotaKab?: string
  domKecamatan?: string
  domKelurahan?: string

  // Data Pekerjaan & Finansial
  namaInstansi?: string
  rataPenghasilan?: string
  npwp?: string
  email?: string
  pendidikan?: string
  namaPasangan?: string
  tanggalLahirPasangan?: string
  jumlahTanggungan?: string
  nomorTelepon?: string
  kewarganegaraan?: string
  tipeKependudukan?: string
  sumberDana?: string
}

const props = withDefaults(
  defineProps<{
    isMobile?: boolean
    boState?: BeneficialOwnerState
    fields?: RahinFields
    modelValue?: RahinFields
    subView?: 'search' | 'detail'
    action?: UsecaseAction
    recordId?: string
  }>(),
  {
    isMobile: false,
    subView: 'search',
    action: undefined,
    recordId: undefined,
    modelValue: () => ({
      nik: '',
      nama: '',
      noHp: '',
      pekerjaan: '',
      nominal: '',
      alamat: '',
      hubungan: 'diri-sendiri',
    }),
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: RahinFields): void
  (e: 'update:fields', val: RahinFields): void
  (e: 'update:subView', val: 'search' | 'detail'): void
  (e: 'update:boState', val: BeneficialOwnerState): void
  (e: 'update:action', action: UsecaseAction, recordId?: string): void
  (e: 'clear-validation'): void
  (e: 'advance'): void
  (e: 'back'): void
}>()

const subView = ref<'search' | 'detail'>(props.subView || 'search')

watch(
  () => props.subView,
  (val) => {
    if (val) subView.value = val
  },
)

watch(subView, (val) => {
  emit('update:subView', val)
})

// Internal reactive fields model
const fieldsModel = ref<RahinFields>({
  tipeRahin: props.fields?.tipeRahin || props.modelValue?.tipeRahin || 'perorangan',
  nik: props.fields?.nik || props.modelValue?.nik || '',
  nama: props.fields?.nama || props.modelValue?.nama || '',
  noHp: props.fields?.noHp || props.modelValue?.noHp || '',
  pekerjaan: props.fields?.pekerjaan || props.modelValue?.pekerjaan || 'Pegawai Swasta',
  nominal: props.fields?.nominal || props.modelValue?.nominal || '',
  alamat: props.fields?.alamat || props.modelValue?.alamat || '',
  hubungan: props.fields?.hubungan || props.modelValue?.hubungan || 'diri-sendiri',
  cif: props.fields?.cif || props.modelValue?.cif || '',
  statusRahin: props.fields?.statusRahin || props.modelValue?.statusRahin,
  ratingRahin: props.fields?.ratingRahin || props.modelValue?.ratingRahin,
  dukcapilStatus: props.fields?.dukcapilStatus || props.modelValue?.dukcapilStatus || 'belum_cek',
  jenisIdentitas: props.fields?.jenisIdentitas || props.modelValue?.jenisIdentitas || 'ktp',
  tempatLahir: props.fields?.tempatLahir || props.modelValue?.tempatLahir || 'Jakarta',
  tanggalLahir: props.fields?.tanggalLahir || props.modelValue?.tanggalLahir || '1990-01-01',
  namaIbuKandung: props.fields?.namaIbuKandung || props.modelValue?.namaIbuKandung || '',
  jenisKelamin: props.fields?.jenisKelamin || props.modelValue?.jenisKelamin || 'Perempuan',
  agama: props.fields?.agama || props.modelValue?.agama || 'Islam',
  statusPerkawinan: props.fields?.statusPerkawinan || props.modelValue?.statusPerkawinan || 'Menikah',
  cabangPembuka: props.fields?.cabangPembuka || props.modelValue?.cabangPembuka || 'Cabang Boulevard',

  // Alamat Identitas
  rt: props.fields?.rt || props.modelValue?.rt || '001',
  rw: props.fields?.rw || props.modelValue?.rw || '002',
  kodePos: props.fields?.kodePos || props.modelValue?.kodePos || '10320',
  provinsi: props.fields?.provinsi || props.modelValue?.provinsi || 'DKI Jakarta',
  kotaKab: props.fields?.kotaKab || props.modelValue?.kotaKab || 'Kota Jakarta Pusat',
  kecamatan: props.fields?.kecamatan || props.modelValue?.kecamatan || 'Menteng',
  kelurahan: props.fields?.kelurahan || props.modelValue?.kelurahan || 'Pegangsaan',
  isDataSesuaiIdentitas: props.fields?.isDataSesuaiIdentitas ?? props.modelValue?.isDataSesuaiIdentitas ?? true,

  // Alamat Domisili
  isAlamatDomisiliSama: props.fields?.isAlamatDomisiliSama ?? props.modelValue?.isAlamatDomisiliSama ?? true,
  domAlamat: props.fields?.domAlamat || props.modelValue?.domAlamat || props.fields?.alamat || props.modelValue?.alamat || '',
  domRt: props.fields?.domRt || props.modelValue?.domRt || '001',
  domRw: props.fields?.domRw || props.modelValue?.domRw || '002',
  domKodePos: props.fields?.domKodePos || props.modelValue?.domKodePos || '10320',
  domProvinsi: props.fields?.domProvinsi || props.modelValue?.domProvinsi || 'DKI Jakarta',
  domKotaKab: props.fields?.domKotaKab || props.modelValue?.domKotaKab || 'Kota Jakarta Pusat',
  domKecamatan: props.fields?.domKecamatan || props.modelValue?.domKecamatan || 'Menteng',
  domKelurahan: props.fields?.domKelurahan || props.modelValue?.domKelurahan || 'Pegangsaan',

  // Finansial
  namaInstansi: props.fields?.namaInstansi || props.modelValue?.namaInstansi || 'PT Megah Mandiri',
  rataPenghasilan: props.fields?.rataPenghasilan || props.modelValue?.rataPenghasilan || '15000000',
  npwp: props.fields?.npwp || props.modelValue?.npwp || '09.254.341.2-015.000',
  email: props.fields?.email || props.modelValue?.email || 'anastasya.delistya@email.com',
  pendidikan: props.fields?.pendidikan || props.modelValue?.pendidikan || 'S1',
  namaPasangan: props.fields?.namaPasangan || props.modelValue?.namaPasangan || 'Putra',
  tanggalLahirPasangan: props.fields?.tanggalLahirPasangan || props.modelValue?.tanggalLahirPasangan || '1992-05-15',
  jumlahTanggungan: props.fields?.jumlahTanggungan || props.modelValue?.jumlahTanggungan || '0',
  nomorTelepon: props.fields?.nomorTelepon || props.modelValue?.nomorTelepon || '',
  kewarganegaraan: props.fields?.kewarganegaraan || props.modelValue?.kewarganegaraan || 'WNI',
  tipeKependudukan: props.fields?.tipeKependudukan || props.modelValue?.tipeKependudukan || 'Penduduk',
  sumberDana: props.fields?.sumberDana || props.modelValue?.sumberDana || 'Gaji',
})

// Sync internal model changes upstream
const syncUpstream = () => {
  emit('update:modelValue', { ...fieldsModel.value })
  emit('update:fields', { ...fieldsModel.value })
}

// Collapsible Card states
const isSearchOpen = ref(true)
const isPortfolioOpen = ref(true)
const isCifOpen = ref(true)
const isDetailOpen = ref(true)
const isPelaksanaOpen = ref(true)

// Central Step 2 State Machine
const step2State = ref<Step2State>(createInitialStep2State())
const hasSearched = ref(false)
const notFoundQuery = ref('')

const scrollToTop = () => {
  if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Success Modal & Not Found Modal state
const isSuccessModalOpen = ref(false)
const isConvertModalOpen = ref(false)
const targetKonvenCif = ref<RahinCifItem | null>(null)
const conversionSuccessMessage = ref<string | null>(null)
const isNotFoundModalOpen = ref(false)

const handleContinueToStep3 = () => {
  isSuccessModalOpen.value = false
  emit('advance')
}

// Pelaksana Transaksi Activation (inherited from boState or manually toggled)
const isPelaksanaActive = ref(props.boState?.type === 'orang_lain')

watch(
  () => props.boState,
  (newBo) => {
    if (newBo?.type === 'orang_lain') {
      isPelaksanaActive.value = true
      step2State.value.pelaksana.isActive = true

      // Pre-populate Pelaksana Transaksi from boState
      if (newBo.selectedBO) {
        if (newBo.selectedBO.name) {
          step2State.value.pelaksana.namaLengkap = newBo.selectedBO.name
        }
        if (newBo.relationship) {
          step2State.value.pelaksana.hubunganDenganRahin = newBo.relationship
        }
      }
      if (newBo.identityType === 'paspor') {
        step2State.value.pelaksana.identityType = 'paspor'
        if (newBo.identityNumber) {
          step2State.value.pelaksana.nomorPaspor = newBo.identityNumber
        }
        step2State.value.pelaksana.kewarganegaraan = 'WNI'
      } else if (newBo.identityType === 'ktp' || newBo.identityNumber) {
        step2State.value.pelaksana.identityType = 'ktp'
        if (newBo.identityNumber) {
          step2State.value.pelaksana.nik = newBo.identityNumber
        }
        step2State.value.pelaksana.kewarganegaraan = 'WNI'
      }
    }
  },
  { immediate: true, deep: true },
)

// Loading & Search state
const isSearching = ref(false)

// Execute Search from RahinSearchSection (with "Memproses Data CIF" modal/indicator)
const handleSearch = () => {
  conversionSuccessMessage.value = null
  const { tipeRahin, jenisIdentitas, nomorIdentitas } = step2State.value.search

  const execute = () => {
    isSearching.value = false
    const result = searchRahinCif(tipeRahin, jenisIdentitas, nomorIdentitas)

    step2State.value.cifList = result.cifList
    step2State.value.portfolioList = result.portfolioList
    hasSearched.value = true

    if (result.cifList.length === 0) {
      step2State.value.selectedCifId = null
      step2State.value.currentView = 'search'
      notFoundQuery.value = nomorIdentitas
      isNotFoundModalOpen.value = true
      scrollToTop()
      return
    }

    // Pre-select Row 1 by default if Anastasya Delistya searched
    if (result.cifList.length > 0) {
      step2State.value.selectedCifId = result.cifList[0].id
      populateFieldsFromCif(result.cifList[0])
    }
  }

  isSearching.value = true
  if (typeof window !== 'undefined' && import.meta.env?.MODE !== 'test') {
    setTimeout(execute, 300)
  } else {
    execute()
  }
}

// Case 1: Open Konvensional to Syariah Conversion Modal Popup
const handleConvertCif = (item: RahinCifItem) => {
  targetKonvenCif.value = item
  isConvertModalOpen.value = true
}

const handleCancelNotFound = () => {
  isNotFoundModalOpen.value = false
}

// Case 1: Confirm Conversion
const handleConfirmConvert = (convertedCif: RahinCifItem) => {
  const exists = step2State.value.cifList.some((c) => c.id === convertedCif.id)
  if (!exists) {
    step2State.value.cifList.unshift(convertedCif)
  }

  isConvertModalOpen.value = false
  step2State.value.selectedCifId = convertedCif.id
  populateFieldsFromCif(convertedCif)
  conversionSuccessMessage.value = `CIF Syariah (${convertedCif.nomorCif}) berhasil diterbitkan dari data Konvensional.`
  emit('clear-validation')
  subView.value = 'detail'
  step2State.value.currentView = 'detail_syariah'
  scrollToTop()
}

// Case 3: Transition to Tambah Rahin Baru
const handleTambahRahinBaru = () => {
  isNotFoundModalOpen.value = false
  step2State.value.selectedCifId = null
  step2State.value.currentView = 'tambah_baru'
  detailSelectionMode.value = 'tambah'

  const searchId = step2State.value.search.nomorIdentitas || notFoundQuery.value
  fieldsModel.value.nik = searchId
  fieldsModel.value.jenisIdentitas = step2State.value.search.jenisIdentitas || 'ktp'
  fieldsModel.value.tipeRahin = 'Perorangan'
  fieldsModel.value.nama = ''
  fieldsModel.value.alamat = ''
  fieldsModel.value.noHp = ''
  fieldsModel.value.pekerjaan = ''
  fieldsModel.value.nominal = ''
  fieldsModel.value.cif = ''
  fieldsModel.value.statusRahin = 'syariah'
  fieldsModel.value.ratingRahin = ''
  fieldsModel.value.dukcapilStatus = 'belum_cek'
  fieldsModel.value.tempatLahir = ''
  fieldsModel.value.tanggalLahir = ''
  fieldsModel.value.namaIbuKandung = ''
  fieldsModel.value.jenisKelamin = ''
  fieldsModel.value.agama = ''
  fieldsModel.value.statusPerkawinan = ''
  fieldsModel.value.cabangPembuka = ''

  // Alamat Identitas empty placeholders
  fieldsModel.value.rt = ''
  fieldsModel.value.rw = ''
  fieldsModel.value.kodePos = ''
  fieldsModel.value.provinsi = ''
  fieldsModel.value.kotaKab = ''
  fieldsModel.value.kecamatan = ''
  fieldsModel.value.kelurahan = ''
  fieldsModel.value.isDataSesuaiIdentitas = false

  // Alamat Domisili empty placeholders
  fieldsModel.value.isAlamatDomisiliSama = false
  fieldsModel.value.domAlamat = ''
  fieldsModel.value.domRt = ''
  fieldsModel.value.domRw = ''
  fieldsModel.value.domKodePos = ''
  fieldsModel.value.domProvinsi = ''
  fieldsModel.value.domKotaKab = ''
  fieldsModel.value.domKecamatan = ''
  fieldsModel.value.domKelurahan = ''

  // Finansial empty placeholders
  fieldsModel.value.namaInstansi = ''
  fieldsModel.value.rataPenghasilan = ''
  fieldsModel.value.npwp = ''
  fieldsModel.value.email = ''
  fieldsModel.value.pendidikan = ''
  fieldsModel.value.namaPasangan = ''
  fieldsModel.value.tanggalLahirPasangan = ''
  fieldsModel.value.jumlahTanggungan = ''
  fieldsModel.value.nomorTelepon = ''
  fieldsModel.value.kewarganegaraan = 'WNI'
  fieldsModel.value.tipeKependudukan = 'Penduduk'
  fieldsModel.value.sumberDana = ''

  step2State.value.warningAlertMessage = null
  emit('clear-validation')
  syncUpstream()
  subView.value = 'detail'
  if (props.action !== 'create') {
    emit('update:action', 'create')
  }
  scrollToTop()
}

const populateFieldsFromCif = (cif: RahinCifItem) => {
  fieldsModel.value.nik = cif.rawIdentitas
  fieldsModel.value.nama = cif.namaRahin
  fieldsModel.value.noHp = cif.noHp
  fieldsModel.value.alamat = cif.alamatRumah
  fieldsModel.value.cif = cif.nomorCif
  fieldsModel.value.statusRahin = cif.statusRahin
  fieldsModel.value.ratingRahin = cif.ratingRahin
  fieldsModel.value.dukcapilStatus = cif.verifikasiDukcapil
  fieldsModel.value.jenisIdentitas = cif.jenisIdentitas
  fieldsModel.value.tanggalLahir = normalizeDateToIso(cif.tanggalLahir) || cif.tanggalLahir
  fieldsModel.value.namaIbuKandung = cif.namaIbuKandung
  fieldsModel.value.jenisKelamin = cif.jenisKelamin
  fieldsModel.value.cabangPembuka = cif.cabangPembuka

  if (cif.alamatRumah.includes('10430')) {
    fieldsModel.value.kodePos = '10430'
    fieldsModel.value.provinsi = 'DKI Jakarta'
    fieldsModel.value.kotaKab = 'Kota Jakarta Pusat'
    fieldsModel.value.kecamatan = 'Senen'
    fieldsModel.value.kelurahan = 'Kenari'
  } else if (cif.alamatRumah.includes('10450')) {
    fieldsModel.value.kodePos = '10450'
    fieldsModel.value.provinsi = 'DKI Jakarta'
    fieldsModel.value.kotaKab = 'Kota Jakarta Pusat'
    fieldsModel.value.kecamatan = 'Senen'
    fieldsModel.value.kelurahan = 'Kramat'
  } else if (cif.alamatRumah.includes('12190')) {
    fieldsModel.value.kodePos = '12190'
    fieldsModel.value.provinsi = 'DKI Jakarta'
    fieldsModel.value.kotaKab = 'Kota Jakarta Selatan'
    fieldsModel.value.kecamatan = 'Kebayoran Baru'
    fieldsModel.value.kelurahan = 'Senayan'
  } else {
    fieldsModel.value.kodePos = '10320'
    fieldsModel.value.provinsi = 'DKI Jakarta'
    fieldsModel.value.kotaKab = 'Kota Jakarta Pusat'
    fieldsModel.value.kecamatan = 'Menteng'
    fieldsModel.value.kelurahan = 'Pegangsaan'
  }

  if (fieldsModel.value.isAlamatDomisiliSama) {
    fieldsModel.value.domAlamat = fieldsModel.value.alamat
    fieldsModel.value.domKodePos = fieldsModel.value.kodePos
    fieldsModel.value.domProvinsi = fieldsModel.value.provinsi
    fieldsModel.value.domKotaKab = fieldsModel.value.kotaKab
    fieldsModel.value.domKecamatan = fieldsModel.value.kecamatan
    fieldsModel.value.domKelurahan = fieldsModel.value.kelurahan
  }
  syncUpstream()
}

// Detail selection mode ('terpilih' = Full Disable | 'pilih' = Mixed with enabled placeholders | 'tambah' = All enabled per Figma 11347:176830)
const detailSelectionMode = ref<'terpilih' | 'pilih' | 'tambah'>('terpilih')

// Handle CIF Row Selection
const handleSelectCif = (cif: RahinCifItem, mode: 'terpilih' | 'pilih' = 'pilih') => {
  detailSelectionMode.value = mode
  step2State.value.selectedCifId = cif.id

  if (mode === 'terpilih') {
    populateFieldsFromCif(cif)
    // Full disable mode: populated fields
    fieldsModel.value.isAlamatDomisiliSama = true
    fieldsModel.value.pekerjaan = 'Pegawai Swasta'
    fieldsModel.value.pendidikan = 'S1'
    fieldsModel.value.statusPerkawinan = 'Menikah'
    fieldsModel.value.namaPasangan = 'Putra'
    fieldsModel.value.tanggalLahirPasangan = '1992-05-15'
    fieldsModel.value.jumlahTanggungan = '0'
    fieldsModel.value.nomorTelepon = '021 123456'
    fieldsModel.value.email = 'anastasya.delistya@email.com'
    fieldsModel.value.npwp = '09.254.341.2-015.000'
    fieldsModel.value.kewarganegaraan = 'WNI'
    fieldsModel.value.tipeKependudukan = 'Penduduk'
    fieldsModel.value.sumberDana = 'Gaji'
    fieldsModel.value.rataPenghasilan = '15000000'
    fieldsModel.value.namaInstansi = 'PT Megah Mandiri'
  } else {
    // mode === 'pilih' (Figma Node 11347:176071)
    // 1. Identity fields from CIF (Nama, NIK, Tempat/Tgl Lahir, Ibu Kandung, KTP Address, Cabang Pembuka)
    populateFieldsFromCif(cif)
    // 2. Clear domicile fields and uncheck same-address checkbox
    fieldsModel.value.isAlamatDomisiliSama = false
    fieldsModel.value.domAlamat = ''
    fieldsModel.value.domRt = ''
    fieldsModel.value.domRw = ''
    fieldsModel.value.domKodePos = ''
    fieldsModel.value.domProvinsi = ''
    fieldsModel.value.domKotaKab = ''
    fieldsModel.value.domKecamatan = ''
    fieldsModel.value.domKelurahan = ''
    // 3. Clear Section 5 fields so they display their placeholders and are enabled
    fieldsModel.value.jenisKelamin = ''
    fieldsModel.value.pendidikan = ''
    fieldsModel.value.statusPerkawinan = ''
    fieldsModel.value.namaPasangan = ''
    fieldsModel.value.tanggalLahirPasangan = ''
    fieldsModel.value.jumlahTanggungan = ''
    fieldsModel.value.nomorTelepon = ''
    fieldsModel.value.noHp = ''
    fieldsModel.value.email = ''
    fieldsModel.value.npwp = ''
    fieldsModel.value.kewarganegaraan = ''
    fieldsModel.value.tipeKependudukan = ''
    fieldsModel.value.sumberDana = ''
    fieldsModel.value.pekerjaan = ''
    fieldsModel.value.agama = ''
    fieldsModel.value.rataPenghasilan = ''
    fieldsModel.value.namaInstansi = ''
  }

  emit('clear-validation')
  syncUpstream()

  // Navigate directly to detail page (1:1 with Step 1 Beneficial Owner behavior)
  subView.value = 'detail'
  step2State.value.currentView = 'detail_syariah'
  const targetAction: UsecaseAction = mode === 'terpilih' ? 'preview' : 'update'
  if (props.action !== targetAction || props.recordId !== cif.id) {
    emit('update:action', targetAction, cif.id)
  }
  scrollToTop()
}

// Usecase Action State Synchronization (Requirement R1 & R2)
const applyAction = (action?: UsecaseAction, recordId?: string) => {
  if (!action) return
  if (action === 'entry') {
    subView.value = 'search'
    step2State.value.currentView = 'search'
  } else if (action === 'preview') {
    const idToLookup = recordId || props.recordId || step2State.value.selectedCifId || undefined
    const cif = findRahinCifById(idToLookup) || (MOCK_RAHIN_CIF_DATABASE.length > 0 ? MOCK_RAHIN_CIF_DATABASE[0] : undefined)
    if (cif) {
      handleSelectCif(cif, 'terpilih')
    } else {
      detailSelectionMode.value = 'terpilih'
      subView.value = 'detail'
      step2State.value.currentView = 'detail_syariah'
    }
  } else if (action === 'update') {
    const idToLookup = recordId || props.recordId || step2State.value.selectedCifId || undefined
    const cif = findRahinCifById(idToLookup) || (MOCK_RAHIN_CIF_DATABASE.length > 0 ? MOCK_RAHIN_CIF_DATABASE[0] : undefined)
    if (cif) {
      handleSelectCif(cif, 'pilih')
    } else {
      detailSelectionMode.value = 'pilih'
      subView.value = 'detail'
      step2State.value.currentView = 'detail_syariah'
    }
  } else if (action === 'create') {
    handleTambahRahinBaru()
  }
}

watch(
  () => [props.action, props.recordId] as const,
  ([newAction, newId]) => {
    if (newAction) {
      applyAction(newAction, newId)
    }
  },
  { immediate: true },
)

watch(subView, (newView) => {
  if (newView === 'search' && props.action && props.action !== 'entry') {
    emit('update:action', 'entry')
  } else if (newView === 'detail' && props.action && props.action === 'entry') {
    const act: UsecaseAction = detailSelectionMode.value === 'tambah'
      ? 'create'
      : (detailSelectionMode.value === 'terpilih' ? 'preview' : 'update')
    emit('update:action', act, step2State.value.selectedCifId || undefined)
  }
})

// Handle Search Form Reset
const handleResetSearch = () => {
  hasSearched.value = false
  conversionSuccessMessage.value = null
  step2State.value.selectedCifId = null
  step2State.value.cifList = []
  step2State.value.portfolioList = []
  step2State.value.currentView = 'search'
  step2State.value.warningAlertMessage = null
  notFoundQuery.value = ''
  emit('clear-validation')
  if (props.action !== 'entry') {
    emit('update:action', 'entry')
  }
}

// Navigation Handlers exposed to parent PengajuanRahnView
const handleNext = (): { valid: boolean; handled?: boolean; message?: string } => {
  const isDetail =
    subView.value === 'detail' ||
    step2State.value.currentView === 'detail_syariah' ||
    step2State.value.currentView === 'tambah_baru'

  if (!isDetail) {
    if (!step2State.value.selectedCifId) {
      const msg = 'Pilih salah satu data CIF syariah untuk dilanjutkan ke detail data Rahin'
      step2State.value.warningAlertMessage = msg
      return { valid: false, message: msg }
    }

    const selected = step2State.value.cifList.find((c) => c.id === step2State.value.selectedCifId)
    if (selected) {
      detailSelectionMode.value = 'terpilih'
      populateFieldsFromCif(selected)
      subView.value = 'detail'
      step2State.value.currentView = 'detail_syariah'
      scrollToTop()
      return { valid: true, handled: true }
    }
  }

  if (isDetail) {
    if (!fieldsModel.value.nik || !fieldsModel.value.nama) {
      return { valid: false, message: 'Mohon lengkapi data identitas Rahin.' }
    }

    // Validate Pelaksana Transaksi if active
    if (isPelaksanaActive.value) {
      const p = step2State.value.pelaksana
      const idNumber = p.identityType === 'ktp' ? p.nik : p.nomorPaspor
      if (!p.namaLengkap || !idNumber) {
        return {
          valid: false,
          message: 'Mohon lengkapi data pelaksana transaksi (Nama dan Nomor Identitas wajib diisi).',
        }
      }
    }

    // Trigger Success Modal before advancing to Step 3 (Figma Node 11752:118844)
    isSuccessModalOpen.value = true
    return { valid: true, handled: true }
  }

  return { valid: true }
}

const handlePrev = (): boolean => {
  isSuccessModalOpen.value = false
  if (subView.value === 'detail') {
    subView.value = 'search'
    step2State.value.currentView = 'cif_table'
    isNotFoundModalOpen.value = false
    if (props.action !== 'entry') {
      emit('update:action', 'entry')
    }
    scrollToTop()
    return false // Internal navigation handled, stay in Step 2
  }
  return true // Exit Step 2 to Step 1
}

defineExpose({
  handleNext,
  handlePrev,
  subView,
  detailSelectionMode,
  step2State,
  fieldsModel,
  isPelaksanaActive,
  isSuccessModalOpen,
  handleContinueToStep3,
  handleSearch,
  handleSelectCif,
  handleConvertCif,
  handleConfirmConvert,
  handleTambahRahinBaru,
  isNotFoundModalOpen,
  convertKonvenToSyariahCif,
})
</script>

<template>
  <div class="step2-rahin-content">
    <!-- Case 1: Conversion Success Notice Banner -->
    <GAlert
      v-if="conversionSuccessMessage"
      class="cif-conversion-notice mb-3"
      :label="conversionSuccessMessage"
      color="green"
      variant="success"
    />

    <!-- Sub-view 1: Search View (Figma Node 11347:160520 & User Screenshot 1:1) -->
    <div v-if="subView === 'search'" class="form-card" data-node-id="11347:160520">
      <!-- 1. Search Section: Informasi Rahin -->
      <RahinSearchSection
        v-model:search-state="step2State.search"
        :is-mobile="isMobile"
        :is-open="isSearchOpen"
        @search="handleSearch"
        @reset="handleResetSearch"
      />

      <!-- 2. Search Result State: Data Portofolio Pinjaman Aktif -->
      <RahinPortfolioTableSection
        v-if="hasSearched && step2State.portfolioList.length > 0"
        :items="step2State.portfolioList"
        :is-open="isPortfolioOpen"
      />

      <!-- 3. Search Result State: Data Rahin (14-Column CIF Selection Table) -->
      <RahinCifTableSection
        v-if="hasSearched && step2State.cifList.length > 0"
        :items="step2State.cifList"
        :selected-cif-id="step2State.selectedCifId"
        :is-open="isCifOpen"
        @select="handleSelectCif"
        @convert="handleConvertCif"
      />
    </div>

    <!-- Sub-view 2: Detailed Rahin Profile Section (Layout and fields mirroring Beneficial Owner) -->
    <div v-else-if="subView === 'detail'" class="form-card" data-node-id="11347:165167">
      <RahinDetailSection
        v-model="fieldsModel"
        :is-mobile="isMobile"
        :is-open="isDetailOpen"
        :selection-mode="detailSelectionMode"
        :is-read-only="detailSelectionMode === 'terpilih' || props.action === 'preview'"
        @dukcapil-verified="(status) => { fieldsModel.dukcapilStatus = status; syncUpstream(); }"
      />

      <!-- Pelaksana Transaksi Section if active or boState.type === 'orang_lain' -->
      <PelaksanaTransaksiSection
        v-if="isPelaksanaActive"
        v-model="step2State.pelaksana"
        :is-mobile="isMobile"
        :is-open="isPelaksanaOpen"
        :is-read-only="detailSelectionMode === 'terpilih' || props.action === 'preview'"
      />
    </div>

    <!-- Modal 1: Data Rahin Berhasil Disimpan Modal Popup (Figma Node 11752:118844) -->
    <RahinSaveSuccessModal
      v-model="isSuccessModalOpen"
      :is-mobile="isMobile"
      @continue="handleContinueToStep3"
    />

    <!-- Modal 2: Data Rahin Tidak Ditemukan Modal Popup (Figma Node 11347:162934 / Image 3) -->
    <RahinNotFoundModal
      v-model="isNotFoundModalOpen"
      :query-identity="notFoundQuery"
      :identity-type="step2State.search.jenisIdentitas"
      :is-mobile="isMobile"
      @tambah-baru="handleTambahRahinBaru"
      @cancel="handleCancelNotFound"
    />

    <!-- Loading Modal: "Memproses Data CIF" (Figma Node 11347:162934 / Image 3) -->
    <Teleport to="body">
      <div v-if="isSearching" class="cif-loading-backdrop" role="status" aria-live="polite">
        <div class="cif-loading-modal">
          <div class="cif-loading-dots">
            <span class="dot dot-1"></span>
            <span class="dot dot-2"></span>
            <span class="dot dot-3"></span>
          </div>
          <div class="cif-loading-text">Memproses Data CIF</div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.step2-rahin-content {
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
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.14), 0px 0px 1px rgba(0, 0, 0, 0.08);
  overflow: visible;

  :deep(.module-section-card) {
    border: none;
    border-radius: 0;
    margin-bottom: 0;

    + .module-section-card {
      border-top: 8px solid var(--g-kit-black-20, #eeeeef);
    }
  }

  @media (max-width: 767px) {
    border: none;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
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

.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .not-found-title {
    font-family: 'Nunito Sans', sans-serif;
    font-size: var(--g-kit-font-size-omicron, 16px);
    font-weight: var(--g-kit-font-weight-bold, 800);
    color: var(--g-kit-red-50, #ae1e22);
  }

  .not-found-desc {
    font-family: 'Nunito Sans', sans-serif;
    font-size: var(--g-kit-font-size-sigma, 14px);
    max-width: 480px;
  }
}

.cif-loading-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1070;
  background-color: rgba(37, 37, 40, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cif-loading-modal {
  background: var(--g-kit-white, #ffffff);
  border-radius: 12px;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.cif-loading-dots {
  display: flex;
  gap: 8px;
  align-items: center;

  .dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    animation: cifDotBounce 1.2s infinite ease-in-out;

    &.dot-1 {
      background-color: var(--g-kit-primary-50, #00883e);
      animation-delay: -0.32s;
    }
    &.dot-2 {
      background-color: var(--g-kit-primary-30, #75d37f);
      animation-delay: -0.16s;
    }
    &.dot-3 {
      background-color: #ffaa00;
    }
  }
}

@keyframes cifDotBounce {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.1);
    opacity: 1;
  }
}

.cif-loading-text {
  font-family: 'Nunito Sans', sans-serif;
  font-size: var(--g-kit-font-size-sigma, 14px);
  font-weight: var(--g-kit-font-weight-bold, 700);
  color: var(--g-kit-black-80, #252528);
}
</style>
