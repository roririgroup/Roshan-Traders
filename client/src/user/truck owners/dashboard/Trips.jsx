import { useState } from 'react'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import { MapPin, Upload, Eye, Truck, Clock, CheckCircle } from 'lucide-react'

export default function Trips() {
  const [trips, setTrips] = useState([
    {
      id: 1,
      truckNo: 'TN01AB1234',
      driver: 'Raj Kumar',
      from: 'Chennai',
      to: 'Bangalore',
      status: 'Running',
      startTime: '2024-10-01 08:00',
      estimatedArrival: '2024-10-01 16:00',
      cargo: 'Electronics - 15 Ton',
      agent: 'ABC Logistics',
      podUploaded: false
    },
    {
      id: 2,
      truckNo: 'TN02CD5678',
      driver: 'Suresh Patel',
      from: 'Mumbai',
      to: 'Delhi',
      status: 'Upcoming',
      startTime: '2024-10-05 06:00',
      estimatedArrival: '2024-10-06 18:00',
      cargo: 'Textiles - 12 Ton',
      agent: 'XYZ Traders',
      podUploaded: false
    },
    {
      id: 3,
      truckNo: 'TN01AB1234',
      driver: 'Raj Kumar',
      from: 'Bangalore',
      to: 'Hyderabad',
      status: 'Completed',
      startTime: '2024-09-28 09:00',
      estimatedArrival: '2024-09-28 15:00',
      cargo: 'Machinery - 18 Ton',
      agent: 'DEF Industries',
      podUploaded: true
    }
  ])

  const [selectedTrip, setSelectedTrip] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleViewDetails = (trip) => {
    setSelectedTrip(trip)
    setIsModalOpen(true)
  }

  const handleUploadPOD = (tripId) => {
    // Mock upload
    setTrips(trips.map(trip =>
      trip.id === tripId ? { ...trip, podUploaded: true } : trip
    ))
    alert('POD uploaded successfully')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Running': return 'bg-blue-100 text-blue-800'
      case 'Upcoming': return 'bg-yellow-100 text-yellow-800'
      case 'Completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#F08344] rounded-lg flex items-center justify-center">
          <MapPin className="size-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Trips & Orders</h1>
          <p className="text-slate-600">Track all your assigned trips</p>
        </div>
      </div>

      {/* Trips Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Truck No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Arrival</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">POD</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trips.map((trip) => (
              <tr key={trip.id}>
                <td className="px-6 py-4 whitespace-nowrap">{trip.truckNo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{trip.driver}</td>
                <td className="px-6 py-4 whitespace-nowrap">{trip.from}</td>
                <td className="px-6 py-4 whitespace-nowrap">{trip.to}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(trip.status)}`}>
                    {trip.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{trip.startTime}</td>
                <td className="px-6 py-4 whitespace-nowrap">{trip.estimatedArrival}</td>
                <td className="px-6 py-4 whitespace-nowrap">{trip.cargo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{trip.agent}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {trip.podUploaded ? (
                    <span className="text-green-600 font-semibold">Uploaded</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Pending</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                  <Button onClick={() => handleViewDetails(trip)} variant="outline" size="sm">
                    <Eye className="size-4 mr-1" />
                    Details
                  </Button>
                  {trip.status === 'Completed' && !trip.podUploaded && (
                    <Button onClick={() => handleUploadPOD(trip.id)} className="bg-[#F08344] hover:bg-[#e0733a]" size="sm">
                      <Upload className="size-4 mr-1" />
                      Upload POD
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Trip Details Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedTrip && (
          <div>
            <h2 className="text-xl font-bold mb-4">Trip Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Truck Number</p>
                  <p className="text-lg">{selectedTrip.truckNo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Driver</p>
                  <p className="text-lg">{selectedTrip.driver}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">From</p>
                  <p className="text-lg">{selectedTrip.from}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">To</p>
                  <p className="text-lg">{selectedTrip.to}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Cargo</p>
                  <p className="text-lg">{selectedTrip.cargo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Agent</p>
                  <p className="text-lg">{selectedTrip.agent}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Start Time</p>
                  <p className="text-lg">{selectedTrip.startTime}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Estimated Arrival</p>
                  <p className="text-lg">{selectedTrip.estimatedArrival}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setIsModalOpen(false)} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
