const { Router } = require('express');
const { createOrder, getAllOrders, getOrderById, assignOrder, updateOrderStatus, deleteOrder } = require('./order.service.js');

const router = Router();

// GET /api/orders - Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});


// GET /api/orders/:id - Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(serializeBigInt(order));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(serializeBigInt(order));
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// PUT /api/orders/:id/assign - Assign order to manufacturer
router.put('/:id/assign', async (req, res) => {
  try {
    const { manufacturerId } = req.body;
    const order = await assignOrder(req.params.id, manufacturerId);
    res.json(serializeBigInt(order));
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign order' });
  }
});

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    // Map frontend status to database enum
    const statusMap = {
      'confirmed': 'CONFIRMED',
      'rejected': 'CANCELLED',
      'pending': 'PENDING',
      'in_progress': 'IN_PROGRESS'
    };
    const dbStatus = statusMap[status] || status;
    const order = await updateOrderStatus(req.params.id, dbStatus);
    res.json(serializeBigInt(order));
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

// DELETE /api/orders/:id - Delete order
router.delete('/:id', async (req, res) => {
  try {
    await deleteOrder(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete order' });
  }
});

module.exports = router;
