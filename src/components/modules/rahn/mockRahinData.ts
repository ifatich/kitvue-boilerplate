/**
 * @file mockRahinData.ts
 * @description Centralized Single Source of Truth state machine & mock repository
 * for Pinjaman Rahn Step 2 (Data Rahin Desktop).
 * Conforms 1:1 with Figma node 11347:160520, 11790:130756, 11347:160879,
 * and PROJECT.md § Interface Contracts.
 */

export type RahinType = 'perorangan' | 'badan_usaha' | ''
export type IdentityType = 'ktp' | 'paspor' | ''
export type RahinStatus = 'syariah' | 'konvensional'
export type DukcapilStatus = 'valid' | 'tidak_sesuai' | 'belum_cek'
export type PelaksanaIdentityType = 'ktp' | 'paspor'
export type MasaBerlakuType = 'seumur_hidup' | 'sampai_dengan'

export interface LoanPortfolioItem {
  no: number
  nomorKontrakMasked: string
  namaProduk: string
  nominalMasked: string
  kolektabilitas: string // e.g. '1 - Lancar', '2 - DPK', '3 - Kurang Lancar'
  kolektabilitasScore: number // 1 to 5 for sorting
  statusKredit: 'Aktif' | 'Lunas'
}

export interface RahinCifItem {
  id: string
  statusRahin: RahinStatus
  nomorCif: string
  namaRahin: string
  ratingRahin: string // 'Platinum Plus', 'Platinum', 'Gold', 'Silver', 'Bronze', 'Diamond', 'Classic', 'Platinum Plus Holding'
  nomorIdentitasMasked: string
  rawIdentitas: string
  jenisIdentitas: IdentityType
  tanggalLahir: string
  verifikasiDukcapil: DukcapilStatus
  namaIbuKandung: string
  jenisKelamin: 'Laki-laki' | 'Perempuan'
  alamatRumah: string
  noHp: string
  cabangPembuka: string
}

export interface PelaksanaTransaksiState {
  isActive: boolean
  identityType: PelaksanaIdentityType
  nik: string
  nomorPaspor: string
  namaLengkap: string
  namaIbuKandung: string
  tempatLahir: string
  tanggalLahir: string
  jenisKelamin: string
  agama: string
  pekerjaan: string
  nomorHandphone: string
  jabatan: string
  kewarganegaraan: string // Locked to 'WNI' for KTP; selectable for Paspor
  masaBerlakuType: MasaBerlakuType
  tanggalBerlakuSampai: string
  hubunganDenganRahin: string
  suratKuasaFileUrl: string | null
  figmaNodeId: string // '11347:172827' (KTP) or '11347:170073' (Paspor)
}

export interface Step2State {
  search: {
    tipeRahin: RahinType
    jenisIdentitas: IdentityType
    nomorIdentitas: string
    isSubmitted: boolean
    validationErrors: {
      tipeRahin?: string
      jenisIdentitas?: string
      nomorIdentitas?: string
    }
  }
  selectedCifId: string | null
  warningAlertMessage: string | null
  currentView: 'search' | 'cif_table' | 'detail_syariah' | 'convert_konven' | 'tambah_baru'
  portfolioList: LoanPortfolioItem[]
  cifList: RahinCifItem[]
  pelaksana: PelaksanaTransaksiState
}

export interface RahinPreset {
  id: string
  label: string
  description: string
  tipeRahin: RahinType
  jenisIdentitas: IdentityType
  nomorIdentitas: string
  scenario: 'syariah_found' | 'konven_only' | 'paspor_found' | 'not_found'
}

/**
 * Normalizes identity number by stripping whitespace and uppercase.
 */
export function normalizeIdentityNumber(val?: string): string {
  if (!val) return ''
  return val.replace(/\s+/g, '').toUpperCase()
}

/**
 * Normalizes date to ISO format YYYY-MM-DD.
 * Converts Indonesian text (e.g. '01 Januari 1990') or slash format (e.g. '01/01/1990')
 * or handles corrupted 'NaN/NaN/...' strings safely.
 */
