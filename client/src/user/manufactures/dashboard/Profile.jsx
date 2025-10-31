import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { User, Mail, Phone, MapPin, CreditCard, Edit, CheckCircle2, XCircle } from 'lucide-react'
import ProfileModal from './ProfileModal'

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bankDetails: '',
    upiId: '',
    role: '',
    services: []
  })
  

  // Mock data - replace with API calls
  useEffect(() => {
    setProfile({
      name: 'Ravi Patil',
      email: 'ravi.patil@example.com',
      phone: '+91 98765 43210',
      address: '123 Business Street, Mumbai, Maharashtra 400001',
      bankDetails: 'HDFC Bank, Account: ****1234',
      upiId: 'ravi.patil@upi',
      role: 'agent',
      services: ['wood', 'bricks']
    })
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleServiceChange = (service) => {
    setProfile(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }))
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleSave = () => {
    // Save profile via API
    console.log('Saving profile:', profile)
    setIsEditing(false)
    closeModal()
  }

  const handleCancel = () => {
    // Reset to original data if needed
    setIsEditing(false)
    closeModal()
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <Button onClick={openModal} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
          <Edit className="size-4 mr-2 " />
          Edit Profile
        </Button>
      </div>

      {/* Grid inspired by provided design: left profile card, right accounts and bills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile card */}
        <Card className="p-6 lg:col-span-1 border-gray-200">
          <div className="flex flex-col items-center text-center">
            <div className="w-40 h-40 rounded-xl overflow-hidden bg-slate-200 mb-4 shadow">
              <img
                src="https://i.pravatar.cc/300?img=12"
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">My profile</h3>
                <span className="text-xs text-slate-500">Last login: 07 Aug 2024 11:45</span>
              </div>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <User className="size-4 text-slate-400" />
                  <span className="text-slate-700">{profile.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="size-4 text-slate-400" />
                  <span className="text-slate-700">{profile.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-slate-400" />
                  <span className="text-slate-700">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="size-4 text-slate-400" />
                  <span className="text-slate-700">{profile.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="size-4 text-slate-400" />
                  <span className="text-slate-700">{profile.bankDetails}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="size-4 text-slate-400" />
                  <span className="text-slate-700">{profile.upiId}</span>
                </div>
              </div>
              <div className="flex justify-center pt-2">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 cursor-pointer">Save</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Right: Accounts and Bills */}
        <div className="lg:col-span-2 grid grid-cols-1 gap-6 ">
          <Card className="p-6 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">My xPay accounts</h3>
              <div className="flex items-center gap-2">
                <input type="text" placeholder="Search" className="px-3 py-2 border border-slate-300 rounded-lg text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-500">Active account</p>
                <p className="text-slate-900 font-medium">{profile.name}</p>
                <Button className="mt-3 bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 text-sm cursor-pointer">Block Account</Button>
              </div>
              <div className="p-4 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-500">Blocked account</p>
                <p className="text-slate-900 font-medium">—</p>
                <Button className="mt-3 bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm cursor-pointer">Unlock account</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">My bills</h3>
              <Button variant="secondary" className="px-3 py-1 text-sm">Filter by</Button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Phone bill', status: 'paid' },
                { name: 'Internet bill', status: 'unpaid' },
                { name: 'House rent', status: 'paid' },
                { name: 'Income tax', status: 'paid' }
              ].map((b, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-800">{b.name}</span>
                  <span className={`inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full ${b.status === 'paid' ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-700'}`}>
                    {b.status === 'paid' ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
                    {b.status === 'paid' ? 'bill paid' : 'not paid'}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <ProfileModal
        isOpen={isModalOpen}
        onClose={closeModal}
        profile={profile}
        isEditing={true}
        setProfile={setProfile}
        handleInputChange={handleInputChange}
        handleServiceChange={handleServiceChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
      />
    </div>
  )
}
