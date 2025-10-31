import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import { Users, TrendingUp, Award, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import AddAgentsModal from './AddAgentsModal'
import EditAgentModal from './EditAgentModal'
import AgentCard from './AgentCard'

export default function AgentsPage() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editAgent, setEditAgent] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    fetchAgents();
  }, []);
  

  const fetchAgents = async () => {
    try {
      const response = await fetch('http://localhost:7700/api/agents');
      if (response.ok) {
        const data = await response.json();
        const mappedAgents = data.map(agent => ({
          id: agent.id,
          name: agent.user.name,
          referrals: agent.referrals || 0,
          image: agent.user.image || 'https://via.placeholder.com/150',
          phone: agent.user.phone,
          email: agent.user.email,
          location: agent.location,
          joinDate: new Date(agent.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          status: agent.status,
        }));
        setAgents(mappedAgents);
      } else {
        console.error('Failed to fetch agents');
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalReferrals = agents.reduce((sum, agent) => sum + agent.referrals, 0)
  const activeAgents = agents.filter(agent => agent.status === 'active').length
  const inactiveAgents = agents.filter(agent => agent.status === 'inactive').length

  const handleAddAgent = async (payload) => {
    try {
      const response = await fetch('http://localhost:7700/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        fetchAgents();
        setIsModalOpen(false);
      } else {
        console.error('Failed to add agent');
      }
    } catch (error) {
      console.error('Error adding agent:', error);
    }
  };

  const handleEditAgent = (agent) => {
    setEditAgent(agent)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async (updatedAgent) => {
    try {
      const response = await fetch(`http://localhost:7700/api/agents/${updatedAgent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAgent),
      });
      if (response.ok) {
        fetchAgents();
        setIsEditModalOpen(false);
        setEditAgent(null);
      } else {
        console.error('Failed to update agent');
      }
    } catch (error) {
      console.error('Error updating agent:', error);
    }
  };

  const handleRemoveAgent = async (id) => {
    try {
      const response = await fetch(`http://localhost:7700/api/agents/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchAgents();
      } else {
        console.error('Failed to remove agent');
      }
    } catch (error) {
      console.error('Error removing agent:', error);
    }
  };

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