export function normalizeDateToIso(val?: string): string {
  if (!val) return ''
  let trimmed = val.trim()
  if (trimmed.includes('NaN')) {
    trimmed = trimmed.replace(/NaN\/NaN\//g, '').replace(/NaN/g, '').trim()
  }
  if (!trimmed) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed
  }
  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (slashMatch) {
    const [, d, m, y] = slashMatch
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }
  const indoMonths: Record<string, string> = {
    januari: '01',
    februari: '02',
    maret: '03',
    april: '04',
    mei: '05',
    juni: '06',
    juli: '07',
    agustus: '08',
    september: '09',
    oktober: '10',
    november: '11',
    desember: '12',
    jan: '01',
    feb: '02',
    mar: '03',
    apr: '04',
    jun: '06',
    jul: '07',
    agu: '08',
    ags: '08',
    sep: '09',
    okt: '10',
    nov: '11',
    des: '12',
  }
  const textMatch = trimmed.match(/^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})$/)
  if (textMatch) {
    const [, d, mStr, y] = textMatch
    const mNum = indoMonths[mStr.toLowerCase()]
    if (mNum) {
      return `${y}-${mNum}-${d.padStart(2, '0')}`
    }
  }
  return trimmed
}

/**
 * Masks identity string: displays first 4 and last 4, middle digits masked.
 */
export function formatMaskedIdentity(val: string, type: IdentityType): string {
  const clean = normalizeIdentityNumber(val)
  if (type === 'ktp') {
    if (clean.length < 16) return val
    return `${clean.slice(0, 4)} **** **** ${clean.slice(12, 16)}`
  }
  if (clean.length <= 4) return clean
  return `${clean.slice(0, 4)} **** ${clean.slice(-2)}`
}

/**
 * Sorts loan portfolio items strictly per business rule (Figma Node 11347:166514):
 * 1. Kolektabilitas score: ascending 1 to 5 (Kol1 - Lancar -> Kol5 - Macet)
 * 2. Status Kredit: 'Aktif' before 'Lunas'
 */
export function sortLoanPortfolio(items: LoanPortfolioItem[]): LoanPortfolioItem[] {
  return [...items].sort((a, b) => {
    if (a.kolektabilitasScore !== b.kolektabilitasScore) {
      return a.kolektabilitasScore - b.kolektabilitasScore
    }
    if (a.statusKredit === 'Aktif' && b.statusKredit === 'Lunas') return -1
    if (a.statusKredit === 'Lunas' && b.statusKredit === 'Aktif') return 1
    return a.no - b.no
  })
}

// ==========================================
// MOCK DATASETS
// ==========================================

export const MOCK_LOAN_PORTFOLIO_SYARIAH: LoanPortfolioItem[] = [
  {
    no: 1,
    nomorKontrakMasked: '6078 **** **** 1001',
    namaProduk: 'RAHN (Gadai Syariah)',
    nominalMasked: 'Rp ***.300.000,00',
    kolektabilitas: '1 - Lancar',
    kolektabilitasScore: 1,
    statusKredit: 'Aktif',
  },
  {
    no: 2,
    nomorKontrakMasked: '6078 **** **** 1002',
    namaProduk: 'AMANAH (Kendaraan Bermotor)',
    nominalMasked: 'Rp ***.500.000,00',
    kolektabilitas: '1 - Lancar',
    kolektabilitasScore: 1,
    statusKredit: 'Aktif',
  },
  {
    no: 3,
    nomorKontrakMasked: '6078 **** **** 1003',
    namaProduk: 'ARRUM BPKB',
    nominalMasked: 'Rp ***.000.000,00',
    kolektabilitas: '2 - DPK (Dalam Perhatian Khusus)',
    kolektabilitasScore: 2,
    statusKredit: 'Lunas',
  },
]

export const MOCK_LOAN_PORTFOLIO_KONVEN: LoanPortfolioItem[] = [
  {
    no: 1,
    nomorKontrakMasked: '1029 **** **** 2001',
    namaProduk: 'KCA (Kredit Cepat Aman)',
    nominalMasked: 'Rp ***.200.000,00',
    kolektabilitas: '1 - Lancar',
    kolektabilitasScore: 1,
    statusKredit: 'Aktif',
  },
  {
    no: 2,
    nomorKontrakMasked: '1029 **** **** 2002',
    namaProduk: 'KRASIDA (Gadai Emas)',
    nominalMasked: 'Rp ***.800.000,00',
    kolektabilitas: '1 - Lancar',
    kolektabilitasScore: 1,
    statusKredit: 'Lunas',
  },
]

