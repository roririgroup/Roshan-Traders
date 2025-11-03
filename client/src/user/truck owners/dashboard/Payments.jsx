import { useState } from 'react'
import Button from '../../../components/ui/Button'

import { DollarSign, Clock, CheckCircle, TrendingUp } from 'lucide-react'

export default function Payments() {
  const [payments, setPayments] = useState([
    {
      id: 1,
      tripId: 'T001',
      agent: 'ABC Logistics',
      amount: 25000,
      status: 'Pending',
      dueDate: '2024-10-10',
      description: 'Chennai to Bangalore delivery'
    },
    
    {
      id: 2,
      tripId: 'T002',
      agent: 'XYZ Traders',
      amount: 18000,
      status: 'Paid',
      paidDate: '2024-09-28',
      description: 'Mumbai to Delhi delivery'
    },
    {
      id: 3,
      tripId: 'T003',
      agent: 'DEF Industries',
      amount: 32000,
      status: 'Paid',
      paidDate: '2024-09-25',
      description: 'Bangalore to Hyderabad delivery'
    }
  ])

  const [summary, setSummary] = useState({
    totalPending: 25000,
    totalReceived: 50000,
    monthlyEarnings: 125000,
    yearlyEarnings: 1500000
  })

  const handleMarkPaid = (id) => {
    setPayments(payments.map(payment =>
      payment.id === id ? { ...payment, status: 'Paid', paidDate: new Date().toISOString().split('T')[0] } : payment
    ))
    // Update summary
    const paidAmount = payments.find(p => p.id === id)?.amount || 0
    setSummary(prev => ({
      ...prev,
      totalPending: prev.totalPending - paidAmount,
      totalReceived: prev.totalReceived + paidAmount
    }))
  }

  const pendingPayments = payments.filter(p => p.status === 'Pending')
  const paymentHistory = payments.filter(p => p.status === 'Paid')

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#F08344] rounded-lg flex items-center justify-center">
          <DollarSign className="size-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
          <p className="text-slate-600">Manage payments and settlements</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-yellow-500 rounded-lg text-white">
          <p className="text-2xl font-bold">₹{summary.totalPending.toLocaleString()}</p>
          <p>Pending Payments</p>
        </div>
        <div className="p-6 bg-green-500 rounded-lg text-white">
          <p className="text-2xl font-bold">₹{summary.totalReceived.toLocaleString()}</p>
          <p>Received This Month</p>
        </div>
        <div className="p-6 bg-blue-500 rounded-lg text-white">
          <p className="text-2xl font-bold">₹{summary.monthlyEarnings.toLocaleString()}</p>
          <p>Monthly Earnings</p>
        </div>
        <div className="p-6 bg-purple-500 rounded-lg text-white">
          <p className="text-2xl font-bold">₹{summary.yearlyEarnings.toLocaleString()}</p>
          <p>Yearly Earnings</p>
        </div>
      </div>

      {/* Pending Payments Table */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Pending Payments</h2>
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingPayments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No pending payments</td>
                </tr>
              ) : (
                pendingPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{payment.agent}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{payment.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{payment.dueDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">₹{payment.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Button onClick={() => handleMarkPaid(payment.id)} className="bg-[#F08344] hover:bg-[#e0733a]">
                        Mark as Paid
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment History Table */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Payment History</h2>
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentHistory.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.agent}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.paidDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">₹{payment.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-green-600 font-semibold">Paid</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
