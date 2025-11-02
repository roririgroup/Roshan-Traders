import { useState, useEffect } from 'react'
import Badge from '../../../components/ui/Badge'
import { ShoppingCart, ExternalLink, Package, Star, Users, RotateCcw, CreditCard, X } from 'lucide-react'
import { getOrders, updateOrderStatus, addOrder, assignTruckOwner } from '../../../store/ordersStore'
import NotificationContainer from '../../../components/ui/NotificationContainer'
import OrderDetailsModal from '../../../components/ui/OrderDetailsModal'
import AssignOrderModal from '../../../components/ui/AssignOrderModal'
import { useNotifications } from '../../../lib/notifications.jsx'
import FilterBar from '../../../components/ui/FilterBar'
import { getCurrentUser } from '../../../lib/auth'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'


export default function Orders() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [outsourceOrders, setOutsourceOrders] = useState([])
  const [yourOrders, setYourOrders] = useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [activeTab, setActiveTab] = useState('products')
  const [newOutsourceOrder, setNewOutsourceOrder] = useState(false)
  const [lastSeenOrderCount, setLastSeenOrderCount] = useState(() => {
    const stored = localStorage.getItem('lastSeenOutsourceOrderCount')
    return stored ? parseInt(stored, 10) : 0
  })
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isOrderFormModalOpen, setIsOrderFormModalOpen] = useState(false)
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)
  const [orderFormData, setOrderFormData] = useState({
    customerName: '',
    phoneNumber: '',
    deliveryAddress: '',
    quantity: 1,
    estimatedDeliveryDate: '',
    paymentMethod: 'cash',
    selectedPaymentOption: ''
  })
  const [errors, setErrors] = useState({})
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [selectedOrderForAssign, setSelectedOrderForAssign] = useState(null)

  const { notifications, removeNotification, showOrderNotification, showSuccessNotification, showErrorNotification } = useNotifications()

