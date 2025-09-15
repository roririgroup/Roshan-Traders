import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import { Package, Plus, ShoppingCart, Edit, Trash2 } from 'lucide-react'
import { addOrder } from '../../../store/ordersStore'

export default function Products() {
  const [products, setProducts] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    inStock: true,
    stockQuantity: 0
  })
  const [quantities, setQuantities] = useState({})

  // Mock data - replace with API calls
  useEffect(() => {
    setProducts([
      {
        id: 1,
        name: 'Red Bricks',
        price: 50,
        description: 'High-quality red bricks for dream house construction works',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbEoD4fl9rKhwkoUVYYnhvxMrWxGsQDC0EDw&s',
        inStock: true,
        stockQuantity: 1000
      },
      {
        id: 2,
        name: 'Teak Wood Planks',
        price: 1500,
        description: 'Durable teak wood planks for furniture and flooring',
        image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTEhMVFRUWFRcWGBUXFxUXFRUVFRUXFxcXFRUYHSggGBolGxUVITEhJSkrLi4uFyAzODMtNygtLisBCgoKDg0OGxAQGy0mICUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAKsBJgMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAEBQYHAQIDAAj/xABBEAABAgQEBAMFBwMCBAcAAAABAhEAAwQhBRIxQQYiUWETcYEHMpGhsRQjQlLB0fBicuEkkhUzQ1M0c4KissLx/8QAGQEAAwEBAQAAAAAAAAAAAAAAAQIDBAAF/8QAKREAAgICAgEDAwUBAQAAAAAAAAECEQMhEjFBBBNRImFxBTJCgbHwM//aAAwDAQACEQMRAD8AjWKkqBeF1ChjDarIMLE6wsQyDETsk1CxqFAxbmGY2lSAQdop7LdL9Yk+G1Ia0eR+pQfJSQbpBHHWIeIoIGgiMUVDnUAYk8zDlTFZsto64BSBFQAptDaI4MvHG15DCLezvIwACUTl2JiM1NKStCWuVAfGLVXOASRs0JKbh4Z0zD+Z/nEsSfJvstJaJPwnS5JQT0hzU6GPUUoJSGjep0h44uOPZEgNfXZVKeG3DQ8ROY7wi40ACJqhsPqYacETvuJb6kCNT/8AFfk690SvwQ0KcTksR5gw8e0JsdTytuWhJ41xCAS6pPicsPqaszWEIqKgBXpEjp6cCIQjK9HGZyHERLiKkAUlTXBPxIiaERHuI6fMktqLxd4eSY0e7F8iS8sWip+IqcfaVAfmI+cWZQ1Kvs4F3Dg/GIT9jz1qR1U/6xP0EfblJ/Y7K+TQlOHNtFmcB0yfsg/uU/m//wCRyxHAB4ZbVoK4HpyKc/3q/SNkMvJbLe3TIf7RKUInpI3T+sRJMrMYm/tHlEzUP+U/WIjSS+b0jdilaRmyKpM8mSApCui0n4KBj6Fw+cFIHlFD0qfvZT6eIh/9wi8qSnZNow/qGScckeKvTGxRTi7DJZDmFuJyMyknvG4CwXgauqT8I8SWd8OLVGiOK2R2fLesUi9kpL+b/tE4p2CABsIrjBsWK6ycJgYuAnyAiZFZItGr0a9pdbZNpNuhJ7TsTQmlVKcZ1sAOgfWIvwzwvLTkmEAqN384zxJhajNJmHXR4MwTEdEjYgRTJJTW/wCzBlb9y2WDhchKUhgNaN5ba0?w=300',
        stockQuantity: 50
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

  const handleQuantityChange = (productId, quantity) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }))
  }

  const handlePlaceOrder = (product) => {
    const quantity = quantities[product.id]
    if (!quantity || quantity <= 0) {
      alert('Please enter a valid quantity')
      return
    }

    const orderData = {
      name: product.name,
      quantity: parseInt(quantity),
      price: product.price
    }

    addOrder(orderData)
    alert('Order placed successfully!')
    setQuantities(prev => ({
      ...prev,
      [product.id]: ''
    }))
  }

  const handleAddProduct = () => {
    if (!formData.name || !formData.price || !formData.description) {
      alert('Please fill in all required fields')
      return
    }

    const newProduct = {
      id: Date.now(),
      ...formData,
      price: parseFloat(formData.price)
    }

    setProducts(prev => [...prev, newProduct])
    setFormData({
      name: '',
      price: '',
      description: '',
      image: '',
      inStock: true
    })
    setShowAddForm(false)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      image: product.image || '',
      inStock: product.inStock
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
            price: parseFloat(formData.price)
          }
        : product
    ))

    setFormData({
      name: '',
      price: '',
      description: '',
      image: '',
      inStock: true
    })
    setEditingProduct(null)
    setShowAddForm(false)
  }

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(product => product.id !== productId))
    }
  }

  const handleUpdateStock = (productId, inStock) => {
    setProducts(prev => prev.map(product =>
      product.id === productId
        ? { ...product, inStock }
        : product
    ))
  }

  // New handler for manual stock quantity change
  const handleStockQuantityChange = (productId, quantity) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, stockQuantity: Number(quantity), inStock: Number(quantity) > 0 }
          : product
      )
    )
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <Package className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Products</h1>
            <p className="text-slate-600">Manage your product inventory and place orders</p>
          </div>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null)
            setFormData({
              name: '',
              price: '',
              description: '',
              image: '',
              inStock: true
            })
            setShowAddForm(true)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="size-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 text-lg mb-2">{product.name}</h3>
                <p className="text-slate-600 text-sm line-clamp-2 mb-2">{product.description}</p>
                <p className="text-xl font-bold text-slate-900 mb-2">₹{product.price.toLocaleString()}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    product.inStock
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEditProduct(product)}
                  variant="secondary"
                  size="sm"
                >
                  <Edit className="size-4" />
                </Button>
                <Button
                  onClick={() => handleDeleteProduct(product.id)}
                  variant="secondary"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>

            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
            )}

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  value={quantities[product.id] || ''}
                  onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  placeholder="Enter quantity"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Button
                  onClick={() => handlePlaceOrder(product)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={!product.inStock || !(quantities[product.id] > 0)}
                >
                  <ShoppingCart className="size-4 mr-2" />
                  Order
                </Button>
              </div>

              <div className="flex gap-2 items-center">
                <label className="text-sm font-medium text-slate-700">Stock Quantity:</label>
                <input
                  type="number"
                  min="0"
                  value={product.stockQuantity}
                  onChange={(e) => handleStockQuantityChange(product.id, e.target.value)}
                  className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
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
          <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="size-4 mr-2" />
            Add Product
          </Button>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)} title={editingProduct ? "Edit Product" : "Add New Product"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product name"
            />
          </div>

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
            <label className="block text-sm font-medium text-slate-700 mb-2">Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter image URL"
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
              Cancel
            </Button>
            <Button
              onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
