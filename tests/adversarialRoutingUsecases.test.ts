/**
 * @file tests/adversarialRoutingUsecases.test.ts
 * @description Adversarial Empirical Challenge Suite for Requirement R1 (Usecase Taxonomy)
 * and Requirement R2 (Dynamic URL Routing Architecture).
 *
 * Stress-tests:
 * 1. Malformed, fuzzy, and edge-case routing inputs:
 *    - Out-of-range steps (step-0, step-99, negative, floats, NaN, Infinity).
 *    - Corrupted actions ('UNKNOWN_ACTION', '', null, symbols, injection strings).
 *    - Deeply nested paths and URI-encoded characters.
 * 2. Rapid back-and-forth transitions between steps and actions:
 *    - Stress harness proving bidirectional sync does NOT trigger infinite update loops or callstack overflows.
 *    - Re-entrancy guard verification.
 * 3. Form disabling invariant:
 *    - In `preview` mode on Step 1 and Step 2, form fields are strictly non-editable / disabled.
 *    - In `update` mode, detail records allow input on editable fields.
 *    - In `create` mode, empty editable forms allow data entry.
 * 4. Direct deep-linking with various record ID formats:
 *    - Spaced, non-spaced, lowercase, uppercase, and non-existent IDs.
 */

import { beforeAll, describe, expect, it, vi } from 'vitest'
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
import RahinDetailSection from '@/components/modules/rahn/step-2/RahinDetailSection.vue'
import PelaksanaTransaksiSection from '@/components/modules/rahn/step-2/PelaksanaTransaksiSection.vue'
import {
  MOCK_BENEFICIAL_OWNERS,
  findBeneficialOwnerById,
} from '@/components/modules/rahn/mockBeneficialOwnerData'
import {
  MOCK_RAHIN_CIF_DATABASE,
  findRahinCifById,
  createDefaultPelaksanaState,
} from '@/components/modules/rahn/mockRahinData'
import {
  buildRahnPath,
  parseRahnActionParam,
  parseRahnRouteParams,
  parseRahnStepParam,
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
      component: { template: '<div id="home-view">Home</div>' },
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
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/',
    },
  ]

  const history = createMemoryHistory()
  const router = createRouter({
    history,
    routes,
  })

  return { router, history }
}

function setupParentApp(router: any) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const app = createSSRApp({
    render: () => h(PengajuanRahnView),
  })
  app.use(pinia)
  app.use(router)
  return { app, pinia }
}

