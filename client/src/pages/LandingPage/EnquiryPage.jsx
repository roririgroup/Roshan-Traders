import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  Factory, 
  CheckCircle2,
  Calculator,
  Navigation,
  CreditCard,
  Wallet,
  User,
  X,
  IndianRupee,
  ChevronRight,
  RotateCcw,
  Square,
  Home,
  Layers
}
 from 'lucide-react';
 

function EnquiryPage() {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [truckRent, setTruckRent] = useState(0);
  const [quantity, setQuantity] = useState(1000);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showCashOptions, setShowCashOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    product: '',
    quantity: '',
    deliveryAddress: ''
  });

  // Product pricing
  const productRates = {
    'Red Clay Bricks': 9,
    'Clay Floor Tiles': 45,
    'Roof Tiles': 85
  };

  const companyLocation = { lat: 8.5252374, lng: 77.5806626 };

  const navigate = useNavigate();

  useEffect(() => {
    const product = localStorage.getItem('selectedProduct');
    if (product) {
      setSelectedProduct(product);
      setFormData(prev => ({ ...prev, product }));
      // Reset quantity based on product type
      if (product === 'Red Clay Bricks') {
        setQuantity(1000);
      } else {
        setQuantity(100);
      }
    }
  }, []);

  // Get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userLoc);
          calculateDistance(userLoc);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Calculate distance using Haversine formula
  const calculateDistance = (userLoc) => {
    const R = 6371;
    const dLat = (userLoc.lat - companyLocation.lat) * Math.PI / 180;
    const dLng = (userLoc.lng - companyLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(companyLocation.lat * Math.PI / 180) * Math.cos(userLoc.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const calculatedDistance = R * c;
    setDistance(calculatedDistance.toFixed(1));
    calculateTruckRent(calculatedDistance);
  };

  // Calculate truck rent based on distance
  const calculateTruckRent = (dist) => {
    let rent = 0;
    if (dist <= 10) {
      rent = 1000;
    } else if (dist <= 20) {
      rent = 1500;
    } else if (dist <= 30) {
      rent = 2000;
    } else if (dist <= 40) {
      rent = 2500;
    } else if (dist <= 50) {
      rent = 3000;
    } else {
      rent = 3000 + (dist - 50) * 60;
    }
    setTruckRent(Math.round(rent));
  };

  // Get current product rate
  const getCurrentRate = () => {
    return productRates[selectedProduct] || 0;
  };

  // Calculate total cost
  const calculateTotalCost = () => {
    const productCost = quantity * getCurrentRate();
    return productCost + truckRent;
  };

  // Get quantity range based on product
  const getQuantityRange = () => {
    switch(selectedProduct) {
      case 'Red Clay Bricks':
        return { min: 100, max: 10000, step: 100, unit: 'bricks' };
      case 'Clay Floor Tiles':
        return { min: 10, max: 5000, step: 10, unit: 'tiles' };
      case 'Roof Tiles':
        return { min: 10, max: 3000, step: 10, unit: 'tiles' };
      default:
        return { min: 100, max: 10000, step: 100, unit: 'units' };
    }
  };

  // Get product icon
  const getProductIcon = () => {
    switch(selectedProduct) {
      case 'Red Clay Bricks':
        return <Square className="h-8 w-8 text-[#B0413E]" />;
      case 'Clay Floor Tiles':
        return <Home className="h-8 w-8 text-[#B0413E]" />;
      case 'Roof Tiles':
        return <Layers className="h-8 w-8 text-[#B0413E]" />;
      default:
        return <Calculator className="h-8 w-8 text-[#B0413E]" />;
    }
  };

  // Get product description
  const getProductDescription = () => {
    switch(selectedProduct) {
      case 'Red Clay Bricks':
        return 'Premium quality red clay bricks fired at high temperatures for maximum durability and strength.';
      case 'Clay Floor Tiles':
        return 'Traditional handcrafted clay floor tiles with superior finish, perfect for both indoor and outdoor applications.';
      case 'Roof Tiles':
        return 'Weather-resistant clay roof tiles designed to withstand harsh climatic conditions while maintaining aesthetic appeal.';
      default:
        return 'Calculate your total cost including product and delivery charges.';
    }
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    if (method === 'online') {
      setShowPaymentPopup(true);
      setShowCashOptions(false);
    } else if (method === 'cash') {
      setShowCashOptions(true);
      setShowPaymentPopup(false);
    }
  };

  // Handle online payment selection
  const handleOnlinePaymentSelect = (method) => {
    alert(`Redirecting to ${method} payment...`);
    setShowPaymentPopup(false);
    setSelectedPaymentMethod('');
  };

  // Handle cash option selection
  const handleCashOptionSelect = (option) => {
    alert(`You selected: ${option}. Our delivery executive will contact you for payment details.`);
    setShowCashOptions(false);
    setSelectedPaymentMethod('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const enquiryData = {
      ...formData,
      calculatedCost: calculateTotalCost(),
      distance: distance,
      truckRent: truckRent,
      quantity: quantity,
      productRate: getCurrentRate(),
      timestamp: new Date().toISOString(),
      enquiryId: 'ENQ-' + Date.now()
    };
    
    localStorage.setItem('latestEnquiry', JSON.stringify(enquiryData));
    
    alert(`Thank you for your enquiry about ${formData.product}! We will contact you within 24 hours.`);
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      product: selectedProduct,
      quantity: '',
      deliveryAddress: ''
    });
    
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const products = [
    {
      name: 'Red Clay Bricks',
      specs: ['Size: 230 x 110 x 75 mm', 'Compressive Strength: 10-15 N/mm²', 'Rate: ₹9 per brick'],
      description: 'Premium quality red clay bricks fired at high temperatures for maximum durability and strength.'
    },
    {
      name: 'Clay Floor Tiles', 
      specs: ['Size: 300 x 300 x 15 mm', 'Water Absorption: <8%', 'Rate: ₹45 per tile'],
      description: 'Traditional handcrafted clay floor tiles with superior finish, perfect for both indoor and outdoor applications.'
    },
    {
      name: 'Roof Tiles',
      specs: ['Size: 400 x 240 x 18 mm', 'Weight: 3.5 kg per tile', 'Rate: ₹85 per tile'],
      description: 'Weather-resistant clay roof tiles designed to withstand harsh climatic conditions while maintaining aesthetic appeal.'
    }
  ];

  const currentProduct = products.find(p => p.name === selectedProduct) || {};
  const quantityRange = getQuantityRange();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8D7C3] to-[#F5E8D9]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-[#4A2F2A] hover:text-[#B0413E] transition-colors font-medium"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <Factory className="h-8 w-8 text-[#B0413E]" />
              <div>
                <h1 className="text-xl font-bold text-[#4A2F2A]">Roshan Traders</h1>
                <p className="text-xs text-gray-600 text-right">Since 1960</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Info Banner */}
        {selectedProduct && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-l-4 border-[#B0413E]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#4A2F2A] mb-2">
                  Enquiring About: {selectedProduct}
                </h2>
                <p className="text-gray-600">{currentProduct.description}</p>
                <div className="flex flex-wrap gap-4 mt-3">
                  {currentProduct.specs && currentProduct.specs.map((spec, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-700">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Enquiry Form */}
          <div className="xl:col-span-2 space-y-8">
            {/* Enquiry Form */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-[#4A2F2A] text-white p-6">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-6 w-6 text-[#B0413E]" />
                  <h2 className="text-2xl font-bold">Send Your Enquiry</h2>
                </div>
                <p className="text-[#E8D7C3] mt-2">
                  Fill in your details and we'll get back to you within 24 hours
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#B0413E] focus:ring-2 focus:ring-[#B0413E]/20 transition-colors"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#B0413E] focus:ring-2 focus:ring-[#B0413E]/20 transition-colors"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#B0413E] focus:ring-2 focus:ring-[#B0413E]/20 transition-colors"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product
                    </label>
                    <input
                      type="text"
                      value={formData.product}
                      onChange={(e) => setFormData({...formData, product: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#B0413E] focus:ring-2 focus:ring-[#B0413E]/20 transition-colors bg-gray-50"
                      placeholder="Product name"
                      readOnly
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#B0413E] focus:ring-2 focus:ring-[#B0413E]/20 transition-colors"
                    placeholder="Enter your complete delivery address"
                  ></textarea>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#B0413E] focus:ring-2 focus:ring-[#B0413E]/20 transition-colors"
                    placeholder={`Tell us more about your requirements for ${selectedProduct || 'the product'}...`}
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-[#B0413E] hover:bg-[#8d332e] text-white px-6 py-4 rounded-lg font-medium transition-colors duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Submit Enquiry
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-[#4A2F2A] mb-6">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-[#F8F4F0] rounded-lg">
                  <Phone className="h-8 w-8 text-[#B0413E] mx-auto mb-3" />
                  <h4 className="font-semibold text-[#4A2F2A] mb-1">Call Us</h4>
                  <p className="text-gray-600">+91-9876543210</p>
                </div>
                <div className="text-center p-4 bg-[#F8F4F0] rounded-lg">
                  <Mail className="h-8 w-8 text-[#B0413E] mx-auto mb-3" />
                  <h4 className="font-semibold text-[#4A2F2A] mb-1">Email Us</h4>
                  <p className="text-gray-600">info@roshantraders.com</p>
                </div>
                <div className="text-center p-4 bg-[#F8F4F0] rounded-lg">
                  <MapPin className="h-8 w-8 text-[#B0413E] mx-auto mb-3" />
                  <h4 className="font-semibold text-[#4A2F2A] mb-1">Visit Us</h4>
                  <p className="text-gray-600 text-sm">Industrial Area, City</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Price Calculator */}
          <div className="xl:col-span-1">
            {/* Calculator Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                {getProductIcon()}
                <h3 className="text-2xl font-bold text-[#4A2F2A]">
                  {selectedProduct ? `${selectedProduct} Calculator` : 'Cost Calculator'}
                </h3>
              </div>

              <p className="text-gray-600 mb-6 text-sm">
                {getProductDescription()}
              </p>

              {/* Distance Rates */}
              <div className="mb-6 p-4 bg-[#F8F4F0] rounded-lg border border-[#E8D7C3]">
                <h4 className="font-semibold text-[#4A2F2A] mb-2">Delivery Rates:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>0-10 km:</span>
                    <span className="font-semibold text-[#B0413E]">₹1000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>11-20 km:</span>
                    <span className="font-semibold text-[#B0413E]">₹1500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>21-30 km:</span>
                    <span className="font-semibold text-[#B0413E]">₹2000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>31-40 km:</span>
                    <span className="font-semibold text-[#B0413E]">₹2500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>41-50 km:</span>
                    <span className="font-semibold text-[#B0413E]">₹3000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>50+ km:</span>
                    <span className="font-semibold text-[#B0413E]">₹60/km</span>
                  </div>
                </div>
              </div>

              {/* Product Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedProduct || 'Product'} Quantity
                </label>
                <input
                  type="range"
                  min={quantityRange.min}
                  max={quantityRange.max}
                  step={quantityRange.step}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">{quantityRange.min} {quantityRange.unit}</span>
                  <span className="text-lg font-bold text-[#B0413E]">
                    {quantity.toLocaleString()} {quantityRange.unit}
                  </span>
                  <span className="text-sm text-gray-600">{quantityRange.max.toLocaleString()} {quantityRange.unit}</span>
                </div>
              </div>

              {/* Location Distance */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Distance
                </label>
                <button
                  onClick={getUserLocation}
                  className="w-full bg-[#B0413E] hover:bg-[#8d332e] text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Navigation className="h-5 w-5" />
                  {userLocation ? 'Recalculate Distance' : 'Calculate Distance from My Location'}
                </button>
                {distance && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-800 font-medium">
                      Distance: {distance} km | Truck Rent: ₹{truckRent}
                    </p>
                  </div>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {selectedProduct || 'Product'} Cost ({quantity} × ₹{getCurrentRate()})
                  </span>
                  <span className="font-semibold">₹{(quantity * getCurrentRate()).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Truck Delivery</span>
                  <span className="font-semibold">₹{truckRent.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between items-center text-lg font-bold text-[#4A2F2A]">
                  <span>Total Cost</span>
                  <span>₹{calculateTotalCost().toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <h4 className="font-semibold text-[#4A2F2A] mb-3">Select Payment Method:</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handlePaymentMethodSelect('online')}
                    className={`p-3 border-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      selectedPaymentMethod === 'online' 
                        ? 'border-[#B0413E] bg-[#B0413E] text-white' 
                        : 'border-gray-300 hover:border-[#B0413E] text-gray-700'
                    }`}
                  >
                    <CreditCard className="h-5 w-5" />
                    Online
                  </button>
                  <button
                    onClick={() => handlePaymentMethodSelect('cash')}
                    className={`p-3 border-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      selectedPaymentMethod === 'cash' 
                        ? 'border-[#B0413E] bg-[#B0413E] text-white' 
                        : 'border-gray-300 hover:border-[#B0413E] text-gray-700'
                    }`}
                  >
                    <Wallet className="h-5 w-5" />
                    Cash
                  </button>
                </div>
              </div>

              {/* Return Policy */}
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <RotateCcw className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-800 font-medium">
                  Return Option Available - 7 Days Return Policy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Online Payment Popup */}
      {showPaymentPopup && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#4A2F2A]">Choose Payment Method</h3>
              <button
                onClick={() => setShowPaymentPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleOnlinePaymentSelect('G-Pay')}
                className="w-full p-4 border-2 border-green-200 rounded-lg bg-green-50 hover:bg-green-100 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <IndianRupee className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-semibold text-green-800">G-Pay</span>
                </div>
                <ChevronRight className="h-5 w-5 text-green-600" />
              </button>

              <button
                onClick={() => handleOnlinePaymentSelect('Paytm')}
                className="w-full p-4 border-2 border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <IndianRupee className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-semibold text-blue-800">Paytm</span>
                </div>
                <ChevronRight className="h-5 w-5 text-blue-600" />
              </button>

              <button
                onClick={() => handleOnlinePaymentSelect('PhonePe')}
                className="w-full p-4 border-2 border-purple-200 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <IndianRupee className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-semibold text-purple-800">PhonePe</span>
                </div>
                <ChevronRight className="h-5 w-5 text-purple-600" />
              </button>

              <button
                onClick={() => handleOnlinePaymentSelect('Credit/Debit Card')}
                className="w-full p-4 border-2 border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-semibold text-gray-800">Credit/Debit Card</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
              <p className="text-yellow-800 text-sm">
                Secure payment processed through encrypted channels
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cash on Delivery Options Popup */}
      {showCashOptions && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#4A2F2A]">Cash on Delivery Options</h3>
              <button
                onClick={() => setShowCashOptions(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Full Amount to Driver
                </h4>
                <p className="text-green-700 text-sm">
                  Pay the complete amount (₹{calculateTotalCost().toLocaleString()}) directly to our delivery executive when the goods arrive.
                </p>
                <button
                  onClick={() => handleCashOptionSelect('Full Amount to Driver')}
                  className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Select This Option
                </button>
              </div>

              <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Partial Advance + Balance to Driver
                </h4>
                <p className="text-blue-700 text-sm">
                  Pay ₹{(calculateTotalCost() * 0.3).toLocaleString()} advance now and remaining ₹{(calculateTotalCost() * 0.7).toLocaleString()} to driver.
                </p>
                <button
                  onClick={() => handleCashOptionSelect('Partial Advance + Balance to Driver')}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Select This Option
                </button>
              </div>

              <div className="p-4 border-2 border-orange-200 rounded-lg bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Office Payment
                </h4>
                <p className="text-orange-700 text-sm">
                  Visit our office to make the payment and schedule delivery. Get additional 2% discount.
                </p>
                <button
                  onClick={() => handleCashOptionSelect('Office Payment')}
                  className="mt-3 w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Select This Option
                </button>
              </div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-700 text-sm">
                Our delivery executive will call you 30 minutes before arrival
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnquiryPage;