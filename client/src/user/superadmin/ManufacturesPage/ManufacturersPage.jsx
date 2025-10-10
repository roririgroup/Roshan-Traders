// ManufacturersPage.jsx
import React, { useState, useEffect } from 'react';

const ManufacturersPage = () => {
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [showCart, setShowCart] = useState(false);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  // Form states
  const [newCompany, setNewCompany] = useState({
    name: '',
    description: '',
    location: '',
    established: '',
    products: [{ name: '', price: '', description: '' }]
  });

  // Default images for companies
  const defaultCompanyImages = [
    '🏭', '🏢', '🏗️', '🔨', '⚒️', '🛠️', '🏛️', '🏤'
  ];

  const defaultProductImages = [
    '🧱', '🔳', '🧩', '📦', '🎁', '📐', '📏', '🧰'
  ];

  const getRandomImage = (images) => {
    return images[Math.floor(Math.random() * images.length)];
  };

  // Sample data
  useEffect(() => {
    const sampleData = [
      {
        id: 1,
        name: "ClayCraft Bricks Co.",
        description: "Leading manufacturer of high-quality clay bricks for over 50 years.",
        location: "Chennai, Tamil Nadu",
        established: "1972",
        image: '🏭',
        products: [
          { id: 101, name: "Red Clay Brick", price: 8.50, description: "Standard red clay brick for general construction", image: '🧱' },
          { id: 102, name: "Hollow Brick", price: 12.75, description: "Lightweight hollow brick for partition walls", image: '🔳' },
          { id: 103, name: "Engineering Brick", price: 15.20, description: "High strength brick for structural applications", image: '🧩' }
        ]
      },
      {
        id: 2,
        name: "Modern Concrete Blocks",
        description: "Innovative concrete block solutions for modern construction.",
        location: "Hyderabad, Telangana",
        established: "1995",
        image: '🏢',
        products: [
          { id: 201, name: "Solid Concrete Block", price: 9.80, description: "Durable solid block for load-bearing walls", image: '📦' },
          { id: 202, name: "Paver Block", price: 22.50, description: "Decorative paver for landscaping and pathways", image: '🎁' },
          { id: 203, name: "Fly Ash Brick", price: 7.90, description: "Eco-friendly brick made from fly ash", image: '🧱' }
        ]
      }
    ];
    setManufacturers(sampleData);
  }, []);

  // View Details Handler
  const handleViewDetails = (manufacturer) => {
    setSelectedManufacturer(manufacturer);
    setSelectedProduct(null);
  };

  const handleBackToList = () => {
    setSelectedManufacturer(null);
    setSelectedProduct(null);
  };

  // Product Selection and Ordering
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setOrderQuantity(1);
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      const existingItem = cart.find(item => item.id === selectedProduct.id);
      
      if (existingItem) {
        setCart(cart.map(item => 
          item.id === selectedProduct.id 
            ? { ...item, quantity: item.quantity + orderQuantity }
            : item
        ));
      } else {
        setCart([...cart, { ...selectedProduct, quantity: orderQuantity }]);
      }
      
      alert(`${orderQuantity} ${selectedProduct.name}(s) added to cart!`);
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    alert(`Order placed successfully! Total: ₹${calculateTotal()}`);
    setCart([]);
    setShowCart(false);
  };

  // Company Management Functions
  const handleAddCompany = () => {
    setShowAddCompanyModal(true);
    setNewCompany({
      name: '',
      description: '',
      location: '',
      established: '',
      products: [{ name: '', price: '', description: '' }]
    });
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setNewCompany({
      name: company.name,
      description: company.description,
      location: company.location,
      established: company.established,
      products: company.products.map(p => ({
        name: p.name,
        price: p.price,
        description: p.description
      }))
    });
    setShowEditCompanyModal(true);
  };

  const handleDeleteCompany = (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      setManufacturers(manufacturers.filter(company => company.id !== companyId));
      if (selectedManufacturer && selectedManufacturer.id === companyId) {
        setSelectedManufacturer(null);
      }
    }
  };

  const handleSaveCompany = (e) => {
    e.preventDefault();
    
    if (showAddCompanyModal) {
      // Add new company
      const companyToAdd = {
        id: Date.now(),
        name: newCompany.name,
        description: newCompany.description,
        location: newCompany.location,
        established: newCompany.established,
        image: getRandomImage(defaultCompanyImages),
        products: newCompany.products
          .filter(product => product.name.trim() !== '')
          .map((product, index) => ({
            id: Date.now() + index,
            name: product.name,
            price: parseFloat(product.price) || 0,
            description: product.description,
            image: getRandomImage(defaultProductImages)
          }))
      };

      setManufacturers([...manufacturers, companyToAdd]);
      setShowAddCompanyModal(false);
      alert('Company added successfully!');
    } else if (showEditCompanyModal && editingCompany) {
      // Update existing company
      const updatedCompanies = manufacturers.map(company =>
        company.id === editingCompany.id
          ? {
              ...company,
              name: newCompany.name,
              description: newCompany.description,
              location: newCompany.location,
              established: newCompany.established,
              products: newCompany.products
                .filter(product => product.name.trim() !== '')
                .map((product, index) => ({
                  id: product.id || Date.now() + index,
                  name: product.name,
                  price: parseFloat(product.price) || 0,
                  description: product.description,
                  image: product.image || getRandomImage(defaultProductImages)
                }))
            }
          : company
      );

      setManufacturers(updatedCompanies);
      
      if (selectedManufacturer && selectedManufacturer.id === editingCompany.id) {
        setSelectedManufacturer(updatedCompanies.find(c => c.id === editingCompany.id));
      }
      
      setShowEditCompanyModal(false);
      setEditingCompany(null);
      alert('Company updated successfully!');
    }
  };

  const handleAddProductField = () => {
    setNewCompany({
      ...newCompany,
      products: [...newCompany.products, { name: '', price: '', description: '' }]
    });
  };

  const handleRemoveProductField = (index) => {
    const updatedProducts = newCompany.products.filter((_, i) => i !== index);
    setNewCompany({
      ...newCompany,
      products: updatedProducts
    });
  };

  const handleProductFieldChange = (index, field, value) => {
    const updatedProducts = newCompany.products.map((product, i) =>
      i === index ? { ...product, [field]: value } : product
    );
    setNewCompany({
      ...newCompany,
      products: updatedProducts
    });
  };

  // Modal Component
  const CompanyModal = ({ isOpen, onClose, isEdit, company }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEdit ? 'Edit Company' : 'Add New Company'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSaveCompany} className="p-6 space-y-6">
            {/* Company Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={newCompany.description}
                  onChange={(e) => setNewCompany({...newCompany, description: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={newCompany.location}
                    onChange={(e) => setNewCompany({...newCompany, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Established Year *
                  </label>
                  <input
                    type="text"
                    value={newCompany.established}
                    onChange={(e) => setNewCompany({...newCompany, established: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Products</h3>
                <button
                  type="button"
                  onClick={handleAddProductField}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                >
                  + Add Product
                </button>
              </div>

              <div className="space-y-6">
                {newCompany.products.map((product, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-800">Product {index + 1}</h4>
                      {newCompany.products.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveProductField(index)}
                          className="px-3 py-1 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors text-sm font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) => handleProductFieldChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price (₹) *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={product.price}
                            onChange={(e) => handleProductFieldChange(index, 'price', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          value={product.description}
                          onChange={(e) => handleProductFieldChange(index, 'description', e.target.value)}
                          rows="2"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                {isEdit ? 'Update Company' : 'Add Company'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Cart Modal Component
  const CartModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl w-full max-w-md">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-6 max-h-96 overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{item.image}</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-600">₹{item.price.toFixed(2)} × {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="text-rose-500 hover:text-rose-700 text-sm mt-1 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Total: ₹{calculateTotal()}</h3>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition-colors font-semibold"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-12 px-4 shadow-xl">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bricks Manufacturing Companies</h1>
          <p className="text-xl mb-8 opacity-90">Find the best brick manufacturers and place your orders</p>
          <button
            onClick={handleAddCompany}
            className="bg-white text-indigo-600 px-8 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            + Add New Company
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        {!selectedManufacturer ? (
          // Manufacturers List View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {manufacturers.map(manufacturer => (
              <div key={manufacturer.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 relative">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl bg-white bg-opacity-20 p-3 rounded-xl">
                      {manufacturer.image}
                    </span>
                    <h3 className="text-xl font-bold text-white flex-1">{manufacturer.name}</h3>
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCompany(manufacturer);
                      }}
                      className="bg-white bg-opacity-20 p-2 rounded-lg hover:bg-opacity-30 transition-colors backdrop-blur-sm"
                      title="Edit Company"
                    >
                      <span className="text-white">✏️</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCompany(manufacturer.id);
                      }}
                      className="bg-white bg-opacity-20 p-2 rounded-lg hover:bg-opacity-30 transition-colors backdrop-blur-sm"
                      title="Delete Company"
                    >
                      <span className="text-white">🗑️</span>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4 leading-relaxed">{manufacturer.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm flex items-center">
                      <span className="font-semibold text-gray-800 mr-2">📍</span>
                      <span>{manufacturer.location}</span>
                    </p>
                    <p className="text-sm flex items-center">
                      <span className="font-semibold text-gray-800 mr-2">📅</span>
                      <span>Established: {manufacturer.established}</span>
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="mr-2">📦</span>
                      Products:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {manufacturer.products.slice(0, 3).map(product => (
                        <li key={product.id} className="flex items-center">
                          <span className="mr-2">{product.image}</span>
                          {product.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <button
                    onClick={() => handleViewDetails(manufacturer)}
                    className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                  >
                    View Details & Products
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Manufacturer Details View
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            {/* Header with Back Button */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 flex justify-between items-center">
              <button
                onClick={handleBackToList}
                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors flex items-center space-x-2 backdrop-blur-sm font-medium"
              >
                <span>←</span>
                <span>Back to Manufacturers</span>
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleEditCompany(selectedManufacturer)}
                  className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors backdrop-blur-sm font-medium"
                >
                  Edit Company
                </button>
                <button
                  onClick={() => handleDeleteCompany(selectedManufacturer.id)}
                  className="bg-rose-500 bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors backdrop-blur-sm font-medium"
                >
                  Delete Company
                </button>
              </div>
            </div>

            {/* Company Info */}
            <div className="p-8 border-b border-gray-200">
              <div className="flex items-start space-x-6">
                <div className="bg-gradient-to-br from-indigo-100 to-purple-200 rounded-2xl p-8 flex items-center justify-center">
                  <span className="text-6xl">{selectedManufacturer.image}</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{selectedManufacturer.name}</h2>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">{selectedManufacturer.description}</p>
                  <div className="flex flex-wrap gap-6 text-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-indigo-600">📍</span>
                      <span className="text-gray-800 font-medium">{selectedManufacturer.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-indigo-600">📅</span>
                      <span className="text-gray-800 font-medium">Established: {selectedManufacturer.established}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Section */}
            {!selectedProduct ? (
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="mr-3">📦</span>
                  Our Products
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedManufacturer.products.map(product => (
                    <div key={product.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 bg-white">
                      <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl p-8 mb-4 flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-300 transition-colors">
                        <span className="text-4xl">{product.image}</span>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-3">{product.name}</h4>
                      <p className="text-gray-600 mb-4 leading-relaxed text-sm">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-emerald-600">₹{product.price.toFixed(2)}</span>
                        <button
                          onClick={() => handleProductSelect(product)}
                          className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors font-medium shadow-md hover:shadow-lg"
                        >
                          View & Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Product Details View
              <div className="p-8">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors mb-6 flex items-center space-x-2 font-medium"
                >
                  <span>←</span>
                  <span>Back to Products</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Product Image */}
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl p-12 flex items-center justify-center">
                    <span className="text-8xl">{selectedProduct.image}</span>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-800 mb-4">{selectedProduct.name}</h3>
                      <p className="text-gray-600 text-lg leading-relaxed">{selectedProduct.description}</p>
                    </div>

                    <div className="text-3xl font-bold text-emerald-600">₹{selectedProduct.price.toFixed(2)} per unit</div>

                    {/* Order Section */}
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 space-y-6 border border-gray-200">
                      <div className="flex items-center space-x-4">
                        <label className="text-lg font-semibold text-gray-800">Quantity:</label>
                        <input
                          type="number"
                          min="1"
                          value={orderQuantity}
                          onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 1)}
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
                        />
                      </div>

                      <div className="text-2xl font-bold text-gray-800">
                        Total: ₹{(selectedProduct.price * orderQuantity).toFixed(2)}
                      </div>

                      <button
                        onClick={handleAddToCart}
                        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        🛒 Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 font-semibold z-40 group"
      >
        <span className="flex items-center space-x-2">
          <span className="text-lg">🛒</span>
          <span>Cart ({cart.reduce((total, item) => total + item.quantity, 0)})</span>
        </span>
      </button>

      {/* Modals */}
      <CompanyModal
        isOpen={showAddCompanyModal || showEditCompanyModal}
        onClose={() => {
          setShowAddCompanyModal(false);
          setShowEditCompanyModal(false);
          setEditingCompany(null);
        }}
        isEdit={showEditCompanyModal}
        company={editingCompany}
      />

      <CartModal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
      />
    </div>
  );
};

export default ManufacturersPage;