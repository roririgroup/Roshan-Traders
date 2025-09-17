import { useState } from 'react';
import { Card, CardMedia, CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { X, MapPin, Phone, Mail, Users, Calendar, ArrowLeft } from 'lucide-react';

export default function CompaniesPage() {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
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
      services: ['Metro Rail Projects', 'Industrial Construction', 'Bridge Engineering', 'Public Infrastructure']
    },
  ];

  const handleViewCompany = (company) => {
    setSelectedCompany(company);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedCompany(null), 300);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Construction Companies</h1>
          <p className="text-gray-600 mt-2">Browse our network of trusted construction partners</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((company) => (
            <Card key={company.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
              <CardMedia src={company.image} alt={company.name} />
              <CardHeader 
                title={company.name} 
                subtitle={company.city} 
                action={
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleViewCompany(company)}
                  >
                    View
                  </Button>
                } 
              />
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-2">{company.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal for Company Details */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {selectedCompany && (
                <div className="relative">
                  {/* Header with image */}
                  <div className="relative h-48">
                    <img 
                      src={selectedCompany.image} 
                      alt={selectedCompany.name}
                      className="w-full h-full object-cover rounded-t-xl"
                    />
                    <button 
                      onClick={handleCloseModal}
                      className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedCompany.name}</h2>
                    <div className="flex items-center mt-2 text-gray-600">
                      <MapPin size={16} className="mr-1" />
                      <span>{selectedCompany.city}</span>
                    </div>
                    
                    <p className="my-4 text-gray-700">{selectedCompany.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                      <div className="flex items-center">
                        <Phone size={18} className="text-blue-600 mr-2" />
                        <span className="text-gray-700">{selectedCompany.contact}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail size={18} className="text-blue-600 mr-2" />
                        <span className="text-gray-700">{selectedCompany.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Users size={18} className="text-blue-600 mr-2" />
                        <span className="text-gray-700">{selectedCompany.employees} employees</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={18} className="text-blue-600 mr-2" />
                        <span className="text-gray-700">Est. {selectedCompany.established}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Services Offered</h3>
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
                    
                    <div className="mt-8 flex justify-end space-x-3">
                      <Button variant="outline" onClick={handleCloseModal}>
                        Close
                      </Button>
                      <Button>
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
    </div>
  );
}