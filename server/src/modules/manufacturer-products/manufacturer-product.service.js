const prisma = require('../../shared/lib/db.js');

/**
 * @typedef {Object} ManufacturerProductPayload
 * @property {string|number} manufacturerId - The manufacturer user ID
 * @property {string} name - Product name
 * @property {string} [category] - Product category
 * @property {string|number} priceRange - Price range
 * @property {string} [imageUrl] - Image URL
 * @property {string|number} [qualityRating] - Quality rating
 * @property {string} [offer] - Offer details
 * @property {string|number} [buyersCount] - Number of buyers
 * @property {boolean} [returnExchange] - Return/exchange policy
 * @property {boolean} [cashOnDelivery] - Cash on delivery option
 * @property {Array<any>} [paymentOptions] - Payment options
 * @property {string} [description] - Product description
 */

/**
 * @typedef {Object} UpdateManufacturerProductPayload
 * @property {string} [name] - Product name
 * @property {string} [category] - Product category
 * @property {string|number} [priceRange] - Price range
 * @property {string} [imageUrl] - Image URL
 * @property {string|number} [qualityRating] - Quality rating
 * @property {string} [offer] - Offer details
 * @property {string|number} [buyersCount] - Number of buyers
 * @property {boolean} [returnExchange] - Return/exchange policy
 * @property {boolean} [cashOnDelivery] - Cash on delivery option
 * @property {Array<any>} [paymentOptions] - Payment options
 * @property {string} [description] - Product description
 * @property {number} [stockQuantity] - Stock quantity
 * @property {number} [minOrderQuantity] - Minimum order quantity
 * @property {boolean} [isActive] - Active status
 */

/**
 * @typedef {Object} SearchManufacturerProductsQuery
 * @property {string} [name] - Product name to search
 * @property {string} [category] - Product category to search
 * @property {string|number} [minPrice] - Minimum price
 * @property {string|number} [maxPrice] - Maximum price
 */

/**
 * @typedef {Object} WhereClause
 * @property {bigint} manufacturerId
 * @property {Object} [name]
 * @property {Object} [category]
 * @property {PriceRangeFilter} [priceRange]
 */

/**
 * @typedef {Object} PriceRangeFilter
 * @property {string} [gte]
 * @property {string} [lte]
 */

/**
 * Create a new manufacturer product
 * @param {ManufacturerProductPayload} payload
 */
const createManufacturerProduct = async (payload) => {
  try {
    console.log('🟢 Received payload:', payload);

    const {
      manufacturerId, // User ID from frontend
      name,
      category,
      priceRange,
      imageUrl,
      qualityRating,
      offer,
      buyersCount,
      returnExchange,
      cashOnDelivery,
      paymentOptions,
      description
    } = payload;

    // ✅ Validate required fields
    if (!manufacturerId) throw new Error('Manufacturer userId is required.');
    if (!name?.trim()) throw new Error('Product name is required.');
    if (!priceRange) throw new Error('Price range is required.');

    // ✅ Ensure numeric or BigInt conversion where needed
    const userIdBigInt = BigInt(manufacturerId);

    // ✅ First, check if the user exists, create if not
    let user = await prisma.user.findUnique({
      where: { id: userIdBigInt },
    });

    if (!user) {
      console.log('User not found, creating default user for id:', manufacturerId);
      user = await prisma.user.create({
        data: {
          id: userIdBigInt,
          phoneNumber: `AUTO_${manufacturerId}`,
          countryCode: '+91',
          userType: 'MANUFACTURER',
          isVerified: true,
          isActive: true,
        },
      });
    }

    // ✅ Find the manufacturer linked to this user
    let manufacturer = await prisma.manufacturer.findUnique({
      where: { userId: userIdBigInt },
    });

    if (!manufacturer) {
      console.log('Manufacturer not found, creating default manufacturer for userId:', manufacturerId);
      manufacturer = await prisma.manufacturer.create({
        data: {
          userId: userIdBigInt,
          companyName: 'Default Company',
          businessType: 'General',
          isVerified: false,
          rating: 4.0,
        },
      });
    }

    console.log('👤 Manufacturer found with ID:', manufacturer.id);

    // ✅ Create the product safely
    const productData = await prisma.manufacturerProduct.create({
      data: {
        manufacturerId: BigInt(manufacturer.id),
        name: name.trim(),
        category: category || 'General',
        priceRange: priceRange.toString(),
        imageUrl: imageUrl || '',
        qualityRating: qualityRating ? parseFloat(String(qualityRating)) : 4.0,
        offer: offer || '',
        buyersCount: buyersCount ? parseInt(String(buyersCount)) : 0,
        returnExchange: !!returnExchange,
        cashOnDelivery: !!cashOnDelivery,
        paymentOptions: paymentOptions ? JSON.stringify(paymentOptions) : JSON.stringify([]),
        description: description || '',
        stockQuantity: 0,
        minOrderQuantity: 1,
        isActive: true,
      },
    });

    console.log('✅ Product created successfully with ID:', productData.id);

    // ✅ Parse and format response data
    let parsedPaymentOptions = [];
    try {
      parsedPaymentOptions = JSON.parse(String(productData.paymentOptions) || '[]');
    } catch {
      parsedPaymentOptions = [];
    }

    return {
      id: productData.id,
      manufacturerId: productData.manufacturerId.toString(),
      name: productData.name,
      category: productData.category,
      priceRange: productData.priceRange,
      imageUrl: productData.imageUrl,
      qualityRating: productData.qualityRating,
      offer: productData.offer,
      buyersCount: productData.buyersCount,
      returnExchange: productData.returnExchange,
      cashOnDelivery: productData.cashOnDelivery,
      paymentOptions: parsedPaymentOptions,
      description: productData.description,
      stockQuantity: productData.stockQuantity,
      minOrderQuantity: productData.minOrderQuantity,
      isActive: productData.isActive,
      createdAt: productData.createdAt,
      updatedAt: productData.updatedAt,
      priceAmount: parseFloat(String(productData.priceRange || '0')) || 0,
      image: productData.imageUrl,
    };
  } catch (error) {
    console.error('❌ Error in createManufacturerProduct:', (error instanceof Error ? error.message : String(error)));
    throw error;
  }
};

