export const STORAGE_KEY = "rt_user";

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}


// Super Admin authentication (Gmail/Email)
export function loginSuperAdmin({ email, password }) {
  // Dummy login: accept any email and password
  if (!email || !password) return { success: false, error: "Email and password required" };
  
  // Dummy validation - just check if they exist
  if (!email.includes('@')) return { success: false, error: "Please enter a valid email address" };
  
  const user = {
    id: "super-admin-1",
    role: "superadmin",
    name: "Super Admin",
    email,
    loginMethod: 'email'
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return { success: true, user };
}

// User authentication (Mobile OTP)
export async function loginUser({ phone, otp, selectedRoles }) {
  // Dummy login: accept any non-empty phone+otp
  if (!phone || !otp) return { success: false, error: "Phone and OTP required" };
  if (!selectedRoles || selectedRoles.length === 0) return { success: false, error: "At least one role required" };

  // Dummy validation - just check if they exist
  if (phone.length < 10) return { success: false, error: "Please enter a valid mobile number" };
  if (otp.length < 4) return { success: false, error: "Please enter a valid OTP" };

  // First, check user status
  try {
    const statusResponse = await fetch(`http://localhost:7700/api/admins/check-user-status/${phone}`);
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      if (!statusData.exists) {
        return { success: false, error: "User not found. Please sign up first." };
      }
      if (statusData.status !== 'APPROVED') {
        return { success: false, error: statusData.message };
      }
    } else {
      return { success: false, error: "Failed to verify user status" };
    }
  } catch (error) {
    console.error('Error checking user status:', error);
    return { success: false, error: "Network error. Please try again." };
  }

  // For truck owners, we need to fetch their employee record
  const isTruckOwner = selectedRoles.some(role => role.toLowerCase() === 'truck owner');
  let employeeId = null;

  if (isTruckOwner) {
    try {
      const response = await fetch('http://localhost:7700/api/employees/by-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phone.replace(/^\+91/, '').trim(), role: 'Truck Owner' })
      });

      if (response.ok) {
        const data = await response.json();
        employeeId = data.id;
      } else {
        // Employee record not found, but login should still succeed
        console.warn('Employee record not found for truck owner, but proceeding with login');
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
      // Don't fail login if employee fetch fails
    }
  }

  const user = {
    id: `user-${Date.now()}`,
    roles: selectedRoles.map(role => String(role).toLowerCase()),
    activeRole: selectedRoles[0].toLowerCase(),
    name: `${selectedRoles[0].charAt(0).toUpperCase() + selectedRoles[0].slice(1)} User`,
    phone,
    loginMethod: 'mobile',
    employeeId // Include employeeId for truck owners
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return { success: true, user };
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

export function isAuthenticated() {
  const user = getCurrentUser();
  return Boolean(user);
}

// Helper function to check if user is super admin
export function isSuperAdmin() {
  const user = getCurrentUser();
  return Boolean(user && user.role === "superadmin");
}

// Helper function to check user role
export function hasRole(role) {
  const user = getCurrentUser();
  return Boolean(user && user.activeRole === role);
}


