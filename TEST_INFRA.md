# TEST_INFRA.md — SPRINT POS Tablet & Desktop Test Infrastructure

## 1. Executive Overview

This document specifies the test infrastructure and quality engineering framework for the **SPRINT POS Tablet & Desktop Alignment** project (`pos-tablet`). The test suite operates as an **opaque-box E2E testing track** running under Vitest, validating the visual specifications, interaction flow, interface contracts, layout responsiveness, and error handling defined in `PROJECT.md`, Figma node `336-55645` (Component Library), and Figma node `175-10074` (Mockup & Flow).

---

## 2. Testing Methodologies

The test architecture is designed around four formal software testing methodologies:

### 2.1 Category-Partition Method (Ostrand & Balcer)
Every feature input parameter is partitioned into distinct, non-overlapping equivalence classes. For example, for Credit Number input:
- *Partition A (Valid 16 digits)*: `"1234393948486060"`, `"1234 3939 4848 6060"`
- *Partition B (Malformed length)*: `""` (empty), `"1234"` (<16 digits), `"12345678901234567"` (>16 digits)
- *Partition C (Dirty inputs)*: `"1234-3939-4848-6060"`, `"1234abc3939def"`

### 2.2 Boundary Value Analysis (BVA)
Focuses on boundary edge values where defects cluster:
- **Nominal Bounds**: 0 vs 1 vs 15 vs 16 vs 17 digits.
- **Installment Bounds**: `0` (min invalid), `1` (min valid), `500_000` (nominal), `10_000_000` (max limit), `10_000_001` (overflow).
- **Spatial Viewport Bounds**: `1279px` (stacked mobile/tablet breakpoint), `1280px` (exact base tablet target), `1281px` (desktop fluid trigger), `1920px` (wide desktop).
- **Countdown Timer Bounds**: `01:25:32` (active), `00:00:01` (terminal tick), `00:00:00` (expiry transition), negative values (clamp).

### 2.3 Pairwise / Combinatorial Testing
Reduces combinatorial explosion of multi-select workflows while preserving maximum defect discovery.
- **Transaction Types (3)**: `'Sewa Modal'`, `'Cicil'`, `'Pelunasan'`
- **Payment Methods (4)**: `'bca-va'`, `'mandiri-va'`, `'bri-debit'`, `'merchant'`
- **Form States (4)**: Initial, Validated, Review Drawer, Terminal (Success/Failed)
- **Pairwise Coverage**: All pairs of Transaction Type × Payment Method × Installment Amount are explicitly verified across Tiers 3 & 4.

### 2.4 Real-World Workload Scenarios
End-to-end user journeys mirroring authentic POS cashier transactions:
- Complete settlement (`Pelunasan`) via Virtual Account with receipt printing.
- Partial principal repayment (`Cicil`) with dynamic installment calculation.
- Interest-only renewal (`Sewa Modal`) with bank direct debit.
- Failure recovery flow (expired timer -> failed view -> return home -> retry).
- User abandonment & state reset (navigate to Dashboard and resume).

---

## 3. Systematic 4-Tier Test Architecture

```
tests/pos-e2e/
├── harness/
│   └── pos-test-harness.ts               # Test harness, DOM/browser mocks, layout validator
├── tier1-feature-coverage.test.ts        # Tier 1: >=5 test cases per feature (Features 1-20)
├── tier2-boundary-corner.test.ts         # Tier 2: Boundary & Corner Cases (empty, limits, timer)
├── tier3-cross-feature-combinations.test.ts # Tier 3: Pairwise combinations & state transitions
└── tier4-real-world-scenarios.test.ts    # Tier 4: End-to-end user journeys & operational flows
```

---

## 4. Feature Inventory to Test Mapping (Features 1–20)

