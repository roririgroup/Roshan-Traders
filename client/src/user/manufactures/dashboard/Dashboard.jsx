import { useState, useEffect } from 'react'
// Try both named and default import for Card
import { Card } from '../../../components/ui/Card'
// import Card from '../../../components/ui/Card' // Uncomment if Card is default export
import { Package,User, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react'

export default function ManufacturerDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalEmployee: 0,
    totalOrders: 0,
    todayRevenue: 0,
    monthlyRevenue: 0
  })
  
  

  // Mock data - replace with API calls
  useEffect(() => {
    // Fetch stats from API
    setStats({
      totalProducts: 25,
      totalEmployee: 50,
      totalOrders: 12,
      todayRevenue: 2500,
      monthlyRevenue: 45000
    })
  }, [])

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Employees',
      value: stats.totalEmployee,
      icon: User,
      color: 'bg-orange-500'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500'
    },
    {
      title: "Today's Revenue",
      value: `₹${stats.todayRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500'
    },
    {
      title: 'Monthly Revenue',
      value: `₹${stats.monthlyRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 animate-slide-in-right">
        <div className="flex items-center gap-3 mb-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
            <TrendingUp className="size-5 text-white transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">Dashboard</h1>
            <p className="text-slate-600 group-hover:text-slate-800 transition-colors duration-200">Welcome back! Here's your business overview</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 ">
        {statCards.map((card, index) => (
          <Card 
            key={index} 
            className=" border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-fade-in-up group relative overflow-hidden"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center transition-transform duration-300  `}>
                <card.icon className="size-6 text-white transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">{card.value}</p>
                <p className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors duration-200">{card.title}</p>
              </div>
            </div>
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </Card>
        ))}
      </div>
    </div>
  )
}
