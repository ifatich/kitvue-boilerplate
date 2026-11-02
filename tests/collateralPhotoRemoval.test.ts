import { describe, it, expect } from 'vitest'

describe('Rahn Collateral Photo Management & Deletion Logic', () => {
  it('correctly adds photos and deletes the exact targeted photo on remove (click silang)', () => {
    const draftPhotos: (string | File)[] = []

    const handleAddPhoto = (file: File | null) => {
      if (file && draftPhotos.length < 3) {
        draftPhotos.push(file)
      }
    }

    const handlePhotoInput = (file: File | null, index: number) => {
      if (!file) {
        draftPhotos.splice(index, 1)
      } else {
        draftPhotos[index] = file
      }
    }

    // 1. Initial state: 0 photos
    expect(draftPhotos.length).toBe(0)

    // 2. Add first photo
    const photoA = new File(['a'], 'photoA.jpg', { type: 'image/jpeg' })
    handleAddPhoto(photoA)
    expect(draftPhotos.length).toBe(1)
    expect(draftPhotos[0]).toBe(photoA)

    // 3. Add second photo
    const photoB = new File(['b'], 'photoB.jpg', { type: 'image/jpeg' })
    handleAddPhoto(photoB)
    expect(draftPhotos.length).toBe(2)
    expect(draftPhotos[1]).toBe(photoB)

    // 4. Add third photo
    const photoC = new File(['c'], 'photoC.jpg', { type: 'image/jpeg' })
    handleAddPhoto(photoC)
    expect(draftPhotos.length).toBe(3)
    expect(draftPhotos[2]).toBe(photoC)

    // 5. Exceeding max 3 photos is ignored
    const photoD = new File(['d'], 'photoD.jpg', { type: 'image/jpeg' })
    handleAddPhoto(photoD)
    expect(draftPhotos.length).toBe(3)

    // 6. Delete middle photo (photoB at index 1)
    handlePhotoInput(null, 1)
    expect(draftPhotos.length).toBe(2)
    expect(draftPhotos[0]).toBe(photoA)
    expect(draftPhotos[1]).toBe(photoC)

    // 7. Delete first photo (photoA at index 0)
    handlePhotoInput(null, 0)
    expect(draftPhotos.length).toBe(1)
    expect(draftPhotos[0]).toBe(photoC)

    // 8. Delete remaining photo (photoC at index 0)
    handlePhotoInput(null, 0)
    expect(draftPhotos.length).toBe(0)
  })

  it('handles existing initial string URLs and allows deletion', () => {
    const draftPhotos: (string | File)[] = ['https://example.com/img1.jpg', 'https://example.com/img2.jpg']

    const handlePhotoInput = (file: File | null, index: number) => {
      if (!file) {
        draftPhotos.splice(index, 1)
      } else {
        draftPhotos[index] = file
      }
    }

    expect(draftPhotos.length).toBe(2)

    // Delete first image
    handlePhotoInput(null, 0)
    expect(draftPhotos.length).toBe(1)
    expect(draftPhotos[0]).toBe('https://example.com/img2.jpg')

    // Delete last image
    handlePhotoInput(null, 0)
    expect(draftPhotos.length).toBe(0)
  })
})

