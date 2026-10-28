/**
 * @file authStore.ts
 * @description Pure client-side dummy authentication state management using Pinia.
 * Provides instant auth toggling and dummy user session simulation without backend dependency.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface AuthUser {
  id: string
  name: string
  nip: string
  email: string
  role: 'Super Admin' | 'Administrator' | 'Guest'
  position: string
  avatar?: string
}

const STORAGE_KEY = 'kitvue_auth_state'

const DEFAULT_DUMMY_USER: AuthUser = {
  id: 'adm-001',
  name: 'Al Kautsar Sanusi',
  nip: 'P89201',
  email: 'alkautsar.sanusi@pegadaian.co.id',
  role: 'Super Admin',
  position: 'Lead Frontend Architect',
}

const getStorageItem = (key: string): string | null => {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key)
    }
  } catch {
    return null
  }
  return null
}

const setStorageItem = (key: string, value: string) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value)
    }
  } catch {
    // ignore storage quota errors
  }
}

const removeStorageItem = (key: string) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key)
    }
  } catch {
    // ignore
  }
}

export const useAuthStore = defineStore('auth', () => {
  const savedState = getStorageItem(STORAGE_KEY)
  const initialIsAuth = savedState === 'true'

  const isAuthenticated = ref<boolean>(initialIsAuth)
  const user = ref<AuthUser | null>(initialIsAuth ? { ...DEFAULT_DUMMY_USER } : null)

  const persistState = () => {
    setStorageItem(STORAGE_KEY, String(isAuthenticated.value))
  }

  const toggleAuth = () => {
    if (isAuthenticated.value) {
      logout()
    } else {
      login({ emailOrNip: DEFAULT_DUMMY_USER.email })
    }
  }

  const login = (payload?: { emailOrNip?: string; password?: string }): { success: boolean } => {
    isAuthenticated.value = true
    user.value = {
      ...DEFAULT_DUMMY_USER,
      email: payload?.emailOrNip || DEFAULT_DUMMY_USER.email,
    }
    persistState()
    return { success: true }
  }

  const logout = () => {
    isAuthenticated.value = false
    user.value = null
    persistState()
    removeStorageItem('kitvue_auth_user')
  }

  return {
    isAuthenticated,
    user,
    toggleAuth,
    login,
    logout,
  }
})
