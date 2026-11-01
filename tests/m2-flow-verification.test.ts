import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import {
  buildReceiptHtml,
  formatCreditNumber,
  formatCurrencyIdr,
  printReceiptInNewTab,
  type ReceiptData,
} from '../POS/pembayaran-gadai/receipt-utils'
import { mockCreditRecord, paymentMethods } from '../POS/pembayaran-gadai/data'
import type { PaymentSummary } from '../POS/pembayaran-gadai/payment-types'
import CreditDetailsCard from '../POS/pembayaran-gadai/components/CreditDetailsCard.vue'
import PaymentInstructionCard from '../POS/pembayaran-gadai/components/PaymentInstructionCard.vue'
import PaymentReviewDialog from '../POS/pembayaran-gadai/components/PaymentReviewDialog.vue'
import TransactionTypePicker from '../POS/pembayaran-gadai/components/TransactionTypePicker.vue'
import PaymentMethodPicker from '../POS/pembayaran-gadai/components/PaymentMethodPicker.vue'
import PaymentResultView from '../POS/pembayaran-gadai/components/PaymentResultView.vue'

describe('Milestone 2 Flow & Receipt Verification Suite', () => {
  const sampleSummary: PaymentSummary = {
    ...mockCreditRecord,
    transactionType: 'Pelunasan',
    paymentMethod: paymentMethods[0], // BCA Virtual Account
    installmentAmount: 0,
    total: 10_142_500,
  }

  // -------------------------------------------------------------------------
  // 1. Receipt Utilities & Streaming Tests
  // -------------------------------------------------------------------------
  describe('1. Receipt Generation & Window Dispatcher', () => {
    it('M2-RCP-01: formatCreditNumber correctly chunks 16 digits into 4 groups', () => {
      expect(formatCreditNumber('1234393948486060')).toBe('1234 3939 4848 6060')
      expect(formatCreditNumber(undefined)).toBe('-')
      expect(formatCreditNumber('')).toBe('-')
    })

    it('M2-RCP-02: formatCurrencyIdr correctly formats currency in IDR', () => {
      expect(formatCurrencyIdr(10_142_500)).toContain('10.142.500')
      expect(formatCurrencyIdr(undefined)).toBe('-')
      expect(formatCurrencyIdr(null as unknown as undefined)).toBe('-')
    })

    it('M2-RCP-03: buildReceiptHtml generates well-formed HTML document with transaction metrics', () => {
      const data: ReceiptData = {
        transactionId: 'TRX-20241101-99812',
        transactionDate: '1 November 2024, 18:18',
        operatorName: 'Thoriq Shadad',
        operatorId: 'P91234',
        branchName: 'CP Salemba',
        summary: sampleSummary,
      }
      const html = buildReceiptHtml(data)

      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('PT PEGADAIAN')
      expect(html).toContain('TRX-20241101-99812')
      expect(html).toContain('CP Salemba')
      expect(html).toContain('Thoriq Shadad (P91234)')
      expect(html).toContain('Struk Bukti Pelunasan Gadai')
      expect(html).toContain('Bianca Putri')
      expect(html).toContain('1234 3939 4848 6060')
      expect(html).toContain('BCA Virtual Account')
      expect(html).toContain('10.000.000')
      expect(html).toContain('140.000')
      expect(html).toContain('2.500')
      expect(html).toContain('10.142.500')
      expect(html).toContain('@media print')
      expect(html).toContain('window.print()')
    })

    it('M2-RCP-04: printReceiptInNewTab opens popup window and streams receipt HTML', () => {
      let writtenHtml = ''
      let docClosed = false
      let winFocused = false

      const mockPrintWindow = {
        document: {
          open: vi.fn(),
          write: vi.fn((content: string) => {
            writtenHtml = content
          }),
          close: vi.fn(() => {
            docClosed = true
          }),
        },
        focus: vi.fn(() => {
          winFocused = true
        }),
      }

      const mockOpen = vi.fn().mockReturnValue(mockPrintWindow)
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

      expect(mockOpen).toHaveBeenCalledWith('', '_blank', expect.any(String))
      expect(writtenHtml).toContain('TRX-20241101-99812')
      expect(docClosed).toBe(true)
      expect(winFocused).toBe(true)
      expect(mockPrint).not.toHaveBeenCalled()
    })

    it('M2-RCP-05: printReceiptInNewTab safely falls back to window.print() when popup is blocked', () => {
      const mockOpen = vi.fn().mockReturnValue(null) // Popup blocker returns null
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

      expect(mockOpen).toHaveBeenCalled()
      expect(mockPrint).toHaveBeenCalled()
    })
  })

  // -------------------------------------------------------------------------
  // 2. Component Integration & Prop Contract Tests
  // -------------------------------------------------------------------------
  describe('2. Component Integration & Prop Contracts', () => {
    it('M2-INT-01: TransactionTypePicker applies pgd-picker--error class when error prop is present', async () => {
      const app = createSSRApp(TransactionTypePicker, {
        modelValue: null,
        error: 'Jenis transaksi harus diisi',
      })
      const html = await renderToString(app)
      expect(html).toContain('pgd-picker--error')
      expect(html).toContain('Jenis transaksi harus diisi')
    })

    it('M2-INT-02: PaymentMethodPicker applies pgd-picker--error class when error prop is present', async () => {
      const app = createSSRApp(PaymentMethodPicker, {
        modelValue: null,
        error: 'Metode pembayaran harus diisi',
      })
      const html = await renderToString(app)
      expect(html).toContain('pgd-picker--error')
      expect(html).toContain('Metode pembayaran harus diisi')
    })

    it('M2-INT-03: CreditDetailsCard honors allowUnvalidatedSubmit=true enabling Lanjutkan button on empty form', async () => {
      const app = createSSRApp(CreditDetailsCard, {
        summary: {
          number: '',
          customer: '',
          loanAmount: 0,
          dailyRent: 0,
          rentDays: 0,
          rentAmount: 0,
          serviceFee: 0,
          total: 0,
          installmentAmount: 0,
          transactionType: null,
          paymentMethod: null,
        },
        hasCredit: false,
        mode: 'form',
        allowUnvalidatedSubmit: true,
      })
      const html = await renderToString(app)
      expect(html).toContain('Lanjutkan')
      expect(html).not.toMatch(/\bdisabled\b/)
    })

    it('M2-INT-04: CreditDetailsCard renders transactionId in terminal result mode', async () => {
      const app = createSSRApp(CreditDetailsCard, {
        summary: sampleSummary,
        hasCredit: true,
        mode: 'success',
        transactionId: 'TRX-20241101-99812',
      })
      const html = await renderToString(app)
      expect(html).toContain('TRX-20241101-99812')
      expect(html).toContain('Salin ID transaksi')
    })

    it('M2-INT-05: PaymentResultView exposes handlePrint and renders transactionId', async () => {
      const app = createSSRApp(PaymentResultView, {
        status: 'success',
        summary: sampleSummary,
        transactionId: 'TRX-20241101-99812',
        embeddedSummary: true,
      })
      const html = await renderToString(app)
      expect(html).toContain('TRX-20241101-99812')
      expect(html).toContain('Pelunasan Gadai Berhasil Diproses')
      expect(html).toContain('Cetak Bukti Pembayaran')
    })
  })
})
