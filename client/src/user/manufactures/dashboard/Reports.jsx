import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { BarChart3, Calendar, TrendingUp, DollarSign } from 'lucide-react'

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('daily')
  const [reportData, setReportData] = useState({
    daily: [],
    weekly: [],
    monthly: []
  })

  // Mock data - replace with API calls
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setReportData({
      daily: [
        { date: today, orders: 5, revenue: 15000 }
      ],
      
      weekly: [
        { week: 'Week 1', orders: 25, revenue: 75000 },
        { week: 'Week 2', orders: 32, revenue: 95000 },
        { week: 'Week 3', orders: 28, revenue: 82000 },
        { week: 'Week 4', orders: 35, revenue: 105000 }
      ],
      monthly: [
        { month: 'Jan', orders: 120, revenue: 360000 },
        { month: 'Dec', orders: 95, revenue: 285000 },
        { month: 'Nov', orders: 110, revenue: 330000 },
        { month: 'Oct', orders: 85, revenue: 255000 }
      ]
    })
  }, [])

  const currentData = reportData[selectedPeriod] || []

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F08344] rounded-lg flex items-center justify-center">
            <BarChart3 className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
            <p className="text-slate-600">Analyze your business performance with detailed reports</p>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="mb-6">
        <div className="flex gap-2">
          {[
            { key: 'daily', label: 'Daily' },
            { key: 'weekly', label: 'Weekly' },
            { key: 'monthly', label: 'Monthly' }
          ].map((period) => (
            <Button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              variant={selectedPeriod === period.key ? 'primary' : 'secondary'}
              className={selectedPeriod === period.key ? 
                'bg-[#F08344] hover:bg-[#E5672E] text-white' : 
                'bg-white text-[#F08344] border border-[#F08344] hover:bg-[#FEF0E8]'}
            >
              <Calendar className="size-4 mr-2 text-[#F08344]" />
              {period.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FEF0E8] rounded-lg flex items-center justify-center">
              <BarChart3 className="size-6 text-[#F08344]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {currentData.reduce((sum, item) => sum + item.orders, 0)}
              </p>
              <p className="text-sm text-slate-600">Total Orders</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FEF0E8] rounded-lg flex items-center justify-center">
              <TrendingUp className="size-6 text-[#F08344]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                ₹{currentData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
              </p>
              <p className="text-sm text-slate-600">Total Revenue</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FEF0E8] rounded-lg flex items-center justify-center">
              <DollarSign className="size-6 text-[#F08344]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                ₹{currentData.length > 0 ? Math.round(currentData.reduce((sum, item) => sum + item.revenue, 0) / currentData.reduce((sum, item) => sum + item.orders, 0)).toLocaleString() : '0'}
              </p>
              <p className="text-sm text-slate-600">Avg Order Value</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Report */}
      <Card className="p-6 border-gray-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Detailed Report</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-900">
                  {selectedPeriod === 'daily' ? 'Date' :
                   selectedPeriod === 'weekly' ? 'Week' : 'Month'}
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-900">Orders</th>
                <th className="text-left py-3 px-4 font-medium text-slate-900">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-slate-900">Avg Order Value</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => {
                const labelKey = selectedPeriod === 'daily' ? 'date' :
                                selectedPeriod === 'weekly' ? 'week' : 'month'
                const avgOrderValue = item.orders > 0 ? Math.round(item.revenue / item.orders) : 0

                return (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-900">{item[labelKey]}</td>
                    <td className="py-3 px-4 text-slate-700">{item.orders}</td>
                    <td className="py-3 px-4 font-medium text-slate-900">₹{item.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-700">₹{avgOrderValue.toLocaleString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}