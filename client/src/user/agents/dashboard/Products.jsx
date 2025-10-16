import React, { useState, useEffect } from 'react'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import FilterBar from '../../../components/ui/FilterBar'
import { ShoppingCart, Star, Users, Package, CreditCard, Truck, RotateCcw } from 'lucide-react'
import { getCurrentUser } from '../../../lib/auth.js'
import { addOrder } from '../../../store/ordersStore.js'

const API_BASE_URL = 'http://localhost:7700/api'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        console.error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    phoneNumber: '',
    deliveryAddress: '',
    quantity: 1,
    estimatedDeliveryDate: '',
    paymentMethod: 'cash',
    selectedPaymentOption: ''
  })
  const [errors, setErrors] = useState({})

  // Add these functions
  const handlePaymentOptionSelect = (paymentOption) => {
    setOrderForm(prev => ({
      ...prev,
      selectedPaymentOption: paymentOption
    }))
  }

  const handlePaymentConfirm = () => {
    if (orderForm.selectedPaymentOption) {
      alert(`Payment method selected: ${orderForm.selectedPaymentOption}`)
      setShowPaymentOptions(false)
    }
  }

  const handleCardClick = (product) => {
    setSelectedProduct(product)
    setShowDetailsModal(true)
  }

  const handlePlaceOrder = () => {
    setShowDetailsModal(false)
    setShowOrderModal(true)
  }

  const handleOrderSubmit = async (e) => {
    e.preventDefault()
    // Basic validation
    const newErrors = {}
    if (!orderForm.customerName.trim()) newErrors.customerName = 'Customer name is required'
    if (!orderForm.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required'
    if (!orderForm.deliveryAddress.trim()) newErrors.deliveryAddress = 'Delivery address is required'
    if (!orderForm.estimatedDeliveryDate) newErrors.estimatedDeliveryDate = 'Delivery date is required'

    // Additional validation for online payment
    if (orderForm.paymentMethod === 'online' && !orderForm.selectedPaymentOption) {
      newErrors.paymentMethod = 'Please select a payment option'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      // Submit order to backend
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: orderForm.customerName,
          phoneNumber: orderForm.phoneNumber,
          deliveryAddress: orderForm.deliveryAddress,
          quantity: orderForm.quantity,
          estimatedDeliveryDate: orderForm.estimatedDeliveryDate,
          productId: selectedProduct.id,
        }),
      })

      if (response.ok) {
        alert('Order submitted successfully!')
        setShowOrderModal(false)
        setOrderForm({
          customerName: '',
          phoneNumber: '',
          deliveryAddress: '',
          quantity: 1,
          estimatedDeliveryDate: '',
          paymentMethod: 'cash',
          selectedPaymentOption: ''
        })
        setErrors({})
      } else {
        const errorData = await response.json()
        alert(`Failed to submit order: ${errorData.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error submitting order:', error)
      alert('Failed to submit order. Please try again.')
    }
  }

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === 'priceRange') {
        aValue = parseFloat(aValue)
        bValue = parseFloat(bValue)
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F08344]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search products..."
        selects={[
          {
            name: 'sortBy',
            value: sortBy,
            onChange: setSortBy,
            options: [
              { value: 'name', label: 'Name' },
              { value: 'priceRange', label: 'Price' },
              { value: 'qualityRating', label: 'Rating' }
            ]
          },
          {
            name: 'sortOrder',
            value: sortOrder,
            onChange: setSortOrder,
            options: [
              { value: 'asc', label: 'Ascending' },
              { value: 'desc', label: 'Descending' }
            ]
          }
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
            onClick={() => handleCardClick(product)}
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
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedProduct(product)
                  setShowOrderModal(true)
                }}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Place Order
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="size-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No products found</h3>
          <p className="text-slate-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Product Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={selectedProduct?.name}
        className="max-w-2xl"
      >
        {selectedProduct && (
          <div className="space-y-6">
            <div className="flex items-start space-x-6">
              <div className="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Product'
                  }}
                />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Quality Rating</label>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1">{selectedProduct.qualityRating}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Price Amount</label>
                    <p className="text-2xl font-bold text-[#F08344] mt-1">₹{selectedProduct.priceAmount}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Offer</label>
                    <p className="text-green-600 font-medium mt-1">{selectedProduct.offer}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Buyers Count</label>
                    <div className="flex items-center mt-1">
                      <Users className="w-4 h-4 text-gray-400 mr-1" />
                      <span>{selectedProduct.buyersCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold mb-4">Product Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <RotateCcw className={`w-5 h-5 mr-2 ${selectedProduct.returnExchange ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className="text-sm">Return & Exchange</span>
                </div>
                <div className="flex items-center">
                  <Truck className={`w-5 h-5 mr-2 ${selectedProduct.cashOnDelivery ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className="text-sm">Cash on Delivery</span>
                </div>
                <div className="flex items-center">
                  <CreditCard className={`w-5 h-5 mr-2 ${selectedProduct.paymentOptions.length > 0 ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className="text-sm">Payment Options: {selectedProduct.paymentOptions.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t">
              <Button
                className="bg-[#F08344] hover:bg-[#e0733a] text-white px-8 py-2 rounded-lg font-medium transition-colors duration-200"
                onClick={handlePlaceOrder}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Place Order
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Order Form Modal */}
      <Modal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        title="Place Order"
        className="max-w-md"
      >
        <form onSubmit={handleOrderSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name *
            </label>
            <input
              type="text"
              value={orderForm.customerName}
              onChange={(e) => setOrderForm({...orderForm, customerName: e.target.value})}
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
              value={orderForm.phoneNumber}
              onChange={(e) => setOrderForm({...orderForm, phoneNumber: e.target.value})}
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
              value={orderForm.deliveryAddress}
              onChange={(e) => setOrderForm({...orderForm, deliveryAddress: e.target.value})}
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
              value={orderForm.quantity}
              onChange={(e) => setOrderForm({...orderForm, quantity: parseInt(e.target.value) || 1})}
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
              <span className="text-sm text-gray-900">{orderForm.quantity || 1}</span>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
              <span className="text-lg font-bold text-gray-900">Total Amount:</span>
              <span className="text-lg font-bold text-[#F08344]">
                ₹{((parseFloat(selectedProduct?.priceRange) || 0) * (orderForm.quantity || 1)).toFixed(2)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Delivery Date *
            </label>
            <input
              type="date"
              value={orderForm.estimatedDeliveryDate}
              onChange={(e) => setOrderForm({...orderForm, estimatedDeliveryDate: e.target.value})}
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
                  checked={orderForm.paymentMethod === 'cash'}
                  onChange={(e) => setOrderForm({...orderForm, paymentMethod: e.target.value})}
                  className="h-4 w-4 text-[#F08344] focus:ring-[#F08344] border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Cash on Delivery</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={orderForm.paymentMethod === 'online'}
                  onChange={(e) => {
                    setOrderForm({...orderForm, paymentMethod: e.target.value})
                    setShowPaymentOptions(true)
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
              onClick={() => setShowOrderModal(false)}
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
                {orderForm.selectedPaymentOption === 'google-pay' && (
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
                {orderForm.selectedPaymentOption === 'phonepe' && (
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
                {orderForm.selectedPaymentOption === 'paytm' && (
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
              disabled={!orderForm.selectedPaymentOption}
              className="bg-[#F08344] hover:bg-[#e0733a] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Payment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
