import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, ArrowRight, Star, Package, TrendingUp, Award, Globe, ShoppingCart, User, Edit, Trash2 } from 'lucide-react'

const ManufacturerCard = ({ manufacturer, viewMode = 'grid', onEdit, onDelete }) => {
  if (viewMode === 'list') {
    return (
      <Link 
        to={`/manufacturers/${manufacturer.id}`}
        className="group block"
      >
        <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden border border-gray-200/50 hover:border-blue-400/60">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="relative md:w-80 h-48 md:h-auto overflow-hidden">
              <img 
                src={manufacturer.image} 
                alt={manufacturer.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-105"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${manufacturer.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
              
              {/* Rating Badge */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 shadow-sm">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-sm font-semibold text-gray-800">{manufacturer.rating}</span>
              </div>

              {/* Specialization Badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
                <span className="text-xs font-medium text-gray-700">{manufacturer.specialization}</span>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="mb-4">
                  <h3 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                    {manufacturer.name}
                  </h3>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1 text-red-500" />
                    {manufacturer.location}
                  </div>
                  {/* Founder Information */}
                  {manufacturer.founder && (
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 mb-3 ring-1 ring-gray-200 hover:ring-blue-300 transition">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-semibold text-gray-700">{manufacturer.founder.name}</p>
                          <p className="text-xs text-gray-500">Founder, {manufacturer.name}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {manufacturer.description?.substring(0, 120)}...
                  </p>
                </div>

                {/* Stats (removed Employees) */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 text-center hover:scale-105 transition">
                    <Package className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{manufacturer.productsCount}</div>
                    <div className="text-xs text-blue-700 font-medium">Products</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 text-center hover:scale-105 transition">
                    <TrendingUp className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <div className="text-lg font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{manufacturer.turnover}</div>
                    <div className="text-xs text-purple-700 font-medium">Turnover</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-3 text-center hover:scale-105 transition">
                    <Globe className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{manufacturer.exportCountries}+</div>
                    <div className="text-xs text-amber-700 font-medium">Countries</div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-3 text-center hover:scale-105 transition">
                    <ShoppingCart className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                    <div className="text-lg font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">{manufacturer.ordersCount || 0}</div>
                    <div className="text-xs text-indigo-700 font-medium">Orders</div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Est. {manufacturer.established}</span>
                    <span>•</span>
                    <span>Verified Partner</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(manufacturer); }}
                      className="p-2 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-600 hover:text-yellow-700 transition"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(manufacturer.id); }}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 font-medium text-sm transition flex items-center">
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Grid view (default)
  return (
    <Link 
      to={`/manufacturers/${manufacturer.id}`}
      className="group block"
    >
      <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-200/50 hover:border-gray-400/60">
        {/* Image Section with Gradient Overlay */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={manufacturer.image} 
            alt={manufacturer.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-105"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${manufacturer.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
          
          {/* Rating Badge */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 shadow-sm">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-sm font-semibold text-gray-800">{manufacturer.rating}</span>
          </div>

          {/* Specialization Badge */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
            <span className="text-xs font-medium text-gray-700">{manufacturer.specialization}</span>
          </div>

          {/* Verified Badge */}
          <div className="absolute bottom-4 right-4 bg-green-500/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-md">
            <Award className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Company Name & Location */}
          <div className="mb-4">
            <h3 className="text-xl font-extrabold tracking-tight text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
              {manufacturer.name}
            </h3>
            <div className="flex items-center text-gray-500 text-sm mb-2">
              <MapPin className="w-4 h-4 mr-1 text-red-500" />
              {manufacturer.location}
            </div>
            {/* Founder Information */}
            {manufacturer.founder && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 mb-3 ring-1 ring-gray-200 hover:ring-blue-300 transition">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{manufacturer.founder.name}</p>
                    <p className="text-xs text-gray-500">Founder, {manufacturer.name}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Grid (removed Employees) */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 text-center hover:scale-105 transition">
              <Package className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{manufacturer.productsCount}</div>
              <div className="text-xs text-blue-700 font-medium">Products</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-3 text-center hover:scale-105 transition">
              <ShoppingCart className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
              <div className="text-lg font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">{manufacturer.ordersCount || 0}</div>
              <div className="text-xs text-indigo-700 font-medium">Orders</div>
            </div>
          </div>

          {/* Company Details */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Annual Turnover</span>
              <span className="font-semibold text-gray-900">{manufacturer.turnover}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Established</span>
              <span className="font-semibold text-gray-900">{manufacturer.established}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Export Countries</span>
              <span className="font-semibold text-gray-900">{manufacturer.exportCountries}+</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">Actions</span>
            <div className="flex space-x-2">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(manufacturer); }}
                className="p-2 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-600 hover:text-yellow-700 transition"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(manufacturer.id); }}
                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 font-medium text-sm transition flex items-center">
                <span>Explore</span>
                <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ManufacturerCard
