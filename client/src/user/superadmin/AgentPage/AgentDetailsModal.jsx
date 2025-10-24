import React from 'react';
import { X, Mail, Phone, MapPin, Calendar, Award, TrendingUp, DollarSign, Package } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

const AgentDetailsModal = ({ agent, onClose }) => {
  if (!agent) return null;

  // Generate agent-specific data based on the found agent
  const agentDetails = {
    ...agent,
    totalEarnings: agent.referrals * 3000 + Math.floor(Math.random() * 10000) + 20000,
    rating: agent.referrals > 10 ? 4.8 : agent.referrals > 5 ? 4.2 : 3.8,
    completedOrders: agent.referrals * 8 + Math.floor(Math.random() * 20),
    activeOrders: Math.floor(agent.referrals / 2),
    skills: agent.referrals > 10 ? ['Sales', 'Customer Service', 'Negotiation', 'Product Knowledge', 'Team Leadership'] :
            agent.referrals > 5 ? ['Sales', 'Customer Service', 'Product Knowledge'] :
            ['Sales', 'Customer Service'],
    recentOrders: [
      {
        id: 'ord1',
        customer: 'Rajesh Kumar',
        product: 'Steel Pipes',
        amount: 25000 + (agent.referrals * 1000),
        status: 'completed',
        date: '2024-01-15'
      },
      {
        id: 'ord2',
        customer: 'Priya Sharma',
        product: 'Cement Bags',
        amount: 18000 + (agent.referrals * 800),
        status: agent.referrals > 10 ? 'completed' : 'in-progress',
        date: '2024-01-18'
      },
      {
        id: 'ord3',
        customer: 'Amit Patel',
        product: 'TMT Bars',
        amount: 32000 + (agent.referrals * 1200),
        status: 'completed',
        date: '2024-01-12'
      }
    ],
    transactions: [
      {
        id: 'txn1',
        type: 'Commission',
        amount: Math.floor((25000 + (agent.referrals * 1000)) * 0.1),
        date: '2024-01-15',
        description: `Commission for order #ORD001`
      },
      {
        id: 'txn2',
        type: 'Bonus',
        amount: agent.referrals > 10 ? 2000 : agent.referrals > 5 ? 1000 : 500,
        date: '2024-01-10',
        description: 'Monthly performance bonus'
      },
      {
        id: 'txn3',
        type: 'Commission',
        amount: Math.floor((32000 + (agent.referrals * 1200)) * 0.1),
        date: '2024-01-12',
        description: `Commission for order #ORD003`
      }
    ]
  };

  const handleImageError = (e) => {
    e.currentTarget.src = '/placeholder-avatar.png';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#F08344] rounded-xl flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Agent Details</h1>
                <p className="text-slate-600">View agent profile, orders, and transaction history</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Agent Profile Card */}
          <div className="bg-slate-50 rounded-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image and Basic Info */}
              <div className="flex flex-col items-center md:items-start">
                <div className="relative">
                  <img
                    src={agentDetails.image}
                    alt={`${agentDetails.name} profile`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    onError={handleImageError}
                  />
                  <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white ${
                    agentDetails.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>

                <div className="mt-4 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-slate-900">{agentDetails.name}</h2>
                  <p className="text-slate-600">Sales Agent</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={agentDetails.referrals > 10 ? 'success' : agentDetails.referrals > 5 ? 'warning' : 'default'}>
                      {agentDetails.referrals} referrals
                    </Badge>
                    <Badge variant="secondary">Top Performer</Badge>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-600">{agentDetails.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-600">{agentDetails.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-600">{agentDetails.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-600">Joined {agentDetails.joinDate}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Performance Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-600">Rating: {agentDetails.rating}/5.0</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-600">{agentDetails.completedOrders} completed orders</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-600 font-medium">Total Earnings: ₹{agentDetails.totalEarnings.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Orders and Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {agentDetails.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{order.customer}</p>
                      <p className="text-sm text-slate-600">{order.product}</p>
                      <p className="text-xs text-slate-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">₹{order.amount.toLocaleString()}</p>
                      <Badge
                        variant={order.status === 'completed' ? 'success' : 'warning'}
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Transaction History</h3>
              <div className="space-y-3">
                {agentDetails.transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{transaction.type}</p>
                      <p className="text-sm text-slate-600">{transaction.description}</p>
                      <p className="text-xs text-slate-500">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+₹{transaction.amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailsModal;
