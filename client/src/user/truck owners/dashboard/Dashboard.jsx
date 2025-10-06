import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/Card'
import { Truck, MapPin, DollarSign, CheckCircle, Clock, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTrucks: 0,
    activeTrucks: 0,
    inactiveTrucks: 0,
    runningTrips: 0,
    upcomingTrips: 0,
    completedTrips: 0,
    monthlyEarnings: 0,
    yearlyEarnings: 0
  })

  // Mock data - replace with API calls
  useEffect(() => {
    setStats({
      totalTrucks: 15,
      activeTrucks: 12,
      inactiveTrucks: 3,
      runningTrips: 8,
      upcomingTrips: 5,
      completedTrips: 45,
      monthlyEarnings: 125000,
      yearlyEarnings: 1500000
    })
  }, [])

  const statCards = [
    {
      title: 'Total Trucks',
      value: stats.totalTrucks,
      subtitle: `${stats.activeTrucks} Active / ${stats.inactiveTrucks} Inactive`,
      icon: Truck,
      color: 'bg-blue-500'
    },
    {
      title: 'Running Trips',
      value: stats.runningTrips,
      icon: MapPin,
      color: 'bg-green-500'
    },
    {
      title: 'Upcoming Trips',
      value: stats.upcomingTrips,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Completed Trips',
      value: stats.completedTrips,
      icon: CheckCircle,
      color: 'bg-purple-500'
    },
    {
      title: 'Monthly Earnings',
      value: `₹${stats.monthlyEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-indigo-500'
    },
    {
      title: 'Yearly Earnings',
      value: `₹${stats.yearlyEarnings.toLocaleString()}`,
      icon: TrendingUp,
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
            <h1 className="text-2xl font-bold text-slate-900 group-hover:text-[#F08344] transition-colors duration-200">Truck Owner Dashboard</h1>
            <p className="text-slate-600 group-hover:text-slate-800 transition-colors duration-200">Manage your fleet and track your business</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                {card.subtitle && <p className="text-xs text-slate-500">{card.subtitle}</p>}
              </div>
            </div>
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F08344]/5 to-[#F08344]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </Card>
        ))}
      </div>

      {/* Additional sections can be added here */}
    </div>
  )
}
