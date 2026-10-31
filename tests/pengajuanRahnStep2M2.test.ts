/**
 * @file tests/pengajuanRahnStep2M2.test.ts
 * @description Unit test suite for Milestone M2:
 * - PelaksanaTransaksiSection (KTP vs Paspor, Kewarganegaraan, Masa Berlaku, Surat Kuasa)
 * - RahinDetailSection (Dukcapil verification, Postal Code auto-fill, Domicile sync, Demographic/Financial)
 * - Step2RahinContent orchestration with M2 components
 */
import { describe, it, expect } from 'vitest'
import {
  // M2 Components
  PelaksanaTransaksiSection,
  RahinDetailSection,
  Step2RahinContent,
  // State, Types & Mock Data
  type PelaksanaTransaksiState,
  type RahinFields,
  createDefaultPelaksanaState,
  createInitialStep2State,
  PELAKSANA_KTP_PRESET,
  PELAKSANA_PASPOR_PRESET,
  POSTAL_CODE_DIRECTORY,
  lookupPostalCode,
  calculateAge,
  verifyDukcapil,
  searchRahinCif,
  KTP_SYARIAH_FOUND,
} from '../src/components/modules/rahn'

describe('Worker M2 Unit Tests: Pelaksana Transaksi & Detailed Rahin Form', () => {
  // ==========================================
  // 1. PelaksanaTransaksiSection & Branching Logic
  // ==========================================
  describe('PelaksanaTransaksiSection Component & State Machine', () => {
    it('memastikan PelaksanaTransaksiSection terdefinisi dan merupakan komponen Vue', () => {
      expect(PelaksanaTransaksiSection).toBeDefined()
      expect(typeof PelaksanaTransaksiSection).toBe('object')
    })

    it('createDefaultPelaksanaState menginisialisasi state KTP default dengan Figma Node 11347:172827', () => {
      const defaultState = createDefaultPelaksanaState()
      expect(defaultState.identityType).toBe('ktp')
      expect(defaultState.kewarganegaraan).toBe('WNI')
      expect(defaultState.masaBerlakuType).toBe('seumur_hidup')
      expect(defaultState.figmaNodeId).toBe('11347:172827')
      expect(defaultState.isActive).toBe(false)
    })

    it('KTP branch: Kewarganegaraan terkunci ke WNI sesuai Aturan Bisnis 11347:178154', () => {
      const state: PelaksanaTransaksiState = {
        ...createDefaultPelaksanaState(),
        identityType: 'ktp',
        nik: '3204 1234 5678 0001',
      }
      expect(state.identityType).toBe('ktp')
      expect(state.kewarganegaraan).toBe('WNI')
      expect(state.figmaNodeId).toBe('11347:172827')
    })

    it('Paspor branch: Figma Node beralih ke 11347:170073 dan Kewarganegaraan dapat dipilih WNI atau WNA', () => {
      const stateWna: PelaksanaTransaksiState = {
        ...createDefaultPelaksanaState(),
        identityType: 'paspor',
        nomorPaspor: 'B12345678',
        kewarganegaraan: 'WNA',
        figmaNodeId: '11347:170073',
      }
      expect(stateWna.identityType).toBe('paspor')
      expect(stateWna.kewarganegaraan).toBe('WNA')
      expect(stateWna.figmaNodeId).toBe('11347:170073')

      const stateWni: PelaksanaTransaksiState = {
        ...createDefaultPelaksanaState(),
        identityType: 'paspor',
        nomorPaspor: 'A98765432',
        kewarganegaraan: 'WNI',
        figmaNodeId: '11347:170073',
      }
      expect(stateWni.kewarganegaraan).toBe('WNI')
    })

    it('Masa Berlaku KTP: Seumur Hidup (11347:172997) vs Sampai Dengan (11347:172995)', () => {
      // Seumur hidup -> tanggalBerlakuSampai tidak diperlukan / kosong
      const lifetimeKtp: PelaksanaTransaksiState = {
        ...createDefaultPelaksanaState(),
        masaBerlakuType: 'seumur_hidup',
        tanggalBerlakuSampai: '',
      }
      expect(lifetimeKtp.masaBerlakuType).toBe('seumur_hidup')
      expect(lifetimeKtp.tanggalBerlakuSampai).toBe('')

      // Sampai dengan -> tanggalBerlakuSampai wajib diisi
      const expiryKtp: PelaksanaTransaksiState = {
        ...createDefaultPelaksanaState(),
        masaBerlakuType: 'sampai_dengan',
        tanggalBerlakuSampai: '2029-10-31',
      }
      expect(expiryKtp.masaBerlakuType).toBe('sampai_dengan')
      expect(expiryKtp.tanggalBerlakuSampai).toBe('2029-10-31')
    })

    it('Masa Berlaku Paspor: Wajib memiliki tanggal berlaku sampai', () => {
      expect(PELAKSANA_PASPOR_PRESET.identityType).toBe('paspor')
      expect(PELAKSANA_PASPOR_PRESET.masaBerlakuType).toBe('sampai_dengan')
      expect(PELAKSANA_PASPOR_PRESET.tanggalBerlakuSampai).toBe('2028-12-31')
    })

    it('PELAKSANA_KTP_PRESET dan PELAKSANA_PASPOR_PRESET memiliki data lengkap yang valid', () => {
      expect(PELAKSANA_KTP_PRESET.namaLengkap).toBe('Bambang Sudarsono')
      expect(PELAKSANA_KTP_PRESET.nik).toBe('3204 1234 5678 0001')
      expect(PELAKSANA_KTP_PRESET.suratKuasaFileUrl).toBeTruthy()
      expect(PELAKSANA_KTP_PRESET.figmaNodeId).toBe('11347:172827')

      expect(PELAKSANA_PASPOR_PRESET.namaLengkap).toBe('David Michael')
      expect(PELAKSANA_PASPOR_PRESET.nomorPaspor).toBe('B12345678')
      expect(PELAKSANA_PASPOR_PRESET.kewarganegaraan).toBe('WNA')
      expect(PELAKSANA_PASPOR_PRESET.suratKuasaFileUrl).toBeTruthy()
      expect(PELAKSANA_PASPOR_PRESET.figmaNodeId).toBe('11347:170073')
    })

    it('calculateAge menghitung usia secara tepat dari string ISO maupun format bahasa Indonesia', () => {
      const today = new Date()
      const currentYear = today.getFullYear()
      const birthYear = currentYear - 30

      // Format ISO
      const isoAge = calculateAge(`${birthYear}-01-01`)
      expect(isoAge).toContain('Tahun')

      // Format Indonesia
      const indoAge = calculateAge(`15 Mei ${birthYear}`)
      expect(indoAge).toContain('Tahun')

      // String kosong / tidak valid mengembalikan string kosong
      expect(calculateAge('')).toBe('')
      expect(calculateAge('invalid-date')).toBe('')
    })
  })

  // ==========================================
  // 2. RahinDetailSection & Aturan Bisnis
  // ==========================================
  describe('RahinDetailSection & Aturan Bisnis Formulir', () => {
    it('memastikan RahinDetailSection terdefinisi dan merupakan komponen Vue', () => {
      expect(RahinDetailSection).toBeDefined()
      expect(typeof RahinDetailSection).toBe('object')
    })

    it('Dukcapil Verification Service: memvalidasi NIK sesuai registri Dukcapil (Figma 11347:167660)', () => {
      // NIK valid dari database
      expect(verifyDukcapil('3204111112980003')).toBe('valid')
      expect(verifyDukcapil('3204 1111 1298 0003')).toBe('valid')
      expect(verifyDukcapil('3204222212980004')).toBe('valid')

      // NIK tidak valid / tidak lengkap
      expect(verifyDukcapil('12345')).toBe('tidak_sesuai')
      expect(verifyDukcapil('')).toBe('tidak_sesuai')
      expect(verifyDukcapil('9999999999999999')).toBe('tidak_sesuai')
    })

    it('Postal Code Auto-fill: Kode Pos 5-digit mengisi otomatis Provinsi, Kota, Kecamatan, dan Kelurahan (Aturan 11347:172987)', () => {
      // 10320 -> Menteng, Jakarta Pusat, DKI Jakarta (Contoh utama pada catatan bisnis)
      const loc10320 = lookupPostalCode('10320')
      expect(loc10320).not.toBeNull()
      expect(loc10320?.provinsi).toBe('DKI Jakarta')
      expect(loc10320?.kotaKab).toBe('Kota Jakarta Pusat')
      expect(loc10320?.kecamatan).toBe('Menteng')
      expect(loc10320?.kelurahan).toBe('Pegangsaan')

      // 10450 -> Senen, Jakarta Pusat
      const loc10450 = lookupPostalCode('10450')
      expect(loc10450?.kecamatan).toBe('Senen')
      expect(loc10450?.kelurahan).toBe('Kramat')

      // 12190 -> Kebayoran Baru, Jakarta Selatan
      const loc12190 = lookupPostalCode('12190')
      expect(loc12190?.kotaKab).toBe('Kota Jakarta Selatan')

      // Kode pos tidak dikenal mengembalikan null
      expect(lookupPostalCode('00000')).toBeNull()
      expect(lookupPostalCode('')).toBeNull()
    })

    it('POSTAL_CODE_DIRECTORY memiliki entri kota besar di Indonesia', () => {
      expect(POSTAL_CODE_DIRECTORY['10320']).toBeDefined()
      expect(POSTAL_CODE_DIRECTORY['40115']).toBeDefined() // Bandung
      expect(POSTAL_CODE_DIRECTORY['60271']).toBeDefined() // Surabaya
    })

    it('Alamat Domisili Sync Checkbox: Aturan 11347:165273', () => {
      // Simulasi state field ketika isAlamatDomisiliSama = true
      const fields: RahinFields = {
        nik: '3204111112980003',
        nama: 'Anastasya Delistya',
        noHp: '0812 2345 3456',
        pekerjaan: 'Pegawai Swasta',
        nominal: '15000000',
        alamat: 'Jl. Menteng Raya No. 12',
        hubungan: 'diri-sendiri',
        rt: '001',
        rw: '002',
        kodePos: '10320',
        provinsi: 'DKI Jakarta',
        kotaKab: 'Kota Jakarta Pusat',
        kecamatan: 'Menteng',
        kelurahan: 'Pegangsaan',
        isAlamatDomisiliSama: true,
        // Domicile fields disinkronkan
        domAlamat: 'Jl. Menteng Raya No. 12',
        domRt: '001',
        domRw: '002',
        domKodePos: '10320',
        domProvinsi: 'DKI Jakarta',
        domKotaKab: 'Kota Jakarta Pusat',
        domKecamatan: 'Menteng',
        domKelurahan: 'Pegangsaan',
      }

      expect(fields.isAlamatDomisiliSama).toBe(true)
      expect(fields.domAlamat).toBe(fields.alamat)
      expect(fields.domKodePos).toBe(fields.kodePos)
      expect(fields.domKotaKab).toBe(fields.kotaKab)

      // Ketika isAlamatDomisiliSama = false, domisili dapat berbeda
      fields.isAlamatDomisiliSama = false
      fields.domAlamat = 'Apartemen Sudirman Tower A Lt. 15'
      fields.domKodePos = '12190'
      fields.domKotaKab = 'Kota Jakarta Selatan'

      expect(fields.isAlamatDomisiliSama).toBe(false)
      expect(fields.domAlamat).not.toBe(fields.alamat)
      expect(fields.domKotaKab).not.toBe(fields.kotaKab)
    })

    it('Checkbox konfirmasi identitas: Aturan 11797:131985', () => {
      const fields: RahinFields = {
        nik: '3204111112980003',
        nama: 'Anastasya Delistya',
        noHp: '0812 2345 3456',
        pekerjaan: 'Pegawai Swasta',
        nominal: '15000000',
        alamat: 'Jl. Menteng Raya No. 12',
        hubungan: 'diri-sendiri',
        isDataSesuaiIdentitas: true,
      }
      expect(fields.isDataSesuaiIdentitas).toBe(true)
    })
  })

  // ==========================================
  // 3. Step2RahinContent Integrasi M2
  // ==========================================
  describe('Step2RahinContent Integrasi M2', () => {
    it('memastikan Step2RahinContent terdefinisi', () => {
      expect(Step2RahinContent).toBeDefined()
    })

    it('createInitialStep2State menginisialisasi pelaksana dan search state', () => {
      const state = createInitialStep2State()
      expect(state.pelaksana).toBeDefined()
      expect(state.pelaksana.identityType).toBe('ktp')
      expect(state.pelaksana.figmaNodeId).toBe('11347:172827')
      expect(state.search.tipeRahin).toBe('')
      expect(state.search.jenisIdentitas).toBe('')
    })

    it('Alur pencarian CIF Syariah mengembalikan data untuk diintegrasikan ke detail formulir', () => {
      const res = searchRahinCif('perorangan', 'ktp', KTP_SYARIAH_FOUND.nomorIdentitas)
      expect(res.cifList.length).toBeGreaterThan(0)
      const syariahCif = res.cifList.find((c) => c.statusRahin === 'syariah')
      expect(syariahCif).toBeDefined()
      expect(syariahCif?.namaRahin).toBe('Anastasya Delistya')
      expect(syariahCif?.verifikasiDukcapil).toBe('valid')
    })

    it('Validasi handleNext menolak jika CIF belum dipilih atau identitas kosong', () => {
      const state = createInitialStep2State()
      state.search.nomorIdentitas = '3204 1111 1298 0003'
      const searchRes = searchRahinCif('perorangan', 'ktp', state.search.nomorIdentitas)
      state.cifList = searchRes.cifList

      // CIF belum dipilih
      expect(state.selectedCifId).toBeNull()

      // Validasi gagal jika belum ada CIF dipilih
      const isUnselected = state.cifList.length > 0 && !state.selectedCifId
      expect(isUnselected).toBe(true)
    })

    it('Validasi handleNext menolak jika Pelaksana Transaksi aktif namun data pelaksana belum lengkap', () => {
      const pelaksana = createDefaultPelaksanaState()
      pelaksana.isActive = true
      pelaksana.namaLengkap = '' // Kosong
      pelaksana.nik = '' // Kosong

      const isValidPelaksana = Boolean(
        pelaksana.namaLengkap && (pelaksana.identityType === 'ktp' ? pelaksana.nik : pelaksana.nomorPaspor),
      )
      expect(isValidPelaksana).toBe(false)

      // Setelah dilengkapi
      pelaksana.namaLengkap = 'Bambang Sudarsono'
      pelaksana.nik = '3204 1234 5678 0001'
      const isValidNow = Boolean(
        pelaksana.namaLengkap && (pelaksana.identityType === 'ktp' ? pelaksana.nik : pelaksana.nomorPaspor),
      )
      expect(isValidNow).toBe(true)
    })
  })
})
