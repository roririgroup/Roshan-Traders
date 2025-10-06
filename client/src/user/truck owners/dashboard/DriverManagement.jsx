import React, { useState } from 'react'
import { Card } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import { User, Plus, Edit, Upload, Star, Phone, Mail } from 'lucide-react'

export default function DriverManagement() {
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: 'Raj Kumar',
      phone: '+91 9876543210',
      email: 'raj@example.com',
      license: 'Valid',
      aadhaar: 'Uploaded',
      assignedTruck: 'TN01AB1234',
      performance: 4.5,
      tripsCompleted: 25,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Suresh Patel',
      phone: '+91 9876543211',
      email: 'suresh@example.com',
      license: 'Valid',
      aadhaar: 'Uploaded',
      assignedTruck: null,
      performance: 4.2,
      tripsCompleted: 18,
      rating: 4.5
    }
  ])

  const [trucks] = useState(['TN01AB1234', 'TN02CD5678', 'TN03EF9012'])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDriver, setEditingDriver] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    assignedTruck: '',
    licenseFile: null,
    aadhaarFile: null
  })

  const handleAdd = () => {
    setEditingDriver(null)
    setFormData({ name: '', phone: '', email: '', assignedTruck: '', licenseFile: null, aadhaarFile: null })
    setIsModalOpen(true)
  }

  const handleEdit = (driver) => {
    setEditingDriver(driver)
    setFormData({ ...driver, licenseFile: null, aadhaarFile: null })
    setIsModalOpen(true)
  }

  const handleAssign = (driverId, truckNo) => {
    setDrivers(drivers.map(driver =>
      driver.id === driverId ? { ...driver, assignedTruck: truckNo } : driver
    ))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingDriver) {
      const updatedDriver = { ...formData, id: editingDriver.id }
      if (formData.licenseFile) updatedDriver.license = 'Uploaded'
      if (formData.aadhaarFile) updatedDriver.aadhaar = 'Uploaded'
      setDrivers(drivers.map(driver => driver.id === editingDriver.id ? updatedDriver : driver))
    } else {
      setDrivers([...drivers, { ...formData, id: Date.now(), license: formData.licenseFile ? 'Uploaded' : 'Pending', aadhaar: formData.aadhaarFile ? 'Uploaded' : 'Pending', performance: 0, tripsCompleted: 0, rating: 0 }])
    }
    setIsModalOpen(false)
  }

  const [currentDriverId, setCurrentDriverId] = useState(null)

  const fileInputRefs = {
    License: React.createRef(),
    Aadhaar: React.createRef()
  }

  const handleUploadClick = (driverId, docType) => {
    setCurrentDriverId(driverId)
    if (fileInputRefs[docType] && fileInputRefs[docType].current) {
      fileInputRefs[docType].current.click()
    }
  }

  const handleFileChange = (e, docType) => {
    const file = e.target.files[0]
    if (file && currentDriverId) {
      setDrivers(drivers.map(driver =>
        driver.id === currentDriverId ? { ...driver, [docType.toLowerCase()]: 'Uploaded' } : driver
      ))
      alert(`${docType} uploaded successfully`)
    }
  }

  // Add hidden file inputs for License and Aadhaar
  // These inputs must be rendered inside the component return JSX

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#F08344] rounded-lg flex items-center justify-center">
              <User className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Driver Management</h1>
              <p className="text-slate-600">Manage drivers and assign to trucks</p>
            </div>
          </div>
          <Button onClick={handleAdd} className="bg-[#F08344] hover:bg-[#e073a]">
            <Plus className="size-4 mr-2" />
            Add Driver
          </Button>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRefs.License}
        onChange={(e) => handleFileChange(e, 'License')}
        style={{ display: 'none' }}
        accept=".pdf,.jpg,.jpeg,.png"
      />
      <input
        type="file"
        ref={fileInputRefs.Aadhaar}
        onChange={(e) => handleFileChange(e, 'Aadhaar')}
        style={{ display: 'none' }}
        accept=".pdf,.jpg,.jpeg,.png"
      />

      {/* Drivers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((driver) => (
          <Card key={driver.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{driver.name}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="size-4" />
                  {driver.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="size-4" />
                  {driver.email}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="size-4 text-yellow-500" />
                <span className="text-sm font-medium">{driver.rating}</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm"><strong>Assigned Truck:</strong> {driver.assignedTruck || 'Not Assigned'}</p>
              <p className="text-sm"><strong>Trips Completed:</strong> {driver.tripsCompleted}</p>
              <p className="text-sm"><strong>Performance:</strong> {driver.performance}/5</p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Documents:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'License', status: driver.license },
                  { name: 'Aadhaar', status: driver.aadhaar }
                ].map((doc) => (
                  <button
                    key={doc.name}
                    onClick={() => handleUploadClick(doc.name)}
                    className={`px-3 py-1 rounded text-xs flex items-center gap-1 ${
                      doc.status === 'Uploaded' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Upload className="size-3" />
                    {doc.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={driver.assignedTruck || ''}
                onChange={(e) => handleAssign(driver.id, e.target.value)}
                className="flex-1 p-2 border rounded text-sm"
              >
                <option value="">Assign Truck</option>
                {trucks.map(truck => (
                  <option key={truck} value={truck}>{truck}</option>
                ))}
              </select>
              <Button onClick={() => handleEdit(driver)} variant="outline" size="sm">
                <Edit className="size-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">{editingDriver ? 'Edit Driver' : 'Add New Driver'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Assign Truck</label>
            <select
              value={formData.assignedTruck}
              onChange={(e) => setFormData({ ...formData, assignedTruck: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Truck</option>
              {trucks.map(truck => (
                <option key={truck} value={truck}>{truck}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">License</label>
            <input
              type="file"
              onChange={(e) => setFormData({ ...formData, licenseFile: e.target.files[0] })}
              className="w-full p-2 border rounded"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Aadhaar</label>
            <input
              type="file"
              onChange={(e) => setFormData({ ...formData, aadhaarFile: e.target.files[0] })}
              className="w-full p-2 border rounded"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="bg-[#F08344] hover:bg-[#e0733a]">
              {editingDriver ? 'Update' : 'Add'} Driver
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
