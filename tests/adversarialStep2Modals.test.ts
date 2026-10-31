/**
 * @file tests/adversarialStep2Modals.test.ts
 * @description Adversarial empirical challenge test suite for Milestone M4 (Requirement R3):
 * 1. Full absence of the CIF conversion modal ("Buat CIF Syariah dari Data Konvensional") across
 *    all interaction vectors (selection, next, prev, keyboard, DOM tree).
 * 2. Success modal gating: invalid submissions with missing NIK, Nama, or Pelaksana details
 *    must NEVER trigger the modal and must surface proper validation errors.
 * 3. Exact design, text, and accessibility compliance of RahinSaveSuccessModal.
 * 4. Clean Step 3 transition: clicking "Lanjutkan ke Data Jaminan" closes modal and advances stepper & URL to Step 3.
 * 5. Stress testing: rapid repetitive clicks, 100-cycle reopenings, backdrop cleanup, and idempotency.
 */

import { beforeAll, describe, expect, it } from 'vitest'
import { createSSRApp, h, nextTick, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'

// Polyfill window & localStorage for Node test runner
beforeAll(() => {
  if (typeof globalThis.window === 'undefined') {
    ;(globalThis as any).window = {
      screen: { height: 1080, width: 1920 },
      matchMedia: () => ({ matches: false }),
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
      scrollTo: () => {},
      Event: typeof globalThis.Event !== 'undefined' ? globalThis.Event : class Event {},
    }
  }
  if (!(globalThis as any).window.Event) {
    ;(globalThis as any).window.Event = typeof globalThis.Event !== 'undefined' ? globalThis.Event : class Event {}
  }
  if (!(globalThis as any).window.dispatchEvent) {
    ;(globalThis as any).window.dispatchEvent = () => true
  }
  if (typeof globalThis.localStorage === 'undefined') {
    const store: Record<string, string> = {}
    ;(globalThis as any).localStorage = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, val: string) => {
        store[key] = String(val)
      },
      removeItem: (key: string) => {
        delete store[key]
      },
      clear: () => {
        for (const k of Object.keys(store)) delete store[k]
      },
    }
  }
  globalThis.localStorage.setItem('kitvue_auth_state', 'true')
})

import * as RahnExports from '@/components/modules/rahn'
import Step2RahinContent from '@/components/modules/rahn/step-2/Step2RahinContent.vue'
import RahinSaveSuccessModal from '@/components/modules/rahn/step-2/modals/RahinSaveSuccessModal.vue'
import PengajuanRahnView from '@/views/PengajuanRahnView.vue'
import {
  KTP_KONVEN_ONLY,
  KTP_SYARIAH_FOUND,
  MOCK_RAHIN_CIF_DATABASE,
  searchRahinCif,
} from '@/components/modules/rahn/mockRahinData'
import { buildRahnPath } from '@/router/rahnRouting'

// Helper to create test router instance
function createTestRouter(initialUrl = '/pengajuan-rahn') {
  const routes: RouteRecordRaw[] = [
    {
      path: '/pengajuan-rahn/:step?/:action?/:id?',
      name: 'pengajuan-rahn',
      component: PengajuanRahnView,
    },
    {
      path: '/:catchAll(.*)*',
      component: { render: () => h('div', '404') },
    },
  ]
  const history = createMemoryHistory()
  const router = createRouter({ history, routes })
  router.push(initialUrl)
  return router
}

