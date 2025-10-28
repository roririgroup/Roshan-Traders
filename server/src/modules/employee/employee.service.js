const prisma = require('../../shared/lib/db.js');

/**
 * @param {Object} payload
 * @param {string} payload.name
 * @param {string} payload.phone
 * @param {string} [payload.email]
 * @param {string} [payload.role]
 * @param {string} [payload.status]
 * @param {string} [payload.image]
 * @param {number} [payload.salary]
 */
const createEmployee = async (payload) => {
  const { name, phone, email, role, status, image, salary } = payload;

  // Validation
  if (!name || !phone) {
    throw new Error('Name and phone are required');
  }

  
  // Trim inputs
  const trimmedPhone = phone.trim();
  const trimmedEmail = email && email.trim() !== '' ? email.trim() : null;

  // Check if phone number already exists
  const existingUser = await prisma.user.findUnique({
    where: { phoneNumber: trimmedPhone },
  });
  if (existingUser) {
    throw new Error('Phone number already exists');
  }

  // Check if email already exists if provided
  if (trimmedEmail) {
    const existingProfile = await prisma.userProfile.findUnique({
      where: { email: trimmedEmail },
    });
    if (existingProfile) {
      throw new Error('Email already exists');
    }
  }

  // Create user first
  const user = await prisma.user.create({
    data: {
      phoneNumber: trimmedPhone,
      userType: 'CUSTOMER', // Using CUSTOMER as employees are not separate user type
      isVerified: true, // Assume verified for now
    },
  });

  // Create user profile if name or email provided
  if (name || trimmedEmail) {
    await prisma.userProfile.create({
      data: {
        userId: user.id,
        fullName: name,
        email: trimmedEmail,
        profileImageUrl: image,
      },
    });
  }

  // Prevent creating truck owners or drivers through employee module
  const normalizedRole = (role || 'Loader').toLowerCase();
  if (normalizedRole === 'truck owner' || normalizedRole === 'driver') {
    throw new Error('Truck owners and drivers should be created through the acting labours module');
  }

  // Create employee
  const employee = await prisma.employee.create({
    data: {
      userId: user.id,
      employeeCode: `EMP${user.id.toString().padStart(4, '0')}`,
      role: role || 'Loader',
      status: status || 'Available',
      salary: salary || 0.0,
    },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  // Transform the response to match frontend expectations
  return {
    id: employee.id,
    name: employee.user.profile?.fullName || 'Unknown',
    phone: employee.user.phoneNumber,
    email: employee.user.profile?.email || '',
    role: employee.role,
    status: employee.status,
    image: employee.user.profile?.profileImageUrl || 'https://via.placeholder.com/150',
    salary: employee.salary,
    hireDate: employee.hireDate,
    createdAt: employee.createdAt,
    employeeCode: employee.employeeCode,
  };
};

const getAllEmployees = async (filters = {}) => {
  const { excludeLabours, onlyLabours } = filters;

  const where = {};
  if (excludeLabours) {
    // Exclude truck owners and drivers
    where.role = {
      notIn: ['Truck Owner', 'Driver']
    };
  } else if (onlyLabours) {
    // Only include truck owners and drivers
    where.role = {
      in: ['Truck Owner', 'Driver']
    };
  }

  const employees = await prisma.employee.findMany({
    where,
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  // Transform the response to match frontend expectations
  return employees.map(employee => ({
  id: employee.id,
    name: employee.user.profile?.fullName || 'Unknown',
    phone: employee.user.phoneNumber,
    email: employee.user.profile?.email || '',
    role: employee.role,
    status: employee.status,
    image: employee.user.profile?.profileImageUrl || 'https://via.placeholder.com/150',
    salary: employee.salary,
    hireDate: employee.hireDate,
    createdAt: employee.createdAt,
    employeeCode: employee.employeeCode,
  }));
};

/**
 * @param {string|number} id The employee ID to retrieve
 */
const getEmployeeById = async (/** @type {string|number} */ id) => {
  const employee = await prisma.employee.findUnique({
    where: { id: parseInt(String(id)) },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  if (!employee) return null;

  // Transform the response to match frontend expectations
  return {
    id: employee.id,
    name: employee.user.profile?.fullName || 'Unknown',
    phone: employee.user.phoneNumber,
    email: employee.user.profile?.email || '',
    role: employee.role,
    status: employee.status,
    image: employee.user.profile?.profileImageUrl || 'https://via.placeholder.com/150',
    salary: employee.salary,
    hireDate: employee.hireDate,
    createdAt: employee.createdAt,
    employeeCode: employee.employeeCode,
  };
};

/**
 * @param {string|number} id The employee ID to update
 * @param {Object} payload
 * @param {string} payload.name
 * @param {string} payload.phone
 * @param {string} [payload.email]
 * @param {string} [payload.role]
 * @param {string} [payload.status]
 * @param {string} [payload.image]
 * @param {number} [payload.salary]
 */
const updateEmployee = async (/** @type {string|number} */ id, payload) => {
  const { name, phone, email, role, status, image, salary } = payload;

  // Trim inputs
  const trimmedPhone = phone.trim();
  const trimmedEmail = email && email.trim() !== '' ? email.trim() : null;

  const employee = await prisma.employee.findUnique({
    where: { id: parseInt(String(id)) },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  if (!employee) {
    throw new Error('Employee not found');
  }

  // Check if phone number is changing and if it already exists for another user
  if (trimmedPhone !== employee.user.phoneNumber) {
    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber: trimmedPhone },
    });
    if (existingUser) {
      throw new Error('Phone number already exists');
    }
  }

  // Check if email is changing and if it already exists for another profile
  if (trimmedEmail && trimmedEmail !== employee.user.profile?.email) {
    const existingProfile = await prisma.userProfile.findUnique({
      where: { email: trimmedEmail },
    });
    if (existingProfile) {
      throw new Error('Email already exists');
    }
  }

  // Update user
  await prisma.user.update({
    where: { id: employee.userId },
    data: {
      phoneNumber: trimmedPhone,
    },
  });

  // Update profile
  await prisma.userProfile.upsert({
    where: { userId: employee.userId },
    update: {
      fullName: name,
      email: trimmedEmail,
      profileImageUrl: image,
    },
    create: {
      userId: employee.userId,
      fullName: name,
      email: trimmedEmail,
      profileImageUrl: image,
    },
  });

  // Update employee
  const updatedEmployee = await prisma.employee.update({
    where: { id: parseInt(String(id)) },
    data: {
      role: role,
      status: status,
      salary: salary,
    },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  // Transform the response to match frontend expectations
  return {
    id: updatedEmployee.id,
    name: updatedEmployee.user.profile?.fullName || 'Unknown',
    phone: updatedEmployee.user.phoneNumber,
    email: updatedEmployee.user.profile?.email || '',
    role: updatedEmployee.role,
    status: updatedEmployee.status,
    image: updatedEmployee.user.profile?.profileImageUrl || 'https://via.placeholder.com/150',
    salary: updatedEmployee.salary,
    hireDate: updatedEmployee.hireDate,
    createdAt: updatedEmployee.createdAt,
    employeeCode: updatedEmployee.employeeCode,
  };
};

/**
 * @param {string|number} id The employee ID to delete
 */
const deleteEmployee = async (/** @type {string|number} */ id) => {
  const employee = await prisma.employee.findUnique({
    where: { id: parseInt(String(id)) },
    include: { user: true },
  });

  if (!employee) {
    throw new Error('Employee not found');
  }

  // Delete employee first
  await prisma.employee.delete({
    where: { id: parseInt(String(id)) },
  });

  // Delete user (cascade will handle profile and other relations)
  await prisma.user.delete({
    where: { id: employee.userId },
  });
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
