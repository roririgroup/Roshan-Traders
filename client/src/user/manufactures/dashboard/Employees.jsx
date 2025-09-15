import { useState, useEffect } from 'react'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import { Users, UserPlus, Edit, Trash2 } from 'lucide-react'

export default function Employees() {
  const [agents, setAgents] = useState([
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh@agent.com', phone: '+91 98765 43210', role: 'agent', status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Priya Sharma', email: 'priya@agent.com', phone: '+91 98765 43211', role: 'agent', status: 'active', joinDate: '2024-02-20' },
    { id: 3, name: 'Amit Singh', email: 'amit@employee.com', phone: '+91 98765 43212', role: 'employee', status: 'active', joinDate: '2024-01-10' },
    { id: 4, name: 'Suresh Patel', email: 'suresh@employee.com', phone: '+91 98765 43213', role: 'employee', status: 'active', joinDate: '2024-03-05' },
    { id: 5, name: 'Kavita Jain', email: 'kavita@agent.com', phone: '+91 98765 43214', role: 'agent', status: 'inactive', joinDate: '2024-01-20' }
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'agent',
    status: 'active'
  })

  // Agent/Employee management functions
  const handleAddAgent = () => {
    setEditingAgent(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'agent',
      status: 'active'
    })
    setIsModalOpen(true)
  }

  const handleEditAgent = (agent) => {
    setEditingAgent(agent)
    setFormData({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      role: agent.role,
      status: agent.status
    })
    setIsModalOpen(true)
  }

  const handleDeleteAgent = (agentId) => {
    if (window.confirm('Are you sure you want to delete this agent/employee?')) {
      setAgents(agents.filter(agent => agent.id !== agentId))
    }
  }

  const handleSaveAgent = () => {
    if (editingAgent) {
      // Update existing agent
      setAgents(agents.map(agent =>
        agent.id === editingAgent.id
          ? { ...agent, ...formData }
          : agent
      ))
    } else {
      // Add new agent
      const newAgent = {
        id: Math.max(...agents.map(a => a.id)) + 1,
        ...formData,
        joinDate: new Date().toISOString().split('T')[0]
      }
      setAgents([...agents, newAgent])
    }
    setIsModalOpen(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getRoleBadge = (role) => {
    return (
      <Badge variant={role === 'agent' ? 'primary' : 'secondary'}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
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
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
            <Users className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Agents & Employees</h1>
            <p className="text-slate-600">Manage your agents and employees</p>
          </div>
        </div>
      </div>

      {/* Add Employee Button */}
      <div className="mb-6 flex justify-end">
        <Button onClick={handleAddAgent} className="bg-green-600 hover:bg-green-700">
          <UserPlus className="size-4 mr-2" />
          Add Agent/Employee
        </Button>
      </div>

      {/* Agents Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-slate-900">Name</th>
                <th className="text-left py-4 px-6 font-medium text-slate-900">Email</th>
                <th className="text-left py-4 px-6 font-medium text-slate-900">Phone</th>
                <th className="text-left py-4 px-6 font-medium text-slate-900">Role</th>
                <th className="text-left py-4 px-6 font-medium text-slate-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-slate-900">Join Date</th>
                <th className="text-left py-4 px-6 font-medium text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-900">
                    {agent.name}
                  </td>
                  <td className="py-4 px-6 text-slate-900">
                    {agent.email}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {agent.phone}
                  </td>
                  <td className="py-4 px-6">
                    {getRoleBadge(agent.role)}
                  </td>
                  <td className="py-4 px-6">
                    {getAgentStatusBadge(agent.status)}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {new Date(agent.joinDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditAgent(agent)}
                        className="bg-blue-600 hover:bg-blue-700 p-2"
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
              ))}
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAgent ? 'Edit Agent/Employee' : 'Add Agent/Employee'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="agent">Agent</option>
              <option value="employee">Employee</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSaveAgent} className="bg-blue-600 hover:bg-blue-700 flex-1">
              {editingAgent ? 'Update' : 'Add'} Agent/Employee
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
