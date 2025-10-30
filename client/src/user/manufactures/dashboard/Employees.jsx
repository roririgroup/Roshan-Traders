import React, { useState, useEffect } from 'react'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import FilterBar from '../../../components/ui/FilterBar'
import { Users, UserPlus, Edit, Trash2, Truck, User, Loader, UserCheck, Shield } from 'lucide-react'

export default function Employees() {
  const [agents, setAgents] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('agent')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    role: 'agent',
    status: 'active'
  })

  // Get manufacturer ID from localStorage or context (you'll need to implement this based on your auth system)
  const manufacturerId = 1 // Replace with actual manufacturer ID from auth context

  // Fetch employees from API
  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:7700/api/manufacturer/${manufacturerId}/employees?role=${activeTab}`)
      const result = await response.json()
      if (result.success) {
        setAgents(result.data)
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [activeTab])

  const tabs = [
    { id: 'agent', label: 'Agents', icon: User },
    { id: 'truck-owner', label: 'Truck Owners', icon: Truck },
    { id: 'driver', label: 'Drivers', icon: User },
    { id: 'loadman', label: 'Loadman', icon: Loader },
    { id: 'supervisor', label: 'Supervisor', icon: Shield }
  ]

  // Agent/Employee management functions
  const handleAddAgent = (role = activeTab) => {
    setEditingAgent(null)
    setFormData({
      name: '',
      address: '',
      phone: '',
      role: role,
      status: 'active'
    })
    setIsModalOpen(true)
  }

  const handleEditAgent = (agent) => {
    setEditingAgent(agent)
    setFormData({
      name: agent.name,
      address: agent.address,
      phone: agent.phone,
      role: agent.role,
      status: agent.status
    })
    setIsModalOpen(true)
  }

  const handleDeleteAgent = async (agentId) => {
    if (window.confirm('Are you sure you want to delete this agent/employee?')) {
      try {
        const response = await fetch(`http://localhost:7700/api/manufacturer/${manufacturerId}/employees/${agentId}`, {
          method: 'DELETE'
        })
        const result = await response.json()
        if (result.success) {
          setAgents(agents.filter(agent => agent.id !== agentId))
        } else {
          alert('Failed to delete employee')
        }
      } catch (error) {
        console.error('Error deleting employee:', error)
        alert('Error deleting employee')
      }
    }
  }

  const handleSaveAgent = async () => {
    try {
      let response
      if (editingAgent) {
        // Update existing agent
        response = await fetch(`http://localhost:7700/api/manufacturer/${manufacturerId}/employees/${editingAgent.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
      } else {
        // Add new agent
        response = await fetch(`http://localhost:7700/api/manufacturer/${manufacturerId}/employees`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
      }

      const result = await response.json()
      if (result.success) {
        if (editingAgent) {
          setAgents(agents.map(agent =>
            agent.id === editingAgent.id
              ? result.data
              : agent
          ))
        } else {
          setAgents([...agents, result.data])
        }
        setIsModalOpen(false)
        setFormData({
          name: '',
          address: '',
          phone: '',
          role: activeTab,
          status: 'active'
        })
      } else {
        alert('Failed to save employee')
      }
    } catch (error) {
      console.error('Error saving employee:', error)
      alert('Error saving employee')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getRoleBadge = (role) => {
    const roleLabels = {
      'agent': 'Agent',
      'truck-owner': 'Truck Owner',
      'driver': 'Driver',
      'loadman': 'Loadman',
      'supervisor': 'Supervisor'
    }
    return (
      <Badge variant={role === 'agent' ? 'primary' : 'secondary'}>
        {roleLabels[role] || role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    )
  }

  const getAgentStatusBadge = (status) => {
    return (
      <Badge variant={status === 'active' ? 'success' : 'danger'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#F08344] rounded-lg flex items-center justify-center">
            <Users className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
            <p className="text-slate-600">Manage your employees</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-slate-200 p-1">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#F08344] text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <IconComponent className="size-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {tabs.find(tab => tab.id === activeTab) && (
              <>
                <div className="w-8 h-8 bg-[#F08344] rounded-lg flex items-center justify-center">
                  {React.createElement(tabs.find(tab => tab.id === activeTab).icon, { className: "size-4 text-white" })}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{tabs.find(tab => tab.id === activeTab).label}</h2>
                  <p className="text-slate-600">Manage your {tabs.find(tab => tab.id === activeTab).label.toLowerCase()}</p>
                </div>
              </>
            )}
          </div>
          <Button onClick={() => handleAddAgent(activeTab)} className="bg-[#ece6e3] hover:bg-[#e0763a] cursor-pointer">
            <UserPlus className="size-4 mr-2" />
            Add {tabs.find(tab => tab.id === activeTab)?.label.slice(0, -1) || 'Employee'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search by name or address..."
        selects={[
          {
            name: 'status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]
          }
        ]}
      />

      {/* Agents Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-slate-900">Name</th>
                <th className="text-left py-4 px-6 font-medium text-slate-900">Address</th>
                <th className="text-left py-4 px-6 font-medium text-slate-900">Phone</th>
                <th className="text-left py-4 px-6 font-medium text-slate-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 px-6 text-center text-slate-500">
                    Loading employees...
                  </td>
                </tr>
              ) : agents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 px-6 text-center text-slate-500">
                    No employees found for this role.
                  </td>
                </tr>
              ) : (
                agents
                  .filter(a => (
                    a.name.toLowerCase().includes(search.toLowerCase()) ||
                    a.address.toLowerCase().includes(search.toLowerCase())
                  ))
                  .filter(a => statusFilter === 'all' ? true : a.status === statusFilter)
                  .map((agent) => (
                  <tr key={agent.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-900">
                      {agent.name}
                    </td>
                    <td className="py-4 px-6 text-slate-900">
                      {agent.address}
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {agent.phone}
                    </td>
                    <td className="py-4 px-6">
                      {getAgentStatusBadge(agent.status)}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditAgent(agent)}
                          className="bg-[#F08344] hover:bg-[#e0763a] p-2"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteAgent(agent.id)}
                          className="bg-red-600 hover:bg-red-700 p-2"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {agents.length === 0 && (
        <div className="text-center py-12">
          <Users className="size-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No agents or employees yet</h3>
          <p className="text-slate-600">Add your first agent or employee to get started</p>
        </div>
      )}

      {/* Agent Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAgent ? `Edit ${tabs.find(tab => tab.id === activeTab)?.label.slice(0, -1) || 'Employee'}` : `Add ${tabs.find(tab => tab.id === activeTab)?.label.slice(0, -1) || 'Employee'}`}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F08344]"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F08344]"
              placeholder="Enter address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F08344]"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F08344]"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSaveAgent} className="bg-[#F08344] hover:bg-[#e0763a] flex-1">
              {editingAgent ? 'Update' : 'Add'} {tabs.find(tab => tab.id === activeTab)?.label.slice(0, -1) || 'Employee'}
            </Button>
            <Button onClick={() => setIsModalOpen(false)} variant="secondary" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}