/**
 * @file useTaskSuccessModal.ts
 * @description Composable for triggering and controlling the Task Success Modal globally
 * directly on the current page without routing to an external dummy page.
 */
import { getCurrentInstance, ref } from 'vue'
import { useRouter } from 'vue-router'

export interface TaskSuccessModalOptions {
  title?: string
  message?: string
  taskName?: string
  confirmLabel?: string
  secondaryLabel?: string
  onConfirm?: () => void
  onSecondary?: () => void
}

const isTaskModalOpen = ref(false)
const modalTitle = ref('Task Selesai')
const modalMessage = ref('Selamat Anda sudah menyelesaikan task!')
const modalTaskName = ref('')
const modalConfirmLabel = ref('Kembali ke Halaman Awal')
const modalSecondaryLabel = ref('')
const onConfirmFn = ref<(() => void) | null>(null)
const onSecondaryFn = ref<(() => void) | null>(null)

export function useTaskSuccessModal() {
  let router: ReturnType<typeof useRouter> | null = null
  if (getCurrentInstance()) {
    try {
      router = useRouter()
    } catch {
      router = null
    }
  }

  const showTaskSuccessModal = (options?: TaskSuccessModalOptions) => {
    modalTitle.value = options?.title ?? 'Task Selesai'
    modalMessage.value = options?.message ?? 'Selamat Anda sudah menyelesaikan task!'
    modalTaskName.value = options?.taskName ?? ''
    modalConfirmLabel.value = options?.confirmLabel ?? 'Kembali ke Halaman Awal'
    modalSecondaryLabel.value = options?.secondaryLabel ?? ''
    onConfirmFn.value = options?.onConfirm ?? null
    onSecondaryFn.value = options?.onSecondary ?? null
    isTaskModalOpen.value = true
  }

  const closeTaskSuccessModal = () => {
    isTaskModalOpen.value = false
  }

  const handleConfirm = () => {
    isTaskModalOpen.value = false
    if (onConfirmFn.value) {
      onConfirmFn.value()
      return
    }

    if (router) {
      const currentQuery = router.currentRoute.value.query
      if (currentQuery.team && currentQuery.cp) {
        void router.push({
          name: 'entry-point-tasks',
          query: { team: currentQuery.team, cp: currentQuery.cp },
        })
        return
      }
      void router.push('/beranda')
    }
  }

  const handleSecondary = () => {
    isTaskModalOpen.value = false
    if (onSecondaryFn.value) {
      onSecondaryFn.value()
    }
  }

  return {
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
  }
}
