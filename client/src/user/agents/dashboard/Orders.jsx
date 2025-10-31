import { useState, useEffect } from 'react'
import { ShoppingCart, Star, Users, RotateCcw, Truck, CreditCard } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import { getCurrentUser } from '../../../lib/auth.js' // Import current user info

const API_BASE_URL = 'http://localhost:7700/api'

export default function Orders() {
  const [products, setProducts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Form state
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    phoneNumber: '',
    deliveryAddress: '',
    quantity: 1,
    estimatedDeliveryDate: ''
  })
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('') // Success message state

  // Fetch products for agent page
  useEffect(() => {
    fetchProducts()
  }, [])

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

  const handlePlaceOrder = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
    // Reset form and errors
    setOrderForm({
      customerName: '',
      phoneNumber: '',
      deliveryAddress: '',
      quantity: 1,
      estimatedDeliveryDate: ''
    })
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}
    if (!orderForm.customerName) newErrors.customerName = 'Customer name is required'
    if (!orderForm.phoneNumber) newErrors.phoneNumber = 'Phone number is required'
    if (!orderForm.deliveryAddress) newErrors.deliveryAddress = 'Delivery address is required'
    if (!orderForm.quantity || orderForm.quantity < 1) newErrors.quantity = 'Quantity must be at least 1'
    if (!orderForm.estimatedDeliveryDate) newErrors.estimatedDeliveryDate = 'Estimated delivery date is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleOrderSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return // Stop submission if invalid

    const newOrder = {
      id: Date.now(),
      customerName: orderForm.customerName,
      phoneNumber: orderForm.phoneNumber,
      deliveryAddress: orderForm.deliveryAddress,
      items: [{ name: selectedProduct.name, quantity: orderForm.quantity }],
      totalAmount: selectedProduct.priceRange * orderForm.quantity,
      orderDate: new Date().toISOString(),
      status: 'pending',
      userInfo: getCurrentUser(),
    }

    // Save in localStorage
    const existingOrders = JSON.parse(localStorage.getItem('agentOrders')) || []
    localStorage.setItem('agentOrders', JSON.stringify([...existingOrders, newOrder]))

    // Show success message
    setSuccessMessage('Order placed successfully!')

    // Hide message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000)

    // Reset modal and form
    setIsModalOpen(false)
    setSelectedProduct(null)
    setOrderForm({
      customerName: '',
      phoneNumber: '',
      deliveryAddress: '',
      quantity: 1,
      estimatedDeliveryDate: ''
    })
    setErrors({})
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Success notification */}
      {successMessage && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {successMessage}
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Available Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
          >
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Product' }}
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

              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="flex items-center">
                    <RotateCcw className={`w-4 h-4 mr-1 ${product.returnExchange ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className="text-sm">Return & Exchange</span>
                  </div>
                  <div className="flex items-center">
                    <Truck className={`w-4 h-4 mr-1 ${product.cashOnDelivery ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className="text-sm">Cash on Delivery</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className={`w-4 h-4 mr-1 ${product.paymentOptions.length > 0 ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className="text-sm">Payment: {product.paymentOptions.join(', ')}</span>
                  </div>
                </div>
              </div>

              <Button
                className="bg-[#F08344] hover:bg-[#e0733a] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 mt-4 w-full"
                onClick={() => handlePlaceOrder(product)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Place Order
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for placing order */}
      {selectedProduct && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Place Order: ${selectedProduct.name}`}
          className="max-w-md"
        >
          <form onSubmit={handleOrderSubmit} className="space-y-4 p-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
              <input
                type="text"
                value={orderForm.customerName}
                onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent ${errors.customerName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter customer name"
              />
              {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                value={orderForm.phoneNumber}
                onChange={(e) => setOrderForm({ ...orderForm, phoneNumber: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter phone number"
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
              <textarea
                value={orderForm.deliveryAddress}
                onChange={(e) => setOrderForm({ ...orderForm, deliveryAddress: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent ${errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'}`}
                rows="3"
                placeholder="Enter delivery address"
              />
              {errors.deliveryAddress && <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                type="number"
                min="1"
                value={orderForm.quantity}
                onChange={(e) => setOrderForm({ ...orderForm, quantity: parseInt(e.target.value) })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery Date *</label>
              <input
                type="date"
                value={orderForm.estimatedDeliveryDate}
                onChange={(e) => setOrderForm({ ...orderForm, estimatedDeliveryDate: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent ${errors.estimatedDeliveryDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.estimatedDeliveryDate && <p className="text-red-500 text-sm mt-1">{errors.estimatedDeliveryDate}</p>}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
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
      )}
    </div>
  )
}
