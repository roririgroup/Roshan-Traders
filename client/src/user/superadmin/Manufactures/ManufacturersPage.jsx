import React, { useState, useEffect } from 'react';
import PageHeader from './components/PageHeader';
import ManufacturerCard from './ManufactureCard';
import CallToAction from './components/CallToAction';
import AddManufacturerModal from './components/AddManufacturerModal';
import EditManufacturerModal from './components/EditManufacturerModal';
import { getAllManufacturers } from './manufactures';
import {
  Search,
  Filter,
  Grid,
  List,
  MapPin,
  Star,
  TrendingUp,
  Award,
  Box,
  Building,
  Plus,
} from 'lucide-react';


export default function ManufacturersPage() {
  const [manufacturers, setManufacturers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('rating');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchManufacturers();
  }, []);
  
  const fetchManufacturers = async () => {
    try {
      const response = await fetch('http://localhost:7700/api/manufacturers');
      if (response.ok) {
        const data = await response.json();
        const mappedManufacturers = data.map(manufacturer => ({
          id: manufacturer.id,
          name: manufacturer.companyName,
          location: manufacturer.location,
          specialization: manufacturer.specializations?.map(s => s.specialization.name).join(', ') || 'General',
          rating: manufacturer.rating,
          productsCount: manufacturer.productsCount || 0,
          turnover: manufacturer.companyInfo?.annualTurnover || 'N/A',
          exportCountriesCount: manufacturer.exportCountriesCount || 0,
          established: manufacturer.established,
          image: manufacturer.image,
          founder: manufacturer.founders?.[0] ? { name: manufacturer.founders[0].name } : null,
          ordersCount: manufacturer.ordersCount || 0,
          gradient: 'from-blue-500/20 to-purple-500/20',
          description: manufacturer.description,
        }));
        setManufacturers(mappedManufacturers);
      } else {
        // Fallback to local data if API fails
        const localManufacturers = getAllManufacturers();
        setManufacturers(localManufacturers);
        console.log('Using local manufacturers data as fallback');
      }
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
      // Fallback to local data if API fails
      const localManufacturers = getAllManufacturers();
      setManufacturers(localManufacturers);
      console.log('Using local manufacturers data as fallback');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort manufacturers
  const filteredManufacturers = manufacturers
    .filter((manufacturer) => {
      const matchesSearch =
        manufacturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manufacturer.specialization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !selectedLocation || manufacturer.location === selectedLocation;
      return matchesSearch && matchesLocation;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'products':
          return b.productsCount - a.productsCount;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const locations = [...new Set(manufacturers.map((m) => m.location))];

  const handleAddManufacturer = async (payload) => {
    console.log('handleAddManufacturer called with payload:', payload);
    
    try {
      console.log('Making API call to create manufacturer...');
      
      // Call backend API to create manufacturer
      const response = await fetch('http://localhost:7700/api/manufacturers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.message || 'Failed to add manufacturer');
      }

      const result = await response.json();
      console.log('Manufacturer added successfully:', result);

      // Show success alert
      alert('Manufacturer added successfully!');

      // Close modal and refresh manufacturers list
      setIsAddModalOpen(false);
      fetchManufacturers();

      console.log('Modal closed and manufacturers list refreshed');
    } catch (error) {
      console.error('Error adding manufacturer:', error);
      alert(`Failed to add manufacturer: ${error.message}`);
    }
  };

  const handleEdit = async (manufacturer) => {
    try {
      const response = await fetch(`http://localhost:7700/api/manufacturers/${manufacturer.id}`);
      if (response.ok) {
        const fullManufacturer = await response.json();
        setSelectedManufacturer(fullManufacturer);
        setIsEditModalOpen(true);
      } else {
        alert('Failed to fetch manufacturer details');
      }
    } catch (error) {
      console.error('Error fetching manufacturer:', error);
      alert('Error fetching manufacturer details');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this manufacturer?')) {
      try {
        const response = await fetch(`http://localhost:7700/api/manufacturers/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Manufacturer deleted successfully!');
          fetchManufacturers();
        } else {
          alert('Failed to delete manufacturer');
        }
      } catch (error) {
        console.error('Error deleting manufacturer:', error);
        alert('Error deleting manufacturer');
      }
    }
  };

  const handleEditManufacturer = async (id, payload) => {
    try {
      const response = await fetch(`http://localhost:7700/api/manufacturers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update manufacturer');
      }

      const result = await response.json();
      alert('Manufacturer updated successfully!');

      setIsEditModalOpen(false);
      setSelectedManufacturer(null);
      fetchManufacturers();
    } catch (error) {
      console.error('Error updating manufacturer:', error);
      alert(`Failed to update manufacturer: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading manufacturers...</div>;
  }

  return (
    <div className="bg-white text-gray-800">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">Manufacturers</h1>
              <p className="text-blue-100 text-lg">Manage and oversee all manufacturers in your network</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl w-fit"
            >
              <Plus className="w-5 h-5" />
              Add Manufacturer
            </button>
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 bg-[#F08344] hover:bg-[#e0733a] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 flex items-center justify-center"
        title="Add Manufacturer"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Filters and Search Section */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 w-full lg:max-w-xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm placeholder-gray-400"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Location Filter */}
              <div className="relative flex items-center">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm appearance-none cursor-pointer"
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="relative flex items-center">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm appearance-none cursor-pointer"
                >
                  <option value="rating">Top Rated</option>
                  <option value="products">Most Products</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-50 border border-gray-200 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Results Summary */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredManufacturers.length} Manufacturers Found
            </h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#F08344] hover:bg-[#e0733a] text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 w-fit"
            >
              <Plus className="w-4 h-4" />
              Add Manufacturer
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 font-medium">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>Highest Rated</span>
            </div>
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-indigo-500" />
              <span>Most Products</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>Growing Network</span>
            </div>
          </div>
        </div>

        {/* Manufacturers Grid/List */}
        {filteredManufacturers.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredManufacturers.map((manufacturer) => (
                <ManufacturerCard
                  key={manufacturer.id}
                  manufacturer={manufacturer}
                  viewMode="grid"
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredManufacturers.map((manufacturer) => (
                <ManufacturerCard
                  key={manufacturer.id}
                  manufacturer={manufacturer}
                  viewMode="list"
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="bg-gray-50 rounded-3xl p-16 max-w-lg mx-auto border border-gray-200 shadow-md">
              <Search className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">No manufacturers found</h3>
              <p className="text-gray-500 mb-8">
                Your search and filter criteria did not match any manufacturers.
                Try broadening your search.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLocation('');
                }}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 shadow-lg"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      <AddManufacturerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddManufacturer}
      />

      <EditManufacturerModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedManufacturer(null);
        }}
        onSubmit={handleEditManufacturer}
        manufacturer={selectedManufacturer}
      />
    </div>
    
  );
}
