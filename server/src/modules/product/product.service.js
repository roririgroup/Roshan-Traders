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
      qualityRating: qualityRating || 4.0,
      offer: offer || '',
      buyersCount: buyersCount || 0,
      returnExchange: returnExchange || false,
      cashOnDelivery: cashOnDelivery || false,
      paymentOptions: paymentOptions ? JSON.stringify(paymentOptions) : JSON.stringify([]),
      description: description || '',
      isActive: true,
    },
  });

  // Transform the response to match frontend expectations
  let parsedPaymentOptions = [];
  try {
    parsedPaymentOptions = JSON.parse(String(productData.paymentOptions) || '[]');
  } catch (e) {
    parsedPaymentOptions = [];
  }

  return {
    ...productData,
    priceAmount: parseFloat(String(productData.priceRange || '0')) || 0,
    paymentOptions: parsedPaymentOptions,
  };
};

const getProducts = async () => {
  const products = await prisma.product.findMany();

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
  };
  });
};

/**
 * @param {any} id
 */
const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
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
    parsedPaymentOptions = JSON.parse(String(product.paymentOptions) || '[]');
  } catch (e) {
    parsedPaymentOptions = [];
  }

  return {
    ...product,
    priceAmount: parseFloat(String(product.priceRange || '0')) || 0,
    paymentOptions: parsedPaymentOptions,
    image: product.imageUrl, // Map imageUrl to image for frontend compatibility
  };
};

/**
 * @param {any} id
 * @param {any} payload
 */
const updateProduct = async (id, payload) => {
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
  } = payload;

  const productData = await prisma.product.update({
    where: { id },
    data: {
      name,
      category,
      priceRange: priceRange || '0',
      imageUrl: imageUrl || '',
      qualityRating,
      offer,
      buyersCount,
      returnExchange,
      cashOnDelivery,
      paymentOptions: paymentOptions ? JSON.stringify(paymentOptions) : JSON.stringify([]),
      description,
    },
  });

  // Transform the response to match frontend expectations
  let parsedPaymentOptions = [];
  try {
    parsedPaymentOptions = JSON.parse(String(productData.paymentOptions) || '[]');
  } catch (e) {
    parsedPaymentOptions = [];
  }

  return {
    ...productData,
    priceAmount: parseFloat(String(productData.priceRange || '0')) || 0,
    paymentOptions: parsedPaymentOptions,
    image: productData.imageUrl, // Map imageUrl to image for frontend compatibility
  };
};

/**
 * @param {any} id
 */
const deleteProduct = async (id) => {
  return await prisma.product.delete({
    where: { id },
  });
};

/**
 * @param {any} query
 */
const searchProducts = async (query) => {
  const { name, category } = query;

  const whereClause = {};
  if (name || category) {
    whereClause.OR = /** @type {any[]} */ ([]);
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
  };
  });
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
};
