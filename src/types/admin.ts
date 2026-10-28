/**
 * @file admin.ts
 * @description Tipe data untuk manajemen pengguna dan kredensial Administrator
 * di CMS Dashboard Arrum Zada, disesuaikan dengan skema field dinas:
 * nama, email, nomor hp, nip, jabatan, hak akses, password, konfirmasi password.
 */

export type AdminRole = 'Super Admin' | 'Administrator'
export type AdminAccountStatus = 'Active' | 'Inactive'

/**
 * Data profil & kredensial administrator (tanpa mengekspos password).
 */
export interface AdminUserAccount {
  id: string
  namaLengkap: string
  fullName?: string
  email: string
  phoneNumber?: string
  nip: string
  position?: string
  role: AdminRole
  status?: AdminAccountStatus
  isActive?: boolean
  twoStepVerified?: boolean
  registrationDate?: string
  lastActive?: string
  avatarInitials?: string
  nik?: string
  division?: string
  rank?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Profil pengguna pegawai dari API OpenAPI backend (/api/v1/auth/me)
 */
export interface UserProfile {
  id: number
  fullName: string
  email: string
  phoneNumber: string
  nip: string
  position: string
  role: AdminRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Form penambahan administrator baru.
 * Sesuai spesifikasi: nama, email, nomor hp, nip, jabatan, hak akses, password, konfirmasi password.
 */
export interface AddAdminForm {
  fullName: string
  email: string
  phoneNumber: string
  nip: string
  position: string
  role: AdminRole
  password: string
  confirmPassword: string
}
