import React, { useState } from 'react'
import { Card } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { User, Upload, Edit, Phone, Mail, MapPin } from 'lucide-react'

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'John Doe',
    phone: '+91 9876543210',
    email: 'john.doe@example.com',
    address: '123 Main St, Chennai, Tamil Nadu',
    company: 'JD Transport Services',
    gstNumber: '22AAAAA0000A1Z5',
    panNumber: 'AAAAA0000A',
    profilePhoto: null
  })

  
  const [documents, setDocuments] = useState({
    aadhaar: 'Uploaded',
    pan: 'Uploaded',
    gst: 'Uploaded',
    license: 'Pending'
  })

  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null)

  const handleSave = () => {
    setIsEditing(false)
    // Save to API
  }

  const fileInputRefs = {
    profilePhoto: React.createRef(),
    aadhaar: React.createRef(),
    pan: React.createRef(),
    gst: React.createRef(),
    license: React.createRef()
  }

  const handleUploadClick = (docType) => {
    if (fileInputRefs[docType] && fileInputRefs[docType].current) {
      fileInputRefs[docType].current.click()
    }
  }

  const handleFileChange = (e, docType) => {
    const file = e.target.files[0]
    if (file) {
      if (docType === 'profilePhoto') {
        setProfile(prev => ({ ...prev, profilePhoto: file }))
        const reader = new FileReader()
        reader.onload = (e) => setProfilePhotoPreview(e.target.result)
        reader.readAsDataURL(file)
        alert('Profile photo uploaded successfully')
      } else {
        setDocuments(prev => ({ ...prev, [docType]: 'Uploaded' }))
        alert(`${docType} uploaded successfully`)
      }
    }
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
            <p className="text-slate-600">Manage your personal and business information</p>
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRefs.profilePhoto}
        onChange={(e) => handleFileChange(e, 'profilePhoto')}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={fileInputRefs.aadhaar}
        onChange={(e) => handleFileChange(e, 'aadhaar')}
        accept="image/*,.pdf"
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={fileInputRefs.pan}
        onChange={(e) => handleFileChange(e, 'pan')}
        accept="image/*,.pdf"
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={fileInputRefs.gst}
        onChange={(e) => handleFileChange(e, 'gst')}
        accept="image/*,.pdf"
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={fileInputRefs.license}
        onChange={(e) => handleFileChange(e, 'license')}
        accept="image/*,.pdf"
        style={{ display: 'none' }}
      />

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

          {/* Profile Photo */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              {profilePhotoPreview ? (
                <img
                  src={profilePhotoPreview}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
                />
              ) : (
                <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center">
                  <User className="size-8 text-slate-500" />
                </div>
              )}
              <Button
                onClick={() => handleUploadClick('profilePhoto')}
                variant="outline"
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
              >
               <Upload className="size-4 mr-2" />
              </Button>
            </div>
            <div>
              <h3 className="font-medium text-slate-900">{profile.name}</h3>
              <p className="text-sm text-slate-500">Truck Owner</p>
            </div>
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

        {/* Business Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Business Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
              <p className="text-slate-900">{profile.company}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">GST Number</label>
              <p className="text-slate-900">{profile.gstNumber}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">PAN Number</label>
              <p className="text-slate-900">{profile.panNumber}</p>
            </div>
          </div>
        </Card>

        {/* Documents */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Documents</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Profile Photo', key: 'profilePhoto' },
              { name: 'Aadhaar', key: 'aadhaar' },
              { name: 'PAN Card', key: 'pan' },
              { name: 'GST Certificate', key: 'gst' },
              { name: 'Driving License', key: 'license' }
            ].map((doc) => (
              <div key={doc.key} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-slate-900">{doc.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    doc.key === 'profilePhoto' ? (profilePhotoPreview ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800') :
                    documents[doc.key] === 'Uploaded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doc.key === 'profilePhoto' ? (profilePhotoPreview ? 'Uploaded' : 'Pending') : documents[doc.key]}
                  </span>
                </div>
                <Button
                  onClick={() => handleUploadClick(doc.key)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={doc.key === 'profilePhoto' ? false : documents[doc.key] === 'Uploaded'}
                >
                  <Upload className="size-4 mr-2" />
                  {doc.key === 'profilePhoto' ? (profilePhotoPreview ? 'Change Photo' : 'Upload') :
                   documents[doc.key] === 'Uploaded' ? 'Uploaded' : 'Upload'}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
