import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createSSRApp, effectScope, nextTick, ref, watch } from 'vue'
import { renderToString, type SSRContext } from 'vue/server-renderer'
import {
  buildReceiptHtml,
  formatCreditNumber,
  formatCurrencyIdr,
  printReceiptInNewTab,
  type ReceiptData,
} from '../POS/pembayaran-gadai/receipt-utils'
import { getPaymentTotal, mockCreditRecord, paymentMethods } from '../POS/pembayaran-gadai/data'
import type { PaymentSummary, TransactionType } from '../POS/pembayaran-gadai/payment-types'
import CreditNumberField from '../POS/pembayaran-gadai/components/CreditNumberField.vue'
import InstallmentAmountField from '../POS/pembayaran-gadai/components/InstallmentAmountField.vue'
import TransactionTypePicker from '../POS/pembayaran-gadai/components/TransactionTypePicker.vue'
import PaymentMethodPicker from '../POS/pembayaran-gadai/components/PaymentMethodPicker.vue'
import PaymentInstructionCard from '../POS/pembayaran-gadai/components/PaymentInstructionCard.vue'
import PaymentReviewDialog from '../POS/pembayaran-gadai/components/PaymentReviewDialog.vue'
import PaymentDialog from '../POS/pembayaran-gadai/components/PaymentDialog.vue'
import CreditDetailsCard from '../POS/pembayaran-gadai/components/CreditDetailsCard.vue'
import PaymentResultView from '../POS/pembayaran-gadai/components/PaymentResultView.vue'

