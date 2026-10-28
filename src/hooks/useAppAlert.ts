import { reactive } from 'vue'

type AppAlertVariant = 'success' | 'info' | 'warning' | 'danger'
type AppAlertColor = 'green' | 'light-blue' | 'yellow' | 'red'

type ShowAlertOptions = {
  label: string
  variant?: AppAlertVariant
  timeout?: number
}

const variantColorMap: Record<AppAlertVariant, AppAlertColor> = {
  success: 'green',
  info: 'light-blue',
  warning: 'yellow',
  danger: 'red',
}

const appAlert = reactive({
  visible: false,
  label: '',
  color: 'green' as AppAlertColor,
  variant: 'success' as AppAlertVariant,
})

let dismissTimer: ReturnType<typeof window.setTimeout> | undefined

export const useAppAlert = () => {
  const hideAlert = () => {
    appAlert.visible = false
    if (dismissTimer) {
      window.clearTimeout(dismissTimer)
      dismissTimer = undefined
    }
  }

  const showAlert = ({ label, variant = 'success', timeout = 2400 }: ShowAlertOptions) => {
    if (dismissTimer) {
      window.clearTimeout(dismissTimer)
    }

    appAlert.label = label
    appAlert.variant = variant
    appAlert.color = variantColorMap[variant]
    appAlert.visible = true

    dismissTimer = window.setTimeout(() => {
      appAlert.visible = false
      dismissTimer = undefined
    }, timeout)
  }

  return {
    appAlert,
    hideAlert,
    showAlert,
  }
}
