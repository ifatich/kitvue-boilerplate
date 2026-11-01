# Project: SPRINT POS Tablet & Desktop Alignment

## Architecture
- **Workspace Architecture**: Dedicated pnpm package `pos-tablet` located at `/Users/lord/Documents/kitvue-boilerplate/POS`.
- **Framework & Libraries**: Vue 3.5 (Composition API `<script setup>`), Vite 6, TypeScript 5.7, Vue Router 4, `kitvue-public` (1.0.5), `bootstrap-vue-next` (0.16.6).
- **Design System & Styling**: SPRINT Single UI design system. Canonical token variables (`--g-kit-*`), Nunito typography for the dashboard and Nunito Sans for the payment flow (font weights 600 and 800), card containers with 24px border radius, 4px section dividers, 1px item dividers.
- **Entry Points & Routing**:
  - `POS/main.ts` mounts `App.vue` with Vue Router onto `#pos-app`.
  - Routes: `/` -> `DashboardPage.vue`, `/pembayaran-gadai` -> `pembayaran-gadai/PembayaranGadaiPage.vue`.
  - Development port: `5175` (`pnpm pos:dev` / `pnpm --filter pos-tablet dev`).
  - Build & Typecheck: `pnpm pos:build`, `pnpm pos:type-check`.

## Feature Inventory
Every feature from the Survey phase appears here with its assigned milestone.

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Canonical Design Tokens | Replace `--pos-*` variables with canonical `--g-kit-*` tokens (`--g-kit-emerald-50`, `--g-kit-lime-50`, `--g-kit-black-80`, etc.) in `POS/style.css` and component styles | M1 | survey (components & codebase) |
| 2 | Typography Alignment | Load Nunito and Nunito Sans in `POS/index.html`; use Nunito for the dashboard and Nunito Sans for the payment flow, with aligned weights (600 semi-bold, 800 extra bold) and typography scales | M1 | survey (components & codebase) |
| 3 | CreditNumberField Component | 16-digit credit number input, 4-digit whitespace chunking, search button with active/disabled states (`#cbcbcd` -> `#004d43`) | M1 | survey (components & flow) |
| 4 | TransactionTypePicker Component | Trigger selector and 360px popup dialog with options: "Bayar Sewa Modal", "Cicil", "Pelunasan" | M1 | survey (components & flow) |
| 5 | InstallmentAmountField Component | Formatted currency input for partial installment amount when "Cicil" is selected | M1 | survey (components & flow) |
| 6 | PaymentMethodPicker Component | Trigger selector and 454px categorized modal (Rekomendasi, Instan, VA, Direct Debit, Lain) | M1 | survey (components & flow) |
| 7 | CreditDetailsCard Component | Summary card (400px) displaying loan breakdown (Uang Pinjaman, Sewa Modal, Biaya Layanan, Total) and action button | M1 | survey (components & flow) |
| 8 | PaymentInstructionCard Component | Instruction card with countdown timer capsule (`#f15f43`), copyable VA number box, and tutorial accordion | M1 | survey (components & flow) |
| 9 | PaymentResultView Coded Component | Replace raster PNG placeholder (`result-success.png`, `result-failure.png`) with fully coded Vue components using SVG illustrations, transaction details, and action buttons | M1 | survey (codebase & components) |
| 10 | PaymentReviewDialog & Confirmation Drawer | Slide-in 441px confirmation drawer / modal (`Container Konfirmasi`) with transaction summary, backdrop overlay, and action buttons | M1 | survey (components & flow) |
| 11 | Form Validation & Error States | Synchronous field validation on submission: red borders (`#c34d36`) and Indonesian error messages for empty fields | M2 | survey (flow) |
| 12 | Credit Lookup State Flow | Dynamic lookup of 16-digit credit contract (`1234 3939 4848 6060`), customer data hydration (`Bianca Putri`), and loan metrics | M2 | survey (flow & codebase) |
| 13 | Real-Time Fee Calculation | Reactive calculation of principal, rent fee, and service charges across transaction types (Pelunasan, Cicil, Sewa Modal) | M2 | survey (flow & codebase) |
| 14 | Payment Method Selection Flow | Selection of payment channel (e.g. BCA Virtual Account), updating form pill and summary card with bank logo | M2 | survey (flow) |
| 15 | Confirmation Drawer Transition Flow | Smooth slide-in animation (`translateX(100%)` -> `0`), overlay interaction, dismiss on backdrop/cancel, proceed to payment | M2 | survey (flow) |
| 16 | Payment Instruction & Countdown Flow | Live countdown timer (e.g. `01:25:32`), VA clipboard copy with feedback toast, accordion step toggle | M2 | survey (flow) |
| 17 | Terminal States Resolution | Success state transition (`IllustrationFlowSuccess`, copyable TRX ID, print receipt in new tab) and Failure state transition | M2 | survey (flow) |
| 18 | Tablet 1280px Spatial Layout | Base 1280px tablet layout: Header (72px), Sidebar (248px), 2-column grid (569px form + 15px gap + 400px summary = 984px net content) | M3 | survey (flow & codebase) |
| 19 | Fluid Desktop Scaling (>1280px) | Fluid scaling on viewports > 1280px: left card expands (`flex: 1 1 569px`), right card anchors at 400px, removing 1152px dead margins | M3 | survey (flow & codebase) |
| 20 | Vertical Stacking for Narrow Viewports | Graceful stacking of two-column layout on screens < 1280px into single column without clipping or horizontal overflow | M3 | survey (flow) |
| 21 | Full E2E Test Suite (Tiers 1-4) | Comprehensive opaque-box test suite verifying all 20 features across isolated, boundary, combinatorial, and user journey scenarios | M4 | E2E Testing Track |
| 22 | Adversarial Hardening (Tier 5) | White-box adversarial test cases targeting race conditions, extreme input values, rapid state transitions, and edge cases | M4 | E2E Testing Track |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Local POS Component Audit & Alignment | Audit and update all local POS components (`POS/pembayaran-gadai/components/*`), migrate tokens to `--g-kit-*`, align fonts to each screen's design, replace raster PNGs in `PaymentResultView.vue` with semantic Vue components | none | DONE |
| M2 | Mockup Application & Interaction Flow | Implement complete user flow in `PembayaranGadaiPage.vue`: validation states, search, fee calculation, modals, drawer transition, countdown/instruction stage, and end states | M1 | DONE |
| M3 | Responsive Layout Adaptation | Implement 1280px tablet base layout and fluid desktop scaling (>1280px) in `POS/style.css` and `POS/pembayaran-gadai/style.css`, eliminating excessive whitespace | M1, M2 | DONE |
| M4 | Final E2E Test Pass & Hardening | Pass 100% of E2E test suite (Tiers 1-4) from E2E Testing Track, execute Tier 5 adversarial hardening, verify zero console errors, clean type-check and build | M1, M2, M3 | DONE |

