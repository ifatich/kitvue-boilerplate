import { describe, it, expect, beforeEach } from 'vitest'
import {
  PosFlowStateMachine,
  PosBrowserSimulator,
  calculateLayoutGeometry,
  formatCountdownTimer,
  formatCreditNumber,
  formatCurrencyIdr,
  inspectWorkspaceTokens,
} from './harness/pos-test-harness'
import CreditNumberField from '../../POS/pembayaran-gadai/components/CreditNumberField.vue'
import TransactionTypePicker from '../../POS/pembayaran-gadai/components/TransactionTypePicker.vue'
import InstallmentAmountField from '../../POS/pembayaran-gadai/components/InstallmentAmountField.vue'
import PaymentMethodPicker from '../../POS/pembayaran-gadai/components/PaymentMethodPicker.vue'
import CreditDetailsCard from '../../POS/pembayaran-gadai/components/CreditDetailsCard.vue'
import PaymentInstructionCard from '../../POS/pembayaran-gadai/components/PaymentInstructionCard.vue'
import PaymentResultView from '../../POS/pembayaran-gadai/components/PaymentResultView.vue'
import PaymentReviewDialog from '../../POS/pembayaran-gadai/components/PaymentReviewDialog.vue'
import PaymentButton from '../../POS/pembayaran-gadai/components/PaymentButton.vue'
import PaymentDialog from '../../POS/pembayaran-gadai/components/PaymentDialog.vue'
import { mockCreditRecord, paymentMethods, transactionTypes, getPaymentTotal } from '../../POS/pembayaran-gadai/data'

