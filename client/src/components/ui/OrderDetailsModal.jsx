import React from 'react'
import { X, CheckCircle, XCircle, Calendar, MapPin, User, Package } from 'lucide-react'
import Button from './Button'
import Badge from './Badge'

const OrderDetailsModal = ({
  isOpen,
  onClose,
  order,
  onConfirm,
  onReject,
  isLoading = false
}) => {
  if (!isOpen || !order) return null

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>
      case 'confirmed':
        return <Badge variant="success">Confirmed</Badge>
      case 'shipped':
        return <Badge variant="info">Shipped</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }

  const handleConfirm = () => {
    onConfirm?.(order.id)
  }

  const handleReject = () => {
    onReject?.(order.id)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Package className="size-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Order Details</h2>
              <p className="text-slate-600">Order #{order.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Status:</span>
            {getStatusBadge(order.status)}
          </div>

          {/* Customer Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <User className="size-5" />
              Customer Information
            </h3>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <p><span className="font-medium">Name:</span> {order.customerName}</p>
              {order.phoneNumber && (
                <p><span className="font-medium">Phone:</span> {order.phoneNumber}</p>
              )}
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-slate-500" />
                <span className="font-medium">Address:</span> {order.deliveryAddress}
              </p>
              {order.estimatedDeliveryDate && (
                <p className="flex items-center gap-2">
                  <Calendar className="size-4 text-slate-500" />
                  <span className="font-medium">Delivery Date:</span> {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Package className="size-5" />
              Order Items
            </h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="bg-slate-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-slate-900">{item.product?.name}</h4>
                      <p className="text-sm text-slate-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">₹{item.unitPrice}</p>
                      <p className="text-sm text-slate-600">per unit</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-slate-900">Total Amount:</span>
              <span className="text-2xl font-bold text-blue-600">₹{order.totalAmount}</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
              <Calendar className="size-4" />
              <span>Order Date: {new Date(order.orderDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Actions */}
          {(order.status === 'pending' || order.status === 'in_progress') && (
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <Button
                onClick={handleConfirm}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <CheckCircle className="size-4" />
                {isLoading ? 'Confirming...' : 'Confirm Order'}
              </Button>
              <Button
                onClick={handleReject}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <XCircle className="size-4" />
                {isLoading ? 'Rejecting...' : 'Reject Order'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsModal
