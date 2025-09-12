import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/Card'
import { DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default function PaymentReport() {
  const [paymentData, setPaymentData] = useState({
    totalAmount: 0,
    pendingAmount: 0,
    paidAmount: 0
  })

  // Mock data - replace with API calls
  useEffect(() => {
    setPaymentData({
      totalAmount: 25000,
      pendingAmount: 8500,
      paidAmount: 16500
    })
  }, [])

  const paymentCards = [
    {
      title: 'Total Amount',
      value: `₹${paymentData.totalAmount.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-blue-500',
      description: 'Total revenue from all orders'
    },
    {
      title: 'Pending Amount',
      value: `₹${paymentData.pendingAmount.toLocaleString()}`,
      icon: Clock,
      color: 'bg-yellow-500',
      description: 'Amount awaiting payment'
    },
    {
      title: 'Paid Amount',
      value: `₹${paymentData.paidAmount.toLocaleString()}`,
      icon: CheckCircle,
      color: 'bg-green-500',
      description: 'Successfully received payments'
    }
  ]

  // Mock payment details
  const paymentDetails = [
    {
      id: 1,
      orderId: '#1234',
      customer: 'John Doe',
      amount: 2999,
      status: 'paid',
      paymentDate: '2024-01-15',
      method: 'UPI'
    },
    {
      id: 2,
      orderId: '#1235',
      customer: 'Jane Smith',
      amount: 4999,
      status: 'pending',
      paymentDate: null,
      method: 'Cash'
    },
    {
      id: 3,
      orderId: '#1236',
      customer: 'Bob Johnson',
      amount: 7998,
      status: 'paid',
      paymentDate: '2024-01-14',
      method: 'Card'
    },
    {
      id: 4,
      orderId: '#1237',
      customer: 'Alice Brown',
      amount: 1999,
      status: 'pending',
      paymentDate: null,
      method: 'Bank Transfer'
    }
  ]

  const getStatusIcon = (status) => {
    return status === 'paid'
      ? <CheckCircle className="size-4 text-green-600" />
      : <Clock className="size-4 text-yellow-600" />
  }

  const getStatusBadge = (status) => {
    return status === 'paid'
      ? <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Paid
        </span>
      : <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pending
        </span>
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <DollarSign className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Payment Report</h1>
            <p className="text-slate-600">Track your payment status and financial overview</p>
          </div>
        </div>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {paymentCards.map((card, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon className="size-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                <p className="text-sm font-medium text-slate-700">{card.title}</p>
                <p className="text-xs text-slate-600 mt-1">{card.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Payment Details Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-900">Order ID</th>
                <th className="text-left py-3 px-4 font-medium text-slate-900">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-slate-900">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-slate-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-900">Payment Date</th>
                <th className="text-left py-3 px-4 font-medium text-slate-900">Method</th>
              </tr>
            </thead>
            <tbody>
              {paymentDetails.map((payment) => (
                <tr key={payment.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-900">{payment.orderId}</td>
                  <td className="py-3 px-4 text-slate-700">{payment.customer}</td>
                  <td className="py-3 px-4 font-medium text-slate-900">₹{payment.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      {getStatusBadge(payment.status)}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{payment.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Payment Insights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Methods</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-700">UPI</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <span className="text-sm text-slate-600">40%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Cash</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-slate-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-sm text-slate-600">25%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Card</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-slate-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
                <span className="text-sm text-slate-600">20%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Bank Transfer</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-slate-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
                <span className="text-sm text-slate-600">15%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="size-5 text-green-600" />
                <span className="text-slate-700">Paid Orders</span>
              </div>
              <span className="font-semibold text-green-600">2</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="size-5 text-yellow-600" />
                <span className="text-slate-700">Pending Payments</span>
              </div>
              <span className="font-semibold text-yellow-600">2</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="size-5 text-red-600" />
                <span className="text-slate-700">Overdue</span>
              </div>
              <span className="font-semibold text-red-600">0</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
