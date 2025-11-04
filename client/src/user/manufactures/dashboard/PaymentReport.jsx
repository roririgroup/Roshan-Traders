import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/Card'
import { DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import Badge from '../../../components/ui/Badge'
import { getOrders } from '../../../store/ordersStore'
import FilterBar from '../../../components/ui/FilterBar'

export default function PaymentReport() {
  const [paymentData, setPaymentData] = useState({
    totalAmount: 0,
    pendingAmount: 0,
    paidAmount: 0
  })
  
  

  const [paymentDetails, setPaymentDetails] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [paidInput, setPaidInput] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    // Fetch confirmed orders and calculate payment summary
    const orders = getOrders().filter(order => order.status === 'confirmed')
    const total = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    // For simplicity, assume half paid, half pending
    const paid = total / 2
    const pending = total - paid

    setPaymentData({
      totalAmount: total,
      pendingAmount: pending,
      paidAmount: paid
    })

    // Map orders to payment details
    const details = orders.map(order => ({
      id: order.id,
      orderId: `#${order.id}`,
      customer: order.customerName,
      amount: order.totalAmount,
      status: 'pending', // Simplified, could be dynamic
      paymentDate: null,
      method: 'UPI' // Placeholder
    }))
    setPaymentDetails(details)
  }, [])

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
    closeModal()
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Paid</Badge>
      case 'pending':
        return <Badge variant="warning">Pending</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="text-green-500" />
      case 'pending':
        return <Clock className="text-yellow-500" />
      default:
        return <AlertCircle className="text-gray-400" />
    }
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
            <p className="text-slate-600">Summary of payments and pending amounts</p>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 ">
        <Card className="p-6 border-gray-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-2 ">Total Amount</h3>
          <p className="text-2xl font-bold">₹{paymentData.totalAmount.toLocaleString()}</p>
        </Card>
        <Card className="p-6 border-gray-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Pending Amount</h3>
          <p className="text-2xl font-bold text-yellow-600">₹{paymentData.pendingAmount.toLocaleString()}</p>
        </Card>
        <Card className="p-6 border-gray-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Paid Amount</h3>
          <p className="text-2xl font-bold text-green-600">₹{paymentData.paidAmount.toLocaleString()}</p>
        </Card>
      </div>

      {/* Filters */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search by order or customer..."
        selects={[{
          name: 'status',
          value: statusFilter,
          onChange: setStatusFilter,
          options: [
            { value: 'all', label: 'All Status' },
            { value: 'pending', label: 'Pending' },
            { value: 'paid', label: 'Paid' }
          ]
        }]}
      />

      {/* Payment Details Table */}
      <Card className="p-6 border-gray-200">
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
              {paymentDetails
                .filter(p => (
                  p.customer.toLowerCase().includes(search.toLowerCase()) ||
                  String(p.id).includes(search) ||
                  p.orderId.toLowerCase().includes(search.toLowerCase())
                ))
                .filter(p => statusFilter === 'all' ? true : p.status === statusFilter)
                .map((payment) => (
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
