import Badge from '../../components/ui/Badge'
import { Users, TrendingUp, Award, Phone, Mail, MapPin } from 'lucide-react'
import AgentProfileModal from './AgentProfileModal'
import { useState } from 'react'


export default function AgentsPage() {
  const data = [
    { id: 'a1', name: 'Israil', referrals: 14, image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=800&auto=format&fit=crop', phone: '+91 98765 43210', email: 'ravi.patil@example.com', location: 'Mumbai, Maharashtra', joinDate: 'Jan 2024', status: 'active' },
    { id: 'a2', name: 'Kumar', referrals: 9, image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop', phone: '+91 87654 32109', email: 'neha.gupta@example.com', location: 'Kallikulam', joinDate: 'Feb 2024', status: 'active' },
    { id: 'a3', name: 'Iyyapa', referrals: 18, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop', phone: '+91 76543 21098', email: 'amit.sharma@example.com', location: 'Pothai', joinDate: 'Dec 2023', status: 'active' },
    { id: 'a4', name: 'Kanidurai', referrals: 6, image: 'https://images.unsplash.com/photo-1494790108755-2616c9d08dd5?q=80&w=800&auto=format&fit=crop', phone: '+91 65432 10987', email: 'priya.verma@example.com', location: 'Kallilulam', joinDate: 'Mar 2024', status: 'inactive' }
  ]

  const totalReferrals = data.reduce((sum, agent) => sum + agent.referrals, 0)
  const activeAgents = data.filter(agent => agent.status === 'active').length
  const topPerformer = data.reduce((prev, current) => (prev.referrals > current.referrals) ? prev : current)

  const [selectedAgent, setSelectedAgent] = useState(null)
  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Agents</h1>
            <p className="text-slate-600 mt-1 text-sm">Manage your agent network and track performance</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[{
          icon: <Users className="w-6 h-6 text-blue-600" />,
          label: 'Total Agents',
          value: data.length,
          bg: 'bg-blue-100'
        }, {
          icon: <TrendingUp className="w-6 h-6 text-green-600" />,
          label: 'Total Referrals',
          value: totalReferrals,
          bg: 'bg-green-100'
        }, {
          icon: <Award className="w-6 h-6 text-purple-600" />,
          label: 'Active Agents',
          value: activeAgents,
          bg: 'bg-purple-100'
        }].map((card, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 shadow hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.bg} shadow-inner`}>
                {card.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                <p className="text-sm text-slate-500">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Agents Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Agent Directory</h2>
          <p className="text-sm text-slate-500 mt-1">View and manage all registered agents</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {data.map((agent) => (
            <div key={agent.id} className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-all duration-300">
              {/* Agent Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <img src={agent.image} alt={agent.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow" />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${agent.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 text-lg">{agent.name}</h3>
                  <p className="text-sm text-slate-500">Joined {agent.joinDate}</p>
                  <div className="mt-2">
                    <Badge variant={agent.referrals > 10 ? 'success' : agent.referrals > 5 ? 'warning' : 'default'}>
                      {agent.referrals} referrals
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Agent Details */}
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /> {agent.phone}</div>
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> {agent.email}</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> {agent.location}</div>
              </div>

              {/* Top Performer Badge */}
              {agent.id === topPerformer.id && (
                <div className="mt-4 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-full inline-flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-600" />
                  <span className="text-yellow-800 font-medium text-sm">Top Performer</span>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => setSelectedAgent(agent)}
                className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200 shadow-md"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Render a single modal outside the grid to avoid duplicates */}
      {selectedAgent && (
        <AgentProfileModal
          agent={selectedAgent}
          topPerformer={topPerformer}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  )
}
