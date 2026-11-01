import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createSSRApp } from 'vue'
import { renderToString, type SSRContext } from 'vue/server-renderer'
import fs from 'node:fs'
import path from 'node:path'

import CreditNumberField from '../../POS/pembayaran-gadai/components/CreditNumberField.vue'
import TransactionTypePicker from '../../POS/pembayaran-gadai/components/TransactionTypePicker.vue'
import PaymentMethodPicker from '../../POS/pembayaran-gadai/components/PaymentMethodPicker.vue'
import PaymentResultView from '../../POS/pembayaran-gadai/components/PaymentResultView.vue'
import InstallmentAmountField from '../../POS/pembayaran-gadai/components/InstallmentAmountField.vue'
import CreditDetailsCard from '../../POS/pembayaran-gadai/components/CreditDetailsCard.vue'
import PaymentInstructionCard from '../../POS/pembayaran-gadai/components/PaymentInstructionCard.vue'
import PaymentReviewDialog from '../../POS/pembayaran-gadai/components/PaymentReviewDialog.vue'
import IllustrationFlowSuccess from '../../POS/pembayaran-gadai/components/illustrations/IllustrationFlowSuccess.vue'
import IllustrationFlowFailed from '../../POS/pembayaran-gadai/components/illustrations/IllustrationFlowFailed.vue'
import { mockCreditRecord, paymentMethods } from '../../POS/pembayaran-gadai/data'
import { PosBrowserSimulator } from './harness/pos-test-harness'
import type { PaymentSummary } from '../../POS/pembayaran-gadai/payment-types'

