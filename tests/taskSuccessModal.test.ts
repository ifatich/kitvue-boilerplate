import { describe, it, expect, beforeEach } from 'vitest'
import { useTaskSuccessModal } from '@/composables/useTaskSuccessModal'

const storage = new Map<string, string>()
const storageMock = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, String(value)),
  removeItem: (key: string) => storage.delete(key),
  clear: () => storage.clear(),
}

if (typeof window === 'undefined') {
  Object.defineProperty(globalThis, 'window', {
    value: {
      sessionStorage: storageMock,
    },
    writable: true,
  })
}
Object.defineProperty(globalThis, 'sessionStorage', { value: storageMock, writable: true })

describe('useTaskSuccessModal Composable', () => {
  const {
    isTaskModalOpen,
    hasCompletedTask,
    isDismissedForExploration,
    modalTitle,
    modalMessage,
    modalTaskName,
    modalConfirmLabel,
    modalSecondaryLabel,
    showTaskSuccessModal,
    dismissToExplore,
    reopenSuccessModal,
    resetTaskCompletionState,
    closeTaskSuccessModal,
    handleConfirm,
    handleSecondary,
  } = useTaskSuccessModal()

  beforeEach(() => {
    resetTaskCompletionState()
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

  it('handles dismissToExplore and reopenSuccessModal flow', () => {
    showTaskSuccessModal({
      taskName: 'PoS (Pembayaran Gadai)',
    })
    expect(isTaskModalOpen.value).toBe(true)
    expect(hasCompletedTask.value).toBe(true)
    expect(isDismissedForExploration.value).toBe(false)

    // User clicks (X) to explore
    dismissToExplore()
    expect(isTaskModalOpen.value).toBe(false)
    expect(isDismissedForExploration.value).toBe(true)
    expect(hasCompletedTask.value).toBe(true)

    // User clicks floating badge or footer to reopen
    reopenSuccessModal()
    expect(isTaskModalOpen.value).toBe(true)
    expect(isDismissedForExploration.value).toBe(false)
    expect(hasCompletedTask.value).toBe(true)
    expect(modalTaskName.value).toBe('PoS (Pembayaran Gadai)')

    // User confirms
    handleConfirm()
    expect(isTaskModalOpen.value).toBe(false)
    expect(isDismissedForExploration.value).toBe(false)
    expect(hasCompletedTask.value).toBe(false)
  })

  it('navigates to entry-point-tasks using session storage context when query params are absent', () => {
    sessionStorage.setItem('sprint_research_team', 'team-2')
    sessionStorage.setItem('sprint_research_cp', 'dps-cbg-renon')
    sessionStorage.setItem('sprint_research_role', 'CRO')

    showTaskSuccessModal({
      title: 'Task Selesai',
      taskName: 'Beranda Opsi 1 (Pencarian Pengajuan Gadai)',
      confirmLabel: 'Kembali ke Menu Task',
    })
    expect(isTaskModalOpen.value).toBe(true)

    handleConfirm()
    expect(isTaskModalOpen.value).toBe(false)
  })
})

