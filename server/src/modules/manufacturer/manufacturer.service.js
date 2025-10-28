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
      products,
      productIds,
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
          roles: ['Manufacturer'],
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
    const exportCountriesCount = companyInfo.exportCountries ? parseInt(companyInfo.exportCountries) : 0;
    await prisma.companyInfo.create({
      data: {
        employees: companyInfo.employees ? parseInt(companyInfo.employees) : null,
        annualTurnover: companyInfo.annualTurnover,
        exportCountries: exportCountriesCount,
        manufacturerId: manufacturer.id,
      },
    });
  }

  // Create founders if provided
  if (founders && founders.length > 0) {
    console.log('Creating founders...');
    await prisma.founder.createMany({
      data: founders.map((/** @type {Founder} */ founder) => ({
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

  // Handle products - link existing products via ManufacturerProduct
  const productsToLink = productIds || products;
  if (productsToLink && productsToLink.length > 0) {
    console.log('Linking products to manufacturer...');
    for (const productName of productsToLink) {
      // Find product by name
      const product = await prisma.product.findFirst({
        where: { name: productName },
      });
      if (product) {
        await prisma.manufacturerProduct.create({
          data: {
            manufacturerId: manufacturer.id,
            productId: product.id,
          },
        });
      } else {
        console.warn(`Product with name "${productName}" not found, skipping.`);
      }
    }
  }

    // Transform the response to match frontend expectations
    const result = {
      ...manufacturer,
      specializationsList: [],
      achievementsList: [],
      certificationsList: [],
      productsCount: 0,
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
      manufacturerProducts: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
        },
      },
      _count: {
        select: {
          manufacturerProducts: true,
        },
      },
    },
  });

  // Transform the response to match frontend expectations
  return manufacturers.map(manufacturer => ({
    ...manufacturer,
    id: manufacturer.id.toString(),
    userId: manufacturer.userId.toString(),
    specializationsList: manufacturer?.specializations?.map(s => s?.specialization?.name).filter(Boolean) || [],
    achievementsList: manufacturer?.achievements?.map(a => a?.achievement?.name).filter(Boolean) || [],
    certificationsList: manufacturer?.certifications?.map(c => c?.certification?.name).filter(Boolean) || [],
    productsCount: manufacturer?.manufacturerProducts?.length || 0,
    exportCountriesCount: manufacturer?.companyInfo?.exportCountries || 0,
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
      manufacturerProducts: {
        include: {
          product: true,
        },
      },
      orders: true,
    },
  });

  if (!manufacturer) return null;

  // Transform the response to match frontend expectations
  return {
    ...manufacturer,
    id: manufacturer.id.toString(),
    userId: manufacturer.userId.toString(),
    specializationsList: manufacturer?.specializations?.map(s => s?.specialization?.name).filter(Boolean) || [],
    achievementsList: manufacturer?.achievements?.map(a => a?.achievement?.name).filter(Boolean) || [],
    certificationsList: manufacturer?.certifications?.map(c => c?.certification?.name).filter(Boolean) || [],
    productsCount: manufacturer?.manufacturerProducts?.length || 0,
    exportCountriesCount: manufacturer?.companyInfo?.exportCountries || 0,
  };
};

/**
 * @param {any} id
 * @param {any} payload
 */
const updateManufacturer = async (id, payload) => {
  try {
    console.log('updateManufacturer called with payload:', JSON.stringify(payload, null, 2));

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
      specializations,
      achievements,
      certifications,
      description,
      established,
      location,
      rating,
      image,
    } = payload;

    // Fetch existing manufacturer first to get userId
    const existingManufacturer = await prisma.manufacturer.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
      },
    });

    if (!existingManufacturer) {
      throw new Error('Manufacturer not found');
    }

    // Update basic manufacturer fields while preserving userId
    const manufacturer = await prisma.manufacturer.update({
      where: { id: parseInt(id) },
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
        userId: existingManufacturer.userId, // Preserve the userId relationship
      },
    });

    console.log('Manufacturer basic fields updated');

    // Update or create contact
    if (contact) {
      const existingContact = await prisma.contact.findFirst({
        where: { manufacturerId: parseInt(id) },
      });

      if (existingContact) {
        await prisma.contact.update({
          where: { id: existingContact.id },
          data: {
            phone: contact.phone,
            email: contact.email,
            website: contact.website,
            address: contact.address,
          },
        });
      } else {
        await prisma.contact.create({
          data: {
            phone: contact.phone,
            email: contact.email,
            website: contact.website,
            address: contact.address,
            manufacturerId: parseInt(id),
          },
        });
      }
    }

    // Update or create companyInfo
    if (companyInfo) {
      const existingCompanyInfo = await prisma.companyInfo.findFirst({
        where: { manufacturerId: parseInt(id) },
      });

      if (existingCompanyInfo) {
        await prisma.companyInfo.update({
          where: { id: existingCompanyInfo.id },
          data: {
            employees: companyInfo.employees,
            annualTurnover: companyInfo.annualTurnover,
            exportCountries: companyInfo.exportCountries,
          },
        });
      } else {
        await prisma.companyInfo.create({
          data: {
            employees: companyInfo.employees,
            annualTurnover: companyInfo.annualTurnover,
            exportCountries: companyInfo.exportCountries,
            manufacturerId: parseInt(id),
          },
        });
      }
    }

    // Update founders - delete existing and create new
    if (founders !== undefined) {
      await prisma.founder.deleteMany({
        where: { manufacturerId: parseInt(id) },
      });

      if (founders && founders.length > 0) {
        await prisma.founder.createMany({
          data: founders.map((/** @type {Founder} */ founder) => ({
            name: founder.name,
            experience: founder.experience,
            qualification: founder.qualification,
            manufacturerId: parseInt(id),
          })),
        });
      }
    }

    // Update specializations
    if (specializations !== undefined) {
      // Delete existing specializations
      await prisma.manufacturerSpecialization.deleteMany({
        where: { manufacturerId: parseInt(id) },
      });

      // Handle specializations
      let specsToAdd = specializations;
      if (typeof specsToAdd === 'string') {
        specsToAdd = specsToAdd.split(',').map(s => s.trim()).filter(s => s);
      }

      if (specsToAdd && specsToAdd.length > 0) {
        for (const specName of specsToAdd) {
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
              manufacturerId: parseInt(id),
              specializationId: specialization.id,
            },
          });
        }
      }
    }

    // Update achievements
    if (achievements !== undefined) {
      // Delete existing achievements
      await prisma.manufacturerAchievement.deleteMany({
        where: { manufacturerId: parseInt(id) },
      });

      // Handle achievements
      let achsToAdd = achievements;
      if (typeof achsToAdd === 'string') {
        achsToAdd = achsToAdd.split(',').map(s => s.trim()).filter(s => s);
      }

      if (achsToAdd && achsToAdd.length > 0) {
        for (const achName of achsToAdd) {
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
              manufacturerId: parseInt(id),
              achievementId: achievement.id,
            },
          });
        }
      }
    }

    // Update certifications
    if (certifications !== undefined) {
      // Delete existing certifications
      await prisma.manufacturerCertification.deleteMany({
        where: { manufacturerId: parseInt(id) },
      });

      // Handle certifications
      let certsToAdd = certifications;
      if (typeof certsToAdd === 'string') {
        certsToAdd = certsToAdd.split(',').map(s => s.trim()).filter(s => s);
      }

      if (certsToAdd && certsToAdd.length > 0) {
        for (const certName of certsToAdd) {
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
              manufacturerId: parseInt(id),
              certificationId: certification.id,
            },
          });
        }
      }
    }

    // Fetch updated manufacturer with all relations
    const updatedManufacturer = await prisma.manufacturer.findUnique({
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
        manufacturerProducts: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
        },
        _count: {
          select: {
            manufacturerProducts: true,
          },
        },
      },
    });

    if (!updatedManufacturer) {
      throw new Error('Manufacturer not found after update');
    }

    // Transform the response to match frontend expectations
    const result = {
      ...updatedManufacturer,
      id: updatedManufacturer.id.toString(),
      userId: updatedManufacturer.userId.toString(),
      specializationsList: updatedManufacturer?.specializations?.map(s => s?.specialization?.name).filter(Boolean) || [],
      achievementsList: updatedManufacturer?.achievements?.map(a => a?.achievement?.name).filter(Boolean) || [],
      certificationsList: updatedManufacturer?.certifications?.map(c => c?.certification?.name).filter(Boolean) || [],
      productsCount: updatedManufacturer?.manufacturerProducts?.length || 0,
      exportCountriesCount: updatedManufacturer?.companyInfo?.exportCountries || 0,
    };

    console.log('Manufacturer updated successfully');
    return result;

  } catch (error) {
    console.error('Error in updateManufacturer:', error);
    throw error;
  }
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
