import { useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'

export default function PaymentReport() {
  const [paymentData, setPaymentData] = useState({
    totalAmount: 25000,
    pendingAmount: 8500,
    paidAmount: 16500
  })

  const [paymentDetails, setPaymentDetails] = useState([
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
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [paidInput, setPaidInput] = useState('')

  const openModal = (payment) => {
    setSelectedPayment(payment)
    setPaidInput('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPayment(null)
  }

  const handlePaymentSubmit = () => {
    if (!paidInput || isNaN(paidInput)) {
      alert('Please enter a valid paid amount')
      return
    }
    const paidAmount = parseFloat(paidInput)
    if (paidAmount <= 0 || paidAmount > selectedPayment.amount) {
      alert('Paid amount must be greater than 0 and less than or equal to pending amount')
      return
    }
    const updatedPayments = paymentDetails.map((payment) => {
      if (payment.id === selectedPayment.id) {
        const newAmount = payment.amount - paidAmount
        const newStatus = newAmount === 0 ? 'paid' : 'pending'
        return {
          ...payment,
          amount: newAmount,
          status: newStatus,
          paymentDate: newStatus === 'paid' ? new Date().toISOString() : null
        }
      }
      return payment
    })
    setPaymentDetails(updatedPayments)

    // Update summary data
    const totalAmount = updatedPayments.reduce((sum, p) => sum + p.amount + (p.status === 'paid' ? p.amount : 0), 0)
    const paidAmountSum = updatedPayments.reduce((sum, p) => sum + (p.status === 'paid' ? p.amount : 0), 0)
    const pendingAmountSum = updatedPayments.reduce((sum, p) => sum + (p.status === 'pending' ? p.amount : 0), 0)
    setPaymentData({
      totalAmount,
      paidAmount: paidAmountSum,
      pendingAmount: pendingAmountSum
    })

    closeModal()
  }

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
      {/* Removed as per requirement */}

      {/* Add Payment Button */}
      <div className="mb-4">
        <Button onClick={() => openModal(null)}>Add Payment</Button>
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
                <th className="text-left py-3 px-4 font-medium text-slate-900">Action</th>
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
                  <td className="py-3 px-4">
                    {payment.status === 'pending' && (
                      <Button onClick={() => openModal(payment)}>Pay</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Payment Insights */}
      {/* Removed as per requirement */}

      {/* Payment Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Make a Payment">
        <div>
          <p>Total Amount: ₹{selectedPayment ? selectedPayment.amount.toLocaleString() : 'N/A'}</p>
          <p>Pending Amount: ₹{selectedPayment ? selectedPayment.amount.toLocaleString() : 'N/A'}</p>
          <input
            type="number"
            placeholder="Enter paid amount"
            value={paidInput}
            onChange={(e) => setPaidInput(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          <div className="mt-4">
            <Button onClick={handlePaymentSubmit}>Submit Payment</Button>
            <Button onClick={closeModal} className="ml-2">Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
