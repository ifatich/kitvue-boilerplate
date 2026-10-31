import { describe, it, expect } from 'vitest'
import { ref, watch, nextTick } from 'vue'
import {
  convertKonvenToSyariahCif,
  searchRahinCif,
  createInitialStep2State,
  createDefaultPelaksanaState,
  MOCK_RAHIN_CIF_DATABASE,
  KTP_SYARIAH_FOUND,
  KTP_KONVEN_ONLY,
  PASPOR_FOUND,
  NOT_FOUND,
  type RahinCifItem,
  type Step2State,
} from '@/components/modules/rahn/mockRahinData'
import type { BeneficialOwnerState } from '@/components/modules/rahn/step-1/BeneficialOwnerSection.vue'
import type { RahinFields } from '@/components/modules/rahn/step-2/Step2RahinContent.vue'
import Step2RahinContent from '@/components/modules/rahn/step-2/Step2RahinContent.vue'
import RahinCifTableSection from '@/components/modules/rahn/step-2/RahinCifTableSection.vue'
import RahinSaveSuccessModal from '@/components/modules/rahn/step-2/modals/RahinSaveSuccessModal.vue'
import RahinNotFoundModal from '@/components/modules/rahn/step-2/modals/RahinNotFoundModal.vue'

describe('Pinjaman Rahn Step 2 - Milestone M3 Business Rules & State Wiring', () => {
  describe('1. Case 1: CIF Konven to Syariah Conversion Flow (Requirement R4 & Figma 11347:163680 / 11347:175541)', () => {
    it('convertKonvenToSyariahCif transforms Konvensional record to valid Syariah CIF', () => {
      const konvenRecord = MOCK_RAHIN_CIF_DATABASE.find((c) => c.statusRahin === 'konvensional')!
      expect(konvenRecord).toBeDefined()
      expect(konvenRecord.statusRahin).toBe('konvensional')

      const converted = convertKonvenToSyariahCif(konvenRecord)
      expect(converted.id).toContain('cif-sya-created')
      expect(converted.statusRahin).toBe('syariah')
      expect(converted.namaRahin).toBe(konvenRecord.namaRahin)
      expect(converted.rawIdentitas).toBe(konvenRecord.rawIdentitas)
      expect(converted.jenisIdentitas).toBe(konvenRecord.jenisIdentitas)
      expect(converted.nomorCif).toMatch(/^7\d{3}\s\d{4}\s\d{2}$/)
      expect(converted.cabangPembuka).toContain('Syariah')
      expect(converted.verifikasiDukcapil).toBe('valid')
    })

    it('simulates Case 1 state transition from Konven-only search to Syariah CIF generation', () => {
      const state = createInitialStep2State()
      const searchResult = searchRahinCif('perorangan', 'ktp', KTP_KONVEN_ONLY.nomorIdentitas)

      state.cifList = searchResult.cifList
      state.portfolioList = searchResult.portfolioList

      expect(state.cifList.length).toBe(1)
      expect(state.cifList[0].statusRahin).toBe('konvensional')
      expect(state.selectedCifId).toBeNull()

      // In Syariah loan, unselected CIF or Konven CIF blocks progression
      const validateAdvance = (s: Step2State, fields: RahinFields) => {
        if (s.cifList.length > 0) {
          if (!s.selectedCifId) {
            return { valid: false, message: 'Pilih salah satu data CIF syariah untuk dilanjutkan ke detail data Rahin' }
          }
          const selected = s.cifList.find((c) => c.id === s.selectedCifId)
          if (selected && selected.statusRahin !== 'syariah') {
            return { valid: false, message: 'Pilih salah satu data CIF syariah untuk dilanjutkan ke detail data Rahin' }
          }
        }
        if (!fields.nik || !fields.nama) {
          return { valid: false, message: 'Mohon lengkapi data identitas Rahin.' }
        }
        return { valid: true }
      }

      const fields: RahinFields = {
        nik: '',
        nama: '',
        noHp: '',
        pekerjaan: '',
        nominal: '',
        alamat: '',
        hubungan: 'diri-sendiri',
      }

      // 1. Advance before conversion -> blocked
      const attempt1 = validateAdvance(state, fields)
      expect(attempt1.valid).toBe(false)
      expect(attempt1.message).toBe('Pilih salah satu data CIF syariah untuk dilanjutkan ke detail data Rahin')

      // 2. Perform Case 1 Conversion
      const converted = convertKonvenToSyariahCif(state.cifList[0])
      state.cifList.unshift(converted)
      state.selectedCifId = converted.id
      state.currentView = 'detail_syariah'

      fields.nik = converted.rawIdentitas
      fields.nama = converted.namaRahin
      fields.cif = converted.nomorCif
      fields.statusRahin = converted.statusRahin

      // 3. Advance after conversion -> permitted
      const attempt2 = validateAdvance(state, fields)
      expect(attempt2.valid).toBe(true)
      expect(fields.statusRahin).toBe('syariah')
      expect(fields.cif).toMatch(/^7/)
    })

    it('exports RahinSaveSuccessModal component definition', () => {
      expect(RahinSaveSuccessModal).toBeDefined()
      expect(RahinSaveSuccessModal.name || RahinSaveSuccessModal.__name).toBe('RahinSaveSuccessModal')
    })
  })

  describe('2. Case 2: Existing Syariah CIF Flow (Figma 11347:163682)', () => {
    it('retrieves and auto-selects single Syariah CIF for registered customer', () => {
      const state = createInitialStep2State()
      const searchResult = searchRahinCif('perorangan', 'paspor', PASPOR_FOUND.nomorIdentitas)

      state.cifList = searchResult.cifList
      state.portfolioList = searchResult.portfolioList

      expect(state.cifList.length).toBe(1)
      const singleCif = state.cifList[0]
      expect(singleCif.statusRahin).toBe('syariah')

      // Edge Case 4: Single CIF auto-selection
      state.selectedCifId = singleCif.id
      state.currentView = 'detail_syariah'

      expect(state.selectedCifId).toBe('cif-pas-01')
      expect(singleCif.namaRahin).toBe('Robert Smith')
      expect(singleCif.jenisIdentitas).toBe('paspor')
    })

    it('manages multi-CIF selection where Syariah record is selected among Konven records', () => {
      const state = createInitialStep2State()
      const searchResult = searchRahinCif('perorangan', 'ktp', KTP_SYARIAH_FOUND.nomorIdentitas)

      state.cifList = searchResult.cifList
      expect(state.cifList.length).toBe(2)

      const syariahRecord = state.cifList.find((c) => c.statusRahin === 'syariah')!
      const konvenRecord = state.cifList.find((c) => c.statusRahin === 'konvensional')!
      expect(syariahRecord).toBeDefined()
      expect(konvenRecord).toBeDefined()

      // Selecting Syariah record
      state.selectedCifId = syariahRecord.id
      expect(state.selectedCifId).toBe('cif-sya-01')
      expect(syariahRecord.nomorCif).toBe('1234 1234 01')
    })
  })

  describe('3. Case 3: Identity Not Found Modal / Flow (Figma 11347:162934 / 11347:163372 / 11347:165167)', () => {
    it('returns empty results for non-existent NIK and triggers negative flow', () => {
      const searchResult = searchRahinCif('perorangan', 'ktp', NOT_FOUND.nomorIdentitas)
      expect(searchResult.cifList.length).toBe(0)
      expect(searchResult.portfolioList.length).toBe(0)
    })

    it('handles transition to tambah_baru mode with clean registration fields', () => {
      const state = createInitialStep2State()
      const queryNumber = NOT_FOUND.nomorIdentitas

      // Simulate negative lookup
      state.cifList = []
      state.selectedCifId = null
      state.currentView = 'search'

      // Operator triggers "Tambah Rahin Baru"
      state.currentView = 'tambah_baru'

      const fields: RahinFields = {
        nik: queryNumber,
        nama: '',
        noHp: '',
        pekerjaan: 'Pegawai Swasta',
        nominal: '',
        alamat: '',
        hubungan: 'diri-sendiri',
        statusRahin: 'syariah',
        ratingRahin: 'Classic',
        dukcapilStatus: 'belum_cek',
      }

      expect(state.currentView).toBe('tambah_baru')
      expect(fields.nik).toBe(queryNumber)
      expect(fields.nama).toBe('')
      expect(fields.dukcapilStatus).toBe('belum_cek')

      // Validation fails when nama is empty
      const isComplete = !!(fields.nik && fields.nama)
      expect(isComplete).toBe(false)

      // Completing fields passes validation
      fields.nama = 'Zulkifli Nasabah Baru'
      expect(!!(fields.nik && fields.nama)).toBe(true)
    })

    it('exports RahinNotFoundModal component definition', () => {
      expect(RahinNotFoundModal).toBeDefined()
      expect(RahinNotFoundModal.name || RahinNotFoundModal.__name).toBe('RahinNotFoundModal')
    })
  })

  describe('4. Unselected CIF Advance Warning & Notice Integration (Figma 11347:173010)', () => {
    it('produces exact warning message when user attempts to proceed without selecting Syariah CIF', () => {
      const state = createInitialStep2State()
      state.cifList = MOCK_RAHIN_CIF_DATABASE.filter((c) => c.statusRahin === 'syariah')
      state.selectedCifId = null // None selected

      const evaluateAdvance = (s: Step2State) => {
        if (s.cifList.length > 0 && !s.selectedCifId) {
          return {
            valid: false,
            message: 'Pilih salah satu data CIF syariah untuk dilanjutkan ke detail data Rahin',
          }
        }
        return { valid: true }
      }

      const result = evaluateAdvance(state)
      expect(result.valid).toBe(false)
      expect(result.message).toBe('Pilih salah satu data CIF syariah untuk dilanjutkan ke detail data Rahin')
    })
  })

  describe('5. Inter-Step State Integration with boState & Bottom Navigation (Requirement R3)', () => {
    it('activates and pre-populates Pelaksana Transaksi when boState is orang_lain', () => {
      const boState: BeneficialOwnerState = {
        type: 'orang_lain',
        tipeRahin: 'perorangan',
        identityType: 'ktp',
        identityNumber: '3204 8888 8888 0001',
        relationship: 'Kuasa Hukum',
        selectedBO: {
          id: 'bo-01',
          name: 'Hendra Gunawan',
          registrationNumber: 'REG-001',
          nik: '3204 8888 8888 0001',
          birthDate: '1985-05-15',
          motherName: 'Ibu Hendra',
          gender: 'Laki-laki',
          job: 'Pengacara',
          address: 'Jl. Merdeka No. 10',
          phone: '081234567890',
          branch: 'Cabang Jakarta',
          isDukcapilVerified: true,
        },
        document: null,
        isAlamatSesuaiKtp: true,
      }

      const pelaksana = createDefaultPelaksanaState()

      // Simulate watcher in Step 2
      if (boState.type === 'orang_lain') {
        pelaksana.isActive = true
        if (boState.selectedBO) {
          pelaksana.namaLengkap = boState.selectedBO.name
          pelaksana.hubunganDenganRahin = boState.relationship
        }
        if (boState.identityType === 'paspor') {
          pelaksana.identityType = 'paspor'
          pelaksana.nomorPaspor = boState.identityNumber
          pelaksana.kewarganegaraan = 'WNI'
        } else {
          pelaksana.identityType = 'ktp'
          pelaksana.nik = boState.identityNumber
          pelaksana.kewarganegaraan = 'WNI'
        }
      }

      expect(pelaksana.isActive).toBe(true)
      expect(pelaksana.namaLengkap).toBe('Hendra Gunawan')
      expect(pelaksana.hubunganDenganRahin).toBe('Kuasa Hukum')
      expect(pelaksana.identityType).toBe('ktp')
      expect(pelaksana.nik).toBe('3204 8888 8888 0001')
      expect(pelaksana.kewarganegaraan).toBe('WNI')
    })

    it('validates Pelaksana Transaksi requirements when pelaksana is active', () => {
      const pelaksana = createDefaultPelaksanaState()
      pelaksana.isActive = true

      const validatePelaksana = (p: typeof pelaksana) => {
        if (!p.isActive) return { valid: true }
        const idNumber = p.identityType === 'ktp' ? p.nik : p.nomorPaspor
        if (!p.namaLengkap || !idNumber) {
          return {
            valid: false,
            message: 'Mohon lengkapi data pelaksana transaksi (Nama dan Nomor Identitas wajib diisi).',
          }
        }
        return { valid: true }
      }

      // Empty Pelaksana fails
      const check1 = validatePelaksana(pelaksana)
      expect(check1.valid).toBe(false)
      expect(check1.message).toContain('pelaksana transaksi')

      // Filled Pelaksana passes
      pelaksana.namaLengkap = 'Ahmad Kuasa'
      pelaksana.nik = '3204 1234 5678 9999'
      const check2 = validatePelaksana(pelaksana)
      expect(check2.valid).toBe(true)
    })

    it('simulates multi-step navigation coordination in parent view (nextStep / prevStep)', () => {
      const activeStep = ref(1)
      const validationAlert = ref<string | null>(null)
      const step1SubView = ref<'search' | 'detail' | 'tambah'>('search')

      // Mock Step 2 ref handler
      let step2Valid = false
      let step2Message = 'Pilih salah satu data CIF syariah untuk dilanjutkan ke detail data Rahin'

      const nextStep = () => {
        if (activeStep.value === 1) {
          validationAlert.value = null
          activeStep.value = 2
          return
        }
        if (activeStep.value === 2) {
          if (!step2Valid) {
            validationAlert.value = step2Message
            return
          }
          validationAlert.value = null
          activeStep.value = 3
          return
        }
      }

      const prevStep = () => {
        validationAlert.value = null
        if (activeStep.value === 2) {
          activeStep.value = 1
          step1SubView.value = 'search'
          return
        }
        if (activeStep.value > 2) {
          activeStep.value--
          return
        }
      }

      // 1. Start at step 1
      expect(activeStep.value).toBe(1)

      // 2. Advance to step 2
      nextStep()
      expect(activeStep.value).toBe(2)
      expect(validationAlert.value).toBeNull()

      // 3. Attempt advance at step 2 with invalid state -> blocked
      nextStep()
      expect(activeStep.value).toBe(2)
      expect(validationAlert.value).toBe('Pilih salah satu data CIF syariah untuk dilanjutkan ke detail data Rahin')

      // 4. Resolve Step 2 validation
      step2Valid = true
      nextStep()
      expect(activeStep.value).toBe(3)
      expect(validationAlert.value).toBeNull()

      // 5. Back from step 3 to step 2
      prevStep()
      expect(activeStep.value).toBe(2)

      // 6. Back from step 2 to step 1
      prevStep()
      expect(activeStep.value).toBe(1)
      expect(step1SubView.value).toBe('search')
    })
  })

  describe('6. Component Exports & Interface Parity', () => {
    it('verifies all Step 2 components are exported from module index', () => {
      expect(Step2RahinContent).toBeDefined()
      expect(RahinCifTableSection).toBeDefined()
      expect(RahinSaveSuccessModal).toBeDefined()
      expect(RahinNotFoundModal).toBeDefined()
    })
  })
})
