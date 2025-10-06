import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { Users, TrendingUp, Award, Plus } from 'lucide-react'
import { useState } from 'react'
import AddAgentsModal from './AddAgentsModal'
import EditAgentModal from './EditAgentModal'
import AgentCard from './AgentCard'

export default function AgentsPage() {
  const [agents, setAgents] = useState(() => {
    const savedAgents = localStorage.getItem('agents')
    if (savedAgents) {
      return JSON.parse(savedAgents)
    }
    return [
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
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editAgent, setEditAgent] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const totalReferrals = agents.reduce((sum, agent) => sum + agent.referrals, 0)
  const activeAgents = agents.filter(agent => agent.status === 'active').length
  const inactiveAgents = agents.filter(agent => agent.status === 'inactive').length

  const handleAddAgent = (newAgent) => {
    const updatedAgents = [...agents, { ...newAgent, id: `a${agents.length + 1}` }]
    setAgents(updatedAgents)
    localStorage.setItem('agents', JSON.stringify(updatedAgents))
    setIsModalOpen(false)
  }

  const handleEditAgent = (agent) => {
    setEditAgent(agent)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = (updatedAgent) => {
    const updatedAgents = agents.map((agent) =>
      agent.id === updatedAgent.id ? updatedAgent : agent
    )
    setAgents(updatedAgents)
    localStorage.setItem('agents', JSON.stringify(updatedAgents))
    setIsEditModalOpen(false)
    setEditAgent(null)
  }

  const handleRemoveAgent = (id) => {
    const updatedAgents = agents.filter((agent) => agent.id !== id)
    setAgents(updatedAgents)
    localStorage.setItem('agents', JSON.stringify(updatedAgents))
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F08344] rounded-lg flex items-center justify-center">
              <Users className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Agents</h1>
              <p className="text-slate-600">Manage your agent network and track performance</p>
            </div>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#F08344] hover:bg-[#D45A2A] text-white"
          >
            <Plus className="size-4 mr-2" />
            Add Agent
          </Button>
        </div>
      </div>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">{agents.length}</p>
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
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">{inactiveAgents}</p>
          <p className="text-sm text-slate-600">Inactive Agents</p>
        </div>
      </div>

      {/* Active Agents Section */}
<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
  <div className="p-6 border-b border-slate-200">
    <h2 className="text-lg font-semibold text-slate-900">Active Agents</h2>
    <p className="text-sm text-slate-600 mt-1">View and manage active agents</p>
  </div>

  <div className="p-6">
    <div className="space-y-4">   {/* 👈 vertical list instead of grid */}
      {agents
        .filter((agent) => agent.status === "active")
        .map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onEdit={handleEditAgent}
            onRemove={handleRemoveAgent}
          />
        ))}
    </div>
  </div>
</div>

     {/* Inactive Agents Section */}
<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
  <div className="p-6 border-b border-slate-200">
    <h2 className="text-lg font-semibold text-slate-900">Inactive Agents</h2>
    <p className="text-sm text-slate-600 mt-1">View and manage inactive agents</p>
  </div>

  <div className="p-6 space-y-4">
    {agents.filter(agent => agent.status === 'inactive').map((agent) => (
      <AgentCard
        key={agent.id}
        agent={agent}
        onEdit={handleEditAgent}
        onRemove={handleRemoveAgent}
      />
    ))}
  </div>
</div>


      {/* Add Agent Modal */}
      {isModalOpen && (
        <AddAgentsModal
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddAgent}
        />
      )}

      {/* Edit Agent Modal */}
      {isEditModalOpen && editAgent && (
        <EditAgentModal
          agent={editAgent}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  )
}
