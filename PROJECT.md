# Project: Pengajuan Rahn Multi-Step Workflow Standardization

## Architecture
- **Framework & Runtime**: Vue 3.5 (`<script setup lang="ts">`), Vite 6, TypeScript 5.7, Vue Router 4.5.
- **Routing Engine**: Dynamic slash-based URL routing via `src/router/rahnRouting.ts` supporting `/pengajuan-rahn/:step?/:action?/:id?` with backward-compatible aliases `['/pengajuan/rahn/:step?/:action?/:id?', '/rahn/:step?/:action?/:id?']`.
- **Bidirectional Synchronization**: `PengajuanRahnView.vue` synchronizes route parameters (`step`, `action`, `id`) with local component state and stepper view using an `isSyncingFromRoute` lock to eliminate navigation loops.
- **Usecase Taxonomy**: 4 canonical use case states across all steps:
  - `entry`: Default search, table, or initial step form.
  - `preview`: Read-only detail view (`:is-read-only="true"` / disabled inputs).
  - `update`: Editable detail view for existing records (`:disabled="false"`).
  - `create`: Blank editable form for new entry.
- **Step 2 Modal & Transition Architecture**:
  - Complete removal of CIF conversion modal (`RahinCreateCifModal.vue`).
  - Integration of `RahinSaveSuccessModal.vue` adhering to `--g-kit-*` design tokens, 156px celebration SVG checkmark, and advancing stepper to Step 3 ("Data Jaminan").
- **Styling**: Pegadaian Design System `--g-kit-*` custom properties, Bootstrap 5.3 utilities. Zero Tailwind CSS.

---

## Feature Inventory

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Dynamic Slash-Based Route Pattern | Support `/pengajuan-rahn/:step?/:action?/:id?` with backward compatibility and alias routes (`/pengajuan/rahn`, `/rahn`) | M1 | R2, Explorer Routes |
| 2 | Step Parameter Parser & Builder | Inbound parsing of `step-1`..`step-5`, numbers, and semantic slugs (`data-pengajuan`..`data-review`) with canonical path builder `buildRahnPath` | M1 | R2, Explorer Routes |
| 3 | Route Action Sanitizer | Standardized parsing of `entry`, `preview`, `update`, `create` with fallback to `entry` | M1 | R1, R2, Explorer Routes |
| 4 | Base Route Defaulting | Navigating to `/pengajuan-rahn` defaults to Step 1 in `entry` mode without router errors | M1 | AC, Explorer Routes |
| 5 | Dedicated Router Unit Test Suite | Vitest tests in `tests/rahnRouting.test.ts` verifying path resolution, param parsing, aliases, and guard redirects | M1 | AC, Explorer Routes |
| 6 | Usecase Taxonomy Type Definitions | Standardized `UsecaseAction`, `StepNumber`, `StepSlug`, and `StepUsecaseContext` in `src/router/rahnRouting.ts` | M2 | R1, Explorer Usecases |
| 7 | Bidirectional Synchronizer & Loop Guard | Route-to-state and state-to-route synchronization in `PengajuanRahnView.vue` with `isSyncingFromRoute` guard | M2 | R2, Explorer Routes/Usecases |
| 8 | Step 1 Usecase Standardization | Map `entry` to search card/table, `preview` to read-only BO details, `update` to editable BO details, and `create` to empty new BO | M2 | R1, Explorer Usecases |
| 9 | Step 1 Read-Only Form Disabling | Setting `preview` mode disables 100% of Beneficial Owner detail form fields via `:disabled="true"` on Kitvue inputs | M2 | R1, AC, Explorer Usecases |
| 10 | Step 2 Usecase Standardization | Map `entry` to search card/CIF table, `preview` to read-only CIF details (`selectionMode='terpilih'`), `update` to editable CIF details (`selectionMode='pilih'`), `create` to empty new Rahin (`selectionMode='tambah'`) | M2 | R1, Explorer Usecases |
| 11 | Step 2 Read-Only Form Disabling | Setting `preview` mode enforces `isFullDisabled = true` across all Rahin detail sections | M2 | R1, AC, Explorer Usecases |
| 12 | Record ID (`:id?`) Lookup Helpers | `findBeneficialOwnerById` and `findRahinCifById` to resolve records from route ID parameter | M2 | R1, Explorer Usecases |
| 13 | Stepper Transition URL Updating | Stepper next/prev transitions and table selection events dynamically update browser URL path | M2 | AC, Explorer Routes/Usecases |
| 14 | CIF Conversion Modal Elimination | Completely remove `RahinCreateCifModal.vue` and its trigger flows from `Step2RahinContent.vue` and DOM | M3 | R3, Explorer Step 2 Modals |
| 15 | Case 1 Konvensional CIF Direct Detail | Selecting Konvensional CIF advances directly to detail view without modal interruption | M3 | R3, Explorer Step 2 Modals |
| 16 | Rahin Save Success Modal Component | `RahinSaveSuccessModal.vue` with title "Data Rahin Berhasil Disimpan", desc "Data Rahin Berhasil Disimpan. Silakan lanjutkan ke data jaminan.", and button "Lanjutkan ke Data Jaminan" | M3 | R3, Explorer Step 2 Modals |
| 17 | Validation & Save Trigger Flow | Submitting valid Data Rahin displays the success modal and halts auto-advance until button clicked | M3 | R3, AC, Explorer Step 2 Modals |
| 18 | Advance to Step 3 Transition | Clicking "Lanjutkan ke Data Jaminan" closes modal and advances stepper to Step 3 ("Data Jaminan") | M3 | R3, AC, Explorer Step 2 Modals |
| 19 | Modal Regression Test Updates | Update `tests/modalToPageFlow.test.ts`, `tests/pengajuanRahnStep2TableFlow.test.ts`, and `tests/pengajuanRahnStep2M3.test.ts` for success modal assertions | M3 | AC, Explorer Step 2 Modals |
| 20 | Full Verification & Forensic Audit | Zero TypeScript errors (`npm run type-check`), zero lint errors (`npm run lint`), passing Vitest suite (`npm run test`), Reviewer approval, Challenger assertions, Auditor CLEAN verdict | M4 | Integrity Protocol |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Dynamic URL Routing Architecture | `src/router/rahnRouting.ts`, `src/router/index.ts`, `tests/rahnRouting.test.ts` | none | DONE |
| M2 | Usecase Taxonomy Standardization & Bidirectional Sync | `src/views/PengajuanRahnView.vue`, `Step1PengajuanContent.vue`, `Step2RahinContent.vue`, tests for taxonomy & disabled states | M1 | DONE |
| M3 | Step 2 Modal Removal & Success Modal Advance to Step 3 | `RahinSaveSuccessModal.vue`, removal of `RahinCreateCifModal.vue` from Step 2, `Step2RahinContent.vue` modal integration, test suite updates | M1, M2 | DONE |
| M4 | Final Review, Adversarial Challenges & Forensic Audit | Full verification of all acceptance criteria: 2 Reviewers, 2 Challengers, 1 Forensic Integrity Auditor (`teamwork_auditor`), build & type-check | M1, M2, M3 | DONE |

