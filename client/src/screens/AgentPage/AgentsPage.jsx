import Badge from '../../components/ui/Badge'
import { useState } from 'react'
import AgentProfileModal from './AgentProfileModal'
import { Users, TrendingUp, Award } from 'lucide-react'

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState(null)
  const data = [
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
  ]

  const totalReferrals = data.reduce((sum, agent) => sum + agent.referrals, 0)
  const activeAgents = data.filter(agent => agent.status === 'active').length

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#F08344] rounded-lg flex items-center justify-center">
            <Users className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Agents</h1>
            <p className="text-slate-600">Manage your agent network and track performance</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">{data.length}</p>
          <p className="text-sm text-slate-600">Total Agents</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">{totalReferrals}</p>
          <p className="text-sm text-slate-600">Total Referrals</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">{activeAgents}</p>
          <p className="text-sm text-slate-600">Active Agents</p>
        </div>
      </div>

      {/* Agents Table (Only List View) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Agent Directory</h2>
          <p className="text-sm text-slate-600 mt-1">View and manage all registered agents</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-slate-900">Agent</th>
                <th className="text-left py-4 px-6 font-medium text-slate-900">Contact</th>
                <th className="text-left py-4 px-6 font-medium text-slate-900">Location</th>
                <th className="text-left py-4 px-6 font-medium text-slate-900">Referrals</th>
                <th className="text-left py-4 px-6 font-medium text-slate-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((agent) => (
                <tr key={agent.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img 
                        src={agent.image} 
                        alt={agent.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-slate-900">{agent.name}</p>
                        <p className="text-sm text-slate-500">Joined {agent.joinDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-900">{agent.phone}</p>
                      <p className="text-sm text-slate-500">{agent.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{agent.location}</td>
                  <td className="py-4 px-6">
                    <Badge variant={agent.referrals > 10 ? 'success' : agent.referrals > 5 ? 'warning' : 'default'}>
                      {agent.referrals} referrals
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      agent.status === 'active' 
                        ? 'bg-[#FEF0E8] text-[#D45A2A]' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        agent.status === 'active' ? 'bg-[#F08344]' : 'bg-gray-400'
                      }`}></div>
                      {agent.status === 'active' ? 'Active' : 'Inactive'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAgent && (
        <AgentProfileModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  )
}