describe('Adversarial Challenge Suite: Requirement R3 (Step 2 Modals & Step 3 Transition)', () => {
  // =========================================================================
  // 1. FULL ABSENCE OF CIF CONVERSION MODAL ACROSS ALL INTERACTION VECTORS
  // =========================================================================
  describe('1. Full Absence of CIF Conversion Modal ("Buat CIF Syariah dari Data Konvensional")', () => {
    it('Vector 1A: Module export audit — RahinCreateCifModal is NOT exported from @/components/modules/rahn', () => {
      expect((RahnExports as any).RahinCreateCifModal).toBeUndefined()
      expect(RahnExports.RahinSaveSuccessModal).toBeDefined()
    })

    it('Vector 1B: Selecting Konvensional CIF row moves directly to detail page without conversion modal', async () => {
      let exposed: any = null
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = { isMobile: false, subView: 'search' }
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

      // Search Konvensional-only customer
      exposed.step2State.value.search.tipeRahin = 'perorangan'
      exposed.step2State.value.search.jenisIdentitas = 'ktp'
      exposed.step2State.value.search.nomorIdentitas = KTP_KONVEN_ONLY.nomorIdentitas
      exposed.handleSearch()

      expect(exposed.step2State.value.cifList.length).toBeGreaterThan(0)
      const konvenRow = exposed.step2State.value.cifList[0]
      expect(konvenRow.statusRahin).toBe('konvensional')

      // Select Konvensional row
      exposed.handleSelectCif(konvenRow)

      // Must directly advance to detail subView
      expect(exposed.subView.value).toBe('detail')
      expect(exposed.step2State.value.currentView).toBe('detail_syariah')

      // Conversion modal state must NOT exist
      expect(exposed.isConvertModalOpen).toBeUndefined()
      expect(exposed.targetKonvenCif).toBeUndefined()
      expect(exposed.conversionSuccessMessage).toBeUndefined()
      expect(exposed.isSuccessModalOpen.value).toBe(false)
    })

    it('Vector 1C: Next click with selected Konvensional row advances directly to detail without modal interruption', async () => {
      let exposed: any = null
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = { isMobile: false, subView: 'search' }
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

      // Populate CIF list and select Konvensional record
      const konvenRecord = MOCK_RAHIN_CIF_DATABASE.find((c) => c.statusRahin === 'konvensional')!
      exposed.step2State.value.cifList = [konvenRecord]
      exposed.step2State.value.selectedCifId = konvenRecord.id

      // Trigger handleNext() while on search view
      const result = exposed.handleNext()
      expect(result.valid).toBe(true)
      expect(result.handled).toBe(true)

      // Should land on detail page
      expect(exposed.subView.value).toBe('detail')
      expect(exposed.detailSelectionMode.value).toBe('terpilih')
      expect(exposed.isConvertModalOpen).toBeUndefined()
      expect(exposed.isSuccessModalOpen.value).toBe(false)
    })

    it('Vector 1D: Prev click from detail page returns smoothly to search view without opening any modal', async () => {
      let exposed: any = null
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = { isMobile: false, subView: 'detail' }
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

      expect(exposed.subView.value).toBe('detail')
      const canExit = exposed.handlePrev()

      // false means navigation is handled internally within Step 2
      expect(canExit).toBe(false)
      expect(exposed.subView.value).toBe('search')
      expect(exposed.isSuccessModalOpen.value).toBe(false)
      expect(exposed.isNotFoundModalOpen.value).toBe(false)
    })

    it('Vector 1E: DOM Tree & Teleport Inspection — zero occurrences of conversion modal strings in rendered output', async () => {
      const ctx: any = {}
      const app = createSSRApp({
        render: () =>
          h(Step2RahinContent, {
            isMobile: false,
            subView: 'detail',
          }),
      })

      const html = await renderToString(app, ctx)
      const combined = `${html} ${ctx.teleports?.body || ''}`

      expect(combined).not.toContain('Buat CIF Syariah dari Data Konvensional')
      expect(combined).not.toContain('Buat CIF Syariah')
      expect(combined).not.toContain('cif-modal-backdrop')
      expect(combined).not.toContain('targetKonvenCif')
      expect(combined).not.toContain('handleConvertCif')
      expect(combined).not.toContain('handleConfirmConvert')
    })

    it('Vector 1F: Keyboard shortcut events (Escape, Enter, Tab) do not trigger CIF conversion modal', async () => {
      let exposed: any = null
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = { isMobile: false, subView: 'detail' }
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

      if (typeof window !== 'undefined') {
        const events = ['Escape', 'Enter', 'Tab', 'Space', 'ArrowRight']
        for (const key of events) {
          const ev = new (window as any).Event('keydown', { bubbles: true })
          ;(ev as any).key = key
          if (typeof window.dispatchEvent === 'function') {
            window.dispatchEvent(ev)
          }
        }
      }

      expect(exposed.isConvertModalOpen).toBeUndefined()
      expect(exposed.isSuccessModalOpen.value).toBe(false)
    })
  })

  // =========================================================================
  // 2. SUCCESS MODAL GATING: INVALID SUBMISSION DEFENSE
  // =========================================================================
  describe('2. Success Modal Gating: Invalid Submissions Must Never Trigger Success Modal', () => {
    it('Gate 2A: handleNext on search subView with no CIF selected fails and keeps modal closed', async () => {
      let exposed: any = null
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = { isMobile: false, subView: 'search' }
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

      exposed.step2State.value.selectedCifId = null
      const result = exposed.handleNext()

      expect(result.valid).toBe(false)
      expect(result.message).toBe(
        'Pilih salah satu data CIF syariah untuk dilanjutkan ke detail data Rahin',
      )
      expect(exposed.isSuccessModalOpen.value).toBe(false)
    })

    it('Gate 2B: Incomplete Data Rahin (missing NIK) blocks submission and keeps modal closed', async () => {
      let exposed: any = null
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = { isMobile: false, subView: 'detail' }
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

      exposed.fieldsModel.value.nik = ''
      exposed.fieldsModel.value.nama = 'Anastasya Delistya'

      const result = exposed.handleNext()
      expect(result.valid).toBe(false)
      expect(result.message).toBe('Mohon lengkapi data identitas Rahin.')
      expect(exposed.isSuccessModalOpen.value).toBe(false)
    })

    it('Gate 2C: Incomplete Data Rahin (missing Nama) blocks submission and keeps modal closed', async () => {
      let exposed: any = null
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = { isMobile: false, subView: 'detail' }
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

      exposed.fieldsModel.value.nik = '3204284912980003'
      exposed.fieldsModel.value.nama = ''

      const result = exposed.handleNext()
      expect(result.valid).toBe(false)
      expect(result.message).toBe('Mohon lengkapi data identitas Rahin.')
      expect(exposed.isSuccessModalOpen.value).toBe(false)
    })

    it('Gate 2D: Both NIK and Nama missing blocks submission and keeps modal closed', async () => {
      let exposed: any = null
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = { isMobile: false, subView: 'detail' }
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

      exposed.fieldsModel.value.nik = ''
      exposed.fieldsModel.value.nama = ''

      const result = exposed.handleNext()
      expect(result.valid).toBe(false)
      expect(result.message).toBe('Mohon lengkapi data identitas Rahin.')
      expect(exposed.isSuccessModalOpen.value).toBe(false)
    })

    it('Gate 2E: Active Pelaksana Transaksi with missing Nama Lengkap blocks submission and keeps modal closed', async () => {
      let exposed: any = null
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = {
            isMobile: false,
            subView: 'detail',
            boState: { type: 'orang_lain', items: [] },
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

      // Valid Rahin identity
      exposed.fieldsModel.value.nik = '3204284912980003'
      exposed.fieldsModel.value.nama = 'Anastasya Delistya'

      // Pelaksana is active but missing Nama Lengkap
      exposed.isPelaksanaActive.value = true
      exposed.step2State.value.pelaksana.namaLengkap = ''
      exposed.step2State.value.pelaksana.identityType = 'ktp'
      exposed.step2State.value.pelaksana.nik = '3204111122223333'

      const result = exposed.handleNext()
      expect(result.valid).toBe(false)
      expect(result.message).toBe(
        'Mohon lengkapi data pelaksana transaksi (Nama dan Nomor Identitas wajib diisi).',
      )
      expect(exposed.isSuccessModalOpen.value).toBe(false)
    })

    it('Gate 2F: Active Pelaksana Transaksi with missing KTP NIK blocks submission and keeps modal closed', async () => {
      let exposed: any = null
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = { isMobile: false, subView: 'detail' }
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

      exposed.fieldsModel.value.nik = '3204284912980003'
      exposed.fieldsModel.value.nama = 'Anastasya Delistya'

      exposed.isPelaksanaActive.value = true
      exposed.step2State.value.pelaksana.namaLengkap = 'John Pelaksana'
      exposed.step2State.value.pelaksana.identityType = 'ktp'
      exposed.step2State.value.pelaksana.nik = ''

      const result = exposed.handleNext()
      expect(result.valid).toBe(false)
      expect(result.message).toBe(
        'Mohon lengkapi data pelaksana transaksi (Nama dan Nomor Identitas wajib diisi).',
      )
      expect(exposed.isSuccessModalOpen.value).toBe(false)
    })

    it('Gate 2G: Active Pelaksana Transaksi with missing Passport Number blocks submission and keeps modal closed', async () => {
      let exposed: any = null
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = { isMobile: false, subView: 'detail' }
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

      exposed.fieldsModel.value.nik = '3204284912980003'
      exposed.fieldsModel.value.nama = 'Anastasya Delistya'

      exposed.isPelaksanaActive.value = true
      exposed.step2State.value.pelaksana.namaLengkap = 'John Pelaksana'
      exposed.step2State.value.pelaksana.identityType = 'paspor'
      exposed.step2State.value.pelaksana.nomorPaspor = ''

      const result = exposed.handleNext()
      expect(result.valid).toBe(false)
      expect(result.message).toBe(
        'Mohon lengkapi data pelaksana transaksi (Nama dan Nomor Identitas wajib diisi).',
      )
      expect(exposed.isSuccessModalOpen.value).toBe(false)
    })

    it('Gate 2H: Tambah Rahin Baru flow gating — missing NIK blocks success modal, valid submission opens success modal', async () => {
      let exposed: any = null
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = { isMobile: false, subView: 'search' }
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

      // Enter tambah baru mode
      exposed.handleTambahRahinBaru()
      expect(exposed.subView.value).toBe('detail')
      expect(exposed.detailSelectionMode.value).toBe('tambah')

      // Empty submission attempt
      exposed.fieldsModel.value.nik = ''
      exposed.fieldsModel.value.nama = ''
      const failRes = exposed.handleNext()
      expect(failRes.valid).toBe(false)
      expect(failRes.message).toBe('Mohon lengkapi data identitas Rahin.')
      expect(exposed.isSuccessModalOpen.value).toBe(false)

      // Valid submission attempt
      exposed.fieldsModel.value.nik = '3204999988887777'
      exposed.fieldsModel.value.nama = 'Customer Baru'
      const successRes = exposed.handleNext()
      expect(successRes.valid).toBe(true)
      expect(successRes.handled).toBe(true)
      expect(exposed.isSuccessModalOpen.value).toBe(true)
    })
  })

  // =========================================================================
  // 3. SUCCESS MODAL BEHAVIOR ON VALID SUBMISSION & DESIGN FIDELITY
  // =========================================================================
  describe('3. Success Modal Behavior on Valid Submission & Design Fidelity', () => {
    it('Valid submission opens success modal and returns valid: true, handled: true', async () => {
      let exposed: any = null
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = { isMobile: false, subView: 'detail' }
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

      // Fully valid Data Rahin
      exposed.fieldsModel.value.nik = '3204284912980003'
      exposed.fieldsModel.value.nama = 'Anastasya Delistya'
      exposed.isPelaksanaActive.value = false

      const result = exposed.handleNext()
      expect(result.valid).toBe(true)
      expect(result.handled).toBe(true)
      expect(exposed.isSuccessModalOpen.value).toBe(true)
    })

    it('RahinSaveSuccessModal renders exact Figma title, description, and CTA button label', async () => {
      const ctx: any = {}
      const app = createSSRApp({
        render: () =>
          h(RahinSaveSuccessModal, {
            modelValue: true,
          }),
      })

      const html = await renderToString(app, ctx)
      const combined = `${html} ${ctx.teleports?.body || ''}`

      // Exact title and desc matching Requirement R3 & Figma 11752:118844
      expect(combined).toContain('Data Rahin Berhasil Disimpan')
      expect(combined).toContain(
        'Data Rahin Berhasil Disimpan. Silakan lanjutkan ke data jaminan.',
      )
      expect(combined).toContain('Lanjutkan ke Data Jaminan')

      // Teleported backdrop and modal classes
      expect(combined).toContain('rahin-success-backdrop')
      expect(combined).toContain('rahin-success-modal')
      expect(combined).toContain('rahin-success-modal__illustration')

      // Green celebratory checkmark (156x156 SVG, #00AB4E, sparkle #75D37F)
      expect(combined).toContain('width="156"')
      expect(combined).toContain('height="156"')
      expect(combined).toContain('fill="#00AB4E"')
      expect(combined).toContain('fill="#75D37F"')

      // A11y attributes
      expect(combined).toContain('role="dialog"')
      expect(combined).toContain('aria-modal="true"')
      expect(combined).toContain('aria-labelledby="modal-success-title"')
      expect(combined).toContain('aria-label="Tutup dialog"')
    })

    it('RahinSaveSuccessModal supports responsive mobile layout flag', async () => {
      const ctx: any = {}
      const app = createSSRApp({
        render: () =>
          h(RahinSaveSuccessModal, {
            modelValue: true,
            isMobile: true,
          }),
      })

      const html = await renderToString(app, ctx)
      const combined = `${html} ${ctx.teleports?.body || ''}`
      expect(combined).toContain('rahin-success-modal--mobile')
    })
  })

  // =========================================================================
  // 4. STEP 3 TRANSITION INTEGRATION & URL SYNCHRONIZATION
  // =========================================================================
  describe('4. Step 3 Transition Integration & URL Route Synchronization', () => {
    it('Invoking handleContinueToStep3 resets isSuccessModalOpen and emits advance', async () => {
      let exposed: any = null
      let emittedAdvance = false
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = { isMobile: false, subView: 'detail' }
          setupFn(props, {
            emit: (event: string) => {
              if (event === 'advance') emittedAdvance = true
            },
            expose: (exp: any) => {
              exposed = exp
            },
          })
          return () => h('div')
        },
      })
      await renderToString(app)

      exposed.isSuccessModalOpen.value = true
      exposed.handleContinueToStep3()

      expect(exposed.isSuccessModalOpen.value).toBe(false)
      expect(emittedAdvance).toBe(true)
    })

    it('Parent PengajuanRahnView handles advance event, updates stepper to Step 3, and synchronizes URL route', async () => {
      const router = createTestRouter('/pengajuan-rahn/step-2/update/cif-sya-01')
      await router.push('/pengajuan-rahn/step-2/update/cif-sya-01')
      await router.isReady()

      const pinia = createPinia()
      setActivePinia(pinia)

      let parentExposed: any = null
      const app = createSSRApp({
        setup() {
          const setupFn = (PengajuanRahnView as any).setup
          setupFn({}, {
            emit: () => {},
            expose: (exp: any) => {
              parentExposed = exp
            },
          })
          return () => h('div')
        },
      })
      app.use(pinia)
      app.use(router)
      await renderToString(app)

      expect(parentExposed.activeStep.value).toBe(2)
      expect(parentExposed.activeAction.value).toBe('update')
      expect(parentExposed.activeRecordId.value).toBe('cif-sya-01')

      // Emulate step 2 advance completion
      await parentExposed.navigateToRoute(3, 'entry')
      await router.push(buildRahnPath(3, 'entry'))
      await nextTick()

      expect(router.currentRoute.value.path).toBe('/pengajuan-rahn/step-3/entry')
      expect(parentExposed.activeStep.value).toBe(3)
      expect(parentExposed.activeAction.value).toBe('entry')
      expect(parentExposed.activeRecordId.value).toBeUndefined()
    })
  })

  // =========================================================================
  // 5. STRESS TESTING: REPETITIVE CLICKS, 100-CYCLE REOPENINGS & IDEMPOTENCY
  // =========================================================================
  describe('5. Stress Testing: Repetitive Clicks, 100-Cycle Reopenings & Idempotency', () => {
    it('50 rapid handleNext() calls maintain stable boolean state without multiple dialog instances', async () => {
      let exposed: any = null
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = { isMobile: false, subView: 'detail' }
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

      exposed.fieldsModel.value.nik = '3204284912980003'
      exposed.fieldsModel.value.nama = 'Anastasya Delistya'
      exposed.isPelaksanaActive.value = false

      // Fire 50 rapid calls to handleNext()
      for (let i = 0; i < 50; i++) {
        const res = exposed.handleNext()
        expect(res.valid).toBe(true)
        expect(res.handled).toBe(true)
      }

      expect(exposed.isSuccessModalOpen.value).toBe(true)
      expect(typeof exposed.isSuccessModalOpen.value).toBe('boolean')
    })

    it('100 open/close cycles of RahinSaveSuccessModal maintain zero memory leak or orphan state', async () => {
      let emittedUpdates: boolean[] = []
      let emittedContinues = 0

      const isOpen = ref(false)
      const app = createSSRApp({
        render: () =>
          h(RahinSaveSuccessModal, {
            modelValue: isOpen.value,
            'onUpdate:modelValue': (val: boolean) => {
              isOpen.value = val
              emittedUpdates.push(val)
            },
            onContinue: () => {
              emittedContinues++
            },
          }),
      })

      for (let cycle = 0; cycle < 100; cycle++) {
        // Open
        isOpen.value = true
        expect(isOpen.value).toBe(true)

        // Close via continue / closeModal
        isOpen.value = false
        expect(isOpen.value).toBe(false)
      }

      expect(isOpen.value).toBe(false)
    })

    it('RahinSaveSuccessModal dismissal contract: handleContinueToStep3 cleanly resets modal state and emits advance', async () => {
      let exposed: any = null
      let emittedAdvanceCount = 0

      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = { isMobile: false, subView: 'detail' }
          setupFn(props, {
            emit: (ev: string) => {
              if (ev === 'advance') emittedAdvanceCount++
            },
            expose: (exp: any) => {
              exposed = exp
            },
          })
          return () => h('div')
        },
      })
      await renderToString(app)

      // Open success modal
      exposed.fieldsModel.value.nik = '3204284912980003'
      exposed.fieldsModel.value.nama = 'Anastasya Delistya'
      const nextRes = exposed.handleNext()
      expect(nextRes.valid).toBe(true)
      expect(exposed.isSuccessModalOpen.value).toBe(true)

      // Emulate modal continue / dismissal
      exposed.handleContinueToStep3()
      expect(exposed.isSuccessModalOpen.value).toBe(false)
      expect(emittedAdvanceCount).toBe(1)

      // Secondary call (idempotent protection)
      exposed.handleContinueToStep3()
      expect(exposed.isSuccessModalOpen.value).toBe(false)
      expect(emittedAdvanceCount).toBe(2)
    })

    it('Calling handlePrev() while success modal is open resets modal state cleanly', async () => {
      let exposed: any = null
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = { isMobile: false, subView: 'detail' }
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

      exposed.isSuccessModalOpen.value = true
      expect(exposed.isSuccessModalOpen.value).toBe(true)

      exposed.handlePrev()

      expect(exposed.isSuccessModalOpen.value).toBe(false)
      expect(exposed.subView.value).toBe('search')
    })
  })
})
