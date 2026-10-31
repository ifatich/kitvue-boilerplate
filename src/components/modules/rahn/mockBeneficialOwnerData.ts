/**
 * @file mockBeneficialOwnerData.ts
 * @description Dynamic Data Repository & Presets for Beneficial Owner (KTP & Paspor).
 * Provides mock records for both positive (has value / terdaftar) and negative (not found / tidak terdaftar)
 * flows conforming strictly to Figma specifications:
 * - KTP Positive Flow: NIK 3204 1111 1298 0003 (2 records) -> Figma Node 12920:311792
 * - KTP Negative Flow: NIK 3204 2849 1298 0003 (0 records / Not Found) -> Figma Node 11347:151730
 * - Paspor Positive Flow: No. Paspor 0033 9714 84 (1 record) -> Figma Node 11347:158046
 * - Paspor Negative Flow: No. Paspor 0099 9999 99 (0 records / Not Found) -> Tambah BO Paspor
 */

export interface BeneficialOwnerItem {
  id: string
  no?: number
  registrationNumber: string
  name: string
  nik: string
  pasporNumber?: string
  birthDate: string
  motherName: string
  birthPlace?: string
  gender: string
  job: string
  address: string
  phone: string
  branch: string
  isDukcapilVerified: boolean
  masaBerlaku?: string
  // Detail fields
  pendidikan?: string
  statusPerkawinan?: string
  namaPasangan?: string
  tanggalLahirPasangan?: string
  jumlahTanggungan?: string
  nomorTelepon?: string
  email?: string
  nomorNpwp?: string
  kewarganegaraan?: string
  tipeKependudukan?: string
  sumberDana?: string
  agama?: string
  rataPenghasilan?: string
  // Address breakdown
  kodePos?: string
  provinsi?: string
  kotaKab?: string
  kecamatan?: string
  kelurahan?: string
  rt?: string
  rw?: string
  // Residential / Domisili Address breakdown (Figma 11752:121098)
  domKodePos?: string
  domProvinsi?: string
  domKotaKab?: string
  domKecamatan?: string
  domKelurahan?: string
  domRt?: string
  domRw?: string
  domAlamatRumah?: string
}

export interface BeneficialOwnerPreset {
  id: string
  identityType: 'ktp' | 'paspor'
  value: string
  label: string
  hasValue: boolean
  description: string
  expectedCount: number
}

/**
 * Normalizes identity number by stripping all whitespace and converting to uppercase.
 */
export function normalizeIdentityNumber(val?: string): string {
  if (!val) return ''
  return val.replace(/\s+/g, '').toUpperCase()
}

/**
 * Ready-to-use Preset Configurations for QA, testing, and UI simulation.
 */
export const BENEFICIAL_OWNER_PRESETS: BeneficialOwnerPreset[] = [
  {
    id: 'ktp-found',
    identityType: 'ktp',
    value: '3204 1111 1298 0003',
    label: 'NIK Terdaftar (2 Data)',
    hasValue: true,
    description: 'NIK terdaftar di sistem dengan 2 nomor registrasi (Anastasya Delistya)',
    expectedCount: 2,
  },
  {
    id: 'ktp-not-found',
    identityType: 'ktp',
    value: '3204 2849 1298 0003',
    label: 'NIK Tidak Terdaftar',
    hasValue: false,
    description: 'NIK belum terdaftar (Memicu alur negatif & TAMBAH Beneficial Owner)',
    expectedCount: 0,
  },
  {
    id: 'paspor-found',
    identityType: 'paspor',
    value: '0033 9714 84',
    label: 'Paspor Terdaftar (1 Data)',
    hasValue: true,
    description: 'Nomor Paspor terdaftar di sistem (Anastasya Delistya)',
    expectedCount: 1,
  },
  {
    id: 'paspor-not-found',
    identityType: 'paspor',
    value: '0099 9999 99',
    label: 'Paspor Tidak Terdaftar',
    hasValue: false,
    description: 'Nomor Paspor belum terdaftar (Memicu alur negatif & TAMBAH Beneficial Owner)',
    expectedCount: 0,
  },
]

/**
 * Mock Database of Beneficial Owners
 */
