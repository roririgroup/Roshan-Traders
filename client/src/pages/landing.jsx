import { useState, useEffect } from 'react';
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
  Download,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';

function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

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
            entry.target.classList.add('animate-fade-in');
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

  // Product data
  const products = [
    {
      id: 1,
      name: 'Red Clay Bricks',
      description: 'Premium quality red clay bricks fired at high temperatures for maximum durability and strength.',
      specs: [
        'Size: 230 x 110 x 75 mm',
        'Compressive Strength: 10-15 N/mm²',
        'Finish: Smooth/Rough'
      ],
      image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Roshan Traders premium red clay bricks stacked at factory'
    },
    {
      id: 2,
      name: 'Clay Floor Tiles',
      description: 'Traditional handcrafted clay floor tiles with superior finish, perfect for both indoor and outdoor applications.',
      specs: [
        'Size: 300 x 300 x 15 mm',
        'Water Absorption: <8%',
        'Finish: Glazed/Unglazed'
      ],
      image: 'https://images.pexels.com/photos/6419122/pexels-photo-6419122.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Roshan Traders terracotta clay floor tiles with natural finish'
    },
    {
      id: 3,
      name: 'Roof Tiles',
      description: 'Weather-resistant clay roof tiles designed to withstand harsh climatic conditions while maintaining aesthetic appeal.',
      specs: [
        'Size: 400 x 240 x 18 mm',
        'Weight: 3.5 kg per tile',
        'Finish: Natural Red/Brown'
      ],
      image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Roshan Traders durable clay roof tiles installed on traditional building'
    }
  ];

  // Manufacturing process steps
  const processSteps = [
    { icon: Factory, label: 'Raw Clay Selection', description: 'Premium clay sourcing' },
    { icon: Shield, label: 'Molding', description: 'Precision shaping' },
    { icon: Truck, label: 'Drying', description: 'Natural air drying' },
    { icon: Factory, label: 'Kiln Firing', description: 'High-temp firing' },
    { icon: Award, label: 'Packing', description: 'Quality packaging' }
  ];

  // Gallery images
  const galleryImages = [
    { url: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Red bricks stacked at Roshan Traders manufacturing facility' },
    { url: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Traditional clay kiln at Roshan Traders factory' },
    { url: 'https://images.pexels.com/photos/6419122/pexels-photo-6419122.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Clay floor tiles production line' },
    { url: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Finished roof tiles ready for dispatch' },
    { url: 'https://images.pexels.com/photos/1669754/pexels-photo-1669754.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Quality inspection at Roshan Traders facility' },
    { url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Workers crafting premium clay tiles' }
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
                  Since 1990
                </p>
              </div>
            </div>

            {/* Desktop Navigation Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                className="bg-[#B0413E] hover:bg-[#8d332e] text-white px-6 py-2.5 rounded-md font-medium transition-colors duration-200 shadow-md"
                onClick={() => window.location.href = '/superadmin/login'}
              >
                Super Admin Login
              </button>
              <button
                className={`border-2 px-6 py-2.5 rounded-md font-medium transition-colors duration-200 ${
                  scrolled
                    ? 'border-[#B0413E] text-[#B0413E] hover:bg-[#B0413E] hover:text-white'
                    : 'border-white text-white hover:bg-white hover:text-[#B0413E]'
                }`}
                onClick={() => window.location.href = '/user/login'}
              >
                User Login
              </button>
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
              <button className="w-full bg-[#B0413E] hover:bg-[#8d332e] text-white px-6 py-2.5 rounded-md font-medium transition-colors duration-200">
                Super Admin Login
              </button>
              <button className="w-full border-2 border-[#B0413E] text-[#B0413E] hover:bg-[#B0413E] hover:text-white px-6 py-2.5 rounded-md font-medium transition-colors duration-200">
                User Login
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Parallax Effect */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1600)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A2F2A]/90 to-[#B0413E]/70"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-fade-in">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Trusted Brick & Tile Makers Since 1990
          </h2>
          <p className="text-xl sm:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto">
            Building lasting structures with premium quality bricks, clay floor tiles, and roof tiles.
            Delivering durability, excellence, and tradition for over three decades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#B0413E] hover:bg-[#8d332e] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-2">
              View Products
              <ChevronRight className="h-5 w-5" />
            </button>
            <button className="bg-white hover:bg-gray-100 text-[#B0413E] px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              Request a Quote
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
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
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#4A2F2A] mb-3">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {product.description}
                  </p>
                  <div className="mb-6 space-y-2">
                    <p className="font-semibold text-[#B0413E] mb-2">Key Specifications:</p>
                    {product.specs.map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        {spec}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-[#B0413E] hover:bg-[#8d332e] text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                      <Download className="h-4 w-4" />
                      Download Spec
                    </button>
                    <button className="flex-1 border-2 border-[#B0413E] text-[#B0413E] hover:bg-[#B0413E] hover:text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Enquire Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality & Manufacturing Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-section opacity-0">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#4A2F2A] mb-4">
              Our Manufacturing Excellence
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              A time-tested process ensuring consistent quality and durability in every product.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="fade-in-section opacity-0 text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#B0413E] to-[#8d332e] rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <step.icon className="h-12 w-12 text-white" />
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-[70%] w-full h-0.5 bg-gradient-to-r from-[#B0413E] to-[#E8D7C3]">
                      <ChevronRight className="absolute -right-2 -top-3 h-6 w-6 text-[#B0413E]" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-[#4A2F2A] mt-6 mb-2">
                  {step.label}
                </h3>
                <p className="text-sm text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-[#E8D7C3]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-section opacity-0">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#4A2F2A] mb-4">
              Our Facility & Products
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Take a glimpse into our state-of-the-art manufacturing facility and premium products.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="fade-in-section opacity-0 relative h-64 rounded-lg overflow-hidden shadow-lg cursor-pointer group"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedImage(image.url)}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#4A2F2A]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <p className="text-white text-sm font-medium px-4 text-center">
                    Click to view
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-8 w-8" />
          </button>
          <img
            src={selectedImage}
            alt="Enlarged gallery view"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-section opacity-0">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#4A2F2A] mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Building trust through quality and reliability for over 30 years.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="fade-in-section opacity-0 bg-[#E8D7C3]/30 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Award key={i} className="h-5 w-5 text-[#B0413E] fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="border-t border-[#B0413E]/20 pt-4">
                  <p className="font-bold text-[#4A2F2A]">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Partner Logos Placeholder */}
          <div className="fade-in-section opacity-0 text-center">
            <p className="text-lg font-semibold text-[#4A2F2A] mb-8">
              Trusted by Leading Construction Companies
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-32 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Factory className="h-8 w-8 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#4A2F2A] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Factory className="h-10 w-10 text-[#B0413E]" />
                <div>
                  <h3 className="text-2xl font-bold">Roshan Traders</h3>
                  <p className="text-sm text-gray-300">Since 1990</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                Premium quality bricks, clay floor tiles, and roof tiles manufacturer. Building trust through excellence for over three decades.
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-xl font-bold mb-6 text-[#E8D7C3]">Contact Us</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#B0413E] mt-1 flex-shrink-0" />
                  <p className="text-gray-300">
                    Roshan Traders Factory<br />
                    Industrial Area, Sector 5<br />
                    City, State - 123456
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[#B0413E] flex-shrink-0" />
                  <p className="text-gray-300">+91-XXXXXXXXXX</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#B0413E] flex-shrink-0" />
                  <p className="text-gray-300">info@roshantraders.com</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-bold mb-6 text-[#E8D7C3]">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#products" className="text-gray-300 hover:text-[#B0413E] transition-colors">Products</a></li>
                <li><a href="#about" className="text-gray-300 hover:text-[#B0413E] transition-colors">About Us</a></li>
                <li><a href="#quality" className="text-gray-300 hover:text-[#B0413E] transition-colors">Quality Process</a></li>
                <li><a href="#gallery" className="text-gray-300 hover:text-[#B0413E] transition-colors">Gallery</a></li>
                <li><a href="#contact" className="text-gray-300 hover:text-[#B0413E] transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Contact Form */}
            <div>
              <h4 className="text-xl font-bold mb-6 text-[#E8D7C3]">Quick Inquiry</h4>
              <form onSubmit={handleFormSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#B0413E]"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#B0413E]"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#B0413E]"
                  required
                />
                <textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#B0413E]"
                  required
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-[#B0413E] hover:bg-[#8d332e] text-white px-4 py-2.5 rounded-md font-medium transition-colors duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Social Media & Copyright */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex gap-6">
                <a href="#" className="text-gray-300 hover:text-[#B0413E] transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-[#B0413E] transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-[#B0413E] transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-[#B0413E] transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
              <p className="text-gray-400 text-sm">
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
