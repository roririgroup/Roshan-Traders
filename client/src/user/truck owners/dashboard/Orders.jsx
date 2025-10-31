import React, { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/Card'
import { Truck, Package, MapPin, Calendar, DollarSign, User, CheckCircle, Clock } from 'lucide-react'
import Button from '../../../components/ui/Button'

const API_BASE_URL = 'http://localhost:7700/api'

export default function Orders() {
  const [assignedOrders, setAssignedOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock data - replace with API call
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('rt_user'));
        const response = await fetch(`${API_BASE_URL}/truck-owners/orders`, {
          headers: {
            'Content-Type': 'application/json',
            'X-Employee-Id': (user.employeeId || user.id).toString(),
            'X-User-Roles': user.role || 'Truck Owner'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }

        const data = await response.json()
        if (data.success) {
          setAssignedOrders(data.data)
        } else {
          throw new Error(data.message || 'Failed to fetch orders')
        }
      } catch (err) {
        setError(err.message)
        console.error('Error fetching orders:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-800'
      case 'IN_TRANSIT':
        return 'bg-yellow-100 text-yellow-800'
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleUpdateStatus = (orderId, newStatus) => {
    setAssignedOrders(orders =>
      orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    )
    // TODO: API call to update order status
  }

  if (loading) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Truck className="size-12 text-[#F08344] mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600">Loading assigned orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2 group">
          <div className="w-10 h-10 bg-[#F08344] rounded-lg flex items-center justify-center">
            <Package className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Assigned Orders</h1>
            <p className="text-slate-600">Manage orders assigned to you for delivery</p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {assignedOrders.length === 0 ? (
          <Card className="p-8 text-center">
            <Package className="size-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Assigned Orders</h3>
            <p className="text-slate-600">You don't have any orders assigned for delivery yet.</p>
          </Card>
        ) : (
          assignedOrders.map((order) => (
            <Card key={order.id} className="p-6 border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* Order Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Order #{order.id}</h3>
                      <p className="text-sm text-slate-600">From: {order.manufacturerName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-slate-500" />
                      <span className="text-sm text-slate-700">{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-slate-500" />
                      <span className="text-sm text-slate-700">{new Date(order.orderDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="size-4 text-slate-500" />
                      <span className="text-sm text-slate-700">₹{order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 mb-4">
                    <MapPin className="size-4 text-slate-500 mt-0.5" />
                    <span className="text-sm text-slate-700">{order.deliveryAddress}</span>
                  </div>

                  {/* Order Items */}
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-slate-900 mb-2">Items:</h4>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="text-sm text-slate-600">
                          {item.productName} - {item.quantity} units @ ₹{item.unitPrice}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 lg:min-w-[200px]">
                  {order.status === 'ASSIGNED' && (
                    <Button
                      onClick={() => handleUpdateStatus(order.id, 'IN_TRANSIT')}
                      className="bg-[#F08344] hover:bg-[#e0733a] w-full"
                    >
                      <Truck className="size-4 mr-2" />
                      Start Delivery
                    </Button>
                  )}

                  {order.status === 'IN_TRANSIT' && (
                    <Button
                      onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                      className="bg-green-600 hover:bg-green-700 w-full"
                    >
                      <CheckCircle className="size-4 mr-2" />
                      Mark Delivered
                    </Button>
                  )}

                  {order.status === 'DELIVERED' && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="size-4" />
                      <span className="text-sm font-medium">Delivered</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
