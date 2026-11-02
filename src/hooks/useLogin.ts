/**
 * @file useLogin.ts
 * @description Composable hook for handling client-side authentication and form logic.
 */
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppAlert } from '@/hooks/useAppAlert'
import { getPrototypeRoleForEmail } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'

export function useLogin() {
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()

  const requiresRoleSelection = route.query.roleSelection === 'true'
  const username = ref(requiresRoleSelection ? 'kasir@pegadaian.co.id' : 'admin@pegadaian.co.id')
  const password = ref('Pegadaian2026!')
  const loading = ref(false)
  const { showAlert } = useAppAlert()

  const navigateToTarget = () => {
    const target = route.query.redirect
    if (
      typeof target === 'string' &&
      target.startsWith('/') &&
      !target.startsWith('//') &&
      !target.startsWith('/\\')
    ) {
      router.push(target)
    } else {
      router.push('/beranda')
    }
  }

  const login = async () => {
    if (!username.value || !password.value) {
      showAlert({
        label: 'Username dan kata sandi wajib diisi.',
        variant: 'warning',
      })
      return
    }

    if (requiresRoleSelection && !getPrototypeRoleForEmail(username.value)) {
      showAlert({
        label: 'Gunakan email demo kasir@, pinca@, atau penaksir@pegadaian.co.id untuk memilih role.',
        variant: 'warning',
      })
      return
    }

    try {
      loading.value = true
      authStore.login({ emailOrNip: username.value.trim() })

      showAlert({
        label: 'Login frontend berhasil disimulasikan.',
        variant: 'success',
      })

      navigateToTarget()
    } catch (err) {
      showAlert({
        label: err instanceof Error ? err.message : 'Login gagal.',
        variant: 'danger',
      })
    } finally {
      loading.value = false
    }
  }

  const quickLogin = () => {
    if (requiresRoleSelection) {
      authStore.login({ emailOrNip: username.value.trim() })
      navigateToTarget()
      return
    }

    authStore.login({ emailOrNip: 'admin@pegadaian.co.id' })
    showAlert({
      label: 'Login cepat (1-Click) berhasil.',
      variant: 'success',
    })
    navigateToTarget()
  }

  return {
    username,
    password,
    loading,
    login,
    quickLogin,
  }
}
