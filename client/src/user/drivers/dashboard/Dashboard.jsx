import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/Card'
import { MapPin, Truck, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import DeliveryDetailsModal from './DeliveryDetailsModal'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalDeliveries: 10,
    inTransit: 2,
    completed: 7,
    pending: 1,
    currentTrip: {
      from: 'Chennai',
      to: 'Bangalore',
      cargo: 'Electronics - 15 Ton',
      customer: 'ABC Corp',
      customerPhone: '+91 9876543210'
    }
  })
  

  const [deliveries, setDeliveries] = useState([
    {
      id: 'ORD001',
      pickup: 'Warehouse A, Chennai',
      drop: 'Store B, Bangalore',
      status: 'Pending',
      product: 'Electronics',
      customer: 'ABC Corp',
      customerPhone: '+91 9876543210'
    },
    {
      id: 'ORD002',
      pickup: 'Factory X, Mumbai',
      drop: 'Retail Y, Delhi',
      status: 'In Transit',
      product: 'Clothing',
      customer: 'XYZ Ltd',
      customerPhone: '+91 9876543211'
    },
    {
      id: 'ORD003',
      pickup: 'Depot Z, Pune',
      drop: 'Outlet W, Hyderabad',
      status: 'Completed',
      product: 'Furniture',
      customer: 'PQR Inc',
      customerPhone: '+91 9876543212'
    }
  ])

  const [selectedDelivery, setSelectedDelivery] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Mock data - replace with API calls
  useEffect(() => {
    // Fetch stats from API
  }, [])

  const statCards = [
    {
      title: 'Total Deliveries',
      value: stats.totalDeliveries,
      icon: Truck,
      color: 'bg-blue-500'
    },
    {
      title: 'In Transit',
      value: stats.inTransit,
      icon: Truck,
      color: 'bg-yellow-500'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: AlertCircle,
      color: 'bg-red-500'
    }
  ]

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 animate-slide-in-right">
        <div className="flex items-center gap-3 mb-2 group">
          <div className="w-10 h-10 bg-[#F08344] rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
            <Truck className="size-5 text-white transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 group-hover:text-[#F08344] transition-colors duration-200">Driver Dashboard</h1>
            <p className="text-slate-600 group-hover:text-slate-800 transition-colors duration-200">Track your trips and deliveries</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <Card
            key={index}
            className="p-6 border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-fade-in-up group relative overflow-hidden"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center transition-transform duration-300 `}>
                <card.icon className="size-6 text-white transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 group-hover:text-[#F08344] transition-colors duration-200">{card.value}</p>
                <p className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors duration-200">{card.title}</p>
              </div>
            </div>
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F08344]/5 to-[#F08344]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </Card>
        ))}
      </div>

      {/* Current Trip */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Current Trip</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="size-5 text-blue-500" />
              <span className="font-medium text-slate-900">Route</span>
            </div>
            <p className="text-lg text-slate-700">{stats.currentTrip.from} → {stats.currentTrip.to}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Truck className="size-5 text-green-500" />
              <span className="font-medium text-slate-900">Cargo</span>
            </div>
            <p className="text-lg text-slate-700">{stats.currentTrip.cargo}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-slate-900">Customer</span>
            </div>
            <p className="text-lg text-slate-700">{stats.currentTrip.customer}</p>
            <p className="text-sm text-slate-600">{stats.currentTrip.customerPhone}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="size-5 text-yellow-500" />
              <span className="font-medium text-slate-900">Status</span>
            </div>
            <p className="text-lg text-slate-700">In Progress</p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 flex items-center gap-3">
            <Truck className="size-6 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-blue-900">Start Trip</p>
              <p className="text-sm text-blue-700">Begin your current delivery</p>
            </div>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 flex items-center gap-3">
            <MapPin className="size-6 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-green-900">Update Location</p>
              <p className="text-sm text-green-700">Share your current position</p>
            </div>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200 flex items-center gap-3">
            <Clock className="size-6 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-purple-900">End Trip</p>
              <p className="text-sm text-purple-700">Complete delivery</p>
            </div>
          </button>
        </div>
      </Card>

      {/* Deliveries Table */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Deliveries</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Pickup</th>
                <th className="px-6 py-3">Drop</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery) => (
                <tr key={delivery.id} className="bg-white border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{delivery.id}</td>
                  <td className="px-6 py-4 text-slate-700">{delivery.pickup}</td>
                  <td className="px-6 py-4 text-slate-700">{delivery.drop}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      delivery.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      delivery.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {delivery.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedDelivery(delivery)
                        setIsModalOpen(true)
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Delivery Details Modal */}
      {isModalOpen && selectedDelivery && (
        <DeliveryDetailsModal
          delivery={selectedDelivery}
          onClose={() => setIsModalOpen(false)}
          onUpdateStatus={(id, status) => {
            setDeliveries(deliveries.map(d => d.id === id ? { ...d, status } : d))
          }}
        />
      )}
    </div>
  )
}
