import { useState, useEffect } from 'react'
import Badge from '../../../components/ui/Badge'
import { ShoppingCart } from 'lucide-react'
import { getOrders } from '../../../store/ordersStore'
import FilterBar from '../../../components/ui/FilterBar'

const API_BASE_URL = 'http://localhost:7700/api'

export default function Orders() {
  const [assignedOrders, setAssignedOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {

    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('rt_user'));
        const response = await fetch(`${API_BASE_URL}/truck-owners/orders`, {
          headers: {
            'Content-Type': 'application/json',
            'X-Employee-Id': (user.employeeId || user.id).toString(),
            'X-User-Roles': user.role || 'Truck Owner'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }

        const data = await response.json()
        if (data.success) {
          setAssignedOrders(data.data)
        } else {
          throw new Error(data.message || 'Failed to fetch orders')
        }
      } catch (err) {
        setError(err.message)
        console.error('Error fetching orders:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()

    setOrders(getOrders())
  }, [refreshTrigger])

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>
      case 'confirmed':
        return <Badge variant="success">Confirmed</Badge>
      case 'shipped':
        return <Badge variant="info">Shipped</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#F08344] rounded-lg flex items-center justify-center">
            <ShoppingCart className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
            <p className="text-slate-600">Manage your truck orders and track their status</p>
          </div>
        </div>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search orders..."
        selects={[{
          name: 'status',
          value: statusFilter,
          onChange: setStatusFilter,
          options: [
            { value: 'all', label: 'All Status' },
            { value: 'pending', label: 'Pending' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'shipped', label: 'Shipped' },
          ]
        }]}
      />

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-slate-900">Order ID</th>
                <th className="text-left py-4 px-6 font-medium text-slate-900">Customer</th>
                <th className="text-left py-4 px-6 font-medium text-slate-900">Items</th>
                <th className="text-left py-4 px-6 font-medium text-slate-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-slate-900">Order Date</th>
                <th className="text-left py-4 px-6 font-medium text-slate-900">Delivery Date</th>
                <th className="text-left py-4 px-6 font-medium text-slate-900">Delivery Address</th>
              </tr>
            </thead>
            <tbody>
              {orders
                .filter(o => (
                  o.customerName.toLowerCase().includes(search.toLowerCase()) ||
                  String(o.id).includes(search)
                ))
                .filter(o => statusFilter === 'all' ? true : o.status === statusFilter)
                .map((order) => (
                <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-900 hover:text-[#F08344] transition-colors">
                    #{order.id}
                  </td>
                  <td className="py-4 px-6 text-slate-900 hover:text-[#F08344] transition-colors">
                    {order.customerName}
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium text-slate-900">{item.name}</span>
                          <span className="text-slate-600"> (Qty: {item.quantity})</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="py-4 px-6 text-slate-600 hover:text-[#F08344] transition-colors">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-slate-600 hover:text-[#F08344] transition-colors">
                    {order.deliveryDate
                      ? new Date(order.deliveryDate).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="py-4 px-6 text-slate-600 max-w-xs truncate hover:text-[#F08344] transition-colors">
                    {order.deliveryAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="size-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No orders yet</h3>
          <p className="text-slate-600">Orders will appear here once you have truck orders</p>
        </div>
      )}
    </div>
  )
}
