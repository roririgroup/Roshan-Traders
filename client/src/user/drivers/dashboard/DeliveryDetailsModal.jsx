import { useState } from 'react'
import { X, MapPin, Package, User, Phone, Camera } from 'lucide-react'

export default function DeliveryDetailsModal({ delivery, onClose, onUpdateStatus }) {
  const [status, setStatus] = useState(delivery.status)
  const [proofFile, setProofFile] = useState(null)

  const handleStatusUpdate = (newStatus) => {
    setStatus(newStatus)
    onUpdateStatus(delivery.id, newStatus)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setProofFile(file)
      // In a real app, upload to server
      console.log('Proof uploaded:', file.name)
    }
  }
  
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Delivery Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="size-6 text-slate-500" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Order ID</label>
                <p className="text-lg font-semibold text-slate-900">{delivery.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  status === 'Completed' ? 'bg-green-100 text-green-800' :
                  status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {status}
                </span>
              </div>
            </div>

            {/* Product */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Product</label>
              <div className="flex items-center gap-2">
                <Package className="size-5 text-slate-500" />
                <p className="text-slate-900">{delivery.product}</p>
              </div>
            </div>

            {/* Pickup & Drop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Pickup Address</label>
                <div className="flex items-start gap-2">
                  <MapPin className="size-5 text-blue-500 mt-0.5" />
                  <p className="text-slate-700">{delivery.pickup}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Drop Address</label>
                <div className="flex items-start gap-2">
                  <MapPin className="size-5 text-green-500 mt-0.5" />
                  <p className="text-slate-700">{delivery.drop}</p>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Customer Information</label>
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="size-5 text-slate-500" />
                  <p className="font-medium text-slate-900">{delivery.customer}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-5 text-slate-500" />
                  <p className="text-slate-700">{delivery.customerPhone}</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Route Map</label>
              <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg h-48 flex items-center justify-center">
                <p className="text-slate-500">Map Placeholder - Google Maps Integration</p>
              </div>
            </div>

           
            {/* Proof Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Upload Proof</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="proof-upload"
                />
                <label
                  htmlFor="proof-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Camera className="size-8 text-slate-400" />
                  <p className="text-sm text-slate-600">
                    {proofFile ? `Selected: ${proofFile.name}` : 'Click to upload proof photo'}
                  </p>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
