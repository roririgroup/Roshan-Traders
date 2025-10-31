import { useState, useMemo } from 'react'
import { Users, Building2, Factory, UserRound } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'

const ROLE_OPTIONS = [
  { key: 'Agent', label: 'Agents', icon: UserRound },
  { key: 'Manufacturer', label: 'Manufacturers', icon: Factory },
  { key: 'Contractor', label: 'Contractors', icon: Building2 },
]


const MOCK_USERS = [
  { id: 'u1', name: 'Ravi Patil', userId: 'AGT-101', email: 'ravi@example.com', phone: '+91 98765 11101', organization: 'RP Associates', balance: 320.5, lastUsed: new Date().toISOString(), userType: 'Agent', status: 'Available' },
  { id: 'u2', name: 'Neha Gupta', userId: 'AGT-102', email: 'neha@example.com', phone: '+91 98765 11102', organization: 'NG Contracts', balance: 150.0, lastUsed: new Date().toISOString(), userType: 'Agent', status: 'On Job' },
  { id: 'u3', name: 'Sharma Cement', userId: 'MFR-201', email: 'sales@sharmacem.in', phone: '+91 98765 22201', organization: 'Pune Plant', balance: 780.75, lastUsed: new Date().toISOString(), userType: 'Manufacturer', status: 'Available' },
  { id: 'u4', name: 'Patel Steelworks', userId: 'MFR-202', email: 'contact@patelsteel.com', phone: '+91 98765 22202', organization: 'Nashik Unit', balance: 0, lastUsed: null, userType: 'Manufacturer', status: 'Unavailable' },
  { id: 'u5', name: 'Vikram Constructions', userId: 'CTR-301', email: 'vikram@constructs.in', phone: '+91 98765 33301', organization: 'Site A - Expressway', balance: 90.0, lastUsed: new Date().toISOString(), userType: 'Contractor', status: 'Available' },
  { id: 'u6', name: 'Mehta Infra', userId: 'CTR-302', email: 'info@mehtainfra.in', phone: '+91 98765 33302', organization: 'Metro Line 3', balance: 410.0, lastUsed: new Date().toISOString(), userType: 'Contractor', status: 'On Job' },
]

function timeAgo(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  const diff = Math.floor((Date.now() - date) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
  return `${Math.floor(diff/86400)}d ago`
}

export default function UsersPage() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [activeRole, setActiveRole] = useState('Agent')

  const filteredUsers = useMemo(() => {
    return users.filter(u => u.userType === activeRole)
  }, [users, activeRole])

  const handleStatusChange = (id, newStatus) => {
    setUsers(prev =>
      prev.map(u => (u.id === id ? { ...u, status: newStatus } : u))
    )
  }

  const statusButton = (user) => (
    <div className="flex gap-2 mt-3 flex-wrap">
      {['Available', 'On Job', 'Unavailable'].map(st => (
        <button
          key={st}
          onClick={() => handleStatusChange(user.id, st)}
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition
            ${user.status === st
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
        >
          {st}
        </button>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" /> Users Directory
        </h1>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {ROLE_OPTIONS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveRole(key)}
              className={`flex items-center gap-2 px-4 py-2 -mb-px border-b-2 transition font-medium
                ${activeRole === key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300'}`}
            >
              <Icon className="w-4 h-4" />
              {label}
              <Badge color="blue">
                {users.filter(u => u.userType === key).length}
              </Badge>
            </button>
          ))}
        </div>

        {/* Active Role Users */}
        <div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map(u => (
              <Card
                key={u.id}
                className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-semibold text-slate-900">{u.name}</div>
                    <div className="text-sm text-gray-500">{u.userId}</div>
                    <div className="text-sm text-gray-500">{u.email}</div>
                    <div className="text-sm text-gray-500">{u.phone}</div>
                  </div>
                  <Badge
                    color={
                      u.status === 'Available'
                        ? 'green'
                        : u.status === 'On Job'
                        ? 'amber'
                        : 'red'
                    }
                  >
                    {u.status}
                  </Badge>
                </div>

                {/* Extra Details */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="text-[11px] font-medium text-gray-500">Organization</div>
                    <div className="font-semibold text-slate-900">{u.organization}</div>
                  </div>
                  <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="text-[11px] font-medium text-gray-500">Balance</div>
                    <div className={`font-semibold ${u.balance > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      ₹ {u.balance?.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="text-[11px] font-medium text-gray-500">Last Used</div>
                    <div className="font-semibold text-slate-900">{timeAgo(u.lastUsed)}</div>
                  </div>
                </div>

                {/* Status Buttons */}
                {statusButton(u)}
              </Card>
            ))}
          </div>

          {!filteredUsers.length && (
            <div className="text-center py-16 text-gray-500">
              No {activeRole} found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
