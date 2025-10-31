import { useState, useEffect } from 'react'
import Badge from '../../../components/ui/Badge.jsx'
import { ShoppingCart, UserPlus } from 'lucide-react'
import NotificationContainer from '../../../components/ui/NotificationContainer.jsx'
import OrderDetailsModal from '../../../components/ui/OrderDetailsModal.jsx'
import { useNotifications } from '../../../lib/notifications.jsx'
import FilterBar from '../../../components/ui/FilterBar.jsx'
import { getCurrentUser, isSuperAdmin } from '../../../lib/auth.js'
import Modal from '../../../components/ui/Modal.jsx'

const API_BASE_URL = 'http://localhost:7700/api'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [manufacturers, setManufacturers] = useState([])
  const [products, setProducts] = useState([])
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [selectedOrderForAssign, setSelectedOrderForAssign] = useState(null)
  const [selectedManufacturer, setSelectedManufacturer] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')
  const [activeTab, setActiveTab] = useState('your-orders')
  const [manufacturersLoading, setManufacturersLoading] = useState(true)
  const [manufacturersError, setManufacturersError] = useState(null)

  const { notifications, removeNotification, showSuccessNotification, showErrorNotification } = useNotifications()

  // Load orders from backend API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders`)
        if (response.ok) {
          const backendOrders = await response.json()
          
          // Transform backend data to frontend format
          const transformedOrders = backendOrders.map(order => ({
            ...order,
            status: order.status.toLowerCase(),
            items: order.items?.map(item => ({
              name: item.product?.name || 'Unknown Product',
              quantity: item.quantity,
              price: item.unitPrice
            })) || [],
            manufacturerName: order.manufacturer ? order.manufacturer.companyName : null,
            orderDate: order.orderDate,
            deliveryDate: order.deliveryDate,
            estimatedDeliveryDate: order.estimatedDeliveryDate
          }))

          setOrders(transformedOrders)
        } else {
          console.error('Failed to fetch orders')
          showErrorNotification('Failed to load orders data')
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        showErrorNotification('Error loading orders data')
      }
    }

    fetchOrders()
  }, [refreshTrigger])

  // Auto-refresh periodically to check for updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Fetch manufacturers from backend - FIXED VERSION
  useEffect(() => {
    const fetchManufacturers = async () => {
      setManufacturersLoading(true)
      setManufacturersError(null)
      
      try {
        console.log('Fetching manufacturers from:', `${API_BASE_URL}/manufacturers`)
        const response = await fetch(`${API_BASE_URL}/manufacturers`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const manufacturersData = await response.json()
        console.log('Raw manufacturers data:', manufacturersData)
        
        if (!Array.isArray(manufacturersData)) {
          throw new Error('Manufacturers data is not an array')
        }

        if (manufacturersData.length === 0) {
          console.warn('No manufacturers found in database')
          setManufacturers([])
          return
        }

        // More flexible data transformation
        const transformedManufacturers = manufacturersData.map(manufacturer => ({
          id: manufacturer.id || manufacturer._id,
          companyName: manufacturer.companyName || manufacturer.name || 'Unknown Company',
          stock: manufacturer.stock || manufacturer.availableStock || 0,
          category: manufacturer.category || 'bricks',
          productType: manufacturer.productType || manufacturer.type || 'All Types',
          email: manufacturer.email || '',
          phone: manufacturer.phone || '',
          address: manufacturer.address || ''
        }))

        console.log('Transformed manufacturers:', transformedManufacturers)
        setManufacturers(transformedManufacturers)
        
      } catch (error) {
        console.error('Error fetching manufacturers:', error)
        setManufacturersError(error.message)
        showErrorNotification(`Failed to load manufacturers: ${error.message}`)
        setManufacturers([])
      } finally {
        setManufacturersLoading(false)
      }
    }

    fetchManufacturers()
  }, [])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products`)
        if (response.ok) {
          const data = await response.json()
          setProducts(Array.isArray(data) ? data : [])
        } else {
          console.error('Failed to fetch products')
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      }
    }

    fetchProducts()
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus.toUpperCase() })
      })

      if (response.ok) {
        setRefreshTrigger(prev => prev + 1)
      } else {
        console.error('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
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
      const response = await fetch(`${API_BASE_URL}/orders/${selectedOrderForAssign.id}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ manufacturerId: selectedManufacturer })
      })

      if (response.ok) {
        setRefreshTrigger(prev => prev + 1);
        showSuccessNotification('Order assigned successfully!');
        setIsAssignModalOpen(false);
        setSelectedOrderForAssign(null);
        setSelectedManufacturer('');
        setSelectedProduct('');
      } else {
        showErrorNotification('Failed to assign order. Please try again.');
      }
    } catch (error) {
      console.error(error);
      showErrorNotification('Failed to assign order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
      if (isSuperAdmin()) {
        filtered = filtered.filter(order => !order.manufacturerName && order.status === 'pending')
      } else {
        filtered = filtered
      }
    } else if (activeTab === 'outsource') {
      filtered = filtered
    } else if (activeTab === 'confirm') {
      filtered = filtered.filter(order =>
        order.status === 'rejected'
      )
    }

    return filtered
  }

  const filteredOrders = getFilteredOrders()

  // Calculate order counts for tabs
  const user = getCurrentUser()
  const yourOrdersCount = orders.filter(order =>
    isSuperAdmin()
      ? !order.manufacturerName && order.status === 'pending'
      : true
  ).length
  const outsourceOrdersCount = orders.length
  const confirmOrdersCount = orders.filter(order =>
    order.status === 'rejected'
  ).length

  const renderManufacturerSelect = () => (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2 text-gray-700">
        Available Manufacturers
      </label>
      
      {manufacturersLoading ? (
        <div className="text-center py-4 text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2">Loading manufacturers...</p>
        </div>
      ) : manufacturersError ? (
        <div className="text-center py-4 text-red-600 bg-red-50 rounded-lg border border-red-200">
          <p>Failed to load manufacturers</p>
          <p className="text-sm text-red-500 mt-1">{manufacturersError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : manufacturers.length === 0 ? (
        <div className="text-center py-4 text-gray-500 bg-yellow-50 rounded-lg border border-yellow-200">
          <p>No manufacturers found in database</p>
          <p className="text-sm text-yellow-600 mt-1">
            Please check if manufacturers exist in your database
          </p>
        </div>
      ) : (
        <select
          value={selectedManufacturer}
          onChange={(e) => setSelectedManufacturer(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          disabled={!selectedProduct}
        >
          <option value="">Select Manufacturer</option>
          {selectedProduct && manufacturers
            .map((manufacturer) => (
              <option key={manufacturer.id} value={manufacturer.id}>
                {manufacturer.companyName} - {manufacturer.productType}
                {manufacturer.stock > 0 ? ` (Stock: ${manufacturer.stock})` : ' (No stock)'}
              </option>
            ))}
        </select>
      )}
    </div>
  )

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
              <th className="text-left py-4 px-6 font-medium text-slate-900">Items</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Total Amount</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Status</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Order Date</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Delivery Address</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Estimated Delivery Date</th>
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
                  {order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className="py-4 px-6 text-slate-600 group-hover:text-[#F08344] transition-colors">
                  {order.manufacturerName || 'Not Assigned'}
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
          setSelectedProduct('')
        }}
        title="Assign Order to Manufacturer"
      >
        <div className="p-6">
          {/* Product Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Select Product
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => {
                setSelectedProduct(e.target.value)
                setSelectedManufacturer('')
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.category}
                </option>
              ))}
            </select>
          </div>

          {/* Manufacturer Select */}
          {renderManufacturerSelect()}

          {/* Stock Display */}
          {selectedManufacturer && (
            <div className={`mb-4 p-4 rounded-lg border ${
              manufacturers.find(m => m.id === selectedManufacturer)?.category === 'bricks'
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
                setSelectedProduct('')
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
             Orders ({yourOrdersCount})
          </button>
          <button
            onClick={() => setActiveTab('outsource')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
              activeTab === 'outsource'
                ? 'bg-[#F08344] text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Confirm Orders ({outsourceOrdersCount})
          </button>
          <button
            onClick={() => setActiveTab('confirm')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
              activeTab === 'confirm'
                ? 'bg-[#F08344] text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Rejected Order ({confirmOrdersCount})
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
            renderOrderTable(filteredOrders, 'Rejected Orders')
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
              <ShoppingCart className="size-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No rejected orders yet</h3>
              <p className="text-slate-600">Rejected orders will appear here</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}