import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import FilterBar from '../../../components/ui/FilterBar'
import { Package, Plus, ShoppingCart, Edit, Trash2 } from 'lucide-react'
import { addOrder } from '../../../store/ordersStore'

export default function Products() {
  const [products, setProducts] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showAddStockModal, setShowAddStockModal] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [addStockQuantity, setAddStockQuantity] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    inStock: true,
    stockQuantity: 0
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
        inStock: true,
        stockQuantity: 1000
      },
      {
        id: 2,
        name: 'Teak Wood Planks',
        price: 1500,
        description: 'Durable teak wood planks for furniture and flooring',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzIl7C3rTQgMq-f60VgT8om7PIJM4biVD0tA&s',
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

  // Add Stock Modal handlers
  const openAddStockModal = (productId) => {
    setSelectedProductId(productId)
    setAddStockQuantity('')
    setShowAddStockModal(true)
  }

  const handleConfirmAddStock = () => {
    const qty = Number(addStockQuantity)
    if (!qty || qty <= 0) {
      alert('Please enter a valid quantity to add')
      return
    }
    setProducts(prev => prev.map(product => {
      if (product.id !== selectedProductId) return product
      const current = Number(product.stockQuantity || 0)
      const updated = current + qty
      return { ...product, stockQuantity: updated, inStock: updated > 0 }
    }))
    setShowAddStockModal(false)
    setSelectedProductId(null)
    setAddStockQuantity('')
  }

  return (
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
                <p className="text-xl font-bold text-slate-900 mb-2">₹{product.price.toLocaleString()}</p>
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

            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
            )}

            </div>

            <div className="space-y-3 mt-4">
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  value={quantities[product.id] || ''}
                  onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  placeholder="Enter order qty"
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

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
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
                <Button
                  onClick={() => openAddStockModal(product.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  size="sm"
                  title="Add Stock"
                >
                  <Plus className="size-4" />
                  Add Stock
                </Button>
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
      <Modal inline isOpen={showAddForm} onClose={() => setShowAddForm(false)} title={editingProduct ? "Edit Product" : "Add New Product"}>
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

      {/* Add Stock Modal */}
      <Modal inline isOpen={showAddStockModal} onClose={() => setShowAddStockModal(false)} title="Add Stock">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Quantity to Add</label>
            <input
              type="number"
              min="1"
              value={addStockQuantity}
              onChange={(e) => setAddStockQuantity(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter quantity"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowAddStockModal(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" onClick={handleConfirmAddStock}>Add</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
