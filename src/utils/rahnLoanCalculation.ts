export interface RahnLoanTier {
  code: string
  group: string
  minimum: number
  maximum: number
  administrationFee: number
  premium: number
  rounding: number
  appraisalPercentage: number
  tariffRate: number
}

export const rahnLoanTiers: RahnLoanTier[] = [
  { code: 'A', group: 'A', minimum: 50_000, maximum: 500_000, administrationFee: 2_000, premium: 500, rounding: 10_000, appraisalPercentage: 0.92, tariffRate: 1 },
  { code: 'B1', group: 'B', minimum: 500_001, maximum: 1_000_000, administrationFee: 10_000, premium: 1_000, rounding: 10_000, appraisalPercentage: 0.92, tariffRate: 1.2 },
  { code: 'B2', group: 'B', minimum: 1_000_001, maximum: 2_500_000, administrationFee: 20_000, premium: 1_000, rounding: 10_000, appraisalPercentage: 0.92, tariffRate: 1.2 },
  { code: 'B3', group: 'B', minimum: 2_500_001, maximum: 5_000_000, administrationFee: 35_000, premium: 1_000, rounding: 10_000, appraisalPercentage: 0.92, tariffRate: 1.2 },
  { code: 'C1', group: 'C', minimum: 5_000_001, maximum: 10_000_000, administrationFee: 50_000, premium: 1_500, rounding: 10_000, appraisalPercentage: 0.92, tariffRate: 1.2 },
  { code: 'C2', group: 'C', minimum: 10_000_001, maximum: 15_000_000, administrationFee: 75_000, premium: 1_500, rounding: 10_000, appraisalPercentage: 0.92, tariffRate: 1.2 },
  { code: 'C3', group: 'C', minimum: 15_000_001, maximum: 20_000_000, administrationFee: 100_000, premium: 1_500, rounding: 10_000, appraisalPercentage: 0.93, tariffRate: 1.2 },
  { code: 'D', group: 'D', minimum: 20_000_001, maximum: 100_000_000, administrationFee: 125_000, premium: 2_500, rounding: 100_000, appraisalPercentage: 0.93, tariffRate: 1.1 },
  { code: 'D1', group: 'D', minimum: 100_000_001, maximum: 200_000_000, administrationFee: 125_000, premium: 2_500, rounding: 100_000, appraisalPercentage: 0.93, tariffRate: 1.1 },
  { code: 'D2', group: 'D', minimum: 200_000_001, maximum: 300_000_000, administrationFee: 125_000, premium: 2_500, rounding: 100_000, appraisalPercentage: 0.93, tariffRate: 1.1 },
  { code: 'D3', group: 'D', minimum: 300_000_001, maximum: 400_000_000, administrationFee: 125_000, premium: 2_500, rounding: 100_000, appraisalPercentage: 0.93, tariffRate: 1.1 },
  { code: 'D4', group: 'D', minimum: 400_000_001, maximum: 500_000_000, administrationFee: 125_000, premium: 2_500, rounding: 100_000, appraisalPercentage: 0.93, tariffRate: 1.1 },
  { code: 'D5', group: 'D', minimum: 500_000_001, maximum: 750_000_000, administrationFee: 125_000, premium: 2_500, rounding: 100_000, appraisalPercentage: 0.93, tariffRate: 1.1 },
  { code: 'D6', group: 'D', minimum: 750_000_001, maximum: 1_000_000_000, administrationFee: 125_000, premium: 2_500, rounding: 100_000, appraisalPercentage: 0.93, tariffRate: 1.1 },
  { code: 'D7', group: 'D', minimum: 1_000_000_001, maximum: Number.POSITIVE_INFINITY, administrationFee: 125_000, premium: 2_500, rounding: 100_000, appraisalPercentage: 0.93, tariffRate: 1.1 },
]

export const getRahnLoanTier = (amount: number) => rahnLoanTiers.find(
  (tier) => amount >= tier.minimum && amount <= tier.maximum,
)

const roundDown = (amount: number, increment: number) => Math.floor(amount / increment) * increment

const getTierLoanLimit = (appraisal: number, tier: RahnLoanTier) => Math.min(
  tier.maximum,
  roundDown(appraisal * tier.appraisalPercentage, tier.rounding),
)

export const getMaximumRahnLoan = (appraisal: number) => {
  if (!Number.isFinite(appraisal) || appraisal <= 0) return 0

  return rahnLoanTiers.reduce((maximum, tier) => {
    const tierLimit = getTierLoanLimit(appraisal, tier)
    return tierLimit >= tier.minimum ? Math.max(maximum, tierLimit) : maximum
  }, 0)
}

export interface RahnLoanCalculation {
  tier: RahnLoanTier
  loanLimit: number
  periodicRental: number
  totalRental: number
  administrationFee: number
  premiumFee: number
  receivedAmount: number
}

export const calculateRahnLoan = (
  amount: number,
  appraisal: number,
  tariffRate: number,
  durationDays: number,
): RahnLoanCalculation | undefined => {
  const tier = getRahnLoanTier(amount)
  if (
    !tier
    || !Number.isFinite(appraisal)
    || appraisal <= 0
    || !Number.isFinite(tariffRate)
    || tariffRate <= 0
    || !Number.isFinite(durationDays)
    || durationDays <= 0
  ) return undefined

  const loanLimit = getTierLoanLimit(appraisal, tier)
  const periodicRental = Math.round(amount * tariffRate / 100)
  const periodCount = Math.ceil(durationDays / 15)
  const administrationFee = tier.administrationFee
  const premiumFee = tier.premium

  return {
    tier,
    loanLimit,
    periodicRental,
    totalRental: periodicRental * periodCount,
    administrationFee,
    premiumFee,
    receivedAmount: amount - administrationFee - premiumFee,
  }
}

export const getRemainingRahnLoanLimit = (maximumLoan: number, amount: number) => {
  if (
    !Number.isFinite(maximumLoan)
    || maximumLoan <= 0
    || !Number.isFinite(amount)
    || amount <= 0
  ) return undefined

  return Math.max(maximumLoan - amount, 0)
}
