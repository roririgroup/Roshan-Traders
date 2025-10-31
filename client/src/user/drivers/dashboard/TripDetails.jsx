import { useState } from 'react'
import { Card } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { MapPin, Phone, Package, Play, Square, User, Truck } from 'lucide-react'

export default function TripDetails() {
  const [currentTrip, setCurrentTrip] = useState({
    id: 1,
    status: 'Not Started', // Not Started, In Progress, Completed
    pickup: {
      location: 'ABC Warehouse, Chennai',
      address: '123 Industrial Area, Chennai - 600001',
      contact: 'Mr. Sharma',
      phone: '+91 9876543210'
    },
    drop: {
      location: 'XYZ Store, Bangalore',
      address: '456 Commercial Street, Bangalore - 560001',
      contact: 'Ms. Patel',
      phone: '+91 9876543211'
    },
    
    load: {
      weight: '15 Ton',
      type: 'Electronics',
      description: 'Consumer electronics - TVs, laptops, mobiles'
    },
    estimatedDistance: '350 km',
    estimatedTime: '6 hours',
    earnings: 8500
  })

  const handleStartTrip = () => {
    setCurrentTrip(prev => ({ ...prev, status: 'In Progress' }))
    alert('Trip started successfully!')
  }

  const handleEndTrip = () => {
    setCurrentTrip(prev => ({ ...prev, status: 'Completed' }))
    alert('Trip completed! Please upload POD.')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Not Started': return 'bg-gray-100 text-gray-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2 group">
          <div className="w-10 h-10 bg-[#F08344] rounded-lg flex items-center justify-center">
            <MapPin className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Trip Details</h1>
            <p className="text-slate-600">Manage your current delivery</p>
          </div>
        </div>
      </div>

      {/* Trip Status */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Trip Status</h2>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(currentTrip.status)}`}>
            {currentTrip.status}
          </span>
        </div>
        <div className="flex gap-4">
          {currentTrip.status === 'Not Started' && (
            <Button onClick={handleStartTrip} className="bg-[#F08344] hover:bg-[#e0733a] flex items-center gap-2">
              <Play className="size-4" />
              Start Trip
            </Button>
          )}
          {currentTrip.status === 'In Progress' && (
            <Button onClick={handleEndTrip} className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
              <Square className="size-4" />
              End Trip
            </Button>
          )}
          {currentTrip.status === 'Completed' && (
            <div className="text-green-600 font-medium flex items-center gap-2">
              <Square className="size-4" />
              Trip Completed
            </div>
          )}
        </div>
      </Card>

      {/* Trip Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pickup Details */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="size-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Pickup Location</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-slate-900">{currentTrip.pickup.location}</p>
              <p className="text-sm text-slate-600">{currentTrip.pickup.address}</p>
            </div>
            <div className="flex items-center gap-2">
              <User className="size-4 text-slate-500" />
              <span className="text-sm font-medium">{currentTrip.pickup.contact}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-slate-500" />
              <a href={`tel:${currentTrip.pickup.phone}`} className="text-sm text-blue-600 hover:text-blue-800">
                {currentTrip.pickup.phone}
              </a>
            </div>
          </div>
        </Card>

        {/* Drop Details */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <MapPin className="size-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Drop Location</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-slate-900">{currentTrip.drop.location}</p>
              <p className="text-sm text-slate-600">{currentTrip.drop.address}</p>
            </div>
            <div className="flex items-center gap-2">
              <User className="size-4 text-slate-500" />
              <span className="text-sm font-medium">{currentTrip.drop.contact}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-slate-500" />
              <a href={`tel:${currentTrip.drop.phone}`} className="text-sm text-blue-600 hover:text-blue-800">
                {currentTrip.drop.phone}
              </a>
            </div>
          </div>
        </Card>

        {/* Load Details */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="size-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Load Details</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-600">Weight</p>
              <p className="font-medium text-slate-900">{currentTrip.load.weight}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Type</p>
              <p className="font-medium text-slate-900">{currentTrip.load.type}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Description</p>
              <p className="font-medium text-slate-900">{currentTrip.load.description}</p>
            </div>
          </div>
        </Card>

        {/* Trip Summary */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Truck className="size-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Trip Summary</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-600">Estimated Distance</p>
              <p className="font-medium text-slate-900">{currentTrip.estimatedDistance}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Estimated Time</p>
              <p className="font-medium text-slate-900">{currentTrip.estimatedTime}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Earnings</p>
              <p className="font-medium text-slate-900">₹{currentTrip.earnings.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