// ✅ Load products from API
useEffect(() => {
  async function fetchProducts() {
    try {
      const response = await fetch('http://localhost:7700/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    }
  }

  fetchProducts();
}, []);



  // ✅ Load your orders from store
  useEffect(() => {
    const allOrders = getOrders()
    const user = getCurrentUser()

    const yourOrdersList = allOrders.filter(order =>
      order.userInfo?.id === user?.id
    )

    setYourOrders(yourOrdersList)
  }, [refreshTrigger])

  // ✅ Load outsource orders from API
  useEffect(() => {
    async function fetchOutsourceOrders() {
      try {
        const response = await fetch('http://localhost:7700/api/orders');
        const data = await response.json();
        const user = getCurrentUser()
        const outsourceOrdersList = data.filter(order =>
          order.manufacturerId !== user?.id
        ).map(order => ({
          ...order,
          status: order.status.toLowerCase(), // Normalize status to match frontend expectations
          items: order.items || [], // Ensure items array exists
          totalAmount: order.totalAmount || 0
        }))

        // Detect new orders and show notifications only if count increased from last seen
        if (outsourceOrdersList.length > lastSeenOrderCount) {
          setNewOutsourceOrder(true)
          const newOrders = outsourceOrdersList.slice(lastSeenOrderCount)
          newOrders.forEach(order => showOrderNotification(order))
          setTimeout(() => setNewOutsourceOrder(false), 5000)
        }

        setOutsourceOrders(outsourceOrdersList)
        setLastSeenOrderCount(outsourceOrdersList.length)
        localStorage.setItem('lastSeenOutsourceOrderCount', outsourceOrdersList.length.toString())
      } catch (error) {
        console.error('Failed to fetch outsource orders:', error);
        setOutsourceOrders([])
      }
    }

    fetchOutsourceOrders()
  }, [refreshTrigger, showOrderNotification, lastSeenOrderCount])

  // ✅ Auto-refresh orders every 60 seconds (further reduced to prevent blinking)
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1)
    }, 60000) // Changed to 60 seconds to prevent blinking
    return () => clearInterval(interval)
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
      const response = await fetch(`http://localhost:7700/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'confirmed' }),
      });

      if (!response.ok) {
        throw new Error('Failed to confirm order');
      }

      setRefreshTrigger(prev => prev + 1)
      showSuccessNotification('Order confirmed successfully!')
      setIsOrderModalOpen(false)
      setSelectedOrder(null)
    } catch (error) {
      console.error('Error confirming order:', error);
      showErrorNotification('Failed to confirm order. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectOrder = async (orderId) => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:7700/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject order');
      }

      setRefreshTrigger(prev => prev + 1)
      showSuccessNotification('Order rejected successfully!')
      setIsOrderModalOpen(false)
      setSelectedOrder(null)
    } catch (error) {
      console.error('Error rejecting order:', error);
      showErrorNotification('Failed to reject order. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  const handlePlaceOrderClick = () => {
    setIsProductModalOpen(false)
    setIsOrderFormModalOpen(true)
  }
  const handlePaymentOptionSelect = (paymentOption) => {
    setOrderFormData(prev => ({
      ...prev,
      selectedPaymentOption: paymentOption
    }));
  };
  const handlePaymentConfirm = () => {
    if (orderFormData.selectedPaymentOption) {
      setShowPaymentOptions(false);
    }
  };

  const handleAssignClick = (order) => {
    setIsAssignModalOpen(true)
    setSelectedOrderForAssign(order)
  };

  const handleAssignOrder = (orderId, truckOwner) => {
    assignTruckOwner(orderId, truckOwner)
    updateOrderStatus(orderId, 'in_progress')
    setRefreshTrigger(prev => prev + 1)
    showSuccessNotification('Order assigned successfully!')
    setIsAssignModalOpen(false)
    setSelectedOrderForAssign(null)
  };

  const handleTrackOrder = (orderId) => {
    showSuccessNotification('Tracking order... Order is in progress.')
  };
  const validateForm = () => {
    const newErrors = {}

    if (!orderFormData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required'
    } else if (orderFormData.customerName.trim().length < 2) {
      newErrors.customerName = 'Customer name must be at least 2 characters'
    }

    if (!orderFormData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    } else if (!/^\d{10}$/.test(orderFormData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Phone number must be 10 digits'
    }

    if (!orderFormData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required'
    } else if (orderFormData.deliveryAddress.trim().length < 10) {
      newErrors.deliveryAddress = 'Delivery address must be at least 10 characters'
    }

    if (!orderFormData.quantity || orderFormData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1'
    }

    if (!orderFormData.estimatedDeliveryDate) {
      newErrors.estimatedDeliveryDate = 'Estimated delivery date is required'
    } else {
      const selectedDate = new Date(orderFormData.estimatedDeliveryDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        newErrors.estimatedDeliveryDate = 'Delivery date cannot be in the past'
      }
    }

    if (!orderFormData.selectedPaymentOption) {
      newErrors.selectedPaymentOption = 'Please select a payment method'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleOrderFormSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const totalPrice = selectedProduct.price * orderFormData.quantity
      const newOrder = {
        id: Date.now(),
        customerName: orderFormData.customerName,
        phoneNumber: orderFormData.phoneNumber,
        deliveryAddress: orderFormData.deliveryAddress,
        items: [{
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          quantity: orderFormData.quantity
        }],
        totalAmount: totalPrice,
        estimatedDeliveryDate: orderFormData.estimatedDeliveryDate,
        paymentMethod: orderFormData.selectedPaymentOption,
        status: 'pending',
        orderDate: new Date().toISOString(),
        userInfo: getCurrentUser()
      }
      addOrder(newOrder)
      setRefreshTrigger(prev => prev + 1)
      showSuccessNotification('Order placed successfully!')
      setIsOrderFormModalOpen(false)
      setSelectedProduct(null)
      setOrderFormData({
        customerName: '',
        phoneNumber: '',
        deliveryAddress: '',
        quantity: 1,
        estimatedDeliveryDate: '',
        paymentMethod: 'cod',
        selectedPaymentOption: ''
      })
      setErrors({})
    } catch (error) {
      showErrorNotification('Failed to place order. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Table for "Your Orders"
  const renderYourOrdersTable = (orderList) => (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Your Product Orders</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Order ID</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Product Name</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Quantity</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Unit Price</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Total Amount</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Status</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Order Date</th>
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
                  {order.items?.[0]?.name || 'Product'}
                </td>
                <td className="py-4 px-6 text-slate-900">{order.items?.[0]?.quantity || 0}</td>
                <td className="py-4 px-6 text-slate-900">
                  ₹{order.items?.[0]?.price?.toLocaleString() || '0'}
                </td>
                <td className="py-4 px-6 font-medium text-slate-900 group-hover:text-[#F08344] transition-colors">
                  ₹{order.totalAmount?.toLocaleString() || '0'}
                </td>
                <td className="py-4 px-6">{getStatusBadge(order.status)}</td>
                <td className="py-4 px-6 text-slate-600 group-hover:text-[#F08344] transition-colors">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  // ✅ Super Admin Style Grid Layout for Products
  const renderProductsCards = (productList) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {productList.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
          onClick={() => handleProductClick(product)}
        >
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=Product'
              }}
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
            <div className="flex items-center mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">{product.qualityRating}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-[#F08344]">₹{product.priceRange}</span>
              <span className="text-sm text-green-600 font-medium">{product.offer}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <Users className="w-4 h-4 mr-1" />
              <span>{product.buyersCount} buyers</span>
            </div>
            <Button
              className="w-full bg-[#F08344] hover:bg-[#e0733a] text-white px-8 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Place Order
            </Button>
          </div>
        </div>
      ))}
    </div>
  )

  // ✅ Table for Outsource Orders
  const renderOutsourceOrdersTable = (orderList) => (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Outsource Orders</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Order ID</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Order By</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Items</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Total Amount</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Status</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Order Date</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Delivery Date</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900">Delivery Address</th>
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
                  Roshan Traders
                </td>
                <td className="py-4 px-6">
                  <div className="space-y-1">
                    {order.items?.map((item, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium text-slate-900">{item.name}</span>
                        <span className="text-slate-600"> (Qty: {item.quantity})</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-6 font-medium text-slate-900 group-hover:text-[#F08344] transition-colors">
                  ₹{order.totalAmount?.toLocaleString() || '0'}
                </td>
                <td className="py-4 px-6">{getStatusBadge(order.status)}</td>
                <td className="py-4 px-6 text-slate-600 group-hover:text-[#F08344] transition-colors">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                 <td className="py-4 px-6 text-slate-600 group-hover:text-[#F08344] transition-colors">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="py-4 px-6 text-slate-600 max-w-xs truncate group-hover:text-[#F08344] transition-colors">
                  {order.deliveryAddress || 'N/A'}
                </td>
                <td className="py-4 px-6">
                  {order.status === 'pending' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAssignClick(order)
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors cursor-pointer"
                      disabled={isLoading}
                    >
                      Assign
                    </button>
                  )}
                  {order.status === 'in_progress' && (
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
                  {order.status === 'confirmed' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsAssignModalOpen(true)
                        setSelectedOrderForAssign(order)
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors cursor-pointer"
                      disabled={isLoading}
                    >
                      Assign
                    </button>
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
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
        onNotificationClick={handleNotificationClick}
      />

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

        {newOutsourceOrder && (
          <div
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 cursor-pointer hover:bg-yellow-100 transition-colors"
            onClick={() => setNewOutsourceOrder(false)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ExternalLink className="size-5 text-yellow-600" />
                <span className="text-yellow-800 font-medium">New outsource order received!</span>
              </div>
              <X className="size-5 text-yellow-600 hover:text-yellow-800" />
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'products'
                ? 'bg-[#F08344] text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('your-orders')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'your-orders'
                ? 'bg-[#F08344] text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Your Orders ({yourOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('outsource')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
              activeTab === 'outsource'
                ? 'bg-[#F08344] text-white'
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

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search orders..."
        selects={[
          {
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
            ],
          },
        ]}
      />

      {activeTab === 'products' && products.length > 0 &&
        renderProductsCards(
          products
            .filter(p =>
              p.name?.toLowerCase().includes(search.toLowerCase()) ||
              String(p.id).includes(search)
            )
        )}

      {activeTab === 'your-orders' && yourOrders.length > 0 &&
        renderYourOrdersTable(
          yourOrders
            .filter(o =>
              (o.items?.[0]?.name?.toLowerCase().includes(search.toLowerCase())) ||
              String(o.id).includes(search)
            )
            .filter(o => (statusFilter === 'all' ? true : o.status === statusFilter))
        )}

      {activeTab === 'outsource' && outsourceOrders.length > 0 &&
        renderOutsourceOrdersTable(
          outsourceOrders
            .filter(o =>
              o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
              String(o.id).includes(search)
            )
            .filter(o => (statusFilter === 'all' ? true : o.status === statusFilter))
        )}

      {activeTab === 'products' && products.length === 0 && (
        <div className="text-center py-12">
          <Package className="size-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No products yet</h3>
          <p className="text-slate-600">Products will appear here once available</p>
        </div>
      )}

      {activeTab === 'your-orders' && yourOrders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="size-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No orders yet</h3>
          <p className="text-slate-600">Orders you place from products will appear here</p>
        </div>
      )}

      {activeTab === 'outsource' && outsourceOrders.length === 0 && (
        <div className="text-center py-12">
          <ExternalLink className="size-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No outsource orders yet</h3>
          <p className="text-slate-600">Customer orders will appear here</p>
        </div>
      )}

      {/* Product Details Modal */}
      {isProductModalOpen && selectedProduct && (
        <Modal
          isOpen={isProductModalOpen}
          onClose={() => {
            setIsProductModalOpen(false)
            setSelectedProduct(null)
          }}
          title="Product Details"
          size="lg"
        >
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="w-1/2">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Product'
                  }}
                />
              </div>
              <div className="w-1/2 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h3>
                  <div className="flex items-center mt-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-lg text-gray-600 ml-1">{selectedProduct.qualityRating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-[#F08344]">₹{selectedProduct.priceRange}</span>
                  <span className="text-lg text-green-600 font-medium">{selectedProduct.offer}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{selectedProduct.buyersCount} buyers</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <RotateCcw className="w-4 h-4 mr-2 text-green-600" />
                    <span>Return & Exchange: {selectedProduct.returnExchange ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-2 text-green-600" />
                    <span>COD: {selectedProduct.cashOnDelivery ? 'Yes' : 'No'}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p><strong>Payment Options:</strong> {selectedProduct.paymentOptions?.join(', ') || 'COD'}</p>
                </div>
              </div>
            </div>
            <div className="border-t pt-6">
              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    setIsProductModalOpen(false)
                    setSelectedProduct(null)
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePlaceOrderClick}
                  className="flex-1 bg-[#F08344] text-white hover:bg-[#e0733a]"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Order Form Modal */}
      <Modal
        isOpen={isOrderFormModalOpen}
        onClose={() => setIsOrderFormModalOpen(false)}
        title="Place Order"
        className="max-w-md"
      >
        <form onSubmit={handleOrderFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name *
            </label>
            <input
              type="text"
              value={orderFormData.customerName}
              onChange={(e) => setOrderFormData({...orderFormData, customerName: e.target.value})}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent ${errors.customerName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter customer name"
            />
            {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              value={orderFormData.phoneNumber}
              onChange={(e) => setOrderFormData({...orderFormData, phoneNumber: e.target.value})}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter phone number"
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Address *
            </label>
            <textarea
              value={orderFormData.deliveryAddress}
              onChange={(e) => setOrderFormData({...orderFormData, deliveryAddress: e.target.value})}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent ${errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'}`}
              rows="3"
              placeholder="Enter delivery address"
            />
            {errors.deliveryAddress && <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity *
            </label>
            <input
              type="number"
              min="1"
              value={orderFormData.quantity}
              onChange={(e) => setOrderFormData({...orderFormData, quantity: parseInt(e.target.value) || 1})}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
          </div>

          {/* Price Calculation */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Product Price:</span>
              <span className="text-sm text-gray-900">₹{selectedProduct?.priceRange || "0.00"}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <span className="text-sm text-gray-900">{orderFormData.quantity || 1}</span>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
              <span className="text-lg font-bold text-gray-900">Total Amount:</span>
              <span className="text-lg font-bold text-[#F08344]">
                ₹{((parseFloat(selectedProduct?.priceRange) || 0) * (orderFormData.quantity || 1)).toFixed(2)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Delivery Date *
            </label>
            <input
              type="date"
              value={orderFormData.estimatedDeliveryDate}
              onChange={(e) => setOrderFormData({...orderFormData, estimatedDeliveryDate: e.target.value})}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent ${errors.estimatedDeliveryDate ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.estimatedDeliveryDate && <p className="text-red-500 text-sm mt-1">{errors.estimatedDeliveryDate}</p>}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method *
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={orderFormData.paymentMethod === 'cash'}
                  onChange={(e) => setOrderFormData({...orderFormData, paymentMethod: e.target.value})}
                  className="h-4 w-4 text-[#F08344] focus:ring-[#F08344] border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Cash on Delivery</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={orderFormData.paymentMethod === 'online'}
                  onChange={(e) => {
                    setOrderFormData({...orderFormData, paymentMethod: e.target.value});
                    setShowPaymentOptions(true);
                  }}
                  className="h-4 w-4 text-[#F08344] focus:ring-[#F08344] border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Online Payment</span>
              </label>
            </div>
            {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>}
          </div>


          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOrderFormModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#F08344] hover:bg-[#e0733a] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Submit Order
            </Button>
          </div>
        </form>
      </Modal>

      {/* Payment Options Modal */}
      <Modal
        isOpen={showPaymentOptions}
        onClose={() => setShowPaymentOptions(false)}
        title="Choose Payment Method"
        className="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">Select your preferred payment method:</p>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handlePaymentOptionSelect('google-pay')}
              className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-[#F08344] hover:bg-orange-50 transition-colors duration-200"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-xs font-bold text-gray-700">G</span>
                </div>
                <span className="font-medium text-gray-900">Google Pay</span>
              </div>
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                {orderFormData.selectedPaymentOption === 'google-pay' && (
                  <div className="w-2 h-2 bg-[#F08344] rounded-full"></div>
                )}
              </div>
            </button>

            <button
              type="button"
              onClick={() => handlePaymentOptionSelect('phonepe')}
              className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-[#F08344] hover:bg-orange-50 transition-colors duration-200"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-xs font-bold text-white">P</span>
                </div>
                <span className="font-medium text-gray-900">PhonePe</span>
              </div>
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                {orderFormData.selectedPaymentOption === 'phonepe' && (
                  <div className="w-2 h-2 bg-[#F08344] rounded-full"></div>
                )}
              </div>
            </button>

            <button
              type="button"
              onClick={() => handlePaymentOptionSelect('paytm')}
              className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-[#F08344] hover:bg-orange-50 transition-colors duration-200"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-xs font-bold text-white">P</span>
                </div>
                <span className="font-medium text-gray-900">Paytm</span>
              </div>
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                {orderFormData.selectedPaymentOption === 'paytm' && (
                  <div className="w-2 h-2 bg-[#F08344] rounded-full"></div>
                )}
              </div>
            </button>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPaymentOptions(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handlePaymentConfirm}
              disabled={!orderFormData.selectedPaymentOption}
              className="bg-[#F08344] hover:bg-[#e0733a] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Payment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Assign Order Modal */}
      <AssignOrderModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false)
          setSelectedOrderForAssign(null)
        }}
        order={selectedOrderForAssign}
        onAssign={handleAssignOrder}
      />
    </div>
  )
}