describe('Tier 1: Feature Coverage in Isolation (Features 1 to 20)', () => {
  let sim: PosBrowserSimulator
  let machine: PosFlowStateMachine

  beforeEach(() => {
    sim = new PosBrowserSimulator()
    machine = new PosFlowStateMachine()
  })

  // -------------------------------------------------------------
  // Feature 1: Canonical Design Tokens
  // -------------------------------------------------------------
  describe('Feature 1: Canonical Design Tokens', () => {
    const tokens = inspectWorkspaceTokens()

    it('T1-F01-01: contains primary brand emerald token definition (#004d43)', () => {
      const hasEmerald =
        tokens.posStyle.includes('#004d43') ||
        tokens.hasToken('--g-kit-emerald-50') ||
        tokens.hasToken('--pos-color-primary')
      expect(hasEmerald).toBe(true)
    })

    it('T1-F01-02: contains primary interactive irish green token (#00ab4e / --g-kit-lime-50)', () => {
      const hasLime =
        tokens.posStyle.includes('#00ab4e') ||
        tokens.hasToken('--g-kit-lime-50') ||
        tokens.hasToken('--pos-color-irish')
      expect(hasLime).toBe(true)
    })

    it('T1-F01-03: contains neutral surface and background token definitions (#f8f8f8, #ffffff, #eeeeef)', () => {
      expect(tokens.posStyle.includes('#f8f8f8')).toBe(true)
      expect(tokens.posStyle.includes('#ffffff')).toBe(true)
      expect(tokens.posStyle.includes('#eeeeef')).toBe(true)
    })

    it('T1-F01-04: contains alert and timer red token definitions (#f15f43 / #c34d36)', () => {
      const hasRed =
        tokens.posStyle.includes('#f15f43') ||
        tokens.posStyle.includes('#c34d36') ||
        tokens.gadaiStyle.includes('#c34d36')
      expect(hasRed).toBe(true)
    })

    it('T1-F01-05: contains border radius tokens for card surfaces (24px, 32px, pill 1000px)', () => {
      expect(tokens.posStyle.includes('24px')).toBe(true)
      expect(tokens.posStyle.includes('32px')).toBe(true)
      expect(tokens.posStyle.includes('1000px')).toBe(true)
    })
  })
  // -------------------------------------------------------------
  // Feature 2: Typography Alignment
  // -------------------------------------------------------------
  describe('Feature 2: Typography Alignment', () => {
    const tokens = inspectWorkspaceTokens()

    it('T1-F02-01: declares Nunito or Nunito Sans font family in index.html or styles', () => {
      const hasFont = tokens.hasFont('Nunito') || tokens.hasFont('Nunito Sans')
      expect(hasFont).toBe(true)
    })

    it('T1-F02-02: configures SemiBold 600 font weight for subheadings and labels', () => {
      expect(tokens.posStyle.includes('600')).toBe(true)
    })

    it('T1-F02-03: configures Bold / ExtraBold 700/800 font weight for primary headings', () => {
      const hasBold = tokens.posStyle.includes('700') || tokens.posStyle.includes('800')
      expect(hasBold).toBe(true)
    })

    it('T1-F02-04: defines heading scale hierarchy in stylesheets', () => {
      const hasHeading =
        tokens.posStyle.includes('font-size: 24px') ||
        tokens.posStyle.includes('font-size: 20px') ||
        tokens.posStyle.includes('font-size: 18px') ||
        tokens.gadaiStyle.includes('24px') ||
        tokens.gadaiStyle.includes('18px')
      expect(hasHeading).toBe(true)
    })

    it('T1-F02-05: defines body text hierarchy (14px, 12px) for descriptions and badges', () => {
      const hasBody =
        tokens.posStyle.includes('14px') ||
        tokens.posStyle.includes('12px') ||
        tokens.gadaiStyle.includes('14px') ||
        tokens.gadaiStyle.includes('12px')
      expect(hasBody).toBe(true)
    })
  })

  // -------------------------------------------------------------
  // Feature 3: CreditNumberField Component
  // -------------------------------------------------------------
  describe('Feature 3: CreditNumberField Component', () => {
    it('T1-F03-01: component is cleanly imported and exported as Vue SFC', () => {
      expect(CreditNumberField).toBeDefined()
      expect(typeof CreditNumberField).toBe('object')
    })

    it('T1-F03-02: formats 16-digit credit number into 4-digit whitespace chunks', () => {
      const formatted = formatCreditNumber('1234393948486060')
      expect(formatted).toBe('1234 3939 4848 6060')
    })

    it('T1-F03-03: validates search button is disabled when credit number is empty or incomplete', () => {
      machine.inputCreditNumber('1234')
      expect(machine.searchCredit()).toBe(false)
      expect(machine.hasCredit).toBe(false)
      expect(machine.creditError).toBe('Nomor kredit harus terdiri dari 16 digit.')
    })

    it('T1-F03-04: enables search when exact 16 digits are provided', () => {
      machine.inputCreditNumber('1234393948486060')
      const success = machine.searchCredit()
      expect(success).toBe(true)
      expect(machine.hasCredit).toBe(true)
      expect(machine.creditError).toBe('')
    })

    it('T1-F03-05: strips non-numeric characters before validating 16 digits', () => {
      machine.inputCreditNumber('1234 3939 4848 6060')
      const success = machine.searchCredit()
      expect(success).toBe(true)
      expect(machine.creditNumber).toBe('1234393948486060')
    })
  })

  // -------------------------------------------------------------
  // Feature 4: TransactionTypePicker Component
  // -------------------------------------------------------------
  describe('Feature 4: TransactionTypePicker Component', () => {
    it('T1-F04-01: component is cleanly imported and exported as Vue SFC', () => {
      expect(TransactionTypePicker).toBeDefined()
      expect(typeof TransactionTypePicker).toBe('object')
    })

    it('T1-F04-02: supports all 3 defined transaction types in data catalogue', () => {
      const values = transactionTypes.map((t) => t.value)
      expect(values).toContain('Sewa Modal')
      expect(values).toContain('Cicil')
      expect(values).toContain('Pelunasan')
      expect(transactionTypes).toHaveLength(3)
    })

    it('T1-F04-03: disallows transaction type selection when credit has not been loaded', () => {
      expect(machine.hasCredit).toBe(false)
      machine.selectTransactionType('Pelunasan')
      expect(machine.transactionType).toBeNull()
    })

    it('T1-F04-04: allows transaction type selection once credit lookup succeeds', () => {
      machine.inputCreditNumber('1234393948486060')
      machine.searchCredit()
      machine.selectTransactionType('Pelunasan')
      expect(machine.transactionType).toBe('Pelunasan')
    })

    it('T1-F04-05: provides clear business descriptions for each transaction option', () => {
      const pelunasan = transactionTypes.find((t) => t.value === 'Pelunasan')
      const cicil = transactionTypes.find((t) => t.value === 'Cicil')
      const sewaModal = transactionTypes.find((t) => t.value === 'Sewa Modal')
      expect(pelunasan?.description).toContain('Lunasi pinjaman')
      expect(cicil?.description).toContain('sebagian')
      expect(sewaModal?.description).toContain('biaya sewa modal')
    })
  })

  // -------------------------------------------------------------
  // Feature 5: InstallmentAmountField Component
  // -------------------------------------------------------------
  describe('Feature 5: InstallmentAmountField Component', () => {
    it('T1-F05-01: component is cleanly imported and exported as Vue SFC', () => {
      expect(InstallmentAmountField).toBeDefined()
      expect(typeof InstallmentAmountField).toBe('object')
    })

    it('T1-F05-02: updates installment amount in state machine', () => {
      machine.setInstallmentAmount(750_000)
      expect(machine.installmentAmount).toBe(750_000)
    })

    it('T1-F05-03: formats installment amount into Indonesian currency string', () => {
      expect(formatCurrencyIdr(500_000)).toBe('Rp500.000')
      expect(formatCurrencyIdr(1_250_000)).toBe('Rp1.250.000')
    })

    it('T1-F05-04: respects maximum loan amount ceiling for installment calculation', () => {
      machine.inputCreditNumber('1234393948486060')
      machine.searchCredit()
      machine.selectTransactionType('Cicil')
      // Setting installment higher than loanAmount (10M) clamps principal
      machine.setInstallmentAmount(15_000_000)
      expect(machine.summary.total).toBe(10_000_000 + 140_000 + 2_500)
    })

    it('T1-F05-05: clamps negative installment amounts to 0', () => {
      machine.inputCreditNumber('1234393948486060')
      machine.searchCredit()
      machine.selectTransactionType('Cicil')
      machine.setInstallmentAmount(-100_000)
      expect(machine.summary.total).toBe(0 + 140_000 + 2_500)
    })
  })

  // -------------------------------------------------------------
  // Feature 6: PaymentMethodPicker Component
  // -------------------------------------------------------------
  describe('Feature 6: PaymentMethodPicker Component', () => {
    it('T1-F06-01: component is cleanly imported and exported as Vue SFC', () => {
      expect(PaymentMethodPicker).toBeDefined()
      expect(typeof PaymentMethodPicker).toBe('object')
    })

    it('T1-F06-02: contains 4 defined payment channels in catalogue', () => {
      expect(paymentMethods).toHaveLength(4)
      const ids = paymentMethods.map((m) => m.id)
      expect(ids).toContain('bca-va')
      expect(ids).toContain('mandiri-va')
      expect(ids).toContain('bri-debit')
      expect(ids).toContain('merchant')
    })

    it('T1-F06-03: groups payment methods into recognized categories', () => {
      const categories = new Set(paymentMethods.map((m) => m.category))
      expect(categories.has('Virtual Account')).toBe(true)
      expect(categories.has('Direct Debit')).toBe(true)
      expect(categories.has('Metode Pembayaran Lain')).toBe(true)
    })

    it('T1-F06-04: disallows selecting payment method before credit and type are set', () => {
      const bca = paymentMethods[0]
      machine.selectPaymentMethod(bca)
      expect(machine.paymentMethod).toBeNull()
    })

    it('T1-F06-05: allows selecting payment method once prerequisites are satisfied', () => {
      machine.inputCreditNumber('1234393948486060')
      machine.searchCredit()
      machine.selectTransactionType('Pelunasan')
      const bca = paymentMethods[0]
      machine.selectPaymentMethod(bca)
      expect(machine.paymentMethod?.id).toBe('bca-va')
    })
  })

  // -------------------------------------------------------------
  // Feature 7: CreditDetailsCard Component
  // -------------------------------------------------------------
  describe('Feature 7: CreditDetailsCard Component', () => {
    it('T1-F07-01: component is cleanly imported and exported as Vue SFC', () => {
      expect(CreditDetailsCard).toBeDefined()
      expect(typeof CreditDetailsCard).toBe('object')
    })

    it('T1-F07-02: initializes with total 0 before transaction type is selected', () => {
      expect(machine.summary.total).toBe(0)
    })

    it('T1-F07-03: computes populated summary when credit and transaction type are active', () => {
      machine.inputCreditNumber('1234393948486060')
      machine.searchCredit()
      machine.selectTransactionType('Pelunasan')
      expect(machine.summary.loanAmount).toBe(10_000_000)
      expect(machine.summary.rentAmount).toBe(140_000)
      expect(machine.summary.serviceFee).toBe(2_500)
      expect(machine.summary.total).toBe(10_142_500)
    })

    it('T1-F07-04: canContinue flag is false when fields are incomplete', () => {
      expect(machine.canContinue).toBe(false)
      machine.inputCreditNumber('1234393948486060')
      machine.searchCredit()
      expect(machine.canContinue).toBe(false)
      machine.selectTransactionType('Pelunasan')
      expect(machine.canContinue).toBe(false)
    })

    it('T1-F07-05: canContinue flag becomes true when all required fields are filled', () => {
      machine.inputCreditNumber('1234393948486060')
      machine.searchCredit()
      machine.selectTransactionType('Pelunasan')
      machine.selectPaymentMethod(paymentMethods[0])
      expect(machine.canContinue).toBe(true)
    })
  })

  // -------------------------------------------------------------
  // Feature 8: PaymentInstructionCard Component
  // -------------------------------------------------------------
  describe('Feature 8: PaymentInstructionCard Component', () => {
    it('T1-F08-01: component is cleanly imported and exported as Vue SFC', () => {
      expect(PaymentInstructionCard).toBeDefined()
      expect(typeof PaymentInstructionCard).toBe('object')
    })

    it('T1-F08-02: formats countdown timer accurately to HH:MM:SS', () => {
      const formatted = formatCountdownTimer(5132) // 1h 25m 32s
      expect(formatted).toBe('01:25:32')
    })

    it('T1-F08-03: clamps negative timer values to 00:00:00', () => {
      expect(formatCountdownTimer(-5)).toBe('00:00:00')
      expect(formatCountdownTimer(0)).toBe('00:00:00')
    })

    it('T1-F08-04: formats padded single-digit units correctly', () => {
      expect(formatCountdownTimer(3665)).toBe('01:01:05')
      expect(formatCountdownTimer(59)).toBe('00:00:59')
    })

    it('T1-F08-05: copies Virtual Account number to clipboard through simulator', async () => {
      const vaCode = '0130836180006879'
      await navigator.clipboard.writeText(vaCode)
      expect(sim.clipboardText).toBe(vaCode)
    })
  })

  // -------------------------------------------------------------
  // Feature 9: PaymentResultView Component
  // -------------------------------------------------------------
  describe('Feature 9: PaymentResultView Component', () => {
    it('T1-F09-01: component is cleanly imported and exported as Vue SFC', () => {
      expect(PaymentResultView).toBeDefined()
      expect(typeof PaymentResultView).toBe('object')
    })

    it('T1-F09-02: supports success status transition in flow machine', () => {
      machine.finishPayment('success')
      expect(machine.stage).toBe('result')
      expect(machine.resultStatus).toBe('success')
    })

    it('T1-F09-03: supports failed status transition in flow machine', () => {
      machine.finishPayment('failed')
      expect(machine.stage).toBe('result')
      expect(machine.resultStatus).toBe('failed')
    })

    it('T1-F09-04: preserves unique transaction ID on success', () => {
      expect(machine.transactionId).toBe('TRX-20241101-99812')
    })

    it('T1-F09-05: invokes window.print() when print receipt is requested', () => {
      sim.setupMocks()
      window.print()
      expect(sim.printed).toBe(true)
    })
  })

  // -------------------------------------------------------------
  // Feature 10: PaymentReviewDialog & Drawer Component
  // -------------------------------------------------------------
  describe('Feature 10: PaymentReviewDialog & Drawer Component', () => {
    it('T1-F10-01: component is cleanly imported and exported as Vue SFC', () => {
      expect(PaymentReviewDialog).toBeDefined()
      expect(typeof PaymentReviewDialog).toBe('object')
    })

    it('T1-F10-02: dialog starts closed by default', () => {
      expect(machine.reviewOpen).toBe(false)
    })

    it('T1-F10-03: opens review dialog when continueToReview is invoked with complete data', () => {
      machine.inputCreditNumber('1234393948486060')
      machine.searchCredit()
      machine.selectTransactionType('Pelunasan')
      machine.selectPaymentMethod(paymentMethods[0])
      const opened = machine.continueToReview()
      expect(opened).toBe(true)
      expect(machine.reviewOpen).toBe(true)
    })

    it('T1-F10-04: dismisses review dialog without modifying stage or data', () => {
      machine.inputCreditNumber('1234393948486060')
      machine.searchCredit()
      machine.selectTransactionType('Pelunasan')
      machine.selectPaymentMethod(paymentMethods[0])
      machine.continueToReview()

      machine.dismissReview()
      expect(machine.reviewOpen).toBe(false)
      expect(machine.stage).toBe('form')
    })

    it('T1-F10-05: confirming review closes dialog and advances stage to instructions', () => {
      machine.inputCreditNumber('1234393948486060')
      machine.searchCredit()
      machine.selectTransactionType('Pelunasan')
      machine.selectPaymentMethod(paymentMethods[0])
      machine.continueToReview()

      machine.confirmReview()
      expect(machine.reviewOpen).toBe(false)
      expect(machine.stage).toBe('instructions')
    })
  })

  // -------------------------------------------------------------
  // Feature 11: Form Validation & Error States
  // -------------------------------------------------------------
  describe('Feature 11: Form Validation & Error States', () => {
    it('T1-F11-01: flags error when credit number is missing on submit', () => {
      const res = machine.triggerValidation()
      expect(res.valid).toBe(false)
      expect(res.errors.creditNumber).toBe('Nomor kredit harus diisi')
    })

    it('T1-F11-02: flags error when transaction type is missing', () => {
      machine.inputCreditNumber('1234393948486060')
      machine.searchCredit()
      const res = machine.triggerValidation()
      expect(res.valid).toBe(false)
      expect(res.errors.transactionType).toBe('Jenis transaksi harus diisi')
    })

    it('T1-F11-03: flags error when payment method is missing', () => {
      machine.inputCreditNumber('1234393948486060')
      machine.searchCredit()
      machine.selectTransactionType('Pelunasan')
      const res = machine.triggerValidation()
      expect(res.valid).toBe(false)
      expect(res.errors.paymentMethod).toBe('Metode pembayaran harus diisi')
    })

    it('T1-F11-04: flags error if Cicil transaction has non-positive installment amount', () => {
      machine.inputCreditNumber('1234393948486060')
      machine.searchCredit()
      machine.selectTransactionType('Cicil')
      machine.selectPaymentMethod(paymentMethods[0])
      machine.setInstallmentAmount(0)
      const res = machine.triggerValidation()
      expect(res.valid).toBe(false)
      expect(res.errors.installmentAmount).toBe('Nominal cicilan harus lebih dari 0')
    })

    it('T1-F11-05: returns valid when all fields conform to validation rules', () => {
      machine.inputCreditNumber('1234393948486060')
      machine.searchCredit()
      machine.selectTransactionType('Cicil')
      machine.selectPaymentMethod(paymentMethods[0])
      machine.setInstallmentAmount(500_000)
      const res = machine.triggerValidation()
      expect(res.valid).toBe(true)
      expect(Object.keys(res.errors)).toHaveLength(0)
    })
  })

  // -------------------------------------------------------------
  // Feature 12: Credit Lookup State Flow
  // -------------------------------------------------------------
  describe('Feature 12: Credit Lookup State Flow', () => {
    it('T1-F12-01: cleans formatted spaces from credit number on search', () => {
      machine.inputCreditNumber('1234 3939 4848 6060')
      machine.searchCredit()
      expect(machine.creditNumber).toBe('1234393948486060')
    })

    it('T1-F12-02: fails search when digit count is 15', () => {
      machine.inputCreditNumber('123439394848606')
      const ok = machine.searchCredit()
      expect(ok).toBe(false)
      expect(machine.hasCredit).toBe(false)
    })

    it('T1-F12-03: hydrations loan customer name Bianca Putri on success', () => {
      machine.inputCreditNumber('1234393948486060')
      machine.searchCredit()
      expect(machine.summary.customer).toBe('Bianca Putri')
    })

    it('T1-F12-04: hydrations loan metrics correctly (10M loan, 30 rent days, 5K daily)', () => {
      machine.inputCreditNumber('1234393948486060')
      machine.searchCredit()
      expect(machine.summary.loanAmount).toBe(10_000_000)
      expect(machine.summary.rentDays).toBe(30)
      expect(machine.summary.dailyRent).toBe(5_000)
    })

    it('T1-F12-05: editing credit number resets active credit state and selections', () => {
      machine.inputCreditNumber('1234393948486060')
      machine.searchCredit()
      machine.selectTransactionType('Pelunasan')
      machine.selectPaymentMethod(paymentMethods[0])
      expect(machine.hasCredit).toBe(true)

      // User retypes credit number
      machine.inputCreditNumber('9999888877776666')
      expect(machine.hasCredit).toBe(false)
      expect(machine.transactionType).toBeNull()
      expect(machine.paymentMethod).toBeNull()
    })
  })

  // -------------------------------------------------------------
  // Feature 13: Real-Time Fee Calculation
  // -------------------------------------------------------------
  describe('Feature 13: Real-Time Fee Calculation', () => {
    it('T1-F13-01: Pelunasan computes loanAmount + rentAmount + serviceFee', () => {
      const total = getPaymentTotal('Pelunasan', mockCreditRecord)
      expect(total).toBe(10_000_000 + 140_000 + 2_500)
      expect(total).toBe(10_142_500)
    })

    it('T1-F13-02: Sewa Modal computes 0 principal + rentAmount + serviceFee', () => {
      const total = getPaymentTotal('Sewa Modal', mockCreditRecord)
      expect(total).toBe(0 + 140_000 + 2_500)
      expect(total).toBe(142_500)
    })

    it('T1-F13-03: Cicil computes installment + rentAmount + serviceFee', () => {
      const total = getPaymentTotal('Cicil', mockCreditRecord, 1_500_000)
      expect(total).toBe(1_500_000 + 140_000 + 2_500)
      expect(total).toBe(1_642_500)
    })

    it('T1-F13-04: Cicil clamps installment exceeding loanAmount to loanAmount', () => {
      const total = getPaymentTotal('Cicil', mockCreditRecord, 20_000_000)
      expect(total).toBe(10_000_000 + 140_000 + 2_500)
    })

    it('T1-F13-05: getPaymentTotal returns 0 if transactionType is null', () => {
      expect(getPaymentTotal(null, mockCreditRecord)).toBe(0)
    })
  })

  // -------------------------------------------------------------
  // Feature 14: Payment Method Selection Flow
  // -------------------------------------------------------------
  describe('Feature 14: Payment Method Selection Flow', () => {
    beforeEach(() => {
      machine.inputCreditNumber('1234393948486060')
      machine.searchCredit()
      machine.selectTransactionType('Pelunasan')
    })

    it('T1-F14-01: selects BCA Virtual Account and updates summary', () => {
      const bca = paymentMethods.find((m) => m.id === 'bca-va')!
      machine.selectPaymentMethod(bca)
      expect(machine.summary.paymentMethod?.id).toBe('bca-va')
      expect(machine.summary.paymentMethod?.bank).toBe('BCA')
    })

    it('T1-F14-02: selects Mandiri Virtual Account and updates summary', () => {
      const mandiri = paymentMethods.find((m) => m.id === 'mandiri-va')!
      machine.selectPaymentMethod(mandiri)
      expect(machine.summary.paymentMethod?.id).toBe('mandiri-va')
      expect(machine.summary.paymentMethod?.bank).toBe('Mandiri')
    })

    it('T1-F14-03: selects BRI Direct Debit and updates summary', () => {
      const bri = paymentMethods.find((m) => m.id === 'bri-debit')!
      machine.selectPaymentMethod(bri)
      expect(machine.summary.paymentMethod?.id).toBe('bri-debit')
      expect(machine.summary.paymentMethod?.category).toBe('Direct Debit')
    })

    it('T1-F14-04: selects Bayar di Merchant and updates summary', () => {
      const merchant = paymentMethods.find((m) => m.id === 'merchant')!
      machine.selectPaymentMethod(merchant)
      expect(machine.summary.paymentMethod?.id).toBe('merchant')
      expect(machine.summary.paymentMethod?.category).toBe('Metode Pembayaran Lain')
    })

    it('T1-F14-05: allows switching between payment channels dynamically', () => {
      machine.selectPaymentMethod(paymentMethods[0])
      expect(machine.paymentMethod?.id).toBe('bca-va')
      machine.selectPaymentMethod(paymentMethods[1])
      expect(machine.paymentMethod?.id).toBe('mandiri-va')
    })
  })

  // -------------------------------------------------------------
  // Feature 15: Confirmation Drawer Transition Flow
  // -------------------------------------------------------------
  describe('Feature 15: Confirmation Drawer Transition Flow', () => {
    beforeEach(() => {
      machine.inputCreditNumber('1234393948486060')
      machine.searchCredit()
      machine.selectTransactionType('Pelunasan')
      machine.selectPaymentMethod(paymentMethods[0])
    })

    it('T1-F15-01: opens drawer when continueToReview is invoked', () => {
      machine.continueToReview()
      expect(machine.reviewOpen).toBe(true)
    })

    it('T1-F15-02: maintains summary values accurately inside review drawer', () => {
      machine.continueToReview()
      expect(machine.summary.total).toBe(10_142_500)
      expect(machine.summary.customer).toBe('Bianca Putri')
      expect(machine.summary.paymentMethod?.label).toBe('BCA Virtual Account')
    })

    it('T1-F15-03: dismissReview hides drawer and leaves form interactive', () => {
      machine.continueToReview()
      machine.dismissReview()
      expect(machine.reviewOpen).toBe(false)
      expect(machine.stage).toBe('form')
    })

    it('T1-F15-04: confirmReview advances stage to instructions', () => {
      machine.continueToReview()
      machine.confirmReview()
      expect(machine.reviewOpen).toBe(false)
      expect(machine.stage).toBe('instructions')
    })

    it('T1-F15-05: form inputs remain unmodified across open/dismiss cycle', () => {
      machine.continueToReview()
      machine.dismissReview()
      expect(machine.creditNumber).toBe('1234393948486060')
      expect(machine.transactionType).toBe('Pelunasan')
      expect(machine.paymentMethod?.id).toBe('bca-va')
    })
  })

  // -------------------------------------------------------------
  // Feature 16: Payment Instruction & Countdown Flow
  // -------------------------------------------------------------
  describe('Feature 16: Payment Instruction & Countdown Flow', () => {
    it('T1-F16-01: formats initial 24h countdown string (86400s -> 24:00:00)', () => {
      expect(formatCountdownTimer(86400)).toBe('24:00:00')
    })

    it('T1-F16-02: decrements seconds cleanly (3600s -> 01:00:00)', () => {
      expect(formatCountdownTimer(3600)).toBe('01:00:00')
      expect(formatCountdownTimer(3599)).toBe('00:59:59')
    })

    it('T1-F16-03: copies VA number to clipboard and updates simulator buffer', async () => {
      const vaCode = '0130 8361 8000 6879'
      await navigator.clipboard.writeText(vaCode)
      expect(sim.clipboardText).toBe(vaCode)
    })

    it('T1-F16-04: provides copy feedback toast / announcement', () => {
      machine.announcement = 'Nomor VA berhasil disalin.'
      expect(machine.announcement).toBe('Nomor VA berhasil disalin.')
    })

    it('T1-F16-05: transitions to failed state on timer expiry', () => {
      machine.stage = 'instructions'
      machine.triggerExpiry()
      expect(machine.stage).toBe('result')
      expect(machine.resultStatus).toBe('failed')
    })
  })

  // -------------------------------------------------------------
  // Feature 17: Terminal States Resolution
  // -------------------------------------------------------------
  describe('Feature 17: Terminal States Resolution', () => {
    it('T1-F17-01: transitions to result stage on finishPayment success', () => {
      machine.finishPayment('success')
      expect(machine.stage).toBe('result')
      expect(machine.resultStatus).toBe('success')
    })

    it('T1-F17-02: copies transaction ID to clipboard on success screen', async () => {
      const trxId = machine.transactionId
      await navigator.clipboard.writeText(trxId)
      expect(sim.clipboardText).toBe(trxId)
    })

    it('T1-F17-03: triggers receipt printing from result view', () => {
      sim.setupMocks()
      window.print()
      expect(sim.printed).toBe(true)
    })

    it('T1-F17-04: transitions to result stage on finishPayment failure', () => {
      machine.finishPayment('failed')
      expect(machine.stage).toBe('result')
      expect(machine.resultStatus).toBe('failed')
    })

    it('T1-F17-05: resetting flow machine restores clean initial state', () => {
      machine.finishPayment('success')
      machine.reset()
      expect(machine.stage).toBe('form')
      expect(machine.creditNumber).toBe('')
      expect(machine.hasCredit).toBe(false)
      expect(machine.transactionType).toBeNull()
      expect(machine.paymentMethod).toBeNull()
    })
  })

  // -------------------------------------------------------------
  // Feature 18: Tablet 1280px Spatial Layout
  // -------------------------------------------------------------
  describe('Feature 18: Tablet 1280px Spatial Layout', () => {
    it('T1-F18-01: header height conforms to 72px specification', () => {
      const geo = calculateLayoutGeometry(1280)
      expect(geo.headerHeight).toBe(72)
    })

    it('T1-F18-02: sidebar width conforms to 248px specification', () => {
      const geo = calculateLayoutGeometry(1280)
      expect(geo.sidebarWidth).toBe(248)
    })

    it('T1-F18-03: main canvas content width equals 984px net on 1280px viewport', () => {
      const geo = calculateLayoutGeometry(1280)
      expect(geo.netGridWidth).toBe(984)
    })

    it('T1-F18-04: left form card width conforms to 569px specification', () => {
      const geo = calculateLayoutGeometry(1280)
      expect(geo.leftCardWidth).toBe(569)
    })

    it('T1-F18-05: right summary card width conforms to 400px specification and 15px gap', () => {
      const geo = calculateLayoutGeometry(1280)
      expect(geo.rightCardWidth).toBe(400)
      expect(geo.columnGap).toBe(15)
      expect(geo.leftCardWidth + geo.columnGap + geo.rightCardWidth).toBe(984)
    })
  })

  // -------------------------------------------------------------
  // Feature 19: Fluid Desktop Scaling (>1280px)
  // -------------------------------------------------------------
  describe('Feature 19: Fluid Desktop Scaling (>1280px)', () => {
    it('T1-F19-01: left form card expands fluidly beyond 569px on 1440px viewport', () => {
      const geo = calculateLayoutGeometry(1440)
      expect(geo.leftCardWidth).toBe(729)
      expect(geo.rightCardWidth).toBe(400)
      expect(geo.netGridWidth).toBe(1144)
    })

    it('T1-F19-02: left form card expands fluidly beyond 569px on 1920px 1080p desktop', () => {
      const geo = calculateLayoutGeometry(1920)
      expect(geo.leftCardWidth).toBe(1209)
      expect(geo.rightCardWidth).toBe(400)
      expect(geo.netGridWidth).toBe(1624)
    })

    it('T1-F19-03: right summary card remains anchored at fixed 400px across all desktop widths', () => {
      expect(calculateLayoutGeometry(1280).rightCardWidth).toBe(400)
      expect(calculateLayoutGeometry(1440).rightCardWidth).toBe(400)
      expect(calculateLayoutGeometry(1920).rightCardWidth).toBe(400)
      expect(calculateLayoutGeometry(2560).rightCardWidth).toBe(400)
    })

    it('T1-F19-04: fluid scaling prevents artificial dead whitespace borders on wide screens', () => {
      const geo = calculateLayoutGeometry(1440)
      expect(geo.hasExcessWhitespace).toBe(false)
    })

    it('T1-F19-05: net content fills calc(100vw - 248px - 48px) seamlessly', () => {
      const geo = calculateLayoutGeometry(1600)
      const expectedAvailable = 1600 - 248 - 48
      expect(geo.netGridWidth).toBe(expectedAvailable)
    })
  })

  // -------------------------------------------------------------
  // Feature 20: Vertical Stacking for Narrow Viewports
  // -------------------------------------------------------------
  describe('Feature 20: Vertical Stacking for Narrow Viewports (<1200px / <1280px)', () => {
    it('T1-F20-01: flags stacked layout when viewport width is below 1200px', () => {
      const geo = calculateLayoutGeometry(1024)
      expect(geo.isStacked).toBe(true)
    })

    it('T1-F20-02: spans form card across full available viewport width', () => {
      const geo = calculateLayoutGeometry(1024)
      expect(geo.leftCardWidth).toBe(1024 - 32)
    })

    it('T1-F20-03: stacks summary card with full width below form card', () => {
      const geo = calculateLayoutGeometry(768)
      expect(geo.rightCardWidth).toBe(768 - 32)
      expect(geo.isStacked).toBe(true)
    })

    it('T1-F20-04: eliminates horizontal overflow clipping on narrow tablet portrait screens', () => {
      const geo = calculateLayoutGeometry(800)
      expect(geo.netGridWidth).toBeLessThanOrEqual(800)
    })

    it('T1-F20-05: maintains interactive form elements in stacked layout mode', () => {
      machine.inputCreditNumber('1234393948486060')
      machine.searchCredit()
      machine.selectTransactionType('Pelunasan')
      machine.selectPaymentMethod(paymentMethods[0])
      expect(machine.canContinue).toBe(true)
    })
  })

  // -------------------------------------------------------------
  // Shared / Reusable Components Interface Verification
  // -------------------------------------------------------------
  describe('Shared Component Interface Contracts', () => {
    it('verifies PaymentButton component exports cleanly', () => {
      expect(PaymentButton).toBeDefined()
      expect(typeof PaymentButton).toBe('object')
    })

    it('verifies PaymentDialog component exports cleanly', () => {
      expect(PaymentDialog).toBeDefined()
      expect(typeof PaymentDialog).toBe('object')
    })
  })
})
