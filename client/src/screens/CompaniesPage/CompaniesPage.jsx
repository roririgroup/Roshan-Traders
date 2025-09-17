import { useState } from 'react';
import { X, MapPin, Phone, Mail, Users, Calendar, ArrowLeft, Building2, Star, ExternalLink } from 'lucide-react';

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
      id: 'c1', 
      name: 'BuildRight Constructions', 
      city: 'Mumbai', 
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
      description: 'Leading construction company with over 15 years of experience in residential and commercial projects.',
      contact: '+91 98765 43210',
      email: 'contact@buildright.com',
      employees: '150-200',
      established: '2008',
      rating: 4.8,
      projects: 145,
      services: ['Residential Construction', 'Commercial Buildings', 'Interior Design', 'Renovation']
    },
    { 
      id: 'c2', 
      name: 'Skyline Infra', 
      city: 'Pune', 
      image: 'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=800&auto=format&fit=crop',
      description: 'Premium infrastructure development company specializing in smart city projects and urban planning.',
      contact: '+91 97654 32109',
      email: 'info@skylineinfra.com',
      employees: '200-250',
      established: '2012',
      rating: 4.6,
      projects: 89,
      services: ['Infrastructure Development', 'Smart City Projects', 'Urban Planning', 'Civil Engineering']
    },
    { 
      id: 'c3', 
      name: 'GreenBuild Developers', 
      city: 'Bangalore', 
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800&auto=format&fit=crop',
      description: 'Eco-friendly construction company focused on sustainable building practices and green certifications.',
      contact: '+91 96543 21098',
      email: 'hello@greenbuild.com',
      employees: '100-150',
      established: '2015',
      rating: 4.9,
      projects: 67,
      services: ['Green Building', 'LEED Certification', 'Sustainable Design', 'Energy Efficiency']
    },
    { 
      id: 'c4', 
      name: 'Metro Structures Ltd', 
      city: 'Delhi', 
      image: 'https://images.unsplash.com/photo-1465433045946-ba6506ce5a59?q=80&w=800&auto=format&fit=crop',
      description: 'Large-scale construction firm specializing in metro rail projects and industrial infrastructure.',
      contact: '+91 95432 10987',
      email: 'admin@metroltd.com',
      employees: '300-350',
      established: '2005',
      rating: 4.7,
      projects: 234,
      services: ['Metro Rail Projects', 'Industrial Construction', 'Bridge Engineering', 'Public Infrastructure']
    },
    { 
      id: 'c5', 
      name: 'Coastal Builders', 
      city: 'Chennai', 
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop',
      description: 'Specialized in coastal construction with expertise in marine engineering and waterfront development.',
      contact: '+91 94321 09876',
      email: 'coastal@builders.com',
      employees: '80-120',
      established: '2010',
      rating: 4.5,
      projects: 52,
      services: ['Marine Construction', 'Waterfront Development', 'Coastal Engineering', 'Port Infrastructure']
    },
    { 
      id: 'c6', 
      name: 'Urban Heights', 
      city: 'Hyderabad', 
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
      description: 'High-rise specialists with cutting-edge technology in skyscraper construction and urban development.',
      contact: '+91 93210 98765',
      email: 'info@urbanheights.com',
      employees: '180-220',
      established: '2013',
      rating: 4.8,
      projects: 78,
      services: ['High-rise Construction', 'Urban Development', 'Skyscraper Engineering', 'Modern Architecture']
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
              <Building2 size={12} className="mr-1" />
              <span>{company.projects} projects</span>
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Construction Companies</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Browse our network of trusted construction partners</p>
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
              <span className="text-blue-600 text-sm font-medium">{data.length} Companies Available</span>
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
                        <div className="text-lg sm:text-xl font-bold text-green-600">{selectedCompany.projects}</div>
                        <div className="text-xs text-gray-600">Projects</div>
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
                    
                    {/* Services */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-9 mb-3">Services Offered</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCompany.services.map((service, index) => (
                          <span 
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full"
                          >
                            {service}
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
                      Contact Company
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