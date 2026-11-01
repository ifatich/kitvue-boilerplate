import fs from 'node:fs'
import path from 'node:path'
import type { CreditRecord, PaymentMethod, PaymentSummary, TransactionType } from '../../../POS/pembayaran-gadai/payment-types'
import { mockCreditRecord, paymentMethods, transactionTypes } from '../../../POS/pembayaran-gadai/data'

export interface PosHarnessOptions {
  mockWindow?: boolean
}

export class PosBrowserSimulator {
  public clipboardText = ''
  public printed = false
  public scrolledTo: { top?: number; left?: number; behavior?: string } | null = null
  public currentUrl = 'http://localhost:5175/pembayaran-gadai'
  public queryParams: Record<string, string> = {}

  constructor() {
    this.setupMocks()
  }

  public setupMocks(): void {
    // Clipboard mock
    Object.defineProperty(globalThis, 'navigator', {
      value: {
        clipboard: {
          writeText: async (text: string) => {
            this.clipboardText = text
            return Promise.resolve()
          },
          readText: async () => this.clipboardText,
        },
      },
      writable: true,
      configurable: true,
    })

    // Window mocks
    const win = {
      print: () => {
        this.printed = true
      },
      scrollTo: (options: { top?: number; left?: number; behavior?: string }) => {
        this.scrolledTo = options
      },
      location: {
        search: '',
        pathname: '/pembayaran-gadai',
        href: 'http://localhost:5175/pembayaran-gadai',
      },
      open: (_url: string, _target?: string) => {
        return {}
      },
    }

    Object.assign(globalThis, {
      print: win.print,
      scrollTo: win.scrollTo,
      window: win,
    })

  }

  public setPaymentResultQuery(result: 'success' | 'failed' | null): void {
    if (result) {
      this.queryParams.paymentResult = result
      if (typeof window !== 'undefined' && window.location) {
        window.location.search = `?paymentResult=${result}`
      }
    } else {
      delete this.queryParams.paymentResult
      if (typeof window !== 'undefined' && window.location) {
        window.location.search = ''
      }
    }
  }

  public reset(): void {
    this.clipboardText = ''
    this.printed = false
    this.scrolledTo = null
    this.queryParams = {}
  }
}

/**
 * Format number to Indonesian Rupiah currency string (e.g. Rp10.142.500)
 */
export function formatCurrencyIdr(amount: number): string {
  const formatted = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `Rp${formatted}`
}

/**
 * Format 16-digit credit number into 4-digit chunks separated by spaces
 */
export function formatCreditNumber(digits: string): string {
  const clean = digits.replace(/\D/g, '').slice(0, 16)
  return clean.replace(/(\d{4})(?=\d)/g, '$1 ')
}

/**
 * Format remaining seconds into countdown capsule string (HH:MM:SS)
 */
export function formatCountdownTimer(secondsRemaining: number): string {
  const safe = Math.max(0, Math.floor(secondsRemaining))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  return [hours, minutes, seconds].map((unit) => String(unit).padStart(2, '0')).join(':')
}

/**
 * Spatial layout dimensions validator for Tablet and Desktop viewports
 */
export interface LayoutGeometry {
  viewportWidth: number
  isStacked: boolean
  headerHeight: number
  sidebarWidth: number
  contentWidth: number
  leftCardWidth: number
  columnGap: number
  rightCardWidth: number
  netGridWidth: number
  hasExcessWhitespace: boolean
}

export function calculateLayoutGeometry(viewportWidth: number): LayoutGeometry {
  const isStacked = viewportWidth < 1200
  const headerHeight = 72
  const sidebarWidth = 248
  const rightCardWidth = 400
  const columnGap = 15 // or 16

  if (isStacked) {
    return {
      viewportWidth,
      isStacked: true,
      headerHeight,
      sidebarWidth,
      contentWidth: viewportWidth,
      leftCardWidth: viewportWidth - 32,
      columnGap: 16,
      rightCardWidth: viewportWidth - 32,
      netGridWidth: viewportWidth - 32,
      hasExcessWhitespace: false,
    }
  }

  // Desktop / Tablet mode
  // Horizontal padding is 24px on left and 24px on right = 48px
  const availableWidth = viewportWidth - sidebarWidth - 48
  // Left card flexes: availableWidth - rightCard - gap
  const leftCardWidth = Math.max(569, availableWidth - rightCardWidth - columnGap)
  const netGridWidth = leftCardWidth + columnGap + rightCardWidth

  // Excess whitespace occurs when layout is locked to fixed max-width 1152px on wide desktop
  const hasExcessWhitespace = viewportWidth > 1280 && netGridWidth <= 984

  return {
    viewportWidth,
    isStacked: false,
    headerHeight,
    sidebarWidth,
    contentWidth: availableWidth,
    leftCardWidth,
    columnGap,
    rightCardWidth,
    netGridWidth,
    hasExcessWhitespace,
  }
}

/**
 * Inspects CSS and HTML stylesheets directly from workspace
 */
