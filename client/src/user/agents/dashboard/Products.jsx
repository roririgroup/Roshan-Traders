

import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import { Package, Plus, ShoppingCart, Edit, Trash2 } from 'lucide-react'
import FilterBar from '../../../components/ui/FilterBar'
import { addOrder } from '../../../store/ordersStore'

export default function Products() {
  const [products, setProducts] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: ''
  })
  const [quantities, setQuantities] = useState({})
  const [search, setSearch] = useState('')
  const [stockFilter, setStockFilter] = useState('all')

  // Mock data - replace with API calls
  useEffect(() => {
    setProducts([
      {
        id: 1,
        name: 'Red Bricks',
        price: 50,
        description: 'High-quality red bricks for dream house construction works',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbEoD4fl9rKhwkoUVYYnhvxMrWxGsQDC0EDw&s',
        inStock: true
      },
      {
        id: 2,
        name: 'Teak Wood Planks',
        price: 1500,
        description: 'Durable teak wood planks for furniture and flooring',
        image: 'data:image/jpeg;base64,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',
        inStock: true
      },
      {
        id: 3,
        name: 'River Sand',
        price: 800,
        description: 'Fine river sand suitable for plastering and masonry',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy0aaxkf0AdQf78X-Ypu9Bb02Ck9-bJvXynA&s',
        inStock: false
      },
        {
        id: 3,
        name: 'Flooring Tiles',
        price: 80,
        description: 'Fine flooring tiles suitable for your dream house',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRh1n6ZLXb7E0znBkcHYq_O6Ms_1IliB0rEg&s',
        inStock: true
      }
    ])
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add product via API
    const newProduct = {
      id: products.length + 1,
      ...formData,
      price: parseFloat(formData.price),
      inStock: true
    }
    setProducts(prev => [...prev, newProduct])
    setFormData({ name: '', price: '', description: '', image: '' })
    setShowAddForm(false)
  }

  const handleAddToCart = (productId) => {
    // Add to cart logic
    console.log('Added to cart:', productId)
  }

  const handleEdit = (productId) => {
    // Edit product logic
    console.log('Edit product:', productId)
  }

  const handleDelete = (productId) => {
    // Delete product logic
    setProducts(prev => prev.filter(p => p.id !== productId))
  }

  const handleQuantityChange = (productId, quantity) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, parseInt(quantity) || 0)
    }))
  }

  const handlePlaceOrder = (product) => {
    const quantity = quantities[product.id] || 0
    if (quantity > 0) {
      // Place order logic
      console.log('Placing order:', {
        productId: product.id,
        productName: product.name,
        quantity: quantity,
        totalPrice: product.price * quantity
      })
      // Add order to shared store
      addOrder({
        name: product.name,
        quantity: quantity,
        price: product.price
      })
      // Reset quantity after placing order
      setQuantities(prev => ({
        ...prev,
        [product.id]: 0
      }))
      
      // Show success animation
      const button = document.querySelector(`[data-product-id="${product.id}"]`)
      if (button) {
        button.classList.add('animate-bounce-in')
        setTimeout(() => {
          button.classList.remove('animate-bounce-in')
        }, 600)
      }
      
      alert(`Order placed successfully!\n${product.name} x ${quantity} = ₹${(product.price * quantity).toLocaleString()}`)
    } else {
      // Show shake animation for invalid input
      const input = document.querySelector(`input[data-product-id="${product.id}"]`)
      if (input) {
        input.classList.add('animate-shake')
        setTimeout(() => {
          input.classList.remove('animate-shake')
        }, 500)
      }
      alert('Please enter a quantity greater than 0')
    }
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Package className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Products</h1>
              <p className="text-slate-600">Manage your product inventory</p>
            </div>
          </div>
          {/* Add Product button removed as per request */}
          {/* <Button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="size-4 mr-2" />
            Add Product
          </Button> */}
        </div>
      </div>

      {showAddForm && (
        <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)}>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Add New Product</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter price"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter product description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter image URL"
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Add Product
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}

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

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
        {products
          .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
          .filter(p => stockFilter === 'all' || (stockFilter === 'in' ? p.inStock : !p.inStock))
          .map((product, index) => (
          <Card 
            key={product.id} 
            className=" border-gray-200 p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-fade-in-up group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="h-32 mb-3 overflow-hidden rounded-lg bg-slate-100 relative group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300'
                }}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {!product.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">Out of Stock</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900 text-lg group-hover:text-blue-600 transition-colors duration-200">{product.name}</h3>
              <p className="text-slate-600 text-sm line-clamp-2">{product.description}</p>
              <p className="text-xl font-bold text-slate-900 animate-pulse-slow">₹{product.price.toLocaleString()}</p>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  product.inStock
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  value={quantities[product.id] || ''}
                  onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  placeholder="Enter quantity"
                  data-product-id={product.id}
                  className="w-35 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400"
                />
                <Button
                  onClick={() => handlePlaceOrder(product)}
                  data-product-id={product.id}
                  className="w-50 bg-green-600 hover:bg-green-700 text-white transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={!product.inStock || !(quantities[product.id] > 0)}
                >
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="size-4" />
                    Place Order
                  </span>
                </Button>
              </div>
              <div className="flex gap-2">
              </div>
            </div>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <Package className="size-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No products yet</h3>
          <p className="text-slate-600 mb-4">Products will be displayed here</p>
          {/* Removed Add Product button as per user request */}
          {/* <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="size-4 mr-2" />
            Add Product
          </Button> */}
        </div>
      )}
    </div>
  )
}
