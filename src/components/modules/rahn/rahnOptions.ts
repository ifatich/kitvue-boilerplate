import type { RahnOption } from '@/views/rahn/rahnFlow'

export const makeRahnOptions = (labels: string[]): RahnOption[] => (
  labels.map((label) => ({ value: label, label }))
)

export const nasabahTypeOptions = makeRahnOptions(['Perorangan', 'Badan Usaha'])
export const purposeOptions = makeRahnOptions(['Produktif', 'Konsumtif'])
export const productiveTransactionOptions = makeRahnOptions(['Usaha / Modal Kerja', 'Investasi'])
export const consumptiveTransactionOptions = makeRahnOptions([
  'Pembelian Kendaraan',
  'Ibadah Haji',
  'Pembelian Barang / Jasa',
  'Wisata Rohani',
  'Hajatan / Upacara',
  'Biaya Pendidikan',
  'Lain-Lain',
])
export const employmentOptions = makeRahnOptions([
  'Wirausaha/Pedagang',
  'Pensiunan',
  'Karyawan Swasta',
  'Wiraswasta',
  'Karyawan BUMN',
  'Karyawan BUMD',
  'Biarawati',
  'Peneliti',
  'Tentara Nasional Indonesia',
  'Kepolisian RI (POLRI)',
  'Perdagangan',
  'Peternak',
  'Industri',
  'Konstruksi/Engineering',
  'Transportasi',
  'Mengurus Rumah Tangga',
  'Karyawan Honorer',
  'Buruh Harian Lepas',
  'Buruh Tani/Perkebunan',
  'Buruh Nelayan/Perikanan',
  'Petani/Pekebun',
  'Buruh Peternakan',
])
export const rubricOptions = makeRahnOptions([
  'Kendaraan',
  'Barang Elektronik',
  'Barang Gudang',
  'Barang Kantong',
  'Surat Berharga',
  'Barang Persediaan',
  'Efek',
])
export const tariffOptions = makeRahnOptions([
  'Sewa Modal Harian',
  'Sewa Modal Harian Per 10 Hari',
  'Sewa Modal Harian Per 15 Hari',
])
export const productOptions = makeRahnOptions(['Gadai KCA'])
export const durationOptions = makeRahnOptions(['120 Hari'])
export const ownerOptions = makeRahnOptions(['Diri sendiri', 'Beneficial Owner'])
export const tariffChangeOptions = [
  { text: 'Iya', value: 'Iya' },
  { text: 'Tidak', value: 'Tidak' },
]
export const rahinTypeOptions = makeRahnOptions(['Perorangan', 'Badan Usaha'])
export const identityOptions = makeRahnOptions(['KTP', 'Paspor'])
export const relationshipOptions = makeRahnOptions([
  'Suami / Istri',
  'Orang Tua/Anak',
  'Kakak/Adik',
  'Majikan/Karyawan',
  'Lainnya',
])
export const genderOptions = makeRahnOptions(['Laki-Laki', 'Perempuan'])
export const educationOptions = makeRahnOptions([
  'SMP',
  'SMA',
  'D1',
  'D2',
  'D3 / Akademi',
  'S1',
  'S2',
  'S3',
  'Tidak Sekolah',
])
export const maritalOptions = makeRahnOptions(['Janda', 'Duda', 'Belum Menikah', 'Menikah'])
export const populationOptions = makeRahnOptions(['Penduduk', 'Bukan Penduduk'])
export const fundOptions = makeRahnOptions(['Gaji', 'Hasil Usaha', 'Pinjaman', 'Hasil Investasi', 'Hibah', 'Warisan'])
export const incomeOptions = makeRahnOptions([
  '1 - 3 Juta',
  '3 - 5 Juta',
  '5 - 10 Juta',
  '10 - 20 Juta',
  '20 - 50 Juta',
  '> 50 Juta',
])
export const validityOptions = makeRahnOptions(['Seumur Hidup', 'Sampai Dengan'])
export const nationalityOptions = makeRahnOptions(['WNI', 'WNA'])
export const provinceOptions = makeRahnOptions(['Aceh', 'Bali', 'Banten', 'Bengkulu', 'DI Yogyakarta', 'DKI Jakarta'])
export const cityOptions = makeRahnOptions([
  'Jakarta Barat',
  'Jakarta Pusat',
  'Jakarta Selatan',
  'Jakarta Timur',
  'Jakarta Utara',
])
export const districtOptions = makeRahnOptions(['Cempaka Putih', 'Johar Baru', 'Kemayoran', 'Menteng', 'Senen'])
export const subdistrictOptions = makeRahnOptions(['Cikini', 'Gondangdia', 'Kebon Sirih', 'Pegangsaan'])

export const purposeTransactionOptions = [
  ...productiveTransactionOptions,
  ...consumptiveTransactionOptions,
]
