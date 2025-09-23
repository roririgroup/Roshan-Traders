import { X } from 'lucide-react'
import { timeAgo, workDuration } from './utils'

export default function UserModal({ user, onClose }) {
  if (!user) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full relative transform animate-in zoom-in-95 duration-300 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-indigo-200 mt-1 text-sm">User Profile</p>
        </div>

        {/* Info Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'User ID', value: user.userId },
            { label: 'Email', value: user.email },
            { label: 'Phone', value: user.phone },
            { label: 'Location', value: user.organization },
            { label: 'Last Used', value: timeAgo(user.lastUsed) },
            { label: 'Work Duration', value: workDuration(user.joinedDate) },
            { label: 'Experience', value: user.experience },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <p className="text-xs uppercase tracking-wide text-gray-500">{item.label}</p>
              <p className="font-medium text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-sm flex items-center justify-between">
          <span className="text-gray-500">Profile Information</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-gray-700">Active</span>
          </span>
        </div>
      </div>
    </div>
  )
}
