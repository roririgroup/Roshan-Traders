const prisma = require('../../shared/lib/db.js');

/**
 * @param {Object} payload
 * @param {string} payload.customerName
 * @param {string} payload.phoneNumber
 * @param {string} payload.deliveryAddress
 * @param {number} payload.quantity
 * @param {string} payload.estimatedDeliveryDate
 * @param {string} payload.productId
 */
const createOrder = async (payload) => {
  const {
    customerName,
    phoneNumber,
    deliveryAddress,
    quantity,
    estimatedDeliveryDate,
    productId,
  } = payload;

  // Fetch product to get unitPrice
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  // Handle priceRange - extract first price from range or use default
  let unitPrice = 0;
  if (product.priceRange) {
    const priceParts = product.priceRange.split('-');
    unitPrice = parseFloat(priceParts[0].trim()) || 0;
  }

  const totalAmount = quantity * unitPrice;

  // Create order
  const order = await prisma.order.create({
    data: {
      id: Math.random().toString(36).substr(2, 9),
      customerName,
      customerEmail: null, // Not provided in form
      orderDate: new Date(),
      status: 'PENDING',
      totalAmount,
      deliveryAddress,
      notes: '',
      manufacturerId: null, // Assigned later
    },
  });

  // Create order item
  await prisma.orderItem.create({
    data: {
      productId,
      orderId: order.id,
      quantity,
      unitPrice,
      totalPrice: totalAmount,
    },
  });

  return order;
};

const getAllOrders = async () => {
  return await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
      manufacturer: true,
    },
    orderBy: { orderDate: 'desc' },
  });
};

/**
 * @param {string} id
 */
const getOrderById = async (id) => {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      manufacturer: true,
    },
  });
};

/**
 * @param {string} id
 * @param {string} manufacturerId
 */
const assignOrder = async (id, manufacturerId) => {
  return await prisma.order.update({
    where: { id },
    data: { manufacturerId: parseInt(manufacturerId), status: 'IN_PROGRESS' },
  });
};

/**
 * @param {string} id
 * @param {'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'} status
 */
const updateOrderStatus = async (id, status) => {
  return await prisma.order.update({
    where: { id },
    data: { status },
  });
};

/**
 * @param {string} id
 */
const deleteOrder = async (id) => {
  // Delete order items first
  await prisma.orderItem.deleteMany({
    where: { orderId: id },
  });

  return await prisma.order.delete({
    where: { id },
  });
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  assignOrder,
  updateOrderStatus,
  deleteOrder,
};
