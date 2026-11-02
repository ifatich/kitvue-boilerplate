import { describe, it, expect, beforeEach } from 'vitest'
import { useTaskSuccessModal } from '@/composables/useTaskSuccessModal'

describe('useTaskSuccessModal Composable', () => {
  const {
    isTaskModalOpen,
    modalTitle,
    modalMessage,
    modalTaskName,
    modalConfirmLabel,
    modalSecondaryLabel,
    showTaskSuccessModal,
    closeTaskSuccessModal,
    handleConfirm,
    handleSecondary,
  } = useTaskSuccessModal()

  beforeEach(() => {
    closeTaskSuccessModal()
  })

  it('initializes with modal closed', () => {
    expect(isTaskModalOpen.value).toBe(false)
  })

  it('opens modal with default props directly on the page', () => {
    showTaskSuccessModal()
    expect(isTaskModalOpen.value).toBe(true)
    expect(modalTitle.value).toBe('Task Selesai')
    expect(modalMessage.value).toBe('Selamat Anda sudah menyelesaikan task!')
    expect(modalConfirmLabel.value).toBe('Kembali ke Halaman Awal')
  })

  it('opens modal with custom task info and parameters', () => {
    showTaskSuccessModal({
      title: 'Tugas Selesai!',
      message: 'Anda telah berhasil menyelesaikan pengujian.',
      taskName: 'Pengajuan Gadai (Non Stepper)',
      confirmLabel: 'Lanjut ke Menu',
      secondaryLabel: 'Batal',
    })

    expect(isTaskModalOpen.value).toBe(true)
    expect(modalTitle.value).toBe('Tugas Selesai!')
    expect(modalMessage.value).toBe('Anda telah berhasil menyelesaikan pengujian.')
    expect(modalTaskName.value).toBe('Pengajuan Gadai (Non Stepper)')
    expect(modalConfirmLabel.value).toBe('Lanjut ke Menu')
    expect(modalSecondaryLabel.value).toBe('Batal')
  })

  it('triggers onConfirm callback and closes modal on confirm', () => {
    let confirmed = false
    showTaskSuccessModal({
      onConfirm: () => {
        confirmed = true
      },
    })

    expect(isTaskModalOpen.value).toBe(true)
    handleConfirm()
    expect(confirmed).toBe(true)
    expect(isTaskModalOpen.value).toBe(false)
  })

  it('triggers onSecondary callback and closes modal on secondary', () => {
    let cancelled = false
    showTaskSuccessModal({
      onSecondary: () => {
        cancelled = true
      },
    })

    expect(isTaskModalOpen.value).toBe(true)
    handleSecondary()
    expect(cancelled).toBe(true)
    expect(isTaskModalOpen.value).toBe(false)
  })
})

