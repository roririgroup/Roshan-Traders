const prisma = require('../../shared/lib/db.js');

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
      products,
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
      businessAddress: businessAddress ? JSON.stringify({ address: businessAddress }) : undefined,
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
      data: founders.map((/** @type {any} */ founder) => ({
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

  // Handle products
  if (products && products.length > 0) {
    console.log('Creating products...');
    for (const productName of products) {
      const productId = `${manufacturer.id}_${productName.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`;
      await prisma.product.create({
        data: {
          id: productId,
          name: productName,
          category: 'General', // Default category, can be updated later
          manufacturerId: manufacturer.id,
        },
      });
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

/**
 * @param {any} id
 */
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

/**
 * @param {any} id
 * @param {any} payload
 */
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

/**
 * @param {any} id
 */
const deleteManufacturer = async (id) => {
  return await prisma.manufacturer.delete({
    where: { id: parseInt(id) },
  });
};

module.exports = {
  createManufacturer,
  getAllManufacturers,
  getManufacturerById,
  updateManufacturer,
  deleteManufacturer,
};
