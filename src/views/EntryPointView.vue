<script setup lang="ts">
/**
 * @file EntryPointView.vue
 * @description Entry Point view supporting 4 research stages:
 * 1. Teams (Tim Riset 1, 2, 3 / Kanwil Bandung, Denpasar, XXX)
 * 2. Kanwil (Cabang bdg-cbg-a, dps-cbg-a, etc.)
 * 3. Role (Kasir, Penaksir, Pinca, CRO)
 * 4. Tasks (Scenario Matrix 1-6 automatic task assignment)
 */
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import sprintPattern from '@/assets/images/sprint/entry-background-pattern.svg'
import sprintHeaderPattern from '@/assets/images/sprint/entry-header-pattern.svg'
import sprintMark from '@/assets/images/sprint/entry-logo-mark.svg'
import sprintWordmark from '@/assets/images/sprint/entry-logo-wordmark.svg'

type EntryPointStage = 'teams' | 'kanwil' | 'role' | 'tasks'

interface EntryPointOption {
  id: string
  label: string
  title?: string
  subtitle?: string
  description?: string
  badge?: string
  actionLabel?: string
  targetRoute?: string
  requiresLogin?: boolean
}

interface TeamOption extends EntryPointOption {
  kanwil: string
  tier: string
}

interface BranchOption extends EntryPointOption {
  shortLabel: string
  tier: string
  gadaiType: 'stepper' | 'non-stepper'
  berandaPrimary: 1 | 2
}

const props = withDefaults(defineProps<{ stage?: EntryPointStage }>(), {
  stage: 'teams',
})

const router = useRouter()
const route = useRoute()

const teams: TeamOption[] = [
  {
    id: 'team-1',
    label: 'Tim 1',
    badge: 'Tim Riset 1',
    title: 'Kanwil Makassar',
    subtitle: 'Kategori Tier 1',
    description: 'Kanwil Makassar',
    actionLabel: 'Pilih Tim',
    kanwil: 'Makassar',
    tier: 'Tier 1',
  },
  {
    id: 'team-2',
    label: 'Tim 2',
    badge: 'Tim Riset 2',
    title: 'Kanwil Denpasar',
    subtitle: 'Kategori Tier 2',
    description: 'Kanwil Denpasar',
    actionLabel: 'Pilih Tim',
    kanwil: 'Denpasar',
    tier: 'Tier 2',
  },
  {
    id: 'team-3',
    label: 'Tim 3',
    badge: 'Tim Riset 3',
    title: 'Kanwil Bandung',
    subtitle: 'Kategori Tier 3',
    description: 'Kanwil Bandung',
    actionLabel: 'Pilih Tim',
    kanwil: 'Bandung',
    tier: 'Tier 3',
  },
]