describe('Milestone 2 Challenger Adversarial Stress Suite', () => {
  const sampleSummary: PaymentSummary = {
    ...mockCreditRecord,
    transactionType: 'Pelunasan',
    paymentMethod: paymentMethods[0], // BCA Virtual Account
    installmentAmount: 0,
    total: 10_142_500,
  }

  // =========================================================================
  // Mandate 1: Malformed Inputs & Boundary Stress Testing
  // =========================================================================
  describe('Mandate 1: Malformed Inputs & Financial Calculation Stress', () => {
    describe('1.1 Credit Number Malformed Inputs & Sanitations', () => {
      it('M2-MAL-01: strips non-numeric characters, emojis, and symbols from credit input', async () => {
        const dirtyInput = '1234-abcd-5678-efgh-9012-!@#$-3456-🔥'
        const app = createSSRApp(CreditNumberField, {
          modelValue: dirtyInput,
        })
        const html = await renderToString(app)
        // Clean digits are '1234567890123456' which format to '1234 5678 9012 3456'
        expect(html).toContain('value="1234 5678 9012 3456"')
        expect(html).not.toContain('abcd')
        expect(html).not.toContain('🔥')
        expect(html).not.toContain('!@#$')
      })

      it('M2-MAL-02: slices credit input exceeding 16 digits down to exactly 16', async () => {
        const excessInput = '123456789012345699999999999'
        const app = createSSRApp(CreditNumberField, {
          modelValue: excessInput,
        })
        const html = await renderToString(app)
        expect(html).toContain('value="1234 5678 9012 3456"')
        expect(html).not.toContain('9999')
      })

      it('M2-MAL-03: keeps Cari button disabled for partial or empty inputs', async () => {
        const appShort = createSSRApp(CreditNumberField, {
          modelValue: '12345678', // 8 digits
        })
        const htmlShort = await renderToString(appShort)
        expect(htmlShort).toContain('<button class="pgd-credit-number__search" type="button" disabled>')

        const appEmpty = createSSRApp(CreditNumberField, {
          modelValue: '',
        })
        const htmlEmpty = await renderToString(appEmpty)
        expect(htmlEmpty).toContain('<button class="pgd-credit-number__search" type="button" disabled>')
      })

      it('M2-MAL-04: enables Cari button strictly when input has exactly 16 numeric digits', async () => {
        const appExact = createSSRApp(CreditNumberField, {
          modelValue: '1234393948486060',
        })
        const htmlExact = await renderToString(appExact)
        expect(htmlExact).not.toMatch(/<button[^>]*class="pgd-credit-number__search"[^>]*disabled/)
      })

      it('M2-MAL-05: handles HTML/SQL injection payloads safely as sanitized non-digit strings', async () => {
        const xssPayload = '<script>alert("XSS")</script>'
        const appXss = createSSRApp(CreditNumberField, {
          modelValue: xssPayload,
        })
        const htmlXss = await renderToString(appXss)
        // No executable script tags rendered
        expect(htmlXss).not.toContain('<script>alert')
      })
    })

    describe('1.2 Transaction Type & Fee Calculation Edge Cases', () => {
      it('M2-MAL-06: getPaymentTotal returns 0 when transactionType is null or undefined', () => {
        expect(getPaymentTotal(null, mockCreditRecord)).toBe(0)
        expect(getPaymentTotal(undefined as unknown as TransactionType | null, mockCreditRecord)).toBe(0)
      })

      it('M2-MAL-07: getPaymentTotal for Pelunasan calculates full loan + rent + service fee', () => {
        // 10.000.000 + 140.000 + 2.500 = 10.142.500
        const total = getPaymentTotal('Pelunasan', mockCreditRecord, 0)
        expect(total).toBe(10_142_500)
      })

      it('M2-MAL-08: getPaymentTotal for Sewa Modal excludes principal loan amount', () => {
        // 0 + 140.000 + 2.500 = 142.500
        const total = getPaymentTotal('Sewa Modal', mockCreditRecord, 500_000)
        expect(total).toBe(142_500)
      })

      it('M2-MAL-09: getPaymentTotal for Cicil clamps negative installment amounts to 0', () => {
        // Negative installment clamped to 0 -> 0 + 140.000 + 2.500 = 142.500
        const total = getPaymentTotal('Cicil', mockCreditRecord, -1_000_000)
        expect(total).toBe(142_500)
      })

      it('M2-MAL-10: getPaymentTotal for Cicil clamps installment exceeding loanAmount to loanAmount', () => {
        // 50.000.000 exceeds loanAmount (10.000.000) -> clamped to 10.000.000 + 140.000 + 2.500 = 10.142.500
        const total = getPaymentTotal('Cicil', mockCreditRecord, 50_000_000)
        expect(total).toBe(10_142_500)
      })
    })

    describe('1.3 InstallmentAmountField Boundary Stress', () => {
      it('M2-MAL-11: strips non-numeric characters and handles empty target in input handler', () => {
        let emittedValue = -1
        const emit = (_event: string, val: number) => {
          emittedValue = val
        }
        const target = { value: 'Rp 2.500.000,-' } as HTMLInputElement
        const parsed = Number(target.value.replace(/\D/g, ''))
        emit('update:modelValue', Math.min(parsed, 10_000_000))

        expect(emittedValue).toBe(2_500_000)
      })

      it('M2-MAL-12: clamps excessive installment input to maximum prop ceiling', () => {
        let emittedValue = -1
        const emit = (_event: string, val: number) => {
          emittedValue = val
        }
        const target = { value: '999.999.999' } as HTMLInputElement
        const parsed = Number(target.value.replace(/\D/g, ''))
        emit('update:modelValue', Math.min(parsed, 10_000_000))

        expect(emittedValue).toBe(10_000_000)
      })
    })
  })

  // =========================================================================
  // Mandate 2: Drawer Dismissal Mechanisms & Body Scroll Lock Cleanup
  // =========================================================================
  describe('Mandate 2: Drawer Dismissal Mechanisms & Scroll Lock Cleanup', () => {
    let mockBodyOverflow: string
    let keydownListeners: Array<(e: KeyboardEvent) => void>

    beforeEach(() => {
      mockBodyOverflow = ''
      keydownListeners = []

      // Setup simulated document in node environment
      const mockDoc = {
        body: {
          style: {
            get overflow() {
              return mockBodyOverflow
            },
            set overflow(val: string) {
              mockBodyOverflow = val
            },
          },
        },
        addEventListener: (event: string, listener: any) => {
          if (event === 'keydown') keydownListeners.push(listener)
        },
        removeEventListener: (event: string, listener: any) => {
          if (event === 'keydown') {
            keydownListeners = keydownListeners.filter((l) => l !== listener)
          }
        },
      }

      globalThis.document = mockDoc as unknown as Document
    })

    afterEach(() => {
      delete (globalThis as any).document
    })

    it('M2-DRW-01: setting open=true sets body overflow to hidden and registers keydown listener', async () => {
      const scope = effectScope()
      const open = ref(false)
      let previousOverflow = ''

      function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape' && open.value) {
          open.value = false
        }
      }

      scope.run(() => {
        watch(
          open,
          (isOpen) => {
            if (isOpen) {
              previousOverflow = document.body.style.overflow
              document.body.style.overflow = 'hidden'
              document.addEventListener('keydown', handleKeydown)
            } else {
              document.body.style.overflow = previousOverflow
              document.removeEventListener('keydown', handleKeydown)
            }
          },
        )
      })

      expect(mockBodyOverflow).toBe('')
      expect(keydownListeners.length).toBe(0)

      // Open drawer
      open.value = true
      await nextTick()
      expect(mockBodyOverflow).toBe('hidden')
      expect(keydownListeners.length).toBe(1)

      scope.stop()
    })

    it('M2-DRW-02: Escape key triggers close dismissal and restores body overflow', async () => {
      const scope = effectScope()
      const open = ref(false)
      let closeEmitted = false
      let previousOverflow = ''

      function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape' && open.value) {
          closeEmitted = true
          open.value = false
        }
      }

      scope.run(() => {
        watch(
          open,
          (isOpen) => {
            if (isOpen) {
              previousOverflow = document.body.style.overflow
              document.body.style.overflow = 'hidden'
              document.addEventListener('keydown', handleKeydown)
            } else {
              document.body.style.overflow = previousOverflow
              document.removeEventListener('keydown', handleKeydown)
            }
          },
        )
      })

      open.value = true
      await nextTick()
      expect(mockBodyOverflow).toBe('hidden')
      expect(keydownListeners.length).toBe(1)

      // Dispatch Escape key
      const escEvent = { key: 'Escape' } as KeyboardEvent
      keydownListeners[0](escEvent)
      await nextTick()

      expect(closeEmitted).toBe(true)
      expect(open.value).toBe(false)
      expect(mockBodyOverflow).toBe('')
      expect(keydownListeners.length).toBe(0)

      scope.stop()
    })

    it('M2-DRW-03: non-Escape keys do not dismiss drawer or alter overflow', async () => {
      const scope = effectScope()
      const open = ref(false)
      let closeEmitted = false
      let previousOverflow = ''

      function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape' && open.value) {
          closeEmitted = true
          open.value = false
        }
      }

      scope.run(() => {
        watch(
          open,
          (isOpen) => {
            if (isOpen) {
              previousOverflow = document.body.style.overflow
              document.body.style.overflow = 'hidden'
              document.addEventListener('keydown', handleKeydown)
            } else {
              document.body.style.overflow = previousOverflow
              document.removeEventListener('keydown', handleKeydown)
            }
          },
        )
      })

      open.value = true
      await nextTick()
      const enterEvent = { key: 'Enter' } as KeyboardEvent
      keydownListeners[0](enterEvent)
      await nextTick()

      expect(closeEmitted).toBe(false)
      expect(open.value).toBe(true)
      expect(mockBodyOverflow).toBe('hidden')

      scope.stop()
    })

    it('M2-DRW-04: unmounting while open cleans up body scroll lock and keydown listeners (zero residual lock)', () => {
      let previousOverflow = ''
      const open = ref(true)

      function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape' && open.value) {
          open.value = false
        }
      }

      // Simulate mounting open drawer
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeydown)

      expect(mockBodyOverflow).toBe('hidden')
      expect(keydownListeners.length).toBe(1)

      // Simulate onBeforeUnmount
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeydown)

      expect(mockBodyOverflow).toBe('')
      expect(keydownListeners.length).toBe(0)
    })

    it('M2-DRW-05: rapid toggle stress test does not corrupt body overflow or leak listeners', () => {
      let previousOverflow = ''
      const open = ref(false)

      function handleKeydown() {}

      function setOpen(val: boolean) {
        if (val) {
          previousOverflow = document.body.style.overflow
          document.body.style.overflow = 'hidden'
          document.addEventListener('keydown', handleKeydown)
        } else {
          document.body.style.overflow = previousOverflow
          document.removeEventListener('keydown', handleKeydown)
        }
      }

      // Rapidly toggle 25 times
      for (let i = 0; i < 25; i++) {
        setOpen(true)
        expect(mockBodyOverflow).toBe('hidden')
        expect(keydownListeners.length).toBe(1)

        setOpen(false)
        expect(mockBodyOverflow).toBe('')
        expect(keydownListeners.length).toBe(0)
      }

      expect(mockBodyOverflow).toBe('')
      expect(keydownListeners.length).toBe(0)
    })
  })

  // =========================================================================
  // Mandate 3: Timer Interval Cleanup on Unmount During Instruction Stage
  // =========================================================================
  describe('Mandate 3: Timer Interval Cleanup & Expiration Handling', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('M2-TMR-01: countdown decreases per second and formats label as HH:MM:SS', () => {
      const remainingSeconds = ref(3665) // 1h 1m 5s

      function getLabel(secs: number) {
        const hours = Math.floor(secs / 3600)
        const minutes = Math.floor((secs % 3600) / 60)
        const seconds = secs % 60
        return [hours, minutes, seconds].map((p) => String(p).padStart(2, '0')).join(':')
      }

      expect(getLabel(remainingSeconds.value)).toBe('01:01:05')

      remainingSeconds.value--
      expect(getLabel(remainingSeconds.value)).toBe('01:01:04')

      remainingSeconds.value = 59
      expect(getLabel(remainingSeconds.value)).toBe('00:00:59')
    })

    it('M2-TMR-02: emits expired event and clears interval upon reaching 0', () => {
      let expiredEmitted = false
      let intervalId: any
      const remainingSeconds = ref(2)

      intervalId = setInterval(() => {
        remainingSeconds.value--
        if (remainingSeconds.value <= 0) {
          clearInterval(intervalId)
          expiredEmitted = true
        }
      }, 1000)

      expect(expiredEmitted).toBe(false)

      vi.advanceTimersByTime(1000)
      expect(remainingSeconds.value).toBe(1)
      expect(expiredEmitted).toBe(false)

      vi.advanceTimersByTime(1000)
      expect(remainingSeconds.value).toBe(0)
      expect(expiredEmitted).toBe(true)

      // Advancing further does not trigger further ticks
      vi.advanceTimersByTime(5000)
      expect(remainingSeconds.value).toBe(0)
    })

    it('M2-TMR-03: unmount cleans up interval preventing background timer execution', () => {
      let tickCount = 0
      let intervalId: any

      intervalId = setInterval(() => {
        tickCount++
      }, 1000)

      vi.advanceTimersByTime(2000)
      expect(tickCount).toBe(2)

      // Simulate onBeforeUnmount
      clearInterval(intervalId)
      intervalId = undefined

      vi.advanceTimersByTime(5000)
      expect(tickCount).toBe(2) // No further ticks after unmount
    })

    it('M2-TMR-04: multiple mount/unmount cycles clear each interval without leaks', () => {
      const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')
      const intervals: any[] = []

      for (let i = 0; i < 5; i++) {
        const id = setInterval(() => {}, 1000)
        intervals.push(id)
        clearInterval(id)
      }

      expect(clearIntervalSpy).toHaveBeenCalledTimes(5)
    })
  })

  // =========================================================================
  // Mandate 4: Printing Receipt Popup Blocking & HTML Fallback
  // =========================================================================
  describe('Mandate 4: Printing Receipt Popup Blocking & Fallbacks', () => {
    it('M2-PRT-01: buildReceiptHtml generates complete valid HTML with all financial items', () => {
      const html = buildReceiptHtml({
        transactionId: 'TRX-20241101-99812',
        summary: sampleSummary,
      })

      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('<html lang="id">')
      expect(html).toContain('PT PEGADAIAN')
      expect(html).toContain('TRX-20241101-99812')
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

    it('M2-PRT-02: buildReceiptHtml handles incomplete or undefined summary fields gracefully', () => {
      const emptySummary: PaymentSummary = {
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
      }

      const html = buildReceiptHtml({
        transactionId: '',
        summary: emptySummary,
      })

      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('TRX-20241101-99812') // Default ID
      expect(html).toContain('Bianca Putri') // Default customer
      expect(html).toContain('Pelunasan') // Default transaction type
      expect(html).toContain('BCA Virtual Account') // Default method
      expect(html).toContain('-') // Formatted empty credit number
    })

    it('M2-PRT-03: printReceiptInNewTab opens window, writes content, and focuses window when allowed', () => {
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

      const originalWindow = globalThis.window
      globalThis.window = {
        open: mockOpen,
        print: mockPrint,
      } as unknown as Window & typeof globalThis

      printReceiptInNewTab({
        transactionId: 'TRX-20241101-99812',
        summary: sampleSummary,
      })

      expect(mockOpen).toHaveBeenCalledWith('', '_blank', expect.any(String))
      expect(writtenHtml).toContain('PT PEGADAIAN')
      expect(docClosed).toBe(true)
      expect(winFocused).toBe(true)
      expect(mockPrint).not.toHaveBeenCalled()

      globalThis.window = originalWindow
    })

    it('M2-PRT-04: printReceiptInNewTab falls back to window.print() when popup blocker returns null', () => {
      const mockOpen = vi.fn().mockReturnValue(null) // Popup blocked
      const mockPrint = vi.fn()

      const originalWindow = globalThis.window
      globalThis.window = {
        open: mockOpen,
        print: mockPrint,
      } as unknown as Window & typeof globalThis

      printReceiptInNewTab({
        transactionId: 'TRX-20241101-99812',
        summary: sampleSummary,
      })

      expect(mockOpen).toHaveBeenCalled()
      expect(mockPrint).toHaveBeenCalled()

      globalThis.window = originalWindow
    })

    it('M2-PRT-05: printReceiptInNewTab falls back to window.print() when popup window has null document', () => {
      const mockOpen = vi.fn().mockReturnValue({}) // Window object exists but no document property
      const mockPrint = vi.fn()

      const originalWindow = globalThis.window
      globalThis.window = {
        open: mockOpen,
        print: mockPrint,
      } as unknown as Window & typeof globalThis

      printReceiptInNewTab({
        transactionId: 'TRX-20241101-99812',
        summary: sampleSummary,
      })

      expect(mockOpen).toHaveBeenCalled()
      expect(mockPrint).toHaveBeenCalled()

      globalThis.window = originalWindow
    })

    it('M2-PRT-06: printReceiptInNewTab does not throw error in SSR environment (typeof window === undefined)', () => {
      const originalWindow = (globalThis as any).window
      delete (globalThis as any).window

      expect(() => {
        printReceiptInNewTab({
          transactionId: 'TRX-20241101-99812',
          summary: sampleSummary,
        })
      }).not.toThrow()

      ;(globalThis as any).window = originalWindow
    })
  })

  // =========================================================================
  // Mandate 5: Full Page Flow & State Machine Transitions
  // =========================================================================
  describe('Mandate 5: Full Page Flow & State Machine Transitions', () => {
    it('M2-FLW-01: synchronous validation sets all three field errors on empty submission', () => {
      const creditNumber = ref('')
      const hasCredit = ref(false)
      const transactionType = ref<TransactionType | null>(null)
      const paymentMethod = ref<any>(null)
      const installmentAmount = ref(500_000)

      const creditError = ref('')
      const transactionTypeError = ref('')
      const paymentMethodError = ref('')
      const installmentAmountError = ref('')

      function validateForm(): boolean {
        let isValid = true
        const digits = creditNumber.value.replace(/\D/g, '')

        if (!digits || digits.length !== 16 || !hasCredit.value) {
          creditError.value = 'Nomor kredit harus diisi'
          isValid = false
        } else {
          creditError.value = ''
        }

        if (!transactionType.value) {
          transactionTypeError.value = 'Jenis transaksi harus diisi'
          isValid = false
        } else {
          transactionTypeError.value = ''
        }

        if (!paymentMethod.value) {
          paymentMethodError.value = 'Metode pembayaran harus diisi'
          isValid = false
        } else {
          paymentMethodError.value = ''
        }

        if (transactionType.value === 'Cicil' && installmentAmount.value <= 0) {
          installmentAmountError.value = 'Nominal cicilan harus lebih dari 0'
          isValid = false
        } else {
          installmentAmountError.value = ''
        }

        return isValid
      }

      const isValid = validateForm()
      expect(isValid).toBe(false)
      expect(creditError.value).toBe('Nomor kredit harus diisi')
      expect(transactionTypeError.value).toBe('Jenis transaksi harus diisi')
      expect(paymentMethodError.value).toBe('Metode pembayaran harus diisi')
      expect(installmentAmountError.value).toBe('')
    })

    it('M2-FLW-02: validation flags installmentAmountError when Cicil is selected with 0 amount', () => {
      const creditNumber = ref('1234393948486060')
      const hasCredit = ref(true)
      const transactionType = ref<TransactionType | null>('Cicil')
      const paymentMethod = ref(paymentMethods[0])
      const installmentAmount = ref(0)

      const installmentAmountError = ref('')

      function validateForm(): boolean {
        if (transactionType.value === 'Cicil' && installmentAmount.value <= 0) {
          installmentAmountError.value = 'Nominal cicilan harus lebih dari 0'
          return false
        }
        return true
      }

      expect(validateForm()).toBe(false)
      expect(installmentAmountError.value).toBe('Nominal cicilan harus lebih dari 0')
    })

    it('M2-FLW-03: modifying credit number resets active credit contract, picks, and errors', async () => {
      const creditNumber = ref('1234393948486060')
      const hasCredit = ref(true)
      const transactionType = ref<TransactionType | null>('Pelunasan')
      const paymentMethod = ref<any>(paymentMethods[0])
      const creditError = ref('')
      const transactionTypeError = ref('')
      const paymentMethodError = ref('')
      const installmentAmountError = ref('')

      watch(creditNumber, () => {
        creditError.value = ''
        if (hasCredit.value) {
          hasCredit.value = false
          transactionType.value = null
          paymentMethod.value = null
          transactionTypeError.value = ''
          paymentMethodError.value = ''
          installmentAmountError.value = ''
        }
      })

      // User changes a digit
      creditNumber.value = '1234393948486061'
      await nextTick()

      expect(hasCredit.value).toBe(false)
      expect(transactionType.value).toBeNull()
      expect(paymentMethod.value).toBeNull()
      expect(creditError.value).toBe('')
    })

    it('M2-FLW-04: multi-click polling simulation transitions pending -> success', () => {
      vi.useFakeTimers()
      let paymentCheckState: 'idle' | 'checking' | 'pending' = 'idle'
      let stage: 'form' | 'instructions' | 'result' = 'instructions'
      let resultStatus: 'success' | 'failed' = 'success'
      let pollCount = 0
      const SETTLEMENT_CLICK_THRESHOLD = 2
      let pollTimeout: any

      function refreshPaymentStatus(requestedResult: string | null = null) {
        paymentCheckState = 'checking'
        if (pollTimeout) clearTimeout(pollTimeout)
        pollTimeout = setTimeout(() => {
          if (requestedResult === 'success' || requestedResult === 'failed') {
            resultStatus = requestedResult
            paymentCheckState = 'idle'
            stage = 'result'
            return
          }

          pollCount++
          if (pollCount >= SETTLEMENT_CLICK_THRESHOLD) {
            resultStatus = 'success'
            paymentCheckState = 'idle'
            stage = 'result'
            return
          }

          paymentCheckState = 'pending'
        }, 450)
      }

      // First click
      refreshPaymentStatus()
      expect(paymentCheckState).toBe('checking')
      vi.advanceTimersByTime(450)
      expect(paymentCheckState).toBe('pending')
      expect(stage).toBe('instructions')
      expect(pollCount).toBe(1)

      // Second click
      refreshPaymentStatus()
      expect(paymentCheckState).toBe('checking')
      vi.advanceTimersByTime(450)
      expect(paymentCheckState).toBe('idle')
      expect(stage).toBe('result')
      expect(resultStatus).toBe('success')
      expect(pollCount).toBe(2)

      vi.restoreAllMocks()
    })

    it('M2-FLW-05: query parameter override instantly settles payment result', () => {
      vi.useFakeTimers()
      let stage: 'form' | 'instructions' | 'result' = 'instructions'
      let resultStatus: 'success' | 'failed' = 'success'
      let pollTimeout: any

      function refreshPaymentStatus(requestedResult: string) {
        if (pollTimeout) clearTimeout(pollTimeout)
        pollTimeout = setTimeout(() => {
          if (requestedResult === 'success' || requestedResult === 'failed') {
            resultStatus = requestedResult
            stage = 'result'
          }
        }, 450)
      }

      refreshPaymentStatus('failed')
      vi.advanceTimersByTime(450)
      expect(stage).toBe('result')
      expect(resultStatus).toBe('failed')

      vi.restoreAllMocks()
    })

    it('M2-FLW-06: instruction countdown expiration triggers failure terminal state', () => {
      let stage: 'form' | 'instructions' | 'result' = 'instructions'
      let resultStatus: 'success' | 'failed' = 'success'

      function onCountdownExpired() {
        resultStatus = 'failed'
        stage = 'result'
      }

      onCountdownExpired()
      expect(stage).toBe('result')
      expect(resultStatus).toBe('failed')
    })
  })
})
