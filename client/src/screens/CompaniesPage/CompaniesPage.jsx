import { useState } from 'react';
import { X, MapPin, Phone, Mail, Users, Calendar, Factory, Star, ExternalLink, Package } from 'lucide-react';

// Card Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardMedia = ({ src, alt, className = "" }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <img 
      src={src} 
      alt={alt} 
      className="w-full h-48 sm:h-52 lg:h-48 object-cover transition-transform duration-300 hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
  </div>
);

const CardHeader = ({ title, subtitle, action }) => (
  <div className="p-4 pb-2">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">{title}</h3>
        <div className="flex items-center mt-1 text-gray-500">
          <MapPin size={14} className="mr-1 flex-shrink-0" />
          <span className="text-xs sm:text-sm truncate">{subtitle}</span>
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  </div>
);

const CardContent = ({ children }) => (
  <div className="px-4 pb-4">
    {children}
  </div>
);

// Button Component
const Button = ({ children, variant = "primary", size = "md", onClick, disabled = false, className = "" }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-gray-500"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs sm:text-sm",
    md: "px-4 py-2 text-sm sm:text-base",
    lg: "px-6 py-3 text-base sm:text-lg"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Main Component
export default function CompaniesPage() {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  const data = [
    { 
      id: 'm1', 
      name: 'Premium Bricks & Blocks', 
      city: 'Ahmedabad', 
      image: 'https://images.unsplash.com/photo-1621553981196-2e084f2e2a77?q=80&w=800&auto=format&fit=crop',
      description: 'Leading manufacturer of high-quality clay bricks, concrete blocks, and paving stones with ISO 9001 certification.',
      contact: '+91 98765 12340',
      email: 'sales@premiumbricks.com',
      employees: '80-100',
      established: '2005',
      rating: 4.7,
      capacity: '50,000 units/day',
      products: ['Clay Bricks', 'Concrete Blocks', 'Paving Stones', 'Hollow Blocks', 'Interlocking Pavers']
    },
    { 
      id: 'm2', 
      name: 'SteelStrong Sheets', 
      city: 'Pune', 
      image: 'https://images.unsplash.com/photo-163338841271-28c181f4c1e6?q=80&w=800&auto=format&fit=crop',
      description: 'Manufacturer of premium steel sheets, roofing materials, and structural components for construction industry.',
      contact: '+91 97654 32109',
      email: 'info@steelstrong.com',
      employees: '120-150',
      established: '2010',
      rating: 4.6,
      capacity: '200 tons/day',
      products: ['GI Sheets', 'Galvanized Steel', 'Roofing Sheets', 'Color Coated Sheets', 'Structural Components']
    },
    { 
      id: 'm3', 
      name: 'PureSand Minerals', 
      city: 'Chennai', 
      image: 'https://images.unsplash.com/photo-1621553981196-2e084f2e2a77?q=80&w=800&auto=format&fit=crop',
      description: 'Supplier of high-quality construction sand, river sand, and manufactured sand with consistent grading and purity.',
      contact: '+91 96543 21098',
      email: 'orders@puresand.com',
      employees: '60-80',
      established: '2012',
      rating: 4.5,
      capacity: '500 tons/day',
      products: ['River Sand', 'M-Sand', 'Plastering Sand', 'Filter Sand', 'Graded Aggregates']
    },
    { 
      id: 'm4', 
      name: 'CementPlus Industries', 
      city: 'Raipur', 
      image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?q=80&w=800&auto=format&fit=crop',
      description: 'Manufacturer of OPC, PPC, and specialty cement products with advanced quality control systems.',
      contact: '+91 95432 10987',
      email: 'contact@cementplus.com',
      employees: '200-250',
      established: '2008',
      rating: 4.8,
      capacity: '1000 tons/day',
      products: ['OPC Cement', 'PPC Cement', 'White Cement', 'Masonry Cement', 'Specialty Cements']
    },
    { 
      id: 'm5', 
      name: 'PolyTech Plastics', 
      city: 'Bangalore', 
      image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=800&auto=format&fit=crop',
      description: 'Manufacturer of PVC pipes, fittings, and plastic construction materials with BIS certification.',
      contact: '+91 94321 09876',
      email: 'sales@polytech.com',
      employees: '150-180',
      established: '2011',
      rating: 4.4,
      capacity: '20,000 units/day',
      products: ['PVC Pipes', 'CPVC Pipes', 'Plastic Fittings', 'Water Tanks', 'Drainage Systems']
    },
    { 
      id: 'm6', 
      name: 'TileCraft Ceramics', 
      city: 'Morbi', 
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800&auto=format&fit=crop',
      description: 'Premium manufacturer of ceramic tiles, vitrified tiles, and sanitaryware for residential and commercial use.',
      contact: '+91 93210 98765',
      email: 'export@tilecraft.com',
      employees: '300-350',
      established: '2007',
      rating: 4.9,
      capacity: '25,000 sqm/day',
      products: ['Ceramic Tiles', 'Vitrified Tiles', 'Sanitaryware', 'Wall Tiles', 'Floor Tiles']
    }
  ];

  const handleViewCompany = (company) => {
    setSelectedCompany(company);
    setShowModal(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'unset';
    setTimeout(() => setSelectedCompany(null), 300);
  };

  const CompanyCard = ({ company, isListView = false }) => (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 ${isListView ? 'flex flex-col sm:flex-row' : ''}`}>
      <CardMedia 
        src={company.image} 
        alt={company.name} 
        className={isListView ? 'sm:w-48 sm:flex-shrink-0' : 'rounded-t-lg'}
      />
      <div className={`flex-1 ${isListView ? 'flex flex-col justify-between' : ''}`}>
        <CardHeader 
          title={company.name} 
          subtitle={company.city} 
          action={
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => handleViewCompany(company)}
              className="whitespace-nowrap"
            >
              View
            </Button>
          } 
        />
        <CardContent>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3">{company.description}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Star size={12} className="text-yellow-400 mr-1" />
              <span>{company.rating}</span>
            </div>
            <div className="flex items-center">
              <Factory size={12} className="mr-1" />
              <span>{company.capacity}</span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Construction Material Manufacturers</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Browse our network of trusted material suppliers and manufacturers</p>
            </div>
            
            {/* View Toggle - Hidden on mobile for space */}
            <div className="hidden sm:flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>
          
          {/* Mobile Stats */}
          <div className="flex justify-center mt-4 sm:hidden">
            <div className="bg-blue-50 rounded-lg px-4 py-2">
              <span className="text-blue-600 text-sm font-medium">{data.length} Manufacturers Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Companies Grid/List */}
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" 
            : "space-y-4 sm:space-y-6"
        }>
          {data.map((company) => (
            <CompanyCard 
              key={company.id} 
              company={company} 
              isListView={viewMode === 'list'} 
            />
          ))}
        </div>
      </div>

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full max-w-4xl max-h-full overflow-hidden rounded-t-xl sm:rounded-xl animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-300">
            {selectedCompany && (
              <div className="flex flex-col max-h-screen">
                {/* Header with image */}
                <div className="relative h-48 sm:h-64 flex-shrink-0">
                  <img 
                    src={selectedCompany.image} 
                    alt={selectedCompany.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Close button */}
                  <button 
                    onClick={handleCloseModal}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                  
                  {/* Company name overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedCompany.name}</h2>
                    <div className="flex items-center mt-1 text-white/90">
                      <MapPin size={16} className="mr-1" />
                      <span className="text-sm sm:text-base">{selectedCompany.city}</span>
                    </div>
                  </div>
                </div>
                
                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 sm:p-6">
                    {/* Quick stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg sm:text-xl font-bold text-blue-600">{selectedCompany.rating}</div>
                        <div className="text-xs text-gray-600">Rating</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg sm:text-xl font-bold text-green-600">{selectedCompany.capacity}</div>
                        <div className="text-xs text-gray-600">Capacity</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg sm:text-xl font-bold text-purple-600">{selectedCompany.employees}</div>
                        <div className="text-xs text-gray-600">Employees</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-lg sm:text-xl font-bold text-orange-600">{selectedCompany.established}</div>
                        <div className="text-xs text-gray-600">Founded</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-6 text-sm sm:text-base leading-relaxed">{selectedCompany.description}</p>
                    
                    {/* Contact Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Phone size={18} className="text-blue-600 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base break-all">{selectedCompany.contact}</span>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Mail size={18} className="text-blue-600 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base break-all">{selectedCompany.email}</span>
                      </div>
                    </div>
                    
                    {/* Products */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <Package size={18} className="mr-2" />
                        Products Manufactured
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCompany.products.map((product, index) => (
                          <span 
                            key={index}
                            className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full"
                          >
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Fixed Footer */}
                <div className="border-t bg-gray-50 p-4 sm:p-6 flex-shrink-0">
                  <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <Button 
                      variant="outline" 
                      onClick={handleCloseModal}
                      className="order-2 sm:order-1"
                    >
                      Close
                    </Button>
                    <Button className="order-1 sm:order-2">
                      <ExternalLink size={16} className="mr-2" />
                      Request Quote
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}