const branchesByTeam: Record<string, BranchOption[]> = {
  'team-1': [
    {
      id: 'mks-cbg-talasalapang',
      label: 'CP Talasalapang',
      badge: 'Cabang • Urban',
      title: 'CP Talasalapang',
      subtitle: 'Klasifikasi Wilayah Urban',
      description: 'Urban',
      shortLabel: 'CP Talasalapang',
      tier: 'Urban',
      actionLabel: 'Pilih Cabang',
      gadaiType: 'non-stepper',
      berandaPrimary: 1,
    },
    {
      id: 'mks-cbg-palangga',
      label: 'CP Palangga',
      badge: 'Cabang • Sub Urban',
      title: 'CP Palangga',
      subtitle: 'Klasifikasi Wilayah Sub Urban',
      description: 'Sub Urban',
      shortLabel: 'CP Palangga',
      tier: 'Sub Urban',
      actionLabel: 'Pilih Cabang',
      gadaiType: 'non-stepper',
      berandaPrimary: 2,
    },
    {
      id: 'mks-cbg-takalar',
      label: 'CP Takalar',
      badge: 'Cabang • Rural',
      title: 'CP Takalar',
      subtitle: 'Klasifikasi Wilayah Rural',
      description: 'Rural',
      shortLabel: 'CP Takalar',
      tier: 'Rural',
      actionLabel: 'Pilih Cabang',
      gadaiType: 'stepper',
      berandaPrimary: 1,
    },
  ],
  'team-2': [
    {
      id: 'dps-cbg-renon',
      label: 'CP Renon',
      badge: 'Cabang • Urban',
      title: 'CP Renon',
      subtitle: 'Klasifikasi Wilayah Urban',
      description: 'Urban',
      shortLabel: 'CP Renon',
      tier: 'Urban',
      actionLabel: 'Pilih Cabang',
      gadaiType: 'non-stepper',
      berandaPrimary: 2,
    },
    {
      id: 'dps-cbg-denpasar',
      label: 'CP Denpasar',
      badge: 'Cabang • Sub Urban',
      title: 'CP Denpasar',
      subtitle: 'Klasifikasi Wilayah Sub Urban',
      description: 'Sub Urban',
      shortLabel: 'CP Denpasar',
      tier: 'Sub Urban',
      actionLabel: 'Pilih Cabang',
      gadaiType: 'non-stepper',
      berandaPrimary: 1,
    },
    {
      id: 'dps-cbg-ubung',
      label: 'CP Ubung',
      badge: 'Cabang • Rural',
      title: 'CP Ubung',
      subtitle: 'Klasifikasi Wilayah Rural',
      description: 'Rural',
      shortLabel: 'CP Ubung',
      tier: 'Rural',
      actionLabel: 'Pilih Cabang',
      gadaiType: 'stepper',
      berandaPrimary: 2,
    },
  ],
  'team-3': [
    {
      id: 'bdg-cbg-pungkur',
      label: 'CP Pungkur',
      badge: 'Cabang • Urban',
      title: 'CP Pungkur',
      subtitle: 'Klasifikasi Wilayah Urban',
      description: 'Urban',
      shortLabel: 'CP Pungkur',
      tier: 'Urban',
      actionLabel: 'Pilih Cabang',
      gadaiType: 'stepper',
      berandaPrimary: 1,
    },
    {
      id: 'bdg-cbg-cimahi',
      label: 'CP Cimahi',
      badge: 'Cabang • Sub Urban',
      title: 'CP Cimahi',
      subtitle: 'Klasifikasi Wilayah Sub Urban',
      description: 'Sub Urban',
      shortLabel: 'CP Cimahi',
      tier: 'Sub Urban',
      actionLabel: 'Pilih Cabang',
      gadaiType: 'stepper',
      berandaPrimary: 2,
    },
    {
      id: 'bdg-cbg-ujungberung',
      label: 'CP Ujung Berung',
      badge: 'Cabang • Rural',
      title: 'CP Ujung Berung',
      subtitle: 'Klasifikasi Wilayah Rural',
      description: 'Rural',
      shortLabel: 'CP Ujung Berung',
      tier: 'Rural',
      actionLabel: 'Pilih Cabang',
      gadaiType: 'stepper',
      berandaPrimary: 1,
    },
  ],
}

const roles: EntryPointOption[] = [
  {
    id: 'Kasir',
    label: 'Kasir',
    badge: 'Frontliner',
    title: 'Kasir',
    subtitle: 'Layanan Pembayaran & Transaksi',
    actionLabel: 'Pilih Role',
  },
  {
    id: 'Penaksir',
    label: 'Penaksir',
    badge: 'Operasional',
    title: 'Penaksir',
    subtitle: 'Penaksiran & Verifikasi Agunan',
    actionLabel: 'Pilih Role',
  },
  {
    id: 'Pinca',
    label: 'Pinca',
    badge: 'Pimpinan',
    title: 'Pinca',
    subtitle: 'Pimpinan Cabang & Approval',
    actionLabel: 'Pilih Role',
  },
  {
    id: 'CRO',
    label: 'CRO',
    badge: 'Pemasaran',
    title: 'CRO',
    subtitle: 'Customer Relationship Officer',
    actionLabel: 'Pilih Role',
  },
]

function getQueryValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function getStoredValue(key: string): string | undefined {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const val = window.sessionStorage.getItem(key)
      return val ?? undefined
    } catch {
      return undefined
    }
  }
  return undefined
}

function persistResearchContext(teamId: string, cpId: string, roleId: string, nextView?: string, fromCompare?: string) {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      window.sessionStorage.setItem('sprint_research_team', teamId)
      window.sessionStorage.setItem('sprint_research_cp', cpId)
      window.sessionStorage.setItem('sprint_research_role', roleId)
      if (nextView) {
        window.sessionStorage.setItem('sprint_research_next_view', nextView)
      } else {
        window.sessionStorage.removeItem('sprint_research_next_view')
      }
      if (fromCompare) {
        window.sessionStorage.setItem('sprint_research_from_compare', fromCompare)
      } else {
        window.sessionStorage.removeItem('sprint_research_from_compare')
      }
    } catch {
      // ignore storage quota / sandbox limits
    }
  }
}

