/**
 * @file tests/usecaseTaxonomySync.test.ts
 * @description Comprehensive unit and integration test suite for Milestone M2:
 * 1. Record lookup helpers (findBeneficialOwnerById & findRahinCifById)
 * 2. Step 1 (Step1PengajuanContent) 4-state usecase taxonomy (entry, preview, update, create)
 * 3. Step 2 (Step2RahinContent) 4-state usecase taxonomy (entry, preview, update, create)
 * 4. PengajuanRahnView bidirectional route synchronization with loop prevention
 * 5. Router subpaths, aliases, and form field disabling verifications
 */

import { beforeAll, describe, expect, it } from 'vitest'
import { createSSRApp, h, nextTick, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'

// Polyfill window & localStorage for Node test environment
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

import PengajuanRahnView from '@/views/PengajuanRahnView.vue'
import Step1PengajuanContent from '@/components/modules/rahn/step-1/Step1PengajuanContent.vue'
import Step2RahinContent from '@/components/modules/rahn/step-2/Step2RahinContent.vue'
import {
  MOCK_BENEFICIAL_OWNERS,
  findBeneficialOwnerById,
} from '@/components/modules/rahn/mockBeneficialOwnerData'
import {
  MOCK_RAHIN_CIF_DATABASE,
  findRahinCifById,
} from '@/components/modules/rahn/mockRahinData'
import {
  buildRahnPath,
  parseRahnRouteParams,
  type UsecaseAction,
} from '@/router/rahnRouting'

// ==========================================
// TEST ROUTER FACTORY
// ==========================================
function createTestRouter(initialUrl = '/pengajuan-rahn') {
  const routes: RouteRecordRaw[] = [
    {
      path: '/',
      name: 'home',
      component: { template: '<div>Home</div>' },
      meta: { requiresAuth: true },
    },
    {
      path: '/pengajuan-rahn/:step?/:action?/:id?',
      name: 'pengajuan-rahn',
      component: PengajuanRahnView,
      alias: [
        '/pengajuan/rahn/:step?/:action?/:id?',
        '/rahn/:step?/:action?/:id?',
      ],
      meta: { requiresAuth: true },
    },
  ]

  const history = createMemoryHistory()
  const router = createRouter({
    history,
    routes,
  })

  return { router, history }
}

describe('Milestone M2: Usecase Taxonomy Standardization & Bidirectional Sync', () => {
  // ==========================================
  // 1. RECORD LOOKUP HELPERS
  // ==========================================
  describe('1. Record Lookup Helpers', () => {
    describe('findBeneficialOwnerById', () => {
      it('resolves beneficial owner by primary id', () => {
        const bo1 = findBeneficialOwnerById('bo-1')
        expect(bo1).toBeDefined()
        expect(bo1?.id).toBe('bo-1')
        expect(bo1?.name).toBe('Anastasya Delistya')

        const bo2 = findBeneficialOwnerById('bo-2')
        expect(bo2).toBeDefined()
        expect(bo2?.id).toBe('bo-2')

        const bo3 = findBeneficialOwnerById('bo-3')
        expect(bo3).toBeDefined()
        expect(bo3?.id).toBe('bo-3')
        expect(bo3?.name).toBe('Budi Santoso')
      })

      it('resolves beneficial owner by registrationNumber with or without spaces', () => {
        const boSpaced = findBeneficialOwnerById('1234 1234')
        expect(boSpaced).toBeDefined()
        expect(boSpaced?.id).toBe('bo-1')

        const boClean = findBeneficialOwnerById('12341234')
        expect(boClean).toBeDefined()
        expect(boClean?.id).toBe('bo-1')

        const bo2 = findBeneficialOwnerById('1234 2222')
        expect(bo2?.id).toBe('bo-2')
      })

      it('resolves beneficial owner by NIK', () => {
        const bo = findBeneficialOwnerById('3204 1111 1298 0003')
        expect(bo).toBeDefined()
        expect(bo?.nik).toBe('3204 1111 1298 0003')

        const boCleanNik = findBeneficialOwnerById('3204111112980003')
        expect(boCleanNik).toBeDefined()
        expect(boCleanNik?.id).toBe('bo-1')
      })

      it('resolves beneficial owner by pasporNumber', () => {
        const boPaspor = findBeneficialOwnerById('0033 9714 84')
        expect(boPaspor).toBeDefined()
        expect(boPaspor?.id).toBe('bo-1')

        const boPasporClean = findBeneficialOwnerById('0033971484')
        expect(boPasporClean).toBeDefined()
        expect(boPasporClean?.id).toBe('bo-1')
      })

      it('returns undefined for non-existent or empty identifiers', () => {
        expect(findBeneficialOwnerById(undefined)).toBeUndefined()
        expect(findBeneficialOwnerById('')).toBeUndefined()
        expect(findBeneficialOwnerById('   ')).toBeUndefined()
        expect(findBeneficialOwnerById('non-existent-id')).toBeUndefined()
      })
    })

    describe('findRahinCifById', () => {
      it('resolves CIF record by primary id', () => {
        const cif1 = findRahinCifById('cif-sya-01')
        expect(cif1).toBeDefined()
        expect(cif1?.id).toBe('cif-sya-01')
        expect(cif1?.namaRahin).toBe('Anastasya Delistya')
        expect(cif1?.statusRahin).toBe('syariah')

        const cifKonven = findRahinCifById('cif-kon-01')
        expect(cifKonven).toBeDefined()
        expect(cifKonven?.id).toBe('cif-kon-01')
        expect(cifKonven?.statusRahin).toBe('konvensional')
      })

      it('resolves CIF record by nomorCif with or without spaces', () => {
        const cifSpaced = findRahinCifById('1234 1234 01')
        expect(cifSpaced).toBeDefined()
        expect(cifSpaced?.nomorCif).toBe('1234 1234 01')

        const cifClean = findRahinCifById('1234123401')
        expect(cifClean).toBeDefined()
        expect(cifClean?.nomorCif).toBe('1234 1234 01')
      })

      it('resolves CIF record by rawIdentitas (NIK or passport)', () => {
        const cifByIdentitas = findRahinCifById('3204111112980003')
        expect(cifByIdentitas).toBeDefined()
        expect(cifByIdentitas?.rawIdentitas).toBe('3204111112980003')

        const cifSpacedIdentitas = findRahinCifById('3204 1111 1298 0003')
        expect(cifSpacedIdentitas).toBeDefined()
      })

      it('returns undefined for non-existent or empty identifiers', () => {
        expect(findRahinCifById(undefined)).toBeUndefined()
        expect(findRahinCifById('')).toBeUndefined()
        expect(findRahinCifById('   ')).toBeUndefined()
        expect(findRahinCifById('cif-999999')).toBeUndefined()
      })
    })
  })

  // ==========================================
  // 2. STEP 1: USECASE TAXONOMY STANDARDIZATION
  // ==========================================
  describe('2. Step 1 (Step1PengajuanContent) Usecase Taxonomy', () => {
    async function renderStep1(props: {
      action?: UsecaseAction
      recordId?: string
      subView?: 'search' | 'detail' | 'tambah'
      selectedBO?: any
    } = {}) {
      const emitted: Array<{ event: string; args: any[] }> = []
      const subView = ref(props.subView || 'search')
      const targetBO = props.selectedBO ?? (props.recordId ? findBeneficialOwnerById(props.recordId) : null)
      const fields = ref({
        tujuanPengajuan: 'Investasi Emas',
        tujuanTransaksi: 'Modal Usaha',
        pekerjaanTerkini: 'Pegawai Swasta',
        rubrikMarhun: 'Emas Batangan',
        skemaTarif: 'Reguler',
        produk: 'Rahn',
        jangkaWaktu: '120 Hari',
      })
      const boState = ref({
        type: props.recordId ? 'orang_lain' : '',
        tipeRahin: 'perorangan',
        identityType: 'ktp',
        identityNumber: targetBO?.nik || '',
        relationship: 'Keluarga',
        selectedBO: targetBO,
        document: null,
        isAlamatSesuaiKtp: false,
      })

      const app = createSSRApp({
        render: () =>
          h(Step1PengajuanContent, {
            isMobile: false,
            action: props.action,
            recordId: props.recordId,
            subView: subView.value,
            'onUpdate:subView': (val: any) => {
              subView.value = val
            },
            'onUpdate:action': (act: any, id?: any) => {
              emitted.push({ event: 'update:action', args: [act, id] })
            },
            fields: fields.value,
            boState: boState.value,
            validationAlert: null,
          }),
      })

      const html = await renderToString(app)
      return { html, emitted, subView, boState, fields }
    }

    it('Step 1 entry mode: activates subView search and allows searching', async () => {
      const { html } = await renderStep1({ action: 'entry', subView: 'search' })
      expect(html).toContain('Informasi Rahn')
      expect(html).toContain('Beneficial Owner')
      expect(html).toContain('Tujuan Pengajuan')
    })

    it('Step 1 preview mode: activates subView detail, isDetailReadOnly is true and inputs are disabled', async () => {
      const { html } = await renderStep1({ action: 'preview', recordId: 'bo-1', subView: 'detail' })
      expect(html).toContain('Data Beneficial Owner')
      expect(html).toContain('Anastasya Delistya')
      // Preview mode form fields must be non-editable (disabled)
      expect(html).toContain('disabled')
    })

    it('Step 1 update mode: activates subView detail with editable inputs', async () => {
      const { html } = await renderStep1({ action: 'update', recordId: 'bo-1', subView: 'detail' })
      expect(html).toContain('Data Beneficial Owner')
      expect(html).toContain('Anastasya Delistya')
    })

    it('Step 1 create mode: activates subView tambah, presenting editable new entry form', async () => {
      const { html } = await renderStep1({ action: 'create', subView: 'tambah' })
      expect(html).toContain('bo-detail-sections-container')
      expect(html).toContain('Cek Dukcapil')
    })
  })

  // ==========================================
  // 3. STEP 2: USECASE TAXONOMY STANDARDIZATION
  // ==========================================
  describe('3. Step 2 (Step2RahinContent) Usecase Taxonomy', () => {
    function setupStep2(props: { action?: UsecaseAction; recordId?: string; subView?: 'search' | 'detail' } = {}) {
      let exposed: any = null
      const emitted: Array<{ event: string; args: any[] }> = []

      const app = createSSRApp({
        setup() {
          const setupFn = (Step2RahinContent as any).setup
          const compProps = {
            isMobile: false,
            action: props.action,
            recordId: props.recordId,
            subView: props.subView || 'search',
          }
          setupFn(compProps, {
            emit: (event: string, ...args: any[]) => emitted.push({ event, args }),
            expose: (exp: any) => {
              exposed = exp
            },
          })
          return () => h('div')
        },
      })

      return { app, getExposed: () => exposed, emitted }
    }

    it('Step 2 entry mode: activates subView search with search and portfolio tables', async () => {
      const { app, getExposed } = setupStep2({ action: 'entry' })
      await renderToString(app)
      const exp = getExposed()
      expect(exp.subView.value).toBe('search')
      expect(exp.step2State.value.currentView).toBe('search')
    })

    it('Step 2 preview mode: activates detail with detailSelectionMode terpilih (full disabled)', async () => {
      const { app, getExposed } = setupStep2({ action: 'preview', recordId: 'cif-sya-01' })
      await renderToString(app)
      const exp = getExposed()
      expect(exp.subView.value).toBe('detail')
      expect(exp.detailSelectionMode.value).toBe('terpilih')
      expect(exp.fieldsModel.value.cif).toBe('1234 1234 01')
      expect(exp.fieldsModel.value.nama).toBe('Anastasya Delistya')
    })

    it('Step 2 update mode: activates detail with detailSelectionMode pilih (editable sections 4 & 5)', async () => {
      const { app, getExposed } = setupStep2({ action: 'update', recordId: 'cif-sya-01' })
      await renderToString(app)
      const exp = getExposed()
      expect(exp.subView.value).toBe('detail')
      expect(exp.detailSelectionMode.value).toBe('pilih')
      expect(exp.fieldsModel.value.cif).toBe('1234 1234 01')
      // In update mode, domicile and financial fields are editable
      expect(exp.fieldsModel.value.isAlamatDomisiliSama).toBe(false)
    })

    it('Step 2 create mode: activates detail with detailSelectionMode tambah (blank editable fields)', async () => {
      const { app, getExposed } = setupStep2({ action: 'create' })
      await renderToString(app)
      const exp = getExposed()
      expect(exp.subView.value).toBe('detail')
      expect(exp.detailSelectionMode.value).toBe('tambah')
      expect(exp.fieldsModel.value.nama).toBe('')
      expect(exp.fieldsModel.value.alamat).toBe('')
      expect(exp.fieldsModel.value.cif).toBe('')
    })

    it('Step 2 handleSelectCif in terpilih mode emits update:action preview with CIF ID', async () => {
      const { app, getExposed, emitted } = setupStep2({ action: 'entry' })
      await renderToString(app)
      const exp = getExposed()

      const targetCif = MOCK_RAHIN_CIF_DATABASE[0]
      exp.handleSelectCif(targetCif, 'terpilih')

      expect(exp.subView.value).toBe('detail')
      expect(exp.detailSelectionMode.value).toBe('terpilih')
      const actionEmit = emitted.find(
        (e) => e.event === 'update:action' && e.args[0] === 'preview' && e.args[1] === targetCif.id,
      )
      expect(actionEmit).toBeDefined()
    })

    it('Step 2 handleSelectCif in pilih mode emits update:action update with CIF ID', async () => {
      const { app, getExposed, emitted } = setupStep2({ action: 'entry' })
      await renderToString(app)
      const exp = getExposed()

      const targetCif = MOCK_RAHIN_CIF_DATABASE[0]
      exp.handleSelectCif(targetCif, 'pilih')

      expect(exp.subView.value).toBe('detail')
      expect(exp.detailSelectionMode.value).toBe('pilih')
      const actionEmit = emitted.find(
        (e) => e.event === 'update:action' && e.args[0] === 'update' && e.args[1] === targetCif.id,
      )
      expect(actionEmit).toBeDefined()
    })

    it('Step 2 handleTambahRahinBaru emits update:action create', async () => {
      const { app, getExposed, emitted } = setupStep2({ action: 'entry' })
      await renderToString(app)
      const exp = getExposed()

      exp.handleTambahRahinBaru()
      expect(exp.subView.value).toBe('detail')
      expect(exp.detailSelectionMode.value).toBe('tambah')
      const actionEmit = emitted.find((e) => e.event === 'update:action' && e.args[0] === 'create')
      expect(actionEmit).toBeDefined()
    })

    it('Step 2 handlePrev from detail resets to search and emits update:action entry', async () => {
      const { app, getExposed, emitted } = setupStep2({ action: 'preview', recordId: 'cif-sya-01' })
      await renderToString(app)
      const exp = getExposed()
      expect(exp.subView.value).toBe('detail')

      const exitHandled = exp.handlePrev()
      expect(exitHandled).toBe(false)
      expect(exp.subView.value).toBe('search')
      const entryEmit = emitted.find((e) => e.event === 'update:action' && e.args[0] === 'entry')
      expect(entryEmit).toBeDefined()
    })
  })

  // ==========================================
  // 4. PARENT VIEW ORCHESTRATION & BIDIRECTIONAL SYNC
  // ==========================================
  describe('4. PengajuanRahnView Bidirectional Routing Synchronization', () => {
    function setupParentApp(router: any) {
      const pinia = createPinia()
      setActivePinia(pinia)
      const app = createSSRApp({
        render: () => h(PengajuanRahnView),
      })
      app.use(pinia)
      app.use(router)
      return app
    }

    it('navigating to base /pengajuan-rahn defaults to Step 1 in entry mode without errors', async () => {
      const { router } = createTestRouter('/pengajuan-rahn')
      await router.push('/pengajuan-rahn')
      await router.isReady()

      const app = setupParentApp(router)
      const html = await renderToString(app)
      expect(html).toContain('Pengajuan Rahn')
      expect(html).toContain('Informasi Rahn')
      expect(html).toContain('Beneficial Owner')
    })

    it('navigating to /pengajuan-rahn/step-1/preview/bo-1 activates Step 1 in preview mode with record populated', async () => {
      const { router } = createTestRouter()
      await router.push('/pengajuan-rahn/step-1/preview/bo-1')
      await router.isReady()

      const app = setupParentApp(router)
      const html = await renderToString(app)
      expect(html).toContain('Pengajuan Rahn')
      expect(html).toContain('Data Beneficial Owner')
      expect(html).toContain('Anastasya Delistya')
    })

    it('navigating to /pengajuan-rahn/step-1/create renders empty new beneficial owner form', async () => {
      const { router } = createTestRouter()
      await router.push('/pengajuan-rahn/step-1/create')
      await router.isReady()

      const app = setupParentApp(router)
      const html = await renderToString(app)
      expect(html).toContain('Pengajuan Rahn')
      expect(html).toContain('Cek Dukcapil')
    })

    it('navigating to /pengajuan-rahn/step-2/entry renders Step 2 search view', async () => {
      const { router } = createTestRouter()
      await router.push('/pengajuan-rahn/step-2/entry')
      await router.isReady()

      const app = setupParentApp(router)
      const html = await renderToString(app)
      expect(html).toContain('Informasi Rahin')
      expect(html).toContain('Pilih jenis identitas')
    })

    it('navigating to /pengajuan-rahn/step-2/preview/cif-sya-01 renders read-only detail view', async () => {
      const { router } = createTestRouter()
      await router.push('/pengajuan-rahn/step-2/preview/cif-sya-01')
      await router.isReady()

      const app = setupParentApp(router)
      const html = await renderToString(app)
      expect(html).toContain('Detail Data Rahin')
      expect(html).toContain('Anastasya Delistya')
    })

    it('navigating to /pengajuan-rahn/step-2/update/cif-sya-01 renders editable detail view', async () => {
      const { router } = createTestRouter()
      await router.push('/pengajuan-rahn/step-2/update/cif-sya-01')
      await router.isReady()

      const app = setupParentApp(router)
      const html = await renderToString(app)
      expect(html).toContain('Detail Data Rahin')
    })

    it('navigating to /pengajuan-rahn/step-2/create renders empty tambah rahin form', async () => {
      const { router } = createTestRouter()
      await router.push('/pengajuan-rahn/step-2/create')
      await router.isReady()

      const app = setupParentApp(router)
      const html = await renderToString(app)
      expect(html).toContain('Detail Data Rahin')
    })

    it('backward-compatible route aliases (/pengajuan/rahn and /rahn) render Step 1 without errors', async () => {
      const { router } = createTestRouter()
      await router.push('/pengajuan/rahn')
      await router.isReady()

      const app1 = setupParentApp(router)
      const html1 = await renderToString(app1)
      expect(html1).toContain('Pengajuan Rahn')

      await router.push('/rahn/step-2/entry')
      await router.isReady()
      const app2 = setupParentApp(router)
      const html2 = await renderToString(app2)
      expect(html2).toContain('Informasi Rahin')
    })

    it('stepper navigation functions update route URL path bidirectionally without infinite loops', async () => {
      const { router } = createTestRouter()
      await router.push('/pengajuan-rahn')
      await router.isReady()

      const pinia = createPinia()
      setActivePinia(pinia)

      let exposed: any = null
      const app = createSSRApp({
        setup() {
          const setupFn = (PengajuanRahnView as any).setup
          setupFn({}, {
            emit: () => {},
            expose: (exp: any) => {
              exposed = exp
            },
          })
          return () => h('div')
        },
      })
      app.use(pinia)
      app.use(router)
      await renderToString(app)

      expect(exposed).toBeDefined()
      expect(exposed.activeStep.value).toBe(1)
      expect(exposed.activeAction.value).toBe('entry')

      // Trigger outbound navigation to Step 2
      await exposed.navigateToRoute(2, 'entry')
      expect(router.currentRoute.value.path).toBe('/pengajuan-rahn/step-2/entry')

      // Trigger outbound navigation to Step 2 preview
      await exposed.navigateToRoute(2, 'preview', 'cif-sya-01')
      expect(router.currentRoute.value.path).toBe('/pengajuan-rahn/step-2/preview/cif-sya-01')

      // Inbound route update
      await router.push('/pengajuan-rahn/step-1/create')
      await nextTick()
      expect(exposed.activeStep.value).toBe(1)
      expect(exposed.activeAction.value).toBe('create')
      expect(exposed.step1SubView.value).toBe('tambah')

      // Next / Prev step methods update route path
      await exposed.nextStep()
      expect(router.currentRoute.value.path).toMatch(/\/pengajuan-rahn\/step-[12]/)
    })
  })
})
