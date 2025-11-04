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

<<<<<<< HEAD
=======
const API_BASE_URL = 'http://localhost:7700/api'


>>>>>>> c9f10485ce667d750f74ff46fc726fc7d1982858
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
  const [selectedCategory, setSelectedCategory] = useState('bricks')
  const [activeTab, setActiveTab] = useState('your-orders')

  const { notifications, removeNotification, showSuccessNotification, showErrorNotification } = useNotifications()

  // Mock manufacturers data for both bricks and clay roofs
  const mockManufacturers = [
    // Brick Manufacturers
    { id: '1', companyName: 'Sujin Bricks', stock: 50000, category: 'bricks', productType: 'Full & Half Bricks' },
    { id: '2', companyName: 'Rajesh Brickworks', stock: 32000, category: 'bricks', productType: 'All Types of Bricks' },
    { id: '3', companyName: 'Anand Constructions', stock: 120000, category: 'bricks', productType: 'Hollow & Solid Bricks' },
    
    // Clay Roof Manufacturers
    { id: '4', companyName: 'Clay Masters', stock: 450, category: 'clay_roof', productType: 'Classic Clay Tiles' },
    { id: '5', companyName: 'Roof Experts', stock: 320, category: 'clay_roof', productType: 'Modern Shingles' },
    { id: '6', companyName: 'Heritage Roofing', stock: 180, category: 'clay_roof', productType: 'Spanish Style Tiles' },
    { id: '7', companyName: 'Premium Roofs', stock: 600, category: 'clay_roof', productType: 'All Clay Roof Types' }
  ]

  // Load orders from shared store AND localStorage manufacturer orders
 useEffect(() => {
  const allOrders = getOrders()
  const user = getCurrentUser()
  
  // Get assigned orders from localStorage
  const manufacturerOrders = JSON.parse(localStorage.getItem('manufacturerOrders')) || []

  // Get agent orders from localStorage
  const agentOrders = JSON.parse(localStorage.getItem('agentOrders')) || []

  // Combine all orders: store + manufacturer + agent
  const combinedOrders = [...allOrders, ...manufacturerOrders, ...agentOrders]
  
  // Remove duplicates based on order ID
  const uniqueOrders = combinedOrders.filter((order, index, self) =>
    index === self.findIndex((o) => o.id === order.id)
  )

  if (isSuperAdmin()) {
    // Super Admin sees all orders
    setOrders(uniqueOrders)
  } else {
    // Others see only their own orders
    setOrders(uniqueOrders.filter(order => order.userInfo && order.userInfo.id === user?.id))
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
        // First try to fetch from API
        const response = await fetch('/api/users/manufacturers')
        if (response.ok) {
          const data = await response.json()
          setManufacturers(data)
        } else {
          // If API fails, use mock data
          setManufacturers(mockManufacturers)
        }
      } catch (error) {
        console.error('Failed to fetch manufacturers, using mock data:', error)
        // Fallback to mock data
        setManufacturers(mockManufacturers)
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
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>
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
      handleStatusChange(orderId, 'confirmed')
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
      handleStatusChange(orderId, 'rejected')
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
    if (!selectedOrderForAssign || !selectedManufacturer) return;

    setIsLoading(true);
    try {
      // 1️⃣ Get all assigned orders from localStorage
      const existing = JSON.parse(localStorage.getItem('manufacturerOrders')) || [];

      // 2️⃣ Add manufacturer info to order
      const assignedOrder = {
        ...selectedOrderForAssign,
        manufacturerId: selectedManufacturer,
        manufacturerName: manufacturers.find(m => m.id === selectedManufacturer)?.companyName || 'Unknown Manufacturer',
        assignedAt: new Date().toISOString(),
        category: selectedCategory,
        status: 'in_progress',
      };

      // 3️⃣ Store back to localStorage
      localStorage.setItem('manufacturerOrders', JSON.stringify([...existing, assignedOrder]));

      // 4️⃣ Update status in main store if you want
      updateOrderStatus(selectedOrderForAssign.id, 'in_progress');

      // 5️⃣ UI + notification updates
      setRefreshTrigger(prev => prev + 1);
      showSuccessNotification('Order assigned successfully!');
      setIsAssignModalOpen(false);
      setSelectedOrderForAssign(null);
      setSelectedManufacturer('');
      setSelectedCategory('bricks');
    } catch (error) {
      console.error(error);
      showErrorNotification('Failed to assign order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter manufacturers by selected category
  const filteredManufacturers = manufacturers.filter(manufacturer => 
    manufacturer.category === selectedCategory
  )

  // Get orders based on active tab
  const getFilteredOrders = () => {
    const user = getCurrentUser()
    let filtered = orders.filter(order => {
      const matchesSearch = 
        order.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        String(order.id).includes(search) ||
        order.deliveryAddress?.toLowerCase().includes(search.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' ? true : order.status === statusFilter
      
      return matchesSearch && matchesStatus
    })

    // Apply tab-specific filtering
    if (activeTab === 'your-orders') {
      // For Super Admin: show all orders that are not assigned to manufacturers
      // For regular users: show their own orders
      if (isSuperAdmin()) {
        filtered = filtered.filter(order => !order.manufacturerId && !order.manufacturerName)
      } else {
        filtered = filtered.filter(order => order.userInfo && order.userInfo.id === user?.id)
      }
    } else if (activeTab === 'outsource') {
      // Show ALL orders from other users (customer orders)
      filtered = filtered.filter(order => 
        order.userInfo && order.userInfo.id !== user?.id
      )
    } else if (activeTab === 'confirm') {
      // Show orders that are assigned to manufacturers and in progress
      filtered = filtered.filter(order => 
        (order.manufacturerId || order.manufacturerName) && order.status === 'in_progress'
      )
    }

    return filtered
  }

  const filteredOrders = getFilteredOrders()

  // Calculate order counts for tabs
  const user = getCurrentUser()
  const yourOrdersCount = orders.filter(order => 
    isSuperAdmin() 
      ? !order.manufacturerId && !order.manufacturerName
      : order.userInfo && order.userInfo.id === user?.id
  ).length
  const outsourceOrdersCount = orders.filter(order => 
    order.userInfo && order.userInfo.id !== user?.id
  ).length
  const confirmOrdersCount = orders.filter(order => 
    (order.manufacturerId || order.manufacturerName) && order.status === 'in_progress'
  ).length

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
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors group cursor-pointer"
                onClick={() => handleOrderClick(order)}
              >
                <td className="py-4 px-6 font-medium text-slate-900 group-hover:text-[#F08344] transition-colors">
                  #{order.id}
                </td>
                <td className="py-4 px-6 text-slate-900 group-hover:text-[#F08344] transition-colors">
                  {order.customerName || order.userInfo?.name || 'N/A'}
                </td>
                <td className="py-4 px-6">
                  <div className="space-y-1">
                    {order.items?.map((item, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium text-slate-900">{item.name}</span>
                        <span className="text-slate-600"> (Qty: {item.quantity})</span>
                      </div>
                    )) || 'No items'}
                  </div>
                </td>
                <td className="py-4 px-6 font-medium text-slate-900 group-hover:text-[#F08344] transition-colors">
                  ₹{order.totalAmount?.toLocaleString() || '0'}
                </td>
                <td className="py-4 px-6">
                  {getStatusBadge(order.status)}
                </td>
                <td className="py-4 px-6 text-slate-600 group-hover:text-[#F08344] transition-colors">
                  {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className="py-4 px-6 text-slate-600 max-w-xs truncate group-hover:text-[#F08344] transition-colors">
                  {order.deliveryAddress || 'N/A'}
                </td>
                <td className="py-4 px-6 text-slate-600 group-hover:text-[#F08344] transition-colors">
                  {order.manufacturerName || order.manufacturer?.companyName || 'Not Assigned'}
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {/* Assign button - show ONLY in your-orders tab for pending orders without manufacturer */}
                    {isSuperAdmin() && activeTab === 'your-orders' && !order.manufacturerId && !order.manufacturerName && order.status === 'pending' && (
                      <button
                        onClick={() => {
                          setSelectedOrderForAssign(order)
                          setIsAssignModalOpen(true)
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <UserPlus className="size-3" />
                        Assign
                      </button>
                    )}
                    
                    {/* Confirm/Reject buttons - show ONLY in confirm tab for in_progress orders with manufacturer */}
                    {isSuperAdmin() && activeTab === 'confirm' && order.status === 'in_progress' && (order.manufacturerId || order.manufacturerName) && (
                      <>
                        <button
                          onClick={() => handleConfirmOrder(order.id)}
                          className="px-3 py-1 bg-[#F08344] text-white rounded-lg text-sm hover:bg-[#e0763a] transition-colors cursor-pointer"
                          disabled={isLoading}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleRejectOrder(order.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors cursor-pointer"
                          disabled={isLoading}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
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
          setSelectedCategory('bricks')
        }}
        title="Assign Order to Manufacturer"
      >
        <div className="p-6">
          {/* Product Category Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Product Category
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory('bricks')}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  selectedCategory === 'bricks'
                    ? 'bg-red-100 border-red-300 text-red-700 font-medium'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                🧱 Brick Products
              </button>
              <button
                onClick={() => setSelectedCategory('clay_roof')}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  selectedCategory === 'clay_roof'
                    ? 'bg-orange-100 border-orange-300 text-orange-700 font-medium'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                🏠 Clay Roof Products
              </button>
            </div>
          </div>

          {/* Manufacturer Select */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Manufacturer
            </label>
            <select
              value={selectedManufacturer}
              onChange={(e) => setSelectedManufacturer(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select Manufacturer</option>
              {filteredManufacturers.map((manufacturer) => (
                <option key={manufacturer.id} value={manufacturer.id}>
                  {manufacturer.companyName} - {manufacturer.productType}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Display */}
          {selectedManufacturer && (
            <div className={`mb-4 p-4 rounded-lg border ${
              selectedCategory === 'bricks' 
                ? 'bg-red-50 border-red-200' 
                : 'bg-orange-50 border-orange-200'
            }`}>
              {(() => {
                const selected = manufacturers.find(
                  (m) => m.id === selectedManufacturer
                )
                if (!selected) return null
                
                const orderQuantity = selectedOrderForAssign?.items?.reduce((total, item) => total + item.quantity, 0) || 0
                const hasSufficientStock = selected.stock >= orderQuantity
                
                return (
                  <div className="text-sm">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-gray-900">
                        {selected.companyName}
                      </p>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        selected.category === 'bricks' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {selected.category === 'bricks' ? 'Brick' : 'Clay Roof'} Manufacturer
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-1">
                      Product Type: <span className="font-medium">{selected.productType}</span>
                    </p>
                    
                    <p className="text-gray-700 mb-1">
                      Available Stock: <span className={`font-bold ${
                        hasSufficientStock ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selected.stock?.toLocaleString() || 0} {selected.category === 'bricks' ? 'bricks' : 'tiles'}
                      </span>
                    </p>
                    
                    {selectedOrderForAssign && (
                      <>
                        <p className="text-gray-700 mb-1">
                          Order Quantity: <span className="font-bold">
                            {orderQuantity} {selected.category === 'bricks' ? 'bricks' : 'tiles'}
                          </span>
                        </p>
                        
                        {!hasSufficientStock && (
                          <p className="text-red-600 text-xs mt-2 bg-red-50 p-2 rounded border border-red-200">
                            ⚠️ This manufacturer doesn't have sufficient stock to fulfill the entire order.
                          </p>
                        )}
                        
                        {hasSufficientStock && (
                          <p className="text-green-600 text-xs mt-2 bg-green-50 p-2 rounded border border-green-200">
                            ✓ Sufficient stock available for this order.
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )
              })()}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              onClick={() => {
                setIsAssignModalOpen(false)
                setSelectedOrderForAssign(null)
                setSelectedManufacturer('')
                setSelectedCategory('bricks')
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleAssignOrder}
              disabled={!selectedManufacturer || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
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

      {/* Outsource Tabs */}
      <div className="mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('your-orders')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'your-orders'
                ? 'bg-[#F08344] text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Your Orders ({yourOrdersCount})
          </button>
          <button
            onClick={() => setActiveTab('outsource')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
              activeTab === 'outsource'
                ? 'bg-[#F08344] text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Outsource Orders ({outsourceOrdersCount})
          </button>
          <button
            onClick={() => setActiveTab('confirm')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
              activeTab === 'confirm'
                ? 'bg-[#F08344] text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Confirm Order ({confirmOrdersCount})
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
            { value: 'in_progress', label: 'In Progress' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'shipped', label: 'Shipped' },
            { value: 'rejected', label: 'Rejected' },
          ]
        }]}
      />

      {/* Orders Count */}
      {filteredOrders.length > 0 && (
        <div className="mb-4 text-sm text-slate-600">
          Showing {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'your-orders' && (
        <>
          {filteredOrders.length > 0 ? (
            renderOrderTable(filteredOrders, 'Your Orders')
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
              <ShoppingCart className="size-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No orders yet</h3>
              <p className="text-slate-600">Orders you place from products will appear here</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'outsource' && (
        <>
          {filteredOrders.length > 0 ? (
            renderOrderTable(filteredOrders, 'Outsource Orders')
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
              <ShoppingCart className="size-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No outsource orders yet</h3>
              <p className="text-slate-600">Customer orders will appear here</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'confirm' && (
        <>
          {filteredOrders.length > 0 ? (
            renderOrderTable(filteredOrders, 'Orders to Confirm')
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
              <ShoppingCart className="size-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No orders to confirm yet</h3>
              <p className="text-slate-600">Assigned orders waiting for confirmation will appear here</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
