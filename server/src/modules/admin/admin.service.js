const prisma = require('../../shared/lib/db.js');

// Super admin CRUD operations
/**
 * @param {Object} payload
 * @param {string} payload.name
 * @param {string} payload.phone
 * @param {string} payload.email
 * @param {string} payload.password
 * @param {string} payload.role
 */
const createAdmin = async (payload) => {
  const { name, phone, email, password, role } = payload;

  // Create user first
  const user = await prisma.user.create({
    data: {
      phoneNumber: phone,
      userType: 'ADMIN',
      isVerified: true,
    },
  });

  // Create user profile
  if (name || email) {
    await prisma.userProfile.create({
      data: {
        userId: user.id,
        fullName: name,
        email: email,
      },
    });
  }

  // For now, we'll store password as plain text (in production, hash it)
  // You might want to add an Admin model later for additional admin-specific fields
  return {
    id: user.id,
    name: name || 'Unknown',
    phone: user.phoneNumber,
    email: email || '',
    role: role || 'Super Admin',
    status: 'Active',
    createdAt: user.createdAt,
  };
};

const getAllAdmins = async () => {
  const admins = await prisma.user.findMany({
    where: { userType: 'ADMIN' },
    include: {
      profile: true,
    },
  });

  return admins.map(admin => ({
    id: admin.id.toString(),
    name: admin?.profile?.fullName || 'Unknown',
    phone: admin?.phoneNumber || '',
    email: admin?.profile?.email || '',
    role: 'Super Admin',
    status: admin?.isActive ? 'Active' : 'Inactive',
    createdAt: admin.createdAt,
  }));
};

/**
 * @param {string} id
 */
const getAdminById = async (id) => {
  const admin = await prisma.user.findUnique({
    where: { id: parseInt(id), userType: 'ADMIN' },
    include: {
      profile: true,
    },
  });

  if (!admin) return null;

  return {
    id: admin.id,
    name: admin?.profile?.fullName || 'Unknown',
    phone: admin?.phoneNumber || '',
    email: admin?.profile?.email || '',
    role: 'Super Admin',
    status: admin?.isActive ? 'Active' : 'Inactive',
    createdAt: admin.createdAt,
  };
};

/**
 * @param {string} id
 * @param {Object} payload
 * @param {string} payload.name
 * @param {string} payload.phone
 * @param {string} payload.email
 * @param {string} payload.role
 * @param {string} payload.status
 */
const updateAdmin = async (id, payload) => {
  const { name, phone, email, role, status } = payload;

  const admin = await prisma.user.findUnique({
    where: { id: parseInt(id), userType: 'ADMIN' },
  });

  if (!admin) {
    throw new Error('Admin not found');
  }

  // Update user
  await prisma.user.update({
    where: { id: parseInt(id) },
    data: {
      phoneNumber: phone,
      isActive: status === 'Active',
    },
  });

  // Update profile
  await prisma.userProfile.upsert({
    where: { userId: parseInt(id) },
    update: {
      fullName: name,
      email: email,
    },
    create: {
      userId: parseInt(id),
      fullName: name,
      email: email,
    },
  });

  return {
    id: parseInt(id),
    name: name || 'Unknown',
    phone: phone,
    email: email || '',
    role: role || 'Super Admin',
    status: status || 'Active',
  };
};

/**
 * @param {string} id
 */
const deleteAdmin = async (id) => {
  const admin = await prisma.user.findUnique({
    where: { id: parseInt(id), userType: 'ADMIN' },
  });

  if (!admin) {
    throw new Error('Admin not found');
  }

  // Delete user (cascade will handle profile)
  await prisma.user.delete({
    where: { id: parseInt(id) },
  });
};

