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
    id: admin.id,
    name: admin.profile?.fullName || 'Unknown',
    phone: admin.phoneNumber,
    email: admin.profile?.email || '',
    role: 'Super Admin',
    status: admin.isActive ? 'Active' : 'Inactive',
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
    name: admin.profile?.fullName || 'Unknown',
    phone: admin.phoneNumber,
    email: admin.profile?.email || '',
    role: 'Super Admin',
    status: admin.isActive ? 'Active' : 'Inactive',
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
  const [totalManufacturers, totalAgents, totalEmployees, totalUsers, pendingPayments, totalRevenue] = await Promise.all([
    prisma.manufacturer.count({ where: { isVerified: true } }),
    prisma.agent.count({ where: { isApproved: true } }),
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
    totalEmployees,
    totalUsers,
    pendingPayments,
    revenue: `$${totalRevenue._sum.totalAmount || 0}`,
  };
};

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getDashboardStats,
};
