import { getCurrentUser } from '../lib/auth.js'

const STORAGE_KEY = 'rt_orders'

let orders = []
let nextOrderId = 1

// Load orders from localStorage on initialization
const loadOrders = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      orders = parsed.orders || []
      nextOrderId = parsed.nextOrderId || 1
    } else {
      // Initialize with sample data if no stored orders
      orders = [
        {
          id: 1,
          customerName: 'John Doe',
          items: [
            { name: 'Red Bricks', quantity: 1000, price: 50 },
            { name: 'Teak Wood Planks', quantity: 5, price: 1500 }
          ],
          totalAmount: 57500,
          status: 'pending',
          orderDate: '2024-01-15T10:30:00Z',
          deliveryAddress: '123 Main St, Mumbai, Maharashtra',
          confirmedBy: null,
          assignedBy: null
        },
        {
          id: 2,
          customerName: 'Jane Smith',
          items: [
            { name: 'River Sand', quantity: 10, price: 800 }
          ],
          totalAmount: 8000,
          status: 'confirmed',
          orderDate: '2024-01-14T14:20:00Z',
          deliveryAddress: '456 Oak Ave, Delhi, NCR',
          confirmedBy: { id: 'super-admin-1', role: 'superadmin' },
          assignedBy: null
        },
        {
          id: 3,
          customerName: 'Bob Johnson',
          items: [
            { name: 'Red Bricks', quantity: 500, price: 50 },
            { name: 'River Sand', quantity: 5, price: 800 }
          ],
          totalAmount: 29000,
          status: 'pending',
          orderDate: '2024-01-13T09:15:00Z',
          deliveryAddress: '789 Pine Rd, Bangalore, Karnataka',
          confirmedBy: null,
          assignedBy: { id: 'super-admin-1', role: 'superadmin' }
        }
      ]
      nextOrderId = 4
    }
  } catch (error) {
    console.error('Error loading orders from localStorage:', error)
    // Fallback to empty array
    orders = []
    nextOrderId = 1
  }
}

// Save orders to localStorage
const saveOrders = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ orders, nextOrderId }))
  } catch (error) {
    console.error('Error saving orders to localStorage:', error)
  }
}

// Initialize on module load
loadOrders()

export const getOrders = () => {
  return [...orders]
}

export const addOrder = (orderData) => {
  const user = getCurrentUser()
  const newOrder = {
    id: nextOrderId++,
    customerName: user ? user.name : 'Unknown User',
    userInfo: user ? { id: user.id, role: user.role, email: user.email, phone: user.phone } : null,
    items: [orderData],
    totalAmount: orderData.quantity * orderData.price,
    status: 'pending',
    orderDate: new Date().toISOString(),
    deliveryAddress: 'Default Address', // In a real app, this would come from user profile
    confirmedBy: null,
    assignedBy: user?.role === 'superadmin' ? { id: user.id, role: user.role } : null
  }
  orders.push(newOrder)
  saveOrders()
  return newOrder
}

export const updateOrderStatus = (orderId, newStatus) => {
  const orderIndex = orders.findIndex(order => order.id === orderId)
  if (orderIndex !== -1) {
    orders[orderIndex].status = newStatus
    saveOrders()
  }
}

export const deleteOrder = (orderId) => {
  orders = orders.filter(order => order.id !== orderId)
  saveOrders()
}
