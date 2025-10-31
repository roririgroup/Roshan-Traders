import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { Truck, MapPin, Calendar, Package, DollarSign } from 'lucide-react'

export default function Load() {
  const [availableLoads, setAvailableLoads] = useState([
    {
      id: 'LOAD 001',
      pickup: 'Chennai Warehouse',
      drop: 'Bangalore Distribution Center',
      distance: '350 km',
      weight: '15 Tons',
      product: 'Electronics',
      payment: '₹15,000',
      deadline: '2024-06-20',
      status: 'Available',
      customer: 'ABC Corp',
      customerPhone: '+91 9876543210'
    },
    
    {
      id: 'LOAD 002',
      pickup: 'Mumbai Port',
      drop: 'Delhi Market',
      distance: '1400 km',
      weight: '20 Tons',
      product: 'Textiles',
      payment: '₹25,000',
      deadline: '2024-06-18',
      status: 'Available',
      customer: 'XYZ Ltd',
      customerPhone: '+91 9876543211'
    },
    {
      id: 'LOAD 003',
      pickup: 'Pune Factory',
      drop: 'Hyderabad Retail',
      distance: '560 km',
      weight: '8 Tons',
      product: 'Automotive Parts',
      payment: '₹12,000',
      deadline: '2024-06-22',
      status: 'Available',
      customer: 'PQR Inc',
      customerPhone: '+91 9876543212'
    }
  ])

  const [acceptedLoads, setAcceptedLoads] = useState([])

  const acceptLoad = (loadId) => {
    const loadToAccept = availableLoads.find(load => load.id === loadId)
    if (loadToAccept) {
      setAcceptedLoads(prev => [...prev, { ...loadToAccept, status: 'Accepted' }])
      setAvailableLoads(prev => prev.filter(load => load.id !== loadId))
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Available Loads</h1>
        <p className="text-gray-600">Find and accept delivery loads</p>
      </div>

      {/* Accepted Loads Section */}
      {acceptedLoads.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Accepted Loads</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {acceptedLoads.map(load => (
              <Card key={load.id} className="p-6 border-l-4 border-l-green-500">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-gray-900">{load.id}</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Accepted
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{load.pickup} → {load.drop}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="w-4 h-4" />
                    <span>{load.product} • {load.weight}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold text-green-600">{load.payment}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Loads Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Available for Pickup</h2>
        {availableLoads.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableLoads.map(load => (
              <Card key={load.id} className="p-6 border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-gray-900">{load.id}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {load.status}
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <div>
                      <p className="font-medium">From: {load.pickup}</p>
                      <p className="font-medium">To: {load.drop}</p>
                      <p className="text-xs text-gray-500">{load.distance}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="w-4 h-4" />
                    <span>{load.product} • {load.weight}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Deadline: {new Date(load.deadline).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold text-green-600">{load.payment}</span>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>Customer: {load.customer}</p>
                    <p>Contact: {load.customerPhone}</p>
                  </div>
                </div>

                <Button
                  onClick={() => acceptLoad(load.id)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Accept Load
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Available Loads</h3>
            <p className="text-gray-500">All loads have been accepted. Check back later for new opportunities.</p>
          </Card>
        )}
      </div>
    </div>
  )
}