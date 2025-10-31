import { useState, useEffect } from 'react'
import { ShoppingCart, Star, Users, RotateCcw, Truck, CreditCard, Eye, CheckCircle, XCircle } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import { getCurrentUser } from '../../../lib/auth.js'
import { getOrders } from '../../../store/ordersStore.js'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Load orders from localStorage and main store
  useEffect(() => {
    loadOrders()
  }, [refreshTrigger])

  const loadOrders = () => {
    const agentOrders = JSON.parse(localStorage.getItem('agentOrders')) || []
    const mainOrders = getOrders()
    const user = getCurrentUser()


    
    // Combine and filter for current user
    const allOrders = [...agentOrders, ...mainOrders]
    const uniqueOrders = allOrders.filter((order, index, self) =>
      index === self.findIndex((o) => o.id === order.id)
    )

    setOrders(uniqueOrders.filter(order =>
      order.userInfo && order.userInfo.id === user?.id
    ))
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending</span>
      case 'confirmed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Confirmed</span>
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Rejected</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="size-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No orders yet</h3>
          <p className="text-slate-600">Orders you place will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-medium">{order.items?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold text-[#F08344]">₹{order.totalAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date:</span>
                    <span>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-[#F08344] hover:bg-[#e0733a] text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  onClick={() => handleViewOrder(order)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Order #${selectedOrder.id} Details`}
          className="max-w-2xl"
        >
          <div className="space-y-6">
            {/* Order Status */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Status:</span>
              {getStatusBadge(selectedOrder.status)}
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <p className="text-gray-900">{selectedOrder.customerName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <p className="text-gray-900">{selectedOrder.phoneNumber || 'N/A'}</p>
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
              <p className="text-gray-900">{selectedOrder.deliveryAddress}</p>
            </div>

            {/* Order Items */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Items</label>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">{item.name}</span>
                      <span className="text-gray-600 ml-2">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-medium text-[#F08344]">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-[#F08344]">₹{selectedOrder.totalAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                <span>Order Date:</span>
                <span>{selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleString() : 'N/A'}</span>
              </div>
              {selectedOrder.estimatedDeliveryDate && (
                <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                  <span>Estimated Delivery:</span>
                  <span>{new Date(selectedOrder.estimatedDeliveryDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Payment Info */}
            {selectedOrder.paymentMethod && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <p className="text-gray-900 capitalize">{selectedOrder.paymentMethod}</p>
                {selectedOrder.selectedPaymentOption && (
                  <p className="text-sm text-gray-600 mt-1">Option: {selectedOrder.selectedPaymentOption}</p>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
