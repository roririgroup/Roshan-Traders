import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { User, Mail, Phone, MapPin, CreditCard, Edit, Save, X } from 'lucide-react'

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

  const profileFields = [
    {
      label: 'Full Name',
      name: 'name',
      type: 'text',
      icon: User,
      placeholder: 'Enter your full name'
    },
    {
      label: 'Email Address',
      name: 'email',
      type: 'email',
      icon: Mail,
      placeholder: 'Enter your email'
    },
    {
      label: 'Phone Number',
      name: 'phone',
      type: 'tel',
      icon: Phone,
      placeholder: 'Enter your phone number'
    },
    {
      label: 'Address',
      name: 'address',
      type: 'textarea',
      icon: MapPin,
      placeholder: 'Enter your address'
    },
    {
      label: 'Bank Details',
      name: 'bankDetails',
      type: 'text',
      icon: CreditCard,
      placeholder: 'Enter bank account details'
    },
    {
      label: 'UPI ID',
      name: 'upiId',
      type: 'text',
      icon: CreditCard,
      placeholder: 'Enter your UPI ID'
    }
  ]

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F08344] rounded-lg flex items-center justify-center">
              <User className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
              <p className="text-slate-600">Manage your personal and business information</p>
            </div>
          </div>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-[#F08344] hover:bg-[#E5672E] text-white"
            >
              <Edit className="size-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                className="bg-[#F08344] hover:bg-[#E5672E] text-white"
              >
                <Save className="size-4 mr-2" />
                Save Changes
              </Button>
              <Button
                onClick={handleCancel}
                variant="secondary"
              >
                <X className="size-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Summary - Left Side */}
        <Card className="p-6 border-gray-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="size-5 text-[#F08344]" />
              <div>
                <p className="text-sm text-slate-600">Name</p>
                <p className="font-medium text-slate-900">{profile.name || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="size-5 text-[#F08344]" />
              <div>
                <p className="text-sm text-slate-600">Email</p>
                <p className="font-medium text-slate-900">{profile.email || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="size-5 text-[#F08344]" />
              <div>
                <p className="text-sm text-slate-600">Phone</p>
                <p className="font-medium text-slate-900">{profile.phone || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="size-5 text-[#F08344]" />
              <div>
                <p className="text-sm text-slate-600">Address</p>
                <p className="font-medium text-slate-900">{profile.address || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="size-5 text-[#F08344]" />
              <div>
                <p className="text-sm text-slate-600">Bank Details</p>
                <p className="font-medium text-slate-900">{profile.bankDetails || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="size-5 text-[#F08344]" />
              <div>
                <p className="text-sm text-slate-600">UPI ID</p>
                <p className="font-medium text-slate-900">{profile.upiId || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="size-5 text-[#F08344]" />
              <div>
                <p className="text-sm text-slate-600">Role</p>
                <p className="font-medium text-slate-900 capitalize">{profile.role || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="size-5 text-[#F08344]" />
              <div>
                <p className="text-sm text-slate-600">Services</p>
                <p className="font-medium text-slate-900 capitalize">
                  {profile.services.length > 0 ? profile.services.join(', ') : 'Not set'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Form - Right Side */}
        <Card className="p-6 border-gray-200">
          <div className="space-y-6">
            {profileFields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {field.label}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <field.icon className="size-5 text-[#F08344]" />
                  </div>
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      value={profile[field.name]}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      className={`w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-[#F08344] disabled:bg-slate-50 disabled:text-slate-500 ${
                        isEditing ? 'bg-white' : 'bg-slate-50'
                      }`}
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={profile[field.name]}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-[#F08344] disabled:bg-slate-50 disabled:text-slate-500 ${
                        isEditing ? 'bg-white' : 'bg-slate-50'
                      }`}
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              </div>
            ))}

            {/* Role Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Role
              </label>
              <select
                name="role"
                value={profile.role}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F08344] focus:border-[#F08344] disabled:bg-slate-50 disabled:text-slate-500 ${
                  isEditing ? 'bg-white' : 'bg-slate-50'
                }`}
              >
                <option value="">Select Role</option>
                <option value="agent">Agent</option>
                <option value="manufactures">Manufactures</option>
              </select>
            </div>

            {/* Services Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Services
              </label>
              <div className="space-y-2">
                {['wood', 'sand', 'bricks', 'truck'].map((service) => (
                  <label key={service} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profile.services.includes(service)}
                      onChange={() => handleServiceChange(service)}
                      disabled={!isEditing}
                      className="mr-3 h-4 w-4 text-[#F08344] focus:ring-[#F08344] border-slate-300 rounded disabled:opacity-50"
                    />
                    <span className={`text-sm capitalize ${!isEditing ? 'text-slate-500' : 'text-slate-700'}`}>
                      {service}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}