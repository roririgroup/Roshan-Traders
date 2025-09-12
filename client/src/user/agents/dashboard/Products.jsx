import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { Package, Plus, ShoppingCart, Edit, Trash2 } from 'lucide-react'

export default function Products() {
  const [products, setProducts] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: ''
  })

  // Mock data - replace with API calls
  useEffect(() => {
    setProducts([
      {
        id: 1,
        name: 'Wireless Headphones',
        price: 2999,
        description: 'High-quality wireless headphones with noise cancellation',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
        inStock: true
      },
      {
        id: 2,
        name: 'Smart Watch',
        price: 4999,
        description: 'Fitness tracking smart watch with heart rate monitor',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
        inStock: true
      },
      {
        id: 3,
        name: 'Bluetooth Speaker',
        price: 1999,
        description: 'Portable Bluetooth speaker with 12-hour battery life',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300',
        inStock: false
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
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="size-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <Card className="p-6 mb-6">
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
        </Card>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-slate-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300'
                }}
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900 text-lg">{product.name}</h3>
              <p className="text-slate-600 text-sm line-clamp-2">{product.description}</p>
              <p className="text-xl font-bold text-slate-900">₹{product.price.toLocaleString()}</p>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  product.inStock
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                onClick={() => handleAddToCart(product.id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={!product.inStock}
              >
                <ShoppingCart className="size-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={() => handleEdit(product.id)}
                variant="secondary"
                size="sm"
              >
                <Edit className="size-4" />
              </Button>
              <Button
                onClick={() => handleDelete(product.id)}
                variant="secondary"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <Package className="size-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No products yet</h3>
          <p className="text-slate-600 mb-4">Start by adding your first product</p>
          <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="size-4 mr-2" />
            Add Product
          </Button>
        </div>
      )}
    </div>
  )
}