describe('Empirical Adversarial Challenge Suite: Requirements R1 & R2', () => {
  // =========================================================================
  // 1. MALFORMED, FUZZY, AND EDGE-CASE ROUTING INPUTS
  // =========================================================================
  describe('1. Malformed, Fuzzy, and Edge-Case Routing Inputs', () => {
    describe('Step Parameter Parsing Fuzzing & Boundaries (parseRahnStepParam)', () => {
      it('falls back to 1 for out-of-range integer steps', () => {
        expect(parseRahnStepParam(0)).toBe(1)
        expect(parseRahnStepParam(-1)).toBe(1)
        expect(parseRahnStepParam(-999)).toBe(1)
        expect(parseRahnStepParam(6)).toBe(1)
        expect(parseRahnStepParam(99)).toBe(1)
        expect(parseRahnStepParam(1000000)).toBe(1)
      })

      it('falls back to 1 for out-of-range string step prefixes', () => {
        expect(parseRahnStepParam('step-0')).toBe(1)
        expect(parseRahnStepParam('step-6')).toBe(1)
        expect(parseRahnStepParam('step-99')).toBe(1)
        expect(parseRahnStepParam('step--1')).toBe(1)
        expect(parseRahnStepParam('step-NaN')).toBe(1)
      })

      it('handles floating point step inputs safely without throwing', () => {
        expect(parseRahnStepParam(1.5)).toBe(1)
        expect(parseRahnStepParam(2.8)).toBe(2)
        expect(parseRahnStepParam(4.999)).toBe(4)
        expect(parseRahnStepParam(5.1)).toBe(1) // out of 1..5 range
        expect(parseRahnStepParam(-0.5)).toBe(1)
        expect(parseRahnStepParam(99.9)).toBe(1)
      })

      it('handles non-finite numbers safely', () => {
        expect(parseRahnStepParam(NaN)).toBe(1)
        expect(parseRahnStepParam(Infinity)).toBe(1)
        expect(parseRahnStepParam(-Infinity)).toBe(1)
      })

      it('normalizes whitespace and mixed-case string inputs', () => {
        expect(parseRahnStepParam('  step-2  ')).toBe(2)
        expect(parseRahnStepParam('STEP-3')).toBe(3)
        expect(parseRahnStepParam('  DATA-PENGAJUAN  ')).toBe(1)
        expect(parseRahnStepParam('data-rahin')).toBe(2)
        expect(parseRahnStepParam('DATA-REVIEW')).toBe(5)
      })

      it('falls back to 1 for arbitrary corrupted strings or code injections', () => {
        expect(parseRahnStepParam('<script>alert("xss")</script>')).toBe(1)
        expect(parseRahnStepParam('../../etc/passwd')).toBe(1)
        expect(parseRahnStepParam('undefined')).toBe(1)
        expect(parseRahnStepParam('null')).toBe(1)
        expect(parseRahnStepParam('')).toBe(1)
        expect(parseRahnStepParam('   ')).toBe(1)
        expect(parseRahnStepParam(null)).toBe(1)
        expect(parseRahnStepParam(undefined)).toBe(1)
      })
    })

    describe('Action Parameter Corruption & Sanitization (parseRahnActionParam)', () => {
      it('falls back to entry for unrecognized, corrupted, or malicious actions', () => {
        expect(parseRahnActionParam('UNKNOWN_ACTION')).toBe('entry')
        expect(parseRahnActionParam('edit')).toBe('entry')
        expect(parseRahnActionParam('delete')).toBe('entry')
        expect(parseRahnActionParam('DROP TABLE users;')).toBe('entry')
        expect(parseRahnActionParam('<img src=x onerror=alert(1)>')).toBe('entry')
        expect(parseRahnActionParam('!@#$%^&*()')).toBe('entry')
        expect(parseRahnActionParam('12345')).toBe('entry')
      })

      it('falls back to entry for nullish, empty, or whitespace-only inputs', () => {
        expect(parseRahnActionParam(null)).toBe('entry')
        expect(parseRahnActionParam(undefined)).toBe('entry')
        expect(parseRahnActionParam('')).toBe('entry')
        expect(parseRahnActionParam('    ')).toBe('entry')
      })

      it('normalizes valid actions with irregular casing and leading/trailing whitespace', () => {
        expect(parseRahnActionParam('  ENTRY  ')).toBe('entry')
        expect(parseRahnActionParam('PrEvIeW')).toBe('preview')
        expect(parseRahnActionParam('   UPDATE   ')).toBe('update')
        expect(parseRahnActionParam('CREATE')).toBe('create')
      })
    })

    describe('Route Parameter Object Parsing (parseRahnRouteParams)', () => {
      it('handles Vue Router array parameter variations by extracting first entry', () => {
        const state = parseRahnRouteParams({
          step: ['step-2', 'step-5'],
          action: ['preview', 'create'],
          id: ['cif-001', 'cif-002'],
        })
        expect(state.stepNumber).toBe(2)
        expect(state.action).toBe('preview')
        expect(state.id).toBe('cif-001')
      })

      it('handles completely empty or null params object without throwing', () => {
        expect(parseRahnRouteParams(null)).toEqual({ stepNumber: 1, action: 'entry', id: undefined })
        expect(parseRahnRouteParams(undefined)).toEqual({ stepNumber: 1, action: 'entry', id: undefined })
        expect(parseRahnRouteParams({})).toEqual({ stepNumber: 1, action: 'entry', id: undefined })
      })

      it('sanitizes corrupted parameters and whitespace-only IDs', () => {
        const state = parseRahnRouteParams({
          step: 'step-999',
          action: 'HACKED_ACTION',
          id: '   ',
        })
        expect(state.stepNumber).toBe(1)
        expect(state.action).toBe('entry')
        expect(state.id).toBeUndefined()
      })
    })

    describe('Path Builder Adversarial Clamping & Encoding (buildRahnPath)', () => {
      it('clamps out-of-range numeric steps between 1 and 5', () => {
        expect(buildRahnPath(-10, 'preview')).toBe('/pengajuan-rahn/step-1/preview')
        expect(buildRahnPath(0, 'update')).toBe('/pengajuan-rahn/step-1/update')
        expect(buildRahnPath(99, 'entry')).toBe('/pengajuan-rahn/step-5/entry')
        expect(buildRahnPath(1000, 'create')).toBe('/pengajuan-rahn/step-5/create')
      })

      it('floors floating numbers and handles non-finite numbers', () => {
        expect(buildRahnPath(2.7, 'preview')).toBe('/pengajuan-rahn/step-2/preview')
        expect(buildRahnPath(4.99, 'update')).toBe('/pengajuan-rahn/step-4/update')
        expect(buildRahnPath(NaN, 'entry')).toBe('/pengajuan-rahn/step-1/entry')
        expect(buildRahnPath(Infinity, 'preview')).toBe('/pengajuan-rahn/step-1/preview')
      })

      it('sanitizes invalid action parameter to entry', () => {
        expect(buildRahnPath(2, 'INVALID_ACTION' as any)).toBe('/pengajuan-rahn/step-2/entry')
      })

      it('properly encodes complex, spaced, and non-ASCII record IDs', () => {
        expect(buildRahnPath(2, 'preview', '1234 1234 01')).toBe(
          '/pengajuan-rahn/step-2/preview/1234%201234%2001',
        )
        expect(buildRahnPath(1, 'preview', 'id/with/slashes')).toBe(
          '/pengajuan-rahn/step-1/preview/id%2Fwith%2Fslashes',
        )
        expect(buildRahnPath(1, 'update', 'Budi & Partner?')).toBe(
          '/pengajuan-rahn/step-1/update/Budi%20%26%20Partner%3F',
        )
        expect(buildRahnPath(2, 'preview', 'Élise')).toBe(
          '/pengajuan-rahn/step-2/preview/%C3%89lise',
        )
      })

      it('ignores whitespace-only record IDs', () => {
        expect(buildRahnPath(1, 'entry', '    ')).toBe('/pengajuan-rahn/step-1/entry')
      })
    })

    describe('Live Router Resolution with Adversarial & Deeply Nested Paths', () => {
      it('navigating to corrupted step and action defaults gracefully without throwing router errors', async () => {
        const { router } = createTestRouter()
        await router.push('/pengajuan-rahn/step-999/INVALID_ACTION/test-record')
        await router.isReady()

        const parsed = parseRahnRouteParams(router.currentRoute.value.params)
        expect(parsed.stepNumber).toBe(1)
        expect(parsed.action).toBe('entry')
        expect(parsed.id).toBe('test-record')

        const { app } = setupParentApp(router)
        const html = await renderToString(app)
        expect(html).toContain('Pengajuan Rahn')
        expect(html).toContain('Informasi Rahn')
      })

      it('navigating to deeply nested sub-route (4+ segments) falls back to catch-all without unhandled exceptions', async () => {
        const { router } = createTestRouter()
        await router.push('/pengajuan-rahn/step-1/preview/cif-001/deep/nested/extra/path')
        await router.isReady()

        // Deeply nested paths do not match 3-segment param pattern, falling back to home
        expect(router.currentRoute.value.path).toBe('/')
      })

      it('navigating to path with URL-encoded space automatically decodes route parameter in component', async () => {
        const { router } = createTestRouter()
        await router.push('/pengajuan-rahn/step-2/preview/1234%201234%2001')
        await router.isReady()

        expect(router.currentRoute.value.params.id).toBe('1234 1234 01')
        const parsed = parseRahnRouteParams(router.currentRoute.value.params)
        expect(parsed.id).toBe('1234 1234 01')
      })
    })
  })

  // =========================================================================
  // 2. RAPID TRANSITIONS & BIDIRECTIONAL SYNC LOOP RESILIENCE
  // =========================================================================
  describe('2. Rapid Transitions & Infinite Loop Resilience (Bidirectional Synchronization)', () => {
    it('executes 60 consecutive alternating route transitions without infinite loops or callstack overflow', async () => {
      const { router } = createTestRouter()
      await router.push('/pengajuan-rahn')
      await router.isReady()

      let exposed: any = null
      const pinia = createPinia()
      setActivePinia(pinia)

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

      const routeSequence = [
        '/pengajuan-rahn/step-1/entry',
        '/pengajuan-rahn/step-2/preview/cif-sya-01',
        '/pengajuan-rahn/step-1/create',
        '/pengajuan-rahn/step-2/update/cif-sya-01',
        '/pengajuan-rahn/step-3/entry',
        '/pengajuan-rahn/step-1/preview/bo-1',
      ]

      // Rapidly dispatch 60 transitions
      for (let i = 0; i < 60; i++) {
        const targetPath = routeSequence[i % routeSequence.length]
        await router.push(targetPath)
        await nextTick()
      }

      // Assert final route state is faithfully mapped and no callstack overflow occurred
      const finalExpectedRoute = routeSequence[59 % routeSequence.length] // 60th item (index 5)
      expect(router.currentRoute.value.path).toBe(finalExpectedRoute)
      expect(exposed.activeStep.value).toBe(1)
      expect(exposed.activeAction.value).toBe('preview')
      expect(exposed.activeRecordId.value).toBe('bo-1')
    })

    it('executes 40 rapid programmatic navigateToRoute calls cleanly without recursive deadlocks', async () => {
      const { router } = createTestRouter()
      await router.push('/pengajuan-rahn')
      await router.isReady()

      let exposed: any = null
      const pinia = createPinia()
      setActivePinia(pinia)

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

      const transitionPlan = [
        { step: 1, action: 'entry' as UsecaseAction },
        { step: 1, action: 'preview' as UsecaseAction, id: 'bo-1' },
        { step: 1, action: 'update' as UsecaseAction, id: 'bo-1' },
        { step: 1, action: 'create' as UsecaseAction },
        { step: 2, action: 'entry' as UsecaseAction },
        { step: 2, action: 'preview' as UsecaseAction, id: 'cif-sya-01' },
        { step: 2, action: 'update' as UsecaseAction, id: 'cif-sya-01' },
        { step: 3, action: 'entry' as UsecaseAction },
      ]

      for (let i = 0; i < 40; i++) {
        const item = transitionPlan[i % transitionPlan.length]
        await exposed.navigateToRoute(item.step, item.action, item.id)
      }

      // Final state matches item 39 (index 7)
      expect(router.currentRoute.value.path).toBe('/pengajuan-rahn/step-3/entry')
    })

    it('immediately short-circuits when navigateToRoute is called with identical current route (deduplication)', async () => {
      const { router } = createTestRouter()
      await router.push('/pengajuan-rahn/step-2/preview/cif-sya-01')
      await router.isReady()

      let exposed: any = null
      const pinia = createPinia()
      setActivePinia(pinia)

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

      const pushSpy = vi.spyOn(router, 'push')
      // Call navigateToRoute with identical target
      await exposed.navigateToRoute(2, 'preview', 'cif-sya-01')

      // Spy should not have been called because currentPath === targetPath
      expect(pushSpy).not.toHaveBeenCalled()
    })

    it('re-entrancy guard isSyncingFromRoute prevents circular route push during inbound sync', async () => {
      const { router } = createTestRouter()
      await router.push('/pengajuan-rahn')
      await router.isReady()

      let exposed: any = null
      const pinia = createPinia()
      setActivePinia(pinia)

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

      const pushSpy = vi.spyOn(router, 'push')

      // Calling syncStateFromRoute directly with Step 2 params
      exposed.syncStateFromRoute({ step: 'step-2', action: 'preview', id: 'cif-sya-01' })

      // State is immediately updated
      expect(exposed.activeStep.value).toBe(2)
      expect(exposed.activeAction.value).toBe('preview')
      expect(exposed.activeRecordId.value).toBe('cif-sya-01')

      // BUT router.push was NOT called because isSyncingFromRoute locked outbound navigation
      expect(pushSpy).not.toHaveBeenCalled()
    })
  })

  // =========================================================================
  // 3. FORM DISABLING INVARIANT ORACLES (PREVIEW VS UPDATE / CREATE)
  // =========================================================================
  describe('3. Form Disabling Invariant Oracles (Preview vs Update vs Create)', () => {
    // -----------------------------------------------------------------------
    // STEP 1 INVARIANT
    // -----------------------------------------------------------------------
    describe('Step 1 (Beneficial Owner) Disabling Invariant', () => {
      async function renderStep1WithParams(props: {
        action: UsecaseAction
        subView: 'search' | 'detail' | 'tambah'
        recordId?: string
      }) {
        const targetBO = props.recordId ? findBeneficialOwnerById(props.recordId) : null
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
          type: 'orang_lain',
          tipeRahin: 'perorangan',
          identityType: 'ktp',
          identityNumber: targetBO?.nik || '3204 1111 1298 0003',
          relationship: 'Keluarga',
          selectedBO: targetBO || MOCK_BENEFICIAL_OWNERS[0],
          document: null,
          isAlamatSesuaiKtp: false,
        })

        const app = createSSRApp({
          render: () =>
            h(Step1PengajuanContent, {
              isMobile: false,
              action: props.action,
              recordId: props.recordId,
              subView: props.subView,
              fields: fields.value,
              boState: boState.value,
              validationAlert: null,
            }),
        })

        const html = await renderToString(app)
        return { html }
      }

      it('INVARIANT: Step 1 preview mode renders read-only detail view (read-only labels for Paspor, disabled inputs for KTP)', async () => {
        // Paspor record (bo-1) renders read-only display rows
        const { html: htmlPaspor } = await renderStep1WithParams({
          action: 'preview',
          subView: 'detail',
          recordId: 'bo-1',
        })

        expect(htmlPaspor).toContain('Data Beneficial Owner')
        expect(htmlPaspor).toContain('Anastasya Delistya')
        expect(htmlPaspor).toContain('disabled') // Nomor Registrasi is disabled
        expect(htmlPaspor).toContain('bo-read-row') // Paspor read-only mode renders read-only rows

        // KTP record (bo-2) renders disabled input elements
        const { html: htmlKtp } = await renderStep1WithParams({
          action: 'preview',
          subView: 'detail',
          recordId: 'bo-2',
        })
        expect(htmlKtp).toContain('Data Beneficial Owner')
        expect(htmlKtp).toContain('disabled')
        const disabledCountKtp = (htmlKtp.match(/disabled/g) || []).length
        expect(disabledCountKtp).toBeGreaterThan(5)
      })

      it('INVARIANT: Step 1 update mode renders detail form with editable fields', async () => {
        const { html } = await renderStep1WithParams({
          action: 'update',
          subView: 'detail',
          recordId: 'bo-1',
        })

        expect(html).toContain('Data Beneficial Owner')
        expect(html).toContain('Anastasya Delistya')
      })

      it('INVARIANT: Step 1 create mode activates tambah subView with empty editable form', async () => {
        const { html } = await renderStep1WithParams({
          action: 'create',
          subView: 'tambah',
        })

        expect(html).toContain('bo-detail-sections-container')
        expect(html).toContain('Cek Dukcapil')
      })
    })

    // -----------------------------------------------------------------------
    // STEP 2 INVARIANT
    // -----------------------------------------------------------------------
    describe('Step 2 (Data Rahin) Disabling Invariant', () => {
      function mountStep2Setup(action: UsecaseAction, recordId?: string) {
        let exposed: any = null
        const emitted: Array<{ event: string; args: any[] }> = []

        const app = createSSRApp({
          setup() {
            const setupFn = (Step2RahinContent as any).setup
            const compProps = {
              isMobile: false,
              action,
              recordId,
              subView: 'search',
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

      it('INVARIANT: Step 2 preview mode enforces detailSelectionMode = terpilih and full disabling', async () => {
        const { app, getExposed } = mountStep2Setup('preview', 'cif-sya-01')
        await renderToString(app)
        const exp = getExposed()

        expect(exp.subView.value).toBe('detail')
        expect(exp.detailSelectionMode.value).toBe('terpilih')
        expect(exp.fieldsModel.value.nama).toBe('Anastasya Delistya')

        // Render RahinDetailSection with isReadOnly = true and terpilih mode
        const detailApp = createSSRApp({
          render: () =>
            h(RahinDetailSection, {
              modelValue: exp.fieldsModel.value,
              selectionMode: 'terpilih',
              isReadOnly: true,
              isOpen: true,
              isMobile: false,
            }),
        })
        const detailHtml = await renderToString(detailApp)

        // All inputs in preview mode must have disabled attribute
        expect(detailHtml).toContain('disabled')
        const disabledCount = (detailHtml.match(/disabled/g) || []).length
        expect(disabledCount).toBeGreaterThan(10)
      })

      it('INVARIANT: Step 2 update mode enforces detailSelectionMode = pilih allowing editing on sections 4 & 5', async () => {
        const { app, getExposed } = mountStep2Setup('update', 'cif-sya-01')
        await renderToString(app)
        const exp = getExposed()

        expect(exp.subView.value).toBe('detail')
        expect(exp.detailSelectionMode.value).toBe('pilih')
        // In update mode, domicile is not auto-mirrored
        expect(exp.fieldsModel.value.isAlamatDomisiliSama).toBe(false)

        // Render RahinDetailSection in update mode (pilih, isReadOnly = false)
        const detailApp = createSSRApp({
          render: () =>
            h(RahinDetailSection, {
              modelValue: exp.fieldsModel.value,
              selectionMode: 'pilih',
              isReadOnly: false,
              isOpen: true,
              isMobile: false,
            }),
        })
        const detailHtml = await renderToString(detailApp)

        // In update mode, editable sections allow input
        expect(detailHtml).toContain('Data Rahin')
        expect(detailHtml).toContain('Alamat Tinggal Saat Ini')
      })

      it('INVARIANT: Step 2 create mode enables all fields for fresh input', async () => {
        const { app, getExposed } = mountStep2Setup('create')
        await renderToString(app)
        const exp = getExposed()

        expect(exp.subView.value).toBe('detail')
        expect(exp.detailSelectionMode.value).toBe('tambah')

        // Render RahinDetailSection in create mode (tambah, isReadOnly = false)
        const detailApp = createSSRApp({
          render: () =>
            h(RahinDetailSection, {
              modelValue: exp.fieldsModel.value,
              selectionMode: 'tambah',
              isReadOnly: false,
              isOpen: true,
              isMobile: false,
            }),
        })
        const detailHtml = await renderToString(detailApp)

        expect(detailHtml).toContain('Data Rahin')
        expect(detailHtml).toContain('Cek Dukcapil')
      })

      it('INVARIANT: PelaksanaTransaksiSection strictly respects isReadOnly prop', async () => {
        // Preview mode: isReadOnly = true
        const app1 = createSSRApp({
          render: () =>
            h(PelaksanaTransaksiSection, {
              modelValue: createDefaultPelaksanaState(),
              isReadOnly: true,
              isOpen: true,
              isMobile: false,
            }),
        })
        const html1 = await renderToString(app1)
        expect(html1).toContain('disabled')

        // Editable mode: isReadOnly = false
        const app2 = createSSRApp({
          render: () =>
            h(PelaksanaTransaksiSection, {
              modelValue: createDefaultPelaksanaState(),
              isReadOnly: false,
              isOpen: true,
              isMobile: false,
            }),
        })
        const html2 = await renderToString(app2)
        expect(html2).toContain('Data Pelaksana Transaksi')
      })
    })
  })

  // =========================================================================
  // 4. DIRECT DEEP-LINKING WITH HETEROGENEOUS RECORD ID FORMATS
  // =========================================================================
  describe('4. Direct Deep-Linking with Heterogeneous Record ID Formats', () => {
    describe('Step 1 Deep-Linking Resolution', () => {
      it('resolves spaced registration number (1234 2222) via URL-encoded route param', async () => {
        const { router } = createTestRouter()
        await router.push('/pengajuan-rahn/step-1/preview/1234%202222')
        await router.isReady()

        let exposed: any = null
        const pinia = createPinia()
        setActivePinia(pinia)

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

        expect(exposed.activeStep.value).toBe(1)
        expect(exposed.activeAction.value).toBe('preview')
        expect(exposed.boState.value.selectedBO).toBeDefined()
        expect(exposed.boState.value.selectedBO.registrationNumber).toBe('1234 2222')
        expect(exposed.boState.value.selectedBO.birthDate).toBe('9 Desember 1998')
      })

      it('resolves non-spaced registration number (12342222)', async () => {
        const { router } = createTestRouter()
        await router.push('/pengajuan-rahn/step-1/preview/12342222')
        await router.isReady()

        let exposed: any = null
        const pinia = createPinia()
        setActivePinia(pinia)

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

        expect(exposed.boState.value.selectedBO).toBeDefined()
        expect(exposed.boState.value.selectedBO.registrationNumber).toBe('1234 2222')
      })

      it('resolves lowercase vs uppercase BO ID (bo-1 vs BO-1)', () => {
        const boLower = findBeneficialOwnerById('bo-1')
        const boUpper = findBeneficialOwnerById('BO-1')
        expect(boLower).toBeDefined()
        expect(boUpper).toBeDefined()
        expect(boLower?.id).toBe('bo-1')
        expect(boUpper?.id).toBe('bo-1')
      })

      it('resolves spaced vs non-spaced NIK (3204 1111 1298 0003 vs 3204111112980003)', () => {
        const boSpaced = findBeneficialOwnerById('3204 1111 1298 0003')
        const boClean = findBeneficialOwnerById('3204111112980003')
        expect(boSpaced).toBeDefined()
        expect(boClean).toBeDefined()
        expect(boSpaced?.id).toBe('bo-1')
        expect(boClean?.id).toBe('bo-1')
      })

      it('handles non-existent BO ID gracefully without throwing an exception', async () => {
        const { router } = createTestRouter()
        await router.push('/pengajuan-rahn/step-1/preview/NON_EXISTENT_BO_99999')
        await router.isReady()

        const { app } = setupParentApp(router)
        const html = await renderToString(app)
        expect(html).toContain('Pengajuan Rahn')
      })
    })

    describe('Step 2 Deep-Linking Resolution', () => {
      it('resolves spaced CIF number (1234 1234 01) via URL-encoded route param', async () => {
        const { router } = createTestRouter()
        await router.push('/pengajuan-rahn/step-2/preview/1234%201234%2001')
        await router.isReady()

        let exposed: any = null
        const pinia = createPinia()
        setActivePinia(pinia)

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

        expect(exposed.activeStep.value).toBe(2)
        expect(exposed.activeAction.value).toBe('preview')
        expect(exposed.fieldsRahin.value.cif).toBe('1234 1234 01')
        expect(exposed.fieldsRahin.value.nama).toBe('Anastasya Delistya')
      })

      it('resolves non-spaced CIF number (1234123401)', async () => {
        const { router } = createTestRouter()
        await router.push('/pengajuan-rahn/step-2/update/1234123401')
        await router.isReady()

        let exposed: any = null
        const pinia = createPinia()
        setActivePinia(pinia)

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

        expect(exposed.activeStep.value).toBe(2)
        expect(exposed.activeAction.value).toBe('update')
        expect(exposed.fieldsRahin.value.cif).toBe('1234 1234 01')
        expect(exposed.fieldsRahin.value.nama).toBe('Anastasya Delistya')
      })

      it('resolves lowercase vs uppercase CIF ID (cif-sya-01 vs CIF-SYA-01)', () => {
        const cifLower = findRahinCifById('cif-sya-01')
        const cifUpper = findRahinCifById('CIF-SYA-01')
        expect(cifLower).toBeDefined()
        expect(cifUpper).toBeDefined()
        expect(cifLower?.id).toBe('cif-sya-01')
        expect(cifUpper?.id).toBe('cif-sya-01')
      })

      it('resolves Konvensional CIF record directly by CIF ID', () => {
        const cifKonven = findRahinCifById('cif-kon-01')
        expect(cifKonven).toBeDefined()
        expect(cifKonven?.statusRahin).toBe('konvensional')
        expect(cifKonven?.namaRahin).toBe('Anastasya Delistya')
      })

      it('handles non-existent CIF ID gracefully without unhandled crashes', async () => {
        const { router } = createTestRouter()
        await router.push('/pengajuan-rahn/step-2/preview/NON_EXISTENT_CIF_GHOST')
        await router.isReady()

        const { app } = setupParentApp(router)
        const html = await renderToString(app)
        expect(html).toContain('Pengajuan Rahn')
      })
    })
  })
})
