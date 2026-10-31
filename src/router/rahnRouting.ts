/**
 * @file rahnRouting.ts
 * @description Dynamic URL routing architecture, helpers, and taxonomy types for Pengajuan Rahn.
 * Enforces Requirement R2 (Dynamic URL Routing Architecture) and R1 (Usecase Taxonomy).
 */

export type UsecaseAction = 'entry' | 'preview' | 'update' | 'create'
export type StepNumber = 1 | 2 | 3 | 4 | 5
export type StepSlug =
  | 'data-pengajuan'
  | 'data-rahin'
  | 'data-jaminan'
  | 'fasilitas-pinjaman'
  | 'data-review'

export interface RahnRouteState {
  stepNumber: number // 1..5
  action: UsecaseAction
  id?: string
}

export interface StepUsecaseContext {
  stepNumber: StepNumber
  action: UsecaseAction
  id?: string
}

export interface RahnStepMeta {
  stepNumber: StepNumber
  title: string
  slug: StepSlug
  param: string
}

export const RAHN_STEP_DEFINITIONS: readonly RahnStepMeta[] = [
  { stepNumber: 1, title: 'Data Pengajuan', slug: 'data-pengajuan', param: 'step-1' },
  { stepNumber: 2, title: 'Data Rahin', slug: 'data-rahin', param: 'step-2' },
  { stepNumber: 3, title: 'Data Jaminan', slug: 'data-jaminan', param: 'step-3' },
  { stepNumber: 4, title: 'Fasilitas Pinjaman', slug: 'fasilitas-pinjaman', param: 'step-4' },
  { stepNumber: 5, title: 'Data Review', slug: 'data-review', param: 'step-5' },
] as const

const SLUG_TO_STEP: Readonly<Record<string, number>> = {
  'step-1': 1,
  '1': 1,
  'data-pengajuan': 1,
  'datapengajuan': 1,
  'step-2': 2,
  '2': 2,
  'data-rahin': 2,
  'datarahin': 2,
  'step-3': 3,
  '3': 3,
  'data-jaminan': 3,
  'datajaminan': 3,
  'step-4': 4,
  '4': 4,
  'fasilitas-pinjaman': 4,
  'fasilitaspinjaman': 4,
  'step-5': 5,
  '5': 5,
  'data-review': 5,
  'datareview': 5,
}

const VALID_ACTIONS: ReadonlySet<UsecaseAction> = new Set<UsecaseAction>([
  'entry',
  'preview',
  'update',
  'create',
])

/**
 * Parses raw step parameter (prefix 'step-X', number string '1'..'5', or slug) into integer 1..5.
 * Falls back to 1 for missing, empty, or invalid input.
 *
 * @param stepParam - Raw step representation from route parameters or string literal.
 * @returns Parsed step number (1..5).
 */
export function parseRahnStepParam(stepParam?: string | number | null): number {
  if (stepParam === null || stepParam === undefined) {
    return 1
  }

  if (typeof stepParam === 'number') {
    if (Number.isFinite(stepParam) && stepParam >= 1 && stepParam <= 5) {
      return Math.floor(stepParam)
    }
    return 1
  }

  const normalized = stepParam.trim().toLowerCase()
  if (!normalized) {
    return 1
  }

  return SLUG_TO_STEP[normalized] ?? 1
}

/**
 * Parses raw action parameter into standardized UsecaseAction ('entry' | 'preview' | 'update' | 'create').
 * Falls back to 'entry' for missing or unrecognized values.
 *
 * @param actionParam - Raw action string from route parameters.
 * @returns Validated UsecaseAction.
 */
export function parseRahnActionParam(actionParam?: string | null): UsecaseAction {
  if (!actionParam) {
    return 'entry'
  }

  const normalized = actionParam.trim().toLowerCase() as UsecaseAction
  return VALID_ACTIONS.has(normalized) ? normalized : 'entry'
}

/**
 * Parses route params object into validated RahnRouteState.
 *
 * @param params - Route params object from vue-router (`route.params`).
 * @returns Normalized route state containing stepNumber, action, and optional id.
 */
export function parseRahnRouteParams(
  params?: {
    step?: string | string[]
    action?: string | string[]
    id?: string | string[]
  } | null,
): RahnRouteState {
  if (!params) {
    return { stepNumber: 1, action: 'entry', id: undefined }
  }

  const rawStep = Array.isArray(params.step) ? params.step[0] : params.step
  const rawAction = Array.isArray(params.action) ? params.action[0] : params.action
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id

  const stepNumber = parseRahnStepParam(rawStep)
  const action = parseRahnActionParam(rawAction)
  const id = rawId && typeof rawId === 'string' && rawId.trim() !== '' ? rawId.trim() : undefined

  return { stepNumber, action, id }
}

/**
 * Generates canonical slash-based path for Pengajuan Rahn multi-step workflow.
 * Conforms to: `/pengajuan-rahn/step-:stepNumber/:action/:id?` and `/pengajuan-rahn/step-:stepNumber/entry`.
 *
 * @param step - Step number (1..5) or slug/param string.
 * @param action - UsecaseAction ('entry' | 'preview' | 'update' | 'create'). Defaults to 'entry'.
 * @param id - Optional record ID for preview or update action.
 * @returns Canonical URL path string.
 */
export function buildRahnPath(
  step: number | string = 1,
  action: UsecaseAction = 'entry',
  id?: string,
): string {
  let stepNumber: number
  if (typeof step === 'number') {
    if (Number.isFinite(step)) {
      stepNumber = Math.min(Math.max(Math.floor(step), 1), 5)
    } else {
      stepNumber = 1
    }
  } else {
    stepNumber = parseRahnStepParam(step)
  }

  const sanitizedAction = parseRahnActionParam(action)
  const stepSegment = `step-${stepNumber}`
  const trimmedId = id && typeof id === 'string' ? id.trim() : undefined

  if (trimmedId) {
    return `/pengajuan-rahn/${stepSegment}/${sanitizedAction}/${encodeURIComponent(trimmedId)}`
  }

  return `/pengajuan-rahn/${stepSegment}/${sanitizedAction}`
}
