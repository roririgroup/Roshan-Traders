const prisma = require('../../shared/lib/db.js');


/**
 * @typedef {Object} Founder
 * @property {string} name
 * @property {string} experience
 * @property {string} qualification
 */

/**
 * @param {any} payload
 */
const createManufacturer = async (payload) => {
  try {
    console.log('createManufacturer called with payload:', JSON.stringify(payload, null, 2));
    
    const {
      companyName,
      businessType,
      gstNumber,
      panNumber,
      businessAddress,
      websiteUrl,
      contact,
      companyInfo,
      founders,
      description,
      established,
      location,
      rating,
      image,
      userId,
    } = payload;

    let specializations = payload.specializations;
    let achievements = payload.achievements;
    let certifications = payload.certifications;

    let userIdToUse = userId;

    // If no userId provided, create a new user for the manufacturer
    if (!userIdToUse) {
      console.log('No userId provided, creating new manufacturer user...');
      // Create a new user for the manufacturer
      const systemUser = await prisma.user.create({
        data: {
          phoneNumber: `SYSTEM_MANUFACTURER_${Date.now()}`, // Unique system phone for manufacturer
          userType: 'MANUFACTURER',
          isVerified: true,
        },
      });
      userIdToUse = systemUser.id;
      console.log('Created new user with ID:', userIdToUse);
    }

  // Create manufacturer
  console.log('Creating manufacturer with data...');
  const manufacturer = await prisma.manufacturer.create({
    data: {
      companyName,
      businessType: businessType || null,
      gstNumber: gstNumber || null,
      panNumber: panNumber || null,
      businessAddress: businessAddress ? JSON.stringify({ address: businessAddress }) : null,
      websiteUrl: websiteUrl || null,
      description: description || null,
      established: established ? parseInt(established) : null,
      location: location || null,
      rating: rating ? parseFloat(rating) : 4.0,
      image: image || null,
      userId: userIdToUse,
    },
  });
  
  console.log('Manufacturer created with ID:', manufacturer.id);

  // Create contact if provided
  if (contact && (contact.phone || contact.email)) {
    console.log('Creating contact...');
    await prisma.contact.create({
      data: {
        phone: contact.phone,
        email: contact.email,
        website: contact.website,
        address: contact.address,
        manufacturerId: manufacturer.id,
      },
    });
  }

  // Create companyInfo if provided
  if (companyInfo && (companyInfo.employees || companyInfo.annualTurnover || companyInfo.exportCountries)) {
    console.log('Creating company info...');
    await prisma.companyInfo.create({
      data: {
        employees: companyInfo.employees,
        annualTurnover: companyInfo.annualTurnover,
        exportCountries: companyInfo.exportCountries,
        manufacturerId: manufacturer.id,
      },
    });
  }

  // Create founders if provided
  if (founders && founders.length > 0) {
    console.log('Creating founders...');
    await prisma.founder.createMany({
      data: founders.map(founder => ({
        name: founder.name,
        experience: founder.experience,
        qualification: founder.qualification,
        manufacturerId: manufacturer.id,
      })),
    });
  }

  // Handle specializations
  if (specializations) {
    if (typeof specializations === 'string') {
      specializations = specializations.split(',').map(s => s.trim()).filter(s => s);
    }
    if (specializations.length > 0) {
      for (const specName of specializations) {
        let specialization = await prisma.specialization.findFirst({
          where: { name: specName },
        });
        if (!specialization) {
          specialization = await prisma.specialization.create({
            data: { name: specName },
          });
        }
        await prisma.manufacturerSpecialization.create({
          data: {
            manufacturerId: manufacturer.id,
            specializationId: specialization.id,
          },
        });
      }
    }
  }

  // Handle achievements
  if (achievements) {
    if (typeof achievements === 'string') {
      achievements = achievements.split(',').map(s => s.trim()).filter(s => s);
    }
    if (achievements && achievements.length > 0) {
      for (const achName of achievements) {
        let achievement = await prisma.achievement.findFirst({
          where: { name: achName },
        });
        if (!achievement) {
          achievement = await prisma.achievement.create({
            data: { name: achName },
          });
        }
        await prisma.manufacturerAchievement.create({
          data: {
            manufacturerId: manufacturer.id,
            achievementId: achievement.id,
          },
        });
      }
    }
  }

  // Handle certifications
  if (certifications) {
    if (typeof certifications === 'string') {
      certifications = certifications.split(',').map(s => s.trim()).filter(s => s);
    }
    if (certifications && certifications.length > 0) {
      for (const certName of certifications) {
        let certification = await prisma.certification.findFirst({
          where: { name: certName },
        });
        if (!certification) {
          certification = await prisma.certification.create({
            data: { name: certName },
          });
        }
        await prisma.manufacturerCertification.create({
          data: {
            manufacturerId: manufacturer.id,
            certificationId: certification.id,
          },
        });
      }
    }
  }

    // Transform the response to match frontend expectations
    const result = {
      ...manufacturer,
      specializationsList: [],
      achievementsList: [],
      certificationsList: [],
    };
    
    console.log('Manufacturer created successfully:', result);
    return result;
    
  } catch (error) {
    console.error('Error in createManufacturer:', error);
    throw error;
  }
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
    ...manufacturer,
    specializationsList: manufacturer.specializations.map(s => s.specialization.name),
    achievementsList: manufacturer.achievements.map(a => a.achievement.name),
    certificationsList: manufacturer.certifications.map(c => c.certification.name),
    productsCount: manufacturer._count.products,
  }));
};

