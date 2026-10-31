<script setup lang="ts">
/**
 * @file BeneficialOwnerDetailSections.vue
 * @description SPRINT Single UI Detail Data & Tambah Beneficial Owner View.
 * Implements the 5 sections in .form-card for both modes:
 * 1. Data Beneficial Owner (Terdaftar): isReadOnly = true (all fields disabled except Hubungan)
 *    - Branch 1: Data Alamat TIDAK Sesuai KTP -> Figma Node 12920:307127
 *    - Branch 2: Data Alamat SESUAI KTP -> Figma Node 12920:314583
 * 2. TAMBAH Beneficial Owner (Pendaftaran Baru): isReadOnly = false (all fields enabled + [ Cek Dukcapil ])
 *    - Figma Node 11347:151906
 * Conforms strictly to Pegadaian --g-kit-* design tokens and kitvue-plugin rules.
 */
import { computed, ref, watch } from 'vue'
import {
  GBadge,
  GButton,
  GCheckbox,
  GDropdown,
  GInputNIK,
  GInputSmallDate,
  GInputText,
  GTextArea,
} from '@/components'
import ModuleSectionCard from '@/components/shared/card/ModuleSectionCard.vue'
import type { BeneficialOwnerItem } from '../mockBeneficialOwnerData'

/**
 * Converts Indonesian formatted date (e.g. '9 Desember 1998' or '12 Januari 1999')
 * or any standard date string to ISO 'YYYY-MM-DD' so KitVue GInputSmallDate can parse it accurately.
 */
function toISODate(val?: string): string {
  if (!val) return ''
  val = val.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val
  const months: Record<string, string> = {
    januari: '01', februari: '02', maret: '03', april: '04',
    mei: '05', juni: '06', juli: '07', agustus: '08',
    september: '09', oktober: '10', november: '11', desember: '12',
    jan: '01', feb: '02', mar: '03', apr: '04',
    jun: '06', jul: '07', agu: '08', sep: '09',
    okt: '10', nov: '11', des: '12',
  }
  const parts = val.split(/\s+/)
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0')
    const month = months[parts[1].toLowerCase()] || '01'
    const year = parts[2]
    return `${year}-${month}-${day}`
  }
  return val
}

/**
 * Formats a date string (e.g. '1999-01-12' or '1998-12-09') to Indonesian display date ('12 Januari 1999').
 * If already formatted with month name, returns as is.
 */
function formatDisplayDate(val?: string): string {
  if (!val) return '-'
  val = String(val).trim()
  if (!val) return '-'
  if (/[a-zA-Z]/.test(val)) return val
  const parts = val.split('-')
  if (parts.length === 3) {
    const year = parts[0]
    const monthIndex = parseInt(parts[1], 10) - 1
    const day = parseInt(parts[2], 10)
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ]
    return `${day} ${months[monthIndex] || ''} ${year}`
  }
  return val
}

const props = withDefaults(
  defineProps<{
    boData?: BeneficialOwnerItem | null
    relationship?: string
    relationshipError?: string
    isAlamatSesuai?: boolean
    identityType?: 'ktp' | 'paspor' | ''
    isReadOnly?: boolean
    isMobile?: boolean
  }>(),
  {
    boData: null,
    relationship: '',
    relationshipError: '',
    isAlamatSesuai: false,
    identityType: 'ktp',
    isReadOnly: true,
    isMobile: false,
  },
)

const emit = defineEmits<{
  (e: 'update:relationship', val: string): void
  (e: 'update:isAlamatSesuai', val: boolean): void
  (e: 'save', bo: BeneficialOwnerItem, relationship: string): void
}>()

// Collapsible states for each of the 5 sections
const isSeksi1Open = ref(true)
const isSeksi2Open = ref(true)
const isSeksi3Open = ref(true)
const isSeksi4Open = ref(true)
const isSeksi5Open = ref(true)

// Checkbox state for Branch 1 vs Branch 2
const isAlamatSesuaiKtp = ref(props.isAlamatSesuai ?? false)

const isPasporReadOnly = computed(
  () => props.isReadOnly && (props.identityType === 'paspor' || jenisIdentitas.value === 'Paspor'),
)

const hasDomisiliAddress = (): boolean => {
  return Boolean(
    domKodePos.value &&
    domProvinsi.value &&
    domKotaKab.value &&
    domKecamatan.value &&
    domKelurahan.value &&
    domRt.value &&
    domRw.value &&
    domAlamatRumah.value,
  )
}

watch(
  () => props.isAlamatSesuai,
  (newVal) => {
    if (newVal !== undefined) isAlamatSesuaiKtp.value = newVal
  },
)

const handleCheckboxChange = (val: boolean) => {
  isAlamatSesuaiKtp.value = val
  emit('update:isAlamatSesuai', val)
}

// Section 1: Data Beneficial Owner
const tipeRahin = ref('Perorangan')
const jenisIdentitas = ref(props.identityType === 'paspor' ? 'Paspor' : 'KTP')
const nomorRegistrasi = ref('')
const localRelationship = ref(props.relationship || '')
const localRelationshipError = ref('')

watch(
  () => props.relationship,
  (newVal) => {
    if (newVal !== undefined) localRelationship.value = newVal
  },
)

watch(localRelationship, (newVal) => {
  if (newVal) localRelationshipError.value = ''
  emit('update:relationship', newVal)
})

// Section 2: Informasi sesuai Kartu Identitas
const identityNumber = ref('')
const nama = ref('')
const namaIbuKandung = ref('')
const tempatLahir = ref('')
const tanggalLahir = ref('')
const usia = ref('')
const masaBerlaku = ref('Seumur Hidup')

// Section 3: Alamat Sesuai Kartu Identitas
const ktpKodePos = ref('')
const ktpProvinsi = ref('')
const ktpKotaKab = ref('')
const ktpKecamatan = ref('')
const ktpKelurahan = ref('')
const ktpRt = ref('')
const ktpRw = ref('')
const ktpAlamatRumah = ref('')

// Section 4: Alamat Tinggal Saat Ini
const domKodePos = ref('')
const domProvinsi = ref('')
const domKotaKab = ref('')
const domKecamatan = ref('')
const domKelurahan = ref('')
const domRt = ref('')
const domRw = ref('')
const domAlamatRumah = ref('')

