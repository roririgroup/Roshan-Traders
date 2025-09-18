let orders = [
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
    deliveryAddress: '123 Main St, Mumbai, Maharashtra'
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
    deliveryAddress: '456 Oak Ave, Delhi, NCR'
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
    deliveryAddress: '789 Pine Rd, Bangalore, Karnataka'
  }
]

let nextOrderId = 4

export const getOrders = () => {
  return [...orders]
}

export const addOrder = (orderData) => {
  const newOrder = {
    id: nextOrderId++,
    customerName: 'Current Agent', // In a real app, this would come from user context
    items: [orderData],
    totalAmount: orderData.quantity * orderData.price,
    status: 'pending',
    orderDate: new Date().toISOString(),
    deliveryAddress: 'Default Address' // In a real app, this would come from user profile
  }
  orders.push(newOrder)
  return newOrder
}

export const updateOrderStatus = (orderId, newStatus) => {
  const orderIndex = orders.findIndex(order => order.id === orderId)
  if (orderIndex !== -1) {
    orders[orderIndex].status = newStatus
  }
}

export const deleteOrder = (orderId) => {
  orders = orders.filter(order => order.id !== orderId)
}
