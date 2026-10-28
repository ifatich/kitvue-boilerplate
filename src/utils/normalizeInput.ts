/**
 * @file normalizeInput.ts
 * @description Fungsi murni sanitasi input finansial dan jangka waktu tahun.
 * Memastikan tampilan dan nilai internal selalu konsisten serta kebal terhadap
 * berbagai format paste, drop, keyboard shortcut, dan input mobile.
 */

/**
 * Normalisasi input nominal uang (Rupiah):
 * 1. Membuang desimal di akhir jika berpola koma diikuti 1-2 digit (misal: ',50' atau ',5').
 * 2. Membuang seluruh karakter non-digit (termasuk 'Rp', '.', ',', spasi, minus, karakter teks).
 * 3. Membatasi panjang maksimal 12 digit (menghindari batas presisi floating point JS).
 *
 * Contoh hasil:
 * - 'Rp 35.000.000' -> '35000000'
 * - '35,000,000' -> '35000000'
 * - '35.000.000,50' -> '35000000'
 * - 'abc123xyz' -> '123'
 * - '-5000' -> '5000'
 * - 'Rp 35.000.000\n' -> '35000000'
 *
 * @param raw - Nilai string atau numerik mentah
 * @returns String digit bersih (maks 12 digit)
 */
export function normalizeNominalInput(raw: string | number | null | undefined): string {
  if (raw === null || raw === undefined) return ''
  let str = String(raw).trim()
  if (!str) return ''

  // 1. Buang bagian desimal jika berpola koma diikuti 1-2 digit di akhir
  // Contoh: "35.000.000,50" -> "35.000.000" atau "50,5" -> "50"
  str = str.replace(/,\d{1,2}$/, '')

  // 2. Buang seluruh karakter non-digit
  str = str.replace(/\D/g, '')

  // 3. Normalisasi angka nol di depan (misal "0500" -> "500")
  str = str.replace(/^0+(?=\d)/, '')

  // 4. Batasi maksimal 12 digit
  if (str.length > 12) {
    str = str.slice(0, 12)
  }

  return str
}

export interface NormalizeTahunResult {
  /** Nilai string tahun bersih (maks 2 digit) */
  value: string
  /** Apakah input mengandung pemisah desimal yang dipotong */
  hadDecimal: boolean
}

/**
 * Normalisasi input jangka waktu tahun:
 * 1. Hanya menerima bilangan bulat, maksimal 2 digit.
 * 2. Jika input mengandung pemisah desimal (misal '10.5' atau '10,5'),
 *    ambil bagian bulat sebelum pemisah ('10') dan tandai hadDecimal: true.
 * 3. Membuang karakter non-digit lainnya.
 *
 * @param raw - Nilai string atau numerik mentah
 * @returns Objek hasil normalisasi berserta penanda desimal
 */
export function normalizeTahunInput(raw: string | number | null | undefined): NormalizeTahunResult {
  if (raw === null || raw === undefined) {
    return { value: '', hadDecimal: false }
  }
  let str = String(raw).trim()
  if (!str) {
    return { value: '', hadDecimal: false }
  }

  let hadDecimal = false

  // Cek apakah ada pemisah desimal (. atau ,)
  if (/[.,]/.test(str)) {
    hadDecimal = true
    // Ambil bagian bulat sebelum pemisah desimal pertama
    str = str.split(/[.,]/)[0]
  }

  // Buang karakter non-digit
  str = str.replace(/\D/g, '')

  // Normalisasi angka nol di depan jika lebih dari 1 digit
  str = str.replace(/^0+(?=\d)/, '')

  // Batasi maksimal 3 digit bilangan bulat (menampung paste hingga 3 digit seperti "125")
  if (str.length > 3) {
    str = str.slice(0, 3)
  }

  return {
    value: str,
    hadDecimal,
  }
}
