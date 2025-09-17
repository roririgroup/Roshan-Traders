import { useState, useEffect } from 'react'
import Badge from '../../../components/ui/Badge'
import { ShoppingCart, CheckCircle, Clock, Truck, ExternalLink } from 'lucide-react'
import { getOrders, updateOrderStatus } from '../../../store/ordersStore'
import NotificationContainer from '../../../components/ui/NotificationContainer'
import OrderDetailsModal from '../../../components/ui/OrderDetailsModal'
import { useNotifications } from '../../../lib/notifications.jsx'
import FilterBar from '../../../components/ui/FilterBar'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [outsourceOrders, setOutsourceOrders] = useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [activeTab, setActiveTab] = useState('orders')
  const [newOutsourceOrder, setNewOutsourceOrder] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  const { notifications, removeNotification, showOrderNotification, showSuccessNotification, showErrorNotification } = useNotifications()

  // Load orders from shared store
  useEffect(() => {
    const allOrders = getOrders()
    // Separate orders: assume orders placed by manufacture are "Orders", others are "Outsource Orders"
    setOrders(allOrders.filter(order => order.customerName === 'Current Agent'))
    setOutsourceOrders(allOrders.filter(order => order.customerName !== 'Current Agent'))
  }, [refreshTrigger])

  // Auto-refresh every 5 seconds to check for new orders
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Simulate new outsource order arrival
  useEffect(() => {
    const checkForNewOrders = () => {
      const allOrders = getOrders()
      const externalOrders = allOrders.filter(order => order.customerName !== 'Current Agent')
      if (externalOrders.length > outsourceOrders.length) {
        setNewOutsourceOrder(true)
        // Show notification for new orders
        const newOrders = externalOrders.slice(outsourceOrders.length)
        newOrders.forEach(order => {
          showOrderNotification(order)
        })
        setTimeout(() => setNewOutsourceOrder(false), 5000) // Hide notification after 5 seconds
      }
      setOutsourceOrders(externalOrders)
    }

    const interval = setInterval(checkForNewOrders, 10000) // Check every 10 seconds
    return () => clearInterval(interval)
    }, [outsourceOrders.length, showOrderNotification])

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

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus)
    setRefreshTrigger(prev => prev + 1)
  }

  const handleNotificationClick = (notificationId) => {
    const notification = notifications.find(n => n.id === notificationId)
    if (notification && notification.order) {
      setSelectedOrder(notification.order)
      setIsOrderModalOpen(true)
      removeNotification(notificationId)
    }
  }

  const handleOrderClick = (order) => {
    setSelectedOrder(order)
    setIsOrderModalOpen(true)
  }

  const handleConfirmOrder = async (orderId) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      updateOrderStatus(orderId, 'confirmed')
      setRefreshTrigger(prev => prev + 1)
      showSuccessNotification('Order confirmed successfully!')
      setIsOrderModalOpen(false)
      setSelectedOrder(null)
    } catch (error) {
      showErrorNotification('Failed to confirm order. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectOrder = async (orderId) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      updateOrderStatus(orderId, 'rejected')
      setRefreshTrigger(prev => prev + 1)
      showSuccessNotification('Order rejected successfully!')
      setIsOrderModalOpen(false)
      setSelectedOrder(null)
    } catch (error) {
      showErrorNotification('Failed to reject order. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderOrderTable = (orderList, title) => (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Order ID</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Customer</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Items</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Total Amount</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Status</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Order Date</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Delivery Address</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orderList.map((order) => (
              <tr 
                key={order.id} 
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors  group"
                onClick={() => handleOrderClick(order)}
              >
                <td className="py-4 px-6 font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                  #{order.id}
                </td>
                <td className="py-4 px-6 text-slate-900 group-hover:text-blue-600 transition-colors">
                  {order.customerName}
                </td>
                <td className="py-4 px-6">
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium text-slate-900">{item.name}</span>
                        <span className="text-slate-600"> (Qty: {item.quantity})</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-6 font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                  ₹{order.totalAmount.toLocaleString()}
                </td>
                <td className="py-4 px-6">
                  {getStatusBadge(order.status)}
                </td>
                <td className="py-4 px-6 text-slate-600 group-hover:text-blue-600 transition-colors">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="py-4 px-6 text-slate-600 max-w-xs truncate group-hover:text-blue-600 transition-colors">
                  {order.deliveryAddress}
                </td>
                <td className="py-4 px-6">
                  {order.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleConfirmOrder(order.id)
                        }}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors cursor-pointer"
                        disabled={isLoading}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRejectOrder(order.id)
                        }}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors cursor-pointer"
                        disabled={isLoading}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Notifications */}
      <NotificationContainer 
        notifications={notifications}
        onRemove={removeNotification}
        onNotificationClick={handleNotificationClick}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false)
          setSelectedOrder(null)
        }}
        order={selectedOrder}
        onConfirm={handleConfirmOrder}
        onReject={handleRejectOrder}
        isLoading={isLoading}
      />

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

        {/* New Outsource Order Notification */}
        {newOutsourceOrder && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 animate-bounce-in">
            <div className="flex items-center gap-2">
              <ExternalLink className="size-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">New outsource order received!</span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('outsource')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
              activeTab === 'outsource'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Outsource Orders ({outsourceOrders.length})
            {newOutsourceOrder && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search orders..."
        selects={[{
          name: 'status',
          value: statusFilter,
          onChange: setStatusFilter,
          options: [
            { value: 'all', label: 'All Status' },
            { value: 'pending', label: 'Pending' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'shipped', label: 'Shipped' },
            { value: 'rejected', label: 'Rejected' },
          ]
        }]}
      />

      {/* Orders Table */}
      {activeTab === 'orders' && renderOrderTable(
        orders
          .filter(o => (
            o.customerName.toLowerCase().includes(search.toLowerCase()) ||
            String(o.id).includes(search)
          ))
          .filter(o => statusFilter === 'all' ? true : o.status === statusFilter)
        , 'Orders')}

      {/* Outsource Orders Table */}
      {activeTab === 'outsource' && renderOrderTable(
        outsourceOrders
          .filter(o => (
            o.customerName.toLowerCase().includes(search.toLowerCase()) ||
            String(o.id).includes(search)
          ))
          .filter(o => statusFilter === 'all' ? true : o.status === statusFilter)
        , 'Outsource Orders')}

      {(activeTab === 'orders' && orders.length === 0) && (
        <div className="text-center py-12">
          <ShoppingCart className="size-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No orders yet</h3>
          <p className="text-slate-600">Orders will appear here once customers place them</p>
        </div>
      )}

      {(activeTab === 'outsource' && outsourceOrders.length === 0) && (
        <div className="text-center py-12">
          <ExternalLink className="size-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No outsource orders yet</h3>
          <p className="text-slate-600">Outsource orders will appear here</p>
        </div>
      )}
    </div>
  )
}
