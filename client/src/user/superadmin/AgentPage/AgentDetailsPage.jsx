import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Award, TrendingUp, DollarSign, Package } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

const AgentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock agent data - in a real app, this would come from an API
  const allAgents = [
    {
      id: 'a1',
      name: 'Israil',
      referrals: 14,
      image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=800&auto=format&fit=crop',
      phone: '+91 98765 43210',
      email: 'ravi.patil@example.com',
      location: 'Mumbai, Maharashtra',
      joinDate: 'Jan 2024',
      status: 'active'
    },
    
    {
      id: 'a2',
      name: 'Kumar',
      referrals: 9,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
      phone: '+91 87654 32109',
      email: 'neha.gupta@example.com',
      location: 'Kallikulam',
      joinDate: 'Feb 2024',
      status: 'active'
    },
    {
      id: 'a3',
      name: 'Iyyapa',
      referrals: 18,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
      phone: '+91 76543 21098',
      email: 'amit.sharma@example.com',
      location: 'Pothai',
      joinDate: 'Dec 2023',
      status: 'active'
    },
    {
      id: 'a4',
      name: 'Kanidurai',
      referrals: 6,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJdjXMNs33JT-tl_JKSqpVmwOLSikdjQiNNykHlj6OyIK4XqPGNb9XC9NJnhhRXZg6Dfc&usqp=CAU',
      phone: '+91 65432 10987',
      email: 'priya.verma@example.com',
      location: 'Kallilulam',
      joinDate: 'Mar 2024',
      status: 'inactive'
    }
  ];

  // Find the specific agent based on the ID parameter
  const agent = allAgents.find(a => a.id === id);

  // If agent not found, redirect to agents list
  if (!agent) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Agent Not Found</h2>
          <p className="text-slate-600 mb-6">The requested agent could not be found.</p>
          <Button onClick={() => navigate('/agents')}>
            Back to Agents
          </Button>
        </div>
      </div>
    );
  }

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
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/agents')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Agents
        </Button>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#F08344] rounded-xl flex items-center justify-center">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Agent Details</h1>
            <p className="text-slate-600">View agent profile, orders, and transaction history</p>
          </div>
        </div>
      </div>

      {/* Agent Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="p-6">
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
  );
};

export default AgentDetailsPage;
