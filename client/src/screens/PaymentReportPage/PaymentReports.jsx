import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Calendar, ChevronDown, CreditCard, TrendingUp, DollarSign, Users } from 'lucide-react';

const PaymentReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7days');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Sample payment data
const paymentData = [
  { id: 'TXN001', customer: 'John Smith', customerType: 'Agent', amount: 1250.00, status: 'completed', date: '2024-09-19', method: 'Credit Card', reference: 'REF-2024-001' },
  { id: 'TXN002', customer: 'Sarah Johnson', customerType: 'Manufacturer', amount: 875.50, status: 'pending', date: '2024-09-18', method: 'Bank Transfer', reference: 'REF-2024-002' },
  { id: 'TXN003', customer: 'Michael Brown', customerType: 'Agent', amount: 2100.75, status: 'completed', date: '2024-09-17', method: 'PayPal', reference: 'REF-2024-003' },
  { id: 'TXN004', customer: 'Emily Davis', customerType: 'Manufacturer', amount: 450.00, status: 'failed', date: '2024-09-16', method: 'Credit Card', reference: 'REF-2024-004' },
  { id: 'TXN005', customer: 'David Wilson', customerType: 'Agent', amount: 3200.25, status: 'completed', date: '2024-09-15', method: 'Wire Transfer', reference: 'REF-2024-005' },
  { id: 'TXN006', customer: 'Lisa Anderson', customerType: 'Manufacturer', amount: 675.80, status: 'pending', date: '2024-09-14', method: 'Credit Card', reference: 'REF-2024-006' },
  { id: 'TXN007', customer: 'Robert Taylor', customerType: 'Agent', amount: 1800.00, status: 'completed', date: '2024-09-13', method: 'Bank Transfer', reference: 'REF-2024-007' },
  { id: 'TXN008', customer: 'Jennifer White', customerType: 'Manufacturer', amount: 925.40, status: 'refunded', date: '2024-09-12', method: 'PayPal', reference: 'REF-2024-008' }
];


  // Summary statistics
  const summaryStats = useMemo(() => {
    const filtered = paymentData.filter(payment => {
      const matchesSearch = payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payment.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    const totalAmount = filtered.reduce((sum, payment) => sum + payment.amount, 0);
    const completedPayments = filtered.filter(p => p.status === 'completed').length;
    const pendingPayments = filtered.filter(p => p.status === 'pending').length;

    return {
      totalAmount,
      totalTransactions: filtered.length,
      completedPayments,
      pendingPayments,
      avgTransaction: filtered.length > 0 ? totalAmount / filtered.length : 0
    };
  }, [paymentData, searchTerm, statusFilter]);

  const filteredPayments = useMemo(() => {
    return paymentData.filter(payment => {
      const matchesSearch = payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payment.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [paymentData, searchTerm, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'Credit Card': return <CreditCard className="w-4 h-4" />;
      case 'Bank Transfer': return <TrendingUp className="w-4 h-4" />;
      case 'PayPal': return <DollarSign className="w-4 h-4" />;
      case 'Wire Transfer': return <TrendingUp className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Transaction ID', 'Customer', 'Amount', 'Status', 'Date', 'Method', 'Reference'],
      ...filteredPayments.map(payment => [
        payment.id,
        payment.customer,
        payment.amount,
        payment.status,
        payment.date,
        payment.method,
        payment.reference
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payment-reports.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Reports</h1>
          <p className="text-gray-600">Monitor and analyze your payment transactions</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${summaryStats.totalAmount.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.totalTransactions}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{summaryStats.completedPayments}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Transaction</p>
                <p className="text-2xl font-bold text-gray-900">${summaryStats.avgTransaction.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search transactions or customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* Date Range */}
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                  <option value="90days">Last 90 days</option>
                  <option value="1year">Last year</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                      <div className="text-sm text-gray-500">{payment.reference}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.customer}</div>
                      <div className="text-xs text-gray-500">{payment.customerType}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">${payment.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(payment.method)}
                        <span className="text-sm text-gray-900">{payment.method}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedTransaction(payment)}
                        className="text-blue-600 hover:text-blue-900 font-medium cursor-pointer"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No transactions found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Transaction Detail Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
              
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Transaction ID</label>
                  <p className="text-sm text-gray-900">{selectedTransaction.id}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Customer</label>
                  <p className="text-sm text-gray-900">{selectedTransaction.customer}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Amount</label>
                  <p className="text-lg font-bold text-gray-900">${selectedTransaction.amount.toLocaleString()}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedTransaction.status)}`}>
                    {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Payment Method</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getPaymentMethodIcon(selectedTransaction.method)}
                    <span className="text-sm text-gray-900">{selectedTransaction.method}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Date</label>
                  <p className="text-sm text-gray-900">{new Date(selectedTransaction.date).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Reference</label>
                  <p className="text-sm text-gray-900">{selectedTransaction.reference}</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentReports;