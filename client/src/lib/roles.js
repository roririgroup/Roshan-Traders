// Role utilities for route guarding and UI conditions
// Canonical roles: 'superadmin' | 'agent' | 'manufacturer' | 'contractor' | 'chamber' | 'company'
import { getCurrentUser } from './auth'

export function getCurrentUserRole() {
  const user = getCurrentUser()
  if (!user || !user.role) return null
  const normalized = String(user.role).toLowerCase()
  // normalize legacy 'superAdmin' etc.
  if (normalized === 'superadmin' || normalized === 'super-admin') return 'superadmin'
  if (normalized === 'manufacturer' || normalized === 'manufactures') return 'manufacturer'
  return normalized
}

export function hasRole(expectedRoles) {
  const role = getCurrentUserRole()
  if (!role) return false
  if (Array.isArray(expectedRoles)) return expectedRoles.map(r => String(r).toLowerCase()).includes(role)
  return role === String(expectedRoles).toLowerCase()
}