const selectedTeam = computed(() => {
  const queryTeam = getQueryValue(route.query.team) || getStoredValue('sprint_research_team')
  return teams.find((team) => team.id === queryTeam) ?? teams[0]
})

const availableBranches = computed(() => branchesByTeam[selectedTeam.value.id] ?? branchesByTeam['team-1'])

const selectedBranch = computed<BranchOption>(() => {
  const queryCp = getQueryValue(route.query.cp) || getStoredValue('sprint_research_cp')
  if (!queryCp) return availableBranches.value[0]
  const exact = availableBranches.value.find((b) => b.id.toLowerCase() === queryCp.toLowerCase())
  if (exact) return exact

  // Fallback for legacy branch IDs or names
  const q = queryCp.toLowerCase()
  if (q.includes('talasalapang') || q.includes('renon') || q.includes('pungkur') || q.endsWith('-a') || (q.includes('urban') && !q.includes('sub'))) {
    return availableBranches.value[0]
  }
  if (q.includes('palangga') || q.includes('denpasar') || q.includes('cimahi') || q.endsWith('-b') || q.includes('sub')) {
    return availableBranches.value[1]
  }
  if (q.includes('takalar') || q.includes('ubung') || q.includes('ujung') || q.endsWith('-c') || q.includes('rural')) {
    return availableBranches.value[2]
  }
  return availableBranches.value[0]
})

const selectedRole = computed(() => {
  const queryRole = getQueryValue(route.query.role) || getStoredValue('sprint_research_role')
  if (!queryRole) return undefined
  return roles.find((role) => role.id.toLowerCase() === queryRole.toLowerCase())
})

const currentRole = computed(() => selectedRole.value ?? roles[0])

const isLeadershipRole = computed(() => currentRole.value.id === 'Pinca' || currentRole.value.id === 'CRO')

/**
 * Computes exact tasks according to the updated research matrix:
 * - Kasir & Penaksir: 3 tasks (Task 1: Gadai, Task 2: Beranda, Task 3: PoS)
 * - Pinca & CRO: 2 tasks (Task 1: Beranda, Task 2: PoS)
 */
const currentTasks = computed<EntryPointOption[]>(() => {
  const branch = selectedBranch.value
  const isLeadership = isLeadershipRole.value

  const leadershipBerandaTask: EntryPointOption = branch.berandaPrimary === 1
    ? {
        id: 'task-beranda',
        label: 'Task 1',
        badge: 'Task 1',
        title: 'Beranda Eksisting',
        subtitle: 'Alur perbandingan (Next view: Beranda Opsi 1 → Beranda Opsi 2)',
        description: 'Beranda Eksisting (Next view: Beranda Opsi 1 → Beranda Opsi 2)',
        actionLabel: 'Mulai Task',
        targetRoute: '/proto-existing?nextView=proto-1',
        requiresLogin: true,
      }
    : {
        id: 'task-beranda',
        label: 'Task 1',
        badge: 'Task 1',
        title: 'Beranda Eksisting',
        subtitle: 'Alur perbandingan (Next view: Beranda Opsi 2 → Beranda Opsi 1)',
        description: 'Beranda Eksisting (Next view: Beranda Opsi 2 → Beranda Opsi 1)',
        actionLabel: 'Mulai Task',
        targetRoute: '/proto-existing?nextView=proto-2',
        requiresLogin: true,
      }

  const berandaTask: EntryPointOption = branch.berandaPrimary === 1
    ? {
        id: 'task-beranda',
        label: 'Task 2',
        badge: 'Task 2',
        title: 'Beranda Opsi 1',
        subtitle: 'Alur perbandingan (Next view: Beranda Opsi 2)',
        description: 'Beranda Opsi 1 (Next view: Beranda Opsi 2)',
        actionLabel: 'Mulai Task',
        targetRoute: '/sprint-proto-1?nextView=proto-2',
        requiresLogin: true,
      }
    : {
        id: 'task-beranda',
        label: 'Task 2',
        badge: 'Task 2',
        title: 'Beranda Opsi 2',
        subtitle: 'Alur perbandingan (Next view: Beranda Opsi 1)',
        description: 'Beranda Opsi 2 (Next view: Beranda Opsi 1)',
        actionLabel: 'Mulai Task',
        targetRoute: '/sprint-proto-2?nextView=proto-1',
        requiresLogin: true,
      }

  const posTask: EntryPointOption = {
    id: 'task-pos',
    label: isLeadership ? 'Task 2' : 'Task 3',
    badge: isLeadership ? 'Task 2' : 'Task 3',
    title: 'Point of Sales (PoS)',
    subtitle: 'Pembayaran Gadai & Simulasi Kasir',
    description: 'PoS',
    actionLabel: 'Mulai Task',
    targetRoute: '/pos',
    requiresLogin: false,
  }

  if (isLeadership) {
    return [leadershipBerandaTask, posTask]
  }

  const gadaiTask: EntryPointOption = branch.gadaiType === 'non-stepper'
    ? {
        id: 'task-gadai',
        label: 'Task 1',
        badge: 'Task 1',
        title: 'Pengajuan Gadai',
        subtitle: 'Form Tunggal Non Stepper (1 Halaman)',
        description: 'Pengajuan Gadai Non Stepper',
        actionLabel: 'Mulai Task',
        targetRoute: '/beranda?targetGadai=non-stepper',
        requiresLogin: true,
      }
    : {
        id: 'task-gadai',
        label: 'Task 1',
        badge: 'Task 1',
        title: 'Pengajuan Gadai',
        subtitle: 'Multi-Step Stepper (Bertahap)',
        description: 'Pengajuan Gadai Stepper',
        actionLabel: 'Mulai Task',
        targetRoute: '/beranda?targetGadai=stepper',
        requiresLogin: true,
      }

  return [gadaiTask, berandaTask, posTask]
})

