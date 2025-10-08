import { X, Phone, Mail, MapPin, Award } from 'lucide-react'
import Badge from '../../../components/ui/Badge'

export default function AgentProfileModal({ agent, topPerformer, onClose }) {
  if (!agent) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-md p-6 relative ">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-900"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center gap-3">
          <img
            src={agent.image}
            alt={agent.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-white shadow"
          />
          <h2 className="text-2xl font-bold text-slate-900">{agent.name}</h2>
          <p className="text-sm text-slate-500">Joined {agent.joinDate}</p>

          <div className="flex items-center gap-2 mt-2">
            <Badge variant={agent.referrals > 10 ? 'success' : agent.referrals > 5 ? 'warning' : 'default'}>
              {agent.referrals} referrals
            </Badge>
            {agent.id === topPerformer.id && (
              <Badge variant="secondary">Top Performer</Badge>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-3 text-sm text-slate-600">
          <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /> {agent.phone}</div>
          <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> {agent.email}</div>
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> {agent.location}</div>
          <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            agent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {agent.status === 'active' ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>
    </div>
  )
}
