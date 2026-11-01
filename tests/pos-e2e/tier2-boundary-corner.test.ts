import { describe, it, expect, beforeEach } from 'vitest'
import {
  PosFlowStateMachine,
  PosBrowserSimulator,
  calculateLayoutGeometry,
  formatCountdownTimer,
  formatCreditNumber,
  formatCurrencyIdr,
} from './harness/pos-test-harness'
import { mockCreditRecord, paymentMethods, getPaymentTotal } from '../../POS/pembayaran-gadai/data'

describe('Tier 2: Boundary & Corner Cases', () => {
  let sim: PosBrowserSimulator
  let machine: PosFlowStateMachine

  beforeEach(() => {
    sim = new PosBrowserSimulator()
    machine = new PosFlowStateMachine()
  })

  // -------------------------------------------------------------
  // Boundary 1: Credit Number Length & Character Sanitization
  // -------------------------------------------------------------
  describe('Credit Number Input Boundaries', () => {
    it('T2-B01: rejects empty credit number string on search', () => {
      machine.inputCreditNumber('')
      const success = machine.searchCredit()
      expect(success).toBe(false)
      expect(machine.hasCredit).toBe(false)
      expect(machine.creditError).toBe('Nomor kredit harus terdiri dari 16 digit.')
    })

    it('T2-B02: rejects whitespace-only credit number string', () => {
      machine.inputCreditNumber('                ')
      const success = machine.searchCredit()
      expect(success).toBe(false)
      expect(machine.hasCredit).toBe(false)
    })

    it('T2-B03: rejects credit number with exactly 15 digits (N-1 boundary)', () => {
      machine.inputCreditNumber('123456789012345')
      const success = machine.searchCredit()
      expect(success).toBe(false)
      expect(machine.hasCredit).toBe(false)
      expect(machine.creditError).toBe('Nomor kredit harus terdiri dari 16 digit.')
    })

    it('T2-B04: accepts credit number with exactly 16 digits (nominal boundary)', () => {
      machine.inputCreditNumber('1234567890123456')
      const success = machine.searchCredit()
      expect(success).toBe(true)
      expect(machine.hasCredit).toBe(true)
      expect(machine.creditError).toBe('')
    })

    it('T2-B05: rejects credit number with 17 digits (N+1 boundary)', () => {
      machine.inputCreditNumber('12345678901234567')
      const success = machine.searchCredit()
      expect(success).toBe(false)
      expect(machine.hasCredit).toBe(false)
    })

    it('T2-B06: handles leading zeroes without trimming digits', () => {
      machine.inputCreditNumber('0000123456789012')
      const success = machine.searchCredit()
      expect(success).toBe(true)
      expect(machine.creditNumber).toBe('0000123456789012')
    })

    it('T2-B07: strips mixed dashes, spaces, and punctuation down to valid 16 digits', () => {
      machine.inputCreditNumber('1234-3939 4848-6060.')
      const success = machine.searchCredit()
      expect(success).toBe(true)
      expect(machine.creditNumber).toBe('1234393948486060')
    })

    it('T2-B08: formats raw 16 digits into exactly 4-digit whitespace groups', () => {
      const formatted = formatCreditNumber('1234393948486060')
      expect(formatted).toBe('1234 3939 4848 6060')
      expect(formatted.split(' ')).toHaveLength(4)
      expect(formatted.split(' ')[0]).toBe('1234')
      expect(formatted.split(' ')[3]).toBe('6060')
    })
  })
  // -------------------------------------------------------------
  // Boundary 2: Installment Amount Numerical Boundaries
  // -------------------------------------------------------------
  describe('Installment Amount Boundaries', () => {
    beforeEach(() => {
      machine.inputCreditNumber('1234393948486060')
      machine.searchCredit()
      machine.selectTransactionType('Cicil')
      machine.selectPaymentMethod(paymentMethods[0])
    })

    it('T2-B09: rejects installment amount of 0 during submission validation', () => {
      machine.setInstallmentAmount(0)
      const res = machine.triggerValidation()
      expect(res.valid).toBe(false)
      expect(res.errors.installmentAmount).toBe('Nominal cicilan harus lebih dari 0')
    })

    it('T2-B10: allows minimum valid installment amount of Rp1', () => {
      machine.setInstallmentAmount(1)
      const res = machine.triggerValidation()
      expect(res.valid).toBe(true)
      // Total = 1 + 140.000 + 2.500 = 142.501
      expect(machine.summary.total).toBe(142_501)
    })

    it('T2-B11: clamps negative installment amount to 0 for calculation', () => {
      machine.setInstallmentAmount(-500_000)
      const total = getPaymentTotal('Cicil', mockCreditRecord, -500_000)
      // Principal clamped to 0, total = 0 + 140.000 + 2.500
      expect(total).toBe(142_500)
    })

    it('T2-B12: calculates exact nominal installment at Rp500.000', () => {
      machine.setInstallmentAmount(500_000)
      const total = getPaymentTotal('Cicil', mockCreditRecord, 500_000)
      expect(total).toBe(500_000 + 140_000 + 2_500)
      expect(total).toBe(642_500)
    })

    it('T2-B13: calculates exact loan amount maximum ceiling at Rp10.000.000', () => {
      machine.setInstallmentAmount(10_000_000)
      const total = getPaymentTotal('Cicil', mockCreditRecord, 10_000_000)
      expect(total).toBe(10_000_000 + 140_000 + 2_500)
      expect(total).toBe(10_142_500)
    })

    it('T2-B14: clamps installment amounts exceeding loan amount to loanAmount', () => {
      const total = getPaymentTotal('Cicil', mockCreditRecord, 25_000_000)
      expect(total).toBe(10_000_000 + 140_000 + 2_500)
      expect(total).toBe(10_142_500)
    })

    it('T2-B15: handles safe integer extremes without NaN or infinity', () => {
      const total = getPaymentTotal('Cicil', mockCreditRecord, Number.MAX_SAFE_INTEGER)
      expect(Number.isFinite(total)).toBe(true)
      expect(total).toBe(10_142_500)
    })
  })

  // -------------------------------------------------------------
  // Boundary 3: Currency Formatting Edge Cases
  // -------------------------------------------------------------
  describe('Currency Formatting Boundaries', () => {
    it('T2-B16: formats 0 as Rp0', () => {
      expect(formatCurrencyIdr(0)).toBe('Rp0')
    })

    it('T2-B17: formats single digit values without thousand separator (Rp5)', () => {
      expect(formatCurrencyIdr(5)).toBe('Rp5')
    })

    it('T2-B18: formats boundary thousand separator at exactly 1000 (Rp1.000)', () => {
      expect(formatCurrencyIdr(1000)).toBe('Rp1.000')
    })

    it('T2-B19: formats large billions figure (Rp1.000.000.000)', () => {
      expect(formatCurrencyIdr(1_000_000_000)).toBe('Rp1.000.000.000')
    })

    it('T2-B20: rounds floating decimal cents to nearest integer', () => {
      expect(formatCurrencyIdr(10_142_500.49)).toBe('Rp10.142.500')
      expect(formatCurrencyIdr(10_142_500.51)).toBe('Rp10.142.501')
    })
  })

  // -------------------------------------------------------------
  // Boundary 4: Countdown Timer Boundaries
  // -------------------------------------------------------------
  describe('Countdown Timer Boundaries', () => {
    it('T2-B21: formats exactly 0 seconds as 00:00:00', () => {
      expect(formatCountdownTimer(0)).toBe('00:00:00')
    })

    it('T2-B22: clamps negative seconds to 00:00:00', () => {
      expect(formatCountdownTimer(-100)).toBe('00:00:00')
    })

    it('T2-B23: formats 1 second before expiry as 00:00:01', () => {
      expect(formatCountdownTimer(1)).toBe('00:00:01')
    })

    it('T2-B24: formats 59 seconds boundary as 00:00:59', () => {
      expect(formatCountdownTimer(59)).toBe('00:00:59')
    })

    it('T2-B25: formats 60 seconds boundary as 00:01:00', () => {
      expect(formatCountdownTimer(60)).toBe('00:01:00')
    })

    it('T2-B26: formats 3599 seconds boundary as 00:59:59', () => {
      expect(formatCountdownTimer(3599)).toBe('00:59:59')
    })

    it('T2-B27: formats 3600 seconds boundary as 01:00:00', () => {
      expect(formatCountdownTimer(3600)).toBe('01:00:00')
    })

    it('T2-B28: formats multi-day countdown (e.g. 100 hours) as 100:00:00', () => {
      expect(formatCountdownTimer(360_000)).toBe('100:00:00')
    })
  })

  // -------------------------------------------------------------
  // Boundary 5: Viewport Width & Layout Geometry Boundaries
  // -------------------------------------------------------------
  describe('Viewport Width & Responsive Geometry Boundaries', () => {
    it('T2-B29: activates stacked layout at 1199px (tablet portrait / narrow)', () => {
      const geo = calculateLayoutGeometry(1199)
      expect(geo.isStacked).toBe(true)
    })

    it('T2-B30: activates 2-column layout at exactly 1200px breakpoint', () => {
      const geo = calculateLayoutGeometry(1200)
      expect(geo.isStacked).toBe(false)
    })

    it('T2-B31: maintains 2-column layout at 1279px (1px below 1280px)', () => {
      const geo = calculateLayoutGeometry(1279)
      expect(geo.isStacked).toBe(false)
      expect(geo.rightCardWidth).toBe(400)
    })

    it('T2-B32: matches exact target tablet specifications at 1280px', () => {
      const geo = calculateLayoutGeometry(1280)
      expect(geo.isStacked).toBe(false)
      expect(geo.leftCardWidth).toBe(569)
      expect(geo.rightCardWidth).toBe(400)
      expect(geo.columnGap).toBe(15)
      expect(geo.netGridWidth).toBe(984)
    })

    it('T2-B33: triggers fluid desktop expansion at 1281px (1px above 1280px)', () => {
      const geo = calculateLayoutGeometry(1281)
      expect(geo.isStacked).toBe(false)
      expect(geo.leftCardWidth).toBe(570)
      expect(geo.rightCardWidth).toBe(400)
      expect(geo.netGridWidth).toBe(985)
    })

    it('T2-B34: scales fluidly to 4K ultra-wide desktop (2560px) without overflow', () => {
      const geo = calculateLayoutGeometry(2560)
      expect(geo.isStacked).toBe(false)
      expect(geo.rightCardWidth).toBe(400)
      expect(geo.leftCardWidth).toBe(2560 - 248 - 48 - 400 - 15)
      expect(geo.netGridWidth).toBe(2560 - 248 - 48)
    })

    it('T2-B35: handles minimum mobile viewport (320px) safely in stacked mode', () => {
      const geo = calculateLayoutGeometry(320)
      expect(geo.isStacked).toBe(true)
      expect(geo.leftCardWidth).toBeGreaterThan(0)
      expect(geo.rightCardWidth).toBeGreaterThan(0)
    })
  })

  // -------------------------------------------------------------
  // Boundary 6: State Invalidation and Mutation Edge Cases
  // -------------------------------------------------------------
  describe('State Invalidation & Mutation Boundaries', () => {
    it('T2-B36: submitting completely empty form generates all required field errors', () => {
      const res = machine.triggerValidation()
      expect(res.valid).toBe(false)
      expect(res.errors.creditNumber).toBeDefined()
      expect(res.errors.transactionType).toBeDefined()
      expect(res.errors.paymentMethod).toBeDefined()
      expect(Object.keys(res.errors)).toHaveLength(3)
    })

    it('T2-B37: typing into credit field clears previous creditError immediately', () => {
      machine.inputCreditNumber('123')
      machine.searchCredit()
      expect(machine.creditError).toBeTruthy()

      machine.inputCreditNumber('1234')
      expect(machine.creditError).toBe('')
    })

    it('T2-B38: modifying credit number after search resets credit and clears downstream selections', () => {
      machine.inputCreditNumber('1234393948486060')
      machine.searchCredit()
      machine.selectTransactionType('Pelunasan')
      machine.selectPaymentMethod(paymentMethods[0])
      expect(machine.canContinue).toBe(true)

      // User changes a single digit
      machine.inputCreditNumber('1234393948486061')
      expect(machine.hasCredit).toBe(false)
      expect(machine.transactionType).toBeNull()
      expect(machine.paymentMethod).toBeNull()
      expect(machine.canContinue).toBe(false)
    })

    it('T2-B39: cannot open review dialog when canContinue is false', () => {
      const opened = machine.continueToReview()
      expect(opened).toBe(false)
      expect(machine.reviewOpen).toBe(false)
      expect(machine.announcement).toContain('Lengkapi')
    })

    it('T2-B40: multiple rapid search clicks with valid input remain idempotent', () => {
      machine.inputCreditNumber('1234393948486060')
      for (let i = 0; i < 5; i++) {
        const ok = machine.searchCredit()
        expect(ok).toBe(true)
        expect(machine.hasCredit).toBe(true)
      }
      expect(machine.creditNumber).toBe('1234393948486060')
    })
  })
})
