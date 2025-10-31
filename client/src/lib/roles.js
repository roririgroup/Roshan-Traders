// Role utilities for route guarding and UI conditions
// Canonical roles: 'superadmin' | 'agent' | 'manufacturer' | 'contractor' | 'chamber' | 'company'
import { getCurrentUser } from './auth'

export function getCurrentUserRole() {
  const user = getCurrentUser()
  if (!user) return null

  // For backward compatibility, check if user has single role
  if (user.role) {
    const normalized = String(user.role).toLowerCase()
    // normalize legacy roles
    if (normalized === 'superadmin' || normalized === 'super-admin') return 'superadmin'
    if (normalized === 'manufacturer' || normalized === 'manufactures') return 'manufacturer'
    if (normalized === 'truck owner' || normalized === 'truckowner') return 'truck_owner'
    return normalized
  }

  // For multi-role users, return active role
  return getCurrentUserActiveRole()
}

export function getCurrentUserRoles() {
  const user = getCurrentUser()
  if (!user) return []

  // For backward compatibility, if user has single role, return as array
  if (user.role) {
    return [getCurrentUserRole()]
  }

  // For multi-role users, return roles array
  return user.roles || []
}

export function getCurrentUserActiveRole() {
  const user = getCurrentUser()
  if (!user) return null

  // For backward compatibility, if user has single role, return it
  if (user.role) {
    return getCurrentUserRole()
  }

  // For multi-role users, return active role
  return user.activeRole || (user.roles && user.roles[0]) || null
}

export function setCurrentUserActiveRole(role) {
  const user = getCurrentUser()
  if (!user) return false

  // For backward compatibility, if user has single role, don't allow changing
  if (user.role) return false

  // For multi-role users, update active role
  if (user.roles && user.roles.includes(role)) {
    user.activeRole = role
    localStorage.setItem('rt_user', JSON.stringify(user))
    // Dispatch storage event to notify other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'rt_user',
      newValue: JSON.stringify(user)
    }))
    return true
  }
  return false
}

export function hasRole(expectedRoles) {
  const role = getCurrentUserActiveRole()
  if (!role) return false
  if (Array.isArray(expectedRoles)) return expectedRoles.map(r => String(r).toLowerCase()).includes(role)
  return role === String(expectedRoles).toLowerCase()
}


