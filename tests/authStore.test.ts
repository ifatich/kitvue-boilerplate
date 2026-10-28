import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../src/stores/authStore'
import { isAdminAuthenticated, getSessionUser, logoutAdmin, authenticateAdmin } from '../src/services/authService'

// Mock localStorage untuk Vitest
const storage = new Map<string, string>()
const localStorageMock = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, String(value)),
  removeItem: (key: string) => storage.delete(key),
  clear: () => storage.clear(),
}

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

describe('Frontend Auth Store & Service', () => {
  beforeEach(() => {
    storage.clear()
    setActivePinia(createPinia())
  })

  it('memiliki status awal false saat localStorage kosong', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
    expect(isAdminAuthenticated()).toBe(false)
  })

  it('dapat melakukan login frontend dan menyimpan state ke localStorage', () => {
    const store = useAuthStore()
    const result = store.login({ emailOrNip: 'developer@pegadaian.co.id' })

    expect(result.success).toBe(true)
    expect(store.isAuthenticated).toBe(true)
    expect(store.user?.email).toBe('developer@pegadaian.co.id')
    expect(localStorage.getItem('kitvue_auth_state')).toBe('true')
    expect(isAdminAuthenticated()).toBe(true)
  })

  it('dapat melakukan toggle auth secara bolak-balik (Dummy Switch)', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)

    // Toggle 1 -> Aktif
    store.toggleAuth()
    expect(store.isAuthenticated).toBe(true)
    expect(store.user).not.toBeNull()

    // Toggle 2 -> Nonaktif
    store.toggleAuth()
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
  })

  it('logoutAdmin membersihkan state dan localStorage', () => {
    const store = useAuthStore()
    store.login()
    expect(store.isAuthenticated).toBe(true)

    store.logout()
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
    expect(localStorage.getItem('kitvue_auth_state')).toBe('false')

    logoutAdmin()
    expect(isAdminAuthenticated()).toBe(false)
    expect(getSessionUser()).toBeNull()
  })

  it('authenticateAdmin helper mensimulasikan login dengan identifier valid', () => {
    const res = authenticateAdmin('user.test@pegadaian.co.id')
    expect(res.success).toBe(true)
    expect(res.user?.email).toBe('user.test@pegadaian.co.id')
    expect(isAdminAuthenticated()).toBe(true)
  })

  it('authenticateAdmin gagal jika identifier kosong', () => {
    const res = authenticateAdmin('')
    expect(res.success).toBe(false)
    expect(res.error).toBeDefined()
  })
})
