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
        image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTEhMVFRUWFRcWGBUXFxUXFRUVFRUXFxcXFRUYHSggGBolGxUVITEhJSkrLi4uFyAzODMtNygtLisBCgoKDg0OGxAQGy0mICUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAKsBJgMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAEBQYHAQIDAAj/xABBEAABAgQEBAMFBwMCBAcAAAABAhEAAwQhIhMxQVFhcQYigZETMkKhsRQjQlLB0fBicuEkkhUzQ1M0c4KissLx/8QAGQEAAwEBAQAAAAAAAAAAAAAAAQIDBAAF/8QAKREAAgICAgEDAwUBAQAAAAAAAAECEQMhEjFBBBNRImFxBTJCgbHwM//aAAwDAQACEQMRAD8AjWKkqBeF1ChjDarIMLE6wsQyDETsk1CxqFAxbmGY2lSAQdop7LdL9Yk+G1Ia0eR+pQfJSQbpBHHWIeIoIGgiMUVDnUAYk8zDlTFZsto64BSBFQAptDaI4MvHG15DCLezvIwACUTl2JiM1NKStCWuVAfGLVXOASRs0JKbh4Z0zD+Z/nEsSfJvstJaJPwnS5JQT0hzU6GPUUoJSGjep0h44uOPZEgNfXZVKeG3DQ8ROY7wi40ACJqhsPqYacETvuJb6kCNT/8AFfk690SvwQ0KcTksR5gw8e0JsdTytuWhJ41xCAS6pPicsPqaszWEIqKgBXpEjp6cCIQjK9HGZyHERLiKkAUlTXBPxIiaERHuI6fMktqLxd4eSY0e7F8iS8sWip+IqcfaVAfmI+cWZQ1Kvs4F3Dg/GIT9jz1qR1U/6xP0EfblJ/Y7K+TQlOHNtFmcB0yfsg/uU/m//wCRyxHAB4ZbVoK4HpyKc/3q/SNkMvJbLe3TIf7RKUInpI3T+sRJMrMYm/tHlEzUP+U/WIjSS+b0jdligaY2Z4pimK4p4sxKZb5Uj5xGsKkPMHnEo9o8l5qVdUiI5hSXmDzjXjVUjPkdtsnWEy2SIYzBaA8OSyRBE1UY8k+U2zRFUqF9Ql4DXLg6cYHMY5RspFg8tLQfTqgOWI6y1QjQzYwCoxzmKtGqVRzmKtDQVsV9CjF1FjETo5pE0xK8XUWMROjmETTFYr6WJPaZNuH8QZQeJXQ1gUIqjB6whQeJXQ1gUIqjB6x5mXG4ys0QmpK0T+ZODQHOmQilV5EdkVwMY3iaLqaY0nzIQ4pODGGU6sBaEGJ1gIMWxQdiykqI5i8wMYi9HMImeUSjFZgYxKqGYCkRqkqRKEuTZJqKc4gqZNaI5QzQ0HzJ7CMU4/UaYvQTNnQHOmwPOnQHOnQYwBKYPNnQHNnQRNnQHOnRaMRGz//2Q==',
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
            <div className="w-10 h-10 bg-[#F08344] rounded-lg flex items-center justify-center">
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
            className="bg-[#F08344] hover:bg-[#E5672E] text-white"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-[#F08344]"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-[#F08344]"
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
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-[#F08344]"
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
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-[#F08344]"
                placeholder="Enter image URL"
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="bg-[#F08344] hover:bg-[#E5672E] text-white">
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
              <h3 className="font-semibold text-slate-900 text-lg group-hover:text-[#F08344] transition-colors duration-200">{product.name}</h3>
              <p className="text-slate-600 text-sm line-clamp-2">{product.description}</p>
              <p className="text-xl font-bold text-slate-900 animate-pulse-slow">₹{product.price.toLocaleString()}</p>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  product.inStock
                    ? 'bg-[#FEF0E8] text-[#D45A2A] hover:bg-[#F9D5C2]'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
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
                  className="w-35 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-[#F08344] transition-all duration-200 hover:border-[#F08344]"
                />
                <Button
                  onClick={() => handlePlaceOrder(product)}
                  data-product-id={product.id}
                  className="w-50 bg-[#F08344] hover:bg-[#E5672E] text-white transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
          {/* <Button onClick={() => setShowAddForm(true)} className="bg-[#F08344] hover:bg-[#E5672E] text-white">
            <Plus className="size-4 mr-2" />
            Add Product
          </Button> */}
        </div>
      )}
    </div>
  )
}