const getManufacturerById = async (id) => {
  const manufacturer = await prisma.manufacturer.findUnique({
    where: { id: parseInt(id) },
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
      products: true,
      orders: true,
    },
  });

  if (!manufacturer) return null;

  // Transform the response to match frontend expectations
  return {
    ...manufacturer,
    specializationsList: manufacturer.specializations.map(s => s.specialization.name),
    achievementsList: manufacturer.achievements.map(a => a.achievement.name),
    certificationsList: manufacturer.certifications.map(c => c.certification.name),
  };
};

const updateManufacturer = async (id, payload) => {
  // For simplicity, update only basic fields; full update would require handling relations
  const { companyName, businessType, gstNumber, panNumber, businessAddress, websiteUrl, description, established, location, rating, image } = payload;

  const manufacturer = await prisma.manufacturer.update({
    where: { id: parseInt(id) },
    data: {
      companyName,
      businessType,
      gstNumber,
      panNumber,
      businessAddress,
      websiteUrl,
      description,
      established,
      location,
      rating,
      image,
    },
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
    },
  });

  // Transform the response to match frontend expectations
  return {
    ...manufacturer,
    specializationsList: manufacturer.specializations.map(s => s.specialization.name),
    achievementsList: manufacturer.achievements.map(a => a.achievement.name),
    certificationsList: manufacturer.certifications.map(c => c.certification.name),
  };
};

const deleteManufacturer = async (id) => {
  return await prisma.manufacturer.delete({
    where: { id: parseInt(id) },
  });
};

/**
 * @param {string|number} manufacturerId
 * @param {string} role
 */
const getManufacturerEmployees = async (manufacturerId, role) => {
  const manufacturer = await prisma.manufacturer.findUnique({
    where: { id: parseInt(manufacturerId) },
    include: {
      employees: true,
    },
  });

  if (!manufacturer) {
    throw new Error('Manufacturer not found');
  }

  let employees = manufacturer.employees;

  // Filter by role if specified
  if (role) {
    if (role === 'truck-owner') {
      // For truck owners, we need to get from acting_labour table
      const truckOwners = await prisma.actingLabour.findMany({
        where: {
          type: 'TRUCK_OWNER',
          assignedToId: parseInt(manufacturerId),
          assignedToType: 'manufacturer',
        },
      });

      // Transform to match expected format
      employees = truckOwners.map(to => ({
        id: to.id,
        name: to.name,
        phone: to.phone,
        address: to.location,
        role: 'truck-owner',
        status: to.status === 'AVAILABLE' ? 'active' : 'inactive',
      }));
    } else if (role === 'driver') {
      // For drivers, get from acting_labour table
      const drivers = await prisma.actingLabour.findMany({
        where: {
          type: 'DRIVER',
          assignedToId: parseInt(manufacturerId),
          assignedToType: 'manufacturer',
        },
      });

      // Transform to match expected format
      employees = drivers.map(d => ({
        id: d.id,
        name: d.name,
        phone: d.phone,
        address: d.location,
        role: 'driver',
        status: d.status === 'AVAILABLE' ? 'active' : 'inactive',
      }));
    } else if (role === 'loadman') {
      // For loadmen, get from acting_labour table
      const loadmen = await prisma.actingLabour.findMany({
        where: {
          type: 'LOADMAN',
          assignedToId: parseInt(manufacturerId),
          assignedToType: 'manufacturer',
        },
      });

      // Transform to match expected format
      employees = loadmen.map(l => ({
        id: l.id,
        name: l.name,
        phone: l.phone,
        address: l.location,
        role: 'loadman',
        status: l.status === 'AVAILABLE' ? 'active' : 'inactive',
      }));
    } else {
      // For other roles, filter from manufacturer employees
      employees = employees.filter(emp => emp.role.toLowerCase() === role.toLowerCase());
    }
  } else {
    // If no role specified, get all employees from both tables
    const labourEmployees = await prisma.actingLabour.findMany({
      where: {
        assignedToId: parseInt(manufacturerId),
        assignedToType: 'manufacturer',
      },
    });

    // Transform labour employees to match format
    const transformedLabourEmployees = labourEmployees.map(l => ({
      id: l.id,
      name: l.name,
      phone: l.phone,
      address: l.location,
      role: l.type === 'TRUCK_OWNER' ? 'truck-owner' : l.type === 'DRIVER' ? 'driver' : 'loadman',
      status: l.status === 'AVAILABLE' ? 'active' : 'inactive',
    }));

    // Combine both
    employees = [...employees, ...transformedLabourEmployees];
  }

  return employees;
};

