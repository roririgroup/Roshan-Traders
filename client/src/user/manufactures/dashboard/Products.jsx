import React, { useState, useEffect } from 'react'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
<<<<<<< HEAD
import FilterBar from '../../../components/ui/FilterBar'
import { Package, Plus, Edit, Trash2 } from 'lucide-react'
import { getCurrentUser } from '../../../lib/auth'
=======
import { Trash2, Package } from 'lucide-react'
import { useAuth } from '../../../Context/AuthContext'
>>>>>>> dc505d68e93cf97f85dbc4ea8d2e658b0f2da92e

const API_BASE_URL = 'http://localhost:7700/api'

export default function ProductsPage() {
  const { currentUser } = useAuth()
  const [products, setProducts] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
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
<<<<<<< HEAD
    inStock: true,
    stockQuantity: 0
  })
  const [search, setSearch] = useState('')
  const [stockFilter, setStockFilter] = useState('all')
=======
    image: ''
  })
  const [addErrors, setAddErrors] = useState({})
>>>>>>> dc505d68e93cf97f85dbc4ea8d2e658b0f2da92e

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      if (!currentUser?.id) return

      try {
<<<<<<< HEAD
        const token = localStorage.getItem('token') || 'dummy-token'
        const user = getCurrentUser()
        if (user && user.id) {
          const response = await fetch(`http://localhost:7700/api/products/manufacturer/${user.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json();
          setProducts(data);
        } else {
          // No fallback data - show empty state
          setProducts([]);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
=======
        const response = await fetch(`${API_BASE_URL}/manufacturer-products/user/${currentUser.id}`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        } else {
          console.error('Failed to fetch products')
        }
      } catch (error) {
        console.error('Error fetching products:', error)
>>>>>>> dc505d68e93cf97f85dbc4ea8d2e658b0f2da92e
      }
    }

    fetchProducts()
  }, [currentUser?.id])

  const handleAddProduct = () => setShowAddModal(true)

  const handlePaymentOptionChange = (option) => {
    setAddForm((prev) => ({
      ...prev,
      paymentOptions: prev.paymentOptions.includes(option)
        ? prev.paymentOptions.filter((opt) => opt !== option)
        : [...prev.paymentOptions, option],
    }))
  }

<<<<<<< HEAD
  const handleAddProduct = () => {
    if (!formData.name || !formData.price || !formData.description) {
      alert('Please fill in all required fields')
      return
    }

    const newProduct = {
      id: Date.now(),
      ...formData,
      price: parseFloat(formData.price),
      stockQuantity: formData.stockQuantity || 0
    }

    setProducts(prev => [...prev, newProduct])
    setFormData({
      name: '',
      price: '',
      description: '',
      inStock: true,
      stockQuantity: 0
    })
    setShowAddForm(false)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity || 0
    })
    setShowAddForm(true)
  }

  const handleUpdateProduct = () => {
    if (!formData.name || !formData.price || !formData.description) {
      alert('Please fill in all required fields')
      return
    }

    setProducts(prev => prev.map(product =>
      product.id === editingProduct.id
        ? {
            ...product,
            ...formData,
            price: parseFloat(formData.price),
            stockQuantity: formData.stockQuantity || 0
          }
        : product
    ))

    setFormData({
      name: '',
      price: '',
      description: '',
      inStock: true,
      stockQuantity: 0
    })
    setEditingProduct(null)
    setShowAddForm(false)
  }

  const handleDeleteProduct = (productId) => {
=======
  const handleAddSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {}
    if (!addForm.name.trim()) newErrors.name = 'Product name is required'
    if (!addForm.priceAmount || addForm.priceAmount <= 0)
      newErrors.priceAmount = 'Valid price is required'
    if (!addForm.description.trim()) newErrors.description = 'Description is required'
    if (!addForm.image.trim()) newErrors.image = 'Image URL is required'

    if (Object.keys(newErrors).length > 0) {
      setAddErrors(newErrors)
      return
    }

    try {
      const payload = {
        manufacturerId: currentUser?.id,
        name: addForm.name,
        category: 'General',
        priceRange: addForm.priceAmount.toString(),
        imageUrl: addForm.image,
        qualityRating: addForm.qualityRating,
        offer: addForm.offer,
        buyersCount: parseInt(addForm.buyersCount) || 0,
        returnExchange: addForm.returnExchange,
        cashOnDelivery: addForm.cashOnDelivery,
        paymentOptions: addForm.paymentOptions,
        description: addForm.description,
      }

      // ✅ FIXED ENDPOINT HERE
      const response = await fetch(`${API_BASE_URL}/manufacturer-products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const newProduct = await response.json()
        setProducts((prev) => [...prev, newProduct])
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
          image: '',
        })
        alert('✅ Product added successfully!')
      } else {
        const errorText = await response.text()
        alert(`❌ Failed to add product: ${errorText}`)
      }
    } catch (error) {
      alert(`❌ Error adding product: ${error.message}`)
    }
  }

  const handleDelete = async (productId) => {
>>>>>>> dc505d68e93cf97f85dbc4ea8d2e658b0f2da92e
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/manufacturer-products/${productId}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setProducts((prev) => prev.filter((p) => p.id !== productId))
          alert('✅ Product deleted successfully!')
        } else {
          alert('❌ Failed to delete product.')
        }
      } catch {
        alert('❌ Error deleting product.')
      }
    }
  }

  return (
<<<<<<< HEAD
    <div className="p-6 bg-slate-50 min-h-screen relative">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Package className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Products</h1>
              <p className="text-slate-600">Manage your product inventory</p>
            </div>
          </div>
          <Button
            onClick={() => {
              setEditingProduct(null)
              setFormData({
                name: '',
                price: '',
                description: '',
                inStock: true,
                stockQuantity: 0
              })
              setShowAddForm(true)
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Plus className="size-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search products..."
        selects={[{
          name: 'stock',
          value: stockFilter,
          onChange: setStockFilter,
          options: [
            { value: 'all', label: 'All' },
            { value: 'in', label: 'In Stock' },
            { value: 'out', label: 'Out of Stock' },
          ]
        }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {products
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => stockFilter === 'all' || (stockFilter === 'in' ? p.inStock : !p.inStock))
    .map((product) => (
    <Card key={product.id} className="p-6 border-gray-200 hover:shadow-lg transition-shadow duration-200 flex flex-col">
      <div className="flex-1">
        <div className="mb-4">
          <h3 className="font-semibold text-slate-900 text-lg mb-2">{product.name}</h3>
          <p className="text-slate-600 text-sm line-clamp-2 mb-2">{product.description}</p>
          <p className="text-xl font-bold text-slate-900 mb-2">
            ₹{product.price != null ? product.price.toLocaleString() : '0'}
          </p>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              product.inStock
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
            <span className="text-sm text-slate-700">Stock: <span className="font-semibold">{Number(product.stockQuantity || 0)}</span></span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mt-4">
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex gap-2">
            <Button
              onClick={() => handleEditProduct(product)}
              variant="secondary"
              size="sm"
=======
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
        <Button
          className="bg-[#F08344] hover:bg-[#e0733a] text-white px-6 py-2 rounded-lg font-medium"
          onClick={handleAddProduct}
        >
          Add Product
        </Button>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id || product.name}
              className="bg-white rounded-xl shadow-lg p-5 border border-gray-100"
>>>>>>> dc505d68e93cf97f85dbc4ea8d2e658b0f2da92e
            >
              <img
                src={product.imageUrl || product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
              <p className="font-bold text-[#F08344] text-lg mb-2">
                ₹{product.priceRange || product.priceAmount}
              </p>
              <p className="text-sm text-green-600 mb-2">{product.offer}</p>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={() => handleDelete(product.id)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="size-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No products yet</h3>
          <p className="text-slate-600 mb-4">Add your first product to get started</p>
          <Button
            onClick={handleAddProduct}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Add Product
          </Button>
        </div>
      )}

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
              <label className="text-sm font-medium text-gray-700">Product Name *</label>
              <input
                type="text"
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${
                  addErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Price *</label>
              <input
                type="number"
                value={addForm.priceAmount}
                onChange={(e) => setAddForm({ ...addForm, priceAmount: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${
                  addErrors.priceAmount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter price"
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700">Description *</label>
              <textarea
                value={addForm.description}
                onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${
                  addErrors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                rows="3"
                placeholder="Enter product description"
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700">Image URL *</label>
              <input
                type="url"
                value={addForm.image}
                onChange={(e) => setAddForm({ ...addForm, image: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${
                  addErrors.image ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter image URL"
              />
            </div>
          </div>

<<<<<<< HEAD
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter price"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Stock Quantity</label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter stock quantity"
              min="0"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
              className="mr-2"
            />
            <label className="text-sm font-medium text-slate-700">In Stock</label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowAddForm(false)}>
=======
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
>>>>>>> dc505d68e93cf97f85dbc4ea8d2e658b0f2da92e
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#F08344] hover:bg-[#e0733a] text-white px-6 py-2 rounded-lg"
            >
              Add Product
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}