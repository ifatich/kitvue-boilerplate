import { describe, expect, it } from 'vitest'
import { croFeatureColumns, featureColumnsByRole } from '@/views/proto-existing/feature-data'

describe('CRO Role Menu Configurations', () => {
  it('defines croFeatureColumns with exact 3-column layout conforming to Figma 807:34553', () => {
    const columns = featureColumnsByRole['CRO']
    expect(columns).toBeDefined()
    expect(columns).toHaveLength(3)

    // Column 1: Canvassing & Utilitas
    const col1 = columns[0]
    expect(col1).toHaveLength(2)
    expect(col1[0].title).toBe('Canvassing')
    expect(col1[0].items.map((i) => i.label)).toEqual([
      'Prospek Canvassing',
      'Follow Up Canvassing',
      'Prospek KCA Take Over',
      'Follow Up KCA Take Over',
    ])
    expect(col1[1].title).toBe('Utilitas')
    expect(col1[1].items.map((i) => i.label)).toEqual(['Gendis AI'])

    // Column 2: Leads & EGC / OGC
    const col2 = columns[1]
    expect(col2).toHaveLength(2)
    expect(col2[0].title).toBe('Leads')
    expect(col2[0].items.map((i) => i.label)).toEqual([
      'Daftar Leads CRM',
      'Riwayat Follow Up CRM',
      'Daftar Leads Senyum Mobile',
      'Riwayat Follow Up Senyum Mobile',
    ])
    expect(col2[1].title).toBe('EGC / OGC')
    expect(col2[1].items.map((i) => i.label)).toEqual([
      'Input Data EGC/OGC',
      'EGC Leads Reaktivasi',
      'Daftar Leads EGC - CRM',
      'Follow Up EGC - CRM',
    ])

    // Column 3: Laporan & Monitoring (Menu Favorit is prepended at index 2 in template)
    const col3 = columns[2]
    expect(col3).toHaveLength(2)
    expect(col3[0].title).toBe('Laporan')
    expect(col3[0].items.map((i) => i.label)).toEqual([
      'Status Prospek',
      'Closing Tim Sales',
      'Closing Aktivitas',
      'Closing Unit Kerja',
    ])
    expect(col3[1].title).toBe('Monitoring')
    expect(col3[1].items.map((i) => i.label)).toEqual([
      'Monitoring Pengajuan Leads CRM',
    ])
  })

  it('ensures each CRO menu item has a valid, distinct icon', () => {
    const allItems = croFeatureColumns.flatMap((col) => col.flatMap((g) => g.items))
    expect(allItems).toHaveLength(18) // 4 + 1 + 4 + 4 + 4 + 1 = 18

    for (const item of allItems) {
      expect(item.icon).toBeTruthy()
      expect(typeof item.icon).toBe('string')
      expect(item.icon.length).toBeGreaterThan(0)
    }
  })

  it('contains "Daftar Leads CRM" under Leads group for CRO', () => {
    const columns = featureColumnsByRole['CRO']
    const leadsGroup = columns.flatMap((col) => col).find((g) => g.title === 'Leads')
    expect(leadsGroup).toBeDefined()
    expect(leadsGroup?.items.some((i) => i.label === 'Daftar Leads CRM')).toBe(true)
  })
})
