/**
 * @file tests/modalToPageFlow.test.ts
 * @description Unit tests verifying that confirmation and alert dialogs remain as popup modals (with backdrop),
 * while 'Data Beneficial Owner' (Step 1) and 'Data Rahin' (Step 2) row selections navigate to page detail (subView === 'detail').
 * Also validates the Step 2 progressive disclosure flow matching Figma 1:1.
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { createSSRApp, h, ref } from 'vue'
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
import Step1PengajuanContent from '@/components/modules/rahn/step-1/Step1PengajuanContent.vue'
import RahinSaveSuccessModal from '@/components/modules/rahn/step-2/modals/RahinSaveSuccessModal.vue'
import RahinNotFoundModal from '@/components/modules/rahn/step-2/modals/RahinNotFoundModal.vue'
import BeneficialOwnerNotFoundModal from '@/components/modules/rahn/step-1/modals/BeneficialOwnerNotFoundModal.vue'
import BeneficialOwnerSaveSuccessModal from '@/components/modules/rahn/step-1/modals/BeneficialOwnerSaveSuccessModal.vue'
import BeneficialOwnerSaveConfirmModal from '@/components/modules/rahn/step-1/modals/BeneficialOwnerSaveConfirmModal.vue'
import { MOCK_RAHIN_CIF_DATABASE } from '@/components/modules/rahn/mockRahinData'

describe('Modal Dialog Popups & Page Detail Navigation (Step 1 & Step 2)', () => {
  // ==========================================
  // 1. MODAL POPUPS VERIFICATION
  // ==========================================
  describe('1. Confirmation & Alert Popups are Pure Modals with Teleport', () => {
    it('RahinSaveSuccessModal renders modal popup structure with backdrop overlay', async () => {
      const ctx: any = {}
      const app = createSSRApp({
        render: () =>
          h(RahinSaveSuccessModal, {
            modelValue: true,
          }),
      })

      const html = await renderToString(app, ctx)
      const combined = `${html} ${ctx.teleports?.body || ''}`
      expect(combined).toContain('rahin-success-backdrop')
      expect(combined).toContain('rahin-success-modal')
      expect(combined).toContain('Data Rahin Berhasil Disimpan')
      expect(combined).toContain('Data Rahin Berhasil Disimpan. Silakan lanjutkan ke data jaminan.')
      expect(combined).toContain('Lanjutkan ke Data Jaminan')
      expect(combined).not.toContain('Buat CIF Syariah')
    })

    it('RahinNotFoundModal renders modal popup structure with warning triangle & CTA matching Image 3', async () => {
      const ctx: any = {}
      const app = createSSRApp({
        render: () =>
          h(RahinNotFoundModal, {
            queryIdentity: '3204 9999 9999 9999',
            identityType: 'ktp',
            modelValue: true,
          }),
      })

      const html = await renderToString(app, ctx)
      const combined = `${html} ${ctx.teleports?.body || ''}`
      expect(combined).toContain('not-found-modal-backdrop')
      expect(combined).toContain('not-found-modal')
      expect(combined).toContain('Data Rahin Tidak Ditemukan')
      expect(combined).toContain('Lanjutkan ke Tambah Rahin')
    })

    it('BeneficialOwnerNotFoundModal renders modal popup structure with backdrop overlay', async () => {
      const ctx: any = {}
      const app = createSSRApp({
        render: () =>
          h(BeneficialOwnerNotFoundModal, {
            modelValue: true,
          }),
      })

      const html = await renderToString(app, ctx)
      const combined = `${html} ${ctx.teleports?.body || ''}`
      expect(combined).toContain('bo-not-found-backdrop')
      expect(combined).toContain('Data Beneficial Owner Tidak Ditemukan')
      expect(combined).toContain('Lanjutkan ke Tambah Beneficial Owner')
    })

    it('BeneficialOwnerSaveConfirmModal renders modal popup structure with backdrop overlay', async () => {
      const ctx: any = {}
      const app = createSSRApp({
        render: () =>
          h(BeneficialOwnerSaveConfirmModal, {
            modelValue: true,
          }),
      })

      const html = await renderToString(app, ctx)
      const combined = `${html} ${ctx.teleports?.body || ''}`
      expect(combined).toContain('bo-save-confirm-backdrop')
      expect(combined).toContain('Konfirmasi')
      expect(combined).toContain('Data akan tersimpan, pastikan sudah benar dan sesuai.')
      expect(combined).toContain('Lanjutkan')
      expect(combined).toContain('Kembali')
    })

    it('BeneficialOwnerSaveSuccessModal renders modal popup structure with backdrop overlay', async () => {
      const ctx: any = {}
      const app = createSSRApp({
        render: () =>
          h(BeneficialOwnerSaveSuccessModal, {
            modelValue: true,
            title: 'Data Beneficial Owner Berhasil Disimpan.',
            desc: 'Silakan lanjutkan ke proses pengajuan.',
          }),
      })

      const html = await renderToString(app, ctx)
      const combined = `${html} ${ctx.teleports?.body || ''}`
      expect(combined).toContain('bo-success-backdrop')
      expect(combined).toContain('Data Beneficial Owner Berhasil Disimpan.')
      expect(combined).toContain('Lanjutkan ke Data Rahin')
    })
  })

  // ==========================================
  // 2. STEP 2: PROGRESSIVE DISCLOSURE & DETAIL FLOW
  // ==========================================
  describe('2. Step 2: Progressive Disclosure & Detail Page Navigation', () => {
    it('initial default state displays only Informasi Rahin with empty unselected dropdowns', async () => {
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
      expect(exposed.subView.value).toBe('search')
      expect(exposed.step2State.value.search.tipeRahin).toBe('')
      expect(exposed.step2State.value.search.jenisIdentitas).toBe('')
      expect(exposed.step2State.value.search.nomorIdentitas).toBe('')
      expect(exposed.step2State.value.selectedCifId).toBeNull()
      expect(exposed.step2State.value.cifList.length).toBe(0)
      expect(exposed.step2State.value.portfolioList.length).toBe(0)
    })

    it('searching an unregistered identity triggers RahinNotFoundModal popup while staying in search subView', async () => {
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

      // Search non-existent NIK
      exposed.step2State.value.search.tipeRahin = 'perorangan'
      exposed.step2State.value.search.jenisIdentitas = 'ktp'
      exposed.step2State.value.search.nomorIdentitas = '3204 0000 0000 0000'
      exposed.handleSearch()

      expect(exposed.step2State.value.cifList.length).toBe(0)
      expect(exposed.subView.value).toBe('search') // Stays on search page
      expect(exposed.isNotFoundModalOpen.value).toBe(true) // Modal popup opens
    })

    it('selecting a found CIF row navigates to page detail, and advancing with valid fields opens success modal and emits advance on continue', async () => {
      let exposed: any = null
      let emittedAdvance = false
      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const props = {
            isMobile: false,
            subView: 'search',
          }
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

      // Search Anastasya Delistya
      exposed.step2State.value.search.tipeRahin = 'perorangan'
      exposed.step2State.value.search.jenisIdentitas = 'ktp'
      exposed.step2State.value.search.nomorIdentitas = '3204 2849 1298 0003'
      exposed.handleSearch()

      expect(exposed.step2State.value.cifList.length).toBeGreaterThan(0)

      // Select row 1 (Konvensional)
      const konvenRow = exposed.step2State.value.cifList.find((c: any) => c.statusRahin === 'konvensional')
      expect(konvenRow).toBeDefined()
      exposed.handleSelectCif(konvenRow)

      // Navigated to page detail
      expect(exposed.subView.value).toBe('detail')
      expect(exposed.isSuccessModalOpen.value).toBe(false)
      expect((exposed as any).isConvertModalOpen).toBeUndefined()

      // Advancing from detail with valid fields triggers success modal (conversion modal absent)
      const nextResult = exposed.handleNext()
      expect(nextResult.valid).toBe(true)
      expect(nextResult.handled).toBe(true)
      expect(exposed.isSuccessModalOpen.value).toBe(true)
      expect(exposed.subView.value).toBe('detail') // Stays on detail page view

      // Continuing from success modal closes modal and emits advance to step 3
      exposed.handleContinueToStep3()
      expect(exposed.isSuccessModalOpen.value).toBe(false)
      expect(emittedAdvance).toBe(true)
    })

    it('Step2RahinContent does not render CIF conversion modal in DOM', async () => {
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
      expect(combined).not.toContain('cif-modal-backdrop')
    })
  })
})