export const MOCK_LOAN_PORTFOLIO_PASPOR: LoanPortfolioItem[] = [
  {
    no: 1,
    nomorKontrakMasked: '8839 **** **** 3001',
    namaProduk: 'RAHN BISNIS',
    nominalMasked: 'Rp ***.000.000,00',
    kolektabilitas: '1 - Lancar',
    kolektabilitasScore: 1,
    statusKredit: 'Aktif',
  },
]

export const MOCK_RAHIN_CIF_DATABASE: RahinCifItem[] = [
  // 1. Syariah CIF - Anastasya Delistya (KTP Syariah Found)
  {
    id: 'cif-sya-01',
    statusRahin: 'syariah',
    nomorCif: '1234 1234 01',
    namaRahin: 'Anastasya Delistya',
    ratingRahin: 'Platinum Plus',
    nomorIdentitasMasked: '3204 **** **** 0003',
    rawIdentitas: '3204111112980003',
    jenisIdentitas: 'ktp',
    tanggalLahir: '1 Januari 1990',
    verifikasiDukcapil: 'valid',
    namaIbuKandung: 'Putri',
    jenisKelamin: 'Perempuan',
    alamatRumah: 'Pertokoan Kenari Baru, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10430',
    noHp: '0812 2345 3456',
    cabangPembuka: 'Cabang Boulevard',
  },
  // 2. Konvensional CIF - Anastasya Delistya (Associated Konven record)
  {
    id: 'cif-kon-01',
    statusRahin: 'konvensional',
    nomorCif: '1234 1234 02',
    namaRahin: 'Anastasya Delistya',
    ratingRahin: 'Gold',
    nomorIdentitasMasked: '3204 **** **** 0003',
    rawIdentitas: '3204111112980003',
    jenisIdentitas: 'ktp',
    tanggalLahir: '1 Januari 1990',
    verifikasiDukcapil: 'valid',
    namaIbuKandung: 'Putri',
    jenisKelamin: 'Perempuan',
    alamatRumah: 'Pertokoan Kenari Baru, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10430',
    noHp: '0812 2345 3456',
    cabangPembuka: 'Cabang Senen',
  },
  // 2b-2g. Anastasya Delistya 6 Records (Figma Node 11347:160879 / Screenshot NIK 3204 2849 1298 0003)
  {
    id: 'cif-ana-01',
    statusRahin: 'konvensional',
    nomorCif: '1234 1234 01',
    namaRahin: 'Anastasya Delistya',
    ratingRahin: 'Platinum Plus',
    nomorIdentitasMasked: '3204 **** **** 0003',
    rawIdentitas: '3204284912980003',
    jenisIdentitas: 'ktp',
    tanggalLahir: '1990-01-01',
    verifikasiDukcapil: 'valid',
    namaIbuKandung: 'Putri',
    jenisKelamin: 'Perempuan',
    alamatRumah: 'Pertokoan Kenari Baru, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10430',
    noHp: '0812 2345 3456',
    cabangPembuka: 'Cabang Boulevard',
  },
  {
    id: 'cif-ana-04',
    statusRahin: 'konvensional',
    nomorCif: '1234 1234 04',
    namaRahin: 'Anastasya Delistya',
    ratingRahin: 'Platinum',
    nomorIdentitasMasked: '3204 **** **** 0003',
    rawIdentitas: '3204284912980003',
    jenisIdentitas: 'ktp',
    tanggalLahir: '1990-01-01',
    verifikasiDukcapil: 'valid',
    namaIbuKandung: 'Putri',
    jenisKelamin: 'Perempuan',
    alamatRumah: 'Pertokoan Kenari Baru, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10430',
    noHp: '0812 2345 3456',
    cabangPembuka: 'Cabang Senen',
  },
  {
    id: 'cif-ana-05',
    statusRahin: 'konvensional',
    nomorCif: '1234 1234 05',
    namaRahin: 'Anastasya Delistya',
    ratingRahin: 'Platinum',
    nomorIdentitasMasked: '3204 **** **** 0003',
    rawIdentitas: '3204284912980003',
    jenisIdentitas: 'ktp',
    tanggalLahir: '1990-01-01',
    verifikasiDukcapil: 'valid',
    namaIbuKandung: 'Putri',
    jenisKelamin: 'Perempuan',
    alamatRumah: 'Pertokoan Kenari Baru, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10430',
    noHp: '0812 2345 3456',
    cabangPembuka: 'Cabang Boulevard',
  },
  {
    id: 'cif-ana-08',
    statusRahin: 'konvensional',
    nomorCif: '1234 1234 08',
    namaRahin: 'Anastasya Delistya',
    ratingRahin: 'Platinum',
    nomorIdentitasMasked: '3204 **** **** 0003',
    rawIdentitas: '3204284912980003',
    jenisIdentitas: 'ktp',
    tanggalLahir: '1990-01-01',
    verifikasiDukcapil: 'valid',
    namaIbuKandung: 'Putri',
    jenisKelamin: 'Perempuan',
    alamatRumah: 'Pertokoan Kenari Baru, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10430',
    noHp: '0812 2345 3456',
    cabangPembuka: 'Cabang Kramat',
  },
  {
    id: 'cif-ana-09',
    statusRahin: 'konvensional',
    nomorCif: '1234 1234 09',
    namaRahin: 'Anastasya Delistya',
    ratingRahin: 'Platinum',
    nomorIdentitasMasked: '3204 **** **** 0003',
    rawIdentitas: '3204284912980003',
    jenisIdentitas: 'ktp',
    tanggalLahir: '1990-01-01',
    verifikasiDukcapil: 'valid',
    namaIbuKandung: 'Putri',
    jenisKelamin: 'Perempuan',
    alamatRumah: 'Pertokoan Kenari Baru, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10430',
    noHp: '0812 2345 3456',
    cabangPembuka: 'Cabang Boulevard',
  },
  {
    id: 'cif-ana-10',
    statusRahin: 'konvensional',
    nomorCif: '1234 1234 10',
    namaRahin: 'Anastasya Delistya',
    ratingRahin: 'Platinum',
    nomorIdentitasMasked: '3204 **** **** 0003',
    rawIdentitas: '3204284912980003',
    jenisIdentitas: 'ktp',
    tanggalLahir: '1990-01-01',
    verifikasiDukcapil: 'valid',
    namaIbuKandung: 'Putri',
    jenisKelamin: 'Perempuan',
    alamatRumah: 'Pertokoan Kenari Baru, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10430',
    noHp: '0812 2345 3456',
    cabangPembuka: 'Cabang Senen',
  },
  // 3. Konvensional Only CIF - Budi Santoso (Case 1)
  {
    id: 'cif-kon-02',
    statusRahin: 'konvensional',
    nomorCif: '5678 5678 01',
    namaRahin: 'Budi Santoso',
    ratingRahin: 'Silver',
    nomorIdentitasMasked: '3204 **** **** 0004',
    rawIdentitas: '3204222212980004',
    jenisIdentitas: 'ktp',
    tanggalLahir: '1985-05-15',
    verifikasiDukcapil: 'valid',
    namaIbuKandung: 'Siti Aminah',
    jenisKelamin: 'Laki-laki',
    alamatRumah: 'Jl. Kramat Raya No. 45, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10450',
    noHp: '0813 9876 5432',
    cabangPembuka: 'Cabang Kramat',
  },
  // 4. Paspor Found CIF - Robert Smith (Paspor Syariah)
  {
    id: 'cif-pas-01',
    statusRahin: 'syariah',
    nomorCif: '9012 9012 01',
    namaRahin: 'Robert Smith',
    ratingRahin: 'Diamond',
    nomorIdentitasMasked: '0033 **** 84',
    rawIdentitas: '0033971484',
    jenisIdentitas: 'paspor',
    tanggalLahir: '1982-07-20',
    verifikasiDukcapil: 'tidak_sesuai', // Paspor is non-Dukcapil or manual verified
    namaIbuKandung: 'Mary Smith',
    jenisKelamin: 'Laki-laki',
    alamatRumah: 'Apartemen Sudirman Tower A Lt. 12, Jakarta Selatan, DKI Jakarta 12190',
    noHp: '0811 1234 5678',
    cabangPembuka: 'Cabang Sudirman Syariah',
  },
]