// Section 5: Detail Data Beneficial Owner
const jenisKelamin = ref('')
const pendidikan = ref('')
const statusPerkawinan = ref('')
const namaPasangan = ref('')
const tanggalLahirPasangan = ref('')
const jumlahTanggungan = ref('')
const nomorTelepon = ref('')
const nomorHandphone = ref('')
const email = ref('')
const nomorNpwp = ref('')
const kewarganegaraan = ref('WNI')
const tipeKependudukan = ref('Penduduk')
const sumberDana = ref('')
const pekerjaanTerkini = ref('')
const agama = ref('')
const rataPenghasilan = ref('')

// Dukcapil Verification Simulation State (Figma 11347:151906 Node 12920:315399)
const isCheckingDukcapil = ref(false)
const isDukcapilVerified = ref(props.boData?.isDukcapilVerified ?? false)

// Computed RT & RW 3-digit validations (Point 3)
const ktpRtError = computed(() => {
  if (props.isReadOnly) return ''
  const val = ktpRt.value ? String(ktpRt.value).replace(/\D/g, '') : ''
  return val.length > 0 && val.length < 3 ? 'Wajib 3 digit angka (contoh: 001)' : ''
})

const ktpRwError = computed(() => {
  if (props.isReadOnly) return ''
  const val = ktpRw.value ? String(ktpRw.value).replace(/\D/g, '') : ''
  return val.length > 0 && val.length < 3 ? 'Wajib 3 digit angka (contoh: 001)' : ''
})

const domRtError = computed(() => {
  if (props.isReadOnly || isAlamatSesuaiKtp.value) return ''
  const val = domRt.value ? String(domRt.value).replace(/\D/g, '') : ''
  return val.length > 0 && val.length < 3 ? 'Wajib 3 digit angka (contoh: 001)' : ''
})

const domRwError = computed(() => {
  if (props.isReadOnly || isAlamatSesuaiKtp.value) return ''
  const val = domRw.value ? String(domRw.value).replace(/\D/g, '') : ''
  return val.length > 0 && val.length < 3 ? 'Wajib 3 digit angka (contoh: 001)' : ''
})

// Computed Usia calculation from Tanggal Lahir (Point 5: always disabled, auto-calculated)
const computedUsia = computed(() => {
  if (!tanggalLahir.value) {
    return props.isReadOnly ? usia.value || '25' : ''
  }
  const val = String(tanggalLahir.value).trim()
  if (!val) {
    return props.isReadOnly ? usia.value || '25' : ''
  }

  let birthYear: number | null = null
  let birthMonth: number | null = null
  let birthDay: number | null = null

  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
    const parts = val.split('-').map(Number)
    birthYear = parts[0]
    birthMonth = parts[1]
    birthDay = parts[2]
  } else {
    const ddmmyyyy = val.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
    if (ddmmyyyy) {
      birthDay = parseInt(ddmmyyyy[1], 10)
      birthMonth = parseInt(ddmmyyyy[2], 10)
      birthYear = parseInt(ddmmyyyy[3], 10)
    } else {
      const matchYear = val.match(/\b(19\d{2}|20\d{2})\b/)
      if (matchYear) {
        birthYear = parseInt(matchYear[1], 10)
      }
    }
  }

  if (birthYear) {
    const today = new Date()
    let age = today.getFullYear() - birthYear
    if (birthMonth && birthDay) {
      const monthDiff = today.getMonth() + 1 - birthMonth
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDay)) {
        age--
      }
    }
    if (age >= 0 && age <= 130) {
      return String(age)
    }
  }

  return props.isReadOnly ? usia.value || '25' : ''
})

const handleCekDukcapil = () => {
  if (!identityNumber.value) {
    alert('Mohon masukkan NIK terlebih dahulu.')
    return
  }
  isCheckingDukcapil.value = true
  setTimeout(() => {
    isCheckingDukcapil.value = false
    isDukcapilVerified.value = true
  }, 350)
}