## Interface Contracts

### M1 (Components) <-> M2 (Flow Page)
- **`CreditNumberField.vue`**:
  - Props: `modelValue: string`, `error?: string`, `loading?: boolean`, `disabled?: boolean`
  - Emits: `update:modelValue(val: string)`, `search()`
- **`TransactionTypePicker.vue`**:
  - Props: `modelValue: TransactionType | null`, `error?: string`, `disabled?: boolean`
  - Emits: `update:modelValue(val: TransactionType)`
- **`PaymentMethodPicker.vue`**:
  - Props: `modelValue: PaymentMethod | null`, `error?: string`, `disabled?: boolean`
  - Emits: `update:modelValue(val: PaymentMethod)`
- **`InstallmentAmountField.vue`**:
  - Props: `modelValue: number`, `maximum: number`, `error?: string`
  - Emits: `update:modelValue(val: number)`
- **`CreditDetailsCard.vue`**:
  - Props: `summary: PaymentSummary`, `hasCredit: boolean`, `stage: 'form' | 'instructions' | 'result'`, `loading?: boolean`
  - Emits: `continue()`, `refresh()`, `home()`, `print()`
- **`PaymentReviewDialog.vue` (or `KonfirmasiPembayaranDrawer.vue`)**:
  - Props: `open: boolean`, `summary: PaymentSummary`
  - Emits: `close()`, `confirm()`
- **`PaymentInstructionCard.vue`**:
  - Props: `summary: PaymentSummary`, `expiredAt?: number`
  - Emits: `expired()`, `copy(code: string)`
- **`PaymentResultView.vue`**:
  - Props: `status: 'success' | 'failed'`, `summary: PaymentSummary`, `transactionId: string`, `errorMessage?: string`
  - Emits: `home()`, `print()`

### M2 (Flow Page) <-> M3 (Layout)
- `.pgd-page`: Container wrapper with fluid width up to max available space.
- `.pgd-flow-grid`: Two-column CSS grid or flexbox: Left column `flex: 1 1 569px; min-width: 0;`, Right column `flex: 0 0 400px;`.
- At viewport < 1280px: grid switches to single-column stacking (`1fr`).

## Code Layout
- `POS/`
  - `index.html` (HTML shell, font links)
  - `main.ts` (App entry)
  - `router.ts` (Routes)
  - `style.css` (Global design tokens `--g-kit-*`, canvas layout, base utilities)
  - `DashboardPage.vue` (Dashboard view)
  - `components/` (PosHeader, PosSidebar, PosMetricCard, PosGoldCard, PosWeeklyChart)
  - `pembayaran-gadai/`
    - `PembayaranGadaiPage.vue` (Main transaction flow view)
    - `data.ts` (Mock data and calculations)
    - `payment-types.ts` (TypeScript interfaces and types)
    - `style.css` (Flow-specific styles and responsive layouts)
    - `components/`
      - `CreditNumberField.vue`
      - `TransactionTypePicker.vue`
      - `InstallmentAmountField.vue`
      - `PaymentMethodPicker.vue`
      - `CreditDetailsCard.vue`
      - `PaymentInstructionCard.vue`
      - `PaymentReviewDialog.vue`
      - `PaymentResultView.vue`
      - `PaymentButton.vue`
      - `PaymentDialog.vue`
- `tests/pos-e2e/` (Created by E2E Testing Track)
  - `test-runner.ts` / Vitest test specs for POS flow and responsive behavior