export const MOCK_BENEFICIAL_OWNERS: BeneficialOwnerItem[] = [
  {
    id: 'bo-1',
    no: 1,
    registrationNumber: '1234 1234',
    name: 'Anastasya Delistya',
    nik: '3204 1111 1298 0003',
    pasporNumber: '0033 9714 84',
    birthDate: '12 Januari 1999',
    motherName: 'Putri',
    birthPlace: 'Jakarta',
    gender: 'Perempuan',
    job: 'Karyawan Swasta',
    address: 'Jl. Borobudur No. 10',
    phone: '0812 2345 3456',
    branch: 'Cabang Salemba',
    isDukcapilVerified: true,
    masaBerlaku: 'Seumur Hidup',
    pendidikan: 'S1',
    statusPerkawinan: 'Menikah',
    namaPasangan: 'Annisya syaban',
    tanggalLahirPasangan: '12 Januari 1993',
    jumlahTanggungan: '4',
    nomorTelepon: '0214 2345 5',
    email: 'anatasya@gmail.com',
    nomorNpwp: '99.999.999.9-999.000',
    kewarganegaraan: 'WNI',
    tipeKependudukan: 'Penduduk',
    sumberDana: 'Gaji',
    agama: 'Islam',
    rataPenghasilan: '5 - 10 Juta',
    kodePos: '10320',
    provinsi: 'DKI Jakarta',
    kotaKab: 'Jakarta Pusat',
    kecamatan: 'Menteng',
    kelurahan: 'Pegangsaan',
    rt: '001',
    rw: '002',
    // Domisili Address (Figma 11752:121098 - Alamat Tidak Sesuai KTP)
    domKodePos: '10321',
    domProvinsi: 'DKI Jakarta',
    domKotaKab: 'Jakarta Selatan',
    domKecamatan: 'Mampang',
    domKelurahan: 'Pela Mampang',
    domRt: '001',
    domRw: '002',
    domAlamatRumah: 'Jl. A No. 10',
  },
  {
    id: 'bo-2',
    no: 2,
    registrationNumber: '1234 2222',
    name: 'Anastasya Delistya',
    nik: '3204 1111 1298 0003',
    // Not linked to paspor so paspor search yields exactly 1 record
    birthDate: '9 Desember 1998',
    motherName: 'Annisya',
    birthPlace: 'Jakarta',
    gender: 'Perempuan',
    job: 'Pegawai Swasta',
    address: 'Pertokoan Kenari Baru, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10430',
    phone: '0812 2345 3456',
    branch: 'Cabang Salemba',
    isDukcapilVerified: true,
    pendidikan: 'S1',
    statusPerkawinan: 'Menikah',
    namaPasangan: 'Annisya Syaban',
    tanggalLahirPasangan: '12 Januari 1993',
    jumlahTanggungan: '2',
    nomorTelepon: '0214 2345 5',
    email: 'thoriqsadad@gmail.com',
    nomorNpwp: '99.999.999.9-999.000',
    kewarganegaraan: 'WNI',
    tipeKependudukan: 'Penduduk',
    sumberDana: 'Gaji',
    agama: 'Islam',
    rataPenghasilan: '5 - 10 Juta',
    kodePos: '10320',
    provinsi: 'DKI Jakarta',
    kotaKab: 'Jakarta Pusat',
    kecamatan: 'Menteng',
    kelurahan: 'Pegangsaan',
    rt: '001',
    rw: '002',
  },
  {
    id: 'bo-3',
    no: 3,
    registrationNumber: '5678 1111',
    name: 'Budi Santoso',
    nik: '3204 5555 1298 0001',
    pasporNumber: '0077 1234 56',
    birthDate: '14 Mei 1990',
    motherName: 'Siti Rahmah',
    birthPlace: 'Bandung',
    gender: 'Laki-laki',
    job: 'Wiraswasta',
    address: 'Jl. Juanda No. 12, RT 003 / RW 004, Kel. Dago, Kec. Coblong, Kota Bandung',
    phone: '0813 9876 5432',
    branch: 'Cabang Dago',
    isDukcapilVerified: true,
    pendidikan: 'S2',
    statusPerkawinan: 'Menikah',
    namaPasangan: 'Ratna Sari',
    tanggalLahirPasangan: '20 Agustus 1992',
    jumlahTanggungan: '3',
    nomorTelepon: '0222 3456 7',
    email: 'budi.santoso@example.com',
    nomorNpwp: '88.888.888.8-888.000',
    kewarganegaraan: 'WNI',
    tipeKependudukan: 'Penduduk',
    sumberDana: 'Hasil Usaha',
    agama: 'Islam',
    rataPenghasilan: '> 10 Juta',
    kodePos: '40135',
    provinsi: 'Jawa Barat',
    kotaKab: 'Kota Bandung',
    kecamatan: 'Coblong',
    kelurahan: 'Dago',
    rt: '003',
    rw: '004',
  },
]

/**
 * Searches the Beneficial Owner dataset dynamically.
 * Matches normalized NIK or Paspor number.
 */
export function searchBeneficialOwnerList(
  identityType: 'ktp' | 'paspor' | '',
  identityNumber?: string,
): BeneficialOwnerItem[] {
  if (!identityType || !identityNumber) return []
  const cleanInput = normalizeIdentityNumber(identityNumber)
  if (!cleanInput) return []

  if (identityType === 'ktp') {
    return MOCK_BENEFICIAL_OWNERS
      .filter((item) => normalizeIdentityNumber(item.nik) === cleanInput)
      .map((item, index) => ({
        ...item,
        no: index + 1,
      }))
  }

  if (identityType === 'paspor') {
    return MOCK_BENEFICIAL_OWNERS
      .filter((item) => item.pasporNumber && normalizeIdentityNumber(item.pasporNumber) === cleanInput)
      .map((item, index) => ({
        ...item,
        no: index + 1,
      }))
  }

  return []
}

/**
 * Resolves a Beneficial Owner record by id, registrationNumber, nik, or paspor.
 * Normalizes input and fields to handle whitespace and casing discrepancies.
 *
 * @param id - Record identifier string (ID, registration number, NIK, or passport number).
 * @returns Matched BeneficialOwnerItem or undefined.
 */
export function findBeneficialOwnerById(id?: string): BeneficialOwnerItem | undefined {
  if (!id) return undefined
  const trimmed = id.trim()
  if (!trimmed) return undefined
  const clean = normalizeIdentityNumber(id)

  return MOCK_BENEFICIAL_OWNERS.find(
    (b) =>
      b.id === trimmed ||
      b.id.toLowerCase() === trimmed.toLowerCase() ||
      normalizeIdentityNumber(b.registrationNumber) === clean ||
      normalizeIdentityNumber(b.nik) === clean ||
      (b.pasporNumber && normalizeIdentityNumber(b.pasporNumber) === clean),
  )
}

