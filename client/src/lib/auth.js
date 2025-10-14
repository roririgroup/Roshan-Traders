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
export function loginUser({ phone, otp, selectedRoles }) {
  // Dummy login: accept any non-empty phone+otp
  if (!phone || !otp) return { success: false, error: "Phone and OTP required" };
  if (!selectedRoles || selectedRoles.length === 0) return { success: false, error: "At least one role required" };

  // Dummy validation - just check if they exist
  if (phone.length < 10) return { success: false, error: "Please enter a valid mobile number" };
  if (otp.length < 4) return { success: false, error: "Please enter a valid OTP" };

  const user = {
    id: `user-${Date.now()}`,
    roles: selectedRoles.map(role => String(role).toLowerCase()),
    activeRole: selectedRoles[0].toLowerCase(), // Default to first selected role
    name: `${selectedRoles[0].charAt(0).toUpperCase() + selectedRoles[0].slice(1)} User`,
    phone,
    loginMethod: 'mobile'
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


