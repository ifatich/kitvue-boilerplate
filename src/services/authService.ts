/**
 * @file authService.ts
 * @description Layanan autentikasi layer frontend untuk kitvue-starter-template.
 * Mengelola sinkronisasi status login lokal dan menyediakan adapter helper bagi router dan komponen.
 */
import type { AdminUserAccount } from '@/types/admin'

const STORAGE_KEY = 'kitvue_auth_state'
const USER_KEY = 'kitvue_auth_user'

const DEFAULT_MOCK_USER: AdminUserAccount = {
  id: 'adm-001',
  email: 'admin@pegadaian.co.id',
  nip: 'P89201',
  namaLengkap: 'Al Kautsar Sanusi',
  role: 'Super Admin',
  position: 'Lead Frontend Architect',
  phoneNumber: '+6281234567890',
  status: 'Active',
  twoStepVerified: false,
}

const getStorage = (key: string): string | null => {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key)
    }
  } catch {
    return null
  }
  return null
}

const setStorage = (key: string, val: string) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, val)
    }
  } catch {
    // ignore
  }
}

const removeStorage = (key: string) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key)
    }
  } catch {
    // ignore
  }
}

/**
 * Cek apakah user saat ini sedang terotentikasi (Frontend layer)
 */
export function isAdminAuthenticated(): boolean {
  const saved = getStorage(STORAGE_KEY)
  return saved === 'true'
}

/**
 * Ambil data sesi user saat ini
 */
export function getSessionUser(): AdminUserAccount | null {
  if (!isAdminAuthenticated()) return null
  try {
    const raw = getStorage(USER_KEY)
    return raw ? JSON.parse(raw) : DEFAULT_MOCK_USER
  } catch {
    return DEFAULT_MOCK_USER
  }
}

/**
 * Simpan user ke sesi frontend
 */
export function setSessionUser(user: AdminUserAccount): void {
  setStorage(STORAGE_KEY, 'true')
  setStorage(USER_KEY, JSON.stringify(user))
}

/**
 * Bersihkan sesi frontend (Logout)
 */
export function logoutAdmin(): void {
  setStorage(STORAGE_KEY, 'false')
  removeStorage(USER_KEY)
}

/**
 * Simulasi autentikasi kredensial di sisi frontend
 */
export function authenticateAdmin(
  identifier: string,
  _password?: string,
): { success: boolean; error?: string; user?: AdminUserAccount } {
  if (!identifier || identifier.trim() === '') {
    return { success: false, error: 'Email atau Username wajib diisi' }
  }

  const user: AdminUserAccount = {
    ...DEFAULT_MOCK_USER,
    email: identifier.includes('@') ? identifier : `${identifier}@pegadaian.co.id`,
    namaLengkap: identifier.includes('@') ? identifier.split('@')[0] : identifier,
  }

  setSessionUser(user)
  return { success: true, user }
}
