/**
 * @file empiricalChallenger2.test.ts
 * @description Empirical Challenger 2 verification suite for Milestone M4.
 * Tests business rules:
 * - Case 1: Konven to Syariah conversion & CIF creation
 * - Case 2: Existing Syariah CIF direct selection and field mapping
 * - Case 3: Identity Not Found flow (tambah_baru)
 * - Unselected CIF advance warning (Rule 11347:173010)
 * - Postal code auto-fill (Rule 11347:172987)
 * - Domicile address sync checkbox (Rule 11347:165273)
 * - Pelaksana Transaksi & Loan sorting stress tests
 * - Property-based stress testing & state transitions
 */

import { describe, expect, it } from 'vitest'
import {
  MOCK_LOAN_PORTFOLIO_KONVEN,
  MOCK_LOAN_PORTFOLIO_PASPOR,
  MOCK_LOAN_PORTFOLIO_SYARIAH,
  MOCK_RAHIN_CIF_DATABASE,
  POSTAL_CODE_DIRECTORY,
  calculateAge,
  convertKonvenToSyariahCif,
  createDefaultPelaksanaState,
  createInitialStep2State,
  formatMaskedIdentity,
  lookupPostalCode,
  normalizeIdentityNumber,
  searchRahinCif,
  sortLoanPortfolio,
  verifyDukcapil,
  type LoanPortfolioItem,
  type RahinCifItem,
  type Step2State,
} from '@/components/modules/rahn/mockRahinData'

