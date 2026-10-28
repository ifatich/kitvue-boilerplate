/**
 * @file types.ts
 * @description Type definitions untuk layout CMS Admin Arrum Zada.
 * Mengikuti arsitektur standar bullion-bank-cms.
 */

export type AdminNavIcon =
  | 'home'
  | 'user'
  | 'document'
  | 'admin'
  | 'profile'
  | 'approval'
  | 'gold'

export interface AdminNavItem {
  label: string
  icon: AdminNavIcon
  active?: boolean
  href?: string
  route?: string
  tabKey?: string
  badge?: string | number
}
