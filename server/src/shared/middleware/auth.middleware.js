// Lightweight auth middleware for development
// - authenticateToken: reads X-Employee-Id header (if present) and attaches req.user
// - authorizeRoles: checks that req.user has at least one of the required roles (if provided)

/**
 * Example usage for development/testing:
 * - Include header `X-Employee-Id: 1` to emulate an authenticated employee with id=1
 * - Include header `X-User-Roles: Truck Owner,Admin` to emulate roles
 */
const authenticateToken = (req, res, next) => {
  try {
    // In production this should validate JWT token. For dev we accept headers.
    const empIdHeader = req.header('x-employee-id') || req.header('X-Employee-Id');
    const rolesHeader = req.header('x-user-roles') || req.header('X-User-Roles');

    const employeeId = empIdHeader ? parseInt(empIdHeader, 10) : null;
    const roles = rolesHeader ? rolesHeader.split(',').map(r => r.trim()) : [];

    req.user = {
      employeeId,
      roles
    };

    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

const authorizeRoles = (allowedRoles = []) => (req, res, next) => {
  // If no allowedRoles specified, allow through
  if (!allowedRoles || allowedRoles.length === 0) return next();

  const userRoles = (req.user && Array.isArray(req.user.roles)) ? req.user.roles : [];
  const hasRole = allowedRoles.some(r => userRoles.includes(r));
  if (hasRole) return next();

  // For development, if employeeId is present and roles not set, allow Truck Owner routes
  if (req.user && req.user.employeeId && allowedRoles.includes('Truck Owner')) {
    return next();
  }

  return res.status(403).json({ success: false, message: 'Forbidden' });
};

module.exports = { authenticateToken, authorizeRoles };
