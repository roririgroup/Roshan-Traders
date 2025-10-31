import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/Card'
import DeliveryDetailsModal from './DeliveryDetailsModal'

export default function DeliveriesList() {
  const [deliveries, setDeliveries] = useState([
    {
      id: 'ORD001',
      pickup: 'Warehouse A, Chennai',
      drop: 'Store B, Bangalore',
      status: 'Pending',
      product: 'Electronics',
      customer: 'ABC Corp',
      customerPhone: '+91 9876543210',
      date: '2024-06-15'
    },
    
    {
      id: 'ORD002',
      pickup: 'Factory X, Mumbai',
      drop: 'Retail Y, Delhi',
      status: 'In Transit',
      product: 'Clothing',
      customer: 'XYZ Ltd',
      customerPhone: '+91 9876543211',
      date: '2024-06-10'
    },
    {
      id: 'ORD003',
      pickup: 'Depot Z, Pune',
      drop: 'Outlet W, Hyderabad',
      status: 'Completed',
      product: 'Furniture',
      customer: 'PQR Inc',
      customerPhone: '+91 9876543212',
      date: '2024-05-20'
    }
  ])

  const [filteredDeliveries, setFilteredDeliveries] = useState(deliveries)
  const [filterMonth, setFilterMonth] = useState('')
  const [filterYear, setFilterYear] = useState('')
  const [selectedDelivery, setSelectedDelivery] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editStatusId, setEditStatusId] = useState(null)
  const [editStatusValue, setEditStatusValue] = useState('')

  useEffect(() => {
    let filtered = deliveries
    if (filterMonth) {
      filtered = filtered.filter(d => {
        const month = new Date(d.date).getMonth() + 1
        return month === parseInt(filterMonth)
      })
    }
    if (filterYear) {
      filtered = filtered.filter(d => {
        const year = new Date(d.date).getFullYear()
        return year === parseInt(filterYear)
      })
    }
    setFilteredDeliveries(filtered)
  }, [filterMonth, filterYear, deliveries])

  const handleEditClick = (id, currentStatus) => {
    setEditStatusId(id)
    setEditStatusValue(currentStatus)
  }

  const handleSaveClick = (id) => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, status: editStatusValue } : d))
    setEditStatusId(null)
    setEditStatusValue('')
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Delivery Trips</h1>
        <p className="text-slate-600">Manage your assigned deliveries</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select
          value={filterMonth}
          onChange={e => setFilterMonth(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2"
        >
          <option value="">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </select>
        <select
          value={filterYear}
          onChange={e => setFilterYear(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2"
        >
          <option value="">All Years</option>
          {[2023, 2024, 2025].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Deliveries Table */}
      <Card className="p-6">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Pickup</th>
              <th className="px-6 py-3">Drop</th>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeliveries.map(delivery => (
              <tr key={delivery.id} className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{delivery.id}</td>
                <td className="px-6 py-4 text-slate-700">{delivery.pickup}</td>
                <td className="px-6 py-4 text-slate-700">{delivery.drop}</td>
                <td className="px-6 py-4 text-slate-700">{delivery.product}</td>
                <td className="px-6 py-4">
                  {editStatusId === delivery.id ? (
                    <select
                      value={editStatusValue}
                      onChange={e => setEditStatusValue(e.target.value)}
                      className="border border-slate-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Completed">Completed</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      delivery.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      delivery.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {delivery.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editStatusId === delivery.id ? (
                    <button
                      className="text-green-600 hover:text-green-800 font-medium"
                      onClick={() => handleSaveClick(delivery.id)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="text-blue-600 hover:text-blue-800 font-medium"
                      onClick={() => {
                        setSelectedDelivery(delivery)
                        setIsModalOpen(true)
                      }}
                    >
                      View
                    </button>
                  )}
                  {editStatusId !== delivery.id && (
                    <button
                      className="ml-2 text-orange-600 hover:text-orange-800 font-medium"
                      onClick={() => handleEditClick(delivery.id, delivery.status)}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Delivery Details Modal */}
      {isModalOpen && selectedDelivery && (
        <DeliveryDetailsModal
          delivery={selectedDelivery}
          onClose={() => setIsModalOpen(false)}
          onUpdateStatus={(id, status) => {
            setDeliveries(deliveries.map(d => d.id === id ? { ...d, status } : d))
          }}
        />
      )}
    </div>
  )
}
