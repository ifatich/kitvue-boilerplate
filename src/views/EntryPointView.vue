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
}

const props = withDefaults(defineProps<{ stage?: EntryPointStage }>(), {
  stage: 'teams',
})

const router = useRouter()
const route = useRoute()

const teams: TeamOption[] = [
  { id: 'team-1', label: 'Tim 1', description: 'Kanwil Bandung', kanwil: 'Bandung', tier: 'Tier 1' },
  { id: 'team-2', label: 'Tim 2', description: 'Kanwil Denpasar', kanwil: 'Denpasar', tier: 'Tier 2' },
  { id: 'team-3', label: 'Tim 3', description: 'Kanwil XXX', kanwil: 'XXX', tier: 'Tier 3' },
]

const branchesByTeam: Record<string, BranchOption[]> = {
  'team-1': [
    { id: 'bdg-cbg-a', label: 'bdg-cbg-a', description: 'Cabang A (Urban)', shortLabel: 'Cabang A', tier: 'Urban' },
    { id: 'bdg-cbg-b', label: 'bdg-cbg-b', description: 'Cabang B (Sub Urban)', shortLabel: 'Cabang B', tier: 'Sub Urban' },
    { id: 'bdg-cbg-c', label: 'bdg-cbg-c', description: 'Cabang C (Rural)', shortLabel: 'Cabang C', tier: 'Rural' },
  ],
  'team-2': [
    { id: 'dps-cbg-a', label: 'dps-cbg-a', description: 'Cabang A (Urban)', shortLabel: 'Cabang A', tier: 'Urban' },
    { id: 'dps-cbg-b', label: 'dps-cbg-b', description: 'Cabang B (Sub Urban)', shortLabel: 'Cabang B', tier: 'Sub Urban' },
    { id: 'dps-cbg-c', label: 'dps-cbg-c', description: 'Cabang C (Rural)', shortLabel: 'Cabang C', tier: 'Rural' },
  ],
  'team-3': [
    { id: 'xxx-cbg-a', label: 'xxx-cbg-a', description: 'Cabang A (Urban)', shortLabel: 'Cabang A', tier: 'Urban' },
    { id: 'xxx-cbg-b', label: 'xxx-cbg-b', description: 'Cabang B (Sub Urban)', shortLabel: 'Cabang B', tier: 'Sub Urban' },
    { id: 'xxx-cbg-c', label: 'xxx-cbg-c', description: 'Cabang C (Rural)', shortLabel: 'Cabang C', tier: 'Rural' },
  ],
}

const roles: EntryPointOption[] = [
  { id: 'Kasir', label: 'Kasir' },
  { id: 'Penaksir', label: 'Penaksir' },
  { id: 'Pinca', label: 'Pinca' },
  { id: 'CRO', label: 'CRO' },
]

/**
 * Task definitions for Scenario 1 through 6
 * Derived from Figma Node 598:46219 and Node 625:403725
 */