---

## Interface Contracts

### `src/router/rahnRouting.ts`
```typescript
export type UsecaseAction = 'entry' | 'preview' | 'update' | 'create'

export interface RahnRouteState {
  stepNumber: number // 1..5
  action: UsecaseAction
  id?: string
}

export function parseRahnStepParam(stepParam?: string | null): number
export function parseRahnActionParam(actionParam?: string | null): UsecaseAction
export function parseRahnRouteParams(params: {
  step?: string | string[]
  action?: string | string[]
  id?: string | string[]
}): RahnRouteState
export function buildRahnPath(
  step: number | string,
  action?: UsecaseAction,
  id?: string,
): string
```

### Route Declarations in `src/router/index.ts`
```typescript
{
  path: '/pengajuan-rahn/:step?/:action?/:id?',
  name: 'pengajuan-rahn',
  component: () => import('../views/PengajuanRahnView.vue'),
  alias: [
    '/pengajuan/rahn/:step?/:action?/:id?',
    '/rahn/:step?/:action?/:id?',
  ],
  meta: { requiresAuth: true },
}
```

### `RahinSaveSuccessModal.vue`
```vue
<script setup lang="ts">
defineProps<{
  modelValue?: boolean
  isMobile?: boolean
  buttonLabel?: string
  title?: string
  desc?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'continue'): void
}>()
</script>
```

---

## Code Layout
```
src/
├── router/
│   ├── index.ts                     # Route registrations with dynamic parameters & aliases
│   └── rahnRouting.ts               # Routing helpers, parsers, and taxonomy types
├── components/
│   ├── modules/
│   │   └── rahn/
│   │       ├── index.ts             # Export hub
│   │       ├── mockBeneficialOwnerData.ts
│   │       ├── mockRahinData.ts
│   │       ├── step-1/
│   │       │   └── Step1PengajuanContent.vue
│   │       └── step-2/
│   │           ├── Step2RahinContent.vue
│   │           └── modals/
│   │               ├── RahinSaveSuccessModal.vue   # NEW Success Modal
│   │               └── RahinCreateCifModal.vue     # Purged / removed from Step 2
└── views/
    └── PengajuanRahnView.vue        # Multi-step shell view with bidirectional URL sync
tests/
├── rahnRouting.test.ts              # NEW router & path synchronizer tests
├── modalToPageFlow.test.ts          # Updated modal assertions
├── pengajuanRahnStep2TableFlow.test.ts # Updated table & advance assertions
└── pengajuanRahnStep2M3.test.ts     # Updated component definition assertions
```
