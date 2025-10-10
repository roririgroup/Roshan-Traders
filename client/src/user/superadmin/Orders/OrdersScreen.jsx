import { useState, useEffect } from 'react'
import Badge from '../../../components/ui/Badge.jsx'
import { ShoppingCart, UserPlus } from 'lucide-react'
import { getOrders, updateOrderStatus } from '../../../store/ordersStore.js'
import NotificationContainer from '../../../components/ui/NotificationContainer.jsx'
import OrderDetailsModal from '../../../components/ui/OrderDetailsModal.jsx'
import { useNotifications } from '../../../lib/notifications.jsx'
import FilterBar from '../../../components/ui/FilterBar.jsx'
import { getCurrentUser, isSuperAdmin } from '../../../lib/auth.js'
import Modal from '../../../components/ui/Modal.jsx'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [manufacturers, setManufacturers] = useState([])
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [selectedOrderForAssign, setSelectedOrderForAssign] = useState(null)
  const [selectedManufacturer, setSelectedManufacturer] = useState('')

  const { notifications, removeNotification, showSuccessNotification, showErrorNotification } = useNotifications()

  // Load orders from shared store
  useEffect(() => {
    const allOrders = getOrders()
    const user = getCurrentUser()
    if (isSuperAdmin()) {
      // Super Admin sees all orders
      setOrders(allOrders)
    } else {
      // Others see only their own orders
      setOrders(allOrders.filter(order => order.userInfo && order.userInfo.id === user?.id))
    }
  }, [refreshTrigger])

  // Auto-refresh periodically to check for updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Fetch manufacturers
  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const response = await fetch('/api/users/manufacturers')
        if (response.ok) {
          const data = await response.json()
          setManufacturers(data)
        }
      } catch (error) {
        console.error('Failed to fetch manufacturers:', error)
      }
    }

    fetchManufacturers()
  }, [])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>
      case 'in_progress':
        return <Badge variant="info">In Progress</Badge>
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

  const handleAssignOrder = async () => {
    if (!selectedOrderForAssign || !selectedManufacturer) return

    setIsLoading(true)
    try {
      // Call API to assign order to manufacturer
      const response = await fetch(`/api/orders/${selectedOrderForAssign.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ manufacturerId: parseInt(selectedManufacturer) }),
      })

      if (!response.ok) {
        throw new Error('Failed to assign order')
      }

      setRefreshTrigger(prev => prev + 1)
      showSuccessNotification('Order assigned successfully!')
      setIsAssignModalOpen(false)
      setSelectedOrderForAssign(null)
      setSelectedManufacturer('')
    } catch (error) {
      showErrorNotification('Failed to assign order. Please try again.')
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
              <th className="text-left py-4 px-6 font-medium text-slate-900">Order BY</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Items</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Total Amount</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Status</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Order Date</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Delivery Address</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Manufacturer</th>
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
                <td className="py-4 px-6 font-medium text-slate-900 group-hover:text-[#F08344] transition-colors">
                  #{order.id}
                </td>
                <td className="py-4 px-6 text-slate-900 group-hover:text-[#F08344] transition-colors">
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
                <td className="py-4 px-6 font-medium text-slate-900 group-hover:text-[#F08344] transition-colors">
                  ₹{order.totalAmount.toLocaleString()}
                </td>
                <td className="py-4 px-6">
                  {getStatusBadge(order.status)}
                </td>
                <td className="py-4 px-6 text-slate-600 group-hover:text-[#F08344] transition-colors">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="py-4 px-6 text-slate-600 max-w-xs truncate group-hover:text-[#F08344] transition-colors">
                  {order.deliveryAddress}
                </td>
                <td className="py-4 px-6 text-slate-600 group-hover:text-[#F08344] transition-colors">
                  {order.manufacturer ? order.manufacturer.companyName : 'Not Assigned'}
                </td>
                <td className="py-4 px-6">
                  {!order.manufacturer && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedOrderForAssign(order)
                        setIsAssignModalOpen(true)
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <UserPlus className="size-3" />
                      Assign
                    </button>
                  )}
                  {order.status === 'in_progress' && order.manufacturer && (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleConfirmOrder(order.id)
                        }}
                        className="px-3 py-1 bg-[#F08344] text-white rounded-lg text-sm hover:bg-[#e0763a] transition-colors cursor-pointer"
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

      {/* Assign Order Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false)
          setSelectedOrderForAssign(null)
          setSelectedManufacturer('')
        }}
        title="Assign Order to Manufacturer"
      >
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Order #{selectedOrderForAssign?.id}</h3>
            <p className="text-gray-600">Select a manufacturer to assign this order to.</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Manufacturer</label>
            <select
              value={selectedManufacturer}
              onChange={(e) => setSelectedManufacturer(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Manufacturer</option>
              {manufacturers.map((manufacturer) => (
                <option key={manufacturer.id} value={manufacturer.id}>
                  {manufacturer.companyName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setIsAssignModalOpen(false)
                setSelectedOrderForAssign(null)
                setSelectedManufacturer('')
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleAssignOrder}
              disabled={!selectedManufacturer || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Assigning...' : 'Assign Order'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#F08344] rounded-lg flex items-center justify-center">
            <ShoppingCart className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
            <p className="text-slate-600">Manage customer orders and track their status</p>
          </div>
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
            { value: 'in_progress', label: 'In Progress' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'shipped', label: 'Shipped' },
            { value: 'rejected', label: 'Rejected' },
          ]
        }]}
      />

      {/* Orders Table */}
      {renderOrderTable(
        orders
          .filter(o => (
            o.customerName.toLowerCase().includes(search.toLowerCase()) ||
            String(o.id).includes(search)
          ))
          .filter(o => statusFilter === 'all' ? true : o.status === statusFilter)
        , 'Orders')}

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


