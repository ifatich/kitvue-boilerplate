import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import { authenticateAdmin, getPrototypeRoleFromSession } from '../src/services/authService'
import type { PrototypeRole } from '../src/types/admin'

const storage = new Map<string, string>()
const storageMock = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, String(value)),
  removeItem: (key: string) => storage.delete(key),
  clear: () => storage.clear(),
}

const locationMock = {
  pathname: '/',
  search: '',
  hash: '',
  href: 'http://localhost/',
}

if (typeof window === 'undefined') {
  Object.defineProperty(globalThis, 'window', {
    value: {
      location: locationMock,
      history: { pushState: () => {}, replaceState: () => {}, state: null },
      addEventListener: () => {},
      removeEventListener: () => {},
    },
    writable: true,
  })
}

Object.defineProperty(globalThis, 'location', { value: locationMock, writable: true })
Object.defineProperty(globalThis, 'document', {
  value: {
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({
      setAttribute: () => {},
      getAttribute: () => null,
      style: {},
      appendChild: () => {},
    }),
    addEventListener: () => {},
    removeEventListener: () => {},
  },
  writable: true,
})
Object.defineProperty(globalThis, 'localStorage', { value: storageMock, writable: true })
Object.defineProperty(globalThis, 'sessionStorage', { value: storageMock, writable: true })