// ==========================================
// PRESETS
// ==========================================

export const KTP_SYARIAH_FOUND: RahinPreset = {
  id: 'ktp_syariah_found',
  label: 'KTP Syariah (Case 2: Ada CIF Syariah)',
  description: 'NIK 3204 1111 1298 0003 - Memiliki CIF Syariah dan Konvensional (Anastasya Delistya)',
  tipeRahin: 'perorangan',
  jenisIdentitas: 'ktp',
  nomorIdentitas: '3204 1111 1298 0003',
  scenario: 'syariah_found',
}

export const KTP_KONVEN_ONLY: RahinPreset = {
  id: 'ktp_konven_only',
  label: 'KTP Konven Only (Case 1: Konversi CIF)',
  description: 'NIK 3204 2222 1298 0004 - Hanya memiliki CIF Konvensional (Budi Santoso)',
  tipeRahin: 'perorangan',
  jenisIdentitas: 'ktp',
  nomorIdentitas: '3204 2222 1298 0004',
  scenario: 'konven_only',
}

export const PASPOR_FOUND: RahinPreset = {
  id: 'paspor_found',
  label: 'Paspor (Robert Smith)',
  description: 'No. Paspor 0033 9714 84 - CIF Syariah Paspor terdaftar',
  tipeRahin: 'perorangan',
  jenisIdentitas: 'paspor',
  nomorIdentitas: '0033 9714 84',
  scenario: 'paspor_found',
}