const stageContent = computed<Record<EntryPointStage, { title: string; options: EntryPointOption[] }>>(() => ({
  teams: {
    title: 'Team Riset - Pilih Kantor Wilayah',
    options: teams,
  },
  kanwil: {
    title: `Team Kanwil [${selectedTeam.value.kanwil}] - ${selectedTeam.value.label} (${selectedTeam.value.tier}) - Pilih Cabang Kunjungan`,
    options: availableBranches.value,
  },
  role: {
    title: `Role • ${selectedBranch.value.label} (Kanwil ${selectedTeam.value.kanwil} - ${selectedBranch.value.tier})`,
    options: roles,
  },
  tasks: {
    title: `Task [${currentRole.value.label}] • ${selectedBranch.value.label} (Kanwil ${selectedTeam.value.kanwil} - ${selectedBranch.value.tier})`,
    options: currentTasks.value,
  },
}))

function isOptionSelected(_option: EntryPointOption): boolean {
  // Semua kartu pada tahap pemilihan tampil netral dan siap dipilih (tidak ada yang otomatis aktif/pre-selected)
  return false
}

onMounted(() => {
  persistResearchContext(selectedTeam.value.id, selectedBranch.value.id, currentRole.value.id)
})

function selectOption(option: EntryPointOption) {
  if (props.stage === 'teams') {
    persistResearchContext(option.id, availableBranches.value[0]?.id || '', currentRole.value.id)
    void router.push({
      name: 'entry-point-kanwil',
      query: { team: option.id },
    })
    return
  }

  if (props.stage === 'kanwil') {
    persistResearchContext(selectedTeam.value.id, option.id, currentRole.value.id)
    void router.push({
      name: 'entry-point-role',
      query: { team: selectedTeam.value.id, cp: option.id },
    })
    return
  }

  if (props.stage === 'role') {
    persistResearchContext(selectedTeam.value.id, selectedBranch.value.id, option.id)
    void router.push({
      name: 'entry-point-tasks',
      query: { team: selectedTeam.value.id, cp: selectedBranch.value.id, role: option.id },
    })
    return
  }

  if (props.stage === 'tasks') {
    const rawTargetRoute = option.targetRoute ?? '/sprint-proto-1'
    const [path, queryString] = rawTargetRoute.split('?')
    const extraParams = new URLSearchParams(queryString ?? '')
    const targetQuery: Record<string, string> = {
      team: selectedTeam.value.id,
      cp: selectedBranch.value.id,
      role: currentRole.value.id,
    }
    extraParams.forEach((val, key) => {
      targetQuery[key] = val
    })

    persistResearchContext(
      selectedTeam.value.id,
      selectedBranch.value.id,
      currentRole.value.id,
      targetQuery.nextView,
      targetQuery.fromCompare,
    )

    if (option.requiresLogin) {
      void router.push({
        path: '/login',
        query: {
          role: currentRole.value.id,
          redirect: path,
          ...targetQuery,
        },
      })
    } else {
      void router.push({
        path,
        query: targetQuery,
      })
    }
  }
}