// Initialize / Sync fields based on mode
const initFields = () => {
  if (props.isReadOnly && props.boData) {
    nomorRegistrasi.value = props.boData.registrationNumber || '1234 1234'
    identityNumber.value =
      props.identityType === 'paspor'
        ? props.boData.pasporNumber || '0033 9714 84'
        : props.boData.nik || '3204 1111 1298 0003'
    nama.value = props.boData.name || (props.identityType === 'paspor' ? 'Anastasya Dhelistya' : 'Anastasya Delistya')
    namaIbuKandung.value = props.boData.motherName || (props.identityType === 'paspor' ? 'Putri' : 'Annisya')
    tempatLahir.value = props.boData.birthPlace || 'Jakarta'
    tanggalLahir.value = toISODate(props.boData.birthDate || '1998-12-09')
    usia.value = '25'
    masaBerlaku.value = props.boData.masaBerlaku || 'Seumur Hidup'
    ktpKodePos.value = props.boData.kodePos || '10320'
    ktpProvinsi.value = props.boData.provinsi || 'DKI Jakarta'
    ktpKotaKab.value = props.boData.kotaKab || 'Jakarta Pusat'
    ktpKecamatan.value = props.boData.kecamatan || 'Menteng'
    ktpKelurahan.value = props.boData.kelurahan || 'Pegangsaan'
    ktpRt.value = props.boData.rt ? String(props.boData.rt).padStart(3, '0') : '001'
    ktpRw.value = props.boData.rw ? String(props.boData.rw).padStart(3, '0') : '002'
    ktpAlamatRumah.value = props.boData.address || (props.identityType === 'paspor' ? 'Jl. Borobudur No. 10' : 'Pertokoan Kenari Baru, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10430')
    domKodePos.value = props.boData.domKodePos || '10321'
    domProvinsi.value = props.boData.domProvinsi || 'DKI Jakarta'
    domKotaKab.value = props.boData.domKotaKab || 'Jakarta Selatan'
    domKecamatan.value = props.boData.domKecamatan || 'Mampang'
    domKelurahan.value = props.boData.domKelurahan || 'Pela Mampang'
    domRt.value = props.boData.domRt ? String(props.boData.domRt).padStart(3, '0') : '001'
    domRw.value = props.boData.domRw ? String(props.boData.domRw).padStart(3, '0') : '002'
    domAlamatRumah.value = props.boData.domAlamatRumah || 'Jl. A No. 10'
    jenisKelamin.value = props.boData.gender || 'Perempuan'
    pendidikan.value = props.boData.pendidikan || 'S1'
    statusPerkawinan.value = props.boData.statusPerkawinan || 'Menikah'
    namaPasangan.value = props.boData.namaPasangan || (props.identityType === 'paspor' ? 'Annisya syaban' : 'Annisya Syaban')
    tanggalLahirPasangan.value = toISODate(props.boData.tanggalLahirPasangan || '1993-01-12')
    jumlahTanggungan.value = props.boData.jumlahTanggungan || (props.identityType === 'paspor' ? '4' : '2')
    nomorTelepon.value = props.boData.nomorTelepon || '0214 2345 5'
    nomorHandphone.value = props.boData.phone || '0812 2345 3456'
    email.value = props.boData.email || (props.identityType === 'paspor' ? 'anatasya@gmail.com' : 'thoriqsadad@gmail.com')
    nomorNpwp.value = props.boData.nomorNpwp || '99.999.999.9-999.000'
    kewarganegaraan.value = props.boData.kewarganegaraan || 'WNI'
    tipeKependudukan.value = props.boData.tipeKependudukan || 'Penduduk'
    sumberDana.value = props.boData.sumberDana || 'Gaji'
    pekerjaanTerkini.value = props.boData.job || (props.identityType === 'paspor' ? 'Karyawan Swasta' : 'Pegawai Swasta')
    agama.value = props.boData.agama || 'Islam'
    rataPenghasilan.value = props.boData.rataPenghasilan || '5 - 10 Juta'
    isDukcapilVerified.value = true
  } else {
    // Mode TAMBAH: Prefill NIK, leave all other fields clean/empty so placeholders show (Point 4)
    nomorRegistrasi.value = ''
    identityNumber.value =
      props.boData?.nik ||
      (props.identityType === 'paspor' ? props.boData?.pasporNumber || '' : '')
    nama.value = props.boData?.name || ''
    namaIbuKandung.value = props.boData?.motherName || ''
    tempatLahir.value = props.boData?.birthPlace || ''
    tanggalLahir.value = toISODate(props.boData?.birthDate || '')
    usia.value = ''
    masaBerlaku.value = props.boData?.masaBerlaku || 'Seumur Hidup'
    ktpKodePos.value = props.boData?.kodePos || ''
    ktpProvinsi.value = props.boData?.provinsi || ''
    ktpKotaKab.value = props.boData?.kotaKab || ''
    ktpKecamatan.value = props.boData?.kecamatan || ''
    ktpKelurahan.value = props.boData?.kelurahan || ''
    ktpRt.value = props.boData?.rt ? String(props.boData.rt).padStart(3, '0') : ''
    ktpRw.value = props.boData?.rw ? String(props.boData.rw).padStart(3, '0') : ''
    ktpAlamatRumah.value = props.boData?.address || ''
    domKodePos.value = ''
    domProvinsi.value = ''
    domKotaKab.value = ''
    domKecamatan.value = ''
    domKelurahan.value = ''
    domRt.value = ''
    domRw.value = ''
    domAlamatRumah.value = ''
    jenisKelamin.value = props.boData?.gender || ''
    pendidikan.value = props.boData?.pendidikan || ''
    statusPerkawinan.value = props.boData?.statusPerkawinan || ''
    namaPasangan.value = props.boData?.namaPasangan || ''
    tanggalLahirPasangan.value = toISODate(props.boData?.tanggalLahirPasangan || '')
    jumlahTanggungan.value = props.boData?.jumlahTanggungan || ''
    nomorTelepon.value = props.boData?.nomorTelepon || ''
    nomorHandphone.value = props.boData?.phone || ''
    email.value = props.boData?.email || ''
    nomorNpwp.value = props.boData?.nomorNpwp || ''
    kewarganegaraan.value = 'WNI'
    tipeKependudukan.value = props.boData?.tipeKependudukan || ''
    sumberDana.value = props.boData?.sumberDana || ''
    pekerjaanTerkini.value = props.boData?.job || ''
    agama.value = props.boData?.agama || ''
    rataPenghasilan.value = props.boData?.rataPenghasilan || ''
    isDukcapilVerified.value = props.boData?.isDukcapilVerified ?? false
  }
}

watch(
  () => [props.isReadOnly, props.boData, props.identityType],
  () => {
    initFields()
  },
  { deep: true, immediate: true },
)

// Dropdown options
const tipeRahinOptions = [
  { value: 'Perorangan', label: 'Perorangan' },
  { value: 'Badan Usaha', label: 'Badan Usaha' },
]

const jenisIdentitasOptions = [
  { value: 'KTP', label: 'KTP' },
  { value: 'Paspor', label: 'Paspor' },
]

const hubunganOptions = [
  { value: 'suami-istri', label: 'Suami / Istri' },
  { value: 'orang-tua-anak', label: 'Orang Tua/Anak' },
  { value: 'kerabat-lainnya', label: 'Kerabat / Lainnya' },
  { value: 'Orang Tua', label: 'Orang Tua' },
  { value: 'Anak', label: 'Anak Kandung' },
  { value: 'Pasangan', label: 'Pasangan (Suami / Istri)' },
  { value: 'Kerabat', label: 'Kerabat / Keluarga Lainnya' },
  { value: 'Kuasa', label: 'Pemberi Kuasa' },
  { value: 'Rekan Usaha', label: 'Rekan Usaha / Mitra Bisnis' },
]

const masaBerlakuOptions = [
  { value: 'Seumur Hidup', label: 'Seumur Hidup' },
  { value: 'Hingga 5 Tahun', label: 'Hingga 5 Tahun' },
]

const provinsiOptions = [
  { value: 'DKI Jakarta', label: 'DKI Jakarta' },
  { value: 'Jawa Barat', label: 'Jawa Barat' },
  { value: 'Banten', label: 'Banten' },
]

const kotaKabOptions = [
  { value: 'Jakarta Pusat', label: 'Jakarta Pusat' },
  { value: 'Jakarta Selatan', label: 'Jakarta Selatan' },
  { value: 'Bandung', label: 'Bandung' },
]

