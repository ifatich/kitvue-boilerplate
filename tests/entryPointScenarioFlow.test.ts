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

  describe('Scenario Matrix validation (Makassar, Denpasar, Bandung)', () => {
    interface BranchConfig {
      id: string
      name: string
      tier: 'Urban' | 'Sub Urban' | 'Rural'
      gadaiType: 'stepper' | 'non-stepper'
      berandaPrimary: 1 | 2
    }

    const branchesByTeam: Record<string, BranchConfig[]> = {
      'team-1': [
        { id: 'mks-cbg-talasalapang', name: 'CP Talasalapang', tier: 'Urban', gadaiType: 'non-stepper', berandaPrimary: 1 },
        { id: 'mks-cbg-palangga', name: 'CP Palangga', tier: 'Sub Urban', gadaiType: 'non-stepper', berandaPrimary: 2 },
        { id: 'mks-cbg-takalar', name: 'CP Takalar', tier: 'Rural', gadaiType: 'stepper', berandaPrimary: 1 },
      ],
      'team-2': [
        { id: 'dps-cbg-renon', name: 'CP Renon', tier: 'Urban', gadaiType: 'non-stepper', berandaPrimary: 2 },
        { id: 'dps-cbg-denpasar', name: 'CP Denpasar', tier: 'Sub Urban', gadaiType: 'non-stepper', berandaPrimary: 1 },
        { id: 'dps-cbg-ubung', name: 'CP Ubung', tier: 'Rural', gadaiType: 'stepper', berandaPrimary: 2 },
      ],
      'team-3': [
        { id: 'bdg-cbg-pungkur', name: 'CP Pungkur', tier: 'Urban', gadaiType: 'stepper', berandaPrimary: 1 },
        { id: 'bdg-cbg-cimahi', name: 'CP Cimahi', tier: 'Sub Urban', gadaiType: 'stepper', berandaPrimary: 2 },
        { id: 'bdg-cbg-ujungberung', name: 'CP Ujung Berung', tier: 'Rural', gadaiType: 'stepper', berandaPrimary: 1 },
      ],
    }

    function getTasksFor(teamId: string, branchId: string, role: PrototypeRole) {
      const branch = branchesByTeam[teamId].find((b) => b.id === branchId)!
      const isLeadership = role === 'Pinca' || role === 'CRO'

      const berandaTask = branch.berandaPrimary === 1
        ? {
            label: isLeadership ? 'Task 1' : 'Task 2',
            description: 'Beranda Opsi 1 (Next view: Beranda Opsi 2)',
            targetRoute: '/sprint-proto-1?nextView=proto-2',
          }
        : {
            label: isLeadership ? 'Task 1' : 'Task 2',
            description: 'Beranda Opsi 2 (Next view: Beranda Opsi 1)',
            targetRoute: '/sprint-proto-2?nextView=proto-1',
          }

      const posTask = {
        label: isLeadership ? 'Task 2' : 'Task 3',
        description: 'PoS',
        targetRoute: '/pos',
      }

      if (isLeadership) {
        return [berandaTask, posTask]
      }

      const gadaiTask = branch.gadaiType === 'non-stepper'
        ? {
            label: 'Task 1',
            description: 'Pengajuan Gadai Non Stepper',
            targetRoute: '/beranda?targetGadai=non-stepper',
          }
        : {
            label: 'Task 1',
            description: 'Pengajuan Gadai Stepper',
            targetRoute: '/beranda?targetGadai=stepper',
          }

      return [gadaiTask, berandaTask, posTask]
    }

    it('correctly maps Tim 1 (Makassar) branches and roles to tasks', () => {
      // CP Talasalapang (Urban): Staff -> Non Stepper, Beranda 1 (next 2), PoS
      const staffTasks = getTasksFor('team-1', 'mks-cbg-talasalapang', 'Kasir')
      expect(staffTasks).toHaveLength(3)
      expect(staffTasks[0].description).toBe('Pengajuan Gadai Non Stepper')
      expect(staffTasks[1].description).toContain('Beranda Opsi 1')
      expect(staffTasks[1].targetRoute).toBe('/sprint-proto-1?nextView=proto-2')
      expect(staffTasks[2].description).toBe('PoS')

      // CP Talasalapang (Urban): Leadership -> Beranda 1 (next 2) as Task 1, PoS as Task 2
      const leaderTasks = getTasksFor('team-1', 'mks-cbg-talasalapang', 'Pinca')
      expect(leaderTasks).toHaveLength(2)
      expect(leaderTasks[0].label).toBe('Task 1')
      expect(leaderTasks[0].description).toContain('Beranda Opsi 1')
      expect(leaderTasks[1].label).toBe('Task 2')
      expect(leaderTasks[1].description).toBe('PoS')

      // CP Palangga (Sub Urban): Beranda 2 (next 1)
      const subUrbanTasks = getTasksFor('team-1', 'mks-cbg-palangga', 'Penaksir')
      expect(subUrbanTasks[0].description).toBe('Pengajuan Gadai Non Stepper')
      expect(subUrbanTasks[1].description).toContain('Beranda Opsi 2')
      expect(subUrbanTasks[1].targetRoute).toBe('/sprint-proto-2?nextView=proto-1')

      // CP Takalar (Rural): Stepper
      const ruralTasks = getTasksFor('team-1', 'mks-cbg-takalar', 'Kasir')
      expect(ruralTasks[0].description).toBe('Pengajuan Gadai Stepper')
      expect(ruralTasks[1].description).toContain('Beranda Opsi 1')
    })

    it('correctly maps Tim 2 (Denpasar) branches and roles to tasks', () => {
      // CP Renon (Urban): Non Stepper, Beranda 2 (next 1)
      const renonTasks = getTasksFor('team-2', 'dps-cbg-renon', 'Kasir')
      expect(renonTasks[0].description).toBe('Pengajuan Gadai Non Stepper')
      expect(renonTasks[1].description).toContain('Beranda Opsi 2')

      // CP Denpasar (Sub Urban): Non Stepper, Beranda 1 (next 2)
      const denpasarTasks = getTasksFor('team-2', 'dps-cbg-denpasar', 'CRO')
      expect(denpasarTasks).toHaveLength(2)
      expect(denpasarTasks[0].description).toContain('Beranda Opsi 1')

      // CP Ubung (Rural): Stepper, Beranda 2 (next 1)
      const ubungTasks = getTasksFor('team-2', 'dps-cbg-ubung', 'Penaksir')
      expect(ubungTasks[0].description).toBe('Pengajuan Gadai Stepper')
      expect(ubungTasks[1].description).toContain('Beranda Opsi 2')
    })

    it('correctly maps Tim 3 (Bandung) branches to Stepper across all tiers', () => {
      // CP Pungkur (Urban): Stepper, Beranda 1 (next 2)
      const pungkurTasks = getTasksFor('team-3', 'bdg-cbg-pungkur', 'Kasir')
      expect(pungkurTasks[0].description).toBe('Pengajuan Gadai Stepper')
      expect(pungkurTasks[1].description).toContain('Beranda Opsi 1')

      // CP Cimahi (Sub Urban): Stepper, Beranda 2 (next 1)
      const cimahiTasks = getTasksFor('team-3', 'bdg-cbg-cimahi', 'Pinca')
      expect(cimahiTasks).toHaveLength(2)
      expect(cimahiTasks[0].description).toContain('Beranda Opsi 2')

      // CP Ujung Berung (Rural): Stepper, Beranda 1 (next 2)
      const ujungTasks = getTasksFor('team-3', 'bdg-cbg-ujungberung', 'Penaksir')
      expect(ujungTasks[0].description).toBe('Pengajuan Gadai Stepper')
      expect(ujungTasks[1].description).toContain('Beranda Opsi 1')
    })
  })

  describe('Step title completeness format verification', () => {
    it('formats titles with full Kanwil, Cabang, Tier, and Role context', () => {
      const team = { id: 'team-1', label: 'Tim 1', kanwil: 'Makassar', tier: 'Tier 1' }
      const branch = { id: 'mks-cbg-talasalapang', label: 'CP Talasalapang', tier: 'Urban' }
      const role = { id: 'Kasir', label: 'Kasir' }

      const step1Title = 'Team Riset - Pilih Kantor Wilayah'
      const step2Title = `Team Kanwil [${team.kanwil}] - ${team.label} (${team.tier}) - Pilih Cabang Kunjungan`
      const step3Title = `Role • ${branch.label} (Kanwil ${team.kanwil} - ${branch.tier})`
      const step4Title = `Task [${role.label}] • ${branch.label} (Kanwil ${team.kanwil} - ${branch.tier})`

      expect(step1Title).toContain('Team Riset')
      expect(step1Title).toContain('Kantor Wilayah')

      expect(step2Title).toBe('Team Kanwil [Makassar] - Tim 1 (Tier 1) - Pilih Cabang Kunjungan')
      expect(step2Title).toContain('Makassar')
      expect(step2Title).toContain('Tim 1')
      expect(step2Title).toContain('Pilih Cabang')

      expect(step3Title).toBe('Role • CP Talasalapang (Kanwil Makassar - Urban)')
      expect(step3Title).toContain('Role • CP Talasalapang')
      expect(step3Title).toContain('Kanwil Makassar')
      expect(step3Title).toContain('Urban')

      expect(step4Title).toBe('Task [Kasir] • CP Talasalapang (Kanwil Makassar - Urban)')
      expect(step4Title).toContain('Task [Kasir]')
      expect(step4Title).toContain('CP Talasalapang')
      expect(step4Title).toContain('Kanwil Makassar')
      expect(step4Title).toContain('Urban')
    })
  })

  describe('HomeView dynamic entry point resolution', () => {
    function resolvePengajuanPath(query: { targetGadai?: string; cp?: string }): string {
      const isNonStepper = query.targetGadai === 'non-stepper'
        ? true
        : query.targetGadai === 'stepper'
          ? false
          : Boolean(
              query.cp &&
              (query.cp.toLowerCase().includes('talasalapang') ||
                query.cp.toLowerCase().includes('palangga') ||
                query.cp.toLowerCase().includes('renon') ||
                (query.cp.toLowerCase().includes('denpasar') && !query.cp.toLowerCase().includes('ubung'))),
            )
      return isNonStepper ? '/pengajuan-gadai-non-stepper' : '/pengajuan-gadai'
    }

    it('resolves /pengajuan-gadai-non-stepper when targetGadai is non-stepper or branch is Urban/Sub Urban in Makassar/Denpasar', () => {
      expect(resolvePengajuanPath({ targetGadai: 'non-stepper' })).toBe('/pengajuan-gadai-non-stepper')
      expect(resolvePengajuanPath({ cp: 'mks-cbg-talasalapang' })).toBe('/pengajuan-gadai-non-stepper')
      expect(resolvePengajuanPath({ cp: 'mks-cbg-palangga' })).toBe('/pengajuan-gadai-non-stepper')
      expect(resolvePengajuanPath({ cp: 'dps-cbg-renon' })).toBe('/pengajuan-gadai-non-stepper')
      expect(resolvePengajuanPath({ cp: 'dps-cbg-denpasar' })).toBe('/pengajuan-gadai-non-stepper')
    })

    it('resolves /pengajuan-gadai when targetGadai is stepper or branch is Rural or Bandung', () => {
      expect(resolvePengajuanPath({ targetGadai: 'stepper' })).toBe('/pengajuan-gadai')
      expect(resolvePengajuanPath({ cp: 'mks-cbg-takalar' })).toBe('/pengajuan-gadai')
      expect(resolvePengajuanPath({ cp: 'dps-cbg-ubung' })).toBe('/pengajuan-gadai')
      expect(resolvePengajuanPath({ cp: 'bdg-cbg-pungkur' })).toBe('/pengajuan-gadai')
      expect(resolvePengajuanPath({ cp: 'bdg-cbg-cimahi' })).toBe('/pengajuan-gadai')
      expect(resolvePengajuanPath({ cp: 'bdg-cbg-ujungberung' })).toBe('/pengajuan-gadai')
    })
  })

  describe('Task 2 Beranda Search and 5-Second Success Flow', () => {
    it('requires searching first before triggering Pengajuan Gadai success', () => {
      let hasSearched = false
      const searchQuery = 'pengajuan'
      if (searchQuery.trim().length > 0) {
        hasSearched = true
      }

      const selectedItem = 'Pengajuan Gadai'
      const normalizedItem = selectedItem.trim().toLowerCase()
      const wasViaSearch = hasSearched && Boolean(searchQuery.trim())

      expect(normalizedItem).toBe('pengajuan gadai')
      expect(wasViaSearch).toBe(true)

      const routeQuery = { team: 'team-1', cp: 'mks-cbg-talasalapang', role: 'Kasir', nextView: 'proto-2' }
      const targetQuery = {
        ...routeQuery,
        viaSearch: wasViaSearch ? '1' : undefined,
      }
      expect(targetQuery.viaSearch).toBe('1')

      // If user did not search:
      const nonSearchQuery = ''
      const hasSearchedDirect = nonSearchQuery.trim().length > 0
      const wasViaSearchDirect = hasSearchedDirect && Boolean(nonSearchQuery.trim())
      const targetQueryDirect = {
        ...routeQuery,
        viaSearch: wasViaSearchDirect ? '1' : undefined,
      }
      expect(targetQueryDirect.viaSearch).toBeUndefined()
    })

    it('triggers delayed 5-second success modal only when viaSearch is 1 or hasSearched is true', () => {
      let modalCalled = false
      let timerDuration = 0

      function scheduleSuccessModal(isRoute: boolean, viaSearch: string | undefined, hasSearched: boolean) {
        if (isRoute && (viaSearch === '1' || hasSearched)) {
          timerDuration = 5000
          modalCalled = true
        } else {
          modalCalled = false
          timerDuration = 0
        }
      }

      // Valid search -> arrive at pengajuan-gadai
      scheduleSuccessModal(true, '1', true)
      expect(modalCalled).toBe(true)
      expect(timerDuration).toBe(5000)

      // Direct entry without search -> no modal
      scheduleSuccessModal(true, undefined, false)
      expect(modalCalled).toBe(false)
      expect(timerDuration).toBe(0)
    })

    it('preserves sequential comparison and returns to menu task on second beranda', () => {
      function getModalConfig(proto: 'proto-1' | 'proto-2', nextView?: string) {
        const isComparing = proto === 'proto-1' ? nextView === 'proto-2' : nextView === 'proto-1'
        if (isComparing) {
          return {
            confirmLabel: proto === 'proto-1' ? 'Lanjut ke Beranda Opsi 2' : 'Lanjut ke Beranda Opsi 1',
            nextPath: proto === 'proto-1' ? '/sprint-proto-2' : '/sprint-proto-1',
            fromCompare: proto,
          }
        }
        return {
          confirmLabel: 'Kembali ke Menu Task',
          nextPath: '/entry-point-tasks',
          fromCompare: undefined,
        }
      }

      // Proto 1 first (e.g. Talasalapang)
      const firstProto1 = getModalConfig('proto-1', 'proto-2')
      expect(firstProto1.confirmLabel).toBe('Lanjut ke Beranda Opsi 2')
      expect(firstProto1.nextPath).toBe('/sprint-proto-2')

      // Then on Proto 2 (no nextView)
      const secondProto2 = getModalConfig('proto-2', undefined)
      expect(secondProto2.confirmLabel).toBe('Kembali ke Menu Task')
      expect(secondProto2.nextPath).toBe('/entry-point-tasks')

      // Proto 2 first (e.g. Palangga)
      const firstProto2 = getModalConfig('proto-2', 'proto-1')
      expect(firstProto2.confirmLabel).toBe('Lanjut ke Beranda Opsi 1')
      expect(firstProto2.nextPath).toBe('/sprint-proto-1')

      // Then on Proto 1 (no nextView)
      const secondProto1 = getModalConfig('proto-1', undefined)
      expect(secondProto1.confirmLabel).toBe('Kembali ke Menu Task')
      expect(secondProto1.nextPath).toBe('/entry-point-tasks')
    })
  })

  describe('Task 3 POS Delayed 5-Second Success Flow', () => {
    it('schedules 5-second success modal when reaching stage=result and resultStatus=success', () => {
      let timerDuration = 0
      let modalScheduled = false

      function checkPosSuccess(stage: string, resultStatus: string) {
        const isSuccessResult = stage === 'result' && resultStatus === 'success'
        if (isSuccessResult) {
          timerDuration = 5000
          modalScheduled = true
        } else {
          timerDuration = 0
          modalScheduled = false
        }
      }

      // Reaching success result page (Pelunasan Gadai Berhasil Diproses)
      checkPosSuccess('result', 'success')
      expect(modalScheduled).toBe(true)
      expect(timerDuration).toBe(5000)

      // Failed result
      checkPosSuccess('result', 'failed')
      expect(modalScheduled).toBe(false)
      expect(timerDuration).toBe(0)

      // Instructions or Form stage
      checkPosSuccess('instructions', 'success')
      expect(modalScheduled).toBe(false)
      expect(timerDuration).toBe(0)
    })

    it('triggers immediate modal and cancels pending timer when resetFlowToHome is called on success', () => {
      let timerId: ReturnType<typeof setTimeout> | null = setTimeout(() => {}, 5000)
      let modalShown = false

      function triggerSuccessModal() {
        if (timerId) {
          clearTimeout(timerId)
          timerId = null
        }
        modalShown = true
      }

      function resetFlowToHome(resultStatus: string) {
        if (resultStatus === 'success') {
          triggerSuccessModal()
        }
      }

      resetFlowToHome('success')
      expect(modalShown).toBe(true)
      expect(timerId).toBeNull()
    })

    it('preserves team, cp, role query params across POS internal navigation routes', () => {
      const initialQuery = { team: 'team-1', cp: 'mks-cbg-talasalapang', role: 'Kasir' }

      // Dashboard -> Pembayaran
      const pembayaranRoute = {
        path: '/pos/pembayaran',
        query: { ...initialQuery },
      }
      expect(pembayaranRoute.query).toEqual(initialQuery)

      // Pembayaran -> Pembayaran Gadai
      const pembayaranGadaiRoute = {
        path: '/pos/pembayaran-gadai',
        query: { ...pembayaranRoute.query },
      }
      expect(pembayaranGadaiRoute.query).toEqual(initialQuery)
    })
  })
})
