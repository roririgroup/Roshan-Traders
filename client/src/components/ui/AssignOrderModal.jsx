import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import Button from './Button'
import { Truck, User, MapPin, Package, DollarSign } from 'lucide-react'

export default function AssignOrderModal({ isOpen, onClose, order, onAssign }) {
  const [truckOwners, setTruckOwners] = useState([])
  const [selectedTruckOwner, setSelectedTruckOwner] = useState(null)
  const [loading, setLoading] = useState(false)
  const [assigning, setAssigning] = useState(false)

  // Mock truck owners data - replace with API call
  useEffect(() => {
    if (isOpen) {
      // Simulate API call to fetch truck owners
      setLoading(true)
      setTimeout(() => {
        setTruckOwners([
          {
            id: 1,
            name: 'Rajesh Kumar',
            companyName: 'RK Logistics',
            phone: '+91 9876543210',
            location: 'Chennai, Tamil Nadu',
            truckCount: 5,
            rating: 4.5,
            completedOrders: 127
          },
          {
            id: 2,
            name: 'Amit Singh',
            companyName: 'Amit Transport Services',
            phone: '+91 9876543211',
            location: 'Mumbai, Maharashtra',
            truckCount: 8,
            rating: 4.2,
            completedOrders: 89
          },
          {
            id: 3,
            name: 'Vijay Patel',
            companyName: 'VP Cargo Solutions',
            phone: '+91 9876543212',
            location: 'Ahmedabad, Gujarat',
            truckCount: 3,
            rating: 4.7,
            completedOrders: 156
          },
          {
            id: 4,
            name: 'Suresh Reddy',
            companyName: 'SR Freight Services',
            phone: '+91 9876543213',
            location: 'Hyderabad, Telangana',
            truckCount: 6,
            rating: 4.3,
            completedOrders: 94
          }
        ])
        setLoading(false)
      }, 1000)
    }
  }, [isOpen])

  const handleAssign = async () => {
    if (!selectedTruckOwner) return

    setAssigning(true)
    try {
      // Simulate API call to assign order
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Call the onAssign callback with order and selected truck owner
      onAssign(order.id, selectedTruckOwner)

      onClose()
      setSelectedTruckOwner(null)
    } catch (error) {
      console.error('Failed to assign order:', error)
    } finally {
      setAssigning(false)
    }
  }

  const handleClose = () => {
    setSelectedTruckOwner(null)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Assign Order to Truck Owner"
      size="lg"
    >
      <div className="space-y-6">
        {/* Order Summary */}
        <div className="bg-slate-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Order Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="size-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Item Quantity:</span>
              <span className="text-sm text-slate-900">
                {order?.items?.reduce((total, item) => total + item.quantity, 0) || 0}
              </span>
            </div>
            {order?.phoneNumber && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">Phone:</span>
                <span className="text-sm text-slate-900">{order.phoneNumber}</span>
              </div>
            )}
            {order?.estimatedDeliveryDate && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">Delivery Date:</span>
                <span className="text-sm text-slate-900">
                  {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="flex items-start gap-2">
              <MapPin className="size-4 text-slate-500 mt-0.5" />
              <div>
                <span className="text-sm font-medium text-slate-700">Delivery Address:</span>
                <p className="text-sm text-slate-900 mt-1">{order?.deliveryAddress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Truck Owners List */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Truck Owner</h3>

          {loading ? (
            <div className="text-center py-8">
              <Truck className="size-8 text-slate-400 mx-auto mb-2 animate-pulse" />
              <p className="text-slate-600">Loading available truck owners...</p>
            </div>
          ) : truckOwners.length === 0 ? (
            <div className="text-center py-8">
              <Truck className="size-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-600">No truck owners available</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {truckOwners.map((owner) => (
                <div
                  key={owner.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedTruckOwner?.id === owner.id
                      ? 'border-[#F08344] bg-orange-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setSelectedTruckOwner(owner)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-slate-900">{owner.name}</h4>
                        <span className="text-sm text-slate-600">({owner.companyName})</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          <span>{owner.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Truck className="size-3" />
                          <span>{owner.truckCount} trucks</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="size-3" />
                          <span>{owner.completedOrders} orders</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span>{owner.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center">
                        {selectedTruckOwner?.id === owner.id && (
                          <div className="w-2 h-2 bg-[#F08344] rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={assigning}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedTruckOwner || assigning}
            className="bg-[#F08344] hover:bg-[#e0733a] text-white"
          >
            {assigning ? 'Assigning...' : 'Assign Order'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
