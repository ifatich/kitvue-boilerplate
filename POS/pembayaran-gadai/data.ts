import type { CreditRecord, PaymentMethod, TransactionType } from './payment-types'
import { paymentAsset } from './asset-url'

export const mockCreditRecord: CreditRecord = {
  number: '1234393948486060',
  customer: 'Bianca Putri',
  loanAmount: 10_000_000,
  dailyRent: 5_000,
  rentDays: 30,
  rentAmount: 140_000,
  serviceFee: 2_500,
}

export const transactionTypes: Array<{
  value: TransactionType
  description: string
}> = [
  { value: 'Sewa Modal', description: 'Bayar biaya sewa modal kredit gadai.' },
  { value: 'Cicil', description: 'Bayar sebagian dari sisa pinjaman.' },
  { value: 'Pelunasan', description: 'Lunasi pinjaman dan ambil barang jaminan.' },
]

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'bca-va',
    label: 'BCA Virtual Account',
    bank: 'BCA',
    logo: paymentAsset('bca.png'),
    description: 'Transaksi minimal Rp10.000',
    category: 'Virtual Account',
  },
  {
    id: 'mandiri-va',
    label: 'Mandiri Virtual Account',
    bank: 'Mandiri',
    logo: paymentAsset('mandiri.png'),
    description: 'Transaksi minimal Rp10.000',
    category: 'Virtual Account',
  },
  {
    id: 'bri-debit',
    label: 'BRI Direct Debit',
    bank: 'BRI',
    logo: paymentAsset('bri.png'),
    productIcon: paymentAsset('direct-debit.svg'),
    category: 'Direct Debit',
  },
  {
    id: 'merchant',
    label: 'Bayar di Merchant',
    bank: 'Merchant',
    logo: paymentAsset('merchant.svg'),
    description: 'Bayar di Indomaret, Alfamart, dan Kantor pos.',
    category: 'Metode Pembayaran Lain',
  },
]

export function getPaymentTotal(
  transactionType: TransactionType | null,
  credit: CreditRecord,
  installmentAmount = 500_000,
): number {
  if (!transactionType) return 0

  const principal = transactionType === 'Sewa Modal'
    ? 0
    : transactionType === 'Cicil'
      ? Math.min(Math.max(installmentAmount, 0), credit.loanAmount)
      : credit.loanAmount
  return principal + credit.rentAmount + credit.serviceFee
}