| Feature # | Feature Name | Tier 1 (Isolated >=5) | Tier 2 (Boundary) | Tier 3 (Combinations) | Tier 4 (Real-World) |
|---|---|---|---|---|---|
| **F1** | Canonical Design Tokens | T1-F01-01 to T1-F01-05 | T2-B01, T2-B02 | T3-C01 | T4-S01 |
| **F2** | Typography Alignment | T1-F02-01 to T1-F02-05 | T2-B03 | T3-C01 | T4-S01 |
| **F3** | CreditNumberField Component | T1-F03-01 to T1-F03-05 | T2-B04, T2-B05 | T3-C02 | T4-S01, T4-S02 |
| **F4** | TransactionTypePicker Component | T1-F04-01 to T1-F04-05 | T2-B06 | T3-C03, T3-C04 | T4-S01, T4-S03 |
| **F5** | InstallmentAmountField Component | T1-F05-01 to T1-F05-05 | T2-B07, T2-B08 | T3-C05 | T4-S02 |
| **F6** | PaymentMethodPicker Component | T1-F06-01 to T1-F06-05 | T2-B09 | T3-C03, T3-C06 | T4-S01, T4-S04 |
| **F7** | CreditDetailsCard Component | T1-F07-01 to T1-F07-05 | T2-B10 | T3-C07 | T4-S01, T4-S02 |
| **F8** | PaymentInstructionCard Component | T1-F08-01 to T1-F08-05 | T2-B11, T2-B12 | T3-C08 | T4-S01, T4-S03 |
| **F9** | PaymentResultView Coded Component | T1-F09-01 to T1-F09-05 | T2-B13 | T3-C09 | T4-S01, T4-S05 |
| **F10** | PaymentReviewDialog & Confirmation Drawer | T1-F10-01 to T1-F10-05 | T2-B14 | T3-C10 | T4-S01, T4-S02 |
| **F11** | Form Validation & Error States | T1-F11-01 to T1-F11-05 | T2-B15, T2-B16 | T3-C11 | T4-S04 |
| **F12** | Credit Lookup State Flow | T1-F12-01 to T1-F12-05 | T2-B17 | T3-C12 | T4-S01, T4-S02 |
| **F13** | Real-Time Fee Calculation | T1-F13-01 to T1-F13-05 | T2-B18, T2-B19 | T3-C13 | T4-S01, T4-S02 |
| **F14** | Payment Method Selection Flow | T1-F14-01 to T1-F14-05 | T2-B20 | T3-C14 | T4-S01, T4-S03 |
| **F15** | Confirmation Drawer Transition Flow | T1-F15-01 to T1-F15-05 | T2-B21 | T3-C15 | T4-S01, T4-S02 |
| **F16** | Payment Instruction & Countdown Flow | T1-F16-01 to T1-F16-05 | T2-B22, T2-B23 | T3-C16 | T4-S01, T4-S05 |
| **F17** | Terminal States Resolution | T1-F17-01 to T1-F17-05 | T2-B24 | T3-C17 | T4-S01, T4-S05 |
| **F18** | Tablet 1280px Spatial Layout | T1-F18-01 to T1-F18-05 | T2-B25 | T3-C18 | T4-S01 |
| **F19** | Fluid Desktop Scaling (>1280px) | T1-F19-01 to T1-F19-05 | T2-B26 | T3-C19 | T4-S01 |
| **F20** | Vertical Stacking for Narrow Viewports | T1-F20-01 to T1-F20-05 | T2-B27 | T3-C20 | T4-S06 |

---

## 5. Detailed Test Suite Specifications

### 5.1 Tier 1: Feature Coverage (>=5 test cases per feature)
- **F1 (Design Tokens)**: Canonical variable definitions, brand color mapping, grayscale surface tokens, divider tokens, border radius tokens.
- **F2 (Typography)**: Nunito and Nunito Sans declarations, dashboard/payment-flow font assignments, 600 and 800 weight mappings, header hierarchy, body hierarchy.
- **F3 (CreditNumberField)**: 16-digit input acceptance, chunking presentation, search button enabled/disabled state, search emit on click, search emit on Enter key.
- **F4 (TransactionTypePicker)**: Options enumeration (Sewa Modal, Cicil, Pelunasan), modal open state, value emit on selection, modal close on selection, disabled when no credit.
- **F5 (InstallmentAmountField)**: Numeric input binding, Indonesian currency formatting (`Rp`), max loan amount ceiling, positive step adjustments, model update emit.
- **F6 (PaymentMethodPicker)**: Method category accordion grouping, 4 distinct payment options, selection emit, modal dismiss, disabled when prior fields empty.
- **F7 (CreditDetailsCard)**: Summary loan breakdown rows, dynamic Total computation, mode stage switching (`'form'` vs `'instructions'` vs `'result'`), continue button enable/disable, print receipt action trigger.
- **F8 (PaymentInstructionCard)**: Countdown capsule formatting (`HH:MM:SS`), copyable Virtual Account number, clipboard copy trigger, accordion guide expansion, accordion collapse.
- **F9 (PaymentResultView)**: Semantic Vue component verification (no raster PNG), success state illustration & text, failed state illustration & text, transaction ID display, home/print action emissions.
- **F10 (PaymentReviewDialog & Drawer)**: 441px drawer dimension/styling, backdrop overlay render, data verification summary, cancel emit (`Periksa Lagi`), confirm emit (`Lanjutkan`).
- **F11 (Form Validation)**: Empty submission prevention, individual red border indicators (`#c34d36`), Indonesian error message text, error clearing on typing, complete form validation bypass.
- **F12 (Credit Lookup State)**: 16-digit lookup trigger, customer name hydration (`Bianca Putri`), loan metrics hydration, search reset on number modification, invalid lookup notification.
- **F13 (Real-Time Fee Calculation)**: Pelunasan fee formula (`principal + rent + service`), Sewa Modal fee formula (`0 + rent + service`), Cicil fee formula (`installment + rent + service`), dynamic installment update, zero/negative clamping.
- **F14 (Payment Method Selection Flow)**: Selection update on form pill, right summary card method update, bank emblem render, channel category tagging, direct debit connectivity prompt.
- **F15 (Confirmation Drawer Transition)**: Slide animation class/style, backdrop click dismiss, modal dismiss button, transaction commitment transition, preservation of form state on cancel.
- **F16 (Payment Instruction & Countdown)**: Live timer tick calculation, expiry transition signal, VA clipboard copy success toast, guide step navigation, status refresh trigger.
- **F17 (Terminal States Resolution)**: Success state view activation, transaction ID copy action, print action in new tab, failed state view activation, back to dashboard redirection.
- **F18 (Tablet 1280px Spatial Layout)**: Header height (72px), sidebar width (248px), main canvas width (1032px), left form card width (569px), column gap (15px), right summary card width (400px), net grid width (984px).
- **F19 (Fluid Desktop Scaling >1280px)**: Left column flex expansion (`flex: 1 1 569px`), right column fixed anchor (400px), removal of 1152px restrictive container constraints, zero dead margin accumulation at 1440px/1920px.
- **F20 (Vertical Stacking <1280px)**: Single column breakpoint behavior (`1fr`), summary card positioned below form, no horizontal clipping, responsive fluid width.

