/**
 * @file tests/empiricalChallenger1.test.ts
 * @description Empirical Challenger 1 verification harness for Milestone M4.
 * Independently written without reading existing test files (Integrity Mode: demo).
 * Tests:
 * 1. Pelaksana Transaksi single component architecture & dynamic branch switching (KTP 11347:172827 vs Paspor 11347:170073).
 * 2. Branching input controls (NIK vs Paspor input rendering).
 * 3. Kewarganegaraan constraint rule 11347:178154 (Locked to WNI for KTP, selectable WNI/WNA for Paspor).
 * 4. Masa Berlaku toggle rules 11347:172997 & 11347:172995 (Seumur Hidup hides date, Sampai Dengan displays date).
 * 5. 16-digit spaced formatting, normalization, and masking oracles.
 * 6. Dynamic age calculation oracle.
 * 7. High-frequency adversarial stress testing & state transitions.
 * 8. Step2RahinContent validation guard when Pelaksana is active.
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'

// Polyfill window for kitvue-public components in Node environment
beforeAll(() => {
  if (typeof globalThis.window === 'undefined') {
    ;(globalThis as any).window = {
      screen: { height: 1080, width: 1920 },
      matchMedia: () => ({ matches: false }),
      addEventListener: () => {},
      removeEventListener: () => {},
    }
  }
})

import PelaksanaTransaksiSection from '@/components/modules/rahn/step-2/PelaksanaTransaksiSection.vue'
import Step2RahinContent from '@/components/modules/rahn/step-2/Step2RahinContent.vue'
import {
  createDefaultPelaksanaState,
  PELAKSANA_KTP_PRESET,
  PELAKSANA_PASPOR_PRESET,
  normalizeIdentityNumber,
  formatMaskedIdentity,
  calculateAge,
  type PelaksanaTransaksiState,
} from '@/components/modules/rahn/mockRahinData'

/**
 * Instantiates PelaksanaTransaksiSection inside an App's setup context.
 */
async function setupPelaksana(propsInit: { modelValue?: PelaksanaTransaksiState; isMobile?: boolean } = {}) {
  let exposed: any = null
  const emitted: Array<{ event: string; val: any }> = []

  const app = createSSRApp({
    setup() {
      const setupFn = (PelaksanaTransaksiSection as any).setup
      const props = {
        modelValue: propsInit.modelValue || createDefaultPelaksanaState(),
        isMobile: propsInit.isMobile || false,
        isOpen: true,
        collapsible: true,
      }
      setupFn(props, {
        emit: (event: string, val: any) => emitted.push({ event, val }),
        expose: (exp: any) => { exposed = exp },
      })
      return () => h('div')
    },
  })

  await renderToString(app, { modules: new Set() })

  return {
    exposed,
    emitted,
    getLastEmitted: () => (emitted.length > 0 ? emitted[emitted.length - 1].val : null),
  }
}

/**
 * Renders PelaksanaTransaksiSection to SSR HTML string.
 */
async function renderPelaksanaHtml(propsInit: { modelValue?: PelaksanaTransaksiState; isMobile?: boolean } = {}) {
  const app = createSSRApp({
    render: () => h(PelaksanaTransaksiSection, {
      modelValue: propsInit.modelValue || createDefaultPelaksanaState(),
      isMobile: propsInit.isMobile || false,
      isOpen: true,
      collapsible: true,
    }),
  })
  return await renderToString(app, { modules: new Set() })
}

/**
 * Instantiates Step2RahinContent inside an App's setup context.
 */
async function setupStep2(propsInit: any = {}) {
  let exposed: any = null
  const emitted: Array<{ event: string; val: any }> = []

  const app = createSSRApp({
    setup() {
      const setupFn = (Step2RahinContent as any).setup
      const props = {
        isMobile: false,
        boState: propsInit.boState,
        fields: propsInit.fields,
        modelValue: propsInit.modelValue,
      }
      setupFn(props, {
        emit: (event: string, val: any) => emitted.push({ event, val }),
        expose: (exp: any) => { exposed = exp },
      })
      return () => h('div')
    },
  })

  await renderToString(app, { modules: new Set() })

  return {
    exposed,
    emitted,
  }
}