const kecamatanOptions = [
  { value: 'Menteng', label: 'Menteng' },
  { value: 'Senen', label: 'Senen' },
  { value: 'Tebet', label: 'Tebet' },
]

const kelurahanOptions = [
  { value: 'Pegangsaan', label: 'Pegangsaan' },
  { value: 'Kenari', label: 'Kenari' },
  { value: 'Tebet Barat', label: 'Tebet Barat' },
]

const jenisKelaminOptions = [
  { value: 'Laki-laki', label: 'Laki-laki' },
  { value: 'Perempuan', label: 'Perempuan' },
]

const pendidikanOptions = [
  { value: 'SD', label: 'SD' },
  { value: 'SMP', label: 'SMP' },
  { value: 'SMA', label: 'SMA' },
  { value: 'D3', label: 'D3' },
  { value: 'S1', label: 'S1' },
  { value: 'S2', label: 'S2' },
  { value: 'S3', label: 'S3' },
]

const statusPerkawinanOptions = [
  { value: 'Belum Menikah', label: 'Belum Menikah' },
  { value: 'Menikah', label: 'Menikah' },
  { value: 'Cerai Hidup', label: 'Cerai Hidup' },
  { value: 'Cerai Mati', label: 'Cerai Mati' },
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

const pekerjaanOptions = [
  { value: 'Karyawan Swasta', label: 'Karyawan Swasta' },
  { value: 'Pegawai Negeri Sipil (PNS)', label: 'Pegawai Negeri Sipil (PNS)' },
  { value: 'Wiraswasta', label: 'Wiraswasta / Pengusaha' },
  { value: 'Profesional', label: 'Profesional' },
  { value: 'Ibu Rumah Tangga', label: 'Ibu Rumah Tangga' },
  { value: 'Pegawai Swasta', label: 'Pegawai Swasta' },
]

const agamaOptions = [
  { value: 'Islam', label: 'Islam' },
  { value: 'Kristen', label: 'Kristen Protestan' },
  { value: 'Katolik', label: 'Katolik' },
  { value: 'Hindu', label: 'Hindu' },
  { value: 'Buddha', label: 'Buddha' },
  { value: 'Konghucu', label: 'Konghucu' },
]

const penghasilanOptions = [
  { value: '< 3 Juta', label: '< Rp 3.000.000' },
  { value: '3 - 5 Juta', label: 'Rp 3.000.000 - Rp 5.000.000' },
  { value: '5 - 10 Juta', label: 'Rp 5.000.000 - Rp 10.000.000' },
  { value: '> 10 Juta', label: '> Rp 10.000.000' },
]

// Method exposed to parent to submit / validate new BO registration
const submit = (): { bo: BeneficialOwnerItem; relationship: string } | null => {
  if (!identityNumber.value || !nama.value) {
    return null
  }
  if (!localRelationship.value) {
    localRelationshipError.value = 'Kolom ini wajib diisi.'
    return null
  }
  if (ktpRtError.value || ktpRwError.value) {
    return null
  }
  if (!isAlamatSesuaiKtp.value && (domRtError.value || domRwError.value)) {
    return null
  }

  const resolvedAddress = isAlamatSesuaiKtp.value
    ? `${ktpAlamatRumah.value || 'Alamat KTP'}, RT ${ktpRt.value || '001'} / RW ${ktpRw.value || '001'}, ${ktpKelurahan.value || 'Kelurahan'}, ${ktpKecamatan.value || 'Kecamatan'}, ${ktpKotaKab.value || 'Kota'}`
    : `${domAlamatRumah.value || 'Alamat Domisili'}, RT ${domRt.value || '001'} / RW ${domRw.value || '001'}, ${domKelurahan.value || 'Kelurahan'}, ${domKecamatan.value || 'Kecamatan'}, ${domKotaKab.value || 'Kota'}`

  const newBO: BeneficialOwnerItem = {
    id: props.boData?.id || `bo-${Date.now()}`,
    registrationNumber: props.boData?.registrationNumber || `REG-${Math.floor(1000 + Math.random() * 9000)}`,
    name: nama.value,
    nik: identityNumber.value,
    pasporNumber: (props.identityType === 'paspor' || jenisIdentitas.value === 'Paspor') ? identityNumber.value : undefined,
    birthDate: tanggalLahir.value || '12 Januari 1999',
    motherName: namaIbuKandung.value || 'Ibu Kandung',
    birthPlace: tempatLahir.value || 'Jakarta',
    gender: jenisKelamin.value || 'Perempuan',
    job: pekerjaanTerkini.value || 'Karyawan Swasta',
    address: resolvedAddress,
    phone: nomorHandphone.value || '0812 3456 7890',
    branch: 'Kantor Cabang Input',
    isDukcapilVerified: isDukcapilVerified.value,
    pendidikan: pendidikan.value,
    statusPerkawinan: statusPerkawinan.value,
    namaPasangan: namaPasangan.value,
    tanggalLahirPasangan: tanggalLahirPasangan.value,
    jumlahTanggungan: jumlahTanggungan.value,
    nomorTelepon: nomorTelepon.value,
    email: email.value,
    nomorNpwp: nomorNpwp.value,
    kewarganegaraan: kewarganegaraan.value,
    tipeKependudukan: tipeKependudukan.value,
    sumberDana: sumberDana.value,
    agama: agama.value,
    rataPenghasilan: rataPenghasilan.value,
    kodePos: ktpKodePos.value,
    provinsi: ktpProvinsi.value,
    kotaKab: ktpKotaKab.value,
    kecamatan: ktpKecamatan.value,
    kelurahan: ktpKelurahan.value,
    rt: ktpRt.value,
    rw: ktpRw.value,
  }

  emit('save', newBO, localRelationship.value)
  return { bo: newBO, relationship: localRelationship.value }
}

defineExpose({
  submit,
  isDukcapilVerified,
  isAlamatSesuaiKtp,
  hasDomisiliAddress,
})
</script>

<template>
  <div class="bo-detail-sections-container">
    <!-- SEKSI 1: Data Beneficial Owner (Figma 11752:121098 / 12920:307161 / 11347:151940) -->
    <ModuleSectionCard
      title="Data Beneficial Owner"
      v-model="isSeksi1Open"
      data-node-id="12920:307161"
    >
      <!-- Mode Paspor Read-Only (Figma Node 11752:121098 / 11752:120905) -->
      <div v-if="isPasporReadOnly" class="row g-3">
        <div class="col-12 col-md-6">
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Tipe Rahin</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ tipeRahin || 'Perorangan' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Nomor Registrasi</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ nomorRegistrasi || '1234 1234' }}</span>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Jenis Identitas</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ jenisIdentitas || 'Paspor' }}</span>
          </div>
        </div>
      </div>

      <!-- Mode Standard Form (KTP Read-Only & Tambah BO) -->
      <div v-else class="row g-3">
        <div class="col-12 col-md-6">
          <GDropdown
            v-model="tipeRahin"
            label="Tipe Rahin"
            placeholder="Pilih tipe rahin"
            :items="tipeRahinOptions"
            item-value="value"
            item-text="label"
            :disabled="isReadOnly"
            :use-bottom-sheet="isMobile"
          />
        </div>
        <div class="col-12 col-md-6">
          <GDropdown
            v-model="jenisIdentitas"
            label="Jenis Identitas"
            placeholder="Pilih jenis identitas"
            :items="jenisIdentitasOptions"
            item-value="value"
            item-text="label"
            :disabled="isReadOnly"
            :use-bottom-sheet="isMobile"
          />
        </div>
        <!-- Nomor Registrasi: Tampil hanya saat read-only (Figma Node 12920:307161) -->
        <div v-if="isReadOnly" class="col-12 col-md-6">
          <GInputText
            v-model="nomorRegistrasi"
            label="Nomor Registrasi"
            placeholder="1234 1234"
            type="number"
            disabled
          />
        </div>
        <div class="col-12 col-md-6">
          <div class="bo-field-with-error">
            <GDropdown
              v-model="localRelationship"
              label="Hubungan"
              placeholder="Pilih hubungan"
              :items="hubunganOptions"
              item-value="value"
              item-text="label"
              :use-bottom-sheet="isMobile"
            />
            <div v-if="relationshipError || localRelationshipError" class="field-error-text">
              {{ relationshipError || localRelationshipError }}
            </div>
          </div>
        </div>
      </div>
    </ModuleSectionCard>

    <!-- SEKSI 2: Informasi Beneficial Owner sesuai Kartu Identitas (Figma 11752:121098 / 12920:307175 / 11347:155489) -->
    <ModuleSectionCard
      title="Informasi Beneficial Owner sesuai Kartu Identitas"
      v-model="isSeksi2Open"
      data-node-id="12920:307175"
    >
      <!-- Mode Paspor Read-Only (Figma Node 11752:121098 / 11752:120905) -->
      <div v-if="isPasporReadOnly" class="row g-3">
        <div class="col-12 col-md-6">
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Nomor Paspor</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ identityNumber || '0033 9714 84' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Nama Ibu Kandung</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ namaIbuKandung || 'Putri' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Tanggal Lahir</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ formatDisplayDate(tanggalLahir) || '12 Januari 1999' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Masa Berlaku</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ masaBerlaku || 'Seumur Hidup' }}</span>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Nama Beneficial Owner</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ nama || 'Anastasya Dhelistya' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Tempat Lahir</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ tempatLahir || 'Jakarta' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Usia</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ (computedUsia || '25') + ' Tahun' }}</span>
          </div>
        </div>
      </div>

      <!-- Mode Standard Form -->
      <div v-else class="row g-3">
        <div class="col-12 col-md-6">
          <GInputText
            v-if="identityType === 'paspor' || jenisIdentitas === 'Paspor'"
            v-model="identityNumber"
            label="Nomor Paspor"
            placeholder="0033 9714 84"
            :disabled="isReadOnly"
          />
          <GInputNIK
            v-else
            v-model="identityNumber"
            label="Nomor Induk Kependudukan (NIK)"
            placeholder="3204 2888 1222 0003"
            :disabled="isReadOnly"
          />
        </div>
        <div class="col-12 col-md-6">
          <GInputText
            v-model="nama"
            label="Nama Beneficial Owner"
            placeholder="Masukkan nama sesuai kartu identitas"
            :disabled="isReadOnly"
          />
        </div>

        <div class="col-12 col-md-6">
          <GInputText
            v-model="namaIbuKandung"
            label="Nama Ibu Kandung"
            placeholder="Masukkan nama ibu kandung"
            :disabled="isReadOnly"
          />
        </div>
        <div class="col-12 col-md-6">
          <GInputText
            v-model="tempatLahir"
            label="Tempat Lahir"
            placeholder="Masukkan tempat lahir"
            :disabled="isReadOnly"
          />
        </div>

        <!-- Tanggal Lahir (Point 1: GInputSmallDate) & Usia (Point 5: disabled, auto-calculated) -->
        <div class="col-12 col-md-6">
          <div class="d-flex gap-3 align-items-start w-100">
            <div class="flex-grow-1">
              <GInputSmallDate
                v-model="tanggalLahir"
                title="Tanggal Lahir"
                placeholder="Pilih tanggal lahir"
                :disabled="isReadOnly"
              />
            </div>
            <div style="width: 112px; flex-shrink: 0;">
              <GInputText
                :model-value="computedUsia"
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
            v-model="masaBerlaku"
            label="Masa Berlaku"
            placeholder="Pilih masa berlaku"
            :items="masaBerlakuOptions"
            item-value="value"
            item-text="label"
            :disabled="isReadOnly"
            :use-bottom-sheet="isMobile"
          />
        </div>

        <!-- Tombol Cek Dukcapil (Figma Node 12920:315399): Hanya untuk KTP saat Tambah BO (isReadOnly === false) -->
        <div
          v-if="!isReadOnly && identityType !== 'paspor' && jenisIdentitas !== 'Paspor'"
          class="col-12 d-flex align-items-center justify-content-between flex-wrap gap-2 pt-2"
        >
          <div>
            <GBadge
              v-if="isDukcapilVerified"
              type="primary"
              label="Terverifikasi Dukcapil"
            />
            <span v-else class="text-muted small">
              Data belum diverifikasi dengan Dukcapil.
            </span>
          </div>
          <GButton
            :label="isDukcapilVerified ? 'Cek Ulang Dukcapil' : 'Cek Dukcapil'"
            type="outline"
            size="md"
            style="width: 185px;"
            :disabled="isCheckingDukcapil"
            @click="handleCekDukcapil"
          />
        </div>
      </div>
    </ModuleSectionCard>

    <!-- SEKSI 3: Alamat Sesuai Kartu Identitas (Figma 11752:121098 / 12920:307194 / 11347:151972) -->
    <ModuleSectionCard
      title="Alamat Sesuai Kartu Identitas"
      v-model="isSeksi3Open"
      data-node-id="12920:307194"
    >
      <!-- Mode Paspor Read-Only (Figma Node 11752:121098 / 11752:120905) -->
      <div v-if="isPasporReadOnly" class="row g-3">
        <div class="col-12 col-md-6">
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Kode Pos</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ ktpKodePos || '10320' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Kota / Kabupaten</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ ktpKotaKab || 'Jakarta Pusat' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Kelurahan</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ ktpKelurahan || 'Pegangsaan' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">RW</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ ktpRw || '002' }}</span>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Provinsi</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ ktpProvinsi || 'DKI Jakarta' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Kecamatan</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ ktpKecamatan || 'Menteng' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">RT</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ ktpRt || '001' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Alamat Rumah</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ ktpAlamatRumah || 'Jl. Borobudur No. 10' }}</span>
          </div>
        </div>
      </div>

      <!-- Mode Standard Form -->
      <div v-else class="row g-3">
        <!-- Kode Pos: Point 2 (type="number") -->
        <div class="col-12 col-md-6">
          <GInputText
            v-model="ktpKodePos"
            label="Kode Pos"
            placeholder="Masukkan kode pos"
            type="number"
            :disabled="isReadOnly"
          />
        </div>
        <div class="col-12 col-md-6">
          <GDropdown
            v-model="ktpProvinsi"
            label="Provinsi"
            placeholder="Pilih provinsi"
            :items="provinsiOptions"
            item-value="value"
            item-text="label"
            :disabled="isReadOnly"
            :use-bottom-sheet="isMobile"
          />
        </div>

        <div class="col-12 col-md-6">
          <GDropdown
            v-model="ktpKotaKab"
            label="Kota / Kabupaten"
            placeholder="Pilih kota / kabupaten"
            :items="kotaKabOptions"
            item-value="value"
            item-text="label"
            :disabled="isReadOnly"
            :use-bottom-sheet="isMobile"
          />
        </div>
        <div class="col-12 col-md-6">
          <GDropdown
            v-model="ktpKecamatan"
            label="Kecamatan"
            placeholder="Pilih kecamatan"
            :items="kecamatanOptions"
            item-value="value"
            item-text="label"
            :disabled="isReadOnly"
            :use-bottom-sheet="isMobile"
          />
        </div>

        <div class="col-12 col-md-6">
          <GDropdown
            v-model="ktpKelurahan"
            label="Kelurahan"
            placeholder="Pilih kelurahan"
            :items="kelurahanOptions"
            item-value="value"
            item-text="label"
            :disabled="isReadOnly"
            :use-bottom-sheet="isMobile"
          />
        </div>
        <!-- RT & RW: Point 2 (type="number"), Point 3 (maxlength 3 & error text if < 3 digits) -->
        <div class="col-12 col-md-6">
          <div class="row g-3">
            <div class="col-6">
              <GInputText
                v-model="ktpRt"
                label="RT"
                placeholder="001"
                type="number"
                maxlength="3"
                :error="ktpRtError"
                :disabled="isReadOnly"
              />
            </div>
            <div class="col-6">
              <GInputText
                v-model="ktpRw"
                label="RW"
                placeholder="001"
                type="number"
                maxlength="3"
                :error="ktpRwError"
                :disabled="isReadOnly"
              />
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <GTextArea
            v-model="ktpAlamatRumah"
            label="Alamat Rumah"
            placeholder="Masukkan alamat rumah sesuai kartu identitas"
            :disabled="isReadOnly"
          />
        </div>
      </div>
    </ModuleSectionCard>

    <!-- SEKSI 4: Alamat Tinggal Saat Ini (Figma 11752:121098 / 11752:120905 / 12920:307214) -->
    <ModuleSectionCard
      title="Alamat Tinggal Saat Ini"
      v-model="isSeksi4Open"
      data-node-id="12920:307214"
    >
      <!-- Checkbox matching Figma 11752:120905 / 11752:121098 / 12920:314575 -->
      <div class="mb-3">
        <GCheckbox
          v-model="isAlamatSesuaiKtp"
          :label="identityType === 'paspor' ? 'Alamat tinggal saat ini sesuai dengan KTP.' : 'Alamat tinggal saat ini sesuai dengan kartu identitas.'"
          @update:model-value="handleCheckboxChange"
        />
      </div>

      <!-- Mode Paspor Read-Only with Alamat Tidak Sesuai KTP (Figma 11752:121098) -->
      <div v-if="isPasporReadOnly && !isAlamatSesuaiKtp" class="row g-3">
        <div class="col-12 col-md-6">
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Kode Pos</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ domKodePos || '10321' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Kota / Kabupaten</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ domKotaKab || 'Jakarta Selatan' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Kelurahan</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ domKelurahan || 'Pela Mampang' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">RW</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ domRw || '002' }}</span>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Provinsi</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ domProvinsi || 'DKI Jakarta' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Kecamatan</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ domKecamatan || 'Mampang' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">RT</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ domRt || '001' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Alamat Rumah</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ domAlamatRumah || 'Jl. A No. 10' }}</span>
          </div>
        </div>
      </div>

      <!-- Mode Standard Form: Form Domisili saat Unchecked -->
      <div v-else-if="!isPasporReadOnly && !isAlamatSesuaiKtp" class="row g-3">
        <!-- Kode Pos Domisili: Point 2 (type="number") -->
        <div class="col-12 col-md-6">
          <GInputText
            v-model="domKodePos"
            label="Kode Pos"
            placeholder="Masukkan kode pos"
            type="number"
            :disabled="isReadOnly"
          />
        </div>
        <div class="col-12 col-md-6">
          <GDropdown
            v-model="domProvinsi"
            label="Provinsi"
            placeholder="Pilih provinsi"
            :items="provinsiOptions"
            item-value="value"
            item-text="label"
            :disabled="isReadOnly"
            :use-bottom-sheet="isMobile"
          />
        </div>

        <div class="col-12 col-md-6">
          <GDropdown
            v-model="domKotaKab"
            label="Kota / Kabupaten"
            placeholder="Pilih kota / kabupaten"
            :items="kotaKabOptions"
            item-value="value"
            item-text="label"
            :disabled="isReadOnly"
            :use-bottom-sheet="isMobile"
          />
        </div>
        <div class="col-12 col-md-6">
          <GDropdown
            v-model="domKecamatan"
            label="Kecamatan"
            placeholder="Pilih kecamatan"
            :items="kecamatanOptions"
            item-value="value"
            item-text="label"
            :disabled="isReadOnly"
            :use-bottom-sheet="isMobile"
          />
        </div>

        <div class="col-12 col-md-6">
          <GDropdown
            v-model="domKelurahan"
            label="Kelurahan"
            placeholder="Pilih kelurahan"
            :items="kelurahanOptions"
            item-value="value"
            item-text="label"
            :disabled="isReadOnly"
            :use-bottom-sheet="isMobile"
          />
        </div>
        <!-- Domisili RT & RW: Point 2 (type="number"), Point 3 (maxlength 3 & error text if < 3 digits) -->
        <div class="col-12 col-md-6">
          <div class="row g-3">
            <div class="col-6">
              <GInputText
                v-model="domRt"
                label="RT"
                placeholder="001"
                type="number"
                maxlength="3"
                :error="domRtError"
                :disabled="isReadOnly"
              />
            </div>
            <div class="col-6">
              <GInputText
                v-model="domRw"
                label="RW"
                placeholder="001"
                type="number"
                maxlength="3"
                :error="domRwError"
                :disabled="isReadOnly"
              />
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <GTextArea
            v-model="domAlamatRumah"
            label="Alamat Rumah"
            placeholder="Masukkan alamat tinggal saat ini"
            :disabled="isReadOnly"
          />
        </div>
      </div>
    </ModuleSectionCard>

    <!-- SEKSI 5: Detail Data Beneficial Owner (Figma 11752:121098 / 12920:307234 / 11347:152016) -->
    <ModuleSectionCard
      title="Detail Data Beneficial Owner"
      v-model="isSeksi5Open"
      data-node-id="12920:307234"
    >
      <!-- Mode Paspor Read-Only (Figma Node 11752:121098 / 11752:120905) -->
      <div v-if="isPasporReadOnly" class="row g-3">
        <div class="col-12 col-md-6">
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Email</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ email || 'anatasya@gmail.com' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Sumber Dana</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ sumberDana || 'Gaji' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Nama Pasangan (Opsional)</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ namaPasangan || 'Annisya syaban' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Nomor NPWP (Opsional)</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ nomorNpwp || '99.999.999.9-999.000' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Pekerjaan Terkini</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ pekerjaanTerkini || 'Karyawan Swasta' }}</span>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Kewarganegaraan</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ kewarganegaraan || 'WNI' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Pendidikan</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ pendidikan || 'S1' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Jumlah Tanggungan (Opsional)</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ jumlahTanggungan || '4' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Tanggal Lahir Pasangan (Opsional)</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ formatDisplayDate(tanggalLahirPasangan) || '12 Januari 1993' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Agama</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ agama || 'Islam' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Status Perkawinan</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ statusPerkawinan || 'Menikah' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Nomor Telepon (Opsional)</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ nomorTelepon || '0214 2345 5' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Nomor Handphone</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ nomorHandphone || '0812 2345 3456' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Tipe Kependudukan</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ tipeKependudukan || 'Penduduk' }}</span>
          </div>
          <div class="bo-read-row d-flex align-items-baseline">
            <span class="bo-read-label">Rata - Rata Penghasilan</span>
            <span class="bo-read-colon">:</span>
            <span class="bo-read-value">{{ rataPenghasilan || '5 - 10 Juta' }}</span>
          </div>
        </div>
      </div>

      <!-- Mode Standard Form -->
      <div v-else class="row g-3">
        <!-- Row 1: Jenis Kelamin & Pendidikan (Point 4: placeholders) -->
        <div class="col-12 col-md-6">
          <GDropdown
            v-model="jenisKelamin"
            label="Jenis Kelamin"
            placeholder="Pilih jenis kelamin"
            :items="jenisKelaminOptions"
            item-value="value"
            item-text="label"
            :disabled="isReadOnly"
            :use-bottom-sheet="isMobile"
          />
        </div>
        <div class="col-12 col-md-6">
          <GDropdown
            v-model="pendidikan"
            label="Pendidikan"
            placeholder="Pilih pendidikan"
            :items="pendidikanOptions"
            item-value="value"
            item-text="label"
            :disabled="isReadOnly"
            :use-bottom-sheet="isMobile"
          />
        </div>

        <!-- Row 2: Status Perkawinan & Nama Pasangan (Opsional) -->
        <div class="col-12 col-md-6">
          <GDropdown
            v-model="statusPerkawinan"
            label="Status Perkawinan"
            placeholder="Pilih status perkawinan"
            :items="statusPerkawinanOptions"
            item-value="value"
            item-text="label"
            :disabled="isReadOnly"
            :use-bottom-sheet="isMobile"
          />
        </div>
        <div class="col-12 col-md-6">
          <GInputText
            v-model="namaPasangan"
            label="Nama Pasangan (Opsional)"
            placeholder="Masukkan nama pasangan"
            :disabled="isReadOnly"
          />
        </div>

        <!-- Row 3: Tanggal Lahir Pasangan (Point 1: GInputSmallDate) & Jumlah Tanggungan (Point 2: type="number") -->
        <div class="col-12 col-md-6">
          <GInputSmallDate
            v-model="tanggalLahirPasangan"
            title="Tanggal Lahir Pasangan (Opsional)"
            placeholder="Pilih tanggal lahir pasangan"
            :disabled="isReadOnly"
          />
        </div>
        <div class="col-12 col-md-6">
          <GInputText
            v-model="jumlahTanggungan"
            label="Jumlah Tanggungan (Opsional)"
            placeholder="Pilih jumlah tanggungan"
            type="number"
            :disabled="isReadOnly"
          />
        </div>

        <!-- Row 4: Nomor Telepon (Opsional, Point 2: type="number") & Nomor Handphone (Point 2: type="number") -->
        <div class="col-12 col-md-6">
          <GInputText
            v-model="nomorTelepon"
            label="Nomor Telepon (Opsional)"
            placeholder="Masukkan nomor telepon"
            type="number"
            :disabled="isReadOnly"
          />
        </div>
        <div class="col-12 col-md-6">
          <GInputText
            v-model="nomorHandphone"
            label="Nomor Handphone"
            placeholder="Masukkan nomor handphone"
            type="number"
            :disabled="isReadOnly"
          />
        </div>

        <!-- Row 5: Email (Opsional) & Nomor NPWP (Opsional) -->
        <div class="col-12 col-md-6">
          <GInputText
            v-model="email"
            label="Email (Opsional)"
            placeholder="Masukkan email"
            :disabled="isReadOnly"
          />
        </div>
        <div class="col-12 col-md-6">
          <GInputText
            v-model="nomorNpwp"
            label="Nomor NPWP (Opsional)"
            placeholder="Masukkan nomor npwp"
            :disabled="isReadOnly"
          />
        </div>

        <!-- Row 6: Kewarganegaraan & Tipe Kependudukan -->
        <div class="col-12 col-md-6">
          <GDropdown
            v-model="kewarganegaraan"
            label="Kewarganegaraan"
            placeholder="Pilih kewarganegaraan"
            :items="kewarganegaraanOptions"
            item-value="value"
            item-text="label"
            :disabled="isReadOnly || jenisIdentitas === 'KTP'"
            :use-bottom-sheet="isMobile"
          />
        </div>
        <div class="col-12 col-md-6">
          <GDropdown
            v-model="tipeKependudukan"
            label="Tipe Kependudukan"
            placeholder="Pilih tipe kependudukan"
            :items="tipeKependudukanOptions"
            item-value="value"
            item-text="label"
            :disabled="isReadOnly"
            :use-bottom-sheet="isMobile"
          />
        </div>

        <!-- Row 7: Sumber Dana & Pekerjaan Terkini -->
        <div class="col-12 col-md-6">
          <GDropdown
            v-model="sumberDana"
            label="Sumber Dana"
            placeholder="Pilih sumber dana"
            :items="sumberDanaOptions"
            item-value="value"
            item-text="label"
            :disabled="isReadOnly"
            :use-bottom-sheet="isMobile"
          />
        </div>
        <div class="col-12 col-md-6">
          <GDropdown
            v-model="pekerjaanTerkini"
            label="Pekerjaan Terkini"
            placeholder="Pilih pekerjaan terkini"
            :items="pekerjaanOptions"
            item-value="value"
            item-text="label"
            :disabled="isReadOnly"
            :use-bottom-sheet="isMobile"
          />
        </div>

        <!-- Row 8: Agama & Rata - Rata Penghasilan -->
        <div class="col-12 col-md-6">
          <GDropdown
            v-model="agama"
            label="Agama"
            placeholder="Pilih agama"
            :items="agamaOptions"
            item-value="value"
            item-text="label"
            :disabled="isReadOnly"
            :use-bottom-sheet="isMobile"
          />
        </div>
        <div class="col-12 col-md-6">
          <GDropdown
            v-model="rataPenghasilan"
            label="Rata - Rata Penghasilan"
            placeholder="Pilih rata-rata penghasilan"
            :items="penghasilanOptions"
            item-value="value"
            item-text="label"
            :disabled="isReadOnly"
            :use-bottom-sheet="isMobile"
          />
        </div>
      </div>
    </ModuleSectionCard>
  </div>
