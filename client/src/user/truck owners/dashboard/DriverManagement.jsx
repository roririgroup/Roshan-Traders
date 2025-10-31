import React, { useState } from 'react'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import { User, Plus, Edit, Upload, Star, Phone, Mail, Trash2, Eye } from 'lucide-react'

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
      status: 'Present',
      reason: '',
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
      status: 'Present',
      reason: '',
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
    status: 'Present',
    reason: '',
    assignedTruck: '',
    licenseFile: null,
    aadhaarFile: null
  })

  const handleAdd = () => {
    setEditingDriver(null)
    setFormData({ name: '', phone: '', assignedTruck: '', licenseFile: null, aadhaarFile: null })
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

  const handleDelete = (driverId) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      setDrivers(drivers.filter(driver => driver.id !== driverId))
    }
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
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false)
  const [selectedDriverId, setSelectedDriverId] = useState(null)
  const [reason, setReason] = useState('')
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedDriverForView, setSelectedDriverForView] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState('')
  const [attendanceData, setAttendanceData] = useState([])

  const fileInputRefs = {
    License: React.createRef(),
    Aadhaar: React.createRef()
  }

  const openReasonModal = (driverId) => {
    setSelectedDriverId(driverId)
    setReason('')
    setIsReasonModalOpen(true)
  }

  const updateDriverStatus = (driverId, status, reason) => {
    setDrivers(drivers.map(d => d.id === driverId ? { ...d, status, reason } : d))
  }

  const handleReasonSubmit = (e) => {
    e.preventDefault()
    updateDriverStatus(selectedDriverId, 'Absent', reason)
    setIsReasonModalOpen(false)
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

  const handleView = (driver) => {
    setSelectedDriverForView(driver)
    setSelectedMonth('')
    setAttendanceData([])
    setIsViewModalOpen(true)
  }

  const handleMonthChange = (month) => {
    setSelectedMonth(month)
    // Mock attendance data for the selected month
    const daysInMonth = new Date(2024, parseInt(month), 0).getDate()
    const mockData = []
    for (let day = 1; day <= daysInMonth; day++) {
      const status = Math.random() > 0.1 ? 'Present' : 'Absent'
      const reason = status === 'Absent' ? ['Sick Leave', 'Emergency', 'Vacation'][Math.floor(Math.random() * 3)] : ''
      const salary = status === 'Present' ? 500 : 0
      const paid = status === 'Present' ? (Math.random() > 0.5 ? 500 : 0) : 0
      const pending = salary - paid
      mockData.push({
        date: `${month.padStart(2, '0')}/${day.toString().padStart(2, '0')}/2024`,
        status,
        reason,
        salary,
        paid,
        pending
      })
    }
    setAttendanceData(mockData)
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

      {/* Drivers List as Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Truck</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td className="px-6 py-4 whitespace-nowrap">{driver.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm text-slate-600">
                    <Phone className="size-4" />
                    {driver.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{driver.assignedTruck || 'Not Assigned'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={driver.status === 'Present'}
                      onChange={() => {
                        if (driver.status === 'Present') {
                          // Change to Absent and open reason modal
                          openReasonModal(driver.id)
                        } else {
                          // Change to Present directly
                          updateDriverStatus(driver.id, 'Present', '')
                        }
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 relative"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900">{driver.status}</span>
                  </label>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Star className="size-4 text-yellow-500" />
                    <span>{driver.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-1">
                    {[{ name: 'License', status: driver.license }, { name: 'Aadhaar', status: driver.aadhaar }].map((doc) => (
                      <button
                        key={doc.name}
                        onClick={() => handleUploadClick(driver.id, doc.name)}
                        className={`px-3 py-1 rounded text-xs flex items-center gap-1 ${
                          doc.status === 'Uploaded' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Upload className="size-3" />
                        {doc.name}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <div className="relative inline-block text-left">
                      <select
                        value={driver.assignedTruck || ''}
                        onChange={(e) => handleAssign(driver.id, e.target.value)}
                        className="appearance-none p-2 border rounded text-sm pr-6"
                      >
                        <option value="">Assign Truck</option>
                        {trucks.map(truck => (
                          <option key={truck} value={truck}>{truck}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7 10l5 5 5-5H7z"/></svg>
                      </div>
                    </div>
                    <Button onClick={() => handleView(driver)} variant="outline" size="sm">
                      <Eye className="size-4" />
                    </Button>
                    <Button onClick={() => handleEdit(driver)} variant="outline" size="sm">
                      <Edit className="size-4" />
                    </Button>
                    <Button onClick={() => handleDelete(driver.id)} variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

      {/* Reason Modal */}
      <Modal isOpen={isReasonModalOpen} onClose={() => setIsReasonModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Select Reason for Absence</h2>
        <form onSubmit={handleReasonSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Reason</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Emergency">Emergency</option>
              <option value="Vacation">Vacation</option>
              <option value="Personal Leave">Personal Leave</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="bg-[#F08344] hover:bg-[#e0733a]">
              Submit
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsReasonModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Attendance Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Attendance for {selectedDriverForView?.name}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Month</option>
              <option value="01">January</option>
              <option value="02">February</option>
              <option value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          {attendanceData.length > 0 && (
            <div className="overflow-x-auto bg-white rounded shadow max-h-96" style={{ maxWidth: '700px', margin: '0 auto' }}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Salary</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pending</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceData.map((record, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{record.date}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{record.reason || '-'}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">₹{record.salary}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">₹{record.paid}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">₹{record.pending}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
         
        </div>
      </Modal>
    </div>
  )
}
