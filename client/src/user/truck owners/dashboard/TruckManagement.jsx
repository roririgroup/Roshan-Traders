import React, { useState } from 'react'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import { Edit, Trash2, Truck, Plus } from 'lucide-react'

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
  const [viewingTruck, setViewingTruck] = useState(null)
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

  const handleView = (truck) => {
    setViewingTruck(truck)
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

      {/* Trucks List as Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Truck Number</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">RC Details</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Next Service</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trucks.map((truck) => (
              <tr key={truck.id}>
                <td className="px-6 py-4 whitespace-nowrap text-center">{truck.truckNo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{truck.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{truck.capacity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{truck.rcDetails}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    truck.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {truck.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{truck.nextService}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center gap-2">
                    <Button onClick={() => handleView(truck)} variant="outline" size="sm">
                      View
                    </Button>
                    <Button onClick={() => handleEdit(truck)} variant="outline" size="sm">
                      <Edit className="size-4" />
                    </Button>
                    <Button onClick={() => handleDelete(truck.id)} variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Documents Modal */}
      <Modal isOpen={viewingTruck !== null} onClose={() => setViewingTruck(null)}>
        <h2 className="text-xl font-bold mb-4">Documents for {viewingTruck?.truckNo}</h2>
        <div className="space-y-2">
          {viewingTruck?.documents.map((doc) => (
            <div key={doc} className="flex items-center justify-between p-2 border rounded">
              <span>{doc}</span>
              <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">Uploaded</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={() => setViewingTruck(null)} variant="outline">
            Close
          </Button>
        </div>
      </Modal>

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