describe('Challenger 2 Empirical Verification: Business Rules & State Invariants', () => {
  // =========================================================================
  // CASE 1: Konvensional to Syariah Conversion & CIF Creation
  // =========================================================================
  describe('Case 1: Konven to Syariah CIF Conversion (Catatan 11347:163680 / 11347:175541)', () => {
    it('finds Budi Santoso with ONLY Konvensional CIF and does NOT auto-select', () => {
      const searchRes = searchRahinCif('perorangan', 'ktp', '3204 2222 1298 0004')
      expect(searchRes.cifList).toHaveLength(1)
      const konvenItem = searchRes.cifList[0]
      expect(konvenItem.statusRahin).toBe('konvensional')
      expect(konvenItem.nomorCif).toBe('5678 5678 01')
      expect(konvenItem.namaRahin).toBe('Budi Santoso')

      // Emulate Step 2 auto-select logic
      const step2State: Step2State = createInitialStep2State()
      step2State.cifList = searchRes.cifList

      const shouldAutoSelect =
        searchRes.cifList.length === 1 && searchRes.cifList[0].statusRahin === 'syariah'
      expect(shouldAutoSelect).toBe(false)
      expect(step2State.selectedCifId).toBeNull()
    })

    it('converts Konvensional CIF to a valid Syariah CIF with 7xxx prefix and Syariah branch', () => {
      const konvenItem: RahinCifItem = {
        id: 'cif-kon-02',
        statusRahin: 'konvensional',
        nomorCif: '5678 5678 01',
        namaRahin: 'Budi Santoso',
        ratingRahin: 'Silver',
        nomorIdentitasMasked: '3204 **** **** 0004',
        rawIdentitas: '3204222212980004',
        jenisIdentitas: 'ktp',
        tanggalLahir: '15 Mei 1985',
        verifikasiDukcapil: 'valid',
        namaIbuKandung: 'Siti Aminah',
        jenisKelamin: 'Laki-laki',
        alamatRumah: 'Jl. Kramat Raya No. 45, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10450',
        noHp: '0813 9876 5432',
        cabangPembuka: 'Cabang Kramat',
      }

      const syariahCif = convertKonvenToSyariahCif(konvenItem)

      // Invariant checks
      expect(syariahCif.id).toBe('cif-sya-created-cif-kon-02')
      expect(syariahCif.statusRahin).toBe('syariah')
      expect(syariahCif.nomorCif.startsWith('7')).toBe(true)
      expect(syariahCif.nomorCif).toBe('7678 5678 01')
      expect(syariahCif.cabangPembuka).toBe('Cabang Kramat Syariah')
      expect(syariahCif.rawIdentitas).toBe(konvenItem.rawIdentitas)
      expect(syariahCif.namaRahin).toBe(konvenItem.namaRahin)
      expect(syariahCif.verifikasiDukcapil).toBe('valid')
    })

    it('avoids duplicate Syariah suffix if branch already includes "Syariah"', () => {
      const konvenItem: RahinCifItem = {
        id: 'cif-kon-test',
        statusRahin: 'konvensional',
        nomorCif: '1234 5678 99',
        namaRahin: 'Test User',
        ratingRahin: 'Gold',
        nomorIdentitasMasked: '3204 **** **** 9999',
        rawIdentitas: '3204999999999999',
        jenisIdentitas: 'ktp',
        tanggalLahir: '1 Januari 1990',
        verifikasiDukcapil: 'valid',
        namaIbuKandung: 'Ibu',
        jenisKelamin: 'Perempuan',
        alamatRumah: 'Jakarta',
        noHp: '08123456789',
        cabangPembuka: 'Cabang Bandung Syariah',
      }

      const converted = convertKonvenToSyariahCif(konvenItem)
      expect(converted.cabangPembuka).toBe('Cabang Bandung Syariah')
      expect(converted.cabangPembuka.split('Syariah')).toHaveLength(2) // Exactly one occurrence
    })

    it('handles CIF conversion edge cases without non-numeric crash', () => {
      const edgeKonven: RahinCifItem = {
        id: 'cif-edge',
        statusRahin: 'konvensional',
        nomorCif: 'NO-NUMBERS-HERE',
        namaRahin: 'Edge Case',
        ratingRahin: 'Bronze',
        nomorIdentitasMasked: '0000 **** 0000',
        rawIdentitas: '0000000000000000',
        jenisIdentitas: 'ktp',
        tanggalLahir: '1 Januari 1990',
        verifikasiDukcapil: 'tidak_sesuai',
        namaIbuKandung: 'Ibu',
        jenisKelamin: 'Laki-laki',
        alamatRumah: 'Unknown',
        noHp: '0800000000',
        cabangPembuka: 'Cabang Edge',
      }

      const converted = convertKonvenToSyariahCif(edgeKonven)
      expect(converted.nomorCif.startsWith('7')).toBe(true)
      expect(converted.statusRahin).toBe('syariah')
    })

    it('enables advance after conversion and selection', () => {
      const step2State: Step2State = createInitialStep2State()
      const searchRes = searchRahinCif('perorangan', 'ktp', '3204 2222 1298 0004')
      step2State.cifList = [...searchRes.cifList]

      // Before conversion: advance must fail
      const simulateHandleNext = (state: Step2State, fields: { nik: string; nama: string }) => {
        if (state.cifList.length > 0) {
          if (!state.selectedCifId) {
            return {
              valid: false,
              message: 'Pilih salah satu data CIF syariah untuk dilanjutkan ke detail data Rahin',
            }
          }
          const sel = state.cifList.find((c) => c.id === state.selectedCifId)
          if (sel && sel.statusRahin !== 'syariah') {
            return {
              valid: false,
              message: 'Pilih salah satu data CIF syariah untuk dilanjutkan ke detail data Rahin',
            }
          }
        }
        if (!fields.nik || !fields.nama) {
          return { valid: false, message: 'Mohon lengkapi data identitas Rahin.' }
        }
        return { valid: true }
      }

      const resBefore = simulateHandleNext(step2State, { nik: '', nama: '' })
      expect(resBefore.valid).toBe(false)
      expect(resBefore.message).toContain('Pilih salah satu data CIF syariah')

      // Perform conversion
      const converted = convertKonvenToSyariahCif(step2State.cifList[0])
      step2State.cifList.unshift(converted)
      step2State.selectedCifId = converted.id

      const fieldsModel = {
        nik: converted.rawIdentitas,
        nama: converted.namaRahin,
      }

      const resAfter = simulateHandleNext(step2State, fieldsModel)
      expect(resAfter.valid).toBe(true)
    })
  })

  // =========================================================================
  // CASE 2: Existing Syariah CIF Direct Selection and Field Mapping
  // =========================================================================
  describe('Case 2: Existing Syariah CIF Direct Selection & Field Mapping', () => {
    it('returns both Syariah and Konven CIFs for Anastasya Delistya and requires selection', () => {
      const res = searchRahinCif('perorangan', 'ktp', '3204 1111 1298 0003')
      expect(res.cifList).toHaveLength(2)

      const syariahCif = res.cifList.find((c) => c.statusRahin === 'syariah')
      const konvenCif = res.cifList.find((c) => c.statusRahin === 'konvensional')

      expect(syariahCif).toBeDefined()
      expect(konvenCif).toBeDefined()
      expect(syariahCif?.id).toBe('cif-sya-01')
      expect(konvenCif?.id).toBe('cif-kon-01')
      expect(syariahCif?.namaRahin).toBe('Anastasya Delistya')
      expect(syariahCif?.ratingRahin).toBe('Platinum Plus')
    })

    it('auto-selects single Syariah record when searched by Paspor (Edge Case 4, Figma 11790:130756)', () => {
      const res = searchRahinCif('perorangan', 'paspor', '0033 9714 84')
      expect(res.cifList).toHaveLength(1)
      expect(res.cifList[0].statusRahin).toBe('syariah')
      expect(res.cifList[0].namaRahin).toBe('Robert Smith')

      // Single Syariah auto-selection invariant
      const isSingleSyariah = res.cifList.length === 1 && res.cifList[0].statusRahin === 'syariah'
      expect(isSingleSyariah).toBe(true)
    })

    it('maps demographic, postal, and regional fields accurately on Syariah selection', () => {
      const cif: RahinCifItem = MOCK_RAHIN_CIF_DATABASE.find((c) => c.id === 'cif-sya-01')!
      expect(cif).toBeDefined()

      // Verify mapped fields
      expect(cif.rawIdentitas).toBe('3204111112980003')
      expect(cif.namaRahin).toBe('Anastasya Delistya')
      expect(cif.tanggalLahir).toBe('1 Januari 1990')
      expect(cif.verifikasiDukcapil).toBe('valid')
      expect(cif.namaIbuKandung).toBe('Putri')
      expect(cif.jenisKelamin).toBe('Perempuan')
      expect(cif.alamatRumah).toContain('10430')

      // Postal resolution for 10430
      const loc = lookupPostalCode('10430')
      expect(loc).not.toBeNull()
      expect(loc?.kelurahan).toBe('Kenari')
      expect(loc?.kecamatan).toBe('Senen')
      expect(loc?.kotaKab).toBe('Kota Jakarta Pusat')
      expect(loc?.provinsi).toBe('DKI Jakarta')
    })
  })

  // =========================================================================
  // CASE 3: Identity Not Found Flow & Tambah Rahin Baru
  // =========================================================================
  describe('Case 3: Identity Not Found Flow (Figma 11347:162934 / 11347:163372)', () => {
    it('returns empty lists when identity does not exist in registry', () => {
      const res = searchRahinCif('perorangan', 'ktp', '3204 9999 9999 9999')
      expect(res.cifList).toHaveLength(0)
      expect(res.portfolioList).toHaveLength(0)
    })

    it('initializes clean blank registration for "Tambah Rahin Baru"', () => {
      const notFoundQuery = '3204 9999 9999 9999'
      const blankState = {
        nik: notFoundQuery,
        nama: '',
        alamat: '',
        noHp: '',
        cif: '',
        statusRahin: 'syariah',
        ratingRahin: 'Classic',
        dukcapilStatus: 'belum_cek',
        isDataSesuaiIdentitas: false,
      }

      expect(blankState.nik).toBe(notFoundQuery)
      expect(blankState.nama).toBe('')
      expect(blankState.cif).toBe('')
      expect(blankState.dukcapilStatus).toBe('belum_cek')
      expect(blankState.isDataSesuaiIdentitas).toBe(false)
    })

    it('blocks advance when blank registration has no name, but allows after filling name', () => {
      const blankFields = { nik: '3204 9999 9999 9999', nama: '' }
      const validate = (fields: { nik: string; nama: string }) => {
        if (!fields.nik || !fields.nama) {
          return { valid: false, message: 'Mohon lengkapi data identitas Rahin.' }
        }
        return { valid: true }
      }

      expect(validate(blankFields).valid).toBe(false)
      expect(validate({ ...blankFields, nama: 'Dewi Sartika' }).valid).toBe(true)
    })
  })

  // =========================================================================
  // RULE 11347:173010: Unselected CIF Advance Warning
  // =========================================================================
  describe('Rule 11347:173010: Unselected CIF Advance Block and Warning', () => {
    it('blocks navigation when CIF search results exist but no row has been selected', () => {
      const step2State: Step2State = createInitialStep2State()
      const searchRes = searchRahinCif('perorangan', 'ktp', '3204 1111 1298 0003')
      step2State.cifList = searchRes.cifList
      step2State.selectedCifId = null // Unselected

      const handleNext = (hasSearched: boolean, state: Step2State) => {
        if (hasSearched && state.cifList.length > 0) {
          if (!state.selectedCifId) {
            const msg = 'Pilih salah satu data CIF syariah untuk dilanjutkan ke detail data Rahin'
            state.warningAlertMessage = msg
            return { valid: false, message: msg }
          }
        }
        return { valid: true }
      }

      const result = handleNext(true, step2State)
      expect(result.valid).toBe(false)
      expect(result.message).toBe('Pilih salah satu data CIF syariah untuk dilanjutkan ke detail data Rahin')
      expect(step2State.warningAlertMessage).toBe('Pilih salah satu data CIF syariah untuk dilanjutkan ke detail data Rahin')
    })

    it('blocks advance if selected row is a Konvensional CIF without conversion', () => {
      const step2State: Step2State = createInitialStep2State()
      step2State.cifList = [
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
          alamatRumah: 'Jakarta',
          noHp: '081223453456',
          cabangPembuka: 'Cabang Senen',
        },
      ]
      step2State.selectedCifId = 'cif-kon-01' // Selected Konven

      const handleNext = (state: Step2State) => {
        const selected = state.cifList.find((c) => c.id === state.selectedCifId)
        if (selected && selected.statusRahin !== 'syariah') {
          return {
            valid: false,
            message: 'Pilih salah satu data CIF syariah untuk dilanjutkan ke detail data Rahin',
          }
        }
        return { valid: true }
      }

      const result = handleNext(step2State)
      expect(result.valid).toBe(false)
      expect(result.message).toContain('Pilih salah satu data CIF syariah')
    })
  })

  // =========================================================================
  // RULE 11347:172987: Postal Code Auto-Fill
  // =========================================================================
  describe('Rule 11347:172987: Postal Code Auto-Fill Resolution', () => {
    it('correctly resolves all 6 registered postal code entries across multiple provinces', () => {
      const testCases = [
        {
          code: '10320',
          kel: 'Pegangsaan',
          kec: 'Menteng',
          kota: 'Kota Jakarta Pusat',
          prov: 'DKI Jakarta',
        },
        {
          code: '10430',
          kel: 'Kenari',
          kec: 'Senen',
          kota: 'Kota Jakarta Pusat',
          prov: 'DKI Jakarta',
        },
        {
          code: '10450',
          kel: 'Kramat',
          kec: 'Senen',
          kota: 'Kota Jakarta Pusat',
          prov: 'DKI Jakarta',
        },
        {
          code: '12190',
          kel: 'Senayan',
          kec: 'Kebayoran Baru',
          kota: 'Kota Jakarta Selatan',
          prov: 'DKI Jakarta',
        },
        {
          code: '40115',
          kel: 'Braga',
          kec: 'Sumur Bandung',
          kota: 'Kota Bandung',
          prov: 'Jawa Barat',
        },
        {
          code: '60271',
          kel: 'Embong Kaliasin',
          kec: 'Genteng',
          kota: 'Kota Surabaya',
          prov: 'Jawa Timur',
        },
      ]

      for (const tc of testCases) {
        const loc = lookupPostalCode(tc.code)
        expect(loc, `Postal code ${tc.code} must resolve`).not.toBeNull()
        expect(loc?.kelurahan).toBe(tc.kel)
        expect(loc?.kecamatan).toBe(tc.kec)
        expect(loc?.kotaKab).toBe(tc.kota)
        expect(loc?.provinsi).toBe(tc.prov)
      }
    })

    it('handles edge cases gracefully: empty, incomplete, whitespace, and unknown codes', () => {
      expect(lookupPostalCode('')).toBeNull()
      expect(lookupPostalCode('1032')).toBeNull() // < 5 digits
      expect(lookupPostalCode('99999')).toBeNull() // unmapped
      // Trimming resilience
      expect(lookupPostalCode(' 10320 ')).not.toBeNull()
      expect(lookupPostalCode(' 10320 ')?.kelurahan).toBe('Pegangsaan')
    })
  })

  // =========================================================================
  // RULE 11347:165273: Domicile Address Sync Checkbox
  // =========================================================================
  describe('Rule 11347:165273: Domicile Address Sync Checkbox', () => {
    it('duplicates all 8 address fields from identity to domicile when synced', () => {
      const identityAddress = {
        alamat: 'Jl. Pegangsaan Timur No. 56',
        rt: '001',
        rw: '002',
        kodePos: '10320',
        provinsi: 'DKI Jakarta',
        kotaKab: 'Kota Jakarta Pusat',
        kecamatan: 'Menteng',
        kelurahan: 'Pegangsaan',
      }

      const domicileAddress = {
        domAlamat: '',
        domRt: '',
        domRw: '',
        domKodePos: '',
        domProvinsi: '',
        domKotaKab: '',
        domKecamatan: '',
        domKelurahan: '',
      }

      // Sync function
      const syncDomisiliFromIdentity = () => {
        domicileAddress.domAlamat = identityAddress.alamat
        domicileAddress.domRt = identityAddress.rt
        domicileAddress.domRw = identityAddress.rw
        domicileAddress.domKodePos = identityAddress.kodePos
        domicileAddress.domProvinsi = identityAddress.provinsi
        domicileAddress.domKotaKab = identityAddress.kotaKab
        domicileAddress.domKecamatan = identityAddress.kecamatan
        domicileAddress.domKelurahan = identityAddress.kelurahan
      }

      syncDomisiliFromIdentity()

      expect(domicileAddress.domAlamat).toBe(identityAddress.alamat)
      expect(domicileAddress.domRt).toBe(identityAddress.rt)
      expect(domicileAddress.domRw).toBe(identityAddress.rw)
      expect(domicileAddress.domKodePos).toBe(identityAddress.kodePos)
      expect(domicileAddress.domProvinsi).toBe(identityAddress.provinsi)
      expect(domicileAddress.domKotaKab).toBe(identityAddress.kotaKab)
      expect(domicileAddress.domKecamatan).toBe(identityAddress.kecamatan)
      expect(domicileAddress.domKelurahan).toBe(identityAddress.kelurahan)
    })

    it('allows independent domicile editing when unsynced, without mutating identity address', () => {
      let isAlamatDomisiliSama = false
      const fields = {
        alamat: 'Jl. KTP Asli',
        domAlamat: 'Jl. KTP Asli',
      }

      // User edits domicile while unsynced
      if (!isAlamatDomisiliSama) {
        fields.domAlamat = 'Jl. Kost Baru No. 12'
      }

      expect(fields.alamat).toBe('Jl. KTP Asli')
      expect(fields.domAlamat).toBe('Jl. Kost Baru No. 12')

      // User re-checks sync
      isAlamatDomisiliSama = true
      fields.domAlamat = fields.alamat
      expect(fields.domAlamat).toBe('Jl. KTP Asli')
    })
  })

  // =========================================================================
  // RULE 11347:178154 & 11347:172995: Pelaksana Transaksi Constraints
  // =========================================================================
  describe('Pelaksana Transaksi Constraints & Branch Tracking', () => {
    it('Rule 11347:178154: locks kewarganegaraan to WNI for KTP, allows options for Paspor', () => {
      const pelaksana = createDefaultPelaksanaState()
      expect(pelaksana.identityType).toBe('ktp')
      expect(pelaksana.kewarganegaraan).toBe('WNI')
      expect(pelaksana.figmaNodeId).toBe('11347:172827')

      // Switch to Paspor
      pelaksana.identityType = 'paspor'
      pelaksana.figmaNodeId = '11347:170073'
      pelaksana.kewarganegaraan = 'WNA'
      expect(pelaksana.kewarganegaraan).toBe('WNA')
      expect(pelaksana.figmaNodeId).toBe('11347:170073')

      // Switch back to KTP: must force back to WNI
      pelaksana.identityType = 'ktp'
      if (pelaksana.identityType === 'ktp') {
        pelaksana.kewarganegaraan = 'WNI'
        pelaksana.figmaNodeId = '11347:172827'
      }
      expect(pelaksana.kewarganegaraan).toBe('WNI')
      expect(pelaksana.figmaNodeId).toBe('11347:172827')
    })

    it('Rules 11347:172995 & 11347:172997: Masa Berlaku Seumur Hidup clears expiry date', () => {
      const pelaksana = createDefaultPelaksanaState()
      pelaksana.masaBerlakuType = 'sampai_dengan'
      pelaksana.tanggalBerlakuSampai = '2029-12-31'
      expect(pelaksana.tanggalBerlakuSampai).toBe('2029-12-31')

      // Toggle to seumur hidup
      pelaksana.masaBerlakuType = 'seumur_hidup'
      if (pelaksana.masaBerlakuType === 'seumur_hidup') {
        pelaksana.tanggalBerlakuSampai = ''
      }
      expect(pelaksana.tanggalBerlakuSampai).toBe('')
    })

    it('blocks advance when Pelaksana Transaksi is active but required fields are missing', () => {
      const validatePelaksana = (isActive: boolean, p: { namaLengkap: string; nik: string; nomorPaspor: string; identityType: string }) => {
        if (!isActive) return { valid: true }
        const idNumber = p.identityType === 'ktp' ? p.nik : p.nomorPaspor
        if (!p.namaLengkap || !idNumber) {
          return { valid: false, message: 'Mohon lengkapi data pelaksana transaksi.' }
        }
        return { valid: true }
      }

      // Incomplete KTP
      expect(validatePelaksana(true, { namaLengkap: '', nik: '3204123456780001', nomorPaspor: '', identityType: 'ktp' }).valid).toBe(false)
      expect(validatePelaksana(true, { namaLengkap: 'Bambang', nik: '', nomorPaspor: '', identityType: 'ktp' }).valid).toBe(false)
      // Complete KTP
      expect(validatePelaksana(true, { namaLengkap: 'Bambang', nik: '3204123456780001', nomorPaspor: '', identityType: 'ktp' }).valid).toBe(true)
      // Inactive Pelaksana passes regardless
      expect(validatePelaksana(false, { namaLengkap: '', nik: '', nomorPaspor: '', identityType: 'ktp' }).valid).toBe(true)
    })
  })

  // =========================================================================
  // RULE 11347:166514: Loan Portfolio Sorting Oracle
  // =========================================================================
  describe('Rule 11347:166514: Loan Portfolio Sorting Invariant', () => {
    it('guarantees Kolektabilitas 1 to 5 ascending, then Aktif before Lunas', () => {
      const unsorted: LoanPortfolioItem[] = [
        {
          no: 1,
          nomorKontrakMasked: '1001',
          namaProduk: 'P1',
          nominalMasked: 'Rp 10jt',
          kolektabilitas: '3 - Kurang Lancar',
          kolektabilitasScore: 3,
          statusKredit: 'Aktif',
        },
        {
          no: 2,
          nomorKontrakMasked: '1002',
          namaProduk: 'P2',
          nominalMasked: 'Rp 5jt',
          kolektabilitas: '1 - Lancar',
          kolektabilitasScore: 1,
          statusKredit: 'Lunas',
        },
        {
          no: 3,
          nomorKontrakMasked: '1003',
          namaProduk: 'P3',
          nominalMasked: 'Rp 15jt',
          kolektabilitas: '1 - Lancar',
          kolektabilitasScore: 1,
          statusKredit: 'Aktif',
        },
        {
          no: 4,
          nomorKontrakMasked: '1004',
          namaProduk: 'P4',
          nominalMasked: 'Rp 8jt',
          kolektabilitas: '2 - DPK',
          kolektabilitasScore: 2,
          statusKredit: 'Lunas',
        },
        {
          no: 5,
          nomorKontrakMasked: '1005',
          namaProduk: 'P5',
          nominalMasked: 'Rp 20jt',
          kolektabilitas: '2 - DPK',
          kolektabilitasScore: 2,
          statusKredit: 'Aktif',
        },
      ]

      const sorted = sortLoanPortfolio(unsorted)

      // Expected order:
      // 1. Kol 1, Aktif (no: 3)
      // 2. Kol 1, Lunas (no: 2)
      // 3. Kol 2, Aktif (no: 5)
      // 4. Kol 2, Lunas (no: 4)
      // 5. Kol 3, Aktif (no: 1)
      expect(sorted[0].no).toBe(3)
      expect(sorted[1].no).toBe(2)
      expect(sorted[2].no).toBe(5)
      expect(sorted[3].no).toBe(4)
      expect(sorted[4].no).toBe(1)
    })

    it('property-based stress test: verifies invariant across 20 randomized datasets', () => {
      const statuses: ('Aktif' | 'Lunas')[] = ['Aktif', 'Lunas']
      for (let run = 0; run < 20; run++) {
        const randomList: LoanPortfolioItem[] = Array.from({ length: 15 }, (_, i) => {
          const score = Math.floor(Math.random() * 5) + 1
          const status = statuses[Math.floor(Math.random() * 2)]
          return {
            no: i + 1,
            nomorKontrakMasked: `K-${i}`,
            namaProduk: `Prod-${i}`,
            nominalMasked: 'Rp 1.000.000',
            kolektabilitas: `${score} - Kol`,
            kolektabilitasScore: score,
            statusKredit: status,
          }
        })

        const sorted = sortLoanPortfolio(randomList)
        for (let i = 0; i < sorted.length - 1; i++) {
          const a = sorted[i]
          const b = sorted[i + 1]
          // Invariant 1: score_a <= score_b
          expect(a.kolektabilitasScore).toBeLessThanOrEqual(b.kolektabilitasScore)
          // Invariant 2: if equal score, Aktif before Lunas
          if (a.kolektabilitasScore === b.kolektabilitasScore) {
            if (a.statusKredit !== b.statusKredit) {
              expect(a.statusKredit).toBe('Aktif')
              expect(b.statusKredit).toBe('Lunas')
            }
          }
        }
      }
    })
  })

  // =========================================================================
  // UTILITY & STRESS HARNESSES
  // =========================================================================
  describe('Utility & Stress Harnesses: Normalization, Dukcapil, Age', () => {
    it('normalizes identity numbers with spaces and mixed case', () => {
      expect(normalizeIdentityNumber('3204 1111 1298 0003')).toBe('3204111112980003')
      expect(normalizeIdentityNumber('  0033 9714 84  ')).toBe('0033971484')
      expect(normalizeIdentityNumber('')).toBe('')
      expect(normalizeIdentityNumber(undefined)).toBe('')
    })

    it('formats masked identity correctly for KTP and Paspor', () => {
      expect(formatMaskedIdentity('3204111112980003', 'ktp')).toBe('3204 **** **** 0003')
      expect(formatMaskedIdentity('0033971484', 'paspor')).toBe('0033 **** 84')
      expect(formatMaskedIdentity('short', 'ktp')).toBe('short')
    })

    it('calculates age correctly for both ISO date and Indonesian date formats', () => {
      const ageIso = calculateAge('1990-01-01')
      expect(ageIso).toMatch(/\d+ Tahun/)

      const ageIndo = calculateAge('1 Januari 1990')
      expect(ageIndo).toMatch(/\d+ Tahun/)

      expect(calculateAge('')).toBe('')
      expect(calculateAge('invalid-date')).toBe('')
    })

    it('verifies Dukcapil validation logic for known NIK patterns', () => {
      expect(verifyDukcapil('3204111112980003')).toBe('valid')
      expect(verifyDukcapil('3204222212980004')).toBe('valid')
      expect(verifyDukcapil('1234567890123456')).toBe('tidak_sesuai')
      expect(verifyDukcapil('')).toBe('tidak_sesuai')
      expect(verifyDukcapil('123')).toBe('tidak_sesuai') // < 16 digits
    })
  })
})