/**
 * @param {string|number} manufacturerId
 * @param {any} employeeData
 */
const createManufacturerEmployee = async (manufacturerId, employeeData) => {
  const { name, address, phone, role, status } = employeeData;

  // Check if manufacturer exists
  const manufacturer = await prisma.manufacturer.findUnique({
    where: { id: parseInt(manufacturerId) },
  });

  if (!manufacturer) {
    throw new Error('Manufacturer not found');
  }

  // Map status to LabourStatus for ActingLabour
  const labourStatus = status === 'active' ? 'AVAILABLE' : 'UNAVAILABLE';

  // Check if role is a labour role (truck-owner, driver, loadman)
  if (['truck-owner', 'driver', 'loadman'].includes(role)) {
    const labourType = role === 'truck-owner' ? 'TRUCK_OWNER' : role === 'driver' ? 'DRIVER' : 'LOADMAN';

    // Create in ActingLabour table
    const labour = await prisma.actingLabour.create({
      data: {
        name,
        type: labourType,
        phone,
        location: address,
        status: labourStatus,
        assignedToId: parseInt(manufacturerId),
        assignedToType: 'manufacturer',
      },
    });

    return labour;
  } else {
    // Create in ManufacturerEmployee table for other roles
    const employee = await prisma.manufacturerEmployee.create({
      data: {
        name,
        address,
        phone,
        role,
        status: status || 'active',
        manufacturerId: parseInt(manufacturerId),
      },
    });

    return employee;
  }
};

/**
 * @param {string|number} manufacturerId
 * @param {string|number} employeeId
 * @param {any} employeeData
 */
const updateManufacturerEmployee = async (manufacturerId, employeeId, employeeData) => {
  const { name, address, phone, role, status } = employeeData;

  // Check if manufacturer exists
  const manufacturer = await prisma.manufacturer.findUnique({
    where: { id: parseInt(manufacturerId) },
  });

  if (!manufacturer) {
    throw new Error('Manufacturer not found');
  }

  // Map status to LabourStatus for ActingLabour
  const labourStatus = status === 'active' ? 'AVAILABLE' : 'UNAVAILABLE';

  // Check if role is a labour role (truck-owner, driver, loadman)
  if (['truck-owner', 'driver', 'loadman'].includes(role)) {
    const labourType = role === 'truck-owner' ? 'TRUCK_OWNER' : role === 'driver' ? 'DRIVER' : 'LOADMAN';

    // Update in ActingLabour table
    const labour = await prisma.actingLabour.update({
      where: {
        id: parseInt(employeeId),
      },
      data: {
        name,
        type: labourType,
        phone,
        location: address,
        status: labourStatus,
        assignedToId: parseInt(manufacturerId),
        assignedToType: 'manufacturer',
      },
    });

    return labour;
  } else {
    // Update in ManufacturerEmployee table for other roles
    const employee = await prisma.manufacturerEmployee.update({
      where: {
        id: parseInt(employeeId),
        manufacturerId: parseInt(manufacturerId),
      },
      data: {
        name,
        address,
        phone,
        role,
        status,
      },
    });

    return employee;
  }
};

/**
 * @param {string|number} manufacturerId
 * @param {string|number} employeeId
 */
const deleteManufacturerEmployee = async (manufacturerId, employeeId) => {
  // Check if manufacturer exists
  const manufacturer = await prisma.manufacturer.findUnique({
    where: { id: parseInt(manufacturerId) },
  });

  if (!manufacturer) {
    throw new Error('Manufacturer not found');
  }

  // First, try to find the employee in ActingLabour table (for labour roles)
  const labourEmployee = await prisma.actingLabour.findUnique({
    where: {
      id: parseInt(employeeId),
    },
  });

  if (labourEmployee && labourEmployee.assignedToId === parseInt(manufacturerId) && labourEmployee.assignedToType === 'manufacturer') {
    // Delete from ActingLabour table
    await prisma.actingLabour.delete({
      where: {
        id: parseInt(employeeId),
      },
    });
  } else {
    // Delete from ManufacturerEmployee table for other roles
    await prisma.manufacturerEmployee.delete({
      where: {
        id: parseInt(employeeId),
        manufacturerId: parseInt(manufacturerId),
      },
    });
  }

  return true;
};

module.exports = {
  createManufacturer,
  getAllManufacturers,
  getManufacturerById,
  updateManufacturer,
  deleteManufacturer,
  getManufacturerEmployees,
  createManufacturerEmployee,
  updateManufacturerEmployee,
  deleteManufacturerEmployee,
};
