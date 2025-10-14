import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bricksImage from '../../assets/bricks.jpg';
import brick from '../../assets/brick.jpg';
import layingBricksImage from '../../assets/laying bricks.jpg';
import floortile from '../../assets/floor-tile.jpg';
import roof from '../../assets/roof.jpg';
import rooftile from '../../assets/roof-tile.jpg';
import floortiles from '../../assets/floor tile.jpg';
import tile from '../../assets/tile.jpg';

import {
  Factory,
  Shield,
  Truck,
  Award,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  X,
  Menu,
  ChevronRight,
  MessageSquare,
  CheckCircle2,
  IndianRupee,
  Navigation,
  Calculator,
  RotateCcw,
  CreditCard,
  Wallet,
  User
} from 'lucide-react';

function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [truckRent, setTruckRent] = useState(0);
  const [brickQuantity, setBrickQuantity] = useState(1000);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showCashOptions, setShowCashOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const navigate = useNavigate();

  // Brick pricing
  const brickRate = 9;
  const companyLocation = { lat: 8.5252374, lng: 77.5806626 };

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in-section').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
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

  // Calculate total cost
  const calculateTotalCost = () => {
    const brickCost = brickQuantity * brickRate;
    return brickCost + truckRent;
  };

  // Handle View Now button click
  const handleViewNowClick = (productName) => {
    localStorage.setItem('selectedProduct', productName);
    navigate('/enquiry');
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

  // Product data with pricing
  const products = [
    {
      id: 1,
      name: 'Red Clay Bricks',
      description: 'Premium quality red clay bricks fired at high temperatures for maximum durability and strength.',
      specs: [
        'Size: 230 x 110 x 75 mm',
        'Compressive Strength: 10-15 N/mm²',
        'Finish: Smooth/Rough',
        `Rate: ₹${brickRate} per brick`
      ],
      image: bricksImage,
      alt: 'Roshan Traders premium red clay bricks stacked at factory'
    },
    {
      id: 2,
      name: 'Clay Floor Tiles',
      description: 'Traditional handcrafted clay floor tiles with superior finish, perfect for both indoor and outdoor applications.',
      specs: [
        'Size: 300 x 300 x 15 mm',
        'Water Absorption: <8%',
        'Finish: Glazed/Unglazed',
        'Rate: ₹45 per tile'
      ],
      image: floortile,
      alt: 'Roshan Traders terracotta clay floor tiles with natural finish'
    },
    {
      id: 3,
      name: 'Roof Tiles',
      description: 'Weather-resistant clay roof tiles designed to withstand harsh climatic conditions while maintaining aesthetic appeal.',
      specs: [
        'Size: 400 x 240 x 18 mm',
        'Weight: 3.5 kg per tile',
        'Finish: Natural Red/Brown',
        'Rate: ₹85 per tile'
      ],
      image: roof,
      alt: 'Roshan Traders durable clay roof tiles installed on traditional building'
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      company: 'Kumar Constructions',
      text: 'We have been sourcing bricks from Roshan Traders for over 10 years. Their quality and consistency are unmatched in the industry.',
      rating: 5
    },
    {
      name: 'Priya Sharma',
      company: 'Sharma Architects',
      text: 'The clay floor tiles from Roshan Traders added authentic beauty to our heritage restoration project. Highly recommended!',
      rating: 5
    },
    {
      name: 'Mohammed Ali',
      company: 'Ali Builders & Developers',
      text: 'Reliable delivery, excellent quality, and competitive pricing. Roshan Traders has been our trusted partner for all roofing projects.',
      rating: 5
    }
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your inquiry! We will contact you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Company Name */}
            <div className="flex items-center space-x-3">
              <Factory className={`h-10 w-10 ${scrolled ? 'text-[#B0413E]' : 'text-white'}`} />
              <div>
                <h1 className={`text-2xl font-bold ${scrolled ? 'text-[#4A2F2A]' : 'text-white'}`}>
                  Roshan Traders
                </h1>
                <p className={`text-xs ${scrolled ? 'text-gray-600' : 'text-gray-200'}`}>
                  Since 1960
                </p>
              </div>
            </div>

            {/* Desktop Navigation Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/superadmin/login" className="bg-[#B0413E] hover:bg-[#8d332e] text-white px-6 py-2.5 rounded-md font-medium transition-colors duration-200 shadow-md">
                Super Admin Login
              </Link>
              <Link to="/user/login" className={`border-2 px-6 py-2.5 rounded-md font-medium transition-colors duration-200 ${
                scrolled
                  ? 'border-[#B0413E] text-[#B0413E] hover:bg-[#B0413E] hover:text-white'
                  : 'border-white text-white hover:bg-white hover:text-[#B0413E]'
              }`}>
                User Login
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className={`h-6 w-6 ${scrolled ? 'text-[#4A2F2A]' : 'text-white'}`} />
              ) : (
                <Menu className={`h-6 w-6 ${scrolled ? 'text-[#4A2F2A]' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-4 py-4 space-y-3">
              <Link to="/superadmin/login" className="w-full bg-[#B0413E] hover:bg-[#8d332e] text-white px-6 py-2.5 rounded-md font-medium transition-colors duration-200 block text-center">
                Super Admin Login
              </Link>
              <Link to="/user/login" className="w-full border-2 border-[#B0413E] text-[#B0413E] hover:bg-[#B0413E] hover:text-white px-6 py-2.5 rounded-md font-medium transition-colors duration-200 block text-center">
                User Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1600)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A2F2A]/90 to-[#B0413E]/70"></div>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto fade-in-section opacity-0">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Trusted Brick & Tile Makers Since 1960
          </h2>
          <p className="text-xl sm:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto">
            Building lasting structures with premium quality bricks, clay floor tiles, and roof tiles.
            Delivering durability, excellence, and tradition for over three decades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#B0413E] hover:bg-[#8d332e] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              View Products
              <ChevronRight className="h-5 w-5" />
            </button>
            <button 
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              className="bg-white hover:bg-gray-100 text-[#B0413E] px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Request a Quote
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="h-6 w-6 text-white rotate-90" />
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-[#E8D7C3]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-section opacity-0">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#4A2F2A] mb-4">
              Our Premium Products
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Crafted with precision, built to last. Explore our range of high-quality construction materials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="fade-in-section opacity-0 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.alt}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-[#B0413E] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Premium Quality
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-[#4A2F2A] mb-4">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="mb-8 space-y-3">
                    <p className="font-semibold text-[#B0413E] mb-3 text-lg">Key Specifications:</p>
                    {product.specs.map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-base text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleViewNowClick(product.name)}
                      className="w-full bg-[#B0413E] hover:bg-[#8d332e] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-lg"
                    >
                      <MessageSquare className="h-5 w-5" />
                      View Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Rates Section */}
          <div className="mt-20 fade-in-section opacity-0">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h3 className="text-3xl font-bold text-[#4A2F2A] mb-4">
                  Delivery & Pricing
                </h3>
                <p className="text-xl text-gray-700">
                  Transparent pricing with reliable delivery across all distances
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Distance Rates */}
                <div>
                  <h4 className="text-2xl font-bold text-[#4A2F2A] mb-6 flex items-center gap-3">
                    <Truck className="h-7 w-7 text-[#B0413E]" />
                    Delivery Rates
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-[#F8F4F0] rounded-lg border border-[#E8D7C3] hover:bg-[#F0E6D8] transition-colors">
                      <span className="text-lg font-medium">0-10 km</span>
                      <span className="text-xl font-bold text-[#B0413E]">₹1000</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-[#F8F4F0] rounded-lg border border-[#E8D7C3] hover:bg-[#F0E6D8] transition-colors">
                      <span className="text-lg font-medium">11-20 km</span>
                      <span className="text-xl font-bold text-[#B0413E]">₹1500</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-[#F8F4F0] rounded-lg border border-[#E8D7C3] hover:bg-[#F0E6D8] transition-colors">
                      <span className="text-lg font-medium">21-30 km</span>
                      <span className="text-xl font-bold text-[#B0413E]">₹2000</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-[#F8F4F0] rounded-lg border border-[#E8D7C3] hover:bg-[#F0E6D8] transition-colors">
                      <span className="text-lg font-medium">31-40 km</span>
                      <span className="text-xl font-bold text-[#B0413E]">₹2500</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-[#F8F4F0] rounded-lg border border-[#E8D7C3] hover:bg-[#F0E6D8] transition-colors">
                      <span className="text-lg font-medium">41-50 km</span>
                      <span className="text-xl font-bold text-[#B0413E]">₹3000</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-[#F8F4F0] rounded-lg border border-[#E8D7C3] hover:bg-[#F0E6D8] transition-colors">
                      <span className="text-lg font-medium">50+ km</span>
                      <span className="text-xl font-bold text-[#B0413E]">₹60/km</span>
                    </div>
                  </div>
                </div>

                {/* Product Pricing */}
                <div>
                  <h4 className="text-2xl font-bold text-[#4A2F2A] mb-6 flex items-center gap-3">
                    <IndianRupee className="h-7 w-7 text-[#B0413E]" />
                    Product Pricing
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-[#F8F4F0] rounded-lg border border-[#E8D7C3] hover:bg-[#F0E6D8] transition-colors">
                      <span className="text-lg font-medium">Red Clay Bricks</span>
                      <span className="text-xl font-bold text-[#B0413E]">₹9 per brick</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-[#F8F4F0] rounded-lg border border-[#E8D7C3] hover:bg-[#F0E6D8] transition-colors">
                      <span className="text-lg font-medium">Clay Floor Tiles</span>
                      <span className="text-xl font-bold text-[#B0413E]">₹45 per tile</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-[#F8F4F0] rounded-lg border border-[#E8D7C3] hover:bg-[#F0E6D8] transition-colors">
                      <span className="text-lg font-medium">Roof Tiles</span>
                      <span className="text-xl font-bold text-[#B0413E]">₹85 per tile</span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-8 p-6 bg-[#4A2F2A] rounded-lg text-white">
                    <h5 className="text-lg font-bold mb-3 text-[#E8D7C3]">Important Notes:</h5>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                        <span>Minimum order: 1000 bricks or equivalent</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                        <span>Free delivery on orders above ₹50,000 within 30km</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                        <span>Bulk discounts available for orders above 10,000 units</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#4A2F2A] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-8">
                <Factory className="h-12 w-12 text-[#B0413E]" />
                <div>
                  <h3 className="text-3xl font-bold">Roshan Traders</h3>
                  <p className="text-base text-gray-300 mt-1">Since 1960</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                Premium quality bricks, clay floor tiles, and roof tiles manufacturer. Building trust through excellence for over three decades.
              </p>
              <div className="flex items-center gap-3 text-lg text-gray-300">
                <Phone className="h-5 w-5" />
                <span>+91-9876543210</span>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-2xl font-bold mb-8 text-[#E8D7C3]">Contact Us</h4>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-[#B0413E] mt-1 flex-shrink-0" />
                  <p className="text-gray-300 text-lg">
                    Roshan Traders Factory<br />
                    Industrial Area, Sector 5<br />
                    City, State - 123456
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="h-6 w-6 text-[#B0413E] flex-shrink-0" />
                  <p className="text-gray-300 text-lg">+91-9876543210</p>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="h-6 w-6 text-[#B0413E] flex-shrink-0" />
                  <p className="text-gray-300 text-lg">info@roshantraders.com</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-2xl font-bold mb-8 text-[#E8D7C3]">Quick Links</h4>
              <ul className="space-y-4">
                <li><a href="#products" className="text-gray-300 hover:text-[#B0413E] transition-colors text-lg">Products</a></li>
                <li><a href="#about" className="text-gray-300 hover:text-[#B0413E] transition-colors text-lg">About Us</a></li>
                <li><a href="#quality" className="text-gray-300 hover:text-[#B0413E] transition-colors text-lg">Quality Process</a></li>
                <li><a href="#gallery" className="text-gray-300 hover:text-[#B0413E] transition-colors text-lg">Gallery</a></li>
                <li><a href="#contact" className="text-gray-300 hover:text-[#B0413E] transition-colors text-lg">Contact</a></li>
              </ul>
            </div>

            {/* Contact Form */}
            <div>
              <h4 className="text-2xl font-bold mb-8 text-[#E8D7C3]">Quick Inquiry</h4>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#B0413E] text-lg"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#B0413E] text-lg"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#B0413E] text-lg"
                  required
                />
                <textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#B0413E] text-lg"
                  required
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-[#B0413E] hover:bg-[#8d332e] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Social Media & Copyright */}
          <div className="border-t border-white/10 pt-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex gap-8">
                <a href="#" className="text-gray-300 hover:text-[#B0413E] transition-colors">
                  <Facebook className="h-8 w-8" />
                </a>
                <a href="#" className="text-gray-300 hover:text-[#B0413E] transition-colors">
                  <Twitter className="h-8 w-8" />
                </a>
                <a href="#" className="text-gray-300 hover:text-[#B0413E] transition-colors">
                  <Instagram className="h-8 w-8" />
                </a>
                <a href="#" className="text-gray-300 hover:text-[#B0413E] transition-colors">
                  <Linkedin className="h-8 w-8" />
                </a>
              </div>
              <p className="text-gray-400 text-lg">
                &copy; {new Date().getFullYear()} Roshan Traders. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;