export const NOT_FOUND: RahinPreset = {
  id: 'not_found',
  label: 'Data Tidak Ditemukan (Case 3)',
  description: 'NIK 3204 9999 9999 9999 - Memicu alur pendaftaran Rahin Baru',
  tipeRahin: 'perorangan',
  jenisIdentitas: 'ktp',
  nomorIdentitas: '3204 9999 9999 9999',
  scenario: 'not_found',
}

export const RAHIN_PRESETS: RahinPreset[] = [
  KTP_SYARIAH_FOUND,
  KTP_KONVEN_ONLY,
  PASPOR_FOUND,
  NOT_FOUND,
]

// ==========================================
// LOOKUP SERVICE
// ==========================================

export function searchRahinCif(
  _tipe: RahinType,
  jenis: IdentityType,
  nomor: string,
): { cifList: RahinCifItem[]; portfolioList: LoanPortfolioItem[] } {
  const clean = normalizeIdentityNumber(nomor)
  if (!clean) {
    return { cifList: [], portfolioList: [] }
  }

  const matches = MOCK_RAHIN_CIF_DATABASE.filter(
    (item) =>
      item.jenisIdentitas === jenis &&
      item.rawIdentitas === clean,
  )

  let portfolio: LoanPortfolioItem[] = []
  if (matches.length > 0) {
    if (jenis === 'paspor') {
      portfolio = sortLoanPortfolio(MOCK_LOAN_PORTFOLIO_PASPOR)
    } else if (clean === '3204284912980003' || matches.some((m) => m.statusRahin === 'syariah')) {
      portfolio = sortLoanPortfolio(MOCK_LOAN_PORTFOLIO_SYARIAH)
    } else {
      portfolio = sortLoanPortfolio(MOCK_LOAN_PORTFOLIO_KONVEN)
    }
  }

  return {
    cifList: matches,
    portfolioList: portfolio,
  }
}

export function createDefaultPelaksanaState(): PelaksanaTransaksiState {
  return {
    isActive: false,
    identityType: 'ktp',
    nik: '',
    nomorPaspor: '',
    namaLengkap: '',
    namaIbuKandung: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: '',
    agama: '',
    pekerjaan: '',
    nomorHandphone: '',
    jabatan: '',
    kewarganegaraan: 'WNI',
    masaBerlakuType: 'seumur_hidup',
    tanggalBerlakuSampai: '',
    hubunganDenganRahin: '',
    suratKuasaFileUrl: null,
    figmaNodeId: '11347:172827',
  }
}

export function createInitialStep2State(): Step2State {
  return {
    search: {
      tipeRahin: '',
      jenisIdentitas: '',
      nomorIdentitas: '',
      isSubmitted: false,
      validationErrors: {},
    },
    selectedCifId: null,
    warningAlertMessage: null,
    currentView: 'search',
    portfolioList: [],
    cifList: [],
    pelaksana: createDefaultPelaksanaState(),
  }
}

// ==========================================
// POSTAL CODE DIRECTORY & LOOKUP (Figma 11347:172987)
// ==========================================

export interface PostalCodeLocation {
  kodePos: string
  kelurahan: string
  kecamatan: string
  kotaKab: string
  provinsi: string
}

export const POSTAL_CODE_DIRECTORY: Record<string, PostalCodeLocation> = {
  '10320': {
    kodePos: '10320',
    kelurahan: 'Pegangsaan',
    kecamatan: 'Menteng',
    kotaKab: 'Kota Jakarta Pusat',
    provinsi: 'DKI Jakarta',
  },
  '10430': {
    kodePos: '10430',
    kelurahan: 'Kenari',
    kecamatan: 'Senen',
    kotaKab: 'Kota Jakarta Pusat',
    provinsi: 'DKI Jakarta',
  },
  '10450': {
    kodePos: '10450',
    kelurahan: 'Kramat',
    kecamatan: 'Senen',
    kotaKab: 'Kota Jakarta Pusat',
    provinsi: 'DKI Jakarta',
  },
  '12190': {
    kodePos: '12190',
    kelurahan: 'Senayan',
    kecamatan: 'Kebayoran Baru',
    kotaKab: 'Kota Jakarta Selatan',
    provinsi: 'DKI Jakarta',
  },
  '40115': {
    kodePos: '40115',
    kelurahan: 'Braga',
    kecamatan: 'Sumur Bandung',
    kotaKab: 'Kota Bandung',
    provinsi: 'Jawa Barat',
  },
  '60271': {
    kodePos: '60271',
    kelurahan: 'Embong Kaliasin',
    kecamatan: 'Genteng',
    kotaKab: 'Kota Surabaya',
    provinsi: 'Jawa Timur',
  },
}

export function lookupPostalCode(kodePos: string): PostalCodeLocation | null {
  if (!kodePos) return null
  const clean = kodePos.trim()
  return POSTAL_CODE_DIRECTORY[clean] || null
}

// ==========================================
// PELAKSANA TRANSAKSI PRESETS (Figma 11347:172827 & 11347:170073)
// ==========================================

export const PELAKSANA_KTP_PRESET: PelaksanaTransaksiState = {
  isActive: true,
  identityType: 'ktp',
  nik: '3204 1234 5678 0001',
  nomorPaspor: '',
  namaLengkap: 'Bambang Sudarsono',
  namaIbuKandung: 'Siti Aminah',
  tempatLahir: 'Bandung',
  tanggalLahir: '1988-04-12',
  jenisKelamin: 'Laki-laki',
  agama: 'Islam',
  pekerjaan: 'Karyawan Swasta',
  nomorHandphone: '0812 3456 7890',
  jabatan: 'Manager Operasional',
  kewarganegaraan: 'WNI',
  masaBerlakuType: 'seumur_hidup',
  tanggalBerlakuSampai: '',
  hubunganDenganRahin: 'Kuasa',
  suratKuasaFileUrl: 'surat_kuasa_bambang.pdf',
  figmaNodeId: '11347:172827',
}

export const PELAKSANA_PASPOR_PRESET: PelaksanaTransaksiState = {
  isActive: true,
  identityType: 'paspor',
  nik: '',
  nomorPaspor: 'B12345678',
  namaLengkap: 'David Michael',
  namaIbuKandung: 'Sarah Jenkins',
  tempatLahir: 'Melbourne',
  tanggalLahir: '1985-08-25',
  jenisKelamin: 'Laki-laki',
  agama: 'Kristen',
  pekerjaan: 'Tenaga Ahli',
  nomorHandphone: '0813 9876 5432',
  jabatan: 'Advisor',
  kewarganegaraan: 'WNA',
  masaBerlakuType: 'sampai_dengan',
  tanggalBerlakuSampai: '2028-12-31',
  hubunganDenganRahin: 'Kuasa',
  suratKuasaFileUrl: 'surat_kuasa_david.pdf',
  figmaNodeId: '11347:170073',
}

