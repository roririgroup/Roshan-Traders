import { useState, useMemo } from 'react'
import { Users, Building2, Factory, UserRound } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import UserModal from './UserModal'
import { timeAgo, workDuration } from './utils'

// helpers moved to ./utils

const ROLE_OPTIONS = [
  { key: 'Agent', label: 'Agents', icon: UserRound },
  { key: 'Manufacturer', label: 'Manufacturers', icon: Factory },
  { key: 'Contractor', label: 'Contractors', icon: Building2 },
]

const MOCK_USERS = [
  // ... same data as before
]

export default function UsersPage() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [activeRole, setActiveRole] = useState('Agent')
  const [selectedUser, setSelectedUser] = useState(null)

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
          onClick={(e) => {
            e.stopPropagation()
            handleStatusChange(user.id, st)
          }}
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition
            ${user.status === st
              ? 'bg-[#F08344] text-white border-[#F08344]'
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

                {/* View Button */}
                <button
                  onClick={() => setSelectedUser(u)}
                  className="mt-4 w-full px-4 py-2 rounded-lg bg-[#F08344] text-white text-sm font-medium hover:bg-[#d97337] transition"
                >
                  View
                </button>
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

      {/* Modal */}
      <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  )
}
