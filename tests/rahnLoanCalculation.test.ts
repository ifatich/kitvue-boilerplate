import { describe, expect, it } from 'vitest'
import {
  calculateRahnLoan,
  getMaximumRahnLoan,
  getRahnLoanTier,
} from '../src/utils/rahnLoanCalculation'

describe('Rahn loan calculation', () => {
  it('maps tier boundaries to the loan classes in the tariff table', () => {
    expect(getRahnLoanTier(50_000)?.code).toBe('A')
    expect(getRahnLoanTier(500_000)?.code).toBe('A')
    expect(getRahnLoanTier(500_001)?.code).toBe('B1')
    expect(getRahnLoanTier(15_000_001)?.code).toBe('C3')
    expect(getRahnLoanTier(1_000_000_001)?.code).toBe('D7')
    expect(getRahnLoanTier(49_999)).toBeUndefined()
  })

  it('rounds the appraisal-based loan limit down by the tier increment', () => {
    expect(getMaximumRahnLoan(12_000_000)).toBe(11_040_000)
    expect(getMaximumRahnLoan(12_345_678)).toBe(11_350_000)
  })

  it('calculates rental, fees, and net proceeds using the selected tier', () => {
    const result = calculateRahnLoan(6_000_000, 7_000_000, 1.2, 120)

    expect(result).toMatchObject({
      tier: { code: 'C1', administrationFee: 50_000, premium: 1_500 },
      loanLimit: 6_440_000,
      periodicRental: 72_000,
      totalRental: 576_000,
      administrationFee: 50_000,
      premiumFee: 1_500,
      receivedAmount: 5_948_500,
    })
  })
})
