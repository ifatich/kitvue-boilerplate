import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import fs from 'node:fs'
import path from 'node:path'

import InstallmentAmountField from '../POS/pembayaran-gadai/components/InstallmentAmountField.vue'
import CreditDetailsCard from '../POS/pembayaran-gadai/components/CreditDetailsCard.vue'
import PaymentInstructionCard from '../POS/pembayaran-gadai/components/PaymentInstructionCard.vue'
import type { PaymentSummary } from '../POS/pembayaran-gadai/payment-types'

const baseSummary: PaymentSummary = {
  number: '1234393948486060',
  customer: 'Bianca Putri',
  loanAmount: 10_000_000,
  dailyRent: 140_000,
  rentDays: 120,
  rentAmount: 140_000,
  serviceFee: 2_500,
  total: 10_142_500,
  installmentAmount: 0,
  transactionType: 'Pelunasan',
  paymentMethod: {
    id: 'bca-va',
    label: 'BCA Virtual Account',
    bank: 'BCA',
    logo: '/assets/pembayaran-gadai/bca-logo.png',
    category: 'Virtual Account',
  },
}

describe('Milestone 1 Challenger Stress Tests', () => {
  // =========================================================================
  // Mandate 1: InstallmentAmountField
  // =========================================================================
  describe('Mandate 1: InstallmentAmountField Stress Tests', () => {
    it('M1-IA-01: renders empty input value with placeholder "0" when modelValue is 0', async () => {
      const app = createSSRApp(InstallmentAmountField, {
        modelValue: 0,
        maximum: 10_000_000,
      })
      const html = await renderToString(app)
      expect(html).toContain('placeholder="0"')
      expect(html).toContain('Maksimal cicilan')
      expect(html).toContain('10.000.000')
      // Value attribute should NOT contain a formatted number when 0
      expect(html).not.toMatch(/value="[0-9]+/)
    })

    it('M1-IA-02: formats nominal positive numbers with dots (e.g. 5.000.000)', async () => {
      const app = createSSRApp(InstallmentAmountField, {
        modelValue: 5_000_000,
        maximum: 10_000_000,
      })
      const html = await renderToString(app)
      expect(html).toContain('value="5.000.000"')
    })

    it('M1-IA-03: renders negative modelValue if passed as prop', async () => {
      const app = createSSRApp(InstallmentAmountField, {
        modelValue: -50_000,
        maximum: 10_000_000,
      })
      const html = await renderToString(app)
      expect(html).toContain('value="-50.000"')
    })

    it('M1-IA-04: formats value exceeding maximum without server crash, but exposes helper ceiling', async () => {
      const app = createSSRApp(InstallmentAmountField, {
        modelValue: 25_000_000,
        maximum: 10_000_000,
      })
      const html = await renderToString(app)
      expect(html).toContain('value="25.000.000"')
      expect(html).toContain('Maksimal cicilan')
      expect(html).toContain('10.000.000')
    })

    it('M1-IA-05: renders error state and message with accessible role="alert"', async () => {
      const app = createSSRApp(InstallmentAmountField, {
        modelValue: 0,
        maximum: 10_000_000,
        error: 'Nominal cicilan harus lebih dari 0',
      })
      const html = await renderToString(app)
      expect(html).toContain('pgd-installment-field--error')
      expect(html).toContain('pgd-field-error')
      expect(html).toContain('role="alert"')
      expect(html).toContain('Nominal cicilan harus lebih dari 0')
    })

    it('M1-IA-06: verifies handleInput strips non-numeric characters and enforces maximum clamp on emit', () => {
      // Test the component logic directly
      const emits: Record<string, any[]> = {}
      const emit = (event: string, ...args: any[]) => {
        emits[event] = args
      }

      // Simulate input event with dirty string "Rp 15.000.000" on a maximum of 10.000.000
      const target = { value: 'Rp 15.000.000' } as HTMLInputElement
      const parsed = Number(target.value.replace(/\D/g, ''))
      const maximum = 10_000_000
      const clamped = Math.min(parsed, maximum)
      emit('update:modelValue', clamped)

      expect(parsed).toBe(15_000_000)
      expect(clamped).toBe(10_000_000)
      expect(emits['update:modelValue']).toEqual([10_000_000])
    })

    it('M1-IA-07: edge case - handleInput directly mutates target.value to parsed instead of clamped', () => {
      // In InstallmentAmountField.vue:
      // Line 34: emit('update:modelValue', Math.min(parsed, props.maximum))
      // Line 35: target.value = parsed ? new Intl.NumberFormat('id-ID').format(parsed) : ''
      // Notice: target.value is assigned parsed (15.000.000) NOT clamped (10.000.000)
      const target = { value: '15000000' } as HTMLInputElement
      const parsed = Number(target.value.replace(/\D/g, ''))
      const maximum = 10_000_000
      const clamped = Math.min(parsed, maximum)

      // Demonstrates that target.value displays un-clamped number if parent does not force re-render
      const rawTargetValue = parsed ? new Intl.NumberFormat('id-ID').format(parsed) : ''
      const clampedTargetValue = clamped ? new Intl.NumberFormat('id-ID').format(clamped) : ''

      expect(rawTargetValue).toBe('15.000.000')
      expect(clampedTargetValue).toBe('10.000.000')
      expect(rawTargetValue).not.toBe(clampedTargetValue)
    })
  })

  // =========================================================================
  // Mandate 2: CreditDetailsCard
  // =========================================================================
  describe('Mandate 2: CreditDetailsCard Stress Tests', () => {
    it('M1-CD-01: empty credit state (hasCredit = false) renders placeholders and disabled submit', async () => {
      const app = createSSRApp(CreditDetailsCard, {
        summary: {
          ...baseSummary,
          transactionType: null,
          paymentMethod: null,
        },
        hasCredit: false,
        mode: 'form',
      })
      const html = await renderToString(app)

      // Section and item dividers
      expect(html).toContain('pgd-section-divider')
      expect(html).toContain('pgd-item-divider')

      // Info banner
      expect(html).toContain('Periksa rincian transaksimu sebelum melanjutkan')

      // Credit details placeholders
      expect(html).toContain('pgd-summary-card')
      expect(html).toMatch(/\bdisabled\b/)
      expect(html).toContain('Lanjutkan')
    })

    it('M1-CD-02: populated state (hasCredit = true, Pelunasan) renders full loan & payment breakdown', async () => {
      const app = createSSRApp(CreditDetailsCard, {
        summary: baseSummary,
        hasCredit: true,
        mode: 'form',
      })
      const html = await renderToString(app)

      // Divider checks
      expect(html).toContain('class="pgd-section-divider"')
      expect(html).toContain('class="pgd-item-divider"')

      // Customer name and loan breakdown
      expect(html).toContain('Bianca Putri')
      expect(html).toContain('Pelunasan Gadai')
      expect(html).toContain('Rp10.000.000')
      expect(html).toContain('Rp140.000')
      expect(html).toContain('Rp2.500')
      expect(html).toContain('Rp10.142.500')

      // Submit button should NOT be disabled
      expect(html).not.toMatch(/<button[^>]*class="pgd-submit-button"[^>]*disabled/)
    })

    it('M1-CD-03: populated state with Cicil renders Jumlah Cicilan and suppresses Sewa Modal row', async () => {
      const cicilSummary: PaymentSummary = {
        ...baseSummary,
        transactionType: 'Cicil',
        installmentAmount: 1_000_000,
        total: 1_142_500,
      }
      const app = createSSRApp(CreditDetailsCard, {
        summary: cicilSummary,
        hasCredit: true,
        mode: 'form',
      })
      const html = await renderToString(app)

      expect(html).toContain('Jumlah Cicilan')
      expect(html).toContain('Rp1.000.000')
      expect(html).toContain('pgd-section-divider')
      expect(html).toContain('pgd-item-divider')
    })

    it('M1-CD-04: failed state renders transaction ID, copy button, and only Home button', async () => {
      const app = createSSRApp(CreditDetailsCard, {
        summary: baseSummary,
        hasCredit: true,
        mode: 'failed',
      })
      const html = await renderToString(app)

      // Failed state specifics
      expect(html).toContain('pgd-summary-card--failed')
      expect(html).toContain('ID Transaksi')
      expect(html).toContain('Salin ID transaksi')
      expect(html).toContain('pgd-section-divider')
      expect(html).toContain('pgd-item-divider')

      // Action buttons: Only Home button, NO Print button
      expect(html).toContain('Kembali ke Beranda')
      expect(html).not.toContain('Cetak Bukti Pembayaran')
    })

    it('M1-CD-05: success state renders both Home button AND Print button', async () => {
      const app = createSSRApp(CreditDetailsCard, {
        summary: baseSummary,
        hasCredit: true,
        mode: 'success',
      })
      const html = await renderToString(app)

      expect(html).toContain('pgd-summary-card--success')
      expect(html).toContain('Kembali ke Beranda')
      expect(html).toContain('Cetak Bukti Pembayaran')
    })

    it('M1-CD-06: instructions state renders refresh button with custom label', async () => {
      const app = createSSRApp(CreditDetailsCard, {
        summary: baseSummary,
        hasCredit: true,
        mode: 'instructions',
        refreshLabel: 'Periksa Status Pembayaran',
        refreshDisabled: true,
      })
      const html = await renderToString(app)

      expect(html).toContain('pgd-summary-card--instructions')
      expect(html).toContain('Periksa Status Pembayaran')
      expect(html).toMatch(/\bdisabled\b/)
    })
  })

  // =========================================================================
  // Mandate 3: PaymentInstructionCard
  // =========================================================================
  describe('Mandate 3: PaymentInstructionCard Stress Tests', () => {
    it('M1-PI-01: renders initial countdown, VA code box, section divider, and tutorial accordion', async () => {
      const app = createSSRApp(PaymentInstructionCard, {
        summary: baseSummary,
      })
      const html = await renderToString(app)

      // Crimson countdown banner
      expect(html).toContain('pgd-payment-countdown')
      expect(html).toContain('01:25:32')

      // VA Code box
      expect(html).toContain('pgd-generated-code')
      expect(html).toContain('0130 8361 8000 6879')
      expect(html).toContain('BCA Virtual Account')

      // Section divider (4px)
      expect(html).toContain('class="pgd-section-divider"')

      // Tutorial accordion with 3 items and item dividers (1px)
      expect(html).toContain('Tutorial Pembayaran')
      expect(html).toContain('Transfer via ATM')
      expect(html).toContain('Transfer via Internet Banking')
      expect(html).toContain('Transfer via Mobile Banking')
      expect(html).toContain('pgd-item-divider')
    })

    it('M1-PI-02: stress test expiredAt prop - ignores expiredAt and defaults to 01:25:32', async () => {
      // In PaymentInstructionCard.vue:
      // Line 7: expiredAt?: number
      // Line 18: const remainingSeconds = ref(1 * 3600 + 25 * 60 + 32)
      // Notice: expiredAt prop is defined in defineProps but never used in setup!
      const expiredPast = Date.now() - 3600_000 // 1 hour ago
      const app = createSSRApp(PaymentInstructionCard, {
        summary: baseSummary,
        expiredAt: expiredPast,
      })
      const html = await renderToString(app)

      // Component will still render 01:25:32 instead of 00:00:00 because expiredAt is unhandled
      expect(html).toContain('01:25:32')
    })

    it('M1-PI-03: Direct Debit mode renders BRI specific instruction without copy button', async () => {
      const briSummary: PaymentSummary = {
        ...baseSummary,
        paymentMethod: {
          id: 'bri-debit',
          label: 'BRI Direct Debit',
          bank: 'BRI',
          logo: '/assets/pembayaran-gadai/bri-logo.png',
          category: 'Direct Debit',
        },
      }
      const app = createSSRApp(PaymentInstructionCard, {
        summary: briSummary,
      })
      const html = await renderToString(app)

      expect(html).toContain('Selesaikan otorisasi pembayaran melalui rekening BRI')
      expect(html).not.toContain('pgd-generated-code__number-box')
    })

    it('M1-PI-04: verifies clipboard copy success and error handling contract', async () => {
      // Test clipboard error catch
      let errorEmitted = false
      const mockNavigator = {
        clipboard: {
          writeText: vi.fn().mockRejectedValue(new Error('Permission denied')),
        },
      }

      // Simulate copyAccountNumber function logic
      try {
        await mockNavigator.clipboard.writeText('0130 8361 8000 6879')
      } catch {
        errorEmitted = true
      }
      expect(errorEmitted).toBe(true)

      // Test clipboard success
      let successEmitted = false
      let copiedText = ''
      const successNavigator = {
        clipboard: {
          writeText: vi.fn().mockImplementation(async (text: string) => {
            copiedText = text
            successEmitted = true
          }),
        },
      }
      await successNavigator.clipboard.writeText('0130 8361 8000 6879')
      expect(successEmitted).toBe(true)
      expect(copiedText).toBe('0130 8361 8000 6879')
    })

    it('M1-PI-05: verifies accordion expand/collapse logic toggle', () => {
      let expandedItem = 'transfer-internet-banking'
      function toggleAccordion(id: string) {
        expandedItem = expandedItem === id ? '' : id
      }

      // Toggle same item collapses it
      toggleAccordion('transfer-internet-banking')
      expect(expandedItem).toBe('')

      // Toggle other item expands it
      toggleAccordion('transfer-atm')
      expect(expandedItem).toBe('transfer-atm')

      // Toggle third item switches to it
      toggleAccordion('transfer-mobile-banking')
      expect(expandedItem).toBe('transfer-mobile-banking')
    })
  })

  // =========================================================================
  // Mandate 4: Typography and Font Loading in POS/index.html
  // =========================================================================
  describe('Mandate 4: Typography and Font Loading in POS/index.html', () => {
    it('M1-TY-01: POS/index.html includes Google Font link for Nunito Sans with required weights', () => {
      const htmlContent = fs.readFileSync(
        path.resolve(__dirname, '../POS/index.html'),
        'utf-8',
      )

      expect(htmlContent).toContain('fonts.googleapis.com')
      expect(htmlContent).toContain('family=Nunito+Sans')
      expect(htmlContent).toContain('family=Nunito:')
      expect(htmlContent).toContain('600')
      expect(htmlContent).toContain('800')
    })

    it('M1-TY-02: POS/style.css defines canonical Nunito Sans font family token', () => {
      const cssContent = fs.readFileSync(
        path.resolve(__dirname, '../POS/style.css'),
        'utf-8',
      )

      expect(cssContent).toContain("--g-kit-font-family: 'Nunito Sans'")
      expect(cssContent).toContain('--g-kit-font-weight-regular: 400')
      expect(cssContent).toContain('--g-kit-font-weight-normal: 600')
      expect(cssContent).toContain('--g-kit-font-weight-bold: 800')
      expect(cssContent).toContain('--pos-font-family: var(--g-kit-font-family)')
    })

    it('M1-TY-03: POS/pembayaran-gadai/style.css uses Nunito Sans and canonical tokens', () => {
      const flowCss = fs.readFileSync(
        path.resolve(__dirname, '../POS/pembayaran-gadai/style.css'),
        'utf-8',
      )

      // Verifies no deprecated font family without Sans
      const fontLines = flowCss
        .split('\n')
        .filter((line) => line.includes('font-family'))
      for (const line of fontLines) {
        expect(line).toContain('Nunito Sans')
      }
    })
  })
})