const getDashboardStats = async () => {
  // Get filtered counts from database (only active/verified records)
  const [totalManufacturers, totalAgents, totalActingLabours, totalEmployees, totalUsers, pendingPayments, totalRevenue] = await Promise.all([
    prisma.manufacturer.count({ where: { isVerified: true } }),
    prisma.agent.count({ where: { isApproved: true } }),
    prisma.actingLabour.count({ where: { status: 'AVAILABLE' } }),
    prisma.employee.count({ where: { status: { not: 'Unavailable' } } }),
    prisma.user.count({ where: { isActive: true } }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        status: 'COMPLETED',
      },
    }),
  ]);

  return {
    totalManufacturers,
    totalAgents,
    totalActingLabours,
    totalEmployees,
    totalUsers,
    pendingPayments,
    revenue: `$${totalRevenue._sum.totalAmount || 0}`,
  };
};

const getPendingUsers = async () => {
  const users = await prisma.user.findMany({
    where: { status: 'PENDING' },
    include: {
      profile: true,
      manufacturer: true
    }
  });

  return users.map(user => ({
    id: user.id,
    fullName: user.roles?.includes('Manufacturer') ? (user.manufacturer?.companyName || user.profile?.fullName || 'Unknown') : (user.profile?.fullName || 'Unknown'),
    email: user.profile?.email || '',
    phoneNumber: user.phoneNumber,
    roles: user.roles,
    status: user.status,
    createdAt: user.createdAt
  }));
};

const getApprovedUsers = async () => {
  const users = await prisma.user.findMany({
    where: { status: 'APPROVED' },
    include: {
      profile: true,
      agent: true,
      manufacturer: true,
      employee: true
    }
  });

  return users.map(user => ({
    id: user.id.toString(),
    fullName: user.roles?.includes('Manufacturer') ? (user.manufacturer?.companyName || user.profile?.fullName || 'Unknown') : (user.profile?.fullName || 'Unknown'),
    email: user.profile?.email || '',
    phoneNumber: user.phoneNumber,
    roles: user.roles,
    userType: user.userType,
    status: user.status,
    createdAt: user.createdAt,
    approvedAt: user.approvedAt,
    agent: user.agent ? { ...user.agent, id: user.agent.id.toString(), userId: user.agent.userId.toString() } : null,
    manufacturer: user.manufacturer ? { ...user.manufacturer, id: user.manufacturer.id.toString(), userId: user.manufacturer.userId.toString() } : null,
    employee: user.employee ? { ...user.employee, id: user.employee.id.toString(), userId: user.employee.userId.toString() } : null
  }));
};

const getRejectedUsers = async () => {
  const users = await prisma.user.findMany({
    where: { status: 'REJECTED' },
    include: {
      profile: true,
      manufacturer: true
    }
  });

  return users.map(user => ({
    id: user.id.toString(),
    fullName: user.roles?.includes('Manufacturer') ? (user.manufacturer?.companyName || user.profile?.fullName || 'Unknown') : (user.profile?.fullName || 'Unknown'),
    email: user.profile?.email || '',
    phoneNumber: user.phoneNumber,
    roles: user.roles,
    status: user.status,
    createdAt: user.createdAt,
    rejectedAt: user.rejectedAt
  }));
};

const approveUser = async (userId, adminId) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    include: { profile: true }
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.status !== 'PENDING') {
    throw new Error('User is not in pending status');
  }

  // Update user status to APPROVED
  const updatedUser = await prisma.user.update({
    where: { id: parseInt(userId) },
    data: {
      status: 'APPROVED',
      approvedAt: new Date()
    },
    include: { profile: true }
  });

  // Create specific role records based on user's roles
  const employeeRoles = [];
  // Helper to return a safe 32-bit integer or undefined
  const safeInt32 = (val) => {
    if (val === undefined || val === null) return undefined;
    // Accept strings or numbers
    const n = Number(val);
    if (!Number.isFinite(n)) return undefined;
    // Check 32-bit signed int range
    if (n > 2147483647 || n < -2147483648) return undefined;
    return Math.trunc(n);
  };

  const approvedByIdSafe = safeInt32(adminId);
  for (const role of user.roles) {
    switch (role) {
      case 'Agent':
        await prisma.agent.create({
          data: {
            userId: user.id,
            agentCode: `AGT-${user.id}`,
            isApproved: true,
            // Only set approvedById when adminId is a safe 32-bit integer to avoid DB type errors
            ...(approvedByIdSafe !== undefined ? { approvedById: approvedByIdSafe } : {}),
          }
        });
        break;
      case 'Manufacturer':
        await prisma.manufacturer.create({
          data: {
            userId: user.id,
            companyName: user.profile?.fullName || 'New Company',
            isVerified: true,
            ...(approvedByIdSafe !== undefined ? { verifiedById: approvedByIdSafe } : {}),
          }
        });
        break;
      case 'Truck Owner':
      case 'Driver':
        employeeRoles.push(role);
        break;
    }
  }

  // Create Employee record only if there are employee roles
  if (employeeRoles.length > 0) {
    await prisma.employee.create({
      data: {
        userId: user.id,
        employeeCode: `EMP-${user.id}`,
        role: employeeRoles.join(', ') // Store multiple roles as comma-separated string
      }
    });
  }

  // Log the approval action
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: 'user_approved',
      description: `User approved by admin ${adminId}`
    }
  });

  return updatedUser;
};