function handleBack() {
  if (props.stage === 'kanwil') {
    void router.push({ name: 'entry-point' })
    return
  }

  if (props.stage === 'role') {
    void router.push({
      name: 'entry-point-kanwil',
      query: { team: selectedTeam.value.id },
    })
    return
  }

  if (props.stage === 'tasks') {
    void router.push({
      name: 'entry-point-role',
      query: { team: selectedTeam.value.id, cp: selectedBranch.value.id },
    })
  }
}
</script>

<template>
  <main class="entry-point-page" :class="`entry-point-page--${props.stage}`">
    <header class="entry-point-header">
      <img class="entry-point-header__pattern" :src="sprintHeaderPattern" alt="" aria-hidden="true" />
      <div class="entry-point-brand" aria-label="SPRINT">
        <img class="entry-point-brand__mark" :src="sprintMark" alt="" />
        <img class="entry-point-brand__wordmark" :src="sprintWordmark" alt="SPRINT" />
      </div>
    </header>

    <section class="entry-point-scene" :aria-labelledby="`entry-point-title-${props.stage}`">
      <img class="entry-point-scene__pattern" :src="sprintPattern" alt="" aria-hidden="true" />

      <div class="entry-point-scene__content">
        <h1 :id="`entry-point-title-${props.stage}`" class="entry-point-scene__title">
          {{ stageContent[props.stage].title }}
        </h1>

        <div
          class="entry-point-options"
          :class="`entry-point-options--${props.stage}`"
        >
          <button
            v-for="option in stageContent[props.stage].options"
            :key="option.id"
            class="entry-point-option"
            :class="[
              { 'entry-point-option--selected': isOptionSelected(option) },
              `entry-point-option--${props.stage}`
            ]"
            type="button"
            :aria-pressed="isOptionSelected(option)"
            @click="selectOption(option)"
          >
            <span class="entry-point-card-badge entry-point-option__label">{{ option.badge || option.label }}</span>
            <div class="entry-point-card-body">
              <span class="entry-point-card-title">{{ option.title || option.label }}</span>
              <span v-if="option.subtitle || option.description" class="entry-point-card-sub entry-point-option__desc">
                {{ option.subtitle || option.description }}
              </span>
            </div>
            <div class="entry-point-card-action" aria-hidden="true">
              <span>{{ option.actionLabel || 'Pilih' }}</span>
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 10h10M11 6l4 4-4 4" />
              </svg>
            </div>
          </button>
        </div>

        <!-- Small footer back button (hidden on root teams stage) -->
        <footer v-if="props.stage !== 'teams'" class="entry-point-footer">
          <button class="entry-point-back" type="button" aria-label="Kembali ke tahap sebelumnya" @click="handleBack">
            &larr; Kembali
          </button>
        </footer>
      </div>
    </section>
  </main>
</template>

