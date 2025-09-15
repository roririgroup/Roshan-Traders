import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { User, Mail, Phone, MapPin, CreditCard, Edit, Save, X } from 'lucide-react'
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
        <Button onClick={openModal} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Edit className="size-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <Card className="p-6 max-w-3xl">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Full Name</h3>
            <p className="text-slate-700">{profile.name}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Email Address</h3>
            <p className="text-slate-700">{profile.email}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Phone Number</h3>
            <p className="text-slate-700">{profile.phone}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Address</h3>
            <p className="text-slate-700">{profile.address}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Bank Details</h3>
            <p className="text-slate-700">{profile.bankDetails}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">UPI ID</h3>
            <p className="text-slate-700">{profile.upiId}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Role</h3>
            <p className="text-slate-700">{profile.role}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Services</h3>
            <p className="text-slate-700">{profile.services.join(', ')}</p>
          </div>
        </div>
      </Card>

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