export function inspectWorkspaceTokens() {
  const posStylePath = path.resolve(__dirname, '../../../POS/style.css')
  const gadaiStylePath = path.resolve(__dirname, '../../../POS/pembayaran-gadai/style.css')
  const htmlPath = path.resolve(__dirname, '../../../POS/index.html')

  const posStyle = fs.existsSync(posStylePath) ? fs.readFileSync(posStylePath, 'utf-8') : ''
  const gadaiStyle = fs.existsSync(gadaiStylePath) ? fs.readFileSync(gadaiStylePath, 'utf-8') : ''
  const htmlContent = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf-8') : ''

  return {
    posStyle,
    gadaiStyle,
    htmlContent,
    hasToken(token: string): boolean {
      return posStyle.includes(token) || gadaiStyle.includes(token)
    },
    hasFont(fontName: string): boolean {
      return htmlContent.includes(fontName) || posStyle.includes(fontName)
    },
  }
}

/**
 * End-to-end POS State Machine Driver
 */
export class PosFlowStateMachine {
  public stage: 'form' | 'instructions' | 'result' = 'form'
  public creditNumber = ''
  public hasCredit = false
  public creditError = ''
  public transactionType: TransactionType | null = null
  public paymentMethod: PaymentMethod | null = null
  public installmentAmount = 500_000
  public reviewOpen = false
  public resultStatus: 'success' | 'failed' = 'success'
  public paymentCheckState: 'idle' | 'checking' | 'pending' = 'idle'
  public announcement = ''
  public transactionId = 'TRX-20241101-99812'

  public get summary(): PaymentSummary {
    const digits = this.creditNumber.replace(/\D/g, '')
    const baseCredit: CreditRecord = {
      ...mockCreditRecord,
      number: digits || mockCreditRecord.number,
    }

    let principal = 0
    if (this.transactionType === 'Pelunasan') {
      principal = baseCredit.loanAmount
    } else if (this.transactionType === 'Cicil') {
      principal = Math.min(Math.max(this.installmentAmount, 0), baseCredit.loanAmount)
    } else if (this.transactionType === 'Sewa Modal') {
      principal = 0
    }

    const total = this.transactionType
      ? principal + baseCredit.rentAmount + baseCredit.serviceFee
      : 0

    return {
      ...baseCredit,
      installmentAmount: this.installmentAmount,
      transactionType: this.transactionType,
      paymentMethod: this.paymentMethod,
      total,
    }
  }

  public get canContinue(): boolean {
    return (
      this.hasCredit &&
      this.transactionType !== null &&
      this.paymentMethod !== null &&
      (this.transactionType !== 'Cicil' || this.installmentAmount > 0)
    )
  }

  public inputCreditNumber(value: string): void {
    this.creditNumber = value
    this.creditError = ''
    if (this.hasCredit) {
      this.hasCredit = false
      this.transactionType = null
      this.paymentMethod = null
    }
  }

  public searchCredit(): boolean {
    const digits = this.creditNumber.replace(/\D/g, '')
    if (digits.length !== 16) {
      this.creditError = 'Nomor kredit harus terdiri dari 16 digit.'
      return false
    }
    this.creditNumber = digits
    this.hasCredit = true
    this.creditError = ''
    this.transactionType = null
    this.paymentMethod = null
    return true
  }

  public selectTransactionType(type: TransactionType): void {
    if (!this.hasCredit) return
    this.transactionType = type
  }

  public setInstallmentAmount(amount: number): void {
    this.installmentAmount = amount
  }

  public selectPaymentMethod(method: PaymentMethod): void {
    if (!this.hasCredit || !this.transactionType) return
    this.paymentMethod = method
  }

  public triggerValidation(): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {}
    if (!this.creditNumber || this.creditNumber.replace(/\D/g, '').length !== 16) {
      errors.creditNumber = 'Nomor kredit harus diisi'
    }
    if (!this.transactionType) {
      errors.transactionType = 'Jenis transaksi harus diisi'
    }
    if (!this.paymentMethod) {
      errors.paymentMethod = 'Metode pembayaran harus diisi'
    }
    if (this.transactionType === 'Cicil' && this.installmentAmount <= 0) {
      errors.installmentAmount = 'Nominal cicilan harus lebih dari 0'
    }

    const valid = Object.keys(errors).length === 0
    return { valid, errors }
  }

  public continueToReview(): boolean {
    if (!this.canContinue) {
      this.announcement = 'Lengkapi nomor kredit, jenis transaksi, dan metode pembayaran terlebih dahulu.'
      return false
    }
    this.reviewOpen = true
    return true
  }

  public dismissReview(): void {
    this.reviewOpen = false
  }

  public confirmReview(): void {
    this.reviewOpen = false
    this.stage = 'instructions'
  }

  public triggerExpiry(): void {
    this.stage = 'result'
    this.resultStatus = 'failed'
  }

  public finishPayment(status: 'success' | 'failed'): void {
    this.stage = 'result'
    this.resultStatus = status
    this.paymentCheckState = 'idle'
  }

  public reset(): void {
    this.stage = 'form'
    this.creditNumber = ''
    this.hasCredit = false
    this.creditError = ''
    this.transactionType = null
    this.paymentMethod = null
    this.installmentAmount = 500_000
    this.reviewOpen = false
    this.resultStatus = 'success'
    this.paymentCheckState = 'idle'
    this.announcement = ''
  }
}
