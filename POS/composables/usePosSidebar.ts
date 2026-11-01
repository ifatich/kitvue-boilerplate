import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export function usePosSidebar() {
  const isMobile = ref(false)
  const isCollapsed = ref(false)
  const isOpen = ref(false)
  let isCompactViewport = false

  function syncViewport() {
    const mobile = window.matchMedia('(max-width: 640px)').matches
    const compact = window.matchMedia('(max-width: 1199px)').matches

    if (mobile !== isMobile.value || compact !== isCompactViewport) {
      isMobile.value = mobile
      isCompactViewport = compact
      isCollapsed.value = compact && !mobile
      isOpen.value = false
    }
  }

  function toggle() {
    if (isMobile.value) {
      isOpen.value = !isOpen.value
      return
    }

    isCollapsed.value = !isCollapsed.value
  }

  function close() {
    isOpen.value = false
  }

  onMounted(() => {
    syncViewport()
    window.addEventListener('resize', syncViewport)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', syncViewport)
  })

  return {
    isMobile,
    isCollapsed,
    isOpen,
    menuExpanded: computed(() => isMobile.value ? isOpen.value : !isCollapsed.value),
    toggle,
    close,
  }
}
