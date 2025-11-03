const prisma = require('../../shared/lib/db.js');

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
    where: { phoneNumber: normalizedPhone },
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
      phoneNumber: normalizedPhone,

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


  // Prevent creating drivers through employee module (truck owners are allowed as employees)
  const normalizedRole = (role || 'Loader').toLowerCase();
  if (normalizedRole === 'driver') {
    throw new Error('Drivers should be created through the acting labours module');
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
  let employee = await prisma.employee.findFirst({
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

  // If employee not found and role is Truck Owner or Driver, try to create it
  if (!employee && (role === 'Truck Owner' || role === 'Driver')) {
    // Find the user by phone
    const user = await prisma.user.findUnique({
      where: { phoneNumber: phone.trim() },
      include: { profile: true },
    });

    if (user) {
      // Create employee record
      employee = await prisma.employee.create({
        data: {
          userId: user.id,
          employeeCode: `EMP${user.id.toString().padStart(4, '0')}`,
          role: role,
          status: 'Available',
          salary: 0.0,
        },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      });
    }
  }

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
