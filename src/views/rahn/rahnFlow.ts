import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { ReadonlyInfoItem } from '@/components/modules/rahn'

export type RahnOption = { value: string; label: string }

export interface RahnApplicationFields {
  tujuanPengajuan: string
  tujuanTransaksi: string
  pekerjaanTerkini: string
  rubrikMarhun: string
  skemaTarif: string
  produk: string
  jangkaWaktu: string
  beneficialOwner: string
  tipeRahin: string
  tipeIdentitas: string
  nikBeneficialOwner: string
  hubunganBeneficialOwner: string
  jenisKelamin: string
  pendidikan: string
  statusPerkawinan: string
  namaPasangan: string
  tanggalLahirPasangan: string
  tanggungan: string
  handphone: string
  telepon: string
  email: string
  npwp: string
  tipeKependudukan: string
  kewarganegaraan: string
  sumberDana: string
  agama: string
  penghasilan: string
  pekerjaanBeneficialOwner: string
  kodePos: string
  provinsi: string
  kota: string
  kecamatan: string
  kelurahan: string
  rt: string
  rw: string
  alamat: string
  alamatSaatIni: string
  kodePosSaatIni: string
  provinsiSaatIni: string
  kotaSaatIni: string
  kecamatanSaatIni: string
  kelurahanSaatIni: string
  rtSaatIni: string
  rwSaatIni: string
  namaBeneficialOwner: string
  namaIbu: string
  tempatLahir: string
  tanggalLahir: string
  masaBerlaku: string
  masaBerlakuDate: string
}

export interface NasabahFields {
  tipeNasabah: string
  nik: string
}

export interface RahnCustomerSummary {
  status: string
  cif: string
  name: string
  rating: string
  nik: string
  birthDate: string
  dukcapil: string
  motherName: string
  gender: string
  address: string
  phone: string
  branch: string
  postalCode: string
  kelurahan: string
  kecamatan: string
  province: string
  city: string
  rt: string
  rw: string
}

export interface RahnCollateral {
  rubric: string
  collateralType: string
  partner: string
  brand: string
  denomination: string
  pieces: number
  karat: string
  estimatedValue: number
  description: string
  photos: string[]
}

export interface RahnFlowContext {
  steps: string[]
  fields: Ref<RahnApplicationFields>
  fieldsNasabah: Ref<NasabahFields>
  customerSearchResults: Ref<RahnCustomerSummary[]>
  selectedCustomer: Ref<RahnCustomerSummary | null>
  collaterals: Ref<RahnCollateral[]>
  loanAmount: Ref<string>
  tariffChange: Ref<string>
  tariffRate: Ref<string>
  isMobile: ComputedRef<boolean>
  isSubmitted: Ref<boolean>
  isInformasiRahnOpen: Ref<boolean>
  isBeneficialOwnerOpen: Ref<boolean>
  isInformasiNasabahOpen: Ref<boolean>
  isNasabahInquired: Ref<boolean>
  isNasabahSearchSubmitted: Ref<boolean>
  isNasabahSelected: Ref<boolean>
  hasBeneficialOwner: ComputedRef<boolean>
  purposeOptions: RahnOption[]
  purposeTransactionOptions: ComputedRef<RahnOption[]>
  employmentOptions: RahnOption[]
  rubricOptions: RahnOption[]
  tariffOptions: RahnOption[]
  productOptions: RahnOption[]
  durationOptions: ComputedRef<RahnOption[]>
  ownerOptions: RahnOption[]
  rahinTypeOptions: RahnOption[]
  identityOptions: RahnOption[]
  relationshipOptions: RahnOption[]
  genderOptions: RahnOption[]
  educationOptions: RahnOption[]
  maritalOptions: RahnOption[]
  populationOptions: RahnOption[]
  fundOptions: RahnOption[]
  incomeOptions: RahnOption[]
  validityOptions: RahnOption[]
  nationalityOptions: RahnOption[]
  provinceOptions: RahnOption[]
  cityOptions: RahnOption[]
  districtOptions: RahnOption[]
  subdistrictOptions: RahnOption[]
  nasabahTypeOptions: RahnOption[]
  isOwnerResultsVisible: Ref<boolean>
  ownerMatchFound: Ref<boolean>
  isOwnerDetailsVisible: Ref<boolean>
  isExistingBeneficialOwnerSelected: Ref<boolean>
  isOwnerDataConfirmed: Ref<boolean>
  isOwnerAddressSame: Ref<boolean>
  showOwnerNotFoundModal: Ref<boolean>
  dukcapilStatus: Ref<'idle' | 'success' | 'failed'>
  ownerAge: ComputedRef<number | null>
  isRtValid: ComputedRef<boolean>
  isRwValid: ComputedRef<boolean>
  akadItems: ComputedRef<ReadonlyInfoItem[]>
  searchNasabah: () => void
  searchBeneficialOwner: () => void
  continueToAddBeneficialOwner: () => void
  openBeneficialOwnerDetail: () => Promise<void>
  checkDukcapil: () => void
}

export const rahnFlowKey: InjectionKey<RahnFlowContext> = Symbol('rahn-flow')