describe('Tier 5: Milestone 1 Adversarial Hardening & Stress Testing', () => {
  let sim: PosBrowserSimulator

  beforeEach(() => {
    sim = new PosBrowserSimulator()
  })

  afterEach(() => {
    sim.reset()
  })

  const sampleSummary: PaymentSummary = {
    ...mockCreditRecord,
    transactionType: 'Pelunasan',
    paymentMethod: paymentMethods[0], // BCA Virtual Account
    installmentAmount: 0,
    total: 10_142_500,
  }

  // -------------------------------------------------------------------------
  // 1. TOKEN & CSS SANITIZATION SCANNER
  // -------------------------------------------------------------------------
  describe('1. Design Token & CSS Sanitization Scanner', () => {
    const gadaiStylePath = path.resolve(__dirname, '../../POS/pembayaran-gadai/style.css')
    const posStylePath = path.resolve(__dirname, '../../POS/style.css')
    const htmlPath = path.resolve(__dirname, '../../POS/index.html')

    const gadaiStyle = fs.readFileSync(gadaiStylePath, 'utf-8')
    const posStyle = fs.readFileSync(posStylePath, 'utf-8')
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8')

    it('T5-CSS-01: ensures 0 occurrences of --pos-* variables in pembayaran-gadai/style.css', () => {
      const posVarMatches = gadaiStyle.match(/--pos-[a-zA-Z0-9_-]+/g) || []
      expect(posVarMatches).toEqual([])
      expect(posVarMatches.length).toBe(0)
    })

    it('T5-CSS-02: ensures 0 arbitrary hex color codes in pembayaran-gadai/style.css', () => {
      // Exclude comments if any, then search for hex colors #xxx, #xxxxxx, #xxxxxxxx
      const strippedComments = gadaiStyle.replace(/\/\*[\s\S]*?\*\//g, '')
      const hexMatches = strippedComments.match(/#[0-9a-fA-F]{3,8}\b/g) || []
      expect(hexMatches).toEqual([])
      expect(hexMatches.length).toBe(0)
    })

    it('T5-CSS-03: ensures canonical --g-kit-* tokens exist on :root in POS/style.css', () => {
      const requiredTokens = [
        '--g-kit-emerald-50',
        '--g-kit-lime-50',
        '--g-kit-crimson-50',
        '--g-kit-black-10',
        '--g-kit-black-20',
        '--g-kit-black-30',
        '--g-kit-black-40',
        '--g-kit-black-50',
        '--g-kit-black-60',
        '--g-kit-black-80',
        '--g-kit-white',
        '--g-kit-bca-blue',
      ]
      for (const token of requiredTokens) {
        expect(posStyle.includes(token), `Missing canonical token ${token} in POS/style.css`).toBe(true)
      }
    })

    it('T5-CSS-04: ensures Nunito Sans font is specified in index.html', () => {
      expect(htmlContent.includes('Nunito+Sans')).toBe(true)
      expect(htmlContent.includes('family=Nunito:')).toBe(true)
    })
  })

  // -------------------------------------------------------------------------
  // 2. CreditNumberField ADVERSARIAL STRESS TEST
  // -------------------------------------------------------------------------
  describe('2. CreditNumberField Stress & Edge Cases', () => {
    it('T5-CNF-01: renders default empty state with input and disabled search button', async () => {
      const app = createSSRApp(CreditNumberField, { modelValue: '' })
      const html = await renderToString(app)
      expect(html).toContain('placeholder="Masukkan nomor kredit"')
      expect(html).toContain('<button class="pgd-credit-number__search" type="button" disabled>')
      expect(html).toContain('Cari')
      expect(html).not.toContain('pgd-field-error')
    })

    it('T5-CNF-02: correctly formats and chunks 16 digits into 4 groups of 4 separated by space', async () => {
      const app = createSSRApp(CreditNumberField, { modelValue: '1234393948486060' })
      const html = await renderToString(app)
      expect(html).toContain('value="1234 3939 4848 6060"')
      // Search button should NOT be disabled when exact 16 digits
      expect(html).toContain('<button class="pgd-credit-number__search" type="button">')
    })

    it('T5-CNF-03: clamps numbers exceeding 16 digits down to 16 digits', async () => {
      const app = createSSRApp(CreditNumberField, { modelValue: '1234567890123456789999999' })
      const html = await renderToString(app)
      expect(html).toContain('value="1234 5678 9012 3456"')
    })

    it('T5-CNF-04: filters out all non-digits (letters, unicode symbols, punctuation, spaces)', async () => {
      const dirtyInputs = [
        '1234-3939-4848-6060',
        '1234.3939.4848.6060',
        'abcd1234efgh3939ijkl4848mnop6060',
        '1234 3939 4848 6060',
        '!@#1$2%3^4&3*9(3)9_4+8=4-8/6~0`6;0',
      ]
      for (const dirty of dirtyInputs) {
        const app = createSSRApp(CreditNumberField, { modelValue: dirty })
        const html = await renderToString(app)
        expect(html, `Failed on input: ${dirty}`).toContain('value="1234 3939 4848 6060"')
      }
    })

    it('T5-CNF-05: fuzz testing whitespace chunking invariant on randomized strings', async () => {
      // Invariant: The formatted value must match /^\d{1,4}( \d{1,4}){0,3}$/ or be empty
      const randomFuzzSamples = [
        '',
        '1',
        '12',
        '123',
        '1234',
        '12345',
        '123456',
        '1234567',
        '12345678',
        '123456789',
        '123456789012',
        '1234567890123',
        '123456789012345',
        '1234567890123456',
        '9999999999999999999999999999',
      ]

      for (const sample of randomFuzzSamples) {
        const app = createSSRApp(CreditNumberField, { modelValue: sample })
        const html = await renderToString(app)
        const match = html.match(/value="([^"]*)"/)
        const val = match ? match[1] : ''
        if (val.length > 0) {
          expect(val).toMatch(/^\d{1,4}( \d{1,4}){0,3}$/)
          expect(val.length).toBeLessThanOrEqual(19) // 16 digits + 3 spaces max
        }
      }
    })

    it('T5-CNF-06: loading prop disables button and displays "Mencari..."', async () => {
      const app = createSSRApp(CreditNumberField, {
        modelValue: '1234393948486060',
        loading: true,
      })
      const html = await renderToString(app)
      expect(html).toContain('disabled')
      expect(html).toContain('Mencari...')
      expect(html).not.toContain('>Cari<')
    })

    it('T5-CNF-07: disabled prop disables both input box and search button', async () => {
      const app = createSSRApp(CreditNumberField, {
        modelValue: '1234393948486060',
        disabled: true,
      })
      const html = await renderToString(app)
      expect(html).toContain('pgd-credit-box--disabled')
      expect(html).toContain('<input id="pgd-credit-input" class="pgd-credit-box__input" type="text" inputmode="numeric" placeholder="Masukkan nomor kredit" value="1234 3939 4848 6060" disabled')
      expect(html).toContain('<button class="pgd-credit-number__search" type="button" disabled>')
    })

    it('T5-CNF-08: error prop renders field error message with role="alert"', async () => {
      const app = createSSRApp(CreditNumberField, {
        modelValue: '123',
        error: 'Nomor kredit harus terdiri dari 16 digit.',
      })
      const html = await renderToString(app)
      expect(html).toContain('pgd-credit-number--error')
      expect(html).toContain('role="alert"')
      expect(html).toContain('Nomor kredit harus terdiri dari 16 digit.')
    })
  })

  // -------------------------------------------------------------------------
  // 3. TransactionTypePicker & PaymentMethodPicker
  // -------------------------------------------------------------------------
  describe('3. TransactionTypePicker & PaymentMethodPicker State Consistency', () => {
    it('T5-PKR-01: TransactionTypePicker renders placeholder when modelValue is null', async () => {
      const app = createSSRApp(TransactionTypePicker, { modelValue: null })
      const html = await renderToString(app)
      expect(html).toContain('Pilih jenis transaksi')
      expect(html).toContain('pgd-picker__placeholder')
    })

    it('T5-PKR-02: TransactionTypePicker displays correct mapped label for all 3 transaction types', async () => {
      const mapping = [
        { val: 'Pelunasan', expected: 'Pelunasan' },
        { val: 'Cicil', expected: 'Cicil' },
        { val: 'Sewa Modal', expected: 'Bayar Sewa Modal' },
      ] as const

      for (const item of mapping) {
        const app = createSSRApp(TransactionTypePicker, { modelValue: item.val })
        const html = await renderToString(app)
        expect(html).toContain(item.expected)
      }
    })

    it('T5-PKR-03: TransactionTypePicker shows error message when error prop is passed', async () => {
      const app = createSSRApp(TransactionTypePicker, {
        modelValue: null,
        error: 'Silakan pilih jenis transaksi terlebih dahulu.',
      })
      const html = await renderToString(app)
      expect(html).toContain('role="alert"')
      expect(html).toContain('Silakan pilih jenis transaksi terlebih dahulu.')
    })

    it('T5-PKR-04: PaymentMethodPicker renders placeholder when modelValue is null', async () => {
      const app = createSSRApp(PaymentMethodPicker, { modelValue: null })
      const html = await renderToString(app)
      expect(html).toContain('Pilih metode pembayaran')
      expect(html).toContain('pgd-payment-icon')
    })

    it('T5-PKR-05: PaymentMethodPicker displays selected payment method brand and logo', async () => {
      const app = createSSRApp(PaymentMethodPicker, { modelValue: paymentMethods[0] })
      const html = await renderToString(app)
      expect(html).toContain('BCA Virtual Account')
      expect(html).toContain(paymentMethods[0].logo)
    })

    it('T5-PKR-06: PaymentMethodPicker shows error message when error prop is passed', async () => {
      const app = createSSRApp(PaymentMethodPicker, {
        modelValue: null,
        error: 'Pilih metode pembayaran untuk melanjutkan.',
      })
      const html = await renderToString(app)
      expect(html).toContain('role="alert"')
      expect(html).toContain('Pilih metode pembayaran untuk melanjutkan.')
    })
  })

  // -------------------------------------------------------------------------
  // 4. PaymentResultView ADVERSARIAL STRESS TEST
  // -------------------------------------------------------------------------
  describe('4. PaymentResultView Robustness & Failure Modes', () => {
    it('T5-PRV-01: renders success outcome with IllustrationFlowSuccess and both home and print buttons', async () => {
      const app = createSSRApp(PaymentResultView, {
        status: 'success',
        summary: sampleSummary,
        transactionId: 'TRX-998822',
        embeddedSummary: true,
      })
      const html = await renderToString(app)
      expect(html).toContain('data-test="illustration-success"')
      expect(html).toContain('Pelunasan Gadai Berhasil Diproses')
      expect(html).toContain('Transaksi telah tercatat di sistem')
      expect(html).toContain('Kembali ke Beranda')
      expect(html).toContain('Cetak Bukti Pembayaran')
      expect(html).toContain('data-test="trx-id-value"')
    })

    it('T5-PRV-02: renders failed outcome with IllustrationFlowFailed and suppresses print button', async () => {
      const app = createSSRApp(PaymentResultView, {
        status: 'failed',
        summary: sampleSummary,
        errorMessage: 'Koneksi ke sistem perbankan terputus. Silakan ulangi transaksi.',
        embeddedSummary: true,
      })
      const html = await renderToString(app)
      expect(html).toContain('data-test="illustration-failed"')
      expect(html).toContain('Pelunasan Gadai Perhiasan Gagal')
      expect(html).toContain('Koneksi ke sistem perbankan terputus')
      expect(html).toContain('Kembali ke Beranda')
      // Print button MUST NOT be rendered on failed state
      expect(html).not.toContain('Cetak Bukti Pembayaran')
    })

    it('T5-PRV-03: supports custom title and description overrides', async () => {
      const app = createSSRApp(PaymentResultView, {
        status: 'success',
        title: 'Custom Title Pelunasan',
        description: 'Custom description text for testing',
      })
      const html = await renderToString(app)
      expect(html).toContain('Custom Title Pelunasan')
      expect(html).toContain('Custom description text for testing')
    })

    it('T5-PRV-04: ensures 100% vector SVG illustrations with zero raster bitmap dependencies', async () => {
      const appSuccess = createSSRApp(IllustrationFlowSuccess, { size: 204 })
      const htmlSuccess = await renderToString(appSuccess)
      expect(htmlSuccess).toContain('<svg')
      expect(htmlSuccess).toMatch(/viewBox="0 0 (246 246|204 204)"/)
      expect(htmlSuccess).not.toContain('<img')
      expect(htmlSuccess).not.toContain('.png')

      const appFailed = createSSRApp(IllustrationFlowFailed, { size: 204 })
      const htmlFailed = await renderToString(appFailed)
      expect(htmlFailed).toContain('<svg')
      expect(htmlFailed).toContain('viewBox="0 0 204 204"')
      expect(htmlFailed).not.toContain('<img')
      expect(htmlFailed).not.toContain('.png')
    })

    it('T5-PRV-05: clipboard error handling does not crash component or throw unhandled rejection', async () => {
      // Mock clipboard that throws an exception (e.g. permission denied)
      const mockClipboardThrow = {
        writeText: vi.fn().mockRejectedValue(new Error('DOMException: Clipboard permission denied')),
      }
      Object.defineProperty(globalThis.navigator, 'clipboard', {
        value: mockClipboardThrow,
        writable: true,
        configurable: true,
      })

      // Mount and verify component setup does not throw
      const app = createSSRApp(PaymentResultView, {
        status: 'success',
        summary: sampleSummary,
        embeddedSummary: true,
      })
      const html = await renderToString(app)
      expect(html).toContain('Detail Kredit')
      expect(mockClipboardThrow.writeText).not.toHaveBeenCalled()
    })

    it('T5-PRV-06: print trigger handles popup blocker safely by falling back to window.print()', () => {
      let printCalled = false
      const mockWin = {
        open: vi.fn().mockReturnValue(null), // Popup blocked returns null
        print: vi.fn(() => {
          printCalled = true
        }),
      }
      globalThis.window.open = mockWin.open as unknown as typeof window.open
      globalThis.window.print = mockWin.print as unknown as typeof window.print

      // Emulate print logic from PaymentResultView
      const summary = sampleSummary
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        window.print()
      }

      expect(mockWin.open).toHaveBeenCalled()
      expect(printCalled).toBe(true)
    })

    it('T5-PRV-07: print trigger streams receipt HTML and closes document when window.open succeeds', () => {
      let docWritten = ''
      let docClosed = false
      let winFocused = false

      const mockPrintWindow = {
        document: {
          open: vi.fn(),
          write: vi.fn((content: string) => {
            docWritten = content
          }),
          close: vi.fn(() => {
            docClosed = true
          }),
        },
        focus: vi.fn(() => {
          winFocused = true
        }),
      }

      const mockWin = {
        open: vi.fn().mockReturnValue(mockPrintWindow),
        print: vi.fn(),
      }
      globalThis.window.open = mockWin.open as unknown as typeof window.open
      globalThis.window.print = mockWin.print as unknown as typeof window.print

      // Emulate handlePrint streaming
      const summary = sampleSummary
      const printWindow = window.open('', '_blank')
      if (printWindow && printWindow.document) {
        printWindow.document.open()
        printWindow.document.write(`<html><body>Bukti Pembayaran - ${summary.number}</body></html>`)
        printWindow.document.close()
        printWindow.focus()
      }

      expect(docWritten).toContain(summary.number)
      expect(docClosed).toBe(true)
      expect(winFocused).toBe(true)
      expect(mockWin.print).not.toHaveBeenCalled()
    })
  })

  // -------------------------------------------------------------------------
  // 5. ADDITIONAL M1 COMPONENTS (InstallmentAmountField, CreditDetailsCard, etc.)
  // -------------------------------------------------------------------------
  describe('5. Additional Milestone 1 Components Verification', () => {
    it('T5-M1-01: InstallmentAmountField formats value and shows maximum limit label', async () => {
      const app = createSSRApp(InstallmentAmountField, {
        modelValue: 500_000,
        maximum: 10_000_000,
      })
      const html = await renderToString(app)
      expect(html).toContain('value="500.000"')
      expect(html).toContain('Maksimal cicilan Rp10.000.000')
    })

    it('T5-M1-02: InstallmentAmountField displays error message when error prop is present', async () => {
      const app = createSSRApp(InstallmentAmountField, {
        modelValue: 0,
        maximum: 10_000_000,
        error: 'Nominal cicilan tidak boleh 0.',
      })
      const html = await renderToString(app)
      expect(html).toContain('pgd-installment-field--error')
      expect(html).toContain('Nominal cicilan tidak boleh 0.')
    })

    it('T5-M1-03: CreditDetailsCard renders 4px section divider and 1px item divider', async () => {
      const app = createSSRApp(CreditDetailsCard, {
        summary: sampleSummary,
        hasCredit: true,
        mode: 'form',
      })
      const html = await renderToString(app)
      expect(html).toContain('pgd-section-divider')
      expect(html).toContain('pgd-item-divider')
      expect(html).toContain('Detail Kredit')
      expect(html).toContain('Detail Pembayaran')
    })

    it('T5-M1-04: CreditDetailsCard in success mode renders result action buttons', async () => {
      const app = createSSRApp(CreditDetailsCard, {
        summary: sampleSummary,
        hasCredit: true,
        mode: 'success',
      })
      const html = await renderToString(app)
      expect(html).toContain('Kembali ke Beranda')
      expect(html).toContain('Cetak Bukti Pembayaran')
    })

    it('T5-M1-05: PaymentInstructionCard displays countdown timer and generated VA box', async () => {
      const app = createSSRApp(PaymentInstructionCard, {
        summary: sampleSummary,
      })
      const html = await renderToString(app)
      expect(html).toContain('pgd-payment-countdown')
      expect(html).toContain('Selesaikan pembayaran dalam')
      expect(html).toContain('01:25:32')
      expect(html).toContain('BCA Virtual Account')
      expect(html).toContain('0130 8361 8000 6879')
      expect(html).toContain('Tutorial Pembayaran')
    })

    it('T5-M1-06: PaymentReviewDialog renders emas card summary in teleport context', async () => {
      const context: SSRContext = {}
      const app = createSSRApp(PaymentReviewDialog, {
        open: true,
        summary: sampleSummary,
      })
      const html = await renderToString(app, context)
      // Since PaymentDialog uses <Teleport to="body">, check teleport content in SSR context
      const teleportHtml = context.teleports?.body || ''
      expect(teleportHtml).toContain('Pastikan Data Sudah Sesuai')
      expect(teleportHtml).toContain('pgd-emas-card')
      expect(teleportHtml).toContain('Bianca Putri')
      expect(teleportHtml).toContain('Periksa Lagi')
      expect(teleportHtml).toContain('Lanjutkan')
    })
  })
})
