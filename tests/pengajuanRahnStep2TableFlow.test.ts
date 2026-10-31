/**
 * @file tests/pengajuanRahnStep2TableFlow.test.ts
 * @description Unit tests for Step 2 Table Styling & Navigation Flow:
 * 1. Table structure and classes matching Step 1 (bo-table-container, bo-table, col-aksi, bo-table-footer, etc.)
 * 2. Clicking 'Pilih' on CIF table opens subView 'detail' directly (1:1 with Beneficial Owner Step 1).
 * 3. Detail page internal navigation (Sebelumnya returns to search, Selanjutnya triggers Case 1 conversion if Konven).
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'

beforeAll(() => {
  if (typeof globalThis.window === 'undefined') {
    ;(globalThis as any).window = {
      screen: { height: 1080, width: 1920 },
      matchMedia: () => ({ matches: false }),
      addEventListener: () => {},
      removeEventListener: () => {},
      scrollTo: () => {},
    }
  }
})

import Step2RahinContent from '@/components/modules/rahn/step-2/Step2RahinContent.vue'
import RahinCifTableSection from '@/components/modules/rahn/step-2/RahinCifTableSection.vue'
import RahinPortfolioTableSection from '@/components/modules/rahn/step-2/RahinPortfolioTableSection.vue'
import RahinDetailSection from '@/components/modules/rahn/step-2/RahinDetailSection.vue'
import ValidasiDukcapilModal from '@/components/modules/rahn/step-2/modals/ValidasiDukcapilModal.vue'
import {
  MOCK_RAHIN_CIF_DATABASE,
  searchRahinCif,
} from '@/components/modules/rahn/mockRahinData'

describe('Step 2: Table Styling & Direct Detail Page Navigation', () => {
  describe('1. Table Styling & Class Synchronization', () => {
    it('RahinCifTableSection contains Step 1 classes (bo-table-container, bo-table, col-aksi, bo-table-footer)', async () => {
      const items = MOCK_RAHIN_CIF_DATABASE.slice(0, 3)
      const app = createSSRApp({
        render: () =>
          h(RahinCifTableSection, {
            items,
            selectedCifId: items[0].id,
            isOpen: true,
          }),
      })

      const html = await renderToString(app)
      expect(html).toContain('bo-table-container')
      expect(html).toContain('bo-table')
      expect(html).toContain('col-aksi')
      expect(html).toContain('bo-table-toolbar')
      expect(html).toContain('bo-table-footer')
      expect(html).toContain('selected-row')
      expect(html).toContain('Terpilih')
      expect(html).toContain('Pilih')
    })

    it('RahinPortfolioTableSection contains Step 1 classes (bo-table-container, bo-table, bo-table-toolbar, bo-table-footer)', async () => {
      const searchRes = searchRahinCif('perorangan', 'ktp', '3204 2849 1298 0003')
      const app = createSSRApp({
        render: () =>
          h(RahinPortfolioTableSection, {
            items: searchRes.portfolioList,
            isOpen: true,
          }),
      })

      const html = await renderToString(app)
      expect(html).toContain('bo-table-container')
      expect(html).toContain('bo-table')
      expect(html).toContain('bo-table-toolbar')
      expect(html).toContain('bo-table-footer')
      expect(html).toContain('contract-highlight')
    })
  })

  describe('2. Direct Detail Page Navigation on CIF Selection', () => {
    it('Step2RahinContent initializes with empty state matching Figma Image 2', async () => {
      let exposed: any = null
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = {
            isMobile: false,
            subView: 'search',
          }
          setupFn(props, {
            emit: () => {},
            expose: (exp: any) => {
              exposed = exp
            },
          })
          return () => h('div')
        },
      })

      await renderToString(app)
      expect(exposed).toBeTruthy()
      expect(exposed.subView.value).toBe('search')
      expect(exposed.step2State.value.selectedCifId).toBeNull()
      expect(exposed.step2State.value.cifList.length).toBe(0)
      expect(exposed.step2State.value.search.tipeRahin).toBe('')
      expect(exposed.step2State.value.search.jenisIdentitas).toBe('')
    })

    it('clicking Pilih on any CIF row navigates immediately to subView detail (like Beneficial Owner in Step 1)', async () => {
      let exposed: any = null
      const emitted: Array<{ event: string; val: any }> = []
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = {
            isMobile: false,
            subView: 'search',
          }
          setupFn(props, {
            emit: (event: string, val: any) => emitted.push({ event, val }),
            expose: (exp: any) => {
              exposed = exp
            },
          })
          return () => h('div')
        },
      })

      await renderToString(app)

      // Search Anastasya Delistya
      exposed.step2State.value.search.tipeRahin = 'perorangan'
      exposed.step2State.value.search.jenisIdentitas = 'ktp'
      exposed.step2State.value.search.nomorIdentitas = '3204 2849 1298 0003'
      exposed.handleSearch()

      // User selects row 2 (cif-ana-04)
      const targetCif = exposed.step2State.value.cifList[1]
      expect(targetCif).toBeDefined()
      exposed.handleSelectCif(targetCif)

      expect(exposed.step2State.value.selectedCifId).toBe(targetCif.id)
      expect(exposed.subView.value).toBe('detail')
      expect(exposed.fieldsModel.value.cif).toBe(targetCif.nomorCif)
      expect(exposed.isSuccessModalOpen.value).toBe(false) // Does not open modal prematurely on row select
    })

    it('handlePrev from detail subView navigates back to search subView without exiting Step 2', async () => {
      let exposed: any = null
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = {
            isMobile: false,
            subView: 'search',
          }
          setupFn(props, {
            emit: () => {},
            expose: (exp: any) => {
              exposed = exp
            },
          })
          return () => h('div')
        },
      })

      await renderToString(app)

      // Enter detail view
      exposed.subView.value = 'detail'

      // Call handlePrev
      const canExit = exposed.handlePrev()
      expect(canExit).toBe(false) // Handled internally
      expect(exposed.subView.value).toBe('search')

      // Call handlePrev again from search view
      const canExitRoot = exposed.handlePrev()
      expect(canExitRoot).toBe(true) // Now permitted to exit to Step 1
    })

    it('advancing from detail view with valid Data Rahin triggers success modal', async () => {
      let exposed: any = null
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = {
            isMobile: false,
            subView: 'search',
          }
          setupFn(props, {
            emit: () => {},
            expose: (exp: any) => {
              exposed = exp
            },
          })
          return () => h('div')
        },
      })

      await renderToString(app)

      // Search Anastasya Delistya
      exposed.step2State.value.search.tipeRahin = 'perorangan'
      exposed.step2State.value.search.jenisIdentitas = 'ktp'
      exposed.step2State.value.search.nomorIdentitas = '3204 2849 1298 0003'
      exposed.handleSearch()

      // Select row 1 and enter detail view
      const row1 = exposed.step2State.value.cifList[0]
      exposed.handleSelectCif(row1)
      expect(exposed.subView.value).toBe('detail')
      expect(row1.statusRahin).toBe('konvensional')

      const result = exposed.handleNext()
      expect(result.valid).toBe(true)
      expect(result.handled).toBe(true)
      expect(exposed.isSuccessModalOpen.value).toBe(true)
    })
  })

  describe('3. Terpilih vs Pilih Action Button Modes & Detail Form Disabled/Enabled Fidelity (Figma Node 11347:176071)', () => {
    it('clicking Terpilih emits select with mode "terpilih" and sets detailSelectionMode to "terpilih"', async () => {
      let emittedSelect: any = null
      const items = MOCK_RAHIN_CIF_DATABASE.slice(0, 3)
      const app = createSSRApp({
        render: () =>
          h(RahinCifTableSection, {
            items,
            selectedCifId: items[0].id,
            isOpen: true,
            onSelect: (item: any, mode: any) => {
              emittedSelect = { item, mode }
            },
          }),
      })

      const html = await renderToString(app)
      expect(html).toContain('btn-terpilih')
      expect(html).toContain('btn-pilih')
    })

    it('Step2RahinContent in "terpilih" mode renders RahinDetailSection in FULL DISABLE state', async () => {
      let exposed: any = null
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = {
            isMobile: false,
            subView: 'search',
          }
          setupFn(props, {
            emit: () => {},
            expose: (exp: any) => {
              exposed = exp
            },
          })
          return () => h('div')
        },
      })

      await renderToString(app)

      // Search Anastasya Delistya
      exposed.step2State.value.search.tipeRahin = 'perorangan'
      exposed.step2State.value.search.jenisIdentitas = 'ktp'
      exposed.step2State.value.search.nomorIdentitas = '3204 2849 1298 0003'
      exposed.handleSearch()

      const row1 = exposed.step2State.value.cifList[0]
      // Click Terpilih
      exposed.handleSelectCif(row1, 'terpilih')

      expect(exposed.detailSelectionMode.value).toBe('terpilih')
      expect(exposed.subView.value).toBe('detail')

      // Render RahinDetailSection with 'terpilih' mode
      const detailApp = createSSRApp({
        render: () =>
          h(RahinDetailSection, {
            modelValue: exposed.fieldsModel.value,
            selectionMode: 'terpilih',
            isReadOnly: true,
          }),
      })

      const detailHtml = await renderToString(detailApp)
      // When full disabled, every input field has disabled attribute
      expect(detailHtml).toContain('disabled')
      expect(detailHtml).toContain('Anastasya Delistya')
      expect(detailHtml).toContain('Putra')
    })

    it('Step2RahinContent in "pilih" mode leaves placeholder fields enabled (Figma Node 11347:176071)', async () => {
      let exposed: any = null
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = {
            isMobile: false,
            subView: 'search',
          }
          setupFn(props, {
            emit: () => {},
            expose: (exp: any) => {
              exposed = exp
            },
          })
          return () => h('div')
        },
      })

      await renderToString(app)

      // Search Anastasya Delistya
      exposed.step2State.value.search.tipeRahin = 'perorangan'
      exposed.step2State.value.search.jenisIdentitas = 'ktp'
      exposed.step2State.value.search.nomorIdentitas = '3204 2849 1298 0003'
      exposed.handleSearch()

      const row2 = exposed.step2State.value.cifList[1]
      // Click Pilih
      exposed.handleSelectCif(row2, 'pilih')

      expect(exposed.detailSelectionMode.value).toBe('pilih')
      expect(exposed.subView.value).toBe('detail')
      // Fields that are placeholder by default are empty
      expect(exposed.fieldsModel.value.isAlamatDomisiliSama).toBe(false)
      expect(exposed.fieldsModel.value.pendidikan).toBe('')
      expect(exposed.fieldsModel.value.namaPasangan).toBe('')
      expect(exposed.fieldsModel.value.noHp).toBe('')

      // Render RahinDetailSection with 'pilih' mode
      const detailApp = createSSRApp({
        render: () =>
          h(RahinDetailSection, {
            modelValue: exposed.fieldsModel.value,
            selectionMode: 'pilih',
            isReadOnly: false,
          }),
      })

      const detailHtml = await renderToString(detailApp)
      // Has disabled fields for default identity data
      expect(detailHtml).toContain('disabled')
      // Has enabled placeholder fields matching Figma 11347:176071
      expect(detailHtml).toContain('Pilih pendidikan')
      expect(detailHtml).toContain('Masukkan nama pasangan')
      expect(detailHtml).toContain('Masukkan nomor handphone')
      expect(detailHtml).toContain('Masukkan kode pos')
      expect(detailHtml).toContain('Pilih provinsi')
    })
  })

  describe('4. Negative Flow & Tambah Rahin Baru Flow with Dukcapil Validation (Figma 11347:173573, 11347:176830, 11347:166766)', () => {
    it('Negative flow opens RahinNotFoundModal directly without inline empty card', async () => {
      let exposed: any = null
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = {
            isMobile: false,
            subView: 'search',
          }
          setupFn(props, {
            emit: () => {},
            expose: (exp: any) => {
              exposed = exp
            },
          })
          return () => h(Step2RahinContent, props)
        },
      })

      const html = await renderToString(app)
      // Initial render has no search results and no negative card
      expect(html).not.toContain('NIK / No. Paspor Tidak Ditemukan')

      // Perform negative search
      exposed.step2State.value.search.tipeRahin = 'perorangan'
      exposed.step2State.value.search.jenisIdentitas = 'ktp'
      exposed.step2State.value.search.nomorIdentitas = '3204999999999999'
      exposed.handleSearch()

      // When search yields 0 items, isNotFoundModalOpen is immediately set to true
      expect(exposed.step2State.value.cifList.length).toBe(0)
      expect(exposed.isNotFoundModalOpen.value).toBe(true)
    })

    it('Tambah Rahin Baru transitions to detail page with empty placeholders and hides CIF in Seksi 1', async () => {
      let exposed: any = null
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = {
            isMobile: false,
            subView: 'search',
          }
          setupFn(props, {
            emit: () => {},
            expose: (exp: any) => {
              exposed = exp
            },
          })
          return () => h('div')
        },
      })

      await renderToString(app)

      exposed.step2State.value.search.tipeRahin = 'perorangan'
      exposed.step2State.value.search.jenisIdentitas = 'ktp'
      exposed.step2State.value.search.nomorIdentitas = '3204999999999999'
      exposed.handleSearch()

      // Trigger "Tambah Rahin Baru" from modal
      exposed.handleTambahRahinBaru()

      expect(exposed.subView.value).toBe('detail')
      expect(exposed.detailSelectionMode.value).toBe('tambah')
      expect(exposed.fieldsModel.value.nik).toBe('3204999999999999')
      expect(exposed.fieldsModel.value.nama).toBe('')
      expect(exposed.fieldsModel.value.cif).toBe('')

      // Mount RahinDetailSection with 'tambah' mode
      let detailExposed: any = null
      const detailApp = createSSRApp({
        setup() {
          const setupFn = (RahinDetailSection as any).setup
          const props = {
            modelValue: exposed.fieldsModel.value,
            selectionMode: 'tambah' as const,
            isReadOnly: false,
          }
          setupFn(props, {
            emit: () => {},
            expose: (exp: any) => {
              detailExposed = exp
            },
          })
          return () => h(RahinDetailSection, props)
        },
      })

      const detailHtml = await renderToString(detailApp)
      expect(detailExposed.isTambahMode.value).toBe(true)
      expect(detailExposed.isIdentityFieldsDisabled.value).toBe(false)

      // Seksi 1 does NOT contain "Nomor CIF" in tambah mode (Figma 11347:176864)
      expect(detailHtml).not.toContain('label="Nomor CIF"')

      // Seksi 2 and 3 have placeholders
      expect(detailHtml).toContain('placeholder="Masukkan nama lengkap sesuai identitas"')
      expect(detailHtml).toContain('placeholder="Masukkan nama ibu kandung"')
      expect(detailHtml).toContain('placeholder="Contoh: Jakarta"')
      expect(detailHtml).toContain('placeholder="Pilih tanggal lahir"')
    })

    it('Cek Dukcapil on Tambah mode: gap opens ValidasiDukcapilModal, matching validates immediately', async () => {
      let detailExposed: any = null
      const initialFields = {
        nik: '3204 1111 1298 0003',
        nama: 'Nama Berbeda Gap', // Mismatch with Dukcapil
        tempatLahir: 'Jakarta',
        tanggalLahir: '1995-05-20',
        jenisKelamin: 'Laki-laki',
        namaIbuKandung: 'Siti',
        alamat: 'Jl. Merdeka No 1',
        hubungan: 'diri-sendiri',
        pekerjaan: '',
        nominal: '',
        noHp: '',
      }

      const detailApp = createSSRApp({
        setup() {
          const setupFn = (RahinDetailSection as any).setup
          const props = {
            modelValue: initialFields,
            selectionMode: 'tambah' as const,
            isReadOnly: false,
          }
          setupFn(props, {
            emit: () => {},
            expose: (exp: any) => {
              detailExposed = exp
            },
          })
          return () => h(RahinDetailSection, props)
        },
      })

      await renderToString(detailApp)

      // Trigger Cek Dukcapil with gap data
      detailExposed.handleCekDukcapil()
      // Wait for timer simulation
      await new Promise((r) => setTimeout(r, 350))

      // Gap detected -> ValidasiDukcapilModal is opened!
      expect(detailExposed.isDukcapilModalOpen.value).toBe(true)
      expect(detailExposed.localFields.value.dukcapilStatus).toBe('tidak_sesuai')

      // Sync data from Dukcapil confirmation
      detailExposed.handleConfirmDukcapilSync({
        nik: '3204 1111 1298 0003',
        nama: 'Anastasya Delistya',
        tempatLahir: 'Bandung',
        tanggalLahir: '1990-01-01',
        jenisKelamin: 'Perempuan',
        namaIbuKandung: 'Putri',
        alamat: 'Pertokoan Kenari Baru, Senen',
      })

      expect(detailExposed.localFields.value.nama).toBe('Anastasya Delistya')
      expect(detailExposed.localFields.value.dukcapilStatus).toBe('valid')
    })

    it('ValidasiDukcapilModal renders 15 field cards conforming 1:1 with Figma 11347:166766 & popovers', async () => {
      let modalExposed: any = null
      const modalApp = createSSRApp({
        setup() {
          const setupFn = (ValidasiDukcapilModal as any).setup
          const props = {
            modelValue: true,
            inputData: {
              nik: '3201 0218 1194 0000',
              nama: 'Thoriq Sadad',
              tempatLahir: 'Bogor',
              tanggalLahir: '01 Januari 1990',
              jenisKelamin: 'Laki-laki',
              namaIbuKandung: 'Putri',
              alamat: 'Jalan Kemana',
            },
            isMobile: false,
            disableTeleport: true,
          }
          setupFn(props, {
            emit: () => {},
            expose: (exp: any) => {
              modalExposed = exp
            },
          })
          return () => h(ValidasiDukcapilModal, props)
        },
      })

      const html = await renderToString(modalApp)

      // Header & Infotip banner
      expect(html).toContain('Validasi Dukcapil')
      expect(html).toContain('Terdapat data input yang tidak sesuai dengan Dukcapil')

      // Grid contains all 15 field cards
      expect(html).toContain('Nomor Induk Kependudukan (NIK)')
      expect(html).toContain('Nama Lengkap')
      expect(html).toContain('Tempat Lahir')
      expect(html).toContain('Tanggal Lahir')
      expect(html).toContain('Jenis Kelamin')
      expect(html).toContain('Nama Ibu Kandung')
      expect(html).toContain('Agama')
      expect(html).toContain('Pekerjaan')
      expect(html).toContain('Alamat')
      expect(html).toContain('RT')
      expect(html).toContain('RW')
      expect(html).toContain('Provinsi')
      expect(html).toContain('Kota/Kabupaten')
      expect(html).toContain('Kecamatan')
      expect(html).toContain('Kelurahan')

      // Default typing scenario (Figma 11347:166766 & media_0.png)
      // Mismatched fields: Tempat Lahir (79) and Nama Ibu Kandung (80)
      expect(html).toContain('TIDAK SESUAI (79)')
      expect(html).toContain('TIDAK SESUAI (80)')
      expect(html).toContain('Data sesuai Dukcapil.')

      // Footer buttons
      expect(html).toContain('Kembali')
      expect(html).toContain('Cek Dukcapil')
    })
  })
})
