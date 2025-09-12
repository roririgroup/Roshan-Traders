import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import { ShoppingCart, CheckCircle, Clock, Truck } from 'lucide-react'

export default function Orders() {
  const [orders, setOrders] = useState([])

  // Mock data - replace with API calls
  useEffect(() => {
    setOrders([
      {
        id: 1,
        customerName: 'John Doe',
        items: [
          { name: 'Wireless Headphones', quantity: 1, price: 2999 },
          { name: 'Bluetooth Speaker', quantity: 2, price: 1999 }
        ],
        totalAmount: 6997,
        status: 'pending',
        orderDate: '2024-01-15T10:30:00Z',
        deliveryAddress: '123 Main St, Mumbai, Maharashtra'
      },
      {
        id: 2,
        customerName: 'Jane Smith',
        items: [
          { name: 'Smart Watch', quantity: 1, price: 4999 }
        ],
        totalAmount: 4999,
        status: 'confirmed',
        orderDate: '2024-01-14T14:20:00Z',
        deliveryAddress: '456 Oak Ave, Delhi, NCR'
      },
      {
        id: 3,
        customerName: 'Bob Johnson',
        items: [
          { name: 'Wireless Headphones', quantity: 1, price: 2999 },
          { name: 'Smart Watch', quantity: 1, price: 4999 }
        ],
        totalAmount: 7998,
        status: 'pending',
        orderDate: '2024-01-13T09:15:00Z',
        deliveryAddress: '789 Pine Rd, Bangalore, Karnataka'
      }
    ])
  }, [])

  const handleConfirmOrder = (orderId) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, status: 'confirmed' }
        : order
    ))
    // API call to confirm order
    console.log('Confirmed order:', orderId)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="size-4 text-yellow-600" />
      case 'confirmed':
        return <CheckCircle className="size-4 text-green-600" />
      case 'shipped':
        return <Truck className="size-4 text-blue-600" />
      default:
        return <Clock className="size-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>
      case 'confirmed':
        return <Badge variant="success">Confirmed</Badge>
      case 'shipped':
        return <Badge variant="info">Shipped</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <ShoppingCart className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
            <p className="text-slate-600">Manage customer orders and track their status</p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Order #{order.id}
                  </h3>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-sm text-slate-600">
                  Customer: {order.customerName}
                </p>
                <p className="text-sm text-slate-600">
                  Ordered on: {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-slate-900">
                  ₹{order.totalAmount.toLocaleString()}
                </p>
                <p className="text-sm text-slate-600">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-4">
              <h4 className="font-medium text-slate-900 mb-2">Items:</h4>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-slate-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="mb-4">
              <h4 className="font-medium text-slate-900 mb-1">Delivery Address:</h4>
              <p className="text-sm text-slate-600">{order.deliveryAddress}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                <span className="text-sm text-slate-600 capitalize">
                  {order.status}
                </span>
              </div>
              {order.status === 'pending' && (
                <Button
                  onClick={() => handleConfirmOrder(order.id)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="size-4 mr-2" />
                  Confirm Order
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="size-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No orders yet</h3>
          <p className="text-slate-600">Orders will appear here once customers place them</p>
        </div>
      )}
    </div>
  )
}