const sceneTasks: Record<number, EntryPointOption[]> = {
  1: [
    { id: 'task-1', label: 'Task 1', description: 'P. Gadai (Non Stepper)', targetRoute: '/gadai-1-page', requiresLogin: true },
    { id: 'task-2', label: 'Task 2', description: 'Beranda Opsi 2', targetRoute: '/sprint-proto-2', requiresLogin: true },
    { id: 'task-3', label: 'Task 3', description: 'POS', targetRoute: '/pos', requiresLogin: false },
  ],
  2: [
    { id: 'task-1', label: 'Task 1', description: 'P. Gadai (Non Stepper)', targetRoute: '/gadai-1-page', requiresLogin: true },
    { id: 'task-2', label: 'Task 2', description: 'Beranda Opsi 1', targetRoute: '/sprint-proto-1', requiresLogin: true },
    { id: 'task-3', label: 'Task 3', description: 'POS', targetRoute: '/pos', requiresLogin: false },
  ],
  3: [
    { id: 'task-1', label: 'Task 1', description: 'P. Gadai (Stepper)', targetRoute: '/pengajuan-gadai', requiresLogin: true },
    { id: 'task-2', label: 'Task 2', description: 'Beranda Opsi 2', targetRoute: '/sprint-proto-2', requiresLogin: true },
    { id: 'task-3', label: 'Task 3', description: 'POS', targetRoute: '/pos', requiresLogin: false },
  ],
  4: [
    { id: 'task-1', label: 'Task 1', description: 'P. Gadai (Stepper)', targetRoute: '/pengajuan-gadai', requiresLogin: true },
    { id: 'task-2', label: 'Task 2', description: 'Beranda Opsi 1', targetRoute: '/sprint-proto-1', requiresLogin: true },
    { id: 'task-3', label: 'Task 3', description: 'POS', targetRoute: '/pos', requiresLogin: false },
  ],
  5: [
    { id: 'task-1', label: 'Task 1', description: 'Beranda Eksisting', targetRoute: '/sprint-existing', requiresLogin: true },
    { id: 'task-2', label: 'Task 2', description: 'Beranda Opsi 2', targetRoute: '/sprint-proto-2', requiresLogin: true },
    { id: 'task-3', label: 'Task 3', description: 'POS', targetRoute: '/pos', requiresLogin: false },
  ],
  6: [
    { id: 'task-1', label: 'Task 1', description: 'Beranda Eksisting', targetRoute: '/sprint-existing', requiresLogin: true },
    { id: 'task-2', label: 'Task 2', description: 'Beranda Opsi 1', targetRoute: '/sprint-proto-1', requiresLogin: true },
    { id: 'task-3', label: 'Task 3', description: 'POS', targetRoute: '/pos', requiresLogin: false },
  ],
}

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

  // Backward compatibility fallback for legacy CP X / Y / Z
  if (queryCp.toUpperCase().includes('X') || queryCp.toUpperCase().includes('A')) return availableBranches.value[0]
  if (queryCp.toUpperCase().includes('Y') || queryCp.toUpperCase().includes('B')) return availableBranches.value[1]
  if (queryCp.toUpperCase().includes('Z') || queryCp.toUpperCase().includes('C')) return availableBranches.value[2]
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
 * Computes exact Scene (1 to 6) based on Scenario Matrix:
 * Kanwil A (Bandung): Urban (A) -> S1/S5, Sub Urban (B) -> S2/S6, Rural (C) -> S3/S5
 * Kanwil B (Denpasar): Urban (A) -> S1/S6, Sub Urban (B) -> S2/S5, Rural (C) -> S3/S6
 * Kanwil C (XXX): Urban (A) -> S4/S5, Sub Urban (B) -> S4/S6, Rural (C) -> S4/S5
 */
const currentScene = computed<number>(() => {
  const teamId = selectedTeam.value.id
  const branchId = selectedBranch.value.id
  const isLeadership = isLeadershipRole.value

  // Tim 1: Kanwil Bandung
  if (teamId === 'team-1') {
    if (branchId.endsWith('-a')) return isLeadership ? 5 : 1
    if (branchId.endsWith('-b')) return isLeadership ? 6 : 2
    if (branchId.endsWith('-c')) return isLeadership ? 5 : 3
  }

  // Tim 2: Kanwil Denpasar
  if (teamId === 'team-2') {
    if (branchId.endsWith('-a')) return isLeadership ? 6 : 1
    if (branchId.endsWith('-b')) return isLeadership ? 5 : 2
    if (branchId.endsWith('-c')) return isLeadership ? 6 : 3
  }

  // Tim 3: Kanwil XXX
  if (teamId === 'team-3') {
    if (branchId.endsWith('-a')) return isLeadership ? 5 : 4
    if (branchId.endsWith('-b')) return isLeadership ? 6 : 4
    if (branchId.endsWith('-c')) return isLeadership ? 5 : 4
  }

  return 1
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
    title: `ROLE CP [${selectedBranch.value.label}] - Kanwil ${selectedTeam.value.kanwil} - ${selectedBranch.value.shortLabel} (${selectedBranch.value.tier})`,
    options: roles,
  },
  tasks: {
    title: `Task [${currentRole.value.label}] CP [${selectedBranch.value.label}] - Kanwil ${selectedTeam.value.kanwil} - ${selectedBranch.value.shortLabel} (${selectedBranch.value.tier} - Scene ${currentScene.value})`,
    options: sceneTasks[currentScene.value] ?? sceneTasks[1],
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
    const targetRoute = option.targetRoute ?? '/sprint-proto-1'
    if (option.requiresLogin) {
      void router.push({
        path: '/login',
        query: {
          role: currentRole.value.id,
          redirect: targetRoute,
        },
      })
    } else {
      void router.push(targetRoute)
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
