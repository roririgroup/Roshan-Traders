const prisma = require('../../shared/lib/db.js');


/**
 * @param {any} payload
 */
const createProduct = async (payload) => {
  const {
    name,
    category,
    priceRange,
    imageUrl,
    manufacturerId,
    qualityRating,
    offer,
    buyersCount,
    returnExchange,
    cashOnDelivery,
    paymentOptions,
    description,
  } = payload;

  // Generate unique ID using crypto for better uniqueness
  const crypto = require('crypto');
  const id = crypto.randomBytes(8).toString('hex');

  const productData = await prisma.product.create({
    data: {
      id,
      name,
      category: category || 'General',
      priceRange: priceRange || '0',
      imageUrl: imageUrl || '',
      manufacturerId: manufacturerId ? parseInt(manufacturerId) : null,
      qualityRating: qualityRating || 4.0,
      offer: offer || '',
      buyersCount: buyersCount || 0,
      returnExchange: returnExchange || false,
      cashOnDelivery: cashOnDelivery || false,
      paymentOptions: paymentOptions ? JSON.stringify(paymentOptions) : JSON.stringify([]),
      description: description || '',
    },
    include: {
      manufacturer: {
        select: {
          id: true,
          companyName: true,
        },
      },
    },
  });

  // Transform the response to match frontend expectations
  let parsedPaymentOptions = [];
  try {
    parsedPaymentOptions = JSON.parse(productData.paymentOptions || '[]');
  } catch (e) {
    parsedPaymentOptions = [];
  }
  
  return {
    ...productData,
    priceAmount: parseFloat(productData.priceRange) || 0,
    paymentOptions: parsedPaymentOptions,
  };
};

const getProducts = async () => {
  const products = await prisma.product.findMany({
    include: {
      manufacturer: {
        select: {
          id: true,
          companyName: true,
        },
      },
    },
  });

  // Transform the response to match frontend expectations
  return products.map(product => {
    let parsedPaymentOptions = [];
    try {
      parsedPaymentOptions = JSON.parse(product.paymentOptions || '[]');
    } catch (e) {
      parsedPaymentOptions = [];
    }
    
    return {
      ...product,
      priceAmount: parseFloat(product.priceRange) || 0,
      paymentOptions: parsedPaymentOptions,
      image: product.imageUrl, // Map imageUrl to image for frontend compatibility
    };
  });
};

/**

 * @param {string} userId
 */
const getProductsByManufacturer = async (userId) => {
  try {
    // Handle frontend user ID format (e.g., "user-1761891209076")
    let dbUserId;
    if (userId.startsWith('user-')) {
      // Extract numeric part for BigInt conversion
      const numericPart = userId.replace('user-', '');
      dbUserId = BigInt(numericPart);
    } else {
      // Assume it's already a valid BigInt string
      dbUserId = BigInt(userId);
    }

    // First get the manufacturer record using the user ID
    const manufacturer = await prisma.manufacturer.findUnique({
      where: { userId: dbUserId }
    });

    if (!manufacturer) {
      return [];
    }

    const products = await prisma.product.findMany({
      where: {
        manufacturerProducts: {
          some: {
            manufacturerId: manufacturer.id
          }
        }
      }
    });

    // Transform the response to match frontend expectations
    return products.map(product => {
      let parsedPaymentOptions = [];
      try {
        parsedPaymentOptions = JSON.parse(String(product.paymentOptions) || '[]');
      } catch (e) {
        parsedPaymentOptions = [];
      }

      return {
        ...product,
        priceAmount: parseFloat(String(product.priceRange || '0')) || 0,
        paymentOptions: parsedPaymentOptions,
        image: product.imageUrl, // Map imageUrl to image for frontend compatibility
        // Add frontend-compatible fields
        price: parseFloat(String(product.priceRange || '0')) || 0,
        description: product.description || '',
        inStock: product.isActive,
        stockQuantity: 0 // Default stock quantity since it's not in schema
      };
    });
  } catch (error) {
    console.error('Error fetching products by manufacturer:', error);
    return [];
  }
};
/**
 * @param {any} id
 */
const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      manufacturer: true,
      attributes: true,
      orderItems: {
        include: {
          order: true,
        },
      },
    },
  });

  if (!product) return null;

  // Transform the response to match frontend expectations
  let parsedPaymentOptions = [];
  try {
    parsedPaymentOptions = JSON.parse(product.paymentOptions || '[]');
  } catch (e) {
    parsedPaymentOptions = [];
  }
  
  return {
    ...product,
    priceAmount: parseFloat(product.priceRange) || 0,
    paymentOptions: parsedPaymentOptions,
    image: product.imageUrl, // Map imageUrl to image for frontend compatibility
  };
};

const updateProduct = async (id, payload) => {
  const {
    name,
    category,
    priceRange,
    imageUrl,
    manufacturerId,
    qualityRating,
    offer,
    buyersCount,
    returnExchange,
    cashOnDelivery,
    paymentOptions,
    description,
  } = payload;

  const productData = await prisma.product.update({
    where: { id },
    data: {
      name,
      category,
      priceRange: priceRange || '0',
      imageUrl: imageUrl || '',
      manufacturerId: manufacturerId ? parseInt(manufacturerId) : null,
      qualityRating,
      offer,
      buyersCount,
      returnExchange,
      cashOnDelivery,
      paymentOptions: paymentOptions ? JSON.stringify(paymentOptions) : JSON.stringify([]),
      description,
    },
    include: {
      manufacturer: {
        select: {
          id: true,
          companyName: true,
        },
      },
    },
  });

  // Transform the response to match frontend expectations
  let parsedPaymentOptions = [];
  try {
    parsedPaymentOptions = JSON.parse(productData.paymentOptions || '[]');
  } catch (e) {
    parsedPaymentOptions = [];
  }
  
  return {
    ...productData,
    priceAmount: parseFloat(productData.priceRange) || 0,
    paymentOptions: parsedPaymentOptions,
    image: productData.imageUrl, // Map imageUrl to image for frontend compatibility
  };
};

const deleteProduct = async (id) => {
  return await prisma.product.delete({
    where: { id },
  });
};

const searchProducts = async (query) => {
  const { name, category } = query;

  const whereClause = {};
  if (name || category) {
    whereClause.OR = [];
    if (name) {
      whereClause.OR.push({
        name: {
          contains: name,
          mode: 'insensitive',
        },
      });
    }
    if (category) {
      whereClause.OR.push({
        category: {
          contains: category,
          mode: 'insensitive',
        },
      });
    }
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      manufacturer: {
        select: {
          id: true,
          companyName: true,
        },
      },
    },
  });

  // Transform the response to match frontend expectations
  return products.map(product => {
    let parsedPaymentOptions = [];
    try {
      parsedPaymentOptions = JSON.parse(product.paymentOptions || '[]');
    } catch (e) {
      parsedPaymentOptions = [];
    }

    return {
      ...product,
      priceAmount: parseFloat(product.priceRange) || 0,
      paymentOptions: parsedPaymentOptions,
      image: product.imageUrl, // Map imageUrl to image for frontend compatibility
    };
  });
};

module.exports = {
  createProduct,
  getProducts,
  getProductsByManufacturer,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
};