export function calculateAge(birthDate?: string): string {
  if (!birthDate) return ''
  const trimmed = birthDate.trim()
  let birthYear = 0
  let birthMonth = 0
  let birthDay = 0

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const parts = trimmed.split('-')
    birthYear = parseInt(parts[0], 10)
    birthMonth = parseInt(parts[1], 10) - 1
    birthDay = parseInt(parts[2], 10)
  } else {
    // Indonesian string e.g. "1 Januari 1990"
    const months: Record<string, number> = {
      januari: 0, februari: 1, maret: 2, april: 3, mei: 4, juni: 5,
      juli: 6, agustus: 7, september: 8, oktober: 9, november: 10, desember: 11,
    }
    const parts = trimmed.split(/\s+/)
    if (parts.length === 3) {
      birthDay = parseInt(parts[0], 10)
      birthMonth = months[parts[1].toLowerCase()] ?? 0
      birthYear = parseInt(parts[2], 10)
    }
  }

  if (!birthYear || isNaN(birthYear)) return ''

  const today = new Date()
  let age = today.getFullYear() - birthYear
  const monthDiff = today.getMonth() - birthMonth
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDay)) {
    age--
  }

  return age >= 0 ? `${age} Tahun` : ''
}

export interface DukcapilRecord {
  nik: string
  nama: string
  tempatLahir: string
  tanggalLahir: string
  jenisKelamin: string
  namaIbuKandung: string
  agama: string
  pekerjaan: string
  alamat: string
  rt: string
  rw: string
  kodePos: string
  provinsi: string
  kotaKab: string
  kecamatan: string
  kelurahan: string
}

export function getDukcapilData(nik: string): DukcapilRecord {
  const clean = (nik || '').replace(/\D/g, '')
  if (clean.startsWith('3201') || clean.includes('1194')) {
    return {
      nik: '3201 0218 1194 0000',
      nama: 'Thoriq Sadad',
      tempatLahir: 'Bogor',
      tanggalLahir: '1990-01-01',
      jenisKelamin: 'Laki-laki',
      namaIbuKandung: 'Putri',
      agama: 'Islam',
      pekerjaan: 'Pelajar/Mahasiswa',
      alamat: 'Jalan Kemana',
      rt: '001',
      rw: '001',
      kodePos: '10430',
      provinsi: 'Jawa Tengah',
      kotaKab: 'Kebumen',
      kecamatan: 'Petahanan',
      kelurahan: 'Grujugan',
    }
  }

  return {
    nik: nik || '3204 1111 1298 0003',
    nama: 'Anastasya Delistya',
    tempatLahir: 'Bandung',
    tanggalLahir: '1990-01-01',
    jenisKelamin: 'Perempuan',
    namaIbuKandung: 'Putri',
    agama: 'Islam',
    pekerjaan: 'Pegawai Swasta',
    alamat: 'Pertokoan Kenari Baru, Senen',
    rt: '001',
    rw: '002',
    kodePos: '10430',
    provinsi: 'DKI Jakarta',
    kotaKab: 'Kota Jakarta Pusat',
    kecamatan: 'Senen',
    kelurahan: 'Kenari',
  }
}