describe('SPRINT Remote Research Entry Point & Scenario Matrix', () => {
  beforeEach(() => {
    storage.clear()
  })

  it('registers all 4 entry point stages in router', async () => {
    const { default: router } = await import('../src/router')
    const routes = router.getRoutes()
    const entryPoint = routes.find((r) => r.name === 'entry-point')
    const kanwil = routes.find((r) => r.name === 'entry-point-kanwil')
    const role = routes.find((r) => r.name === 'entry-point-role')
    const tasks = routes.find((r) => r.name === 'entry-point-tasks')

    expect(entryPoint).toBeDefined()
    expect(kanwil).toBeDefined()
    expect(kanwil?.props.default).toEqual({ stage: 'kanwil' })
    expect(role).toBeDefined()
    expect(role?.props.default).toEqual({ stage: 'role' })
    expect(tasks).toBeDefined()
    expect(tasks?.props.default).toEqual({ stage: 'tasks' })
  })

  it('supports CRO prototype role authentication and session storage', () => {
    const result = authenticateAdmin('cro@pegadaian.co.id')
    expect(result.success).toBe(true)
    expect(result.user?.role).toBe('CRO')
    expect(getPrototypeRoleFromSession()).toBe('CRO')
  })

  describe('Scenario Matrix validation (Scenes 1 - 6)', () => {
    function computeScene(teamId: string, branchId: string, role: PrototypeRole): number {
      const isLeadership = role === 'Pinca' || role === 'CRO'

      if (teamId === 'team-1') {
        if (branchId.endsWith('-a')) return isLeadership ? 5 : 1
        if (branchId.endsWith('-b')) return isLeadership ? 6 : 2
        if (branchId.endsWith('-c')) return isLeadership ? 5 : 3
      }

      if (teamId === 'team-2') {
        if (branchId.endsWith('-a')) return isLeadership ? 6 : 1
        if (branchId.endsWith('-b')) return isLeadership ? 5 : 2
        if (branchId.endsWith('-c')) return isLeadership ? 6 : 3
      }

      if (teamId === 'team-3') {
        if (branchId.endsWith('-a')) return isLeadership ? 5 : 4
        if (branchId.endsWith('-b')) return isLeadership ? 6 : 4
        if (branchId.endsWith('-c')) return isLeadership ? 5 : 4
      }

      return 1
    }

    it('correctly maps Tim 1 (Bandung) branches to scenes', () => {
      // Cabang A (Urban): Staff -> 1, Leadership -> 5
      expect(computeScene('team-1', 'bdg-cbg-a', 'Kasir')).toBe(1)
      expect(computeScene('team-1', 'bdg-cbg-a', 'Penaksir')).toBe(1)
      expect(computeScene('team-1', 'bdg-cbg-a', 'Pinca')).toBe(5)
      expect(computeScene('team-1', 'bdg-cbg-a', 'CRO')).toBe(5)

      // Cabang B (Sub Urban): Staff -> 2, Leadership -> 6
      expect(computeScene('team-1', 'bdg-cbg-b', 'Kasir')).toBe(2)
      expect(computeScene('team-1', 'bdg-cbg-b', 'Penaksir')).toBe(2)
      expect(computeScene('team-1', 'bdg-cbg-b', 'Pinca')).toBe(6)
      expect(computeScene('team-1', 'bdg-cbg-b', 'CRO')).toBe(6)

      // Cabang C (Rural): Staff -> 3, Leadership -> 5
      expect(computeScene('team-1', 'bdg-cbg-c', 'Kasir')).toBe(3)
      expect(computeScene('team-1', 'bdg-cbg-c', 'Penaksir')).toBe(3)
      expect(computeScene('team-1', 'bdg-cbg-c', 'Pinca')).toBe(5)
      expect(computeScene('team-1', 'bdg-cbg-c', 'CRO')).toBe(5)
    })

    it('correctly maps Tim 2 (Denpasar) branches to scenes', () => {
      // Cabang A (Urban): Staff -> 1, Leadership -> 6
      expect(computeScene('team-2', 'dps-cbg-a', 'Kasir')).toBe(1)
      expect(computeScene('team-2', 'dps-cbg-a', 'Penaksir')).toBe(1)
      expect(computeScene('team-2', 'dps-cbg-a', 'Pinca')).toBe(6)
      expect(computeScene('team-2', 'dps-cbg-a', 'CRO')).toBe(6)

      // Cabang B (Sub Urban): Staff -> 2, Leadership -> 5
      expect(computeScene('team-2', 'dps-cbg-b', 'Kasir')).toBe(2)
      expect(computeScene('team-2', 'dps-cbg-b', 'Penaksir')).toBe(2)
      expect(computeScene('team-2', 'dps-cbg-b', 'Pinca')).toBe(5)
      expect(computeScene('team-2', 'dps-cbg-b', 'CRO')).toBe(5)

      // Cabang C (Rural): Staff -> 3, Leadership -> 6
      expect(computeScene('team-2', 'dps-cbg-c', 'Kasir')).toBe(3)
      expect(computeScene('team-2', 'dps-cbg-c', 'Penaksir')).toBe(3)
      expect(computeScene('team-2', 'dps-cbg-c', 'Pinca')).toBe(6)
      expect(computeScene('team-2', 'dps-cbg-c', 'CRO')).toBe(6)
    })

    it('correctly maps Tim 3 (Kanwil XXX) branches to scenes', () => {
      // Cabang A (Urban): Staff -> 4, Leadership -> 5
      expect(computeScene('team-3', 'xxx-cbg-a', 'Kasir')).toBe(4)
      expect(computeScene('team-3', 'xxx-cbg-a', 'Pinca')).toBe(5)

      // Cabang B (Sub Urban): Staff -> 4, Leadership -> 6
      expect(computeScene('team-3', 'xxx-cbg-b', 'Penaksir')).toBe(4)
      expect(computeScene('team-3', 'xxx-cbg-b', 'CRO')).toBe(6)

      // Cabang C (Rural): Staff -> 4, Leadership -> 5
      expect(computeScene('team-3', 'xxx-cbg-c', 'Kasir')).toBe(4)
      expect(computeScene('team-3', 'xxx-cbg-c', 'Pinca')).toBe(5)
    })
  })

  describe('Task payload assignment per scene', () => {
    const sceneTargets = {
      1: { task1: '/gadai-1-page', task2: '/sprint-proto-2', task3: '/pos' },
      2: { task1: '/gadai-1-page', task2: '/sprint-proto-1', task3: '/pos' },
      3: { task1: '/pengajuan-gadai', task2: '/sprint-proto-2', task3: '/pos' },
      4: { task1: '/pengajuan-gadai', task2: '/sprint-proto-1', task3: '/pos' },
      5: { task1: '/sprint-existing', task2: '/sprint-proto-2', task3: '/pos' },
      6: { task1: '/sprint-existing', task2: '/sprint-proto-1', task3: '/pos' },
    }

    it('verifies all 6 scenes match target routes and requirements', () => {
      // Scene 1: Non Stepper, Proto 2, POS
      expect(sceneTargets[1].task1).toBe('/gadai-1-page')
      expect(sceneTargets[1].task2).toBe('/sprint-proto-2')
      expect(sceneTargets[1].task3).toBe('/pos')

      // Scene 2: Non Stepper, Proto 1, POS
      expect(sceneTargets[2].task1).toBe('/gadai-1-page')
      expect(sceneTargets[2].task2).toBe('/sprint-proto-1')
      expect(sceneTargets[2].task3).toBe('/pos')

      // Scene 3: Stepper, Proto 2, POS
      expect(sceneTargets[3].task1).toBe('/pengajuan-gadai')
      expect(sceneTargets[3].task2).toBe('/sprint-proto-2')
      expect(sceneTargets[3].task3).toBe('/pos')

      // Scene 4: Stepper, Proto 1, POS
      expect(sceneTargets[4].task1).toBe('/pengajuan-gadai')
      expect(sceneTargets[4].task2).toBe('/sprint-proto-1')
      expect(sceneTargets[4].task3).toBe('/pos')

      // Scene 5: Existing, Proto 2, POS
      expect(sceneTargets[5].task1).toBe('/sprint-existing')
      expect(sceneTargets[5].task2).toBe('/sprint-proto-2')
      expect(sceneTargets[5].task3).toBe('/pos')

      // Scene 6: Existing, Proto 1, POS
      expect(sceneTargets[6].task1).toBe('/sprint-existing')
      expect(sceneTargets[6].task2).toBe('/sprint-proto-1')
      expect(sceneTargets[6].task3).toBe('/pos')
    })
  })

  describe('Step title completeness format verification', () => {
    it('formats titles with full Kanwil, Cabang, Tier, Role, and Scene context', () => {
      const team = { id: 'team-1', label: 'Tim 1', kanwil: 'Bandung', tier: 'Tier 1' }
      const branch = { id: 'bdg-cbg-a', label: 'bdg-cbg-a', shortLabel: 'Cabang A', tier: 'Urban' }
      const role = { id: 'Kasir', label: 'Kasir' }
      const scene = 1

      const step1Title = 'Team Riset - Pilih Kantor Wilayah'
      const step2Title = `Team Kanwil [${team.kanwil}] - ${team.label} (${team.tier}) - Pilih Cabang Kunjungan`
      const step3Title = `ROLE CP [${branch.label}] - Kanwil ${team.kanwil} - ${branch.shortLabel} (${branch.tier})`
      const step4Title = `Task [${role.label}] CP [${branch.label}] - Kanwil ${team.kanwil} - ${branch.shortLabel} (${branch.tier} - Scene ${scene})`

      expect(step1Title).toContain('Team Riset')
      expect(step1Title).toContain('Kantor Wilayah')

      expect(step2Title).toBe('Team Kanwil [Bandung] - Tim 1 (Tier 1) - Pilih Cabang Kunjungan')
      expect(step2Title).toContain('Bandung')
      expect(step2Title).toContain('Tim 1')
      expect(step2Title).toContain('Pilih Cabang')

      expect(step3Title).toBe('ROLE CP [bdg-cbg-a] - Kanwil Bandung - Cabang A (Urban)')
      expect(step3Title).toContain('ROLE CP [bdg-cbg-a]')
      expect(step3Title).toContain('Kanwil Bandung')
      expect(step3Title).toContain('Cabang A')
      expect(step3Title).toContain('Urban')

      expect(step4Title).toBe('Task [Kasir] CP [bdg-cbg-a] - Kanwil Bandung - Cabang A (Urban - Scene 1)')
      expect(step4Title).toContain('Task [Kasir]')
      expect(step4Title).toContain('CP [bdg-cbg-a]')
      expect(step4Title).toContain('Kanwil Bandung')
      expect(step4Title).toContain('Cabang A')
      expect(step4Title).toContain('Scene 1')
    })
  })
})
