/**
 * @file tests/rahnRouting.test.ts
 * @description Comprehensive unit tests for Pengajuan Rahn dynamic URL routing architecture:
 * 1. Step & action parameter parser unit tests (parseRahnStepParam, parseRahnActionParam).
 * 2. Route params parser (parseRahnRouteParams) edge cases and fallbacks.
 * 3. Canonical path builder (buildRahnPath) formatting.
 * 4. Step definitions constant (RAHN_STEP_DEFINITIONS).
 * 5. Vue Router memory history route resolution, aliases, parameters, and navigation guard.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { createRouter, createMemoryHistory, type RouteRecordRaw } from 'vue-router'
import {
  parseRahnStepParam,
  parseRahnActionParam,
  parseRahnRouteParams,
  buildRahnPath,
  RAHN_STEP_DEFINITIONS,
  type UsecaseAction,
} from '@/router/rahnRouting'
import { isAdminAuthenticated } from '@/services/authService'

// Mock localStorage for test environment
const storage = new Map<string, string>()
const localStorageMock = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, String(value)),
  removeItem: (key: string) => storage.delete(key),
  clear: () => storage.clear(),
}

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

describe('Rahn Routing Architecture (Requirement R2)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('parseRahnStepParam', () => {
    it('parses numeric string representations 1..5', () => {
      expect(parseRahnStepParam('1')).toBe(1)
      expect(parseRahnStepParam('2')).toBe(2)
      expect(parseRahnStepParam('3')).toBe(3)
      expect(parseRahnStepParam('4')).toBe(4)
      expect(parseRahnStepParam('5')).toBe(5)
    })

    it('parses numbers directly', () => {
      expect(parseRahnStepParam(1)).toBe(1)
      expect(parseRahnStepParam(2)).toBe(2)
      expect(parseRahnStepParam(3)).toBe(3)
      expect(parseRahnStepParam(4)).toBe(4)
      expect(parseRahnStepParam(5)).toBe(5)
    })

    it('parses prefix format step-1..step-5', () => {
      expect(parseRahnStepParam('step-1')).toBe(1)
      expect(parseRahnStepParam('step-2')).toBe(2)
      expect(parseRahnStepParam('step-3')).toBe(3)
      expect(parseRahnStepParam('step-4')).toBe(4)
      expect(parseRahnStepParam('step-5')).toBe(5)
    })

    it('parses semantic slugs to corresponding step numbers', () => {
      expect(parseRahnStepParam('data-pengajuan')).toBe(1)
      expect(parseRahnStepParam('data-rahin')).toBe(2)
      expect(parseRahnStepParam('data-jaminan')).toBe(3)
      expect(parseRahnStepParam('fasilitas-pinjaman')).toBe(4)
      expect(parseRahnStepParam('data-review')).toBe(5)
    })

    it('handles uppercase and surrounding whitespace gracefully', () => {
      expect(parseRahnStepParam('  STEP-2  ')).toBe(2)
      expect(parseRahnStepParam('DATA-RAHIN')).toBe(2)
      expect(parseRahnStepParam('  data-review ')).toBe(5)
      expect(parseRahnStepParam(' 3 ')).toBe(3)
    })

    it('falls back to 1 for undefined, null, or empty values', () => {
      expect(parseRahnStepParam(undefined)).toBe(1)
      expect(parseRahnStepParam(null)).toBe(1)
      expect(parseRahnStepParam('')).toBe(1)
      expect(parseRahnStepParam('   ')).toBe(1)
    })

    it('falls back to 1 for out-of-range or invalid strings and numbers', () => {
      expect(parseRahnStepParam('step-0')).toBe(1)
      expect(parseRahnStepParam('step-6')).toBe(1)
      expect(parseRahnStepParam('step-99')).toBe(1)
      expect(parseRahnStepParam('invalid-slug')).toBe(1)
      expect(parseRahnStepParam(0)).toBe(1)
      expect(parseRahnStepParam(6)).toBe(1)
      expect(parseRahnStepParam(99)).toBe(1)
      expect(parseRahnStepParam(-1)).toBe(1)
      expect(parseRahnStepParam(NaN)).toBe(1)
    })
  })

  describe('parseRahnActionParam', () => {
    it('recognizes all 4 valid use case actions', () => {
      expect(parseRahnActionParam('entry')).toBe('entry')
      expect(parseRahnActionParam('preview')).toBe('preview')
      expect(parseRahnActionParam('update')).toBe('update')
      expect(parseRahnActionParam('create')).toBe('create')
    })

    it('handles mixed case and surrounding whitespace', () => {
      expect(parseRahnActionParam(' PREVIEW ')).toBe('preview')
      expect(parseRahnActionParam('Update')).toBe('update')
      expect(parseRahnActionParam('  CREATE  ')).toBe('create')
      expect(parseRahnActionParam('ENTRY')).toBe('entry')
    })

    it('falls back to entry for missing or invalid action strings', () => {
      expect(parseRahnActionParam(undefined)).toBe('entry')
      expect(parseRahnActionParam(null)).toBe('entry')
      expect(parseRahnActionParam('')).toBe('entry')
      expect(parseRahnActionParam('edit')).toBe('entry')
      expect(parseRahnActionParam('delete')).toBe('entry')
      expect(parseRahnActionParam('unknown-action')).toBe('entry')
    })
  })

  describe('parseRahnRouteParams', () => {
    it('returns default state for empty or null route params', () => {
      expect(parseRahnRouteParams(undefined)).toEqual({
        stepNumber: 1,
        action: 'entry',
        id: undefined,
      })
      expect(parseRahnRouteParams(null)).toEqual({
        stepNumber: 1,
        action: 'entry',
        id: undefined,
      })
      expect(parseRahnRouteParams({})).toEqual({
        stepNumber: 1,
        action: 'entry',
        id: undefined,
      })
    })

    it('parses typical step, action, and record id correctly', () => {
      const result = parseRahnRouteParams({
        step: 'step-2',
        action: 'preview',
        id: 'cif-001',
      })
      expect(result).toEqual({
        stepNumber: 2,
        action: 'preview',
        id: 'cif-001',
      })
    })

    it('handles route param arrays (wildcard/repeat matches)', () => {
      const result = parseRahnRouteParams({
        step: ['step-3'],
        action: ['update'],
        id: ['rek-888'],
      })
      expect(result).toEqual({
        stepNumber: 3,
        action: 'update',
        id: 'rek-888',
      })
    })

    it('trims record id and converts empty string id to undefined', () => {
      expect(parseRahnRouteParams({ id: '  cif-002  ' })).toEqual({
        stepNumber: 1,
        action: 'entry',
        id: 'cif-002',
      })
      expect(parseRahnRouteParams({ id: '   ' })).toEqual({
        stepNumber: 1,
        action: 'entry',
        id: undefined,
      })
    })

    it('supports semantic slug steps with actions', () => {
      const result = parseRahnRouteParams({
        step: 'data-rahin',
        action: 'create',
      })
      expect(result).toEqual({
        stepNumber: 2,
        action: 'create',
        id: undefined,
      })
    })
  })

  describe('buildRahnPath', () => {
    it('defaults to step-1 entry when called without arguments', () => {
      expect(buildRahnPath()).toBe('/pengajuan-rahn/step-1/entry')
    })

    it('builds canonical entry paths for all 5 steps', () => {
      expect(buildRahnPath(1)).toBe('/pengajuan-rahn/step-1/entry')
      expect(buildRahnPath(2)).toBe('/pengajuan-rahn/step-2/entry')
      expect(buildRahnPath(3)).toBe('/pengajuan-rahn/step-3/entry')
      expect(buildRahnPath(4)).toBe('/pengajuan-rahn/step-4/entry')
      expect(buildRahnPath(5)).toBe('/pengajuan-rahn/step-5/entry')
    })

    it('accepts string step inputs (step-X or slugs)', () => {
      expect(buildRahnPath('step-2')).toBe('/pengajuan-rahn/step-2/entry')
      expect(buildRahnPath('data-rahin')).toBe('/pengajuan-rahn/step-2/entry')
      expect(buildRahnPath('data-review')).toBe('/pengajuan-rahn/step-5/entry')
    })

    it('builds paths with explicit actions', () => {
      expect(buildRahnPath(1, 'create')).toBe('/pengajuan-rahn/step-1/create')
      expect(buildRahnPath(2, 'preview', 'cif-001')).toBe('/pengajuan-rahn/step-2/preview/cif-001')
      expect(buildRahnPath(2, 'update', 'cif-001')).toBe('/pengajuan-rahn/step-2/update/cif-001')
    })

    it('encodes special characters in record ID safely', () => {
      const path = buildRahnPath(2, 'preview', 'cif 001/ext')
      expect(path).toBe('/pengajuan-rahn/step-2/preview/cif%20001%2Fext')
    })

    it('clamps numeric step values outside 1..5 range', () => {
      expect(buildRahnPath(0)).toBe('/pengajuan-rahn/step-1/entry')
      expect(buildRahnPath(99)).toBe('/pengajuan-rahn/step-5/entry')
      expect(buildRahnPath(-10)).toBe('/pengajuan-rahn/step-1/entry')
    })

    it('sanitizes invalid action string', () => {
      expect(buildRahnPath(2, 'invalid' as UsecaseAction)).toBe('/pengajuan-rahn/step-2/entry')
    })
  })

  describe('RAHN_STEP_DEFINITIONS', () => {
    it('defines metadata for all 5 workflow steps', () => {
      expect(RAHN_STEP_DEFINITIONS).toHaveLength(5)
      expect(RAHN_STEP_DEFINITIONS.map((s) => s.stepNumber)).toEqual([1, 2, 3, 4, 5])
      expect(RAHN_STEP_DEFINITIONS.map((s) => s.param)).toEqual([
        'step-1',
        'step-2',
        'step-3',
        'step-4',
        'step-5',
      ])
      expect(RAHN_STEP_DEFINITIONS.map((s) => s.slug)).toEqual([
        'data-pengajuan',
        'data-rahin',
        'data-jaminan',
        'fasilitas-pinjaman',
        'data-review',
      ])
    })
  })

  describe('Vue Router Integration & Navigation Resolution', () => {
    const dummyComponent = { template: '<div>View</div>' }

    const routes: RouteRecordRaw[] = [
      {
        path: '/',
        name: 'home',
        component: dummyComponent,
        alias: ['/entry', '/homescreen'],
        meta: { requiresAuth: true },
      },
      {
        path: '/login',
        name: 'admin-login',
        component: dummyComponent,
        alias: ['/dashboard/login'],
      },
      {
        path: '/pengajuan-rahn/:step?/:action?/:id?',
        name: 'pengajuan-rahn',
        component: dummyComponent,
        alias: [
          '/pengajuan/rahn/:step?/:action?/:id?',
          '/rahn/:step?/:action?/:id?',
        ],
        meta: { requiresAuth: true },
      },
      {
        path: '/:pathMatch(.*)*',
        redirect: '/',
      },
    ]

    function createTestRouter() {
      const router = createRouter({
        history: createMemoryHistory(),
        routes,
      })

      router.beforeEach((to, _from, next) => {
        if (to.meta.requiresAuth && !isAdminAuthenticated()) {
          next({ path: '/login', query: { redirect: to.fullPath } })
          return
        }
        next()
      })

      return router
    }

    it('redirects unauthenticated user to /login with redirect query', async () => {
      localStorage.setItem('kitvue_auth_state', 'false')
      const router = createTestRouter()

      await router.push('/pengajuan-rahn/step-2/preview/cif-001')
      expect(router.currentRoute.value.path).toBe('/login')
      expect(router.currentRoute.value.query.redirect).toBe('/pengajuan-rahn/step-2/preview/cif-001')
    })

    it('resolves base /pengajuan-rahn route successfully when authenticated', async () => {
      localStorage.setItem('kitvue_auth_state', 'true')
      const router = createTestRouter()

      await router.push('/pengajuan-rahn')
      expect(router.currentRoute.value.name).toBe('pengajuan-rahn')
      expect(router.currentRoute.value.path).toBe('/pengajuan-rahn')

      const parsed = parseRahnRouteParams(router.currentRoute.value.params)
      expect(parsed).toEqual({ stepNumber: 1, action: 'entry', id: undefined })
    })

    it('resolves step-scoped paths (/pengajuan-rahn/step-2)', async () => {
      localStorage.setItem('kitvue_auth_state', 'true')
      const router = createTestRouter()

      await router.push('/pengajuan-rahn/step-2')
      expect(router.currentRoute.value.name).toBe('pengajuan-rahn')
      expect(router.currentRoute.value.params.step).toBe('step-2')

      const parsed = parseRahnRouteParams(router.currentRoute.value.params)
      expect(parsed).toEqual({ stepNumber: 2, action: 'entry', id: undefined })
    })

    it('resolves step, action, and id subpaths (/pengajuan-rahn/step-2/preview/cif-001)', async () => {
      localStorage.setItem('kitvue_auth_state', 'true')
      const router = createTestRouter()

      await router.push('/pengajuan-rahn/step-2/preview/cif-001')
      expect(router.currentRoute.value.name).toBe('pengajuan-rahn')
      expect(router.currentRoute.value.params).toEqual({
        step: 'step-2',
        action: 'preview',
        id: 'cif-001',
      })

      const parsed = parseRahnRouteParams(router.currentRoute.value.params)
      expect(parsed).toEqual({ stepNumber: 2, action: 'preview', id: 'cif-001' })
    })

    it('resolves /pengajuan-rahn/step-1/create', async () => {
      localStorage.setItem('kitvue_auth_state', 'true')
      const router = createTestRouter()

      await router.push('/pengajuan-rahn/step-1/create')
      expect(router.currentRoute.value.name).toBe('pengajuan-rahn')
      const parsed = parseRahnRouteParams(router.currentRoute.value.params)
      expect(parsed).toEqual({ stepNumber: 1, action: 'create', id: undefined })
    })

    it('resolves /pengajuan/rahn alias paths identically', async () => {
      localStorage.setItem('kitvue_auth_state', 'true')
      const router = createTestRouter()

      await router.push('/pengajuan/rahn/step-3/update/asset-99')
      expect(router.currentRoute.value.name).toBe('pengajuan-rahn')
      expect(router.currentRoute.value.params).toEqual({
        step: 'step-3',
        action: 'update',
        id: 'asset-99',
      })

      const parsed = parseRahnRouteParams(router.currentRoute.value.params)
      expect(parsed).toEqual({ stepNumber: 3, action: 'update', id: 'asset-99' })
    })

    it('resolves /rahn alias paths identically', async () => {
      localStorage.setItem('kitvue_auth_state', 'true')
      const router = createTestRouter()

      await router.push('/rahn/step-2/create')
      expect(router.currentRoute.value.name).toBe('pengajuan-rahn')
      expect(router.currentRoute.value.params.step).toBe('step-2')
      expect(router.currentRoute.value.params.action).toBe('create')

      const parsed = parseRahnRouteParams(router.currentRoute.value.params)
      expect(parsed).toEqual({ stepNumber: 2, action: 'create', id: undefined })
    })

    it('resolves semantic slugs via route and parses correctly', async () => {
      localStorage.setItem('kitvue_auth_state', 'true')
      const router = createTestRouter()

      await router.push('/pengajuan-rahn/data-rahin/preview/cif-999')
      expect(router.currentRoute.value.name).toBe('pengajuan-rahn')
      const parsed = parseRahnRouteParams(router.currentRoute.value.params)
      expect(parsed).toEqual({ stepNumber: 2, action: 'preview', id: 'cif-999' })
    })

    it('redirects unknown route to home via fallback', async () => {
      localStorage.setItem('kitvue_auth_state', 'true')
      const router = createTestRouter()

      await router.push('/completely-unknown-path')
      expect(router.currentRoute.value.path).toBe('/')
      expect(router.currentRoute.value.name).toBe('home')
    })
  })
})
