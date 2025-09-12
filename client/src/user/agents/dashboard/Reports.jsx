import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { BarChart3, TrendingUp, Calendar, Download } from 'lucide-react'

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('daily')
  const [reportData, setReportData] = useState({
    daily: [],
    weekly: [],
    monthly: []
  })

  // Mock data - replace with API calls
  useEffect(() => {
    setReportData({
      daily: [
        { date: '2024-01-15', orders: 5, revenue: 15000 },
        { date: '2024-01-14', orders: 8, revenue: 22000 },
        { date: '2024-01-13', orders: 3, revenue: 8500 },
        { date: '2024-01-12', orders: 6, revenue: 18000 },
        { date: '2024-01-11', orders: 4, revenue: 12000 }
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

  // Simple bar chart component
  const BarChart = ({ data, dataKey, label }) => {
    const maxValue = Math.max(...data.map(item => item[dataKey]))

    return (
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = (item[dataKey] / maxValue) * 100
          const labelKey = selectedPeriod === 'daily' ? 'date' :
                          selectedPeriod === 'weekly' ? 'week' : 'month'

          return (
            <div key={index} className="flex items-center gap-4">
              <div className="w-20 text-sm text-slate-600 truncate">
                {item[labelKey]}
              </div>
              <div className="flex-1">
                <div className="w-full bg-slate-200 rounded-full h-6 relative">
                  <div
                    className="bg-blue-500 h-6 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-slate-900">
                      {dataKey === 'revenue' ? `₹${item[dataKey].toLocaleString()}` : item[dataKey]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Simple line chart component (simplified)
  const LineChart = ({ data, dataKey }) => {
    const maxValue = Math.max(...data.map(item => item[dataKey]))
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - (item[dataKey] / maxValue) * 100
      return `${x},${y}`
    }).join(' ')

    return (
      <div className="relative h-64 bg-slate-50 rounded-lg p-4">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            points={points}
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100
            const y = 100 - (item[dataKey] / maxValue) * 100
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1.5"
                fill="#3b82f6"
              />
            )
          })}
        </svg>
      </div>
    )
  }

  const handleExport = () => {
    // Export functionality
    console.log('Exporting report for', selectedPeriod)
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <BarChart3 className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
              <p className="text-slate-600">Analyze your business performance with detailed reports</p>
            </div>
          </div>
          <Button
            onClick={handleExport}
            variant="secondary"
            className="bg-white hover:bg-slate-50"
          >
            <Download className="size-4 mr-2" />
            Export Report
          </Button>
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
              className={selectedPeriod === period.key ? 'bg-blue-600 text-white' : ''}
            >
              <Calendar className="size-4 mr-2" />
              {period.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="size-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-slate-900">Orders Trend</h3>
          </div>
          <BarChart data={currentData} dataKey="orders" label="Orders" />
        </Card>

        {/* Revenue Chart */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="size-5 text-green-600" />
            <h3 className="text-lg font-semibold text-slate-900">Revenue Trend</h3>
          </div>
          <BarChart data={currentData} dataKey="revenue" label="Revenue" />
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">
              {currentData.reduce((sum, item) => sum + item.orders, 0)}
            </p>
            <p className="text-sm text-slate-600">Total Orders</p>
            <p className="text-xs text-slate-500 mt-1">
              {selectedPeriod === 'daily' ? 'Last 5 days' :
               selectedPeriod === 'weekly' ? 'Last 4 weeks' : 'Last 4 months'}
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">
              ₹{currentData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
            </p>
            <p className="text-sm text-slate-600">Total Revenue</p>
            <p className="text-xs text-slate-500 mt-1">
              {selectedPeriod === 'daily' ? 'Last 5 days' :
               selectedPeriod === 'weekly' ? 'Last 4 weeks' : 'Last 4 months'}
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">
              ₹{Math.round(currentData.reduce((sum, item) => sum + item.revenue, 0) / currentData.length).toLocaleString()}
            </p>
            <p className="text-sm text-slate-600">Average Revenue</p>
            <p className="text-xs text-slate-500 mt-1">
              Per {selectedPeriod.slice(0, -2)}
            </p>
          </div>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card className="p-6 mt-6">
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
