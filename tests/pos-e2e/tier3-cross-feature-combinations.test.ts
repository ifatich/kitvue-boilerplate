import { describe, it, expect, beforeEach } from 'vitest'
import {
  PosFlowStateMachine,
  PosBrowserSimulator,
  formatCurrencyIdr,
} from './harness/pos-test-harness'
import { mockCreditRecord, paymentMethods, transactionTypes, getPaymentTotal } from '../../POS/pembayaran-gadai/data'
import type { PaymentMethod, TransactionType } from '../../POS/pembayaran-gadai/payment-types'

describe('Tier 3: Cross-Feature Combinations (Pairwise & State Transitions)', () => {
  let sim: PosBrowserSimulator
  let machine: PosFlowStateMachine

  beforeEach(() => {
    sim = new PosBrowserSimulator()
    machine = new PosFlowStateMachine()
    // Pre-hydrate credit contract
    machine.inputCreditNumber('1234393948486060')
    machine.searchCredit()
  })

  // -------------------------------------------------------------
  // Part 1: Exhaustive Pairwise Matrix (3 Types × 4 Methods = 12 Combinations)
  // -------------------------------------------------------------
  describe('Exhaustive Pairwise Matrix (Transaction Type × Payment Method)', () => {
    const types: TransactionType[] = ['Pelunasan', 'Cicil', 'Sewa Modal']

    types.forEach((type) => {
      paymentMethods.forEach((method) => {
        it(`T3-PAIR: verifies combination ${type} + ${method.label} (${method.id})`, () => {
          machine.selectTransactionType(type)
          if (type === 'Cicil') {
            machine.setInstallmentAmount(1_000_000)
          }
          machine.selectPaymentMethod(method)

          expect(machine.canContinue).toBe(true)
          expect(machine.summary.transactionType).toBe(type)
          expect(machine.summary.paymentMethod?.id).toBe(method.id)

          // Verify total calculation matches expected formula
          let expectedTotal = 0
          if (type === 'Pelunasan') {
            expectedTotal = mockCreditRecord.loanAmount + mockCreditRecord.rentAmount + mockCreditRecord.serviceFee
          } else if (type === 'Cicil') {
            expectedTotal = 1_000_000 + mockCreditRecord.rentAmount + mockCreditRecord.serviceFee
          } else if (type === 'Sewa Modal') {
            expectedTotal = 0 + mockCreditRecord.rentAmount + mockCreditRecord.serviceFee
          }

          expect(machine.summary.total).toBe(expectedTotal)

          // Verify review drawer opens and reflects this combination
          const opened = machine.continueToReview()
          expect(opened).toBe(true)
          expect(machine.reviewOpen).toBe(true)
          expect(machine.summary.paymentMethod?.bank).toBe(method.bank)

          // Confirm to instructions
          machine.confirmReview()
          expect(machine.stage).toBe('instructions')
        })
      })
    })
  })
  // -------------------------------------------------------------
  // Part 2: Dynamic Type Switching & Recalculation Flow
  // -------------------------------------------------------------
  describe('Dynamic Transaction Type Switching Flow', () => {
    beforeEach(() => {
      machine.selectPaymentMethod(paymentMethods[0]) // BCA VA
    })

    it('T3-SW-01: switches Pelunasan -> Sewa Modal and recalculates total immediately', () => {
      machine.selectTransactionType('Pelunasan')
      expect(machine.summary.total).toBe(10_142_500)

      machine.selectTransactionType('Sewa Modal')
      expect(machine.summary.transactionType).toBe('Sewa Modal')
      expect(machine.summary.total).toBe(142_500)
    })

    it('T3-SW-02: switches Sewa Modal -> Cicil and enables installment amount calculation', () => {
      machine.selectTransactionType('Sewa Modal')
      expect(machine.summary.total).toBe(142_500)

      machine.selectTransactionType('Cicil')
      machine.setInstallmentAmount(2_500_000)
      expect(machine.summary.transactionType).toBe('Cicil')
      expect(machine.summary.total).toBe(2_500_000 + 140_000 + 2_500)
      expect(machine.summary.total).toBe(2_642_500)
    })

    it('T3-SW-03: switches Cicil -> Pelunasan and restores full principal without installment override', () => {
      machine.selectTransactionType('Cicil')
      machine.setInstallmentAmount(2_500_000)
      expect(machine.summary.total).toBe(2_642_500)

      machine.selectTransactionType('Pelunasan')
      expect(machine.summary.total).toBe(10_142_500)
    })

    it('T3-SW-04: adjusts installment amount dynamically in Cicil mode', () => {
      machine.selectTransactionType('Cicil')
      machine.setInstallmentAmount(500_000)
      expect(machine.summary.total).toBe(642_500)

      machine.setInstallmentAmount(3_000_000)
      expect(machine.summary.total).toBe(3_142_500)

      machine.setInstallmentAmount(7_500_000)
      expect(machine.summary.total).toBe(7_642_500)
    })
  })

  // -------------------------------------------------------------
  // Part 3: Dynamic Payment Method Switching & Summary Synchronization
  // -------------------------------------------------------------
  describe('Dynamic Payment Method Switching Flow', () => {
    beforeEach(() => {
      machine.selectTransactionType('Pelunasan')
    })

    it('T3-PM-01: switches from Virtual Account to Direct Debit', () => {
      const bca = paymentMethods.find((m) => m.id === 'bca-va')!
      const bri = paymentMethods.find((m) => m.id === 'bri-debit')!

      machine.selectPaymentMethod(bca)
      expect(machine.summary.paymentMethod?.category).toBe('Virtual Account')

      machine.selectPaymentMethod(bri)
      expect(machine.summary.paymentMethod?.category).toBe('Direct Debit')
      expect(machine.summary.paymentMethod?.bank).toBe('BRI')
    })

    it('T3-PM-02: switches from Direct Debit to Bayar di Merchant', () => {
      const bri = paymentMethods.find((m) => m.id === 'bri-debit')!
      const merchant = paymentMethods.find((m) => m.id === 'merchant')!

      machine.selectPaymentMethod(bri)
      machine.selectPaymentMethod(merchant)
      expect(machine.summary.paymentMethod?.category).toBe('Metode Pembayaran Lain')
      expect(machine.summary.paymentMethod?.label).toContain('Merchant')
    })

    it('T3-PM-03: review drawer synchronization reflects updated payment channel after dismiss', () => {
      machine.selectPaymentMethod(paymentMethods[0]) // BCA VA
      machine.continueToReview()
      expect(machine.summary.paymentMethod?.id).toBe('bca-va')

      // Cashier clicks 'Periksa Lagi' to change method to Mandiri
      machine.dismissReview()
      expect(machine.reviewOpen).toBe(false)

      machine.selectPaymentMethod(paymentMethods[1]) // Mandiri VA
      machine.continueToReview()
      expect(machine.reviewOpen).toBe(true)
      expect(machine.summary.paymentMethod?.id).toBe('mandiri-va')
      expect(machine.summary.paymentMethod?.bank).toBe('Mandiri')
    })
  })

  // -------------------------------------------------------------
  // Part 4: Error Recovery & Correction Flow
  // -------------------------------------------------------------
  describe('Error Recovery & Progressive Form Correction Flow', () => {
    it('T3-ERR-01: recovers progressively from empty validation failure to valid submission', () => {
      const freshMachine = new PosFlowStateMachine()

      // 1. Initial attempt fails
      const check1 = freshMachine.triggerValidation()
      expect(check1.valid).toBe(false)
      expect(Object.keys(check1.errors)).toHaveLength(3)

      // 2. User enters and searches valid credit
      freshMachine.inputCreditNumber('1234393948486060')
      const searchOk = freshMachine.searchCredit()
      expect(searchOk).toBe(true)

      // 3. User selects type
      freshMachine.selectTransactionType('Pelunasan')
      const check2 = freshMachine.triggerValidation()
      expect(check2.valid).toBe(false)
      expect(check2.errors.paymentMethod).toBeDefined()
      expect(check2.errors.creditNumber).toBeUndefined()
      expect(check2.errors.transactionType).toBeUndefined()

      // 4. User selects payment method
      freshMachine.selectPaymentMethod(paymentMethods[0])
      const check3 = freshMachine.triggerValidation()
      expect(check3.valid).toBe(true)
      expect(freshMachine.canContinue).toBe(true)
    })

    it('T3-ERR-02: recovers from Cicil zero installment error by supplying valid amount', () => {
      machine.selectTransactionType('Cicil')
      machine.setInstallmentAmount(0)
      machine.selectPaymentMethod(paymentMethods[0])

      const errCheck = machine.triggerValidation()
      expect(errCheck.valid).toBe(false)
      expect(errCheck.errors.installmentAmount).toBe('Nominal cicilan harus lebih dari 0')

      // Fix amount
      machine.setInstallmentAmount(750_000)
      const okCheck = machine.triggerValidation()
      expect(okCheck.valid).toBe(true)
      expect(machine.canContinue).toBe(true)
    })

    it('T3-ERR-03: invalid credit number search recovery', () => {
      const freshMachine = new PosFlowStateMachine()
      freshMachine.inputCreditNumber('9999')
      const ok = freshMachine.searchCredit()
      expect(ok).toBe(false)
      expect(freshMachine.creditError).toBe('Nomor kredit harus terdiri dari 16 digit.')

      // User fixes input to 16 digits
      freshMachine.inputCreditNumber('1234393948486060')
      expect(freshMachine.creditError).toBe('')
      expect(freshMachine.searchCredit()).toBe(true)
      expect(freshMachine.hasCredit).toBe(true)
    })
  })

  // -------------------------------------------------------------
  // Part 5: Stage Progression and Terminal State Combinations
  // -------------------------------------------------------------
  describe('Stage Progression & Terminal Resolution Combinations', () => {
    beforeEach(() => {
      machine.selectTransactionType('Pelunasan')
      machine.selectPaymentMethod(paymentMethods[0])
      machine.continueToReview()
      machine.confirmReview()
    })

    it('T3-ST-01: advances from instructions to result success', () => {
      expect(machine.stage).toBe('instructions')
      machine.finishPayment('success')
      expect(machine.stage).toBe('result')
      expect(machine.resultStatus).toBe('success')
    })

    it('T3-ST-02: advances from instructions to result failure on expiration', () => {
      expect(machine.stage).toBe('instructions')
      machine.triggerExpiry()
      expect(machine.stage).toBe('result')
      expect(machine.resultStatus).toBe('failed')
    })

    it('T3-ST-03: status checking state simulates polling lifecycle', () => {
      expect(machine.paymentCheckState).toBe('idle')
      machine.paymentCheckState = 'checking'
      expect(machine.paymentCheckState).toBe('checking')
      machine.paymentCheckState = 'pending'
      expect(machine.paymentCheckState).toBe('pending')
      machine.finishPayment('success')
      expect(machine.paymentCheckState).toBe('idle')
    })
  })
})
