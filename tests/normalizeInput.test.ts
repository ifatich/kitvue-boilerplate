import { describe, it, expect } from 'vitest'
import { normalizeNominalInput, normalizeTahunInput } from '../src/utils/normalizeInput'

describe('normalizeNominalInput', () => {
  it('membersihkan angka polos', () => {
    expect(normalizeNominalInput('35000000')).toBe('35000000')
  })

  it('membersihkan format ribuan standar Indonesia (titik)', () => {
    expect(normalizeNominalInput('35.000.000')).toBe('35000000')
  })

  it('membersihkan awalan mata uang Rp', () => {
    expect(normalizeNominalInput('Rp 35.000.000')).toBe('35000000')
  })

  it('membersihkan format ribuan internasional (koma)', () => {
    expect(normalizeNominalInput('35,000,000')).toBe('35000000')
  })

  it('membuang bagian desimal di akhir jika berpola koma 1-2 digit', () => {
    expect(normalizeNominalInput('35.000.000,50')).toBe('35000000')
    expect(normalizeNominalInput('50.000,5')).toBe('50000')
    expect(normalizeNominalInput('100,50')).toBe('100')
  })

  it('membersihkan karakter huruf dan simbol acak (abc123xyz)', () => {
    expect(normalizeNominalInput('abc123xyz')).toBe('123')
  })

  it('membersihkan angka minus (-5000)', () => {
    expect(normalizeNominalInput('-5000')).toBe('5000')
  })

  it('membersihkan teks dengan baris baru (newline) dan spasi', () => {
    expect(normalizeNominalInput('  Rp 35.000.000\n  ')).toBe('35000000')
  })

  it('membatasi panjang maksimal 12 digit untuk mencegah overflow integer', () => {
    expect(normalizeNominalInput('1234567890123456')).toBe('123456789012')
  })

  it('menangani input kosong, null, dan undefined', () => {
    expect(normalizeNominalInput('')).toBe('')
    expect(normalizeNominalInput(null)).toBe('')
    expect(normalizeNominalInput(undefined)).toBe('')
  })

  it('menormalkan angka nol di depan', () => {
    expect(normalizeNominalInput('0500')).toBe('500')
    expect(normalizeNominalInput('0')).toBe('0')
  })
})

describe('normalizeTahunInput', () => {
  it('menerima bilangan bulat normal', () => {
    expect(normalizeTahunInput('10')).toEqual({ value: '10', hadDecimal: false })
    expect(normalizeTahunInput('31')).toEqual({ value: '31', hadDecimal: false })
  })

  it('memotong desimal bertitik (10.5) dan mengembalikan hadDecimal: true', () => {
    expect(normalizeTahunInput('10.5')).toEqual({ value: '10', hadDecimal: true })
  })

  it('memotong desimal berkoma (10,5) dan mengembalikan hadDecimal: true', () => {
    expect(normalizeTahunInput('10,5')).toEqual({ value: '10', hadDecimal: true })
  })

  it('menerima paste 125 tanpa memotong ke 12, dan membatasi maksimal 3 digit', () => {
    expect(normalizeTahunInput('125')).toEqual({ value: '125', hadDecimal: false })
    expect(normalizeTahunInput('1250')).toEqual({ value: '125', hadDecimal: false })
  })

  it('membersihkan karakter non-digit', () => {
    expect(normalizeTahunInput('15 tahun')).toEqual({ value: '15', hadDecimal: false })
  })

  it('menangani nilai kosong atau null', () => {
    expect(normalizeTahunInput('')).toEqual({ value: '', hadDecimal: false })
    expect(normalizeTahunInput(null)).toEqual({ value: '', hadDecimal: false })
    expect(normalizeTahunInput(undefined)).toEqual({ value: '', hadDecimal: false })
  })
})
