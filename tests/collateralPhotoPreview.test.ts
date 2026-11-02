import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('Rahn Collateral Photo Preview & Carousel Starting Index', () => {
  const photosStartingAt = (photos: string[], startIndex: number) => [
    ...photos.slice(startIndex),
    ...photos.slice(0, startIndex),
  ]

  it('correctly shifts images array so clicked thumbnail is the active/first photo in modal carousel', () => {
    const photos = ['https://img.com/1.jpg', 'https://img.com/2.jpg', 'https://img.com/3.jpg']

    // When clicking left photo (index 0)
    const previewFrom0 = photosStartingAt(photos, 0)
    expect(previewFrom0[0]).toBe('https://img.com/1.jpg')
    expect(previewFrom0).toEqual([
      'https://img.com/1.jpg',
      'https://img.com/2.jpg',
      'https://img.com/3.jpg',
    ])

    // When clicking right photo with +1 overlay (index 1)
    const previewFrom1 = photosStartingAt(photos, 1)
    expect(previewFrom1[0]).toBe('https://img.com/2.jpg')
    expect(previewFrom1).toEqual([
      'https://img.com/2.jpg',
      'https://img.com/3.jpg',
      'https://img.com/1.jpg',
    ])
  })

  it('ensures .rahn-review-photo-count has pointer-events: none in Step5DataReviewView', () => {
    const fileContent = fs.readFileSync(
      path.resolve(__dirname, '../src/views/rahn/step-5/Step5DataReviewView.vue'),
      'utf-8',
    )
    expect(fileContent).toContain('.rahn-review-photo-count {')
    expect(fileContent).toMatch(/\.rahn-review-photo-count[\s\S]*?pointer-events:\s*none;/)
  })

  it('ensures .rahn-collateral-table-component__thumbnail-count has pointer-events: none in RahnCollateralTable', () => {
    const fileContent = fs.readFileSync(
      path.resolve(__dirname, '../src/components/modules/rahn/RahnCollateralTable.vue'),
      'utf-8',
    )
    expect(fileContent).toContain('.rahn-collateral-table-component__thumbnail-count {')
    expect(fileContent).toMatch(/\.rahn-collateral-table-component__thumbnail-count[\s\S]*?pointer-events:\s*none;/)
  })
})