<style scoped>
.entry-point-page {
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  overflow-x: hidden;
  background: var(--g-kit-black-10, #f8f8f8);
  color: var(--g-kit-black-80, #252528);
  font-family: var(--g-kit-font-family, 'Nunito Sans', sans-serif);
}

.entry-point-header {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 2;
  display: flex;
  height: 102px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(110deg, #003d35 0%, #002e28 100%);
}

.entry-point-header__pattern {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 360px;
  height: 240px;
  transform: translate(-50%, -50%);
  opacity: 0.5;
  pointer-events: none;
}

.entry-point-brand {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}

.entry-point-brand__mark {
  display: block;
  width: 31px;
  height: 43px;
}

.entry-point-brand__wordmark {
  display: block;
  width: 98px;
  height: 19px;
}

.entry-point-scene {
  position: relative;
  display: flex;
  min-height: 100vh;
  min-height: 100svh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 24px 36px;
  overflow-y: auto;
  box-sizing: border-box;
}

.entry-point-scene__pattern {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(1280px, 100%);
  height: auto;
  transform: translate(-50%, -50%);
  opacity: 0.15;
  pointer-events: none;
}

.entry-point-scene__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1280px;
  margin: auto 0;
}

.entry-point-scene__title {
  position: relative;
  z-index: 1;
  min-height: 30px;
  max-width: min(1100px, 100%);
  margin: 0 auto;
  color: var(--g-kit-black-80, #252528);
  font-size: 20px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 32px;
  text-align: center;
  word-break: break-word;
}

.entry-point-options {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1240px;
  justify-content: center;
  align-items: stretch;
  gap: 24px;
  margin-top: 36px;
  margin-bottom: 24px;
}

.entry-point-option {
  flex: 0 1 285px;
  width: 285px;
  max-width: 100%;
  min-height: 228px;
  height: auto;
  padding: 24px 20px;
  border-radius: 24px;
  border: 1.5px solid var(--g-kit-lime-50, #00ab4e);
  background: var(--g-kit-white, #ffffff);
  color: var(--g-kit-black-80, #252528);
  box-shadow: 0 4px 16px rgba(0, 77, 67, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  gap: 16px;
  cursor: pointer;
  font-family: inherit;
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background-color 180ms ease;
}

.entry-point-option:hover {
  transform: translateY(-4px);
  border-color: var(--g-kit-lime-60, #00873d);
  box-shadow: 0 12px 28px rgba(0, 77, 67, 0.14);
}

.entry-point-option:focus-visible {
  outline: 3px solid var(--g-kit-broccoli-50, #004d43);
  outline-offset: 4px;
}

.entry-point-option--selected {
  border-width: 2px;
  background: var(--g-kit-emerald-10, #e6f5ef);
  box-shadow: 0 0 0 3px rgba(0, 171, 78, 0.2);
}

.entry-point-card-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 14px;
  border-radius: 9999px;
  background: var(--g-kit-emerald-10, #e6f5ef);
  border: 1px solid var(--g-kit-lime-30, #66cd95);
  color: var(--g-kit-emerald-50, #004d43);
  font-size: 13px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.entry-point-card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: 1 1 auto;
}

.entry-point-card-title {
  display: block;
  font-size: 19px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 26px;
  color: var(--g-kit-black-80, #252528);
}

.entry-point-card-sub {
  display: block;
  font-size: 13px;
  font-weight: 600;
  line-height: 19px;
  color: var(--g-kit-black-50, #727278);
  max-width: 240px;
}

.entry-point-card-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 9999px;
  border: 1px solid var(--g-kit-lime-50, #00ab4e);
  background: var(--g-kit-white, #ffffff);
  color: var(--g-kit-lime-50, #00ab4e);
  font-size: 13px;
  font-weight: 700;
  transition: all 160ms ease;
}

.entry-point-option:hover .entry-point-card-action {
  background: var(--g-kit-lime-50, #00ab4e);
  color: var(--g-kit-white, #ffffff);
}

.entry-point-footer {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.entry-point-back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 24px;
  border: 1px solid var(--g-kit-lime-50, #00ab4e);
  border-radius: 9999px;
  background: var(--g-kit-white, #ffffff);
  color: var(--g-kit-lime-50, #00ab4e);
  font-family: inherit;
  font-size: 15px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 22px;
  cursor: pointer;
  transition: all 160ms ease;
}

.entry-point-back:hover {
  background: var(--g-kit-lime-50, #00ab4e);
  color: var(--g-kit-white, #ffffff);
  box-shadow: 0 4px 12px rgb(0 171 78 / 20%);
}

.entry-point-back:focus-visible {
  outline: 3px solid var(--g-kit-broccoli-50, #004d43);
  outline-offset: 2px;
}

@media (max-width: 640px) {
  .entry-point-header {
    height: 82px;
  }

  .entry-point-scene {
    padding: 96px 16px 28px;
  }

  .entry-point-brand__mark {
    width: 25px;
    height: 35px;
  }

  .entry-point-brand__wordmark {
    width: 82px;
    height: 16px;
  }

  .entry-point-scene__title {
    font-size: 18px;
    line-height: 28px;
  }

  .entry-point-options {
    width: min(100%, 360px);
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-top: 24px;
    margin-bottom: 20px;
  }

  .entry-point-option {
    width: 100%;
    min-height: 200px;
    padding: 20px 16px;
    border-radius: 20px;
  }

  .entry-point-footer {
    margin-top: 16px;
  }
}
</style>