export function checkDukcapilGaps(input: {
  nik: string
  nama?: string
  tempatLahir?: string
  tanggalLahir?: string
  jenisKelamin?: string
  namaIbuKandung?: string
  agama?: string
  pekerjaan?: string
  alamat?: string
  rt?: string
  rw?: string
  provinsi?: string
  kotaKab?: string
  kecamatan?: string
  kelurahan?: string
}): { isValid: boolean; gaps: string[]; dukcapilData: DukcapilRecord } {
  const dukcapilData = getDukcapilData(input.nik)
  const gaps: string[] = []

  const cleanNama = (input.nama || '').trim().toLowerCase()
  const cleanDukcapilNama = dukcapilData.nama.trim().toLowerCase()
  if (cleanNama !== cleanDukcapilNama) {
    gaps.push('nama')
  }

  const cleanTempat = (input.tempatLahir || '').trim().toLowerCase()
  const cleanDukcapilTempat = dukcapilData.tempatLahir.trim().toLowerCase()
  if (cleanTempat !== cleanDukcapilTempat) {
    gaps.push('tempatLahir')
  }

  const isoInputTgl = normalizeDateToIso(input.tanggalLahir)
  const isoDukcapilTgl = normalizeDateToIso(dukcapilData.tanggalLahir)
  if (isoInputTgl && isoDukcapilTgl && isoInputTgl !== isoDukcapilTgl) {
    gaps.push('tanggalLahir')
  }

  const cleanJk = (input.jenisKelamin || '').trim().toLowerCase()
  const cleanDukcapilJk = dukcapilData.jenisKelamin.trim().toLowerCase()
  if (cleanJk !== cleanDukcapilJk) {
    gaps.push('jenisKelamin')
  }

  const cleanIbu = (input.namaIbuKandung || '').trim().toLowerCase()
  const cleanDukcapilIbu = dukcapilData.namaIbuKandung.trim().toLowerCase()
  if (cleanIbu !== cleanDukcapilIbu) {
    gaps.push('namaIbuKandung')
  }

  if (input.agama && input.agama.trim().toLowerCase() !== dukcapilData.agama.trim().toLowerCase()) {
    gaps.push('agama')
  }

  if (input.pekerjaan && input.pekerjaan.trim().toLowerCase() !== dukcapilData.pekerjaan.trim().toLowerCase()) {
    gaps.push('pekerjaan')
  }

  return {
    isValid: gaps.length === 0,
    gaps,
    dukcapilData,
  }
}

export function verifyDukcapil(nik: string): DukcapilStatus {
  const clean = normalizeIdentityNumber(nik)
  if (!clean || clean.length < 16) return 'tidak_sesuai'
  if (clean === '3204111112980003' || clean === '3204222212980004' || clean.startsWith('3204')) {
    return 'valid'
  }
  return 'tidak_sesuai'
}

/**
 * Case 1: Converts / generates a new Syariah CIF from an existing Konvensional CIF record.
 * Conforms with Figma note 11347:163680 / 11347:175541.
 */
export function convertKonvenToSyariahCif(konvenItem: RahinCifItem): RahinCifItem {
  const cleanDigits = konvenItem.nomorCif.replace(/\D/g, '')
  const p1 = cleanDigits.slice(0, 4) || '1234'
  const p2 = cleanDigits.slice(4, 8) || '5678'
  const p3 = cleanDigits.slice(8) || '01'
  const syariahNomorCif = `7${p1.slice(1)} ${p2} ${p3}`

  return {
    ...konvenItem,
    id: `cif-sya-created-${konvenItem.id}`,
    statusRahin: 'syariah',
    nomorCif: syariahNomorCif,
    ratingRahin: konvenItem.ratingRahin || 'Silver',
    cabangPembuka: konvenItem.cabangPembuka.toLowerCase().includes('syariah')
      ? konvenItem.cabangPembuka
      : `${konvenItem.cabangPembuka} Syariah`,
    verifikasiDukcapil: konvenItem.verifikasiDukcapil || 'valid',
  }
}

/**
 * Resolves a Rahin CIF record by id, nomorCif, or rawIdentitas.
 * Normalizes input and fields to handle whitespace and casing discrepancies.
 *
 * @param id - Record identifier string (ID, CIF number, or raw identity number).
 * @returns Matched RahinCifItem or undefined.
 */
export function findRahinCifById(id?: string): RahinCifItem | undefined {
  if (!id) return undefined
  const trimmed = id.trim()
  if (!trimmed) return undefined
  const clean = normalizeIdentityNumber(id)

  return MOCK_RAHIN_CIF_DATABASE.find(
    (c) =>
      c.id === trimmed ||
      c.id.toLowerCase() === trimmed.toLowerCase() ||
      normalizeIdentityNumber(c.nomorCif) === clean ||
      normalizeIdentityNumber(c.rawIdentitas) === clean,
  )
}