### 5.2 Tier 2: Boundary & Corner Cases
- Input boundary tests: empty string `""`, whitespace only `"   "`, non-numeric characters `"abc@#$"`.
- Digits boundary tests: 15 digits (rejected), 16 digits (accepted), 17 digits (clamped/rejected).
- Monetary bounds: `Rp0`, `Rp1`, negative installments `Rp-500.000` (clamped to 0), `installment > loanAmount` (clamped to `loanAmount`).
- Timer boundary conditions: exact expiration `00:00:00`, single-digit hours `01:05:09`, timer clock freeze prevention.
- Viewport width boundaries: `1279px` (stacked), `1280px` (2-column base), `1281px` (fluid desktop), `2560px` (4K ultrawide).

### 5.3 Tier 3: Cross-Feature Combinations
- Exhaustive 3×4 matrix:
  - Pelunasan × BCA VA, Mandiri VA, BRI Direct Debit, Bayar di Merchant.
  - Cicil × BCA VA, Mandiri VA, BRI Direct Debit, Bayar di Merchant.
  - Sewa Modal × BCA VA, Mandiri VA, BRI Direct Debit, Bayar di Merchant.
- State mutation and recovery:
  - User searches credit -> selects Cicil -> enters amount -> switches to Sewa Modal -> installment field hides and total recalculates.
  - User opens Confirmation Drawer -> clicks Periksa Lagi -> changes payment channel -> re-opens Confirmation Drawer -> summary reflects updated channel.

### 5.4 Tier 4: Real-World Scenarios
- **Scenario 1**: Full Settlement Happy Path (Lookup `1234 3939 4848 6060` -> Select `Pelunasan` -> Select `BCA VA` -> Review Drawer -> Instructions with countdown -> Status Polling -> Success View -> Print Receipt).
- **Scenario 2**: Partial Installment Repayment (Lookup -> Select `Cicil` -> Custom Rp1.500.000 -> Select `Mandiri VA` -> Review -> Instructions -> Success).
- **Scenario 3**: Rental Fee Renewal (Lookup -> Select `Sewa Modal` -> Total = Rp142.500 -> Select `BRI Direct Debit` -> Instructions -> Success).
- **Scenario 4**: Timeout / Expiry Journey (Lookup -> Select `Pelunasan` -> Instruction screen -> Timer hits 00:00:00 -> Failed State Screen -> Click Kembali ke Beranda).
- **Scenario 5**: Cashier Session Navigation & Reset (Partially fill form -> Click Breadcrumb Back -> Re-open Bayar Gadai -> Pristine initial state).

---

## 6. Execution and Verification Guide

### 6.1 Running the POS E2E Test Suite
```bash
# Run entire test suite (including existing and POS E2E tests)
pnpm test

# Run POS E2E test suite specifically
pnpm vitest run tests/pos-e2e/

# Run specific tier
pnpm vitest run tests/pos-e2e/tier1-feature-coverage.test.ts
pnpm vitest run tests/pos-e2e/tier2-boundary-corner.test.ts
pnpm vitest run tests/pos-e2e/tier3-cross-feature-combinations.test.ts
pnpm vitest run tests/pos-e2e/tier4-real-world-scenarios.test.ts

# Run with verbose test reporting
pnpm vitest run tests/pos-e2e/ --reporter=verbose
```

### 6.2 Quality Gates & Acceptance Criteria
- **Coverage**: 100% of the 20 features mapped to executable assertions.
- **Isolation**: Each test operates independently without order dependencies.
- **Performance**: Full test suite completes execution within <3 seconds.
- **Determinism**: 0 flaky tests, reproducible across local environment and CI/CD pipelines.