/**
 * Get all manufacturer products for a specific manufacturer
 * @param {string|number} userId - The user ID (manufacturer user ID)
 */
const getManufacturerProducts = async (userId) => {
  // Find the manufacturer by user ID
  const manufacturer = await prisma.manufacturer.findUnique({
    where: { userId: BigInt(userId) },
  });

  if (!manufacturer) {
    return []; // No manufacturer found, return empty array
  }

  const products = await prisma.manufacturerProduct.findMany({
    where: { manufacturerId: manufacturer.id },
    orderBy: { createdAt: 'desc' },
  });

  // Format response data
  return products.map(product => {
    let parsedPaymentOptions = [];
    try {
      parsedPaymentOptions = JSON.parse(String(product.paymentOptions) || '[]');
    } catch {
      parsedPaymentOptions = [];
    }

    return {
      id: product.id,
      manufacturerId: product.manufacturerId.toString(),
      name: product.name,
      category: product.category,
      priceRange: product.priceRange,
      imageUrl: product.imageUrl,
      qualityRating: product.qualityRating,
      offer: product.offer,
      buyersCount: product.buyersCount,
      returnExchange: product.returnExchange,
      cashOnDelivery: product.cashOnDelivery,
      paymentOptions: parsedPaymentOptions,
      description: product.description,
      stockQuantity: product.stockQuantity,
      minOrderQuantity: product.minOrderQuantity,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      priceAmount: parseFloat(String(product.priceRange || '0')) || 0,
      image: product.imageUrl,
    };
  });
};

/**
 * Get manufacturer product by ID
 * @param {string} id
 */
const getManufacturerProductById = async (id) => {
  return prisma.manufacturerProduct.findUnique({
    where: { id },
  });
};

/**
 * Update manufacturer product by ID
 * @param {string} id
 * @param {UpdateManufacturerProductPayload} payload
 */
const updateManufacturerProduct = async (id, payload) => {
  const {
    name,
    category,
    priceRange,
    imageUrl,
    qualityRating,
    offer,
    buyersCount,
    returnExchange,
    cashOnDelivery,
    paymentOptions,
    description,
    stockQuantity,
    minOrderQuantity,
    isActive,
  } = payload;

  return prisma.manufacturerProduct.update({
    where: { id },
    data: {
      ...(name && { name: name.trim() }),
      ...(category && { category }),
      ...(priceRange && { priceRange: priceRange.toString() }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(qualityRating !== undefined && { qualityRating: parseFloat(String(qualityRating)) }),
      ...(offer !== undefined && { offer }),
      ...(buyersCount !== undefined && { buyersCount: parseInt(String(buyersCount)) }),
      ...(returnExchange !== undefined && { returnExchange: !!returnExchange }),
      ...(cashOnDelivery !== undefined && { cashOnDelivery: !!cashOnDelivery }),
      ...(paymentOptions && { paymentOptions: JSON.stringify(paymentOptions) }),
      ...(description !== undefined && { description }),
      ...(stockQuantity !== undefined && { stockQuantity: parseInt(String(stockQuantity)) }),
      ...(minOrderQuantity !== undefined && { minOrderQuantity: parseInt(String(minOrderQuantity)) }),
      ...(isActive !== undefined && { isActive: !!isActive }),
    },
  });
};

/**
 * Search manufacturer products
 * @param {string|number} manufacturerId
 * @param {SearchManufacturerProductsQuery} query
 */
const searchManufacturerProducts = async (manufacturerId, query) => {
  const { name, category, minPrice, maxPrice } = query;
  /** @type {WhereClause} */
  const where = {
    manufacturerId: BigInt(manufacturerId),
  };

  if (name) {
    where.name = {
      contains: name,
      mode: 'insensitive',
    };
  }

  if (category) {
    where.category = {
      contains: category,
      mode: 'insensitive',
    };
  }

  if (minPrice || maxPrice) {
    /** @type {PriceRangeFilter} */
    const priceFilter = {};
    if (minPrice) {
      priceFilter.gte = minPrice.toString();
    }
    if (maxPrice) {
      priceFilter.lte = maxPrice.toString();
    }
    where.priceRange = priceFilter;
  }

  return prisma.manufacturerProduct.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Delete manufacturer product by ID
 * @param {string} id
 */
const deleteManufacturerProduct = async (id) => {
  return prisma.manufacturerProduct.delete({
    where: { id },
  });
};

module.exports = {
  createManufacturerProduct,
  getManufacturerProducts,
  getManufacturerProductById,
  updateManufacturerProduct,
  searchManufacturerProducts,
  deleteManufacturerProduct,
};
