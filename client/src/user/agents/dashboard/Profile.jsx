import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { User, Mail, Phone, MapPin, CreditCard, Edit, Save, X } from 'lucide-react'

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bankDetails: '',
    upiId: ''
  })

  // Mock data - replace with API calls
  useEffect(() => {
    setProfile({
      name: 'Ravi Patil',
      email: 'ravi.patil@example.com',
      phone: '+91 98765 43210',
      address: '123 Business Street, Mumbai, Maharashtra 400001',
      bankDetails: 'HDFC Bank, Account: ****1234',
      upiId: 'ravi.patil@upi'
    })
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    // Save profile via API
    console.log('Saving profile:', profile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset to original data if needed
    setIsEditing(false)
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
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
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
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Edit className="size-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white"
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

      {/* Profile Form */}
      <div className="max-w-2xl">
        <Card className="p-6">
          <div className="space-y-6">
            {profileFields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {field.label}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <field.icon className="size-5 text-slate-400" />
                  </div>
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      value={profile[field.name]}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      className={`w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 ${
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
                      className={`w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 ${
                        isEditing ? 'bg-white' : 'bg-slate-50'
                      }`}
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Profile Summary */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="size-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-600">Name</p>
                  <p className="font-medium text-slate-900">{profile.name || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-medium text-slate-900">{profile.email || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="size-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-600">Phone</p>
                  <p className="font-medium text-slate-900">{profile.phone || 'Not set'}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="size-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-600">Address</p>
                  <p className="font-medium text-slate-900">{profile.address || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="size-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-600">Bank Details</p>
                  <p className="font-medium text-slate-900">{profile.bankDetails || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="size-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-600">UPI ID</p>
                  <p className="font-medium text-slate-900">{profile.upiId || 'Not set'}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
