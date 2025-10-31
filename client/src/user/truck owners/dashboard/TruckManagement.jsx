import React, { useState, useEffect } from 'react'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import { Edit, Trash2, Truck, Plus } from 'lucide-react'
import { getCurrentUser } from '../../../lib/auth'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL = 'http://localhost:7700/api'

export default function TruckManagement() {
  const [trucks, setTrucks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        let user = getCurrentUser();
        if (!user) {
          navigate('/user/login');
          return;
        }

        // Ensure employeeId is available for truck owners
        if (!user.employeeId && user.roles.includes('truck owner')) {
          try {
            const response = await fetch(`${API_BASE_URL}/employees/by-phone`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ phone: user.phone.replace(/^\+91/, '').trim(), role: 'Truck Owner' })
            });

            if (response.ok) {
              const data = await response.json();
              user.employeeId = data.id;
              localStorage.setItem('rt_user', JSON.stringify(user));
            } else {
              throw new Error('Employee record not found');
            }
          } catch (err) {
            const errorMsg = 'Your truck owner account is not properly set up. Please contact support.';
            setError(errorMsg);
            console.error('Error fetching employee details:', err);
            return;
          }
        }

        if (!user.employeeId || !user.roles.includes('truck owner')) {
          const errorMsg = !user.employeeId
            ? 'Your truck owner account is not properly set up. Please contact support.'
            : 'Access denied. Only truck owners can view this page.';
          throw new Error(errorMsg);
        }

        const response = await fetch(`${API_BASE_URL}/truck-owners/trucks`, {
          headers: {
            'Content-Type': 'application/json',
            'X-Employee-Id': user.employeeId.toString(),
            'X-User-Roles': 'Truck Owner'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch trucks')
        }

        const data = await response.json()
        if (data.success) {
          setTrucks(data.data)
        } else {
          throw new Error(data.message || 'Failed to fetch trucks')
        }
      } catch (err) {
        setError(err.message)
        console.error('Error fetching trucks:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrucks()
  }, [])

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

  const handleDelete = async (id) => {
    try {
      let user = getCurrentUser();
      if (!user) {
        navigate('/user/login');
        return;
      }

      // Ensure employeeId is available for truck owners
      if (!user.employeeId && user.roles.includes('truck owner')) {
        try {
          const response = await fetch(`${API_BASE_URL}/employees/by-phone`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone: user.phone.replace(/^\+91/, '').trim(), role: 'Truck Owner' })
          });

            if (response.ok) {
              const data = await response.json();
              user.employeeId = data.id;
              localStorage.setItem('rt_user', JSON.stringify(user));
            } else {
              throw new Error('Employee record not found');
            }
          } catch (err) {
            throw new Error('Employee ID not found. Please contact support.');
          }
        }

        if (!user.employeeId) {
          throw new Error('Employee ID not found. Please contact support.');
        }

      const response = await fetch(`${API_BASE_URL}/truck-owners/trucks/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Employee-Id': user.employeeId.toString(),
          'X-User-Roles': 'Truck Owner'
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to delete truck')
      }

      setTrucks(trucks.filter(truck => truck.id !== id))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting truck:', err)
    }
  }

  const handleView = (truck) => {
    setViewingTruck(truck)
  }

  const validateTruckNumber = (truckNo) => {
    // Indian vehicle registration number pattern
    // Format: XX00XX0000 or XX00X0000 (where X is letter, 0 is digit)
    const pattern = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/
    return pattern.test(truckNo.toUpperCase())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate truck number
    if (!validateTruckNumber(formData.truckNo)) {
      alert('Please enter a valid vehicle registration number (e.g., TN01AB1234)')
      return
    }

    let newDocuments = editingTruck ? [...editingTruck.documents] : []
    if (formData.rcBookFile && !newDocuments.includes('RC Book')) newDocuments.push('RC Book')
    if (formData.insuranceFile && !newDocuments.includes('Insurance')) newDocuments.push('Insurance')
    if (formData.fitnessFile && !newDocuments.includes('Fitness Certificate')) newDocuments.push('Fitness Certificate')
    if (formData.licenseFile && !newDocuments.includes('License')) newDocuments.push('License')
    if (formData.aadhaarFile && !newDocuments.includes('Aadhaar')) newDocuments.push('Aadhaar')

    try {
      let user = getCurrentUser();
      if (!user) {
        navigate('/user/login');
        return;
      }

      // Ensure employeeId is available for truck owners
      if (!user.employeeId && user.roles.includes('truck owner')) {
        try {
          const response = await fetch(`${API_BASE_URL}/employees/by-phone`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone: user.phone.replace(/^\+91/, '').trim(), role: 'Truck Owner' })
          });

          if (response.ok) {
            const data = await response.json();
            user.employeeId = data.id;
            localStorage.setItem('rt_user', JSON.stringify(user));
          } else {
            throw new Error('Employee record not found');
          }
        } catch (err) {
          throw new Error('Employee ID not found. Please contact support.');
        }
      }

      if (!user.employeeId) {
        throw new Error('Employee ID not found. Please contact support.');
      }

      const truckData = {
        truckNo: formData.truckNo.toUpperCase(),
        type: formData.type,
        capacity: formData.capacity,
        rcDetails: formData.rcDetails,
        status: formData.status,
        documents: newDocuments,
        truckOwnerId: parseInt(user.employeeId)
      }

      const url = editingTruck 
        ? `${API_BASE_URL}/truck-owners/trucks/${editingTruck.id}`
        : `${API_BASE_URL}/truck-owners/trucks`

      const method = editingTruck ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Employee-Id': (user.employeeId || user.id).toString(),
          'X-User-Roles': user.role || 'Truck Owner'
        },
        body: JSON.stringify(truckData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || `Failed to ${editingTruck ? 'update' : 'create'} truck`)
      }

      const data = await response.json()
      
      if (editingTruck) {
        setTrucks(trucks.map(truck => truck.id === editingTruck.id ? data.data : truck))
      } else {
        setTrucks([...trucks, data.data])
      }
      
      setIsModalOpen(false)
      setError(null)

    } catch (err) {
      setError(err.message)
      console.error(`Error ${editingTruck ? 'updating' : 'creating'} truck:`, err)
    }
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
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center">
                  Loading trucks...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : trucks.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center">
                  No trucks found.
                </td>
              </tr>
            ) : trucks.map((truck) => (
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
                onChange={(e) => setFormData({ ...formData, truckNo: e.target.value.toUpperCase() })}
                className="w-full p-2 border rounded"
                placeholder="e.g., TN01AB1234"
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