const rejectUser = async (userId, adminId) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    include: { profile: true }
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.status !== 'PENDING') {
    throw new Error('User is not in pending status');
  }

  // Update user status to REJECTED
  const updatedUser = await prisma.user.update({
    where: { id: parseInt(userId) },
    data: {
      status: 'REJECTED',
      rejectedAt: new Date()
    },
    include: { profile: true }
  });

  // Log the rejection action
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: 'user_rejected',
      description: `User rejected by admin ${adminId}`
    }
  });

  return updatedUser;
};

const checkUserStatus = async (phoneNumber) => {
  const user = await prisma.user.findUnique({
    where: { phoneNumber },
    include: {
      profile: true,
      agent: true,
      manufacturer: true,
      employee: true
    }
  });

  if (!user) {
    return { exists: false, status: null, message: 'User not found. Please sign up first.' };
  }

  let userType = user.userType;
  let additionalData = {};

  if (user.agent) {
    userType = 'Agent';
    additionalData = {
      agentCode: user.agent.agentCode,
      commissionRate: user.agent.commissionRate,
      totalEarnings: user.agent.totalEarnings,
      assignedArea: user.agent.assignedArea,
      isApproved: user.agent.isApproved,
    };
  } else if (user.manufacturer) {
    userType = 'Manufacturer';
    additionalData = {
      companyName: user.manufacturer.companyName,
      gstNumber: user.manufacturer.gstNumber,
      isVerified: user.manufacturer.isVerified,
      rating: user.manufacturer.rating,
      location: user.manufacturer.location,
    };
  } else if (user.employee) {
    userType = 'Employee';
    additionalData = {
      employeeCode: user.employee.employeeCode,
      role: user.employee.role,
      status: user.employee.status,
      salary: user.employee.salary,
      hireDate: user.employee.hireDate,
    };
  }

  const userData = {
    id: user.id.toString(),
    name: user?.profile?.fullName || 'Unknown',
    email: user?.profile?.email || '',
    phone: user?.phoneNumber || '',
    roles: user.roles,
    userType: userType,
    status: user.status,
    createdAt: user.createdAt,
    approvedAt: user.approvedAt,
    rejectedAt: user.rejectedAt,
    ...additionalData,
  };

  switch (user.status) {
    case 'APPROVED':
      return {
        exists: true,
        status: 'APPROVED',
        message: 'User is approved and can login.',
        user: userData
      };
    case 'PENDING':
      return {
        exists: true,
        status: 'PENDING',
        message: 'Your account is pending admin approval. Please wait for approval email/SMS.',
        user: userData
      };
    case 'REJECTED':
      return {
        exists: true,
        status: 'REJECTED',
        message: 'Your account has been rejected. Please contact support for more information.',
        user: userData
      };
    default:
      return {
        exists: true,
        status: user.status,
        message: 'Unknown user status. Please contact support.',
        user: userData
      };
  }
};

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getDashboardStats,
  getPendingUsers,
  getApprovedUsers,
  getRejectedUsers,
  approveUser,
  rejectUser,
  checkUserStatus
};
