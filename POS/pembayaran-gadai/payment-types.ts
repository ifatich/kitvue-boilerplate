export type TransactionType = 'Sewa Modal' | 'Cicil' | 'Pelunasan'

export type PaymentMethodId = 'bca-va' | 'mandiri-va' | 'bri-debit' | 'merchant'

export interface PaymentMethod {
  id: PaymentMethodId
  label: string
  bank: string
  logo: string
  description?: string
  productIcon?: string
  category: 'Virtual Account' | 'Direct Debit' | 'Metode Pembayaran Lain'
}

export interface CreditRecord {
  number: string
  customer: string
  loanAmount: number
  dailyRent: number
  rentDays: number
  rentAmount: number
  serviceFee: number
}

export interface PaymentSummary extends CreditRecord {
  total: number
  installmentAmount: number
  transactionType: TransactionType | null
  paymentMethod: PaymentMethod | null
}

export interface FormErrors {
  creditNumber?: string
  transactionType?: string
  paymentMethod?: string
  installmentAmount?: string
}

export type FlowStage = 'form' | 'instructions' | 'result'
export type ResultStatus = 'success' | 'failed'
export type PaymentCheckState = 'idle' | 'checking' | 'pending'
