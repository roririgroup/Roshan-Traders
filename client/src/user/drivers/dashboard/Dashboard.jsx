import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/Card'
import { MapPin, Truck, Clock, Calendar, Route } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    assignedTrips: 3,
    upcomingDeliveries: 2,
    todayDistance: 450,
    todayEarnings: 8500,
    currentTrip: {
      from: 'Chennai',
      to: 'Bangalore',
      cargo: 'Electronics - 15 Ton',
      customer: 'ABC Corp',
      customerPhone: '+91 9876543210'
    }
  })

  // Mock data - replace with API calls
  useEffect(() => {
    // Fetch stats from API
  }, [])

  const statCards = [
    {
      title: 'Assigned Trips',
      value: stats.assignedTrips,
      icon: Truck,
      color: 'bg-blue-500'
    },
    {
      title: 'Upcoming Deliveries',
      value: stats.upcomingDeliveries,
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      title: "Today's Distance",
      value: `${stats.todayDistance} km`,
      icon: Route,
      color: 'bg-yellow-500'
    },
    {
      title: "Today's Earnings",
      value: `₹${stats.todayEarnings.toLocaleString()}`,
      icon: Clock,
      color: 'bg-purple-500'
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
      <Card className="p-6">
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
    </div>
  )
}
