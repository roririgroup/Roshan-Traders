const prisma = require('../../shared/lib/db.js');

const createEmployee = async (payload) => {
  const { name, phone, email, role, status, image, salary } = payload;

<<<<<<< HEAD
=======
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

>>>>>>> c9f10485ce667d750f74ff46fc726fc7d1982858
  // Create user first
  const user = await prisma.user.create({
    data: {
      phoneNumber: phone,
      userType: 'CUSTOMER', // Using CUSTOMER as employees are not separate user type
      isVerified: true, // Assume verified for now
    },
  });

  // Create user profile if name or email provided
  if (name || email) {
    await prisma.userProfile.create({
      data: {
        userId: user.id,
        fullName: name,
        email: email,
        profileImageUrl: image,
      },
    });
  }

<<<<<<< HEAD
=======
  // Employees are only for loaders, workers, etc. (truck owners and drivers are handled by acting_labour module)
  const allowedRoles = ['Loader', 'Worker', 'Supervisor', 'Manager'];
  const normalizedRole = (role || 'Loader').toLowerCase();
  if (!allowedRoles.some(r => r.toLowerCase() === normalizedRole)) {
    throw new Error(`Invalid role. Allowed roles: ${allowedRoles.join(', ')}`);
  }

>>>>>>> c9f10485ce667d750f74ff46fc726fc7d1982858
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
  const employeeName = employee.user.profile?.fullName || 'Unknown';
  return {
    id: employee.id,
    name: employeeName,
    phone: employee.user.phoneNumber,
    email: employee.user.profile?.email || '',
    role: employee.role,
    status: employee.status,
    image: employee.user.profile?.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(employeeName)}&background=0D8ABC&color=fff`,
    salary: employee.salary,
    hireDate: employee.hireDate,
    createdAt: employee.createdAt,
    employeeCode: employee.employeeCode,
  };
};

const getAllEmployees = async () => {
  const employees = await prisma.employee.findMany({
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  // Transform the response to match frontend expectations
<<<<<<< HEAD
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
=======
  return employees.map(employee => {
    const employeeName = employee.user.profile?.fullName || 'Unknown';
    return {
      id: employee.id,
      name: employeeName,
      phone: employee.user.phoneNumber,
      email: employee.user.profile?.email || '',
      role: employee.role,
      status: employee.status,
      image: employee.user.profile?.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(employeeName)}&background=0D8ABC&color=fff`,
      salary: employee.salary,
      hireDate: employee.hireDate,
      createdAt: employee.createdAt,
      employeeCode: employee.employeeCode,
    };
  });
>>>>>>> c9f10485ce667d750f74ff46fc726fc7d1982858
};

const getEmployeeById = async (id) => {
  const employee = await prisma.employee.findUnique({
    where: { id: parseInt(id) },
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
  const employeeName = employee.user.profile?.fullName || 'Unknown';
  return {
    id: employee.id,
    name: employeeName,
    phone: employee.user.phoneNumber,
    email: employee.user.profile?.email || '',
    role: employee.role,
    status: employee.status,
    image: employee.user.profile?.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(employeeName)}&background=0D8ABC&color=fff`,
    salary: employee.salary,
    hireDate: employee.hireDate,
    createdAt: employee.createdAt,
    employeeCode: employee.employeeCode,
  };
};

const updateEmployee = async (id, payload) => {
  const { name, phone, email, role, status, image, salary } = payload;

  const employee = await prisma.employee.findUnique({
    where: { id: parseInt(id) },
    include: { user: true },
  });

  if (!employee) {
    throw new Error('Employee not found');
  }

  // Update user
  await prisma.user.update({
    where: { id: employee.userId },
    data: {
      phoneNumber: phone,
    },
  });

  // Update profile
  await prisma.userProfile.upsert({
    where: { userId: employee.userId },
    update: {
      fullName: name,
      email: email,
      profileImageUrl: image,
    },
    create: {
      userId: employee.userId,
      fullName: name,
      email: email,
      profileImageUrl: image,
    },
  });

  // Update employee
  const updatedEmployee = await prisma.employee.update({
    where: { id: parseInt(id) },
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
  const employeeName = updatedEmployee.user.profile?.fullName || 'Unknown';
  return {
    id: updatedEmployee.id,
    name: employeeName,
    phone: updatedEmployee.user.phoneNumber,
    email: updatedEmployee.user.profile?.email || '',
    role: updatedEmployee.role,
    status: updatedEmployee.status,
    image: updatedEmployee.user.profile?.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(employeeName)}&background=0D8ABC&color=fff`,
    salary: updatedEmployee.salary,
    hireDate: updatedEmployee.hireDate,
    createdAt: updatedEmployee.createdAt,
    employeeCode: updatedEmployee.employeeCode,
  };
};

const deleteEmployee = async (id) => {
  const employee = await prisma.employee.findUnique({
    where: { id: parseInt(id) },
    include: { user: true },
  });

  if (!employee) {
    throw new Error('Employee not found');
  }

  // Delete employee first
  await prisma.employee.delete({
    where: { id: parseInt(id) },
  });

  // Delete user (cascade will handle profile and other relations)
  await prisma.user.delete({
    where: { id: employee.userId },
  });
};

const getEmployeeByPhone = async (phone, role) => {
  // Handle truck owners and drivers through acting_labour module
  if (role === 'Truck Owner' || role === 'Driver') {
    const labourType = role === 'Truck Owner' ? 'TRUCK_OWNER' : 'DRIVER';
    const labour = await prisma.actingLabour.findFirst({
      where: {
        phone: phone.trim(),
        type: labourType
      }
    });

    if (!labour) {
      return null;
    }

    // Transform the response to match frontend expectations
    return {
      id: labour.id,
      name: labour.name,
      phone: labour.phone,
      email: labour.email || '',
      role: role,
      status: labour.status,
    };
  }

  const employee = await prisma.employee.findFirst({
    where: {
      user: {
        phoneNumber: phone.trim()
      },
      role: { contains: role }
    },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  if (!employee) {
    return null;
  }

  // Transform the response to match frontend expectations
  return {
    id: employee.id,
    name: employee.user.profile?.fullName || 'Unknown',
    phone: employee.user.phoneNumber,
    email: employee.user.profile?.email || '',
    role: employee.role,
    status: employee.status,
  };
};

const getEmployeeByPhoneWithoutRole = async (phone) => {
  const employee = await prisma.employee.findFirst({
    where: {
      user: {
        phoneNumber: phone.trim()
      }
    },
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

  // Transform the response to match frontend expectations
  return {
    employeeId: employee.id,
    name: employee.user.profile?.fullName || 'Unknown',
    phone: employee.user.phoneNumber,
    email: employee.user.profile?.email || '',
    role: employee.role,
    status: employee.status,
  };
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeByPhone,
  getEmployeeByPhoneWithoutRole,
};
