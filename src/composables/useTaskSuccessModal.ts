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
const hasCompletedTask = ref(false)
const isDismissedForExploration = ref(false)
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
    hasCompletedTask.value = true
    isDismissedForExploration.value = false
    isTaskModalOpen.value = true
  }

  const dismissToExplore = () => {
    isTaskModalOpen.value = false
    isDismissedForExploration.value = true
  }

  const reopenSuccessModal = () => {
    isDismissedForExploration.value = false
    isTaskModalOpen.value = true
  }

  const resetTaskCompletionState = () => {
    isTaskModalOpen.value = false
    isDismissedForExploration.value = false
    hasCompletedTask.value = false
  }

  const closeTaskSuccessModal = () => {
    isTaskModalOpen.value = false
    isDismissedForExploration.value = false
  }

  const handleConfirm = () => {
    isTaskModalOpen.value = false
    isDismissedForExploration.value = false
    hasCompletedTask.value = false
    if (onConfirmFn.value) {
      onConfirmFn.value()
      return
    }

    if (router) {
      const currentQuery = router.currentRoute.value.query
      const sessionTeam = typeof window !== 'undefined' ? window.sessionStorage?.getItem('sprint_research_team') : null
      const sessionCp = typeof window !== 'undefined' ? window.sessionStorage?.getItem('sprint_research_cp') : null
      const sessionRole = typeof window !== 'undefined' ? window.sessionStorage?.getItem('sprint_research_role') : null
      const sessionNextView = typeof window !== 'undefined' ? window.sessionStorage?.getItem('sprint_research_next_view') : null
      const sessionFromCompare = typeof window !== 'undefined' ? window.sessionStorage?.getItem('sprint_research_from_compare') : null

      const team = (currentQuery.team as string | undefined) || sessionTeam || undefined
      const cp = (currentQuery.cp as string | undefined) || sessionCp || undefined
      const role = (currentQuery.role as string | undefined) || sessionRole || undefined
      const nextView = (currentQuery.nextView as string | undefined) || sessionNextView || undefined

      if (nextView === 'proto-1') {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.removeItem('sprint_research_next_view')
          window.sessionStorage.setItem('sprint_research_from_compare', sessionFromCompare || 'proto-existing')
        }
        void router.push({
          path: '/sprint-proto-1',
          query: {
            ...(team ? { team } : {}),
            ...(cp ? { cp } : {}),
            ...(role ? { role } : {}),
            fromCompare: sessionFromCompare || 'proto-existing',
          },
        })
        return
      }

      if (nextView === 'proto-2') {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.removeItem('sprint_research_next_view')
          window.sessionStorage.setItem('sprint_research_from_compare', sessionFromCompare || 'proto-existing')
        }
        void router.push({
          path: '/sprint-proto-2',
          query: {
            ...(team ? { team } : {}),
            ...(cp ? { cp } : {}),
            ...(role ? { role } : {}),
            fromCompare: sessionFromCompare || 'proto-existing',
          },
        })
        return
      }

      if (team && cp) {
        void router.push({
          name: 'entry-point-tasks',
          query: {
            team,
            cp,
            ...(role ? { role } : {}),
          },
        })
        return
      }

      void router.push({ name: 'entry-point-tasks' })
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
  }
}
