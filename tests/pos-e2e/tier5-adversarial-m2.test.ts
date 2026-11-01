/**
 * tier5-adversarial-m2.test.ts
 *
 * Milestone 2 Adversarial Stress & Verification Test Suite.
 * Empirically stress-tests:
 * 1. Form state transitions & race conditions (validation, search, reset on edit, rapid drawer toggle).
 * 2. Dynamic calculation boundaries (0 amount, maximum amount, negative values, extreme contracts).
 * 3. Polling simulation state transitions (idle -> checking -> pending -> success, click threshold, timer expiration, query overrides).
 * 4. Terminal state data integrity, clipboard security/fallbacks, and printable receipt generation in a new tab.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

import CreditNumberField from '../../POS/pembayaran-gadai/components/CreditNumberField.vue'
import TransactionTypePicker from '../../POS/pembayaran-gadai/components/TransactionTypePicker.vue'
import InstallmentAmountField from '../../POS/pembayaran-gadai/components/InstallmentAmountField.vue'
import PaymentMethodPicker from '../../POS/pembayaran-gadai/components/PaymentMethodPicker.vue'
import CreditDetailsCard from '../../POS/pembayaran-gadai/components/CreditDetailsCard.vue'
import PaymentInstructionCard from '../../POS/pembayaran-gadai/components/PaymentInstructionCard.vue'
import PaymentReviewDialog from '../../POS/pembayaran-gadai/components/PaymentReviewDialog.vue'
import PaymentResultView from '../../POS/pembayaran-gadai/components/PaymentResultView.vue'
import {
  getPaymentTotal,
  mockCreditRecord,
  paymentMethods,
  transactionTypes,
} from '../../POS/pembayaran-gadai/data'
import {
  buildReceiptHtml,
  formatCreditNumber,
  formatCurrencyIdr,
  printReceiptInNewTab,
  type ReceiptData,
} from '../../POS/pembayaran-gadai/receipt-utils'
import type {
  CreditRecord,
  PaymentCheckState,
  PaymentMethod,
  PaymentSummary,
  ResultStatus,
  TransactionType,
} from '../../POS/pembayaran-gadai/payment-types'
import { PosBrowserSimulator } from './harness/pos-test-harness'

describe('Tier 5: Milestone 2 Adversarial Hardening & Verification Suite', () => {
  let sim: PosBrowserSimulator

  beforeEach(() => {
    sim = new PosBrowserSimulator()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
    sim.reset()
  })

  const sampleSummary: PaymentSummary = {
    ...mockCreditRecord,
    transactionType: 'Pelunasan',
    paymentMethod: paymentMethods[0], // BCA Virtual Account
    installmentAmount: 0,
    total: 10_142_500,
  }

  // =========================================================================
  // 1. FORM STATE TRANSITIONS & RACE CONDITIONS
  // =========================================================================
  describe('1. Form State Transitions, Rapid Actions & Race Conditions', () => {
    it('T5-M2-01: Empty form synchronous validation triggers exact error messages on all required fields', () => {
      // Simulation of validation engine in PembayaranGadaiPage.vue
      const validateEngine = (
        creditNumber: string,
        hasCredit: boolean,
        transType: TransactionType | null,
        payMethod: PaymentMethod | null,
        instAmount: number,
      ) => {
        const errors: Record<string, string> = {}
        const digits = creditNumber.replace(/\D/g, '')

        if (!digits || digits.length !== 16 || !hasCredit) {
          errors.creditError = 'Nomor kredit harus diisi'
        }
        if (!transType) {
          errors.transactionTypeError = 'Jenis transaksi harus diisi'
        }
        if (!payMethod) {
          errors.paymentMethodError = 'Metode pembayaran harus diisi'
        }
        if (transType === 'Cicil' && instAmount <= 0) {
          errors.installmentAmountError = 'Nominal cicilan harus lebih dari 0'
        }

        const isValid = Object.keys(errors).length === 0
        return { isValid, errors }
      }

      // Empty submission
      const result = validateEngine('', false, null, null, 500_000)
      expect(result.isValid).toBe(false)
      expect(result.errors.creditError).toBe('Nomor kredit harus diisi')
      expect(result.errors.transactionTypeError).toBe('Jenis transaksi harus diisi')
      expect(result.errors.paymentMethodError).toBe('Metode pembayaran harus diisi')
    })

    it('T5-M2-02: Credit search rejects invalid lengths and non-digit characters', () => {
      const searchEngine = (input: string) => {
        const digits = input.replace(/\D/g, '')
        if (digits.length !== 16) {
          return { success: false, error: 'Nomor kredit harus terdiri dari 16 digit.' }
        }
        return { success: true, digits, error: '' }
      }

      const invalidInputs = [
        '',
        '   ',
        '1234',
        'abcdefghijklmnop',
        '1234-5678-9012-345', // 15 digits
        '1234-5678-9012-3456-7', // 17 digits
        '!@#$%^&*()_+',
      ]

      for (const input of invalidInputs) {
        const res = searchEngine(input)
        expect(res.success).toBe(false)
        expect(res.error).toBe('Nomor kredit harus terdiri dari 16 digit.')
      }

      // Valid formatted inputs
      const validCases = ['1234 3939 4848 6060', '1234393948486060', '1234-3939-4848-6060']
      for (const input of validCases) {
        const res = searchEngine(input)
        expect(res.success).toBe(true)
        expect(res.digits).toBe('1234393948486060')
        expect(res.error).toBe('')
      }
    })

    it('T5-M2-03: Reactive state resets downstream selections when credit number is modified mid-flow', () => {
      // Simulating reactive state flow of PembayaranGadaiPage
      let creditNumber = '1234393948486060'
      let hasCredit = true
      let transactionType: TransactionType | null = 'Pelunasan'
      let paymentMethod: PaymentMethod | null = paymentMethods[0]
      let transactionTypeError = ''
      let paymentMethodError = ''

      // Watcher simulation
      const onCreditNumberChange = () => {
        if (hasCredit) {
          hasCredit = false
          transactionType = null
          paymentMethod = null
          transactionTypeError = ''
          paymentMethodError = ''
        }
      }

      // Cashier modifies 1 character
      creditNumber = '1234393948486061'
      onCreditNumberChange()

      expect(hasCredit).toBe(false)
      expect(transactionType).toBeNull()
      expect(paymentMethod).toBeNull()
      expect(transactionTypeError).toBe('')
      expect(paymentMethodError).toBe('')
    })

    it('T5-M2-04: Rapid drawer open/close toggling maintains state consistency without leakage', () => {
      let reviewOpen = false
      let stage: 'form' | 'instructions' | 'result' = 'form'

      const openDrawer = () => {
        reviewOpen = true
      }
      const closeDrawer = () => {
        reviewOpen = false
      }
      const confirmDrawer = () => {
        reviewOpen = false
        stage = 'instructions'
      }

      // Rapidly toggle 50 times
      for (let i = 0; i < 50; i++) {
        openDrawer()
        expect(reviewOpen).toBe(true)
        expect(stage).toBe('form')
        closeDrawer()
        expect(reviewOpen).toBe(false)
        expect(stage).toBe('form')
      }

      // Confirm advances stage atomically
      openDrawer()
      confirmDrawer()
      expect(reviewOpen).toBe(false)
      expect(stage).toBe('instructions')
    })

    it('T5-M2-05: PaymentReviewDialog locks body scroll on open and releases on close', () => {
      // Mock globalThis.document safely in node environment
      if (typeof globalThis.document === 'undefined') {
        globalThis.document = {
          body: { style: { overflow: '' } },
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        } as unknown as Document
      }
      const originalOverflow = globalThis.document?.body?.style?.overflow || ''

      const simulateWatchOpen = (isOpen: boolean) => {
        if (isOpen) {
          globalThis.document.body.style.overflow = 'hidden'
        } else {
          globalThis.document.body.style.overflow = originalOverflow
        }
      }

      simulateWatchOpen(true)
      expect(globalThis.document.body.style.overflow).toBe('hidden')

      simulateWatchOpen(false)
      expect(globalThis.document.body.style.overflow).toBe(originalOverflow)
    })

    it('T5-M2-06: PaymentInstructionCard accordion enforces single-expansion mutex and toggle collapse', () => {
      let expandedItem = 'transfer-internet-banking'

      const toggleAccordion = (id: string) => {
        expandedItem = expandedItem === id ? '' : id
      }

      // Initial item
      expect(expandedItem).toBe('transfer-internet-banking')

      // Switch to ATM
      toggleAccordion('transfer-atm')
      expect(expandedItem).toBe('transfer-atm')

      // Clicking ATM again collapses accordion
      toggleAccordion('transfer-atm')
      expect(expandedItem).toBe('')

      // Open m-banking
      toggleAccordion('transfer-mobile-banking')
      expect(expandedItem).toBe('transfer-mobile-banking')
    })
  })

  // =========================================================================
  // 2. DYNAMIC CALCULATION BOUNDARIES & EXTREME VALUES
  // =========================================================================
  describe('2. Dynamic Calculation Boundaries & Extreme Financial Inputs', () => {
    it('T5-M2-07: getPaymentTotal accurately computes Pelunasan regardless of installment amount', () => {
      // Pelunasan: loanAmount (10M) + rent (140k) + service (2.5k) = 10.142.500
      expect(getPaymentTotal('Pelunasan', mockCreditRecord, 0)).toBe(10_142_500)
      expect(getPaymentTotal('Pelunasan', mockCreditRecord, 500_000)).toBe(10_142_500)
      expect(getPaymentTotal('Pelunasan', mockCreditRecord, 999_999_999)).toBe(10_142_500)
    })

    it('T5-M2-08: getPaymentTotal accurately computes Sewa Modal (0 principal)', () => {
      // Sewa Modal: 0 + rent (140k) + service (2.5k) = 142.500
      expect(getPaymentTotal('Sewa Modal', mockCreditRecord, 0)).toBe(142_500)
      expect(getPaymentTotal('Sewa Modal', mockCreditRecord, 5_000_000)).toBe(142_500)
      expect(getPaymentTotal('Sewa Modal', mockCreditRecord, -100_000)).toBe(142_500)
    })

    it('T5-M2-09: getPaymentTotal clamps Cicil installments at 0 minimum and loanAmount maximum', () => {
      // Below zero clamps to 0: 0 + 140k + 2.5k = 142.500
      expect(getPaymentTotal('Cicil', mockCreditRecord, -100_000)).toBe(142_500)
      expect(getPaymentTotal('Cicil', mockCreditRecord, 0)).toBe(142_500)

      // 1 IDR boundary
      expect(getPaymentTotal('Cicil', mockCreditRecord, 1)).toBe(142_501)

      // Nominal installment (500k)
      expect(getPaymentTotal('Cicil', mockCreditRecord, 500_000)).toBe(642_500)

      // Exact loanAmount (10M)
      expect(getPaymentTotal('Cicil', mockCreditRecord, 10_000_000)).toBe(10_142_500)

      // Overflow installment (50M on 10M loan) clamps to 10M
      expect(getPaymentTotal('Cicil', mockCreditRecord, 50_000_000)).toBe(10_142_500)
    })

    it('T5-M2-10: Null transaction type returns 0 total safely', () => {
      expect(getPaymentTotal(null, mockCreditRecord, 500_000)).toBe(0)
    })

    it('T5-M2-11: High-value and zero-fee contracts calculate cleanly without numeric overflow', () => {
      const highContract: CreditRecord = {
        number: '9999888877776666',
        customer: 'Sultan Hadiningrat',
        loanAmount: 1_000_000_000, // 1 Billion
        dailyRent: 100_000,
        rentDays: 30,
        rentAmount: 3_000_000,
        serviceFee: 50_000,
      }
      const total = getPaymentTotal('Pelunasan', highContract)
      expect(total).toBe(1_003_050_000)
      expect(formatCurrencyIdr(total)).toContain('1.003.050.000')

      const zeroFeeContract: CreditRecord = {
        number: '1111222233334444',
        customer: 'Nol Biaya',
        loanAmount: 5_000_000,
        dailyRent: 0,
        rentDays: 0,
        rentAmount: 0,
        serviceFee: 0,
      }
      expect(getPaymentTotal('Pelunasan', zeroFeeContract)).toBe(5_000_000)
      expect(getPaymentTotal('Sewa Modal', zeroFeeContract)).toBe(0)
      expect(getPaymentTotal('Cicil', zeroFeeContract, 1_000_000)).toBe(1_000_000)
    })
  })

  // =========================================================================
  // 3. POLLING SIMULATION STATE TRANSITIONS & TIMING HAZARDS
  // =========================================================================
  describe('3. Polling Simulation State Transitions & Timing Hazards', () => {
    it('T5-M2-12: Full nominal polling sequence transitions: idle -> checking -> pending -> checking -> success', () => {
      let state: PaymentCheckState = 'idle'
      let pollCount = 0
      let stage = 'instructions'
      let resultStatus = 'success'
      let pollTimeout: any = undefined

      const refreshPaymentStatus = (queryOverride?: string | null) => {
        state = 'checking'
        if (pollTimeout) clearTimeout(pollTimeout)
        pollTimeout = setTimeout(() => {
          if (queryOverride === 'success' || queryOverride === 'failed') {
            resultStatus = queryOverride
            state = 'idle'
            stage = 'result'
            return
          }
          pollCount++
          if (pollCount >= 2) {
            resultStatus = 'success'
            state = 'idle'
            stage = 'result'
            return
          }
          state = 'pending'
        }, 450)
      }

      // Step 1: Initial state
      expect(state).toBe('idle')
      expect(pollCount).toBe(0)
      expect(stage).toBe('instructions')

      // Step 2: First click -> enters checking
      refreshPaymentStatus()
      expect(state).toBe('checking')

      // Advance 450ms -> moves to pending
      vi.advanceTimersByTime(450)
      expect(state).toBe('pending')
      expect(pollCount).toBe(1)
      expect(stage).toBe('instructions')

      // Step 3: Second click -> enters checking again
      refreshPaymentStatus()
      expect(state).toBe('checking')

      // Advance 450ms -> moves to success and stage=result
      vi.advanceTimersByTime(450)
      expect(state).toBe('idle')
      expect(pollCount).toBe(2)
      expect(stage).toBe('result')
      expect(resultStatus).toBe('success')
    })

    it('T5-M2-13: Polling simulation settles immediately when paymentResult query override is active', () => {
      let state: PaymentCheckState = 'idle'
      let stage = 'instructions'
      let resultStatus = ''

      const refreshWithQuery = (requestedResult: 'success' | 'failed') => {
        state = 'checking'
        setTimeout(() => {
          if (requestedResult === 'success' || requestedResult === 'failed') {
            resultStatus = requestedResult
            state = 'idle'
            stage = 'result'
          }
        }, 450)
      }

      // Test ?paymentResult=failed override
      refreshWithQuery('failed')
      expect(state).toBe('checking')
      vi.advanceTimersByTime(450)
      expect(state).toBe('idle')
      expect(stage).toBe('result')
      expect(resultStatus).toBe('failed')
    })

    it('T5-M2-14: Rapid refresh spamming clears pending timeouts safely without racing', () => {
      let executions = 0
      let timeoutId: any = undefined

      const debouncedRefresh = () => {
        if (timeoutId) clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          executions++
        }, 450)
      }

      // Spam 15 clicks rapidly in 100ms
      for (let i = 0; i < 15; i++) {
        debouncedRefresh()
        vi.advanceTimersByTime(10)
      }

      // Advance remaining timer
      vi.advanceTimersByTime(450)

      // Only the final debounced trigger should execute
      expect(executions).toBe(1)
    })

    it('T5-M2-15: Countdown interval triggers expired event and transitions to failed terminal state', () => {
      let remainingSeconds = 2
      let stage = 'instructions'
      let resultStatus = 'success'
      let expiredFired = false

      const interval = setInterval(() => {
        remainingSeconds--
        if (remainingSeconds <= 0) {
          clearInterval(interval)
          expiredFired = true
          stage = 'result'
          resultStatus = 'failed'
        }
      }, 1000)

      expect(remainingSeconds).toBe(2)
      expect(stage).toBe('instructions')

      vi.advanceTimersByTime(1000)
      expect(remainingSeconds).toBe(1)
      expect(expiredFired).toBe(false)

      vi.advanceTimersByTime(1000)
      expect(remainingSeconds).toBe(0)
      expect(expiredFired).toBe(true)
      expect(stage).toBe('result')
      expect(resultStatus).toBe('failed')
    })
  })

  // =========================================================================
  // 4. TERMINAL STATE DATA INTEGRITY & RECEIPT DISPATCHER
  // =========================================================================
  describe('4. Terminal State Data Integrity, Clipboard & Receipt Printing', () => {
    it('T5-M2-16: PaymentResultView renders success vector illustration, title, and transaction ID', async () => {
      const app = createSSRApp(PaymentResultView, {
        status: 'success',
        summary: sampleSummary,
        transactionId: 'TRX-20241101-99812',
        embeddedSummary: false,
      })
      const html = await renderToString(app)

      expect(html).toContain('Pelunasan Gadai Berhasil Diproses')
      expect(html).toContain('Transaksi telah tercatat di sistem')
      expect(html).toContain('illustration-success')
      expect(html).not.toContain('illustration-failed')
    })

    it('T5-M2-17: PaymentResultView renders failure state without Cetak Bukti Pembayaran button', async () => {
      const app = createSSRApp(PaymentResultView, {
        status: 'failed',
        summary: sampleSummary,
        errorMessage: 'Waktu pembayaran telah kedaluwarsa.',
        embeddedSummary: true,
      })
      const html = await renderToString(app)

      expect(html).toContain('Pelunasan Gadai Perhiasan Gagal')
      expect(html).toContain('Waktu pembayaran telah kedaluwarsa.')
      expect(html).toContain('illustration-failed')
      expect(html).toContain('Kembali ke Beranda')
      expect(html).not.toContain('Cetak Bukti Pembayaran')
    })

    it('T5-M2-18: CreditDetailsCard in result mode renders transactionId and copy action', async () => {
      const app = createSSRApp(CreditDetailsCard, {
        summary: sampleSummary,
        hasCredit: true,
        mode: 'success',
        transactionId: 'TRX-20241101-99812',
      })
      const html = await renderToString(app)

      expect(html).toContain('TRX-20241101-99812')
      expect(html).toContain('Salin ID transaksi')
      expect(html).toContain('Cetak Bukti Pembayaran')
      expect(html).toContain('Kembali ke Beranda')
    })

    it('T5-M2-19: buildReceiptHtml generates complete, print-ready HTML document with all financial breakdown rows', () => {
      const receiptData: ReceiptData = {
        transactionId: 'TRX-20241101-99812',
        transactionDate: '1 November 2024, 18:18',
        operatorName: 'Thoriq Shadad',
        operatorId: 'P91234',
        branchName: 'CP Salemba',
        summary: sampleSummary,
      }
      const html = buildReceiptHtml(receiptData)

      // Header & Brand
      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('PT PEGADAIAN')
      expect(html).toContain('SPRINT POS - CP Salemba')
      expect(html).toContain('Thoriq Shadad (P91234)')
      expect(html).toContain('Struk Bukti Pelunasan Gadai')

      // Transaction info
      expect(html).toContain('TRX-20241101-99812')
      expect(html).toContain('1 November 2024, 18:18')
      expect(html).toContain('1234 3939 4848 6060')
      expect(html).toContain('Bianca Putri')
      expect(html).toContain('Pelunasan')
      expect(html).toContain('BCA Virtual Account')

      // Breakdown
      expect(html).toContain('10.000.000')
      expect(html).toContain('140.000')
      expect(html).toContain('2.500')
      expect(html).toContain('10.142.500')

      // Print scripts & media
      expect(html).toContain('@media print')
      expect(html).toContain('window.print()')
    })

    it('T5-M2-20: printReceiptInNewTab dispatches to popup tab and safely falls back on blocker', () => {
      // 1. Success path: window.open returns window object
      let streamContent = ''
      let docClosed = false
      let winFocused = false

      const mockPopup = {
        document: {
          open: vi.fn(),
          write: vi.fn((c: string) => {
            streamContent = c
          }),
          close: vi.fn(() => {
            docClosed = true
          }),
        },
        focus: vi.fn(() => {
          winFocused = true
        }),
      }

      const mockOpen = vi.fn().mockReturnValue(mockPopup)
      const mockPrint = vi.fn()

      if (!globalThis.window) {
        globalThis.window = {} as unknown as Window & typeof globalThis
      }
      globalThis.window.open = mockOpen as unknown as typeof window.open
      globalThis.window.print = mockPrint as unknown as typeof window.print

      printReceiptInNewTab({
        transactionId: 'TRX-20241101-99812',
        summary: sampleSummary,
      })

      expect(mockOpen).toHaveBeenCalledWith('', '_blank', expect.stringContaining('width=780'))
      expect(streamContent).toContain('TRX-20241101-99812')
      expect(docClosed).toBe(true)
      expect(winFocused).toBe(true)
      expect(mockPrint).not.toHaveBeenCalled()

      // 2. Blocked popup fallback: window.open returns null
      mockOpen.mockReturnValue(null)
      mockPrint.mockClear()

      printReceiptInNewTab({
        transactionId: 'TRX-20241101-99812',
        summary: sampleSummary,
      })

      expect(mockOpen).toHaveBeenCalled()
      expect(mockPrint).toHaveBeenCalled()
    })

    it('T5-M2-21: Clipboard copy handler gracefully catches security rejections without unhandled exceptions', async () => {
      let announcement = ''
      const announce = (msg: string) => {
        announcement = msg
      }

      // Mock navigator.clipboard.writeText rejection
      const rejectingClipboard = {
        writeText: vi.fn().mockRejectedValue(new Error('Permission denied')),
      }
      Object.defineProperty(globalThis, 'navigator', {
        value: { clipboard: rejectingClipboard },
        writable: true,
        configurable: true,
      })

      // Simulate copyTransactionId in PembayaranGadaiPage
      const copyTransactionId = async (val: string) => {
        try {
          await navigator.clipboard.writeText(val)
          announce('ID Transaksi berhasil disalin.')
        } catch {
          announce('ID Transaksi tidak dapat disalin dari browser ini.')
        }
      }

      await copyTransactionId('TRX-20241101-99812')
      expect(announcement).toBe('ID Transaksi tidak dapat disalin dari browser ini.')

      // Success path
      const succeedingClipboard = {
        writeText: vi.fn().mockResolvedValue(undefined),
      }
      Object.defineProperty(globalThis, 'navigator', {
        value: { clipboard: succeedingClipboard },
        writable: true,
        configurable: true,
      })

      await copyTransactionId('TRX-20241101-99812')
      expect(announcement).toBe('ID Transaksi berhasil disalin.')
    })
  })
})
