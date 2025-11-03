import { useState } from 'react'
import { Card } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Toggle from '../../../components/ui/Toggle'
import { User, Upload, Edit, Phone, Mail, MapPin, CheckCircle } from 'lucide-react'

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)
  const [profile, setProfile] = useState({
    name: 'Raj Kumar',
    phone: '+91 9876543210',
    email: 'raj.kumar@example.com',
    address: '45 Driver Colony, Chennai, Tamil Nadu',
    licenseNumber: 'TN0123456789',
    aadhaarNumber: '1234 5678 9012'
  })

  const [documents, setDocuments] = useState({
    license: 'Uploaded',
    aadhaar: 'Uploaded',
    photo: 'Pending'
  })
  
  

  const handleSave = () => {
    setIsEditing(false)
    // Save to API
  }

  const handleUpload = (docType) => {
    // Mock upload
    setDocuments(prev => ({ ...prev, [docType]: 'Uploaded' }))
    alert(`${docType} uploaded successfully`)
  }

  const handleAvailabilityToggle = (available) => {
    setIsAvailable(available)
    alert(`You are now ${available ? 'available' : 'not available'} for trips`)
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2 group">
          <div className="w-10 h-10 bg-[#F08344] rounded-lg flex items-center justify-center">
            <User className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
            <p className="text-slate-600">Manage your personal information and availability</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Personal Information</h2>
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              variant={isEditing ? "default" : "outline"}
              className={isEditing ? "bg-[#F08344] hover:bg-[#e0733a]" : ""}
            >
              <Edit className="size-4 mr-2" />
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p className="text-slate-900">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-slate-500" />
                  <p className="text-slate-900">{profile.phone}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-slate-500" />
                  <p className="text-slate-900">{profile.email}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              {isEditing ? (
                <textarea
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-slate-500" />
                  <p className="text-slate-900">{profile.address}</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Driver Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Driver Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">License Number</label>
              <p className="text-slate-900">{profile.licenseNumber}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Aadhaar Number</label>
              <p className="text-slate-900">{profile.aadhaarNumber}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Availability Status</label>
              <div className="flex items-center gap-3 mt-2">
                <Toggle
                  checked={isAvailable}
                  onChange={handleAvailabilityToggle}
                />
                <span className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                  {isAvailable ? 'Available for trips' : 'Not available'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Toggle your availability to accept new trip assignments
              </p>
            </div>
          </div>
        </Card>

        {/* Documents */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Documents</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Driving License', key: 'license' },
              { name: 'Aadhaar Card', key: 'aadhaar' },
              { name: 'Profile Photo', key: 'photo' }
            ].map((doc) => (
              <div key={doc.key} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-slate-900">{doc.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                    documents[doc.key] === 'Uploaded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {documents[doc.key] === 'Uploaded' && <CheckCircle className="size-3" />}
                    {documents[doc.key]}
                  </span>
                </div>
                <Button
                  onClick={() => handleUpload(doc.key)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={documents[doc.key] === 'Uploaded'}
                >
                  <Upload className="size-4 mr-2" />
                  {documents[doc.key] === 'Uploaded' ? 'Uploaded' : 'Upload'}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
