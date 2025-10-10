const prisma = require('../../shared/lib/db.js');

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

  const unitPrice = parseFloat(product.priceRange.split('-')[0]) || 0; // Assume priceRange is "min-max"
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

const assignOrder = async (id, manufacturerId) => {
  return await prisma.order.update({
    where: { id },
    data: { manufacturerId: parseInt(manufacturerId), status: 'IN_PROGRESS' },
  });
};

const updateOrderStatus = async (id, status) => {
  return await prisma.order.update({
    where: { id },
    data: { status },
  });
};

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
