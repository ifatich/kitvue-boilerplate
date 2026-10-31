// Shared
export { default as RahnReadonlyInfoGrid } from './shared/RahnReadonlyInfoGrid.vue'
export type { ReadonlyInfoItem } from './shared/RahnReadonlyInfoGrid.vue'

// Step 1
export { default as Step1PengajuanContent } from './step-1/Step1PengajuanContent.vue'
export { default as InformasiRahnSection } from './step-1/InformasiRahnSection.vue'
export type { RahnFields } from './step-1/InformasiRahnSection.vue'

export { default as BeneficialOwnerSection } from './step-1/BeneficialOwnerSection.vue'
export type { BeneficialOwnerState } from './step-1/BeneficialOwnerSection.vue'

export { default as BeneficialOwnerTableSection } from './step-1/BeneficialOwnerTableSection.vue'
export { default as BeneficialOwnerDetailSections } from './step-1/BeneficialOwnerDetailSections.vue'

export { default as BeneficialOwnerSuratKuasaModal } from './step-1/modals/BeneficialOwnerSuratKuasaModal.vue'
export { default as BeneficialOwnerNotFoundModal } from './step-1/modals/BeneficialOwnerNotFoundModal.vue'
export { default as BeneficialOwnerConfirmResetModal } from './step-1/modals/BeneficialOwnerConfirmResetModal.vue'
export { default as BeneficialOwnerWarningModal } from './step-1/modals/BeneficialOwnerWarningModal.vue'
export { default as BeneficialOwnerSaveConfirmModal } from './step-1/modals/BeneficialOwnerSaveConfirmModal.vue'
export { default as BeneficialOwnerSaveSuccessModal } from './step-1/modals/BeneficialOwnerSaveSuccessModal.vue'

// Step 2
export { default as Step2RahinContent } from './step-2/Step2RahinContent.vue'
export { default as RahinSearchSection } from './step-2/RahinSearchSection.vue'
export { default as RahinPortfolioTableSection } from './step-2/RahinPortfolioTableSection.vue'
export { default as RahinCifTableSection } from './step-2/RahinCifTableSection.vue'
export { default as PelaksanaTransaksiSection } from './step-2/PelaksanaTransaksiSection.vue'
export { default as RahinDetailSection } from './step-2/RahinDetailSection.vue'
export { default as RahinSaveSuccessModal } from './step-2/modals/RahinSaveSuccessModal.vue'
export { default as RahinNotFoundModal } from './step-2/modals/RahinNotFoundModal.vue'
export type { RahinFields } from './step-2/Step2RahinContent.vue'

// Step 2 Mock Data & State Machine
export type {
  RahinType,
  IdentityType,
  RahinStatus,
  DukcapilStatus,
  PelaksanaIdentityType,
  MasaBerlakuType,
  LoanPortfolioItem,
  RahinCifItem,
  PelaksanaTransaksiState,
  Step2State,
  RahinPreset,
  PostalCodeLocation,
} from './mockRahinData'

export {
  MOCK_LOAN_PORTFOLIO_SYARIAH,
  MOCK_LOAN_PORTFOLIO_KONVEN,
  MOCK_LOAN_PORTFOLIO_PASPOR,
  MOCK_RAHIN_CIF_DATABASE,
  RAHIN_PRESETS,
  KTP_SYARIAH_FOUND,
  KTP_KONVEN_ONLY,
  PASPOR_FOUND,
  NOT_FOUND,
  POSTAL_CODE_DIRECTORY,
  PELAKSANA_KTP_PRESET,
  PELAKSANA_PASPOR_PRESET,
  formatMaskedIdentity,
  sortLoanPortfolio,
  searchRahinCif,
  lookupPostalCode,
  calculateAge,
  verifyDukcapil,
  createDefaultPelaksanaState,
  createInitialStep2State,
  convertKonvenToSyariahCif,
} from './mockRahinData'

// Step 1 Mock Data & Helpers
export type {
  BeneficialOwnerItem,
  BeneficialOwnerPreset,
} from './mockBeneficialOwnerData'
export {
  BENEFICIAL_OWNER_PRESETS,
  MOCK_BENEFICIAL_OWNERS,
  normalizeIdentityNumber,
  searchBeneficialOwnerList,
} from './mockBeneficialOwnerData'
