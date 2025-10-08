import React, { useState } from 'react'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import { Edit, Trash2, ShoppingCart, Star, Users, Package, CreditCard, Truck, RotateCcw } from 'lucide-react'

const sampleProducts = [
  {
    id: 1,
    name: 'Red Bricks',
    qualityRating: 4.5,
    priceAmount: 500,
    offer: '10% off',
    buyersCount: 150,
    returnExchange: true,
    cashOnDelivery: true,
    paymentOptions: ['UPI', 'Card'],
    description: 'High-quality red bricks for construction projects.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop'
  },
  {
    id: 2,
    name: 'Flooring Tiles',
    qualityRating: 4.8,
    priceAmount: 1200,
    offer: '15% off',
    buyersCount: 89,
    returnExchange: true,
    cashOnDelivery: true,
    paymentOptions: ['UPI', 'Card'],
    description: 'Premium ceramic flooring tiles for modern interiors.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop'
  },
  {
    id: 3,
    name: 'Construction Soil',
    qualityRating: 4.2,
    priceAmount: 300,
    offer: '5% off',
    buyersCount: 200,
    returnExchange: false,
    cashOnDelivery: true,
    paymentOptions: ['Card'],
    description: 'High-grade construction soil for building foundations.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'
  },
  {
    id: 4,
    name: 'Timber Wood',
    qualityRating: 4.6,
    priceAmount: 800,
    offer: '12% off',
    buyersCount: 67,
    returnExchange: true,
    cashOnDelivery: false,
    paymentOptions: ['UPI', 'Card'],
    description: 'Premium quality timber wood for construction and furniture.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop'
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState(sampleProducts)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    phoneNumber: '',
    deliveryAddress: '',
    quantity: 1,
    estimatedDeliveryDate: ''
  })
  const [addForm, setAddForm] = useState({
    name: '',
    qualityRating: 4.0,
    priceAmount: '',
    offer: '',
    buyersCount: 0,
    returnExchange: false,
    cashOnDelivery: false,
    paymentOptions: [],
    description: '',
    image: ''
  })
  const [editForm, setEditForm] = useState({
    name: '',
    qualityRating: 4.0,
    priceAmount: '',
    offer: '',
    buyersCount: 0,
    returnExchange: false,
    cashOnDelivery: false,
    paymentOptions: [],
    description: '',
    image: ''
  })
  const [errors, setErrors] = useState({})
  const [addErrors, setAddErrors] = useState({})
  const [editErrors, setEditErrors] = useState({})

  const handleCardClick = (product) => {
    setSelectedProduct(product)
    setShowDetailsModal(true)
  }

  const handlePlaceOrder = () => {
    setShowDetailsModal(false)
    setShowOrderModal(true)
  }

  const handleOrderSubmit = (e) => {
    e.preventDefault()
    // Basic validation
    const newErrors = {}
    if (!orderForm.customerName.trim()) newErrors.customerName = 'Customer name is required'
    if (!orderForm.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required'
    if (!orderForm.deliveryAddress.trim()) newErrors.deliveryAddress = 'Delivery address is required'
    if (!orderForm.estimatedDeliveryDate) newErrors.estimatedDeliveryDate = 'Delivery date is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Submit order logic here
    alert('Order submitted successfully!')
    setShowOrderModal(false)
    setOrderForm({
      customerName: '',
      phoneNumber: '',
      deliveryAddress: '',
      quantity: 1,
      estimatedDeliveryDate: ''
    })
    setErrors({})
  }


  const handleAddProduct = () => {
    setShowAddModal(true)
  }

  const handleAddSubmit = (e) => {
    e.preventDefault()
    // Validation
    const newErrors = {}
    if (!addForm.name.trim()) newErrors.name = 'Product name is required'
    if (!addForm.priceAmount || addForm.priceAmount <= 0) newErrors.priceAmount = 'Valid price is required'
    if (!addForm.description.trim()) newErrors.description = 'Description is required'
    if (!addForm.image.trim()) newErrors.image = 'Image URL is required'

    if (Object.keys(newErrors).length > 0) {
      setAddErrors(newErrors)
      return
    }

    // Add new product
    const newProduct = {
      id: Math.max(...products.map(p => p.id)) + 1,
      ...addForm,
      priceAmount: parseFloat(addForm.priceAmount),
      buyersCount: parseInt(addForm.buyersCount) || 0
    }

    setProducts([...products, newProduct])
    setShowAddModal(false)
    setAddForm({
      name: '',
      qualityRating: 4.0,
      priceAmount: '',
      offer: '',
      buyersCount: 0,
      returnExchange: false,
      cashOnDelivery: false,
      paymentOptions: [],
      description: '',
      image: ''
    })
    setAddErrors({})
    alert('Product added successfully!')
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setEditForm({
      name: product.name,
      qualityRating: product.qualityRating,
      priceAmount: product.priceAmount.toString(),
      offer: product.offer,
      buyersCount: product.buyersCount,
      returnExchange: product.returnExchange,
      cashOnDelivery: product.cashOnDelivery,
      paymentOptions: [...product.paymentOptions],
      description: product.description,
      image: product.image
    })
    setShowEditModal(true)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    // Validation
    const newErrors = {}
    if (!editForm.name.trim()) newErrors.name = 'Product name is required'
    if (!editForm.priceAmount || editForm.priceAmount <= 0) newErrors.priceAmount = 'Valid price is required'
    if (!editForm.description.trim()) newErrors.description = 'Description is required'
    if (!editForm.image.trim()) newErrors.image = 'Image URL is required'

    if (Object.keys(newErrors).length > 0) {
      setEditErrors(newErrors)
      return
    }

    // Update product
    const updatedProducts = products.map(product =>
      product.id === editingProduct.id
        ? {
            ...product,
            ...editForm,
            priceAmount: parseFloat(editForm.priceAmount),
            buyersCount: parseInt(editForm.buyersCount) || 0
          }
        : product
    )

    setProducts(updatedProducts)
    setShowEditModal(false)
    setEditingProduct(null)
    setEditForm({
      name: '',
      qualityRating: 4.0,
      priceAmount: '',
      offer: '',
      buyersCount: 0,
      returnExchange: false,
      cashOnDelivery: false,
      paymentOptions: [],
      description: '',
      image: ''
    })
    setEditErrors({})
    alert('Product updated successfully!')
  }

  const handlePaymentOptionChange = (option) => {
    setAddForm(prev => ({
      ...prev,
      paymentOptions: prev.paymentOptions.includes(option)
        ? prev.paymentOptions.filter(opt => opt !== option)
        : [...prev.paymentOptions, option]
    }))
  }

  const handleEdit = (productId) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      handleEditProduct(product)
    }
  }

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId))
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
        <Button
          className="bg-[#F08344] hover:bg-[#e0733a] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          onClick={handleAddProduct}
        >
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
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
                <span className="text-2xl font-bold text-[#F08344]">₹{product.priceAmount}</span>
                <span className="text-sm text-green-600 font-medium">{product.offer}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Users className="w-4 h-4 mr-1" />
                <span>{product.buyersCount} buyers</span>
              </div>
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(product.id)
                  }}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(product.id)
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

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

      {/* Add Product Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Product"
        className="max-w-2xl"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                value={addForm.name}
                onChange={(e) => setAddForm({...addForm, name: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent ${addErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter product name"
              />
              {addErrors.name && <p className="text-red-500 text-sm mt-1">{addErrors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quality Rating
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={addForm.qualityRating}
                onChange={(e) => setAddForm({...addForm, qualityRating: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Amount *
              </label>
              <input
                type="number"
                min="0"
                value={addForm.priceAmount}
                onChange={(e) => setAddForm({...addForm, priceAmount: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent ${addErrors.priceAmount ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter price"
              />
              {addErrors.priceAmount && <p className="text-red-500 text-sm mt-1">{addErrors.priceAmount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offer
              </label>
              <input
                type="text"
                value={addForm.offer}
                onChange={(e) => setAddForm({...addForm, offer: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent"
                placeholder="e.g., 10% off"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buyers Count
              </label>
              <input
                type="number"
                min="0"
                value={addForm.buyersCount}
                onChange={(e) => setAddForm({...addForm, buyersCount: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL *
              </label>
              <input
                type="url"
                value={addForm.image}
                onChange={(e) => setAddForm({...addForm, image: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent ${addErrors.image ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter image URL"
              />
              {addErrors.image && <p className="text-red-500 text-sm mt-1">{addErrors.image}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={addForm.description}
              onChange={(e) => setAddForm({...addForm, description: e.target.value})}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent ${addErrors.description ? 'border-red-500' : 'border-gray-300'}`}
              rows="3"
              placeholder="Enter product description"
            />
            {addErrors.description && <p className="text-red-500 text-sm mt-1">{addErrors.description}</p>}
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-semibold">Product Options</h4>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="returnExchange"
                checked={addForm.returnExchange}
                onChange={(e) => setAddForm({...addForm, returnExchange: e.target.checked})}
                className="w-4 h-4 text-[#F08344] border-gray-300 rounded focus:ring-[#F08344]"
              />
              <label htmlFor="returnExchange" className="ml-2 text-sm text-gray-700">
                Return & Exchange Available
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="cashOnDelivery"
                checked={addForm.cashOnDelivery}
                onChange={(e) => setAddForm({...addForm, cashOnDelivery: e.target.checked})}
                className="w-4 h-4 text-[#F08344] border-gray-300 rounded focus:ring-[#F08344]"
              />
              <label htmlFor="cashOnDelivery" className="ml-2 text-sm text-gray-700">
                Cash on Delivery Available
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Options
              </label>
              <div className="space-y-2">
                {['UPI', 'Card', 'Net Banking'].map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`payment-${option}`}
                      checked={addForm.paymentOptions.includes(option)}
                      onChange={() => handlePaymentOptionChange(option)}
                      className="w-4 h-4 text-[#F08344] border-gray-300 rounded focus:ring-[#F08344]"
                    />
                    <label htmlFor={`payment-${option}`} className="ml-2 text-sm text-gray-700">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#F08344] hover:bg-[#e0733a] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Add Product
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Product"
        className="max-w-2xl"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent ${editErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter product name"
              />
              {editErrors.name && <p className="text-red-500 text-sm mt-1">{editErrors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quality Rating
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={editForm.qualityRating}
                onChange={(e) => setEditForm({...editForm, qualityRating: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Amount *
              </label>
              <input
                type="number"
                min="0"
                value={editForm.priceAmount}
                onChange={(e) => setEditForm({...editForm, priceAmount: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent ${editErrors.priceAmount ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter price"
              />
              {editErrors.priceAmount && <p className="text-red-500 text-sm mt-1">{editErrors.priceAmount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offer
              </label>
              <input
                type="text"
                value={editForm.offer}
                onChange={(e) => setEditForm({...editForm, offer: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent"
                placeholder="e.g., 10% off"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buyers Count
              </label>
              <input
                type="number"
                min="0"
                value={editForm.buyersCount}
                onChange={(e) => setEditForm({...editForm, buyersCount: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL *
              </label>
              <input
                type="url"
                value={editForm.image}
                onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent ${editErrors.image ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter image URL"
              />
              {editErrors.image && <p className="text-red-500 text-sm mt-1">{editErrors.image}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({...editForm, description: e.target.value})}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent ${editErrors.description ? 'border-red-500' : 'border-gray-300'}`}
              rows="3"
              placeholder="Enter product description"
            />
            {editErrors.description && <p className="text-red-500 text-sm mt-1">{editErrors.description}</p>}
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-semibold">Product Options</h4>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="edit-returnExchange"
                checked={editForm.returnExchange}
                onChange={(e) => setEditForm({...editForm, returnExchange: e.target.checked})}
                className="w-4 h-4 text-[#F08344] border-gray-300 rounded focus:ring-[#F08344]"
              />
              <label htmlFor="edit-returnExchange" className="ml-2 text-sm text-gray-700">
                Return & Exchange Available
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="edit-cashOnDelivery"
                checked={editForm.cashOnDelivery}
                onChange={(e) => setEditForm({...editForm, cashOnDelivery: e.target.checked})}
                className="w-4 h-4 text-[#F08344] border-gray-300 rounded focus:ring-[#F08344]"
              />
              <label htmlFor="edit-cashOnDelivery" className="ml-2 text-sm text-gray-700">
                Cash on Delivery Available
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Options
              </label>
              <div className="space-y-2">
                {['UPI', 'Card', 'Net Banking'].map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`edit-payment-${option}`}
                      checked={editForm.paymentOptions.includes(option)}
                      onChange={() => {
                        setEditForm(prev => ({
                          ...prev,
                          paymentOptions: prev.paymentOptions.includes(option)
                            ? prev.paymentOptions.filter(opt => opt !== option)
                            : [...prev.paymentOptions, option]
                        }))
                      }}
                      className="w-4 h-4 text-[#F08344] border-gray-300 rounded focus:ring-[#F08344]"
                    />
                    <label htmlFor={`edit-payment-${option}`} className="ml-2 text-sm text-gray-700">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#F08344] hover:bg-[#e0733a] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Update Product
            </Button>
          </div>
        </form>
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
              onChange={(e) => setOrderForm({...orderForm, quantity: parseInt(e.target.value)})}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-transparent ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
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
    </div>
  )
}
