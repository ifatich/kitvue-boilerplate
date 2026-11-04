<script setup lang="ts">
/**
 * @file EntryPointView.vue
 * @description Entry Point view supporting 4 research stages:
 * 1. Teams (Tim Riset 1, 2, 3 / Kanwil Bandung, Denpasar, XXX)
 * 2. Kanwil (Cabang bdg-cbg-a, dps-cbg-a, etc.)
 * 3. Role (Kasir, Penaksir, Pinca, CRO)
 * 4. Tasks (Scenario Matrix 1-6 automatic task assignment)
 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import sprintPattern from '@/assets/images/sprint/entry-background-pattern.svg'
import sprintHeaderPattern from '@/assets/images/sprint/entry-header-pattern.svg'
import sprintMark from '@/assets/images/sprint/entry-logo-mark.svg'
import sprintWordmark from '@/assets/images/sprint/entry-logo-wordmark.svg'

type EntryPointStage = 'teams' | 'kanwil' | 'role' | 'tasks'

interface EntryPointOption {
  id: string
  label: string
  description?: string
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
  { id: 'team-1', label: 'Tim 1', description: 'Kanwil Makassar', kanwil: 'Makassar', tier: 'Tier 1' },
  { id: 'team-2', label: 'Tim 2', description: 'Kanwil Denpasar', kanwil: 'Denpasar', tier: 'Tier 2' },
  { id: 'team-3', label: 'Tim 3', description: 'Kanwil Bandung', kanwil: 'Bandung', tier: 'Tier 3' },
]

const branchesByTeam: Record<string, BranchOption[]> = {
  'team-1': [
    { id: 'mks-cbg-talasalapang', label: 'CP Talasalapang', description: 'Urban', shortLabel: 'CP Talasalapang', tier: 'Urban', gadaiType: 'non-stepper', berandaPrimary: 1 },
    { id: 'mks-cbg-palangga', label: 'CP Palangga', description: 'Sub Urban', shortLabel: 'CP Palangga', tier: 'Sub Urban', gadaiType: 'non-stepper', berandaPrimary: 2 },
    { id: 'mks-cbg-takalar', label: 'CP Takalar', description: 'Rural', shortLabel: 'CP Takalar', tier: 'Rural', gadaiType: 'stepper', berandaPrimary: 1 },
  ],
  'team-2': [
    { id: 'dps-cbg-renon', label: 'CP Renon', description: 'Urban', shortLabel: 'CP Renon', tier: 'Urban', gadaiType: 'non-stepper', berandaPrimary: 2 },
    { id: 'dps-cbg-denpasar', label: 'CP Denpasar', description: 'Sub Urban', shortLabel: 'CP Denpasar', tier: 'Sub Urban', gadaiType: 'non-stepper', berandaPrimary: 1 },
    { id: 'dps-cbg-ubung', label: 'CP Ubung', description: 'Rural', shortLabel: 'CP Ubung', tier: 'Rural', gadaiType: 'stepper', berandaPrimary: 2 },
  ],
  'team-3': [
    { id: 'bdg-cbg-pungkur', label: 'CP Pungkur', description: 'Urban', shortLabel: 'CP Pungkur', tier: 'Urban', gadaiType: 'stepper', berandaPrimary: 1 },
    { id: 'bdg-cbg-cimahi', label: 'CP Cimahi', description: 'Sub Urban', shortLabel: 'CP Cimahi', tier: 'Sub Urban', gadaiType: 'stepper', berandaPrimary: 2 },
    { id: 'bdg-cbg-ujungberung', label: 'CP Ujung Berung', description: 'Rural', shortLabel: 'CP Ujung Berung', tier: 'Rural', gadaiType: 'stepper', berandaPrimary: 1 },
  ],
}

const roles: EntryPointOption[] = [
  { id: 'Kasir', label: 'Kasir' },
  { id: 'Penaksir', label: 'Penaksir' },
  { id: 'Pinca', label: 'Pinca' },
  { id: 'CRO', label: 'CRO' },
]

function getQueryValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

const selectedTeam = computed(() => (
  teams.find((team) => team.id === getQueryValue(route.query.team)) ?? teams[0]
))

const availableBranches = computed(() => branchesByTeam[selectedTeam.value.id] ?? branchesByTeam['team-1'])

const selectedBranch = computed<BranchOption>(() => {
  const queryCp = getQueryValue(route.query.cp)
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
  const queryRole = getQueryValue(route.query.role)
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

  const berandaTask: EntryPointOption = branch.berandaPrimary === 1
    ? {
        id: 'task-beranda',
        label: isLeadership ? 'Task 1' : 'Task 2',
        description: 'Beranda Opsi 1 (Next view: Beranda Opsi 2)',
        targetRoute: '/sprint-proto-1?nextView=proto-2',
        requiresLogin: true,
      }
    : {
        id: 'task-beranda',
        label: isLeadership ? 'Task 1' : 'Task 2',
        description: 'Beranda Opsi 2 (Next view: Beranda Opsi 1)',
        targetRoute: '/sprint-proto-2?nextView=proto-1',
        requiresLogin: true,
      }

  const posTask: EntryPointOption = {
    id: 'task-pos',
    label: isLeadership ? 'Task 2' : 'Task 3',
    description: 'PoS',
    targetRoute: '/pos',
    requiresLogin: false,
  }

  if (isLeadership) {
    return [berandaTask, posTask]
  }

  const gadaiTask: EntryPointOption = branch.gadaiType === 'non-stepper'
    ? {
        id: 'task-gadai',
        label: 'Task 1',
        description: 'Pengajuan Gadai Non Stepper',
        targetRoute: '/beranda?targetGadai=non-stepper',
        requiresLogin: true,
      }
    : {
        id: 'task-gadai',
        label: 'Task 1',
        description: 'Pengajuan Gadai Stepper',
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
    title: `ROLE CP [${selectedBranch.value.label}] - Kanwil ${selectedTeam.value.kanwil} (${selectedBranch.value.tier})`,
    options: roles,
  },
  tasks: {
    title: `Task [${currentRole.value.label}] CP [${selectedBranch.value.label}] - Kanwil ${selectedTeam.value.kanwil} (${selectedBranch.value.tier})`,
    options: currentTasks.value,
  },
}))

function isOptionSelected(option: EntryPointOption): boolean {
  if (props.stage === 'teams') {
    return route.query.team === option.id
  }
  if (props.stage === 'kanwil') {
    return route.query.cp === option.id
  }
  if (props.stage === 'role') {
    return selectedRole.value?.id === option.id
  }
  return false
}

function selectOption(option: EntryPointOption) {
  if (props.stage === 'teams') {
    void router.push({
      name: 'entry-point-kanwil',
      query: { team: option.id },
    })
    return
  }

  if (props.stage === 'kanwil') {
    void router.push({
      name: 'entry-point-role',
      query: { team: selectedTeam.value.id, cp: option.id },
    })
    return
  }

  if (props.stage === 'role') {
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
      <h1 :id="`entry-point-title-${props.stage}`" class="entry-point-scene__title">
        {{ stageContent[props.stage].title }}
      </h1>

      <div class="entry-point-options" :class="`entry-point-options--${props.stage}`">
        <button
          v-for="option in stageContent[props.stage].options"
          :key="option.id"
          class="entry-point-option"
          :class="{ 'entry-point-option--selected': isOptionSelected(option) }"
          type="button"
          :aria-pressed="isOptionSelected(option)"
          @click="selectOption(option)"
        >
          <span class="entry-point-option__label">{{ option.label }}</span>
          <span v-if="option.description" class="entry-point-option__desc">{{ option.description }}</span>
        </button>
      </div>

      <!-- Small footer back button (hidden on root teams stage) -->
      <footer v-if="props.stage !== 'teams'" class="entry-point-footer">
        <button class="entry-point-back" type="button" aria-label="Kembali ke tahap sebelumnya" @click="handleBack">
          &larr; Kembali
        </button>
      </footer>
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
  padding: 126px 24px 48px;
  overflow-y: auto;
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

.entry-point-scene__title {
  position: relative;
  z-index: 1;
  min-height: 30px;
  max-width: min(1200px, 100%);
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
  display: grid;
  width: min(1272px, 100%);
  grid-template-columns: repeat(3, minmax(0, 290px));
  justify-content: center;
  gap: 24px;
  margin-top: 100px;
}

.entry-point-options--role {
  grid-template-columns: repeat(4, minmax(0, 290px));
  justify-content: center;
}

.entry-point-option {
  display: flex;
  min-width: 0;
  height: 363px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid var(--g-kit-lime-50, #00ab4e);
  border-radius: 40px;
  background: var(--g-kit-white, #ffffff);
  color: var(--g-kit-lime-50, #00ab4e);
  font-family: inherit;
  font-size: 20px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  transition: background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
}

.entry-point-option__label {
  display: block;
}

.entry-point-option__desc {
  display: block;
  font-size: 18px;
  font-weight: var(--g-kit-font-weight-bold, 700);
  opacity: 0.9;
}

.entry-point-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgb(0 77 67 / 10%);
}

.entry-point-option:focus-visible {
  outline: 3px solid var(--g-kit-broccoli-50, #004d43);
  outline-offset: 4px;
}

.entry-point-option--selected {
  border-width: 2px;
  background: var(--g-kit-black-10, #f8f8f8);
  box-shadow: 0 0 0 3px rgb(0 171 78 / 12%);
}

.entry-point-footer {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  margin-top: 48px;
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

@media (max-width: 1100px) {
  .entry-point-options--role {
    grid-template-columns: repeat(2, minmax(0, 290px));
    justify-content: center;
  }
}

@media (max-width: 980px) {
  .entry-point-options,
  .entry-point-options--role {
    grid-template-columns: repeat(2, minmax(0, 290px));
    justify-content: center;
  }

  .entry-point-options {
    margin-top: 100px;
  }
}

@media (max-width: 640px) {
  .entry-point-header {
    height: 82px;
  }

  .entry-point-scene {
    min-height: 100vh;
    min-height: 100svh;
    padding: 106px 16px 32px;
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

  .entry-point-options,
  .entry-point-options--role {
    width: min(100%, 360px);
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
    margin-top: 48px;
  }

  .entry-point-option {
    height: 220px;
    border-radius: 32px;
    font-size: 18px;
    line-height: 28px;
  }

  .entry-point-footer {
    margin-top: 32px;
  }
}

@media (max-height: 760px) and (min-width: 641px) {
  .entry-point-options {
    margin-top: clamp(48px, calc(100vh - 672px), 140px);
  }

  .entry-point-option {
    height: clamp(240px, 43.6vh, 363px);
  }
}
</style>
