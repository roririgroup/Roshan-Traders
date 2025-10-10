import React, { useState } from 'react';
import PageHeader from './components/PageHeader';
import ManufacturerCard from './ManufactureCard';
import CallToAction from './components/CallToAction';
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
} from 'lucide-react';

export default function ManufacturersPage() {
  const manufacturers = getAllManufacturers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('rating');

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

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header Section */}

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
        <div className="mb-8 flex items-center justify-between text-sm text-gray-600 font-medium">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredManufacturers.length} Manufacturers Found
          </h2>
          <div className="hidden sm:flex items-center gap-6">
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
    </div>
  );
}
