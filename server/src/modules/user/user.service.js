const prisma = require('../../shared/lib/db.js');

const getAllUsers = async () => {
  // Get all users with their profiles and related data
  const users = await prisma.user.findMany({
    include: {
      profile: true,
      agent: {
        select: {
          id: true,
          agentCode: true,
          commissionRate: true,
          totalEarnings: true,
          assignedArea: true,
          isApproved: true,
        },
      },
      manufacturer: {
        select: {
          id: true,
          companyName: true,
          gstNumber: true,
          isVerified: true,
          rating: true,
          location: true,
        },
      },
      employee: {
        select: {
          id: true,
          employeeCode: true,
          role: true,
          status: true,
          salary: true,
          hireDate: true,
        },
      },
    },
  });

  // Transform the response to match frontend expectations
  return users.map(user => {
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

    return {
      id: user.id,
      name: user.profile?.fullName || 'Unknown',
      userId: user.agent?.agentCode || user.employee?.employeeCode || `USR-${user.id}`,
      email: user.profile?.email || '',
      phone: user.phoneNumber,
      organization: user.manufacturer?.companyName || user.agent?.assignedArea || user.employee?.role || '',
      balance: user.agent?.totalEarnings || 0,
      lastUsed: user.lastLogin,
      userType: userType,
      status: user.agent?.isApproved ? 'Available' : user.employee?.status || 'Available',
      image: user.profile?.profileImageUrl || 'https://via.placeholder.com/150',
      ...additionalData,
    };
  });
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    include: {
      profile: true,
      agent: true,
      manufacturer: true,
      employee: true,
    },
  });

  if (!user) return null;

  // Transform the response similar to getAllUsers
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

  return {
    id: user.id,
    name: user.profile?.fullName || 'Unknown',
    userId: user.agent?.agentCode || user.employee?.employeeCode || `USR-${user.id}`,
    email: user.profile?.email || '',
    phone: user.phoneNumber,
    organization: user.manufacturer?.companyName || user.agent?.assignedArea || user.employee?.role || '',
    balance: user.agent?.totalEarnings || 0,
    lastUsed: user.lastLogin,
    userType: userType,
    status: user.agent?.isApproved ? 'Available' : user.employee?.status || 'Available',
    image: user.profile?.profileImageUrl || 'https://via.placeholder.com/150',
    ...additionalData,
  };
};

const getAllManufacturers = async () => {
  const manufacturers = await prisma.manufacturer.findMany({
    include: {
      contact: true,
      companyInfo: true,
      founders: true,
      specializations: {
        include: {
          specialization: true,
        },
      },
      achievements: {
        include: {
          achievement: true,
        },
      },
      certifications: {
        include: {
          certification: true,
        },
      },
      products: {
        select: {
          id: true,
        },
      },
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  // Transform the response to match frontend expectations
  return manufacturers.map(manufacturer => ({
    id: manufacturer.id,
    companyName: manufacturer.companyName,
    businessType: manufacturer.businessType,
    gstNumber: manufacturer.gstNumber,
    panNumber: manufacturer.panNumber,
    businessAddress: manufacturer.businessAddress,
    websiteUrl: manufacturer.websiteUrl,
    isVerified: manufacturer.isVerified,
    description: manufacturer.description,
    established: manufacturer.established,
    location: manufacturer.location,
    rating: manufacturer.rating,
    image: manufacturer.image,
    contact: manufacturer.contact,
    companyInfo: manufacturer.companyInfo,
    founders: manufacturer.founders,
    specializationsList: manufacturer.specializations?.map(s => s.specialization?.name).filter(Boolean) || [],
    achievementsList: manufacturer.achievements?.map(a => a.achievement?.name).filter(Boolean) || [],
    certificationsList: manufacturer.certifications?.map(c => c.certification?.name).filter(Boolean) || [],
    productsCount: manufacturer._count.products,
    // Add stock and category fields for frontend compatibility
    stock: manufacturer.companyInfo?.employees || 0, // Using employees as stock for now
    category: manufacturer.businessType || 'bricks', // Default to bricks
    productType: manufacturer.businessType || 'All Types',
    email: manufacturer.contact?.email || '',
    phone: manufacturer.contact?.phone || '',
    address: manufacturer.contact?.address || manufacturer.businessAddress || ''
  }));
};

module.exports = {
  getAllUsers,
  getUserById,
  getAllManufacturers,
};
