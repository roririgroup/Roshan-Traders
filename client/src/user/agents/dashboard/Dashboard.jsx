import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/Card'
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    todayRevenue: 0,
    monthlyRevenue: 0
  })

  // Mock data - replace with API calls
  useEffect(() => {
    // Fetch stats from API
    setStats({
      totalProducts: 25,
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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <TrendingUp className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600">Welcome back! Here's your business overview</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon className="size-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                <p className="text-sm text-slate-600">{card.title}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Additional Dashboard Content */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        {/* <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="size-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">New order placed</p>
                <p className="text-xs text-slate-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="size-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Product added to inventory</p>
                <p className="text-xs text-slate-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </Card> */}

        {/* Quick Actions */}
        {/* <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
              <Package className="size-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-900">Add Product</p>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
              <ShoppingCart className="size-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-900">View Orders</p>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200">
              <DollarSign className="size-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-900">Payment Report</p>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200">
              <TrendingUp className="size-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-orange-900">View Reports</p>
            </button>
          </div>
        </Card> */}
      </div>
    </div>
  )
}