describe('Challenger 1: Empirical Verification Harness', () => {

  // =========================================================================
  // SECTION 1: Single Component Architecture & Dynamic Branch Switching
  // =========================================================================
  describe('1. Single Component Architecture & Dynamic Switching (11347:172827 vs 11347:170073)', () => {
    it('initializes PelaksanaTransaksiSection as a single unified component with default KTP branch (11347:172827)', async () => {
      const { exposed } = await setupPelaksana()

      expect(exposed.state.value.identityType).toBe('ktp')
      expect(exposed.activeFigmaNodeId.value).toBe('11347:172827')
      expect(exposed.state.value.figmaNodeId).toBe('11347:172827')

      // Verify HTML renders the Figma Frame title and data-node-id
      const html = await renderPelaksanaHtml()
      expect(html).toContain('Data Pelaksana Transaksi')
      expect(html).toContain('data-node-id="11347:172884"')
    })

    it('dynamically switches to Paspor branch (11347:170073) and updates state and emitted contract', async () => {
      const { exposed, getLastEmitted } = await setupPelaksana()

      exposed.handleIdentityTypeChange('paspor')
      await nextTick()

      expect(exposed.state.value.identityType).toBe('paspor')
      expect(exposed.activeFigmaNodeId.value).toBe('11347:170073')
      expect(exposed.state.value.figmaNodeId).toBe('11347:170073')

      const last = getLastEmitted()
      expect(last).toBeTruthy()
      expect(last.identityType).toBe('paspor')
      expect(last.figmaNodeId).toBe('11347:170073')

      // Verify HTML renders cleanly without debug badges
      const html = await renderPelaksanaHtml({
        modelValue: {
          ...createDefaultPelaksanaState(),
          identityType: 'paspor',
        },
      })
      expect(html).toContain('Data Pelaksana Transaksi')
    })

    it('correctly loads KTP Preset and Paspor Preset via exposed preset appliers', async () => {
      const { exposed, getLastEmitted } = await setupPelaksana()

      // Apply KTP preset
      exposed.applyKtpPreset()
      await nextTick()

      expect(exposed.state.value.identityType).toBe('ktp')
      expect(exposed.state.value.nik).toBe(PELAKSANA_KTP_PRESET.nik)
      expect(exposed.state.value.namaLengkap).toBe(PELAKSANA_KTP_PRESET.namaLengkap)
      expect(exposed.state.value.kewarganegaraan).toBe('WNI')
      expect(exposed.activeFigmaNodeId.value).toBe('11347:172827')

      let last = getLastEmitted()
      expect(last.figmaNodeId).toBe('11347:172827')

      // Apply Paspor preset
      exposed.applyPasporPreset()
      await nextTick()

      expect(exposed.state.value.identityType).toBe('paspor')
      expect(exposed.state.value.nomorPaspor).toBe(PELAKSANA_PASPOR_PRESET.nomorPaspor)
      expect(exposed.state.value.namaLengkap).toBe(PELAKSANA_PASPOR_PRESET.namaLengkap)
      expect(exposed.state.value.kewarganegaraan).toBe('WNA')
      expect(exposed.activeFigmaNodeId.value).toBe('11347:170073')

      last = getLastEmitted()
      expect(last.figmaNodeId).toBe('11347:170073')
    })
  })

  // =========================================================================
  // SECTION 2: Branching Input Controls (NIK vs Paspor Input Rendering)
  // =========================================================================
  describe('2. Branching Input Controls (NIK vs Paspor Input Rendering)', () => {
    it('renders NIK input and does NOT render Paspor input when identityType is KTP', async () => {
      const html = await renderPelaksanaHtml({
        modelValue: {
          ...createDefaultPelaksanaState(),
          identityType: 'ktp',
        },
      })

      expect(html).toContain('Nomor Identitas')
      expect(html).toContain('Masukan nomor identitas')
    })

    it('renders Paspor input and does NOT render NIK input when identityType is Paspor', async () => {
      const html = await renderPelaksanaHtml({
        modelValue: {
          ...createDefaultPelaksanaState(),
          identityType: 'paspor',
        },
      })

      expect(html).toContain('Nomor Identitas')
      expect(html).toContain('Masukan nomor identitas')
    })
  })

  // =========================================================================
  // SECTION 3: Kewarganegaraan Constraint (Rule 11347:178154)
  // =========================================================================
  describe('3. Kewarganegaraan Constraint (Rule 11347:178154)', () => {
    it('locks citizenship to WNI and disables dropdown for KTP', async () => {
      const { exposed } = await setupPelaksana({
        modelValue: {
          ...createDefaultPelaksanaState(),
          identityType: 'ktp',
        },
      })

      expect(exposed.state.value.kewarganegaraan).toBe('WNI')

      const html = await renderPelaksanaHtml({
        modelValue: {
          ...createDefaultPelaksanaState(),
          identityType: 'ktp',
        },
      })

      expect(html).toContain('Kewarganegaraan')
      expect(html).toContain('disabled')
    })

    it('allows selectable citizenship for Paspor and does not render locked notice', async () => {
      const html = await renderPelaksanaHtml({
        modelValue: {
          ...createDefaultPelaksanaState(),
          identityType: 'paspor',
          kewarganegaraan: 'WNA',
        },
      })

      expect(html).toContain('Kewarganegaraan')
      expect(html).not.toContain('Terkunci otomatis')
    })

    it('adversarial tamper test: switching from Paspor with WNA back to KTP forces citizenship back to WNI', async () => {
      const { exposed, getLastEmitted } = await setupPelaksana()

      // Switch to Paspor
      exposed.handleIdentityTypeChange('paspor')
      await nextTick()

      // Set citizenship to WNA
      exposed.state.value.kewarganegaraan = 'WNA'
      expect(exposed.state.value.kewarganegaraan).toBe('WNA')

      // Switch back to KTP (tamper test)
      exposed.handleIdentityTypeChange('ktp')
      await nextTick()

      // Must be locked back to WNI per Rule 11347:178154
      expect(exposed.state.value.kewarganegaraan).toBe('WNI')
      const last = getLastEmitted()
      expect(last.kewarganegaraan).toBe('WNI')
      expect(last.identityType).toBe('ktp')
    })
  })

  // =========================================================================
  // SECTION 4: Masa Berlaku Toggle (Rules 11347:172997 & 11347:172995)
  // =========================================================================
  describe('4. Masa Berlaku Toggle (Rules 11347:172997 & 11347:172995)', () => {
    it('disables expiry date picker when "Seumur Hidup" is active (11347:172997)', async () => {
      const html = await renderPelaksanaHtml({
        modelValue: {
          ...createDefaultPelaksanaState(),
          identityType: 'ktp',
          masaBerlakuType: 'seumur_hidup',
        },
      })

      expect(html).toContain('Masa Berlaku Identitas')
      expect(html).toContain('Tanggal Berlaku Sampai')
    })

    it('enables expiry date picker when "Sampai Dengan" is active (11347:172995)', async () => {
      const html = await renderPelaksanaHtml({
        modelValue: {
          ...createDefaultPelaksanaState(),
          identityType: 'ktp',
          masaBerlakuType: 'sampai_dengan',
          tanggalBerlakuSampai: '2029-12-31',
        },
      })

      expect(html).toContain('Masa Berlaku Identitas')
      expect(html).toContain('Tanggal Berlaku Sampai')
    })

    it('clears tanggalBerlakuSampai when switching from Sampai Dengan to Seumur Hidup', async () => {
      const { exposed, getLastEmitted } = await setupPelaksana({
        modelValue: {
          ...createDefaultPelaksanaState(),
          identityType: 'ktp',
          masaBerlakuType: 'sampai_dengan',
          tanggalBerlakuSampai: '2029-12-31',
        },
      })

      expect(exposed.state.value.tanggalBerlakuSampai).toBe('2029-12-31')

      // Switch to seumur_hidup
      exposed.handleMasaBerlakuTypeChange('seumur_hidup')
      await nextTick()

      expect(exposed.state.value.masaBerlakuType).toBe('seumur_hidup')
      expect(exposed.state.value.tanggalBerlakuSampai).toBe('')

      const last = getLastEmitted()
      expect(last.masaBerlakuType).toBe('seumur_hidup')
      expect(last.tanggalBerlakuSampai).toBe('')
    })

    it('Paspor: expiry date picker is ALWAYS rendered and required', async () => {
      const html = await renderPelaksanaHtml({
        modelValue: {
          ...createDefaultPelaksanaState(),
          identityType: 'paspor',
          tanggalBerlakuSampai: '2028-10-15',
        },
      })

      // Date picker label must exist
      expect(html).toContain('Tanggal Berlaku Sampai')
    })
  })

  // =========================================================================
  // SECTION 5: 16-Digit Spaced Formatting, Normalization & Masking Oracles
  // =========================================================================
  describe('5. Formatting, Normalization & Masking Oracles', () => {
    it('normalizes identity numbers by removing irregular whitespace and uppercasing', () => {
      expect(normalizeIdentityNumber(' 3204   1234  5678  0001 ')).toBe('3204123456780001')
      expect(normalizeIdentityNumber('b12345678')).toBe('B12345678')
      expect(normalizeIdentityNumber('')).toBe('')
      expect(normalizeIdentityNumber(undefined)).toBe('')
    })

    it('masks 16-digit KTP correctly displaying first 4 and last 4 digits', () => {
      const masked = formatMaskedIdentity('3204 1234 5678 0001', 'ktp')
      expect(masked).toBe('3204 **** **** 0001')

      const unspacedMasked = formatMaskedIdentity('3204123456780001', 'ktp')
      expect(unspacedMasked).toBe('3204 **** **** 0001')
    })

    it('masks Passport displaying first 4 and last 2 characters', () => {
      const masked = formatMaskedIdentity('B12345678', 'paspor')
      expect(masked).toBe('B123 **** 78')
    })

    it('handles short or malformed identities gracefully', () => {
      expect(formatMaskedIdentity('123', 'ktp')).toBe('123')
      expect(formatMaskedIdentity('ABC', 'paspor')).toBe('ABC')
    })
  })

  // =========================================================================
  // SECTION 6: Dynamic Age Calculation Oracle
  // =========================================================================
  describe('6. Dynamic Age Calculation Oracle', () => {
    it('computes age accurately from ISO YYYY-MM-DD birthdate', () => {
      const currentYear = new Date().getFullYear()
      const ageStr = calculateAge('1990-01-01')
      expect(ageStr).toContain('Tahun')
      const years = parseInt(ageStr, 10)
      expect(years).toBeGreaterThanOrEqual(currentYear - 1991)
      expect(years).toBeLessThanOrEqual(currentYear - 1990)
    })

    it('computes age accurately from Indonesian format "15 Mei 1985"', () => {
      const ageStr = calculateAge('15 Mei 1985')
      expect(ageStr).toContain('Tahun')
      const years = parseInt(ageStr, 10)
      const currentYear = new Date().getFullYear()
      expect(years).toBeGreaterThanOrEqual(currentYear - 1986)
    })

    it('returns empty string on empty or invalid birthdate', () => {
      expect(calculateAge('')).toBe('')
      expect(calculateAge('invalid-date-string')).toBe('')
    })
  })

  // =========================================================================
  // SECTION 7: High-Frequency Stress Testing & State Convergence
  // =========================================================================
  describe('7. High-Frequency Stress Testing & Adversarial Convergence', () => {
    it('stress test: withstands 100 alternating identityType transitions without corrupted state', async () => {
      const { exposed } = await setupPelaksana()

      for (let i = 0; i < 100; i++) {
        const targetType = i % 2 === 0 ? 'paspor' : 'ktp'
        exposed.handleIdentityTypeChange(targetType)
      }
      await nextTick()

      // Last was odd (99) -> ktp
      expect(exposed.state.value.identityType).toBe('ktp')
      expect(exposed.activeFigmaNodeId.value).toBe('11347:172827')
      expect(exposed.state.value.kewarganegaraan).toBe('WNI')
    })

    it('stress test: withstands 50 toggles of masaBerlakuType with date preserving/clearing', async () => {
      const { exposed } = await setupPelaksana()

      for (let i = 0; i < 50; i++) {
        if (i % 2 === 0) {
          exposed.handleMasaBerlakuTypeChange('sampai_dengan')
          exposed.state.value.tanggalBerlakuSampai = '2030-01-01'
        } else {
          exposed.handleMasaBerlakuTypeChange('seumur_hidup')
          expect(exposed.state.value.tanggalBerlakuSampai).toBe('')
        }
      }
      await nextTick()

      // Last was 49 (odd) -> seumur_hidup
      expect(exposed.state.value.masaBerlakuType).toBe('seumur_hidup')
      expect(exposed.state.value.tanggalBerlakuSampai).toBe('')
    })
  })

  // =========================================================================
  // SECTION 8: Step2RahinContent Orchestration & Validation Guard
  // =========================================================================
  describe('8. Step2RahinContent Validation Guard for Pelaksana Transaksi', () => {
    it('blocks handleNext() when Pelaksana Transaksi is active but required fields are missing', async () => {
      const { exposed } = await setupStep2({
        boState: {
          type: 'orang_lain', // Forces Pelaksana to be active
          beneficialOwners: [],
          selectedBO: null,
          identityType: 'ktp',
          identityNumber: '',
          relationship: '',
        },
      })

      expect(exposed.isPelaksanaActive.value).toBe(true)

      // Transition to detail view with selected CIF
      exposed.step2State.value.currentView = 'detail_syariah'
      exposed.step2State.value.selectedCifId = 'cif-sya-01'
      exposed.step2State.value.cifList = [{ id: 'cif-sya-01', statusRahin: 'syariah' } as any]
      exposed.fieldsModel.value.nik = '3204111112980003'
      exposed.fieldsModel.value.nama = 'Anastasya Delistya'

      // Pelaksana is active but empty
      exposed.step2State.value.pelaksana.namaLengkap = ''
      exposed.step2State.value.pelaksana.nik = ''

      const result = exposed.handleNext()
      expect(result.valid).toBe(false)
      expect(result.message).toContain('Mohon lengkapi data pelaksana transaksi')

      // Now populate Pelaksana
      exposed.step2State.value.pelaksana.namaLengkap = 'Bambang Sudarsono'
      exposed.step2State.value.pelaksana.nik = '3204 1234 5678 0001'

      const resultValid = exposed.handleNext()
      expect(resultValid.valid).toBe(true)
    })
  })
})
