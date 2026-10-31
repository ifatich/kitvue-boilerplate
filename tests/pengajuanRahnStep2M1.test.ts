import { describe, expect, it } from 'vitest'
import {
  type LoanPortfolioItem,
  createDefaultPelaksanaState,
  createInitialStep2State,
  formatMaskedIdentity,
  normalizeIdentityNumber,
  searchRahinCif,
  sortLoanPortfolio,
} from '@/components/modules/rahn/mockRahinData'

describe('Pinjaman Rahn Step 2 (M1) - Mock Data & State Machine', () => {
  describe('normalizeIdentityNumber', () => {
    it('should strip all whitespace and convert lowercase to uppercase', () => {
      expect(normalizeIdentityNumber(' 3204 1111 1298 0003 ')).toBe('3204111112980003')
      expect(normalizeIdentityNumber('a 123 456 b')).toBe('A123456B')
      expect(normalizeIdentityNumber('')).toBe('')
      expect(normalizeIdentityNumber(undefined)).toBe('')
    })
  })

  describe('formatMaskedIdentity', () => {
    it('should mask middle digits of 16-digit KTP correctly', () => {
      const masked = formatMaskedIdentity('3204111112980003', 'ktp')
      expect(masked).toBe('3204 **** **** 0003')
    })

    it('should mask middle characters of Passport correctly', () => {
      const masked = formatMaskedIdentity('0033971484', 'paspor')
      expect(masked).toBe('0033 **** 84')
    })
  })

  describe('sortLoanPortfolio', () => {
    it('should sort loan portfolio primarily by Kolektabilitas (Kol1 -> Kol5) and secondarily by Status (Aktif -> Lunas)', () => {
      const rawList: LoanPortfolioItem[] = [
        {
          no: 1,
          nomorKontrakMasked: 'K-001',
          namaProduk: 'Produk A',
          nominalMasked: 'Rp 10.000.000',
          kolektabilitas: '2 - DPK',
          kolektabilitasScore: 2,
          statusKredit: 'Aktif',
        },
        {
          no: 2,
          nomorKontrakMasked: 'K-002',
          namaProduk: 'Produk B',
          nominalMasked: 'Rp 5.000.000',
          kolektabilitas: '1 - Lancar',
          kolektabilitasScore: 1,
          statusKredit: 'Lunas',
        },
        {
          no: 3,
          nomorKontrakMasked: 'K-003',
          namaProduk: 'Produk C',
          nominalMasked: 'Rp 8.000.000',
          kolektabilitas: '1 - Lancar',
          kolektabilitasScore: 1,
          statusKredit: 'Aktif',
        },
      ]

      const sorted = sortLoanPortfolio(rawList)

      // K-003 (Kol 1, Aktif) must come first
      expect(sorted[0].nomorKontrakMasked).toBe('K-003')
      // K-002 (Kol 1, Lunas) must come second
      expect(sorted[1].nomorKontrakMasked).toBe('K-002')
      // K-001 (Kol 2, Aktif) must come third
      expect(sorted[2].nomorKontrakMasked).toBe('K-001')
    })
  })

  describe('searchRahinCif', () => {
    it('should find Syariah and Konvensional records for registered Syariah KTP', () => {
      const result = searchRahinCif('perorangan', 'ktp', '3204 1111 1298 0003')
      expect(result.cifList.length).toBeGreaterThanOrEqual(1)
      expect(result.cifList.some((c) => c.statusRahin === 'syariah')).toBe(true)
      expect(result.portfolioList.length).toBeGreaterThan(0)
    })

    it('should return only Konvensional CIF for Konven-only customer', () => {
      const result = searchRahinCif('perorangan', 'ktp', '3204 2222 1298 0004')
      expect(result.cifList.length).toBe(1)
      expect(result.cifList[0].statusRahin).toBe('konvensional')
      expect(result.portfolioList.length).toBeGreaterThan(0)
    })

    it('should return empty list and zero portfolio for unregistered NIK', () => {
      const result = searchRahinCif('perorangan', 'ktp', '3204 9999 9999 9999')
      expect(result.cifList.length).toBe(0)
      expect(result.portfolioList.length).toBe(0)
    })

    it('should find CIF record for registered Passport number', () => {
      const result = searchRahinCif('perorangan', 'paspor', '0033 9714 84')
      expect(result.cifList.length).toBe(1)
      expect(result.cifList[0].jenisIdentitas).toBe('paspor')
      expect(result.portfolioList.length).toBeGreaterThan(0)
    })
  })

  describe('createInitialStep2State and createDefaultPelaksanaState', () => {
    it('should produce valid initial state structures conforming to Interface Contracts', () => {
      const step2 = createInitialStep2State()
      expect(step2.currentView).toBe('search')
      expect(step2.selectedCifId).toBeNull()
      expect(step2.cifList).toEqual([])
      expect(step2.portfolioList).toEqual([])
      expect(step2.search.tipeRahin).toBe('')
      expect(step2.search.jenisIdentitas).toBe('')

      const pelaksana = createDefaultPelaksanaState()
      expect(pelaksana.isActive).toBe(false)
      expect(pelaksana.kewarganegaraan).toBe('WNI')
      expect(pelaksana.masaBerlakuType).toBe('seumur_hidup')
    })
  })
})
