import React, { useState } from 'react'
import { Card } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import { Truck, Plus, Edit, Trash2, Upload, AlertTriangle } from 'lucide-react'

export default function TruckManagement() {
  const [trucks, setTrucks] = useState([
    {
      id: 1,
      truckNo: 'TN01AB1234',
      type: 'Container Truck',
      capacity: '20 Ton',
      rcDetails: 'Valid till 2025',
      status: 'Active',
      documents: ['RC Book', 'Insurance'],
      nextService: '2024-12-15'
    },
    {
      id: 2,
      truckNo: 'TN02CD5678',
      type: 'Open Truck',
      capacity: '15 Ton',
      rcDetails: 'Valid till 2024',
      status: 'Inactive',
      documents: ['RC Book'],
      nextService: '2024-11-20'
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTruck, setEditingTruck] = useState(null)
  const [formData, setFormData] = useState({
    truckNo: '',
    type: '',
    capacity: '',
    rcDetails: '',
    status: 'Active',
    rcBookFile: null,
    insuranceFile: null,
    fitnessFile: null,
    licenseFile: null,
    aadhaarFile: null
  })

  const handleAdd = () => {
    setEditingTruck(null)
    setFormData({ truckNo: '', type: '', capacity: '', rcDetails: '', status: 'Active', rcBookFile: null, insuranceFile: null, fitnessFile: null, licenseFile: null, aadhaarFile: null })
    setIsModalOpen(true)
  }

  const handleEdit = (truck) => {
    setEditingTruck(truck)
    setFormData({ ...truck, rcBookFile: null, insuranceFile: null, fitnessFile: null, licenseFile: null, aadhaarFile: null })
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    setTrucks(trucks.filter(truck => truck.id !== id))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let newDocuments = editingTruck ? [...editingTruck.documents] : []
    if (formData.rcBookFile && !newDocuments.includes('RC Book')) newDocuments.push('RC Book')
    if (formData.insuranceFile && !newDocuments.includes('Insurance')) newDocuments.push('Insurance')
    if (formData.fitnessFile && !newDocuments.includes('Fitness Certificate')) newDocuments.push('Fitness Certificate')
    if (formData.licenseFile && !newDocuments.includes('License')) newDocuments.push('License')
    if (formData.aadhaarFile && !newDocuments.includes('Aadhaar')) newDocuments.push('Aadhaar')
    const newTruck = { ...formData, documents: newDocuments }
    if (editingTruck) {
      setTrucks(trucks.map(truck => truck.id === editingTruck.id ? { ...newTruck, id: editingTruck.id } : truck))
    } else {
      setTrucks([...trucks, { ...newTruck, id: Date.now() }])
    }
    setIsModalOpen(false)
  }

  const [currentTruckId, setCurrentTruckId] = useState(null)

  const fileInputRefs = {
    'RC Book': React.createRef(),
    Insurance: React.createRef(),
    'Fitness Certificate': React.createRef(),
    License: React.createRef(),
    Aadhaar: React.createRef()
  }

  const handleUploadClick = (truckId, docType) => {
    setCurrentTruckId(truckId)
    if (fileInputRefs[docType] && fileInputRefs[docType].current) {
      fileInputRefs[docType].current.click()
    }
  }

  const handleFileChange = (e, docType) => {
    const file = e.target.files[0]
    if (file && currentTruckId) {
      setTrucks(trucks.map(truck =>
        truck.id === currentTruckId && !truck.documents.includes(docType)
          ? { ...truck, documents: [...truck.documents, docType] }
          : truck
      ))
      alert(`${docType} uploaded successfully`)
    }
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#F08344] rounded-lg flex items-center justify-center">
              <Truck className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Truck Management</h1>
              <p className="text-slate-600">Manage your fleet of trucks</p>
            </div>
          </div>
          <Button onClick={handleAdd} className="bg-[#F08344] hover:bg-[#e0733a]">
            <Plus className="size-4 mr-2" />
            Add Truck
          </Button>
        </div>
      </div>

      {/* Trucks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trucks.map((truck) => (
          <Card key={truck.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{truck.truckNo}</h3>
                <p className="text-sm text-slate-600">{truck.type} - {truck.capacity}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                truck.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {truck.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm"><strong>RC Details:</strong> {truck.rcDetails}</p>
              <p className="text-sm"><strong>Next Service:</strong> {truck.nextService}</p>
              <div className="flex items-center gap-1">
                <AlertTriangle className="size-4 text-yellow-500" />
                <span className="text-sm text-yellow-600">Service Reminder</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Documents:</p>
              <div className="flex flex-wrap gap-2">
                {['RC Book', 'Insurance', 'Fitness Certificate', 'License', 'Aadhaar'].map((doc) => (
                  <button
                    key={doc}
                    onClick={() => handleUploadClick(truck.id, doc)}
                    className={`px-3 py-1 rounded text-xs flex items-center gap-1 ${
                      truck.documents.includes(doc) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Upload className="size-3" />
                    {doc}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => handleEdit(truck)} variant="outline" size="sm">
                <Edit className="size-4" />
              </Button>
              <Button onClick={() => handleDelete(truck.id)} variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="size-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">{editingTruck ? 'Edit Truck' : 'Add New Truck'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Truck Number</label>
              <input
                type="text"
                value={formData.truckNo}
                onChange={(e) => setFormData({ ...formData, truckNo: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Capacity</label>
              <input
                type="text"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">RC Details</label>
              <input
                type="text"
                value={formData.rcDetails}
                onChange={(e) => setFormData({ ...formData, rcDetails: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">RC Book</label>
              <input
                type="file"
                onChange={(e) => setFormData({ ...formData, rcBookFile: e.target.files[0] })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Insurance</label>
              <input
                type="file"
                onChange={(e) => setFormData({ ...formData, insuranceFile: e.target.files[0] })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fitness Certificate</label>
              <input
                type="file"
                onChange={(e) => setFormData({ ...formData, fitnessFile: e.target.files[0] })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">License</label>
              <input
                type="file"
                onChange={(e) => setFormData({ ...formData, licenseFile: e.target.files[0] })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Aadhaar</label>
              <input
                type="file"
                onChange={(e) => setFormData({ ...formData, aadhaarFile: e.target.files[0] })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="col-span-2 flex gap-2 justify-end">
            <Button type="submit" className="bg-[#F08344] hover:bg-[#e0733a]">
              {editingTruck ? 'Update' : 'Add'} Truck
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
