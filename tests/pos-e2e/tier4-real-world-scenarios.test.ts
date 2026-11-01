import { describe, it, expect, beforeEach } from 'vitest'
import {
  PosFlowStateMachine,
  PosBrowserSimulator,
  formatCountdownTimer,
  formatCurrencyIdr,
  formatCreditNumber,
  calculateLayoutGeometry,
} from './harness/pos-test-harness'
import { mockCreditRecord, paymentMethods } from '../../POS/pembayaran-gadai/data'

describe('Tier 4: Real-World Scenarios (End-to-End User Journeys)', () => {
  let sim: PosBrowserSimulator
  let machine: PosFlowStateMachine

  beforeEach(() => {
    sim = new PosBrowserSimulator()
    machine = new PosFlowStateMachine()
  })

  // -------------------------------------------------------------
  // Scenario 1: Complete Happy Path Full Settlement (Pelunasan via BCA VA -> Print Receipt)
  // -------------------------------------------------------------
  it('T4-SC01: Complete Happy Path Full Settlement with BCA Virtual Account and Receipt Print', async () => {
    // 1. Initial page load on 1280px tablet
    const layout = calculateLayoutGeometry(1280)
    expect(layout.netGridWidth).toBe(984)
    expect(layout.leftCardWidth).toBe(569)
    expect(layout.rightCardWidth).toBe(400)
    expect(machine.stage).toBe('form')
    expect(machine.hasCredit).toBe(false)

    // 2. Cashier inputs raw credit number and searches
    machine.inputCreditNumber('1234 3939 4848 6060')
    const searchResult = machine.searchCredit()
    expect(searchResult).toBe(true)
    expect(machine.hasCredit).toBe(true)
    expect(machine.summary.customer).toBe('Bianca Putri')
    expect(machine.summary.loanAmount).toBe(10_000_000)

    // 3. Cashier selects "Pelunasan"
    machine.selectTransactionType('Pelunasan')
    expect(machine.summary.total).toBe(10_142_500)
    expect(formatCurrencyIdr(machine.summary.total)).toBe('Rp10.142.500')

    // 4. Cashier selects "BCA Virtual Account"
    const bca = paymentMethods.find((m) => m.id === 'bca-va')!
    machine.selectPaymentMethod(bca)
    expect(machine.canContinue).toBe(true)
    expect(machine.summary.paymentMethod?.bank).toBe('BCA')

    // 5. Cashier clicks "Lanjutkan" -> Drawer opens
    const drawerOpened = machine.continueToReview()
    expect(drawerOpened).toBe(true)
    expect(machine.reviewOpen).toBe(true)
    expect(machine.summary.total).toBe(10_142_500)

    // 6. Cashier confirms drawer -> enters instruction stage
    machine.confirmReview()
    expect(machine.reviewOpen).toBe(false)
    expect(machine.stage).toBe('instructions')

    // 7. Instruction stage renders countdown timer & VA code
    const timerDisplay = formatCountdownTimer(5132)
    expect(timerDisplay).toBe('01:25:32')

    const vaCode = '0130 8361 8000 6879'
    await navigator.clipboard.writeText(vaCode)
    expect(sim.clipboardText).toBe(vaCode)

    // 8. Payment settlement succeeds -> moves to result success
    machine.finishPayment('success')
    expect(machine.stage).toBe('result')
    expect(machine.resultStatus).toBe('success')
    expect(machine.transactionId).toBe('TRX-20241101-99812')

    // 9. Cashier prints receipt
    sim.setupMocks()
    window.print()
    expect(sim.printed).toBe(true)
  })

  // -------------------------------------------------------------
  // Scenario 2: Partial Installment Repayment Journey (Cicil Rp1.500.000 via Mandiri VA)
  // -------------------------------------------------------------
  it('T4-SC02: Partial Installment Repayment with Mandiri Virtual Account', async () => {
    // 1. Credit lookup
    machine.inputCreditNumber('1234393948486060')
    machine.searchCredit()

    // 2. Select Cicil and enter Rp1.500.000
    machine.selectTransactionType('Cicil')
    machine.setInstallmentAmount(1_500_000)

    // Expected: 1.500.000 principal + 140.000 rent + 2.500 service = 1.642.500
    expect(machine.summary.total).toBe(1_642_500)
    expect(formatCurrencyIdr(machine.summary.total)).toBe('Rp1.642.500')

    // 3. Select Mandiri VA
    const mandiri = paymentMethods.find((m) => m.id === 'mandiri-va')!
    machine.selectPaymentMethod(mandiri)
    expect(machine.canContinue).toBe(true)

    // 4. Open and confirm drawer
    machine.continueToReview()
    expect(machine.reviewOpen).toBe(true)
    machine.confirmReview()
    expect(machine.stage).toBe('instructions')

    // 5. Success settlement
    machine.finishPayment('success')
    expect(machine.stage).toBe('result')
    expect(machine.resultStatus).toBe('success')
  })

  // -------------------------------------------------------------
  // Scenario 3: Rental Fee Renewal Journey (Bayar Sewa Modal via BRI Direct Debit)
  // -------------------------------------------------------------
  it('T4-SC03: Interest-Only Rental Renewal with BRI Direct Debit', () => {
    // 1. Credit lookup
    machine.inputCreditNumber('1234393948486060')
    machine.searchCredit()

    // 2. Select Sewa Modal
    machine.selectTransactionType('Sewa Modal')
    // Expected: 0 principal + 140.000 rent + 2.500 service = 142.500
    expect(machine.summary.total).toBe(142_500)
    expect(formatCurrencyIdr(machine.summary.total)).toBe('Rp142.500')

    // 3. Select BRI Direct Debit
    const bri = paymentMethods.find((m) => m.id === 'bri-debit')!
    machine.selectPaymentMethod(bri)
    expect(machine.canContinue).toBe(true)

    // 4. Review and proceed to instructions
    machine.continueToReview()
    machine.confirmReview()
    expect(machine.stage).toBe('instructions')

    // 5. Complete
    machine.finishPayment('success')
    expect(machine.resultStatus).toBe('success')
  })

  // -------------------------------------------------------------
  // Scenario 4: Payment Timeout / Expiration Failure Journey
  // -------------------------------------------------------------
  it('T4-SC04: Countdown Expiration Transitions to Failure State Screen', () => {
    // 1. Setup payment
    machine.inputCreditNumber('1234393948486060')
    machine.searchCredit()
    machine.selectTransactionType('Pelunasan')
    machine.selectPaymentMethod(paymentMethods[0])
    machine.continueToReview()
    machine.confirmReview()

    expect(machine.stage).toBe('instructions')

    // 2. Timer reaches 00:00:00 -> triggers expiry
    expect(formatCountdownTimer(0)).toBe('00:00:00')
    machine.triggerExpiry()

    // 3. Transitions to failed screen
    expect(machine.stage).toBe('result')
    expect(machine.resultStatus).toBe('failed')

    // 4. Cashier returns to home / resets
    machine.reset()
    expect(machine.stage).toBe('form')
    expect(machine.hasCredit).toBe(false)
  })

  // -------------------------------------------------------------
  // Scenario 5: User Abandonment & State Recovery
  // -------------------------------------------------------------
  it('T4-SC05: Cashier Abandonment and Fresh Session Initialization', () => {
    // 1. Cashier enters half the form
    machine.inputCreditNumber('1234393948486060')
    machine.searchCredit()
    machine.selectTransactionType('Pelunasan')

    // 2. Cashier navigates away to Dashboard
    machine.reset()

    // 3. When cashier re-opens Bayar Gadai, state is clean
    expect(machine.stage).toBe('form')
    expect(machine.creditNumber).toBe('')
    expect(machine.hasCredit).toBe(false)
    expect(machine.transactionType).toBeNull()
    expect(machine.paymentMethod).toBeNull()
    expect(machine.summary.total).toBe(0)
  })

  // -------------------------------------------------------------
  // Scenario 6: Offline Merchant Payment Journey (Indomaret / Alfamart / Kantor Pos)
  // -------------------------------------------------------------
  it('T4-SC06: Merchant Cashier Offline Payment Flow', () => {
    // 1. Credit lookup
    machine.inputCreditNumber('1234393948486060')
    machine.searchCredit()
    machine.selectTransactionType('Pelunasan')

    // 2. Select Merchant
    const merchant = paymentMethods.find((m) => m.id === 'merchant')!
    machine.selectPaymentMethod(merchant)
    expect(machine.summary.paymentMethod?.category).toBe('Metode Pembayaran Lain')

    // 3. Review and proceed
    machine.continueToReview()
    expect(machine.summary.paymentMethod?.label).toContain('Merchant')
    machine.confirmReview()
    expect(machine.stage).toBe('instructions')

    // 4. Settled offline at merchant outlet
    machine.finishPayment('success')
    expect(machine.stage).toBe('result')
    expect(machine.resultStatus).toBe('success')
  })
})
