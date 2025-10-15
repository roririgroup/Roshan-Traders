import { useState, useEffect } from 'react'
import Badge from '../../../components/ui/Badge'
import { ShoppingCart, CheckCircle, Clock, Truck, ExternalLink, Package } from 'lucide-react'
import { getOrders, updateOrderStatus, addOrder } from '../../../store/ordersStore'
import NotificationContainer from '../../../components/ui/NotificationContainer'
import OrderDetailsModal from '../../../components/ui/OrderDetailsModal'
import { useNotifications } from '../../../lib/notifications.jsx'
import FilterBar from '../../../components/ui/FilterBar'
import { getCurrentUser } from '../../../lib/auth'
import Button from '../../../components/ui/Button'

export default function Orders() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [outsourceOrders, setOutsourceOrders] = useState([])
  const [yourOrders, setYourOrders] = useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [activeTab, setActiveTab] = useState('products')
  const [newOutsourceOrder, setNewOutsourceOrder] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isOrderFormModalOpen, setIsOrderFormModalOpen] = useState(false)
  const [orderFormData, setOrderFormData] = useState({
    customerName: '',
    phoneNumber: '',
    deliveryAddress: '',
    quantity: 1,
    estimatedDeliveryDate: '',
    paymentMethod: 'cod' // cod or upi
  })

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

  // ✅ Load orders from store
  useEffect(() => {
    const allOrders = getOrders()
    const user = getCurrentUser()

    const yourOrdersList = allOrders.filter(order =>
      order.userInfo?.id === user?.id
    )

    const outsourceOrdersList = allOrders.filter(order =>
      order.userInfo?.id !== user?.id
    )

    setYourOrders(yourOrdersList)
    setOutsourceOrders(outsourceOrdersList)
  }, [refreshTrigger])

  // ✅ Auto-refresh orders every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // ✅ Detect new outsource orders
  useEffect(() => {
    const checkForNewOrders = () => {
      const allOrders = getOrders()
      const otherOrders = allOrders.filter(order => order.userInfo?.id !== getCurrentUser()?.id)

      if (otherOrders.length > outsourceOrders.length) {
        setNewOutsourceOrder(true)
        const newOrders = otherOrders.slice(outsourceOrders.length)
        newOrders.forEach(order => showOrderNotification(order))
        setTimeout(() => setNewOutsourceOrder(false), 5000)
      }
      setOutsourceOrders(otherOrders)
    }

    const interval = setInterval(checkForNewOrders, 10000)
    return () => clearInterval(interval)
  }, [outsourceOrders.length, showOrderNotification])

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

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  const handlePlaceOrderClick = () => {
    setIsProductModalOpen(false)
    setIsOrderFormModalOpen(true)
  }

  const handleOrderFormSubmit = async (e) => {
    e.preventDefault()
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
        paymentMethod: orderFormData.paymentMethod,
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
        paymentMethod: 'cod'
      })
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

  // ✅ Card Layout for Products
  const renderProductsCards = (productList) => (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Your Products</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productList.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
            >
              <div className="flex flex-col">
                <div className="w-full h-32 bg-slate-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Package className="size-12 text-slate-400" />
                  )}
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">{product.name}</h4>
                <p className="text-slate-600 text-sm mb-3 line-clamp-2">{product.description || 'No description available'}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-[#F08344]">₹{product.price?.toLocaleString() || '0'}</span>
                  <span className="text-sm text-slate-500">ID: #{product.id}</span>
                </div>
                <Button
                  onClick={() => handleProductClick(product)}
                  className="w-full bg-[#F08344] text-white rounded-lg hover:bg-[#e0763a] transition-colors"
                >
                  View Details 
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
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
                  {order.customerName}
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
                <td className="py-4 px-6 text-slate-600 max-w-xs truncate group-hover:text-[#F08344] transition-colors">
                  {order.deliveryAddress || 'N/A'}
                </td>
                <td className="py-4 px-6">
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
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2">
              <ExternalLink className="size-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">New outsource order received!</span>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Product Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Quality Rating</label>
                  <p className="text-slate-900">{selectedProduct.qualityRating || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Price Amount</label>
                  <p className="text-slate-900">₹{selectedProduct.priceAmount?.toLocaleString() || '0'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Offer</label>
                  <p className="text-slate-900">{selectedProduct.offer || 'No offer'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Buyers Count</label>
                  <p className="text-slate-900">{selectedProduct.buyersCount || 0}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Return and Exchange Option</label>
                  <p className="text-slate-900">{selectedProduct.returnExchange ? 'Available' : 'Not Available'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Cash on Delivery Option</label>
                  <p className="text-slate-900">{selectedProduct.cashOnDelivery ? 'Available' : 'Not Available'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">UPI and Card Payment Options</label>
                  <p className="text-slate-900">{selectedProduct.paymentOptions?.includes('upi') || selectedProduct.paymentOptions?.includes('card') ? 'Available' : 'Not Available'}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => {
                    setIsProductModalOpen(false)
                    setSelectedProduct(null)
                  }}
                  className="flex-1 bg-slate-200 text-slate-700 hover:bg-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePlaceOrderClick}
                  className="flex-1 bg-[#F08344] text-white hover:bg-[#e0763a]"
                >
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Form Modal */}
      {isOrderFormModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Place Order</h2>
              <form onSubmit={handleOrderFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={orderFormData.customerName}
                    onChange={(e) => setOrderFormData({...orderFormData, customerName: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F08344]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={orderFormData.phoneNumber}
                    onChange={(e) => setOrderFormData({...orderFormData, phoneNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F08344]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Address</label>
                  <textarea
                    value={orderFormData.deliveryAddress}
                    onChange={(e) => setOrderFormData({...orderFormData, deliveryAddress: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F08344]"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={orderFormData.quantity}
                    onChange={(e) => setOrderFormData({...orderFormData, quantity: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F08344]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Delivery Date</label>
                  <input
                    type="date"
                    value={orderFormData.estimatedDeliveryDate}
                    onChange={(e) => setOrderFormData({...orderFormData, estimatedDeliveryDate: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F08344]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={orderFormData.paymentMethod}
                    onChange={(e) => setOrderFormData({...orderFormData, paymentMethod: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F08344]"
                  >
                    <option value="cod">Cash on Delivery</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-slate-700">Total Price: ₹{(selectedProduct.price * orderFormData.quantity).toLocaleString()}</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => {
                      setIsOrderFormModalOpen(false)
                      setSelectedProduct(null)
                      setOrderFormData({
                        customerName: '',
                        phoneNumber: '',
                        deliveryAddress: '',
                        quantity: 1,
                        estimatedDeliveryDate: '',
                        paymentMethod: 'cod'
                      })
                    }}
                    className="flex-1 bg-slate-200 text-slate-700 hover:bg-slate-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-[#F08344] text-white hover:bg-[#e0763a] disabled:opacity-50"
                  >
                    {isLoading ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
