// store/ordersStore.js
import { getCurrentUser } from '../lib/auth.js'

const STORAGE_KEY = 'rt_orders'

let orders = []
let nextOrderId = 1

// ----- Helpers -----
/**
 * Safely parse JSON string or return fallback
 */
const safeParse = (str, fallback) => {
  try {
    return JSON.parse(str)
  } catch (e) {
    return fallback
  }
}

/**
 * Persist orders and nextOrderId to localStorage
 */
const persist = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ orders, nextOrderId }))
  } catch (err) {
    console.error('Error saving orders to localStorage:', err)
  }
}

/**
 * Load orders from localStorage or use sample fallback
 */
const loadOrders = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = safeParse(stored, null)
      if (parsed) {
        orders = Array.isArray(parsed.orders) ? parsed.orders : []
        nextOrderId = typeof parsed.nextOrderId === 'number'
          ? parsed.nextOrderId
          : (orders.length ? Math.max(...orders.map(o => Number(o.id))) + 1 : 1)
        return
      }
    }

    // Fallback sample data
    orders = [
      {
        id: 1,
        customerName: 'John Doe',
        userInfo: { id: 'user-1', name: 'John Doe' },
        items: [
          { name: 'Red Bricks', quantity: 1000, price: 50 },
          { name: 'Teak Wood Planks', quantity: 5, price: 1500 }
        ],
        totalAmount: 1000 * 50 + 5 * 1500, // 57500
        status: 'pending',
        orderDate: '2024-01-15T10:30:00Z',
        deliveryAddress: '123 Main St, Mumbai, Maharashtra',
        confirmedBy: null,
        assignedBy: null
      },
      {
        id: 2,
        customerName: 'Jane Smith',
        userInfo: { id: 'user-2', name: 'Jane Smith' },
        items: [{ name: 'River Sand', quantity: 10, price: 800 }],
        totalAmount: 10 * 800,
        status: 'confirmed',
        orderDate: '2024-01-14T14:20:00Z',
        deliveryAddress: '456 Oak Ave, Delhi, NCR',
        confirmedBy: { id: 'super-admin-1', role: 'superadmin' },
        assignedBy: null
      },
      {
        id: 3,
        customerName: 'Bob Johnson',
        userInfo: { id: 'user-3', name: 'Bob Johnson' },
        items: [
          { name: 'Red Bricks', quantity: 500, price: 50 },
          { name: 'River Sand', quantity: 5, price: 800 }
        ],
        totalAmount: 500 * 50 + 5 * 800,
        status: 'pending',
        orderDate: '2024-01-13T09:15:00Z',
        deliveryAddress: '789 Pine Rd, Bangalore, Karnataka',
        confirmedBy: null,
        assignedBy: { id: 'super-admin-1', role: 'superadmin' }
      }
    ]
    nextOrderId = 4
    persist()
  } catch (error) {
    console.error('Error loading orders from localStorage:', error)
    orders = []
    nextOrderId = 1
  }
}

// Initialize store
loadOrders()

// ----- Public API -----

/**
 * Return a deep copy of all orders
 */
export const getOrders = () => {
  return orders.map(o => ({ ...o, items: o.items ? o.items.map(i => ({ ...i })) : [] }))
}

/**
 * Add a new order
 * Accepts:
 * - Full order object with items array
 * - OR legacy single item object { name, quantity, price }
 */
export const addOrder = (orderData) => {
  const user = getCurrentUser()

  // Normalize items array
  const items = Array.isArray(orderData.items)
    ? orderData.items.map(it => ({
        name: String(it.name),
        quantity: Number(it.quantity) || 0,
        price: Number(it.price) || 0
      }))
    : [{
        name: String(orderData.name || orderData.itemName || 'Item'),
        quantity: Number(orderData.quantity) || 0,
        price: Number(orderData.price) || 0
      }]

      
  // Compute totalAmount if not provided
  const computedTotal = items.reduce((sum, it) => sum + it.quantity * it.price, 0)
  const totalAmount = typeof orderData.totalAmount === 'number' && orderData.totalAmount >= 0
    ? orderData.totalAmount
    : computedTotal

  const newOrder = {
    id: nextOrderId++,
    orderType: orderData.orderType || 'product',
    customerName: user?.name || orderData.customerName || 'Unknown User',
    userInfo: user ? { id: user.id, name: user.name, role: user.role, email: user.email } : (orderData.userInfo || null),
    items,
    totalAmount,
    status: orderData.status || 'pending',
    orderDate: orderData.orderDate || new Date().toISOString(),
    deliveryAddress: orderData.deliveryAddress || orderData.address || 'N/A',
    confirmedBy: orderData.confirmedBy || null,
    assignedBy: orderData.assignedBy || null,
    meta: orderData.meta || {}
  }

  orders.push(newOrder)
  persist()
  return { ...newOrder, items: newOrder.items.map(i => ({ ...i })) }
}

/**
 * Update order status
 */
export const updateOrderStatus = (orderId, newStatus) => {
  const idx = orders.findIndex(o => Number(o.id) === Number(orderId))
  if (idx === -1) return false
  orders[idx].status = newStatus
  persist()
  return true
}

/**
 * Update an order partially
 */
export const updateOrder = (orderId, patch = {}) => {
  const idx = orders.findIndex(o => Number(o.id) === Number(orderId))
  if (idx === -1) return null

  // Normalize items if provided
  if (Array.isArray(patch.items)) {
    patch.items = patch.items.map(it => ({
      name: String(it.name),
      quantity: Number(it.quantity) || 0,
      price: Number(it.price) || 0
    }))
    patch.totalAmount = patch.totalAmount ?? patch.items.reduce((s, it) => s + it.quantity * it.price, 0)
  }

  orders[idx] = { ...orders[idx], ...patch }
  persist()
  return { ...orders[idx], items: orders[idx].items.map(i => ({ ...i })) }
}

/**
 * Assign manufacturer to order
 */
export const assignManufacturer = (orderId, manufacturer) => {
  const idx = orders.findIndex(o => Number(o.id) === Number(orderId))
  if (idx === -1) return false

  orders[idx].assignedBy = { id: manufacturer.id, companyName: manufacturer.companyName }
  if (!orders[idx].status || orders[idx].status === 'pending') orders[idx].status = 'in_progress'
  persist()
  return true
}

/**
 * Assign truck owner to order
 */
export const assignTruckOwner = (orderId, truckOwner) => {
  const idx = orders.findIndex(o => Number(o.id) === Number(orderId))
  if (idx === -1) return false

  orders[idx].assignedTruckOwner = {
    id: truckOwner.id,
    name: truckOwner.name,
    companyName: truckOwner.companyName,
    phone: truckOwner.phone
  }
  if (orders[idx].status === 'confirmed') orders[idx].status = 'assigned'
  persist()
  return true
}

/**
 * Delete order
 */
export const deleteOrder = (orderId) => {
  const idNum = Number(orderId)
  orders = orders.filter(o => Number(o.id) !== idNum)
  persist()
}

/**
 * Get single order by ID
 */
export const getOrderById = (orderId) => {
  const order = orders.find(o => Number(o.id) === Number(orderId))
  return order ? { ...order, items: order.items.map(i => ({ ...i })) } : null
}