</template>

<style scoped lang="scss">
.bo-detail-sections-container {
  display: flex;
  flex-direction: column;
  width: 100%;

  // Read-only Key-Value Text styling (Figma Nodes 11752:121098 & 11752:120905)
  .bo-read-row {
    margin-bottom: 12px;
    line-height: 24px;
    font-size: 16px;
    font-family: var(--g-kit-font-family, 'Nunito Sans', sans-serif);

    &:last-child {
      margin-bottom: 0;
    }
  }

  .bo-read-label {
    width: 164px;
    flex-shrink: 0;
    font-weight: 800;
    color: var(--g-kit-black-80, #252528);
    word-break: break-word;
  }

  .bo-read-colon {
    width: 16px;
    flex-shrink: 0;
    font-weight: 600;
    color: var(--g-kit-black-80, #252528);
    text-align: left;
  }

  .bo-read-value {
    flex-grow: 1;
    font-weight: 600;
    color: var(--g-kit-black-80, #252528);
    word-break: break-word;
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

  :deep(input:disabled),
  :deep(textarea:disabled),
  :deep(.form-control:disabled) {
    background-color: var(--g-kit-black-20, #eeeeef) !important;
    border-color: var(--g-kit-black-20, #eeeeef) !important;
    color: var(--g-kit-black-60, #58585b) !important;
    cursor: not-allowed !important;
  }

  :deep(.custom-input-group-icon:has(input:disabled)),
  :deep(.custom-input-group-icon:has(.form-control:disabled)) {
    background-color: var(--g-kit-black-20, #eeeeef) !important;
    border-color: var(--g-kit-black-20, #eeeeef) !important;
    cursor: not-allowed !important;
    pointer-events: none !important;

    input,
    .form-control {
      background-color: transparent !important;
      border: none !important;
      color: var(--g-kit-black-60, #58585b) !important;
      cursor: not-allowed !important;
    }

    .input-group-icon img {
      opacity: 0.6;
    }
  }

  :deep(.group-input:has(.error-text)) {
    .input-group {
      border-color: var(--g-kit-red-50, #d92d20) !important;
    }
  }
}

.bo-field-with-error {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.field-error-text {
  color: var(--g-kit-red-50, #ae1e22);
  font-family: 'Nunito Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  margin-top: 6px;
}
</style>